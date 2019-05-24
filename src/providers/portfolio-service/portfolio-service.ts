import { Injectable } from '@angular/core';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { AngularFirestore } from 'angularfire2/firestore';
import { HomeServiceProvider } from '../home-service/home-service';

/*
  Generated class for the PortfolioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class portfolio{
creationdate:string;
classname:string;
classteacher:string;
useremail: string;
foliotypes: Array<portfoliotype>; 

constructor(){
  this.classname = '';
  this.classteacher = '';
  this.useremail = '';
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
  constructor(private loaderservice:LoaderserviceProvider, private afs:AngularFirestore, private homeservice:HomeServiceProvider) {
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
      this.afs.collection('classportfolios').doc(portfolio.creationdate).set(myfolio).then(()=>{
        resolve('done');
      }).catch((err)=>{
        return reject('error');
      })
    });
    
  }


  
  async delete_folio(portfolio:portfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{

      this.afs.collection('classportfolios').doc(portfolio.creationdate).delete().then(()=>{
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
      this.afs.collection('classportfolios').doc(portfolio.creationdate).update(myfolio).then(()=>{
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
    this.afs.collection('classportfolios', ref=>{
      return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher);
    }).get().take(1).forEach(snap=>{
      this.portfolios = new portfolio();
      if (snap.docs.length==0){
        return reject('error');
      }
      snap.forEach(snapshot=>{

        if (snapshot.exists){
          let temp = snapshot.data() as portfolio;
          this.portfolios.classname = temp.classname;
          this.portfolios.classteacher = temp.classteacher;
          this.portfolios.useremail = temp.useremail;
          this.portfolios.creationdate = temp.creationdate;
          
          let index = 0;
          while (temp.foliotypes[index]!=undefined && temp.foliotypes!=null){
            let porttype = new portfoliotype();
            porttype.background = temp.foliotypes[index].background;
            porttype.name = temp.foliotypes[index].name;
            porttype.percent = temp.foliotypes[index].percent;
            this.portfolios.foliotypes.push(porttype);
            index++;
          }

          return resolve('done');
          
        }else{
          return reject('error');
        }
      })
    })  
    });
    
  }
}
