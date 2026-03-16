import { Component, OnInit } from "@angular/core";
import { CustomerService } from "../customer.service";
import { LoaderService } from "../../../../app/services/loader.service";
import "chart.piecelabel.js";
import { Chart } from "chart.js";
import { GeneralManagerService } from "app/platform/general-manager/general-manager.service";

declare var $: any;

@Component({
  selector: "app-ops-dashboard",
  templateUrl: "./ops-dashboard.component.html",
  styleUrls: ["./ops-dashboard.component.css"],
  providers: [CustomerService],
})
export class OpsDashboardComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    private LoaderService: LoaderService,
    private generalManagerService: GeneralManagerService
  ) {}

  baseUrl = "https://delta-uat.arrivae.com";
  public pieChartLabels1: string[] = [
    "40% Payment Received",
    "Production Details",
    "Raw Materials Received",
    "Production Status",
    "Service Status",
    "Installation & Handover",
  ];

  public pieChartLabels2: string[] = [
    "Overdue",
    "Deadline Approaching",
    "In Progress / Healthy",
    "Done",
  ];

  public doughnutChartDataSummary: number[];
  public doughnutChartData2 = [16, 16, 16, 16];
  public doughnutChartfortyPercent: number[];

  // Service Status chart data

  public doughnutChartServiceStatusStart: number[];
  public doughnutChartServiceStatusFifty: number[];
  public doughnutChartServiceStatusHundred: number[];

  public chartOptionsSummary: any = {
    legend: {
      display: false,
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        fontSize: "14",
      },
    },
    pieceLabel: {
      render: function (args) {
        return args.value + "\n" + "(" + args.percentage + "%)";
      },
      fontColor: "#000",
      fontSize: "8",
      segment: true,
    },
  };

  public doughnutChartType: string = "doughnut";
  public colors: Array<any> = [
    {
      backgroundColor: [
        "#26D7AE",
        "#C758D0",
        "#9C46D0",
        "#8E6CEF",
        "#007ED6",
        "#97D9FF",
      ],
    },
  ];

  public colors2: Array<any> = [
    {
      backgroundColor: ["#D60606", "#FFA400", "#E9CD09", "#0AAF10"],
    },
  ];
  role: any;
  ngOnInit() {
    this.getOpsData();
    this.getProductionDetails();
    this.getFortyPercent();
    this.getOpsServiceStatus("");
    this.getInstallationAndHandver("");
    this.getRawMaterial("");
    // this.current_page1 = 1;
    // this.per_page1 = 10;
    this.getFortyPercentTable("");
    this.getProductionModal("");
    this.getpanelStart("");
    this.getpanelDispatch("");
    this.getLfStart("");
    this.getLfDispatch("");
    this.getSelectStart("");
    this.getSelectDispatch("");

    this.role = localStorage.getItem("user");
    if (
      this.role == "city_gm" ||
      this.role == "business_head" ||
      this.role == "category_head" ||
      this.role == "category_panel" ||
      this.role == "category_services" ||
      this.role == "category_non_panel" || 
      this.role == 'deputy_general_manager'
    ) {
      this.getAllStores();
    }
    this.getallusers();
   
  }
  
