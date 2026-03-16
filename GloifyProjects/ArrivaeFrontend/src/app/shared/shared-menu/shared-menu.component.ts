import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../../platform/lead/lead.service';
import { LoaderService } from '../../services/loader.service';
import { FinanceService } from 'app/platform/finance/finance.service';
@Component({
  selector: "app-shared-menu",
  templateUrl: "./shared-menu.component.html",
  styleUrls: ["./shared-menu.component.css"],
  providers: [LeadService, FinanceService],
})
export class SharedMenuComponent implements OnInit {

  @ViewChild('tabsContainer') tabsContainer!: ElementRef;

  disableLeftArrow = true;
  disableRightArrow = false;

  project_id;
  role;
  showitem:boolean=true;


  @Input() lead_id: any;
  @Input() lead_details: any = {};
  @Input() lead_status: any;
  @Input() overview_tab: any;
  @Input() activity_log_tab: any;
  @Input() basic_info_tab: any;
  @Input() detailed_info_tab: any;
  @Input() boq_tab: any;
  @Input() ppt_tab: any;
  @Input() files_tab: any;
  @Input() calender_tab: any;
  @Input() proposal_tab: any;
  @Input() custom_tab: any;
  @Input() payment_tab: any;
  @Input() payment_approval_tab: any;
  @Input() handover_for_production: any;
  @Input() obtooctrack: any;
  @Input() project_progress: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService: LeadService,
    public financeService: FinanceService,
    public loaderService: LoaderService,
    private route: ActivatedRoute
  ) {}

  customer_status;
  project_status: any;
  sub_status: any;
  iconverified: any;
  emailverified: boolean;
  is_before_email_verify: any = true;
  bu_head_approved_email: any;

  ngOnInit() {
    this.iconverified = localStorage.getItem("emailverified") == "true";
    this.lead_details = null;
    this.role = localStorage.getItem("user");
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
    });
    this.customer_status = localStorage.getItem("customer_status");
    this.fetchBasicDetails();
  }

  ngAfterViewInit() {
    // Initial check to enable/disable arrows based on scroll position
    this.checkScroll();
  }

  order_booking_actual: any = "";
  status = [
    "initial_payment_recieved",
    "site_measurement_done",
    "final_proposal_submitted",
    "final_proposal_rejected",
    "final_proposal_accepted",
    "40%_payment_recieved",
    "handover_done",
  ];
  isShowItems = true;
  fetchBasicDetails() {
    this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
          this.loaderService.display(false);
          let lead_details = res["lead"];
          this.lead_details = lead_details;
          // if(this.overview_tab=='active'){
          //   console.log("hoioii")
          //   this.isShowItems = false;
          //   setTimeout(() => {
          //     this.isShowItems = true;
          //   }, 500);
          // }
        localStorage.setItem("lead_details", JSON.stringify(this.lead_details));
        this.lead_status = this.lead_details.lead_status;
        this.project_id = this.lead_details.project_details.id;
        this.order_booking_actual = lead_details["order_booking_actual_date"];
        this.project_status = lead_details["project_status"];
        this.sub_status = this.status.includes(lead_details["project_details"].sub_status);

        
        this.is_before_email_verify = this.lead_details.is_before_email_verify
        this.bu_head_approved_email = this.lead_details.bu_head_approved_email;
        this.emailverified = this.lead_details.email_verified;
        this.iconverified =(this.emailverified || this.bu_head_approved_email);

        localStorage.setItem("iconverified", this.iconverified.toString());

        this.isProjectInWip()

      },
      (err) => {
        this.loaderService.display(false);
      }
    );
    
    console.log(this.lead_details);
  }

  isProjectInWip() {
    this.loaderService.display(true)
    var wip_array = [
      "wip",
      "pre_10_percent",
      "10_50_percent",
      "50_percent",
      "installation",
      "on_hold",
      "inactive",
      "completed",
    ];
    if (
      this.lead_details &&
      this.lead_details.project_details &&
      this.lead_details.project_details.status &&
      wip_array.includes(this.lead_details.project_details.status)
    ) {
      this.showitem=true
    } else {
      this.showitem= false;
    }
    this.loaderService.display(false)
  }

  scrollTabs(direction: string): void {
    const element = this.tabsContainer.nativeElement;

    if (direction === 'left') {
      element.scrollBy({ left: -2000, behavior: 'smooth' });
    } else {
      element.scrollBy({ left: 2000, behavior: 'smooth' });
    }

    // Check the scroll position after scrolling
    setTimeout(() => this.checkScroll(), 200);
  }

  checkScroll(): void {
    const element = this.tabsContainer.nativeElement;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    // Disable arrows based on scroll position
    this.disableLeftArrow = element.scrollLeft === 0;
    this.disableRightArrow = element.scrollLeft >= maxScrollLeft-100;
    if (this.disableLeftArrow) {
      // document.querySelectorAll('.left-arrow').forEach((element) => {
      //   (element as HTMLElement).style.display = 'none';
      // });
      const elements:any = document.querySelectorAll('.left-arrow');
      if(elements.length>0){
        Array.from(elements).forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });
      }
    }
    else{
      // document.querySelectorAll('.left-arrow').forEach((element) => {
      //   (element as HTMLElement).style.display = 'flex';
      // });
      const elements:any = document.querySelectorAll('.left-arrow');
      if(elements.length>0){
        Array.from(elements).forEach((element) => {
          (element as HTMLElement).style.display = 'flex';
      });
    }

    }
    if (this.disableRightArrow) {
      // document.querySelectorAll('.right-arrow').forEach((element) => {
      //   (element as HTMLElement).style.display = 'none';
      // });



      const elements:any = document.querySelectorAll('.right-arrow');
      if(elements.length>0){
        Array.from(elements).forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
    }
    }
    else{
      // document.querySelectorAll('.right-arrow').forEach((element) => {
      //   (element as HTMLElement).style.display = 'flex';
      // });
 
    const rightArrows:any = document.querySelectorAll('.right-arrow');

    if (rightArrows.length > 0) {
      Array.from(rightArrows).forEach((element) => {
        (element as HTMLElement).style.display = 'flex';
      });
    }

    }
  }
}