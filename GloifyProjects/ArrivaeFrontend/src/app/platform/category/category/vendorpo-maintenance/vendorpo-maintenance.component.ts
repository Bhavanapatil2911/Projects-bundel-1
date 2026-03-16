import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'app/services/loader.service';
import { CategoryService } from '../category.service';
import { environment } from "environments/environment";
import {
  Routes,
  RouterModule,
  Router,
  ActivatedRoute,
  Params,
} from "@angular/router";
declare var $: any;

@Component({
  selector: "app-vendorpo-maintenance",
  templateUrl: "./vendorpo-maintenance.component.html",
  styleUrls: ["./vendorpo-maintenance.component.css"],
  providers: [CategoryService],
})
export class VendorpoMaintenanceComponent implements OnInit {
  selectedTab = "maintenance_po";
  activeTab = "Maintenance Vendor";
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  SearchCity: any;
  public todayDate: any = new Date();
  searchString;
  from_date;
  to_date;

  constructor(
    private categoryService: CategoryService,
    private LoaderService: LoaderService,
     private activatedRoute: ActivatedRoute,
     private router :Router
  ) {}
routeparams:any;
  ngOnInit() {
     this.activatedRoute.params.subscribe((params: Params) => {
      if(params.id !=='All'){
 this.searchString = params.name;
 this.expansion =  params.id;
 this.row[0] = params.id;
 this.routeparams = params;
      }
    })
    this.getFilterData();
    this.SearchCity = "All";
    this.getvendors("");
    this.getvendorscount();
  }

  activateTab(tab) {
    this.selectedTab = tab;
    switch (tab) {
      case "retail_po":
        this.activeTab = "Retail Vendor";
        break;
      case "maintenance_po":
        this.activeTab = "Maintenance Vendor";
        break;
      case "summary":
        this.activeTab = "Summary";
        break;
    }
  }
  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      10000
    );
  }
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      10000
    );
  }
  city_list = [];
  getFilterData() {
    this.categoryService.getCities().subscribe(
      (res) => {
        this.city_list = res["cities"];
      },
      (err) => {}
    );
  }
  final_from_date;
  final_to_date;
  city_id;
  ClearDateFilter() {
    this.to_date = "";
    this.from_date = "";
    this.final_from_date = "";
    this.final_to_date = "";
    this.searchString = "";
    this.city_id = "";
    this.SearchCity = "All";
    this.getvendors("");
    if(this.routeparams.id !=='all'){
  this.router.navigate(["/vendor-dashboard/maintenance-vendor", "All", "All"]);
    }
  
  }
  per_page = 10;
  total_page;
  current_page;
  vendorCount: any;
  vendorsList: any = [];
  expansion: any;
  SubmitDate() {
    if (this.from_date !== undefined && this.from_date !== "") {
      var todayTime = this.from_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_from_date = day + "-" + month + "-" + year;
    }
    if (this.to_date !== undefined && this.to_date !== "") {
      var todayTime = this.to_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_to_date = day + "-" + month + "-" + year;
    }
    this.getvendors("");
  }
  cityFilter(e) {
    this.city_id = e;
    this.getvendors("");
  }

  getvendors(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    if (this.searchString == undefined) {
      this.searchString = "";
    }
    if (this.city_id == undefined) {
      this.city_id = "";
    }
    if (this.final_from_date == undefined) {
      this.final_from_date = "";
    }
    if (this.final_to_date == undefined) {
      this.final_to_date = "";
    }
    this.LoaderService.display(true);
    this.categoryService
      .getVendorsWithPoMain(
        this.current_page,
        this.searchString,
        this.city_id,
        this.final_from_date,
        this.final_to_date
      )
      .subscribe(
        (res) => {
          this.LoaderService.display(false);
          res = res.json();
          this.getpospage("");
          this.total_page = res.count;
          this.current_page = res.page_number;
          this.vendorCount = res.count;
          this.vendorsList = res.vendors;
          if (this.vendorsList.length == 0) {
            this.errorMessageShow("No Vendors Data Found");
            this.vendorsList = [];
            this.vendorCount = 0;
          }
        },
        (err) => {
          if (err.status == 500) {
            this.errorMessageShow("Back End Issue");
          }
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
  }
  getReport() {
    if (this.searchString == undefined) {
      this.searchString = "";
    }
    if (this.city_id == undefined) {
      this.city_id = "";
    }
    if (this.final_from_date == undefined) {
      this.final_from_date = "";
    }
    if (this.final_to_date == undefined) {
      this.final_to_date = "";
    }
    if (this.current_page == undefined) {
      this.current_page = 1;
    }
    this.categoryService
      .getVendorsReportMain(
        this.current_page,
        this.searchString,
        this.city_id,
        this.final_from_date,
        this.final_to_date
      )
      .subscribe(
        (res) => {
          this.successMessageShow(
            "You will receive the report in email once it is ready."
          );
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
  }
  selectedrow: any;
  row = [""];
  currentpage2: any;
  totalcount2: any;

  purchaseOrders: any = [];
  toggleRow(ven, i) {
    if (this.row[0] != ven.id) {
      this.expansion = ven.id;
      this.row[0] = ven.id;
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
    if (this.currentpage2 == undefined) {
      this.currentpage2 = 1;
    }

    if (this.expansion !== "" && this.expansion !== undefined) {
      this.getpospage("");
    }
  }
  getpospage(e) {
    if (e == undefined || e == "") {
      this.currentpage2 = 1;
    } else {
      this.currentpage2 = e;
    }

    if (this.expansion !== "" && this.expansion !== undefined) {
      this.LoaderService.display(true);
      this.categoryService
        .getVendorposMain(this.expansion, this.currentpage2)
        .subscribe(
          (res) => {
            this.LoaderService.display(false);
            res = res.json();
            this.purchaseOrders = res.purchase_orders;
            this.totalcount2 = res.count;
            this.currentpage2 = res.page_number;
          },
          (err) => {
            this.LoaderService.display(false);
          }
        );
    }
  }
  po_preview_pdf_url_without_base_url: any;
  po_preview_pdf_url: any;
  getPOPdfForPreview(po) {
    let poid = po.id;
    this.categoryService.getPOPdfForPreviewmain(poid).subscribe(
      (res) => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).display_path;
        console.log(this.po_preview_pdf_url);
        if (this.po_preview_pdf_url == "" || this.po_preview_pdf_url == null) {
          this.errorMessageShow("Pdf not found for preview!!");
          $("#poPreviewModal").modal("hide");
        }
        this.LoaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        $("#poPreviewModal").modal("hide");
        this.LoaderService.display(false);
      }
    );
  }
  row2 = [""];
  selected_item: any;
  toggleRow2(rowId) {
    if (this.row2[0] !== rowId) {
      this.selected_item = rowId;
      this.row2[0] = rowId;
    } else {
      this.row2[0] = "";
      this.selected_item = "";
    }
  }

  row3 = [""];
  selected_item2: any;
  openPanel(rowId) {
    if (this.row3[0] !== rowId) {
      this.selected_item2 = rowId;
      this.row3[0] = rowId;
    } else {
      this.row3[0] = "";
      this.selected_item2 = "";
    }
  }
  catname: any;
  fun(e) {
    this.catname = e;
    $("#glassAnimals").modal("show");
  }
  rtCount: any;
  getvendorscount() {
    this.categoryService.getCountvendors().subscribe((res) => {
      this.rtCount = res.retail_vendor.total_vendors;
    });
  }
}
