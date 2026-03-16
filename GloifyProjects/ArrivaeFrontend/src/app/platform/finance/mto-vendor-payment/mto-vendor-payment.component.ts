import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../../../services/loader.service";
import { FinanceService } from "../finance.service";
import { CategoryService } from "../../category/category/category.service";
import { LeadService } from "../../lead/lead.service";
import { environment } from "environments/environment";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "../../../../../node_modules/@angular/forms";
// import { timeStamp } from "console";
declare var $: any;

@Component({
  selector: "app-mto-vendor-payment",
  templateUrl: "./mto-vendor-payment.component.html",
  styleUrls: ["./mto-vendor-payment.component.css"],
  providers: [FinanceService, LeadService, CategoryService],
})
export class MtoVendorPaymentComponent implements OnInit {
  role;
  successalert = false;
  successalerttop = false;
  successMessage: string;
  errorMessage: string;
  erroralert = false;
  successMessagetop: string;
  errorMessagetop: string;
  erroralerttop = false;
  projectList;
  paymentList;
  lead_types: any;
  paymentFinanceForm: FormGroup;
  selectedState = "pending";
  leadList;

  ageing = [
    { id: 1, name: "1 day ago" },
    { id: 2, name: "2 day ago" },
    { id: 3, name: "3 day ago" },
    { id: 5, name: "5 day ago" },
    { id: 10, name: "10 day ago" },
    { id: 30, name: "1 month ago" },
    { id: 60, name: "2 month ago" },
  ];
  pi_data: any;
  splits: any = [];
  newDynamic: any = {};
  constructor(
    private loaderService: LoaderService,
    private financeService: FinanceService,
    private leadService: LeadService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getVendorPaymentList();
  }

  sum_amount: number = 0;
  final_sum: any = 0;
  show_btn: boolean = false;
  onBlurMethod(value, i) {
    this.sum_amount = 0;
    this.balance_value = this.final_value;
    for (var k = 0; k < this.splits.length; k++) {
      this.sum_amount = this.sum_amount + this.splits[k].amount;
      // this.sum_amount = this.sum_amount.toFixed(2);
    }
    this.balance_value = this.balance_value - this.sum_amount;
    this.balance_value = this.balance_value.toFixed(2);
    if (this.balance_value == 0) {
      this.show_btn = true;
    }
  }

  balance_value: any;
  date_value: any;
  id_value: any;
  overdue_value: any;
  balvalue: any;
  final_value: number;
  showAmount(value, value2, value3, value4) {
    this.show_btn = false;
    this.balance_value = value;
    this.final_value = parseFloat(this.balance_value);
    this.date_value = value2;
    this.id_value = value3;
    this.overdue_value = value4;
    this.balvalue = value;
    this.newDynamic = { amount: "", payment_due_date: this.date_value };
    this.splits.push(this.newDynamic);
  }

  addRow() {
    if (this.balance_value <= 0) {
      this.errorMessageShow("Balance Amount can not be less than 0");
    } else {
      this.newDynamic = { amount: "", payment_due_date: this.date_value };
      this.splits.push(this.newDynamic);
    }
  }

  removeRow(index) {
    var value = this.splits[index].amount;
    this.balance_value = parseFloat(this.balance_value);
    this.balance_value = this.balance_value + value;
    this.show_btn = false;
    if (this.splits.length == 1) {
      return false;
    } else {
      this.splits.splice(index, 1);
      return true;
    }
  }
  remoeaddedrow() {
    this.splits = [];
    this.newDynamic = {};
  }

