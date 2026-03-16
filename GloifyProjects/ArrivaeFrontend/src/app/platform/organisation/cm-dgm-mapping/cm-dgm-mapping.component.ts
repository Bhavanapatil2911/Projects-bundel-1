
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $: any;

@Component({
  selector: 'app-cm-dgm-mapping',
  templateUrl: './cm-dgm-mapping.component.html',
  styleUrls: ['./cm-dgm-mapping.component.css'],
  providers: [LeadService]
})
export class CmDgmMappingComponent implements OnInit {

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
    this.listingDgmLeads("");
    this.getDGMList()
  }
  FilterDgmId :any
  DgmLeads :any
  listingDgmLeads(search: any) {

    if(this.FilterDgmId === undefined){
      this.FilterDgmId = ''
    }

    this.searchItem = search
    this.loaderService.display(true);
    this.leadService.listDgmLeads( this.searchItem ,  this.FilterDgmId).subscribe(
      res => {
        this.loaderService.display(false);
        this.DgmLeads = res
        console.log(this.DgmLeads)
      },
      error => {
        this.loaderService.display(false);
      }
    )
  }


  get_dgm_list: any;
  
  getDGMList() {
    this.leadService.list_dgm_list().subscribe(
      res => {
        this.get_dgm_list = res['users'];
      },
      error => {
      }
    )
  }

  assignedDgmId :any
  selectCmId :any
  onDropdownChange(CmId, value, rowid) {
    this.assignedDgmId = value;
    this.selectCmId = CmId;
    console.log(this.assignedDgmId,this.selectCmId )
  }


  assignDGMToCM(CmId, index) {
    if (this.selectCmId == CmId) {
      this.leadService.assign_dGM_cM(CmId, this.assignedDgmId).subscribe(
        (res) => {
            this.listingDgmLeads("");
            this.successalert = true;
            this.successMessage = res.message;
            this.assignedDgmId = null;
            this.selectCmId = null;
          },
          error => {
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(error['_body']).message;
          }
      )
    }else {
      this.erroralert = true;
      this.errorMessage = 'Select DGM first';
    }
  }

  getDataofRemoveASM(cmId) {
    this.selectCmId = cmId;
    console.log("hello")
  }

  removeASM() {
    console.log("hii")
    this.leadService.assign_dGM_cM(this.selectCmId, ' ').subscribe(
      res => {
        this.listingDgmLeads("");
        $('#deleteAsm').modal('hide');
        this.successalert = true;
        this.successMessage = res.message
      },
      error => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(error['_body']).message;
      }
    )
  }

  filterbyasm(dgm){
    this.FilterDgmId=(dgm == undefined?'':dgm)
    this.listingDgmLeads(this.searchItem);
  }

}
