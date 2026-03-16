import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/services/loader.service';

declare var $: any;
import { environment } from "environments/environment";
import * as _moment from "moment";
import { LeadService } from 'app/platform/lead/lead.service';
import { CategoryService } from '../category.service';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-mto-batches',
  templateUrl: './mto-batches.component.html',
  styleUrls: ['./mto-batches.component.css'],
  providers: [CategoryService,LeadService],
})
export class MtoBatchesComponent implements OnInit {

  constructor(
    private CategoryService: CategoryService,
    private LoaderService: LoaderService,
    private formBuilder: FormBuilder,
    private LeadService: LeadService
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem("user");

    this.getBatchData("");
    this.PushForm()
    this.getVendorList2()


  }
  successalert: boolean = false;
  successMessage: any;
  erroralert: boolean = false;
  errorMessage: any;
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


  role: string;
  batch_list: any;
  current_page:any;
  search:any = '';
  headers_res;
  per_page;
  total_page;

  searchFilter(val) {
    this.search = val;
    this.getBatchData(1);
  }


  getBatchData(e) {
    if (e == undefined || e == "") {
      this.current_page = 1;
    } else {
      this.current_page = e;
      
    }
    this.LoaderService.display(true);
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
      this.LoaderService.display(false);
    });
  }
  BatchDetailslist:any;

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

  UploadBom(id){

    this.LoaderService.display(true);
    this.LeadService.UploadProBom(id).subscribe(res=>{
      this.LoaderService.display(false);
       this.successMessageShow("Uploaded Sucessfully")
       this.getBatchData(this.current_page)
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

  }


batchData ;
  GetBatchDetais(id){
   this.LoaderService.display(true);
   this.LeadService.FetchBatchItems(id).subscribe(res=>{
     this.LoaderService.display(false);
    this.BatchDetailslist = res.line_items;
    this.batchData = res;
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
     this.Order_id = bat.order_id?bat.order_id:''
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
   afterfileuplad : boolean = false
  onChangeHw(event,file_type) {
     
    $('.parent-'+file_type).addClass('divActive');  
    var fileReader = new FileReader();
    var i = 0;
    this.file_name2 = event.target.files[i].name;
    this.attachment_file2 =event.target.files[0] || event.srcElement.files[0];

    if(this.uploadType == 'HW'){
      this.submitValFileHW()
      this.HWSubmit = false

    } else if (this.uploadType == 'RM'){
      this.submitValFileRM()

    } else if (this.uploadType == 'profile'){
      this.submitValFileProfile()

    } else if(this.uploadType == 'glass' || this.uploadType == 'softpad' || this.uploadType == 'special_hardware' || this.uploadType == 'metal_frame'  ){
      this.submitValFileGlassSoftpad()
    }
    else if(this.uploadType == 'nts' ){
      this.submitValFilents()
    }
    if(this.uploadType == 'softpad'){

      this.SoftpadEdit = false
    } else if(this.uploadType == 'glass'){
  
      this.GlassEdit = false
  
    } else if(this.uploadType == 'profile'){
  
      this.ProfileEdit = false
    } else if (this.uploadType == 'special_hardware') {
  
      this.SpecialHardEdit = false
  
    } else {
      if(this.uploadType == 'metal_frame'){
        this.MetalFrameEdit = false

      }
      
    }
   

    
  } 
  file_name2 ;
  attachment_file2;
  loading = false;
  uploadType='';
  FIleSampleUrl ;
  SubmitHW(bat,type,file){
    $("#UploadModal").modal("show");
    this.file_name2 = ''
    this.attachment_file2 ='';
    this.BatDetails = bat;
    this.uploadType = type;
    this.FIleSampleUrl  = file

   }

   HWBom_ID;
   HardwareItems= [];
   RMBom_ID;
   RMItems =[]
   submitValFileHW(){

   

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
      if($('#BomHWModal2').hasClass('show') == false){
        $('#BomHWModal2').modal('show')
      }
      this.loading = false
      this.Order_id = '';
      this.HWBom_ID = res.mto_bom_hw_id;
      this.HardwareItems = res.sheet_items.mto_bom_hw_items
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.loading = false
    })

   }
   RmData
   submitValFileRM(){
    let Obj={
      id : this.RM_bat_id,
      order_id : this.attachment_file2
    }
    this.loading = true
    this.LeadService.RMUpload(Obj).subscribe(res=>{
      this.LoaderService.display(false);
      this.GetBatchDetais(this.BatchId);
      this.getBatchData(this.current_page)
      this.successMessageShow('uploaded Sucessfully');
      $("#UploadModal").modal("hide");
      this.loading = false
      this.Order_id = '';
      this.RMBom_ID = res.mto_bom_rm_id;
      this.RMItems = res.sheet_items.mto_bom_rm_items
      this.RmData = res;
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.loading = false
    })
   }

   profileItem =[]
   selectedOptionValue =""
   selectedOptionValuebom =''
   ProfileItemTypeData(){
      this.LeadService.ProfileItemTypeDropDown().subscribe(res => {
          this.profileItem = res.item_type
          console.log(res)
      }, (err) => {
        console.log(err)
      })
   }

   headingkeyswheel3(e){
    if(e){      
      return Object.keys(e)
     }
  }


  openProfileOrderId(){
    $("#profileOrderModal").modal("show");
  }

  profileDisplayorderId :any

  profileMapOrderId(){
    this.LoaderService.display(true);
    this.LeadService.profileOrderIdDate(this.RM_bat_id).subscribe(res => {
      this.LoaderService.display(false);
      this.profileDisplayorderId = res.mto_bom_order_data

      console.log(res)
    } , (err) => {
      this.LoaderService.display(false);
      console.log(err)
    })
  }

  onChangeOfLeadType(e){
    console.log(e)
      this.ProfileEdit = false
      this.GetProfileData()
      this.profile_ids = []
    
  }
  onChangeOfLeadTypebom(e){
    console.log(e)
   
      
     
    
  }
    singleprofile_id :any
    ProfileItems  = []
   submitValFileProfile(){
    let x = this.profile_ids.map(e => e.id)
    let Obj={
      id : this.RM_bat_id,
      order_id : this.attachment_file2,
      item_type : this.selectedOptionValue,
      ids_order : x

    }
    this.loading = true
    this.LeadService.fileUploadProfile(Obj).subscribe(res=>{
      this.LoaderService.display(false);
      this.GetBatchDetais(this.BatchId);
      this.getBatchData(this.current_page)
      this.successMessageShow('uploaded Sucessfully');
      this.afterfileuplad = true
      $("#UploadModal").modal("hide");
      this.loading = false
      this.Order_id = '';
      this.singleprofile_id = res.mto_bom_profile_id;
      this.ProfileItems = res.sheet_items.mto_bom_profile_items
      this.Profiledata = res;
      this.profile_ids =[];
      this.profile_idsCheck =[]
      if(this.ProfileItems[0]){
        this.ProfileItems[0].order_ids.forEach(element => {

         this.profileDisplayorderId.forEach(order => {

          if(element == order.order_id_name ){
            this.profile_ids.push({
              id : order.order_id,
              order_id_name : order.order_id_name
            })
            this.profile_idsCheck.push(order.order_id)
          }
           
         });
          
        });
     

      }

     
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.profile_idsCheck =[]
      this.loading = false
      this.profile_ids =[]
    })
   }
   singlepnts_id :any
   ntsItems  = []
  submitValFilents(){
   let x = this.nts_ids.map(e => e.id)
   let Obj={
     id : this.RM_bat_id,
     order_id : this.attachment_file2,
     ids_order : x

   }
   this.loading = true
   this.LeadService.fileUploadnts(Obj).subscribe(res=>{
     this.LoaderService.display(false);
     this.GetBatchDetais(this.BatchId);
     this.getBatchData(this.current_page)
     this.successMessageShow('uploaded Sucessfully');
     this.afterfileuplad = true
     $("#UploadModal").modal("hide");
     this.loading = false
     this.Order_id = '';
     this.singlepnts_id = res.mto_bom_nts_id     ;
     this.ntsItems = res.sheet_items.mto_bom_nts_items
   },
   (err) => {
     this.LoaderService.display(false);
     this.errorMessageShow(JSON.parse(err['_body']).message);
     this.loading = false
   })
  }


   GlassProfileID :any
   SoftPadProfileID :any
   softPadItems =[]
   GlassItems = []
   submitValFileGlassSoftpad(){
    let x = this.glass_ids.map(e => e.id)
    let y = this.softPad_ids.map(e => e.id)
    let z = this.S_hw_ids.map(e => e.id)
    let zx = this.mf_ids.map(e => e.id)
    let Obj={
      id : this.RM_bat_id,
      order_id : this.attachment_file2,
      ids_order : this.uploadType == 'glass' || this.uploadType == 'special_hardware'  ? this.uploadType == 'glass'? x:z :this.uploadType == 'softpad'? y:zx,
      upload_type : this.uploadType == 'glass' || this.uploadType == 'special_hardware' ?this.uploadType == 'glass'?  'glass':'special_hardware' : this.uploadType == 'softpad'?'softpad':'metal_frame'

    }
    this.loading = true
    this.LeadService.fileUploadForGlassSoftPad(Obj).subscribe(
      res=>{
      this.LoaderService.display(false);
      this.GetBatchDetais(this.BatchId);
      this.getBatchData(this.current_page)
      this.successMessageShow('uploaded Sucessfully');
      this.afterfileuplad = true
      $("#UploadModal").modal("hide");
      this.loading = false
      this.Order_id = '';

      console.log(res)
      this.GlassData = res;

      if(this.uploadType == 'glass'){
        this.GlassProfileID = res.mto_bom_upload_id;
        this.GlassItems = res.sheet_items.mto_bom_upload_items
        this.glass_ids =[];
        this.glass_idsCheck =[]
        if(this.GlassItems[0]){
          this.GlassItems[0].order_ids.forEach(element => {
  
           this.profileDisplayorderId.forEach(order => {
  
            if(element == order.order_id_name ){
              this.glass_ids.push({
                id : order.order_id,
                order_id_name : order.order_id_name
              })
              this.glass_idsCheck.push(order.order_id)
            }
             
           });
            
          });
       
  
        }
      }else{

        this.SoftPadProfileID = res.mto_bom_upload_id;
        this.softPadItems = res.sheet_items.mto_bom_upload_items

        if(this.uploadType == 'softpad'){


          this.softPad_ids =[];
          this.softPad_idsCheck =[]
          if(this.softPadItems[0]){
            this.softPadItems[0].order_ids.forEach(element => {
    
             this.profileDisplayorderId.forEach(order => {
    
              if(element == order.order_id_name ){
                this.softPad_ids.push({
                  id : order.order_id,
                  order_id_name : order.order_id_name
                })
                this.softPad_idsCheck.push(order.order_id)
              }
               
             });
              
            });
         
    
          }

        } else {
          if(this.uploadType == 'special_hardware'){

            this.S_hw_ids =[];
          this.S_hw_idsCheck =[]
          if(this.softPadItems[0]){
            this.softPadItems[0].order_ids.forEach(element => {
    
             this.profileDisplayorderId.forEach(order => {
    
              if(element == order.order_id_name ){
                this.S_hw_ids.push({
                  id : order.order_id,
                  order_id_name : order.order_id_name
                })
                this.S_hw_idsCheck.push(order.order_id)
              }
               
             });
              
            });
         
    
          }

          } else{

            if(this.uploadType == 'metal_frame'){

              this.mf_ids =[];
              this.mf_idsCheck =[]
              if(this.softPadItems[0]){
                this.softPadItems[0].order_ids.forEach(element => {
        
                 this.profileDisplayorderId.forEach(order => {
        
                  if(element == order.order_id_name ){
                    this.mf_ids.push({
                      id : order.order_id,
                      order_id_name : order.order_id_name
                    })
                    this.mf_idsCheck.push(order.order_id)
                  }
                   
                 });
                  
                });
             
        
              }

            }

          }
        }
      }
     
     
    },
    (err) => {
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.loading = false
      this.softPad_idsCheck =[]
      this.S_hw_idsCheck =[];
      this.mf_idsCheck =[]
      this.glass_idsCheck =[]
      this.glass_ids =[]
      this.softPad_ids =[]
      this.S_hw_ids =[];
      this.mf_ids = []
      
    })
   }

   intialcolorGreen  : boolean = false

   profile_ids = []
   glass_ids = []
   softPad_ids = []
   nts_ids =[]
   S_hw_ids = [];
   mf_ids = [];
   profile_idsCheck= []
   glass_idsCheck =[];
   softPad_idsCheck =[];
   nts_idsCheck =[];
   S_hw_idsCheck =[];
   mf_idsCheck =[];



   pushtheItemProfile(e ,id , name , index , ValidateMissing2 ){
    if(ValidateMissing2 == 'profile'){
      const valueCheck = id
      const existingObject = this.profile_ids.find(obj => obj.id === valueCheck);
      console.log(e)
        if(!existingObject){
          // $('#profileitem'+id).addClass("profilebrackgroundRed");
          // $('#profileitem'+id).removeClass("profilebrackgroundGreen");
          if(this.profile_ids.indexOf(id) == -1){
            this.profile_ids.push({
              id : id,
              order_id_name : name
            })
            this.profile_idsCheck.push(id)
            
          }
          this.successMessageShow('Order ID Mapped Successfully')
        }
    }else if(ValidateMissing2 == 'glass'){
      const valueCheck = id
      const existingObject = this.glass_ids.find(obj => obj.id === valueCheck);
      console.log(e)
        if(!existingObject){
        
          if(this.glass_ids.indexOf(id) == -1){
            this.glass_ids.push({
              id : id,
              order_id_name : name
            })
            this.glass_idsCheck.push(id)
          }
          this.successMessageShow('Order ID Mapped Successfully')
        }
    }else if(ValidateMissing2 == 'nts'){
      const valueCheck = id
      const existingObject = this.nts_ids.find(obj => obj.id === valueCheck);
      console.log(e)
        if(e.target.checked && !existingObject){
          $('#ntsItem'+id).addClass("profilebrackgroundRed");
          $('#ntsItem'+id).removeClass("profilebrackgroundGreen");
          if(this.nts_ids.indexOf(id) == -1){
            this.nts_ids.push({
              id : id,
              order_id_name : name
            })
          }
          this.successMessageShow('Order ID Mapped Successfully')
        }
      }
      else if(ValidateMissing2 == 'special_hardware'){
        const valueCheck = id
        const existingObject = this.S_hw_ids.find(obj => obj.id === valueCheck);
        console.log(e)
          if(!existingObject){
           
            if(this.S_hw_ids.indexOf(id) == -1){
              this.S_hw_ids.push({
                id : id,
                order_id_name : name
              })

              this.S_hw_idsCheck.push(id)
            }
            this.successMessageShow('Order ID Mapped Successfully')
          }
        }
        else if(ValidateMissing2 == 'metal_frame'){
          const valueCheck = id
          const existingObject = this.mf_ids.find(obj => obj.id === valueCheck);
          console.log(e)
            if(!existingObject){
            
              if(this.mf_ids.indexOf(id) == -1){
                this.mf_ids.push({
                  id : id,
                  order_id_name : name
                })
                this.mf_idsCheck.push(id)
              }
              this.successMessageShow('Order ID Mapped Successfully')
            }
          }
    else{
      const valueCheck = id
      const existingObject = this.softPad_ids.find(obj => obj.id === valueCheck);
      console.log(e)
        if(!existingObject){
         
          if(this.softPad_ids.indexOf(id) == -1){
            this.softPad_ids.push({
              id : id,
              order_id_name : name
            })
            this.softPad_idsCheck.push(id)
          }
          this.successMessageShow('Order ID Mapped Successfully')
        }
    }
      console.log(this.profile_ids)
      console.log(this.glass_ids)
      console.log(this.softPad_ids)
      console.log(this.nts_ids)
   }
   removeProfileItem(data , i , type){
    if(type == 'profile'){
      // $('#profileitem'+data).removeClass("profilebrackgroundRed");
  
      this.profile_ids.splice(i , 1)
      this.profile_idsCheck.splice(i , 1)
    }else if(type == 'glass'){

      this.glass_ids.splice(i , 1)
      this.glass_idsCheck.splice(i , 1)
    }
    else if(type == 'special_hardware'){

   
      this.S_hw_ids.splice(i , 1)
      this.S_hw_idsCheck.splice(i , 1)
    }
    else if(type == 'metal_frame'){

     
      this.mf_ids.splice(i , 1)
      this.mf_idsCheck.splice(i , 1)
    }

    else if(type == 'nts'){

    
      this.nts_ids.splice(i , 1)
    }
    
    else{
     
      this.softPad_ids.splice(i , 1)
      this.softPad_idsCheck.splice(i , 1)
    }
   }

   show_modify: boolean = false;
   lead_id_batch: any = "";
   batch_id_batch: any = "";
   selected_ids: any = [];
   list_arr: any = {};
   list_boqs: any = [];
   boq_name: any = [];
   table_arr: any = [];
   selc_lead_id: any = "";
   all_boqs: any = [];
   selectedLeadsArr: any = [];
   selectlistBoq: any;
   list_boq: any = [];
   selectedBoq: any = [];
 
 
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
   
  }
  lead_id;

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
  updated_batch_num
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
  SearchString =''
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
  
  }
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

  // deleteBoqupdate(boq_id, index) {
  //   for (var i = 0; i < this.update_id.length; i++) {
  //     // if (this.update_table_arr[i].quotations.length != 0){
  //     for (var j = 0; j < this.update_id[i].quotation_name.length; j++) {
  //       if (this.update_id[i].quotation_name[j] == boq_id) {
  //         this.update_id[i].quotation_name.splice(j, 1);
  //         this.update_id[i].quotation_id.splice(j, 1);
  //       }
  //       if (this.update_id[i].quotation_name.length == 0) {
  //         this.update_id.splice(i, 1);
  //       }
  //     }
  //     // }
  //   }
  
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
  }
  ValidateMissing2 =''
  ChangeTab(name){
    this.ValidateMissing2 = name;

    if(name == 'softpad'){

      this.SoftpadEdit = false
    } else if(name == 'glass'){
  
      this.GlassEdit = false
  
    } else if(name == 'profile'){
  
      this.ProfileEdit = false
    } else if (name == 'special_hardware') {
  
      this.SpecialHardEdit = false
  
    } else {
      if(name == 'metal_frame'){
        this.MetalFrameEdit = false

      }
    }

    if(name == 'profile'){
      this.ProfileItemTypeData()
    }
  
  
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
   closeUpdateMtoBatch() {
    this.lead_detail = [];
    this.update_lead_id = "";
    this.selectlistBoqupdate = null;
    this.list_boqs_update = [];
    $("#crateBatchModal").modal("show");
    $("#updateBatchModal").modal("hide");
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

  batch_id_mod: any = "";
  updated_ids: any = [];
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
  DestroyBatch(id){
    if (confirm("Are you sure to remove the item") == true) {
      this.LoaderService.display(true);
      this.CategoryService.DestroyBatch(id).subscribe(res=>{
        this.LoaderService.display(false);
        
        this.getBatchData(this.current_page)
        this.successMessageShow("Deleted Successfully")
      },
      err=>{
        this.LoaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
         
      }) 
    }
  }

  data_heir;
FullHierData;
MapBom_id;
ChildSearch;
vendorFilterSel;
selectType;
Maptype
  mapCatItem(id,Condi,type,pro?){   

    if(!Condi){
    this.MapBom_id =id  ;
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.selectType = "";
    this.Maptype = type;
     $('#BomMappingModal').modal('show');
     this.selectType = ""
     this.GetProductList2("")

    }
    

  }
  HardDetails;
  itemCodeData
  mapCatItempro(id,Condi,type,pro){
    
    console.log(pro,Condi,"check")
    if(!Condi){
    this.MapBom_id =id  ;
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.selectType = "";
    this.Maptype = type;
    this.HardDetails = pro
    console.log(this.HardDetails,"pro")
    this.layersSearchCreate = 'searchlayer'
     $('#LayeresBomUpload').modal('show');
     this.selectType = ""
     this.GetProductList2("");

     this.CategoryService.GetItemCodeDetails(this.ValidateMissing2 == 'profile'?this.selectedOptionValue:this.ValidateMissing2 ).subscribe(res=>{
     this.itemCodeData = res;
    })
     
     this.toggelLayers(this.layersSearchCreate)
     
     

    }
    

  }

  infocatModel(data){
      console.log(data);
    $('#glassAnimals2').modal('show');
    this.FullHierData = data;
    this.data_heir = data.master_line_item_details


  }
  headers_res2;
  per_page2;
  total_page2;
  current_page2;
  ListOfProduct2 =[]

  GetProductList2(e) {
    e = e ? e : "";
    this.LoaderService.display(true);
    this.LeadService.ListOfPRoduct2(
      e,
      this.ChildSearch,
     "",
     "",
     "",
      "",
     "",
     "",
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

 
  ParentSearch
 
 
  FilterTypeVendororSearch = "parent_name";
  selectFiltertype(e) {
    this.FilterTypeVendororSearch = e;
    this.ParentSearch = "";
    this.ChildSearch = "";
    this.vendorFilterSel = "";
  }
  SearchFilterForchild() {
    this.GetProductList2("");
  }
  changeFunforSelect(e) {
    this.vendorFilterSel = e;
  }

  mapClick(pro){
    console.log(pro)

 if(this.Maptype == 'HW'){
  this.LoaderService.display(true);
  this.CategoryService.HWDataAdd(pro,this.MapBom_id).subscribe(
  res=>{
    this.LoaderService.display(false);
    this.successMessageShow(res.message);
    $('#BomMappingModal').modal('hide');
  
    this.GetHardwareData()
   
    


  },
    err=>{
      
      this.LoaderService.display(false);
       
    this.errorMessageShow(JSON.parse(err['_body']).message);
  });
 } else if(this.Maptype == 'RM') {

  this.LoaderService.display(true);
  this.CategoryService.RMDataAdd(pro,this.MapBom_id).subscribe(
  res=>{
    this.LoaderService.display(false);
    this.successMessageShow(res.message);
    $('#BomMappingModal').modal('hide');
    this.GetRMwareData()
  },
    err=>{
      
      this.LoaderService.display(false);
       
    this.errorMessageShow(JSON.parse(err['_body']).message);
  });
 }else if(this.Maptype == 'profile'){
  this.LoaderService.display(true);
  this.CategoryService.ProfileDateAdd(pro,this.MapBom_id).subscribe(
  res=>{
    this.LoaderService.display(false);
    this.successMessageShow(res.message);
    $('#BomMappingModal').modal('hide');
    $('#LayeresBomUpload').modal('hide');
      this.GetProfileData()
  },
    err=>{
      this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
  });
  
 }
 else if(this.Maptype == 'nts'){
  this.LoaderService.display(true);
  this.CategoryService.ntsDateAdd(pro,this.MapBom_id).subscribe(
  res=>{
    this.LoaderService.display(false);
    this.successMessageShow(res.message);
    $('#BomMappingModal').modal('hide');
      this.GetntsData()
  },
    err=>{
      this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
  });
 }else if(this.Maptype == 'glass' || this.Maptype == 'softpad' ){
  this.LoaderService.display(true);
  this.CategoryService.GlassDateAdd(pro,this.MapBom_id).subscribe(
  res=>{
    this.LoaderService.display(false);
    this.successMessageShow(res.message);
    $('#BomMappingModal').modal('hide');
    $('#LayeresBomUpload').modal('hide');
    this.getGlassData(this.uploadType)
  },
    err=>{
      this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
  });
 }
   
   




  }

  GetHardwareData(){
    this.LoaderService.display(true);
    this.CategoryService.HWMToDataGet(this.HWBom_ID).subscribe(
    res=>{
      this.LoaderService.display(false); 
      this.HardwareItems = res.items.mto_bom_hw_items
  
    },
      err=>{
        
        this.LoaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });


    
  }
  GetRMwareData(){
    this.LoaderService.display(true);
    this.CategoryService.RMToDataGet(this.BatchId).subscribe(
    res=>{
      this.LoaderService.display(false); 
      this.RMItems = res.items.mto_bom_rm_items
      this.RmData = res;
      this.RMBom_ID = res.mto_bom_rm_id;
  
    },
      err=>{
        
        this.LoaderService.display(false);
        this.RMItems =[]
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });


    
  }
  Profiledata:any
  GlassData:any


  GetProfileData(){
    this.LoaderService.display(true);
    this.selectedOptionValue =this.selectedOptionValue? this.selectedOptionValue:'nlk_frame_door'
    this.CategoryService.ProfileToDataGet(this.RM_bat_id,this.selectedOptionValue).subscribe(
    res=>{
      this.LoaderService.display(false); 
      this.ProfileItems = res.items.mto_bom_profile_items;
      this.singleprofile_id = res.mto_bom_profile_id;
      this.Profiledata = res;
      this.profile_ids =[];
      this.profile_idsCheck =[]
      if(this.ProfileItems[0]){
        this.ProfileItems[0].order_ids.forEach(element => {

         this.profileDisplayorderId.forEach(order => {

          if(element == order.order_id_name ){
            this.profile_ids.push({
              id : order.order_id,
              order_id_name : order.order_id_name
            })
            this.profile_idsCheck.push(order.order_id)
          }
           
         });
        })
      }
          
    },
      err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.ProfileItems=[]
      this.profile_idsCheck =[]
      this.profile_ids =[]
    });
  }
  GetntsData(){
    this.LoaderService.display(true);
   
    this.CategoryService.ntsToDataGet(this.RM_bat_id).subscribe(
    res=>{
      this.LoaderService.display(false); 
      this.ntsItems = res.items.mto_bom_nts_items
    },
      err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.ntsItems =[]
    });
  }

  getGlassData(e){
    let glassandSoftId  = this.uploadType == 'glass' ? this.GlassProfileID : this.SoftPadProfileID
    this.uploadType = e;

    this.LoaderService.display(true);
    this.CategoryService.glassToDataget(this.BatchId,this.uploadType).subscribe(
    res=>{
      this.LoaderService.display(false); 

      if(this.uploadType == 'glass'){
        this.GlassItems = res.items.mto_bom_upload_items
        this.GlassProfileID = res.mto_bom_upload_id;

        this.glass_ids =[];
        this.glass_idsCheck =[]
        if(this.GlassItems[0]){
          this.GlassItems[0].order_ids.forEach(element => {


           this.profileDisplayorderId.forEach(order => {

            if(element == order.order_id_name ){
              this.glass_ids.push({
                id : order.order_id,
                order_id_name : order.order_id_name
              })
              this.glass_idsCheck.push(order.order_id)
            }

           });
          }
          )}
      }else{
        this.softPadItems = res.items.mto_bom_upload_items
        this.SoftPadProfileID = res.mto_bom_upload_id;

        if(this.ValidateMissing2 == 'softpad'){


          this.softPad_ids =[];
          this.softPad_idsCheck =[]
          if(this.softPadItems[0]){
            this.softPadItems[0].order_ids.forEach(element => {
    
             this.profileDisplayorderId.forEach(order => {
    
              if(element == order.order_id_name ){
                this.softPad_ids.push({
                  id : order.order_id,
                  order_id_name : order.order_id_name
                })
                this.softPad_idsCheck.push(order.order_id)
              }
               
             });
              
            });
         
    
          }

        } else {
          if(this.ValidateMissing2 == 'special_hardware'){

            this.S_hw_ids =[];
          this.S_hw_idsCheck =[]
          if(this.softPadItems[0]){
            this.softPadItems[0].order_ids.forEach(element => {
    
             this.profileDisplayorderId.forEach(order => {
    
              if(element == order.order_id_name ){
                this.S_hw_ids.push({
                  id : order.order_id,
                  order_id_name : order.order_id_name
                })
                this.S_hw_idsCheck.push(order.order_id)
              }
               
             });
              
            });
         
    
          }

          } else{

            if(this.ValidateMissing2 == 'metal_frame'){

              this.mf_ids =[];
              this.mf_idsCheck =[]
              if(this.softPadItems[0]){
                this.softPadItems[0].order_ids.forEach(element => {
        
                 this.profileDisplayorderId.forEach(order => {
        
                  if(element == order.order_id_name ){
                    this.mf_ids.push({
                      id : order.order_id,
                      order_id_name : order.order_id_name
                    })
                    this.mf_idsCheck.push(order.order_id)
                  }
                   
                 });
                  
                });
             
        
              }

            }

          }
        }
        
      }
      this.GlassData = res;

    },
      err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.softPadItems =[];
      this.GlassItems =[]
      this.glass_idsCheck =[]
      this.softPad_idsCheck =[]
      this.S_hw_idsCheck =[];
      this.mf_idsCheck =[]
      this.glass_ids =[]
      this.softPad_ids =[]
      this.S_hw_ids =[];
      this.mf_ids = []

    });
  }

HWValidation(){
  let Dis =[]

    this.HardwareItems.forEach(el=>{

      if(!el.ch_item_sku){
        Dis.push(el)
      }

    })

    if(Dis.length == 0){
      return false

    } else{
      return true
    }
}
RMValidation(){
  let Dis =[]

    this.RMItems.forEach(el=>{

      if(!el.ch_item_sku){
        Dis.push(el)
      }

    })

    if(Dis.length == 0){
      return false

    } else{
      return true
    }
}


profileValidation(){
  let pro = []
  this.ProfileItems.forEach(el => {
    if(!el.ch_item_sku){
      pro.push(el)
    }
  })
  if(pro.length == 0){
    return false
  }else{
    return true
  }
}

glassValidation(){
  let glass = []
  this.GlassItems.forEach(el => {
    if(!el.ch_item_sku){
      glass.push(el)
    }
  })
  if(glass.length == 0){
    return false
  }else{
    return true
  }
}

softpadValidation(){
  let soft = []
  this.softPadItems.forEach(el => {
    if(!el.ch_item_sku){
      soft.push(el)
    }
  })
  if(soft.length == 0){
    return false
  }else{
    return true
  }
}
ntsValidation(){
  let soft = []
  this.ntsItems.forEach(el => {
    if(!el.ch_item_sku){
      soft.push(el)
    }
  })
  if(soft.length == 0){
    return false
  }else{
    return true
  }
}

HWSubmit = false
SubmitHWFile(){
 
  this.LoaderService.display(true);
   
  this.CategoryService.HWARESubmit(this.HWBom_ID).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.HWSubmit = true
    this.successMessageShow("Uploaded successfully")
    this.GetHardwareData()
    this.GetBatchDetais(this.BatchId);
    this.getBatchData(this.current_page)
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });
  
  

}
RmUpload = false;
HWUpload = false;
SubmitRMFile(){

  this.LoaderService.display(true);
   
  this.CategoryService.RMSubmit(this.RMBom_ID).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.RmUpload = true;
    this.GetRMwareData()

  this.successMessageShow("Uploaded successfully")

  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)
    
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });

   

}
ProfileUpload ={
  nlk_frame_door :false,
  nr_handle : false,
  ntd_hanger : false,
  ntd_sliding_door : false,
  ntm_sliding_door : false
}

