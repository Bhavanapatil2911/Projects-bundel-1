import { Component, OnInit } from "@angular/core";
import { LeadService } from "app/platform/lead/lead.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from "@angular/forms";
import { LoaderService } from "app/services/loader.service";
import { CategoryService } from "../category.service";

declare var $: any;

@Component({
  selector: "app-category-hierachy",
  templateUrl: "./category-hierachy.component.html",
  styleUrls: ["./category-hierachy.component.css"],
  providers: [LeadService, CategoryService],
})
export class CategoryHierachyComponent implements OnInit {
  itemsShow: any;

  CreateLOBForm: FormGroup;
  CreateDepartmentForm: FormGroup;
  CreateSubDepartmentForm: FormGroup;
  CreateClass1Form: FormGroup;
  CreateBrandCodeForm:FormGroup;

  CreateSubClassForm: FormGroup;
  CreateMaterialCodeForm: FormGroup;
  EditLOBForm: FormGroup;
  EditDepartmentForm: FormGroup;
  EditSubDepartmentForm: FormGroup;
  EditClass1Form: FormGroup;

  EditSubClassForm: FormGroup;
  EditMaterialCodeForm: FormGroup;
  ProductTypeForm: FormGroup;
  ProductChildTypeForm: FormGroup;
  ProductVendorForm: FormGroup;
  AddSliForm: FormGroup;
  VendorProductEditForm: FormGroup;
  role:any;
  wordCount: any;

  constructor(
    private formBuilder: FormBuilder,
    private LeadService: LeadService,
    private LoaderService: LoaderService,
    private CategoryService: CategoryService
  ) {}

