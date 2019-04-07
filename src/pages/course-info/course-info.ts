import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Courses, Chapters,  Topics, CourseProvider } from '../../providers/course/course';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular/platform/platform';
import { DocumentViewer } from '@ionic-native/document-viewer';

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
  downloadSrc = "https://firebasestorage.googleapis.com/v0/b/wired-coffee-4f603.appspot.com/o/blob%2FfgTdNYr7tDyITjZt66lzAmazon.com%20-%20Order%20112-8920059-1225843.pdf?alt=media&token=3f0bf1a9-fe9b-4a76-9738-6bc6a03b7e3c";


  showLevel1 = null;
  showLevel2 = null;
  data = false;

  pages: any;

  mycourses: Courses = new Courses();
  files = new Map();

  constructor(private documentview: DocumentViewer,private filetransfer:FileTransfer,private file:File,private plateform: Platform,private fileChooser: FileChooser, private filePath: FilePath, private alertctrl: AlertController, private fileOpener: FileOpener, private courseservice: CourseProvider, private classprovider: ClassServiceProvider, public navCtrl: NavController, public navParams: NavParams, private viewctrl: ViewController) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseInfoPage');
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


  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }
  downaloadAndOpenfile(filename: string,fileurl:string, filetype: string){
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
    Quiz(courseid:string, topicname:string ){
      
    }
}