ntsUpload = false
glassUpload = false
softpadupload = false;
SHWpadupload = false;
mfdupload = false;
SubmitProfileUpload(){

  this.LoaderService.display(true);
   
  this.CategoryService.ProfileSubmit(this.singleprofile_id ).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.ProfileUpload[this.selectedOptionValue] = true
    this.GetProfileData()
  this.successMessageShow("Uploaded successfully")
  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)
    
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });



}
SubmitntsUpload(){

  this.ntsUpload = true
  this.successMessageShow("Uploaded successfully")
  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)
}
SubmitGlassUpload(){
  this.LoaderService.display(true);
   
  this.CategoryService.GlassSubmit(this.GlassProfileID).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.glassUpload = true
    this.getGlassData('glass')
  this.successMessageShow("Uploaded successfully")
  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)
    
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });

 
}

submitsoftpadupload(){
  this.LoaderService.display(true);
   
  this.CategoryService.GlassSubmit( this.SoftPadProfileID ).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.softpadupload = true
    this.getGlassData('softpad')
  this.successMessageShow("Uploaded successfully")
  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });
 

}
submitSWHupload(){
  this.LoaderService.display(true);
   
  this.CategoryService.GlassSubmit( this.SoftPadProfileID  ).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.SHWpadupload = true
    this.getGlassData('special_hardware')
  this.successMessageShow("Uploaded successfully")
  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });
 
  

}
submitmfupload(){
  this.LoaderService.display(true);
   
  this.CategoryService.GlassSubmit( this.SoftPadProfileID  ).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.mfdupload = true
    this.getGlassData('metal_frame')
  this.successMessageShow("Uploaded successfully")
  this.GetBatchDetais(this.BatchId);
  this.getBatchData(this.current_page)

  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
   
  });
 
  

}
RM_bat_id
BatchItems(bat){


  if($('#BomvalidtaionModal2').hasClass('show') == false){
    $('#BomvalidtaionModal2').modal('show')
  }

 
  this.ValidateMissing2 = 'raw_material';
  this.RM_bat_id = bat.id

  this.profile_ids = []
  this.glass_ids = []
  this.softPad_ids = []
  this.nts_ids = []
  this.S_hw_ids = []
  this.mf_ids = []
  this.profile_idsCheck =[]


  this.profileMapOrderId()
  this.GetRMwareData();

}
UploadRM(type,file){
  this.uploadType = type;
  $("#UploadModal").modal("show");
  this.file_name2 = ''
  this.attachment_file2 ='';
  this.FIleSampleUrl = file;
  console.log(this.selectedOptionValue)
}
layoutRadioId:any=''
layersSearchCreate
layoutListing =[];
LengthValue =''
WidthValue=''
ThickValue=''
PerforateValue =''


