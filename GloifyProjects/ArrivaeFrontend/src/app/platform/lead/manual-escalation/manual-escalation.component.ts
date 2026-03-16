
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'app/services/loader.service';
import { LeadService } from '../lead.service';
import { FormBuilder, FormGroup, Validators ,FormArray,FormControl} from '@angular/forms';
declare var $: any;

import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;



@Component({
  selector: "app-manual-escalation",
  templateUrl: "./manual-escalation.component.html",
  styleUrls: ["./manual-escalation.component.css"],
  providers: [LeadService],
})
export class ManualEscalationComponent implements OnInit {
  successError: boolean = false;
  successMessage: string;
  role: string;
  filter_store: any;
  filter_escalation: any;
  gm_filter :any
  leadidlength: any;
  filterforStatus: any;
  filter_essource;
  get notify(): FormArray {
    return this.manualEscalationForm.get("notify") as FormArray;
  }
  get notify2(): FormArray {
    return this.editEscalation.get("notify") as FormArray;
  }
  addemail() {
    this.notify.push(
      this.formBuilder.control(
        "",
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      )
    );
  }
  addemail2() {
    this.notify2.push(
      this.formBuilder.control(
        "",
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      )
    );
  }
  constructor(
    private loaderService: LoaderService,
    private leadService: LeadService,
    private formBuilder: FormBuilder
  ) {}

