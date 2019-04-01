import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Courses, CourseProvider } from '../../providers/course/course';

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
  constructor(private viewctrl:ViewController,public navCtrl: NavController, public navParams: NavParams, private courseservice:CourseProvider) {
    this.mycourses = this.navParams.get('mycourse');
  }

  ionViewDidLoad() {
  
  }
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
}
