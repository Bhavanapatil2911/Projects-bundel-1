import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $:any;

@Component({
  selector: 'app-cm-wip',
  templateUrl: './cm-wip.component.html',
  styleUrls: ['./cm-wip.component.css'],
  providers: [CommunitymanagerService,SchedulerService,DesignerService,LeadService]
})
export class CmWipComponent implements OnInit {
  @ViewChild('otpForm') otpForm: ElementRef;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  CMId : string;
  usersList;
    userData ;
  assignedDesignerId = [];
  projecttask_name = [];
  projecttask_id = [];
  projecttask_duration = [];
  projecttask_action_point = [];
  projecttask_process_owner = [];
  projecttask_percent_completion = [];
  projecttask_previous_dependency = [];
  projecttask_remarks =[];
  projecttask_start_date  = [];
  projecttask_end_date = [];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  errorMessagemodal : string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal : string;
  updateProjectTaksForm: FormGroup;
  startDateForGanttChart : Date;
  endDateForGanttChart : Date;
  updateLeadquestionnaireForm : FormGroup;
  designerBookingForm1: FormGroup;
  project:any;
  lead_status;
  designersList;
  statusDetails: any = {};
  wipList:any = [];

  custom_status:string;
  headers_res;
  per_page;
  total_page;
  current_page;
  search_value: any;
  current_user_id: any;
  todayDate: any;
  dropLeadForm:FormGroup;
  userRole :any
  cm_list: any;
  sm_list :any
  role: string;
  CM: any;
  SM: any;
  constructor(
    private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private schedulerService : SchedulerService,
    private designerService:DesignerService,
    private route:ActivatedRoute
  ) { 
      this.CMId = localStorage.getItem('userId');
      this.userRole = localStorage.getItem('user');
    }


  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    var  i=0;
    if(true){
      this.getWipList('',this.search_value);
      i++;
    }

  }
  searchCM:any;
  searchSM:any;
  filterbyCm(val , type){

    if(type == 'cm'){
      this.searchCM=val ;
      this.getWipList('',this.search_value,this.searchCM);
    }else{
      this.getCMList() 
      this.searchSM = val
      this.searchCM=null ;
      this.getWipList('',this.search_value,this.searchSM);
    }
  }
  

  // getCMList(cmid){
  //   this.cmService.getFiterListOfCM(cmid).subscribe(
  //     (res)=>{
  //       this.cm_list=res["cms"]
  //       this.sm_list = res["sales_managers"]
  //     }
  //   )

  // }
 
  ngOnInit() {

    this.role = localStorage.getItem('user');
    this.route.queryParams.subscribe(params => {
        this.custom_status = params['customer_status'];
        
      });
      localStorage.setItem('customer_status', this.custom_status)
    this.route.queryParams.subscribe(params => {
        this.designer_id = params['designer_id'];
     });
     this.route.queryParams.subscribe(params => {
      this.searchCM = params['searchCM'];
      
    });

    this.route.queryParams.subscribe(params => {
      this.searchSM = params['searchSM'];
      
    });


    this.getCMList()
    // this.getSMList()
    this.getWipList(1);
    this.loaderService.display(true);
    this.current_user_id = localStorage.getItem('userId');
    this.todayDate = new Date().toISOString().substring(0,16);
    this.createForm();
  }
  direction: number;
  isDesc: boolean = true;
  column: string;
  // Change sort function to this: 
  sort(property){
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      this.direction = this.isDesc ? 1 : -1; 
  }    
  page_number;
  score:any ='';
  showChangeStatus:any=true;
  getWipList(page?,search?,CM?){
    var ppmr  ;
    if(this.filtercol1Val == "pending"){
       ppmr = "pending";
    } 
    else{
      ppmr ="";
    }

    if(this.CMId === undefined){
      this.CMId = ''
    }

    if(this.custom_status === undefined){
      this.custom_status = ''
    }

    if(this.designer_id === undefined){
      this.designer_id = ''
    }

    if(this.search_value === undefined){
      this.search_value = ''
    }

    if(this.searchCM === undefined || this.searchCM == null){
      this.CM = ''
    }
    else{
      this.CM=this.searchCM
    }
    if(this.searchSM === undefined || this.searchSM == null){
      this.SM = ''
    }
    else{
      this.SM=this.searchSM
    }
    if(this.score === undefined){
      this.score = ''
    }
    if(this.bu_approval === undefined){
      this.bu_approval = ''
    }

    if(page === undefined){
      page = 1
    }
     
    this.page_number = page;
    this.loaderService.display(true);
    this.cmService
      .getWipList(
        this.CMId,
        this.custom_status,
        this.designer_id,
        page,
        this.search_value,
        this.CM,
        this.SM,
        ppmr,
        this.score,
        this.bu_approval,
        this.categoryFilterBucket,
        this.categoryFilterBucket,
        this.categoryFilter,
      )
      .subscribe(
        (res) => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");

          res = res.json();
          // this.usersList = res.leads;
          this.wipList = res.leads;
          // console.log(this.wipList[0].project_status);
          if(this.wipList.length>0){
            this.showChangeStatus=this.wipList[0].project_status;
                  }
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  bu_approval :any
  buheadApprovalFilter(){
    this.bu_approval = true
    this.getWipList()
  }


  onCallbackChange2(){
      this.loaderService.display(true);
      $("#statusModal2").modal("hide");
      this.statusDetails['remarks']= $("#inactive_remarks").val();
      this.statusDetails['reason_for_lost']=$("#inactive_reason").val();
      this.dropdownDropType='Select Reason';
      this.updateNewStatus();
  }  

  getCMList(){
    if(this.role == 'area_sales_manager'){

      this.cmService.getFilterListofWIPCM(this.searchSM).subscribe(
        (res)=>{
          this.cm_list=res["cms"]
          this.sm_list=res["sales_managers"]
        },
        (err) => {
          
        }
      )
    } else{

      if(this.role == 'deputy_general_manager'){

        this.cmService.getFilterListofWIPCMForDM().subscribe(
          (res)=>{
            this.cm_list=res;
          },
          (err) => {
            
          }
        )

      }

     

    }
   

  }

  // getSMList(){
  //   this.leadService.getSalesManagerList().subscribe(
  //     (res) => {
  //       this.sm_list=res["sales_managers"]

  //     },
  //     (err) => {
  //       console.log(err)
  //     }
  //   )
  // }

  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
           this.loaderService.display(false);
          if(res.inhouse_call.call_response.code == '403'){
            this.erroralert = true;
            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 10000);
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
          }
        },
        err => {
          this.loaderService.display(false);
        }
     );
  }

  projectId:any;
  customerId:any;
  costumerDetails

  onStatusChange(projectId,customerId, status,obj){
    this.remarks_reopening = '';
   
      this.dropdownDropType1 = '';
    this.costumerDetails = obj
    this.is10percentDone = obj.lead_10_percent_done;
    this.statusDetails["customer_status"] = status;
    // this.statusDetails["customer_remarks"] = "";
    // this.statusDetails["customer_meeting_time"] = "";
    this.statusDetails["customer_id"] = customerId;
    this.statusDetails["project_id"] = projectId;
    this.projectId= projectId;
    this.customerId=customerId;
    this.loaderService.display(true);

    if(this.statusDetails["customer_status"] == "on_hold"){
      $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
      this.loaderService.display(false);
      $("#statusModal").modal("show");


    }
    else if(this.statusDetails["customer_status"] == "inactive"){
        
        this.loaderService.display(false);
        $("#statusModal2").modal("show");
      }
      
    else{
      this.loaderService.display(false);
      if(this.role == 'business_head' || !this.is10percentDone){
        this.updateNewStatus();
      } else{
        $("#OtpModalCheck").modal("show");
    
      }
     
    }
  }

  onSubStatusChange(projectId,customerId, substatus){
    this.statusDetails["sub_status"] = substatus;
    // this.statusDetails["customer_remarks"] = "";
    // this.statusDetails["customer_meeting_time"] = "";
    this.statusDetails["customer_id"] = customerId;
    this.statusDetails["project_id"] = projectId;
    this.projectId= projectId;
    this.customerId=customerId;
    this.loaderService.display(true);
    
    this.designerService.subStatusUpdate(this.statusDetails,this.CMId).subscribe(
      res => {

        this.getWipList(1);
        this.successalert = true;
        this.successMessage = 'Status updated successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
          
      },
      err => {

        this.erroralert = true;
        this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 2000);

      }
    )

  }

  SendOTP(){
    $("#OtpModal").modal("show");
    $("#OtpModalCheck").modal("hide");
    this.inputs.forEach(input => {
      input.value = ''; 
    });
    this.ShareOtp()
    
  }
  isProjectInWipAndActive(status):boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation"]
    if(wip_array.includes(status)){
      return true
    }
    else{
      return false
    }
  }
  inputs =[]
 

  handleInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    if (target.value && index < this.inputs.length - 1) {
      this.inputs[index + 1].focus();
    }
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab') {
      event.preventDefault();
    }
    
    if (event.key === 'Backspace' && index === 0 && !this.inputs[index].value) {
        return; // Prevent deleting if the first input is empty
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (index > 0 && !this.inputs[index].value) {
        this.inputs[index - 1].value = '';
        this.inputs[index - 1].focus();
      }
    
    }

