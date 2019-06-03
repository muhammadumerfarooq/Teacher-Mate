import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isPresent } from 'ionic-angular/umd/util/util';

/**
 * Generated class for the EditOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-option',
  templateUrl: 'edit-option.html',
})
export class EditOptionPage {

  answerForm: FormGroup;
  question:string = "";
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,

  ) {
    this.answerForm = new FormGroup({
      answer: new FormControl(this.question, Validators.required)
    })
    
     let data = navParams.get('type');
     
    // this._mode = isPresent(data) && isPresent(data.mode) ? data.mode : '';
    // this._question_id = isPresent(data) && isPresent(data.questionId) ? data.questionId : '';
    // this._answer_id = isPresent(data) && isPresent(data.answerId) ? data.answerId : '';
  }

  ionViewWillLoad() {

  }

  dismiss() {
   
    this.viewCtrl.dismiss(true);
  }

  onSubmit(value){
    this.viewCtrl.dismiss(this.question);
  }

}
