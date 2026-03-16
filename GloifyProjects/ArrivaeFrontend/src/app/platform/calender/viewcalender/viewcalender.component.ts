import { ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  NgModule,
  Pipe,
  ChangeDetectionStrategy, ViewChild }
 from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { DesignerService } from "../../designer/designer.service";
import { CalenderService } from "../calender.service";
import { environment } from "environments/environment";
import { LoaderService } from "../../../services/loader.service";
import { LeadService } from "../../lead/lead.service";
import { flattenStyles } from "@angular/platform-browser/src/dom/dom_renderer";
import { filter } from "lodash";
declare var $: any;

@Component({
  selector: "app-viewcalender",
  templateUrl: "./viewcalender.component.html",
  styleUrls: ["./viewcalender.component.css"],
  providers: [CalenderService, DesignerService, LeadService],
})
export class ViewcalenderComponent implements OnInit {
  @ViewChild('otpForm') otpForm: ElementRef;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  meetingform: FormGroup;
  updatemeetingform: FormGroup;
  markDoneform: FormGroup;
  statusChangeForm: FormGroup;
  createClassificationForm: FormGroup;
  mom: FormGroup;
  statusDetails: any = {};
  todayDate = new Date(new Date().getTime() + 330 * 60000)
    .toJSON()
    .slice(0, 19);
  public latestevent: any;
  public leads: any = [];
  public projectUsers: any;
  public events: any = [];
  public events2: any = [];
  public currentuser: any = localStorage.getItem("userId");
  public calElem: any = $("#calendar");
  public currentEvent: any;
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  designer_list: any;
  role: any;
  loc: any;
  designerId;
  checkStatus: any;
  eventId: any;
  Emails = [];
  view_mom: any;
  mom_status: any;
  is_manualevent: any;

  // Date
  date = new Date();
  y = this.date.getFullYear();
  m = this.date.getMonth();
  from_date: any = new Date(this.y, this.m, 1);
  to_date: any = new Date(this.y, this.m + 1, 0);
  status: any;
  customerDetails: any;
  calEvent: any;
  selectedGmItems = [];
  gm_dropdownSettings = {
    singleSelection: true,
    text: "General Managers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  cm_dropdownSettings = {
    singleSelection: true,
    text: "Community Managers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  designer_dropdownSettings = {
    singleSelection: true,
    text: "Designers",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  gm_dropdownList = [];
  cm_dropdownList = [];
  designer_dropdownList = [];
  user_id: any;
  from_date1: any;
  to_date1: any;
  openpopup:any;
  openDelayLeadPopup:any = false;
  is10percentDone: any;


  meetingFormTwo: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInputTwo') fileInputTwo: ElementRef;

  images:any = [];
  selectedFiles:any = [];

  spaces:any = [];
  selectedSpace:any = '';
  activeIndex:any = 0;

  otpDigits: string[] = new Array(6).fill('');
  resendTimeout: number = 40;
  intervalId: any;
  isFinalDesign: string = 'no'; 

  allSpaceEventDetails:any = {}
  currentSpaceDetails:any = {}

  activeIndexAccordion: number | null = null; 
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scrollPosition: number = 0;
  maxScrollPosition: number = 0;

  @ViewChild('scrollContainerReview') scrollContainerReview!: ElementRef;

  scrollPositionReview: number = 0;
  maxScrollPositionReview: number = 0;

  @ViewChild('imagePaginationTwo') imagePaginationTwo!: ElementRef;
  isImageScrollLeftDisabled: boolean = true;
  isImageScrollRightDisabled: boolean = false; 

  @ViewChild('imagePaginationTwoReview') imagePaginationTwoReview!: ElementRef;
  isImageScrollLeftDisabledReview: boolean = true;   // Initially left scroll button hidden
  isImageScrollRightDisabledReview: boolean = false; // Right scroll button shown

  @ViewChild('imagePagination') imagePagination!: ElementRef;
  isImagePaginationLeftDisabled: boolean = true;
  isImagePaginationRightDisabled: boolean = false;

  @ViewChild('imagePaginationThree') imagePaginationThree!: ElementRef;
  isImagePaginationLeftDisabledThree: boolean = true;
  isImagePaginationRightDisabledThree: boolean = false;


  constructor(
    public activatedRoute: ActivatedRoute,
    public calenderService: CalenderService,
    private loaderService: LoaderService,
    private designerService: DesignerService,
    private leadService: LeadService,
    private ref: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.role = localStorage.getItem("user");
    console.log('this.role',this.role)
    // this.openpopup = localStorage.getItem("openpopup");
    
    // for open delay leads popup on every page
    this.openDelayLeadPopup = true;
    
    this.user_id = localStorage.getItem("userId");
    if (this.role === "business_head") {
      this.getGMList();
    } 
    if (this.role === "city_gm" || this.role === "deputy_general_manager" ) {
      this.getCMList(this.user_id);
    }
    if (this.role === "community_manager") {
      this.getDesignerList(this.user_id);
    }
    this.designerId = localStorage.getItem("userId");
    this.createClassificationForm = new FormGroup({
      date_detail: new FormControl("", [Validators.required]),
      select_value: new FormControl("", [Validators.required]),
      note_detail: new FormControl("", [Validators.required]),
    });
    this.meetingform = new FormGroup({
      project: new FormControl(null, Validators.required),
      ownerable_type: new FormControl(null, Validators.required),
      agenda: new FormControl(null, Validators.required),
      contact_type: new FormControl(null, Validators.required),
      description: new FormControl(),
      scheduled_at: new FormControl(
        new Date(new Date().getTime() + 330 * 60000).toJSON().slice(0, 19)
      ),
      location: new FormControl(),
      email: new FormControl(null, Validators.required),
    });

    this.updatemeetingform = new FormGroup({
      project: new FormControl(null, Validators.required),
      ownerable_type: new FormControl(null, Validators.required),
      agenda: new FormControl(null, Validators.required),
      contact_type: new FormControl(null, Validators.required),
      description: new FormControl(),
      scheduled_at: new FormControl(),
      location: new FormControl(),
      remark: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
    });
    this.markDoneform = new FormGroup({
      remark: new FormControl(null, Validators.required),
      mom_description:new FormControl(null, Validators.required),
      status: new FormControl(""),
      emails: new FormArray([]),

    });
    this.statusChangeForm = new FormGroup({
      reson_for_lost: new FormControl("", Validators.required),
      lost_remarks: new FormControl(""),
    });

    this.mom = new FormGroup({
      mom_description: new FormControl("", Validators.required),
      emails: new FormArray([]),
    });
    this.getDesignerList(this.user_id);
    this.getValidReason();
    // this.getlistagenda();
    this.from_date1 = this.from_date;
    this.to_date1 = this.to_date;
    this.getAllSpaces();
    this.todayDate2 = new Date().toISOString().substring(0,16);

    this.meetingFormTwo = new FormGroup({
      additionalNote: new FormControl("", [Validators.required]),
    });
  }
  todayDate2
  lead_details
  projectstatus:any;
  fetchBasicDetails(id){
    this.leadService.getLeadLogs(id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.projectstatus=this.lead_details.project_details.status  
        this.getlistagenda()

      },
      err => {
        
      }
    );
  }
  getItems(e) {
    if (e !== undefined && e !== "") {
      this.current_page = e;
      // this.delayedLeads(this.current_page);
    }

    if (this.current_page == undefined) {
      this.current_page = 1;
      // this.delayedLeads(this.current_page);
    }
  }

  list_delay_lead:any = [];
  headers_res:any;
  per_page:any = 10;
  total_page:any;
  count:any;
  current_page:any = 1;
  diff1:any;
  diff2:any;
  allLeads:any = false;
  delayedLeads(currentPage){
    this.allLeads = false;
    this.loaderService.display(true);
    this.current_page = currentPage ? currentPage : this.current_page
    const storedLeads = JSON.parse(localStorage.getItem("delay_list"));
    var trigged_at = localStorage.getItem("trigged_at");
    this.diff1 = new Date(trigged_at);
    this.diff2 = new Date();
    const diff = Math.abs(this.diff2 - this.diff1)
    console.log(this.diff1,this.diff2,diff)
    var minutes = Math.floor((diff/1000)/60);
    console.log('minutes',minutes)
    if(storedLeads.length > 0 && minutes < 30){
      this.per_page = 10;
      this.total_page = localStorage.getItem("total_page");
      this.moreData = localStorage.getItem("more_data");
      this.count = localStorage.getItem("count");
      this.list_delay_lead = storedLeads
      console.log("this.list_delay_lead",this.list_delay_lead)
      // this.current_page = localStorage.getItem("current_page")
      $("#delayLeadsModal").modal("show");
      this.loaderService.display(false);
    }else{
      this.calenderService.delayedLeads(this.allLeads).subscribe((res) => {
        $("#delayLeadsModal").modal("show");
        this.loaderService.display(false);
        console.log("delay lead res", res)
        // this.per_page = res.data.per_page;
        this.moreData = res.data.more_data
        this.per_page = 10;
        this.total_page = res.data.total_pages;
        this.count = res.data.count;
        // this.current_page = res.data.current_page;
        this.list_delay_lead = res.data.leads;
        localStorage.setItem("delay_list", JSON.stringify(this.list_delay_lead));
        localStorage.setItem("more_data", JSON.stringify(this.moreData));
        localStorage.setItem("trigged_at", res.data.trigged_at);
        // localStorage.setItem("per_page", this.per_page);
        localStorage.setItem("total_page", this.total_page);
        localStorage.setItem("count", this.count);
        // localStorage.setItem("current_page", this.current_page);

      },
      (error) => {
        this.loaderService.display(false);
      });
    }
  }

  searchDelayLeads:any = '';
  searchFilter(event: any) {
    this.searchDelayLeads = event.target.value
    const storedLeads = JSON.parse(localStorage.getItem("delay_list"));
    if(this.searchDelayLeads != ""){
      this.list_delay_lead = storedLeads.filter((val,idx) => val.lead_id.toString().includes(this.searchDelayLeads) == true || val.lead_name.includes(this.searchDelayLeads) == true)
      console.log("filter data this.list_delay_lead", this.list_delay_lead)
    }else{
      this.list_delay_lead = storedLeads
    }
    
  }


