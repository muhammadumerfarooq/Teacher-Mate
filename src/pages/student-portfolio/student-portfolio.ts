import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PortfolioServiceProvider, portfolio, portfoliotype } from '../../providers/portfolio-service/portfolio-service';
import { StudentPortfolioServiceProvider } from '../../providers/student-portfolio-service/student-portfolio-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { PortfolioListProvider, foliodescribe, myfolio } from '../../providers/portfolio-list/portfolio-list';

/**
 * Generated class for the StudentPortfolioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-student-portfolio',
  templateUrl: 'student-portfolio.html',
})

export class StudentPortfolioPage {
  myfolio : myfolio;
  portfolios: portfolio;
  parentemail: string = '';
  title: string = '';
  description: string = '';
  listfolios: Array<foliodescribe>;

  constructor(private portfoliolist:PortfolioListProvider,public navCtrl: NavController, private alertctrl: AlertController, private view_ctrl: ViewController, private homeservice: HomeServiceProvider, public navParams: NavParams, private folioservice: PortfolioServiceProvider, private studentfolio: StudentPortfolioServiceProvider, private nav: NavParams) {

    this.myfolio = new myfolio();
    this.listfolios = new Array<foliodescribe>();

    this.parentemail = this.nav.get('parentemail');
    this.myfolio.classname = this.homeservice.classroom;
    this.myfolio.classteacher = this.homeservice.classteacher;
    this.myfolio.useremail = this.parentemail;

    this.portfolios = new portfolio();
    this.folioservice.get_folio().then(() => {

      this.portfolios.classname = this.folioservice.portfolios.classname;
      this.portfolios.classteacher = this.folioservice.portfolios.classteacher;
      this.portfolios.creationdate = this.folioservice.portfolios.creationdate;
      this.portfolios.useremail = this.parentemail;



      this.studentfolio.get_folio(this.parentemail).then(res => {

        this.folioservice.portfolios.foliotypes.forEach(folio => {
          let found = false;
          this.studentfolio.portfolios.foliotypes.forEach(myfolio => {
            if (folio.name == myfolio.name) {
              found = true;
              let foliotype: portfoliotype = new portfoliotype();
              foliotype.background = myfolio.background;
              foliotype.name = myfolio.name;
              foliotype.percent = myfolio.percent;
              this.portfolios.foliotypes.push(foliotype);
              let description = new foliodescribe();
              description.typename = foliotype.name;
              description.currentvalue = foliotype.percent;
              this.listfolios.push(description);
            }
          });
          if (found == false) {
            let foliotype: portfoliotype = new portfoliotype();
            foliotype.background = folio.background;
            foliotype.name = folio.name;
            foliotype.percent = folio.percent;
            this.portfolios.foliotypes.push(foliotype);
            let description = new foliodescribe();
            description.typename = foliotype.name;
            description.currentvalue = foliotype.percent;
            this.listfolios.push(description);
          }
        });

      }).catch(err => {
        this.folioservice.portfolios.foliotypes.forEach(folio => {
          let foliotype: portfoliotype = new portfoliotype();
          foliotype.background = folio.background;
          foliotype.name = folio.name;
          foliotype.percent = folio.percent;
          this.portfolios.foliotypes.push(foliotype);
          let description = new foliodescribe();
          description.typename = foliotype.name;
          description.currentvalue = foliotype.percent;
          this.listfolios.push(description);
        });

      })
    }).catch(err => {
      this.portfolios.classname = this.homeservice.classroom;
      this.portfolios.classteacher = this.homeservice.classteacher;
      this.portfolios.useremail = this.parentemail;


    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentPortfolioPage');
  }
  viewctrl_dismiss() {
    this.view_ctrl.dismiss();
  }
  setborder(folio: portfoliotype) {
    let index = this.portfolios.foliotypes.indexOf(folio);
    let styles = {
      'margin-top': '5%',
      'color': '#FFF',
      'border': 'thin solid' + this.portfolios.foliotypes[index].background,
      'border-radius': '1.2em'
    };
    return styles;
  }

  SubmitFolio() {
    if (this.description != '') {


      let confirm = this.alertctrl.create({
        title: 'Submit/updatte Portfolio',
        message: 'Are you sure you want to Submit/update portfolio ',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {

              this.myfolio.foliolist = this.listfolios;
              this.myfolio.creationdate = new Date().getTime().toString();
              this.myfolio.portfolio = this.portfolios;
              this.portfoliolist.insert_foliollist(this.myfolio).then(res=>{
                if (this.studentfolio.portfolios.foliotypes.length == 0){
                  this.studentfolio.insert_folio(this.portfolios).then(res=>{
                    this.presentAlert('Portfolio Inserted Successfully', '');

                  }).catch(err=>{
                    this.presentAlert('Portfolio Not Inserted Successfully', '');

                  });
                }else{
                  this.studentfolio.update_folio(this.portfolios).then(res=>{
                    this.presentAlert('Portfolio Inserted Successfully', '');

                  }).catch(err=>{
                    this.presentAlert('Portfolio Not Inserted Successfully', '');

                  });
                }
              }).catch(err=>{
                this.presentAlert('Error! Portfolio Not Inserted Successfully', err);

              });
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.presentAlert('Description cannot be empty', '');
    }
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  removepercent(folio: portfoliotype, folioindex) {
    if (this.portfolios.foliotypes[folioindex].percent > 0) {
      this.portfolios.foliotypes[folioindex].percent = this.portfolios.foliotypes[folioindex].percent - 1;
      this.listfolios[folioindex].description = " Increased in " + this.portfolios.foliotypes[folioindex].name + " by " +
        (this.portfolios.foliotypes[folioindex].percent - this.listfolios[folioindex].currentvalue) + " % ";
    } else {

    }
  }
  addpercent(folio: portfoliotype, folioindex) {
    if (this.portfolios.foliotypes[folioindex].percent < 100) {
      this.portfolios.foliotypes[folioindex].percent = this.portfolios.foliotypes[folioindex].percent + 1;
      this.listfolios[folioindex].description = " Increased in " + this.portfolios.foliotypes[folioindex].name + " by " +
        (this.portfolios.foliotypes[folioindex].percent - this.listfolios[folioindex].currentvalue) + " % ";

    } else {

    }
  }
}
