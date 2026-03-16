webpackJsonp(["business-head.module"],{

/***/ "./src/app/platform/business-head/boq-list/boq-list.component.css":
/***/ (function(module, exports) {

module.exports = ".table{\n  border-collapse: separate;\n  border-spacing: 0 5px;\n}\n.table td{\n    padding: 0.7rem 0.75rem;\n    vertical-align: middle;\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.7);\n    border: none;\n}\n.table th {\n    padding: .9rem;\n    vertical-align: middle;\n    border: none;\n    font-size: 12px;\n    text-transform: uppercase;\n    color: #fff;\n    background-color: #5A5A5A;\n}\n.tableDiv tbody{\n  background-color: #fff;\n}\n.tableDiv tbody tr{\n  -webkit-box-shadow: 1px 1px 7px 0px #dadada;\n          box-shadow: 1px 1px 7px 0px #dadada;\n  border-radius: 5px;\n}\n.firstTh{\n  border-radius: 5px 0 0 0;\n}\n.lastTh{\n  border-radius: 0px 5px 0 0;\n}\n.boq-img {\n  text-align: center;\n}"

/***/ }),

/***/ "./src/app/platform/business-head/boq-list/boq-list.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row ss-top-menu\">\n  <div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n    <span class=\"ss-text-dark ss-link\" style=\"vertical-align: -webkit-baseline-middle;\" [routerLink]=\"['/business_head/dashboard']\">\n      Dashboard\n      <i class=\"rightArrow fa fa-angle-right\"></i>\n    </span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">\n      Projects\n      <i class=\"rightArrow fa fa-angle-right\"></i>\n    </span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">\n      {{project_id}}\n      <i class=\"rightArrow fa fa-angle-right\"></i>\n    </span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">\n      BOQs\n    </span>\n  </div>\n  <div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n  </div>\n</div>\n<div class=\"row px-4\">\n\n   <div class=\"col-12\">\n    <div class=\"row mb-5\">\n      <div class=\"col-md-12  pb-3\">\n        <div class=\"row mt-4\">\n          \n          <div class=\"col-md-12\" >\n  \t        <div class=\"tableDiv \" >\n  \t          <div class=\"table-responsive\">\n  \t            <table class=\"table \" *ngIf=\"boq_list && boq_list.length > 0\">\n  \t                <thead class=\"thead-dark\">\n  \t                    <tr>\n\t  \t                  <th scope=\"col\" class=\"firstTh\">#</th>\n\t  \t                  <th scope=\"col\">BOQ NAME</th>\n\t  \t                  <th scope=\"col\">LAST EDITED ON</th>\n\t  \t                  <th scope=\"col\">PRICE EXPIRY</th>\n\t  \t                  <th scope=\"col\">SALES PRICE</th>\n                        <th scope=\"col\">COST PRICE</th>\n                        <th scope=\"col\">\n                          MARGIN\n                          <span>(&#8377;)</span>\n                        </th>\n                        <th scope=\"col\">MARGIN %</th>\n\t  \t                  <th class=\"lastTh\"></th>\n  \t                    </tr>\n  \t                </thead>\n  \t                <tbody lass=\"ss-tbody\">\n  \t              \t  <tr *ngFor=\"let obj of boq_list; let i = index\" [attr.data-index]=\"i\">\n  \t              \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n  \t              \t    <td  class=\"capitalize\">\n        \t\t\t              <a class=\"addCursor ss-link\" href=\"\"   [routerLink]=\"['/business_head/projects/'+project_id+'/quotation/'+obj.id+'/boq-view']\">{{obj.reference_number}}</a>\n        \t\t\t             \n      \t\t\t            </td>\n      \t\t\t            <td style=\"min-width: 1rem;\">{{obj.updated_at | date:\"dd MMMM, y @ h:mma\"}}</td>\n      \t\t\t            \n      \t\t\t            <td style=\"min-width: 1rem;\">{{obj.expiration_date }}</td>\n      \t\t\t            <td style=\"min-width: 1rem;\" class=\"capitalize\">\n                          <span *ngIf=\"obj.total_amount\">&#8377;</span>\n                          <span *ngIf=\"obj.total_amount\">{{obj.total_amount}}</span>\n                        </td>\n                        <td style=\"min-width: 1rem;\" class=\"capitalize\">\n                          <span *ngIf=\"obj.cost_price_total\">&#8377;</span>\n                          <span *ngIf=\"obj.cost_price_total\">{{obj.cost_price_total}}</span>\n                        </td>\n                        <td style=\"min-width: 1rem;\" class=\"capitalize\">\n                          \n                          <span>{{obj.margin_amount}}</span>\n                        </td>\n                        <td style=\"min-width: 1rem;\" class=\"capitalize\">\n                          <span>{{obj.margin_percentage}} %</span>\n                        </td>\n      \t\t\t            \n      \t\t\t            <td></td>\n        \t\t\t        </tr>\n  \t               \n  \t                </tbody>\n  \t            </table>\n  \t            <!-- <p>{{paymentForm.value | json}}</p> -->\n  \t          </div>\n  \t        </div>\n\t        </div> \n          <div class=\"col-md-12 not-found \" *ngIf=\"boq_list && boq_list.length== 0\">\n            <div class=\"boq-img\">\n              <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n            </div>\n            <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p> \n          </div> \n        </div>\n      </div>\n    </div>\n  </div>\n\n</div> "

/***/ }),

/***/ "./src/app/platform/business-head/boq-list/boq-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BoqListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__quotation_quotation_service__ = __webpack_require__("./src/app/platform/quotation/quotation.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__business_head_service__ = __webpack_require__("./src/app/platform/business-head/business-head.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lead_lead_service__ = __webpack_require__("./src/app/platform/lead/lead.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var BoqListComponent = /** @class */ (function () {
    function BoqListComponent(activatedRoute, router, loaderService, quotationService, leadService, formBuilder, route, _location, businessHeadService) {
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.loaderService = loaderService;
        this.quotationService = quotationService;
        this.leadService = leadService;
        this.formBuilder = formBuilder;
        this.route = route;
        this._location = _location;
        this.businessHeadService = businessHeadService;
    }
    BoqListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.project_id = params['projectId'];
        });
        this.getBoqList();
    };
    BoqListComponent.prototype.getBoqList = function () {
        var _this = this;
        this.loaderService.display(true);
        this.businessHeadService.getQuotationList(this.project_id).subscribe(function (res) {
            _this.loaderService.display(false);
            _this.boq_list = res['quotations'];
        }, function (err) {
        });
    };
    BoqListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-boq-list',
            template: __webpack_require__("./src/app/platform/business-head/boq-list/boq-list.component.html"),
            styles: [__webpack_require__("./src/app/platform/business-head/boq-list/boq-list.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_5__business_head_service__["a" /* BusinessHeadService */], __WEBPACK_IMPORTED_MODULE_4__quotation_quotation_service__["a" /* QuotationService */], __WEBPACK_IMPORTED_MODULE_6__lead_lead_service__["a" /* LeadService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_3__services_loader_service__["a" /* LoaderService */],
            __WEBPACK_IMPORTED_MODULE_4__quotation_quotation_service__["a" /* QuotationService */],
            __WEBPACK_IMPORTED_MODULE_6__lead_lead_service__["a" /* LeadService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_7__angular_common__["Location"],
            __WEBPACK_IMPORTED_MODULE_5__business_head_service__["a" /* BusinessHeadService */]])
    ], BoqListComponent);
    return BoqListComponent;
}());



/***/ }),

