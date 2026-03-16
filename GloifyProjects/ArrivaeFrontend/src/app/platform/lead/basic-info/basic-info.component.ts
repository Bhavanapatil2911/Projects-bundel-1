import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';

declare var $:any;

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
  providers: [LeadService, DesignerService]
})
export class BasicInfoComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  lead_status;
  query_params:any = {};
  pid;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  basicDetailsForm: FormGroup;
  customerDetails: any;
  contact_visibel:any;
  previouemail:any
  
  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private route:ActivatedRoute,
    private designerService: DesignerService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  reload(){
    location.reload();
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });

    this.route.queryParams.subscribe(params => {
      if(params['lead_status']){
        this.lead_status = params['lead_status'];
        this.query_params['lead_status'] = this.lead_status;
      }

      if(params['lead_category']){
        this.query_params['lead_category'] = params['lead_category'];
      }
      this.getCustomerDetails();

    });

    this.role = localStorage.getItem('user');
    this.emailverified=localStorage.getItem('emailverified') == 'true'
    
    this.basicDetailsForm = this.formBuilder.group({
      'name': new FormControl("",Validators.required),
      'email': new FormControl("",[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'contact': new FormControl("", [Validators.required, Validators.pattern(/^[6789]\d{9}$/), Validators.minLength(10), Validators.maxLength(10) ])
    });

    this.fetchBasicDetails();
  }
  emailverified:boolean
  is_proposal_shared:any;
  bu_head_approved_email:any;
  is_before_email_verify:any=true;
  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        localStorage.setItem('lead_details', JSON.stringify(this.lead_details))
        console.log('testbas')
        this.pid = res['lead'].project_details.id;
        this.basicDetailsForm.controls['name'].setValue(this.lead_details.name);
        this.basicDetailsForm.controls['email'].setValue(this.lead_details.email);
        this.basicDetailsForm.controls['contact'].setValue(this.lead_details.contact);
        this.contact_visibel = this.lead_details.is_contact_visible;
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        this.bu_head_approved_email=this.lead_details.bu_head_approved_email;
        this.is_proposal_shared=this.lead_details.is_proposal_shared;
        this.emailverified=this.lead_details.email_verified;
        const verify=(this.is_before_email_verify == false ) &&  (this.emailverified || this.bu_head_approved_email)
        localStorage.setItem('emailverified',verify.toString())     
       },
      err => {
        
      }
    );
  }
 

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive","completed"]
    if(this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }
  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
           this.loaderService.display(false);
          if(res.inhouse_call.call_response.code == '403'){
            this.erroralert = true;
            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 10000);
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
          }
        },
        err => {
          this.loaderService.display(false);
          
        }
     );
  }

  updateBasicInfo(){
    this.loaderService.display(true);
    this.previouemail=this.lead_details.email
    this.leadService.updateBasicInfo(this.lead_id, this.basicDetailsForm.controls["name"].value,
        this.basicDetailsForm.controls["email"].value,
        this.basicDetailsForm.controls["contact"].value,).subscribe(
      res => {
        if(res['lead']){
          this.lead_details = res['lead'];
          $("#basicDetailsModal").modal("hide");
          this.loaderService.display(false);
          this.successalert = true;
          console.log(this.previouemail)
          console.log(this.basicDetailsForm.controls["email"].value)
          console.log(this.basicDetailsForm.controls["email"].value==this.previouemail)
          if(this.basicDetailsForm.controls["email"].value==this.previouemail || this.is_before_email_verify){
            this.successMessage = 'Updated successfully!';
          }
          else{
            this.successMessage=' Update and email verification mail sent successfully'
          }
          this.fetchBasicDetails()
          setTimeout(function() {
            this.successalert = false;
         }.bind(this), 2000);
        }else{
          $("#basicDetailsModal").modal("hide");
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = res['message'];
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
        }
      },
      err => {
        $("#basicDetailsModal").modal("hide");
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage =  JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }

  getCustomerDetails(){
    this.leadService.getCustomerCallDetails(this.lead_id).subscribe(
      res => {
        this.customerDetails = res['lead'].contacts;
      },
      err => {
        
      }
    );
  }

  //to change contact status
  changeContactStatus(){
    this.loaderService.display(true);
    this.leadService.changeConStatus(this.lead_id).subscribe(
      res=>{
        this.loaderService.display(false); 
        this.fetchBasicDetails();
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 3000);    
    });
  }
  gotoverification(id){
    this.leadService.gotoverification(this.lead_id).subscribe(
      res=>{
        this.loaderService.display(false); 
        this.successalert = true;
        this.successMessage = res['message'];
        $("#confirmverification").modal("hide");
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Error accoured in sending verification Email";
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);    
    });

  }
  
  closeconfirmation(){
    $('#confirmverification').modal('hide');
  }

  markverified(){
    this.leadService.markasverified(this.lead_id).subscribe(
      res=>{
        this.loaderService.display(false); 
        window.location.reload()
        this.successalert = true;
        this.successMessage = res['message'];
        this.fetchBasicDetails()
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Error accoured in sending verification Email";
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);    
    });
    


  }
}