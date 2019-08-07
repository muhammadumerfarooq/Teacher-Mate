import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, Alert, Platform } from 'ionic-angular';

import { Courses, Chapters, Topics, CourseProvider } from '../../providers/course/course';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
// import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

/**
 * Generated class for the CourseInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-info',
  templateUrl: 'course-info.html',
})
export class CourseInfoPage {

  refresher: any = "";
  showLevel1 = null;
  showLevel2 = null;
  data = false;

  pages: any;

  //mycourses: Courses = new Courses();
  files = new Map();

  constructor(private alertCtrl: AlertController, private homeservice: HomeServiceProvider, private class_service: ClassServiceProvider, private modalctrl: ModalController, private documentview: DocumentViewer, private filetransfer: FileTransfer, private file: File, private plateform: Platform, private fileChooser: FileChooser, private filePath: FilePath, private alertctrl: AlertController, private fileOpener: FileOpener, private courseservice: CourseProvider, public navCtrl: NavController, public navParams: NavParams, private viewctrl: ViewController) {
    
  //  console.log(this.homeservice.user)
    this.courseservice.getcourses();

  }

 
  onPullToRefresh(refresher){
    this.courseservice.getcourses();
    
    setTimeout(() => {
      

    
      refresher.complete();
    }, 500);
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseInfoPage');
  }
  toggleLevel1(idx) {
    console.log(this.courseservice.coursesdropdown[idx]);
    if (this.courseservice.coursesdropdown[idx] == false) {
      this.courseservice.coursesdropdown[idx] = true;
    } else {
      this.courseservice.coursesdropdown[idx] = false;
    }
    /*
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }*/
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.courseservice.coursesdropdown[idx];
    // return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };


  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }
  downaloadAndOpenfile(filename: string, fileurl: string, filetype: string) {
    if (filename  == "" || filetype == "" || fileurl == ""){
      this.presentAlert('No File Exists ','');
    }else{
    let path = null;
    if (this.plateform.is('ios')) {
      path = this.file.documentsDirectory;
    } else {
      path = this.file.externalApplicationStorageDirectory;
    }
    const transfer = this.filetransfer.create();
    transfer.download(fileurl, path + filename + '.' + filetype).then(entry => {
      // this.presentAlert('file path ',path+'myfile.'+filetype);
      // let url = entry.toURL();

      let fileMIMEType = this.getMIMEtype(filetype);

      this.fileOpener.open(path + filename + '.' + filetype, fileMIMEType).then(file => {
        //   alert(file);

        //   alert("It worked!")
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    });
    //   this.documentview.viewDocument(url,'application/'+filetype,{});
    // }).catch(err=>{
    //   this.presentAlert('Error ',err);
    // });
  }
  }


  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

  Quiz(courseid: string, topicname: string) {

    let quizinfo = {
      classname: this.homeservice.classroom, // this.class_service.classname,
      classteacher: this.homeservice.classteacher, //this.class_service.classteacher,
      courseid: courseid,
      topicname: topicname
    }
    var modalPage = this.modalctrl.create('DisplayQuizPage', { quizinfo: quizinfo });
    modalPage.onDidDismiss(data => {
      if (data == true) {



      } else if (data == false) {

      } else if (data == 'back') {

      }
    });
    modalPage.present();


  }
  findcourses() {
    this.courseservice.getcourses();
  }

  deletetopic(courseindex: number, chapindex: number, topindex: number) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Topic',
      message: 'Are you sure you want to Delete this Topic From Syllabus?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.courseservice.allcourses[courseindex].creationdate
            let tempcourse: Courses;
            tempcourse = new Courses();
            tempcourse.classname = this.courseservice.allcourses[courseindex].classname;
            tempcourse.classteacher = this.courseservice.allcourses[courseindex].classteacher;
            tempcourse.creationdate = this.courseservice.allcourses[courseindex].creationdate;

            let i_index = 0;
            let j_index = 0;
            for (let i = 0; i < this.courseservice.allcourses[courseindex].Chapters.length; i++) {

              tempcourse.Chapters[i_index] = new Chapters();
              tempcourse.Chapters[i_index].value = this.courseservice.allcourses[courseindex].Chapters[i].value;



              j_index = 0;
              for (let j = 0; j < this.courseservice.allcourses[courseindex].Chapters[i].Topics.length; j++) {

                if (j != topindex) {
                  tempcourse.Chapters[i_index].Topics[j_index] = new Topics;
                  tempcourse.Chapters[i_index].Topics[j_index].filename = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filename;
                  tempcourse.Chapters[i_index].Topics[j_index].filepath = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filepath;
                  tempcourse.Chapters[i_index].Topics[j_index].filestatus = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filestatus;
                  tempcourse.Chapters[i_index].Topics[j_index].filetext = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filetext;
                  tempcourse.Chapters[i_index].Topics[j_index].fileurl = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].fileurl;
                  tempcourse.Chapters[i_index].Topics[j_index].value = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].value;

                  j_index++;
                }
              }
              i_index++;

            }

            this.courseservice.update_course(tempcourse).then(res => {
              this.presentAlert('Topic Deleted', '');

            }).catch(err => {
              this.presentAlert('Error Deleting Topic', ' ');
            });
          }
        }
      ]
    });
    confirm.present();
  }

  deletechap(courseindex: number, chapindex: number) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Chapter',
      message: 'Are you sure you want to Delete this Chapter From Syllabus?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.courseservice.allcourses[courseindex].Chapters.length > 1) {
              this.courseservice.allcourses[courseindex].creationdate
              let tempcourse: Courses;
              tempcourse = new Courses();
              tempcourse.classname = this.courseservice.allcourses[courseindex].classname;
              tempcourse.classteacher = this.courseservice.allcourses[courseindex].classteacher;
              tempcourse.creationdate = this.courseservice.allcourses[courseindex].creationdate;

              let i_index = 0;
              let j_index = 0;
              for (let i = 0; i < this.courseservice.allcourses[courseindex].Chapters.length; i++) {
                if (i != chapindex) {
                  tempcourse.Chapters[i_index] = new Chapters();
                  tempcourse.Chapters[i_index].value = this.courseservice.allcourses[courseindex].Chapters[i].value;



                  j_index = 0;
                  for (let j = 0; j < this.courseservice.allcourses[courseindex].Chapters[i].Topics.length; j++) {


                    tempcourse.Chapters[i_index].Topics[j_index] = new Topics;
                    tempcourse.Chapters[i_index].Topics[j_index].filename = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filename;
                    tempcourse.Chapters[i_index].Topics[j_index].filepath = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filepath;
                    tempcourse.Chapters[i_index].Topics[j_index].filestatus = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filestatus;
                    tempcourse.Chapters[i_index].Topics[j_index].filetext = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].filetext;
                    tempcourse.Chapters[i_index].Topics[j_index].fileurl = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].fileurl;
                    tempcourse.Chapters[i_index].Topics[j_index].value = this.courseservice.allcourses[courseindex].Chapters[i].Topics[j].value;

                    j_index++;

                  }
                  i_index++;
                }


              }

              this.courseservice.update_course(tempcourse).then(res => {
                this.presentAlert('Chapter Deleted', '');

              }).catch(err => {
                this.presentAlert('Error Deleting Chapter', ' ');
              });
            }
            else {
              this.courseservice.delete_course(this.courseservice.allcourses[courseindex].creationdate).then(res => {
                this.presentAlert('Chapter Deleted', '');

              }).catch(err => {
                this.presentAlert('Error Deleting Chapter', ' ');
              });
            }
          }
        }
      ]
    });



    confirm.present();

  }
}
