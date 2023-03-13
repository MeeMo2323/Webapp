import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';
import { ModalController } from '@ionic/angular';
import { MasterCustomerModalPage } from '../master-customer-modal/master-customer-modal.page';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-customer',
  templateUrl: './master-customer.page.html',
  styleUrls: ['./master-customer.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterCustomerPage implements OnInit {

  public resCustomer: any;
  public resCustomerTemp: any;

  public columns: any;

  public oFilterItems = {
    CUST_NAME: "",
    CUST_COMPNAME: "",
    CUST_TEL: "",
    TAX_NO: ""
  }

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  pIsOpenFromPopup: any;

  constructor(private alertController: AlertController, private http: HttpClient, private myAppComp: AppComponent,
    private modalController: ModalController, private loadingCtrl: LoadingController, private storage: Storage) {
    this.columns = [
      { prop: 'CUST_NAME', name: 'ชื่อ-นามสกุล', width: 100 },
      { prop: 'CUST_TEL', name: 'เบอร์โทรศัพท์', width: 100 },
      { prop: 'CUST_COMPNAME', name: 'ชื่อบริษัท', width: 100 },
      { prop: 'CUST_ADDR', name: 'ที่อยู่', width: 200 }
    ];
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getAllCustomer();
  }

  /* done */
  async getAllCustomer() {
    this.showLoading();

    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllCustomer', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log('return data are : ' +data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            this.resCustomer = data['data'];
            this.resCustomerTemp = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.hideLoading();
          });
      }
    });
  }

  async confirmDeleteCustomer(oCustomer) {
    //console.log('start delete...');
    //this.oProduct = pProduct;
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลลูกค้าที่เลือกจะถูกลบออกจากระบบ',
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
            this.deleteCustomer(oCustomer);
          }
        }
      ]
    });
    await alert.present();
  }

  /* done */
  async deleteCustomer(oCustomer) {

    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(oCustomer));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/deleteCustomer', formData, this.myAppComp.getHttpHeader(value))
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
            this.getAllCustomer();
          });
      }
    });

  }

  async openModalMasterCustomer(oVal) {
    const modal = await this.modalController.create({
      component: MasterCustomerModalPage,
      componentProps: { pCustomer: oVal },
      cssClass: 'modalCustomerCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getAllCustomer();
      });
    return await modal.present();
  }

  selectCustomer(oCustomer) {
    //console.log('select : ' + oProduct);
    this.modalController.dismiss(oCustomer);
  }

  filterItems() {
    if (this.oFilterItems.CUST_NAME == "" && this.oFilterItems.CUST_COMPNAME == "" && this.oFilterItems.CUST_TEL == "")
      return this.resCustomerTemp;
    else {
      let tmpRes = this.resCustomerTemp;
      if (this.oFilterItems.CUST_NAME != "") {
        tmpRes = tmpRes.filter((item) => { return item.CUST_NAME.toString().includes(this.oFilterItems.CUST_NAME); });
      }
      if (this.oFilterItems.CUST_COMPNAME != "") {
        tmpRes = tmpRes.filter((item) => { return item.CUST_COMPNAME.toString().includes(this.oFilterItems.CUST_COMPNAME); });
      }
      if (this.oFilterItems.CUST_TEL != "") {
        tmpRes = tmpRes.filter((item) => { return item.CUST_TEL.toString().includes(this.oFilterItems.CUST_TEL); });
      }
      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resCustomer = this.filterItems();
    //console.log('resproduct =' +this.resProduct);
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }

}
