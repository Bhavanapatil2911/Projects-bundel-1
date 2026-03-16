import { Component, OnInit,OnDestroy ,AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../communitymanager.service';
import { LeadService } from '../../../lead/lead.service';
import { DesignerService } from '../../../designer/designer.service';
import { GeneralManagerService } from '../../../general-manager/general-manager.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
// import { CategoryPipe } from '../../../../shared/category.pipe';
import { SortPipe } from '../../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../../scheduler/scheduler.service';
import { Project, IGanttOptions, Zooming, Task } from '../../../../shared/gantt-chart/interfaces';
declare var gantt : any;
declare var $:any;

@Component({
  selector: 'app-cm-wip-dashboard',
  templateUrl: './cm-wip-dashboard.component.html',
  styleUrls: ['./cm-wip-dashboard.component.css'],
  providers: [CommunitymanagerService,SchedulerService,DesignerService,LeadService]
})
export class CmWipDashboardComponent implements OnInit {
	errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:string;
  cmId:string = ''
  statusCountArr;
  designerid :any = ''
  designer_id:string;
  searchCM: any;
  searchSM:any;
  cm_list: any;
  sm_list :any

  constructor(
  	private loaderService : LoaderService,
	  private cmService : CommunitymanagerService,
	  private leadService: LeadService,
	  private formBuilder:FormBuilder,
	  private schedulerService : SchedulerService,
	  private designerService:DesignerService,
    private gmService:GeneralManagerService,
	  private route:ActivatedRoute

  	) { 
      console.log("hiii")

    }  

  ngOnInit() {
    console.log("hiii"), 

  	this.role = localStorage.getItem('user');
    this.cmId = localStorage.getItem('userId');
    this.designer_id = localStorage.getItem('designer_id');
    this.loaderService.display(false);
    this.route.queryParams.subscribe(params => {
        this.designerid = params['designer_id'];
     });
    this.getCMList() 
    // this.getSMList()
    this.getUserWipCountsByStatus();
  }
  getUserWipCountsByStatus(){
  	this.loaderService.display(true);
    this.cmService.getUserCountsByStatusInWip(this.cmId,this.designerid,this.searchCM,this.searchSM).subscribe(
      res => {
        this.statusCountArr = res;
        this.loaderService.display(false);
        
      },

      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  getCMList(){
    if(this.role == 'area_sales_manager'){

      this.cmService.getFilterListofWIPCM(this.searchSM).subscribe(
        (res)=>{
          this.cm_list=res["cms"]
          this.sm_list=res["sales_managers"]
        },
        (err) => {
          
        }
      )
    } else{
      if(this.role == 'deputy_general_manager'){

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

  // getSMList(){
  //   this.leadService.getSalesManagerList().subscribe(
  //     (res) => {
  //       this.sm_list=res["sales_managers"]

  //     },
  //     (err) => {
  //       console.log(err)
  //     }
  //   )
  // }
  filterbyCm(val, type){
    if(type == 'cm'){
      this.searchCM=val;
      this.getUserWipCountsByStatus()
    }else{
      this.searchSM=val;
      this.searchCM=null;
      this.getCMList() 
      this.getUserWipCountsByStatus()
    }
  
  }
  clearfilters(){
    this.searchCM = null
    this.searchSM = null
    this.getUserWipCountsByStatus();
  }

}
