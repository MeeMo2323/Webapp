import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ModalController } from '@ionic/angular';
import { MasterVendorModalPage } from '../master-vendor-modal/master-vendor-modal.page';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-master-vendor',
  templateUrl: './master-vendor.page.html',
  styleUrls: ['./master-vendor.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterVendorPage implements OnInit {

  public resVendor: any;

  /*public oUser = {  
    U_ID:1,
    U_NAME:"admin",
    U_ROLE:"Admin"
  }*/

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  constructor(private myAppComp: AppComponent, private http: HttpClient, private alertController: AlertController,
    private modalCtrl: ModalController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getAllVendor();
    // this.getAllProductGroup();
  }

  /* API request */
  async getAllVendor() {
    this.showLoading();
    await this.http.get(this.myAppComp.strAPIURL + '/getAllVendor')
      .subscribe(data => {
        console.log(data);
        this.resVendor = data;
        this.hideLoading();
      });
  }

  async openModalMasterVendor(oVal) {
    console.log('call modal');
    const modal = await this.modalCtrl.create({
      component: MasterVendorModalPage,
      componentProps: { pVendor: oVal },
      cssClass: 'modalVendorCustomsize'
    });
    modal.onDidDismiss()
      .then((res) => {
        //console.log('return back already');
        this.getAllVendor();
      });
    return await modal.present();
  }
  
  async confirmDeleteVendor(pVendor) {
    //console.log('start delete...');
    //this.oProduct = pProduct;
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลกองละครที่เลือกจะถูกลบออกจากระบบ',
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
            this.deleteVendor(pVendor);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteVendor(pVendor){
    let formData: FormData = new FormData(); 
    formData.append('Data', JSON.stringify(pVendor)); 
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));   
    await this.http.post<any>(this.myAppComp.strAPIURL+'/deleteVendor',formData)
    .subscribe(data=> {
      //console.log(data);
      this.myAppComp.showToast("ลบกองละครสำเร็จ","success");
      this.getAllVendor();
    });
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }



}
