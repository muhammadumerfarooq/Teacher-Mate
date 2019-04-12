import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Option } from 'ionic-angular';
import { QuizServiceProvider, Quiz, QuestionAnswer, OptionsAnswer, QuizAnswer, Question, Options } from '../../providers/quiz-service/quiz-service';

/**
 * Generated class for the TakeQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-take-quiz',
  templateUrl: 'take-quiz.html',
})
export class TakeQuizPage {

  myquiz: Quiz;
  myanswers: QuizAnswer;

  constructor(private alertCtrl:AlertController, private viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {
    this.myquiz = new Quiz();
    this.myquiz = this.navParams.get('myquiz');

    this.myanswers = new QuizAnswer();
    this.myanswers.background = this.myquiz.background
    this.myanswers.classname = this.myquiz.classname
    this.myanswers.classteacher = this.myquiz.classteacher
    this.myanswers.creationdate = this.myquiz.creationdate
    this.myanswers.scheduledate = this.myquiz.scheduledate
    this.myanswers.quizdescription = this.myquiz.quizdescription
    this.myanswers.quizname = this.myquiz.quizname
    this.myanswers.quiztype = this.myquiz.quiztype
    this.myanswers.syllabusid = this.myquiz.syllabusid

    for (let i = 0; i < this.myquiz.questions.length; i++) {
      let myquestion: QuestionAnswer = new QuestionAnswer();
      myquestion.question = this.myquiz.questions[i].question;

      for (let j = 0; j < this.myquiz.questions[i].options.length; j++) {

        let myoption : OptionsAnswer = new OptionsAnswer();

        myoption.isanswer =this.myquiz.questions[i].options[j].isanswer
        myoption.myanswer =false;
        myoption.option =this.myquiz.questions[i].options[j].option

        myquestion.options.push(myoption)
        
      }

      this.myanswers.questions.push(myquestion);
    }
    
  console.log(this.myanswers)

  }

  ionViewDidLoad() {
  }

  viewctrl_dismiss() {
    this.viewctrl.dismiss();
  }

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
  delete_question(quesid: number){
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
 
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();
   
   }

}
