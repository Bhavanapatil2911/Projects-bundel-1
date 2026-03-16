webpackJsonp(["user-roles.module"],{

/***/ "./src/app/platform/user-roles/listusers/listusers.component.css":
/***/ (function(module, exports) {

module.exports = ".body_height {\n    min-height: 90vh;\n}\n.clear{\n  height: 18px;\n  font-size: 18px;\n  color: #999999;\n  margin-top: -5.5px;\n  \n}\n.pointer{\n  cursor: pointer;\n}\n.search{\n  margin-left:-90px\n}\n.adjust{\n  margin: 0px 0px 0px -7px;\n}\n.marginTop {\n  margin-top: 5rem;\n}\n.segment{\n  padding-left: 3.5rem;\n}\na{\n    color: #000;\n}\n.tableDiv{\n  overflow: scroll;\n}\n.table{\n/*     margin-bottom: 0.1rem;\n    background-color: #fff; */\n  border-collapse: separate;\n  border-spacing: 0 5px;\n}\n.title{\n    padding: 1.4rem 0rem;\n    background-color: #f7f7f7;\n    position: fixed;\n    width: 83.4%;\n    z-index: 4;\n    border-bottom: 1px solid #ccc;\n}\n.title h3{\n    margin-bottom: 0;\n    margin-left: 10px;\n    font-size: 20px;\n    color: rgba(0, 0, 0, 0.55);\n}\n.title h3 span{\n    color: #000;\n}\ninput.searchBox{\n    border-radius: 6px;\n    border: 1px solid #000;\n    padding: 3px;\n    position: absolute;\n    right: 7.6rem;\n    width: 2.2rem;\n    background-color: transparent;\n    z-index: 1;\n    top: 18px;\n}\ninput.searchBox:focus{\n    outline: none;\n    width: 10rem;\n}\np.searchIcon{\n    position: absolute;\n    right: 8.2rem;\n    font-size: 16px;\n    top: 23px;\n    margin: 0;\n    color: #666;\n}\n.activeCol{\n    width: 15%;\n}\n.close:focus{\n    outline: none;\n}\np.Invite{\n    font-size: 16px;\n    position: absolute;\n    right: 1.2rem;\n    top: 18px;\n    border: 1px solid #666;\n    color: #666;\n    padding: 4px 10px 2px 10px;\n    border-radius: 5px;\n    cursor: pointer;\n    margin: 0;\n}\np.Invite:hover{\n    background-color: #ebebeb;\n    color: #000;\n}\np.Invite1{\n    right: 4.3rem;\n}\n.btn-secondary.dropdown-toggle {\n    background-color: #ffffff;\n    border-color: #6c757d;\n    color: #000;\n    padding: 6px 12px;\n    float: right;\n}\n.table td{\n    padding: 0.7rem 0.75rem;\n    vertical-align: middle;\n    font-size: 15px;\n    color: rgba(0, 0, 0, 0.7);\n    border: none;\n    overflow: hidden;\n}\n.table th {\n  padding: .9rem;\n  vertical-align: middle;\n  border: none;\n  font-size: 12px;\n  color: #dedede;\n  text-transform: uppercase;\n  background-color: #4a4a4a;\n}\n/*select.form-control:not([size]):not([multiple]) {\n    height: calc(2.25rem + -4px);\n}*/\nbutton.modalButton{\n    padding: 4px 25px;\n    background-color: #8c031f;\n    color: #fff;\n    border: none;\n    cursor: pointer;\n}\nbutton.modalButton:hover{\n    background-color: #8c031f !important;\n}\nbutton.button{\n  padding: 5px 0px;\n  width: 36px;\n  background-color: #cacaca;\n  vertical-align: middle;\n  margin-top: -5px;\n}\nbutton.button:hover{\n    background-color: #808080;\n    color: #fff;\n}\ninput[type=number]::-webkit-inner-spin-button,\ninput[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.inputBorder {\n    border-color: red;\n}\n/* ################################################### */\n/* .tableDiv{\n  background-color: #fff;\n  padding: 15px;\n} */\n.tableDiv tbody{\n  background-color: #fff;\n}\n.tableDiv tbody tr{\n  -webkit-box-shadow: 1px 1px 7px 0px #dadada;\n          box-shadow: 1px 1px 7px 0px #dadada;\n  border-radius: 5px;\n}\n.firstTh{\n  border-radius: 5px 0 0 0;\n}\n/* .lastTh{\n  border-radius: 0px 5px 0 0;\n} */\nselect.form-control:not([size]):not([multiple]){\n  font-size: 14px;\n}\n.ss-send-circle {\n  vertical-align: text-bottom;\n}\n/* ################################################### */\n/* @media (min-width: 1500px) {\n  thead.tHead{\n    position: absolute;\n    width: calc(100% - 30px);\n    display: table;\n    top: -2.6rem;\n  }\n} */\n@media (min-width: 992px){\n  #getUserCategorySplit .modal-lg {\n    max-width: 987px;\n }\n}\n.external {\n  color: #8F0020bd;\n}\n.internal {\n  color: green;\n}\n.champion-label1 {\n  position: relative;\n  bottom:0.7rem;\n  width: 2.5rem;\n  height: 1rem;\n  display: inline-block;\n  font-size: 0;\n  border-radius: 2rem;\n  -webkit-transition: background-color 0.2s ease-in-out;\n  transition: background-color 0.2s ease-in-out;\n  background-color: green;\n}\n.champion-label1::before {\n  content: \"\";\n  position: absolute;\n  top: 0rem;\n  left: 1.4rem;\n  height: 1rem;\n  width: 1rem;\n  background-color: white;\n  border-radius: 50%;\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  transition: -webkit-transform 0.2s ease-in-out;\n  -webkit-transition: -webkit-transform 0.2s ease-in-out;\n  transition: transform 0.2s ease-in-out;\n  transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;\n}\n.checkbox:checked + .champion-label1 {\n  border: 1px solid;\n  background-color: #8F0020bd;\n}\n.checkbox:checked + .champion-label1::before {\n  -webkit-transform: translate3d(1.2rem, 0, 0);\n  transform: translate3d(1.2rem, 0, 0);\n  left: -1.2rem;\n}\n.champion-status {\n  /* color: #515151; */\n  position: relative;\n  top: 0.5rem;\n  left: 0.25rem;\n}\n"

/***/ }),

/***/ "./src/app/platform/user-roles/listusers/listusers.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"row title\">\n  <h3>Dashboard / <span>User Management</span></h3>\n  <span data-toggle=\"modal\" data-target=\"#inviteModal\"><p class=\"Invite\" data-toggle=\"tooltip\" title=\"Invite User\" data-placement=\"left\" *ngIf=\"updateRoleAccess && (updateRoleAccess.length>0) && (updateRoleAccess.indexOf(role) > -1)\" id=\"tooltipinviteuser\" (click)=\"hideValidationMsg()\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i></p></span>\n  <input class=\"searchBox addCursor\" #search (keyup)=\"0\">\n  <p class=\"searchIcon\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></p> -->\n  <!-- <button class=\"addCursor\" (click)=\"downloadFile(exportFileData)\">Export</button> -->\n<!--   <p class=\"Invite Invite1\" data-toggle=\"tooltip\" title=\"Export\" data-placement=\"left\"  id=\"tooltipinviteuser\" (click)=\"exportLeads()\"><i class=\"fa fa-download\" aria-hidden=\"true\"></i></p>\n</div> -->\n\n<div class=\"row ss-top-menu justify-content-between\" style=\"padding-bottom: 3rem;\" >\n  <div class=\"col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3 align-self-center\">\n    <span class=\"ss-text-light\" style=\"vertical-align: -webkit-baseline-middle;\">Dashboard <i class=\"rightArrow fa fa-angle-right\"></i> </span>\n    <span class=\"ss-text-dark\" style=\"vertical-align: -webkit-baseline-middle;\">User Management</span>\n  </div>\n  <div class=\"col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3 align-self-center  search \">\n    <div class=\"row justify-content-between\">\n      <div class=\"ss-searchbox col-9 d-flex\">\n        <input class=\"form-control \" name=\"search\" type=\"text\" placeholder=\"Type name, email, contact to search...\" [(ngModel)]=\"search\">\n        <span *ngIf =\" search!='' \" (click)=\"clearSearch()\" class=\"clear pointer\">&times;</span>\n      </div>\n      <div class=\"col-3\">\n      <button class=\"rk-interalBtnColor pointer\"(click)=\"getUserListFromService(current_page)\">Search</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-5  align-self-center\">\n    <div class=\"row\">\n      <div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 align-self-center\">\n    <div class=\"d-flex align-items-center row\">\n        <p class=\"col-5  pl-1 m-0\">Filter by Store </p>\n        <div class=\"col-7 p-0 adjust\">\n        <ng-select (change)=\"selectStore($event)\" style=\"width: calc(100%);\" class=\"downloadBtn filter-status  p-0 \"  placeholder=\"Select Store\" [(ngModel)]=\"(store=='') ? null : store\" >\n           \n        <ng-option *ngFor = \"let store  of ListingStore\" value = \"{{store.id}}\">\n            {{store.name}}\n        </ng-option>\n      </ng-select>\n      </div>\n    </div>\n      </div>\n      <div class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 align-self-center\">\n    <div class=\"d-flex align-items-center row\">\n      <p class=\"m-0 col-5 pl-3 pr-0\">Filter By Role</p>\n      <div class=\"col-7 p-0\">\n      <ng-select (change)=\"selectRole($event)\" placeholder=\"Select Role\" class=\" p-0\" [(ngModel)]=\"(Role=='') ? null : Role\">\n         <!-- <ng-select>\n        <select class=\"form-control col-9 d-inline-block\" (change)=\"onDropdownChange(user.id,$event.target.value,i)\" id=\"updaterolerow{{user.id}}\" *ngIf=\"user.roles != 'vendor'\">  -->\n          <ng-option  value=\"design_head\">Design Head</ng-option>\n          <ng-option value=\"category_head\">Category Head</ng-option>\n          <ng-option value=\"category_services\">Category Services</ng-option>\n          <ng-option value=\"category_panel\" >Category Panel</ng-option>\n          <ng-option value=\"category_non_panel\">Category Non Panel</ng-option>\n          <ng-option value=\"community_manager\" >Community Manager</ng-option>\n          <ng-option value=\"designer\">Designer</ng-option>\n          <ng-option value=\"City_GM\">City GM</ng-option>\n          <ng-option value=\"deputy_general_manager\">Deputy General Manager </ng-option>\n          <ng-option value=\"business_head\" >Business Head </ng-option>\n          <ng-option value=\"Admin\" >Admin </ng-option>\n          <ng-option  value=\"lead_head\">Lead Head</ng-option>\n          <ng-option value=\"design_manager\" >Design Manager</ng-option>\n          <ng-option value=\"finance\" >Finance</ng-option>\n          <ng-option value=\"cs_agent\" >CS Agent</ng-option>\n          <ng-option value=\"store_manager\">Store Manager</ng-option>\n          <ng-option value=\"customer\">Customer</ng-option>\n          <ng-option value=\"customer_head\">Customer Head</ng-option>\n          <ng-option value=\"catalogue_head\">Catalogue Head</ng-option>\n          <ng-option value=\"broker\" >Broker</ng-option>\n          <ng-option value=\"manufacturer\" >Manufacturer</ng-option>\n          <ng-option value=\"category\" >Category </ng-option>\n          <ng-option value=\"sitesupervisor\" >Site Supervisor </ng-option>\n          <ng-option value=\"cad\" >CAD </ng-option>\n          <ng-option value=\"sales_manager\" >Sales Manager </ng-option>\n          <ng-option value=\"area_sales_manager\" >Area Sales Manager </ng-option>\n          <ng-option value=\"vendor\" >Vendor </ng-option>\n          <ng-option value=\"referral\" >Referral</ng-option>\n          <ng-option value=\"order_manager\" >Order Manager</ng-option>\n          <ng-option value=\"catalog_viewer\" >Catalog Viewer</ng-option>\n          <ng-option value=\"employee_referral\" >Employee Referral </ng-option>\n          <ng-option value=\"design_partner_referral\" >Design Partner Referral </ng-option>\n          <ng-option value=\"client_referral\" >Client Referral</ng-option>\n          <ng-option value=\"display_dealer_referral\" >Display Dealer Referral </ng-option>\n          <ng-option value=\"non_display_dealer_referral\" >Non Display Dealer Referral</ng-option>\n          <ng-option value=\"arrivae_champion\" >Arrivae Champion</ng-option>\n          <ng-option value=\"others\" >Others</ng-option>\n          <ng-option value=\"associate_partner\" >Associate Partner</ng-option>\n          <ng-option value=\"developer_role\" >Developer Role </ng-option>\n          <ng-option value=\"nps_executive\" >NPS Executive</ng-option>\n          <ng-option value=\"nps_manager\" >NPS Manager </ng-option>\n          \n\n          <!-- </select> -->\n      </ng-select>\n      </div>\n    </div>\n      </div>\n    </div>\n  </div>    \n  <div class=\"col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1 align-self-center d-flex p-0\" >\n    <!-- <div class=\"row\">\n      <div class=\"col-md-5 align-self-center mt-3\"> -->\n    <div class=\"dropdown pull-right m-0 p-0\" >\n      <button class=\"btn btn-pink dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n        Action\n      </button>\n      <!-- <button class=\"bt-boq btn btn-pink mr-2 ml-1 p-2 pull-right\" type=\"button\" data-toggle=\"modal\" data-target=\"#inviteChampionModal\"\n      *ngIf = \"is_champion=='true'\" (click)=\"referralinvitechampions.getChampionList()\">Invite Level 2 & Level 3 User</button> -->\n      <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\">\n        <a class=\"dropdown-item\" data-toggle=\"modal\" data-target=\"#inviteModal\" *ngIf=\"updateRoleAccess && (updateRoleAccess.length>0) && (updateRoleAccess.indexOf(role) > -1)\" id=\"tooltipinviteuser\" (click)=\"hideValidationMsg()\">Invite User</a>\n        <a class=\"dropdown-item\" (click)=\"exportLeads()\">Export User</a>\n      </div>\n    </div>\n    <!-- </div> -->\n    <!-- <div class=\"col-md-8\"></div> -->\n    <!-- </div> -->\n  </div>\n</div>\n  \n\n\n\n<!-- <div class=\"marginTop row\">\n  <div class=\"col-12\" *ngIf=\"erroralert\">\n    <div class=\"alert-box grid-100\" *ngIf=\"errorMessage\">\n      <div class=\"alert alert-danger mt-3 text-center\">\n        <a class=\"close link\" data-dismiss=\"alert\" (click)=\"erroralert=false\">×</a>\n        {{errorMessage}}\n      </div>\n    </div>\n  </div>\n  <div class=\"col-12\" *ngIf=\"successalert\">\n    <div class=\"alert-box grid-100\" *ngIf=\"successMessage\">\n      <div class=\"alert alert-success mt-3 text-center\">\n        <a class=\"close link\" data-dismiss=\"alert\"  (click)=\"successalert=false\">×</a>\n        {{successMessage}}\n      </div>\n    </div>\n  </div>\n</div> -->\n\n<div class=\"rk-ui-notification err\" *ngIf=\"erroralert\"  style=\"z-index: 10000;\">\n  <span id=\"notificationMessageText\">{{errorMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"erroralert=false\">×</a>\n</div>\n<div class=\"rk-ui-notification\" *ngIf=\"successalert\"  style=\"z-index: 10000;\">\n  <span id=\"notificationMessageText\">{{successMessage}}</span>\n  <a class=\"close rk-linknotification\" (click)=\"successalert=false\">×</a>\n</div>\n\n<div class=\"row mt-2\">\n  <div class=\"col-md-12\">\n    <div class=\"tableDiv\" style=\"overflow-x: auto;\">\n      <table class=\"table\" *ngIf=\"users\">\n        <thead class=\"tHead\">\n          <tr>\n            <th class=\"text-center firstTh\" style=\"min-width: 70px;\">ID</th>\n            <th style=\"min-width: 180px;\">Name</th>\n            <th style=\"min-width: 250px;\">Email</th>\n            <th style=\"min-width: 150px;\">Contact</th>\n            <th style=\"min-width: 100px;\">Roles</th>\n            <th style=\"min-width: 200px; text-align: center;\">Champion</th>\n\n            <!-- <th>Actions</th> -->\n            <th style=\"min-width: 260px;\" class=\"lastTh\" *ngIf=\"updateRoleAccess && (updateRoleAccess.length>0) && (updateRoleAccess.indexOf(role) > -1) \">Update Role</th>\n            <th style=\"min-width: 158px;\"></th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let user of users | paginate: { itemsPerPage: per_page, currentPage: current_page, totalItems: total_page  }; let i = index\" [attr.data-index]=\"i\">\n            <td class=\"text-center\" style=\"min-width: 70px;\">{{user.id}}</td>\n            <td class=\"capitalize\"  style=\"min-width: 180px;\">{{user.name}}</td>\n            <td style=\"min-width: 250px;\">{{user.email}}</td>\n            <td style=\"min-width: 150px;\">{{user.contact}}</td>\n            <td style=\"min-width: 100px;\">{{user.roles[0] | replaceChar | ucwords}}</td>\n\n            <td style=\"min-width: 200px;\" class=\"text-center\">\n              <span class=\"champion-status pl-3 external\">No</span>\n              <input class=\"checkbox\" name=\"checkbox\" id=\"checkbox{{user.id}}\" type=\"checkbox\"\n              [checked]=\"!user.is_champion\"  style=\"display: none; padding-left: 0px;\" />\n              <label class=\"champion-label1 ml-2 mb-0\" for=\"checkbox{{user.id}}\" (click)=\"championToggleButton(user.id, $event)\">label</label>\n              <span class=\"champion-status pl-2 internal\">Yes</span>\n             </td>\n\n            <td style=\"min-width: 260px;\" *ngIf=\"updateRoleAccess && (updateRoleAccess.length>0) && (updateRoleAccess.indexOf(role) > -1) \">\n              <select class=\"form-control col-9 d-inline-block\" (change)=\"onDropdownChange(user.id,$event.target.value,i)\" id=\"updaterolerow{{user.id}}\" *ngIf=\"user.roles != 'vendor'\">\n                <option value=\"\">Update Role To</option>\n                <option *ngIf=\"user.roles != 'design_head'\" value=\"design_head\">Design Head</option>\n                <option *ngIf=\"user.roles != 'lead_head'\" value=\"lead_head\">Lead Head</option>\n                <option *ngIf=\"user.roles != 'customer_head'\" value=\"customer_head\">Customer Head</option>\n                <option *ngIf=\"user.roles != 'catalogue_head'\" value=\"catalogue_head\">Catalogue Head</option>\n                <option *ngIf=\"user.roles != 'customer'\" value=\"customer\">Customer</option>\n                <option value=\"designer\" *ngIf=\"user.roles != 'designer'\">Designer</option>\n                <option value=\"broker\" *ngIf=\"user.roles != 'broker'\">Broker</option>\n                <option value=\"manufacturer\" *ngIf=\"user.roles != 'manufacturer'\">Manufacturer</option>\n                <option value=\"cs_agent\" *ngIf=\"user.roles != 'cs_agent'\">CS Agent</option>\n                <option value=\"community_manager\" *ngIf=\"user.roles !='community_manager' \">Community Manager</option>\n                <option value=\"finance\" *ngIf=\"user.roles !='finance' \">Finance</option>\n                <option value=\"category\" *ngIf=\"user.roles !='category' \">Category </option>\n                <option value=\"sitesupervisor\" *ngIf=\"user.roles !='sitesupervisor' \">Site Supervisor </option>\n                <option value=\"cad\" *ngIf=\"user.roles !='cad' \">CAD </option>\n                <option value=\"sales_manager\" *ngIf=\"user.roles !='sales_manager' \">Sales Manager </option>\n                <option value=\"area_sales_manager\" *ngIf=\"user.roles !='area_sales_manager' \">Area Sales Manager </option>\n                <option value=\"vendor\" *ngIf=\"user.roles !='vendor' \">Vendor </option>\n                <option value=\"referral\" *ngIf=\"user.roles !='referral' \">Referral</option>\n                <option value=\"order_manager\" *ngIf=\"user.roles !='order_manager' \">Order Manager</option>\n                <option value=\"catalog_viewer\" *ngIf=\"user.roles !='catalog_viewer' \">Catalog Viewer</option>\n                <option value=\"employee_referral\" *ngIf=\"user.roles !='employee_referral' \">Employee Referral </option>\n                <option value=\"design_partner_referral\" *ngIf=\"user.roles !='design_partner_referral' \">Design Partner Referral</option>\n                <option value=\"client_referral\" *ngIf=\"user.roles !='client_referral' \">Client Referral</option>\n                <option value=\"display_dealer_referral\" *ngIf=\"user.roles !='display_dealer_referral' \">Display Dealer Referral</option>\n                <option value=\"non_display_dealer_referral\" *ngIf=\"user.roles !='non_display_dealer_referral' \">Non Display Dealer Referral </option>\n                <option value=\"business_head\" *ngIf=\"user.roles !='business_head' \">Business Head </option>\n                <option value=\"arrivae_champion\" *ngIf=\"user.roles !='arrivae_champion' \">Arrivae Champion </option>\n                <option value=\"others\" *ngIf=\"user.roles !='others' \">Others </option>\n                <option value=\"associate_partner\" *ngIf=\"user.roles !='associate_partner' \">Associate partner</option>\n                <option value=\"developer\" *ngIf=\"user.roles !='developer'\"> Developer Role</option>\n                <option value=\"city_gm\" *ngIf=\"user.roles !='city_gm'\"> General Manager</option>\n                <option value=\"category_head\" *ngIf=\"user.roles !='category_head'\">CATEGORY HEAD</option>\n                <option value=\"design_manager\" *ngIf=\"user.roles !='design_manager'\">Design Manager</option>\n                <option value=\"category_panel\" *ngIf=\"user.roles !='category_panel'\">Category Panel</option>\n                <option value=\"category_non_panel\" *ngIf=\"user.roles !='category_non_panel'\">Category Non Panel</option>\n                <option value=\"category_services\" *ngIf=\"user.roles !='category_services'\">Category Services</option>\n                 <option *ngIf=\"user.roles !='store_manager'\" value=\"store_manager\">Store Manager</option>\n                 <option *ngIf=\"user.roles !='deputy_general_manager'\" value=\"deputy_general_manager\">Deputy General Manager </option>\n              </select>\n              <i class=\"downArrow fa fa-angle-down\"></i>\n              <i class=\"ion-android-send ss-send-circle\" (click)=\"updateRole(user.id,i)\" *ngIf=\"user.roles != 'vendor'\"></i>\n            </td>\n            <td>\n              <button *ngIf = \"user.roles[0] !== 'customer' \" (click) = \"openPasswordModal(user.id)\"  style=\"background-color: #8C031F; color: white; border: none; padding: 0.3rem; border-radius: 4px;\" type=\"button\" class=\"btn btn-primary\"  data-target=\"#updatePassword\" class=\"cursor-pointer\">Update Password</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n      <div class=\"text-center\" *ngIf=\"users && users.length > 0\">\n        <pagination-controls autoHide=\"true\" (pageChange)=\"current_page = getUserListFromService($event)\"></pagination-controls>\n      </div>\n      <ng-container *ngIf = \"users &&  users.length === 0\">\n        <img src=\"../../../assets/img/desktop.png\" class=\"d-block mx-auto\"/>\n      </ng-container>\n    </div>\n  </div>\n</div>\n\n  <!-- update password modal -->\n  <div class=\"modal fade\" id=\"updatePassword\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"updatePasswordLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\" role=\"document\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header justify-content-end px-3 py-2\">\n          <button  type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">&times;</span>\n          </button>\n        </div>\n        <div class=\"modal-body pt-2\">\n          <h5 class=\"modal-title pb-2\" id=\"updatePasswordLabel\">Update Password</h5>\n          <form [formGroup]=\"PasswordUpdate\">\n            <div class=\"form-group\">\n              <label for=\"exampleInputEmail1\">Password</label>\n              <input formControlName=\"password\" type=\"password\" class=\"form-control\" id=\"exampleInputEmail1\" aria-describedby=\"emailHelp\" placeholder=\"Password\">\n              <ng-container *ngIf=\"passwordDataSubmit && PasswordUpdate.controls.password.errors\">\n                  <span class=\"text-danger\" *ngIf=\"PasswordUpdate.controls.password.errors.required\">Password is required</span>\n                  <span *ngIf=\"PasswordUpdate.controls.password.errors.minlength\" class=\"text-danger\">Password must be at least 8 characters</span>\n              </ng-container>\n            </div>\n            <div iv class=\"form-group\">\n              <label for=\"exampleInputPassword1\">Confirm Password</label>\n              <input formControlName=\"confirm_password\" type=\"password\" class=\"form-control\" id=\"exampleInputPassword1\" placeholder=\"Confirm Password\">\n              <ng-container *ngIf=\"passwordDataSubmit && PasswordUpdate.controls.confirm_password.errors\">\n                <span class=\"text-danger\" *ngIf=\"PasswordUpdate.controls.confirm_password.errors.required\">Confirm Password is required</span>\n                <span class=\"text-danger\" *ngIf=\"PasswordUpdate.controls.confirm_password.errors.mustMatch\">Password must match</span>\n              </ng-container>\n            </div>\n            <button (click)=\"ResetPassword()\"   style=\"background-color: #8C031F; cursor: pointer;\" type=\"submit\" class=\"btn btn-primary w-100\">Submit</button>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n  <!--  -->\n\n  <!-- Modal -->\n<div class=\"modal fade\" id=\"inviteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"inviteModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title\" id=\"inviteModalLabel\">Invite User</h5>\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"inviteUserForm.reset(); failedMsgerrors();\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n        <p id=\"afterSubmitFailedErrMsg\" class=\"text-center text-danger\"></p>\n        <form (ngSubmit)=\"onSubmit(inviteUserForm.value,inviteUserForm);\" class=\"form-horizontal\" [formGroup]=\"inviteUserForm\">\n          <div class=\"modal-body\">\n            <div class=\"row\">\n                <label class=\"col-sm-3 label-on-left\"> Name*</label>\n                 <div class=\"col-sm-9 form-group\">\n                    <input type=\"text\" class=\"form-control\" id=\"name\" required name=\"name\" formControlName=\"name\" (focus)=\"onFocus(inviteUserForm,'name')\">\n                    <div *ngIf=\"inviteUserForm.controls['name'].errors && !inviteUserForm.controls['name'].pristine\" class=\"text-danger\">\n                      <div [hidden]=\"!inviteUserForm.controls['name'].errors.required\">Name is required.</div>\n                    </div>\n                 </div>\n                 <label class=\"col-sm-3 label-on-left\">Email*</label>\n                  <div class=\"col-sm-9 form-group\">\n                    <input type=\"email\" class=\"form-control\" id=\"email\" required name=\"email\" formControlName=\"email\"  (focus)=\"onFocus(inviteUserForm,'email'); hideValidationMsg();\">\n                    <p class=\"text-danger\" id=\"validEmailMsg\">Email is not valid.</p>\n                    <div *ngIf=\"inviteUserForm.controls['email'].errors && !inviteUserForm.controls['email'].pristine\" class=\"text-danger\">\n                      <div [hidden]=\"!inviteUserForm.controls['email'].errors.required\">Email is required.</div>\n                       <!-- <div [hidden]=\"!inviteUserForm.controls['email'].errors.email\">Email is not valid.</div> -->\n                    </div>\n                  </div>\n            </div>\n            <div class=\"row\">\n              <label class=\"col-sm-3 label-on-left\">Contact</label>\n               <div class=\"col-sm-9 form-group\">\n                <input type=\"number\" class=\"form-control\" id=\"contact\" name=\"contact\" (keydown)=\"numberCheck($event)\" formControlName=\"contact\" min=\"0\">\n               </div>\n               <label class=\"col-sm-3 label-on-left\">Select Role*</label>\n                <div class=\"col-sm-9 form-group\">\n                  <select class=\"form-control\" id=\"user_type\" name=\"user_type\" formControlName=\"user_type\"  required (focus)=\"onFocus(inviteUserForm,'user_type')\">\n                     <option value=\"\">Select Role</option>\n                      <option value=\"catalogue_head\">Catalogue Head</option>\n                      <option value=\"design_head\">Design Head</option>\n                      <option value=\"lead_head\">Lead Head</option>\n                      <option value=\"customer_head\">Customer Head</option>\n                      <option value=\"customer\">Customer</option>\n                      <option value=\"designer\">Designer</option>\n                      <option value=\"cs_agent\">CS Agent</option>\n                      <option value=\"broker\">Broker</option>\n                      <option value=\"manufacturer\">Manufacturer</option>\n                      <option value=\"community_manager\">Community Manager</option>\n                      <option value=\"finance\">Finance</option>\n                      <!-- <option value=\"category\">Category</option> -->\n                      <option value=\"sitesupervisor\">Site Supervisor </option>\n                      <option value=\"cad\">CAD </option>\n                      <option value=\"sales_manager\">Sales Manager </option>\n                      <option value=\"area_sales_manager\">Area Sales Manager </option>\n                      <option value=\"referral\">Referral</option>\n                      <option value=\"order_manager\">Order Manager</option>\n                      <option value=\"catalog_viewer\">Catalog Viewer</option>\n                      <option value=\"employee_referral\">Employee Referral </option>\n                      <option value=\"design_partner_referral\">Design Partner Referral</option>\n                      <option value=\"client_referral\">Client Referral</option>\n                      <option value=\"display_dealer_referral\">Display Dealer Referral</option>\n                      <option value=\"non_display_dealer_referral\">Non Display Dealer Referral </option>\n                      <option value=\"business_head\">Business Head </option>\n                      <option value=\"associate_partner\">Associate partner</option>\n                      <option value=\"developer\"> Developer Role</option>\n                      <option value=\"city_gm\">General Manager</option>\n                      <option value=\"category_head\">CATEGORY HEAD</option>\n                      <option value=\"design_manager\">Design Manager</option>\n                      <option value=\"category_panel\">Category Panel</option>\n                      <option value=\"category_non_panel\">Category Non Panel</option>\n                      <option value=\"category_services\">Category Services</option>\n                      <option value=\"store_manager\">Store Manager</option>\n                      <option value=\"deputy_general_manager\">Deputy General Manager</option>\n                      <option value=\"others\">Others</option>\n                  </select>\n                </div>\n                <div class=\"col-sm-9\">\n                  <input id=\"arrivaeChampioncheckbox\" type=\"checkbox\" formControlName=\"champion\" name=\"champion\"> invitee is part of Arrivae Champions program\n                </div>\n            </div>\n          </div>\n          <div class=\"modal-footer\">\n\n            <button type=\"submit\" class=\"modalButton\">Submit</button>\n            <button type=\"button\" class=\"cancel\" data-dismiss=\"modal\" (click)=\"inviteUserForm.reset(); failedMsgerrors();\">Close</button>\n          </div>\n        </form>\n    </div>\n  </div>\n</div>\n<!-- V:modal box for Category role split users list-->\n<div class=\"modal fade\" id=\"getUserCategorySplit\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"getUserCategorySplitLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-lg\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title\" id=\"getUserCategorySplitLabel\">Users by Segment</h5>\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n      <div class=\"modal-body\">\n        <div class=\"col-md-4 mt-3\">\n          <label class=\"name\">Type<span class=\"text-danger\">:</span></label>\n          <select (change) = \"getUserCategorySplit($event)\">\n            <option value=\"\" disabled>Select Type</option>\n            <option value=\"category_panel\">Category Panel</option>\n            <option value=\"category_non_panel\">Category Non Panel</option>\n            <option value=\"category_services\">Category Services</option>\n          </select>\n        </div>\n        <div class=\"row\" *ngIf=\"!this.Vusers\">\n          <div class=\"col-12 text-center\">\n             <i class=\"fas fa-spinner fa-spin mt-4\" style=\"font-size: 40px;color:#8C031F\"></i>\n             <p class=\"mt-4\" style=\"color:#8C031F\">Select One Type To Show User List</p>\n          </div>\n        </div>\n        <div class=\"row mt-4\"  *ngIf=\"this.Vusers && this.Vusers.length > 0\">\n          <div class=\"col-md-12\">\n            <div class=\"tableDiv\">\n              <div class=\"table-responsive\">\n                <table class=\"table\">\n                  <thead class=\"thead-dark\">\n                      <tr>\n                        <th scope=\"col\" class=\"firstTh\">#</th>\n                        <th scope=\"col\" class=\"w-25\">USER ID</th>\n                        <th scope=\"col\" class=\"w-25\">USER NAME</th>\n                        <th scope=\"col\" class=\"w-25\">EMAIL</th>\n                      </tr>\n                  </thead>\n                  <tbody lass=\"ss-tbody\">\n                    <tr *ngFor=\"let obj of Vusers; let i = index\" [attr.data-index]=\"i\">\n                      <td style=\"min-width: 1rem;\">{{i+1}}</td>\n                      <td class=\"capitalize\">{{obj.id}}</td>\n                      <td class=\"capitalize\">{{obj.name}}</td>\n                      <td class=\"capitalize\">{{obj.email}}</td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/platform/user-roles/listusers/listusers.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListusersComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_roles_service__ = __webpack_require__("./src/app/platform/user-roles/user-roles.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_loader_service__ = __webpack_require__("./src/app/services/loader.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ListusersComponent = /** @class */ (function () {
    function ListusersComponent(router, userRoleService, formBuilder, loaderService) {
        this.router = router;
        this.userRoleService = userRoleService;
        this.formBuilder = formBuilder;
        this.loaderService = loaderService;
        this.updateRoleAccess = ["admin"];
        this.erroralert = false;
        this.successalert = false;
        this.updatedRole = [];
        this.store = '';
        this.inviteUserForm = this.formBuilder.group({
            contact: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */](""),
            name: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required),
            user_type: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]("", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required),
            email: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]("", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required]),
        });
        this.search = "";
        this.passwordDataSubmit = false;
        this.role = localStorage.getItem("user");
        console.log("yjhbjb");
        console.log(this.store);
        console.log(this.search);
    }
    ListusersComponent.prototype.ngOnInit = function () {
        this.getStoreData();
        this.getUserListFromService(1);
        // this.exportLeads();
        this.is_champion = localStorage.getItem("isChampion");
        this.PasswordUpdate = this.formBuilder.group({
            password: ["", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].minLength(8)]],
            confirm_password: ["", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["k" /* Validators */].required],
            user_id: [""],
        }, {
            validator: this.MustMatch("password", "confirm_password"),
        });
    };
    // ngAfterViewInit() {
    //       $('[data-toggle="tooltip"]').tooltip();
    // }
    ListusersComponent.prototype.ngOnChanges = function () {
        this.getUserListFromService();
        console.log(this.Role);
    };
    ListusersComponent.prototype.clearSearch = function () {
        this.search = "";
        this.getUserListFromService();
    };
    ListusersComponent.prototype.getUserListFromService = function (page) {
        var _this = this;
        this.loaderService.display(true);
        if (this.store === undefined) {
            this.store = "";
        }
        if (this.Role === undefined) {
            this.Role = "";
        }
        this.userRoleService.getUserList(page, this.search, this.store, this.Role).subscribe(function (res) {
            _this.headers_res = res.headers._headers;
            _this.per_page = _this.headers_res.get("x-per-page");
            _this.total_page = _this.headers_res.get("x-total");
            _this.current_page = _this.headers_res.get("x-page");
            res = res.json();
            _this.users = res.users;
            _this.loaderService.display(false);
        }, function (error) {
            _this.erroralert = true;
            _this.errorMessage = JSON.parse(_this.errorMessage["_body"]).message;
            _this.loaderService.display(false);
            //  this.errorMessage = <any>error;
            //$.notify(JSON.parse(this.errorMessage['_body']).message);
        });
    };
    ListusersComponent.prototype.getStoreData = function () {
        var _this = this;
        this.userRoleService.StoreData().subscribe(function (res) {
            _this.ListingStore = res;
        });
    };
    // store: string;
    ListusersComponent.prototype.selectStore = function (e) {
        this.store = e;
        if (!(this.Role == "designer" || this.Role == "community_manager" || this.Role == "City_GM")) {
            this.Role = "";
        }
        this.getUserListFromService(1);
    };
    ListusersComponent.prototype.selectRole = function (e) {
        this.Role = e;
        // console.log(this.Role)
        if (!(this.Role == null || this.Role == "designer" || this.Role == "community_manager" || this.Role == "City_GM")) {
            this.store = "";
        }
        this.getUserListFromService();
    };
    ListusersComponent.prototype.successMessageShow = function (msg) {
        this.successalert = true;
        this.successMessage = msg;
        setTimeout(function () {
            this.successalert = false;
        }.bind(this), 2000);
    };
    ListusersComponent.prototype.championToggleButton = function (userid, event) {
        var _this = this;
        if ($("#checkbox" + userid).prop("checked") == true) {
            this.toggleValue = true;
        }
        else {
            this.toggleValue = false;
        }
        var userId = userid;
        this.loaderService.display(true);
        this.userRoleService
            .getChampionTogglebutton(userId, this.toggleValue)
            .subscribe(function (res) {
            _this.loaderService.display(false);
            _this.successalert = true;
            _this.successMessageShow("Champion status changed successfully!");
            _this.getUserListFromService();
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 2000);
        }, function (err) {
            _this.errorMessage = err;
            _this.erroralert = true;
            _this.errorMessage = JSON.parse(_this.errorMessage["_body"]).message;
            _this.toggleValue = false;
            _this.getUserListFromService();
            _this.loaderService.display(false);
            setTimeout(function () {
                this.erroralert = false;
            }.bind(_this), 2000);
        });
    };
    ListusersComponent.prototype.numberCheck = function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106) ||
            (e.keyCode > 47 && e.keyCode < 58) ||
            e.keyCode == 8 ||
            e.keyCode == 39 ||
            e.keyCode == 37 ||
            e.keyCode == 38 ||
            e.keyCode == 40 ||
            e.keyCode == 17 ||
            e.keyCode == 91 ||
            e.keyCode == 86 ||
            e.keyCode == 67)) {
            return false;
        }
    };
    ListusersComponent.prototype.onDropdownChange = function (id, value, rowid) {
        this.updatedRole[rowid] = value;
        if (this.updatedRole[rowid] != undefined && this.updatedRole[rowid] != "") {
            document
                .getElementById("updaterolerow" + id)
                .classList.remove("inputBorder");
        }
    };
    ListusersComponent.prototype.updateRole = function (id, index) {
        var _this = this;
        if (this.updatedRole[index] != undefined && this.updatedRole[index] != "") {
            document
                .getElementById("updaterolerow" + id)
                .classList.remove("inputBorder");
            this.loaderService.display(true);
            this.userRoleService.updateRole(id, this.updatedRole[index]).subscribe(function (res) {
                Object.keys(res).map(function (key) {
                    res = res[key];
                });
                _this.users[index] = res;
                _this.getUserListFromService();
                _this.updatedRole[index] = undefined;
                _this.loaderService.display(false);
                _this.successalert = true;
                _this.successMessage = "Updated Successfully!";
                $(window).scrollTop(0);
                setTimeout(function () {
                    this.successalert = false;
                }.bind(_this), 5000);
                //  $.notify('Updated Successfully!');
            }, function (error) {
                _this.loaderService.display(false);
                _this.erroralert = true;
                _this.errorMessage = JSON.parse(_this.errorMessage["_body"]).message;
                $(window).scrollTop(0);
                setTimeout(function () {
                    this.erroralert = false;
                }.bind(_this), 5000);
                //$.notify(JSON.parse(error['_body']).message);
            });
        }
        else {
            document
                .getElementById("updaterolerow" + id)
                .classList.add("inputBorder");
        }
    };
    ListusersComponent.prototype.onSubmit = function (data, formelem) {
        var _this = this;
        if (formelem.controls["name"].errors &&
            formelem.controls["name"].errors.required) {
            document.getElementById("name").classList.add("inputBorder");
        }
        if (formelem.controls["email"].errors &&
            formelem.controls["email"].errors.required) {
            document.getElementById("email").classList.add("inputBorder");
        }
        if (formelem.controls["user_type"].errors &&
            formelem.controls["user_type"].errors.required) {
            document.getElementById("user_type").classList.add("inputBorder");
        }
        if ($("#arrivaeChampioncheckbox").prop("checked") == true) {
            this.is_arrivaechampion = true;
        }
        else {
            this.is_arrivaechampion = false;
        }
        if (formelem.valid) {
            if (this.checkEmail(formelem.controls["email"].value)) {
                $("#validEmailMsg").hide();
                this.loaderService.display(true);
                this.userRoleService
                    .inviteUser(data, this.is_arrivaechampion)
                    .subscribe(function (res) {
                    $("#inviteModal").modal("hide");
                    document.getElementById("afterSubmitFailedErrMsg").innerHTML = "";
                    formelem.reset();
                    _this.getUserListFromService();
                    _this.loaderService.display(false);
                    _this.successalert = true;
                    _this.successMessage = "Successfully Invited!";
                    setTimeout(function () {
                        this.successalert = false;
                    }.bind(_this), 5000);
                    //$.notify('Successfully Invited!');
                }, function (error) {
                    _this.loaderService.display(false);
                    document.getElementById("afterSubmitFailedErrMsg").innerHTML =
                        JSON.parse(error["_body"]).message;
                    _this.erroralert = true;
                    _this.errorMessage = JSON.parse(_this.errorMessage["_body"]).message;
                    setTimeout(function () {
                        this.erroralert = false;
                    }.bind(_this), 5000);
                    //$.notify(JSON.parse(error['_body']).message);
                });
            }
            else {
                $("#validEmailMsg").show();
            }
        }
        this.inviteUserForm.reset();
        $("#arrivaeChampioncheckbox").prop("checked", false);
    };
    ListusersComponent.prototype.failedMsgerrors = function () {
        document.getElementById("afterSubmitFailedErrMsg").innerHTML = "";
    };
    ListusersComponent.prototype.onFocus = function (formelem, elemname) {
        if (formelem.controls[elemname].errors) {
            document.getElementById(elemname).classList.remove("inputBorder");
        }
        document.getElementById("afterSubmitFailedErrMsg").innerHTML = "";
    };
    ListusersComponent.prototype.checkEmail = function (email) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {
            $("#validEmailMsg").show();
            return false;
        }
        else {
            $("#validEmailMsg").hide();
        }
        return true;
    };
    ListusersComponent.prototype.hideValidationMsg = function () {
        $("#validEmailMsg").hide();
    };
    ListusersComponent.prototype.exportLeads = function () {
        var _this = this;
        this.userRoleService.exportLeads().subscribe(function (data) {
            _this.exportFileData = data;
            _this.downloadFile(_this.exportFileData);
            // data => this.downloadFile(data)
        }, function (err) { });
    };
    ListusersComponent.prototype.downloadFile = function (data) {
        // var blob = new Blob([(<any>data)], { type: 'text/csv'});
        // var url= window.URL.createObjectURL(blob);
        // window.open(url);
        //
        var blob = new Blob(["\ufeff" + data], { type: "text/csv;charset=utf-8;" });
        var dwldLink = document.createElement("a");
        var url = URL.createObjectURL(blob);
        var isSafariBrowser = navigator.userAgent.indexOf("Safari") != -1 &&
            navigator.userAgent.indexOf("Chrome") == -1;
        if (isSafariBrowser) {
            //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", "user.csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    };
    ListusersComponent.prototype.getUserCategorySplit = function (event) {
        var _this = this;
        this.selected_space = event.target.value;
        this.loaderService.display(true);
        this.userRoleService.getUserCategorySplit(this.selected_space).subscribe(function (res) {
            _this.Vusers = res.users;
            _this.successalert = true;
            _this.successMessage = "Type Status updated successfully";
            _this.loaderService.display(false);
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 2000);
        }, function (err) {
            _this.loaderService.display(false);
        });
    };
    ListusersComponent.prototype.openPasswordModal = function (id) {
        this.passwordDataSubmit = false;
        this.PasswordUpdate.reset();
        this.passwordUpdateId = id;
        $("#updatePassword").modal("show");
    };
    ListusersComponent.prototype.ResetPassword = function () {
        var _this = this;
        this.passwordDataSubmit = true;
        if (this.PasswordUpdate.invalid) {
            return;
        }
        this.PasswordUpdate.controls["user_id"].setValue(this.passwordUpdateId);
        this.loaderService.display(true);
        this.userRoleService
            .updatePassword(this.PasswordUpdate.value)
            .subscribe(function (res) {
            _this.successalert = true;
            _this.successMessage = res.message;
            _this.loaderService.display(false);
            setTimeout(function () {
                this.successalert = false;
            }.bind(_this), 4000);
            $("#updatePassword").modal("hide");
            _this.PasswordUpdate.reset();
        });
    };
    ListusersComponent.prototype.MustMatch = function (controlName, matchingControlName) {
        return function (formGroup) {
            var control = formGroup.controls[controlName];
            var matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            }
            else {
                matchingControl.setErrors(null);
            }
        };
    };
    ListusersComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: "app-listusers",
            template: __webpack_require__("./src/app/platform/user-roles/listusers/listusers.component.html"),
            styles: [__webpack_require__("./src/app/platform/user-roles/listusers/listusers.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__user_roles_service__["a" /* UserRolesService */]],
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["f" /* Router */],
            __WEBPACK_IMPORTED_MODULE_2__user_roles_service__["a" /* UserRolesService */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__services_loader_service__["a" /* LoaderService */]])
    ], ListusersComponent);
    return ListusersComponent;
}());



