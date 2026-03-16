import { Component, OnInit,Input,ViewChild,ElementRef,ChangeDetectorRef  } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import { QuotationService} from '../../../quotation/quotation.service';
import { LeadService } from '../../../lead/lead.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from "@angular/forms";
import { Observable } from 'rxjs';
import { AssignFilesCategoryComponent } from '../assign-files-category/assign-files-category.component';
import {FinanceService} from '../../../finance/finance.service';
declare var $:any;

@Component({
  selector: 'app-cutting-list-bom',
  templateUrl: './cutting-list-bom.component.html',
  styleUrls: ['./cutting-list-bom.component.css'],
  providers: [LeadService,CategoryService,QuotationService]
})
export class CuttingListBomComponent implements OnInit {
  @Input() project_id:any;
  @ViewChild('fileInput') fileInput: ElementRef;
  project_list;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  MLIForm:FormGroup;
  erroralert:boolean=false;
  errorMessage:string;
  request: FormGroup;
  successalert = false;
  toggle = false;
  successMessage : string;
  project_id_split;
  split_type;
  public rowSelected:any;
  file_list=['file-1','file-2','file-3','file-4','file-5','file-6','file-7'];
  uploaded_list = [ "bom_sli_manual_sheet", "imos_manual_sheet", "imos"];
  bom: any = [];
  cuttingList: any = [];
  hardwareList: any = [];
  imos: any = [];

  constructor(
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    public leadService : LeadService,
    private financeService:FinanceService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.project_id_split = this.project_id;
    
    this.getProjectBoqList();
    this.getVendorList2();
    this.GetProductList2("")
    $('body').popover({selector: '.pop', trigger: 'hover'});
    this.CreateMLForm()
    

  }
  CLIForm:FormGroup;
  MLIFormSfg:FormGroup;
  CLIsfgForm:FormGroup;
  CreateMLForm(){
    this.MLIForm = this.formBuilder.group({
      board:new FormControl("", Validators.required),
      lam_top:new FormControl("", Validators.required),
      lam_bot:new FormControl("", Validators.required),
      thickness:new FormControl("", Validators.required),
      delta_bom_id:new FormControl(""),
      layout_id:new FormControl("")
    });
    this.MLIFormSfg = this.formBuilder.group({
      layout:new FormControl("", Validators.required),
      length:new FormControl("", Validators.required),
      width:new FormControl("", Validators.required),
      delta_bom_id:new FormControl(""),
      sfg_id:new FormControl("")
    });
    this.CLIForm = this.formBuilder.group({
      item_name:new FormControl("", Validators.required),
      item_code:new FormControl("", Validators.required),
      length:new FormControl("", Validators.required),
      width:new FormControl("", Validators.required),
      mli_id:new FormControl(""),
      layout_id:new FormControl(""),
      delta_bom_id:new FormControl("")
    });
    this.CLIsfgForm = this.formBuilder.group({
      item_name:new FormControl(""),
      item_code:new FormControl(""),
      edge_band_1:new FormControl("", ),
      edge_band_2:new FormControl("", ),
      edge_band_3:new FormControl("",),
      edge_band_4:new FormControl("",),
      edge_band_1_id:new FormControl(null),
      edge_band_2_id:new FormControl(null),
      edge_band_3_id:new FormControl(null),
      edge_band_4_id:new FormControl(null),
      handle:new FormControl(""),
      groove_handle_side:new FormControl(""),
      handle_groove_length:new FormControl(""),
      delta_bom_id:new FormControl("",),
      sfg_id:new FormControl(""),
      layout_id:new FormControl(""),
      mli_id:new FormControl(""),
      cli_id:new FormControl(""),
      

    });

  }
  getProjectBoqList(){
    this.loaderService.display(true);
    this.categoryService.getProjectBoqListForCuttingBOM(this.project_id_split).subscribe(
      res=>{
        this.boq_list = res.quotations;
        
        // this.getLineItems(this.project_id_split,this.boq_list[0].id);
        this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }
  //for collapsable row table
  toggleRow(row) {
    if (this.rowSelected === -1) {
      this.rowSelected = row
    }
    else {
      if (this.rowSelected == row) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row
      }

    }
    
  }

  
  selected_boq;
  final_file_assign_for_split=[];
  module_value;
  selectLineItemArr = [];
  final_file_assign =[];
  selectBoq(event){
    this.selected_boq = event.target.value;
    if(this.selected_boq == ''){
      this.line_item_Arr = [];

    }
    this.final_file_assign =[];
    this.selectLineItemArr = [];
    this.rowSelected = '';
    // this.getLineItems(this.project_id_split,event.target.value);
   this.CheckBomValidation(this.selected_boq)

  }
  uploadBomDetails 
  CheckBomValidation(id){
    this.Bom_id = null;
    this.loaderService.display(true);
    this.categoryService.CheckBomUpload(id).subscribe(
    res=>{
      this.loaderService.display(false);
      this.uploadBomDetails = res ;
      this.Bom_id = this.uploadBomDetails.delta_bom_id?this.uploadBomDetails.delta_bom_id: this.Bom_id

    },
      err=>{
        
        this.loaderService.display(false);
    });


  }
  OpenbomModal(){

    this.ValidateMissing2 = 'raw_material'
    this.GetRawForread()
    if($('#BomvalidtaionModal3').hasClass('show') == false){
      $('#BomvalidtaionModal3').modal('show')
  
    }

  }
  openModalBom(){
    if($('#BomvalidtaionModal2').hasClass('show') == false){
      $('#BomvalidtaionModal2').modal('show')
  
    }
    if(this.uploadBomDetails.stage == 'sfg'){
      this.rawShowHide = true;
        this.hard_show_hide = true;
        this.sfg_but_show_hide = true;
    } else{

      if(this.uploadBomDetails.stage == 'layouts'){

        this.rawShowHide = true;
        this.hard_show_hide = true;

      } else{

        if(this.uploadBomDetails.stage == 'hardware'){

          this.rawShowHide = true;

        }

      }

    }


  }
  split_line_item_list;
  split_line_item_lists;
  line_item_Arr = [];
  lines_item_Arr=[];
  getLineItems(projectId,boqId){
    this.loaderService.display(true);
    this.categoryService.getLineItemsForCutting(projectId,boqId).subscribe(
    res=>{
        this.split_line_item_list = res.data.attributes.line_items;
        var jsonObj = this.split_line_item_list;
        this.line_item_Arr = Object.keys(jsonObj);
        this.loaderService.display(false); 
        for(let obj of this.line_item_Arr){
          $('#parent-'+obj).prop('checked',false);
        }
    },
      err=>{
        
        this.loaderService.display(false);
    });
  }
  selectType;
  slectFileType(type){
    console.log(type,"type")
    this.rawShowHide = false
    this.hard_show_hide = false
    this.sfg_but_show_hide = false
    this.selectType = type;
    $('#BomvalidtaionModalinvalid').modal('hide');
    this.file_name =''
    if(this.selected_boq){
      $('#UploadModal').modal('show');
  this.RawCount = 0;
  this.hardWarecount = 0;
  this.layoutCount = 0;
  this.sfgcount = 0

    }
    else{
      alert('Please Select A BOQ');
    }
  }


   

  attachment_file;
  basefile: any;
  file_arr:any = [];
  file_name:any;
  file_t;
  onChange(event,file_type) {
    
    $('.parent-'+file_type).addClass('divActive');  
    var fileReader = new FileReader();
    var i = 0;
    this.file_name = event.target.files[i].name;
    this.attachment_file =event.target.files[0] || event.srcElement.files[0];

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      
    };
    fileReader.readAsDataURL(this.attachment_file);
  } 

   
  assignFileList;
  manualImportErrorList=[];
  filenamebom:any

