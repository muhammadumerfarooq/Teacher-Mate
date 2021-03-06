import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { post, comments, likes } from '../create-post/create-post';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { PostProvider, Myfeed } from '../../providers/post/post';
import { notify } from '../../providers/notifications-service/notifications-service';
// import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

/**
 * Generated class for the PostDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage {
  mypost = new Myfeed();
  comments: number = 0;
  likes: number = 0;
  newcomment: string = '';
  commenttime: string = '';
  likedperson: string = '';
  constructor(private alertctrl: AlertController, private postservice: PostProvider, private homeservice: HomeServiceProvider, public navCtrl: NavController, public navParams: NavParams, private viewctrl: ViewController) {
    this.mypost = this.navParams.get('Myfeed');
    this.commenttime = this.navParams.get('commentedtime');
    this.likedperson = this.navParams.get('likedperson');
    console.log(this.commenttime + ' ' + this.likedperson);
    console.log(this.mypost);
    
    this.comments = Object.keys(this.mypost.comments).length
    this.likes = Object.keys(this.mypost.likes).length
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostDetailPage');
  }

  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  likeclick(feed: Myfeed) {

    let findemail = false;
    for (let i = 0; i < feed.likes.length; i++) {
      if (feed.likes[i].useremail == this.homeservice.userprofile.useremail) {
        findemail = true;
        break;
      }
    }
    if (!findemail) {
      let like: likes;
      like = new likes();
      
      like.date = new Date().getTime().toString();
      like.useremail = this.homeservice.useremail;

      like.userurl = this.homeservice.userprofile.imgurl;
     this.findimgurllike(like);

      let notifications: notify = new notify();

      notifications.classname = this.mypost.classid;
      notifications.classteacher = this.mypost.teacheremail;
      notifications.feedtitle = this.mypost.title;
      notifications.seen = 'false';
      notifications.userurl = this.homeservice.userprofile.imgurl;
      if (this.mypost.teacheremail != this.homeservice.useremail)
      notifications.message = this.homeservice.useremail + ' liked your Feed '
      else
      notifications.message = this.homeservice.useremail + ' liked own Feed '

      notifications.publisheddate = new Date().getTime().toString();
      notifications.useremail = this.homeservice.useremail;
      
      
      let tempfeed : Myfeed = new Myfeed();
      tempfeed = this.mypost;
      tempfeed.likes.push(like);

      this.postservice.updatedlikes(tempfeed, notifications).then(res => {
        if (res == 'done') {
       
        } else {
          this.presentAlert('like not updated ', 'Error');
          this.mypost.likes = this.mypost.likes.filter(item => item !== like);

        }
      }).catch(err => {
        this.presentAlert('like not updated ', err);
      });
    } else {
      this.presentAlert(' your post is already ', ' liked ');
    }
  }

  addcomment() {

    /* let findemail = false;
    for (let i = 0; i < this.mypost.likes.length; i++) {
      if (this.mypost.likes[i].useremail == this.homeservice.userprofile.useremail) {
        findemail = true;
        break;
      }
    }

    if (!findemail) {
      */
      let comment: comments = new comments();
      comment.comment = this.newcomment;
      comment.date = new Date().getTime().toString();

       this.findimgurlcomment(comment);
      comment.userurl = this.homeservice.userprofile.imgurl;
      comment.useremail = this.homeservice.useremail;
      

      let notifications: notify = new notify();

      notifications.classname = this.mypost.classid;
      notifications.classteacher = this.mypost.teacheremail;
      notifications.feedtitle = this.mypost.title;
      notifications.seen = 'false';
      notifications.userurl = this.homeservice.userprofile.imgurl;
      if (this.mypost.teacheremail != this.homeservice.useremail)
      notifications.message = this.homeservice.useremail + ' commented on your Feed '
      else
      notifications.message = this.homeservice.useremail + ' commented on own Feed '

      notifications.publisheddate = new Date().getTime().toString();
      notifications.useremail = this.homeservice.useremail;

      let tempfeed : Myfeed = new Myfeed();
      tempfeed = this.mypost;
      tempfeed.comments.push(comment);

      this.postservice.updatedcomments(tempfeed, notifications).then(res => {
        if (res == 'error') {
          this.presentAlert('Comment not Added ', 'Error');
          const index = this.mypost.comments.indexOf(comment);
          this.mypost.comments.splice(index);

          this.mypost.comments = this.mypost.comments.filter(item => item !== comment);
          this.newcomment = '';
        } else {
          this.newcomment = '';
        }

      }).catch(err => {
        this.presentAlert('Comment not Added ', 'Error');
      });
    } 
    // else {
    //   this.presentAlert(' you have already liked the post ', ' liked ');
    // }
  

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

  findimgurlcomment(comment:comments) {
    this.homeservice.allparents.forEach(parents => {
   if ( comment.useremail==parents.useremail){
    comment.useremail = parents.imgurl; 
    return comment;
   }
   
    });

    this.homeservice.allteachers.forEach(teachers => {
      if ( comment.useremail==teachers.useremail){
       comment.useremail = teachers.imgurl; 
       return comment;
      }
      
       });
   
  }

  findimgurllike(like:likes) {
    this.homeservice.allparents.forEach(parents => {
   if ( like.useremail==parents.useremail){
    like.userurl = parents.imgurl; 
    return like;
   }
   
    });

    this.homeservice.allteachers.forEach(teachers => {
      if ( like.useremail==teachers.useremail){
        like.userurl = teachers.imgurl; 
       return like;
      }
      
       });
   
  }
}
