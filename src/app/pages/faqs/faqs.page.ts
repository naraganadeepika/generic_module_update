import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
   information: any[];
  automaticClose = false;
  selectedLang:string;

  constructor(private http: HttpClient) {
    
  }
  //get the lang file based on app language
  ionViewWillEnter()
  {
    this.selectedLang = localStorage.getItem('LANG');
    if(this.selectedLang=='en')
    {
    this.http.get('assets/info_en.json').subscribe(res => {
      this.information = res['items'];
      this.information[0].open = true;
    });
    }
    else if(this.selectedLang=='hnd')
    {
      this.http.get('assets/info_hnd.json').subscribe(res => {
      this.information = res['items'];
      this.information[0].open = true;
    });
    }
    else if(this.selectedLang=='tel')
    {
      this.http.get('assets/info_tel.json').subscribe(res => {
      this.information = res['items'];
      this.information[0].open = true;
    });
    }
  }
  
  toggleSection(index) {
    this.information[index].open = !this.information[index].open;

    if (this.automaticClose && this.information[index].open) {
      this.information
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  toggleItem(index, childIndex) {
    this.information[index].children[childIndex].open = !this.information[index].children[childIndex].open;
  }

  ngOnInit()
   {
    
  }

}
