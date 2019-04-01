import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Courses, Chapters, Subtopics, Topics, CourseProvider } from '../../providers/course/course';
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

}
