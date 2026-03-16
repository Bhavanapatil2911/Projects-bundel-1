import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/services/loader.service';
import { CategoryService } from '../category/category.service';
import { MtoDashboardService } from '../category/mto-dashboard.service';
declare var $: any;
import { environment } from "environments/environment";
import * as _moment from "moment";
import { LeadService } from 'app/platform/lead/lead.service';
const moment = (_moment as any).default ? (_moment as any).default : _moment;
@Component({
  selector: "app-mto-po",
  templateUrl: "./mto-po.component.html",
  styleUrls: ["./mto-po.component.css"],
  providers: [CategoryService, MtoDashboardService, LeadService],
})
export class MtoPoComponent implements OnInit {
  selectedTab = "mto_po";
  activeTab = "MTO PO";
  current_page;
  lead_id;
  add_Sli: FormGroup;
  sublineItemForm: FormGroup;
  milestoneForm: FormGroup;
  milestoneeditForm: FormGroup;
  uploadInvoiceForm: FormGroup;
  update_Sli_Form: FormGroup;
  AddSliForm: FormGroup;
  ProductVendorForm:FormGroup;
  TransactionChargesForm:FormGroup;

  add_Sli2: FormGroup;
  newaddcustomSLIForm: FormGroup;

  editcustomSLIForm: FormGroup;
  automated_sli: boolean = false;
  role: string;
  public todayDate: any = new Date();
  invoice_err_msg: string;
  invoiceType = "normal";
  invoice_date: any;
  paymentTerm;
  current_user: any;
  sli_page: any = 1;
  update_Sli_Form2: FormGroup;
  createClassificationsactualForm: FormGroup;
  useremail:any;

  payment_tem_days: any;
  constructor(
    private CategoryService: CategoryService,
    private MtoDashboardService: MtoDashboardService,
    private LoaderService: LoaderService,
    private formBuilder: FormBuilder,
    private LeadService: LeadService
  ) {}

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.useremail =  localStorage.getItem("uid");
    this.selectedTab = "mto_po";
    this.activeTab = "MTO PO";
    this.add_Sli = this.formBuilder.group({
      custom_slis: this.formBuilder.array([this.buildItem()]),
    });


