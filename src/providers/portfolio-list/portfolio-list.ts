import { Injectable } from '@angular/core';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { AngularFirestore } from 'angularfire2/firestore';
import { HomeServiceProvider } from '../home-service/home-service';
import { portfolio, portfoliotype } from '../portfolio-service/portfolio-service';

export class myfolio {
  description: string;
  classname:string;
  classteacher:string;
  useremail:string;
  portfolio: portfolio;
  creationdate: string;
  foliolist:Array<foliodescribe>;
  constructor() {
    this.description = '';
    this.foliolist = new Array<foliodescribe>();
    this.portfolio = new portfolio();
    this.creationdate = new Date().getTime().toString();

  }
}
export class foliodescribe {
  typename: string;
  description: string;
  currentvalue: number;
  constructor() {

    this.typename = '';
    this.description = '';
    this.currentvalue = 0;
  }
}
/*
  Generated class for the PortfolioListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PortfolioListProvider {

  foliolist: Array<myfolio>;
  foliolists: Array<myfolio>;
  
  constructor(private loaderservice:LoaderserviceProvider, private afs:AngularFirestore, 
    private homeservice:HomeServiceProvider) {
    this.foliolist = new Array<myfolio>();
    this.foliolists = new Array<myfolio>();

    console.log('Hello PortfolioServiceProvider Provider');
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async insert_foliollist(portfolio:myfolio) {
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

      myfolio.portfolio =  Object.assign({}, portfolio.portfolio); 
      for (let i = 0; i < portfolio.portfolio.foliotypes.length; i++) {
        myfolio.portfolio.foliotypes[i] = Object.assign({}, portfolio.portfolio.foliotypes[i]);

      }

      for (let i = 0; i < portfolio.foliolist.length; i++) {
        myfolio.foliolist[i] = Object.assign({},  portfolio.foliolist[i]);
      }
      
      this.afs.collection('foliolist').doc(portfolio.creationdate).set(myfolio).then(()=>{
        resolve('done');
      }).catch((err)=>{
        return reject(err);
      })
    });
    
  }


  
  async delete_foliollist(portfolio:myfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{

      this.afs.collection('foliolist').doc(portfolio.creationdate).delete().then(()=>{
        resolve('done');
      }).catch((err)=>{
        return reject('error');
      })
    });
    
  }

  
  async update_foliollist(portfolio:myfolio) {
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

      for (let i = 0; i < portfolio.portfolio.foliotypes.length; i++) {
        myfolio.portfolio.foliotypes[i] = Object.assign({}, portfolio.portfolio.foliotypes[i]);

      }

      for (let i = 0; i < portfolio.foliolist.length; i++) {
        myfolio.foliolist[i] = Object.assign({},  portfolio.foliolist[i]);
      }
      
      this.afs.collection('foliolist').doc(portfolio.creationdate).update(myfolio).then(()=>{
        resolve('done');
      }).catch((err)=>{
        return reject('error');
      })
    });
    
  }

  
  async get_foliollist(parentemail) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{
    this.afs.collection('foliolist', ref=>{
      return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher).where('useremail','==',parentemail);
    }).get().take(1).forEach(snap=>{
      this.foliolist = new Array<myfolio>();
      if (snap.docs.length==0){
        return reject('error');
      }
      let length = snap.docs.length ;
      snap.forEach(snapshot=>{

        if (snapshot.exists){
          let temp = snapshot.data() as myfolio;
          let folio = new myfolio();
          folio.classname = temp.classname;
          folio.classteacher = temp.classteacher;
          folio.useremail = temp.useremail;
          folio.creationdate = temp.creationdate;
          
          let index = 0;
          while(index<temp.portfolio.foliotypes.length){
            let porttype = new portfoliotype();
            porttype.background = temp.portfolio.foliotypes[index].background;
            porttype.name = temp.portfolio.foliotypes[index].name;
            porttype.percent = temp.portfolio.foliotypes[index].percent;
            folio.portfolio.foliotypes.push(porttype);
            index++;
          }


          index = 0;
          while(index<temp.foliolist.length){
            let foliodesc = new foliodescribe();
            foliodesc.currentvalue = temp.foliolist[index].currentvalue;
            foliodesc.description = temp.foliolist[index].description;
            foliodesc.typename = temp.foliolist[index].typename;
            folio.foliolist.push(foliodesc);
            index++;
          }
          this.foliolist.push(folio);
          length --;
          if (length == 0){
          return resolve('done');
          }
        }else{
          return reject('error');
        }
      })
    })  
    });
    
  }

  
  async get_foliollists() {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve,reject)=>{
    this.afs.collection('foliolist', ref=>{
      return ref.where('classname','==',this.homeservice.classroom).where('classteacher','==',this.homeservice.classteacher);
    }).get().take(1).forEach(snap=>{
      this.foliolists = new Array<myfolio>();
      length =  snap.docs.length;
      if (snap.docs.length==0){
        return reject('error');
      }
      snap.forEach(snapshot=>{
        this.foliolists = new Array<myfolio>();

        if (snapshot.exists){
          let temp = snapshot.data() as myfolio;
          let folio = new myfolio();
          folio.classname = temp.classname;
          folio.classteacher = temp.classteacher;
          folio.useremail = temp.useremail;
          folio.creationdate = temp.creationdate;
          
          let index = 0;
          while(index<temp.portfolio.foliotypes.length){
            let porttype = new portfoliotype();
            porttype.background = temp.portfolio.foliotypes[index].background;
            porttype.name = temp.portfolio.foliotypes[index].name;
            porttype.percent = temp.portfolio.foliotypes[index].percent;
            folio.portfolio.foliotypes.push(porttype);
            index++;
          }


          index = 0;
          while(index<temp.foliolist.length){
            let foliodesc = new foliodescribe();
            foliodesc.currentvalue = temp.foliolist[index].currentvalue;
            foliodesc.description = temp.foliolist[index].description;
            foliodesc.typename = temp.foliolist[index].typename;
            folio.foliolist.push(foliodesc);
            index++;
          }
          this.foliolists.push(folio);
          length --;
         
          if (length==0)
          {
            return resolve('done');
          }
        }else{
          return reject('error');
        }
      })
    })  
    });
    
  }
}
