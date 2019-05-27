import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
// import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the ParentloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parentlogin',
  templateUrl: 'parentlogin.html',
})
export class ParentloginPage implements OnInit  {
  
  ngOnInit(): void {
    console.log('in init');
    
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    /*this.signupform = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
    */
  }
  parent_email: string = "";
  parent_password: string = "";
  emailverified: boolean = false;
  parentsarray: Observable<any[]>;
 // userData = { "username": "", "password": "", "email": "", "name": "" };
  signupform: FormGroup ;

  constructor( private formBuilder:FormBuilder,private homeservice:HomeServiceProvider,private afs: AngularFirestore, private loader: LoaderserviceProvider, public loaderserivce: LoaderserviceProvider, public storage: Storage, public modalctrl: ModalController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public afauth: AngularFireAuth, public alertCtrl: AlertController) {

    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = this.formBuilder.group({
      email: [
        '', Validators.compose([
          Validators.pattern(EMAILPATTERN),
          Validators.required
        ])
      ],
      password: [
        '', Validators.compose([
        
          Validators.required, Validators.minLength(6), Validators.maxLength(12)
        ])
      ]
    });

    if (this.afauth.auth.currentUser != null || this.afauth.auth.currentUser != undefined) {
      if (this.afauth.auth.currentUser.emailVerified) {
        this.emailverified = true;
      }
    } else {
      this.emailverified = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentloginPage');
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
    if (this.signupform.controls.email.valid && this.signupform.controls.name.valid){
    console.log(this.parent_email, " ", this.parent_password)
    // this.loginprovider.findteacher(tcredts);
    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,
duration: 500
    });
    this.loader.loading.present().then(() => {
      
      this.afs.doc<any>('parents/' + this.parent_email).snapshotChanges().take(1).forEach(snap => {
       
          if (snap.payload.exists) {
            this.storage.set('user', 'parent').then(res => {
              this.storage.set('email', this.parent_email).then(res => {

                this.storage.set('password', this.parent_password).then(res => {

                  this.homeservice.storageSub.next('added-user');

                this.afauth.auth.signInWithEmailAndPassword(this.parent_email, this.parent_password).then(() => {
               
                  this.emailverified = this.afauth.auth.currentUser.emailVerified;
                  if (this.emailverified == false){
               //     this.loader.dismissloading();
  
                  }else{


                    this.storage.set('verified', true).then(()=>{
                      this.homeservice.storageSub.next('verified');
                    });
                 // this.loader.dismissloading();
                  this.viewCtrl.dismiss(true);
                  }






                }).catch(err => {
                  this.storage.clear().then(() => {
                    this.homeservice.storageSub.next('removed-all');

                    //this.emailverified=true;
               //     this.loader.dismissloading();
                    this.presentAlert('Login Failed ', err);
                  }).catch(() => {
                    // this.emailverified=true;
              //      this.loader.dismissloading();
                    this.presentAlert('Login Failed ', err);
                  })

                })
                // this.emailverified=true;
                // this.loader.dismissloading();
                // this.viewCtrl.dismiss(true);
                }).catch(err => {

                  //  this.loader.dismissloading();
                    this.presentAlert('Login Failed ', err);
                  });
              }).catch(err => {

              //  this.loader.dismissloading();
                this.presentAlert('Login Failed ', err);
              });
            }).catch(err => {
         //     this.loader.dismissloading();
              this.presentAlert('Login Failed ', err);
            });
          }
       else{
        this.presentAlert('Login Failed ', '');

       }
      });



    });
  }else{
    this.presentAlert('Invalid Insertion! ','check again');
  }
  }



 
  register() {
    var person = 'Parent';
    var modalPage = this.modalctrl.create('SignupModalPage', { person: person });
    modalPage.onDidDismiss(data => {
      if (data == true) {
        console.log(data + " parentsignup ")
          
        this.emailverified = this.afauth.auth.currentUser.emailVerified;
        if (this.emailverified == false){
     //     this.loader.dismissloading();

        }else{
          this.storage.set('verified', true).then(()=>{
            this.homeservice.storageSub.next('verified');
          });      
          
          //this.loader.dismissloading();
        this.viewCtrl.dismiss(true);
        }

      }else if (data!=undefined && (data.email != undefined || data.email != null)){
        this.parent_email = data.email;
        this.parent_password = data.password
        this.emailverified = this.afauth.auth.currentUser.emailVerified;
        if (this.emailverified == false) {
   //       this.loader.dismissloading();

        } else {
                    this.storage.set('verified', true).then(()=>{
                      this.homeservice.storageSub.next('verified');
                    });
     //     this.loader.dismissloading();
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
      this.presentAlert('Verificaton Email Sending ', ' Failed ');
    });
  }

  verified() {
    /* if (this.afauth.auth.currentUser.emailVerified ){
      this.emailverified = true;
      this.navCtrl.popToRoot();
    }else{
      this.presentAlert('Email verfication ',' Failed ');
    }
    */
    this.login();
  }
  forgotPass(){
    var modalPage = this.modalctrl.create('ResetPasswordPage');
    modalPage.onDidDismiss(data => {
    
    });
    modalPage.present();
  }
}
