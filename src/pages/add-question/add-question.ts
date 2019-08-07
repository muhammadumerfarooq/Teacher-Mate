import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Option, AlertController } from 'ionic-angular';
import { Quiz, Options, QuizServiceProvider, Question } from '../../providers/quiz-service/quiz-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the AddQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-question',
  templateUrl: 'add-question.html',
})

export class AddQuestionPage {
  question: string = "";
  quiz: Quiz = new Quiz();
  options  = [];
  loginform: FormGroup ;

  constructor(private alertctrl:AlertController,private formBuilder:FormBuilder,private quizservice:QuizServiceProvider,public navCtrl: NavController, public navParams: NavParams, private viewctrl:ViewController) {

    this.loginform = this.formBuilder.group({
      questionadded: [
        '', Validators.compose([
          Validators.required
        ])
      ],
      password: [
        '', Validators.compose([
        
          Validators.required, Validators.minLength(6), Validators.maxLength(12)
        ])
      ]
    });

    this.options = new Array<Options>();
    
    this.quiz =  navParams.get('quiz');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddQuestionPage');
  }
  
  delete_option( index: number){
    let op = new Options();

    this.options.splice(index,1);
    
  
  }

  select_option(index: number){
    if (    this.options[index].isanswer == true){
      this.options[index].isanswer = false;

    }else{
      this.options[index].isanswer = true;
    }
  }
  delete_question(){
    this.question = "";
  }
  
  dismiss(){
    this.viewctrl.dismiss();
  }
  addOption(){
    console.log(this.loginform.controls.questionadded.valid);
    if (this.options.length<4){
    let op = new Options();
    this.options.push(op);
    }
  }

  addQuiz(){
  let check = false;

    this.options.forEach(op=>{
      if (op.isanswer == true){
        check = true;
      }
    });

    if (this.loginform.controls.questionadded.valid){
      if (this.options.find(op=>{
        if (op.option == "" || op.option == undefined){
          return false;
        }
      }) == false){
        this.presentAlert("Make sure that no option is Empty","");
      }else{


        if ( check){
        let questionsask: Question = new Question();
        questionsask.question = this.question;
        questionsask.options = this.options;

       // let array : Array<Question> = new Array<Question>();
       // array = {...this.quiz.questions};

       // array.push(questionsask);
        let quizes: Quiz = new Quiz();
        
        quizes = {...this.quiz};
        quizes.questions.push(questionsask);

   //     this.quiz.questions.push({...questionsask});
        
        this.quizservice.update_Quiz(quizes).then(val=>{
          this.presentAlert("Quiz Updated Successfully","");
          this.viewctrl.dismiss(true);

        }).catch(err=>{
          this.presentAlert("Quiz Not Updated"," Error");
          quizes = new Quiz();
        })
        }else{
          this.presentAlert("Quiz Option must contain atleast one Correct Answer","");
        }
      }
    }
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
}

