import { Component, EventEmitter, OnInit, Output,  } from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LeadService } from "app/platform/lead/lead.service";
import { LoaderService } from "app/services/loader.service";
import { CategoryService } from "../category.service";
import { environment } from "environments/environment";
declare var $: any;
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-bulk-po",
  templateUrl: "./bulk-po.component.html",
  styleUrls: ["./bulk-po.component.css"],
  providers: [CategoryService],
})
export class BulkPoComponent implements OnInit {
  selectedTab = "maintenance_po";
  activeTab = "Maintenance PO";
  from_date: any;
  to_date: any;
  data: any;
  uploadInvoiceForm: FormGroup;
  milestoneeditForm: FormGroup;
  add_Sli: FormGroup;
  add_Sli2: FormGroup;
  sublineItemForm: FormGroup;
  milestoneForm: FormGroup;
  update_Sli_Form: FormGroup;
  editcustomSLIForm: FormGroup;
  automated_sli: boolean = false;
  public todayDate: any = new Date();
  errorMessage: string;
  successMessage: string;
  msgError: boolean = false;
  successError: boolean = false;
  per_page: any;
  current_page: any;
  total_page: any;
  isLoaded: boolean = false;
  invoice_err_msg: string;
  invoiceType = "normal";
  invoice_date: any;
  paymentTerm;
  line_item_in_po;
  current_expected_delivery_date: any;
  podetails: any;
  current_user: any;
  eddIndex: any;
  role: string;
  dateType: any;
  minDate: Date;
  newaddcustomSLIForm: FormGroup;
  useremail:any;

  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private LoaderService: LoaderService
  ) {}

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.useremail =  localStorage.getItem("uid");
    this.selectedTab = "maintenance_po";
    this.activeTab = "Maintenance PO";
    this.milestoneeditForm = this.formBuilder.group({
      current_expected_delivery_date: new FormControl("", Validators.required),
    });
    this.uploadInvoiceForm = this.formBuilder.group({
      tax_invoice: [false, Validators.required],
      invoice_date: [new Date(), Validators.required],
      invoice_number: ["", Validators.required],
      invoice_amount: ["", Validators.required],
      tax_amount: [0],
    });

    this.from_date = "";
    this.to_date = "";
    this.getItems("");
    this.getcountretail();
    this.current_user = localStorage.getItem("user");

    this.date_type = "edd";
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
this.minDate = new Date(2024, 3, 1);
  }
  countretail: any;
  mto_details: any;
  getcountretail() {
    this.CategoryService.getcountpos().subscribe((res) => {
      this.countretail = res.retail_po;
      this.mto_details = res.mto_po;
    });
  }
  postatus: any;
  data333 = [];
  pendingfinder(data) {
    this.data333 = [];
    data.forEach((el) => {
      if (el.payment_status == "pending") {
        this.data333.push(el);
      }
    });
    return this.data333;
  }
  activateTab(tab) {
    this.selectedTab = tab;
    switch (tab) {
      case "retail_po":
        this.activeTab = "Retail Po";
        break;
      case "maintenance_po":
        this.activeTab = "Maintenance PO";
        break;
      case "mto_po":
        this.activeTab = "MTO PO";
        break;
    }
  }

  searchstring: any;
  final_from_date: any;
  final_to_date: any;
  headers_res: any;
  purchase_orders: any;
  filterByPoRealeased: any;
  L1Approval: any;
  L2Approval: any;
  getItems(e) {
    if (e !== undefined && e !== "") {
      this.current_page = e;
    }
    if (this.status == undefined) {
      this.status = "";
    }
    if (this.current_page == undefined) {
      this.current_page = 1;
    }

    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.final_from_date == undefined) {
      this.final_from_date = "";
    }
    if (this.final_to_date == undefined) {
      this.final_to_date = "";
    }
    this.dateType = this.date_type;
    if (this.dateType == undefined) {
      this.dateType = "edd";
    }
    this.LoaderService.display(true);

    this.CategoryService.getListPObulk(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.current_page,
      this.status,
      this.dateType,
      this.postatusname,
      this.poRelstatusname
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        if (res.status == 204) {
          this.purchase_orders = [];
          this.podetails.total_pos = 0;
          this.podetails.total_po_amount = 0;
          this.msgError = false;
          this.errorMessage = "No Purchase orders Data Found";
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            7000
          );
        }
        res = res.json();
        this.purchase_orders = res.po_wip_orders;
        this.podetails = res;
        this.postatus = res.status;
        this.filterByPoRealeased = res.filter_by_po_release;
        this.L1Approval = res.can_approve_level_one;
        this.L2Approval = false;
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }

  selectedrow: any;
  row = [""];
  pending_count: any;
  check_variable: any;
  checked_index: any;
  count_data_red: number = 0;
  toggleRow(po, i, count) {
    if (this.row[0] !== po.id) {
      this.pending_arr = [];
      this.pending_arr = po.bulk_pi_payments;
      this.count_data = 0;
      this.count_data_red = 0;
      this.count_ids = [];
      for (var j = 0; j < po.bulk_pi_payments.length; j++) {
        if (po.bulk_pi_payments[j].payment_status === "pending") {
          this.count_ids.push(po.bulk_pi_payments[j].id);
        }
      }

      this.expansion = po.id;
      this.row[0] = po.id;
      this.pending_count = count;
      this.check_variable = i;
      this.row2[0] = "";
      this.selected_item = "";
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
  }
  sliitems = [];
  edit_po_id: any;
  ListOfinvoices: any;
  getslidetails(po) {
    this.edit_po_id = po.id;
    this.purchase_order_id = po.id;
    this.payment_tem_days = po.payment_term;
    this.invoice_remaining_amt = po.bulk_invoice_remaining_total_amount;
    $("#Invoice").prop("checked", false);
    this.basefile = "";
    this.file_name = "";
    this.invoice_check = false;
  }
  editsPO(po, i) {
    this.eddIndex = i;
    let edd = po.initial_expected_delivery_date;
    this.current_expected_delivery_date = edd;
    this.edit_po_id = po.id;
    this.milestoneeditForm.controls["current_expected_delivery_date"].setValue(
      po.current_expected_delivery_date
    );
    this.current_expected_delivery_date = po.current_expected_delivery_date;
  }
  finaleditsubmission() {
    this.LoaderService.display(true);
    this.CategoryService.editOrdermain(
      this.edit_po_id,
      this.edited_date
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        // this.getItems("");
        this.purchase_orders[this.eddIndex].current_expected_delivery_date =
          res.expected_delivery_date;

        $("#editPOModal").modal("hide");
        this.successError = true;

        this.successMessage = res.message;
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          4000
        );
      },
      (err) => {
        this.LoaderService.display(false);
        this.msgError = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          4000
        );
      }
    );
  }

  downloadmaintenancereport() {
    this.LoaderService.display(true);
    this.CategoryService.downloadmaintenancemain().subscribe(
      (res) => {
        this.successError = true;
        this.successMessage = res.message;
        setTimeout(() => {
          this.successError = false;
        }, 4000);
        this.LoaderService.display(false);
      },
      (err) => {
        this.msgError = true;
        this.errorMessage = JSON.parse(err["_body"]).error;
        setTimeout(() => {
          this.msgError = false;
        }, 4000);
        this.LoaderService.display(false);
      }
    );
  }
  
  downloadexcell() {
    if (this.final_from_date == undefined) {
      this.final_from_date = "";
    }
    if (this.final_to_date == undefined) {
      this.final_to_date = "";
    }
    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.status == undefined) {
      this.status = "";
    }
    this.dateType = this.date_type;
    this.CategoryService.downloadExcellmain(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.dateType,
      this.status,
      this.postatusname,
      this.poRelstatusname
     
    ).subscribe(
      (res) => {
        this.successError = true;
        this.successMessage =
          "You will receive the report in email once it is ready.";
        setTimeout(() => {
          this.successError = false;
        }, 4000);
      },
      (err) => {
        this.msgError = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(() => {
          this.msgError = false;
        }, 4000);
      }
    );
  }

  po_type = "maintenance";
  bulkApproval() {
    this.LoaderService.display(true);
    this.CategoryService.BulkApproveMaintenance(this.po_type).subscribe(
      (res) => {
        this.successError = true;
        this.successMessage = res.message;
        setTimeout(() => {
          this.successError = false;
        }, 4000);
        this.LoaderService.display(false);
        this.status = "pending";
        this.getItems("");
      },
      (err) => {
        this.msgError = true;
        this.errorMessage = JSON.parse(err["_body"]).error;
        setTimeout(() => {
          this.msgError = false;
        }, 4000);
      }
    );
  }
  edited_date: any;
  private _trasformDateType(dateValue) {
    return moment(dateValue).format("DD/MM/yyyy");
  }
  handleInvoiceDateeditSelectEvent(event: any) {
    this.milestoneeditForm.controls["current_expected_delivery_date"].setValue(
      this._trasformDateType(event)
    );
    this.edited_date = this._trasformDateType(event);
  }

  ClearDateFilter() {
    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.current_page == undefined) {
      this.current_page = 1;
    }
    if (this.status == undefined) {
      this.status = "";
    }
    this.dateType = "";
    this.date_type = "edd";
    this.dateType = this.date_type;
    this.searchstring = "";
    this.current_page = 1;

    this.to_date = "";
    this.from_date = "";
    this.final_from_date = "";
    this.final_to_date = "";
    this.getItems("")
  }
  roundoff(data) {
    let ab = Math.floor(data);
    return ab;
  }
  expansion: any;
  searchFilter(e: any) {
    this.searchstring = e.target.value;
       this.getItems("");
   
  }
  submitByDate() {
    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.status == undefined) {
      this.status = "";
    }
    this.dateType = this.date_type;

    this.current_page = 1;

    if (this.from_date !== undefined && this.from_date !== "") {
      var todayTime = this.from_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_from_date = day + "-" + month + "-" + year;
    }
    if (this.to_date !== undefined && this.to_date !== "") {
      var todayTime = this.to_date;
      var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.final_to_date = day + "-" + month + "-" + year;
    }
    if (this.final_from_date == undefined) {
      this.final_from_date = "";
    }
    if (this.final_to_date == undefined) {
      this.final_to_date = "";
    }
    if (
      this.final_from_date == "" &&
      this.final_to_date == "" &&
      this.searchstring == ""
    ) {
      this.msgError = true;
      this.errorMessage = "Please Add Data to Search ";
      setTimeout(
        function () {
          this.msgError = false;
        }.bind(this),
        7000
      );
    } else {
     this.getItems("");
    }
  }
  pocap(data) {
    let dat = data.split("_");
    let date2 = [];
    dat.forEach((el) => {
      if (el == "po") {
        el = "PO";
      }
      date2.push(el);
    });
    return date2.join(" ");
  }
  handleApproveRejectEvent(status, paymentId) {
    if (confirm(`Are you sure you want to ${status} this payment ?`) == true) {
      this.LoaderService.display(true);
      this.CategoryService.submitApproveOrRejectRequestmain(
        status,
        paymentId
      ).subscribe(
        (res) => {
          this.LoaderService.display(false);
          this.getItems("");
          this.successError = true;

          this.successMessage = `Payment request ${status} successfully !`;
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            4000
          );
        },
        (err) => {
          this.msgError = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            4000
          );
          this.LoaderService.display(false);
        }
      );
    }
  }
  po_preview_pdf_url_without_base_url: any;
  po_preview_pdf_url: any;
  getPOPdfForPreview(po) {
    let poid = po.id;
    this.CategoryService.getPOPdfForPreviewmain(poid).subscribe(
      (res) => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).display_path;
        if (this.po_preview_pdf_url == "" || this.po_preview_pdf_url == null) {
          this.msgError = true;
          this.errorMessage = "Pdf not found for preview!!";
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
          $("#poPreviewModal").modal("hide");
        }
        this.LoaderService.display(false);
      },
      (err) => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.msgError = true;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        $("#poPreviewModal").modal("hide");
        this.LoaderService.display(false);
      }
    );
  }
  openBrowseModal() {
    $("input[id='getFile']").click();
  }
  file_name: any;
  attachment_file: any;
  basefile: any;

  onChange(event) {
    this.file_name = event.target.files[0].name;
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    fileReader.readAsDataURL(this.attachment_file);
  }
  purchase_order_id;
  invoice_remaining_amt;
  invoice_check;
  AddRequest(invoiceData) {
    if (this.file_name != "") {
      var obj = invoiceData;
      obj["po_wip_order_id"] = this.purchase_order_id;
      obj["attachment_file"] = this.basefile;
      obj["file_name"] = this.file_name;
      let percent_amt = (invoiceData.invoice_amount * 18) / 100;
      this.LoaderService.display(true);
      this.CategoryService.uploadFileInmain(obj).subscribe(
        (res) => {
          $("#uploadModal").modal("hide");

          this.getItems("");

          this.successError = true;
          this.successMessage = "File Uploaded successfully";
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            13000
          );

          this.uploadInvoiceFormReset();

          this.invoice_check = false;
        },
        (err) => {
          this.LoaderService.display(false);
          this.msgError = true;
          if (
            JSON.parse(err["_body"]).message ==
            "Invoice can't be uploaded as PO is not released yet."
          ) {
            this.errorMessage = this.errorMessage = JSON.parse(
              err["_body"]
            ).message;
          } else {
            this.errorMessage = JSON.parse(err["_body"])["message"][
              "po_wip_order_id"
            ][0];
          }

          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            13000
          );
        }
      );
    } else {
      alert("First Upload A File");
    }
  }
  handleInvoiceSelectEvent(event) {
    let tax_type = event.target.value === "tax" ? true : false;
    if (tax_type) {
      this.uploadInvoiceForm.controls["tax_amount"].setValidators(
        Validators.required
      );
      this.uploadInvoiceForm.controls["tax_amount"].updateValueAndValidity();
    } else {
      this.uploadInvoiceForm.controls["tax_amount"].clearValidators();
      this.uploadInvoiceForm.controls["tax_amount"].updateValueAndValidity();
    }
    this.uploadInvoiceForm.controls["tax_invoice"].setValue(tax_type);
  }
  payment_tem_days: any;
  handleInvoiceDateSelectEvent(eventDate) {
    this.uploadInvoiceForm.controls["invoice_date"].setValue(
      this._trasformDateType(eventDate)
    );
    this.paymentTerm = new Date(eventDate);
    this.paymentTerm.setDate(eventDate.getDate() + this.payment_tem_days);
  }

  uploadInvoiceFormReset() {
    this.uploadInvoiceForm.reset();
    this.invoice_err_msg = "";
    this.invoiceType = "normal";
    this.invoice_date = "";
    this.paymentTerm = "";
    this.file_name = "";
    this.uploadInvoiceForm.controls["tax_amount"].setValue(0);
    this.uploadInvoiceForm.controls["tax_invoice"].clearValidators();
    this.uploadInvoiceForm.controls["tax_invoice"].updateValueAndValidity();
  }

  row2 = [""];
  selected_item: any;
  count_ids: any = [];
  pending_arr: any = [];
  openPanel(rowId, index) {
    if (this.row2[0] !== rowId) {
      this.selected_item = rowId;
      this.row2[0] = rowId;
      setTimeout(
        function () {
          for (var i = 0; i < this.main_obj[index].length; i++) {
            $("#checkbox-allss" + this.main_obj[index][i]).prop(
              "checked",
              true
            );
          }
        }.bind(this),
        100
      );
    } else {
      this.row2[0] = "";
      this.selected_item = "";
    }
  }

  row3 = [""];
  selected_item2: any;
  openPanel2(rowId) {
    if (this.row3[0] !== rowId) {
      this.selected_item2 = rowId;
      this.row3[0] = rowId;
    } else {
      this.row3[0] = "";
      this.selected_item2 = "";
    }
  }

  selectedInvoice;
  raiseRequest(selectedInvoceId) {
    this.selectedInvoice = selectedInvoceId;
  }
  cancelRequest() {
    this.selectedInvoice = "";
  }
  submitRequest(invoiceFileId, remainingpayment) {
    let enteredAmt = (<HTMLInputElement>(
      document.getElementById(`amt-${invoiceFileId}`)
    )).value;
    if (enteredAmt) {
      if (parseInt(enteredAmt) <= parseInt(remainingpayment)) {
        this.LoaderService.display(true);
        this.CategoryService.submitRaiseRequestForInvoicemain(
          this.purchase_order_id,
          invoiceFileId,
          enteredAmt
        ).subscribe(
          (res) => {
            this.selectedInvoice = "";
            this.getItems("");
            this.successError = true;
            this.successMessage = "Request Raised Successfully";
            setTimeout(
              function () {
                this.successError = false;
              }.bind(this),
              13000
            );
          },
          (err) => {
            this.msgError = true;
            this.errorMessage = JSON.parse(err["_body"])["message"];
            setTimeout(
              function () {
                this.msgError = false;
              }.bind(this),
              13000
            );
          }
        );
      } else {
        this.msgError = true;
        this.errorMessage =
          "Entered amount should be less than equal to the remaining amount!";
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          13000
        );
      }
    } else {
      this.msgError = true;
      this.errorMessage = "Please enter Amount first";
      setTimeout(
        function () {
          this.msgError = false;
        }.bind(this),
        13000
      );
    }
  }
  handleCloseEvent() {}
  handleNegativeValue(event, invoiceFileId) {
    if (event.target.value < 0) {
      this.msgError = true;
      this.errorMessage = "You cannot enter negative value";
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        13000
      );
      (<HTMLInputElement>(
        document.getElementById(`amt-${invoiceFileId}`)
      )).value = "0";
    }
  }

  deleteinvloice(id, po) {
    if (confirm("Are you sure to delete invoice") == true) {
      this.CategoryService.DeleteInvoicemain(id).subscribe(
        (res) => {
          this.successError = true;

          this.successMessage = "Deleted Successfully";
          this.getItems("");

          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            13000
          );
        },
        (err) => {
          this.msgError = true;
          this.errorMessage = JSON.parse(err["_body"])["message"];
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            13000
          );
        }
      );
    }
  }
  status: any;
  Bulk_Approval: boolean = false;

  showCheckBox: boolean = false;
  checkbox_checked: boolean = false;
  pi_ids_all: any = [];
  pi_ids_all_amount: any = [];
  po_ids: any = [];
  totalAmount: any;
  main_obj: any = {};

  selectAll(po_recieve, e) {
    this.row2[0] = "";
    this.selected_item = "";
    if (e.target.checked == true) {
      this.main_obj = {};
      this.pi_ids_all = [];
      for (var i = 0; i < po_recieve.length; i++) {
        this.main_obj[po_recieve[i].id] = [];
        for (
          var j = 0;
          j < po_recieve[i].bulk_payment_pending_data.length;
          j++
        ) {
          this.main_obj[po_recieve[i].id].push(
            po_recieve[i].bulk_payment_pending_data[j].payment_id
          );
          this.pi_ids_all.push(
            po_recieve[i].bulk_payment_pending_data[j].payment_id
          );
        }
        if (
          this.main_obj[po_recieve[i].id].length ==
            po_recieve[i].bulk_pi_payments_count &&
          po_recieve[i].bulk_pi_payments_count != 1
        ) {
          $("#checkbox-all" + i).prop("checked", true);
          $("#checkbox-all" + i).addClass("checkedRed");
        } else if (
          this.main_obj[po_recieve[i].id].length ==
            po_recieve[i].bulk_pi_payments_count &&
          po_recieve[i].bulk_pi_payments_count == 1
        ) {
          $("#checkbox-all" + i).prop("checked", true);
          $("#checkbox-all" + i).removeClass("checkedRed");
        } else {
          $("#checkbox-all" + i).prop("checked", false);
        }
      }
    } else {
      this.main_obj = {};
      this.pi_ids_all = [];
      for (var i = 0; i < po_recieve.length; i++) {
        $("#checkbox-all" + i).prop("checked", false);
        $("#checkbox-all" + i).removeClass("checkedRed");
        $("#checkbox-all" + i).removeClass("checkedYellow");
      }
    }
  }

  forEachPo: boolean = false;
  eachPoIndex: any;
  expanded_id: any;
  selectByEachPo(index, data, po_id, p, e) {
    this.expanded_id = index;
    this.row2[0] = "";
    this.selected_item = "";
    if (e.target.checked == false) {
      $("#rootCheckbox").prop("checked", false);
    }
    // if(e.target.checked){
    if (this.main_obj[po_id] !== undefined) {
      for (var i = 0; i < data.length; i++) {
        if (this.main_obj[po_id].includes(data[i].payment_id)) {
          var index = this.main_obj[po_id].indexOf(data[i].payment_id);
          this.main_obj[po_id].splice(index, 1);
          var index1 = this.pi_ids_all.indexOf(data[i].payment_id);
          this.pi_ids_all.splice(index1, 1);
        } else {
          this.main_obj[po_id].push(data[i].payment_id);
          this.pi_ids_all.push(data[i].payment_id);
        }
      }
    } else {
      this.main_obj[po_id] = [];
      // this.main_obj[po_id].push(item);
      // this.pi_ids_all.push(item);
      for (var i = 0; i < data.length; i++) {
        this.main_obj[po_id].push(data[i].payment_id);
        this.pi_ids_all.push(data[i].payment_id);
      }
    }
    if (this.main_obj[po_id].length == 0) {
      $("#checkbox-all" + p).prop("checked", false);
      $("#checkbox-all" + p).removeClass("checkedRed");
      $("#checkbox-all" + p).removeClass("checkedYellow");
      delete this.main_obj[po_id];
    } else if (
      this.main_obj[po_id].length == this.expanded_id &&
      this.expanded_id != 1
    ) {
      $("#checkbox-all" + p).prop("checked", true);
      $("#checkbox-all" + p).addClass("checkedRed");
      $("#checkbox-all" + p).removeClass("checkedYellow");
    } else if (
      this.main_obj[po_id].length == this.expanded_id &&
      this.expanded_id == 1
    ) {
      $("#checkbox-all" + p).prop("checked", true);
      $("#checkbox-all" + p).removeClass("checkedRed");
      $("#checkbox-all" + p).removeClass("checkedYellow");
    } else {
      $("#checkbox-all" + p).prop("checked", true);
      $("#checkbox-all" + p).removeClass("checkedRed");
      $("#checkbox-all" + p).addClass("checkedYellow");
    }
    // }
    // else{
    //   delete this.main_obj[po_id];
    //   $("#checkbox-all" + p).prop("checked", false);
    //   $("#checkbox-all" + p).removeClass("checkedRed");
    //   $("#checkbox-all" + p).removeClass("checkedYellow");
    // }
  }

  approveAll() {
    this.LoaderService.display(true);
    this.CategoryService.ApproveSecondPhaseMaintaince(
      this.pi_ids_all
    ).subscribe(
      (res) => {
        this.successError = true;
        this.successMessage = res.message;
        setTimeout(() => {
          this.successError = false;
        }, 4000);
        this.LoaderService.display(false);
        this.status = "pending";
        this.getItems("");
        $("#ApproveModal").modal("hide");
        this.po_ids.length = 0;
        this.pi_ids_all_amount.length = 0;
        this.pi_ids_all.length = 0;
      },
      (err) => {
        this.msgError = true;
        this.errorMessage = JSON.parse(err["_body"]).error;
        setTimeout(() => {
          this.msgError = false;
        }, 4000);
        this.LoaderService.display(false);
      }
    );
  }

  rejectAll() {
    this.LoaderService.display(true);
    this.CategoryService.RejectSecondMaintaince(this.pi_ids_all).subscribe(
      (res) => {
        this.successError = true;
        this.successMessage = res.message;
        setTimeout(() => {
          this.successError = false;
        }, 4000);
        this.LoaderService.display(false);
        this.status = "pending";
        this.getItems("");
        $("#RejectModal").modal("hide");
        this.po_ids.length = 0;
        this.pi_ids_all_amount.length = 0;
        this.pi_ids_all.length = 0;
      },
      (err) => {
        this.msgError = true;
        this.errorMessage = JSON.parse(err["_body"]).error;
        setTimeout(() => {
          this.msgError = false;
        }, 4000);
        this.LoaderService.display(false);
      }
    );
  }

  approveModalButton() {
    if (this.pi_ids_all.length === 0) {
      this.msgError = true;
      this.errorMessage = "Please Select Payment Items";
      setTimeout(
        function () {
          this.msgError = false;
        }.bind(this),
        500
      );
      $("#ApproveModal").modal("hide");
    } else {
      $("#ApproveModal").modal("show");
      this.setApproveAmount();
    }
  }
  rejectModalButton() {
    if (this.pi_ids_all.length === 0) {
      this.msgError = true;
      this.errorMessage = "Please Select Payment Items";
      setTimeout(
        function () {
          this.msgError = false;
        }.bind(this),
        500
      );
      $("#RejectModal").modal("hide");
    } else {
      $("#RejectModal").modal("show");
      this.setApproveAmount();
    }
  }

  setApproveAmount() {
    this.totalAmount = 0;
    for (var i = 0; i < this.purchase_orders.length; i++) {
      for (
        var j = 0;
        j < this.purchase_orders[i].bulk_payment_pending_data.length;
        j++
      ) {
        this.pi_ids_all.map((id) => {
          if (
            id ===
            this.purchase_orders[i].bulk_payment_pending_data[j].payment_id
          ) {
            this.totalAmount =
              this.totalAmount +
              parseFloat(
                this.purchase_orders[i].bulk_payment_pending_data[j]
                  .approved_amount
              );
          }
        });
      }
    }
  }

  view_request_data: any = [];
  approved_amount: any = [];
  viewRequestModal() {
    this.view_request_data.length = 0;
    for (var i = 0; i < this.purchase_orders.length; i++) {
      for (
        var j = 0;
        j < this.purchase_orders[i].bulk_payment_pending_data.length;
        j++
      ) {
        this.pi_ids_all.map((id) => {
          if (
            id ===
            this.purchase_orders[i].bulk_payment_pending_data[j].payment_id
          ) {
            this.view_request_data.push(
              this.purchase_orders[i].bulk_payment_pending_data[j]
            );
          }
        });
      }
    }
  }

  closediv() {
    if ($("#viewRequestModal").hasClass("show")) {
      this.view_request_data.length = 0;
    }
  }

  closeModal() {
    this.view_request_data.length = 0;
    $("#ApproveModal").modal("hide");
    $("#RejectModal").modal("hide");
  }

  count_data: number = 0;
  ManualSelection(po_id, item) {
    if (this.main_obj[po_id] !== undefined) {
      if (this.main_obj[po_id].includes(item)) {
        var index = this.main_obj[po_id].indexOf(item);
        this.main_obj[po_id].splice(index, 1);
        var index1 = this.pi_ids_all.indexOf(item);
        this.pi_ids_all.splice(index1, 1);
      } else {
        this.main_obj[po_id].push(item);
        this.pi_ids_all.push(item);
      }
    } else {
      this.main_obj[po_id] = [];
      this.main_obj[po_id].push(item);
      this.pi_ids_all.push(item);
    }
    if (this.main_obj[po_id].length == 0) {
      $("#checkbox-all" + this.check_variable).prop("checked", false);
      $("#checkbox-all" + this.check_variable).removeClass("checkedRed");
      $("#checkbox-all" + this.check_variable).removeClass("checkedYellow");
    } else if (
      this.main_obj[po_id].length == this.pending_count &&
      this.pending_count != 1
    ) {
      $("#checkbox-all" + this.check_variable).prop("checked", true);
      $("#checkbox-all" + this.check_variable).addClass("checkedRed");
      $("#checkbox-all" + this.check_variable).removeClass("checkedYellow");
    } else if (
      this.main_obj[po_id].length == this.pending_count &&
      this.pending_count == 1
    ) {
      $("#checkbox-all" + this.check_variable).prop("checked", true);
      $("#checkbox-all" + this.check_variable).removeClass("checkedRed");
      $("#checkbox-all" + this.check_variable).removeClass("checkedYellow");
    } else {
      $("#checkbox-all" + this.check_variable).prop("checked", true);
      $("#checkbox-all" + this.check_variable).removeClass("checkedRed");
      $("#checkbox-all" + this.check_variable).addClass("checkedYellow");
    }
  }

  filterStatus(e) {
    this.po_ids.length = 0;
    this.pi_ids_all_amount.length = 0;
    this.pi_ids_all.length = 0;
    if (e.target.value == "pending") {
      this.Bulk_Approval = true;
      this.main_obj = [];
    } else {
      this.Bulk_Approval = false;
    }
    this.status = e.target.value;
    this.getItems("");
  }
  date_type: any;
  changeDateType(value) {
    this.date_type = value;
    this.from_date = "";
    this.to_date = "";
  }
  postatusname: any;
  filterofPostatus(e) {
    this.postatusname = e.target.value;

    this.getItems("");
  }
  poRelstatusname: any;
  filterofPoreleased(e) {
    this.poRelstatusname = e.target.value;
    this.POlevel_ids = [];
    this.poForApprove = [];
    this.getItems("");
  }

  downloadinvoice() {
    this.LoaderService.display(true);
    this.CategoryService.downloadinvoicenulk(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.status,
      this.dateType,
      this.postatusname
    ).subscribe((res) => {
      this.LoaderService.display(false);
      this.successError = true;
      this.successMessage = res.message;
      setTimeout(() => {
        this.successError = false;
      }, 4000);
    }),
      (err) => {
        this.LoaderService.display(false);
        this.msgError = true;
        this.errorMessage = "Something Went Wrong";
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          4000
        );
      };
  }

  errorMessageShow(msg) {
    this.msgError = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.msgError = false;
      }.bind(this),
      2000
    );
  }
  successMessageShow(msg) {
    this.successError = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successError = false;
      }.bind(this),
      2000
    );
  }

  POlevel_ids: any = [];
  selectAll2(obj, e) {
    this.POlevel_ids = [];
    if (e.target.checked === true) {
      for (var i = 0; i < obj.length; i++) {
        $("#checkbox" + i).prop("checked", true);
        this.POlevel_ids.push(obj[i].id);
      }
    } else {
      for (var i = 0; i < obj.length; i++) {
        $("#checkbox" + i).prop("checked", false);
      }
      this.POlevel_ids = [];
    }
  }
  selectByEachPo2(e, id) {
    var a = parseInt(id);
    if (e.target.checked === true) {
      this.POlevel_ids.push(a);
    } else {
      var index = this.POlevel_ids.indexOf(a);
      this.POlevel_ids.splice(index, 1);
    }
    if (this.POlevel_ids.length != this.purchase_orders.length) {
      $("#rootCheckbox").prop("checked", false);
    } else {
      $("#rootCheckbox").prop("checked", true);
    }
  }
  poForApprove: any = [];
  dataL1;
  approveModalButton2() {
    this.poForApprove = [];
    this.aprroveOrReject ="Approve"
    if (this.POlevel_ids.length === 0) {
      this.errorMessageShow("Please Select  POs");
      $("#viewRequestModal2").modal("hide");
    } else {
      for (var i = 0; i < this.POlevel_ids.length; i++) {
        this.dataL1 = this.purchase_orders.find(
          (j) => j.id == this.POlevel_ids[i]
        );
        this.poForApprove.push(this.dataL1);
      }
      $("#viewRequestModal2").modal("show");
    }
  }
  checkindi2(e, id) {
    var a = parseInt(id);
    if (e.target.checked === true) {
      this.POlevel_ids.push(a);
    } else {
      var index = this.POlevel_ids.indexOf(a);

      this.POlevel_ids.splice(index, 1);
    }
  }
  aprroveOrReject:any;
  approvePOs() {
    if (this.POlevel_ids.length === 0) {
      this.errorMessageShow("Please Select POs to Approve");
    } else {
      if (this.L1Approval) {
        this.LoaderService.display(true);
        this.CategoryService.ApproveL2PO(this.POlevel_ids).subscribe(
          (res) => {
            this.LoaderService.display(false);
            this.getItems("");
            for (var i = 0; i < this.purchase_orders.length; i++) {
              $("#checkbox" + i).prop("checked", false);
            }
            $("#rootCheckbox").prop("checked", false);
            this.POlevel_ids = [];
            $("#viewRequestModal2").modal("hide");
            this.poForApprove = [];
            this.successMessageShow("Approved SuccessFully");
          },
          (err) => {
            this.LoaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
          }
        );
      } else {
        this.LoaderService.display(true);
        this.CategoryService.ApproveL2PO(this.POlevel_ids).subscribe(
          (res) => {
            this.LoaderService.display(false);
            this.getItems("");
            for (var i = 0; i < this.purchase_orders.length; i++) {
              $("#checkbox" + i).prop("checked", false);
            }
            $("#rootCheckbox").prop("checked", false);
            this.POlevel_ids = [];
            $("#viewRequestModal2").modal("hide");
            this.poForApprove = [];
            this.successMessageShow("Approved SuccessFully");
          },
          (err) => {
            this.LoaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
          }
        );
      }
    }
  }

  rejectModalButton2(){
      this.aprroveOrReject = "Reject";
     this.poForApprove = [];
    if (this.POlevel_ids.length === 0) {
      this.errorMessageShow("Please Select  POs");
      $("#viewRequestModal2").modal("hide");
    } else {
      for (var i = 0; i < this.POlevel_ids.length; i++) {
        this.dataL1 = this.purchase_orders.find(
          (j) => j.id == this.POlevel_ids[i]
        );
        this.poForApprove.push(this.dataL1);
      }
      $("#viewRequestModal2").modal("show");
  }
}
RejectPOs(){
   if (this.POlevel_ids.length === 0) {
     this.errorMessageShow("Please Select POs to Reject");
   } else {
     if (this.L1Approval) {
       this.LoaderService.display(true);
       this.CategoryService.RejectL2PO(this.POlevel_ids).subscribe(
         (res) => {
           this.LoaderService.display(false);
           this.getItems("");
           for (var i = 0; i < this.purchase_orders.length; i++) {
             $("#checkbox" + i).prop("checked", false);
           }
           $("#rootCheckbox").prop("checked", false);
           this.POlevel_ids = [];
           $("#viewRequestModal2").modal("hide");
           this.poForApprove = [];
           this.successMessageShow("Rejected SuccessFully");
         },
         (err) => {
           this.LoaderService.display(false);
           this.errorMessageShow(JSON.parse(err["_body"]).message);
         }
       );
     } else {
       this.LoaderService.display(true);
       this.CategoryService.RejectL2PO(this.POlevel_ids).subscribe(
         (res) => {
           this.LoaderService.display(false);
           this.getItems("");
           for (var i = 0; i < this.purchase_orders.length; i++) {
             $("#checkbox" + i).prop("checked", false);
           }
           $("#rootCheckbox").prop("checked", false);
           this.POlevel_ids = [];
           $("#viewRequestModal2").modal("hide");
           this.poForApprove = [];
           this.successMessageShow("Rejected SuccessFully");
         },
         (err) => {
           this.LoaderService.display(false);
           this.errorMessageShow(JSON.parse(err["_body"]).message);
         }
       );
     }
   }

}
bulkApproval2(){
     if (this.L1Approval) {
       this.LoaderService.display(true);
       this.CategoryService.BulkApproveL2PO(this.POlevel_ids).subscribe(
         (res) => {
           this.LoaderService.display(false);
           this.getItems("");
           for (var i = 0; i < this.purchase_orders.length; i++) {
             $("#checkbox" + i).prop("checked", false);
           }
           $("#rootCheckbox").prop("checked", false);
           this.POlevel_ids = [];
           $("#viewRequestModal2").modal("hide");
           this.poForApprove = [];
           this.successMessageShow("Approved SuccessFully");
         },
         (err) => {
           this.LoaderService.display(false);
           this.errorMessageShow(JSON.parse(err["_body"]).message);
         }
       );

     } else{
     this.LoaderService.display(true);
     this.CategoryService.BulkApproveL2PO(this.POlevel_ids).subscribe(
       (res) => {
         this.LoaderService.display(false);
         this.getItems("");
         for (var i = 0; i < this.purchase_orders.length; i++) {
           $("#checkbox" + i).prop("checked", false);
         }
         $("#rootCheckbox").prop("checked", false);
         this.POlevel_ids = [];
         $("#viewRequestModal2").modal("hide");
         this.poForApprove = [];
         this.successMessageShow("Approved SuccessFully");
       },
       (err) => {
         this.LoaderService.display(false);
         this.errorMessageShow(JSON.parse(err["_body"]).message);
       }
     );
     
     
    }

}


openClosureModal(id){
    this.LoaderService.display(true)

    this.CategoryService.ClousurePOmain(id).subscribe(res=>{
      this.LoaderService.display(false)
      this.getItems(this.current_page);
      this.successMessageShow(res.message)
    },
    err=>{
      this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
    })


  }
  poLogs:any=[];
  openPOlogModal(id){
    this.LoaderService.display(true)
    this.CategoryService.POlogListmain(id).subscribe(res=>{
      $("#POlogModal").modal("show");
      this.poLogs = res.po_wip_order.po_logs;
      this.LoaderService.display(false)
    },err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err["_body"]).message);
    })

  }
  preventManualEntry(event: KeyboardEvent) {
    // Prevent any typing or manual entry in the input field
    event.preventDefault();
  }
}
