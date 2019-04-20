import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ElementRef, ViewChild } from '@angular/core';
import { ChatpublicServiceProvider, ChatMessage, UserInfo } from '../../providers/chatpublic-service/chatpublic-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

/**
 * Generated class for the ChatpublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatpublic',
  templateUrl: 'chatpublic.html',
})
export class ChatpublicPage {


  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  // msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;
  collectionid: string = '';
  constructor(private viewctrl:ViewController,private homeservice:HomeServiceProvider,navParams: NavParams,
    private chatService: ChatpublicServiceProvider,
    private events: Events, ) {
    // Get the navParams toUserId parameter

    this.toUser = navParams.get('toUser');
    this.collectionid = navParams.get('Colid');
    console.log(this.toUser, this.collectionid);

    // Get mock user information


    this.chatService.getUserInfo()
      .then((res) => {
        this.user = res

        this.chatService.getallmessages(this.collectionid).then(res => {
          console.log(res);
          
          for (let i = 0; i < res.length; i++) {

            let index = this.getMsgIndexById(res[i].messageId);
            if (index == -1) {
              res[i].status = 'success';
              this.pushNewMsg(res[i]);
            }
          }
          this.chatService.receivemessage(this.collectionid, this.user.toUserId, this.toUser.toUserId).then(val=>{
            this.scrollToBottom();
          });
        });
      });

  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    //  this.getMsg();

    // Subscribe to received  new message events
    this.events.subscribe('chat:received', msg => {
      console.log('message received');
      let index = this.getMsgIndexById(msg.messageId);
      if (index == -1) {
        msg.status = 'success';
        this.pushNewMsg(msg);
      }

    })
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  // not included 
  getMsg() {
    // Get mock message list
    // return this.chatService
    // .getMsgList()
    // .subscribe(res => {
    //   this.msgList = res;
    //   this.scrollToBottom();
    // });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = Date.now().toString();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.user.toUserId,
      userName: this.homeservice.username,
      userAvatar: this.homeservice.userprofile.imgurl,
      toUserId: this.toUser.toUserId,
      time: new Date(), //.getTime().toString(),
      message: this.editorMsg,
      status: 'pending',
     
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }
console.log(newMsg);
    this.chatService.sendMsg(newMsg, this.collectionid)
      .then((res) => {
        if (res == 'done') {
          let index = this.getMsgIndexById(id);
          if (index !== -1) {
          
            this.chatService.msgList[index].status = 'success';
          }
        } else {
          let index = this.getMsgIndexById(id);
          this.chatService.msgList[index].status = 'failed';
        }
      }).catch(err => {

      });
    console.log('Message passsed ');
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.toUserId,
      toUserId = this.toUser.toUserId;
    // Verify user relationships
    console.log(userId + " " + toUserId);

    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.chatService.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.chatService.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.chatService.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 100)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  viewctrl_dismiss(){
    this.viewctrl.dismiss('back');
  }
}