  submission() {
    if (this.splits[0].amount == this.balvalue) {
      this.errorMessageShow("Payment should split in at least two amounts");
    } else {
      this.loaderService.display(true);
      this.financeService.splitBulkPay(this.splits, this.id_value).subscribe(
        (res) => {
          this.loaderService.display(false);
          this.successMessageShow(res.message);
          this.splits = [];
          this.newDynamic = {};
          $("#paymentSplitModal").modal("hide");
          this.getVendorPaymentList();
        },
        (err) => {
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }

  completed_request;
  pending_request;
  page_number;
  headers_res;
  per_page;
  total_page;
  current_page;
  headers_res2;
  per_page2;
  total_page2;
  current_page2;
  final_payment_count: any;
  final_avropal_status: boolean;
  searchValue: any;
  client_id: any;
  getVendorPaymentList(page?, client?, FromDate?, ToDate?, Ageing?) {
    this.page_number = page;
    this.loaderService.display(true);
    // this.client_id = client;

    if (client === 1) {
      this.client_id = undefined;
    } else {
      this.client_id = client;
    }
    this.financeService
      .getmtoVendorPaymentList(
        this.searchValue,
        this.selectedState,
        page,
        this.client_id,
        this.FromDate,
        this.ToDate,
        Ageing
      )
      .subscribe(
        (res) => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");
          res = res.json();
          this.completed_request = res.completed_payments;
          this.pending_request = res.pending_payments;
          this.vendor_ids = [];
          this.final_avropal_status = res.final_finance;
          this.final_payment_count = res.waiting_for_approval_payments
            ? res.waiting_for_approval_payments
            : 0;
          this.paymentList = res.bulk_pi_payments.data;

          this.leadList = res.vendors;
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  reqdata: any;
  getFinalRequestVendor(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    if (this.searchValue == undefined) {
      this.searchValue = "";
    }
    if (this.FromDate == undefined) {
      this.FromDate = "";
    }
    if (this.ToDate == undefined) {
      this.ToDate = "";
    }
    if (this.clientId == undefined) {
      this.clientId = 1;
    }
    this.loaderService.display(true);
    this.financeService
      .getFinalRequestVendorvenmto(
        this.current_page,
        this.FromDate,
        this.ToDate,
        this.clientId,
        this.searchValue
      )
      .subscribe((res) => {
        this.loaderService.display(false);

        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();
        this.paymentList = res.maintainance_payment;
        this.leadList = res.vendors;
        if (this.expansion != undefined && this.expansion != "") {
          this.reqdata = this.paymentList.filter(
            (el) => el.vendor_id == this.expansion
          );

          this.getListVendorRequest(this.reqdata[0]);
        }
      });
  }
  listOfpaymentrequests: any = [];
  expansion: any;
  getListVendorRequest(res) {
    this.listOfpaymentrequests = res.payment_data.data;
    for (var i = 0; i < this.listOfpaymentrequests.length; i++) {
      this.vendor_idsReq.push(this.listOfpaymentrequests[i].attributes.id);
    }

    if (this.listOfpaymentrequests.length == 0) {
      this.errorMessageShow("No Payment Request History Found");
      this.expansion = "";
    }
  }
  row = [""];
  vendorId;
  vendorslec;
  toggleRow2(ven, id) {
    if (this.row[0] !== ven.vendor_id) {
      this.expansion = ven.vendor_id;
      this.row[0] = ven.vendor_id;
      this.vendorslec = id;
      this.vendor_idsReq = [];
      this.getListVendorRequest(ven);
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
  }
  row2 = [""];
  expansion2;
  toggleRow3(ven) {
    if (this.row2[0] !== ven.id) {
      this.expansion2 = ven.id;
      this.row2[0] = ven.id;
    } else {
      this.row2[0] = "";
      this.expansion2 = "";
    }
  }
  row5 = [""];
  toggleRowcom(obj, i) {
    if (this.row5[0] !== i) {
      this.expansion = i;
      this.row5[0] = i;
    } else {
      this.row5[0] = "";
      this.expansion = i + 333;
    }
  }
  selectedArrow;
  toggleRow(row, i) {
    row.expanded = !row.expanded;
    this.selectedArrow = i;
    $(".expanded-col").css("display", "none");
    $(".expanded-col-" + row.id).css("display", "table-row");
  }
  selectedlead;
  selectedAge;
  selectSet(selectedSet) {
    this.selectedState = selectedSet;
    this.ToDate = "";
    this.FromDate = "";
    this.clientId = "";
    this.ageingVal = "";
    this.selectedlead = "";
    this.selectedAge = "";
    this.searchValue = "";
    if (this.selectedState == "pending") {
      this.getVendorPaymentList();
    } else {
      if (this.selectedState == "waiting_for_approval") {
        this.getFinalRequestVendor(this.current_page);
      } else {
        this.expansion = 77778789;
        this.getcompletedvendor(this.current_page);
      }
    }
  }
  getcompletedvendor(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    if (this.searchValue == undefined) {
      this.searchValue = "";
    }
    if (this.FromDate == undefined) {
      this.FromDate = "";
    }
    if (this.ToDate == undefined) {
      this.ToDate = "";
    }
    if (this.clientId == undefined || this.clientId == "") {
      this.clientId = "";
    }
    this.loaderService.display(true);
    this.financeService
      .getFinalRequestVendorcompletedmainmto(
        this.current_page,
        this.FromDate,
        this.ToDate,
        this.clientId,
        this.searchValue
      )
      .subscribe((res) => {
        this.loaderService.display(false);

        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();
        this.paymentList = res.maintainance_payment;
        this.leadList = res.vendors;
      });
  }
  changePaymentMode(event) {
    if (event.target.value == "NEFT/RTGS") {
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");
    } else if (event.target.value == "cheque") {
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
    }
  }
  paymentData: any;
  //Method For Save Payment For Approve
  savePayment() {
    // if($('#transaction_number').val() != ''){
    this.loaderService.display(true);
    this.paymentData = $("#transaction_number").val();
    this.financeService
      .savePaymentDetailForBulkApprovePi(
        this.payment_id,
        this.paymentData,
        this.isApprove
      )
      .subscribe(
        (res) => {
          alert(res.message);
          $("#approveModal").modal("hide");
          this.getVendorPaymentList();
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );

    // }
    // else{

    //   alert("Please Enter Transaction Number");

    // }
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
  project_id;
  payment_id;
  isApprove;
  payment_val;
  set_collected_warning: any;
  set_margin_warning: any;
  takePaymentDetail(id, stat, obj) {
    // this.set_collected_warning = obj.attributes.collected_warning;
    // this.set_margin_warning = obj.attributes.margin_warning;
    //set payment if d and status
    this.payment_id = id;
    this.isApprove = stat;

    // if (
    //   (this.set_collected_warning.show === true ||
    //     this.set_margin_warning.show === true) &&
    //   stat === "approved"
    // ) {
    //   $("#approveModal").modal("show");
    // } else
    if (stat === "approved") {
      this.savePayment();
    }
    $(".neft-mode").css("display", "none");
    $("#remarks").val("");
  }
  //Method for reject Payment
  rejectPayment() {
    if ($("#remarks").val() != "") {
      this.loaderService.display(true);
      this.payment_val = $("#remarks").val();
      this.financeService
        .RejectBulkPi(this.payment_id, this.payment_val, this.isApprove)
        .subscribe(
          (res) => {
            this.successMessageShow("Payment Rejected Successfully !!");
            $("#rejectPaymentModal").modal("hide");
            this.getVendorPaymentList();
            this.loaderService.display(false);
          },
          (err) => {
            this.errorMessageShow(JSON.parse(err["_body"]).message);
            this.loaderService.display(false);
          }
        );
    } else {
      alert("Please Enter Remarks");
    }
  }
  po_detail;
  job_elem_list;
  vendor_name;
  getPODetail(poID) {
    this.loaderService.display(true);
    this.financeService.getPODetail(poID).subscribe(
      (res) => {
        this.po_detail = res.data;
        this.job_elem_list = res.data.attributes.job_elements;

        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  downloadvendorReport(client?, FromDate?, ToDate?, Ageing?) {
    if (client === 1) {
      this.client_id = undefined;
    } else if (this.client_id !== undefined) {
      this.client_id = this.client_id;
    } else {
      this.client_id = client;
    }

    this.financeService
      .downVendorReportmain(
        this.searchValue,
        this.selectedState,
        this.client_id,
        this.FromDate,
        this.ToDate
      )
      .subscribe(
        (res) => {
          this.successalerttop = true;
          this.successMessagetop =
            "The  Vendor Payment  report you requested is being created. It will be emailed to you once complete.!";
          setTimeout(
            function () {
              this.successalerttop = false;
            }.bind(this),
            5000
          );
        },
        (err) => {
          this.erroralerttop = true;
          if (err.status == 401) {
            this.errorMessagetop =
              "you are not authorised for downloading Vendor Payment report ";
          } else {
            this.errorMessagetop =
              "we are unable to processed your request at this moments, kindly try after some time";
          }

          setTimeout(
            function () {
              this.erroralerttop = false;
            }.bind(this),
            5000
          );
        }
      );
  }
  vendor_detail;
  getVendorDetails(vendorId) {
    this.loaderService.display(true);
    this.financeService.getVendorDetails(vendorId).subscribe(
      (res) => {
        this.vendor_detail = res.vendor;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  closeDiv() {
    $("#POModal").modal("hide");
    $("#vendorModal").modal("hide");
    $("#approveModal").modal("hide");
    $("#rejectPaymentModal").modal("hide");
  }
  history_detail;
  getHistory(pi_Id) {
    $("#HistoryModal").modal("show");
    this.loaderService.display(true);
    this.financeService.getHistoryAll(pi_Id).subscribe(
      (res) => {
        this.history_detail = res.pi_payments;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  clientId;
  FromDate;
  ToDate;
  ageingVal;
  filterColumDropdownChange1(clientId) {
    if (this.clientId == undefined) {
      this.clientId = 1;
    }
    if (clientId === undefined) {
      this.clientId = 1;
    } else {
      this.clientId = clientId;
    }
    this.selectedlead = clientId;
  }

  filterData() {
    if (this.selectedState == "pending") {
      this.getVendorPaymentList(
        "",
        this.clientId,
        this.FromDate,
        this.ToDate,
        this.ageingVal
      );
    } else {
      if (this.selectedState == "waiting_for_approval") {
        this.getFinalRequestVendor("");
      } else {
        this.getcompletedvendor("");
      }
    }
  }
  takeFromDate(event) {
    this.FromDate = event.value;
  }
  takeToDate(event) {
    this.ToDate = event.value;
  }
  filterColumDropdownChange2(event) {
    this.ageingVal = event;
    this.selectedAge = event;
  }
  showAlertmsg() {
    this.errorMessageShow("There is no file uploaded for this PI");
  }
  po_preview_pdf_url: any;
  purchase_order_id;
  po_preview_pdf_url_without_base_url: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  getPOPdfForPreview(purchase_order_id?) {
    this.po_preview_pdf_url = undefined;
    if (purchase_order_id) {
      this.purchase_order_id = purchase_order_id;
      // this.downloadPoRelease(this.purchase_order_id);
    }
    this.loaderService.display(true);
    this.categoryService.getPOPdfForPreview(this.purchase_order_id).subscribe(
      (res) => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).path;
        if (this.po_preview_pdf_url == "" || this.po_preview_pdf_url == null) {
          this.erroralert = true;
          this.errorMessage = "Pdf not found for preview!!";
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
          $("#poPreviewModal").modal("hide");
        }
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        $("#poPreviewModal").modal("hide");
        this.loaderService.display(false);
      }
    );
  }
  invoice_files_list: any;
  sendUploadedInvoiceFile(files) {
    this.invoice_files_list = files;
  }
  handleApprovedUpdatedPaymentEvent(event) {
    $("#updatePoAmountModal").modal("hide");
    this.successMessageShow(event);
    this.getVendorPaymentList();
  }
  deletePOPreviewPdf(id) {
    this.categoryService.deletePOPdf(id).subscribe(
      (res) => {
        $("#poPreviewModal").modal("hide");
        this.po_preview_pdf_url = null;
      },
      (err) => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        this.loaderService.display(false);
      }
    );
  }
  updatePoModal(attr) {
    this.pi_data = attr;
  }

  //to remove underscore from string
  removeUnderScore(data) {
    return data.replace(/_/g, " ");
  }

  vendor_ids: any = [];
  selectAll(obj, e) {
    this.vendor_ids = [];
    if (e.target.checked === true) {
      for (var i = 0; i < obj.length; i++) {
        $("#checkbox" + i).prop("checked", true);
        this.vendor_ids.push(obj[i].attributes.id);
      }
    } else {
      for (var i = 0; i < obj.length; i++) {
        $("#checkbox" + i).prop("checked", false);
      }
      this.vendor_ids = [];
    }
  }
  vendor_idsReq: any = [];
  selectAll2(obj, e) {
    this.vendor_idsReq = [];
    if (e.target.checked === true) {
      for (var i = 0; i < obj.length; i++) {
        $("#checkbox3" + i).prop("checked", true);
        this.vendor_idsReq.push(obj[i].attributes.id);
      }
    } else {
      for (var i = 0; i < obj.length; i++) {
        $("#checkbox3" + i).prop("checked", false);
      }
      this.vendor_idsReq = [];
    }
  }

  show_details_data: any = [];
  data: any = [];
  checkindi(e, id) {
    var a = parseInt(id);
    if (e.target.checked === true) {
      this.vendor_ids.push(a);
    } else {
      var index = this.vendor_ids.indexOf(a);
      this.vendor_ids.splice(index, 1);
    }
  }
  checkindi3(e, id) {
    var a = parseInt(id);
    if (e.target.checked === true) {
      this.vendor_idsReq.push(a);
    } else {
      var index = this.vendor_idsReq.indexOf(a);
      this.vendor_idsReq.splice(index, 1);
    }
  }
  checkindi4(e, id) {
    var a = parseInt(id);
    if (e.target.checked === true) {
      this.vendor_idsReq.push(a);
    } else {
      var index = this.vendor_idsReq.indexOf(a);
      this.vendor_idsReq.splice(index, 1);
    }
  }

  vendor_idss: any = [];
  vendor_idssReq: any = [];
  checkindi2(e, id) {
    var a = parseInt(id);
    if (e.target.checked === true) {
      this.vendor_ids.push(a);
    } else {
      var index = this.vendor_ids.indexOf(a);

      this.vendor_ids.splice(index, 1);
    }
  }

  show_approve: boolean = false;
  approveAllss() {
    if (this.vendor_ids.length === 0) {
      this.errorMessageShow("Please Select Item First");
      this.show_approve = false;
    } else {
      this.show_approve = true;
      this.show_details_data = [];
      for (var i = 0; i < this.vendor_ids.length; i++) {
        this.data = this.paymentList.find((j) => j.id == this.vendor_ids[i]);
        this.show_details_data.push(this.data);
      }
      $("#viewapproveModal").modal("show");
    }
  }

  rejectAllss() {
    if (this.vendor_ids.length === 0) {
      this.errorMessageShow("Please Select Item First");
    } else {
      this.show_details_data = [];
      for (var i = 0; i < this.vendor_ids.length; i++) {
        this.data = this.paymentList.find((j) => j.id == this.vendor_ids[i]);
        this.show_details_data.push(this.data);
      }
      $("#viewapproveModalreject").modal("show");
    }
  }
  approveAllssreq(obj) {
    this.show_details_data = [];
    if (this.expansion != "" && this.expansion != undefined) {
      if (
        this.vendor_idsReq.length > 0 &&
        this.vendor_idsReq.length == this.listOfpaymentrequests.length
      ) {
        for (var i = 0; i < this.vendor_idsReq.length; i++) {
          this.listOfpaymentrequests.forEach((el) => {
            if (el.id == this.vendor_idsReq[i]) {
              this.show_details_data.push(el);
            }
          });
        }
        $("#viewapproveModal").modal("show");
      } else {
        if (this.vendor_idsReq.length === 0) {
          this.errorMessageShow("Please Select Item First");
          this.show_approve = false;
        } else {
          this.show_approve = true;

          for (var i = 0; i < this.vendor_idsReq.length; i++) {
            this.listOfpaymentrequests.forEach((el) => {
              if (el.id == this.vendor_idsReq[i]) {
                this.show_details_data.push(el);
              }
            });
          }
          this.approveAll2();
        }
      }
    } else {
      if (obj.vendor_id == this.vendorslec) {
        if (
          this.vendor_idsReq.length > 0 &&
          this.vendor_idsReq.length != this.listOfpaymentrequests.length
        ) {
          this.approveAll2();
        } else {
          this.vendor_idsReq = [];
          this.getListVendorRequest(obj);
          if (
            this.vendor_idsReq.length > 0 &&
            this.vendor_idsReq.length == this.listOfpaymentrequests.length
          ) {
            for (var i = 0; i < this.vendor_idsReq.length; i++) {
              this.listOfpaymentrequests.forEach((el) => {
                if (el.id == this.vendor_idsReq[i]) {
                  this.show_details_data.push(el);
                }
              });
            }
            $("#viewapproveModal").modal("show");
          } else {
            if (this.vendor_idsReq.length === 0) {
              this.errorMessageShow("Please Select Item First");
              this.show_approve = false;
            } else {
              this.show_approve = true;

              for (var i = 0; i < this.vendor_idsReq.length; i++) {
                this.listOfpaymentrequests.forEach((el) => {
                  if (el.id == this.vendor_idsReq[i]) {
                    this.show_details_data.push(el);
                  }
                });
              }
              this.approveAll2();
            }
          }
        }
      } else {
        this.vendor_idsReq = [];
        this.getListVendorRequest(obj);
        if (
          this.vendor_idsReq.length > 0 &&
          this.vendor_idsReq.length == this.listOfpaymentrequests.length
        ) {
          for (var i = 0; i < this.vendor_idsReq.length; i++) {
            this.listOfpaymentrequests.forEach((el) => {
              if (el.id == this.vendor_idsReq[i]) {
                this.show_details_data.push(el);
              }
            });
          }
          $("#viewapproveModal").modal("show");
        } else {
          if (this.vendor_idsReq.length === 0) {
            this.errorMessageShow("Please Select Item First");
            this.show_approve = false;
          } else {
            this.show_approve = true;

            for (var i = 0; i < this.vendor_idsReq.length; i++) {
              this.listOfpaymentrequests.forEach((el) => {
                if (el.id == this.vendor_idsReq[i]) {
                  this.show_details_data.push(el);
                }
              });
            }
            this.approveAll2();
          }
        }
      }
    }
  }

  rejectAllssreq(obj) {
    //     this.show_details_data = [];

    // ;     if (this.expansion != "" && this.expansion != undefined) {
    //        if (
    //          this.vendor_idsReq.length > 0 &&
    //          this.vendor_idsReq.length == this.listOfpaymentrequests.length
    //        ) {
    //          for (var i = 0; i < this.vendor_idsReq.length; i++) {
    //            this.listOfpaymentrequests.forEach((el) => {
    //              if (el.id == this.vendor_idsReq[i]) {
    //                this.show_details_data.push(el);
    //              }
    //            });
    //          }
    //          $("#viewapproveModalreject").modal("show");
    //        } else {
    //          if (this.vendor_idsReq.length === 0) {
    //            this.errorMessageShow("Please Select Item First");
    //            this.show_approve = false;
    //          } else {
    //            this.show_approve = true;

    //            for (var i = 0; i < this.vendor_idsReq.length; i++) {
    //              this.listOfpaymentrequests.forEach((el) => {
    //                if (el.id == this.vendor_idsReq[i]) {
    //                  this.show_details_data.push(el);
    //                }
    //              });
    //            }
    //            this.rejectAll2();
    //          }
    //        }
    //      } else {
    //        if (obj.vendor_id == this.vendorslec) {
    //          if (
    //            this.vendor_idsReq.length > 0 &&
    //            this.vendor_idsReq.length != this.listOfpaymentrequests.length
    //          ) {
    //           this.rejectAll2();
    //          } else {
    //            this.vendor_idsReq = [];
    //            this.getListVendorRequest(obj);
    //            if (
    //              this.vendor_idsReq.length > 0 &&
    //              this.vendor_idsReq.length == this.listOfpaymentrequests.length
    //            ) {
    //              for (var i = 0; i < this.vendor_idsReq.length; i++) {
    //                this.listOfpaymentrequests.forEach((el) => {
    //                  if (el.id == this.vendor_idsReq[i]) {
    //                    this.show_details_data.push(el);
    //                  }
    //                });
    //              }
    //              $("#viewapproveModalreject").modal("show");
    //            } else {
    //              if (this.vendor_idsReq.length === 0) {
    //                this.errorMessageShow("Please Select Item First");
    //                this.show_approve = false;
    //              } else {
    //                this.show_approve = true;

    //                for (var i = 0; i < this.vendor_idsReq.length; i++) {
    //                  this.listOfpaymentrequests.forEach((el) => {
    //                    if (el.id == this.vendor_idsReq[i]) {
    //                      this.show_details_data.push(el);
    //                    }
    //                  });
    //                }
    //               this.rejectAll2();
    //              }
    //            }
    //          }
    //        } else {
    //          this.vendor_idsReq = [];
    //          this.getListVendorRequest(obj);
    //          if (
    //            this.vendor_idsReq.length > 0 &&
    //            this.vendor_idsReq.length == this.listOfpaymentrequests.length
    //          ) {
    //            for (var i = 0; i < this.vendor_idsReq.length; i++) {
    //              this.listOfpaymentrequests.forEach((el) => {
    //                if (el.id == this.vendor_idsReq[i]) {
    //                  this.show_details_data.push(el);
    //                }
    //              });
    //            }
    //            $("#viewapproveModalreject").modal("show");
    //          } else {
    //            if (this.vendor_idsReq.length === 0) {
    //              this.errorMessageShow("Please Select Item First");
    //              this.show_approve = false;
    //            } else {
    //              this.show_approve = true;

    //              for (var i = 0; i < this.vendor_idsReq.length; i++) {
    //                this.listOfpaymentrequests.forEach((el) => {
    //                  if (el.id == this.vendor_idsReq[i]) {
    //                    this.show_details_data.push(el);
    //                  }
    //                });
    //              }
    //             this.rejectAll2();
    //            }
    //          }
    //        }
    //      }

    this.show_details_data = [];
    if (this.expansion != "" && this.expansion != undefined) {
      if (
        this.vendor_idsReq.length > 0 &&
        this.vendor_idsReq.length == this.listOfpaymentrequests.length
      ) {
        for (var i = 0; i < this.vendor_idsReq.length; i++) {
          this.listOfpaymentrequests.forEach((el) => {
            if (el.id == this.vendor_idsReq[i]) {
              this.show_details_data.push(el);
            }
          });
        }
        $("#viewapproveModalreject").modal("show");
      } else {
        if (this.vendor_idsReq.length === 0) {
          this.errorMessageShow("Please Select Item First");
          this.show_approve = false;
        } else {
          this.show_approve = true;

          for (var i = 0; i < this.vendor_idsReq.length; i++) {
            this.listOfpaymentrequests.forEach((el) => {
              if (el.id == this.vendor_idsReq[i]) {
                this.show_details_data.push(el);
              }
            });
          }
          this.rejectAll2();
        }
      }
    } else {
      if (obj.vendor_id == this.vendorslec) {
        if (
          this.vendor_idsReq.length > 0 &&
          this.vendor_idsReq.length != this.listOfpaymentrequests.length
        ) {
          this.rejectAll2();
        } else {
          this.vendor_idsReq = [];
          this.getListVendorRequest(obj);
          if (
            this.vendor_idsReq.length > 0 &&
            this.vendor_idsReq.length == this.listOfpaymentrequests.length
          ) {
            for (var i = 0; i < this.vendor_idsReq.length; i++) {
              this.listOfpaymentrequests.forEach((el) => {
                if (el.id == this.vendor_idsReq[i]) {
                  this.show_details_data.push(el);
                }
              });
            }
            $("#viewapproveModalreject").modal("show");
          } else {
            if (this.vendor_idsReq.length === 0) {
              this.errorMessageShow("Please Select Item First");
              this.show_approve = false;
            } else {
              this.show_approve = true;

              for (var i = 0; i < this.vendor_idsReq.length; i++) {
                this.listOfpaymentrequests.forEach((el) => {
                  if (el.id == this.vendor_idsReq[i]) {
                    this.show_details_data.push(el);
                  }
                });
              }
              this.rejectAll2();
            }
          }
        }
      } else {
        this.vendor_idsReq = [];
        this.getListVendorRequest(obj);
        if (
          this.vendor_idsReq.length > 0 &&
          this.vendor_idsReq.length == this.listOfpaymentrequests.length
        ) {
          for (var i = 0; i < this.vendor_idsReq.length; i++) {
            this.listOfpaymentrequests.forEach((el) => {
              if (el.id == this.vendor_idsReq[i]) {
                this.show_details_data.push(el);
              }
            });
          }
          $("#viewapproveModalreject").modal("show");
        } else {
          if (this.vendor_idsReq.length === 0) {
            this.errorMessageShow("Please Select Item First");
            this.show_approve = false;
          } else {
            this.show_approve = true;

            for (var i = 0; i < this.vendor_idsReq.length; i++) {
              this.listOfpaymentrequests.forEach((el) => {
                if (el.id == this.vendor_idsReq[i]) {
                  this.show_details_data.push(el);
                }
              });
            }
            this.rejectAll2();
          }
        }
      }
    }
  }

  final_vandors;
  approveAll() {
    this.vendor_idss = this.vendor_ids;
    if (this.vendor_idss.length === 0) {
      alert("Please Select Item First");
    } else {
      this.final_vandors = this.vendor_idss.join();
      this.loaderService.display(true);
      this.categoryService.approveAllBulkpayment(this.final_vandors).subscribe(
        (res) => {
          this.successMessageShow("Payments Approved Successfully !!");
          this.vendor_idss = [];
          this.vendor_ids = [];
          this.loaderService.display(false);
          $("#viewapproveModal").modal("hide");
          this.getVendorPaymentList();
        },
        (err) => {
          this.errorMessageShow("Something Went Wrong !!");
          this.loaderService.display(false);
        }
      );
    }
  }

  final_vandor;
  rejectAll() {
    this.vendor_idss = this.vendor_ids;
    if (this.vendor_idss.length === 0) {
      alert("Please Select Item First");
    } else {
      this.final_vandor = this.vendor_idss.join();
      this.loaderService.display(true);
      this.categoryService.rejectAllBulkpayment(this.final_vandor).subscribe(
        (res) => {
          this.successMessageShow("Payments Rejected Successfully !!");
          this.vendor_ids = [];
          this.vendor_idss = [];
          this.loaderService.display(false);
          $("#viewapproveModalreject").modal("hide");
          this.getVendorPaymentList();
        },
        (err) => {
          this.errorMessageShow("Something Went Wrong !!");
          this.loaderService.display(false);
        }
      );
    }
  }
  final_vandors2;
  approveAll2() {
    this.vendor_idssReq = this.vendor_idsReq;
    if (this.vendor_idssReq.length === 0) {
      alert("Please Select Item First");
    } else {
      this.final_vandors2 = this.vendor_idssReq.join();
      this.loaderService.display(true);
      this.categoryService
        .approveAllpaymentreqmain(this.final_vandors2)
        .subscribe(
          (res) => {
            this.successMessageShow("Payments Approved Successfully !!");
            this.vendor_idssReq = [];
            this.vendor_idsReq = [];
            this.loaderService.display(false);
            $("#viewapproveModal").modal("hide");
            this.getFinalRequestVendor(this.current_page);
          },
          (err) => {
            this.errorMessageShow("Something Went Wrong !!");
            this.loaderService.display(false);
          }
        );
    }
  }

  final_vandor2;
  rejectAll2() {
    this.vendor_idssReq = this.vendor_idsReq;
    if (this.vendor_idssReq.length === 0) {
      alert("Please Select Item First");
    } else {
      this.final_vandor2 = this.vendor_idssReq.join();
      this.loaderService.display(true);
      this.categoryService.rejectAllpaymentmain(this.final_vandor2).subscribe(
        (res) => {
          this.successMessageShow("Payments Rejected Successfully !!");
          this.vendor_idssReq = [];
          this.vendor_idsReq = [];
          this.loaderService.display(false);
          $("#viewapproveModalreject").modal("hide");
          this.getFinalRequestVendor(this.current_page);
        },
        (err) => {
          this.errorMessageShow("Something Went Wrong !!");
          this.loaderService.display(false);
        }
      );
    }
  }
  wip() {
    this.errorMessageShow("Development In Progress");
  }

  batch_detailssli: any;
  info_circle(id) {
    this.categoryService.getBatchDetail(id).subscribe((res) => {
      this.batch_detailssli = res.quotation_batch;
    });
    $("#crateBatchModalsli").modal("show");
  }

  dismissModal() {
    $("#crateBatchModalsli").modal("hide");
  }
}

