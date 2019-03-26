import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { student, StudentProvider } from '../../providers/student/student';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { userprofile } from '../../providers/home-service/home-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the StudentProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-student-profile',
  templateUrl: 'student-profile.html',
})


export class StudentProfilePage {
  selectedparent: userprofile = new userprofile();

  base64Image: string = '';
  user: String = '';
  studentprofile: student = new student();

  constructor(private studentservice: StudentProvider, private loader: LoaderserviceProvider, private storage: Storage, private viewctrl: ViewController, private profileservice: ProfileServiceProvider, private camera: Camera, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.studentprofile = new student();

    // this.studentprofile = this.navParams.get('studentprofile');
    this.studentprofile.name = '';
    this.studentprofile.userurl = '';
    // this.studentprofile.parentemail = 

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,

    });
    setTimeout(() => {
      this.loader.loading.present().then(() => {


        this.storage.get('user').then(user => {
          if (user == 'parent') {
            this.user = 'parent';
            this.storage.get('email').then(email => {
              this.studentprofile.parentemail = email;
              this.loader.dismissloading();
            }).catch(() => {
              this.loader.dismissloading();
            })

            // getting class name and teacher
            this.storage.get('classname').then(classname => {
              this.studentprofile.classname = classname;
            }).catch(() => {
              this.loader.dismissloading();
            });
            this.storage.get('classteacher').then(classteacher => {
              this.studentprofile.classteacher = classteacher;
            }).catch(() => {
              this.loader.dismissloading();
            });

          } else {
            this.user = 'teacher';
            this.loader.dismissloading();
          }


        }).catch(() => {
          this.loader.dismissloading();
        });
      });
    }, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentDetailPage');
  }
  changeimage() {


    try {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: 0,
      }


      this.camera.getPicture(options)
        .then((data) => {


          console.log(data)
          this.base64Image = 'data:image/jpg;base64,' + data;



        }).catch(err => {
          this.presentAlert('error', err);
        })
    }
    catch (exception) {
      this.presentAlert('error', exception);
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
  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }
  parentprofile(parent: userprofile) {
    
    this.selectedparent = new userprofile();
    
    this.studentprofile.parentemail = parent.useremail;
    this.selectedparent.imgurl = parent.imgurl;
    this.selectedparent.useremail = parent.useremail;
    this.selectedparent.username = parent.username;
  }

  updatestudent() {
    this.studentprofile.createdate = new Date().getDate.toString();

    this.studentservice.insertstudent(this.studentprofile, this.base64Image).then(() => {
      this.presentAlert('Student added ', 'Successfully');
    }).catch((err) => {
      this.presentAlert('Error! ', ' student not added ');
    });
  }
}