//     if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
//       // Simulate a paste event
//      // Create a temporary textarea element
// // Create a temporary textarea element
// var textarea:any = document.createElement('textarea');

// // Set its contenteditable attribute to true to enable editing
// textarea.contentEditable = true;

// // Append the textarea to the DOM
// document.body.appendChild(textarea);

// // Focus the textarea
// textarea.focus();

// // Execute the paste command to retrieve clipboard content
// document.execCommand('paste');

// // Retrieve the clipboard content from the textarea after a delay
// setTimeout(function() {
//     var clipboardText = textarea.value;
//     console.log('Clipboard text:', clipboardText);

//     // Remove the textarea from the DOM
//     document.body.removeChild(textarea);
// }, 500); // Wait for 500 milliseconds (adjust as needed)


//     }
}


  handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    target.select();
  }

  handlePaste(event: ClipboardEvent): void {

    // console.log(event, event.clipboardData?.getData('text'),'clipboard')
    event.preventDefault(); 
    

    // console.log(event, event.clipboardData.getData('text') )
    // // var text = event.clipboardData?.getData('text') || '';
  
    // if (!new RegExp(`^[0-9]{${this.inputs.length}}$`).test(event.clipboardData.getData('text'))) {
    //   return; 
    // }
    
    // const digits = event.clipboardData.getData('text').split(''); 
    
 
    // digits.forEach((digit, index) => {
    //   if (this.inputs[index]) { 
    //     this.inputs[index].value = digit; // Populate input field with the digit
    //   }
    // });
    
    
  }
  
  otpValue  =''
  DisXla(){
    return  this.otpValue = this.inputs.map(input => input.value).join('');
  }
  Submit(){
   console.log(this.otpValue);

   this.loaderService.display(true)
   this.designerService.VerifyOtp(this.projectId,this.otpValue).subscribe(res=>{
    $("#OtpModal").modal("hide");
    if(this.statusDetails['customer_status'] != 'extend_on_hold'){
      this.updateNewStatus()
    } else{
      this.reschedule_onhold()
    }

    this.successMessage = 'OTP verification Done';
     console.log("hi")
     
 
   },
   err=>{
     this.loaderService.display(false)
     this.erroralert = true;
     this.loaderService.display(false);
       this.errorMessage = JSON.parse(err['_body']).message;
       setTimeout(function() {
            this.erroralert = false;
       }.bind(this), 2000);
 
   
 
   })
  }


