import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController, ToastController, AlertController, ViewController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { Platform, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomeServiceProvider } from '../../providers/home-service/home-service';

// import {OnInit} from '@angular/core';
// import { FCM } from '@ionic-native/fcm';
 import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { TeachersServiceProvider } from '../../providers/teachers-service/teachers-service';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';

// import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  images: String[] = [];
  public searchuser = {
    name: "name"
  }

  emailVerified: boolean = false;

  constructor(private profileservice:ProfileServiceProvider,private afs: AngularFirestore, private loader: LoaderserviceProvider, private viewctrl: ViewController, private teacherclass: TeachersServiceProvider, private modalCtrl: ModalController, public homeservice: HomeServiceProvider, public afAuth: AngularFireAuth, public alertctrl: AlertController, public toastctrl: ToastController, public modalctrl: ModalController, public platform: Platform, public actionsheetCtrl: ActionSheetController, private storage: Storage, public nav: NavController, public popoverCtrl: PopoverController) {
    console.log(this.homeservice.searchname);


    this.afAuth.auth.onAuthStateChanged(user => {

      this.loader.loading = this.loader.loadingCtrl.create({

        content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box"> loading... </div>
          </div>`,
        duration: 500
      });


      this.loader.loading.present().then(() => {

        console.log(user);

        if ((this.afAuth.auth.currentUser == null || this.afAuth.auth.currentUser == undefined) || (this.afAuth.auth.currentUser.emailVerified == null || this.afAuth.auth.currentUser.emailVerified == undefined)) {
          this.emailVerified = false;
        }
        else {
          if (this.homeservice.useremail == null || this.homeservice.useremail == undefined) {
            this.homeservice.useremail = this.afAuth.auth.currentUser.email;
          }
          if (this.homeservice.emailVerified == null || this.homeservice.emailVerified == undefined || this.homeservice.emailVerified == false) {
            this.homeservice.emailVerified = this.afAuth.auth.currentUser.emailVerified;
          }

          this.emailVerified = this.afAuth.auth.currentUser.emailVerified;
          if (this.homeservice.userprofile.useremail == null || this.homeservice.userprofile.useremail == undefined) {
     
              console.log('go to login');
      
              
             this.storage.clear();
              var callmodalPage = this.modalCtrl.create('LoginmenuPage');
              console.log('opening modal');
              callmodalPage.onDidDismiss(data=>{
                if (data == true)
                {
                  console.log(data+" login menu home ");
               //   this.viewctrl.dismiss();
                }
              });
              
              callmodalPage.present();
      
      
      
          }
        }


        if (user == undefined || user == null) {
          console.log('go to login');


          this.storage.clear();
          var modalPage = this.modalCtrl.create('LoginmenuPage');
          console.log('opening modal');
          modalPage.onDidDismiss(data => {
            if (data == true) {
              console.log(data + " login menu home ");
              //   this.viewctrl.dismiss();
            }
          });

          modalPage.present();


        }

      });
    });
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // console.log(this.fcm);

    //   this.initFCM();
  }

  ionViewWillEnter() {
    // this.search.pickup = "Rio de Janeiro, Brazil";
    // this.search.dropOff = "Same as pickup";



  }

  // go to result page
  doSearch() {
    //  this.nav.push(TripsPage);
  }

  // choose place
  choosePlace(from) {
    //  this.nav.push(SearchLocationPage, from);
  }

  // to go account page
  goToAccount() {
    //  this.nav.push(SettingsPage);
  }

  presentNotifications(myEvent) {
    // console.log(myEvent);
    // let popover = this.popoverCtrl.create(NotificationsPage);
    // popover.present({
    //   ev: myEvent
    // });
  }


  viewClassroom(classname: any, classteacher: any) {
    this.homeservice.getchatusers(classname, classteacher);
    this.storage.set('classroom', classname).then(() => {
      this.storage.set('classteacher', classteacher).then(() => {
        this.homeservice.storageSub.next('class-added');

        this.nav.push('TabsPage')
      });
    });


  }

  classoptions() {
    let createjoinclass = this.alertctrl.create({
      title: 'Create/Join class',
      buttons: [
        {
          text: 'Create',
          handler: data => {
            console.log('Create clicked');
            this.createclassroom();
          }
        },

        {
          text: 'Join',
          handler: data => {
            console.log('Join clicked');
            console.log(data);
            this.joinclassroom();
          }
        }
      ],

    });
    createjoinclass.present();
  }

  joinclassroom() {
    let joinclass = this.alertctrl.create({
      title: 'Join class',
      message: "Enter Class Code",
      inputs: [
        {
          name: 'classcode',
          placeholder: 'class code',
          type: 'name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Join',
          handler: data => {
            console.log('Join clicked');
            console.log(data);
            let classname = '';

            if (data.classcode == '') {
              let toast = this.toastctrl.create({
                message: 'Classcode must not be empty',
                duration: 1000,
                position: 'middle'
              });

              toast.onDidDismiss(() => {
                console.log('Dismissed toast');
              });

              toast.present();
            } else {

              classname = data.classcode;
              this.homeservice.findclassroom(classname).then(res => {
                if (res == 'found') {

                } else if (res == 'notfound') {
                  this.presentAlert('classcode ', ' not found ')
                } else if (res == 'error') {
                  this.presentAlert('classcode ', ' not found ')
                }
              }).catch(err => {
                this.presentAlert('error ', ' not found ')
              });
            }



          }
        }
      ]
    });
    joinclass.present();
  }

  createclassroom() {
    let createclass = this.alertctrl.create({
      title: 'Create class',
      message: "Class name(required)",
      inputs: [
        {
          name: 'classname',
          placeholder: 'class name',
          type: 'name'
        },
        {
          name: 'section',
          placeholder: 'section name',
          type: 'name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Create',
          handler: data => {
            console.log('Create clicked');
            console.log(data);
            let classname = '';
            let subject = '';
            let section = '';
            if (data.classname == '') {
              classname = data.classname;
            } else {
              classname = data.classname;
            }

            // if (data.subject == '') {
            //   subject = data.subject;
            // } else {
            //   subject = data.subject;
            // }

            if (data.section == '') {
              section = data.section;
            } else {
              section = data.section;
            }

            let quizcolor: Array<string> =  new Array<string>();
            
        
            quizcolor.push('#78BD83');
            quizcolor.push('#F08D45');
            quizcolor.push('#E829BA');
            quizcolor.push('#16CEE0');
            quizcolor.push('#CEBF0A');
            quizcolor.push('#432B9C');
            quizcolor.push('#DF9FD6');
            quizcolor.push( '#3285C2');
            quizcolor.push('#B5E61B');
            quizcolor.push('#D70EFF');
            
            // this.images.push('assets/img/trip/thumb/brown.jpg');
            // this.images.push('assets/img/trip/thumb/brushes.jpg');
            // this.images.push('assets/img/trip/thumb/deepteal.jpg');
            // this.images.push('assets/img/trip/thumb/light.jpg');
            // this.images.push('assets/img/trip/thumb/tree.jpg');
            // this.images.push('assets/img/trip/thumb/ltblue.jpg');
            // this.images.push('assets/img/trip/thumb/beakers.jpg');

            const randid = Math.floor(Math.random() * 4);
            let teacherclass = {
              email: this.afAuth.auth.currentUser.email,
              classname: classname,
              section: section,
              // subject: subject,
              teachername: this.homeservice.username,
              backgroundimg: quizcolor[randid]
            };

            this.homeservice.addclassroom(teacherclass).then(res => {
              if (res == 'error') {
                this.presentAlert('Error', 'Cannot Create Classroom');
              } else {
                //     this.nav.push('TimelinePage');

                this.homeservice.getchatusers(classname, teacherclass.teachername);
                this.storage.set('classroom', classname).then(() => {
                  this.storage.set('classteacher', teacherclass.teachername).then(() => {
                    this.homeservice.storageSub.next('class-added');

                    this.nav.push('TabsPage')
                  });

                });



              }

            }).catch(err => {
              this.presentAlert('Error', 'Cannot Create Classroom'+ err);
            });


          }
        }
      ]
    });
    createclass.present();
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  

  sendrequest() {
    let customModal = this.modalCtrl.create('SendRequestPage');

    customModal.onDidDismiss((val) => {
      // Do what you want ...
      console.log(val);
    });

    // Present the modal
    customModal.present();
  }
  sendverification() {
    this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
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

  login() {
    // this.teachersarray = new Observable<any[]>();

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 500
    });


    this.loader.loading.present().then(() => {

      this.afs.doc<any>('teachers/' + this.homeservice.useremail).snapshotChanges().take(1).forEach(snap => {

        if (snap.payload.exists) {

          // this.storage.set('user', 'teacher').then(res => {
          //   this.storage.set('email', this.homeservice.useremail).then(res => {

          // this.homeservice.storageSub.next('added-user');


          this.afAuth.auth.signInWithEmailAndPassword(this.homeservice.useremail, this.homeservice.userpassword).then(() => {

            this.emailVerified = this.afAuth.auth.currentUser.emailVerified;
             
            if (this.emailVerified == false) {
              this.presentAlert('Email Not Verified', ' Make Sure to Open Your Mail For Verification');
              //         this.loader.dismissloading();

            } else {
              this.presentAlert('Email Verified Successfully', '');
              this.emailVerified = true;
              this.storage.set('verified', true).then(() => {
                this.homeservice.storageSub.next('verified');
              })
              //         this.loader.dismissloading();
            }




          }).catch(err => {
            this.storage.clear().then(() => {
              this.homeservice.storageSub.next('removed-all');

              //     this.loader.dismissloading();
              this.presentAlert('Login Failed ', err);
            }).catch(() => {
              //       this.loader.dismissloading();
              this.presentAlert('Login Failed ', err);
            })

          })
          // this.emailverified=true;
          // this.loader.dismissloading();
          // this.viewCtrl.dismiss(true);
          //   }).catch(err => {

          //     this.loader.dismissloading();
          //     this.presentAlert('Login Failed ', err);
          //   });
          // }).catch(err => {
          //   this.loader.dismissloading();
          //   this.presentAlert('Login Failed ', err);
          // });
        }
      })



    });

  }
}
