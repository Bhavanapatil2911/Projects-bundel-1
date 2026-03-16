import { Component, EventEmitter, Input, OnInit, Output, NgZone } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Location } from '@angular/common';
// import { Catalogue } from '../catalogue';
// import { CatalogueService } from '../catalogue.service';
import { Router, Routes, RouterModule , ActivatedRoute} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { LoaderService } from '../../../services/loader.service';
import {PortfolioService} from './portfolio.service'
import { CategoryService } from 'app/platform/category/category/category.service';
import { LeadService } from 'app/platform/lead/lead.service';
declare var $:any;



@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [PortfolioService, CategoryService, LeadService]
})
export class PortfolioComponent implements OnInit {

  private productUrl = environment.apiBaseUrl+'/v1/portfolios';
  options: RequestOptions;
  spacematched:any=false
  private spaces = [];
  private themes = [];
  private lifestage = [];
  private elements = [];
  private themeFlag= [];
  private lifestageFlag = [];
  private elementsFlag = [];
  other_elements: any = [];
  city_list: any;
  search = '';
  areaType: any;
  imagedisable: boolean = false;
  // boq_reference_number_value: any;


  firstDropDownChanged(val: any,i:number) {
    if (val == "Home") {
      this.spaces[i] = ["Kitchen", "Living", "Kids Room", "Master Bedroom", "Guest Bedroom", "Dining Room"];
      this.themes[i] = [
        "All",
        "Minimalist",
        "Transitional",
        "Contemporary",
        "Modern",
        "Rustic Industrial",
        "Indian Ethnic",
        "Dark Knight",
        "Dream Ballet",
        "Modica",
        "Morandi",
        "Urban Elegance",
        "Modern Chic",
        "Golden Murano",
        "Other",
      ];
    }
    else if (val == "Office") {
      this.spaces[i] = ["Conference", "Reception", "Workstations"];
      this.themes[i] = [];
    }
    else {
      this.spaces[i] = [];
      this.themes[i] = [];
    }
  }

  spaceDropDownChanged(val: any, i: number) {
    if (val == 'Kitchen'){
      this.lifestage[i] = ['Bachelor','Working Couple','Large Families','Old Age'];
      this.elements[i] = [];
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = false;
      this.themeFlag[i] = true;
      this.themes[i] = [
        "All",
        "Minimalist",
        "Transitional",
        "Contemporary",
        "Modern",
        "Rustic Industrial",
        "Indian Ethnic",
        "Other",
        "Lifestage Kitchen",
        "Dark Knight",
        "Dream Ballet",
        "Modica",
        "Morandi",
        "Urban Elegance",
        "Modern Chic",
        "Golden Murano",
      ];
      this.createPortfolioForm.value.portfolio[i].element = "";
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
      this.portfolioService.getOther(val).subscribe(
        res=>{
          this.other_elements[i] = res.data;
        },
        err=>{
          this.loaderService.display(false);
        }
      );
    }
    else if (val == 'Kids Room'){
      this.lifestage[i] = ['Bachelor','Working Couple','Large Families','Old Age'];
      this.elements[i] = [];
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = false;
      this.themeFlag[i] = true;
      this.themes[i] = [
        "All",
        "Minimalist",
        "Transitional",
        "Contemporary",
        "Modern",
        "Rustic Industrial",
        "Indian Ethnic",
        "Other",
        "Lifestage Kitchen",
        "Dark Knight",
        "Dream Ballet",
        "Modica",
        "Morandi",
        "Urban Elegance",
        "Modern Chic",
        "Golden Murano",
      ];
      this.createPortfolioForm.value.portfolio[i].element = "";
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
      this.portfolioService.getOther(val).subscribe(
        res=>{
          this.other_elements[i] = res.data;
        },
        err=>{
          this.loaderService.display(false);
        }
      );
    }
    else if (val == 'Bedroom') {
      this.lifestage[i] = [];
      this.themeFlag[i] = true;
      this.elements[i] = ['Master Bedroom','Kids Room', 'Wardrobe'];
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = true;
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
      this.portfolioService.getOther(val).subscribe(
        res=>{
          this.other_elements[i] = res.data;
        },
        err=>{
          this.loaderService.display(false);
        }
      );
    }
    else if (val == 'Master Bedroom'){
      this.themeFlag[i] = true;
    } else if (val == 'Guest Bedroom'){
      this.themeFlag[i] = true;
    } else if (val == 'Dining Room'){
      this.themeFlag[i] = true;
    } else if (val == 'All Spaces'){
      this.themeFlag[i] = true;
    } 
    else if(val == 'Living'){
      this.lifestage[i] = [];
      this.elements[i] = [];
      this.themes[i] = [
        "All",
        "Minimalist",
        "Transitional",
        "Contemporary",
        "Modern",
        "Rustic Industrial",
        "Indian Ethnic",
        "Other",
        "Dark Knight",
        "Dream Ballet",
        "Modica",
        "Morandi",
        "Urban Elegance",
        "Modern Chic",
        "Golden Murano",
      ];
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
      this.createPortfolioForm.value.portfolio[i].element = "";
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = false;
      this.themeFlag[i] = true;
      this.portfolioService.getOther(val).subscribe(
        res=>{
          this.other_elements[i] = res.data;
        },
        err=>{
          this.loaderService.display(false);
        }
      );
    }
    if(this.boq_reference_number_value1){
        this.checkavailability(this.boq_reference_number_value1)
    }
  }

