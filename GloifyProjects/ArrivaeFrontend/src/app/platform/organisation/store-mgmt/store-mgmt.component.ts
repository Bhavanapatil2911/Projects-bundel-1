
// starts here
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


declare var $: any;

@Component({
  selector: "app-store-mgmt",
  templateUrl: "./store-mgmt.component.html",
  styleUrls: ["./store-mgmt.component.css"],
  providers: [LeadService],
})
export class StoreMgmtComponent implements OnInit {
  store_id: any;

  constructor(
    private leadService: LeadService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private _activatedroute: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) {}

  per_page = 10;
  total_page;
  current_page;
  headers_res;
  page_number;
  searchValue = "";

  totalItems;
  searchString: any;

  promoPackagesForm: any;

  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  today_date: any;
  ngOnInit() {
    this.getStoreList("");
    this.getallStoremanagers();
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

  store_que_arr;
  getStoreList(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    if (this.searchString == undefined) {
      this.searchString = "";
    }

   this.storeManager2 = this.storeManager2 ? this.storeManager2 : "";
   


    this.loaderService.display(true);
    this.leadService
      .getStoreListForMainPage(this.current_page, this.searchString,this.storeManager2)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          res = res.json();
          this.store_que_arr = res.data.stores;
          this.current_page = res.data.page_number;
          this.total_page = res.data.count;
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  deleteStoreDetails(id) {
    if (
      confirm(
        "Are you sure you want to delete this store and it's associations?"
      ) == true
    ) {
      this.loaderService.display(true);
      this.leadService.deleteStoreDetails(id).subscribe(
        (res) => {
          this.loaderService.display(false);
          this.getStoreList(this.searchValue);
          this.successMessageShow(`Store deleted successfully`);
        },
        (err) => {
          this.loaderService.display(false);

        }
      );
    }
  }

  handleStoreCreateEvent(event) {
    $("#storeModal").modal("hide");
    this.successMessageShow(`Store ${event} Successfully`);
    if (event == "Created") {
      this.current_page = 1;
      this.searchString = "";
    }

    this.getStoreList(this.current_page);
  }
  handleCloseEvent() {
    this.store_id = "";
    $("#storeModal").modal("hide");
  }
  updateLeadStore(StoreId) {
    this.store_id = StoreId;
  }
  searchLeadStore() {
    this.getStoreList(this.current_page);
  }
  navigateToPage(event) {
    localStorage.setItem("lead_store_page_number", event.toString());
  }
  filterStores: any;
  getallStoremanagers() {
    this.leadService.getAllStoreManagers().subscribe((res) => {
      this.filterStores = res.users;
    });
  }
  storeManager;
  onDropdownChange(id, sm,i) {
   
    this.storeManager = sm;
  }
  updateStore(user, i,text) {

   user =text?"":user;

      let obj = {
        sm_id: this.storeManager,
        store_id: user,
      };
    this.loaderService.display(true);
    this.leadService.AssignStoreManager(obj).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successMessageShow(res.message);
       this.getStoreList(this.current_page);
      },
      (err) => {
          this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(this.errorMessage["_body"]).message);
      }
    );
  }
  storeManager2:any;
   filterStatus(e) {
this.storeManager2 = e;
 this.getStoreList("");

   }
}
