import { Component, OnInit, Input } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators/finalize';


import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '../../../../../../node_modules/@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { LoaderService } from 'app/services/loader.service';
import { LeadService } from 'app/platform/lead/lead.service';
declare var $: any;
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-wip-orders-ofiice-maintainance",
  templateUrl: "./wip-orders-ofiice-maintainance.component.html",
  styleUrls: ["./wip-orders-ofiice-maintainance.component.css"],
  providers: [CategoryService, LeadService],
})
export class WipOrdersOfiiceMaintainanceComponent implements OnInit {
  update_Sli_Form: FormGroup;
  sublineItemForm: FormGroup;
  milestoneForm: FormGroup;
  add_Sli2: FormGroup;
  newaddcustomSLIForm: FormGroup;
  editcustomSLIForm: FormGroup;
  AddSliForm: FormGroup;
  ProductVendorForm :FormGroup;
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  @Input() line_item_po: any;
  project_id: any;
  line_item_in_po: any;
  todayDate: any;
  automated_sli: boolean = false;
  add_Sli: FormGroup;
  @Input() data: any;
  project_type;
  currentRoute;
  showTagSnagOption = false;
  searchItem: any = "";
  po_tag_list: any;
  update_Sli_Form2: FormGroup;
  search_type = "vendor";

