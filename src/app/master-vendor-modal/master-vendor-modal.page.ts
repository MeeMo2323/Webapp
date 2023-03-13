import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-master-vendor-modal',
  templateUrl: './master-vendor-modal.page.html',
  styleUrls: ['./master-vendor-modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterVendorModalPage implements OnInit {

  public oVendor = {  
    VENDOR_ID : "" ,
    VENDOR_DESC : ""
  };

  /*public oUser = {  
    U_ID:1,
    U_NAME:"admin",
    U_ROLE:"Admin"
  }*/

  pVendor:any;
  

  constructor(private myAppComp : AppComponent,private modalCtrl: ModalController,private http: HttpClient) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
    if(this.pVendor!=""){
      this.oVendor = this.pVendor; 
    } 
  }

  async saveData(){  
  if(this.oVendor.VENDOR_DESC.trim()=="")
  {
    this.myAppComp.showAlert("กรุณาระบุกองละคร");
    return;
  }
    
  let formData: FormData = new FormData(); 
  formData.append('Data', JSON.stringify(this.oVendor)); 
  formData.append('User', JSON.stringify(this.myAppComp.appProfile));   

  const options = {
    headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin' :'*'
    })
  };

  await this.http.post<any>(this.myAppComp.strAPIURL+'/createVendor',formData)
   .subscribe(data=> {
      //console.log(data);
      this.myAppComp.showToast("เพิ่มรายการกลุ่มสินค้าหลักสำเร็จ","success");
      this.dismiss();
    });    
    
  }

  async updateData(){   
   // alert(JSON.stringify(this.arrVal))
  let formData: FormData = new FormData(); 
  formData.append('Data', JSON.stringify(this.oVendor)); 
  formData.append('User', JSON.stringify(this.myAppComp.appProfile));   

  const options = {
    headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin' :'*'
    })
  };

  await this.http.post<any>(this.myAppComp.strAPIURL+'/updateVendor',formData)
   .subscribe(data=> {
      console.log(data);
      //alert(data);
      if(data=="1")
        this.myAppComp.showToast("แก้ไขข้อมูลกลุ่มสินค้าหลักสำเร็จ","success");
      else
        this.myAppComp.showToast("เกิดความผิดพลาดระหว่างบันทึกข้อมูล","danger");
      this.dismiss();
    });    
    
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  validToSaveData()
  {
    //alert(JSON.stringify(this.oVendor));
    if(this.oVendor.VENDOR_ID=="")
    {this.saveData();}
    else
    {this.updateData();}
  }
}
