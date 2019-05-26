import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { myfolio } from '../../providers/portfolio-list/portfolio-list';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the HistoryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export class folioinfo {
  description: string;
  percent:number;
  background:string;
  name:string;
  constructor(){
    this.description = '';
    this.background = '';
    this.name = '';
    this.percent = 0;
  }
}

@IonicPage()
@Component({
  selector: 'page-history-detail',
  templateUrl: 'history-detail.html',
})
export class HistoryDetailPage {
  folioinfos : Array<folioinfo>;
  portfolios : myfolio;
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewctrl:ViewController) {
    this.portfolios = new myfolio();
    this.portfolios = this.navParams.get('folio');
    this.folioinfos = new Array<folioinfo>();
    this.portfolios.foliolist.forEach(fol=>{
      this.portfolios.portfolio.foliotypes.forEach(myfol=>{
        if (fol.typename == myfol.name){
          let type = new folioinfo();
          type.background = myfol.background;
          type.description = fol.description;
          type.name = fol.typename;
          type.percent  = myfol.percent;
          this.folioinfos.push(type);
        }
      })
    });

  }

  setborder(folio: folioinfo) {
    let index = this.folioinfos.indexOf(folio);
    let styles = {
      'margin-top': '5%',
      'color': '#FFF',
      'border': 'thin solid' + this.folioinfos[index].background,
      'border-radius': '1.2em'
    };
    return styles;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryDetailPage');
  }

  viewctrl_dismiss(){
    this.viewctrl.dismiss();
  }

}
