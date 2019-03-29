import { Injectable } from '@angular/core';
import {
  AngularFirestore,
   AngularFirestoreCollection
 // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
/*
  Generated class for the ClassServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClassServiceProvider {
classname: string;
classteacher:string;

  constructor(private afs:AngularFirestore, private storage:Storage) {
    this.storage.get("classroom").then(val=>{
      this.classname = val;
    }).catch(err=>{

    })
    this.storage.get("classteacher").then(val=>{
      this.classteacher = val;
    }).catch(err=>{
      
    })
  }

}
