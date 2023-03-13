import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-borrow-create-modal',
  templateUrl: './borrow-create-modal.page.html',
  styleUrls: ['./borrow-create-modal.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BorrowCreateModalPage implements OnInit {
  @ViewChild('myTable') table: any;
  public resProduct: any;
  public resProductTemp: any;

  public resProductGroup: any;
  public resProductSubGroup: any;

  public columns: any;

  public oFilterItems = {
    PRODUCT_GROUP_ID: "",
    PRODUCT_SUBGROUP_ID: "",
    PRODUCT_CODE: "",
    PRODUCT_DESC: "",
  }

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

  constructor(private myAppComp: AppComponent, private http: HttpClient, 
              private modalCtrl: ModalController, private storage: Storage) 
  {  }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getRemainStock();
    this.getAllProductGroup();
  }

  /*done*/
  async getAllProductGroup() {
    await  this.storage.get('appProfile').then((value) => {
      if(value!=null)
      {              
        this.http.get(this.myAppComp.strAPIURL + '/getAllProductGroup',this.myAppComp.getHttpHeader(value))
      .subscribe(data => {
        if(data['response']=="E")
        {            
          this.myAppComp.logOut();
          return;
        }   
        this.resProductGroup = data['data'];
        this.myAppComp.refreshToken(this.myAppComp.appProfile,data['token']);
      });
      }     
    }); 
  }

  /*done*/
  async getAllProductSubGroup() {
    await  this.storage.get('appProfile').then((value) => {
      if(value!=null)
      {              
        this.http.get(this.myAppComp.strAPIURL + '/getAllProductSubGroup?strPRODUCT_GROUP_ID=' + this.oFilterItems.PRODUCT_GROUP_ID,this.myAppComp.getHttpHeader(value))
        .subscribe(data => {
          if(data['response'].RESULT=="E")
              {            
                this.myAppComp.logOut();
                return;
              }    
          this.resProductSubGroup = data['data'];
          this.myAppComp.refreshToken(this.myAppComp.appProfile,data['token']);
        });
      }     
    }); 
  }

  /*done*/
  async getRemainStock() {
    await  this.storage.get('appProfile').then((value) => {
      if(value!=null)
      {              
          this.http.get(this.myAppComp.strAPIURL + '/getRemainStock',this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if(data['response'].RESULT=="E")
            {            
              this.myAppComp.logOut();
              return;
            }           
            this.resProduct = data['data'];
            this.resProductTemp = data['data'];
            this.myAppComp.refreshToken(this.myAppComp.appProfile,data['token']);
            this.setFilteredItems();
          });
      }     
    }); 

  }

  selectProduct(oProduct) {
    //console.log('select : ' + oProduct);
    this.modalCtrl.dismiss(oProduct);
  }

  dismiss() {
    this.modalCtrl.dismiss(this.oProduct);
  }

  filterItems() {
    if (this.oFilterItems.PRODUCT_GROUP_ID == "" && this.oFilterItems.PRODUCT_SUBGROUP_ID == "" &&
      this.oFilterItems.PRODUCT_CODE == "" && this.oFilterItems.PRODUCT_DESC == "")
      return this.resProductTemp;
    else {
      let tmpRes = this.resProductTemp;
      if (this.oFilterItems.PRODUCT_GROUP_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_GROUP_ID == this.oFilterItems.PRODUCT_GROUP_ID; });
      }
      if (this.oFilterItems.PRODUCT_SUBGROUP_ID != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_SUBGROUP_ID == this.oFilterItems.PRODUCT_SUBGROUP_ID; });
      }
      if (this.oFilterItems.PRODUCT_CODE != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_CODE.toString().includes(this.oFilterItems.PRODUCT_CODE); });
      }
      if (this.oFilterItems.PRODUCT_DESC != "") {
        tmpRes = tmpRes.filter((item) => { return item.PRODUCT_DESC.toString().includes(this.oFilterItems.PRODUCT_DESC); });
      }

      return tmpRes;
    }
  }

  setFilteredItems() {
    this.resProduct = this.filterItems();
  }

}
