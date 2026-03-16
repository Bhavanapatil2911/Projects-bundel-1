webpackJsonp(["emicalculator.module"],{

/***/ "./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.css":
/***/ (function(module, exports) {

module.exports = "#slidecontainer {\n   width: 100%;\n}\n\n.title {\n  padding: 1.4rem 0rem;\n  background-color: #f7f7f7;\n  position: fixed;\n  width: 93.4%;\n  z-index: 4;\n  border-bottom: 1px solid #ccc;\n}\n\n.title h3 {\n  margin-bottom: 0;\n  margin-left: 10px;\n  font-size: 20px;\n  color: rgba(0, 0, 0, 0.55);\n}\n\n.title h3 span {\n  color: #000;\n}\n\n.marginTop{\n    margin-top: 4.2rem;\n}\n\n.slider {\n    -webkit-appearance: none;\n    width: 35.6rem;\n    height: 10px;\n    border-radius: 5px;\n    background: #e0f7fa;\n    outline: none;\n    -webkit-transition: .2s;\n    -webkit-transition: opacity .2s;\n    transition: opacity .2s;\n    border: 1px solid #0097a7;\n}\n\n.slider::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    appearance: none;\n    width: 17px;\n    height: 17px;\n    border-radius: 20px;\n    background: #4CAF50;\n    cursor: pointer;\n    margin-top: -1px;\n    color: #0097a7 !important;\n}\n\n.slider::-moz-range-thumb {\n    width: 17px;\n    height: 17px;\n    border-radius: 20px;\n    background: #4CAF50;\n    cursor: pointer;\n    margin-top: -1px;\n    color: #0097a7 !important;\n}\n\n#slidecontainer input{\n    margin-bottom: 1.5rem;\n}\n\n.emi{\n    border-left: 4px solid #ccc;\n}\n\ninput[type=number]::-webkit-inner-spin-button,\ninput[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n\n.rate{\n    max-width: 10rem;\n    padding: 0 0 0 1rem;\n}\n\n.form-control:disabled, .form-control[readonly]{\n    background-color: #fff;\n}\n\n.input-group-addon{\n    min-width: 2.5rem;\n}"

/***/ }),

/***/ "./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row title\">\n  <h3>Dashboard / <span>EMI Calculator</span></h3>\n</div>\n<form class=\"viewProfileForm\" [formGroup]=\"emicalculatorForm\" (ngSubmit)=\"onSubmit(emicalculatorForm.value);\">\n  <div class=\"row marginTop\">\n    <div class=\"col-12 my-5\">\n      <h5 class=\"emi pl-1\">EMI Calculator</h5>\n    </div>\n  </div>\n\n  <div class=\"row mt-4 justify-content-center\">\n    <div class=\"col-sm-11 col-md-10 col-lg-2\">\n      <p class=\"mt-1\">Loan Amount</p>\n    </div>\n    <div class=\"col-sm-11 col-md-10 col-lg-6\">\n      <form class=\"viewProfileForm\" [formGroup]=\"emicalculatorForm\" (ngSubmit)=\"onSubmit(emicalculatorForm.value);\">\n        <div class=\"form-group text-center\">\n            <div class=\"slidecontainer\">            \n              <input type=\"range\" min=\"0\" max=\"10000000\" step=\"100000\" value=\"1\" class=\"slider\" id=\"loanAmtRange\" formControlName=\"principal\" (input)=\"sliderOnInput($event.target.value,'loanamount')\">\n              <p class=\"text-danger\" *ngIf=\"amtMsg\"> Please select valid amount.</p>\n            </div>\n        </div>\n      </form>\n    </div>\n    <div class=\"col-sm-11 col-md-10 col-lg-2\">\n      <div class=\"input-group\">\n        <input type=\"text\" class=\"form-control rate\" readonly id=\"inlineFormInputGroup amtval\" [(ngModel)]=\"output\" [ngModelOptions]=\"{standalone: true}\">\n        <div class=\"input-group-addon\"><i class=\"fa fa-inr\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row mt-4 justify-content-center\">\n    <div class=\"col-sm-11 col-md-10 col-lg-2\">\n      <p class=\"mt-1\">Loan Tenure</p>\n    </div>\n    <div class=\"col-sm-11 col-md-10 col-lg-6\">\n      <form class=\"viewProfileForm\" [formGroup]=\"emicalculatorForm\" (ngSubmit)=\"onSubmit(emicalculatorForm.value);\">\n        <div class=\"form-group text-center\">\n            <div class=\"slidecontainer\">            \n              <input type=\"range\" min=\"0\" max=\"30\" step=\"1\" value=\"0\" class=\"slider\" id=\"tenure\" formControlName=\"tenure\" (input)=\"sliderOnInput($event.target.value,'tenure')\">\n              <p class=\"text-danger\" *ngIf=\"tenureMsg\"> Please select valid tenure.</p>\n            </div>\n        </div>\n      </form>\n    </div>\n    <div class=\"col-sm-11 col-md-10 col-lg-2\">\n      <div class=\"input-group\">\n        <input type=\"text\" class=\"form-control rate\" readonly id=\"inlineFormInputGroup tenureval\" [(ngModel)]=\"output1\" [ngModelOptions]=\"{standalone: true}\">\n        <div class=\"input-group-addon\"><i class=\"fa fa-calendar\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row mt-4 justify-content-center\">\n    <div class=\"col-5 text-right\">\n      <label class=\"mt-1\">Current Interest Rate</label>\n    </div>\n    <div class=\"col-6\">\n      <div class=\"input-group mb-2 mb-sm-0\">\n        <input type=\"number\" min=\"0\" formControlName=\"rate\" class=\"form-control rate m-0\" id=\"inlineFormInputGroup\" placeholder=\"Interest Rate\"  (keydown)=\"numberCheck($event)\">\n        <div class=\"input-group-addon\">%</div>\n      </div>\n      <div *ngIf=\"emicalculatorForm.controls['rate'].invalid && (emicalculatorForm.controls['rate'].dirty || emicalculatorForm.controls['rate'].touched)\" class=\" text-danger\">\n        <p *ngIf=\"emicalculatorForm.controls['rate'].errors.required\"> Rate is required.</p>\n        <p *ngIf=\"emicalculatorForm.controls['rate'].errors.min\"> Invalid interest rate .</p>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row mt-4 text-center\">\n    <div class=\"col-12\">\n      <button class=\"button mt-3\" type=\"submit rk-interalBtnColor\"  [disabled]=\"!emicalculatorForm.valid\">Calculate</button>\n    </div>\n  </div>\n\n  <div class=\"row mt-5 mb-3 justify-content-center\" *ngIf=\"emicalculationResponse\">\n    <div class=\"col-sm-11 col-md-10 col-lg-6\">\n      <div class=\"border py-5\">\n        <div class=\"row\">\n          <div class=\"col-5 text-right\">\n            <label class=\"currentEmi\">Current EMI</label>\n          </div>\n          <div class=\"col-6\">\n            <div class=\"input-group\">\n              <input type=\"number\" class=\"currentEmiPrice pl-2\" placeholder=\"{{emicalculationResponse.emi}}\" readonly>\n              <div class=\"input-group-addon\"><i class=\"fa fa-inr\" aria-hidden=\"true\"></i></div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row mb-5 justify-content-center\" *ngIf=\"emicalculationResponse\">\n    <div class=\"col-sm-11 col-md-10 col-lg-6\">\n      <div class=\"border py-5\">\n        <div class=\"row justify-content-center\">\n          <div class=\"col-5\">\n            <p>New Interest Rate : </p>\n          </div>\n          <div class=\"col-4\">\n            <p>8.55 %</p>\n          </div>\n          <div class=\"col-5\">\n            <p>New EMI : </p>\n          </div>\n          <div class=\"col-4\">\n            <p><i class=\"fa fa-inr\" aria-hidden=\"true\"></i> {{emicalculationResponse.arrivae_emi}}</p>\n          </div>\n          <div class=\"col-10\">\n            <hr>\n          </div>\n          <div class=\"col-5\">\n            <p>Savings per month: </p>\n          </div>\n          <div class=\"col-4\">\n            <p><i class=\"fa fa-inr\" aria-hidden=\"true\"></i> {{emicalculationResponse.emi_saving}}</p>\n          </div>\n          <div class=\"col-5\">\n            <p>Total Savings : </p>\n          </div>\n          <div class=\"col-4\">\n            <p><i class=\"fa fa-inr\" aria-hidden=\"true\"></i> {{emicalculationResponse.total_saving}}</p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</form>\n"

/***/ }),

