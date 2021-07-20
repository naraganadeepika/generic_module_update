import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.page.html',
  styleUrls: ['./mining.page.scss'],
})
export class MiningPage implements OnInit {

  category:any = "day";
  sliderConfig={
    spaceBetween:0,
    centeredSlides:true,
    slidesPerView:1.2
  }
  constructor() { }

  ngOnInit() {
  }

}
