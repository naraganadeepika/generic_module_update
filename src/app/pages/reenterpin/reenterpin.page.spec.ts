import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReenterpinPage } from './reenterpin.page';

describe('ReenterpinPage', () => {
  let component: ReenterpinPage;
  let fixture: ComponentFixture<ReenterpinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReenterpinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReenterpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
