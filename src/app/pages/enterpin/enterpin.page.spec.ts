import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnterpinPage } from './enterpin.page';

describe('EnterpinPage', () => {
  let component: EnterpinPage;
  let fixture: ComponentFixture<EnterpinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnterpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
