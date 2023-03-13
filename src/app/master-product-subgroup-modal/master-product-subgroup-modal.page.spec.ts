import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MasterProductSubgroupModalPage } from './master-product-subgroup-modal.page';

describe('MasterProductSubgroupModalPage', () => {
  let component: MasterProductSubgroupModalPage;
  let fixture: ComponentFixture<MasterProductSubgroupModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProductSubgroupModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterProductSubgroupModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
