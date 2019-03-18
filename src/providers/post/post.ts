
import { Injectable } from '@angular/core';
import { storage } from 'firebase';
import { post, likes, comments } from '../../pages/create-post/create-post';
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { NotificationsServiceProvider, notify } from '../notifications-service/notifications-service';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { ProfileServiceProvider } from '../profile-service/profile-service';


export class Myfeed {
  imgurl: string;
  title: string;
  description: string;
  classid: string;
  teacheremail: string;
  likes: Array<likes>;
  comments: Array<comments>;
  publisheddate: String;
  userurl: string;

}
/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostProvider {
  feed: Myfeed;
  anfeeds: AngularFirestoreCollection<Myfeed>;
  Feeds: Array<Myfeed> = new Array<Myfeed>();
  allfeeds: AngularFirestoreCollection<Myfeed>;
  teacheremail: string = '';
  classname: string = '';

  constructor(private profileservice: ProfileServiceProvider,private fileChooser: FileChooser, private filePath: FilePath, private fileservice: File, private notifyservice: NotificationsServiceProvider, private loader: LoaderserviceProvider, private afs: AngularFirestore, private localstorage: Storage) {



    this.localstorage.get('classteacher').then(val => {
      this.teacheremail = val;
      this.localstorage.get('classroom').then(v => {
        this.classname = v;

        this.allfeeds = this.afs.collection<Myfeed>('feeds', ref => {
          return ref.where('classid', '==', this.classname).where('teacheremail', '==', this.teacheremail)
        });


        this.allfeeds.snapshotChanges().forEach(snapshot => {
          this.Feeds = new Array<Myfeed>();
          snapshot.forEach(snap => {
            
            if (snap.payload.doc.exists) {
              let posts = new Myfeed();


              console.log(snap.payload.doc.data())
              posts = snap.payload.doc.data();
              if (posts.comments== undefined || posts.comments == null ){
                posts.comments = new Array<comments>();
              }
              else if (posts.comments.length == undefined || posts.comments.length == 0) {
                posts.comments = new Array<comments>();
              }
              if (posts.likes == undefined || posts.likes == null) {
                posts.likes = new Array<likes>();
              }
              else if (posts.likes.length == undefined || posts.likes.length == 0) {
                posts.likes = new Array<likes>();
              }
              this.findimgurl(posts);

              for (let i=0;i<posts.likes.length;i++){
                this.findimgurllike(posts.likes[i]);
              }
              for (let i=0;i<posts.comments.length;i++){
                this.findimgurlcomment(posts.comments[i]);
                
              }
              
              this.Feeds.push(posts);
            }

          })
        })
      }).catch();
    }).catch();


  }
  checkforduplicate() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.anfeeds = this.afs.collection<Myfeed>('feeds'
          , ref => {
            return ref.where("teacheremail", "==", this.teacheremail).where('classid', '==', this.classname).orderBy("publisheddate");
          });

        this.anfeeds.snapshotChanges().take(1).forEach(snap => {
          snap.forEach(snapshot => {

            if (snapshot.payload.doc.exists) {

              return resolve('exists');
            } else {

              return reject('error');
            }
          })
        })
      }, 500);
    })
  }

  postfeednotification(notifications: notify) {
    return new Promise((resolve, reject) => {
      this.notifyservice.insertnotification(notifications).then((res) => {
        if (res == 'done') {
          return resolve('done');
        } else {
          reject('error');
        }
      }).catch(err => {
        reject('error');
      });
    });

  }
  postmyfeed(post: post, notifications: notify) {

    return new Promise((resolve, reject) => {


      this.loader.loading = this.loader.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

      });
      setTimeout(() => {
        this.loader.loading.present().then(() => {
          let docid = new Date().getTime().toString();
          notifications.publisheddate = docid;

          let notifypromise = this.postfeednotification(notifications);

          this.feed = new Myfeed();
          this.feed.classid = post.classid;
          this.feed.comments = post.comments;
          this.feed.description = post.description;
          this.feed.likes = post.likes;
          this.feed.publisheddate = notifications.publisheddate;
          this.feed.teacheremail = post.teacheremail;
          this.feed.title = post.title;
          this.feed.userurl = post.userurl;
          const id = this.afs.createId();
          const pictures = storage().ref('post/' + id);
          pictures.putString(post.img, 'data_url').then(() => {

            storage().ref().child('post/' + id).getDownloadURL().then((url) => {

              this.feed.imgurl = url;

              const objectfeed = Object.assign({}, this.feed);
              objectfeed.comments = Object.assign({}, this.feed.comments);
              objectfeed.likes = Object.assign({}, this.feed.likes);

              notifypromise.then(result => {
                this.afs.collection<Myfeed>('feeds').doc(this.feed.publisheddate.toString()).set(objectfeed).then(() => {

                  this.loader.dismissloading();
                  return resolve('resolve');
                }).catch((err) => {

                  this.loader.dismissloading();
                  return resolve('error');
                });
              }).catch(error => {
                this.loader.dismissloading();
                return resolve('error');
              });



            }).catch((err) => {

              this.loader.dismissloading();
              return reject('error');
            });

          }).catch(err => {

            this.loader.dismissloading();
            return reject('error');
          });




        });
      }, 2000);

    });
  }

  updatedlikes(updatedfeed: Myfeed, notifications: notify) {

    return new Promise((resolve, reject) => {

      this.loader.loading = this.loader.loadingCtrl.create({

        content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,

      });
      setTimeout(() => {
        this.loader.loading.present().then(() => {

          const objectfeed = Object.assign({}, updatedfeed);
          //          objectfeed.comments = Object.assign({},updatedfeed.comments);

          
          objectfeed.comments = updatedfeed.comments.map((obj) => { return Object.assign({}, obj) });

          objectfeed.likes = updatedfeed.likes.map((obj) => { return Object.assign({}, obj) });

          this.notifyservice.insertnotification(notifications).then((res) => {
            if (res == 'done') {
              

              this.afs.collection("feeds/").doc(updatedfeed.publisheddate.toString()).update(objectfeed).then(res => {

                this.loader.dismissloading();
                return resolve('done');

              }).catch(err => {
                
                this.loader.dismissloading();
                return reject('error');
              });

            } else {
              
              this.loader.dismissloading();
              return reject('error');
            }
          }).catch(err => {
            
            this.loader.dismissloading();
            return reject('error');
          });


        });
      }, 250);

    });

  }

  updatedcomments(updatedfeed: Myfeed, notifications: notify) {

    return new Promise((resolve, reject) => {

      this.loader.loading = this.loader.loadingCtrl.create({

        content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,

      });
      setTimeout(() => {
        this.loader.loading.present().then(() => {

          try {

            const objectfeed = Object.assign({}, updatedfeed);
            // objectfeed.comments = Object.assign({},updatedfeed.comments);
            // objectfeed.likes = Object.assign({},updatedfeed.likes);



            objectfeed.comments = updatedfeed.comments.map((obj) => { return Object.assign({}, obj) });

            objectfeed.likes = updatedfeed.likes.map((obj) => { return Object.assign({}, obj) });

            this.notifyservice.insertnotification(notifications).then((res) => {
              if (res == 'done') {
                
                this.afs.collection("feeds/").doc(updatedfeed.publisheddate.toString()).update(objectfeed).then(res => {
                  
                  this.loader.dismissloading();
                  return resolve('done');

                }).catch(err => {
                  this.loader.dismissloading();
                  return reject('error');
                });

              } else {
                
                this.loader.dismissloading();
                return reject('error');
              }
            }).catch(err => {
              
              this.loader.dismissloading();
              return reject('error');
            });


          } catch (e) {
            
            this.loader.dismissloading();
            return reject('error');
          }

        });

      }, 2000);

    });

  }
  uploadfile(feeddata: Myfeed, resolvedFilePath: string) {

    return new Promise((resolve, reject) => {

      this.loader.loading = this.loader.loadingCtrl.create({

        content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,

      });
      setTimeout(() => {
        this.loader.loading.present().then(() => {

          this.fileChooser.open().then(file => {
            this.filePath.resolveNativePath(file).then(resolvedFilePath => {

              let filename = this.getfilename(resolvedFilePath);
              let fileext = this.getfileext(resolvedFilePath);
              this.makeFileIntoBlob(resolvedFilePath, fileext, "application/pdf").then((fileblob) => {

                const id = this.afs.createId();

                const pictures = storage().ref('blob/' + id + filename);
                pictures.put(fileblob, { contentType: "application/pdf" }).then(val => {
                  console.log(val);

                  const docid = this.afs.createId();
                 
                  this.afs.collection<Myfeed>('feeds/').doc(docid).set(feeddata);

                  this.loader.dismissloading();
                  return resolve('done');
                }).catch(err => {
                  this.loader.dismissloading();
                  return reject('error');
                });//
              }).catch(err => {
                this.loader.dismissloading();
                return reject('error');

              });

            }).catch(err => {
              alert(JSON.stringify(err));
            });
          }).catch(err => {
            alert(JSON.stringify(err));
          });
        })
      }, 2000);

    });

  }
  getfilename(filestring) {

    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    console.log(file.split('.'));
    
    return file;
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
  }

  makeFileIntoBlob(_imagePath, name, type) {
    var window;
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      this.fileservice.resolveLocalFilesystemUrl(_imagePath).then((fileEntry: any) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: type });
            imgBlob.name = name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });


      });

    });
  }

  findimgurlcomment(comment:comments) {
    
    this.profileservice.allparents.forEach(parents => {
   if ( comment.useremail==parents.useremail){
    comment.userurl = parents.imgurl; 
    return comment;
   }
   
    });

    this.profileservice.allteachers.forEach(teachers => {
      if ( comment.useremail==teachers.useremail){
       comment.userurl = teachers.imgurl; 
       return comment;
      }
      
       });
   
  }

  findimgurllike(like:likes) {
    this.profileservice.allparents.forEach(parents => {
   if ( like.useremail==parents.useremail){
    like.userurl = parents.imgurl; 
    return like;
   }
   
    });

    this.profileservice.allteachers.forEach(teachers => {
      if ( like.useremail==teachers.useremail){
        like.userurl = teachers.imgurl; 
       return like;
      }
      
       });
   
  }

  findimgurl(post:Myfeed) {


    this.profileservice.allteachers.forEach(teachers => {
      if ( post.teacheremail==teachers.useremail){
        post.userurl = teachers.imgurl; 
       return post;
      }
      
       });
   
  }
  deletepost(feed:Myfeed){
    return new Promise((resolve,reject)=>{
      this.afs.collection('feeds').doc(feed.publisheddate.toString()).delete().then(()=>{
        resolve('done');
      }).catch(err=>{
        reject('error');
      })
    });
   
  }
}
