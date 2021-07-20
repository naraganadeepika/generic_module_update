import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestreviewPage } from './requestreview.page';

describe('RequestreviewPage', () => {
  let component: RequestreviewPage;
  let fixture: ComponentFixture<RequestreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