/***/ }),

/***/ "./src/app/platform/user-roles/user-roles-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserRolesRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__ = __webpack_require__("./src/app/authentication/logged-in-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__listusers_listusers_component__ = __webpack_require__("./src/app/platform/user-roles/listusers/listusers.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    {
        path: 'listusers',
        canActivate: [__WEBPACK_IMPORTED_MODULE_2__authentication_logged_in_guard_service__["a" /* LoggedInGuard */]],
        component: __WEBPACK_IMPORTED_MODULE_3__listusers_listusers_component__["a" /* ListusersComponent */]
    }
];
var UserRolesRoutingModule = /** @class */ (function () {
    function UserRolesRoutingModule() {
    }
    UserRolesRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["g" /* RouterModule */]]
        })
    ], UserRolesRoutingModule);
    return UserRolesRoutingModule;
}());



/***/ }),

/***/ "./src/app/platform/user-roles/user-roles.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserRolesModule", function() { return UserRolesModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_shared_module__ = __webpack_require__("./src/app/shared/shared.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__listusers_listusers_component__ = __webpack_require__("./src/app/platform/user-roles/listusers/listusers.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_roles_routing_module__ = __webpack_require__("./src/app/platform/user-roles/user-roles-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ngx_pipes__ = __webpack_require__("./node_modules/ngx-pipes/fesm5/ngx-pipes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ngx_pagination__ = __webpack_require__("./node_modules/ngx-pagination/dist/ngx-pagination.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node_modules_ng_select_ng_select__ = __webpack_require__("./node_modules/@ng-select/ng-select/esm5/ng-select.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var UserRolesModule = /** @class */ (function () {
    function UserRolesModule() {
    }
    UserRolesModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__user_roles_routing_module__["a" /* UserRolesRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["j" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__shared_shared_module__["a" /* SharedModule */],
                __WEBPACK_IMPORTED_MODULE_6_ngx_pipes__["a" /* NgPipesModule */],
                __WEBPACK_IMPORTED_MODULE_7_ngx_pagination__["a" /* NgxPaginationModule */],
                __WEBPACK_IMPORTED_MODULE_8__node_modules_ng_select_ng_select__["a" /* NgSelectModule */]
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__listusers_listusers_component__["a" /* ListusersComponent */]]
        })
    ], UserRolesModule);
    return UserRolesModule;
}());