  themeDropDownChanged(val:any,i:number){
    if(val=='Lifestage Kitchen') {
      this.lifestageFlag[i] = true;
    } else {
      this.lifestageFlag[i] = false;
    }
  }

  createPortfolioForm: FormGroup;
  id: Number;
  attachment_file: any;
  attachment_name: string;
  contents: any = [];
  basefile = {};
  basefile2 = {};

  constructor(
    private formBuilder: FormBuilder,
      private http: Http,
    // private productService :ProductService,
    private authService : AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService : LoaderService,
    private zone: NgZone,
    private portfolioService: PortfolioService,
    private categoryService: CategoryService,
    private leadService: LeadService,
    private location: Location

  ) {
    this.options = this.authService.getHeaders();
  }

  submitted = false;
  errorMessage: string;
  successMessage: string;

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //         this.id = +params['id'];
    // });

    this.createPortfolioForm = this.formBuilder.group({
      portfolio: this.formBuilder.array( [this.buildItem('')])
    })
    // this.createPortfolioForm = this.formBuilder.group({
    //   portfolio: this.formBuilder.boq_value: this.BOQAmount
    // })
    this.createPortfolioForm.patchValue({
      boq_value: this.BOQAmount,
    });
    this.getLifeSatgeData();
    // this.getBOQByReference(this.search);
    this.getBOQvalues('');
    this.getCities();

  }

  buildItem(val: string) {
    return new FormGroup({
      segment: new FormControl(val, Validators.required),
      space: new FormControl("", Validators.required),
      theme: new FormControl(""),
      price_cents: new FormControl(""),
      preset_name: new FormControl(""),
      user_story_title: new FormControl(""),
      preset_number: new FormControl(""),
      preset_type: new FormControl(""),
      category:new FormControl("",Validators.required),
      boq_number: new FormControl("",Validators.required),
      boq_value: new FormControl(""),
      space_shape: new FormControl("", Validators.required),
      space_area: new FormControl(""),
      apartment_select: new FormControl("", Validators.required),
      flat_type: new FormControl("",Validators.required),
      apartments: new FormControl([],Validators.required),
      city_select: new FormControl("", Validators.required),
      description: new FormControl(""),
      attachment_file: new FormControl(""),
      contents: new FormControl("",Validators.required),
      lifestage: new FormControl("", Validators.required),
      element: new FormControl(""),
      space_items:new FormControl([]),
      is_featured :  new FormControl('false'),
      design_file : new FormControl('')
    })
  }

  getJobAttributes(createPortfolioForm){
    return createPortfolioForm.get('portfolio').controls
  }

  pushJobAttributes(createPortfolioForm){
    console.log(this.createPortfolioForm.value);
    return createPortfolioForm.get('portfolio').push(this.buildItem(''))
    
  }
  singleImg:any = "";
  attachment_fileSize:any;
  onChange(event, i) {
    this.attachment_file = event.srcElement.files[0];
    this.attachment_fileSize = Number(event.srcElement.files[0].size/1024000).toFixed(2)
    if((this.attachment_file.size/1024) > 120) {
      document.getElementById('errorsize'+i).innerHTML = 'File size should not exceed 120kb.';
    }
    var fileReader = new FileReader();

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
        var image = new Image();
        image.src = fileReader.result;
          base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.singleImg = base64.result
      this.basefile[i] = base64.result
    };
    fileReader.readAsDataURL(this.attachment_file);  
  }

  onCancelSingleImages() {
    this.attachment_file = {};
    this.singleImg = "";
    this.basefile[0] = ''
  }

  images = [];
  imageName = [];
  multipleFiles:any = [];
  onChangeImage(event, i) {
    if (event.target.files && event.target.files[0]) {
      this.multipleFiles = event.target.files
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        var base64;
        if(this.imageName.length < 5){
          reader.onload = (fileLoadedEvent) => {
            var image = new Image();
            image.src = reader.result;
            base64 = fileLoadedEvent.target;
                  
                  this.images.push(base64.result); 
                  console.log("this.images", this.images)
          }
        }
        // this.imageName.push(event.target.files);
        reader.readAsDataURL(event.target.files[i]);
        if(this.imageName.length < 5) {
        this.imageName.push({"name":event.target.files[i].name, "size":Number(event.target.files[i].size/1024000).toFixed(2)});
       }else {
          this.imagedisable = true;
          alert('Max 5 Images can be Uploaded');
        }
      }

  }
  }

  onCancelMaxImages(i) {
    console.log(this.images.length)
    this.imageName.splice(i,1);
    this.images.splice(i,1);
    console.log(this.imageName);
  }

