import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, ViewController } from 'ionic-angular';
import { StudentresultsServiceProvider, results, resulttype, classresult } from '../../providers/studentresults-service/studentresults-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

/**
 * Generated class for the CreateStudentResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-create-student-result',
  templateUrl: 'create-student-result.html',
})
export class CreateStudentResultPage {
  showLevel1 = null;
  showLevel2 = null;
  data = false;

  pages: any;

  classresults : classresult;
  files = new Map();

  constructor(private alertCtrl: AlertController, private resultprovider:StudentresultsServiceProvider,
    private modalctrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
    private viewctrl: ViewController, private toastctrl: ToastController,
    private homeservice:HomeServiceProvider) {

    this.classresults = new classresult();
    this.classresults.classname = this.homeservice.classroom;
    this.classresults.classteacher = this.homeservice.classteacher;
    this.classresults.creationdate =  Date.toString();
    
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCoursesPage');
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


  addresults() {

    this.classresults.results.push(new results());

  }
 

  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  deleteresult(result: results) {
    let index = this.classresults.results.indexOf(result);
    this.classresults.results.splice(index, 1);
  }

  add(result: results) {
    let index = this.classresults.results.indexOf(result);
    this.classresults.results[index].totalweightage = this.classresults.results[index].totalweightage + 1;
  }
  remove(result: results) {
    let index = this.classresults.results.indexOf(result);
    this.classresults.results[index].totalweightage = this.classresults.results[index].totalweightage - 1;
  }

  addingresults(result: results) {

    let restype: resulttype;// = new resulttype();
    restype = new resulttype();

    let index = this.classresults.results.indexOf(result);

    let joinclass = this.alertCtrl.create({
      title: 'Adding ' + this.classresults.results[index].resultname,
      message: "Enter " + this.classresults.results[index].resultname + " Values",
      inputs: [
        {
          name: 'Result ' + this.classresults.results[index].resultname,
          placeholder: 'Name',
          type: 'name'
        },

        {
          name: 'Enter weightage',
          placeholder: 'weightage',
          type: 'weightage'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log('Add clicked');
            console.log(data);
            restype.weightage = data.weightage;
            restype.resultname = data.name;
            if (data.weightage == '' || data.name == '') {
              this.presentAlert(' values must not be empty', '');
            } else {
              this.classresults.results[index].resulttypes.push(restype);
            }
          }
        }
      ]
    });
    joinclass.present();

  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  SubmitResults(){
    this.resultprovider.insert_results(this.classresults).then(()=>this.presentAlert('Result added successfully!','')).catch(()=>this.presentAlert('Error while saving result',''))
  }
}
