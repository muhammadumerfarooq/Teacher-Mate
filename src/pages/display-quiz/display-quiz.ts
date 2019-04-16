import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { QuizServiceProvider, Quiz } from '../../providers/quiz-service/quiz-service';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

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
    classteacher: '',
    courseid: '',
    topicname: ''
  }
  constructor(private profileservice:ProfileServiceProvider,private alertctrl: AlertController, private modalctrl: ModalController, private viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {
    this.quizinfo = this.navParams.get('quizinfo');

    this.quizservice.getquiz(this.quizinfo.topicname);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayQuizPage');
  }
  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  openDetails(myquiz: Quiz) {
    console.log(myquiz);
    debugger
if (this.profileservice.user == 'parent'){
  var modalPage = this.modalctrl.create('TakeQuizPage', { myquiz: myquiz });
  modalPage.onDidDismiss(data => {
    if (data == true) {
      console.log(data + " chat page ")

    }

  });
  modalPage.present();
}else if (this.profileservice.user == 'teacher') {
   modalPage = this.modalctrl.create('QuizDetailPage', { myquiz: myquiz });
  modalPage.onDidDismiss(data => {
    if (data == true) {
      console.log(data + " chat page ")

    }

  });
  modalPage.present();
}

  }

  create_quiz() {
    var modalPage = this.modalctrl.create('CreateQuizPage', { quizinfo: this.quizinfo });
    modalPage.onDidDismiss(data => {
      if (data == true) {
        console.log(data + " chat page ")

      }

    });
    modalPage.present();
  }


  delete_quiz(deletequiz: Quiz) {
    this.quizservice.deleteQuiz(deletequiz).then(res => {
      if (res == 'done') {
        this.presentAlert('Quiz Deleted Successfully', 'Successfully');

      } else {
        this.presentAlert('Error! ', 'Quiz Not Deleted');

      }

    }).catch(err => {

    });
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
