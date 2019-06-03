import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { storage } from 'firebase';
import { HomeServiceProvider } from '../home-service/home-service';
import { profile } from '../profile-service/profile-service';

/*
  Generated class for the StudentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class student {
  classname: string;
  classteacher: string;
  parentemail: string;
 
  userurl: string;
  name: string;
  datecreation: string;
  constructor() {
    this.name = '';
    this.classteacher = '';
    this.parentemail = '';

    this.userurl = '';
    this.classname = '';
    this.datecreation = '';
  }
}
@Injectable()
export class StudentProvider {

  allstudents = Array<student>();
  class_students= Array<student>();
  parentchild = new student();
  constructor(private homeservice:HomeServiceProvider,private afs: AngularFirestore, private loaderservice: LoaderserviceProvider) {
    this.parentchild = new student();

    this.afs.collection('students').snapshotChanges().forEach(snap => {
      this.allstudents = new Array<student>();

      snap.forEach(snapshot => {
        if (snapshot.payload.doc.exists) {
          let studentdata: student = snapshot.payload.doc.data() as student;
          this.allstudents.push(studentdata);
        }
      })
    });


  }
  getspecificstudent(){
    return new Promise((resolve, reject) => {


      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,
duration: 1000
      });
        this.loaderservice.loading.present().then(() => {
        
       
    this.afs.collection('students', ref=>{
     return ref.where('classname','==',this.homeservice.classroom).where('parentemail','==',this.homeservice.useremail).where('classteacher','==',this.homeservice.classteacher);
    }).snapshotChanges().take(1).forEach(snap => {
//      this.allstudents = new Array<student>();
        this.class_students = new Array<student>();
        if (snap.length == 0){
          return reject('error');
        }
      snap.forEach(snapshot => {
        if (snapshot.payload.doc.exists) {
          let studentdata: student = snapshot.payload.doc.data() as student;
          this.parentchild = studentdata;
          return resolve('done');
        }else{
          return reject('error');
        }
      })
    });
  });

});
 
  }
  getstudents(){

    return new Promise((resolve, reject) => {


      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,
duration: 500
      });
        this.loaderservice.loading.present().then(() => {
        
       
    this.afs.collection('students', ref=>{
     return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher);
    }).snapshotChanges().take(1).forEach(snap => {
//      this.allstudents = new Array<student>();
        this.class_students = new Array<student>();
        let length = snap.length;
      snap.forEach(snapshot => {
        if (snapshot.payload.doc.exists) {
          let studentdata: student = snapshot.payload.doc.data() as student;
          this.class_students.push(studentdata);
          length--;
          if(length==0){
            resolve('done');
          }
        }else{
          reject('error');
        }
      })
    });
  });

});


  }
  insertstudent(studentdata: student) {
    
    return new Promise((resolve, reject) => {


      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,

      });
      setTimeout(() => {
        this.loaderservice.loading.present().then(() => {

try{
              studentdata.userurl = '';
              const objectclass = Object.assign({}, studentdata);
              studentdata.datecreation = new Date().getTime().toString();
              this.afs.collection('students', ref=>{
                return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher).where('parentemail','==',studentdata.parentemail)
              }).snapshotChanges().take(1).forEach(snap=>{
                if (snap.length==0){
                  
                  this.afs.collection('students').doc(studentdata.datecreation).set(objectclass).then(() => {

                    this.loaderservice.dismissloading();
                    return resolve('done');
                  }).catch((err) => {
                    
                    this.loaderservice.dismissloading();
                    return reject('error');
                  });
                }
                snap.forEach(snapshot=>{
                  if (snapshot.payload.doc.exists){
                    let profile = snapshot.payload.doc.data() as student; 
                    objectclass.datecreation = profile.datecreation;
                    if (profile.name == objectclass.name){
                      return resolve('exists');
                    }else{

                      

                    this.afs.collection('students').doc(studentdata.datecreation).set(objectclass).then(() => {

                      this.loaderservice.dismissloading();
                      return resolve('done');
                    }).catch((err) => {
                      
                      this.loaderservice.dismissloading();
                      return reject('error');
                    });
                  }

                  }else{
                    this.afs.collection('students').doc(studentdata.datecreation).set(objectclass).then(() => {

                      this.loaderservice.dismissloading();
                      return resolve('done');
                    }).catch((err) => {
                      
                      this.loaderservice.dismissloading();
                      return reject('error');
                    });
                  }
                })
              })

              

           
        }
        catch(err){
          this.loaderservice.dismissloading();
          return reject('error');
        }
        }, 1000);


      });
    });

  }

  insertstudent_img(studentdata: student, imguri: string) {
    
    return new Promise((resolve, reject) => {


      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,

      });
      setTimeout(() => {
        this.loaderservice.loading.present().then(() => {

try{
          const id = this.afs.createId();
          const pictures = storage().ref('profile/' + id);
          
          pictures.putString(imguri, 'data_url').then(() => {
            storage().ref().child('profile/' + id).getDownloadURL().then((url) => {

              studentdata.userurl = url;
              const objectclass = Object.assign({}, studentdata);

              this.afs.collection('students', ref=>{
                return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher).where('parentemail','==',studentdata.parentemail)
              }).snapshotChanges().take(1).forEach(snap=>{
                if (snap.length==0){
                  this.afs.collection('students').doc(studentdata.datecreation).set(objectclass).then(() => {

                    this.loaderservice.dismissloading();
                    return resolve('done');
                  }).catch((err) => {
                    
                    this.loaderservice.dismissloading();
                    return reject('error');
                  });
                }
                snap.forEach(snapshot=>{
                  if (snapshot.payload.doc.exists){
                    return resolve('exists');
                   /* let profile = snapshot.payload.doc.data() as student; 
                    objectclass.datecreation = profile.datecreation;
                    this.afs.collection('students').doc(profile.datecreation).set(objectclass).then(() => {

                      this.loaderservice.dismissloading();
                      return resolve('updated');
                    }).catch((err) => {
                      
                      this.loaderservice.dismissloading();
                      return reject('error');
                    });
                    */
                  }else{
                    this.afs.collection('students').doc(studentdata.datecreation).set(objectclass).then(() => {

                      this.loaderservice.dismissloading();
                      return resolve('done');
                    }).catch((err) => {
                      
                      this.loaderservice.dismissloading();
                      return reject('error');
                    });
                  }
                })
              })

              

            }).catch(err=>{
              
              this.loaderservice.dismissloading();
              return reject('error');
            });
          }).catch(err => {
            
            this.loaderservice.dismissloading();
            return reject('error');
          });
        }
        catch(err){
          this.loaderservice.dismissloading();
          return reject('error');
        }
        }, 1000);


      });
    });

  }
}
