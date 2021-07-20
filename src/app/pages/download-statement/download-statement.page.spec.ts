import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadStatementPage } from './download-statement.page';

describe('DownloadStatementPage', () => {
  let component: DownloadStatementPage;
  let fixture: ComponentFixture<DownloadStatementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadStatementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadStatementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
