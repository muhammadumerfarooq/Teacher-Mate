import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { PortfolioServiceProvider, portfolio, portfoliotype } from '../../providers/portfolio-service/portfolio-service';

/**
 * Generated class for the CreatePortfolioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-portfolio',
  templateUrl: 'create-portfolio.html',
})
export class CreatePortfolioPage {
  loadProgress: number = 0;
  myProps = { percent: 0, message: 'foo' };

portfolios: portfolio;
  constructor(private alertctrl:AlertController,public navCtrl: NavController, public viewctrl: ViewController,public navParams: NavParams, private folioservice:PortfolioServiceProvider) {
   this.portfolios = new portfolio();

    setInterval(() => {
      if (this.loadProgress < 50)
      {
        this.loadProgress += 1;
        this.myProps.percent+=1;}

      else
        clearInterval(this.loadProgress);
    }, 50);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePortfolioPage');
  }
  addfolio(){
    this.portfolios.foliotypes.push(new portfoliotype());
  }
  viewctrl_dismiss(){
    this.viewctrl.dismiss();
  }
  addpercent(folio:portfoliotype){
    
    let index  = this.portfolios.foliotypes.indexOf(folio);
    if (this.portfolios.foliotypes[index].percent<100){
      this.portfolios.foliotypes[index].percent = this.portfolios.foliotypes[index].percent + 1;
    }
    else{
      this.presentAlert('percent must be less than 100','');
    }
  }

  removepercent(folio:portfoliotype){
    
    let index  = this.portfolios.foliotypes.indexOf(folio);
    if (this.portfolios.foliotypes[index].percent>0){
      this.portfolios.foliotypes[index].percent = this.portfolios.foliotypes[index].percent - 1;
    }
    else{
      this.presentAlert('percent must be greater than -1','');
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

  deletefolio(folio:portfoliotype){
    

    let confirm = this.alertctrl.create({
      title: 'Delete Portfolio',
      message: 'Are you sure you want to Delete Portfolio ',
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
            let index  = this.portfolios.foliotypes.indexOf(folio);
            this.portfolios.foliotypes.splice(index,1);
          }
        }
      ]
    });
    confirm.present();


  }
}
