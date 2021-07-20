import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RewardsOffersPage } from './rewards-offers.page';

describe('RewardsOffersPage', () => {
  let component: RewardsOffersPage;
  let fixture: ComponentFixture<RewardsOffersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsOffersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RewardsOffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
