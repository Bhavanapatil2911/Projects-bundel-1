import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from './communitymanager.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { Project, IGanttOptions, Zooming, Task } from '../../../shared/gantt-chart/interfaces';
import { LeadService } from '../../lead/lead.service';
import { CmstatuslistService } from '../cmstatuslist/cmstatuslist.service';
declare var gantt: any;
declare var $: any;

@Component({
  selector: "app-cm-dashboard",
  templateUrl: "./cm-dashboard.component.html",
  styleUrls: ["./cm-dashboard.component.css"],
  providers: [
    CommunitymanagerService,
    SchedulerService,
    DesignerService,
    LeadService,
    CmstatuslistService,
  ],
})
export class CmDashboardComponent implements OnInit {
  CMId: string;
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  errorMessagemodal: string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal: string;
  usersCount: any;
  role;
  date_from: any = "";
  date_to: any = "";
  filter_designer: any = "";
  disable_to: any = true;
  my_designers: any = [];
  inviteChampionForm: FormGroup;
  champion_user: any[];
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  addLeadForm: FormGroup;
  lead_types: any;
  lead_campaigns: any;
  lead_sources: any;
  csagentsArr: any;
  dropdownList: any;
  dropdownList2: any;
  dropdownList3: any;
  dropdownList4: any;
  dropdownList5: any;
  basefile: any;
  is_champion;
  leadIntakeStatus: boolean;
  getLeadIntakeStatusSubscription: any;
  changeLeadIntakeStatusSubscription: any;
  lead_referrer_list = [];
  user_id;
  lostReasonsArr = [
    "low_budget",
    "less_scope_of_work",
    "city_not_in_operations",
    "general_inquiry/not_interested",
    "language_barrier",
    "reluctant_to_provide_details_wrong_number",
    "others",
  ];
  downloadCallReport_form: FormGroup;
  lead_store_que_arr: any;
    constructor(
    private loaderService: LoaderService,
    private cmService: CommunitymanagerService,
    private formBuilder: FormBuilder,
    private designerService: DesignerService,
    private leadService: LeadService,
    private communityManagerService: CommunitymanagerService,
    private cmservice: CmstatuslistService
  ) {
    this.CMId = localStorage.getItem("userId");
  }