PresetDetails

  onSubmit(data) {

    if(this.file_name_preset){
      data.portfolio[0]['design_file_file_name'] = this.file_name_preset
    }else{
      data.portfolio[0]['design_file_file_name'] = null
    }
    if (data.portfolio[0].boq_value === null) {
      data.portfolio[0].boq_value = this.BOQAmount;
    }
    else if(data.portfolio[0].boq_value === '') {
      data.portfolio[0].boq_value = this.BOQAmount;
    }
    // this.createPortfolioForm.value.portfolio.apartment[this.xyz];
    data.portfolio[0].apartments = [parseInt(this.xyz)];
    let arr = this.basefile;
    let prefile = this.basefilepreset
    this.loaderService.display(true);
    data.portfolio.forEach(function (value, i) {
      value.attachment_file = arr[i];
    });
    data.portfolio.forEach(function (value, i) {
      value.design_file = prefile[i];
    });
    let arr2 = this.images;
    // data.portfolio.forEach(function (value, i) {
      // value.contents = arr2[i];
    // })
    data.portfolio[0].contents = this.images;
    this.submitted = true;
    data.portfolio[0].price_cents = this.BOQAmount

    this.http.post(this.productUrl, data,
          this.options).map((res: Response) => res.json())
    .subscribe(
        product => {
          product = product;
         this.loaderService.display(false);
         this.successalert = true;
       
     
         setTimeout(
           function () {
             this.successalert = false;
           }.bind(this),
     
           5000
         );    
         $('#presetdetail').modal('show');

          this.PresetDetails = product.portfolios;
          console.log(this.PresetDetails);
          const portfolioArray = this.createPortfolioForm.get('portfolio') as FormArray;
          while (portfolioArray.length > 0) {
            portfolioArray .removeAt(0);
          }
          this.images = [];
          this.basefile = undefined;
          this.convertpresetfile = undefined
         this.successMessage = "Portfolio Created Successfully !!";
       
           this.BOQAmount = null;
          this.pushJobAttributes(this.createPortfolioForm)

        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(error['_body']).message;
        }
    );
  }
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }


  lifeStage: any;
  getLifeSatgeData() {
    this.portfolioService.getLifeStage().subscribe(
      res=>{
        this.lifeStage = res;
        
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }


  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }


  isAllSelected(e,i) {
    let a = this.createPortfolioForm.value.portfolio[i].space_items;
    
    if (e.target.checked) {
      a.push(parseInt(e.target.value))
    }
    else {
      const index = a.indexOf(parseInt(e.target.value));
      if (index > -1) {
        a.splice(index, 1);
      }
    }
    this.createPortfolioForm.value.portfolio[i].space_items = a
    
  }

  xyz: any = [];
  isAllVarient(e) {
    this.xyz = e.target.value;
    // this.createPortfolioForm.value.portfolio.apartment = this.xyz;
    
  }

  back() {
    this.router.navigate(['/organisation/portfolio']);
  }

  boq_dropdown: any;
  // search = '';
  boq_reference_number_values: any;
  getBOQvalues(event: any) {
    this.boq_reference_number_values = event;
    if (this.boq_reference_number_values === undefined) {
      this.boq_reference_number_values = ''
    }
    this.portfolioService.getBoqValues(this.boq_reference_number_values,'l',false).subscribe(
      res => {
        this.boq_dropdown = res;
        
      }
    )
  }

  searchBOQ(event: any) {
    let searchWord = event.target.value;
    this.getBOQvalues(searchWord);
  }
  searchCity(event: any) {
    let searchcity = event.target.value;
  }
  
  boq_reference_number_value1: any;
  BOQAmount: any;
  getsBOQnumber(event: any) {
      this.boq_reference_number_value1 = event;
      let obj = this.boq_dropdown.find( (elem:any) => elem.reference_number ===  this.boq_reference_number_value1);
      this.BOQAmount = obj.total_amount;
      this.checkavailability(this.boq_reference_number_value1)
  }


checkavailability(boqnumber:any){
  let obj = this.boq_dropdown.find( (elem:any) => elem.reference_number ===  boqnumber);
      let availablespaces=[...obj.spaces,...obj.spaces_custom,...obj.spaces_custom_furniture,...obj.spaces_kitchen,...obj.spaces_loose,...obj.spaces_services]
      let space=this.createPortfolioForm.value.portfolio[0].space
      this.spacematched=availablespaces.indexOf(space) < 0 ;
      if(space=="Guest Bedroom"){
        this.spacematched=(availablespaces.indexOf("Guest Room") < 0)
      }
      if(space=='Dining Room'){
        this.spacematched=availablespaces.indexOf('Dining Area') < 0;
      }
}

  boqAmount(){
    return   Math.round(this.BOQAmount / 48)
  }
  selectedCity: any;
  getscityList(event: any) {
    this.selectedCity=event;
   this.societySearch(this.selectedCity,this.search);
  }

  getCities() {
    this.portfolioService.getCities().subscribe(res => {
      this.city_list = res.cities;
      
      
    })
  }

  societyList = [];
  societySearch(city_name, search) {
    this.portfolioService.getLocalityBuildingDetails(city_name, search).subscribe(
      res => {
        this.societyList = res.data;
        
      },
      err => {
      }
    );
  }

  closedetailmodal(){
    console.log("hiii")
    this.router.navigate(['/organisation/portfolio']);
    console.log("hiii2")

  }

  searchSociety(event:any) {
    let searchWord = event.target.value;
    this.societySearch(this.selectedCity,searchWord)
  }

  selectedBuildingtype: any;
  getselectedbuildingtypes(event: any) {
    this.selectedBuildingtype = event.target.value;
    
    this.getVarientDetaisls();
   let obj = this.flatsize.find( (elem:any) => elem.area ===  this.selectedBuildingtype);
    this.areaType = obj.type;
    this.getVarientDetaisls();
  }
  
  selectedBuilding:any;
  getselectedbuilding(event: any) {
  this.selectedBuilding = event;
  let obj = this.societyList.find( (elem:any) => elem.id ===  this.selectedBuilding);
  // this.buildingName = obj.building_name;
 this.flatsizeType(event) ;
}
  
  flatsize:any = "";
storesize:any;
  flatsizeType(id: any) {
  this.portfolioService.flatsizetype(id).subscribe(data => {
     this.storesize= data; 
    this.flatsize = this.storesize.varients;
    // this.getVarientDetaisls();
  })
  } 

  varientId: any;
  getVarientDetaisls() {
    if (this.selectedBuildingtype === undefined) {
      this.selectedBuildingtype = ''
    }
    this.portfolioService.getVarientDetails(this.selectedBuilding, this.selectedBuildingtype).subscribe(
      res => {
        
        this.varientId = res;
      }
    )
  }
  
  basefilepreset  = {}
  convertpresetfile :any
  fileuploadforpreset :any
  file_name_preset:any = ''
  errormsgpresetfile:any = ''
  disablebutton : boolean = false
  onImagePicked(event , index) {
    (<HTMLInputElement>document.getElementById(`fileNamePreset${index}`)).value = event.target.files[0].name
    this.file_name_preset = event.target.files[0].name;
    console.log(event.target.files[0]);
    if(event.target.files[0].size/1024/1024 <=500 ){
      this.errormsgpresetfile = ''
      this.disablebutton  = false
    }else{
      this.errormsgpresetfile = 'File must be less than 500 MB'
      this.disablebutton  = true
    }
    console.log(event.target.files[0].size/1024/1024 >500);
    this.fileuploadforpreset = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.convertpresetfile = base64.result;
      console.log(this.basefile);
      this.basefilepreset[index] = base64.result
    };
    fileReader.readAsDataURL(this.fileuploadforpreset); 
  }
  successalert
  
}

