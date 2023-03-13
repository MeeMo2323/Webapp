import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-receive-product-attachment',
  templateUrl: './receive-product-attachment.page.html',
  styleUrls: ['./receive-product-attachment.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveProductAttachmentPage implements OnInit {
  files1: FileList;
  resAttachement: any;
  isContainAttached: boolean;

  public oReceiveItem = {
    ATTM_ID: "",
    RECEIVE_IID: "",
    FILE_NAME: ""
  };

  public pRECEIVE_IID = "";
  public pATTM_ID = "";
  public pFileName = "";

  constructor(private myAppComp: AppComponent, private modalCtrl: ModalController, private http: HttpClient, private alertController: AlertController, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
    if (this.pRECEIVE_IID != "") {
      this.oReceiveItem.ATTM_ID = this.pATTM_ID;
      this.oReceiveItem.RECEIVE_IID = this.pRECEIVE_IID;
      this.oReceiveItem.FILE_NAME = this.pFileName;
    }
  }

  ngAfterViewInit() {
    this.getAttachment();
  }


  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  /* done */
  async uploadData() {
    if (this.files1 != undefined) {
      let formData: FormData = new FormData();
      formData.append('Data', JSON.stringify(this.oReceiveItem));
      formData.append('User', JSON.stringify(this.myAppComp.appProfile));
      if (this.files1 != undefined)
        formData.append('File1', this.files1[0]);

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        })
      };

      await this.storage.get('appProfile').then((value) => {
        if (value != null) {
          this.http.post<any>(this.myAppComp.strAPIURL + '/addReceiveAttached', formData, this.myAppComp.getHttpHeader(value))
            .subscribe(data => {
              //console.log(data);
              if (data['response'].RESULT == "E") {
                this.myAppComp.logOut();
                return;
              }

              if (data['response'].RESULT == "1") {
                this.myAppComp.showToast(data['response'].MESSAGE, "success");
                this.dismiss();
              } else {
                this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              }
              this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            });
        }
      });

    } else {
      this.myAppComp.showAlert("กรุณาตรวจสอบไฟล์แนบ");
    }
  }

  /* done */
  async getAttachment() {

    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAttachement?RECEIVE_IID=' + this.oReceiveItem.RECEIVE_IID, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log('Receive details : ' + JSON.stringify(data));
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resAttachement = data['data'];
            if (this.resAttachement.length > 0) {
              this.pFileName = this.resAttachement[0].FILE_NAME;
              this.isContainAttached = true;
            }
            else {
              this.pFileName = "";
              this.isContainAttached = false;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  async confirmDeleteAttach() {
    console.log('start delete...');
    const alert = await this.alertController.create({
      header: 'ยืนยันการลบ',
      message: 'ข้อมูลไฟล์แนบจะถูกลบออกจากระบบ',
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
            this.deleteAttachment();
          }
        }
      ]
    });
    await alert.present();
  }

  /* done */
  async deleteAttachment() {
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oReceiveItem));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/deleteAttachement', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }

            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
              this.isContainAttached = false;
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;

    var reader = new FileReader();

    this.files1 = files;


    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.oReceiveItem.FILE_NAME = files[0].name;

    }

    console.log('filename ' + this.oReceiveItem.FILE_NAME);
  }

  download(oFile) {
    let link = document.createElement("a");
    link.download = oFile;
    link.href = "./assets/attachedment/" + oFile;
    link.click();
  }




}
