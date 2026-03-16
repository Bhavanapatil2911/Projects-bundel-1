import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-promo-packages',
  templateUrl: './promo-packages.component.html',
  styleUrls: ['./promo-packages.component.css'],
  providers: [LeadService]
})
export class PromoPackagesComponent implements OnInit {

  constructor(
    private leadService: LeadService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,

  ) { }


  per_page;
  total_page;
  current_page;
  headers_res;
  page_number;

  promoPackagesForm: FormGroup

  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  today_date: any;
  ngOnInit() {

    this.today_date = (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 33, 30, 0)).toISOString().split('T')[0]
    document.getElementsByName("txtDate")[0].setAttribute('min', this.today_date);
    this.getPromoPackages(1, '', 'active');
    this.getStatusList();
    this.categoryList()
    this.promoPackagesForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      promo_code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      remarks: new FormControl(''),
      promo_image : new FormControl(''),
      // promo_value: new FormControl(''),
      // promo_discount_percent: new FormControl(''),
      promo_threshold: new FormControl('', [Validators.required, Validators.min(1)]),
      expiry_date: new FormControl(''),
      lead_qualification_date:new FormControl(''),
      // term_condition: new FormControl(''),
      promo_category_offers_attributes :  this.formBuilder.array([this.createOfferings()]),
      closure_tat_days : new FormControl(null, [Validators.min(1)]),
      p2p_tat_days : new FormControl(null, [Validators.min(1)]),
    });
  }

  minVal = 0
  maxVal =100

  createOfferings(): FormGroup{
    return this.formBuilder.group({
      category : new FormControl('', [Validators.required]),
      promo_value : new FormControl(''),
      promo_discount_percent : new FormControl('')
    })
  }
  convertDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  showAddButton : boolean = true
  pushofferings(offeringform){
    console.log(offeringform.get('promo_category_offers_attributes').length+1,  this.categoryListData.length  );
    if(offeringform.get('promo_category_offers_attributes').length +1  < this.categoryListData.length){
      this.showAddButton = true
    }else{
      this.showAddButton = false
    }
    return offeringform.get('promo_category_offers_attributes').push(this.createOfferings())
  }

  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function () {
      this.erroralert = false;
    }.bind(this), 10000);
  }
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function () {
      this.successalert = false;
    }.bind(this), 10000);
  }

  statusList: any = [];
  getStatusList() {
    this.loaderService.display(true);
    this.leadService.fetchStatusList().subscribe(
      res => {
        this.loaderService.display(false);
        this.statusList = res;
        
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  per_page_promo :any

  lead_priority_que_arr;
  getPromoPackages(currentPage, value: any, status) {
    if (this.per_page == undefined) {
      this.per_page = 10;
    }
    if(currentPage == undefined){
      currentPage = 1
    }
    this.page_number = currentPage;
    this.loaderService.display(true);
    this.leadService.getPromoPackages(currentPage, value, '', '','','', this.per_page).subscribe(
      res => {
        this.loaderService.display(false);
        this.per_page = 10;
        res = res.json();
        this.total_page = res.count;
        this.current_page = res.page_number;
        this.lead_priority_que_arr = res.promo_packs;
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  clearEditPromoId() {
    this.validPromo = '';
    this.edited_promo_code = null;
    this.image = null;
    this.imageUrl = null;    
    this.storeallindexToremoveoffer = []
    this.showAddButton = true
    // console.log(this.promoPackagesForm);
    this.forOldPromo = true
    this.checkfornull = false

    this.checkfornull = false
    this.categorySelectionAll_MK  = false
    this.categorySelectionAll_MK_Both  = false
  
    this.categorySelectionAll_MW  = false
    this.categorySelectionAll_MW_Both  = false

    this.categorySelectionAll_MTO  = false
    this.categorySelectionAll_MTO_Both  = false
  
    this.AllFurnituare  = false
    this.AllFurniture_others  = false
    this.disableForCondition = false
  }

  imageUrl: any;
  edited_promo_code: any;
  Singlepromocode :any
  forOldPromo : boolean = true
  fetchPromoDetails(promoId) {
    this.imageUrl = ''
    this.storeallindexToremoveoffer = []
    this.showAddButton = true
    this.validPromo = '';
    this.edited_promo_code = promoId;
    this.loaderService.display(true);
    this.leadService.fetchPromoCode(promoId).subscribe(
      res => {
        this.loaderService.display(false);
        console.log(res);
        this.Singlepromocode = res
        this.promoPackagesForm.controls['name'].setValue(res.promo_pack.name);
        this.promoPackagesForm.controls['promo_code'].setValue(res.promo_pack.code);
        this.promoPackagesForm.controls['description'].setValue(res.promo_pack.description);
        this.promoPackagesForm.controls['remarks'].setValue(res.promo_pack.remarks);
        this.promoPackagesForm.controls['closure_tat_days'].setValue(res.promo_pack.closure_tat_days);
        this.promoPackagesForm.controls['p2p_tat_days'].setValue(res.promo_pack.p2p_tat_days);
        // this.promoPackagesForm.controls['promo_value'].setValue(res.promo_pack.promo_value);
        // this.promoPackagesForm.controls['promo_discount_percent'].setValue(res.promo_pack.promo_discount_percent);
        this.promoPackagesForm.controls['promo_threshold'].setValue(res.promo_pack.threshold);
        this.promoPackagesForm.controls['expiry_date'].setValue(res.promo_pack.expiry_date);
        this.promoPackagesForm.controls['lead_qualification_date'].setValue(res.promo_pack.lead_qualification_date?this.convertDate(res.promo_pack.lead_qualification_date):'');
        var offer_array = this.promoPackagesForm.get('promo_category_offers_attributes') as FormArray
        (<FormArray>offer_array).controls = []
        console.log(offer_array);
        for(var i =0 ; i<res.promo_pack.promo_category_offers.length ; i++){
          offer_array.push(
            this.formBuilder.group({
              category : new FormControl(
                res.promo_pack.promo_category_offers[i].category , Validators.required 
              ),
              promo_value : new FormControl(
                res.promo_pack.promo_category_offers[i].promo_value 
              ),
              promo_discount_percent : new FormControl(
                res.promo_pack.promo_category_offers[i].promo_discount_percent 
              ),
              id : new FormControl(
                res.promo_pack.promo_category_offers[i].id
              )
            })
          )
        }
        if (res.promo_pack.promo_image !== "/images/original/missing.png"){
          this.imageUrl = res.promo_pack.promo_image
        }
        if(this.Singlepromocode.promo_pack.promo_display_value){
          this.promoPackagesForm.get('promo_category_offers_attributes').clearValidators()
          this.promoPackagesForm.get('promo_category_offers_attributes').updateValueAndValidity();
          this.forOldPromo = false
        }else{
          this.forOldPromo = true
        }
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  activeUploadImage() {
    document.getElementById("uploadImage").click()
  }

  image: any;
  imageName: any;
  uploadImage(event) {
    this.image = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.imageUrl = base64.result;
      console.log(this.imageUrl);
      
      this.promoPackagesForm.patchValue({
        promo_image: this.imageUrl,
      });
    };
    fileReader.readAsDataURL(this.image);
  }



  validPromo;
  validPromoDiscount;
  // onSubmit(value) {
  //   this.loaderService.display(true);
  //   if(value.promo_value || value.promo_discount_percent){
  //     if (value.promo_code.indexOf(" ") > -1) {
  //       this.validPromo = "Enter Valid Promo Code (Space not allowed)";
  //       this.loaderService.display(false);
  //     }
  //     else {
  //       this.leadService.createPromoCode(value, this.image).subscribe(
  //         res => {
  //           this.loaderService.display(false);
  //           this.promoPackagesForm.reset();
  //           this.image = null;
  //           this.validPromo = '';
  //           $('#promoCodeModal').modal('hide');
  //           this.successMessageShow('Promo Code Created Successfully!');
  //           this.getPromoPackages(1, '', 'active');
  //         },
  //         err => {
  //           this.loaderService.display(false);
  //           this.erroralert = true;
  //           this.errorMessageShow(JSON.parse(err['_body']).message);
  //           this.errorMessageShow(JSON.parse(err['_body']).message.code);
  //           this.errorMessageShow(JSON.parse(err['_body']).message.promo_discount_percent[0]);
  //           this.validPromo = JSON.parse(err['_body']).message.code
  //         }
  //       );
  //     }
  //   }else{
  //     this.erroralert = true;
  //     this.errorMessage = "Enter Promo Value Or Promo Discount Percent";
  //     this.loaderService.display(false);
  //   }
     
  // }


  onSubmit(value) {
    this.loaderService.display(true);
      if (value.promo_code.indexOf(" ") > -1) {
        this.validPromo = "Enter Valid Promo Code (Space not allowed)";
        this.loaderService.display(false);
      }
      else {
        this.leadService.createPromoCode(value).subscribe(
          res => {
            this.loaderService.display(false);
            this.promoPackagesForm.reset();
            let x = this.promoPackagesForm.get('promo_category_offers_attributes') as FormArray 
            (<FormArray>x).controls = [];
            (<FormArray>x).push(this.createOfferings())
            this.image = null;
            this.validPromo = '';
            $('#promoCodeModal').modal('hide');
            this.successMessageShow('Promo Code Created Successfully!');
            this.getPromoPackages(1, '', 'active');
          },
          err => {
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessageShow(JSON.parse(err['_body']).message);
            this.errorMessageShow(JSON.parse(err['_body']).message.code);
            this.errorMessageShow(JSON.parse(err['_body']).message.promo_discount_percent[0]);
            this.errorMessageShow(JSON.parse(err['_body']).message.threshold[0]);
            this.validPromo = JSON.parse(err['_body']).message.code
          }
        );
        console.log(value);
        // console.log(value.term_condition.split('\n').filter(Boolean));
      }
  }
  // update(value) {
  //   this.loaderService.display(true);
  //   if(value.promo_value || value.promo_discount_percent){
  //     if (value.promo_code.indexOf(" ") > -1) {
  //       this.validPromo = "Enter Valid Promo Code (Space not allowed)";
  //       this.loaderService.display(false);
  //     }
  //     else {
  //       this.leadService.updatePromoCode(value, this.edited_promo_code, this.image).subscribe(
  //         res => {
  //           this.loaderService.display(false);
  //           this.promoPackagesForm.reset();
  //           this.image = null;
  //           this.validPromo = '';
  //           $('#promoCodeModal').modal('hide');
  //           this.successMessageShow('Promo Code Updated Successfully!');
  //           this.getPromoPackages(1, '', 'active');
  //         },
  //         err => {
  //           this.loaderService.display(false);
  //           this.erroralert = true;
  //           this.errorMessage = JSON.parse(err['_body']).promo_discount_percent[0];
  //           this.errorMessage = JSON.parse(err['_body']).base[0];
  //           this.errorMessageShow(JSON.parse(err['_body']).message);
  //           this.errorMessageShow(JSON.parse(err['_body']).expiry_date);
  //           this.validPromo = JSON.parse(err['_body']).message.code;
  //         }
  //       );
  //     }
  //   } else{
  //     this.erroralert = true;
  //     this.errorMessage = "Enter Promo Value Or Promo Discount Percent";
  //     this.loaderService.display(false);
  //   }
  // }


  latestupdatee(value){    
    // console.log(this.removeofferindex);
    // if(this.removeofferindex){
    //   value.promo_category_offers_attributes[this.removeofferindex]['_destroy'] = true
    // }
    for(var i=0 ; i<this.storeallindexToremoveoffer.length ; i++){
      value.promo_category_offers_attributes[ this.storeallindexToremoveoffer[i]]['_destroy'] = true
    }
    this.loaderService.display(true)
    if (value.promo_code.indexOf(" ") > -1) {
      this.validPromo = "Enter Valid Promo Code (Space not allowed)";
      this.loaderService.display(false);
    }else {
      this.leadService.updatePromoCode(value,this.edited_promo_code).subscribe(
        res => {
          this.loaderService.display(false)
          this.promoPackagesForm.reset();
          let x = this.promoPackagesForm.get('promo_category_offers_attributes') as FormArray 
          (<FormArray>x).controls = [];
          (<FormArray>x).push(this.createOfferings())
          this.image = null;
          this.validPromo = '';
          this.storeallindexToremoveoffer = []
          $('#promoCodeModal').modal('hide');
          this.successMessageShow('Promo Code Updated Successfully!');
          this.getPromoPackages(1, '', 'active');
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.storeallindexToremoveoffer = []
          this.errorMessage = JSON.parse(err['_body']).promo_discount_percent[0];
          this.errorMessage = JSON.parse(err['_body']).base[0];
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.errorMessageShow(JSON.parse(err['_body']).expiry_date);
          this.validPromo = JSON.parse(err['_body']).message.code;
        }
      ) 
    }
  }



  downloadPromoPackages() {
    this.loaderService.display(true);
    this.leadService.downloadPromoCodes().subscribe(
      res => {
        
        this.loaderService.display(false);
        this.successMessageShow('Promo Code Packages Downloaded Successfully!');
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        var b64Data = res.excel_base_64;
        var blob = this.b64toBlob(b64Data, contentType, 512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", blobUrl);
        dwldLink.setAttribute("download", "promo-package-report.xlsx");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      err => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
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

  changeStatus(id, value) {
    this.loaderService.display(true);
    this.leadService.updatePromoCodeStatus(id, value).subscribe(
      res => {
        this.loaderService.display(false);
        this.successMessageShow('Status Change Successfully');
        this.getPromoPackages(1, '', 'active');
      },
      err => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
  }

  ngOnDestroy() {
    $(function () {
      $('.pop').remove();
    })
  }

  openpopup(event) {
    var thisobj = this;
    $(event.target).popover({
      trigger: 'hover'
    });


    $(function () {
      $('.pop').popover({
        trigger: 'hover'
      })
    })
  }

  searchPromo() {
    let search = $('#serachPromo').val();
    const encodedVal = encodeURI(search)
    this.getPromoPackages(1, encodedVal, 'active');
  }

  getChangeStatus(value) {
    this.getPromoPackages(1, '', value);
  }
  categoryListData :any
  categoryList(){
    this.loaderService.display(true);
    this.leadService.categorylistforpromo().subscribe(
      res => {
        this.loaderService.display(false);
        this.categoryListData = res;
        console.log(this.categoryListData);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  categorySelectionAll_MK : boolean = false
  categorySelectionAll_MK_Both : boolean = false


  categorySelectionAll_MW : boolean = false
  categorySelectionAll_MW_Both : boolean = false



  categorySelectionAll_MTO : boolean = false
  categorySelectionAll_MTO_Both : boolean = false

  AllFurnituare : boolean = false
  AllFurniture_others : boolean = false


  categorySelectedValues :any = []
  categoryvalue :any
  disableForCondition : boolean = false
  disableEdit : boolean = false
  storeEventValue : any
  checkfornull : boolean = false

  setValPro(event, promoform, index){
    this.checkfornull = false
    this.categorySelectedValues = []
    this.categoryvalue = event
    this.storeEventValue = event.target.value
    let arr = promoform.get('promo_category_offers_attributes') as FormArray
    for(var i =0 ; i<arr.controls.length ; i++){
      this.categorySelectedValues.push(arr.controls[i].value.category)
    }
    this.categorySelectedValues = this.categorySelectedValues.filter(Boolean)
    // console.log(this.categorySelectedValues);
    // for mk
    if(this.categorySelectedValues.includes('mk_all') && (event.target.value == 'mk_woodworking' || event.target.value == 'mk_hardware'  )){
      this.categorySelectionAll_MK = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('All Categories In MK Selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.categorySelectionAll_MK = false
      this.disableEdit = false
    }
    if((this.categorySelectedValues.includes('mk_woodworking') || this.categorySelectedValues.includes('mk_hardware'))  && event.target.value == 'mk_all'  ){
      this.categorySelectionAll_MK_Both = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('Either MK woodworking or MK hardware has been selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.categorySelectionAll_MK_Both = false
      this.disableEdit = false
    }
    // mw_all
    if(this.categorySelectedValues.includes('mw_all') && (event.target.value == 'mw_woodworking' || event.target.value == 'mw_hardware'  )){
      this.categorySelectionAll_MW = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('All Categories In MW Selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.categorySelectionAll_MW = false
      this.disableEdit = false
    }

    if((this.categorySelectedValues.includes('mw_woodworking') || this.categorySelectedValues.includes('mw_hardware'))  && event.target.value == 'mw_all'  ){
      this.categorySelectionAll_MW_Both = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('Either MW woodworking or MW hardware has been selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
    }else{
      this.categoryvalue = event
      this.categorySelectionAll_MW_Both = false
      this.disableEdit = false
    }
    // mto
    if(this.categorySelectedValues.includes('mto_all') && (event.target.value == 'mto_wardrobe' || event.target.value == 'mto_system_cabinets' || event.target.value == 'mto_kitchen_hardware'  || event.target.value == 'mto_kitchen_woodworking'   )  ){
      this.categorySelectionAll_MTO = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('All Categories In MTO Selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.categorySelectionAll_MTO = false
      this.disableEdit = false
    }

    if( (this.categorySelectedValues.includes('mto_wardrobe') || this.categorySelectedValues.includes('mto_system_cabinets') || this.categorySelectedValues.includes('mto_kitchen_hardware') || this.categorySelectedValues.includes('mto_kitchen_woodworking')  )  && event.target.value == 'mto_all'  ){
      this.categorySelectionAll_MTO_Both = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow(' MTO Wardrobe , MTO System Cabinets , MTO Kitchen Hardware  , MTO Kitchen Woodworking has been selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.categorySelectionAll_MTO_Both = false
      this.disableEdit = false
    }
    // All furniture
    if( (this.categorySelectedValues.includes('all_furniture')  &&  ( event.target.value == 'mk_woodworking' || event.target.value == 'mk_hardware' ||  event.target.value == 'mw_woodworking' || event.target.value == 'mw_hardware'  ||  event.target.value == 'mto_wardrobe'  || event.target.value == 'mto_system_cabinets'  ||  event.target.value == 'mto_kitchen_woodworking'  || event.target.value == 'mto_kitchen_hardware'  ||event.target.value == 'loose_furniture'  ||event.target.value == 'custom_panel'  ||event.target.value == 'custom_non_panel'  ||event.target.value == 'mw_all'  ||event.target.value == 'mk_all'  ||event.target.value == 'mto_all'    ) ) ){
      this.AllFurnituare = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('All Categories are included in All Furniture except Services and Custom Services');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null 
    }else{
      this.categoryvalue = event
      this.AllFurnituare = false
      this.disableEdit = false
    }
    if( (this.categorySelectedValues.includes('mk_woodworking') || this.categorySelectedValues.includes('mk_hardware') || this.categorySelectedValues.includes('mw_woodworking') || this.categorySelectedValues.includes('mw_hardware') || this.categorySelectedValues.includes('mto_wardrobe') || this.categorySelectedValues.includes('mto_system_cabinets') || this.categorySelectedValues.includes('mto_kitchen_woodworking') || this.categorySelectedValues.includes('mto_kitchen_hardware') || this.categorySelectedValues.includes('loose_furniture') || this.categorySelectedValues.includes('custom_panel') || this.categorySelectedValues.includes('custom_non_panel') || this.categorySelectedValues.includes('mw_all') || this.categorySelectedValues.includes('mto_all')) && event.target.value == 'all_furniture') {
      this.AllFurniture_others = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('All Categories are included in All Furniture except Services and Custom Services');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      arr.controls[index].value.category = null 
    }else{
      this.categoryvalue = event
      this.AllFurniture_others = false
      this.disableEdit = false
    }
    // for unique
    if((new Set(this.categorySelectedValues)).size !== this.categorySelectedValues.length   ){
      this.disableForCondition = true
      this.disableEdit = true
      this.erroralert = true;
      this.errorMessageShow('The Category is already selected');
      (<HTMLInputElement>document.getElementById(`uniqueselect${index}`)).value = ''
      let arr = this.promoPackagesForm.get ('promo_category_offers_attributes') as FormArray;
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.disableForCondition = false
      this.disableEdit = false
    }
    console.log(this.promoPackagesForm);
  }
  removeCategoryItem(index){
    let inn = index
    this.categorySelectedValues.splice(inn , 1)
    let arr = this.promoPackagesForm.get ('promo_category_offers_attributes') as FormArray
    if(  arr.length  < this.categoryListData.length  ){
      this.showAddButton = true
    }else {
      this.showAddButton = false
    }
    console.log(arr);
    if((new Set(this.categorySelectedValues)).size !== this.categorySelectedValues.length   ){
      this.disableForCondition = true
      this.disableEdit = true;
      let arr = this.promoPackagesForm.get ('promo_category_offers_attributes') as FormArray;
      arr.controls[index].value.category = null
    }else{
      this.categoryvalue = event
      this.disableForCondition = false
      this.disableEdit = false
    }

    for(var i =0 ; i<arr.value.length ; i++){
      if(arr.value[i].category === null){
        this.checkfornull = true
      }
    }

    // mk_all
    if(this.categorySelectedValues.includes('mk_all') && ( this.storeEventValue== 'mk_woodworking' || this.storeEventValue == 'mk_hardware'  )){
      this.categorySelectionAll_MK = false;
    }else{
      this.categorySelectionAll_MK = false
      this.disableEdit = false
    }
    if((this.categorySelectedValues.includes('mk_woodworking') || this.categorySelectedValues.includes('mk_hardware'))  && this.storeEventValue == 'mk_all'  ){
      this.categorySelectionAll_MK_Both = false;
    }else{
      this.categorySelectionAll_MK_Both = false
      this.disableEdit = false
    }

    // mw_all
    if(this.categorySelectedValues.includes('mw_all') && (this.storeEventValue == 'mw_woodworking' || this.storeEventValue == 'mw_hardware'  )){
      this.categorySelectionAll_MW = false;
    }else{
      this.categorySelectionAll_MW = false
      this.disableEdit = false
    }
    if((this.categorySelectedValues.includes('mw_woodworking') || this.categorySelectedValues.includes('mw_hardware'))  && this.storeEventValue == 'mw_all'  ){
      this.categorySelectionAll_MW_Both = false;
    }else{
      this.categorySelectionAll_MW_Both = false
      this.disableEdit = false
    }

    // mto 
    if(this.categorySelectedValues.includes('mto_all') && (this.storeEventValue == 'mto_wardrobe' || this.storeEventValue == 'mto_system_cabinets' || this.storeEventValue == 'mto_kitchen_hardware'  || this.storeEventValue == 'mto_kitchen_woodworking'   )  ){
      this.categorySelectionAll_MTO = false;
    }else{
      this.categorySelectionAll_MTO = false
      this.disableEdit = false
    }
    if( (this.categorySelectedValues.includes('mto_wardrobe') || this.categorySelectedValues.includes('mto_system_cabinets') || this.categorySelectedValues.includes('mto_kitchen_hardware') || this.categorySelectedValues.includes('mto_kitchen_woodworking')  )  && this.storeEventValue == 'mto_all'  ){
      this.categorySelectionAll_MTO_Both = false;
    }else{
      this.categorySelectionAll_MTO_Both = false
      this.disableEdit = false
    }

    // All furniture
    if( (this.categorySelectedValues.includes('all_furniture')  &&  ( this.storeEventValue == 'mk_woodworking' || this.storeEventValue == 'mk_hardware' ||  this.storeEventValue == 'mw_woodworking' || this.storeEventValue == 'mw_hardware'  ||  this.storeEventValue == 'mto_wardrobe'  || this.storeEventValue == 'mto_system_cabinets'  ||  this.storeEventValue == 'mto_kitchen_woodworking'  || this.storeEventValue == 'mto_kitchen_hardware'  ||this.storeEventValue == 'loose_furniture'  ||this.storeEventValue == 'custom_panel'  ||this.storeEventValue == 'custom_non_panel'  ||this.storeEventValue == 'mw_all'  ||this.storeEventValue == 'mk_all'  ||this.storeEventValue == 'mto_all'    ) ) ){
      this.AllFurnituare = false
    }else{
      this.AllFurnituare = false
      this.disableEdit = false
    }


    if( (this.categorySelectedValues.includes('mk_woodworking') || this.categorySelectedValues.includes('mk_hardware') || this.categorySelectedValues.includes('mw_woodworking') || this.categorySelectedValues.includes('mw_hardware') || this.categorySelectedValues.includes('mto_wardrobe') || this.categorySelectedValues.includes('mto_system_cabinets') || this.categorySelectedValues.includes('mto_kitchen_woodworking') || this.categorySelectedValues.includes('mto_kitchen_hardware') || this.categorySelectedValues.includes('loose_furniture') || this.categorySelectedValues.includes('custom_panel') || this.categorySelectedValues.includes('custom_non_panel') || this.categorySelectedValues.includes('mw_all') || this.categorySelectedValues.includes('mto_all')) && this.storeEventValue == 'all_furniture') {
      this.AllFurniture_others = false
     
    }else{
      this.AllFurniture_others = false
      this.disableEdit = false
    }
  }

  storeallindexToremoveoffer :any = []
  removeoffers(i:any) {
    console.log(i)
    let arr = this.promoPackagesForm.get ('promo_category_offers_attributes') as FormArray;
    let id = arr.controls[i]['controls'].id
    if(id){
     this.storeallindexToremoveoffer.push(i)

    }else{
    arr.removeAt(i)
    }
    console.log(this.storeallindexToremoveoffer , 'add');
  }

  clicktounselect(id){
    let index ;
    index = this.storeallindexToremoveoffer.indexOf(id);
    this.storeallindexToremoveoffer.splice(index,1);
    console.log(this.storeallindexToremoveoffer , 'remove');
  }

  closeResetModalEdit(){

    this.checkfornull = false
    this.categorySelectionAll_MK  = false
    this.categorySelectionAll_MK_Both  = false
  
    this.categorySelectionAll_MW  = false
    this.categorySelectionAll_MW_Both  = false

    this.categorySelectionAll_MTO  = false
    this.categorySelectionAll_MTO_Both  = false
  
    this.AllFurnituare  = false
    this.AllFurniture_others  = false
    this.disableForCondition = false

    this.promoPackagesForm.reset()
    // console.log(this.promoPackagesForm.get('promo_category_offers_attributes'));
    let x = this.promoPackagesForm.get('promo_category_offers_attributes') as FormArray 
    (<FormArray>x).controls = [];
    (<FormArray>x).push(this.createOfferings())
    // console.log(this.promoPackagesForm);
  }
  valueforfixed :any
  valueforpercentage :any
  disableforfixedpercentagecreate : boolean = false
  disableforfixededit  : boolean = true
  validatorForchecking(){
    let arrayofCon=[]
    var offer_array = this.promoPackagesForm.get('promo_category_offers_attributes') as FormArray
    for(var i = 0; i<offer_array.controls.length;i++){
      if((offer_array.controls[i]['controls']['promo_discount_percent'].value && offer_array.controls[i]['controls']['promo_discount_percent'].value !='' )|| (offer_array.controls[i]['controls']['promo_value'].value && offer_array.controls[i]['controls']['promo_value'].value !='')){
       arrayofCon[i] = true;
      } else{
        arrayofCon[i] = false;
      }
    }
    if(arrayofCon.indexOf(false) == -1){
      return false
    } else{
      return true
    }
  }

  termsandcondition :any
  showTermsAndCondition(data:any){
    this.termsandcondition = data
  }

  copyLink(link){
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.successalert = true;
    this.successMessage = "Link Copied Successfully";
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      5000
    );   
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  catformat(data){
      let dat = data.split("_");
      let date2 = [];
      dat.forEach((el) => {
        if (el == "mto") {
          el = "MTO";
        }
        if (el == "mk") {
          el = "MK";
        }
        if (el == "mw") {
          el = "MW";
        }
        date2.push(el);
      });
      return date2.join(" ");
    }

}