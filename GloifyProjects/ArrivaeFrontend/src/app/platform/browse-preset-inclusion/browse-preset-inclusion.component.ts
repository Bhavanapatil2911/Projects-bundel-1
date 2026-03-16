import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoaderService } from 'app/services/loader.service';
import { PortfolioService } from '../organisation/portfolio/portfolio.service';
import { QuotationService } from '../quotation/quotation.service';

@Component({
  selector: 'app-browse-preset-inclusion',
  templateUrl: './browse-preset-inclusion.component.html',
  styleUrls: ['./browse-preset-inclusion.component.css'],
  providers: [PortfolioService, QuotationService, LoaderService]
})
export class BrowsePresetInclusionComponent implements OnInit {

  constructor(private route: ActivatedRoute, public portfolioService:PortfolioService, public router: Router,public loaderService : LoaderService, private quotationService : QuotationService) { }

  id: any;
  selected_item_data: any = [];
  fetchData: any;
  loader: boolean = false;
  pid: any;
  quoteCustomerCheckId: any;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.getData();
  }
      

  getData() {
      this.selected_item_data = [];
    this.portfolioService.getPortfolios(this.id).subscribe(data => {
        this.fetchData = data;
        this.pid = this.fetchData.portfolio.quotation_details.project_id;
        this.quoteCustomerCheckId = this.fetchData.portfolio.quotation_details.quotation_id;
      });  
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
  // quoteCustomerCheckId: any = '31211';
  // pid: any = '38252';
  slectedFormat: any = 'boq';
  erroralert = false;
  successalert = false;
  successMessage: string;
  errorMessage : string;
    downloadCustomerBoqPdf(){
      if(this.slectedFormat.length > 0){
          // this.loaderService.display(true);
          this.loader = true;
        this.quotationService.downloadCustomerBoqPdf(this.slectedFormat, this.quoteCustomerCheckId, this.pid).subscribe(
          res =>{
            // this.loaderService.display(false);
            this.loader = false;
            this.slectedFormat = [];
            this.successalert = true;
              this.successMessage = " Quotation Downloaded Successfully";
              setTimeout(function() {
                  this.successalert = false;
               }.bind(this), 5000);
            // this.clearCheck();
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
  
          },
          err => {
            this.erroralert = true;
              this.errorMessage = <any>JSON.parse(err['_body']).message;
              setTimeout(function() {
                    this.erroralert = false;
                 }.bind(this), 2000);
          }
        );
  
      }
      // else{
      //   alert("Please select atleast one format");
      // }
  
      
    }
  
    transform(value: string): string {
      return value.replace(/_/g, ' ');
    }
  
  gobrowse() {
    this.router.navigate(['/browse-preset/']);
  }
  

}
