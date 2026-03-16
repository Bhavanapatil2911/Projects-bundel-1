import { Component, OnInit } from "@angular/core";
import { LeadService } from "app/platform/lead/lead.service";
import { ProjectService } from "app/platform/project/project/project.service";
import { LoaderService } from "../../../services/loader.service";
import { environment } from "../../../../environments/environment";
import "chart.piecelabel.js";
import { Chart } from "chart.js";
import { GeneralManagerService } from "app/platform/general-manager/general-manager.service";
declare var $: any;

@Component({
  selector: "app-designer-dashboard",
  templateUrl: "./designer-dashboard.component.html",
  styleUrls: ["./designer-dashboard.component.css"],
  providers: [ProjectService, LeadService],
})
export class DesignerDashboardComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    private leadService: LeadService,
    private loaderService: LoaderService,
    private generalManagerService: GeneralManagerService
  ) {}

  baseUrl = environment.uihrefUrl;
  public loader: boolean = false;
  public pieChartLabels1: string[] = [
    "On Track",
    "Delayed(1-5)",
    "Delayed(5-10)",
    "Delayed(>10)",
  ];

  public pieChartLabels: string[] = [
    "Delay. By Customer",
    "Delay. Possession",
    "Site Not Ready",
    "On Track",
    "Delayed(1-5)",
    "Delayed(5-10)",
    "Delayed(>10)",
  ];

  public doughnutChartData2: number[];
  public doughnutChartData7: number[];

  public doughnutChartType: string = "doughnut";
  public colors: Array<any> = [
    {
      backgroundColor: ["#99ff66", "#6699ff", "#ffff66", "#ff9933"],
    },
  ];

  public colorslong: Array<any> = [
    {
      backgroundColor: [
        "#6699ff",
        "#99ff66",
        "#ffff66",
        "#ff9933",
        "#b3b3b3",
        "#3366ff",
        "#8d0528",
      ],
    },
  ];

  public barChartLabels4 = ["2006", "2007", "2008", "2009", "2010"];
  public barChartType4 = "bar";

  public doughChartOptions: any = {
    legend: {
      // display: false,
      position: "top",
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        fontSize: 8,
      },
    },
    pieceLabel: {
      render: function (args) {
        return args.value + "\n" + "(" + args.percentage + "%)";
      },
      fontColor: "#000",
      fontSize: "8",
    },
  };

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

  public thirdChartOptions: any = {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        fontSize: 8,
      },
    },
    pieceLabel: {
      render: function (args) {
        return args.value + "\n" + "(" + args.percentage + "%)";
      },
      fontColor: "#000",
      fontSize: "8",
    },
  };

  public barChartType = "bar";
  public barChartLegend = true;
  public barChartData: any[];

  public lineChartColors: Array<any> = [
    {
      backgroundColor: "#FFEAEF",
    },
    {
      backgroundColor: "#8d0528",
    },
  ];

  public barChartLabels2;
  public barChartLabels3;

  public barChartType2 = "bar";
  public barChartLegend2 = true;
  public barChartData2: any[];
  public barChartDatanew: any[];

  public chartHovered(e: any): void {}

  public canvasWidth = 500;
  public canvasWidth2 = 300;

  public needleValue: any;
  public needleValue2: any;

  public centralLabel = "";
  public bottomLabel: any;
  public options = {
    hasNeedle: true,
    needleColor: "black",
    needleUpdateSpeed: 1000,
    arcColors: ["#FFEAEF", "#8d0528"],
    arcDelimiters: [30],
    rangeLabel: ["0", "100"],
    needleStartValue: 50,
  };

  public options2 = {
    hasNeedle: true,
    needleColor: "black",
    needleUpdateSpeed: 1000,
    arcColors: ["#8d0528", "#FFEAEF"],
    arcDelimiters: [65],
    rangeLabel: ["0", "100"],
    needleStartValue: 50,
  };

  public barChartOptions = {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        fontSize: 8,
      },
    },
    hover: {
      mode: "nearest",
      intersec: true,
    },
    interaction: {
      mode: "nearest",
    },
    scales: {
      scaleShowValues: true,

      yAxes: [
        {
          ticks: {
            min: 0,
            beginAtZero: true,
            callback: function (value, index, values) {
              return value + "L";
            },
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  current_user_id;
  role;

  ngOnInit() {
    this.current_user_id = localStorage.getItem("userId");

    this.getOverallperformance();
    this.getOverallOrderData();
    this.getSiteMeasurementData(1);
    this.getTatinfodata(1);
    this.getSiteValidationData();
    this.getPaymentStatus();
    this.getSpeedofobtooc();
    this.getCurrentWeekOrder();
    this.role = localStorage.getItem("user");
    if (this.role === "business_head" || this.role == "store_manager") {
      this.getGMList();
    }
    if (this.role === "city_gm" || this.role == "store_manager") {
      this.getCMList(this.current_user_id);
    }
    if (this.role === "community_manager" || this.role == "store_manager") {
      this.getDesignerList(this.current_user_id);
    }
    if (this.role == "city_gm" || this.role == "business_head") {
      this.getAllStores();
    }
  }

  overall_lead_info;
  noc_expected_cross_data;
  total_page3;
  current_page3;
  per_page3;
  getOverallperformance() {
    this.loaderService.display(true);
    this.projectService
      .getOverallPerformance(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.overall_lead_info = res.data;
        this.noc_expected_cross_data =
          res.data.nocs_crossed_expected_dates_data;
        this.total_page3 = this.noc_expected_cross_data.length;
        this.current_page3 = 1;
        this.per_page3 = 5;
        this.doughnutChartData2 = [
          this.overall_lead_info.hold_data.hold_delayed_by_customer_count,
          this.overall_lead_info.hold_data.hold_delayed_possession_count,
          this.overall_lead_info.hold_data.hold_site_not_ready_count,
          this.overall_lead_info.on_track_nocs_count,
          this.overall_lead_info.delayed_nocs_1_5_count,
          this.overall_lead_info.delayed_nocs_5_10_count,
          this.overall_lead_info.delayed_nocs_greather_than_10_count,
        ];
        this.loaderService.display(false);
      });
  }

  order_book_data;
  order_confirm_data;
  getOverallOrderData() {
    this.projectService
      .getOverallorderData(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.order_book_data = res.data.order_booking;
        this.order_confirm_data = res.data.order_confirmation;
        this.barChartData = [
          {
            label: "Order Booking",
            data: [res.data.order_booking.toFixed(2)],
          },
          {
            label: "Order Confirmation",
            data: [res.data.order_confirmation.toFixed(2)],
          },
        ];
        this.show_value = true;
        this.show_book = true;
        this.display_val1 = this.order_book_data;
      });
  }

  current_week_value;
  current_week_value_expected;
  current_week_label;
  current_week_data;
  current_week_data_expect;
  getCurrentWeekOrder() {
    this.loader = true;
    this.projectService
      .getcurrentweekorder(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.current_week_value = Object.values(res)[0]["actual"].boq_value;
        this.current_week_value_expected =
          Object.values(res)[0]["expected"].boq_value;
        this.current_week_label = Object.keys(res)[0];
        this.current_week_data = Object.values(res)[0]["actual"].quotations;
        this.current_week_data_expect =
          Object.values(res)[0]["expected"].quotations;
        this.getNextweekOrder();
        this.loader = false;
      });
  }

  week1;
  week1_label;
  week1_data;
  week1_data_expect;
  week2_data_expect;
  week3_data_expect;
  week4_data_expect;
  week5_data_expect;
  week2;
  week2_label;
  week2_data;
  week3;
  week3_label;
  week3_data;
  week4;
  week4_label;
  week4_data;
  week5;
  week5_label;
  week5_data;
  week1_expect;
  week2_expect;
  week3_expect;
  week4_expect;
  week5_expect;

  getNextweekOrder() {
    this.loader = true;
    this.projectService
      .getnexttweekorder(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.week1 = Object.values(res.upcoming_weeks_data_actual[0])[0];
        this.week1_expect = Object.values(
          res.upcoming_weeks_data_expected[0]
        )[0];
        this.week1_label = Object.keys(res.upcoming_weeks_data_actual[0])[0];
        this.week1_data = res.upcoming_weeks_data_actual[0].quotations;
        this.week1_data_expect = res.upcoming_weeks_data_expected[0].quotations;
        this.week2 = Object.values(res.upcoming_weeks_data_actual[1])[0];
        this.week2_expect = Object.values(
          res.upcoming_weeks_data_expected[1]
        )[0];
        this.week2_label = Object.keys(res.upcoming_weeks_data_actual[1])[0];
        this.week2_data = res.upcoming_weeks_data_actual[1].quotations;
        this.week2_data_expect = res.upcoming_weeks_data_expected[1].quotations;
        this.week3 = Object.values(res.upcoming_weeks_data_actual[2])[0];
        this.week3_expect = Object.values(
          res.upcoming_weeks_data_expected[2]
        )[0];
        this.week3_label = Object.keys(res.upcoming_weeks_data_actual[2])[0];
        this.week3_data = res.upcoming_weeks_data_actual[2].quotations;
        this.week3_data_expect = res.upcoming_weeks_data_expected[2].quotations;
        this.week4 = Object.values(res.upcoming_weeks_data_actual[3])[0];
        this.week4_expect = Object.values(
          res.upcoming_weeks_data_expected[3]
        )[0];
        this.week4_label = Object.keys(res.upcoming_weeks_data_actual[3])[0];
        this.week4_data = res.upcoming_weeks_data_actual[3].quotations;
        this.week4_data_expect = res.upcoming_weeks_data_expected[3].quotations;
        this.week5 = Object.values(res.upcoming_weeks_data_actual[4])[0];
        this.week5_expect = Object.values(
          res.upcoming_weeks_data_expected[4]
        )[0];
        this.week5_label = Object.keys(res.upcoming_weeks_data_actual[4])[0];
        this.week5_data = res.upcoming_weeks_data_actual[4].quotations;
        this.week5_data_expect = res.upcoming_weeks_data_expected[4].quotations;
        this.loader = false;
        this.getValueWeekvise();
      });
  }

  barChartColors: any[] = [
    {
      backgroundColor: "#FFEAEF",
    },
    {
      backgroundColor: "#8d0528",
    },
  ];

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

  getValueWeekvise() {
    this.barChartData2 = [
      {
        data: [
          Math.round(this.current_week_value),
          Math.round(this.week1),
          Math.round(this.week2),
          Math.round(this.week3),
          Math.round(this.week4),
          Math.round(this.week5),
        ],
        label: "Actual",
        stack: "a",
        backgroundColor: "red",
      },
      {
        data: [
          Math.round(this.current_week_value_expected),
          Math.round(this.week1_expect),
          Math.round(this.week2_expect),
          Math.round(this.week3_expect),
          Math.round(this.week4_expect),
          Math.round(this.week5_expect),
        ],
        label: "Expected",
        stack: "a",
        backgroundColor: "red",
      },
    ];

    this.barChartLabels2 = [
      "W" + this.current_week_label,
      "W" + this.week1_label,
      "W" + this.week2_label,
      "W" + this.week3_label,
      "W" + this.week4_label,
      "W" + this.week5_label,
    ];
  }

  loader_payment: boolean = false;
  payment_status_info;
  percentage_delayed;
  getPaymentStatus() {
    this.loader_payment = true;
    this.projectService
      .getpaymentStatusData(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.payment_status_info = res.data;
        this.doughnutChartData7 = [
          this.payment_status_info.payment_status.on_track_count,
          this.payment_status_info.payment_status.delayed_1_5_count,
          this.payment_status_info.payment_status.delayed_5_10_count,
          this.payment_status_info.payment_status.delayed_greater_than_10_count,
        ];
        this.percentage_delayed = res.percentage_delayed;
        Chart.plugins.register({
          beforeDraw: function (chart) {
            if (chart.canvas.id == "firstChart") {
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
        // this.loaderService.display(false);
        this.loader_payment = false;
      });
  }

  site_measure_data;
  current_page: any = 1;
  per_page: any = 10;
  per_page2: any = 10;
  total_page;
  total_page2;
  current_page2: any = 1;
  headers_res;
  getSiteMeasurementData(pageno: any) {
    this.projectService
      .getsitemeasurementData(
        pageno,
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.headers_res = res.headers._headers;
        this.total_page = this.headers_res.get("x-total");
        this.current_page = pageno;
        this.per_page = 5;
        res = res.json();
        this.site_measure_data = res.data;
        // this.loaderService.display(false);
      });
  }

  tat_info_data;
  tat_pend_data;
  current_page4;
  current_page5;
  total_page4;
  total_page5;
  per_page5;
  per_page4;
  getTatinfodata(pageno: any) {
    // this.loaderService.display(true);
    this.projectService
      .getdesigndashtatData(
        pageno,
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        // this.headers_res = res.headers._headers;
        // this.total_page4 = this.headers_res.get("x-total");
        this.current_page4 = pageno;
        this.current_page5 = pageno;
        this.per_page4 = 5;
        this.per_page5 = 5;
        res = res.json();
        this.tat_info_data = res.tat_payment_collected_data;
        this.tat_pend_data = res.tat_payment_pending_data;
        this.total_page5 = this.tat_pend_data.length;
        this.total_page4 = this.tat_info_data.length;
        // this.loaderService.display(false);
      });
  }

  pageChanged(event) {
    this.current_page2 = event;
    // this.total_page2 = this.overall_lead_info.on_track_nocs.length;
    this.per_page2 = 10;
  }

  pageChanged2(event) {
    this.current_page3 = event;
    this.per_page3 = 5;
  }

  pageChanged3(event) {
    this.current_page3 = event;
    this.per_page3 = 5;
  }

  pageChanged5(event) {
    this.current_page4 = event;
    this.per_page4 = 5;
  }

  pageChanged6(event) {
    this.current_page5 = event;
    this.per_page5 = 5;
  }
  site_validation_info;
  mat_sel_ontrack;
  mat_sel_delaed15;
  mat_sel_delaed510;
  mat_sel_delaed10;
  qca_ontrack;
  qca_delaed15;
  qca_delaed510;
  qca_delaed10;
  qc_ontrack;
  qc_delaed15;
  qc_delaed510;
  qc_delaed10;
  sm_ontrack;
  sm_delaed15;
  sm_delaed510;
  sm_delaed10;
  sl_ontrack;
  sl_delaed15;
  sl_delaed510;
  sl_delaed10;
  getSiteValidationData() {
    // this.loaderService.display(true);
    this.projectService
      .getsitevalidationData(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.site_validation_info = res.data;
        this.mat_sel_ontrack =
          this.site_validation_info.material_selection.on_track;
        this.mat_sel_delaed15 =
          this.site_validation_info.material_selection.delayed_1_5;
        this.mat_sel_delaed510 =
          this.site_validation_info.material_selection.delayed_5_10;
        this.mat_sel_delaed10 =
          this.site_validation_info.material_selection.delayed_greater_than_10;
        this.qca_ontrack = this.site_validation_info.qc_approval.on_track;
        this.qca_delaed15 = this.site_validation_info.qc_approval.delayed_1_5;
        this.qca_delaed510 = this.site_validation_info.qc_approval.delayed_5_10;
        this.qca_delaed10 =
          this.site_validation_info.qc_approval.delayed_greater_than_10;
        this.qc_ontrack = this.site_validation_info.qc_submit.on_track;
        this.qc_delaed15 = this.site_validation_info.qc_submit.delayed_1_5;
        this.qc_delaed510 = this.site_validation_info.qc_submit.delayed_5_10;
        this.qc_delaed10 =
          this.site_validation_info.qc_submit.delayed_greater_than_10;
        this.sm_ontrack = this.site_validation_info.site_measurement.on_track;
        this.sm_delaed15 =
          this.site_validation_info.site_measurement.delayed_1_5;
        this.sm_delaed510 =
          this.site_validation_info.site_measurement.delayed_5_10;
        this.sm_delaed10 =
          this.site_validation_info.site_measurement.delayed_greater_than_10;
        this.sl_ontrack = this.site_validation_info.site_validation.on_track;
        this.sl_delaed15 =
          this.site_validation_info.site_validation.delayed_1_5;
        this.sl_delaed510 =
          this.site_validation_info.site_validation.delayed_5_10;
        this.sl_delaed10 =
          this.site_validation_info.site_validation.delayed_greater_than_10;
        this.barChartDatanew = [
          {
            data: [
              this.site_validation_info.material_selection.ms_on_track_count,
              this.site_validation_info.qc_approval.qca_on_track_count,
              this.site_validation_info.qc_submit.qc_on_track_count,
              this.site_validation_info.site_measurement.sm_on_track_count,
              this.site_validation_info.site_validation.sv_on_track_count,
            ],
            label: "On Track",
            stack: "a",
            backgroundColor: "red",
          },
          {
            data: [
              this.site_validation_info.material_selection.ms_delayed_1_5_count,
              this.site_validation_info.qc_approval.qca_delayed_1_5_count,
              this.site_validation_info.qc_submit.qc_delayed_1_5_count,
              this.site_validation_info.site_measurement.sm_delayed_1_5_count,
              this.site_validation_info.site_validation.sv_delayed_1_5_count,
            ],
            label: "Delayed (1-5)",
            stack: "a",
            backgroundColor: "red",
          },
          {
            data: [
              this.site_validation_info.material_selection
                .ms_delayed_5_10_count,
              this.site_validation_info.qc_approval.qca_delayed_5_10_count,
              this.site_validation_info.qc_submit.qc_delayed_5_10_count,
              this.site_validation_info.site_measurement.sm_delayed_5_10_count,
              this.site_validation_info.site_validation.sv_delayed_5_10_count,
            ],
            label: "Delayed (5-10)",
            stack: "a",
            backgroundColor: "red",
          },
          {
            data: [
              this.site_validation_info.material_selection
                .ms_delayed_greater_than_10_count,
              this.site_validation_info.qc_approval
                .qca_delayed_greater_than_10_count,
              this.site_validation_info.qc_submit
                .qc_delayed_greater_than_10_count,
              this.site_validation_info.site_measurement
                .sm_delayed_greater_than_10_count,
              this.site_validation_info.site_validation
                .sv_delayed_greater_than_10_count,
            ],
            label: "Delayed (>10)",
            stack: "a",
            backgroundColor: "red",
          },
        ];

        this.barChartLabels3 = [
          "Mt. Sel.",
          "QC App.",
          "QC Sub.",
          "St. Measure.",
          "St. Valid.",
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
        Chart.plugins.register({
          beforeDraw: function (chart) {
            if (chart.canvas.id == "fourthChart") {
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
        Chart.plugins.register({
          beforeDraw: function (chart) {
            if (chart.canvas.id == "fifthChart") {
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
        // this.loaderService.display(false);
      });
  }

  target_overallmoving;
  bottomLabel2;
  getSpeedofobtooc() {
    // this.loaderService.display(true);
    this.projectService
      .getspeedofobtooc(
        this.gms,
        this.cms,
        this.designerss,
        this.from_date,
        this.to_date,
        this.Stores
      )
      .subscribe((res) => {
        this.bottomLabel = res.ob_to_oc_speed;
        this.needleValue = res.ob_to_oc_speed;
        this.bottomLabel2 = res.overall_moving_30_days_actual;
        this.needleValue2 = res.overall_moving_30_days_actual;
        this.target_overallmoving = res.overall_moving_30_days_target;
        // this.loaderService.display(false);
      });
  }

  show_value: boolean = false;
  show_book: boolean = false;
  show_confirm: boolean = false;
  display_val1;
  display_val2;

  chartClickeing(e) {
    this.boq_reference = false;
    this.show_value = true;
    this.show_book = true;
    if (e.active[0]._datasetIndex == 0) {
      this.show_book = true;
      this.show_confirm = false;
      this.display_val1 = this.order_book_data;
    }
    if (e.active[0]._datasetIndex == 1) {
      this.show_confirm = true;
      this.show_book = false;
      this.display_val2 = this.order_confirm_data;
    }
  }

  overall_info_table: any;
  header_name;
  public chartClicked(e: any): void {
    this.boq_reference = false;
    if (e.active[0]._index == 0) {
      this.quotation_delayed = false;
      this.header_name = "On Track Leads";
      this.overall_info_table = this.overall_lead_info.on_track_nocs;
      this.total_page2 = this.overall_lead_info.on_track_nocs.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 1) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (1-5 Days) Leads";
      this.overall_info_table = this.overall_lead_info.delayed_nocs_1_5;
      this.total_page2 = this.overall_lead_info.delayed_nocs_1_5.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 2) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (5-10 Days) Leads";
      this.overall_info_table = this.overall_lead_info.delayed_nocs_5_10;
      this.total_page2 = this.overall_lead_info.delayed_nocs_5_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 3) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (> 10 Days) Leads";
      this.overall_info_table =
        this.overall_lead_info.delayed_nocs_greather_than_10;
      this.total_page2 =
        this.overall_lead_info.delayed_nocs_greather_than_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    $("#onTrackModal").modal("show");
  }

  public chartClicked4(e: any): void {
    this.boq_reference = false;
    if (e.active[0]._index == 0) {
      this.quotation_delayed = false;
      this.header_name = "Delay. By Customer";
      this.overall_info_table =
        this.site_validation_info.site_validation.on_track;
      this.total_page2 =
        this.site_validation_info.site_validation.on_track.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 1) {
      this.quotation_delayed = false;
      this.header_name = "Delayed Possession Leads";
      this.overall_info_table =
        this.site_validation_info.site_validation.delayed_1_5;
      this.total_page2 =
        this.site_validation_info.site_validation.delayed_1_5.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 2) {
      this.quotation_delayed = false;
      this.header_name = "Site Not Ready Leads";
      this.overall_info_table =
        this.site_validation_info.site_validation.delayed_5_10;
      this.total_page2 =
        this.site_validation_info.site_validation.delayed_5_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    if (e.active[0]._index == 3) {
      this.quotation_delayed = false;
      this.header_name = "On Track Leads";
      this.overall_info_table = this.overall_lead_info.on_track_nocs;
      this.total_page2 = this.overall_lead_info.on_track_nocs.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 4) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (1-5 Days) Leads";
      this.overall_info_table = this.overall_lead_info.delayed_nocs_1_5;
      this.total_page2 = this.overall_lead_info.delayed_nocs_1_5.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 5) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (5-10 Days) Leads";
      this.overall_info_table = this.overall_lead_info.delayed_nocs_5_10;
      this.total_page2 = this.overall_lead_info.delayed_nocs_5_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 6) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (> 10 Days) Leads";
      this.overall_info_table =
        this.overall_lead_info.delayed_nocs_greather_than_10;
      this.total_page2 =
        this.overall_lead_info.delayed_nocs_greather_than_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    $("#onTrackModal").modal("show");
  }
  public chartClicked5(e: any): void {
    this.boq_reference = false;
    if (e.active[0]._index == 0) {
      this.quotation_delayed = false;
      this.header_name = "On Track Leads";
      this.overall_info_table = this.site_validation_info.qc_submit.on_track;
      this.total_page2 = this.site_validation_info.qc_submit.on_track.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 1) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (1-5 Days) Leads";
      this.overall_info_table = this.site_validation_info.qc_submit.delayed_1_5;
      this.total_page2 = this.site_validation_info.qc_submit.delayed_1_5.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 2) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (5-10 Days) Leads";
      this.overall_info_table =
        this.site_validation_info.qc_submit.delayed_5_10;
      this.total_page2 =
        this.site_validation_info.qc_submit.delayed_5_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 3) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (> 10 Days) Leads";
      this.overall_info_table =
        this.site_validation_info.qc_submit.delayed_greater_than_10;
      this.total_page2 =
        this.site_validation_info.qc_submit.delayed_greater_than_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    $("#onTrackModal").modal("show");
  }

  public chartClicked6(e: any): void {
    this.boq_reference = false;
    if (e.active[0]._index == 0) {
      this.quotation_delayed = false;
      this.header_name = "On Track Leads";
      this.overall_info_table = this.site_validation_info.qc_approval.on_track;
      this.total_page2 = this.site_validation_info.qc_approval.on_track.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 1) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (1-5 Days) Leads";
      this.overall_info_table =
        this.site_validation_info.qc_approval.delayed_1_5;
      this.total_page2 =
        this.site_validation_info.qc_approval.delayed_1_5.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 2) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (5-10 Days) Leads";
      this.overall_info_table =
        this.site_validation_info.qc_approval.delayed_5_10;
      this.total_page2 =
        this.site_validation_info.qc_approval.delayed_5_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 3) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (> 10 Days) Leads";
      this.overall_info_table =
        this.site_validation_info.qc_approval.delayed_greater_than_10;
      this.total_page2 =
        this.site_validation_info.qc_approval.delayed_greater_than_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    $("#onTrackModal").modal("show");
  }

  quotation_delayed: boolean = false;
  public chartClicked7(e: any): void {
    this.boq_reference = false;
    if (e.active[0]._index == 0) {
      this.quotation_delayed = false;
      this.header_name = "On Track Leads";
      this.overall_info_table =
        this.payment_status_info.payment_status.on_track;
      this.total_page2 =
        this.payment_status_info.payment_status.on_track.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
      // this.pageChanged(1);
    } else if (e.active[0]._index == 1) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (1-5 Days) Leads";
      this.overall_info_table =
        this.payment_status_info.payment_status.delayed_1_5;
      this.total_page2 =
        this.payment_status_info.payment_status.delayed_1_5.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 2) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (5-10 Days) Leads";
      this.overall_info_table =
        this.payment_status_info.payment_status.delayed_5_10;
      this.total_page2 =
        this.payment_status_info.payment_status.delayed_5_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 3) {
      this.quotation_delayed = false;
      this.header_name = "Delayed (> 10 Days) Leads";
      this.overall_info_table =
        this.payment_status_info.payment_status.delayed_greater_than_10;
      this.total_page2 =
        this.payment_status_info.payment_status.delayed_greater_than_10.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    $("#onTrackModal").modal("show");
  }

  boq_reference: boolean = false;
  public chartClicked9(e: any) {
    this.boq_reference = true;
    if (e.active[0]._datasetIndex == 1) {
      if (e.active[0]._index === 0) {
        this.header_name = "W" + this.current_week_label + " Actual Leads";
        this.overall_info_table = this.current_week_data;
        this.total_page2 = this.current_week_data.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 1) {
        this.header_name = "W" + this.week1_label + " Actual Leads";
        this.overall_info_table = this.week1_data;
        this.total_page2 = this.week1_data.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 2) {
        this.header_name = "W" + this.week2_label + " Actual Leads";
        this.overall_info_table = this.week2_data;
        this.total_page2 = this.week2_data.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 3) {
        this.header_name = "W" + this.week3_label + " Actual Leads";
        this.overall_info_table = this.week3_data;
        this.total_page2 = this.week3_data.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 4) {
        this.header_name = "W" + this.week4_label + " Actual Leads";
        this.overall_info_table = this.week4_data;
        this.total_page2 = this.week4_data.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 5) {
        this.header_name = "W" + this.week5_label + " Actual Leads";
        this.overall_info_table = this.week5_data;
        this.total_page2 = this.week5_data.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
    } else if (e.active[0]._datasetIndex == 0) {
      if (e.active[0]._index === 0) {
        this.header_name = "W" + this.current_week_label + " Expected Leads";
        this.overall_info_table = this.current_week_data_expect;
        this.total_page2 = this.current_week_data_expect.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 1) {
        this.header_name = "W" + this.week1_label + " Expected Leads";
        this.overall_info_table = this.week1_data_expect;
        this.total_page2 = this.week1_data_expect.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 2) {
        this.header_name = "W" + this.week2_label + " Expected Leads";
        this.overall_info_table = this.week2_data_expect;
        this.total_page2 = this.week2_data_expect.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 3) {
        this.header_name = "W" + this.week3_label + " Expected Leads";
        this.overall_info_table = this.week3_data_expect;
        this.total_page2 = this.week3_data_expect.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 4) {
        this.header_name = "W" + this.week4_label + " Expected Leads";
        this.overall_info_table = this.week4_data_expect;
        this.total_page2 = this.week4_data_expect.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
      if (e.active[0]._index === 5) {
        this.header_name = "W" + this.week5_label + " Expected Leads";
        this.overall_info_table = this.week5_data_expect;
        this.total_page2 = this.week5_data_expect.length;
        this.current_page2 = 1;
        this.per_page2 = 10;
      }
    }
    $("#onTrackModal").modal("show");
  }

  public chartClicked10(e: any) {
    this.boq_reference = false;
    this.current_page2 = 1;
    this.per_page2 = 10;
    if (e.active[0]._index == 0) {
      
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        this.header_name = "Mat. Selection - On Track Leads";
        this.overall_info_table = this.mat_sel_ontrack;
        this.total_page2 = this.mat_sel_ontrack.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        this.header_name = "Mat. Selection - Delayed(1-5 Days) Leads";
        this.overall_info_table = this.mat_sel_delaed15;
        this.total_page2 = this.mat_sel_delaed15.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        this.header_name = "Mat. Selection - Delayed(5-10 Days) Leads";
        this.overall_info_table = this.mat_sel_delaed510;
        this.total_page2 = this.mat_sel_delaed510.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        this.header_name = "Mat. Selection - Delayed(>10 Days) Leads";
        this.overall_info_table = this.mat_sel_delaed10;
        this.total_page2 = this.mat_sel_delaed10.length;
      }
    } else if (e.active[0]._index == 1) {
      
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        this.header_name = "QC Approval - On Track Leads";
        this.overall_info_table = this.qca_ontrack;
        this.total_page2 = this.qca_ontrack.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        this.header_name = "QC Approval - Delayed(1-5 Days) Leads";
        this.overall_info_table = this.qca_delaed15;
        this.total_page2 = this.qca_delaed15.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        this.header_name = "QC Approval - Delayed(5-10 Days) Leads";
        this.overall_info_table = this.qca_delaed510;
        this.total_page2 = this.qca_delaed510.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        this.header_name = "QC Approval - Delayed(>10 Days) Leads";
        this.overall_info_table = this.qca_delaed10;
        this.total_page2 = this.qca_delaed10.length;
      }
    } else if (e.active[0]._index == 2) {
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        this.header_name = "QC Submit - On Track Leads";
        this.overall_info_table = this.qc_ontrack;
        this.total_page2 = this.qc_ontrack.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        this.header_name = "QC Submit - Delayed(1-5 Days) Leads";
        this.overall_info_table = this.qc_delaed15;
        this.total_page2 = this.qc_delaed15.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        this.header_name = "QC Submit - Delayed(5-10 Days) Leads";
        this.overall_info_table = this.qc_delaed510;
        this.total_page2 = this.qc_delaed510.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        this.header_name = "QC Submit - Delayed(>10 Days) Leads";
        this.overall_info_table = this.qc_delaed10;
        this.total_page2 = this.qc_delaed10.length;
      }
    } else if (e.active[0]._index == 3) {
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        this.header_name = "Site Measurement - On Track Leads";
        this.overall_info_table = this.sm_ontrack;
        this.total_page2 = this.sm_ontrack.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        this.header_name = "Site Measurement - Delayed(1-5 Days) Leads";
        this.overall_info_table = this.sm_delaed15;
        this.total_page2 = this.sm_delaed15.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        this.header_name = "Site Measurement - Delayed(5-10 Days) Leads";
        this.overall_info_table = this.sm_delaed510;
        this.total_page2 = this.sm_delaed510.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        this.header_name = "Site Measurement - Delayed(>10 Days) Leads";
        this.overall_info_table = this.sm_delaed10;
        this.total_page2 = this.sm_delaed10.length;
      }
    } else if (e.active[0]._index == 4) {
      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 0) {
        this.header_name = "Site Validation - On Track Leads";
        this.overall_info_table = this.sl_ontrack;
        this.total_page2 = this.sl_ontrack.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 1) {
        this.header_name = "Site Validation - Delayed(1-5 Days) Leads";
        this.overall_info_table = this.sl_delaed15;
        this.total_page2 = this.sl_delaed15.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 2) {
        this.header_name = "Site Validation - Delayed(5-10 Days) Leads";
        this.overall_info_table = this.sl_delaed510;
        this.total_page2 = this.sl_delaed510.length;
      }

      if (e.active[0]._chart.getElementAtEvent(e.event)[0]._datasetIndex == 3) {
        this.header_name = "Site Validation - Delayed(>10 Days) Leads";
        this.overall_info_table = this.sl_delaed10;
        this.total_page2 = this.sl_delaed10.length;
      }
    }
    $("#onTrackModal").modal("show");
  }

  general_manager: any = [];
  getGMList() {
    // this.loaderService.display(true);
    this.leadService.getGMList(this.current_user_id).subscribe((res) => {
      this.general_manager = res.gms_list;
      // this.loaderService.display(false);
    });
  }

  public chartClicked2(e: any): void {
    this.boq_reference = false;
    if (e.active[0]._index == 0) {
      this.quotation_delayed = false;
      this.header_name = "Delayed By Cutomer Leads";
      this.overall_info_table =
        this.overall_lead_info.hold_data.hold_delayed_by_customer;
      this.total_page2 =
        this.overall_lead_info.hold_data.hold_delayed_by_customer.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
      // this.pageChanged(1);
    } else if (e.active[0]._index == 1) {
      this.quotation_delayed = false;
      this.header_name = "Delayed Possession";
      this.overall_info_table =
        this.overall_lead_info.hold_data.hold_delayed_possession;
      this.total_page2 =
        this.overall_lead_info.hold_data.hold_delayed_possession.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 2) {
      this.quotation_delayed = false;
      this.header_name = "Site Not Ready Leads";
      this.overall_info_table =
        this.overall_lead_info.hold_data.hold_site_not_ready_data;
      this.total_page2 =
        this.overall_lead_info.hold_data.hold_site_not_ready_data.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    } else if (e.active[0]._index == 3) {
      this.quotation_delayed = false;
      this.header_name = "WIP Leads";
      this.overall_info_table =
        this.overall_lead_info.hold_data.not_on_hold_data;
      this.total_page2 =
        this.overall_lead_info.hold_data.not_on_hold_data.length;
      this.current_page2 = 1;
      this.per_page2 = 10;
    }
    $("#onTrackModal").modal("show");
  }

  gms: any = "";
  onItemSelect(items) {
    if (items === undefined) {
      this.gms = "";
      // this.cms = ''
      // this.designerss = ''
      this.community_manager = [];
      this.designer = [];
    } else {
      this.gms = items;
      this.getCMList(this.gms);
    }
    this.show_confirm = false;
    this.getOverallperformance();
    this.getOverallOrderData();
    this.getSiteMeasurementData(1);
    this.getSiteValidationData();
    this.getCurrentWeekOrder();
    this.getPaymentStatus();
    this.getSpeedofobtooc();
    this.getTatinfodata(1);
  }

  cms: any = "";
  onItemSelect2(items) {
    if (items === undefined) {
      this.cms = "";
      // this.cms = ''
      // this.designerss = ''
      this.designer = [];
    } else {
      this.cms = items;
      this.getDesignerList(this.cms);
    }
    this.show_confirm = false;
    this.getOverallperformance();
    this.getOverallOrderData();
    this.getSiteMeasurementData(1);
    this.getSiteValidationData();
    this.getCurrentWeekOrder();
    this.getPaymentStatus();
    this.getSpeedofobtooc();
    this.getTatinfodata(1);
    // this.getNextweekOrder();
  }

  designerss: any = "";
  onItemSelect3(items) {
    if (items === undefined) {
      this.designerss = "";
      // this.cms = ''
      // this.designerss = ''
    } else {
      this.designerss = items;
    }
    this.show_confirm = false;
    this.getOverallperformance();
    this.getOverallOrderData();
    this.getSiteMeasurementData(1);
    this.getSiteValidationData();
    this.getCurrentWeekOrder();
    this.getPaymentStatus();
    this.getSpeedofobtooc();
    this.getTatinfodata(1);
    // this.getNextweekOrder();
  }
  Stores: any;
  onItemSelect4(items) {
    if (items === undefined) {
      this.Stores = "";
    } else {
      this.Stores = items;
    }
    this.show_confirm = false;
    this.getOverallperformance();
    this.getOverallOrderData();
    this.getSiteMeasurementData(1);
    this.getSiteValidationData();
    this.getCurrentWeekOrder();
    this.getPaymentStatus();
    this.getSpeedofobtooc();
    this.getTatinfodata(1);
  }

  designer;
  getDesignerList(id) {
    this.loaderService.display(true);
    this.leadService
      .getDesignerListNOC(this.current_user_id, id)
      .subscribe((res) => {
        this.designer = res.designers_list;
        this.loaderService.display(false);
      });
  }

  gmlist;
  community_manager;
  getCMList(id: any) {
    this.loaderService.display(true);
    this.gmlist = id;
    this.leadService
      .getCMList(this.current_user_id, this.gmlist)
      .subscribe((res) => {
        this.community_manager = res.cms_list;
        this.loaderService.display(false);
      });
  }

  from_date: any;
  to_date: any;

  date;
  delayed_data = "curr";
  select_prev(e: any) {
    if (e === "prev") {
      this.delayed_data = "prev";
      this.date = new Date();
      var prevMonthLastDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        0
      );
      var prevMonthFirstDate = new Date(
        this.date.getFullYear() - (this.date.getMonth() > 0 ? 0 : 1),
        (this.date.getMonth() - 1 + 12) % 12,
        1
      );
      this.from_date = prevMonthFirstDate;
      this.to_date = prevMonthLastDate;
      this.show_confirm = false;
      this.getOverallperformance();
      this.getOverallOrderData();
      this.getSiteMeasurementData(1);
      this.getSiteValidationData();
      this.getPaymentStatus();
      this.getCurrentWeekOrder();
      this.getTatinfodata(1);
      this.getSpeedofobtooc();
    }
    if (e === "curr") {
      this.delayed_data = "curr";
      this.from_date = "";
      this.to_date = "";
      this.show_confirm = false;
      this.getOverallperformance();
      this.getOverallOrderData();
      this.getSiteMeasurementData(1);
      this.getSiteValidationData();
      this.getPaymentStatus();
      this.getCurrentWeekOrder();
      this.getTatinfodata(1);
      this.getSpeedofobtooc();
    }
  }

  filterDashboard() {
    this.show_confirm = false;
    this.getOverallperformance();
    this.getOverallOrderData();
    this.getSiteMeasurementData(1);
    this.getSiteValidationData();
    this.getPaymentStatus();
    this.getCurrentWeekOrder();
    this.getTatinfodata(1);
    this.getSpeedofobtooc();
  }

  transform(value: string): string {
    return value.replace(/_/g, " ");
  }
  Store_dropdownList: any = [];
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
  gmfilteritem =''
  cmfilteritem =''
  desfilteritem =''
  storefilteritem =''
  clearfilter() {
    this.gmfilteritem='';
    this.cmfilteritem='';
    this.desfilteritem='';
    this.storefilteritem='';
     this.gms =''
      this.cms =''
      this.designerss ='' 
      this.Stores =''
      
     this.show_confirm = false;

     this.getOverallperformance();
     this.getOverallOrderData();
     this.getSiteMeasurementData(1);
     this.getSiteValidationData();
     this.getCurrentWeekOrder();
     this.getPaymentStatus();
     this.getSpeedofobtooc();
     this.getTatinfodata(1);

  }
}
