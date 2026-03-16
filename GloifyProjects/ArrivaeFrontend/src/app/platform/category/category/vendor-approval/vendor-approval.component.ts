import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'app/platform/quotation/quotation.service';
import { LoaderService } from 'app/services/loader.service';
import { CategoryService } from '../category.service';
import { environment } from "environments/environment";
declare var $: any;

@Component({
  selector: 'app-vendor-approval',
  templateUrl: './vendor-approval.component.html',
  styleUrls: ['./vendor-approval.component.css'],
  providers: [CategoryService, QuotationService]
})
export class VendorApprovalComponent implements OnInit {
  selectedState = 'pending';
  successalert = false;
  successMessage: string;
  errorMessage: string;
  erroralert = false;
  quoteCustomerCheckId: any;
  loader: boolean = false;
  constructor(
    private categoryService: CategoryService,
    private loaderService: LoaderService,
    private quotationService: QuotationService
  ) { }

  ngOnInit() {
    this.getPOList();
  }

  selectSet(selectedSet) {
    
    this.selectedState = selectedSet;
    this.getPOList('', '', '', '', '');
  }

  // finan_status: any = 'pending';
  completed_request;
  pending_request;
  items;
  per_page;
  total_page;
  current_page;
  vendorList;
  getPOList(page_no?, vendorId?, startDate?, endDate?, search?) {
    this.loaderService.display(true);
    if (page_no === undefined) {
      page_no = 1;
    }
    if (vendorId === undefined) {
      vendorId = '';
    }
    if (startDate === undefined) {
      startDate = '';
    }
    if (endDate === undefined) {
      endDate = '';
    }
    if (search === undefined) {
      search = '';
    }
    this.categoryService.getFinancePoList(page_no, this.selectedState, vendorId, startDate, endDate, search).subscribe(res => {
      
      this.completed_request = res.completed_request;
      this.pending_request = res.pending_request;
      if (res.data.length === 0) {
        this.erroralert = true;
        this.items = res.data;
        this.errorMessage = "OOPS!! No Data Found";
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 7000);
        this.current_page = res.current_page;
        this.total_page = res.total;
        this.per_page = 10;
        this.loaderService.display(false);
      }
      else {
        this.erroralert = false;
        this.per_page = 10;
        this.total_page = res.total;
        this.current_page = res.current_page;
        this.items = res.data;
        this.vendorList = res.vendor_list;
        this.loaderService.display(false);
      }
    })
  }

  searched_value: any;
  searchFilter(term: any) {
    this.searched_value = term.target.value;
    if (this.searched_value !== '') {
      this.getPOList('', '', '', '', this.searched_value);
    }
    else if (this.searched_value === '') {
      this.getPOList('', '', '', '', '');
    }
  }
  approveLead(id) {
    
    this.loaderService.display(true);
    this.categoryService.patchFinanceApprove(parseInt(id)).subscribe(res => {
      this.successalert = true;
      this.successMessage = "This Purchase Order has been Successfully Approved!";
      setTimeout(function () {
        this.successalert = false;
      }.bind(this), 5000);
      this.getPOList();
      this.loaderService.display(false);
    },
      err => {
        this.erroralert = true;
        this.errorMessage = "Can't Approve this Purchase Order";
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 5000);
        this.loaderService.display(false);
      })
  }

  rejectlead(id) {
    this.loaderService.display(true);
    this.categoryService.rejectFinanceApprove(parseInt(id)).subscribe(res => {
      this.successalert = true;
      this.successMessage = "This Purchase Order has been Successfully Rejected!";
      setTimeout(function () {
        this.successalert = false;
      }.bind(this), 5000);
      this.getPOList();
      this.loaderService.display(false);
    },
      err => {
        this.erroralert = true;
        this.errorMessage = "Can't Reject this Purchase Order";
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 5000);
        this.loaderService.display(false);
      })
  }

  arrow: boolean = true;
  selectedArrow;
  expanded_data;
  toggleRow(row, i) {
    
    this.expanded_data = row.attributes.job_elements;
    row.expanded = !row.expanded;
    $(".expanded-col").css("display", "none");
    $(".expanded-col-" + row.id).css("display", "table-row");
    this.selectedArrow = i;
    if (this.arrow) {
      this.arrow = false;
    }
    else {
      this.arrow = true;

    }

  }
  FromDate;
  ToDate;
  vendorId;
  takeFromDate(event) {
    this.FromDate = event.value;
  }

  takeToDate(event) {
    this.ToDate = event.value;
  }

  filterColumDropdownChange1(clientId) {
    
    this.vendorId = clientId;
  }
  filterData() {
    this.getPOList('', this.vendorId, this.FromDate, this.ToDate);
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
      
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  slectedFormat: any = 'boq';
  pid;
  downloadCustomerBoqPdf(event: any, event2: any) {
    
    this.quoteCustomerCheckId = event;
    this.pid = event2;
    // if(this.slectedFormat.length > 0){
    this.loader = true;
    this.quotationService.downloadCustomerBoqPdf(this.slectedFormat, this.quoteCustomerCheckId, this.pid).subscribe(
      res => {
          
        this.loader = false;
        // this.slectedFormat = [];
        this.successalert = true;
        this.successMessage = " Quotation Downloaded Successfully";
        setTimeout(function () {
          this.successalert = false;
        }.bind(this), 5000);
        // this.clearCheck();
        if (JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] != null) {
          var contentType = 'application/pdf';
          var b64Data = JSON.parse(res._body)['quotation_base_64'];
          var name = JSON.parse(res._body)['boq_name'];
          var blob = this.b64toBlob(b64Data, contentType, 512);
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
          var b64Data = JSON.parse(res._body)['service_base_64'];
          var name = JSON.parse(res._body)['service_name'];
          var blob = this.b64toBlob(b64Data, contentType, 512);
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
        else if (JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] == null) {
          var contentType = 'application/pdf';
          var b64Data = JSON.parse(res._body)['quotation_base_64'];
          var name = JSON.parse(res._body)['boq_name'];
          var blob = this.b64toBlob(b64Data, contentType, 512);
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
        else if (JSON.parse(res._body)['boq_name'] == null && JSON.parse(res._body)['service_name'] != null) {
          var contentType = 'application/pdf';
          var b64Data = JSON.parse(res._body)['service_base_64'];
          var name = JSON.parse(res._body)['service_name'];
          var blob = this.b64toBlob(b64Data, contentType, 512);
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
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  // }
}

  po_preview_pdf_url: any;
  purchase_order_id;
  po_preview_pdf_url_without_base_url: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  getPOPdfForPreview(purchase_order_id?) {
    
    this.po_preview_pdf_url = undefined;
    if (purchase_order_id) {
      this.purchase_order_id = purchase_order_id;
      // this.downloadPoRelease(this.purchase_order_id);
    }
    this.loaderService.display(true);
    this.categoryService.getPOPdfForPreview(this.purchase_order_id).subscribe(
      res => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).path;
        if (this.po_preview_pdf_url == "" || this.po_preview_pdf_url == null) {
          this.erroralert = true;
          this.errorMessage = "Pdf not found for preview!!";
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
          $("#poPreviewModal").modal("hide");
        }
        this.loaderService.display(false);
      },
      err => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        $("#poPreviewModal").modal("hide");
        this.loaderService.display(false);
      }
    );
  }
}
