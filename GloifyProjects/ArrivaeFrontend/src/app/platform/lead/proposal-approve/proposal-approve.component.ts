import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { ProjectService } from '../../project/project/project.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-proposal-approve',
  templateUrl: './proposal-approve.component.html',
  styleUrls: ['./proposal-approve.component.scss'],
  providers: [LeadService,ProjectService]
})
export class ProposalApproveComponent implements OnInit {
	lead_id;
	lead_status;
	role;
	lead_details;
	approveList:any;
  erroralert;
  errorMessage;
  successalert = false;
  successMessage : string;
  emailverified:boolean

  constructor(
  	private activatedRoute: ActivatedRoute,
    private router:Router,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private projectService:ProjectService,
  	) { }

  ngOnInit() {


  	this.activatedRoute.params.subscribe((params: Params) => {
      
      
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      
      this.lead_status = params['lead_status'];
      
    });
    this.route.queryParams.subscribe(params => {
      
      if(params['tab'] === 'intial_boq'){
        this.selectedSet = 'Intial_boq'
      }else if(params['tab'] === 'final_boq'){
        this.selectedSet = 'Final_boq'
      }else{
        this.selectedSet = 'Intial_boq'
      }
    });
    this.role = localStorage.getItem('user');
    this.emailverified = localStorage.getItem('emailverified') == 'true';
    this.fetchBasicDetails();
  }
  project_id;
  is_before_email_verify:any=true

  fetchBasicDetails(){
  	this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {

        this.lead_details = res['lead'];
        localStorage.setItem('lead_details', JSON.stringify(this.lead_details))
        this.project_id = res['lead'].project_details.id;
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        this.getInitialBoqList();
        
      },
      err => {
        
      }
    );
 
  }
  selectedSet = 'Intial_boq';

  getSet(state){
  	this.selectedSet = state;
    if(this.selectedSet == 'Final_boq'){
      this.getFinalBoqList();

    }
    else{
      this.getInitialBoqList();
    }


  }
  getFinalBoqList(){
    this.loaderService.display(true);
    this.leadService.getFinalQuotationListForCm(this.project_id).subscribe(
      res=>{
        
        this.approveList =res.quotations;
        this.loaderService.display(false);

      },
      err=>{
        

      });

  }

  getInitialBoqList(){
  	this.loaderService.display(true);
  	this.leadService.getInitialQuotationListForCm(this.project_id).subscribe(
  		res=>{
  			
  			this.approveList =res.quotations;
        this.loaderService.display(false);

  		},
  		err=>{
  			

  		});


  }
  selected_boq_details;
  display_boq_label;
  approveModal(quoteId){
    this.display_boq_label = "false" ?  false : false
    this.loaderService.display(true);
    this.projectService.getQuotation(this.project_id, quoteId,this.display_boq_label).subscribe(
      res=>{
        this.selected_boq_details = res;
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      })

  }


  closeRejectModal(){
    $('#reject_remark').val('');

  }
  boq_id;
  confirmAndReject(boq_id){
    if(confirm("Are You Sure You Want To Reject The BOQ?") == true){
      this.RejectBoq(boq_id);

    }


  }
  BOQ_Id
  confirmAndApprove(boq_id){
    this.BOQ_Id = boq_id;
    if(this.role == 'business_head' || this.role == 'city_gm'|| this.role == 'deputy_general_manager'  ){
      if(confirm("Are You Sure You Want To Approve The BOQ?") == true){
        this.ApproveBoq(boq_id);
  
      }
    } else{
      $('#OTPapproval').modal('show');
      this.item_id = ''
      this.FetcthOtp()
    }
   

  }
  FetcthOtp(){
    this.loaderService.display(true)
   this.leadService.ApproveBoqOTP(this.BOQ_Id).subscribe(res=>{
    this.successalert = true;
    this.loaderService.display(false)

    this.successMessage = 'Proposal Confirmation Code Sent Successfully!';
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 5000);
   },err=>{
    this.loaderService.display(false)
    this.erroralert = true;
    this.errorMessage = JSON.parse(err['_body']).message;
    setTimeout(function() {
         this.erroralert = false;
    }.bind(this), 5000);
   })
  }
  mapitem(){
   
    this.ApproveBoq(this.BOQ_Id)
  }
  ApproveBoq(boq_id){
    // if ( this.item_id.charAt(0) === '0') {
    //   this.item_id = parseInt('0') +parseInt(this.item_id)
    // } else {
    //   this.item_id = parseInt(this.item_id)
    // }
    
    this.loaderService.display(true);
    var obj={
      "proposal_doc_id": boq_id,
      "is_approved": true,
      'otp':this.item_id
    }
    this.leadService.ApproveBoqByCm(obj).subscribe(
      res=>{
        
        this.loaderService.display(false);
        $('#quoteModal').modal('hide');
        $('#OTPapproval').modal('hide');
        this.successalert = true;
        this.successMessage = 'BOQ Approved Successfully!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        
        this.errorMessage = JSON.parse(err['_body']).data.message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      });
  }
  RejectBoq(boq_id){
    this.loaderService.display(true);
    var obj={
      "proposal_doc_id": boq_id,
      "is_approved": false
    }
    this.leadService.ApproveBoqByCm(obj).subscribe(
      res=>{
        
        this.loaderService.display(false);
        $('#quoteModal').modal('hide');
        this.successalert = true;
        this.successMessage = 'BOQ rejected Successfully!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      });
  }
  item_id:any;

}