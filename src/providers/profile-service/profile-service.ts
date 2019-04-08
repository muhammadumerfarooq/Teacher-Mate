import { Injectable } from '@angular/core';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { storage } from 'firebase';
import { userprofile } from '../home-service/home-service';


export class profile {
  username: string;
  user: string;
  imgurl: string;
  constructor() {
    this.user = '';
    this.username = '';
    this.imgurl = '';
  }
}
/*
  Generated class for the ProfileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileServiceProvider {

  username: string = '';
  useremail: string = '';
  useroccupation: string = '';
  user: string = '';
  allparents = Array<userprofile>();
  allteachers = Array<userprofile>();
  

  constructor(private afs: AngularFirestore, private loaderservice: LoaderserviceProvider, private storage: Storage) {
    this.storage.get('email').then(val => {
      this.useremail = val;


      this.storage.get('user').then(occ => {
        this.useroccupation = occ;
        if (occ == 'parent') {
          this.user = 'parents';
        } else {
          this.user = 'teacher';
        }

        this.afs.doc<profile>(this.user + "/" + this.useremail).snapshotChanges().take(1).forEach(snap => {
          if (snap.payload.exists) {
            let userinfo: profile = snap.payload.data();
            this.username = userinfo.username;
          }
        });

        this.afs.collection<userprofile>('parents').snapshotChanges().forEach(snap=>{
          snap.forEach(snapshot=>{
            this.allparents = new Array<userprofile>();

            if (snapshot.payload.doc.exists){
              let parent = new userprofile();
              parent = snapshot.payload.doc.data() as userprofile;
              let userprof : userprofile = new userprofile();
              userprof.imgurl = parent.imgurl;
              userprof.username = parent.username;
              userprof.user = parent.user;
              userprof.useremail = snapshot.payload.doc.id;
              
              this.allparents.push(userprof);
            }
          })
        })

        this.afs.collection<userprofile>('teachers').snapshotChanges().forEach(snap=>{
          snap.forEach(snapshot=>{
            this.allteachers = new Array<userprofile>();

            if (snapshot.payload.doc.exists){
              let teacher = new userprofile();
              teacher = snapshot.payload.doc.data() as userprofile;
              let userprof : userprofile = new userprofile();
              userprof.imgurl = teacher.imgurl;
              userprof.username = teacher.username;
              userprof.user = teacher.user;
              userprof.useremail = snapshot.payload.doc.id;
              
              this.allteachers.push(userprof);
            }
          })
        })
      });
    
    });

    
 }
  getprofile(docid, email) {
    this.user = docid;
    this.useremail = email;
    
    return new Promise((resolve, reject) => {
      this.afs.doc<profile>(this.user + "/" + this.useremail).snapshotChanges().forEach(snap => {
    
        if (snap.payload.exists) {
          let userinfo: profile = snap.payload.data();
          return resolve(userinfo);
        } else {
          return  reject(null);
        }
      });
    });

  }

  editprofile(user: string, email, imguri) {
    
    return new Promise((resolve, reject) => {
      
      this.afs.doc(user + "/" + email).snapshotChanges().take(1).forEach(snap => {
        
        if (snap.payload.exists) {
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
                storage().ref().child('profile/' + id).getDownloadURL().then( (url) =>{
                  
                  let updateprofile = new profile();
                  updateprofile = snap.payload.data() as profile;
                  updateprofile.imgurl = url;
                  let docid = user + "/" + email;
                  
                  this.afs.doc(docid).update(updateprofile).then(() => {
              
                    this.loaderservice.dismissloading();
                    return resolve('done');
                  }).catch((err) => {
                    
                    this.loaderservice.dismissloading();
                    return reject('error');
                  });
                }).catch((err) => {
                  
                  console.log(err)
                  this.loaderservice.dismissloading();
                  return reject('error');
                });
              });
            }).catch(err => {
              this.loaderservice.dismissloading();
              return reject('error');
            });
          }, 1000);

        } else {

          return reject('error');
        }
      });
    });

  }
}
