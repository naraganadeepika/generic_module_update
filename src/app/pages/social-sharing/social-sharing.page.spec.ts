import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SocialSharingPage } from './social-sharing.page';

describe('SocialSharingPage', () => {
  let component: SocialSharingPage;
  let fixture: ComponentFixture<SocialSharingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialSharingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSharingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
