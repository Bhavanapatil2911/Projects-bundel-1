import { Component, OnInit, ElementRef, Input, ChangeDetectorRef ,OnDestroy} from '@angular/core';
import { Routes, Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { LeadService } from '../lead.service';
import { FinanceService } from '../../finance/finance.service';
import { QuotationService } from '../../quotation/quotation.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// import { LoaderService } from '../../../services/loader.service';
import { LoaderService } from 'app/services/loader.service';
import { Angular2TokenService } from 'angular2-token';
import { Location } from '@angular/common';
declare var $: any;
import * as _moment from "moment";
import { forEach } from '@angular/router/src/utils/collection';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
  providers: [LeadService, QuotationService],
})

export class PaymentsComponent implements OnInit {
  lead_id;
  lead_status;
  project_id;
  lead_details: any;
  approveList: any;
  paymentForm: FormGroup;
  sendpaymentForm: FormGroup;
  addUserFrom: FormGroup;
  onHoldForBOQ : FormGroup
  unholdboq : FormGroup
  basefile = "";
  image: any;
  hdfctxno: any;
  cashtxno: any;
  errorMessage: string;
  errormsgname: boolean = false;
  erroralert = false;
  successalert = false;
  successMessage: string;
  role: any;
  totalAmount: any;
  bankAndbrach: any;
  emailverified:boolean
  stateList:any = [
    {
      name:'Uttar Pradesh',
      code:'121'
    },
    {
      name:'Delhi',
      code:'122'
    },
    {
      name:'Karnatka',
      code:'123'
    },
    {
      name:'Maharashtra',
      code:'124'
    },
    {
      name:'Bihar',
      code:'125'
    },

  ]
  ReceiptForm = new FormGroup({
    customer_name: new FormControl(""),
    amount: new FormControl(""),
    bank: new FormControl(""),
    branch: new FormControl(""),
    date: new FormControl(""),
    rtgs_trx_no: new FormControl(""),
    hdfc_tx_no: new FormControl(""),
    cashfree_tx_no: new FormControl(""),
  });
  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService: LeadService,
    private financeService: FinanceService,
    public loaderService: LoaderService,
    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route: ActivatedRoute,
    private quotationService: QuotationService,
    private _location: Location,
    private ref: ChangeDetectorRef
  ) {}
  minDate = new Date();
  ngOnInit() {
    this.emailverified = localStorage.getItem('emailverified') === 'true';
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
      this.project_id = params["projectId"];
    });
    this.paymentForm = this.formBuilder.group({
      payment_type: ["initial_design"],
      amount: ["", Validators.required],
      mode_of_payment: ["", Validators.required],
      bank: [""],
      branch: [""],
      date_of_checque: [""],
      date: [""],
      transaction_number: [""],
      image: ["", Validators.required],
      project_id: ["", Validators.required],
      // 'quotation_ids' : new FormArray([]),
      payment_stage: ["pre_10_percent"],
      cheque_number: [""],
      quotations_ids : [""],      
    });
    this.onHoldForBOQ = this.formBuilder.group({
      quotation_id : new FormControl(""),
      otp: new FormControl("" , [Validators.required , Validators.maxLength(6)]),
      on_hold_status : new FormControl(""),
      onhold_resume_at : new FormControl("", [Validators.required]),
      onhold_comment : new FormControl("", [Validators.required]),
      onhold_reason : new FormControl("", [Validators.required])
    })



    this.unholdboq = this.formBuilder.group({
      quotation_id : new FormControl(""),
      otp: new FormControl("" , [Validators.required]),
    })

    this.sendpaymentForm = this.formBuilder.group({
      totalamount: new FormControl("", [Validators.required]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$"
        ),
      ]),
      mobilenumber: new FormControl("", [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      ]),
    });
    this.addUserFrom = this.formBuilder.group({
      shippingAddressGroup: this.formBuilder.group({
        first_name: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', Validators.required],
        last_name: ['', Validators.required],
        company: [''],
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state_or_province: ['', Validators.required],
        state_or_province_code: [''],
        country_code: ['', Validators.required],
        postal_code: ['', Validators.required],
        gstin: [''],
      }),
      billingAddressGroup: this.formBuilder.group({
        first_name: [''],
        email: [''],
        phone: [''],
        last_name: [''],
        company: [''],
        address1: [''],
        address2: [''],
        city: [''],
        state_or_province: [''],
        state_or_province_code: [''],
        country_code: [''],
        postal_code: [''],
        gstin: [''],
      })
    });
    this.role = localStorage.getItem("user");
    this.route.queryParams.subscribe((params) => {
      this.lead_status = params["lead_status"];
    });
    this.fetchBasicDetails();
    this.errormsgname = true;
    // this.getSet('pre_10_percent')
  }
  ngOnDestroy(): void{

    localStorage.setItem('payments_tab','pre_10_percent')

  }
  addedData:any = {};
  onSubmit(data){
    this.addedData = {};
    // if(this.sameAddress){
    //   data.shippingAddressGroup.state_or_province_code = this.stateCode
    //    this.addedData = {
    //     'billing_address':data.shippingAddressGroup,
    //     'shipping_address':data.shippingAddressGroup
    //   }
    // }else {
      // data.billingAddressGroup.state_or_province_code = this.stateCode2
      data.shippingAddressGroup.state_or_province_code = this.stateCode
       this.addedData = {
        'billing_address':data.billingAddressGroup,
        'shipping_address':data.shippingAddressGroup
      }
    // }
    this.loader = true;
    this.quotationService.pushToRestore(this.project_id, this.pushToProdQuotaionId, this.addedData).subscribe(
      (res) => {
        this.getSet('10_50_percent')
        this.loader = false;
        $("#pushToprodModal").modal("hide");
        this.successalert = true;
        this.successMessage =
          "Successfully Placed Order!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
      },
      (err) => {
        $("#pushToprodModal").modal("hide");
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"];
        this.loader = false;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );

  }

  stateCode: any = "";
  selectState(event: any) {
    if(event.target.value){
      let obj = this.stateList.find( (elem:any) => elem.name ===  event.target.value);
      this.stateCode = obj.code;
    }
    
  }

  stateCode2: any = "";
  selectState2(event: any) {
    if(event.target.value){
      let obj = this.stateList.find( (elem:any) => elem.name ===  event.target.value);
      this.stateCode2 = obj.code;
    }
    
  }

  todayByDate() {
    var todayTime =       this.onHoldForBOQ.controls['onhold_resume_at'].value
    var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    var finalDate = day + "-" + month + "-" + year;
    this.onHoldForBOQ.controls["onhold_resume_at"].setValue(finalDate);
  }

  sameAddress:any = false;
  // handleAddresscheck(event){
  //   this.sameAddress = event.target.checked;
  //   if(this.sameAddress){
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['first_name'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['first_name'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['last_name'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['last_name'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['email'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['email'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['phone'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['phone'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['address1'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['address1'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['city'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['city'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['state_or_province'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['state_or_province'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['country_code'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['country_code'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['postal_code'].clearValidators();
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['postal_code'].updateValueAndValidity()
      
  //   }else{
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['first_name'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['first_name'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['last_name'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['last_name'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['email'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['email'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['phone'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['phone'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['address1'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['address1'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['city'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['city'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['state_or_province'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['state_or_province'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['country_code'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['country_code'].updateValueAndValidity()
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['postal_code'].setValidators(
  //       Validators.required
  //     );
  //     this.addUserFrom.controls['billingAddressGroup']['controls']['postal_code'].updateValueAndValidity()
  //   }
  // }

  pushToProdQuotaionId:any;
  openpushToProdModal(quotation){
    this.getAdressDetails();

    this.pushToProdQuotaionId = quotation.id
  }
  getAdressDetails(){
    this.leadService.FetchAdress(this.project_id).subscribe(res=>{

      
      this.addUserFrom.controls['shippingAddressGroup'].setValue({
        first_name: res.shipping_address.first_name,
        email: res.shipping_address.email,
        phone: res.shipping_address.phone,
        last_name: res.shipping_address.last_name,
        company: res.shipping_address.company,
        address1: res.shipping_address.address1,
        address2: res.shipping_address.address2,
        city: res.shipping_address.city,
        state_or_province: res.shipping_address.state_or_province,
        state_or_province_code: res.shipping_address.state_or_province_code,
        country_code: res.shipping_address.country_code,
        postal_code: res.shipping_address.postal_code,
        gstin: res.shipping_address.gstin,
      }),
      this.addUserFrom.controls['billingAddressGroup'].setValue({
        first_name: res.billing_address.first_name,
        email: res.billing_address.email,
        phone: res.billing_address.phone,
        last_name: res.billing_address.last_name,
        company: res.billing_address.company,
        address1: res.billing_address.address1,
        address2: res.billing_address.address2,
        city: res.billing_address.city,
        state_or_province: res.billing_address.state_or_province,
        state_or_province_code: res.billing_address.state_or_province_code,
        country_code: res.billing_address.state_or_province_code,
        postal_code: res.billing_address.postal_code,
        gstin: res.billing_address.gstin,
      })
    })
  }

  LeadNumber: any;
  LeadMail: any;
  leadId: any;
  PreclouserBtn=false

  is_before_email_verify:any=true
  fetchBasicDetails() {
    // this.loader = true;
    this.loaderService.display(true)
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        // this.loader = false;
        this.loaderService.display(false)
        this.lead_details = res["lead"];
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        localStorage.setItem('lead_details', JSON.stringify(this.lead_details))
        this.LeadNumber = res["lead"]["email"];
        this.LeadMail = res["lead"]["contact"];
        this.leadId = res["lead"]["id"];
        this.project_id = res["lead"].project_details.id;
        this.paymentForm.controls["project_id"].setValue(this.project_id);
        let tab_name =localStorage.getItem('payments_tab')
        this.PreclouserBtn=(this.lead_details.show_pre_closure_payment_option == true)
        this.getSet(tab_name?tab_name:'pre_10_percent')
        this.getApprovedBoqList();
        this.getMapPayments();
        this.oderPipeLineData()
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }



Preclosureform = new FormGroup({
  Amount: new FormControl('', Validators.required),
  PanelValue: new FormControl(''),
  ServiceValue: new FormControl(''),
  LFValue: new FormControl(''),
  Discount: new FormControl(''),
  PaymentSource: new FormControl('', Validators.required),
  TransactionId:new FormControl(''),
  ChequeNumber:new FormControl(''),
  AccountNumber: new FormControl(''),
  IFSCcode:new FormControl(''),
  recetis:new FormControl('')
})


showtransactionfeild=false
showAccountFeild=false
showcheckfeild=false
  PreClosurePatmentFor(){
    $("#preclosurepaymentmodal").modal('show')
    this.selectedFiles=[]
    this.validFiles=[]
    this.imagePreviews=[]
    this.Preclosureform.reset()
    this.fileSizeError=''
    this.filename=[]
  }

  ProcesspaymentType(value){

    if(value=='cheque'){
      
      this.showcheckfeild=true
      this.Preclosureform.get('ChequeNumber').setValidators(Validators.required);
      this.showtransactionfeild=false
      this.Preclosureform.get('TransactionId').clearValidators();
      this.showAccountFeild=false
      this.Preclosureform.get('AccountNumber').clearValidators();
      this.Preclosureform.get('IFSCcode').clearValidators();
    }
    else if(value=='NEFT'){
      this.showAccountFeild=true
      this.Preclosureform.get('AccountNumber').setValidators(Validators.required);
      this.Preclosureform.get('IFSCcode').setValidators(Validators.required);
      this.showtransactionfeild=true
      this.Preclosureform.get('TransactionId').setValidators(Validators.required);
      this.showcheckfeild=false
      this.Preclosureform.get('ChequeNumber').clearValidators();
      this.Preclosureform.get('TransactionId').setValue('');

    }
    else if(value=='Cash'){
      this.showtransactionfeild=false
      this.Preclosureform.get('TransactionId').clearValidators();
      this.showcheckfeild=false
      this.Preclosureform.get('ChequeNumber').clearValidators();

      this.Preclosureform.get('TransactionId').setValue('');
      this.Preclosureform.get('ChequeNumber').setValue('');

      this.showAccountFeild=false
      this.Preclosureform.get('AccountNumber').clearValidators();
      this.Preclosureform.get('IFSCcode').clearValidators();

      this.Preclosureform.get('AccountNumber').setValue('');
      this.Preclosureform.get('IFSCcode').setValue('');

    }
    else{
      this.showtransactionfeild=true
      this.Preclosureform.get('TransactionId').setValidators(Validators.required);
      this.showcheckfeild=false
      this.Preclosureform.get('ChequeNumber').clearValidators();
      this.showAccountFeild=false
      this.Preclosureform.get('ChequeNumber').setValue('');

      this.Preclosureform.get('AccountNumber').clearValidators();
      this.Preclosureform.get('IFSCcode').clearValidators();

      this.Preclosureform.get('AccountNumber').setValue('');
      this.Preclosureform.get('IFSCcode').setValue('');

    }

  }
  // selectedFiles :any=[];
  // onFileChange(event: Event) {
  //   const input:any = event.target as HTMLInputElement;
  //   if (input.files) {
  //     this.selectedFiles = [...input.files]; // Store files in an array
  //   }
  // }

  selectedFiles: File[] = [];
  validFiles : any = []; // Store only valid files
  imagePreviews: any = []; // Store base64 previews for valid images
filename:any=[];
  fileSizeError: string = ''; // Store error message if any file exceeds size limit
  
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes
    // this.selectedFiles=[]  
    console.log(maxFileSize)
    console.log(input.files,)
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        console.log(file.size,file.name)
        if (file.size <= maxFileSize) { // Check if file size is <= 5 MB
          this.validFiles.push(file); // Add valid files to the list
          this.fileSizeError=''
          this.filename.push(file.name)
          this.selectedFiles=[]
        }
        else{
          this.fileSizeError = "Some files exceed the 5 MB limit and were not selected.";
          this.validFiles=[]
          this.filename=[]
          
          break;
        }

      }

      console.log(this.validFiles,this.fileSizeError)

      this.validFiles.forEach(file => {
        this.selectedFiles.push(file);
      })
      console.log(this.selectedFiles)

      // preparing data for preview
      this.imagePreviews = [];
  
      this.validFiles.forEach(file => {
        console.log("hiiii", file)
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push({'url': reader.result as string, type: file.type}); // Store the preview
        };
        reader.readAsDataURL(file);
      });
      console.log(this.imagePreviews)
    }
  }


  deleteImage(index: number) {
    // Remove the file at the specified index from both selectedFiles and imagePreviews
    console.log(index)
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.validFiles.splice(index,1);
    this.filename.splice(index,1)
  }

  Addprepayment(){
    console.log("hello")

    console.log(this.Preclosureform.value)
    console.log(this.Preclosureform.valid)
this.loaderService.display(true)
    const formData = new FormData();
    formData.append('transaction_id', this.Preclosureform.get('TransactionId').value || ' ');
    formData.append('cheque_number', this.Preclosureform.get('ChequeNumber').value || ' ');
    formData.append('account_number', this.Preclosureform.get('AccountNumber').value || '' );
    formData.append('ifsc_code', this.Preclosureform.get('IFSCcode').value || '');
    formData.append('payment_source', this.Preclosureform.get('PaymentSource').value || ' ');

    formData.append('amount', this.Preclosureform.get('Amount').value || '');
    formData.append('projected_panel_value', this.Preclosureform.get('PanelValue').value || ' ');
    formData.append('projected_service_value', this.Preclosureform.get('ServiceValue').value || ' ');
    formData.append('projected_lf_value', this.Preclosureform.get('LFValue').value || ' ');
    formData.append('proposed_discount_per', this.Preclosureform.get('Discount').value || ' ');
    console.log(this.selectedFiles)
    // Append each selected file to FormData
    if(this.selectedFiles.length > 0){
      this.selectedFiles.forEach((file, index) => {
        formData.append('files[]', file); // Use 'recetis[]' to send as array
      });
    }

    this.quotationService.preclouserpayment(this.project_id,formData)
    .subscribe(
      (res) =>{
        this.loaderService.display(false)

        $("#preclosurepaymentmodal").modal("hide");
        this.successMessage = res.message;
        this.successalert = true
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          3000
        );

       this.fetchBasicDetails()

      },
      (err) =>{
        console.error("Error uploading:", err);
        this.errorMessage = JSON.parse(err._body)["message"];
        this.erroralert=true
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
      }
    );

  }

  getFileType(url: string): string {
    // console.log(url.split('/'))
    // console.log(url.split('/').pop())
    // console.log(url.split('/').pop().split('?')[0])

    // return url.split('/').pop().split('?')[0]
    return url.split('.').pop().split('?')[0]
  }

  unutilized_amount: any;
  amountAdded_10: any;
  amountAdded_40: any;
  unmappedData: any = [];
  paid_amunt_sum: any;
  total_amunt_sum: any;
  approvedBoqList: any = [];
  getApprovedBoqList() {
    this.unmappedData = [];
    // this.loader = true;
    this.loaderService.display(true)
    this.leadService
      .getApprovedBoqList(this.project_id, this.selectedSet)
      .subscribe(
        (res) => {
          //  this.loader = false;
          this.loaderService.display(false)
          this.paid_amunt_sum = res.paid_amount_sum;
          this.total_amunt_sum = res.total_amount_sum;
          this.approveList = res["quotations"];          
          if (this.selectedSet == "pre_10_percent"){
            this.AllquotationValues = []
            // this.totalfinalvalues = []
            this.AllBoqValuesfortenpercent = []
            this.approvedBoqList =[];
            this.paidFortyValues = []
            this.stageForPaymentForm = ''
        this.approvedBoqList = this.approveList.filter(
       (el) => el.per_10_approved_at != null
          );
          } 
            if (this.selectedSet == "pre_10_percent") {
              for (let i = 0; i < this.approveList.length; i++) {
                if (
                  this.approveList[i].per_10_approved_at == null &&
                  this.approveList[i].per_10_closure_reported_at == null
                ) {
                  this.unmappedData.push(this.approveList[i]);
                }
              }
            } else {
              for (let i = 0; i < this.approveList.length; i++) {
                if (
                  this.approveList[i].per_50_push_to_production_reported_at ==
                    null &&
                  this.approveList[i].per_50_approved_at == null
                ) {
                  this.unmappedData.push(this.approveList[i]);
                }
              }
            }
        },
        (err) => {
          // this.loader = false;
          this.loaderService.display(false)
        }
      );
  }

  selectedSet: any = "pre_10_percent";
  getSet(selectedSet) {
    this.AllquotationValues = []
    this.AllBoqValuesfortenpercent = []
    this.paidFortyValues = []
    this.stageForPaymentForm = ''
    this.disableButtonForPayment = false
    // Resetting selection if the tab is changed
    localStorage.setItem('payments_tab',selectedSet)
    this.getMapPayments();
    this.paymentForm = this.formBuilder.group({
      payment_type: [""],
      amount: ["", Validators.required],
      mode_of_payment: ["", Validators.required],
      bank: [""],
      branch: [""],
      date_of_checque: [""],
      date: [""],
      transaction_number: [""],
      cheque_number: [""],
      image: [""],
      project_id: ["", Validators.required],
      // quotation_ids: new FormArray([]),
      quotations_ids : [""],
      payment_stage: [""],
    });
    if (this.array_length > 0) {
      $("#bt-disable").prop("disabled", false);
      $("#bt-disable").css("cursor", "pointer");
    } else {
      $("#bt-disable").prop("disabled", true);
      $("#bt-disable").css("cursor", "not-allowed");
    }
    this.paymentForm.controls["project_id"].setValue(this.project_id);
    //
    this.selectedSet = selectedSet;
    if (this.selectedSet == "pre_10_percent") {
      this.getApprovedBoqList();
      this.paymentForm.patchValue({ payment_type: "initial_design" });
      this.paymentForm.patchValue({ payment_stage: "pre_10_percent" });
      this.use_total_amt = this.amountAdded_10;
      this.AllquotationValues = []
      this.AllBoqValuesfortenpercent = []
      this.paidFortyValues = []
      this.stageForPaymentForm = ''
    } else if (this.selectedSet == "10_50_percent") {
      this.getApprovedBoqList();
      this.paymentForm.patchValue({ payment_type: "final_design" });
      this.paymentForm.patchValue({ payment_stage: "10_50_percent" });
      this.use_total_amt = this.amountAdded_40;
       this.AllquotationValues = []
      this.AllBoqValuesfortenpercent = []
      this.paidFortyValues = []
      this.stageForPaymentForm = ''
    } else if (this.selectedSet == "100_percent") {
      this.paymentForm.patchValue({ payment_type: "final_payment" });
      this.paymentForm.patchValue({ payment_stage: "final_payment" });
      this.getFinalPaymentQuotation();
      this.AllquotationValues = []
      this.AllBoqValuesfortenpercent = []
      this.paidFortyValues = []
      this.stageForPaymentForm = ''
    } 
    else if(this.selectedSet == "order_pipe"){
      this.clickOrderPipeLine()
      this.paymentForm.patchValue({ payment_stage: "pre_10_percent" });
      this.AllquotationValues = []
      this.AllBoqValuesfortenpercent = []
      this.paidFortyValues = []
      this.stageForPaymentForm = ''
    }
  }
  pending_amt;
  paid_sum_50;
  total_sum_50;
  getFinalPaymentQuotation() {
    this.loaderService.display(true)
    this.approveList = [];
    this.leadService.getFinalPaymentQuotationLead(this.project_id).subscribe(
      (res) => {
        this.unmappedData = [];
        this.paid_sum_50 = res.paid_amount_sum;
        this.total_sum_50 = res.total_amount_sum;
        this.loaderService.display(false);
        this.approveList = res["quotations"];
        for (let i = 0; i < this.approveList.length; i++) {
          if (
            this.approveList[i].per_100_reported_at == null &&
            this.approveList[i].per_100_approved_at == null
          ) {
            this.unmappedData.push(this.approveList[i]);
          }
        }
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  isProjectInWip(): boolean {
    var wip_array = [
      "wip",
      "pre_10_percent",
      "10_50_percent",
      "50_percent",
      "100_percent",
      "installation",
      "on_hold",
      "inactive",
    ];
    if (
      this.lead_details &&
      this.lead_details.project_details &&
      this.lead_details.project_details.status &&
      wip_array.includes(this.lead_details.project_details.status)
    ) {
      return true;
    } else {
      return false;
    }
  }

  sendsms(data: any) {
    this.loader = true;
    let id = data.payment_request.id;
    let status = "send_sms";
    this.quotationService.sendsms(id, status).subscribe(
      (res) => {
        this.loader = false;
        this.successalert = true;
        this.successMessage =
          "Payment Request Sent successfully to Customer Mobile number";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"];
        this.loader = false;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
      }
    );
  }
  sendemail(data: any) {
    this.loader = true;
    let id = data.payment_request.id;
    let status = "send_email";
    this.quotationService.sendemail(id, status).subscribe(
      (res) => {
        this.loader = false;
        this.successalert = true;
        this.successMessage =
          "Payment Request Sent successfully to Customer Email";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"];
        this.loader = false;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
      }
    );
  }
  changePaymentMode(event) {
    this.paymentForm.controls["image"].setValue("");

    if (event.target.value == "NEFT/RTGS") {
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");

      this.paymentForm.controls["bank"].setValue("");
      this.paymentForm.controls["branch"].setValue("");
      this.paymentForm.controls["date_of_checque"].setValue("");
      this.paymentForm.controls["image"].setValidators(null);
    } else if (event.target.value == "cheque") {
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
      this.paymentForm.controls["transaction_number"].setValue("");
      this.paymentForm.controls["date"].setValue("");
      this.paymentForm.controls["image"].setValidators([Validators.required]);
    }
    this.paymentForm.controls["image"].updateValueAndValidity();

    this.ref.detectChanges();
  }
  array_length;
  msg;
  signBoq: any;
  savePayment() {
    this.loaderService.display(true);
    this.signBoq = [];
    $("#addPayment").modal("hide");
    $("#extreChequeDetails").modal("hide");
    let attachment
    let boqId
    let id
    if(this.selectedSet == "pre_10_percent" || this.selectedSet == 'order_pipe' ){
      attachment = this.basefile
      boqId = this.AllquotationValues
      id=this.extrapaymentId
    }else {
      boqId = this.AllquotationValues
      attachment =
      this.paymentForm.get("mode_of_payment").value == "cheque" ||
      this.paymentForm.get("mode_of_payment").value == "NEFT/RTGS"
        ? this.basefile
        : "";
    }
    this.quotationService
      .savePayment(this.project_id, this.paymentForm.value, attachment , boqId ,id)
      .subscribe(
        (res) => {
          if (this.selectedSet == "100_percent") {
            this.getFinalPaymentQuotation();
          } else {
            this.getApprovedBoqList();
            //this.fetchBasicDetails();
          }

          if(this.selectedSet == 'order_pipe'){
            this.oderPipeLineData()
          }

          // this.getSet(this.selectedSet);
          this.AllquotationValues = []
          this.successalert = true;
          this.successMessage = "Payment Added successfully!";
          this.disableButtonForPayment = false
          this.loaderService.display(false);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            10000
          );
          this.paymentForm.controls["mode_of_payment"].setValue("");
          this.paymentForm.controls["bank"].setValue("");
          this.paymentForm.controls["branch"].setValue("");
          this.paymentForm.controls["date_of_checque"].setValue("");
          this.paymentForm.controls["transaction_number"].setValue("");
          this.paymentForm.controls["cheque_number"].setValue("");
          this.paymentForm.controls["amount"].setValue("");
          this.paymentForm.controls["quotations_ids"].setValue("")
          this.paymentForm.controls["image"].setValue("");
          this.paymentForm.controls["date"].setValue("");
          // this.paymentForm.controls["payment_type"].setValue("");
          // this.paymentForm.controls["payment_stage"].setValue("");
          $(".cheque-mode").css("display", "none");
          $(".neft-mode").css("display", "none");
          this.basefile = undefined;
        },
        (err) => {
          this.msg = JSON.parse(err._body)["message"];

          alert(this.msg);
          this.loaderService.display(false);
        }
      );
  }
  totalfossil: any;
  totalamount() {
    let amount = parseInt(this.totalAmount);
    this.totalfossil = amount;
  }

  messeageFortenk : boolean = false
  displaymessageFortenk : any
  totalAmountsubUnUtilisied :any
  sendpr :any
  sendapaymentrequest(data) {
    if( this.selectedSet === 'pre_10_percent' || this.selectedSet === 'order_pipe' ){
       this.sendpr = {
        email: data.email,
        mobile_number: data.mobilenumber,
        amount: data.totalamount,
        lead_id: this.leadId,
        quotations_ids : this.AllquotationValues,
        stage : 'pre_10_percent',
        isEdited : this.toggleInputField,
        original_amount : ''
      };
    }else if(this.selectedSet === '10_50_percent'){
      this.sendpr = {
        email: data.email,
        mobile_number: data.mobilenumber,
        amount: data.totalamount,
        lead_id: this.leadId,
        quotations_ids : this.AllquotationValues,
        stage : '10_50_percent',
        isEdited : this.toggleInputField,
        original_amount : ''
      };
    }else{
       this.sendpr = {
        email: data.email,
        mobile_number: data.mobilenumber,
        amount: data.totalamount,
        lead_id: this.leadId,
      };
    }
    if( this.selectedSet == '100_percent' ){
      this.unutilizedAmountPresent() 
    } else if((this.selectedSet == 'pre_10_percent' || this.selectedSet == 'order_pipe' || this.selectedSet == '10_50_percent' )  &&  parseInt(this.amountAdded_10) == 0){      
      if(parseInt(this.totalAmount) > 1000000){
        this.messeageFortenk = true
        this.displaymessageFortenk = 'Amount should be less than 10 Lac Rupees'
      }else {
        if(this.fortyPaidValues > 10000  && this.totalAmount <  1000000  ){
          if(parseInt(this.totalAmount) >= 10000){
             $("#addPayment").modal("hide");
             this.messeageFortenk = false
             this.unutilizedAmountPresent()
          }else{
            this.messeageFortenk = true
            this.displaymessageFortenk = 'Amount should be greater than ₹10,000'
          }
        }else if(this.fortyPaidValues < 10000 && parseInt(this.totalAmount) >   this.totalfinalvalues*0.03 ){
          $("#addPayment").modal("hide");
          this.messeageFortenk = false
          this.unutilizedAmountPresent()
      }else {
        this.messeageFortenk = true
        this.displaymessageFortenk = 'Amount should be greater than 3%  of BOQ value'
      }
      }
    }else{
      if(parseInt(this.totalAmount) > 1000000 ){
        this.messeageFortenk = true
         this.displaymessageFortenk = 'Amount should be less than 10 Lac Rupees'
      }else{
        if( (this.amountAdded_10 < this.sendpr.amount)){
          if(this.fortyPaidValues > 10000){
            if(parseInt(this.totalAmount) >= 10000){
              this.sendpr.original_amount = this.sendpr.amount
              this.sendpr.amount =  this.totalAmountsubUnUtilisied  =  (this.sendpr.amount - this.amountAdded_10).toFixed(2)
              $("#addPayment").modal("hide");
              $("#UnutilizedModal").modal("show");
            }else{
              this.messeageFortenk = true
              this.displaymessageFortenk = 'Amount should be greater than ₹10,000'
            }
          }
          if(this.fortyPaidValues < 10000 &&  parseInt(this.totalAmount) >   this.totalfinalvalues*0.03  ){
            
          this.sendpr.original_amount = this.sendpr.amount
          this.sendpr.amount =  this.totalAmountsubUnUtilisied  =  (this.sendpr.amount - this.amountAdded_10).toFixed(2)
          $("#addPayment").modal("hide");
          $("#UnutilizedModal").modal("show");
        }else {
          this.messeageFortenk = true
          this.displaymessageFortenk = 'Amount should be greater than 3% of BOQ value'
        }
          
        }else {
          if(this.fortyPaidValues > 10000  && this.totalAmount <  1000000  ){
            if(parseInt(this.totalAmount) >= 10000){
               $("#addPayment").modal("hide");
               this.messeageFortenk = false
              //  $("#UnutilizedModal").modal("show");
               this.totalAmountsubUnUtilisied = this.sendpr.amount
               this.unutilizedAmountPresent()
            }else{
              this.messeageFortenk = true
              this.displaymessageFortenk = 'Amount should be greater than ₹10,000'
            }
          }
          if(this.fortyPaidValues < 10000 && this.totalAmount <  1000000  ){
            if(  parseInt(this.totalAmount) >   this.totalfinalvalues*0.03  ){
              $("#addPayment").modal("hide");
              this.messeageFortenk = false
              // $("#UnutilizedModal").modal("show");
              this.totalAmountsubUnUtilisied = this.sendpr.amount
              this.unutilizedAmountPresent()
            }else {
              this.messeageFortenk = true
              this.displaymessageFortenk = 'Amount should be greater than 3% of BOQ value'
            }
          }
        }
      }
    }
  }
  sendapaymentrequest_forty(data) {
    if(this.selectedSet === '10_50_percent'){
      this.sendpr = {
        email: data.email,
        mobile_number: data.mobilenumber,
        amount: data.totalamount,
        lead_id: this.leadId,
        quotations_ids : this.AllquotationValues,
        stage : '10_50_percent',
        isEdited : this.toggleInputField,
        original_amount : ''
      };
    }
    if( this.selectedSet == '100_percent' ){
      this.unutilizedAmountPresent() 
    } else if(( this.selectedSet == '10_50_percent' )  &&  parseInt(this.amountAdded_40) == 0){      
      if(parseInt(this.totalAmount) > 1000000){
        this.messeageFortenk = true
        this.displaymessageFortenk = 'Amount should be less than 10 Lac Rupees'
      }else {
        if( this.fortyPaidValues > 10000  && this.totalAmount <  1000000  ){
          if(parseInt(this.totalAmount) >= 10000){
             $("#addPayment").modal("hide");
             this.messeageFortenk = false
             this.unutilizedAmountPresent()
          }else{
            
            this.messeageFortenk = true
            this.displaymessageFortenk = 'Amount should be greater than ₹10,000'
          }
        }else if( this.fortyPaidValues  < 10000 && parseInt(this.totalAmount) >   this.totalfinalvalues*0.03 ){
          $("#addPayment").modal("hide");
          this.messeageFortenk = false
          this.unutilizedAmountPresent()
      }else {
        this.messeageFortenk = true
        this.displaymessageFortenk = 'Amount should be greater than 3% of of BOQ value'
      }
      }
    }else{
      if(parseInt(this.totalAmount) > 1000000 ){
        this.messeageFortenk = true
         this.displaymessageFortenk = 'Amount should be less than 10 Lac Rupees'
      }else{
        if( (this.amountAdded_40 < this.sendpr.amount)){
          if( this.fortyPaidValues > 10000){
            if(parseInt(this.totalAmount) >= 10000){
              this.sendpr.original_amount = this.sendpr.amount
              this.sendpr.amount =  this.totalAmountsubUnUtilisied  =  (this.sendpr.amount - this.amountAdded_40).toFixed(2)
              $("#addPayment").modal("hide");
              $("#UnutilizedModal").modal("show");
            }else{
              this.messeageFortenk = true
              this.displaymessageFortenk = 'Amount should be greater than ₹10,000'
            }
          }
          if( this.fortyPaidValues < 10000 &&  parseInt(this.totalAmount) >   this.totalfinalvalues*0.03  ){
            
          this.sendpr.original_amount = this.sendpr.amount
          this.sendpr.amount =  this.totalAmountsubUnUtilisied  =  (this.sendpr.amount - this.amountAdded_40).toFixed(2)
          $("#addPayment").modal("hide");
          $("#UnutilizedModal").modal("show");
        }else {
          this.messeageFortenk = true
          this.displaymessageFortenk = 'Amount should be greater than 3% of BOQ value'
        }  
        }else {
          if( this.fortyPaidValues > 10000  && this.totalAmount <  1000000  ){
            if(parseInt(this.totalAmount) >= 10000){
               $("#addPayment").modal("hide");
               this.messeageFortenk = false
              //  $("#UnutilizedModal").modal("show");
               this.totalAmountsubUnUtilisied = this.sendpr.amount
               this.unutilizedAmountPresent()
            }else{
              this.messeageFortenk = true
              this.displaymessageFortenk = 'Amount should be greater than ₹10,000'
            }
          }
          if( this.fortyPaidValues < 10000 && this.totalAmount <  1000000  ){
            if(  parseInt(this.totalAmount) >   this.totalfinalvalues*0.03  ){
              $("#addPayment").modal("hide");
              this.messeageFortenk = false
              // $("#UnutilizedModal").modal("show");
              this.totalAmountsubUnUtilisied = this.sendpr.amount
              this.unutilizedAmountPresent()
            }else {
              this.messeageFortenk = true
              this.displaymessageFortenk = 'Amount should be greater than 3% of BOQ value'
            }
          }
        }
      }
    }
  }
  sendapaymentrequest_Hundered(data) {
      this.sendpr = {
        email: data.email,
        mobile_number: data.mobilenumber,
        amount: data.totalamount,
        lead_id: this.leadId,
        quotations_ids : this.AllquotationValues,
        stage : 'final_payment',
        isEdited : this.toggleInputField,
        original_amount : ''
      };
    if(parseInt(this.totalAmount) > 1000000){
      this.messeageFortenk = true
      this.displaymessageFortenk = 'Amount should be less than 10 Lac Rupees'
    }else if ( (this.selectedSet == '100_percent')  && parseInt(this.amountAdded_40) == 0)  {
      $("#addPayment").modal("hide");
      this.unutilizedAmountPresent()
    }else {
      if(this.amountAdded_40 < this.sendpr.amount){
        this.sendpr.original_amount = this.sendpr.amount
        this.sendpr.amount =  this.totalAmountsubUnUtilisied  =  (this.sendpr.amount - this.amountAdded_40).toFixed(2)
        $("#addPayment").modal("hide");
        $("#UnutilizedModal").modal("show");
      }else{
        $("#addPayment").modal("hide");
        this.unutilizedAmountPresent()
      }
    }
  }
  setColoronhold(value, per_fifty_at, tabValue){
    if(value && per_fifty_at == null && tabValue == '10_50_percent' ){
      return "text-danger"
    }else{
      return "a_hrefLink"
    }
  }
  unutilizedAmountPresent(){
    $("#UnutilizedModal").modal("hide");

    if(this.selectedSet == 'pre_10_percent' || this.selectedSet == 'order_pipe'){
      this.sendpr['stage'] = 'pre_10_percent'
    } else{
      if(this.selectedSet == '10_50_percent'){
        this.sendpr['stage'] ='10_50_percent'
      } else{
        if(this.selectedSet == '100_percent'){
          this.sendpr['stage'] ='final_payment'
        }
      }
    }
    this.loader = true;
    this.quotationService.sendPayment(this.sendpr).subscribe(
      (res) => {
        if (res.message == "Please enter valid Customer email/mobile no") {
          this.erroralert = true;
          this.errorMessage = "Please enter valid Customer email/mobile no";
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );
          this.loader = false;
          this.sendpaymentForm.controls["totalamount"].setValue("");
        } else {
          this.successalert = true;
          this.successMessage = res.message;
          this.loader = false;
          this.AllquotationValues = []
          this.AllBoqValuesfortenpercent = []
          this.paidFortyValues = []
          this.stageForPaymentForm = ''
          this.getMapPayments()
          if(this.selectedSet === 'order_pipe'){
            this.oderPipeLineData()
          }else if(this.selectedSet === 'pre_10_percent' || this.selectedSet === '10_50_percent'   ){
            this.getApprovedBoqList()
          }else{
            this.getFinalPaymentQuotation();
          }

          this.disableButtonForPayment = false
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
          this.sendpaymentForm.controls["totalamount"].setValue("");
        }
      },
      (err) => {
        this.loader = false;
        if (JSON.parse(err._body)["message"]) {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body)["message"];
        }
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
      }
    );
  }
  openpremodal(){
    this.messeageFortenk = false
    $("#addPayment").modal("show")
    $("#UnutilizedModal").modal("hide")
  }

  onChange(event) {
    this.image = event.srcElement.files[0];
    console.log(this.image)
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result;
    };

    fileReader.readAsDataURL(this.image);
  }
  payment_details;
  getPaymentQuotation(paymentId) {
    this.loaderService.display(true);
    this.financeService
      .getPaymentQuotation(this.project_id, paymentId)
      .subscribe(
        (res) => {
          this.payment_details = res["payment"]["quotation_payments"];
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  showAccordion(index, paymentId) {
    var this1 = this;
    var str = "#accordion_" + index;
    // var str2='#package'+index+' i.fa';
    var str3 = ".combmoduleAccordionRow" + index;
    $(str).on("shown.bs.collapse", function () {
      $(str3).removeClass("d-none");
      //this1.getPaymentDetails(boqid);
    });
    $(str).on("hidden.bs.collapse", function () {
      $(str3).addClass("d-none");
      this1.payment_details = undefined;
    });
    // var str='combmoduleAccordionRow'+index;
    // document.getElementById(str).classList.remove('d-none')
  }
  payment_details_Arr;
  getPaymentHistory() {
    this.loaderService.display(true);
    this.financeService.getPaymentDetails(this.project_id).subscribe(
      (res) => {
        this.payment_details_Arr = res.payments;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"];
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
      }
    );
  }

  cancelLinkInPaymentHistory(id){
    this.financeService.getCancelForPayment(id).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = res.message
        this.getPaymentHistory()
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) =>{
        
      }
    )
  }

  accountdetails: any;
  getAccountDetails() {
    var bank;
    var branch;
    this.loaderService.display(true);
    this.leadService.getAccountDetails(this.lead_id).subscribe((res) => {
      this.loaderService.display(false);
      this.accountdetails = res;
      bank = this.accountdetails.bank_and_branch;
      branch = bank.split(" ");
      for (var i = 0; i <= branch.length; i++) {
        if (branch[i] == "Icici") {
          branch[i] = "ICICI";
        } else if (branch[i] == "Cms") {
          branch[i] = "CMS";
        }
      }
      var bb = branch.join(" ");
      this.bankAndbrach = bb;
    });
  }
  ngAfterViewInit() {
    $(".cheque-mode").css("display", "none");
    $(".neft-mode").css("display", "none");
    $("#bt-disable").prop("disabled", true);
    $("#bt-disable").css("cursor", "not-allowed");
  }

  approveBoq(boq_id) {
    this.loaderService.display(true);
    this.financeService.approveBoq(this.project_id, boq_id).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "BOQ approved successfully!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
        this.getApprovedBoqList();
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"];
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
      }
    );
  }
  quotationidsArr;
  pending_am = 0;
  paymentReset() {
    this.messeageFortenk = false
    // this.paymentForm.reset();
    $(".cheque-mode").css("display", "none");
    $(".neft-mode").css("display", "none");
    this.paymentForm.controls["mode_of_payment"].setValue("");
    this.paymentForm.controls["bank"].setValue("");
    this.paymentForm.controls["branch"].setValue("");
    this.paymentForm.controls["date_of_checque"].setValue("");
    this.paymentForm.controls["cheque_number"].setValue("");
    this.paymentForm.controls["transaction_number"].setValue("");
    this.paymentForm.controls["amount"].setValue("");
    this.paymentForm.controls["image"].setValue("");
    this.paymentForm.controls["date"].setValue("");
    this.paymentForm.patchValue({ payment_type: "" });
    this.paymentForm.patchValue({ payment_stage: "" });
    this.paymentForm.patchValue({ project_id: this.project_id });
    this.paymentForm.controls["quotations_ids"].setValue('');
    this.basefile = undefined;

    if (this.selectedSet == "100_percent") {
      this.paymentForm.patchValue({ payment_stage: "" });
    }
  }
  pending_chk;
  checkPendingAmt(elemid) {
    this.pending_chk = (<HTMLInputElement>(
      document.getElementById(elemid)
    )).value;

    // if(this.pending_chk > this.pending_am){
    //   alert("Paid Amount is greater than pending amount");
    //   $('#pending_amt').val(0);

    // }
  }
  projectId;
  paymentId;
  details;
  PaymentReceiptData(quotation_id, data, stat) {
    // this.getPaymentList();
    $("#PaymentReceipt").modal("show");
    $("#paymentHistoryModal").modal("hide");
    $(".modal").css("overflow-y", "auto");
    this.details = data;
    this.projectId = data.project_id;
    this.paymentId = data.id;
    this.ReceiptForm.controls["customer_name"].setValue(this.details.lead_name);
    this.ReceiptForm.controls["amount"].setValue(this.details.amount);
    this.ReceiptForm.controls["bank"].setValue(this.details.bank);
    this.ReceiptForm.controls["branch"].setValue(this.details.branch);
    if (this.details.mode_of_payment == "NEFT/RTGS") {
      this.ReceiptForm.controls["date"].setValue(this.details.date);
    }
    if (this.details.mode_of_payment == "cheque") {
      this.ReceiptForm.controls["date"].setValue(this.details.updated_at);
    }    
    // let x = moment(this.details.updated_at).format("DD/MM/yyyy")

    if (this.details.mode_of_payment == "cashfree") {
      this.ReceiptForm.controls["date"].setValue(this.details.updated_at);
    }
    this.ReceiptForm.controls["rtgs_trx_no"].setValue(
      this.details.transaction_number
    );
    this.hdfctxno = this.details.transaction_number;
    this.cashtxno = this.details.transaction_number;
  }
  extrapaymentId :any
  extraChequeDetails(data, paymentId,amount , stage){    
    this.extrapaymentId = paymentId    
    
    // if(this.selectedSet == "order_pipe"){
    //   this.paymentForm.patchValue({ payment_stage: "pre_10_percent" });
    // }
    // this.paymentForm.patchValue({ payment_type: "initial_design" });

    if(stage == 'pre_10_percent'){
      this.paymentForm.patchValue({ payment_type: "initial_design" });
      this.paymentForm.patchValue({ payment_stage: stage });
    }else if(stage == "10_50_percent"){
      this.paymentForm.patchValue({ payment_type: "final_design" });
      this.paymentForm.patchValue({ payment_stage: stage });
    }else{
      this.paymentForm.patchValue({ payment_type: "final_payment" });
      this.paymentForm.patchValue({ payment_stage: stage });
    }
    this.paymentForm.patchValue({ mode_of_payment: "cheque" });
    this.paymentForm.controls["amount"].setValue(amount);
    $("#extreChequeDetails").modal("show");
    $("#paymentHistoryModal").modal("hide");
    if(data !== null){
      data.map((e) => {
        this.AllquotationValues.push(parseInt(e.reference_number.split('/')[3]))
      })
    }else{
      this.AllquotationValues = []
    }
  }
  PaymentHistoryAdjust(data, history, index){
    this.loaderService.display(true)
    if(data !== null){
      data.map((e) => {
        this.AllquotationValues.push(parseInt(e.reference_number.split('/')[3]))
      })
    }else {
      this.AllquotationValues = []
    }
    const sendData = {
      lead_id :this.lead_id,
      quotations_ids : this.AllquotationValues,
      percent : null,
      amount :  history.amount,
      stage : history.payment_stage,
      payment_id : history.id
    }

    if(history.payment_stage === 'pre_10_percent'){
      sendData.percent = 10
    }else if(history.payment_stage === '10_50_percent'){
      sendData.percent = 40
    }else {
      sendData.percent = 100
    }

    this.quotationService.AdjustPayment(this.project_id , sendData).subscribe(
      (res) => {
        
        this.loaderService.display(false)
        this.AllquotationValues = []
        this.successalert = true;
        this.successMessage = "Amount mapped successfully";
        this.getApprovedBoqList()
        this.getMapPayments()
        this.getPaymentHistory()
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );

      },
      (err) => {
        this.loaderService.display(false)
        if (JSON.parse(err._body)["message"]) {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body)["message"];
        }
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
        this.AllquotationValues = []
      }
    )
  }
  closeextraChequeModal(){
    this.paymentReset()
    $("#extreChequeDetails").modal("hide"); 
  }
  typeId;
  getReceipt(type , details) {
    //<---update functionality and
    // $("#PaymentReceipt").modal("hide");
    // $("#paymentHistoryModal").modal("show");
    $(".modal").css("overflow-y", "auto");
    this.loaderService.display(true);
    var tomorrow = new Date(this.ReceiptForm.get("date").value);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let receipt_pdf;
    receipt_pdf = {
      customer_name: details.lead_name
        ? details.lead_name
        : "",
      amount: details.amount
        ? details.amount
        : "",
      bank: details.bank
        ? details.bank
        : "",
      date: details.date
        ? details.date
        : "",
      branch: details.branch
        ? details.branch
        : "",
      rtgs_trx_no: details.transaction_number
        ? details.transaction_number
        : "",
    };

    this.financeService
      .getReceipt(this.projectId, details.id, receipt_pdf, type)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          // $("#PaymentReceipt").modal("hide");
          //  $("#paymentHistoryModal").modal("show");

          var contentType = "application/pdf";
          var b64Data = JSON.parse(res._body)["base_64_file"];
          var name = JSON.parse(res._body)["file_name"];
          var blob = this.b64toBlob(b64Data, contentType, 512);
          var blobUrl = URL.createObjectURL(blob);
          let dwldLink = document.createElement("a");
          let isSafariBrowser =
            navigator.userAgent.indexOf("Safari") != -1 &&
            navigator.userAgent.indexOf("Chrome") == -1;
          if (isSafariBrowser) {
            //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
          }
          dwldLink.setAttribute("href", blobUrl);
          dwldLink.setAttribute("download", name);
          dwldLink.style.visibility = "hidden";
          document.body.appendChild(dwldLink);
          dwldLink.click();
          document.body.removeChild(dwldLink);
          this.successalert = true;
          this.successMessage = "Your File Downloaded Successfully";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
        }
      );
  }

  row = [""];
  expansion: any;
  toggleRow(id) {
    if (this.row[0] !== id) {
      this.row[0] = id;
      this.expansion = id;
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
  }
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
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
  share(type) {
    $("#PaymentReceipt").modal("hide");
    $("#paymentHistoryModal").modal("show");
    $(".modal").css("overflow-y", "auto");
    let receipt_pdf;
    receipt_pdf = {
      customer_name: this.ReceiptForm.get("customer_name").value
        ? this.ReceiptForm.get("customer_name").value
        : "",
      amount: this.ReceiptForm.get("amount").value
        ? this.ReceiptForm.get("amount").value
        : "",
      bank: this.ReceiptForm.get("bank").value
        ? this.ReceiptForm.get("bank").value
        : "",
      date: this.ReceiptForm.get("date").value
        ? this.ReceiptForm.get("date").value
        : "",
      branch: this.ReceiptForm.get("branch").value
        ? this.ReceiptForm.get("branch").value
        : "",
      rtgs_trx_no: this.ReceiptForm.get("rtgs_trx_no").value
        ? this.ReceiptForm.get("rtgs_trx_no").value
        : "",
    };
    this.loaderService.display(true);
    this.financeService
      .getReceipt(this.projectId, this.paymentId, receipt_pdf, type)
      .subscribe(
        (res) => {
          $("#PaymentReceipt").modal("hide");
          this.successalert = true;
          this.successalert = true;
          this.successMessage = JSON.parse(res["_body"]).message;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
          this.loaderService.display(false);
        },
        (err) => {
          //this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
  }
  PaymentModalHide() {
    $("#PaymentReceipt").modal("hide");
    $("#paymentHistoryModal").modal("show");
    $(".modal").css("overflow-y", "auto");
  }

  openPaymentMappingModal() {
    $(".clearPerc").val("0%");
    $(".clearamount").val(0);
    this.show_unuti_amount = this.unutilized_amount;
    $("#unutilizePercentage").val("0%");
  }

  totalBOQAmount: any = 0;
  boqAmountList = [];
  mapProporitionately() {
    this.boqAmountList = [];
    var unUti = parseFloat($("#unutilizePayment").val());
    var amount = 0.0;
    var percentage = 0;
    this.totalBOQAmount = 0;
    if (
      unUti > 0 &&
      this.unmappedData.length > 0 &&
      unUti <= this.unutilized_amount
    ) {
      if (this.unmappedData.length == 1) {
        for (var i = 0; i < this.unmappedData.length; i++) {
          this.totalBOQAmount =
            this.unmappedData[i].total_amount + this.totalBOQAmount;
        }
        for (var i = 0; i < this.unmappedData.length; i++) {
          amount = 0.0;
          percentage = 0;
          //to set amount to BOQ's
          amount = unUti;
          $("#boqPayment" + this.unmappedData[i].id).val(
            Number.parseFloat(amount.toString()).toFixed(4)
          );
          var boqAmt = Number.parseFloat(amount.toString()).toFixed(2);
          var totalAmt = Number.parseFloat(
            this.unmappedData[i].total_amount.toString()
          ).toFixed(2);

          //to set percentage in BOQ's
          percentage = (parseFloat(boqAmt) / parseFloat(totalAmt)) * 100;
          $("#boqPercent" + this.unmappedData[i].id).val(
            Number.parseFloat(percentage.toString()).toFixed(3) + "%"
          );
        }
      } else {
        for (var i = 0; i < this.unmappedData.length; i++) {
          this.totalBOQAmount =
            this.unmappedData[i].total_amount + this.totalBOQAmount;
        }

        for (var i = 0; i < this.unmappedData.length; i++) {
          amount = 0.0;
          percentage = 0;
          //to set amount to BOQ's
          amount =
            unUti *
            (parseFloat(
              Number.parseFloat(
                this.unmappedData[i].total_amount.toString()
              ).toFixed(4)
            ) /
              this.totalBOQAmount);
          $("#boqPayment" + this.unmappedData[i].id).val(
            Number.parseFloat(amount.toString()).toFixed(2)
          );
          var boqAmt = Number.parseFloat(amount.toString()).toFixed(2);
          var totalAmt = Number.parseFloat(
            this.unmappedData[i].total_amount.toString()
          ).toFixed(2);

          //to set percentage in BOQ's
          percentage = (parseFloat(boqAmt) / parseFloat(totalAmt)) * 100;
          $("#boqPercent" + this.unmappedData[i].id).val(
            Number.parseFloat(percentage.toString()).toFixed(3) + "%"
          );

          // this.boqAmountList.push({ 'id': this.unmappedData[i].id, 'amount': Number.parseFloat(boqAmt) });
        }
      }
      $("#unutilizePayment").val(0);
      $("#unutilizePercentage").val("0%");
    }
  }

  //to get percentage of unUtil field input from amount
  getUnutilAmount(value) {
    if (value <= this.unutilized_amount) {
      var getPerc = (value / this.unutilized_amount) * 100;
      $("#unutilizePercentage").val(
        Number.parseFloat(getPerc.toString()).toFixed(3) + "%"
      );
    }
  }

  //to get amount field of unUtil field input from percent
  getUnutilPercentage(value) {
    var getUtilamount = (this.unutilized_amount * value) / 100;
    var getUtilamount = parseFloat(
      Number.parseFloat(getUtilamount.toString()).toFixed(2)
    );
    if (getUtilamount > this.unutilized_amount) {
      alert("amount exceded from Unutilized Payment Available");
    } else {
      $("#unutilizePayment").val(getUtilamount);
    }
  }

  getBoqPayAmount(event, tatalAmount, id) {
    if (
      (event > tatalAmount && event > this.use_total_amt) ||
      Number.parseFloat(this.use_total_amt) === 0
    ) {
      $("#boqPercent" + id).val(0);
      $("#boqPayment" + id).val(0);
    } else {
      let getPercentage = (event / tatalAmount) * 100;
      $("#boqPercent" + id).val(
        Number.parseFloat(getPercentage.toString()).toFixed(3) + "%"
      );

      // this.show_unuti_amount = this.unutilized_amount - event

      // $('#unutilizePayment').val(this.show_unuti_amount);

      // var getPerc = (this.show_unuti_amount / this.unutilized_amount) * 100
      // $('#unutilizePercentage').val(Number.parseFloat(getPerc.toString()).toFixed(3));
    }
  }

  submitMapPayment() {
    this.loaderService.display(true);
    this.boqAmountList = [];
    let b =
      this.selectedSet === "100_percent" ? "final_payment" : this.selectedSet;

    let a = 0;
    for (var i = 0; i < this.approveList.length; i++) {
      if (
        $("#boqPayment" + this.approveList[i].id).val() != undefined &&
        Number.parseFloat($("#boqPayment" + this.approveList[i].id).val()) > 0
      ) {
        a =
          a +
          Number.parseFloat($("#boqPayment" + this.approveList[i].id).val());
        this.boqAmountList.push({
          id: this.approveList[i].id,
          amount: Number.parseFloat(
            $("#boqPayment" + this.approveList[i].id).val()
          ),
        });
      }
    }
    if (a <= this.use_total_amt && a > 0) {
      this.financeService
        .submitMapPayments(this.project_id, this.boqAmountList, b)
        .subscribe(
          (res) => {
            this.successalert = true;
            this.successMessage = "Payment Mapped Successfully!";
            this.loaderService.display(false);
            this.getSet(this.selectedSet);
          },
          (err) => {
            this.erroralert = true;
            this.errorMessage = "Somting went worng";
            this.loaderService.display(false);
          }
        );
    } else if (a == 0 || a < 0) {
      alert("Mapped amount should greater than 0");
    } else {
      for (var i = 0; i < this.approveList.length; i++) {
        $("#boqPayment" + this.approveList[i].id).val(0);
        $("#boqPercent" + this.approveList[i].id).val(0);
      }
      alert("Mapped payment cannot be greater than unutilized amount");
    }
  }

  //
  selectedBoqClosure: any;
  openClosureModal(id) {
    this.selectedBoqClosure = id;
  }
  reportOrderPipeLine(){
    this.loader = true
    this.leadService.reportOrderPipeLine(this.project_id, this.selectedBoqClosure).subscribe(
        (res) => {
          $("#closureModal").modal("hide");
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
    )
  }
  reportClosure(){
    this.loader = true
    this.financeService.approveReportClousure(this.project_id, this.selectedBoqClosure).subscribe(
        (res) => {
          $("#ReportClouser").modal("hide");
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
    )
  }

  reportForBuHead(){
    this.loader = true
    this.leadService.approveOrderPipeLine(this.project_id, this.selectedBoqClosure).subscribe(
        (res) => {
          $("#closureModal").modal("hide");
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
    )
  }

  //
  closureBoq() {
    this.loader = true;
    this.financeService
      .reportClosureFun(this.project_id, this.selectedBoqClosure)
      .subscribe(
        (res) => {
          $("#closureModal").modal("hide");
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
      );
  }

  
  cancelMapping(boqid) {  
    this.loaderService.display(true);
    var paymentStage 
    paymentStage =  this.selectedSet === "100_percent" ? "final_payment" : this.selectedSet;
    // paymentStage =  this.selectedSet === "order_pipe" ? "pre_10_percent" : this.selectedSet;
    this.financeService
      .cancelMappingFun(this.project_id, boqid, paymentStage)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
      );
  }

  openpushToproduction(BoqId) {
    this.selectedBoq = BoqId;
  }

  //
  selectedBoq: any;
  pushToproduction() {
    this.loader = true;
    this.financeService
      .pushToproductionFun(this.project_id, this.selectedBoq)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
          $("#reqpushToprobModal").modal("hide");
        },
        (err) => {
         
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
      );
  }

  selectedfinalpaymentBoq: any;
  openFinalPaymentSelection(BoqId) {
    this.selectedfinalpaymentBoq = BoqId;
  }

  FinalPaymentSelectionYes() {
    this.loader = true;
    this.financeService
      .reportFinalPaymentSelection(
        this.project_id,
        this.selectedfinalpaymentBoq
      )
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
          $("#finalpaymentselectionModel").modal("hide");
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
          this.loader = false;
        }
      );
  }

  

  //new payment APIS
  paymentdetails:any;
  show_unuti_amount: any;
  use_total_amt: any;
  amountAdded_50: any;
  order_booking_actual: any;
  order_confirmation_actual: any;
  estimated_handover: any;
  orderPipeLineDate :any
  getMapPayments() {
    // this.loader = true;
    this.loaderService.display(true)
    this.financeService.getMapPayment(this.project_id).subscribe(
      (res) => {
        // this.loader = false;
        this.loaderService.display(false)

        this.amountAdded_10 = res.total_unutilized_amount_10_percent;
        this.amountAdded_40 = res.total_unutilized_amount_40_percent;
        this.unutilized_amount = res.total_approved_payments;
        this.show_unuti_amount = res.total_approved_payments;
        this.amountAdded_50 = res.total_unutilized_amount_50_percent;
        this.order_booking_actual = res.order_booking_date;
        localStorage.setItem('order_bookingdate',this.order_booking_actual)
        this.orderPipeLineDate = res.initial_order_pipeline_date
        this.order_confirmation_actual = res.order_confirmation_date;
        this.estimated_handover = res.estimated_handover_date;
        this.use_total_amt = this.amountAdded_10;

        if (this.selectedSet == "pre_10_percent") {
          this.use_total_amt = res.total_unutilized_amount_10_percent;
        } else if (this.selectedSet == "10_50_percent") {
          this.use_total_amt = res.total_unutilized_amount_40_percent;
        } else if (this.selectedSet == "100_percent") {
          this.use_total_amt = res.total_unutilized_amount_50_percent;
        } 
         this.paymentdetails=res["quotations"]
      

       
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          3000
        );
        this.loaderService.display(false)
      }
    );
  }
  shouldShowReportClosureButton(id){
    const result = this.paymentdetails.find(item => item.id === id).closure_approved || this.paymentdetails.find(item => item.id === id).closure_reported
    return !result
  }



  acceptClosure(BoqId) {
    this.loader = true;
    this.financeService.acceptClousures(this.project_id, BoqId).subscribe(
      (res) => {
        this.loader = false;
        this.getSet(this.selectedSet);
        this.successalert = true;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          3000
        );
        this.successMessage = res.message;
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          3000
        );
        this.loaderService.display(false);
      }
    );
  }
  loader: boolean = false;
  rejectClosure(BoqId) {
    this.loader = true;
    this.financeService.rejectClosures(this.project_id, BoqId).subscribe(
      (res) => {
        this.loader = false;
        this.getSet(this.selectedSet);
        this.successalert = true;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          3000
        );
        this.successMessage = res.message;
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          3000
        );
        this.loaderService.display(false);
      }
    );
  }

  approvePushtoProduction(BoqId) {
    this.loader = true;
    this.financeService
      .acceptPushtoProduction(this.project_id, BoqId)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
         
        }
      );
  }

  rejectPushtoProduction(BoqId) {
    this.loader = true;
    this.financeService
      .rejectPushtoProduction(this.project_id, BoqId)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
        }
      );
  }

  approveFinalPaymentSelection(BoqId) {
    this.loader = true;
    this.financeService
      .acceptPushtoFinalPaymentCompletion(this.project_id, BoqId)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
        }
      );
  }
  approve40PaymentSelection(BoqId) {
    this.loader = true;
    this.financeService
      .accept40PaymentCompletion(this.project_id, BoqId)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
        }
      );
  }

  rejectFinalPaymentSelection(BoqId) {
    this.loader = true;
    this.financeService
      .rejectPushtoFinalPaymentCompletion(this.project_id, BoqId)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
        }
      );
  }
  reject40PaymentSelection(BoqId) {
    this.loader = true;
    this.financeService
      .reject40PaymentCompletion(this.project_id, BoqId)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
        }
      );
  }
  disableButtonForPayment : boolean = false

  AllquotationValues :any = []
  AllBoqValuesfortenpercent = []
  totalfinalvalues :any
  fortyPaidValues :any
  // forty percent validation

  paidFortyValues : any = []
  finalboq :any
  stageForPaymentForm :any
  sendQuoationId(quotation:any , index:any, boqFinalAmount,e , stage){
    this.stageForPaymentForm = stage
     this.finalboq = boqFinalAmount
    if(e.target.checked){
      if(!this.AllquotationValues.includes(quotation)){
        this.AllquotationValues.push(quotation)
        this.AllBoqValuesfortenpercent.push(parseInt(boqFinalAmount))   ///    quotation.totalamount
        this.paidFortyValues.push((this.finalboq * 0.1 )) ///    quotation.totalamount
        this.stageForPaymentForm = stage
      }
    }else {
      const removeindex = this.AllquotationValues.indexOf(quotation)
      const removefinal = this.AllBoqValuesfortenpercent.indexOf(parseInt(boqFinalAmount))
      const removePaid = this.paidFortyValues.indexOf(parseInt(boqFinalAmount))
      this.AllquotationValues.splice(removeindex,1)
      this.AllBoqValuesfortenpercent.splice(removefinal,1)  ///  quotation.totalamount
      this.paidFortyValues.splice(removePaid,1)
      this.stageForPaymentForm = ''
    }


    if(this.AllquotationValues.length > 0){
        this.disableButtonForPayment = true
    }else{
      this.disableButtonForPayment = false
    }

    var total =0 
    for(var i =0; i<this.AllBoqValuesfortenpercent.length; i++){
     this.totalfinalvalues =  total += this.AllBoqValuesfortenpercent[i]
    }
    var paidtotal = 0
    for(var j =0 ; j<this.paidFortyValues.length ; j++ ){
      this.fortyPaidValues = paidtotal +=this.paidFortyValues[j]
    }

    this.fortyPaidValues = parseInt(this.fortyPaidValues)

  }
  getNewDetails : any
  payment_stage_ten_percent : any
  getNewFetchDetails(){
    this.messeageFortenk = false
    this.paymentForm.controls["mode_of_payment"].setValue("cheque");
    this.paymentForm.controls["cheque_number"].setValue("");


    let typepercent

    if(this.selectedSet == 'pre_10_percent' || this.selectedSet == 'order_pipe' ){
      typepercent = 10
    }else if(this.selectedSet == '10_50_percent'){
      typepercent = 40
    }else {
      typepercent = 100
    }
    this.toggleInputField = false
    this.leadService.getLeadNewFlow(this.project_id, this.AllquotationValues.toString(), typepercent).subscribe(
      (res) => {
        this.getNewDetails = res
        this.totalAmount = this.getNewDetails.total_amount_required.toFixed(2)
        this.LeadNumber = this.LeadNumber
        this.LeadMail = this.LeadMail;
        this.payment_stage_ten_percent = this.getNewDetails['10_per_pending_quotations'][0].payment_stage
      },
      (err) => {
        // this.loaderService.display(false)
      }
    )
  }
  toggleInputField : boolean = false
  enableTheForm(){    
    this.toggleInputField = !this.toggleInputField;
  }
  pipeLineData : any
  orderSet :any
  oderPipeLineData(){      
    this.AllquotationValues = []  
    // this.loader = true;
    this.loaderService.display(true)
    this.leadService.pipeLineData(this.project_id).subscribe(
      (res) => {
        // this.loader = false;
        this.loaderService.display(false)
        this.orderSet = res
        this.paid_amunt_sum = this.orderSet.paid_amount_sum;
        this.total_amunt_sum = this.orderSet.total_amount_sum;
        if(this.selectedSet === 'order_pipe'){
          this.approveList =  this.orderSet.quotations
          this.AllquotationValues = []
          // this.totalfinalvalues = []
          this.AllBoqValuesfortenpercent = []
          this.paidFortyValues = []
        }
      },(err) => {
        this.loaderService.display(false)
      }
    )
  }
  clickOrderPipeLine(){
    this.AllquotationValues = []
    this.disableButtonForPayment = false
    // this.selectedSet = data
    this.oderPipeLineData()
  }
  convertDate(e:any){
    const date = new Date(e);
    date.setDate(date.getDate() + 7);
    return  date
  }

  copyPaymentLink(val:any){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.successalert = true;
    this.successMessage ="Link Copied Successfully";
  setTimeout(
    function () {
      this.successalert = false;
    }.bind(this),
    5000
  );    
  }
  // for testing purpose
  jobrun(){
    this.selectedSet = 'pre_10_percent'
    this.loader = true
    this.leadService.runjob(this.lead_id).subscribe(res => {
      this.loader = false
      this.successalert = true
      setTimeout(
        function () {
          this.successalert = false;
        }.bind(this),
        3000
      );
      this.successMessage = res.message;
      this.getApprovedBoqList();
      this.getMapPayments();
      this.oderPipeLineData()
    }, (err)=> {
    })
  }
  jubrunFortyApprove(id){
    this.loader = true
    this.leadService.runjobForty(id).subscribe(
      (res) => {
        this.loader = false
        this.getApprovedBoqList();
        this.getMapPayments();
        this.oderPipeLineData()
        this.successalert = true;
        this.successMessage = res.message
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) => {
        
        this.loader = false;
        if (JSON.parse(err._body)["message"]) {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body)["message"];
        }
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
      }
    )
  }
  jubrunFortyRemainderjob(){
    this.loader = true
    this.leadService.runjobFortyRemainder(this.lead_id).subscribe(
      (res)=> {
        this.loader = false
        
      },
      (err)=>{
        
      }
    )
  }
  onholdQuotationId :any
  modalReferencenumber :any
  modalId :any
  modaltype : any
  puttheBOQONHold(id, type, referencenum){

    this.modalId = id
    this.modaltype = type

    this.modalReferencenumber = referencenum
    this.onholdQuotationId = id
    this.loader = true
    this.leadService.boqonholdotp(id , type).subscribe(res => {
      if(type == 'hold'){
        $("#on-hlodModal").modal("show");
      }else{
        $("#un-holdmodal").modal("show");
      }
      this.loader = false 
      this.successalert = true
      this.successMessage = res.data.message;
      setTimeout(
        function () {
          this.successalert = false;
        }.bind(this),
        3000
      );
    },(err) => {
      this.loader = false
      this.erroralert = true;
      this.errorMessage = err.data.message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        5000
      );
    })
  }

  resendOTP(){
    this.loaderService.display(true)
    this.leadService.boqonholdotp(this.modalId, this.modaltype).subscribe(res => {
      this.loaderService.display(false)
      this.successalert = true
      this.successMessage = res.data.message;
      setTimeout(
        function () {
          this.successalert = false;
        }.bind(this),
        3000
      );
    },(err) => {
      this.loaderService.display(false)
      this.erroralert = true;
      this.errorMessage = err.data.message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        5000
      );
    })
  }
  // this.leadService
  //     .SubmitEscalation(this.manualEscalationForm.value)
  //     .subscribe((res) => {
  //       this.loaderService.display(false);
  //       this.successError = true;
  //       this.successMessage = res.message;
  //       setTimeout(
  //         function () {
  //           this.successError = false;
  //         }.bind(this),
  //         4000
  //       );
  //       this.clearFormArray(this.notify);
  //       this.getEscalationData("");
  //     });

  onHoldSubmit(){
    this.todayByDate()
    this.onHoldForBOQ.controls["quotation_id"].patchValue(this.onholdQuotationId)
    this.onHoldForBOQ.controls["on_hold_status"].patchValue(true)
    this.loader = true
    this.leadService.onHoldSubmit(this.onHoldForBOQ.value).subscribe((res) => {
      $("#on-hlodModal").modal("hide");
      this.loader = false
      
      this.successMessage = res.data.message
      this.onHoldForBOQ.reset()
      this.getSet(this.selectedSet);
    }, (err) => {
      this.loader = false
      this.erroralert = true
      this.errorMessage = JSON.parse(err._body);
      this.errorMessage = this.errorMessage['data'].message
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        5000
      );
    })
  }

  boqunhold(){
    this.unholdboq.controls["quotation_id"].patchValue(this.onholdQuotationId)
    this.loader = true
    this.leadService.unholdSubmit(this.unholdboq.value).subscribe((res) => {
      $("#un-holdmodal").modal("hide");
      this.unholdboq.reset()
      this.loader = false
      this.successMessage = res.data.message
      this.getSet(this.selectedSet);
    },(err) => {
      this.loader = false
      this.erroralert = true 
      this.errorMessage = JSON.parse(err._body)
      this.errorMessage = this.errorMessage['data'].message
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        5000
      );
    })
  }
  HoldDetails :any
  onHoldDetailsModal(quotation){
    this.loaderService.display(true)
    this.leadService.get_onhold_logs(this.project_id, quotation.id).subscribe((res) => {
      this.loaderService.display(false)
      this.HoldDetails = res.logs
      
    },(err) => {
      this.loaderService.display(false)
    })
    $("#subTableModal").modal("show");
  }
  revert_payment(){
    this.financeService
      .revertFinalPayment(this.project_id, this.selectedfinalpaymentBoq)
      .subscribe(
        (res) => {
          this.loader = false;
          this.getSet(this.selectedSet);
          this.successalert = true;
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
          this.successMessage = res.message;
        },
        (err) => {
          this.loader = false;
          this.erroralert = true;
          this.errorMessage =JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            3000
          );
        }
      );

  }
  p2p_id=''
  PtoP(id){
    this.p2p_id = id
  }
}