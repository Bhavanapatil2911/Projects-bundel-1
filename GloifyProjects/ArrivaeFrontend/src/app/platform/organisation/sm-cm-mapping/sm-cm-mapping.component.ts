import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $: any;

@Component({
  selector: 'app-sm-cm-mapping',
  templateUrl: './sm-cm-mapping.component.html',
  styleUrls: ['./sm-cm-mapping.component.css'],
  providers: [CommunitymanagerService, SchedulerService, DesignerService, LeadService]
})
export class SmCmMappingComponent implements OnInit {

  role: string;
  successalert = false;
  successMessage: string;
  errorMessage: string;
  erroralert = false;
  searchItem = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private loaderService: LoaderService,
  ) {
    this.role = localStorage.getItem('user');
  }

  ngOnInit() {
    this.getCMList("");
    this.getSMList();
  }
  //to get SM list
  sales_manager_id=""
  cm_list: any;
  getCMList(search: any) {
    this.loaderService.display(true);
    this.leadService.getCmListForCMSMMapping(search,this.sales_manager_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.cm_list = res;
      },
      error => {
        this.loaderService.display(false);
      }
    )
  }

  //to get SM list
  sm_list: any;
  
  getSMList() {
    this.loaderService.display(true);
    this.leadService.getSMLists().subscribe(
      res => {
        this.loaderService.display(false);
        this.sm_list = res['sales_managers'];
      },
      error => {
        this.loaderService.display(false);
      }
    )
  }
  selectCmId: any;
  assignedSmId: any;
  onDropdownChange(CmId, value, rowid) {
    this.assignedSmId = value;
    this.selectCmId = CmId;
    console.log(this.assignedSmId,this.selectCmId )
  }
  assignSMToCM(CmId, index) {
    if (this.selectCmId == CmId) {
      this.loaderService.display(true);
      this.leadService.mapCMwithSM(CmId, this.assignedSmId).subscribe(
        res => {
          // res= res.json();
          this.getCMList("");
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = res.message;
          this.assignedSmId = null;
          this.selectCmId = null;
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
        },
        error => {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
          this.loaderService.display(false);
        }
      )
    }
    else {
      this.erroralert = true;
      this.errorMessage = 'Select GM first';
    }
  }


  //Remove assign SM
  selectedCm: any;
  assignedSm: any;
  getDataofRemoveSm(cmId, smId) {
    this.selectedCm = cmId;
    this.assignedSm = smId;
    console.log("hello")
  }

  removeSm() {
    console.log("hii")
    this.loaderService.display(true);
    this.leadService.romoveAssignSm(this.selectedCm, this.assignedSm).subscribe(
      res => {
        this.getCMList("");
        $('#deleteGm').modal('hide');
        this.successalert = true;
        this.successMessage = <any>JSON.parse(res['_body']).message;
        this.loaderService.display(false);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      error => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(error['_body']).message;
        this.loaderService.display(false);
      }
    )
  }
  filterbysm(sm){
    this.sales_manager_id=(sm == undefined?'':sm)
    this.getCMList(this.searchItem);
  }
 

}
