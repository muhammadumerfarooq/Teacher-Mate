import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { resulttype } from '../../providers/studentresults-service/studentresults-service';
import { dummyclass } from '../studentmarks/studentmarks';

/**
 * Generated class for the PerformanceChartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-performance-charts',
  templateUrl: 'performance-charts.html',
})

export class PerformanceChartsPage {

  @ViewChild('barCanvas') barCanvas;

  barChart: any;
  chartname: string = '';
  restype: Array<resulttype>;
  typesavg:  dummyclass[] = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.restype = new Array<resulttype>();

    this.chartname = this.navParams.get('chartname');
    this.restype = this.navParams.get('stdtype');
    this.typesavg = this.navParams.get('typesavg');

  }

  ionViewDidLoad() {

    let resultnames = new Array<string>();
    let myweigh= new Array<number>();

    let stdnames = new Array<string>();
    let stdweigh = new Array<number>();
    
    this.typesavg.forEach(res=>{
      stdnames.push(res.resultname);
      stdweigh.push(res.weightage);
    });

    this.restype.forEach(res=>{
      resultnames.push(res.resultname);
      myweigh.push((res.obtainedmarks/res.totalmarks)*res.weightage);
    });

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: resultnames,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',

          
          data: myweigh,// [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',

            /*'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(46, 204, 113 , 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'*/
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        },
        {
          label: 'Line Dataset',

          data: stdweigh,//[20, 10, 25, 35, 2, 3],
          /* backgroundColor:[
             'rgba(255, 99, 132, 0.2)',
             'rgba(255, 99, 132, 0.2)',
             'rgba(255, 99, 132, 0.2)',
             'rgba(255, 99, 132, 0.2)',
             'rgba(255, 99, 132, 0.2)',
 
           ]*/
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            /*
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(46, 204, 113, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'*/
          ],

          borderColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            /*
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(46, 204, 113, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'*/
          ],

          /* borderColor: [
             'rgba(255,99,132,1)',
             'rgba(54, 162, 235, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(46, 204, 113  , 1)',
             'rgba(153, 102, 255, 1)',
             'rgba(255, 159, 64, 1)'
           ],
           */
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });

  }

}
