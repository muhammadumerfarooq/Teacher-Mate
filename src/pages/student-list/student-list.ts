import { Component, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalCmp, ModalController } from 'ionic-angular';
import { student, StudentProvider } from '../../providers/student/student';

/**
 * Generated class for the StudentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-student-list',
  templateUrl: 'student-list.html',
})
export class StudentListPage {

  constructor(private modalctrl:ModalController ,public viewctrl: ViewController,public navCtrl: NavController, public navParams: NavParams, private studentservice:StudentProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentListPage');
  }

  studentDetail(studentdetail:student){

  }
  studentProfile(studenprofile:student){
    var modalPage = this.modalctrl.create('StudentDetailPage',{ studentprofile: studenprofile});
    modalPage.onDidDismiss(data=>{
     if (data == true)
     {
       console.log(data+" chat page ")
      // this.viewCtrl.dismiss(true);
     }

   });
    modalPage.present();
   }
  
  
  viewctrl_dismiss(){
    this.viewctrl.dismiss('back');
  }
}
