import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { Location } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService} from '../category.service';

declare var $:any;

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  providers: [CategoryService]
})
export class VendorComponent implements OnInit {
  vendorForm:FormGroup;
  vendorFormTag:FormGroup;
  vendorUpdateForm:FormGroup;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  showvalidationMsg : boolean;
  showvalidEmaliMsg : boolean;
  showvalidMobileNo : boolean;
  urls = [];
  UploadDDlist_Item=[];
  UpdatedDDlist_Item=[];
  UpdatedGst_Item=[];
  file_type:any;
  contents_to_delete_ddlist= [];
  state_list: any;
  payment_term: any;
  importance_list: any;
  selectedTab = 'pending';
  vendor_invitation_list: any;
  vendor_invitations_list: any;
  role: string;
  per_page_invitation: any;
  total_page_invitation: any;
  current_page_invitation: any;
  filterMainType: any = 'all';
  selectedCities: any;
  vendorInvitationCount: any;
  vendorCount: any;
  mobilenumber:any;
  email:any;
  pannumber:any;
  category :any;
  subcategory :any;
  payementterm:any= "";
  Importance:any="";
  mobileNumber2:any;
  email2:any;


  constructor(
    private router: Router,
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder,
    private location: Location

    ) { 



    this.vendorForm = this.formBuilder.group({

      name : new FormControl(null,Validators.required),
      pan_no : new FormControl(null,[Validators.required,Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]),
      address : new FormControl(null,Validators.required),
      contact_person : new FormControl(null,Validators.required),
      contact_number : new FormControl(null,[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]),
      email : new FormControl(null,[Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      gsts : this.formBuilder.array([]),
      account_holder : new FormControl(null,Validators.required),
      account_number : new FormControl(null,Validators.required),
      bank_name : new FormControl(null,Validators.required),
      branch_name : new FormControl(null,Validators.required),
      ifsc_code : new FormControl(null,Validators.required),
      pan_copy : new FormControl(null,Validators.required),
      gst_attachments : new FormArray([]),
      cancelled_cheque : new FormControl(null,Validators.required),     
      city : new FormControl(null,Validators.required),
      category_ids : new FormArray([],Validators.required),
      sub_category_ids : new FormArray([],Validators.required),
      serviceable_city_ids : new FormArray([],Validators.required),
      dd_score: new FormControl(""),
      dd_upload_attachments: new FormControl(""),
      upload_agreements: new FormControl(""),
      state_id: new FormControl(""),
      payment_term_id: new FormControl("",Validators.required),
      importance: new FormControl("",Validators.required)

    })
   
    this.vendorFormTag = this.formBuilder.group({
      vendor_tag : new FormControl(""),
    })
  }

  itemList =[];
  ngOnInit( ) {
	this.role=localStorage.getItem('user');
    this.vendorUpdateForm = this.formBuilder.group({

      name : new FormControl(null,Validators.required),
      pan_no : new FormControl(null,[Validators.required,Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]),
      address : new FormControl(null,Validators.required),
      contact_person : new FormControl(null,Validators.required),
      contact_number : new FormControl(null,[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]),
      email : new FormControl(null,[Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      gsts : this.formBuilder.array([]),
      account_holder : new FormControl(null,Validators.required),
      account_number : new FormControl(null,Validators.required),
      bank_name : new FormControl(null,Validators.required),
      branch_name : new FormControl(null,Validators.required),
      ifsc_code : new FormControl(null,Validators.required),
      pan_copy : new FormControl(null),
      gst_attachments : new FormControl(""),
      cancelled_cheque : new FormControl(null),     
      city : new FormControl(null),
      category_ids : new FormArray([]),
      sub_category_ids : new FormArray([],Validators.required),
      serviceable_city_ids : [[]],
      dd_score: new FormControl(""),
      dd_upload_attachments: new FormControl(""),
      upload_agreements: new FormControl(""),
      state_id: new FormControl(""),
      payment_term_id: new FormControl("",Validators.required),
      importance: new FormControl("",Validators.required)
    })
    this.getFilterData();
    this.getVendorList();
    this.getlistVendorTags();
    this.getVendorInvitationList();
    this.getVendorCategories();
  }
  headers_res;
  per_page;
  total_page;
  current_page;
  page_number;
  search_val;
  getVendorList(page?,search?){
    this.page_number = page;
    this.search_val = search;
    this.categoryService.getVendorList(page,search,this.status,this.filterId).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.itemList = res['vendors'];
        this.vendorCount = res.count;
        this.loaderService.display(false);
      },
      err=>{
           
           this.loaderService.display(false);
      });
  }
  getVendorInvitationList(page?,search?){
    this.categoryService.getVendorInvitationList(page,search,this.status,this.filterId).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page_invitation = this.headers_res.get('x-per-page');
        this.total_page_invitation = this.headers_res.get('x-total');
        this.current_page_invitation = this.headers_res.get('x-page');
        res= res.json();
        this.vendor_invitations_list = res.vendor_invitations;
        this.vendorInvitationCount = res.count;
        this.loaderService.display(false);
        
      },
      err=>{   
      });

  }
  compareFunction(item, selected) {
    return item === selected
  }
  dropdownCityList = [];
  dropdownSscSettings = {
    // singleSelection: false,
    singleSelection: false, 
    text: "Select city",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass",
  };
  city_list = [];
  getFilterData(){
    this.categoryService.getCities().subscribe(
       res=>{
        this.city_list = res['cities'];
        for(var i =0;i< res.cities.length;i++){
          var obj ={
            "id":res.cities[i].id,"itemName":res.cities[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
          }
          this.dropdownCityList.push(obj);
          
        }
       },
       err=>{
      
       }
       );
  }
  getPaymentTerm(){
    this.categoryService.getPaymentTerm().subscribe(
      res=>{
        this.payment_term = res.payment_terms;
        
      },
      err=>{
     
      }
      );
  }
  getStateList(){
    this.categoryService.getStateList().subscribe(
      res=>{

        this.state_list = res.state_list;
        
      },
      err=>{
     
      }
      );
  }

  categories;
  getVendorCategories(){
    this.categoryService.getVendorCategories().subscribe(
      res=>{
          this.categories = res['vendor_categories'];
      },
      err=>{
         
      }
      );
  }
  getImportantList(){
    this.categoryService.getImportantList().subscribe(
      res=>{
          // this.categories = res['vendor_categories'];
          this.importance_list = res.importance_list;
          
      },
      err=>{
         
      }
      );

  }
  selectSet(event){
    this.selectedTab = event;
    this.search_value ='';
    this.filterId = '';
    this.filterMainType = 'all';
    this.getVendorInvitationList();
    this.getVendorList();

  }
  selectedSet='first';
  error:any;
 
  getSet(value){
   
    
    if(value=="second" && this.vendorForm.controls['name'].valid && this.vendorForm.controls['address'].valid &&  this.vendorForm.controls['contact_person'].valid && this.mobilenumber !==null && this.email !==null && this.vendorForm.controls['email'].valid && this.vendorForm.controls['contact_number'].valid){
   this.selectedSet = "second";
   this.error= false;
    }  else{
      this.error = true;
      this.selectedSet ="first";
    } 
    
   

  }
  getSet2(value){
    if(value == "third"  && this.pannumber !==null && this.vendorForm.controls['account_holder'].valid && this.vendorForm.controls['account_number'].valid && this.vendorForm.controls['bank_name'].valid && this.vendorForm.controls['branch_name'].valid && this.vendorForm.controls['ifsc_code'].valid && this.pan_copy_image !==undefined && this.cheque_copy_image !==undefined && this.vendorForm.controls['pan_no'].valid && this.vendorForm.controls['gsts'].value.length !== 0){
      this.selectedSet ="third";
      this.error = false;
    } else {
      this.error = true;
      this.selectedSet ="second";
    }
  }
  getSetedit(value){
    
    if(value=="second" && this.vendorUpdateForm.controls['name'].valid && this.vendorUpdateForm.controls['address'].valid &&  this.vendorUpdateForm.controls['contact_person'].valid  && this.vendorUpdateForm.controls['email'].valid && this.vendorUpdateForm.controls['contact_number'].valid){
   this.selectedSet = "second";
   this.error= false;
    }  else{
      this.error = true;
      this.selectedSet ="first";
    } 
    
   

  }
  getSetedit2(value){
   
    if(value == "third"  && this.vendorUpdateForm.controls['account_holder'].valid && this.vendorUpdateForm.controls['account_number'].valid && this.vendorUpdateForm.controls['bank_name'].valid && this.vendorUpdateForm.controls['branch_name'].valid && this.vendorUpdateForm.controls['ifsc_code'].valid &&   this.vendorUpdateForm.controls['pan_no'].valid ){
      this.selectedSet ="third";
      this.error = false;
    } else {
      this.error = true;
      this.selectedSet ="second";
    }
  }
  subId;
  selected_category_id:any = "";
  selected_category_name:any = "";
  getSubCategories(event){
    this.selected_category_id = event.target.value;
    this.selected_category_name = event.target.options[event.target.selectedIndex].text
    this.subId = event.target.value;
    this.getSubCategoriesValues(this.subId);
  }
  subCategoryList;
  getSubCategoriesValues(value){
    this.categoryService.getSubcategoryList(value).subscribe(res=>
      { 
        this.subCategoryList = res['vendor_categories']
      },
      err=>{
           
      }
      );

  }
  onSscItemSelect(item: any) {

  }

  OnSscItemDeSelect(item: any) {
    
    
  }

  onSscSelectAll(items: any) {
    
  }

  onSscDeSelectAll(items: any) {
    
  }

  onSscCheckChange(event){
    if(event.target.checked){
      (this.vendorForm.get('serviceable_city_ids') as FormArray)
      .push(new FormControl(event.target.value))
      // (<FormArray>this.vendorForm.controls['serviceable_city_ids']).push(new FormControl(event.target.value));
    } else{
      var j:number = 0;
      (<FormArray>this.vendorForm.controls['serviceable_city_ids']).controls.forEach((ctr: FormControl) => {
        if(ctr.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          (<FormArray>this.vendorForm.controls['serviceable_city_ids']).removeAt(j);
          return;
        }

        j++;
      });
    }
  }
  pan_copy_image: any;
  gst_copy_image:any;
  cheque_copy_image:any;
  upload_agreement:any
  basefile_pan: any;
  basefile_gst:any;
  basefile_cheque:any;
  basefile_Agreement:any;
  onChange(event,i) {
    this.pan_copy_image = event.srcElement.files[0];
    this.vendorForm.controls['pan_copy'].setValue(this.pan_copy_image ? this.pan_copy_image.name : '');
    
    
    var fileReader = new FileReader();

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
       base64 = fileLoadedEvent.target;
      this.basefile_pan = base64.result;
      
    };
    fileReader.readAsDataURL(this.pan_copy_image);
  } 

  
  url_arr:any;
  onChange1(event,i) {
    
    if(!this.editFlag){
      this.urls = [];
      

    }
    
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event) => {
                  
                  
                  this.urls.push(event.target.result);
                  
                };

