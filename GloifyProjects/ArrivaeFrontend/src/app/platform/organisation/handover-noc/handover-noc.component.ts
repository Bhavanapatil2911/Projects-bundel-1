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
  selector: 'app-handover-noc',
  templateUrl: './handover-noc.component.html',
  styleUrls: ['./handover-noc.component.css'],
  providers: [LeadService],

})
export class HandoverNocComponent implements OnInit {
  // @Output() projectEvent = new EventEmitter<string>();
  // @Output() cdeevent = new EventEmitter<{ name1: number, name2: number }>();
  startCase = startCase;
  items: any;
  allowed_items = "handed_over";
  current_page: any = 1;
  per_page: any = 10;
  total_page;
  page_number;
  // current_page = '1';
  featured;
  searched_item: any = "";
  closureValue;
  gmValue;
  cmValue;
  smValue;
  designerValue;
  errorMessage: string;
  successMessage: string;
  msgError: boolean = false;
  successError: boolean = false;
  selectedTab_for_tab = "handed_over";

  item_delayed;
  item_start_date;
  item_end_date;
  item_date_column;
  send_file;
  sorting_col;
  sorting_ord;
  selectedGmItems = [];
  selectedSmItems=[];
  current_user_id;
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
  gm_dropdownList = [];
  cm_dropdownList = [];
  sm_dropdownList = [];

  designer_dropdownList = [];
  Store_dropdownList = [];
  role: string;
  from_date;
  to_date;
  date_type;
  dash_filter;
  dashboardMsg;
  dash_filter_Message;
  forty_prod_value;
  handover_prod_value:any;
  handover_collection_value:any;
  selectedTab = "";
  activeTab = "Handover";
  forty_collec_value;
  projectForty;
  scheduled;
  category='all';
  oc_category;
  createClassificationForm: FormGroup;
  createClassificationactualForm: FormGroup;
  createClassificationsForm: FormGroup;
  createClassificationsactualForm: FormGroup;
  @Output() messagefortyEvent = new EventEmitter<number>();
  @Output() abcfortyevent = new EventEmitter<{
    name1: number;
    name2: number;
  }>();
  constructor(
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private generalManagerService: GeneralManagerService
  ) { }

