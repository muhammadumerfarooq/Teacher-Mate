import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuizAnswer, Quiz } from '../../providers/quiz-service/quiz-service';

/**
 * Generated class for the ResultDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result-details',
  templateUrl: 'result-details.html',
})
export class ResultDetailsPage {
  myquiz: QuizAnswer = new QuizAnswer();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.myquiz = this.navParams.get('answers');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultDetailsPage');
  }

}
