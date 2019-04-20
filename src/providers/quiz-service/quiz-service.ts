import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
  // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
// import { ClassServiceProvider } from '../class-service/class-service';
// import { DateTime } from 'ionic-angular/umd';
import moment from 'moment';
// import { ProfileServiceProvider } from '../profile-service/profile-service';
import { HomeServiceProvider } from '../home-service/home-service';

export class OptionsAnswer {
  option: string;
  isanswer: boolean;
  myanswer: boolean;
  constructor() {
    this.option = "";
    this.isanswer = false;
    this.myanswer = false;
  }

}

export class Options {
  option: string;
  isanswer: boolean;
  constructor() {
    this.option = "";
    this.isanswer = false;
  }
}

export class Quiz {
  quiztime: string;
  quizname: string;
  quizdescription: string;
  quiztype: string;
  questions: Array<Question>;
  classname: string;
  classteacher: string;
  syllabusid: string;
  creationdate: string;
  scheduledate: string;
  background: string;
  available: boolean;
  onweek: string;
  constructor() {
    this.onweek = '';
    this.background = '';
    this.scheduledate = '';
    this.available = false;
    this.questions = new Array<Question>();
    this.classname = "";
    this.classteacher = "";
    this.syllabusid = "";
    this.creationdate = new Date().toString();
    this.quiztime = '';
    
  }

}

export class QuizAnswer {
  quiztime: string;
  quizname: string;
  quizdescription: string;
  quiztype: string;
  questions: Array<QuestionAnswer>;
  classname: string;
  classteacher: string;
  syllabusid: string;
  creationdate: string;
  scheduledate: string;
  background: string;
  quiztaken: string;
  constructor() {
    this.background = '';
    this.scheduledate = '';
    this.questions = new Array<QuestionAnswer>();
    this.classname = "";
    this.classteacher = "";
    this.syllabusid = "";
    this.creationdate = new Date().toString();
    this.quiztime = '';
    this.quiztaken = '';
  }

}

export class QuestionAnswer {
  question: string;
  options: Array<OptionsAnswer>;

  constructor() {
    this.question = "";
    this.options = new Array<OptionsAnswer>();

  }
}
export class Question {
  question: string;
  options: Array<Options>;

  constructor() {
    this.question = "";
    this.options = new Array<Options>();

  }
}

export class Datediff {
  Mon: string;
  Day: string;

  constructor() {
    this.Mon = '';
    this.Day = '';
  }

}

/*
  Generated class for the QuizServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class QuizServiceProvider {

  Dates: Array<string> = new Array<string>();
  myquizes: Array<Quiz> = new Array<Quiz>();
  constructor(private afs: AngularFirestore, private homeservice: HomeServiceProvider, private loaderservice: LoaderserviceProvider) {

    this.afs.collection<Quiz>('quizes', ref => {
      return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher);
    });
  }
  getquiz(syllid: string) {


    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
      duration: 1500
    });

    setTimeout(() => {

      this.loaderservice.loading.present().then(() => {


        this.afs.collection<Quiz>('quizes', ref => {
          return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher);
        }).snapshotChanges().forEach(snap => {

          this.myquizes = new Array<Quiz>();

          snap.forEach(snapshot => {

            if (snapshot.payload.doc.exists) {
              const coursetemp = snapshot.payload.doc.data() as Quiz;

              if (coursetemp.syllabusid == syllid) {


                let i = 0;
                let qu = 0;
                let quiz: Quiz = new Quiz();
                quiz.background = coursetemp.background;
                quiz.classname = coursetemp.classname;
                quiz.classteacher = coursetemp.classteacher;
                quiz.creationdate = coursetemp.creationdate;
                quiz.scheduledate = coursetemp.scheduledate;
                quiz.quizdescription = coursetemp.quizdescription;
                quiz.quizname = coursetemp.quizname;
                quiz.quiztype = coursetemp.quiztype;
                quiz.syllabusid = coursetemp.syllabusid;
                quiz.quiztime = coursetemp.quiztime

                /// available or not 

                let start = moment(new Date(), "YYYY-MM-DD");

                let end = moment(coursetemp.scheduledate, "YYYY-MM-DD");

                console.log(start.diff(end, 'minutes'))
                console.log(start.diff(end, 'hours'))
                console.log(start.diff(end, 'days'))
                console.log(start.diff(end, 'weeks'))

                if (start.diff(end, 'weeks')<1 || start.diff(end, 'weeks') == 0 ){
                  quiz.available = true;
                }else{
                  quiz.onweek = start.diff(end, 'weeks').toString();
                }
                  ////
                  while (i > -1) {

                    let j = 0;
                    let op = 0;

                    if (coursetemp.questions[i] != null && coursetemp.questions[i] != undefined) {
                      let tempques: Question = new Question();
                      tempques.question = coursetemp.questions[i].question;

                      quiz.questions.push(tempques);


                      // quiz.questions[qu] = (tempques);


                      while (j > -1) {
                        if (coursetemp.questions[i].options[j] != null && coursetemp.questions[i].options[j] != undefined) {

                          let option: Options = new Options();

                          option.isanswer = coursetemp.questions[i].options[j].isanswer;
                          option.option = coursetemp.questions[i].options[j].option;
                          quiz.questions[qu].options.push(option);

                          op++;

                        } else {
                          break;
                        }
                        j++;
                      }
                      qu++;

                      console.log(this.myquizes);
                    }
                    else {
                      break;
                    }

                    i++;
                  }
                  
                this.myquizes.push(quiz);
              }
            }
          })
        });
      })

    }, 1500)


  }

  insert_Quiz(quizes: Quiz) {
    quizes.classname = this.homeservice.classroom;
    quizes.classteacher = this.homeservice.classteacher;

    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {
          const quiz = Object.assign({}, quizes);

          for (let i = 0; i < quizes.questions.length; i++) {
            quiz.questions[i] = Object.assign({}, quizes.questions[i]);

            for (let j = 0; j < quizes.questions[i].options.length; j++) {
              quiz.questions[i].options[j] = Object.assign({}, quizes.questions[i].options[j]);

            }
          }

          this.afs.collection<Quiz>('quizes').doc(quizes.creationdate).set(quiz).then(() => {

            this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            this.loaderservice.dismissloading();
            reject('error');
          });

        });
      }, 500);

    });
  }
  delete_question(myquiz: Quiz) {

    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {
          const quiz = Object.assign({}, myquiz);

          for (let i = 0; i < myquiz.questions.length; i++) {
            quiz.questions[i] = Object.assign({}, myquiz.questions[i]);

            for (let j = 0; j < myquiz.questions[i].options.length; j++) {
              quiz.questions[i].options[j] = Object.assign({}, myquiz.questions[i].options[j]);

            }
          }

          this.afs.collection<Quiz>('quizes').doc(myquiz.creationdate.toString()).update(quiz).then(() => {

            this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            this.loaderservice.dismissloading();
            
            reject('error');
          });

        });
      }, 500);

    });
  }

  deleteQuiz(quiz: Quiz) {
    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {



          this.afs.collection<Quiz>('quizes').doc(quiz.creationdate.toString()).delete().then(() => {

            this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            this.loaderservice.dismissloading();
            
            reject('error');
          });

        });
      }, 200);

    });
  }

  quizes_datediff() {

    this.Dates = new Array<string>();
    for (let i = 0; i < this.myquizes.length; i++) {
      let date = new Datediff();
      this.Dates.push(this.myquizes[i].scheduledate);


    }
  }
}


