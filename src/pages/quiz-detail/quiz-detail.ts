import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Option } from 'ionic-angular';
import { QuizServiceProvider, Quiz, QuestionAnswer, OptionsAnswer, QuizAnswer, Question, Options } from '../../providers/quiz-service/quiz-service';
import { isThisMinute } from 'date-fns';

/**
 * Generated class for the QuizDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export class SingleQuiz {
  quiztime:string;
  quizno : number;
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
  constructor() {
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
  selector: 'page-quiz-detail',
  templateUrl: 'quiz-detail.html',
})
export class QuizDetailPage {
  
  myquiz: Quiz;
  quiz: SingleQuiz;
  quizno : number = 0;

  public timeBegan = null
  public timeStopped:any = null
  public stoppedDuration:any = 0
  public started = null
  public running = false
  public blankTime = "00:00"
  public time = "00:00"
  
  constructor(private alertCtrl:AlertController, private viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {
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

  if (this.myquiz.questions.length>0){
    let myquestion: QuestionAnswer = new QuestionAnswer();
    myquestion.question = this.myquiz.questions[this.quizno].question;

    for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

      let myoption : OptionsAnswer = new OptionsAnswer();

      myoption.isanswer =this.myquiz.questions[this.quizno].options[j].isanswer
      myoption.myanswer =false;
      myoption.option =this.myquiz.questions[this.quizno].options[j].option

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

  start() {
    if(this.running) return;
    if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      let newStoppedDuration:any = (+new Date() - this.timeStopped)
      this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
    }
    this.started = setInterval(this.clockRunning.bind(this), 10);
      this.running = true;
    }
    stop() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
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
      for(let i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    }
    clockRunning(){
      let currentTime:any = new Date()
      let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
      let hour = timeElapsed.getUTCHours()
      let min = timeElapsed.getUTCMinutes()
      let sec = timeElapsed.getUTCSeconds()
      let ms = timeElapsed.getUTCMilliseconds();
    this.time =
  //    this.zeroPrefix(hour, 2) + ":" +
      this.zeroPrefix(min, 2) + ":" +
      this.zeroPrefix(sec, 2) ; // + "." ;
      if (this.time == this.myquiz.quiztime){
        clearInterval(this.started); // interval closed
        
      }
    //  this.zeroPrefix(ms, 3);
    };
    

/*
  selected_option(ques: number, op: number){
    // for (let i=0;i<   this.myanswers.questions[ques].options.length;i++){
    //   this.myanswers.questions[ques].options[i].myanswer = false;
    // }
    console.log(this.myanswers.questions[ques].options[op] + ' '+this.myanswers.questions[ques].options[op].myanswer)
    if (this.myanswers.questions[ques].options[op].myanswer == true)
    this.myanswers.questions[ques].options[op].myanswer = false;
    else
    this.myanswers.questions[ques].options[op].myanswer = true;
  }
  */
  delete_question(quesid: number){
    if (quesid<0){
      this.presentAlert('No Question Selected','');
    }
    else{
    let confirm = this.alertCtrl.create({
      title: 'Delete question',
      message: 'Are you sure you want to delete this question?',
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
         // question delete code here
         let tempquiz: Quiz = new Quiz();
         
         tempquiz.background = this.myquiz.background
         tempquiz.classname = this.myquiz.classname
         tempquiz.classteacher = this.myquiz.classteacher
         tempquiz.creationdate = this.myquiz.creationdate
         tempquiz.scheduledate = this.myquiz.scheduledate
         tempquiz.quizdescription = this.myquiz.quizdescription
         tempquiz.quizname = this.myquiz.quizname
         tempquiz.quiztype = this.myquiz.quiztype
         tempquiz.syllabusid = this.myquiz.syllabusid
     
         for (let i = 0; i < this.myquiz.questions.length; i++) {
           if (i ! = quesid){
           let myquestion: Question = new Question();
           myquestion.question = this.myquiz.questions[i].question;
     
           for (let j = 0; j < this.myquiz.questions[i].options.length; j++) {
     
             let myoption : Options = new Options();
     
             myoption.isanswer =this.myquiz.questions[i].options[j].isanswer
             myoption.option =this.myquiz.questions[i].options[j].option
     
             myquestion.options.push(myoption)
             
           }
     
           tempquiz.questions.push(myquestion);}
         }
    
         
         this.quizservice.delete_question(tempquiz).then(res=>{
           if (res=='done')
           {
            this.myquiz = tempquiz;
            tempquiz = null;
            this.presentAlert('Question Deleted ', 'Successfully')
            this.quiz.questions = new QuestionAnswer();
            this.backQuestion();
           }else{
            this.presentAlert('Error! ', ' Question Not Deleted')
           }
         }).catch(err=>{
          this.presentAlert('Error! ', ' Question Not Deleted')
         });
          }
        }
      ]
    });
    confirm.present();
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

   nextQuestion(){
    if (this.quizno>0 && this.quizno +1 <this.myquiz.questions.length){
      this.quizno ++;
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption : OptionsAnswer = new OptionsAnswer();

        myoption.isanswer =this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer =false;
        myoption.option =this.myquiz.questions[this.quizno].options[j].option

        myquestion.options.push(myoption)
        
      }
    //  this.quiz = new SingleQuiz();
      this.quiz.questions = myquestion;
//      this.quizno++;

    }else{
      this.presentAlert('No more Questions ', ' :) ');
    }
   }

   backQuestion(){
    
    if ( this.quizno-1 > 0 && this.quizno - 1<this.myquiz.questions.length){
      this.quizno -- ;
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[this.quizno].question;

      for (let j = 0; j < this.myquiz.questions[this.quizno].options.length; j++) {

        let myoption : OptionsAnswer = new OptionsAnswer();

        myoption.isanswer =this.myquiz.questions[this.quizno].options[j].isanswer
        myoption.myanswer =false;
        myoption.option =this.myquiz.questions[this.quizno].options[j].option

        myquestion.options.push(myoption)
        
      }
      this.quiz.questions = myquestion;

    }else{
      this.presentAlert('No more Questions ', ' :) ');
    }
   }

   completequiz(){
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
            this.reset();
          }
        }
      ]
    });
    confirm.present();
   }
}