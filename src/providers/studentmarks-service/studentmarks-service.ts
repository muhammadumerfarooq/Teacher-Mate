import { Injectable } from '@angular/core';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { AngularFirestore } from 'angularfire2/firestore';
import { classresult, results, resulttype } from '../studentresults-service/studentresults-service';
import { HomeServiceProvider } from '../home-service/home-service';

/*
  Generated class for the StudentmarksServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudentmarksServiceProvider {

  studentresults: classresult;
  studentallresults: Array<classresult>;

  constructor(private loaderservice: LoaderserviceProvider, private afs: AngularFirestore, private homersevice:HomeServiceProvider) {
    console.log('Hello StudentmarksServiceProvider Provider');
    this.studentresults = new classresult();
    this.studentallresults = new Array<classresult>();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async get_results(parenteamil:string) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 500
    });
    this.presentLoading(loading);


    return new Promise((resolve, reject) => {

      this.afs.collection('studentresults', ref=>{
       return ref.where('classname','==',this.homersevice.classroom).where('classteacher','==',this.homersevice.classteacher).where('useremail','==',parenteamil);
      }).snapshotChanges().take(1).forEach(snap => {
        this.studentresults = new classresult();
        if (snap.length == 0) {
          return reject('error');
        }
        snap.forEach(snapshot => {

          if (snapshot.payload.doc.exists) {
            let classres = snapshot.payload.doc.data() as classresult;
            this.studentresults.classname = classres.classname;
            this.studentresults.classteacher = classres.classteacher;
            this.studentresults.creationdate = classres.creationdate;

            let i = 0;
            while (classres.results[i] != undefined) {
              let result: results = new results();
              result.obtainedweightage = classres.results[i].obtainedweightage;
              result.totalweightage = classres.results[i].totalweightage;
              result.resultname = classres.results[i].resultname;

              let j = 0;
              while (classres.results[i].resulttypes[j] != undefined) {
                let restype: resulttype = new resulttype();
                restype.obtainedmarks = classres.results[i].resulttypes[j].obtainedmarks;
                restype.resultname = classres.results[i].resulttypes[j].resultname;
                restype.totalmarks = classres.results[i].resulttypes[j].totalmarks;
                restype.weightage = classres.results[i].resulttypes[j].weightage;
                restype.resultadded = classres.results[i].resulttypes[j].resultadded;

                result.resulttypes.push(restype);
                j++;
              }
              this.studentresults.results.push(result);
              i++;
            }
            return resolve('true');
          } else {
            return reject('false');
          }
        })
      })

    });
  }


  

  async deletestudentresults() {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 500
    });
    this.presentLoading(loading);


    return new Promise((resolve, reject) => {

      this.afs.collection('studentresults', ref=>{
       return ref.where('classname','==',this.homersevice.classroom).where('classteacher','==',this.homersevice.classteacher);
      }).get().take(1).forEach(snap => {
        if (snap.empty) {
          return reject('error');
        }
        let length = snap.docs.length;
        this.studentallresults = new Array<classresult>();
        snap.forEach(snapshot => {

          snapshot.ref.delete();
          length--;
          if (length==0){
            return resolve('done');
          }
          })
      })

    });
  }


  async get_allresults() {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);


    return new Promise((resolve, reject) => {

      this.afs.collection('studentresults', ref=>{
       return ref.where('classname','==',this.homersevice.classroom).where('classteacher','==',this.homersevice.classteacher);
      }).snapshotChanges().take(1).forEach(snap => {
        this.studentallresults = new Array<classresult>();
        if (snap.length == 0) {
          return reject('error');
        }
        let length = snap.length;

        snap.forEach(snapshot => {

          if (snapshot.payload.doc.exists) {
            let classres = snapshot.payload.doc.data() as classresult;
            let myclassresult: classresult = new classresult();
            myclassresult.classname = classres.classname;
            myclassresult.classteacher = classres.classteacher;
            myclassresult.creationdate = classres.creationdate;

            let i = 0;
            while (classres.results[i] != undefined) {
              let result: results = new results();
              result.obtainedweightage = classres.results[i].obtainedweightage;
              result.totalweightage = classres.results[i].totalweightage;
              result.resultname = classres.results[i].resultname;

              let j = 0;
              while (classres.results[i].resulttypes[j] != undefined) {
                let restype: resulttype = new resulttype();
                restype.obtainedmarks = classres.results[i].resulttypes[j].obtainedmarks;
                restype.resultname = classres.results[i].resulttypes[j].resultname;
                restype.totalmarks = classres.results[i].resulttypes[j].totalmarks;
                restype.weightage = classres.results[i].resulttypes[j].weightage;
                restype.resultadded = classres.results[i].resulttypes[j].resultadded;

                result.resulttypes.push(restype);
                j++;
              }
              myclassresult.results.push(result);
              i++;
            }
          length--;
          if (length==0){
            return resolve('done');
          }
          this.studentallresults.push(myclassresult);
          } else {
            return reject('false');
          }
        })
      })

    });
  }
  insert_results(myclassresult: classresult) {


    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
        duration: 1000
      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {
          const myresult = Object.assign({}, myclassresult);

          for (let i = 0; i < myclassresult.results.length; i++) {
            myresult.results[i] = Object.assign({}, myclassresult.results[i]);

            //            myresult.results[i].resulttypes = Object.assign({}, myclassresult.results[i].resulttypes);

            for (let j = 0; j < myclassresult.results[i].resulttypes.length; j++) {
              myresult.results[i].resulttypes[j] = Object.assign({}, myclassresult.results[i].resulttypes[j]);

            }
          }
try{
          this.afs.collection<results>('studentresults').doc(myclassresult.creationdate).set(myresult).then((res) => {

            console.log(res);

            //   this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            //  this.loaderservice.dismissloading();
            reject('error');
          });
        }catch(err){reject(err)}

        });
      }, 500);

    });
  }


  update_results(myclassresult: classresult) {


    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
        duration: 1000
      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {
          const myresult = Object.assign({}, myclassresult);

          for (let i = 0; i < myclassresult.results.length; i++) {
            myresult.results[i] = Object.assign({}, myclassresult.results[i]);

            //            myresult.results[i].resulttypes = Object.assign({}, myclassresult.results[i].resulttypes);

            for (let j = 0; j < myclassresult.results[i].resulttypes.length; j++) {
              myresult.results[i].resulttypes[j] = Object.assign({}, myclassresult.results[i].resulttypes[j]);

            }
          }
try{
          this.afs.collection<results>('studentresults').doc(myclassresult.creationdate).update(myresult).then((res) => {

            console.log(res);

            //   this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            //  this.loaderservice.dismissloading();
            reject('error');
          });
        }catch(err){
          reject(err);
        }
        });
      }, 500);

    });
  }
}
