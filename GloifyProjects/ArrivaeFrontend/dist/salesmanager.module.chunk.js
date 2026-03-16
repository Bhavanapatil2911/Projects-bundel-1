webpackJsonp(["salesmanager.module"],{

/***/ "./src/app/platform/salesmanager/dashboard/dashboard.component.css":
/***/ (function(module, exports) {

module.exports = ".leadheadDashboardContainer .card {\n  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\n          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\n  -webkit-transition: 0.3s;\n  transition: 0.3s;\n  border-radius: 0px;\n  border: 1px solid #dcdcdc;\n  min-height: 350px;\n}\n\n.statusCardTextColor1 {\n  color: #444444;\n  font-size: 45px\n}\n\n.statusCardHeadingColor {\n  color: #8c031f;\n  font-size: 16px;\n  text-transform: uppercase;\n  font-weight: 900;\n}\n\n.cardHeadingIcon {\n  height: 54px;\n  width: 54px;\n}\n\n.statusCardContent {\n  color: #848484;\n  font-size: 14px;\n  font-weight: lighter\n}\n\n.form-control-change {\n  width: 60%;\n  display: inline-block;\n}\n\n.frm-chng {\n  border: 1px solid rgba(241, 237, 237, 0.15);\n  font-size: 0.8rem;\n  margin-top: -3px;\n  width: 108%;\n  cursor: pointer;\n}\n\n.frm-chng::-webkit-input-placeholder {\n  /* Chrome */\n  color: black;\n  font-size: 16px;\n  font-family: \"Roboto\";\n  font-weight: bold;\n}\n\n.frm-chng:-ms-input-placeholder {\n  /* IE 10+ */\n  color: black;\n}\n\n.frm-chng::-moz-placeholder {\n  /* Firefox 19+ */\n  color: black;\n  opacity: 1;\n}\n\n.form-control-change{\n    width: 30%;\n    display: inline-block;\n}\n\n.downloadBtn{\n    border: 1px solid #8F0020;\n    padding: 5px 10px;\n    margin-top: 4px;\n    color: #8F0020 !important;\n}\n\n.downloadBtn:hover{\n    color: #fff !important;\n    background-color: #8F0020;\n}\n\n.frm-chng:-moz-placeholder {\n  /* Firefox 4 - 18 */\n  color: black;\n  opacity: 1;\n}\n\n.fromDate, .toDate {\n  display: none;\n}\n\ninput.frm-chng::-webkit-input-placeholder {\n  font-family: fontAwesome;\n  font-size: 12px;\n  color: black;\n}\n\ninput.frm-chng::-ms-input-placeholder {\n  font-family: fontAwesome;\n  font-size: 12px;\n  color: black;\n}\n\ninput.frm-chng::placeholder {\n  font-family: fontAwesome;\n  font-size: 12px;\n  color: black;\n}\n\ninput.frm-chng {\n  font-family: \"Roboto\";\n}\n\n.nav-item.itm-chng .fromDateSpan .fa-caret-down, .nav-item.itm-chng .toDateSpan .fa-caret-down{\n  position: relative;\n  font-size: 12pt;\n  top:1px;\n}\n\n.nav-item.itm-chng .fromDate,.nav-item.itm-chng .toDate  {\n  padding: 0.3rem 0.4rem;\n  border: 1px solid rgba(90, 88, 88, 0.15);\n}\n\n.fromDate,.toDate{\n  display: none;\n}\n\n.h-145px{\n  height: 40px;\n  width: 40px;\n}"

/***/ }),

/***/ "./src/app/platform/salesmanager/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row ss-top-menu\">\n\t<div class=\"col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3\">\n\t\t<span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">Dashboard</span>\n\t</div>\n\t<div class=\"col-xl-9 col-lg-9 col-md-9 col-sm-9 col-xs-9\">\n\t\t<a class=\"addCursor float-right downloadBtn mr-2\" (click)=\"downloadPaymentReport()\">Download Payment Report</a>\n\t\t<a class=\"addCursor float-right downloadBtn mr-2\" (click)=\"downloadExcelBoq()\">Download BOQ Report</a>\n\t\t<button class=\"bt-boq btn btn-pink mr-2 p-2 pull-right\" type=\"button\" data-toggle=\"modal\" *ngIf = \"is_champion=='true'\" data-target=\"#inviteChampionModal\" (click)=\"slaesmanagerinvitechampions.getChampionList()\">Invite Level 2 & Level 3 User</button>\n</div>\n</div>\n<div class=\"row mt-5 px-3\">\n\t<div class=\"col-md-12 bg-white rounded\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<div class=\"filter-chng my-3\">\n\t\t\t\t\t<span>Filter By Referrer:</span>\n\t\t\t\t\t<select class=\"form-control form-control-change\" (change)=\"onChangeFilterData($event.target.value)\">\n\t\t\t\t\t\t<option value=\"\" disabled>Select Referrer Type</option>\n\t\t\t\t\t\t<option value=\"all\">All</option>\n\t\t\t\t\t\t<option value=\"{{ src.id }}\" *ngFor=\"let src of referreresList\">{{ src.name }}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-2 my-3 pl-0\">\n\t\t\t\t<div  class=\"nav-item itm-chng ml-1\" style=\"padding: 5px 10px; max-width: 149px;\" id=\"fromDateLi\">\n\t\t\t\t\t<span class=\"fromDateSpan addCursor\" (click)=\"fromDate()\">From Date <i class=\"fa fa-caret-down\"></i></span>\n\t\t\t\t\t<input name=\"from_date\" class=\"form-control frm-chng fromDate\" [(ngModel)]=\"from_date\" type=\"date\">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"col-md-2 my-3 pl-0\">\n\t\t\t\t<div class=\"nav-item itm-chng\" style=\"padding: 5px 10px; max-width: 149px;\" id=\"toDateLi\">\n\t\t\t\t\t<span class=\"toDateSpan addCursor\" (click)=\"toDate()\">To Date <i class=\"fa fa-caret-down\"></i></span>\n\t\t\t\t\t<input name=\"to_date\" class=\"form-control frm-chng toDate\" [(ngModel)]=\"to_date\" type=\"date\">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"col-md-2 my-3 pl-0\">\n\t\t\t\t<img src=\"assets/img/dashboard/submit.png\" class=\"ml-1 sendIcon filterRowIcon addCursor\" (click)=\"onFilterDataSubmit()\">\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t\n</div>\n\n\n<div class=\"row body_height pt-3 leadheadDashboardContainer\">\n\t<div class=\"col-lg-12 mt-2 mb-2\">\n\t\t<h5 class=\"titleText\">Leads count by Status df</h5>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2\">\n\t\t\t<div class=\"mt-3 mb-4 ml-2 mr-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/lost.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">All Leads</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t    </div>\n\t\t\t\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{'referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\">{{countres.total_leads}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"> </h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t    \t<p>Count of all the leads which have been entered into the system till date.</p>\n\t\t    </div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2\">\n\t\t\t<div class=\"mt-3 mb-4 ml-2 mr-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/lost.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">Not Attempted</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t    </div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_status:'not_attempted','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\"> {{countres.not_attempted}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t    \t<p>The count shows the leads which are new in the system, and has not been claimed by any Sales Manager.</p>\n\t\t    </div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2\">\n\t\t\t<div class=\"mt-3 mb-4 ml-2 mr-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/claim.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">Claimed</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t    </div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_status:'claimed','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\"> {{countres.claimed}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t    \t<p>The count shows the leads which are new in the system, and has not been claimed by any Sales manager.</p>\n\t\t    </div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2\">\n\t\t\t<div class=\"mt-3 mb-4 ml-2 mr-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/qualified.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">Qualified</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t    </div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_status:'qualified','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\">{{countres.qualified}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t    \t<p>The number of count shows that what number of leads are qualifiede.</p>\n\t\t    </div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2\">\n\t\t\t<div class=\"mt-3 mb-4 ml-2 mr-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/notContactable.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">Not Contactable</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t    </div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_status:'not_contactable','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\">{{countres.not_contactable}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t    \t<p>The number of count shows the data of leads that are not contactable for some reasons.</p>\n\t\t    </div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2\">\n\t\t\t<div class=\"mt-3 mb-4 ml-2 mr-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/follow_up.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">Follow Up</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t    </div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_status:'follow_up','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\"> {{countres.follow_up}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t    \t<p>The number of count shows that how many leads needed to be followed up on.</p>\n\t\t    </div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/lost.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tLost\n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t\t\t<!-- <img src=\"assets/v3/img/lost.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Lost </span> -->\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_status:'lost','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\" style=\"color: red;\"><span *ngIf=\"!loaderforcount\"> {{countres.lost}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t\n\t\t\t<div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>The number of count shows the leads which can not be further pursued.</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/lost.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tLost after 5 Tries\n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t\t\t<!-- <img src=\"assets/v3/img/lost.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Lost after 5 Tries </span> -->\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" style=\"color: red;\" [queryParams]=\"{lead_status:'lost_after_5_tries','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\"> {{countres.lost_after_5_tries}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t\n\t\t\t<div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>It indicates count of leads which were not contactable even after 5 call attempts.</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/dropped.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tDropped \n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t\t\t<!-- <img src=\"assets/v3/img/dropped.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Dropped </span> -->\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" style=\"color: red;\"  [queryParams]=\"{lead_status:'dropped','referrer_type':referrer_type_value, 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\"> {{countres.dropped}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t\t<div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>Total leads that has been dropped.</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"row justify-content-center pt-3 leadheadDashboardContainer\">\n\t<div class=\"col-sm-12 mt-2 mb-4\">\n\t\t<h5 class=\"titleText\">Leads count by Role</h5>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tCustomer \n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t\t\t<!-- <img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Customer </span> -->\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\"   [queryParams]=\"{lead_type:'customer', 'to_date': to_date, 'from_date': from_date}\" ><span *ngIf=\"!loaderforcount\">{{countres.converted_customer}}/{{countres.customer}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>The count shows that {{countres.converted_customer}} leads are converted out of {{countres.customer}} total leads</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tDesigner \n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t\t\t<!-- <img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Designer </span> -->\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_type:'designer', 'to_date': to_date, 'from_date': from_date}\"><span *ngIf=\"!loaderforcount\">{{countres.converted_designer}}/{{countres.designer}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>The count shows that {{countres.converted_designer}} leads are converted out of {{countres.designer}} total leads</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<!-- <img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Broker </span> -->\n\t\t  \t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tBroker \n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_type:'broker', 'to_date': to_date, 'from_date': from_date}\" ><span *ngIf=\"!loaderforcount\"> {{countres.converted_broker}}/{{countres.broker}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>The count shows that {{countres.converted_broker}} leads are converted out of {{countres.broker}} total leads</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-3 my-3\">\n\t\t<div class=\"card py-2 px-2 \">\n\t\t\t<div class=\"mt-3 mb-4 mx-1\">\n\t\t\t\t<!-- <img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t  \t\t<span class=\"statusCardHeadingColor ml-4\">Manufacturer </span> -->\n\t\t  \t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<img src=\"assets/v3/img/user.svg\" class=\"cardHeadingIcon\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-8 d-flex align-items-center\" style=\"word-break:break-all;\">\n\t\t  \t\t\t\t<span class=\"statusCardHeadingColor\">\n\t\t  \t\t\t\tManufacturer \n\t\t  \t\t\t\t</span>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t  \t</div>\n\t\t    <h1 class=\"card-title text-center statusCardTextColor mt-4 mb-5 addCursor\" [routerLink]=\"['/salesmanager/lead-list']\" [queryParams]=\"{lead_type:'manufacturer', 'to_date': to_date, 'from_date': from_date}\" ><span *ngIf=\"!loaderforcount\"> {{countres.converted_manufacturer}}/{{countres.manufacturer}}</span> <img *ngIf=\"loaderforcount\" class=\"h-145px\" src=\"/assets/img/loadergifcount.gif\"></h1>\n\t\t    <div class=\"ml-3 mr-2 statusCardContent\">\n\t\t\t\t<p>The count shows that {{countres.converted_manufacturer}} leads are converted out of {{countres.manufacturer}} total leads</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t\n</div>\n\n<!-- Invite Champion Modal -->\n<div class=\"modal fade customModal\" id=\"inviteChampionModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"inviteChampionModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-lg\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title modalTitle\" id=\"inviteChampionModalLabel\">User Details</h5>\n      </div>\n\n      <div class=\"modal-body\">\n        <app-invite-champions #slaesmanagerinvitechampions></app-invite-champions>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"rk-ui-notification err\" *ngIf=\"erroralert\"  style=\"z-index: 10000;\">\n\t<span id=\"notificationMessageText\">{{errorMessage}}</span>\n\t<a class=\"close rk-linknotification\" (click)=\"erroralert=false\">×</a>\n</div>\n<div class=\"rk-ui-notification\" *ngIf=\"successalert\"  style=\"z-index: 10000;\">\n\t<span id=\"notificationMessageText\">{{successMessage}}</span>\n\t<a class=\"close rk-linknotification\" (click)=\"successalert=false\">×</a>\n</div>"

/***/ }),

/***/ "./src/app/platform/salesmanager/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sales_manager_service__ = __webpack_require__("./src/app/platform/salesmanager/sales-manager.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__ = __webpack_require__("./src/app/platform/lead/lead.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(route, leadService, salesService, loaderService, formBuilder, router, location) {
        this.route = route;
        this.leadService = leadService;
        this.salesService = salesService;
        this.loaderService = loaderService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.location = location;
        this.referreresList = [];
        this.loaderforcount = true;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.user_id = localStorage.getItem('userId');
        this.getCountForSalesLead();
        this.getReferrersList();
        this.is_champion = localStorage.getItem('isChampion');
        this.inviteChampionForm = this.formBuilder.group({
            name: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required]),
            email: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required]),
            contact: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required]),
            parent_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            champion_level: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required]),
            user_type: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("arrivae_champion")
        });
    };
    DashboardComponent.prototype.getCountForSalesLead = function (referrerTypeId) {
        var _this = this;
        this.loaderService.display(true);
        this.loaderforcount = true;
        this.salesService.getCountForSalesLead(this.referrer_type_value, this.from_date, this.to_date).subscribe(function (res) {
            _this.loaderforcount = false;
            _this.loaderService.display(false);
            _this.countres = res;
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    DashboardComponent.prototype.getReferrersList = function (page, search) {
        var _this = this;
        this.salesService.getReferrersList(this.user_id, page, search).subscribe(function (res) {
            res = res.json();
            _this.referreresList = res['users'];
        }, function (err) {
        });
    };
    DashboardComponent.prototype.onChangeFilterData = function (value) {
        this.referrer_type_value = value;
    };
    DashboardComponent.prototype.onFilterDataSubmit = function () {
        this.getCountForSalesLead();
    };
    DashboardComponent.prototype.inviteChampionFormSubmit = function (data) {
        var _this = this;
        this.loaderService.display(true);
        if (data.champion_level === "3") {
            data.parent_id = $('#level2Dropdown').val();
        }
        this.leadService.inviteChampion(data).subscribe(function (res) {
            $('#inviteChampionModal').modal('hide');
            _this.loaderService.display(false);
            _this.inviteChampionForm.reset();
            // this.champion_user = "";
            _this.successalert = true;
            _this.successMessage = res.message;
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 10000);
            _this.showChildDropdown = false;
            _this.child_champion_user = [];
        }, function (err) {
            if (err.status == '403' || err.status == '422') {
                _this.erroralert = true;
                _this.errorMessage = JSON.parse(err._body).message;
                setTimeout(function () {
                    this.erroralert = false;
                }.bind(_this), 10000);
                _this.inviteChampionForm.reset();
            }
            else {
                _this.erroralert = true;
                _this.errorMessage = err.message;
                setTimeout(function () {
                    this.erroralert = false;
                }.bind(_this), 10000);
            }
            $('#inviteChampionModal').modal('hide');
            _this.loaderService.display(false);
        });
    };
    DashboardComponent.prototype.downloadExcelBoq = function () {
        var _this = this;
        this.loaderService.display(true);
        this.leadService.exportBoq().subscribe(function (res) {
            _this.loaderService.display(false);
            _this.successalert = true;
            _this.successMessage = 'The BOQ report you requested is being created. It will be emailed to you once complete.!';
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 2000);
        }, function (err) {
        });
    };
    DashboardComponent.prototype.downloadPaymentReport = function () {
        var _this = this;
        this.leadService.exportPaymentEvent().subscribe(function (res) {
            _this.successalert = true;
            _this.successMessage = 'The Payment report you requested is being created. It will be emailed to you once complete.!';
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 5000);
        }, function (err) {
        });
    };
    DashboardComponent.prototype.getChampionList = function () {
        var _this = this;
        this.showChildDropdown = false;
        this.child_champion_user = [];
        this.champion_user = [];
        this.loaderService.display(true);
        this.leadService.getChampionList().subscribe(function (res) {
            _this.champion_types = res.allowed_champion_levels;
            _this.champion_list_first_level = res["1"];
            _this.champion_list_second_level = res["2"];
            _this.champion_list_third_level = res["2"];
            _this.inviteChampionForm.controls['champion_level'].patchValue("");
            _this.inviteChampionForm.controls['parent_id'].patchValue("");
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    DashboardComponent.prototype.getChampionUserListByLevel = function () {
        var _this = this;
        this.leadService.getChampionListByChampionLevel(1).subscribe(function (res) {
            _this.champion_user = res.champions;
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    DashboardComponent.prototype.getChildChampionDetailsByLevel = function () {
        var _this = this;
        this.leadService.getChildChampionListByChampionLevel(+this.inviteChampionForm.controls['parent_id'].value).subscribe(function (res) {
            _this.child_champion_user = res.champions;
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    DashboardComponent.prototype.getChampionListByLevel = function () {
        switch (this.inviteChampionForm.controls['champion_level'].value) {
            case "1":
                this.showChildDropdown = false;
                this.champion_user = [];
                break;
            case "2":
                this.showChildDropdown = false;
                this.champion_user = this.champion_list_first_level;
                break;
            case "3":
                this.getChampionUserListByLevel();
                this.showChildDropdown = true;
                this.inviteChampionForm.controls['parent_id'].patchValue(+this.parent_id);
                break;
        }
    };
    DashboardComponent.prototype.numberCheck = function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 40
            || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
            return false;
        }
    };
    DashboardComponent.prototype.fromDate = function () {
        $(".fromDateSpan").hide();
        $(".fromDate").show();
    };
    DashboardComponent.prototype.toDate = function () {
        $(".toDateSpan").hide();
        $(".toDate").show();
    };
    DashboardComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__("./src/app/platform/salesmanager/dashboard/dashboard.component.html"),
            styles: [__webpack_require__("./src/app/platform/salesmanager/dashboard/dashboard.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_1__sales_manager_service__["a" /* SalesManagerService */], __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__["a" /* LeadService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__["a" /* LeadService */],
            __WEBPACK_IMPORTED_MODULE_1__sales_manager_service__["a" /* SalesManagerService */],
            __WEBPACK_IMPORTED_MODULE_4__services_loader_service__["a" /* LoaderService */],
            __WEBPACK_IMPORTED_MODULE_6__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_5__angular_common__["Location"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.css":
/***/ (function(module, exports) {

module.exports = ".ss-text-light\n{\n  vertical-align: -webkit-baseline-middle;\n  cursor: pointer;\n}\n.ss-text-dark{\n  vertical-align: -webkit-baseline-middle;\n}\n.table td{\n    padding: 0.7rem 0.75rem;\n    vertical-align: middle;\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.7);\n    border: none;\n}\n.minWidthForTd{\n  min-width: 185px;\n}\n.minWidthforname{\n  min-width: 10rem;\n}\n.table th {\n    padding: .9rem;\n    vertical-align: middle;\n    border: none;\n    font-size: 12px;\n    text-transform: uppercase;\n    color: #fff;\n    background-color: #5A5A5A;\n}\n.table{\n  border-collapse: separate;\n  border-spacing: 0 5px;\n}\n.tableDiv tbody{\n  background-color: #fff;\n}\n.tableDiv{\n  overflow-x:scroll;\n}\n.tableDiv tbody tr{\n  -webkit-box-shadow: 1px 1px 7px 0px #dadada;\n          box-shadow: 1px 1px 7px 0px #dadada;\n  border-radius: 5px;\n}\n.firstTh{\n  border-radius: 5px 0 0 0;\n}\n.lastTh{\n  border-radius: 0px 5px 0 0;\n}\n.custom-class-dropdown .c-btn{\n  font-size:12px;\n  font-weight: bold;\n}\n/*.selected-list[_ngcontent-c7] .c-btn[_ngcontent-c7]{\n  font-size: 10px;\n}*/\n.custom-class-dropdown .dropdown-list{\n  width: auto;\n  font-size: 12px;\n}\n.filterRow{\n  background-color: #fff;\n}\n.filterRow .col-sm-11 {\n  padding: 10px 10px;\n}\n.filterRow .col-sm-11 .row{\n  margin-left: 0px; margin-right: 0px;\n}\n.filterRow .row .col-sm-1{\n  padding: 10px 10px 0px 0px;\n   border-left: 1px solid #d3d3d3;\n}\n.sendIcon{\n  height: 25px;\n  margin-top: -3px;\n}\n.inputBorder {\n    border-color: red;\n}\n.modalTitle{\n  padding: 10px 18px;\n  position: relative;\n  bottom: -17px;\n  background: #fff;\n  color: #848484;\n  font-size: 16px;\n  font-weight: normal;\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n}\n.modal-header {\n    border-bottom: 0px solid #fff;\n    background: #f3f2f2;\n}\n.border-top{\n      border-top: 1px solid #d2cbcb;\n}\n.astric{\n  color: red;\n}\n.itm-chng{\n  min-width: 87px;\n  max-width: 104px;\n  font-size: 12px;\n}\n.fromDate,.toDate{\n  display: none;\n}\n.tabs-chng{\n  border-bottom: none;\n}\n.itm-chng{\n  min-width: 87px;\n  max-width: 104px;\n  font-size: 12px;\n}\n.filterRow{\n  -webkit-box-shadow: 0 0 10px #bbb4b4;\n          box-shadow: 0 0 10px #bbb4b4;\n  border-radius: 5px;\n  min-height: 55px;\n}\n:host ::ng-deep .selected-list .c-btn{\n  -webkit-box-shadow: 0px 0px 0px #959595 !important;\n          box-shadow: 0px 0px 0px #959595 !important;\n}\n:host ::ng-deep .c-btn{\n \n}\n:host ::ng-deep  .selected-list .fa-angle-down , .selected-list .fa-angle-up\n{\n  right: 0px !important;\n}\n:host ::ng-deep .c-btn.disabled{\n  cursor: not-allowed !important;\n  background: white !important;\n\n}\n.frm-chng{\n  border: 1px solid rgba(241, 237, 237, 0.15);\n  font-size: 0.8rem;\n  margin-top: -3px;\n  width: 108%;\n  cursor: pointer;\n}\n.frm-chng::-webkit-input-placeholder { /* Chrome */\n  color: black;\n  font-size: 16px;\n  font-family:  \"Roboto\";\n  font-weight: bold;\n}\n.frm-chng:-ms-input-placeholder { /* IE 10+ */\n  color: black;\n}\n.frm-chng::-moz-placeholder { /* Firefox 19+ */\n  color: black;\n  opacity: 1;\n}\n.frm-chng:-moz-placeholder { /* Firefox 4 - 18 */\n  color: black;\n  opacity: 1;\n}\n.fromDate,.toDate{\n  display: none;\n}\ninput.frm-chng::-webkit-input-placeholder{ \n  font-family:fontAwesome; \n  font-size:12px; \n  color: black;\n}\ninput.frm-chng::-ms-input-placeholder{ \n  font-family:fontAwesome; \n  font-size:12px; \n  color: black;\n}\ninput.frm-chng::placeholder{ \n  font-family:fontAwesome; \n  font-size:12px; \n  color: black;\n}\ninput.frm-chng{ \n  font-family:  \"Roboto\";\n}\n:host ::ng-deep .custom-class-dropdown .pure-checkbox input[type=\"checkbox\"]:checked + label:before{\n  background: #96001F!important;\n  border-color: #96001F !important;\n}\n:host ::ng-deep .custom-class-dropdown .pure-checkbox input[type=\"checkbox\"] + label:after{\n  border-color: white !important;\n}\n:host ::ng-deep  .list-filter{\n  width: 194px !important;\n}\n.ss-searchbox input {\n  margin-top: 2px;\n}\n.ss-searchbox{\n  width: 246px !important;\n}\n.ss-searchbox input {\n  padding: 0 0em !important;\n\n}\n.nav-item.itm-chng .fromDateSpan .fa-caret-down, .nav-item.itm-chng .toDateSpan .fa-caret-down{\n  position: relative;\n  font-size: 12pt;\n  top:1px;\n}\n.nav-item.itm-chng .fromDate,.nav-item.itm-chng .toDate  {\n  padding: 0.3rem 0.4rem;\n  border: 1px solid rgba(90, 88, 88, 0.15);\n}\n/* .hideAsteriskIcon{\n    display: none;\n} */\n.border-bottom {\n    border-bottom: 1px solid #cac6c7 !important;\n    padding-bottom: none; \n    display: inherit;\n}\n.filterRowIcon{\n      height: 38px;\n    position: relative;\n    left: -7px;\n    top: 3px;\n    cursor: pointer;\n}\n.boq-img{\n  text-align: center;\n}\n.lead-des{\n  min-width: 130px\n}\n.lead-aqu{\nmin-width: 130px;\nmargin-left: 8px;\n}\n.lead-des2{\n  min-width: 82px;\n  margin-left: 8px;\n}\n.lead-des3{\n  min-width: 130px;\n  margin-left: 8px;\n}\n.lead-des4{\n  min-width:130px;\n  margin-left: 8px;\n}\n.lead-desfr{\n  min-width: 130px;\n  margin-left: 8px;\n}\n.c-btn{\n\n}\n.logwidth {\n  max-width: 82% ;\n  left: 113px;\n}\n#logModal .modal-header{\n  background: #F4f4f4;\n padding-top: 0px;\n}\n#addNewLeadModal label, #questionnaireModal label, #exampleModal label,\n#logModal label{\n color: #848484;\n}\n.leadDetailsMainDiv{\n  background-color: #fff;\n  margin-top: 1.8rem;\n}\n.borderBottom{\n  border-bottom: 1px solid #f1f1f1;\n}\n.vColor{\n  color: #888;\n  font-weight: 100;\n}\n.vColor1{\n  color: #5a5a5a;\n  font-weight: 100;\n}\n.fontSize14{\n  font-size: 14px;\n}\n.dropdownButton{\n  padding: 5px 12px;\n  width: 10rem;\n  border: none;\n  font-size: 16px;\n  cursor: pointer;\n  outline: none;\n  color: #515151;\n  text-align: left;\n}\n.dropdownButton.dropdownButton1{\n  width: 14rem;\n}\n.customRow{\n  background-color: #fff;\n  height: 3.7rem;\n}\n.customRow img{\n  border-radius: 50px;\n  width: 62%;\n  margin-top: 13px;\n  -webkit-box-shadow: 0 0 0px 2px #ccc;\n          box-shadow: 0 0 0px 2px #ccc;\n}\n.vPara{\n  font-size: 18px;\n  color: #000;\n}\n.vDate{\n  font-size: 10px;\n}\n.cusDownArrow{\n  float: right;\n  margin-top: -8px;\n  font-size: 18px;\n  margin-right: 10px;\n}\n.vColor{\n  color: #888;\n  font-weight: 100;\n}\n.vColor1{\n  color: #5a5a5a;\n  font-weight: 100;\n}\n.adressSelect{\n  list-style: none;\n  padding: 0;\n  border-radius: 0 0 6px 6px;\n    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.16);\n            box-shadow: 0 2px 4px 0 rgba(0,0,0,.16);\n    border: 1px solid #dadce0;\n    position: absolute;\n    background: #fff;\n    z-index: 54;\n    max-height: 250px;\n    overflow-y: auto;\n}\n.adressSelect li{\n  color: #848484;\n  padding: 5px;\n  padding: 16px 15px;\n  border-bottom: 1px solid #848484;\n  font-size: 15px;\n  background-color: 0.3s, color 0.3s, border 0.3s;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.adressSelect li:hover{\n  color: #333;\n  background-color: #f5faff;\n  border: 1px solid #f5faff;\n}\n.ZohoMapTable th{\n  height: 52px;\n    background: rgba(141, 5, 40, 0.05);\n    font-weight: 700;\n    text-align: center;\n    font-size: 14px;\n    color: #8C031F;\n    border-left: 1px solid #ACACAC;\n}\n.ZohoMapTable td{\n  text-align: center;\n    height: 52px;\n    font-weight: 400;\n    font-size: 14px;\n    color: #515151;\n    border-left: 1px solid #ACACAC;\n}\n.ZohoMapTable tr:nth-child(even) {\n  background: #F5F5F5;\n}\n.ZohoMapTable tr:nth-child(odd) {\n  background: white;\n}\n.th1{\n  width: 8%;\n}\n.th2{\n  width: 92%;\n}\n\n\n"

/***/ }),

/***/ "./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row ss-top-menu\">\n\t<div class=\"col-xl-9 col-lg-9 col-md-9 col-sm-9 col-xs-9\">\n\t\t<span class=\"ss-text-light addCursor\" routerLink=\"/\">Dashboard <i class=\"rightArrow fa fa-angle-right\"></i></span>\n    \t<span class=\"ss-text-dark\">Lead Management <i class=\"rightArrow fa fa-angle-right\"></i></span> <span class=\"capitalize ss-text-dark\">{{ breadcrumval }}</span>\n  \t</div>\n  \t<!-- <div class=\"col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-5\">\n\n\t</div> -->\n\t<div class=\"col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3\">\n\t\t<div class=\"dropdown pull-right\">\n\t\t\t<button class=\"btn btn-pink dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\t\t\t\tAction\n\t\t\t</button>\n\t\t\t<div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\" style=\"font-size: 15px;\">\n\t\t\t\t<a *ngIf=\"false\" class=\"dropdown-item addCursor\" (click) = \"resetValues()\" data-toggle=\"modal\" data-backdrop=\"static\" data-target=\"#addNewLeadModal\">Add Lead</a>\n\t\t\t\t<a *ngIf=\"false\" class=\"dropdown-item addCursor\" (click)=\"modalexcell()\" data-toggle=\"modal\" data-target=\"#exampleModal\">Upload Excel</a>\n\t\t\t\t<a class=\"dropdown-item addCursor\" (click)=\"downloadExcel()\">Download Lead</a>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"rk-ui-notification\" *ngIf=\"successalert\">\n  <span id=\"notificationMessageText\">{{successMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"successalert=false\">×</a>\n</div>\n<div class=\"rk-ui-notification err\" *ngIf=\"erroralert\">\n  <span id=\"notificationMessageText\">{{errorMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"erroralert=false\">×</a>\n</div>\n\n<div class=\"container-set mt-4 filterRow\">\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-11\">\n\t\t\t<div class=\"row\" style=\"\">\n\t\t\t\t<ul class=\"nav nav-tabs tabs-chng ml-3 mt-1\">\n\t\t\t\t\t<li class=\"nav-item c-btn  itm-chng lead-des\">\n\t\t\t\t\t  \t<angular2-multiselect [data]=\"dropdownList\" [(ngModel)]=\"selectedItems\"\n\t\t\t\t\t    [settings]=\"dropdownSettings\"\n\t\t\t\t\t    (onSelect)=\"onItemSelect($event,'LeadType',0)\"\n\t\t\t\t\t    (onDeSelect)=\"OnItemDeSelect($event,'LeadType',0)\"\n\t\t\t\t\t    (onSelectAll)=\"onSelectAll($event,'LeadType',0)\"\n\t\t\t\t\t    (onDeSelectAll)=\"onDeSelectAll($event,'LeadType',0)\"></angular2-multiselect>\n\n\t\t\t\t\t</li>\n\t\t\t\t\t<li  class=\"nav-item c-btn itm-chng lead-des2\">\n\t\t\t\t\t  \t<angular2-multiselect [data]=\"dropdownList2\" [(ngModel)]=\"selectedItems2\"\n\t\t\t\t\t    [settings]=\"dropdownSettings2\"\n\t\t\t\t\t    (onSelect)=\"onItemSelect($event,'Status',1)\"\n\t\t\t\t\t    (onDeSelect)=\"OnItemDeSelect($event,'Status',1)\"\n\t\t\t\t\t    (onSelectAll)=\"onSelectAll($event,'Status',1)\"\n\t\t\t\t\t    (onDeSelectAll)=\"onDeSelectAll($event,'Status',1)\"></angular2-multiselect>\n\n\t\t\t\t\t</li>\n\t\t\t\t\t<li  class=\"nav-item c-btn itm-chng lead-des3\">\n\t\t\t\t\t  \t<angular2-multiselect [data]=\"dropdownList3\" [(ngModel)]=\"selectedItems3\"\n\t\t\t\t\t    [settings]=\"dropdownSettings3\"\n\t\t\t\t\t    (onSelect)=\"onItemSelect($event,'LeadSource',2)\"\n\t\t\t\t\t    (onDeSelect)=\"OnItemDeSelect($event,'LeadSource',2)\"\n\t\t\t\t\t    (onSelectAll)=\"onSelectAll($event,'LeadSource',2)\"\n\t\t\t\t\t    (onDeSelectAll)=\"onDeSelectAll($event,'LeadSource',2)\"></angular2-multiselect>\n\n\t\t\t\t\t</li>\n\t\t\t\t\t<!-- <li  class=\"nav-item itm-chng\">\n\t\t\t\t\t  \t<angular2-multiselect [data]=\"dropdownList4\" [(ngModel)]=\"selectedItems4\"\n\t\t\t\t\t    [settings]=\"dropdownSettings4\"\n\t\t\t\t\t    (onSelect)=\"onItemSelect($event,'Campaign',3)\"\n\t\t\t\t\t    (onDeSelect)=\"OnItemDeSelect($event,'Campaign',3)\"\n\t\t\t\t\t    (onSelectAll)=\"onSelectAll($event,'Campaign',3)\"\n\t\t\t\t\t    (onDeSelectAll)=\"onDeSelectAll($event,'Campaign',3)\"></angular2-multiselect>\n\n\t\t\t\t\t</li> -->\n\t\t\t\t\t<li class=\"nav-item c-btn lead-aqu\">\n\t\t\t\t\t\t<angular2-multiselect [data]=\"dropdownList6\" [(ngModel)]=\"selectedItems6\"\n\t\t\t\t\t\t    [settings]=\"dropdownSettings6\"\n\t\t\t\t\t\t    (onSelect)=\"onItemSelect($event,'DateColumn',5)\"\n\t\t\t\t\t\t    (onDeSelect)=\"OnItemDeSelect($event,'DateColumn',5)\"\n\t\t\t\t\t\t    (onSelectAll)=\"onSelectAll($event,'DateColumn',5)\"\n\t\t\t\t\t\t    (onDeSelectAll)=\"onDeSelectAll($event,'DateColumn',5)\"></angular2-multiselect>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li  class=\"nav-item itm-chng ml-1 lead-desfr\" style=\"padding: 5px 10px; max-width: 149px;display: flex;padding-top: 0px;\" id=\"fromDateLi\">\n\t\t\t\t  \t\t<span class=\"fromDateSpan addCursor\" style=\"border: 1px solid #cec6c6;border-radius: 3px;padding: 5px; height: 35px;width: 100px;;\" (click)=\"fromDate()\">From Date <i class=\"fa fa-caret-down\"></i></span>\n\t        \t\t\t<input name=\"from_date\" class=\"form-control frm-chng fromDate mt-1\" [(ngModel)]=\"from_date\" type=\"date\">\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"nav-item itm-chng lead-desfr\" style=\"padding: 5px 10px; max-width: 149px;display: flex;padding-top: 0px;\" id=\"toDateLi\">\n\t\t\t\t  \t\t<span class=\"toDateSpan addCursor\" style=\"border: 1px solid #cec6c6;border-radius: 3px;padding: 5px;height: 35px;width: 100px;\" (click)=\"toDate()\">To Date <i class=\"fa fa-caret-down\"></i></span>\n\t\t\t\t  \t\t<input name=\"to_date\" class=\"form-control frm-chng toDate mt-1\" [(ngModel)]=\"to_date\" type=\"date\">\n\t\t\t\t\t</li>\n\t\t\t\t\n\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t<li  class=\"nav-item\" >\n\t\t\t\t\t  \t<div class=\"ss-searchbox ml-2\">\n\t\t\t\t      \t\t<i class=\"fa fa-search\"></i>\n\t\t\t\t      \t\t<input class=\"form-control\" type=\"text\" placeholder=\"Type name,Lead Id,contact,status...\"  (keyup.enter)=\"onKey($event)\" [(ngModel)]=\"search\">\n\t\t\t\t    \t</div>\n\t\t\t\t\t</li>\n\t\t\t\t  \n\t\t\t\t</ul>\n\n\t\t\t\t<!-- <button (click)=\"filterData()\">Filter</button> -->\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"col-sm-1 text-center\">\n\t\t\t <img src=\"assets/img/dashboard/submit.png\" class=\"ml-1 sendIcon filterRowIcon\" (click)=\"filterData()\">\n\t\t</div>\n\t</div>\n</div>\n<div class=\"mt-4 container-set\">\n\t<div class=\"row\">\n\t    <div class=\"col-md-12\">\n\t      <div class=\"tableDiv table-responsive\">\n\t        <p class=\"text-center\" *ngIf=\"filteredLeads &&  filteredLeads.length==0 \">No Leads</p>\n\t        <div class='paginated_container' ng-controller='PaginatedUserListCtrl'>\n\t\t        <table class=\"table\" *ngIf=\"filteredLeads &&  filteredLeads.length>0\" >\n\t\t          <thead>\n\t\t            <tr>\n\t\t              <th class=\"text-center firstTh\">#</th>\n\t\t              <th>Lead ID </th>\n\t\t              <th class=\"minWidthforname\">Name  </th>\n\t\t              <th class=\"minWidthForTd\">Status</th>\n\t\t\t\t\t  <th class=\"minWidthForTd\">Project Status</th>\n\t\t              <th class=\"minWidthForTd\">Role</th>\n\t\t              <th class=\"minWidthForTd\">Contact</th>\n\t\t              <th class=\"minWidthForTd\">Source</th>\n\t\t              <th class=\"minWidthForTd\">Referrer</th>\n\t\t              <th class=\"minWidthForTd\">Referral Type</th>\n\t\t              <!-- <th class=\"minWidthForTd\">Campaign</th> -->\n\t\t              <th class=\"minWidthForTd\">Last Status Update </th>\n\t\t              <th class=\"minWidthForTd\">Acquisition Date</th>\n\t\t\t\t\t   <th class=\"minWidthForTd\">Assigned CM </th>\n\t\t\t\t\t   <th class=\"minWidthForTd\">CM Assigned Date </th>\n\t\t\t\t\t   <th class=\"minWidthForTd\">Assign CM </th>\n\t\t              <th class=\"minWidthForTd text-center\">Send To CS Agent</th>\n\n\t\t              <th class=\"minWidthForTd text-center\">Qualification Incentive Amount With Proposed</th>\n\t\t              <th class=\"minWidthForTd text-center\">50% Payment Incentive Amount With Proposed</th>\n\t\t              <th class=\"minWidthForTd text-center\">Final 50% Payment Incentive Amount With Proposed</th>\n\n\t\t              <!-- <th class=\"minWidthForTd\">Assigned CS Agent</th> -->\n\t\t              <!-- <th class=\"minWidthForTd\">Assigned CM</th> -->\n\t\t              <!-- <th *ngIf=\"lead_status==undefined || (lead_status!='lost' && lead_status!='lost_after_5_tries' && lead_status!='qualified')\" class=\"minWidthForTd\">Assign CS Agent</th> -->\n\t\t              <!-- <th class=\"minWidthForTd\">Assign CM</th> -->\n\t            <th></th>\n\t\t\t\t<th></th>\n\t\t        <th class=\"lastTh\"></th>\n\t\t              <!-- <th class=\"lastTh\"> Follow Up Date</th> -->\n\t\t            </tr>\n\t\t          </thead>\n\t\t          <tbody>\n\t\t            <tr *ngFor=\"let data of filteredLeads | paginate: { itemsPerPage: per_page, currentPage: current_page, totalItems: total_page  } let i = index; \" [attr.data-index]=\"i\" id=\"filteredLeadRow{{i}}\">\n\t\t            \t<td class=\"text-center\">{{((current_page-1) * per_page) + (i+1)}}</td>\n\t\t              \t<td>{{data.id}}</td>\n\t\t              \t<td class=\"capitalize\">\n\t\t              \t\n\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t<span class=\"addCursor\" (click)=\" passDataToModal(data.id,data.name,data.contact,data)\"  data-toggle=\"modal\" data-target=\"#questionnaireModal\" style=\"color: #007bff;\" *ngIf=\"data.name!=null\">{{data.name | underScore}}</span>\n\t\t\t\t\t\t\t<span class=\"addCursor\" (click)=\" passDataToModal(data.id,data.name,data.contact,data)\" data-toggle=\"modal\" data-target=\"#questionnaireModal\" style=\"color: #007bff;\" *ngIf=\"data.name==null || data.name==''\">Unnamed</span>\n\t\t\t\t\t\t</ng-container>\n\t\t              \t</td>\n\t\t              \t<td class=\"capitalize minWidthForTd\">{{data.lead_status | underScore}}\n\t\t              \t\t<p *ngIf=\"data.lead_status=='follow up' || data.lead_status=='follow_up'\">{{data.follow_up_time | date:'dd MMM, y , h:mm a'}}</p>\n\t\t\t\t\t\t    <p *ngIf=\"data.lead_status=='lost'\" class=\"mt-1\">(<span class=\"text-danger\">Reason</span> - {{data.lost_reason | replaceChar}})</p>\n\t\t              \t\t<p *ngIf=\"data.lead_status=='lost' && (lostReasonsArr.indexOf(data.lost_reason)>-1)\" class=\"mt-1\">(<span class=\"text-danger\">Remarks</span> - {{data.lost_remark}})</p>\n\t\t              \t\t<p *ngIf=\"data.lead_status=='lost' && data.lost_reason=='others'\" class=\"mt-1\">(<span class=\"text-danger\">Remarks</span> - {{data.lost_remark}})</p>\n\t\t              \t\t<p *ngIf=\"data.lead_status=='follow up' || data.lead_status=='follow_up'\" class=\"mt-1\">(<span class=\"text-danger\">Remarks</span> - {{data.remark}})</p>\n\t\t              \t</td>\n\t\t\t\t\t\t  <td class=\"capitalize minWidthForTd\">{{data.project_status | replaceChar}}<span *ngIf=\"data.project_sub_status\"> - </span>{{data.project_sub_status == '40%_payment_recieved'?'40% Payment Received':(data.project_sub_status | replaceChar)  }}  </td>\n\t\t\t\t\t\t  <td class=\"capitalize minWidthForTd\">{{data.lead_type}}</td>\n\t\t              \n\t\t              \t<td class=\"minWidthForTd\">{{data.contact}}</td>\n\t\t              \t<td class=\"minWidthForTd capitalize\">{{data.lead_source | underScore }}</td>\n\t\t              \t<td class=\"minWidthForTd capitalize\" >{{data.referrer.name }}</td>\n\t\t              \t<td class=\"minWidthForTd capitalize\" >{{data.referrer_type | replaceChar }}</td>\n\t\t              \t<!-- <td class=\"minWidthForTd capitalize\">{{data.lead_campaign }}</td> -->\n\t\t             \t<td class=\"minWidthForTd\">{{data.status_updated_at | date:'dd MMM, y , h:mm a'}}</td>\n\t\t             \t<td class=\"minWidthForTd\">{{data.created_at | date:'dd MMM, y , h:mm a'}}</td>\n\t\t\t\t\t\t <td class=\"minWidthForTd\">{{data.assigned_cm}}</td>\n\t\t\t\t\t\t <td class=\"minWidthForTd\">{{data.cm_assigned_date?(data.cm_assigned_date | date:'dd MMM, y , h:mm a'):'' }}</td>\n\t\t\t\t\t\t <td class=\"minWidthForTd\">\n\t\t\t\t\t <ng-container *ngIf=\"data.lead_type=='customer' && data.lead_status=='qualified'\">\n\t\t\t\t\t<select class=\"form-control\" style=\"width: 77%; display: inline-block;font-size: 14px;\" (change)=\"onCMDropdownChange(data.id,$event.target.value,i)\" id=\"assigncmdropdown{{data.id}}\">\n\t\t\t\t\t\t  <option value=\"\">Assign CM</option>\n\t\t\t\t\t\t  <option *ngFor=\"let cm of cmlistArr\" value=\"{{cm.id}}\">{{cm.name}} - {{cm.email}}</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<img src=\"assets/v3/img/sendbutton1.svg\" class=\"ml-1 sendIcon addCursor\" (click)=\"assignCmToLead(data.id,i)\">\n\t\t\t\t\t</ng-container>\n\t\t\t\t\n\t\t\t\t</td>\n\t\t             \t<td class=\"minWidthForTd text-center\">{{data.send_to_cs_agent ? 'Yes' : 'No'}}</td>\n\t\t             \t<!-- <td class=\"minWidthForTd\"><p *ngIf=\"data.agent==null\">Not Assigned</p><p *ngIf=\"data.agent!=null\">{{data.agent.uid}}</p></td>\n\t\t             \t<td class=\"minWidthForTd\"><p *ngIf=\"data.assigned_cm==null\">Not Assigned</p><p *ngIf=\"data.assigned_cm!=null\">{{data.assigned_cm}}</p></td> -->\n\t\t              \t<!-- <td id=\"lastTdEditForm\" class=\"minWidthForTd\" *ngIf=\"lead_status==undefined || (lead_status!='lost' && lead_status!='lost_after_5_tries' && lead_status!='qualified')\">\n\t\t              \t\t<ng-container *ngIf=\"data.lead_status==undefined || (data.lead_status!='lost' && data.lead_status!='lost_after_5_tries' && data.lead_status!='qualified')\">\n\t\t\t               \t\t<select class=\"form-control\" style=\"width: 77%; display: inline-block;font-size: 14px;\" (change)=\"onDropdownChange(data.id,$event.target.value,i)\" id=\"assigndropdown{{data.id}}\">\n\t\t                    \t\t<option value=\"\">Assign CS Agent</option>\n\t\t                    \t\t<option *ngFor=\"let agent of csagentsArr\" value=\"{{agent.id}}\">{{agent.name}} - {{agent.email}}</option>\n\t\t                  \t\t</select>\n\t\t                  \t\t<img src=\"assets/v3/img/sendbutton1.svg\" class=\"ml-1 sendIcon addCursor\" (click)=\"assignLeadToAgent(data.id,i)\">\n\t                  \t\t</ng-container>\n\t\t              \t</td> -->\n\t\t              \t<!-- <td>\n\t\t              \t\t<ng-container *ngIf=\"data.lead_type=='customer' && data.lead_status=='qualified'\">\n\t\t              \t\t\t<select class=\"form-control\" style=\"width: 77%; display: inline-block;font-size: 14px;\" (change)=\"onCMDropdownChange(data.id,$event.target.value,i)\" id=\"assigncmdropdown{{data.id}}\">\n                    \t\t\t<option value=\"\">Assign CM</option>\n                    \t\t\t<option *ngFor=\"let cm of cmlistArr\" value=\"{{cm.id}}\">{{cm.name}} - {{cm.email}}</option>\n                  \t\t\t</select>\n                  \t\t\t<img src=\"assets/v3/img/sendbutton1.svg\" class=\"ml-1 sendIcon addCursor\" (click)=\"assignCmToLead(data.id,i)\">\n                  \t\t</ng-container>\n\t\t              \t</td> -->\n\t\t              \t<!-- <td><a class=\"addCursor ss-link\" data-target=\"#logModal\" data-toggle=\"modal\" (click)=\"viewLeadLog(data.id,i)\"><img src=\"assets/v3/img/LogIcon.svg\"></a></td> -->\n\n\t\t\t\t\t\t  <!-- <p>{{singlePDFData.closure_value ? (singlePDFData.closure_value | formatCurPipe ) : '---'}}</p> -->\n\n\t\t\t\t\t\t  <td class=\"text-center\">{{ data.qualification_incentive_amount_with_proposed ? (data.qualification_incentive_amount_with_proposed | formatCurPipe )  : '&#8377;0'  }}</td>\n\t\t\t\t\t\t  <td class=\"text-center\" >{{data.first_payment_incentive_amount_with_proposed  ? (data.first_payment_incentive_amount_with_proposed | formatCurPipe  ) : '&#8377;0' }}</td>\n\t\t\t\t\t\t  <td class=\"text-center\">{{data.final_payment_incentive_amount_with_proposed ? (data.final_payment_incentive_amount_with_proposed | formatCurPipe ) : '&#8377;0' }}</td>\n\n\t\t\t\t\t\t  <td><a class=\"addCursor ss-link\" data-target=\"#logModal\" data-toggle=\"modal\" (click)=\"viewLeadLog(data.id,i)\"><img src=\"assets/v3/img/LogIcon.svg\"></a></td>\n\t\t              \t<td>\n\n\t\t              \t<td>\n\t\t              \t\t<i class=\"ion-android-more-vertical ss-3-dot-drop\" data-toggle=\"dropdown\" href=\"#\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\"></i>\n\t\t              \t\t<div class=\"dropdown-menu pt-2 pb-2\"  style=\"font-size: 14px;\">\n\t\t\t\t              <a class=\"dropdown-item\" href=\"#\" *ngIf=\"role && role=='designer'\" (click)=\"callToLead(lead.contact)\">\n\t\t\t\t                <i class=\"ion-ios-telephone\"></i>\n\t\t\t\t                Call Lead\n\t\t\t\t              </a>\n\t\t\t\t              <a class=\"dropdown-item addCursor\" *ngIf=\"data.lead_status != 'qualified'\" data-backdrop=\"static\" data-toggle=\"modal\" data-target=\"#editLeadModal\" (click)=\"setUpdatedLead(data)\">\n\t\t\t\t                <i class=\"ion-edit\"></i>\n\t\t\t\t                Edit\n\t\t\t\t              </a>\n\t\t\t\t              <a class=\"dropdown-item addCursor\" (click)=\"deleteLead(data.id)\" *ngIf=\"data.lead_status != 'qualified' && role2 !='sales_manager' && role2 !='area_sales_manager'\">\n\t\t\t\t                <i class=\"ion-ios-trash\"></i>\n\t\t\t\t                Delete\n\t\t\t\t              </a>\n\t\t\t\t\t\t\t  <a class=\"dropdown-item addCursor\" (click) = \"openPDFMpdal(data)\" data-toggle=\"modal\" data-target=\"additionalAppDetails\" >\n\t\t\t\t                View PDF\n\t\t\t\t              </a>\n\t\t\t\t            </div>\n\t\t              \t</td>\n\t\t            </tr>\n\t\t          </tbody>\n\t\t        </table>\n\t\t        <div class=\"text-center\" *ngIf=\"filteredLeads && filteredLeads.length >0\">\n\t\t         <pagination-controls autoHide=\"true\" (pageChange)=\"current_page = getFiletredLeadsForSales($event)\"></pagination-controls>\n\t\t        </div>\n\t\t      </div>\n\t      </div>\n\t    </div>\n\t    <div class=\"col-md-12 not-found \" *ngIf=\"filteredLeads && filteredLeads.length== 0\">\n\t        <div class=\"boq-img\">\n\t          <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n\t        </div>\n\t        <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p> \n\t    </div>\n\t</div>\n</div>\n\n<div class=\"modal fade\" id=\"exampleModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-lg\" role=\"document\">\n    <form (ngSubmit)=\"submitExcelUpload(); uploadExcelForm.reset()\" #uploadExcelForm=\"ngForm\" class=\"form-horizontal\" enctype=\"multipart/form-data\">\n\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title modalTitle\" id=\"exampleModalLabel\">Upload Lead Excel</h5>\n      </div>\n      <div class=\"modal-body\">\n        <div class=\"row\">\n        \t<div class=\"form-group col-sm-12\">\n            \t<a href=\"../../../../assets/img/salesLeadsample.xlsx\" class=\"addCursor pull-right\" download style=\"text-decoration: none;\">Download sample excel file</a>\n            </div>\n            <div class=\"form-group col-sm-12 mt-2\">\n              <!-- <label class=\"text-left\">Upload Lead Excel*</label> -->\n              <input #attachmentFileInput class=\"form-control\" type=\"file\" (change)=\"onChange($event)\" name=\"attachment_file\" ngModel #attachment_file=\"ngModel\">\n            </div>\n            <p id=\"extErrorMsg\" class=\"text-danger d-none col-sm-10\">Check File extension (File should be in xls or xlsx format).</p>\n            <p class=\"col-sm-10 lableSize\">Note* - only .xlsx or .xls files are allowed.  </p>\n            <div class=\"form-group col-sm-6 mt-2\">\n               <label class=\"text-left\">Select Lead Source <span>*</span></label>\n               <select class=\"form-control\" name=\"sourceOfBulkLeads\" [(ngModel)]=\"sourceOfBulkLeads\">\n\t\t\t\t\t<option value=\"\" disabled>Select Lead Source</option>\n\t\t\t\t\t<option *ngFor=\" let src of lead_sources\" value=\"{{src.id}}\" class=\"capitalize\">{{src.name | underScore | titlecase}}</option>\n              \t</select>\n\t\t\t</div>\n\n\t\t\t<div class=\"col-sm-6\" *ngIf=\"role2 == 'area_sales_manager'\"  >\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"text-left\">Sales Manager<span class=\"astric\">*</span></label>\n\t\t\t\t  <select  class=\"form-control capitalize\" name=\"salesmanagerId\" [(ngModel)]=\"salesmanagerId\" >\n\t\t\t\t\t<option value=\"\" disabled>Select</option>\n\t\t\t\t\t<option class=\"capitalize\" value=\"{{sm.id}}\" *ngFor=\"let sm of list_salesManager?.sales_managers\">{{sm.name | replaceChar   }}</option>\n\t\t\t\t  </select>\t\t\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"col-sm-10 col-md-6\">\n              <div class=\"form-group\">\n                <label class=\"text-left\">Referrer User Type <span class=\"astric\">*</span></label>\n                <select  class=\"form-control capitalize\" name=\"referrer_type\" [(ngModel)]=\"referrer_type\" (change)=\"onChangeOfLeadSource($event.target.value)\">\n                  <option value=\"\" disabled>Select</option>\n                  <option class=\"capitalize\" value=\"{{src.name}}\" *ngFor=\"let src of lead_referrer_list\">{{src.name | underScore   }}</option>\n                </select>\n              </div>\n            </div>\n\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"['display_dealer_referral','non_display_dealer_referral','client_referral','design_partner_referral','broker','employee_referral','dealer','arrivae_champion','others','associate_partner'].includes(addLeadForm.controls['lead_source_type'].value) == true \">\n              <div class=\"form-group\">\n                <label class=\"text-left\">Select User</label>\n                <select  class=\"form-control capitalize\" [(ngModel)]=\"referrer_id\" name=\"referrer_id\">\n                  <option value=\"\" disabled>Select</option>\n                  <option class=\"capitalize\" value=\"{{camp.id}}\" *ngFor=\"let camp of userList\">{{camp.name }} - {{ camp.email}}</option>\n                </select>\n              </div>\n            </div>\n\t\t\t\n\t\t\t<div class=\"form-group col-sm-6 mt-2\">\n              <label class=\"text-left\">Select Lead Type <span>*</span></label>\n              <select class=\"form-control\" name=\"typeOfBulkLeads\" [(ngModel)]=\"typeOfBulkLeads\">\n\t\t\t\t<option value=\"\" disabled>Select Lead Type</option>\n\t\t\t\t<ng-container *ngFor=\" let type of lead_types\">\n\t\t\t\t\t<option *ngIf=\"type.name == 'customer'\" class=\"capitalize\" value=\"{{type.id}}\">{{type.name | titlecase}}</option>\n\t\t\t\t</ng-container>\n\t\t\t\t\n              </select>\n            </div>\n            <!-- <div class=\"form-group col-sm-6 mt-2\">\n              <label class=\"text-left\">Select Lead Campaign </label>\n              <select class=\"form-control\" name=\"campignOfBulkLeads\" [(ngModel)]=\"campignOfBulkLeads\">\n\t\t\t\t<option value=\"\" disabled>Select Lead Campaign</option>\n\t\t\t\t<option *ngFor=\" let camp of lead_campaigns\" value=\"{{camp.id}}\">{{camp.name}}</option>\n              </select>\n            </div> -->\n            <hr class=\"my-3\">\n            <div class=\"text-right col-sm-12\">\n              <button type=\"submit\" class=\"rk-interalBtnColor addCursor\" [disabled]=\"basefile == undefined || salesmanagerId== '' || typeOfBulkLeads == ''  \">Upload</button>\n              <button class=\"ml-2 cancel addCursor\" data-dismiss=\"modal\">Cancel</button>\n            </div>\n        </div>\n      </div>\n    </div>\n    </form>\n  </div>\n</div>\n\n\n\n<div class=\"modal fade customModal\" id=\"addNewLeadModal\" style=\"overflow: auto;\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addNewLeadModalLabel\" aria-hidden=\"true\">\n\t<div class=\"modal-dialog modal-lg\" role=\"document\">\n\t\t<form (ngSubmit)=\"addLeadFormSubmit(addLeadForm.value); \" [formGroup]=\"addLeadForm\" class=\"form-horizontal\" enctype=\"multipart/form-data\" id=\"addLeadForm\">\n        \t<div class=\"modal-content\">\n\t\t        <div class=\"modal-header\">\n\t\t          <h5 class=\"modal-title modalTitle\" id=\"exampleModalLabel\"> Lead Details</h5>\n\t\t        </div>\n\t\t        <div class=\"modal-body\">\n\t\t          <div class=\"row mx-2\">\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Name<span class=\"text-danger\">*</span></label>\n\t\t                <input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Enter Lead Name\" formControlName=\"name\">\n\t\t              </div>\n\t\t            </div>\n\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"this.role2=='area_sales_manager' || this.role2=='sales_manager'\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t  <label class=\"text-left\">Lead Email</label>\n\t\t\t\t\t\t  <input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"Enter Lead Email\" formControlName=\"email\">\n\t\t\t\t\t\t  <div *ngIf=\"addLeadForm.controls['email'].errors && !addLeadForm.controls['email'].pristine\" class=\"text-danger\">\n\t\t\t\t\t\t\t<div [hidden]=\"addLeadForm.controls['email'].valid || addLeadForm.controls['email'].errors.required\">Enter valid email.</div>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t  </div> \n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"(this.role2 != 'area_sales_manager' && this.role2 !='sales_manager')\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Lead Email<span class=\"text-danger\">*</span></label>\n\t\t                <input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"Enter Lead Email\" formControlName=\"email\">\n\t\t                <div *ngIf=\"addLeadForm.controls['email'].errors && !addLeadForm.controls['email'].pristine\" class=\"text-danger\">\n\t\t                  <div [hidden]=\"addLeadForm.controls['email'].valid || addLeadForm.controls['email'].errors.required\">Enter valid email.</div>\n\t\t                </div>\n\t\t              </div>\n\t\t            </div>\n\t\t\t\t\t\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Lead Contact <span class=\"astric\">*</span></label>\n\t\t                <input type=\"number\" class=\"form-control\" name=\"contact\" placeholder=\"Enter Lead Contact\" formControlName=\"contact\" required min=\"0\" (keydown)=\"numberCheck($event)\">\n\t\t                <div *ngIf=\"addLeadForm.controls['contact'].errors && !addLeadForm.controls['contact'].pristine\" class=\"text-danger\">\n\t\t                  <div [hidden]=\"!addLeadForm.controls['contact'].errors.required\">Contact is required.</div>\n\t\t                </div>\n\t\t              </div>\n\t\t            </div>\n\n\n\t\t\t\t\t<!-- city -->\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\t<!-- Society -->\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<label class=\"customLabel\">Society Name/Building<span class=\"text-danger\">*</span></label>\n\t\t\t\t\t\t<div class=\"form-check\" (mouseleave)=\"hideOptions()\" (mouseenter)=\"showOptions()\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" formControlName=\"society\" placeholder=\"Type to search...\" (keyup)=\"searchSocietyApi($event)\">\n\t\t\t\t\t\t\t<ul  class=\"adressSelect\" *ngIf=\"addLeadForm.controls['society'].value  !=''&& addLeadForm.controls['society'].value && isApifired\" >\n\t\t\t\t\t\t\t  <li *ngFor=\"let option of filteredOptions \" (click)=\"selectOption(option)\"><span class=\"d-inline-block h-100\"><i class=\"fa fa-map-marker pr-1\" aria-hidden=\"true\" style=\"\n\t\t\t\t\t\t\t\tfont-size: 22px;vertical-align: middle; \"></i></span> <span class=\"d-inline-block ml-1\">{{ option.apartment_name }} {{ option.address }}</span>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li *ngIf=\"!isSelected\"  >\n\t\t\t\t\t\t\t\t  <span class=\"d-inline-block h-100\">\n\t\t\t\t\t\t\t\t  <i class=\"fa fa-map-marker pr-1\" aria-hidden=\"true\" style=\"\n\t\t\t\t\t\t\t\tfont-size: 22px;vertical-align: middle; \"></i></span> <span class=\"d-inline-block ml-1\"> Could not find your property?\n\t\t\t\t\t\t\t\t <button class=\"btn-pink px-3 py-2 mt-2\" style=\"border-radius: 20px;border: solid;\" (click)=\"selectOption('other')\"> Add Property Details</button></span>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t  \n\t\t\t\t\t\t  <div class=\"form-check d-none\" >\n\t\t\t\t\t\t\t<input type=\"text\" formControlName=\"new_society_value\"  class=\"form-control mt-3\"\n\t\t\t\t\t\t\t  placeholder=\"Enter the society name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<label class=\"customLabel\">City Name</label>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class=\"form-check\">\n\t\t\t\t\t\t\t<input type=\"text\" readonly  formControlName=\"city\" class=\"form-control \"\n\t\t\t\t\t\t\tplaceholder=\"Enter the City name\">\n\t\t\t  \n\t\t\t\t\t\t  <div class=\"form-check d-none\" >\n\t\t\t\t\t\t\t<input type=\"text\" id=\"citybuilding\" formControlName=\"new_city_value\" class=\"form-control mt-3\"\n\t\t\t\t\t\t\t  placeholder=\"Enter the City name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n \n\t\t\t\n\t\t\t\t\t  <!-- location -->\n\t\t\t\t\t  <div class=\"col-sm-6\">\n\t\t\t\t\t\t<label class=\"customLabel\">Locality</label>\n\t\t\t\t\t\t<div class=\"form-check\">\n\t\t\t  \n\t\t\t\t\t\t\t<input type=\"text\" readonly formControlName=\"location\" class=\"form-control \"\n\t\t\t\t\t\t\tplaceholder=\"Enter the locality name\">\n\t\t\t  \n\t\t\t\t\t\t  <div class=\"form-check d-none\" >\n\t\t\t\t\t\t\t<input type=\"text\" formControlName=\"new_locality_value\" class=\"form-control mt-3\"\n\t\t\t\t\t\t\t  placeholder=\"Enter the locality name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t  </div>\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Pincode</label>\n\t\t                <input type=\"number\" class=\"form-control\" name=\"pincode\" placeholder=\"Enter Lead Pincode\" formControlName=\"pincode\" min=\"0\" (keydown)=\"numberCheck($event)\">\n\t\t              </div>\n\t\t            </div>\n\n\t\t    \n\n\t\t            <div class=\"col-sm-10 col-md-6\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Select Lead Source <span class=\"astric\">*</span></label>\n\t\t                <select formControlName=\"lead_source_id\" class=\"form-control capitalize\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{src.id}}\" *ngFor=\"let src of lead_sources\">{{src.name | underScore }}</option>\n\t\t\t\t\t\t\t\n\t\t                </select> \n\t\t              </div>\n\t\t            </div>\n\t\t     \n\n\t\t\t\t\t<div class=\"col-sm-6\" *ngIf = \"role2 == 'area_sales_manager'\">\n\t\t\t\t\t\t<label class=\"customLabel\">Sales Manager</label>\n\t\t\t\t\t\t<div class=\"form-check\">\n\t\t\t\t\t\t  <ng-select formControlName=\"sales_manager_id\" class=\"filterSelect dissplay-chng1\" placeholder = \"Select Sales Manager\" >\n\t\t\t\t\t\t\t\t<ng-container *ngFor=\"let sales of list_salesManager?.sales_managers\">\n\t\t\t\t\t\t\t<ng-option  [value]=\"sales.id\">{{sales.name | replaceChar}}</ng-option>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t  </ng-select>\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-10 col-md-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t  <label class=\"text-left\">Referrer User Type</label>\n\t\t\t\t\t\t  <select formControlName=\"referrer_type\" class=\"form-control capitalize\" (change)=\"onChangeOfLeadSource($event.target.value)\">\n\t\t\t\t\t\t\t<option value=\"\" disabled>Select</option>\n\t\t\t\t\t\t\t<option value=\"{{src.name}}\" *ngFor=\"let src of lead_referrer_list\">{{src.name | underScore }}</option>\n\t\t\t\t\t\t  </select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t  </div>\n\n\n\t\t           <!--  <div class=\"col-sm-10 col-md-6\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Select Lead Campaign </label>\n\t\t                <select formControlName=\"lead_campaign_id\" class=\"form-control capitalize\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{camp.id}}\" *ngFor=\"let camp of lead_campaigns\">{{camp.name }}</option>\n\t\t                </select>\n\t\t              </div>\n\t\t            </div> -->\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"['display_dealer_referral','non_display_dealer_referral','client_referral','design_partner_referral','broker','employee_referral','dealer','arrivae_champion','others','associate_partner'].includes(addLeadForm.controls['lead_source_type'].value) == true \">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Referrer User</label>\n\t\t                <select formControlName=\"referrer_id\" class=\"form-control capitalize\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{camp.id}}\" *ngFor=\"let camp of userList\">{{camp.name }} - {{ camp.email}}</option>\n\t\t                </select>\n\t\t              </div>\n\t\t            </div>\n\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"addLeadForm.controls['lead_type_name'].value=='designer'\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Instagram Id</label>\n\t\t                <input type=\"text\" class=\"form-control\" name=\"instagram_handle\" placeholder=\"Enter Instagram Id\" formControlName=\"instagram_handle\">\n\t\t              </div>\n\t\t            </div>\n\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"addLeadForm.controls['lead_type_name'].value =='designer'\">\n\t\t            \t<div class=\"form-group\">\n\t\t                <label class=\"text-left\">Upload CV</label>\n\t\t                <input type=\"file\" name=\"\" class=\"form-control\" (change)=\"uploadCV($event)\" name=\"attachment_file\">\n\t\t              </div>\n\t\t            </div>\n\n\t\t\t\t\t<div  class=\"col-sm-10 col-md-12 form-group\" style=\"text-align:left\">\n\t\t\t\t\t\t<label class=\"customLabel mr-2\">Send To CS Agent</label>\n\t\t\t\t\t\t\t <label class=\"form-check-label lableSize labelColor mb-2 mr-4\">\n\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" [value]=\"true\" formControlName=\"send_to_cs_agent\">\n\t\t\t\t\t\t   Yes\n\t\t\t\t\t\t  </label>\n\t\t\t\t\t\t   <label class=\"form-check-label lableSize labelColor mb-2 mr-4\">\n\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" [value]=\"false\" formControlName=\"send_to_cs_agent\">\n\t\t\t\t\t\t   No\n\t\t\t\t\t\t  </label>\n\t\t\t\t\t</div>\n\n\t\t            <div class=\"col-sm-12 mt-3 text-right  border-top\">\n\t\t              <div class=\"mt-3\">\n\t\t              <button type=\"submit\" [disabled]=\"!addLeadForm.valid\" class=\"rk-interalBtnColor addCursor\">Add</button>\n\t\t              <button class=\"cancle ml-3 addCursor rk-btnCancel\"  data-dismiss=\"modal\">Cancel</button>\n\t\t              </div>\n\t\t            </div>\n\t\t          </div>\n\t\t        </div>\n      \t\t</div>\n    \t</form>\n\t</div>\n</div>\n<div class=\"modal fade\" id=\"editLeadModal\" tabindex=\"-1\" style=\"overflow: auto;\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n\t<div class=\"modal-dialog modal-lg\" role=\"document\">\n\t\t<form (ngSubmit)=\"updateLeadFormSubmit(updateLeadForm.value); \" [formGroup]=\"updateLeadForm\" class=\"form-horizontal\" enctype=\"multipart/form-data\" id=\"addLeadForm\">\n\t\t\t<!-- {{this.updateLeadForm.value | json}} -->\n        \t<div class=\"modal-content\">\n\t\t        <div class=\"modal-header\">\n\t\t          <h5 class=\"modal-title modalTitle\" id=\"exampleModalLabel\"> Lead Details</h5>\n\t\t        </div>\n\t\t        <div class=\"modal-body\">\n\t\t          <div class=\"row mx-2\">\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Name<span class=\"text-danger\" >*</span></label>\n\t\t                <input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Enter Lead Name\" formControlName=\"name\" required>\n\t\t                <div *ngIf=\"updateLeadForm.controls['name'].errors && !updateLeadForm.controls['name'].pristine\" class=\"text-danger\">\n\t\t                  <div [hidden]=\"!updateLeadForm.controls['name'].errors.required\">Name is required.</div>\n\t\t                </div>\n\t\t              </div>\n\t\t            </div>\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Lead Email</label>\n\t\t                <input type=\"text\" class=\"form-control\" name=\"email\" placeholder=\"Enter Lead Email\" formControlName=\"email\">\n\n\t\t\t\t\t\t<div class=\"text-danger\" *ngIf=\"updateLeadForm.controls.email?.errors?.required || updateLeadForm.controls.email?.errors?.email\">Enter valid email.</div>\n\t\t              </div>\n\t\t            </div>\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Lead Contact<span class=\"text-danger\" >*</span></label>\n\t\t                <input type=\"number\" class=\"form-control\" name=\"contact\" placeholder=\"Enter Lead Contact\" formControlName=\"contact\" required min=\"0\" (keydown)=\"numberCheck($event)\">\n\t\t                <div *ngIf=\"updateLeadForm.controls['contact'].errors && !updateLeadForm.controls['contact'].pristine\" class=\"text-danger\">\n\t\t                  <div [hidden]=\"!updateLeadForm.controls['contact'].errors.required\">Contact is required.</div>\n\t\t                </div>\n\t\t              </div>\n\t\t            </div>\n\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<label class=\"customLabel\">Society Name/Building<span class=\"text-danger\">*</span></label>\n\t\t\t\t\t\t<div class=\"form-check\" (mouseleave)=\"hideOptions()\" (mouseenter)=\"showOptions()\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" formControlName=\"society\" placeholder=\"Type to search...\" (keyup)=\"searchSocietyApi($event)\">\n\t\t\t\t\t\t\t<ul  class=\"adressSelect\" *ngIf=\"updateLeadForm.controls['society'].value  !=''&& updateLeadForm.controls['society'].value && isApifired\" >\n\t\t\t\t\t\t\t  <li *ngFor=\"let option of filteredOptions \" (click)=\"selectOption(option)\"><span class=\"d-inline-block h-100\"><i class=\"fa fa-map-marker pr-1\" aria-hidden=\"true\" style=\"\n\t\t\t\t\t\t\t\tfont-size: 22px;vertical-align: middle; \"></i></span> <span class=\"d-inline-block ml-1\">{{ option.apartment_name }} {{ option.address }}</span>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li *ngIf=\"!isSelected\"  >\n\t\t\t\t\t\t\t\t  <span class=\"d-inline-block h-100\">\n\t\t\t\t\t\t\t\t  <i class=\"fa fa-map-marker pr-1\" aria-hidden=\"true\" style=\"\n\t\t\t\t\t\t\t\tfont-size: 22px;vertical-align: middle; \"></i></span> <span class=\"d-inline-block ml-1\"> Could not find your property?\n\t\t\t\t\t\t\t\t <button class=\"btn-pink px-3 py-2 mt-2\" style=\"border-radius: 20px;border: solid;\" (click)=\"selectOption('other')\"> Add Property Details</button></span>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t  \n\t\t\t\t\t\t  <div class=\"form-check d-none\" >\n\t\t\t\t\t\t\t<input type=\"text\" formControlName=\"new_society_value\"  class=\"form-control mt-3\"\n\t\t\t\t\t\t\t  placeholder=\"Enter the society name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<label class=\"customLabel\">City Name</label>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class=\"form-check\">\n\t\t\t\t\t\t\t<input type=\"text\" readonly  formControlName=\"city\" class=\"form-control \"\n\t\t\t\t\t\t\tplaceholder=\"Enter the City name\">\n\t\t\t  \n\t\t\t\t\t\t  <div class=\"form-check d-none\" >\n\t\t\t\t\t\t\t<input type=\"text\" id=\"citybuilding\" formControlName=\"new_city_value\" class=\"form-control mt-3\"\n\t\t\t\t\t\t\t  placeholder=\"Enter the City name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n \n\t\t\t\n\t\t\t\t\t  <!-- location -->\n\t\t\t\t\t  <div class=\"col-sm-6\">\n\t\t\t\t\t\t<label class=\"customLabel\">Locality</label>\n\t\t\t\t\t\t<div class=\"form-check\">\n\t\t\t  \n\t\t\t\t\t\t\t<input type=\"text\" readonly formControlName=\"location\" class=\"form-control \"\n\t\t\t\t\t\t\tplaceholder=\"Enter the locality name\">\n\t\t\t  \n\t\t\t\t\t\t  <div class=\"form-check d-none\" >\n\t\t\t\t\t\t\t<input type=\"text\" formControlName=\"new_locality_value\" class=\"form-control mt-3\"\n\t\t\t\t\t\t\t  placeholder=\"Enter the locality name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t\n\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Pincode</label>\n\t\t                <input type=\"number\" class=\"form-control\" name=\"pincode\" placeholder=\"Enter Lead Pincode\" formControlName=\"pincode\" min=\"0\" (keydown)=\"numberCheck($event)\">\n\t\t              </div>\n\t\t            </div>\n\n\t\t\n\t\t            <div class=\"col-sm-10 col-md-6\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Select Lead Source <span class=\"astric\">*</span></label>\n\t\t                <select formControlName=\"lead_source_id\" class=\"form-control capitalize\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{src.id}}\" *ngFor=\"let src of lead_sources\">{{src.name | underScore }}</option>\n\t\t\t\t\t\t\t\n\t\t                </select>\n\t\t              </div>\n\t\t            </div>\n\t\t\t\t\t<div class=\"col-sm-6\" *ngIf = \"role2 == 'area_sales_manager'\">\n\t\t\t\t\t\t<label class=\"customLabel\">Sales Manager</label>\n\t\t\t\t\t\t<div class=\"form-check\">\n\t\t\t\t\t\t  <ng-select formControlName=\"sales_manager_id\" class=\"filterSelect dissplay-chng1\" placeholder = \"Select Sales Manager\" >\n\t\t\t\t\t\t\t\t<ng-container *ngFor=\"let sales of list_salesManager?.sales_managers\">\n\t\t\t\t\t\t\t<ng-option  [value]=\"sales.id\">{{sales.name | replaceChar}}</ng-option>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t  </ng-select>\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t            <div class=\"col-sm-10 col-md-6\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Referrer User Type</label>\n\t\t                <select formControlName=\"referrer_type\" class=\"form-control capitalize\" (change)=\"onChangeOfLeadSourceEdit($event.target.value)\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{src.name}}\" *ngFor=\"let src of lead_referrer_list\">{{src.name | underScore }}</option>\n\t\t                </select>\n\t\t              </div>\n\t\t            </div>\n\n\t\t\t\t\t\n\n\n\t\t           <!--  <div class=\"col-sm-10 col-md-6\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Select Lead Campaign</label>\n\t\t                <select formControlName=\"lead_campaign_id\" class=\"form-control capitalize\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{camp.id}}\" *ngFor=\"let camp of lead_campaigns\">{{camp.name }}</option>\n\t\t                </select>\n\t\t              </div>\n\t\t            </div> -->\n\t\t            <div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"['display_dealer_referral','non_display_dealer_referral','client_referral','design_partner_referral','broker','employee_referral','dealer','arrivae_champion','others','associate_partner'].includes(updateLeadForm.controls['lead_source_type'].value) == true \">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Referrer User</label>\n\t\t                <select formControlName=\"referrer_id\" class=\"form-control capitalize\">\n\t\t                  <option value=\"\" disabled>Select</option>\n\t\t                  <option value=\"{{camp.id}}\" *ngFor=\"let camp of userList\">{{camp.name }} - {{ camp.email}}</option>\n\t\t                </select>\n\t\t              </div>\n\t\t            </div>\n\t\t            <div class=\"col-sm-10 col-md-6\" *ngIf=\"updateLeadForm.controls['lead_type_name'].value=='designer'\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Instagram Id</label>\n\t\t                <input type=\"text\" formControlName=\"instagram_handle\" name=\"\" class=\"form-control\">\n\t\t              </div>\n\t\t            </div>\n\t\t            <div class=\"col-sm-10 col-md-6\" *ngIf=\"updateLeadForm.controls['lead_type_name'].value=='designer'\">\n\t\t              <div class=\"form-group\">\n\t\t                <label class=\"text-left\">Upload CV</label>\n\t\t                <input type=\"file\" name=\"\" class=\"form-control\" (change)=\"uploadCV($event)\" name=\"attachment_file\">\n\t\t                <a href=\"https://{{updateLeadForm.controls['lead_cv'].value}}\" *ngIf=\"updateLeadForm.controls['lead_cv'].value &&  updateLeadForm.controls['lead_cv'].value!='/images/original/missing.png'\" onerror=\"this.src='./assets/img/no_image.svg'\" target=\"_blank\">View CV</a>\n\t\t               \n\t\t              </div>\n\t\t            </div>\n\t\t\t\t\t\n\n\t\t\t\t\t<div class=\"col-md-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t  <label class=\"text-left\">Change Status</label>\n\t\t\t\t\t\t  <select class=\"form-control capitalize\" (change)=\"setLeadStatus($event.target.value)\" formControlName=\"lead_status\">\n\t\t\t\t\t\t\t<option value=\"\" disabled>Select</option>\n\t\t\t\t\t\t\t<option value=\"qualified\">Qualified</option>\n\t\t\t\t\t\t\t<option value=\"follow_up\">Follow Up</option>\n\t\t\t\t\t\t\t<option value=\"lost\">Lost</option>\n\t\t\t\t\t\t\t<option value=\"not_contactable\">Not Contactable</option>\n\t\t\t\t\t\t\t<option value=\"delayed_possession\">Delayed Possession</option>\n\t\t\t\t\t\t\t<option value=\"delayed_project\">Delayed Project</option>\n\t\t\t\t\t\t  </select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t  <div class=\"col-md-6\" id=\"datetime\" *ngIf=\"updateLeadForm.controls['lead_status'].value=='follow_up'\">\n\t\t            \t<div class=\"form-group\">\n\t\t            \t\t<label class=\"text-left\">Follow up Time<span class=\"text-danger\">*</span></label>\n\t\t            \t\t<input [owlDateTime]=\"dt1\" [owlDateTimeTrigger]=\"dt1\" placeholder=\"Enter Date and Time\" formControlName=\"follow_up_time\" class=\"form-control\">\n                \t\t<owl-date-time #dt1 ></owl-date-time> \n\t\t            \t</div>\n\t\t            </div>\n\t\t            <div class=\"col-md-6\" id=\"remarkId\" *ngIf=\"updateLeadForm.controls['lead_status'].value=='follow_up'\">\n\t\t            \t<div class=\"form-group\">\n\t\t            \t\t<label class=\"text-left\">Follow Up Remark<span class=\"text-danger\">*</span></label>\n\t\t            \t\t<input type=\"text\" name=\"\" class=\"form-control\" formControlName=\"remark\">\n\t\t            \t</div>\n\t\t            </div>\n\n\t\t\t\t\t<div class=\"col-md-6\" id=\"addleadFormlostReason\" *ngIf=\"updateLeadForm.controls['lead_status'].value=='lost'\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t  <label for=\"example-text-input\" class=\"text-left\">Reason for Lost<span class=\"text-danger\">*</span></label>\n\t\t\t\t\t\t  <div class=\"\">\n\t\t\t\t\t\t\t<select class=\"form-control capitalize\" id=\"lost_reason\" formControlName=\"lost_reason\" (change)=\"reasonForLostDropdownChange($event.target.value)\">\n\t\t\t\t\t\t\t  <option value=\"\" disabled>Select Reason</option>\n\t\t\t\t\t\t\t  <option *ngFor=\"let reason of lostReasonsArr\" value=\"{{reason}}\">{{reason | replaceChar}}</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-md-6\"  id=\"lostremark\" *ngIf=\"updateLeadForm.controls['lead_status'].value=='lost'\">\n\t\t\t\t\t\t<div  class=\"form-group\">\n\t\t\t\t\t\t<label>Remarks</label>\n\t\t\t\t\t\t<textarea class=\"form-control\" rows=\"2\" formControlName=\"lost_remark\"></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"col-md-6\" id=\"delayedTime\" *ngIf=\"updateLeadForm.controls['lead_status'].value=='delayed_possession'\">\n\t\t            \t<div class=\"form-group\">\n\t\t            \t\t<label class=\"text-left\">Delayed Possession Date</label>\n\t\t            \t\t<input name=\"startDateNew\" id=\"startDateNew\" class=\"date-picker\" (focus)=\"callChangeNew1()\" formControlName=\"follow_up_time\"  placeholder=\"Choose A Month...\"/> \n\t\t            \t</div>\n\t\t            </div>\n\t\t            <div class=\"col-md-6\" id=\"delayedTimeProject\" *ngIf=\"updateLeadForm.controls['lead_status'].value=='delayed_project'\">\n\t\t            \t<div class=\"form-group\">\n\t\t            \t\t<label class=\"text-left\">Delayed Project Date</label>\n\t\t            \t\t<input name=\"startDateNewpro\" id=\"startDateNewpro\" class=\"date-picker\"  (focus)=\"callChangeNew1()\" formControlName=\"follow_up_time\"  placeholder=\"Choose A Month...\"/> \n\t\t            \t</div>\n\t\t            </div>\n\n\t\t\t\t\t<!-- <div  class=\"col-sm-10 col-md-12 form-group\" style=\"text-align:left\" *ngIf = 'editFormdata && editFormdata.lead_status !== \"claimed\" '>\n\t\t\t\t\t\t<label class=\"customLabel mr-2\">Send To CS Agent</label>\n\t\t\t\t\t\t\t <label class=\"form-check-label lableSize labelColor mb-2 mr-4\">\n\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" [value]=\"true\" formControlName=\"send_to_cs_agent\">\n\t\t\t\t\t\t   Yes\n\t\t\t\t\t\t  </label>\n\t\t\t\t\t\t   <label class=\"form-check-label lableSize labelColor mb-2 mr-4\">\n\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" [value]=\"false\" formControlName=\"send_to_cs_agent\">\n\t\t\t\t\t\t   No\n\t\t\t\t\t\t  </label>\n\t\t\t\t\t</div> -->\n\t\t            <div class=\"col-sm-12 mt-3 text-right\">\n\t\t              <div class=\"mt-3\">\n\t\t              <button type=\"submit\" [disabled]=\"!updateLeadForm.valid\" class=\"rk-interalBtnColor addCursor\">Update</button>\n\t\t              <button class=\"cancle ml-3 addCursor rk-btnCancel\"  data-dismiss=\"modal\">Cancel</button>\n\t\t              </div>\n\t\t            </div>\n\t\t            <!-- <pre>{{updateLeadForm.value | json}}</pre> -->\n\t\t          </div>\n\t\t        </div>\n      \t\t</div>\n    \t</form>\n\t</div>\n</div>\n\n<div class=\"modal fade customModal\" id=\"questionnaireModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"questionnaireModalLabel\" aria-hidden=\"true\" data-keyboard=\"false\" data-backdrop=\"static\" style=\"overflow-y:auto\">\n\t<div class=\"modal-dialog modal-lg\" role=\"document\">\n\t\t<div class=\"modal-content\">\n\t\t\t<div class=\"modal-header\">\n        <h5 class=\"modal-title modalTitle\" id=\"exampleModalLabel\"> Lead Questionnaire</h5>\n      </div>\n      <div class=\"modal-body\">\n      \t<app-leadquestionnaire [leadDetails]=\"leaddetailsForModal\" (close)=\"closeModal($event)\"></app-leadquestionnaire>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n<div class=\"modal fade\" id=\"additionalAppDetails\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"additionalAppDetailsTitle\" aria-hidden=\"true\">\n\t<div class=\"modal-dialog\" role=\"document\">\n\t  <div class=\"modal-content\">\n\t\t<div class=\"modal-header\">\n\t\t  <h5 *ngIf =\"singlePDFData\" class=\"modal-title\" id=\"additionalAppDetailsTitle\">Lead ID : {{singlePDFData.id}}</h5>\n\t\t  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t  </button>\n\t\t</div>\n\t\t<div class=\"modal-body\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-lg-6\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>Lead Status</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>Project Status</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>No. of calls by designer</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>No. of meetings by designer</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>BOQ shared date</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>Closure date</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>Closure value</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>Order confirmation date\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12\">\n\t\t\t\t\t\t\t<p>Order confirmation value\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-lg-6\">\n\t\t\t\t\t<div class=\"row\" *ngIf =\"singlePDFData\" >\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.lead_status ? (singlePDFData.lead_status | replaceChar ) : '---' }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.project_status ? (singlePDFData.project_status | replaceChar) : '---' }} <span *ngIf=\"singlePDFData.project_sub_status\"> - </span> <span *ngIf=\"singlePDFData.project_sub_status !='40%_payment_recieved'\">{{singlePDFData.project_sub_status ? (singlePDFData.project_sub_status | replaceChar) : ' ' }}</span> <span *ngIf=\"singlePDFData.project_sub_status =='40%_payment_recieved'\">40% Payment Received</span></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.num_designer_calls ? singlePDFData.num_designer_calls : '---' }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.num_designer_meetings ? singlePDFData.num_designer_meetings : '---' }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.boq_sharing_date ? (singlePDFData.boq_sharing_date | date:'dd-MM-yyyy' ) : '---' }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.closure_date ? (singlePDFData.closure_date | date:'dd-MM-yyyy' ) : '---' }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.closure_value ? (singlePDFData.closure_value | formatCurPipe ) : '---'}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.order_confirmation_date? (singlePDFData.order_confirmation_date | date:'dd-MM-yyyy' ) : '---' }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-12 capitalize\">\n\t\t\t\t\t\t\t<p>{{singlePDFData.order_confirmation_value? (singlePDFData.order_confirmation_value | formatCurPipe ) : '---'}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t</div>\n\t\t</div>\n\t  </div>\n\t</div>\n</div>\n\n<div class=\"modal fade customModal\" id=\"logModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"logModalLabel\" aria-hidden=\"true\">\n\t<div class=\"modal-dialog logwidth\" role=\"document\">\n\t\t<div class=\"modal-content\">\n\t\t\t<div class=\"modal-header\">\n\t          <h5 class=\"modal-title modalTitle\" id=\"logModalLabel\"> Activity Log</h5>\n\t\t\t  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"clearLogs();\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t  </button>\n\t        </div>\n\t        <div class=\"modal-body\">\n\t            <div class=\"row justify-content-center\" style=\"background: #ECF0F1\">\n\t            \t<div class=\"col-sm-11\">\n\t            \t\t<div class=\"row leadDetailsMainDiv\" *ngIf=\"lead_logs\">\n\t\t\t\t\t      <div class=\"col-md-12 pl-4 borderBottom\">\n\t\t\t\t\t        <div class=\"leadDetailsDiv\">\n\t\t\t\t\t          <p class=\"my-2 vColor\">Lead Details</p>\n\t\t\t\t\t        </div>\n\t\t\t\t\t      </div>\n\t\t\t\t\t      <div class=\"col-md-4 my-4 pl-4\">\n\t\t\t\t\t        <p class=\"vColor fontSize14 mb-2 capitalize\">Name: <span class=\"text-dark\">{{lead_logs.name}}</span></p>\n\t\t\t\t\t        <p class=\"vColor fontSize14 mb-2\">Role: <span class=\"text-dark capitalize\">{{lead_logs.lead_type}}</span></p>\n\t\t\t\t\t      </div>\n\t\t\t\t\t      <div class=\"col-md-4 my-4\">\n\t\t\t\t\t        <p class=\"vColor fontSize14 mb-2\">Contact: <span class=\"text-dark\">{{lead_logs.contact}}</span></p>\n\t\t\t\t\t        <p class=\"vColor fontSize14 mb-2\">Status: <span class=\"text-dark capitalize\">{{lead_logs.lead_status | replaceChar}}</span></p>\n\t\t\t\t\t      </div>\n\t\t\t\t\t      <div class=\"col-md-4 my-4\">\n\t\t\t\t\t        <p class=\"vColor fontSize14 mb-2\">Date of Acquisition: <span class=\"text-dark\">{{lead_logs.created_at | date:'dd MMM, y , h:mm a'}}</span></p>\n\t\t\t\t\t        <p class=\"vColor fontSize14 mb-2 capitalize\">Assigned CS Agent: <span class=\"text-dark\" *ngIf=\"lead_logs.agent\">{{lead_logs.agent.name}}</span><span class=\"text-dark\" *ngIf=\"!lead_logs.agent\">Not Assigned</span></p>\n\t\t\t\t\t      </div>\n\t\t\t\t\t    </div>\n\t\t\t\t\t    <div class=\"row my-4\">\n\t\t\t\t\t\t    <div class=\"col-md-6\">\n\t\t\t\t\t\t        <!-- <p class=\"vColor fontSize14 mb-2\">DATE RANGE</p> -->\n\t\t\t\t\t\t    </div>\n\t\t\t\t\t\t    <div class=\"col-md-6\">\n\t\t\t\t\t\t        <div class=\"row\">\n\t\t\t\t\t\t          <div class=\"col-7\">\n\t\t\t\t\t\t            <p class=\"vColor fontSize14 mb-2\">USER</p>\n\t\t\t\t\t\t            <div class=\"dropdown\">\n\n\t\t\t\t\t\t              <button class=\"dropdown-toggle dropdown-toggle1 dropdownButton dropdownButton1\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\t\t\t\t\t\t                <img src=\"../../assets/img/images/original/missing.png\" class=\"img-fluid myFluit mr-2\">\n\t\t\t\t\t\t                <span>All (logs)</span>\n\t\t\t\t\t\t              </button>\n\n\t\t\t\t\t\t              <div class=\"dropdown-menu dropdownMenu py-1\" aria-labelledby=\"dropdownMenuButton\">\n\t\t\t\t\t\t                <a class=\"dropdown-item dropdown-item1 mt-2\" (click) = \"filterLogs($event, 'all')\">\n\t\t\t\t\t\t                  <img src=\"../../assets/img/images/original/missing.png\" class=\"img-fluid myFluit mr-2\">\n\t\t\t\t\t\t                  All (logs)\n\t\t\t\t\t\t                </a>\n\n\t\t\t\t\t\t                <a class=\"dropdown-item dropdown-item1 mt-2\" *ngFor=\"let owner of log_owners\" (click) = \"filterLogs($event,owner.email)\">\n\t\t\t\t\t\t                  <img src=\"../../assets/img{{owner.image}}\" class=\"img-fluid myFluit mr-2\" onError=\"this.src='../../assets/img/images/original/missing.png'\">\n\t\t\t\t\t\t                  {{owner.name}}\n\t\t\t\t\t\t                </a>\n\t\t\t\t\t\t              </div>\n\n\t\t\t\t\t\t            </div>\n\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t          <div class=\"col-5\">\n\t\t\t\t\t\t            <p class=\"vColor fontSize14 mb-2\">SORT BY</p>\n\t\t\t\t\t\t            <div class=\"dropdown\">\n\t\t\t\t\t\t              <button class=\"dropdown-toggle dropdown-toggle1 dropdownButton dropdownButton2\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\t\t\t\t\t\t                Oldest First\n\t\t\t\t\t\t              </button>\n\t\t\t\t\t\t              <div class=\"dropdown-menu py-1 border-0\" aria-labelledby=\"dropdownMenuButton\">\n\t\t\t\t\t\t                <a class=\"dropdown-item dropdown-item1\" (click)=\"sortlog('created_at', 'oldest')\">Oldest First</a>\n\t\t\t\t\t\t                <a class=\"dropdown-item dropdown-item1\" (click)=\"sortlog('created_at', 'newest')\">Newest First</a>\n\t\t\t\t\t\t              </div>\n\t\t\t\t\t\t            </div>\n\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t      </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"row mb-5\">\n\t\t\t\t\t\t    <div class=\"col-md-12\">\n\t\t\t\t\t\t        <!-- <h5 class=\"my-3 vColor1\">Today <span class=\"vDate vColor ml-1\">Thu Jun 23</span></h5> -->\n\t\t\t\t\t\t        <!-- *ngFor=\"let log of filtered_logs\" -->\n\t\t\t\t\t\t        <div class=\"row\" *ngFor = \"let log of filtered_logs | sortDatewise:{property:columnlog, direction:directionlog}\">\n\t\t\t\t\t\t          <div class=\"col-md-12\">\n\t\t\t\t\t\t            <div class=\"row customRow mt-2 mb-1\" data-toggle=\"collapse\" attr.data-target=\"#{{log.custom_id}}\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n\t\t\t\t\t\t              <div class=\"col-1 text-center\">\n\t\t\t\t\t\t                <!-- <img src=\"../../assets/v3/img/profile.jpeg\" class=\"img-fluid\"> -->\n\t\t\t\t\t\t                <img src=\"../../assets/img{{log.user_image}}\" class=\"img-fluid\" onError=\"this.src='../../assets/img/images/original/missing.png'\"/>\n\t\t\t\t\t\t              </div>\n\t\t\t\t\t\t              <div class=\"col-11 pl-0\" *ngIf=\"log.exotel==false\">\n\t\t\t\t\t\t                <p class=\"mb-0 mt-1 vColor1\">\n\t\t\t\t\t\t                  <span class=\"vPara capitalize\" *ngIf=\"log.name\">{{log.name}}({{log.role}}) </span>\n\t\t\t\t\t\t                  <span class=\"vPara\" *ngIf=\"!log.name\">Someone </span>\n\t\t\t\t\t\t                  made changes on\n\t\t\t\t\t\t                  <span class=\"vPara\">\" {{log.date}} \"</span></p>\n\t\t\t\t\t\t                <span class=\"vDate vColor\">{{log.time}}</span>\n\t\t\t\t\t\t                <i class=\"cusDownArrow fa fa-caret-down\"></i>\n\t\t\t\t\t\t              </div>\n\t\t\t\t\t\t              <div class=\"col-11 pl-0\" *ngIf=\"log.exotel==true\">\n\t\t\t\t\t\t                <p class=\"mb-0 mt-1 vColor1\">\n\t\t\t\t\t\t                  <span class=\"vPara capitalize\" *ngIf=\"log.whodunnit\">{{log.whodunnit}}({{log.role}}) </span>\n\t\t\t\t\t\t                  <span class=\"vPara\" *ngIf=\"!log.whodunnit\">Someone </span>\n\t\t\t\t\t\t                  called at\n\t\t\t\t\t\t                  <span class=\"vPara\">\" {{log.called_at | date: 'dd MMM, y '}} \"</span></p>\n\t\t\t\t\t\t                <span class=\"vDate vColor\">{{log.called_at | date:'h:mm a'}}</span>\n\t\t\t\t\t\t                <i class=\"cusDownArrow fa fa-caret-down\"></i>\n\t\t\t\t\t\t              </div>\n\t\t\t\t\t\t            </div>\n\n\t\t\t\t\t\t            <div class=\"row collapse\" id=\"{{log.custom_id}}\" *ngIf=\"log.exotel==false\">\n\t\t\t\t\t\t              <div class=\"col-md-12 p-0\">\n\t\t\t\t\t\t                <div class=\"card card-body\">\n\t\t\t\t\t\t                  <table class=\"table table-responsive\">\n\t\t\t\t\t\t                    <tbody>\n\t\t\t\t\t\t                      <tr>\n\t\t\t\t\t\t                        <th style=\"border: 0;\">Field</th>\n\t\t\t\t\t\t                        <th style=\"border: 0;\">Original Value</th>\n\t\t\t\t\t\t                        <th style=\"border: 0;\">New Value</th>\n\t\t\t\t\t\t                      </tr>\n\t\t\t\t\t\t                      <tr *ngFor = \"let object of log.object_changes\">\n\t\t\t\t\t\t                        <td style=\"border: 0;\" class=\"vColor1\">{{object.name}}</td>\n\t\t\t\t\t\t                        <td style=\"border: 0;\">{{object.initial}}</td>\n\t\t\t\t\t\t                        <td style=\"border: 0;\">{{object.final}}</td>\n\t\t\t\t\t\t                      </tr>\n\t\t\t\t\t\t                    </tbody>\n\t\t\t\t\t\t                  </table>\n\t\t\t\t\t\t                </div>\n\t\t\t\t\t\t              </div>\n\t\t\t\t\t\t            </div>\n\n\t\t\t\t\t\t            <div class=\"row collapse\" id=\"{{log.custom_id}}\" *ngIf=\"log.exotel==true\">\n\t\t\t\t\t\t              <div class=\"col-md-12 p-0\">\n\t\t\t\t\t\t                <div class=\"card card-body\">\n\t\t\t\t\t\t                  <table class=\"table table-responsive\">\n\t\t\t\t\t\t                    <tbody>\n\t\t\t\t\t\t                      <tr>\n\t\t\t\t\t\t                        <th style=\"border: 0;\">Status</th>\n\t\t\t\t\t\t                        <th style=\"border: 0;\">Duration</th>\n\t\t\t\t\t\t                        <th style=\"border: 0;\">Recording Url</th>\n\t\t\t\t\t\t                      </tr>\n\t\t\t\t\t\t                      <tr>\n\t\t\t\t\t\t                        <td style=\"border: 0;\" class=\"vColor1\">{{log.status}}</td>\n\t\t\t\t\t\t                        <td style=\"border: 0;\">{{log.duration}}</td>\n\t\t\t\t\t\t                        <td style=\"border: 0;\">\n\t\t\t\t\t\t                        \t<audio controls *ngIf=\"log.recording_url!=null && log.recording_url!='' \">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  <source src=\"{{log.recording_url}}\" type=\"audio/mpeg\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tYour browser does not support the audio element.\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</audio>\n\t\t\t\t\t\t                        \t<span *ngIf=\"log.recording_url==null || log.recording_url=='' \">NA</span>\n\t\t\t\t\t\t                    \t\t</td>\n\t\t\t\t\t\t                      </tr>\n\t\t\t\t\t\t                    </tbody>\n\t\t\t\t\t\t                  </table>\n\t\t\t\t\t\t                </div>\n\t\t\t\t\t\t              </div>\n\t\t\t\t\t\t            </div>\n\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t      </div>\n\t\t\t\t\t\t\t\t</div>\n\n\t            \t</div>\n\t            </div>\n\t        </div>\n\t\t</div>\n\t</div>\n</div>\n<div id=\"OtherProjectname2\" class=\"modal\" role=\"dialog\" data-backdrop=\"static\">\n\t<div class=\"modal-dialog modal-dialog-centered leadQUES\"  style=\"max-width: 50rem !important;\"  >\n\t  <!-- Modal content-->\n\t  <div style=\"border: 3px solid #6F0000;\" class=\"modal-content p-1\">\n\t\t<div class=\"modal-header\">\n\t\t  <h6 class=\"modal-title w-100 text-center\"> Add Society/Building/Project</h6>\n\t\t  <button (click)=\"closeaddApartmentrplanModal()\" type=\"button\" class=\"close\"><i class=\"fa fa-close\"></i></button>\n  \n  \n\t\t</div>\n\t\t<div class=\"modal-body \" (mouseover)=\"pincodeval()\">\n\t\t  <div class=\"col-12 row\">\n\t\t\t<div  class=\"form-check d-flex col-12 \"  >\n\t\t\t  <label   class=\"customLabel mt-2 col-6\">Society/Building/Project Name :<span\n\t\t\t\tclass=\"text-danger hideAsteriskIcon\">*</span></label>\n\t\t\t  <input  type=\"text\"  class=\"form-control col-6\" [(ngModel)]=\"projectName\"\n\t\t\t\tplaceholder=\"Enter the Project name\">\n\t\t\t</div>\n\t\t\t<div  class=\"form-check  d-flex col-12\"  >\n\t\t\t  <label   class=\"customLabel mt-2 col-6 \">Developer Name :<span\n\t\t\t\tclass=\"text-danger hideAsteriskIcon\">*</span></label>\n\t\t\t  <input type=\"text\"   class=\"form-control col-6\"\n\t\t\t\tplaceholder=\"Enter the Developer name\" [(ngModel)]=\"DeveloperName\">\n\t\t\t</div>\n\t\t\t<div  class=\"form-check d-flex col-12\"  >\n\t\t\t  <label   class=\"customLabel mt-2  col-6\">Full Address :<span\n\t\t\t\tclass=\"text-danger hideAsteriskIcon\">*</span></label>\n\t\t\t\t<input  id=\"autocomplete-input2\"  type=\"text\"  class=\"form-control\"    [(ngModel)]=\"FullAdress\" (focus)=\"pincodeval()\" (change)=\"pincodeval()\"\n\t\t\t\tplaceholder=\"Enter the Full Address\">\n  \n\t\t\t</div>\n\t\t\t<div  class=\"form-check  d-flex col-12\"  >\n\t\t\t  <label   class=\"customLabel mt-2 col-6\">City :<span\n\t\t\t\tclass=\"text-danger \">*</span></label>\n\t\t\t  <input id=\"citygoogle2\"  readonly type=\"text\"  class=\"form-control col-6\" >\n\t\t\t</div>\n  \n\t\t\t<div  class=\"form-check d-flex col-12\"  >\n\t\t\t  <label   class=\"customLabel mt-2 col-6\">Pincode :<span\n\t\t\t\tclass=\"text-danger \">*</span></label>\n\t\t\t  <input id=\"pincodegoogle2\"  type=\"text\" [(ngModel)]=\"pincodePro\"   class=\"form-control col-6\"\n\t\t\t\t >\n\t\t\t\t <input id=\"areaname2\" readonly type=\"text\"   class=\"form-control d-none col-6\"\n\t\t\t\t >\n\t\t\t</div>\n\t\t  </div>\n\t\t  <div class=\"col-12 mt-2 d-flex justify-content-center\">\n  \n\t\t\t<button class=\"btn btn-pink px-3 py-2\" [disabled]=\"projectName == '' || DeveloperName == '' ||  FullAdress == '' || pincodePro == ''  \" (click)=\"Submitapart()\">Submit</button>\n  \n\t\t  </div>\n\t\t</div>\n\t  </div>\n\t</div>\n  </div>\n  <div id=\"LeadsReportUpload\" class=\"modal\" style=\"overflow: auto;\" role=\"dialog\" data-backdrop=\"static\">\n\t<div class=\"modal-dialog modal-dialog-centered leadQUES\"  style=\"max-width: 50rem !important;\"  >\n\t  <!-- Modal content-->\n\t  <div style=\"border: 3px solid #6F0000;\" class=\"modal-content p-1\">\n\t\t<div class=\"modal-header\">\n\t\t  <h6 class=\"modal-title w-100 text-center\"> Bulk Upload Report</h6>\n\t\t  <button type=\"button\" data-dismiss=\"modal\" class=\"close\"><i class=\"fa fa-close\"></i></button>\n  \n  \n\t\t</div>\n\t\t<div class=\"modal-body row col-12\">\n        <table class=\"w-100 ZohoMapTable\">\n\t\t\t<tr>\n\t\t\t\t<th class=\"th1\">Row No</th>\n\t\t\t\t<th class=\"th2\">Result</th>\n\t\t\t</tr>\n\t\t\t<tr *ngFor=\"let result of LeadsReport; let i = index\">\n\t\t\t\t<td>{{ result.row_no}}</td>\n\t\t\t\t<td>{{result.reason}}</td>\n\t\t\t</tr>\n     \n\t\t</table>\n\t\t</div>\n\t  </div>\n\t</div>\n  </div>\n"

/***/ }),

/***/ "./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SalesLeadMgmtComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sales_manager_service__ = __webpack_require__("./src/app/platform/salesmanager/sales-manager.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__ = __webpack_require__("./src/app/platform/lead/lead.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SalesLeadMgmtComponent = /** @class */ (function () {
    function SalesLeadMgmtComponent(route, leadService, salesService, loaderService, formBuilder, router, location) {
        this.route = route;
        this.leadService = leadService;
        this.salesService = salesService;
        this.loaderService = loaderService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.location = location;
        this.source = [];
        this.lead_statusArr = [];
        this.lead_type_idArr = [];
        this.lead_source_idArr = [];
        this.lead_referrer_list = [];
        this.lead_campaign_idArr = [];
        this.csagents_idArr = [];
        this.filteredLeads = [];
        this.column_name = 'created_at';
        this.successalert = false;
        this.erroralert = false;
        this.sourceOfBulkLeads = "";
        this.typeOfBulkLeads = "";
        this.campignOfBulkLeads = "";
        this.referrer_type = "";
        this.referreresList = [];
        this.lostReasonsArr = [
            "low_budget",
            "non_serviceable_area",
            "language_barrier",
            "no_requirement",
            "not_interested",
            "low_scope",
            "already_given_to_another_vendor",
            "wrong_number",
            "did_not_enquire",
            "enquired_by_mistake",
            "casual_enquiry",
            "only_want_designs",
            "heavy_civil_(services)_work",
            "only_civil_(services)_work",
            "others",
        ];
        this.dropdownList = [];
        this.dropdownList2 = [];
        this.dropdownList3 = [];
        this.dropdownList4 = [];
        this.dropdownList5 = [];
        this.dropdownList6 = [{ "id": "created_at", "itemName": "Acquisition Date" }, { "id": "status_updated_at", "itemName": "Status Updated Date" }];
        this.selectedItems = [];
        this.selectedItems2 = [];
        this.selectedItems3 = [];
        this.selectedItems4 = [];
        this.selectedItems5 = [];
        this.selectedItems6 = [{ "id": "created_at", "itemName": "Acquisition Date" }];
        this.dropdownSettings6 = {
            singleSelection: true,
            // text:" Acquisition Date",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class-dropdown"
        };
        this.dropdownSettings = {
            singleSelection: false,
            text: "Lead Type",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class-dropdown",
        };
        this.dropdownSettings5 = {
            singleSelection: false,
            text: "CS Agent",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class-dropdown"
        };
        this.dropdownSettings4 = {
            singleSelection: false,
            text: "Campaign",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class-dropdown"
        };
        this.dropdownSettings3 = {
            singleSelection: false,
            text: "Lead Source ",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class-dropdown"
        };
        this.dropdownSettings2 = {
            singleSelection: false,
            text: "Status",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class-dropdown",
        };
        this.referrer_id = "";
        this.designerArr = [];
        this.LeadsReport = [];
        this.societyList = [];
        this.societyOthersValue = false;
        this.cityChangeValue = false;
        this.locationOthersValue = false;
        this.filtered_logs = [];
        this.log_owners = [];
        this.assignedCMIds = [];
        this.isDesclog = true;
        this.columnlog = "CategoryName";
        this.isSelected = false;
        this.isSelectedgoogle = false;
        this.isApifired = false;
        this.isApifiredgoogle = false;
        this.projectName = '';
        this.pincodePro = '';
        this.SelectedPlace = '';
    }
    SalesLeadMgmtComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sales_id = localStorage.getItem('userId');
        this.role2 = localStorage.getItem('user');
        this.route.queryParams.subscribe(function (params) {
            _this.lead_status = params['lead_status'];
            _this.lead_type = params['lead_type'];
            _this.lead_type_id = params['id'];
            _this.referrer_type_id = params['referrer_type'];
            _this.to_date = params['to_date'];
            _this.from_date = params['from_date'];
        });
        if (this.lead_status != undefined) {
            this.breadcrumval = this.lead_status;
            this.lead_statusArr.push(this.lead_status);
            this.dropdownSettings2["text"] = this.lead_status.replace(/_/g, " ").toLowerCase().split(' ').map(function (x) { return x[0].toUpperCase() + x.slice(1); }).join(' ');
            this.dropdownSettings2["disabled"] = true;
        }
        if (this.lead_type != undefined) {
            this.breadcrumval = this.lead_type;
            if (this.lead_type_id != undefined) {
                this.lead_type_idArr.push(this.lead_type_id);
            }
            this.dropdownSettings["text"] = this.lead_type;
            this.dropdownSettings["disabled"] = true;
            //this.selectedItems.push({id:this.lead_type_id,itemName:this.lead_type});
        }
        this.addLeadForm = this.formBuilder.group({
            name: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required),
            // email : new FormControl("",[Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]),
            email: ["", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].email]],
            contact: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required]),
            pincode: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            // lead_type_id : new FormControl("",Validators.required),
            lead_source_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required),
            lead_campaign_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            referrer_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            instagram_handle: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            lead_type_name: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            lead_source_type: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            referrer_type: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            city: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            new_city_value: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            society: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required),
            new_society_value: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            location: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            new_locality_value: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            send_to_cs_agent: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](true),
            building_crawler_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            lead_screen: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]('sales_manager'),
            sales_manager_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            aide_apartment_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]()
        });
        this.updateLeadForm = this.formBuilder.group({
            id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            name: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required),
            email: ["", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].email]],
            contact: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required]),
            pincode: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            // lead_type_id : new FormControl("",Validators.required),
            lead_source_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            referrer_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            lead_campaign_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            lead_status: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            follow_up_time: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            remark: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            lost_remark: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            lost_reason: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            instagram_handle: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            lead_type_name: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            lead_cv: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            lead_source_type: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            referrer_type: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            city: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            new_city_value: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](""),
            society: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required),
            new_society_value: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            location: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            new_locality_value: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            send_to_cs_agent: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            building_crawler_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](''),
            lead_screen: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]('sales_manager'),
            sales_manager_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */](),
            aide_apartment_id: new __WEBPACK_IMPORTED_MODULE_6__angular_forms__["c" /* FormControl */]()
        });
        this.getFiletredLeadsForSales(1);
        this.loader();
    };
    SalesLeadMgmtComponent.prototype.loader = function () {
        this.getFiltersData();
        this.getReferListForSelect();
        this.getReferrersList();
        this.getCitiesForQuestionnaire();
        this.getCmList();
        this.listAllSalesManager();
    };
    SalesLeadMgmtComponent.prototype.onKey = function (event) {
        this.search_value = event.target.value;
        var i = 0;
        if (true) {
            this.getFiletredLeadsForSales('', this.search_value);
            i++;
        }
    };
    SalesLeadMgmtComponent.prototype.getReferListForSelect = function () {
        var _this = this;
        this.loaderService.display(true);
        this.salesService.getReferListForSelect(this.sales_id).subscribe(function (res) {
            _this.lead_referrer_list = res['referral_roles'];
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.getFiltersData = function () {
        var _this = this;
        this.loaderService.display(true);
        this.leadService.getFiltersData().subscribe(function (res) {
            res = res.json();
            _this.lead_campaigns = res.lead_campaign_id_array;
            _this.lead_sources = res.lead_source_id_array;
            _this.lead_sources = _this.lead_sources.filter(function (e) { return e.name !== 'referral'; });
            //this.lead_status=res.lead_status_array
            _this.lead_types = res.lead_type_id_array;
            // this.csagentsArr = res.cs_agent_list;
            for (var i = 0; i < res.lead_type_id_array.length; i++) {
                var obj = {
                    "id": res.lead_type_id_array[i].id, "itemName": res.lead_type_id_array[i].name.replace("_", " ").toLowerCase().split(' ').map(function (x) { return x[0].toUpperCase() + x.slice(1); }).join(' ')
                };
                _this.dropdownList.push(obj);
            }
            for (var i = 0; i < res.lead_status_array.length; i++) {
                var obj = {
                    "id": i, "itemName": res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(function (x) { return x[0].toUpperCase() + x.slice(1); }).join(' ')
                };
                _this.dropdownList2.push(obj);
            }
            for (var i = 0; i < res.lead_source_id_array.length; i++) {
                var obj = {
                    "id": res.lead_source_id_array[i].id, "itemName": res.lead_source_id_array[i].name.replace("_", " ").toLowerCase().split(' ').map(function (x) { return x[0].toUpperCase() + x.slice(1); }).join(' ')
                };
                _this.dropdownList3.push(obj);
            }
            for (var i = 0; i < res.lead_campaign_id_array.length; i++) {
                var obj = {
                    "id": res.lead_campaign_id_array[i].id, "itemName": res.lead_campaign_id_array[i].name.replace("_", " ").toLowerCase().split(' ').map(function (x) { return x[0].toUpperCase() + x.slice(1); }).join(' ')
                };
                _this.dropdownList4.push(obj);
            }
            // for(var i=0;i<res.cs_agent_list.length;i++){
            // 	var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
            // 	var obj = {
            // 		"id":res.cs_agent_list[i].id,"itemName":<any>str
            // 	}
            // 	this.dropdownList5.push(obj);
            // }
        });
    };
    SalesLeadMgmtComponent.prototype.fromDate = function () {
        $(".fromDateSpan").hide();
        $(".fromDate").show();
    };
    SalesLeadMgmtComponent.prototype.toDate = function () {
        $(".toDateSpan").hide();
        $(".toDate").show();
    };
    SalesLeadMgmtComponent.prototype.getFiletredLeadsForSales = function (pageno, search) {
        var _this = this;
        this.page_number = pageno;
        this.loaderService.display(true);
        this.salesService.getFileterLeadsForSales('', this.lead_statusArr, this.lead_type_idArr, this.lead_source_idArr, this.lead_campaign_idArr, this.column_name, this.from_date, this.to_date, this.csagents_idArr, this.referrer_type_id, search, pageno).subscribe(function (res) {
            _this.loaderService.display(false);
            _this.headers_res = res.headers._headers;
            _this.per_page = _this.headers_res.get('x-per-page');
            _this.total_page = _this.headers_res.get('x-total');
            _this.current_page = _this.headers_res.get('x-page');
            res = res.json();
            _this.filteredLeads = res.leads;
            _this.filteredLeadsloader = true;
            // this.filteredLeads = this.sortFunc(this.filteredLeads,{property: 'id', direction: '-1'});
            // this.queryParamSelectedArr();
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.onItemSelect = function (item, textVal, index) {
        (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML = '';
        if (textVal == 'Status' && index == 1) {
            for (var k = 0; k < this.selectedItems2.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName + ',';
            }
        }
        else if (textVal == 'LeadType' && index == 0) {
            for (var k = 0; k < this.selectedItems.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems[k].itemName + ',';
            }
        }
        else if (textVal == 'LeadSource' && index == 2) {
            for (var k = 0; k < this.selectedItems3.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems3[k].itemName + ',';
            }
        }
        else if (textVal == 'Campaign' && index == 3) {
            for (var k = 0; k < this.selectedItems4.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems4[k].itemName + ',';
            }
        }
        else if (textVal == 'Agent' && index == 4) {
            for (var k = 0; k < this.selectedItems5.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems5[k].itemName + ',';
            }
        }
        else if (textVal == 'DateColumn' && index == 5) {
            for (var k = 0; k < this.selectedItems6.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems6[k].itemName + ',';
            }
        }
    };
    SalesLeadMgmtComponent.prototype.OnItemDeSelect = function (item, textVal, index) {
        (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML = '';
        if (textVal == 'Status' && index == 1) {
            for (var k = 0; k < this.selectedItems2.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName + ',';
            }
        }
        else if (textVal == 'LeadType' && index == 0) {
            for (var k = 0; k < this.selectedItems.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems[k].itemName + ',';
            }
        }
        else if (textVal == 'LeadSource' && index == 2) {
            for (var k = 0; k < this.selectedItems3.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems3[k].itemName + ',';
            }
        }
        else if (textVal == 'Campaign' && index == 3) {
            for (var k = 0; k < this.selectedItems4.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems4[k].itemName + ',';
            }
        }
        else if (textVal == 'Agent' && index == 4) {
            for (var k = 0; k < this.selectedItems5.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems5[k].itemName + ',';
            }
        }
        else if (textVal == 'DateColumn' && index == 5) {
            for (var k = 0; k < this.selectedItems6.length; k++) {
                (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems6[k].itemName + ',';
            }
        }
    };
    SalesLeadMgmtComponent.prototype.onSelectAll = function (items, textVal, index) {
        // document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if (textVal == 'Status') {
        }
        else if (textVal == 'LeadType') {
        }
        else if (textVal == 'LeadSource') {
        }
        else if (textVal == 'Campaign') {
        }
        else if (textVal == 'Agent') {
        }
        else if (textVal == 'DateColumn') {
        }
    };
    SalesLeadMgmtComponent.prototype.onDeSelectAll = function (items, textVal, index) {
        //document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if (textVal == 'Status') {
        }
        else if (textVal == 'LeadType') {
        }
        else if (textVal == 'LeadSource') {
        }
        else if (textVal == 'Campaign') {
        }
        else if (textVal == 'Agent') {
        }
        else if (textVal == 'DateColumn') {
        }
    };
    SalesLeadMgmtComponent.prototype.downloadExcel = function () {
        var _this = this;
        this.salesService.exportLeads1(this.role, '', this.lead_statusArr, this.lead_type_idArr, this.lead_source_idArr, this.lead_campaign_idArr, this.column_name, this.from_date, this.to_date, this.csagents_idArr, this.search).subscribe(function (res) {
            _this.successalert = true;
            _this.successMessage = "An email has been sent to your mail id with leads download attachment";
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 9000);
        }, function (err) {
            _this.loaderService.display(false);
            _this.erroralert = true;
            _this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function () {
                this.erroralert = false;
            }.bind(_this), 2000);
        });
    };
    SalesLeadMgmtComponent.prototype.addLeadFormSubmit = function (data) {
        var _this = this;
        this.loaderService.display(true);
        this.cityChangeValue = false;
        this.societyOthersValue = false;
        this.locationOthersValue = false;
        data['created_by'] = localStorage.getItem('userId');
        data['lead_status'] = 'not_attempted';
        data['lead_screen'] = 'sales_manager';
        if (this.addLeadForm.controls['lead_type_name'].value == 'designer') {
            data['lead_cv'] = this.basefile;
        }
        var obj = {
            lead: data
        };
        console.log(obj);
        this.leadService.addLead(obj)
            .subscribe(function (res) {
            console.log(res);
            console.log(res.status);
            _this.successalert = true;
            _this.successMessage = "Lead created successfully !!";
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 2000);
            _this.getFiletredLeadsForSales(1);
            _this.loaderService.display(false);
            _this.addLeadForm.reset();
            $('#addNewLeadModal').modal('hide');
            _this.addLeadForm.controls['lead_type_id'].setValue("");
            _this.addLeadForm.controls['lead_source_id'].setValue("");
            _this.addLeadForm.controls['lead_campaign_id'].setValue("");
            _this.addLeadForm.controls['referrer_id'].setValue("");
            _this.addLeadForm.controls["city"].setValue("");
            _this.addLeadForm.controls["location"].setValue("");
            _this.addLeadForm.controls["society"].setValue("");
            _this.addLeadForm.controls['send_to_cs_agent'].setValue(true);
            _this.basefile = undefined;
        }, function (err) {
            _this.loaderService.display(false);
            _this.erroralert = true;
            _this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function () {
                this.erroralert = false;
            }.bind(_this), 2000);
        });
    };
    SalesLeadMgmtComponent.prototype.numberCheck = function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8 || e.keyCode == 39 ||
            e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 17
            || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
            return false;
        }
    };
    SalesLeadMgmtComponent.prototype.uploadCV = function (event) {
        var _this = this;
        this.attachment_file = event.target.files[0] || event.srcElement.files[0];
        var fileReader = new FileReader();
        var base64;
        fileReader.onload = function (fileLoadedEvent) {
            base64 = fileLoadedEvent.target;
            _this.basefile = base64.result;
            //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
        fileReader.readAsDataURL(this.attachment_file);
    };
    SalesLeadMgmtComponent.prototype.filterData = function () {
        var _this = this;
        this.csagents_idArr.length = 0;
        this.lead_type_idArr.length = 0;
        this.lead_source_idArr.length = 0;
        this.lead_statusArr.length = 0;
        this.lead_campaign_idArr.length = 0;
        this.loaderService.display(true);
        for (var k = 0; k < this.selectedItems6.length; k++) {
            this.column_name = this.selectedItems6[k].id;
        }
        for (var k = 0; k < this.selectedItems.length; k++) {
            this.lead_type_idArr.push(this.selectedItems[k].id);
        }
        for (var k = 0; k < this.selectedItems2.length; k++) {
            this.lead_statusArr.push(this.selectedItems2[k].itemName.toLowerCase().replace(/ /g, "_"));
        }
        for (var k = 0; k < this.selectedItems3.length; k++) {
            this.lead_source_idArr.push(this.selectedItems3[k].id);
        }
        for (var k = 0; k < this.selectedItems4.length; k++) {
            this.lead_campaign_idArr.push(this.selectedItems4[k].id);
        }
        for (var k = 0; k < this.selectedItems5.length; k++) {
            this.csagents_idArr.push(this.selectedItems5[k].id);
        }
        this.salesService.getFileterLeadsForSales(this.source, this.lead_statusArr, this.lead_type_idArr, this.lead_source_idArr, this.lead_campaign_idArr, this.column_name, this.from_date, this.to_date, this.csagents_idArr, '', this.search, 1).subscribe(function (res) {
            _this.headers_res = res.headers._headers;
            _this.per_page = _this.headers_res.get('x-per-page');
            _this.total_page = _this.headers_res.get('x-total');
            _this.current_page = _this.headers_res.get('x-page');
            res = res.json();
            _this.filteredLeads = res.leads;
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.setUpdatedLead = function (value) {
        var _this = this;
        this.editData = value;
        this.editorCreate = 'edit';
        this.editFormdata = value;
        this.updateLeadForm.controls['sales_manager_id'].setValue(this.editFormdata.sales_manager_id);
        this.leadService.salesNoteRecords(value.id).subscribe(function (res) {
            console.log(res);
            _this.singleNoteRecordData = res.note_records[0];
            console.log(_this.singleNoteRecordData, 'note record');
            _this.updateLeadForm.controls['city'].setValue(_this.singleNoteRecordData.city);
            _this.getSocietyList(_this.singleNoteRecordData.city, '');
            if (_this.singleNoteRecordData.city === 'Others') {
                _this.cityChangeValue = true;
                _this.updateLeadForm.controls['new_city_value'].setValue(_this.singleNoteRecordData.new_city_value);
                _this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
            }
            else {
                _this.cityChangeValue = false;
                _this.updateLeadForm.controls['new_city_value'].clearValidators();
                _this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
            }
            if (_this.singleNoteRecordData.society === 'Others') {
                _this.societyOthersValue = true;
                _this.updateLeadForm.controls['new_society_value'].setValue(_this.singleNoteRecordData.new_society_value);
                _this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
            }
            else {
                _this.societyOthersValue = false;
                _this.updateLeadForm.controls['new_society_value'].clearValidators();
                _this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
            }
            if (_this.singleNoteRecordData.location === 'Others') {
                _this.locationOthersValue = true;
                _this.updateLeadForm.controls['new_locality_value'].setValue(_this.singleNoteRecordData.new_locality_value);
                _this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
            }
            else {
                _this.locationOthersValue = false;
                _this.updateLeadForm.controls['new_locality_value'].clearValidators();
                _this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
            }
            _this.updateLeadForm.controls['society'].setValue(_this.singleNoteRecordData.society);
            _this.updateLeadForm.controls['location'].setValue(_this.singleNoteRecordData.location);
        }, function (err) {
            console.log(err);
        });
        this.updateLeadForm.controls['send_to_cs_agent'].setValue(value.send_to_cs_agent);
        this.updateLeadForm.controls['id'].setValue(value.id);
        this.updateLeadForm.controls['name'].setValue(value.name);
        this.updateLeadForm.controls['email'].setValue(value.email);
        this.updateLeadForm.controls['contact'].setValue(value.contact);
        this.updateLeadForm.controls['pincode'].setValue(value.pincode);
        // this.updateLeadForm.controls['lead_type_id'].setValue(value.lead_type_id);
        this.updateLeadForm.controls['lead_source_id'].setValue(value.lead_source_id);
        this.updateLeadForm.controls['lead_campaign_id'].setValue(value.lead_campaign_id);
        this.updateLeadForm.controls['lead_status'].setValue(value.lead_status);
        // this.updateLeadForm.controls['follow_up_time'].setValue(new Date(value.follow_up_time._i).toJSON().slice(0,19));
        this.updateLeadForm.controls['remark'].setValue(value.remark);
        this.updateLeadForm.controls['lost_remark'].setValue(value.lost_remark);
        this.updateLeadForm.controls['lost_reason'].setValue(value.lost_reason);
        this.updateLeadForm.controls['lead_type_name'].setValue(value.referrer.name);
        this.updateLeadForm.controls['lead_source_type'].setValue(value.lead_source);
        this.updateLeadForm.controls['instagram_handle'].setValue(value.instagram_handle);
        this.updateLeadForm.controls['referrer_type'].setValue(value.referrer_type);
        this.getReferUserList(value.lead_source_id, value.referrer_type, value.sales_manager_id);
        this.updateLeadForm.controls['referrer_id'].setValue(value.referrer_id);
        this.updateLeadForm.controls['lead_cv'].setValue(value.lead_cv);
        this.updateLeadForm.controls['lead_status'].setValue(value.lead_status);
        if (value.follow_up_time) {
            var date = value.follow_up_time.split('T')[0];
            var time = value.follow_up_time.split('T')[1].split('.')[0];
            value.follow_up_time = date + "T" + time;
        }
        this.updateLeadForm.controls['follow_up_time'].setValue(value.follow_up_time);
        if (this.role2 == 'area_sales_manager' || this.role2 == 'sales_manager') {
            this.updateLeadForm.controls['email'].clearValidators();
        }
    };
    SalesLeadMgmtComponent.prototype.updateLeadFormSubmit = function (data) {
        var _this = this;
        console.log(this.updateLeadForm.controls);
        data['lead_screen'] = 'sales_manager';
        if (data.lead_type_name == 'designer') {
            data['lead_cv'] = this.basefile;
        }
        else {
            data['lead_cv'] = '';
        }
        var obj = {
            lead: data
        };
        if (data["lead_status"] == "delayed_possession") {
            obj.lead["follow_up_time"] = $("#startDateNew").datepicker().val();
        }
        else if (data["lead_status"] == "delayed_project") {
            obj.lead["follow_up_time"] = $("#startDateNewpro").datepicker().val();
        }
        else {
        }
        if (data['lead_status'] == 'qualified' && data['lead_type_name'] == 'customer' && (data['pincode'] == '' || data['pincode'] == null || data['pincode'] == undefined)) {
            this.errorMessage = 'Pincode is mandatory';
            this.erroralert = true;
            setTimeout(function () {
                this.erroralert = false;
            }.bind(this), 10000);
        }
        else {
            this.loaderService.display(true);
            this.leadService.editLead(data.id, obj).subscribe(function (res) {
                _this.updateLeadForm.reset();
                $('#editLeadModal').modal('hide');
                _this.getFiletredLeadsForSales(1);
                _this.loaderService.display(false);
                _this.successalert = true;
                _this.successMessage = "Details updated successfully !!";
                setTimeout(function () {
                    this.successalert = false;
                }.bind(_this), 10000);
            }, function (err) {
                _this.loaderService.display(false);
                _this.erroralert = true;
                _this.errorMessage = JSON.parse(err['_body']).message;
                setTimeout(function () {
                    this.erroralert = false;
                }.bind(_this), 10000);
            });
        }
    };
    SalesLeadMgmtComponent.prototype.deleteLead = function (id) {
        var _this = this;
        if (confirm('Are you sure you want to delete this lead?') == true) {
            this.loaderService.display(true);
            this.leadService.deleteLead(id)
                .subscribe(function (leads) {
                _this.successalert = true;
                _this.successMessage = "Lead deleted successfully";
                setTimeout(function () {
                    this.successalert = false;
                }.bind(_this), 2000);
                _this.getFiletredLeadsForSales(_this.page_number);
                _this.loaderService.display(false);
            }, function (error) {
                _this.erroralert = true;
                _this.errorMessage = JSON.parse(error['_body']).message;
                setTimeout(function () {
                    this.erroralert = false;
                }.bind(_this), 2000);
                _this.loaderService.display(false);
            });
        }
    };
    SalesLeadMgmtComponent.prototype.onChangeOfLeadType = function (val) {
        for (var i = 0; i < this.lead_types.length; i++) {
            if (val == this.lead_types[i].id) {
                this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
            }
        }
    };
    SalesLeadMgmtComponent.prototype.onChangeOfLeadSource = function (val) {
        var salesmanager = this.addLeadForm.controls['sales_manager_id'].value;
        salesmanager = salesmanager == null ? '' : salesmanager;
        for (var i = 0; i < this.lead_referrer_list.length; i++) {
            if (val == this.lead_referrer_list[i].name) {
                this.addLeadForm.controls['lead_source_type'].setValue(this.lead_referrer_list[i].name);
                if (this.addLeadForm.controls['lead_source_type'].value == 'design_partner_referral' || this.addLeadForm.controls['lead_source_type'].value == 'client_referral' || this.addLeadForm.controls['lead_source_type'].value == 'broker'
                    || this.addLeadForm.controls['lead_source_type'].value == 'display_dealer_referral'
                    || this.addLeadForm.controls['lead_source_type'].value == 'non_display_dealer_referral'
                    || this.addLeadForm.controls['lead_source_type'].value == 'employee_referral'
                    || this.addLeadForm.controls['lead_source_type'].value == 'dealer'
                    || this.addLeadForm.controls['lead_source_type'].value == 'arrivae_champion'
                    || this.addLeadForm.controls['lead_source_type'].value == 'associate_partner'
                    || this.addLeadForm.controls['lead_source_type'].value == 'others') {
                    this.getReferUserList(val, this.addLeadForm.controls['lead_source_type'].value, salesmanager);
                }
            }
        }
    };
    SalesLeadMgmtComponent.prototype.onChangeOfLeadSourceEdit = function (val) {
        var salesmanager = this.updateLeadForm.controls['sales_manager_id'].value;
        salesmanager = salesmanager == null ? '' : salesmanager;
        for (var i = 0; i < this.lead_referrer_list.length; i++) {
            if (val == this.lead_referrer_list[i].name) {
                this.updateLeadForm.controls['lead_source_type'].setValue(this.lead_referrer_list[i].name);
                if (this.updateLeadForm.controls['lead_source_type'].value == 'design_partner_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'client_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'broker' || this.updateLeadForm.controls['lead_source_type'].value == 'display_dealer_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'non_display_dealer_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'employee_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'dealer' || this.updateLeadForm.controls['lead_source_type'].value == 'arrivae_champion' || this.updateLeadForm.controls['lead_source_type'].value == 'others' || this.updateLeadForm.controls['lead_source_type'].value == 'associate_partner') {
                    this.getReferUserList(val, this.updateLeadForm.controls['lead_source_type'].value, salesmanager);
                }
            }
        }
    };
    SalesLeadMgmtComponent.prototype.getReferUserList = function (referId, referName, salesmanager) {
        var _this = this;
        this.salesService.getReferUserList(this.sales_id, referName, salesmanager).subscribe(function (res) {
            _this.userList = res['users'];
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.onChange = function (event) {
        var _this = this;
        document.getElementById('extErrorMsg').classList.add('d-none');
        this.basefile = undefined;
        this.attachment_file = event.srcElement.files[0];
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(this.attachment_file.name)[1];
        var fileReader = new FileReader();
        var base64;
        if (ext == 'xlsx' || ext == 'xls') {
            fileReader.onload = function (fileLoadedEvent) {
                base64 = fileLoadedEvent.target;
                _this.basefile = base64.result;
            };
        }
        else {
            document.getElementById('extErrorMsg').classList.remove('d-none');
        }
        fileReader.readAsDataURL(this.attachment_file);
    };
    SalesLeadMgmtComponent.prototype.submitExcelUpload = function () {
        var _this = this;
        this.loaderService.display(true);
        this.salesService.uploadLeadExcel(this.basefile, this.sourceOfBulkLeads, this.typeOfBulkLeads, this.campignOfBulkLeads, this.referrer_id, this.referrer_type, this.salesmanagerId)
            .subscribe(function (res) {
            $('#exampleModal').modal('hide');
            $('#LeadsReportUpload').modal('show');
            _this.LeadsReport = res.data;
            _this.getFiletredLeadsForSales(1);
            _this.loaderService.display(false);
            _this.sourceOfBulkLeads = "";
            _this.typeOfBulkLeads = "";
            _this.campignOfBulkLeads = "";
            _this.referrer_id = "";
            _this.referrer_type = "";
            _this.basefile = undefined;
            _this.successMessage = "leads Report ";
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 5000);
        }, function (error) {
            _this.loaderService.display(false);
            _this.erroralert = true;
            _this.errorMessage = JSON.parse(error['_body']).message;
            setTimeout(function () {
                this.erroralert = false;
            }.bind(_this), 5000);
        });
    };
    SalesLeadMgmtComponent.prototype.getReferrersList = function (page, search) {
        var _this = this;
        this.loaderService.display(true);
        this.salesService.getReferrersList(this.sales_id, page, search).subscribe(function (res) {
            res = res.json();
            _this.referreresList = res['users'];
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.getSocietyList = function (city_name, note_records) {
        var _this = this;
        var society_search_word = "";
        if (note_records && (note_records.society && note_records.society != 'Others')) {
            society_search_word = note_records.society;
        }
        //   note records api
        this.leadService.getLocalityBuildingDetails(city_name, society_search_word).subscribe(function (res) {
            _this.societyList = res.building_crawlers;
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.changebuilding = function (value, typeofForm) {
        this.buildingObj = value;
        console.log(value);
        if (typeofForm === 'create') {
            if (value == "Others") {
                this.societyOthersValue = true;
                this.addLeadForm.controls['new_society_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.addLeadForm.controls["new_society_value"].updateValueAndValidity();
            }
            else {
                this.societyOthersValue = false;
                var societyId = value.id;
                this.addLeadForm.controls['building_crawler_id'].setValue(societyId);
                this.addLeadForm.controls['society'].setValue(value.building_name);
                this.addLeadForm.controls['location'].setValue(value.locality);
                this.addLeadForm.controls["new_society_value"].clearValidators();
                this.addLeadForm.controls["new_society_value"].updateValueAndValidity();
                this.getSocietyWebData(societyId);
            }
        }
        else {
            if (value == "Others") {
                this.societyOthersValue = true;
                this.updateLeadForm.controls['new_society_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
            }
            else {
                this.societyOthersValue = false;
                var societyId = value.id;
                this.updateLeadForm.controls['building_crawler_id'].setValue(societyId);
                this.updateLeadForm.controls['society'].setValue(value.building_name);
                this.updateLeadForm.controls['location'].setValue(value.locality);
                this.updateLeadForm.controls["new_society_value"].clearValidators();
                this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
                this.updateLeadForm.controls['location'].setValue(value.locality);
                this.getSocietyWebData(societyId);
            }
        }
    };
    SalesLeadMgmtComponent.prototype.onchangeCity = function (event, typeofForm) {
        var city = event;
        if (typeofForm === 'create') {
            if (city == 'Others') {
                this.cityChangeValue = true;
                this.addLeadForm.controls['new_city_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.addLeadForm.controls["new_city_value"].updateValueAndValidity();
            }
            else {
                // this.societyList = [];
                // this.addLeadForm.controls['society'].setValue('')
                this.getSocietyList(city, '');
                this.addLeadForm.controls["new_city_value"].clearValidators();
                this.addLeadForm.controls["new_city_value"].updateValueAndValidity();
                this.cityChangeValue = false;
            }
        }
        else {
            if (city == "Others") {
                this.cityChangeValue = true;
                this.updateLeadForm.controls['new_city_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
            }
            else {
                this.getSocietyList(city, '');
                this.cityChangeValue = false;
                this.updateLeadForm.controls['new_city_value'].clearValidators();
                this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
            }
        }
    };
    SalesLeadMgmtComponent.prototype.changeLocality = function (event, typeofForm) {
        var locality = event;
        if (typeofForm === 'create') {
            if (locality == "Others") {
                this.locationOthersValue = true;
                this.addLeadForm.controls['new_locality_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.addLeadForm.controls["new_locality_value"].updateValueAndValidity();
            }
            else {
                this.locationOthersValue = false;
                this.addLeadForm.controls['new_locality_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.addLeadForm.controls["new_locality_value"].updateValueAndValidity();
            }
        }
        else {
            if (locality == "Others") {
                this.locationOthersValue = true;
                this.updateLeadForm.controls['new_locality_value'].setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
                this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
            }
            else {
                this.locationOthersValue = false;
                this.updateLeadForm.controls['new_locality_value'].clearValidators();
                this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
            }
        }
    };
    SalesLeadMgmtComponent.prototype.getSocietyWebData = function (society) {
        var _this = this;
        this.loaderService.display(true);
        this.localityWebData = null;
        this.leadService.getSocietyWebData(society).subscribe(function (res) {
            _this.localityWebData = res;
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.getCitiesForQuestionnaire = function () {
        var _this = this;
        this.loaderService.display(true);
        this.leadService.getCitiesForQuestionnaire().subscribe(function (res) {
            _this.citiesForQuestionnaire = res.cities;
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.closeModal = function (msg) {
        this.leadIDForModal = undefined;
        this.customerNameModal = undefined;
        this.customerphoneForModal = undefined;
        this.userQuestionnaireDetails = undefined;
        // this.city_others = undefined;
        this.leaddetailsForModal = undefined;
        $("#questionnaireModal").modal("hide");
        if (msg) {
            this.getFiletredLeadsForSales(1);
            this.successalert = true;
            this.successMessage = msg;
            setTimeout(function () {
                this.successalert = false;
            }.bind(this), 10000);
        }
    };
    SalesLeadMgmtComponent.prototype.passDataToModal = function (LeadIDForModal, customerName, phone, data) {
        this.leadIDForModal = LeadIDForModal;
        this.customerNameModal = customerName;
        this.customerphoneForModal = phone;
        this.leaddetailsForModal = data;
    };
    SalesLeadMgmtComponent.prototype.closeModalAddLead = function () {
        this.addLeadForm.reset();
        this.cityChangeValue = false;
        this.societyOthersValue = false;
        this.locationOthersValue = false;
        this.addLeadForm.controls["city"].setValue("");
        this.addLeadForm.controls["location"].setValue("");
        this.addLeadForm.controls["society"].setValue("");
        this.addLeadForm.controls['send_to_cs_agent'].setValue(true);
        // this.addLeadForm.controls["new_society_value"].clearValidators();
        // for (const key in this.addLeadForm.controls) {
        // 	this.addLeadForm.get(key).clearValidators();
        // 	this.addLeadForm.get(key).updateValueAndValidity();
        // }
    };
    SalesLeadMgmtComponent.prototype.closeEditModal = function () {
        for (var key in this.addLeadForm.controls) {
            this.addLeadForm.get(key).clearValidators();
            this.addLeadForm.get(key).updateValueAndValidity();
        }
    };
    SalesLeadMgmtComponent.prototype.setLeadStatus = function (value) {
        if (value == "follow_up") {
            this.updateLeadForm.get("follow_up_time").setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
            this.updateLeadForm.get("remark").setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
            this.updateLeadForm.get("follow_up_time").updateValueAndValidity();
            this.updateLeadForm.get("remark").updateValueAndValidity();
        }
        else if (value == 'lost') {
            this.updateLeadForm.get("lost_reason").setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
            this.updateLeadForm.get("lost_remark").setValidators(__WEBPACK_IMPORTED_MODULE_6__angular_forms__["k" /* Validators */].required);
            this.updateLeadForm.get("lost_reason").updateValueAndValidity();
            this.updateLeadForm.get("lost_remark").updateValueAndValidity();
        }
        else {
            this.updateLeadForm.get("lost_reason").clearValidators();
            this.updateLeadForm.get("lost_remark").clearValidators();
            this.updateLeadForm.get("lost_reason").updateValueAndValidity();
            this.updateLeadForm.get("lost_remark").updateValueAndValidity();
            this.updateLeadForm.get("follow_up_time").clearValidators();
            this.updateLeadForm.get("remark").clearValidators();
            this.updateLeadForm.get("follow_up_time").updateValueAndValidity();
            this.updateLeadForm.get("remark").updateValueAndValidity();
        }
    };
    SalesLeadMgmtComponent.prototype.resetValues = function () {
        if (this.role2 == 'area_sales_manager' || this.role2 == 'sales_manager') {
            this.addLeadForm.controls['email'].clearValidators();
        }
        this.closeModalAddLead();
        this.listAllSalesManager();
        this.editorCreate = 'create';
    };
    SalesLeadMgmtComponent.prototype.callChangeNew1 = function () {
        $(".date-picker")
            .datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            dateFormat: "mm/yy",
            minDate: "+6M",
            onClose: function (dateText, inst) {
                function isDonePressed() {
                    return ($("#ui-datepicker-div")
                        .html()
                        .indexOf("ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover") > -1);
                }
                if (isDonePressed()) {
                    var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                    var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                    $(this).datepicker("setDate", new Date(year, month, 1));
                }
            },
        })
            .focus(function () {
            $("#startDateNew", "#startDateNewpro").datepicker("show");
        })
            .focus();
    };
    SalesLeadMgmtComponent.prototype.openPDFMpdal = function (data) {
        $('#additionalAppDetails').modal('show');
        this.singlePDFData = data;
        console.log(this.singlePDFData);
    };
    SalesLeadMgmtComponent.prototype.getCmList = function () {
        var _this = this;
        this.loaderService.display(true);
        this.leadService.getCmList().subscribe(function (res) {
            _this.cmlistArr = res.community_managers;
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    SalesLeadMgmtComponent.prototype.assignCmToLead = function (leadid, index, cmId, designerId) {
        var _this = this;
        this.assigneLeadId = leadid;
        this.assigneIndex = index;
        if (this.assignedCMIds[index] != undefined &&
            this.assignedCMIds[index] != "Assign To CM") {
            this.loaderService.display(true);
            this.leadService
                .assignCmToLead(this.assignedCMIds[index], leadid, cmId, designerId)
                .subscribe(function (res) {
                if (res.community_managers) {
                    _this.cmlistArr = res.community_managers;
                    _this.loaderService.display(false);
                    $("#AssignModal").modal("show");
                }
                else {
                    Object.keys(res).map(function (key) {
                        res = res[key];
                    });
                    _this.assignedCMIds[index] = undefined;
                    _this.getFiletredLeadsForSales(1);
                    _this.loaderService.display(false);
                    _this.successalert = true;
                    _this.designerId = "";
                    $("#AssignModal").modal("hide");
                    _this.successMessage = "Assigned Successfully !!";
                    _this.resetDropDown();
                    $(window).scrollTop(0);
                    setTimeout(function () {
                        this.successalert = false;
                    }.bind(_this), 5000);
                }
            }, function (error) {
                _this.erroralert = true;
                _this.errorMessage = JSON.parse(error["_body"]).message;
                _this.loaderService.display(false);
                $(window).scrollTop(0);
                setTimeout(function () {
                    this.erroralert = false;
                }.bind(_this), 5000);
            });
        }
        else {
            document
                .getElementById("assigncmdropdown" + leadid)
                .classList.add("inputBorder");
        }
    };
    SalesLeadMgmtComponent.prototype.onCMDropdownChange = function (leadid, cmid, rowid) {
        this.assignedCMIds[rowid] = cmid;
        if (this.assignedCMIds[rowid] != undefined &&
            this.assignedCMIds[rowid] != "Assign To CM") {
            document
                .getElementById("assigncmdropdown" + leadid)
                .classList.remove("inputBorder");
        }
    };
    SalesLeadMgmtComponent.prototype.resetDropDown = function () {
        this.assignDesignerId = "";
    };
    SalesLeadMgmtComponent.prototype.assignCmToLeadTwo = function (cmId, designerId) {
        this.designerId = "";
        if (designerId != -1 &&
            cmId != -1 &&
            designerId != undefined &&
            cmId != undefined &&
            cmId != "" &&
            designerId != "") {
            this.assignCmToLead(this.assigneLeadId, this.assigneIndex, cmId, designerId);
        }
        else {
            alert("Select Designer And CM And Then Submit");
        }
    };
    SalesLeadMgmtComponent.prototype.viewLeadLog = function (leadId, rowID) {
        var _this = this;
        this.loaderService.display(true);
        this.salesService.getLeadLogs(leadId, true).subscribe(function (res) {
            Object.keys(res).map(function (key) {
                _this.lead_logs = res[key];
            });
            _this.filtered_logs = _this.lead_logs.change_log;
            var temp_email = [];
            for (var _i = 0, _a = _this.lead_logs.change_log; _i < _a.length; _i++) {
                var log = _a[_i];
                if (log.whodunnit !== "" && log.whodunnit !== null) {
                    if (!temp_email.includes(log.whodunnit)) {
                        var json = {
                            name: log.name,
                            email: log.whodunnit,
                            image: log.user_image,
                        };
                        _this.log_owners.push(json);
                        temp_email.push(log.whodunnit);
                    }
                }
            }
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    // Change sort function to this:
    SalesLeadMgmtComponent.prototype.sortlog = function (property, sort) {
        if (sort == "oldest") {
            $(".dropdownButton2").html("Oldest First");
            this.isDesclog = true; //change the direction
        }
        else if (sort == "newest") {
            $(".dropdownButton2").html("Newest First");
            this.isDesclog = false; //change the direction
        }
        this.columnlog = property;
        this.directionlog = this.isDesclog ? 1 : -1;
    };
    SalesLeadMgmtComponent.prototype.filterLogs = function (e, filter) {
        if (filter === void 0) { filter = "all"; }
        var arr = [];
        $(".dropdownButton1").html('<img src="' +
            e.srcElement.childNodes[1].currentSrc +
            '" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>' +
            e.srcElement.childNodes[2].nodeValue +
            "</span>");
        if (filter == "all") {
            this.filtered_logs = this.lead_logs.change_log;
        }
        else {
            for (var _i = 0, _a = this.lead_logs.change_log; _i < _a.length; _i++) {
                var log = _a[_i];
                if (log.whodunnit == filter) {
                    arr.push(log);
                }
            }
            this.filtered_logs = arr;
        }
    };
    SalesLeadMgmtComponent.prototype.clearLogs = function () {
        this.lead_logs = undefined;
        this.filtered_logs = [];
        this.log_owners = [];
        $(".dropdownButton1").html('<img src="../../assets/img/images/original/missing.png" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>All (logs)</span>');
    };
    SalesLeadMgmtComponent.prototype.listAllSalesManager = function () {
        var _this = this;
        this.leadService.getSalesManagerList().subscribe(function (res) {
            console.log(res);
            console.log(res);
            _this.list_salesManager = res;
        }, function (err) {
            console.log(err);
        });
    };
    SalesLeadMgmtComponent.prototype.searchSocietyApi = function ($event) {
        var _this = this;
        this.isApifired = true;
        console.log(this.isApifired);
        this.typeSelectAddress = '';
        this.isSelected = false;
        var searchWord = $event.target.value;
        this.leadService.getSocietyWebapi(searchWord).subscribe(function (res) {
            _this.filteredOptions = res.result;
            console.log(_this.filteredOptions);
        }, function (err) {
            _this.filteredOptions = [];
        });
    };
    SalesLeadMgmtComponent.prototype.selectOption = function (address) {
        this.typeSelectAddress = address;
        if (address == 'other') {
            if (this.editorCreate == 'create') {
                this.addLeadForm.controls['city'].setValue('');
                this.addLeadForm.controls['location'].setValue('Others');
                this.addLeadForm.controls['city'].setValue('');
                this.addLeadForm.controls['pincode'].setValue('');
                this.addLeadForm.controls['aide_apartment_id'].setValue('');
                this.addLeadForm.controls['new_locality_value'].setValue('');
                this.addLeadForm.controls['new_society_value'].setValue('');
                this.addLeadForm.controls['new_city_value'].setValue('');
                this.filteredOptions = [];
                this.projectName = this.addLeadForm.controls['society'].value;
            }
            else {
                this.updateLeadForm.controls['city'].setValue('');
                this.updateLeadForm.controls['location'].setValue('Others');
                this.updateLeadForm.controls['city'].setValue('');
                this.updateLeadForm.controls['pincode'].setValue('');
                this.updateLeadForm.controls['aide_apartment_id'].setValue('');
                this.updateLeadForm.controls['new_locality_value'].setValue('');
                this.updateLeadForm.controls['new_society_value'].setValue('');
                this.updateLeadForm.controls['new_city_value'].setValue('');
                this.filteredOptions = [];
                this.projectName = this.updateLeadForm.controls['society'].value;
            }
            this.DeveloperName = '';
            this.pincodePro = '';
            this.FullAdress = '';
            this.citynamePro = '';
            $('#citygoogle2').val('');
            $('#pincodegoogle2').val('');
            $('#OtherProjectname2').modal('show');
            this.initMap();
        }
        else {
            var apar_id = void 0;
            if (address.configuration.length > 0) {
                apar_id = address.configuration[0].apartment_id;
            }
            else {
                apar_id = address.id;
            }
            if (this.editorCreate == 'create') {
                this.addLeadForm.controls['society'].setValue(address.apartment_name);
                this.addLeadForm.controls['city'].setValue(address.city);
                this.addLeadForm.controls['location'].setValue(address.area_name);
                this.addLeadForm.controls['new_locality_value'].setValue('');
                this.addLeadForm.controls['aide_apartment_id'].setValue(apar_id);
                this.addLeadForm.controls['pincode'].setValue(address.pincode);
                this.addLeadForm.controls['new_society_value'].setValue('');
            }
            else {
                this.updateLeadForm.controls['society'].setValue(address.apartment_name);
                this.updateLeadForm.controls['city'].setValue(address.city);
                this.updateLeadForm.controls['location'].setValue(address.area_name);
                this.updateLeadForm.controls['new_locality_value'].setValue('');
                this.updateLeadForm.controls['aide_apartment_id'].setValue(apar_id);
                this.updateLeadForm.controls['pincode'].setValue(address.pincode);
                this.updateLeadForm.controls['new_society_value'].setValue('');
            }
        }
        this.isSelected = true;
        this.isApifired = false;
        this.filteredOptions = [];
    };
    SalesLeadMgmtComponent.prototype.initMap = function () {
        var vm = this;
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete-input2'), { types: ['geocode', 'establishment'],
        });
        autocomplete.addListener('place_changed', function () {
            var selectedPlace = autocomplete.getPlace();
            if (selectedPlace && selectedPlace.address_components) {
                var city = selectedPlace.address_components.find(function (component) {
                    return component.types.includes('locality');
                });
                var postalCode = selectedPlace.address_components.find(function (component) {
                    return component.types.includes('postal_code');
                });
                var completeAddress = selectedPlace.formatted_address;
                var areaName = selectedPlace.address_components.filter(function (component) { return component.types.includes('sublocality'); });
                var concatenatedNames = areaName.map(function (component) { return component.long_name; }).join(', ');
                areaName = concatenatedNames;
                console.log(areaName, 'areaname');
                areaName ? $('#areaname2').val(areaName) : $('#areaname2').val(completeAddress);
                $('#autocomplete-input2').val(completeAddress);
                if (city) {
                    var cityname = city.long_name;
                    console.log('Selected city:', cityname);
                    vm.citynamePro = cityname;
                    $('#citygoogle2').val(cityname);
                    console.log(vm.citynamePro);
                }
                if (postalCode) {
                    var postalCodeValue = postalCode.long_name;
                    console.log('Selected postal code:', postalCodeValue);
                    $('#pincodegoogle2').val(postalCodeValue);
                    // Assign the city name and postal code to variables or do any other processing
                }
                else {
                    $('#pincodegoogle2').val('');
                }
                console.log($('#pincodegoogle2').val());
            }
        });
    };
    SalesLeadMgmtComponent.prototype.pincodeval = function () {
        console.log($('#pincodegoogle2').val(), 'ta');
        this.pincodePro = $('#pincodegoogle2').val();
    };
    SalesLeadMgmtComponent.prototype.Submitapart = function () {
        $('#OtherProjectname2').modal('hide');
        console.log($('#autocomplete-input2').val());
        if (this.editorCreate == 'create') {
            this.addLeadForm.controls['location'].setValue($('#areaname2').val());
            this.addLeadForm.controls['city'].setValue($('#citygoogle2').val());
            this.addLeadForm.controls['new_locality_value'].setValue(this.FullAdress);
            this.addLeadForm.controls['pincode'].setValue($('#pincodegoogle2').val());
            this.addLeadForm.controls['society'].setValue(this.projectName);
        }
        else {
            this.updateLeadForm.controls['location'].setValue($('#areaname2').val());
            this.updateLeadForm.controls['city'].setValue($('#citygoogle2').val());
            this.updateLeadForm.controls['new_locality_value'].setValue(this.FullAdress);
            this.updateLeadForm.controls['pincode'].setValue($('#pincodegoogle2').val());
            this.updateLeadForm.controls['society'].setValue(this.projectName);
        }
        console.log(this.addLeadForm.controls['location'].value, $('#autocomplete-input2').val());
        if (this.typeSelectAddress == 'other') {
            this.CreateApartment();
        }
    };
    SalesLeadMgmtComponent.prototype.CreateApartment = function () {
        var _this = this;
        var address = this.addLeadForm.controls['location'].value;
        var pincodeRegex = /\b\d{6}\b/;
        // Use the match method to find the first match of the regex pattern in the string
        var pincodeMatch = address.match(pincodeRegex);
        // Check if a match is found
        if (pincodeMatch) {
            // Extracted PIN code
            var pincode = pincodeMatch[0];
        }
        else {
            pincode = '';
        }
        var obj;
        if (this.editorCreate == 'create') {
            obj = {
                "rera_number": "",
                "project_name": this.projectName,
                "full_address": $('#autocomplete-input2').val(),
                "project_developer": this.DeveloperName,
                "pincode": this.addLeadForm.controls['pincode'].value,
                "area_name": $('#areaname2').val(),
                "city": this.addLeadForm.controls['city'].value,
                "state": ""
            };
        }
        else {
            obj = {
                "rera_number": "",
                "project_name": this.projectName,
                "full_address": $('#autocomplete-input2').val(),
                "project_developer": this.DeveloperName,
                "pincode": this.updateLeadForm.controls['pincode'].value,
                "area_name": $('#areaname2').val(),
                "city": this.updateLeadForm.controls['city'].value,
                "state": ""
            };
        }
        this.leadService.CreateApar(obj).subscribe(function (Res) {
            if (_this.editorCreate == 'create') {
                _this.addLeadForm.controls['aide_apartment_id'].setValue(Res.result[0].apartment_id);
            }
            else {
                _this.updateLeadForm.controls['aide_apartment_id'].setValue(Res.result[0].apartment_id);
            }
            _this.successalert = true;
            _this.successMessage = "Apartment Created Successfully";
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 5000);
        }, function (err) {
            _this.erroralert = true;
            _this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function () {
                this.erroralert = false;
            }.bind(_this), 5000);
        });
    };
    SalesLeadMgmtComponent.prototype.closeaddApartmentrplanModal = function () {
        $('#OtherProjectname2').modal('hide');
        this.setUpdatedLead(this.editData);
    };
    SalesLeadMgmtComponent.prototype.arrayjoin = function (value) {
        return value ? value.join(', ') : '';
    };
    SalesLeadMgmtComponent.prototype.modalexcell = function () {
        if (this.role2 == 'area_sales_manager') {
            this.salesmanagerId = '';
        }
        else {
            this.salesmanagerId = null;
        }
        console.log(this.salesmanagerId, "asm");
        this.sourceOfBulkLeads = '';
        this.typeOfBulkLeads = '';
        this.basefile = undefined;
        this.resetFileInput();
    };
    SalesLeadMgmtComponent.prototype.resetFileInput = function () {
        if (this.attachmentFileInput) {
            this.attachmentFileInput.nativeElement.value = '';
        }
    };
    SalesLeadMgmtComponent.prototype.hideOptions = function () {
        this.isApifired = false;
    };
    SalesLeadMgmtComponent.prototype.showOptions = function () {
        this.isApifired = true;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('attachmentFileInput'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], SalesLeadMgmtComponent.prototype, "attachmentFileInput", void 0);
    SalesLeadMgmtComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-sales-lead-mgmt',
            template: __webpack_require__("./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.html"),
            styles: [__webpack_require__("./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_1__sales_manager_service__["a" /* SalesManagerService */], __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__["a" /* LeadService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__["a" /* LeadService */],
            __WEBPACK_IMPORTED_MODULE_1__sales_manager_service__["a" /* SalesManagerService */],
            __WEBPACK_IMPORTED_MODULE_4__services_loader_service__["a" /* LoaderService */],
            __WEBPACK_IMPORTED_MODULE_6__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_5__angular_common__["Location"]])
    ], SalesLeadMgmtComponent);
    return SalesLeadMgmtComponent;
}());



/***/ }),

/***/ "./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.css":
/***/ (function(module, exports) {

module.exports = ".filterBtn {\n    background: #af0010;\n    color: #fff;\n    padding: 0px 11px;\n    border-radius: 4px;\n    border: none;\n    vertical-align: top;\n}\n.ss-text-light\n{\n  vertical-align: -webkit-baseline-middle;\n  cursor: pointer;\n}\n.ss-text-dark{\n    vertical-align: -webkit-baseline-middle;\n}\n.table td{\n    padding: 0.7rem 0.75rem;\n    vertical-align: middle;\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.7);\n    border: none;\n}\n.minWidthForTd{\n  min-width: 185px;\n}\n.table th {\n    padding: .9rem;\n    vertical-align: middle;\n    border: none;\n    font-size: 12px;\n    text-transform: uppercase;\n    color: #fff;\n    background-color: #5A5A5A;\n}\n.table{\n  border-collapse: separate;\n  border-spacing: 0 5px;\n}\n.tableDiv tbody{\n  background-color: #fff;\n}\n.tableDiv{\n  overflow-x:scroll;\n}\n.tableDiv tbody tr{\n  -webkit-box-shadow: 1px 1px 7px 0px #dadada;\n          box-shadow: 1px 1px 7px 0px #dadada;\n  border-radius: 5px;\n}\n.firstTh{\n  border-radius: 5px 0 0 0;\n}\n.lastTh{\n  border-radius: 0px 5px 0 0;\n}\n.custom-class-dropdown .c-btn{\n    font-size:12px;\n    font-weight: bold;\n}\n/*.selected-list[_ngcontent-c7] .c-btn[_ngcontent-c7]{\n    font-size: 10px;\n}*/\n.custom-class-dropdown .dropdown-list{\n    width: auto;\n    font-size: 12px;\n}\n.filterRow{\n  background-color: #fff;\n}\n.filterRow .col-sm-11 {\n  padding: 10px 10px;\n}\n.filterRow .col-sm-11 .row{\n  margin-left: 0px; margin-right: 0px;\n}\n.filterRow .row .col-sm-1{\n  padding: 10px 10px 0px 0px;\n   border-left: 1px solid #d3d3d3;\n}\n.sendIcon{\n  height: 25px;\n  margin-top: -3px;\n}\n.inputBorder {\n    border-color: red;\n}\n.modalTitle{\n    padding: 10px 18px;\n    position: relative;\n    bottom: -17px;\n    background: #fff;\n    color: #848484;\n    font-size: 16px;\n    font-weight: normal;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n}\n#leadDetailsModal .modal-header, #questionnaireModal .modal-header, #exampleModal .modal-header\n, #logModal .modal-header{\n     background: #F4f4f4;\n    padding-top: 0px;\n}\n#leadDetailsModal label, #questionnaireModal label, #exampleModal label,\n#logModal label{\n    color: #848484;\n}\n#leadDetailsModal .form-control, #questionnaireModal .form-control, #exampleModal .form-control{\n    font-size: 13px;\n}\n#editLeadModal .modal-header{\n     background: #F4f4f4;\n    padding-top: 0px;\n}\n#editLeadModal label{\n    color: #848484;\n}\n#editLeadModal .form-control{\n    font-size: 13px;\n}\n.modal{\n     padding-top: 39px;\n}\n.rk-interalBtnColor{\n    width: 142px;\n}\n.labelColor{\n    color: #515151 !important;\n}\n.lableSize{\n    font-size: 14px;\n}\n/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/\n.chnglink{\n  color:#6a6ad0 !important;\n}\n.chnglink:hover{\n  text-decoration:underline;\n}\n.am-chng{\n  border-radius: 2px;\n}\n.rk-btnCancel{\n  background-color: white;\n}\n.btn-outline-primary:hover{\n  background-color:#8C031F;\n  border-color: #8C031F;\n}\n.leadDetailsMainDiv{\n  background-color: #fff;\n  margin-top: 1.8rem;\n}\n.borderBottom{\n  border-bottom: 1px solid #f1f1f1;\n}\n.customRow{\n  background-color: #fff;\n  height: 3.7rem;\n}\n.customRow img{\n  border-radius: 50px;\n  width: 62%;\n  margin-top: 13px;\n  -webkit-box-shadow: 0 0 0px 2px #ccc;\n          box-shadow: 0 0 0px 2px #ccc;\n}\n.vPara{\n  font-size: 18px;\n  color: #000;\n}\n.vDate{\n  font-size: 10px;\n}\n.cusDownArrow{\n  float: right;\n  margin-top: -8px;\n  font-size: 18px;\n  margin-right: 10px;\n}\n.vColor{\n  color: #888;\n  font-weight: 100;\n}\n.vColor1{\n  color: #5a5a5a;\n  font-weight: 100;\n}\n.fontSize14{\n  font-size: 14px;\n}\n.dropdownButton{\n  padding: 5px 12px;\n  width: 10rem;\n  border: none;\n  font-size: 16px;\n  cursor: pointer;\n  outline: none;\n  color: #515151;\n  text-align: left;\n}\n.dropdownButton.dropdownButton1{\n  width: 14rem;\n}\n.dropdown-item.dropdown-item1{\n  padding: 0px 10px;\n}\n.dropdown-toggle1::after{\n  float: right;\n  margin-top: 10px;\n}\n.myFluit{\n  border-radius: 50px;\n  width: 1.5rem;\n  -webkit-box-shadow: 0 0 0px 2px #ccc;\n          box-shadow: 0 0 0px 2px #ccc;\n}\n.dropdownMenu.show{\n  width: 14rem;\n  border: 1px solid #e8e8e8;\n}\n#logModal .modal-dialog{\n  max-width: 82%;\n  left:113px;\n}\n.filterRowIcon{\n      height: 38px;\n    position: relative;\n    left: -7px;\n    top: 3px;\n    cursor: pointer;\n}\n.ss-searchbox{\n  padding: 7px 10px 7px 10px;\n  margin-left: 10px;\n}\n.ss-searchbox i{\n  font-size: 13px;\n}\n.ss-searchbox input{\n      padding: 0 0.5rem;\n}\n/*  @@@@@@@@@@@@@@@@@@@*/\n.tabs-chng{\n  border-bottom: none;\n}\n.itm-chng{\n  width: 87px;\n  font-size: 12px;\n}\n.filterRow{\n  -webkit-box-shadow: 0 0 10px #bbb4b4;\n          box-shadow: 0 0 10px #bbb4b4;\n  border-radius: 5px;\n  min-height: 55px;\n}\n.frm-chng{\n  border: 1px solid rgba(241, 237, 237, 0.15);\n  font-size: 0.8rem;\n  margin-top: -3px;\n  width: 108%;\n  cursor: pointer;\n}\n.frm-chng::-webkit-input-placeholder { /* Chrome */\n  color: black;\n  font-size: 16px;\n  font-family:  \"Roboto\";\n  font-weight: bold;\n}\n.frm-chng:-ms-input-placeholder { /* IE 10+ */\n  color: black;\n}\n.frm-chng::-moz-placeholder { /* Firefox 19+ */\n  color: black;\n  opacity: 1;\n}\n.frm-chng:-moz-placeholder { /* Firefox 4 - 18 */\n  color: black;\n  opacity: 1;\n}\n.fromDate,.toDate{\n  display: none;\n}\n.boq-img{\n  text-align: center;\n}\ninput.frm-chng::-webkit-input-placeholder{ \n  font-family:fontAwesome; \n  font-size:12px; \n  color: black;\n   }\ninput.frm-chng::-ms-input-placeholder{ \n  font-family:fontAwesome; \n  font-size:12px; \n  color: black;\n   }\ninput.frm-chng::placeholder{ \n  font-family:fontAwesome; \n  font-size:12px; \n  color: black;\n   }\ninput.frm-chng{ \n  font-family:  \"Roboto\";\n }"

/***/ }),

/***/ "./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row ss-top-menu\">\n  <div class=\"col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-8\">\n    <span class=\"ss-text-light\"\n      [routerLink]=\"['/']\">Dashboard <i class=\"rightArrow fa fa-angle-right\"></i></span>\n      <span class=\"ss-text-dark\">All Referrers</span>\n    </div>\n  <div class=\"col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4\">\n    <input class=\"form-control\" type=\"text\" placeholder=\"Type in name, contact, status, role, date, designer to search...\" #search (keyup.enter)=\"onKey($event)\">\n  </div>\n</div>\n\n<div class=\"rk-ui-notification err\" *ngIf=\"erroralert\"  style=\"z-index: 10000;\">\n  <span id=\"notificationMessageText\">{{errorMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"erroralert=false\">×</a>\n</div>\n<div class=\"rk-ui-notification\" *ngIf=\"successalert\"  style=\"z-index: 10000;\">\n  <span id=\"notificationMessageText\">{{successMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"successalert=false\">×</a>\n</div>\n<div class=\"row mt-5 px-5\">\n  <div class=\"col-md-12\">\n    <div class=\"tableDiv table-responsive\">\n      <table class=\"table\" *ngIf=\"referreresList && referreresList.length >0\">\n        <thead>\n          <tr>\n            <th class=\"firstTh\">#</th>\n            <th>Name</th>\n            <th>Email</th>\n            <th>Contact</th>\n            <th>Role</th>\n            <th>Sales Manager</th>\n            <!-- <th>Assigned SM</th> -->\n            <!-- <th >Assign SM</th> -->\n            <th class=\"lastTh\"></th>\n          </tr>\n        </thead>\n        <tbody>\n\n         <tr *ngFor=\"let refer of referreresList | paginate: { itemsPerPage: per_page, currentPage: current_page, totalItems: total_page  }; let i = index\" [attr.data-index]=\"i\">\n         \t<td>{{i+1}}</td>\n         \t<td>{{refer.name}}</td>\n         \t<td>{{refer.email}}</td>\n          <td>{{refer.contact}}</td>\n          <td>\n            <ng-container *ngFor=\"let rol of refer.roles\">\n              <span class=\"capitalize\">{{ rol | underScore }}</span>\n             </ng-container> \n            \n          </td>\n          <td>{{refer.sales_manager.name}} <br>\n            ({{refer.sales_manager.email}})\n          </td>\n\n         \t\n          <!-- <td>\n            <span *ngIf=\"refer.sales_manager\">{{refer.sales_manager.email}}</span>\n          </td> -->\n         <td></td>\t\n         </tr>\n        </tbody>\n      </table>\n      <div class=\"text-center\" *ngIf=\"referreresList && referreresList.length >0\">\n          <pagination-controls autoHide=\"true\" (pageChange)=\"current_page = getReferrersList($event)\"></pagination-controls>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-12 not-found \" *ngIf=\"referreresList && referreresList.length==0 \">\n    <div class=\"boq-img\">\n      <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n    </div>\n    <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SalesReferrersComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sales_manager_service__ = __webpack_require__("./src/app/platform/salesmanager/sales-manager.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__ = __webpack_require__("./src/app/platform/lead/lead.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SalesReferrersComponent = /** @class */ (function () {
    function SalesReferrersComponent(route, leadService, salesmanagerService, loaderService, formBuilder, router, location) {
        this.route = route;
        this.leadService = leadService;
        this.salesmanagerService = salesmanagerService;
        this.loaderService = loaderService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.location = location;
        this.referreresList = [];
        this.successalert = false;
        this.erroralert = false;
        this.rolesList = [];
    }
    SalesReferrersComponent.prototype.ngOnInit = function () {
        this.user_id = localStorage.getItem('userId');
        this.getReferrersList(1);
    };
    SalesReferrersComponent.prototype.getReferrersList = function (page, search) {
        var _this = this;
        this.salesmanagerService.getReferrersList(this.user_id, page, search).subscribe(function (res) {
            _this.headers_res = res.headers._headers;
            _this.per_page = _this.headers_res.get('x-per-page');
            _this.total_page = _this.headers_res.get('x-total');
            _this.current_page = _this.headers_res.get('x-page');
            res = res.json();
            _this.referreresList = res['users'];
            for (var i = 0; i < _this.referreresList.length; i++) {
                _this.rolesList.push(_this.referreresList[i].roles);
            }
        }, function (err) {
        });
    };
    SalesReferrersComponent.prototype.onKey = function (event) {
        this.search_value = event.target.value;
        var i = 0;
        if (true) {
            this.getReferrersList('', this.search_value);
            i++;
        }
    };
    SalesReferrersComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-sales-referrers',
            template: __webpack_require__("./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.html"),
            styles: [__webpack_require__("./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_1__sales_manager_service__["a" /* SalesManagerService */], __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__["a" /* LeadService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_2__lead_lead_service__["a" /* LeadService */],
            __WEBPACK_IMPORTED_MODULE_1__sales_manager_service__["a" /* SalesManagerService */],
            __WEBPACK_IMPORTED_MODULE_4__services_loader_service__["a" /* LoaderService */],
            __WEBPACK_IMPORTED_MODULE_6__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_5__angular_common__["Location"]])
    ], SalesReferrersComponent);
    return SalesReferrersComponent;
}());



/***/ }),

/***/ "./src/app/platform/salesmanager/salesmanager-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SalesmanagerRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__ = __webpack_require__("./src/app/authentication/logged-in-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sales_manager_service__ = __webpack_require__("./src/app/platform/salesmanager/sales-manager.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sales_lead_mgmt_sales_lead_mgmt_component__ = __webpack_require__("./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dashboard_dashboard_component__ = __webpack_require__("./src/app/platform/salesmanager/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sales_referrers_sales_referrers_component__ = __webpack_require__("./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var routes = [
    {
        path: 'dashboard',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_5__dashboard_dashboard_component__["a" /* DashboardComponent */]
    },
    {
        path: 'sales/sales-leads',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_4__sales_lead_mgmt_sales_lead_mgmt_component__["a" /* SalesLeadMgmtComponent */]
    },
    {
        path: 'lead-list',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_4__sales_lead_mgmt_sales_lead_mgmt_component__["a" /* SalesLeadMgmtComponent */]
    },
    {
        path: 'referrer-list',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_6__sales_referrers_sales_referrers_component__["a" /* SalesReferrersComponent */]
    },
];
var SalesmanagerRoutingModule = /** @class */ (function () {
    function SalesmanagerRoutingModule() {
    }
    SalesmanagerRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */]],
            providers: [__WEBPACK_IMPORTED_MODULE_3__sales_manager_service__["a" /* SalesManagerService */]]
        })
    ], SalesmanagerRoutingModule);
    return SalesmanagerRoutingModule;
}());



/***/ }),

/***/ "./src/app/platform/salesmanager/salesmanager.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesmanagerModule", function() { return SalesmanagerModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__salesmanager_routing_module__ = __webpack_require__("./src/app/platform/salesmanager/salesmanager-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dashboard_dashboard_component__ = __webpack_require__("./src/app/platform/salesmanager/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_multiselect_dropdown_angular2_multiselect_dropdown__ = __webpack_require__("./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sales_lead_mgmt_sales_lead_mgmt_component__ = __webpack_require__("./src/app/platform/salesmanager/sales-lead-mgmt/sales-lead-mgmt.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ngx_pagination__ = __webpack_require__("./node_modules/ngx-pagination/dist/ngx-pagination.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ng_pick_datetime__ = __webpack_require__("./node_modules/ng-pick-datetime/picker.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ngx_pipes__ = __webpack_require__("./node_modules/ngx-pipes/fesm5/ngx-pipes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__sales_referrers_sales_referrers_component__ = __webpack_require__("./src/app/platform/salesmanager/sales-referrers/sales-referrers.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__underScore_pipe__ = __webpack_require__("./src/app/platform/salesmanager/underScore.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__shared_shared_module__ = __webpack_require__("./src/app/shared/shared.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ng_select_ng_select__ = __webpack_require__("./node_modules/@ng-select/ng-select/esm5/ng-select.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














var SalesmanagerModule = /** @class */ (function () {
    function SalesmanagerModule() {
    }
    SalesmanagerModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3__salesmanager_routing_module__["a" /* SalesmanagerRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_5_angular2_multiselect_dropdown_angular2_multiselect_dropdown__["a" /* AngularMultiSelectModule */],
                __WEBPACK_IMPORTED_MODULE_7_ngx_pagination__["a" /* NgxPaginationModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["j" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_8_ng_pick_datetime__["c" /* OwlDateTimeModule */],
                __WEBPACK_IMPORTED_MODULE_8_ng_pick_datetime__["d" /* OwlNativeDateTimeModule */],
                __WEBPACK_IMPORTED_MODULE_9_ngx_pipes__["a" /* NgPipesModule */],
                __WEBPACK_IMPORTED_MODULE_12__shared_shared_module__["a" /* SharedModule */],
                __WEBPACK_IMPORTED_MODULE_13__ng_select_ng_select__["a" /* NgSelectModule */],
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__dashboard_dashboard_component__["a" /* DashboardComponent */], __WEBPACK_IMPORTED_MODULE_6__sales_lead_mgmt_sales_lead_mgmt_component__["a" /* SalesLeadMgmtComponent */], __WEBPACK_IMPORTED_MODULE_10__sales_referrers_sales_referrers_component__["a" /* SalesReferrersComponent */], __WEBPACK_IMPORTED_MODULE_11__underScore_pipe__["a" /* underScorePipe */]]
        })
    ], SalesmanagerModule);
    return SalesmanagerModule;
}());



/***/ }),

/***/ "./src/app/platform/salesmanager/underScore.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return underScorePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var underScorePipe = /** @class */ (function () {
    function underScorePipe() {
    }
    underScorePipe.prototype.transform = function (value, args) {
        return value.replace(/_/g, " ");
    };
    underScorePipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'underScore' })
    ], underScorePipe);
    return underScorePipe;
}());



/***/ })

});
//# sourceMappingURL=salesmanager.module.chunk.js.map