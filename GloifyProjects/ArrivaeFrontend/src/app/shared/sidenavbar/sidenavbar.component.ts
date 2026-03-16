import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { UserDetailsService } from '../../services/user-details.service';
import {CsagentService} from '../../platform/organisation/csagentdashboard/csagent.service';
import { ProfileService } from '../../platform/profile/profile/profile.service';
import { Subject } from 'rxjs';
import { DelayLeadsPopupComponent } from '../delay-leads-popup/delay-leads-popup.component';
import { LeadService } from '../../platform/lead/lead.service';
import { LoaderService } from "../../services/loader.service";
declare var $:any;
@Component({
  selector: "app-sidenavbar",
  templateUrl: "./sidenavbar.component.html",
  styleUrls: ["./sidenavbar.component.css"],
  //  styles: [require('./sidenavbar.component.css'), '.active { background-color: red; }'],
  // styles: ['.router-link-active { background-color: red; }'],
  providers: [UserDetailsService, CsagentService, ProfileService, LeadService, LoaderService],
})
export class SidenavbarComponent implements OnInit {
  @Output() sendChildValue: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('child') child: DelayLeadsPopupComponent;
  
  childValue: string;
  role: string;
  leadMgmtAccess = ["admin", "lead_head", "customer_head",];
  brokerMgmtAccess = ["admin", "lead_head"];
  csagentlistAccess = ["admin", "lead_head"];
  catalogueMgmtAccess = [
    "admin",
    "catalogue_head",
    "design_head",
    "designer",
    "catalog_viewer",
    "community_manager", 
    "category_panel",
    "category_non_panel",
    "category_services",
    "category_head",
  ];
  portfolioAccess = ["admin"];
  testimonialAccess = ["admin"];
  boqAcess = ["admin"];
  userMgmtAccess = ["admin", "design_head", "customer_head"];
  projectAccess = ["admin", "customer", "design_head", "lead_head"];
  profileAccess = [
    "admin",
    "customer",
    "designer",
    "catalogue_head",
    "design_head",
    "lead_head",
    "broker",
    "customer_head",
    "cs_agent",
    "community_manager",
    "referral",
  ];
  designerPortfolioAccess = ["designer", "design_head", "admin"];
  categoryDataAccess = [
    "admin",
    "category_head",
    "category_panel",
    "category_non_panel",
    "category_services",
  ]; //V:Category Login to be divided into 3 parts-(Category Non Panel,Category Panel,Category Services) All the Category Team Logins to be divided into one of the options and action will perform according role.Category Head have all three access.
  global_preset_access = [
    "category_panel",
    "category_non_panel",
    "category_services",
    "designer",
    "category_head",
  ];
  cm_variable_margin_access = [
    "business_head",
    "category_panel",
    "category_non_panel",
    "category_services",
    "community_manager",
    "category_head",
  ];
  admin_metric_access = ["admin", "business_head"];
  emi_calculator_access = ["designer"];
  window = window;
  route_url;
  userData;
  navurl;

  // @Input()
  // parentSubject: Subject<any> = new Subject();
  constructor(
    private authService: AuthService,
    private tokenService: Angular2TokenService,
    public userDetailService: UserDetailsService,
    public csagentService: CsagentService,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    public router: Router,
    public leadService: LeadService,
    private loaderService: LoaderService,
  ) {
    this.role = localStorage.getItem("user");
  }
  pageloadbool = true;

