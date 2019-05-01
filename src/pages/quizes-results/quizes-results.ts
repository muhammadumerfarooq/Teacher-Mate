import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { student, StudentProvider } from '../../providers/student/student';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { AnswerServiceProvider } from '../../providers/answer-service/answer-service';
import { QuizAnswer } from '../../providers/quiz-service/quiz-service';

/**
 * Generated class for the QuizesResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quizes-results',
  templateUrl: 'quizes-results.html',
})
export class QuizesResultsPage {


  studentslist: Array<student> = [];

  answerslist: Array<any> = [];

  /*
  Array<new (Object: any) => {
    score: 0,
    total: 0,
    imgurl: '',
    creationdate: ''

  }> = []; */

  constructor(private modalctrl: ModalController, private viewctrl: ViewController, private loaderservice: LoaderserviceProvider, private student_service: StudentProvider, private homeservice: HomeServiceProvider, public navCtrl: NavController, public navParams: NavParams, private answers_service: AnswerServiceProvider) {
    this.studentslist = new Array<student>();
    if (this.homeservice.user == 'teachers') {
      this.answers_service.getallanswers().then(() => {
        this.findstudent();
      });
    } else {
      this.answers_service.getstudentanswers().then(() => {
        this.findstudent();
      });
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TakenQuizesPage');
  }

  async findstudent() {
    const loading = await this.loaderservice.loadingCtrl.create({
      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"> loading... </div>
      </div>`,
      duration: 1500
    });

    this.presentLoading(loading);

    this.student_service.allstudents.forEach(student => {
      this.answers_service.allanswers.forEach(answer => {

        if (student.parentemail == answer.useremail && student.classteacher == answer.classteacher && student.classname == answer.classname) {
          let answers = {
            score: 0,
            total: 0,
            imgurl: '',
            creationdate: '',
            syllabusid: '',
            classname: '',
            classteacher: '',
            useremail: ''
          }
          answers.creationdate = answer.creationdate;
          answers.imgurl = student.userurl;
          answers.score = answer.score;
          answers.total = answer.questions.length;
          answers.syllabusid = answer.syllabusid;
          answers.classname = answer.classname;
          answers.classteacher = answer.classteacher
          answers.useremail = answer.useremail
          this.answerslist.push(answers);
        }
      });
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }
  viewctrl_dismiss() {
    this.viewctrl.dismiss();
  }
  quizResults(answer: any) {
    let sendanswer: QuizAnswer = new QuizAnswer();

    for (let i = 0; i < this.answers_service.allanswers.length; i++) {
      if (this.answers_service.allanswers[i].classteacher == this.answers_service.allanswers[i].classteacher &&
        this.answers_service.allanswers[i].classname == answer.classname && this.answers_service.allanswers[i].useremail == answer.useremail && this.answers_service.allanswers[i].creationdate == answer.creationdate) {
          sendanswer = this.answers_service.allanswers[i];
        break;
      }
    }

    var modalPage = this.modalctrl.create('ResultDetailsPage', { sendanswer: sendanswer });
    modalPage.onDidDismiss(data => {


    });
    modalPage.present();

  }
}
