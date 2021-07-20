import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddincomePage } from './addincome.page';

describe('AddincomePage', () => {
  let component: AddincomePage;
  let fixture: ComponentFixture<AddincomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddincomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddincomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