/***/ "./src/app/platform/business-head/boq-view/boq-view.component.css":
/***/ (function(module, exports) {

module.exports = ".bt-boq{\n    background: #EBF0F1;\n    color: #93001E;\n    font-size: 15px;\n    cursor: pointer;\n    font-weight: bold;\n    width: 160px;\n    border-color: darkred;\n}\n.modal-header-chng{\n background-image: url('image7.6e765fb708a16359e856.png');\n height: 130px;\n}\n.modal-title-change{\n  color: white;\n\n}\n.iconbox{\n  border-radius: 50%;\n  background: white;\n  width: 24px;\n  height: 25px;\n  opacity: 0.7;\n}\n.close-icon{\n  float: center;\n  font-size: 24px;\n  font-weight: 400;\n  padding-right: 5px;\n}\n.modal-body-change{\n  background: white;\n  padding-bottom: 0;\n}\n.an-textColor{\n  color: #212529;\n  font-weight: 400;\n  font-size: 16px;\n  margin-left: 10px;\n}\n.footer-chng{\n  border-top:none;\n}\n.footer-change{\n\tbackground: darkred;\n\t-webkit-box-pack: center;\n\t    -ms-flex-pack: center;\n\t        justify-content: center;\n\tcolor: white;\n}\n.selected-list[_ngcontent-c9] .c-btn[_ngcontent-c9]{\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n.navcontainer-chnage{\nmargin-top: 40px;\n}\n/* Checking table*/\n.table{\n  border-collapse: separate;\n  border-spacing: 0 5px;\n}\n.table td{\n    padding: 0.7rem 0.75rem;\n    vertical-align: middle;\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.7);\n    border: none;\n}\n.table th {\n    padding: .9rem;\n    vertical-align: middle;\n    border: none;\n    font-size: 12px;\n    text-transform: uppercase;\n    color: #fff;\n    background-color: #5A5A5A;\n}\n.tableDiv tbody{\n  background-color: #fff;\n}\n.tableDiv{\n  -webkit-box-shadow: 1px 1px 7px 0px #dadada;\n          box-shadow: 1px 1px 7px 0px #dadada;\n  border-radius: 5px;\n}\n.firstTh{\n  border-radius: 5px 0 0 0;\n}\n.lastTh{\n  border-radius: 0px 5px 0 0;\n}\n.ss-form-control{\n  height: 45px;\n}\n.ng-star-inserted{\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n.heading-change{\n    margin-left: 23px;\n    margin-top: 18px;\n    font-family: 'roboto';\n    margin-bottom: 18px;\n    color: gray;\n    font-weight: 400;\n}\n.download-change{\n  float: right;\n    color: #ad1313;\n    margin-top: 5px;\n    font-weight: 200px;\n    font-weight: 300;\n}\n.row-change{\n  padding: 0 30px;\n}\n.footer-changes{\n  background-color: #920a0a;\n  margin-top: 1rem;\n  color: white;\n  font-size: 25px;\n  font-weight: 200;\n\n}\n.text-chng{\n  background-color: white;\n    color: #a21b1b !important;\n    border-top: 1px solid;\n    cursor: pointer;\n}\na{\n  cursor: pointer;\n}\n.style-chng{\n  padding: 30px;\n}\n@-webkit-keyframes alertAnim {\n    from {\n        opacity:0;\n        -webkit-transform: translateY(-20px);\n                transform: translateY(-20px);\n    }\n    to {\n        opacity:1;\n        -webkit-transform: translateY(0);\n                transform: translateY(0);\n    }\n}\n@keyframes alertAnim {\n    from {\n        opacity:0;\n        -webkit-transform: translateY(-20px);\n                transform: translateY(-20px);\n    }\n    to {\n        opacity:1;\n        -webkit-transform: translateY(0);\n                transform: translateY(0);\n    }\n}\n.alert {\n    background: #f5e6e8;\n    padding: 7px;\n    font-size: .9em;\n    margin-bottom: 20px;\n    display: inline-block;\n    -webkit-animation: 2s alertAnim forwards;\n            animation: 2s alertAnim forwards;\n}\n.container-set-change{\n  background: #e6e4e4;\n  border-radius: 5px;\n}\n.ss-searchbox{\n  margin-top: 15px;\n  margin-bottom: 15px;\n  margin-left: 22px;\n  background: white;\n}\n.warning{\n  color: red;\n}"

/***/ }),

