import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from "@auth0/angular-jwt"; 
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  //public strAPIURL = "http://localhost:5035";   /* test environment*/
  public strAPIURL = "/ActsStockAPI"            /* production environment*/

  public LoggedIn = true;

  public appPages = [
    { title: 'ใบรับเข้า', url: '/receive-product-create', icon: 'archive' },
    { title: 'ใบยืม/เช่า', url: '/borrow-create', icon: 'arrow-back-circle' },
    { title: 'ใบคืน', url: '/return-create', icon: 'arrow-forward-circle' }
  ];

  public appEditPageLists = [
    { title: 'ใบรับเข้า', url: '/receive-list', icon: 'archive' },
    { title: 'ใบยืม/เช่า', url: '/borrow-list', icon: 'arrow-back-circle' },
    { title: 'ใบคืน', url: '/return-list', icon: 'arrow-forward-circle' }
  ];

  public appApprovePageLists = [
    { title: 'ใบยืม/เช่า', url: '/borrow-list', icon: 'arrow-back-circle' }
  ];

  public appAdminPages = [
    { title: 'กองละคร', url: '/master-vendor', icon: 'videocam' },
    { title: 'สินค้า', url: '/master-product', icon: 'file-tray' },
    { title: 'กลุ่มสินค้าหลัก', url: '/master-product-group', icon: 'paper-plane' },
    { title: 'กลุ่มสินค้าย่อย', url: '/master-product-subgroup', icon: 'archive' },
    { title: 'ลูกค้า', url: '/master-customer', icon: 'people-circle' },
  ];

  public appReportPages = [
    { title: 'ใบรับเข้าสินค้า', url: '/rpt-receive', icon: 'newspaper' },
    { title: 'ค่าปรับสินค้า', url: '/rpt-receive-fines', icon: 'newspaper' },
    { title: 'Stock คงเหลือ', url: '/rpt-stock-remain', icon: 'newspaper' }
  ];

  public appSettings = [
    /*{ title: 'Profile', url: '/dara-list', icon: 'person' },*/
    { title: 'ออกจากระบบ', url: '/login', icon: 'walk' },
  ];

  public appProfile = {
    U_ID: "",
    U_ROLE: "",
    U_NAME: "",
    U_TYPE: "ACT",
    token:""
  };

  constructor(private toastController: ToastController,private storage: Storage,private _router: Router,
              private alertController: AlertController) {
                //console.log('testLog');
              }

  /* toast on top when need to show some result after action completed.*/
  showToast( strMsg , strColor) {
    this.toastController.create({
      message: strMsg,
      duration: 3000,
      position: 'top',
      color:strColor ,
      buttons: [
         {
          side: 'end',
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Close clicked');
          }
        }
      ]
    }).then((obj) => {
      obj.present();
    });
  }

  async showAlert(oText) {
    const alert = await this.alertController.create({
      message: oText,
      buttons: ['OK']
    });
    await alert.present();
  }

  async confirmLogout(){
    const alert = await this.alertController.create({
      message: 'ยืนยันการออกจากระบบ',
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
            this.logOut()
          }
        }
      ]
    }); 
    await alert.present();
  }


  logOut()
  {
    this.LoggedIn = false;
    this.storage.remove('appProfile');
    this.navigateTo('/login');
  }

  getValStorage()
  {
    
    this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if(value!=null)
      {
        this.appProfile = value;
        console.log('token : '+ this.appProfile.token);
        const helper = new JwtHelperService();
        const isExpired = helper.isTokenExpired(this.appProfile.token);
        console.log('isExpire : '+isExpired);
        console.log('Expire is : '+helper.getTokenExpirationDate(this.appProfile.token));
        //console.log('decode token : '+ JSON.stringify(helper.decodeToken(this.appProfile.token)));
        if(isExpired)
        {
          this.storage.remove('appProfile');
          this.LoggedIn = false;
          this.navigateTo('/login');
        }
      }else if(this.appProfile.token == "" || isExpired)
      {
        this.LoggedIn = false;
        this.navigateTo('/login');
      }
    });
  }

  refreshToken(oAppProfile,oStrToken)
  {
    this.storage.get('appProfile').then((value) => {
      if(value!=null)
      {
        oAppProfile.token = oStrToken;
        this.storage.set('appProfile', oAppProfile);
      }           
    });
    
  }


  getHttpHeader(oValue)
  {
    let strToken ="";
    this.storage.get('appProfile').then((value) => {
      if(value!=null)
      {
        strToken = value.token;
      } 
          
    });
    
    return {headers: new HttpHeaders(
      { 'Authorization': "Bearer " + oValue.token ,
        'U_ID': oValue.U_ID,
        'U_ROLE':oValue.U_ROLE,
        'U_NAME':oValue.U_NAME
      }
      )};
  }

  navigateTo(oPage) { 
    this._router.navigateByUrl(oPage)
  }

  




}