  submitValFile(){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
    this.filenamebom = this.file_name 
    // for(let i=0;i<this.file_arr.length;i++){
         var obj={
         

          'bom_type':'non_mto',
          'document':this.attachment_file,
          'quotation_id':this.selected_boq
        
        }     
      
    this.BOMValidation(obj);
  }
  RawMatData =[];
  RawMatKey 
RawMatGeyData(id){
  this.loaderService.display(true);
  this.categoryService.RawmatDataGet(id).subscribe(
  res=>{
    this.loaderService.display(false);
     this.RawMatData = res.sheet_items.non_mto_bom_rms     ;

     this.switchtab2('raw_material');
     if($('#BomvalidtaionModal2').hasClass('show') == false){
      $('#BomvalidtaionModal2').modal('show')
     
  
    }
     $('#BomvalidtaionModal').modal('hide');

  },
    err=>{
      
      this.loaderService.display(false);
  });

}

layoutBoardValue = ""
layoutLamTopValue =""
layoutLamBottomValue =""
layoutThicknessValue  = "";
LayoutValue = '';
LengthValue = '' ;
WidthValue = '' ;
layerBoard(e){
  this.layoutBoardValue = e
}
layoutLamTop(e){
  this.layoutLamTopValue = e
}
layoutLamBottom(e){
  this.layoutLamBottomValue = e
}
layoutThickness(e){
  this.layoutThicknessValue = e
}

layoutListing:any = []
layoutListingTabel(){
  this.loaderService.display(true)
    this.categoryService.search_non_mto_bom_layout(this.layoutBoardValue , this.layoutLamTopValue , this.layoutLamBottomValue, this.layoutThicknessValue,this.Bom_id , this.layOut_id).subscribe(
    res => {
      this.loaderService.display(false)
      this.layoutListing = res.items.non_mto_bom_layouts
    },
    err => {
      this.loaderService.display(false);
      this.layoutListing =[];

    }
  )
}

SFGListing:any = []
SFGListingTabel(){
  this.loaderService.display(true)
    this.categoryService.search_non_mto_bom_SFG(this.layOut_id , this.layoutSfgValue , this.LengthValue, this.WidthValue,this.Bom_id).subscribe(
    res => {
      this.loaderService.display(false)
      this.SFGListing = res.data
    },
    err => {
      this.loaderService.display(false)
      this.SFGListing = []
    }
  )
}

layersSearchCreate : any = 'searchlayer'
toggelLayers(value :any){
  this.layersSearchCreate = value
  this.layoutListing=[];
 
this.ThicknessLayRead = true
this.LengthSfgRead = true
this.widthSfgRead = true


}


layersBoard :any
layersLaminates :any;
thicknessLayout:any
layOut_id:any
SFGLayouts:any =[]
SFGEdgeBands =[]
layoutSfgValue =''
layoutRadioIdChild
Selectedlayout:any

openLayesModal(id , tabValue,cid,condi,bom,selectedlayout?){
  this.Selectedlayout=selectedlayout
  this.layoutListing=[];
  if(this.ValidateMissing2 == 'layouts'){

    this.layoutBoardValue = bom.sheet_board;
    this.layoutLamTopValue = bom.sheet_lam_top;
    this.layoutLamBottomValue = bom.sheet_lam_bottom
    this.layoutThicknessValue = bom.sheet_thickness
    this.MLIForm.controls['board'].setValue(bom.sheet_board)
    this.MLIForm.controls['lam_top'].setValue(bom.sheet_lam_top)
    this.MLIForm.controls['lam_bot'].setValue(bom.sheet_lam_bottom)
    this.MLIForm.controls['thickness'].setValue(bom.actual_thickness?bom.actual_thickness:bom.sheet_thickness)

  } else{

    if(this.ValidateMissing2 == 'sfg'){
      this.LengthValue = bom.sheet_finish_length;
      this.WidthValue = bom.sheet_finish_width;
      console.log( this.LengthValue, this.WidthValue )
      this.MLIFormSfg.controls['length'].setValue(bom.actual_finish_length?bom.actual_finish_length:bom.sheet_finish_length)
      this.MLIFormSfg.controls['width'].setValue(bom.actual_finish_width?bom.actual_finish_width:bom.sheet_finish_width)
   

    }

  
  }

 
  this.SFGListing =[];
  this.layoutSfgValue = bom.sheet_layout_code;
  // this.MLIFormSfg.controls['layout'].setValue(this.layoutSfgValue);
  console.log(this.layoutSfgValue)

  
  if(!condi){


    if(this.ValidateMissing2 == "layouts"){


      if($('#LayeresBomUpload').hasClass('show') == false){
        $('#LayeresBomUpload').modal('show')
      }
    
  
      this.layoutRadioIdChild = cid;
      this.layoutRadioId = bom.id;
    this.layOut_id = id;
    this.MapBom_id =id  ;
    this.layersSearchCreate = tabValue
    this.categoryService.getBomlayoutDropdownValues(this.Bom_id).subscribe(
      res => {
        this.layersBoard = res.board
        this.layersLaminates = res.laminates
        this.thicknessLayout = res.thickness
        this.thicknessLayout = this.thicknessLayout.map(el=>{{
          return el = parseInt(el)
        }})
      },
      err => {
        console.log(err)
      }
    )
  

    } else{


      if($('#LayeresBomUpload').hasClass('show') == false){
        $('#LayeresBomUpload').modal('show')
      }
  
      this.layoutRadioId = cid
    this.layOut_id = id;
    this.MapBom_id =id  ;
    this.layersSearchCreate = tabValue
    this.categoryService.getBomsfgDropdownValues(this.Bom_id).subscribe(
      res => {
        // this.layersBoard = res.board
        // this.layersLaminates = res.laminates
        // this.thicknessLayout = res.thickness

        this.SFGLayouts = res.layouts;
        this.SFGEdgeBands = res.edgebands

      },
      err => {
        console.log(err)
      }
    )

    }

   
  }
  
}

UpdatedSfgDropDowns:any= []
UpdatedSfghandle =[]

listDropDowns(){
  this.categoryService.getBomlayoutDropdownValues(this.Bom_id).subscribe(
    res => {
      this.layersBoard = res.board
      this.layersLaminates = res.laminates
      this.thicknessLayout = res.thickness
    },
    err => {
      console.log(err)
    }
  )
  this.categoryService.getBomsfgDropdownValues(this.Bom_id).subscribe(
    res => {
      // this.layersBoard = res.board
      // this.layersLaminates = res.laminates
      // this.thicknessLayout = res.thickness

      this.SFGLayouts = res.layouts;
      this.SFGEdgeBands = res.edgebands

    },
    err => {
      console.log(err)
    }
  )
  this.categoryService.getBomsfgDropdownValuesbands(this.Bom_id).subscribe(
    res => {
      // this.layersBoard = res.board
      // this.layersLaminates = res.laminates
      // this.thicknessLayout = res.thickness

      this.UpdatedSfgDropDowns = res.edgebands
      

    },
    err => {
      console.log(err)
    })
    this.categoryService.getBomsfgDropdownValueshandle(this.Bom_id).subscribe(
      res => {
        // this.layersBoard = res.board
        // this.layersLaminates = res.laminates
        // this.thicknessLayout = res.thickness
  
        this.UpdatedSfghandle = res.handles
        
  
      },
      err => {
        console.log(err)
      }
  )

}
closeLayoutModal(){
this.layoutBoardValue = ""
this.layoutLamTopValue =""
this.layoutLamBottomValue =""
this.layoutThicknessValue  = ""
}
layoutRadioId :any
layoutsubmit(id,id2){
  console.log(id , 'clicking')
  this.layoutRadioIdChild = id;
  this.layoutRadioId = id2;
}
layoutsubmitsfg(id){
  console.log(id , 'clicking')
  this.layoutRadioId = id;
}

layoutfilterApi(){
  this.layoutListingTabel()
}
SFGfilterApi(){

  this.SFGListingTabel()

}
rawShowHide :any = false
hardMatGeyData(id){
  if (confirm("Once you submit/proceed, you will not be able to revert the changes") == true) {

    this.loaderService.display(true);
  this.categoryService.hardmatDataGet(id).subscribe(
  res=>{
    this.loaderService.display(false);
    this.rawShowHide = true
     this.RawMatData = res.sheet_items.non_mto_bom_hws;
     this.hardWarecount++
     this.switchtab2('hardware');
     if($('#BomvalidtaionModal2').hasClass('show') == false){
      $('#BomvalidtaionModal2').modal('show')
    
  
    }
     $('#BomvalidtaionModal').modal('hide');
     this.successMessageShow("Hardware Imported")

  },
    err=>{
      
      this.loaderService.display(false);
  });

   
  }

  
}
hard_show_hide : any = false
LayoutMatGeyData(id){
  if (confirm("Once you submit/proceed, you will not be able to revert the changes") == true) {

    this.loaderService.display(true);
    this.categoryService.layoutmatDataGet(id).subscribe(
    res=>{
      this.loaderService.display(false);
      this.hard_show_hide = true
      this.RawMatKey = res  
       this.RawMatData = res.sheet_items.non_mto_bom_layouts;

       this.switchtab2('layouts');
       if($('#BomvalidtaionModal2').hasClass('show') == false){
        $('#BomvalidtaionModal2').modal('show')
      }
      this.layoutCount++
       $('#BomvalidtaionModal').modal('hide');
       this.successMessageShow("Layout Imported")
      //  this.SFGMatGeyData(this.Bom_id);
       this.listDropDowns()
      
  
    },
      err=>{
        
        this.loaderService.display(false);
    });
  
  }
 
}
sfgcount = 0
sfg_but_show_hide :any = false 
SFGMatGeyData(id){

 
    this.loaderService.display(true);
    this.categoryService.SfgmatDataGet(id).subscribe(
    res=>{
      this.loaderService.display(false);
      this.sfg_but_show_hide = true;
      this.RawMatKey = res  
       this.RawMatData = res.sheet_items.non_mto_bom_sfgs;
       this.switchtab2('sfg');
       if($('#BomvalidtaionModal2').hasClass('show') == false){
        $('#BomvalidtaionModal2').modal('show')
      }
      this.sfgcount++
       $('#BomvalidtaionModal').modal('hide');
       this.successMessageShow("SFG Imported")
       this.listDropDowns()
       this.listofBOQLabels()
 
  
    },
      err=>{
        
        this.loaderService.display(false);
    });
  
  
 
}
  submitFile(){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
    // for(let i=0;i<this.file_arr.length;i++){
         var obj={
          'document':this.basefile,
          'scope':this.selectType,
          'document_file_name':this.filenamebom
        }     
      
    // }

    this.loaderService.display(true);
     
    this.selectLineItemArr = [];
      
  
   this.RawMatGeyData(this.Bom_id);
  

  
 }

BomData:any;
Bom_id:any 
loading = false;
InvalLabels =[]
ValidateMissing:any = 'raw_material'
 BOMValidation(obj){

  this.loaderService.display(true);

  this.loading = true;


  this.categoryService.BOMvalidationForCutting(obj,this.selected_boq).subscribe(

    res=>{

      this.loading = false;
      this.BomData = res;
      this.Bom_id = res.delta_bom.id

      if(res.label_validation_data.invalid_labels.length > 0){
       
        $('#BomvalidtaionModalinvalid').modal('show');
        this.InvalLabels = this.BomData.label_validation_data.invalid_labels
        console.log(this.BomData.label_validation_data.invalid_labels)
      } else{
        this.modalopen()
      }
     
      this.loaderService.display(false);
    
     
      this.ValidateMissing= 'missing'
      $('#UploadModal').modal('hide');
    

      
        },
    err=>{
      this.loaderService.display(false);
      this.loading = false;
      const errorBody = JSON.parse(err['_body']);
      const errorMessage = `${errorBody.message} => ${errorBody.error}`
      this.errorMessageShow(errorMessage);
    });
  
   
 }
 modalopen(){

  if($('#BomvalidtaionModal').hasClass('show') == false){
    $('#BomvalidtaionModal').modal('show')

  }
  
 }
 
