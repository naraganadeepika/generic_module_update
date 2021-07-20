import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {
  @Input('product') product: any;

  constructor() { }

  ngOnInit() {
  }

}
