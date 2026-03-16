import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GeneralManagerService } from "app/platform/general-manager/general-manager.service";
import { LeadStoreService } from "app/platform/lead-store/lead-store.service";
import { LeadService } from "app/platform/lead/lead.service";
import { LoaderService } from "app/services/loader.service";
import { startCase } from "lodash";
declare var $: any;
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-snag-noc",
  templateUrl: "./snag-noc.component.html",
  styleUrls: ["./snag-noc.component.css"],
  providers: [LeadService],
})
export class SnagNocComponent implements OnInit {
  items: any;
  startCase = startCase;
  // cascading_items: any;
  allowed_items = "zero_to_40";
  searchstring :any
  current_page: any  = 1
  per_page: any = 10
  total_page :any
  current_user_id;
  selectedGmItems = [];
  createClassificationactualForm: FormGroup;
  gm_dropdownSettings = {
    singleSelection: false,
    text: "General Managers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  cm_dropdownSettings = {
    singleSelection: false,
    text: "Community Managers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  designer_dropdownSettings = {
    singleSelection: false,
    text: "Designers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  store_dropdownSettings = {
    singleSelection: false,
    text: "Stores",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };


  successalert : boolean = false
  successError : boolean = false
  msgError : boolean = false
  successMessage : any
  errorMessage :any
  successMessage2 : any
  SetUpDrop : any = ''
  SetUpDrop1 : any = ''


  gm_dropdownList = [];
  cm_dropdownList = [];
  designer_dropdownList = [];
  Store_dropdownList = [];
  role: string;
  from_date;
  to_date;
  selectedTab = "snag_noc";
  activeTab = "Snag";
  delayLeads:any;
  createClassificationForm: FormGroup;
  createClassificationsForm: FormGroup;
  @Output() messageEvent = new EventEmitter<{ name1: number; name2: number }>();
  @Output() abcevent = new EventEmitter<{
    name3: number;
    name4: number;
    name5: number;
  }>();
  projectForty: any;
  closureValue: any;
  forty_prod_value: any;
  forty_collec_value: any;
  handedOverProjects: any;
  handover_prod_value: any;
  handover_collection_value: any;
  final_from_date: string;
  final_to_date: string;
  DeatilsOfLead: any;
  lead_ideal_date: any;
  lead_expect_date: any;
  lead_actual_date: any;
  lead_display_date: any;
  log_display_val: any = []
  date_name: any;  // for different snags milestone
  current_date: any;
  ownrable_id: any;
 
  

  constructor(
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private generalManagerService: GeneralManagerService
  ) {}

  ngOnInit() {    
    this.createClassificationForm = this.formBuilder.group({
      manual_date: new FormControl(""),
      reason: new FormControl("", [Validators.required]),
      notes: new FormControl("", [Validators.required]),
    });
    this.getSnagData(
      "",
      "",
      "",
      '',
      '',
      '',
      this.current_page,
      this.per_page
    )
    this.role = localStorage.getItem("user");
    this.getValidReason();
    this.createClassificationactualForm = this.formBuilder.group({
      date_detail: new FormControl(""),
      note_detail: new FormControl("", [Validators.required]),
    });
  }

