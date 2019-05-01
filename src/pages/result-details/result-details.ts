import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Option } from 'ionic-angular';
import { QuizServiceProvider, QuizAnswer } from '../../providers/quiz-service/quiz-service';

/**
 * Generated class for the ResultDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * 
 * Ionic pages and navigation.
 */

export class OptionsAnswer {
  option: string;
  isanswer: boolean;
  myanswer: boolean;
  constructor() {
    this.option = "";
    this.isanswer = false;
    this.myanswer = false;
  }

}
export class QuestionAnswer {
  question: string;
  options: Array<OptionsAnswer>;
  answer: boolean;
  constructor() {
    this.answer = false;
    this.question = "";
    this.options = new Array<OptionsAnswer>();

  }
}
export class SingleQuiz {
  quiztime: string;
  quizno: number;
  quizname: string;
  quizdescription: string;
  quiztype: string;
  questions: QuestionAnswer;
  classname: string;
  classteacher: string;
  syllabusid: string;
  creationdate: string;
  scheduledate: string;
  background: string;
  score: number;

  constructor() {
    this.score = 0;
    this.quiztime = '';
    this.quizno = 0;
    this.background = '';
    this.scheduledate = '';
    this.questions = new QuestionAnswer();
    this.classname = "";
    this.classteacher = "";
    this.syllabusid = "";
    this.creationdate = new Date().toString();
  }
}

@IonicPage()
@Component({
  selector: 'page-result-details',
  templateUrl: 'result-details.html',
})
export class ResultDetailsPage {
  myquiz: QuizAnswer;
  quiz: SingleQuiz;
  quizno: number = 0;


  constructor(private alertCtrl: AlertController, private viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {
    this.myquiz = new QuizAnswer();
    this.myquiz = this.navParams.get('sendanswer');
    this.quiz = new SingleQuiz();

    this.quiz.background = this.myquiz.background
    this.quiz.classname = this.myquiz.classname
    this.quiz.classteacher = this.myquiz.classteacher
    this.quiz.creationdate = this.myquiz.creationdate
    this.quiz.scheduledate = this.myquiz.scheduledate
    this.quiz.quizdescription = this.myquiz.quizdescription
    this.quiz.quizname = this.myquiz.quizname
    this.quiz.quiztype = this.myquiz.quiztype
    this.quiz.syllabusid = this.myquiz.syllabusid
    this.quiz.quiztime = this.myquiz.quiztime
    this.quiz.score = this.myquiz.score;

    if (this.myquiz.questions.length > 0) {
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption: OptionsAnswer = new OptionsAnswer();

        myoption.isanswer = this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer = this.myquiz.questions[this.quizno].options[j].myanswer;
        myoption.option = this.myquiz.questions[this.quizno].options[j].option
        if (myoption.isanswer == myoption.myanswer) {
          myquestion.answer = true;
        }
        myquestion.options.push(myoption)

      }

      this.quiz.questions = myquestion;
      //   this.quizno++;
    }

  }

  ionViewDidLoad() {
  }

  viewctrl_dismiss() {
    this.viewctrl.dismiss();
  }


  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

  nextQuestion() {
    if (this.quizno > 0 && this.quizno + 1 < this.myquiz.questions.length) {
      this.quizno++;
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption: OptionsAnswer = new OptionsAnswer();

        myoption.isanswer = this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer = this.myquiz.questions[this.quizno].options[j].myanswer;
        myoption.option = this.myquiz.questions[this.quizno].options[j].option

        myquestion.options.push(myoption)

      }
      //  this.quiz = new SingleQuiz();
      this.quiz.questions = myquestion;
      //      this.quizno++;

    } else {
      this.presentAlert('No more Questions ', ' :) ');
    }
  }

  backQuestion() {

    if (this.quizno - 1 > 0 && this.quizno - 1 < this.myquiz.questions.length) {
      this.quizno--;
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption: OptionsAnswer = new OptionsAnswer();

        myoption.isanswer = this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer = this.myquiz.questions[this.quizno].options[j].myanswer;
        myoption.option = this.myquiz.questions[this.quizno].options[j].option

        myquestion.options.push(myoption)

      }
      this.quiz.questions = myquestion;

    } else {
      this.presentAlert('No more Questions ', ' :) ');
    }
  }

}