/***/ "./src/app/platform/business-head/boq-view/boq-view.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row ss-top-menu\">\n  <div class=\"col-xl-10 col-lg-10 col-md-10 col-sm-10 col-xs-10\">\n    <span class=\"ss-text-dark ss-link\" style=\"vertical-align: -webkit-baseline-middle;\" [routerLink]=\"['/business_head/dashboard']\">\n    \tDashboard\n    \t<i class=\"rightArrow fa fa-angle-right\"></i>\n\t</span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">\n      Projects\n      <i class=\"rightArrow fa fa-angle-right\"></i>\n    </span>\n    <span class=\"ss-text-dark ss-link\" style=\"vertical-align: -webkit-baseline-middle;\" routerLink=\"/business_head/projects/{{quotation.project_id}}/boq-list\">\n      {{quotation.project_name}}\n\n      <i class=\"rightArrow fa fa-angle-right\"></i>\n    </span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">\n      BOQ\n      <i class=\"rightArrow fa fa-angle-right\"></i>\n    </span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">\n      {{quotation.reference_number}}\n    </span>\n  </div>\n  <div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n  </div>\n</div>\n<div class=\"rk-ui-notification\" *ngIf=\"successalert\">\n  <span id=\"notificationMessageText\">{{successMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"successalert=false\">×</a>\n</div>\n<div class=\"rk-ui-notification err\" *ngIf=\"erroralert\"  style=\"z-index: 10000;\">\n\t<span id=\"notificationMessageText\">{{errorMessage}}</span>\n\t<a class=\"close rk-linknotification\" (click)=\"erroralert=false\">×</a>\n</div>\n\n<div class=\"row mt-4\">\n\t<h6 _ngcontent-c15=\"\" class=\"mb-3 borderbottom pt-3 pb-3 w-100 pl-4 pr-4\">\n\t\t<span _ngcontent-c15=\"\" class=\"mr-3\">BOQ : {{quotation.reference_number}}</span>\n\t\t<!-- <span _ngcontent-c15=\"\" class=\"pull-right\">Total - ₹ {{quotation.total_amount}}</span> -->\n\t</h6>\n</div>\n\n<div class=\"row mt-1 ml-1 mr-1\">\n\t<div class=\"col-sm-12\">\n\t\t<ul class=\"nav nav-tabs tabs-chng mt-4\"  id=\"myTab\" role=\"tablist\">\n      \t  <li class=\"nav-item nav-items\">\n      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getParentSet('line_items')\" [ngClass]=\"{'active': selectedParentSet == 'line_items'}\">Line Items</a>\n      \t  </li>\n      \t  <!-- <li class=\"nav-item nav-items\">\n      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getParentSet('drawings')\" [ngClass]=\"{'active': selectedParentSet == 'drawings'}\">Drawings</a>\n      \t  </li> -->\n      \t</ul>\n\t</div>\n</div>\n\n\n<!-- <div class=\"row pt-4 pb-4 ml-3 mr-3\" *ngIf=\"selectedParentSet == 'drawings'\" style=\"background-color: #fff;\">\n  <div class=\"col-12\">\n\t  <button class=\"btn  bt-boq pull-right\" data-target=\"#uploadCadModal\" data-toggle=\"modal\">Upload Drawings</button>\n  </div>\n\n</div> -->\n\n<div class=\"container-fluid container-set\">\n  <div class=\"row\" style=\"padding: 16px;\">\n    <div class=\"tableDiv\" style=\"width: 100%; background-color: #fff;\" >\n      <!-- <div class=\"table-responsive mt-4\" *ngIf=\"selectedParentSet == 'drawings'\">\n        <table class=\"table \" *ngIf=\"files.length > 0\" >\n            <thead class=\"thead-dark\">\n                <tr>\n                <th scope=\"col\" class=\"firstTh\">#</th>\n                <th scope=\"col\">FILE NAME</th>\n                <th scope=\"col\">TYPE</th>\n                <th scope=\"col\">STATUS</th>\n                <th scope=\"col\">REMARK</th>\n                <th scope=\"col\">UPLOADED AT</th>\n                <th></th>\n                <th class=\"lastTh\"></th>\n                </tr>\n            </thead>\n            <tbody lass=\"ss-tbody\">\n          \t  <tr *ngFor=\"let file of files; let i = index\" [attr.data-index]=\"i\">\n          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n          \t    <td  class=\"capitalize\">\n\t\t\t            {{file.upload_name | replaceChar}}\n\t\t\t          </td>\n\t\t\t          <td style=\"min-width: 1rem;\">{{file.upload_type | replaceChar}}</td>\n\n\t\t\t          <td style=\"min-width: 1rem;\">{{file.status | replaceChar }}</td>\n\t\t\t          <td style=\"min-width: 1rem;\">{{file.approval_comment }}</td>\n\t\t\t          <td style=\"min-width: 1rem;\" class=\"capitalize\">{{file.created_at | date:\"dd MMMM, y @ h:mma\"}}</td>\n\n\t\t\t          <td>\n\t\t\t          \t<a href=\"{{ file.upload }}\" class=\"download-change\" target=\"_blank\" style=\"float: left !important;\">View</a>\n\t\t\t          </td>\n\t\t\t          <td>\n\t\t\t          \t<input type=\"button\" class=\"btn btn-pink\" name=\"\" value=\"Tag Items\" (click) = \"initTagging('init', file)\"  *ngIf=\"(getObjSize(file.boqjobs) + getObjSize(file.custom_jobs) + getObjSize(file.extra_jobs) + getObjSize(file.modular_jobs_kitchen) + getObjSize(file.modular_jobs_wardrobe) + getObjSize(file.appliance_jobs)) <= 0\">\n\n\t\t\t          \t<input type=\"button\" class=\"btn btn-pink\" name=\"\" value=\"update Tags\" (click) = \"initTagging('update',file)\"  *ngIf=\"(getObjSize(file.boqjobs) + getObjSize(file.custom_jobs) + getObjSize(file.extra_jobs) + getObjSize(file.modular_jobs_kitchen) + getObjSize(file.modular_jobs_wardrobe) + getObjSize(file.appliance_jobs)) > 0\">\n\t\t\t          </td>\n         \t\t\t</tr>\n\n            </tbody>\n        </table>\n        <div class=\"col-md-12 not-found text-center\" *ngIf=\"files && files.length<=0 \">\n          <div class=\"boq-img\">\n            <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n          </div>\n          <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n        </div>\n      </div> -->\n\n      <div class=\"table-responsive mt-4\" *ngIf=\"selectedParentSet == 'line_items'\">\n    \t<div class=\"col-12\">\n\t      \t<ul class=\"nav nav-tabs tabs-chng mt-4\"  id=\"myTab\" role=\"tablist\">\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('loose')\" [ngClass]=\"{'active': selectedSet == 'loose'}\">Loose Furniture</a>\n\t      \t  </li>\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('modular_kitchen')\" [ngClass]=\"{'active': selectedSet == 'modular_kitchen'}\">Modular Kitchen</a>\n\t      \t  </li>\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('modular_wardrobe')\" [ngClass]=\"{'active': selectedSet == 'modular_wardrobe'}\">Modular Wardrobe</a>\n\t      \t  </li>\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('service')\" [ngClass]=\"{'active': selectedSet == 'service'}\">Service</a>\n\t      \t  </li>\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('appliance')\" [ngClass]=\"{'active': selectedSet == 'appliance'}\">Appliance</a>\n\t      \t  </li>\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('custom')\" [ngClass]=\"{'active': selectedSet == 'custom'}\">Custom</a>\n\t      \t  </li>\n\t      \t  <li class=\"nav-item nav-items\">\n\t      \t    <a class=\"nav-link active addCursor text-center mr-3\" (click)=\"getSet('extra')\" [ngClass]=\"{'active': selectedSet == 'extra'}\">Extra</a>\n\t      \t  </li>\n\n\t      \t</ul>\n\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'loose'\">\n\t      \t\t<div class=\"col-md-12\">\n  \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n  \t\t\t      <div class=\"table-responsive\">\n  \t\t\t        <table class=\"table \" *ngIf=\"loose_jobs_array.length > 0\">\n  \t\t\t            <thead class=\"thead-dark\">\n\t\t\t                <tr>\n  \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n  \t\t\t                <th scope=\"col\">NAME</th>\n  \t\t\t                <th scope=\"col\">QTY</th>\n  \t\t\t                <th scope=\"col\">PRICE</th>\n                        <th scope=\"col\">SALE PRICE</th>\n                        <th scope=\"col\">COST PRICE</th>\n  \t\t\t                <th scope=\"col\">IMAGE</th>\n  \t\t\t                <th>SPACE</th>\n  \t\t\t                <th class=\"lastTh\"></th>\n\t\t\t                </tr>\n  \t\t\t            </thead>\n  \t\t\t            <tbody lass=\"ss-tbody\">\n  \t\t\t          \t  <tr *ngFor=\"let job of loose_jobs_array; let i = index\" [attr.data-index]=\"i\">\n  \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n  \t\t\t          \t    <td  class=\"capitalize\">\n  \t\t\t\t\t\t            {{job.name | replaceChar}}\n  \t\t\t\t\t\t          </td>\n  \t\t\t\t\t\t          \n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.rate}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">\n                          <img src=\"{{job.image_urls}}\" onError=\"this.src='../../../../assets/img/no_image.svg'\" style = \"max-width: 100px;\">\n                        </td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n  \t\t\t\t\t\t          <td>\n  \t\t\t\t\t\t          </td>\n  \t\t\t         \t\t\t</tr>\n\n  \t\t\t            </tbody>\n  \t\t\t        </table>\n  \t\t\t        <div *ngIf=\"loose_jobs_array.length <= 0\">\n  \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"loose_jobs_array && loose_jobs_array.length<=0 \">\n                    <div class=\"boq-img\">\n                      <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                    </div>\n                    <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                  </div>\n  \t\t\t        </div>\n  \t\t\t      </div>\n  \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'modular_kitchen'\">\n\t      \t\t<div class=\"col-md-12\">\n\t      \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n\t      \t\t\t      <div class=\"table-responsive\">\n\t      \t\t\t        <table class=\"table \" *ngIf=\"modular_jobs_kitchen_array.length > 0\">\n\t      \t\t\t            <thead class=\"thead-dark\">\n\t      \t\t\t              <tr>\n\t      \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n\t      \t\t\t                <th scope=\"col\">TYPE</th>\n\t      \t\t\t                <th scope=\"col\">MODULE</th>\n\t      \t\t\t                <th scope=\"col\">QTY</th>\n\t      \t\t\t                <th scope=\"col\">PRICE</th>\n                              <th scope=\"col\">SALE PRICE</th>\n                              <th scope=\"col\">COST PRICE</th>\n\t      \t\t\t                <th scope=\"col\">WIDTH</th>\n\t      \t\t\t                <th scope=\"col\">IMAGE</th>\n\t      \t\t\t                <th>SPACE</th>\n\t      \t\t\t                <th class=\"lastTh\"></th>\n\t      \t\t\t              </tr>\n\t      \t\t\t            </thead>\n\t      \t\t\t            <tbody lass=\"ss-tbody\">\n\t      \t\t\t          \t  <tr *ngFor=\"let job of modular_jobs_kitchen_array; let i = index\" [attr.data-index]=\"i\">\n\t      \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.module_type | replaceChar}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.code}}({{job.dimensions}})</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.rate}}</td>\n                            <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                            <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">N/A</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">\n                              <img src=\"{{job.module_image_url}}\" onError=\"this.src='../../../../assets/img/no_image.svg'\" style = \"max-width: 100px;\">\n                            </td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n      \t\t\t\t\t\t          <td>\n      \t\t\t\t\t\t          </td>\n\t      \t\t\t         \t\t\t</tr>\n\n\t      \t\t\t            </tbody>\n\t      \t\t\t        </table>\n\t      \t\t\t        <div *ngIf=\"modular_jobs_kitchen_array.length <= 0\">\n\t      \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"modular_jobs_kitchen_array && modular_jobs_kitchen_array.length<=0 \">\n                          <div class=\"boq-img\">\n                            <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                          </div>\n                          <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                        </div>\n\t      \t\t\t        </div>\n\t      \t\t\t      </div>\n\t      \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'modular_wardrobe'\">\n\t      \t\t<div class=\"col-md-12\">\n\t      \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n\t      \t\t\t      <div class=\"table-responsive\">\n\t      \t\t\t        <table class=\"table\" *ngIf=\"modular_jobs_wardrobe_array.length > 0\">\n\t      \t\t\t            <thead class=\"thead-dark\">\n\t      \t\t\t                <tr>\n\t\t      \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n\t\t      \t\t\t                <th scope=\"col\">TYPE</th>\n\t\t      \t\t\t                <th scope=\"col\">MODULE</th>\n\t\t      \t\t\t                <th scope=\"col\">QTY</th>\n\t\t      \t\t\t                <th scope=\"col\">PRICE</th>\n                                <th scope=\"col\">SALE PRICE</th>\n                                <th scope=\"col\">COST PRICE</th>\n\t\t      \t\t\t                <th scope=\"col\">WIDTH</th>\n\t\t      \t\t\t                <th scope=\"col\">IMAGE</th>\n\t\t      \t\t\t                <th>SPACE</th>\n\t\t      \t\t\t                <th class=\"lastTh\"></th>\n\t      \t\t\t                </tr>\n\t      \t\t\t            </thead>\n\t      \t\t\t            <tbody lass=\"ss-tbody\">\n\t      \t\t\t          \t  <tr *ngFor=\"let job of modular_jobs_wardrobe_array; let i = index\" [attr.data-index]=\"i\">\n\t      \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.module_type | replaceChar}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.code}}({{job.dimensions}})</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.rate}}</td>\n                            <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                            <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">N/A</td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">\n                              <img src=\"{{job.module_image_url}}\" onError=\"this.src='../../../../assets/img/no_image.svg'\" style = \"max-width: 100px;\">\n                            </td>\n      \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n      \t\t\t\t\t\t          <td>\n      \t\t\t\t\t\t          </td>\n\t      \t\t\t         \t\t\t</tr>\n\n\t      \t\t\t            </tbody>\n\t      \t\t\t        </table>\n\t      \t\t\t        <div *ngIf=\"modular_jobs_wardrobe_array.length <= 0\">\n\t      \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"modular_jobs_wardrobe_array && modular_jobs_wardrobe_array.length<=0 \">\n                          <div class=\"boq-img\">\n                            <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                          </div>\n                          <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                        </div>\n\t      \t\t\t        </div>\n\t      \t\t\t      </div>\n\t      \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'service'\">\n\t      \t\t<div class=\"col-md-12\">\n  \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n  \t\t\t      <div class=\"table-responsive\">\n  \t\t\t        <table class=\"table \" *ngIf=\"service_jobs_array.length > 0\">\n  \t\t\t            <thead class=\"thead-dark\">\n  \t\t\t              <tr>\n      \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n      \t\t\t                <th scope=\"col\">ACTIVITY</th>\n      \t\t\t                <th scope=\"col\">BASE RATE</th>\n      \t\t\t                <th scope=\"col\">QTY</th>\n      \t\t\t                <th scope=\"col\">UNIT</th>\n                            <th scope=\"col\">SALE PRICE</th>\n                            <th scope=\"col\">COST PRICE</th>\n      \t\t\t                <th>SPACE</th>\n      \t\t\t                <th class=\"lastTh\"></th>\n  \t\t\t                </tr>\n  \t\t\t            </thead>\n  \t\t\t            <tbody lass=\"ss-tbody\">\n  \t\t\t          \t  <tr *ngFor=\"let job of service_jobs_array; let i = index\" [attr.data-index]=\"i\">\n  \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.name | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.base_rate}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.unit}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n  \t\t\t\t\t\t          <td>\n  \t\t\t\t\t\t          </td>\n  \t\t\t         \t\t\t</tr>\n\n  \t\t\t            </tbody>\n  \t\t\t        </table>\n  \t\t\t        <div *ngIf=\"service_jobs_array.length <= 0\">\n  \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"service_jobs_array && service_jobs_array.length<=0 \">\n                    <div class=\"boq-img\">\n                      <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                    </div>\n                    <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                  </div>\n  \t\t\t        </div>\n  \t\t\t      </div>\n  \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'appliance'\">\n\t      \t\t<div class=\"col-md-12\">\n  \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n  \t\t\t      <div class=\"table-responsive\">\n  \t\t\t        <table class=\"table \" *ngIf=\"appliance_jobs_array.length > 0\">\n  \t\t\t            <thead class=\"thead-dark\">\n  \t\t\t              <tr>\n      \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n      \t\t\t                <th scope=\"col\">TYPE</th>\n      \t\t\t                <th scope=\"col\">APPLIANCE</th>\n      \t\t\t                <th scope=\"col\">MAKE</th>\n      \t\t\t                <th scope=\"col\">SKU</th>\n      \t\t\t                <th scope=\"col\">QTY</th>\n      \t\t\t                <th scope=\"col\">PRICE</th>\n                            <th scope=\"col\">SALE PRICE</th>\n                            <th scope=\"col\">COST PRICE</th>\n      \t\t\t                <th scope=\"col\">IMAGE</th>\n      \t\t\t                <th>SPACE</th>\n      \t\t\t                <th class=\"lastTh\"></th>\n  \t\t\t                </tr>\n  \t\t\t            </thead>\n  \t\t\t            <tbody lass=\"ss-tbody\">\n  \t\t\t          \t  <tr *ngFor=\"let job of appliance_jobs_array; let i = index\" [attr.data-index]=\"i\">\n  \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.subcategory | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.name | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.make | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.vendor_sku}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.rate}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">\n                          <img src=\"{{job.image_url}}\" onError=\"this.src='../../../../assets/img/no_image.svg'\" style = \"max-width: 100px;\">\n                        </td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n  \t\t\t\t\t\t          <td>\n  \t\t\t\t\t\t          </td>\n  \t\t\t         \t\t\t</tr>\n\n  \t\t\t            </tbody>\n  \t\t\t        </table>\n  \t\t\t        <div *ngIf=\"appliance_jobs_array.length <= 0\">\n  \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"appliance_jobs_array && appliance_jobs_array.length<=0 \">\n                    <div class=\"boq-img\">\n                      <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                    </div>\n                    <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                  </div>\n  \t\t\t        </div>\n  \t\t\t      </div>\n  \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'custom'\">\n\t      \t\t<div class=\"col-md-12\">\n  \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n  \t\t\t      <div class=\"table-responsive\">\n  \t\t\t        <table class=\"table \" *ngIf=\"custom_jobs_array.length > 0\">\n  \t\t\t            <thead class=\"thead-dark\">\n  \t\t\t              <tr>\n      \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n      \t\t\t                <th scope=\"col\">NAME</th>\n      \t\t\t                <th scope=\"col\">DIMENSION</th>\n      \t\t\t                <th scope=\"col\">CORE MATERIAL</th>\n      \t\t\t                <th scope=\"col\">SHUTTER FINISH</th>\n      \t\t\t                <th scope=\"col\">QUANTITY</th>\n      \t\t\t                <th scope=\"col\">PRICE</th>\n                            <th scope=\"col\">SALE PRICE</th>\n                            <th scope=\"col\">COST PRICE</th>\n      \t\t\t                <th scope=\"col\">IMAGE</th>\n      \t\t\t                <th>SPACE</th>\n      \t\t\t                <th class=\"lastTh\"></th>\n  \t\t\t                </tr>\n  \t\t\t            </thead>\n  \t\t\t            <tbody lass=\"ss-tbody\">\n  \t\t\t          \t  <tr *ngFor=\"let job of custom_jobs_array; let i = index\" [attr.data-index]=\"i\">\n  \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.name | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.dimension}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.core_material | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.shutter_finish | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.rate}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">\n                          <img src=\"{{job.photo}}\" onError=\"this.src='../../../../assets/img/no_image.svg'\" style = \"max-width: 100px;\">\n                        </td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n  \t\t\t\t\t\t          <td>\n  \t\t\t\t\t\t          </td>\n  \t\t\t         \t\t\t</tr>\n\n  \t\t\t            </tbody>\n  \t\t\t        </table>\n  \t\t\t        <div *ngIf=\"custom_jobs_array.length <= 0\">\n  \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"custom_jobs_array && custom_jobs_array.length<=0 \">\n                    <div class=\"boq-img\">\n                      <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                    </div>\n                    <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                  </div>\n  \t\t\t        </div>\n  \t\t\t      </div>\n  \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\t      \t<div class=\"row\" *ngIf=\"selectedSet == 'extra'\">\n\t      \t\t<div class=\"col-md-12\">\n  \t\t\t    <div class=\"tableDiv\" style=\"width: 100%;\" >\n  \t\t\t      <div class=\"table-responsive\">\n  \t\t\t        <table class=\"table \" *ngIf=\"extra_jobs_array.length > 0\">\n  \t\t\t            <thead class=\"thead-dark\">\n  \t\t\t              <tr>\n      \t\t\t                <th scope=\"col\" class=\"firstTh\">#</th>\n      \t\t\t                <th scope=\"col\">NAME</th>\n      \t\t\t                <th scope=\"col\">SKU</th>\n      \t\t\t                <th scope=\"col\">MAKE</th>\n      \t\t\t                <th scope=\"col\">SPECIFICATION</th>\n      \t\t\t                <th scope=\"col\">QUANTITY</th>\n      \t\t\t                <th scope=\"col\">PRICE</th>\n                            <th scope=\"col\">SALE PRICE</th>\n                            <th scope=\"col\">COST PRICE</th>\n      \t\t\t                <th scope=\"col\">IMAGE</th>\n      \t\t\t                <th>SPACE</th>\n      \t\t\t                <th class=\"lastTh\"></th>\n  \t\t\t                </tr>\n  \t\t\t            </thead>\n  \t\t\t            <tbody lass=\"ss-tbody\">\n  \t\t\t          \t  <tr *ngFor=\"let job of extra_jobs_array; let i = index\" [attr.data-index]=\"i\">\n  \t\t\t          \t    <td style=\"min-width: 1rem;\">{{i+1}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.name | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.vendor_sku}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.make | replaceChar}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.specifications}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.quantity}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.rate}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.amount}}</td>\n                        <td style=\"min-width: 1rem;\">{{job.cost_price}}</td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">\n                          <img src=\"{{job.image_url}}\" onError=\"this.src='../../../../assets/img/no_image.svg'\" style = \"max-width: 100px;\">\n                        </td>\n  \t\t\t\t\t\t          <td style=\"min-width: 1rem;\">{{job.space}}</td>\n  \t\t\t\t\t\t          <td>\n  \t\t\t\t\t\t          </td>\n  \t\t\t         \t\t\t</tr>\n\n  \t\t\t            </tbody>\n  \t\t\t        </table>\n  \t\t\t        <div *ngIf=\"extra_jobs_array.length <= 0\">\n  \t\t\t        \t<div class=\"col-md-12 not-found text-center\" *ngIf=\"extra_jobs_array && extra_jobs_array.length<=0 \">\n                    <div class=\"boq-img\">\n                      <img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n                    </div>\n                    <p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n                  </div>\n  \t\t\t        </div>\n  \t\t\t      </div>\n  \t\t\t    </div>\n\t      \t\t</div>\n\t      \t</div>\n\n\n      \t</div>\n      </div>\n    </div>\n\t</div>\n</div>\n"

