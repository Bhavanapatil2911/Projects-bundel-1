import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { LoaderService } from 'app/services/loader.service';
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;
@Component({
  selector: 'app-pm-hundred-dashboard',
  templateUrl: './pm-hundred-dashboard.component.html',
  styleUrls: ['./pm-hundred-dashboard.component.css'],
  providers: [CategoryService]

})
export class PmHundredDashboardComponent implements OnInit {

  constructor(private service: CategoryService, private loader: LoaderService) { }

  per_page: any;
  current_page: any;
  total_page: any;
  modalHeading: any;
  modalTableHeading: any;
  modalTableData: any = [];
  oneJan: any;
  CheckLoad:any;
  loadCount =0;
  selectedSummary = []
  todayCurrentDate :any

  ngOnInit() {
    this.setDate()
    this.getPMDataList();
    this.getSummary();
    var currentdate: any = new Date();
    this.oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - this.oneJan) / (24 * 60 * 60 * 1000));
    var WeekNumber: number = numberOfDays / 7;
    this.detailFlag = true;
    this.getAllStores();
  }

  setDate() {
    var currentdatee: any = new Date();
    this.selectedDate = moment(currentdatee).format('YYYY-MM-DD');
  }
  ClearFiltersDetail(){
    this.selectedDateDetail = ''
    this.selectedStoreIdDetail = []
    this.storesDetail = []
    // this.setDate()
    this.filterValue = ''
    this.getPMDataList()
  }

  headers_res2: any = []
  pmListingData: any = [];
  getPMDataList(e?) {

    this.loader.display(true)
    e = e ? e : "";
    this.service.getPMListingData(e, this.storesDetail, this.selectedDateDetail, this.filterValue).subscribe((res) => {
      this.pmListingData = [];
      let convertedJson = res.json();
      this.loadCount ++
      if(this.loadCount > 1){
        this.loader.display(false);
      } 
      this.pmListingData = convertedJson;
      this.headers_res2 = res.headers._headers;
      this.per_page = this.headers_res2.get("x-per-page");
      this.total_page = this.headers_res2.get("x-total");
      this.current_page = this.headers_res2.get("x-page");
    })
  }


  addBA_panel: any = false;
  addBA_service: any = false;
  value: any = false;
  addPanel_target: any = false;
  addService_target: any = false;
  modalHandle(event: any) {
    switch (event) {
      case 'BA_panel':
        this.addBA_panel = true;
        this.addPanel_target = false;
        this.addBA_service = false;
        this.value = false;
        this.addService_target = false;
        this.modalHeading = 'Add verified balance amount panel';
        this.modalTableHeading = 'Verified Balance Amount Panel';
        break;
      case 'BA_service':
        this.addBA_service = true;
        this.addPanel_target = false;
        this.addBA_panel = false;
        this.addService_target = false;
        this.value = false;
        this.modalHeading = 'Add verified balance amount service';
        this.modalTableHeading = 'Verified Balance Amount Service';
        break;
      case 'value':
        this.addBA_service = false;
        this.addBA_panel = false;
        this.addPanel_target = false;
        this.addService_target = false;
        this.value = true;
        this.modalHeading = 'Add remarks';
        this.modalTableHeading = 'Refrence No.'
        break;
      case 'panel_target':
        this.addBA_service = false;
        this.addBA_panel = false;
        this.addService_target = false;
        this.value = false;
        this.addPanel_target = true;
        this.modalHeading = 'Add panel target';
        this.modalTableHeading = 'Week';
        break;
      case 'service_target':
        this.addBA_service = false;
        this.addBA_panel = false;
        this.value = false;
        this.addPanel_target = false;
        this.modalHeading = 'Add service target';
        this.modalTableHeading = 'Week';
        this.addService_target = true;

    }
    ($('#remarksModal') as any).modal('show');

  }


  onModalCloseHandle() {
    this.showAddOption = false;
    ($('#remarksModal') as any).modal('hide');
  }


  showAddOption: any = false
  addHandle() {
    this.showAddOption = true;
  }


  addBA_panelInput: any;
  addBA_panelHandle() {
    this.service.addBalancePanelAmount(this.BApanelLeadId, this.addBA_panelInput).subscribe((res) => {
    })
    this.onModalCloseHandle();
    this.getPMDataList();
  }


  addBA_serviceInput: any;
  addBA_serviceHandle() {
    this.service.addBalanceServiceAmount(this.BAserviceLeadId, this.addBA_serviceInput).subscribe(() => { })
    this.onModalCloseHandle();
    this.getPMDataList();
  }


  valueInput: any;
  valueHandle() {
    this.service.addremarksValue(this.valueLeadId, this.valueInput).subscribe(() => { })
    this.onModalCloseHandle();
    this.getPMDataList();
  }


  BApanelLeadId: any = ''
  getBApanelHandle(event: any) {
    this.modalTableData = [];
    this.BApanelLeadId = event;
    this.service.getPanelAmountList(event).subscribe((res) => {
      if (!res.pm_dashboard_data) {
        this.modalTableData = res;
      }

    })
  }


  BAserviceLeadId: any = ''
  getBAserviceHandle(event: any) {
    this.modalTableData = [];
    this.BAserviceLeadId = event;
    this.service.getServiceAmountList(event).subscribe((res) => {
      if (!res.pm_dashboard_data) {
        this.modalTableData = res;
      }
    })
  }


  valueLeadId: any = ''
  getValueHandle(event: any) {
    this.modalTableData = [];
    this.valueLeadId = event;
    this.service.getremarksList(event).subscribe((res) => {
      if (!res.pm_dashboard_data) {
        this.modalTableData = res;
      }
    })
  }

  Panel_targetDateInput: any = '';
  Panel_targetvalueInput: any = '';
  Panel_targetHandle() {
    this.service.addPanelTarget(this.panelTargetLeadId, this.Panel_targetDateInput, this.Panel_targetvalueInput, this.panelBoqId).subscribe((res) => {
      this.onModalCloseHandle();
      this.getPMDataList();
    })
  }

  panelBoqListing: any = [];
  panelTargetLeadId: any = ''
  getPanelTargetHandle(event: any,type: any) {
    this.modalTableData = [];
    this.panelBoqListing = [];
    this.panelTargetLeadId = event;
    this.service.getPanelTarget(event).subscribe((res) => {
      if (!res.pm_dashboard_data) {
        this.modalTableData = res;
      }
    })
    this.service.targetBoqListing(this.selectedDate, type, event).subscribe((res) => {
      this.panelBoqListing = res.boq_list;
    })
  }


  weeksCalucateHandle(date) {
    if (date != null) {
      var currentDate = date;
      currentDate = new Date(currentDate);
      var numberOfDays = Math.floor((currentDate - this.oneJan) / (24 * 60 * 60 * 1000));
      var WeekNumber: number = numberOfDays / 7;
      return WeekNumber;
    }

  }

  serviceBoqListing: any = []
  serviceTargetLeadId: any = ''
  getServiceTargetHandle(event: any,type: any) {
    this.modalTableData = [];
    this.serviceBoqListing = [];
    this.serviceTargetLeadId = event;
    this.service.getServiceTarget(event).subscribe((res) => {
      if (!res.pm_dashboard_data) {
        this.modalTableData = res;
      }
    })
    this.service.targetBoqListing(this.selectedDate, type, event).subscribe((res) => {
      this.serviceBoqListing = res.boq_list;
      console.log(this.serviceBoqListing)
    })
  }

  service_targetDateInput: any = '';
  service_targetvalueInput: any = '';
  service_targetHandle() {
    this.service.addServiceTarget(this.serviceTargetLeadId, this.service_targetDateInput, this.service_targetvalueInput, this.serviceBoqId).subscribe((res) => {
      this.onModalCloseHandle();
      this.getPMDataList();
    })
  }

  detailFlag: any = false;
  TableHandle() {
    this.detailFlag = false;
    this.summaryFlag = true;
  }

  summaryFlag: any = false;
  DetailsHandle() {
    this.summaryFlag = false;
    this.detailFlag = true;
  }
  selectedDate :any
  selectedDateSummary: any
  selectedDateDetail: any
  onDateInput(event, tab_name: any) {
    console.log(event);
    
    switch (tab_name) {
      case 'summary':
        this.selectedDate = event;
        this.getSummary(event);
        break;

      case 'detail':
        this.selectedDateDetail = event;
        this.getPMDataList();
    }
  }

  summaryTableData: any = [];
  boqserviceTotal: any;
  boqPanelTotal: any;
  BoqToal: any;
  EBAservice: any;
  EBApanel: any;
  EBAtotal: any;
  targetService: any;
  targetPanel: any;
  targetTotal: any;
  actualService: any;
  actualPanel: any;
  actualToal: any;
  LWTservice: any;
  LWTpanel: any;
  LWTtotal: any;
  LWAservice: any;
  LWApanel: any;
  LWAtotal: any;
  UWTservice: any;
  UWTpanel: any;
  UWTtotal: any;

  ClearFiltersSummary(){
    this.selectedDateSummary = ''
    this.storesSummary = []
    this.selectedStoreIdSummary = []
    this.calenderValue = 'month'
    var currentdatee: any = new Date();
    this.selectedDate = moment(currentdatee).format('YYYY-MM-DD')
    this.getSummary()
  }
  getSummary(event?: any) {
    this.loader.display(true);
    this.service.getSummaryData(this.selectedDate,this.storesSummary,this.calenderValue).subscribe((res) => {
    this.loadCount++
    if(this.loadCount > 1){
      this.loader.display(false);
    }
      this.summaryTableData = [];
      this.summaryTableData = res;
      console.log("summmmmmaryyyy", this.summaryTableData);
      this.boqserviceTotal = 0;
      this.boqPanelTotal = 0;
      this.BoqToal = 0;
      this.EBAservice = 0;
      this.EBApanel = 0;
      this.EBAtotal = 0;
      this.targetService = 0;
      this.targetPanel = 0;
      this.targetTotal = 0;
      this.actualService = 0;
      this.actualPanel = 0;
      this.actualToal = 0;
      this.LWTservice = 0;
      this.LWTpanel = 0;
      this.LWTtotal = 0;
      this.LWAservice = 0;
      this.LWApanel = 0;
      this.LWAtotal = 0;
      this.UWTservice = 0;
      this.UWTpanel = 0;
      this.UWTtotal = 0;
      res.summary_data.forEach(element => {
        this.boqserviceTotal = this.boqserviceTotal + parseInt(element.this_week_service_value);
        this.boqPanelTotal = this.boqPanelTotal + parseInt(element.this_week_panel_value);
        this.BoqToal = this.BoqToal + parseInt(element.this_week_total_value);
        this.EBAservice = this.EBAservice + parseInt(element.this_week_expected_service_amount);
        this.EBApanel = this.EBApanel + parseInt(element.this_week_expected_panel_amount);
        this.EBAtotal = this.EBAtotal + parseInt(element.this_week_expected_total_amount);
        this.targetService = this.targetService + parseInt(element.this_week_target_service_value);
        this.targetPanel = this.targetPanel + parseInt(element.this_week_target_panel_value);
        this.targetTotal = this.targetTotal + parseInt(element.this_week_total_target_amount);
        this.actualService = this.actualService + parseInt(element.this_week_actual_service_amount);
        this.actualPanel = this.actualPanel + parseInt(element.this_week_actual_panel_amount);
        this.actualToal = this.actualToal + parseInt(element.this_week_actual_total_amount);
        this.LWTservice = this.LWTservice + parseInt(element.previous_week_target_service_value);
        this.LWTpanel = this.LWTpanel + parseInt(element.previous_week_target_panel_value);
        this.LWTtotal = this.LWTtotal + parseInt(element.previous_week_total_target_amount);
        this.LWAservice = this.LWAservice + parseInt(element.previous_week_actual_service_amount);
        this.LWApanel = this.LWApanel + parseInt(element.previous_week_actual_panel_amount);
        this.LWAtotal = this.LWAtotal + parseInt(element.previous_week_actual_total_amount);
        this.UWTservice = this.UWTservice + parseInt(element.next_week_target_service_value);
        this.UWTpanel = this.UWTpanel + parseInt(element.next_week_target_panel_value);
        this.UWTtotal = this.UWTtotal + parseInt(element.next_week_total_target_amount);
      });
    })
  }

  modalHeadingSum: any = '';
  boqService: any = false;
  tableHeader: any = [];
  EBAflag: any = false;
  targetAmountFlag: any = false;
  actualAmount: any = false;
  PWTflag: any = false;
  PWAflag: any = false;
  NWTflag: any = false;
  subTableModalHandle(event: any) {
    switch (event) {
      case 'boqService':
        this.boqService = true;
        this.EBAflag = false;
        this.targetAmountFlag = false;
        this.actualAmount = false;
        this.PWTflag = false;
        this.PWAflag = false;
        this.NWTflag = false;
        this.modalHeadingSum = 'Lead Value';
        this.tableHeader = [{ key: 'Lead ID' }, { key: 'Lead Name' }, { key: 'Lead Value' }
        ]
        break;

      case 'EBA':
        this.boqService = false;
        this.EBAflag = true;
        this.targetAmountFlag = false;
        this.actualAmount = false;
        this.PWTflag = false;
        this.PWAflag = false;
        this.NWTflag = false;
        this.modalHeadingSum = 'Expected Balance Amount';
        this.tableHeader = [{ key: 'Lead ID' }, { key: 'Lead Name' }, { key: 'Lead Value' },
        { key: 'Collection Value' }, { key: 'Verified Balance Amount' }
        ]
        break;

      case 'targetAmount':
        this.boqService = false;
        this.EBAflag = false;
        this.targetAmountFlag = true;
        this.actualAmount = false;
        this.PWTflag = false;
        this.PWAflag = false;
        this.NWTflag = false;
        this.modalHeadingSum = 'Target Amount';
        this.tableHeader = [{ key: 'Lead ID' }, {key : 'BOQ Number'}, { key: 'Lead Name' }, { key: 'Lead Value' },
        { key: 'Verified Balance Amount' }, { key: 'Target Amount' }
        ]
        break;

      case 'actualAmount':
        this.boqService = false;
        this.EBAflag = false;
        this.targetAmountFlag = false;
        this.actualAmount = true;
        this.PWTflag = false;
        this.PWAflag = false;
        this.NWTflag = false;
        this.modalHeadingSum = 'Actual Amount';
        this.tableHeader = [{ key: 'Lead ID' }, {key : 'BOQ Number'}, { key: 'Lead Name' }, { key: 'Lead Value' },
        { key: 'Total Collection' }, { key: 'Collection This Week' }
        ]
        break;

      case 'PWT':
        this.boqService = false;
        this.EBAflag = false;
        this.targetAmountFlag = false;
        this.actualAmount = false;
        this.PWTflag = true;
        this.PWAflag = false;
        this.NWTflag = false;
        this.modalHeadingSum = 'Last Week Target Amount';
        this.tableHeader = [{ key: 'Lead ID' },{key : 'BOQ Number'}, { key: 'Lead Name' }, { key: 'Lead Value' },
        { key: 'Verified Balance Amount' }, { key: 'Target Amount' }
        ]
        break;

      case 'PWA':
        this.boqService = false;
        this.EBAflag = false;
        this.targetAmountFlag = false;
        this.actualAmount = false;
        this.PWTflag = false;
        this.PWAflag = true;
        this.NWTflag = false;
        this.modalHeadingSum = 'Last Week Actual Amount';
        this.tableHeader = [{ key: 'Lead ID' }, {key : 'BOQ Number'} , { key: 'Lead Name' }, { key: 'Lead Value' },
        { key: 'Total Collection' }, { key: 'Collection This Week' }
        ]
        break;

      case 'NWT':
        this.boqService = false;
        this.EBAflag = false;
        this.targetAmountFlag = false;
        this.actualAmount = false;
        this.PWTflag = false;
        this.PWAflag = false;
        this.NWTflag = true;
        this.modalHeadingSum = 'Next Week Target Amount';
        this.tableHeader = [{ key: 'Lead ID' }, {key : 'BOQ Number'} , { key: 'Lead Name' }, { key: 'Lead Value' },
        { key: 'Verified Balance Amount' }, { key: 'Target Amount' }
        ]
    }

    ($('#subTableModal') as any).modal('show');

  }


  onSummaryModalCloseHandle() {
    ($('#subTableModal') as any).modal('hide');

  }

  subTableData: any = [];
  grandTotalSummary: any = [];
  getBoqServiceHandle(storeId: any, dateType: any, boqType: any) {
    console.log(this.calenderValue);
    this.service.getBoqServiceSummary(storeId, this.selectedDate, dateType, boqType,this.calenderValue).subscribe((res) => {
      this.subTableData = [];
      this.grandTotalSummary = [];
      this.subTableData = res;
      let leadValueTotal = 0;
      res.lead_detail_data.forEach(element => {
        leadValueTotal = leadValueTotal + element.lead_value;
        this.grandTotalSummary = [{ total: '' }, { total: leadValueTotal }];
      });
    })
  }


  getEBAHandle(storeId: any, dateType: any, boqType: any) {
    this.service.getEBASummary(storeId, this.selectedDate, dateType, boqType , this.calenderValue).subscribe((res) => {
      this.subTableData = [];
      this.grandTotalSummary = [];
      this.subTableData = res;
      let leadValueTotal = 0;
      let collectionValueTotal = 0;
      let VBAtotal = 0;
      res.lead_detail_data.forEach(element => {
        leadValueTotal = leadValueTotal + element.lead_value;
        collectionValueTotal = collectionValueTotal + element.collection_value;
        VBAtotal = VBAtotal + element.verified_balance_amount;
        this.grandTotalSummary = [{ total: '' }, { total: leadValueTotal }, { total: collectionValueTotal }, { total: VBAtotal }];
      });
    })
  }

  getTargetAmountHandle(storeId: any, dateType: any, boqType: any) {
    this.service.getTargetAmountSummary(storeId, this.selectedDate, dateType, boqType , this.calenderValue).subscribe((res) => {
      this.subTableData = [];
      this.grandTotalSummary = [];
      this.subTableData = res;
      let leadValueTotal = 0;
      let target_amount = 0;
      let VBAtotal = 0;
      res.lead_detail_data.forEach(element => {
        leadValueTotal = leadValueTotal + element.lead_value;
        target_amount = target_amount + element.target_amount;
        VBAtotal = VBAtotal + element.verified_balance_amount;
        this.grandTotalSummary = [{ total: '' }, {total : ''} , { total: leadValueTotal }, { total: VBAtotal }, { total: target_amount }];
      });
    })
  }

  getActualAmountHandle(storeId: any, dateType: any, boqType: any) {
    this.service.getActualAmountSummary(storeId, this.selectedDate, dateType, boqType , this.calenderValue).subscribe((res) => {
      this.subTableData = [];
      this.grandTotalSummary = [];
      this.subTableData = res;
      let leadValueTotal = 0;
      let weekCollection = 0;
      let totalCollection = 0;
      res.lead_detail_data.forEach(element => {
        leadValueTotal = leadValueTotal + element.lead_value;
        weekCollection = weekCollection + element.collection_this_week;
        totalCollection = totalCollection + element.total_collection;
        this.grandTotalSummary = [{ total: '' }, { total: '' }, { total: leadValueTotal }, { total: totalCollection }, { total: weekCollection }];
      });
    })
  }

  getPWTHandle(storeId: any, dateType: any, boqType: any) {
    this.service.getTargetAmountSummary(storeId, this.selectedDate, dateType, boqType ,this.calenderValue).subscribe((res) => {
      this.subTableData = [];
      this.grandTotalSummary = [];
      this.subTableData = res;
      let leadValueTotal = 0;
      let target_amount = 0;
      let VBAtotal = 0;
      res.lead_detail_data.forEach(element => {
        leadValueTotal = leadValueTotal + element.lead_value;
        target_amount = target_amount + element.target_amount;
        VBAtotal = VBAtotal + element.verified_balance_amount;
        this.grandTotalSummary = [{ total: '' },{ total: '' }, { total: leadValueTotal }, { total: VBAtotal }, { total: target_amount }];
      });
    })
  }

  store_dropdownSettings = {
    singleSelection: false,
    text: "Stores",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };

  store_dropdownList: any = [];
  getAllStores() {
    this.service.getStores().subscribe((res) => {
      this.store_dropdownList = [];
      this.store_dropdownList = res;
    })
  }



  selectedStoreIdDetail :any
  selectedStoreIdSummary :any

  storesSummary=[]
  storesDetail = []

  filterbystore(event: any, tab_name: any) {
    this.storesDetail = []
    this.storesSummary = []
    switch (tab_name) {
      case 'summary':
      for(var i =0 ; i < this.selectedStoreIdSummary.length ; i++){
       this.storesSummary.push(this.selectedStoreIdSummary[i].id )
      }
        this.getSummary();
        break;
      case 'detail':
      for(var i =0 ; i < this.selectedStoreIdDetail.length ; i++){
        this.storesDetail.push( this.selectedStoreIdDetail[i].id )
      }
      this.getPMDataList();
    }
    
    
    // console.log(this.selectedStoreDetail , 'add');
  }

  OnItemDeSelect(event: any, tab_name: any) {
    // console.log(event);
    // console.log(this.selectedStoreDetail, 'remove');
    switch (tab_name) {
      case 'summary':
        this.storesSummary.splice(this.storesSummary.indexOf(event.id), 1);
        this.getSummary();
        break;
      case 'detail':
        this.storesDetail.splice(this.storesDetail.indexOf(event.id), 1);
        this.getPMDataList();
    }
  }

  filterValue: any = '';
  onSearchFilterInput() {
    this.getPMDataList();

  }
  panelBoqId: any = ''
  panelBoqValueHandle(event) {
    console.log(event);
    this.panelBoqId = event;
  }
  serviceBoqId: any = ''
  serviceBoqValueHandle(event) {
    console.log(event)
    this.serviceBoqId = event;
  }
  calenderValue :any = 'month'
  filterByDateType(event){
    this.calenderValue = event.target.value;
    this.getSummary()
  }
}
