import { Component, OnInit } from '@angular/core';
import {LeadService} from '../../lead/lead.service';
import { LoaderService } from 'app/services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { SortPipe } from '../../../shared/sort.pipe';
declare var $:any;
@Component({
  selector: 'app-design-stdio',
  templateUrl: './design-stdio.component.html',
  styleUrls: ['./design-stdio.component.css'],
  providers: [LeadService]
})
export class DesignStdioComponent implements OnInit {

  constructor(
		private loaderService: LoaderService,
		private leadService: LeadService,
    public route:ActivatedRoute,
    public router:Router
	) { }
	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
	headers_res;
  per_page;
  total_page;
  current_page;
  page=1;
  search:any=''; 
  filter:any='';
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['page']) {
        this.page=params['page'];
      } 
      if (params['status']) {
        this.filter=params['status'];
      } 
    }); 
  	this.getDesignStudioList(this.page,this.search,this.filter);
  }
  list_design:any;
  getDesignStudioList(pages,searched?,filters?) { 
    this.page=pages;
    this.filter=filters;
    this.router.navigate(['/design-studio'],{ queryParams: {'page':this.page,'status':this.filter}});
		this.loaderService.display(true);
  	this.leadService.getDesignStudio(pages,searched,filters).subscribe(
  		res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.list_design = res.cms;
  			this.loaderService.display(false);
  		},
  		err=>{
  			this.loaderService.display(false);
  		}
  	);
	}
	search_value;
  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    this.page=1;
    var  i=0;
    if(true){
      this.getDesignStudioList(this.page,this.search_value,this.filter);
      i++;
    }
  }
  
	onchangeFilter(event){
    this.page=1;
    this.getDesignStudioList(this.page,this.search,event);
	}
	selectB;
	cmId;
	assignButton(selectedB,cm_id){
    this.selectB=selectedB;
    this.cmId=cm_id;
    $('#AssignPaidBatch').modal('show');
    $('#transaction-ref').val('');
    $('#batch_size').val('');
    $('#conversions').val('');
	}
	//for collapsable row table
  rowSelected;
  cm_info_id;
  toggleRow(row) {  
    if (this.rowSelected === -1) {
      this.rowSelected = row.id
    }
    else {
      if (this.rowSelected == row.id) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row.id
      }
    }  
    this.cm_info_id=row.cm_info_id;
    this.selectB='';
    this.getDesignStudioBatchList(row.cm_info_id);
  }
  direction: number;
  	isDesc: boolean = true;
  	column: string = 'CategoryName';
    // Change sort function to this: 
  	sort(property){
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      this.direction = this.isDesc ? 1 : -1;
  	}
  validationAndSubmit(){
    this.transaction=$('#transaction-ref').val();
    this.batchsize=$('#batch_size').val();
    this.conversions=$('#conversions').val();
    if (this.selectB=='Assign a Paid Batch') {
      if (this.cmId && this.transaction && this.batchsize && this.conversions) {
        if (this.batchsize<=500 && this.batchsize>0 && this.conversions<=500 && this.conversions>0) {
         this.createFreeOrPaidStudio();
        }else{
          this.erroralert = true;
          this.errorMessage = "Batch size and Conversion size must be between 1 to 500";
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 5000);
        }
      }else{
        this.erroralert = true;
        this.errorMessage = "Please Fill Required field";
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);
      }
    }
    if (this.selectB=='Assign a Free Batch') {
      if (this.cmId && this.batchsize && this.conversions) {
        if (this.batchsize<=500 && this.batchsize>0 && this.conversions<=500 && this.conversions>0) {
         this.createFreeOrPaidStudio();
        }else{
          this.erroralert = true;
          this.errorMessage = "Batch size and Conversion size must be between 1 to 500";
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 5000);
        }
      }else{
        this.erroralert = true;
        this.errorMessage = "Please Fill Required field";
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);
      }
    }
  }
	transaction:any;
	batchsize:any;
	conversions:any
	createFreeOrPaidStudio(){
		this.loaderService.display(true);
  	this.leadService.createFreeOrPaidDesignStudio(this.transaction,this.batchsize,this.conversions,this.selectB,this.cmId).subscribe(
  		res=>{
  			this.loaderService.display(false);
  			this.successalert = true;
        this.successMessage = "Assign a Batch Successfully";
        this.getDesignStudioList(this.page,this.search,this.filter);
        this.getDesignStudioBatchList(this.cm_info_id);
        $('#AssignPaidBatch').modal('hide');
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 5000);
  		},
  		err=>{
  			this.loaderService.display(false);
  			this.erroralert = true;
  			this.errorMessage = <any>JSON.parse(err['_body']).message;
  			setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);
  		}
  	);
	}
  list_design_batch:any;
  getDesignStudioBatchList(cmId) { 
    this.loaderService.display(true);
    this.leadService.getDesignStudioBatch(cmId).subscribe(
      res=>{
        res= res.json();
        this.list_design_batch = res.design_studio_lead_batches;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }
}
