import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { environment } from 'environments/environment';
import {Location} from '@angular/common';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';

@Component({
  selector: 'app-overview-counts',
  templateUrl: './overview-counts.component.html',
  styleUrls: ['./overview-counts.component.css'],
  providers:[ LeadService]
})
export class OverviewCountsComponent implements OnInit {

  public lead_id:any;
  lead_details;
  public role:string;
  lead_status;
  initLoader:any = true;
  past_event_count;
  future_event_count;
  emailverified:boolean;
  constructor(
    public activatedRoute: ActivatedRoute,
    private _location: Location,
    private route:ActivatedRoute,
    private loaderService :LoaderService,
    public leadService : LeadService
  ) { }

  customer_status
  project_id:any;
  is_before_email_verify:any=true;
  bu_head_approved_email:any;
  is_proposal_shared:any;
  iconverified:any;

  ngOnInit() {
    this.iconverified = localStorage.getItem('emailverified') == 'true';
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
      this.customer_status = params['customer_status']
      console.log(this.customer_status,params)
    });
    this.role = localStorage.getItem('user');
    this.customer_status = localStorage.getItem('customer_status')
    this.getCounts();
    this.fetchBasicDetails();
  }

  todaysevents:boolean=true;
  eventswitch(){
    console.log("Hoirjef")
    this.todaysevents=!this.todaysevents
  }



  fetchBasicDetails(){
    this.loaderService.display(true)
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.loaderService.display(false)
        this.project_id = res['lead'].project_details.id;
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        this.bu_head_approved_email=this.lead_details.bu_head_approved_email;
        this.is_proposal_shared=this.lead_details.is_proposal_shared; 
        this.emailverified=this.lead_details.email_verified;
        this.iconverified=(this.is_before_email_verify == false ) &&  (this.emailverified || this.bu_head_approved_email)
        localStorage.setItem('emailverified',this.iconverified.toString()) 
        localStorage.setItem('is_before_email_verify',this.is_before_email_verify) 


      },
      err => {
        this.loaderService.display(false)
      }
    );
  }

  getCounts(){
    //this.loaderService.display(true);
    this.leadService.getOverviewCount(this.lead_id).subscribe(
      res => {
        this.lead_details = res.lead;
        this.past_event_count = res.lead.past_event_count
         this.future_event_count = res.lead.future_event_count;
        //this.loaderService.display(false);
        this.initLoader = false;
      },
      err => {
        
       // this.loaderService.display(false);
        this.initLoader = false;
      }
    );
  }

  eventlogs;
  eventcalllogs;
  getOverviewLog(event_time,event_type){
    this.loaderService.display(true);
    this.leadService.getOverviewLog(this.lead_id,event_time,event_type).subscribe(
      res => {
        this.eventlogs = res['lead']['events_log'];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  getOverviewCallLog(event_time,event_type){
    this.loaderService.display(true);
    this.leadService.getOverviewLog(this.lead_id,event_time,event_type).subscribe(
      res => {
        this.eventcalllogs = res['lead']['events_log'];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  isProjectInWip():boolean {
    // this.project_id = this.lead_details.project_details.id;
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive","completed"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }
}