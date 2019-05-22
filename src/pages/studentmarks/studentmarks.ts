import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { ClassServiceProvider } from '../../providers/class-service/class-service';
import { StudentresultsServiceProvider, classresult, results, resulttype } from '../../providers/studentresults-service/studentresults-service';
import { StudentmarksServiceProvider } from '../../providers/studentmarks-service/studentmarks-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { HomeServiceProvider } from '../../providers/home-service/home-service';

/**
 * Generated class for the StudentmarksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export class dummyclass {
  resultname: string;
  weightage: number;
  totalmarks: number;
  obtained: number;

  constructor() {
    this.resultname = '';
    this.weightage = 0;
    this.totalmarks = 0;
    this.obtained = 0;
  }
}

@IonicPage()
@Component({
  selector: 'page-studentmarks',
  templateUrl: 'studentmarks.html',
})
export class StudentmarksPage {

  studentmarks: classresult;
  showLevel1 = null;
  showLevel2 = null;
  dropdown = new Array<String>();
  parentemail = '';

  constructor(private viewctrl: ViewController, private homeservice: HomeServiceProvider, private popoverCtrl: PopoverController, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private studentresults: StudentmarksServiceProvider, private classresults: StudentresultsServiceProvider) {
    this.parentemail = this.navParams.get('parentemail');

    this.studentmarks = new classresult();
    this.getresultsinfo();
  }

  getresultsinfo() {
    this.classresults.get_results().then(() => {
      this.studentresults.get_results(this.parentemail).then(() => {
        this.studentmarks = new classresult();
        this.studentmarks.classname = this.classresults.classresults.classname;
        this.studentmarks.classteacher = this.classresults.classresults.classteacher;
        this.studentmarks.creationdate = this.studentresults.studentresults.creationdate;

        this.classresults.classresults.results.forEach(res => {
          let resultfind = false;

          let myresult = new results();
          myresult.resultname = res.resultname;
          myresult.totalweightage = res.totalweightage;
          myresult.obtainedweightage = res.obtainedweightage;

          this.studentresults.studentresults.results.forEach(stdresults => {
            if (res.resultname == stdresults.resultname) {
              resultfind = true;



              res.resulttypes.forEach(resrtype => {
                let typefind = false;
                stdresults.resulttypes.forEach(strtype => {
                  if (resrtype.resultname == strtype.resultname) {
                    myresult.resulttypes.push(strtype);
                    typefind = true;
                  }
                })

                if (typefind == false) {
                  myresult.resulttypes.push(resrtype);
                }
              })

            }
          })

          if (resultfind == false) {
            this.studentmarks.results.push(res);
          } else {
            this.studentmarks.results.push(myresult);

          }
        });
        this.listdropdown();

      })
        .catch(err => {
          this.studentmarks = this.classresults.classresults;
          this.listdropdown();
        });
    }).catch(err => {
      console.log(err)
    });

  }

  listdropdown() {
    this.studentmarks.results.forEach(res => {
      this.dropdown.push("false");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentmarksPage');
  }
  viewctrl_dismiss() {
    this.viewctrl.dismiss();
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.dropdown[idx] = "false";
    } else {
      this.dropdown[idx] = "true";
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
    if (this.dropdown[idx] == "true")
      return true;
    else {
      return false;
    }
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  update_restype(i1: number, i2: number) {

    var bool = true;
    let joinclass = this.alertCtrl.create({
      title: 'Update Result',
      subTitle: 'Out of '+ this.studentmarks.results[i1].resulttypes[i2].totalmarks.toString(),
      message: "Enter " + this.studentmarks.results[i1].resulttypes[i2].resultname + " Marks",
      inputs: [
        {
          name: 'obtainedmarks',
          placeholder: 'Obtained Marks',
          type: 'number',
          min: 0,
          max: this.studentmarks.results[i1].resulttypes[i2].totalmarks
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
            let obtained: number = + parseFloat(data.obtainedmarks) as number;
            let total: number = (this.studentmarks.results[i1].resulttypes[i2].totalmarks);


            if (Number.isNaN(obtained) || Number.isNaN(total)) {
              this.presentAlert('Marks should be in numeric ', '');

            }
            else if (total < obtained) {
              this.presentAlert('obtained marks must be less than or equal to total marks', '');
            } else if (obtained > total) {
              this.presentAlert('Obtained Marks should be less than or equal to Total Marks ', '');

            }
            else {
              try {
                this.studentmarks.results[i1].resulttypes[i2].obtainedmarks = obtained;
                this.studentmarks.results[i1].resulttypes[i2].resultadded = true;
              } catch (err) {
                this.presentAlert('Marks should be in numeric ', '');
              }
            }


          }
        }
      ]
    }
    );
    joinclass.present();

  }
  SubmitResults() {


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
            this.studentmarks.useremail = this.parentemail;

            if (this.studentresults.studentresults.results.length > 0) {
              try {
                this.studentresults.update_results(this.studentmarks).then(() => {
                  this.presentAlert('Result updated successfully!', '')
                  this.getresultsinfo();
                }
                ).catch(() => this.presentAlert('Error while saving result', ''))
                // this.studentresults.get_results(this.parentemail);

              } catch (err) {
                this.presentAlert('Error while saving result', '')
              }
            } else {
              try {
                this.studentmarks.creationdate = new Date().getTime().toString();
                this.studentresults.insert_results(this.studentmarks).then(
                  () => {
                    this.presentAlert('Result added successfully!', '')
                    this.getresultsinfo();
                  }
                ).catch(() => this.presentAlert('Error while saving result', ''))
                //  this.studentresults.get_results(this.parentemail);

              } catch (err) {
                this.presentAlert('Error while saving result', '')
              }
            }
          }
        }
      ]
    });
    confirm.present();

  }

  calculatemarks(i: number) {

  }

  showgraph(i: number) {
    this.studentresults.get_allresults().then(() => {

      var hashkeys = [];

      let length = 0;

      this.studentmarks.results[i].resulttypes.forEach(res=>{
          hashkeys.push(res.resultname);
          length ++;
      });

      var hashvalues = [length];
      for (let i=0;i<length;i++){
        hashvalues[i] = 0.0;
      }

      let chartname = this.classresults.classresults.results[i].resultname;

      let size = 0;
      this.studentresults.studentallresults.forEach(res=>{
        res.results.forEach(result=>{
          if (result.resultname == chartname){
          result.resulttypes.forEach(restype=>{
            if (hashkeys.indexOf(restype.resultname)>=0){
              let index = hashkeys.indexOf(restype.resultname);
              hashvalues[index] = hashvalues[index] +( (restype.obtainedmarks/restype.totalmarks)*(restype.weightage));
          
            }
          });
          size++;
        }
        })
      });

      for (let i=0;i<length;i++){
        hashvalues[i] = (hashvalues[i] / size);
      }

      let stdtype: Array<resulttype> = this.studentmarks.results[i].resulttypes;
      let total = this.studentmarks.results[i].totalweightage;

      let popover = this.popoverCtrl.create('PerformanceChartsPage', { 'chartname': chartname, 'hashkeys': hashkeys, 'hashvalues':hashvalues,'stdtype': stdtype, 'total':total });
      popover.present({

      });
    }).catch(err => {
      this.presentAlert('No Student Result Exists', err);
    })

  }

  refreshresults() {
    this.getresultsinfo();
  }

  /*console.log(myEvent);
      let popover = this.popoverCtrl.create('NotificatonsPage');
      popover.present({
        ev: myEvent
      });
      */
  presentAlert(alerttitle, alertsub) {
    let alert = this.alertCtrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }

}
