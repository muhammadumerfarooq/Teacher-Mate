import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { storage } from 'firebase';
import { userprofile } from '../home-service/home-service';

/*
  Generated class for the StudentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class student {
  classname: string;
  classteacher: string;
  parentemail: string;
  createdate: string;
  userurl: string;
  name: string;
  datecreation: string;
  constructor() {
    this.name = '';
    this.classteacher = '';
    this.parentemail = '';
    this.createdate = '';
    this.userurl = '';
    this.classname = '';
    this.datecreation = '';
  }
}
@Injectable()
export class StudentProvider {

  allstudents = Array<student>();

  constructor(private afs: AngularFirestore, private loaderservice: LoaderserviceProvider) {

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
 /* insertstudent(studentdata: student) {

    return new Promise((resolve, reject) => {
      const objectclass = Object.assign({}, studentdata);

      this.afs.collection('students').doc(studentdata.createdate).set({ objectclass }).then(() => {
        return resolve('done')
      }).catch(err => {
        return reject('error');
      });
    });

  }
*/
  insertstudent(studentdata: student, imguri: string) {
    debugger
    return new Promise((resolve, reject) => {


      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,

      });
      setTimeout(() => {
        this.loaderservice.loading.present().then(() => {


          const id = this.afs.createId();
          const pictures = storage().ref('profile/' + id);
          pictures.putString(imguri, 'data_url').then(() => {
            storage().ref().child('profile/' + id).getDownloadURL().then((url) => {

              studentdata.userurl = url;
              const objectclass = Object.assign({}, studentdata);



              this.afs.doc(studentdata.createdate).set(objectclass).then(() => {

                this.loaderservice.dismissloading();
                return resolve('done');
              }).catch((err) => {

                this.loaderservice.dismissloading();
                return reject('error');
              });

            });
          }).catch(err => {
            this.loaderservice.dismissloading();
            return reject('error');
          });
        }, 1000);


      });
    });

  }
}
