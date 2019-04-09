import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
  // AngularFirestoreDocument
} from "angularfire2/firestore";
import { LoaderserviceProvider } from '../loaderservice/loaderservice';
import { ClassServiceProvider } from '../class-service/class-service';
import { DateTime } from 'ionic-angular/umd';


export class Options {
  option: string;
  isanswer: boolean;
  constructor() {
    this.option = "";
    this.isanswer = false;
  }
}

export class Quiz {
  quizname: string;
  quizdescription: string;
  quiztype: string;
  questions: Array<Question>;
  classid: string;
  classteacher: string;
  syllabusid: string;
  creationdate: Date;
  Month:string;
  Day:string;
  background: string;
  constructor() {
    this.background = '';
    this.Month = '';
    this.Day = '';
    this.questions = new Array<Question>();
    this.classid = "";
    this.classteacher = "";
    this.syllabusid = "";
    this.creationdate = new Date();
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


/*
  Generated class for the QuizServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class QuizServiceProvider {

  myquizes: Array<Quiz> = new Array<Quiz>();
  constructor(private afs: AngularFirestore, private classservice: ClassServiceProvider, private loaderservice: LoaderserviceProvider) {

    this.afs.collection<Quiz>('quizes', ref => {
      return ref.where('classname', '==', this.classservice.classname).where('classteacher', '==', this.classservice.classteacher);
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

        
        this.afs.collection<Quiz>('quizes').snapshotChanges().forEach(snap => {

          this.myquizes = new Array<Quiz>();

          snap.forEach(snapshot => {
            
            if (snapshot.payload.doc.exists) {
              const coursetemp = snapshot.payload.doc.data() as Quiz;

              if (coursetemp.syllabusid == syllid) {


                let i = 0;
                let qu = 0;
                while (i > -1) {
                  let quiz: Quiz = new Quiz();
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
                    this.myquizes.push(quiz);
                    console.log(this.myquizes);
                  }
                  else {
                    break;
                  }

                  i++;
                }
              }
            }
          })
        });
      })

    }, 1500)


  }

  insert_Quiz(quizes: Quiz) {
    quizes.classid = this.classservice.classname;
    quizes.classteacher = this.classservice.classteacher;
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

          this.afs.collection<Quiz>('quizes').doc(quizes.creationdate.toString()).set(quiz).then(() => {

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
}


