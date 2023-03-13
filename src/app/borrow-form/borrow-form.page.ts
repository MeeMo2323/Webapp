import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-borrow-form',
  templateUrl: './borrow-form.page.html',
  styleUrls: ['./borrow-form.page.scss'],
})
export class BorrowFormPage implements OnInit {

  public pHBorrow;
  public pIBorrow;

  public valLOC_FROMList:any;
  public valLOC_TOList:any;


  public valAmount:number;
  public valVATAmount:number;
  public valTotalAmount:number;
  constructor() { }
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  ngOnInit() {}
   

  
  ionViewDidEnter()	
  {
    this.valLOC_FROMList="";
    this.valLOC_TOList="";
    this.valAmount = 0;
    for (let i = 0; i < this.pIBorrow.length; i++) {
      this.valAmount = this.valAmount + (this.pIBorrow[i].QTY*this.pIBorrow[i].UNIT_PRICE);
      if(this.valLOC_FROMList.indexOf(this.pIBorrow[i].LOC_CODE)==-1)
        this.valLOC_FROMList = ','+this.pIBorrow[i].LOC_CODE+this.valLOC_FROMList;

      if(this.valLOC_TOList.indexOf(this.pIBorrow[i].LOC_CODE2)==-1)
        this.valLOC_TOList = ','+this.pIBorrow[i].LOC_CODE2+this.valLOC_TOList;
      
    }
    this.valVATAmount = this.valAmount*0.07;
    this.valTotalAmount = this.valAmount+this.valVATAmount;
    if(this.valLOC_FROMList!="")
    {
      this.valLOC_FROMList = this.valLOC_FROMList.substr(1);
    }
    if(this.valLOC_TOList!="")
    {
      if(this.pHBorrow.BORROW_LOC="IN")
        this.valLOC_TOList = "ในสถานที่-"+this.valLOC_TOList.substr(1);
      else
        this.valLOC_TOList = "นอกสถานที่-"+this.pHBorrow.BORROW_LOC_DESC;
    }
  }


  public exportPDF() {
    let dataHTML = document.getElementById("pdfTable");

    //console.log('dataHTML is : '+dataHTML.innerHTML);
    const doc = new jsPDF('p', 'pt', 'a4', true);
    var parser = new DOMParser();
    var data = parser.parseFromString("<html><head></head><body><div class='rptContent' style='width: 95%; margin-left: auto; margin-right: auto;'><span clas='tCaption' style='font-size: 25px;'>รายการของตามบิลที่เคลียร์และที่ส่งคืนกองละคร ทดสอบ</span><div class='tSeparator'></div><table style='border: 1px solid black;'><thead class='tHeader'><tr><th style='width: 150px; border: 1px solid black; text-align: center;'>รายการมูลค่า</th><th style='width: 150px; border: 1px solid black; text-align: center;'>มูลค่า</th><th style='width: 150px; border: 1px solid black; text-align: center;'>มูลค่าโดยประมาณ (%)</th></tr></thead><tbody class='tBody'><tr><td style='border-right: 1px solid black; padding-left: 10px; text-align: left;'>มูลค่าทั้งหมด</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>900.00</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>&nbsp;</td></tr><tr><td style='border-right: 1px solid black; padding-left: 10px; text-align: left;'>มูลค่าที่ได้รับคืน</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>300.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>33.33 %</td></tr><tr><td style='border-right: 1px solid black; padding-left: 10px; text-align: left;'>มูลค่าที่ไม่ได้รับคืน</td><td style='border-right: 1px solid black; padding-right: 10px; text-align: right;'>600.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>66.67 %</td></tr></tbody></table><div class='tSeparator'></div><table style='width: 100%; border: 1px solid black;'><thead class='tHeader'><tr><th rowspan='2' style='width: 5%; border: 1px solid black; text-align: center;'>ลำดับ</th><th rowspan='2' style='width: 35%; border: 1px solid black; text-align: center;'>ชื่อรายการ</th><th colspan='2' style='width: 15%; border: 1px solid black; text-align: center;'>ราคา</th><th colspan='2' style='width: 15%; border: 1px solid black; text-align: center;'>จำนวน</th><th rowspan='2' style='width: 30%; border: 1px solid black; text-align: center;'>หมายเหตุ</th></tr><tr><th style='width: 7%; border: 1px solid black; text-align: center;'>รวม</th><th style='width: 8%; border: 1px solid black; text-align: center;'>หน่วยละ</th><th style='width: 7%; border: 1px solid black; text-align: center;'>ตามบิล</th><th style='width: 8%; border: 1px solid black; text-align: center;'>คืนจริง</th></tr></thead><tbody class='tBody'><tr><td style='border-right: 1px solid black; text-align: center;'>ชุดที่ 2</td><td style='border-right: 1px solid black; padding-left: 10px;'>โต๊ะ IKEA สีเหลือง</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>900.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>300.00</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>3</td><td style='border-right: 1px solid black; text-align: right; padding-right: 10px;'>1</td><td style='padding-left: 10px;'>ชำรุดเสียหาย</td></tr></tbody></table></div></body></html>", 'text/html');

    doc.addFont('/assets/fonts/thaisanslite_r1_0.ttf', 'thaisanslite', 'normal');
    doc.setFont('thaisanslite');
  
    doc.html(dataHTML, {
      callback: function (doc) {
        doc.save('แบบฟอร์ม - ใบรับเข้า.pdf');
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

  }

}
