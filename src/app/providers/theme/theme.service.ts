import { Injectable, RendererFactory2, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode: any;
  renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document) 
  {

    this.renderer = this.rendererFactory.createRenderer(null, null);

  }

  enableDark() {
    this.renderer.addClass(this.document.body, 'dark-theme');

    localStorage.setItem('dark-theme',JSON.stringify( true));
    this.darkMode = true;
  }

  enableLight() 
  {
    this.renderer.removeClass(this.document.body, 'dark-theme');
    localStorage.setItem('dark-theme', JSON.stringify(false));
    this.darkMode = false;
  }


  themeMode() {
    if (this.darkMode) {
      this.enableLight();
      console.log('Dark Mode', this.darkMode);

    } else {
      this.enableDark();
      console.log('Dark Mode', this.darkMode);
    }
  }

  // onClick(event){
  //   let systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  //   // systemDark.addListener(this.colorTest);

  //   // console.log(this.colorTest)
  //   if(event.detail.checked){
  //     console.log(event.detail.checked)
  //     document.body.setAttribute('dark-theme', 'dark');
  //   }
  //   else{
  //     document.body.setAttribute('dark-theme', 'light');
  //   }
  // }

  //  colorTest(systemInitiatedDark) {
  //    console.log(systemInitiatedDark)
  //   if (systemInitiatedDark.matches) {
  //     document.body.setAttribute('dark-theme', 'dark');    
  //   } else {
  //     document.body.setAttribute('dark-theme', 'light');
  //   }
  // }



}
