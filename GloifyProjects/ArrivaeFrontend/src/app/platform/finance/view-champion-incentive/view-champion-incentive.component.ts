import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-view-champion-incentive',
  templateUrl: './view-champion-incentive.component.html',
  styleUrls: ['./view-champion-incentive.component.css'],
  providers: [FinanceService]
})
export class ViewChampionIncentiveComponent implements OnInit {
  p;
  masterIncentiveMonth;
  headers_res;
  per_page;
  total_page;
  page_limit;
  current_page = 1;
  InsentiveCompletelist;
  InsentivePendinglist;
  monthlyIncentiveListData;
  total_records;
  InsentiveCompletelist_totalPage;
  InsentivePendinglist_totalPage;
  successMessage: string;
  errorMessage: string;
  successalert = false;
  erroralert = false;
  role;
  pendingStatus = 'pending';
  releasedStatus = 'released';
  currentProjectStatus = this.pendingStatus;
  fromDate;
  toDate;
 
  constructor(	private route:ActivatedRoute,
    private financeService:FinanceService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.masterIncentiveMonth = params['month'];
      });
      this.currentProjectStatus;
      this.getChampionInsentivePaidlist(1, '');
      this.getChampionIncentivePendingList(1,'');
      if(this.currentProjectStatus !== 'pending') {
        this.InsentiveCompletelist;
      } else {
        this.InsentivePendinglist;
      }
  }

  monthdatalowecase;
  downloadIncentiveDetailsdata() {
      this.masterIncentiveMonth;
      this.monthdatalowecase = this.masterIncentiveMonth.toLowerCase();
      const incentiveMonthdata = this.monthdatalowecase.replace(/ /g,"_");
      this.financeService.downloadIncentiveMonthDetails(incentiveMonthdata).subscribe(res =>{
      this.headers_res= res.headers._headers;
      res= res.json();
      window.open(res.champion_monthly_incentive_report, '_blank');
      var dataaaa = res.champion_monthly_incentive_report;
    });
  }


  championid;
  filterColumDropdownChange1(championid){ 
    this.championid = championid;
  }

  filterData(){
    this.getChampionIncentivePendingList(1,this.championid);
  }

  filterColumDropdownChange2(championid){ 
    this.championid = championid;
  }

  filterData2(){
    this.getChampionInsentivePaidlist(1,this.championid);
  }




  hidecheckbox:boolean = true;
  getChampionIncentivePendingList(page, userid='') {
    this.financeService.getPendingIncentiveMonthList(this.masterIncentiveMonth,page,'',userid).subscribe(res =>{
      this.headers_res= res.headers._headers;
      res= res.json();
      if(this.pendingStatus === 'pending') {
        // this.hidecheckbox = true;
        this.InsentivePendinglist = res.champion_pending_monthly_incentive_detail;
        this.monthlyIncentiveListData = this.InsentivePendinglist;
      }
      this.total_records = res.total_records;
      this.per_page = res.limit;
      this.InsentivePendinglist_totalPage = this.total_records
    });
  }

  getChampionInsentivePaidlist(page,userid) {
    this.financeService.getPaidIncentiveMonthList(this.masterIncentiveMonth,page,'',userid).subscribe(res =>{
      this.headers_res= res.headers._headers;
      res= res.json();
      if(this.releasedStatus === 'released') {
        // this.hidecheckbox = false;
        this.InsentiveCompletelist = res.champion_paid_monthly_incentive_detail;
        this.monthlyIncentiveListData = this.InsentiveCompletelist;
      }
      this.total_records = res.total_records;
      this.InsentiveCompletelist_totalPage = res.total_records;
      this.per_page = res.limit;
    });
  }

  changeProjectStatus(status) {
    this.currentProjectStatus=status;
    this.loaderService.display(true);
    if(status === 'pending') {
      this.hidecheckbox = !this.hidecheckbox;
      this.loaderService.display(false);
      this.getChampionIncentivePendingList(1,'');
    } else {
      this.hidecheckbox = !this.hidecheckbox;
      this.loaderService.display(false);
      this.getChampionInsentivePaidlist(1, '');
    }
  }

  UserIdCheckbox: number;
  useridarray = [];
  isSelected = false;
  isAllSelected(id, event: any, isSelected) {
    this.isSelected = false
    if (event.target.checked) {

      this.useridarray.push(id);
      this.useridarray = this.useridarray.filter((element, i) => i === this.useridarray.indexOf(element))

    } else {
      $("#allcheckid").prop('checked', false);
      for (var i = 0; i < this.InsentivePendinglist.length; i++) {
        if (this.useridarray[i] == id) {
          this.useridarray.splice(i, 1);
        }
      }
    }
  }

  selectAll(event) {
      this.InsentivePendinglist.forEach((data,index) => {
        if(event.target.checked) {
          if(data.user_id) {
            this.useridarray.push(data.user_id);
            this.useridarray = this.useridarray.filter((element, i) => i === this.useridarray.indexOf(element))
            setTimeout(() => {
              $("#idvalue-"+index).prop('checked',true);
            }, 500)
          } 
        } else {
          $("#idvalue-"+index).prop('checked',false);
          this.useridarray = [];
        }
    });
  }

 
  paidCheckBox() {
    const userId = this.useridarray;
    this.monthdatalowecase = this.masterIncentiveMonth.toLowerCase();
    const incentiveMonthdata = this.monthdatalowecase.replace(/ /g,"_");
    if(userId.length > 0){
      this.financeService.checkUnCheck(userId,incentiveMonthdata).subscribe(res => {
        this.headers_res = res.headers._headers;
        res = res.json();
        this.successalert = true;
        this.successMessage = res.message;
        this.getChampionIncentivePendingList(1,'');
        this.getChampionInsentivePaidlist(1,'');
        this.changeProjectStatus(this.releasedStatus);
        setTimeout(function() {
              this.successalert = false;
        }.bind(this), 2000);
  
      }, error => {
        this.errorMessage = error;
        this.errorMessage = JSON.parse(this.errorMessage['_body']).errors;
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 5000);
      });
    }else{
      alert('Please select atleast one item from the list');
    }
  }





}