/***/ }),

/***/ "./src/app/platform/business-head/boq-view/boq-view.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BoqViewComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__quotation_quotation_service__ = __webpack_require__("./src/app/platform/quotation/quotation.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__business_head_service__ = __webpack_require__("./src/app/platform/business-head/business-head.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__lead_lead_service__ = __webpack_require__("./src/app/platform/lead/lead.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var BoqViewComponent = /** @class */ (function () {
    function BoqViewComponent(activatedRoute, loaderService, quotationService, businessHeadService, route, router, formBuilder, _location, fb) {
        this.activatedRoute = activatedRoute;
        this.loaderService = loaderService;
        this.quotationService = quotationService;
        this.businessHeadService = businessHeadService;
        this.route = route;
        this.router = router;
        this.formBuilder = formBuilder;
        this._location = _location;
        this.fb = fb;
        this.erroralert = false;
        this.successalert = false;
        this.quotation = {};
        this.modular_jobs_kitchen_array = [];
        this.modular_jobs_wardrobe_array = [];
        this.loose_jobs_array = [];
        this.service_jobs_array = [];
        this.appliance_jobs_array = [];
        this.custom_jobs_array = [];
        this.extra_jobs_array = [];
        this.boqProducts = [];
        this.selectedParentSet = "line_items";
        this.selectedSet = "loose";
        this.cadUploadForm = this.formBuilder.group({
            upload_name: new __WEBPACK_IMPORTED_MODULE_5__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["k" /* Validators */].required),
            upload_type: new __WEBPACK_IMPORTED_MODULE_5__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["k" /* Validators */].required),
            status: new __WEBPACK_IMPORTED_MODULE_5__angular_forms__["c" /* FormControl */]("pending", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["k" /* Validators */].required),
            upload: new __WEBPACK_IMPORTED_MODULE_5__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["k" /* Validators */].required),
            quotation_id: new __WEBPACK_IMPORTED_MODULE_5__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["k" /* Validators */].required)
        });
    }
    BoqViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.project_id = params['projectId'];
            _this.quotation_id = params['quoteId'];
        });
        this.fetchQuotation();
    };
    BoqViewComponent.prototype.onChange = function (event) {
        var _this = this;
        this.attachment_file = event.target.files[0] || event.srcElement.files[0];
        this.attachment_file_name = this.attachment_file['name'];
        var fileReader = new FileReader();
        var base64;
        fileReader.onload = function (fileLoadedEvent) {
            base64 = fileLoadedEvent.target;
            _this.basefile = base64.result;
        };
        fileReader.readAsDataURL(this.attachment_file);
    };
    BoqViewComponent.prototype.fetchQuotation = function () {
        var _this = this;
        this.loaderService.display(true);
        this.businessHeadService.getQuotationDetails(this.project_id, this.quotation_id).subscribe(function (res) {
            _this.loaderService.display(false);
            _this.quotation = res.quotation;
            if (Object.keys(_this.quotation.modular_jobs_kitchen).length > 0) {
                for (var l = 0; l < Object.keys(_this.quotation.modular_jobs_kitchen).length; l++) {
                    var obj = _this.quotation.modular_jobs_kitchen[Object.keys(_this.quotation.modular_jobs_kitchen)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.modular_jobs_kitchen_array.push(obj[m]);
                    }
                }
            }
            if (Object.keys(_this.quotation.modular_jobs_wardrobe).length > 0) {
                for (var l = 0; l < Object.keys(_this.quotation.modular_jobs_wardrobe).length; l++) {
                    var obj = _this.quotation.modular_jobs_wardrobe[Object.keys(_this.quotation.modular_jobs_wardrobe)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.modular_jobs_wardrobe_array.push(obj[m]);
                    }
                }
            }
            if (Object.keys(_this.quotation.boqjobs).length > 0) {
                // 
                for (var l = 0; l < Object.keys(_this.quotation.boqjobs).length; l++) {
                    var obj = _this.quotation.boqjobs[Object.keys(_this.quotation.boqjobs)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.loose_jobs_array.push(obj[m]);
                    }
                }
            }
            if (Object.keys(_this.quotation.service_jobs).length > 0) {
                for (var l = 0; l < Object.keys(_this.quotation.service_jobs).length; l++) {
                    var obj = _this.quotation.service_jobs[Object.keys(_this.quotation.service_jobs)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.service_jobs_array.push(obj[m]);
                    }
                }
            }
            if (Object.keys(_this.quotation.appliance_jobs).length > 0) {
                for (var l = 0; l < Object.keys(_this.quotation.appliance_jobs).length; l++) {
                    var obj = _this.quotation.appliance_jobs[Object.keys(_this.quotation.appliance_jobs)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.appliance_jobs_array.push(obj[m]);
                    }
                }
            }
            if (Object.keys(_this.quotation.custom_jobs).length > 0) {
                for (var l = 0; l < Object.keys(_this.quotation.custom_jobs).length; l++) {
                    var obj = _this.quotation.custom_jobs[Object.keys(_this.quotation.custom_jobs)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.custom_jobs_array.push(obj[m]);
                    }
                }
            }
            if (Object.keys(_this.quotation.extra_jobs).length > 0) {
                for (var l = 0; l < Object.keys(_this.quotation.extra_jobs).length; l++) {
                    var obj = _this.quotation.extra_jobs[Object.keys(_this.quotation.extra_jobs)[l]];
                    for (var m = 0; m < obj.length; m++) {
                        _this.extra_jobs_array.push(obj[m]);
                    }
                }
            }
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    BoqViewComponent.prototype.getParentSet = function (type) {
        this.selectedParentSet = type;
    };
    BoqViewComponent.prototype.getSet = function (type) {
        this.selectedSet = type;
    };
    BoqViewComponent.prototype.resetForm = function () {
        this.cadUploadForm.reset();
        this.cadUploadForm.controls['status'].setValue("pending");
    };
    BoqViewComponent.prototype.getObjSize = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    };
    ;
    BoqViewComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-boq-view',
            template: __webpack_require__("./src/app/platform/business-head/boq-view/boq-view.component.html"),
            styles: [__webpack_require__("./src/app/platform/business-head/boq-view/boq-view.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_1__quotation_quotation_service__["a" /* QuotationService */], __WEBPACK_IMPORTED_MODULE_7__lead_lead_service__["a" /* LeadService */], __WEBPACK_IMPORTED_MODULE_2__business_head_service__["a" /* BusinessHeadService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_3__services_loader_service__["a" /* LoaderService */],
            __WEBPACK_IMPORTED_MODULE_1__quotation_quotation_service__["a" /* QuotationService */],
            __WEBPACK_IMPORTED_MODULE_2__business_head_service__["a" /* BusinessHeadService */],
            __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_5__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_6__angular_common__["Location"],
            __WEBPACK_IMPORTED_MODULE_5__angular_forms__["b" /* FormBuilder */]])
    ], BoqViewComponent);
    return BoqViewComponent;
}());



