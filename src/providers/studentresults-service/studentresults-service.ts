import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { HomeServiceProvider } from '../home-service/home-service';
// import { ProfileServiceProvider } from '../profile-service/profile-service';
import { Injectable } from '@angular/core';
import { notify } from '../notifications-service/notifications-service';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { StudentmarksServiceProvider } from '../studentmarks-service/studentmarks-service';

/*
  Generated class for the StudentresultsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class classresult {
  classname: string;
  classteacher: string;
  useremail:string;
  creationdate: string;
  results: Array<results>;
  constructor() {
    this.useremail = '';
    this.results = new Array<results>();
    this.classname = '';
    this.classteacher = '';
    this.creationdate = new Date().getTime().toString();
  }
}

export class results {
  resultname: string;
  totalweightage: number;
  obtainedweightage: number;
  resulttypes: Array<resulttype>;
  constructor() {
    this.resulttypes = new Array<resulttype>();
    this.resultname = '';
    this.totalweightage = 0.0;
    this.obtainedweightage = 0.0;
  }
}

export class resulttype {
  resultadded:boolean;

  resultname: string;
  totalmarks: number;
  obtainedmarks: number;
  weightage: number;
  constructor() {
    this.resultadded = false;

    this.resultname = "";
    this.totalmarks = 0;
    this.obtainedmarks = 0;
    this.weightage = 0.0;
  }
}


@Injectable()
export class StudentresultsServiceProvider {
  classresults: classresult;
  constructor(private loaderservice: LoaderserviceProvider, private studentprovider:StudentmarksServiceProvider,private afs: AngularFirestore, private homeservice:HomeServiceProvider) {
    console.log('Hello StudentresultsServiceProvider Provider');
    this.classresults = new classresult();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async get_results() {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 500
    });
    this.presentLoading(loading);


    return new Promise((resolve, reject) => {
try{
      this.afs.collection('classresults',ref=>{
        return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher);
      }).snapshotChanges().take(1).forEach(snap => {
        this.classresults = new classresult();
        if (snap.length==0){
          return reject('error');
        }
        snap.forEach(snapshot => {
      
          if (snapshot.payload.doc.exists) {
            let classres = snapshot.payload.doc.data() as classresult;
            this.classresults.classname = classres.classname;
            this.classresults.classteacher = classres.classteacher;
            this.classresults.creationdate = classres.creationdate;
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
                restype.resultadded =  classres.results[i].resulttypes[j].resultadded;
                result.resulttypes.push(restype);
                j++;
              }
              this.classresults.results.push(result);
              i++;
            }
            return resolve('true');
          }else{
            return reject('false');
          }
        })
      })}
      catch(err){
reject('false');
      }

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

          this.afs.collection<results>('classresults').doc(myclassresult.creationdate).set(myresult).then((res) => {

            console.log(res);

            //   this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            //  this.loaderservice.dismissloading();
            reject('error');
          });

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

          this.afs.collection<results>('classresults').doc(myclassresult.creationdate).update(myresult).then((res) => {

            console.log(res);

            //   this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            //  this.loaderservice.dismissloading();
            reject('error');
          });

        });
      }, 500);

    });
  }

 update_all(){
  this.get_results().then(res=>{

  }).catch(err=>{

  })
 }

}
