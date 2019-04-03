import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { of } from 'rxjs';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
import { chats, userprofile } from '../home-service/home-service';
import { ProfileServiceProvider } from '../profile-service/profile-service';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatServiceProvider {

  teachers: AngularFirestoreCollection<any>; 
  parents: AngularFirestoreCollection<any>;
  constructor(private profileservice:ProfileServiceProvider,public storage:Storage,public afauth:AngularFireAuth, public afs: AngularFirestore, public loaderservice:LoaderserviceProvider) {

    
    this.teachers =  this.afs.collection('/teachers');
    this.parents = this.afs.collection('/parents')
    console.log('Hello ChatServiceProvider Provider');
  }

  teacherimgurl(email:string): userprofile {
    let profile: userprofile = new userprofile();

    this.profileservice.allteachers.forEach(teacher=>{
      if (email == teacher.useremail){
        profile = teacher;
        return profile;
      }
    });
    return profile;
  }

  parentimgurl(email:string): userprofile {
    
    let profile: userprofile = new userprofile();
    this.profileservice.allparents.forEach(parent=>{
      if (email == parent.useremail){
        profile = parent;
        return profile;
      }
    });
    return profile;
  }
  getall(chatusers: chats[]): Observable<any[]> {
  //  console.log('in chat service')
  
  this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
          
    content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,

  });
  let friends: Array<any> = [];
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
 // console.log('res')
    this.parents.snapshotChanges().forEach(snap=>{
      snap.forEach(snapshot=>{
       console.log(snapshot.payload.doc.id, chatusers)
       chatusers.forEach(element => {
        if( element.useremail == snapshot.payload.doc.id ){
        
          let parentprofile: userprofile  = new userprofile();
          parentprofile = this.parentimgurl(snapshot.payload.doc.id);
        
         let data={
           id: snapshot.payload.doc.id,
           user: 'parent',
           userurl: parentprofile.imgurl
         };
         friends.push(data);
         
        }
       });
        
      });  
})

// console.log('async')

this.loaderservice.loading.dismiss();
}, 1500 );
return (of(friends));
})
    }
  });
    
 console.log('friends');
return (of(friends));

}

  
}
