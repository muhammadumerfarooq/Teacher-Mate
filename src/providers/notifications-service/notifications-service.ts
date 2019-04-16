
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { HomeServiceProvider } from '../home-service/home-service';
import { ProfileServiceProvider } from '../profile-service/profile-service';

/*
  Generated class for the NotificationsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


export class commentuser{
name: string;
email: string;
constructor (){
  this.name='';
  this.email = '';
}
}

export class notify {
classname: string;
classteacher: string;
feedtitle: string;
commentby: commentuser;
publisheddate: string;
seen: string;
userurl: string;
message: string;
useremail: string;
classid: string;
constructor(){
  this.classid = '';
  this.classname = '';
  this.classteacher='';
  this.feedtitle = '';
  this.commentby= new commentuser()
  this.publisheddate = '';
  this.userurl = '';
  this.useremail = '';
  this.seen = 'false';
}
}

@Injectable()
export class NotificationsServiceProvider {

  Allnotifications: AngularFirestoreCollection<notify>;
  Notifications: Array<notify>;
  
  constructor(private profileservice:ProfileServiceProvider,private afs: AngularFirestore, private localstorage:Storage, private homeservice:HomeServiceProvider) {
    
    this.localstorage.get('classteacher').then(val => {
     let teacheremail = val;
      this.localstorage.get('classroom').then(v => {
        let classname = v;

        
        this.Allnotifications = this.afs.collection<notify>('notifications', ref=>{
          return ref.where('classname','==',classname).where('classteacher','==',teacheremail).where('seen','==','false');
         });

         this.Allnotifications.snapshotChanges().forEach(snap=>{
           
           this.Notifications = new Array<notify>();
           snap.forEach(snapshot=>{
             
             if (snapshot.payload.doc.exists){
              
               let tempnotify: notify = snapshot.payload.doc.data() as notify;
               if (tempnotify.useremail != this.profileservice.useremail){// this.homeservice.userprofile.useremail){
                 this.findimgurl(tempnotify);
               this.Notifications.push(tempnotify);
              }

             }
           })
         })
      });
    });


  }

  insertnotification(notification: notify){
   

    const objectnotification= Object.assign({}, notification);
    objectnotification.commentby = Object.assign({},notification.commentby);

              

 
    
    return new Promise((resolve,reject)=>{

    this.afs.collection<notify>('notifications').doc(notification.publisheddate).set(objectnotification).then(()=>{
      return resolve('done');
    }).catch((err)=>{
      return reject(err);
    });
    
  });
  }

  updateobjectnotification(notification: notify){
    
    notification.seen = 'true';
    const objectnotification= Object.assign({}, notification);
    objectnotification.commentby = Object.assign({},notification.commentby);


    return new Promise((resolve,reject)=>{

      this.afs.collection<notify>('notifications').doc(notification.publisheddate).update(objectnotification).then(()=>{
       
        return resolve('done');
      }).catch((err)=>{
        
        return reject(err);
      });
      
    });

  }
  findimgurl(notification:notify) {
    this.profileservice.allparents.forEach(parents => {
   if ( notification.useremail==parents.useremail){
    notification.userurl = parents.imgurl; 
    return notification;
   }
   
    });

    this.profileservice.allteachers.forEach(teachers => {
      if ( notification.useremail==teachers.useremail){
        notification.userurl = teachers.imgurl; 
       return notification;
      }
      
       });
   
  }
 
}
