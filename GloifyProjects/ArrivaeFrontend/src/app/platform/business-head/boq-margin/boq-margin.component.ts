import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { BusinessHeadService } from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: "boq-margin",
  templateUrl: "./boq-margin.component.html",
  styleUrls: ["./boq-margin.component.css"],
  providers: [BusinessHeadService],
})
export class BoqMarginComponent implements OnInit {
  reference_value: any;
  boq_amount: any;
  boq_details: {}[];
  errorMessage: string;
  errorMessageModal: string;
  erroralert = false;
  erroralertmodal = false;
  successalert = false;
  successalertmodal = false;
  successMessageModal: string;
  successMessage: string;
  showBOQDiv: boolean;

  constructor(
    public businessHeadService: BusinessHeadService,
    private loaderService: LoaderService,
    private tokenService: Angular2TokenService
  ) {}

  ngOnInit() {}
  pm_fee_disabled;
  project_id: any;
  quotation_id: any;
  quotationdetails: any;
  show_promo_toggle: boolean = false;
  getBOQByReference() {
    this.boq_details = undefined;
    this.showBOQDiv = true;
    if (
      this.reference_value != null ||
      this.reference_value != undefined ||
      this.reference_value != ""
    ) {
      this.loaderService.display(true);
      this.businessHeadService
        .getBOQByReference(this.reference_value)
        .subscribe(
          (response) => {
            this.loaderService.display(false);
            this.boq_details = response.quotation;

            this.quotationdetails = response.quotation;
            this.project_id = this.quotationdetails.project_id;
            this.quotation_id = this.quotationdetails.id;
            this.expired_promo_jobs = this.quotationdetails.expired_promo_jobs;

            if (
              this.quotationdetails.expired_promo_jobs.length &&
              this.quotationdetails.expired_promo_jobs.length === 0 &&
              this.quotationdetails.expired_promo_jobs_applied === false
            ) {
              this.show_promo_toggle = false;
            } else {
              this.show_promo_toggle = true;
            }
          },
          (error) => {
            this.errorMessageShow(JSON.parse(error._body).message);
            this.loaderService.display(false);
          }
        );
    } else {
      this.errorMessageShow("Please input the reference number!");
    }
  }
  updateBOQDetails() {
    if (this.boq_amount == 0){
      if (confirm("Are you sure to make this BOQ value as 0?") == true) {
        if (this.reference_value != null || this.boq_amount != undefined) {
          this.loaderService.display(true);
          this.businessHeadService
            .updateReferenceValue(this.reference_value, this.boq_amount)
            .subscribe(
              (res) => {
                this.closeUpdateBOQModal();
                this.loaderService.display(false);
                this.boq_details = res.quotation;
                this.successMessageShow("Value updated successfully!");
                 this.boq_amount = "";
              },
              (error) => {
                this.closeUpdateBOQModal();

                this.errorMessageShow(JSON.parse(error._body).message);
                this.loaderService.display(false);
              }
            );
        } else {
          this.errorMessageShow("Please enter amount!");
        }
      }

    } else{
         if (this.reference_value != null || this.boq_amount != undefined) {
           this.loaderService.display(true);
           this.businessHeadService
             .updateReferenceValue(this.reference_value, this.boq_amount)
             .subscribe(
               (res) => {
                 this.closeUpdateBOQModal();
                 this.loaderService.display(false);
                 this.boq_details = res.quotation;
                 this.successMessageShow("Value updated successfully!");
                 this.boq_amount =""
               },
               (error) => {
                 this.closeUpdateBOQModal();

                 this.errorMessageShow(JSON.parse(error._body).message);
                 this.loaderService.display(false);
               }
             );
         } else {
           this.errorMessageShow("Please enter amount!");
         }
    }
     
  }
  closeUpdateBOQModal() {
    $("#updateBOQMargin").modal("hide");
  }

  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      2000
    );
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
  //V:fuctionality for disable pm fee
  selected_space;
  DisablePmFee(event) {
    this.selected_space = event.target.checked;
    this.loaderService.display(true);
    this.businessHeadService
      .DisablePmFee(this.reference_value, this.selected_space)
      .subscribe(
        (res) => {
          this.getBOQByReference();
          this.successalert = true;
          // this.successMessage = res.message;
          this.successMessageShow("Disable Pm Fee Updated Successfully!");
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
          this.errorMessageShow(this.errorMessage["_body"]);
        }
      );
  }

  expired_promo_jobs: any;
  DisablePromoPackageExpiryDate(event) {
    this.loaderService.display(true);
    if (event.target.checked === false) {
      this.businessHeadService
        .EnablePromoPackageExpirydate(this.project_id, this.quotation_id)
        .subscribe(
          (res) => {
            this.quotationdetails = res;
            // if (this.quotationdetails.expired_promo_jobs.length === 0 && this.quotationdetails.expired_promo_jobs_applied === false) {
            //   this.show_promo_toggle = false;
            // }
            // else {
            //   this.show_promo_toggle = true;
            // }
            this.successalert = true;
            this.successMessageShow(
              "Disable Promo Package Expiry Date Successfully!"
            );
            this.loaderService.display(false);
          },
          (err) => {
            this.loaderService.display(false);
            this.errorMessageShow(this.errorMessage["_body"]);
          }
        );
    } else if (event.target.checked === true) {
      this.businessHeadService
        .DisablePromoPackageExpirydate(this.project_id, this.quotation_id)
        .subscribe(
          (res) => {
            this.quotationdetails = res;
            // if (this.quotationdetails.expired_promo_jobs.length === 0 && this.quotationdetails.expired_promo_jobs_applied === false) {
            //   this.show_promo_toggle = false;
            // }
            // else {
            //   this.show_promo_toggle = true;
            // }
            this.successalert = true;
            this.successMessageShow(
              "Enable Promo Package Expiry Date Successfully!"
            );
            this.loaderService.display(false);
          },
          (err) => {
            this.loaderService.display(false);
            this.errorMessageShow(this.errorMessage["_body"]);
          }
        );
    }
  }
  updateBOQMargin;
  OpenModal(status) {
    if (
      confirm(
        "This BOQ is shared with customer , Are you sure want to change value?"
      ) == true
    ) {
      $("#updateBOQMargin").modal("show");
    }
  }

  
}



