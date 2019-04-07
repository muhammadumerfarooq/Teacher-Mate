import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';


import { Courses, Chapters, Topics, CourseProvider } from '../../providers/course/course';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular/platform/platform';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { ViewController } from 'ionic-angular/navigation/view-controller';
/**
 * Generated class for the AddCoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-courses',
  templateUrl: 'add-courses.html',
})
export class AddCoursesPage {
  showLevel1 = null;
  showLevel2 = null;
  data = false;

  pages: any;

  mycourses: Courses = new Courses();
  files = new Map();

  constructor(private modalctrl:ModalController,private documentview: DocumentViewer,private filetransfer:FileTransfer,private file:File,private plateform: Platform,private fileChooser: FileChooser, private filePath: FilePath, private alertctrl: AlertController, private fileOpener: FileOpener, private courseservice: CourseProvider, private classprovider: ClassServiceProvider, public navCtrl: NavController, public navParams: NavParams,  private viewctrl: ViewController) {
       

    // this.topics.push({'value':''});
    //  this.mycourses.Chapters.push(new Chapters);
    //  this.mycourses.Chapters[0].value = '';
    //  this.mycourses.Topics[0].subtopics.push(new Subtopics);
    //  this.mycourses.Topics[0].subtopics[0].value = '';

    // this.getMenus()
    // .subscribe((response)=> {
    //     this.pages = response;
    //     console.log(this.pages);
    // });
  }

  // getMenus(){
  //   return this.http.get('assets/data/menus.json').pipe(
  //    map((response:Response)=>response.json()));
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCoursesPage');
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


  addChapter() {
    let chapterindex = this.mycourses.Chapters.length;
    this.mycourses.Chapters.push(new Chapters());

  }
 /* addSubtopic() {
    let chapterindex = this.mycourses.Chapters.length;
    let topindex = this.mycourses.Chapters[chapterindex - 1].Topics.length;


    this.mycourses.Chapters[chapterindex - 1].Topics[topindex - 1].subtopics.push(new Subtopics);

    let index = this.mycourses.Chapters[chapterindex - 1].Topics[topindex - 1].subtopics.length;

    this.mycourses.Chapters[chapterindex - 1].Topics[topindex - 1].subtopics[index - 1].value = '';

    console.log(this.mycourses.Chapters)
    // console.log(this.anArray);
    //  this.anArray.push({'value':''});
  }
*/
  addTopics() {

    let chapterindex = this.mycourses.Chapters.length;

    this.mycourses.Chapters[chapterindex - 1].Topics.push(new Topics());
    let topindex = this.mycourses.Chapters[chapterindex - 1].Topics.length;
    this.mycourses.Chapters[chapterindex - 1].Topics[topindex - 1].value = '';

    console.log(this.mycourses.Chapters)


  }

  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  addSyllabus() {
    this.mycourses.creationdate = new Date().getTime().toString();
    this.mycourses.classteacher = this.classprovider.classteacher;
    this.mycourses.classname = this.classprovider.classname;

//    this.courseservice.insert_course(this.mycourses)
debugger
    
    var modalPage = this.modalctrl.create('CourseDetailsPage', { mycourses: this.mycourses });
    modalPage.onDidDismiss(data => {
      if (data == true) {
        this.presentAlert(' Course Added ', 'Successfully ');

      } else if (data == false) {
        this.presentAlert('Error', ' courses not added ');
      } 
    });
    modalPage.present();
  }


  openfile_topic(chap, top) {
    this.fileChooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {


        this.mycourses.Chapters[chap].Topics[top].filename = this.getfilename(resolvedFilePath);
        this.mycourses.Chapters[chap].Topics[top].filepath = resolvedFilePath;
        this.mycourses.Chapters[chap].Topics[top].filetype = this.getfiletype(resolvedFilePath);
        this.mycourses.Chapters[chap].Topics[top].filestatus = 'pending';

        let result = this.files.get(this.mycourses.Chapters[chap].Topics[top].filename);
        if (result == 'error' || result == '' || result == undefined || result == null) {



          this.mycourses.Chapters[chap].Topics[top].filetext = this.getfileext(resolvedFilePath);
          this.courseservice.uploadfiletopic(resolvedFilePath, this.mycourses.Chapters[chap].Topics[top].filename, this.mycourses.Chapters[chap].Topics[top].filetext, this.mycourses.Chapters[chap].Topics[top].filetype).then((val) => {
            let value: string = val.toString();
            if (value=='error'){
              this.mycourses.Chapters[chap].Topics[top].fileurl = '';
              this.mycourses.Chapters[chap].Topics[top].filestatus = 'error';              
              this.files.set(this.mycourses.Chapters[chap].Topics[top].filename, 'error');
              this.presentAlert(' Uplaoding ', ' Failed ');

            }else{
            this.mycourses.Chapters[chap].Topics[top].fileurl = value;
            this.mycourses.Chapters[chap].Topics[top].filestatus = 'uploaded';
            this.files.set(this.mycourses.Chapters[chap].Topics[top].filename, value);
            this.presentAlert(' Uploaded ', 'Successfully');
            }
          }).catch(err => {
            this.presentAlert('Error ', err.toString());
            this.mycourses.Chapters[chap].Topics[top].fileurl = '';
            this.mycourses.Chapters[chap].Topics[top].filestatus = 'error';
            this.files.set(this.mycourses.Chapters[chap].Topics[top].filename, 'error');
            this.presentAlert(' Uplaoding ', ' Failed ');
            debugger
          });
        }
        else {
          this.mycourses.Chapters[chap].Topics[top].fileurl = result;
          this.mycourses.Chapters[chap].Topics[top].filestatus = 'uploaded';
          this.presentAlert(' Uploaded ', 'Successfully');
        }
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }
/*
  openfile_subtopic(chap, top, i) {
    this.fileChooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {

  
        this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename = this.getfilename(resolvedFilePath);
        this.mycourses.Chapters[chap].Topics[top].subtopics[i].filepath = resolvedFilePath;
        this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetype = this.getfiletype(resolvedFilePath);

        let result = this.files.get(this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename);

        if (result == '' || result == undefined || result == null || result == 'error') {

          this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetext = this.getfileext(resolvedFilePath);
          this.courseservice.uploadfiletopic(resolvedFilePath, this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename, this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetext, this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetype).then((val) => {
            let value: string = val.toString();

            if (value=='error'){
            this.mycourses.Chapters[chap].Topics[top].subtopics[i].filestatus = 'error';
            this.files.set(this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename, 'error');
            this.presentAlert(' Uplaoding ', ' Failed ');
            this.mycourses.Chapters[chap].Topics[top].subtopics[i].fileurl = '';
            }else{
              this.mycourses.Chapters[chap].Topics[top].subtopics[i].fileurl = value;
              this.mycourses.Chapters[chap].Topics[top].subtopics[i].filestatus = 'uploaded';
              this.files.set(this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename, 'uploaded');
              this.presentAlert(' Uploaded ', 'Successfully');

            }
          }).catch(err => {
            this.presentAlert('Error ', err.toString());
            this.mycourses.Chapters[chap].Topics[top].subtopics[i].fileurl = '';
            this.mycourses.Chapters[chap].Topics[top].subtopics[i].filestatus = 'error';
            this.files.set(this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename, 'error');
            this.presentAlert(' Uplaoding ', ' Failed ');
            debugger

          });

        }
        else {
          this.mycourses.Chapters[chap].Topics[top].subtopics[i].fileurl = result;
          this.mycourses.Chapters[chap].Topics[top].subtopics[i].filestatus = 'uploaded';
          this.presentAlert(' Uploaded ', 'Successfully');
        }
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }
*/
  getfilename(filestring) {

    let file
    file = filestring.replace(/^.*[\\\/]/, '')

    // this.presentAlert(file.split('.')[0], file.split('.')[1]);
    // console.log(file.split('.'));

    return file;
  }
  getfiletype(filestring) {
    let file
    file = filestring.replace(/^.*[\\\/]/, '')

    // this.presentAlert(file.split('.')[0], file.split('.')[1]);
    let filetype = file.split('.');
    return file.split('.')[filetype.length - 1];
  }
  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  downaloadAndOpenfile(filename:string, fileurl:string, filetype: string){
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
