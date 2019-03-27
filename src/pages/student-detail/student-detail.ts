import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { student } from '../../providers/student/student';

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
  constructor(private camera:Camera,public navCtrl: NavController, public navParams: NavParams, private alertCtrl:AlertController) {
  this.studentprofile = this.navParams.get('studentprofile');
 // this.studentprofile.name = '';
 // this.studentprofile.userurl = '';
this.studentprofile.parentemail
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

}