  manualEscalationForm: FormGroup;
  editEscalation: FormGroup;
  statusUpdate: FormGroup;
  from_date: any;
  to_date: any;
  final_from_date: any;
  final_to_date: any;
  minDate = new Date();
  index: any;
  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.getEscalationData("");
    this.getEscalationStageValues("");
    this.escalationByStore();
    this.getAllESCsource();
    this.GmData()
    this.filter_store = "All";
    this.filter_escalation = "All";
    this.gm_filter = "All"
    this.filter_essource = "All";
    if (this.index == undefined) {
      this.index = 0;
    }
    this.manualEscalationForm = this.formBuilder.group({
      lead_id: [null, Validators.required],
      quotation_id: [""],
      source: [null, Validators.required],
      escalation_stage: [null, Validators.required],
      description: [null, Validators.required],
      expected_action: [null, Validators.required],
      assigned_team: ["", Validators.required],
      assigned_member: [""],
      is_office_user: [""],
      secondary_assigned_team: [""],
      secondary_assignee_id: [""],
      secondary_office_user: [""],
      expected_resolution_date: [null, Validators.required],
      notify: this.formBuilder.array([]),
    });
    this.editEscalation = this.formBuilder.group({
      lead_id: [null, Validators.required],
      quotation_id: [""],
      source: [null, Validators.required],
      escalation_stage: [null, Validators.required],
      description: [null, Validators.required],
      expected_action: [null, Validators.required],
      assigned_team: [null, Validators.required],
      assigned_member: [""],
      is_office_user: [""],
      secondary_assigned_team: [""],
      secondary_assignee_id: [""],
      secondary_office_user: [""],
      expected_resolution_date: [null, Validators.required],
      notify: this.formBuilder.array([]),
    });
    this.filterforStatus = "";
    this.statusUpdate = this.formBuilder.group({
      comments: [null, Validators.required],
    });
  }

  manualEscalatedData: any;
  selectedId: any;
  convertValue: any;
  AssignedMember: any;

  getManualEscalatedLeads(event) {
    this.selectedId = event;
    this.leadService
      .getAssignedToMember(this.selectedId, this.leadId)
      .subscribe((res) => {
        this.AssignedMember = res[0].id;
        this.manualEscalationForm.controls["assigned_member"].setValue(
          this.AssignedMember
        );
        this.primaryassigne = res[0].role_id;
        this.manualEscalationForm.controls["is_office_user"].setValue(
          res[0].office_user
        );
      },
      err=>{
        this.errorMessageShow(JSON.parse(err["_body"])[0].massage);
          this.manualEscalationForm.controls["assigned_team"].setValue(null);
          this.primaryassigne = null;
           this.manualEscalationForm.controls["assigned_member"].setValue(
             null
           );

      });
  }
  secondaryAssign: any;
  getManualEscalatedLeads2(event) {
    this.selectedId = event;
    if(event == undefined){
      this.secondaryAssign = null;
      this.manualEscalationForm.controls["secondary_assignee_id"].setValue(
        null
      );
    } else{
      this.leadService
        .getAssignedToMember(this.selectedId, this.leadId)
        .subscribe(
          (res) => {
            this.manualEscalationForm.controls[
              "secondary_assignee_id"
            ].setValue(res[0].id);
            this.secondaryAssign = res[0].role_id;
            this.manualEscalationForm.controls[
              "secondary_office_user"
            ].setValue(res[0].office_user);
          },
          (err) => {
            this.errorMessageShow(JSON.parse(err["_body"])[0].massage);
            this.manualEscalationForm.controls[
              "secondary_assigned_team"
            ].setValue(null);
            this.secondaryAssign = null;
            this.manualEscalationForm.controls[
              "secondary_assignee_id"
            ].setValue(null);
          }
        );
    }
  }
  primarysAssaineforedit: any;
  SecondarysAssaineforedit: any;
  getManualEscalatedLeadseidt(event) {
    this.selectedId = event;
    this.selectedIDedit = event;
    this.leadService
      .getAssignedToMember(this.selectedId, this.leadId)
      .subscribe(
        (res) => {
          this.AssignedMember = res[0].id;
          this.editEscalation.controls["assigned_member"].setValue(res[0].id);
          this.primarysAssaineforedit = res[0].role_id;
          this.editEscalation.controls["is_office_user"].setValue(
            res[0].office_user
          );
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"])[0].massage);
           this.editEscalation.controls["assigned_team"].setValue(null);
            this.primarysAssaineforedit = null;
        }
      );
  }

  getManualEscalatedLeads2edit(event) {
    this.selectedId = event;
    if(event == undefined){
        this.SecondarysAssaineforedit = null;
          this.editEscalation.controls["secondary_assignee_id"].setValue(
            null
          );
    } else{
         this.leadService
           .getAssignedToMember(this.selectedId, this.leadId)
           .subscribe(
             (res) => {
               this.editEscalation.controls["secondary_assignee_id"].setValue(
                 res[0].id
               );
               this.SecondarysAssaineforedit = res[0].role_id;
               this.editEscalation.controls["secondary_office_user"].setValue(
                 res[0].office_user
               );
             },
             (err) => {
               this.errorMessageShow(JSON.parse(err["_body"])[0].massage);
               this.editEscalation.controls["secondary_assigned_team"].setValue(
                 null
               );
               this.SecondarysAssaineforedit = null;
                 this.editEscalation.controls["secondary_assignee_id"].setValue(
                   null
                 );
             }
           );
    }
   
  }

  player: FormGroup;

  removeitem(i) {
    this.notify.removeAt(i);
  }

  nameRefract(data) {
    if (data) {
      let fdata = this.ESCsources.filter((el) => {
        return el.value == data;
      });
      if (fdata.length > 0) {
        fdata = fdata[0].key;
        return fdata;
      } else {
        fdata = "";
      }
    }
  }
  assignedMember: any;
  primaryassigne: any;
  assignedToMember() {
    this.leadService
      .getAssignedToMember(
        this.selectedId,
        this.manualEscalationForm.value.lead_id
      )
      .subscribe((res) => {
        if (res.length > 0) {
          this.assignedMember = res;
          this.manualEscalationForm.controls["assigned_member"].setValue(
            this.assignedMember[0].id
          );
        }
      });
  }
  getManualEscalatedLeadsedit() {}
  updateassigned: any;
  selctedstageforedit: any;
  updateassignedMember(e) {
    let vk = e;

    this.leadService
      .getAssignedToMember(vk, this.upadateleadid)
      .subscribe((res) => {
        this.updateassigned = res[0].id;
        this.editEscalation.controls["assigned_member"].setValue(
          this.updateassigned
        );
      });
  }
  boqIds: any;
  lead_Name: any;
  leadId: any;
  getBOQValues() {
    if (this.manualEscalationForm.value.lead_id !== null) {
      this.leadService
        .getBoqIds(this.manualEscalationForm.value.lead_id)
        .subscribe((res) => {
          if (res.status && res.status == 400) {
            this.errorMessageShow(res.message);
          } else {
            this.boqIds = res.boqs;
            this.lead_Name = res.lead.name;
            this.leadId = res.lead.id;
          }
        });
    }
  }
  leadDetails() {
    this.getBOQValues();
  }
  getallroles() {
    this.leadService.getAllRoles().subscribe((res) => {
      this.manualEscalatedData = res;
    });
  }
  escalatedStageValues: any;
  stage: any;
  stageSelected;
  getEscalationStageValues(e) {
    this.stageSelected = e;
    this.leadService.EscalationStage().subscribe((res) => {
      this.escalatedStageValues = res;
    });
  }
  getEscalationStageValuesedit(e) {
    this.selctedstageforedit = e;
  }
  currentPage: any;
  perPage: any;
  total_items: any;
  sortColumn: any;
  sortOrder: any;
  status: any;
  escalationStage: any;
  fromDate: any;
  toDate: any;
  store: any;

  escalationTableData: any;
  getEscalationData(e) {
    if (e !== undefined && e !== "") {
      this.currentPage = e;
    }
    if (this.currentPage == undefined) {
      this.currentPage = 1;
    }
    if (this.perPage == undefined) {
      this.perPage = 10;
    }
    if (this.sortColumn == undefined) {
      this.sortColumn = "";
    }
    if (this.sortOrder == undefined) {
      this.sortOrder = "";
    }
    if (this.status == undefined) {
      this.status = "";
    }

    if (this.escalationStage == undefined) {
      this.escalationStage = "";
    }

    if (this.selectedGm == undefined) {
      this.selectedGm = "";
    }

    if (this.fromDate == undefined) {
      this.fromDate = "";
    }
    if (this.toDate == undefined) {
      this.toDate = "";
    }

    if (this.store == undefined) {
      this.store = "";
    }
    this.loaderService.display(true);
    this.leadService
      .getAllManualEsclation(
        this.currentPage,
        this.perPage,
        this.sortColumn,
        this.sortOrder,
        this.status,
        this.store,
        this.escalationStage,
        this.fromDate,
        this.toDate,
        this.escsourc,
        this.selectedGm
      )
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.escalationTableData = res.data.manual_escalations;
          this.total_items = res.data.count;
          this.currentPage = res.data.page_number;
          this.perPage = 10;
        },
        (err) => {
          this.loaderService.display(false);
          this.escalationTableData = [];
        }
      );
  }
  deleteEscalation(id) {
    if (confirm("Are You Sure To Delete Escalation") == true) {
      this.loaderService.display(true);
      this.leadService.deleteManualEscalation(id).subscribe(
        (res) => {
          if (res.status && res.status == 400) {
            this.errorMessageShow(res.message);
          } else {
            this.successMessageShow(res.message);
          }

          this.loaderService.display(false);
          this.getEscalationData("");
        },
        (err) => {
          this.loaderService.display(false);

          if (err.status && err.status == 500) {
            this.errorMessageShow(JSON.parse(err["_body"]).error);
          } else {
            this.errorMessageShow(JSON.parse(err["_body"]).message);
          }
        }
      );
    }
  }

  statusData: any = {};
  statusValue: any;
  eachStatusId: any;
  onStatusChange(id, e) {
    this.statusValue = e;
    this.eachStatusId = id;
    if (e != "") {
      $("#statusModal").modal("show");
    }
  }
  updateStatus() {
    this.statusData["status"] = this.statusValue;
    this.statusData["comments"] = this.statusUpdate.controls["comments"].value;
    this.loaderService.display(true);
    this.leadService
      .statusChange(this.eachStatusId, this.statusData)
      .subscribe((res) => {
        this.loaderService.display(false);
        this.getEscalationData("");
      });
    $("#statusModal").modal("hide");
    this.statusUpdate.reset();
  }
  eachEscalation: any;
  idToEdit: any;
  upadateleadid: any;
  expected_Resolution_date;
  selectedIDedit: any;
  viewEachEscalation(id) {
    this.clearFormArray2(this.notify2);
    this.getallroles();
    this.idToEdit = id;
    this.leadService.eachEscalationById(id).subscribe((res) => {
      let convert = "" + res.assigned_team.role_name;
      this.eachEscalation = res;
      this.upadateleadid = res.lead.lead_id;
      let esc = this.eachEscalation.escalation_stage.toLowerCase();
      let esc2 = esc.split(" ");
      esc2 = esc2.join("_");
      if (esc2 == "40%_payment") {
        esc2 = "per_40_payment";
      } else {
        esc2 = esc2;
      }
      if (esc2 == "Post-10% Site Measurement") {
        esc2 = "post_10_per_site_measurement";
      }
      this.updateBoq();
      this.editEscalation.controls["lead_id"].setValue(res.lead.lead_id);
      this.editEscalation.controls["quotation_id"].setValue(res.boq.boq_id);
      this.editEscalation.controls["source"].setValue(res.source);

      this.editEscalation.controls["escalation_stage"].setValue(esc2);
      this.editEscalation.controls["description"].setValue(res.description);
      this.editEscalation.controls["expected_action"].setValue(
        res.expected_action
      );

      this.editEscalation.controls["assigned_team"].setValue(convert);
      this.editEscalation.controls["assigned_member"].setValue(
        res.assigned_member.user_id
      );
      this.editEscalation.controls["expected_resolution_date"].setValue(
        res.expected_resolution_date
      );
      this.editEscalation.controls["secondary_assigned_team"].setValue(
        res.secondary_assigned_team.role_name
      );
      this.editEscalation.controls["is_office_user"].setValue(
        res.is_office_user
      );
      this.editEscalation.controls["secondary_assignee_id"].setValue(
        res.secondary_assigned_team.user_id
      );
      this.editEscalation.controls["secondary_office_user"].setValue(
        res.secondary_office_user
      );
      this.primarysAssaineforedit = res.assigned_team.role_id;
      this.SecondarysAssaineforedit = res.secondary_assigned_team.role_id;

      this.expected_Resolution_date = res.expected_resolution_date;
      this.selctedstageforedit = res.escalation_stage;
      this.selectedIDedit = res.assigned_team.role_name;
      this.leadId = res.lead.lead_id;
      res.notify.forEach((element) => {
        this.notify2.push(
          this.formBuilder.control(
            element,
            Validators.pattern(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
          )
        );
      });

      console.log(this.notify2);
    });

    $("#escalationEditModal").modal("show");
  }
  updateBoq() {
    this.leadService
      .getBoqIds(this.eachEscalation.lead.lead_id)
      .subscribe((res) => {
        this.boqIds = res.boqs;
      });
  }

  editEscalationSubmit() {
    console.log(this.SecondarysAssaineforedit);
    this.editEscalation.controls["assigned_team"].setValue(
      this.primarysAssaineforedit
    );
    this.editEscalation.controls["secondary_assigned_team"].setValue(
      this.SecondarysAssaineforedit
    );
    this.loaderService.display(true);
    $("#escalationEditModal").modal("hide");
    this.leadService
      .editEachEscalation(this.idToEdit, this.editEscalation.value)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          if (res.status && res.status == 400) {
            this.errorMessageShow(res.message);
          } else {
            this.successMessageShow(res.message);
          }
          this.getEscalationData("");
        },
        (err) => {
          if (err.status && err.status == 500) {
            this.errorMessageShow(JSON.parse(err["_body"]).error);
          } else {
            this.errorMessageShow(JSON.parse(err["_body"]).message);
          }
        }
      );
  }
  storeByEscalation: any;
  escalationByStore() {
    this.leadService.escalationByStore().subscribe((res) => {
      this.storeByEscalation = res;
    });
  }
  listingData : any
  GmData(){
    this.leadService.GMListing().subscribe( res =>{
      console.log(res);
      this.listingData = res
    })
  }
  selectStore(e) {
    this.store = e;
    this.getEscalationData("");
  }
  selectedGm :any
  selectGm(e) {
    this.selectedGm = e
    console.log(e);
    
    this.getEscalationData('')
  }

  escsourc: any;
  selectesc(e) {
    this.escsourc = e;
    this.getEscalationData("");
  }
  selectEscalation(e) {
    this.escalationStage = e;
    this.getEscalationData("");
  }
  addEscalationForm() {
    this.getallroles();
    this.lead_Name = "";
    this.manualEscalationForm.reset();
    $("#escalationModal").modal("show");
    this.expected_Resolution_date = "";
    this.selectedId ='';
    this.stageSelected ='';

  }
  clearFormArray = (formArray: FormArray) => {
    while (this.notify.length !== 0) {
      this.notify.removeAt(0);
    }
  };
  clearFormArray2 = (formArray: FormArray) => {
    while (this.notify2.length !== 0) {
      this.notify2.removeAt(0);
    }
  };

  closeModal() {
    this.lead_Name = "";
    $("#log_modal").modal("hide");
    $("#escalationModal").modal("hide");
    $("#escalationEditModal").modal("hide");
    this.manualEscalationForm.reset();
    this.notify.reset();
    this.clearFormArray(this.notify);
  }
  closeModal2() {
    console.log(this.notify2);
    this.clearFormArray2(this.notify2);
  }
  EscalationSubmit() {
    this.manualEscalationForm.controls["assigned_team"].setValue(
      this.primaryassigne
    );
    this.manualEscalationForm.controls["secondary_assigned_team"].setValue(
      this.secondaryAssign
    );
    console.log(this.manualEscalationForm.value);
    console.log(this.manualEscalationForm.valid);

    $("#escalationModal").modal("hide");
    let team = parseInt(
      this.manualEscalationForm.controls["assigned_team"].value
    );
    let quation = parseInt(
      this.manualEscalationForm.controls["quotation_id"].value
    );
    this.manualEscalationForm.controls["assigned_team"].setValue(team);
    this.manualEscalationForm.controls["quotation_id"].setValue(quation);
    console.log(this.manualEscalationForm.controls);

    this.loaderService.display(true);
    this.leadService
      .SubmitEscalation(this.manualEscalationForm.value)
      .subscribe((res) => {
        this.loaderService.display(false);
        this.successError = true;
        this.successMessage = res.message;
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          4000
        );
        this.clearFormArray(this.notify);
        this.getEscalationData("");
      });
  }

  submitByDate() {
    if (this.selectedGm == undefined) {
      this.selectedGm = "";
    }

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
    if (this.final_from_date == undefined) {
      this.final_from_date = "";
    }
    if (this.final_to_date == undefined) {
      this.final_to_date = "";
    }

    if (this.final_from_date == "" && this.final_to_date == "") {
      this.errorMessageShow("Please Add Data To Search");
    } else {
      this.loaderService.display(true);
      this.leadService
        .getAllManualEsclation(
          this.currentPage,
          this.perPage,
          this.sortColumn,
          this.sortOrder,
          this.status,
          this.store,
          this.escalationStage,
          this.final_from_date,
          this.final_to_date,
          this.escsourc ,
          this.selectedGm
        )
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.escalationTableData = res.data.manual_escalations;
            this.total_items = res.data.count;
            this.currentPage = res.data.page_number;
            this.perPage = 10;
          },
          (err) => {
            this.loaderService.display(false);
          }
        );
    }
  }

  ClearDateFilter() {
    this.currentPage = 1;
    this.perPage = 10;
    this.sortColumn = "";
    this.sortOrder = "";
    this.status = "";
    this.escalationStage = "";
    this.to_date = "";
    this.from_date = "";
    this.final_from_date = "";
    this.final_to_date = "";
    this.store = "";
    this.filter_store = "All";
    this.filter_escalation = "All";
    this.gm_filter = "All"
    this.filterforStatus = "";
    this.filter_essource = "";
    this.escsourc = "";

    this.getEscalationData("");
  }
  filterStatus(e) {
    this.status = e.target.value;
    this.getEscalationData("");
  }

  eachEscalationLogData: any;
  logPage: any;
  logPerPage: any;
  logTotalItems: any;
  logId: any;
  eachEscalationLog2(e) {
    this.logPage = 1;
    this.eachEscalationLog(e, "");
    $("#log_modal").modal("show");
  }
  eachEscalationLog(e2, e) {
    this.logId = e2;
    if (e !== undefined && e !== "") {
      this.logPage = e;
    }
    if (this.logPage == undefined) {
      this.logPage = 1;
    }
    if (this.logPerPage == undefined) {
      this.logPerPage = 10;
    }
    this.loaderService.display(true);
    this.leadService
      .eachescalationlog(this.logId, this.logPage, this.perPage)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.eachEscalationLogData = res.data.manual_escalation_logs;
          this.logPage = res.data.page_number;
          this.logPerPage = 10;
          this.logTotalItems = res.data.count;
        },
        (err) => {
          this.loaderService.display(false);
          // this.errorMessageShow()
        }
      );
  }
  objget(data) {
    if (data) {
      return Object.keys(data)[0];
    }
  }
  erroralert: any;
  errorMessage;
  successalert;
  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      4000
    );
  }
  successMessageShow(msg) {
    this.successError = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successError = false;
      }.bind(this),
      4000
    );
  }
  DecForMoretitle: any;
  DecForMore: any;
  linkMore(e, e2) {
    this.DecForMoretitle = e2;
    this.DecForMore = e;
    $("#glassAnimals").modal("show");
  }
  private _trasformDateType(dateValue) {
    return moment(dateValue).format("DD/MM/yyyy");
  }

  // openpopup(event, id) {
  //   var thisobj = this;
  //   $(event.target).popover({
  //     trigger: "hover",
  //   });
  //   $(function () {
  //     $(".pop").popover({
  //       trigger: "hover",
  //     });
  //   });
  // }

  handleInvoiceDateeditSelectEvent(event: any) {
    this.editEscalation.controls["expected_resolution_date"].setValue(
      this._trasformDateType(event)
    );
  }
  handleInvoiceDateeditSelectEvent2(event: any) {
    this.manualEscalationForm.controls["expected_resolution_date"].setValue(
      this._trasformDateType(event)
    );
  }
  ESCsources: any = [];
  getAllESCsource() {
    this.leadService.getESCsource().subscribe(
      (res) => {
        this.ESCsources = res;
      },
      (err) => {
        this.ESCsources = [];
      }
    );
  }

  openpopup() {
    ($('#subTableModal') as any).modal('show');
  }

  page2:any=1;
  perPage2:any=10;
  total_page2:any;
  escalationId:any;
  modalEscalationTableData:any=[];
  showPagination:number;
  modalEscalationData(event?:any,page?:any){
    if(page==undefined){
      this.page2=1;
    }else{
      this.page2=page;
    }
    console.log(event);
    if(event!=''){
this.escalationId=event;
    }
    this.leadService
    .eachescalationMoadalLog(this.escalationId, this.page2, this.perPage2)
    .subscribe((res)=>{
   this.modalEscalationTableData=[]
   this.modalEscalationTableData=res.data.manual_escalation_logs;
   this.page2=res.data.page_number;
   this.total_page2= res.data.count;
   this.showPagination=res.data.pages;
   console.log(this.modalEscalationTableData);
    })
  }
}