 missing
 All
 p
 p1
 ValidateMissing2
 switchtab(name){

  this.ValidateMissing = name

 }
 switchtab2(name){

  this.ValidateMissing2 = name;
  

 }
 ChangeTab(name){
  this.boqlabel=null
  // if(name =='sfg'){
  //   this.ValidateMissing2 = 'layouts';
  // } else{
    this.ValidateMissing2 = name
  // }
  
  console.log(name, this.ValidateMissing2 )
  this.GetRawForread();
  this.listDropDowns()
  if(name == 'sfg'){
    this.listofBOQLabels()
  }

 }
 boqlabels:any;
  listofBOQLabels(){
    this.loaderService.display(true);
    this.categoryService.getBOQLabelslist(this.Bom_id).subscribe(
    res=>{
      this.boqlabels=res['labels']
      this.loaderService.display(false);
    },
      err=>{
        this.loaderService.display(false);
      });

  }


   // assignToLineItem(item)
    
  assignToLineItem(value,type){
    if(this.selectLineItemArr.length > 0){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.selectType = type;

    for(let j=0;j<this.selectLineItemArr.length;j++){
      var obj={
        'scope':this.selectType,
        'ownerable_id':this.selectLineItemArr[j].id,
        'ownerable_type':this.selectLineItemArr[j].type,
         
        }
        this.final_file_assign.push(obj);
      }
   
    this.selectLineItemArr = [];
    this.loaderService.display(true);
    this.categoryService.sendAssignedFileForNotCutting(this.final_file_assign,value).subscribe(
    res=>{
      
      this.successalert = true;
      this.successMessage = "Status updated successfully";
      this.final_file_assign =[];
      this.selectLineItemArr = [];
      // this.file_arr = [];
      for(let obj of this.file_list){
        $('.parent-'+obj).removeClass('divActive');

      }
      this.selectLineItemArr = [];
      this.loaderService.display(false);
      this.selectLineItemArr = [];
      this.getLineItems(this.project_id_split,this.selected_boq);
      this.removeItems();
      setTimeout(function() {
      this.successalert = false;
       
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      this.getLineItems(this.project_id_split,this.selected_boq);
      
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });
  }else{
      alert('Please Select Atleast One Subline Item');
    }

  }   

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 2000);
  }



