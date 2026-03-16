import { Quotation } from './../../quotation/quotation';
import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { ProjectService } from '../../project/project/project.service';
import { FloorplanService } from '../../floorplans/floorplan/floorplan.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;
@Component({
  selector: 'app-obto-octrack',
  templateUrl: './obto-octrack.component.html',
  styleUrls: ['./obto-octrack.component.css'],
  providers: [LeadService, ProjectService, FloorplanService],
})
export class ObtoOctrackComponent implements OnInit {
  erroralert;
  erroralert1;
  errorMessage;
  successalert = false;
  successalert1 = false;
  successMessage: string;
  emailverified:boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public leadService: LeadService,
    public loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private floorplanService: FloorplanService
  ) { }
  lead_id
  lead_status;
  lead_details
  role
  createClassificationsForm: FormGroup;
  createClassificationactualForm: FormGroup;
  createClassificationForm: FormGroup;
  createClassificationsactualForm: FormGroup;
 
  msgError: boolean = false;
  successError: boolean = false;
  current_user_id:any;
  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
    });
    this.route.queryParams.subscribe((params) => {
      this.lead_status = params["lead_status"];
    });
    this.role = localStorage.getItem("user");
    this.emailverified = localStorage.getItem('emailverified') === 'true';
    this. fetchBasicDetails();
    this.createClassificationForm = this.formBuilder.group({
      date_detail: new FormControl(""),
      select_value: new FormControl(""),
      note_detail: new FormControl("", [Validators.required]),
    });
    this.createClassificationactualForm = this.formBuilder.group({
      date_detail: new FormControl(""),
      note_detail: new FormControl("", [Validators.required]),
    });
    this.createClassificationsForm = this.formBuilder.group({
      date_details: new FormControl(""),
      select_values: new FormControl("", [Validators.required]),
      note_details: new FormControl("", [Validators.required]),
    });
    this.createClassificationsactualForm = this.formBuilder.group({
      date_details: new FormControl(""),
      note_details: new FormControl("", [Validators.required]),
    });
    this.current_user_id = localStorage.getItem("userId");
    this.role = localStorage.getItem("user");
  
  }
