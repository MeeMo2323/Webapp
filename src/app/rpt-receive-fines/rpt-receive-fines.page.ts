import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-rpt-receive-fines',
  templateUrl: './rpt-receive-fines.page.html',
  styleUrls: ['./rpt-receive-fines.page.scss'],
})
export class RptReceiveFinesPage implements OnInit {

  public resRptReceiveFines: any;
  public isContainData: boolean;
  public resVendor: any;

  public oVENDOR_ID = "";
  public oVENDOR_DESC = "";

  public sumFinePrice = 0.00;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  constructor(private myAppComp: AppComponent, private http: HttpClient, private loadingCtrl: LoadingController, private storage: Storage) { }

  ngOnInit() {
    this.myAppComp.getValStorage();
  }

  ngAfterViewInit() {
    this.getAllVendor();
  }

  async getAllVendor() {
    this.showLoading()
    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getAllVendor', this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resVendor = data['data'];

            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.hideLoading();
          });
      }
    });

  }

  async getRPT() {
    if (this.oVENDOR_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุกองละคร");
      return;
    }
    this.showLoading();
    await this.storage.get('appProfile').then((value) => {
      this.http.get(this.myAppComp.strAPIURL + '/getRptReceiveFines?VENDOR_ID=' + this.oVENDOR_ID, this.myAppComp.getHttpHeader(value))
        .subscribe(data => {
          //console.log(data);
          if (data['response'].RESULT == "E") {
            this.myAppComp.logOut();
            return;
          }
          this.resRptReceiveFines = data['data'];
          if (this.resRptReceiveFines.length > 0) {

            this.oVENDOR_DESC = "";
            this.isContainData = true;
            this.oVENDOR_DESC = this.resRptReceiveFines[0].VENDOR_DESC;
            for (let i = 0; i < this.resRptReceiveFines.length; i++) {
              this.sumFinePrice = this.sumFinePrice + Number(this.resRptReceiveFines[i].FINE_PRICE);
            }
          }
          else {
            this.isContainData = false;
          }
          this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
          this.hideLoading();
        });
    });







  }

  public exportPDF(oVENDOR_DESC) {
    let dataHTML = document.getElementById("pdfTable");

    //console.log('dataHTML is : '+dataHTML.innerHTML);
    const doc = new jsPDF('p', 'pt', 'a4', true);
    var parser = new DOMParser();
    var data = parser.parseFromString("<html><head></head><body><div class='rptContent' style='width: 95%; margin-left: auto; margin-right: auto;'><span clas='tCaption' style='font-size: 25px;'>รายการของตามบิลที่เคลียร์และที่ส่งคืนกองละคร ทดสอบ</span><div class='tSeparator'></div><table style='border: 1px solid black;'><thead class='tHeader'><tr><th style='width: 150px; border: 1px solid black; text-align: center;'>รายการมูลค่า</th><th style='width: 150px; border: 1px solid black; text-align: center;'>มูลค่า</th><th style='width: 150px; border: 1px solid black; text-align: center;'>มูลค่าโดยประมาณ (%)</th></tr></thead><tbody class='tBody'><tr><td style='border-right: 1px solid black; padding-left: 10px; text-align: left;'>มูลค่าทั้งหมด</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>900.00</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>&nbsp;</td></tr><tr><td style='border-right: 1px solid black; padding-left: 10px; text-align: left;'>มูลค่าที่ได้รับคืน</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>300.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>33.33 %</td></tr><tr><td style='border-right: 1px solid black; padding-left: 10px; text-align: left;'>มูลค่าที่ไม่ได้รับคืน</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>600.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>66.67 %</td></tr></tbody></table><div class='tSeparator'></div><table style='width: 100%; border: 1px solid black;'><thead class='tHeader'><tr><th rowspan='2' style='width: 5%; border: 1px solid black; text-align: center;'>ลำดับ</th><th rowspan='2' style='width: 35%; border: 1px solid black; text-align: center;'>ชื่อรายการ</th><th colspan='2' style='width: 15%; border: 1px solid black; text-align: center;'>ราคา</th><th colspan='2' style='width: 15%; border: 1px solid black; text-align: center;'>จำนวน</th><th rowspan='2' style='width: 30%; border: 1px solid black; text-align: center;'>หมายเหตุ</th></tr><tr><th style='width: 7%; border: 1px solid black; text-align: center;'>รวม</th><th style='width: 8%; border: 1px solid black; text-align: center;'>หน่วยละ</th><th style='width: 7%; border: 1px solid black; text-align: center;'>ตามบิล</th><th style='width: 8%; border: 1px solid black; text-align: center;'>คืนจริง</th></tr></thead><tbody class='tBody'><tr><td style='border-right: 1px solid black; text-align: center;'>ชุดที่ 2</td><td style='border-right: 1px solid black; padding-left: 10px;'>โต๊ะ IKEA สีเหลือง</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>900.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>300.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>3</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>1</td><td style='padding-left: 10px;'>ชำรุดเสียหาย</td></tr></tbody></table></div></body></html>", 'text/html');

    doc.addFont('/assets/fonts/thaisanslite_r1_0.ttf', 'thaisanslite', 'normal');
    doc.setFont('thaisanslite');
    /*doc.html(dataHTML,{
      callback: function (doc) {
          doc.save('file.pdf');
      },
      margin: [60, 60, 60, 60],
      x: 0,
      y: 0,
      html2canvas: {
          scale: 0.3, //this was my solution, you have to adjust to your size
          width: 1000 //for some reason width does nothing
      },
  }).then(() => doc.save('test.pdf'));
    */
    doc.html(dataHTML, {
      callback: function (doc) {
        doc.save('รายงาน - ค่าปรับสินค้ากองละคร' + oVENDOR_DESC + '.pdf');
      },
      autoPaging: 'text',
      // Adjust your margins here (top, right, bottom left,)
      margin: [20, 0, 20, 0],
      x: 0,
      y: 0,
      html2canvas: {
        scale: 0.5, //this was my solution, you have to adjust to your size
        width: 800, //for some reason width does nothing
        windowHeight: 400
      },
    });
    //doc.save('savePDF.pdf');
  }


  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }

}
