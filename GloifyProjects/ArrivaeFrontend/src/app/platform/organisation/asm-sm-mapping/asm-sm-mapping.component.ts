import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $: any;

@Component({
  selector: 'app-asm-sm-mapping',
  templateUrl: './asm-sm-mapping.component.html',
  styleUrls: ['./asm-sm-mapping.component.css'],
  providers:[LeadService]
})
export class AsmSmMappingComponent implements OnInit {

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
    this.getSMList("");
    this.getASMList();
  }
  //to get SM list
  area_sales_manager_id=""
  sm_list: any;
  getSMList(search: any) {
    this.loaderService.display(true);
    this.leadService.getSMListForASMMapping(search,this.area_sales_manager_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.sm_list = res.data;
        console.log(this.sm_list)

      },
      error => {
        this.loaderService.display(false);
      }
    )
  }

  //to get SM list
  asm_list: any;
  
  getASMList() {
    this.loaderService.display(true);
    this.leadService.getASMList().subscribe(
      res => {
        this.loaderService.display(false);
        this.asm_list = res['users'];
      },
      error => {
        this.loaderService.display(false);
      }
    )
  }
  selectSmId: any;
  assignedASmId: any;
  onDropdownChange(SmId, value, rowid) {
    this.assignedASmId = value;
    this.selectSmId = SmId;
    console.log(this.assignedASmId,this.selectSmId )
  }
  assignASMToSM(SmId, index) {
    if (this.selectSmId == SmId) {
      this.loaderService.display(true);
      this.leadService.mapASMwithSM(SmId, this.assignedASmId).subscribe(
        res => {
          // res= res.json();
          this.getSMList("");
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = res.message;
          this.assignedASmId = null;
          this.selectSmId = null;
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
  selectedSm: any;
  assignedASm: any;
  getDataofRemoveASM(smId, asmId) {
    this.selectedSm = smId;
    this.assignedASm = asmId;
    console.log("hello")
  }

  removeASM() {
    console.log("hii")
    this.loaderService.display(true);
    this.leadService.romoveAssignASMforSM(this.selectedSm, this.assignedASm).subscribe(
      res => {
        this.getSMList("");
        $('#deleteAsm').modal('hide');
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

  
  filterbyasm(asm){
    this.area_sales_manager_id=(asm == undefined?'':asm)
    this.getSMList(this.searchItem);
  }
 

}