  snagStatus :any
  snagStartDate : any
  snagEndDate :any
  snagMileStone :any
  send_file : boolean = false
  getpageNumber(event:any){
    this.current_page = event
    this.getSnagData(
      this.searched_value,
      this.snagStatus,
      this.from_date,
      this.to_date,
      this.snagMileStone,
      this.send_file,
      this.current_page,
      this.per_page
    )
  }
  SnagData :any
  headers_res :any;
  snagFulldata
  getSnagData( searchfilter:any , status :any , start_date :any ,end_date :any , mile_stone :any , send_file :any ,  curr_page :any, per_page){

    if(searchfilter == undefined){
      searchfilter = ''
    }

    if(status == undefined){
      status = ''
    }

    if(start_date == undefined){
      start_date = ''
    }

    if(end_date == undefined){
      end_date = ''
    }

    if(mile_stone == undefined){
      mile_stone = ''
    }

    if(send_file == undefined){
      send_file = ''
    }

    if(curr_page == undefined){
      curr_page = ''
    }

    if(per_page == undefined){
      per_page = ''
    }

    this.loaderService.display(true);
    this.leadService.getSnagDataNoc(  searchfilter, status,start_date,end_date,mile_stone,send_file,curr_page,per_page,this.date_type_filter,'&send_file=').subscribe((res)=> {
      if(send_file){
        this.loaderService.display(false)
        res = res.json()
        this.successError = true
        this.successMessage = res.message
        console.log(this.successMessage);
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          6000
        );
      }else{
        this.loaderService.display(false);
        this.headers_res = res.headers._headers;
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get('x-page')
        res = res.json()
        this.SnagData = res.office_snag_data
        this.projectForty = res.post_40_count;
        this.closureValue = res.closure_collected_amount;
        this.forty_prod_value = res.production_quotation_value;
        this.handedOverProjects = res.handed_over_count;
        this.forty_collec_value = res.production_quotation_collection;
        this.handover_prod_value= res.handover_production_value;
        this.handover_collection_value= res.handover_collection_value;
        this.snagFulldata = res
      }
    },(err)=> {
      console.log(err);
    })
  }
  getSnagDatareport( searchfilter:any , status :any , start_date :any ,end_date :any , mile_stone :any , send_file :any ,  curr_page :any, per_page,type){

    if(searchfilter == undefined){
      searchfilter = ''
    }

    if(status == undefined){
      status = ''
    }

    if(start_date == undefined){
      start_date = ''
    }

    if(end_date == undefined){
      end_date = ''
    }

    if(mile_stone == undefined){
      mile_stone = ''
    }

    if(send_file == undefined){
      send_file = ''
    }

    if(curr_page == undefined){
      curr_page = ''
    }

    if(per_page == undefined){
      per_page = ''
    }

    this.loaderService.display(true);
    this.leadService.getSnagDataNoc(  searchfilter, status,start_date,end_date,mile_stone,send_file,curr_page,per_page,this.date_type_filter,type=='export'?'&send_file=':'&send_detail=').subscribe((res)=> {
      if(send_file){
        this.loaderService.display(false)
        res = res.json()
        this.successError = true
        this.successMessage = res.message
        console.log(this.successMessage);
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          6000
        );
      }else{
        this.loaderService.display(false);
        this.headers_res = res.headers._headers;
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get('x-page')
        res = res.json()
        this.SnagData = res.office_snag_data
        this.projectForty = res.post_40_count;
        this.closureValue = res.closure_collected_amount;
        this.forty_prod_value = res.production_quotation_value;
        this.handedOverProjects = res.handed_over_count;
        this.forty_collec_value = res.production_quotation_collection;
        this.handover_prod_value= res.handover_production_value;
        this.handover_collection_value= res.handover_collection_value;
        this.snagFulldata = res
      }
    },(err)=> {
      console.log(err);
    })
  }

  modalforFilter(){
    $("#ModalFilter").modal("show");
  } 
  closefmail() {
    $("#ModalFilter").modal("hide");
  }
  searched_value :any
  searchFilter(term: any) {
    this.searched_value = this.searchstring    
    if(this.searched_value){
      console.log('if ');
      this.getSnagData(
        this.searched_value,
        '',
        '',
        '',
        '',
        '',
        this.current_page,
        this.per_page
      ) 
    }else {
     console.log('else');
    }
  }

  submitByDate() {
    if (this.from_date) {
      var todayTime = this.from_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      // this.final_from_date = day + "-" + month + "-" + year;
      this.final_from_date = year + "-" + month + "-" + day;
    }
    if (this.to_date) {
      var todayTime = this.to_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_to_date = year + "-" + month + "-" + day;
    }
    
  }

  ApplyFilters(){
    this.isApplyBtn = true
    $("#ModalFilter").modal("hide");
    this.submitByDate()
    this.getSnagData(
      this.searched_value,
      this.snagStatus,
      this.final_from_date,
      this.final_to_date,
      this.snagMileStone,
      this.send_file,
      this.current_page,
      this.per_page
    )
  }
  SelectMileStone(event: any){
    console.log(event);
    this.snagMileStone = event
    // this.getSnagData(
    //   this.searched_value,
    //   this.snagStatus,
    //   this.final_from_date,
    //   this.final_to_date,
    //   this.snagMileStone,
    //   this.send_file,
    //   this.current_page,
    //   this.per_page
    // )
  }
  SelectSnagStatus(event :any){
    this.snagStatus = event
   
  }
  downloadLeadData(){
   
    this.getSnagDatareport(
      this.searched_value,
      this.snagStatus,
      this.final_from_date,
      this.final_to_date,
      this.snagMileStone,
     true,
      this.current_page,
      this.per_page,
      'export'
    )
  }
  downloadLeadData2(){
   
    this.getSnagDatareport(
      this.searched_value,
      this.snagStatus,
      this.final_from_date,
      this.final_to_date,
      this.snagMileStone,
     true,
      this.current_page,
      this.per_page,
      'Detail'
    )
  }
  clearFilters(){
    this.SetUpDrop = ''
    this.SetUpDrop1 = ''
    this.final_from_date ='';
    this.final_to_date ='';
    this.snagMileStone = ''
    this.snagStatus = ''
    this.isApplyBtn = true
    this.from_date = '';
    this.to_date = '';
    
    this.getSnagData(
      '',
      '',
      '',
      '',
      '',
      '',
      this.current_page,
      this.per_page
    )
  }

  expansion2:any;
  row:any =[];
  toggleRow2(id) {
    if (this.row[0] !== id) {
      this.expansion2 = id;
      this.row[0] = id;
    } else {
      this.row[0] = "";
      this.expansion2 = "";
    }
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
  showpo_table = false;
  showrm_table = false

  showLeadDetails(data){
    console.log(data);
    
    $("#ModalLeadDetails").modal("show");
    this.DeatilsOfLead = data
  }
  show_expect_value: boolean = false;
  show_actual_value :boolean = false;
  lead_display
  checkActual;
  deleayd_days
  getNodeDetail(event, event2, event3, event4,delayed) {
    this.lead_display = event2;
    this.checkActual = event2
    console.log(event);  /// dates ideal , expected ,actual
    console.log(event2); /// heading
    console.log(event3); /// entire data
    console.log(event4); /// log data
    if (event3 != undefined && event2 == "PD PO Date") {
      this.showpo_table = true;
      this.showrm_table = true;
      
      console.log(event3['PD PO Date actual Date'],"hh")
      this.poRecievedData = event3.snag_time_line['PD PO Date actual Date'];
    } else if (event3 != undefined && event2 == "RM Receiving Date") {
      this.showrm_table = true;
      this.showpo_table = false;
      this.RawMaterialData = event3.snag_time_line['RM Receiving Date actual Date']
    } else {
      this.showpo_table = false;
      this.showrm_table = false;
    }
    
    
    
    
    
    this.deleayd_days = delayed;
    this.lead_ideal_date = event.ideal;
    this.lead_expect_date = event.expected;
    this.lead_actual_date = event.actual;
    this.lead_display_date = event2;
  
    this.log_display_val = event4;
  
    // if actual date is there then hide expected date

    if (event.actual) {
      this.show_expect_value = false;  // for expected
    }else{
      this.show_expect_value = true
    }

    if (event.actual == null && event2 != 'PD PO Date' ) {    // actual Date
      this.show_actual_value = true;  
    }else{
      this.show_actual_value = false
    }

    // this.first_data = event.reason;
    // this.second_data = event.notes;
    this.ownrable_id = event3.snag_id;

    // Snag PD PO, Snag RM Reciving, Snag Production Start, Snag Production Done, Snag Dispatch, Snag Delivery

    if(event2 === 'PD PO Date'){
      this.date_name = 'Snag PD PO'
    }

    if(event2 === 'RM Receiving Date'){
      this.date_name = 'Snag RM Reciving'
    }

    if(event2 === 'Production Start Date'){
      this.date_name = 'Snag Production Start'
    }

    if(event2 === 'Production Done Date'){
      this.date_name = 'Snag Production Done'
    }

    if(event2 === 'Dispatch Date'){
      this.date_name = 'Snag Dispatch'
    }
    if(event2 === 'Delivery Date'){
      this.date_name = 'Snag Delivery'
    }

    $("#fmailModal").modal("show");
  }
  Date_Details :any
  expected_actual :any
  changeexpexteddate(event1) {
    console.log(event1);
    
    $("#expectedDateModal").modal("show");
    this.expected_actual = event1;
    
    this.Date_Details = this.lead_display_date;
    this.current_date = this.lead_expect_date;
  }

  closeonemodal() {
    $("#expectedDateModal").modal("hide");
    this.createClassificationForm.reset();
  }




    reason_list;
    getValidReason() {
      this.leadService.getValidReason().subscribe((res) => {
        this.reason_list = res.data;
      });
    }

    reason_dropdown;
    reasonDropDownChanged(event) {
      this.reason_dropdown = event;
    }

  dateDetails(data) {
    this.loaderService.display(true);
    this.leadService
      .changeSnagDateNoc(
        data.manual_date,
        data.reason,
        data.notes,
        this.ownrable_id,
        this.date_name,
        this.expected_actual,
      )
      .subscribe((res) => {
        $("#expectedDateModal").modal("hide");
        $("#fmailModal").modal("hide");
        this.loaderService.display(false);
        this.successError = true;
        this.createClassificationForm.reset();
        this.successMessage = "Date has been Updated";
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          4000
        );
        // window.location.reload();
        this.getSnagData(
          '',
          '',
          '',
          '',
          '',
          '',
          this.current_page,
          this.per_page
        );
      }, (err) => {
        this.loaderService.display(false)
      });
  }
  
  poRecievedData = [];
  RawMaterialData = [];
  FilterNames:any =[]
  isApplyBtn = false
  filttersCountGetter(){

    this.FilterNames = [];


    let count = 0;

    if(this.isApplyBtn){


    if (this.snagMileStone && this.snagMileStone != '' && this.final_to_date && this.final_to_date != '' && this.final_to_date && this.final_to_date != ''  ){
      count ++
      this.FilterNames.push('Date Filter')
    } 
    if(this.snagStatus && this.snagStatus != ''){
      count ++
      this.FilterNames.push('Snag Status')

    }


    }

    
    
    return count
      

  }
  lead
  current_actual_date;
  changeactualdate(event1,id) {
   
    if(id){
      this.ownrable_id = id;
      this.lead = 'PurchaseOrder'
    }  
    else{
      this.lead = 'OfficeSnag'
    }
    
    $("#expectedDateActualModal").modal("show");
    this.current_actual_date = this.lead_actual_date;
    if( this.date_name == 'PO Release Date'){
      this.date_name  = 'PO Release'
    }
    if( this.date_name =='Installation Date'){
      this.date_name  = 'Installation'
    }
    console.log(this.date_name)
  }

  AccessCheck = ['category_head', 'category_panel','category_services','category_non_panel']
  dateDetailsactal(data) {
    this.loaderService.display(true);
    this.leadService
      .changeLeadActualDate(
        this.lead,
        this.ownrable_id,
        this.date_name,
        data.date_detail,
        data.note_detail
      )
      .subscribe(
        (res) => {
          $("#expectedDateActualModal").modal("hide");
          $("#fmailModal").modal("hide");
          this.loaderService.display(false);
          this.successError = true;
          this.createClassificationactualForm.reset();
          this.successMessage = "Date has been Updated";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            3000
          );
          this.show_actual_value = false;
          this.getSnagData(
            "",
            "",
            "",
            '',
            '',
            '',
            this.current_page,
            this.per_page
          )
         
        },
        (err) => {
          this.loaderService.display(false);
          this.msgError = true;
          this.createClassificationactualForm.reset();
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            3000
          );
        }
      );
  }
  runJob(event) {
    this.loaderService.display(true);
    this.leadService.runJobsnag(event).subscribe((res) => {
      this.loaderService.display(false);
      this.successError = true;
      this.successMessage = "Job ran Successfully";
      setTimeout(
        function () {
          this.successError = false;
        }.bind(this),
        3000
      );
      this.getSnagData(
        "",
        "",
        "",
        '',
        '',
        '',
        this.current_page,
        this.per_page
      )
    });
  }
  imageModal(){
    $("#snagpopmodalfiles").modal("show");
  }
  date_type = 'actual';
  date_type_filter;
  changeDateType(value) {
    this.date_type_filter = value;
    this. date_type = value;
  }
  imageUrl:any
  imgageDetail(url){

this.imageUrl = url;
$("#snagpopmodalfilesview").modal("show");





  }


  instantsnagjob(){
    this.loaderService.display(true);
    this.leadService.instantsnagjob().subscribe(
      (res) => {
      this.loaderService.display(false);
      this.successError = true;
      this.successMessage = res.message;
      this.getSnagData(
        "",
        "",
        "",
        '',
        '',
        '',
        this.current_page,
        this.per_page
      )
      setTimeout(
        function () {
          this.successError = false;
        }.bind(this),
        3000
      );
   
    },
    (err)=>{
      this.loaderService.display(false);

      this.msgError= true;
      this.errorMessage = "Job Updation Failed";
      setTimeout(
        function () {
          this.msgError = false;
        }.bind(this),
        3000
      );


    });

  }
}