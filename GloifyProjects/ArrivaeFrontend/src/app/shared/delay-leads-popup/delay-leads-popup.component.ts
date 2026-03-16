import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  NgModule,
  Pipe,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from "@angular/core";
import { environment } from '../../../environments/environment';

import { LeadService } from '../../platform/lead/lead.service';
import { LoaderService } from "../../services/loader.service";
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-delay-leads-popup',
  templateUrl: './delay-leads-popup.component.html',
  styleUrls: ['./delay-leads-popup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LeadService],

})
export class DelayLeadsPopupComponent implements OnInit {

  openpopup:any;
  @Output() onCloseModalPopup : EventEmitter<any> = new EventEmitter();
  @Output() onLoadBtnClick : EventEmitter<any> = new EventEmitter();
  @Input() openDelayLeadPoppup:any;
  @Input() list_delay_lead:any;
  @Input() total_page:any;
  @Input() moreData:any;
  @Input() count:any;

  // @Input() parentSubject: Subject<any> | any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService: LeadService,
    private loaderService: LoaderService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.list_delay_lead = this.list_delay_lead
    this.moreData = this.moreData
    this.total_page = this.total_page
    this.count = this.count
    // this.parentSubject.subscribe((event:any) => {
    //   if(event){
    //     setTimeout(
    //       function () {
    //         this.delayedLeads(this.current_page)
    //       }.bind(this),
    //       2000
    //     );
    //   }


    // })
    console.log("openDelayLeadPoppupopenDelayLeadPoppup",this.openDelayLeadPoppup)
    
    // }
  }

  ngAfterViewInit(){
    console.log("new value!!!!")
    this.list_delay_lead = this.list_delay_lead
    this.moreData = this.moreData
    this.total_page = this.total_page
    this.count = this.count

    //for open delay lead popup
    if(this.openDelayLeadPoppup){
      setTimeout(
        function () {
          this.delayedLeads(this.current_page)
        }.bind(this),
        1000
      );
    }
  }

  closeModalValidation(){
    console.log(!environment.production);
    return !environment.production
  }
  getItems(e) {
    if (e !== undefined && e !== "") {
      this.current_page = e;
    }

    if (this.current_page == undefined) {
      this.current_page = 1;
    }
  }

  // list_delay_lead:any = [];
  headers_res:any;
  per_page:any = 10;
  // total_page:any;
  // count:any;
  current_page:any = 1;
  diff1:any;
  diff2:any;
  allLeads:any = false;
  delayedLeads(currentPage){
    this.allLeads = false;
    this.loaderService.display(true);
    this.current_page = currentPage ? currentPage : this.current_page
    const storedLeads = JSON.parse(localStorage.getItem("delay_list"));
    var trigged_at = localStorage.getItem("trigged_at");
    this.diff1 = new Date(trigged_at);
    this.diff2 = new Date();
    const diff = Math.abs(this.diff2 - this.diff1)
    console.log(this.diff1,this.diff2,diff)
    var minutes = Math.floor((diff/1000)/60);
    console.log('minutes',minutes)
    if(storedLeads.length > 0 && minutes < 30){
      // this.per_page = 10;
      // this.total_page = localStorage.getItem("total_page");
      this.moreData = localStorage.getItem("more_data");
      // this.count = localStorage.getItem("count");
      // this.list_delay_lead = storedLeads
      // console.log("this.list_delay_lead",this.list_delay_lead)
      $("#delayLeadsModal").modal("show");
      this.loaderService.display(false);
    }
    else{
      this.leadService.delayedLeads(this.allLeads).subscribe((res) => {
        $("#delayLeadsModal").modal("show");
        this.loaderService.display(false);
        // console.log("delay lead res", res)
        this.moreData = res.data.more_data
        // this.per_page = 10;
        // this.total_page = res.data.total_pages;
        // this.count = res.data.count;
        // this.list_delay_lead = res.data.leads;
        // localStorage.setItem("delay_list", JSON.stringify(this.list_delay_lead));
        // localStorage.setItem("more_data", JSON.stringify(this.moreData));
        // localStorage.setItem("trigged_at", res.data.trigged_at);
        // localStorage.setItem("total_page", this.total_page);
        // localStorage.setItem("count", this.count);

      },
      (error) => {
        this.loaderService.display(false);
      });
    }
  }

  onCloseModal() {
    this.onCloseModalPopup.emit({open:false});
    $("#delayLeadsModal").modal("hide");
    [].forEach.call(document.querySelectorAll('.modal-backdrop'), function (el) {
      el.style.visibility = 'hidden';
    });
  }

  searchDelayLeads:any = '';
  // searchFilter(event: any) {
  //   this.searchDelayLeads = event.target.value
  //   const storedLeads = this.loadBtn == false ? this.all_lead_data : JSON.parse(localStorage.getItem("delay_list"));
  //   if(this.searchDelayLeads != ""){
  //     this.list_delay_lead = storedLeads.filter((val,idx) => val.lead_id.toString().includes(this.searchDelayLeads) == true || val.lead_name.toLowerCase().includes(this.searchDelayLeads.toLowerCase()) == true)
  //     console.log("filter data this.list_delay_lead", this.list_delay_lead)
  //   }else{
  //     this.list_delay_lead = storedLeads
  //   }
  // }


  searchInput:any = '';
  onSearchInput() {
    const storedLeads = this.loadBtn == false ? this.all_lead_data : JSON.parse(localStorage.getItem("delay_list"));
    if(this.searchInput != ""){
      this.list_delay_lead = storedLeads.filter((val,idx) => val.lead_id.toString().includes(this.searchInput) == true || val.lead_name.toLowerCase().includes(this.searchInput.toLowerCase()) == true)
      console.log("filter data this.list_delay_lead", this.list_delay_lead)
    }else{
      this.list_delay_lead = storedLeads
    }
  }


  loadBtn:any = true;
  all_lead_data:any = [];
  loadMoreBtn(){
    this.allLeads = true;
    // $("#delayLeadsModal").modal("hide");
    this.loaderService.display(true);
    this.leadService.delayedLeads(this.allLeads).subscribe((res) => {
      this.loaderService.display(false);
      this.onLoadBtnClick.emit({list_delay_lead : res.data.leads, moreData:false, count:res.data.count, total_page: res.data.total_pages})
      console.log("delay lead res", res)
      // this.per_page = res.data.per_page;
      this.moreData = false;
      this.loadBtn = false
      this.per_page = 10;
      this.total_page = res.data.total_pages;
      this.count = res.data.count;
      // this.current_page = res.data.current_page;
      this.all_lead_data = res.data.leads
      this.list_delay_lead = res.data.leads;
      // localStorage.setItem("delay_list", JSON.stringify(this.list_delay_lead));
      localStorage.setItem("trigged_at", res.data.trigged_at);
      // localStorage.setItem("per_page", this.per_page);
      localStorage.setItem("total_page", this.total_page);
      localStorage.setItem("count", this.count);
      // localStorage.setItem("current_page", this.current_page);
      $("#delayLeadsModal").modal("show");

    },
    (error) => {
      this.loaderService.display(false);
    });
  }

  redirectNOCBtn(){
    this.onCloseModalPopup.emit({open:false});
    $("#delayLeadsModal").modal("hide");
    [].forEach.call(document.querySelectorAll('.modal-backdrop'), function (el) {
      el.style.visibility = 'hidden';
    });
    this.router.navigate(['/noc-screen/zero-to-forty'],
    {
      queryParams: { delay: true,}
    });
  }

}