toggelLayers(value :any){
  this.layersSearchCreate = value
  this.layoutListing=[];
  this.LengthValue = '';
  this.WidthValue = '';
  this.ThickValue = '';
  this.PerforateValue = '';
 
  this.PushForm();
  if(this.ValidateMissing2 == 'softpad' || this.ValidateMissing2 == 'special_hardware' || this.ValidateMissing2 == 'metal_frame' || this.ValidateMissing2 == 'glass'){
    this.MLIFormGlass.patchValue({length: this.HardDetails.actual_length?this.HardDetails.actual_length:this.HardDetails.sheet_length })
     this.MLIFormGlass.patchValue({width: this.HardDetails.actual_width?this.HardDetails.actual_width:this.HardDetails.sheet_width     })
     this.MLIFormGlass.patchValue({thickness: this.HardDetails.actual_thickness?this.HardDetails.actual_thickness :this.HardDetails.sheet_thickness     })
     this.MLIFormGlass.patchValue({perforate: this.HardDetails.actual_perforate != null?this.HardDetails.actual_perforate:this.HardDetails.sheet_perforate     })

     this.LengthValue = this.HardDetails.actual_length?this.HardDetails.actual_length:this.HardDetails.sheet_length;
     this.WidthValue = this.HardDetails.actual_width?this.HardDetails.actual_width:this.HardDetails.sheet_width  ;
     this.ThickValue = this.HardDetails.actual_thickness?this.HardDetails.actual_thickness :this.HardDetails.sheet_thickness 
     this.PerforateValue = this.HardDetails.actual_perforate != null?this.HardDetails.actual_perforate:this.HardDetails.sheet_perforate 
     this.widthSfgRead = true
     this.ItemCodeEdit = true
     this.ItemnameEdit = true
     this.LengthSfgRead = true
     this.ThicknessLayRead = true
  } else{

    if(this.ValidateMissing2 == 'profile'){
      this.LengthValue = this.HardDetails.actual_length?this.HardDetails.actual_length:this.HardDetails.sheet_length;
      this.ThickValue = this.HardDetails.actual_thickness?this.HardDetails.actual_thickness:this.HardDetails.sheet_thickness;
      this.MLIFormProfile.patchValue({length: this.HardDetails.actual_length?this.HardDetails.actual_length:this.HardDetails.sheet_length })
      this.MLIFormProfile.patchValue({thickness: this.HardDetails.actual_thickness?this.HardDetails.actual_thickness:this.HardDetails.sheet_thickness     })
      this.widthSfgRead = true
      this.ItemCodeEdit = true
      this.ItemnameEdit = true
      this.LengthSfgRead = true
      this.ThicknessLayRead = true




    }

  }
  


}
DoneCheck(){
  let Dis =[]

  this.layoutListing.forEach(el=>{

    if(el.cli_id == this.layoutRadioId){
      Dis.push(el)
    }

  })

  if(Dis.length == 0){
    return true

  } else{
    return false
  }

}

