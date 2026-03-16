
// starts here
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


declare var $: any;

@Component({
  selector: 'app-lead-store',
  templateUrl: './lead-store.component.html',
  styleUrls: ['./lead-store.component.css'],
  providers: [LeadService]

})
export class LeadStoreComponent implements OnInit {
  lead_store_id: any;

  constructor(
    private leadService: LeadService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private _activatedroute: ActivatedRoute,
    private _router: Router,
    private location: Location,
  ) { }


  per_page;
  total_page;
  current_page=1;
  headers_res;
  page_number;
  searchValue = '';

  promoPackagesForm: any;

  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  today_date: any;
  ngOnInit() {
    if(localStorage.getItem('lead_store_page_number')){
      this.current_page = parseInt(localStorage.getItem('lead_store_page_number'));
    }
    this.getLeadStoreList(this.current_page,'');

  }

  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function () {
      this.erroralert = false;
    }.bind(this), 10000);
  }
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function () {
      this.successalert = false;
    }.bind(this), 10000);
  }

  lead_store_que_arr;
  getLeadStoreList(currentPage,searchValue) {
    this.page_number = currentPage;
    this.loaderService.display(true);
    this.leadService.getLeadStoreListForMainPage(currentPage,searchValue).subscribe(
      res => {
        this.loaderService.display(false);
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res = res.json();
        this.lead_store_que_arr = res.lead_stores;
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }


  handleLeadStoreCreateEvent(event){
    $('#leadStoreModal').modal('hide');
    this.successMessageShow(`Lead Store ${event} Successfully`);
    this.getLeadStoreList(this.current_page,this.searchValue);
    
  }
  handleCloseEvent(){
    this.lead_store_id = '';
    $('#leadStoreModal').modal('hide');
  }
  updateLeadStore(leadStoreId){
   this.lead_store_id = leadStoreId;
  }
  searchLeadStore(){
    this.current_page = 1;
    this.getLeadStoreList(this.current_page,this.searchValue)
  }
  navigateToPage(event){
    localStorage.setItem('lead_store_page_number',(event).toString());
  }
}