  toggleAll(value,event) {
    this.module_value = value;
    this.toggle = event.target.checked;
    
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
    $('#parent-'+value).prop('checked',this.toggle); 
    if($('#parent-'+value). prop("checked") == true){
      this.toggle = true;
      this.split_line_item_list[value].forEach(items => {
        // this.getclearList(items.bom,items.cutting_list,items.hardware_list,items.imos);
        items.checked = this.toggle;
        // 
        var obj = {
           'id':items.id,
           'type':items.type
         }
        this.selectLineItemArr.push(obj)
      })
    }
    else{
      this.toggle = false;
      this.split_line_item_list[value].forEach(item => {
        item.checked = this.toggle
        this.selectLineItemArr.forEach((element,index) => {
        
          if(item.id == element.id){
            this.selectLineItemArr.splice(index,1)
          }
          
        });

      });
    // 

    }
  }

  //for tooltip popover
  openpopup(event,id){

   
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });

    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    })
  }
  openpopup2(event){
    const element:any = document.getElementById('pro-btn');

console.log(element.disabled); // 👉️ true

if (element.disabled) {
  $(event.target).popover({
    trigger:'hover',
    delay: { "show": 500, "hide": 100 },
   


  });

  //$(this).popover();
  $(function () {
    $('.pop').popover({
      trigger:'hover',
      delay: { "show": 500, "hide": 100 },
    })
  })
  $('.popover').css("color", "#8C031F !important");
} else {
  $(".pop").popover("hide");
}


   
    var thisobj=this;
   
  }

  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  removeItems(){
    this.file_arr = [];
    this.attachment_file = '';
    this.file_name = '';
    for(let obj of this.file_list){
      $('.parent-'+obj).removeClass('divActive');

    }
  }  
 removeErrorList(){
    this.manualImportErrorList=[];
    this.file_arr = [];
    this.attachment_file = '';
    this.file_name = '';
    this.boqlabel=null;
    for(let obj of this.file_list){
      $('.parent-'+obj).removeClass('divActive');

    }
  }
  //to remove lineitem
  removelineItem(id){
    this.categoryService.removeCuttingItem(id,this.selected_boq).subscribe(
      res=>{
        
        this.successalert = true;
        this.successMessage = "File removed successfully";

        this.getLineItems(this.project_id_split,this.selected_boq);
         
        setTimeout(function() {
      this.successalert = false;
      }.bind(this), 5000);
      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
         
    });
  }

  //to get all selected item
  toggleItem(item,event,val) {
    this.module_value = val;
    item.checked = !item.checked
    this.toggle = this.split_line_item_list[this.module_value].every(item => item.checked)
    if(event.target.checked){
      if(!this.selectLineItemArr.includes(item.id)){
         var obj = {
           'id':item.id,
           'type':item.type
         }
         this.selectLineItemArr.push(obj);
      }
      // this.getList(item);
    }
    else{
      this.selectLineItemArr.forEach((element,index) => {
        
        if(item.id == element.id){
          this.selectLineItemArr.splice(index,1);
          // 
           
          for(var i = 0; i<item.bom.length;i++){
            for(var j = 0;j<this.bom.length;j++){
              if (this.bom[j] === item.bom[i].attributes.id) {
                this.bom.splice(j,1);
              }
            }
          }

          for(var i = 0; i<item.cutting_list.length;i++){
            for(var j = 0;j<this.cuttingList.length;j++){
              if (this.cuttingList[j] === item.cutting_list[i].attributes.id) {
                this.cuttingList.splice(j,1);
              }
            }
          }

          for(var i = 0; i<item.hardware_list.length;i++){
            for(var j = 0;j<this.hardwareList.length;j++){
              if (this.hardwareList[j] === item.hardware_list[i].attributes.id) {
                this.hardwareList.splice(j,1);
              }
            }
          }
        }  
      });
    }
  }

  // //get all list
  // getList(item){
  //   //to get bom list id's
  //    
  //   for (var i = 0;i<item.bom.length;i++) {
  //     this.bom.push(item.bom[i].attributes.id);
  //   }

  //   //to get cutting_list id's
  //   for (var i = 0;i<item.cutting_list.length;i++) {
  //     this.cuttingList.push(item.cutting_list[i].attributes.id);
  //   }

  //   //to get hardware_list id's
  //   for (var i = 0;i<item.hardware_list.length;i++) {
  //     this.hardwareList.push(item.hardware_list[i].attributes.id);
  //   }

  //   //to get imos id's
  //   for (var i = 0;i<item.imos.length;i++) {
  //     this.imos.push(item.imos[i].attributes.id);
  //   }
  //   
  // }

  // getclearList(bomlist,cuttinglist,hardwarelist,imoslist){
  //   //to get bom list id's
  //   for (var i = 0;i<bomlist.length;i++) {
  //     this.bom.push(bomlist[i].attributes.id);
  //   }

  //   //to get cutting_list id's
  //   for (var i = 0;i<cuttinglist.length;i++) {
  //     this.cuttingList.push(cuttinglist[i].attributes.id);
  //   }

  //   //to get hardware_list id's
  //   for (var i = 0;i<hardwarelist.length;i++) {
  //     this.hardwareList.push(hardwarelist[i].attributes.id);
  //   }

  //   //to get imos id's
  //   for (var i = 0;i<imoslist.length;i++) {
  //     this.imos.push(imoslist[i].attributes.id);
  //   }
  //      
  //     for (var i = 0;i<imoslist.length;i++) {
  //     this.imos.push(imoslist[i].attributes.id);
  //   }

  //     
  // }
  
  // clearBom(){
  
  //   if (this.selectLineItemArr.length> 0 && this.bom.length > 0) {
  //     this.loaderService.display(true);
  //     this.categoryService.clearSli(this.bom).subscribe(
  //     res=>{
  //       
  //       this.successalert = true;
  //       this.successMessage = "Files deleted successfully";
  //       this.loaderService.display(false);
  //       this.bom = [];
  //       this.selectLineItemArr = [];
  //       this.getLineItems(this.project_id_split,this.selected_boq);
  //       setTimeout(function() {
  //       this.successalert = false;
  //       }.bind(this), 5000);
         
         
  //     },
  //     err=>{
  //       this.loaderService.display(false);
  //       
  //       this.errorMessageShow(JSON.parse(err['_body']).message);
  //     });
  //   } 
  //   else if(this.bom.length == 0){
  //     this.clearBomForNoContent('bom')

  //   } 
  //   else{
  //     alert('Please Select Atleast One Subline Item');
  //   }

  // }
 
   
  
