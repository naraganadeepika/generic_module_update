import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderoneComponent } from '../components/headerone/headerone.component';

import { HeadertwoComponent } from '../components/headertwo/headertwo.component';

@NgModule({

	declarations:[HeaderoneComponent,HeadertwoComponent],
	exports:[HeaderoneComponent,HeadertwoComponent],
	imports:[CommonModule,IonicModule]

})

export class HeadersharedModule{}