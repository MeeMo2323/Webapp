import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { MasterCustomerPage } from '../master-customer/master-customer.page';
import { ReturnCreateModalPage } from '../return-create-modal/return-create-modal.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-return-create',
  templateUrl: './return-create.page.html',
  styleUrls: ['./return-create.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReturnCreatePage implements OnInit {
  @ViewChild('myTable') table: any;

  private dateValue: any;
  public resHReturn: any;
  public resIReturn: any;

  public deleteList: any;
  public pReturn: any;
  public pMode: any;

  isConfirmed: boolean;

  public oHReturn = {
    RECEIVE_HID: "",
    DOC_NO: "",
    DOC_DATE: "",
    CUST_ID: "",
    CUST_COMPNAME: "",
    CUST_ADDR1: "",
    CUST_ADDR2: "",
    CUST_NAME: "",
    CUST_TEL: "",
    TAX_NO: "",
    RETURN_DATE: "",
    NOTE: "",
    STATUS: "",
    CREATE_BY: "",
    UPDATE_BY: "",
    DELETED_LIST: "",
    isCONFIRMED: ""
  }

  public oIReturn = {
    RETURN_IID: "",
    RETURN_HID: "",
    BORROW_IID: "",
    BORROW_DOCNO: "",
    PRODUCT_ID: "",
    QTY_BR: "",
    QTY_RT: "",
    LOC_ID_BR: "",
    LOC_ID_RT: "",
    LOC_ID_BR_DESC: "",
    LOC_ID_RT_DESC: "",
    CUST_NAME: "",
    CUST_COMPNAME: "",
    CREATE_BY: ""
  }

  constructor(private myAppComp: AppComponent, private alertController: AlertController,
    private http: HttpClient, private modalController: ModalController,
    private _router: Router, public datepipe: DatePipe, private storage: Storage) {
    this.resIReturn = new Array;
  }

  ngOnInit() {
    if (this.pReturn == "" || this.pReturn == undefined) {
      this.resHReturn = this.oHReturn;
    }
    else if (this.pReturn != undefined && this.pReturn != "") {
      this.resHReturn = this.pReturn;
      this.deleteList = "";
      this.getReturnDetails();
      if (this.resHReturn.STATUS == "COMFIRMED")
        this.resHReturn.isCONFIRMED = "1";
      else
        this.resHReturn.isCONFIRMED = "0";

      this.isConfirmed = this.resHReturn.STATUS == "CONFIRMED" ? true : false;
    }

  }

  ngAfterViewInit() {
    this.myAppComp.getValStorage();
    //this.getAllVendor();
    if (this.pMode == undefined) {
      this.pMode = 'C';
      this.resHReturn.DOC_DATE = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    }

  }

  async openModalMasterCustomer() {
    const modal = await this.modalController.create({
      component: MasterCustomerPage,
      cssClass: 'modalCustomerCustomsize',
      componentProps: { pIsOpenFromPopup: 1 },
    });

    modal.onDidDismiss()
      .then((res) => {
        console.log('return value is : ' + JSON.stringify(res));
        if (res.data.CUST_ID != "") {
          this.resHReturn.CUST_ID = res.data.CUST_ID;
          this.resHReturn.CUST_COMPNAME = res.data.CUST_COMPNAME;
          this.resHReturn.CUST_ADDR1 = res.data.CUST_ADDR1;
          this.resHReturn.CUST_ADDR2 = res.data.CUST_ADDR2;
          this.resHReturn.CUST_NAME = res.data.CUST_NAME;
          this.resHReturn.CUST_TEL = res.data.CUST_TEL;
          this.resHReturn.TAX_NO = res.data.TAX_NO;
        }
      });
    return await modal.present();
  }

  async openModalReturnProduct() {
    const modal = await this.modalController.create({
      component: ReturnCreateModalPage,
      cssClass: 'modalCustomsize'
    });

    modal.onDidDismiss()
      .then((res) => {
        //console.log('return value is : '+ JSON.stringify(res));
        if (res.data.PRODUCT_CODE != "") {
          this.resIReturn.push({
            RETURN_IID: "",
            RETURN_HID: this.resHReturn.RETURN_HID,
            BORROW_IID: res.data.BORROW_IID,
            BORROW_DOCNO: res.data.BORROW_DOCNO,
            PRODUCT_ID: res.data.PRODUCT_ID,
            PRODUCT_CODE: res.data.PRODUCT_CODE,
            PRODUCT_DESC: res.data.PRODUCT_DESC,
            QTY_BR: res.data.QTY_BR,
            QTY_RT: 1,
            IMG1: res.data.IMG1,
            IMG2: res.data.IMG2,
            IMG3: res.data.IMG3,
            LOCATION: res.data.LOCATION,
            LOC_ID_FROM: res.data.LOC_ID,
            UOM_DESC: res.data.UOM_DESC,
            CUST_NAME: res.data.CUST_NAME,
            CUST_COMPNAME: res.data.CUST_COMPNAME,
          });
          this.resIReturn = [...this.resIReturn];
        }
      });
    return await modal.present();
  }

  validToSaveData() {

    if (this.resHReturn.RETURN_DATE == "") {
      this.myAppComp.showAlert("กรุณาระบุวันที่จะคืนสินค้า");
      return;
    }
    else if (this.resHReturn.CUST_ID == "") {
      this.myAppComp.showAlert("กรุณาเลือกผู้คืน");
      return;
    }
    else if (this.resHReturn.CUST_TEL.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุเบอร์โทร");
      return;
    }
    else if (this.resHReturn.CUST_ADDR1.trim() == "" && this.resHReturn.CUST_ADDR2.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุที่อยู่");
      return;
    }
    else if (this.resIReturn == '') {
      this.myAppComp.showAlert("กรุณาระบุรายการอย่างน้อย 1 รายการ");
      return;
    }
    else {
      for (let i = 0; i < this.resIReturn.length; i++) {
        if (this.resIReturn[i].QTY_RT == "" || this.resIReturn[i].QTY_RT == undefined || Number(this.resIReturn[i].QTY_RT <= 0)) {
          this.myAppComp.showAlert("กรุณาตรวจสอบข้อมูลจำนวน : " + this.resIReturn[i].PRODUCT_DESC);
          return;
        }
      }
    }

    if (this.resHReturn.RETURN_HID == undefined || this.resHReturn.RETURN_HID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

  /* done */
  async saveData() {
    // alert(JSON.stringify(this.arrVal))
    this.resHReturn.RETURN_DATE = this.datepipe.transform(this.resHReturn.RETURN_DATE, 'yyyy/MM/dd');
    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(this.resHReturn));
    formData.append('IData', JSON.stringify(this.resIReturn));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {

        this.http.post<any>(this.myAppComp.strAPIURL + '/createReturn', formData, this.myAppComp.getHttpHeader(value))
        .subscribe(data => {
          //console.log(data);
          if (data['response'].RESULT == "E") {
            this.myAppComp.logOut();
            return;
          }
          if (data['response'].RESULT == "1") {
            this.myAppComp.showToast(data['response'].MESSAGE, "success");
            this.navigateTo("/return-list");
          } else {
            this.myAppComp.showToast(data['response'].MESSAGE, "danger");
            return;
          }
          this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
  
        });

      }
    });



    


  }

  /* done */
  async updateData() {
    //console.log('details data : ' + JSON.stringify(this.resIReturn));
    this.resHReturn.RETURN_DATE = this.datepipe.transform(this.resHReturn.RETURN_DATE, 'yyyy/MM/dd');
    if (this.deleteList != "")
      this.resHReturn.DELETED_LIST = this.deleteList;

    this.resHReturn.isCONFIRMED = this.isConfirmed ? "1" : "0";

    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(this.resHReturn));
    formData.append('IData', JSON.stringify(this.resIReturn));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateReturn', formData,this.myAppComp.getHttpHeader(value))
        .subscribe(data => {
          //console.log(JSON.stringify(data));
          if (data['response'].RESULT == "E") {
            this.myAppComp.logOut();
            return;
          }  
          if (data['response'].RESULT == "1") {
            this.myAppComp.showToast(data['response'].MESSAGE, "success");
            if (this.pMode == 'C')
              this.navigateTo("/return-list");
            else
              this.dismiss();
          }else {
            this.myAppComp.showToast(data['response'].MESSAGE, "danger");
            return;
          }  
          this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
        });
      }
    });

  }

  async confirmDeleteProduct(oItem) {
    //console.log('return data is : '+ JSON.stringify(oItem));
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลที่เลือกจะถูกลบออกจากรายการ',
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
            this.deleteProduct(oItem);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProduct(oItem) {
    let formData: FormData = new FormData();
    for (let [i, item] of this.resIReturn.entries()) {
      if (item.RETURN_IID == "") {
        if (item.PRODUCT_CODE === oItem.PRODUCT_CODE) {
          this.resIReturn.splice(i, 1);
          this.resIReturn = [...this.resIReturn];
        }
      } else {
        if (item.RETURN_IID === oItem.RETURN_IID) {
          this.deleteList = this.deleteList + ',' + oItem.RETURN_IID;
          this.resIReturn.splice(i, 1);
          this.resIReturn = [...this.resIReturn];
        }
      }
    }
  }
  /* done */
  async getReturnDetails() {

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {

        this.http.get(this.myAppComp.strAPIURL + '/getReturnDetails?RETURN_HID=' + this.resHReturn.RETURN_HID, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            //console.log('Receive details : ' + JSON.stringify(data));
            this.resIReturn = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  navigateTo(oPage) {
    this._router.navigateByUrl(oPage)
  }

  dismiss() {
    if (this.pMode != 'C')
      this.modalController.dismiss();
  }

  toggleExpandRow(row) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

}
