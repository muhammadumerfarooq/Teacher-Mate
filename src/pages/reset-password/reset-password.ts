import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
email:string;

  constructor(public navCtrl: NavController, private alertCtrl:AlertController,public navParams: NavParams, private afauth:AngularFireAuth) {
  this.email = '';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }
forgotPass(){
  if (this.email!=''){
    this.afauth.auth.sendPasswordResetEmail(this.email).then(res=>{
      this.presentAlert('Password reset link sent ','  ');

    }).catch(err=>{
      this.presentAlert('Password reset link sending Failed ','  ');

    })
  }else{
    this.presentAlert('Email must be not be empty ','  ');

  }
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

}
