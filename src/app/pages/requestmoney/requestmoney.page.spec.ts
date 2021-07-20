import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestmoneyPage } from './requestmoney.page';

describe('RequestmoneyPage', () => {
  let component: RequestmoneyPage;
  let fixture: ComponentFixture<RequestmoneyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestmoneyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestmoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
