import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Events } from 'ionic-angular';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs';
// import 'rxjs/add/observable/of';
import { of } from 'rxjs';
import { teacher } from '../../models/teacher';
import { Timestamp } from 'rxjs/internal-compatibility';
import { Time } from '@angular/common';
import { HomeServiceProvider } from '../home-service/home-service';

/*
  Generated class for the ChatpublicServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: Date;// number | string;
  message: string;
  status: string;

}

export class UserInfo {
  toUserId: string;
  toUserName?: string;
  avatar?: string;
}

export class  Chatroom {
  colid: string;
  parentemail: string;
  teacheremail: string;
  firstemail: string
}

@Injectable()
export class ChatpublicServiceProvider {

  msgList: ChatMessage[] = [];
  Allfriends: AngularFirestoreCollection<any>; 
  Allmessages: AngularFirestoreCollection<any>;

  constructor(private homeservice:HomeServiceProvider,private events:Events, private afauth:AngularFireAuth, private afs:AngularFirestore, private loaderservice:LoaderserviceProvider) {

    console.log('Hello ChatpublicServiceProvider Provider');

    this.Allfriends = this.afs.collection('/chatroom');

  }
  receivemessage(colid: string, friendname: string, userid: string ) {
  
  return new Promise((resolve,reject)=>{
     setTimeout(() => {
       
    
    let message: Array<ChatMessage> = [];

     this.afs.collection<ChatMessage>('/'+colid, ref=>{
      return ref.where('toUserId','==',friendname)
    }).snapshotChanges().forEach(snap=>{
      snap.forEach(snapshot=>{
        if (this.msgList.indexOf(snapshot.payload.doc.data() as ChatMessage)){
         // chatlist.push(snapshot.payload.doc.data());
        
         console.log( snapshot.payload.doc.data())
        // this.events.publish('chat:received', snapshot.payload.doc.data(), Date.now());
  
       let index = this.getMsgIndexById(snapshot.payload.doc.data().messageId);
       if (index == -1) {
        snapshot.payload.doc.data().status = 'success';
         this.pushNewMsg( snapshot.payload.doc.data() as ChatMessage, userid , friendname);
       }

        }
        
      })
      return resolve( message);
    }).then(res=>{
      console.log('message got ')
  
    }).catch(err=>{
      console.log('error got ')
      return reject('error');
    })
    
  }, 1000);
  });
  }


  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  findfriendcol( friend, fromuser){
    let collectionid = '';
    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
          
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

    });
    return new Promise((resolve,reject)=>{


    this.loaderservice.loading.present().then(res=> {
      setTimeout(() => {
        let parentname = '';
        let teachername = '';
      
       if (friend.user == 'parent'){
          parentname = friend.id;
       }
      else if (friend.user =='teacher' ){
        teachername = friend.id;
       }
       if (fromuser == 'parent'){
        parentname = this.afauth.auth.currentUser.email;
       }else if (fromuser == 'teacher'){
        teachername = this.afauth.auth.currentUser.email;
       }
       console.log(parentname, teachername);
       
         this.afs.collection<Chatroom>('/chatroom' , ref=> {
          return ref.where('parentemail','==',parentname).where('teacheremail','==',teachername).where('classroom','==',this.homeservice.classroom);
        }).snapshotChanges().forEach(snapshot=> {
            if (snapshot.length == 0){
              const id = this.afs.createId();
              const colid = this.afs.createId();
             
              this.afs.doc('/chatroom/'+id).set({
                parentemail: parentname,
                teacheremail: teachername,
                colid: colid,
                classroom: this.homeservice.classroom
              });
              console.log(colid)
              resolve(colid);
              this.loaderservice.loading.dismiss();
            }else{
              let data : Chatroom;
              console.log(snapshot[0].payload.doc.id)
             
                
                data = snapshot[0].payload.doc.data();
             
              resolve(data.colid)
              this.loaderservice.loading.dismiss();
            }
          })

}, 1500 );

});
});
// console.log('friends');

}
pushNewMsg(msg: ChatMessage, userId: string, toUserId: string) {

  // Verify user relationships
  console.log(userId+" "+toUserId);
  
  if (msg.userId === userId && msg.toUserId === toUserId) {
    this.msgList.push(msg);
  } else if (msg.toUserId === userId && msg.userId === toUserId) {
    this.msgList.push(msg);
  }
  this.scrollToBottom();
}

scrollToBottom() {
  setTimeout(() => {
    // if (this.content.scrollToBottom) {
    //   this.content.scrollToBottom();
    // }
  }, 400)
}

mockNewMsg(msg) {
  const mockMsg: ChatMessage = {
    messageId: Date.now().toString(),
    userId: '210000198410281948',
    userName: 'Hancock',
    userAvatar: './assets/to-user.jpg',
    toUserId: '140000198202211138',
    time: new Date(),
    message: msg.message,
    status: 'success'
  };

  setTimeout(() => {
    this.events.publish('chat:received', mockMsg, Date.now())
  }, Math.random() * 1800)
}


sendMsg(msg: ChatMessage, colid: string) {
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      const id = this.afs.createId();
      msg.status = 'success'
      this.afs.collection<ChatMessage>('/'+colid).doc(id).set(msg).then(()=>{
        resolve('done');
      }).catch(()=>{
        reject('error');
      });
    }, 500);
  })
 // return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
 // .then(() => this.mockNewMsg(msg));
}

getUserInfo(): Promise<UserInfo> {
  const userInfo: UserInfo = {
    toUserId: this.afauth.auth.currentUser.email,
    toUserName: '',
    avatar: './assets/user.jpg'
  };
  return new Promise(resolve => resolve(userInfo));
}

getallmessages(colid:string): Promise<any[]>{
  this.msgList = [];
  this.loaderservice.loading = this.loaderservice.loadingCtrl.create({
          
    content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
duration: 1500
  });
  let messages: ChatMessage[] = [];
  return  new Promise((resolve, reject)=>{
    this.loaderservice.loading.present().then(()=>{
      
    setTimeout(() => {
      
   
  this.afs.collection<ChatMessage>('/'+colid, ref=>{
    return ref.orderBy('time','asc');
  }).get().take(1).forEach(snap=>{
    console.log(snap.docs.length)
    let mydate = '';
    snap.forEach(snapshot=>{


      let tempchat:ChatMessage = snapshot.data() as ChatMessage;
      messages.push(tempchat);
     
    })
    console.log('in getall');
    resolve(messages);
  })
 // .then(val=>{

 // })

//  this.loaderservice.loading.dismiss();
}, 1500);

});

});

}

}