/***/ }),

/***/ "./src/app/platform/user-roles/user-roles.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserRolesService; });
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









var UserRolesService = /** @class */ (function () {
    function UserRolesService(http, tokenService, authService) {
        this.http = http;
        this.tokenService = tokenService;
        this.authService = authService;
        this.userUrl = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/users';
        this.inviteUserUrl = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/users/invite_user';
        this.championTogglebutton = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/users';
        this.options = this.authService.getHeaders();
    }
    UserRolesService.prototype.extractDataPage = function (res) {
        return res;
    };
    UserRolesService.prototype.extractData = function (res) {
        var body = res.json();
        return body;
    };
    UserRolesService.prototype.extractDataOne = function (res) {
        var body = res;
        return body;
    };
    UserRolesService.prototype.handleErrorObservable = function (error) {
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */].throw(error.message || error);
    };
    UserRolesService.prototype.getUserList = function (page, search, id, Role) {
        return this.http.get(this.userUrl + "?page=" + page + '&search=' + search + '&store_filter=' + id + '&role_filter=' + Role, this.options)
            .map(this.extractDataPage)
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.StoreData = function () {
        var url = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/stores/get_all_stores';
        return this.http
            .get(url, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.getChampionTogglebutton = function (userid, championvalue) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* URLSearchParams */]();
        params.set('is_champion', championvalue);
        this.options.search = params;
        return this.http.get(this.championTogglebutton + '/' + userid + '/set_champion_status?', this.options)
            .map(this.extractDataPage)
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.inviteUser = function (data, champion) {
        var obj = {
            user: {
                name: data.name,
                user_type: data.user_type,
                contact: data.contact,
                email: data.email,
                is_champion: champion
            }
        };
        return this.http.post(this.inviteUserUrl, obj, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.updateRole = function (id, role) {
        var url = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/users/' + id + '/update_role';
        var obj = {
            user: {
                role: role,
                id: id
            }
        };
        return this.http.patch(url, obj, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.exportLeads = function () {
        var _this = this;
        var url = this.userUrl + '/download_list';
        return this.http.get(url, this.options)
            .map(function (response) {
            if (response.status == 400) {
                _this.handleErrorObservable;
            }
            else if (response.status == 200) {
                var contentType = 'text/csv';
                var blob = response['_body'];
                //var blob = new Blob([(<any>response)._body], { type: contentType });
                return blob;
            }
        })
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.getUserCategorySplit = function (value) {
        var url = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + '/v1/users/request_role';
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* URLSearchParams */]();
        params.set('role', value);
        var opt = this.options;
        this.options.search = params;
        return this.http.get(url, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    };
    UserRolesService.prototype.updatePassword = function (data) {
        // {{url}}/v1/user/admin_set_password
        var url = __WEBPACK_IMPORTED_MODULE_8__environments_environment__["a" /* environment */].apiBaseUrl + "/v1/user/admin_set_password";
        return this.http
            .post(url, data, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    };
    UserRolesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_6_angular2_token__["a" /* Angular2TokenService */],
            __WEBPACK_IMPORTED_MODULE_7__authentication_auth_service__["a" /* AuthService */]])
    ], UserRolesService);
    return UserRolesService;
}());



/***/ })

});
//# sourceMappingURL=user-roles.module.chunk.js.map