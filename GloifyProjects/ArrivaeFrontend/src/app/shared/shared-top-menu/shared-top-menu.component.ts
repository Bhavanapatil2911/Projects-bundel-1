import { Component, OnInit, Input } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../../platform/lead/lead.service';
import { LoaderService } from '../../services/loader.service';
import { FinanceService } from 'app/platform/finance/finance.service';

@Component({
  selector: 'app-shared-top-menu',
  templateUrl: './shared-top-menu.component.html',
  styleUrls: ['./shared-top-menu.component.css'],
  providers: [LeadService,FinanceService]
})
export class SharedTopMenuComponent implements OnInit {

  project_id;
  role;

	@Input() lead_id:any;
	@Input() lead_status:any;
	@Input() overview_tab:any;
	@Input() activity_log_tab:any;
	@Input() basic_info_tab:any;
	@Input() detailed_info_tab:any;
	@Input() boq_tab:any;
	@Input() ppt_tab:any;
	@Input() files_tab:any;
	@Input() calender_tab:any;
	@Input() proposal_tab:any;
	@Input() custom_tab:any;
  @Input() payment_tab:any;
  @Input() payment_approval_tab:any;
	@Input() lead_details:any = {};
  @Input() handover_for_production:any;
  @Input() obtooctrack:any;
  @Input() project_progress:any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public financeService: FinanceService,
    public loaderService : LoaderService,
    private route:ActivatedRoute,
    ) { }
    customer_status
    project_status:any;
    sub_status:any;
  ngOnInit() {
    this.lead_details = null;
    this.role =localStorage.getItem('user');
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
    });
    this.isShowItems = false;

    this.customer_status = localStorage.getItem('customer_status')
    this.fetchBasicDetails()

  }
  order_booking_actual:any=''
  status=["initial_payment_recieved", "site_measurement_done","final_proposal_submitted","final_proposal_rejected","final_proposal_accepted","40%_payment_recieved","handover_done"]
isShowItems = false;
  fetchBasicDetails(){
    console.log(this.lead_id,'o')
       
       
        console.log(this.lead_id, this.lead_details )
        this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.loaderService.display(false);
        console.log(res)
        console.log(res.lead)
        let lead_details=res["lead"];
        this.lead_details = lead_details;
        setTimeout(()=>{
          this.isShowItems = true;
        },500)
       
        localStorage.setItem('lead_details', JSON.stringify(this.lead_details))
        this.lead_status = this.lead_details.lead_status;
        this.project_id =  this.lead_details.project_details.id;
        console.log(lead_details)
        console.log(lead_details["order_booking_actual_date"])
        this.order_booking_actual=lead_details["order_booking_actual_date"]
        this.project_status=lead_details["project_status"]
        this.sub_status=this.status.includes(lead_details["project_details"].sub_status)
        console.log(this.sub_status,this.project_status,this.order_booking_actual)
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
    console.log( this.lead_details)
  
  }

  isProjectInWip():boolean {    
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive","completed"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

}
