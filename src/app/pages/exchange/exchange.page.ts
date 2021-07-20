import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import * as crosshair from 'chartjs-plugin-crosshair';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  @ViewChild('lineCanvas', {static: true}) lineCanvas;
  bars: any;
  colorArray: any;
  lineChart: any;
  constructor(private navCtrl:NavController) { 
    
  }

  ngOnInit() {
    this.lineChartMethod();
  }

  logout()
  {
    this.navCtrl.navigateRoot('login')
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      maintainAspectRatio: false,
      responsive: true,
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        datasets: [
          {
            label: 'Income',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(28,199,116,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(28,199,116,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(28,199,116,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [300, 200, 350, 200, 400, 150, 300, 270, 350, 200, 300, 400],
            spanGaps: false,
          },
          {
            label: 'Expense',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(242,71,80,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(242,71,80,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(242,71,80,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [100, 150, 200, 120, 170, 250, 300, 100, 170, 220, 150, 100],
            spanGaps: false,
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
              ticks: {
                  fontSize: 8,
                  display: true
              }
          }],
          yAxes: [{
              ticks: {
                  fontSize: 10,
                  beginAtZero: true
              }
              ,
              scaleLabel: {
                labelString: 'US Dollars',
                display: true
              }
          },]
      },
      legend: {
        align: 'start'
      }
      }
    });
  }

}
