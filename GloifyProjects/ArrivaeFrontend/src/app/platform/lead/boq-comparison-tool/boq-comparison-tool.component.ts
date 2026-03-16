import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'app/platform/quotation/quotation.service';

import { LoaderService } from "../../../services/loader.service";
import { LeadService } from '../lead.service';
declare var $: any;
@Component({
  selector: 'app-boq-comparison-tool',
  templateUrl: './boq-comparison-tool.component.html',
  styleUrls: ['./boq-comparison-tool.component.css'],
  providers: [LeadService, QuotationService]
})
export class BoqComparisonToolComponent implements OnInit {

  constructor(public leadService: LeadService,
    private quotationService: QuotationService,
    public loaderService: LoaderService) { }
  firstBoqName: any = ''
  SecondBoqName: any = ''
  selectedBOQDetail: any = [];
  ngOnInit() {
    this.firstBoqName = 'Select BOQ 1'
    this.SecondBoqName = 'Select BOQ 2'

  }
  boqFlag: any
  showModal(event: any) {
    this.selectedBOQDetail = [];
    if (this.boqFlag != undefined && this.boqFlag != event) {
      this.highlightRow = '';
    } if (event == 'firstBoq') {
      this.highlightRow = "";
    } if (event == 'secondBoq') {
      this.highlightRow = "";
    }

    this.boqFlag = event;
    ($("#onTrackModal") as any).modal("show");
    this.searchValue ="";
    this.gm_Id ="";
    this.cm_Id ="";
    this.cm_Id ="";
    this.designer_Id ="";
    this.boqSearchInputValue ="";
    this.gmfilteritem ="";
    this.cmfilteritem ="";
    this.designfilteritem ="";
    this.selectProjectHandle();
  }


  searchValue: any = "";
  boqSearchInputValue: any = ''
  onSearchInput(event: any) {
    this.searchValue = event.target.value;
  }


