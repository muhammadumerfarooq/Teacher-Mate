import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { AngularFirestore, PersistenceSettingsToken } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
// import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
/**
 * Generated class for the TeacherloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-teacherlogin',
  templateUrl: 'teacherlogin.html',
})


export class TeacherloginPage {


  teacher_email: string = "";
  teacher_password: string = "";
  emailverified: boolean = false;
  teachersarray: Observable<any[]>;

  constructor(private homeservice: HomeServiceProvider, public afs: AngularFirestore, public storage: Storage, public modalctrl: ModalController, public viewCtrl: ViewController, public loginprovider: LoginserviceProvider, public alertCtrl: AlertController, public loader: LoaderserviceProvider, public navCtrl: NavController, public navParams: NavParams, public afauth: AngularFireAuth) {


    if (this.afauth.auth.currentUser != null || this.afauth.auth.currentUser != undefined) {
      if (this.afauth.auth.currentUser.emailVerified) {
        this.emailverified = true;
      }
    } else {
      this.emailverified = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeacherloginPage');
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

  login() {
    this.teachersarray = new Observable<any[]>();

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
      duration: 500
    });


    this.loader.loading.present().then(() => {
      this.afs.doc<any>('teachers/' + this.teacher_email).snapshotChanges().take(1).forEach(snap => {

        if (snap.payload.exists) {

          this.storage.set('user', 'teacher').then(res => {
            this.storage.set('email', this.teacher_email).then(res => {
              this.storage.set('password', this.teacher_password).then(res => {

                this.homeservice.storageSub.next('added-user');


                this.afauth.auth.signInWithEmailAndPassword(this.teacher_email, this.teacher_password).then(() => {
                  debugger
                  this.emailverified = this.afauth.auth.currentUser.emailVerified;
                  if (this.emailverified == false) {
  //                  this.loader.dismissloading();

                  } else {
                    this.storage.set('verified', true).then(()=>{
                      this.homeservice.storageSub.next('verified');
                    });

    //                this.loader.dismissloading();
                    this.viewCtrl.dismiss(true);
                  }




                }).catch(err => {
                  this.storage.clear().then(() => {
                    this.homeservice.storageSub.next('removed-all');

      //              this.loader.dismissloading();
                    this.presentAlert('Login Failed ', err);
                  }).catch(() => {
        //            this.loader.dismissloading();
                    this.presentAlert('Login Failed ', err);
                  })

                })
                // this.emailverified=true;
                // this.loader.dismissloading();
                // this.viewCtrl.dismiss(true);
              }).catch(err => {
             //   this.loader.dismissloading();
                this.presentAlert('Login Failed ', err);
              });
            }).catch(err => {

           //   this.loader.dismissloading();
              this.presentAlert('Login Failed ', err);
            });
          }).catch(err => {
          //  this.loader.dismissloading();
            this.presentAlert('Login Failed ', err);
          });

        }
      });



    });

  }
  googlelogin() {


  }

  register() {
    var person = 'Teacher';
    var modalPage = this.modalctrl.create('SignupModalPage', { person: person });
    modalPage.onDidDismiss(data => {
      if (data == true) {
        this.emailverified = this.afauth.auth.currentUser.emailVerified;
        if (this.emailverified == false) {
//          this.loader.dismissloading();

        } else {
                    this.storage.set('verified', true).then(()=>{
                      this.homeservice.storageSub.next('verified');
                    });
      //    this.loader.dismissloading();
          this.viewCtrl.dismiss(true);
        }

      }else if (data.email != undefined || data.email != null){
        this.teacher_email = data.email;
        this.teacher_password = data.password
        this.emailverified = this.afauth.auth.currentUser.emailVerified;
        if (this.emailverified == false) {
  //        this.loader.dismissloading();

        } else {
                    this.storage.set('verified', true).then(()=>{
                      this.homeservice.storageSub.next('verified');
                    });
        //  this.loader.dismissloading();
          this.viewCtrl.dismiss(true);
        }
      }
    });
    modalPage.present();
  }

  sendverification() {
    this.afauth.auth.currentUser.sendEmailVerification().then(() => {
      this.presentAlert('Verification Link Send ', 'Successfully');

    }).catch(err => {
      console.log(err);

      this.presentAlert('Verificaton Email Sending ', ' Failed ');
    });
  }

  verified() {
    /* this.afauth.auth.onAuthStateChanged(user=>{
       if (user && user.emailVerified){
          this.emailverified = true;
           this.navCtrl.popToRoot();
       }else{
         this.presentAlert('Email verification ', ' Failed');
       }
     })
     */
    this.login();
    // if (this.afauth.auth.currentUser.emailVerified ){
    //   this.emailverified = true;
    //   this.navCtrl.popToRoot();
    // }else{
    //   this.presentAlert('Email verfication ',' Failed ');
    // }
  }
}
