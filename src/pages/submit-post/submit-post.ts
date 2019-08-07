import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { post } from '../create-post/create-post';
import { PostProvider } from '../../providers/post/post';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { notify } from '../../providers/notifications-service/notifications-service';

/**
 * Generated class for the SubmitPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submit-post',
  templateUrl: 'submit-post.html',
})
export class SubmitPostPage {
  mypost = new post();
  comments: number = 0;
  likes: number = 0;

  constructor(private homeservice:HomeServiceProvider,public alertctrl: AlertController,public postprovider:PostProvider,public navCtrl: NavController, public navParams: NavParams, public viewctrl : ViewController) {
    this.mypost = this.navParams.get('post');
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
    
    let notifications: notify = new notify();

    notifications.classname = this.mypost.classid;
    notifications.classteacher = this.mypost.teacheremail;
    notifications.feedtitle = this.mypost.title;
    notifications.seen = 'false';
    notifications.userurl = this.homeservice.userprofile.imgurl;
    notifications.message = this.homeservice.userprofile.username + ' added a post ';
    notifications.publisheddate = new Date().getTime().toString();
    notifications.useremail = this.homeservice.userprofile.useremail;
    
    this.postprovider.postmyfeed(this.mypost, notifications).then(()=>{
     this.viewctrl.dismiss(true);
    }).catch(()=>{
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
