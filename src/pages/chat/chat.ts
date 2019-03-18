import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatpublicServiceProvider } from '../../providers/chatpublic-service/chatpublic-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  user: string = '';
  toUser : {toUserId: string, toUserName: string};
  friends: Observable<any[]>;
  constructor(public viewctrl:ViewController,private modalctrl:ModalController,private storage: Storage, private homeservice :HomeServiceProvider,private chatpublicservice: ChatpublicServiceProvider,public chatservice:ChatServiceProvider, public afauth:AngularFireAuth, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    
    this.friends = this.chatservice.getall(this.homeservice.chatusers);
    
    this.friends.subscribe(res=>{
      console.log(res);
      
    })
    this.storage.get('user').then(v=>{
      
      if (v=='parent'){
        this.user = 'teachers';
      }else{
        this.user = 'parents';
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }
  // goToProfileFriend(sliding, friend: Friend) {
  //   sliding.close();
  //   this.navCtrl.push('ProfileFriendPage', {friend});
  // }

  goToChatRoom(friend: any) {
    console.log(friend);
    this.storage.get('user').then(val=>{
      let user = "";
      if (val == 'parent'){
        user = 'parent';
      }else if (val == 'teacher'){
        user = 'teacher'
      }
      this.chatpublicservice.findfriendcol(friend,user ).then(res=>{
        console.log(res);
        this.toUser = {
          toUserId:friend.id, 
          toUserName:friend.name
        }
      //  this.navCtrl.push('ChatpublicPage',{
      //    toUser: this.toUser,
      //    Colid: res
      //  });

           
    var modalPage = this.modalctrl.create('ChatpublicPage' ,{
      toUser: this.toUser,
      Colid: res
    });
    modalPage.onDidDismiss(data=>{
     if (data == true)
     {
       console.log(data+" chat page ")
      // this.viewCtrl.dismiss(true);
     }

   });
    modalPage.present();
    
      });
  
    })
    
    
   // this.navCtrl.push('ChatRoomPage', {friend});
  }

  viewctrl_dismiss(){
    this.viewctrl.dismiss('back');
  }

}
