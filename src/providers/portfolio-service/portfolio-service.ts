import { Injectable } from '@angular/core';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the PortfolioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class portfolio{
creationdate:string;
foliotypes: Array<portfoliotype>; 

constructor(){
this.creationdate = new Date().getTime().toString();
this.foliotypes = new Array<portfoliotype>();
}

}

export class portfoliotype{
percent:number;
name:string;
background:string;
constructor(){
  this.background = '';
  this.name =  '';
  this.percent = 0;
}
}

@Injectable()
export class PortfolioServiceProvider {
portfolios: portfolio;
  constructor(private loaderservice:LoaderserviceProvider, private afs:AngularFirestore) {
    this.portfolios = new portfolio();
    console.log('Hello PortfolioServiceProvider Provider');
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async insert_folio(portfolio:portfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{
      portfolio.creationdate = new Date().getTime().toString();
      const myfolio = Object.assign({}, portfolio);

      for (let i = 0; i < portfolio.foliotypes.length; i++) {
        myfolio.foliotypes[i] = Object.assign({}, portfolio.foliotypes[i]);

      
      }
      this.afs.collection('portfolio').doc(portfolio.creationdate).set(myfolio).then(()=>{
        resolve('done');
      }).catch((err)=>{
        return reject('error');
      })
    });
    
  }

  async update_folio(portfolio:portfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{
      const myfolio = Object.assign({}, portfolio);

      for (let i = 0; i < portfolio.foliotypes.length; i++) {
        myfolio.foliotypes[i] = Object.assign({}, portfolio.foliotypes[i]);

      
      }
      this.afs.collection('portfolio').doc(portfolio.creationdate).update(myfolio).then(()=>{
        resolve('done');
      }).catch((err)=>{
        return reject('error');
      })
    });
    
  }
  async get_folio() {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{
    this.afs.collection('portfolio').stateChanges().take(1).forEach(snap=>{
      snap.forEach(snapshot=>{
        if (snapshot.payload.doc.exists){
          this.portfolios = new portfolio();
          this.portfolios = snapshot.payload.doc.data() as portfolio;
          return resolve('done');
          
        }else{
          return reject('error');
        }
      })
    })  
    });
    
  }
}
