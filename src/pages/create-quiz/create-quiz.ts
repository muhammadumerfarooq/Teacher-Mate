import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { QuizServiceProvider, Quiz, Question, Options } from '../../providers/quiz-service/quiz-service';
import moment from 'moment';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular/platform/platform';
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
  
  questiontaken: Question = new Question();
  
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
  constructor( private fileOpener:FileOpener,private filetransfer: FileTransfer, private file: File, private plateform: Platform, private fileChooser: FileChooser, private filePath: FilePath,private alertctrl: AlertController, public viewctrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private quizservice: QuizServiceProvider) {
   
    this.questiontaken = new Question();
 
    this.quizinfo = this.navParams.get('quizinfo');
    this.myquizes.questions = new Array<Question>();
    this.setDate();
    this.myquizes.syllabusid = this.quizinfo.topicname;
    this.quizcolor = new Array<colors>();

    this.quizcolor.push(new colors('blue', '#0077ff'));
    this.quizcolor.push(new colors('light green', '#B5E61B'));
    this.quizcolor.push(new colors('dark blue', '#16144A'));
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
    /*let questionindex = this.myquizes.questions.length;

    console.log(this.myquizes.questions)
    if (questionindex> 0 && this.myquizes.questions[questionindex - 1].options.length<4){
      this.presentAlert("Must have 4 options in each question","");
    }else{
    this.myquizes.questions.push(new Question());
    }
    */
   let find = false;
   

   if (this.questiontaken.options.find(x => x.isanswer == true)!=undefined){
   this.myquizes.questions.push({...this.questiontaken});
   this.questiontaken = new Question();
   }else{
     this.presentAlert("Please Select alteast one correct Answer","");
   }
  }

  addOption() {
/*
    let questionindex = this.myquizes.questions.length;
    if (questionindex - 1 < 0) {
      this.presentAlert('First Add Question ', '');
    } else if (this.myquizes.questions[questionindex - 1].options.length>=4){
      this.presentAlert("Already 4 Options are added ","Cannot add more");
    }
    else {
      this.myquizes.questions[questionindex - 1].options.push(new Options());
      let topindex = this.myquizes.questions[questionindex - 1].options.length;
      this.myquizes.questions[questionindex - 1].options[topindex - 1].option = '';

      console.log(this.myquizes.questions)

    }*/
    let optionindex = this.questiontaken.options.length;
    if (optionindex>4){
      this.presentAlert("Already 4 Options are added ","Cannot add more");

    }else {
      this.questiontaken.options.push(new Options());
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

  option_box(op: number) {
    if (this.questiontaken.options[op].isanswer == true)
      this.questiontaken.options[op].isanswer = false;
    else {
      this.questiontaken.options[op].isanswer = true;
    }
  }

  addQuiz() {
if (this.myquizes.quizname=='' || this.myquizes.quizname==undefined){
  this.presentAlert('Quiz Name Cannot be Empty','');
}else if (this.myquizes.quizdescription=='' || this.myquizes.quizdescription==undefined){
  this.presentAlert('Quiz Description Cannot be Empty','');
}else if (this.myquizes.quiztype=='' || this.myquizes.quiztype==undefined){
  this.presentAlert('Quiz Type Cannot be Empty','');
}else if (this.myquizes.background==''  || this.myquizes.background==undefined){
  this.presentAlert('Quiz Color Cannot be Empty','');
}
else if (this.myquizes.quiztype=='hard' || this.myquizes.quiztype==undefined){
if (this.myquizes.quiztime=='' || this.myquizes.quiztype==undefined){
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
        this.presentAlert('Previous Quiz Date '+lastdate, ' Quiz must have Difference of 1 week between previous Quiz');
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
    let confirm = this.alertctrl.create({
      title: 'Delete Question',
      message: 'Are you sure you want to Delete this Question?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.myquizes.questions.splice(chap, 1);

          }
        }
      ]
    });
    confirm.present();

    
  }

  delete_option(op: number) {
    this.questiontaken.options.splice(op, 1);

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

  downaloadAndOpenfile(filename: string, fileurl: string, filetype: string) {
    if (filename  == "" || filetype == "" || fileurl == ""){
      this.presentAlert('No File Exists ','');
    }else{
    let path = null;
    if (this.plateform.is('ios')) {
      path = this.file.documentsDirectory;
    } else {
      path = this.file.externalApplicationStorageDirectory;
    }
    const transfer = this.filetransfer.create();
    transfer.download(fileurl, path + filename + '.' + filetype).then(entry => {
      // this.presentAlert('file path ',path+'myfile.'+filetype);
      // let url = entry.toURL();

      let fileMIMEType = this.getMIMEtype(filetype);

      this.fileOpener.open(path + filename + '.' + filetype, fileMIMEType).then(file => {
        //   alert(file);

        //   alert("It worked!")
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    });
    //   this.documentview.viewDocument(url,'application/'+filetype,{});
    // }).catch(err=>{
    //   this.presentAlert('Error ',err);
    // });
  }
  }


  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
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
