import { Component, OnInit } from '@angular/core';
import { GeneralManagerService } from 'app/platform/general-manager/general-manager.service';
import { ProjectService } from 'app/platform/project/project/project.service';
import { LoaderService } from 'app/services/loader.service';
import { Chart } from "chart.js";
import { environment } from 'environments/environment';
declare var $: any;

@Component({
  selector: "app-designer-dashboard-2",
  templateUrl: "./designer-dashboard-2.component.html",
  styleUrls: ["./designer-dashboard-2.component.css"],
  providers: [ProjectService],
})
export class DesignerDashboard2Component implements OnInit {
  constructor(
    private generalManagerService: GeneralManagerService,
    private _projectService: ProjectService,
    private loaderService: LoaderService
  ) {}
  baseUrl = environment.uihrefUrl;
  lead_target: any = "";
  meeting_boq_target: any = "";
  start_date: any = "";
  closure_boq_target: any = "";
  boq_shared_value: any = "";
  gm: any = "";
  cm: any = "";
  designer_data: any = "";
  store: any = "";
  wheel1cm_week_data: any;
  wheel1_firstmeet_data: any;
  wheel1cm_month_data: any;
  wheel1_firstmeet_month_data: any;
  wheel_sharedVol70: any;
  wheel_sharedval: any;
  wheel_sharedVol70_monthData: any;
  wheel_sharedval_monthData: any;
  first_meeting_target: any;
  average_bill_size: any;
  boq_to_closure_target: any;
  lead_to_closure_value: any;
  meeting_to_boq_target: any;
  filter_data: any;
  errorMessage: string;
  successMessage: string;
  msgError: boolean = false;
  successError: boolean = false;
  month_data: any = [];
  month_data2: any = [];
  no_of_month: any;
  no_of_month2: any;
  show_order_book_value_boq: boolean = false;
  public options = {
    hasNeedle: true,
    needleColor: "black",
    needleUpdateSpeed: 1000,
    arcColors: ["#FFEAEF", "#8d0528"],
    arcDelimiters: [25],
    rangeLabel: ["0", "100"],
    needleStartValue: 50,
  };
  public options1 = {
    hasNeedle: true,
    needleColor: "black",
    needleUpdateSpeed: 1000,
    arcColors: ["#FFEAEF", "#8d0528"],
    arcDelimiters: [5],
    rangeLabel: ["0", "100"],
    needleStartValue: 50,
  };
  public canvasWidth2 = 300;
  public centralLabel = "";
  public needleValue: any;
  role: any;
  submitting: boolean = false;
  designer_countdata: any;
  wheel3_part1Data: any = [];
  wheel3_part1Data2: any = [];
  wheel3_part2Data: any = [];
  wheel3_part2Data2: any = [];
  wheel3_part2weekData: any = [];
  wheel3_part2weekData2: any = [];
  show_weekvise: boolean = false;
  show_weekvise2: boolean = false;
  public barChartDatanew: any[];
  public barChartLabels3;
  public doughChartOptionsnew: any = {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        fontSize: 8,
      },
    },
  };
  public barChartType4 = "bar";
  public barChartLegend2 = true;
  barChartColorsnew: any[] = [
    {
      backgroundColor: "#99ff66",
    },
    {
      backgroundColor: "#6699ff",
    },
    {
      backgroundColor: "#ffff66",
    },
    {
      backgroundColor: "#ff9933",
    },
  ];

  public barChartDatanew1: any[];
  public barChartLabels31;
  public doughChartOptionsnew1: any = {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        fontSize: 8,
      },
    },
  };
  public barChartType41 = "bar";
  public barChartLegend21 = true;
  barChartColorsnew1: any[] = [
    {
      backgroundColor: "#99ff66",
    },
    {
      backgroundColor: "#6699ff",
    },
    {
      backgroundColor: "#ffff66",
    },
    {
      backgroundColor: "#ff9933",
    },
  ];
  site_validation_info: any = [];
  wheel3_part4Data: any = [];
  page: any = 1;
  lead_details: any;
  listing_type: any = "";
  week_number: any;
  current_user: any;
  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.current_user = localStorage.getItem("userId");
    this.funnelThreewheelone = false
    this.getallusers();
    this.getWheelData();
    if(this.role != 'area_sales_manager'){
      this.getAllStores();
    } 
   
    this.getDesignerCount();
    this.getwheeltwodata();
    this.getWheelonefunnellthree()
    this.getwheelthreepartone();
    this.getwheelthreeparttwo();
    this.getWheelthreepartthree();
    // this.getwheelthreepartfour(1);
    this.getwheelthreepartone2();
    this.getwheelthreeparttwo2();
    this.getWheelsevendata();
    this.getWheelOneSecondData()
    this.getwheelthreeTabelTwo()
  }

  async getDesignerCount() {
    if (this.gm == undefined) {
      this.gm = "";
    }
    if (this.cm == undefined) {
      this.cm = "";
    }
    if (this.designer_data == undefined) {
      this.designer_data = "";
    }
    // this.loaderService.display(true);dwd
    return (
      await this._projectService.getDesignerCount(
        this.store,
        this.gm,
        this.cm,
        this.designer_data
      )
    ).subscribe((res) => {
      this.designer_countdata = res;
    });
  }

  wheel1avg_time :any
  async getWheelData() {
    if (this.gm == undefined) {
      this.gm = "";
    }
    if (this.cm == undefined) {
      this.cm = "";
    }
    if (this.designer_data == undefined) {
      this.designer_data = "";
    }
    this.start_date = this.start_date ? this.start_date:"";

    // this.loaderService.display(true);
    return (
      await this._projectService.getwheelonedata(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe(
      (res) => {
        // this.loaderService.display(false);
        this.wheel1avg_time = res
        this.wheel1cm_week_data = res.cms_assigned_leads_weekly;
        this.wheel1_firstmeet_data = res.first_meeting_leads_weekly;
        this.wheel1cm_month_data = res.cms_assigned_leads_monthly[0];
        this.wheel1_firstmeet_month_data = res.first_meeting_leads_monthly[0];
        this.wheel_sharedVol70 = res.shared_boq_weekly;
        this.wheel_sharedval = res.first_shared_value_boq_weekly;
        this.wheel_sharedVol70_monthData = res.shared_boq_monthly[0];
        this.wheel_sharedval_monthData = res.first_shared_value_boq_monthly[0];
        this.needleValue = this.wheel_sharedval_monthData.avg_achived_time;
        this.filter_data = res.filter_data;
        this.setTopValue();
        this.Loaderwheelone = false
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  wheel_one_second_tabel: boolean = false;
  wheel_threefirst_tabel : boolean = false
  wheel_threesecond_tabel : boolean = false
  pm_ten_first_call :any
  pm_ten_first_call_monthly :any
  

  pm_ten_first_meeting :any
  pm_ten_first_meeting_monthly :any

  pm_ten_design_boq_presentation :any
  pm_ten_design_boq_presentation_monthly :any

  pm_ten_followup_call :any
  pm_ten_followup_call_monthly :any


  pm_ten_followup_meeting :any
  pm_ten_followup_meeting_monthly :any

  pm_ten_store_vist :any
  pm_ten_store_vist_monthly :any


  pm_ten_order_booking :any
  pm_ten_order_booking_monthly :any

  pm_ten_material_selection :any
  pm_ten_material_selection_monthly :any

  pm_ten_site_validation_meeting :any
  pm_ten_site_validation_meeting_monthly :any
  pm_designer_iteration_meeting :any
  pm_designer_iteration_meeting_monthly :any

  pm_ten_conformation_meeting :any
  pm_ten_conformation_meeting_monthly :any

  async getWheelOneSecondData(){
    this.wheel_one_second_tabel = true
    if (this.gm == undefined) {
      this.gm = "";
    }
    if (this.cm == undefined) {
      this.cm = "";
    }
    if (this.designer_data == undefined) {
      this.designer_data = "";
    }
    this.start_date = this.start_date ? this.start_date:"";

    this.loaderService.display(true);
    return (
      await this._projectService.wheeloneSecond(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe(
      (res) => {
       this.wheel_one_second_tabel = false
        this.loaderService.display(false);
        this.pm_ten_first_call = res.first_call_data_weekly
        this.pm_ten_first_call_monthly = res.first_call_data_monthly



        this.pm_ten_first_meeting = res.first_meeting_data_weekly
        this.pm_ten_first_meeting_monthly = res.first_meeting_data_monthly

        this.pm_ten_design_boq_presentation = res.design_and_BOQ_presentation_data_weekly
        this.pm_ten_design_boq_presentation_monthly = res.design_and_BOQ_presentation_data_monthly


        this.pm_ten_followup_call = res.followup_call_data_weekly
        this.pm_ten_followup_call_monthly = res.followup_call_data_monthly


        this.pm_ten_followup_meeting = res.followup_meeting_data_weekly
        this.pm_ten_followup_meeting_monthly = res.followup_meeting_data_monthly


        this.pm_ten_store_vist = res.store_visit_data_weekly
        this.pm_ten_store_vist_monthly = res.store_visit_data_monthly
        
        this.pm_ten_order_booking = res.order_booking_data_weekly
        this.pm_ten_order_booking_monthly = res.order_booking_data_monthly


        this.pm_ten_material_selection = res.material_selection_data_weekly
        this.pm_ten_material_selection_monthly = res.material_selection_data_monthly

        this.pm_ten_site_validation_meeting = res.site_validation_meeting_data_weekly
        this.pm_ten_site_validation_meeting_monthly = res.site_validation_meeting_data_monthly
        this.pm_designer_iteration_meeting = res.design_iteration_data_weekly
        this.pm_designer_iteration_meeting_monthly = res.design_iteration_data_monthly

        this.pm_ten_conformation_meeting = res.confirmation_meeting_data_weekly
        this.pm_ten_conformation_meeting_monthly = res.confirmation_meeting_data_monthly 
      },
      (err) => {
        this.loaderService.display(false);
        this.wheel_one_second_tabel = false
      }
    );
  }
  Loadergetter(){
    if(this.pm_ten_first_meeting){
      return false
    } else{
     return true
    }
  }


  headingkeys(e){
    if(e){      
      return Object.keys(e)
     }
  }

  headingkeyswheel3(e){
    if(e){      
      return Object.keys(e)
     }
  }

  funnelThreewheelone :any = null
  Loaderwheelone:any = true
  async getWheelonefunnellthree(){
    // this.loaderService.display(true)
    this.start_date = this.start_date ? this.start_date:"";

    console.log(this.funnelThreewheelone)
   
    return(
      await this._projectService.getWhellonethirdFunnel(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      ).subscribe(
        (res:any) => {
          this.loaderService.display(false);
          this.funnelThreewheelone = res ;
          console.log(this.funnelThreewheelone)
        },(err) => {
          this.loaderService.display(false)
        }
      )
    )
  }

  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }

  wheel_two_weekly_data: any = [];
  wheel_two_monthly_data: any
  loaderwheel2:any = true
  avg_time :any
  needleValue2: any;
  async getwheeltwodata() {
    this.start_date = this.start_date ? this.start_date:"";

    // this.loaderService.display(true);
    return (
      await this._projectService.getWheeltwodata(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe(
      (res: any) => {
        this.avg_time = res
        this.wheel_two_weekly_data = res.wheel_two_weekly_data;
        this.wheel_two_monthly_data = res.awheel_two_monthly_data[0];
        if(this.wheel_two_monthly_data.achived==0){
          this.needleValue2=1;
        }else{
        this.needleValue2 = this.wheel_two_monthly_data.achived;
        }
        this.loaderService.display(false);
        this.loaderwheel2 = false
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  setTopValue() {
    this.lead_target = this.filter_data.lead_target;
    this.average_bill_size = this.filter_data.average_bill_size;
    this.first_meeting_target = this.filter_data.first_meeting_target;
    this.meeting_to_boq_target = this.filter_data.meeting_to_boq_target;
    this.boq_to_closure_target = this.filter_data.boq_to_closure_target;
    this.lead_to_closure_value = this.filter_data.lead_to_closure_value;
  }
 
  general_manager: any = [];
  community_manager: any = [];
  designer: any = [];
  gmSel: any = "";
  cmSel: any = "";
  Stores: any = "";
  salesManagers =[]
  async getallusers() {
    return (
      await this.generalManagerService.getAllusers2(
        this.gm,
        this.cm
      )
    ).subscribe(
      (res) => {
        this.general_manager = res.gms;
        this.community_manager = res.cms;
        this.designer = res.designers;
        this.salesManagers = res.sales_managers?res.sales_managers:[]
      },
      (err) => {
        this.general_manager = [];
        this.community_manager = [];
        this.designer = [];
        this.salesManagers = []
      }
    );
  }
  headingkeyswheel4(e){
    if(e){      
      return Object.keys(e)
     }
  }

  onItemSelect(event: any) {
    this.gm = event;
    this.getallusers();
    this.getDesignerCount();
    this.getWheelData();
    this.getwheeltwodata();
    this.getWheelonefunnellthree()
    this.getwheelthreepartone();
    this.getwheelthreeparttwo();
    this.getwheelthreepartone2();
    this.getwheelthreeparttwo2();
    this.getwheelthreeTabelTwo()
    this.getWheelsevendata();
    this.getWheelOneSecondData()
  }

  onItemSelect2(event: any) {
    this.cm = event;
    this.getWheelData();
    this.getDesignerCount();
    this.getallusers();
    this.getwheeltwodata();
    this.getWheelonefunnellthree()
    this.getwheelthreepartone();
    this.getwheelthreeparttwo();
    this.getwheelthreeTabelTwo()
    this.getwheelthreepartone2();
    this.getwheelthreeparttwo2();
    this.getWheelsevendata();
    this.getWheelOneSecondData()
  }

  onItemSelect3(event: any) {
    this.designer_data = event;
    this.getallusers();
    this.getDesignerCount();
    this.getWheelData();
    this.getwheeltwodata();
    this.getWheelonefunnellthree()
    this.getwheelthreepartone();
    this.getwheelthreeparttwo();
    this.getwheelthreepartone2();
    this.getwheelthreeparttwo2();
    this.getWheelsevendata();
    this.getWheelOneSecondData()
    this.getwheelthreeTabelTwo()
  }

  onItemSelect4(event) {
    this.store = event;
    this.getDesignerCount();
    this.getallusers();
    this.getWheelData();
    this.getwheeltwodata();
    this.getWheelonefunnellthree()
    this.getwheelthreepartone();
    this.getwheelthreeparttwo();
    this.getwheelthreepartone2();
    this.getwheelthreeTabelTwo()
    this.getwheelthreeparttwo2();
    this.getWheelsevendata();
    this.getWheelOneSecondData()
  }
  
  Store_dropdownList: any;
  async getAllStores() {
    return (await this.generalManagerService.getAllStoresByrole()).subscribe(
      (res) => {
        this.Store_dropdownList = res;
      },
      (err) => {
        this.Store_dropdownList = [];
      }
    );
  }

  onItemaDate() {
    this.getWheelData();
    this.getwheeltwodata();
    this.getWheelonefunnellthree()
    this.getwheelthreepartone();
    this.getwheelthreeparttwo();
    this.getwheelthreepartone2();
    this.getwheelthreeparttwo2();
    this.getwheelthreeTabelTwo()
    this.getWheelsevendata();
    this.getWheelOneSecondData()
  }

  async cmTargetFilling() {
    if (this.cm && this.gm && this.role === "business_head") {
      this.cm = this.cm;
    } else if (this.cm) {
      this.cm = this.cm;
    } else {
      this.cm = this.gm;
    }
    if (this.cm === "" && this.role === "city_gm") {
      this.cm = this.current_user;
    }
    return this._projectService
      .getcmTargetFillData(
        this.lead_target,
        this.average_bill_size,
        this.first_meeting_target,
        this.meeting_to_boq_target,
        this.boq_to_closure_target,
        this.cm
      )
      .subscribe(
        (res) => {
          // this.loaderService.display(false);
          this.successError = true;
          this.successMessage = res.message;
          this.getWheelData();
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        },
        (err) => {
          // this.loaderService.display(false)dwdw;
          this.msgError = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            5000
          );
        }
      );
  }


  wheel3_part1AdditionalData : any
  add_wheel3_weekly_target_pm_40_value :any
  add_wheel3_weekly_actual_pm_40_value :any
  wheelpart3_old_leads: any;
  wheel3_monthly_expectedData :any



  /// weekly data  for wheel three tabel one( PM 40 MTD )
  wheel3_part1Data_sitemeasurement : any
  wheel3_part1Data_material_finalisation_meeting_data :any
  wheel3_part1Data_site_validation_request_data :any
  wheel3_part1Data_final_boq_category_handover_data:any
  wheel3_part1Data_final_boq_category_approved_data:any
  wheel3_part1Data_final_boq_shared_data :any
  wheel3_part1Data_final_boq_approved_data:any
  wheel3_part1Data_forty_percent_payment_mapped_data:any
  wheel3_part1Data_designer_iteration_data:any

  wheel3_part1Data_onHold : any

  async getwheelthreepartone() {
   this.wheel_threefirst_tabel  = true
    // this.wheel_threesecond_tabel  = false
    this.loaderService.display(true)
    this.start_date = this.start_date ? this.start_date:"";
    return (
      await this._projectService.getWheelthreepartonedata(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe((res) => {
      this.wheelpart3_old_leads = res.old_leads  // overDue colomn
      this.loaderService.display(false)
      this.wheel_threefirst_tabel  = false
      // weekly data
      this.wheel3_part1Data_sitemeasurement = res.wheel_3_weekly_expected_data[0].data  // weekly data  initial site mearurement data

      this.wheel3_part1Data_onHold = res.on_hold_leads

      this.wheel3_part1Data_site_validation_request_data = res.wheel_3_weekly_expected_data[3].data 
      this.wheel3_part1Data_designer_iteration_data = res.wheel_3_weekly_expected_data[1].data  //   site validation pending
      this.wheel3_part1Data_material_finalisation_meeting_data = res.wheel_3_weekly_expected_data[2].data  // matetial selection pending
      this.wheel3_part1Data_final_boq_category_handover_data = res.wheel_3_weekly_expected_data[4].data  // QC pending
      this.wheel3_part1Data_final_boq_category_approved_data = res.wheel_3_weekly_expected_data[5].data  // QC Approval pending
      this.wheel3_part1Data_final_boq_shared_data = res.wheel_3_weekly_expected_data[6].data  // BOQ Shared pending
      this.wheel3_part1Data_final_boq_approved_data = res.wheel_3_weekly_expected_data[7].data  // BOQ Approval pending
      this.wheel3_part1Data_forty_percent_payment_mapped_data = res.wheel_3_weekly_expected_data[8].data 
       // 40% payment pending


      this.wheel3_part1AdditionalData = res.wheel_3_monthly_expected_data //  monthly data right hand side last column
      this.wheel3_monthly_expectedData = res.total_weeks_data  // total weeks data at last row
    },(err)=> {
      this.wheel_threefirst_tabel  = false
    });
  }

  wheelthreeTabelTwo_OverDueLeads :any
  wheelthreeTabelTwo_TotalMonthlyData :any
  wheelthreeTabelTwo_TotalWeeks:any
  wheelthreeTabelTwo_WeeklyExpectedData :any


  // wheel three tabel two (Future pm 40)

    /// weekly data  for wheel three tabel one( PM 40 MTD )
    wheel3_part2Data_sitemeasurement : any
    wheel3_part2Data_designer_iteration:any;
    wheel3_part2Data_material_finalisation_meeting_data :any
    wheel3_part2Data_site_validation_request_data :any
    wheel3_part2Data_final_boq_category_handover_data:any
    wheel3_part2Data_final_boq_category_approved_data:any
    wheel3_part2Data_final_boq_shared_data :any
    wheel3_part2Data_final_boq_approved_data:any
    wheel3_part2Data_forty_percent_payment_mapped_data:any



  async getwheelthreeTabelTwo() {
    this.wheel_threesecond_tabel = true
    this.loaderService.display(true)
    this.start_date = this.start_date ? this.start_date:"";
    return (
      await this._projectService.getWheelthreetabeltwo(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.no_of_month_wheel3_tabel_two
      )
    ).subscribe((res) => {
      this.wheel_threesecond_tabel = false
      this.loaderService.display(false)
      this.wheelthreeTabelTwo_OverDueLeads = res.old_leads // overdue leads
      this.wheelthreeTabelTwo_TotalMonthlyData = res.wheel_3_monthly_expected_data  // monthly data


      this.wheelthreeTabelTwo_TotalWeeks = res.total_weeks_data
      // this.wheelthreeTabelTwo_WeeklyExpectedData = res.wheel_3_weekly_expected_data

      this.wheel3_part2Data_sitemeasurement = res.wheel_3_weekly_expected_data[0].data
      this.wheel3_part2Data_designer_iteration = res.wheel_3_weekly_expected_data[1].data  // weekly data  initial site mearurement data
      this.wheel3_part2Data_site_validation_request_data = res.wheel_3_weekly_expected_data[3].data  //   site validation pending
      this.wheel3_part2Data_material_finalisation_meeting_data = res.wheel_3_weekly_expected_data[2].data  // matetial selection pending
      this.wheel3_part2Data_final_boq_category_handover_data = res.wheel_3_weekly_expected_data[4].data  // QC pending
      this.wheel3_part2Data_final_boq_category_approved_data = res.wheel_3_weekly_expected_data[5].data  // QC Approval pending
      this.wheel3_part2Data_final_boq_shared_data = res.wheel_3_weekly_expected_data[6].data  // BOQ Shared pending
      this.wheel3_part2Data_final_boq_approved_data = res.wheel_3_weekly_expected_data[7].data  // BOQ Approval pending
      this.wheel3_part2Data_forty_percent_payment_mapped_data = res.wheel_3_weekly_expected_data[8].data  // 40% payment pending



    },(err)=> {
      this.wheel_threesecond_tabel = false
    });
  }

  async getwheelthreeparttwo() {
    this.start_date = this.start_date ? this.start_date:"";

    return (
      await this._projectService.getWheelthreeparttwodata(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe((res) => {
      this.month_data = [];
      this.wheel3_part2Data = res.wheel_3_pm_future_40_mtd_data;
      this.wheel3_part2Data.map((value: any, index: any) => {
        this.month_data.push({ value: value.month_name, index: index + 1 });
      });
    });
  }

  changeMonth(event) {
    this.no_of_month = event;
    this.getwheelthreeparttwoweek();
  }
  no_of_month_wheel3_tabel_two : any = ''
  changeMonthWheelThree(event){
    this.no_of_month_wheel3_tabel_two = event;
    this.getwheelthreeTabelTwo()

  }
  changeMonth1(event) {
    this.no_of_month2 = event;
    this.getwheelthreeparttwoweek2();
  }

  wheelthreeparttwoAdditionalData :any
  add_wheel3_part_two:any
  async getwheelthreeparttwoweek() {
    this.start_date = this.start_date ? this.start_date:"";

    this.show_weekvise = true;
    return (
      await this._projectService.getWheelthreeparttwoweekdata(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.no_of_month
      )
    ).subscribe((res) => {
      this.wheel3_part2weekData = res.wheel_3_pm_40_mtd_data;
      this.wheelthreeparttwoAdditionalData = res.wheel_3_monthly_data
      var total = 0 
      for(var i =0  ; i<this.wheel3_part2weekData.length ; i++){
        console.log(this.wheel3_part2weekData[i].weekly_target_pm_40_value);
       this.add_wheel3_part_two =  total += this.wheel3_part2weekData[i].weekly_target_pm_40_value
      }
    });
  }

  async getWheelthreepartthree() {
    this.start_date = this.start_date ? this.start_date:"";

    return (
      await this._projectService.getWheelthreepartthreedata(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe((res: any) => {
      this.site_validation_info = res.wheel_3_part_3_chart_data;
      this.barChartDatanew = [
        {
          data: [
            this.site_validation_info[0].on_track_data,
            this.site_validation_info[1].on_track_data,
            this.site_validation_info[2].on_track_data,
            this.site_validation_info[3].on_track_data,
            this.site_validation_info[4].on_track_data,
          ],
          label: "On Track",
          stack: "a",
          backgroundColor: "red",
        },
        {
          data: [
            this.site_validation_info[0].delayed_1_to_5_data,
            this.site_validation_info[1].delayed_1_to_5_data,
            this.site_validation_info[2].delayed_1_to_5_data,
            this.site_validation_info[3].delayed_1_to_5_data,
            this.site_validation_info[4].delayed_1_to_5_data,
          ],
          label: "Delayed (1-5)",
          stack: "a",
          backgroundColor: "red",
        },
        {
          data: [
            this.site_validation_info[0].delayed_5_to_10_data,
            this.site_validation_info[1].delayed_5_to_10_data,
            this.site_validation_info[2].delayed_5_to_10_data,
            this.site_validation_info[3].delayed_5_to_10_data,
            this.site_validation_info[4].delayed_5_to_10_data,
          ],
          label: "Delayed (5-10)",
          stack: "a",
          backgroundColor: "red",
        },
        {
          data: [
            this.site_validation_info[0].delayed_more_than_10_data,
            this.site_validation_info[1].delayed_more_than_10_data,
            this.site_validation_info[2].delayed_more_than_10_data,
            this.site_validation_info[3].delayed_more_than_10_data,
            this.site_validation_info[4].delayed_more_than_10_data,
          ],
          label: "Delayed (>10)",
          stack: "a",
          backgroundColor: "red",
        },
      ];
      this.barChartLabels3 = [
        "St. Measure.",
        "Mt. Sel.",
        "St. Valid.",
        "QC Date",
        "QC App.",
      ];
      Chart.plugins.register({
        beforeDraw: function (chart) {
          if (chart.canvas.id == "thirdChart") {
            var data = chart.data.datasets[0].data;
            var sum = data.reduce(function (a, b) {
              return a + b;
            }, 0);
            var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
            ctx.restore();
            var fontSize = (height / 13).toFixed(2);
            ctx.font = fontSize + "px Arial";
            ctx.textBaseline = "top";
            var text = sum,
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        },
      });
    });
  }

  total_page3;
  current_page3;
  per_page3;
  headers_res;
  send_file_part3: any = "";
  loading: boolean = false;
  async getwheelthreepartfour(pageno: any) {
    this.start_date = this.start_date ? this.start_date:"";

    // this.show_weekvise = true;
    this.loading = true;
    return (
      await this._projectService.getWheelthreepartfourdata(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        pageno,
        this.send_file_part3
      )
    ).subscribe(
      (res) => {
        if (this.send_file_part3 == "true") {
          this.successError = true;
          this.successMessage =
            "Export Will be shared with you on email shortly";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        } else {
          this.headers_res = res.headers._headers;
          this.total_page3 = this.headers_res.get("x-total");
          this.current_page3 = pageno;
          this.per_page3 = 15;
          res = res.json();
          this.wheel3_part4Data = res.wheel_3_part_4_chart_data;
        }
        this.loading = false;
      },
      (err) => {
        this.msgError = true;
        this.errorMessage = "OOPS!! Something went Wrong";
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          6000
        );
        this.loading = false;
      }
    );
  }

  getColor(value) {
    if (value == "null" || value <= 70) {
      return "background1";
    } else if (value <= 99) {
      return "background2";
    } else {
      return "background3";
    }
  }

  getColor_shortfall(value){
    if (value < 0  || value == 0) {
      return "background1";
    } else {
      return "background3";
    }
  }

  exportorderpipeline(value) {
    this.send_file_part3 = value;
    this.getwheelthreepartfour(1);
  }

  wheel3_part1Data2AdditionalData :any
  wheel4_HandoverMTD :any
  newValue :any
  async getwheelthreepartone2() {
    this.start_date = this.start_date ? this.start_date:"";

    return (
      await this._projectService.getWheelthreepartonedata2(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe((res) => {
      this.wheel4_HandoverMTD = res.old_leads
      this.wheel3_part1Data2 = res.wheel_3_pm_40_mtd_data;
      this.wheel3_part1Data2AdditionalData = res.wheel_3_monthly_data
      let total = 0
      for(var i =0  ; i<this.wheel3_part1Data2.length ; i++){
        console.log(this.wheel3_part1Data2[i].weekly_target_pm_40_value);
       this.add_wheel3_part_two =  total += this.wheel3_part1Data2[i].weekly_target_pm_40_value
       this.newValue =  total+= this.wheel3_part1Data2[i].weekly_actual_pm_40_value
      }
    });
  }

  async getwheelthreeparttwo2() {
    this.start_date = this.start_date ? this.start_date:"";

    return (
      await this._projectService.getWheelthreeparttwodata2(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe((res) => {
      this.month_data2 = [];
      this.wheel3_part2Data2 = res.wheel_3_pm_future_40_mtd_data;
      this.wheel3_part2Data2.map((value: any, index: any) => {
        this.month_data2.push({ value: value.month_name, index: index + 1 });
      });
    });
  }

  monthDataWheel3 :any
  async getwheelthreeparttwoweek2() {
    this.start_date = this.start_date ? this.start_date:"";

    this.show_weekvise2 = true;
    return (
      await this._projectService.getWheelthreeparttwoweekdata2(
        this.lead_target,
        this.meeting_boq_target,
        this.start_date,
        this.closure_boq_target,
        this.boq_shared_value,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.no_of_month2
      )
    ).subscribe((res) => {
      
      this.wheel3_part2weekData2 = res.wheel_3_pm_40_mtd_data;
      this.monthDataWheel3 = res.wheel_3_monthly_data
      let total = 0
      for(var i =0  ; i<this.wheel3_part2weekData2.length ; i++){
        console.log(this.wheel3_part2weekData2[i].weekly_target_pm_40_value);
       this.add_wheel3_part_two =  total += this.wheel3_part2weekData2[i].weekly_target_pm_40_value
      }

    });
  }

  wheel3_part7: any = [];
  site_validation_info1: any = [];
  async getWheelsevendata() {
    this.start_date = this.start_date ? this.start_date:"";

    return (
      await this._projectService.getWheelthreepartseven(
        this.lead_target,
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store
      )
    ).subscribe((res) => {
      this.site_validation_info1 = res.wheel_3_part_3_chart_data;
      this.barChartDatanew1 = [
        {
          data: [
            this.site_validation_info1[0].on_track_data,
            this.site_validation_info1[1].on_track_data,
            this.site_validation_info1[2].on_track_data,
            this.site_validation_info1[3].on_track_data,
            this.site_validation_info1[4].on_track_data,
            this.site_validation_info1[5].on_track_data,
            this.site_validation_info1[6].on_track_data,
          ],
          label: "On Track",
          stack: "a",
          backgroundColor: "red",
        },
        {
          data: [
            this.site_validation_info1[0].delayed_1_to_5_data,
            this.site_validation_info1[1].delayed_1_to_5_data,
            this.site_validation_info1[2].delayed_1_to_5_data,
            this.site_validation_info1[3].delayed_1_to_5_data,
            this.site_validation_info1[4].delayed_1_to_5_data,
            this.site_validation_info1[5].delayed_1_to_5_data,
            this.site_validation_info1[6].delayed_1_to_5_data,
          ],
          label: "Delayed (1-5)",
          stack: "a",
          backgroundColor: "red",
        },
        {
          data: [
            this.site_validation_info1[0].delayed_5_to_10_data,
            this.site_validation_info1[1].delayed_5_to_10_data,
            this.site_validation_info1[2].delayed_5_to_10_data,
            this.site_validation_info1[3].delayed_5_to_10_data,
            this.site_validation_info1[4].delayed_5_to_10_data,
            this.site_validation_info1[5].delayed_5_to_10_data,
            this.site_validation_info1[6].delayed_5_to_10_data,
          ],
          label: "Delayed (5-10)",
          stack: "a",
          backgroundColor: "red",
        },
        {
          data: [
            this.site_validation_info1[0].delayed_more_than_10_data,
            this.site_validation_info1[1].delayed_more_than_10_data,
            this.site_validation_info1[2].delayed_more_than_10_data,
            this.site_validation_info1[3].delayed_more_than_10_data,
            this.site_validation_info1[4].delayed_more_than_10_data,
            this.site_validation_info1[5].delayed_more_than_10_data,
            this.site_validation_info1[6].delayed_more_than_10_data,
          ],
          label: "Delayed (>10)",
          stack: "a",
          backgroundColor: "red",
        },
      ];
      this.barChartLabels31 = [
        "Ser. Start",
        "Ser. 50%",
        "St. Readi.",
        "Handover",
        "Raw Mat. Rec.",
        "Fur. Prod. Start",
        "Fur. Dispatch",
      ];
      Chart.plugins.register({
        beforeDraw: function (chart) {
          if (chart.canvas.id == "thirdChart") {
            var data = chart.data.datasets[0].data;
            var sum = data.reduce(function (a, b) {
              return a + b;
            }, 0);
            var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
            ctx.restore();
            var fontSize = (height / 13).toFixed(2);
            ctx.font = fontSize + "px Arial";
            ctx.textBaseline = "top";
            var text = sum,
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        },
      });
    });
  }

  heading: any;
  total_page2: any;
  current_page2: any = 1;
  openModal(data, data1, week_number) {
  
    this.show_order_book_value_boq = true;
    this.week_number = week_number;
    this.heading = data1;
    this.loaderService.display(true)
   
    if(data =='api'){
      this._projectService.getwheelonedatapopup(this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        week_number).subscribe(res=>{
          console.log(res)
          this.loaderService.display(false)
          this.lead_details = res.quotations;
      this.total_page2 = res.quotations.length;
        },err=>{
          this.loaderService.display(false)
        })
    } else{
      this.lead_details = data.quotations;
      this.total_page2 = data.quotations.length;
    }

    


    $("#LeadModal").modal("show");
  }

  close() {
    this.show_pm = "";
    this.show_wheel2 = "";
    $("#LeadModal").modal("hide");
  }

  pageChanged(event) {
    this.current_page2 = event;
    if (this.typeofPaginationKey === "wheel_two_page") {
      this.getwheel2popupData(this.current_page2);
    }
    if (this.typeofPaginationKey === "whell_three_first") {
      this.wheel3popup(this.current_page2, "");
    }
    if (this.typeofPaginationKey === "monthTablesPmfortypmhundered") {
      this.wheel3Future(this.current_page2, "");
    }
    if (this.typeofPaginationKey === "barChartPopupModalData") {
      this.getMTDChartHundered(this.current_page2, "");
    }
    if (this.typeofPaginationKey === "mtdBarChartForty") {
      this.getMTDChartForty(this.current_page2, "");
    }
    if (this.typeofPaginationKey === "overdue_pagination") {
      this.wheel3OldLeadpopup(this.current_page2, "");
    }
    if (this.typeofPaginationKey === 'wheeloneSecondPopup'){
      this.getWheeloneSecondTabelPopup(this.current_page2,"")
    }
    if(this.typeofPaginationKey ==='wheelthreenewModalData'){
      this.newwheel3popData(this.current_page2,"") 
    }
    if(this.typeofPaginationKey ==='onHoldPaginationwheelTwo'){
      this.getwheel2popupData(this.current_page2) 
    }
  }

  show_wheel2: any = "";
  ShowBoqValue
  openwheel2popup(data1, data2, data3, paginationkey, showboqVal?,boq?) {
   
    console.log(showboqVal,"jfjjfjf")
    if (
      data1 == "second_plus_meeting_data" ||
      data1 == "this_month_boq_data" ||
      data1 == "this_month_boq_data"
    ) {
      this.show_order_book_value_boq = true;
    } else {
      this.show_order_book_value_boq = false;
    }
    this.show_wheel2 = showboqVal;
    this.ShowBoqValue = boq
    this.typeofPaginationKey = paginationkey;
    this.listing_type = data1;
    this.week_number = data2;
    this.heading = data3;
    this.getwheel2popupData(1);
    $("#LeadModal").modal("show");
  }

  onHoldWheelTwoPopup(paginationkey){
    this.typeofPaginationKey = paginationkey
    this.week_number = ''
    this.heading = 'On Hold';
    this.listing_type = 'on_hold';
    this.getwheel2popupData(1);
    $("#LeadModal").modal("show");
  }
  // (click)="openWheelOneSecondpopup('scheduled', w, 'wheeloneSecondPopup', 'PM10_1st_call')"
  agendaforWheelOneSecondTabel :any
  openWheelOneSecondpopup(listingType , weeknuber , paginationkey, agenda){
    this.show_order_book_value_boq = false; // for heading
    this.listing_type = listingType
    this.heading = agenda // heading
    this.week_number = weeknuber,
    this.typeofPaginationKey = paginationkey,
    this.agendaforWheelOneSecondTabel = agenda
    this.getWheeloneSecondTabelPopup(1,"");
    $("#LeadModal").modal("show");
  }
  pageno: any = 1;
  headers_res1;
  async getwheel2popupData(pageno) {
    this.start_date = this.start_date ? this.start_date:"";

    this.loaderService.display(true);
    return (
      await this._projectService.getWheeltwopopupData(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.listing_type,
        this.store,
        this.week_number,
        pageno
      )
    ).subscribe(
      (res) => {
        console.log(res);
        
        this.lead_details = [];
        this.headers_res1 = res.headers._headers;
        this.total_page2 = this.headers_res1.get("x-total");
        this.current_page2 = pageno;
        res = res.json();
        this.loaderService.display(false);
        this.lead_details =
          res.wheel_two_data[0].wheel_two_popup_data.quotations;
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  async getWheeloneSecondTabelPopup(pageno, forExportFile){
    this.start_date = this.start_date ? this.start_date:"";
    this.loaderService.display(true);
    return (
      await this._projectService.wheeloneSecondPopupData(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,        
        this.week_number,
        this.agendaforWheelOneSecondTabel,
        this.listing_type,
        pageno,
        forExportFile
      )
    ).subscribe(
      (res) => {
        this.loaderService.display(false);
        if(!forExportFile){ 
          this.headers_res1 = res.headers._headers;
          this.total_page2 = this.headers_res1.get("x-total");
          this.current_page2 = this.headers_res1.get("x-page");
          res = res.json();  
          this.lead_details = res.lead_statistics_data
        }
        if(forExportFile){
          this.successError = true;
          this.successMessage =
            "Export Will be shared with you on email shortly";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        }
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  async WheelTwoExport(pageno) {
    if (pageno === undefined) {
      pageno = "";
    }
    return (
      await this._projectService.ExportWheelTwo(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.listing_type,
        this.store,
        this.week_number,
        pageno,
        true
      )
    ).subscribe(
      (res) => {
        this.successError = true;
        this.successMessage = "Export Will be shared with you on email shortly";
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          6000
        );
      },
      (err) => {}
    );
  }

  async WheelOneExport() {
    if (this.gm == undefined) {
      this.gm = "";
    }
    if (this.cm == undefined) {
      this.cm = "";
    }
    if (this.designer_data == undefined) {
      this.designer_data = "";
    }
    this.start_date = this.start_date ? this.start_date:"";

    return (
      await this._projectService.wheelOneExport(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.week_number,
        this.store
      )
    ).subscribe(
      (res) => {
        this.successError = true;
        this.successMessage = "Export Will be shared with you on email shortly";
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          6000
        );
      },
      (err) => {}
    );
  }

  typeofPaginationKey: any;
  wheel_three_mileStone_constant: any;
  show_pm: any = "";
  openWheel3popupModal(
    data1: any,
    data2: any,
    data3: any,
    index: any,
    paginationkey,
    showPmKey: any
  ) {
    this.show_pm = showPmKey;
    this.listing_type = data1; // data_type
    this.wheel_three_mileStone_constant = data2; // milestone_type
    this.heading = data3; // heading
    this.week_number = index; // week number
    this.typeofPaginationKey = paginationkey; // for pagination
    this.show_order_book_value_boq = false; // for heading to remove
    this.wheel3popup(1, "");
    $("#LeadModal").modal("show");
  }

  typeforapi_wheel3_one_two :any
  openwheelthreenewchanges(milestone_type :any, type_of_tat:any, typeapi:any, weeknumber:any , typeofmonth :any, heading:any){
    this.show_order_book_value_boq = false // ( to remove boq shared date and boq shared value )
    this.heading = heading // for heading
    this.typeofPaginationKey = 'wheelthreenewModalData' // pagination key
    this.wheel_three_mileStone_constant = milestone_type; // milestone_type
    this.listing_type = type_of_tat // type_of_tat
    this.week_number = weeknumber, // week number
    this.typeforapi_wheel3_one_two = typeapi // for api
    this.month_number = typeofmonth; // listing_type(be key name) for week , overdue , month
    this.newwheel3popData(1, '') 
    $("#LeadModal").modal("show");
  }
  WhellThreePM40MTDExport(bool: any) {
    this.wheel3popup("", bool);
  }

  async wheel3popup(page, forFileboolValue) {
    this.start_date = this.start_date ? this.start_date:"";

    this.loaderService.display(true);
    return (
      await this._projectService.getWheelthreepopupData(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.week_number,
        this.listing_type,
        this.wheel_three_mileStone_constant,
        page,
        forFileboolValue
      )
    ).subscribe(
      (res) => {
        if (!forFileboolValue) {
          this.headers_res1 = res.headers._headers;
          this.total_page2 = this.headers_res1.get("x-total");
          this.current_page2 = this.headers_res1.get("x-page");
          res = res.json();
          this.lead_details = res.quotations;
        }
        if (forFileboolValue) {
          this.successError = true;
          this.successMessage =
            "Export Will be shared with you on email shortly";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        }
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  async newwheel3popData(page, forFileboolValue) {
    this.start_date = this.start_date ? this.start_date:"";
    this.loaderService.display(true);
    return (
      await this._projectService.getwheelthreenewpopData(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.week_number,
        this.wheel_three_mileStone_constant,
        this.month_number,
        this.listing_type,
        this.typeforapi_wheel3_one_two,
        page,
        forFileboolValue
      )
    ).subscribe(
      (res) => {
        this.loaderService.display(false);
        console.log(res);
        
        if (!forFileboolValue) {
          this.headers_res1 = res.headers._headers;
          this.total_page2 = this.headers_res1.get("x-total");
          this.current_page2 = page ;
          res = res.json();
          this.lead_details = res.quotations;
        }
        if (forFileboolValue) {
          this.successError = true;
          this.successMessage =
            "Export Will be shared with you on email shortly";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        }
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  openWheel3OldLeadpopupModal(
    data1: any,
    data2: any,
    data3: any,
    index: any,
    paginationkey,
    showPmKey: any
  ) {
    this.show_pm = showPmKey;
    this.listing_type = data1; // data_type
    this.wheel_three_mileStone_constant = data2; // milestone_type
    this.heading = data3; // heading
    this.week_number = index; // week number
    this.typeofPaginationKey = paginationkey; // for pagination
    this.show_order_book_value_boq = false; // for heading
    this.wheel3OldLeadpopup(1, "");
    $("#LeadModal").modal("show");
  }

  async wheel3OldLeadpopup(page, forFileboolValue) {
    this.start_date = this.start_date ? this.start_date:"";

    this.loaderService.display(true);
    return (
      await this._projectService.getWheelthreepopupOldLeadData(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.week_number,
        this.listing_type,
        this.wheel_three_mileStone_constant,
        page,
        forFileboolValue
      )
    ).subscribe(
      (res) => {
        if (!forFileboolValue) {
          this.headers_res1 = res.headers._headers;
          this.total_page2 = this.headers_res1.get("x-total");
          this.current_page2 = this.headers_res1.get("x-page");
          res = res.json();
          this.lead_details = res.quotations;
        }
        if (forFileboolValue) {
          this.successError = true;
          this.successMessage =
            "Export Will be shared with you on email shortly";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        }
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  month_number: any;
  openwheel3futurepopModal(
    milestone_type,
    data_type,
    month_num,
    week_num,
    showpm_val
  ) {
    this.typeofPaginationKey = "monthTablesPmfortypmhundered";
    this.show_order_book_value_boq = false;
    this.show_pm = showpm_val;
    this.week_number = week_num;
    this.listing_type = data_type;
    this.wheel_three_mileStone_constant = milestone_type;
    this.month_number = month_num;
    if (
      this.month_number === "" &&
      this.wheel_three_mileStone_constant == "payment_40_mapped"
    ) {
      this.month_number = this.no_of_month;
    }
    if (
      this.month_number === "" &&
      this.wheel_three_mileStone_constant == "project_handover"
    ) {
      this.month_number = this.no_of_month2;
      this.heading = "Future PM100";
    }

    if (this.wheel_three_mileStone_constant == "payment_40_mapped") {
      this.heading = "Future PM40";
    } else {
      this.heading = "Future PM100";
    }

    this.wheel3Future(1, "");
    $("#LeadModal").modal("show");
  }

  futurePmfortyWheelthreeExport(bool: any) {
    this.wheel3Future("", bool);
  }

  async wheel3Future(page, forFileboolValue) {
    this.start_date = this.start_date ? this.start_date:"";

    this.loaderService.display(true);
    return (
      await this._projectService.getWheelthreefuture(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.week_number,
        this.listing_type,
        this.wheel_three_mileStone_constant,
        this.month_number,
        page,
        forFileboolValue
      )
    ).subscribe(
      (res) => {
        if (!forFileboolValue) {
          this.headers_res1 = res.headers._headers;
          this.total_page2 = this.headers_res1.get("x-total");
          this.current_page2 = this.headers_res1.get("x-page");
          res = res.json();
          this.lead_details = res.quotations;
        }

        if (forFileboolValue) {
          this.successError = true;
          this.successMessage =
            "Export Will be shared with you on email shortly";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            6000
          );
        }
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  MTDPMChart100Export(bool: any) {
    this.getMTDChartHundered("", bool);
  }
  WheelOneSecondTabelExport(bool:any){
    this.getWheeloneSecondTabelPopup("", bool);
  }

  wheelThreefirstTabelExport(bool:any){
    this.newwheel3popData("" , bool)
  }
  mtd_data_type: any;
  mtd_MileStone_type: any;
  mtd_forty_page_number: any;
  mtd_pm_chart(e: any) {
    this.show_pm = "show_pm100wheel3";
    this.typeofPaginationKey = "barChartPopupModalData";
    this.show_order_book_value_boq = false;
    if (e.active[0]._index == 0) {
      // service start
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "service_start");
        this.heading = "Service Start - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "service_start");
        this.heading = "Service Start - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "service_start");
        this.heading = "Service Start - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "service_start");
        this.heading = "Service Start - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 1) {
      // service 50 %
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "service_50");
        this.heading = "Service 50% - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "service_50");
        this.heading = "Service 50% - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "service_50");
        this.heading = "Service 50% - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "service_50");
        this.heading = "Service 50% - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 2) {
      // service 100
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "service_100");
        this.heading = "Service 100 - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "service_100");
        this.heading = "Service 100 - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "service_100");
        this.heading = "Service 100 - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "service_100");
        this.heading = "Service 100 - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 3) {
      // project handover
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "project_handover");
        this.heading = "Project Handover - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "project_handover");
        this.heading = "Project Handover - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "project_handover");
        this.heading = "Project Handover - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "project_handover");
        this.heading = "Project Handover - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 4) {
      // raw material
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "raw_material");
        this.heading = "Raw Material - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "raw_material");
        this.heading = "Raw Material - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "raw_material");
        this.heading = "Raw Material - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "raw_material");
        this.heading = "Raw Material - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 5) {
      // panel production start
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "panel_production_start");
        this.heading = "Panel Production Start - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "panel_production_start");
        this.heading = "Panel Production Start - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "panel_production_start");
        this.heading = "Panel Production Start - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "panel_production_start");
        this.heading = "Panel Production Start - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 6) {
      // panel dispatch
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "panel_dispatch");
        this.heading = "Panel Dispatch - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "panel_dispatch");
        this.heading = "Panel Dispatch - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "panel_dispatch");
        this.heading = "Panel Dispatch - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "panel_dispatch");
        this.heading = "Panel Dispatch - Delayed (>10) Leads";
      }
    }
    $("#LeadModal").modal("show");
    this.getMTDChartHundered(1, "");
  }

  pm_forty_mtd(e: any) {
    this.show_order_book_value_boq = false;
    this.typeofPaginationKey = "mtdBarChartForty ";
    if (e.active[0]._index == 0) {
      // st measurement
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "initial_site_measurement_data");
        this.heading = "Site Measurement - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "initial_site_measurement_data");
        this.heading = "Service Start - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "initial_site_measurement_data");
        this.heading = "Service Start - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "initial_site_measurement_data");
        this.heading = "Service Start - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 1) {
      // mt selection %
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "material_finalisation_meeting_data");
        this.heading = "Material Finalisation - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "material_finalisation_meeting_data");
        this.heading = "Material Finalisation - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "material_finalisation_meeting_data");
        this.heading = "Material Finalisation - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "material_finalisation_meeting_data");
        this.heading = "Material Finalisation - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 2) {
      // st validation %
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "site_validation_request_data");
        this.heading = "Site Validation - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "site_validation_request_data");
        this.heading = "Site Validation - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "site_validation_request_data");
        this.heading = "Site Validation - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "site_validation_request_data");
        this.heading = "Site Validation - Delayed (>10) Leads";
      }
    } else if (e.active[0]._index == 3) {
      // qc date %
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "final_boq_category_handover_data");
        this.heading = "QC Date - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "final_boq_category_handover_data");
        this.heading = "QC Date - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "final_boq_category_handover_data");
        this.heading = "QC Date - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "final_boq_category_handover_data");
        this.heading = "QC Date - Delayed (>10) Leads";
      }
      ;
    } else if (e.active[0]._index == 4) {
      // qc approved %
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        (this.mtd_data_type = "on_tat"),
          (this.mtd_MileStone_type = "final_boq_category_approved_data");
        this.heading = "QC Approved - On Track Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        (this.mtd_data_type = "off_tat_5"),
          (this.mtd_MileStone_type = "final_boq_category_approved_data");
        this.heading = "QC Approved - Delayed (1-5) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        (this.mtd_data_type = "off_tat_below_10"),
          (this.mtd_MileStone_type = "final_boq_category_approved_data");
        this.heading = "QC Approved - Delayed (5-10) Leads";
      }
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        (this.mtd_data_type = "off_tat_above_10"),
          (this.mtd_MileStone_type = "final_boq_category_approved_data");
        this.heading = "QC Approved - Delayed (>10) Leads";
      }
    }
    $("#LeadModal").modal("show");
    this.getMTDChartForty(1, ""); // another function
  }
  MTDPMChart40Export(bool: any) {
    this.getMTDChartForty("", bool);
  }
  getMTDChartForty(page, forFileboolValue) {
    this.start_date = this.start_date ? this.start_date:"";

    // this.loaderService.display(true);
    this._projectService
      .getBarChartForty(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.mtd_data_type,
        this.mtd_MileStone_type,
        page,
        forFileboolValue
      )
      .subscribe(
        (res) => {
          if (!forFileboolValue) {
            this.headers_res1 = res.headers._headers;
            this.total_page2 = this.headers_res1.get("x-total");
            this.current_page2 = this.headers_res1.get("x-page");
            res = res.json();
            this.lead_details = res.quotations;
          }
          if (forFileboolValue) {
            this.successError = true;
            this.successMessage =
              "Export Will be shared with you on email shortly";
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              6000
            );
          }
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  getMTDChartHundered(page, forFileboolValue) {
    this.start_date = this.start_date ? this.start_date:"";

    // this.loaderService.display(true);
    this._projectService
      .getBarChartMtdPM(
        this.start_date,
        this.cm,
        this.gm,
        this.designer_data,
        this.store,
        this.mtd_data_type,
        this.mtd_MileStone_type,
        page,
        forFileboolValue
      )
      .subscribe(
        (res) => {
          if (!forFileboolValue) {
            this.headers_res1 = res.headers._headers;
            this.total_page2 = this.headers_res1.get("x-total");
            this.current_page2 = this.headers_res1.get("x-page");
            res = res.json();
            this.lead_details = res.quotations;
          }
          if (forFileboolValue) {
            this.successError = true;
            this.successMessage =
              "Export Will be shared with you on email shortly";
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              6000
            );
          }
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
}
