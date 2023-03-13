import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-customer-modal',
  templateUrl: './master-customer-modal.page.html',
  styleUrls: ['./master-customer-modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterCustomerModalPage implements OnInit {

  public oCustomer = {
    CUST_ID: "",
    CUST_NAME: "",
    CUST_COMPNAME: "",
    CUST_ADDR1: "",
    CUST_ADDR2: "",
    CUST_TEL: "",
    TAX_NO: ""
  };

  pCustomer: any;

  constructor(private myAppComp: AppComponent, private modalCtrl: ModalController, private http: HttpClient, private storage: Storage) { }

  ngOnInit() {
    console.log(JSON.stringify(this.pCustomer));

    if (this.pCustomer != undefined && this.pCustomer != "") {
      this.oCustomer = this.pCustomer;
    }
  }
  ionViewDidEnter() {
    this.myAppComp.getValStorage();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }


  validToSaveData() {
    if (this.oCustomer.CUST_NAME.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุชื่อ");
      return;
    } else if (this.oCustomer.CUST_COMPNAME.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุชื่อบริษัท");
      return;
    } else if (this.oCustomer.CUST_TEL.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุเบอร์โทรศัพท์");
      return;
    } else if (this.oCustomer.TAX_NO.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุเลขที่ผู้เสียภาษี");
      return;
    } else if (this.oCustomer.CUST_ADDR1.trim() == "" && this.oCustomer.CUST_ADDR2.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุที่อยู่");
      return;
    }

    if (this.oCustomer.CUST_ID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

  /* done */
  async saveData() {
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oCustomer));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));


    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/createCustomer', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
            }
            else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.dismiss();
          });
      }
    });


  }

  /* done */
  async updateData() {
    // alert(JSON.stringify(this.arrVal))
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oCustomer));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateCustomer', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
            }
            else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.dismiss();
          });
      }
    });
  }


}
