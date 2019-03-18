import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { AngularFireAuth } from 'angularfire2/auth'
import { App } from 'ionic-angular/components/app/app';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  // homePage:any = HomePage;
 
  
  constructor(private storage:Storage,private homeservice:HomeServiceProvider,private app: App, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afauth: AngularFireAuth) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.nav.setRoot(HomePage);
      //  app.getActiveNav().setRoot(HomePage); 
  
      this.homeservice.userprofile.imgurl;
      this.homeservice.userprofile.username;
      this.homeservice.userprofile.useremail;
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
  }

  logout() {
       
    this.storage.clear().then(val=>{
    this.afauth.auth.signOut();
    }).catch(err=>{

    });
  }
  editprofile() {

      this.app.getActiveNav().push('ProfileEditPage');
   
  }
  
}

