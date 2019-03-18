import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { AngularFireAuth } from 'angularfire2/auth';
import { snapshotChanges } from 'angularfire2/database';
import { profile } from '../profile-service/profile-service';

/*
  Generated class for the SignupServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SignupServiceProvider {
  parentDoc: AngularFirestoreDocument<profile>;
  teacherDoc: AngularFirestoreDocument<profile>;
  constructor(public afs: AngularFirestore, public loaderservice: LoaderserviceProvider) {
    console.log('Hello SignupServiceProvider Provider');

  }

  parentsignup(parentemail: string, parentname: string) {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

          content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box"> Creating Account </div>
          </div>`,

        });
        this.loaderservice.loading.present().then(res => {
          
          let parentprofile = new profile();
          parentprofile.username = parentname;
          parentprofile.user = 'parent';
          parentprofile.imgurl = '';

          this.parentDoc = this.afs.doc('/parents/' + parentemail);
          this.parentDoc.ref.get().then(
            res => {
              if (res.exists) {
                this.loaderservice.loading.dismiss();
                resolve('done');
              } else {
                this.afs.doc<profile>('/parents/' + parentemail).set(Object.assign({},parentprofile)).then(res => {
                  this.loaderservice.loading.dismiss();
                  resolve('done');
                }).catch(error => {
                  this.loaderservice.loading.dismiss();
                  reject(error);
                });

              }
            }).catch(err => {
              this.afs.doc<profile>('/parents/' + parentemail).set(Object.assign({},parentprofile)).then(res => {
                this.loaderservice.loading.dismiss();
                resolve('done');
              }).catch(error => {
                this.loaderservice.loading.dismiss();
                reject(error);
              });

            })

        });

      }, 1000);
    });
    return promise;
  }


  teachersignup(teacheremail: string, teachername: string) {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

          content: `
         <div class="custom-spinner-container">
           <div class="custom-spinner-box"> Creating Account </div>
         </div>`,

        });
        this.loaderservice.loading.present().then(res => {
          let teacherprofile = new profile();
          teacherprofile.imgurl = '';
          teacherprofile.username = teachername;
          teacherprofile.user = 'teacher';

          this.teacherDoc = this.afs.doc<profile>('/teachers/' + teacheremail);
          this.teacherDoc.ref.get().then(
            res => {
              
              if (res.exists) {
                this.loaderservice.loading.dismiss();
                resolve('done');
              } else {
                this.afs.doc<profile>('/teachers/' + teacheremail).set(Object.assign({},teacherprofile)).then(res => {
                  this.loaderservice.loading.dismiss();
                  resolve('done');
                }).catch(error => {
                  
                  this.loaderservice.dismissloading();//.loading.dismiss();
                  reject(error);
                });

              }
            }).catch(err => {
              this.afs.doc<profile>('/teachers/' + teacheremail).set(Object.assign({},teacherprofile)).then(res => {
                this.loaderservice.loading.dismiss();
                resolve('done');
              }).catch(error => {
                this.loaderservice.loading.dismiss();
                reject(error);
              });

            })

        });

      }, 1000);
    });
    return promise;
  }
}


