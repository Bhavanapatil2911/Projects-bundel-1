import { Component, OnInit, ViewChild, Input,ChangeDetectorRef } from "@angular/core";
import { CategoryService } from "../category.service";
import { LoaderService } from "../../../../services/loader.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { VendorSelectionComponent } from "../vendor-selection/vendor-selection.component";
import { PoReleaseComponent } from "../po-release/po-release.component";
import { PiUploadComponent } from "../pi-upload/pi-upload.component";
import { PaymentsReleaseComponent } from "../payments-release/payments-release.component";
import { LeadService } from "app/platform/lead/lead.service";
declare var $: any;

@Component({
  selector: "app-sli-creation",
  templateUrl: "./sli-creation.component.html",
  styleUrls: ["./sli-creation.component.css"],
  providers: [CategoryService, LeadService],
})
export class SliCreationComponent implements OnInit {
  objectKeys = Object.keys;
  @Input() line_item: any;
  linet_item_sli: any = [];
  display = false;
  sli_options_id;
  vendorSelectionCount;
  poReleaseCount;
  piUploadCount;
  boq_list;
  boqs_list;
  selectedBOQIndex = 0;
  selectedLineItemIndex = 0;
  selectedSublineItem;
  selectedSublineItemIndex = -1;
  selectedPreProductionTab = "sli_creation";
  selectedBOQ = {};
  selectedLineItem = {};
  headers_res;
  headers_res1;
  per_page;
  total_page;
  // current_page;
  line_items_list;
  role: string;
  boq_labels;
  arrow: boolean = true;
  sublineItemForm: FormGroup;
  otherItemForm: FormGroup;
  addcustomSLIForm: FormGroup;
  editcustomSLIForm: FormGroup;
  newaddcustomSLIForm: FormGroup;
  ProductVendorForm:FormGroup;
  AddSliForm: FormGroup;
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  other_item_id: -1;
  other_item_list: any;
  selected_other_item: any;
  procurement_method: any;
  line_items_type_list = [];
  project_id;
  boq_id;
  toggle_line_rows: boolean;
  error_list = [];
  sub_line_li = ["fg", "gh", "ghg", "ghghg"];
  show_line_type: any;
  subline_items_list = [];
  selectedSec = "sli-create";
  update_Sli_Form: FormGroup;
  update_Club_Sli_Form: FormGroup;
  // addClubbed_Slis:FormGroup;
  add_Sli: FormGroup;
  add_Sli_clubbed: FormGroup;
  clubbedUpdate: FormGroup;
  updateUOM: FormGroup;
  selected_view_option: any;
  automated_sli: boolean = false;
  LineItem;
  LineItemType;
  data_value;

  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private LeadService: LeadService
  ) {}

  ngOnInit() {
      this.role = localStorage.getItem("user");
    this.linet_item_sli = this.line_item;
    this.showLineItems();
    this.slectBtn("sli-create");
    this.automated_sli = false;
    this.setSelectBoxvalues();
    this.GetProductList2("");
    this.getLOBSList();
    this.getVendorList();
    this.getVendorList2();
    this.CreatAddsliForm();
    this.CreateVendorForm();

    this.update_Sli_Form = this.formBuilder.group({
      name: ["", Validators.required],
      sli_category: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      unit: ["", Validators.required],
      tax_percent: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_name: [""],
      vendor_product_id: [""],
    });

    this.update_Club_Sli_Form = this.formBuilder.group({
      name: ["", Validators.required],
      sli_category: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      unit: ["", Validators.required],
      tax_percent: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_name: [""],
      vendor_product_id: [""],
    });

    this.sublineItemForm = this.formBuilder.group({
      name: ["", Validators.required],
      unit: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax_percent: ["", Validators.required],
      sli_category: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_product_id: ["", Validators.required],
    });

    this.addcustomSLIForm = this.formBuilder.group({
      name: ["", Validators.required],
      unit: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax_percent: ["", Validators.required],
      sli_category: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_product_id: ["", Validators.required],
      sli_vendor_code: ["", Validators.required],
      sli_description: [""],
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

    this.updateUOM = this.formBuilder.group({
      currentUnit: ["", Validators.required],
      unit: ["", Validators.required],
      original: ["", Validators.required],
      updated: ["", Validators.required],
    });

    this.add_Sli = this.formBuilder.group({
      sub_line_items: this.formBuilder.array([this.buildItem()]),
    });
    this.add_Sli_clubbed = this.formBuilder.group({
      label: new FormControl("", Validators.required),
      sub_line_items: this.formBuilder.array([this.buildItem()]),
    });

    this.clubbedUpdate = this.formBuilder.group({
      clubbed: new FormArray([]),
    });

    this.clubbedFormGroup = this.clubbedUpdate.controls["clubbed"]["controls"];
  }

  SnagtypePanel:boolean=false
  SnagtypeMTO:boolean=false
  shouldShowPanel(obj: string): boolean {
    console.log(this.line_items_list[obj])
    return this.line_items_list[obj].some(item => {
      if((item.scope_of_work === 'kitchen' || item.scope_of_work === 'panel')){
        this.SnagtypePanel=true
        return true
      }

      });
  }

  shouldShowMTO(obj: string): boolean {
    return this.line_items_list[obj].some(item => {
      if(item.scope_of_work === 'mto'){
        this.SnagtypeMTO=true
        return true
      }
    });
  }
  slectBtn(value) {
    this.selectedSec = value;
    if (this.selectedSec == "sli-create") {
      this.showLineItems();
    }
    this.loaderService.display(true);
  }
  CreatAddsliForm() {
    this.AddSliForm = this.formBuilder.group({
      tax_percent:new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      specs: new FormControl(""),
      tax_type: new FormControl("", Validators.required),
      cli_id: new FormControl(""),
      snag_id: new FormControl(""),
      ownerable_type: new FormControl(""),
      ownerable_id: new FormControl(""),
    });
  }
  line_item_Arr = [];
  extra_val: string;
  clubbed_arr;
  sublines;
  permit_permission: boolean = false;
  selectedBOQType:any
  showLineItems() {
    this.line_items_type_list = [];
    this.loaderService.display(true);
    this.categoryService
      .getLineItemsListForSli(
        this.linet_item_sli.id,
        this.linet_item_sli.project_id
      )
      .subscribe(
        (res) => {
          this.getUOMList();
          this.getCategorylist();
          this.selectedBOQ = res.quotation;
          this.selectedBOQType = res.quotation.boq_type;
          this.project_id = res.quotation.project_id;
          this.permit_permission = res.quotation.po_creation_permitted;
          this.boq_id = res.quotation.id;
          this.line_items_list = res.quotation.line_items;
          var jsonObj = res.quotation.line_items;
          this.line_item_Arr = Object.keys(jsonObj);

        
          this.other_item_list = res.quotation.extra_items;
          this.extra_val = "Extra Items";

          this.selectedLineItemIndex = 0;
          this.selectedLineItem = {};
          if (this.line_items_list.clubbed_jobs.length > 0) {
            this.clubbed_arr = this.line_items_list.clubbed_jobs;
          }
          this.loaderService.display(false);
          let flag = 0;
          if (this.line_items_list.length > 0) {
            this.line_items_list.forEach((line) => {
              line.selected = false;
              if (line.subline_items.length == 0) {
                flag = 1;
              }
              if (this.line_items_type_list.indexOf(line.type) === -1) {
                this.line_items_type_list.push(line.type);
              }
            });
            if (flag) {
              this.erroralert = true;
              this.errorMessage = "SLI not added for all the line items.";
              setTimeout(
                function () {
                  this.erroralert = false;
                }.bind(this),
                2000
              );
            }
          }
        },
        (err) => {
          if (err._body.message === "No Line items Found.") {
            this.selectedBOQIndex = -1;
            this.selectedLineItemIndex = -1;
            this.selectedSublineItemIndex = -1;
            this.selectedBOQ = {};
            this.selectedLineItem = {};
            this.selectedSublineItem = {};
          }
          this.loaderService.display(false);
        }
      );
  }
  deleteOneSli(sliId) {
    this.loaderService.display(true);

    this.categoryService
      .deleteOneSli(this.project_id, this.boq_id, sliId)
      .subscribe(
        (res) => {
          this.showLineItems();
          this.successMessageShow("Sli Deleted Successfully !!");
          this.loaderService.display(false);
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
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
  // snagId :any
  // snag data rm 

  snagType : any
  mistakeHead :any


  snagProductType :any
  rmwidth :any
  rmheight :any
  rmdepth :any
  rmquantity :any
  commonItemrequired :any
  snagId :any


  // snag Data hardware

  hardware_brand : any
  hardware_item_code :any
  DisplaysnagData : any 
  rmFinish :any
  rmFrontFinish :any
  rmMaterialThickness :any
  rmProblemStatement :any
  rmBackFinish :any
  rmEdgeBand :any
  mistakeHeadEmails : any


  snagData(index){
    this.loaderService.display(true);
    this.categoryService.getLineItemsListForSli(this.linet_item_sli.id,
      this.linet_item_sli.project_id).subscribe(
      (res)=> {
        this.loaderService.display(false);
        this.DisplaysnagData = res.quotation.line_items['snag'][index]
        this.snagId = this.DisplaysnagData.unique_id
        // snag Data rm 
        this.snagProductType = this.DisplaysnagData.product_type
        this.rmwidth = this.DisplaysnagData.rm_width
        this.rmheight = this.DisplaysnagData.rm_height
        this.rmdepth =this.DisplaysnagData.rm_depth
        this.rmFinish = this.DisplaysnagData.rm_finish
        this.rmFrontFinish = this.DisplaysnagData.rm_front_finish
        this.rmMaterialThickness = this.DisplaysnagData.rm_material_and_thickness
        this.rmProblemStatement = this.DisplaysnagData.rm_problem_statement
        this.rmEdgeBand = this.DisplaysnagData.rm_edge_band
        this.rmBackFinish = this.DisplaysnagData.rm_back_finish
      

        this.rmquantity = this.DisplaysnagData.quantity
        this.commonItemrequired = this.DisplaysnagData.item_required 
    
    
        // snag Data Hardware
        this.hardware_brand = this.DisplaysnagData.hw_brand
        this.hardware_item_code = this.DisplaysnagData.hw_item_code

        // common 
        this.snagType = this.DisplaysnagData.snag_type
        this.mistakeHead = this.DisplaysnagData.mistake_head
        this.mistakeHeadEmails = this.DisplaysnagData.mistake_head_email

      },(err) => {

      }
    )
  }
  //To toggle row for displaying boqs

  sublineId;
  sli_options_list: any;
  selectedProduct: any;
  abc;
  getSLIOptions(subline, club?) {
    this.abc = subline;
    $("#clubbedView").modal("hide");
    this.sublineId = subline.id;
    this.loaderService.display(true);
    this.sli_options_list = [];
    if (club) {
      club.subline_items.forEach((sli) => {
        this.listSliInClubbed.push(sli.id);
      });
      this.listSliInClubbedStringify = JSON.stringify(this.listSliInClubbed);
    }

    this.categoryService
      .getViewOptionsForMasterSLI(this.project_id, this.boq_id, this.sublineId)
      .subscribe(
        (res) => {
          let product;
          this.selectedSublineItem = subline;
          res.vendor_products.forEach((element) => {
            if (element.id === subline.vendor_product_id) {
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
  public rowSelected: any;
  //for collapsable row table
  toggleRow(row) {
    if (this.rowSelected === -1) {
      this.rowSelected = row;
    } else {
      if (this.rowSelected == row) {
        this.rowSelected = -1;
      } else {
        this.rowSelected = row;
      }
    }
  }

  showBlock(obj) {
    $(".expanded-col-" + obj).css("display", "block");
  }
  hideblock(obj) {
    $(".expanded-col-" + obj).css("display", "none");
  }
  disable_field: boolean = false;
  vendor_product_id_present;
  unit_n;
  from_bom;
  editSliModal(sub, value, from_bom) {
    this.isMaster = false
    this.from_bom = from_bom;
    this.showLineItems();
    this.unit_n = value;
    this.getVendorList();
    this.getUOMList();
    this.getCategorylist();
    this.disable_field = false;
    // this.setEditSliForm(sub);
    if (sub.vendor_product_id) {
      this.disable_field = true;
      this.vendor_product_id_present = sub.vendor_product_id;
      this.getProcurementList();
    } else {
      this.vendor_product_id_present = "";
    }
    this.setEditSliForm(sub);
  }
  edit_sli_form_data: any;
  sli_id_edit;
  sli_category_edit_value;
  setEditSliForm(value) {
    this.edit_sli_form_data = value;
    this.sli_id_edit = value.id;
    // this.update_Sli_Form.controls["sli_category"].setValue(value.sli_category);
    this.update_Sli_Form.controls["name"].setValue(value.element_name);
    this.update_Sli_Form.controls["rate"].setValue(value.rate);
    this.update_Sli_Form.controls["quantity"].setValue(value.quantity);
    this.update_Sli_Form.controls["sli_category"].setValue(value.sli_category);
    this.sli_category_edit_value = value.sli_category;
    if (value.job_element_vendor_details[0]) {
      this.update_Sli_Form.controls["tax_type"].setValue(
        value.job_element_vendor_details[0].tax_type
      );
      this.update_Sli_Form.controls["tax_percent"].setValue(
        value.job_element_vendor_details[0].tax_percent
      );
      this.update_Sli_Form.controls["vendor_name"].setValue(
        value.job_element_vendor_details[0].vendor_name
      );
      this.selectVendor(value.job_element_vendor_details[0].vendor_id);
    } else {
      this.update_Sli_Form.controls["tax_type"].setValue("");
      this.update_Sli_Form.controls["tax_percent"].setValue("");
      this.update_Sli_Form.controls["vendor_name"].setValue("");
      this.selectVendor("");
    }

    if (value.unit) {
      this.update_Sli_Form.controls["unit"].setValue(value.unit);
    } else {
      this.update_Sli_Form.controls["unit"].setValue("");
    }
  }
  vendor_list;
  getVendorList() {
    this.categoryService.projectVendors(this.project_id, this.boq_id).subscribe(
      (res) => {
        this.vendor_list = res.vendors;
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  edit_vendor_id;
  selectVendor(vendorID) {
    this.edit_vendor_id = vendorID;

    if (vendorID != "") {
      this.update_Sli_Form.controls["vendor_id"].setValue(vendorID);
      this.update_Club_Sli_Form.controls["vendor_id"].setValue(vendorID);
    } else {
      this.update_Sli_Form.controls["vendor_id"].setValue("");
      this.update_Club_Sli_Form.controls["vendor_id"].setValue("");
    }
  }
  UpdateSli() {
    var obj = {
      name: this.update_Sli_Form.controls["name"].value,
      sli_category: this.update_Sli_Form.controls["sli_category"].value,
      rate: this.update_Sli_Form.controls["rate"].value,
      quantity: this.update_Sli_Form.controls["quantity"].value,
      tax_type: this.update_Sli_Form.controls["tax_type"].value,
      tax_percent: this.update_Sli_Form.controls["tax_percent"].value,
      unit: this.update_Sli_Form.controls["unit"].value,
      vendor_id: this.update_Sli_Form.controls["vendor_id"].value,
      vendor_product_id: this.vendor_product_id_present
        ? this.vendor_product_id_present
        : "",
    };

    // this.loaderService.display(true);

    this.categoryService
      .UpdateSlis(this.project_id, this.boq_id, this.sli_id_edit, obj)
      .subscribe(
        (res) => {
          $("#editModal").modal("hide");
          this.showLineItems();
          this.successMessageShow("Sli Updated Successfully !!");
          this.loaderService.display(false);
        },
        (err) => {
          $("#editModal").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  uom_list = [];

  getUOMList() {
    this.uom_list = [];
    this.categoryService.getUOMList().subscribe(
      (res) => {
        this.uom_list = res;
      },
      (error) => {}
    );
  }

  category_list: any;
  update_list = [];
  getCategorylist() {
    // this.categoryService.getSliCategoryList().subscribe(
    //   res => {
    this.category_list = [
      {
        name: "raw_materials",
        value: 200,
      },
      {
        name: "jobwork",
        value: 300,
      },

      {
        name: "finished_goods",
        value: 500,
      },
      {
        name: "others",
        value: 100,
      },
    ];
    // }
    // )
  }

  toggle = false;
  selectLineItemArr = [];
  subLineItemArr = [];
  selectLineItemArrForClubbedItem = [];
  subLineItemArrForClubbedItem = [];
  toggleForClubbedItem = false;
  modular_jobs_arr = [];
  service_jobs_arr = [];
  boqjobs_arr = [];
  custom_jobs_arr = [];
  appliance_jobs_arr = [];
  extra_jobs_arr = [];
  clubbed_jobs_arr = [];
  shangpin_jobs_arr = [];
  snag = [];
  module_value;

  set_array_value(value, item, event) {
    if (event) {
      if (value == "loose_furniture") {
        this.boqjobs_arr.push(item.id);
      } else if (value == "modular_kitchen" || value == "modular_wardrobe") {
        this.modular_jobs_arr.push(item.id);
      } else if (value == "services") {
        this.service_jobs_arr.push(item.id);
      } else if (value == "custom_jobs") {
        this.custom_jobs_arr.push(item.id);
      } else if (value == "appliance") {
        this.appliance_jobs_arr.push(item.id);
      } else if (value == "extra") {
        this.extra_jobs_arr.push(item.id);
      } else if (value == "clubbed_jobs") {
        this.clubbed_jobs_arr.push(item.id);
      } else if (value == "custom_furniture") {
        this.shangpin_jobs_arr.push(item.id);
      } else if (value == "snag"){
        this.snag.push(item.id)
      }
    } else {
      if (value == "loose_furniture") {
        this.boqjobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.boqjobs_arr.splice(index, 1);
          }
        });
      } else if (value == "modular_kitchen" || value == "modular_wardrobe") {
        this.modular_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.modular_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "services") {
        this.service_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.service_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "custom_jobs") {
        this.custom_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.custom_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "custom_furniture") {
        this.shangpin_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.shangpin_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "appliance") {
        this.appliance_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.appliance_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "extra") {
        this.extra_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.extra_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "clubbed_jobs") {
        this.clubbed_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.clubbed_jobs_arr.splice(index, 1);
          }
        });
      }
    }
  }

  /* Checkbox toggle for item, line and sub-line items .
  
  Reletionship between the different checkboxes:
    All the checkboxes are dependent on each other and have a parent child relationship(intuitively) as shown below .
    Items(Parent)->Line Items(Child)
    Line Items(Parent) -> Sub Line Items(Child)
    Sub Line Items (Parent) -> No Child
    Rules:
      1) If the Parent is is not checked then all its children will follow the same state i.e unchecked
      2) If any one of the child element is checked then the parent will be checked as well
  */

  removeElementFromArray(collection, id) {
    for (var i = 0; i <= collection.length - 1; i++) {
      if (collection[i] === id) {
        collection.splice(i, 1);
      }
    }
  }

  toggleAll(value, event) {
    this.module_value = value;
    this.toggle = event.target.checked;

    $("#parent-" + value).prop("checked", this.toggle);
    if ($("#parent-" + value).prop("checked") == true) {
      this.toggle = true;
      this.line_items_list[value].forEach((item) => {
        //changing the state of the children based on its parent state
        item.checked = this.toggle;
        if (this.selectLineItemArr.indexOf(item.id) === -1) {
          this.selectLineItemArr.push(item.id);
        }
        this.set_array_value(this.module_value, item, this.toggle);
        item.subline_items.forEach((sub) => {
          sub.checked = this.toggle;
          // only distinct elements should be pushed in the array thus the condition applied below before pushing the data.
          if (this.subLineItemArr.indexOf(sub.id) === -1) {
            this.subLineItemArr.push(sub.id);
          }
        });
      });
    } else {
      this.toggle = false;
      this.line_items_list[value].forEach((item) => {
        item.checked = this.toggle;
        for (var i = 0; i <= this.selectLineItemArr.length - 1; i++) {
          if (this.selectLineItemArr[i] === item.id) {
            this.selectLineItemArr.splice(i, 1);
          }
        }

        item.subline_items.forEach((sub, index) => {
          //removal of all elements from the subLineItemArr as its parent is now not checked
          sub.checked = this.toggle;

          for (var i = 0; i <= this.subLineItemArr.length - 1; i++) {
            if (this.subLineItemArr[i] === sub.id) {
              this.subLineItemArr.splice(i, 1);
            }
          }
        });
        this.set_array_value(this.module_value, item, this.toggle);
      });
    }
  }

  toggleItem(item, event, val) {
    this.module_value = val;
    item.checked = !item.checked;

    if (event.target.checked) {
      this.set_array_value(this.module_value, item, event.target.checked);
      if (this.selectLineItemArr.indexOf(item.id) == -1) {
        this.selectLineItemArr.push(item.id);
      }
      item.subline_items.forEach((sub) => {
        sub.checked = true;
        this.subLineItemArr.push(sub.id);
      });
    } else {
      for (var i = 0; i <= this.selectLineItemArr.length - 1; i++) {
        this.removeElementFromArray(this.selectLineItemArr, item.id);
      }
      this.set_array_value(this.module_value, item, false);

      item.subline_items.forEach((element) => {
        element.checked = false;
        this.removeElementFromArray(this.subLineItemArr, element.id);
      });
    }

    // The state of main parent i.e Line Item is changed only when all the select Line items are not checked.
    $("#parent-" + val).prop(
      "checked",
      !this.line_items_list[val].every(function (item) {
        return item.checked === false || item.checked == null;
      })
    );
  }

  toggleAllForClubbedItem(value, event, index) {
    this.module_value = value;
    this.toggleForClubbedItem = event.target.checked;
    $("#parent-" + index).prop("checked", this.toggleForClubbedItem);

    if ($("#parent-" + index).prop("checked") == true) {
      this.toggleForClubbedItem = true;
      this.line_items_list["clubbed_jobs"][index]["subline_items"].forEach(
        (item) => {
          //changing the state of the children based on its parent state
          item.checked = this.toggleForClubbedItem;
          if (this.selectLineItemArrForClubbedItem.indexOf(item.id) === -1) {
            this.subLineItemArrForClubbedItem.push(item.id);
          }
          this.set_array_value(
            this.module_value,
            item,
            this.toggleForClubbedItem
          );
        }
      );
    } else {
      this.toggleForClubbedItem = false;

      this.line_items_list["clubbed_jobs"][index]["subline_items"].forEach(
        (item) => {
          item.checked = this.toggleForClubbedItem;
          for (
            var i = 0;
            i <= this.selectLineItemArrForClubbedItem.length - 1;
            i++
          ) {
            if (this.selectLineItemArrForClubbedItem[i] === item.id) {
              this.selectLineItemArrForClubbedItem.splice(i, 1);
            }
          }
          this.set_array_value(
            this.module_value,
            item,
            this.toggleForClubbedItem
          );
        }
      );
    }
  }

  toggleItemSublineForClubbedItem(sub, event, parentIndex) {
    let parent = this.line_items_list["clubbed_jobs"][parentIndex];

    if (event.target.checked) {
      sub.checked = true;
      if (this.subLineItemArrForClubbedItem.indexOf(sub.id) == -1) {
        this.subLineItemArrForClubbedItem.push(sub.id);
      }
      if (!parent.checked) {
        parent.checked = true;
        if (this.selectLineItemArrForClubbedItem.indexOf(parent.id) == -1) {
          this.selectLineItemArrForClubbedItem.push(parent.id);
        }
      }
    } else {
      sub.checked = false;
      this.removeElementFromArray(this.subLineItemArrForClubbedItem, sub.id);
    }

    parent.checked = !parent.subline_items.every(function (item) {
      return item.checked === false || item.checked == null;
    });

    if (!parent.checked) {
      this.removeElementFromArray(
        this.selectLineItemArrForClubbedItem,
        parent.id
      );
    }

    $("#parent-" + parentIndex).prop(
      "checked",
      !this.line_items_list["clubbed_jobs"].every(function (item) {
        return item.checked === false || item.checked == null; // The state of main parent i.e Line Item is changed only when all the select Line items are not checked.
      })
    );
  }

  toggleItemSubline(sub, event, parentIndex, root) {
    let parent = this.line_items_list[root][parentIndex];

    if (event.target.checked) {
      sub.checked = true;
      if (this.subLineItemArr.indexOf(sub.id) == -1) {
        this.subLineItemArr.push(sub.id);
      }
      if (!parent.checked) {
        parent.checked = true;
        if (this.selectLineItemArr.indexOf(parent.id) == -1) {
          this.selectLineItemArr.push(parent.id);
        }
      }
    } else {
      sub.checked = false;
      this.removeElementFromArray(this.subLineItemArr, sub.id);
    }

    parent.checked = !parent.subline_items.every(function (item) {
      return item.checked === false || item.checked == null;
    });

    if (!parent.checked) {
      this.removeElementFromArray(this.selectLineItemArr, parent.id);
    }

    $("#parent-" + root).prop(
      "checked",
      !this.line_items_list[root].every(function (item) {
        return item.checked === false || item.checked == null; // The state of main parent i.e Line Item is changed only when all the select Line items are not checked.
      })
    );
  }

  getAttributes(add_Sli) {
    return add_Sli.get("sub_line_items").controls;
  }
  // getClubbedAttributes(addClubbed_Slis){
  //   return addClubbed_Slis.get("clubbed_sub_line_items").controls;
  // }
  //for nested form
  buildItem() {
    return new FormGroup({
      sli_category: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      tax_percent: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      vendor_id: new FormControl("", Validators.required),
      // vendor_code: new FormControl("", Validators.required),
      description: new FormControl(""),
    });
  }
  add_sli_arr = [];
  //For nested form
  pushAttributes(add_Sli) {
    return add_Sli.get("sub_line_items").push(this.buildItem());
  }

  // pushClubbedAttributes(addClubbed_Slis) {
  //   return addClubbed_Slis.get("clubbed_sub_line_items").push(this.buildItem());
  // }
  // add sli button in sli creation
  snagIdMasterSli :any
  openAddSliModal(LineItem, type) {
    console.log(LineItem,type)
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.selectType = "";
    this.setSelectBoxvalues();
    this.GetProductList2("");
    this.automated_sli = false;
    this.LineItem = LineItem;
    this.snagIdMasterSli = this.LineItem.id
    if(type == 'snag'){
      this.AddSliForm.controls["snag_id"].setValue(this.snagIdMasterSli);
    }else{
      this.AddSliForm.controls["snag_id"].setValue('');
    }
    this.LineItemType = type;
    this.emptyArray();
    this.set_array_value(type, LineItem, true);
    this.getVendorList();
    this.getUOMList();
    this.getCategorylist();
  }
  addSliForm(Data) {
    this.data_value = Data;
    for (var i = 0; i < Data.sub_line_items.length; i++) {
      Data.sub_line_items[i].sli_category = parseInt(
        Data.sub_line_items[i].sli_category
      );
    }
    var object;
    if (this.additionalSli) {
      this.modular_jobs_arr = [];
      this.service_jobs_arr = [];
      this.boqjobs_arr = [];
      this.custom_jobs_arr = [];
      this.appliance_jobs_arr = [];
      this.extra_jobs_arr = [];
      this.clubbed_jobs_arr = [];
      this.subLineItemArr = [];
      this.shangpin_jobs_arr = [];
      this.snag = []
    }
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs: this.shangpin_jobs_arr,
        snag : this.snag
      },
    };

    object = $.extend({}, obj, Data);

    this.categoryService
      .ADDSlis(this.project_id, this.boq_id, object)
      .subscribe(
        (res) => {
          // $("#addSli").modal("hide");
          $("#addSli").modal({ backdrop: "static" });
          this.showLineItems();
          this.emptyArray();
          this.openAddSliModal(this.LineItem, this.LineItemType);
          this.additionalSli = false;
          this.successMessageShow("Sli Added Successfully !!");
          this.resetAddSli();
          this.loaderService.display(false);
        },
        (err) => {
          $("#addSli").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        }
      );
  }
  additionalSli: boolean = false;
  openAdditionalSliModal() {
    this.additionalSli = true;
    $("#addSli").modal("show");
    this.getVendorList();
    this.getUOMList();
    this.getCategorylist();
  }
  openClubbedViewModal() {
    $("#clubbedView").modal("show");
    this.getClubbedViewDetails();
  }
  clubbedView: any;
  masterClubbedView: any;
  customClubbedView: any;
  getClubbedViewDetails() {
    this.loaderService.display(true);
    this.categoryService
      .getClubbedViewList(this.project_id, this.boq_id)
      .subscribe(
        (res) => {
          this.clubbedView = res.custom_slis;
          this.masterClubbedView = res.master_slis;
          this.clubbedView = [...res.custom_slis, ...res.master_slis];
          this.customClubbedView = res.custom_slis;
          this.ref.detectChanges();

          this.loaderService.display(false);
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        }
      );
  }

  getClubbedViewDetailsObservable() {
    return this.categoryService.getClubbedViewList(
      this.project_id,
      this.boq_id
    );
  }

  emptyArray() {
    this.modular_jobs_arr = [];
    this.service_jobs_arr = [];
    this.boqjobs_arr = [];
    this.custom_jobs_arr = [];
    this.appliance_jobs_arr = [];
    this.extra_jobs_arr = [];
    this.clubbed_jobs_arr = [];
    this.shangpin_jobs_arr = [];
    this.subLineItemArr = [];
    this.snag = []
    this.add_Sli.reset();
    this.add_Sli_clubbed.reset();
  }

  resetAddSli() {
    this.add_Sli.get("sub_line_items").reset();
    this.add_Sli_clubbed.reset();
    this.sublineItemForm.reset();
    // this.addClubbed_Slis.reset();
    (<FormArray>this.add_Sli.controls["sub_line_items"]).controls = [];
    (<FormArray>this.add_Sli_clubbed.controls["sub_line_items"]).controls = [];
    // (<FormArray>this.addClubbed_Slis.controls["clubbed_sub_line_items"]).controls = [];
    this.pushAttributes(this.add_Sli);
    this.getAttributes(this.add_Sli);
    // this.pushClubbedAttributes(this.addClubbed_Slis);
    // this.getClubbedAttributes(this.addClubbed_Slis);
    this.pushAttributes(this.add_Sli_clubbed);
    this.getAttributes(this.add_Sli_clubbed);
    this.additionalSli = false;
    this.mastersliArr = [];
    this.clubbedView_editable = [];
    this.clubbedUpdate = this.formBuilder.group({
      clubbed: new FormArray([]),
    });
    this.clubbedFormGroup = this.clubbedUpdate.controls["clubbed"]["controls"];
  }
  openClubbedSliModal() {
    if (
      this.modular_jobs_arr.length > 0 ||
      this.service_jobs_arr.length > 0 ||
      this.boqjobs_arr.length > 0 ||
      this.custom_jobs_arr.length > 0 ||
      this.appliance_jobs_arr.length > 0 ||
      this.extra_jobs_arr.length > 0 ||
      this.clubbed_jobs_arr.length > 0 ||
      this.shangpin_jobs_arr.length > 0
    ) {
      $("#addSliClubbed").modal("show");
      this.getVendorList();
      this.getUOMList();
      this.getCategorylist();
    } else {
      alert("You have to select Atleast One Line Item");
    }
  }
  addSliClubbedForm(data) {
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs: this.shangpin_jobs_arr,
      },
    };
    var object = $.extend({}, obj, data);
    this.categoryService
      .ADDClubbedSlis(this.project_id, this.boq_id, object)
      .subscribe(
        (res) => {
          $("#addSliClubbed").modal("hide");
          this.showLineItems();
          this.emptyArray();
          this.add_Sli_clubbed.reset();
          this.successMessageShow("Clubbed Sli Added Successfully !!");
          this.loaderService.display(false);
        },
        (err) => {
          $("#addSliClubbed").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        }
      );
  }

  popUp: string;
  openpopup(event, obj) {
    if (obj) {
      this.popUp = "";
      for (let data of obj.custom_jobs) {
        this.popUp += data.name + "\n\n\n\n";
      }
      for (let data of obj.modular_kitchen) {
        this.popUp += data.name + "\n\n\n\n";
      }
      for (let data of obj.modular_wardrobe) {
        this.popUp += data.name + "\n\n\n\n";
      }

      for (let data of obj.loose_furniture) {
        this.popUp += data.name + "\n\n\n\n";
      }
      for (let data of obj.services) {
        this.popUp += data.name + "\n\n\n\n";
      }
      for (let data of obj.extra) {
        this.popUp += data.name + "\n\n\n\n";
      }
      for (let data of obj.appliance) {
        this.popUp += data.name + "\n\n\n\n";
      }
      for (let data of obj.shangpin_job) {
        this.popUp += data.name + "\n\n\n\n";
      }
    }
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
      title: "",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
        title: "",
      });
    });
  }

  ngOnDestroy() {
    $(function () {
      $(".pop").remove();
    });
  }
  ngAfterViewInit() {
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }
  showLine;
  showClubbedLineItem(obj) {
    this.showLine = obj;
  }
  confirmAndDelete(id: number) {
    if (confirm("Are You Sure You Want To delete?") == true) {
      this.deleteOneSli(id);
    }
  }
  confirmAndDeleteSli() {
    if (
      this.subLineItemArr.length > 0 ||
      this.subLineItemArrForClubbedItem.length > 0
    ) {
      if (confirm("Are You Sure You Want To delete?") == true) {
        this.deleteSelectedSli();
      }
    } else {
      alert("First You Have To Select Atleast One Subline Item");
    }
  }
  deleteSelectedSli() {
    this.loaderService.display(true);

    this.categoryService
      .deleteSelectedSli(
        this.project_id,
        this.boq_id,
        this.subLineItemArr,
        this.subLineItemArrForClubbedItem
      )
      .subscribe(
        (res) => {
          this.showLineItems();
          this.emptyArray();
          this.subLineItemArr = [];
          this.subLineItemArrForClubbedItem = [];
          this.successMessageShow("Selected Sli Deleted Successfully !!");
          this.loaderService.display(false);
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  mli_type_list: { name: string; value: string }[];
  mli_type: string;
  mli_list: any;
  mli_id: any;

  getProcurementList2() {
    this.automated_sli = false;
  }
  getProcurementList3() {
    this.automated_sli = true;
  }
  getProcurementList() {
    this.automated_sli = true;
    this.vendor_code = "";
    this.result_found = "";
    this.show_sli_master = false;
    this.show_sli_master_edit = false;
    this.show_sli_master_newone = false;
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
      {
        name: "2021",
        value: "2021",
      },
    ];
    this.mli_type = "";
    this.getMasterLineItems(this.mli_type);
  }

  getCustomSLiList() {
    this.automated_sli = false;
    this.vendor_code = "";
    this.result_found = "";
    this.show_sli_master = false;
    this.show_sli_master_edit = false;
    this.show_sli_master_newone = false;
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
  selected_vendor_product;
  getDetailsOfVendorProduct(product_id, type = "single", product?) {
    this.loaderService.display(true);
    this.categoryService.getDetailsOfVendorProduct(product_id).subscribe(
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
        this.sublineItemForm.controls["sli_category"].setValue(
          this.selected_vendor_product.sli_category
        );
        this.sublineItemForm.controls["vendor_id"].setValue(
          this.selected_vendor_product.vendor_id
        );
        this.sublineItemForm.controls["vendor_product_id"].setValue(
          this.selected_vendor_product.id
        );
        // For Edit Modal
        if (type == "single") {
          this.update_Sli_Form.controls["name"].setValue(
            this.selected_vendor_product.sli_name
          );
          this.update_Sli_Form.controls["rate"].setValue(
            this.selected_vendor_product.rate
          );
          this.update_Sli_Form.controls["unit"].setValue(
            this.selected_vendor_product.unit
          );
          this.sublineItemForm.controls["sli_category"].setValue(
            this.selected_vendor_product.sli_category
          );
          this.update_Sli_Form.controls["vendor_id"].setValue(
            this.selected_vendor_product.vendor_id
          );
          this.update_Sli_Form.controls["vendor_product_id"].setValue(
            this.selected_vendor_product.id
          );
          this.vendor_product_id_present = this.selected_vendor_product.id;
        } else if (type == "clubbed") {
          this.update_Club_Sli_Form.controls["name"].setValue(
            this.selected_vendor_product.sli_name
          );
          this.update_Club_Sli_Form.controls["rate"].setValue(
            this.selected_vendor_product.rate
          );
          this.update_Club_Sli_Form.controls["unit"].setValue(
            this.selected_vendor_product.unit
          );
          this.update_Club_Sli_Form.controls["vendor_id"].setValue(
            this.selected_vendor_product.vendor_id
          );
          this.update_Club_Sli_Form.controls["vendor_product_id"].setValue(
            this.selected_vendor_product.id
          );
          this.vendor_product_id_present = this.selected_vendor_product.id;
        }

        this.loaderService.display(false);
      },
      (error) => {
        this.loaderService.display(false);
      }
    );
  }
  checkDisplayCondition(po_created, po_modifying) {
    if (po_created == false) {
      this.display = true;
    } else if (po_created == true && po_modifying == false) {
      this.display = false;
    } else if (po_created == true && po_modifying == true) {
      this.display = true;
    }
    return this.display;
  }
  vendor_products_list;
  sli_item_id;
  getVendorProductsList(event, page?) {
    this.mli_id = event;
    for (let obj of this.mli_list) {
      if (this.mli_id == obj.vendor_id) {
        this.sublineItemForm.controls["rate"].patchValue(obj.vendor_id);
      }
    }
    this.loaderService.display(true);
    this.categoryService.getVendorProductsList(this.mli_id, "", page).subscribe(
      (res) => {
        // this.headers_res = res.headers._headers;
        // this.per_page = this.headers_res.get("x-per-page");
        // this.total_page = this.headers_res.get("x-total");
        // this.current_page = this.headers_res.get("x-page");
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

  getVendorProductsList2(searchedItem, page?) {
    this.loaderService.display(true);
    this.categoryService
      .getVendorProductsList2(searchedItem, "", page)
      .subscribe(
        (res) => {
          // this.headers_res = res.headers._headers;
          // this.per_page = this.headers_res.get("x-per-page");
          // this.total_page = this.headers_res.get("x-total");
          // this.current_page = this.headers_res.get("x-page");
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

  mastersliArr = [];
  addSublineItem() {
    // this.sublineItemForm.value.sli_category = parseInt(this.sublineItemForm.value.sli_category);
    this.mastersliArr.push(this.sublineItemForm.value);

    if (this.additionalSli) {
      var obj = {
        line_items: {
          boqjobs: [],
          modular_jobs: [],
          service_jobs: [],
          custom_jobs: [],
          appliance_jobs: [],
          extra_jobs: [],
          clubbed_jobs: [],
          shangpin_jobs: [],
        },
      };
      var obj1 = {
        sub_line_items: this.mastersliArr,
      };
      this.additionalSli = true;
    } else {
      var obj = {
        line_items: {
          boqjobs: this.boqjobs_arr,
          modular_jobs: this.modular_jobs_arr,
          service_jobs: this.service_jobs_arr,
          custom_jobs: this.custom_jobs_arr,
          appliance_jobs: this.appliance_jobs_arr,
          extra_jobs: this.extra_jobs_arr,
          clubbed_jobs: this.clubbed_jobs_arr,
          shangpin_jobs: this.shangpin_jobs_arr, //adding custom furniture
        },
      };
      var obj1 = {
        sub_line_items: this.mastersliArr,
      };
      this.additionalSli = false;
    }

    var object = $.extend({}, obj, obj1);

    this.categoryService
      .ADDSlis(this.project_id, this.boq_id, object)
      .subscribe(
        (res) => {
          // $("#addSli").modal("hide");
          this.mastersliArr = [];
          // this.additionalSli = false;
          this.showLineItems();
          this.emptyArray();
          this.openAddSliModal(this.LineItem, this.LineItemType);
          this.successMessageShow("Sli Added Successfully !!");
          this.resetAddSli();
          this.loaderService.display(false);
        },
        (err) => {
          $("#addSli").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  job_elements_arr_alter: any = [];
  changeViewOption(id, club?) {
    this.sli_options_id = id;

    this.loaderService.display(true);
    if (!club) {
      this.categoryService
        .changeMasterSLIForClubbed(
          this.project_id,
          this.boq_id,
          this.sublineId,
          this.sli_options_id
        )
        .subscribe(
          (res) => {
            this.successalert = true;
            this.successMessage = "Alternative updated successfully";
            (<any>$("#viewOptionsModal")).modal("hide");

            this.showLineItems();
            // this.showLineItems(this.boq_id,this.selectedBOQIndex);
            var data = {
              id: this.boq_id,
              project_id: this.project_id,
            };
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              2000
            );
            this.selected_view_option = undefined;
            this.loaderService.display(false);
          },
          (error) => {
            this.loaderService.display(false);
             this.errorMessageShow(JSON.parse(error["_body"]).message);
          }
        );
    } else {
      this.categoryService
        .changeMasterSLIForClubbedView(
          this.project_id,
          this.boq_id,
          this.listSliInClubbedStringify,
          this.sli_options_id
        )
        .subscribe(
          (res) => {
            this.successalert = true;
            this.successMessage = "Alternative updated successfully";
            (<any>$("#viewClubbedOptionsModal")).modal("hide");
            $("#clubbedView").modal("show");
            $(".modal").css("overflow-y", "auto");
            // this.showLineItems();
            // this.showLineItems(this.boq_id,this.selectedBOQIndex);
            var data = {
              id: this.boq_id,
              project_id: this.project_id,
            };
            this.getClubbedViewDetails();
            this.showLineItems();
            this.listSliInClubbed = [];

            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              2000
            );
            this.selected_view_option = undefined;
            this.loaderService.display(false);
          },
          (error) => {
            $("#clubbedView").modal("show");
            (<any>$("#viewClubbedOptionsModal")).modal("hide");
            this.errorMessageShow(JSON.parse(error["_body"]).message);
            this.loaderService.display(false);
          }
        );
    }
  }
  replaceString(input) {
    return input.replace(/_/g, " ").toUpperCase();
  }
  listSliInClubbed = [];
  listSliInClubbedStringify;
  editClubSli(clubSli) {
    $("#editclubbedSli").modal("hide");
    $("#clubbedView").modal("hide");

    this.listSliInClubbed = [];
    clubSli.subline_items.forEach((sli) => {
      this.listSliInClubbed.push(sli.id);
    });
    this.disable_field = false;
    this.listSliInClubbedStringify = JSON.stringify(this.listSliInClubbed);
    this.getUOMList();
    this.getVendorList();
    this.getCategorylist();
    this.setEditClubSliForm(clubSli);

    if (clubSli.vendor_product_id) {
      this.disable_field = true;
      this.vendor_product_id_present = clubSli.vendor_product_id;
      this.getProcurementList();
    } else {
      this.vendor_product_id_present = "";
    }
  }

  setEditClubSliForm(value) {
    this.update_Club_Sli_Form.controls["name"].setValue(value.element_name);
    this.update_Club_Sli_Form.controls["rate"].setValue(value.rate);
    if (value.subline_items[0].sli_category === "others") {
      this.update_Club_Sli_Form.controls["sli_category"].setValue(100);
    }
    if (value.subline_items[0].sli_category === "raw_materials") {
      this.update_Club_Sli_Form.controls["sli_category"].setValue(200);
    }
    if (value.subline_items[0].sli_category === "jobwork") {
      this.update_Club_Sli_Form.controls["sli_category"].setValue(300);
    }
    if (value.subline_items[0].sli_category === "logistics") {
      this.update_Club_Sli_Form.controls["sli_category"].setValue(400);
    }
    if (value.subline_items[0].sli_category === "finished_goods") {
      this.update_Club_Sli_Form.controls["sli_category"].setValue(500);
    }
    this.update_Club_Sli_Form.controls["quantity"].setValue(value.quantity);
    if (value.job_element_vendor_details[0]) {
      this.update_Club_Sli_Form.controls["tax_type"].setValue(
        value.job_element_vendor_details[0].tax_type
      );
      this.update_Club_Sli_Form.controls["tax_percent"].setValue(
        value.job_element_vendor_details[0].tax_percent
      );

      this.update_Club_Sli_Form.controls["vendor_name"].setValue(
        value.job_element_vendor_details[0].vendor_name
      );
      this.selectVendor(value.job_element_vendor_details[0].vendor_id);
    } else {
      this.update_Club_Sli_Form.controls["tax_type"].setValue("");
      this.update_Club_Sli_Form.controls["tax_percent"].setValue("");

      this.update_Club_Sli_Form.controls["vendor_name"].setValue("");
      this.selectVendor("");
    }
    if (value.unit) {
      this.update_Club_Sli_Form.controls["unit"].setValue(value.unit);
    } else {
      this.update_Club_Sli_Form.controls["unit"].setValue("");
    }
  }

  UpdateClubSli() {
    var obj = [
      {
        name: this.update_Club_Sli_Form.controls["name"].value,
        rate: this.update_Club_Sli_Form.controls["rate"].value,
        sli_category: this.update_Club_Sli_Form.controls["sli_category"].value,
        quantity: this.update_Club_Sli_Form.controls["quantity"].value,
        tax_type: this.update_Club_Sli_Form.controls["tax_type"].value,
        tax_percent: this.update_Club_Sli_Form.controls["tax_percent"].value,
        unit: this.update_Club_Sli_Form.controls["unit"].value,
        vendor_id: this.update_Club_Sli_Form.controls["vendor_id"].value,
        vendor_product_id: this.vendor_product_id_present
          ? this.vendor_product_id_present
          : "",
        job_elements: this.listSliInClubbed,
      },
    ];

    let data = { clubbed_sub_line_items: obj };

    this.loaderService.display(true);

    this.categoryService
      .UpdateClubbedSlis(this.project_id, this.boq_id, data)
      .subscribe(
        (res) => {
          $("#editClubModal").modal("hide");
          $("#clubbedView").modal("show");
          this.getClubbedViewDetails();
          this.showLineItems();
          this.successMessageShow("CLubbed SLI Updated Successfully !!");
          // this.loaderService.display(false);
          this.listSliInClubbed = [];
          this.clubbedUpdate = this.formBuilder.group({
            clubbed: new FormArray([]),
          });
          this.clubbedFormGroup =
            this.clubbedUpdate.controls["clubbed"]["controls"];
          this.clubbedView_editable = [];
        },
        (err) => {
          $("#editClubModal").modal("show");

          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }

  getMliName(event) {
    let searchedItem = event.target.value;
    if (searchedItem.length >= 3) {
      this.getVendorProductsList2(searchedItem);
    }
  }

  retainModalState(modalId, prevModalId) {
    $("#" + modalId).modal("hide");
    // $('body').addClass('modal-open');
    $("#" + prevModalId).modal("show");
    $(".modal").css("overflow-y", "auto");
    this.clubbedUpdate = this.formBuilder.group({
      clubbed: new FormArray([]),
    });
    this.clubbedFormGroup = this.clubbedUpdate.controls["clubbed"]["controls"];
    this.clubbedView_editable = [];
    this.listSliInClubbed = [];
    this.listSliInClubbedStringify = [];
  }
  sliDetail;
  getSliDetails(jobElementID) {
    $("#clubbedView").modal("hide");
    this.loaderService.display(true);
    this.categoryService
      .getSliDetails(this.project_id, this.boq_id, jobElementID)
      .subscribe(
        (res) => {
          this.sliDetail = res;
          this.loaderService.display(false);
          this.listSliInClubbed = [];
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  //open modal box for editing

  openEditClubbedSliModal() {
    this.getVendorList();
    $("#clubbedView").modal("hide");
    this.getClubbedViewDetails();
    this.createClubbedForm();
    this.automated_sli = false;
  }
  openUomModal() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    $("#popup.classList").toggle("show");
  }

  getEditClubbedSlisList() {
    this.automated_sli = true;
    $("#editclubbedSli").modal("show");
    this.getClubbedViewDetails();
    this.clubbedUpdate = this.formBuilder.group({
      clubbed: new FormArray([]),
    });
    this.clubbedFormGroup = this.clubbedUpdate.controls["clubbed"]["controls"];
    this.clubbedView_editable = [];
  }

  //create clubbed mass edition form
  clubbedFormGroup;
  clubbedView_editable = [];
  sli_category_value: any;
  createClubbedForm() {
    this.customClubbedView.forEach((item, index) => {
      if (this.checkDisplayCondition(item.po_created,item.modifying_po)) {
        this.clubbedView_editable.push(item);
      }
    });

    this.clubbedView_editable.forEach((item) => {
      let listOfIds = [];
      let listOfUomUpdated = [];
      item.subline_items.forEach((subline) => {
        listOfIds.push(subline.id);
        listOfUomUpdated.push(false);
      });

      if (
        this.clubbedView_editable[0].subline_items[0].sli_category === "others"
      ) {
        this.sli_category_value = 100;
      }
      if (
        this.clubbedView_editable[0].subline_items[0].sli_category ===
        "raw_materials"
      ) {
        this.sli_category_value = 200;
      }
      if (
        this.clubbedView_editable[0].subline_items[0].sli_category === "jobwork"
      ) {
        this.sli_category_value = 300;
      }
      if (
        this.clubbedView_editable[0].subline_items[0].sli_category ===
        "logistics"
      ) {
        this.sli_category_value = 400;
      }
      if (
        this.clubbedView_editable[0].subline_items[0].sli_category ===
        "finished_goods"
      ) {
        this.sli_category_value = 500;
      }

      this.clubbedFormGroup.push(
        this.formBuilder.group({
          name: [item.element_name, Validators.required],
          sli_category: [this.sli_category_value, Validators.required],
          rate: [item.rate, [Validators.required, Validators.min(1)]],
          quantity: [item.quantity, Validators.required],
          tax_type: [
            item.job_element_vendor_details.length > 0
              ? item.job_element_vendor_details[0].tax_type
              : "",
            Validators.required,
          ],
          unit: [
            item.job_element_vendor_details.length > 0
              ? item.job_element_vendor_details[0].unit_of_measurement
              : "",
            Validators.required,
          ],
          tax_percent: [
            item.job_element_vendor_details.length > 0
              ? item.job_element_vendor_details[0].tax_percent
              : "",
            Validators.required,
          ],
          vendor_id: [
            item.job_element_vendor_details.length > 0
              ? item.job_element_vendor_details[0].vendor_id
              : "",
            Validators.required,
          ],
          vendor_product_id: [item.vendor_product_id],
          job_elements: [listOfIds],
        })
      );
    });

    this.ref.detectChanges();
  }
  // get vendor data for clubbed update
  clslis;
  getVendorForClubbed(addClubbed_Slis) {
    this.clslis = addClubbed_Slis;
    this.getVendorList();
    this.getClubbedViewDetails();
    this.automated_sli = false;
  }

  //for custome tab active
  openCustomSli() {
    this.automated_sli = false;
    this.createClubbedForm();
  }

  // update mass clubbed edition functionlity///
  error;
  Error;
  nameForm;
  categoryForm;
  unitForm;
  rateForm;
  taxTypeForm;
  quantityForm;
  vendorForm;
  taxPercentForm;
  values;
  StatusForm;
  validityCheckArray = [];
  UpdateMassClubbedSlis(value) {
    this.values = value;
    let valueArray = [];
    this.validityCheckArray = [];
    value.get("clubbed").controls.forEach((group) => {
      valueArray.push(group.value);
      this.validityCheckArray.push({
        name: (this.nameForm = group["controls"]["name"].status),
        sli_category: (this.categoryForm =
          group["controls"]["sli_category"].status),
        unit: (this.unitForm = group["controls"]["unit"].status),
        rate: (this.rateForm = group["controls"]["rate"].status),
        tax_type: (this.taxTypeForm = group["controls"]["tax_type"].status),
        quantity: (this.quantityForm = group["controls"]["quantity"].status),
        vendor_id: (this.vendorForm = group["controls"]["vendor_id"].status),
        tax_percent: (this.taxPercentForm =
          group["controls"]["tax_percent"].status),
      });
    });

    var obj = {
      clubbed_sub_line_items: valueArray,
    };

    this.loaderService.display(true);
    this.categoryService
      .UpdateClubbedSlis(this.project_id, this.boq_id, obj)
      .subscribe(
        (res) => {
          this.error = res.has_errors;
          if (this.error == true) {
            $("#editclubbedSli").modal("show");
          }
          if (this.error == false) {
            $("#editclubbedSli").modal("hide");
            this.successMessageShow("CLubbed SLI Updated Successfully !!");
            this.loaderService.display(false);
            this.clubbedUpdate = this.formBuilder.group({
              clubbed: new FormArray([]),
            });
            this.clubbedFormGroup =
              this.clubbedUpdate.controls["clubbed"]["controls"];
            this.getClubbedViewDetails();
            this.showLineItems();
            $("#clubbedView").modal("show");
          }
          this.getClubbedViewDetails();
          this.showLineItems();
        },
        (err) => {
          $("#editclubbedSli").modal("show");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
          this.clubbedUpdate = this.formBuilder.group({
            clubbed: new FormArray([]),
          });
          this.clubbedFormGroup =
            this.clubbedUpdate.controls["clubbed"]["controls"];
        }
      );
    this.clubbedView_editable = [];
  }

  get clubbed(): FormArray {
    return this.clubbedUpdate.get("clubbed") as FormArray;
  }

  clubbedControls;
  disableUomConversion = false;
  uom_convert_list;
  convertRate(clubbedControls) {
    $("#uomBackground").addClass("bright-effect");

    this.clubbedControls = clubbedControls;

    this.updateUOM.controls["currentUnit"].setValue(
      this.clubbedControls["unit"].value
    );

    this.updateUOM.controls["unit"].setValue("");

    this.updateUOM.controls["original"].setValue(
      this.clubbedControls["quantity"].value
    );

    this.updateUOM.controls["updated"].setValue(
      this.clubbedControls["quantity"].value
    );

    this.disableUomConversion = false;

    if (this.clubbedControls["unit"].value == "") {
      this.disableUomConversion = true;
    }

    if (this.clubbedControls["unit"].value == "r_ft") {
      this.uom_convert_list = ["r_mt"];
    } else if (this.clubbedControls["unit"].value == "r_mt") {
      this.uom_convert_list = ["r_ft"];
    } else if (this.clubbedControls["unit"].value == "nos") {
      this.uom_convert_list = ["s_ft", "sq_m"];
    } else if (this.clubbedControls["unit"].value == "s_ft") {
      this.uom_convert_list = ["nos", "sq_m"];
    } else if (this.clubbedControls["unit"].value == "sq_m") {
      this.uom_convert_list = ["nos", "s_ft"];
    }

    this.ref.detectChanges();
  }

  removeUomModal() {
    $("#uomConversionModal").modal("hide");
    $(".modal").css("overflow-y", "auto");
    $("#uomBackground").removeClass("bright-effect");
  }

  updateUomQuantity() {
    let previousUOM = this.updateUOM.controls["currentUnit"].value;
    let previousQuantity = this.clubbedControls["quantity"].value;

    if (previousUOM == "r_ft") {
      if (this.updateUOM.controls["unit"].value == "r_ft") {
      }
      if (this.updateUOM.controls["unit"].value == "r_mt") {
        this.updateUOM.controls["updated"].setValue(previousQuantity * 0.3048);
      }
    }
    if (previousUOM == "r_mt") {
      if (this.updateUOM.controls["unit"].value == "r_mt") {
      }
      if (this.updateUOM.controls["unit"].value == "r_ft") {
        this.updateUOM.controls["updated"].setValue(previousQuantity * 3.28084);
      }
    }
    if (previousUOM == "nos") {
      if (this.updateUOM.controls["unit"].value == "nos") {
      }
      if (this.updateUOM.controls["unit"].value == "s_ft") {
        this.updateUOM.controls["updated"].setValue(previousQuantity * 32);
      }
      if (this.updateUOM.controls["unit"].value == "sq_m") {
        this.updateUOM.controls["updated"].setValue(previousQuantity * 2.9729);
      }
    }
    if (previousUOM == "s_ft") {
      if (this.updateUOM.controls["unit"].value == "s_ft") {
      }
      if (this.updateUOM.controls["unit"].value == "nos") {
        this.updateUOM.controls["updated"].setValue(previousQuantity * 0.03125);
      }
      if (this.updateUOM.controls["unit"].value == "sq_m") {
        this.updateUOM.controls["updated"].setValue(
          previousQuantity * 0.092903
        );
      }
    }
    if (previousUOM == "sq_m") {
      if (this.updateUOM.controls["unit"].value == "sq_m") {
      }
      if (this.updateUOM.controls["unit"].value == "nos") {
        this.updateUOM.controls["updated"].setValue(
          previousQuantity * 0.3363718
        );
      }
      if (this.updateUOM.controls["unit"].value == "s_ft") {
        this.updateUOM.controls["updated"].setValue(previousQuantity * 10.7639);
      }
    }
  }

  changeUOM(event) {
    let requestData = {
      job_elements: this.clubbedControls["job_elements"].value,
      updated_quantity: this.updateUOM.controls["updated"].value,
      new_uom: this.updateUOM.controls["unit"].value,
    };

    this.loaderService.display(true);

    let data = {
      clubbed_sub_line_items: [requestData],
    };

    this.categoryService
      .UpdateUom(this.project_id, this.boq_id, data)
      .subscribe(
        (res) => {
          this.clubbedView_editable = [];
          this.clubbedUpdate = this.formBuilder.group({
            clubbed: new FormArray([]),
          });

          this.clubbedFormGroup =
            this.clubbedUpdate.controls["clubbed"]["controls"];

          this.getClubbedViewDetailsObservable().subscribe(
            (res) => {
              this.clubbedView = res.custom_slis;
              this.masterClubbedView = res.master_slis;
              this.clubbedView = [...res.custom_slis, ...res.master_slis];
              this.customClubbedView = res.custom_slis;

              this.createClubbedForm();
              this.removeUomModal();
              this.loaderService.display(false);

              this.successMessageShow("UoM Conversion Successfull !");
              this.showLineItems();
              this.loaderService.display(false); //removing spinner for above api call
              this.ref.detectChanges();
            },
            (err) => {
              this.errorMessageShow(JSON.parse(err["_body"]).error);
              this.loaderService.display(false);
            }
          );
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
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
  current_page: any = 1;
  searchvendorcode(page) {
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
  add_sli_master(item) {
    this.addcustomSLIForm.controls["name"].setValue(item.sli_name);
    this.addcustomSLIForm.controls["rate"].setValue(item.rate);
    this.addcustomSLIForm.controls["unit"].setValue(item.unit);
    this.addcustomSLIForm.controls["sli_category"].setValue(item.sli_category);
    this.addcustomSLIForm.controls["vendor_id"].setValue(item.vendor_id);
    this.addcustomSLIForm.controls["vendor_product_id"].setValue(item.id);
    this.addcustomSLIForm.controls["sli_vendor_code"].setValue(
      item.vendor_code
    );
    this.addcustomSLIForm.controls["sli_description"].setValue(
      item.description
    );
    this.show_sli_master = true;
    this.show_sli_master_edit = false;
  }

  show_sli_master_edit: boolean = false;
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
    this.show_sli_master = false;
  }

  addSublineItemmaster() {
    this.loaderService.display(true);
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs: this.shangpin_jobs_arr, //adding custom furniture
      },
    };
    var obj1 = {
      sub_line_items: [
        {
          name: this.addcustomSLIForm.controls["name"].value,
          quantity: this.addcustomSLIForm.controls["quantity"].value,
          rate: this.addcustomSLIForm.controls["rate"].value,
          sli_category: this.addcustomSLIForm.controls["sli_category"].value,
          tax_percent: this.addcustomSLIForm.controls["tax_percent"].value,
          tax_type: this.addcustomSLIForm.controls["tax_type"].value,
          unit: this.addcustomSLIForm.controls["unit"].value,
          vendor_id: this.addcustomSLIForm.controls["vendor_id"].value,
          vendor_product_id:
            this.addcustomSLIForm.controls["vendor_product_id"].value,
          vendor_code: this.addcustomSLIForm.controls["sli_vendor_code"].value,
          sli_description:
            this.addcustomSLIForm.controls["sli_description"].value,
        },
      ],
    };

    var object = $.extend({}, obj, obj1);
    this.categoryService
      .ADDSlis(this.project_id, this.boq_id, object)
      .subscribe(
        (res) => {
          // $("#addSli").modal("hide");
          // this.mastersliArr = [];
          // this.additionalSli = false;
          this.showLineItems();
          // this.emptyArray();
          // this.openAddSliModal(this.LineItem, this.LineItemType);
          this.searchvendorcode(1);
          this.show_sli_master = false;
          this.addcustomSLIForm.reset();
          this.successMessageShow("Sli Added Successfully !!");
          this.loaderService.display(false);
        },
        (err) => {
          $("#addSli").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
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
        // $("#addSli").modal("hide");
        // this.mastersliArr = [];
        // this.additionalSli = false;
        this.showLineItems();
        // this.emptyArray();
        // this.openAddSliModal(this.LineItem, this.LineItemType);
        this.searchvendorcode(1);
        this.show_sli_master_edit = false;
        this.editcustomSLIForm.reset();
        this.successMessageShow("Sli Edited Successfully !!");
        // this.resetAddSli();
        this.loaderService.display(false);
      },
      (err) => {
        $("#addSli").modal("hide");
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }

  addSublineItemmasternew() {
    this.loaderService.display(true);
    var obj1 = {
      name: this.newaddcustomSLIForm.controls["name"].value,
      rate: this.newaddcustomSLIForm.controls["rate"].value,
      sli_category: this.newaddcustomSLIForm.controls["sli_category"].value,
      unit: this.newaddcustomSLIForm.controls["unit"].value,
      vendor_id: this.newaddcustomSLIForm.controls["vendor_id"].value,
      vendor_code: this.newaddcustomSLIForm.controls["sli_vendor_code"].value,
      sli_description:
        this.newaddcustomSLIForm.controls["sli_description"].value,
      quantity: this.newaddcustomSLIForm.controls["quantity"].value,
      tax_type: this.newaddcustomSLIForm.controls["tax_type"].value,
      tax_percent: this.newaddcustomSLIForm.controls["tax_percent"].value,
    };
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs: this.shangpin_jobs_arr, //adding custom furniture
      },
    };
    var id = [];
    // value = [];
    for (var i = 0; i < Object.keys(obj.line_items).length; i++) {
      if (Object.values(obj.line_items)[i].length != 0) {
        var id = Object.values(obj.line_items)[i];
        var value = Object.keys(obj.line_items)[i];
      }
    }


    // this.project_id, this.boq_id;
    this.categoryService.ADDSlismaster(obj1, this.boq_id, id, value).subscribe(
      (res) => {
        // $("#addSli").modal("hide");
        // this.mastersliArr = [];
        // this.additionalSli = false;
        this.showLineItems();
        // this.emptyArray();
        // this.openAddSliModal(this.LineItem, this.LineItemType);
        this.show_sli_master_newone = false;
        this.newaddcustomSLIForm.reset();
        this.successMessageShow("Sli Added Successfully !!");
        this.loaderService.display(false);
      },
      (err) => {
        $("#addSli").modal("hide");
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }

  addmasterslinew() {
    this.show_sli_master_newone = true;
    this.show_sli_master = false;
    this.show_sli_master_edit = false;
  }

  transform(value: string): string {
    return value.replace(/_/g, " ");
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
  closevenMO() {
    $("#glassAnimals3").modal("hide");
  }
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
      
     this.dep_id ="" , this.Sub_dep_id="", this.class_id="", this.SubClass_Id="";
      this.departDefault ="",
        this.subdepartDefault ="",
        this.classDefault= "",
        this.subclassDefault="",
        this.matcodeDefault ="";


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
      this.subdepartDefault = "",
        this.classDefault = "",
        this.subclassDefault = "",
        this.matcodeDefault = "";
     this.class_id = "", this.SubClass_Id = "";

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
  FullHierData: any;
  taxEnable =true;
  arrayOFLength = ["", "", "", "", "", "", ""];
  SliChildId: any;

  openPanelModal(pro, id, pro2) {
    this.RateEnable = true;
    this.taxEnable = true;
    console.log(pro);
    this.AddSliForm.controls["quantity"].setValue("");
    if (pro2.vendor_name.cost == "_") {
      this.AddSliForm.controls["rate"].setValue("");
    } else {
      this.AddSliForm.controls["rate"].setValue(pro2.vendor_name.cost);
    }

    this.AddSliForm.controls["specs"].setValue("");
    this.AddSliForm.controls["tax_percent"].setValue(pro2.tax
      );
    this.AddSliForm.controls["tax_type"].setValue(null);
    $("#glassAnimals2").modal("show");
    this.showConfig = false;
    this.data_heir = pro;
    this.SliChildId = id;
    this.FullHierData = pro2;
    console.log(this.FullHierData);
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
    console.log("bhoij")
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
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs: this.shangpin_jobs_arr,
      },
    };
    var id = [];
    for (var i = 0; i < Object.keys(obj.line_items).length; i++) {
      if (Object.values(obj.line_items)[i].length != 0) {
        var id = Object.values(obj.line_items)[i];
        var value = Object.keys(obj.line_items)[i];
      }
    }

    console.log(id[0], value);
    this.AddSliForm.controls["ownerable_id"].setValue(id[0]);
    this.AddSliForm.controls["ownerable_type"].setValue(value);    
    this.AddSliForm.controls["cli_id"].setValue(this.SliChildId);

    this.loaderService.display(true);
    console.log(this.project_id);
    this.LeadService.CreateSliForCat(
      this.AddSliForm.value,
      this.boq_id,
      this.project_id
    ).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successMessageShow("Sli added Successfully");
        this.closeSliMo();
        this.showLineItems();
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
  closemoVen() {
    $("#glassAnimals3").modal("hide");
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
  FullHierDataedit;
  isMaster:boolean;
  EditNewSli(data) {
   this.isMaster = true
    console.log(this.isMaster);
    this.taxEnable =true
     this.FullHierDataedit = data;
    this.AddSliForm.controls["quantity"].setValue(data.quantity);
    if (data.amount) {
      this.AddSliForm.controls["rate"].setValue(data.rate);
    } else {
      this.AddSliForm.controls["rate"].setValue("");
    }

    this.AddSliForm.controls["specs"].setValue(data.description);
    this.AddSliForm.controls["tax_type"].setValue(
      data.job_element_vendor_details[0].tax_type
    );
    this.AddSliForm.controls["tax_percent"].setValue(
      data.tax
    );
     console.log(data.job_element_vendor_details[0].tax_type,this.AddSliForm.value);
    this.showConfig = false;

    this.SliChildId = data.id;
  }
  Sliupdate(){

    var obj = {
      name: this.FullHierDataedit.element_name,
      sli_category: this.FullHierDataedit.sli_category,
      rate: this.AddSliForm.controls["rate"].value,
      quantity: this.AddSliForm.controls["quantity"].value,
      tax_type: this.AddSliForm.controls["tax_type"].value,
      tax_percent:this.AddSliForm.controls["tax_percent"].value ,
      unit: this.FullHierDataedit.unit,
      vendor_id: this.FullHierDataedit.job_element_vendor_details[0].vendor_id,
      description: this.AddSliForm.controls["specs"].value,
      vendor_product_id: this.FullHierDataedit.vendor_product_id
        ? this.FullHierDataedit.vendor_product_id
        : "",
    };
     this.categoryService
       .UpdateSlis(this.project_id, this.boq_id, this.FullHierDataedit.id, obj)
       .subscribe(
         (res) => {
           $("#editModal").modal("hide");
           this.showLineItems();
           this.successMessageShow("Sli Updated Successfully !!");
           this.loaderService.display(false);
         },
         (err) => {
           $("#editModal").modal("hide");
           this.errorMessageShow(JSON.parse(err["_body"]).message);
           this.loaderService.display(false);
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
    this.errorMessageShow(JSON.parse(err["_body"]).message);

  })
}

imageModal(){
  $("#snagpopmodalfiles").modal("show");

}
imageUrl:any
  imgageDetail(url){

this.imageUrl = url;
$("#snagpopmodalfilesview").modal("show");


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
  }
  )
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

createchilditem(id){
  this.loaderService.display(true);
  this.LeadService.createchilditem(id).subscribe((res) =>{
    this.successMessageShow(res.message);
    $("#viewDynamicmapping2").modal("hide");
    // this.GetProductList('')

  },
  (err)=>{
    this.loaderService.display(false);
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

}
