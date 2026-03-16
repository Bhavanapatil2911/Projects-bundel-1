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
declare var $: any;
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-zero-to-forty",
  templateUrl: "./zero-to-forty.component.html",
  styleUrls: ["./zero-to-forty.component.css"],
  providers: [LeadService],
})
export class ZeroToFortyComponent implements OnInit {
  items: any;
  // cascading_items: any;
  allowed_items = "zero_to_40";
  current_page: any = 1;
  per_page: any = 10;
  total_page;
  current_user_id;
  selectedGmItems = [];
  selectedSmItems = [];
  gm_dropdownSettings = {
    singleSelection: false,
    text: "General Managers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  sm_dropdownSettings = {
    singleSelection: false,
    text: "Sales Managers",
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
  // status=['Active','Order Booked', 'Order Pipeline']
  // status = [
  //   {value : 'all',name: 'Active'} ,
    
  //   {value : 'order_booked' , name : 'Order Booked'},
  //   {value : 'order_pipeline' , name : 'Order Pipeline'}
  // ]
  status = [
    {value : 'pre_ob',name: 'Pre OB'} ,
    {value : 'order_booked' , name : 'Order Booked'},
    {value : 'order_pipeline' , name : 'Order Pipeline'}
  ]
  state='all';
  ob_category;
  category='all';
  state2= 'NOC Export'
  gm_dropdownList = [];
  sm_dropdownList = [];
  cm_dropdownList = [];
  designer_dropdownList = [];
  Store_dropdownList = [];
  role: string;
  from_date;
  to_date;
  selectedTab = "zero_to_forty";
  activeTab = "0-50%";
  delayLeads:any;
  createClassificationForm: FormGroup;
  createClassificationsForm: FormGroup;
  @Output() messageEvent = new EventEmitter<{ name1: number; name2: number }>();
  @Output() abcevent = new EventEmitter<{
    name3: number;
    name4: number;
    name5: number;
  }>();
  last_page: number;

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
      date_detail: new FormControl(""),
      select_value: new FormControl("", [Validators.required]),
      note_detail: new FormControl("", [Validators.required]),
    });
    this.createClassificationsForm = this.formBuilder.group({
      date_details: new FormControl(""),
      select_values: new FormControl("", [Validators.required]),
      note_details: new FormControl("", [Validators.required]),
    });
    this.current_page = 1;
    this.current_user_id = localStorage.getItem("userId");
    this.role = localStorage.getItem("user");
    if (this.role === "business_head" || this.role == "store_manager" || this.role == "category_head" ) {
      this.getGMList();
    }
    if (this.role === "area_sales_manager"  ) {
      this.getSMList();
    }
    if (
      this.role === "city_gm" ||
      this.role === "deputy_general_manager" ||
      this.role === "designer" ||
      this.role === "design_manager" ||
      this.role == "store_manager" || this.role == "category_head" || this.role=='sales_manager'
    ) {
      this.getCMList(this.current_user_id);
    }
    if (this.role === "community_manager" || this.role == "store_manager" || this.role == "category_head") {
      this.getDesignerList(this.current_user_id);
    }
    this.route.queryParams.subscribe((params) => {
      this.dash_filter = params["dashboard_filter"];
    });
    this.route.queryParams.subscribe((params) => {
      this.delayLeads = params["delay"];
    });
    this.route.queryParams.subscribe((params) => {
      this.searched_item = params["search_filter"];
    });
    this.getColumnFilterValues();
    this.getValidReason();
    if (this.searched_item !== undefined) {
      this.getItems(
        1,
        "",
        "",
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        this.dash_filter,
        false,
        "",
        ""
      );
    } else {
      this.getItems(
        1,
        "",
        "",
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        this.dash_filter,
        false,
        "",
        true
      );
    }
    if (
      this.role == "city_gm" ||
      this.role === "deputy_general_manager" ||
      this.role == "business_head" ||
      this.role == "category_panel" ||
      this.role == "category_non_panel" ||
      this.role == "category_services" ||
      this.role == "category_head" ||
      this.role == "finance"
    ) {
      this.getAllStores();
    }
  }

  reason_list;
  getValidReason() {
    this.leadService.getValidReason().subscribe((res) => {
      this.reason_list = res.data;
    });
  }

  page_number;
  featured;
  searched_item: any = "";
  closureValue;
  gmValue;
  smValue;
  cmValue;
  designerValue;
  errorMessage: string;
  successMessage: string;
  msgError: boolean = false;
  successError: boolean = false;

  item_delayed;
  item_start_date;
  item_end_date;
  item_date_column;
  send_file;
  sorting_col;
  sorting_ord;
  date_type;
  dash_filter;
  dashboardMsg;
  dash_filter_Message;
  forty_prod_value;
  handover_prod_value:any;
  handover_collection_value:any;
  forty_collec_value;
  scheduled;
  active_projects;
  leadHotValue :any = ""
  handedOverProjects:any
  getItems(
    pageno: any,
    searched: any,
    featured, 
    gM,
    cM,
    sM,
    dEsigner,
    delayed,
    datestart,
    dateend,
    date_column,
    file_data,
    sort_column,
    sort_order,
    date_type?,
    dashboard?,
    scheduled?,
    priority?,
    active_project?
  ) {
    if(priority == undefined){
      priority=this.priorityValue;
    }
    if (file_data === undefined || file_data === "") {
      this.send_file = false;
    } else if (file_data !== undefined) {
      this.send_file = true;
    } else if (this.send_file === undefined) {
      this.send_file = false;
    }
    if (sort_column === undefined || sort_column === "") {
      this.sorting_col = "";
    } else if (this.sorting_col === undefined) {
      this.sorting_col = "";
    } else if (sort_column !== "") {
      this.sorting_col = sort_column;
    }
    // if (this.sorting_col !== '' && this.sorting_col !== undefined && sort_column === '') {
    //   this.sorting_col = this.sorting_col;
    // }

    if (sort_order === undefined || sort_order === "") {
      this.sorting_ord = "";
    } else if (this.sorting_ord === undefined) {
      this.sorting_ord = "";
    } else if (sort_order !== "") {
      this.sorting_ord = sort_order;
    }
    if (featured === undefined) {
      featured = this.featured;
    }
    if (featured === "prio") {
      featured = null
    }
    if (featured === 1) {
      featured = this.featured;
    }
    if (gM === 1) {
      this.gmValue = "";
    } else if (this.gmValue !== "") {
      this.gmValue = this.gmValue;
    } else this.gmValue = gM;
    if (sM === 1) {
      this.smValue = "";
    } else if (this.smValue !== "") {
      this.smValue = this.smValue;
    } else this.smValue = sM;
    if (cM === 1) {
      this.cmValue = "";
    } else if (this.cmValue !== "") {
      this.cmValue = this.cmValue;
    } else this.cmValue = cM;
    if (dEsigner === 1) {
      this.designerValue = "";
    } else if (this.designerValue !== "") {
      this.designerValue = this.designerValue;
    } else this.designerValue = dEsigner;

    if (delayed === 1) {
      this.item_delayed = "";
    }
    if (datestart === 1) {
      this.item_start_date = "";
    }
    if (dateend === 1) {
      this.item_end_date = "";
    }
    if (date_column === 1) {
      this.item_date_column = "";
    }
    if (
      this.item_delayed !== "" &&
      this.item_delayed !== undefined &&
      delayed !== 1 &&
      delayed === ""
    ) {
      this.item_delayed = this.item_delayed;
    }

    if (
      this.item_delayed !== "" &&
      this.item_delayed !== undefined &&
      delayed !== 1 &&
      delayed !== ""
    ) {
      this.item_delayed = delayed;
    } else if (this.item_delayed === "" && delayed !== 1) {
      this.item_delayed = delayed;
    } else if (this.item_delayed === undefined) {
      this.item_delayed = delayed;
    }
    // this.item_delayed = delayed;
    if (
      this.item_start_date !== "" &&
      this.item_start_date !== undefined &&
      datestart !== 1 &&
      datestart === "" 
    ) {
      this.item_start_date = this.item_start_date;    
    }
    

    if (
      this.item_start_date !== "" &&
      this.item_start_date !== undefined &&
      datestart !== 1 &&
      datestart !== ""
    ) {
      this.item_start_date = datestart;
    } else if (this.item_start_date === "" && datestart !== 1) {
      this.item_start_date = datestart;
    } else if (this.item_start_date === undefined) {
      this.item_start_date = datestart;
    }
    if(this.final_from_date){
      this.item_start_date = this.final_from_date;
    }
    
    // this.item_start_date = datestart;
    if (
      this.item_end_date !== "" &&
      this.item_end_date !== undefined &&
      dateend !== 1 &&
      dateend === ""
    ) {
      this.item_end_date = this.item_end_date;
    }
    if (
      this.item_end_date !== "" &&
      this.item_end_date !== undefined &&
      dateend !== 1 &&
      dateend !== ""
    ) {
      this.item_end_date = dateend;
    } else if (this.item_end_date === "" && dateend !== 1) {
      this.item_end_date = dateend;
    } else if (this.item_end_date === undefined) {
      this.item_end_date = dateend;
    }
    if(this.final_to_date){
      this.item_end_date = this.final_to_date;
    }
    // this.item_end_date = dateend;
    if (
      this.item_date_column !== "" &&
      this.item_date_column !== undefined &&
      date_column !== 1 &&
      date_column === ""
    ) {
      this.item_date_column = this.item_date_column;
    }
    if (
      this.item_date_column !== "" &&
      this.item_date_column !== undefined &&
      date_column !== 1 &&
      date_column !== ""
    ) {
      this.item_date_column = date_column;
    } else if (this.item_date_column === "" && date_column !== 1) {
      this.item_date_column = date_column;
    } else if (this.item_date_column === undefined) {
      this.item_date_column = date_column;
    }
    // this.item_date_column = date_column;

    // this.searched_item = searched;
    if (searched === 1) {
      this.searched_item = "";
    }
    if (
      this.searched_item !== "" &&
      this.searched_item !== undefined &&
      searched === 1
    ) {
      this.searched_item = "";
    }

    if (
      this.searched_item !== "" &&
      this.searched_item !== undefined &&
      searched === ""
    ) {
      this.searched_item = this.searched_item;
    }
    if (
      this.searched_item !== "" &&
      this.searched_item !== undefined &&
      searched !== "" &&
      searched !== 1
    ) {
      this.searched_item = searched;
    }
    if (
      this.searched_item === "" &&
      this.searched_item !== undefined &&
      searched !== "" &&
      searched !== 1
    ) {
      this.searched_item = searched;
    } else if (this.searched_item === undefined) {
      this.searched_item = searched;
    }

    if (date_type === 1) {
      this.date_type = "actual";
    }

    if (
      this.date_type !== "" &&
      this.date_type !== undefined &&
      date_type === undefined
    ) {
      this.date_type = this.date_type;
    }
    // this.date_type = date_type;
    if (this.date_type === "" && date_type !== undefined && date_type !== 1) {
      this.date_type = date_type;
    }
    if (
      this.date_type !== "" &&
      date_type !== undefined &&
      date_type !== "" &&
      date_type !== 1
    ) {
      this.date_type = date_type;
    }
    if (this.date_type === undefined) {
      this.date_type = "actual";
    }
    // this.dash_filter = dashboard;
    if (
      this.dash_filter !== "" &&
      this.dash_filter !== undefined &&
      dashboard === undefined
    ) {
      this.dash_filter = this.dash_filter;
    }
    if (this.dash_filter === "" && dashboard !== undefined && dashboard !== 1) {
      this.dash_filter = dashboard;
    }
    if (
      this.dash_filter !== "" &&
      dashboard !== undefined &&
      dashboard !== "" &&
      dashboard !== 1
    ) {
      this.dash_filter = dashboard;
    }
    if (this.dash_filter === undefined) {
      this.dash_filter = "";
    }
    if (dashboard === 1) {
      this.dash_filter = "";
    }
    if (scheduled === true ) {
      this.scheduled = true;
    }
    
    if (scheduled !== true) {
     
      
    }
    if (this.toggle_project) {
      this.active_projects = this.toggle_project;
    } else if (this.toggle_project === false) {
      this.active_projects = "";
    }

    if(this.status_by_order === undefined){
      this.status_by_order = 'all'
    }

    if(this.date_to === undefined) {
      this.date_to = ''
    }

    if(this.date_from === undefined){
      this.date_from = ''
    }

    if(this.send_order_pipeline === undefined){
      this.send_order_pipeline = ''
    }

    // if (this.dash_filter !== "") {
    //   this.active_projects = "";
    // }
    this.current_page = pageno;
    this.featured = featured;
    this.per_page = 10;
    if(this.toggle_value==true){
      this.scheduled = true;
    }
    else{
      this.scheduled = "";
    }
    this.loaderService.display(true);
    this.leadService.getListwithType(
        this.allowed_items,
        this.current_page,
        10,
        this.searched_item,
        this.featured,
        this.gmValue,
        this.cmValue,
        this.smValue,
        this.designerValue,
        this.item_delayed,
        this.item_start_date,
        this.item_end_date,
        this.date_dropdown,
        this.send_file,
        this.sorting_col,
        this.sorting_ord,
        this.date_type,
        this.dash_filter,
        this.scheduled,
        this.active_projects,
        this.Stores,
        this.featuredLiving,
        priority,
        this.leadHotValue,
        this.delayLeads,
        '&send_file=',
        this.status_by_order,
        this.date_from,
        this.date_to,
        this.send_order_pipeline,   
        this.ob_category     
      ).subscribe((res) => {
        this.last_page=res.last_page
    
      
        if (res.success === true) {
          this.successError = true;
          if (
            res.message ==
            "You will receive the report in email once it is ready."
          ) {
            this.successMessage = res.message;
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              6000
            );
            this.loaderService.display(false);
          } else {
            this.successMessage =
              "The report you requested is being created. It will be emailed to you once completed.!";
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              6000
            );
            this.loaderService.display(false);
          }
        } else {
          this.items = res.lead_noc_data;
          if (this.items.length === 0) {
            this.msgError = true;
            this.errorMessage = "No Lead Data Found";
            setTimeout(
              function () {
                this.msgError = false;
              }.bind(this),
              7000
            );
            this.current_page = res.current_page;
            this.total_page = res.zero_to_40_count;
            this.per_page = 10;
            this.projectForty = res.post_40_count;
            this.closureValue = res.closure_collected_amount;
            this.forty_prod_value = res.production_quotation_value;
            this.handedOverProjects = res.handed_over_count;
            this.forty_collec_value = res.production_quotation_collection;
            this.handover_prod_value= res.handover_production_value;
            this.handover_collection_value= res.handover_collection_value;
            this.snagFulldata = res
            // this.messageEvent.emit({ name1:res.zero_to_40_count, name2: res.post_40_count});
            // this.abcevent.emit({ name3:res.closure_collected_amount, name4: res.production_quotation_value, name5: res.production_quotation_collection});
            this.loaderService.display(false);
          }
          if (this.searched_item !== "") {
            $("#searchtext12").val(this.searched_item);
            this.loaderService.display(false);
            this.current_page = res.current_page;
            this.total_page = res.zero_to_40_count;
            this.per_page = 10;
            this.projectForty = res.post_40_count;
            this.closureValue = res.closure_collected_amount;
            this.forty_prod_value = res.production_quotation_value;
            this.handedOverProjects = res.handed_over_count;
            this.forty_collec_value = res.production_quotation_collection;
            this.handover_prod_value= res.handover_production_value;
            this.handover_collection_value= res.handover_collection_value;
          } else {
            if (this.dash_filter !== "" && this.dash_filter !== undefined) {
              this.dashboardMsg = true;
              if (this.dash_filter === "3_plus_meeting_leads") {
                this.dash_filter_Message =
                  "Showing leads Where 3+ Meeting Leads are Present";
              }
              if (
                this.dash_filter === "site_measurement_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Expected Site Measurement Date is Delayed";
              }
              if (
                this.dash_filter === "material_selection_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Expected Material Selection Date is Delayed";
              }
              if (
                this.dash_filter === "material_selection_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Expected Material Selection Date is Delayed";
              }
              if (
                this.dash_filter === "site_validation_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Expected Site Validation Date is Delayed";
              }
              if (this.dash_filter === "qc_request_date_expected_delayed") {
                this.dash_filter_Message =
                  "Showing leads Where Send To QC Date is Delayed";
              }
              if (this.dash_filter === "qc_approved_date_expected_delayed") {
                this.dash_filter_Message =
                  "Showing leads Where QC Approve Date is Delayed";
              }
              if (
                this.dash_filter === "sent_to_production_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Push To Production Date is Delayed";
              }
            }
            this.msgError = false;
            this.current_page = res.current_page;
            this.total_page = res.zero_to_40_count;
            this.per_page = 10;
            this.projectForty = res.post_40_count;
            this.closureValue = res.closure_collected_amount;
            this.forty_prod_value = res.production_quotation_value;
            this.handedOverProjects = res.handed_over_count;
            this.forty_collec_value = res.production_quotation_collection;
            this.handover_prod_value= res.handover_production_value;
            this.handover_collection_value= res.handover_collection_value;
            this.snagFulldata = res
            // this.messageEvent.emit({ name1:res.zero_to_40_count, name2: res.post_40_count});
            // this.abcevent.emit({ name3:res.closure_collected_amount, name4: res.production_quotation_value, name5: res.production_quotation_collection});
            this.loaderService.display(false);
          }
        }
      });
  }

  toggle_value=false;
  toggle_button(event) {
    this.toggle_value = event.target.checked;
   
    this.getItems(
      1,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      this.toggle_value
    );
  }
  date_from:any;
  date_to:any;
  status_by_order :any
  Filterstatus(e){
    this.status_by_order = e.target.value
    console.log(this.status_by_order)
    this.ApplyFilters()
  }
  FilterLeads(e){
    this.ob_category = e.target.value
    console.log(this.ob_category)
    this.ApplyFilters()
  }

  ShowExport : boolean = false

  NocExport(e){
    console.log(this.state2)
    if(e.target.value){
      this.ShowExport = true
    }
  }
  exportNoc(){
    if(this.state2 == 'lead_export'){
      this.downloadLeadData('&send_file=')
    }else if(this.state2 == 'boq_export'){
      this.downloadLeadData('&send_boq_file=')
    }else {
      $("#downloadOrderPipeline").modal("show");
    }
  }

  resetorderpipeline(){
    this.date_to = ''
    this.date_from = ''
    this.state2 = 'NOC Export'
    this.ShowExport = false
  }
  changeDateFrom(val) {
    this.date_from = val;
    console.log(this.date_from) 
    if(this.date_from && this.date_to){
      this.ApplyFilters()
    }
  }

  changeDateTo(val) {
    this.date_to = val;
    if(this.date_from && this.date_to){
      this.ApplyFilters()
    }
    console.log(this.date_to)
  }

  toggle_project: any ;
  filterItems() {
    console.log("hiii")
    this.getItems(
      1,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    );
  }
  toggle_button_active(event) {
    this.toggle_project = event.target.checked;
    this.getItems(
      1,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      this.toggle_project
    );
  }
  toggle_button_activePro(event,data) {
    this.toggle_project = event.target.checked;

    if(this.toggle_project){

      this.priorityData(data.lead_id)

    } else{
      this.removepriorityData(data.lead_id)
    }


   
  }

  removedashboard() {
    this.router.navigate([], {
      queryParams: {
        dashboard_filter: null,
      },
      queryParamsHandling: "merge",
    });
    this.getItems(1, "", "", 1, 1, 1, 1,"", "", "", "", "", "", "", "", 1);
  }

  cascading_items;
  showDetails: boolean = true;
  getBOQdetails(leadId: any, index: any) {
    this.cascading_items = [];
    // this.showDetails = false;
    this.leadService.getBOQDetails(leadId).subscribe((response) => {
      this.cascading_items = response.quotations;
      if (response.quotations.length === 0) {
        // $('.location').hide()
        // $('#Location' + index).hide();
        this.showDetails = false;
        alert("No BOQ Data Present");
        $(".location").hide();
      } else {
        this.showDetails = true;
      }
    });
  }
  priorityValue: any = ''
  value: any;
  getfeatured(data: any) {
  
    this.priorityValue = data;
   
  }
  getPriority(data: any) {
  
    this.priorityValue = data;
  
  }
 getfeaturedliving(data: any) {
  
  this.featuredLiving = data;
   
  }

  getHotLeadFilter(data :any){
    this.leadHotValue  = data
   
  }

  obj_list: any;
  successalert:any=false;
  successMessage2:any=''
  featureddata(lead_id: any) {
    this.priorityValue='';
    var result = confirm("This Lead will be added to featured");
    if (result==true){
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.leadService.addToFeatured(this.obj_list).subscribe((res) => {
      $(window).scrollTop(0);
      setTimeout(function () {}.bind(this), 2000);
      this.getItems(
        this.current_page,
        "",
        "true",
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      );
    });
    this.successalert = true;
    this.successMessage2 ="Lead added to featured !";
    setTimeout(() => {
      this.successalert = false;
    }, 5000);
  }
  }

  removefeatureddata(lead_id: any) {
    this.priorityValue='';
    var result = confirm("This Lead will be removed from featured");
    if (result==true){
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.leadService.removefromFeatured(this.obj_list).subscribe((res) => {
      $(window).scrollTop(0);
      setTimeout(function () {}.bind(this), 2000);
      this.getItems(
        this.current_page,
        "",
        "false",
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      );
    });
    this.successalert = true;
    this.successMessage2 ="Lead Removed From Featured !";
    setTimeout(() => {
      this.successalert = false;
    }, 5000);
  }
  }

  priorityData(lead_id: any) {
    var result = confirm("This Lead will be added to priority");
if(result==true){
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.priorityValue = 'true'
    this.featured=null;
    this.leadService.addToPriority(this.obj_list).subscribe((res) => {
      $(window).scrollTop(0);
      setTimeout(function () { }.bind(this), 2000);
      this.getItems(
        this.current_page,
        "",
        "prio",
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        "", 
        "",
        "",
        "",
        "true"
      );
    });
    this.successalert = true;
    this.successMessage2 ="Lead Added to Priority !";
    setTimeout(() => {
      this.successalert = false;
    }, 5000);
  }
  }
  removepriorityData(lead_id: any) {
    var result = confirm("This Lead will be removed from priority");
if (result==true){
    this.priorityValue=''
    this.featured=null;
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.leadService.removefromPriority(this.obj_list).subscribe((res) => {
      $(window).scrollTop(0);
      setTimeout(function () { }.bind(this), 2000);
      this.getItems(
        this.current_page,
        "",
        "",
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "false"
      );
    });
    this.successalert = true;
    this.successMessage2 ="Lead Removed From Priority !";
    setTimeout(() => {
      this.successalert = false;
    }, 5000);
  }
  }

  // expanded: boolean;
  toggleRow(data, i) {
    data.expanded = !data.expanded;
    $(".location").hide();
    $("#Location" + i).show();
    // data.expanded = !data.expanded;
  }
  expansion: boolean;
  toggleRow1(id) {
    id.expansion = !id.expansion;
  }

  tenData: any;
  tenpayment(data: any) {
    this.tenData = data;
  }

  fortyData: any;
  fortypayments(data: any) {
    this.fortyData = data;
  }

  firstMeetingData: any;
  firstmeeting(data: any) {
    this.firstMeetingData = data[0];
  }

  tenquoteData: any;
  tenquotepayment(data: any) {
    this.tenquoteData = data;
  }

  fortyquoteData: any;
  fortyquotepayment(data: any) {
    this.fortyquoteData = data;
  }

  searched_value: any;
  searchFilter(term: any) {
    this.searched_value = this.searchstring
    if (this.searched_value !== "") {
      this.getItems(
        1,
        this.searched_value,
        this.featured,
        1,
        1,
        1,
        1,
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      );
    } else if (this.searched_value === "") {
      this.getItems(1, 1, this.featured, 1, 1, 1, 1,"", "", "", "", "", "", "");
    }
  }
  getGMList() {
    this.leadService.getGMList(this.current_user_id).subscribe((res) => {
      this.gm_dropdownList = res.gms_list?res.gms_list:[];
      this.gm_dropdownList = this.gm_dropdownList.map((item) => {
        return {
          id: item.id,
          itemName: item.item_name,
        }; 
      });
    });
  }
  getSMList() {
    this.leadService.getSMLists().subscribe((res) => {
      this.sm_dropdownList = res.sales_managers;
      this.sm_dropdownList = this.sm_dropdownList.map((item) => {
        return {
          id: item.id,
          itemName: item.name,
        }; 
      });
    });
  }

  gmlist;
  getCMList(id: any) {
    this.gmlist = id;
    this.leadService
      .getCMList(this.current_user_id, this.gmlist)
      .subscribe((res) => {
        this.cm_dropdownList = res.cms_list?res.cms_list:[];
        this.cm_dropdownList = this.cm_dropdownList.map((item) => {
          return {
            id: item.id,
            itemName: item.item_name,
          };
        });
        // this.getItems(1,'',this.featured,this.gmlist)
      });
  }

  cmlist;
  getDesignerList(id: any) {
    this.cmlist = id;
    this.leadService
      .getDesignerListNOC(this.current_user_id, this.cmlist)
      .subscribe((res) => {
        this.designer_dropdownList = res.designers_list?res.designers_list:[];
        this.designer_dropdownList = this.designer_dropdownList.map((item) => {
          return {
            id: item.id,
            itemName: item.item_name,
          };
        });
      });
  }

  cms;
  selectedCmItems = [];
  gms;
  sms;
  designers;
  selectedDesignerItems = [];
  onItemSelect(items, textVal?, index?) {
    if (textVal == "cm" && index == 1) {
      this.cms = [];
      for (var k = 0; k < this.selectedCmItems.length; k++) {
        this.cms.push(this.selectedCmItems[k].id);
      }

      this.cmValue = this.cms

      this.getDesignerList(this.cms);
     
    }
    //  this.getDAYData();
    //  this.getCMsAndDesForCity();

    // }
    else if (textVal == "designer" && index == 2) {
      this.designers = [];
      for (var k = 0; k < this.selectedDesignerItems.length; k++) {
        this.designers.push(this.selectedDesignerItems[k].id);
      }
      this.designerValue =  this.designers
      
    }
    if (textVal == "gm"  && index == 3) {
      this.gms = [];
      for (var k = 0; k < this.selectedGmItems.length; k++) {
        this.gms.push(this.selectedGmItems[k].id);
      }

      this.gmValue = this.gms

      this.getCMList(this.gms);
     
      // this.getDAYData();
      // this.getCMsAndDesForCity();
    }
    if (textVal == "sm"  && index == 3) {
      this.sms = [];
      for (var k = 0; k < this.selectedSmItems.length; k++) {
        this.sms.push(this.selectedSmItems[k].id);
      }

      this.smValue = this.sms

      this.getCMList(this.sms);
     
      // this.getDAYData();
      // this.getCMsAndDesForCity();
    }
    if (textVal == "store" && index == 5) {
      this.Stores = [];
      for (var k = 0; k < this.selectedStores.length; k++) {
        this.Stores.push(this.selectedStores[k].id);
      }
     
    }
  }
  OnItemDeSelect(items, textVal?, index?) {
    if (textVal == "gm" && index == 3) {
      for (var k = 0; k < this.gms.length; k++) {
        if (items.id == this.gms[k]) {
          this.gms.splice(k, 1);
        }
      }
      if (textVal == "cm" && index == 1) {
        for (var k = 0; k < this.cms.length; k++) {
          if (items.id == this.cms[k]) {
            this.cms.splice(k, 1);
          }
        }
      }
      if (textVal == "designer" && index == 2) {
        for (var k = 0; k < this.designers.length; k++) {
          if (items.id == this.designers[k]) {
            this.designers.splice(k, 1);
          }
        }
      }
    }
    if (textVal == "sm" && index == 3) {
      for (var k = 0; k < this.sms.length; k++) {
        if (items.id == this.sms[k]) {
          this.sms.splice(k, 1);
        }
      }
      if (textVal == "cm" && index == 1) {
        for (var k = 0; k < this.cms.length; k++) {
          if (items.id == this.cms[k]) {
            this.cms.splice(k, 1);
          }
        }
      }
      if (textVal == "designer" && index == 2) {
        for (var k = 0; k < this.designers.length; k++) {
          if (items.id == this.designers[k]) {
            this.designers.splice(k, 1);
          }
        }
      }
    }
    if (textVal == "store" && index == 5) {
      for (var k = 0; k < this.Stores.length; k++) {
        if (items.id == this.Stores[k]) {
          this.Stores.splice(k, 1);
        }
      }
    }
  }
  onSelectAll(items) {}
  onDeSelectAll(items) {}

  ClearGmFilter() {
    this.selectedGmItems = [];
    this.gms = [];
   
  }

  ClearCmFilter() {
    this.selectedCmItems = [];
    this.cms = [];
    
  }

  ClearSmFilter() {
    this.selectedSmItems = [];
    this.sms = [];
    
  }
  CleardesignerFilter() {
    this.selectedDesignerItems = [];
    this.designers = [];
   
  }

  ClearAreaFilter() {
    this.featured = false;
    this.priorityValue='';
   
  }
  ClearAreaLivingFilter() {
    this.featuredLiving = "";
    this.leadHotValue = ""
   
  }



  delayed_data: any = 1;
  redflagclick(delayed) {
    this.delayed_data = delayed;
    this.item_delayed = delayed;

  }

  date_values: any;
  getColumnFilterValues() {
    this.leadService.getColumnfilterdate().subscribe((res) => {
      this.date_values = res;
    });
  }

  date_dropdown;
  dateDropDownChanged(event: any) {
    this.date_dropdown = event;
  }
  final_from_date;
  final_to_date;
  submitByDate() {
    if (this.from_date) {
      var todayTime = this.from_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_from_date = day + "-" + month + "-" + year;
    }
    if (this.to_date) {
      var todayTime = this.to_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_to_date = day + "-" + month + "-" + year;
    }
  }
  submitByOrder() {
    if (this.date_from) {
      var todayTime = this.date_from;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.date_from = day + "-" + month + "-" + year;
    }
    if (this.date_to) {
      var todayTime = this.date_to;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.date_to = day + "-" + month + "-" + year;
    }
  }

  ClearDateFilter() {
    this.item_start_date = "";
    this.item_end_date = "";
    this.item_date_column = "";
    this.from_date = "";
    this.to_date = "";
    this.date_dropdown = "";
  
  }
  ClearFlagFilter() {
    this.delayed_data = 1;
  
  }

  downloadLeadData(typeOfExport) {
    this.send_order_pipeline = ''
    this.loaderService.display(true);
    this.leadService.getListwithType(
       this.allowed_items,
      this.current_page,
      10,
     this.searchstring,
      this.featured,
      this.gmValue,
      this.cmValue,
      this.smValue,
      this.designerValue,
      this.item_delayed,
      this.final_from_date,
      this.final_to_date,
      this.date_dropdown,
      true,
      this.sorting_col,
      this.sorting_ord,
      this.date_type,
      this.dash_filter,
      this.scheduled,
      this.active_projects,
      this.Stores,
      this.featuredLiving,
      this.priorityValue,
      this.leadHotValue,
      this.delayLeads ,
      typeOfExport,
      this.status_by_order,
      this.date_from,
      this.date_to,
      this.send_order_pipeline,
      this.ob_category     
      
      ).subscribe(res=>{
        if (res.success === true) {
          this.successError = true;
          if (
            res.message ==
            "You will receive the report in email once it is ready."
          ) {
            this.ShowExport = false
            this.state2 = 'NOC Export'
            this.successMessage = res.message;
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              6000
            );
            this.loaderService.display(false);
          } else {
            this.successMessage =
              "The report you requested is being created. It will be emailed to you once completed.!";
              this.ShowExport = false
              this.state2 = 'NOC Export'
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              6000
            );
            this.loaderService.display(false);
          }
        }
      })

   
  }

  scheduleToday() {
    this.getItems(
      1,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      true,
      "",
      "",
      "",
      "",
      true
    );
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

  sort1: any;
  sort2: any;
  orderChange(id: any, id2: any) {
    this.getItems(1, "", "", "", "","", "", "", "", "", "", "", id, id2);
  }

  date_type_filter;
  changeDateType(value) {
    this.date_type_filter = value;
    this.getItems(1, "", "", "", "", "", "","", "", "", "", "", "", "", value);
  }

  lead;
  ownrable_id;
  date_name;
  current_date;
  changeexpexteddate(event1, event2, event3, event4) {
   
    $("#expectedDateModal").modal("show");
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

  dateDetails(data) {
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
        this.getItems(
          this.current_page,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
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

  leads;
  ownrable_ids;
  date_names;
  current_dates;
  index;
  note_details;
  changeexpexteddateQuote(event1) {
    $("#expectedDatesModal").modal("show");
    this.leads = event1;
    // this.ownrable_ids = event2;
    this.date_names = this.boq_display_date;
     
    // this.index = event5;
    this.current_dates = this.boq_expect_date;
  }

  dateDetailss(obj) {
    this.loaderService.display(true);
    this.leadService
      .changeLeadDate(
        this.leads,
        this.ownrable_ids,
        this.date_names,
        obj.date_details,
        this.reason_dropdowns,
        obj.note_details
      )
      .subscribe(
        (res) => {
          $("#fmailsModal").modal("hide");
          $("#expectedDatesModal").modal("hide");

          // if user will be update expected date then delay lead popup should be update on every page(local data(loacalstorage) will be update through api calling)
          if(localStorage.getItem('user') == 'designer'){
            localStorage.setItem('delay_list', JSON.stringify([]))
          }
          // if user will be update expected date then delay lead popup should be update on every page(local data(loacalstorage) will be update through api calling)

          this.loaderService.display(false);
          this.successError = true;
          this.createClassificationsForm.reset();
          this.successMessage = "Date has been Updated";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            3000
          );
          // window.location.reload();
          this.getItems(
            this.current_page,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          );
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  message;
  projectForty;
  activateTab(tab) {
    this.selectedTab = tab;
    switch (tab) {
      case "zero_to_forty":
        this.activeTab = "0-50%";
        break;
      case "forty_to_hundred":
        this.activeTab = "40-100%";
        break;
    }
  }

  reason_dropdown;
  reasonDropDownChanged(event) {
    this.reason_dropdown = event;
  }

  reason_dropdowns;
  reasonDropDownsChanged(event) {
    this.reason_dropdowns = event;
  }

  first_data;
  second_data;
  boq_data;
  boq_data2;
  getDelayedboqData() {
    $("#expectedDatesReasonBOQModal").modal("show");
  }

  lead_ideal_date;
  lead_expect_date;
  lead_actual_date;
  lead_display_date;
  log_display_val: any = "";
  show_expect_value: boolean = false;
  deleayd_days: any = "";
  deleayd_days_boq: any = "";
  designIterationStartDate = null;

  getNodeDetail(event, event2, event3, event4, delayed, designIteration:any | null = null) {
    this.designIterationStartDate = designIteration;
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
    $("#fmailModal").modal("show");
  }


  closefmail() {
    $("#fmailModal").modal("hide");
    this.show_expect_value = false;
  }

  boq_ideal_date;
  boq_expect_date;
  boq_actual_date;
  boq_display_date;
  boq_detail_obj;
  show_expect_value_boq: boolean = false;
  log_boq_value: any = "";
  show_log: boolean = false;
  getNodeDetailBOQ(event, event2, event3, event4, event5, delayed) {
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
    this.log_boq_value = event5;
    if (this.log_boq_value.length > 0) {
      this.show_log = true;
    } else {
      this.show_log = false;
    }
    $("#fmailsModal").modal("show");
  }

  closefamils() {
    $("#fmailsModal").modal("hide");
    this.show_expect_value_boq = false;
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

  runJob(event) {
    this.loaderService.display(true);
    this.leadService.runJob(event).subscribe((res) => {
      this.loaderService.display(false);
      this.successError = true;
      this.successMessage = "Job ran Successfully";
      setTimeout(
        function () {
          this.successError = false;
        }.bind(this),
        3000
      );
      this.getItems(
        this.current_page,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      );
    });
  }
  snagFulldata
  setTodayDate() {
    this.from_date = new Date();
    this.to_date = new Date();
    this.final_from_date = new Date();
    this.final_to_date = new Date();
    this.NotTodayButton = true;
  }
  private _trasformDateType(dateValue) {
    return moment(dateValue).format("DD-MM-yyyy");
  }
  selectedStores: any = [];
  Stores: any = [];
  ClearStoreFilter() {
    this.selectedStores = [];
    this.Stores = [];
  }

  getAllStores() {
    this.generalManagerService.getAllStoresByrole().subscribe(
      (res) => {
        this.Store_dropdownList = res;
      },
      (err) => {
        this.Store_dropdownList = [];
      }
    );
  }
  dataForOrderPipeLine :any
  orderPipelineData(id){
    this.loaderService.display(true)
    this.generalManagerService.orderPipeLineData(id).subscribe(
      (res) => {
        this.loaderService.display(false)
        this.dataForOrderPipeLine = res.data
      },(err) => {
        this.loaderService.display(false)
      }
    )
  }
  featuredLiving: any = "";

  boqView(data){ 

    const host: string =  location.origin;
    const url: string = host  + String(this.router.createUrlTree(['/boq-view-noc'], { queryParams: {
      lead_name: data.customer_name,
      Lead_id: data.lead_id,
      tab_type: 'ZeroToForty'
    } }));
    window.open(url, '_blank');

   console.log(url)

   

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

  modalforFilter(){
    $("#ModalFilter").modal("show");

  } 
  
  FeaturedSelect(e){

    if(e.target.value == 'all'){
      this.getfeatured('')
    } else {
      if( e.target.value == 'featured'){
        this.getfeatured('true')


      } else{
        if(e.target.value == 'featured'){
          this.getfeatured('false')

        } else{

          this.getPriority('true')

        }
      }
    }


  }
  LivingSelect(e){
    if(e.target.value=='all'){
      this.getfeaturedliving('')

    } else{
      this.getfeaturedliving('yes')
    }
    

  }
  HotleadsSelect(e){
    if(e.target.value=='all'){
      this.getHotLeadFilter('')
       
    } else{
     this.getHotLeadFilter('true');
    }
    
    

  }
  send_order_pipeline : any
  exportOrderPipeLine(){
    this.send_order_pipeline = true
    this.submitByOrder()
    this.ApplyFilters()
    this.resetorderpipeline()
    $("#downloadOrderPipeline").modal("hide");
    
  }

  ApplyFilters(){
    console.log('apply filters')
    console.log(this.status_by_order);
    
    $("#ModalFilter").modal("hide");
    this.NotTodayButton = false;
    this.submitByDate()
    this.loaderService.display(true);
    this.gmValue = this.gms;
    this.smValue = this.sms==undefined?'':this.sms
    this.cmValue = this.cms;
    this.designerValue = this.designers
    this.searched_item = this.searched_item?this.searched_item:"";
    this.delayLeads = this.delayLeads?this.delayLeads:"";
    this.date_dropdown =this.date_dropdown?this.date_dropdown:"";
    this.final_from_date =this.final_from_date?this.final_from_date:"";
    this.final_to_date = this.final_to_date?this.final_to_date:"";
    this.IsApplyBtn = true;
    this.gmValue = this.gms;
    this.cmValue = this.cms;
    this.smValue = this.sms==undefined?'':this.sms
    this.designerValue = this.designers
    this.ob_category=this.ob_category

    this.leadService.getListwithType(
      this.allowed_items,
      this.current_page,
      10,
     this.searchstring,
      this.featured,
      this.gmValue,
      this.cmValue,
      this.smValue,
      this.designerValue,
      this.item_delayed,
      this.final_from_date,
      this.final_to_date,
      this.date_dropdown,
      this.send_file,
      this.sorting_col,
      this.sorting_ord,
      this.date_type,
      this.dash_filter,
      this.scheduled,
      this.active_projects,
      this.Stores,
      this.featuredLiving,
      this.priorityValue,
      this.leadHotValue,
      this.delayLeads,
      '&send_file=',
      this.status_by_order,
      this.date_from,
      this.date_to,
      this.send_order_pipeline, 
      this.ob_category ,    
    ).subscribe((res) => {
      this.last_page=res.last_page;
     

      if (res.success === true) {
        this.successError = true;
        if (
          res.message ==
          "You will receive the report in email once it is ready."
        ) {
          this.successMessage = res.message;
          this.send_order_pipeline = ''
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
          this.loaderService.display(false);
        } else {
          this.successMessage =
            "The report you requested is being created. It will be emailed to you once completed.!";
            this.send_order_pipeline = ''
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
          this.loaderService.display(false);
        }
      } else {
        this.items = res.lead_noc_data;
        if (this.items.length === 0) {
          this.msgError = true;
          this.errorMessage = "No Lead Data Found";
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            7000
          );
          this.current_page = res.current_page;
          this.total_page = res.zero_to_40_count;
          this.per_page = 10;
          this.projectForty = res.post_40_count;
          this.closureValue = res.closure_collected_amount;
          this.forty_prod_value = res.production_quotation_value;
          this.handedOverProjects = res.handed_over_count;
          this.forty_collec_value = res.production_quotation_collection;
          this.handover_prod_value= res.handover_production_value;
          this.handover_collection_value= res.handover_collection_value;
          this.snagFulldata = res;
        
          // this.messageEvent.emit({ name1:res.zero_to_40_count, name2: res.post_40_count});
          // this.abcevent.emit({ name3:res.closure_collected_amount, name4: res.production_quotation_value, name5: res.production_quotation_collection});
          this.loaderService.display(false);
        }
        if (this.searched_item !== "") {
          $("#searchtext12").val(this.searched_item);
          this.loaderService.display(false);
          this.current_page = res.current_page;
          this.total_page = res.zero_to_40_count;
          this.per_page = 10;
          this.projectForty = res.post_40_count;
          this.closureValue = res.closure_collected_amount;
          this.forty_prod_value = res.production_quotation_value;
          this.handedOverProjects = res.handed_over_count;
          this.forty_collec_value = res.production_quotation_collection;
          this.handover_prod_value= res.handover_production_value;
          this.handover_collection_value= res.handover_collection_value;
        } else {
          if (this.dash_filter !== "" && this.dash_filter !== undefined) {
            this.dashboardMsg = true;
            if (this.dash_filter === "3_plus_meeting_leads") {
              this.dash_filter_Message =
                "Showing leads Where 3+ Meeting Leads are Present";
            }
            if (
              this.dash_filter === "site_measurement_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Expected Site Measurement Date is Delayed";
            }
            if (
              this.dash_filter === "material_selection_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Expected Material Selection Date is Delayed";
            }
            if (
              this.dash_filter === "material_selection_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Expected Material Selection Date is Delayed";
            }
            if (
              this.dash_filter === "site_validation_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Expected Site Validation Date is Delayed";
            }
            if (this.dash_filter === "qc_request_date_expected_delayed") {
              this.dash_filter_Message =
                "Showing leads Where Send To QC Date is Delayed";
            }
            if (this.dash_filter === "qc_approved_date_expected_delayed") {
              this.dash_filter_Message =
                "Showing leads Where QC Approve Date is Delayed";
            }
            if (
              this.dash_filter === "sent_to_production_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Push To Production Date is Delayed";
            }
          }
          this.msgError = false;
          this.current_page = res.current_page;
          this.total_page = res.zero_to_40_count;
          this.per_page = 10;
          this.projectForty = res.post_40_count;
          this.closureValue = res.closure_collected_amount;
          this.forty_prod_value = res.production_quotation_value;
          this.handedOverProjects = res.handed_over_count;
          this.forty_collec_value = res.production_quotation_collection;
          this.handover_prod_value= res.handover_production_value;
          this.handover_collection_value= res.handover_collection_value;

          // this.messageEvent.emit({ name1:res.zero_to_40_count, name2: res.post_40_count});
          // this.abcevent.emit({ name3:res.closure_collected_amount, name4: res.production_quotation_value, name5: res.production_quotation_collection});
          this.loaderService.display(false);
        }
      }
    });
  }
  SetUpDrop:any='';
  NotTodayButton:any = true
  clearFilters(){
    
    this.ClearGmFilter();
    this. ClearCmFilter()
    this.ClearSmFilter();
    this. CleardesignerFilter();
    this. ClearAreaFilter();
    this.ClearAreaLivingFilter();
    this.ClearDateFilter();
    this.ClearStoreFilter();
    this.featuredsel ='all';
    this.hotsel ='all';
    this.livingsel ='all';
    this.searchstring ="";
    this.delayed_data = 1;
    this.final_from_date ='';
    this.final_to_date ='';
    this.featuredLiving = '';
    this.gmValue ='';
    this.cmValue ='';
    this.smValue ='';
    this.designerValue ='';
    this.date_dropdown ='';
    this.SetUpDrop =''
    this.NotTodayButton = true;
    this.SetUpDrop =''
    this.item_delayed = ''
    this.IsApplyBtn = false;
    this.date_from = '',
    this.date_to = ''
    this.status_by_order = ''
    this.send_order_pipeline = ''
    this.state = 'all'
    this.ob_category = 'all'
    this.category = 'all'

    this.state2= 'NOC Export'
    

    this.getItems(
      1,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    );
    
    



  }

  featuredsel:any='all';
  hotsel:any='all'
  livingsel:any='all'
  searchstring:any;
  DeatilsOfLead:any;
  number_of_weeks = ''

  showLeadDetails(data){
    $("#ModalLeadDetails").modal("show");

    this.DeatilsOfLead = data
    

  }
  IsApplyBtn = false;

  FilterNames:any =[]
  filttersCountGetter(){

    this.FilterNames = [];


    let count = 0;
    if(this.IsApplyBtn){

      if(this.final_from_date && this.final_from_date != '' && this.final_to_date && this.final_to_date != '' &&  this.date_dropdown  && this.date_dropdown != '' && !this.NotTodayButton ){
        count++
        this.FilterNames.push('Date Filter')
       
      }
      if (this.delayed_data && this.delayed_data != 1){
        count++
  
        this.FilterNames.push('Delay Filter')
        
  
      } 
  
      if( this.gmValue && this.gmValue != '') {
       
        count ++
        this.FilterNames.push('GM Filter')
      }
      if( this.smValue && this.smValue != '') {
       
        count ++
        this.FilterNames.push('SM Filter')
      }
      if( this.cmValue && this.cmValue != '') {
      
        count ++
  
       this.FilterNames.push('CM Filter')
        
      }
      if( this.designerValue && this.designerValue != '') {
       
        count ++
  
        this.FilterNames.push('Designer Filter')
      }
     
      if( this.Stores && this.Stores != '') {
       
        count ++
        this.FilterNames.push('Stores Filter')
      }
      if(  this.featuredLiving &&  this.featuredLiving != '') {
      
        count ++
        this.FilterNames.push('Living Filter')
      }
      if( this.priorityValue && this.priorityValue != '') {
        
        count ++
        this.FilterNames.push('Proirity Filter')
      }
      if(  this.leadHotValue &&  this.leadHotValue != '') {
      
        count ++
        this.FilterNames.push('Proirity Filter')
      }
      if( this.delayLeads &&  this.delayLeads != '') {
       
        count ++
        this.FilterNames.push('Lead Delay Filter')
      }
      if( this.featured &&  this.featured != '') {
      
        count ++
        this.FilterNames.push('Featured Filter')
  
      }
      

    }

  
   
    return count
      

  }
  Getpagedata(){
    console.log(this.per_page)
    console.log(this.current_page)
    console.log(this.total_page)
  }
  
}