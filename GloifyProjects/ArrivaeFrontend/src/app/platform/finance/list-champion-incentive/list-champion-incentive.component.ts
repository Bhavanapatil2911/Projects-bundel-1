// import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { FinanceService } from '../finance.service';
import * as moment from 'moment';

// import { formatDate } from "@angular/common";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-list-champion-incentive',
  templateUrl: './list-champion-incentive.component.html',
  styleUrls: ['./list-champion-incentive.component.css'],
  providers:[FinanceService,DatePipe]
})
export class ListChampionIncentiveComponent implements OnInit {

  championIncentiveList:any;
  headers_res;
  per_page;
  total_page;
  current_page;

  successMessage : string;
  errorMessage : string;
  successalert = false;
  erroralert = false;
 
 
  previoussximonthdatefilterevent;
  endTodaydatefilterevent;
  previousdataInput;
  enddataInput;

   constructor(private financeService:FinanceService,
               private loaderService: LoaderService,
               private datePipe: DatePipe
               ) { }

  ngOnInit() {
    this.getChampionInsentivelist();
  }

  getChampionInsentivelist(startdate?,enddate?) {
    this.dateCalculation();
    this.loaderService.display(true);
   

    this.financeService.getchampionIncentiveList(this.previousdataInput,this.enddataInput).subscribe(res => {
      this.loaderService.display(false);
      this.headers_res= res.headers._headers;
      this.per_page = this.headers_res.get('x-per-page');
      this.total_page = this.headers_res.get('x-total');
      this.current_page = this.headers_res.get('x-page');
       res= res.json();
      this.championIncentiveList = Object.values(res.champion_incentive_screen);
    },
    error => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(this.errorMessage['_body']).message;
      this.loaderService.display(false);
    });
  }

  takeFromDate(event) {
    this.previoussximonthdatefilterevent = event.value;
   }
  takeToDate(event) {
    this.endTodaydatefilterevent = event.value;
  }
  filterData() {
    this.getChampionInsentivelist(this.previoussximonthdatefilterevent,this.endTodaydatefilterevent);
  }

dateCalculation() {
  //caluculation of today date (enddate) by defalut
  const todayDate = new Date();
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(todayDate);
  const mo = new Intl.DateTimeFormat("en", { month: "numeric" }).format(todayDate);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(todayDate);
  const todaydatebyDefault = `${da}/${mo}/${ye}`

  //caluculation of previous six month date from today date (startdate)  by defalut
  todayDate.setMonth(todayDate.getMonth() - 6);
  const sixmonthdatebyDefault = todayDate.toLocaleDateString('en-GB');

  const defaultEndDate = todaydatebyDefault;
  const defaultBeforeSixMonthDate = sixmonthdatebyDefault

  //filter previous date with date formate 
  if(this.previoussximonthdatefilterevent !==undefined){
    const previousdateCalculation = this.previoussximonthdatefilterevent;
    const previousyearCal = new Intl.DateTimeFormat("en", { year: "numeric" }).format(previousdateCalculation);
    const previousmonthCal = new Intl.DateTimeFormat("en", { month: "numeric" }).format(previousdateCalculation);
    const previousdateCal = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(previousdateCalculation);
    this.previoussximonthdatefilterevent = `${previousdateCal}/${previousmonthCal}/${previousyearCal}`
  }
 
  //filter end date with date formate
  if(this.endTodaydatefilterevent !==undefined) {
    const enddateCalculation = this.endTodaydatefilterevent;
    const endyearcal = new Intl.DateTimeFormat("en", { year: "numeric" }).format(enddateCalculation);
    const endmonthcal = new Intl.DateTimeFormat("en", { month: "numeric" }).format(enddateCalculation);
    const enddatecal = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(enddateCalculation);
    this.endTodaydatefilterevent = `${enddatecal}/${endmonthcal}/${endyearcal}`
  }
 
  //sending data input in api service
  this.previousdataInput = (this.previoussximonthdatefilterevent ? this.previoussximonthdatefilterevent : defaultBeforeSixMonthDate);
  this.enddataInput = (this.endTodaydatefilterevent ? this.endTodaydatefilterevent : defaultEndDate);
}

paidIncentiveMonth(incentiveMonth, status) {
    const incentiveMonthdata = incentiveMonth;
    this.loaderService.display(true);
    if(status !== null) {
      this.financeService.getpendingStatusMasterIncentive(incentiveMonthdata).subscribe( res=> {
        this.headers_res= res.headers._headers;
        res= res.json();
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = res.message;
        this.getChampionInsentivelist();
        this.successMessage = res.message;
        setTimeout(function() {
              this.successalert = false;
        }.bind(this), 2000);
  
      }, error =>  {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = error;
        this.errorMessage = JSON.parse(this.errorMessage['_body']).errors;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);
      });
    } else {
      this.successalert = true;
      this.loaderService.display(false);
      this.successMessage = "In this Month there is no data";
      setTimeout(function () {
        this.successalert = false;
      }.bind(this), 4000);
    }
   
  }

  downloadMonthData;
  monthdatalowecase;
  downloadIncentiveList(monthdata) {
    const incentiveMonth = monthdata.incentive_month
    this.monthdatalowecase = incentiveMonth.toLowerCase();
     const incentiveMonthdata = this.monthdatalowecase.replace(/ /g,"_");
    this.financeService.downloadIncentivelist(incentiveMonthdata).subscribe(res=> {
      this.downloadMonthData = res.champion_incentive_report;
         window.open(res.champion_incentive_report, '_blank');
    });

  }

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }

}