/***/ }),

/***/ "./src/app/platform/business-head/business-head-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BusinessHeadRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__ = __webpack_require__("./src/app/authentication/logged-in-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__business_head_service__ = __webpack_require__("./src/app/platform/business-head/business-head.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dashboard_dashboard_component__ = __webpack_require__("./src/app/platform/business-head/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__boq_view_boq_view_component__ = __webpack_require__("./src/app/platform/business-head/boq-view/boq-view.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__boq_list_boq_list_component__ = __webpack_require__("./src/app/platform/business-head/boq-list/boq-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angular2_multiselect_dropdown_angular2_multiselect_dropdown__ = __webpack_require__("./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__fhi_data_fhi_data_component__ = __webpack_require__("./src/app/platform/business-head/fhi-data/fhi-data.component.ts");
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
        component: __WEBPACK_IMPORTED_MODULE_4__dashboard_dashboard_component__["a" /* DashboardComponent */]
    },
    {
        path: 'projects/:projectId/boq-list',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_6__boq_list_boq_list_component__["a" /* BoqListComponent */]
    },
    {
        path: 'aws/fhi-data',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_8__fhi_data_fhi_data_component__["a" /* FhiDataComponent */]
    },
    {
        path: 'projects/:projectId/quotation/:quoteId/boq-view',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_5__boq_view_boq_view_component__["a" /* BoqViewComponent */]
    },
];
var BusinessHeadRoutingModule = /** @class */ (function () {
    function BusinessHeadRoutingModule() {
    }
    BusinessHeadRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_7_angular2_multiselect_dropdown_angular2_multiselect_dropdown__["a" /* AngularMultiSelectModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */]],
            providers: [__WEBPACK_IMPORTED_MODULE_3__business_head_service__["a" /* BusinessHeadService */]]
        })
    ], BusinessHeadRoutingModule);
    return BusinessHeadRoutingModule;
}());



