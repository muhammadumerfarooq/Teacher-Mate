

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { HomeServiceProvider } from '../home-service/home-service';
// import { ProfileServiceProvider } from '../profile-service/profile-service';
import { Injectable } from '@angular/core';
import { notify } from '../notifications-service/notifications-service';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';



@Injectable()
export class RequestServiceProvider {

  AllRequests: Array<notify>;
  constructor(private loaderservice:LoaderserviceProvider,private afs: AngularFirestore, private localstorage:Storage, private homeservice:HomeServiceProvider) {
    
    this.AllRequests = new Array<notify>();

    this.afs.collection<notify>('notifications',ref=>{
      return ref.where('useremail', '==',homeservice.useremail).where('message','==',' requested to add in classroom ').where('seen' ,'==', 'false');
    });
  }

  findrequest(){
    return new Promise((resolve,reject)=>{
      
    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
      duration: 1000
    });
    setTimeout(() => {
      this.loaderservice.loading.present().then(() => {
    
    this.afs.collection<notify>('notifications',ref=>{
      return ref.where('useremail', '==',this.homeservice.useremail).where('message','==',' requested to add in classroom ').where('seen' ,'==', 'false');
    }).snapshotChanges().forEach(snap=>{
     
      if (snap.length == 0){
        return reject('error');
      }
      snap.forEach(snapshot=>{
        
        if (snapshot.payload.doc.exists){
       //   this.loaderservice.dismissloading();
          return resolve('found');
        }else{
          return reject('error');
        }
      })
    });

  });
},500);


})
  }

 
}
