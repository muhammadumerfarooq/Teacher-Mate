import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuizServiceProvider, Quiz } from '../../providers/quiz-service/quiz-service';
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
  
  myquizes: Quiz = new Quiz();
  constructor(public navCtrl: NavController, public navParams: NavParams, private quizservice:QuizServiceProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateQuizPage');
  }

}
