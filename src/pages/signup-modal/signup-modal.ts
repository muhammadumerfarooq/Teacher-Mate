import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { SignupServiceProvider } from '../../providers/signup-service/signup-service';
import { Storage } from '@ionic/storage';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';


/**
 * Generated class for the SignupModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup-modal',
  templateUrl: 'signup-modal.html',
})

export class SignupModalPage implements OnInit  {
  
  ngOnInit(): void {
    console.log('in init');
    
  }

  person: string = '';
  signupform: FormGroup ;

  constructor(private formBuilder:FormBuilder,private homeservice:HomeServiceProvider,public storage: Storage,public viewCtrl:ViewController, public loaderservice:LoaderserviceProvider,public signupservice:SignupServiceProvider ,public alertCtrl :AlertController, public afauth:AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.person = this.navParams.get('person');

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
      ],
      username: ['', Validators.compose([
        Validators.required, Validators.pattern('[a-zA-Z ]*'),
         Validators.minLength(4), Validators.maxLength(10)])
      
    ],

    });

  }
  
  name: string = '';
  password: string = '';
  email: string = '';

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupModalPage');
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

  register(){
    if (this.signupform.controls.username.valid && this.signupform.controls.password.valid && this.signupform.controls.email.valid){

    if (this.person == 'Parent'){
    this.signupservice.parentsignup(this.email, this.name).then((val)=>{
      console.log(val);
      this.afauth.auth.createUserWithEmailAndPassword(this.email, this.password).then(val=>{
        this.storage.set('user','parent');
        this.storage.set('email',this.email).then(()=>{
          this.storage.set('password',this.password).then(()=>{
            this.homeservice.storageSub.next('added-user');

            let info = {
              email:this.email,
              password: this.password,
            }
            this.viewCtrl.dismiss(info);
          });

        });
        

      }).catch(()=>{
        this.viewCtrl.dismiss(true);
        this.presentAlert('Account not created ','Failed');
      })
    
    }, (err)=>{
      this.presentAlert('Account not created ','Failed');
    });
  }else{
    this.signupservice.teachersignup(this.email, this.name).then((val)=>{
      console.log(val);
      this.afauth.auth.createUserWithEmailAndPassword(this.email, this.password).then(val=>{
        this.storage.set('user','teacher').then(()=>{
        this.storage.set('email',this.email).then(()=>{
          
          this.storage.set('password',this.password).then(()=>{
            this.homeservice.storageSub.next('added-user');
            let info = {
              email:this.email,
              password: this.password,
            }
            this.viewCtrl.dismiss(info);
          });
        });

      });
      
      }).catch(()=>{ 
        this.presentAlert('Account not created ','Failed');
        this.viewCtrl.dismiss(false);
        
      });
     
    }, (err)=>{
      this.presentAlert('Account not created ','Failed');
    });
  }
    /*
    this.afauth.auth.createUserWithEmailAndPassword(this.email,this.password).then(()=>{
      this.afauth.auth.currentUser.sendEmailVerification().then(()=>{
       
        this.navCtrl.popToRoot();
      });
    })*/

  }else{
    this.presentAlert('Invalid insertion','Check inputs again')
  }
  }
  
}
