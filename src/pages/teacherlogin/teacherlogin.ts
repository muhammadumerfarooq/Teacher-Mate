import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { AngularFirestore, PersistenceSettingsToken } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
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

   
     teacher_email: string= "";
     teacher_password: string= "";
     emailverified: boolean = false;
     teachersarray: Observable<any[]>;
  constructor(public afs:AngularFirestore,public storage:Storage, public modalctrl: ModalController, public viewCtrl:ViewController, public loginprovider: LoginserviceProvider, public alertCtrl: AlertController, public loader: LoaderserviceProvider, public navCtrl: NavController, public navParams: NavParams, public afauth: AngularFireAuth) {
   

if (this.afauth.auth.currentUser != null || this.afauth.auth.currentUser != undefined){
    if (this.afauth.auth.currentUser.emailVerified ){
      this.emailverified = true;
    }
  }else {
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

  login(){
    this.teachersarray = new Observable<any[]>();
    let tcredts = {
      email: this.teacher_email,
      password: this.teacher_password
    }
    this.loader.loading = this.loader.loadingCtrl.create({
          
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

    });


    this.loader.loading.present().then(()=>{
      this.teachersarray =  this.afs.collection<any>('teachers').snapshotChanges().take(1).map(actions => {
        return actions.map(action => {
         
         console.log(action.payload.doc.id);
         
            if (action.payload.doc.id == tcredts.email){
              console.log(tcredts.email)
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
            return { id, ...data };
            }
        });
     
    })
    console.log(this.teachersarray);
    this.teachersarray.subscribe(res=>{
  //    console.log(res , tcredts.email);
     
     

      for (let i=0;i<res.length;i++){
        
      if (res[i] !=undefined &&  res[i].id == tcredts.email){
    
        
        console.log(this.afauth.auth.currentUser);
    //    if (this.afauth.auth.currentUser!= undefined && this.afauth.auth.currentUser!= null && this.afauth.auth.currentUser.emailVerified){
         
         this.storage.set('user', 'teacher').then(res=>{
          this.storage.set('email',tcredts.email).then(res=>{
            
            this.afauth.auth.signInWithEmailAndPassword(tcredts.email,tcredts.password).then(()=>{
              this.emailverified=this.afauth.auth.currentUser.emailVerified;
              this.loader.dismissloading();
              this.viewCtrl.dismiss(true);

             

         

            }).catch(err=>{
              this.storage.clear().then(()=>{
                this.loader.dismissloading();
                this.presentAlert('Login Failed ',err);
              }).catch(()=>{
                this.loader.dismissloading();
                this.presentAlert('Login Failed ',err);
              })

            })
            this.emailverified=true;
            this.loader.dismissloading();
            this.viewCtrl.dismiss(true);
          }).catch(err=>{
            
            this.loader.dismissloading();
            this.presentAlert('Login Failed ',err);
          });
        }).catch(err=>{
          this.loader.dismissloading();
          this.presentAlert('Login Failed ',err);
        });
     
       /* else{
          this.storage.set('user', 'teacher').then(res=>{
            this.storage.set('email',tcredts.email).then(res=>{
             
              this.afauth.auth.signInWithEmailAndPassword(tcredts.email,tcredts.password).then(res=> {
              
                this.emailverified=false;

                this.storage.clear().then(()=>{
                  this.loader.dismissloading();
                  this.viewCtrl.dismiss(true);
                }).catch((err)=>{
                  this.loader.dismissloading();
                  this.presentAlert('Login Failed ',err);
                });
  

              }).catch((err=>{
                this.loader.dismissloading();
                this.presentAlert('Login Failed ',err);
              }));
              
              this.loader.dismissloading();
              this.viewCtrl.dismiss(true);
            }).catch(err=>{
              
              this.loader.dismissloading();
              this.presentAlert('Login Failed ',err);
            });
          }).catch(err=>{
            this.loader.dismissloading();
            this.presentAlert('Login Failed ',err);
          });
        }
      */
  
    }
    /*else{
      
      this.loader.dismissloading();
      this.presentAlert('Login Failed ',' Username not found ');
      break;

    }
    */
    //else{
  //    this.loader.dismissloading();
    //  this.presentAlert(' login failed ',' no account found with this email address ')
   // }

  }
if (res.length == 0){
  this.loader.dismissloading();
  this.presentAlert(' login failed ',' no account found with this email address ')
}
          });

  
  });

}
  googlelogin(){
 
    
  }

  register(){
    var person = 'Teacher';
    var modalPage = this.modalctrl.create('SignupModalPage',{person: person});
    modalPage.onDidDismiss(data=>{
      if (data == true)
      {
        console.log(data+" teachersingup ")
        this.viewCtrl.dismiss(true);
      }
    });
    modalPage.present();
  }
  
  sendverification(){
    this.afauth.auth.currentUser.sendEmailVerification().then(()=>{
      this.presentAlert('Verification Link Send ','Successfully');
     
    }).catch(err=>{
      console.log(err);
      
      this.presentAlert('Verificaton Email Sending ',' Failed ');
    });
  }

  verified(){
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
