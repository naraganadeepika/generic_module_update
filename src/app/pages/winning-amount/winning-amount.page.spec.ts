import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WinningAmountPage } from './winning-amount.page';

describe('WinningAmountPage', () => {
  let component: WinningAmountPage;
  let fixture: ComponentFixture<WinningAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinningAmountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WinningAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
