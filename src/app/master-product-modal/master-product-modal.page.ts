import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-master-product-modal',
  templateUrl: './master-product-modal.page.html',
  styleUrls: ['./master-product-modal.page.scss'],
})

export class MasterProductModalPage implements OnInit {
  public resProductGroup: any;
  public resProductSubGroup: any;
  public resGeneration: any;
  public resScene: any;
  public resUOM: any;
  public resTempProductCode: any;

  public strPRODUCT_CODE1 = "XXX";
  public strPRODUCT_CODE2 = "X";
  public strPRODUCT_CODE3 = "XXXXXX";

  imgURL1: any;
  imgURL2: any;
  imgURL3: any;

  files1: FileList;
  files2: FileList;
  files3: FileList;

  pProduct: any;
  pMode: any;

  public oProduct = {
    PRODUCT_ID: "",
    PRODUCT_TYPE_ID: "",
    PRODUCT_CAT_ID: (this.myAppComp.appProfile.U_TYPE == "ACT" ? "2" : "1"),
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_ID: "",
    PRODUCT_CODE: "",
    PRODUCT_DESC: "",
    PRODUCT_ID_DESC: "",
    UOM_ID: "",
    IMG1: "",
    IMG2: "",
    IMG3: "",
    GEN_ID: "",
    SCENE_ID: ""
  };

  constructor(private myAppComp: AppComponent, private modalCtrl: ModalController, private http: HttpClient, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
    //console.log('get data : ' + (this.pProduct == ""));
    //console.log('get data stringify : ' + JSON.stringify(this.pProduct));

    if (this.pProduct != "") {
      this.oProduct = this.pProduct;
      this.imgURL1 = "assets/img-asset/" + this.pProduct.IMG1;
      this.imgURL2 = "assets/img-asset/" + this.pProduct.IMG2;
      this.imgURL3 = "assets/img-asset/" + this.pProduct.IMG3;

      if (this.oProduct.GEN_ID == null)
        this.oProduct.GEN_ID = "";
      if (this.oProduct.SCENE_ID == null)
        this.oProduct.SCENE_ID = "";
      // src="assets/img-dara/{{dara.IMAGE}}"
      this.getAllProductSubGroup();
    }
  }

