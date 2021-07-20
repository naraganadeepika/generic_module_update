import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UerInfoPage } from './uer-info.page';

describe('UerInfoPage', () => {
  let component: UerInfoPage;
  let fixture: ComponentFixture<UerInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UerInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UerInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