leadDetails:any ={
  Lead_id:'',
  tab_type:'',
  lead_name:''
  
}
data
  project_id;
  is_before_email_verify:any=true
  fetchBasicDetails() {
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res["lead"];
        this.project_id = res["lead"].project_details.id;
        this.leadDetails['lead_name'] = res.lead.name
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        if(this.lead_details.project_status == 'completed'){
         this.leadDetails['Lead_id'] = res.lead.id
         this.leadDetails['tab_type'] = 'Handover'
        } else{
          this.leadDetails['Lead_id'] = res.lead.id
          this.leadDetails['tab_type'] = 'ZeroToForty'
        }
           console.log(this.leadDetails)
        
           if(this.leadDetails.tab_type == 'ZeroToForty'){
            this.getBOQZeroList( this.leadDetails.Lead_id)
          }else{
            this.getBOQFiftyList(this.leadDetails.Lead_id)
          }
          this.getValidReason();
      },
      (err) => {}
    );
  
  }

 
  SearchString: any = "";
  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      2000
    );
  }
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      2000
    );
  }

  
  cascading_items =[]
  LeadNoc:any=[]

  getBOQZeroList(leadId: any) {
    this.cascading_items = [];
    
    this.leadService.getBOQZeroList(leadId).subscribe((response) => {
      this.cascading_items = response.quotations;
      this.LeadNoc[0] = response.lead_details.lead_noc_datum
    if(this.cascading_items.length > 0 && !this.activeBoq){
      this.activeBoq = this.cascading_items[0].id
      this.boqNumber = this.cascading_items[0].boq_no
      this.boq_type = this.cascading_items[0].boq_type
      
      // this.obj = this.cascading_items[0];
      this.getQotationDataList(this.activeBoq)
    }
       
      console.log(this.cascading_items)
      if (response.quotations.length === 0) {
       
        alert("No BOQ Data Present");
       
      } else {
       
      }
    });
  }

  closeonemodal() {
    $("#expectedDateModal").modal("hide");
    this.createClassificationForm.reset();
  }

  closetwomodal() {
    $("#expectedDatesModal").modal("hide");
    this.createClassificationsForm.reset();
  }

  closetwomodal2() {
    $("#expectedDatesActualModal").modal("hide");
  }

  getBOQFiftyList(leadId: any) {
    this.cascading_items = [];
    
    this.leadService.getBOQFiftyList(leadId,this.leadDetails.tab_type).subscribe((response) => {
      this.cascading_items = response.quotations;
      this.LeadNoc[0] = response.lead_details.lead_noc_datum
      
    if(this.cascading_items.length > 0 && !this.activeBoq){
      this.activeBoq = this.cascading_items[0].id
      this.boqNumber = this.cascading_items[0].boq_no
      this.boq_type = this.cascading_items[0].boq_type
      // this.obj = this.cascading_items[0];
      this.getQotationDataList(this.activeBoq)
    }
       
      console.log(this.cascading_items)
      if (response.quotations.length === 0) {
       
        alert("No BOQ Data Present");
       
      } else {
       
      }
    });
  }

  cascading_items_obj:any
  getQotationDataList(qId: any) {
    this.cascading_items_obj = {};

    this.loaderService.display(true)
    
    this.leadService.getQotationDataList(qId).subscribe((response) => {
      this.cascading_items_obj = response.quotation;
      this.loaderService.display(false)
    // if(this.cascading_items.length > 0){
      // this.activeBoq = this.cascading_items[0].id
      this.obj = this.cascading_items_obj;
      console.log('this.obj', this.obj);
    // }
    });
  }

  expandLead:any = false;
  onClickLeadRow(){
    this.expandLead = !this.expandLead
  }

  activeBoq:any;
  minLen:any = -1;
  maxLen:any = 5;
  boqNumber:any;
  boq_type:any;
  BoqClickFun(data){
    this.boqNumber = data.boq_no
    this.boq_type = data.boq_type
    this.activeBoq = data.id
    this.getQotationDataList(this.activeBoq)
    // this.obj = data;
    // console.log(this.obj)

  }
  obj:any
  rightClick(){

    this.minLen = this.minLen + 5

    this.maxLen = this.maxLen + 5

  }
  leftClick(){

    this.minLen = this.minLen - 5

    this.maxLen = this.maxLen - 5
  }
  openpopup(event) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }

  reason_list;
  getValidReason() {
    this.leadService.getValidReason().subscribe((res) => {
      this.reason_list = res.data;
    });
  }

  dateDetailss(data) {
    this.loaderService.display(true);
    this.leadService
      .changeLeadDate(
        this.leads,
        this.ownrable_ids,
        this.boq_display_date,
        data.date_details,
        data.select_values,
        data.note_details
      )
      .subscribe((res) => {
        $("#expectedDatesModal").modal("hide");
        $("#fmailsModal").modal("hide");
        this.loaderService.display(false);
        if(this.leadDetails.tab_type == 'ZeroToForty'){
          this.getBOQZeroList( this.leadDetails.Lead_id)
        }else{
          this.getBOQFiftyList(this.leadDetails.Lead_id)
        }
        this.successError = true;
        this.createClassificationsForm.reset();
        this.successMessage = "Date has been Updated";
        this.createClassificationsForm.reset();
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          3000
        );
        this.getQotationDataList(this.activeBoq)
      });
  }

  dateDetailssactual(data) {
    this.loaderService.display(true);
    this.leadService
      .changeLeadActualDate(
        this.leads,
        this.ownrable_ids,
        this.boq_display_date,
        data.date_details,
        data.note_details
      )
      .subscribe(
        (res) => {
          $("#expectedDatesActualModal").modal("hide");
          $("#fmailsModal").modal("hide");
          this.loaderService.display(false);
          if(this.leadDetails.tab_type == 'ZeroToForty'){
            this.getBOQZeroList( this.leadDetails.Lead_id)
          }else{
            this.getBOQFiftyList(this.leadDetails.Lead_id)
          }
          this.successError = true;
          this.createClassificationsactualForm.reset();
          this.successMessage = "Date has been Updated";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            3000
          );
          this.show_actual_value_boq = false;
          this.getQotationDataList(this.activeBoq)
        },
        (err) => {
          this.msgError = true;
          this.errorMessage = JSON.parse(err["_body"]).message[0];
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            3000
          );
          this.loaderService.display(false);
        }
      );
  }

  boq_ideal_date;
  boq_expect_date;
  boq_actual_date;
  boq_display_date;
  boq_display;
  boq_display_val;
  boq_detail_obj;
  show_expect_value_boq: boolean = false;
  show_actual_value_boq: boolean = false;
  log_boq_value: any = "";
  show_boq_val: boolean = false;
  boqPoData: any = [];
  RawMaterialDataBoq: any = [];
  deleayd_days: any = "";
  deleayd_days_boq: any = "";
  boq_data:any;
  boq_data2:any;
  ownrable_ids:any;
  index:any;
  fortyquoteData:any;
  
  getNodeDetailBOQ(event, event2, event3, event4, event5, delayed, event6) {
    this.deleayd_days_boq = delayed;
    this.boqPoData = [];
    this.RawMaterialDataBoq = [];
    this.show_expect_value_boq = false;
    this.show_actual_value_boq = false;
    this.boq_ideal_date = event.ideal;
    this.boq_expect_date = event.expected;
    this.boq_actual_date = event.actual;
    this.boq_display_date = event2;
    this.boq_display = event2;
    this.boq_display_val = event2;
    this.log_boq_value = event5;
    if (this.boq_display_date === "MKW Start Date") {
      this.boq_display_date = "MKW Start";
    }
    if (this.boq_display_date === "MKW Ready Date") {
      this.boq_display_date = "MKW Ready";
    }
    if (this.boq_display_date === "MKW Dispatch Date") {
      this.boq_display_date = "MKW Dispatch";
    }
    if (this.boq_display_date === "MKW Delivered Date") {
      this.boq_display_date = "MKW Delivered";
    }
    if (this.boq_display_date === "FHI Delivered' Date") {
      this.boq_display_date = "FHI Delivered'";
    }
    if (this.boq_display_date === "MTO Delivered Date") {
      this.boq_display_date = "MTO Delivered";
    }
    if (this.boq_display_date === "Installation Date") {
      this.boq_display_date = "Installation";
    }
    if (this.boq_display_date === "MTO Ready") {
      this.boq_display_date = "MTO Ready";
    }
    if (this.boq_display_date === "FHI Ready") {
      this.boq_display_date = "FHI Ready";
    }
    if (event2 == "PO Release Date") {
      if (event6) {
        this.boqPoData = event6;
      } else {
        this.boqPoData = [];
      }
    }
    if (event2 == "Raw Material") {
      if (event6 == undefined) {
        event6 = [];
      }

      this.RawMaterialDataBoq = event6;
    }

    if (this.log_boq_value.length > 0) {
      this.show_boq_val = true;
    } else {
      this.show_boq_val = false;
    }
    if (this.boq_display_val === "Non Panel Dispatch") {
      this.boq_display_val = "MTO Dispatch";
    }
    if (this.boq_display_val === "Panel Production Start") {
      this.boq_display_val = "FHI Start";
    }
    if (this.boq_display_val === "Panel Dispatch") {
      this.boq_display_val = "FHI Dispatch";
    }
    if (this.boq_display_val === "Select Start") {
      this.boq_display_val = "MTO Start";
    }
    if (this.boq_display_val === "MKW Start Date") {
      this.boq_display_val = "MKW Start";
    }
    if (this.boq_display_val === "MKW Ready Date") {
      this.boq_display_val = "MKW Ready";
    }
    if (this.boq_display_val === "MKW Dispatch Date") {
      this.boq_display_val = "MKW Dispatch";
    }
    if (this.boq_display_val === "MKW Delivered Date") {
      this.boq_display_val = "MKW Delivered";
    }
    if (this.boq_display_val === "FHI Delivered Date") {
      this.boq_display_val = "FHI Delivered";
    }
    if (this.boq_display_val === "MTO Delivered Date") {
      this.boq_display_val = "MTO Delivered";
    }
    if (this.boq_display_val === "Installation Date") {
      this.boq_display_val = "Installation";
    }
    if (this.boq_display === "Panel Production Start") {
      this.boq_display = "Panel Start";
    }
    if (this.boq_display === "Non Panel Dispatch") {
      this.boq_display = "Select Dispatch";
    }
    if (this.boq_display === "MTO Ready") {
      this.boq_display = "MTO Ready";
    }
    if (this.boq_display === "FHI Ready") {
      this.boq_display = "FHI Ready";
    }

    if (event.expected && !event.actual) {
      this.show_expect_value_boq = true;
    }
    this.boq_data = event.reason;
    this.boq_data2 = event.notes;
    this.boq_detail_obj = event3;
    this.ownrable_ids = event3.id;
    this.index = event4;
    this.fortyquoteData = event3.quotation_data.per_40_payment_mapped_date;
    if (
      (event2 === "Raw Material" ||
        event2 === "Panel Production Start" ||
        event2 === "Panel Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch" ||
        event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" || event2 === "MKW Start Date" || event2 === "MKW Ready Date" || event2 === "MKW Dispatch Date" || event2 === "MKW Delivered Date" || event2 === "FHI Delivered Date" || event2 === "MTO Delivered Date" || event2 === "Installation Date" || event2 === "MTO Ready" || event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date === null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_head"
    ) {
      this.show_actual_value_boq = true;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || event2 === "MKW Start Date" || event2 === "MKW Ready Date" || event2 === "MKW Dispatch Date" || event2 === "MKW Delivered Date" || event2 === "FHI Delivered Date" || event2 === "MTO Delivered Date" || event2 === "Installation Date" || event2 === "MTO Ready" || event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date !== null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_head"
    ) {
      this.show_actual_value_boq = false;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || 
      event2 === "MKW Start Date" ||
      event2 === "MKW Ready Date" || 
      event2 === "MKW Dispatch Date" ||
      event2 === "MKW Delivered Date" || 
      event2 === "FHI Delivered Date" ||
      event2 === "MTO Delivered Date" ||
      event2 === "Installation Date" || 
      event2 === "MTO Ready" || 
      event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date === null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_panel"
    ) {
      this.show_actual_value_boq = true;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || 
      event2 === "MKW Start Date" ||
      event2 === "MKW Ready Date" || 
      event2 === "MKW Dispatch Date" ||
      event2 === "MKW Delivered Date" || 
      event2 === "FHI Delivered Date" ||
      event2 === "MTO Delivered Date" ||
      event2 === "Installation Date" || 
      event2 === "MTO Ready" || 
      event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date !== null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_panel"
    ) {
      this.show_actual_value_boq = false;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || 
      event2 === "MKW Start Date" ||
      event2 === "MKW Ready Date" || 
      event2 === "MKW Dispatch Date" ||
      event2 === "MKW Delivered Date" || 
      event2 === "FHI Delivered Date" ||
      event2 === "MTO Delivered Date" ||
      event2 === "Installation Date" || 
      event2 === "MTO Ready" || 
      event2 === "FHI Ready")&&
      event3.quotation_data.timeline[event2].actual_manual_date === null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_non_panel"
    ) {
      this.show_actual_value_boq = true;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || 
      event2 === "MKW Start Date" ||
      event2 === "MKW Ready Date" || 
      event2 === "MKW Dispatch Date" ||
      event2 === "MKW Delivered Date" || 
      event2 === "FHI Delivered Date" ||
      event2 === "MTO Delivered Date" ||
      event2 === "Installation Date" || 
      event2 === "MTO Ready" || 
      event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date !== null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_non_panel"
    ) {
      this.show_actual_value_boq = false;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || 
      event2 === "MKW Start Date" ||
      event2 === "MKW Ready Date" || 
      event2 === "MKW Dispatch Date" ||
      event2 === "MKW Delivered Date" || 
      event2 === "FHI Delivered Date" ||
      event2 === "MTO Delivered Date" ||
      event2 === "Installation Date" || 
      event2 === "MTO Ready" || 
      event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date === null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_services"
    ) {
      this.show_actual_value_boq = true;
    } else if (
      (event2 === "Raw Material" ||
      event2 === "Panel Production Start" ||
      event2 === "Panel Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" || 
      event2 === "MKW Start Date" ||
      event2 === "MKW Ready Date" || 
      event2 === "MKW Dispatch Date" ||
      event2 === "MKW Delivered Date" || 
      event2 === "FHI Delivered Date" ||
      event2 === "MTO Delivered Date" ||
      event2 === "Installation Date" || 
      event2 === "MTO Ready" || 
      event2 === "FHI Ready") &&
      event3.quotation_data.timeline[event2].actual_manual_date !== null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_services"
    ) {
      this.show_actual_value_boq = false;
    }
    $("#fmailsModal").modal("show");
  }

  closefamils() {
    $("#fmailsModal").modal("hide");
    this.show_expect_value_boq = false;
  }

  leads;
  date_names;
  current_dates;
  note_details;
  changeexpexteddateQuote(event1) {
    $("#expectedDatesModal").modal("show");
    this.leads = event1;
    // this.ownrable_ids = event2;
    this.date_names = this.boq_display_val;
    if(this.date_names == 'PO Release Date'){
      this.date_names = 'PO Release'
     }
    // this.index = event5;
    this.current_dates = this.boq_expect_date;
  }

  current_dates_boq;
  changeactualdateBOQ(event1) {
    $("#expectedDatesActualModal").modal("show");
    this.leads = event1;
    this.date_names = this.boq_display_val;
    if(this.date_names == 'PO Release Date'){
      this.date_names = 'PO Release'
     }
    this.current_dates_boq = this.boq_actual_date;
  }

  changeactualdate223(event1, ekk) {
    $("#expectedDatesActualModal").modal("show");
    this.leads = event1;
    this.ownrable_ids = ekk;
    this.date_names = this.boq_display_val;
    this.current_dates_boq = this.boq_actual_date;
  }
  getServiceDataCurent(data){
   
  

    if(data.timeline['Service 100% Complete'].actual){
      return {
        'ageing':  data.aging_per_object.ageging_service_per_100_date,
        'node': data.timeline['Service 100% Complete'],
         'logdata':  data.timeline['Service 100% Complete log data'],
         'name' :"Service 100% Complete",
         "isshow": true
      }
    } else {
      if(data.timeline['Service 50% Complete'].actual){
         return {
        'ageing':  data.aging_per_object.ageging_service_per_50_date,
        'node': data.timeline['Service 50% Complete'],
        'logdata':  data.timeline['Service 50% Complete log data'],
        'name' :"Service 50% Complete",
        "isshow": true

         } 
       

      } 
      else{
        
          if (data.timeline['Service Start'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_service_start,
              'node': data.timeline['Service Start'],
              'logdata':  data.timeline['Service Start log data'],
              'name' :"Service Start",
              "isshow": true
      
               } 

          } else{

            return {
              'ageing':  0,
              'node': data.timeline['Service Start'],
              'logdata': data.timeline['Service Start log data'] ,
              'name' :"",
              "isshow": false

      
               } 

          }
       
      }
    } 
    
  }
  getServiceDataUpcoming(data){
  

    if(data.timeline['Service 100% Complete'].actual){
    
      return {
        'ageing':  0,
        'node': data.timeline['Service 100% Complete'] ,
        'logdata':  data.timeline['Service 100% Complete log data'],
        'name' :"Service 100% Complete",
        "isshow": false


      }
    } else {
      if(data.timeline['Service 50% Complete'].actual){
     
         return {
        'ageing':   data.aging_per_object.ageging_service_per_100_date
        ,
        'node': data.timeline['Service 100% Complete'],
        'logdata':  data.timeline['Service 100% Complete log data'],
        'name' :"Service 100% Complete",
        "isshow": true
        

         } 
       

      } 
      else{
        
          if (data.timeline['Service Start'].actual){

          

            return {
              'ageing': data.aging_per_object.ageging_service_per_50_date,
              'node': data.timeline['Service 50% Complete'],
              'logdata':  data.timeline['Service 50% Complete log data'],
              'name' :"Service 50% Complete",
              "isshow": true
      
               } 

          } else{
           
            return {
              'ageing': data.aging_per_object.ageging_service_start
              ,
              'node': data.timeline['Service Start'] ,
              'logdata': data.timeline['Service Start log data'] ,
              'name' :"Service Start",
              "isshow": true

      
               } 

          }
       
      }
    } 
    
  }

  getFHiDataCurent(data){
   
  

    if(data.timeline['FHI Delivered Date'].actual){
      return {
        'ageing':  data.aging_per_object.ageging_fhi_deliveary_date,
        'node': data.timeline['FHI Delivered Date'],
         'logdata':  data.timeline['FHI Delivered log data'],
         'name' :"FHI Delivered Date",
         "isshow": true
      }
    } else {
      if(data.timeline['Panel Dispatch'].actual){
         return {
        'ageing':  data.aging_per_object.ageging_panel_dispatch_date,
        'node': data.timeline['Panel Dispatch'],
        'logdata':  data.timeline['Panel Dispatch log data'],
        'name' :"Panel Dispatch",
        "isshow": true

         } 
       

      } 
      else{
        
          if (data.timeline['Panel Ready'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_panel_ready_date,
              'node': data.timeline['Panel Ready'],
              'logdata':  data.timeline['Panel Ready log data'],
              'name' :"Panel Ready",
              "isshow": true
      
               } 

          } else{ 

            if(data.timeline['Panel Production Start'].actual){

              return {
                'ageing':  data.aging_per_object.ageging_panel_ready_date,
                'node': data.timeline['Panel Production Start'],
                'logdata':  data.timeline['Panel Production Start log data'],
                'name' :"Panel Production Start",
                "isshow": true
        
                 } 


            } else{
 



              return {
                'ageing':  0,
                'node': data.timeline['Service Start'],
                'logdata': data.timeline['Service Start log data'] ,
                'name' :"",
                "isshow": false
  
        
                 } 

            }

           

          }
       
      }
    } 
    
  }
  getFhiDataUpcoming(data){
  

    if(data.timeline['FHI Delivered Date'].actual){
    
      return {
        'ageing':  0,
        'node': data.timeline['Service 100% Complete'] ,
        'logdata':  data.timeline['Service 100% Complete log data'],
        'name' :"Service 100% Complete",
        "isshow": false


      }
    } else {
      if(data.timeline['Panel Dispatch'].actual){
     
        return {
          'ageing':  data.aging_per_object.ageging_fhi_deliveary_date,
          'node': data.timeline['FHI Delivered Date'],
           'logdata':  data.timeline['FHI Delivered log data'],
           'name' :"FHI Delivered Date",
           "isshow": true
        }
       

      } 
      else{
        
          if (data.timeline['Panel Ready'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_panel_dispatch_date,
              'node': data.timeline['Panel Dispatch'],
              'logdata':  data.timeline['Panel Dispatch log data'],
              'name' :"Panel Dispatch",
              "isshow": true
      
               } 

           

          } else{


            if(data.timeline['Panel Production Start'].actual){

              return {
                'ageing':  data.aging_per_object.ageging_panel_ready_date,
                'node': data.timeline['Panel Ready'],
                'logdata':  data.timeline['Panel Ready log data'],
                'name' :"Panel Ready",
                "isshow": true
        
                 } 



            } else{

              return {
                'ageing':  data.aging_per_object.ageging_panel_ready_date,
                'node': data.timeline['Panel Production Start'],
                'logdata':  data.timeline['Panel Production Start log data'],
                'name' :"Panel Production Start",
                "isshow": true
        
                 } 


            }
           
          

          }
       
      }
    } 
    
  }

  getMKWDataCurent(data){
   
 

    if(data.timeline['MKW Delivered Date'].actual){
      return {
        'ageing':  data.aging_per_object.ageging_mkw_deliveary_date,
        'node': data.timeline['MKW Delivered Date'],
         'logdata':  data.timeline['MKW Delivered log data'],
         'name' :"MKW Delivered Date",
         "isshow": true
      }
    } else {
      if(data.timeline['MKW Dispatch Date'].actual){
         return {
        'ageing':  data.aging_per_object.ageging_mkw_dispatch_date,
        'node': data.timeline['MKW Dispatch Date'],
        'logdata':  data.timeline['MKW Dispatch log data'],
        'name' :"MKW Dispatch Date",
        "isshow": true

         } 
       

      } 
      else{
        
          if (data.timeline['MKW Ready Date'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_mkw_ready_date,
              'node': data.timeline['MKW Ready Date'],
              'logdata':  data.timeline['MKW Ready log data'],
              'name' :"MKW Ready Date",
              "isshow": true
      
               } 

          } else{ 

            if(data.timeline['MKW Start Date'].actual){

              return {
                'ageing':  data.aging_per_object.ageging_mkw_start_date,
                'node': data.timeline['MKW Start Date'],
                'logdata':  data.timeline['MKW Start log data'],
                'name' :"MKW Start Date",
                "isshow": true
        
                 } 


            } else{
 



              return {
                'ageing':  0,
                'node': data.timeline['Service Start'],
                'logdata': data.timeline['Service Start log data'] ,
                'name' :"",
                "isshow": false
  
        
                 } 

            }

           

          }
       
      }
    } 
    
  }
  getMKWDataUpcoming(data){
  

    if(data.timeline['MKW Delivered Date'].actual){
    
      return {
        'ageing':  0,
        'node': data.timeline['Service 100% Complete'] ,
        'logdata':  data.timeline['Service 100% Complete log data'],
        'name' :"Service 100% Complete",
        "isshow": false


      }
    } else {
      if(data.timeline['MKW Dispatch Date'].actual){
     
        return {
          'ageing':  data.aging_per_object.ageging_mkw_deliveary_date,
          'node': data.timeline['MKW Delivered Date'],
           'logdata':  data.timeline['MKW Delivered log data'],
           'name' :"MKW Delivered Date",
           "isshow": true
        }

      } 
      else{
        
          if (data.timeline['MKW Ready Date'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_mkw_dispatch_date,
              'node': data.timeline['MKW Dispatch Date'],
              'logdata':  data.timeline['MKW Dispatch log data'],
              'name' :"MKW Dispatch Date",
              "isshow": true
      
               } 

           

          } else{


            if(data.timeline['MKW Start Date'].actual){

              return {
                'ageing':  data.aging_per_object.ageging_mkw_ready_date,
                'node': data.timeline['MKW Ready Date'],
                'logdata':  data.timeline['MKW Ready log data'],
                'name' :"MKW Ready Date",
                "isshow": true
        
                 } 


            } else{



              return {
                'ageing':  data.aging_per_object.ageging_mkw_start_date,
                'node': data.timeline['MKW Start Date'],
                'logdata':  data.timeline['MKW Start log data'],
                'name' :"MKW Start Date",
                "isshow": true
        
                 } 
             


            }
           
          

          }
       
      }
    } 
    
  }
  getMTODataCurent(data){
   
  

    if(data.timeline['MTO Delivered Date'].actual){
      return {
        'ageing':  data.aging_per_object.ageging_mto_deliveary_date,
        'node': data.timeline['MTO Delivered Date'],
         'logdata':  data.timeline['MTO Delivered  log data'],
         'name' :"MTO Delivered Date",
         "isshow": true
      }
    } else {
      if(data.timeline['Non Panel Dispatch'].actual){
         return {
        'ageing':  data.aging_per_object.ageging_non_panel_dispatch,
        'node': data.timeline['Non Panel Dispatch'],
        'logdata':  data.timeline['Non Panel Dispatch log data'],
        'name' :"Non Panel Dispatch",
        "isshow": true

         } 
       

      } 
      else{
        
          if (data.timeline['MTO Ready'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_mto_ready_date,
              'node': data.timeline['MTO Ready'],
              'logdata':  data.timeline['MTO Ready log data'],
              'name' :"MTO Ready",
              "isshow": true
      
               } 

          } else{ 

            if(data.timeline['Select Start'].actual){

              return {
                'ageing':  data.aging_per_object.ageging_select_start,
                'node': data.timeline['Select Start'],
                'logdata':  data.timeline['Select Start log data'],
                'name' :"Select Start",
                "isshow": true
        
                 } 


            } else{
 



              return {
                'ageing':  0,
                'node': data.timeline['Service Start'],
                'logdata': data.timeline['Service Start log data'] ,
                'name' :"",
                "isshow": false
  
        
                 } 

            }

           

          }
       
      }
    } 
    
  }
  getMTODataUpcoming(data){
  

    if(data.timeline['MTO Delivered Date'].actual){
    
     return {
        'ageing':  0,
        'node': data.timeline['Service 100% Complete'] ,
        'logdata':  data.timeline['Service 100% Complete log data'],
        'name' :"Service 100% Complete",
        "isshow": false
 

      }
    } else {
      if(data.timeline['Non Panel Dispatch'].actual){
     
        return {
          'ageing':  data.aging_per_object.ageging_mto_deliveary_date,
          'node': data.timeline['MTO Delivered Date'],
           'logdata':  data.timeline['MTO Delivered  log data'],
           'name' :"MTO Delivered Date",
           "isshow": true
        }     
   
      } 
      else{
        
          if (data.timeline['MTO Ready'].actual){

            return {
              'ageing':  data.aging_per_object.ageging_non_panel_dispatch,
              'node': data.timeline['Non Panel Dispatch'],
              'logdata':  data.timeline['Non Panel Dispatch log data'],
              'name' :"Non Panel Dispatch",
              "isshow": true
      
               } 
             

           

          } else{


            if(data.timeline['Select Start'].actual){

              return {
                'ageing':  data.aging_per_object.ageging_mto_ready_date,
                'node': data.timeline['MTO Ready'],
                'logdata':  data.timeline['MTO Ready log data'],
                'name' :"MTO Ready",
                "isshow": true
        
                 } 

            } else{

              return {
                'ageing':  data.aging_per_object.ageging_select_start,
                'node': data.timeline['Select Start'],
                'logdata':  data.timeline['Select Start log data'],
                'name' :"Select Start",
                "isshow": true
        
                 } 
             


            }
           
          

          }
       
      }
    } 
    
  }


  getLFDataCurent(data){
   
  

    if(data.timeline['Loose Furniture Dispatch'].actual){
      return {
        'ageing':  data.aging_per_object.ageging_loose_furniture,
        'node': data.timeline['Loose Furniture Dispatch'],
         'logdata':  data.timeline['Loose Furniture Dispatch log data'],
         'name' :"Loose Furniture Dispatch",
         "isshow": true
      }
    } 
    else{

      if(data.timeline['LF Start'].actual){
        return {
       'ageing':  data.aging_per_object.ageging_non_panel_dispatch,
       'node': data.timeline['LF Start'],
       'logdata':  data.timeline['LF Start log data'],
       'name' :"LF Start",
       "isshow": true

        } 





    } else{

      return {
        'ageing':  0,
        'node': data.timeline['Service Start'],
        'logdata': data.timeline['Service Start log data'] ,
        'name' :"",
        "isshow": false


         } 



    }
  }
           

          
       
      
     
    
  }
  getLFDataUpcoming(data){
  

    if(data.timeline['Loose Furniture Dispatch'].actual){
    
     return {
        'ageing':  0,
        'node': data.timeline['Service 100% Complete'] ,
        'logdata':  data.timeline['Service 100% Complete log data'],
        'name' :"Service 100% Complete",
        "isshow": false
 

      }
    }  else{

      if(data.timeline['LF Start'].actual){
        return {
          'ageing':  data.aging_per_object.ageging_loose_furniture,
          'node': data.timeline['Loose Furniture Dispatch'],
           'logdata':  data.timeline['Loose Furniture Dispatch log data'],
           'name' :"Loose Furniture Dispatch",
           "isshow": true
        }
      } else{

        return {
          'ageing':  data.aging_per_object.ageging_non_panel_dispatch,
          'node': data.timeline['LF Start'],
          'logdata':  data.timeline['LF Start log data'],
          'name' :"LF Start",
          "isshow": true
   
           } 


      }



    }
   
    
  }

  GetRealName(Alias){

    if(Alias == 'Panel Production Start'){
      return 'FHI Start Date'
    } else{
      if(Alias == 'Panel Ready'){
        return 'FHI Ready Date '
      } else{
        if(Alias == 'Panel Dispatch'){

          return 'FHI Dispatch Date'

        } else{
          if(Alias == 'Select Start'){

            return 'MTO Start Date '
  
          } else{
            if(Alias == 'MTO Ready'){

              return 'MTO Ready Date '
    
            } else{
              if(Alias == 'Non Panel Dispatch'){

                return 'MTO Dispatch Date'
      
              } else{

                if(Alias == 'Loose Furniture Dispatch'){

                  return 'LF Dispatch Date '
        
                }  else{
                  return Alias
                }
              }

            }

          }

        }
      }
    }

  }
  DeatilsOfLead:any
  openLeaddetailsmodal(){

    this.DeatilsOfLead = this.LeadNoc[0];

    console.log(this.DeatilsOfLead);

    if(this.leadDetails.tab_type == 'ZeroToForty'){

      $("#ModalLeadDetailszero").modal("show");
    } else{
      if(this.leadDetails.tab_type == 'FortyToHundred'){
        $("#ModalLeadDetailsforty").modal("show");


      } else{
        $("#ModalLeadDetailshand").modal("show");
      }
    }


  }
 
  closefmail(){

  }
  dataForOrderPipeLine :any
  orderPipelineData(id){
    this.loaderService.display(true)
    this.leadService.orderPipeLineData(id).subscribe(
      (res) => {
        this.loaderService.display(false)
        this.dataForOrderPipeLine = res.data
      },(err) => {
        this.loaderService.display(false)
      }
    )
  }
 
  reason_dropdowns;
  reasonDropDownsChanged(event) {
    this.reason_dropdowns = event;
  }
  back(){
    if(this.leadDetails.tab_type == 'ZeroToForty'){

      this.router.navigate(['/noc-screen/zero-to-forty'])

    
    } else{
      if(this.leadDetails.tab_type == 'FortyToHundred'){
        this.router.navigate(['/noc-screen/fifty-to-hundred'])
       


      } else{

        this.router.navigate(['/noc-screen/handover'])
       
      }
    }


  }
  firstMeetingData: any;
  firstmeeting(data: any) {
    this.firstMeetingData = data[0];
  }
  tenquoteData: any;
  tenquotepayment(data: any) {
    this.tenquoteData = data;
  }
  tenData: any;
  tenpayment(data: any) {
    this.tenData = data;
  }


  lead_ideal_date;
  lead_expect_date;
  lead_actual_date;
  lead_display_date;
  log_display_val: any = "";
  show_expect_value: boolean = false;
  first_data;
  second_data;

  ownrable_id
  show_actual_value:any = false;
  showpo_table: boolean = false;
  showrm_table: boolean = false;
  poRecievedData: any = [];
  RawMaterialData: any = [];
  fortyData:any 
  designIterationStartDate = null;
  
  getNodeDetail(event, event2, event3, event4, delayed, event5, designIteration = null) {
    this.designIterationStartDate = designIteration;
    if(this.leadDetails.tab_type == 'ZeroToForty'){
    this.deleayd_days = delayed;
    this.lead_ideal_date = event.ideal;
    this.lead_expect_date = event.expected;
    this.lead_actual_date = event.actual;
    this.lead_display_date = event2;
    this.log_display_val = event4;
    if (this.lead_display_date === "Initial Site Measurement Request") {
      this.lead_display_date = "Post Bid Site Measurement Date";
    }
    if (event.expected && !event.actual) {
      this.show_expect_value = true;
    }
    this.first_data = event.reason;
    this.second_data = event.notes;
    this.ownrable_id = event3.lead_id;
    $("#fmailModalzero").modal("show");

    
    } else{
      if(this.leadDetails.tab_type == 'FortyToHundred'){
        console.log(event5,"jhfrefe")
       
        this.deleayd_days = delayed;
    this.RawMaterialData = [];
    this.poRecievedData = [];
    if (event5 != undefined && event2 == "PO Release Date") {
      this.showpo_table = true;
      this.showrm_table = true;
      this.poRecievedData = event5;
    } else if (event5 != undefined && event2 == "Raw Material") {
      this.showrm_table = true;
      this.showpo_table = false;
      this.RawMaterialData = event5;
    } else {
      this.showpo_table = false;
      this.showrm_table = false;
    }
    this.show_actual_value = false;
    this.lead_ideal_date = event.ideal;
    this.lead_expect_date = event.expected;
    this.lead_actual_date = event.actual;
    this.lead_display_date = event2;
    this.lead_display = event2;
    this.log_display_val = event4;
    if (this.lead_display === "Panel Production Start") {
      this.lead_display = "FHI Start";
    }
    if (this.lead_display === "Panel Ready") {
      this.lead_display = "FHI Ready";
    }
    if (this.lead_display === "Panel Dispatch") {
      this.lead_display = "FHI Dispatch";
    }
    if (this.lead_display === "Select Start") {
      this.lead_display = "MTO Start";
    }
    if (this.lead_display === "Non Panel Dispatch") {
      this.lead_display = "MTO Dispatch";
    }
    if (this.lead_display_date === "Non Panel Dispatch") {
      this.lead_display_date = "Non Panel Dispatch";
    }
    if (this.lead_display_date === "MKW Start Date") {
      this.lead_display_date = "MKW Start";
    }
    if (this.lead_display_date === "MKW Ready Date") {
      this.lead_display_date = "MKW Ready";
    }
    if (this.lead_display_date === "MKW Dispatch Date") {
      this.lead_display_date = "MKW Dispatch";
    }
    if (this.lead_display_date === "MKW Delivered Date") {
      this.lead_display_date = "MKW Delivered";
    }
    if (this.lead_display_date === "FHI Delivered Date") {
      this.lead_display_date = "FHI Delivered";
    }
    if (this.lead_display_date === "MTO Delivered Date") {
      this.lead_display_date = "MTO Delivered";
    }
    
    if (this.lead_display_date === "Installation Date") {
      this.lead_display_date = "Installation";
    }
    if (this.lead_display_date === "MTO Ready") {
      this.lead_display_date = "MTO Ready";
    }
    

    if (event.expected && !event.actual) {
      this.show_expect_value = true;
    }
    this.first_data = event.reason;
    this.second_data = event.notes;
    this.ownrable_id = event3.lead_id;
    this.fortyData = event3.forty_per_payment.data;
    if (
      (event2 === "Raw Material" ||
        event2 === "Panel Production Start" ||
        event2 === "Panel Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch" ||
        event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Panel Ready" ||
        event2 === "Installation Date" ||
        event2 === "PO Release Date" || event2 === "MKW Delivered Date" || event2 === "FHI Delivered Date" || event2 === "MTO Delivered Date" || event2 === "Installation Date" || event2 === "MKW Start Date" || event2 === "MKW Ready Date" || event2 === "MKW Dispatch Date" || event2 === "MTO Ready") &&
      event3.timeline[event2].actual_manual_date === null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_head"
    ) {
      this.show_actual_value = true;
    } else if (
      (event2 === "Raw Material" ||
        event2 === "Panel Production Start" ||
        event2 === "Panel Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch" ||
        event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Panel Ready" ||
        event2 === "Installation Date" ||
        event2 === "PO Release Date" || event2 === "MKW Delivered Date" || event2 === "FHI Delivered Date" || event2 === "MTO Delivered Date" || event2 === "Installation Date" || event2 === "MKW Start Date" || event2 === "MKW Ready Date" || event2 === "MKW Dispatch Date" || event2 === "MTO Ready") &&
      event3.timeline[event2].actual_manual_date !== null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_head"
    ) {
      this.show_actual_value = false;
    } else if (
      (event2 === "Raw Material" ||
        event2 === "Panel Production Start" ||
        event2 === "Panel Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch" ||
        event2 === "Panel Ready" || 
        event2 === "MTO Delivered Date" || 
        event2 === "MTO Ready"  || 
        event2 === "FHI Delivered Date" ||
        event2 === "LF Start"  || 
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Installation Date"  ||
        event2 === "MKW Delivered Date" ||
        event2 === "MKW Start Date" || 
        event2 === "MKW Ready Date" ||
        event2 === "MKW Dispatch Date" ) &&

      event3.timeline[event2].actual_manual_date === null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_panel"
    ) {
      this.show_actual_value = true;
    } else if (
      (event2 === "Raw Material" ||
        event2 === "Panel Production Start" ||
        event2 === "Panel Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch" ||
        event2 === "Panel Ready" || 
        event2 === "MTO Delivered Date" || 
        event2 === "MTO Ready"  || 
        event2 === "FHI Delivered Date" ||
        event2 === "LF Start"  || 
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Installation Date" ||
        event2 === "MKW Delivered Date" ||
        event2 === "MKW Start Date" || 
        event2 === "MKW Ready Date" ||
        event2 === "MKW Dispatch Date" ) &&
      event3.timeline[event2].actual_manual_date !== null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_panel"
    ) {
      this.show_actual_value = false;
    } else if (
      (event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch" ||  
        event2 === "MTO Delivered Date" || 
        event2 === "MTO Ready"  || 
        event2 === "FHI Delivered Date" || 
        event2 === "Panel Ready" ||  
        event2 === "Panel Dispatch" ||  
        event2 === "Panel Production Start" ||
        event2 === "Installation Date" ||
        event2 === "MKW Delivered Date" ||
        event2 === "MKW Start Date" || 
        event2 === "MKW Ready Date" ||
        event2 === "MKW Dispatch Date"
         ) &&
      event3.timeline[event2].actual_manual_date === null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_non_panel"
    ) {
      this.show_actual_value = true;
    } else if (
      (event2 === "LF Start" ||
      event2 === "Loose Furniture Dispatch" ||
      event2 === "Select Start" ||
      event2 === "Non Panel Dispatch" ||  
      event2 === "MTO Delivered Date" || 
      event2 === "MTO Ready"  || 
      event2 === "FHI Delivered Date" || 
      event2 === "Panel Ready" ||  
      event2 === "Panel Dispatch" ||  
      event2 === "Panel Production Start" ||
      event2 === "Installation Date" ||
      event2 === "MKW Delivered Date" ||
      event2 === "MKW Start Date" || 
      event2 === "MKW Ready Date" ||
      event2 === "MKW Dispatch Date"
       ) &&
      event3.timeline[event2].actual_manual_date !== null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_non_panel"
    ) {
      this.show_actual_value = false;
    } else if (
      (event2 === "Select Start" || event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "MTO Delivered Date" || 
        event2 === "MTO Ready"  || 
        event2 === "FHI Delivered Date" || 
        event2 === "Panel Ready" ||  
        event2 === "Panel Dispatch" ||  
        event2 === "Panel Production Start" ||
        event2 === "Installation Date" ||
        event2 === "MKW Delivered Date" ||
        event2 === "MKW Start Date" || 
        event2 === "MKW Ready Date" ||
        event2 === "MKW Dispatch Date"
      ) &&
      event3.timeline[event2].actual_manual_date === null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_services"
    ) {
      this.show_actual_value = true;
    } else if (
      (event2 === "Select Start" || event2 === "Non Panel Dispatch" ||
      event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "MTO Delivered Date" || 
        event2 === "MTO Ready"  || 
        event2 === "FHI Delivered Date" || 
        event2 === "Panel Ready" ||  
        event2 === "Panel Dispatch" ||  
        event2 === "Panel Production Start" ||
        event2 === "Installation Date" ||
        event2 === "MKW Delivered Date" ||
        event2 === "MKW Start Date" || 
        event2 === "MKW Ready Date" ||
        event2 === "MKW Dispatch Date"
      )  &&
      event3.timeline[event2].actual_manual_date !== null &&
      event3.timeline[event2].can_edit === true &&
      this.role === "category_services"
    ) {
      this.show_actual_value = false;
    }
    $("#fmailModalforty").modal("show");



      } else{

        if (event2 == 'Project Handover') {
          this.deleayd_days_boq = delayed;
          this.boq_ideal_date = event.ideal;
          this.boq_expect_date = event.expected;
          this.boq_actual_date = event.actual;
          this.boq_display_date = event2;
          if (event.expected && !event.actual) {
            this.show_expect_value_boq = true;
          }
          this.boq_data = event.reason;
          this.boq_data2 = event.notes;
          this.boq_detail_obj = event3;
          this.ownrable_ids = event3.id;
          this.index = event4;
          this.log_boq_value = delayed;
    
        
        }
        this.deleayd_days = delayed;
        this.RawMaterialData = [];
        this.poRecievedData = [];
        if (event5 != undefined && event2 == "PO Release Date") {
          this.showpo_table = true;
          this.showrm_table = true;
          this.poRecievedData = event5;
        } else if (event5 != undefined && event2 == "Raw Material") {
          this.showrm_table = true;
          this.showpo_table = false;
          this.RawMaterialData = event5;
        } else {
          this.showpo_table = false;
          this.showrm_table = false;
        }
        this.show_actual_value = false;
        console.log(event);
    
        this.lead_ideal_date = event.ideal;
        this.lead_expect_date = event.expected;
        this.lead_actual_date = event.actual;
        this.lead_display_date = event2;
        this.lead_display = event2;
        this.log_display_val = event4;
        if (this.lead_display === "Panel Production Start") {
          this.lead_display = "FHI Start";
        }
        if (this.lead_display === "Panel Ready") {
          this.lead_display = "FHI Ready";
        }
        if (this.lead_display === "Panel Dispatch") {
          this.lead_display = "FHI Dispatch";
        }
        if (this.lead_display === "Select Start") {
          this.lead_display = "MTO Start";
        }
        if (this.lead_display === "Non Panel Dispatch") {
          this.lead_display = "MTO Dispatch";
        }
        if (this.lead_display_date === "Non Panel Dispatch") {
          this.lead_display_date = "Select Dispatch";
        }
        if (this.lead_display_date === "MKW Start Date") {
          this.lead_display_date = "MKW Start";
        }
        if (this.lead_display_date === "MKW Ready Date") {
          this.lead_display_date = "MKW Ready";
        }
        if (this.lead_display_date === "MKW Dispatch Date") {
          this.lead_display_date = "MKW Dispatch";
        }
         
        if (this.lead_display_date === "MKW Delivered Date") {
          this.lead_display_date = "MKW Delivered";
        }
        if (this.lead_display_date === "FHI Delivered Date") {
          this.lead_display_date = "FHI Delivered";
        }
        if (this.lead_display_date === "MTO Delivered Date") {
          this.lead_display_date = "MTO Delivered";
        }
        
        if (this.lead_display_date === "Installation Date") {
          this.lead_display_date = "Installation";
        }
        if (this.lead_display_date === "MTO Ready") {
          this.lead_display_date = "MTO Ready";
        }
        
    
        if (event.expected && !event.actual) {
          this.show_expect_value = true;
        }
        this.first_data = event.reason;
        this.second_data = event.notes;
        this.ownrable_id = event3.lead_id;
        if (event3.forty_per_payment) {
          this.fortyData = event3.forty_per_payment.data;
        }
    
        if (
          (event2 === "Raw Material" ||
            event2 === "Panel Production Start" ||
            event2 === "Panel Dispatch" ||
            event2 === "Select Start" ||
            event2 === "Non Panel Dispatch" ||
            event2 === "LF Start" ||
            event2 === "Loose Furniture Dispatch" ||
            event2 === "Panel Ready" ||
            event2 === "PO Release Date" || event2 === "MKW Start Date" || event2 === "MKW Ready Date" || event2 === "MKW Dispatch Date" || event2 === "MKW Delivered Date" || event2 === "FHI Delivered Date" || event2 === "MTO Delivered Date" || event2 === "Installation Date" || event2 === "MTO Ready" ) &&
          event3.timeline[event2].actual_manual_date === null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_head"
        ) {
          this.show_actual_value = true;
        } else if (
          (event2 === "Raw Material" ||
            event2 === "Panel Production Start" ||
            event2 === "Panel Dispatch" ||
            event2 === "Select Start" ||
            event2 === "Non Panel Dispatch" ||
            event2 === "LF Start" ||
            event2 === "Loose Furniture Dispatch" ||
            event2 === "Panel Ready") &&
          event3.timeline[event2].actual_manual_date !== null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_head"
        ) {
          this.show_actual_value = false;
        } else if (
          (event2 === "Raw Material" ||
            event2 === "Panel Production Start" ||
            event2 === "Panel Dispatch" ||
            event2 === "Select Start" ||
            event2 === "Non Panel Dispatch" ||
            event2 === "Panel Ready") &&
          event3.timeline[event2].actual_manual_date === null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_panel"
        ) {
          this.show_actual_value = true;
        } else if (
          (event2 === "Raw Material" ||
            event2 === "Panel Production Start" ||
            event2 === "Panel Dispatch" ||
            event2 === "Select Start" ||
            event2 === "Non Panel Dispatch" ||
            event2 === "Panel Ready") &&
          event3.timeline[event2].actual_manual_date !== null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_panel"
        ) {
          this.show_actual_value = false;
        } else if (
          (event2 === "LF Start" ||
            event2 === "Loose Furniture Dispatch" ||
            event2 === "Select Start" ||
            event2 === "Non Panel Dispatch") &&
          event3.timeline[event2].actual_manual_date === null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_non_panel"
        ) {
          this.show_actual_value = true;
        } else if (
          (event2 === "LF Start" ||
            event2 === "Loose Furniture Dispatch" ||
            event2 === "Select Start" ||
            event2 === "Non Panel Dispatch") &&
          event3.timeline[event2].actual_manual_date !== null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_non_panel"
        ) {
          this.show_actual_value = false;
        } else if (
          (event2 === "Select Start" || event2 === "Non Panel Dispatch") &&
          event3.timeline[event2].actual_manual_date === null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_services"
        ) {
          this.show_actual_value = true;
        } else if (
          (event2 === "Select Start" || event2 === "Non Panel Dispatch") &&
          event3.timeline[event2].actual_manual_date !== null &&
          event3.timeline[event2].can_edit === true &&
          this.role === "category_services"
        ) {
          this.show_actual_value = false;
        }
        $("#fmailModalhand").modal("show");
       
      }
   
  }


}
lead;

