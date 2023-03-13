import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ModalController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/core';
import { MasterProductSubgroupModalPage } from '../master-product-subgroup-modal/master-product-subgroup-modal.page';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-product-subgroup',
  templateUrl: './master-product-subgroup.page.html',
  styleUrls: ['./master-product-subgroup.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductSubgroupPage implements OnInit {
  public resProductSubGroup: any;
  public resProductSubGroupTemp: any;

  public resProductGroup: any;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  public oFilterItems = {
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_DESC: ""
  }

  constructor(private myAppComp: AppComponent, private http: HttpClient, private alertController: AlertController,
    private modalCtrl: ModalController, private loadingCtrl: LoadingController, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getAllProductSubGroup();
    this.getAllProductGroup();
  }

  /* API request */
  /* done */
  async getAllProductSubGroup() {
    this.showLoading();
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllProductSubGroup', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resProductSubGroup = data['data'];;
            this.resProductSubGroupTemp = data['data'];;
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.hideLoading();
          });
      }
    });
  }

  /* done */
  async getAllProductGroup() {
    this.showLoading();
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllProductGroup', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resProductGroup = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  async openModalMasterProductSubGroup(oVal) {
    const modal = await this.modalCtrl.create({
      component: MasterProductSubgroupModalPage,
      componentProps: { pProductSubGroup: oVal },
      cssClass: 'modalProductSubGroupCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getAllProductSubGroup();
      });
    return await modal.present();
  }

  filterItems() {
    if (this.oFilterItems.PRODUCT_GROUP_ID == "" && this.oFilterItems.PRODUCT_SUBGROUP_DESC == "")
      return this.resProductSubGroupTemp;
    else {
      let tmpRes = this.resProductSubGroupTemp;
      if (this.oFilterItems.PRODUCT_GROUP_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_GROUP_ID == this.oFilterItems.PRODUCT_GROUP_ID; });
      }
      if (this.oFilterItems.PRODUCT_SUBGROUP_DESC != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_SUBGROUP_DESC.toString().includes(this.oFilterItems.PRODUCT_SUBGROUP_DESC); });
      }

      return tmpRes;
    }
  }

  async confirmDeleteProduct(pProductSubGroup) {
    //console.log('start delete...');
    //this.oProduct = pProduct;
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลกลุ่มสินค้าหลักที่เลือกจะถูกลบออกจากระบบ',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ยืนยัน',
          handler: () => {
            this.deleteProductGroup(pProductSubGroup);
          }
        }
      ]
    });
    await alert.present();
  }

  /* done */
  async deleteProductGroup(pProductSubGroup) {
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(pProductSubGroup));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/deleteProductSubGroup', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.getAllProductSubGroup();
            }
            else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
          });
      }
    });
  }

  setFilteredItems() {
    this.resProductSubGroup = this.filterItems();
    //console.log('resproduct =' +this.resProduct);
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }

}
