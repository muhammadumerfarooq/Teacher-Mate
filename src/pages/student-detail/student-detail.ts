import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { student } from '../../providers/student/student';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

/**
 * Generated class for the StudentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-student-detail',
  templateUrl: 'student-detail.html',
})
export class StudentDetailPage {

   studentprofile: student = new student();
  constructor(private homeservice:HomeServiceProvider,private modalctrl:ModalController,private viewctrl:ViewController,private camera:Camera,public navCtrl: NavController, public navParams: NavParams, private alertCtrl:AlertController) {
  this.studentprofile = this.navParams.get('studentprofile');
 // this.studentprofile.name = '';
 // this.studentprofile.userurl = '';
 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentDetailPage');
  }
  changeimage(){
    

    try{
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType:0,
      }
  
      
      this.camera.getPicture(options)
      .then((data) => {
    
             
        console.log(data)
        let base64Image = 'data:image/jpg;base64,' + data;
  
       

      }).catch(err=>{
        this.presentAlert('error',err);
      })
    }
    catch(exception ){
      this.presentAlert('error',exception);
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

  updatestudent(){
    var modalPage = this.modalctrl.create('StudentProfilePage');
    modalPage.onDidDismiss(data=>{
     if (data == 'back')
     {
      this.viewctrl.dismiss('back');
     }

   });
    modalPage.present();
  }

  quiz_marks(){
    var modalPage = this.modalctrl.create('StudentmarksPage',{'parentemail':this.studentprofile.parentemail});
    modalPage.onDidDismiss(data=>{
     if (data == 'back')
     {
      this.viewctrl.dismiss('back');
     }

   });
    modalPage.present();
  }
  student_folio(){
    var modalPage = this.modalctrl.create('StudentPortfolioPage',{'parentemail':this.studentprofile.parentemail});
    modalPage.onDidDismiss(data=>{
     if (data == 'back')
     {
      this.viewctrl.dismiss('back');
     }

   });
    modalPage.present();
  }
}
