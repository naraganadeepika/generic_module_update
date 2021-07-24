import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-headerone',
  templateUrl: './headerone.component.html',
  styleUrls: ['./headerone.component.scss'],
})
export class HeaderoneComponent implements OnInit {
  
  @Input() title: string;
  @Input() backpath :any;

  constructor() { }

  ngOnInit() {}

}
