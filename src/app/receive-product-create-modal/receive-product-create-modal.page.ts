import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { MasterProductModalPage } from '../master-product-modal/master-product-modal.page';

export interface Data {
  /*movies: string;*/
  product: string
}

@Component({
  selector: 'app-receive-product-create-modal',
  templateUrl: './receive-product-create-modal.page.html',
  styleUrls: ['./receive-product-create-modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveProductCreateModalPage implements OnInit {
  public resProduct: any;
  public resProductTemp: any;

  public resProductGroup: any;
  public resProductSubGroup: any;

  public columns: any;

  public oFilterItems = {
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_ID: "",
    PRODUCT_CODE: "",
    PRODUCT_DESC: "",
  }

  public oProduct = {
    PRODUCT_ID: "",
    PRODUCT_TYPE_ID: "",
    PRODUCT_CAT_ID: (this.myAppComp.appProfile.U_TYPE == "ACT" ? "2" : "1"),
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_ID: "",
    PRODUCT_CODE: "",
    PRODUCT_DESC: "",
    PRODUCT_ID_DESC: "",
    UOM_ID: "",
    IMG1: "",
    IMG2: "",
    IMG3: "",
    GEN_ID: "",
    SCENE_ID: ""
  };

  constructor(private myAppComp: AppComponent, private http: HttpClient, private modalCtrl: ModalController) {

    this.columns = [
      { prop: 'code', name: 'รหัสสินค้า' },
      { prop: 'name', name: 'ชื่อสินค้า' },
      { prop: 'uom', name: 'หน่วยนับ' }
    ];

  }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getAllProduct();
    this.getAllProductGroup();
    //this.getAllProductSubGroup();
  }

  async getAllProductGroup() {
    await this.http.get(this.myAppComp.strAPIURL + '/getAllProductGroup')
      .subscribe(data => {
        //console.log(data);
        this.resProductGroup = data;
      });
  }

  async getAllProductSubGroup() {
    await this.http.get(this.myAppComp.strAPIURL + '/getAllProductSubGroup?strPRODUCT_GROUP_ID=' + this.oFilterItems.PRODUCT_GROUP_ID)
      .subscribe(data => {
        //console.log(data);
        this.resProductSubGroup = data;
      });
  }

  getAllProduct() {
    this.http.get(this.myAppComp.strAPIURL + '/getAllProduct')
      .subscribe(data => {
        //console.log(data);
        this.resProduct = data;
        this.resProductTemp = data;
        this.setFilteredItems();
      });
  }

  async openModalMasterProduct(oVal) {
    const modal = await this.modalCtrl.create({
      component: MasterProductModalPage,
      componentProps: { pProduct: oVal },
      cssClass: 'modalCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getAllProduct();
        //console.log('return value is : '+ JSON.stringify(res));
        if (res.data.PRODUCT_CODE != "") {
          this.oFilterItems.PRODUCT_CODE = res.data.PRODUCT_CODE;
          this.setFilteredItems();
        }
      });
    return await modal.present();
  }

  selectProduct(oProduct) {
    //console.log('select : ' + oProduct);
    this.modalCtrl.dismiss(oProduct);
  }

  dismiss() {
    this.modalCtrl.dismiss(this.oProduct);
  }

  filterItems() {
    if (this.oFilterItems.PRODUCT_GROUP_ID == "" && this.oFilterItems.PRODUCT_SUBGROUP_ID == "" &&
      this.oFilterItems.PRODUCT_CODE == "" && this.oFilterItems.PRODUCT_DESC == "")
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

      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resProduct = this.filterItems();
  }
}
