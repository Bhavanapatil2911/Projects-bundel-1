import { Component, OnInit } from "@angular/core";
import { CmstatuslistService } from "./cmstatuslist.service";
import { LoaderService } from "app/services/loader.service";

@Component({
  selector: "app-cmstatuslist",
  templateUrl: "./cmstatuslist.component.html",
  styleUrls: ["./cmstatuslist.component.css"],
  providers: [CmstatuslistService],
})
export class CmstatuslistComponent implements OnInit {
  cmListSubscription: any;
  cmList: any;
  direction: number;
  isDesc: boolean = true;
  column: string;
  successalert: boolean;
  changeLeadIntakeStatusSubscription: any;

  per_page;
  total_page;
  current_page;
  headers_res;
  page_number;
  Storevalue = "";

  constructor(
    private loaderService: LoaderService,
    private csagentService: CmstatuslistService
  ) {}

  ngOnInit() {
    this.getCMList(); //when the component is initialised the list of community manager is fetched
    this.GetallStores();
  }

  sort(property) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  getCMList() {
    // service call to get the list of community managers and assigning them to an array
    this.loaderService.display(true);
    
    this.cmListSubscription = this.csagentService.getCmList(this.id,this.status,this.searchKey).subscribe(
      (res) => {
        this.cmList = res;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  erroralert;
  errorMessage;
  successMessage;
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

  public ngOnDestroy(): void {
    //unsubscribing to all the subscriptions when the component is destroyed.
    if (this.cmListSubscription && !this.cmListSubscription.closed) {
      this.cmListSubscription.unsubscribe();
    }
  }

  intakeStoppedHandler(userId) {
    // changes the lead Intake Status of the community manager based on the toggle switch.
    this.loaderService.display(true);
    this.changeLeadIntakeStatusSubscription = this.csagentService
      .changeLeadIntakeStatus(userId)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.getCMList(); //after the switch has been clicked and the response has been acquired, We amke a call to get the latest value of the status.
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  filterStores;
  GetallStores() {
    this.csagentService.Getstoresfilter().subscribe((res) => {
      this.filterStores = res;
    });
  }

  storeid;
  onDropdownChange(id, store, i) {
    this.storeid = store;
  }
  updateStore(user, i) {
    let obj = {
      cm_id: user,
      store_id: this.storeid,
    };
    this.csagentService.upadtestore(obj).subscribe(
      (res) => {
        this.successMessageShow("Store Upadted successfully");
        this.getCMList();
      },
      (err) => {
        this.errorMessageShow(JSON.parse(this.errorMessage["_body"]).message);
      }
    );
  }
  id: any;
  filterStatus(e) {
   this.id = e;
    this.loaderService.display(true);
    this.cmListSubscription = this.csagentService.getCmList(this.id,this.status,this.searchKey).subscribe(
      (res) => {
        this.cmList = res;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  status : any;
  filterByActivness(e) {
    this.status = e;
    this.loaderService.display(true);
    this.cmListSubscription = this.csagentService.getCmList(this.id,this.status,this.searchKey).subscribe(
      (res) => {
        this.cmList = res;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  searchKey="";
  filterBySearch(){
    console.log(this.searchKey)
    this.getCMList()
  }
  clearkey(){
    this.searchKey=""
    this.getCMList()
  }
  
}