  ngOnInit() {
    
    this.role = localStorage.getItem("user");
    this.user_id = localStorage.getItem("userId"); //user Id
    this.getLeadCount(this.date_from, this.date_to, this.filter_designer,this.CM,this.DM,this.SM);
    this.is_champion = localStorage.getItem("isChampion");
    // this.myDesigners();
    this.loaderService.display(true);
    this.inviteChampionForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        Validators.required,
      ]),
      contact: new FormControl("", [Validators.required]),
      parent_id: new FormControl(""),
      champion_level: new FormControl("", [Validators.required]),
      user_type: new FormControl("arrivae_champion"),
    });

    this.initateaddleadform()

  

    this.downloadCallReport_form = this.formBuilder.group({
      type: new FormControl("", Validators.required),
      reportDuration: new FormControl("", Validators.required),
    });

    this.getFiltersData();
    
    this.getReferListForSelect();
    //this.getLeadCountForAgent();
    this.getLeadStoreList();
    this.getLeadPoolList();
    if (this.role == "business_head") {
      this.downloadNewLineItems();
      this.downloadNewBoqLineItems();
    }
    this.leadNOChighlight();
    this.getthreeplusmeeting();
    if(this.role != "business_head"){
    this.getallstore();
    }
    this.getCMandDMList(this.cmid,this.smid);
    console.log(this.usersCount)
  }

  // Lead Count by Assigned Designer Status filter start here
  direction: number;
  isDesc: boolean = true;
  column: string;
  sortFunc(property) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  // Lead Count by Assigned Designer Status filter end here

  ngAfterViewInit() {
    //this.getDesignerActionableCount(this.CMId, this.date_from, this.date_to)
  }


  initateaddleadform(){

    this.addLeadForm = this.formBuilder.group({
      name: new FormControl(""),
      email: new FormControl("", [
        Validators.pattern(
          "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$"
        ),
      ]),
      contact: new FormControl("", [Validators.required]),
      pincode: new FormControl(""),
      lead_type_id: new FormControl("", Validators.required),
      lead_source_id: new FormControl("", Validators.required),
      lead_campaign_id: new FormControl(""),
      instagram_handle: new FormControl(""),
      lead_type_name: new FormControl(),
      referrer_type: new FormControl(""),
      store_id: new FormControl(null),
      lead_source_type: new FormControl(""),
      referrer_id: new FormControl(""),
      lost_remark: new FormControl(""),
      lost_reason: new FormControl(""),
      remark: new FormControl(""),
      follow_up_time: new FormControl(""),
      lead_status: new FormControl(""),
    });

  }

  getDesignerActionableCount(CMId, date_from, date_to) {
    this.loaderService.display(true);
    this.cmService
      .getCmDashboardDesignerActionables(CMId, date_from, date_to)
      .subscribe(
        (res) => {
          this.usersCount["designer_data"] = res;
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  cm_list;
  dm_list;
  sm_list;
  cmid='';
  smid=''
  getCMandDMList(cmid,smid){
    if(this.role == 'area_sales_manager'){
      this.cmService.getFiterListOfCMandDM(cmid,smid).subscribe(
        (res)=>{
          this.dm_list=res["designer"]
          this.cm_list=res["cms"]
          this.sm_list=res["sales_managers"]
  
        }
      )
    } else{
     
      if(this.role =='deputy_general_manager'){
      
        this.cmService.getFilterListofWIPCMForDM().subscribe(
          (res)=>{
            this.cm_list=res;
          },
          (err) => {
            
          }
        )

      }

    


    }
   

  }
 

  getLeadStoreList() {
    this.leadService.getLeadStoreList().subscribe(
      (res) => {
        res = res.json();
        this.lead_store_que_arr = res.lead_stores;
      },
      (err) => {}
    );
  }
  myDesigners() {
    this.loaderService.display(true);
    this.cmService.getDesignerList(1).subscribe(
      (res) => {
        this.my_designers = res.designer_list;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  LoaderCount = false;
  getLeadCount(date_fro, dat_to, filter_designer,CM?,DM?,SM?) {
    this.loaderService.display(true);
    this.LoaderCount = true
    this.cmService
      .getCmDashboardCount(this.CMId, date_fro, dat_to, filter_designer,CM,DM,SM)
      .subscribe(
        (res) => {
          this.usersCount = res;
          this.LoaderCount = false
          this.loaderService.display(false);
          this.getDesignerActionableCount(
            this.CMId,
            this.date_from,
            this.date_to,
                      );
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  showDesignerStatusCountRow(status) {
    var elem = document.getElementById("assigneDesignerStatusCountsRow");
    if (elem) {
      if (status == "leads_assigned") {
        elem.classList.remove("d-none");
      } else {
        elem.classList.add("d-none");
      }
    }
  }

  pre_10_percent;
  _10_50_percent;
  _50_percent;
  installation;
  showWip(index?) {
    if (
      document.getElementById("wip-box").style.display == "none" ||
      document.getElementById("wip-box").style.display == ""
    ) {
      //document.getElementById("wipbox-activator").style.border = "2px solid #3EC0F3";
      this.pre_10_percent =
        this.usersCount.designer_data[0].leads_assigned_pre_10_percent;
      this._10_50_percent =
        this.usersCount.designer_data[0].leads_assigned_10_50_percent;
      this._50_percent =
        this.usersCount.designer_data[0].leads_assigned_50_percent;
      this.installation =
        this.usersCount.designer_data[0].leads_assigned_installation;
      document.getElementById("wip-box").style.display = "block";
    } else {
      //document.getElementById("wipbox-activator").style.border = "0px";
      document.getElementById("wip-box").style.display = "none";
      this.pre_10_percent = undefined;
      this._10_50_percent = undefined;
      this._50_percent = undefined;
      this.installation = undefined;
    }
  }
  CM:any;
  DM;
  SM:any;
  filterbySm(val){
    console.log(val)
    this.SM=val
    this.CM=null
    this.DM=null
    this.cmid=''
    this.smid=this.SM==undefined?'':this.SM
    console.log(this.cmid,this.smid)
    this.getCMandDMList(this.cmid,this.smid)
    

  }
  filterbyCm(val){
    console.log(val)
    this.CM=val
    this.DM=null
    this.cmid=this.CM==undefined?'':this.CM
    console.log(this.cmid,this.smid)
    this.getCMandDMList(this.cmid,this.smid)
  }
  


  filterbyDm(val){
    this.DM=val
    // this.dM=val
  }
  changeDateFrom(val) {
    this.date_from = val;
    this.disable_to = false;
    // $(".to_date_container").css("display", "block");
  }

  changeDateTo(val) {
    this.date_to = val;
  }

  changeDesigner(val) {
    this.filter_designer = val;
  }

  filterDashboard() {
    if (this.date_from || this.date_to || this.CM || this.DM || this.SM) {
      this.getLeadCount(this.date_from, this.date_to, this.filter_designer,this.cmid,this.DM,this.smid);
      //
      // this.getDesignerActionableCount(this.CMId, this.date_from, this.date_to);
    } else {
      this.getLeadCount(false, false, this.filter_designer,'',false,'');
    }
    this.leadNOChighlight()
    this.getthreeplusmeeting(); 
  }

  downloadExcel() {
    this.cmService
      .exportLeads(this.date_from, this.date_to, this.role, this.CMId)
      .subscribe(
        (res) => {
          this.loaderService.display(false);

          this.successalert = true;
          this.successMessage =
            "The Lead report you requested is being created. It will be emailed to you once complete.!";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
          $("#downloadreport").modal("hide");
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  showWipList() {
    if (
      document.getElementById("wip-box").style.display == "none" ||
      document.getElementById("wip-box").style.display == ""
    ) {
      document.getElementById("wipbox-activator").style.border =
        "2px solid #3EC0F3";
      document.getElementById("wip-box").style.display = "block";
    } else {
      document.getElementById("wipbox-activator").style.border = "0px";
      document.getElementById("wip-box").style.display = "none";
    }
  }
  downloadExcelBoq() {
    this.loaderService.display(true);

    this.designerService.exportBoq().subscribe(
      (res) => {
        this.loaderService.display(false);

        this.successalert = true;
        this.successMessage =
          "The BOQ report you requested is being created. It will be emailed to you once complete.!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  downloadExcelReport() {
    this.cmService.exportReportsEvent().subscribe(
      (res) => {
        if (this.role != "business_head"){
         this.successalert = true;
        this.successMessage =
          "The Event report you requested is being created. It will be emailed to you once complete.!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      }
      else{
        window.open(res.json().event_report, "_blank");
      }
    },
      (err) => {}
    );
  }

  inviteChampionFormSubmit(data) {
    this.loaderService.display(true);
    this.leadService.inviteChampion(data).subscribe(
      (res) => {
        $("#inviteChampionModal").modal("hide");
        this.loaderService.display(false);
        this.inviteChampionForm.reset();
        // this.champion_user = "";
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
      },
      (err) => {
        if (err.status == "403" || err.status == "422") {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            10000
          );
          this.inviteChampionForm.reset();
        } else {
          this.erroralert = true;
          this.errorMessage = err.message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            10000
          );
        }
        $("#inviteChampionModal").modal("hide");
        this.loaderService.display(false);
      }
    );
  }

  getChampionList() {
    this.loaderService.display(true);
    this.leadService.getChampionList().subscribe(
      (res) => {
        this.champion_types = res.allowed_champion_levels;
        this.champion_list_first_level = res["1"];
        this.champion_list_second_level = res["2"];
        this.champion_list_third_level = res["2"];
        this.inviteChampionForm.controls["champion_level"].patchValue("");
        this.inviteChampionForm.controls["parent_id"].patchValue("");
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  getChampionListByLevel() {
    switch (this.inviteChampionForm.controls["champion_level"].value) {
      case "1":
        this.champion_user = [];
        break;
      case "2":
        this.champion_user = this.champion_list_first_level;
        break;
      case "3":
        this.champion_user = this.champion_list_second_level;
        break;
    }
  }

  numberCheck(e) {
    if (
      !(
        (e.keyCode > 95 && e.keyCode < 106) ||
        (e.keyCode > 47 && e.keyCode < 58) ||
        e.keyCode == 8 ||
        e.keyCode == 39 ||
        e.keyCode == 37 ||
        e.keyCode == 38 ||
        e.keyCode == 40 ||
        e.keyCode == 17 ||
        e.keyCode == 91 ||
        e.keyCode == 86 ||
        e.keyCode == 67
      )
    ) {
      return false;
    }
  }
  addLeadDetails;

  Addleadform(){
    document.getElementById("addLeadFormhide").style.display = "block";
    document.getElementById("addleadquestionnaireForm").style.display ="none";
    $("#addNewLeadModal").modal("show");
    
  }

  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    //$('#addNewLeadModal').modal('hide');
    data["created_by"] = localStorage.getItem("userId");
    // if(data.lead_type_id==this.leadTypeCustomerId){
    //   data['lead_status'] = 'claimed';
    // }
    data["by_csagent"] = false;
    data["by_designer"] = false;
    data["by_communityManager"] = true;
    if (this.addLeadForm.controls["lead_type_name"].value == "designer") {
      data["lead_cv"] = this.basefile;
    }
    var obj = {
      lead: data,
    };
    this.leadService.designerAddLead(obj).subscribe(
      (res) => {
        Object.keys(res).map((key) => {
          res = res[key];
        });
        this.addLeadDetails = res;
        this.addLeadDetails["questionnaire_type"] = "add_lead";
        this.initateaddleadform();
        console.log(this.addLeadForm['lead_type_id'])
        this.basefile = undefined;
        // this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Lead created successfully !!";
        this.getLeadCount(this.date_from, this.date_to, this.filter_designer,this.CM,this.DM,this.SM);
        if (res["lead_type"] == "customer") {
          $("#addLeadFormhello").modal("hide");
          document.getElementById("addLeadFormhide").style.display = "none";
          document.getElementById("addleadquestionnaireForm").style.display =
            "block";
        } else {
          document
            .getElementById("addLeadStatusDropdown")
            .classList.add("d-none");
          document
            .getElementById("addleadFormdatetime")
            .setAttribute("style", "display: none");
          document
            .getElementById("addleadFormlostremark")
            .setAttribute("style", "display: none");
          document
            .getElementById("addleadFormlostReason")
            .setAttribute("style", "display: none");
          if (document.getElementById("addleadFormRemark")) {
            document
              .getElementById("addleadFormRemark")
              .setAttribute("style", "display: none");
          }
          $("#addNewLeadModal").modal("hide");
        }
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          15000
        );
      },
      (err) => {
        this.loaderService.display(false);
        $("#addNewLeadModal").modal("hide");
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          15000
        );
      }
    );
  }
  add_lead_types = [];
  designer_lead_campaigns;
  leadTypeCustomerId;
  getLeadPoolList() {
    this.loaderService.display(true);
    this.leadService.getLeadPoolList().subscribe(
      (res) => {
        // this.add_lead_types = res['lead_types'];
        for (var i = 0; i < res["lead_types"].length; i++) {
          if (res["lead_types"][i].name == "customer") {
            this.add_lead_types.push(res["lead_types"][i]);
          }
        }
        for (var i = 0; i < this.add_lead_types.length; i++) {
          if (this.add_lead_types[i].name == "customer") {
            this.leadTypeCustomerId = this.add_lead_types[i].id;
            break;
          }
        }
        this.designer_lead_campaigns = res["designer_lead_campaigns"];

        this.lead_sources = res["designer_lead_sources"];
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  showLeadStatusDropdown(val) {
    if (val == this.leadTypeCustomerId) {
      document.getElementById("addLeadStatusDropdown").classList.add("d-none");
    } else {
      document
        .getElementById("addLeadStatusDropdown")
        .classList.remove("d-none");
    }
  }
  onChangeOfLeadType(val) {
    for (var i = 0; i < this.lead_types.length; i++) {
      if (val == this.lead_types[i].id) {
        this.addLeadForm.controls["lead_type_name"].setValue(
          this.lead_types[i].name
        );
      }
    }
  }

  getFiltersData() {
    this.leadService.getFiltersData().subscribe((res) => {
      res = res.json();
      //
      this.lead_campaigns = res.lead_campaign_id_array;
      this.lead_sources = res.lead_source_id_array;
      this.lead_sources = this.lead_sources.filter( e => e.name !== 'referral' )
      //this.lead_status=res.lead_status_array
      this.lead_types = res.lead_type_id_array;
      this.csagentsArr = res.cs_agent_list;

      for (var i = 0; i < res.lead_type_id_array.length; i++) {
        var obj = {
          id: res.lead_type_id_array[i].id,
          itemName: res.lead_type_id_array[i].name
            .replace("_", " ")
            .toLowerCase()
            .split(" ")
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(" "),
        };
        this.dropdownList.push(obj);
      }
      for (var i = 0; i < res.lead_status_array.length; i++) {
        var obj = {
          id: <any>i,
          itemName: res.lead_status_array[i]
            .replace(/_/g, " ")
            .toLowerCase()
            .split(" ")
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(" "),
        };
        this.dropdownList2.push(obj);
      }
      for (var i = 0; i < res.lead_source_id_array.length; i++) {
        var obj = {
          id: res.lead_source_id_array[i].id,
          itemName: res.lead_source_id_array[i].name
            .replace("_", " ")
            .toLowerCase()
            .split(" ")
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(" "),
        };
        this.dropdownList3.push(obj);
      }
      for (var i = 0; i < res.lead_campaign_id_array.length; i++) {
        var obj = {
          id: res.lead_campaign_id_array[i].id,
          itemName: res.lead_campaign_id_array[i].name
            .replace("_", " ")
            .toLowerCase()
            .split(" ")
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(" "),
        };
        this.dropdownList4.push(obj);
      }
      for (var i = 0; i < res.cs_agent_list.length; i++) {
        var str =
          res.cs_agent_list[i].name
            .replace("_", " ")
            .toLowerCase()
            .split(" ")
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(" ") +
          " - " +
          res.cs_agent_list[i].email;
        var obj = {
          id: res.cs_agent_list[i].id,
          itemName: <any>str,
        };
        this.dropdownList5.push(obj);
      }
    });
  }

  changeLeadIntakeStatus() {
    // changes the lead Intake Status of the community manager based on the toggle switch.
    this.loaderService.display(true);

    this.changeLeadIntakeStatusSubscription = this.communityManagerService
      .changeLeadIntakeStatus(this.CMId)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
           //after the switch has been clicked and the response has been acquired, We amke a call to get the latest value of the status.
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  // getLeadIntakeStatus() {
  //   this.loaderService.display(true);
  //   this.leadIntakeStatus = true; //the default value for LeadIntakeStatus is true

  //   //the below code will override the value of LeadIntakeStatus based on the value from the server.
  //   this.getLeadIntakeStatusSubscription = this.communityManagerService
  //     .getLeadIntakeStatus(this.CMId)
  //     .subscribe(
  //       (res) => {
  //         this.loaderService.display(false);
  //         this.leadIntakeStatus = res.user.is_cm_enable; //response should be either true or false;
  //       },
  //       (err) => {
  //         this.loaderService.display(false);
  //       }
  //     );
  // }

  public ngOnDestroy(): void {
    //unsubscribing to the subscriptions when the component is destroyed.
    if (
      this.getLeadIntakeStatusSubscription &&
      !this.getLeadIntakeStatusSubscription.closed
    ) {
      this.getLeadIntakeStatusSubscription.unsubscribe();
    }
    if (
      this.changeLeadIntakeStatusSubscription &&
      !this.changeLeadIntakeStatusSubscription.closed
    ) {
      this.changeLeadIntakeStatusSubscription.unsubscribe();
    }
  }
  downloadExcelBoqLineItems() {
    this.loaderService.display(true);
    this.cmService.downloadExcelBoqLineItems().subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage =
          "The BOQ Line Items report you requested is being created. It will be emailed to you once complete.!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  downloadPaymentReport() {
    this.leadService.exportPaymentEvent().subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage =
          "The Payment report you requested is being created. It will be emailed to you once complete.!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
        $("#downloadreport").modal("hide");
      },
      (err) => {}
    );
  }
  // downloadFromModal(){
  //    $("#editModal").modal("hide");
  // }
  /*Dropdown Onchange function*/
  /*Call end points*/
  getReferListForSelect() {
    this.leadService.getReferListForSelect(this.user_id).subscribe(
      (res) => {
        this.lead_referrer_list = res["referral_roles"];
      },
      (err) => {}
    );
  }

  onChangeOfLeadSource(val) {
    for (var i = 0; i < this.lead_referrer_list.length; i++) {
      if (val == this.lead_referrer_list[i].name) {
        this.addLeadForm.controls["lead_source_type"].setValue(
          this.lead_referrer_list[i].name
        );
        if (
          this.addLeadForm.controls["lead_source_type"].value ==
            "design_partner_referral" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "client_referral" ||
          this.addLeadForm.controls["lead_source_type"].value == "broker" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "display_dealer_referral" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "non_display_dealer_referral" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "employee_referral" ||
          this.addLeadForm.controls["lead_source_type"].value == "dealer" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "arrivae_champion" ||
          this.addLeadForm.controls["lead_source_type"].value == "others" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "non_display_dealer" ||
          this.addLeadForm.controls["lead_source_type"].value ==
            "associate_partner"
        ) {
          this.getReferUserList(
            val,
            this.addLeadForm.controls["lead_source_type"].value
          );
        }
      }
    }
  }
  /*OnChange User List*/
  userList: any;
  getReferUserList(referId, referName) {
    this.leadService.getReferUserList(this.user_id, referName).subscribe(
      (res) => {
        this.userList = res["users"];
      },
      (err) => {}
    );
  }

  setLeadStatus1(value) {
    if (value == "follow_up") {
      document
        .getElementById("addleadFormdatetime")
        .setAttribute("style", "display: block");
      document
        .getElementById("addleadFormRemark")
        .setAttribute("style", "display: block");
    } else {
      document
        .getElementById("addleadFormdatetime")
        .setAttribute("style", "display: none");
      document
        .getElementById("addleadFormRemark")
        .setAttribute("style", "display: none");
    }
    if (value == "lost") {
      document
        .getElementById("addleadFormlostReason")
        .setAttribute("style", "display: block");
    } else {
      document
        .getElementById("addleadFormlostReason")
        .setAttribute("style", "display: none");
    }
  }
  attachment_file: any;
  uploadCV(event) {
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    fileReader.readAsDataURL(this.attachment_file);
  }
  reasonForLostDropdownChange(val) {
    if (val == "others") {
      document
        .getElementById("addleadFormquestremark")
        .setAttribute("style", "display:block");
      this.addLeadForm.controls["lost_remark"].setValidators([
        Validators.required,
      ]);
    } else {
      if (document.getElementById("addleadFormquestremark"))
        document
          .getElementById("addleadFormquestremark")
          .setAttribute("style", "display:none");
      this.addLeadForm.controls["lost_remark"].setValue("");
      this.addLeadForm.controls["lost_remark"].validator = null;
    }
    this.addLeadForm.controls["lost_remark"].updateValueAndValidity();
  }
  closeModalQues(msg?) {
    this.addLeadDetails = undefined;
    document.getElementById("addLeadFormhide").style.display = "block";
    document.getElementById("addleadquestionnaireForm").style.display = "none";
    $("#addNewLeadModal").modal("hide");
    if (msg) {
      this.successalert = true;
      this.successMessage = msg;
      setTimeout(
        function () {
          this.successalert = false;
        }.bind(this),
        10000
      );
    }
  }
  LineURL: any;
  downloadNewLineItems() {
    this.loaderService.display(true);
    this.leadService.downNewLineItemsReport().subscribe(
      (res) => {
        this.LineURL = res.boq_line_item_report;
        this.loaderService.display(false);
        this.successalert = true;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }
  boqURL: any;
  downloadNewBoqLineItems() {
    this.loaderService.display(true);
    this.leadService.downNewBoqReport().subscribe(
      (res) => {
        this.boqURL = res.boq_report;
        this.loaderService.display(false);
        this.successalert = true;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  downloadCallData() {
    this.leadService
      .downloadCallEvent(this.downloadCallReport_form.value)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.btnValue = false;
          this.countTis = false;
          this.downloadCallReport_form.reset();
          $("#reportModal").modal("hide");
          this.successMessage = "The Call report downloaded";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
        },
        (err) => {
          this.errorMessage = "Error";
        }
      );
  }

  countTis: boolean = false;
  showData() {
    this.countTis = !this.countTis;
  }

  btnValue: boolean = false;
  showNextData() {
    this.btnValue = true;
  }

  downloadPromoPackages() {
    this.loaderService.display(true);
    this.leadService.downloadServicesPackages().subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Services Packages Downloaded Successfully!";
        var contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        var b64Data = res.excel_base_64;
        var blob = this.b64toBlob(b64Data, contentType, 512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser =
          navigator.userAgent.indexOf("Safari") != -1 &&
          navigator.userAgent.indexOf("Chrome") == -1;
        if (isSafariBrowser) {
          //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", blobUrl);
        dwldLink.setAttribute("download", "services-package-report.xlsx");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
      }
    );
  }
  closemodal() {
    $("#downloadreport").modal("hide");
  }

  nocHighlights;
  leadNOChighlight() {
    this.loaderService.display(true);
    this.cmService.getLeadNOCHighlights(this.cmid,this.smid).subscribe((res) => {
      this.nocHighlights = res;
    });
  }

  threeplusmeeting;
  getthreeplusmeeting() {
    this.loaderService.display(true);
    this.cmService.getthreeplusmeeting(this.cmid,this.smid).subscribe((res) => {
      this.threeplusmeeting = res;
    });
  }
  listofstore;
  getallstore() {
    this.cmservice.GetstoresfilterCMD().subscribe((res) => {
      this.listofstore = res.store;
    });
  }


  clearAll(){
    this.date_from='';
    this.date_to='';
    this.filter_designer='';
    this.CM=null;
    this.DM=null;
    this.SM=null;
    this.cmid='';
    this.smid='';
    this.date_from = "";
    this.date_to="";
    this.cmid='';
    this.smid='';
    this.filterDashboard()
  }
}
