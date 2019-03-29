import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http, Response } from "@angular/http";

import { map } from 'rxjs/operators';
import { Courses, Chapters, Subtopics, Topics } from '../../providers/course/course';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http, private viewctrl:ViewController) {
    // this.topics.push({'value':''});
  //  this.mycourses.Chapters.push(new Chapters);
  //  this.mycourses.Chapters[0].value = '';
  //  this.mycourses.Topics[0].subtopics.push(new Subtopics);
  //  this.mycourses.Topics[0].subtopics[0].value = '';

    this.getMenus()
    .subscribe((response)=> {
        this.pages = response;
        console.log(this.pages);
    });
  }

  getMenus(){
    return this.http.get('assets/data/menus.json').pipe(
     map((response:Response)=>response.json()));
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

    }
}
