import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { FloorplanService } from '../../floorplans/floorplan/floorplan.service';
import { Floorplan } from '../../floorplans/floorplan/floorplan';
import { Angular2TokenService } from 'angular2-token';

declare var $:any;


@Component({
  selector: 'app-inspiration-board',
  templateUrl: './inspiration-board.component.html',
  styleUrls: ['./inspiration-board.component.css'],
  providers: [LoaderService,LeadService]
})
export class  InspirationBoardComponent implements OnInit {
	@Input() inspirationList:any = [];
	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  floorplan : Floorplan[];
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  submitted = false;
  lead_status;
  id: any;
  name: any;
  customerDetails;
  neha: string;

  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public floorplanService : FloorplanService,

    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
        this.name = params['name'];
        this.id = params['id'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
    
  }
  client_name;
  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res['lead']
        this.project_id = this.lead_details.project_details.id;
        this.client_name = this.lead_details.project_details.name;
        this.fetchPptList()

      })
   

  }
  fetchPptList(){
    this.loaderService.display(true);
    this.leadService.fetchInspiration(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.inspirationList= res['customer_inspirations'];
        
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }
  imgfile:any;
  getImage(data){
    this.imgfile = data.file_info.url;
    
  }

}
