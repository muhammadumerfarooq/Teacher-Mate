import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { TeachersServiceProvider } from '../../providers/teachers-service/teachers-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { classroom } from '../../providers/home-service/home-service';

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

  constructor(private modalCtrl:ModalController,private loaderservice: LoaderserviceProvider, private teacherservice: TeachersServiceProvider, private profileservice: ProfileServiceProvider, public navCtrl: NavController, public navParams: NavParams, private viewctrl: ViewController) {
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
          for (let j = 0; j < this.profileservice.allteachers.length; j++) {

            if (this.teacherservice.teacherclass[i].teacheremail == this.profileservice.allteachers[j].useremail) {
              this.teacherservice.teacherclass[i].imgurl = this.profileservice.allteachers[j].imgurl;
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

  sendrequest(myclass:classroom){

  }
  goToProfileTeacher(myclass:classroom) {
    let modalpage = this.modalCtrl.create('TeacherProfilePage',{myclass:myclass});

    modalpage.onDidDismiss((val) => {
        // Do what you want ...
        console.log(val);
    });
  
    // Present the modal
    modalpage.present();
  }
}