ShareOtp(){

  this.inputs.forEach(input => {
    input.value = ''; 
  });
  this.loaderService.display(true)
  console.log(this.statusDetails)
  let obj = {
    customer_meeting_time : this.statusDetails["customer_meeting_time"],
    reason_for_lost : this.statusDetails["reason_for_lost"],
    remarks :  this.statusDetails["remarks"]
  }
  this.designerService.ShareOtp(this.projectId,this.statusDetails["customer_status"],obj,this.ExtendObj).subscribe(res=>{
    
    this.successalert = true;
    this.successMessage = res.message;
    setTimeout(function() {
           this.successalert = false;
      }.bind(this), 2000);

      this.loaderService.display(false)

  },
  err=>{
    this.loaderService.display(false)
    this.erroralert = true;
    this.loaderService.display(false);
      this.errorMessage = JSON.parse(err['_body']).message;
      setTimeout(function() {
           this.erroralert = false;
      }.bind(this), 2000);

  

  })

}
is10percentDone:any
  onCallbackChange(){
   
 
    $("#statusModal").modal("hide");

    this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
    this.statusDetails['reason_for_lost']=this.dropdownDropType1;
    this.statusDetails['remarks']= $("#followup_remarks").val();
   
    this.remarks_reopening = '';
    this.date_reopening = '';
    this.dropdownDropType1 = '';
    if(this.role == 'business_head' || !this.is10percentDone){
      this.loaderService.display(true);
      this.updateNewStatus();
    } else{
      $("#OtpModal").modal("show");
      this.inputs.forEach(input => {
        input.value = ''; 
      });
      this.ShareOtp()
  
    }
  }
  resendMagicLink(data:any){
    this.designerService.resendmagic(data).subscribe(res=>{ 
      this.successalert = true;
       this.successMessage = 'Magic Link successfully Sent to Customer Email'; 
       setTimeout(function()
        { this.successalert = false;
         }.bind(this), 4000); }) 
       }

  updateNewStatus(){
    this.designerService.statusUpdate(this.statusDetails,this.CMId).subscribe(
      res => {
        this.loaderService.display(false)
        this.getWipList(1);
        this.successalert = true;
        this.successMessage = 'Status updated successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
          
      },
      err => {

        this.erroralert = true;
        this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 2000);

      }
    )
  }

  AlreadyOTP(){
   
    this.dropdownDropType1 = '';
    $("#OtpModal").modal("show");
    this.inputs.forEach(input => {
      input.value = ''; 
    })
    $("#statusModal").modal("hide");
    $("#statusModal3").modal("hide");
    $("#OtpModalCheck").modal("hide");

    if(this.statusDetails['customer_status'] == 'on_hold'){
      this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
      this.statusDetails['reason_for_lost']=this.dropdownDropType1;
      this.statusDetails['remarks']= $("#followup_remarks").val();
     
      this.remarks_reopening = '';
      this.date_reopening = '';
    } 
    if(this.statusDetails['customer_status'] == 'extend_on_hold'){
      this.ExtendObj['reason_for_lost'] = this.remarks_details;
      this.ExtendObj['scheduled_at'] = this.date_details


    }
   
  }
  openpopup(event, id) {
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });
   
    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    }) 
  }

  
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  
  ngAfterViewInit(){

    this.inputs = Array.from(this.otpForm.nativeElement.querySelectorAll('input[type=text]'));
    this.inputs.forEach((input, index) => {
      input.addEventListener('input', (event) => this.handleInput(event, index));
      input.addEventListener('keydown', (event) => this.handleKeyDown(event, index));
      input.addEventListener('focus', (event) => this.handleFocus(event));
      input.addEventListener('paste', (event) => this.handlePaste(event));
    });


    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }

  to_date;
  from_date;
  filtercol1Val : any = 'all';
  DesignerID
  filterColumDropdownChange(colVal) {
    this.bu_approval = ''
    // this.from_date = undefined;
    // this.to_date = undefined;
    
    if (colVal == "all" || colVal == "pending") {
      this.filtercol1Val = colVal;
      this.designer_id = "";
      this.from_date = "";
      this.to_date = "";
      this.score = "";
      // document.getElementById("fromDateFilter").classList.add("d-none");
      // document.getElementById("toDateFilter").classList.add("d-none");
      this.filterSubmit();
     
    } else if (colVal == "list_designer") {
      this.filtercol1Val = colVal;
      this.myDesigners();
      this.DesignerID =''
      // document.getElementById("fromDateFilter").classList.add("d-none");
      // document.getElementById("toDateFilter").classList.add("d-none");
      document.getElementById("designer_list").setAttribute("style", "display:inline-block");
      this.score = "";
    }
    else{
      this.designer_id = "";
      this.from_date = "";
      this.to_date = "";
      this.score = true
      this.filtercol1Val = 'all';
      // document.getElementById("fromDateFilter").classList.add("d-none");
      // document.getElementById("toDateFilter").classList.add("d-none");
      // document.getElementById("designer_list").setAttribute("style", "display:none");
      this.filterSubmit()
      
    }
    
  }

  my_designers;
  designer_id;
  myDesigners(){
    this.loaderService.display(true);
    this.cmService.getListOfDesigner(this.current_user_id).subscribe(
      res => {
        this.my_designers = res.users;
        this.designer_id = this.my_designers[0]["id"];
        
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  onDesignerFilterSelect($event){
    this.designer_id = $event.target.value
    this.filterSubmit();
  }

  filterSubmit(){
    if (this.filtercol1Val == "all" || this.filtercol1Val =="pending") {
      this.getWipList(1, this.search_value);
    } else {
      this.getWipList(this.page_number);
    }
  } 
  dropdownDropType;
    submitDropLeadType(type){
      this.dropdownDropType=type;
      //this.dropLeadForm.controls['drop_reason'].setValue(this.dropdownDropType);
    }

    remarks_reopening;
    date_reopening;
    dropdownDropType1;
    submitDropLeadType1(type) {
      this.dropdownDropType1=type;
    }
  
  project_id;
  project_id2;
  email_id;
  reschedule_onholdevent(event,event2,email,obj) {

    this.statusDetails["customer_status"] = 'extend_on_hold'
    this.costumerDetails = obj
    this.project_id = event;
    this.projectId = event;
    this.project_id2 = event2;
   this.is10percentDone = obj.lead_10_percent_done
    this.email_id = email;
    $("#modal_date").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
    $("#statusModal3").modal("show");
    }
  date_details;
  remarks_details;
  ExtendObj = {}
  reschedule_onholdsubmit(){
    if(this.role == 'business_head' || !this.is10percentDone){
      this.reschedule_onhold()
    } else{
      $("#statusModal3").modal("hide");
      $("#OtpModal").modal("show");
      this.inputs.forEach(input => {
        input.value = ''; 
      });
    this.ExtendObj['reason_for_lost'] = this.remarks_details;
    this.ExtendObj['scheduled_at'] = this.date_details
      this.ShareOtp()
    }
  }
  reschedule_onhold() {
    this.leadService.updateonholdEvent(this.project_id2,this.project_id,this.date_details, this.remarks_details,this.email_id).subscribe(res => {
      this.loaderService.display(false)
      this.successalert = true;
      this.statusDetails["customer_status"] = undefined
      this.successMessage = 'Rescheduled successfully!';
      setTimeout(function() {
             this.successalert = false;
      }.bind(this), 2000);
    $("#statusModal3").modal("hide");
      this.getWipList(1,'');
    },
    err => {
      this.loaderService.display(false)
      this.erroralert = true;
      this.loaderService.display(false);
        this.errorMessage = 'Failed to Update';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);

    })
  }
  
  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }


  createForm(){
      this.dropLeadForm = this.formBuilder.group({
        reason: new FormControl("",Validators.required),
        reason_for_drop:new FormControl("",Validators.required),
        reason_remark:new FormControl("")
      })
  }
  dropdownDropreason;
  submitDropLeadType2(type){    
    this.dropdownDropType=type;
    this.dropLeadForm.controls['reason_for_drop'].setValue(this.dropdownDropType);
    this.dropdownDropreason = undefined;
    this.dropLeadForm.controls['reason'].setValue("");
    this.dropLeadForm.controls['reason_remark'].setValue("");
    if(type == 'others'){
    this.dropLeadForm.controls['reason_remark'].setErrors(null);
    this.dropLeadForm.controls['reason_remark'].updateValueAndValidity
    }
  }

  dropdownDropremark;
  submitDropLeadTypeReason(type){
    console.log("jjjj");
    this.dropdownDropreason=type;
    this.dropdownDropremark = undefined;
    this.dropLeadForm.controls['reason'].setValue(type);
    console.log(this.dropLeadForm.controls['reason'].value)
    this.dropLeadForm.controls['reason_remark'].setValue("");
    if(type == 'fhi' || type == 'phi' || type == 'only_on_site-services_execution' ){
      this.dropLeadForm.controls['reason_remark'].setValidators(Validators.required)
      this.dropLeadForm.controls['reason_remark'].updateValueAndValidity
    } else{
      this.dropLeadForm.controls['reason_remark'].setErrors(null)
      this.dropLeadForm.controls['reason_remark'].updateValueAndValidity

    }
  }

  submitDropLeadTypeSub(type){
    this.dropdownDropremark=type;
    this.dropLeadForm.controls['reason_remark'].setValue(type);
  }

  abcd:any={};
  dropleadId;
  updateStatus(formval){
    $("#statusModal2").modal("hide");
    this.abcd=formval;
    this.loaderService.display(true);
    this.designerService.updateCancelledStatus(this.CMId,this.abcd,this.customerId,this.projectId).subscribe(
        res => {

          this.getWipList(1);
          this.successalert = true;
          this.successMessage = 'Status updated successfully!';
          setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 2000);
            
        },
        err => {
  
          this.erroralert = true;
          this.loaderService.display(false);
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 2000);
  
        }
      );
  }
  onCancelRemarkModalClose(){
    this.dropLeadForm.controls['reason_for_drop'].setValue('');
    this.dropLeadForm.controls['reason'].setValue("");
    this.dropLeadForm.controls['reason_remark'].setValue("");
    this.dropdownDropreason='';
  }
  leadApproveReject(id , status){
    this.leadService.leadCancelApproveReject(id , status).subscribe(res => {
      this.successalert = true;
      this.successMessage = res.message;
      setTimeout(function() {
             this.successalert = false;
        }.bind(this), 2000);
        this.getWipList(1);
    }, err => {
      console.log(err)
    })
  }
  categoryFilter =' '
  categoryFilterBucket =' ';
  searchCategoryProjects(){
    this.filterSubmit()
  }
  changeBucket(){
    this.categoryFilter = ' '
    this.filterSubmit()
  }
  Clearfilter(){
    this.categoryFilter = ''
    this.categoryFilterBucket = '';
this.score='';
    this.bu_approval='';
    this.filtercol1Val = 'all';
    this.designer_id='';
    this.search_value=''
    this.nameOFSelect = 'Select Category Bucket'
    this.filterSubmit()
  }
