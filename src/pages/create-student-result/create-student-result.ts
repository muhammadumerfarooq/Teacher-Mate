import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, ViewController } from 'ionic-angular';
import { StudentresultsServiceProvider, results, resulttype, classresult } from '../../providers/studentresults-service/studentresults-service';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { StudentmarksServiceProvider } from '../../providers/studentmarks-service/studentmarks-service';

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


  classresults: classresult;
  colorCode = 'white';
  duplicatename = '';

  constructor(private alertCtrl: AlertController, private studentresult:StudentmarksServiceProvider, private resultprovider: StudentresultsServiceProvider,
    private modalctrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
    private viewctrl: ViewController, private toastctrl: ToastController,
    private homeservice: HomeServiceProvider) {

    this.classresults = new classresult();
    this.classresults.classname = this.homeservice.classroom;
    this.classresults.classteacher = this.homeservice.classteacher;
    this.classresults.creationdate = new Date().getTime().toString();
    try {
      this.resultprovider.get_results().then(() => {
        if (this.resultprovider.classresults.results.length > 0) {
          this.classresults.classname = this.resultprovider.classresults.classname
          this.classresults.classteacher = this.resultprovider.classresults.classteacher
          this.classresults.creationdate = this.resultprovider.classresults.creationdate

          this.resultprovider.classresults.results.forEach(res=>{
            let result = new results();
            result.obtainedweightage = res.obtainedweightage;
            result.resultname = res.resultname;
            result.totalweightage = res.totalweightage;
            
            res.resulttypes.forEach(type=>{
              let restype = new resulttype();
              restype.obtainedmarks = type.obtainedmarks;
              restype.resultadded = type.resultadded;
              restype.resultname = type.resultname;
              restype.totalmarks = type.totalmarks;
              restype.weightage = type.weightage;

              result.resulttypes.push(restype);
              
            });
            this.classresults.results.push(result);
          });

       //   this.classresults = this.resultprovider.classresults;
        }
      }).catch(err => {
        console.log(err)
      });
    } catch (err) {
      console.log(err);
    }
  }


  onChangeinput(input, resindex) {


    for (let index = 0; index < this.classresults.results.length; index++) {

      if (this.classresults.results[index].resultname == input && index != resindex) {
        console.log(this.classresults.results[index].resultname + " " + input + " " + index + " " + resindex)
        this.presentAlert(input + ' with same name of result type already exists', '');
        this.colorCode = 'red';
        this.duplicatename = this.classresults.results[index].resultname;
        break;
      }
    }
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
    if (this.colorCode == 'red') {
      this.presentAlert('Please make sure that result types name are unique', '');
    } else {
      this.classresults.results.push(new results());
    }
  }


  viewctrl_dismiss() {
    this.viewctrl.dismiss('back');
  }

  deleteresult(result: results) {

    let index = this.classresults.results.indexOf(result);
    if (this.classresults.results[index].totalweightage > 0) {
      this.classresults.results[index].totalweightage = this.classresults.results[index].totalweightage - 1;

    }

  }

  add(result: results) {
    let index = this.classresults.results.indexOf(result);

    this.classresults.results[index].totalweightage = this.classresults.results[index].totalweightage + 1;

  }
  remove(result: results) {


    let confirm = this.alertCtrl.create({
      title: 'Delete Result type',
      message: 'Are you sure you want to Delete ' + result.resultname + ' ? ',
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
            let index = this.classresults.results.indexOf(result);
            this.classresults.results.splice(index, 1);

            let duplicates = 0;
            if (this.duplicatename!=''){
            for (let index = 0; index < this.classresults.results.length; index++) {

              if (this.classresults.results[index].resultname == this.duplicatename) {
                duplicates++;
              }
            }
            if (duplicates < 2) {
              this.colorCode = 'white';
              this.duplicatename = '';
            }
          }
          }
        }
      ]
    });
    confirm.present();
  }

  addingresults(result: results) {

    let restype: resulttype;// = new resulttype();
    restype = new resulttype();

    let index = this.classresults.results.indexOf(result);
    if (this.classresults.results[index].resultname==''){
      this.presentAlert('Result Name cannot be Emtpy','');
    }
    else if (this.classresults.results[index].totalweightage==0){
      this.presentAlert('Result Weightage cannot be 0','');
    }
else{
    let joinclass = this.alertCtrl.create({
      title: 'Adding ' + this.classresults.results[index].resultname,
      message: "Enter " + this.classresults.results[index].resultname + " Values",
      inputs: [
        {
          name: 'resultname',
          placeholder: 'Name',
          type: 'text'
        },

        {
          name: 'resultweigh',
          placeholder: 'weightage',
          type: 'number',
          min: 1.0,
          max: this.classresults.results[index].totalweightage
        },
        {
          name: 'totalmarks',
          placeholder: 'total marks',
          type: 'number',
          min: 5,
          max: 100
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
            restype.weightage = parseFloat(data.resultweigh);
            restype.resultname = data.resultname;
            restype.totalmarks = parseFloat(data.totalmarks);
            if (data.resultweigh == '' || data.resultname == '' || data.totalmarks =='') {
              this.presentAlert(' values must not be empty', '');
            } else {
              let resweg: number = 0;
              let exists = false;
              this.classresults.results[index].resulttypes.forEach(element => {
                resweg = resweg + element.weightage;
                if (element.resultname == restype.resultname) {
                  exists = true;
                }
              });
              if (restype.weightage + resweg> this.classresults.results[index].totalweightage && exists == false) {
                this.presentAlert('weightage must be under the weightage of ' + this.classresults.results[index].totalweightage, '');
              } else if (restype.weightage <= 0) {
                this.presentAlert('weightage must be greater than zero', '');

              } else if (exists) {
                this.presentAlert('result name already exists', '');

              }
              else {
                this.classresults.results[index].resulttypes.push(restype);
              }
            }
          }
        }
      ]
    });
    joinclass.present();
  }
  }
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  SubmitResults() {
    if (this.colorCode == 'red') {
      this.presentAlert('make sure that result types name are unique', '');
    }
    else if (this.classresults.results.length==0 && this.resultprovider.classresults.results.length == 0){
      this.presentAlert('Nothing to Update','');
    }
    else {
      
      let confirm = this.alertCtrl.create({
        title: 'Submit/Update Result type',
        message: 'Are you sure you want to Submit/Update ',
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
              if (this.classresults.results.length == 0 && this.resultprovider.classresults.results.length >0){
                this.resultprovider.delete_results(this.classresults).then(() => this.presentAlert('Result added successfully!', '')).catch(() => this.presentAlert('Error while saving result', ''))
                this.studentresult.deletestudentresults().then(()=>{

                }).catch(err=>{

                })
              }
              else if (this.resultprovider.classresults.results.length > 0) {
                this.resultprovider.update_results(this.classresults).then(() => this.presentAlert('Result added successfully!', '')).catch(() => this.presentAlert('Error while saving result', ''))
               
              } else {
                this.resultprovider.insert_results(this.classresults).then(() => this.presentAlert('Result added successfully!', '')).catch(() => this.presentAlert('Error while saving result', ''))
                
              }
            }
          }
        ]
      });
      confirm.present();

    }
  }

  remove_restype(i, j) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Result type',
      message: 'Are you sure you want to Delete ' + this.classresults.results[i].resulttypes[j].resultname + ' ? ',
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
            this.classresults.results[i].resulttypes.splice(j, 1);

          }
        }
      ]
    });
    confirm.present();

  }
}
