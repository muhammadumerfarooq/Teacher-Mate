// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/take';
import {
  AngularFirestore,
   AngularFirestoreCollection
 // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
import { ProfileServiceProvider, profile } from '../profile-service/profile-service';


/*
  Generated class for the HomeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class userprofile{
  username: string;
  user: string;
  imgurl: string;
  useremail: string;
  constructor(){
    this.user = '';
    this.username = '';
    this.imgurl = '';
    this.useremail = '';
  }
}
export class chats{
  useremail: string;
  user: string
}
export class classroom {
        teacheremail: string;
        classname: string;
        section: string;
        subject: string;
        parentsemail: Array<string>
        imgurl: string;
        backgroundimg: string;
}
@Injectable()
export class HomeServiceProvider {
  chatusers : Array<chats> = [];
  classroomdoc: AngularFirestoreCollection<classroom>;


  homeclass: Array<any>= [];
  home: Array<any>= [];
  myclassroom: Array<classroom> = [];
  
  classfound: boolean = false;
  userprofile = new userprofile();
  searchname: string = "";

  constructor(private profileservice:ProfileServiceProvider,public storage:Storage,public afs: AngularFirestore, public afAuth:AngularFireAuth, public loaderservice:LoaderserviceProvider, public alertCtrl:AlertController) {
  
    

  this.afAuth.auth.onAuthStateChanged(user=>{
if ( user!=undefined){


  this.storage.get('user').then((val) => {
    
    if (val == 'parent') {
      this.searchname = 'parent';
      this.classroomdoc = this.afs.collection<classroom>('classroom'
      , ref=> {
        return ref.where("parentsemail", "array-contains",user.email); //.orderBy("teacheremail");
      });
     // console.log('in user');
      this.classroomdoc.valueChanges().subscribe(snap=>{
        this.myclassroom = new Array<classroom>();
        snap.forEach(snapshot=>{
          
          console.log(snapshot);
          this.classfound = true;
          let myposts: classroom = snapshot;
          
          if (myposts.parentsemail.length == undefined || myposts.parentsemail.length == 0) {
            myposts.parentsemail = new Array<string>();
          }

          this.myclassroom.push(snapshot);
          });
        });
    } else if(val == 'teacher')  {
      this.searchname = 'teacher';
      this.classroomdoc = this.afs.collection<classroom>('classroom'
      , ref=> {
        return ref.where("teacheremail", "==",user.email); //.orderBy("teacheremail");
      });
     // console.log('in user');
      this.classroomdoc.valueChanges().subscribe(snap=>{
        this.myclassroom = new Array<classroom>();
        snap.forEach(snapshot=>{
          console.log(snapshot);
          this.classfound = true;
          let myposts: classroom = snapshot;
          
          if (myposts.parentsemail.length == undefined || myposts.parentsemail.length == 0) {
            myposts.parentsemail = new Array<string>();
          }

          this.myclassroom.push(myposts);
          });
        });
    }else{
    
    }

  }).catch((err) => {
    console.log(err)
  });

  this.storage.get('email').then(val=>{
    let useremail = val; 
    let user = '';
     
    this.storage.get('user').then(occ=>{
      
      if (occ=='parent'){
        user = 'parents';
      }else{
        user = 'teachers';
      }
      
     /* this.profileservice.getprofile(user , useremail ).then(res =>{
        if (res != 'error'){
          debugger
          let tempprofile = new profile();
          tempprofile = res as profile;
          this.userprofile.imgurl = tempprofile.imgurl;
          this.userprofile.username = tempprofile.username;
          this.userprofile.user = tempprofile.user;
          this.userprofile.useremail = useremail;
        }
      }).catch(err=>{

      });
      */
     this.afs.doc<profile>(user+"/"+useremail).snapshotChanges().forEach(snap=>{
       if (snap.payload.exists){
           let tempprofile = new profile();
           tempprofile = snap.payload.data() as profile;
           this.userprofile.imgurl = tempprofile.imgurl;
           this.userprofile.username = tempprofile.username;
           this.userprofile.user = tempprofile.user;
           this.userprofile.useremail = useremail;
       }
     })
    });
    });
    }
  });  
  
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

    addclassroom(teacherclass) {

      return new Promise((resolve, reject) => {
      let id = this.afs.createId();
    
    
      let tempclass = new classroom();
      tempclass.teacheremail = teacherclass.email;
      tempclass.parentsemail = [];
      tempclass.section = teacherclass.section;
      tempclass.subject = teacherclass.subject;
      tempclass.classname = teacherclass.classname;
      tempclass.imgurl = this.userprofile.imgurl;
      tempclass.backgroundimg = teacherclass.backgroundimg;

try{

  const objectclass = Object.assign({}, tempclass);
  objectclass.parentsemail = Object.assign({},tempclass.parentsemail);


      this.afs.collection<classroom>('classroom').doc(id).set(objectclass
      ).then(res=>{
        
        resolve('done');
      
      }).catch(err=>{
        
        console.log(err);
            
        reject('error');  
      });
    }catch(e){
      
      reject('error');
    }
    });
   
  }
  findclassroom(docid: string){
    return new Promise((resolve, reject) => {
     // let id = this.afs.createId();

       this.afs.doc<classroom>('classroom/'+docid).get().take(1).subscribe(ref=>{
         if (ref.exists) {
           
           
          console.log(ref.data());
          
          var data: any = ref.data();
          console.log(data);
        

          if (data.parentsemail != undefined || data.parentsemail !=null ){
            let index = data.parentsemail.indexOf(this.afAuth.auth.currentUser.email);
            console.log(index);
           if (index<0){
            this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
      
              content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,
        
            });
            setTimeout(() => {
              
            this.loaderservice.loading.present().then(()=>{
              
            data.parentsemail.push(this.afAuth.auth.currentUser.email)

            let updatedclass = new classroom();
            updatedclass.teacheremail = data.email;
            updatedclass.parentsemail = [];
            updatedclass.section = data.section;
            updatedclass.subject = data.subject;
            updatedclass.classname = data.classname;
            updatedclass.imgurl = this.userprofile.imgurl;
            updatedclass.backgroundimg = data.backgrounimg;

            this.afs.doc<classroom>('classroom/'+docid).update(updatedclass
            ).then(()=>{
                resolve('join')
                this.loaderservice.dismissloading();
            }).catch((err)=>{
              console.log(err);
              reject('error')
              this.loaderservice.dismissloading();
            });

          }).catch((err)=>{
          console.log(err);
          reject('error')
          this.loaderservice.dismissloading();
        }) 
      }, 500);
           }

          }else{
            this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
      
              content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,
        
            });
            setTimeout(() => {
            
            this.loaderservice.loading.present().then(()=>{
            
              let parentsemail: Array<string> = [];
              parentsemail.push(this.afAuth.auth.currentUser.email);
             
              data.parentsemail = parentsemail;
            
            try{

              let updatedclass = new classroom();
              updatedclass.teacheremail = data.email;
              updatedclass.parentsemail = [];
              updatedclass.section = data.section;
              updatedclass.subject = data.subject;
              updatedclass.classname = data.classname;
              updatedclass.imgurl = this.userprofile.imgurl;
              updatedclass.backgroundimg = data.backgrounimg;

              
            this.afs.doc<classroom>('classroom/'+docid).update(updatedclass).then(()=>{
            
              resolve('join')
                this.loaderservice.dismissloading();
            }).catch(()=>{
            
              reject('error')
              this.loaderservice.dismissloading();
            });}
            catch(e){
              console.log(e);
              
            }
  
        }).catch(()=>{
          reject('error')
          this.loaderservice.dismissloading();
        }) 
      }, 500);
           }
          
         }else{
           
          reject('notfound');
         }
       });
    });
  }
  
  getchatusers(classname: string, teacheremail: string){
debugger
    this.chatusers = [];

    this.myclassroom.forEach(element => {
      debugger
      if (element.classname == classname && element.teacheremail == teacheremail){
        
        element.parentsemail.forEach(ele => {
          let val : chats = {
            useremail: ele,
            user: 'parent'
          };
          this.chatusers.push(val);
        });
        
      }
      let val : chats = {
        useremail: element.teacheremail,
        user: 'teacher'
      };
      this.chatusers.push(val);
    });
  }

}
