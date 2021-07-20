import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AffiliateAmountPage } from './affiliate-amount.page';

describe('AffiliateAmountPage', () => {
  let component: AffiliateAmountPage;
  let fixture: ComponentFixture<AffiliateAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateAmountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