date_name;
current_date;
changeexpexteddatezero(event1, event2, event3, event4) {
  $("#expectedDateModalzero").modal("show");
  this.lead = event1;
  this.date_name = this.lead_display_date;
  this.current_date = this.lead_expect_date;
  if (this.date_name === "Initial Site Measurement Request") {
    this.date_name = "Post Bid Site Measurement";

  } 
  if (this.date_name == "Post Bid Site Measurement Date"){
    this.date_name = "Post Bid Site Measurement"
  }
}

reason_dropdown;


dateDetailszero(data) {
  this.loaderService.display(true);
  if (this.lead_display_date === "Post Bid Site Measurement Date") {
    this.lead_display_date = "Initial Site Measurement Request";
  }
  this.leadService
    .changeLeadDate(
      this.lead,
      this.ownrable_id,
      this.lead_display_date,
      data.date_detail,
      this.reason_dropdown,
      data.note_detail
    )
    .subscribe((res) => {
      $("#expectedDateModalzero").modal("hide");
      $("#fmailModalzero").modal("hide");
      this.loaderService.display(false);
     this.successMessageShow("Date Updated Sucessfully")
     this.getBOQZeroList( this.leadDetails.Lead_id)
     
    })
  
}
lead_display:any

changeexpexteddateforty(event1) {
  $("#expectedDateModalforty").modal("show");
  this.lead = event1;
  this.date_name = this.lead_display;
  this.current_date = this.lead_expect_date;
}

