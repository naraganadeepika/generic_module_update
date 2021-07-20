import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmitpinPage } from './submitpin.page';

describe('SubmitpinPage', () => {
  let component: SubmitpinPage;
  let fixture: ComponentFixture<SubmitpinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitpinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