  moreData:any = false;
  loadMoreBtn(){
    this.allLeads = true;
    this.loaderService.display(true);
    this.calenderService.delayedLeads(this.allLeads).subscribe((res) => {
      $("#delayLeadsModal").modal("show");
      this.loaderService.display(false);
      console.log("delay lead res", res)
      // this.per_page = res.data.per_page;
      this.moreData = false;
      this.per_page = 10;
      this.total_page = res.data.total_pages;
      this.count = res.data.count;
      // this.current_page = res.data.current_page;
      this.list_delay_lead = res.data.leads;
      // localStorage.setItem("delay_list", JSON.stringify(this.list_delay_lead));
      localStorage.setItem("trigged_at", res.data.trigged_at);
      // localStorage.setItem("per_page", this.per_page);
      localStorage.setItem("total_page", this.total_page);
      localStorage.setItem("count", this.count);
      // localStorage.setItem("current_page", this.current_page);

    },
    (error) => {
      this.loaderService.display(false);
    });
  }

  redirectNOCBtn(){
    $("#delayLeadsModal").modal("hide");
    this.router.navigate(['/noc-screen/zero-to-forty'],
    {
      queryParams: { delay: true,}
    });
  }
  

  list_agenda: any;
  getlistagenda() {
    this.calenderService.getListofAgenda().subscribe((res) => {
      if(this.projectstatus == "qualified"){
        this.list_agenda = ['PM10:_pre_sales_call'];
        }
      else{
        this.list_agenda = res.agenda;
      }  
    });
  }

  getGMList() {
    this.leadService.getGMList(this.user_id).subscribe((res) => {
      this.gm_dropdownList = res.gms_list;
      this.gm_dropdownList = this.gm_dropdownList.map((item) => {
        return {
          id: item.id,
          itemName: item.item_name,
        };
      });
    });
  }

  gmlist;
  getCMList(id: any) {
    this.gmlist = id;
    if(this.role == 'deputy_general_manager'){

      this.leadService.getFilterListofWIPCMForDM().subscribe((res) => {
        this.cm_dropdownList = res;
        this.cm_dropdownList = this.cm_dropdownList.map((item) => {
          return {
            id: item.id,
            itemName: item.name,
          };
        });
        // this.user_Filter(this.featured,this.gmlist)
      });
     
    } else{

      this.leadService.getCMList(this.user_id, this.gmlist).subscribe((res) => {
        this.cm_dropdownList = res.cms_list;
        this.cm_dropdownList = this.cm_dropdownList.map((item) => {
          return {
            id: item.id,
            itemName: item.item_name,
          };
        });
        // this.user_Filter(this.featured,this.gmlist)
      });
    }
   
    
  }

  cmlist;
  getDesignerList(id: any) {
    this.cmlist = id;
    this.leadService
      .getDesignerListNOC(this.user_id, this.cmlist)
      .subscribe((res) => {
        this.designer_dropdownList = res.designers_list;
        this.designer_dropdownList = this.designer_dropdownList.map((item) => {
          return {
            id: item.id,
            itemName: item.item_name,
          };
        });
      });
  }

  gmValue = "";
  cmValue = "";
  designerValue = "";
  user_Filter(
    actionalble_of,
    gm_list,
    cm_list,
    designer_list,
    from_date?,
    to_date?
  ) {
    if (gm_list === 1) {
      this.gmValue = "";
    } else if (this.gmValue !== "" && gm_list === "") {
      this.gmValue = this.gmValue;
    } else this.gmValue = gm_list;
    if (cm_list === 1) {
      this.cmValue = "";
    } else if (this.cmValue !== "" && cm_list === "") {
      this.cmValue = this.cmValue;
    } else this.cmValue = cm_list;
    if (designer_list === 1) {
      this.designerValue = "";
    } else if (this.designerValue !== "" && designer_list === "") {
      this.designerValue = this.designerValue;
    } else this.designerValue = designer_list;
    if (this.noc_event_value === undefined) {
      this.noc_event_value = "";
    }
    if (from_date !== "" && from_date !== undefined) {
      this.from_date = from_date;
    } else if (from_date === undefined) {
      this.from_date = this.from_date1;
    }
    if (to_date !== "" && to_date !== undefined) {
      this.to_date = to_date;
    } else if (to_date === undefined) {
      this.to_date = this.to_date1;
    }
    this.loaderService.display(true);
    this.calElem.fullCalendar("removeEvents");
    this.calenderService
      .fetchEvent(
        this.from_date,
        this.to_date,
        actionalble_of,
        this.noc_event_value,
        this.gmValue,
        this.cmValue,
        this.designerValue
      )
      .subscribe(
        (events) => {
          events = events;
          Object.keys(events).map((key) => {
            this.events = events[key];
          });
          this.events.forEach(el=> {
            el.title =  this.ReFormattitle(el.title)
          });
          this.calElem.fullCalendar("addEventSource", this.events);
          this.loaderService.display(false);
        },
        (error) => {
          this.loaderService.display(false);
        }
      );
  }

  onSelectAll(items) {}
  onDeSelectAll(items) {}

  OnItemDeSelect(items, textVal?, index?) {
    if (textVal == "gm" && index == 3) {
      for (var k = 0; k < this.gms.length; k++) {
        if (items.id == this.gms[k]) {
          this.gms.splice(k, 1);
        }
      }
    }
  }
  cms;
  selectedCmItems = [];
  gms;
  designers;
  selectedDesignerItems = [];
  // selectedGmItems = [];
  onItemSelect(items, textVal?, index?) {
    if (textVal == "cm" && index == 1) {
      this.cms = [];
      for (var k = 0; k < this.selectedCmItems.length; k++) {
        this.cms.push(this.selectedCmItems[k].id);
      }
      this.getDesignerList(this.cms);
      this.user_Filter("", "", this.cms, "");
    }
    if (textVal == "designer" && index == 2) {
      this.designers = [];
      for (var k = 0; k < this.selectedDesignerItems.length; k++) {
        this.designers.push(this.selectedDesignerItems[k].id);
      }
      this.user_Filter("", "", "", this.designers);
    }
    if (textVal == "gm" && index == 3) {
      this.gms = [];
      for (var k = 0; k < this.selectedGmItems.length; k++) {
        this.gms.push(this.selectedGmItems[k].id);
      }
      this.getCMList(this.gms);
      this.user_Filter("", this.gms, "", "");
    }
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
  ownrable_id;
  lead_type;
  dateDetails(data) {
    this.loaderService.display(true);
    if (this.title_details === "Post Bid Site Measurement Request") {
      this.title_details = "Initial Site Measurement Request";
    } else if (this.title_details === "Panel Start") {
      this.title_details = "Panel Production Start";
    }
    this.leadService
      .changeLeadDate(
        this.lead_type,
        this.ownrable_id,
        this.title_details,
        data.date_detail,
        this.reason_dropdown,
        data.note_detail
      )
      .subscribe((res) => {
        $("#nocchangeModal").modal("hide");
        $("#viewEventModal").modal("hide");
        this.loaderService.display(false);
        this.createClassificationForm.reset();
        this.successMessage = "Date has been Updated";
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          3000
        );
        this.user_Filter("", "", "", "");
      });
  }

  closenocModal() {
    $("#nocchangeModal").modal("hide");
  }

  ngAfterViewInit() {
    this.inputs = Array.from(this.otpForm.nativeElement.querySelectorAll('input[type=text]'));
    this.inputs.forEach((input, index) => {
      input.addEventListener('input', (event) => this.handleInput(event, index));
      input.addEventListener('keydown', (event) => this.handleKeyDown(event, index));
      input.addEventListener('focus', (event) => this.handleFocus(event));
      input.addEventListener('paste', (event) => this.handlePaste(event));
    })
    this.calElem = $("#calendar");
    // if(this.openpopup === 'true'){
    //   console.log('this.openpopup',this.openpopup)
    //   setTimeout(
    //     function () {
    //       this.delayedLeads(this.current_page)
    //     }.bind(this),
    //     2000
    //   );
    // }
    this.loaderService.display(true);

    this.calenderService.fetchLead().subscribe(
      (leads) => {
        // this.leads = leads;
        // this.leads = leads;
        Object.keys(leads).map((key) => {
          this.leads = leads[key];
        });
      },
      (error) => {}
    );

    this.fetchEvent(this.from_date, this.to_date);
    if (this.role != "designer") {
      this.calenderService
        .fetchDesigner(localStorage.getItem("userId"))
        .subscribe(
          (designers) => {
            this.designer_list = designers.designer_list;
          },
          (error) => {}
        );
    
    }

    this.calculateMaxScroll();
    this.checkImageScrollButtons();
    this.checkImagePaginationScrollButtons();
    this.checkImagePaginationScrollButtonThree();
    this.onImagePaginationScrollThree();
  }

