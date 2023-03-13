import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-return-create-modal',
  templateUrl: './return-create-modal.page.html',
  styleUrls: ['./return-create-modal.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReturnCreateModalPage implements OnInit {
  @ViewChild('myTable') table: any;
  public resProduct: any;
  public resProductTemp: any;

  public oFilterItems = {
    BORROW_DOCNO: "",
    CUST_NAME: "",
    CUST_COMPNAME: ""
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

  constructor(private myAppComp: AppComponent, private http: HttpClient,
    private modalCtrl: ModalController, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getProductToReturn();
  }

  dismiss() {
    this.modalCtrl.dismiss(this.oProduct);
  }

  selectProduct(oProduct) {
    //console.log('select : ' + oProduct);
    this.modalCtrl.dismiss(oProduct);
  }

  /* done */
  async getProductToReturn() {

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getProductToReturn', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resProduct = data['data'];
            this.resProductTemp = data['data'];
            this.setFilteredItems();
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  filterItems() {
    if (this.oFilterItems.BORROW_DOCNO == "" && this.oFilterItems.CUST_NAME == "" && this.oFilterItems.CUST_COMPNAME == "")
      return this.resProductTemp;
    else {
      let tmpRes = this.resProductTemp;
      if (this.oFilterItems.BORROW_DOCNO != "") {
        tmpRes = tmpRes.filter((item) => { return item.BORROW_DOCNO.toString().includes(this.oFilterItems.BORROW_DOCNO); });
      }
      if (this.oFilterItems.CUST_NAME != "") {
        tmpRes = tmpRes.filter((item) => { return item.CUST_NAME.toString().includes(this.oFilterItems.CUST_NAME); });
      }
      if (this.oFilterItems.CUST_COMPNAME != "") {
        tmpRes = tmpRes.filter((item) => { return item.CUST_COMPNAME.toString().includes(this.oFilterItems.CUST_COMPNAME); });
      }
      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resProduct = this.filterItems();
  }

}
