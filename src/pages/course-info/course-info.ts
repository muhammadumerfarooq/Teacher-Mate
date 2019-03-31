import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http, Response } from "@angular/http";

import { map } from 'rxjs/operators';
import { Courses, Chapters, Subtopics, Topics, CourseProvider } from '../../providers/course/course';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
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
 
  
  showLevel1 = null;
  showLevel2 = null;
  data = false;

  pages:any;

  mycourses: Courses = new Courses();
  files = new Map();
  
  constructor( private fileChooser: FileChooser, private filePath: FilePath, private fileOpener: FileOpener,private courseservice:CourseProvider,private classprovider:ClassServiceProvider,public navCtrl: NavController, public navParams: NavParams, private http:Http, private viewctrl:ViewController) {
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


    addChapter(){
      let chapterindex = this.mycourses.Chapters.length;
      this.mycourses.Chapters.push(new Chapters());

    }
  addSubtopic(){
    let chapterindex = this.mycourses.Chapters.length;
    let topindex = this.mycourses.Chapters[chapterindex-1].Topics.length;
    

    this.mycourses.Chapters[chapterindex-1].Topics[topindex-1].subtopics.push(new Subtopics);

    let index =  this.mycourses.Chapters[chapterindex-1].Topics[topindex-1].subtopics.length;

    this.mycourses.Chapters[chapterindex-1].Topics[topindex-1].subtopics[index-1].value = '';

    console.log(this.mycourses.Chapters)
   // console.log(this.anArray);
  //  this.anArray.push({'value':''});
    }

    addTopics(){

      let chapterindex = this.mycourses.Chapters.length;

      this.mycourses.Chapters[chapterindex-1].Topics.push(new Topics());
      let topindex = this.mycourses.Chapters[chapterindex-1].Topics.length;
      this.mycourses.Chapters[chapterindex-1].Topics[topindex-1].value = '';

      console.log(this.mycourses.Chapters)
  

    }

    viewctrl_dismiss(){
      this.viewctrl.dismiss('back');
    }

    addSyllabus(){
        this.mycourses.creationdate = new Date().getTime().toString();
        this.mycourses.classteacher = this.classprovider.classteacher;
        this.mycourses.classname = this.classprovider.classname; 

        this.courseservice.insert_course(this.mycourses)
    }
    openfile_topic(chap,top){
      this.fileChooser.open().then(file => {
        this.filePath.resolveNativePath(file).then(resolvedFilePath => {
  
          
          this.mycourses.Chapters[chap].Topics[top].filename = this.getfilename(resolvedFilePath);
          this.mycourses.Chapters[chap].Topics[top].filepath = resolvedFilePath;
          this.mycourses.Chapters[chap].Topics[top].filetype = this.getfiletype(resolvedFilePath);
  
          this.mycourses.Chapters[chap].Topics[top].filetext = this.getfileext(resolvedFilePath);
          
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }

    openfile_subtopic(chap,top,i) {
      this.fileChooser.open().then(file => {
        this.filePath.resolveNativePath(file).then(resolvedFilePath => {
  
          
          this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename = this.getfilename(resolvedFilePath);
          this.mycourses.Chapters[chap].Topics[top].subtopics[i].filepath = resolvedFilePath;
          this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetype = this.getfiletype(resolvedFilePath);
  
          this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetext = this.getfileext(resolvedFilePath);
          this.courseservice.uploadfiletopic(resolvedFilePath, this.mycourses.Chapters[chap].Topics[top].subtopics[i].filename, this.mycourses.Chapters[chap].Topics[top].subtopics[i].filetext).then((val)=>{
            let value:string = val.toString();
            this.mycourses.Chapters[chap].Topics[top].subtopics[i].fileurl = value;
          }).catch(err=>{
            
          });
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }
  
    getfilename(filestring) {
  
      let file
      file = filestring.replace(/^.*[\\\/]/, '')
      
      // this.presentAlert(file.split('.')[0], file.split('.')[1]);
     // console.log(file.split('.'));
      
      return file;
    }
    getfiletype(filestring){
      let file
      file = filestring.replace(/^.*[\\\/]/, '')
      
     // this.presentAlert(file.split('.')[0], file.split('.')[1]);
      let filetype = file.split('.');
      return file.split('.')[filetype.length-1];
    }
    getfileext(filestring) {
      let file = filestring.substr(filestring.lastIndexOf('.') + 1);
      return file;
    }

}
