import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController, ToastController, AlertController, ViewController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { Platform, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomeServiceProvider } from '../../providers/home-service/home-service';

// import {OnInit} from '@angular/core';
// import { FCM } from '@ionic-native/fcm';
// import { ProfileServiceProvider, profile } from '../../providers/profile-service/profile-service';
import { TeachersServiceProvider } from '../../providers/teachers-service/teachers-service';

// import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  images :  String[] = [];
  public searchuser = {
    name: "name"
  }


  constructor(private viewctrl:ViewController,private teacherclass:TeachersServiceProvider,private modalCtrl: ModalController, public homeservice: HomeServiceProvider, public afAuth: AngularFireAuth, public alertctrl: AlertController, public toastctrl: ToastController, public modalctrl: ModalController, public platform: Platform, public actionsheetCtrl: ActionSheetController, private storage: Storage, public nav: NavController, public popoverCtrl: PopoverController) {
    console.log(this.homeservice.searchname);
   // this.presentCustomModal();
    /// this.searchuser.name = this.homeservice.searchname; 
    this.afAuth.auth.onAuthStateChanged(user => {

      console.log(user);

      if (user == undefined || user == null) {
        console.log('go to login');

        
       
        var modalPage = this.modalCtrl.create('LoginmenuPage');
        console.log('opening modal');
        modalPage.onDidDismiss(data=>{
          if (data == true)
          {
            console.log(data+" login menu home ");
         //   this.viewctrl.dismiss();
          }
        });
        
        modalPage.present();


      }

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
    this.storage.set('classroom', classname).then(()=>{
      this.storage.set('classteacher', classteacher).then(()=>{
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
        },
        {
          name: 'subject',
          placeholder: 'subject name',
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

            if (data.subject == '') {
              subject = data.subject;
            } else {
              subject = data.subject;
            }

            if (data.section == '') {
              section = data.section;
            } else {
              section = data.section;
            }
            

            this.images.push('assets/img/trip/thumb/brown.jpg');
            this.images.push('assets/img/trip/thumb/brushes.jpg');
            this.images.push('assets/img/trip/thumb/deepteal.jpg');
            this.images.push('assets/img/trip/thumb/light.jpg');
            this.images.push('assets/img/trip/thumb/tree.jpg');
            this.images.push('assets/img/trip/thumb/ltblue.jpg');
            this.images.push('assets/img/trip/thumb/beakers.jpg');

            const randid = Math.floor(Math.random() * 6); 
            let teacherclass = {
              email: this.afAuth.auth.currentUser.email,
              classname: classname,
              section: section,
              subject: subject,
              teachername: this.afAuth.auth.currentUser.email,
              backgroundimg: this.images[randid]
            };

            this.homeservice.addclassroom(teacherclass).then(res => {
              if (res == 'error') {
                this.presentAlert('Error', 'Cannot Create Classroom');
              } else {
           //     this.nav.push('TimelinePage');

                this.homeservice.getchatusers(classname, teacherclass.teachername);
                this.storage.set('classroom', classname).then(()=>{
                  this.storage.set('classteacher',  teacherclass.teachername).then(()=>{
                    this.homeservice.storageSub.next('class-added');

                    this.nav.push('TabsPage')
                  });

                });
              
              

              }

            }).catch(err => {
              this.presentAlert('Error', 'Cannot Create Classroom');
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
  presentCustomModal() {
    let customModal = this.modalCtrl.create('CustomModalPage');

    customModal.onDidDismiss((val) => {
        // Do what you want ...
        console.log(val);
    });

    // Present the modal
    customModal.present();
}

sendrequest(){
  let customModal = this.modalCtrl.create('SendRequestPage');

  customModal.onDidDismiss((val) => {
      // Do what you want ...
      console.log(val);
  });

  // Present the modal
  customModal.present();
}
  // initFCM(){
  //   this.fcm.onNotification().subscribe(data=>{
  //     if (data.wasTapped){
  //       console.log(data)
  //       this.presentAlert(data.title, data.content);
  //     }else{
  //       console.log(data);
  //       this.presentAlert(data.title, data.content);
  //     }
  //   })
  // }

}
