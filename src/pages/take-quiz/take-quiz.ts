import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Option } from 'ionic-angular';
import { QuizServiceProvider, Quiz, QuestionAnswer, OptionsAnswer, QuizAnswer, Question, Options } from '../../providers/quiz-service/quiz-service';
import { isThisMinute } from 'date-fns';
import { AnswerServiceProvider } from '../../providers/answer-service/answer-service';
import { Platform } from 'ionic-angular/platform/platform';

/**
 * Generated class for the TakeQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  attempted: boolean;

  constructor() {
    this.attempted = false;
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
  selector: 'page-take-quiz',
  templateUrl: 'take-quiz.html',
})
export class TakeQuizPage {


  myquiz: Quiz;
  quiz: SingleQuiz;
  quizno: number = 0;

  public timeBegan = null
  public timeStopped: any = null
  public stoppedDuration: any = 0
  public started = null
  public running = false
  public blankTime = "00:00"
  public time = "00:00"
  public myanswers: QuizAnswer;
  isDisabled : boolean = false;
  constructor(private platform:Platform,private answerservice: AnswerServiceProvider, private alertCtrl: AlertController, private viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {


   


    this.myanswers = new QuizAnswer();
    this.myquiz = new Quiz();
    this.myquiz = this.navParams.get('myquiz');
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
    this.quiz.attempted = this.myquiz.attempted;
    
    if (this.quiz.quiztype == undefined || this.quiz.quiztype == "" || this.quiz.quiztype =="easy"){
      this.isDisabled = true;
    }
    if (this.myquiz.questions.length > 0) {
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption: OptionsAnswer = new OptionsAnswer();

        myoption.isanswer = this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer = false;
        myoption.option = this.myquiz.questions[this.quizno].options[j].option

        myquestion.options.push(myoption)

      }

      this.quiz.questions = myquestion;

    }



    this.myanswers.background = this.myquiz.background
    this.myanswers.classname = this.myquiz.classname
    this.myanswers.classteacher = this.myquiz.classteacher
    this.myanswers.creationdate = this.myquiz.creationdate
    this.myanswers.scheduledate = this.myquiz.scheduledate
    this.myanswers.quizdescription = this.myquiz.quizdescription
    this.myanswers.quizname = this.myquiz.quizname
    this.myanswers.quiztype = this.myquiz.quiztype
    this.myanswers.syllabusid = this.myquiz.syllabusid
    this.myanswers.quiztime = this.myquiz.quiztime
    this.myanswers.attempted = this.myquiz.attempted;

    for (let i = 0; i < this.myquiz.questions.length; i++) {

      let myquestion = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[i].question;

      for (let j = 0; j < this.myquiz.questions[i].options.length; j++) {

        let myoptions = new OptionsAnswer();
        myoptions.isanswer = this.myquiz.questions[i].options[j].isanswer;
        myoptions.option = this.myquiz.questions[i].options[j].option;
        myoptions.myanswer = false;

        myquestion.options.push(myoptions);
      }

      this.myanswers.questions.push(myquestion);
    }


  }

  ionViewDidLoad() {
  }

  viewctrl_dismiss() {
    let backAction = this.platform.registerBackButtonAction((res)=> {
      console.log(res);
      if (this.running){
            const alert =  this.alertCtrl.create({
            title: 'Confirm!',
            message: 'Do you want to go back!!!',
            buttons: [
            {
               text: 'Yes',
               handler: () => {
             
            }
            }, {
               text: 'No',
               handler: () => {
                
                 }
               }
            ]
         });
      
         alert.present();
        }else{
          this.viewctrl.dismiss();
        }
        backAction();
       },1)
 
  }

  start() {
    if (this.myanswers.attempted == true) {
      let confirm = this.alertCtrl.create({
        title: 'Take Quiz Again',
        message: 'Are you sure you want to Take this Quiz Again?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              /// quiz again 
              this.isDisabled = true;
              if (this.running) return;
              if (this.timeBegan === null) {
                this.reset();
                this.timeBegan = new Date();
              }
              if (this.timeStopped !== null) {
                let newStoppedDuration: any = (+new Date() - this.timeStopped)
                this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
              }
              this.started = setInterval(this.clockRunning.bind(this), 10);
              this.running = true;

            }
          }
        ]
      });
      confirm.present();
    } else {
      if (this.running) return;
      if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
      }
      if (this.timeStopped !== null) {
        let newStoppedDuration: any = (+new Date() - this.timeStopped)
        this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
      }
      this.started = setInterval(this.clockRunning.bind(this), 10);
      this.running = true;
    }

  }
  stop() {
    this.running = false;
    this.timeStopped = new Date();
    clearInterval(this.started);
    this.isDisabled = false;
  }
  reset() {
    this.running = false;
    clearInterval(this.started);
    this.stoppedDuration = 0;
    this.timeBegan = null;
    this.timeStopped = null;
    this.time = this.blankTime;
  }
  zeroPrefix(num, digit) {
    let zero = '';
    for (let i = 0; i < digit; i++) {
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }
  clockRunning() {
    let currentTime: any = new Date()
    let timeElapsed: any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
    let hour = timeElapsed.getUTCHours()
    let min = timeElapsed.getUTCMinutes()
    let sec = timeElapsed.getUTCSeconds()
    let ms = timeElapsed.getUTCMilliseconds();
    this.time =

      this.zeroPrefix(min, 2) + ":" +
      this.zeroPrefix(sec, 2); // + "." ;
    if (this.time == this.myquiz.quiztime) {
     // clearInterval(this.started); // interval closed
      this.stop();

      this.myanswers.quiztimetaken = this.time;
      this.calculating_score();
      this.reset();
      this.myanswers.attempted = true;
      this.myanswers.creationdate = new Date().toString();
      this.presentAlert('You Scored ' + this.myanswers.score, ' out of ' + this.myanswers.questions.length);
      this.answerservice.insert_Answer(this.myanswers).then(res => {

        this.presentAlert('Your Quiz is Saved', '');
      }).catch(err => {
        this.presentAlert('Error Saving Quiz', ' ');
      });
    }

  };



  selected_option(ques: number, op: number) {

    console.log(this.quiz.questions.options[op].option + ' ' + this.quiz.questions.options[op].myanswer)
    if (this.quiz.questions.options[op].myanswer == true) {
      this.myanswers.questions[ques].options[op].myanswer = false;
      this.quiz.questions.options[op].myanswer = false;

    }
    else {
      this.quiz.questions.options[op].myanswer = true;
      this.myanswers.questions[ques].options[op].myanswer = true;

    }
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
    if (this.quizno >= 0 && (this.quizno + 1) < this.myquiz.questions.length) {
      this.quizno++;
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption: OptionsAnswer = new OptionsAnswer();

        myoption.isanswer = this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer = false;
        myoption.option = this.myquiz.questions[this.quizno].options[j].option

       if ( this.myanswers.questions[this.quizno].options[j].myanswer ==  true){
        myoption.myanswer = true;
       }

        myquestion.options.push(myoption)

      }

      this.quiz.questions = myquestion;

    } else {
      this.presentAlert('No more Questions ', ' :) ');
    }
  }

  backQuestion() {

    if (this.quizno - 1 >= 0 && (this.quizno - 1) < this.myquiz.questions.length) {
      this.quizno--;
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption: OptionsAnswer = new OptionsAnswer();

        myoption.isanswer = this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer = false;
        myoption.option = this.myquiz.questions[this.quizno].options[j].option

               if ( this.myanswers.questions[this.quizno].options[j].myanswer ==  true){
        myoption.myanswer = true;
       }
        myquestion.options.push(myoption)

      }
      this.quiz.questions = myquestion;

    } else {
      this.presentAlert('No more Questions ', ' :) ');
    }
  }


  completequiz() {
    let confirm = this.alertCtrl.create({
      title: 'End Quiz',
      message: 'Are you sure you want to End this Quiz?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            clearInterval(this.started);

            this.myanswers.quiztimetaken = this.time;
            this.calculating_score();
            this.reset();
            this.myanswers.attempted = true;
            this.myanswers.creationdate = new Date().toString();
            this.presentAlert('You Scored ' + this.myanswers.score, ' out of ' + this.myanswers.questions.length);
            this.answerservice.insert_Answer(this.myanswers).then(res => {

              this.presentAlert('Your Quiz is Saved', '');
            }).catch(err => {
              this.presentAlert('Error Saving Quiz', ' ');
            });
          }
        }
      ]
    });
    confirm.present();
  }

  calculating_score() {
    this.myanswers.score = 0;
    this.myanswers.questions.forEach(quest => {
      quest.options.forEach(opt => {
        if (opt.isanswer == true && opt.myanswer == true) {
          this.myanswers.score++;
        }
      })
    })
  }
}