/***/ }),

/***/ "./src/app/platform/business-head/business-head.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BusinessHeadModule", function() { return BusinessHeadModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_pipes__ = __webpack_require__("./node_modules/ngx-pipes/fesm5/ngx-pipes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_charts_ng2_charts__ = __webpack_require__("./node_modules/ng2-charts/ng2-charts.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_charts_ng2_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ng2_charts_ng2_charts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_shared_module__ = __webpack_require__("./src/app/shared/shared.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__business_head_routing_module__ = __webpack_require__("./src/app/platform/business-head/business-head-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dashboard_dashboard_component__ = __webpack_require__("./src/app/platform/business-head/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__boq_view_boq_view_component__ = __webpack_require__("./src/app/platform/business-head/boq-view/boq-view.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__boq_list_boq_list_component__ = __webpack_require__("./src/app/platform/business-head/boq-list/boq-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ngx_pagination__ = __webpack_require__("./node_modules/ngx-pagination/dist/ngx-pagination.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ng_pick_datetime__ = __webpack_require__("./node_modules/ng-pick-datetime/picker.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













// import { CmVariableMarginsComponent } from './cm-variable-margins/cm-variable-margins.component';
var MY_CUSTOM_FORMATS = {
    parseInput: 'dd-MM-yyyy',
    fullPickerInput: 'dd-MM-yyyy HH:mm',
    datePickerInput: 'dd-MM-yyyy',
    timePickerInput: 'HH:mm',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd-MM-yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
};
var BusinessHeadModule = /** @class */ (function () {
    function BusinessHeadModule() {
    }
    BusinessHeadModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_forms__["j" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_6__shared_shared_module__["a" /* SharedModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_router__["g" /* RouterModule */],
                __WEBPACK_IMPORTED_MODULE_3_ngx_pipes__["a" /* NgPipesModule */],
                __WEBPACK_IMPORTED_MODULE_7__business_head_routing_module__["a" /* BusinessHeadRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_11_ngx_pagination__["a" /* NgxPaginationModule */],
                __WEBPACK_IMPORTED_MODULE_4_ng2_charts_ng2_charts__["ChartsModule"],
                __WEBPACK_IMPORTED_MODULE_12_ng_pick_datetime__["c" /* OwlDateTimeModule */],
                __WEBPACK_IMPORTED_MODULE_12_ng_pick_datetime__["d" /* OwlNativeDateTimeModule */]
            ],
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_12_ng_pick_datetime__["b" /* OWL_DATE_TIME_LOCALE */], useValue: 'en-IN' },
                { provide: __WEBPACK_IMPORTED_MODULE_12_ng_pick_datetime__["a" /* OWL_DATE_TIME_FORMATS */], useValue: MY_CUSTOM_FORMATS },
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_8__dashboard_dashboard_component__["a" /* DashboardComponent */], __WEBPACK_IMPORTED_MODULE_9__boq_view_boq_view_component__["a" /* BoqViewComponent */], __WEBPACK_IMPORTED_MODULE_10__boq_list_boq_list_component__["a" /* BoqListComponent */]],
        })
    ], BusinessHeadModule);
    return BusinessHeadModule;
}());



/***/ }),