colorgetter(cat){
if(cat == 'solis'){
  return 'red'
} else if(cat == 'lux'){
  return 'blue'
} else if(cat =='asta'){
  return 'yellow'
} else if(cat =='nesta'){
  return 'green'
}
  }
  showUl = false;
  ChildUlv = ''
  openUl(){
    this.showUl  = !this.showUl;
    if(!this.showUl){
      this.ChildUlv = '';
      this.categoryFilterBucket = ''
      this.categoryFilter = ''
    }
     
  
  }
  
  row =['']
    Selectparent(ul){
     console.log(this.ChildUlv,ul)
      if(this.row[0] != ul ){
        this.condiTA = true;
        this.row[0] = ul
        
      } else{
        this.condiTA = false
        this.row[0] = ''
        this.nameOFSelect ='Select Category Bucket'
      }
      console.log(this.ChildUlv,ul)
   
      this.ChildUlv = ul;
      this.categoryFilterBucket = ul
      this.categoryFilter = ''
      console.log(ul)
      
      if(ul ==''){
        this.nameOFSelect ='Select Category Bucket'
        this.changeBucket()
      }
     
    }
  nameOFSelect = 'Select Category Bucket'
  Setparam(li){
    this.categoryFilter = li
    this.showUl  = false;
    this.searchCategoryProjects()
    let cutString1 = this.categoryFilterBucket.substring(0, 2);



let cutString2 = this.categoryFilter .substring(3);

// Concatenate the two modified strings
if(cutString1=='ob'){
  cutString1='Order Booking'
}
else{
  cutString1='Order Confirmation'
}
cutString2 = cutString2 == ''?'All' :cutString2
this.nameOFSelect = cutString1 +'-'+ cutString2;
  }
  clearUl(){
    this.ChildUlv = '';
    this.categoryFilterBucket = ''
    this.categoryFilter = ''
    this.showUl = false;
    this.nameOFSelect = 'Select Category Bucket'
    this.searchCategoryProjects()

  }


  condiTA = false;
  NumerFormat(num) {
    let contact = num
    let firstTwo = contact.slice(0, 2);
    let lastTwo = contact.slice(-2);
    let middleStars = '*'.repeat(contact.length - 4); // Subtracting 4 to account for the first two and last two letters
    let maskedContact = firstTwo + middleStars + lastTwo;

    return maskedContact

  }
  EmailFormat(emai){
    let email = emai;
let firstThree = email.slice(0, 3);
let lastFour = email.slice(-4);
let maskedEmail = firstThree + '****@****' + lastFour;


return maskedEmail

  }
 
}