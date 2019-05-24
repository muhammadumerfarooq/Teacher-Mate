// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/take';
import {
  AngularFirestore,
  AngularFirestoreCollection
  // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { Storage } from '@ionic/storage';
import { profile } from '../profile-service/profile-service';
import { Subject, Observable } from 'rxjs';


/*
  Generated class for the HomeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class userprofile {
  username: string;
  user: string;
  imgurl: string;
  useremail: string;
  constructor() {
    this.user = '';
    this.username = '';
    this.imgurl = '';
    this.useremail = '';
  }
}
export class chats {
  useremail: string;
  user: string
  constructor() {
    this.user = '';
    this.useremail = '';
  }
}
export class classroom {
  teacheremail: string;
  classname: string;
  section: string;
  // subject: string;
  parentsemail: Array<string>
  imgurl: string;
  backgroundimg: string;
  classid: string;
  teachername:string;
  constructor() {
    this.teacheremail = '';
    this.classname = '';
    this.section = '';
    // this.subject = '';
    this.parentsemail = new Array<string>();
    this.imgurl = '';
    this.backgroundimg = '';
    this.classid = '';
    this.teachername = '';
  }
}

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}


@Injectable()
export class HomeServiceProvider {
  chatusers: Array<chats> = [];
  classroomdoc: AngularFirestoreCollection<classroom>;


  homeclass: Array<any> = [];
  home: Array<any> = [];
  myclassroom: Array<classroom> = [];

  classfound: boolean = false;
  userprofile = new userprofile();
  searchname: string = "";
  public storageSub = new Subject<string>();


  username: string = '';
  useremail: string = '';
  useroccupation: string = '';
  user: string = '';
  allparents = Array<userprofile>();
  allteachers = Array<userprofile>();
  classroom: string;
  classteacher: string;
  userpassword: string = '';
  emailVerified: boolean = false;
  appMenuItems: Array<MenuItem>;

  constructor(public storage: Storage, public afs: AngularFirestore, public afAuth: AngularFireAuth, public loaderservice: LoaderserviceProvider, public alertCtrl: AlertController) {


    this.watchStorage().subscribe((data: string) => {

      if (data == 'class-added') {
        this.storage.get('classroom').then(res => {
          this.classroom = res;
        });
        this.storage.get('classteacher').then(res => {
          this.classteacher = res;
        });

        if (this.user=='parents'){
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
            {title: 'Students List', component: 'StudentListPage', icon: 'people'},
            {title: 'Your Child', component: 'YourChild', icon: 'person'},
            {title: 'Courses Info', component: 'CourseInfo', icon: 'paper'},
            {title: 'Quizes Results', component: 'QuizResults', icon: 'book'},
            
          ];
        }else{
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
            {title: 'Students List', component: 'StudentListPage', icon: 'people'},
            {title: 'Add Student', component: 'AddStudent', icon: 'person-add'},
            {title: 'Courses Info', component: 'CourseInfo', icon: 'paper'},
            {title: 'Add Courses', component: 'AddCoursesPage', icon: 'create'},
            {title: 'Quizes Results', component: 'QuizResults', icon: 'book'},
            {title: 'Results Type', component: 'Marks', icon: 'clipboard'},
            {title: 'Student Portfolio', component: 'portfolio', icon: 'trophy'},
            {title: 'performance charts ', component: 'charts', icon: 'trophy'},
            
          ];
        }


      } else if (data == 'removed-all') {
        if (this.user=='parents'){
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
           
            {title: 'Your Child', component: 'YourChild', icon: 'person'},
         
          ];
        }else{
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},

          ];
        }
      }
      else if (data =='removed-class'){
        if (this.user=='parents'){
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
           
            {title: 'Your Child', component: 'YourChild', icon: 'person'},
         
          ];
        }else{
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},

          ];
        }
      }
      else if (data == 'verified') {

        this.storage.get('verified').then(val => {
          this.emailVerified = val;

        });
      }
      else if (data == 'added-user') {

        this.storage.get('email').then(val => {

          this.useremail = val;

          this.storage.get('password').then(val => {

            this.userpassword = val;
          });
          this.storage.get('user').then(occ => {

            this.useroccupation = occ;
            if (occ == 'parent') {
              this.user = 'parents';
            } else {
              this.user = 'teachers';
            }
            //   this.homeservice.storageSub.next(true);

            if (this.user == 'parents') {
              this.searchname = this.user;
              this.afs.collection<classroom>('classroom').snapshotChanges().subscribe(snap => {
                this.myclassroom = new Array<classroom>();
                snap.forEach(snapshot => {

                  console.log(snapshot);
                  let myposts: classroom = snapshot.payload.doc.data() as classroom;


                  let j = 0;
                  myposts.parentsemail = [];
                  while (j > -1) {
                    if (snapshot.payload.doc.data().parentsemail != undefined && snapshot.payload.doc.data().parentsemail[j] != undefined) {
                      myposts.parentsemail.push(snapshot.payload.doc.data().parentsemail[j])
                    } else {
                      break;
                    }
                    j++;
                  }

                  if (myposts.parentsemail.indexOf(this.useremail)>-1) {
                    this.myclassroom.push(myposts);
                    this.classfound = true;


                  }
                });
              });
            } else if (this.user == 'teachers') {
              this.searchname = this.user;
              this.classroomdoc = this.afs.collection<classroom>('classroom'
                , ref => {
                  return ref.where("teacheremail", "==", this.useremail); //.orderBy("teacheremail");
                });
              // console.log('in user');
              this.classroomdoc.snapshotChanges().forEach(snap => {
                this.myclassroom = new Array<classroom>();
                snap.forEach(snapshot => {
                  console.log(snapshot);

                  this.classfound = true;

                  let myposts: classroom = snapshot.payload.doc.data() as classroom;


                  let j = 0;
                  myposts.parentsemail = [];
                  while (j > -1) {
                    if (snapshot.payload.doc.data().parentsemail != undefined && snapshot.payload.doc.data().parentsemail[j] != undefined) {
                      myposts.parentsemail.push(snapshot.payload.doc.data().parentsemail[j])
                    } else {
                      break;
                    }
                    j++;
                  }


                  this.myclassroom.push(myposts);
                });
              });
            }

            if (this.user != undefined && this.user != '') {
              this.afs.doc<profile>(this.user + "/" + this.useremail).snapshotChanges().forEach(snap => {
                if (snap.payload.exists) {
                  let tempprofile = new profile();
                  tempprofile = snap.payload.data() as profile;
                  this.userprofile.imgurl = tempprofile.imgurl;
                  this.userprofile.username = tempprofile.username;
                  this.userprofile.user = tempprofile.user;
                  this.userprofile.useremail = this.useremail;
                }
              })
            }
            this.afs.doc<profile>(this.user + "/" + this.useremail).snapshotChanges().take(1).forEach(snap => {
              if (snap.payload.exists) {
                let userinfo: profile = snap.payload.data();
                this.username = userinfo.username;
              }
            });



          });
        });
      }



    });

    this.storage.get('classroom').then(res => {
      this.classroom = res;
    });
    this.storage.get('classteacher').then(res => {
      this.classteacher = res;
    })

    this.storage.get('email').then(val => {
      
      this.useremail = val;


      this.storage.get('password').then(val => {
      //  debugger
        this.userpassword = val;
      });

      this.storage.get('verified').then(val => {
      //  debugger
        this.emailVerified = val;
      });

      this.storage.get('user').then(occ => {
        this.useroccupation = occ;
        if (occ == 'parent') {
          this.user = 'parents';
        } else {
          this.user = 'teachers';
        }

        if (this.user=='parents'){
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},
            {title: 'Your Child', component: 'YourChild', icon: 'person'},
    
          ];
        }else{
          this.appMenuItems = [
            {title: 'Home', component: 'HomePage', icon: 'home'},

          ];
        }


        this.afs.doc<profile>(this.user + "/" + this.useremail).snapshotChanges().take(1).forEach(snap => {

          if (snap.payload.exists) {
            let userinfo: profile = snap.payload.data();
            this.username = userinfo.username;

          }
        });

        if (this.user == 'parents') {
          this.searchname = this.user;
          
          this.afs.collection<classroom>('classroom').snapshotChanges().forEach(snap => {

            this.myclassroom = new Array<classroom>();
            snap.forEach(snapshot => {
              console.log(snapshot);
              let myposts: classroom = snapshot.payload.doc.data() as classroom;

              let j = 0;
              myposts.parentsemail = [];
              while (j > -1) {
                if (snapshot.payload.doc.data().parentsemail != undefined && snapshot.payload.doc.data().parentsemail[j] != undefined) {
                  myposts.parentsemail.push(snapshot.payload.doc.data().parentsemail[j])
                } else {
                  break;
                }
                j++;
              }

              if (myposts.parentsemail.length == undefined || myposts.parentsemail.length == 0) {
                myposts.parentsemail = new Array<string>();
              }
              
              if (myposts.parentsemail.indexOf(this.useremail)>-1){
                this.myclassroom.push(myposts);
                this.classfound = true;
                console.log(this.emailVerified)

              }
            });
          });
        } else if (this.user == 'teachers') {
          this.searchname = this.user;
          this.afs.collection<classroom>('classroom'
            , ref => {
              return ref.where("teacheremail", "==", this.useremail); //.orderBy("teacheremail");
            }).snapshotChanges().forEach(snap => {
              this.myclassroom = new Array<classroom>();
              snap.forEach(snapshot => {
                console.log(snapshot);
                this.classfound = true;
                let myposts: classroom = snapshot.payload.doc.data() as classroom;

                let j = 0;

                myposts.parentsemail = [];

                while (j > -1) {
                  if (snapshot.payload.doc.data().parentsemail != undefined && snapshot.payload.doc.data().parentsemail[j] != undefined) {
                    myposts.parentsemail.push(snapshot.payload.doc.data().parentsemail[j])
                  } else {
                    break;
                  }
                  j++;
                }


                this.myclassroom.push(myposts);
              });
            });
        }

        if (this.user != undefined && this.user != '') {
          this.afs.doc<profile>(this.user + "/" + this.useremail).snapshotChanges().forEach(snap => {
            if (snap.payload.exists) {
              let tempprofile = new profile();
              tempprofile = snap.payload.data() as profile;
              this.userprofile.imgurl = tempprofile.imgurl;
              this.userprofile.username = tempprofile.username;
              this.userprofile.user = tempprofile.user;
              this.userprofile.useremail = this.useremail;
            }
          })
        }
      });
    });

    this.afs.collection<userprofile>('parents').snapshotChanges().forEach(snap => {
      this.allparents = new Array<userprofile>();
      snap.forEach(snapshot => {


        if (snapshot.payload.doc.exists) {
          let parent = new userprofile();
          parent = snapshot.payload.doc.data() as userprofile;
          let userprof: userprofile = new userprofile();
          userprof.imgurl = parent.imgurl;
          userprof.username = parent.username;
          userprof.user = parent.user;
          userprof.useremail = snapshot.payload.doc.id;

          this.allparents.push(userprof);
        }
      })
    })

    this.afs.collection<userprofile>('teachers').snapshotChanges().forEach(snap => {
      this.allteachers = new Array<userprofile>();
      snap.forEach(snapshot => {


        if (snapshot.payload.doc.exists) {
          let teacher = new userprofile();
          teacher = snapshot.payload.doc.data() as userprofile;
          let userprof: userprofile = new userprofile();
          userprof.imgurl = teacher.imgurl;
          userprof.username = teacher.username;
          userprof.user = teacher.user;
          userprof.useremail = snapshot.payload.doc.id;

          this.allteachers.push(userprof);
        }
      })
    })

  }




  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

  deleteclassroom(classname, classteacher){
    return new Promise((resolve, reject) => {
      let id = this.afs.createId();


      
      
      try {

 

        this.afs.collection('classroom', ref=>{
          return ref.where('classname','==',classname).where('classteacher','==',classteacher);
        }).get().take(1).forEach(snap=>{
        if (snap.empty){
          return reject('error');
        }else{
          snap.forEach(snapshot=>{
            snapshot.ref.delete();
            return resolve('done');
          })
        }
        });
      }catch(err){
        return reject('error');
      }
    });
  } 
   addclassroom(teacherclass) {

    return new Promise((resolve, reject) => {
      let id = this.afs.createId();


      let tempclass = new classroom();
      tempclass.teacheremail = teacherclass.email;
      tempclass.parentsemail = [],
        tempclass.section = teacherclass.section;
      // tempclass.subject = teacherclass.subject;
      tempclass.classname = teacherclass.classname;
      tempclass.imgurl = this.userprofile.imgurl;
      tempclass.backgroundimg = teacherclass.backgroundimg;
      tempclass.classid = id;
      tempclass.teachername = teacherclass.teachername;
      
      try {

        const objectclass = Object.assign({}, tempclass);
        objectclass.parentsemail = Object.assign({}, tempclass.parentsemail);


        this.afs.collection<classroom>('classroom').doc(id).set(objectclass
        ).then(res => {

          resolve('done');

        }).catch(err => {

          console.log(err);

          reject('error');
        });
      } catch (e) {

        reject('error');
      }
    });

  }
  findclassroom(docid: string) {
    return new Promise((resolve, reject) => {

      this.afs.doc<classroom>('classroom/' + docid).get().take(1).subscribe(ref => {
        if (ref.exists) {


          console.log(ref.data());

          var data: classroom = ref.data() as classroom;
          let j = 0;
          data.parentsemail = [];
          while (j > -1) {
            if (ref.data().parentsemail != undefined && ref.data().parentsemail[j] != undefined) {
              data.parentsemail.push(ref.data().parentsemail[j])
            } else {
              break;
            }
            j++;
          }
          console.log(data);


          if (data.parentsemail != undefined || data.parentsemail != null) {

            let index = data.parentsemail.indexOf(this.afAuth.auth.currentUser.email);
            console.log(index);
            if (index < 0) {
              this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

                content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,

              });
              setTimeout(() => {

                this.loaderservice.loading.present().then(() => {

                  data.parentsemail.push(this.afAuth.auth.currentUser.email)

                  let updatedclass = new classroom();
                  updatedclass.teacheremail = data.teacheremail;
                  updatedclass.parentsemail = data.parentsemail;
                  updatedclass.section = data.section;
                  // updatedclass.subject = data.subject;
                  updatedclass.classname = data.classname;
                  updatedclass.imgurl = this.userprofile.imgurl;
                  updatedclass.backgroundimg = data.backgroundimg;
                  updatedclass.classid = docid;
                  updatedclass.teachername = data.teachername;

                  const objectclass = Object.assign({}, updatedclass);
                  objectclass.parentsemail = Object.assign({}, updatedclass.parentsemail);

                  this.afs.doc<classroom>('classroom/' + docid).update(objectclass
                  ).then(() => {
                    resolve('join')
                    this.loaderservice.dismissloading();
                  }).catch((err) => {
                    console.log(err);
                    reject('error')
                    this.loaderservice.dismissloading();
                  });

                }).catch((err) => {
                  console.log(err);
                  reject('error')
                  this.loaderservice.dismissloading();
                })
              }, 500);
            }

          } else {
            this.loaderservice.dismissloading();
            resolve('added');

          }

        } else {

          reject('notfound');
        }
      });
    });
  }


  addparent(parentemail: string, docid: string) {
    return new Promise((resolve, reject) => {
      // let id = this.afs.createId();

      this.afs.doc<classroom>('classroom/' + docid).get().take(1).subscribe(ref => {
        if (ref.exists) {


          console.log(ref.data());

          var data: classroom = ref.data() as classroom;
          let j = 0;
          data.parentsemail = [];
          while (j > -1) {
            if (ref.data().parentsemail != undefined && ref.data().parentsemail[j] != undefined) {
              data.parentsemail.push(ref.data().parentsemail[j])
            } else {
              break;
            }
            j++;
          }
          console.log(data);


          if (data.parentsemail != undefined || data.parentsemail != null) {

            let index = data.parentsemail.indexOf(parentemail);
            console.log(index);
            if (index < 0) {
              this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

                content: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"> loading... </div>
                </div>`,

              });
              setTimeout(() => {

                this.loaderservice.loading.present().then(() => {

                  data.parentsemail.push(parentemail);

                  let updatedclass = new classroom();
                  updatedclass.teacheremail = data.teacheremail;
                  updatedclass.parentsemail = data.parentsemail;
                  updatedclass.section = data.section;
                  // updatedclass.subject = data.subject;
                  updatedclass.classname = data.classname;
                  updatedclass.imgurl = this.userprofile.imgurl;
                  updatedclass.backgroundimg = data.backgroundimg;
                  updatedclass.classid = docid;
                  updatedclass.teachername = data.teachername;

                  const objectclass = Object.assign({}, updatedclass);
                  objectclass.parentsemail = Object.assign({}, updatedclass.parentsemail);


                  this.afs.doc<classroom>('classroom/' + docid).update(objectclass
                  ).then(() => {

                    resolve('added')
                    this.loaderservice.dismissloading();
                  }).catch((err) => {

                    console.log(err);
                    reject('error')
                    this.loaderservice.dismissloading();
                  });

                }).catch((err) => {

                  console.log(err);
                  reject('error')
                  this.loaderservice.dismissloading();
                })
              }, 500);
            }

          } else {
            this.loaderservice.dismissloading();
            resolve('added');

          }

        } else {

          resolve('notfound');
        }
      });
    });
  }


  getchatusers(classname: string, teacheremail: string) {

    this.chatusers = [];

    this.myclassroom.forEach(element => {
      if (element.classname == classname && element.teacheremail == teacheremail) {

        element.parentsemail.forEach(ele => {
     
          if(ele != this.useremail && this.user != 'parents'){
          let val: chats = {
            useremail: ele,
            user: 'parent'
          };
          
          this.chatusers.push(val);
        }
        });

      }
      if (element.classname == classname){
      let val: chats = {
        useremail: element.teacheremail,
        user: 'teacher'
      };
      this.chatusers.push(val);
    }
    });
    
  }

}
