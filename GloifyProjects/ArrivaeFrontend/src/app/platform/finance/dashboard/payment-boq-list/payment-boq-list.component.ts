import { AfterViewChecked, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { QuotationService } from 'app/platform/quotation/quotation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-payment-boq-list',
  templateUrl: './payment-boq-list.component.html',
  styleUrls: ['./payment-boq-list.component.css'],
  providers:[QuotationService,FinanceService]
})
export class PaymentBoqListComponent implements OnInit,AfterViewChecked {
  @Input() boq_list:any;
  @Input() project_id:any;
  successalert = false;
  successMessage : string;

  constructor(    private financeService: FinanceService,
    private quotationService : QuotationService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef

    ) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
  }
  ngAfterViewChecked(){
    
  }
  downloadBOQ(boqID){
    let boqTypeArr = ['boq','annexure','summary'];

    this.quotationService.downloadPdf(boqTypeArr,boqID,this.project_id).subscribe(
      res=>{
      this.toastr.success('BOQ has been downloaded successfully!', 'Success!');

    if(JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] !=null ){
      var contentType = 'application/pdf';
      var b64Data =  JSON.parse(res._body)['quotation_base_64'];
      var name= JSON.parse(res._body)['boq_name'];
      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", blobUrl);
      dwldLink.setAttribute("download", name);
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      var contentType = 'application/pdf';
      var b64Data =  JSON.parse(res._body)['service_base_64'];
      var name= JSON.parse(res._body)['service_name'];
      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink1 = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser1) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink1.setAttribute("href", blobUrl);
      dwldLink1.setAttribute("download", name);
      dwldLink1.style.visibility = "hidden";
      document.body.appendChild(dwldLink1);
      dwldLink1.click();
      document.body.removeChild(dwldLink1);

      

    }
    else if(JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] ==null){
      var contentType = 'application/pdf';
      var b64Data =  JSON.parse(res._body)['quotation_base_64'];
      var name= JSON.parse(res._body)['boq_name'];
      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", blobUrl);
      dwldLink.setAttribute("download", name);
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);

    }
    else if(JSON.parse(res._body)['boq_name'] == null && JSON.parse(res._body)['service_name'] !=null){
      var contentType = 'application/pdf';
      var b64Data =  JSON.parse(res._body)['service_base_64'];
      var name= JSON.parse(res._body)['service_name'];
      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink1 = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser1) {  //if Safari open in new window to save file with random filename.
        dwldLink1.setAttribute("target", "_blank");
      }
      dwldLink1.setAttribute("href", blobUrl);
      dwldLink1.setAttribute("download", name);
      dwldLink1.style.visibility = "hidden";
      document.body.appendChild(dwldLink1);
      dwldLink1.click();
      document.body.removeChild(dwldLink1);

    }
    },err=>{
      this.toastr.error(<any>JSON.parse(err['_body']).message,'oops!') ;
    })


  }
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
      
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  

}
