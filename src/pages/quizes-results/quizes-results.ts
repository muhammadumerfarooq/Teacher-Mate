import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';
import { student, StudentProvider } from '../../providers/student/student';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { AnswerServiceProvider } from '../../providers/answer-service/answer-service';

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

  answerslist: Array<any>= []; 
  /*
  Array<new (Object: any) => {
    score: 0,
    total: 0,
    imgurl: '',
    creationdate: ''

  }> = []; */

  constructor(private modalctrl:ModalController,private viewctrl:ViewController,private loaderservice: LoaderserviceProvider, private student_service: StudentProvider, private homeservice: HomeServiceProvider, public navCtrl: NavController, public navParams: NavParams, private answers_service: AnswerServiceProvider) {
    this.studentslist = new Array<student>();


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

        if (student.classteacher == answer.classteacher && student.classname == answer.classname) {
          let answers = {
            score: 0,
            total: 0,
            imgurl: '',
            creationdate: '',
            syllabusid:''
          }
          answers.creationdate = answer.creationdate;
          answers.imgurl = student.userurl;
          answers.score = answer.score;
          answers.total = answer.questions.length;
          answers.syllabusid = answer.syllabusid;

          this.answerslist.push(answers);
        }
      });
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }
  viewctrl_dismiss(){
    this.viewctrl.dismiss();
  }
  quizResults(answer:any){
    this.answers_service.allanswers.forEach(result=>{
      if(result.classteacher == answer.classteacher && result.classname == answer.classname && result.useremail == result.useremail){

        var modalPage = this.modalctrl.create('ResultDetailsPage',{'answers':result});
        modalPage.onDidDismiss(data=>{
        
    
       });
        modalPage.present();
        
      }
    })
    
  }
}