/***/ "./src/app/platform/business-head/dashboard/dashboard.component.css":
/***/ (function(module, exports) {

module.exports = ".customerBg{\n\tbackground-image: url('Image6.e26285f7e7ea618537bc.png');\n\tbackground-size: cover;\n\tbackground-position: center;\n\tbackground-repeat: no-repeat;\n\theight: 37rem;\n}\n.customerBgColor{\n\tbackground-color: rgba(0, 0, 0, 0.35);\n\theight: 37rem;\n}\n.bannerText{\n\tmargin-top: 18%;\n}\n.customerBg h1{\n  color: #fff;\n  text-shadow: 0 0 15px black;\n  font-size: 3.5rem;\n  font-weight: 500;\n  word-spacing: 6px;\n  line-height: 75px;\n  letter-spacing: 2px;\n  max-width: 76%;\n  margin: auto;\n}\n.grayBg{\n  background-color: #f1f2f9;\n}\n.Slider{\n  background-image: url('Image2.3e6f30170a268cc83732.png');\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  margin-bottom: 7px;\n}\n/*.customerBg h3{*/\n/*color: #eaeaea;*/\n/*text-shadow: 0 0 15px black;*/\n/*width: 80%;*/\n/*letter-spacing: 2px;*/\n/*line-height: 50px;*/\n/*font-weight: 300;*/\n/*}*/\n.secondSection{\n\tpadding: 2.7rem 2rem;\n\tmargin-top: -4rem;\n\tbackground-color: #fff;\n\t-webkit-box-shadow: 0px 2px 5px #c1c1c1;\n\t        box-shadow: 0px 2px 5px #c1c1c1;\n}\n.secondSection h3{\n  font-weight: 500;\n  font-size: 2rem;\n  letter-spacing: 1px;\n  margin-top: 1rem;\n}\n.borderBottom{\n\tborder: 1px solid #ff819b;\n\tdisplay: block;\n\twidth: 15%;\n\tmargin: 0px 0px 3px 0;\n}\n.borderBottom.span{\n\tborder: 1px solid #da002d;\n}\n.secondSection .borderBottom{\n  margin-top: 2px !important;\n  width: 8rem;\n}\n.secondSection h4{\n  margin-top: 2.5rem;\n  letter-spacing: 1px;\n  font-weight: 500;\n  word-spacing: 1px;\n  font-size: 25px;\n  line-height: 35px;\n  color: #3a3a3a;\n}\n.secondSection h4 span{\n\tcolor: #8c031f;\n}\n.worksDiv{\n  width: 20%;\n  text-align: center;\n}\n.worksDiv p{\n  margin-top: 1rem;\n  font-size: 14px;\n  color: #505050;\n}\n.hrLine{\n  border: 1px solid #ececec;\n  width: calc(100% - 22rem);\n  margin: 0px 0px 3px 0;\n  position: absolute;\n  margin-top: 5rem;\n  margin-left: 8rem;\n  z-index: 0;\n}\n.worksImgDiv{\n  display: block;\n  width: 100%;\n  position: relative;\n}\n.worksImgDiv div{\n  width: 9.5rem;\n  height: 9.5rem;\n  margin: auto;\n  border: 2px solid #ccc;\n  border-radius: 100%;\n  background-color: #fff;\n  z-index: 2;\n}\n.worksImgDiv img{\n  width: 5rem;\n  margin-top: 2rem;\n}\n.para{\n  font-size: 15px;\n  color: #666;\n  letter-spacing: 1px;\n  word-spacing: 1px;\n  line-height: 28px;\n  margin-top: 3rem;\n  padding-right: 2rem;\n}\n.secondSectionRight h3{\n  font-weight: 400;\n  font-size: 1.6rem;\n}\n.secondSectionRight p{\n  margin-top: 1rem;\n  padding-right: 0;\n}\n.sign{\n  font-size: 18px;\n  font-weight: 500;\n}\n.sign span{\n  font-style: italic;\n  font-weight: 200;\n  color: #9c9c9c;\n  font-size: 1.2rem;\n}\n.arrivae{\n\tfont-style: italic;\n\tcolor: #8c031f;\n}\n.secondSectionRight{\n  margin-top: 4.5rem;\n}\n.promiseBg{\n\tbackground-color: #000;\n\tmargin-bottom: 7px;\n}\n.promiseDiv{\n\tpadding: 4rem 2rem 2rem 4rem;\n}\n.promiseDiv h2{\n  color: #fff;\n  font-weight: 400;\n}\n.promiseDiv p{\n  font-size: 19px;\n  color: #797979;\n  border-bottom: dashed 2px rgba(86, 86, 86, 0.76);\n  width: 88%;\n  padding-bottom: 2.8rem;\n  padding-top: 10px;\n}\n.spacesDiv{\n\ttext-align: center;\n}\n.spacesDiv h3{\n  margin-bottom: 14px;\n  font-weight: 500;\n  font-size: 2rem;\n}\n.spacesDiv .borderBottom{\n\tmargin-top: 2px !important;\n\twidth: 5rem;\n}\n.spacesDiv p{\n  margin: 1.3rem auto 2rem auto;\n  color: #777777;\n  font-size: 17px;\n  font-weight: 300;\n  letter-spacing: 1px;\n  width: 74%;\n  line-height: 30px;\n}\n.card .card-img-top{\n\tpadding: 1rem;\n}\n.card{\n\tborder: none;\n  -webkit-box-shadow: 0 0 7px #cecece;\n          box-shadow: 0 0 7px #cecece;\n}\n.card h6{\n  font-size: 18px;\n  color: #777;\n  font-weight: 400;\n}\n.Bg360{\n\tbackground-color: rgba(0, 0, 0, 0.75);\n\theight: 35rem;\n\tposition: absolute;\n\twidth: 100%;\n\ttop: 0;\n}\n.Bg360 .spacesDiv h3{\n  color: #fff;\n  font-weight: 400;\n}\n.Bg360 .spacesDiv p{\n  color: #eaeaea;\n  font-weight: 300;\n}\n.offer{\n\tcolor: #fff;\n\ttext-align: left;\n}\n.offer img{\n\twidth: 60px;\n}\n.offer h5{\n  font-weight: 400;\n  letter-spacing: 1px;\n}\n.offer p{\n  line-height: 25px;\n  letter-spacing: 1px;\n  color: #cccccc;\n  font-size: 14px;\n}\n.offer h6{\n\tcolor: #dc002d;\n}\n.offer h6 i{\n\tfont-size: 19px;\n}\n.verticalBorder{\n\tmargin: 15px auto !important;\n\tborder-bottom: 10rem solid #eae7e7;\n\tdisplay: block;\n\twidth: 2px;\n}\n.ProcessH4{\n  font-weight: 400;\n  word-spacing: 2px;\n}\n.ProcessP{\n  letter-spacing: 1px;\n  word-spacing: 2px;\n  color: #666;\n  font-weight: 300;\n  line-height: 26px;\n  font-size: 15px;\n}\na{\n    color: #000;\n}\n/*.table th {\n    font-size: 12px;\n    color: #fff;\n    background-color: #5A5A5A;\n}*/\n.table td {\n  font-size: 14px;\n}\n.container-set{\n  background-color: white;\n\n\n}\nul{\n  margin-top: 40px;\n}\n.nav-items{\n  width: 150px;\n}\n.nav-items .nav-link{\n  font-size: 14px !important;\n  font-weight: 600 !important;\n}\n.addCursor.active{\n  color: #980029;\n  border-color: #fff #fff #fff;\n}\n.addCursor{\n  font-size: 12px;\n  /* font-family: bold; */\n  font-weight: bold;\n\n}\n.tabs-chng{\n  border-bottom: none;\n}\n.bt-boqs{\n  display: block;\n  margin: 0px auto;\n  border-color: #93001E;\n  color: #93001E;\n  font-size: 14px;\n  cursor: pointer;\n}\n.box-list{\n  -webkit-box-shadow: 0 10px 6px -6px #dedbdb;\n  box-shadow: 0 10px 6px -6px #dedbdb;\n}\n/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */\n/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/\n.table{\n  border-collapse: separate;\n  border-spacing: 0 5px;\n}\n.table td{\n    padding: 0.7rem 0.75rem;\n    vertical-align: middle;\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.7);\n    border: none;\n}\n.table th {\n    padding: .9rem;\n    vertical-align: middle;\n    border: none;\n    font-size: 12px;\n    text-transform: uppercase;\n    color: #fff;\n    background-color: #5A5A5A;\n}\n.tableDiv tbody{\n  background-color: #fff;\n}\n.tableDiv tbody tr{\n  -webkit-box-shadow: 1px 1px 7px 0px #dadada;\n          box-shadow: 1px 1px 7px 0px #dadada;\n  border-radius: 5px;\n}\n.firstTh{\n  border-radius: 5px 0 0 0;\n}\n.lastTh{\n  border-radius: 0px 5px 0 0;\n}"

/***/ }),

