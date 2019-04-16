import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { classroom } from '../../providers/home-service/home-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NotificationsServiceProvider, notify } from '../../providers/notifications-service/notifications-service';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

/**
 * Generated class for the TeacherProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-teacher-profile',
  templateUrl: 'teacher-profile.html',
})
export class TeacherProfilePage {

  myclass:classroom = new classroom();

  constructor(private alertCtrl:AlertController,private alertctrl:AlertController,private profileservice:ProfileServiceProvider,private notifyservice:NotificationsServiceProvider,public navCtrl: NavController, public navParams: NavParams, private viewctrl:ViewController) {
    this.myclass = this.navParams.get('myclass');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeacherProfilePage');
  }

  viewctrl_dismiss(){
    this.viewctrl.dismiss('back');
  }
  inviteparent(){

    let confirm = this.alertCtrl.create({
      title: 'Send Request',
      message: 'Send Request For Classroom Joining? ',
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
            let notifydata: notify = new notify();
            notifydata.classname = this.myclass.classname;
            notifydata.classteacher = this.myclass.teacheremail;
            notifydata.userurl = this.myclass.imgurl;
            notifydata.publisheddate = new Date().getTime().toString();
            notifydata.message = this.profileservice.username + ' requested to add in classroom ';
            notifydata.commentby.email = this.profileservice.useremail;
            notifydata.commentby.name = this.profileservice.username;
            notifydata.classid = this.myclass.classid;
            notifydata.useremail = this.profileservice.useremail;
            
            this.notifyservice.insertnotification(notifydata).then(val=>{
              if (val == 'done')
              this.presentAlert('Request Send Successfully!','');
              else{
                this.presentAlert('Request Sending Failed!','');
              }
            }).catch(err=>{
              this.presentAlert('Request Sending Failed!','');
        
            });
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
