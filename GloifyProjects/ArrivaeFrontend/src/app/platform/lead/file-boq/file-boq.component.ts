import { Component, OnInit, ElementRef, Input,Output,EventEmitter } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
declare var $:any;

@Component({
  selector: 'app-file-boq',
  templateUrl: './file-boq.component.html',
  styleUrls: ['./file-boq.component.css']
})
export class FileBoqComponent implements OnInit {
	@Input() boqFileList:any = [];
  @Output() dataToParent: EventEmitter<any> = new EventEmitter<any>();
  
	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  boq_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  lead_status;
  submitted = false;
  completeRequestForm: FormGroup;
  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute
  	) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
  
  }
  fetchBasicDetails(){
  

    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
      this.lead_details = res['lead']
      this.project_id = this.lead_details.project_details.id;
      this.fetchLineMarkingList(); 
      
      })
    
  }
  file_name:any = "";
  size;
  sizeKB;
  onChange(event) {
     this.size = event.target.files[0].size;
    this.sizeKB = this.size/1000;
  	this.file_name = event.target.files[0].name
    this.boq_file =event.target.files[0] || event.srcElement.files[0];
    this.basefile =  this.boq_file
  }
  
  onSubmit(data) {
       this.submitted = true;
       let postData = {
	       		  "line_marking": {
               "file_name": this.file_name,
              "name": data.name,
              "description": data.details,
               "attachments":{
                "document_file_name":this.file_name,
                "document_content_type": this.basefile,
                "document_file_size":this.sizeKB,
               }
             }
           }

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
	       		   
           this.dataToParent.emit(true)
       this.loaderService.display(true);
       this.leadService.uploadLineMarking(this.project_id,formData)
       .subscribe(
           cad => {
            this.dataToParent.emit(false)
             
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "Line Marking file uploaded successfully !!";
             $("#linemarkingModal").modal("hide");
             setTimeout(function() {
            
               this.successalert = false;
               this.createBoqForm.reset();
               // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
              
              }.bind(this), 800);
             this.fetchLineMarkingList(); 
           },
           error => {
             this.erroralert = true;
             this.dataToParent.emit(false)
             this.errorMessage = JSON.parse(error['_body']).message;
             setTimeout(function() {
                this.erroralert = false;
              }.bind(this), 10000);

             this.loaderService.display(false);
             return Observable.throw(error);
           }
       );
  } 
   
  fetchLineMarkingList(){
    this.loaderService.display(true);
    this.leadService.fetchLineMarkingList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.boqFileList = res['line_markings'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  deleteObject(obj_id){
    if (confirm("Are You Sure you want to delete this Line Marking File?") == true) {
      this.loaderService.display(true);
      this.leadService.deleteLineMarking(this.project_id,obj_id)
      .subscribe(
          res => {
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Line Marking deleted successfully !!";
            this.fetchLineMarkingList();
            setTimeout(function() {
              this.successalert = false;
             }.bind(this), 800);
          },
          err => {
            this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
             }.bind(this), 10000);

            this.loaderService.display(false);
          });
    }
  }
}
