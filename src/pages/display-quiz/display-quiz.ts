import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { QuizServiceProvider } from '../../providers/quiz-service/quiz-service';

/**
 * Generated class for the DisplayQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-display-quiz',
  templateUrl: 'display-quiz.html',
})
export class DisplayQuizPage {
   quizinfo = {
    classname: '',
    classteacher:'',
    courseid: '',
    topicname: ''
  }
  constructor(private viewctrl :ViewController,public navCtrl: NavController, public navParams: NavParams, private quizservice:QuizServiceProvider) {
    this.quizinfo = this.navParams.get('quizinfo');

    this.quizservice.getquiz(this.quizinfo.topicname); 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayQuizPage');
  }
  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }
}
