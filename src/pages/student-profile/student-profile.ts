import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { student, StudentProvider } from '../../providers/student/student';
// import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { userprofile, HomeServiceProvider } from '../../providers/home-service/home-service';
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

  parentdetail: Array<userprofile>;
  constructor(private homeservice: HomeServiceProvider, private studentservice: StudentProvider, private loader: LoaderserviceProvider, private storage: Storage, private viewctrl: ViewController, private camera: Camera, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.studentprofile = new student();
    this.parentdetail = new Array<userprofile>();
    // this.studentprofile = this.navParams.get('studentprofile');
    this.studentprofile.name = '';
    this.studentprofile.userurl = '';
    // this.studentprofile.parentemail = 

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,
      duration: 1000
    });
    setTimeout(() => {
      this.loader.loading.present().then(() => {


        // this.storage.get('user').then(user => {

        if (this.homeservice.user == 'parents') {
          this.user = 'parent';
          //      this.storage.get('email').then(email => {

          this.studentprofile.parentemail = this.homeservice.useremail;
          this.homeservice.allparents.forEach(snap => {
            if (snap.useremail == this.homeservice.useremail) {
              this.selectedparent.username = snap.username;
              this.selectedparent.imgurl = snap.imgurl;
              this.selectedparent.user = snap.user;
              this.selectedparent.useremail = snap.useremail;
            }
          })
          // getting class name and teacher
          // this.storage.get('classroom').then(classname => {

          this.studentprofile.classname = this.homeservice.classroom;
          //    this.storage.get('classteacher').then(classteacher => {

          this.studentprofile.classteacher = this.homeservice.classteacher;
          //   this.loader.dismissloading();

          //   }).catch(() => {

          //     this.loader.dismissloading();
          //   });

          // }).catch(() => {

          //   this.loader.dismissloading();
          // });

          // this.loader.dismissloading();
          // }).catch(() => {
          //   this.loader.dismissloading();
          // })



        } else {
          this.user = 'teacher';
          // getting class name and teacher
          //  this.storage.get('classroom').then(classname => {

          //   this.studentprofile.classname = classname;
          //    this.storage.get('classteacher').then(classteacher => {
          this.studentprofile.classname = this.homeservice.classroom;
          this.studentprofile.classteacher = this.homeservice.classteacher;
          for (let j = 0; j < this.homeservice.myclassroom.length; j++) {
            if (this.homeservice.myclassroom[j].classname == this.homeservice.classroom && this.homeservice.myclassroom[j].teacheremail == this.homeservice.classteacher) {
              let index = this.homeservice.myclassroom[j].parentsemail.length - 1;

              while (index > -1) {
                for (let i = 0; i < this.homeservice.allparents.length; i++) {
                  if (this.homeservice.allparents[i].useremail == this.homeservice.myclassroom[j].parentsemail[index]) {
                    this.parentdetail.push(this.homeservice.allparents[i]);
                  }
                }
                index--;
              }
            }

          }

          //     this.loader.dismissloading();
          //   }).catch(() => {

          //     this.loader.dismissloading();
          //   });

          // }).catch(() => {

          //   this.loader.dismissloading();
          // });


          //  this.loader.dismissloading();
        }


        // }).catch(() => {
        //   this.loader.dismissloading();
        // });
      });
    }, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentProfilePage');
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
    this.studentprofile.datecreation = new Date().toString();
    if (this.base64Image == '') {
      this.studentservice.insertstudent(this.studentprofile).then((res) => {
        if (res == 'exists') {
          this.presentAlert('Student with name '+this.studentprofile.name +' and having same parent already exists ', 'Successfully');
        } else
          this.presentAlert('Student added ', 'Successfully');
      }).catch((err) => {
        this.presentAlert('Error! ', ' student not added ');
      });
    } else {
      this.studentservice.insertstudent_img(this.studentprofile, this.base64Image).then((res) => {
        if (res == 'exists') {
          this.presentAlert('Student updated ', 'Successfully');

        } else
          this.presentAlert('Student added ', 'Successfully');
      }).catch((err) => {
        this.presentAlert('Error! ', ' student not added ');
      });
    }
  }
}
