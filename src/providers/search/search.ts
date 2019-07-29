
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/take';
import {
  AngularFirestore,
  AngularFirestoreCollection
  // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Myfeed } from '../post/post';
import { HomeServiceProvider } from '../home-service/home-service';
/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {

  feedtitles: string[];
  constructor( public afs: AngularFirestore, private loader:LoaderserviceProvider, public afAuth: AngularFireAuth, private homeservice:HomeServiceProvider) {
    console.log('Hello SearchProvider Provider');
  }

  getfeedstitles(){
    this.feedtitles = [];

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
       duration: 500
    });
    setTimeout(() => {
    
      this.loader.loading.present().then(() => {
    this.afs.collection<Myfeed>('feeds', ref => {
      return ref.where('classid', '==', this.homeservice.classroom).where('teacheremail', '==', this.homeservice.classteacher)
    }).snapshotChanges().forEach(snap=>{
      snap.forEach(snapshot=>{
        if (snapshot.payload.doc.exists){
          let feed = snapshot.payload.doc.data() as  Myfeed;
          this.feedtitles.push(feed.title);
        }
      })
    });
  });
}, 500);
  }
 
}
