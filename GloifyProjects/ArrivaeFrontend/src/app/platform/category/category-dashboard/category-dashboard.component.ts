import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { LoaderService } from 'app/services/loader.service';
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;
@Component({
  selector: 'app-category-dashboard',
  templateUrl: './category-dashboard.component.html',
  styleUrls: ['./category-dashboard.component.css'],
  providers: [CategoryService]

})
export class CategoryDashboardComponent implements OnInit {

  constructor(private service: CategoryService,
    private loader: LoaderService) { }

  successalert: boolean = false;
  erroralert: boolean = false;
  successMessage: any;
  errorMessage: any;
  selectedFactory = [];
  selectedCategory = [];
  selectedStatus = [];
  selectedPriorityDetail = [];
  selectedOmDetail = [];

  factory_dropdownList: any = [
    {
      id: 'Vista - Delhi NCR', itemName: 'Vista - Delhi NCR'
    }, {
      id: 'Futura - Bangalore', itemName: 'Futura - Bangalore'
    }, {
      id: 'Rawat - Pune', itemName: 'Rawat - Pune'
    }, {
      id: 'Indoline - For special Finish (Nasic)', itemName: 'Indoline - For special Finish (Nasic)'
    }, {
      id: 'D.Y. Enterprises', itemName: 'D.Y. Enterprises'
    }, {
      id: 'ELITE FURNITURE', itemName: 'ELITE FURNITURE'
    }, {
      id: 'Master Craft', itemName: 'Master Craft'
    }, {
      id: 'Urbano Hub', itemName: 'Urbano Hub'
    }, {
      id: 'Acmeview', itemName: 'Acmeview'
    },
    {
      id : 'Blend Space' , itemName : 'Blend Space'
    },
    {
      id : 'Shangpin' , itemName : 'Shangpin'
    },
    {
      id : 'Tischlers' , itemName : 'Tischlers'
    },
    {
      id : 'Arrtiq Int' , itemName : 'Arrtiq Int'
    },{
      id : 'Indoline' , itemName : 'Indoline'
    }
  ];


  category_dropdownList: any = [
    { id: 'FHI', itemName: 'FHI' },
    { id: 'LF', itemName: 'LF' },
    { id: 'MTO', itemName: 'MTO' },
    { id: 'MKW', itemName: 'MKW' }
  ];

  status_dropdownList: any = [
    { id: 'Production Not Started', itemName: 'Production Not Started' },
    { id: 'Production in Progress', itemName: 'Production in Progress' },
    { id: 'Production Done', itemName: 'Production Done' },
    { id: 'Delivered', itemName: 'Delivered' },
    { id: 'Dispatched', itemName: 'Dispatched' }
  ];

  priority_dropdownList: any = [
    { id: 'yes', itemName: 'YES' },
    { id: 'no', itemName: 'NO' }
  ];

  om_dropdownSettings = {
    singleSelection: false,
    text: "Select OM",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  }

  priority_dropdownSettings = {
    singleSelection: true,
    text: "Select Priority",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    showCheckbox: false,
    classes: "myclass custom-class-dropdown",
  }


