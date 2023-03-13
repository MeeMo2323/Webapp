import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-product-subgroup-modal',
  templateUrl: './master-product-subgroup-modal.page.html',
  styleUrls: ['./master-product-subgroup-modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductSubgroupModalPage implements OnInit {

  public oProductSubGroup = {
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_ID: "",
    PRODUCT_SUBGROUP_DESC: ""
  };

  public resProductGroup: any;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  pProductSubGroup: any;

  constructor(private myAppComp: AppComponent, private modalCtrl: ModalController, private http: HttpClient,
    private loadingCtrl: LoadingController, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
    if (this.pProductSubGroup != "") {
      this.oProductSubGroup = this.pProductSubGroup;
    }
  }


  ngAfterViewInit() {
    this.getAllProductGroup();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  validToSaveData() {
    if (this.oProductSubGroup.PRODUCT_GROUP_ID == "") {
      this.myAppComp.showAlert("กรุณาเลือกกลุ่มสินค้าหลัก");
      return;
    }
    else if (this.oProductSubGroup.PRODUCT_SUBGROUP_DESC == "") {
      this.myAppComp.showAlert("กรุณาระบุชื่อกลุ่มสินค้าย่อย");
      return;
    }

    if (this.oProductSubGroup.PRODUCT_SUBGROUP_ID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

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
  async saveData() {
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oProductSubGroup));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/createProductSubGroup', formData, this.myAppComp.getHttpHeader(value))
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
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oProductSubGroup));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateProductSubGroup', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            console.log(data);
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

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }
}
