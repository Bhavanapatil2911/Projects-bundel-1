import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import {
  Routes,
  RouterModule,
  Router,
  ActivatedRoute,
  Params,
} from "@angular/router";
import { LoaderService } from 'app/services/loader.service';
declare var $: any;

@Component({
  selector: "app-vendor-summary",
  templateUrl: "./vendor-summary.component.html",
  styleUrls: ["./vendor-summary.component.css"],
  providers: [CategoryService],
})
export class VendorSummaryComponent implements OnInit {
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  selectedTab: any;
  activeTab: any;
  SearchCity: any;
  typeOfVendor: any;

  constructor(
    private CategoryService: CategoryService,
    private LoaderService: LoaderService
  ) {}

  ngOnInit() {
    this.selectedTab = "summary";
    this.activeTab = "Summary";
    this.getvendorscount();
    this.typeOfVendor = "all";
    this.filterVendorType("all");
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
  mtCount: any;
  rtCount: any;
  vendorsList = [];
  headers_res;
  per_page = 10;
  total_page;
  current_page;
  vendorCount: any;
  city_id: any = "";
  getvendorscount() {
    this.CategoryService.getCountvendors().subscribe((res) => {
      this.mtCount = res.maintenance_vendor.total_vendors;
      this.rtCount = res.retail_vendor.total_vendors;
    });
  }
  filterVendorType(e) {
    this.typeOfVendor = e;
    if (e == "maintenance" || e == "all") {
      if (e == "all") {
        this.getVendorall("");
        this.vendorsPaymentcount(e);
      } else {
        this.getvendors("");
        this.vendorsPaymentcount(e);
      }
    }
    if (e == "service" || e == "non service") {
      if (e == "non service") {
        e = "non_service";
      }
      this.serviceType = e;
      this.getvendors2("");
      this.vendorsPaymentcount(e);
    }
  }
  selectedrow: any;
  row = [""];
  currentpage2: any;
  totalcount2: any;
  expansion: any;
  purchaseOrders: any = [];
  toggleRow(ven, i) {
    if (this.row[0] !== ven.id) {
      this.expansion = ven.id;
      this.row[0] = ven.id;
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
  }
  getvendors(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }

    this.LoaderService.display(true);

    this.CategoryService.getVendorsWithPoMain(
      this.current_page,
      "",
      "",
      "",
      ""
    ).subscribe(
      (res) => {
        res = res.json();
 this.LoaderService.display(false);
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
        this.errorMessageShow(JSON.parse(err["_body"]).error);
      }
    );
  }
  wip() {
    this.errorMessageShow("Development In Progress");
  }
  serviceType: any;
  getvendors2(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    if (this.serviceType == undefined) {
      this.serviceType = "";
    }
 this.LoaderService.display(true);
    this.CategoryService.getVendorsWithPoservice(
      this.serviceType,
      this.current_page,
      "",
      "",
      "",
      ""
    ).subscribe(
      (res) => {
        res = res.json();    
 setTimeout(
   function () {
    this.LoaderService.display(false);
   }.bind(this),
   3800
 );
        
 
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
        this.errorMessageShow(JSON.parse(err["_body"]).error);
      }
    );
  }
  VendorsCountpayment: any;
  vendorsPaymentcount(type) {
    this.LoaderService.display(true);
    this.CategoryService.getVendorsPaymentCount(type).subscribe((res) => {
      this.VendorsCountpayment = res;
     
    });
  }

  getVendorall(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    this.LoaderService.display(true);
    this.CategoryService.getVendorlistAll(this.current_page).subscribe(
      (res) => {

        if (this.typeOfVendor == "all") {
          setTimeout(
            function () {
              this.LoaderService.display(false);
            }.bind(this),
            2000
          );
        }
        this.total_page = res.count;
        this.current_page = res.page_number;
        this.vendorCount = res.count;
        this.vendorsList = res.vendors;
        if (this.vendorsList.length == 0) {
          this.errorMessageShow("No Vendors Data Found");
          this.vendorsList = [];
          this.vendorCount = 0;
        }
        (err) => {
         
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).error);
        };
      }
    );
  }
  getReport(){
   
      this.CategoryService.vendorSummaryReport(this.typeOfVendor).subscribe(
        (res) => {
          this.successMessageShow(
            "You will receive the report in email once it is ready."
          );
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).error);
        }
      );
    }
    
   
}
