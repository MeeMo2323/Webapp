import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ModalController } from '@ionic/angular';
import { MasterProductGroupModalPage } from '../master-product-group-modal/master-product-group-modal.page';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-product-group',
  templateUrl: './master-product-group.page.html',
  styleUrls: ['./master-product-group.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductGroupPage implements OnInit {
  public columns: any;

  public resProductGroup: any;
  public resProductGroupTemp: any;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  public oFilterItems = {
    PRODUCT_GROUP_ABBR: "",
    PRODUCT_GROUP_DESC: ""
  }

  constructor(private myAppComp: AppComponent, private http: HttpClient, private alertController: AlertController,
    private modalCtrl: ModalController, private loadingCtrl: LoadingController, private storage: Storage) {

  }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getAllProductGroup();
  }

  /* API request */
  /* done */
  async getAllProductGroup() {
    this.showLoading();
    let headers = new Headers();

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
            this.hideLoading();
          });
      }
    });
  }

  async openModalMasterProductGroup(oVal) {
    const modal = await this.modalCtrl.create({
      component: MasterProductGroupModalPage,
      componentProps: { pProductGroup: oVal },
      cssClass: 'modalProductGroupCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getAllProductGroup();
      });
    return await modal.present();
  }

  filterItems() {
    console.log('this.oFilterItems.PRODUCT_GROUP_ABBR =' + this.oFilterItems.PRODUCT_GROUP_DESC);
    if (this.oFilterItems.PRODUCT_GROUP_ABBR == "" && this.oFilterItems.PRODUCT_GROUP_DESC == "")
      return this.resProductGroupTemp;
    else {
      let tmpRes = this.resProductGroupTemp;
      if (this.oFilterItems.PRODUCT_GROUP_ABBR != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_GROUP_ABBR.toString().includes(this.oFilterItems.PRODUCT_GROUP_ABBR); });
      }
      if (this.oFilterItems.PRODUCT_GROUP_DESC != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_GROUP_DESC.toString().includes(this.oFilterItems.PRODUCT_GROUP_DESC); });
      }

      return tmpRes;
    }
  }

  async confirmDeleteProduct(pProductGroup) {
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
            this.deleteProductGroup(pProductGroup);
          }
        }
      ]
    });
    await alert.present();
  }

  /* done */
  async deleteProductGroup(pProductGroup) {
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(pProductGroup));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/deleteProductGroup', formData,this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.getAllProductGroup();
            }
            else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  setFilteredItems() {
    this.resProductGroup = this.filterItems();
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }



}
