import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { ModalController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';


/**
 * Generated class for the LoginmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loginmenu',
  templateUrl: 'loginmenu.html',
})
export class LoginmenuPage {

  constructor(public viewctrl:ViewController,public afAuth:AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,public modalCtrl : ModalController) {

   
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginmenuPage');
  }

  teacheraccount(){


    var modalPage = this.modalCtrl.create('TeacherloginPage');
    modalPage.onDidDismiss(data=>{
      if (data == true)
      {
        console.log(data+" login menu ")
      //  this.navCtrl.popToRoot();
      this.viewctrl.dismiss('back');
      }
    });
    modalPage.present();
  }

  parentaccount(){
    var modalPage = this.modalCtrl.create('ParentloginPage');
    modalPage.onDidDismiss(data=>{
      if (data == true)
      {
        console.log(data+" login menu ");
       // this.navCtrl.popToRoot();
        this.viewctrl.dismiss('back');
      }
    });
    modalPage.present();
  }
}
