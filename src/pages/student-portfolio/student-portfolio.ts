import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PortfolioServiceProvider, portfolio, portfoliotype } from '../../providers/portfolio-service/portfolio-service';
import { StudentPortfolioServiceProvider } from '../../providers/student-portfolio-service/student-portfolio-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

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
  portfolios: portfolio;
  parentemail : string = '';
  title:string = '';
  description:string = '';

  constructor(public navCtrl: NavController, private alertctrl:AlertController,private view_ctrl:ViewController,private homeservice:HomeServiceProvider,public navParams: NavParams,private folioservice:PortfolioServiceProvider,private studentfolio:StudentPortfolioServiceProvider, private nav:NavParams) {
    
    this.parentemail = this.nav.get('parentemail');

    this.portfolios = new portfolio();
    this.folioservice.get_folio().then(()=>{

      this.portfolios.classname = this.folioservice.portfolios.classname;
      this.portfolios.classteacher = this.folioservice.portfolios.classteacher;
      this.portfolios.creationdate = this.folioservice.portfolios.creationdate;
      this.portfolios.useremail = this.folioservice.portfolios.useremail;
      


      this.studentfolio.get_folio(this.parentemail).then(res=>{
        
        this.folioservice.portfolios.foliotypes.forEach(folio=>{
          let found = false;
          this.studentfolio.portfolios.foliotypes.forEach(myfolio => {
            if (folio.name == myfolio.name){
              found = true;
              let foliotype:portfoliotype = new portfoliotype();
              foliotype.background = myfolio.background;
              foliotype.name = myfolio.name;
              foliotype.percent = myfolio.percent;
               this.portfolios.foliotypes.push(foliotype);
            }
          });
          if (found == false){
            let foliotype:portfoliotype = new portfoliotype();
            foliotype.background = folio.background;
            foliotype.name = folio.name;
            foliotype.percent = folio.percent;
             this.portfolios.foliotypes.push(foliotype);
          }
        });

      }).catch(err=>{
        this.folioservice.portfolios.foliotypes.forEach(folio=>{
        let foliotype:portfoliotype = new portfoliotype();
        foliotype.background = folio.background;
        foliotype.name = folio.name;
        foliotype.percent = folio.percent;
         this.portfolios.foliotypes.push(foliotype);
        });

      })
    }).catch(err=>{
      this.portfolios.classname = this.homeservice.classroom;
      this.portfolios.classteacher = this.homeservice.classteacher;
      this.portfolios.useremail = this.parentemail;
      

    })  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentPortfolioPage');
  }
  viewctrl_dismiss(){
    this.view_ctrl.dismiss();
  }
  setborder(folio:portfoliotype){
    let index = this.portfolios.foliotypes.indexOf(folio);
    let styles = {
      'margin-top':'5%',
      'color':'#FFF',
      'border': 'thin solid'+this.portfolios.foliotypes[index].background,
      'border-radius':'1.2em'
    };
    return styles;
  }

  SubmitFolio(){
    let confirm = this.alertctrl.create({
      title: 'Submit/updatte Portfolio',
      message: 'Are you sure you want to Submit/updatte Portfolio ',
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
            if (this.studentfolio.portfolios.foliotypes.length>0){
              
                this.studentfolio.update_folio(this.portfolios).then(()=>{
                  this.presentAlert('Portfolio Updated Successfully!','');
                }).catch(()=>{
                  this.presentAlert('Error! Portfolio Not Updated ','');

                })

            
            }
            else if (this.folioservice.portfolios.foliotypes.length==0){
              this.folioservice.insert_folio(this.portfolios).then(res=>{
                this.presentAlert('Portfolio Updated Successfully!','');
              }).catch(err=>{
                this.presentAlert('Error! ','');
              });
            }
          }
        }
      ]
    });
    confirm.present();
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

}
