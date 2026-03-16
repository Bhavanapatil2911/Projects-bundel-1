import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { LeadService } from 'app/platform/lead/lead.service';
import { LoaderService } from 'app/services/loader.service';

import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;
declare var $: any;



@Component({
  selector: "app-adustments",
  templateUrl: "./adustments.component.html",
  styleUrls: ["./adustments.component.css"],
  providers: [LeadService],
})
export class AdustmentsComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private loaderService: LoaderService
  ) {}
  AdustmentForm: FormGroup;

  ngOnInit() {
    this.AdustmentForm = this.formBuilder.group({
      adjustment_date: new FormControl("", Validators.required),
      adjustment_value: new FormControl("", Validators.required),
      key_name: new FormControl("mtd_order_book_value"),
    });
    this.getAdjustments("");
  }
  erroralert: any;
  errorMessage: any;
  successalert;
  successMessage;
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
  Adjustment_date;

  currentPage;
  headers_res;
  per_page;
  total_page;
  AdjustmentsList: any = [];
  getAdjustments(page) {
    if (page !== undefined && page !== "") {
      this.currentPage = page;
    }
    if (this.currentPage == undefined) {
      this.currentPage = 1;
    }
    this.loaderService.display(true);
    this.leadService.getAdjustments(this.currentPage).subscribe((res) => {
      this.headers_res = res.headers._headers;
      this.per_page = this.headers_res.get("x-per-page");
      this.total_page = this.headers_res.get("x-total");
      this.currentPage = this.headers_res.get("x-page");
      res = res.json();
      this.AdjustmentsList = res.dsr_adjustments;
      if (this.AdjustmentsList.length == 0) {
        this.currentPage = this.currentPage - 1;
        this.getAdjustments(this.currentPage);
      }
      this.loaderService.display(false);
    });
  }
  submitDetails() {
    this.AdustmentForm.controls["key_name"].setValue("mtd_order_book_value");
    this.loaderService.display(true);
    this.leadService.CreateAdjust(this.AdustmentForm.value).subscribe(
      (res) => {
        this.successMessageShow("Adjustment Created Successfully");
        this.closeModal();
        this.getAdjustments(this.currentPage);
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }
  closeModal() {
    this.AdustmentForm.reset();
    $("#adustment").modal("hide");
    this.Adjustment_date = "";
  }
  deleteDetails(id) {
    if (confirm("Are you sure you want to delete this Adjustment?") == true) {
      this.loaderService.display(true);
      this.leadService.deleteAdjustDetails(id).subscribe(
        (res) => {
          this.loaderService.display(false);
          this.getAdjustments(this.currentPage);
          this.successMessageShow(`Adjustment deleted successfully`);
        },
        (err) => {
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
getMonthForDate(){
  let month = new Date().getMonth();
  return "-"+month+"M"
}
  DateForWorkStart() {
    $("#startDateNewpro")
      .datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: "mm/yy",
        minDate: this.getMonthForDate(),
        onClose: function (dateText, inst) {
          function isDonePressed() {
            return (
              $("#ui-datepicker-div")
                .html()
                .indexOf(
                  "ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover"
                ) > -1
            );
          }
          if (isDonePressed()) {
            var month = $(
              "#ui-datepicker-div .ui-datepicker-month :selected"
            ).val();
            var year = $(
              "#ui-datepicker-div .ui-datepicker-year :selected"
            ).val();
            $(this).datepicker("setDate", new Date(year, month, 1));
            var FullChange = new Date(year, month, 1);
            var date = new Date(); //taking current date and time
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            firstDay.setMonth(firstDay.getMonth() + 2);
            var curMonth = new Date(firstDay.toDateString());
           
          }
        },
      })
      .focus(function () {
        $("#startDateNewpro").datepicker("show");
      })
      .focus();
  }
  delayedVal
  workChange() {
    this.AdustmentForm.controls["adjustment_date"].setValue(
      $("#startDateNewpro").val()
    );
    var startdate = $("#startDateNewpro").val();
    var endDate = new Date("01/" + startdate);

    var date = new Date(); //taking current date and time
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth() + 2);
    var curMonth = new Date(firstDay.toDateString());
    
  }
}