/***/ "./src/app/platform/business-head/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row ss-top-menu\">\n\t<div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n\t\t<span class=\"ss-text-dark ss-link\" style=\"vertical-align: -webkit-baseline-middle;\" [routerLink]=\"['/business_head/dashboard']\">Dashboard\n\t\t<i class=\"rightArrow fa fa-angle-right\"></i></span>\n\t\t<span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">Projects</span>\n\t</div>\n\t<div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n\t\t\t<!-- <button class=\"addCursor float-right downloadBtn mr-2\" data-toggle=\"modal\" data-target=\"#addNewLeadModal\">Add Lead</button> -->\n\t</div>\n</div>\n<div class=\"row px-4\">\n\n\t <div class=\"col-12\">\n\t\t<div class=\"row mb-5\">\n\t\t\t<div class=\"col-md-12  pb-3\">\n\t\t\t\t<div class=\"row mt-4\">\n\n\t\t\t\t\t<div class=\"col-md-12\" >\n\t\t\t\t\t\t<div class=\"tableDiv \" >\n\t\t\t\t\t\t\t<div class=\"table-responsive\">\n\t\t\t\t\t\t\t\t<table class=\"table \">\n\t\t\t\t\t\t\t\t\t\t<thead class=\"thead-dark\">\n\t\t\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\" class=\"firstTh\">#</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">PROJECT NAME</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">PROJECT ID</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">LEAD NAME</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">LEAD ID</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">DESIGNER ASSIGNED</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">COMMUNITY MANAGER</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">PROJECT C.P</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">PROJECT S.P</th>\n\t\t\t\t\t\t\t\t\t\t\t\t<th class=\"lastTh\"></th>\n\t\t\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t\t\t<tbody lass=\"ss-tbody\">\n\t\t\t\t\t\t\t\t\t\t\t<tr *ngFor=\"let obj of project_list | paginate: { itemsPerPage: per_page, currentPage: current_page, totalItems: total_page  }; let i = index\" [attr.data-index]=\"i\" >\n\t\t\t\t\t\t\t\t\t\t\t\t<td class=\"text-center\">{{((current_page-1) * per_page) + (i+1)}}</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td  class=\"capitalize\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<a class=\"addCursor ss-link\" href=\"\"  [routerLink]=\"['/business_head/projects/'+obj.id+'/boq-list']\">{{obj.name}}</a>\n\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\">{{obj.id}}</td>\n\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.user\">{{obj.user.name}}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\" class=\"capitalize\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.user\">{{obj.user.id}}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\" class=\"capitalize\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.designer\">{{obj.designer.name}}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.community_manager\">{{obj.community_manager.name}}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.cost_price\">&#8377;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.cost_price\">{{obj.cost_price}}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td style=\"min-width: 1rem;\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.sales_price\">&#8377;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"obj.sales_price\">{{obj.sales_price}}</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t\t</tr>\n\n\t\t\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t<div class=\"text-center\" *ngIf=\"project_list && project_list.length >0\">\n\t\t\t\t\t                <pagination-controls autoHide=\"true\" (pageChange)=\"current_page = getProjectList($event)\"></pagination-controls>\n\t\t\t\t\t            </div>\n\t\t\t\t\t\t\t\t<!-- <p>{{paymentForm.value | json}}</p> -->\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-md-12 not-found \" *ngIf=\"project_list && project_list.length== 0\">\n\t\t\t\t\t\t<div class=\"boq-img\">\n\t\t\t\t\t\t\t<img src=\"../../../assets/img/desktop.png\" style=\"height: 250px;width: 300px\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p class=\" pb-4\" style=\"font-size: 21px;text-align: center;color: dimgray\">Nothing to show...</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</div>\n\n<!-- <div class=\"modal fade customModal\" id=\"addNewLeadModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addNewLeadModalLabel\" aria-hidden=\"true\">\n\t\t<div class=\"modal-dialog modal-lg\" role=\"document\">\n\t\t\t<form (ngSubmit)=\"addLeadFormSubmit(addLeadForm.value); \" [formGroup]=\"addLeadForm\" class=\"form-horizontal\" enctype=\"multipart/form-data\" id=\"addLeadForm\">\n\t\t\t\t<div class=\"modal-content\">\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t  <h5 class=\"modal-title modalTitle\" id=\"exampleModalLabel\"> Lead Details</h5>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"modal-body\">\n\t\t\t\t\t  <div class=\"row mx-2\">\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Name </label>\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Enter Lead Name\" formControlName=\"name\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Lead Email </label>\n\t\t\t\t\t\t\t<input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"Enter Lead Email\" formControlName=\"email\">\n\t\t\t\t\t\t\t<div *ngIf=\"addLeadForm.controls['email'].errors && !addLeadForm.controls['email'].pristine\" class=\"text-danger\">\n\t\t\t\t\t\t\t  <div [hidden]=\"addLeadForm.controls['email'].valid || addLeadForm.controls['email'].errors.required\">Enter valid email.</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Lead Contact <span>*</span></label>\n\t\t\t\t\t\t\t<input type=\"number\" class=\"form-control\" name=\"contact\" placeholder=\"Enter Lead Contact\" formControlName=\"contact\" required min=\"0\" (keydown)=\"numberCheck($event)\">\n\t\t\t\t\t\t\t<div *ngIf=\"addLeadForm.controls['contact'].errors && !addLeadForm.controls['contact'].pristine\" class=\"text-danger\">\n\t\t\t\t\t\t\t  <div [hidden]=\"!addLeadForm.controls['contact'].errors.required\">Contact is required.</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Pincode</label>\n\t\t\t\t\t\t\t<input type=\"number\" class=\"form-control\" name=\"pincode\" placeholder=\"Enter Lead Pincode\" formControlName=\"pincode\" min=\"0\" (keydown)=\"numberCheck($event)\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Select Lead Type <span>*</span></label>\n\t\t\t\t\t\t\t<select formControlName=\"lead_type_id\" class=\"form-control\" (change)=\"onChangeOfLeadType($event.target.value)\">\n\t\t\t\t\t\t\t\t<option value=\"\" disabled>Select</option>\n\t\t\t\t\t\t\t  <option value=\"{{type.id}}\" *ngFor=\"let type of lead_types\">{{type.name}}</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Select Lead Source <span>*</span></label>\n\t\t\t\t\t\t\t<select formControlName=\"lead_source_id\" class=\"form-control capitalize\">\n\t\t\t\t\t\t\t  <option value=\"\" disabled>Select</option>\n\t\t\t\t\t\t\t  <option value=\"{{src.id}}\" *ngFor=\"let src of lead_sources\">{{src.name | replaceChar}}</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Select Lead Campaign </label>\n\t\t\t\t\t\t\t<select formControlName=\"lead_campaign_id\" class=\"form-control capitalize\">\n\t\t\t\t\t\t\t  <option value=\"\" disabled>Select</option>\n\t\t\t\t\t\t\t  <option value=\"{{camp.id}}\" *ngFor=\"let camp of lead_campaigns\">{{camp.name | replaceChar}}</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"addLeadForm.controls['lead_type_name'].value=='designer'\">\n\t\t\t\t\t\t  <div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Instagram Id</label>\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" name=\"instagram_handle\" placeholder=\"Enter Instagram Id\" formControlName=\"instagram_handle\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 col-md-6 mb-2\" *ngIf=\"addLeadForm.controls['lead_type_name'].value=='designer'\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"text-left\">Upload CV</label>\n\t\t\t\t\t\t\t<input type=\"file\" name=\"\" class=\"form-control\" (change)=\"uploadCV($event)\" name=\"attachment_file\">\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-12 mt-3 text-right\">\n\t\t\t\t\t\t  <div class=\"mt-3\">\n\t\t\t\t\t\t  <button type=\"submit\" [disabled]=\"!addLeadForm.valid\" class=\"rk-interalBtnColor addCursor\">Add</button>\n\t\t\t\t\t\t  <button class=\"cancle ml-3 addCursor rk-btnCancel\" data-dismiss=\"modal\">Cancel</button>\n\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t  </div>\n\t\t\t\t\t</div>\n\t\t\t\t  </div>\n\t\t\t</form>\n\t\t</div>\n\t</div> -->"

/***/ }),

/***/ "./src/app/platform/business-head/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__business_head_service__ = __webpack_require__("./src/app/platform/business-head/business-head.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lead_lead_service__ = __webpack_require__("./src/app/platform/lead/lead.service.ts");
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
    function DashboardComponent(loaderService, businessHeadService, router, activatedRoute, leadService, formBuilder) {
        this.loaderService = loaderService;
        this.businessHeadService = businessHeadService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.leadService = leadService;
        this.formBuilder = formBuilder;
        this.successalert = false;
        this.erroralert = false;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.loaderService.display(false);
        this.getProjectList(1);
    };
    DashboardComponent.prototype.getProjectList = function (page) {
        var _this = this;
        this.loaderService.display(true);
        this.businessHeadService.getProjectList(page).subscribe(function (res) {
            _this.headers_res = res.headers._headers;
            _this.per_page = _this.headers_res.get('x-per-page');
            _this.total_page = _this.headers_res.get('x-total');
            _this.current_page = _this.headers_res.get('x-page');
            res = res.json();
            _this.project_list = res['projects'];
            _this.loaderService.display(false);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    DashboardComponent.prototype.nextPage = function (page) {
        var _this = this;
        this.loaderService.display(true);
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.getProjectList(page);
        });
    };
    DashboardComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__("./src/app/platform/business-head/dashboard/dashboard.component.html"),
            styles: [__webpack_require__("./src/app/platform/business-head/dashboard/dashboard.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_3__business_head_service__["a" /* BusinessHeadService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__services_loader_service__["a" /* LoaderService */],
            __WEBPACK_IMPORTED_MODULE_3__business_head_service__["a" /* BusinessHeadService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */],
            __WEBPACK_IMPORTED_MODULE_5__lead_lead_service__["a" /* LeadService */],
            __WEBPACK_IMPORTED_MODULE_4__angular_forms__["b" /* FormBuilder */]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ })

});
//# sourceMappingURL=business-head.module.chunk.js.map