  width_value: any;
  ngOnInit() {
    this.width_value = "false";
    $("#value_hid").hide();
 $(".sideNav li").removeAttr("style");
    $(".adminDiv2").css("width", "14rem");
    $(".profileImg2").css("width", "14rem");
    $(".profileImg").css("width", "14rem");
    $(".side-act-mini").css("width", "14rem");
     $(".profileImg2").css("margin-bottom", "4%");

    this.role = localStorage.getItem("user");
    this.pop_check = window.location.href.includes('boq-view-noc')
    //for delay leads popup
    const screenVal = window.location.href.includes('noc-screen')
    if(this.role == 'designer' && screenVal != true && ! this.pop_check ){
      this.delayedLeads(this.current_page)
    }
    //for delay leads popup

    if (
      this.role == "lead_head" ||
      this.role == "admin" ||
      this.role == "cs_agent"
    ) {
      this.getLeadPoolList();
    }
    if (localStorage.getItem("userId") != null) {
      this.viewProfile(localStorage.getItem("userId"));
    }
    this.route_url = this.router.url;
    this.navurl = window.location.pathname;
  }

  isLoggedIn(): boolean {
    this.role = localStorage.getItem("user");
    this.userData = this.userDetailService.current_user();
    // if (this.pageloadbool && this.userData) {
    //   this.viewProfile(this.userData.id);
    //   this.pageloadbool = false;
    // }
    return this.authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }

  logOut(): void {
     $(".pop3y3y3").popover("hide");
    this.authService.logOut();

    // window.location.reload();
  }

  onCloseFunction(data){
    console.log(data.open)
    this.openDelayLeadPoppup = false
  }

  onLoadBtnClick(data){
    if(data){
      this.list_delay_lead = data.list_delay_lead
      this.total_page = data.total_page
      this.moreData = data.moreData
      this.count = data.count
    }
  }
pop_check 
  openDelayLeadPoppup:any = false;
  
  addClass(e, val) {
   
    this.pop_check = window.location.href.includes('boq-view-noc')
    console.log( this.pop_check,"hjedh")

    //for delay leads popup
    if(this.role == 'designer' && val != 'NOC-Screen' && !this.pop_check){
      this.delayedLeads(this.current_page)
    }
    //for delay leads popup

    // this.parentSubject.next("true");
    e = <HTMLElement>e;
    $("#menu li").removeClass("activeMenu");
    $(e.srcElement).parent().addClass("activeMenu");

    var flag =
      $(".activeMenu")[0].lastElementChild.classList.contains(
        "submenu-container"
      );
    if (flag) {
      $(".submenu-container").removeClass("d-none");
    } else {
      $(".submenu-container").addClass("d-none");
    }
    // if($(".collapse").hasClass('show'))
    //   $(".collapse").removeClass('show');
  }

  changeSubMenuCss(e) {
    e = <HTMLElement>e;
    $(".rk-activeSubMenuLink a").removeClass("activeSubMenuLinkColor");
    // $('.rk-activeSubMenuLink').style.color = 'black';
    $(e.srcElement).addClass("activeSubMenuLinkColor");
  }
  activeSubmenu(e) {
    $(".submenu-title").removeClass("activeSubMenuLinkColor");
    $(e.srcElement).addClass("activeSubMenuLinkColor");
  }

  ActiveCheck(){
   
    if(window.location.href.includes('apartment/create') || window.location.href.includes('apartment-add') ){
      $(".portfolioID").removeClass("activeMenu");
      return true
    }  else{
      return false
    }
    
  }
  designer_typeid;
  getLeadPoolList() {
    this.csagentService.getLeadPoolList().subscribe(
      (res) => {
        for (var i = 0; i < res["lead_types"].length; i++) {
          if (res["lead_types"][i].name == "designer") {
            this.designer_typeid = res["lead_types"][i].id;
          }
        }
      },
      (err) => {}
    );
  }

  changeRouterLink(sidenavoption) {
    if (sidenavoption == "Designer") {
      this.router.navigate(["/leads"], {
        queryParams: { lead_type: "Designer", id: this.designer_typeid },
      });
    }
    if (sidenavoption == "Lead") {
      this.router.navigate(["/leads"]);
    }
  }