  fetchEvent(from_date, to_date) {
    this.loaderService.display(true);
    this.calenderService.fetchEvent(from_date, to_date).subscribe(
      (events) => {
        events = events;
        Object.keys(events).map((key) => {
          this.events = events[key];
        });
        this.events.forEach(el=> {
          el.title =  this.ReFormattitle(el.title)
        });
        this.populateCalender();
        this.calElem.fullCalendar("removeEvents");
        this.calElem.fullCalendar("addEventSource", this.events);
        this.loaderService.display(false);
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }

  filterDesigner(event) {
    this.calElem.fullCalendar("removeEvents");
    var val = event.target.value;
    this.loaderService.display(true);
    this.calenderService
      .fetchDesignerEvent(val, this.from_date, this.to_date)
      .subscribe(
        (events) => {
          events = events;
          Object.keys(events).map((key) => {
            this.events = events[key];
          });
          this.events.forEach(el=> {
            el.title =  this.ReFormattitle(el.title)
          });
          // $(".calendar-container").html("<div id='calendar' #calendar></div>");
          // this.calElem = $("#calendar");
          // this.populateCalender();
          this.calElem.fullCalendar("addEventSource", this.events);
          this.loaderService.display(false);
        },
        (error) => {}
      );
  }

  noc_event_value: any = "";
  filterEvent(event) {
    this.calElem.fullCalendar("removeEvents");
    var val = event.target.value;
    this.noc_event_value = val;
    this.loaderService.display(true);
    this.calenderService
      .fetceventTypefilter(
        this.from_date,
        this.to_date,
        this.noc_event_value,
        ""
      )
      .subscribe(
        (events) => {
          events = events;
          Object.keys(events).map((key) => {
            this.events = events[key];
          });
          this.events.forEach(el=> {
            el.title =  this.ReFormattitle(el.title)
          });
          this.calElem.fullCalendar("addEventSource", this.events);
          this.loaderService.display(false);
        },
        (error) => {}
      );
  }
  reasonForLostDropdownChange(val) {
    this.statusChangeForm.controls["lost_remarks"].setValidators([
      Validators.required,
    ]);
    this.statusChangeForm.controls["lost_remarks"].updateValueAndValidity();
  }

  onStatusChange(status) {
    this.statusDetails["customer_status"] = status;
    this.statusDetails["customer_id"] = this.current_user_id;
    this.statusDetails["project_id"] = this.current_project_id;

    this.loaderService.display(true);

    if (this.statusDetails["customer_status"] == "follow_up") {
      $("#followup-details").val(
        new Date(new Date().getTime() + 330 * 60000).toJSON().slice(0, 19)
      );
      // $("#followup_remarks").val();
      this.loaderService.display(false);
      $("#statusModal").modal("show");
    } else if (this.statusDetails["customer_status"] == "lost") {
      this.loaderService.display(false);
      $("#loststatusModal").modal("show");
    } else {
      this.updateNewStatus();
    }
  }
  onCallbackChange(status) {
    this.loaderService.display(true);
    if (status == "lost") {
      $("#loststatusModal").modal("hide");
      this.statusDetails["reason_for_lost"] = $("#lost_reason").val();
      this.statusDetails["remarks"] = $("#lost_remarks").val();
      this.updateNewStatus();
    }
    if (status == "follow_up") {
      if ($("#followup-details").val() != "") {
        $("#statusModal").modal("hide");
        this.statusDetails["customer_meeting_time"] =
          $("#followup-details").val();
        this.statusDetails["remarks"] = $("#followup_remarks").val();
        this.updateNewStatus();
      } else {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "CallBack Date is required";
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    }
  }
  updateNewStatus() {
    this.designerService
      .statusUpdate(this.statusDetails, this.designerId)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "Status updated successfully!";
          this.statusChangeForm.reset();
          this.statusChangeForm.controls["reson_for_lost"].setValue("");
          // if(document.getElementById('lostRemarkRow')){
          //   document.getElementById('lostRemarkRow').classList.add('d-none');
          // }
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
          $("#viewEventModal").modal("hide");
          $("#statusModal").modal("hide");
          this.repopulateCalendar();
        },
        (err) => {
          this.erroralert = true;
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
        }
      );
  }

  getFromTo(date) {
    this.y = date.getFullYear();
    this.m = date.getMonth();
    this.from_date = new Date(this.y, this.m, 1);
    this.to_date = new Date(this.y, this.m + 1, 0);

    this.fetchEvent(this.from_date, this.to_date);
    // this.calElem.fullCalendar("refetchEvents");

    // this.calElem.fullCalendar( 'removeEvents' )
    // this.calElem.fullCalendar( 'addEventSource', this.events )
  }

  current_project_id;
  current_user_id;
  cal_lead_id;
  title_details;
  populateCalender() {
    this.calElem = $("#calendar");
    var parentThis = this;
    this.calElem.fullCalendar({
      customButtons: {
        Prev: {
          text: "Prev",
          click: function (calEvent) {
            parentThis.calElem.fullCalendar("prev");
            parentThis.calElem.fullCalendar("removeEvents");
            var c = parentThis.calElem.fullCalendar("getDate")._d;
            var d = c.getFullYear();
            var e = c.getMonth();
            var firstDay = new Date(d, e, 1);
            var lasttDay = new Date(d, e + 1, 0);
            parentThis.user_Filter("", "", "", "", firstDay, lasttDay);
          },
        },
        Next: {
          text: "Next",
          click: function (calEvent) {
            parentThis.calElem.fullCalendar("next");
            parentThis.calElem.fullCalendar("removeEvents");
            // parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
            // parentThis.user_Filter('', '', '', '','next','next');
            var c = parentThis.calElem.fullCalendar("getDate")._d;
            var d = c.getFullYear();
            var e = c.getMonth();
            var firstDay = new Date(d, e, 1);
            var lasttDay = new Date(d, e + 1, 0);
            parentThis.user_Filter("", "", "", "", firstDay, lasttDay);
          },
        },
        Today: {
          text: "Today",
          click: function (calEvent) {
            parentThis.calElem.fullCalendar("today");
            parentThis.calElem.fullCalendar("removeEvents", parentThis.events);
            var c = parentThis.calElem.fullCalendar("getDate")._d;
            var d = c.getFullYear();
            var e = c.getMonth();
            var firstDay = new Date(d, e, 1);
            var lasttDay = new Date(d, e + 1, 0);
            parentThis.user_Filter("", "", "", "", firstDay, lasttDay);
          },
        },
      },

      header: {
        left: "Today Prev,Next",
        center: "title",
        right: "month basicWeek basicDay",
      },
      navLinks: true,
      dayClick: function (date, jsEvent, view) {
        //alert('Clicked on: ' + date.format());

        // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

        // alert('Current view: ' + view.name);

        // $(this).css('background-color', 'red');
        parentThis.meetingform.controls["scheduled_at"].setValue(
          new Date(date._i).toJSON().slice(0, 19)
        );
        $("#eventModal").modal("show");
        this.showCm = false
         setTimeout(() => {
          
         }, 200);
         this.meetingform.controls["project"].setValue(
          null
        );
      },

      events: this.events,
      // events: [{id: 8, title: "12:12PM / briefing_sales_pitch", start: "2018-02-21"},{id: 9, title: "12:13PM / briefing_sales_pitch", start: "2018-02-21"}],
      eventClick: function (calEvent, jsEvent, view) {
        $("#viewEventModal").modal("show");
        parentThis.currentEvent = calEvent;
        parentThis.projectUsers=calEvent.users
        this.calEvent = calEvent;
        this.mom_status = calEvent.mom_status;
        this.is_manualevent = calEvent.is_manual_event;
        parentThis.agendaForValidation =  calEvent.agenda;
        console.log(this.agendaForValidation)

        if (this.is_manualevent == false) {
          $("#mom-add").css({ display: "none" });
          $("#momview").css({ display: "none" });
        }
        if (this.mom_status == "shared" && this.is_manualevent == true) {
          // $('#momview').show();
          $("#mom-add").css({ display: "none" });
          $("#momview").css({ display: "block" });
          // $('#remark-hide').show();
        }

        if (this.mom_status == "pending" && this.is_manualevent == true) {
          $("#momview").css({ display: "none" });
          $("#mom-add").css({ display: "block" });
        }

        if (this.mom_status == "present" && this.is_manualevent == true) {
          $("#mom-add").css({ display: "none" });
          $("#momview").css({ display: "block" });
        }

        if (calEvent.location == null) {
          calEvent.location = "None";
        }
        if (calEvent.description == null) {
          calEvent.description = "None";
        }

        if (calEvent.noc_event_type != "na") {
          // $('#lead_id').show();
          $("#event_project").hide();
          $("#event_type").hide();
          $("#event_desc").hide();
          $("#event_location").hide();
          $("#designer-hide").hide();
          $("#event_member").hide();
          $("#supervisor-hide").show();
        } else if (calEvent.noc_event_type == "na") {
          // $('#lead_id').hide();
          $("#event_project").show();
          $("#event_type").show();
          $("#event_desc").show();
          $("#event_location").show();
          $("#designer-hide").show();
          $("#event_member").show();
          $("#supervisor-hide").hide();
          $("#event_boq_num").hide();
        }
        // else if (calEvent.noc_event_type != "na" && calEvent.boq_id != null) {
        //   if (calEvent.agenda != 'Post Bid Site Measurement Request') {
        //     $('#event_boq_num').show();
        //     $(".modal-boq-num").html("<p style = 'padding-top: .35rem!important;'>" + calEvent.boq_number + "</p>");
        //   }
        // }
       
        parentThis.current_project_id = calEvent.ownerable_id;
        parentThis.current_user_id = calEvent.customer_id;
        parentThis.cal_lead_id = calEvent.lead_id;
        if (calEvent.noc_event_type != "na" && calEvent.boq_id != null) {
          if (calEvent.agenda != "Post Bid Site Measurement Request") {
            $("#event_boq_num").show();
            $(".modal-boq-num").html(
              "<p style = 'padding-top: .35rem!important;'>" +
                calEvent.boq_number +
                "</p>"
            );
          }
        }

        if (calEvent.noc_event_type != "na" && calEvent.boq_id == null) {
          $("#event_boq_num").hide();
        }

        $(".modal-project").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.ownerable_name +
            "</p>"
        );
        if (calEvent.agenda === "Panel Production Start") {
          calEvent.agenda = "Panel Start";
        }
        $(".modal-agenda").html(
          "<p style = 'padding-top: .35rem!important;text-transform: capitalize;'>" +
            calEvent.agenda.split("_").join(" ") +
            "</p>"
        );
        $(".modal-lead_id").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.lead_id +
            "</p>"
        );
        if (calEvent.status !== null) {
          $(".modal-status").html(
            "<p style = 'padding-top: .35rem!important;'>" +
            (calEvent.status == 'pending_approval'? 'Pending Approval' : calEvent.status ) +
              "</p>"
          );
        }
        $(".modal-lead").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.customer_name +
            "</p>"
        );
        $(".modal-date").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.datetime +
            "</p>"
        );
        if (calEvent.agenda == "follow_up") {
          $("#furemark-hide").show();
        } else {
          $("#furemark-hide").hide();
        }
        // $(".supervisor-hide").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.datetime+"</p>");
        if (
          calEvent.agenda == "follow_up" ||
          calEvent.agenda == "follow_up_for_not_contactable" ||
          calEvent.ownerable_type == "LeadNocDatum"
        ) {
          $("#designer-hide").hide();
        } else {
          $("#designer-hide").show();
        }
        if (
          calEvent.agenda == "follow_up" ||
          calEvent.agenda == "follow_up_for_not_contactable" ||
          calEvent.agenda == "lead_assigned"
        ) {
          $("#status-change").show();
        } else {
          $("#status-change").hide();
        }
        if (calEvent.contact_type !== null) {
          $(".modal-type").html(
            "<p style = 'padding-top: .35rem!important;'>" +
              calEvent.contact_type.split("_").join(" ") +
              "</p>"
          );
        }
        $(".modal-description").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.description +
            "</p>"
        );