dateDetailsforty(data) {
  this.loaderService.display(true);
  this.leadService
    .changeLeadDate(
      this.lead,
      this.ownrable_id,
      this.lead_display_date,
      data.date_detail,
      data.select_value,
      data.note_detail
    )
    .subscribe((res) => {
      $("#expectedDateModalforty").modal("hide");
      $("#fmailModalforty").modal("hide");
      this.loaderService.display(false);
      this.successError = true;
      this.createClassificationForm.reset();
      this.successMessage = "Date has been Updated";
       this.successMessageShow( this.successMessage)
       this.getBOQFiftyList(this.leadDetails.Lead_id)

    });
}
current_actual_date;
changeactualdateforty(event1) {
  $("#expectedDateActualModalforty").modal("show");
  this.lead = event1;
  this.date_name = this.lead_display;
  this.current_actual_date = this.lead_actual_date;
}
dateDetailsactalforty(data) {
  this.loaderService.display(true);
  this.leadService
    .changeLeadActualDate(
      this.lead,
      this.ownrable_id,
      this.lead_display_date,
      data.date_detail,
      data.note_detail
    )
    .subscribe(
      (res) => {
        $("#expectedDateActualModalforty").modal("hide");
        $("#fmailModalforty").modal("hide");
        this.loaderService.display(false);
        this.successError = true;
        this.createClassificationactualForm.reset();
        this.successMessage = "Date has been Updated";
       this.successMessageShow(this.successMessage)
       this.getBOQFiftyList(this.leadDetails.Lead_id)
        this.show_actual_value = false;
       
      },
      (err) => {
        this.loaderService.display(false);
        this.msgError = true;
        this.createClassificationactualForm.reset();
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.errorMessageShow( this.errorMessage)
      }
    );
}

