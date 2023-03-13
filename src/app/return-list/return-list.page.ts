import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ReturnCreatePage } from '../return-create/return-create.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-return-list',
  templateUrl: './return-list.page.html',
  styleUrls: ['./return-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReturnListPage implements OnInit {

  public oFilterItems = {
    DOC_NO: "",
    BORROW_VENDOR: "",
    CUST_NAME: "",
    STATUS: ""
  }

  public resReturn: any;
  public resReturnTemp: any;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  constructor(private myAppComp: AppComponent, private http: HttpClient, private modalController: ModalController,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  ionViewDidEnter() {
    this.myAppComp.getValStorage();
    this.getReturnList();
  }

  /* done */
  async getReturnList() {
    this.showLoading();
    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getReturnList', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resReturn = data['data'];
            this.resReturnTemp = data['data'];

            //this.myAppComp.getValStorage();
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.hideLoading();
          });
      }
    });

  }

  async openModalReturn(oVal, oMode) {
    const modal = await this.modalController.create({
      component: ReturnCreatePage,
      componentProps: { pReturn: oVal, pMode: oMode },
      cssClass: 'modalCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getReturnList();
      });
    return await modal.present();
  }

  confirmCancel(oRow) {
    this.alertCtrl.create({
      header: 'ยืนยันการยกเลิก',
      subHeader: 'ยินยันการยกเลิก ใบคืนเลขที่ ' + oRow.DOC_NO,
      /*message: 'Enter your favorate place',*/
      inputs: [
        {
          name: 'CancelReason',
          placeholder: 'ระบุเหตุผลการยกเลิก',
        },
      ],
      buttons: [
        {
          text: 'ย้อนกลับ',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'ยืนยัน',
          handler: (data: any) => {
            //console.log('Saved Information', data);
            oRow.CANCEL_REASON = data.CancelReason;
            this.cancelReturn(oRow);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  /* done */
  async cancelReturn(oRow) {

    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(oRow));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/cancelReturn', formData,this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.getReturnList();
              this.resReturn = [...this.resReturn];
              this.resReturnTemp = [...this.resReturnTemp];
            }else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  filterItems() {
    if (this.oFilterItems.DOC_NO.trim() == "" && this.oFilterItems.BORROW_VENDOR.trim() == "" && this.oFilterItems.STATUS.trim() == "" && this.oFilterItems.CUST_NAME.trim() == "")
      return this.resReturnTemp;
    else {
      let tmpRes = this.resReturnTemp;
      if (this.oFilterItems.DOC_NO != "") {
        tmpRes = tmpRes.filter((item) => { return item.DOC_NO.toString().includes(this.oFilterItems.DOC_NO); });
      }
      if (this.oFilterItems.BORROW_VENDOR != "") {
        tmpRes = tmpRes.filter((item) => { return item.BORROW_VENDOR.toString().includes(this.oFilterItems.BORROW_VENDOR); });
      }
      if (this.oFilterItems.CUST_NAME != "") {
        tmpRes = tmpRes.filter((item) => { return item.CUST_NAME.toString().includes(this.oFilterItems.CUST_NAME); });
      }
      if (this.oFilterItems.STATUS != "") {
        tmpRes = tmpRes.filter((item) => { return item.STATUS == this.oFilterItems.STATUS; });
      }
      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resReturn = this.filterItems();
    //console.log('resproduct =' +this.resProduct);
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }


}
