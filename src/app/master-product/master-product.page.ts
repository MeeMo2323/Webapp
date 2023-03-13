import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';
import { ModalController } from '@ionic/angular';
import { MasterProductModalPage } from '../master-product-modal/master-product-modal.page';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

export interface Data {
  /*movies: string;*/
  product: string
}

@Component({
  selector: 'app-master-product',
  templateUrl: './master-product.page.html',
  styleUrls: ['./master-product.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductPage {
  public data: Data;
  public columns: any;
  public rows: any;

  public resProduct: any;
  public resProductTemp: any;

  public resProductGroup: any;
  public resProductSubGroup: any;
  public resGeneration: any;
  public resScene: any;

  public oProduct: any;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  public oFilterItems = {
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_ID: "",
    PRODUCT_CODE: "",
    PRODUCT_DESC: "",
    GEN_ID: "",
    SCENE_ID: ""
  }

  constructor(private alertController: AlertController, private http: HttpClient, private myAppComp: AppComponent,
    private modalController: ModalController, private loadingCtrl: LoadingController, private storage: Storage) {

    this.columns = [
      { prop: 'PRODUCT_GROUP_DESC', name: 'กลุ่มสินค้าหลัก', width: 100 },
      { prop: 'PRODUCT_SUBGROUP_DESC', name: 'กลุ่มสินค้าย่อย', width: 100 },
      { prop: 'PRODUCT_CODE', name: 'รหัสสินค้า', width: 100 },
      { prop: 'PRODUCT_DESC', name: 'ชื่อสินค้า', width: 200 },
      { prop: 'UOM_DESC', name: 'หน่วยนับ', width: 100 },
      { prop: 'GENERATION_DESC', name: 'ยุค', width: 100 },
      { prop: 'SCENE_DESC', name: 'ฉาก', width: 100 }
    ];
    //this.getProductList();
  }

  ngOnInit() { }


  ionViewDidEnter() {
    this.myAppComp.getValStorage();
    this.getAllProduct();
    this.getAllProductGroup();
    this.getAllGeneration();
    this.getAllScene();
  }

  ngAfterViewInit() { }

  /* API request */
  /* done */
  async getAllProductGroup() {
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

  /* done */
  async getAllProductSubGroup() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllProductSubGroup?strPRODUCT_GROUP_ID=' + this.oFilterItems.PRODUCT_GROUP_ID, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            // console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resProductSubGroup = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  /* done */
  async getAllGeneration() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllGeneration', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resGeneration = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  /* done */
  async getAllScene() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllScene', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resScene = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  async openModalMasterProduct(oVal) {
    const modal = await this.modalController.create({
      component: MasterProductModalPage,
      componentProps: { pProduct: oVal },
      cssClass: 'modalCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getAllProduct();
      });
    return await modal.present();
  }

  onActivate(event) {
    if (event.type == 'click') {
      console.log('test' + event.row);
    }
  }

  onSelect({ selected }) {
    console.log('Select Event', selected);
  }

  /* done */
  async getAllProduct() {
    this.showLoading();

    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllProduct', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log('return data are : ' +data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resProduct = data['data'];;
            this.resProductTemp = data['data'];;
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.hideLoading();
          });
      }
    });

  }

  async confirmDeleteProduct(pProduct) {
    console.log('start delete...');
    this.oProduct = pProduct;
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลสินค้าที่เลือกจะถูกลบออกจากระบบ',
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
            this.deleteProduct();
          }
        }
      ]
    });
    await alert.present();
  }

  /* done */
  async deleteProduct() {
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oProduct));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/deleteProduct', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.getAllProduct();
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });


  }

  filterItems() {
    //console.log('this.oFilterItems.PRODUCT_GROUP_ID =' +this.oFilterItems.PRODUCT_GROUP_ID);
    if (this.oFilterItems.PRODUCT_GROUP_ID == "" && this.oFilterItems.PRODUCT_SUBGROUP_ID == "" &&
      this.oFilterItems.PRODUCT_CODE == "" && this.oFilterItems.PRODUCT_DESC == "" &&
      this.oFilterItems.GEN_ID == "" && this.oFilterItems.SCENE_ID == "")
      return this.resProductTemp;
    else {
      let tmpRes = this.resProductTemp;
      if (this.oFilterItems.PRODUCT_GROUP_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_GROUP_ID == this.oFilterItems.PRODUCT_GROUP_ID; });
      }
      if (this.oFilterItems.PRODUCT_SUBGROUP_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_SUBGROUP_ID == this.oFilterItems.PRODUCT_SUBGROUP_ID; });
      }
      if (this.oFilterItems.PRODUCT_CODE != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_CODE.toString().includes(this.oFilterItems.PRODUCT_CODE); });
      }
      if (this.oFilterItems.PRODUCT_DESC != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_DESC.toString().includes(this.oFilterItems.PRODUCT_DESC); });
      }
      if (this.oFilterItems.GEN_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.GEN_ID == this.oFilterItems.GEN_ID; });
      }
      if (this.oFilterItems.SCENE_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.SCENE_ID == this.oFilterItems.SCENE_ID; });
      }

      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resProduct = this.filterItems();
    //console.log('resproduct =' +this.resProduct);
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }


}
