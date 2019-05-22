import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { resulttype, results } from '../../providers/studentresults-service/studentresults-service';
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
  hashkeys: any;
  hashvalues: any
  stdtype:  Array<resulttype> ;
  total: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.hashkeys = [];
    this.hashvalues = [];
    this.stdtype = new Array<resulttype>();

    this.total = this.navParams.get('total');

    this.chartname = this.navParams.get('chartname');
    this.hashkeys = this.navParams.get('hashkeys');
    this.hashvalues = this.navParams.get('hashvalues');
    this.stdtype = this.navParams.get('stdtype');

  }

  ionViewDidLoad() {

    let resultnames = new Array<string>();
    let myweigh= new Array<number>();

    let stdnames = new Array<string>();
    let stdweigh = new Array<number>();
    let obtained = 0;

    this.stdtype.forEach(res=>{
      obtained = obtained + ((res.obtainedmarks/res.totalmarks)*res.weightage);
      myweigh.push((res.obtainedmarks/res.totalmarks)*res.weightage);
    });

    this.hashvalues.forEach(res=>{
      stdweigh.push(res);
    });

    this.hashkeys.forEach(keys=>{
      resultnames.push(keys);

    });

   /* this.barChart =  new Chart(this.barCanvas.nativeElement, {              
      title:{
        text: "Multiple Y Axis"
      },
      axisX:{
        valueFormatString: "####",
        interval: 1
      },
      axisY:[{
        title: "Linear Scale",
        lineColor: "#369EAD",
        titleFontColor: "#369EAD",
        labelFontColor: "#369EAD"
      },
      {
        title: "Logarithmic Scale",
        logarithmic: true,
        lineColor: "#C24642",
        titleFontColor: "#C24642",
        labelFontColor: "#C24642"
      }],
      axisY2:[{
        title: "Linear Scale",
        lineColor: "#7F6084",
        titleFontColor: "#7F6084",
        labelFontColor: "#7F6084"
      },
      {
        title: "Logarithmic Scale",
        logarithmic: true,
        interval: 1,
        lineColor: "#86B402",
        titleFontColor: "#86B402",
        labelFontColor: "#86B402"
      }],
  
    data: [
    {
      type: "column",
      showInLegend: true,
      //axisYIndex: 0, //Defaults to Zero
      name: "Axis Y-1",
      xValueFormatString: "####",
      dataPoints: [
        { x: 2006, y: 6 },
        { x: 2007, y: 2 },
        { x: 2008, y: 5 },
        { x: 2009, y: 7 },
        { x: 2010, y: 1 },
        { x: 2011, y: 5 },
        { x: 2012, y: 5 },
        { x: 2013, y: 2 },
        { x: 2014, y: 2 }
      ]
    },
    {
      type: "spline",
      showInLegend: true,
      axisYIndex: 1, //Defaults to Zero
      name: "Axis Y-2",
      xValueFormatString: "####",
      dataPoints: [
        { x: 2006, y: 15 },
        { x: 2007, y: 3 },
        { x: 2008, y: 20 },
        { x: 2009, y: 10 },
        { x: 2010, y: 30 },
        { x: 2011, y: 10 },
        { x: 2012, y: 600 },
        { x: 2013, y: 20 },
        { x: 2014, y: 2 }
      ]
    },
    {
      type: "column",
      showInLegend: true,                  
      axisYType: "secondary",
      //axisYIndex: 0, //Defaults to Zero
      name: "Axis Y2-1",
      xValueFormatString: "####",
      dataPoints: [
        { x: 2006, y: 12 },
        { x: 2007, y: 20 },
        { x: 2008, y: 28 },
        { x: 2009, y: 34 },
        { x: 2010, y: 24 },
        { x: 2011, y: 45 },
        { x: 2012, y: 15 },
        { x: 2013, y: 34 },
        { x: 2014, y: 22 }
      ]
    },
    {
      type: "spline",
      showInLegend: true,                  	
      axisYType: "secondary",
      axisYIndex: 1, //When axisYType is secondary, axisYIndex indexes to secondary Y axis & not to primary Y axis
      name: "Axis Y2-2",
      xValueFormatString: "####",
      dataPoints: [
        { x: 2006, y: 86 },
        { x: 2007, y: 15 },
        { x: 2008, y: 27 },
        { x: 2009, y: 78 },
        { x: 2010, y: 46 },
        { x: 2011, y: 70 },
        { x: 2012, y: 50 },
        { x: 2013, y: 60 },
        { x: 2014, y: 50 }
      ]
    }
    ]
    });
    */
  
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      axisX:{
        valueFormatString: "####",
        interval: 1
      },
      axisY:{
        title: "Linear Scale",
        lineColor: "#369EAD",
        titleFontColor: "#369EAD",
        labelFontColor: "#369EAD"
      },
      title :{
        text: "Weightages Chart"
       },
    
      type: 'bar',
      data: {
        labels: resultnames,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: 'My Avg',
          
          
          data: myweigh,// [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',

            // /*'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(46, 204, 113 , 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)'
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

          label: 'Class Avg',

          data: stdweigh,//[20, 10, 25, 35, 2, 3],
          // /* backgroundColor:[
          //    'rgba(255, 99, 132, 0.2)',
          //    'rgba(255, 99, 132, 0.2)',
          //    'rgba(255, 99, 132, 0.2)',
          //    'rgba(255, 99, 132, 0.2)',
          //    'rgba(255, 99, 132, 0.2)',
 
          //  ]
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            // /*
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(46, 204, 113, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)'
          ],

          borderColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            // /*
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(46, 204, 113, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)'
          ],

          // /* borderColor: [
          //    'rgba(255,99,132,1)',
          //    'rgba(54, 162, 235, 1)',
          //    'rgba(255, 206, 86, 1)',
          //    'rgba(46, 204, 113  , 1)',
          //    'rgba(153, 102, 255, 1)',
          //    'rgba(255, 159, 64, 1)'
          //  ],
          //  
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'weightages'
            },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Your Weightage ('+(obtained).toPrecision(2)+'/'+this.total+')',
                fontColor: '#000',
                fontSize: 11
              }
            }
          ]
        }
      }

    });
  
  }

}