  ngAfterViewInit() {
    this.getAllProductGroup();
    this.getAllGeneration();
    this.getAllScene();
    this.getAllUOM();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  genProductCode() {
    const strSelectedProductGroup = this.resProductGroup.find((obj) => {
      return obj.PRODUCT_GROUP_ID === Number(this.oProduct.PRODUCT_GROUP_ID);
    });
    this.strPRODUCT_CODE1 = strSelectedProductGroup.PRODUCT_GROUP_ABBR;

    if (this.oProduct.PRODUCT_TYPE_ID != "")
      this.strPRODUCT_CODE2 = this.oProduct.PRODUCT_TYPE_ID;

    if (this.strPRODUCT_CODE1 != "XXX" && this.strPRODUCT_CODE2 != "X")
      this.getTempProductCodeSeq();

    this.updateProductCode();
  }

  updateProductCode() {
    this.oProduct.PRODUCT_CODE = this.strPRODUCT_CODE1 + '-' + this.strPRODUCT_CODE2 + '-' + this.strPRODUCT_CODE3;
  }

  preview(files, oIMGNo) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      alert("Only images are supported.");
      return;
    }
    var reader = new FileReader();
    if (oIMGNo == 1)
      this.files1 = files;
    else if (oIMGNo == 2)
      this.files2 = files;
    else if (oIMGNo == 3)
      this.files3 = files;

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      if (oIMGNo == 1) {
        this.imgURL1 = reader.result;
        const file = files[0];
        this.oProduct.IMG1 = files[0].name;
      } else if (oIMGNo == 2) {
        this.imgURL2 = reader.result;
        const file = files[0];
        this.oProduct.IMG2 = files[0].name;
      } else if (oIMGNo == 3) {
        this.imgURL3 = reader.result;
        const file = files[0];
        this.oProduct.IMG3 = files[0].name;
      }

    }
  }

  /* API request */
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
  async getAllProductSubGroup() {
    if (this.oProduct.PRODUCT_GROUP_ID != '') {
      await this.storage.get('appProfile').then((value) => {
        if (value != null) {
          this.http.get(this.myAppComp.strAPIURL + '/getAllProductSubGroup?strPRODUCT_GROUP_ID=' + this.oProduct.PRODUCT_GROUP_ID, this.myAppComp.getHttpHeader(value))
            .subscribe(data => {
              //console.log(data);
              if (data['response'].RESULT == "E") {
                this.myAppComp.logOut();
                return;
              }
              this.resProductSubGroup = data['data'];
              this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            });
        }
      });

    }
  }

  /* done */
  async getAllGeneration() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllGeneration', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resGeneration = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  /* done */
  async getAllScene() {
    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllScene', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resScene = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  /* done */
  async getAllUOM() {

    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllUOM', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            //console.log(data);
            this.resUOM = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });

  }

  validToSaveData() {
    if (this.oProduct.PRODUCT_TYPE_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุประเภทสินค้า<br>(สินทรัพย์/สิ้นเปลือง)");
      return;
    }
    else if (this.oProduct.PRODUCT_GROUP_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุกลุ่มสินค้าหลัก");
      return;
    }
    else if (this.oProduct.PRODUCT_SUBGROUP_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุกลุ่มสินค้าย่อย");
      return;
    }
    else if (this.oProduct.PRODUCT_DESC.trim() == "") {
      this.myAppComp.showAlert("กรุณาระบุชื่อสินค้า");
      return;
    }
    else if (this.oProduct.UOM_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุหน่วยนับ");
      return;
    }

    if (this.oProduct.PRODUCT_ID == "") {
      this.saveData();
    }
    else {
      this.updateData();
    }
  }

  async saveData() {
    // alert(JSON.stringify(this.arrVal))
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oProduct));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));
    if (this.files1 != undefined)
      formData.append('IMGFile1', this.files1[0]);
    if (this.files2 != undefined)
      formData.append('IMGFile2', this.files2[0]);
    if (this.files3 != undefined)
      formData.append('IMGFile3', this.files3[0]);


    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/createProduct', formData, this.myAppComp.getHttpHeader(value))
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
            this.modalCtrl.dismiss(this.oProduct);

            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          });
      }
    });


  }

  async updateData() {
    // alert(JSON.stringify(this.arrVal))
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.oProduct));
    formData.append('User', JSON.stringify(this.myAppComp.appProfile));
    if (this.files1 != undefined)
      formData.append('IMGFile1', this.files1[0]);
    if (this.files2 != undefined)
      formData.append('IMGFile2', this.files2[0]);
    if (this.files3 != undefined)
      formData.append('IMGFile3', this.files3[0]);

    await this.storage.get('appProfile').then((value) => {
      if (value != null) {
        this.http.post<any>(this.myAppComp.strAPIURL + '/updateProduct', formData, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            //this.myAppComp.showToast("แก้ไขข้อมูลสินค้าเรียบร้อย", "success");
            if (data['response'].RESULT == "1") {
              this.myAppComp.showToast(data['response'].MESSAGE, "success");
            } else {
              this.myAppComp.showToast(data['response'].MESSAGE, "danger");
              return;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.dismiss();
          });
      }
    });

  }

  async getTempProductCodeSeq() {
    await this.http.get(this.myAppComp.strAPIURL + '/getTempProductCodeSeq?strSearch=' + this.strPRODUCT_CODE1 + '-' + this.strPRODUCT_CODE2 + '-')
      .subscribe(data => {
        console.log(data);
        this.resTempProductCode = data;
        this.strPRODUCT_CODE3 = this.resTempProductCode[0].tempProductCode;
        this.updateProductCode();
        // this.getAllProductSubGroup();
      });
  }


}
