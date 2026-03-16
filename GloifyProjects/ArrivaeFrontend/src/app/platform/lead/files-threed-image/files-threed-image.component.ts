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
  selector: 'app-files-threed-image',
  templateUrl: './files-threed-image.component.html',
  styleUrls: ['./files-threed-image.component.css'],
  providers: [LoaderService,LeadService]
})

export class FilesThreedImageComponent implements OnInit {
  @Input() threeDImageList: any = [];
  @Output() dataToParent: EventEmitter<any> = new EventEmitter<any>();
  lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  three_drawing: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  submitted = false;
  lead_status;

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
      this.fetchThreeDImageList();
      
      })
    
	}
  // create three-D code starts
  file_name:any = "";
  file_size:any="";
  onChange(event) {
  	this.file_name = event.target.files[0].name
    this.basefile =event.target.files[0] || event.srcElement.files[0];
   
  }
  onSubmitThree(data) {
       this.submitted = true;
       let postData = {
	       		'three_d_image':{
	       			"attachments": this.basefile,
              "file_name": this.file_name,
	       			"name": data.name
	       		}	
	       		
       		}
       		let formData = new FormData();

for (let key in postData) {
  if (postData.hasOwnProperty(key)) {
    if (typeof postData[key] === "object") {
      for (let nestedKey in postData[key]) {
        if (postData[key].hasOwnProperty(nestedKey)) {
          formData.append(`three_d_image[${nestedKey}]`, postData[key][nestedKey]);
        }
      }
    } else {
      formData.append(key, postData[key]);
    }
  }
}

       this.loaderService.display(true);
       this.dataToParent.emit(true)
       this.leadService.uploadThreeD(this.project_id,formData)
       .subscribe(
           cad => {
            this.dataToParent.emit(false)
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "3-D file uploaded successfully !!";
             this.fetchThreeDImageList();
             $("#threeDModal").modal("hide");
             setTimeout(function() {
              this.successalert = false;
              
               this.createThreeDForm.reset();
            
              }.bind(this), 800);
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
  fetchThreeDImageList(){
    this.loaderService.display(true);
    this.leadService.fetchThreeDImageList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.threeDImageList = res['three_d_images'];
         
      },
      err => {
        this.loaderService.display(false);
        
      }
    );

  }

}
