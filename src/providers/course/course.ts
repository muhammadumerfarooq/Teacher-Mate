import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
   AngularFirestoreCollection
 // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
import { ClassServiceProvider } from '../class-service/class-service';

/*
  Generated class for the CourseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class Topics {
  value:string;
   subtopics: Array<Subtopics>;
   constructor(){
     this.subtopics = new Array<Subtopics>();
   }
 }
 export class Subtopics{
   value:string;
   constructor(){
     this.value = '';
   }
 }
 export class Courses {
  Chapters:Array<Chapters>;
   constructor(){
     this.Chapters = new Array<Chapters>();
   }
 }

 export class Chapters{
  value:string;
  Topics: Array<Topics>;
  constructor(){
    this.value = '';
    this.Topics = new Array<Topics>();
  }
  }

@Injectable()
export class CourseProvider {
  
  allcourses: Array<Courses> = [];

  constructor(private afs:AngularFirestore, private classervice: ClassServiceProvider) {
   this.afs.collection<Courses>('courses').snapshotChanges().forEach(snap=>{
     this.allcourses = new Array<Courses>(); 

     snap.forEach(snapshot=>{
       if (snapshot.payload.doc.exists){
          this.allcourses.push(snapshot.payload.doc.data() as Courses);
       }
     })
   })
  }

  insert_course(course: Courses){
    
  }

}
