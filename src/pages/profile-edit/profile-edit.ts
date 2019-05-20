import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Storage } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { timestamp } from 'rxjs/internal/operators/timestamp';
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
        targetWidth: 1280,
        targetHeight: 1280
      }
  
      
      this.camera.getPicture(options)
      .then((data) => {
    
             
        console.log(data)
        let base64Image = 'data:image/jpg;base64,' + data;
        
          let user = '';
          let email = '';
          
        

        
            
            email = this.homeservice.useremail;
            
            this.profileservice.editprofile(this.homeservice.user,email,this.homeservice.username,base64Image).then(res=>{
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
     if (this.name!=''){
      
this.profileservice.edituser(this.homeservice.user,this.homeservice.useremail, name).then(res=>{
  this.presentAlert('Proile Updated Successfull! ','' );

}).catch(err=>{
  this.presentAlert('Error! ','profile not updated' );

});
   }

    
  else{
    this.presentAlert('User name must not be empty ','' );
  }
  
}

}