cuSelect:boolean = false;
cudrop(){
  this.cuSelect = !this.cuSelect
}
  btn_string = "overdue";
  btn_material = "overdue";
  raw_material(e) {
    this.pageMaterial = 1;
    this.btn_material = e;
    if (e == "overdue") {
      this.material_stage_value = "raw_material_delay";
      this.getRawMaterial("");
    } else if (e == "done") {
      this.material_stage_value = "raw_material_done";
      this.DoneMaterial("");
    } else if (e == "progress") {
      this.material_stage_value = "raw_material_healthy";
      this.getRawMaterial("");
    } else if (e == "deadline") {
      this.material_stage_value = "raw_material_deadline_near";
      this.getRawMaterial("");
    }
  }

  get_ops_data;

  from_date;
  to_date;
  load_summary: boolean = false;
  Cmfilter:any;
  Gmfilter:any;
  Designerfilter:any;

  getOpsData() {
    this.load_summary = true;
    this.customerService
      .getOpsData(
        this.from_date,
        this.to_date,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.load_summary = false;
        this.get_ops_data = res;

        this.doughnutChartDataSummary = [
          this.get_ops_data.forty_per_pie_chart,
          this.get_ops_data.production_details_pie_chart,
          this.get_ops_data.raw_material_pie_chart,
          this.get_ops_data.product_status_pie_chart,
          this.get_ops_data.service_status_pie_chart,
          this.get_ops_data.handover_pie_chart,
        ];
        Chart.plugins.register({
          beforeDraw: function (chart) {
            if (chart.canvas.id == "chartSummary") {
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
  onItemSelect4(items) {
    if (items === undefined) {
      this.Stores = "";
    } else {
      this.Stores = items;
    }
    this.cmfilteritem =" "
    this.desfilteritem =" "
    this.Designerfilter ="";
    this.Cmfilter =""
     this.cmSel = "";
    this.getallusers();
    this.getOpsData();
    this.getProductionDetails();
    this.getFortyPercent();
    this.getOpsServiceStatus("");
    this.getInstallationAndHandver("");
    this.getRawMaterial("");
    this.getFortyPercentTable("");
    this.getProductionModal("");
    this.getpanelStart("");
    this.getpanelDispatch("");
    this.getLfStart("");
    this.getLfDispatch("");
    this.getSelectStart("");
    this.getSelectDispatch("");
  }

  filterSummary: any;
  typeSummary: any;
  summaryPage: any;
  summaryPerPage: any;
  summaryTotalItems: any;
  getSummaryDetails(e) {
    this.LoaderService.display(true);
    if (e !== undefined && e !== "") {
      this.summaryPage = e;
    }

    if (this.summaryPage == undefined) {
      this.summaryPage = 1;
    }

    if (this.summaryPerPage == undefined) {
      this.summaryPerPage = 10;
    }

    if (this.filterSummary == undefined) {
      this.filterSummary = "";
    }
    if (this.typeSummary == undefined) {
      this.typeSummary = "delay";
    }
    this.customerService
      .getSummaryDetails(
        this.from_date,
        this.to_date,
        this.filterSummary,
        this.typeSummary,
        this.summaryPage,
        this.summaryPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.summaryPage = res.page_number;
        this.summaryPerPage = 10;
        this.summaryTotalItems = res.count;
        if (this.typeSummary == "delay") {
          this.overall_table_data = res.delay_leads;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data = res.healthy_leads;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data = res.deadline_leads;
        }
      });
  }
  production_details;
  getProductionDetails() {
    this.LoaderService.display(true);
    this.customerService
      .getProductionDetails(
        this.from_date,
        this.to_date,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.production_details = res;
      });
  }

  productionstage: any;
  productioncurrentpage: any;
  productionperpage: any;
  ProductionDetailModal: any;
  ProductionTotalItems: any;
  getProductionModal(e) {
    if (e !== undefined && e !== "") {
      this.productioncurrentpage = e;
    }

    if (this.productioncurrentpage == undefined) {
      this.productioncurrentpage = 1;
    }

    if (this.productionperpage == undefined) {
      this.productionperpage = 10;
    }

    if (this.productionstage == undefined) {
      this.productionstage = "production_details_delay";
    }

    if (this.servicetype == undefined) {
      this.servicetype = "service";
    }

    this.LoaderService.display(true);
    this.customerService
      .getProductionModal(
        this.productionstage,
        this.servicetype,
        this.productioncurrentpage,
        this.productionperpage,
        this.from_date,
        this.to_date,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.ProductionDetailModal = res;
        this.overall_table_data = res.boqs;
        this.productioncurrentpage = res.page_number;
        this.productionperpage = 10;
        this.ProductionTotalItems = res.boq_count;
      });
  }
  poId: any;
  allPos: any;
  allPosPerPage: any;
  PosItems: any;
  PoPage: any;
  getAllPos(e) {
    if (e !== undefined && e !== "") {
      this.PoPage = e;
    }
    if (this.PoPage == undefined) {
      this.PoPage = 1;
    }

    if (this.allPosPerPage == undefined) {
      this.allPosPerPage = 5;
    }

    this.customerService
      .getAllPos(this.poId, this.PoPage, this.allPosPerPage)
      .subscribe((res) => {
        this.allPos = res.purchase_orders;
        this.PoPage = res.page_number;
        this.allPosPerPage = 5;
        this.PosItems = res.count;
      });
  }
  row = [""];
  expansion: any;
  toggleRow(po, i) {
    this.PoPage = 1;

    if (this.row[0] !== po) {
      this.expansion = po;
      this.row[0] = po;
      this.poId = po;
      this.getAllPos("");
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
  }

  serviceStatus: any;
  load_status: boolean = false;
  serviceCurrentPage: any;
  servicePerPage: any;
  serviceTotalItems: any;
  PieType: any;
  serviceFilter: any;
  getOpsServiceStatus(e) {
    if (e !== undefined && e !== "") {
      this.serviceCurrentPage = e;
    }
    if (this.serviceCurrentPage == undefined) {
      this.serviceCurrentPage = 1;
    }
    if (this.servicePerPage == undefined) {
      this.servicePerPage = 10;
    }
    if (this.PieType == undefined) {
      this.PieType = "";
    }
    if (this.serviceFilter == undefined) {
      this.serviceFilter = "";
    }
    this.LoaderService.display(true);
    this.customerService
      .opsServiceStatus(
        this.from_date,
        this.to_date,
        this.PieType,
        this.serviceFilter,
        this.serviceCurrentPage,
        this.servicePerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.serviceStatus = res;
        this.doughnutChartServiceStatusStart = [
          this.serviceStatus.Service_start_status[0].service_start_status_delay,
          this.serviceStatus.Service_start_status[2]
            .service_start_status_deadline_near,
          this.serviceStatus.Service_start_status[1]
            .service_start_status_healthy,
          this.serviceStatus.Service_start_status[3].service_start_status_done,
        ];
        (this.doughnutChartServiceStatusFifty = [
          this.serviceStatus.Service_50_status[0].service_50_status_delay,
          this.serviceStatus.Service_50_status[2]
            .service_50_status_deadline_near,
          this.serviceStatus.Service_50_status[1].service_50_status_healthy,
          this.serviceStatus.Service_50_status[3].service_50_status_done,
        ]),
          (this.doughnutChartServiceStatusHundred = [
            this.serviceStatus.Service_status[0].service_status_delay,
            this.serviceStatus.Service_status[2].service_status_deadline_near,
            this.serviceStatus.Service_status[1].service_status_healthy,
            this.serviceStatus.Service_status[3].service_status_done,
          ]);
        if (this.PieType == "delay" && this.serviceFilter == "service_start") {
          this.overall_table_data =
            this.serviceStatus.service_start_delay_leads;
          this.leadCount =
            this.serviceStatus.Service_start_status[0].service_start_status_delay;
          this.boq_count_service_status =
            this.serviceStatus.Service_start_status[0].count;
          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "deadline" &&
          this.serviceFilter == "service_start"
        ) {
          this.overall_table_data =
            this.serviceStatus.service_start_deadline_leads;
          this.leadCount =
            this.serviceStatus.Service_start_status[2].service_start_status_deadline_near;
          this.boq_count_service_status =
            this.serviceStatus.Service_start_status[2].count;
          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "healthy" &&
          this.serviceFilter == "service_start"
        ) {
          this.overall_table_data =
            this.serviceStatus.service_start_healthy_leads;
          (this.leadCount =
            this.serviceStatus.Service_start_status[1].service_start_status_healthy),
            (this.boq_count_service_status =
              this.serviceStatus.Service_start_status[1].count);
          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "done" &&
          this.serviceFilter == "service_start"
        ) {
          this.overall_table_data = this.serviceStatus.service_start_done_leads;
          this.leadCount =
            this.serviceStatus.Service_start_status[3].service_start_status_done;
          this.boq_count_service_status =
            this.serviceStatus.Service_start_status[3].count;
          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        }

        if (this.PieType == "delay" && this.serviceFilter == "service_50") {
          this.overall_table_data = this.serviceStatus.service_50_delay_leads;
          this.boq_count_service_status =
            this.serviceStatus.Service_50_status[0].count;
          (this.leadCount =
            this.serviceStatus.Service_50_status[0].service_50_status_delay),
            (this.serviceTotalItems = res.count);
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "deadline" &&
          this.serviceFilter == "service_50"
        ) {
          this.overall_table_data =
            this.serviceStatus.service_50_deadline_leads;
          this.boq_count_service_status =
            this.serviceStatus.Service_50_status[2].count;
          (this.leadCount =
            this.serviceStatus.Service_50_status[2].service_50_status_deadline_near),
            (this.serviceTotalItems = res.count);
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "healthy" &&
          this.serviceFilter == "service_50"
        ) {
          this.overall_table_data = this.serviceStatus.service_50_healthy_leads;
          this.boq_count_service_status =
            this.serviceStatus.Service_50_status[1].count;
          (this.leadCount =
            this.serviceStatus.Service_50_status[1].service_50_status_healthy),
            (this.serviceTotalItems = res.count);
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "done" &&
          this.serviceFilter == "service_50"
        ) {
          this.overall_table_data = this.serviceStatus.service_50_done_leads;
          this.boq_count_service_status =
            this.serviceStatus.Service_50_status[3].count;
          (this.leadCount =
            this.serviceStatus.Service_50_status[3].service_50_status_done),
            (this.serviceTotalItems = res.count);
          this.serviceCurrentPage = res.page_number;
        }

        if (this.PieType == "delay" && this.serviceFilter == "site_readiness") {
          this.overall_table_data = this.serviceStatus.service_delay_leads;
          (this.boq_count_service_status =
            this.serviceStatus.Service_status[0].count),
            (this.leadCount =
              this.serviceStatus.Service_status[0].service_status_delay);

          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "deadline" &&
          this.serviceFilter == "site_readiness"
        ) {
          this.overall_table_data = this.serviceStatus.service_deadline_leads;
          this.leadCount =
            this.serviceStatus.Service_status[2].service_status_deadline_near;
          (this.boq_count_service_status =
            this.serviceStatus.Service_status[2].count),
            (this.serviceTotalItems = res.count);
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "healthy" &&
          this.serviceFilter == "site_readiness"
        ) {
          this.overall_table_data = this.serviceStatus.service_healthy_leads;
          (this.boq_count_service_status =
            this.serviceStatus.Service_status[1].count),
            (this.leadCount =
              this.serviceStatus.Service_status[1].service_status_healthy);

          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        } else if (
          this.PieType == "done" &&
          this.serviceFilter == "site_readiness"
        ) {
          this.overall_table_data = this.serviceStatus.service_done_leads;
          (this.boq_count_service_status =
            this.serviceStatus.Service_status[3].count),
            (this.leadCount =
              this.serviceStatus.Service_status[3].service_status_done);

          this.serviceTotalItems = res.count;
          this.serviceCurrentPage = res.page_number;
        }
      });
  }

  forty_percent: any;
  table_data_forty: any;
  getFortyPercent() {
    this.LoaderService.display(true);
    this.customerService
      .getFortyPercent(
        this.from_date,
        this.to_date,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.forty_percent = res.Push_to_Production_Chart;
        this.doughnutChartfortyPercent = [
          this.forty_percent[0].forty_per_delay,
          this.forty_percent[2].forty_per_deadline_near,
          this.forty_percent[1].forty_per_healthy,
          this.forty_percent[3].forty_per_done,
        ];
        Chart.plugins.register({
          beforeDraw: function (chart) {
            if (chart.canvas.id == "forty_percent") {
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

  fortyPercent: any;
  Lead_Boq_Count: any;
  btnvalue: any;
  servicetype: any;
  page: any;
  perpage: any;
  totalitems: any;

  getFortyPercentTable(e) {
    if (e !== undefined && e !== "") {
      this.page = e;
    }
    if (this.page == undefined) {
      this.page = 1;
    }

    if (this.perpage == undefined) {
      this.perpage = 5;
    }
    if (this.btnvalue == undefined) {
      this.btnvalue = "forty_per_delay";
    }

    if (this.servicetype == undefined) {
      this.servicetype = "service";
    }
    this.LoaderService.display(true);
    this.customerService
      .getFortyPercentTable(
        this.from_date,
        this.to_date,
        this.btnvalue,
        this.servicetype,
        this.page,
        this.perpage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.Lead_Boq_Count = res;
        this.fortyPercent = res.boqs;
        this.page = res.page_number;
        this.perpage = 5;
        this.totalitems = res.boq_count;
      });
  }

  pageMaterial: any;
  perPageMaterial: any;
  totalItemMateial: any;
  material_stage_value: any;
  MaterialData: any;
  countMaterial: any;
  getRawMaterial(e) {
    if (e !== undefined && e !== "") {
      this.pageMaterial = e;
    }
    if (this.pageMaterial == undefined) {
      this.pageMaterial = 1;
    }

    if (this.perPageMaterial == undefined) {
      this.perPageMaterial = 5;
    }
    if (this.material_stage_value == undefined) {
      this.material_stage_value = "raw_material_delay";
    }

    this.LoaderService.display(true);
    this.customerService
      .getRawMaterial(
        this.material_stage_value,
        this.pageMaterial,
        this.perPageMaterial,
        this.from_date,
        this.to_date,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.countMaterial = res;
        this.MaterialData = res.purchase_orders;
        this.pageMaterial = res.page_number;
        this.perPageMaterial = 5;
        this.totalItemMateial = res.count;
      });
  }

  DoneMaterial(e) {
    if (e !== undefined && e !== "") {
      this.pageMaterial = e;
    }
    if (this.pageMaterial == undefined) {
      this.pageMaterial = 1;
    }

    if (this.perPageMaterial == undefined) {
      this.perPageMaterial = 5;
    }
    this.LoaderService.display(true);
    this.customerService
      .raw_material_done(
        this.material_stage_value,
        this.pageMaterial,
        this.perPageMaterial,
        this.from_date,
        this.to_date,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.countMaterial = res;
        this.MaterialData = res.purchase_orders;
        this.pageMaterial = res.page_number;
        this.perPageMaterial = 5;
        this.totalItemMateial = res.count;
      });
  }

  installationHandover: any;
  handoverPage: any;
  handoverPerPage: any;
  handoverType: any;
  totalhandoverItems: any;
  getInstallationAndHandver(e) {
    this.LoaderService.display(true);
    if (e !== undefined && e !== "") {
      this.handoverPage = e;
    }

    if (this.handoverPage == undefined) {
      this.handoverPage = 1;
    }

    if (this.handoverPerPage == undefined) {
      this.handoverPerPage = 10;
    }

    if (this.handoverType == undefined) {
      this.handoverType = "";
    }

    this.customerService
      .getInstallationAndHandover(
        this.from_date,
        this.to_date,
        this.handoverPage,
        this.handoverPerPage,
        this.handoverType,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.installationHandover = res;
        this.totalhandoverItems = res.count;
        this.handoverPerPage = 10;
        this.handoverPage = res.page_number;
        if (this.handoverType == "delay") {
          this.overall_table_data = res.delay_leads;
        } else if (this.handoverType == "deadline") {
          this.overall_table_data = res.deadline_leads;
        } else if (this.handoverType == "healthy") {
          this.overall_table_data = res.healthy_leads;
        } else if (this.handoverType == "done") {
          this.overall_table_data = res.done_leads;
        }
      });
  }

  forty_Percent_Chart(e: any) {
    this.btn_service = "service";
    this.servicetype = "service";
    if (e.active[0]._index == 0) {
      this.btn_string = "overdue";
      this.btnvalue = "forty_per_delay";
    } else if (e.active[0]._index == 1) {
      this.btn_string = "deadline";
      this.btnvalue = "forty_per_deadline_near";
    } else if (e.active[0]._index == 2) {
      this.btn_string = "progress";
      this.btnvalue = "forty_per_healthy";
    } else if (e.active[0]._index == 3) {
      this.btn_string = "done";
      this.btnvalue = "forty_per_done";
    }
    this.getFortyPercentTable("");
  }

  select_btn(e) {
    this.adding_data_service = false;
    this.page = 1;
    this.btn_service = "service";
    this.servicetype = "service";
    this.btn_string = e;
    if (e == "overdue") {
      this.btnvalue = "forty_per_delay";
    } else if (e == "done") {
      this.adding_data_service = true;
      this.btnvalue = "forty_per_done";
    } else if (e == "progress") {
      this.btnvalue = "forty_per_healthy";
    } else if (e == "deadline") {
      this.btnvalue = "forty_per_deadline_near";
    }
    this.getFortyPercentTable("");
  }
  btn_service = "service";
  service_btn(e) {
    this.page = 1;
    this.btn_service = e;
    if (this.btn_service == "service") {
      this.servicetype = "service";
      this.getFortyPercentTable("");
    } else if (this.btn_service == "non_service") {
      this.servicetype = "non_service";
      this.getFortyPercentTable("");
    }
  }
  productionService: any;
  service_production(e) {
    this.productioncurrentpage = 1;
    this.productionService = e;
    if (this.productionService == "service") {
      this.servicetype = "service";
      this.getProductionModal("");
    } else if (this.productionService == "non_service") {
      this.servicetype = "non_service";
      this.getProductionModal("");
    }
  }

  overall_table_data: any;
  current_milestone: any;
  current_page1: any;
  total_page1: any;
  per_page1: any = 10;

  heading: any;
  color: any;
  leadCount: any;
  summary_modal(event, delayparam, heading, leadCount) {
    this.filterSummary = event;
    this.summaryPage = 1;
    this.adding_data_service = false;
    this.for_boq = false;
    this.heading = heading;
    this.typeSummary = delayparam;
    if (
      (event =
        "forty_percent_payment_mapped_data" ||
        "po_release_date_data" ||
        "raw_material_data" ||
        "loose_furniture_dispatch_data" ||
        "service_per_100_data" ||
        "project_handover_data")
    ) {
      this.leadCount = leadCount;
    }
    this.getSummaryDetails("");
    $("#summaryModal").modal("show");
  }

  installation_modal(num, heading) {
    this.handoverPage = 1;
    this.adding_data_service = false;
    this.for_boq = false;
    this.heading = heading;
    this.handoverType = num;
    if (num == "delay") {
      this.leadCount =
        this.installationHandover.Installation_and_handover[0].handover_delay;
      this.boq_count_service_status =
        this.installationHandover.Installation_and_handover[0].count;
    } else if (num == "deadline") {
      this.leadCount =
        this.installationHandover.Installation_and_handover[2].handover_deadline_near;
      this.boq_count_service_status =
        this.installationHandover.Installation_and_handover[2].count;
    } else if (num == "healthy") {
      this.leadCount =
        this.installationHandover.Installation_and_handover[1].handover_healthy;
      this.boq_count_service_status =
        this.installationHandover.Installation_and_handover[1].count;
    } else if (num == "done") {
      this.leadCount =
        this.installationHandover.Installation_and_handover[3].handover_done;
      this.boq_count_service_status =
        this.installationHandover.Installation_and_handover[3].count;
      this.adding_data_service = true;
    }
    this.getInstallationAndHandver("");
    $("#Installa_modal").modal("show");
  }

  for_boq: boolean = false;
  productionStatusType: any;
  modalServiceStatus(delayparam, heading, productionType) {
    this.productionStatusType = productionType;
    this.fhiPage = 1;
    this.adding_data_service = false;
    this.currentMileStone = false;
    this.for_boq = true;
    this.heading = heading;
    this.typeSummary = delayparam;
    if (delayparam == "done") {
      this.adding_data_service = true;
    }
    if (this.productionStatusType == "panelstart") {
      this.getpanelStart("");
    } else if (this.productionStatusType == "lfstart") {
      this.getLfStart("");
    } else if (this.productionStatusType == "selectstart") {
      this.getSelectStart("");
    } else if (this.productionStatusType == "paneldispatch") {
      this.getpanelDispatch("");
    } else if (this.productionStatusType == "lfdispatch") {
      this.getLfDispatch("");
    } else if (this.productionStatusType == "selectdispatch") {
      this.getSelectDispatch("");
    }
    $("#onTrackModal").modal("show");
  }

  hide_toggle: any;
  summary_modal_production_details(stage, e) {
    if (stage == "production_details_done") {
      this.hide_toggle = true;
    } else {
      this.hide_toggle = false;
    }
    this.productionService = "service";
    this.servicetype = "service";
    this.productioncurrentpage = 1;
    this.productionstage = stage;
    this.heading = e;
    this.getProductionModal("");
    $("#production_detail_modal").modal("show");
  }

  panelStart: any;
  fhiPage: any;
  fhiPerPage: any;
  fhiTotalItems: any;
  getpanelStart(e) {
    if (e !== undefined && e !== "") {
      this.fhiPage = e;
    }
    if (this.fhiPage == undefined) {
      this.fhiPage = 1;
    }
    if (this.fhiPerPage == undefined) {
      this.fhiPerPage = 10;
    }
    if (this.typeSummary == undefined) {
      this.typeSummary = "";
    }
    this.LoaderService.display(true);
    this.customerService
      .getpanelStart(
        this.from_date,
        this.to_date,
        this.typeSummary,
        this.fhiPage,
        this.fhiPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.panelStart = res;
        this.fhiPerPage = 10;
        if (this.typeSummary == "delay") {
          this.overall_table_data = res.panel_start_delay_card_leads;
          this.leadCount = res.panel_start_data[0].panel_start_delay;
          this.boq_count_service_status = res.panel_start_data[0].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data = res.panel_start_deadline_card_leads;
          this.leadCount = res.panel_start_data[2].panel_start_deadline_near;
          this.boq_count_service_status = res.panel_start_data[2].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data = res.panel_start_healthy_card_leads;
          this.leadCount = res.panel_start_data[1].panel_start_healthy;
          this.boq_count_service_status = res.panel_start_data[1].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "done") {
          this.overall_table_data = res.panel_start_done_card_leads;
          this.leadCount = res.panel_start_data[3].panel_start_done;
          this.boq_count_service_status = res.panel_start_data[3].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        }
      });
  }

  panelDispatch: any;
  getpanelDispatch(e) {
    if (e !== undefined && e !== "") {
      this.fhiPage = e;
    }
    if (this.fhiPage == undefined) {
      this.fhiPage = 1;
    }
    if (this.fhiPerPage == undefined) {
      this.fhiPerPage = 10;
    }
    if (this.typeSummary == undefined) {
      this.typeSummary = "";
    }
    this.LoaderService.display(true);
    this.customerService
      .getpanelDispatch(
        this.from_date,
        this.to_date,
        this.typeSummary,
        this.fhiPage,
        this.fhiPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.panelDispatch = res;
        this.fhiPerPage = 10;
        if (this.typeSummary == "delay") {
          this.overall_table_data = res.panel_dispatch_delay_card_leads;
          this.leadCount = res.panel_dispatch_data[0].panel_dispatch_delay;
          this.boq_count_service_status = res.panel_dispatch_data[0].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data = res.panel_dispatch_deadline_card_leads;
          this.leadCount =
            res.panel_dispatch_data[2].panel_dispatch_deadline_near;
          this.boq_count_service_status = res.panel_dispatch_data[2].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data = res.panel_dispatch_healthy_card_leads;
          this.leadCount = res.panel_dispatch_data[1].panel_dispatch_healthy;
          this.boq_count_service_status = res.panel_dispatch_data[1].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "done") {
          this.overall_table_data = res.panel_dispatch_done_card_leads;
          this.leadCount = res.panel_dispatch_data[3].panel_dispatch_done;
          this.boq_count_service_status = res.panel_dispatch_data[3].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        }
      });
  }

  LFStart: any;
  getLfStart(e) {
    if (e !== undefined && e !== "") {
      this.fhiPage = e;
    }
    if (this.fhiPage == undefined) {
      this.fhiPage = 1;
    }
    if (this.fhiPerPage == undefined) {
      this.fhiPerPage = 10;
    }

    if (this.typeSummary == undefined) {
      this.typeSummary = "";
    }

    this.LoaderService.display(true);
    this.customerService
      .getLFStart(
        this.from_date,
        this.to_date,
        this.typeSummary,
        this.fhiPage,
        this.fhiPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.LFStart = res;
        this.fhiPerPage = 10;
        if (this.typeSummary == "delay") {
          this.overall_table_data = res.loose_furniture_start_delay_card_leads;
          this.leadCount =
            res.loose_furniture_start_data[0].loose_furniture_start_delay;
          this.boq_count_service_status =
            res.loose_furniture_start_data[0].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data =
            res.loose_furniture_start_deadline_card_leads;
          this.leadCount =
            res.loose_furniture_start_data[2].loose_furniture_start_deadline_near;
          this.boq_count_service_status =
            res.loose_furniture_start_data[2].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data =
            res.loose_furniture_start_healthy_card_leads;
          this.leadCount =
            res.loose_furniture_start_data[1].loose_furniture_start_healthy;
          this.boq_count_service_status =
            res.loose_furniture_start_data[1].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "done") {
          this.overall_table_data = res.loose_furniture_start_done_card_leads;
          this.leadCount =
            res.loose_furniture_start_data[3].loose_furniture_start_done;
          this.boq_count_service_status =
            res.loose_furniture_start_data[3].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        }
      });
  }
  LFDispatch: any;
  getLfDispatch(e) {
    if (e !== undefined && e !== "") {
      this.fhiPage = e;
    }
    if (this.fhiPage == undefined) {
      this.fhiPage = 1;
    }
    if (this.fhiPerPage == undefined) {
      this.fhiPerPage = 10;
    }
    if (this.typeSummary == undefined) {
      this.typeSummary = "";
    }
    this.LoaderService.display(true);
    this.customerService
      .getLFDispatch(
        this.from_date,
        this.to_date,
        this.typeSummary,
        this.fhiPage,
        this.fhiPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.LFDispatch = res;
        this.fhiPerPage = 10;
        if (this.typeSummary == "delay") {
          this.overall_table_data =
            res.loose_furniture_dispatch_delay_card_leads;
          this.leadCount =
            res.loose_furniture_dispatch_data[0].loose_furniture_dispatch_delay;
          this.boq_count_service_status =
            res.loose_furniture_dispatch_data[0].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data =
            res.loose_furniture_dispatch_deadline_card_leads;
          this.leadCount =
            res.loose_furniture_dispatch_data[2].loose_furniture_dispatch_deadline_near;
          this.boq_count_service_status =
            res.loose_furniture_dispatch_data[2].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data =
            res.loose_furniture_dispatch_healthy_card_leads;
          this.leadCount =
            res.loose_furniture_dispatch_data[1].loose_furniture_dispatch_healthy;
          this.boq_count_service_status =
            res.loose_furniture_dispatch_data[1].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "done") {
          this.overall_table_data =
            res.loose_furniture_dispatch_done_card_leads;
          this.leadCount =
            res.loose_furniture_dispatch_data[3].loose_furniture_dispatch_done;
          this.boq_count_service_status =
            res.loose_furniture_dispatch_data[3].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        }
      });
  }

  selectStart: any;
  getSelectStart(e) {
    if (e !== undefined && e !== "") {
      this.fhiPage = e;
    }
    if (this.fhiPage == undefined) {
      this.fhiPage = 1;
    }
    if (this.fhiPerPage == undefined) {
      this.fhiPerPage = 10;
    }
    if (this.typeSummary == undefined) {
      this.typeSummary = "";
    }
    this.LoaderService.display(true);
    this.customerService
      .getSelectStart(
        this.from_date,
        this.to_date,
        this.typeSummary,
        this.fhiPage,
        this.fhiPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.selectStart = res;
        this.fhiPerPage = 10;
        if (this.typeSummary == "delay") {
          this.overall_table_data = res.select_start_delay_card_leads;
          this.leadCount = res.select_start_data[0].select_start_delay;
          this.boq_count_service_status = res.select_start_data[0].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data = res.select_start_deadline_card_leads;
          this.leadCount = res.select_start_data[2].select_start_deadline_near;
          this.boq_count_service_status = res.select_start_data[2].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data = res.select_start_healthy_card_leads;
          this.leadCount = res.select_start_data[1].select_start_healthy;
          this.boq_count_service_status = res.select_start_data[1].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "done") {
          this.overall_table_data = res.select_start_done_card_leads;
          this.leadCount = res.select_start_data[3].select_start_done;
          this.boq_count_service_status = res.select_start_data[3].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        }
      });
  }
  selectDispatch: any;
  getSelectDispatch(e) {
    if (e !== undefined && e !== "") {
      this.fhiPage = e;
    }
    if (this.fhiPage == undefined) {
      this.fhiPage = 1;
    }
    if (this.fhiPerPage == undefined) {
      this.fhiPerPage = 10;
    }
    if (this.typeSummary == undefined) {
      this.typeSummary = "";
    }
    this.LoaderService.display(true);
    this.customerService
      .getSelectDispatch(
        this.from_date,
        this.to_date,
        this.typeSummary,
        this.fhiPage,
        this.fhiPerPage,
        this.Stores,
        this.Gmfilter,
        this.Cmfilter,
        this.Designerfilter
      )
      .subscribe((res) => {
        this.LoaderService.display(false);
        this.selectDispatch = res;
        this.fhiPerPage = 10;
        if (this.typeSummary == "delay") {
          this.overall_table_data = res.non_panel_dispatch_delay_card_leads;
          this.leadCount =
            res.non_panel_dispatch_data[0].non_panel_dispatch_delay;
          this.boq_count_service_status = res.non_panel_dispatch_data[0].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "deadline") {
          this.overall_table_data = res.non_panel_dispatch_deadline_card_leads;
          this.leadCount =
            res.non_panel_dispatch_data[2].non_panel_dispatch_deadline_near;
          this.boq_count_service_status = res.non_panel_dispatch_data[2].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "healthy") {
          this.overall_table_data = res.non_panel_dispatch_healthy_card_leads;
          this.leadCount =
            res.non_panel_dispatch_data[1].non_panel_dispatch_healthy;
          this.boq_count_service_status = res.non_panel_dispatch_data[1].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        } else if (this.typeSummary == "done") {
          this.overall_table_data = res.non_panel_dispatch_done_card_leads;
          this.leadCount =
            res.non_panel_dispatch_data[3].non_panel_dispatch_done;
          this.boq_count_service_status = res.non_panel_dispatch_data[3].count;
          this.fhiTotalItems = this.boq_count_service_status;
          this.fhiPage = res.page_number;
        }
      });
  }

  adding_data_service: boolean = false;
  currentMileStone: boolean = false;
  boq_count_service_status: any;
  service_third_chart(e: any) {
    this.serviceCurrentPage = 1;
    this.currentMileStone = true;
    this.adding_data_service = false;
    this.serviceFilter = "site_readiness";
    if (e.active[0]._index == 0) {
      this.PieType = "delay";
      this.heading = "Service Readiness-Overdue";
    } else if (e.active[0]._index == 1) {
      this.PieType = "deadline";
      this.heading = "Service Readiness-In Deadline";
    } else if (e.active[0]._index == 2) {
      this.PieType = "healthy";
      this.heading = "Service Readiness-In Progress";
    } else if (e.active[0]._index == 3) {
      this.PieType = "done";
      this.adding_data_service = true;
      this.heading = "Service Readiness-Done";
    }
    this.getOpsServiceStatus("");
    $("#serviceStatusModal").modal("show");
  }
  service_start_chart(e: any) {
    
    this.serviceCurrentPage = 1;
    this.adding_data_service = false;
    this.currentMileStone = true;
    this.serviceFilter = "service_start";
    if (e.active[0]._index == 0) {
      this.heading = "Service Start-Overdue";
      this.PieType = "delay";
    } else if (e.active[0]._index == 1) {
      this.heading = "Service Start-In Deadline";
      this.PieType = "deadline";
    } else if (e.active[0]._index == 2) {
      this.heading = "Service Start-In Progress";
      this.PieType = "healthy";
    } else if (e.active[0]._index == 3) {
      this.adding_data_service = true;
      this.heading = "Service Start-Done";
      this.PieType = "done";
    }
    this.getOpsServiceStatus("");
    $("#serviceStatusModal").modal("show");
  }
  service_fifty_chart(e: any) {
    
    this.serviceCurrentPage = 1;
    this.currentMileStone = true;
    this.adding_data_service = false;
    this.serviceFilter = "service_50";
    if (e.active[0]._index == 0) {
      this.PieType = "delay";
      this.heading = "Service 50%-Overdue";
    } else if (e.active[0]._index == 1) {
      this.PieType = "deadline";
      this.heading = "Service 50%-In Deadline";
    } else if (e.active[0]._index == 2) {
      this.PieType = "healthy";
      this.heading = "Service 50%-In Progress";
    } else if (e.active[0]._index == 3) {
      this.adding_data_service = true;
      this.PieType = "done";
      this.heading = "Service 50%-Done";
    }
    this.getOpsServiceStatus("");
    $("#serviceStatusModal").modal("show");
  }

  openpopup(event) {
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

  date;
  delayed_data = "curr";
  show_confirm: boolean = false;

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
      this.getOpsData();
      this.getFortyPercent();
      this.getProductionDetails();
      this.getOpsServiceStatus("");
      this.getFortyPercentTable(1);
      this.getInstallationAndHandver("");
      this.getRawMaterial(1);
      this.getProductionModal("");
      this.getpanelStart("");
      this.getpanelDispatch("");
      this.getLfStart("");
      this.getLfDispatch("");
      this.getSelectStart("");
      this.getSelectDispatch("");
      this.DoneMaterial("");
    }
    if (e === "curr") {
      this.delayed_data = "curr";
      this.from_date = "";
      this.to_date = "";
      this.show_confirm = false;
      this.getOpsData();
      this.getFortyPercent();
      this.getProductionDetails();
      this.getOpsServiceStatus("");
      this.getFortyPercentTable(1);
      this.getInstallationAndHandver("");
      this.getRawMaterial(1);
      this.getProductionModal("");
      this.getpanelStart("");
      this.getpanelDispatch("");
      this.getLfStart("");
      this.getLfDispatch("");
      this.getSelectStart("");
      this.getSelectDispatch("");
      this.DoneMaterial("");
    }
  }
  filterDashboard() {
  
      this.getOpsData();
      this.getFortyPercent();
      this.getProductionDetails();
      this.getOpsServiceStatus("");
      this.getFortyPercentTable(1);
      this.getInstallationAndHandver("");
      this.getRawMaterial(1);
      this.getProductionModal("");
      this.getpanelStart("");
      this.getpanelDispatch("");
      this.getLfStart("");
      this.getLfDispatch("");
      this.getSelectStart("");
      this.getSelectDispatch("");
      this.DoneMaterial("");
    
  
  }
  selectedStores: any = [];
  Stores: any;
  ClearStoreFilter() {
    this.selectedStores = [];
    this.Stores = [];
  }
  Store_dropdownList: any;
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
  general_manager: any=[]
  community_manager: any=[]
  designer: any=[];
  gmSel:any;
  cmSel:any
  getallusers() {
    this.generalManagerService.getAllusers2(this.gmSel,this.cmSel).subscribe((res) => {
      this.general_manager = res.gms;
      this.community_manager = res.cms;
      this.designer = res.designers;
      console.log(this.general_manager);
    },err=>{
      this.general_manager=[];
       this.community_manager=[];
       this.designer=[];

    });
  }
  onItemSelect1(e) {
this.gmSel = e;
 this.cmfilteritem =" ";
 this.community_manager =[]
  this.Cmfilter ="" ;
  this.cmSel=""
  this.Designerfilter ="";
  this.desfilteritem = " ";
this.getallusers()
  this.Gmfilter = e
  this.getOpsData();
  this.getProductionDetails();
  this.getFortyPercent();
  this.getOpsServiceStatus("");
  this.getInstallationAndHandver("");
  this.getRawMaterial("");
  
  this.getFortyPercentTable("");
  this.getProductionModal("");
  this.getpanelStart("");
  this.getpanelDispatch("");
  this.getLfStart("");
  this.getLfDispatch("");
  this.getSelectStart("");
  this.getSelectDispatch("");
  }
  onItemSelect2(e) {
     if (e ==" "){
       e =""
     } 
     this.cmSel = e;
    this.desfilteritem= " ";
     this.Designerfilter =" "
    this.getallusers()
  this.Cmfilter = e;
 
  this.getOpsData();
  this.getProductionDetails();
  this.getFortyPercent();
  this.getOpsServiceStatus("");
  this.getInstallationAndHandver("");
  this.getRawMaterial("");
 
  this.getFortyPercentTable("");
  this.getProductionModal("");
  this.getpanelStart("");
  this.getpanelDispatch("");
  this.getLfStart("");
  this.getLfDispatch("");
  this.getSelectStart("");
  this.getSelectDispatch("");
  }
  onItemSelect3(e) {
     if (e == " ") {
       e = "";
     } 
   this.Designerfilter = e;
   this.getOpsData();
   this.getProductionDetails();
   this.getFortyPercent();
   this.getOpsServiceStatus("");
   this.getInstallationAndHandver("");
   this.getRawMaterial("");
  
   this.getFortyPercentTable("");
   this.getProductionModal("");
   this.getpanelStart("");
   this.getpanelDispatch("");
   this.getLfStart("");
   this.getLfDispatch("");
   this.getSelectStart("");
   this.getSelectDispatch("");
  }
  gmfilteritem =''
  cmfilteritem =" "
  desfilteritem =" "
  storefilteritem =''
  clearfilter() {
    this.gmfilteritem='';
    this.cmfilteritem=" ";
    this.desfilteritem=" ";
    this.storefilteritem='';
    this.Gmfilter ='';
     this.Designerfilter="";
     this.Cmfilter='';
     this.gmSel ="";
     this.cmSel =""
      this.Stores=''
      this.selectedBtn = "Current Month";
    this.getallusers();
     this.select_prev('curr')

  }
  hidedrop(){
  this.cuSelect = false;
}
minmize = false;
minmize2(){
  this.minmize = !this.minmize
}
selectedBtn = "Current Month"
selectitem(e){
this.cuSelect = false;
this.selectedBtn = e;
if (this.selectedBtn == "Current Month") {
  this.select_prev("curr");
} else {
  this.select_prev("prev");
}
}

}
