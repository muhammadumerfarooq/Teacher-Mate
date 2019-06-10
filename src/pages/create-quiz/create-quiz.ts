import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { QuizServiceProvider, Quiz, Question, Options } from '../../providers/quiz-service/quiz-service';
import moment from 'moment';
// import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';


/**
 * Generated class for the CreateQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class colors {
  value: string;
  code: string;
  constructor(col: string, code: string) {
    this.value = col;
    this.code = code;
  }


}

export class day {
  date: string;
  selected: boolean;
  constructor() {
    this.date = '';
    this.selected = false;
  }
}

export class month {
  date: string;
  selected: boolean;
  days: Array<day>;
  constructor() {
    this.days = new Array<day>();
    this.date = '';
    this.selected = false;
  }
}
@IonicPage()
@Component({
  selector: 'page-create-quiz',
  templateUrl: 'create-quiz.html',
})
export class CreateQuizPage {
  mydate = '';
  currentStyles = {
    'background-color': '#F84C61'
  };
  selected_day: string = '';
  selected_month: string = '';

  quizcolor: Array<colors>;
  mycolor = "#FFF";
  quiztime = '';

  quiztype: string[] = [];

  showLevel1 = null;
  showLevel2 = null;
  myquizes: Quiz = new Quiz();
  quizinfo = {
    classname: '',
    classteacher: '',
    courseid: '',
    topicname: ''
  }

  months: Array<month> = new Array<month>();
  days: Array<day> = new Array<day>();
  constructor(private alertctrl: AlertController, public viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {
   
    
    this.quizinfo = this.navParams.get('quizinfo');
    this.myquizes.questions = new Array<Question>();
    this.setDate();
    this.myquizes.syllabusid = this.quizinfo.topicname;
    this.quizcolor = new Array<colors>();

    this.quizcolor.push(new colors('blue', '#0077ff'));
    this.quizcolor.push(new colors('light green', '#B5E61B'));
    this.quizcolor.push(new colors('dard blue', '#16144A'));
    this.quizcolor.push(new colors('purple', '#432B9C'));

    this.quiztype.push('hard');
    this.quiztype.push('easy');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateQuizPage');
    // console.log(this.mydate)
  }

  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  addQuestion() {
    console.log(this.myquizes.questions)
    this.myquizes.questions.push(new Question());

  }

  addOption() {

    let questionindex = this.myquizes.questions.length;
    if (questionindex - 1 < 0) {
      this.presentAlert('First Add Question ', '');
    } else {
      this.myquizes.questions[questionindex - 1].options.push(new Options());
      let topindex = this.myquizes.questions[questionindex - 1].options.length;
      this.myquizes.questions[questionindex - 1].options[topindex - 1].option = '';

      console.log(this.myquizes.questions)

    }

  }
  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  option_box(ques: number, op: number) {
    if (this.myquizes.questions[ques].options[op].isanswer == true)
      this.myquizes.questions[ques].options[op].isanswer = false;
    else {
      this.myquizes.questions[ques].options[op].isanswer = true;
    }
  }

  addQuiz() {
if (this.myquizes.quizname==''){
  this.presentAlert('Quiz Name Cannot be Empty','');
}else if (this.myquizes.quizdescription==''){
  this.presentAlert('Quiz Description Cannot be Empty','');
}else if (this.myquizes.quizdescription==''){
  this.presentAlert('Quiz Description Cannot be Empty','');
}else if (this.myquizes.quiztype==''){
  this.presentAlert('Quiz Type Cannot be Empty','');
}else if (this.myquizes.background==''){
  this.presentAlert('Quiz Color Cannot be Empty','');
}
else if (this.myquizes.quiztype=='hard'){
if (this.myquizes.quiztime==''){
  this.presentAlert('Quiz Time Cannot be Empty','');
}
}else{
    this.quizservice.insert_Quiz(this.myquizes).then(val => {

      if (val == 'done') {
        this.presentAlert('Quiz Added Successfully', 'Success');
      } else {
        this.presentAlert('Error! ', ' Quiz Not Added');
      }
    }).catch(err => {
      this.presentAlert('Error! ', ' Quiz Not Added');
    });
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


  setDate() {
    this.quizservice.quizes_datediff();

    let lastdate = '';
    if (this.quizservice.Dates.length > 0) {
      lastdate = this.quizservice.Dates[this.quizservice.Dates.length - 1];

      var start = moment(this.mydate, "YYYY-MM-DD");

      var end = moment(lastdate, "YYYY-MM-DD");

      console.log(start.diff(end, 'minutes'))
      console.log(start.diff(end, 'hours'))
      console.log(start.diff(end, 'days'))
      console.log(start.diff(end, 'weeks'))
      let weekdiff = start.diff(end, 'weeks');

      if (weekdiff <= 0 || weekdiff > 1) {
        this.presentAlert('Error', ' Quiz must have Difference of 1 week between previous Quiz');
        this.mydate = '';
        this.mydate = null;
      } else {
        this.myquizes.scheduledate = this.mydate;
      }

    } else {
      start = moment(new Date(), "YYYY-MM-DD").add(1, 'weeks');

      end = moment(this.mydate, "YYYY-MM-DD");

      console.log(start.diff(end, 'minutes'))
      console.log(start.diff(end, 'hours'))
      console.log(start.diff(end, 'days'))
      console.log(start.diff(end, 'weeks'))

      let weekdiff = start.diff(end, 'weeks');

      if (weekdiff < 0 || weekdiff > 1) {
        this.presentAlert('Error', ' Quiz must have Difference of 1 week between previous Quiz');
        this.mydate = '';
        this.mydate = null;
      } else {
        this.myquizes.scheduledate = this.mydate;
      }


    }





    this.myquizes.scheduledate = this.mydate;
  }

  colorselected(value: string) {
    console.log(value);

    this.myquizes.background = value;
    this.mycolor = value;

  }

  typeselected(value: string) {
    console.log(value);
    this.myquizes.quiztype = value;
  }
  delete_question(chap: number) {
    this.myquizes.questions.splice(chap, 1);

  }

  delete_option(chap: number, op: number) {
    this.myquizes.questions[chap].options.splice(op, 1);

  }
  setQuiztime(value: string) {
    console.log(value)
    if (value == null || value == undefined || value == '') {
      this.quiztime = null;
    } else {
      let splitarray = this.quiztime.split(':');
      console.log(splitarray);
      this.myquizes.quiztime = splitarray[1] + ":" + splitarray[2];
    }
  }

  cleardate() {
    console.log('cancel clicked')
    this.mydate = null;
    this.myquizes.scheduledate = '';
  }

  cleartime() {
    this.quiztime = null;
    this.myquizes.quiztime = '';
  }
}
