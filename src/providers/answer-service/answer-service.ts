
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
import { QuizAnswer, QuestionAnswer, OptionsAnswer } from '../quiz-service/quiz-service';


/*
  Generated class for the QuizServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AnswerServiceProvider {


  quizanswers: Array<QuizAnswer> = new Array<QuizAnswer>();
  allanswers: Array<QuizAnswer> = new Array<QuizAnswer>();
  constructor(private afs: AngularFirestore, private homeservice: HomeServiceProvider, private loaderservice: LoaderserviceProvider) {

  }
  async presentLoading(loading) {
    return await loading.present();
  }

  async getstudentanswers() {
    
    const loading = await this.loaderservice.loadingCtrl.create({
      content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,
      duration: 1500
    });

    this.presentLoading(loading);

return new Promise((resolve,reject)=>{
  
    this.afs.collection<QuizAnswer>('answers', ref => {
      return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher).where('useremail', '==', this.homeservice.useremail);
    }).snapshotChanges().take(1).forEach(snap => {

      this.allanswers = new Array<QuizAnswer>();
      let snaplength = snap.length;
if (snaplength == 0){
  reject('not exists');
}
      snap.forEach(snapshot => {

        if (snapshot.payload.doc.exists) {
          const coursetemp = snapshot.payload.doc.data() as QuizAnswer;

          let i = 0;
          let qu = 0;
          let quiz: QuizAnswer = new QuizAnswer();
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
          quiz.attempted = coursetemp.attempted;
          quiz.useremail = coursetemp.useremail;
          quiz.score = coursetemp.score;
          /// available or not 


          ////
          while (i > -1) {

            let j = 0;
            let op = 0;

            if (coursetemp.questions[i] != null && coursetemp.questions[i] != undefined) {
              let tempques: QuestionAnswer = new QuestionAnswer();
              tempques.question = coursetemp.questions[i].question;

              quiz.questions.push(tempques);


              // quiz.questions[qu] = (tempques);


              while (j > -1) {
                if (coursetemp.questions[i].options[j] != null && coursetemp.questions[i].options[j] != undefined) {

                  let option: OptionsAnswer = new OptionsAnswer();

                  option.isanswer = coursetemp.questions[i].options[j].isanswer;
                  option.option = coursetemp.questions[i].options[j].option;
                  option.myanswer = coursetemp.questions[i].options[j].myanswer;

                  quiz.questions[qu].options.push(option);

                  op++;

                } else {
                  break;
                }
                j++;
              }
              qu++;

              console.log(this.quizanswers);
            }
            else {
              break;
            }

            i++;
          }
          snaplength--;
          this.allanswers.push(quiz);
if(snaplength<=0){
return resolve('exists');
}
        }
      })
    });

  })
  }

  
 async getallanswers() {
    const loading = await this.loaderservice.loadingCtrl.create({
      content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,
      duration: 1500
    });

    this.presentLoading(loading);

return new Promise((resolve,reject)=>{
  
    this.afs.collection<QuizAnswer>('answers', ref => {
      return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher).where('classname', '==', this.homeservice.classroom);
    }).snapshotChanges().take(1).forEach(snap => {

      this.allanswers = new Array<QuizAnswer>();
      let snaplength = snap.length;
      
      snap.forEach(snapshot => {

        if (snapshot.payload.doc.exists) {
          const coursetemp = snapshot.payload.doc.data() as QuizAnswer;

          let i = 0;
          let qu = 0;
          let quiz: QuizAnswer = new QuizAnswer();
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
          quiz.attempted = coursetemp.attempted;
          quiz.useremail = coursetemp.useremail;
          quiz.score = coursetemp.score;
          /// available or not 


          ////
          while (i > -1) {

            let j = 0;
            let op = 0;

            if (coursetemp.questions[i] != null && coursetemp.questions[i] != undefined) {
              let tempques: QuestionAnswer = new QuestionAnswer();
              tempques.question = coursetemp.questions[i].question;

              quiz.questions.push(tempques);


              // quiz.questions[qu] = (tempques);


              while (j > -1) {
                if (coursetemp.questions[i].options[j] != null && coursetemp.questions[i].options[j] != undefined) {

                  let option: OptionsAnswer = new OptionsAnswer();

                  option.isanswer = coursetemp.questions[i].options[j].isanswer;
                  option.option = coursetemp.questions[i].options[j].option;
                  option.myanswer = coursetemp.questions[i].options[j].myanswer;
                  
                  quiz.questions[qu].options.push(option);

                  op++;

                } else {
                  break;
                }
                j++;
              }
              qu++;

              console.log(this.quizanswers);
            }
            else {
              break;
            }

            i++;
          }

          this.allanswers.push(quiz);
snaplength--;
if (snaplength<=0){
resolve('done');
}
        }
      })
    });

  })
  }
  getanswer(syllid: string) {


    this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
      duration: 1500
    });
return new Promise((resolve,reject)=>{
  
    setTimeout(() => {

      this.loaderservice.loading.present().then(() => {


        this.afs.collection<QuizAnswer>('answers', ref => {
          return ref.where('classname', '==', this.homeservice.classroom).where('classteacher', '==', this.homeservice.classteacher).where('syllabusid', '==', syllid);
        }).snapshotChanges().forEach(snap => {

          this.quizanswers = new Array<QuizAnswer>();
          let snaplength = snap.length;
          snap.forEach(snapshot => {

            if (snapshot.payload.doc.exists) {
              const coursetemp = snapshot.payload.doc.data() as QuizAnswer;

              if (coursetemp.syllabusid == syllid) {


                let i = 0;
                let qu = 0;
                let quiz: QuizAnswer = new QuizAnswer();
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
                quiz.attempted = coursetemp.attempted;
                quiz.useremail = coursetemp.useremail;
                /// available or not 


                ////
                while (i > -1) {

                  let j = 0;
                  let op = 0;

                  if (coursetemp.questions[i] != null && coursetemp.questions[i] != undefined) {
                    let tempques: QuestionAnswer = new QuestionAnswer();
                    tempques.question = coursetemp.questions[i].question;

                    quiz.questions.push(tempques);


                    // quiz.questions[qu] = (tempques);


                    while (j > -1) {
                      if (coursetemp.questions[i].options[j] != null && coursetemp.questions[i].options[j] != undefined) {

                        let option: OptionsAnswer = new OptionsAnswer();

                        option.isanswer = coursetemp.questions[i].options[j].isanswer;
                        option.option = coursetemp.questions[i].options[j].option;
                        option.myanswer = coursetemp.questions[i].options[j].myanswer;
                  
                        quiz.questions[qu].options.push(option);

                        op++;

                      } else {
                        break;
                      }
                      j++;
                    }
                    qu++;

                    console.log(this.quizanswers);
                  }
                  else {
                    break;
                  }

                  i++;
                }
                snaplength--;
                
                this.quizanswers.push(quiz);
                if (snaplength<=0){
                 resolve('done'); 
                }
              }else{
                snaplength--;
              }
            }
          })
        });
      })

    }, 1500)

  })

  }

  insert_Answer(answer: QuizAnswer) {
    answer.classname = this.homeservice.classroom;
    answer.classteacher = this.homeservice.classteacher;
    answer.useremail = this.homeservice.useremail;

    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,
        duration: 1000
      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {
          const quizans = Object.assign({}, answer);

          for (let i = 0; i < answer.questions.length; i++) {
            quizans.questions[i] = Object.assign({}, answer.questions[i]);

            for (let j = 0; j < answer.questions[i].options.length; j++) {
              quizans.questions[i].options[j] = Object.assign({}, answer.questions[i].options[j]);

            }
          }

          this.afs.collection<QuizAnswer>('answers').doc(answer.creationdate).set(quizans).then((res) => {

            console.log(res);
            
            //   this.loaderservice.dismissloading();
            resolve('done');
          }).catch(err => {
            //  this.loaderservice.dismissloading();
            reject('error');
          });

        });
      }, 500);

    });
  }
  update_answer(answer: QuizAnswer) {

    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {
          const quizans = Object.assign({}, answer);

          for (let i = 0; i < answer.questions.length; i++) {
            quizans.questions[i] = Object.assign({}, answer.questions[i]);

            for (let j = 0; j < answer.questions[i].options.length; j++) {
              quizans.questions[i].options[j] = Object.assign({}, answer.questions[i].options[j]);

            }
          }

          this.afs.collection<QuestionAnswer>('answers').doc(answer.creationdate.toString()).update(quizans).then(() => {

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

  deleteQuiz(answer: QuizAnswer) {
    return new Promise((resolve, reject) => {

      this.loaderservice.loading = this.loaderservice.loadingCtrl.create({

        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"> loading... </div>
        </div>`,

      });

      setTimeout(() => {

        this.loaderservice.loading.present().then(() => {



          this.afs.collection<QuestionAnswer>('answers').doc(answer.creationdate.toString()).delete().then(() => {

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


}