// send to factory
sendToFactory(){
    this.categoryService.sendFactory(this.project_id_split).subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The Send To Factory you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

  }
  clearBomForNoContent(type){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
     this.selectType=type;
      for(let j=0;j<this.selectLineItemArr.length;j++){
        var obj={
           
          'ownerable_id':this.selectLineItemArr[j].id,
          'ownerable_type':this.selectLineItemArr[j].type,
           
        }
        this.final_file_assign.push(obj);
      } 
    this.selectLineItemArr = [];
    this.loaderService.display(true);
    this.categoryService.clearList(this.final_file_assign,this.selectType).subscribe(
    res=>{ 
      
      this.successalert = true;
      this.successMessage = "Files deleted successfully";
      this.final_file_assign =[];
      this.selectLineItemArr = [];
       
      for(let obj of this.file_list){
        $('.parent-'+obj).removeClass('divActive');

      }
      this.selectLineItemArr = [];
      this.loaderService.display(false);
      this.selectLineItemArr = [];
      this.getLineItems(this.project_id_split,this.selected_boq);
      this.removeItems();
      setTimeout(function() {
      this.successalert = false;
       
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });
  }
  changeFileFormat(event){
    
    if(event == 'bom_sli_manual_sheet'){
      return 'Manual Sheet'

    }
    else if(event == 'imos_manual_sheet'){
      return 'IMOS Manual Sheet'

    }
    else if(event == 'imos'){
      return 'IMOS Parts List'

    } 
  }
  ConvertToUpper(){
   return ''
  }

  vendorFilterSel = "";
  ParentSearch
  ChildSearch
 
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
  headers_res2;
  per_page2;
  total_page2;
  current_page2;
  ListOfProduct2 =[]
  customTrimStart(inputString) {
    let startIndex = 0;
    let endIndex = inputString.length - 1;
  
    // Trim leading spaces
    while (startIndex < inputString.length && inputString[startIndex] === ' ') {
      startIndex++;
    }
  
    // Trim trailing spaces
    while (endIndex >= 0 && inputString[endIndex] === ' ') {
      endIndex--;
    }
  
    return inputString.substring(startIndex, endIndex + 1);
  }
  
  GetProductList2(e) {
    e = e ? e : "";

    if(this.ChildSearch){
      let originalString = this.ChildSearch;
      let trimmedString = this.customTrimStart(originalString);
      this.ChildSearch = trimmedString;
    }
   
    console.log('string',this.ChildSearch,'string') 
    this.loaderService.display(true);
    this.leadService.ListOfPRoduct2(
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
  VendorList2;
  getVendorList2() {
    this.leadService.ListOfVendors().subscribe((res) => {
      console.log(res);
      this.VendorList2 = res.vendors;
    });
  }
MapBom_id:any;
data_heir;
FullHierData;
  mapCatItem(id,Condi){

    if(!Condi){
    this.MapBom_id =id  ;
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.selectType = "";
     $('#BomMappingModal').modal('show');
     this.selectType = ""
     this.GetProductList2("")

    }
    

  }

  infocatModel(data){
      console.log(data);
    $('#glassAnimals2').modal('show');
    this.FullHierData = data;
    this.data_heir = data.master_line_item_details


  }

  SFG_Data:any


  infocatModelSfg(id){
  
  $('#glassAnimals3').modal('show');
  this.loaderService.display(true);

  this.categoryService.SFGDataGet(this.Bom_id , id).subscribe(res=>{
    this.loaderService.display(false);

    this.SFG_Data = res;

  },err=>{

    this.loaderService.display(false);
    this.SFG_Data = undefined;
           
    this.errorMessageShow(JSON.parse(err['_body']).message);

  })

}
  layout_show_hide : any = false
  GetRawForread(){

    this.loaderService.display(true);

    this.categoryService.ReadMToDataGet(this.Bom_id,this.ValidateMissing2,this.boqlabel).subscribe(
      res=>{
        this.loaderService.display(false);
        if(this.ValidateMissing2 == 'raw_material'){

          this.RawMatData = res.sheet_items.non_mto_bom_rms     ;

        } else{ 
          if(this.ValidateMissing2 == 'hardware'){
            this.RawMatData = res.sheet_items.non_mto_bom_hws
          } else{

            if(this.ValidateMissing2 == 'layouts'){
              this.layout_show_hide = true;
              this.RawMatKey = res  
              this.RawMatData = res.sheet_items.non_mto_bom_layouts;

            } else{
              this.RawMatKey = res  
              this.RawMatData = res.sheet_items.non_mto_bom_sfgs;

            }

            

          }
             
         
          
        } 
       
       
    
      },
        err=>{
          
          this.loaderService.display(false);
           
        this.errorMessageShow(JSON.parse(err['_body']).message);
      });

  }
  mapClick(pro){
    console.log(pro)
   
    this.loaderService.display(true);
    this.categoryService.MapDataAdd(pro,this.Bom_id,this.ValidateMissing2,this.MapBom_id).subscribe(
    res=>{
      this.loaderService.display(false);
      this.successMessageShow(res.message.message);
      $('#BomMappingModal').modal('hide');
      $('#LayeresBomUpload').modal('hide');
      this.GetRawForread()
      this.closeLayoutModal()

  
    },
      err=>{
        
        this.loaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });




  }
  RawCount = 0;
  hardWarecount = 0;
  layoutCount = 0;

  CheckCondi(){

    let Dis =[]

    this.RawMatData.forEach(el=>{

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
  DoneCheck(){
    let Dis =[]

    this.layoutListing.forEach(el=>{

      if(el.id == this.layoutRadioId){
        Dis.push(el)
      }

    })

    if(Dis.length == 0){
      return true

    } else{
      return false
    }

  }
  DoneChecksfg(){
    let Dis =[]

    this.SFGListing.forEach(el=>{

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
  ProClik(){
    if(this.ValidateMissing2 == 'raw_material'){

      if(this.hardWarecount == 0){
        this.hardMatGeyData(this.Bom_id)
      } else{
        this.ValidateMissing2 = 'hardware'
        this.GetRawForread()
      }

     

    } else{
      if(this.ValidateMissing2 == 'hardware'){

        if(this.layoutCount == 0){
          this.LayoutMatGeyData(this.Bom_id)
         
        } else{
          this.ValidateMissing2 = 'layouts'
          this.GetRawForread()

        }

       

      } else{

        if(this.sfgcount == 0){
          this.SFGMatGeyData(this.Bom_id)
        } else{
          this.ValidateMissing2 = 'sfg'
        this.GetRawForread()

        }

       
      }
    }
  }
  backClik(){

    if(this.ValidateMissing2 == 'hardware'){
      this.ValidateMissing2 = 'raw_material';

      this.GetRawForread()
      
    } else{
      if(this.ValidateMissing2 == 'layouts'){
        this.ValidateMissing2 ='hardware'
        this.GetRawForread()
      } else{

        this.ValidateMissing2 = 'layouts'
        this.GetRawForread()

      }
    }

  }
  ProCliksfg(){



    this.loaderService.display(true);
    this.categoryService.PordBomSfg(this.Bom_id).subscribe(
    res=>{
      this.loaderService.display(false);

      this.successMessageShow("BOM Uploaded successfully");
      this.CheckBomValidation(this.selected_boq)
      $('#BomvalidtaionModal2').modal('hide');
      this.CheckBomValidation(this.selected_boq)

  
    },
      err=>{
        
        this.loaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });
 
  

  }
  LengthCLi
  WidthCli
  MLIsubmit(){
    this.MLIForm.controls['delta_bom_id'].setValue(this.Bom_id);
    this.MLIForm.controls['layout_id'].setValue(this.layOut_id);
    this.loaderService.display(true);
    this.categoryService.LayoutDataAdd(this.MLIForm.value).subscribe(
    res=>{
      this.loaderService.display(false);
      this.successMessageShow("MLI Created successfully");
      this.CreateMLForm();
      this.MLI_id = res.mli.id;
      this.WidthCli = res.cli_attributes.width;
      this.LengthCLi = res.cli_attributes.length;
      this.CLIForm.controls['item_name'].setValue(res.cli_attributes.item_name)
      this.CLIForm.controls['item_code'].setValue(res.cli_attributes.item_code)
      this.CLIForm.controls['length'].setValue(res.cli_attributes.length)
      this.CLIForm.controls['width'].setValue(res.cli_attributes.width)
      $('#LayeresBomUpload').modal('hide');
      $('#CliUploadModal').modal('show');
      this.ItemnameEdit = true;
      this.ItemCodeEdit = true;
      this.LengthSfgRead = true;
      this.widthSfgRead = true;


      
    },
      err=>{
        
        this.loaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });

  }
LayoutName =''
  MLISfgsubmit(){
    this.MLIFormSfg.controls['delta_bom_id'].setValue(this.Bom_id);
    this.MLIFormSfg.controls['sfg_id'].setValue(this.layOut_id);
    this.loaderService.display(true);
    console.log(this.MLIFormSfg.value,'----------testing')
    this.categoryService.SFGDataAdd(this.MLIFormSfg.value).subscribe(
    res=>{
      this.loaderService.display(false);
      this.successMessageShow("MLI Created successfully");
      this.LayoutName = this.MLIFormSfg.value.layout
      this.CreateMLForm();
      this.MLI_id = res.mli.id;

      this.CLIsfgForm.controls['layout_id'].setValue(res.cli_attributes.layout_id )
     
      this.CLIsfgForm.controls['item_name'].setValue(res.cli_attributes.item_name)
      this.CLIsfgForm.controls['item_code'].setValue(res.cli_attributes.item_code)
      this.CLIsfgForm.controls['item_name'].setValue(res.cli_attributes.item_name)
      this.CLIsfgForm.controls['item_code'].setValue(res.cli_attributes.item_code)
      let Cli = res.cli_attributes;
      
      this.Edge1 = Cli.edge_band_1_id?parseInt(Cli.edge_band_1_id):Cli.edge_band_1_id
      this.Edge2 = Cli.edge_band_2_id?parseInt(Cli.edge_band_2_id):Cli.edge_band_2_id
      this.Edge3 = Cli.edge_band_3_id?parseInt(Cli.edge_band_3_id):Cli.edge_band_3_id
      this.Edge4 = Cli.edge_band_4_id?parseInt(Cli.edge_band_4_id):Cli.edge_band_4_id

      this.CLIsfgForm.controls['edge_band_1_id'].setValue(this.Edge1)
      this.CLIsfgForm.controls['edge_band_2_id'].setValue(this.Edge2)
      this.CLIsfgForm.controls['edge_band_3_id'].setValue(this.Edge3)
      this.CLIsfgForm.controls['edge_band_4_id'].setValue(this.Edge4)
      this.CLIsfgForm.controls['handle'].setValue(res.cli_attributes.handle);
      this.CLIsfgForm.controls['groove_handle_side'].setValue(res.cli_attributes.groove_handle_side)
      this.CLIsfgForm.controls['handle_groove_length'].setValue(res.cli_attributes.handle_groove_length)

     
     
      $('#LayeresBomUpload').modal('hide');
      $('#CliUploadModal').modal('show');
      this.ItemnameEdit = true;
      this.ItemCodeEdit = true;
      this.GroveEdit = true

      this.FtechItemDetailsSfg()

      
    },
      err=>{
        
        this.loaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });

  }
  CLIsubmit(){

    this.CLIForm.controls['layout_id'].setValue(this.layOut_id)
    this.CLIForm.controls['mli_id'].setValue(this.MLI_id);
    this.CLIForm.controls['delta_bom_id'].setValue(this.Bom_id);

    this.loaderService.display(true);
    this.categoryService.CliLayoutDataAdd(this.CLIForm.value).subscribe(
    res=>{
      this.loaderService.display(false);
      this.successMessageShow("CLI Created successfully");
      this.CreateMLForm();
      $('#CliUploadModal').modal('hide');
      this.GetRawForread()

      
    },
      err=>{
        
        this.loaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });



  }
  MLI_id;
  MLIDetials:any;
  Edge1;
  Edge2;
  Edge3;
  Edge4;

  FtechItemDetails(){
    
    this.LengthCLi = this.LengthCLi?this.LengthCLi:''
    this.WidthCli = this.WidthCli?this.WidthCli:''
    this.MLI_id = this.MLI_id?this.MLI_id:''
  
    if(this.LengthCLi !='' && this.WidthCli !=''  ){

      this.loaderService.display(true);

      this.categoryService.ItemnameMToDataGet(this.MLI_id,this.LengthCLi,this.WidthCli).subscribe(
        res=>{
          this.loaderService.display(false);
          this.CLIForm.controls['item_name'].setValue(res.cli_attributes.item_name)
          // this.CLIForm.controls['item_code'].setValue(res.cli_attributes.item_code)
    
         
      
        },
          err=>{
            
            this.loaderService.display(false);
        });

    }
   
  }
  FtechItemDetailsSfg(){
    let Edg1,Edg2,Edg3,Edg4;
    Edg1 =  this.SFGEdgeBands.filter(el=>{
      return el.id== this.CLIsfgForm.value.edge_band_1_id
    })
    Edg2 =  this.SFGEdgeBands.filter(el=>{
     return el.id == this.CLIsfgForm.value.edge_band_2_id
   })
   Edg3 =  this.SFGEdgeBands.filter(el=>{
     return el.id == this.CLIsfgForm.value.edge_band_3_id
   })
   Edg4 =  this.SFGEdgeBands.filter(el=>{
     return el.id == this.CLIsfgForm.value.edge_band_4_id
   })

   console.log(Edg1)
    Edg1 =  Edg1[0]?Edg1[0].sheet_item_name:'NA'
    Edg2 =  Edg2[0]?Edg2[0].sheet_item_name:'NA'
    Edg3 =  Edg3[0]?Edg3[0].sheet_item_name:'NA'
    Edg4 =  Edg4[0]?Edg4[0].sheet_item_name:'NA'
    console.log(Edg1)


  
    this.loaderService.display(true);
    this.categoryService.ItemnameMToDataGetSfg(this.MLI_id,Edg1,Edg2,Edg3,Edg4,this.Bom_id,this.LayoutName).subscribe(
    res=>{
      this.loaderService.display(false);
      this.CLIsfgForm.controls['item_name'].setValue(res.item_name?res.item_name:'')
      this.CLIsfgForm.controls['cli_id'].setValue(res.cli_id?res.cli_id:'')
     
  
    },
      err=>{
        
        this.loaderService.display(false);
    });
  }
  SetVaulue(event,formControl1,formControl2){
    event = event.target.value;
    event = JSON.parse(event)
    this.CLIsfgForm.controls[formControl1].setValue(event['edge_band'])
    this.CLIsfgForm.controls[formControl2].setValue(event['raw_material_id'])
  }
  SetVaulueobj(event,event2,formControl1,formControl2){
  
    this.CLIsfgForm.controls[formControl1].setValue(event)
    this.CLIsfgForm.controls[formControl2].setValue(event2)
  }


  

  CLISfgsubmit(){
    this.CLIsfgForm.controls['mli_id'].setValue(this.MLI_id);
    this.CLIsfgForm.controls['delta_bom_id'].setValue(this.Bom_id);
    this.CLIsfgForm.controls['sfg_id'].setValue(this.MapBom_id);
     let Edg1,Edg2,Edg3,Edg4;

     Edg1 =  this.SFGEdgeBands.filter(el=>{
       return el.id == this.CLIsfgForm.value.edge_band_1_id
     })
     Edg2 =  this.SFGEdgeBands.filter(el=>{
      return el.id == this.CLIsfgForm.value.edge_band_2_id
    })
    Edg3 =  this.SFGEdgeBands.filter(el=>{
      return el.id == this.CLIsfgForm.value.edge_band_3_id
    })
    Edg4 =  this.SFGEdgeBands.filter(el=>{
      return el.id == this.CLIsfgForm.value.edge_band_4_id
    })

    console.log(Edg1)
     Edg1 =  Edg1[0]?Edg1[0].sheet_item_name:'NA'
     Edg2 =  Edg2[0]?Edg2[0].sheet_item_name:'NA'
     Edg3 =  Edg3[0]?Edg3[0].sheet_item_name:'NA'
     Edg4 =  Edg4[0]?Edg4[0].sheet_item_name:'NA'
     console.log(Edg1)


    this.CLIsfgForm.controls['edge_band_1'].setValue(Edg1);
    this.CLIsfgForm.controls['edge_band_2'].setValue(Edg2);
    this.CLIsfgForm.controls['edge_band_3'].setValue(Edg3);
    this.CLIsfgForm.controls['edge_band_4'].setValue(Edg3);
    

    console.log(this.CLIsfgForm.value);
    this.loaderService.display(true);
    this.categoryService.ClisfgDataAdd(this.CLIsfgForm.value).subscribe(
    res=>{
      this.loaderService.display(false);
      this.successMessageShow("CLI Created successfully");
      this.CreateMLForm();
      $('#CliUploadModal').modal('hide');
      this.GetRawForread()

      
    },
      err=>{
        
        this.loaderService.display(false);
         
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });






  }

  UpdateCLI(id){
    
    let obj ={
      delta_bom_id: this.Bom_id ,
      layout_id : id,
      board : $('#Board'+ id).val(),
      lam_top :$('#LamTop'+id).val(),
      lam_bot :$('#Lambot'+id).val(),
    }
    console.log(obj)
    this.loaderService.display(true);

    this.categoryService.LayoutConDataAdd(obj).subscribe(
      res=>{
        this.loaderService.display(false);
        this.successMessageShow("CLI Created successfully");
       
        this.GetRawForread()
  
        
      },
        err=>{
          
          this.loaderService.display(false);
          this.GetRawForread()
           
        this.errorMessageShow(JSON.parse(err['_body']).message);
      });

  }

  UpdateCLISfg(id,bom){

    let Edg1,Edg2,Edg3,Edg4,Ghandle;
    
 
    Edg1 =  this.UpdatedSfgDropDowns.filter(el=>{
      return el.sheet_item_name == $('#Edg1'+ id).val()
    })
    Edg2 =  this.UpdatedSfgDropDowns.filter(el=>{
     return el.sheet_item_name == $('#Edg2'+ id).val()
   })
   Edg3 =  this.UpdatedSfgDropDowns.filter(el=>{
     return el.sheet_item_name == $('#Edg3'+ id).val()
   })
   Edg4 =  this.UpdatedSfgDropDowns.filter(el=>{
     return el.sheet_item_name == $('#Edg4'+ id).val()
   })
   Ghandle =  this.UpdatedSfghandle.filter(el=>{
    return el.sheet_item_name == $('#handle'+ id).val()
  })

   console.log(Edg1)
    Edg1 =  Edg1[0]?Edg1[0].id:''
    Edg2 =  Edg2[0]?Edg2[0].id:''
    Edg3 =  Edg3[0]?Edg3[0].id:''
    Edg4 =  Edg4[0]?Edg4[0].id:''
    Ghandle = Ghandle[0]?Ghandle[0]:''
    
    let obj ={
      delta_bom_id: this.Bom_id ,
      sfg_id : id,
      edge_band_1:$('#Edg1'+ id).val(),
      edge_band_2:$('#Edg2'+ id).val(),
      edge_band_3:$('#Edg3'+ id).val(),
      edge_band_4:$('#Edg4'+ id).val(),
      groove_handle_side:$('#handle'+ id).val(),
      handle:$('#handlestright'+ id).val(),
      edge_band_1_id :Edg1,
      edge_band_2_id :Edg2,
      edge_band_3_id :Edg3,
      edge_band_4_id :Edg4,

    }
    console.log(obj)
    this.loaderService.display(true);

    this.categoryService.SfgConDataAdd(obj).subscribe(
      res=>{
        this.loaderService.display(false);
        this.successMessageShow("CLI Created successfully");
       
        this.GetRawForread()
  
        
      },
        err=>{
          
          this.loaderService.display(false);
          this.GetRawForread()
           
        this.errorMessageShow(JSON.parse(err['_body']).message);
      });

  }
  CloseValidation(){
    if (confirm("Are you sure you want to close the process ") == true) {

      $('#BomvalidtaionModal2').modal('hide');


    }
  }

  CheckCondisfg(){
    
    let Dis =[]

    this.RawMatData.forEach(el=>{

      if(!el.child_line_item_id){
        Dis.push(el)
      }

    })

    if(Dis.length == 0){
      return false

    } else{
      return true
    }
  }
  PushProdBom(can_click,id){
   let OBj ={
    stage : this.ValidateMissing2,
    prod_bom_id : id
   }
   if(can_click){

    this.loaderService.display(true);

    this.categoryService.Prod_bomPush(OBj).subscribe(
      res=>{
        this.loaderService.display(false);
        this.successMessageShow("Triggered Production Bom Successfully");
       
        this.GetRawForread()
  
        
      },
        err=>{
          
          this.loaderService.display(false);
          this.GetRawForread()
           
        this.errorMessageShow(JSON.parse(err['_body']).message);
      });

   }
    



  }

  RefreshData(){
    this.ChildSearch = "";
    this.vendorFilterSel = "";
    this.selectType = "";
   
     this.GetProductList2("")

  }
  ThicknessLayRead = true
  ThicknessLay(){

    this.ThicknessLayRead =  !this.ThicknessLayRead

  }
  LengthSfgRead = true;
  widthSfgRead = true
  lengthsfg(){
  this.LengthSfgRead = !this.LengthSfgRead

  }
  GroveEdit = true
  Grovlengthsfg(){
    this.  GroveEdit = !this.  GroveEdit
  
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
  
  boqlabel:any;

  filterbyboq(val){
    this.boqlabel=val
    this.GetRawForread();

  }
  textFormt(text){

    if(text){
    if(text == 'left/front'){
      return 'left'
    }

    if(text == 'right/back'){
      return 'right'
    }

    if(text == 'na'){
      return 'NA'
    }

    return text
  
    } else{
      return ''
    }

  }
}