reasonDropDownChanged(event) {
  this.reason_dropdown = event;
}
changeactualdate22(event1, ekk) {
  $("#expectedDateActualModalforty").modal("show");
  this.lead = event1;
  this.ownrable_id = ekk;
  this.date_name = this.lead_display;
  this.current_actual_date = this.lead_actual_date;
}



  


runJob(event) {
  this.loaderService.display(true);
  this.leadService.runJob(event).subscribe((res) => {
    this.loaderService.display(false);
    this.successalert = true;
    if(this.leadDetails.tab_type == 'ZeroToForty'){
      this.getBOQZeroList( this.leadDetails.Lead_id)
    }else{
      this.getBOQFiftyList(this.leadDetails.Lead_id)
    }
    this.successMessage = "Job ran Successfully";
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      3000
    );
   
  });
}
Quertpipe(value){
  if(value){
    const inputArray = value;

    // Replace underscores with spaces and capitalize each word
    const transformedArray = inputArray.map((element) => {
      // Replace underscores with spaces
      const stringWithSpaces = element.replace(/_/g, ' ');
    
      // Capitalize each word
      const capitalizedWords = stringWithSpaces
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    
      // Join the words
      return capitalizedWords.join(' ');
    });
    
    return transformedArray.join(', ');
    
    
      }
   else{
    return ''
  }
}
  
 commaViewer(i,length){
 console.log(i,length)
  if(i < length-1){
    return true
  } else{
    return false
  }

 }
 
   


}
