import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
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
  constructor(private modalctrl:ModalController, private viewctrl :ViewController,public navCtrl: NavController, public navParams: NavParams, private quizservice:QuizServiceProvider) {
    this.quizinfo = this.navParams.get('quizinfo');

    this.quizservice.getquiz(this.quizinfo.topicname); 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayQuizPage');
  }
  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  openDetails(creationdate: string, quizname: string){

  }

  create_quiz(){
    var modalPage = this.modalctrl.create('CreateQuizPage',{ quizinfo: this.quizinfo});
    modalPage.onDidDismiss(data=>{
     if (data == true)
     {
       console.log(data+" chat page ")

     }

   });
    modalPage.present();
   }
  
}
