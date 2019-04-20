import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { TeachersServiceProvider } from '../../providers/teachers-service/teachers-service';
// import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { classroom, HomeServiceProvider } from '../../providers/home-service/home-service';
import { NotificationsServiceProvider, notify } from '../../providers/notifications-service/notifications-service';
import { RequestServiceProvider } from '../../providers/request-service/request-service';


/**
 * Generated class for the SendRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-request',
  templateUrl: 'send-request.html',
})
export class SendRequestPage {
found: boolean = false;

  constructor(private homeservice:HomeServiceProvider,private requestservice:RequestServiceProvider,private alertCtrl:AlertController,private notifyservice: NotificationsServiceProvider,private alertctrl:AlertController,private modalCtrl: ModalController, private loaderservice: LoaderserviceProvider, private teacherservice: TeachersServiceProvider, 
     public navCtrl: NavController, public navParams: NavParams, private viewctrl: ViewController) {
    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
      duration: 1000
    });

    setTimeout(() => {

      this.loaderservice.loading.present().then(() => {
        for (let i = 0; i < this.teacherservice.teacherclass.length; i++) {
          for (let j = 0; j < this.homeservice.allteachers.length; j++) {

            if (this.teacherservice.teacherclass[i].teacheremail == this.homeservice.allteachers[j].useremail) {
              this.teacherservice.teacherclass[i].imgurl = this.homeservice.allteachers[j].imgurl;
              break;
            }
          }
        }
      });
    });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendRequestPage');
  }
  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  sendrequest(myclass: classroom) {
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
            
            this.requestservice.findrequest().then(res=>{
              
              if (res=='found'){
                
                this.presentAlert('Request Is Already Send To Teacher', '');

                this.found = false;
              }else{
              this.found = true;
              this.presentAlert('Request Is Already Send To Teacher', '');


              }
            }).catch(err=>{
              let notifydata: notify = new notify();
                notifydata.classname = myclass.classname;
                notifydata.classteacher = myclass.teacheremail;
                notifydata.userurl = myclass.imgurl;
                notifydata.publisheddate = new Date().getTime().toString();
                notifydata.message =  ' requested to add in classroom ';
                notifydata.commentby.email = this.homeservice.useremail;
                notifydata.commentby.name = this.homeservice.username;
                notifydata.classid = myclass.classid;
                notifydata.useremail = this.homeservice.useremail;
                
                this.notifyservice.insertnotification(notifydata).then(val=>{
                  if (val == 'done')
                  this.presentAlert('Request Send Successfully!','');
                  else{
                    this.presentAlert('Request Sending Failed!','');
                  }
                }).catch(err=>{
                  this.presentAlert('Request Sending Failed!','');
            
                });
            });
            
           
          }
        }
      ]
    });
    confirm.present();
  }
  goToProfileTeacher(myclass: classroom) {
    let modalpage = this.modalCtrl.create('TeacherProfilePage', { myclass: myclass });

    modalpage.onDidDismiss((val) => {
      // Do what you want ...
      console.log(val);
    });

    // Present the modal
    modalpage.present();
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
