import { Component, OnInit,Input } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import * as _moment from 'moment';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'payments-release',
  templateUrl: './payments-release.component.html',
  styleUrls: ['./payments-release.component.css','../tasks/tasks.component.css'],
  providers: [CategoryService]
})
export class PaymentsReleaseComponent implements OnInit {

	headers_res;
  per_page;
  arrow:boolean = true;
  total_page;
  current_page;
  project_list;
  project_id;
  paymentForm: FormGroup;
  dropdownList2=[];
  invoiceType = 'normal';
  boq_id;
  paymentTerm;
  line_item_in_po;
  invoice_date;
  minDate: Date;
  useremail:any;

  @Input() line_item_po: any;
  dropdownSettings2 ={
    singleSelection: false,
    text:  "Line Items" ,
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class-dropdown",
    
  }
  uploadInvoiceForm: FormGroup;
  payment_tem_days: any;
  invoice_remaining_amt: any;
  invoice_err_msg: string;
  invoice_details: any;
  purchase_order_id: any;
  role: string;
  selected_po: any;
  submitted = false;
  purchase_order_total_amt: any;
  boqtype :any;
  handover_reason_with_data: any;

  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.useremail =  localStorage.getItem("uid");

  	this.line_item_in_po = this.line_item_po;
    this.project_id = this.line_item_in_po.project_id;
    this.boq_id = this.line_item_in_po.id;
    this.role = localStorage.getItem('user');
    this.getPOPaymentList();
  	this.paymentForm = this.formBuilder.group({
      'performa_invoice_id': ['', Validators.required],
      'description': ['', Validators.required],
      'percentage': ['', Validators.required],
      'attachment': ['']
    });
    this.uploadInvoiceForm = this.formBuilder.group({
      'tax_invoice': [false, Validators.required],
      'invoice_date': [new Date(), Validators.required],
      'invoice_number': ['', Validators.required],
      'invoice_amount': ['',Validators.required],
      'tax_amount':[0]
    });
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
this.minDate = new Date(2024, 3, 1);
  }
  po_pi_list;
  getPOPaymentList(){
    this.loaderService.display(true);
    this.categoryService.getPOPaymentList(this.boq_id).subscribe(
      res=>{      
        this.po_pi_list = res.purchase_orders;
        this.boqtype = res.boq_type;
        console.log(this.boqtype);
        if(this.po_pi_list.length > 0){
          this.payment_tem_days = this.po_pi_list[0].po_details.payment_term;
          this.purchase_order_total_amt = this.po_pi_list[0].po_details.total_amount;
          this.invoice_list = this.po_pi_list[0].pi_payments;
          const data = this.po_pi_list.find(elem => elem.po_details.id === this.rowSelected);
          if(data){
            this.invoice_details = data.invoice_file_details;
          }
          this.getPIitemList(this.purchase_order_id)
        }
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
    });

  }
  handleSuccessRequest(event){
    this.getPOPaymentList();
    
  }



  rowSelected:any;
  invoice_list;
  //for collapsable row table
  toggleRow(row) {
    if (this.rowSelected === -1) {
      this.rowSelected = row.po_details.id
    }
    else {
      if (this.rowSelected == row.po_details.id) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row.po_details.id
      }

    }
    this.invoice_list = row.pi_payments;  
    this.selected_po = row.po_details.id; 
  } 
  po_id_selected;
  SHowRaiseRequest(po_id,item?){
    this.po_id_selected = po_id;
    this.invoice_details = item;
    this.invoiceType = 'normal';
  }
  handleInvoiceDateSelectEvent(eventDate){
    this.uploadInvoiceForm.controls['invoice_date'].setValue(this._trasformDateType(eventDate));
    this.paymentTerm = new Date(eventDate);
    this.paymentTerm.setDate(eventDate.getDate() + this.payment_tem_days); 
  }
   

  boq_list=[];

  selected_boq;
  selectBoq(boqobj,elem?,projectid?){
    this.selected_boq = boqobj;
    var elems= document.getElementsByClassName('active-text');
    for(var i=0;i<elems.length;i++){
      elems[i].classList.remove('active-text');
    }
    if(elem){
      elem.classList.add('active-text');
    }

  }
  handleInvoiceSelectEvent(event){
    let tax_type = event.target.value === 'tax' ? true : false;
    if(tax_type){
      this.uploadInvoiceForm.controls['tax_amount'].setValidators(Validators.required);
      this.uploadInvoiceForm.controls['tax_amount'].updateValueAndValidity();
    }else{
      this.uploadInvoiceForm.controls["tax_amount"].clearValidators();
      this.uploadInvoiceForm.controls["tax_amount"].updateValueAndValidity();
    }
    this.uploadInvoiceForm.controls['tax_invoice'].setValue(tax_type);
    
  }

  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
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




  file_name:any = "";
  attachment_file;
  basefile: any;
  onChange(event) {
    this.file_name = event.target.files[0].name
    this.attachment_file =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
          //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
     fileReader.readAsDataURL(this.attachment_file);
   }
   checkforafterSales:any
   checkfortagsnag:any 
   checkposthandoveryesno :any
   reason_invoice_handover :any
  openInvoiceModal(item,remaining_amt){
    // this.getPOPaymentList();
    this.invoice_remaining_amt = remaining_amt;
    this.purchase_order_id = item.id;
    this.checkforafterSales = item.after_sales
    this.checkfortagsnag = item.tag_snag
    this.checkposthandoveryesno = item.post_handover
    console.log(this.checkforafterSales , 'aftersales');
    console.log(this.checkfortagsnag , 'tagsnag');
    console.log(this.checkposthandoveryesno);
    
    $('#Invoice').prop('checked', false);
    this.basefile = '';
    this.file_name = '';
    this.invoice_check = false;
    

  }
  invoice_check;
  checkInvoice(event){
    if(event.target.checked){
     this.invoice_check = true

    }
    else{
      this.invoice_check = false
    }

  }
  AddRequest(invoiceData){
    if( this.file_name != ''){
      var obj =  invoiceData;
      obj['purchase_order_id']= this.purchase_order_id;
      obj['attachment_file']= this.basefile;
      obj['file_name']= this.file_name;
      let percent_amt = (invoiceData.invoice_amount * 18) /100;
      // this.submitted = true;
     obj['remark'] = this.reason_invoice_handover  
    }
    else{
      alert('First Upload A File');
    }
     this.loaderService.display(true);
      this.categoryService.uploadFileInPI(obj).subscribe(
        res=>{
            $("#uploadModal").modal("hide");
            // this.submitted = false;
            this.successMessageShow("File Uploaded successfully");
            this.uploadInvoiceFormReset();
            this.loaderService.display(false);
            this.getPOPaymentList();
            $("#reasonInvoiceUploadhandover").modal("hide");
            this.reason_invoice_handover = ''
            this.invoice_check = false;
          },
          err=>{
             this.loaderService.display(false);
            if (
              JSON.parse(err["_body"]).message ==
                "Invoice can't be uploaded as PO is not released yet." ||
              JSON.parse(err["_body"]).message ==
                "you are not allowed to upload invoice for service po"
            ) {
              this.errorMessage = this.errorMessage = JSON.parse(
                err["_body"]
              ).message;
            } else {
              this.errorMessage = JSON.parse(err["_body"])["message"][
                "purchase_order_id"
              ][0];
            }
            this.errorMessageShow(this.errorMessage);
        });


  }

  confirmAndDelete(id: number) {
    if (confirm("Are You Sure You Want To delete?") == true) {
      this.deletePiPayment(id);
    }
  }
  deletePiPayment(id){
    this.loaderService.display(true);
    this.categoryService.deletePiPayment(id).subscribe(
      res=>{
          this.loaderService.display(false);
          this.successMessageShow("Pi Payment Deleted successfully")
          this.getPOPaymentList();
          
        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body'])['message']);
          this.loaderService.display(false);
      });


  }
  current_pi_amt:any = "";
  openPaymentModal(pi_id, pi_amt){
    this.current_pi_amt = pi_amt
    this.paymentForm.reset();
    this.paymentForm.controls['performa_invoice_id'].setValue(pi_id);
    $("#savePaymentModal").modal("show");
  }
  raiseRequestPO(balance){
    var value_check = $('#po_value').val();
    if(value_check > balance){
      alert('Please Enter Value Less than balance');
      $('#po_value').val('');

    }
    else if( $('#po_value').val() ==  ''){
      alert('Please Enter a value first and then submit');

    }
    else{
      this.loaderService.display(true);
      this.categoryService.raiseRequestForPO(value_check,this.po_id_selected).subscribe(
        res=>{
          
          $("#raiseModal").modal("hide");
          this.getPOPaymentList();
          this.successMessageShow("Payment request raised successfully")
          $('#po_value').val('')
          this.loaderService.display(false);
        },
        err=>{
         
          this.errorMessageShow(JSON.parse(err['_body'])['message']);
          this.loaderService.display(false);
      });

    }
    

  }
  getPIitemList(po_id_selected){
    this.selected_po = po_id_selected;
    for(let obj of this.po_pi_list){     
      if(obj.po_details.id == po_id_selected ){
        this.invoice_list = obj.pi_payments
      }

    }
  }
  resetValue(){
    $('#po_value').val('')

  }
  openBrowseModal(){
    $("input[id='getFile']").click();
  }
  checkFile(check,id){
    $('#exampleCheck-'+id).attr('checked',check);
  }
  handleApproveRejectEvent(status,paymentId){
    if(confirm(`Are you sure you want to ${status} this payment ?`) == true){
      this.loaderService.display(true);
      this.categoryService.submitApproveOrRejectRequest(status,paymentId).subscribe(
        res=>{       
          this.loaderService.display(false);
          this.getPOPaymentList();
          this.successMessageShow(`Payment request ${status} successfully !`);
        },
        err=>{        
          this.errorMessageShow(JSON.parse(err['_body'])['message']);
          this.loaderService.display(false);
      });
    }
    
  }
  uploadInvoiceFormReset(){
    this.uploadInvoiceForm.reset();
    this.invoice_err_msg ='';
    this.invoiceType = 'normal';
    this.invoice_date = '';
    this.paymentTerm = '';
    this.file_name = '';
    this.uploadInvoiceForm.controls['tax_amount'].setValue(0);
    this.uploadInvoiceForm.controls["tax_invoice"].clearValidators();
    this.uploadInvoiceForm.controls["tax_invoice"].updateValueAndValidity();
  }
  private _trasformDateType(dateValue){
    return moment(dateValue).format('DD/MM/yyyy')
  }

  sendapprovalwithreason(){
    this.AddRequest(this.handover_reason_with_data)
  }
  isDisabled : boolean = false
  checkinghandoverInvoiceUpload(data){
    //  after-sales --true --- no pop 
    // tag_snag -- true -- show pop 
    // if above both are false --- show pop up
    // show pop up // // // //////////      //hide
    //after sales -- false      false       true 
    //tag_snag -- false         true        false
    let yesorNo  = this.checkposthandoveryesno == 'Yes' ? true : false
    if(yesorNo){
      if((!this.checkforafterSales && !this.checkfortagsnag)){
        console.log('show pop');
        $("#reasonInvoiceUploadhandover").modal("show");
       this.isDisabled = true
       $("#uploadModal").modal("hide");
      this.handover_reason_with_data = data
      }else if(!this.checkforafterSales &&  this.checkfortagsnag ) {
          console.log('show pop');
          $("#reasonInvoiceUploadhandover").modal("show");
          this.isDisabled = true
          $("#uploadModal").modal("hide");
          this.handover_reason_with_data = data
      }else {
        console.log('hide pop');
        this.AddRequest(data)
      }
    }else {
      this.AddRequest(data)
    }
  }
  closereasonInvoiceUpload(){
    this.reason_invoice_handover = ''
  }
  preventManualEntry(event: KeyboardEvent) {
    // Prevent any typing or manual entry in the input field
    event.preventDefault();
  }
}
