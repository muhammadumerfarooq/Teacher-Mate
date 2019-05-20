import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { AngularFireAuth } from 'angularfire2/auth'
import { App } from 'ionic-angular/components/app/app';
import { Storage } from '@ionic/storage';
import { LoaderserviceProvider } from '../providers/loaderservice/loaderservice';
import { StudentProvider, student } from '../providers/student/student';

//import { ProfileServiceProvider } from '../providers/profile-service/profile-service';


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


  constructor(private studentservice: StudentProvider, private alertctrl: AlertController, private loaderservice: LoaderserviceProvider, private modalctrl: ModalController, private storage: Storage, private homeservice: HomeServiceProvider, private app: App, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afauth: AngularFireAuth) {
    platform.ready().then(() => {

      // this.homeservice.storageSub.next('added-user');

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.nav.setRoot(HomePage);
      //  app.getActiveNav().setRoot(HomePage); 
      this.storage.set('classroom', '');
      this.storage.set('classteacher', '');

      /*  this.storage.get('user').then(val=>{
          if (val=='parent'){
            this.appMenuItems = [
              {title: 'Home', component: 'HomePage', icon: 'home'},
              {title: 'Students List', component: 'StudentListPage', icon: 'people'},
              {title: 'Your Child', component: 'YourChild', icon: 'person'},
              {title: 'Courses Info', component: 'CourseInfo', icon: 'paper'},
              {title: 'Take Quiz', component: 'TakeQuiz', icon: 'paper'},
            ];
          }else{
            this.appMenuItems = [
              {title: 'Home', component: 'HomePage', icon: 'home'},
              {title: 'Students List', component: 'StudentListPage', icon: 'people'},
              {title: 'Add Student', component: 'AddStudent', icon: 'person-add'},
              {title: 'Courses Info', component: 'CourseInfo', icon: 'paper'},
              {title: 'Add Courses', component: 'AddCoursesPage', icon: 'create'},
  
            ];
          }
        })*/

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
    if (page.component == 'HomePage') {
      this.nav.setRoot(HomePage);
      this.storage.set('classroom', '').then(() => {
        this.storage.set('classteacher', '').then(() => {
          this.homeservice.storageSub.next('removed-class');

        });
      });


    } else if (page.component == 'QuizResults') {

      modalPage = this.modalctrl.create('QuizesResultsPage');
      modalPage.onDidDismiss(data => {



        if (data == true) {
          console.log(data + " chat page ")

        }

      });
      modalPage.present();
    }

    else if (page.component == 'AddStudent') {

      modalPage = this.modalctrl.create('StudentProfilePage');
      modalPage.onDidDismiss(data => {



        if (data == true) {
          console.log(data + " chat page ")

        }

      });
      modalPage.present();
    }

    else if (page.component == 'YourChild') {

      this.studentservice.getspecificstudent().then(res => {
        if (res == 'done') {
          let studentprofile: student = this.studentservice.parentchild;
          modalPage = this.modalctrl.create('StudentDetailPage', { studentprofile: studentprofile });

          modalPage.present();

        }
      }).catch(err=>{
        this.presentAlert('You Child is not added ','');
      });
    }
    else if (page.component == 'Marks') {



      modalPage = this.modalctrl.create('CreateStudentResultPage');

      modalPage.present();

    }
    else if (page.component=='portfolio'){
      modalPage = this.modalctrl.create('CreatePortfolioPage');

      modalPage.present();
    }
    else if (page.component=='charts'){
      modalPage = this.modalctrl.create('PerformanceChartsPage');

      modalPage.present();
    }
    
    else if (page.component == 'CourseInfo') {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,

      });
      setTimeout(() => {
        this.loaderservice.loading.present().then(() => {
          this.storage.get('classroom').then(val => {
            if (val == undefined || val == null || val == '') {
              this.loaderservice.dismissloading();
              this.presentAlert(' first select classroom ', '');

            } else {
              this.loaderservice.dismissloading();

              modalPage = this.modalctrl.create('CourseInfoPage');
              modalPage.onDidDismiss(data => {
                if (data == true) {
                  console.log(data + " chat page ")
                  // this.viewCtrl.dismiss(true);
                }

              });
              modalPage.present();
            }
          })
        }, 500);

      });


    }
    else if (page.component == 'AddCoursesPage') {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,

      });
      setTimeout(() => {
        this.loaderservice.loading.present().then(() => {
          this.storage.get('classroom').then(val => {
            if (val == undefined || val == null || val == '') {
              this.loaderservice.dismissloading();
              this.presentAlert('first select classroom ', '');

            } else {
              this.loaderservice.dismissloading();

              modalPage = this.modalctrl.create('AddCoursesPage');
              modalPage.onDidDismiss(data => {
                if (data == true) {
                  console.log(data + " chat page ")
                  // this.viewCtrl.dismiss(true);
                }

              });
              modalPage.present();
            }
          })
        }, 500);

      });


    }
    else {

      var modalPage = this.modalctrl.create(page.component);
      modalPage.onDidDismiss(data => {
        if (data == true) {
          console.log(data + " chat page ")
          // this.viewCtrl.dismiss(true);
        }

      });
      modalPage.present();
    }

  }

  logout() {


    if (this.nav.length() > 1) {
      this.nav.popTo(HomePage);
    }
    this.storage.clear().then(val => {
      this.afauth.auth.signOut();
      this.homeservice.storageSub.next('removed-all');

    }).catch(err => {

    });
  }
  editprofile() {

    this.app.getActiveNav().push('ProfileEditPage');

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

