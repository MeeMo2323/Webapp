import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-product-group-modal',
  templateUrl: './master-product-group-modal.page.html',
  styleUrls: ['./master-product-group-modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductGroupModalPage implements OnInit {

  public oProductGroup = {
    PRODUCT_GROUP_ID: "",
    PRODUCT_GROUP_ABBR: "",
    PRODUCT_GROUP_DESC: ""
  };

  pProductGroup: any;

  constructor(private myAppComp: AppComponent, private modalCtrl: ModalController, private http: HttpClient, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
    if (this.pProductGroup != "") {
      this.oProductGroup = this.pProductGroup;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  validToSaveData() {
    if (this.oProductGroup.PRODUCT_GROUP_ABBR == "" || this.oProductGroup.PRODUCT_GROUP_ABBR.trim().length != 3) {
      this.myAppComp.showAlert("กรุณาระบุชื่อย่อประเภทสินค้า(3หลัก)");
      return;
    }
    else if (this.oProductGroup.PRODUCT_GROUP_DESC == "") {
      this.myAppComp.showAlert("กรุณาระบุชื่อกลุ่มสินค้าหลัก");
      return;
    }

    if (this.oProductGroup.PRODUCT_GROUP_ID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

  /* done */
  async saveData() {
    // alert(JSON.stringify(this.arrVal))
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oProductGroup));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/createProductGroup', formData,this.myAppComp.getHttpHeader(value))
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
    formData.append('Data', JSON.stringify(this.oProductGroup));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateProductGroup', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            console.log(data);
            //alert(data);
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