  factory_dropdownSettings = {
    singleSelection: false,
    text: "Select Factory",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  category_dropdownSettings = {
    singleSelection: false,
    text: "Select Category",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };
  status_dropdownSettings = {
    singleSelection: false,
    text: "Select Status",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  }
  ngOnInit() {
    this.per_page = 20;
    this.dateType = 'actual'
    this.setDate();
    this.getAllStores();
    this.getAllOM();
    this.productionDailyData()
  }
  firstDay: any;
  lastDay: any;
  setDate() {
    var date = new Date();
    this.firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.startDateValue = moment(this.firstDay).format('YYYY-MM-DD');
    this.endDateValue = moment(this.lastDay).format('YYYY-MM-DD');
    $('#startDate').val(this.startDateValue);
    $('#endDate').val(this.endDateValue);

  }
  modalHeading: any;
  modalTableHeading: any;
  addRemark: any = false;
  addFactory: any = false;
  addResponsibility: any = false;
  addDispatchDate: any = false;
  addDeliveryDate: any = false;

  remarksModalHandle(event: any) {
    if (event == 'factory') {
      this.modalHeading = 'Add Factory Name';
      this.modalTableHeading = 'Factory Name';
      this.addFactory = true;
      this.addDeliveryDate = false;
      this.addDispatchDate = false;
      this.addResponsibility = false;
      this.addRemark = false;
    } else if (event == 'responsiblity') {
      this.modalHeading = 'Add Responsibility';
      this.modalTableHeading = 'Responsibility';
      this.addFactory = false;
      this.addDeliveryDate = false;
      this.addDispatchDate = false;
      this.addResponsibility = true;
      this.addRemark = false;
    } else if (event == 'dispatchDate') {
      this.modalHeading = 'Add Actual Dispatch Date	';
      this.modalTableHeading = 'Actual Dispatch Date';
      this.addFactory = false;
      this.addDeliveryDate = false;
      this.addDispatchDate = true;
      this.addResponsibility = false;
      this.addRemark = false;
    } else if (event == 'deliveryDate') {
      this.modalHeading = 'Add Actual Delivery Date';
      this.modalTableHeading = 'Actual Delivery Date';
      this.addFactory = false;
      this.addDeliveryDate = true;
      this.addDispatchDate = false;
      this.addResponsibility = false;
      this.addRemark = false;
    } else if (event == 'remarks') {
      this.modalHeading = 'Add Remarks';
      this.modalTableHeading = 'Remarks';
      this.addFactory = false;
      this.addDeliveryDate = false;
      this.addDispatchDate = false;
      this.addResponsibility = false;
      this.addRemark = true;
    }

    ($('#remarksModal') as any).modal('show')
  }
  DailyData: any = []
  total_page: any
  productionDailyData(factory?: any, milestone?: any, status?: any, dateType?: any, selectedTask?: any, startDate?: any, endDate?: any, send_file?: any, searchInput?: any, store?: any, selectedOM?: any, priority?: any) {
    this.loader.display(true);
    if (factory == undefined) {
      factory = this.filterFactory;
    }
    if (milestone == undefined) {
      milestone = this.filtermilestone;
    }
    if (status == undefined) {
      status = this.filterStatus;
    }
    if (dateType == undefined) {
      dateType = this.dateType;
    }
    if (selectedTask == undefined) {
      selectedTask = this.selectedTask;
    }
    if (startDate == undefined) {
      startDate = this.startDateValue;
    }
    if (endDate == undefined) {
      endDate = this.endDateValue
    }
    if (send_file == undefined) {
      send_file = false;
    }
    if (searchInput == undefined) {
      searchInput = this.searchInput;
    }
    if (store == undefined) {
      store = this.selectedStore;

    }
    if (selectedOM == undefined) {
      selectedOM = this.selectedOMList;
      ;
    }
    if (priority == undefined) {
      priority = this.selectedPriority;
    }
    this.service.getProductionDailyData(factory, milestone, status, dateType, selectedTask, startDate, endDate, send_file, searchInput, store, selectedOM, priority).subscribe((res) => {
      this.loader.display(false);
      if (res.message) {
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(() => {
          this.successalert = false;
        }, 3000);
      }

      this.sendFile = false;
      this.DailyData = [];
      this.DailyData = res;
      console.log(this.DailyData)
      this.total_page = this.DailyData.length;
    }, (err) => {
      this.loader.display(false);
      this.erroralert = true;
      this.errorMessage = JSON.parse(err._body).error;
      setTimeout(() => {
        this.erroralert = false;
      }, 3000);
    })
    // this.loader.display(false);
  }
  current_page: any
  per_page: any = 10;
  pageChanged(event) {
    this.current_page = event;

  }

  showAddOption: any = false;
  addHandle() {
    this.showAddOption = true
  }
  onModalCloseHandle() {
    this.showAddOption = false;
    ($('#remarksModal') as any).modal('hide')
  }
  remarksListData: any = []
  getRemarkListHandle(id: any, milestone: any, factory: any, responsibility: any, deliveryDate: any) {
    this.quotationId = ''
    this.milestoneValue = ''
    this.factoryValue = ''
    this.remarksValue = ''
    this.responsiblityValue = ''
    this.deliveryDateValue = ''
    if (factory == null) {
      factory = '';
    }
    this.quotationId = id;
    this.milestoneValue = milestone;
    this.factoryValue = factory;
    this.responsiblityValue = responsibility;
    this.deliveryDateValue = deliveryDate;
    this.service.getRemarksListing(id, milestone).subscribe((res) => {
      this.remarksListData = []
      this.remarksListData = res.production_daily_dashboards;
    })

  }
  reamrksInput(event) {
    this.remarksValue = event;
  }
  quotationId: any;
  milestoneValue: any;
  factoryValue: any;
  remarksValue: any;
  responsiblityValue: any;
  deliveryDateValue: any
  addRemarksHandle() {
    this.service.addRemarks(this.quotationId, this.milestoneValue, this.remarksValue, this.responsiblityValue, this.deliveryDateValue).subscribe((res) => {

      this.onModalCloseHandle();
      this.productionDailyData();
    }, (err) => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(err._body).message;
      setTimeout(() => {
        this.erroralert = false;
      }, 3000);
    })
  }
  diableOption: any
  factoryDropdownValue(id: any, milestone: any, factoryName: any) {
    this.diableOption = true
    this.service.addFactory(id, milestone, factoryName).subscribe((res) => {

    })
    this.productionDailyData();
  }
  deliveryDateHandle(id: any, milestone: any, event: any) {
    this.service.addDeliveryDate(id, milestone, event).subscribe((res) => {
      this.productionDailyData();
    }, (err) => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(err._body).message;
      setTimeout(() => {
        this.erroralert = false;
      }, 3000);
    })
  }
  responsibilityHandle(id: any, milestone: any, event: any) {
    this.service.addResponsibility(id, milestone, event).subscribe((res) => {
      this.productionDailyData();
    }, (err) => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(err._body).message;
      setTimeout(() => {
        this.erroralert = false;
      }, 3000);
    })
  }
  dispatchDateHandle(id: any, milestone: any, event: any, remarks: any) {
    this.service.addDispatchDate(id, milestone, event, remarks).subscribe((res) => {
      this.productionDailyData();
    }, (err) => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(err._body).message;
      setTimeout(() => {
        this.erroralert = false;
      }, 3000);
    })
  }
  filtermilestone: any = ''
  filterbyCategory(event: any) {
    this.filtermilestone = [];
    for (let i = 0; i < this.selectedCategory.length; i++) {
      this.filtermilestone.push(this.selectedCategory[i].id);
    }

    this.productionDailyData(this.filterFactory, this.filtermilestone, this.filterStatus, this.dateType, this.selectedTask, this.startDateValue, this.endDateValue)
  }
  filterFactory: any = ''
  filterbyFactory(event: any) {
    this.filterFactory = [];
    for (let i = 0; i < this.selectedFactory.length; i++) {
      this.filterFactory.push(this.selectedFactory[i].id);
    }
    this.productionDailyData(this.filterFactory, this.filtermilestone, this.filterStatus, this.dateType, this.selectedTask, this.startDateValue, this.endDateValue)
  }
  filterStatus: any = []
  filterbyCurrentStatus(event: any) {
    this.filterStatus = [];
    for (let i = 0; i < this.selectedStatus.length; i++) {
      this.filterStatus.push(this.selectedStatus[i].id);
    }
    this.productionDailyData(this.filterFactory, this.filtermilestone, this.filterStatus, this.dateType, this.selectedTask, this.startDateValue, this.endDateValue)

  }
  selectFactory: any = ''
  resetButtonHandle() {
    this.startDateValue = moment(this.firstDay).format('YYYY-MM-DD');
    this.endDateValue = moment(this.lastDay).format('YYYY-MM-DD');
    $('#startDate').val(this.startDateValue);
    $('#endDate').val(this.endDateValue);
    this.selectedTask = 'sent_to_production_date';
    this.dateType = 'actual';
    $('#dateType_expected').removeAttr('checked');
    this.selectFactory = ''
    this.filtermilestone = '';
    this.filterFactory = '';
    this.filterStatus = '';
    this.sendFile = false;
    this.searchInput = '';
    this.selectedFactory = [];
    this.selectedCategory = [];
    this.selectedStatus = [];
    this.selectedOM = '';
    this.selectedPriority = '';
    this.selectedStore = '';
    this.selectedStoreDetail = [];
    this.selectedOmDetail = [];
    this.selectedPriorityDetail = [];
    this.productionDailyData();
  }
  idFac: any;
  milestoneFac: any;
  getFactoryListHandle(id: any, milestone: any) {
    this.idFac = id;
    this.milestoneFac = milestone;
    this.service.getFactoryListingData(id, milestone).subscribe((res) => {
      this.remarksListData = [];
      this.remarksListData = res.production_daily_dashboards;
    })
  }
  factoryDropdownModalValue(event: any) {
    this.factoryDropdownValue(this.idFac, this.milestoneFac, event);
    this.onModalCloseHandle();
  }

  idRes: any;
  milstoneRes: any;
  getResponsibilityListHandle(id: any, milestone: any, remark: any) {
    this.idRes = id;
    this.milstoneRes = milestone;
    this.service.getResponsibilityListingData(id, milestone).subscribe((res) => {
      this.remarksListData = [];
      this.remarksListData = res.production_daily_dashboards;
    })
  }
  responsibilityModalHandle(event: any) {
    this.responsibilityHandle(this.idRes, this.milstoneRes, event);
    this.onModalCloseHandle();
  }

  idDispatch: any;
  milstoneDispatch: any;
  remarksDispatch: any;
  getDispatchDateListHandle(id: any, milestone: any, remarks: any) {
    this.idDispatch = id;
    this.milstoneDispatch = milestone;
    this.remarksDispatch = remarks;
    this.service.getDispatchDateListingData(id, milestone).subscribe((res) => {
      this.remarksListData = [];
      this.remarksListData = res.production_daily_dashboards;
    })
  }
  dispatchDateModalHandle(event: any) {
    this.dispatchDateHandle(this.idDispatch, this.milstoneDispatch, event, this.remarksDispatch);
    this.onModalCloseHandle();

  }
  idDelivery: any;
  milestoneDelivery: any;

  getDeliveryDateListHandle(id: any, milestone: any) {
    this.idDelivery = id;
    this.milestoneDelivery = milestone;
    this.service.getDeliveryDateListingData(id, milestone).subscribe((res) => {
      this.remarksListData = [];
      this.remarksListData = res.production_daily_dashboards;
    })
  }
  deliveryDateModalHandle(event: any) {
    this.deliveryDateHandle(this.idDelivery, this.milestoneDelivery, event);
    this.onModalCloseHandle();

  }
  dateType: any
  changeDateType(event) {
    this.dateType = event;
  }
  selectedTask: any = 'sent_to_production_date';
  dateDropDownChanged(event: any) {
    this.selectedTask = event;
  }
  startDateValue: any;
  startDate(event) {
    this.startDateValue = event

  }
  endDateValue: any;
  endDate(event) {
    this.endDateValue = event;
  }
  onSubmitGO() {
    this.productionDailyData();
  }
  sendFile: any = false
  exportHandle() {
    this.sendFile = true;
    this.productionDailyData(this.filterFactory, this.filtermilestone, this.filterStatus, this.dateType, this.selectedTask, this.startDateValue, this.endDateValue, this.sendFile)

  }
  OnItemDeSelect(event: any) {

    this.filterFactory.splice(this.filterFactory.indexOf(event.id), 1);


    this.productionDailyData();
  }
  OnCategoryItemDeSelect(event: any) {
    this.filtermilestone.splice(this.filtermilestone.indexOf(event.id), 1);
    this.productionDailyData();
  }
  OnStatusItemDeSelect(event: any) {
    this.filterStatus.splice(this.filterStatus.indexOf(event.id), 1);

    this.productionDailyData();
  }
  onSelectAll(item) {

  }
  onDeSelectAll(item) {

  }
  searchInput: any = ''
  onSearchInput() {
    this.productionDailyData(this.filterFactory, this.filtermilestone, this.filterStatus, this.dateType, this.selectedTask, this.startDateValue, this.endDateValue, this.sendFile, this.searchInput)
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

  selectedStoreDetail: any = [];
  selectedStore: any = ''
  filterbystore(event: any) {
    this.selectedStore = [];
    for (let i = 0; i < this.selectedStoreDetail.length; i++) {
      this.selectedStore.push(this.selectedStoreDetail[i].id);
    }
    this.productionDailyData();
    console.log(this.selectedStore);
    
  }

  OnItemDeSelect2(type: any, event?: any) {
    switch (type) {
      case 'Store':
        this.selectedStore.splice(this.selectedStore.indexOf(event.id), 1);
        this.productionDailyData();

        break;
      case 'OM':
        this.selectedOMList.splice(this.selectedOMList.indexOf(event.id), 1);

        this.productionDailyData();
        break;

      case 'Priority':
        this.selectedPriority = '';
        this.productionDailyData();
        break;
    }
  }

  om_dropdownList: any = [];
  getAllOM() {
    this.service.getOm().subscribe((res) => {
      this.om_dropdownList = [];
      this.om_dropdownList = res.data;
    })
  }

  selectedOM: any = ''
  selectedOMList: any = [];
  filterbyOM(event: any) {
    this.selectedOMList = [];
    for (let i = 0; i < this.selectedOmDetail.length; i++) {
      this.selectedOMList.push(this.selectedOmDetail[i].id);
    }
    this.productionDailyData();
  }

  selectedPriority: any = '';
  filterbyPriority(event: any) {
    this.selectedPriority = event.id;
    this.productionDailyData();
  }
}
