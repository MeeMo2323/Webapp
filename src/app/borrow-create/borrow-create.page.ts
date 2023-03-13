import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { BorrowCreateModalPage } from '../borrow-create-modal/borrow-create-modal.page';
import { MasterCustomerPage } from '../master-customer/master-customer.page';
import { BorrowFormPage } from '../borrow-form/borrow-form.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-borrow-create',
  templateUrl: './borrow-create.page.html',
  styleUrls: ['./borrow-create.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BorrowCreatePage implements OnInit {
  @ViewChild('myTable') table: any;
  ColumnMode = ColumnMode;

  private dateValue: any;
  public resHBorrow: any;
  public resIBorrow: any;

  public resLocation: any;

  public deleteList: any;
  public pBorrow: any;
  public pMode: any;

  isApproved: boolean;

  public oIBorrow = {
    BORROW_IID: "",
    BORROW_HID: "",
    PRODUCT_ID: "",
    QTY: "",
    LINE_AMOUNT: "",
    RETURN_DATE: "",
    LOC_ID_FROM: "",
    LOC_ID_TO: "",
    IS_DEL: "",
    CREATE_DATE: "",
    CREATE_BY: "",
    UPDATE_DATE: "",
    UPDATE_BY: "",
    DELETE_DATE: "",
    DELETE_BY: "",
    REASON_DESC: ""
  }

  public oHBorrow = {
    BORROW_HID: "",
    DOC_NO: "",
    DOC_DATE: "",
    CUST_ID: "",
    CUST_COMPNAME: "",
    CUST_ADDR1: "",
    CUST_ADDR2: "",
    CUST_NAME: "",
    CUST_TEL: "",
    TAX_NO: "",
    BORROW_TYPE: "",
    BORROW_LOC: "",
    BORROW_LOC_DESC: "",
    BORROW_VENDOR: "",
    LOCATION: "",
    LOC_ID_FROM: "",
    LOC_ID_TO: "",
    STATUS: "",
    BORROW_REASON: "",
    NOTE: "",
    CREATE_DATE: "",
    CREATE_BY: "",
    UPDATE_DATE: "",
    UPDATE_BY: "",
    APPROVE_DATE: "",
    APPROVE_BY: "",
    CANCEL_DATE: "",
    CANCEL_BY: "",
    CANCEL_REASON: "",
    isCONFIRMED: ""
  }

  constructor(public myAppComp: AppComponent, private alertController: AlertController,
    private http: HttpClient, private modalController: ModalController, private _router: Router,
    public datepipe: DatePipe, private storage: Storage) {
    this.resIBorrow = new Array;
  }

  ngOnInit() {
    this.myAppComp.getValStorage();
    this.getAllLocation();
    //console.log('Mode:' + this.pMode);
    if (this.pBorrow == "" || this.pBorrow == undefined) {
      this.resHBorrow = this.oHBorrow;
    }
    else if (this.pBorrow != undefined && this.pBorrow != "") {
      this.resHBorrow = this.pBorrow;
      this.deleteList = "";
      this.getBorrowDetails();
      if (this.resHBorrow.STATUS == "COMFIRMED")
        this.resHBorrow.isCONFIRMED = "1";
      else
        this.resHBorrow.isCONFIRMED = "0";

      this.isApproved = this.resHBorrow.STATUS == "APPROVED" ? true : false;
    }
  }

  ngAfterViewInit() {
    this.myAppComp.getValStorage();
    if (this.pMode == undefined) {
      this.pMode = 'C';
      this.resHBorrow.DOC_DATE = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    }
  }

  validToSaveData() {

    if (this.resHBorrow.BORROW_TYPE == "") {
      this.myAppComp.showAlert("กรุณาระบุประเภท เช่า / ยืม");
      return;
    }
    else if (this.resHBorrow.BORROW_LOC == "") {
      this.myAppComp.showAlert("กรุณาเลือก ในสถานที่ / นอกสถานที่");
      return;
    }
    else if (this.resHBorrow.BORROW_LOC == "EX" && this.resHBorrow.BORROW_LOC_DESC.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุสถานที่");
      return;
    }
    else if (this.resHBorrow.BORROW_FROM == "") {
      this.myAppComp.showAlert("กรุณาระบุวันที่รับสินค้า");
      return;
    }
    else if (this.resHBorrow.BORROW_TO == "") {
      this.myAppComp.showAlert("กรุณาระบุวันที่จะคืนสินค้า");
      return;
    }
    else if (this.resHBorrow.BORROW_TO == "") {
      this.myAppComp.showAlert("กรุณาระบุวันที่จะคืนสินค้า");
      return;
    }
    else if (this.resHBorrow.BORROW_VENDOR.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุแผนก/กองละคร");
      return;
    }
    else if (this.resHBorrow.CUST_ID == "") {
      this.myAppComp.showAlert("กรุณาเลือกผู้ยืม/เช่า");
      return;
    }
    else if (this.resHBorrow.CUST_TEL.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุเบอร์โทร");
      return;
    }
    else if (this.resHBorrow.CUST_ADDR1.trim() == "" && this.resHBorrow.CUST_ADDR2.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุที่อยู่");
      return;
    }
    else if (this.resIBorrow == '') {
      this.myAppComp.showAlert("กรุณาระบุรายการอย่างน้อย 1 รายการ");
      return;
    }
    else {
      for (let i = 0; i < this.resIBorrow.length; i++) {
        if (this.resIBorrow[i].QTY == "" || this.resIBorrow[i].QTY == undefined || Number(this.resIBorrow[i].QTY <= 0)) {
          this.myAppComp.showAlert("กรุณาตรวจสอบข้อมูลจำนวน : " + this.resIBorrow[i].PRODUCT_DESC);
          return;
        } else if (this.resHBorrow.BORROW_LOC == "IN" && (this.resIBorrow[i].LOC_ID_TO == "" || this.resIBorrow[i].LOC_ID_TO == undefined)) {
          this.myAppComp.showAlert("กรุณาตรวจสอบสถานที่ปลายทาง : " + this.resIBorrow[i].PRODUCT_DESC);
          return;
        }
        else if (this.resHBorrow.STATUS == "PENDING" && this.resHBorrow.BORROW_TYPE == "R" && this.isApproved) {
          if (this.resIBorrow[i].UNIT_PRICE == "" || this.resIBorrow[i].UNIT_PRICE == undefined ||
            Number(this.resIBorrow[i].UNIT_PRICE) < 0
          ) {
            this.myAppComp.showAlert("กรุณาตรวจสอบราคาต่อหน่วย : " + this.resIBorrow[i].PRODUCT_DESC);
            return;
          }
        }
      }
    }

    if (this.resHBorrow.BORROW_HID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

  async confirmDeleteProduct(oItem) {
    //console.log('return data is : '+ JSON.stringify(oItem));
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลสินค้าที่เลือกจะถูกลบออกจากรายการ',
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

    for (let [i, item] of this.resIBorrow.entries()) {

      if (item.BORROW_IID == "") {
        if (item.PRODUCT_CODE === oItem.PRODUCT_CODE) {
          this.resIBorrow.splice(i, 1); // Tim is now removed from "users"
          this.resIBorrow = [...this.resIBorrow];
        }
      }
      else {
        if (item.BORROW_IID === oItem.BORROW_IID) {
          this.deleteList = this.deleteList + ',' + oItem.BORROW_IID;
          this.resIBorrow.splice(i, 1); // Tim is now removed from "users"
          //console.log('delete id-' + this.deleteList);
          this.resIBorrow = [...this.resIBorrow];
        }
      }
    }
  }

  /*done*/
  async saveData() {
    // alert(JSON.stringify(this.arrVal))
    this.resHBorrow.BORROW_FROM = this.datepipe.transform(this.resHBorrow.BORROW_FROM, 'yyyy/MM/dd');
    this.resHBorrow.BORROW_TO = this.datepipe.transform(this.resHBorrow.BORROW_TO, 'yyyy/MM/dd');
    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(this.resHBorrow));
    formData.append('IData', JSON.stringify(this.resIBorrow));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/createBorrow', formData, this.myAppComp.getHttpHeader(value))
        .subscribe(data => {
          if (data['response'].RESULT == "E") {
            this.myAppComp.logOut();
            return;
          }
          //console.log(data);
          if (data['response'].RESULT == "1") {
            this.myAppComp.showToast(data['response'].MESSAGE, "success");
            this.navigateTo("/borrow-list");
          } else {
            this.myAppComp.showToast(data['response'].MESSAGE, "danger");
            return;
          }
          this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
        });
      }
    });

  }

  /*done*/
  async updateData() {
    // alert(JSON.stringify(this.arrVal)
    this.resHBorrow.BORROW_FROM = this.datepipe.transform(this.resHBorrow.BORROW_FROM, 'yyyy/MM/dd');
    this.resHBorrow.BORROW_TO = this.datepipe.transform(this.resHBorrow.BORROW_TO, 'yyyy/MM/dd');

    if (this.deleteList != "")
      this.resHBorrow.DELETED_LIST = this.deleteList;

    this.resHBorrow.isApproved = this.isApproved ? "1" : "0";

    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(this.resHBorrow));
    formData.append('IData', JSON.stringify(this.resIBorrow));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateBorrow', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log('response =' + data['response'].RESULT);
            //console.log('message =' + data['response'].MESSAGE);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              if (this.pMode == 'C')
                this.navigateTo("/receive-list");
              else
                this.dismiss();
            }else{
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }  
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  /*done*/
  async getBorrowDetails() {

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getBorrowDetails?BORROW_HID=' + this.resHBorrow.BORROW_HID, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resIBorrow = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  /*done*/
  async getAllLocation() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllLocation', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resLocation = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  async openModalMasterProduct() {
    const modal = await this.modalController.create({
      component: BorrowCreateModalPage,
      cssClass: 'modalCustomsize'
    });

    modal.onDidDismiss()
      .then((res) => {
        //console.log('return value is : '+ JSON.stringify(res));
        if (res.data.PRODUCT_CODE != "") {
          this.resIBorrow.push({
            RECEIVE_IID: "",
            RECEIVE_HID: this.resHBorrow.RECEIVE_HID,
            PRODUCT_ID: res.data.PRODUCT_ID,
            PRODUCT_CODE: res.data.PRODUCT_CODE,
            PRODUCT_DESC: res.data.PRODUCT_DESC,
            QTY: 1,
            IMG1: res.data.IMG1,
            IMG2: res.data.IMG2,
            IMG3: res.data.IMG3,
            LOCATION: res.data.LOCATION,
            LOC_ID_FROM: res.data.LOC_ID,
            UOM_DESC: res.data.UOM_DESC,
          });
          console.log('return value2 is : ' + JSON.stringify(this.resIBorrow));
          this.resIBorrow = [...this.resIBorrow];
        }
        //const user = data['data']; // Here's your selected user!
      });
    return await modal.present();
  }

  async viewBorrowForm() {
    const modal = await this.modalController.create({
      component: BorrowFormPage,
      cssClass: 'modalBorrowForm',
      componentProps: { pHBorrow: this.resHBorrow, pIBorrow: this.resIBorrow },
    });

    return await modal.present();
  }

  async openModalMasterCustomer() {
    const modal = await this.modalController.create({
      component: MasterCustomerPage,
      cssClass: 'modalCustomerCustomsize',
      componentProps: { pIsOpenFromPopup: 1 },
    });

    modal.onDidDismiss()
      .then((res) => {
        //console.log('return value is : '+ JSON.stringify(res));
        if (res.data.CUST_ID != "") {
          this.resHBorrow.CUST_ID = res.data.CUST_ID;
          this.resHBorrow.CUST_COMPNAME = res.data.CUST_COMPNAME;
          this.resHBorrow.CUST_ADDR1 = res.data.CUST_ADDR1;
          this.resHBorrow.CUST_ADDR2 = res.data.CUST_ADDR2;
          this.resHBorrow.CUST_NAME = res.data.CUST_NAME;
          this.resHBorrow.CUST_TEL = res.data.CUST_TEL;
          this.resHBorrow.TAX_NO = res.data.TAX_NO;
          //console.log('return value2 is : ' + JSON.stringify(this.resHBorrow));
        }
      });
    return await modal.present();
  }

  navigateTo(oPage) {
    this._router.navigateByUrl(oPage)
  }

  dismiss() {
    if (this.pMode != 'C')
      this.modalController.dismiss();
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }


}
