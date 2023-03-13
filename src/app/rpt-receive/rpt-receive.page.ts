import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-rpt-receive',
  templateUrl: './rpt-receive.page.html',
  styleUrls: ['./rpt-receive.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RptReceivePage implements OnInit {

  public resRptReceive: any;
  public isContainData: boolean;
  public resVendor: any;

  public oVENDOR_ID = "";
  public oVENDOR_DESC = "";

  public sumAllItem = 0.00;
  public sumReturnItem = 0.00;
  public sumMissingItem = 0.00;
  public sumFinePrice = 0.00;

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  constructor(private myAppComp: AppComponent, private http: HttpClient, private loadingCtrl: LoadingController, private storage: Storage) { }

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  ngOnInit() { }

  ngAfterViewInit() { }

  ionViewDidEnter() {
    this.myAppComp.getValStorage();
    this.getAllVendor();
  }

  /* done */
  async getRPT() {
    if (this.oVENDOR_ID == "") {
      this.myAppComp.showAlert("กรุณาระบุกองละคร");
      return;
    }
    this.showLoading()

    await this.storage.get('appProfile').then((value) => {
      const isExpired = true;
      if (value != null) {
        this.http.get(this.myAppComp.strAPIURL + '/getRptReceive?VENDOR_ID=' + this.oVENDOR_ID, this.myAppComp.getHttpHeader(value))
          .subscribe(data => {
            //console.log(data);
            if (data['response'].RESULT == "E") {
              this.myAppComp.logOut();
              return;
            }
            this.resRptReceive = data['data'];
            if (this.resRptReceive.length > 0) {
              this.sumAllItem = 0.00;
              this.sumReturnItem = 0.00;
              this.sumMissingItem = 0.00;
              this.sumFinePrice = 0.00;
              this.oVENDOR_DESC = "";
              this.isContainData = true;
              for (let i = 0; i < this.resRptReceive.length; i++) {
                this.oVENDOR_DESC = this.resRptReceive[i].VENDOR_DESC;
                this.sumAllItem = this.sumAllItem + (Number(this.resRptReceive[i].UNIT_PRICE) * Number(this.resRptReceive[i].QTY));
                this.sumReturnItem = this.sumReturnItem + (Number(this.resRptReceive[i].UNIT_PRICE) * Number(this.resRptReceive[i].QTY_IN));
                this.sumMissingItem = this.sumMissingItem + (Number(this.resRptReceive[i].UNIT_PRICE) * (Number(this.resRptReceive[i].QTY) - Number(this.resRptReceive[i].QTY_IN)));
                this.sumFinePrice = this.sumFinePrice + Number(this.resRptReceive[i].FINE_PRICE);
              }
            }
            else {
              this.isContainData = false;
            }
            this.myAppComp.refreshToken(this.myAppComp.appProfile, data['token']);
            this.hideLoading();
          });

      }
    });

  }

  /* done */
  async getAllVendor() {
    this.showLoading();

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

  sendToPdf() {
    this.showLoading();
    let data = document.getElementById("divExport");
    //console.log(data);

    // html2canvas(document.body).then(canvas => {
    // Few necessary setting options
    var ratio = 2;
    html2canvas(data, { scale: 1 }).then(canvas => {

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var width = pdf.internal.pageSize.getWidth();
      var height = canvas.height * width / canvas.width;

      console.log('img height = ' + height);
      console.log('canvas height =' + canvas.height);

      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
      pdf.save('output.pdf'); // Generated PDF
    });

    /* Below is working fine*/
    /*
      html2canvas(data,{scale: 2}).then(canvas => {
      
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    var width = pdf.internal.pageSize.getWidth();
    var height = canvas.height * width / canvas.width;
    pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
    pdf.save('output.pdf'); // Generated PDF
    });
    */
    /* End below is working fine */

    /*html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg', 2.0)
      console.log(contentDataURL);  
      //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      let pdf = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
      pdf.save('Filename.pdf');   
    });*/
    /*
     
      console.log(data);  
      html2canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)
        console.log(contentDataURL);  
        let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
        // let pdf = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
        pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
        pdf.save('Filename.pdf');   
      }); */
    this.hideLoading();
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
        doc.save('รายงาน - ใบรับเข้ากองละคร' + oVENDOR_DESC + '.pdf');
      },
      autoPaging: true,
      margin: [20, 0, 20, 0],
      x: 0,
      y: 0,
      html2canvas: {
        scale: 0.5, //this was my solution, you have to adjust to your size
        width: 800 //for some reason width does nothing
      },
    });
    //doc.save('savePDF.pdf');
  }


  public exportPDF2(oVENDOR_DESC) {
    let dataHTML = document.getElementById("pdfTable");

    let res = document.getElementById("pdfTable");

    console.log('dataHTML is : ' + dataHTML.innerHTML);
    const doc = new jsPDF('p', 'pt', 'a4', true);

    //doc.autoTable({ html: '#my-table' })

    doc.addFont('/assets/fonts/thaisanslite_r1_0.ttf', 'thaisanslite', 'normal');
    doc.setFont('thaisanslite');
    doc.html(dataHTML, {
      callback: function (doc) {
        doc.save('รายงาน - ใบรับเข้ากองละคร' + oVENDOR_DESC + '.pdf');
      },
      autoPaging: true,
      margin: [1, 1, 1, 1],
      x: 0,
      y: 0,
      html2canvas: {
        scale: 0.5, //this was my solution, you have to adjust to your size
        width: 800 //for some reason width does nothing
      },
    });
    //doc.save('savePDF.pdf');
  }




  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }

}
