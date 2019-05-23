import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { PortfolioServiceProvider, portfolio, portfoliotype } from '../../providers/portfolio-service/portfolio-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { StudentPortfolioServiceProvider } from '../../providers/student-portfolio-service/student-portfolio-service';

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
  myProps = { percent: 0, message: 'foo', background:'' };
  colors: Array<string>;
  duplicate: number = 0;
portfolios: portfolio;
  constructor(private alertctrl:AlertController,private studentfolio: StudentPortfolioServiceProvider,private homeservice:HomeServiceProvider,public navCtrl: NavController, public viewctrl: ViewController,public navParams: NavParams, private folioservice:PortfolioServiceProvider) {
   this.portfolios = new portfolio();

   this.folioservice.get_folio().then(()=>{
    if (this.folioservice.portfolios.foliotypes.length>0){
      this.portfolios.classname = this.folioservice.portfolios.classname
      this.portfolios.classteacher =  this.folioservice.portfolios.classteacher
      this.portfolios.creationdate =  this.folioservice.portfolios.creationdate
      this.portfolios.useremail =  this.folioservice.portfolios.useremail
      this.folioservice.portfolios.foliotypes.forEach(folio=>{
        let fol = new portfoliotype();
        fol.background = folio.background;
        fol.name = folio.name;
        fol.percent = folio.percent;
        this.portfolios.foliotypes.push(fol);
      });
    }
   }).catch((err)=>{
    this.portfolios.classname = this.homeservice.classroom;
    this.portfolios.classteacher = this.homeservice.classteacher;
    
   });

   this.colors = new Array<string>();
   this.colors.push('#0077ff');
   this.colors.push('#B5E61B');
   this.colors.push('#16144A');
   this.colors.push('#432B9C');
    
    
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
  addfolio(){
    let index = Math.floor((Math.random()*4));
    let folio = new portfoliotype();
    folio.background = this.colors[index];
    this.portfolios.foliotypes.push(folio);
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

  SubmitFolio(){
     
    if (this.duplicate >= 2){
        this.presentAlert('Portfolio Type Names cannot be same ', '');
      
    }
    else{
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
            if (this.folioservice.portfolios.foliotypes.length>0 && this.portfolios.foliotypes.length==0){
              this.folioservice.delete_folio(this.portfolios).then(res=>{
                this.studentfolio.delete_allfolio().then(()=>{
                  this.presentAlert('Portfolio Updated Successfully!','');
                }).catch(()=>{
                  this.presentAlert('Error! Portfolio Not Updated ','');

                })

              }).catch(err=>{
                this.presentAlert('Error! Portfolio Not Updated ','');

              })
            }
            else if (this.folioservice.portfolios.foliotypes.length>0){
              this.folioservice.update_folio(this.portfolios).then(res=>{
                this.presentAlert('Portfolio Updated Successfully!','');
              }).catch(err=>{
                this.presentAlert('Error! ','');
              });
            }else{
            this.folioservice.insert_folio(this.portfolios).then(res=>{
              this.presentAlert('Portfolio Added Successfully!','');
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

  }
  onChangeinput(value){
    this.portfolios.foliotypes.forEach(res=>{
      if (value == res.name){
        this.duplicate ++;
      }
    });
    if (this.duplicate >=2){
      this.presentAlert('Portfolio Type Names cannot be same ', '');
    }else{
      this.duplicate = 0;
    }
  }
}
