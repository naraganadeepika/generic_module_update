import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankaccountsPage } from './bankaccounts.page';

describe('BankaccountsPage', () => {
  let component: BankaccountsPage;
  let fixture: ComponentFixture<BankaccountsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankaccountsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankaccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
