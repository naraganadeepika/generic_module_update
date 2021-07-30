import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService, ErrorService,ToastersService } from '../../providers/';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
   information: any;
  automaticClose = false;
  selectedLang:string;
  constructor(private http: HttpClient, public user:UserService) { }

  ngOnInit() {
  }

  //getting the faqs from the backend
  ionViewWillEnter()
  {
    // console.log('hi');
     this.user.get_frequently_asked_questions().subscribe((resp:any) => {
      this.information=resp.faqs;
      // console.log(resp.faqs);
    });
  }

  

}
