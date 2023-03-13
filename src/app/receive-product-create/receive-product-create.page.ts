import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReceiveProductCreateModalPage } from '../receive-product-create-modal/receive-product-create-modal.page';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { ReceiveProductAttachmentPage } from '../receive-product-attachment/receive-product-attachment.page';
import { Storage } from '@ionic/storage';

export interface Data {
  /*movies: string;*/
  receive: string
}

@Component({
  selector: 'app-receive-product-create',
  templateUrl: './receive-product-create.page.html',
  styleUrls: ['./receive-product-create.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveProductCreatePage implements OnInit {
  @ViewChild('myTable') table: any;
  ColumnMode = ColumnMode;

  public foundItemAddnew: boolean;

  private dateValue: any;
  public resHReceive: any;
  public resIReceive: any;
  public resVendor: any;
  public resReason: any;

  public deleteList: any;
  public pReceive: any;
  public pMode: any;

  isConfirmed: boolean;

  filesIMG: FileList;

  get date(): any {
    return this.dateValue;
  }
  set date(value: any) {
    console.log({ value });
    this.dateValue = value;
  }

  public oIReceive = {
    RECEIVE_IID: "",
    RECEIVE_HID: "",
    PRODUCT_ID: "",
    PRODUCT_CODE: "",
    QTY: "",
    QTY_IN: "",
    UNIT_PRICE: "",
    FINE_PRICE: "",
    START_DATE: "",
    EXPIRE_DATE: "",
    WH_ID: "",
    REASON_ID: "",
    REASON_DESC: ""
  }

  public oHReceive = {
    RECEIVE_HID: "",
    DOC_NO: "",
    DOC_DATE: "",
    RECEIVE_DATE: "",
    SET_NO: "",
    VENDOR_ID: "",
    VENDOR_DESC: "",
    NOTE: "",
    STATUS: "",
    CREATE_DATE: "",
    CREATE_BY: "",
    UPDATE_DATE: "",
    UPDATE_BY: "",
    DELETED_LIST: "",
    isCONFIRMED: ""
  }

  public rows: any;

  constructor(private myAppComp: AppComponent, private alertController: AlertController,
    private http: HttpClient, private modalController: ModalController,
    private _router: Router, public datepipe: DatePipe, private storage: Storage) {
    this.resIReceive = new Array;
  }

  ngOnInit() {
    this.myAppComp.getValStorage();
    //this.getReceive();
    //console.log('Mode:' + this.pMode);
    if (this.pReceive == "" || this.pReceive == undefined) {
      this.resHReceive = this.oHReceive;
    }
    else if (this.pReceive != undefined && this.pReceive != "") {
      this.resHReceive = this.pReceive;
      this.deleteList = "";

      this.getAllReason();
      this.getReceiveDetails();

      if (this.resHReceive.STATUS == "COMFIRMED")
        this.resHReceive.isCONFIRMED = "1";
      else
        this.resHReceive.isCONFIRMED = "0";

      this.isConfirmed = this.resHReceive.STATUS == "CONFIRMED" ? true : false;
    }
  }

  ionViewDidEnter() {
    this.foundItemAddnew = false;
  }

  ngAfterViewInit() {
    this.getAllVendor();
    if (this.pMode == undefined) {
      this.pMode = 'C';
      this.resHReceive.DOC_DATE = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    }
  }

  async openModalMasterProduct() {
    const modal = await this.modalController.create({
      component: ReceiveProductCreateModalPage,
      cssClass: 'modalCustomsize'
    });

    modal.onDidDismiss()
      .then((res) => {
        //console.log('return value is : '+ JSON.stringify(res));
        if (res.data.PRODUCT_CODE != "") {
          this.resIReceive.push({
            RECEIVE_IID: "",
            RECEIVE_HID: this.resHReceive.RECEIVE_HID,
            PRODUCT_ID: res.data.PRODUCT_ID,
            PRODUCT_CODE: res.data.PRODUCT_CODE,
            PRODUCT_DESC: res.data.PRODUCT_DESC,
            QTY: 1,
            IMG1: res.data.IMG1,
            IMG2: res.data.IMG2,
            IMG3: res.data.IMG3,
            UNIT_PRICE: res.data.UNIT_PRICE,
            UOM_DESC: res.data.UOM_DESC,
            WH_ID: (this.myAppComp.appProfile.U_TYPE == "ACT" ? "2" : "1"),
            WH_DESC: "ACT Studio"
          });
          //console.log('return value2 is : ' + JSON.stringify(this.resIReceive));
          this.resIReceive = [...this.resIReceive];
          this.foundItemAddnew = true;
        }
        //const user = data['data']; // Here's your selected user!
      });
    return await modal.present();
  }

  async openModalAttachedment(row) {
    const modal = await this.modalController.create({
      component: ReceiveProductAttachmentPage,
      componentProps: { pRECEIVE_IID: row.RECEIVE_IID, pATTM_ID: row.ATTM_ID, pFileName: row.FILE_NAME },
      cssClass: 'modalAttachmentCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return value is : '+ JSON.stringify(res));
      });
    return await modal.present();
  }

  validToSaveData() {
    if (this.resHReceive.VENDOR_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุกองละคร");
      return;
    }
    else if (Number(this.resHReceive.SET_NO) <= 0) {
      this.myAppComp.showAlert("กรุณาระบุชุดที่");
      return;
    }
    else if (this.resHReceive.RECEIVE_DATE == '') {
      this.myAppComp.showAlert("กรุณาระบุวันที่รับสินค้า");
      return;
    }
    else if (this.resIReceive == '') {
      this.myAppComp.showAlert("กรุณาระบุรายการสินค้าอย่างน้อย 1 รายการ");
      return;
    }
    else {
      for (let i = 0; i < this.resIReceive.length; i++) {
        if (this.resIReceive[i].UNIT_PRICE == "" || this.resIReceive[i].UNIT_PRICE == undefined || Number(this.resIReceive[i].UNIT_PRICE <= 0)) {
          this.myAppComp.showAlert("กรุณาตรวจสอบข้อมูลราคา : " + this.resIReceive[i].PRODUCT_DESC);
          return;
        }
        else if (this.resIReceive[i].QTY == "" || this.resIReceive[i].QTY == undefined || Number(this.resIReceive[i].QTY <= 0)) {
          this.myAppComp.showAlert("กรุณาตรวจสอบข้อมูลจำนวน : " + this.resIReceive[i].PRODUCT_DESC);
          return;
        }
        else if (this.resHReceive.STATUS == "PENDING" && this.isConfirmed) {
          if (this.resIReceive[i].QTY_IN == "" ||
            this.resIReceive[i].QTY_IN == undefined ||
            Number(this.resIReceive[i].QTY_IN) < 0 ||
            Number(this.resIReceive[i].QTY_IN) > Number(this.resIReceive[i].QTY)
          ) {
            this.myAppComp.showAlert("กรุณาตรวจสอบจำนวนคืน : " + this.resIReceive[i].PRODUCT_DESC);
            return;
          }
          else if (
            (Number(this.resIReceive[i].QTY) != Number(this.resIReceive[i].QTY_IN)) &&
            (this.resIReceive[i].FINE_PRICE == "" || this.resIReceive[i].FINE_PRICE == undefined || Number(this.resIReceive[i].FINE_PRICE < 0))
          ) {
            this.myAppComp.showAlert("กรุณาตรวจสอบข้อมูลค่าปรับ : " + this.resIReceive[i].PRODUCT_DESC);
            return;
          }
          else if (Number(this.resIReceive[i].QTY) > Number(this.resIReceive[i].QTY_IN) && (this.resIReceive[i].REASON_ID == "" || this.resIReceive[i].REASON_ID == undefined)) {
            this.myAppComp.showAlert("กรุณาระบุหมายเหตุ : " + this.resIReceive[i].PRODUCT_DESC);
            return;
          }
        }
        else if (this.resHReceive.STATUS == "CONFIRMED" && !this.isConfirmed) {
          if (Number(this.resIReceive[i].QTY_IN) > Number(this.resIReceive[i].QTY_STOCK)) {
            this.myAppComp.showAlert("ไม่สามารถปลดยืนยันได้ : " + this.resIReceive[i].PRODUCT_DESC + " จำนวนใน stock เหลือ " + this.resIReceive[i].QTY_STOCK);
            return;
          }
        }

      }

    }

    if (this.resHReceive.RECEIVE_HID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

  /* done */
  async saveData() {
    // alert(JSON.stringify(this.arrVal))
    this.resHReceive.RECEIVE_DATE = this.datepipe.transform(this.resHReceive.RECEIVE_DATE, 'yyyy/MM/dd');
    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(this.resHReceive));
    formData.append('IData', JSON.stringify(this.resIReceive));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/createReceive', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.navigateTo("/receive-list");
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              //return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  /* done */
  async updateData() {
    // alert(JSON.stringify(this.arrVal)
    this.resHReceive.RECEIVE_DATE = this.datepipe.transform(this.resHReceive.RECEIVE_DATE, 'yyyy/MM/dd');
    if (this.deleteList != "")
      this.resHReceive.DELETED_LIST = this.deleteList;

    this.resHReceive.isCONFIRMED = this.isConfirmed ? "1" : "0";

    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(this.resHReceive));
    formData.append('IData', JSON.stringify(this.resIReceive));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateReceive', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
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
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");

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

    for (let [i, item] of this.resIReceive.entries()) {

      if (item.RECEIVE_IID == "") {
        if (item.PRODUCT_CODE === oItem.PRODUCT_CODE) {
          this.resIReceive.splice(i, 1);
          this.resIReceive = [...this.resIReceive];
        }
      } else {
        if (item.RECEIVE_IID === oItem.RECEIVE_IID) {
          this.deleteList = this.deleteList + ',' + oItem.RECEIVE_IID;
          this.resIReceive.splice(i, 1);
          this.resIReceive = [...this.resIReceive];
        }
      }
    }

  }

  /* done */
  async addProductIMG(oItem, oIMGNo, files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      alert("Only images are supported.");
      return;
    }
    var reader = new FileReader();
    this.filesIMG = files;

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      if (oIMGNo == 1) {
        oItem.IMG1 = oItem.PRODUCT_ID + "-1-" + files[0].name;
      } else if (oIMGNo == 2) {
        oItem.IMG2 = oItem.PRODUCT_ID + "-2-" + files[0].name;
      } else if (oIMGNo == 3) {
        oItem.IMG3 = oItem.PRODUCT_ID + "-3-" + files[0].name;
      }
    }

    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(oItem));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));
    if (oItem.IMG1 != undefined && oIMGNo == 1)
      formData.append('IMGFile1', this.filesIMG[0]);
    else if (oItem.IMG2 != undefined && oIMGNo == 2)
      formData.append('IMGFile2', this.filesIMG[0]);
    else if (oItem.IMG3 != undefined && oIMGNo == 3)
      formData.append('IMGFile3', this.filesIMG[0]);


    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/addProductIMG', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.toggleExpandRow(oItem);
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
            }

            this.myAppComp.showToast("บันทึกรูปสินค้าสำเร็จ", "success");
            //this.toggleExpandRow(oItem);
            //this.dismiss();
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });



  }

  /* done */
  async getReceiveDetails() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getReceiveDetails?RECEIVE_HID=' + this.resHReceive.RECEIVE_HID, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log('Receive details : ' + JSON.stringify(data));
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resIReceive = data['data'];
            if (this.resIReceive.length > 0) {
              for (let i = 0; i < this.resIReceive.length; i++) {
                if (this.resIReceive[i].REASON_ID == null)
                  this.resIReceive[i].REASON_ID = "";
              }
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });

      }
    });

  }

  /* done */
  async getAllVendor() {
    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllVendor', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resVendor = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  /* done */
  async getAllReason() {

    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllReason', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resReason = data['data'];
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
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  calculateFinePrice(pRow) {
    pRow.FINE_PRICE = (pRow.UNIT_PRICE * (pRow.QTY - pRow.QTY_IN)).toFixed(2);
  }

}
