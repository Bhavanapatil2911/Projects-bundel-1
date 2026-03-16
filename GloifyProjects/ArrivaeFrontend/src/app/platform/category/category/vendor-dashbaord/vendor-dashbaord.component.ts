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
  selector: "app-vendor-dashbaord",
  templateUrl: "./vendor-dashbaord.component.html",
  styleUrls: ["./vendor-dashbaord.component.css"],
  providers: [CategoryService],
})
export class VendorDashbaordComponent implements OnInit {
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  selectedTab = "retail_po";
  activeTab = "Retail Vendor";
  SearchCity: any;
  public todayDate: any = new Date();
  constructor(
    private categoryService: CategoryService,
    private LoaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private router :Router
  ) {}
routeparams:any
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params.id !=='All'){
 this.searchString = params.name;
 this.expansion =  params.id;
 this.row[0] = params.id;
 this.routeparams = params;
      }
    });
    this.getFilterData();
    this.SearchCity = "All";
   
   this.getvendorscount();
    this.getvendors("");
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
  catname: any;

  fun(e) {
    this.catname = e;
    $("#glassAnimals").modal("show");
  }

  wip() {
    this.errorMessageShow("Development In Progress");
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
      .getVendorsReport(
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
  city_list = [];
  getFilterData() {
    this.categoryService.getCities().subscribe(
      (res) => {
        this.city_list = res["cities"];
      },
      (err) => {}
    );
  }
  vendorsList = [];
  headers_res;
  per_page = 10;
  total_page;
  current_page;
  vendorCount: any;
  city_id: any = "";
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
      .getVendorsWithPo(
        this.current_page,
        this.searchString,
        this.city_id,
        this.final_from_date,
        this.final_to_date
      )
      .subscribe(
        (res) => {
          this.LoaderService.display(false);
          this.headers_res = res.headers._headers;
          this.getpospage("");

          res = res.json();
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
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
  }
  expansion: any;
  to_date;
  from_date;
  final_from_date;
  final_to_date;
  searchString;
  ClearDateFilter() {
    this.to_date = "";
    this.from_date = "";
    this.final_from_date = "";
    this.final_to_date = "";
    this.searchString = "";
    this.city_id = "";
    this.SearchCity = "All";
    this.getvendors("");
 if(this.routeparams.id !== 'all'){
   this.router.navigate(["/vendor-dashboard/retail-vendor", "All", "All"]);
 } 
   
    
  }
  searchFun() {
    this.getvendors("");
  }
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
  po_preview_pdf_url_without_base_url: any;
  po_preview_pdf_url: any;
  getPOPdfForPreview(po) {
    let poid = po.id;
    this.LoaderService.display(true);
    this.categoryService.getPOPdfForPreview(poid).subscribe(
      (res) => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).path;
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
  getpospage(e) {
    if (e == undefined || e == "") {
      this.currentpage2 = 1;
    } else {
      this.currentpage2 = e;
    }

    if (this.expansion !== "" && this.expansion !== undefined) {
      this.LoaderService.display(true);
      this.categoryService
        .getVendorpos(this.expansion, this.currentpage2)
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
  mtCount: any;
  getvendorscount() {
    this.categoryService.getCountvendors().subscribe((res) => {
      this.mtCount = res.maintenance_vendor.total_vendors;
    });
  }
}
