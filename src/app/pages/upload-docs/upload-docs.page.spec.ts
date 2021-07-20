import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadDocsPage } from './upload-docs.page';

describe('UploadDocsPage', () => {
  let component: UploadDocsPage;
  let fixture: ComponentFixture<UploadDocsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