  profile;
  viewProfile(id) {
    this.profileService.viewProfile(id).subscribe(
      (profile) => {
        this.profile = profile;
        Object.keys(profile).map((key) => {
          this.profile = profile[key];
        });
      },
      (error) => {}
    );
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "275px";
    document.getElementById("mySideNavDiv").style.width = "100%";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySideNavDiv").style.width = "0";
  }
  changeLayout() {
    if (this.width_value == "true") {
      this.width_value = "false";
    } else if (this.width_value == "false") {
      this.width_value = "true";
    }
    if (this.width_value == "true") {
      $(".value_hid").hide();
      $(".sideNav li").css("margin", "9.6px 17px");
      $(".sideNav li").css("height", "47px");
      $(".profileImg").css("width", "6rem");
      $(".profileImg2").css("width", "6rem")
      $(".profileImg").css("width", "6rem");
      $(".profileImg2").css("width", "6rem");      
      $(".adminDiv2").css("width", "6rem");
      $(".sideNav").css("height", "88.3vh");
       $(".suabbb-menuuu").css("height", "80.3vh");
      $(".profile-img28").css("margin-left", "13px");
      $(".profile-img29").css("font-size", "0.7rem");
      $(".profile-img30").css("font-size", "10px");
      $(".side-act-mini").css("width", "6rem");
      this.sendChildValue.emit("true");
    } else {
      $(".value_hid").show();
      $(".sideNav li").css("margin", "5px 14px");
      $(".profileImg").css("width", "14rem");
       $(".profileImg2").css("margin-bottom", "4%");
      $(".profileImg2").css("width", "14rem");
      $(".side-act-mini").css("width", "14rem");
      $(".adminDiv2").css("width", "14rem");
      $(".sideNav li").removeAttr("style");
      $(".sideNav").css("height", "88.3vh");
       $(".suabbb-menuuu").css("height", "80vh");
      $(".profile-img28").css("margin-left", "10px");
      $(".profile-img29").css("font-size", "1rem");
      $(".profile-img30").css("font-size", "14px");
      this.sendChildValue.emit("false");
    }
  }
  openpopup(event, id) {
    var thisobj = this;
    if(this.width_value == 'true'){
$(event.target).popover({
  trigger: "hover",
});
$(function () {
  $(".pop3y3y3").popover({
    trigger: "hover",
  });
});
    } else{
        $(".pop3y3y3").popover("hide");
      
    }
      
  }

  list_delay_lead:any = [];
  headers_res:any;
  per_page:any = 10;
  total_page:any;
  count:any;
  current_page:any = 1;
  diff1:any;
  diff2:any;
  allLeads:any = false;
  moreData:any = false;
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
      this.per_page = 10;
      this.total_page = localStorage.getItem("total_page");
      this.moreData = localStorage.getItem("more_data");
      this.count = localStorage.getItem("count");
      this.list_delay_lead = storedLeads
      console.log("this.list_delay_lead",this.list_delay_lead)
      this.openDelayLeadPoppup = true
      // this.current_page = localStorage.getItem("current_page")
      // $("#delayLeadsModal").modal("show");
      this.loaderService.display(false);
    }
    else{
      this.leadService.delayedLeads(this.allLeads).subscribe((res) => {
        // $("#delayLeadsModal").modal("show");
        this.loaderService.display(false);
        console.log("delay lead res", res)
        // this.per_page = res.data.per_page;
        this.moreData = res.data.more_data
        this.per_page = 10;
        this.total_page = res.data.total_pages;
        this.count = res.data.count;
        // this.current_page = res.data.current_page;
        this.list_delay_lead = res.data.leads;
        if(res.data.leads.length > 0){
          this.openDelayLeadPoppup = true
        }
        localStorage.setItem("delay_list", JSON.stringify(this.list_delay_lead));
        localStorage.setItem("more_data", JSON.stringify(this.moreData));
        localStorage.setItem("trigged_at", res.data.trigged_at);
        // localStorage.setItem("per_page", this.per_page);
        localStorage.setItem("total_page", this.total_page);
        localStorage.setItem("count", this.count);
        // localStorage.setItem("current_page", this.current_page);

      },
      (error) => {
        this.loaderService.display(false);
      });
    }
  }
}