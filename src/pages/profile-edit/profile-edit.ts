import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
/**
 * Generated class for the ProfileEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  name : string ='';
  email: string = '';

  constructor(private homeservice:HomeServiceProvider,private alertCtrl:AlertController,private cropservice:Crop,private camera:Camera,private storage:Storage,public navCtrl: NavController, public navParams: NavParams, private profileservice:ProfileServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileEditPage');
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
        
          let user = '';
          let email = '';
          
        
          if (this.homeservice.user == 'teacher'){
              user = 'teachers';
          }else if (this.homeservice.user == 'parent'){
              user = 'parents';
          }
        
            
            email = this.homeservice.useremail;
            this.profileservice.editprofile(user,email,base64Image).then(res=>{
              this.presentAlert('Proile Updated Successfull! ','' );

            }).catch(err=>{
              this.presentAlert('Error! ','profile not updated' );

            });
        }).catch(err=>{
          this.homeservice.user
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
   updatebtn(){

   }
   
}
