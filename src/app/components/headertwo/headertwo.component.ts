import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-headertwo',
  templateUrl: './headertwo.component.html',
  styleUrls: ['./headertwo.component.scss'],
})
export class HeadertwoComponent implements OnInit {
 
  @Input() title: string; @Input() backpath :any; @Input() isparent :any; @Input() display :any;

  constructor(private navCtrl:NavController) { }

  ngOnInit() {}

   viewNotifications()
  {
    this.navCtrl.navigateForward('notifications');
  }

  editprofile(){
    this.navCtrl.navigateForward('edit-profile');
  }

}