  ngOnInit() {
    this.creatingFOrms();
    this.getlistItems();
    this.getUOMList();
    this.GetProductList("");
    this.getVendorList();
    this.setSelectBoxvalues();
    this.getBrandsList();
    this.listOfslicats();
    this.getCategorysForWarhouse()
    this.itemsShow = "MaterialCode";
  }
  creatingFOrms() {
    this.CreateLOBForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      lob_code: new FormControl("", [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
      sli_category: new FormControl("", Validators.required),
    });
    this.CreateBrandCodeForm= this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      code: new FormControl("", [Validators.required,Validators.minLength(3),Validators.maxLength(3)]),
    });
    this.CreateDepartmentForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      depart_code: new FormControl("", [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
    });
    this.CreateSubDepartmentForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      sub_depart_code: new FormControl("", [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
    });
    this.CreateClass1Form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      class_code: new FormControl("", [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
    });
    this.CreateSubClassForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      category_class_id: new FormControl("", Validators.required),
      sub_class_code: new FormControl("", [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
    });
    this.CreateMaterialCodeForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("",Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      category_class_id: new FormControl("", Validators.required),
      category_subclass_id: new FormControl("", Validators.required),
      mc_code: new FormControl("", [Validators.required,Validators.minLength(3),Validators.maxLength(3)]),
    });
    this.EditLOBForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      lob_code: new FormControl("", Validators.required),
    });
    this.EditDepartmentForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      depart_code: new FormControl("", Validators.required),
    });
    this.EditSubDepartmentForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      sub_depart_code: new FormControl("", Validators.required),
    });
    this.EditClass1Form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      class_code: new FormControl("", Validators.required),
    });
    this.EditSubClassForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      category_class_id: new FormControl("", Validators.required),
      sub_class_code: new FormControl("", Validators.required),
    });
    this.EditMaterialCodeForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      category_class_id: new FormControl("", Validators.required),
      category_subclass_id: new FormControl("", Validators.required),
      mc_code: new FormControl("", Validators.required),
    });
    this.ProductChildTypeForm = this.formBuilder.group({
      item_name: new FormControl("", Validators.required),
      master_line_item_id: new FormControl(""),
      brand_code: new FormControl(""),
      // sku: new FormControl("", Validators.required),
      brand_id: new FormControl("", Validators.required),
      tax: new FormControl(""),
      sales_price : new FormControl(""),
      product_description:new FormControl(""),
      sli_dynamic_attributes_attributes: this.formBuilder.array([
        this.buildItem2(),
      ]),
    });
    this.ProductVendorForm = this.formBuilder.group({
      childsku: new FormControl(""),
      vendorName: new FormControl("", Validators.required),
      vendorCode: new FormControl("", Validators.required),
      ItemCost: new FormControl("", Validators.required),
      priority: new FormControl(false, Validators.required),
      child_line_item_id: new FormControl("", Validators.required),
    });
    this.ProductTypeForm = this.formBuilder.group({
      mli_name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      category_class_id: new FormControl("", Validators.required),
      category_subclass_id: new FormControl("", Validators.required),
      category_material_code_id: new FormControl("", Validators.required),
      zoho_category_id:new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_percent: new FormControl("", Validators.required),
      mli_type: new FormControl("2021"),
      sku_code: new FormControl(""),
      warranty:new FormControl(0),
      lead_time:new FormControl(0),
      is_customizable:new FormControl(false),
      formula:new FormControl(''),
      mli_attributes_attributes: this.formBuilder.array([]),
      customization_attributes: this.formBuilder.array([])
    });
    this.AddSliForm = this.formBuilder.group({
      quantity: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      specs: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      cli_id: new FormControl(""),
    });
    this.VendorProductEditForm = this.formBuilder.group({
      ItemCost: new FormControl("", Validators.required),
      priority: new FormControl("", Validators.required),
      child_line_item_id: new FormControl("", Validators.required),
      VendorId: new FormControl("", Validators.required),
      VendorCode: new FormControl("", Validators.required),
    });

    this.createProForm();
    this.role = localStorage.getItem('user')

  }
  resetForms() {
    this.CreateLOBForm.reset();
    this.CreateDepartmentForm.reset();
    this.CreateSubDepartmentForm.reset();
  }
  createProForm() {
    this.ProductTypeForm = this.formBuilder.group({
      mli_name: new FormControl("", Validators.required),
      category_lob_id: new FormControl("", Validators.required),
      category_department_id: new FormControl("", Validators.required),
      category_sub_department_id: new FormControl("", Validators.required),
      category_class_id: new FormControl("", Validators.required),
      category_subclass_id: new FormControl("", Validators.required),
      category_material_code_id: new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_percent: new FormControl("", Validators.required),
      mli_type: new FormControl("2021"),
      zoho_category_id:new FormControl("", Validators.required),
      sku_code: new FormControl(""),
      is_customizable:new FormControl(false),
      warranty:new FormControl(0),
      lead_time:new FormControl(0),
      formula:new FormControl(''),
      mli_attributes_attributes: this.formBuilder.array([]),
      customization_attributes: this.formBuilder.array([])
    });
  }

  buildItem() {
    return new FormGroup({
      attr_name: new FormControl("", Validators.required),
      required: new FormControl(false, Validators.required),
      attr_type: new FormControl("", Validators.required),
      attr_data_type: new FormControl("string"),
      id: new FormControl(""),
      is_customizable:new FormControl('no'),
      dropdown_options: new FormControl([]),
    });
  }
  buildItemcust() {
    return new FormGroup({
      attr_name: new FormControl("cus_", Validators.required),
      required: new FormControl(false, Validators.required),
      attr_type: new FormControl("", Validators.required),
      attr_data_type: new FormControl("string"),
      id: new FormControl(""),
      is_customizable:new FormControl('yes'),
      dropdown_options: new FormControl([]),
    });
  }

  buildItem2() {
    return new FormGroup({
      attr_value: new FormControl("", Validators.required),
      id: new FormControl(""),
      mli_attribute_name: new FormControl(""),
      mli_attribute_id: new FormControl(""),
      mli_attribute_type: new FormControl(""),
      mli_attribute_value: new FormControl(""),
      mli_attribute_required: new FormControl(""),
    });
  }

  pushAttributes(product) {
    return product.get("mli_attributes_attributes").push(this.buildItem());
  }
  pushAttributescust(product) {
    return product.get("customization_attributes").push(this.buildItemcust());
  }
  pushAttributeschild(product) {
    return product
      .get("sli_dynamic_attributes_attributes")
      .push(this.buildItem2());
  }
  getAttributes(product) {
    return product.get("mli_attributes_attributes").controls;
  }
  getAttributescust(product) {
    return product.get("customization_attributes").controls;
  }
  getAttributeschild(product) {
    return product.get("sli_dynamic_attributes_attributes").controls;
  }

  erroralert: any;
  errorMessage: any;
  successalert;
  successMessage;
  SearchString: any = "";
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
      4000
    );
  }
  getlistItems() {
    this.getClassList();
    this.getLOBSList();
    this.getDepartmentList();
    this.getMaterialList();
    this.getSubClassList();
    this.getSubDepartmentsList();
    this.getBrandsList();
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
  cardHeight:any= '700px';
  btn1Color:any=''
  btn2Color:any=''
  btn3Color:any=''
  btn4Color:any=''
  btn5Color:any=''
  btn6Color:any='#8f1e21'
  lineHeight:any='650px'
  showitems(e) {
    if(e=='LOB'){
      this.lineHeight='405px'
      this.cardHeight='455px';
      this.btn1Color='#8f1e21'
      this.btn2Color=''
      this.btn3Color=''
      this.btn4Color=''
      this.btn5Color=''
      this.btn6Color=''
      this.btn7Color=''
    }else if(e=='Department'){
      this.lineHeight='405px'
      this.btn1Color=''
      this.btn2Color='#8f1e21'
      this.btn3Color=''
      this.btn4Color=''
      this.btn5Color=''
      this.btn6Color=''
      this.btn7Color=''
      this.cardHeight='455px';
    }else if(e=='SubDepartment'){
      this.lineHeight='430px'
      this.cardHeight='480px'
      this.btn1Color=''
      this.btn2Color=''
      this.btn3Color='#8f1e21'
      this.btn4Color=''
      this.btn5Color=''
      this.btn6Color=''
      this.btn7Color=''
    }else if(e=='Class1'){
      this.lineHeight='500px'
      this.cardHeight='550px'
      this.btn1Color=''
      this.btn2Color=''
      this.btn3Color=''
      this.btn4Color='#8f1e21'
      this.btn5Color=''
      this.btn6Color=''
      this.btn7Color=''
    }else if(e=='SubClass'){
      this.lineHeight='600px'
      this.cardHeight='650px'
      this.btn1Color=''
      this.btn2Color=''
      this.btn3Color=''
      this.btn4Color=''
      this.btn5Color='#8f1e21'
      this.btn6Color=''
      this.btn7Color=''
    }else if(e=='MaterialCode'){
      this.lineHeight='650px'
      this.cardHeight='700px'
      this.btn1Color=''
      this.btn2Color=''
      this.btn3Color=''
      this.btn4Color=''
      this.btn5Color=''
      this.btn7Color=''
      this.btn6Color='#8f1e21'
    } else if(e == 'BrandCode'){
      this.lineHeight='405px'
      this.cardHeight='455px';
      this.btn1Color=''
      this.btn2Color=''
      this.btn3Color=''
      this.btn4Color=''
      this.btn5Color=''
      this.btn6Color=''
      this.btn7Color = '#8f1e21'
    }
  
  
    this.itemsShow = e;
    this.resetForms();
    this.creatingFOrms();
    this.DepartmentListFilter = [];
    this.SubDepartmentFilter = [];
    this.ClassesFilter = [];
    this.SubClassesFilter = [];
  }
  btn7Color:any;

  setSelectBoxvalues() {
    this.LOBDefault = "";
    this.departDefault = "";
    this.subdepartDefault = "";
    this.classDefault = "";
    this.subclassDefault = "";
    this.matcodeDefault = "";
  }
  DepartmentListFilter;
  SubDepartmentFilter;
  ClassesFilter: any;
  SubClassesFilter: any;
  getLOBSList() {
    this.LeadService.getAllLOBS().subscribe((res) => {
      this.LOBlist = res.category_lobs;
    });
  }
  dep_id;
  Sub_dep_id: any;
  getDepartmentListFilter(e) {
    this.LoaderService.display(true);
    this.dep_id = e;
    this.CreateSubDepartmentForm.controls["category_department_id"].setValue(
      ""
    );

    this.CreateClass1Form.controls["category_department_id"].setValue("");
    this.CreateSubClassForm.controls["category_department_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_department_id"].setValue("");

    this.CreateClass1Form.controls["category_sub_department_id"].setValue("");
    this.CreateSubClassForm.controls["category_sub_department_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_sub_department_id"].setValue(
      ""
    );

    this.CreateSubClassForm.controls["category_class_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_class_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_subclass_id"].setValue("");

    this.ProductTypeForm.controls["category_department_id"].setValue("");
    this.ProductTypeForm.controls["category_sub_department_id"].setValue("");
    this.ProductTypeForm.controls["category_class_id"].setValue("");
    this.ProductTypeForm.controls["category_subclass_id"].setValue("");
    this.ProductTypeForm.controls["category_material_code_id"].setValue("");

    this.EditSubDepartmentForm.controls["category_department_id"].setValue("");
    this.EditSubDepartmentForm.controls["category_department_id"].setValue("");
    this.EditClass1Form.controls["category_department_id"].setValue("");
    this.EditSubClassForm.controls["category_department_id"].setValue("");
    this.EditMaterialCodeForm.controls["category_department_id"].setValue("");

    this.LeadService.getAllDeapartmentsfilter(e).subscribe((res) => {
      this.LoaderService.display(false);
      let temArray = [];
      if(res.category_departments.length > 0){
        temArray = res.category_departments.filter((res:any) => {
          return res.name != 'Layout' &&
                  res.name != 'Semi Finished Goods' &&
                  res.name != 'Finished Goods'
        })
      }
      this.DepartmentListFilter = temArray;
      this.SubDepartmentFilter = [];
      this.ClassesFilter = [];
      this.SubClassesFilter = [];
      this.MaterialCodeFilter = [];
    });
  }
  departname
  getSubDepartmentsListFilter(e) {

     let Department =  this.DepartmentListFilter.filter(el=>{
      return e == el.id
     })
     this.departname = Department.length > 0 ? Department[0].name:''
     this.departname =  this.departname.toLowerCase();

     console.log(this.departname)

    this.LoaderService.display(true);
    this.Sub_dep_id = e;
    if (this.departname === 'nova') {
      this.ProductTypeForm.controls["warranty"].setValidators(Validators.required);
      this.ProductTypeForm.controls["lead_time"].setValidators(Validators.required);
    } else {
      this.ProductTypeForm.controls["warranty"].clearValidators();
      this.ProductTypeForm.controls["warranty"].updateValueAndValidity(); // to trigger revalidation
      this.ProductTypeForm.controls["lead_time"].clearValidators();
      this.ProductTypeForm.controls["lead_time"].updateValueAndValidity(); // to trigger revalidation
    }
    

    this.CreateClass1Form.controls["category_sub_department_id"].setValue("");
    this.CreateSubClassForm.controls["category_sub_department_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_sub_department_id"].setValue(
      ""
    );
    this.CreateSubClassForm.controls["category_sub_department_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_class_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_subclass_id"].setValue("");
    this.CreateClass1Form.controls["category_sub_department_id"].setValue("");
    this.EditClass1Form.controls["category_sub_department_id"].setValue("");
    this.EditSubClassForm.controls["category_sub_department_id"].setValue("");
    this.EditMaterialCodeForm.controls["category_sub_department_id"].setValue(
      ""
    );
    this.CreateSubClassForm.controls["category_class_id"].setValue("");
    this.ProductTypeForm.controls["category_sub_department_id"].setValue("");
    this.ProductTypeForm.controls["category_class_id"].setValue("");
    this.ProductTypeForm.controls["category_subclass_id"].setValue("");
    this.ProductTypeForm.controls["category_material_code_id"].setValue("");

    this.LeadService.getAllSubDeapartmentsFilter(this.dep_id, e).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.SubDepartmentFilter = res.category_sub_departments;
        this.ClassesFilter = [];
        this.SubClassesFilter = [];
        this.MaterialCodeFilter = [];
      }
    );
  }
  MaterialCodeFilter;
  getMaterialCodeFilter(e) {
    this.LoaderService.display(true);
    this.ProductTypeForm.controls["category_material_code_id"].setValue("");
    this.LeadService.getAllMaterialFilter(
      this.dep_id,
      this.Sub_dep_id,
      this.class_id,
      this.SubClass_Id,
      e
    ).subscribe((res) => {
      this.LoaderService.display(false);
      this.MaterialCodeFilter = res.category_material_codes;
    });
  }
  class_id: any;
  getClassListFilter(e) {
    this.LoaderService.display(true);
    this.class_id = e;
    console.log(this.class_id);
    this.CreateSubClassForm.controls["category_class_id"].setValue("");
    this.CreateMaterialCodeForm.controls["category_class_id"].setValue("");
    this.EditSubClassForm.controls["category_class_id"].setValue("");
    this.EditMaterialCodeForm.controls["category_class_id"].setValue("");
    this.ProductTypeForm.controls["category_class_id"].setValue("");
    this.ProductTypeForm.controls["category_subclass_id"].setValue("");
    this.ProductTypeForm.controls["category_material_code_id"].setValue("");

    this.LeadService.getAllClassFilters(
      this.dep_id,
      this.Sub_dep_id,
      e
    ).subscribe((res) => {
      this.ClassesFilter = res.category_classes;
      this.SubClassesFilter = [];
      this.MaterialCodeFilter = [];
      this.LoaderService.display(false);
    });
  }
  SubClass_Id;
  getSubClassListFilter(e) {
    this.LoaderService.display(true);
    this.SubClass_Id = e;
    this.CreateMaterialCodeForm.controls["category_subclass_id"].setValue("");
    this.EditMaterialCodeForm.controls["category_subclass_id"].setValue("");
    this.ProductTypeForm.controls["category_subclass_id"].setValue("");
    this.ProductTypeForm.controls["category_material_code_id"].setValue("");
    this.LeadService.getAllSubClassFilters(
      this.dep_id,
      this.Sub_dep_id,
      this.class_id,
      e
    ).subscribe((res) => {
      this.LoaderService.display(false);
      this.SubClassesFilter = res.category_subclasses;
      this.MaterialCodeFilter = [];
    });
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
  createLOB() {
    this.LoaderService.display(true);
    this.LeadService.createLOB(this.CreateLOBForm.value).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Created Successfully");
        this.getlistItems();
        this.CreateLOBForm.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
      }
    );
  }
  createDepartment() {
    this.LoaderService.display(true);
    this.LeadService.createDepartment(
      this.CreateDepartmentForm.value
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("Department Created Successfully");
        this.getlistItems();
        this.CreateDepartmentForm.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
      }
    );
  }
  createSubDepartment() {
    this.LoaderService.display(true);
    this.LeadService.createSubDepartment(
      this.CreateSubDepartmentForm.value
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow(" SUB Department Created Successfully");
        this.getlistItems();
        this.CreateSubDepartmentForm.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
      }
    );
  }
  createClass() {
    this.LoaderService.display(true);
    this.LeadService.createClass(this.CreateClass1Form.value).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow(" Class Created Successfully");
        this.getlistItems();
        this.CreateClass1Form.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
      }
    );
  }
  createSubClass() {
    this.LoaderService.display(true);
    this.LeadService.createSubClass(this.CreateSubClassForm.value).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow(" Sub Class Created Successfully");
        this.getlistItems();
        this.CreateSubClassForm.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
      }
    );
  }
  creatematcode() {
    this.LoaderService.display(true);
    this.LeadService.createMaterial(
      this.CreateMaterialCodeForm.value
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow(" Material Code Created Successfully");
        this.getlistItems();
        this.CreateMaterialCodeForm.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
      }
    );
  }
  getQuoteModalHideBs() {
    $("#getQuoteModalHeader").on("hide.bs.modal", function () {
      if (
        $("#get-quote-container-header").hasClass(
          "get-quote-container-header-show"
        )
      ) {
        $("#get-quote-container-header").removeClass(
          "get-quote-container-header-show"
        );
        $("#get-quote-container-header").modal("hide");
      } else {
        $("#get-quote-container-header").addClass(
          "get-quote-container-header-show"
        );
      }
    });
  }
  expansion: any = "hir";
  getQuoteContainer() { 
    console.log("hi");
    $("#getQuoteModalHeader").modal("show");
    $("#get-quote-container-header").addClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();

    $(".get-quote-wrapper").animate({
      width: "toggle",
    });
    this.creatingFOrms();
    this.productTypesel = "numberone";
    this.editOrCreateValidator = "";
    this.departname = ''
  }
  getQuoteContainerquit() {
    $("#getQuoteModalHeader").modal("hide");
    $("#get-quote-container-header").removeClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();
    this.DepartmentListFilter = [];
    this.SubDepartmentFilter = [];
    this.ClassesFilter = [];
    this.SubClassesFilter = [];
  }
  skuProduct: any;
  openVendorPanel() {
    $("#getQuoteModalHeader2").modal("show");
    $("#get-quote-container-header2").addClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();

    $(".get-quote-wrapper").animate({
      width: "toggle",
    });
  }
  ItemParent
  getQuoteContainer2(e, e2,pro) {
    this.ItemParent = pro;
    console.log(e, e2);
    this.openVendorPanel();
    this.creatingFOrms();
    this.productTypeselchild = "numberonechild";
    this.skuProduct = e;
    this.ProductChildTypeForm.controls["master_line_item_id"].setValue(e2);
    this.EditOrCreateForChild = "";
    this.base64Images = [];
    this.imageFeatured = null;
    this.wordCount =0
  }
  getQuoteContainerquit2() {
    $("#getQuoteModalHeader2").modal("hide");
    $("#get-quote-container-header2").removeClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();
    this.getChilditemListWithoutErrorLoader(
      this.masterLineItemId,
      this.current_page2
    );
  }
  productTypesel: any = "numberone";
  productSet(e ,prev?) {
    this.productTypesel = e;
    this.finalValue = null
    if(prev){
      if(this.editOrCreateValidator != 'edit' ){

        this.ProductTypeForm.controls['formula'].setValue('')
  
      } else{
        this.ProductTypeForm.controls['formula'].setValue(this.Formula)
      }
    }
   
  }
  uom_list = [];

  getUOMList() {
    this.uom_list = [];
    this.CategoryService.getUOMList().subscribe(
      (res) => {
        this.uom_list = res;
      },
      (error) => {}
    );
  }
  productSetchild(e) {
    this.productTypeselchild = e;
  }
  ChildEditorCreate: any = "";
  SubmitPROcode(data2) {
    console.log(data2);
    if (data2.mli_attributes_attributes.length > 0) {
      for (var i = 0; i < data2.mli_attributes_attributes.length; i++) {
        console.log(data2.mli_attributes_attributes[i].dropdown_options);
        if (
          Array.isArray(data2.mli_attributes_attributes[i].dropdown_options) ==
          false
        ) {
          data2.mli_attributes_attributes[i].dropdown_options =
            data2.mli_attributes_attributes[i].dropdown_options.split(",");
          if (data2.mli_attributes_attributes[i].dropdown_options.length == 0) {
            this.errorMessageShow(
              "Please give dropdown options properly with comma seperated"
            );
          }
        }
      }
    }

    let data = {
      master_line_item: data2,
    };

    this.LoaderService.display(true);
    this.LeadService.createProduct(data).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("Product Created Successfully");
        this.ProductTypeForm.reset();
        this.createProForm();
        this.productTypesel = "numberone";
        this.GetProductList(this.current_page);
        this.getQuoteContainerquit();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  validatorofForm() {
    if (
      this.ProductTypeForm.controls["mli_name"].valid &&
      this.ProductTypeForm.controls["category_lob_id"].valid &&
      this.ProductTypeForm.controls["category_department_id"].valid &&
      this.ProductTypeForm.controls["category_sub_department_id"].valid &&
      this.ProductTypeForm.controls["category_class_id"].valid &&
      this.ProductTypeForm.controls["category_subclass_id"].valid &&
      this.ProductTypeForm.controls["category_material_code_id"].valid &&
      this.ProductTypeForm.controls["unit"].valid &&
      this.ProductTypeForm.controls["tax_percent"].valid && 
      this.ProductTypeForm.controls["zoho_category_id"].valid
    ) {
      return false;
    } else {
      return true;
    }
  }
  headers_res;
  per_page = 10;
  total_page;
  current_page;
  ListOfProduct: any = [];
  GetProductList(e) {
    e = e ? e : "";
    let string = this.SearchString;
    this.LoaderService.display(true);
    this.LeadService.ListOfPRoduct(e, string,this.selectType ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();
        this.ListOfProduct = res.master_line_items;
        this.getChilditemListWithoutError(this.masterLineItemId,"")
      },
      (err) => {
        this.LoaderService.display(false);
        this.ListOfProduct = [];
      }
    );
  }
  headers_res2;
  per_page2 = 10;
  total_page2;
  current_page2;
  ListOfProduct2: any = [];
  GetProductList2(e) {
    e = e ? e : "";
  }
  productTypeselchild: any = "numberonechild";
  row: any = [""];
  masterSKU;
  masterLineItemId;
  masterLinteItem: any;
  toggleRow(pro, i) {
    console.log("hi");
    console.log(this.row[0], pro.id);
    if (this.row[0] !== pro.id) {
      this.expansion = pro.id;
      this.row[0] = pro.id;
      this.getChilditemList(pro.id, "");
      this.masterSKU = pro.sku_code;
      this.masterLineItemId = pro.id;
      this.masterLinteItem = pro;
    } else {
      this.row[0] = "";
      this.expansion = "";
    }
  }
  VendorList: any;
  ChildListPRo: any = [];
  QuotationItem = false;
  getChilditemList(id, e) {
    e = e ? e : "";
    let string = this.search_type == 'parent'?"":this.SearchString;
    console.log(string,this.search_type);
    this.LoaderService.display(true);
    this.LeadService.ListOfChilds(id, e,string,this.selectType,this.QuotationItem).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        res = res.json();

        this.ChildListPRo = res.child_line_items;
        if (this.ChildListPRo.length == 0) {
          this.errorMessageShow("No child item present for this Master Item");
          this.expansion = "";
          this.row[0] = "";
        }
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  getChilditemListWithoutError(id, e) {

    e = e ? e : "";
    id = id?id:"";
    let string = this.search_type == 'parent'?"":this.SearchString;
    console.log(string,this.search_type);
    this.LoaderService.display(true);
    this.LeadService.ListOfChilds(id, e,string,this.selectType,this.QuotationItem).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        res = res.json();

        this.ChildListPRo = res.child_line_items;
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  getChilditemListWithoutErrorLoader(id, e) {

    e = e ? e : "";
    id = id?id:"";
    let string = this.search_type == 'parent'?"":this.SearchString;
    console.log(string,this.search_type);
    
    this.LeadService.ListOfChilds(id, e,string,this.selectType,this.QuotationItem).subscribe(
      (res) => {
        
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        res = res.json();

        this.ChildListPRo = res.child_line_items;
      },
      (err) => {
       
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  getVendorList() {
    this.LeadService.ListOfVendors().subscribe((res) => {
      console.log(res);
      this.VendorList = res.vendors;
      console.log(this.VendorList);
    });
  }
  childItemId;
  ChildSku;
  submitchildpro() {
    this.LoaderService.display(true);
    if(this.base64Images.length == 1 && !this.imageFeatured ){
      this.imageFeatured = this.base64Images[0];
    }
    this.LeadService.createProductchild(
      this.ProductChildTypeForm.value,this.base64Images,this.imageFeatured
    ).subscribe(
      (res) => {
        console.log(res);
        this.LoaderService.display(false);
        this.ProductChildTypeForm.reset();
        this.base64Images = [];
        this.imageFeatured = null;
        this.creatingFOrms();
        this.successMessageShow("Child Item Created Successfully");
        this.ProductVendorForm.controls["childsku"].setValue(
          res.child_line_item.item_name
        );
        this.ProductVendorForm.controls["child_line_item_id"].setValue(
          res.child_line_item.id
        );
        this.childItemId = res.child_line_item.id;
        this.ChildSku = res.child_line_item.item_name;
        this.GetProductList(this.current_page);
        this.getChilditemListWithoutError(
          this.masterLineItemId,
          this.current_page2
        );
        this.productTypeselchild = "numbertwochild";
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  SubmitPROcodevendor() {
    console.log(this.childOfmas);
    if (this.ProductVendorForm.controls["priority"].value == true) {
      this.CheckingPriorityEndpoint(this.childItemId);
    } else {
      this.LoaderService.display(true);
      this.LeadService.CreateVendorType(this.ProductVendorForm.value).subscribe(
        (res) => {
          console.log(res);
          this.LoaderService.display(false);
          if (res.message) {
            this.successMessageShow(res.message);
          } else {
            this.successMessageShow("Vendor product Created successfully");
          }

          this.ProductVendorForm.reset();
          this.creatingFOrms();

          this.GetProductList(this.current_page);
          this.getQuoteContainerquit2();

          this.getChilditemListWithoutError(
            this.masterLineItemId,
            this.current_page2
          );

          this.ViewVendor2(this.childOfmas);

          this.ProductVendorForm.controls["child_line_item_id"].setValue(
            this.childItemId
          );
          this.ProductVendorForm.controls["childsku"].setValue(this.ChildSku);
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
  vendorViewListforRevise = [];

  addVendorToChild(id, sku) {
    this.ProductVendorForm.controls["child_line_item_id"].setValue(id);
    this.ProductVendorForm.controls["childsku"].setValue(sku);
    this.openVendorPanel();
    this.productTypeselchild = "numbertwochild";
    this.childItemId = id;
    this.ChildSku = sku;
  }
  vendorViewList: any = [];
  childofCat: any;
  childOfmas;
  ViewVendor(child) {
    this.childOfmas = child;
    if (child.id) {
      this.LoaderService.display(true);
      this.LeadService.getVendorsForchild(child.id).subscribe(
        (res) => {
          console.log(res);
          this.vendorViewList = res.vendor_products;
          this.childofCat = child;
          this.LoaderService.display(false);
          $("#glassAnimals").modal("show");
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
  ViewVendor2(child) {
    this.childOfmas = child;
    if (child.id) {
      this.LoaderService.display(true);
      this.LeadService.getVendorsForchild(child.id).subscribe(
        (res) => {
          console.log(res);
          this.vendorViewList = res.vendor_products;
          this.childofCat = child;
          this.LoaderService.display(false);
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
  modalclose() {
    this.getQuoteContainerquit2();
  }
  deleteItem(id) {
    if (confirm("Are you sure to delete Child Item") == true) {
      this.LoaderService.display(true);
      this.LeadService.DeleteChilds(id).subscribe(
        (res) => {
          this.GetProductList(this.current_page);
          this.LoaderService.display(false);
          this.successMessageShow("Child item Deleted Successfully");
          this.getChilditemList(this.masterLineItemId, this.current_page2);
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
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
  addVendorFromModal() {
    this.addVendorToChild(this.childofCat.id, this.childofCat.item_name);
  }
  data_heir;
  arrayOFLength = ["", "", "", "", "", "", ""];
  SliChildId: any;
  openPanelModal(pro, id) {
    $("#glassAnimals2").modal("show");
    this.showConfig = false;
    this.data_heir = pro;
    this.SliChildId = id;
    console.log(pro);
  }
  matserLineItemId: any;
  editOrCreateValidator: any = "";
  IDsOFMasterItems = [];
  LobReadonly: any;
  DepartmentReadonly: any;
  subDepartmentReadonly: any;
  ClassReadonly: any;
  subClassReadonly: any;
  MatcodeReadonly: any;
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  transform(value: string): string {
    return value.replace(/_/g, " ");
  }
Formula
  getEditDetails(id) {
    this.DepartmentListFilter = this.DepartmentList;
    this.SubDepartmentFilter = this.SubDepartmentList;
    this.ClassesFilter = this.classList;
    this.SubClassesFilter = this.SubClassList;
    this.MaterialCodeFilter = this.MaterialList;
    this.LoaderService.display(true);
    this.LeadService.getMasterDetails(id).subscribe(
      (res) => {
        res = res.master_line_item;
        this.getQuoteContainer();

        this.matserLineItemId = res.id;
        this.editOrCreateValidator = "edit";
        this.ProductTypeForm.controls["mli_name"].setValue(res.mli_name);
        this.ProductTypeForm.controls["category_lob_id"].setValue(
          res.category_lob_name[0].id
        );
        this.LobReadonly = this.transform(
          this.capitalizeFirstLetter(res.category_lob_name[0].name)
        );
        this.DepartmentReadonly = this.transform(
          this.capitalizeFirstLetter(res.category_department_name[0].name)
        );
        this.subDepartmentReadonly = this.transform(
          this.capitalizeFirstLetter(res.category_sub_department_name[0].name)
        );
        this.ClassReadonly = this.transform(
          this.capitalizeFirstLetter(res.category_class_name[0].name)
        );
        this.subClassReadonly = this.transform(
          this.capitalizeFirstLetter(res.category_sub_class_name[0].name)
        );
        this.MatcodeReadonly = this.transform(
          this.capitalizeFirstLetter(res.category_material_code_name[0].name)
        );
        this.ProductTypeForm.controls["category_department_id"].setValue(
          res.category_department_name[0].id
        );
        this.ProductTypeForm.controls["category_sub_department_id"].setValue(
          res.category_sub_department_name[0].id
        );
        this.ProductTypeForm.controls["category_class_id"].setValue(
          res.category_class_name[0].id
        );
        this.ProductTypeForm.controls["category_subclass_id"].setValue(
          res.category_sub_class_name[0].id
        );
        this.ProductTypeForm.controls["category_material_code_id"].setValue(
          res.category_material_code_name[0].id
        );
        this.ProductTypeForm.controls["zoho_category_id"].setValue(res.zoho_category_id?res.zoho_category_id:'');
        this.ProductTypeForm.controls["unit"].setValue(res.unit);
        this.ProductTypeForm.controls["tax_percent"].setValue(res.tax_percent);
        this.ProductTypeForm.controls["mli_type"].setValue("2021");
        this.ProductTypeForm.controls["is_customizable"].setValue(res.is_customizable == 'yes'?true:false);
        this.ProductTypeForm.controls["formula"].setValue(res.formula);
        this.ProductTypeForm.controls["warranty"].setValue(res.warranty);
        this.ProductTypeForm.controls["lead_time"].setValue(res.lead_time);
        this.ProductTypeForm.controls["sku_code"].setValue("");
        this.Formula = res.formula;
        var MLI_array = this.ProductTypeForm.get(
          "mli_attributes_attributes"
        ) as FormArray;
        (<FormArray>MLI_array).controls = [];

        console.log(MLI_array);
        for (var i = 0; i < res.dynamic_attributes.length; i++) {
          this.IDsOFMasterItems.push(res.dynamic_attributes[i].id);
          MLI_array.push(
            this.formBuilder.group({
              attr_name: new FormControl(
                res.dynamic_attributes[i].attr_name,
                Validators.required
              ),
              id: new FormControl(
                res.dynamic_attributes[i].id,
                Validators.required
              ),

              required: new FormControl(
                res.dynamic_attributes[i].required,
                Validators.required
              ),
              attr_type: new FormControl(
                res.dynamic_attributes[i].attr_type,
                Validators.required
              ),
              attr_data_type: new FormControl("string"),
              dropdown_options: new FormControl(
                res.dynamic_attributes[i].dropdown_options.join(",")
              ),
              is_customizable: new FormControl("no")
            })
          );
        }

        var CLI_array = this.ProductTypeForm.get(
          "customization_attributes"
        ) as FormArray;
        (<FormArray>CLI_array).controls = [];
        for (var i = 0; i < res.customize_attribute.length; i++) {
          this.IDsOFMasterItems.push(res.customize_attribute[i].id);
          CLI_array.push(
            this.formBuilder.group({
              attr_name: new FormControl(
                res.customize_attribute[i].attr_name,
                Validators.required
              ),
              id: new FormControl(
                res.customize_attribute[i].id,
                Validators.required
              ),

              required: new FormControl(
                res.customize_attribute[i].required,
                Validators.required
              ),
              attr_type: new FormControl(
                res.customize_attribute[i].attr_type,
                Validators.required
              ),
              attr_data_type: new FormControl("string"),
              dropdown_options: new FormControl(
                res.customize_attribute[i].dropdown_options.join(",")
              ),
              is_customizable: new FormControl("yes")
            })
          );
        }
        this.LoaderService.display(false);
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  UpdatePROcode(data2) {
    console.log(data2);
    if (data2.mli_attributes_attributes.length > 0) {
      for (var i = 0; i < data2.mli_attributes_attributes.length; i++) {
        console.log(data2.mli_attributes_attributes[i].dropdown_options);
        if (
          Array.isArray(data2.mli_attributes_attributes[i].dropdown_options) ==
          false
        ) {
          data2.mli_attributes_attributes[i].dropdown_options =
            data2.mli_attributes_attributes[i].dropdown_options.split(",");
          if (data2.mli_attributes_attributes[i].dropdown_options.length == 0) {
            this.errorMessageShow(
              "Please give dropdown options properly with comma seperated"
            );
          }
        }
      }
    }

    let data = {
      master_line_item: data2,
    };

    this.LoaderService.display(true);
    this.LeadService.updateProduct(data, this.matserLineItemId).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("Product Updated Successfully");
        this.ProductTypeForm.reset();
        this.createProForm();
        this.productTypesel = "numberone";
        this.LoaderService.display(true);
        this.LeadService.ListOfPRoduct(
          this.current_page,
          this.SearchString,this.selectType
        ).subscribe(
          (res) => {
            this.LoaderService.display(false);
            this.headers_res = res.headers._headers;
            this.per_page = this.headers_res.get("x-per-page");
            this.total_page = this.headers_res.get("x-total");
            this.current_page = this.headers_res.get("x-page");
            res = res.json();
            this.ListOfProduct = res.master_line_items;
            this.masterLinteItem = this.ListOfProduct.filter((el) => {
              return el.id == this.matserLineItemId;
            });
            this.masterLinteItem = this.masterLinteItem[0];
            console.log(this.masterLinteItem);
            this.getChilditemListWithoutError(
              this.masterLineItemId,
              this.current_page2
            );
          },
          (err) => {
            this.LoaderService.display(false);
            this.ListOfProduct = [];
          }
        );

        this.getQuoteContainerquit();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  countDecimals(value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  }

  numTofixed(num) {
    let count = this.countDecimals(num);
    if (count != 0) {
      return num.toFixed(2);
    } else {
      return num;
    }
  }
  EditOrCreateForChild = "";
  child_id_for_submit;
  ProFORImage:any ='';
  ImagesArray =[]
  EditChild(id, pro) {
    this.ProFORImage = pro
    this.child_id_for_submit = id;
    pro = pro.dynamic_attributes;
    let attributenames = [];

    for (var i = 0; i < pro.length; i++) {
      attributenames.push(pro[i].attr_name);
    }

    this.LoaderService.display(true);
    this.LeadService.getchildDetails(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        res = res.child_line_item;
        this.ChildEditorCreate = "edit";
   
        this.getQuoteContainer2(this.masterSKU, res.master_line_item_id,this.ItemParent);
        this.imageFeatured = res.featured_image;
        this.featuredImageSave = res.featured_image;
        // this.imageFeatured =='/images/original/missing.png' ? null :  this.imageFeatured
        this.base64Images = res.images.map(image => image.medium);
        if(this.imageFeatured != '/images/original/missing.png'){
          this.base64Images.push( this.imageFeatured)
        }
       
        this.ImagesArray = res.images
        this.EditOrCreateForChild = "edit";
        this.ProductChildTypeForm.controls["item_name"].setValue(res.item_name);
        this.ProductChildTypeForm.controls["tax"].setValue(res.tax);
        // this.ProductChildTypeForm.controls["sku"].setValue(res.sku);
        this.ProductChildTypeForm.controls["brand_code"].setValue(res.brand_code);
        this.ProductChildTypeForm.controls["brand_id"].setValue(res.brand_id);
        this.ProductChildTypeForm.controls["sales_price"].setValue(res.sales_price);
        this.ProductChildTypeForm.controls["product_description"].setValue(res.product_description);

       if(res.product_description){
        const words = res.product_description
        this.wordCount = words.length;
       } else{
        this.wordCount = 0
       }
       if (this.ProFORImage.category_department_name[0].name.toLowerCase() === 'nova') {
        this.ProductChildTypeForm.controls["sales_price"].setValidators(Validators.required);
      } else {
        this.ProductChildTypeForm.controls["sales_price"].clearValidators();
        this.ProductChildTypeForm.controls["sales_price"].updateValueAndValidity(); // to trigger revalidation
      }

        var MLI_array = this.ProductChildTypeForm.get(
          "sli_dynamic_attributes_attributes"
        ) as FormArray;
        (<FormArray>MLI_array).controls = [];
        for (var i = 0; i < res.sli_attributes.length; i++) {
          MLI_array.push(
            this.formBuilder.group({
              attr_value: new FormControl(
                res.sli_attributes[i].attr_value,
                res.sli_attributes[i].mli_attribute_details.required
                  ? Validators.required
                  : Validators.nullValidator
              ),
              id: new FormControl(res.sli_attributes[i].id),
              mli_attribute_id: new FormControl(
                res.sli_attributes[i].mli_attribute_details.id
              ),
              mli_attribute_name: new FormControl(
                res.sli_attributes[i].mli_attribute_details.attr_name
              ),
              mli_attribute_type: new FormControl(
                res.sli_attributes[i].mli_attribute_details.attr_type
              ),
              mli_attribute_value: new FormControl(
                res.sli_attributes[i].mli_attribute_details.dropdown_options
              ),
              mli_attribute_required: new FormControl(
                res.sli_attributes[i].mli_attribute_details.required
              ),
            })
          );
        }
        console.log(MLI_array);
      },

      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  removeFromItem(id) {
    if (id != "") {
      this.LoaderService.display(true);
      this.LeadService.DeleteAttribute(id).subscribe(
        (res) => {
          this.LoaderService.display(false);
          this.successMessageShow("Attribute Deleted SuccessFully");
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
  removeFromItemChild(id) {
    if (id != "") {
      this.LoaderService.display(true);
      this.LeadService.DeleteAttributeChild(id).subscribe(
        (res) => {
          this.LoaderService.display(false);
          this.successMessageShow("Attribute Deleted SuccessFully");
        },
        (err) => {
          this.LoaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
        }
      );
    }
  }
  submitchildproedit() {
    this.LoaderService.display(true);
  
    if(this.base64Images.length == 1 && this.imageFeatured == '/images/original/missing.png'){
      this.imageFeatured = this.base64Images[0]
    }
    this.LeadService.EditProductchild(
      this.ProductChildTypeForm.value,
      this.child_id_for_submit,this.imageFeatured,this.base64Images
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.ProductChildTypeForm.reset();
        this.creatingFOrms();
        this.successMessageShow("Child Item updated Successfully");
        this.GetProductList(this.current_page);
        this.getChilditemList(this.masterLineItemId, this.current_page2);
        this.productTypeselchild = "numberonechild";
        this.modalclose();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  setUpvaluesInchild(data,parent) {
   this.ProFORImage = parent;

   

   if (this.ProFORImage.category_department_name[0].name.toLowerCase() === 'nova') {
    this.ProductChildTypeForm.controls["sales_price"].setValidators(Validators.required);
  } else {
    this.ProductChildTypeForm.controls["sales_price"].clearValidators();
    this.ProductChildTypeForm.controls["sales_price"].updateValueAndValidity(); // to trigger revalidation
  }
    this.ProductChildTypeForm.controls['tax'].setValue(parent.tax_percent)
    var MLI_array = this.ProductChildTypeForm.get(
      "sli_dynamic_attributes_attributes"
    ) as FormArray;
    (<FormArray>MLI_array).controls = [];
    for (var i = 0; i < data.length; i++) {
      MLI_array.push(
        this.formBuilder.group({
          attr_value: new FormControl(
            "",
            data[i].required ? Validators.required : Validators.nullValidator
          ),
          id: new FormControl(""),
          mli_attribute_name: new FormControl(data[i].attr_name),
          mli_attribute_id: new FormControl(data[i].id),
          mli_attribute_type: new FormControl(data[i].attr_type),
          mli_attribute_value: new FormControl(data[i].dropdown_options),
          mli_attribute_required: new FormControl(data[i].required),
        })
      );
    }
    this.ChildEditorCreate = "love";
  }
  showConfig = false;
  handleConfig() {
    this.showConfig = !this.showConfig;
  }
  SelectedIdOfVendor: any;
  alternative() {
    $("#glassAnimals3").modal("show");
    this.SelectedIdOfVendor = 1;
  }

  vendorFilterSel = "";
  selectType = "";
  FilterTypeVendororSearch = "parent_name";
  selectFiltertype(e) {
    this.FilterTypeVendororSearch = e;
    this.ParentSearch = "";
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.search_type = e;

  }
  changeFunforSelect(e) {
    this.vendorFilterSel = e;
  }
  selectReviseList(e) {
    console.log(e);
  }
  modalHideVen() {
    console.log("hi");
    $("#glassAnimals").modal("hide");
  }
  listOfBrands = [];
  getBrandsList() {
    this.LeadService.GetListBrands().subscribe((res) => {
      this.listOfBrands = res.brands;
    });
  }
  setValPro(e, i) {
    if (e == "dropdown") {
      this.ProductTypeForm.controls["mli_attributes_attributes"]["controls"][
        i
      ].controls.dropdown_options.setValidators(Validators.required);
      this.ProductTypeForm.controls["mli_attributes_attributes"]["controls"][
        i
      ].controls.dropdown_options.updateValueAndValidity();
    } else {
      this.ProductTypeForm.controls["mli_attributes_attributes"]["controls"][
        i
      ].controls.dropdown_options.clearValidators();
      this.ProductTypeForm.controls["mli_attributes_attributes"]["controls"][
        i
      ].controls.dropdown_options.setValue([]);
      this.ProductTypeForm.controls["mli_attributes_attributes"]["controls"][
        i
      ].controls.dropdown_options.updateValueAndValidity();
    }
  }
Operators=['+','-','*','/','(',')']
  catname: any;
  ParentSearch;
  ChildSearch;
  modalForVendor(vName) {
    $("#MoreVendor").modal("show");
    this.catname = vName;
  }
  SearchFilterForchild() {
    if (this.selectType != "") {
      this.GetProductList2("");
    } else {
      this.errorMessageShow("Please Select Search Type then Search");
    }
  }
  deleteVendorProduct(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteVendorProduct(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.ViewVendor2(this.childOfmas);
        this.getChilditemList(this.masterLineItemId, this.current_page2);
        this.GetProductList(this.current_page);
        this.successMessageShow("Vendor Product Deleted Successfully");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  vendor_details_forPro: any;
  editVendorGet(ven) {
    this.vendor_details_forPro = ven;
    $("#EditVendorModal").modal("show");
    this.VendorProductEditForm.controls["ItemCost"].setValue(ven.rate);
    this.VendorProductEditForm.controls["priority"].setValue(
      ven.vendor_details.priority
    );
    this.VendorProductEditForm.controls["child_line_item_id"].setValue(
      ven.child_line_item_id
    );
    this.VendorProductEditForm.controls["VendorId"].setValue(ven.vendor_id);
    this.VendorProductEditForm.controls["VendorCode"].setValue(
      ven.vendor_details.vendor_code
    );

    console.log(ven);
    console.log(this.VendorProductEditForm.value);
  }
  UpdateVendorProduct() {
    this.LoaderService.display(true);
    this.LeadService.UpdateVendorType(
      this.VendorProductEditForm.value,
      this.vendor_details_forPro.id
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.GetProductList(this.current_page);
        this.successMessageShow("Vendor Updated Succesfully");
        this.ViewVendor2(this.childOfmas);
        this.getChilditemList(this.masterLineItemId, this.current_page2);

        $("#EditVendorModal").modal("hide");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  endpoint_result: any = "";
  CheckingPriorityEndpoint(id) {
    this.ProirityOfven = "set";
    this.LeadService.prioritycheck(id).subscribe(
      (res) => {
        this.endpoint_result = res;
        $("#ViewProirityVendor").modal("show");
        this.getQuoteContainerquit2();
      },
      (err) => {
        if (
          JSON.parse(err["_body"]).message ==
          "There is no existing Preferred Vendor Item"
        ) {
          this.LoaderService.display(true);
          this.LeadService.CreateVendorType(
            this.ProductVendorForm.value
          ).subscribe(
            (res) => {
              console.log(res);
              this.LoaderService.display(false);
              if (res.message) {
                this.successMessageShow(res.message);
              } else {
                this.successMessageShow("Vendor product Created successfully");
              }

              this.ProductVendorForm.reset();
              this.creatingFOrms();
              $("#ViewProirityVendor").modal("hide");
              this.GetProductList(this.current_page);
              this.getQuoteContainerquit2();
              this.getChilditemList(this.masterLineItemId, this.current_page2);
              this.ViewVendor2(this.childOfmas);
              this.ProductVendorForm.controls["child_line_item_id"].setValue(
                this.childItemId
              );
              this.ProductVendorForm.controls["childsku"].setValue(
                this.ChildSku
              );
            },
            (err) => {
              this.LoaderService.display(false);
              this.errorMessageShow(JSON.parse(err["_body"]).message);
            }
          );
        }
      }
    );
  }
  ProirityOfven: any = "set";
  setUpproIrity(e) {
    console.log(this.ProirityOfven);
  }
  SUbVendorProduct() {
    this.ProductVendorForm.controls["priority"].setValue(this.ProirityOfven);
    console.log(this.ProirityOfven);
    this.LoaderService.display(true);
    this.LeadService.CreateVendorType(this.ProductVendorForm.value).subscribe(
      (res) => {
        console.log(res);
        this.LoaderService.display(false);
        if (res.message) {
          this.successMessageShow(res.message);
        } else {
          this.successMessageShow("Vendor product Created successfully");
        }

        this.ProductVendorForm.reset();
        this.creatingFOrms();
        $("#ViewProirityVendor").modal("hide");
        this.GetProductList(this.current_page);
        this.getQuoteContainerquit2();
        this.getChilditemList(this.masterLineItemId, this.current_page2);
        this.ViewVendor2(this.childOfmas);
        this.ProductVendorForm.controls["child_line_item_id"].setValue(
          this.childItemId
        );
        this.ProductVendorForm.controls["childsku"].setValue(this.ChildSku);
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  GetorderMangae(data, name) {
    let fildata = data.filter((el) => {
      if (el.mli_attribute_details && el.mli_attribute_details.attr_name) {
        return el.mli_attribute_details.attr_name == name;
      }
    });
    if (fildata.length > 0) {
      fildata = fildata[0];
      fildata = fildata.attr_value;
    } else {
      fildata = "-";
    }
    return fildata;
  }
  modalForSub() {
    $("#ViewSubDepartmentModal").modal("show");
  }

  // heirachy Elements edit and delete
  deletelob(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteLOB(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getLOBSList();
        this.successMessageShow("LOB Sucessfully Deleted");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  LOBID: any;
  editLOBGet(ven) {
    this.EditLOBForm.controls["name"].setValue(ven.name);
    this.EditLOBForm.controls["lob_code"].setValue(ven.lob_code);
    $("#EditLOBModal").modal("show");
    this.LOBID = ven.id;
  }
  UpdateLOB() {
    this.LoaderService.display(true);
    this.LeadService.UpDateLOb(this.EditLOBForm.value, this.LOBID).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Sucessfully UpDated");
        this.getlistItems();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  DepartmentID: any;
  editDepGet(ven) {
    this.EditLOBForm.controls["name"].setValue(ven.name);
    this.EditLOBForm.controls["lob_code"].setValue(ven.lob_code);
    $("#EditLOBModal").modal("show");
    this.DepartmentID = ven.id;
  }
  UpdateDep() {
    this.LoaderService.display(true);
    this.LeadService.UpDateDep(this.EditLOBForm.value, this.LOBID).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Sucessfully UpDated");
        this.getlistItems();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  deleteDep(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteDep(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getLOBSList();
        this.successMessageShow("LOB Sucessfully Deleted");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  SubDepartmentID: any;
  editSubDepGet(ven) {
    this.EditLOBForm.controls["name"].setValue(ven.name);
    this.EditLOBForm.controls["lob_code"].setValue(ven.lob_code);
    $("#EditLOBModal").modal("show");
    this.SubDepartmentID = ven.id;
  }
  UpdateSubDep() {
    this.LoaderService.display(true);
    this.LeadService.UpDateSubDep(this.EditLOBForm.value, this.LOBID).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Sucessfully UpDated");
        this.getlistItems();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  deleteSUBDep(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteSubDep(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getLOBSList();
        this.successMessageShow("LOB Sucessfully Deleted");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  ClassID: any;
  editClass(ven) {
    this.EditLOBForm.controls["name"].setValue(ven.name);
    this.EditLOBForm.controls["lob_code"].setValue(ven.lob_code);
    $("#EditLOBModal").modal("show");
    this.ClassID = ven.id;
  }
  UpdateClass() {
    this.LoaderService.display(true);
    this.LeadService.UpDateClass(this.EditLOBForm.value, this.LOBID).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Sucessfully UpDated");
        this.getlistItems();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  deleteClass(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteClass(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getLOBSList();
        this.successMessageShow("LOB Sucessfully Deleted");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  SUbClassID: any;
  editSubClass(ven) {
    this.EditLOBForm.controls["name"].setValue(ven.name);
    this.EditLOBForm.controls["lob_code"].setValue(ven.lob_code);
    $("#EditLOBModal").modal("show");
    this.SUbClassID = ven.id;
  }
  UpdatesubClass() {
    this.LoaderService.display(true);
    this.LeadService.UpDateSUbClass(
      this.EditLOBForm.value,
      this.LOBID
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Sucessfully UpDated");
        this.getlistItems();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  deleteSubClass(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteSubClass(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getLOBSList();
        this.successMessageShow("LOB Sucessfully Deleted");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  MATcodeID: any;
  editmat(ven) {
    this.EditLOBForm.controls["name"].setValue(ven.name);
    this.EditLOBForm.controls["lob_code"].setValue(ven.lob_code);
    $("#EditLOBModal").modal("show");
    this.MATcodeID = ven.id;
  }
  Updatemat() {
    this.LoaderService.display(true);
    this.LeadService.UpDateMatCode(
      this.EditLOBForm.value,
      this.LOBID
    ).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("LOB Sucessfully UpDated");
        this.getlistItems();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  deletemat(id) {
    this.LoaderService.display(true);
    this.LeadService.DeleteMatcode(id).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.getLOBSList();
        this.successMessageShow("LOB Sucessfully Deleted");
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  listOfSliCats;
  listOfslicats() {
    this.LeadService.GetListCats().subscribe((res) => {
      this.listOfSliCats = res;
    });
  }
  resetcat(){
    this.creatingFOrms();
    this.itemsShow = "MaterialCode";
    console.log("huih")
    this.showitems('MaterialCode');
  }
  search_type:any="parent";
  changeDateType(e) {
    this.search_type = e;
  }
  createBrand() {
    this.LoaderService.display(true);
    this.LeadService.createBrand(this.CreateBrandCodeForm.value).subscribe(
      (res) => {
        this.LoaderService.display(false);
        this.successMessageShow("Brand Created Successfully");
        this.getlistItems();
        this.CreateBrandCodeForm.reset();
        this.creatingFOrms();
      },
      (err) => {
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"])[0]);
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
    })
  }

  mapitem(){
    this.LoaderService.display(true);
    this.LeadService.mapitem(this.dynamicdetails['id'],this.item_id).subscribe(
      (res) =>{
      if(res.message){
      $("#viewDynamicmapping2").modal("hide");
      this.successMessageShow(res.message);
      this.GetProductList('')
      }
    },
    (err)=>{
      this.errorMessageShow(JSON.parse(err['_body']).message);
      $("#viewDynamicmapping2").modal("hide");
      this.GetProductList('')

    })

  }

  createchilditem(id){
    this.LoaderService.display(true);
    this.LeadService.createchilditem(id).subscribe((res) =>{
      this.successMessageShow(res.message);
      $("#viewDynamicmapping2").modal("hide");
      this.GetProductList('')

    },
    (err)=>{
      this.errorMessageShow(JSON.parse(err['_body']).message);
      $("#viewDynamicmapping2").modal("hide");
      this.GetProductList('')
    }
    );

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
      this.getChilditemList(this.masterLineItemId, this.current_page2);
     
       
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
      this.getChilditemList(this.masterLineItemId, this.current_page2);
     
       
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
  Catswarhouse:any=[]

  getCategorysForWarhouse() {
    this.LeadService.GetListWCats().subscribe(res => {
      this.Catswarhouse = res.categories;
    },
      (err) => {
        this.errorMessageShow(JSON.parse(err['_body']).message);
      })

  }
  Modalshow = false
  imageOpen(){
   this.Modalshow = true;
   $('#scrolltoTOP54').scrollTop(0);
  }
  selectedFiles: File[] = [];
  base64Images: string[] = [];

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    
    // Convert selected images to base64
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      this.convertToBase64(file);
    }
    this.uploadImages()
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64Images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  imageFeatured:any = null
  uploadImages() {
    // Perform the upload logic and use this.base64Images as needed
    console.log('Base64 Images:', this.base64Images);
    this.Modalshow = false
  }
  SetFeaturedImage(image){
    this.imageFeatured = image
  }
 DisableforChild(){
  console.log(this.imageFeatured)
  if(this.ItemParent.image_upload_mandatory){
    if(this.base64Images.length == 0 || (this.base64Images.length > 1 && !this.imageFeatured ) ){

      return true
    }
  } else{
      console.log(this.imageFeatured)
    if(!this.imageFeatured && this.base64Images.length > 1 ){
      return true
    }
    return false
  }

 }
 imagesList =[]
 FetchAddedImages(id){
  this.LoaderService.display(true)
  this.LeadService.GetListWCatImages(id).subscribe(res => {
    this.imagesList = res.images_urls
    this.LoaderService.display(false)
    this.ImageUrl = this.imagesList[0].medium;
   this.minLen = -1;
    this.maxLen = 5;
    this.ActiveIndexCa = 0
    $("#ViewImagesModal").modal("show");

  },
    (err) => {
      this.LoaderService.display(false)
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

 }
 callCarousel() {
  $("#carouselExample").on("slide.bs.carousel", function (e) {
    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 4;
    var totalItems = $(".carousel-item").length;

    if (idx >= totalItems - (itemsPerSlide - 1)) {
      var it = itemsPerSlide - (totalItems - idx);
      for (var i = 0; i < it; i++) {
        // append slides to end
        if (e.direction == "left") {
          $(".carousel-item").eq(i).appendTo(".carousel-inner");
        } else {
          $(".carousel-item").eq(0).appendTo(".carousel-inner");
        }
      }
    }
  });
}
ImageDetail =''
OpenImageDetail(image){

this.ImageDetail = image;
$("#ViewImagesModalDetail").modal("show");

}
  FetchImages() {

    this.LeadService.getchildDetails(this.child_id_for_submit).subscribe(
      (res) => {
        res = res.child_line_item;
        this.imageFeatured = res.featured_image;
        this.base64Images = []
        this.base64Images = res.images.map(image => image.medium);

        console.log(this.base64Images, this.base64Save)
        this.ImagesArray = res.images
        if (this.imageFeatured != '/images/original/missing.png') {
          this.base64Images.push(this.imageFeatured)
        }

        for (let element of this.base64Save) {
          this.base64Images.push(element);
        }

      }
    )


  }
base64Save =[];
featuredImageSave
DeleteImage(featured,id){
let newId;
let imageCheck;
let neworOld =''
 if(id !=''){
newId=this.ImagesArray.filter(image=>{
  return image.medium == id;
})
if(newId[0]){
  id = newId[0].id
  neworOld = 'old'
}



 } else{
  if(featured){
   
    neworOld = 'old'
  }
 
 }
 if(!featured && neworOld !='old'){
 imageCheck =  this.ImagesArray.filter(res=>{

    return res.medium == id

  })
  console.log(imageCheck,this.ImagesArray,id)
  if(imageCheck.length == 0){
     neworOld = 'new'
  }
 }
 console.log(neworOld,featured,id)
if(featured && typeof id === "string" && id.startsWith('data:image')){
  neworOld = 'new'
} else{
  if(featured){
    neworOld = 'old'
  }
}
console.log(neworOld,featured,id)
if(neworOld == 'old'){
  this.LoaderService.display(true)
  this.base64Save =[];
  this.base64Images.forEach(base64Image => {
    if(base64Image.startsWith('data:image')){
      this.base64Save.push(base64Image);
    }
   
  });
  id = featured?'':id
  this.LeadService.DeleteCliImage(featured,this.child_id_for_submit,id).subscribe(res=>{
    this.successMessageShow('Deleted Successfuly');
    this.LoaderService.display(false);
    this.FetchImages()
    this.productSetchild('numberthreechild');
    console.log(this.productTypeselchild)
    
  },err=>{
    this.errorMessageShow(JSON.parse(err['_body']).message);
    this.LoaderService.display(false)
  })

} else{
  if(featured){
    this.imageFeatured = '/images/original/missing.png'
  } else{

    let index = this.base64Images.indexOf(id)
    if(index > -1){
      this.base64Images.splice(index,1) 
    }
    

  }
 
 
}

  console.log(this.productTypeselchild)
}
DisableforChildEdit(){
  if(this.base64Images.length > 1 && this.imageFeatured == '/images/original/missing.png' ){
    return true
  } else{
    return false
  }
 
}
DisableforChildEdittest(){
  if(this.imageFeatured == '/images/original/missing.png' && this.ItemParent.image_upload_mandatory ){
    return true
  } else{
    return false
  }
 
}
minLen:any = -1;
  maxLen:any = 5;
rightClick(){

  this.minLen = this.minLen + 5
  
  this.maxLen = this.maxLen + 5
  
  }
  leftClick(){
  
  this.minLen = this.minLen - 5
  
  this.maxLen = this.maxLen - 5
  }
  ImageUrl =''
  ActiveIndexCa = 0
  ActiveIndex(m,image){
   
  this.ActiveIndexCa = m;
  
  this.ImageUrl = image
  }
  CloseModalImages(){
    if(this.EditOrCreateForChild != 'edit'){

    if(!this.ProductChildTypeForm.valid || this.DisableforChild()){
      this.getQuoteContainerquit2()
    } else{
      this.getQuoteContainerquit2()
    }
    } else{
      if(!this.ProductChildTypeForm.valid || this.DisableforChildEdit() || this.DisableforChildEdittest()){
        this.errorMessageShow('Please Select Featured Image And Update to Close Modal')
      }else{
        this.getQuoteContainerquit2()
      }

    }
  }
  CustomProduct(e){

  

  }
  onToggleChange(e) {
    console.log('Toggle switch state changed:', e.target.checked);
  
    // Get the FormArrays
    const MLI_array = this.ProductTypeForm.get("mli_attributes_attributes") as FormArray;
    const CLI_array = this.ProductTypeForm.get("customization_attributes") as FormArray;
  
    if (e.target.checked) {
      
        MLI_array.controls.forEach(control => {
          console.log(control.value.attr_data_type)
          if (control.value.attr_type === 'number') {
            CLI_array.push(new FormGroup({
              attr_name: new FormControl('cus_'+control.value.attr_name, Validators.required),
              required: new FormControl(control.value.required, Validators.required),
              attr_type: new FormControl(control.value.attr_type, Validators.required),
              attr_data_type: new FormControl(control.value.attr_data_type),
              id: new FormControl(control.value.id),
              is_customizable:new FormControl('yes'),
              dropdown_options: new FormControl(control.value.dropdown_options),
            }));
          }
        });
     
    } else{
      while (CLI_array.length) {
        CLI_array.removeAt(0);
     }
    }

    console.log(CLI_array)
  }
  SetNameInformula(att){
    let Formula = this.ProductTypeForm.controls['formula'].value;
    Formula = Formula + att;
    this.ProductTypeForm.controls['formula'].setValue( Formula)
  }
  backSPace(){
    let Formula = this.ProductTypeForm.controls['formula'].value;
    const s = Formula;
const withoutLastFourChars = "";
    this.ProductTypeForm.controls['formula'].setValue(withoutLastFourChars)
  }
  objectFormat;
  finalValue = null
  CalculateAttr(){
    this.objectFormat = {};
    this.ProductTypeForm.controls['customization_attributes']['controls'].forEach((att: any) => {
      const attributeName = att.controls.attr_name.value;
      const inputElementId = `attr_name-${attributeName}`;
      const inputValue = (<HTMLInputElement>document.getElementById(inputElementId)).value;
      this.objectFormat[attributeName] = inputValue;
    });
    console.log(this.objectFormat); 
    let obj ={
      formula : this.ProductTypeForm.controls['formula'].value,
      attributes_value : this.objectFormat
    }
    this.LoaderService.display(true)
    this.LeadService.CalculateValue(obj).subscribe(res=>{
      console.log(res);
      this.finalValue = res
      this.LoaderService.display(false)
    },err=>{
      this.errorMessageShow(JSON.parse(err["_body"]).message);
      this.LoaderService.display(false)
    
    })
  }
  getDepartmentName(){
    if(this.DepartmentListFilter){
      let Department =  this.DepartmentListFilter.filter(el=>{
        return this.ProductTypeForm.controls['category_department_id'].value == el.id
       })
       var DepartmentCode;
       this.departname = Department.length > 0 ? Department[0].name:'';
       this.departname =  this.departname.toLowerCase();
       DepartmentCode = Department.length > 0 ? Department[0].depart_code:''
       if(this.departname == "nova" && DepartmentCode == "FUNV" ){
       return true
       } else{
       return false
       }
    }
   
  }
  private holdTimer: any;
  private holdInterval: number = 200;
  startHold(): void {
    this.holdTimer = setInterval(() => {
    this.backSPace()
    }, this.holdInterval);
  }

  endHold(): void {
    clearInterval(this.holdTimer);
  }
  preventManualEntry(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

     console.log(event)
     const cursorPosition = inputElement.selectionStart;

   this.ProductTypeForm.controls['formula'].setValue('')
    if (cursorPosition === 0 || cursorPosition <= 4) {
       
        if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
        }
    }
    if (value.startsWith('cus_')) {
    

    } else {

      event.preventDefault();
  
    }

  }
  updateChild(e){

  }
  isChecked = []

  onToggle(e,i) {
    this.isChecked[i] = e.target.checked
    this.QuotationItem = e.target.checked;
    this.getChilditemListWithoutError(
      this.masterLineItemId,
      this.current_page2
    ); 

  }
  backSPacedel(){
    let formula = this.ProductTypeForm.controls['formula'].value;

// Remove the last character from the string using slice() method
const withoutLastChar = formula.slice(0, -1);

// Update the 'formula' form control with the modified string
this.ProductTypeForm.controls['formula'].setValue(withoutLastChar);

  }
  formulaShow ;
  isdes
  FormulaShow(fr,p?){
    this.isdes = p;
    $("#formulaModal").modal("show");
  this.formulaShow =fr
  }
  updateWordCount(e): void {
    // Get the value of the product description control
    

    // Split the value by spaces to count words
    const words = e.target.value;
this.ProductChildTypeForm.controls['product_description'].setValue(e.target.value)
    // Update the word count (assuming each word is separated by space)
    this.wordCount = words.length;
    if(e.target.value == ''){
      this.wordCount = 0
    }
  }
}



  

