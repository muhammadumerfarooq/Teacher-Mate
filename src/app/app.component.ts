import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { AngularFireAuth } from 'angularfire2/auth'
import { App } from 'ionic-angular/components/app/app';
import { Storage } from '@ionic/storage';
import { StudentListPage } from '../pages/student-list/student-list';


export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  // homePage:any = HomePage;
  appMenuItems: Array<MenuItem>;

  
  constructor(private modalctrl:ModalController,private storage:Storage,private homeservice:HomeServiceProvider,private app: App, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afauth: AngularFireAuth) {
    platform.ready().then(() => {
      
   

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.nav.setRoot(HomePage);
      //  app.getActiveNav().setRoot(HomePage); 
 
      this.storage.get('user').then(val=>{
        if (val=='parent'){
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
            {title: 'Students List', component: 'StudentListPage', icon: 'people'},
            {title: 'Your Child', component: 'AddStudent', icon: 'person'},
            
          ];
        }else{
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
            {title: 'Students List', component: 'StudentListPage', icon: 'people'},
            {title: 'Add Student', component: 'AddStudent', icon: 'person-add'},
            
          ];
        }
      })
    
      this.homeservice.userprofile.imgurl;
      this.homeservice.userprofile.username;
      this.homeservice.userprofile.useremail;
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
  }
  

  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
   // this.nav.setRoot(page.component);
   if (page.component == 'HomePage'){
    this.nav.setRoot(HomePage);
   }else if (page.component == 'AddStudent'){
    
     modalPage = this.modalctrl.create('StudentProfilePage');
     modalPage.onDidDismiss(data=>{
      if (data == true)
      {
        console.log(data+" chat page ")
       // this.viewCtrl.dismiss(true);
      }
 
    });
     modalPage.present();
    }
   
   else {
     
    var modalPage = this.modalctrl.create(page.component);
    modalPage.onDidDismiss(data=>{
     if (data == true)
     {
       console.log(data+" chat page ")
      // this.viewCtrl.dismiss(true);
     }

   });
    modalPage.present();
   }

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