/***/ "./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateEmicalculatorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__emicalculator_service__ = __webpack_require__("./src/app/platform/emicalculator/emicalculator.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CreateEmicalculatorComponent = /** @class */ (function () {
    function CreateEmicalculatorComponent(emicalculatorService, formBuilder, loaderService) {
        this.emicalculatorService = emicalculatorService;
        this.formBuilder = formBuilder;
        this.loaderService = loaderService;
        this.amtMsg = false;
        this.tenureMsg = false;
        this.output = 0;
        this.output1 = 0;
    }
    CreateEmicalculatorComponent.prototype.ngOnInit = function () {
        this.emicalculatorForm = this.formBuilder.group({
            principal: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]("0", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required]),
            rate: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].min(8.56)]),
            tenure: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]("0", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required)
        });
    };
    CreateEmicalculatorComponent.prototype.onSubmit = function (data) {
        var _this = this;
        if (data.tenure == 0) {
            this.tenureMsg = true;
        }
        if (data.principal == 0) {
            this.amtMsg = true;
        }
        if (data.principal != 0 && data.tenure != 0) {
            this.loaderService.display(true);
            data.tenure = data.tenure * 12;
            this.emicalculatorService.calculateEmi(data).subscribe(function (res) {
                _this.emicalculationResponse = res;
                _this.loaderService.display(false);
            }, function (err) {
                _this.loaderService.display(false);
            });
        }
    };
    CreateEmicalculatorComponent.prototype.sliderOnInput = function (val, sliderName) {
        if (sliderName == 'loanamount') {
            this.amtMsg = false;
            var slider = document.getElementById("loanAmtRange");
            this.output = val;
        }
        if (sliderName == 'tenure') {
            this.tenureMsg = false;
            var slider = document.getElementById("tenure");
            this.output1 = val + " Year";
        }
    };
    CreateEmicalculatorComponent.prototype.ngAfterViewInit = function () {
        document.getElementById("amtval").innerHTML = '0';
        document.getElementById("tenureval").innerHTML = '0';
    };
    CreateEmicalculatorComponent.prototype.numberCheck = function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 40
            || e.keyCode == 110 || e.keyCode == 190 || e.keyCode == 17
            || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
            return false;
        }
    };
    CreateEmicalculatorComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-create-emicalculator',
            template: __webpack_require__("./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.html"),
            styles: [__webpack_require__("./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_1__emicalculator_service__["a" /* EmicalculatorService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__emicalculator_service__["a" /* EmicalculatorService */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_2__services_loader_service__["a" /* LoaderService */]])
    ], CreateEmicalculatorComponent);
    return CreateEmicalculatorComponent;
}());



