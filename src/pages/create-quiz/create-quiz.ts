import { Component, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { QuizServiceProvider, Quiz, Question, Options } from '../../providers/quiz-service/quiz-service';
/**
 * Generated class for the CreateQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-quiz',
  templateUrl: 'create-quiz.html',
})
export class CreateQuizPage {
  
  showLevel1 = null;
  showLevel2 = null;
  myquizes: Quiz = new Quiz();
  quizinfo = {
    classname: '',
    classteacher:'',
    courseid: '',
    topicname: ''
  }

  constructor(public viewctrl:ViewController,public navCtrl: NavController, public navParams: NavParams, private quizservice:QuizServiceProvider) {
    this.quizinfo = this.navParams.get('quizinfo');
    this.myquizes.questions = new Array<Question>();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateQuizPage');
  }

  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  addQuestion() {
    console.log(this.myquizes.questions)
    this.myquizes.questions.push(new Question());

  }

  addOption() {

    let questionindex = this.myquizes.questions.length;

    this.myquizes.questions[questionindex - 1].options.push(new Options());
    let topindex = this.myquizes.questions[questionindex - 1].options.length;
    this.myquizes.questions[questionindex - 1].options[topindex - 1].option = '';

    console.log(this.myquizes.questions)


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

}
