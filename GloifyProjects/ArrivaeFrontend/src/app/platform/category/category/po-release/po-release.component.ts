import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from "@angular/core";
import { CategoryService } from "../category.service";
import { LoaderService } from "../../../../services/loader.service";
import { environment } from "environments/environment";
import { FinanceService } from '../../../finance/finance.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
declare var $: any;
import * as _moment from 'moment';
import { LeadService } from "app/platform/lead/lead.service";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "po-release",
  templateUrl: "./po-release.component.html",
  styleUrls: ["./po-release.component.css", "../tasks/tasks.component.css"],
  providers: [CategoryService],
})
export class PoReleaseComponent implements OnInit {
  poReleaseCount;
  boq_list;
  project_id;
  boq_id;
  arrow: boolean = true;
  toggle_line_rows: boolean;
  selectedProduct: any;
  @Input() line_item_po: any;
  line_item_in_po;
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  vendor_list;
  toggle = false;
  milestoneForm: FormGroup;
  milestoneeditForm: FormGroup;
  purchase_order_list;
  role:any
  TransactionChargesForm: FormGroup;
  public todayDate: any = new Date();
  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private financeService: FinanceService,
    private ref: ChangeDetectorRef,
    private leadService:LeadService
  ) {}

  ngOnInit() {
    this.line_item_in_po = this.line_item_po;
    this.project_id = this.line_item_in_po.project_id;
    this.boq_id = this.line_item_in_po.id;
    console.log(this.line_item_in_po);
    this.role = localStorage.getItem("user");


    this.getVendors();
  
    this.milestoneForm = this.formBuilder.group({
      saved_shipping_address: new FormControl(""),
      shipping_address_record_id: new FormControl(""),
      shipping_address: new FormControl("", Validators.required),
      quotation_id: new FormControl("", Validators.required),
      project_id: new FormControl("", Validators.required),
      vendor_id: new FormControl("", Validators.required),
      status: new FormControl("pending", Validators.required),
      contact_person: new FormControl(""),
      contact_number: new FormControl(""),
      vendor_gst: new FormControl("", Validators.required),
      current_expected_delivery_date: new FormControl("", Validators.required),
      saved_billing_address: new FormControl(""),
      billing_address: new FormControl("", Validators.required),
      billing_contact_person: new FormControl(""),
      billing_contact_number: new FormControl(""),
      potag:new FormControl(""),
      sameAddress: new FormControl(false),
      internal_consumption_po :  new FormControl(false),
      tag_snag: new FormControl("", Validators.required),
      after_sales: new FormControl("", Validators.required),
      provider: new FormControl(""),
      milestone_elements: this.formBuilder.array([], Validators.required),
    });
    this.milestoneeditForm = this.formBuilder.group({
      current_expected_delivery_date: new FormControl("", Validators.required),
    });
    this.TransactionChargesForm = this.formBuilder.group({
      transportation_tax: new FormControl(""),
      transportation_charges: new FormControl(""),
      transportation_tax_type: new FormControl(""),
    });
    this.BillingAdressSetup("");
  }
  removeMilestoneElement(i) {
    <FormArray>(
      this.milestoneForm.get("milestone_elements")["controls"].splice(i, 1)
    );
    this.milestoneForm.controls["milestone_elements"].value.splice(i, 1);
  }
  createMilestoneElement(): FormGroup {
    return this.formBuilder.group({
      estimate_date: new FormControl("", Validators.required),
      percentage_amount: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });
  }

  addMilestoneElement(): void {
    if (this.checkValidity()) {
      (<FormArray>this.milestoneForm.controls["milestone_elements"]).push(
        this.createMilestoneElement()
      );
    }
  }
  checkValidity() {
    var totalPercentage = 0;

    if (this.milestoneForm.controls["milestone_elements"].value) {
      this.milestoneForm.controls["milestone_elements"].value.forEach(function (
        element
      ) {
        totalPercentage += parseInt(element.percentage_amount || 0);
      });
    }

    if (totalPercentage > 100) {
      alert("cannot be more than 100%.");
      // $("#milestoneSubmitBtn").attr("disabled", true);
      return false;
    } else {
      var shipping_addr = this.milestoneForm.controls.shipping_address.value;
      var billing_addr = this.milestoneForm.controls.billing_address.value;

      if (shipping_addr && billing_addr) {
        // $("#milestoneSubmitBtn").attr("disabled", false);
      }
      return true;
    }
  }

  vendor_item;
  permit_permission: boolean = false;
  BoqType:any
  getVendors() {
    this.loaderService.display(true);
    this.categoryService.getVendorsInPo(this.line_item_in_po.id).subscribe(
      (res) => {
        this.vendor_list = res.vendor_details;
        this.vendor_item = res.vendor_items;
        this.permit_permission = res.po_creation_permitted;
        this.purchase_order_list = res.purchase_orders;
        this.BoqType = res.boq_type;
        this.ref.detectChanges();
        this.loaderService.display(false);
      },
      (err) => {
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
      4000
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

  current_expected_delivery_date;
  current_expected_delivery_date2;
  event_date;
  handleInvoiceDateSelectEvent(eventDate) {
    this.milestoneForm.controls["current_expected_delivery_date"].setValue(
      this._trasformDateType(eventDate)
    );
  }

  handleInvoiceDateeditSelectEvent(eventDate) {
    this.milestoneeditForm.controls["current_expected_delivery_date"].setValue(
      this._trasformDateType(eventDate)
    );
    this.edited_date = this._trasformDateType(eventDate);
  }

  private _trasformDateType(dateValue) {
    return moment(dateValue).format("DD/MM/yyyy");
  }
  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }

  owl_date;
  ZoHoDataPo:any =[];
  finalsubmission() {
   
    var obj = {
      purchase_order: this.milestoneForm.value,
      purchase_elements: this.selectedItem,
    };
    if (this.checkValidity() && this.checkMilestonePercentage()) {
      this.loaderService.display(true);
      this.categoryService.finalsubmissionOfPO(obj).subscribe(
        (res) => {
          this.loaderService.display(false);
          
          if(res && res.zoho_mapping_required){
            $("#CreatePOModal").modal("hide");
            this.successMessageShow("pop Up open");
            this.getzohoData(this.selectedItem,this.milestoneForm.value.shipping_address_record_id)
          } else{
            $("#CreatePOModal").modal("hide");
            $("#ViewZohoMappingPo").modal("hide");
            this.milestoneForm.reset();
            this.successMessageShow("PO Created  Successfully !!");
            this.rowSelected = -1;
            this.selectedItem = [];
            this.showAndHideSnagOptions = []
            this.parentCheckbox_id = -1;
            this.loaderService.display(false);
            this.getVendors();
          }
         
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  zohoitemChecker =[];
  getzohoData(e_id,shipping_id){
    this.zohoitemChecker = [];
    this.loaderService.display(true);

    let obj ={
      purchase_elements:e_id,
      shipping_address_record_id:shipping_id
    }
    this.categoryService.ZohoPoGET(obj).subscribe(res=>{
      this.loaderService.display(false);
      this.ZoHoDataPo = res;
      $("#ViewZohoMappingPo").modal("show");

    },
    err=>{

      this.errorMessageShow(JSON.parse(err["_body"]).message);
      this.loaderService.display(false);

    })


  }
  checkMilestonePercentage() {
    var totalPercentage = 0;

    if (this.milestoneForm.controls["milestone_elements"].value) {
      this.milestoneForm.controls["milestone_elements"].value.forEach(function (
        element
      ) {
        totalPercentage += parseInt(element.percentage_amount || 0);
      });
    }
    if (
      totalPercentage < 100 &&
      this.milestoneForm.controls["milestone_elements"].value.length > 0
    ) {
      alert("cannot be less than 100%.");
      // $("#milestoneSubmitBtn").attr("disabled", true);
      return false;
    } else {
      return true;
    }
  }

  selectedrow;
  itemList: any;
  // toggleRow(row){
  //    this.selectedrow = row.id;
  //    $(".expanded-col").css("display", "none");
  //    $(".expanded-col-"+ this.selectedrow).css("display", "table-row");
  //    for(let obj of this.vendor_list){
  //      if(obj.id == this.selectedrow){
  //        if(obj.element_count > 0){
  //          this.itemList = obj.job_elements
  //        }
  //

  //      }
  //    }

  // }
  rowSelected: any;
  toggleRow(row) {
    this.selectedrow = row.id;
    if (this.rowSelected === -1) {
      this.rowSelected = row.id;
    } else {
      if (this.rowSelected == row.id) {
        this.rowSelected = -1;
      } else {
        this.rowSelected = row.id;
      }
    }
    for (let obj of this.vendor_list) {
      if (obj.id == this.selectedrow) {
        if (obj.element_count > 0) {
          this.itemList = obj.job_elements;
        }
      }
    }
  }

  toggleRowPO(row) {
    if (this.selectedrow != row.id) {
      this.selectedItem = [];
    }
    this.selectedrow = row.po_details.id;
    if (this.rowSelected === -1) {
      this.rowSelected = row.po_details.id;
    } else {
      if (this.rowSelected == row.po_details.id) {
        this.rowSelected = -1;
      } else {
        this.rowSelected = row.po_details.id;
      }
    }
    for (let obj of this.purchase_order_list) {
      if (obj.po_details.id == this.selectedrow) {
        if (obj.po_details.job_elements.length > 0) {
          this.itemList = obj.po_details.job_elements;
        }
      }
    }
  }
  selectId;
  clickRow(id) {
    this.selectId = id;
  }
  selectedItem = [];
  parentCheckbox_id = -1;
  child_parent = -1;
  toggleAll(event, obj) {  
    console.log(obj);
    this.showAndHideSnagOptions = []    
    if (event.target.checked) {
      if (this.parentCheckbox_id == -1 || this.parentCheckbox_id == obj.id) {
        this.itemList.forEach((item) => {
          item.checked = true;
          if (!this.selectedItem.includes(item.job_element_id)) {
            this.selectedItem.push(item.job_element_id);
          }
        });

        this.parentCheckbox_id = obj.id;
        this.child_parent = obj.id;
      } else {
        obj.checked = false;
        $("#checkAll-" + obj.id).prop("checked", false);
        alert("you already select a PO From another vendor");
      }
    } else {
      this.itemList.forEach((item) => {
        item.checked = false;
        this.selectedItem = [];
        this.parentCheckbox_id = -1;
      });
    }

    if(event.target.checked){
      for(var i = 0 ; i<obj.job_elements.length ; i++){
        this.showAndHideSnagOptions.push(obj.job_elements[i].is_snag)
      }
    }else{
      this.showAndHideSnagOptions = []
    }
    console.log(this.showAndHideSnagOptions);
    
  }

  gst_list;
  address_list = [];
  address_list_billing = [];
  vendor_id;
  CreateModal(value) {
   
    this.milestoneForm.controls['potag'].setValue("")
    if (this.selectedItem.length > 0) {
      $("#CreatePOModal").modal("show");
      this.getshipAddressForPO();
      this.getAddress();
      this.gst_list = value.gst_no;
      this.vendor_id = value.id;
      this.milestoneForm.controls["quotation_id"].patchValue(this.boq_id);
      this.milestoneForm.controls["project_id"].patchValue(this.project_id);
      this.milestoneForm.controls["vendor_id"].patchValue(this.vendor_id);
      this.milestoneForm.controls["status"].patchValue("pending");
    } else {
      alert("Please Select Atleast One Line Item");
    }
   
    if (this.BoqType != "service") {
      this.milestoneForm.controls["internal_consumption_po"].setValidators(
        Validators.required
      );
       this.milestoneForm.controls["internal_consumption_po"].updateValueAndValidity()
       
    } else {
       this.milestoneForm.controls[
         "internal_consumption_po"
       ].clearValidators();
       this.milestoneForm.controls[
         "internal_consumption_po"
       ].updateValueAndValidity();
    }
    this.milestoneForm.controls["internal_consumption_po"].setValue(
      false )
      
    this.milestoneForm.controls['provider'].setValue("arrivae")
    this.BillingAdressSetup("");
    console.log(this.tagSnagBoolean())
    this.tagSnagBoolean()
  }
  tagSnagBoolean(){
   return  this.showAndHideSnagOptions.every(Boolean)
  }

  getshipAddressForPO() {
    this.categoryService.getshippingAddressForPO().subscribe((res) => {
      this.address_list = res.po_addresses;
    });
  }

  address_list1;
  getAddress() {
    this.categoryService.getAddressForPO(this.project_id).subscribe(
      (res) => {
        //To be removed after api integration of shipping address
        // this.address_list = [];
        // this.address_list = [
        //   {
        //     label: "Arrivae Store",
        //     contact: "9743258596",
        //     name: "Abhijit BM",
        //     address:
        //       "Arrivae Store, Arrivae Factory Lakhs Modular Furniture,Herohalli Cross, Magadi Main Road, Bangalore 560091",
        //   },
        //   {
        //     label: "Arrivae Warehouse",
        //     contact: "9594126041",
        //     name: "Nikhil Zore",
        //     address:
        //       "Arrivae Warehouse, Boxmyspace, Bldg no. A-6, Gala no 8 to 11,Harihar Compound, Mankoli Naka,Mumbai Nashik Highway, Bhiwandi 421302",
        //   },
        //   {
        //     label: "Bengaluru Warehouse",
        //     contact: "9743258596",
        //     name: "Abhijit BM",
        //     address:
        //       "Bengaluru Warehouse, 88/89, Basement, Muthuraya Swamy Layout, P&T Colony, Telephone Employees Layout, Sunkadakatte, Colony, Telephone Employees Layout,Sunkadakatte,Karnataka 560091",
        //   },
        //   {
        //     label: "Pune Warehouse",
        //     contact: "9594126041",
        //     name: "Nikhil Zore",
        //     address:
        //       "Pune Warehouse, Maharashtra Building Materials & Agro Pvt. Ltd Mumbai-Bengaluru Highway (NH-4), Gat No. - 210/2, Village Kelawade, Dist.Bhor, Pune - 412213",
        //   },
        //   {
        //     label: "ANDHERI EC  (For Hardware and LF)",
        //     contact: "9594126041",
        //     name: "Nikhil Zore",
        //     address:
        //       "ANDHERI EC  (For Hardware and LF), B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 ",
        //   },
        //   {
        //     label: "RAWAT BROTHERS FURNITURE PVT. LTD, (For Raw Material)",
        //     contact: "9130606486",
        //     name: "Laxman",
        //     address:
        //       "RAWAT BROTHERS FURNITURE PVT. LTD, (For Raw Material), Shri Shankar Udyog, Gat No. 486/ 487, Village Kelawade, Tal. Bhor,Pune Bangalore NH4, Dist. Pune - 412213 . GSTIN/UIN: 27AACCR8098J1ZQ",
        //   },
        //   {
        //     label: "Arrivae Bangalore Factory",
        //     contact: "9743258596",
        //     name: "Abhijit BM",
        //     address:
        //       "Arrivae Bangalore Factory, Artiiq Interia, No. 123, Kiadb Industrial Area,1st Phase, Harohalli, Kanakapura, Ramanagara Dist. 562112",
        //   },
        //   {
        //     label: "Vista Modular System",
        //     contact: "8053485454",
        //     name: "Pradeep",
        //     address:
        //       "Vista Modular System, Vista Modular System, Plot No.95 Sector - 4, IMT Manesar, Gurugram, Haryana.",
        //   },
        //   {
        //     label: "Krish Furniture Components",
        //     contact: "9008451673",
        //     name: "Champak",
        //     address:
        //       "Krish Furniture Components, Survey no 28/1,28/2,29/1A,Channenahalli, Tavarekere Hobli,Next to Jana seva vidya kendra,Magadi Main Road, Bangalore- 562130.",
        //   },
        //   {
        //     label: "Flora Interior Solutions",
        //     contact: "9035241661",
        //     name: "Venugopal ",
        //     address:
        //       "Flora Interior Solutions, 534B, 8th Main, Peenya 2nd stage, Bangalore - 560058 Landmark - Near Bhatt Hotel.",
        //   },
        //   {
        //     label: "Futhura Warehouse",
        //     contact: "9743258596",
        //     name: "Abhijith",
        //     address:
        //       "Futhura Warehouse, Plot No.348, Harohalli, Industrial Area, 2nd Phase, Kanakapura Taluk, Ramanagara - 562112",
        //   },
        // ];
        //to be removed
        if (res) {
          this.address_list1 = res;
          for (let i = 0; i < this.address_list1.length; i++) {
            this.address_list.push({
              label: this.address_list1[i].name,
              name: this.address_list1[i].name,
              contact: this.address_list1[i].name,
              address: this.address_list1[i].address,
            });
          }
        }

       
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  showAndHideSnagOptions = []

  toggleItem(event, item, obj,) {
    console.log(item);
    console.log(obj);
    // item.checked = !item.checked;
    item.checked = event.target.checked;
    // this.toggle = this.itemList.every(item => item.checked);
    if (event.target.checked) {
      if (obj.id == this.parentCheckbox_id || this.parentCheckbox_id == -1) {
        obj.checked = true;
        this.parentCheckbox_id = obj.id;
        //
        if (item.job_element_id.length == 1) {
          if (!this.selectedItem.includes(item.job_element_id[0])) {
            this.selectedItem.push(item.job_element_id[0]);
          }
        } else {
          item.job_element_id.forEach((job_id) => {
            if (!this.selectedItem.includes(job_id)) {
              this.selectedItem.push(job_id);
            }
          });
        }
      } else {
        item.checked = false;
        $("#checkItem-" + item.job_element_id).prop("checked", false);

        alert("you already select a PO From another vendor");
      }
    } else {
      this.selectedItem.forEach((element, index) => {
        //
        if (item.job_element_id.length == 1) {
          if (item.job_element_id[0] == element) {
            this.selectedItem.splice(index, 1);
            if (this.selectedItem.length == 0) {
              obj.checked = false;
            }
          }
        } else {
          item.job_element_id.forEach((job_id) => {
            if (job_id == element) {
              this.selectedItem.splice(index, 1);
              if (this.selectedItem.length == 0) {
                obj.checked = false;
              }
            }
          });
        }
      });
      //
      if (this.selectedItem.length <= 0) {
        obj.checked = false;
      }
    }
    //
    if(event.target.checked === true){
      this.showAndHideSnagOptions.push(item.is_snag)
    }else{
      var index = this.showAndHideSnagOptions.indexOf(item.is_snag);
      this.showAndHideSnagOptions.splice(index, 1);
    }
    console.log(this.showAndHideSnagOptions);
  }

  selectAddressBilling = "Saved Billing Addresses";
  setShippingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressBilling = event;

    if (event === "") {
      this.showShipAddress = false;
    

      this.milestoneForm.controls["shipping_address"].patchValue("");
      this.milestoneForm.controls["contact_person"].patchValue("");
      this.milestoneForm.controls["contact_number"].patchValue("");
    } else {
      this.showBillAddress = true;
      for (let i = 0; i < this.address_list.length; i++) {
        if (event == this.address_list[i].title) {
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

    this.mergeAddressesAction(); //this will check if the same shipping and billing address checkbox is selected or not and act accordingly
  }
  selectAddressShipping = "Saved Shipping Addresses";
  setBillingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressShipping = event;

    if (event === "") {
      this.showBillAddress = false;

      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    } else {
      for (let i = 0; i < this.address_list_billing.length; i++) {
        if (event == this.address_list_billing[i].label) {
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

    this.showShipAddress = true;

    // ;
  }
  createPO() {
    $("#CreatePOModal").modal("hide");
    $("#previewModal").modal("show");
  }
  isChecked = false;
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
      this.selectAddressShipping = "";
      this.milestoneForm.controls["saved_billing_address"].patchValue("");
      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    }
    $("#shippingList").prop("selectedIndex", 0);
    /*when the user selects the same billing address as shipping address the drop down of the billing address
      will be set to default  */
  }
  showBillAddress = false;
  showBillingAddress() {
    //toggles the billingAddress forms in the dom
    this.showBillAddress = !this.showBillAddress;
  }

  showShipAddress = false;
  showShippingAddress() {
    //toggles the shippingAddress forms in the dom
    this.showShipAddress = !this.showShipAddress;
  }
  resetForm() {
    this.milestoneForm.reset();
  }
  cancelPurchaseOrder(purchase_order_id) {
    this.loaderService.display(true);
    this.categoryService.cancelPurchaseOrder(purchase_order_id).subscribe(
      (res) => {
        this.successMessageShow("Cancelled successfully!");
        this.getVendors();
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
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
          JSON.parse(res._body).path;
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
  releasePO(id) {
    this.loaderService.display(true);
    this.categoryService.releaseOrder(id).subscribe(
      (res) => {
        this.getVendors();

        this.successMessageShow("Released Successfully !!");
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }
  modifyPO(id) {
    this.loaderService.display(true);
    this.categoryService.modifyOrder(id).subscribe(
      (res) => {
        this.successMessageShow("You can edit SLI.");
        this.getVendors();
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }

  edit_po_id;
  editsPO(data) {
    this.edit_po_id = data.po_details.id;
    this.milestoneeditForm.controls["current_expected_delivery_date"].setValue(
      data.po_details.current_expected_delivery_date
    );
    this.current_expected_delivery_date2 =
      data.po_details.current_expected_delivery_date;
  }

  edited_date;
  finaleditsubmission() {
    this.loaderService.display(true);
    this.categoryService.editOrder(this.edit_po_id, this.edited_date).subscribe(
      (res) => {
        this.successMessageShow(res.message);
        $("#editPOModal").modal("hide");
        this.getVendors();
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }

  releaseModifiedPO(id) {
    this.loaderService.display(true);
    this.categoryService.releaseModifiedOrder(id).subscribe(
      (res) => {
        this.getVendors();

        this.successMessageShow("Released Successfully !!");
        this.loaderService.display(false);
      },
      (err) => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
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
  transportaionCharges: any = "no";
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
  ponagsel2;
  Posnag(e) {
    if (e == "regular") {
      this.milestoneForm.controls["tag_snag"].setValue(false);
      this.milestoneForm.controls["after_sales"].setValue(false);
    } else {
      if (e == "tag_snag") {
        this.milestoneForm.controls["tag_snag"].setValue(true);
        this.milestoneForm.controls["after_sales"].setValue(false);
      } else {
        this.milestoneForm.controls["tag_snag"].setValue(false);
        this.milestoneForm.controls["after_sales"].setValue(true);
      }
    }
  }
  btnTypeForRelease : any
  purchaseorderId: any;
  checkforafterSales :any
  checkfortagsnag:any
  checkforPostHandoverYesNo :any
  Reason_For_handover :any
  releasePO2(e, id, typeofbtn , aftersales , tagsnag, yesNo) {
    this.checkforafterSales = aftersales
    this.checkfortagsnag = tagsnag
    this.checkforPostHandoverYesNo = yesNo
    console.log(this.checkforafterSales , 'after sales value');
    console.log( this.checkfortagsnag , 'tag sag');
    console.log( this.checkforPostHandoverYesNo);

    this.btnTypeForRelease = typeofbtn
    $("#editPOModalTr").modal("show");
    this.purchaseorderId = id;
  }
  resetTR() {
    $("#editPOModalTr").modal("hide");
    $("#reasonposthandover").modal("hide");
    this.TransactionChargesForm.reset();
  }
  sendForApproval(data) {
    let obj = {
      transportation_status: this.transportaionCharges,
      transportation_tax: data.transportation_tax,
      transportation_charges: data.transportation_charges,
      transportation_tax_type: data.transportation_tax_type,
      remark : this.Reason_For_handover
    };

    console.log(obj);
    
    this.loaderService.display(true);
    this.categoryService.SendForApproval(this.purchaseorderId, obj).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.resetTR();
        this.getVendors();
        this.Reason_For_handover = ''
        this.successMessageShow(res.message);
         
      },
      (err) => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  handover_reason_with_data :any
  isDisabled : boolean = false
  checkinghandover(data){
    //  after-sales --true --- no pop 
    // tag_snag -- true -- show pop 
    // if above both are false --- show pop up

    // show pop up // // // //////////      //hide

    //after sales -- false      false       true 
    //tag_snag -- false         true        false

    let yesorNo  = this.checkforPostHandoverYesNo == 'Yes' ? true : false
    if(yesorNo){
      if((!this.checkforafterSales && !this.checkfortagsnag)){
      $("#reasonposthandover").modal("show");
      $("#editPOModalTr").modal("hide");
      this.handover_reason_with_data = data
      this.isDisabled = true
      }else if(!this.checkforafterSales &&  this.checkfortagsnag){
        console.log('show pop');
          this.isDisabled = true
          $("#reasonposthandover").modal("show");
          $("#editPOModalTr").modal("hide");
          this.handover_reason_with_data = data
      }else {
        console.log('hide pop');
        this.sendForApproval(data)
      }
    }else {
      this.sendForApproval(data)
    }    
  }

  sendapprovalwithreason(){
    this.sendForApproval(this.handover_reason_with_data)
  }
  closePostHandover(){
    this.Reason_For_handover = ''
  }

  BillingAdressSetup(e){
    this.selectAddressBilling ='Saved Billing Addresses'
    this.showShipAddress = false;

    if(this.milestoneForm.controls["saved_shipping_address"].value == ''){
      this.showBillAddress = false;
    } else{

    }
    this.showBillAddress = true;
   
    this.milestoneForm.controls["saved_billing_address"].patchValue("");
    this.milestoneForm.controls["billing_address"].patchValue("");
    this.milestoneForm.controls["billing_contact_person"].patchValue("");
    this.milestoneForm.controls["billing_contact_number"].patchValue("");
    this.milestoneForm.controls["saved_shipping_address"].patchValue("");
    this.milestoneForm.controls["shipping_address"].patchValue("");
    this.milestoneForm.controls["contact_person"].patchValue("");
    this.milestoneForm.controls["contact_number"].patchValue("");
  
    $("#shippingList").prop("selectedIndex", 0);
    if(e == 'aide'){
      this.selectAddressBilling ='';
    
      this.address_list_billing = [
        {
          label: "ALPL",
          contact: "",
          name: "",
          address: `ARRIVAE LIFESTYLE PRIVATE LIMITED, NO 288, 3Rd Floor, 100 Feet Ring Road, Banashankari Third Stage, Bengaluru, Karnataka-560085, GST Number: 29ABBCS6086R1ZC`,
        },
        
        {
          label: "AIDE Karnataka",
          contact: "",
          name: "",
          address: `AIDE TECHNOLOGIES PVT LTD, 5th Floor, Umiya Business Bay, Tower 2, Cessna Business Park, Varthur Hobli, Outer Ring Road, Kadubeesanahalli, Bengaluru(Bangalore) Urban, Karnataka, 560037`,
        },
        {
          label: "AIDE Maharashtra",
          contact: "",
          name: "",
          address: `AIDE TECHNOLOGIES PVT LTD, B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093`,
        },
        {
          label: "AIDE Telangana",
          contact: "",
          name: "",
          address: `AIDE TECHNOLOGIES PVT LTD, 5th floor, Survey No. 8, Purva Summit, Kondapur Village, Whitefield Road, Opposite Tech Mahindra, Hi-Tech City, Phase-II, Hyderabad, Telangana, 500081`        
        },
        {
          label: "AIDE Tamil Nadu",
          contact: "",
          name: "",
          address: `AIDE TECHNOLOGIES PVT LTD, 26B, Bharati Villas Jawaharlal Nehru Salai, Ekkaduthangal, Guindy Industrial Estate, Chennai, Chennai, Tamil Nadu, 600032`,
        },
        {
          label: "AIDE West Bengal",
          contact: "",
          name: "",
          address: `AIDE TECHNOLOGIES PVT LTD, 5, Dharamtolla Street, Kolkata, West Bengal, 700013`,
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
          label: "AIDE Delhi",
          contact: "",
          name: "",
          address: `Singularity Furniture Private Limited,1st floor,Unit no.F-04& F-05,Trillium Avenue,Sector-29,Gurugram,Gurugram,Haryana 122009,GST Number: 06AAECP3450G1ZN`,
        },
      ];
    } else {
      this.selectAddressBilling ='Saved Billing Addresses'
       this.address_list_billing = [
      {
        label: "ALPL",
        contact: "",
        name: "",
        address: `ARRIVAE LIFESTYLE PRIVATE LIMITED, NO 288, 3Rd Floor, 100 Feet Ring Road, Banashankari Third Stage, Bengaluru, Karnataka-560085, GST Number: 29ABBCS6086R1ZC`,
      },
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
    }
    this.showBillAddress = false;

   

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

  fetchdynamicmap(id){
    this.loaderService.display(true);
    this.leadService.fetchdynamicmap(id).subscribe(res =>{
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
    this.leadService.mapitem(this.dynamicdetails['id'],this.item_id).subscribe(
      (res) =>{
      if(res.message){
      $("#viewDynamicmapping2").modal("hide");
      this.successMessageShow(res.message);
      // this.GetProductList('')
      }
    },
    (err)=>{
      this.loaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      $("#viewDynamicmapping2").modal("hide");
      // this.GetProductList('')

    })

  }

  createchilditem(id){
    this.loaderService.display(true);
    this.leadService.createchilditem(id).subscribe((res) =>{
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

    this.leadService.FetchZohomap(Param).subscribe(res=>{
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
  manualmappo(id,i){

    this.zohoitemChecker.push(i);
  
    }
  zoho_ID:any
  mapclick(id){


    let Obj = {

      'zoho_organization_id' : id,
      'zoho_item_id' : $("#ZohoID"+id).val(),
      'sku'  : this.SkuSaved
    }

  this.loaderService.display(true);

    this.leadService.ManualZohomap(Obj).subscribe(res=>{
      this.loaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.getDataforZOHOmap(this.SkuSaved);
      this.getVendors();
     
     
       
    },
    (err) => {
      this.loaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

  }
  mapclickPO(id,sku,i){



    let Obj = {

      'zoho_organization_id' : id,
      'zoho_item_id' : $("#ZohoID"+sku).val(),
      'sku'  : sku
    }

  this.loaderService.display(true);

    this.leadService.ManualZohomap(Obj).subscribe(res=>{
      this.loaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.ZoHoDataPo.data[i].zoho_item_id = res.zoho_item_id;
      this.getVendors();
     
       
    },
    (err) => {
      this.loaderService.display(false);

      this.errorMessageShow(JSON.parse(err['_body']).message);
     
      
    })

  }
  automaticmap(id){
    this.loaderService.display(true);
    let Obj = {

      'zoho_organization_id' : id,
      'sku'  : this.SkuSaved
    }
    this.leadService.AutoZohomap(Obj).subscribe(res=>{
      this.loaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.getDataforZOHOmap(this.SkuSaved);
      this.getVendors();
     
     
       
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
    this.leadService.AutoZohomap(Obj).subscribe(res=>{
      this.loaderService.display(false);

      this.successMessageShow("Mapped Successfully");
      this.ZoHoDataPo.data[i].zoho_item_id = res.zoho_item_id;
     
      this.getVendors();
     
     
       
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


  
  // createchilditem(id){
  //   this.LoaderService.display(true);
  //   this.LeadService.createchilditem(id).subscribe((res) =>{
  //     this.LoaderService.display(false);
  //     $("#viewDynamicmapping2").modal("hide");
  //   },
  //   (err)=>{
  //     this.LoaderService.display(false);
  //     $("#viewDynamicmapping2").modal("hide");
  //   }

  //   );
  //   this.GetProductList('')
  // }

}