  heading: any = "Select Project";
  boqTableData: any = [];
  page: any = 1;
  itemPerPage = 10;
  headers_res2: any;
  per_page2: number;
  total_page2: any;
  current_page2: number;
  gmListdata: any = []
  cmListData: any = [];
  gm_Id: any = ''
  cm_Id: any = ''
  designer_Id: any = ''
  selectProjectHandle(e?: any) {
    e = e ? e : "";

    this.loaderService.display(true);
    this.leadService
      .boqProjectData(e, 10, this.searchValue, this.gm_Id, this.cm_Id, this.designer_Id).subscribe((res) => {
        this.boqTableData = [];
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        res = res.json();
        this.boqTableData = res;
      });
    this.leadService.getGmCmDesignerList(this.gm_Id, this.cm_Id).subscribe((res) => {
      this.gmListdata = []
      this.gmListdata = res;
      this.cmListData = res;

      this.loaderService.display(false);

    })
  }
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function () {
      this.successalert = false;
    }.bind(this), 10000);
  }
  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function () {
      this.erroralert = false;
    }.bind(this), 10000);
  }
  refreshBoqModalData() {
    this.boqTableData = [];
    this.gm_Id = '';
    this.gmfilteritem = '';
    this.cmfilteritem = '';
    this.cm_Id = '';
    this.designfilteritem = '';
    this.designer_Id = '';
    this.searchValue = '';
    this.boqSearchInputValue = '';
  }

  selectedGmId: any = '';
  selectedCmId: any = '';
  gmfilteritem: any = '';
  cmfilteritem: any = '';
  designfilteritem: any = '';
  getGmCmDesignerListData(id: any, text: any) {
    if (text == 'gmData' && id !== undefined) {
      this.cmListData = [];
      this.selectedGmId = id;
      this.gm_Id = id;
      this.cm_Id = '';
      this.selectedCmId = '';
      this.designer_Id = ''
      this.cmfilteritem = ''
      this.designfilteritem = ''
      this.leadService.getGmCmDesignerList(this.selectedGmId, this.selectedCmId).subscribe((res) => {
        this.cmListData = res;
      })
      this.selectProjectHandle();
    } else if (text == 'gmData' && id == undefined) {
      this.selectedGmId = '';
      this.gm_Id = '';
      this.cm_Id = '';
      this.selectedCmId = '';
      this.designer_Id = ''
      this.gmfilteritem = ''
      this.cmfilteritem = ''
      this.designfilteritem = ''
      this.leadService.getGmCmDesignerList(this.selectedGmId, this.selectedCmId).subscribe((res) => {
        this.cmListData = res;
      })
      this.selectProjectHandle();
    }
    if (text == 'cmData' && id !== undefined) {
      this.selectedCmId = id;
      this.cm_Id = id;
      this.designer_Id = ''
      this.designfilteritem = ''
      this.leadService.getGmCmDesignerList(this.selectedGmId, this.selectedCmId).subscribe((res) => {
        this.cmListData = res;
      })
      this.selectProjectHandle();
    } else if (text == 'cmData' && id == undefined) {
      this.selectedCmId = ''
      this.cm_Id = ''
      this.designer_Id = ''
      this.cmfilteritem = ''
      this.designfilteritem = ''
      this.leadService.getGmCmDesignerList(this.selectedGmId, this.selectedCmId).subscribe((res) => {
        this.cmListData = res;
      })
      this.selectProjectHandle();
    }
  }


  onDesignerChangeHandle(event: any) {
    this.designer_Id = ''
    if (event !== undefined) {
      this.designer_Id = event;
    } else {
      this.designfilteritem = '';
    }
    this.selectProjectHandle();
  }
  highlightRow: any;
  importquotations: any = []
  importquotations2: any = [];
  highlightFirst: any;
  highlightSecond: any;
  importQuotationValue(pid: any, index: any) {
    if (this.boqFlag == 'firstBoq') {
      this.highlightFirst = index;
    }
    else if (this.boqFlag == 'secondBoq') {
      this.highlightSecond = index;
    } else {
      this.highlightRow = index;
    }

    this.loaderService.display(true);
    this.quotationService.getImportQuotationList(pid.id).subscribe(
      (res) => {
        this.importquotations = [];
        this.importquotations2 = [];
        this.importquotations2 = res;
        res.forEach(element => {
          this.importquotations.push({
            id: element.attributes.id,
            itemName: element.attributes.reference_number
          })
          console.log(this.importquotations)
        });
        console.log("newww", this.importquotations2)
        this.loaderService.display(false);
        ($("#onTrackModal") as any).modal("hide");
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  addBoqModalHandle() {
    ($("#addBoqModal") as any).modal("show");
  }
  first_boq_id: any;
  seconed_boq_id: any;
  getBoqType(boq_id: any) {
    if (this.boqFlag == 'firstBoq') {
      let BoqData = this.importquotations2.find(itm => itm.id == boq_id)
      this.firstBoqName = BoqData.attributes.reference_number;
      // this.first_boq_id = BoqData.attributes.id;
      // console.log(this.first_boq_id);
      this.first_boq_id = boq_id;
    }
    if (this.boqFlag == 'secondBoq') {
      let BoqData = this.importquotations2.find(itm => itm.id == boq_id)
      this.SecondBoqName = BoqData.attributes.reference_number;
      // this.seconed_boq_id = BoqData.attributes.id;
      // console.log(this.seconed_boq_id);
     
      this.seconed_boq_id = boq_id;
    }
    ($("#addBoqModal") as any).modal("hide");

  }

  comparedDataBoq: any = []
  changeStatus: any;
  changeStatusLose: any;
  spaceWiseDataLoose: any = []
  showSpacewiselose = false;
  showSpacewisecust = false;
  showSpacewisekitch = false;
  showSpacewisewrdrobe = false;
  showSpacewiseCF = false;
  onCompareHandle() {
    this.comparedDataBoq = []
    this.spaceWiseData = [];
    this.spaceWiseDataLoose = [];
    this.spacewiseDataCustomElement = [];
    this.indexcount = null;
    this.indexcount2 = null;
    this.indexcount3 = null;
    this.loaderService.display(true);
    this.leadService.compareBoqs(this.first_boq_id, this.seconed_boq_id).subscribe((res) => {
      this.comparedDataBoq = []
      this.comparedDataBoq = res;
      this.changeStatus = res.services.change_status;
      this.changeStatusLose = res.loose_furniture.change_status;
      this.showSpacewise = false;
      this.showSpacewiselose = false;
      this.showSpacewisecust = false;
      this.showSpacewisekitch = false;
      this.showSpacewisewrdrobe = false;
      this.showSpacewiseCF = false;
      this.spaceWiseData = this.comparedDataBoq.services.spacewise_details;
      this.spaceWiseDataLoose = this.comparedDataBoq.loose_furniture.spacewise_details;
      this.spacewiseDataCustomElement = this.comparedDataBoq.custom_element.spacewise_details;
      this.spacewiseDatamodular_kitchen = this.comparedDataBoq.modular_kitchen.spacewise_details;
      this.spacewiseDatamodular_wardrobe = this.comparedDataBoq.modular_wardrobe.spacewise_details;
      this.spacewiseDatacustom_furniture = this.comparedDataBoq.custom_furniture.spacewise_details;
    

      console.log("boq data", res);
      this.loaderService.display(false);
    })
  }

  spaceWiseData: any = [];
  showSpacewise: any = false;
  showSpacewiseDetails() {
    this.spaceWiseData = [];
    this.spaceWiseData = this.comparedDataBoq.services.spacewise_details;
    console.log('ddd', this.spaceWiseData);

    this.showSpacewise = !this.showSpacewise
  }
  showSpacewiseDetailsloose() {
    this.spaceWiseDataLoose = [];
    this.spaceWiseDataLoose = this.comparedDataBoq.loose_furniture.spacewise_details;
    console.log('ddd', this.spaceWiseDataLoose);
    this.showSpacewiselose = !this.showSpacewiselose;
  }

  spacewiseDataCustomElement: any = [];
  showSpacewiseDetailsCustom() {
    this.spacewiseDataCustomElement = [];
    this.spacewiseDataCustomElement = this.comparedDataBoq.custom_element.spacewise_details;
    console.log("custom Data", this.spacewiseDataCustomElement);
    this.showSpacewisecust = !this.showSpacewisecust;
  }
  spacewiseDatamodular_kitchen: any = [];
  showSpacewiseDetailsMK() {
    this.spacewiseDatamodular_kitchen = [];
    this.spacewiseDatamodular_kitchen = this.comparedDataBoq.modular_kitchen.spacewise_details;
    this.showSpacewisekitch = !this.showSpacewisekitch;
  }
  spacewiseDatamodular_wardrobe: any = [];
  showSpacewiseDetailsMW() {
    this.spacewiseDatamodular_wardrobe = [];
    this.spacewiseDatamodular_wardrobe = this.comparedDataBoq.modular_wardrobe.spacewise_details;
    this.showSpacewisewrdrobe = !this.showSpacewisewrdrobe;
  }
  spacewiseDatacustom_furniture =[];
  showSpacewiseDetailsCF() {
    this.spacewiseDatacustom_furniture = [];
    this.spacewiseDatacustom_furniture = this.comparedDataBoq.custom_furniture.spacewise_details;
    this.showSpacewiseCF = !this.showSpacewiseCF;
  }


  indexcount: any
  togglespace(i) {
    if (i == this.indexcount) {
      this.indexcount = null
    } else {
      this.indexcount = i
    }




  }
  indexcount2: any
  togglespacelLose(i) {
    if (i == this.indexcount2) {
      this.indexcount2 = null
    } else {
      this.indexcount2 = i
    }
  }

  indexcount3: any
  togglespaceCustomElement(i) {
    if (i == this.indexcount3) {
      this.indexcount3 = null
    } else {
      this.indexcount3 = i
    }
  }

  indexcount4: any
  togglespaceMK(i) {
    if (i == this.indexcount4) {
      this.indexcount4 = null
    } else {
      this.indexcount4 = i
    }
  }

  indexcount5: any
  togglespaceMW(i) {
    if (i == this.indexcount5) {
      this.indexcount5 = null
    } else {
      this.indexcount5 = i
    }
  }
  indexcount6: any
  togglespaceCF(i) {
    if (i == this.indexcount6) {
      this.indexcount6 = null
    } else {
      this.indexcount6 = i
    }
  }
  dataForLineItems:any
  fullitem_details:any
  showLineItemDetails(data,item){
    console.log(item);
    if(item){
      this.fullitem_details = this.comparedDataBoq.modular_kitchen
    } else{
      this.fullitem_details =null;
    }
    
    console.log(this.fullitem_details)
    console.log(data);
    this.dataForLineItems = data
    $("#lineitemsModal").modal("show");

  }


  boq_dropdownSettings = {
    singleSelection: true,
    text: "Select BOQ",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    classes: "myclass custom-class-dropdown",
  };

  boq_dropdownList: any = [];
  OnItemDeSelect2() {
    if (this.boqFlag == 'firstBoq') {
      this.firstBoqName = '';
      this.first_boq_id = null;
      this.firstBoqName = 'Select BOQ 1'
    }
    if (this.boqFlag == 'secondBoq') {
      this.SecondBoqName = '';
      this.seconed_boq_id = null;
      this.SecondBoqName = 'Select BOQ 2'
    }
  }
  onSelectAll(event?) { }
  onDeSelectAll(event?) { }


 toggleObject = {
   services:false,
   loosefurniture:false,
   customelements:false,
   modularkicthen:false,
   modularwradrobe:false
 }
 showspaces(){
   
 }

 decmal(num){
   return num.toFixed(2);

 }
 print(e){
   
 
   if(e){
    return Object.keys(e)
   }
   
 }
 printdetail(data,e){

 
 
  if(data && e){
    return data[e]
  }
  
 
 }

dataForMTOLineitems:any=[]
 showLineItemDetailsCF(data,id,id2){
   this.loaderService.display(true)
  this.leadService.MTOComparison(id,id2).subscribe((res)=>{
    this.loaderService.display(false);
    $("#lineitemsModalMTO").modal("show");
    this.dataForMTOLineitems = res.mto_job_details.job_type_wise_details;
    
  },err=>{
    this.loaderService.display(false);
    

  })

 }

 ExportBoqComparision(){
  this.loaderService.display(true)
  this.leadService.ExportBoqComparision(this.first_boq_id, this.seconed_boq_id).subscribe((res) => {
    this.loaderService.display(false);
    this.successMessageShow('BOQ Comparison File Downloaded Successfully!');
    var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var b64Data = res.export_url.boq_encoded_file;
    var blob = this.b64toBlob(b64Data, contentType, 512);
    var blobUrl = URL.createObjectURL(blob);
    let dwldLink = document.createElement("a");
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", blobUrl);
    dwldLink.setAttribute("download", res.export_url.file_name);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  },err => {
    this.loaderService.display(false)
    this.errorMessageShow("Error");
  })
 }

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
  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
 valuegetter(data){
   if(data.original_name){
     return data.original_name
   } else{
     if(data.other_name){
       return data.other_name 
     } else{
       return ''
     }
   }
 }
 
}