                reader.readAsDataURL(event.target.files[i]);
                
        }
    }    
  }


  //update GSt
  updateGST(event,i) {
    this.UpdatedGst_Item=[];
    
    if(!this.editFlag){ 
      this.UpdatedGst_Item = [];
      

    }
    
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event) => {
                  
                  
                  this.UpdatedGst_Item.push(event.target.result);
                  
                };

                reader.readAsDataURL(event.target.files[i]);
                
        }
    }    
  }

  dd_filename = [];
  //For upload DD list
  UploadDD(event,i) {
    
    if(!this.editFlag){
      this.UploadDDlist_Item = [];
    }
    
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();
        this.dd_filename = event.target.files[i].name;
        let file_name = event.target.files[i].name;
        reader.onload = (event) => {
          
          
          let base_encoded_file = event.target.result;
          this.UploadDDlist_Item.push({'document': base_encoded_file, 'file_name': file_name });
          
          
        };

        reader.readAsDataURL(event.target.files[i]);       
      }
    }    
  }

  //For updated DD list
  UpdateDD(event,i) {
    this.UpdatedDDlist_Item = [];
    
    if(!this.editFlag){
      this.UpdatedDDlist_Item = [];
    }
    
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();
        this.dd_filename = event.target.files[i].name;
        let file_name = event.target.files[i].name;
        reader.onload = (event) => {
          
          
          let base_encoded_file = event.target.result;
          this.UpdatedDDlist_Item.push({'document': base_encoded_file, 'file_name': file_name });
          
          
        };

        reader.readAsDataURL(event.target.files[i]);       
      }
    }    
  }

  cancelled_cheque:any;
  onChange2(event,i) {
    this.cheque_copy_image = event.srcElement.files[0];
    
    var fileReader = new FileReader();

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
       base64 = fileLoadedEvent.target;
      this.basefile_cheque = base64.result
    };
    fileReader.readAsDataURL(this.cheque_copy_image);
  }
  
  onChange3(event,i) {
    this.upload_agreement = event.srcElement.files[0];
    
    var fileReader = new FileReader();

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
       base64 = fileLoadedEvent.target;
      this.basefile_Agreement = base64.result
    };
    fileReader.readAsDataURL(this.upload_agreement);
  }

  selected_subcategory_id:any = "";
  selected_subcategory_name:any = "";
  setCurrentSubCategory(event){
    this.selected_subcategory_id = event.target.value;
    this.selected_subcategory_name = event.target.options[event.target.selectedIndex].text;

  }
  onFocusFunction(id) {
 

    if( id == 'contact') {
      this.showvalidMobileNo = false;
      document.getElementById("contact").classList.remove('field_with_errors');
    }
  }

  selected_cate_subcate_list:any = [];
  AddSubCategories(record = 'new'){
    let obj = {
      "category_id": this.selected_category_id,
      "category_name": this.selected_category_name,
      "subcategory_id": this.selected_subcategory_id,
      "subcategory_name": this.selected_subcategory_name,
    }
    
    if(record == 'new'){
     if(this.vendorForm.controls['sub_category_ids'].value.includes(this.selected_subcategory_id)){
       alert("Already Added In The List");
        
     }
     else{
      this.selected_cate_subcate_list.push(obj);
      (<FormArray>this.vendorForm.controls['sub_category_ids']).push(new FormControl(this.selected_subcategory_id));
     }
    }
    else{
      var flag = 1;
      var sub_arr = this.vendorUpdateForm.controls['sub_category_ids'].value;
      for(let i = 0; i < sub_arr.length; i++ ){
        if(sub_arr[i] == this.selected_subcategory_id){
          flag = 0;
          break;
          

        }
       

      }
      if(flag == 1){
        
        this.selected_cate_subcate_list_update.push(obj);
        (<FormArray>this.vendorUpdateForm.controls['sub_category_ids']).push(new FormControl(parseInt(this.selected_subcategory_id)));

      }
      else{
        
        alert("Already Added In The List");

      }
     
    }
    
  }



    onCheckChange(event){
      if(event.target.checked){
        (this.vendorForm.get('serviceable_city_ids') as FormArray)
        .push(new FormControl(event.target.value))
        // (<FormArray>this.vendorForm.controls['serviceable_city_ids']).push(new FormControl(event.target.value));
      } else{
        var j:number = 0;
        (<FormArray>this.vendorForm.controls['serviceable_city_ids']).controls.forEach((ctr: FormControl) => {
          if(ctr.value == event.target.value) {
            // Remove the unselected element from the arrayForm
            (<FormArray>this.vendorForm.controls['serviceable_city_ids']).removeAt(j);
            return;
          }

          j++;
        });
      }
    }

    arrow_check = 'up';
    vendor_det;
    gst_list;
    gst_files;
    dd_files;
    service_city:any = [];
    getVendorDetails(value){
      this.city_name = [];
      this.loaderService.display(true);
      this.categoryService.getVendorDetails(value,this.selectedTab).subscribe(
        res=>{
          this.loaderService.display(false);
           this.vendor_det = this.selectedTab == 'pending'? res['vendor_invitation'] : res['vendor'];
           this.gst_list = this.vendor_det['gst_no'];
           this.gst_files = this.vendor_det['gst_files'];
           this.service_city = this.vendor_det['serviceable_cities'];
           this.dd_files = this.vendor_det['dd_files'];
            for(let i=0; i < this.service_city.length; i++){
             
              let city_obj:any = {};
              city_obj['id'] = this.vendor_det.serviceable_cities[i].id;
              city_obj['itemName'] = this.vendor_det.serviceable_cities[i].name;
              
              this.city_name.push(city_obj);
              
              
            }
        },
        err=>{
          
        }
        );

    } 
    onVendorFormSubmit(){
  
      if( this.vendorForm.controls['sub_category_ids'].value.length !== 0  && this.vendorForm.controls['payment_term_id'].valid && this.vendorForm.controls['importance'].valid){
      
      if(this.vendorForm.controls['gsts'].value == ''){
        alert('Please Enter Atleast One GST Number')
      }
      else{
        
        this.error = false;
        this.loaderService.display(true);
        this.categoryService.postVendorForm(this.vendorForm.value,this.urls,this.basefile_pan,this.basefile_cheque,this.UploadDDlist_Item,this.basefile_Agreement).subscribe(
           res=>{
             this.UploadDDlist_Item =[];
             this.urls =[];
             $('#addVendorModal').modal('hide'); 
             this.loaderService.display(false);
             this.successalert = true;
             this.urls = [];
             this.vendorForm.controls['dd_upload_attachments'].setValue("")
             this.successMessage = " Vendor Added successfully";
             setTimeout(function() {
                this.successalert = false;
             }.bind(this), 2000);
             this.selectedSet = 'first';
            //  window.location.reload(true);
            if(this.role == 'finance'){
              this.selectedTab = 'completed';
              this.getVendorList();
             
            }
            else{
              this.selectedTab = 'pending';
              this.getVendorInvitationList();
              
            }
			      
           },
           err=>{
            
            $('#addVendorModal').modal('hide'); 
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err['_body'])["message"];
            setTimeout(function() {
              this.erroralert = false;
             }.bind(this), 5000);
            this.loaderService.display(false);
        });
      }
    } else{
      this.error= true;
    }
    }
    confirmAndDelete(id: number){
      if(confirm("Are You Sure You Want To delete?") == true){
        this.loaderService.display(true);
        this.deleteVendor(id);

      }

    }
    search_value: any;
    onKey(event: any) { // without type info
      this.search_value = event.target.value ;
      if(this.selectedTab == 'completed'){
        this.getVendorList('',this.search_value);
      }else{
        this.getVendorInvitationList('',this.search_value)
      }
    }  

    private deleteVendor(id: number){
   
        this.categoryService.deleteVendor(id).subscribe(

        res=>{
          alert("deleted successfully");
          this.loaderService.display(false);
          this.getVendorList();
          // this.getProposalList(this.project_id);
        },
        err=>{
          
          this.loaderService.display(false);
        });

    }
    vendor_Id;
    pan_image:any;
    vendor_details; 
    sub_cat = [];
    city_name = [];
    editFlag:boolean = false;
    selected_cate_subcate_list_update = [];
    getVendorForUpdate(vendorId){
     
      this.getStateList();
      this.getPaymentTerm();
      this.getImportantList();
      this.getVendorCategories();
      
      this.loaderService.display(true);
      this.urls = [];
      this.contents_to_delete_ddlist = [];
      this.UpdatedDDlist_Item=[];
      this.UpdatedGst_Item=[];
      this.city_name  = [];
      this.selectedCities = [];
      this.selectedSet = 'first';
      this.editFlag = true;
      this.vendor_Id = vendorId;
      this.dropdownCityList;
      this.selected_cate_subcate_list_update = [];
      this.vendorUpdateForm.setControl('sub_category_ids', new FormArray([]));
      this.UploadDDlist_Item = [];
      
      
      this.categoryService.getVendorDetails(vendorId, this.selectedTab).subscribe(
        res=>{

          this.loaderService.display(false);
          this.vendor_details =this.selectedTab == 'pending' ? res['vendor_invitation'] : res['vendor']
          this.sub_cat =  this.vendor_details['vendor_sub_categories'];
          this.vendorUpdateForm.controls['name'].setValue( this.vendor_details.name);
          this.vendorUpdateForm.controls['dd_upload_attachments'].setValue("")
          this.vendorUpdateForm.controls['address'].setValue( this.vendor_details.address);
          this.vendorUpdateForm.controls['pan_no'].setValue( this.vendor_details.pan_no);
          this.vendorUpdateForm.controls['contact_person'].setValue( this.vendor_details.contact_person);
          this.vendorUpdateForm.controls['contact_number'].setValue( this.vendor_details.contact_number);
          this.vendorUpdateForm.controls['email'].setValue( this.vendor_details.email);
          // this.vendorUpdateForm.controls['gst_reg_no'].setValue(res.vendor.gst_reg_no);
          this.vendorUpdateForm.controls['account_holder'].setValue( this.vendor_details.account_holder);
          this.vendorUpdateForm.controls['account_number'].setValue( this.vendor_details.account_number);
          this.vendorUpdateForm.controls['bank_name'].setValue( this.vendor_details.bank_name);
          this.vendorUpdateForm.controls['branch_name'].setValue( this.vendor_details.branch_name);
          this.vendorUpdateForm.controls['ifsc_code'].setValue( this.vendor_details.ifsc_code);
          this.vendorUpdateForm.controls['contact_number'].setValue( this.vendor_details.contact_number);
          this.vendorUpdateForm.controls['dd_score'].setValue( this.vendor_details.dd_score);
          this.vendorUpdateForm.controls['payment_term_id'].setValue( this.vendor_details.payment_term_id);
          this.vendorUpdateForm.controls['importance'].setValue( this.vendor_details.importance);
          this.vendorUpdateForm.controls['state_id'].setValue( this.vendor_details.state_id);
          this.vendorUpdateForm.setControl('gsts', this.formBuilder.array([]));
          for(let gst_val of  this.vendor_details.gst_no ){
            (<FormArray>this.vendorUpdateForm.controls['gsts']).push(this.UpdateGstValues(gst_val));
            

          }
          

         
                  
          
          this.vendorUpdateForm.controls['city'].setValue(this.vendor_details.city);
          this.vendorUpdateForm.controls['serviceable_city_ids'].setValue(this.vendor_details.serviceable_cities)
         
          for(let city of  this.vendor_details.serviceable_cities){
            let city_obj:any = {};
            city_obj['id'] = city.id;
            city_obj['itemName'] = city.name;
            this.selectedCities.push(city_obj);
            this.city_name.push(city.name);
          }
          

          for(let sub_cat of  this.vendor_details.vendor_sub_categories){
            let cate_obj:any = [];
            cate_obj["category_id"]= sub_cat.parent_category_id;
            cate_obj['category_name'] = sub_cat.parent_category_name;
            cate_obj['subcategory_name'] = sub_cat.category_name;
            cate_obj['subcategory_id'] = sub_cat.id;
            this.selected_cate_subcate_list_update.push(cate_obj);
            (<FormArray>this.vendorUpdateForm.controls['category_ids']).push(new FormControl(sub_cat.parent_category_id));
            (<FormArray>this.vendorUpdateForm.controls['sub_category_ids']).push(new FormControl(sub_cat.id));
          }
         
          for(let i=0 ; i<  this.vendor_details.gst_files.length;i++ ){

            this.urls.push( this.vendor_details.gst_files[i].base64_code);
            

          }
        },
        err=>{
          
          this.loaderService.display(false);
        });

    }

    onVendorUpdateFormSubmit(){
      
      const invalid = [];
      const controls = this.vendorUpdateForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
          }
      } 
      if(this.vendorUpdateForm.valid && this.vendorUpdateForm.controls['sub_category_ids'].value.length >0){
        this.loaderService.display(true);

         this.categoryService.postUpdateVendorForm(this.vendor_Id,this.vendorUpdateForm.value,this.basefile_pan,this.UpdatedGst_Item,this.basefile_cheque,this.UpdatedDDlist_Item,this.contents_to_delete_ddlist, this.selectedTab,this.basefile_Agreement).subscribe(
         res=>{
           this.error = false;

           $('#vendorUpdateModal').modal('hide'); 
           this.loaderService.display(false);
           this.successalert = true;
           this.successMessage = " Vendor Updated successfully";
           const arr = <FormArray>this.vendorUpdateForm.controls.serviceable_city_ids;
           arr.controls = [];
           
           setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
           this.selected_cate_subcate_list = [];
           this.urls = [];
           if(this.selectedTab == 'pending'){
             this.getVendorInvitationList(this.current_page_invitation);
           }
           else{
            this.getVendorList(this.current_page);
           }
          //  window.location.reload(true);
         },
         err=>{          
            $('#vendorUpdateModal').modal('hide'); 
            this.erroralert = true;

            this.errorMessage = <any>JSON.parse(err['_body'])["message"];

            setTimeout(function() {
            this.erroralert = false;
           }.bind(this), 5000);
          this.loaderService.display(false);
         });

      }
      else if(this.vendorUpdateForm.controls['gsts'].value == '' || this.vendorUpdateForm.controls['name'].value == '' || this.vendorUpdateForm.controls['address'].value == '' || this.vendorUpdateForm.controls['contact_person'].value == '' || this.vendorUpdateForm.controls['contact_number'].value == '' || this.vendorUpdateForm.controls['account_holder'].value == '' || this.vendorUpdateForm.controls['account_number'].value == '' || this.vendorUpdateForm.controls['bank_name'].value == '' || this.vendorUpdateForm.controls['branch_name'].value == ''  || this.vendorUpdateForm.controls['sub_category_ids'].value.length === 0 ){
        alert('Please Enter All required Field');
        this.error = true;
      }
    }
    gst_val:any;
    resetForm(){
      this.vendorForm.reset();
      this.selectedSet = 'first';
      this.selected_cate_subcate_list = [];
      this.gst_val = this.vendorForm.controls['gsts'].value;
      

    }
    filterEvents(event){
      this.filterMainType = event.target.value;
      var value = event.target.value;
      if( value == 'all'){
       this.getVendorList();
      }

    }
    
    status;
    filterId;
    filterCtegory = 'all';
    handleFilterEvent(event,type){
      this.loaderService.display(true);
      this.status =  type;
      this.filterId = event.target.value;
      if(type == 'category'){
          this.filterCtegory = this.filterId;
      }
      else if(type == 'sub_category'){
        // this.filterSubCategory = this.filterId;
      }
      if( this.filterId == 'all'){
        this.filterId = '';
        // this.status = '';

      }
      else{
        if(type == 'category'){
          this.getSubCategoriesValues(this.filterId);              
        }
      }
      if(this.selectedTab !== 'pending'){
        this.getVendorList();
      }
      else{
        this.getVendorInvitationList();
      } 
    }

    
    removeItem(value){
      for(var i=0;i<this.selected_cate_subcate_list.length; i++){
        var obj = this.selected_cate_subcate_list[i];
        if(obj.subcategory_id == value){
          this.selected_cate_subcate_list.splice(i, 1);
          var j:number = 0;

          (<FormArray>this.vendorForm.controls['sub_category_ids']).controls.forEach((ctr: FormControl) => {
            if(ctr.value == value) {
              // Remove the unselected element from the arrayForm
              (<FormArray>this.vendorForm.controls['sub_category_ids']).removeAt(j);
              return;
            }

            j++;
          });
        }

      }

    }
    removeUpdateItem(value){
      for(var i=0;i<this.selected_cate_subcate_list_update.length; i++){
        var obj = this.selected_cate_subcate_list_update[i];
        if(obj.subcategory_id == value){
          this.selected_cate_subcate_list_update.splice(i, 1);
          var j:number = 0;

          (<FormArray>this.vendorUpdateForm.controls['sub_category_ids']).controls.forEach((ctr: FormControl) => {
            if(ctr.value == value) {
              // Remove the unselected element from the arrayForm
              (<FormArray>this.vendorUpdateForm.controls['sub_category_ids']).removeAt(j);
              return;
            }

            j++;
          });
        }

      }

    }
  panInputChange(event){
    var value = event.target.value;
    var value2 = value.toUpperCase();
    $('#PanId').val(value2);
    for(var i =0 ; i<this.itemList.length;i++){
      var value1 = value.toUpperCase();
      if(this.itemList[i].pan_no == value1 ){
        alert("Pan Number Already exists");
        $('#PanId').val('');

      }
    }
    


  }  
  panInputUpdateChange(event){
    var value = event.target.value;
    var value2 = value.toUpperCase();
    $('#PanIdChng').val(value2);

    for(var i =0 ; i<this.itemList.length;i++){
      var value1 = value.toUpperCase();
      if(this.itemList[i].pan_no == value1 ){
        alert("Pan Number Already exists");
        $('#PanIdChng').val('');

      }
    }


  }
  removeGstValues(i){
    <FormArray>this.vendorForm.get('gsts')['controls'].splice(i,1);
    this.vendorForm.controls['gsts'].value.splice(i,1);

  }
  removeGstValuesForUpdate(i){
    <FormArray>this.vendorUpdateForm.get('gsts')['controls'].splice(i,1);
    this.vendorUpdateForm.controls['gsts'].value.splice(i,1);
    
  }
  AddGstValues(): void {
      (<FormArray>this.vendorForm.controls['gsts']).push(this.createGstValues());

  }
  AddGstValuesForUpdate(){
    (<FormArray>this.vendorUpdateForm.controls['gsts']).push(this.createGstValues());

  }

  createGstValues(): FormGroup {
    return this.formBuilder.group({
      gst_reg_no : new FormControl("",Validators.required),
      
    });
  }
  getGsts(form){
    return form.get('gsts').controls;
  }

  deleteFields(){

  }
  UpdateGstValues(value): FormGroup {
    return this.formBuilder.group({
      gst_reg_no : new FormControl(value)
      
    });
  }
  removeUpadteContent(){
    this.urls = [];
    this.editFlag = false;
    this.selectedSet = 'first';
  }

  //to remove gst files
  removeGstFiles(index,id){
    this.urls.splice(index,1);
    this.vendor_details.gst_files.splice(index,1);
    this.contents_to_delete_ddlist.push(id);
    
  }

  //to remove DD files 
  removeddFiles(index,id){
    this.UploadDDlist_Item.splice(index,1);
    this.vendor_details.dd_files.splice(index,1);
    this.contents_to_delete_ddlist.push(id);
    
  }

  addVendorClick(){
    this.getStateList();
    this.getPaymentTerm();
    this.getImportantList();
    this.getVendorCategories();
    this.selectedSet = 'first';
    this.UploadDDlist_Item=[];
    this.urls = [];
  }

  /*to enable downlaod btn*/
  enadleDownload(){
    if($("#panelFurniture").prop('checked')==true){
      $("#download").attr("disabled", false);
    }
    else if($("#non-panelFurniture").prop('checked')==true){
      $("#download").attr("disabled", false);
    }
    else{
      $("#download").attr("disabled", true);
    }
  }

  //to convert b64 to blob file
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  //to download DD-list
  dowloadDDlist(){
    if($("#non-panelFurniture").prop('checked')==true && $("#panelFurniture").prop('checked')==true){
      this.file_type = 'both';
      
    }
    else if($("#non-panelFurniture").prop('checked')==true){
      this.file_type = 'non_panel_file';
      
    }
    else if($("#panelFurniture").prop('checked')==true){
      this.file_type = 'panel_file';
      
    }

    this.categoryService.dowloadDDlist(this.file_type).subscribe(
      res =>{

        if(JSON.parse(res._body)['panel_file'] != null && JSON.parse(res._body)['non_panel_file'] !=null ){
          //to download panel_file
          var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          var b64Data =  res.panel_file;
          var b64Data =  JSON.parse(res._body)['panel_file'];
          // 
          var name= 'Panel_file'+'.xlsx';
          var blob = this.b64toBlob(b64Data, contentType,512);
          var blobUrl = URL.createObjectURL(blob);
          // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let dwldLink_panel_file = document.createElement("a");
          // let url = URL.createObjectURL(blob);
          let isSafariBrowser_panel_file = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
          if (isSafariBrowser_panel_file) {  //if Safari open in new window to save file with random filename.
            dwldLink_panel_file.setAttribute("target", "_blank");
          }
          dwldLink_panel_file.setAttribute("href", blobUrl);
          dwldLink_panel_file.setAttribute("download", name);
          dwldLink_panel_file.style.visibility = "hidden";
          document.body.appendChild(dwldLink_panel_file);
          dwldLink_panel_file.click();
          document.body.removeChild(dwldLink_panel_file);



          //to download non_panel_file
          var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          var b64Data =  res.non_panel_file;
          var b64Data =  JSON.parse(res._body)['non_panel_file'];
          // 
          var name= 'non_panel_file'+'.xls';
          var blob = this.b64toBlob(b64Data, contentType,512);
          var blobUrl = URL.createObjectURL(blob);
          // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let dwldLink = document.createElement("a");
          // let url = URL.createObjectURL(blob);
          let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
          if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
          }
          dwldLink.setAttribute("href", blobUrl);
          dwldLink.setAttribute("download", name);
          dwldLink.style.visibility = "hidden";
          document.body.appendChild(dwldLink);
          dwldLink.click();
          document.body.removeChild(dwldLink);
        }

        else if(JSON.parse(res._body)['panel_file'] != null){
          var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          // var b64Data =  res.panel_file;
          var b64Data =  JSON.parse(res._body)['panel_file'];
          // 
          var name= 'Panel_file'+'.xlsx';
          var blob = this.b64toBlob(b64Data, contentType,512);
          var blobUrl = URL.createObjectURL(blob);
          // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let dwldLink_panel_file = document.createElement("a");
          // let url = URL.createObjectURL(blob);
          let isSafariBrowser_panel_file = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
          if (isSafariBrowser_panel_file) {  //if Safari open in new window to save file with random filename.
            dwldLink_panel_file.setAttribute("target", "_blank");
          }
          dwldLink_panel_file.setAttribute("href", blobUrl);
          dwldLink_panel_file.setAttribute("download", name);
          dwldLink_panel_file.style.visibility = "hidden";
          document.body.appendChild(dwldLink_panel_file);
          dwldLink_panel_file.click();
          document.body.removeChild(dwldLink_panel_file);
        }

        else if(JSON.parse(res._body)['non_panel_file'] != null){
          var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          var b64Data =  res.non_panel_file;
          var b64Data =  JSON.parse(res._body)['non_panel_file'];
          // 
          var name= 'non_panel_file'+'.xls';
          var blob = this.b64toBlob(b64Data, contentType,512);
          var blobUrl = URL.createObjectURL(blob);
          // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let dwldLink = document.createElement("a");
          // let url = URL.createObjectURL(blob);
          let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
          if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
          }
          dwldLink.setAttribute("href", blobUrl);
          dwldLink.setAttribute("download", name);
          dwldLink.style.visibility = "hidden";
          document.body.appendChild(dwldLink);
          dwldLink.click();
          document.body.removeChild(dwldLink);
        }
      },
      err => {
        this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
      }
    );

    $("#panelFurniture").prop("checked", false);
    $("#non-panelFurniture").prop("checked", false);
  }
  list_vendor_tags:any;
  getlistVendorTags(){
    this.loaderService.display(true);
    this.categoryService.getListVendorTags().subscribe(
      res=>{ 
        this.list_vendor_tags = res.name;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }
  onchangevendor(tag_value,vendor_Id){
  if (confirm("Are you sure you want change tags status?")) {
        this.setVendorTags(tag_value,vendor_Id);
    } else {
        this.erroralert = true;
        this.errorMessage = "Okay.. Do't Worry Your Data Still Safe";
    }       
  }
  setVendorTags(tag_value,vendor_Id){
    this.loaderService.display(true);
    this.categoryService.SetVendorTags(tag_value,vendor_Id).subscribe(
      res=>{ 
        this.successalert = true;
        this.successMessage = "Vendor Tag Updated successfully";
        this.loaderService.display(false);
        this.getVendorList(this.page_number,this.search_val);
      },
      err=>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }
  updateInvitationStatus(status,invitation_id){
	let status_msg = (status == 'approved'? 'Approve' : 'Reject');
	if (confirm(`Are You Sure You Want To ${status_msg} This Invitation ?`) == true) {
		this.loaderService.display(true);
		this.categoryService.updateInvitationStatus(status,invitation_id).subscribe(res=>{  
			this.successalert = true;
			this.successMessage = "Status Updated successfully";
			this.loaderService.display(false);
      if(status == 'approved'){
         this.selectedTab = 'completed';
      }else{
        this.selectedTab = 'pending';
      }
      this.getVendorList();
      this.getVendorInvitationList();
		   },err=>{
			this.loaderService.display(false);
			this.erroralert = true;
			this.errorMessage = <any>JSON.parse(err['_body']).message;
			setTimeout(function() {
				 this.erroralert = false;
			}.bind(this), 2000);
		
		   })
	}
  
  }
}

