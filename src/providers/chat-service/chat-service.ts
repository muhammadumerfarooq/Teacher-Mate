import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { of } from 'rxjs';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
import { chats, userprofile, HomeServiceProvider } from '../home-service/home-service';
// import { ProfileServiceProvider } from '../profile-service/profile-service';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatServiceProvider {

  teachers: AngularFirestoreCollection<any>;
  parents: AngularFirestoreCollection<any>;
  constructor(private homeservice: HomeServiceProvider, public storage: Storage, public afauth: AngularFireAuth, public afs: AngularFirestore, public loaderservice: LoaderserviceProvider) {


    this.teachers = this.afs.collection('/teachers');
    this.parents = this.afs.collection('/parents')
    console.log('Hello ChatServiceProvider Provider');
  }

  teacherimgurl(email: string): userprofile {
    let profile: userprofile = new userprofile();

    this.homeservice.allteachers.forEach(teacher => {
      if (email == teacher.useremail) {
        profile = teacher;
        return profile;
      }
    });
    return profile;
  }

  parentimgurl(email: string): userprofile {

    let profile: userprofile = new userprofile();
    this.homeservice.allparents.forEach(parent => {
      if (email == parent.useremail) {
        profile = parent;
        return profile;
      }
    });
    return profile;
  }
  // Observable<any[]>
  getall(chatusers: chats[]) {
    //  console.log('in chat service')
    return new Promise((resolve, reject) => {


      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
        duration: 1500
      });
      let friends: Array<any>[] = [];
      this.loaderservice.loading.present().then(res => {
        setTimeout(() => {
          /*
       
         this.storage.get('user').then((val) => {
           if (val == 'parent'){ 
       console.log(val, chatusers);
       
             this.loaderservice.loading.present().then(res=> {
               setTimeout(() => {
       
         this.teachers.snapshotChanges().forEach(snap=>{
           if (snap.length>0){
           snap.forEach(snapshot=>{
             
             
             chatusers.forEach(element => {
              if( element.useremail == snapshot.payload.doc.id){
       
             
               let teacherprofile: userprofile  = new userprofile();
               teacherprofile = this.teacherimgurl(snapshot.payload.doc.id);
       
               let data={
                 id: snapshot.payload.doc.id,
                 user: 'teacher',
                 userurl:teacherprofile.imgurl
               };
               friends.push(data);
               
              }
             });
           
           });
         }
         });
       this.loaderservice.loading.dismiss();
       }, 1500 );
       return (of(friends));
       });
           }else if (val == 'teacher'){
               this.loaderservice.loading.present().then(res=> {
               setTimeout(() => {
                 
         this.teachers.snapshotChanges().forEach(snap=>{
           if (snap.length>0){
           snap.forEach(snapshot=>{
             
             
             chatusers.forEach(element => {
              if( element.useremail == snapshot.payload.doc.id && element.useremail != this.afauth.auth.currentUser.email ){
              
               let teacherprofile: userprofile  = new userprofile();
               teacherprofile = this.teacherimgurl(snapshot.payload.doc.id);
               let data={
                 id: snapshot.payload.doc.id,
                 user: 'teacher',
                 userurl: teacherprofile.imgurl
               };
               friends.push(data);
               
              }
             });
           
           });
         }
         });
         */

          // console.log('res')
          if (this.homeservice.user == "parents") {


            let teachersize = this.parents.get.length;

            this.teachers.get().forEach(snap => {
              friends = [];
              teachersize = snap.docs.length;

              snap.forEach(snapshot => {
                console.log(snapshot.id, chatusers)

                chatusers.forEach(element => {
                  if (element.useremail == snapshot.id) {

                    let teacherprofile: userprofile = new userprofile();
                    teacherprofile = this.teacherimgurl(snapshot.id);

                    let data: any = {
                      id: snapshot.id,
                      user: 'teacher',
                      userurl: teacherprofile.imgurl,
                      username:teacherprofile.username
                    };
                    if (data.id != this.homeservice.useremail) {
                      friends.push(data);

                    }
                    //   size --;
                  }
                });
                teachersize--;
                if (teachersize == 0) {
                  return resolve((friends))
    
                }
              });
            })
          
          }

          else if (this.homeservice.user == "teachers") {

            let parentsize = this.parents.get.length;
            let teachersize = this.teachers.get.length;

            this.teachers.get().forEach(snap => {
              friends = [];
              teachersize = snap.docs.length;

              snap.forEach(snapshot => {


                console.log(snapshot.id, chatusers)
                chatusers.forEach(element => {

                  if (element.useremail == snapshot.id) {

                    let teacherprofile: userprofile = new userprofile();
                    teacherprofile = this.teacherimgurl(snapshot.id);

                    let data: any = {
                      id: snapshot.id,
                      user: 'teacher',
                      userurl: teacherprofile.imgurl,
                      username:teacherprofile.username
                    };
                    friends.push(data);
                    //   size --;
                  }
                });
                teachersize--;

              });
              //  return resolve((friends))
            })

            this.parents.get().forEach(snap => {
              friends = [];
              //console.log(this.parents.get.length)
              //console.log(snap.docs.length)
              parentsize = snap.docs.length;

              snap.forEach(snapshot => {
                console.log(snapshot.id, chatusers)
                chatusers.forEach(element => {

                  if (element.useremail == snapshot.id) {

                    let parentprofile: userprofile = new userprofile();
                    parentprofile = this.parentimgurl(snapshot.id);

                    let data: any = {
                      id: snapshot.id,
                      user: 'parent',
                      userurl: parentprofile.imgurl,
                      username:parentprofile.username
                    };
                    if (this.homeservice.useremail != data.id) {
                      friends.push(data);
                    }

                    //   size --;
                  }
                });
                parentsize--;
if (parentsize == 0){
  return resolve((friends))

}
              });
              // return resolve((friends))
            })

            
          }


          // console.log('async')

          //   this.loaderservice.loading.dismiss();

        }, 1200);

        //   return new Promise((friends));
      })
      console.log('friends');


    });
  }




}
