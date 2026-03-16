import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
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
  selector: "app-po-dashboard",
  templateUrl: "./po-dashboard.component.html",
  styleUrls: ["./po-dashboard.component.css"],
  providers: [CategoryService, LeadService],
})
export class PoDashboardComponent implements OnInit {
  selectedTab = "retail_po";
  activeTab = "Retail Po";
  from_date: any;
  listOfCat: any;
  to_date: any;
  data: any;
  minDate: Date;
  uploadInvoiceForm: FormGroup;
  milestoneeditForm: FormGroup;
  remarkformForInvoice: FormGroup;
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
  current_user: any;
  current_expected_delivery_date: any;
  date_type;
  dateType: any;
  role: string;
  searched_item: any = "";
  poStatus: any;
  L1Approval;
  useremail:any;
  createClassificationsactualForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private LoaderService: LoaderService,
    private leadService: LeadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.useremail =  localStorage.getItem("uid");
    console.log(this.useremail)

    this.milestoneeditForm = this.formBuilder.group({
      current_expected_delivery_date: new FormControl("", Validators.required),
    });
    this.route.queryParams.subscribe((params) => {
      this.searchstring = params["search_filter"];
    });
    this.uploadInvoiceForm = this.formBuilder.group({
      tax_invoice: [false, Validators.required],
      select_rm : [false],
      invoice_date: [new Date(), Validators.required],
      date_details: this.rm_type == true ? [new Date(), Validators.required] : [new Date()],
      invoice_number: ["", Validators.required],
      note_details: [""],
      invoice_amount: ["", Validators.required],
      tax_amount: [0],
    });
    this.createClassificationsactualForm = this.formBuilder.group({
      date_details: new FormControl(""),
      note_details: new FormControl("", [Validators.required]),
    });

    this.remarkformForInvoice = this.formBuilder.group({
      remark: ['', Validators.required],
  });