/***/ }),

/***/ "./src/app/platform/emicalculator/emicalculator-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmicalculatorRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__ = __webpack_require__("./src/app/authentication/logged-in-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_emicalculator_create_emicalculator_component__ = __webpack_require__("./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_3__create_emicalculator_create_emicalculator_component__["a" /* CreateEmicalculatorComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]]
    },
];
var EmicalculatorRoutingModule = /** @class */ (function () {
    function EmicalculatorRoutingModule() {
    }
    EmicalculatorRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */]]
        })
    ], EmicalculatorRoutingModule);
    return EmicalculatorRoutingModule;
}());



/***/ }),

/***/ "./src/app/platform/emicalculator/emicalculator.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmicalculatorModule", function() { return EmicalculatorModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_shared_module__ = __webpack_require__("./src/app/shared/shared.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__emicalculator_routing_module__ = __webpack_require__("./src/app/platform/emicalculator/emicalculator-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__create_emicalculator_create_emicalculator_component__ = __webpack_require__("./src/app/platform/emicalculator/create-emicalculator/create-emicalculator.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ngx_pipes__ = __webpack_require__("./node_modules/ngx-pipes/fesm5/ngx-pipes.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var EmicalculatorModule = /** @class */ (function () {
    function EmicalculatorModule() {
    }
    EmicalculatorModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_7_ngx_pipes__["a" /* NgPipesModule */],
                __WEBPACK_IMPORTED_MODULE_5__emicalculator_routing_module__["a" /* EmicalculatorRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["j" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__shared_shared_module__["a" /* SharedModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_router__["g" /* RouterModule */],
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_6__create_emicalculator_create_emicalculator_component__["a" /* CreateEmicalculatorComponent */]]
        })
    ], EmicalculatorModule);
    return EmicalculatorModule;
}());



/***/ }),

/***/ "./src/app/platform/emicalculator/emicalculator.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmicalculatorService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("./node_modules/@angular/http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angular2_token__ = __webpack_require__("./node_modules/angular2-token/fesm5/angular2-token.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__authentication_auth_service__ = __webpack_require__("./src/app/authentication/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var EmicalculatorService = /** @class */ (function () {
    function EmicalculatorService(http, tokenService, authService) {
        this.http = http;
        this.tokenService = tokenService;
        this.authService = authService;
        this.emicalculatorUrl = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/price_configurators/emicalculator';
        this.options = this.authService.getHeaders();
    }
    EmicalculatorService.prototype.calculateEmi = function (data) {
        var price_configurator = {
            data: data
        };
        return this.http.post(this.emicalculatorUrl, data, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    };
    EmicalculatorService.prototype.extractData = function (res) {
        var body = res.json();
        return body;
    };
    EmicalculatorService.prototype.handleErrorObservable = function (error) {
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */].throw(error.message || error);
    };
    EmicalculatorService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_6_angular2_token__["a" /* Angular2TokenService */],
            __WEBPACK_IMPORTED_MODULE_7__authentication_auth_service__["a" /* AuthService */]])
    ], EmicalculatorService);
    return EmicalculatorService;
}());



/***/ })

});
//# sourceMappingURL=emicalculator.module.chunk.js.map