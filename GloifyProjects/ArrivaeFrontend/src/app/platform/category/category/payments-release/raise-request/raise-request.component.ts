import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/loader.service';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.css']
})
export class RaiseRequestComponent implements OnInit {
  clubbedView:any ;
  masterClubbedView:any;
  customClubbedView:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  @Input() invoice_details:any;
  @Input() purchase_order_id:any;
  view_detail: any;
  selectedInvoice='';
  payment_history_detail: any;
  selected_row = '';
  closeId: any;
  @Output() sendSuccessRequest : EventEmitter<any> = new EventEmitter();
  selected_item: any;

  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    
  }
  getPaymentList(performa_invoice_id){
    this.categoryService.getPaymentList(performa_invoice_id).subscribe(res=>{
      this.payment_history_detail = res.data;
      this.selected_row = performa_invoice_id;
      
    },err=>{})
  }
  raiseRequest(selectedInvoceId){
    this.selectedInvoice = selectedInvoceId;

  }
  submitRequest(invoiceFileId,remainingpayment){
    let enteredAmt = (<HTMLInputElement>document.getElementById(`amt-${invoiceFileId}`)).value;
    if(enteredAmt){
      if(parseInt(enteredAmt) <= parseInt(remainingpayment)){
        this.categoryService.submitRaiseRequestForInvoice(this.purchase_order_id,invoiceFileId,enteredAmt).subscribe(
          res=>{
           this.selectedInvoice = '';
           this.successMessageShow('Request Raised Successfully!');
           this.sendSuccessRequest.emit({'purchase_order_id':this.purchase_order_id,'item':this.invoice_details});
          },
          err=>{
  
          })
      }else{
        this.errorMessageShow('Entered amount should be less than equal to the remaining amount!')
      }
     
    }else{
      this.errorMessageShow('Please enter the amout first!')
    }
  }
  handleCloseEvent(){
    this.sendSuccessRequest.emit();
  }
  handleNegativeValue(event,invoiceFileId){
   if(event.target.value < 0){
     this.errorMessageShow('You cannot enter negative value');
     (<HTMLInputElement>document.getElementById(`amt-${invoiceFileId}`)).value = "0";
   }
  }
 
  cancelRequest(){
    this.selectedInvoice = '';
  }
  closePanel(rowId){
    // document.getElementById(`open-${rowId}`).style.display = 'block';
    // document.getElementById(`close-${rowId}`).style.display = 'none';
  }
  openPanel(rowId){
    this.selected_item = rowId;
    // document.getElementById(`close-${rowId}`).style.display = 'block';
    // document.getElementById(`open-${rowId}`).style.display = 'none';

  }
  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 5000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 5000);
  }

}
