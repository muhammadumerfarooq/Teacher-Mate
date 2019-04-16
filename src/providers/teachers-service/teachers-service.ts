import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { teacher } from '../../models/teacher';
import { classroom } from '../home-service/home-service';

/*
  Generated class for the TeachersServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeachersServiceProvider {
  teacherclass: Array<classroom>;
  constructor(private afs: AngularFirestore) {
    this.teacherclass = new Array<classroom>();

    this.afs.collection<classroom>('classroom').snapshotChanges().forEach(snap => {
      this.teacherclass = new Array<classroom>();

      snap.forEach(snapshot => {
        if (snapshot.payload.doc.exists) {
          let classdate = snapshot.payload.doc.data() as classroom;
          this.teacherclass.push(classdate)
        }
      })
    })
  }

}
