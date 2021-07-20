import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MiningPage } from './mining.page';

describe('MiningPage', () => {
  let component: MiningPage;
  let fixture: ComponentFixture<MiningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiningPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MiningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
