import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PortfolioListProvider, myfolio } from '../../providers/portfolio-list/portfolio-list';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { StudentProvider, student } from '../../providers/student/student';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the PortfolioHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-portfolio-history',
  templateUrl: 'portfolio-history.html',
})
export class PortfolioHistoryPage {
studentslist : Array<student>;
refresher: any;

  constructor(private modalctrl:ModalController,private viewctrl:ViewController,public navCtrl: NavController, private studentservice:StudentProvider,private homeservice:HomeServiceProvider,public navParams: NavParams, private portfoliolists:PortfolioListProvider) {
    
    this.studentslist = new Array<student>();
    this.getdata();
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortfolioHistoryPage');
  }
  viewctrl_dismiss(){
    this.viewctrl.dismiss();
  }
  getdata(){
    return new Promise((resolve,reject)=>{
      
    this.portfoliolists.get_foliollist(this.homeservice.useremail).then(res=>{
      this.studentservice.getstudents().then(()=>{
        this.portfoliolists.foliolist.forEach(folio=>{
        
        this.studentservice.class_students.forEach(students => {
         if (folio.useremail == students.parentemail){
           this.studentslist.push(students);
         } 
         return resolve('done')
        });
      });
      }).catch(err=>{    reject('error');
      })
  }).catch(err=>{
    reject('error');
  });
 
})
  }

  onPullToRefresh(refresher){
    this.getdata().then(res=>{
      refresher.complete();
    }).catch(err=>{
      refresher.complete();
    });
   }

  historyDetail(folio:myfolio){
    var modalPage = this.modalctrl.create('HistoryDetailPage', { folio: folio });
    modalPage.onDidDismiss(data => {
      if (data == true) {

  
      }
  
    });
    modalPage.present();
  }
}
