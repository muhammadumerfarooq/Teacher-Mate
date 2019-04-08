import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Courses, CourseProvider } from '../../providers/course/course';
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the CourseDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-details',
  templateUrl: 'course-details.html',
})
export class CourseDetailsPage {
 mycourses: Courses = new Courses();
 showLevel1 = null;
 showLevel2 = null;

 constructor(private file:File, private filetransfer:FileTransfer, private fileOpener:FileOpener ,private plateform:Platform,private viewctrl:ViewController,public navCtrl: NavController, public navParams: NavParams, private courseservice:CourseProvider) {
    this.mycourses = this.navParams.get('mycourses');
    
    
  }

  ionViewDidLoad() {
  console.log('CoursesDetailpage');
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
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
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  addSyllabus(){
    this.courseservice.insert_course(this.mycourses).then(res=>{
      if (res != 'inserted'){
      this.viewctrl.dismiss(false);
      }else{
        this.viewctrl.dismiss(true);
      }
    }).catch(err=>{
      this.viewctrl.dismiss(false);
    });
  }

  downaloadAndOpenfile(filename : string,fileurl:string, filetype: string){
    let path = null;
    if (this.plateform.is('ios') ){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalApplicationStorageDirectory;
    }
    const transfer = this.filetransfer.create();
    transfer.download(fileurl, path+filename+'.'+filetype).then(entry=>{
     // this.presentAlert('file path ',path+'myfile.'+filetype);
     // let url = entry.toURL();
      
      let fileMIMEType=this.getMIMEtype(filetype);
    
      this.fileOpener.open(path+filename+'.'+filetype, fileMIMEType).then(file => {
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
    
      
    getMIMEtype(extn){
      let ext=extn.toLowerCase();
      let MIMETypes={
        'txt' :'text/plain',
        'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc' : 'application/msword',
        'pdf' : 'application/pdf',
        'jpg' : 'image/jpeg',
        'bmp' : 'image/bmp',
        'png' : 'image/png',
        'xls' : 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'rtf' : 'application/rtf',
        'ppt' : 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      }
      return MIMETypes[ext];
    }
}