  ngOnInit() {
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
    this.current_page = 1;
    this.current_user_id = localStorage.getItem("userId");
    this.role = localStorage.getItem("user");
    if (this.role === "business_head" || this.role == "store_manager" || this.role == "category_head") {
      this.getGMList();
    }
    if (this.role === "area_sales_manager"  ) {
      this.getSMList();
    }
    if (
      this.role === "city_gm" ||
      this.role === "deputy_general_manager" ||
      this.role === "design_manager" ||
      this.role == "store_manager" || this.role == "category_head" || this.role == "sales_manager"
    ) {
      this.getCMList(this.current_user_id);
    }
    if (this.role === "community_manager" || this.role == "store_manager" || this.role == "category_head") {
      this.getDesignerList(this.current_user_id);
    }
    this.route.queryParams.subscribe((params) => {
      this.dash_filter = params["dashboard_filter"];
    });

    this.getColumnFilterValues();
    this.getValidReason();
    this.getItems(1, "", "", 1, 1, 1, 1,"", "", "", "", "", "", "");
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

  projectHanded: any;
  snagFulldata
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
    priority?
  ) {
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
    if (featured === 1) {
      featured = this.featured;
    }
    if (featured === "prio") {
      featured = null
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
    if (scheduled === true) {
      this.scheduled = true;
    }
    if (scheduled !== true) {
      this.scheduled = "";
    }
    this.current_page = pageno;
    this.featured = featured;
    this.per_page = 10;
    this.loaderService.display(true);
    this.leadService
      .getListwithTypeforty(
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
        this.item_date_column,
        this.send_file,
        this.sorting_col,
        this.sorting_ord,
        this.date_type,
        this.dash_filter,
        this.scheduled,
        this.Stores,
        this.featuredLiving,
        priority,
        '&send_file=',
        this.oc_category
      )
      .subscribe((res) => {
        this.projectHanded= 0;
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
            this.forty_collec_value = res.production_quotation_collection;
            this.handover_prod_value= res.handover_production_value;
            this.handover_collection_value= res.handover_collection_value;
            this.snagFulldata = res
            // this.projectEvent.emit(this.total_page);
            // this.messagefortyEvent.emit(res.post_40_count);
            // this.abcfortyevent.emit({ name1: this.closureValue, name2: res.production_quotation_collection });
            // this.cdeevent.emit({ name1:this.closureValue, name2:res.production_quotation_collection });
            this.loaderService.display(false);
          } else {
            if (this.dash_filter !== "" && this.dash_filter !== undefined) {
              this.dashboardMsg = true;
              if (
                this.dash_filter === "sent_to_production_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Sent To Production Date is Delayed";
              }
              if (this.dash_filter === "service_start_date_expected_delayed") {
                this.dash_filter_Message =
                  "Showing leads Where Service Start Date is Delayed";
              }
              if (this.dash_filter === "service_per_50_date_expected_delayed") {
                this.dash_filter_Message =
                  "Showing leads Where Service 50% Date is Delayed";
              }
              if (
                this.dash_filter === "service_per_100_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Site Readiness Date is Delayed";
              }
              if (
                this.dash_filter === "project_handover_date_expected_delayed"
              ) {
                this.dash_filter_Message =
                  "Showing leads Where Project Handover Date is Delayed";
              }
            }
            this.msgError = false;
            this.current_page = res.current_page;
            this.total_page = res.zero_to_40_count;
            this.per_page = 10;
            this.projectForty = res.post_40_count;
            this.projectHanded = res.handed_over_count;
            this.closureValue = res.closure_collected_amount;
            this.forty_prod_value = res.production_quotation_value;
            this.handover_prod_value= res.handover_production_value;
            this.handover_collection_value= res.handover_collection_value;
            this.forty_collec_value = res.production_quotation_collection;
            this.snagFulldata = res
            // this.messagefortyEvent.emit(res.post_40_count);
            // this.abcfortyevent.emit({ name1:this.closureValue, name2:res.production_quotation_collection })
            this.loaderService.display(false);
          }
        }
      });
  }

  // toggle_value;
  // toggle_button(event) {
  //   this.toggle_value = event.target.checked;
  //   this.getItems(
  //     1,
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     this.toggle_value
  //   );
  // }

  removedashboard() {
    this.router.navigate([], {
      queryParams: {
        dashboard_filter: null,
      },
      queryParamsHandling: "merge",
    });
    this.getItems(1, "", "", 1, 1, 1, 1,"", "", "", "", "", "", "", "", 1);
  }

  fortyData: any;
  fortypayments(data: any) {
    // this.fortyData = data;
  }

  searched_value: any;
  searchFilter(term: any) {
    this.searched_value = term.target.value;
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
      this.getItems(1, 1, this.featured, 1, 1, 1,1, "", "", "", "", "", "", "");
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

  date_values: any;
  getColumnFilterValues() {
    this.leadService.getColumnfilterdate().subscribe((res) => {
      this.date_values = res;
    });
  }

  cms;
  sms;
  selectedCmItems = [];
  gms;
  designers;
  selectedDesignerItems = [];
  onItemSelect(items, textVal?, index?) {
    if (textVal == "cm" && index == 1) {
      this.cms = [];
      for (var k = 0; k < this.selectedCmItems.length; k++) {
        this.cms.push(this.selectedCmItems[k].id);
      }
      this.getDesignerList(this.cms);
      
    } else if (textVal == "designer" && index == 2) {
      this.designers = [];
      for (var k = 0; k < this.selectedDesignerItems.length; k++) {
        this.designers.push(this.selectedDesignerItems[k].id);
      }
     
    }
    if (textVal == "gm" && index == 3) {
      this.gms = [];
      for (var k = 0; k < this.selectedGmItems.length; k++) {
        this.gms.push(this.selectedGmItems[k].id);
      }
      this.getCMList(this.gms);
      
    }
    if (textVal == "sm" && index == 3) {
      this.sms = [];
      for (var k = 0; k < this.selectedSmItems.length; k++) {
        this.sms.push(this.selectedSmItems[k].id);
      }
      this.getCMList(this.sms);
      
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
    }
    if (textVal == "sm" && index == 3) {
      for (var k = 0; k < this.sms.length; k++) {
        if (items.id == this.sms[k]) {
          this.sms.splice(k, 1);
        }
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

  ClearGmFilter() {
    this.selectedGmItems = [];
    this.gms = [];
   
  } 
  ClearSmFilter() {
    this.selectedSmItems = [];
    this.sms = [];
   
  } 

  ClearCmFilter() {
    this.selectedCmItems = [];
    this.cms = [];
  
  }
  CleardesignerFilter() {
    this.selectedDesignerItems = [];
    this.designers = [];
   
  }

  ClearAreaFilter() {
    this.featured = false;
    this.priorityValue = '';
  
  }
  featuredLiving: any = "";
  ClearAreaLivingFilter() {
    this.featuredLiving = "";
   
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
  downloadLeadData(typeOfExport) {
    this.loaderService.display(true);
    this.leadService
      .getListwithTypeforty(
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
        this.Stores,
        this.featuredLiving,
        "",
        typeOfExport,
        this.oc_category
       
      )
      .subscribe((res) => {
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
        }
      })
   
  }

  sort1: any;
  sort2: any;
  orderChange(id: any, id2: any) {
    this.getItems(1, "", "", "", "", "","", "", "", "", "", "", id, id2);
  }
  delayed_data: any = 1;
  redflagclick(delayed) {
    this.delayed_data = delayed;
    this.item_delayed = delayed;

  }
  ClearFlagFilter() {
    this.delayed_data = 1;

  }

  obj_list: any;
  successalert:any;
  successMessage2:any;
  featureddata(lead_id: any) {
    var result = confirm("This Lead will be added to featured");
    if(result==true){
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.leadService.addToFeatured(this.obj_list).subscribe((res) => {
      $(window).scrollTop(0);
      setTimeout(function () { }.bind(this), 2000);
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
    this.successMessage2 = "Lead Added to featured";
    setTimeout(() => {
      this.successalert = false;
    }, 5000);
  }
  }


  removefeatureddata(lead_id: any) {
    var result = confirm("This Lead will be removed from featured");
    if(result==true){
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.leadService.removefromFeatured(this.obj_list).subscribe((res) => {
      $(window).scrollTop(0);
      setTimeout(function () { }.bind(this), 2000);
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
    this.successMessage2 = "Lead Removed From Featured";
    setTimeout(() => {
      this.successalert = false;
    }, 5000);
  }
  }
  priorityData(lead_id: any) {
    var result = confirm("Lead Added to Priority");
    if(result==true){
    this.obj_list = {
      lead_id: lead_id,
      type: this.allowed_items,
    };
    this.priorityValue = 'true'
    this.featured = null;
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
  }
  }
  removepriorityData(lead_id: any) {
    var result = confirm("Lead Removed From Priority");
    if(result==true){
    this.priorityValue = ''
    this.featured = null;
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
  }
  }
  date_dropdown;
  dateDropDownChanged(event: any) {
    this.date_dropdown = event;
  }

  ClearDateFilter() {
    this.item_start_date = "";
    this.item_end_date = "";
    this.item_date_column = "";
    this.from_date = "";
    this.to_date = "";
    this.date_dropdown = "";
    this.getItems(1, "", "", "","", "", "", "", 1, 1, 1, "", "", "");
  }
  final_from_date;
  final_to_date;
  submitByDate() {
    if (this.from_date ) {
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

  onSelectAll(items) { }
  onDeSelectAll(items) { }

  date_type_filter;
  changeDateType(value) {
    this.date_type_filter = value;
    this.getItems(1, "", "", "", "","", "", "", "", "", "", "", "", "", value);
  }

  cascading_items;
  cascading_items_nonboq;
  showDetails: boolean = true;
  showDetails_non_service: boolean = true;
  cascading_items_Mod_kitch;
  showDetails_Mod_kitch

  getBOQdetails(leadId: any, index: any) {
    this.cascading_items = [];
    this.leadService.getBoqDetailHandover(leadId).subscribe((response) => {
      this.cascading_items = response.quotations;
      if (response.quotations.length === 0) {
        this.showDetails = false;

        $(".location").hide();
      } else {
        this.showDetails = true;
      }
    });
    this.cascading_items_nonboq = [];
    this.leadService
      .getBoqDetailHandovernonservice(leadId)
      .subscribe((response) => {
        this.cascading_items_nonboq = response.quotations;
        if (response.quotations.length === 0) {
          this.showDetails_non_service = false;
          // alert("No BOQ Data Present");
          $(".location_nonservice").hide();
        } else {
          this.showDetails_non_service = true;
        }
      });
    this.leadService
      .getBoqDetailHandoverModularKitchen(leadId)
      .subscribe((response) => {
        this.cascading_items_Mod_kitch = response.quotations;
        if (response.quotations.length === 0) {
          this.showDetails_Mod_kitch = false;
          // alert("No BOQ Data Present");
          $(".location_modularKitchen").hide();
        } else {
          this.showDetails_Mod_kitch = true;
        }
      });
    if (
      this.showDetails === false &&
      this.showDetails_non_service === false &&
      this.showDetails_Mod_kitch == false
    ) {
      alert("No BOQ Data Present");
    }
  }

  toggleRow(data, i) {
    data.expanded = !data.expanded;
    $(".location").hide();
    $("#Location" + i).show();
    data.boq_expanded = !data.boq_expanded;
    $(".location_nonservice").hide();
    $("#Location_boq" + i).show();
  }

  fortyquoteData: any;
  fortyquotepayment(data: any) {
    // this.fortyquoteData = data;
  }

  lead;
  ownrable_id;
  date_name;
  current_date;
  changeexpexteddate(event1) {
    $("#expectedDateModal").modal("show");
    this.lead = event1;
    this.date_name = this.lead_display;
    this.current_date = this.lead_expect_date;
     
    if( this.date_name =='PO Release Date'){
      this.date_name  = 'PO Release'
    }
    if( this.date_name =='Installation Date'){
      this.date_name  = 'Installation'
    }
  }

  current_actual_date;
  changeactualdate(event1) {
    $("#expectedDateActualModal").modal("show");
    this.lead = event1;
    this.date_name = this.lead_display;
    this.current_actual_date = this.lead_actual_date;
     
    if( this.date_name =='PO Release Date'){
      this.date_name  = 'PO Release'
    }
    if( this.date_name =='Installation Date'){
      this.date_name  = 'Installation'
    }

  }
  changeactualdate22(event1, ekk) {
    $("#expectedDateActualModal").modal("show");
    this.lead = event1;
    this.ownrable_id = ekk;
    this.date_name = this.lead_display;
    this.current_actual_date = this.lead_actual_date;
  }

  dateDetails(data) {
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

  dateDetailsactal(data) {
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

  leads;
  ownrable_ids;
  date_names;
  current_dates;
  note_details;
  index;
  changeexpexteddateQuote(event1) {
    $("#expectedDatesModal").modal("show");
    this.leads = event1;
    // this.ownrable_ids = event2;
    this.date_names = this.boq_display_val;
    // this.index = event5;
    this.current_dates = this.boq_expect_date;
  }

  current_dates_boq;
  changeactualdateBOQ(event1) {
    $("#expectedDatesActualModal").modal("show");
    this.leads = event1;
    this.date_names = this.boq_display_val;
    this.current_dates_boq = this.boq_actual_date;
  }

  changeactualdate223(event1, ekk) {
    $("#expectedDatesActualModal").modal("show");
    this.leads = event1;
    this.ownrable_ids = ekk;
    this.date_names = this.boq_display_val;
    this.current_dates_boq = this.boq_actual_date;
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

  note_detail;
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
  getDelayedboqData(event1, event2) {
    this.boq_data = event1;
    this.boq_data2 = event2;
    $("#expectedDatesReasonBOQModal").modal("show");
  }

  lead_ideal_date;
  lead_expect_date;
  lead_actual_date;
  lead_display_date;
  lead_display;
  show_expect_value: boolean = false;
  show_actual_value: boolean = false;
  log_display_val: any = "";
  showpo_table: boolean = false;
  showrm_table: boolean = false;
  poRecievedData: any = [];
  RawMaterialData: any = [];
  RawMaterialDataBoq: any = [];
  deleayd_days: any = "";
  deleayd_days_boq: any = "";
  getNodeDetail(event, event2, event3, event4, delayed, event5?) {
   
   
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
  boq_display;
  boq_display_val;
  boq_detail_obj;
  show_expect_value_boq: boolean = false;
  show_actual_value_boq: boolean = false;
  log_boq_value: any = "";
  show_boq_val: boolean = false;
  boqPoData: any = [];
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
    if (this.boq_display === "Panel Production Start") {
      this.boq_display = "Panel Start";
    }
    if (this.boq_display === "Non Panel Dispatch") {
      this.boq_display = "Select Dispatch";
    }

    if (this.boq_display === "MKW Delivered Date") {
      this.boq_display = "MKW Delivered";
    }
    if (this.boq_display === "FHI Delivered Date") {
      this.boq_display = "FHI Delivered";
    }
    if (this.boq_display === "MTO Delivered Date") {
      this.boq_display = "MTO Delivered";
    }
    if (this.boq_display === "Installation Date") {
      this.boq_display = "Installation";
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
        event2 === "Loose Furniture Dispatch" || event2 === "MKW Start Date" || event2 === "MKW Ready Date" || event2 === "MKW Dispatch Date" ||  event2 === "MKW Delivered Date" || event2 === "FHI Delivered Date" || event2 === "MTO Delivered Date" || event2 === "Installation Date" || event2 === "MTO Ready" || event2 === "FHI Ready") &&
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
        event2 === "Loose Furniture Dispatch") &&
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
        event2 === "Non Panel Dispatch") &&
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
        event2 === "Non Panel Dispatch") &&
      event3.quotation_data.timeline[event2].actual_manual_date !== null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_panel"
    ) {
      this.show_actual_value_boq = false;
    } else if (
      (event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch") &&
      event3.quotation_data.timeline[event2].actual_manual_date === null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_non_panel"
    ) {
      this.show_actual_value_boq = true;
    } else if (
      (event2 === "LF Start" ||
        event2 === "Loose Furniture Dispatch" ||
        event2 === "Select Start" ||
        event2 === "Non Panel Dispatch") &&
      event3.quotation_data.timeline[event2].actual_manual_date !== null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_non_panel"
    ) {
      this.show_actual_value_boq = false;
    } else if (
      (event2 === "Select Start" || event2 === "Non Panel Dispatch") &&
      event3.quotation_data.timeline[event2].actual_manual_date === null &&
      event3.quotation_data.timeline[event2].can_edit === true &&
      this.role === "category_services"
    ) {
      this.show_actual_value_boq = true;
    } else if (
      (event2 === "Select Start" || event2 === "Non Panel Dispatch") &&
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

  setTodayDate() {
    this.from_date = new Date();
    this.to_date = new Date();
    this.final_from_date = new Date();
    this.final_to_date = new Date();
    this.NotTodayButton = true
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

  tenData: any;
  tenpayment(data: any) {
    this.tenData = data;
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
  firstMeetingData: any;
  firstmeeting(data: any) {
    this.firstMeetingData = data[0];
  }

  tenquoteData: any;
  tenquotepayment(data: any) {
    this.tenquoteData = data;
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
 
  featuredsel:any='all';
  hotsel:any='all'
  livingsel:any='all'
  searchstring:any;
  toggle_project:any;
  IsApplyBtn = false;
  ApplyFilters(){
   this.NotTodayButton = false;
   this.IsApplyBtn = true;
   this.gmValue = this.gms;
   this.cmValue = this.cms
   this.smValue = this.sms
   this.designerValue = this.designers

    $("#ModalFilter").modal("hide");
    this.submitByDate();
    this.searched_item = this.searchstring
    this.searched_item = this.searched_item?this.searched_item:"";
    this.date_dropdown =this.date_dropdown?this.date_dropdown:"";
    this.final_from_date =this.final_from_date?this.final_from_date:"";
    this.final_to_date = this.final_to_date?this.final_to_date:"";
    this.loaderService.display(true)
   this.leadService.getListwithTypeforty(
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
      this.Stores,
      this.featuredLiving,
      this.priorityValue,
      '&send_file=',
      this.oc_category
    )
    .subscribe((res) => {
      this.projectHanded= 0;
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
          this.forty_collec_value = res.production_quotation_collection;
          this.handover_prod_value= res.handover_production_value;
          this.handover_collection_value= res.handover_collection_value;
          this.snagFulldata = res
          // this.projectEvent.emit(this.total_page);
          // this.messagefortyEvent.emit(res.post_40_count);
          // this.abcfortyevent.emit({ name1: this.closureValue, name2: res.production_quotation_collection });
          // this.cdeevent.emit({ name1:this.closureValue, name2:res.production_quotation_collection });
          this.loaderService.display(false);
        } else {
          if (this.dash_filter !== "" && this.dash_filter !== undefined) {
            this.dashboardMsg = true;
            if (
              this.dash_filter === "sent_to_production_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Sent To Production Date is Delayed";
            }
            if (this.dash_filter === "service_start_date_expected_delayed") {
              this.dash_filter_Message =
                "Showing leads Where Service Start Date is Delayed";
            }
            if (this.dash_filter === "service_per_50_date_expected_delayed") {
              this.dash_filter_Message =
                "Showing leads Where Service 50% Date is Delayed";
            }
            if (
              this.dash_filter === "service_per_100_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Site Readiness Date is Delayed";
            }
            if (
              this.dash_filter === "project_handover_date_expected_delayed"
            ) {
              this.dash_filter_Message =
                "Showing leads Where Project Handover Date is Delayed";
            }
          }
          this.msgError = false;
          this.current_page = res.current_page;
          this.total_page = res.zero_to_40_count;
          this.per_page = 10;
          this.projectForty = res.post_40_count;
          this.projectHanded = res.handed_over_count;
          this.closureValue = res.closure_collected_amount;
          this.forty_prod_value = res.production_quotation_value;
          this.handover_prod_value= res.handover_production_value;
          this.handover_collection_value= res.handover_collection_value;
          this.forty_collec_value = res.production_quotation_collection;
          // this.messagefortyEvent.emit(res.post_40_count);
          // this.abcfortyevent.emit({ name1:this.closureValue, name2:res.production_quotation_collection })
          this.loaderService.display(false);
        }
      }
    });
 
   

   
  }
  SetUpDrop:any='';
  NotTodayButton:any = true

  clearFilters(){
    this.ClearGmFilter();
    this.ClearSmFilter();
    this. ClearCmFilter()
    this. CleardesignerFilter();
    this. ClearAreaFilter();
    this.ClearAreaLivingFilter();
    this.ClearDateFilter();
    this.ClearStoreFilter();
    this.ClearFlagFilter()
    this.featuredsel ='all';
    this.hotsel ='all';
    this.livingsel ='all';
    this.searchstring ="";
    this.featuredLiving = '';
    this.gmValue ='';
    this.smValue ='';

    this.cmValue ='';
    this.designerValue ='';
    this.NotTodayButton = true;
    this.date_dropdown = '';
    this.SetUpDrop ='';
    this.item_delayed = ''
    this.IsApplyBtn = false;

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
      ""
    );
   
    



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
  boqView(data){

    const host: string =  location.origin;
    const url: string = host  + String(this.router.createUrlTree(['/boq-view-noc'], { queryParams: {
      lead_name: data.customer_name,
      Lead_id: data.lead_id,
      tab_type: 'Handover'
    } }));
    window.open(url, '_blank');
   
   

  }

  DeatilsOfLead:any
 showLeadDetails(data){
    $("#ModalLeadDetails").modal("show");

    this.DeatilsOfLead = data;
    console.log(this.DeatilsOfLead)
    

  }

 
  FilterNames:any =[]
   filttersCountGetter(){

    this.FilterNames = [];


    let count = 0;

    if(this.IsApplyBtn){

      if(this.final_from_date && this.final_from_date != '' && this.final_to_date && this.final_to_date != '' && this.date_dropdown && this.date_dropdown != '' && !this.NotTodayButton    ){
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
      
      if( this.featured &&  this.featured != '') {
      
        count ++
        this.FilterNames.push('Featured Filter')
  
      }
      

    }

   
   
    return count
      

  }

  FilterLeads(e){
    this.oc_category = e.target.value
    console.log(this.oc_category)
    this.ApplyFilters()
  }

 

}