import { SuccessmodalPage } from './../modals/successmodal/successmodal.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-requestreview',
  templateUrl: './requestreview.page.html',
  styleUrls: ['./requestreview.page.scss'],
})
export class RequestreviewPage implements OnInit {
  typee: any;
  title: any;
  constructor(public modalCtrl: ModalController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.typee = params["type"];
    });
    this.setTitle();
  }

  setTitle() {
    console.log(this.typee);
    if (this.typee == 'request') {
      this.title = "Review and Request";
    }

    if (this.typee == 'send') {
      this.title = "Review and Send";
    }
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: SuccessmodalPage,
      backdropDismiss: true
    });

    return await modal.present();
  }
}
