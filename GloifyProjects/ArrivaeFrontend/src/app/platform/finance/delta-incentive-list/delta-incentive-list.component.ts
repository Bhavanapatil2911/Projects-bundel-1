import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'app/services/loader.service';
import { DateTimeAdapter, OwlDateTimeComponent, OwlDateTimeFormats, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { FinanceService } from '../finance.service';
import * as _moment from 'moment';
import { Moment } from 'moment';


const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};


@Component({
  selector: 'app-delta-incentive-list',
  templateUrl: './delta-incentive-list.component.html',
  styleUrls: ['./delta-incentive-list.component.css'],
  providers: [

],
})
export class DeltaIncentiveListComponent implements OnInit {
  startDate;
  endDate;
  currentSelectedMonth;
  incentiveTypeArr = ['designer','cm','gm','dm'];
  // public dateTime = new FormControl(moment().subtract(1, 'months'));
  public dateTime = new Date( new Date().getFullYear(),
  new Date().getMonth() - 1, 
  new Date().getDate());
  maxDateTime = new Date( new Date().getFullYear(),
  new Date().getMonth() - 1, 
  new Date().getDate());
  



  constructor( private financeService:FinanceService,
    private loaderService: LoaderService) { }

  ngOnInit() {
  } 

  errorMessage: string;
  erroralert = false;
  downloadIncentiveData(incentiveType:any) {    
    this.financeService.downloadIncentiveData(incentiveType,this._trasformDateType(this.dateTime)).subscribe(res=>{
      window.open(res.report, '_blank');
    },
    err=>{
      this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 2000);
    });
  }
 
private _trasformDateType(dateValue){
  return moment(dateValue).format('MMM YYYY')
}
}
