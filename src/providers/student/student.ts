import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the StudentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class student {
classname:string;
classteacher: string;
parentemail: string;
createdate: string;
}
@Injectable()
export class StudentProvider {
  
  allstudents = Array<student>();
  
  constructor(private afs:AngularFirestore) {
  
  this.afs.collection('students').snapshotChanges().forEach(snap=>{
    this.allstudents = new Array<student>();

    snap.forEach(snapshot=>{
      if (snapshot.payload.doc.exists){
        let studentdata : student = snapshot.payload.doc.data() as student;
        this.allstudents.push(studentdata);
      }
    })
  });

    
  }
  insertstudent(studentdata:student){
      this.afs.collection('students')
  }
}
