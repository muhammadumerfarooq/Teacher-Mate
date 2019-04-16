import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { NotificationsServiceProvider, notify } from '../../providers/notifications-service/notifications-service';
import { PostProvider, Myfeed } from '../../providers/post/post';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

/**
 * Generated class for the NotificatonsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notificatons',
  templateUrl: 'notificatons.html',
})
export class NotificatonsPage {

  constructor(private homeservice:HomeServiceProvider,private alertCtrl:AlertController,private modalCtrl:ModalController,private postservice:PostProvider,public navCtrl: NavController, public navParams: NavParams, private notifyservice:NotificationsServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificatonsPage');
  }
  selectednotify(notifications: notify){
    
    let foundfeed: Myfeed = new Myfeed();
    
    foundfeed = this.findfeed(notifications,foundfeed);
    this.notifyservice.updateobjectnotification(notifications);
  debugger
    if (foundfeed != null && foundfeed!=undefined && foundfeed.publisheddate != undefined && foundfeed.publisheddate != null){
      var modalPage: any;

    if (notifications.message.toString().includes('liked')){
      modalPage = this.modalCtrl.create('PostDetailPage', { Myfeed: foundfeed, 'likedperson': notifications.useremail });

    }
    else if (notifications.message.toString().includes('commented')){
      modalPage = this.modalCtrl.create('PostDetailPage', { Myfeed: foundfeed, 'commentedtime': notifications.publisheddate });

    }
   
      modalPage.onDidDismiss(data => {
        if (data == true) {
         // this.presentAlert('Success', ' post created');
        } else if (data == false) {
        //  this.presentAlert('Error', ' post not created');
        } else if (data == 'back') {
  
        }
      });
      modalPage.present();
  }

   if (notifications.message.toString().includes('requested')){
    let confirm = this.alertCtrl.create({
      title: 'Add In Classroom',
      message: 'Are you sure you want to add '+ notifications.commentby.name +' in classroom?',
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
            this.homeservice.findclassroom(notifications.classid)
          }
        }
      ]
    });
    confirm.present();
  }
  }
  findfeed(notifications: notify,  foundfeed: Myfeed ){
    
    for (let i=0;i<this.postservice.Feeds.length;i++){
      
      if(this.postservice.Feeds[i].classid == notifications.classname && this.postservice.Feeds[i].teacheremail == notifications.classteacher && this.postservice.Feeds[i].title == notifications.feedtitle){
  
        foundfeed =  this.postservice.Feeds[i];
        return foundfeed;
      }
    }
  
  }
}
