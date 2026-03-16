import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $: any;

@Component({
  selector: 'app-cm-gm-mapping',
  templateUrl: './cm-gm-mapping.component.html',
  styleUrls: ['./cm-gm-mapping.component.css'],
  providers: [CommunitymanagerService, SchedulerService, DesignerService, LeadService]
})
export class CmGmMappingComponent implements OnInit {

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
  }

  //to get CM list
  cm_list: any;
  gm_list: any;
  getCMList(search: any) {
    this.loaderService.display(true);
    this.leadService.getCmListForCMGMMapping(search).subscribe(
      res => {
        this.loaderService.display(false);
        this.cm_list = res.community_manager;
        this.gm_list = res.city_gm;
      },
      error => {
        this.loaderService.display(false);
      }
    )
  }

  //to select GM
  selectCmId: any;
  assignedAgentId: any;
  onDropdownChange(CmId, value, rowid) {
    this.assignedAgentId = value;
    this.selectCmId = CmId;
  }


  //to map GM to CM
  assignLeadToAgent(CmId, index) {
    if (this.selectCmId == CmId) {
      this.loaderService.display(true);
      this.leadService.mapCMwithGM(CmId, this.assignedAgentId).subscribe(
        res => {
          // res= res.json();
          this.getCMList("");
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = res.message;
          this.assignedAgentId = null;
          this.selectCmId = null;
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

  //Remove assign GM
  selectedCm: any;
  assignedGm: any;
  getDataofRemoveGm(cmId, gmId) {
    this.selectedCm = cmId;
    this.assignedGm = gmId;
  }

  removeGm() {
    this.loaderService.display(true);
    this.leadService.romoveAssignGm(this.selectedCm, this.assignedGm).subscribe(
      res => {
        this.getCMList("");
        $('#deleteGm').modal('hide');
        this.successalert = true;
        this.successMessage = <any>JSON.parse(res['_body']).message;
        this.loaderService.display(false);
      },
      error => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(error['_body']).message;
        this.loaderService.display(false);
      }
    )
  }



}
