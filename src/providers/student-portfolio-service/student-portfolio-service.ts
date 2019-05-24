import { Injectable } from '@angular/core';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { portfolio, portfoliotype } from '../portfolio-service/portfolio-service';
import { AngularFirestore } from 'angularfire2/firestore';
import { HomeServiceProvider } from '../home-service/home-service';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the StudentPortfolioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudentPortfolioServiceProvider {
  portfolios: portfolio;

  constructor(private loaderservice: LoaderserviceProvider, private afs: AngularFirestore,
    private homeservice: HomeServiceProvider) {
    this.portfolios = new portfolio();
    console.log('Hello PortfolioServiceProvider Provider');
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async insert_folio(portfolio: portfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve, reject) => {
      portfolio.creationdate = new Date().getTime().toString();
      const myfolio = Object.assign({}, portfolio);

      for (let i = 0; i < portfolio.foliotypes.length; i++) {
        myfolio.foliotypes[i] = Object.assign({}, portfolio.foliotypes[i]);


      }
      this.afs.collection('studentportfolios').doc(portfolio.creationdate).set(myfolio).then(() => {
        resolve('done');
      }).catch((err) => {
        return reject('error');
      })
    });

  }



  async delete_folio(portfolio: portfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve, reject) => {

      this.afs.collection('studentportfolios').doc(portfolio.creationdate).delete().then(() => {
        resolve('done');
      }).catch((err) => {
        return reject('error');
      })
    });

  }


  async update_folio(portfolio: portfolio) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve, reject) => {
      const myfolio = Object.assign({}, portfolio);

      for (let i = 0; i < portfolio.foliotypes.length; i++) {
        myfolio.foliotypes[i] = Object.assign({}, portfolio.foliotypes[i]);


      }
      this.afs.collection('studentportfolios').doc(portfolio.creationdate).update(myfolio).then(() => {
        resolve('done');
      }).catch((err) => {
        return reject('error');
      })
    });

  }


  async get_folio(parentemail) {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve, reject) => {
      this.afs.collection('studentportfolios', ref => {
        return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher).where('useremail', '==', parentemail);
      }).get().take(1).forEach(snap => {
        this.portfolios = new portfolio();
        if (snap.docs.length==0){
          return resolve('done');
        }
        snap.forEach(snapshot => {

          if (snapshot.exists) {
            let temp = snapshot.data() as portfolio;
            this.portfolios.classname = temp.classname;
            this.portfolios.classteacher = temp.classteacher;
            this.portfolios.useremail = temp.useremail;
            this.portfolios.creationdate = temp.creationdate;

            let index = 0;
            while (temp.foliotypes[index] != undefined && temp.foliotypes != null) {
              let porttype = new portfoliotype();
              porttype.background = temp.foliotypes[index].background;
              porttype.name = temp.foliotypes[index].name;
              porttype.percent = temp.foliotypes[index].percent;
              this.portfolios.foliotypes.push(porttype);
              index++;
            }

            return resolve('done');

          } else {
            return reject('error');
          }
        })
      })
    });

  }


  async delete_allfolio() {
    const loading = this.loaderservice.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1000
    });
    this.presentLoading(loading);

    return new Promise((resolve, reject) => {
      this.afs.collection('studentportfolios', ref => {
        return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher);
      }).get().take(1).forEach(snap => {
        let length = snap.docs.length;

        this.portfolios = new portfolio();
        snap.forEach(snapshot => {

          if (snapshot.exists) {
            snapshot.ref.delete();
            length--;
            if (length == 0){
              return resolve('done');
            }
          } else {
            return reject('error');
          }
        })
      })
    });

  }
}
