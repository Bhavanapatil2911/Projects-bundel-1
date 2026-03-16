import { Quotation } from './../../quotation/quotation';
import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { ProjectService } from '../../project/project/project.service';
import { FloorplanService } from '../../floorplans/floorplan/floorplan.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: "app-handover-for-production",
  templateUrl: "./handover-for-production.component.html",
  styleUrls: ["./handover-for-production.component.scss"],
  providers: [LeadService, ProjectService, FloorplanService],
})
export class HandoverForProductionComponent implements OnInit {
  lead_id;
  lead_status;
  role;
  lead_details;
  approveList: any;
  erroralert;
  erroralert1;
  errorMessage;
  successalert = false;
  successalert1 = false;
  successMessage: string;
  additionalFiles: any;
  direction: number;
  currentCostQCStatus;
  currentTechQCStatus;
  currentDesignQCStatus;
  showQCDetails = false;
  newCostQCStatus;
  newTechQCStatus;
  newDesignQCStatus;
  project_is_accept;
  createRequestForm: FormGroup;
  createMTOForm: FormGroup;
  emailverified:boolean

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public leadService: LeadService,
    public loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private floorplanService: FloorplanService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
    });
    this.route.queryParams.subscribe((params) => {
      this.lead_status = params["lead_status"];
    });
    this.createMTOForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      details: new FormControl("", Validators.required),
      attachment_file: new FormControl(""),
    });
    this.role = localStorage.getItem("user");
    this.emailverified = localStorage.getItem('emailverified') === 'true';
    this.fetchBasicDetails();
    this.initializeRequestForm();
   
  }
  initializeRequestForm() {
    this.createRequestForm = new FormGroup({
      request_type: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      scheduled_at: new FormControl("", Validators.required),
      project_id: new FormControl(""),
    });
  }
  selectedArrow;
  arrow: boolean;
  child_cat;
  selectedQuotationStatus = -1;
  toggleRow(row, i, category) {
    // if(category != 'Quotation'){
    this.child_cat = category;
    this.all_file_list[category].forEach((file) => {
      if (row.id !== file.id) {
        file["expanded"] = false;
      } else {
        row.expanded = !row.expanded;
      }
    });
    this.selectedQuotationStatus = row.id;
    this.selectedArrow = i;
    this.viewChild(row);
    if (this.arrow) {
      this.arrow = false;
      this.selectedQuotationStatus  = null ;
    } else {
      this.arrow = true;
    }

    // }
  }
  child_list;
  parent_view_id;
  viewChild(obj) {
    if (obj.parent_id) {
      this.parent_view_id = obj.parent_id;
    } else {
      this.parent_view_id = obj.id;
    }

    this.loaderService.display(true);
    this.leadService
      .getViewChild(this.project_id, this.parent_view_id)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.child_list = res["project_handover"]["child_details"];
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  project_id;
  is_before_email_verify:any=true
  fetchBasicDetails() {
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res["lead"];
        localStorage.setItem('lead_details', JSON.stringify(this.lead_details))
        this.project_id = res["lead"].project_details.id;
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        this.getFileDetails();
        this.getAdditionalFiles();
        this.getspaceslist();
        this.getspacesdynamic()
      },
      (err) => {}
    );
  }
  all_file_list;
  slectedFile_arr = [];
  filterdepartment = "all";
  filterspace = "all";
  getFileDetails() {
    this.loaderService.display(true);
    this.leadService
      .getFileDetails(this.project_id, this.filterspace, this.filterdepartment)
      .subscribe(
        (res) => {
          this.all_file_list = [];
          this.slectedFile_arr = [];
          this.all_file_list = res.project_handover;
          this.showQCDetails = true;
          this.currentCostQCStatus = res.project_handover
            .project_handover_qcs[1]
            ? res.project_handover.project_handover_qcs[1].status
            : "Pending";
          this.currentTechQCStatus = res.project_handover
            .project_handover_qcs[2]
            ? res.project_handover.project_handover_qcs[2].status
            : "Pending";
          this.currentDesignQCStatus = res.project_handover
            .project_handover_qcs[0]
            ? res.project_handover.project_handover_qcs[0].status
            : "Pending";

          // this.ref.detectChanges();

          this.newCostQCStatus = res.project_handover.project_handover_qcs[1]
            ? res.project_handover.project_handover_qcs[1].status
            : "Pending";
          this.newTechQCStatus = res.project_handover.project_handover_qcs[2]
            ? res.project_handover.project_handover_qcs[2].status
            : "Pending";
          this.newDesignQCStatus = res.project_handover.project_handover_qcs[0]
            ? res.project_handover.project_handover_qcs[0].status
            : "Pending";

          for (let i = 0; i < this.all_file_list.all_files.length; i++) {
            if (this.all_file_list.all_files[i] == "Quotation") {
              this.slectedFile_arr.push("BOQ");
            } else if (this.all_file_list.all_files[i] == "BoqAndPptUpload") {
              this.slectedFile_arr.push("PPT");
            } else if (this.all_file_list.all_files[i] == "Floorplan") {
              this.slectedFile_arr.push(" Floor Plan / Layout");
            } else if (this.all_file_list.all_files[i] == "CadDrawing") {
              this.slectedFile_arr.push("Cad Drawings");
            } else if (this.all_file_list.all_files[i] == "Elevation") {
              this.slectedFile_arr.push("Elevations");
            } else if (this.all_file_list.all_files[i] == "ReferenceImage") {
              this.slectedFile_arr.push("Refrence Images");
            } else if (
              this.all_file_list.all_files[i] == "SiteMeasurementRequest"
            ) {
              this.slectedFile_arr.push("Site Measurement Request");
            } else if (this.all_file_list.all_files[i] == "ThreeDImage") {
              this.slectedFile_arr.push("3-D Files");
            } else if (this.all_file_list.all_files[i] == "LineMarking") {
              this.slectedFile_arr.push("Line Marking");
            } else if (this.all_file_list.all_files[i] == "MtoUpload") {
              this.slectedFile_arr.push("MTO Files");
            }
          }
          this.loaderService.display(false);
          if (this.all_file_list.handover_active) {
            $("#hand-active").prop("disabled", false);
            $("#hand-active").css("cursor", "pointer");
          } else {
            $("#hand-active").prop("disabled", true);
            $("#hand-active").css("cursor", "not-allowed");
          }
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  getDepartment(e) {
    this.filterdepartment = e;
    this.getFileDetails();
    if(document.getElementById('departmentDropdown')){
      document.getElementById('departmentDropdown').click();
    }
  }
  getSPACES(e){
     this.filterspace = e;
     this.getFileDetails();
     if(document.getElementById('spaceDropdown')){
      document.getElementById('spaceDropdown').click();
    }
  }
  filter_by_area;
  FilterByArea(value) {
    this.filter_by_area = value;
  }
  boq_file_list;
  cad_file_list: any = [];
  floorplan_file_list;
  elevation_file_list;
  ppt_file_list;
  three_d_file_list;
  site_request_file_list;
  reference_file_list;
  line_marking_list;
  mtofiles: any;
  getFileList() {
    this.loaderService.display(true);
    this.leadService.getFileList(this.project_id).subscribe(
      (res) => {
        this.boq_file_list = res.Quotation;

        this.cad_file_list = res.CadDrawing;
        this.line_marking_list = res.LineMarking;
        this.floorplan_file_list = res.Floorplan;
        this.mtofiles = res.MtoUpload;
        this.elevation_file_list = res.Elevation;
        this.ppt_file_list = res.BoqAndPptUpload;
        this.three_d_file_list = res.ThreeDImages;
        this.site_request_file_list = res.SiteMeasurementRequest;
        this.reference_file_list = res.ReferenceImage;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  selectFloorPlans(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectFloor($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedFloorplanIds: any = [];
  selectFloor(checked, floorplanValue, index) {
    if (checked) {
      if (this.selectedFloorplanIds.includes(floorplanValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedFloorplanIds.push(floorplanValue.id);
      }
    } else {
      this.selectedFloorplanIds.splice(index, 1);
    }
  }
  selectBoqList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectBoq($("#obj" + obj.id).prop("checked"), obj, i); 

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedBoqIds: any = [];
  selectBoq(checked, boqValue, index) {
    if (checked) {
      if (this.selectedBoqIds.includes(boqValue.id)) {
        alert("Already Added In The List");
      }
      // else if (!boqValue.duration || boqValue.duration==0 ){
      //   alert("Duration data is not added for Selected BOQ, The Boq will not be selected .");
      //   $("#obj"+boqValue.id).prop('checked', !$("#obj"+boqValue.id).prop("checked"));
      // }
      else {
        this.selectedBoqIds.push(boqValue.id);
      }
    } else {
      this.selectedBoqIds.splice(index, 1);
    }
  }
  // Method to select elevation
  selectElevationList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectElevation($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedElevationList: any = [];
  selectElevation(checked, elevValue, index) {
    if (checked) {
      if (this.selectedElevationList.includes(elevValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedElevationList.push(elevValue.id);
      }
    } else {
      this.selectedElevationList.splice(index, 1);
    }
  }
  // Method For 3-D Method
  selectThreeDList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectThreedList($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedThreeDList: any = [];
  selectThreedList(checked, threeValue, index) {
    if (checked) {
      if (this.selectedThreeDList.includes(threeValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedThreeDList.push(threeValue.id);
      }
    } else {
      this.selectedThreeDList.splice(index, 1);
    }
  }
  // Method For line marking Method
  selectLineMarkingList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectLineMarkingLists($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectMTO(obj, i) {
    event.preventDefault();

    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectLineMTOlist($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedMTOlist: any = [];
  selectedlineMarkingList: any = [];
  selectLineMarkingLists(checked, threeValue, index) {
    if (checked) {
      if (this.selectedlineMarkingList.includes(threeValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedlineMarkingList.push(threeValue.id);
      }
    } else {
      this.selectedlineMarkingList.splice(index, 1);
    }
  }
  selectLineMTOlist(checked, threeValue, index) {
    if (checked) {
      if (this.selectedMTOlist.includes(threeValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedMTOlist.push(threeValue.id);
      }
    } else {
      this.selectedMTOlist.splice(index, 1);
    }
  }
  // methpd To Select reference list
  selectreferenceList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectReferrer($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedReferenceList: any = [];
  selectReferrer(checked, refValue, index) {
    if (checked) {
      if (this.selectedReferenceList.includes(refValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedReferenceList.push(refValue.id);
      }
    } else {
      this.selectedReferenceList.splice(index, 1);
    }
  }
  // select ppt file list
  selectPptList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectPpt($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedPptList: any = [];
  selectPpt(checked, pptValue, index) {
    if (checked) {
      if (this.selectedPptList.includes(pptValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedPptList.push(pptValue.id);
      }
    } else {
      this.selectedPptList.splice(index, 1);
    }
  }
  //Maethod for cad Files
  selectcadList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectcadFiles($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedcadFileList: any = [];
  selectcadFiles(checked, cadValue, index) {
    if (checked) {
      if (this.selectedcadFileList.includes(cadValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedcadFileList.push(cadValue.id);
      }
    } else {
      this.selectedcadFileList.splice(index, 1);
    }
  }
  //Site Request List
  selectSiteRequestList(obj, i) {
    event.preventDefault();
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectSiteRequest($("#obj" + obj.id).prop("checked"), obj, i);

    if ($("#obj" + obj.id).prop("checked")) {
      $("." + obj.id).addClass("divActive");
    } else {
      $("." + obj.id).removeClass("divActive");
    }
  }
  selectedSiteRequestList: any = [];
  selectSiteRequest(checked, sireReqValue, index) {
    if (checked) {
      if (this.selectedSiteRequestList.includes(sireReqValue.id)) {
        alert("Already Added In The List");
      } else {
        this.selectedSiteRequestList.push(sireReqValue.id);
      }
    } else {
      this.selectedSiteRequestList.splice(index, 1);
    }
  }
  mto_department: any = "";
  mtospace: any = "";
  lmdepartment = "";
  lmspace = "";
  siterequestdep = "";
  siterequestspace = "";
  caddep = "";
  cadspace = "";
  referencedep = "";
  referencespace = "";
  threedep = "";
  threespace = "";
  pptdep = "";
  pptspace = "";
  eledep = "";
  elespace = "";
  fpdep = "";
  fpspace = "";

  mtochnage(e) {
    this.mto_department = e.target.value;
  }
  mtochnage2(e) {
    this.mtospace = e.target.value;
  }
  submitted2: any;

  // Method to Submit Form------------------------------------------------------
  submitForm() {
    if (
      (this.selectedMTOlist.length > 0 &&
        (this.mto_department == "" || this.mtospace == "")) ||
      (this.selectedPptList.length > 0 &&
        (this.pptdep == "" || this.pptspace == "")) ||
      (this.selectedFloorplanIds.length > 0 &&
        (this.fpdep == "" || this.fpspace == "")) ||
      (this.selectedcadFileList.length > 0 &&
        (this.caddep == "" || this.cadspace == "")) ||
      (this.selectedThreeDList.length > 0 &&
        (this.threedep == "" || this.threespace == "")) ||
      (this.selectedElevationList.length > 0 &&
        (this.eledep == "" || this.elespace == "")) ||
      (this.selectedReferenceList.length > 0 &&
        (this.referencedep == "" || this.referencespace == "")) ||
      (this.selectedlineMarkingList.length > 0 &&
        (this.lmdepartment == "" || this.lmspace == "")) ||
      (this.selectedSiteRequestList.length > 0 &&
        (this.siterequestdep == "" || this.siterequestspace == ""))
    ) {
      if (
        this.selectedMTOlist.length > 0 &&
        (this.mto_department == "" || this.mtospace == "")
      ) {
        alert("please select MTO department and spaces properly");
      }
      if (
        this.selectedPptList.length > 0 &&
        (this.pptdep == "" || this.pptspace == "")
      ) {
        alert("please select PPT department and spaces properly");
      }
      if (
        this.selectedFloorplanIds.length > 0 &&
        (this.fpdep == "" || this.fpspace == "")
      ) {
        alert("please select floorplan department and spaces properly");
      }
      if (
        this.selectedcadFileList.length > 0 &&
        (this.caddep == "" || this.cadspace == "")
      ) {
        alert("please select CAD department and spaces properly");
      }
      if (
        this.selectedThreeDList.length > 0 &&
        (this.threedep == "" || this.threespace == "")
      ) {
        alert("please select 3D department and spaces properly");
      }
      if (
        this.selectedElevationList.length > 0 &&
        (this.eledep == "" || this.elespace == "")
      ) {
        alert("please select Elevation department and spaces properly");
      }
      if (
        this.selectedReferenceList.length > 0 &&
        (this.referencedep == "" || this.referencespace == "")
      ) {
        alert("please select Reference department and spaces properly");
      }
      if (
        this.selectedlineMarkingList.length > 0 &&
        (this.lmdepartment == "" || this.lmspace == "")
      ) {
        alert("please select line marking department and spaces properly");
      }
      if (
        this.selectedSiteRequestList.length > 0 &&
        (this.siterequestdep == "" || this.siterequestspace == "")
      ) {
        alert("please select site request department and spaces properly");
      }
    } else {
      this.loaderService.display(true);
    let obj = {
      project_handover: {
        Quotation: {
          ids: this.selectedBoqIds,
        },
        MtoUpload: {
          ids: this.selectedMTOlist,
          department: this.mto_department,
          space: this.mtospace,
        },
        BoqAndPptUpload: {
          ids: this.selectedPptList,
          department: this.pptdep,
          space: this.pptspace,
        },
        Floorplan: {
          ids: this.selectedFloorplanIds,
          department: this.fpdep,
          space: this.fpspace,
        },
        CadDrawing: {
          ids: this.selectedcadFileList,
          department: this.caddep,
          space: this.cadspace,
        },
        ThreeDImage: {
          ids: this.selectedThreeDList,
          department: this.threedep,
          space: this.threespace,
        },
        Elevation: {
          ids: this.selectedElevationList,
          department: this.eledep,
          space: this.elespace,
        },
        ReferenceImage: {
          ids: this.selectedReferenceList,
          department: this.referencedep,
          space: this.referencespace,
        },
        SiteMeasurementRequest: {
          ids: this.selectedSiteRequestList,
          department: this.siterequestdep,
          space: this.siterequestspace,
        },
        LineMarking: {
          ids: this.selectedlineMarkingList,
          department: this.lmdepartment,
          space: this.lmspace,
        },
      },
    };
      
      this.leadService.submitSelectedFiles(this.project_id, obj).subscribe(
        (res) => {
          $("#addFilesModal").modal("hide");
          this.selectedBoqIds = [];
          this.selectedPptList = [];
          this.selectedFloorplanIds = [];
          this.selectedcadFileList = [];
          this.selectedThreeDList = [];
          this.selectedElevationList = [];
          this.selectedReferenceList = [];
          this.selectedlineMarkingList = [];
          this.selectedSiteRequestList = [];
          this.selectedMTOlist = [];
          this.slectedFile_arr = [];
          this.successalert = true;
          this.successMessage = "File Added successfully!";
          this.getFileDetails();
          this.mto_department = "";
          this.mtospace = "";
          this.lmdepartment = "";
          this.lmspace = "";
          this.siterequestdep = "";
          this.siterequestspace = "";
          this.caddep = "";
          this.cadspace = "";
          this.referencedep = "";
          this.referencespace = "";
          this.threedep = "";
          this.threespace = "";
          this.pptdep = "";
          this.pptspace = "";
          this.eledep = "";
          this.elespace = "";
          this.fpdep = "";
          this.fpspace = "";
          this.getspacesdynamic();

          this.loaderService.display(false);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            10000
          );
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
  closeFiles() {
    alert("All Changes Will be Gone");
    this.selectedBoqIds = [];
    this.selectedPptList = [];
    this.selectedFloorplanIds = [];
    this.selectedcadFileList = [];
    this.selectedThreeDList = [];
    this.selectedElevationList = [];
    this.selectedReferenceList = [];
    this.selectedSiteRequestList = [];
    this.selectedlineMarkingList = [];
    this.selectedMTOlist = [];
    $("#addFilesModal").modal("hide");
  }
  selectedHandoverList;
  boqWithoutDuration = [];
  gethandoverList() {
    this.loaderService.display(true);
    this.leadService.gethandoverList(this.project_id, "pending").subscribe(
      (res) => {
        this.selectedHandoverList = res.project_handover;
        this.loaderService.display(false);

        this.selectedHandoverList.Quotation.forEach((boq) => {
          if (!boq.duration || boq.duration == 0) {
            if (
              this.boqWithoutDuration.findIndex((p) => p.id == boq.id) == -1
            ) {
              this.boqWithoutDuration.push(boq);
            }
          }
        });
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  submitHandoverFiles() {
    var remark = $("#handoverRemark").val();

    let noDurationError = "";
    if (this.boqWithoutDuration.length > 0) {
      this.boqWithoutDuration.forEach((boq) => {
        noDurationError = noDurationError + boq.reference_number + ",";
      });
      this.errorMessageShow(
        noDurationError +
          "should not have duration equal to 0 , Please update the duration and try again !"
      );
    } else {
      this.loaderService.display(true);
      this.leadService.submitHandoverFiles(this.project_id, remark).subscribe(
        (res) => {
          $("#handoverModal").modal("hide");
          $("#handoverRemark").val("");
          this.successalert = true;
          this.successMessage = "File Added successfully!";
          this.getFileDetails();
          this.loaderService.display(false);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            10000
          );
          noDurationError = "";
          this.boqWithoutDuration = [];
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  closeFilesHand() {
    $("#handoverModal").modal("hide");
    $("#handoverRemark").val("");
  }
  category;
  revise_list;
  project_handoverId;
  file_obj;
  UpdateFile(category, obj) {
    this.file_obj = obj;
    if (obj.parent_id) {
      this.project_handoverId = obj.parent_id;
    } else {
      this.project_handoverId = obj.id;
    }

    this.category = category;
    this.leadService.getRevisedFile(this.project_id, category, 1).subscribe(
      (res) => {
        this.revise_list = res;
      },
      (err) => {}
    );
  }
  file_owner_id;
  selectReviseList(obj) {
    event.preventDefault();
    this.file_owner_id = obj.id;
  }
  closeEditModal() {
    this.file_owner_id = "";
    $("#EditModal").modal("hide");
  }
  submitFormForRevise() {
    if (this.file_owner_id == "") {
      alert("Please select any one option");
    } else {
      this.loaderService.display(true);
      this.leadService
        .submitFormForRevise(
          this.project_id,
          this.file_owner_id,
          this.project_handoverId
        )
        .subscribe(
          (res) => {
            $("#EditModal").modal("hide");
            this.successMessage = "File Revised Successfully!!";
            this.file_owner_id = "";
            this.successalert = true;
            this.successMessage = "File Revised successfully!";
            this.getFileDetails();
            this.loaderService.display(false);
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              10000
            );
          },
          (err) => {
            $("#EditModal").modal("hide");
            this.errorMessageShow(JSON.parse(err["_body"]).message);
            this.loaderService.display(false);
          }
        );
    }
  }
  confirmDelete(id: number) {
    if (confirm("Are You Sure You Want To delete?") == true) {
      this.DeleteFile(id);
    }
  }
  DeleteFile(value) {
    this.boqWithoutDuration.forEach(function (boq, index) {
      if (boq.id == value) {
        this.boqWithoutDuration.splice(index, 1);
      }
    });
    this.loaderService.display(true);
    this.leadService.DeleteHandOverFile(this.project_id, value).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = "File Deleted successfully!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
        this.getFileDetails();
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"];
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
        this.loaderService.display(false);
      }
    );
  }

  //For Site Request
  onRequest() {
    this.loaderService.display(true);
    this.createRequestForm.patchValue({ project_id: this.project_id });
    this.leadService.createSiteRequest(this.createRequestForm.value).subscribe(
      (res) => {
        $("#siteModal").modal("hide");
        this.successalert1 = true;
        this.successMessage = "Request sent";
        setTimeout(
          function () {
            this.successalert1 = false;
          }.bind(this),
          2000
        );
        this.getFileList();
        this.UpdateFile(this.revision_val, this.file_obj);
        this.createRequestForm.reset();
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert1 = true;
        this.errorMessage = "Something went wrong. Please try again";
        setTimeout(
          function () {
            this.erroralert1 = false;
          }.bind(this),
          2000
        );
      }
    );
  }
  file_name: any = "";
  submitted = false;
  attachment_file;
  basefile: any;
  size;
  sizeKB;
  onChange(event) {
    this.size = event.target.files[0].size;
    this.sizeKB = this.size / 1000;
    this.file_name = event.target.files[0].name;
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
   this.basefile =  this.attachment_file
  }
  onSubmit(data) {
    this.submitted = true;
   
    let formdata = new FormData();
    formdata.append("cad_drawing[cad_drawing]", this.basefile);
    formdata.append("cad_drawing[name]", data.name);
    formdata.append("cad_drawing[file_name]", this.file_name);
    this.loaderService.display(true);
    this.leadService.uploadCad(this.project_id,formdata ).subscribe(
      (cad) => {
        this.loaderService.display(false);
        this.successalert = true;
        $("#cadModal").modal("hide");
        this.successMessage = "CAD file uploaded successfully !!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          800
        );
        this.getFileList();
        this.UpdateFile(this.revision_val, this.file_obj);
     
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          10000
        );

        this.loaderService.display(false);
        return Observable.throw(error);
      }
    );
  }
  //on submit floorplan--------------
  onSubmitFloor(data) {
    this.submitted = true;
    let postData = { name: data.name, details: data.details };
    this.loaderService.display(true);

    this.floorplanService
      .postWithFile(this.project_id, postData, this.basefile, this.file_name)
      .subscribe(
        (floorplan) => {
          floorplan = floorplan;
          Object.keys(floorplan).map((key) => {
            floorplan = floorplan[key];
          });
          this.loaderService.display(false);
          this.successalert = true;
          $("#floorplanModal").modal("hide");
          this.successMessage = "Floorplan plan created successfully !!";
          setTimeout(
            function () {
              this.successalert = false;
              this.createFloorplanForm.reset();
             
            }.bind(this),
            800
          );
          this.getFileList();
          this.UpdateFile(this.revision_val, this.file_obj);
       
          return floorplan;
        },
        (error) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(error["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            10000
          );

          this.loaderService.display(false);
          return Observable.throw(error);
        }
      );
  }
  //on submit line marking//////

  onSubmitLineMarking(data) {
    this.submitted = true;
    let postData = {
      line_marking: {
        file_name: this.file_name,
        name: data.name,
        description: data.details,
        attachments: {
          document_file_name: this.file_name,
          document_content_type: this.basefile,
          document_file_size: this.sizeKB,
        },
      },
    };
    let formData = new FormData();

    for (let key in postData) {
      if (postData.hasOwnProperty(key)) {
        if (typeof postData[key] === "object") {
          for (let nestedKey in postData[key]) {
            if (postData[key].hasOwnProperty(nestedKey)) {
              // Handle attachments separately
              if (nestedKey === 'attachments' && typeof postData[key][nestedKey] === 'object') {
                for (let attachmentKey in postData[key][nestedKey]) {
                  if (postData[key][nestedKey].hasOwnProperty(attachmentKey)) {
                    formData.append(`line_marking[attachments][${attachmentKey}]`, postData[key][nestedKey][attachmentKey]);
                  }
                }
              } else {
                formData.append(`line_marking[${nestedKey}]`, postData[key][nestedKey]);
              }
            }
          }
        } else {
          formData.append(key, postData[key]);
        }
      }
    }
    this.loaderService.display(true);
    this.leadService.uploadLineMarking(this.project_id, formData).subscribe(
      (linemarking) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Line Marking file uploaded successfully !!";
        this.getFileList();
       
        setTimeout(
          function () {
            $("#LineMarkingModal").modal("hide");
            this.createLineMarkingForm.reset();
            // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
            this.successalert = false;
          }.bind(this),
          800
        );
        this.UpdateFile(this.revision_val, this.file_obj);
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          10000
        );

        this.loaderService.display(false);
        return Observable.throw(error);
      }
    );
  }
  // Onsubmit Elevation
  onSubmitElevation(data) {
    this.submitted = true;
    let postData = {
      upload_elevation: {
        attachments: this.basefile,
        file_name: this.file_name,
        name: data.name,
      },
    };

    this.loaderService.display(true);
    this.leadService.uploadElevation(this.project_id, postData).subscribe(
      (cad) => {
        this.loaderService.display(false);
        this.successalert = true;
        $("#elevationModal").modal("hide");
        this.successMessage = "Elevation file uploaded successfully !!";
        this.getFileList();
        this.UpdateFile(this.revision_val, this.file_obj);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          800
        );
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          10000
        );

        this.loaderService.display(false);
        return Observable.throw(error);
      }
    );
  }

  // Method For SUbmit PPT
  ppt_file;
  onChangePPt(event) {
    this.file_name = event.target.files[0].name;
    this.ppt_file = event.target.files[0] || event.srcElement.files[0];
    this.basefile = this.ppt_file
    var fileReader = new FileReader();
    var base64;
   
  }
  onSubmitPPt(data) {
    this.submitted = true;
    let postData = {
      boq_and_ppt_upload: {
        upload: this.basefile,
        upload_type: "ppt",
        file_name: this.file_name,
        name: data.name,
      },
    };

    this.loaderService.display(true);
    this.leadService.uploadPpt(this.project_id, postData).subscribe(
      (cad) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "PPT file uploaded successfully !!";
        // this.fetchCadElevation();
        setTimeout(
          function () {
            $("#pptModal").modal("hide");
            // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
            this.successalert = false;
          }.bind(this),
          800
        );
        this.getFileList();
        this.UpdateFile(this.revision_val, this.file_obj);
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          10000
        );

        this.loaderService.display(false);
        return Observable.throw(error);
      }
    );
  }

  // Method for reference image
  onSubmitReference(data) {
    this.submitted = true;
    let postData = {
      reference_image: {
        attachments: this.basefile,
        file_name: this.file_name,
        name: data.name,
      },
    };
    let formData = new FormData();

    for (let key in postData) {
      if (postData.hasOwnProperty(key)) {
        if (typeof postData[key] === "object") {
          for (let nestedKey in postData[key]) {
            if (postData[key].hasOwnProperty(nestedKey)) {
              formData.append(`reference_image[${nestedKey}]`, postData[key][nestedKey]);
            }
          }
        } else {
          formData.append(key, postData[key]);
        }
      }
    }
    
    this.loaderService.display(true);
    this.leadService.uploadReference(this.project_id, formData).subscribe(
      (cad) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Reference file uploaded successfully !!";
        $("#referenceModal").modal("hide");
        this.getFileList();
       
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          800
        );
        this.UpdateFile(this.revision_val, this.file_obj);
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          10000
        );

        this.loaderService.display(false);
        return Observable.throw(error);
      }
    );
  }
  onSubmitThree(data) {
    this.submitted = true;
    let postData = {
      three_d_image: {
        attachments: this.basefile,
        file_name: this.file_name,
        name: data.name,
      },
    };

    let formData = new FormData();

for (let key in postData) {
  if (postData.hasOwnProperty(key)) {
    if (typeof postData[key] === "object") {
      for (let nestedKey in postData[key]) {
        if (postData[key].hasOwnProperty(nestedKey)) {
          formData.append(`three_d_image[${nestedKey}]`, postData[key][nestedKey]);
        }
      }
    } else {
      formData.append(key, postData[key]);
    }
  }
}
    

    this.loaderService.display(true);
    this.leadService.uploadThreeD(this.project_id, formData).subscribe(
      (cad) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "3-D file uploaded successfully !!";
        this.getFileList();
        
        setTimeout(
          function () {
            $("#threeDModal").modal("hide");
            this.successalert = false;
          }.bind(this),
          800
        );
        this.UpdateFile(this.revision_val, this.file_obj);
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          10000
        );

        this.loaderService.display(false);
        return Observable.throw(error);
      }
    );
  }
  openModal(modalVal) {
    if (
      this.selectedBoqIds.length > 0 ||
      this.selectedPptList.length > 0 ||
      this.selectedFloorplanIds.length > 0 ||
      this.selectedcadFileList.length > 0 ||
      this.selectedThreeDList.length > 0 ||
      this.selectedElevationList.length > 0 ||
      this.selectedReferenceList.length > 0 ||
      this.selectedSiteRequestList.length > 0 ||
      this.selectedlineMarkingList.length > 0 ||
      this.selectedMTOlist.length > 0
    ) {
      if (
        confirm(
          "All Selected Item Will Be Removed After Uploading A New File .Are You Sure You Want To Continue?"
        ) == true
      ) {
        $("#" + modalVal).modal("show");
        this.selectedBoqIds = [];
        this.selectedPptList = [];
        this.selectedFloorplanIds = [];
        this.selectedcadFileList = [];
        this.selectedThreeDList = [];
        this.selectedElevationList = [];
        this.selectedReferenceList = [];
        this.selectedlineMarkingList = [];
        this.selectedSiteRequestList = [];
        this.selectedMTOlist = [];
      }
    } else {
      $("#" + modalVal).modal("show");
    }
  }
  revision_val;
  openReviseModal(modalVal) {
    this.revision_val = modalVal;
    if (modalVal == "BoqAndPptUpload") {
      $("#pptModal").modal("show");
    } else if (modalVal == "Floorplan") {
      $("#floorplanModal").modal("show");
    } else if (modalVal == "CadDrawing") {
      $("#cadModal").modal("show");
    } else if (modalVal == "Elevation") {
      $("#elevationModal").modal("show");
    } else if (modalVal == "ReferenceImage") {
      $("#referenceModal").modal("show");
    } else if (modalVal == "SiteMeasurementRequest") {
      $("#siteModal").modal("show");
    } else if (modalVal == "LineMarking") {
      $("#LineMarkingModal").modal("show");
    } else if (modalVal == "MtoUpload") {
      $("#MTOModal").modal("show");
    } else {
      $("#threeDModal").modal("show");
    }
  }

  //to get additional files details
  getAdditionalFiles() {
    this.leadService.getAdditionalFiles(this.project_id).subscribe(
      (res) => {
        this.additionalFiles = res.requested_files;
      },
      (err) => {}
    );
  }

  ///additional files resolve
  resloveAdditionalFiles(project_id, raised_by_id) {
    this.leadService.resloveAdditionalFiles(project_id, raised_by_id).subscribe(
      (res) => {
        this.successalert1 = true;
        this.successMessage = "Request Resolved";
        setTimeout(
          function () {
            this.successalert1 = false;
          }.bind(this),
          2000
        );
        this.getAdditionalFiles();
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert1 = true;
        this.errorMessage = "Something went wrong. Please try again";
        setTimeout(
          function () {
            this.erroralert1 = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  //for tooltip popover
  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }
  ngOnDestroy() {
    $(function () {
      $(".pop").remove();
    });
  }
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

  duration = 0;
  updateDuration() {
    this.loaderService.display(true);
    if (this.duration <= 0) {
      alert("Duration should be greater than 0");
      this.loaderService.display(false);
    } else {
      this.leadService
        .updateDuration(this.quotationId, this.project_id, this.duration)
        .subscribe(
          (res) => {
            this.loaderService.display(false);

            this.successalert = true;
            this.successMessage = "Duration Updated Successfully";

            //this.boqWithoutDuration=[]
            this.boqWithoutDuration.forEach(
              function (boq, index) {
                if (boq.ownerable_id == this.quotationId) {
                  this.boqWithoutDuration.splice(index, 1);
                }
              }.bind(this)
            );

            this.getFileDetails();

            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              4000
            );
          },
          (err) => {
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              3000
            );
          }
        );
    }
  }
  quotationId;
  getBoqDetails(boq) {
    this.quotationId = boq.ownerable_id;
    this.duration = boq.duration || 0;
  }
  ////////////////
  history;
  viewHistory(qcType) {
    this.loaderService.display(true);

    this.leadService.viewQCHistory(this.project_id, qcType).subscribe(
      (res) => {
        //
        this.history = res;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          3000
        );
      }
    );
  }
  isDesc: boolean = true;
  column: string = "created_at";
  sort(property) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }
  file_list;
  viewFile(url) {
    this.file_list = url;
  }

  changeFileFormat() {
    if (this.category == "ThreeDImage") {
      return "3-D Image";
    } else if (this.category == "ReferenceImage") {
      return "Reference Image";
    } else if (this.category == "CadDrawing") {
      return "Cad Drawing";
    } else if (this.category == "BoqAndPptUpload") {
      return "PPT Upload";
    } else if (this.category == "SiteMeasurementRequest") {
      return "Site Measurement Request";
    } else if (this.category == "Floorplan") {
      return " Floor Plan / Layout";
    } else if (this.category == "Elevation") {
      return "Elevation";
    } else if (this.category == "Quotation") {
      return "Quotation";
    } else if (this.category == "LineMarking") {
      return "Line Marking";
    }
  }
  downloadBoq(boqId) {
    this.loaderService.display(true);
    this.leadService.downloadBoqCheatSheet(this.project_id, boqId).subscribe(
      (res) => {
        this.loaderService.display(false);
        var contentType = "application/pdf";

        var b64Data = JSON.parse(res._body)["quotation_base_64"];
        var name = JSON.parse(res._body)["boq_name"];
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
        dwldLink.setAttribute("download", name);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
        this.successalert = true;
        this.successMessage = "Your File Downloaded Successfully";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
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
  onChange2(event) {
    this.file_name = event.target.files[0].name;
    this.attachment_file = event.target.files[0];

    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    fileReader.readAsDataURL(this.attachment_file);
  }
  onSubmit2(data) {
    this.submitted = true;

    // let postData = {
    //   "mto_uploads[name]": data.name,
    //   "mto_uploads[details]": data.details,
    //   "mto_uploads[project_id]": this.project_id,
    //   "mto_uploads[attachment_file]": this.attachment_file,
    // };
    this.loaderService.display(true);
    this.floorplanService
      .postWithFileMTO(
        this.project_id,
        data.name,
        data.details,
        this.attachment_file
      )
      .subscribe(
        (mto) => {
          mto = mto;
          Object.keys(mto).map((key) => {
            mto = mto[key];
          });
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "MTO created successfully !!";
          setTimeout(
            function () {
              $("#MTOModal").modal("hide");
              this.createMTOForm.reset();
              this.getFileDetails();
              this.getFileList();
              this.successalert = false;
            }.bind(this),
            800
          );
          return mto;
        },
        (error) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(error["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            10000
          );

          this.loaderService.display(false);
          return Observable.throw(error);
        }
      );
  }
  spaces: any;
  getspaceslist() {
    this.floorplanService.getspacesstatic().subscribe((res) => {
      this.spaces = res.spaces;
    });

  }
  dynamicspaces:any;
  dynamicDepartments:any;
  getspacesdynamic(){
    this.floorplanService.getspaces(this.project_id).subscribe(res=>{
      this.dynamicspaces = res.space;
      this.dynamicDepartments = res.department;
    })
  }
  description:any
  getRemarkforcancell(e){
this.description =e;
  }

 
}