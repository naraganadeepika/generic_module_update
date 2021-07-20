import { Component, OnInit } from '@angular/core';
import { UserService, ErrorService, ToastersService } from '../../providers';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
kyc_status:any;
  constructor(public user:UserService) { }

  ngOnInit() {
  	this.user.over_all_kyc_status().subscribe((resp:any)=>{
         this.kyc_status=resp.kyc;
    })
  }


}