layoutfilterApi(glass?){
  if(!glass){

    this.LoaderService.display(true);
    this.CategoryService.profileSearchCli(this.selectedOptionValue,this.LengthValue,this.ThickValue,$('#ItemName').val(),$('#ItemCode').val(),"").subscribe(res=>{
      this.layoutListing = res.data
    
      this.LoaderService.display(false);
    },err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

  } else {

    this.LoaderService.display(true);
    this.CategoryService.GlassSearchCli(this.uploadType,this.LengthValue,this.ThickValue,$('#ItemNameG').val(),this.WidthValue,this.PerforateValue).subscribe(res=>{
      this.layoutListing = res.data
      this.LoaderService.display(false);
     
    },err=>{
      this.LoaderService.display(false);
      this.errorMessageShow(JSON.parse(err['_body']).message);
    })

  }
 

}
MLIFormProfile:FormGroup
MLIFormGlass:FormGroup

PushForm(){
  this.MLIFormProfile = this.formBuilder.group({
    item_type : new FormControl(""),
    length:new FormControl("", Validators.required),
    thickness:new FormControl("", Validators.required),
    code:new FormControl("" ),
    item_name:new FormControl(""),
    item_id:new FormControl("")
  });
  this.MLIFormGlass = this.formBuilder.group({
    item_name: new FormControl(""),
    length:new FormControl("", Validators.required),
    thickness:new FormControl("", Validators.required),
    width:new FormControl("",Validators.required),
    item_id:new FormControl(""),
    perforate : new FormControl("",Validators.required),
    upload_type :new FormControl(this.ValidateMissing2)
  });
}
Profilesubmit(glass?){

  if(!glass){
    this.MLIFormProfile.controls['item_type'].setValue(this.selectedOptionValue)
  this.MLIFormProfile.controls['item_name'].setValue($('#ItemNameCr').val())
  this.MLIFormProfile.controls['code'].setValue($('#ItemCodeCr').val())
  this.MLIFormProfile.controls['item_id'].setValue(this.MapBom_id)


  this.LoaderService.display(true);
  this.CategoryService.profileCreateCli(this.MLIFormProfile.value).subscribe(res=>{
   this.successMessageShow("Created Successfully");
   $('#LayeresBomUpload').modal('hide');
    this.LoaderService.display(false);
    this.GetProfileData()
  },err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
  })
  } else {
    this.MLIFormGlass.controls['item_id'].setValue(this.MapBom_id);
    this.MLIFormGlass.controls['item_name'].setValue($('#ItemNameGc').val())


    this.LoaderService.display(true);
  this.CategoryService.GlassCreateCli(this.MLIFormGlass.value).subscribe(res=>{
   this.successMessageShow("Created Successfully");
   $('#LayeresBomUpload').modal('hide');
    this.LoaderService.display(false);
    this.getGlassData(this.uploadType)
  },err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
  })

  }
  


}
ValidateMissingbom ='hw'
ChangeTabbom(tab){
  this.ValidateMissingbom = tab

}
layoutsubmit(id){

  this.layoutRadioId = id

}
RefreshData(){
  this.ChildSearch = "";
  this.vendorFilterSel = "";
  this.selectType = "";
   this.GetProductList2("")

}
Item_id
ApproveModal(bat){
  console.log("heelll")
  $('#Bomvalidtaionupload').modal('show');
     this.Item_id = bat.id
   this.GetApDetails(this.Item_id)
   this.ProfileItemTypeData()
   this.selectedOptionValuebom = 'nlk_frame_door'
   this.ValidateMissingbom = 'hw'
  this.Pord_bom = false


}
ApproveItems
GetApDetails(id){

  this.LoaderService.display(true);
   
  this.CategoryService.GetApproveDetails(id,this.BatchId).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.ApproveItems = res;
    console.log(this.ApproveItems.all_approved,this.ApproveItems.profile_all_approved,this.ApproveItems.all_approved||this.ApproveItems.profile_all_approved, !(this.ApproveItems.all_approved || this.ApproveItems.profile_all_approved))
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
    
  });


}

