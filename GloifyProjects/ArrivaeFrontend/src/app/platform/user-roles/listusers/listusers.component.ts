import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserRolesService } from "../user-roles.service";
import { Observable } from "rxjs";
import { User } from "../user";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  EmailValidator,
} from "@angular/forms";
declare var $: any;
import { LoaderService } from "../../../services/loader.service";

@Component({
  selector: "app-listusers",
  templateUrl: "./listusers.component.html",
  styleUrls: ["./listusers.component.css"],
  providers: [UserRolesService],
})
export class ListusersComponent implements OnInit {
  observableUsers: Observable<User[]>;
  users: User[];
  role: string;
  updateRoleAccess = ["admin"];
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  showvalidEmaliMsg: boolean;
  exportFileData: any;
  updatedRole = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  is_arrivaechampion: boolean;
  is_champion;
  toggleValue: boolean;
  PasswordUpdate: FormGroup;
  store:string='';

  constructor(
    private router: Router,
    private userRoleService: UserRolesService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.role = localStorage.getItem("user");
    console.log("yjhbjb")
    console.log(this.store)
    console.log(this.search)
    

  }

  inviteUserForm = this.formBuilder.group({
    contact: new FormControl(""),
    name: new FormControl("", Validators.required),
    user_type: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required]),
  });
  ngOnInit() {
    this.getStoreData();
    this.getUserListFromService(1);
    // this.exportLeads();
    this.is_champion = localStorage.getItem("isChampion");
    this.PasswordUpdate = this.formBuilder.group(
      {
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirm_password: ["", Validators.required],
        user_id: [""],
      },
      {
        validator: this.MustMatch("password", "confirm_password"),
      }
    );
  }
  // ngAfterViewInit() {
  //       $('[data-toggle="tooltip"]').tooltip();
  // }
  ngOnChanges(): void {
    this.getUserListFromService();
    console.log(this.Role)
  }
  search = "";
  clearSearch(){
    this.search=""
    this.getUserListFromService();

  }
  getUserListFromService(page?) {
    this.loaderService.display(true);

    if (this.store === undefined) {
      this.store = "";
    }
    if (this.Role === undefined) {
      this.Role = "";
    }

    this.userRoleService.getUserList(page, this.search, this.store,this.Role).subscribe(
      (res) => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");

        res = res.json();
        this.users = res.users;
        this.loaderService.display(false);
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(this.errorMessage["_body"]).message;
        this.loaderService.display(false);
        //  this.errorMessage = <any>error;

        //$.notify(JSON.parse(this.errorMessage['_body']).message);
      }
    );
  }

  ListingStore: any;
  getStoreData() {
    this.userRoleService.StoreData().subscribe((res) => {
      this.ListingStore = res;
    });
  }
  // store: string;
  selectStore(e) {
    this.store = e;
    if(!( this.Role=="designer" || this.Role=="community_manager" || this.Role=="City_GM")){
      this.Role=""
    } 
    this.getUserListFromService(1);
  }
  Role: any;
  selectRole(e) {
    this.Role = e;
    // console.log(this.Role)
    if(!(this.Role==null || this.Role=="designer" || this.Role=="community_manager" || this.Role=="City_GM")){
      this.store=""
    }
    this.getUserListFromService();

  }

  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      2000
    );
  }

  championToggleButton(userid, event) {
    if ($("#checkbox" + userid).prop("checked") == true) {
      this.toggleValue = true;
    } else {
      this.toggleValue = false;
    }

    let userId = userid;
    this.loaderService.display(true);
    this.userRoleService
      .getChampionTogglebutton(userId, this.toggleValue)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessageShow("Champion status changed successfully!");
          this.getUserListFromService();
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
        },
        (err) => {
          this.errorMessage = err;
          this.erroralert = true;

          this.errorMessage = JSON.parse(this.errorMessage["_body"]).message;
          this.toggleValue = false;
          this.getUserListFromService();
          this.loaderService.display(false);
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
        }
      );
  }

  numberCheck(e) {
    if (
      !(
        (e.keyCode > 95 && e.keyCode < 106) ||
        (e.keyCode > 47 && e.keyCode < 58) ||
        e.keyCode == 8 ||
        e.keyCode == 39 ||
        e.keyCode == 37 ||
        e.keyCode == 38 ||
        e.keyCode == 40 ||
        e.keyCode == 17 ||
        e.keyCode == 91 ||
        e.keyCode == 86 ||
        e.keyCode == 67
      )
    ) {
      return false;
    }
  }

  onDropdownChange(id, value, rowid) {
    this.updatedRole[rowid] = value;
    if (this.updatedRole[rowid] != undefined && this.updatedRole[rowid] != "") {
      document
        .getElementById("updaterolerow" + id)
        .classList.remove("inputBorder");
    }
  }
  updateRole(id, index) {
    if (this.updatedRole[index] != undefined && this.updatedRole[index] != "") {
      document
        .getElementById("updaterolerow" + id)
        .classList.remove("inputBorder");
      this.loaderService.display(true);
      this.userRoleService.updateRole(id, this.updatedRole[index]).subscribe(
        (res) => {
          Object.keys(res).map((key) => {
            res = res[key];
          });
          this.users[index] = res;
          this.getUserListFromService();
          this.updatedRole[index] = undefined;
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "Updated Successfully!";
          $(window).scrollTop(0);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );

          //  $.notify('Updated Successfully!');
        },
        (error) => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(this.errorMessage["_body"]).message;
          $(window).scrollTop(0);
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );

          //$.notify(JSON.parse(error['_body']).message);
        }
      );
    } else {
      document
        .getElementById("updaterolerow" + id)
        .classList.add("inputBorder");
    }
  }
  onSubmit(data, formelem) {
    if (
      formelem.controls["name"].errors &&
      formelem.controls["name"].errors.required
    ) {
      document.getElementById("name").classList.add("inputBorder");
    }
    if (
      formelem.controls["email"].errors &&
      formelem.controls["email"].errors.required
    ) {
      document.getElementById("email").classList.add("inputBorder");
    }
    if (
      formelem.controls["user_type"].errors &&
      formelem.controls["user_type"].errors.required
    ) {
      document.getElementById("user_type").classList.add("inputBorder");
    }
    if ($("#arrivaeChampioncheckbox").prop("checked") == true) {
      this.is_arrivaechampion = true;
    } else {
      this.is_arrivaechampion = false;
    }

    if (formelem.valid) {
      if (this.checkEmail(formelem.controls["email"].value)) {
        $("#validEmailMsg").hide();
        this.loaderService.display(true);
        this.userRoleService
          .inviteUser(data, this.is_arrivaechampion)
          .subscribe(
            (res) => {
              $("#inviteModal").modal("hide");
              document.getElementById("afterSubmitFailedErrMsg").innerHTML = "";
              formelem.reset();
              this.getUserListFromService();
              this.loaderService.display(false);
              this.successalert = true;
              this.successMessage = "Successfully Invited!";
              setTimeout(
                function () {
                  this.successalert = false;
                }.bind(this),
                5000
              );

              //$.notify('Successfully Invited!');
            },
            (error) => {
              this.loaderService.display(false);
              document.getElementById("afterSubmitFailedErrMsg").innerHTML =
                JSON.parse(error["_body"]).message;
              this.erroralert = true;
              this.errorMessage = JSON.parse(
                this.errorMessage["_body"]
              ).message;
              setTimeout(
                function () {
                  this.erroralert = false;
                }.bind(this),
                5000
              );

              //$.notify(JSON.parse(error['_body']).message);
            }
          );
      } else {
        $("#validEmailMsg").show();
      }
    }

    this.inviteUserForm.reset();
    $("#arrivaeChampioncheckbox").prop("checked", false);
  }

  failedMsgerrors() {
    document.getElementById("afterSubmitFailedErrMsg").innerHTML = "";
  }

  onFocus(formelem, elemname) {
    if (formelem.controls[elemname].errors) {
      document.getElementById(elemname).classList.remove("inputBorder");
    }
    document.getElementById("afterSubmitFailedErrMsg").innerHTML = "";
  }

  checkEmail(email) {
    var filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
      $("#validEmailMsg").show();
      return false;
    } else {
      $("#validEmailMsg").hide();
    }
    return true;
  }
  hideValidationMsg() {
    $("#validEmailMsg").hide();
  }

  exportLeads() {
    this.userRoleService.exportLeads().subscribe(
      (data) => {
        this.exportFileData = data;
        this.downloadFile(this.exportFileData);
        // data => this.downloadFile(data)
      },
      (err) => {}
    );
  }
  downloadFile(data) {
    // var blob = new Blob([(<any>data)], { type: 'text/csv'});
    // var url= window.URL.createObjectURL(blob);
    // window.open(url);
    //
    let blob = new Blob(["\ufeff" + data], { type: "text/csv;charset=utf-8;" });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
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
  }
  //V:fuctionality for category split role featch users list
  selected_space;
  Vusers;
  getUserCategorySplit(event) {
    this.selected_space = event.target.value;
    this.loaderService.display(true);
    this.userRoleService.getUserCategorySplit(this.selected_space).subscribe(
      (res) => {
        this.Vusers = res.users;
        this.successalert = true;
        this.successMessage = "Type Status updated successfully";
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  passwordUpdateId: any;
  passwordDataSubmit: boolean = false;
  openPasswordModal(id) {
    this.passwordDataSubmit = false;
    this.PasswordUpdate.reset();
    this.passwordUpdateId = id;
    $("#updatePassword").modal("show");
  }
  ResetPassword() {
    this.passwordDataSubmit = true;
    if (this.PasswordUpdate.invalid) {
      return;
    }
    this.PasswordUpdate.controls["user_id"].setValue(this.passwordUpdateId);
    this.loaderService.display(true);
    this.userRoleService
      .updatePassword(this.PasswordUpdate.value)
      .subscribe((res) => {
        this.successalert = true;
        this.successMessage = res.message;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          4000
        );
        $("#updatePassword").modal("hide");
        this.PasswordUpdate.reset();
      });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