  public todayDate2: any = new Date();
  role: any;
  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private LeadService: LeadService
  ) {}

  ngOnInit() {
    
    this.project_type = this.data;
    this.getWipTableData(1);
    setTimeout(() => {
      this.GetProductList2("");
      this.getLOBSList();
      this.getVendorList();
      this.getVendorList2();
      this.getUOMList();
      
    }, 3000);

    this.setSelectBoxvalues();
    this.CreatAddsliForm();
    this.CreateVendorForm();


    this.automated_sli = true;
    this.role = localStorage.getItem("user");
    this.line_item_in_po = this.line_item_po;
    this.update_Sli_Form = this.formBuilder.group({
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax: ["", Validators.required],
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
    this.add_Sli = this.formBuilder.group({
      custom_slis: this.formBuilder.array([this.buildItem()]),
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
      sli_type: [this.project_type, Validators.required],
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

    this.milestoneForm = this.formBuilder.group({
      shipping_address: new FormControl("", Validators.required),
      contact_person: new FormControl(""),
      shipping_address_record_id: new FormControl(""),
      vendor_gst: new FormControl("", Validators.required),
      lead_id: new FormControl("", Validators.required),
      po_tag: new FormControl("", Validators.required),
      type: new FormControl(this.project_type, Validators.required),
      contact_number: new FormControl("", [
        Validators.pattern(/^[6789]\d{9}$/),
      ]),
      billing_address: new FormControl("", Validators.required),
      billing_contact_person: new FormControl(""),
      billing_contact_number: new FormControl("", [
        Validators.pattern(/^[6789]\d{9}$/),
      ]),
      sameAddress: new FormControl(false),
      internal_consumption_po :  new FormControl(false, Validators.required),
      tag_snag: new FormControl("", Validators.required),
      expDdate: new FormControl("", Validators.required),
    });

    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    this.todayDate =
      (day < 10 ? "0" : "") +
      day +
      "/" +
      (month < 10 ? "0" : "") +
      month +
      "/" +
      d.getFullYear();
  }
  CreatAddsliForm() {
    this.AddSliForm = this.formBuilder.group({
      tax_percent:new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      specs: new FormControl(""),
      tax_type: new FormControl("", Validators.required),
      cli_id: new FormControl(""),
      sli_type: new FormControl("maintenance"),
    });
  }
  getProcurementList2() {
    this.automated_sli = true;
  }
  getProcurementList3() {
    this.automated_sli = false;
  }

  //for nested form
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
      sli_type: new FormControl("maintenance"),
    });
  }

  //For nested form
  pushAttributes(add_Sli) {
    return add_Sli.get("custom_slis").push(this.buildItem());
  }
  getAttributes(add_Sli) {
    return add_Sli.get("custom_slis").controls;
  }
  //submit add sli form for custom sli

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
  uom_list = [];
  ZoHoDataPo:any =[];

  getUOMList() {
    this.uom_list = [];
    this.categoryService.getUOMList().subscribe(
      (res) => {
        this.uom_list = res;
        console.log(res);
      },
      (error) => {}
    );
  }

  //To get table data
  wipData: any;
  wipData_data: any;
  page_number;
  per_page;
  total_page;
  current_page;
  page: any = 1;
  getWipTableData(page) {
    this.page_number = page;
    this.loaderService.display(true);
    this.categoryService
      .getWipTable(
        this.page_number,
        this.project_type,
        this.searchData,
        this.search_type
      )
      .subscribe(
        (res) => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");

          res = res.json();
          // this.wipData = res.vendor_wise_wip_slis;
          // this.wipData_data = res.vendor_wise_wip_slis.wip_slis;
          this.wipData = res.vendors;

          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
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
    this.sublineItemForm.controls["sli_type"].patchValue(this.project_type);
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

  getMasterLineItems(event) {
    this.mli_type = event;
    this.loaderService.display(true);
    this.categoryService.getMasterLineItems(this.mli_type).subscribe(
      (res) => {
        this.mli_list = res.master_line_items;
        this.loaderService.display(false);
        this.mli_id = "";
      },
      (error) => {
        this.loaderService.display(true);
      }
    );
  }

  vendor_products_list;
  sli_item_id;
  headers_res;
  getVendorProductsList(event, page?) {
    this.mli_id = event;
    for (let obj of this.mli_list) {
      // if(this.mli_id == obj.vendor_id){
      //    this.sublineItemForm.controls['rate'].patchValue(obj.vendor_id)
      // }
    }
    this.loaderService.display(true);
    this.categoryService.getVendorProductsList(this.mli_id, "", page).subscribe(
      (res) => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();
        this.sli_item_id = "";
        this.vendor_products_list = res.vendor_products;

        this.loaderService.display(false);
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }
  vendor_list;
  getVendorList() {
    this.categoryService.getAllVendors().subscribe(
      (res) => {
        this.vendor_list = res.vendors;
      },
      (err) => {}
    );
  }

  //to remove item
  removeSliItem(id) {
    this.loaderService.display(true);
    this.categoryService.removeSliItems(id).subscribe(
      (res) => {
        this.successalert = true;
        this.loaderService.display(false);
        this.successMessage = res.message;
        this.getWipTableData(this.page_number);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          3000
        );
      },
      (err) => {
        this.loaderService.display(false);
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
    this.AddSliForm.controls["sli_type"].setValue(this.project_type);
    this.RateEnable = true;
    this.taxEnable =true;

    console.log(this.Sli_id);
   
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
    this.loaderService.display(true);

    this.categoryService
      .updateSliItems(this.Sli_id, this.AddSliForm.value)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.loaderService.display(false);
          this.successMessage = res.message;
          $("#editSliModal").modal("hide");
          this.selectedItem = [];
          this.selectedItemToSubmit = [];
          this.getWipTableData(this.page_number);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            3000
          );
        },
        (err) => {
          this.loaderService.display(false);
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
  updateSlis2() {
    this.loaderService.display(true);
    this.categoryService
      .updateSliItemsmto(this.Sli_id, this.update_Sli_Form2.value)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.loaderService.display(false);
          this.successMessage = res.message;
          $("#editSliModal2").modal("hide");
          $("#cratePOModal").modal("show");
          this.getWipTableData(this.page_number);
          this.successMessageShow(res.message);
        },
        (err) => {
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
  }

  //for parent checkbox
  itemList;
  selectedItem = [];
  selectedItemToSubmit: any = [];
  parentCheckbox_id = -1;
  toggleAll(item, event, id) {
    if (event.target.checked) {
      if (this.parentCheckbox_id == -1 || this.parentCheckbox_id == id) {
        this.selectedItem = [];
        item.wip_slis.forEach((item_data) => {
          if (
            item_data.attributes.status == "pending" ||
            item_data.attributes.status == "modify_po" ||
            item_data.attributes.status == "cancelled"
          ) {
            item_data.checked = true;
            if (!this.selectedItem.includes(item_data.id)) {
              this.selectedItem.push(item_data.id);
              this.selectedItemToSubmit.push(item_data.attributes);
            }
          }
        });
        this.parentCheckbox_id = id;
        this.child_parent = id;
      } else {
        alert("you already select a vendor");
        $("#checkall" + id).prop("checked", false);
        item.checked = false;
      }
    } else {
      item.wip_slis.forEach((item) => {
        item.checked = false;
        this.selectedItem = [];
        this.selectedItemToSubmit = [];
      });
      this.parentCheckbox_id = -1;
      this.child_parent = -1;
    }
  }

  child_parent = -1;
  sliCat: any;
  //for child checkbox
  toggleItem(event, item_data, item, parent_id, child_id) {
    this.sliCat = item_data.attributes.sli_category;
    // item.checked = !item.checked;
    item_data.checked = event.target.checked;
    // this.toggle = this.itemList.every(item => item.checked);
    if (event.target.checked) {
      if (this.child_parent == -1 || this.child_parent == parent_id) {
        if (
          item_data.attributes.status == "pending" ||
          item_data.attributes.status == "modify_po" ||
          item_data.attributes.status == "cancelled"
        ) {
          item.checked = true;
          //
          if (!this.selectedItem.includes(item_data.id)) {
            this.selectedItem.push(item_data.id);
            this.selectedItemToSubmit.push(item_data.attributes);
          }
        }
        this.child_parent = parent_id;
        this.parentCheckbox_id = parent_id;
      } else {
        alert("you already select a vendor sli");
        $("#check" + child_id).prop("checked", false);
        $("#checkall" + parent_id).prop("checked", false);
      }
    } else {
      this.selectedItem.forEach((element, index) => {
        if (item_data.id == element) {
          this.selectedItem.splice(index, 1);
          this.selectedItemToSubmit.splice(index, 1);
          if (this.selectedItem.length == 0) {
            item.checked = false;
          }
        }
      });
      if (this.selectedItem.length <= 0) {
        item.checked = false;
      }
      this.child_parent = -1;
      this.parentCheckbox_id = -1;
    }
  }

  //to get address
  address_list = [];
  address_list_billing = [];
  getAddress() {
    this.categoryService.getshippingAddressForPO().subscribe((res) => {
      this.address_list = res.po_addresses;
    });

    //}
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
        address: `Singularity Furniture Private Limited,1st Floor, Unit No. F-04 & F-05, Trillium Avenue, Sector-29, Gurugram, Gurugram, Haryana 122009, GST Number: 06AAECP3450G1ZN`,
      }
    ];

    this.loaderService.display(false);
    //   },
    //   err => {
    //
    //     this.loaderService.display(false);
    //   }
    // );
  }

  //create WIP PO
  vendorName: any;
  vendorAddress: any;
  vendorContact: any;
  vendorEmail: any;
  vendorGst: any;
  vendorPan: any;
  gst_list = [];
  vendorId;
  CreateModal(name, address, contact, email, gst, pan, vendor_id) {
    this.milestoneForm.controls["po_tag"].setValue("");
    if (this.selectedItem.length > 0) {
      $("#CreatePOModal").modal("show");
      this.currentRoute = this.router.url;
      //
      if (
        this.currentRoute == "/category/project-po" ||
        this.currentRoute == "/category/office-po"
      ) {
        this.showTagSnagOption = true;
      }

      if (!this.showTagSnagOption) {
        this.milestoneForm.controls["tag_snag"].patchValue("false");
      }
      this.vendorName = name;
      this.vendorAddress = address;
      this.vendorContact = contact;
      this.vendorEmail = email;
      this.vendorGst = gst;
      this.vendorPan = pan;
      this.getVendorDetails(vendor_id);
      this.milestoneForm.controls["type"].patchValue(this.project_type);
      this.getAddress();
      this.checkFormValidity();
      this.getPoTagList();
      this.lead_not_found = false;
      this.enter_submit = false;
      this.lead_details = null;
    } else {
      alert("Please Select Atleast One Line Item");
    }
    this.milestoneForm.controls["internal_consumption_po"].setValue(
      false )
  }
  getPoTagList() {
    this.categoryService.getPoTagList().subscribe(
      (res) => {
        this.po_tag_list = res["po_tags"];
      },
      (err) => {}
    );
  }
  // To check the validity for requird form
  checkFormValidity() {
    if (this.project_type != "maintenance") {
      this.milestoneForm.controls["lead_id"].setValidators([
        Validators.required,
      ]);
      this.milestoneForm.controls["lead_id"].updateValueAndValidity();
    } else {
      this.milestoneForm.controls["lead_id"].clearValidators();
      this.milestoneForm.controls["lead_id"].updateValueAndValidity();
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

  showBillingAddress() {
    //toggles the billingAddress forms in the dom
    this.showBillAddress = !this.showBillAddress;
  }

  showShipAddress: boolean;
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

  showShippingAddress() {
    this.showShipAddress = !this.showShipAddress;
  }

  //to relase po
  poSubmission() {
    console.log(this.selectedItemToSubmit);
    $("#CreatePOModal").modal("hide");
    $(".InvoiceModal").modal("show");
    this.getTotalAmount();
  }

  //to reset forms
  resetForm() {
    this.milestoneForm.reset();
    this.update_Sli_Form.reset();
    this.sublineItemForm.reset();
    this.current_expected_delivery_date = "";
  }
  sliVendor;
  submitForRelease() {
    this.loaderService.display(true);
    this.categoryService
      .poSubmit(this.milestoneForm.value, this.selectedItem, this.sliCat)
      .subscribe(
        (res) => {
          if(res.zoho_mapping_required){
            this.loaderService.display(false);
            $("#CreatePOModal").modal("hide");
            $("#ViewZohoMappingPo").modal("hide");
            $(".InvoiceModal").modal("hide");
            this.successMessageShow("pop Up open");
            this.getzohoData(this.selectedItem,this.milestoneForm.value.shipping_address_record_id)

          } 
          else{
          this.successalert = true;
          this.selectedItem = [];
          this.selectedItemToSubmit = [];
          $("#CreatePOModal").modal("hide");
          $(".InvoiceModal").modal("hide");
          $("#ViewZohoMappingPo").modal("hide");
          this.milestoneForm.reset();
          this.current_expected_delivery_date = "";
          this.loaderService.display(false);
          this.successMessage = "Successfully Created";
          this.getWipTableData(this.page_number);
          this.cancelSubmitPo();
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
        
        }
      },
        (err) => {
          this.loaderService.display(false);
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
  enter_submit: boolean = false;
  lead_not_found: boolean = false;
  lead_present: boolean = false;
  getLeadListForRelease() {
    this.getLeadList();
    this.enter_submit = true;
  }
  lead_details: any;
  leadId;
  lead_not_found_message;
  getLeadList() {
    this.leadId = $("#leadId").val();
    this.categoryService.getLeadListForPoRelease(this.leadId).subscribe(
      (res) => {
        this.lead_details = res.lead;
        this.lead_not_found = false;
        $("#CreatePOModal").modal("show");
        $(".InvoiceModal").modal("hide");
      },
      (err) => {
        this.lead_not_found = true;
        this.lead_not_found_message = JSON.parse(err._body)["message"];
      }
    );
    this.milestoneForm.controls["lead_id"].patchValue(this.leadId);
  }

  //to cancel Po
  cancelSubmitPo() {
    $(".InvoiceModal").modal("hide");
    this.getWipTableData(1);
    this.selectedItem = [];
    this.selectedItemToSubmit = [];
    this.child_parent = -1;
    this.parentCheckbox_id = -1;
  }
  sli_options_list: any;
  selectedProduct: any;
  selectedSublineItem;
  sublineId;
  getSLIOptions(subline) {
    this.sublineId = subline.id;
    this.loaderService.display(true);
    this.sli_options_list = [];

    this.categoryService
      .getViewOptionsForMasterSLIForBulkPO(this.sublineId)
      .subscribe(
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
          this.loaderService.display(false);
        },
        (error) => {
          this.loaderService.display(false);
        }
      );
  }
  job_elements_arr_alter: any = [];
  sli_options_id;
  changeViewOption(id) {
    this.sli_options_id = id;

    this.loaderService.display(true);
    this.categoryService
      .changeMasterSLIForClubbedInBulkPO(
        this.sublineId,
        this.sli_options_id,
        this.project_type
      )
      .subscribe(
        (res) => {
          this.successalert = true;
          this.successMessage = "Alternative updated successfully";
          (<any>$("#viewOptionsModal")).modal("hide");
          this.getWipTableData(1);
          // this.showLineItems(this.boq_id,this.selectedBOQIndex);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
          this.loaderService.display(false);
        },
        (err) => {
          (<any>$("#viewOptionsModal")).modal("hide");
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
          this.loaderService.display(false);
        }
      );
  }
  replaceString(input) {
    return input.replace(/_/g, " ").toUpperCase();
  }
  vendor_det;
  getVendorDetails(value) {
    this.categoryService.getVendorDetails(value).subscribe(
      (res) => {
        this.vendor_det = res["vendor"];
        this.gst_list = res.vendor["gst_no"];

        // this.loaderService.display(false);
      },
      (err) => {
        // this.loaderService.display(false);
      }
    );
  }
  resetAddSli() {
    this.add_Sli.get("custom_slis").reset();
    this.sublineItemForm.reset();
    this.show_sli_master_edit = false;
    this.masterLinesearch = false;
    this.masterLine = false;
    this.result_found = "not";
    this.vendor_code = "";
    this.getWipTableData(this.page_number);
    (<FormArray>this.add_Sli.controls["custom_slis"]).controls = [];
    this.pushAttributes(this.add_Sli);
    this.getAttributes(this.add_Sli);
  }
  amount_total = 0;
  getTotalAmount() {
    this.amount_total = 0;
    for (let obj of this.selectedItemToSubmit) {
      this.amount_total += obj.amount;
    }
  }
  searchData: any = "";
  searchForPo(val) {
    this.searchData = val;
    this.getWipTableData(this.page);
  }
  selected_vendor_product;
  product_id;
  getDetailsOfVendorProduct(product_id, product?) {
    this.product_id = product_id;
    this.loaderService.display(true);
    this.categoryService.getDetailsOfVendorProduct(this.product_id).subscribe(
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
        this.loaderService.display(false);
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }
  addSublineItem() {
    console.log(this.sublineItemForm.value);
  }
  addSliForm(Data) {
    for (var i = 0; i < Data.custom_slis.length; i++) {
      Data.custom_slis[i].sli_category = parseInt(
        Data.custom_slis[i].sli_category
      );
    }
    this.loaderService.display(true);
    this.categoryService.ADDSliCustomMTO(Data).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.add_Sli.reset();
        (<FormArray>this.add_Sli.controls["custom_slis"]).controls = [];
        this.pushAttributes(this.add_Sli);
        this.getAttributes(this.add_Sli);
        this.successMessageShow(res.message);
      },
      (err) => {
        this.loaderService.display(false);
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
          sli_type: "maintenance",
        },
      ],
      vendor_product_id: this.vendorProductId,
    };
    this.loaderService.display(true);
    this.categoryService.ADDSliCustomMTO(obj).subscribe(
      (res) => {
        console.log(res);
        this.loaderService.display(false);
        this.masterLinesearch = false;
        this.successMessageShow(res.message);
        this.add_Sli2.reset();
      },
      (err) => {
        this.loaderService.display(true);
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
    if (this.vendor_id == undefined) {
      this.vendor_id = "";
    }
    this.loaderService.display(true);
    this.categoryService
      .serachByVendor(this.vendor_id, this.vendor_code, page)
      .subscribe((res) => {
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
        this.loaderService.display(false);
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
  window = window;
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
    this.loaderService.display(true);
    this.categoryService
      .ADDSlismasterMTO(this.newaddcustomSLIForm.value, "maintenance")
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.successMessageShow(res.message);
          this.newaddcustomSLIForm.reset();
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
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
    this.loaderService.display(true);
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
    this.categoryService.EDITSlis(obj1).subscribe(
      (res) => {
        this.successMessageShow("SLI UpDated Successfully");
        this.loaderService.display(false);
        this.searchvendorcode(1);
        this.show_sli_master_edit = false;
        this.masterLinesearch = false;
        this.masterLine = false;
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  // Sli adding new

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
    this.loaderService.display(true);
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
        this.loaderService.display(false);
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        console.log(this.current_page2);
        res = res.json();
        this.ListOfProduct2 = res.child_line_items;
      },
      (err) => {
        this.loaderService.display(false);
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
    (this.dep_id = ""),
      (this.Sub_dep_id = ""),
      (this.class_id = ""),
      (this.SubClass_Id = "");
    (this.departDefault = ""),
      (this.subdepartDefault = ""),
      (this.classDefault = ""),
      (this.subclassDefault = ""),
      (this.matcodeDefault = "");

    this.loaderService.display(true);
    this.dep_id = e;
    this.departDefault = "";
    this.subdepartDefault = "";
    this.classDefault = "";
    this.subclassDefault = "";
    this.matcodeDefault = "";
    this.LeadService.getAllDeapartmentsfilter(e).subscribe((res) => {
      this.loaderService.display(false);
      this.DepartmentList = res.category_departments;
      this.SubDepartmentList = [];
      this.classList = [];
      this.SubClassList = [];
      this.MaterialList = [];
    });
    this.GetProductList2("");
  }
  getSubDepartmentsListFilter(e) {
    this.loaderService.display(true);
    this.Sub_dep_id = e;
    this.subdepartDefault = "";
    this.classDefault = "";
    this.subclassDefault = "";
    this.matcodeDefault = "";
    (this.subdepartDefault = ""),
      (this.classDefault = ""),
      (this.subclassDefault = ""),
      (this.matcodeDefault = "");
    (this.class_id = ""), (this.SubClass_Id = "");

    this.LeadService.getAllSubDeapartmentsFilter(this.dep_id, e).subscribe(
      (res) => {
        this.loaderService.display(false);
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
    this.loaderService.display(true);
    this.matcodeDefault = "";
    this.LeadService.getAllMaterialFilter(
      this.dep_id,
      this.Sub_dep_id,
      this.class_id,
      this.SubClass_Id,
      e
    ).subscribe((res) => {
      this.loaderService.display(false);
      this.MaterialList = res.category_material_codes;
    });
    this.GetProductList2("");
  }
  class_id: any;
  getClassListFilter(e) {
    this.loaderService.display(true);
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
      this.loaderService.display(false);
    });
    this.GetProductList2("");
  }
  SubClass_Id;
  getSubClassListFilter(e) {
    this.loaderService.display(true);
    this.SubClass_Id = e;
    this.subclassDefault = "";
    this.matcodeDefault = "";

    this.LeadService.getAllSubClassFilters(
      this.dep_id,
      this.Sub_dep_id,
      this.class_id,
      e
    ).subscribe((res) => {
      this.loaderService.display(false);
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
    this.VendorOfId = id;
    this.ChildOfData = child
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
    this.loaderService.display(true);
    console.log(this.project_id);
    this.LeadService.CreateSliFormain(this.AddSliForm.value).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successMessageShow("Sli added Successfully");
        this.closeSliMo();
      },
      (err) => {
        this.loaderService.display(false);
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
  current_expected_delivery_date;
  current_expected_delivery_date2;
  edited_date;
  event_date;
  handleInvoiceDateSelectEvent(eventDate) {
    this.milestoneForm.controls["expDdate"].setValue(
      this._trasformDateType(eventDate)
    );
  }

  private _trasformDateType(dateValue) {
    return moment(dateValue).format("DD/MM/yyyy");
  }
  changeDateType(e) {
    this.search_type = e;
  }
  closemoVen() {
    $("#glassAnimals3").modal("hide");
  }
  ViewVendor2(id) {
    this.loaderService.display(true);
    this.LeadService.getVendorsForchild(id).subscribe(
      (res) => {
        console.log(res);
        this.loaderService.display(false);
        this.vendorViewListforRevise = res.vendor_products;
        this.SelectedIdOfVendor = res.vendor_prod_id;
        this.SelectedIdOfVendor = this.SelectedIdOfVendor?this.SelectedIdOfVendor:""
      },
      (err) => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  VendorSwitch() {
    this.loaderService.display(true);
    this.LeadService.swicthVendor(this.SelectedIdOfVendor).subscribe(
      (res) => {
        console.log(res);
        this.loaderService.display(false);
        this.successMessageShow("Vendor Alternated Successfully");
        this.closemoVen();
        this.GetProductList2(this.current_page2);
      },
      (err) => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
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
    this.loaderService.display(true);
      this.LeadService.CreateVendorType(this.ProductVendorForm.value).subscribe(
        (res) => {
          console.log(res);
          this.loaderService.display(false);
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

    this.loaderService.display(false);
    this.getQuoteContainerquit2()
    this.errorMessageShow(JSON.parse(err["_body"]).message);


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
  this.loaderService.display(true);
  this.LeadService.fetchdynamicmap(id).subscribe((res) =>{
    this.loaderService.display(false);
    this.dynamicdetails['item_id']=res.data.item_id
    this.dynamicdetails['description']=res.data.description
  },
  (err)=>{
    this.loaderService.display(false);
  })
}

mapitem(){
  this.loaderService.display(true);
  this.LeadService.mapitem(this.dynamicdetails['id'],this.item_id).subscribe(
    (res) =>{
    if(res.message){
    $("#viewDynamicmapping2").modal("hide");
    this.successMessageShow(res.message);
    }
  },
  (err)=>{
    this.loaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
    $("#viewDynamicmapping2").modal("hide");
  })

}

AppdynamicMap2(data,child){
  this.item_id=''
  this.dynamicdetails['item_name']=data.item_name
  this.dynamicdetails['sku']=data.sku
  this.dynamicdetails['id']=data.cli_id
    this.fetchdynamicmap(data.cli_id)
    if(data.mapped){
      $("#viewDynamicmapping").modal("show");
    }
    else{
      if(this.role !='category_services'){
        $("#viewDynamicmapping2").modal("show");
      }  
    }
}


createchilditem(id){
  this.loaderService.display(true);
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

    this.loaderService.display(true);

    this.LeadService.FetchZohomap(Param).subscribe(res=>{
      this.loaderService.display(false);
       this.ZoHoData = res.data;
    },
    (err) => {
      this.loaderService.display(false);
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

  this.loaderService.display(true);

    this.LeadService.ManualZohomap(Obj).subscribe(res=>{
      this.loaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.getDataforZOHOmap(this.SkuSaved);
      this.GetProductList2(this.current_page2);
      this.getWipTableData(this.page);



    },
    (err) => {
      this.loaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

  }
  automaticmap(id){
    let Obj = {

      'zoho_organization_id' : id,
      'sku'  : this.SkuSaved
    }
    this.LeadService.AutoZohomap(Obj).subscribe(res=>{
      this.loaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.getDataforZOHOmap(this.SkuSaved);
      this.GetProductList2(this.current_page2);
      this.getWipTableData(this.page);



    },
    (err) => {
      this.loaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })




  }


  undo(id){

    let index = this.ZohoorgChecker.indexOf(id);

    this.ZohoorgChecker.splice(index,1)

  }
  zohoitemChecker =[];
  getzohoData(e_id,shipping_id){
    this.zohoitemChecker = [];
    this.loaderService.display(true);

    let obj ={
      
      wip_sli_ids :e_id,
      shipping_address_record_id:shipping_id
    }
    this.categoryService.ZohoPoGETMain(obj).subscribe(res=>{
      this.loaderService.display(false);
      this.ZoHoDataPo = res;
      $("#ViewZohoMappingPo").modal("show");

    },
    err=>{

      this.errorMessageShow(JSON.parse(err["_body"]).message);
      this.loaderService.display(false);

    })
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
  
    this.loaderService.display(true);
  
      this.LeadService.ManualZohomap(Obj).subscribe(res=>{
        this.loaderService.display(false);
  
        this.successMessageShow("Mapped Successfully");
        this.ZoHoDataPo.data[i].zoho_item_id = res.zoho_item_id;
        this.GetProductList2(this.current_page2);
        this.getWipTableData(this.page);
       
         
      },
      (err) => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      })
  
    }

    automaticmapPO(id,sku,i){
      this.loaderService.display(true);
      let Obj = {
  
        'zoho_organization_id' : id,
        'sku'  : sku
      }
      this.LeadService.AutoZohomap(Obj).subscribe(res=>{
        this.loaderService.display(false);
  
        this.successMessageShow("Mapped Successfully");
        this.ZoHoDataPo.data[i].zoho_item_id = res.zoho_item_id;
        this.GetProductList2(this.current_page2);
        this.getWipTableData(this.page);
  
  
  
      },
      (err) => {
        this.loaderService.display(false);
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


}