ApproVedProfile;
Fetchprofile(){
  let data = []

  if(this.selectedOptionValuebom == 'nlk_frame_door'){
    data = this.ApproveItems.profile_nlk_data.data.mto_bom_profile_items
    this.ApproVedProfile = this.ApproveItems.profile_nlk_data.approved
  } else if(this.selectedOptionValuebom == 'nr_handle'){
    data = this.ApproveItems.profile_nr_handle_data.data.mto_bom_profile_items
    this.ApproVedProfile = this.ApproveItems.profile_nr_handle_data.approved

  } else if(this.selectedOptionValuebom == 'ntd_hanger'){

    data = this.ApproveItems.profile_ntd_hanger_data.data.mto_bom_profile_items
    this.ApproVedProfile = this.ApproveItems.profile_ntd_hanger_data.approved



  } else if(this.selectedOptionValuebom == 'ntd_sliding_door'){

    data = this.ApproveItems.profile_ntd_sliding_door_data.data.mto_bom_profile_items
    this.ApproVedProfile = this.ApproveItems.profile_ntd_sliding_door_data.approved



  }  else if(this.selectedOptionValuebom == 'ntm_sliding_door'){

    data = this.ApproveItems.profile_ntm_sliding_door_data.data.mto_bom_profile_items
    this.ApproVedProfile = this.ApproveItems.profile_ntm_sliding_door_data.approved



  }

  return data

}
ApproveItemsbom(tab){

  this.LoaderService.display(true);
   
  this.CategoryService.makeApproveDetails(this.Item_id,tab == 'profile'?'profile':tab).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.successMessageShow("Approved Sucessfully");
    this.GetApDetails(this.Item_id)

    
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
    
  });





}
Pord_bom = false
ProdBom(){

  this.Pord_bom = true

}
ReleaseBom(){

  this.LoaderService.display(true);
   
  this.CategoryService.ReleaseProd(this.Item_id).subscribe(
  res=>{
    this.LoaderService.display(false); 
    this.successMessageShow("Released Sucessfully");
    this.GetBatchDetais(this.BatchId);
    this.getBatchData(this.current_page)
    $('#Bomvalidtaionupload').modal('hide');

    
  },
    err=>{
    this.LoaderService.display(false);
    this.errorMessageShow(JSON.parse(err['_body']).message);
    
  });


}
ClosePOP(condi,length){

  if(length == 0){
    $('#BomvalidtaionModal2').modal('hide');
  } else{

    if(condi){
      $('#BomvalidtaionModal2').modal('hide');
    } else{
      if (confirm("Do you wish to close the modal box before submit") == true) {
        $('#BomvalidtaionModal2').modal('hide');
      }
    }
  

  }

  
}
ProfileEdit = false
SoftpadEdit = false
GlassEdit = false
SpecialHardEdit = false
MetalFrameEdit = false
editAcess(tab){

  if(tab == 'softpad'){

    this.SoftpadEdit = true
  } else if(tab == 'glass'){

    this.GlassEdit = true

  } else if(tab == 'profile'){

    this.ProfileEdit = true
  } else if (tab == 'special_hardware') {

    this.SpecialHardEdit = true

  } else {
    this.MetalFrameEdit = true
  }

}
hwClose(){
  $('#BomHWModal2').modal('hide');
  // if(this.HWSubmit){
    


  // } else{
  //   alert('Click On Submit Before Closing Modal')

  // }
 
}
LengthSfgRead = true;
widthSfgRead = true
lengthsfg(){
this.LengthSfgRead = !this.LengthSfgRead

}
widthsfg(){
  this. widthSfgRead = !this. widthSfgRead

}