        $(".modal-location").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.location +
            "</p>"
        );
        //$(".modal-members").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.users.join("<br/>")+"</p>");

        let i = 0;
        let data = "";
        for (i; i < calEvent.users.length; i++) {
          data +=
            calEvent.users[i].name + " (" + calEvent.users[i].email + "), ";
        }

        $(".modal-members").html(
          "<p style = 'padding-top: .35rem!important;'>" + data + "</p>"
        );

        // if (calEvent.remark !== null) {
        //   $(".modal-remark").html("<p style = 'padding-top: .35rem!important;'>" + calEvent.remark + "</p>");
        // }
        if (
          calEvent.noc_manual_expected_date !== null &&
          calEvent.agenda !== "on_hold"
        ) {
          if (Object.keys(calEvent.noc_manual_expected_date).length > 0) {
            $(".modal-remark").html(
              "<p style = 'padding-top: .35rem!important;'>" +
                calEvent.noc_manual_expected_date.reason +
                "-" +
                calEvent.noc_manual_expected_date.notes +
                "</p>"
            );
          }
        } else if (calEvent.agenda === "on_hold") {
          if (calEvent.reason_for_lost !== null) {
            if (calEvent.ownerable_remark !== null) {
              $(".modal-remark").html(
                "<p style = 'padding-top: .35rem!important;'>" +
                  calEvent.ownerable_remark +
                  " / " +
                  calEvent.reason_for_lost.split("_").join(" ") +
                  "</p>"
              );
            } else {
              $(".modal-remark").html(
                "<p style = 'padding-top: .35rem!important;'>" +
                  calEvent.reason_for_lost.split("_").join(" ") +
                  "</p>"
              );
            }
          } else {
            if (calEvent.ownerable_remark !== null) {
              $(".modal-remark").html(
                "<p style = 'padding-top: .35rem!important;'>" +
                  calEvent.ownerable_remark +
                  "</p>"
              );
            } else {
              $(".modal-remark").html(
                "<p style = 'padding-top: .35rem!important;'>" + +"</p>"
              );
            }
          }
        } else if (calEvent.agenda !== "on_hold") {
          $(".modal-remark").html(
            "<p style = 'padding-top: .35rem!important;'>" + "" + "</p>"
          );
        }

        $(".modal-furemark").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.ownerable_remark +
            "</p>"
        );
             if(calEvent.designer.name == undefined){
              calEvent.designer.name =""
             }
             if(calEvent.designer.email == undefined){
              calEvent.designer.email =""
             }
        $(".modal-designer").html(
          "<p style = 'padding-top: .35rem!important;'>" +
            calEvent.designer.name +
            calEvent.designer.email +
            "</p>"
        );

        if (
          (calEvent.status == "done" || calEvent.status == "cancelled") &&
          calEvent.noc_event_type == "na"
        ) {
          $("#btn-hide").css({ display: "none" });
          $("#btn-hides").css({ display: "none" });
          $("#btn-cancel-hide").css({ display: "none" });
          $("#remark-hide").show();
          $("#status-change").hide();
          $("#noc-btn-hide").css({ display: "none" });
        } else if (
          calEvent.status == "rescheduled" &&
          calEvent.noc_event_type != "na"
        ) {
          $("#remark-hide").show();
          $("#btn-hide").css({ display: "block" });
          $("#btn-hides").css({ display: "block" });
          $("#btn-cancel-hide").css({ display: "block" });
        } else if (
          (calEvent.status == "rescheduled" ||
            calEvent.status == "scheduled") &&
          calEvent.noc_event_type == "na" &&
          !(
            calEvent.agenda == "post_bid_site_measurement_request" ||
            calEvent.agenda == "pre_bid_site_measurement_request" ||
            calEvent.agenda == "Site_validation" ||
            calEvent.agenda == "on_hold"
          )
        ) {
          $("#remark-hide").show();
          $("#btn-hide").css({ display: "block" });
          $("#btn-hides").css({ display: "block" });
          $("#btn-cancel-hide").css({ display: "block" });
          $("#noc-btn-hide").css({ display: "none" });
          $("#mom-add").css({ display: "block" });
        } else if (
          (calEvent.status == "rescheduled" ||
            calEvent.status == "scheduled") &&
          (calEvent.agenda == "post_bid_site_measurement_request" ||
            calEvent.agenda == "pre_bid_site_measurement_request" ||
            calEvent.agenda == "Site_validation" ||
            calEvent.agenda == "on_hold")
        ) {
          $("#remark-hide").show();
          $("#btn-hide").css({ display: "block" });
          $("#btn-hides").css({ display: "none" });
          $("#btn-cancel-hide").css({ display: "none" });
          $("#noc-btn-hide").css({ display: "none" });
          $("#mom-add").css({ display: "none" });
        }

        // else if((calEvent.status == 'rescheduled' || calEvent.status == 'scheduled') && calEvent.noc_event_type != "na" ){
        //   $('#remark-hide').show();
        //   $('#btn-hide').css({ 'display' : 'block'});
        //   $('#btn-hides').css({ 'display' : 'block'});
        //   $('#btn-cancel-hide').css({ 'display' : 'block'});

        // }
        else if (calEvent.noc_event_type == "na") {
          $("#noc-btn-hide").css({ display: "none" });
          $("#btn-hide").css({ display: "none" });
          $("#btn-hides").css({ display: "none" });
          $("#btn-cancel-hide").css({ display: "none" });
          $("#mom-add").css({ display: "none" });
        } else if (calEvent.noc_event_type != "na") {
          if (calEvent.status === "done") {
            $("#noc-btn-hide").css({ display: "none" });
          } else {
            $("#noc-btn-hide").css({ display: "block" });
          }
          $("#btn-hide").css({ display: "none" });
          $("#btn-hides").css({ display: "none" });
          $("#btn-cancel-hide").css({ display: "none" });
          $("#mom-add").css({ display: "none" });
        } else {
          $("#btn-hide").css({ display: "block" });
          $("#btn-hides").css({ display: "block" });
          $("#btn-cancel-hide").css({ display: "block" });
          $("#remark-hide").hide();
          $("#noc-btn-hide").css({ display: "none" });
        }
        if(calEvent.agenda == 'on_hold' || calEvent.agenda == 'delayed_possession' || calEvent.agenda == 'delayed_project' || calEvent.agenda == 'follow_up_for_not_contactable' || calEvent.agenda == 'follow_up' ){
          $("#mom-add").css({ display: "none" });
          $("#btn-hide").css({ display: "block" });
          $("#noc-btn-hide").css({ display: "none" });
          $("#btn-hides").css({ display: "none" });
          $("#btn-cancel-hide").css({ display: "none" });
          $("#updateMOM").css({ display: "none" });
          console.log("hhh")
        }
        if(calEvent.agenda == 'PM10:_store_visit'){
          $("#mom-add").css({ display: "block" });
        }
        if (calEvent.status == "done" ){
          $("#btn-hide").css({ display: "none" });
          }
        parentThis.updatemeetingform.controls["project"].setValue(
          calEvent.ownerable_id
        );
        parentThis.updatemeetingform.controls["ownerable_type"].setValue(
          calEvent.ownerable_type
        );
        parentThis.updatemeetingform.controls["agenda"].setValue(
          calEvent.agenda
        );
        parentThis.agendaForReschedule = calEvent.agenda;
        parentThis.updatemeetingform.controls["contact_type"].setValue(
          calEvent.contact_type
        );
        parentThis.updatemeetingform.controls["description"].setValue(
          calEvent.description
        );
        parentThis.updatemeetingform.controls["scheduled_at"].setValue(
          new Date(Date.parse(calEvent.scheduled_at) + 330 * 60000)
            .toJSON()
            .slice(0, 19)
        );
        parentThis.updatemeetingform.controls["location"].setValue(
          calEvent.location
        );
        parentThis.updatemeetingform.controls["remark"].setValue(
          calEvent.remark
        );
        parentThis.updatemeetingform.controls["email"].setValue(
          calEvent.users.join(";")
        );
        //
        //
        //
        // if (calEvent.title) {
        //     alert(calEvent.title);
        //     // return false;
        // }

        if((this.calEvent.agenda == 'PM40:_design_iteration' && this.calEvent.status == 'done') ||
        (this.calEvent.agenda == 'PM40:_design_iteration' && this.calEvent.status == 'pending_approval')){
          $("#btn-hide").css({ display: "none" });
          $("#btn-hides").css({ display: "none" });
          $("#btn-cancel-hide").css({ display: "none" });
          $("#mom-add").css({ display: "none" });
          $("#updateMOM").css({ display: "none" });
          $("#momview").css({ display: "none" });
          $("#noc-btn-hide").css({ display: "none" });
          $('#viewEventModalBtn').css({display: "block"})
        }else{
          $('#viewEventModalBtn').css({display: "none"})
        }
      },

      

      selectable: true,
      eventBackgroundColor: "#A73E57",
      eventBorderColor: "#A73E57",
      eventTextColor: "#ffffff",
    });
    this.loaderService.display(false);
  }
  agendaForReschedule

  createEvent() {
    var parentThis = this;
    if (this.meetingform.valid) {
      this.loaderService.display(true);
      this.calenderService.createEvent(this.meetingform.value).subscribe(
        (event) => {
          event = event;
          Object.keys(event).map((key) => {
            this.latestevent = event[key];
          });
          //

          this.meetingform.reset();
          this.projectUsers = [];
          this.ref.detectChanges();
          // this.calenderService.fetchEvent().subscribe(
          //   events => {
          //     events = events;
          //     this.events = [];
          //     Object.keys(events).map((key)=>{ this.events=events[key]; });
          //     // this.populateCalender();
          //     this.calElem.fullCalendar( 'rerenderEvents' );
          //   },
          //   error => {
          //
          //   }
          // );
          //  setTimeout(function() {
          //      this.successalert = false;
          //   }.bind(this), 2000);
          //this.router.navigateByUrl('/projects/'+project.id+'/floorplan/create');
          // return presentation;
          this.successalert = true;
          this.successMessage = "Event successfully created";

          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
          this.loaderService.display(false);
          this.repopulateCalendar();
        },
        (error) => {
          // return Observable.throw(error);
          this.erroralert = true;
          if (
            JSON.parse(error["_body"]) == null ||
            JSON.parse(error["_body"]).message == null
          ) {
            this.errorMessage = "Agenda First meeting is already scheduled";
          } else {
            this.errorMessage = JSON.parse(error["_body"]).message;
          }

          this.meetingform.reset();
          this.projectUsers = [];
          // alert("Error creating event");

          // this.errorMessage = JSON.parse(error['_body']).message;
          // alert("Error creating event");
          this.loaderService.display(false);
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
        }
      );
      this.meetingform.reset();
      $(':input[type="select"]').prop("disabled", true);
      $("#eventModal").modal("hide");
    }
  }

  repopulateCalendar() {
    this.loaderService.display(true);
    this.calElem.fullCalendar("removeEvents");
    this.calenderService.fetchEvent(this.from_date, this.to_date).subscribe(
      (events) => {
        events = events;
        Object.keys(events).map((key) => {
          this.events = events[key];
        });
        this.events.forEach(el=> {
          el.title =  this.ReFormattitle(el.title)
        });
        // $(".calendar-container").html("<div id='calendar' #calendar></div>");
        this.calElem.fullCalendar("addEventSource", this.events);
        this.loaderService.display(false);
        // this.calElem = $("#calendar");
        // this.populateCalender();
        // this.calElem.fullCalendar( 'refetchEvents' );
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }
  usersList: any = [];
  agendaForValidation;
  noc_date;
  updateStatus(status) {
    $("#viewEventModal").modal("hide");
    this.usersList = [];
    this.status = status;
    var calEvent = this.currentEvent;
    this.agendaForValidation =  calEvent.agenda;
    this.is10percentDone = this.currentEvent.lead_10_percent_done

    if (status == "noc_reschedule") {
      if (calEvent.agenda === "Panel Production Start") {
        this.title_details = "Panel Start";
      } else {
        this.title_details = calEvent.agenda;
      }
      this.noc_date = calEvent.scheduled_at;
      if (calEvent.noc_event_type === "lead") {
        this.ownrable_id = calEvent.lead_id;
        this.lead_type = "Lead";
      }
      if (calEvent.noc_event_type === "boq") {
        this.ownrable_id = calEvent.boq_id;
        this.lead_type = "Quotation";
      }
      $("#nocchangeModal").modal("show");
    }
    if (status == "reschedule") {
      for (let obj of calEvent.users) {
        this.usersList.push(obj.email);
      }
    }
    if (status == "reschedule") {
      if(calEvent.agenda != 'on_hold'){
        this.updatemeetingform.controls["project"].setValue(
          calEvent.ownerable_id
        );
        this.updatemeetingform.controls["ownerable_type"].setValue(
          calEvent.ownerable_type
        );
        this.updatemeetingform.controls["agenda"].setValue(calEvent.agenda);
        this.firstMeeting(calEvent.agenda);
        this.onProjectChange(calEvent.ownerable_id);
        this.updatemeetingform.controls["contact_type"].setValue(
          calEvent.contact_type
        );
        this.updatemeetingform.controls["description"].setValue(
          calEvent.description
        );
        this.updatemeetingform.controls["remark"].setValue(calEvent.remark);
        this.updatemeetingform.controls["scheduled_at"].setValue(
          new Date(calEvent.scheduled_at).toJSON().slice(0, 19)
        );
        this.updatemeetingform.controls["location"].setValue(calEvent.location);
        this.updatemeetingform.controls["email"].setValue(
          this.usersList.join(";")
        );
        if(calEvent.agenda == 'PM10:_first_meeting_with_cs'){
          this.updatemeetingform.controls["email"].clearValidators()
          this.updatemeetingform.controls["email"].updateValueAndValidity()
        } else{
          this.updatemeetingform.controls["email"].setValidators(Validators.required)
          this.updatemeetingform.controls["email"].updateValueAndValidity()
        }
       
  
  
        $("#updateEventModal").modal("show");
      } else{
        $("#modal_date").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        $("#statusModal3").modal("show");
        this.remarks_details ='';
        this.fetchBasicDetails(this.currentEvent.lead_id)
        $("#viewEventModal").modal("hide");
      }
     
    } else if (status == "done") {
      this.calEvent = this.currentEvent.users;
      this.eventId = this.currentEvent.id;
      // this.momView()
      this.markDoneform.controls["status"].setValue(status);
      if(calEvent.agenda == 'PM40:_design_iteration'){
        this.getSpaceDetails(this.currentEvent.id, true, false);
        this.images = [];
        this.selectedFiles = [];
        this.meetingFormTwo.reset();
        this.otpDigits = new Array(6).fill('');
        $("#designMeetingModal").modal("show");
      }else{
        $("#markModal").modal("show");
      }
      this.markDoneform.controls['remark'].setValue('')
      this.markDoneform.controls['mom_description'].setValue('')
    } else if(status == 'cancelled'){
      this.markDoneform.reset()
      this.markDoneform.controls["status"].setValue(status);
      $("#markModal").modal("show");
      this.markDoneform.controls['remark'].setValue('')
      this.markDoneform.controls['mom_description'].setValue('')
    }
  }
  remarkEvent() {
    var MLI_array = this.markDoneform.get(
      "emails"
    ) as FormArray;
    const control = <FormArray>this.markDoneform.controls['emails'];
    while (control.length > 0) {
      control.removeAt(0)
    }
    this.EmailsArray2.forEach(el=>{
      MLI_array.push(new FormControl(el))
    })
    var calEvent = this.currentEvent;
    if (this.markDoneform.valid) {
      this.calenderService
        .updateStatus(this.markDoneform.value, calEvent.id)
        .subscribe(
          (event) => {
            event = event;
            this.successalert = true;
            if (this.status == "done") {
              this.successMessage = "Event Marked as Done";
            }
            if (this.status == "cancelled") {
              this.successMessage = "Event Marked as Cancelled";
            }
            $("#updateEventModal").modal("hide");
            $("#viewEventModal").modal("hide");
            $("#markModal").modal("hide");
            this.repopulateCalendar();
          },
          (error) => {
            this.erroralert = true;
            this.errorMessage = "Error updating event";
          }
        );
    }
  }

  updateEvent() {
    var calEvent = this.currentEvent;
    if (this.updatemeetingform.valid) {
      this.calenderService
        .updateEvent(this.updatemeetingform.value, calEvent.id)
        .subscribe(
          (event) => {
            event = event;
            this.successalert = true;
            this.successMessage = "Event updated";
            $("#updateEventModal").modal("hide");
            $("#viewEventModal").modal("hide");
            this.repopulateCalendar();
          },
          (error) => {
            this.erroralert = true;
            this.errorMessage = "Error updating event";
          }
        );
      this.meetingform.reset();
      $("#eventModal").modal("hide");
    }
  }

  onProjectChange(val) {
    for (let lead of this.leads) {
      if (lead.ownerable_id == val) {
        this.meetingform.controls["ownerable_type"].setValue(
          lead.ownerable_type
        );
        this.updatemeetingform.controls["ownerable_type"].setValue(
          lead.ownerable_type
        );
      }
    }

    this.calenderService.fetchUsers(val).subscribe(
      (users) => {
        Object.keys(users).map((key) => {
          this.projectUsers = users[key];
        });
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = "Error updating event";
      }
    );
    let leadID = this.leads.filter(e=>{
      return e.ownerable_id == val
    })
    let Lid ;
    if(leadID[0]){
      Lid = leadID[0].lead_id 
    } else{
      Lid =''
    }
    this.fetchBasicDetails(Lid)
    this.showCm = true
  }

  onMeetingUserChange(event, target) {
    var val = event.target.value;

    if (target == "meeting") {
      var exist_value = $(".meeting-control").val();
    } else if (target == "update") {
      var exist_value = $(".update-control").val();
    }
    var new_val;
    if (event.srcElement.checked) {
      if (
        exist_value != undefined &&
        exist_value != "" &&
        exist_value != null
      ) {
        new_val = exist_value + ";" + val;
      } else {
        new_val = val;
      }
    } else {
      if (
        exist_value != undefined &&
        exist_value != "" &&
        exist_value != null
      ) {
        var arr = exist_value.split(";");
        var index = arr.indexOf(val, 0);
        if (index > -1) {
          arr.splice(index, 1);
        }
        new_val = arr.join(";");
      }
    }
    if (target == "meeting") {
      $(".meeting-control").val(new_val);
      this.meetingform.controls["email"].setValue(new_val);
    } else if (target == "update") {
      $(".update-control").val(new_val);
      this.meetingform.controls["email"].setValue(new_val);
    }
  }

  month: any;
  day: any;
  year: any;
  // Disable calender date
  disableDate() {
    var datep = $("#followup-details").val();
    datep = datep.substring(0, 10);

    var dtToday = new Date();

    this.month = dtToday.getMonth() + 1;
    this.day = dtToday.getDate();
    this.year = dtToday.getFullYear();
    if (this.month < 10) this.month = "0" + this.month.toString();
    if (this.day < 10) this.day = "0" + this.day.toString();

    var maxDate = this.year + "-" + this.month + "-" + this.day;
    $("#followup-details").attr("min", maxDate);
    if (datep < maxDate) {
      alert("selected date is in past");
      $("#followup-details").val(maxDate);
    }
  }

  actionable_Filter(actionable_of) {
    this.loaderService.display(true);
    this.calElem.fullCalendar("removeEvents");
    this.calenderService
      .fetchEvent(this.from_date, this.to_date, actionable_of)
      .subscribe(
        (events) => {
          events = events;
          Object.keys(events).map((key) => {
            this.events = events[key];
          });
          this.events.forEach(el=> {
            el.title =  this.ReFormattitle(el.title)
          });
          // $(".calendar-container").html("<div id='calendar' #calendar></div>");
          // this.calElem = $("#calendar");
          // this.populateCalender();
          this.calElem.fullCalendar("addEventSource", this.events);
          // this.calElem.fullCalendar( 'refetchEvents' );
          this.loaderService.display(false);
        },
        (error) => {
          this.loaderService.display(false);
        }
      );
  }
  callResponse: any;
  callToLead(contact) {
    this.loaderService.display(true);
    this.designerService
      .callToLead(localStorage.getItem("userId"), contact)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          if (res.inhouse_call.call_response.code == "403") {
            this.erroralert = true;
            this.errorMessage = JSON.parse(
              res.message.body
            ).RestException.Message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              10000
            );
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse = JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage =
              "Calling from - " + this.callResponse.Call.From;
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              10000
            );
          }
          $("#viewEventModal").modal("hide");
          $("#alternateNumberModal").modal("hide");
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  callFromCalenderToLead(contact) {
    this.callToLead(contact);
  }

  firstMeeting(value?) {
    if (value) {
      this.loc = value;
    } else {
      this.loc = $("#agendaType").val();
    }

    if (this.loc == "null") {
      $(':input[type="select"]').prop("disabled", true);
    } else {
      $(':input[type="select"]').prop("disabled", false);
    }
  }

  getCustomerDetails() {
    this.leadService.getCustomerCallDetails(this.cal_lead_id).subscribe(
      (res) => {
        this.customerDetails = res["lead"].contacts;
      },
      (err) => {}
    );
  }
  currentStatusEvent :any

  showMOM() {
    $("#viewEventModal").modal("hide");
    console.log(this.calEvent);

    this.currentStatusEvent = this.currentEvent.status

    console.log(this.currentStatusEvent);

    
    this.calEvent = this.currentEvent.users;

    this.eventId = this.currentEvent.id;


    console.log(this.eventId);
    


    this.momView();
    var MLI_array = this.mom.get(
      "emails"
    ) as FormArray;
   (<FormArray>MLI_array).controls = []
   this.EmailsArray =[];

  }
  showcreateMOM() {
    console.log(this.agendaForValidation);
    
    $("#viewEventModal").modal("hide");
    this.calEvent = this.currentEvent.users;

    this.eventId = this.currentEvent.id;
    this.mom.controls['mom_description'].setValue('')
  }

  EmailsArray =[];
  EmailsArray2 =[];
  EmailsArray3 = []
  OnEmailSelect(e,event,i) {
    let index ; 
    if(this.EmailsArray.indexOf(event) == -1 && e.target.checked){
      this.EmailsArray.push(event);
      console.log(this.EmailsArray,"pass");
      console.log(event);
    } else{
       index =this.EmailsArray.indexOf(event);
      this.EmailsArray.splice(index,1);
      console.log(this.EmailsArray,"fail");
      console.log(event);
    }
    console.log(this.EmailsArray);
  }
  OnEmailSelect2(e,event,i) {
    let index2
    if(this.EmailsArray2.indexOf(event) == -1 && e.target.checked){
      this.EmailsArray2.push(event);
      console.log(this.EmailsArray2,"pass");

    } else{
      index2 = this.EmailsArray2.indexOf(event);
      this.EmailsArray2.splice(index2,1);
    }
  }
  OnEmailSelect3(e,event,i) {
    let index2
    if(this.EmailsArray3.indexOf(event) == -1 && e.target.checked){
      this.EmailsArray3.push(event);
      console.log(this.EmailsArray2,"pass");

    } else{
      index2 = this.EmailsArray3.indexOf(event);
      this.EmailsArray3.splice(index2,1);
    }
  }
  DisHandle(){
    if(this.EmailsArray.length == 0 && this.agendaForValidation !='PM10:_first_meeting_with_cs'){
      return true
    } else{
      return false
    }
  }
  DisHandle2(){
    if(this.EmailsArray2.length == 0 && this.agendaForValidation !='PM10:_first_meeting_with_cs'){
      return true
    } else{
      return false
    }
  }
  DisHandle3(){
    if(this.EmailsArray3.length == 0 && this.agendaForValidation !='PM10:_first_meeting_with_cs'){
      return true
    } else{
      return false
    }
  }

  //To create MOM
  createMOM() {
    
    var MLI_array = this.mom.get(
      "emails"
    ) as FormArray;
   
    const control = <FormArray>this.mom.controls['emails'];
    while (control.length > 0) {
      control.removeAt(0)
    }

    console.log(MLI_array);
    this.EmailsArray.forEach(el=>{
      MLI_array.push(new FormControl(el))
    })

    if (this.mom.valid) {
      this.loaderService.display(true);
      this.calenderService.createMOM(this.mom.value, this.eventId).subscribe(
        (event) => {
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
          this.successalert = true;
          this.EmailsArray =[];
          this.successMessage = "MOM successfully created";
          location.reload(true);
          this.loaderService.display(false);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
        },
        (error) => {
          this.erroralert = true;
          this.errorMessage = "MOM not created";
          this.loaderService.display(false);
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
        }
      );
      this.mom.reset();
      $("#addmom").modal("hide");
      setTimeout(
        function () {
          location.reload(true);
        }.bind(this),
        1000
      );
    }
  }

  //To View MOM
  momView() {
    this.calenderService.momView(this.eventId).subscribe(
      (res) => {
        this.view_mom = res;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
      },
      (error) => {
        this.erroralert = true;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  //to close view mom
  closeViewMoM() {
    $("#view-mom").modal("hide");
  }
  showCm = false
  setCurrentTimestamp() {
    this.meetingform.controls["scheduled_at"].setValue(
      new Date(new Date().getTime() + 330 * 60000).toJSON().slice(0, 19)
    );
    this.showCm = false
         setTimeout(() => {
        
         }, 200);
         this.meetingform.controls["project"].setValue(
          null
        );
  }

  ClearGmFilter() {
    this.selectedGmItems = [];
    this.gms = [];
    this.user_Filter("", 1, "", "");
  }

  ClearCmFilter() {
    this.selectedCmItems = [];
    this.cms = [];
    this.user_Filter("", "", 1, "");
  }

  CleardesignerFilter() {
    this.selectedDesignerItems = [];
    this.designers = [];
    this.user_Filter("", "", "", 1);
  }
  ReFormattitle(e){
  
    if(e!=''){
      let word = e.split("/");
     
  
      let start_word = word[0];
       
      word = word[1];
     
      word = word.split(" "); 
     
    
     let  word2:any =[]
      word.forEach(el=> {
        if (el !='PM10'){

          el = el.charAt(0).toUpperCase()+ el.slice(1);
         word2.push(el);
        }
      });
       
     
       
      word2 = start_word+"/"+ word2.join(" ");
     
     
        return word2;

    } else{
      console.log("title is empty");
      return "";

    }
   
     
  }
  ReFormat(e){
    e = e?e:"";
    let word = e.split("_");
   let  word2:any =[]
    word.forEach(el=> {
      if (el !='PM10'){
        el = el.charAt(0).toUpperCase()+el.slice(1);
       word2.push(el);
      }
    });
    word2 =  word2.join("_");
      return word2;
  }
  date_details: Date;
  remarks_details: string;
  reschedule_onholdsubmit(){
   console.log( this.date_details,this.remarks_details)
    if(this.role != 'business_head') {
      if(this.is10percentDone){
        $("#OtpModal").modal("show");
        this.inputs.forEach(input => {
          input.value = ''; 
        })
        this.ShareOtp();
      } else{
        this.reschedule_onhold()
      }
    
    }  else{
      this.reschedule_onhold()
    }
     this.ExtendObj['reason_for_lost'] = this.remarks_details;
      this.ExtendObj['scheduled_at'] = this.date_details

  }
  ExtendObj ={}
  AlreadyOTP(){

      $("#OtpModal").modal("show");
    this.inputs.forEach(input => {
      input.value = ''; 
    })
    $("#statusModal").modal("hide");
    $("#statusModal3").modal("hide");

      this.ExtendObj['reason_for_lost'] = this.remarks_details;
      this.ExtendObj['scheduled_at'] = this.date_details
  }
  Fetchvalues(){
    this.date_details =  $("#modal_date").val()
    this.remarks_details =  $("#RemarkID").val()
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


  ShareOtp(){

    this.inputs.forEach(input => {
      input.value = ''; 
    });
    this.loaderService.display(true)
    console.log(this.statusDetails)
    let obj = {

    }
    this.showLoader = true
    this.ExtendObj['reason_for_lost'] = this.remarks_details;
    this.ExtendObj['scheduled_at'] = this.date_details
    this.designerService.ShareOtp(this.currentEvent.ownerable_id,'extend_on_hold',obj,this.ExtendObj).subscribe(res=>{
    
      this.showLoader = false
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
      this.showLoader = false
      this.loaderService.display(false);
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);



    })

  }
  reschedule_onhold() {
    this.showLoader = true
    this.leadService.updateonholdEvent(this.currentEvent.id,this.currentEvent.ownerable_id,this.date_details, this.remarks_details,'').subscribe(res => {
      this.loaderService.display(false)
      this.successalert = true;
      this.showLoader = false
      this.repopulateCalendar();
      this.statusDetails["customer_status"] = undefined
      this.successMessage = 'Rescheduled successfully!';
      setTimeout(function() {
             this.successalert = false;
      }.bind(this), 2000);
    $("#statusModal3").modal("hide");
    $("#OtpModal").modal("hide");
    },
    err => {
      this.loaderService.display(false)
      this.showLoader = false
      this.erroralert = true;
      this.loaderService.display(false);
        this.errorMessage = 'Failed to Update';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);

    })
  }
  showLoader = false
  Submit(){
    console.log(this.otpValue);
    this.showLoader = true
    this.loaderService.display(true)
    this.designerService.VerifyOtp( this.currentEvent.ownerable_id,this.otpValue).subscribe(res=>{
     $("#OtpModal").modal("hide");


     this.reschedule_onhold()
     this.successMessage = 'OTP verification Done';



    },
    err=>{
      this.loaderService.display(false)
      this.erroralert = true;
      this.loaderService.display(false);
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);
        this.showLoader = false



    })
   }
   SendOTP(){
    $("#OtpModal").modal("show");
    $("#OtpModalCheck").modal("hide");
    this.inputs.forEach(input => {
      input.value = ''; 
    });
    this.ShareOtp()

  }

  getAllSpaces(){
    this.leadService.getAllSpaces().subscribe((res:any)=>{
      this.spaces = [...res.spaces,'Services'];
    })
  }

  additionalInfoNotes:any = ''
  showReviewDesign(){
    this.activeIndex = 0;
    this.activeIndexAccordion = 0;
    this.additionalInfoNotes = '';
    this.showLoader =true;
    this.leadService.getSpaceDetails(this.currentEvent.id).subscribe((res)=>{
      this.allSpaceEventDetails = res;
      if(res.event_spaces	 && res.event_spaces.length > 0){
        this.currentSpaceDetails = res.event_spaces[0]
      }
      if(res.event){
        this.additionalInfoNotes = res.event.mom_description;
      }
      this.showLoader =false;
      $('#viewEventModal').modal('hide');
      $('#designMeetingModalReview').modal('show');
      setTimeout(()=>{
        this.onScrollReview();
        this.checkImageScrollButtonsReview();
      },100)
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  getSpaceDetails(id:any, typesLoade:any, isNewSapece:any){
    this.activeIndex = 0;
    this.additionalInfoNotes = '';
    this.showLoader =true;
    this.leadService.getSpaceDetails(id).subscribe((res)=>{
      this.allSpaceEventDetails = res;
      if(res.event_spaces	 && res.event_spaces.length > 0 && typesLoade){
        this.currentSpaceDetails = res.event_spaces[0]
      }else if(res.event_spaces	 && res.event_spaces.length > 0 && !typesLoade){
        let responseFilter:any = res.event_spaces.filter((res2:any)=> res2.id == this.currentSpaceDetails.id);
        if(responseFilter && responseFilter.length > 0){
          this.currentSpaceDetails = responseFilter[0]
        }else{
          this.currentSpaceDetails = res.event_spaces[0]
          this.activeIndexAccordion = 0;
        }
      }
      if(isNewSapece){
        let arrayIndex = res.event_spaces.length - 1 < 0 ? 0 : res.event_spaces.length - 1;
        this.currentSpaceDetails = res.event_spaces[arrayIndex]
      }
      if(res.event && this.meetingFormTwo.get('additionalNote').value == null){
        this.meetingFormTwo.controls["additionalNote"].setValue(res.event.mom_description)
      }
      this.showLoader =false;
      setTimeout(()=>{
        this.onScroll();
        this.checkImageScrollButtons();
      },100)
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  submitForm() {
    console.log(this.meetingFormTwo.valid);
    if (this.meetingFormTwo.valid) {
        this.saveForLater('submiit')
    }
  }

  saveForLater(type) {
    this.showLoader = true;
    let reqBody = {
      "status": this.currentEvent.status,
      "mom_description": this.meetingFormTwo.get('additionalNote').value,
    }
      this.calenderService
        .updateStatusDesignEvent(reqBody , this.currentEvent.id)
        .subscribe(
          (event) => {
            event = event;
            if(type == 'save latter'){
              $("#designMeetingModal").modal("hide");
              this.meetingFormTwo.reset();
            }else{
              $("#designMeetingModal").modal("hide");
              // if(this.currentEvent.do_not_share_otp_with_customer){
              this.isFinalDesign = 'no'
              $("#otpModalTwo").modal("show");
              // }else{
              //   $("#otpModalbox").modal("show");
              // }
            }
            this.showLoader = false;
          },
          (error) => {
            this.erroralert = true;
            this.showLoader = false;
            this.errorMessage = JSON.parse(error["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
          }
        );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      // Clear previous selections
      // this.images = [];
      // this.selectedFiles = [];

      // Loop through each file
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Push image URL for preview
          this.images.push({ url: e.target.result });
        };
        reader.readAsDataURL(file);

        // Add file to selectedFiles array
        this.selectedFiles.push(file);
      });
      setTimeout(()=>{
        this.onImagePaginationScroll();
      },100)
    }
    this.onImagePaginationScroll();
  }

  onFileSelectedTwo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      // Clear previous selections
      // this.images = this.currentSpaceDetails.space_images;
      // this.selectedFiles = [];

      // Loop through each file
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Push image URL for preview
          this.images.push({ url: e.target.result });
        };
        reader.readAsDataURL(file);

        // Add file to selectedFiles array
        this.selectedFiles.push(file);
        setTimeout(()=>{
          this.onImagePaginationScrollThree();
        },100)
      });
    }
    this.onImagePaginationScrollThree();;
  }

  removeImage(image: { id?: string, url: string }, index: number) {
    if (image.id) {
      this.activeIndex = 0;
      this.deleteSpaceImage(image.id, this.currentSpaceDetails.id)
      this.images.splice(index, 1);
      setTimeout(() => {
        this.onImagePaginationScrollThree();
      }, 100);
    } else {
      this.activeIndex = 0;
      this.images.splice(index, 1);
      this.selectedFiles.splice(index, 1);
      setTimeout(() => {
        this.onImagePaginationScrollThree();
        this.onImagePaginationScroll();
      }, 100);
    }
  }

  addSpace() {
    this.activeIndex = 0;
    let id = this.currentEvent.id;
    let formData = new FormData();
    formData.append(`space_name`,this.selectedSpace);
    this.selectedFiles.forEach((file, index) => {
      formData.append(`images[]`, file);
    });
    this.showLoader =true;
    this.leadService.addSpaceToEventMOM(id, formData).subscribe((res:any)=>{
      $("#addSpaceModal").modal("hide");
      $("#designMeetingModal").modal("show");
      this.getSpaceDetails(id, false, true);
      this.images = [];
      this.selectedFiles = []
      this.selectedSpace = ''
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  EditSpace(){
    this.activeIndex = 0;
    let id = this.currentEvent.id;
    let spaceId = this.currentSpaceDetails.id;
    let formData = new FormData();
    formData.append(`space_name`,this.selectedSpace);
    this.selectedFiles.forEach((file, index) => {
      formData.append(`images[]`, file);
    });
    this.showLoader =true;
    this.leadService.updateSpaceToEventMOM(id, formData, spaceId).subscribe((res:any)=>{
      $("#addSpaceModal").modal("hide");
      $("#editSpaceModal").modal("hide");
      $("#designMeetingModal").modal("show");
      this.getSpaceDetails(id, false, false);
      this.images = [];
      this.selectedFiles = []
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  editSpaceFunction(obj:any){
    this.activeIndex = 0;
    this.images = obj.space_images;
    this.selectedSpace = obj.space;
    $('#editSpaceModal').modal('show');
    $("#designMeetingModal").modal("hide");
    setTimeout(()=>{
      this.onImagePaginationScrollThree();
    },200)
    
  }

  deleteSpace(space_id:any){
    this.activeIndex = 0;
    let id = this.currentEvent.id;
    this.showLoader =true;
    this.activeIndex = 0;
    this.activeIndexAccordion = 0;
    this.leadService.deleteSpaceToEventMOM(id, space_id).subscribe((res:any)=>{
      this.images = [];
      this.selectedFiles = []
      this.getSpaceDetails(id, true, false);
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  unitId:any =''
  editSpaceUnit(space_id:any, unit:any){
    this.images = [];
    this.selectedFiles = [];
    this.selectedUnit = unit.name;
    this.unitDescription = unit.remark	
    this.unitId = unit.id;
    this.getUnitDatas(this.currentEvent.id, this.currentSpaceDetails.name);
    $('#designMeetingModal').modal('hide');
    $('#editUnitModal').modal('show');
  }

  deleteSpaceUnit(unit_id:any, space_id:any){
    let id = this.currentEvent.id;
    this.showLoader =true;
    this.activeIndexAccordion = 0;
    this.leadService.deleteSpaceUnit(unit_id, id, space_id).subscribe((res:any)=>{
      this.getSpaceDetails(id, false, false);
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  deleteSpaceImage(img_id:any, space_id:any){
    let id = this.currentEvent.id;
    this.showLoader =true;
    this.activeIndex = 0;
    this.leadService.deleteSpaceToEventImage(id, space_id, img_id).subscribe((res:any)=>{
      console.log('loades sucess')
      this.getSpaceDetails(id, false, false);
    },(error) => {
      console.log('loades error')
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  changeActiveImage(index: number) {
    this.activeIndex = index;
  }

  prevImage(type, array) {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else {
      this.activeIndex = ( type == 1 ? array.length -1 : this.images.length - 1);  // Loop to the last image
    }
  }

  nextImage(type:any, array:any) {
    let newArrayLength = (type == 1 ? array.length - 1 : this.images.length - 1);
    if (this.activeIndex < newArrayLength) {
      this.activeIndex++;
    } else {
      this.activeIndex = 0;  // Loop to the first image
    }
  }

  moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (currentInput.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  // Move to previous input on backspace
  moveToPrevious(event: KeyboardEvent, currentInput: HTMLInputElement, previousInput: HTMLInputElement) {
    const allowedKeys = ['Backspace', 'Delete'];
    if (allowedKeys.includes(event.key) && currentInput.value === '') {
      if (previousInput) {
        previousInput.focus();
      }
    } else if (allowedKeys.includes(event.key) && currentInput.value.length === 1) {
      currentInput.value = ''; // Clear current input
    }
  }

  // Allow only numeric input
  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault(); // Block non-numeric inputs
    }
  }

  // Handle OTP submission
  submitOtp() {
    const otp = this.otpDigits.join('');
    if (otp.length === 6) {
      this.verifyOtp();
    } else {
      console.log('Incomplete OTP');
    }
  }

  // Start countdown timer for OTP resend
  startResendTimer() {
    this.intervalId = setInterval(() => {
      if (this.resendTimeout > 0) {
        this.resendTimeout--;
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  // Resend OTP function
  resendOtp(type) {
   this.showLoader =true;
   this.leadService.shareOTPevent(this.currentEvent.id).subscribe((res)=>{
    if(type == 1){
      $('#otpModalbox').modal("hide");
      //  this.isFinalDesign = 'no'
      $("#otpModal").modal("show");
    }
    this.showLoader =false;
   },(error) => {
    this.erroralert = true;
    this.showLoader =false;
    this.errorMessage = JSON.parse(error["_body"]).message;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      2000
    );
  })
  }

  openOtpPopup(){
    $('#otpModalbox').modal("hide");
    //  this.isFinalDesign = 'no'
    $("#otpModal").modal("show");
  }

  // Close modal function
  closeModal() {
    console.log('Modal closed');
    // Logic to close the modal
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  openFileDialogTwo(){
    this.fileInputTwo.nativeElement.click();
  }

  openAddSpacePopup(){
    this.images = [];
    this.selectedFiles = [];
    this.selectedSpace = '';
    $("#addSpaceModal").modal("show");
    $("#designMeetingModal").modal("hide");
  }

  changeCurrentSpsceDetails(res){
    this.currentSpaceDetails = res
    this.changeActiveImage(0);
    setTimeout(()=>{
      this.onImageScroll();
      this.calculateMaxScroll();
      this.checkImageScrollButtons();
      this.checkImagePaginationScrollButtons();
      this.checkImagePaginationScrollButtonThree();
      this.onScroll();
    },100)
  }

  closeSpaceModalPopUp(){
    this.activeIndex = 0;
    this.getSpaceDetails(this.currentEvent.id, true, false);
    this.images = [];
    this.selectedFiles = []
    $("#addSpaceModal").modal("hide");
    $("#designMeetingModal").modal("show");
    $('#editSpaceModal').modal('hide');
    setTimeout(()=>{
      this.onScroll();
    },100)
  }


  addUnit() {
    this.selectedUnit = this.unitDescription = '';
    this.getUnitDatas(this.currentEvent.id, this.currentSpaceDetails.name);
    $('#designMeetingModal').modal('hide');
    $('#addUnitModal').modal('show');

  }


  // Function to toggle the accordion
  toggleAccordion(index: number) {
    // If it's the currently open accordion, close it
    if (this.activeIndexAccordion === index) {
      this.activeIndexAccordion = null;
    } else {
      this.activeIndexAccordion = index; // Set the active index to the clicked accordion
    }
  }

  selectUnits = [];  // List of units
  selectedUnit: string = '';  // Selected unit value
  unitDescription: string = '';  // Description for the selected unit

  // Method to close the modal
  closeUnitModalPopUp() {
    // Logic to close the modal
    $('#addUnitModal').modal('hide');
    $('#editUnitModal').modal('hide');
    $('#designMeetingModal').modal('show');
    setTimeout(()=>{
      this.onScroll();
    },100)
  }

  // Method to add the selected unit and description
  addUnitDetails() {
    let reqBody:any = {
      unit: this.selectedUnit,
      remark: this.unitDescription,
    }
    this.showLoader = true;
    this.leadService.addSpaceUnit(this.currentEvent.id, reqBody, this.currentSpaceDetails.id).subscribe((res:any)=>{
      this.activeIndexAccordion =  this.currentSpaceDetails.space_units.length ? this.currentSpaceDetails.space_units.length : 0;
      this.getSpaceDetails(this.currentEvent.id, false, false);
      this.closeUnitModalPopUp();
    },
    (error) => {
      this.erroralert = true;
      this.showLoader = false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  editUnitDetails(){
    let reqBody:any = {
      unit: this.selectedUnit,
      remark: this.unitDescription,
      unit_id: this.unitId
    }
    this.showLoader = true;
    this.leadService.updateSpaceUnit(reqBody, this.currentEvent.id, this.currentSpaceDetails.id).subscribe((res:any)=>{
      this.getSpaceDetails(this.currentEvent.id, false, false);
      this.closeUnitModalPopUp();
    },
    (error) => {
      this.erroralert = true;
      this.showLoader = false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  verifyOtp(){
    this.showLoader = true;
    this.leadService.verifyOTP(this.otpDigits.join(''),this.currentEvent.id,).subscribe((res:any)=>{
      this.designItrationFinalApi('done', 'popup2')
      console.log(res)
    },
    (error) => {
      this.erroralert = true;
      this.showLoader = false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }


  designItrationFinalApi(status:any, from:any) {
     let reqBody = {
      "status": status,
      "remark": this.meetingFormTwo.get('additionalNote').value,
      "mom_description": this.meetingFormTwo.get('additionalNote').value,
      "final_design_session": (this.isFinalDesign == 'no' ? false : true)
    }
    
    console.log(reqBody)
      this.calenderService
        .updateStatusDesignEvent(reqBody , this.currentEvent.id)
        .subscribe(
          (event) => {
            event = event;
            $("#updateEventModal").modal("hide");
            $("#viewEventModal").modal("hide");
            $("#markModal").modal("hide");
            $("#otpModal").modal("hide");
            $("#otpModalTwo").modal("hide");
            $("#designMeetingModal").modal("hide");

            if(from == 'popup' && (this.currentEvent.do_not_share_otp_with_customer == false && this.isFinalDesign == 'yes')){
              $("#otpModalbox").modal("show");
            }else{
              this.successalert = true;
              this.EmailsArray2 =[];
              this.markDoneform.controls["remark"].setValue('');
              if (this.status == "done") {
                this.successMessage = "Event  Marked as Done";
              }
              if (this.status == "cancelled") {
                this.successMessage = "Event  Marked as cancelled";
              }
            }
            this.repopulateCalendar();
            this.showLoader = false;
          },
          (error) => {
            this.erroralert = true;
            this.showLoader = false;
            this.errorMessage = JSON.parse(error["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
          }
        );
    
  }

  closeDesignModalPopUp(){
    this.activeIndex = 0;
    $('#designMeetingModal').modal('hide');
    this.meetingFormTwo.reset();
    this.otpDigits = new Array(6).fill('');
  }

  calculateMaxScroll() {
    try{
      const scrollableWidth = this.scrollContainer.nativeElement.scrollWidth;
      const visibleWidth = this.scrollContainer.nativeElement.clientWidth;
      this.maxScrollPosition = scrollableWidth - visibleWidth;
    }catch(e){}
  }

  scrollLeft() {
    try{
      this.scrollContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
    }catch(e){}
  }

  scrollRight() {
    try{
      this.scrollContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
    }catch(e){}
  }

  // Listen for manual scroll event
  onScroll() {
    try{
      // Calculate and update the scroll position dynamically during the scroll event
      this.scrollPosition = this.scrollContainer.nativeElement.scrollLeft;
      this.calculateMaxScroll();  // Update maxScrollPosition dynamically
    }catch(e){}
  }

  calculateMaxScrollReview() {
    try{
      const scrollableWidth = this.scrollContainerReview.nativeElement.scrollWidth;
      const visibleWidth = this.scrollContainerReview.nativeElement.clientWidth;
      this.maxScrollPositionReview = scrollableWidth - visibleWidth;
    }catch(e){}
  }

  scrollLeftReview() {
    try{
      this.scrollContainerReview.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
    }catch(e){}
  }

  scrollRightReview() {
    try{
      this.scrollContainerReview.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
    }catch(e){}
  }

  // Listen for manual scroll event
  onScrollReview() {
    try{
      this.scrollPosition = this.scrollContainerReview.nativeElement.scrollLeft;
      this.calculateMaxScrollReview();  // Update maxScrollPosition dynamically
    }catch(e){}
    
  }

  scrollImageLeft() {
    try{
      const scrollAmount = 100; // Scroll by 100px
      this.imagePaginationTwo.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      this.checkImageScrollButtons();
    }catch(e){}
    
  }
  
  scrollImageRight() {
    try{
      const scrollAmount = 100; // Scroll by 100px
      this.imagePaginationTwo.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      this.checkImageScrollButtons();
    }catch(e){}
  }
  
  onImageScroll() {
    this.checkImageScrollButtons();
  }
  

  checkImageScrollButtons() {
    try{
      const container = this.imagePaginationTwo.nativeElement;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
      this.isImageScrollLeftDisabled = container.scrollLeft === 0;
    
      this.isImageScrollRightDisabled = container.scrollLeft >= maxScrollLeft;
    }catch(e){}
    
  }

  scrollImageLeftReview() {
    try{
      const scrollAmount = 100; // Scroll by 100px
      this.imagePaginationTwoReview.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      this.checkImageScrollButtonsReview();
    }catch(e){}
   
  }
  
  scrollImageRightReview() {
    try{
      const scrollAmount = 100; // Scroll by 100px
      this.imagePaginationTwoReview.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      this.checkImageScrollButtonsReview();
    }catch(e){}
   
  }
  
  onImageScrollReview() {
    this.checkImageScrollButtonsReview();
  }
  

  checkImageScrollButtonsReview() {
    try{
      const container = this.imagePaginationTwoReview.nativeElement;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
      this.isImageScrollLeftDisabledReview = container.scrollLeft === 0;
    
      this.isImageScrollRightDisabledReview = container.scrollLeft >= maxScrollLeft;
    }catch(e){}
   
  }

  scrollImagePaginationLeft() {
    try{
      const scrollAmount = 100;
      this.imagePagination.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      this.checkImagePaginationScrollButtons();
    }catch(e){}
    
  }
  
  scrollImagePaginationRight() {
    try{
      const scrollAmount = 100;
      this.imagePagination.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      this.checkImagePaginationScrollButtons();
    }catch(e){}
   
  }
  
  onImagePaginationScroll() {
    this.checkImagePaginationScrollButtons();
  }
  
  checkImagePaginationScrollButtons() {
    try{
      const container = this.imagePagination.nativeElement;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
      this.isImagePaginationLeftDisabled = container.scrollLeft === 0;
    
      this.isImagePaginationRightDisabled = container.scrollLeft >= maxScrollLeft;
    }catch(e){}
    
  }

  scrollImagePaginationLeftThree() {
    try{
      const scrollAmount = 100;
      this.imagePaginationThree.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      this.checkImagePaginationScrollButtonThree();
    }catch(e){}
   
  }
  
  scrollImagePaginationRightThree() {
    try{
      const scrollAmount = 100;
      this.imagePaginationThree.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      this.checkImagePaginationScrollButtonThree();
    }catch(e){}
  }
  
  onImagePaginationScrollThree() {
    this.checkImagePaginationScrollButtonThree();
  }
  
  checkImagePaginationScrollButtonThree() {
    try{
      const container = this.imagePaginationThree.nativeElement;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
      this.isImagePaginationLeftDisabledThree = container.scrollLeft === 0;
    
      this.isImagePaginationRightDisabledThree = container.scrollLeft >= maxScrollLeft;
    }catch(e){}
  }

  getUnitDatas(id, name){
    this.selectUnits = [];
    this.showLoader =true;
    this.leadService.getSpaceUnits(id, name).subscribe((res)=>{
     this.selectUnits = res.units	
     this.showLoader = false;
    },(error) => {
      this.erroralert = true;
      this.showLoader =false;
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }


  activeIndexAccordionLogs:any = null;

  openHistoryLogModel(){
    this.activeIndexAccordionLogs = null
    $('#designHistoryLog').modal('show');
    $('#designMeetingModalReview').modal('hide');
  }

  closeHistoryLogModel(){
    $('#designHistoryLog').modal('hide');
    $('#designMeetingModalReview').modal('show');
  }

  toggleAccordionLogs(index: number): void {
    this.activeIndexAccordionLogs = this.activeIndexAccordionLogs === index ? null : index;
  }
  
}
