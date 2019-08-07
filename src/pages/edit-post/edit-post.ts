import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { post } from '../create-post/create-post';
import { notify } from '../../providers/notifications-service/notifications-service';
import { PostProvider, Myfeed } from '../../providers/post/post';

/**
 * Generated class for the EditPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-post',
  templateUrl: 'edit-post.html',
})
export class EditPostPage {
  mypost = new Myfeed();
  comments: number = 0;
  likes: number = 0;

  constructor(private homeservice:HomeServiceProvider,public alertctrl: AlertController,public postprovider:PostProvider,public navCtrl: NavController, public navParams: NavParams, public viewctrl : ViewController) {
    this.mypost = this.navParams.get('Myfeed');
   // 
    this.comments = this.mypost.comments.length;
    this.likes = this.mypost.likes.length; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmitPostPage');
  }
  viewctrl_dismiss(){
    this.viewctrl.dismiss('back');
  }

  postfeed(){
    
    this.postprovider.updatemyfeed(this.mypost).then(()=>{
     this.viewctrl.dismiss(true);
    }).catch((err)=>{
      
      this.presentAlert(err,"");

     this.viewctrl.dismiss(false);
    });
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
