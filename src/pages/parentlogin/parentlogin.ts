import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';


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
export class ParentloginPage {
  parent_email: string= "";
  parent_password: string= "";
  emailverified: boolean = false;
  parentsarray: Observable<any[]>;

constructor(private afs:AngularFirestore, private loader:LoaderserviceProvider,public loaderserivce:LoaderserviceProvider,public storage:Storage,public modalctrl: ModalController, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams, public afauth: AngularFireAuth, public alertCtrl:AlertController) {


if (this.afauth.auth.currentUser != null || this.afauth.auth.currentUser != undefined){
 if (this.afauth.auth.currentUser.emailVerified ){
   this.emailverified = true;
 }
}else {
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

login(){
console.log(this.parent_email, " ", this.parent_password)
 // this.loginprovider.findteacher(tcredts);
 this.loader.loading = this.loader.loadingCtrl.create({
          
  content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,

});
this.loader.loading.present().then(()=>{
  this.parentsarray =  this.afs.collection<any>('parents').snapshotChanges().take(1).map(actions => {
   return actions.map(action => {
     console.log(action.payload.doc.id);
     
        if (action.payload.doc.id == this.parent_email){
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
        return { id, ...data };
        }
    });
 
})
console.log(this.parentsarray);
this.parentsarray.subscribe(res=>{
  console.log(res);
  for (let i=0;i<res.length;i++){   
    debugger
    if (res[i] !=undefined &&  res[i].id == this.parent_email){
    
        
      console.log(this.afauth.auth.currentUser);
       
       this.storage.set('user', 'parent').then(res=>{
        this.storage.set('email',this.parent_email).then(res=>{
          
          this.afauth.auth.signInWithEmailAndPassword(this.parent_email,this.parent_password).then(()=>{
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
      
      /*else{
        this.storage.set('user', 'parent').then(res=>{
          this.storage.set('email',this.parent_email).then(res=>{
           
            this.afauth.auth.signInWithEmailAndPassword(this.parent_email,this.parent_password).then(res=> {
            
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
      }*/
    

  }
  /*else{
    
    this.loader.dismissloading();
    this.presentAlert('Login Failed ',' Username not found ');
    break;

  }*/
  }
  if (res.length==0){
    this.loader.dismissloading();
    this.presentAlert(' login failed ',' no account found with this email address ')
  }
});


});
 

}
googlelogin(){

 
}

register(){
 var person = 'Parent';
 var modalPage = this.modalctrl.create('SignupModalPage',{person: person});
 modalPage.onDidDismiss(data=>{
  if (data == true)
  {
    console.log(data+" parentsignup ")
    this.viewCtrl.dismiss(true);
  }
});
 modalPage.present();
}

sendverification(){
 this.afauth.auth.currentUser.sendEmailVerification().then(()=>{
   this.presentAlert('Verification Link Send ','Successfully');
 }).catch(err=>{
   this.presentAlert('Verificaton Email Sending ',' Failed ');
 });
}

verified(){
 /* if (this.afauth.auth.currentUser.emailVerified ){
   this.emailverified = true;
   this.navCtrl.popToRoot();
 }else{
   this.presentAlert('Email verfication ',' Failed ');
 }
 */
this.login();
}

}
