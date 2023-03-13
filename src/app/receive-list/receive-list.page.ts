import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReceiveProductCreatePage } from '../receive-product-create/receive-product-create.page';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-receive-list',
  templateUrl: './receive-list.page.html',
  styleUrls: ['./receive-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveListPage implements OnInit {

  public resReceive: any;
  public resReceiveTemp: any;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  public oFilterItems = {
    DOC_NO: "",
    VENDOR_DESC: "",
    STATUS: "",
    START_DATE: "",
    END_DATE: ""
  }

  constructor(private myAppComp: AppComponent, private http: HttpClient, private modalController: ModalController,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage) { }

  ngOnInit() {
    // this.myAppComp.getValStorage();
  }

  ngAfterViewInit() { }

  ionViewDidEnter() {
    this.myAppComp.getValStorage();
    this.getReceiveList();
  }

  async openModalReceive(oVal, oMode) {
    const modal = await this.modalController.create({
      component: ReceiveProductCreatePage,
      componentProps: { pReceive: oVal, pMode: oMode },
      cssClass: 'modalCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getReceiveList();
      });
    return await modal.present();
  }

  /* done */
  async getReceiveList() {
    this.showLoading();
    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getReceiveList', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'] == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.hideLoading();
            this.resReceive = data['data'];
            this.resReceiveTemp = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });
  }

  confirmCancel(oRow) {
    this.alertCtrl.create({
      header: 'ยืนยันการยกเลิก',
      subHeader: 'ยินยันการยกเลิก ใบรับเข้าสินค้าเลขที่ ' + oRow.DOC_NO,
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
            //console.log('reason = '+data.CancelReason);
            oRow.CANCEL_REASON = data.CancelReason;
            this.cancelReceive(oRow);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  /* done */
  async cancelReceive(oRow) {
    let formData: FormData = new FormData();
    formData.append('HData', JSON.stringify(oRow));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/cancelReceive', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.getReceiveList();
              this.resReceive = [...this.resReceive];
              this.resReceiveTemp = [...this.resReceive];
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });


  }

  filterItems() {
    console.log('this.oFilterItems.STATUS =' + this.oFilterItems.STATUS);
    if (this.oFilterItems.DOC_NO.trim() == "" && this.oFilterItems.VENDOR_DESC.trim() == "" && this.oFilterItems.STATUS.trim() == "")
      return this.resReceiveTemp;
    else {
      let tmpRes = this.resReceiveTemp;
      if (this.oFilterItems.DOC_NO != "") {
        tmpRes = tmpRes.filter((item) => { return item.DOC_NO.toString().includes(this.oFilterItems.DOC_NO); });
      }
      if (this.oFilterItems.VENDOR_DESC != "") {
        tmpRes = tmpRes.filter((item) => { return item.VENDOR_DESC.toString().includes(this.oFilterItems.VENDOR_DESC); });
      }
      if (this.oFilterItems.STATUS != "") {
        tmpRes = tmpRes.filter((item) => { return item.STATUS == this.oFilterItems.STATUS; });
      }
      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resReceive = this.filterItems();
    //console.log('resproduct =' +this.resProduct);
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }

}