    this.from_date = "";
    this.to_date = "";
    this.getlistpo();
    this.getcountmain();
    this.current_user = localStorage.getItem("user");
    this.date_type = "edd";
    this.view_request_data.length = 0;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
this.minDate = new Date(2024, 3, 1);
  }
  handleApproveRejectEvent(status, paymentId) {
    if (confirm(`Are you sure you want to ${status} this payment ?`) == true) {
      this.LoaderService.display(true);
      this.CategoryService.submitApproveOrRejectRequest(
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
  podetails: any;
  mto_details: any;
  getlistpo() {
    if (this.searchstring == undefined) {
      this.searchstring = "";
    }

    this.LoaderService.display(true);
    this.CategoryService.getListPO(
      this.searchstring,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      this.filterAideValue,
      this.SelectedFilterjob
    ).subscribe(
      (res) => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();
        this.purchase_orders = res.purchase_orders;
        this.oders_po = res;
        this.listOfCat = res.sli_category;
        this.poStatus = res.status;
        this.L1Approval = res.can_approve_level_one;

        this.LoaderService.display(false);
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }
  getcountmain() {
    this.CategoryService.getcountpos().subscribe(
      (res) => {
        this.podetails = res.maintenance_po;
        this.mto_details = res.mto_po;
      },
      (err) => {}
    );
  }
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
        this.activeTab = "Maintenance Po";
        break;
      case "mto_po":
        this.activeTab = "MTO Po";
        break;
    }
  }
  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }

  ClearDateFilter() {
    this.date_type = "edd";
    this.dateType = "";

    this.searchstring = "";
    this.current_page = 1;

    this.to_date = "";
    this.from_date = "";
    this.final_from_date = "";
    this.final_to_date = "";
    this.filterAideValue ="";

    this.getlistpo();
  }
  edit_po_id: any;
  edited_date: any;
  eddIndex: any;
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
    this.CategoryService.editOrder(this.edit_po_id, this.edited_date).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getItems("");
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
  roundoff(data) {
    let ab = Math.floor(data);
    return ab;
  }
  po_preview_pdf_url_without_base_url: any;
  po_preview_pdf_url: any;
  getPOPdfForPreview(po) {
    let poid = po.id;
    this.CategoryService.getPOPdfForPreview(poid).subscribe(
      (res) => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
         JSON.parse(res._body).path;
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
  sliitems = [];
  ListOfinvoices: any;
  getslidetails(po) {
    this.purchase_order_id = po.id;
    this.invoice_remaining_amt = po.invoice_remaining_total_amount;
    this.payment_tem_days = po.payment_term;
    $("#Invoice").prop("checked", false);
    this.basefile = "";
    this.file_name = "";
    this.invoice_check = false;
  }

  todayByDate() {
    var todayTime = this.from_date;
    var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    this.from_date = day + "-" + month + "-" + year;

    var todayTime = this.to_date;
    var month = parseInt(("0" + (todayTime.getMonth() + 1)).slice(-2));
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    this.to_date = day + "-" + month + "-" + year;
  }

  selectedrow: any;
  row = [""];
  pending_count: any;
  check_variable: any;
  pending_arr: any = [];
  count_data_red: number = 0;
  count_data: number = 0;
  count_ids: any = [];
  toggleRow(po, i, count, e) {
    this.expanded_id = i;
    if (this.row[0] !== po.id) {
      this.pending_arr = [];
      this.pending_arr = po.pi_payments;
      this.count_data = 0;
      this.count_data_red = 0;
      this.count_ids = [];
      for (var j = 0; j < po.pi_payments.length; j++) {
        if (po.pi_payments[j].payment_status === "pending") {
          this.count_ids.push(po.pi_payments[j].id);
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

  expansion: any;
  purchase_orders: any;
  headers_res: any;
  searchstring: any;
  oders_po: any;
  getItems(e) {
    if (e !== undefined && e !== "") {
      this.current_page = e;
    }

    if (this.current_page == undefined) {
      this.current_page = 1;
    }

    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.status == undefined) {
      this.status = "";
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

    this.CategoryService.getListPO(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.current_page,
      this.status,
      this.dateType,
      this.postatusname,
      this.catnameForPo,
      this.poRelstatusname,
      this.filterAideValue,
      this.SelectedFilterjob
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res = res.headers._headers;
        this.invoiceFilterIdsByBH = []
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        if (res.status == 204) {
          this.purchase_orders = [];
          this.oders_po.total_pos = 0;
          this.oders_po.total_po_amount = 0;
          this.msgError = true;
          this.errorMessage = "No Purchase orders Data Found";
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            7000
          );
        }
        res = res.json();
        this.purchase_orders = res.purchase_orders;
        this.oders_po = res;
        this.listOfCat = res.sli_category;
        this.poStatus = res.status;
        this.L1Approval = res.can_approve_level_one;
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }
  
  downloadretailreport() {
    this.LoaderService.display(true);
    this.CategoryService.downloadretailreportmain(

    ).subscribe(
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
    this.dateType = this.date_type;
    if (this.dateType == undefined) {
      this.dateType = "";
    }
    if (this.status == undefined) {
      this.status = "";
    }
    if (this.status == undefined) {
      this.status = "";
    }

    this.CategoryService.downloadExcell(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.dateType,
      this.status,
      this.postatusname,
      this.catnameForPo,
      this.filterAideValue
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

  bulkApproval() {
    this.LoaderService.display(true);
    this.CategoryService.BulkApproveRetail().subscribe(
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
        this.LoaderService.display(false);
      }
    );
  }

  searchFilter(e: any) {
    this.searchstring = e.target.value;

    this.getItems("");
  }
  private _trasformDateType(dateValue) {
    return moment(dateValue).format("DD/MM/yyyy");
  }
  handleInvoiceDateeditSelectEvent(event: any) {
    this.milestoneeditForm.controls["current_expected_delivery_date"].setValue(
      this._trasformDateType(event)
    );
    this.edited_date = this._trasformDateType(event);
  }
  final_from_date: any;
  final_to_date: any;
  submitByDate() {
    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.status == undefined) {
      this.status = "";
    }
    this.dateType = this.date_type;
    if (this.dateType == undefined) {
      this.dateType = "edd";
    }

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

  file_name: any;
  invoice_check: any;
  purchase_order_id: any;
  basefile: any;
  filePo: any;
  invoice_remaining_amt: any;
  AddRequest(invoiceData) {
    console.log(this.remarkformForInvoice.get('remark').value);
    if (this.file_name != "") {
      var obj = invoiceData;
      obj["purchase_order_id"] = this.purchase_order_id;
      obj["attachment_file"] = this.basefile;
      obj["file_name"] = this.file_name;
      obj["remark"] = this.remarkformForInvoice.get('remark').value;

      let percent_amt = (invoiceData.invoice_amount * 18) / 100;

      this.LoaderService.display(true);
      this.CategoryService.uploadFileInPI(obj).subscribe(
        (res) => {
          $("#uploadModal").modal("hide");

          this.getItems("");
          // this.uploadInvoiceReason = ''
          this.remarkformForInvoice.reset();
          $("#poinvoiceuploadRemark").modal("hide");
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
              "Invoice can't be uploaded as PO is not released yet." ||
            JSON.parse(err["_body"]).message ==
              "you are not allowed to upload invoice for service po"
          ) {
            this.errorMessage = this.errorMessage = JSON.parse(
              err["_body"]
            ).message;
          } else {
            this.errorMessage = JSON.parse(err["_body"])["message"][
              "purchase_order_id"
            ][0];
          }
          this.errorMessageShow(this.errorMessage);
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
  rm_type:any = false;
  handleRMSelectEvent(event){
    this.rm_type = event.target.checked
    if(this.rm_type){
      this.uploadInvoiceForm.controls["note_details"].setValidators(
        Validators.required
      );
      this.uploadInvoiceForm.controls["note_details"].updateValueAndValidity();
      this.uploadInvoiceForm.controls["date_details"].setValidators(
        Validators.required
      );
      this.uploadInvoiceForm.controls["date_details"].updateValueAndValidity();
    } else {
      this.uploadInvoiceForm.controls["note_details"].clearValidators();
      this.uploadInvoiceForm.controls["note_details"].updateValueAndValidity();
      this.uploadInvoiceForm.controls["date_details"].clearValidators();
      this.uploadInvoiceForm.controls["date_details"].updateValueAndValidity();
    }
    this.uploadInvoiceForm.controls["select_rm"].setValue(this.rm_type);
  }
  payment_tem_days: any;
  handleInvoiceDateSelectEvent(eventDate) {
    this.uploadInvoiceForm.controls["invoice_date"].setValue(
      this._trasformDateType(eventDate)
    );
    this.paymentTerm = new Date(eventDate);
    this.paymentTerm.setDate(eventDate.getDate() + this.payment_tem_days);
  }

  handleInvoiceRMDateSelectEvent(eventDate) {
    this.uploadInvoiceForm.controls["date_details"].setValue(
      this._trasformDateType(eventDate)
    );
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
  attachment_file: any;
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
        this.CategoryService.submitRaiseRequestForInvoice(
          this.purchase_order_id,
          invoiceFileId,
          enteredAmt
        ).subscribe(
          (res) => {
            this.LoaderService.display(false);
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
            console.log(err);
            this.LoaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
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

  openBrowseModal() {
    $("input[id='getFile']").click();
  }

  deleteinvloice(id, po) {
    if (confirm("Are you sure to delete invoice") == true) {
      this.CategoryService.DeleteInvoice(id).subscribe(
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

  row2 = [""];
  selected_item: any;
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
      // }
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

  status: any;
  Bulk_Approval: boolean = false;
  filterStatus(e) {
    this.incursionEliminate = "PoFilpending";
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

  open_zoho() {
    $("#zohoPreviewModal").modal("show");
  }
  date_type_filter;
  changeDateType(value) {
    this.date_type = value;
    this.from_date = "";
    this.to_date = "";
  }

  pi_ids_all: any = [];
  pi_ids_all_amount: any = [];
  totalAmount: any;
  po_ids: any = [];
  checkbox_checked: boolean = false;
  selectAll(po_recieve, e) {
    this.row2[0] = "";
    this.selected_item = "";
    if (e.target.checked == true) {
      this.main_obj = {};
      this.pi_ids_all = [];
      for (var i = 0; i < po_recieve.length; i++) {
        this.main_obj[po_recieve[i].id] = [];
        for (var j = 0; j < po_recieve[i].pi_payment_pending_data.length; j++) {
          this.main_obj[po_recieve[i].id].push(
            po_recieve[i].pi_payment_pending_data[j].payment_id
          );
          this.pi_ids_all.push(
            po_recieve[i].pi_payment_pending_data[j].payment_id
          );
        }
        if (
          this.main_obj[po_recieve[i].id].length ==
            po_recieve[i].pi_payment_count &&
          po_recieve[i].pi_payment_count != 1
        ) {
          $("#checkbox-all" + i).prop("checked", true);
          $("#checkbox-all" + i).addClass("checkedRed");
        } else if (
          this.main_obj[po_recieve[i].id].length ==
            po_recieve[i].pi_payment_count &&
          po_recieve[i].pi_payment_count == 1
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
  }

  approveAll() {
    this.LoaderService.display(true);
    this.CategoryService.ApproveSecondPhaseRetail(this.pi_ids_all).subscribe(
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
    this.CategoryService.RejectSecondPhaseRetail(this.pi_ids_all).subscribe(
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
        j < this.purchase_orders[i].pi_payment_pending_data.length;
        j++
      ) {
        this.pi_ids_all.map((id) => {
          if (
            id === this.purchase_orders[i].pi_payment_pending_data[j].payment_id
          ) {
            this.totalAmount =
              this.totalAmount +
              parseFloat(
                this.purchase_orders[i].pi_payment_pending_data[j]
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
        j < this.purchase_orders[i].pi_payment_pending_data.length;
        j++
      ) {
        this.pi_ids_all.map((id) => {
          if (
            id === this.purchase_orders[i].pi_payment_pending_data[j].payment_id
          ) {
            this.view_request_data.push(
              this.purchase_orders[i].pi_payment_pending_data[j]
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

  pi_ids: any = [];
  checkManual: boolean = false;
  selec_index: number;
  index_parent: number;
  main_obj: any = {};

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

  errorMessageShow(msg) {
    this.msgError = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.msgError = false;
      }.bind(this),
      10000
    );
  }
  successMessageShow(msg) {
    this.successError = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successError = false;
      }.bind(this),
      10000
    );
  }
  DeletePO() {
    if (confirm("Are you sure to delete PO") == true) {
      this.wip();
    }
  }
  wip() {
    this.errorMessageShow("Development In Progress");
  }
  catnameForPo: any;
  postatusname: any;
  SelectedFilterjob:any

  catfilter(e) {
    this.catnameForPo = e.target.value;
    this.SelectedFilterjob = e.target.value;
    if (this.catnameForPo == 'service'){
      this.catnameForPo = 'jobwork'
    } else {
      this.catnameForPo = e.target.value
    }
    console.log(this.catnameForPo,e.target.value)
    this.getItems("");
  }
  filterofPostatus(e) {
    this.postatusname = e.target.value;
    this.getItems("");
  }

  downloadinvoice() {
    this.LoaderService.display(true);
    this.CategoryService.downloadinvoice(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.status,
      this.dateType,
      this.postatusname,
      this.catnameForPo,
      this.poRelstatusname
    ).subscribe((res) => {
      this.LoaderService.display(false);
      this.successMessageShow(res.message);
    });
  }
  POlevel_ids: any = [];
  poForApprove: any = [];
  poRelstatusname: any;
  incursionEliminate: any;
  filterofPoreleased(e) {
    this.POlevel_ids = [];
    this.poForApprove = [];
    this.poRelstatusname = e.target.value;
    this.incursionEliminate = "PoFilerel";
    this.getItems("");
  }

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
  selectAllInvoiceBhApproval(obj , e){
    this.invoiceFilterIdsByBH = [];
    this.storeInvoicePoIds = [];
    if(e.target.checked === true){
      for(var i=0 ; i<obj.length ; i++){
        $("#checkbox" + i).prop("checked", true);
        this.storeInvoicePoIds.push({
          id : obj[i].id
        });
        for(var j=0 ; j<obj[i].invoice_file_details.performa_invoice_files.length; j++){
          if(obj[i].invoice_file_details.performa_invoice_files[j].status === 'pending'){
            this.invoiceFilterIdsByBH.push({
              id : obj[i].id,
              invoice_id:  obj[i].invoice_file_details.performa_invoice_files[j].id
            }
            )
          }
        }
      } 
    }else {
      for(var i=0 ; i<obj.length ; i++){
        $("#checkbox" + i).prop("checked", false);
      }
      this.invoiceFilterIdsByBH = [];
      this.storeInvoicePoIds = [];
    }
    console.log(this.invoiceFilterIdsByBH);
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
  invoiceFilterIdsByBH: any = [];
  storeInvoicePoIds :any = []
  SelectByInvoiceFilter(e, dataByPo,index){
    if(e.target.checked === true){
      this.storeInvoicePoIds.push({
        id : dataByPo.id
      });
      for(var i=0 ; i<dataByPo.invoice_file_details.performa_invoice_files.length ; i++){
        if(dataByPo.invoice_file_details.performa_invoice_files[i].status === 'pending' ){
          this.invoiceFilterIdsByBH.push({
            id : dataByPo.id,
            invoice_id:  dataByPo.invoice_file_details.performa_invoice_files[i].id
          }
          )
        }
      }
    }else{
      let removeItems = this.invoiceFilterIdsByBH.filter((e) => {
        return e.id !== dataByPo.id
      })
      let poInvoice = this.storeInvoicePoIds.filter((e) => {
        return e.id !== dataByPo.id
      })
      this.invoiceFilterIdsByBH = removeItems
      this.storeInvoicePoIds = poInvoice
    }
    if (this.storeInvoicePoIds.length != this.purchase_orders.length) {
      $("#rootCheckbox").prop("checked", false);
    } else {
      $("#rootCheckbox").prop("checked", true);
    }
    // console.log(this.invoiceFilterIdsByBH , 'final');
    console.log(this.storeInvoicePoIds);
  }
  dataL1;
  approveModalButton2() {
    this.poForApprove = [];
     this.aprroveOrReject = "Approve";
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
  successInvoicePassed :any = []
  successInvoiceFailed :any = []
  showApproveAndReject :any
  approveForInvoiceBu(e:any){
    this.showApproveAndReject = e
    this.poForApprove = [];
    if(this.storeInvoicePoIds.length === 0 && this.invoiceFilterIdsByBH.length === 0) {
      this.errorMessageShow("Please Select  POs");
      $("#viewInvoiceRequestModal").modal("hide");
    }else {
      for (var i = 0; i < this.storeInvoicePoIds.length; i++) {
        this.dataL1 = this.purchase_orders.find(
          (j) => j.id == this.storeInvoicePoIds[i].id
        );
        this.poForApprove.push(this.dataL1);
      }
      console.log(this.poForApprove);
      $("#viewInvoiceRequestModal").modal("show");
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
  finalApproveForInvoiceBu(){
    this.LoaderService.display(true)
    let invoiceIds = this.invoiceFilterIdsByBH.map((e) => {
      return e.invoice_id
    })
    this.CategoryService.BHInvoiceApproval(invoiceIds,this.showApproveAndReject).subscribe(
      (res) => {
        this.LoaderService.display(false)
        this.invoiceFilterIdsByBH = []
        this.storeInvoicePoIds = []
        this.poForApprove = [];
        $("#rootCheckbox").prop("checked", false);
        this.successInvoicePassed = res.data.success_invoice
        this.successInvoiceFailed = res.data.failed_invoice
        $("#Invoice_Success_Report").modal("show");
        $("#viewInvoiceRequestModal").modal("hide");
        this.getItems("");
      },
      (err) => {
        this.LoaderService.display(false)
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    )
   }
  SucessPos:any = [];
  FailedPos:any =[];
  approvePOs(e:any) {
    if (this.POlevel_ids.length === 0) {
      this.errorMessageShow("Please Select POs to Approve");
    } else {
      this.LoaderService.display(true);
        this.CategoryService.ApproveL1PORetail(this.POlevel_ids).subscribe(
          (res) => {
            this.LoaderService.display(false);
            this.SucessPos = res.data.success_pos;
            this.FailedPos = res.data.failed_pos;
            if(e == 'approval_by_ch'){
              $("#PoSucessReport").modal("hide");
              this.successMessageShow("Approval is done for selected POs.");
            }else{
              $("#PoSucessReport").modal("show");
            }
            this.getItems("");
            for (var i = 0; i < this.purchase_orders.length; i++) {
              $("#checkbox" + i).prop("checked", false);
            }
            $("#rootCheckbox").prop("checked", false);
            this.POlevel_ids = [];
            $("#viewRequestModal2").modal("hide");
            this.poForApprove = [];
           
          },
          (err) => {
            this.LoaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
          }
        );
    }
  }

  bhhandoverapprovepos() {
    if (this.POlevel_ids.length === 0) {
      this.errorMessageShow("Please Select POs to Approve");
    } else {
      this.LoaderService.display(true);
        this.CategoryService.BHHandoverApproval(this.POlevel_ids).subscribe(
          (res) => {
            this.LoaderService.display(false);
            this.SucessPos = res.data.success_pos;
            this.FailedPos = res.data.failed_pos;
            $("#PoSucessReport").modal("show");
            this.getItems("");
            for (var i = 0; i < this.purchase_orders.length; i++) {
              $("#checkbox" + i).prop("checked", false);
            }
            $("#rootCheckbox").prop("checked", false);
            this.POlevel_ids = [];
            $("#viewRequestModal2").modal("hide");
            this.poForApprove = [];
           
          },
          (err) => {
            this.LoaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
          }
        );
    }
  }

  aprroveOrReject:any;
  rejectModalButton2() {
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
  
  bulkApproval2() {
    this.LoaderService.display(true);
      this.CategoryService.BulkApproveL1PORetail(this.POlevel_ids , this.poRelstatusname).subscribe(
        (res) => {
          this.LoaderService.display(false);
          this.SucessPos = res.data.success_pos;
          this.FailedPos = res.data.failed_pos;
          $("#PoSucessReport").modal("show");
          this.getItems("");
          for (var i = 0; i < this.purchase_orders.length; i++) {
            $("#checkbox" + i).prop("checked", false);
          }
          $("#rootCheckbox").prop("checked", false);
          this.POlevel_ids = [];
          $("#viewRequestModal2").modal("hide");
          this.poForApprove = [];
        
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
  }

  filterAideValue:any=''
  getAide(data:any){
this.filterAideValue=data;
this.getlistpo();
  }
  povalue:any;
  sendcheckAfterSalesTagSnag(afterSales,tagSnag,yesno,po){
    console.log(afterSales , tagSnag , yesno, 'after sales' , 'tag snag');
    this.povalue=po;
    this.rm_type = false;
    $("#addRmId").prop("checked", false);
    $("#uploadModal").modal("show");
    this.checkforafterSales = afterSales
    this.checkfortagsnag = tagSnag
    this.checkPostHandover = yesno
  }

  checkforafterSales :any
  checkfortagsnag:any
  checkPostHandover :any
  handover_reason_with_data :any
  reason_invoice_handover_PO :any
  checkinghandoverInvoiceUpload(data){
    if(this.povalue && (this.povalue.status =='released' || this.povalue.status =='closed') && this.povalue.raw_material_receiving_date == null && data.date_details && data.note_details && this.rm_type){
      this.dateDetailssactual(data)
    }
    //  after-sales --true --- no pop 
    // tag_snag -- true -- show pop 
    // if above both are false --- show pop up
    // show pop up // // // //////////      //hide
    //after sales -- false      false       true 
    //tag_snag -- false         true        false
    // regular tag snag 
    // after sales 
    let yesorNo  = this.checkPostHandover == 'Yes' ? true : false
    if(yesorNo) {
      if((!this.checkforafterSales && !this.checkfortagsnag  )){
        console.log('show pop');
        $("#poinvoiceuploadRemark").modal("show");
        $("#uploadModal").modal("hide");
        this.handover_reason_with_data = data
      } else if( !this.checkforafterSales &&  this.checkfortagsnag) {
        console.log('show pop');
        $("#poinvoiceuploadRemark").modal("show");
        $("#uploadModal").modal("hide");
        this.handover_reason_with_data = data
      }else {
        console.log('hide pop');
        this.AddRequest(data)
      }
    }else{
      console.log('hide pop');
      this.AddRequest(data)
    }
  }
  sendapprovalwithreasonnn(){
    console.log(this.remarkformForInvoice.get('remark').value);
    this.AddRequest(this.handover_reason_with_data)
  }

  reportClosure:any = false;
  openClosureModal(id,rmDate,po){
    this.reportClosure = false;
    if(rmDate == null){
      this.reportClosure = true;
      this.povalue = po;
      $("#expectedDatesActualModal").modal("show");
    }else{
      this.LoaderService.display(true)

      this.CategoryService.ClousurePO(id).subscribe(res=>{
        this.LoaderService.display(false)
        this.getItems(this.current_page);
        this.successMessageShow(res.message)
      },
      err=>{

        this.LoaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
      })
    }


  }
  poLogs:any=[];
  openPOlogModal(id){

  
    this.LoaderService.display(true)
    this.CategoryService.POlogList(id).subscribe(res=>{
      $("#POlogModal").modal("show");
      this.poLogs = res.purchase_order.po_logs;
      this.LoaderService.display(false)
    },err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err["_body"]).message);
    })
    
  }

  onClickOnRmReceived(po) {
    this.reportClosure = false;
    this.povalue = po;
    $("#expectedDatesActualModal").modal("show");
  }

  closetwomodal2(){
    this.reportClosure = false;
    $("#expectedDatesActualModal").modal("hide");
  }
  // this.leads,
  // this.ownrable_ids,
  // this.boq_display_date,
  // data.date_details,
  // data.note_details

  show_actual_value_boq: boolean = false;
  dateDetailssactual(data){
    const poId = this.povalue.id
    this.LoaderService.display(true);
    this.leadService
      .changeLeadActualDate(
        'PurchaseOrder',
        poId,
        'Raw Material',
        data.date_details,
        data.note_details
      )
      .subscribe(
        (res) => {
          $("#expectedDatesActualModal").modal("hide");
          this.LoaderService.display(false);
          this.successError = true;
          this.createClassificationsactualForm.reset();
          this.successMessage = "Date has been Updated";
          this.getlistpo();
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            3000
          );
          this.show_actual_value_boq = false;
          // this.getItems(
          //   this.current_page,
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          //   ""
          // );
          if(this.reportClosure){
            this.LoaderService.display(true)

            this.CategoryService.ClousurePO(poId).subscribe(res=>{
              this.reportClosure = false;
              this.LoaderService.display(false)
              this.getItems(this.current_page);
              this.successMessageShow(res.message)
            },
            err=>{

              this.LoaderService.display(false);
                  this.errorMessageShow(JSON.parse(err["_body"]).message);
            })
          }else{
            this.getItems(this.current_page)
          }
        },
        (err) => {
          this.msgError = true;
          this.errorMessage = JSON.parse(err["_body"]).message[0];
          setTimeout(
            function () {
              this.msgError = false;
            }.bind(this),
            3000
          );
          this.LoaderService.display(false);
        }
      );
  }
  preventManualEntry(event: KeyboardEvent) {
       event.preventDefault();
  }
}