ItemnameEdit = true;
ItemCodeEdit = true;

ItemnameRead(){
  this.ItemnameEdit = !this.ItemnameEdit
}
ItemCodeRead(){
  this.ItemCodeEdit = !this.ItemCodeEdit
}
ThicknessLayRead = true
ThicknessLay(){

  this.ThicknessLayRead =  !this.ThicknessLayRead

}
VendorList2;
getVendorList2() {
  this.LeadService.ListOfVendors().subscribe((res) => {
    console.log(res);
    this.VendorList2 = res.vendors;
  });
}
GetUrl(){
  if(this.selectedOptionValue == 'nlk_frame_door'){
    return './assets/Sample_BOM_Files/NLK.xlsx'
  } else if(this.selectedOptionValue == 'nr_handle'){
    return  './assets/Sample_BOM_Files/NR.xlsx'

  } else if(this.selectedOptionValue == 'ntd_hanger'){
    return './assets/Sample_BOM_Files/NTD-Hanger.xlsx'
  } else if (this.selectedOptionValue == 'ntd_sliding_door'){
    return './assets/Sample_BOM_Files/NTD-Sliding.xlsx'

  } else if (this.selectedOptionValue == 'ntm_sliding_door'){
    return './assets/Sample_BOM_Files/NTM.xlsx'
  }
  
}

}