    this.milestoneeditForm = this.formBuilder.group({
      current_expected_delivery_date: new FormControl("", Validators.required),
    });
    this.uploadInvoiceForm = this.formBuilder.group({
      tax_invoice: [false, Validators.required],
      invoice_date: [new Date(), Validators.required],
      invoice_number: ["", Validators.required],
      invoice_amount: ["", Validators.required],
      tax_amount: [0],
      select_rm : [false],
      date_details: this.rm_type == true ? [new Date(), Validators.required] : [new Date()],
      note_details: [""],
    });
    this.add_Sli2 = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      sli_category: new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      tax: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      vendor_id: new FormControl("", Validators.required),
      description: new FormControl(""),
    });
    this.sublineItemForm = this.formBuilder.group({
      name: ["", Validators.required],
      unit: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax_percent: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_product_id: ["", Validators.required],
      sli_type: ["", Validators.required],
    });
    this.update_Sli_Form2 = this.formBuilder.group({
      name: ["", Validators.required],
      sli_category: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      unit: ["", Validators.required],
      tax: ["", Validators.required],
      vendor_id: ["", Validators.required],
    });
    this.milestoneForm = this.formBuilder.group({
      shipping_address: new FormControl("", Validators.required),
      contact_person: new FormControl(""),
      shipping_address_record_id: new FormControl(""),
      vendor_gst: new FormControl("", Validators.required),
      lead_id: new FormControl(""),
      po_tag: new FormControl(""),
      type: new FormControl("mto"),
      internal_consumption_po: new FormControl(false, Validators.required),
      contact_number: new FormControl("", [
        Validators.pattern(/^[6789]\d{9}$/),
      ]),
      billing_address: new FormControl("", Validators.required),
      billing_contact_person: new FormControl(""),
      billing_contact_number: new FormControl("", [
        Validators.pattern(/^[6789]\d{9}$/),
      ]),
      sameAddress: new FormControl(false),
      // tag_snag: new FormControl("", Validators.required),
      batch_id: new FormControl("", Validators.required),
    });

    this.update_Sli_Form = this.formBuilder.group({
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax: ["", Validators.required],
    });
    this.newaddcustomSLIForm = this.formBuilder.group({
      name: ["", Validators.required],
      unit: ["", Validators.required],
      rate: ["", Validators.required],
      sli_category: ["", Validators.required],
      vendor_id: ["", Validators.required],
      sli_vendor_code: ["", Validators.required],
      sli_description: [""],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax_percent: ["", Validators.required],
    });
    this.editcustomSLIForm = this.formBuilder.group({
      name: ["", Validators.required],
      unit: ["", Validators.required],
      rate: ["", Validators.required],
      sli_category: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_product_id: ["", Validators.required],
      sli_vendor_code: ["", Validators.required],
      sli_description: [""],
    });
    this.TransactionChargesForm = this.formBuilder.group({
      transportation_tax: new FormControl(""),
      transportation_charges: new FormControl(""),
      transportation_tax_type: new FormControl(""),
    });
    this.createClassificationsactualForm = this.formBuilder.group({
      date_details: new FormControl(""),
      note_details: new FormControl("", [Validators.required]),
    });
    this.getUOMList();
    this.getVendorList();
    // this.getMtoPodata();
    this.getItems("");

    this.getcountretail();
    this.CreatAddsliForm();
    this.GetProductList2("");
    this.getLOBSList();
    this.setSelectBoxvalues();
    this.automated_sli = true;
    this.getVendorList2();
    this.CreateVendorForm();
    this.current_user = localStorage.getItem("user");
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
this.minDate = new Date(2024, 3, 1);
  }

  minDate:Date;

  mto_Data: any = [];
  // getMtoPodata(){
  //   this.CategoryService.getMtoPoData().subscribe(res=>{
  //     res=res.json();
  //     this.mto_Data = res.po_wip_orders;
  //     console.log(res)
  //   })
  // }
  listOfCat = [];
  poStatus = [];
  vendor_list;
  getVendorList() {
    this.CategoryService.getAllVendors().subscribe(
      (res) => {
        this.vendor_list = res.vendors;
      },
      (err) => {}
    );
  }

  show_actual_value_boq: boolean = false;
  dateDetailssactual(data){
    const poId = this.povalue.id
    const batchNumber = this.batch_number
    this.LoaderService.display(true);
    this.CategoryService
      .changeLeadActualDate(
        batchNumber,
        poId,
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
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            3000
          );
          this.show_actual_value_boq = false;
          if(this.reportClosure){
            this.LoaderService.display(true)
    
            this.CategoryService.ClousurePOmain(poId).subscribe(res=>{
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
            this.getItems("")
          }
        },
        (err) => {
          this.LoaderService.display(false);
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
  povalue:any;
  batch_number:any;
  onClickOnRmReceived(po) {
    this.reportClosure = false;
    this.povalue = po;
    this.batch_number = po.batch_number[0]
    $("#expectedDatesActualModal").modal("show");
  }

  closetwomodal2(){
    this.reportClosure = false;
    $("#expectedDatesActualModal").modal("hide");
  }

  handleInvoiceRMDateSelectEvent(eventDate) {
    this.uploadInvoiceForm.controls["date_details"].setValue(
      this._trasformDateType(eventDate)
    );
  }

  uploadInvoiceClick(po){
    this.povalue = po;
    this.batch_number = po.batch_number[0]
    this.rm_type = false;
    $("#addRmId").prop("checked", false);
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

  buildItem() {
    return new FormGroup({
      name: new FormControl("", Validators.required),
      sli_category: new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      tax: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      vendor_id: new FormControl(null, Validators.required),
      description: new FormControl(""),
      sli_type: new FormControl("mto"),
    });
  }
  CreatAddsliForm() {
    this.AddSliForm = this.formBuilder.group({
      tax_percent:new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      specs: new FormControl(""),
      tax_type: new FormControl("", Validators.required),
      cli_id: new FormControl(""),
      sli_type: new FormControl("mto"),
    });
  }
  getProcurementList2() {
    this.automated_sli = true;
  }
  getProcurementList3() {
    this.automated_sli = false;
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

  batch_list: any;
  openBatchModal() {
    this.selectlistBoq = undefined;
    this.list_boq = [];
    this.table_arr = [];
    this.selected_ids = [];
    $("#crateBatchModal").modal("show");
    this.getBatchData(1);
  }

  searchFilter(val) {
    this.search = val;
    this.getBatchData(1);
  }
  // current_page1: any;
  search: any = "";
  getBatchData(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
    }
    this.CategoryService.getAllbatches(
      this.current_page,
      this.search
    ).subscribe((res) => {
      this.headers_res = res.headers._headers;
      this.per_page = this.headers_res.get("x-per-page");
      this.total_page = this.headers_res.get("x-total");
      this.current_page = this.headers_res.get("x-page");
      res = res.json();
      this.batch_list = res.quotation_batches;
    });
  }
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
  po_list: any = [];
  openPOModal() {
    this.amount_total = 0;
    this.searchType ="";
    this.search_type ="vendor"
    this.selectAddressBilling = "Saved Billing Addresses";
    this.selectAddressShipping = "Saved Shipping Addresses";
    this.milestoneForm.reset();
    this.selectedItemToSubmit = [];
    this.selectedItem = [];
    $("#cratePOModal").modal("show");
    this.automated_sli = true;
    this.getSliList(1);
  }

  createBatchModal() {
    this.batch_id_batch = "";
    this.lead_id_batch = "";
    this.selected_ids = [];
    this.selc_lead_id = undefined;
    this.list_arr = {};
    this.list_arr["quotations"] = [];
    this.selectedBoq = [];
    this.table_arr = [];
    $("#openBatchModal").modal("show");
    $("#crateBatchModal").modal("hide");
  }

  createPOModal() {
    $("#cratePOModal").modal("hide");
    $("#openPOModal").modal("show");
    this.show_sli_master_edit = false;
    this.masterLinesearch = false;
    this.masterLine = false;
    this.getProcurementList();
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

  mli_type_list: { name: string; value: string }[];
  mli_type: string;
  mli_list: any;
  mli_id: any;
  getProcurementList() {
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.selectType = "";
    this.setSelectBoxvalues();
    this.GetProductList2("");
    this.automated_sli = true;
    this.sublineItemForm.controls["sli_type"].patchValue("mto");
    this.mli_type_list = [
      {
        name: "Indoline",
        value: "indoline",
      },
      {
        name: "Lakhs modular",
        value: "lakhs_modular",
      },
      {
        name: " Loose Furniture",
        value: "loose_furniture",
      },
    ];
    this.mli_type = "";
    this.getMasterLineItems(this.mli_type);
    this.getUOMList();
  }

  SliListingData: any = [];
  total_sli_items: any;
  sli_per_page: any;
  searchType:any
  getSliList(page) {
    page = page != undefined && page != "" ? page : 1;

    // this.page_number = page;
    this.LoaderService.display(true);
    this.CategoryService.getWipTableMTO(page,this.search_type,this.searchType).subscribe(
      (res) => {
        this.headers_res = res.headers._headers;
        this.sli_per_page = this.headers_res.get("x-per-page");
        this.total_sli_items = this.headers_res.get("x-total");
        this.sli_page = this.headers_res.get("x-page");

        res = res.json();
        this.SliListingData = res.vendors;

        this.LoaderService.display(false);
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }

  getMasterLineItems(event) {
    this.mli_type = event;
    this.LoaderService.display(true);
    this.CategoryService.getMasterLineItems(this.mli_type).subscribe(
      (res) => {
        this.mli_list = res.master_line_items;
        this.LoaderService.display(false);
        this.mli_id = "";
      },
      (error) => {
        this.LoaderService.display(true);
      }
    );
  }

  getAttributes(add_Sli) {
    return add_Sli.get("custom_slis").controls;
  }

  uom_list = [];
  ZoHoDataPo:any =[];

  getUOMList() {
    this.uom_list = [];
    this.CategoryService.getUOMList().subscribe(
      (res) => {
        this.uom_list = res;
      },
      (error) => {}
    );
  }

  vendor_products_list;
  sli_item_id;
  headers_res;
  per_page;
  total_page;
  page: any = 1;
  getVendorProductsList(event, page?) {
    this.mli_id = event;
    for (let obj of this.mli_list) {
      // if(this.mli_id == obj.vendor_id){
      //    this.sublineItemForm.controls['rate'].patchValue(obj.vendor_id)
      // }
    }
    this.LoaderService.display(true);
    this.CategoryService.getVendorProductsList(this.mli_id, "", page).subscribe(
      (res) => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();
        this.sli_item_id = "";
        this.vendor_products_list = res.vendor_products;

        this.LoaderService.display(false);
      },
      (error) => {
        this.LoaderService.display(false);
      }
    );
  }

  selected_vendor_product;
  product_id;
  getDetailsOfVendorProduct(product_id, product?) {
    this.product_id = product_id;
    this.LoaderService.display(true);
    this.CategoryService.getDetailsOfVendorProduct(this.product_id).subscribe(
      (res) => {
        this.selected_vendor_product = res.vendor_product;
        this.sublineItemForm.controls["name"].setValue(
          this.selected_vendor_product.sli_name
        );
        this.sublineItemForm.controls["rate"].setValue(
          this.selected_vendor_product.rate
        );
        this.sublineItemForm.controls["unit"].setValue(
          this.selected_vendor_product.unit
        );
        this.sublineItemForm.controls["vendor_id"].setValue(
          this.selected_vendor_product.vendor_id
        );
        this.sublineItemForm.controls["vendor_product_id"].setValue(
          this.selected_vendor_product.id
        );
        this.LoaderService.display(false);
      },
      (error) => {
        this.LoaderService.display(false);
      }
    );
  }

  resetForm() {
    // this.milestoneForm.reset();
    // this.update_Sli_Form.reset();
    $("#cratePOModal").modal("show");
    this.sublineItemForm.reset();
  }

  pushAttributes(add_Sli) {
    return add_Sli.get("custom_slis").push(this.buildItem());
  }

  resetAddSli() {
    $("#cratePOModal").modal("show");
    this.add_Sli.get("custom_slis").reset();
    this.sublineItemForm.reset();
    this.show_sli_master_edit = false;
    this.masterLinesearch = false;
    this.masterLine = false;
    this.result_found = "not";
    this.vendor_code = "";
    this.getSliList(1);

    (<FormArray>this.add_Sli.controls["custom_slis"]).controls = [];
    this.pushAttributes(this.add_Sli);
    this.getAttributes(this.add_Sli);
  }

  successalert: boolean = false;
  successMessage: any;
  erroralert: boolean = false;
  errorMessage: any;
  addSublineItem() {
    this.LoaderService.display(true);
    this.CategoryService.addSublineItems(this.sublineItemForm.value).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successalert = true;
        this.successMessage = "Sli added successfully";
        $("#addSli").modal("hide");
        $("#openPOModal").modal("hide");
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
        // this.getWipTableData(this.page_number);
        this.resetForm();
        this.resetAddSli();
        this.getSliList(this.sli_page);
      },
      (error) => {
        this.LoaderService.display(false);

        this.erroralert = true;
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  list_boq: any = [];
  selectedBoq: any = [];
  // update_table_arr: any = [];
  getBoqListing() {
    this.LoaderService.display(true);
    this.CategoryService.getBOQListing(this.lead_id_batch).subscribe(
      (res) => {
        this.lead_id = res[0].lead_id;
        this.list_boq = [];
        this.list_boq = res[0].quotation_ids;
        this.list_arr = {};
        this.selectlistBoq = undefined;
        this.list_arr["lead_id"] = res[0].lead_id;
        this.list_arr["lead_name"] = res[0].lead_name;
        this.successMessageShow("Successfully Fetched.");
        this.LoaderService.display(false);
        this.list_boqs = [];
      },
      (err) => {
        this.erroralert = true;
        this.list_boq = [];
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
        this.LoaderService.display(false);
      }
    );
  }

  selectlistBoqupdate: any;
  list_boqs_update: any = [];
  update_leadid: any;
  update_leadname: any;
  getupdateBoqListing() {
    this.LoaderService.display(true);
    this.CategoryService.getBOQListing(this.update_lead_id).subscribe(
      (res) => {
        this.list_boqs_update = res[0].quotation_ids;
        this.update_lead_id = res[0].lead_id;
        this.update_leadname = res[0].lead_name;
        this.selectlistBoqupdate = undefined;
        this.successMessageShow("Successfully Fetched.");
        this.LoaderService.display(false);
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
        this.LoaderService.display(false);
      }
    );
  }

  selected_ids: any = [];
  list_arr: any = {};
  list_boqs: any = [];
  boq_name: any = [];
  table_arr: any = [];
  selc_lead_id: any = "";
  all_boqs: any = [];
  selectedLeadsArr: any = [];
  selectlistBoq: any;
  addBoqList() {
    if (!this.selected_ids.includes(parseInt(this.selectlistBoq))) {
      this.selectedBoq.push(parseInt(this.selectlistBoq));
      for (var i = 0; i < this.selectedBoq.length; i++) {
        if (!this.selected_ids.includes(this.selectedBoq[i])) {
          this.selected_ids.push(this.selectedBoq[i]);
        }
      }
      this.list_boqs = [];
      for (var i = 0; i < this.list_boq.length; i++) {
        this.selectedBoq.map((item) => {
          if (item == this.list_boq[i].id) {
            this.boq_name.push(this.list_boq[i].name);
            this.list_boqs.push({ id: item, quotation: this.list_boq[i].name });
          }
        });
      }
      this.list_arr["quotations"] = this.list_boqs;
      if (this.lead_id != this.selc_lead_id) {
        this.selc_lead_id = this.lead_id;
        this.table_arr.push(this.list_arr);
      }
    } else {
      this.errorMessageShow("BOQ Already Added");
    }
  }

  deleteBoq(boq_id, index1) {
    var index = this.selected_ids.indexOf(boq_id);
    this.selected_ids.splice(index, 1);
    this.selectedBoq.splice(index, 1);
    // this.selectlistBoq.splice(index, 1);
    this.list_boqs = [];
    // this.selc_lead_id = "";
    for (var i = 0; i < this.table_arr.length; i++) {
      for (var j = 0; j < this.table_arr[i].quotations.length; j++) {
        if (this.table_arr[i].quotations[j].id == boq_id) {
          this.table_arr[i].quotations.splice(j, 1);
          // this.selectedBoq.splice(j, 1);
          // this.selectlistBoq.splice(j, 1);
        }
        if (this.table_arr[i].quotations.length == 0) {
          this.table_arr.splice(i, 1);
          this.selc_lead_id = "";
        }
      }
    }
  }

  deleteBoqupdate(boq_id, index) {
    for (var i = 0; i < this.update_id.length; i++) {
      // if (this.update_table_arr[i].quotations.length != 0){
      for (var j = 0; j < this.update_id[i].quotation_name.length; j++) {
        if (this.update_id[i].quotation_name[j] == boq_id) {
          this.update_id[i].quotation_name.splice(j, 1);
          this.update_id[i].quotation_id.splice(j, 1);
        }
        if (this.update_id[i].quotation_name.length == 0) {
          this.update_id.splice(i, 1);
        }
      }
      // }
    }
  }

  update_batch_details: any;
  update_lead_id: any;
  update_list_boqs: any = [];
  update_list: any = [];
  update_id: any = [];
  quotation_details: any = [];
  lead_detail: any = [];
  update_list_arr: any = {};
  update_table_arr: any = [];
  batch_id: any = "";
  update_idbatch: any;
  batchDetails(batch_id) {
    this.LoaderService.display(true);
    this.CategoryService.getBatchDetail(batch_id).subscribe(
      (res) => {
        this.update_lead_id = "";
        this.list_boqs_update = [];
        this.selectlistBoqupdate = undefined;
        this.update_batch_details = res.quotation_batch;
        this.update_idbatch = this.update_batch_details.batch_number;
        // this.quotation_details = this.update_batch_details["quotations"];
        this.lead_detail = this.update_batch_details["lead_details"];
        this.batch_id = batch_id;
        this.LoaderService.display(false);
        $("#crateBatchModal").modal("hide");
        $("#updateBatchModal").modal("show");
        this.update_list = [];
        this.update_id = [];
        this.updated_ids = [];
        this.update_list_arr = {};
        this.update_table_arr = [];
        for (var i = 0; i < this.lead_detail.length; i++) {
          this.update_id.push({
            id: this.lead_detail[i].lead_id,
            name: this.lead_detail[i].lead_name,
            quotation_id: this.lead_detail[i].quotation_id,
            quotation_name: this.lead_detail[i].quotation_name,
          });
        }

        // for (var i = 0; i < this.lead_detail.length; i++) {
        //   this.update_list.push({
        //     id: this.lead_detail[i].quotation_id,
        //     name: this.lead_detail[i].quotation_name,
        //   });
        // }
        // this.update_list_arr["quotations"] = this.update_list;
        // this.update_list_arr["lead_details"] = this.update_id;
        // this.update_table_arr.push(this.update_id);
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }

  batch_detailssli: any;
  batch_num_sli: any;
  show_bool: boolean = false;
  po_boq: any = "";
  batchDetails1(id) {
    this.po_boq = id.batch_number;
    this.CategoryService.getBatchDetail(id.id).subscribe((res) => {
      this.batch_detailssli = res.quotation_batch;
      this.show_bool = true;
    });
  }

  dismissModal() {
    $("#crateBatchModalsli").modal("hide");
    $("#CreatePOModal").modal("show");
  }

  // show_batchdetail: boolean = false;
  info_circle() {
    // this.show_batchdetail = true;
    $("#crateBatchModalsli").modal("show");
    $("#CreatePOModal").modal("hide");
  }

  id_set: any;
  update_list_arr1: any = {};
  update_selec_id: any;
  update1 = {};
  update2 = {};
  addBoqListupdate() {
    var ids = [];
    for (var i = 0; i < this.update_id.length; i++) {
      // if (this.update_table_arr[i].quotations != undefined){
      for (var j = 0; j < this.update_id[i].quotation_id.length; j++) {
        ids.push(this.update_id[i].quotation_id[j]);
      }
      // }
    }
    if (!ids.includes(parseInt(this.selectlistBoqupdate))) {
      // this.id_set = parseInt(this.selectlistBoqupdate[0].toString());
      this.list_boqs = [];
      // this.update_id = [];
      this.update_list = [];
      var quotations_id = [];
      var quotations_name = [];

      this.list_boqs_update.map((el, index) => {
        // this.selectlistBoqupdate.map((el2, index2) => {
        if (el.id == parseInt(this.selectlistBoqupdate)) {
          quotations_id.push(el.id);
          quotations_name.push(el.name);
        }
        // });
      });
      this.update1 = quotations_id;
      this.update2 = quotations_name;
      // if(this.update_lead_id != this.update_selec_id){
      //   this.update_selec_id = this.update_lead_id;
      this.update_id.push({
        id: this.update_lead_id,
        name: this.update_leadname,
        quotation_id: this.update1,
        quotation_name: this.update2,
      });

      // for (var i = 0; i < this.update_id.length; i++) {
      //   if (this.update_id[i].id == this.update_id[i + 1].id) {
      //     var index = this.update_id[i];
      //     this.update_id.splice(index, 1);
      //   }
      // }
    } else {
      this.errorMessageShow("Boq Already Added");
    }
  }

  show_modify: boolean = false;
  lead_id_batch: any = "";
  batch_id_batch: any = "";
  createBOQ() {
    this.LoaderService.display(true);
    var ids = this.selected_ids.toString();
    this.CategoryService.createBatch(ids, this.batch_id_batch).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.updated_batch_num = res.batch_number;
        this.show_modify = false;
        this.successMessageShow(res.message);
        $("#openBatchModal").modal("hide");
        // $("#crateBatchModal").modal("show");
        $("#copyBatchModal").modal("show");
        (<HTMLInputElement>document.getElementById("copy")).value =
          this.updated_batch_num;
        this.table_arr = [];
        this.lead_id = "";
        this.selectlistBoq = null;
        this.getBatchData(1);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message[0]);
        this.LoaderService.display(false);
      }
    );
  }

  batch_id_mod: any = "";
  updated_ids: any = [];
  updated_batch_num: any;
  edit_batchId: any = "";
  edit_boqnum: any = "";
  updateBOQ() {
    for (var i = 0; i < this.update_id.length; i++) {
      // if (this.update_table_arr[i].quotations != undefined){
      for (var j = 0; j < this.update_id[i].quotation_id.length; j++) {
        this.updated_ids.push(this.update_id[i].quotation_id[j]);
      }
      // }
    }
    this.LoaderService.display(true);
    var ids = this.updated_ids.toString();
    var boq_num = $("#edit_batchnum").val();
    this.edit_boqnum = boq_num;
    this.CategoryService.updateBatchDetail(
      this.batch_id,
      ids,
      boq_num
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("Batch Updated Successfully");
        this.updated_batch_num = res.batch_number;
        $("#updateBatchModal").modal("hide");
        // $("#crateBatchModal").modal("show");
        $("#copyBatchModal").modal("show");
        (<HTMLInputElement>document.getElementById("copy")).value =
          this.updated_batch_num;
        this.show_modify = true;
        this.batch_id_mod = this.batch_id;
        this.update_table_arr = [];
        this.update_lead_id = "";
        this.update_id = [];
        this.updated_ids = [];
        this.selectlistBoqupdate = null;
        this.getBatchData(1);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message[0]);
        this.LoaderService.display(false);
      }
    );
  }

  vendor_det;
  getVendorDetails(value) {
    this.CategoryService.getVendorDetails(value).subscribe(
      (res) => {
        this.vendor_det = res["vendor"];
        this.gst_list = res.vendor["gst_no"];

        // this.LoaderService.display(false);
      },
      (err) => {
        // this.LoaderService.display(false);
      }
    );
  }

  address_list = [];
  address_list_billing = [];
  getAddress() {
    this.CategoryService.getshippingAddressForPO().subscribe((res) => {
      this.address_list = res.po_addresses;
    });
    this.address_list_billing = [
      {
        label: "Arrivae Karnataka",
        contact: "",
        name: "",
        address: `SINGULARITY FURNITURE PRIVATE LIMITED,5th Floor, Umiya Business Bay, Tower 2, Cessna Business Park,Vartur Hobli, Outer Ring Road, Kadubeesanahalli, Bengaluru(Bangalore) Urban, Karnataka, 560037,GST Number: 29AAECP3450G1ZF `,
      },
      {
        label: "Arrivae Maharashtra",
        contact: "",
        name: "",
        address: `SINGULARITY FURNITURE PRIVATE LIMITED B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 GST Number: 27AAECP3450G1ZJ`,
      },
      {
        label: "Arrivae Tamil Nadu",
        contact: "",
        name: "",
        address: `SINGULARITY FURNITURE PRIVATE LIMITED, 26B, Bharati Villas Jawaharlal Nehru Salai, Ekkaduthangal,Guindy Industrial Estate, Chennai, Chennai, Tamil Nadu, 600032,GST Number: 33AAECP3450G1ZQ`,
      },
      {
        label: "Arrivae Telangana",
        contact: "",
        name: "",
        address: ` SINGULARITY FURNITURE PRIVATE LIMITED,5th floor, Survey No. 8, Purva Summit, Kondapur Village, WhiteField Road, Opposite Tech Mahindra, Hi-Tech City, Phase-II,Hyderabad, Telangana, 500081,GST Number: 36AAECP3450G1ZK`,
      },
      {
        label: "Arrivae West Bengal",
        contact: "",
        name: "",
        address: `SINGULARITY FURNITURE PRIVATE LIMITED 5, Dharamtolla Street, Kolkata, West Bengal, 700013,GST Number: 19AAECP3450G1ZG`,
      },
      {
        label: "WFX Technologies",
        contact: "9560915790",
        name: "Lokesh",
        address: `WFX Technologies Private Limited, B-13, Infocity-1, Sector-34, Gurugram - 122001, Haryana,GST No. : 06AAACW7299J1ZQ`,
      },
      {
        label: "Aide Technologies Pvt Ltd",
        contact: "",
        name: "",
        address: `B 501/502, Everest House, Suren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093`,
      },
      {
        label: "Arrivae Delhi",
        contact: "",
        name: "",
        address: `Singularity Furniture Private Limited,1st floor,Unit no.F-04& F-05,Trillium Avenue,Sector-29,Gurugram,Gurugram,Haryana 122009,GST Number: 06AAECP3450G1ZN`,
      },
    ];
    this.LoaderService.display(false);
    //   },
    //   err => {
    //
    //     this.LoaderService.display(false);
    //   }
    // );
  }
  selectedId: any;
  pushdataId(id, e) {
    this.selectedId = id.id;
    if (e.target.checked == true) {
      this.selectedItem.push(id.id);
      this.selectedItemToSubmit.push(id.attributes);
    } else {
      if (this.selectedItem.includes(id.id)) {
        var index = this.selectedItem.indexOf(id.id);
        this.selectedItem.splice(index, 1);
        this.selectedItemToSubmit.splice(index, 1);
      }
    }
  }

  //to set billing address
  selectAddressBilling = "Saved Billing Addresses";
  showBillAddress = false;
  setBillingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressBilling = event.target.value;

    if (event.target.value === "Saved Billing Addresses") {
      this.showBillAddress = false;

      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    } else {
      for (let i = 0; i < this.address_list_billing.length; i++) {
        if (event.target.value == this.address_list_billing[i].label) {
          this.milestoneForm.controls["billing_address"].patchValue(
            this.address_list_billing[i].address
          );
          this.milestoneForm.controls["billing_contact_person"].patchValue(
            this.address_list_billing[i].name
          );
          this.milestoneForm.controls["billing_contact_number"].patchValue(
            this.address_list_billing[i].contact
          );
          break;
        }
      }
    }
  }

  selectAddressShipping = "Saved Shipping Addresses";

  showBillingAddress() {
    //toggles the billingAddress forms in the dom
    this.showBillAddress = !this.showBillAddress;
  }

  showShipAddress: boolean;
  showShippingAddress() {
    this.showShipAddress = !this.showShipAddress;
  }
  vendorName: any;
  vendorAddress: any;
  vendorContact: any;
  vendorEmail: any;
  vendorGst: any;
  vendorPan: any;
  gst_list = [];
  vendorId;
  selectedItem = [];

  billShipAddress: Boolean = false;

  CreateModal(name, address, contact, email, gst, pan, vendor_id) {
    if (this.selectedItem.length > 0) {
      // this.showBillAddress = false
      this.showShipAddress = false;
      this.billShipAddress = true;
      $("#CreatePOModal").modal("show");
      $("#cratePOModal").modal("hide");
      // this.currentRoute = this.router.url;
      //
      // if (
      //   this.currentRoute == "/category/project-po" ||
      //   this.currentRoute == "/category/office-po"
      // ) {
      //   this.showTagSnagOption = true;
      // }

      // if (!this.showTagSnagOption) {
      //   this.milestoneForm.controls["tag_snag"].patchValue("false");
      // }
      this.vendorName = name;
      this.vendorAddress = address;
      this.vendorContact = contact;
      this.vendorEmail = email;
      this.vendorGst = gst;
      this.vendorPan = pan;
      this.getVendorDetails(vendor_id);
      this.milestoneForm.controls["type"].patchValue("mto");
      this.getAddress();
      // this.checkFormValidity();
      this.getPoTagList();
      this.lead_not_found = false;
      this.enter_submit = false;
      this.lead_details = null;
      this.getBatchList();
    } else {
      alert("Please Select Atleast One Line Item");
    }
    this.milestoneForm.controls["internal_consumption_po"].setValue(false);
    console.log(this.milestoneForm.value);
  }

  enter_submit: boolean = false;
  lead_not_found: boolean = false;
  lead_present: boolean = false;
  lead_details: any;
  po_tag_list: any;
  getPoTagList() {
    this.CategoryService.getPoTagList().subscribe(
      (res) => {
        this.po_tag_list = res["po_tags"];
        this.milestoneForm.controls["po_tag"].patchValue(this.po_tag_list[0]);
      },
      (err) => {}
    );
  }

  batch_list1: any = [];
  getBatchList() {
    this.CategoryService.getBatchesListing().subscribe(
      (res) => {
        res = res.json();
        this.batch_list1 = res;
      },
      (err) => {}
    );
  }

  poSubmission() {
    $("#cratePOModal").modal("hide");
    $(".InvoiceModal").modal("show");
    this.getTotalAmount();
  }

  selectedItemToSubmit: any = [];
  amount_total = 0;
  getTotalAmount() {
    this.amount_total = 0;
    for (let obj of this.selectedItemToSubmit) {
      this.amount_total += obj.amount;
    }
  }

  sliCat: any = [];
  sliVendor;
  submitForRelease() {
    this.LoaderService.display(true);
    this.CategoryService.poSubmit(
      this.milestoneForm.value,
      this.selectedItem,
      this.sliCat
    ).subscribe(
      (res) => {
        if(res.zoho_mapping_required){
          this.LoaderService.display(false);
          $("#CreatePOModal").modal("hide");
         
          $(".InvoiceModal").modal("hide");
          this.successMessageShow("pop Up open");
          this.getzohoData(this.selectedItem,this.milestoneForm.value.shipping_address_record_id)

        } 
        else{
        this.successalert = true;
        this.selectedItem = [];
        this.selectedItemToSubmit = [];
        this.amount_total = 0;
        $("#CreatePOModal").modal("hide");
        $(".InvoiceModal").modal("hide");
        $("#cratePOModal").modal("show");
        $("#ViewZohoMappingPo").modal("hide");
        this.milestoneForm.reset();
        this.LoaderService.display(false);
        this.successMessage = "Successfully Created";
        this.getSliList(this.sli_page);
        this.getItems("");
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
        }
      },
      (err) => {
        this.LoaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  zohoitemChecker =[];
  getzohoData(e_id,shipping_id){
    this.zohoitemChecker = [];
    this.LoaderService.display(true);

    let obj ={

      wip_sli_ids :e_id,
      shipping_address_record_id:shipping_id
    }
    this.CategoryService.ZohoPoGETMain(obj).subscribe(res=>{
      this.LoaderService.display(false);
      this.ZoHoDataPo = res;
      $("#ViewZohoMappingPo").modal("show");

    },
    err=>{

      this.errorMessageShow(JSON.parse(err["_body"]).message);
      this.LoaderService.display(false);

    })
  }

  searchstring: any;
  final_from_date: any = "";
  final_to_date: any = "";
  // headers_res: any;
  status: any = "";
  dateType: any;
  purchase_orders: any;
  date_type: any;
  podetails: any;
  getItems(e) {
    if (e !== undefined && e !== "") {
      this.current_page = e;
    }
    // if (this.status == undefined) {
    //   this.status = "";
    // }
    if (this.current_page == undefined) {
      this.current_page = 1;
    }

    if (this.searchstring == undefined) {
      this.searchstring = "";
    }
    if (this.postatusname == undefined) {
      this.postatusname = "";
    }

    // if (this.final_from_date == undefined) {
    //   this.final_from_date = "";
    // }
    // if (this.final_to_date == undefined) {
    //   this.final_to_date = "";
    // }
    this.dateType = this.date_type;
    if (this.dateType == undefined) {
      this.dateType = "edd";
    }
    this.LoaderService.display(true);

    this.CategoryService.getMtoPoData(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.current_page,
      this.status,
      this.dateType,
      this.postatusname
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        if (res.status == 204) {
          this.mto_Data = [];
          this.podetails.total_pos = 0;
          this.podetails.total_po_amount = 0;

          this.errorMessageShow("No Data Found");
        } else {
          res = res.json();
          this.mto_Data = res.po_wip_orders;
          this.podetails = res;
          this.poStatus = res.status;
          console.log(this.poStatus);
        }
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }

  selectedInvoice;
  raiseRequest(selectedInvoceId) {
    this.selectedInvoice = selectedInvoceId;
  }
  cancelRequest() {
    this.selectedInvoice = "";
  }

  deleteinvloice(id, po) {
    if (confirm("Are you sure to delete invoice") == true) {
      this.CategoryService.DeleteInvoicemain(id).subscribe(
        (res) => {
          this.successError = true;

          this.successMessage = "Deleted Successfully";
          this.getItems("");
          // this.getMtoPodata();
          setTimeout(
            function () {
              this.successError = false;
            }.bind(this),
            13000
          );
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"])["message"];
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );
        }
      );
    }
  }
  openBrowseModal() {
    $("input[id='getFile']").click();
  }

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

  purchase_order_id;
  quotation_batch_id;
  invoice_remaining_amt;
  invoice_check;
  basefile: any;
  file_name: any;
  attachment_file: any;

  getSlideDetails(po) {
    this.edit_po_id = po.id;
    this.purchase_order_id = po.id;
    this.quotation_batch_id = po.quotation_batch_id;
    this.payment_tem_days = po.payment_term;
    this.invoice_remaining_amt = po.bulk_invoice_remaining_total_amount;
    $("#Invoice").prop("checked", false);
    this.basefile = "";
    this.file_name = "";
    this.invoice_check = false;
  }

  expansion: any;
  selectedrow: any;
  row = [""];

  eddIndex: any;
  current_expected_delivery_date: any;
  edit_po_id: any;
  edited_date: any;
  // purchase_orders: any;
  successError: boolean = false;
  msgError: boolean = false;

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
        this.getItems("");

        $("#editPOModal").modal("hide");
        this.successalert = true;

        this.successMessage = res.message;
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          4000
        );
        this.purchase_orders[this.eddIndex].current_expected_delivery_date =
          res.expected_delivery_date;
      },
      (err) => {
        this.LoaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          4000
        );
      }
    );
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

  po_preview_pdf_url_without_base_url: any;
  po_preview_pdf_url: any;
  getPOPdfForPreview(po) {
    let poid = po.id;
    this.CategoryService.getPOPdfForPreviewmain(poid).subscribe(
      (res) => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).display_path;
        console.log(this.po_preview_pdf_url);
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

  handleInvoiceDateSelectEvent(eventDate) {
    this.uploadInvoiceForm.controls["invoice_date"].setValue(
      this._trasformDateType(eventDate)
    );
    this.paymentTerm = new Date(eventDate);
    this.paymentTerm.setDate(eventDate.getDate() + this.payment_tem_days);
  }

  handleInvoiceSelectEvent(event) {
    console.log(event.target.value);
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

  AddRequest(invoiceData) {
    if(this.povalue && (this.povalue.status =='pending' || this.povalue.status =='closed') && this.povalue.rm_receiving_date == null && invoiceData.date_details && invoiceData.note_details && this.rm_type){
      this.dateDetailssactual(invoiceData)
    }
    if (this.file_name != "") {
      var obj = invoiceData;
      obj["po_wip_order_id"] = this.purchase_order_id;
      obj["attachment_file"] = this.basefile;
      obj["file_name"] = this.file_name;
      let percent_amt = (invoiceData.invoice_amount * 18) / 100;
     
    } else {
      alert("First Upload A File");
    }
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
        this.LoaderService.display(false);
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
           this.errorMessageShow(this.errorMessage);
         } else {
           this.errorMessage = JSON.parse(err["_body"])["message"][
             "po_wip_order_id"
           ][0];
             this.errorMessageShow(this.errorMessage);
         }
       
      }
    );
        
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

  submitRequest(invoiceFileId, remainingpayment) {
    console.log(remainingpayment);
    let enteredAmt = (<HTMLInputElement>(
      document.getElementById(`amt-${invoiceFileId}`)
    )).value;
    if (enteredAmt) {
      this.LoaderService.display(true);
      if (parseInt(enteredAmt) <= parseInt(remainingpayment)) {
        this.CategoryService.mtosubmitRaiseRequestForInvoicemain(
          this.purchase_order_id,
          invoiceFileId,
          enteredAmt,
          this.quotation_batch_id
        ).subscribe(
          (res) => {
            this.selectedInvoice = "";
            this.getItems("");
            this.successMessageShow(res.message);
            this.LoaderService.display(false);
          },
          (err) => {
            this.errorMessageShow(JSON.parse(err["_body"])["message"]);
            this.LoaderService.display(false);
          }
        );
      } else {
        this.errorMessageShow(
          "Entered amount should be less than equal to the remaining amount!"
        );
        this.LoaderService.display(false);
      }
    } else {
      this.LoaderService.display(false);
      this.errorMessageShow("Please enter Amount first");
    }
  }

  countretail: any;
  maintenance_po: any;
  mto_po_details: any;
  getcountretail() {
    this.CategoryService.getcountpos().subscribe((res) => {
      this.countretail = res.retail_po;
      this.maintenance_po = res.maintenance_po;
    });
  }

  from_date: any;
  to_date: any;
  changeDateType(value) {
    this.date_type = value;
    this.final_from_date = "";
    this.final_to_date = "";
  }

  searchFiltertop(val) {
    this.searchstring = val;
    this.getItems(1);
  }

  submitByDate() {
    this.getItems(1);
  }

  modifyId;
  modifyPoId(id) {
    $("#modifyPo").modal("show");
    this.modifyId = id;
  }

  option;
  modifyPo() {
    this.option = "modify_po";
    this.LoaderService.display(true);
    this.CategoryService.modifyPosmto(this.modifyId, this.option).subscribe(
      (res) => {
        this.successalert = true;
        this.modifyId = null;
        this.successMessageShow("PO Modified");
        $("#modifyPo").modal("hide");
        this.LoaderService.display(false);
        this.getItems(1);
      },
      (error) => {
        this.erroralert = true;
        this.LoaderService.display(false);
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  cancleId;
  cancelPoId(id) {
    this.cancleId = id;
  }

  canclePo() {
    this.option = "cancelled";
    this.LoaderService.display(true);
    this.CategoryService.modifyPosmto(this.cancleId, this.option).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.cancleId = null;
        this.successMessageShow("Po cancel successfully");
        $("#canclePo").modal("hide");
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
        this.getItems(1);
      },
      (error) => {
        this.erroralert = true;
        this.LoaderService.display(false);
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  cancledcanclePo() {
    this.cancleId = null;
    $("#canclePo").modal("hide");
    $("#modifyPo").modal("hide");
  }

  closeCrateBatchModal() {
    $("#crateBatchModal").modal("hide");
  }

  closeBatchModal() {
    this.selectlistBoq = null;
    this.table_arr = [];
    this.selectedBoq = [];
    this.list_boqs = [];
    this.list_boq = [];
    this.selc_lead_id = "";
    // this.list_arr = {};
    // this.boq_name = [];
    $("#openBatchModal").modal("hide");
    $("#crateBatchModal").modal("show");
  }

  closeCratePOModal() {
    this.row[0] = "";
    this.expansion = "";
    this.getItems("");
    $("#cratePOModal").modal("hide");
  }

  closeUpdateMtoBatch() {
    this.lead_detail = [];
    this.update_lead_id = "";
    this.selectlistBoqupdate = null;
    this.list_boqs_update = [];
    $("#crateBatchModal").modal("show");
    $("#updateBatchModal").modal("hide");
  }

  ClearDateFilter() {
    (this.searchstring = ""),
      (this.final_from_date = ""),
      (this.final_to_date = ""),
      (this.current_page = 1),
      (this.dateType = "edd");
    this.getItems(1);
  }

  transform(value: string): string {
    return value.replace(/_/g, " ");
  }

  // showShipAddress: boolean;
  setShippingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressShipping = event.target.value;

    if (event.target.value === "Saved Shipping Addresses") {
      this.showShipAddress = false;

      this.milestoneForm.controls["shipping_address"].patchValue("");
      this.milestoneForm.controls["contact_person"].patchValue("");
      this.milestoneForm.controls["contact_number"].patchValue("");
    } else {
      this.showShipAddress = true;
      for (let i = 0; i < this.address_list.length; i++) {
        if (event.target.value == this.address_list[i].title) {
          this.milestoneForm.controls["shipping_address"].patchValue(
            this.address_list[i].address
          );
          this.milestoneForm.controls["contact_person"].patchValue(
            this.address_list[i].contact_name
          );
          this.milestoneForm.controls["contact_number"].patchValue(
            this.address_list[i].contact_number
          );
          this.milestoneForm.controls["shipping_address_record_id"].patchValue(
            this.address_list[i].id
          );
          break;
        }
      }
    }
    this.showShipAddress = true;
  }

  po_type = "mto";
  bulkApproval() {
    this.LoaderService.display(true);
    this.CategoryService.BulkApproveMaintenance(this.po_type).subscribe(
      (res) => {
        this.successMessageShow(res.message);
        this.LoaderService.display(false);
        this.status = "pending";
        this.getItems(1);
      },
      (err) => {
        // this.msgError = true;
        // this.errorMessage = JSON.parse(err["_body"]).error;
        // setTimeout(() => {
        //   this.msgError = false;
        // }, 4000);
        this.errorMessageShow(JSON.parse(err["_body"]).error);
      }
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
  // status: any;
  Bulk_Approval: boolean = false;

  filterStatus(e) {
    if (e.target.value == "pending") {
      this.Bulk_Approval = true;
    } else {
      this.Bulk_Approval = false;
    }
    this.status = e.target.value;

    this.getItems(1);
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
          this.getItems(1);
          // this.successError = true;

          // this.successMessage = `Payment request ${status} successfully !`;
          // setTimeout(
          //   function () {
          //     this.successError = false;
          //   }.bind(this),
          //   4000
          // );
          this.successMessageShow(`Payment request ${status} successfully !`);
        },
        (err) => {
          // this.msgError = true;
          // this.errorMessage = JSON.parse(err["_body"]).message;
          // setTimeout(
          //   function () {
          //     this.msgError = false;
          //   }.bind(this),
          //   4000
          // );
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.LoaderService.display(false);
        }
      );
    }
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
  }

  //to edit sli
  Sli_id;
  FullHierDataedit: any;
  taxEnable =true;
  editSli(data) {
    console.log(data);
     this.Sli_id = data.id;
    this.FullHierDataedit = data;
    this.AddSliForm.controls["quantity"].setValue(data.quantity);
    this.AddSliForm.controls["rate"].setValue(data.rate);
    this.AddSliForm.controls["specs"].setValue(data.description);
    this.AddSliForm.controls["tax_type"].setValue(data.tax_type);
    this.AddSliForm.controls["tax_percent"].setValue(data.tax
      );
     this.AddSliForm.controls["cli_id"].setValue(
       data.category_details && data.category_details.cli_id
         ? data.category_details.cli_id
         : ""
     );
    this.AddSliForm.controls["sli_type"].setValue("mto");
    this.RateEnable = true;
    this.taxEnable =true;
   
  }
  editSli2(id, data, v) {
    console.log(data);
    console.log(v);
    $("#cratePOModal").modal("hide");
    $("#editSliModal").modal("hide");
    this.Sli_id = id;
    this.update_Sli_Form2.controls["quantity"].setValue(data.quantity);
    this.update_Sli_Form2.controls["rate"].setValue(data.rate);
    this.update_Sli_Form2.controls["tax_type"].setValue(data.tax_type);
    this.update_Sli_Form2.controls["tax"].setValue(data.tax);
    this.update_Sli_Form2.controls["name"].setValue(data.sli_name);
    this.update_Sli_Form2.controls["sli_category"].setValue(data.sli_category);
    this.update_Sli_Form2.controls["unit"].setValue(data.unit);
    this.update_Sli_Form2.controls["vendor_id"].setValue(v);
  }

  Sliupdate() {
    this.LoaderService.display(true);

    this.CategoryService
      .updateSliItems(this.Sli_id, this.AddSliForm.value)
      .subscribe(
        (res) => {
          this.LoaderService.display(false);
          this.successMessage = res.message;
          $("#editSliModal").modal("hide");
          this.selectedItem = [];
          this.selectedItemToSubmit = [];
          this.getSliList(this.sli_page);
          this.successMessageShow("Sli updated Successfully");
        },
         
        (err) => {
          this.LoaderService.display(false);
          this.errorMessage = JSON.parse(err["_body"]).message;
         this.errorMessageShow(this.errorMessage);
        }
      )
      
  }
  updateSlis2() {
    this.LoaderService.display(true);
    this.CategoryService.updateSliItemsmto(
      this.Sli_id,
      this.update_Sli_Form2.value
    ).subscribe(
      (res) => {
        this.successalert = true;
        this.LoaderService.display(false);
        this.successMessage = res.message;
        $("#editSliModal2").modal("hide");
        $("#cratePOModal").modal("show");
        this.getSliList(this.sli_page);
        this.successMessageShow(res.message);
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  cancelSubmitPo() {
    $(".InvoiceModal").modal("hide");
    this.getSliList(this.sli_page);
    this.getItems("");
  }
  removeSliItem(id) {
    this.LoaderService.display(true);
    this.CategoryService.removeSliItemsmto(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessage = res.message;
        this.successMessageShow(this.successMessage);
        this.getSliList(this.sli_page);
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  closeConfirmModal() {
    $("#crateBatchModal").modal("show");
  }

  poreleaseclose() {
    this.selectedItemToSubmit = [];
    this.selectedItem = [];
    this.amount_total = 0;
    this.selectAddressBilling = "Saved Billing Addresses";
    this.selectAddressShipping = "Saved Shipping Addresses";
    this.milestoneForm.reset();
    $("#CreatePOModal").modal("hide");
    $("#cratePOModal").modal("show");
    setTimeout(
      function () {
        this.unCheckBox();
      }.bind(this),
      100
    );
  }
  unCheckBox() {
    for (var i = 0; i < this.SliListingData.length; i++) {
      for (var j = 0; j < this.SliListingData[i].wip_slis.length; j++) {
        if (
          this.SliListingData[i].wip_slis[j].attributes.status == "pending" ||
          this.SliListingData[i].wip_slis[j].attributes.status == "modify_po" ||
          this.SliListingData[i].wip_slis[j].attributes.status == "cancelled"
        ) {
          $(
            "#checkbox-allss" + this.SliListingData[i].wip_slis[j].attributes.id
          ).prop("checked", false);
        }
      }
    }
  }

  downloadmtoreport() {
    this.LoaderService.display(true);
    this.CategoryService.downloadmtomain().subscribe(
      (res) => {
        this.successMessageShow(res.message);
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

  downloadMtoExcel() {
    if (this.final_from_date == undefined) this.final_from_date = "";
    if (this.final_to_date == undefined) this.final_to_date = "";
    if (this.searchstring == undefined) this.searchstring = "";
    if (this.status == undefined) this.status = "";

    this.dateType = this.date_type;
    if (this.dateType == undefined) this.dateType = "edd";

    this.MtoDashboardService.downloadMtoExcelMain(
      this.searchstring,
      this.final_from_date,
      this.final_to_date,
      this.dateType,
      this.status
    ).subscribe(
      (res) => {
        this.successMessageShow(
          "You will receive the report in email once it is ready."
        );
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  catnameForPo: any;
  postatusname: any;

  catfilter(e) {
    this.catnameForPo = e.target.value;
    this.getItems("");
  }
  filterofPostatus(e) {
    this.postatusname = e.target.value;
    this.getItems("");
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
downloadmtoinvoicereport(){
   this.LoaderService.display(true);
   this.CategoryService.downloadinvoicenulkmto(
     this.searchstring,
     this.final_from_date,
     this.final_to_date,
     this.status,
     this.dateType,
     this.postatusname
   ).subscribe((res) => {
     this.LoaderService.display(false);
     this.successMessageShow(res.message);
   }),
     (err) => {
       this.LoaderService.display(false);
       this.errorMessageShow("Something Went Wrong");
     };
}
  forEachPo: boolean = false;
  eachPoIndex: any;
  expanded_id: any;
  selectByEachPo(index, data, po_id, p, e) {
    this.expanded_id = index;

    console.log(p);
    console.log(this.expanded_id);
    this.row2[0] = "";
    this.selected_item = "";
    if (e.target.checked == false) {
      $("#rootCheckbox").prop("checked", false);
      if ($("#checkbox-all" + p).hasClass("checkedYellow")) {
        $("#checkbox-all" + p).removeClass("checkedYellow");
      }
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
    } else if (e.target.checked == true) {
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
  mergeAddressesAction() {
    if (this.milestoneForm.controls["sameAddress"].value) {
      this.milestoneForm.controls["billing_address"].patchValue(
        this.milestoneForm.controls["shipping_address"].value
      );
      this.milestoneForm.controls["billing_contact_person"].patchValue(
        this.milestoneForm.controls["contact_person"].value
      );
      this.milestoneForm.controls["billing_contact_number"].patchValue(
        this.milestoneForm.controls["contact_number"].value
      );
    } else {
      this.selectAddressBilling = "Saved Billing Addresses";
      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    }
    $("#billingList").prop("selectedIndex", 0);
    /*when the user selects the same billing address as shipping address the drop down of the billing address
      will be set to default  */
  }

  approveAll() {
    this.LoaderService.display(true);
    this.CategoryService.ApproveSecondPhasemto(this.pi_ids_all).subscribe(
      (res) => {
        this.successMessageShow(res.message);
        this.LoaderService.display(false);
        this.status = "pending";
        setTimeout(
          function () {
            this.getItems("");
          }.bind(this),
          500
        );
        $("#ApproveModal").modal("hide");
        this.po_ids.length = 0;
        this.pi_ids_all_amount.length = 0;
        this.pi_ids_all.length = 0;
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).error);
        this.LoaderService.display(false);
      }
    );
  }

  rejectAll() {
    this.LoaderService.display(true);
    this.CategoryService.RejectSecondPhasemto(this.pi_ids_all).subscribe(
      (res) => {
        this.successMessageShow(res.message);
        this.LoaderService.display(false);
        this.status = "pending";
        setTimeout(
          function () {
            this.getItems("");
          }.bind(this),
          500
        );
        $("#RejectModal").modal("hide");
        this.po_ids.length = 0;
        this.pi_ids_all_amount.length = 0;
        this.pi_ids_all.length = 0;
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).error);
        this.LoaderService.display(false);
      }
    );
  }

  approveModalButton() {
    if (this.pi_ids_all.length === 0) {
      this.errorMessageShow("Please Select Payment Items");
      $("#ApproveModal").modal("hide");
    } else {
      $("#ApproveModal").modal("show");
      this.setApproveAmount();
    }
  }

  rejectModalButton() {
    if (this.pi_ids_all.length === 0) {
      this.errorMessageShow("Please Select Payment Items");
      $("#RejectModal").modal("hide");
    } else {
      $("#RejectModal").modal("show");
      this.setApproveAmount();
    }
  }

  setApproveAmount() {
    this.totalAmount = 0;
    for (var i = 0; i < this.mto_Data.length; i++) {
      for (
        var j = 0;
        j < this.mto_Data[i].bulk_payment_pending_data.length;
        j++
      ) {
        this.pi_ids_all.map((id) => {
          if (id === this.mto_Data[i].bulk_payment_pending_data[j].payment_id) {
            this.totalAmount =
              this.totalAmount +
              parseFloat(
                this.mto_Data[i].bulk_payment_pending_data[j].approved_amount
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
    for (var i = 0; i < this.mto_Data.length; i++) {
      for (
        var j = 0;
        j < this.mto_Data[i].bulk_payment_pending_data.length;
        j++
      ) {
        this.pi_ids_all.map((id) => {
          if (id === this.mto_Data[i].bulk_payment_pending_data[j].payment_id) {
            this.view_request_data.push(
              this.mto_Data[i].bulk_payment_pending_data[j]
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

  pending_count: any;
  check_variable: any;
  pending_arr: any = [];
  count_data_red: number = 0;
  count_data: number = 0;
  count_ids: any = [];
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
  roundoff(data) {
    let ab = Math.floor(data);
    return ab;
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

  addSliForm(Data) {
    for (var i = 0; i < Data.custom_slis.length; i++) {
      Data.custom_slis[i].sli_category = parseInt(
        Data.custom_slis[i].sli_category
      );
    }
    this.LoaderService.display(true);
    this.CategoryService.ADDSliCustomMTO(Data).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.add_Sli.reset();
        (<FormArray>this.add_Sli.controls["custom_slis"]).controls = [];
        this.pushAttributes(this.add_Sli);
        this.getAttributes(this.add_Sli);
        this.successMessageShow(res.message);
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }
  addSliForm2(e) {
    let obj = {
      custom_slis: [
        {
          description: this.add_Sli2.controls["description"].value,
          name: this.add_Sli2.controls["name"].value,
          quantity: this.add_Sli2.controls["quantity"].value,
          rate: this.add_Sli2.controls["rate"].value,
          sli_category: this.add_Sli2.controls["sli_category"].value,
          tax: this.add_Sli2.controls["tax"].value,
          tax_type: this.add_Sli2.controls["tax_type"].value,
          unit: this.add_Sli2.controls["unit"].value,
          vendor_id: this.add_Sli2.controls["vendor_id"].value,
          sli_type: "mto",
        },
      ],
      vendor_product_id: this.vendorProductId,
    };
    this.LoaderService.display(true);
    this.CategoryService.ADDSliCustomMTO(obj).subscribe(
      (res) => {
        console.log(res);
        this.LoaderService.display(false);
        this.masterLinesearch = false;
        this.successMessageShow(res.message);
        this.add_Sli2.reset();
      },
      (err) => {
        this.LoaderService.display(true);
      }
    );
  }

  vendor_id = "";
  vendor_code: any = "";
  getvendorid(e: any) {
    this.vendor_id = e;
  }
  result_found: any = "";
  list_sli: any = "";
  show_sli_master_newone: boolean = false;

  searchvendorcode(page) {
    this.LoaderService.display(true);
    this.CategoryService.serachByVendor(
      this.vendor_id,
      this.vendor_code,
      page
    ).subscribe((res) => {
      this.headers_res = res.headers._headers;
      this.per_page = this.headers_res.get("x-per-page");
      this.total_page = this.headers_res.get("x-total");
      this.current_page = this.headers_res.get("x-page");
      res = res.json();
      this.result_found = res.search_status;
      if (this.result_found === "found") {
        this.list_sli = res.vendor_products;
        this.show_sli_master_newone = false;
      }
      if (this.result_found === "not_found") {
        this.errorMessageShow("No SLI Found. Please Create a new one");
        this.show_sli_master_newone = true;
      }
      this.LoaderService.display(false);
    });
  }

  show_sli_master: boolean = false;
  show_sli_master_edit: boolean = false;
  addmasterslinew() {
    this.masterLinesearch = false;
    this.masterLine = true;
    this.show_sli_master_edit = false;
  }
  masterLinesearch: boolean = false;
  masterLine: boolean = false;
  vendorProductId: any;
  add_sli_master(e) {
    this.masterLinesearch = true;
    this.show_sli_master_edit = false;
    this.masterLine = false;
    this.add_Sli2.controls["name"].setValue(e.sli_name);
    this.add_Sli2.controls["sli_category"].setValue(e.sli_category);
    this.add_Sli2.controls["unit"].setValue(e.unit);
    this.add_Sli2.controls["rate"].setValue(e.rate);
    this.add_Sli2.controls["vendor_id"].setValue(e.vendor_id);
    this.add_Sli2.controls["description"].setValue(e.description);
    this.vendorProductId = e.id;
  }
  addSublineItemmasternew() {
    this.LoaderService.display(true);
    this.CategoryService.ADDSlismasterMTO(
      this.newaddcustomSLIForm.value,
      "mto"
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow(res.message);
        this.newaddcustomSLIForm.reset();
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.LoaderService.display(false);
      }
    );
  }

  edit_sli_master(item) {
    this.editcustomSLIForm.controls["name"].setValue(item.sli_name);
    this.editcustomSLIForm.controls["rate"].setValue(item.rate);
    this.editcustomSLIForm.controls["unit"].setValue(item.unit);
    this.editcustomSLIForm.controls["sli_category"].setValue(item.sli_category);
    this.editcustomSLIForm.controls["vendor_id"].setValue(item.vendor_id);
    this.editcustomSLIForm.controls["vendor_product_id"].setValue(item.id);
    this.editcustomSLIForm.controls["sli_vendor_code"].setValue(
      item.vendor_code
    );
    this.editcustomSLIForm.controls["sli_description"].setValue(
      item.description
    );
    this.show_sli_master_edit = true;
    this.masterLinesearch = false;
    this.masterLine = false;
  }
  editSublineItemmaster() {
    this.LoaderService.display(true);
    var obj1 = {
      // sub_line_items: [
      name: this.editcustomSLIForm.controls["name"].value,
      rate: this.editcustomSLIForm.controls["rate"].value,
      sli_category: this.editcustomSLIForm.controls["sli_category"].value,
      unit: this.editcustomSLIForm.controls["unit"].value,
      vendor_id: this.editcustomSLIForm.controls["vendor_id"].value,
      vendor_product_id:
        this.editcustomSLIForm.controls["vendor_product_id"].value,
      description: this.editcustomSLIForm.controls["sli_description"].value,
    };

    // var object = $.extend(obj1);
    this.CategoryService.EDITSlis(obj1).subscribe(
      (res) => {
        this.successMessageShow("SLI UpDated Successfully");
        this.LoaderService.display(false);
        this.searchvendorcode(1);
        this.show_sli_master_edit = false;
        this.masterLinesearch = false;
        this.masterLine = false;
      },
      (err) => {
        this.LoaderService.display(false);
      }
    );
  }
  getlistItems() {
    this.getClassList();
    this.getLOBSList();
    this.getDepartmentList();
    this.getMaterialList();
    this.getSubClassList();
    this.getSubDepartmentsList();
  }
  LOBlist: any;
  DepartmentList: any;
  SubDepartmentList: any;
  classList: any;
  SubClassList: any;
  MaterialList: any;
  LOBDefault: any;
  departDefault: any;
  subdepartDefault;
  classDefault;
  subclassDefault;
  matcodeDefault;
  headers_res2;
  per_page2 = 10;
  total_page2;
  current_page2;
  ListOfProduct2: any = [];
  ChildSearch;
  ParentSearch;

  GetProductList2(e) {
    e = e ? e : "";
    this.LoaderService.display(true);
    this.LeadService.ListOfPRoduct2(
      e,
      this.ChildSearch,
      this.LOBDefault,
      this.departDefault,
      this.subdepartDefault,
      this.classDefault,
      this.subclassDefault,
      this.matcodeDefault,
      this.vendorFilterSel
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        console.log(this.current_page2);
        res = res.json();
        this.ListOfProduct2 = res.child_line_items;
      },
      (err) => {
        this.LoaderService.display(false);
        this.ListOfProduct2 = [];
      }
    );
  }
  setSelectBoxvalues() {
    this.LOBDefault = "";
    this.departDefault = "";
    this.subdepartDefault = "";
    this.classDefault = "";
    this.subclassDefault = "";
    this.matcodeDefault = "";
    this.DepartmentList = [];
    this.SubDepartmentList = [];
    this.classList = [];
    this.SubClassList = [];
    this.MaterialList = [];
  }
  dep_id;
  Sub_dep_id: any;
  getDepartmentListFilter(e) {
      
     this.dep_id ="" , this.Sub_dep_id="", this.class_id="", this.SubClass_Id="";
      this.departDefault ="",
        this.subdepartDefault ="",
        this.classDefault= "",
        this.subclassDefault="",
        this.matcodeDefault ="";


    this.LoaderService.display(true);
    this.dep_id = e;
    this.departDefault = "";
     this.subdepartDefault = "";
     this.classDefault = "";
     this.subclassDefault = "";
     this.matcodeDefault = "";
    this.LeadService.getAllDeapartmentsfilter(e).subscribe((res) => {
      this.LoaderService.display(false);
      this.DepartmentList = res.category_departments;
      this.SubDepartmentList = [];
      this.classList = [];
      this.SubClassList = [];
      this.MaterialList = [];
    });
    this.GetProductList2("");
  }
  getSubDepartmentsListFilter(e) {
    this.LoaderService.display(true);
    this.Sub_dep_id = e;
    this.subdepartDefault = "";
     this.classDefault = "";
     this.subclassDefault = "";
     this.matcodeDefault = "";
      this.subdepartDefault = "",
        this.classDefault = "",
        this.subclassDefault = "",
        this.matcodeDefault = "";
     this.class_id = "", this.SubClass_Id = "";

    this.LeadService.getAllSubDeapartmentsFilter(this.dep_id, e).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.SubDepartmentList = res.category_sub_departments;
        this.classList = [];
        this.SubClassList = [];
        this.MaterialList = [];
      }
    );
    this.GetProductList2("");
  }
  MaterialCodeFilter;
  getMaterialCodeFilter(e) {
    this.LoaderService.display(true);
    this.matcodeDefault = "";
    this.LeadService.getAllMaterialFilter(
      this.dep_id,
      this.Sub_dep_id,
      this.class_id,
      this.SubClass_Id,
      e
    ).subscribe((res) => {
      this.LoaderService.display(false);
      this.MaterialList = res.category_material_codes;
    });
    this.GetProductList2("");
  }
  class_id: any;
  getClassListFilter(e) {
    this.LoaderService.display(true);
    this.class_id = e;
    console.log(this.class_id);
    this.classDefault = "";
     this.subclassDefault = "";
     this.matcodeDefault = "";
     this.SubClass_Id = "";

    this.LeadService.getAllClassFilters(
      this.dep_id,
      this.Sub_dep_id,
      e
    ).subscribe((res) => {
      this.classList = res.category_classes;
       this.SubClassList = [];
       this.MaterialList = [];
      this.LoaderService.display(false);
    });
    this.GetProductList2("");
  }
  SubClass_Id;
  getSubClassListFilter(e) {
    this.LoaderService.display(true);
    this.SubClass_Id = e;
    this.subclassDefault = "";
    this.matcodeDefault = "";
    
    this.LeadService.getAllSubClassFilters(
      this.dep_id,
      this.Sub_dep_id,
      this.class_id,
      e
    ).subscribe((res) => {
      this.LoaderService.display(false);
      this.SubClassList = res.category_subclasses;
      this.MaterialList = [];
    });
    this.GetProductList2("");
  }
  getMaterialCodeFilterGet(e) {
    this.GetProductList2("");
  }
  getDepartmentList() {
    this.LeadService.getAllDeapartments().subscribe((res) => {
      this.DepartmentList = res.category_departments;
    });
  }
  getSubDepartmentsList() {
    this.LeadService.getAllSubDeapartments().subscribe((res) => {
      this.SubDepartmentList = res.category_sub_departments;
    });
  }
  getClassList() {
    this.LeadService.getAllClass().subscribe((res) => {
      this.classList = res.category_classes;
      console.log(this.classList);
    });
  }
  getSubClassList() {
    this.LeadService.getAllSubClass().subscribe((res) => {
      this.SubClassList = res.category_subclasses;
    });
  }
  getMaterialList() {
    this.LeadService.getAllmaterail().subscribe((res) => {
      this.MaterialList = res.category_material_codes;
    });
  }
  getLOBSList() {
    this.LeadService.getAllLOBS().subscribe((res) => {
      this.LOBlist = res.category_lobs;
    });
  }
  vendorFilterSel = "";
  selectType = "";
  FilterTypeVendororSearch = "parent_name";
  selectFiltertype(e) {
    this.FilterTypeVendororSearch = e;
    this.ParentSearch = "";
    this.ChildSearch = "";
    this.vendorFilterSel = "";
  }
  changeFunforSelect(e) {
    this.vendorFilterSel = e;
  
  }
  selectReviseList(e) {
    console.log(e);
  }
  VendorList2;
  getVendorList2() {
    this.LeadService.ListOfVendors().subscribe((res) => {
      console.log(res);
      this.VendorList2 = res.vendors;
    });
  }
  data_heir;
  arrayOFLength = ["", "", "", "", "", "", ""];
  SliChildId: any;
  FullHierData;

  openPanelModal(pro, id, pro2) {
    this.RateEnable = true;
    console.log(pro);
    this.AddSliForm.controls["quantity"].setValue("");
    if (pro2.vendor_name.cost == "_") {
      this.AddSliForm.controls["rate"].setValue("");
    } else {
      this.AddSliForm.controls["rate"].setValue(pro2.vendor_name.cost);
    }

    this.AddSliForm.controls["specs"].setValue("");
    this.AddSliForm.controls["tax_type"].setValue(null);
    this.AddSliForm.controls["tax_percent"].setValue(pro2.tax
      );
    $("#glassAnimals2").modal("show");
    this.showConfig = false;
    this.data_heir = pro;
    this.SliChildId = id;
    this.FullHierData = pro2;
    this.taxEnable =true;
    console.log(pro);
  }
  showConfig = false;
  handleConfig() {
    this.showConfig = !this.showConfig;
  }
  SelectedIdOfVendor: any;
  VendorOfId:any;
  ChildOfData:any;
  alternative(id, child) {
    this.ChildOfData = child
    this.VendorOfId = id;
    this.ProductVendorForm.controls['childsku'].setValue(child.sku);
      this.ProductVendorForm.controls['child_line_item_id'].setValue(child.id);
    $("#glassAnimals3").modal("show");
    this.ViewVendor2(id);
    if (child.vendor_prod_id) {
      this.SelectedIdOfVendor = child.vendor_prod_id;
    } else {
      if (child.vendor_name.lowest) {
        this.SelectedIdOfVendor = child.vendor_name.vendor_lowest_prod_id;
      } else {
        this.SelectedIdOfVendor = "";
      }
    }
    console.log(this.SelectedIdOfVendor);
  }
  vendorViewListforRevise = [];
  closeSliMo() {
    $("#glassAnimals2").modal("hide");
  }
  SliCreate() {
    this.AddSliForm.controls["cli_id"].setValue(this.SliChildId);
    this.LoaderService.display(true);
    this.LeadService.CreateSliFormain(this.AddSliForm.value).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("Sli added Successfully");
        this.closeSliMo();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  RateEnable = true;
  setRateEnable() {
    this.RateEnable = !this.RateEnable;
  }
  setTaxEnable() {

    this.taxEnable = !this.taxEnable
  }
  SearchFilterForchild() {
    this.GetProductList2("");
  }

  closemoVen() {
    $("#glassAnimals3").modal("hide");
  }
  ViewVendor2(id) {
    this.LoaderService.display(true);
    this.LeadService.getVendorsForchild(id).subscribe(
      (res) => {
        console.log(res);
        this.LoaderService.display(false);
        this.vendorViewListforRevise = res.vendor_products;
        this.SelectedIdOfVendor = res.vendor_prod_id;
        this.SelectedIdOfVendor = this.SelectedIdOfVendor?this.SelectedIdOfVendor:""
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  VendorSwitch() {
    this.LoaderService.display(true);
    this.LeadService.swicthVendor(this.SelectedIdOfVendor).subscribe(
      (res) => {
        console.log(res);
        this.LoaderService.display(false);
        this.successMessageShow("Vendor Alternated Successfully");
        this.closemoVen();
        this.GetProductList2(this.current_page2);
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  sli_options_list: any;
  selectedProduct: any;
  selectedSublineItem;
  sublineId;
  sli_options_id;
  project_type;

  getSLIOptions(subline) {
    this.sublineId = subline.id;
    this.LoaderService.display(true);
    this.sli_options_list = [];

    this.CategoryService.getViewOptionsForMasterSLIForBulkPO(
      this.sublineId
    ).subscribe(
      (res) => {
        let product;
        this.selectedSublineItem = subline;
        res.vendor_products.forEach((element) => {
          if (element.id === subline.attributes.vendor_product_id) {
            product = element;
          }
        });

        if (product) {
          if (product.id > -1) {
            this.selectedProduct = product;
            this.sli_options_list = res.vendor_products;
          }
        }

        this.sli_options_id = "";
        this.LoaderService.display(false);
      },
      (error) => {
        this.LoaderService.display(false);
      }
    );
  }

  changeViewOption(id) {
    this.sli_options_id = id;
    this.project_type = "mto";
    this.LoaderService.display(true);
    this.CategoryService.changeMasterSLIForClubbedInBulkPO(
      this.sublineId,
      this.sli_options_id,
      this.project_type
    ).subscribe(
      (res) => {
        (<any>$("#viewOptionsModal")).modal("hide");
        this.getSliList(this.sli_page);
        this.successMessageShow("Alternative updated successfully");
        this.LoaderService.display(false);
      },
      (err) => {
        (<any>$("#viewOptionsModal")).modal("hide");
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.LoaderService.display(false);
      }
    );
  }
  closeAltmod() {
    $("#viewOptionsModal").modal("hide");
  }

  getQuoteContainerquit2() {
    $("#getQuoteModalHeader2").modal("hide");
    $("#get-quote-container-header2").removeClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();
  }
  openVendorPanel() {
    $("#getQuoteModalHeader2").modal("show");
    $("#get-quote-container-header2").addClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();

    $(".get-quote-wrapper").animate({
      width: "toggle",
    });
    this.ProductVendorForm.reset();
    this.CreateVendorForm();
    this.ProductVendorForm.controls['childsku'].setValue(this.ChildOfData.sku);
    this.ProductVendorForm.controls['child_line_item_id'].setValue(this.ChildOfData.id);
  }
  CreateVendorForm(){
    this.ProductVendorForm = this.formBuilder.group({
      childsku: new FormControl(""),
      vendorName: new FormControl("", Validators.required),
      vendorCode: new FormControl("", Validators.required),
      ItemCost: new FormControl("", Validators.required),
      priority: new FormControl(false, Validators.required),
      child_line_item_id: new FormControl("", Validators.required),
    });
  }
  SubmitPROcodevendor(){
    this.LoaderService.display(true);
      this.LeadService.CreateVendorType(this.ProductVendorForm.value).subscribe(
        (res) => {
          console.log(res);
          this.LoaderService.display(false);
          this.getQuoteContainerquit2()
          if (res.message) {
            this.successMessageShow(res.message);
          } else {
            this.successMessageShow("Vendor product Created successfully");
          }

          this.ProductVendorForm.reset();
         this.CreateVendorForm();
         this.ProductVendorForm.controls['childsku'].setValue(this.ChildOfData.sku);
         this.ProductVendorForm.controls['child_line_item_id'].setValue(this.ChildOfData.id);

         this.ViewVendor2(this.VendorOfId);
         this.GetProductList2("");



  }, (err)=>{

    this.LoaderService.display(false);
    this.getQuoteContainerquit2()
    this.errorMessageShow(JSON.parse(err["_body"]).message);


  })
}
search_type = "vendor";
changeDateType2(e) {
  this.search_type = e;
}
transportaionCharges:any = 'no';

changeTransportation(e) {
  this.transportaionCharges = e;
  let tax_type = e;
  if (tax_type == "yes") {
    this.TransactionChargesForm.controls["transportation_tax"].setValidators(
      Validators.required
    );
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].setValidators(Validators.required);
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].setValidators(Validators.required);
    this.TransactionChargesForm.controls[
      "transportation_tax"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].updateValueAndValidity();
  } else {
    this.TransactionChargesForm.controls[
      "transportation_tax"
    ].clearValidators();
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].clearValidators();
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].clearValidators();
    this.TransactionChargesForm.controls["transportation_tax"].setValue("");
    this.TransactionChargesForm.controls["transportation_charges"].setValue(
      ""
    );
    this.TransactionChargesForm.controls["transportation_tax_type"].setValue(
      ""
    );

    this.TransactionChargesForm.controls[
      "transportation_tax"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].updateValueAndValidity();
  }
}
releasePO2(id) {
  $("#editPOModalTr").modal("show");
  this.purchaseorderId = id
  this.transportaionCharges  = 'no';
  this.changeTransportation(this.transportaionCharges)
}
purchaseorderId
resetTR() {
  $("#editPOModalTr").modal("hide");
  this.TransactionChargesForm.reset();
}
sendForApproval(data) {
  let obj = {
    transportation_status: this.transportaionCharges,
    transportation_tax: data.transportation_tax,
    transportation_charges: data.transportation_charges,
    transportation_tax_type: data.transportation_tax_type,
  };
  this.LoaderService.display(true);
  this.CategoryService.SendForApprovalmto(this.purchaseorderId, obj).subscribe(
    (res) => {
      this.LoaderService.display(false);
      this.resetTR();
     this.getItems(this.current_page);
      this.successMessageShow(res.message);
       
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err["_body"]).message);
    }
  );
}

reportClosure:any = false;
openClosureModal(id,po){
  this.reportClosure = false
  if((po.status =='pending' || po.status =='closed') && po.rm_receiving_date == null && this.role != 'finance' && this.role !='business_head'){
    this.reportClosure = true
    this.povalue = po;
    this.batch_number = po.batch_number[0]
    $("#expectedDatesActualModal").modal("show");
  }else{
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

createchilditem(id){
  this.LoaderService.display(true);
  this.LeadService.createchilditem(id).subscribe((res) =>{
    this.successMessageShow(res.message);
    $("#viewDynamicmapping2").modal("hide");
    // this.GetProductList('')

  },
  (err)=>{
    this.errorMessageShow(JSON.parse(err['_body']).message);
    $("#viewDynamicmapping2").modal("hide");
    // this.GetProductList('')
  }
  );

}


childforZoho:any;
  ZoHoData:any = [];
  SkuSaved:any
 

  AddMapModal(data,child){
    this.childforZoho = child;
    this.SkuSaved = data.sku
    if(data.mapped != null){

      this.getDataforZOHOmap(data.sku)

      $("#ViewZohoMapping").modal("show");

    }
  }

  getDataforZOHOmap(Param){
    this.ZohoorgChecker=[]

    this.LoaderService.display(true);

    this.LeadService.FetchZohomap(Param).subscribe(res=>{
      this.LoaderService.display(false);
       this.ZoHoData = res.data;
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err["_body"])[0]);
    })
  }

  ZohoorgChecker=[]

  manualmap(id){

  this.ZohoorgChecker.push(id);

  }
  zoho_ID:any
  mapclick(id){


    let Obj = {

      'zoho_organization_id' : id,
      'zoho_item_id' : $("#ZohoID"+id).val(),
      'sku'  : this.SkuSaved
    }

  this.LoaderService.display(true);

    this.LeadService.ManualZohomap(Obj).subscribe(res=>{
      this.LoaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.getDataforZOHOmap(this.SkuSaved);
      this.GetProductList2(this.current_page2);
      this.getSliList(this.sli_page);



    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

  }
  automaticmap(id){
    let Obj = {

      'zoho_organization_id' : id,
      'sku'  : this.SkuSaved
    }
    this.LeadService.AutoZohomap(Obj).subscribe(res=>{
      this.LoaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.getDataforZOHOmap(this.SkuSaved);
      this.GetProductList2(this.current_page2);
      this.getSliList(this.sli_page);



    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })




  }

  undo(id){

    let index = this.ZohoorgChecker.indexOf(id);

    this.ZohoorgChecker.splice(index,1)

  }
  manualmappo(id,i){

    this.zohoitemChecker.push(i);

    }

    mapclickPO(id,sku,i){


      let Obj = {

        'zoho_organization_id' : id,
        'zoho_item_id' : $("#ZohoID"+sku).val(),
        'sku'  : sku
      }

    this.LoaderService.display(true);

      this.LeadService.ManualZohomap(Obj).subscribe(res=>{
        this.LoaderService.display(false);

        this.successMessageShow("Mapped Successfully");
        this.ZoHoDataPo.data[i].zoho_item_id = res.zoho_item_id;
        this.GetProductList2(this.current_page2);
        this.getSliList(this.sli_page);


      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      })

    }

    automaticmapPO(id,sku,i){
      this.LoaderService.display(true);
      let Obj = {

        'zoho_organization_id' : id,
        'sku'  : sku
      }
      this.LeadService.AutoZohomap(Obj).subscribe(res=>{
        this.LoaderService.display(false);

        this.successMessageShow("Mapped Successfully");
        this.ZoHoDataPo.data[i].zoho_item_id = res.zoho_item_id;
        this.GetProductList2(this.current_page2);
        this.getSliList(this.sli_page);



      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      })




    }

    undoPO(id){

      let index = this.zohoitemChecker.indexOf(id);

      this.zohoitemChecker.splice(index,1)

    }
    CheckCOn(){
      let filter;
      if(this.ZoHoDataPo && this.ZoHoDataPo.data && this.ZoHoDataPo.data.length > 0){

        filter = this.ZoHoDataPo.data.filter(dat =>
          dat.zoho_item_id == null
        )

      }


      filter = filter?filter:[];

      if(filter && filter.length>0){
        return true
      } else{

          return false

      }

    }

    row5 = [""];
    expansion2;
    BatchId;
    ExpandBatch(ven) {
      if (this.row5[0] !== ven.batch_number) {
        this.expansion2 = ven.batch_number;
        this.row5[0] = ven.batch_number;
        this.BatchId = ven.id
        this.GetBatchDetais(this.BatchId)

      } else {
        this.row5[0] = "";
        this.expansion2 = "";
      }
    }

    BatchDetailslist:any;

   GetBatchDetais(id){
    this.LoaderService.display(true);
    this.LeadService.FetchBatchItems(id).subscribe(res=>{
      this.LoaderService.display(false);
     this.BatchDetailslist = res.line_items;
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })





   }
   BatDetails;
   Order_id =''
   MapOrderId(bat){
     if(!bat.hw_sheet_uploaded){
      this.BatDetails = bat;
      $("#ViewOrderIdMapping").modal("show");

     }
   
    
   }

   SubmitOrderId(){


    let Obj={
      id : this.BatDetails.id,
      order_id : this.Order_id
    }

    this.LeadService.listCreateOrderId(Obj).subscribe(res=>{
      this.LoaderService.display(false);
      this.GetBatchDetais(this.BatchId);
      this.getBatchData(this.current_page)
      this.successMessageShow('Mapped Sucessfully');
      $("#ViewOrderIdMapping").modal("hide");
      this.Order_id = ''
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

   }
   attachment_file2;
   
   file_arr:any = [];
   file_name2:any;
   file_t;
   loading = false;
   onChangeHw(event,file_type) {
     
     $('.parent-'+file_type).addClass('divActive');  
     var fileReader = new FileReader();
     var i = 0;
     this.file_name2 = event.target.files[i].name;
     this.attachment_file2 =event.target.files[0] || event.srcElement.files[0];
 
     
   } 
 
   SubmitHW(bat){
    $("#UploadModal").modal("show");
    this.file_name2 = ''
    this.attachment_file2 ='';
    this.BatDetails = bat

   }
   submitValFile(){

    let Obj={
      id : this.BatDetails.id,
      order_id : this.attachment_file2
    }
    this.loading = true
    this.LeadService.HWUpload(Obj).subscribe(res=>{
      this.LoaderService.display(false);
      this.GetBatchDetais(this.BatchId);
      this.getBatchData(this.current_page)
      this.successMessageShow('uploaded Sucessfully');
      $("#UploadModal").modal("hide");
      this.loading = false
      this.Order_id = ''
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.loading = false
    })

   }

     
dynamicdetails={
  item_name:'',
  sku:'',
  id:'',
  item_id:'',
  description:''

}
  item_id=''
AppdynamicMap(data,child){
  this.item_id=''
  this.dynamicdetails['item_name']=child.item_name
  this.dynamicdetails['sku']=child.sku
  this.dynamicdetails['id']=child.id

  if(data.mapped){
    this.fetchdynamicmap(child.id)
    $("#viewDynamicmapping").modal("show");
  }
  else{
    if(this.role !='category_services'){
      $("#viewDynamicmapping2").modal("show");
    }  
  }
}

fetchdynamicmap(id){
  this.LoaderService.display(true);
  this.LeadService.fetchdynamicmap(id).subscribe(res =>{
    this.LoaderService.display(false);
    this.dynamicdetails['item_id']=res.data.item_id
    this.dynamicdetails['description']=res.data.description
  },
  (err)=>{
    this.LoaderService.display(false);

  }
  )
}


mapitem(){
  this.LoaderService.display(true);
  this.LeadService.mapitem(this.dynamicdetails['id'],this.item_id).subscribe(
    (res) =>{
    if(res.message){
    $("#viewDynamicmapping2").modal("hide");
    this.successMessageShow(res.message);
    // this.GetProductList('')
    }
  },
  (err)=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
    $("#viewDynamicmapping2").modal("hide");
    // this.GetProductList('')

  })

}



AppdynamicMap2(data,child){
  this.item_id=''
  this.dynamicdetails['item_name']=data.item_name
  this.dynamicdetails['sku']=data.sku
  this.dynamicdetails['id']=data.cli_id
    if(data.mapped){
      this.fetchdynamicmap(data.cli_id)
      $("#viewDynamicmapping").modal("show");
    }
    else{
      if(this.role !='category_services'){
        $("#viewDynamicmapping2").modal("show");
      }  
    }

}
preventManualEntry(event: KeyboardEvent) {
  // Prevent any typing or manual entry in the input field
  event.preventDefault();
}


}

