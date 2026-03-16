import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../portfolio.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../../services/loader.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { NgForm } from '@angular/forms';
import { LeadService } from 'app/platform/lead/lead.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, indexOf } from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from 'app/authentication/auth.service';

declare var $:any;
@Component({
  selector: 'app-listportfoliodata',
  templateUrl: './listportfoliodata.component.html',
  styleUrls: ['./listportfoliodata.component.css'],
  providers: [PortfolioService,LeadService]
})
export class ListportfoliodataComponent implements OnInit {
  @ViewChild('editPortfolioForm') editPortfolioForm: NgForm;

	portfolio: any=[];
  public spaces = [];
  public segments = ['Home','Office'];
  public themes = [];
  public lifestages = [];
  public elements = [];
  private lifestageFlag = false;
  private elementsFlag = false;
  private productUrl = environment.apiBaseUrl+'/v1/portfolios';
  options: RequestOptions;
  segment : string;
  theme : string;
  element : string;
  space : string;
  attachment_file : any;
  lifestage : string;
  price_cents: any;
  preset_number: any;
  preset_name :any;
  new_preset: any;
  space_area: any;
  space_shape: any;
  city: any;
  apartment_name: any;
  preset_type: any;
  category:any;
  format: any;
  variant_id: any;
  boq_value: any;
  boq_number: any;
  user_story_title: string;
  portfolio_data: any;
  description: string;
  imgsrc: string;
  secondaryImage: any;
  attachment_File: any;
  attachment_name: string;
  basefile = {};
  basefileSecondary = {};
  submitted = false;
  id :number;
  loader :boolean;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  search = '';
  city_list: any;
  differentShapes :any
  is_featured :any
  submit_isfeatured:any;
  showhideforSpaceFilter: boolean = false;
  plusMoreBoolean : boolean = false
  current_page ;
  design_file:any
  updated_spaceName = [
    {id : 1, name : 'Kitchen'},
    {id : 2, name : 'Living'},
    {id : 3, name : 'Kids Room'},
    {id : 4, name : 'Master Bedroom'},
    {id : 5, name : 'Guest Bedroom'},
    {id : 6, name : 'Dining Room'},
    {id : 7, name : 'Bedroom'},
  ];
  updated_segmentName = [
    {id : 1, name : 'Home'},
    {id : 2, name : 'Office'},
  ];
  updated_priceName = [
    {
      name: "Under 2 Lakh", paramvalue : '2', id: 'p1'
    },
    { name: "2 - 4 Lakh", paramvalue : '2-4', id: 'p2'},
    { name: "4 - 6 Lakh", paramvalue : '4-6', id : 'p3' },
    { name: "6 - 8 Lakh", paramvalue : '6-8', id: 'p4'},
    { name: "8 - 10 Lakh", paramvalue : '8-10' , id: 'p5'},
    { name: "> 10 Lakh", paramvalue : '10' , id: 'p5'}
  ];
  updated_stateName = [
    {id : 1, name : 'Active', value:'true'},
    {id : 2, name : 'Inactive', value: 'false'},
  ];
  filterValue: boolean = false;
  createPortfolioForm
  constructor(
  	private router: Router,
    private portfolioService:PortfolioService,
    private loaderService : LoaderService,
    private leadService:LeadService,
    private formBuilder: FormBuilder,
    private http: Http,
    private authService : AuthService,
  ) { 
    this.options = this.authService.getHeaders();
  
  }
  role
  ngOnInit() {
    this.getpage("");
    this.getBOQvalues('');
    this.getCities();
    this.role = localStorage.getItem('user');
    if(this.current_page == undefined){
      this.current_page =1;
    }
    this.differentShapes = [
      {value : 'rectangle' , name: 'Rectangle'},
      {value : 'square' , name: 'Square'},
      {value : 'l_shaped' , name: 'L Shaped'},
      {value : 'round' , name: 'Round'},
      {value : 'open' , name: 'Open'}
    ]
   
    this.CreatePortfolioForm()
    this.getLifeSatgeData();
  }
  buildItem(val: string) {
    return new FormGroup({
      
    })
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
      4000
    );
  }
  CreatePortfolioForm(){
    this.createPortfolioForm = this.formBuilder.group({
      segment: new FormControl("", Validators.required),
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
      contents: new FormControl(""),
      lifestage: new FormControl("", Validators.required),
      element: new FormControl(""),
      space_items:new FormControl([]),
      is_featured :  new FormControl('false'),
      design_file : new FormControl(''),
      apartment_name :new FormControl('')
    })
  }
  ngAfterViewInit() {
        $('[data-toggle="tooltip"]').tooltip();
  }

  
  setNgSelectValue(value: any) {
    this.editPortfolioForm.controls['boq_number'].setValue(value);
  }
  confirmAndDelete(id:number) {
    if (confirm("Are You Sure") == true) {
      this.DeletePortfolio(id);
    }
  }

  private DeletePortfolio(id:number){
    this.loaderService.display(true);
     this.portfolioService.deletePortfolio(id).subscribe(
        portfolio => {
          this.successalert = true;
          this.successMessage = "Portfolio Deleted Successfully !!";
          $(window).scrollTop(0);
          setTimeout(function() {
                this.successalert = false;
            }.bind(this), 2000);
        
          this.loaderService.display(false);
          this.getpage(this.current_page);
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
          $(window).scrollTop(0);
          setTimeout(function() {
                this.erroralert = false;
            }.bind(this), 2000);
           this.loaderService.display(false);
        }
    );
  }

  space_item: any = [];
  finalid: any;
  varientIdimage: any;
  unidImage: any;
  search_word: any  = ' ';
  checkPresetfile :any 
  presetfileName :any ;
  CancelledDesignFile:any
  private getPortfolio(id: number) {
    this.createPortfolio();
    this.canceledattachment = false
    this.cancelTopDownImage = true
    this.CancelledDesignFile = false;
    this.showAndHidePreviewTopDownImage = true;
    this.fileName = 'image 1',
    
    this.filedelete = 'ongetdata'
    this.errormsgpresetfile = ''
    this.checkfileSizeMb = false
    this.checkpresetfileuploda = true
    this.finalid = id;
    this.portfolioService.viewPortfolioData(id).subscribe(
      res => {
         this.PresetDetails = res.portfolio;	
         this.EditOrCreate = 'edit'
         console.log( this.PresetDetails)
        this.segment = res.portfolio.segment;
        this.imgsrc = res.portfolio.attachment_file;
        this.secondaryImage = res.portfolio.contents;
        this.firstDropDownChanged(this.segment);
        this.element = res.portfolio.element;
        this.space = res.portfolio.space;
       
        this.theme = res.portfolio.theme;
        this.lifestage = res.portfolio.lifestage;
        this.price_cents = Math.round(res.portfolio.boq_value / 48);
        console.log(this.price_cents)
        this.preset_number = res.portfolio.preset_id;
        this.preset_name = res.portfolio.preset_name
        this.space_area = res.portfolio.space_area;
        this.space_shape = res.portfolio.space_shape;
        this.is_featured = res.portfolio.featured
        this.checkPresetfile = res.portfolio.design_file
        this.presetfileName = res.portfolio.design_file_file_name;
        this.new_preset=res.portfolio.new_preset;
        if (res.portfolio.apartment.length === 0) {
          this.city = null;
          this.apartment_name = null;
          this.format = null;
          this.variant_id = null;
        }
        else {
          this.city = res.portfolio.apartment[0].city;
          this.apartment_name = res.portfolio.apartment[0].apartment_name;
          this.format = res.portfolio.apartment[0].format;
          this.variant_id = res.portfolio.apartment[0].variant_id;
          this.varientIdimage = res.portfolio.apartment[0].id;
        }
        this.preset_type = res.portfolio.preset_type;
        this.category = res.portfolio.category;
        this.description = res.portfolio.description;
        this.boq_number = res.portfolio.boq_number;
        // this.setNgSelectValue(this.boq_number )
        this.boq_value = res.portfolio.boq_value;
        this.user_story_title = res.portfolio.user_story_title
        this.portfolio_data=res.portfolio.portfolio_data
        // this.portfolio_data = (res.portfolio.portfolio_data != null) ? JSON.stringify(res.portfolio.portfolio_data) : 'NA';
        this.space_item = res.portfolio.space_items;
        // this.attachment_file = res.portfolio.attachment_file;
        this.getLifeSatgeData();
        if(res.portfolio.attachment_file!='/images/original/missing.png'){
          this.imageFeatured = res.portfolio.attachment_file;
          this.Oldfeatured = res.portfolio.attachment_file
        } else{
          this.imageFeatured = ''
          this.Oldfeatured = res.portfolio.attachment_file
        }
       
        this.createPortfolioForm.controls['segment'].setValue( this.segment)
        this.createPortfolioForm.controls['space'].setValue(this.space)
        this.createPortfolioForm.controls['theme'].setValue(this.theme)
        this.createPortfolioForm.controls['lifestage'].setValue( this.lifestage)
        this.createPortfolioForm.controls['space_area'].setValue( this.space_area)
        this.createPortfolioForm.controls['preset_type'].setValue(this.preset_type)
        this.createPortfolioForm.controls['space_shape'].setValue(this.space_shape)
        this.createPortfolioForm.controls['boq_number'].setValue(this.boq_number)
        this.createPortfolioForm.controls['boq_value'].setValue(this.boq_value);
        this.createPortfolioForm.controls['description'].setValue(this.description)
        this.createPortfolioForm.controls['category'].setValue(this.category )
        this.base64Imagesexit = res.portfolio.contents;
        this.societySearch(this.city, '');
        if (res.portfolio.apartment.length > 0){
          let aprname = res.portfolio.apartment[0].apartment_name;
          if (aprname.length > 30) {
            aprname = aprname.slice(0, 30) + '...';
          } else {
             aprname = aprname;
          }
        this.SelectedApartment = res.portfolio.apartment[0];
       
          this.createPortfolioForm.controls['apartment_select'].setValue(res.portfolio.apartment[0].apartment_name)
          this.createPortfolioForm.controls['apartments'].setValue(res.portfolio.apartment[0].id)
          this.createPortfolioForm.controls['city_select'].setValue(res.portfolio.apartment[0].city)
        this.createPortfolioForm.controls['apartment_name'].setValue(aprname+','+res.portfolio.apartment[0].city)
        this.createPortfolioForm.controls['flat_type'].setValue(res.portfolio.apartment[0].format)
        this.SelectedApartment['id'] = res.portfolio.apartment[0].apartment_id	;
        this.spaceDropDownChanged(this.space);

        console.log( this.SelectedApartment)
        this.getVarient(res.portfolio.apartment[0].format)
        
        }
        if(res.portfolio.apartment[0] && res.portfolio.apartment[0].id ){
          this.isSelected = true;
        }
       
        for (let i = 0; i < this.space_item.length; i++) {
          this.selected_space_item.push(
            this.space_item[i].id
          )
        } 
      
    
     
      
      console.log(this.createPortfolioForm.controls['apartments'].value)
     
       
      
        // this.getLifeSatgeData();
       
      
     
     
        this.getSpaceItems(this.space);
        this.SpaceValue = this.space;
      
      },
      error => {
          
      }

    );

    this.getBOQvalues(this.boq_number);
  }
  /*-- edit portfolio methods -- */
  base64Imagesexit =[]
  firstDropDownChanged(val: any) {
    if (val == "Home") {
      this.space ='';
      this.spaces = ["Kitchen", "Living", "Kids Room","Master Bedroom","Guest Bedroom","Dining Room"];
      this.themes = [
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
      this.elements = ['Master Bedroom','Kids Room', 'Wardrobe'];
      // this.lifestages = ['Bachelor','Working Couple','Large Families','Old Age'];
    }
    else if (val == "Office") {
      this.space ='';
      this.spaces = ["Conference", "Reception", "Workstations"];
      this.themes = ['Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Other'];
     
      this.elements = [];
    }
    else {
      this.spaces = [];
      this.themes = [];
      this.elements = [];
     
    }
  }
SpaceValue
  spaceDropDownChanged(val: any) {
    console.log('done')
    this.SpaceValue = val
    this.getBOQvalues('')
    if (val == 'Kitchen'){
      // this.lifestages = ['Bachelor','Working Couple','Large Families','Old Age'];
      this.themes = [
        "Minimalist",
        "Transitional",
        "Contemporary",
        "Modern",
        "Rustic Industrial",
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
      this.element='';
      this.theme = "";
      this.lifestageFlag = true;
      this.elementsFlag = false;
    }
    else if (val == 'Bedroom') {
      // this.lifestage='';
      this.elements = ['Master Bedroom','Kids Room', 'Wardrobe'];
      this.lifestageFlag = false;
      this.elementsFlag = true;
      this.theme = "";
    }
    else if(val == 'Living'){
      // this.lifestage='';
      this.theme = "";
      this.themes = [
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
      this.element='';
      this.lifestageFlag = false;
      this.elementsFlag = false;
    } 
    else if(val == 'Kids Room'){
      // this.lifestage='';
      this.theme = "";
      this.themes = [
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
      this.element='';
      this.lifestageFlag = false;
      this.elementsFlag = false;
    }
    else {
      // this.lifestage ='';
      this.element ='';
    }
    this.getSpaceItems(val);
   
    this.selected_space_item = [];
    this.space_item = []

    if(this.boq_number){
     this.checkavailability(this.boq_number)
    }
  }

  themeDropDownChanged(val:any,i:number){
    if(val=='Lifestage Kitchen') {
      this.lifestageFlag[i] = true;
    } else {
      this.lifestageFlag[i] = false;
    }
  }
  searchstring:any;
  totalpage:any;
  total_page:any;
  pagination:any;
  perpage:any =10;
  getPageNumber(event){
    this.current_page = event;
    this.pagination = event;
    // this.getpage()
   
  }
  getpage(event: any){
    this.current_page = event;
    if(this.current_page == undefined){
      this.current_page = 1;
    }
   
    if(this.searchstring == undefined){
      this.searchstring = '';
    }
    if(this.ValueUpdate == undefined){
      this.ValueUpdate = ''
    }
    if(this.finalid == undefined){
      this.finalid = ''
    }
    if(this.updatedStateArray == undefined){
      this.updatedStateArray = ''
    }
    this.loaderService.display(true);
    this.portfolioService.getPortfolioListof(this.searchstring,this.current_page,this.perpage,this.updatedPriceArray,this.updatedSegmentArray,this.updatedStateArray,this.updatedSpaceArray).subscribe(res=>{
      let portfolio = JSON.parse(res._body);
      this.total_page = portfolio.count;
      this.current_page = portfolio.page_number
       this.portfolio = portfolio.portfolios ;
       this.loaderService.display(false);
       
    },
    err=>{
      this.loaderService.display(false);
    })
  }
  ValueUpdate :any
  updateStatus(event,id){
    console.log(event);
    console.log(event.target.checked);
    if(event.target.checked){
      this.ValueUpdate = true
    }else {
      this.ValueUpdate = false
    }
    this.finalid = id;
    // this.getpage(this.current_page)
    this.updateStatusSpace(this.ValueUpdate , this.finalid)
  }
  updateStatusSpace(value , id){
    this.loaderService.display(true);
    this.portfolioService.updateStatusActiveInActive(id,value).subscribe(res => {
      this.loaderService.display(false);
      console.log(res);
    },(err) => {
      this.loaderService.display(false)
    })
  }
  
  showAndHidePreviewTopDownImage : boolean = false
  fileName:any;
  onChange(event) {
    this.showAndHidePreviewTopDownImage = false
    this.attachment_File = event.srcElement.files[0];
    this.fileName = event.target.files[0].name
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      this.imgsrc = base64.result;
    };
        fileReader.readAsDataURL(this.attachment_File);
  }
  cancelTopDownImage : any
  canceledattachment=false
  onCancelSingleImages(){
    this.cancelTopDownImage = false
    this.attachment_File = {}
    this.basefile = "";
    this.fileName = "";
    this.imgsrc = ""
    this.canceledattachment=true

  }

  attachment_file_secondary: any;
  attachement_files = [];
  imageNamess = [];
  imageName = [];
  lengthVal:any;
  onChangeSecondary(event) {
    this.lengthVal = this.secondaryImage.length + this.imageName.length
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        var base64;
        if(this.lengthVal < 5){
          reader.onload = (fileLoadedEvent) => {
            var image = new Image();
            base64 = fileLoadedEvent.target;
                  
                  this.attachement_files.push(base64.result); 
          }
        }
        reader.readAsDataURL(event.target.files[i]);
        if(this.lengthVal < 5){
          this.imageName.push({"name":event.target.files[i].name, "size":Number(event.target.files[i].size/1024000).toFixed(2)});
        }else{
          alert('Max 5 Images can be Uploaded');
        }
        // this.imageNamess.push(event.target.files[i].name);
      }

  }
   
  }

  onMultiCancelImg(i) {
    this.attachement_files.splice(i,1);
    this.imageName.splice(i,1);
  }

  finalVarient: any = [];
  PresetDetails
  isBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(str);
  }
   isS3Link(str) {
    
    return str.includes("s3.amazonaws.com");
  }
  onSubmit(data) {
  
    if(this.submit_isfeatured=== undefined){
      this.submit_isfeatured = this.is_featured
    }

    console.log(data,this.createPortfolioForm.controls,this.base64Images,this.base64Imagesexit,this.imageFeatured)

    
    let  presetfileupload ,nameofpreset

    if(this.filedelete == 'deletefile' && this.convertpresetfile === undefined){
      presetfileupload = ''
    }else{
      presetfileupload = this.convertpresetfile
      nameofpreset = this.namepresetfile
    }
    data.design_file = this.convertpresetfile;
   $('#exampleModalLong').modal('hide');
  
  
       this.loaderService.display(true);

    this.imgsrc=''
    data.attachment_file = this.imageFeatured;
    data.attachment_file_secondary = this.base64Images;
    data.design_file = this.convertpresetfile;
    if (this.xyz.length === 0) {
      this.finalVarient = this.varientIdimage;
    }
    else if (this.xyz.length === undefined) {
      this.finalVarient = this.xyz;
    }
  

    let type;
    if(data.attachment_file.startsWith('data:image')){
      type = 'base_64';
    } else{
      type = 's3';
    }

 
        let obj = {
      'canceledattachment':{
        'attachment_file' : this.canceledattachment,
        'design_file' :  this.CancelledDesignFile
      },
      
      portfolio: {
        'segment': data.segment,
        'theme': data.theme,
        'element': (data.segment == 'Home' && data.space == 'Bedroom') ? data.element : '',
        'space': data.space,
        'lifestage': data.lifestage,
        'price_cents': this.price_cents?this.price_cents:'',
        'preset_type' :data.preset_type,
        'category':data.category.replace("oc_", ""),
        'space_area': parseInt(data.space_area),
        'space_shape': data.space_shape,
        'contents': data.attachment_file_secondary,
        'apartments': [this.finalVarient],
        'boq_value': parseInt(this.boq_value),
        'boq_number': data.boq_number,
        'description': data.description,
        'user_story_title' : data.user_story_title,
        'is_featured' : this.submit_isfeatured,
        'design_file' : presetfileupload,
        'design_file_file_name' : nameofpreset,
        'portfolio_data' : (data.portfolio_data!="" && data.portfolio_data!=null && 
           data.portfolio_data != undefined && data.portfolio_data != "NA") ? (data.portfolio_data) : '',
        'space_items': this.selected_space_item.length > 0 ? this.selected_space_item : this.space_item
       },
       'attachment_file':
       {
        'image': this.isBase64(data.attachment_file)||this.isS3Link(data.attachment_file)?data.attachment_file:undefined,
        'type':this.isBase64(data.attachment_file)||this.isS3Link(data.attachment_file)?type:undefined
       },
       'external_apartment_id':this.SelectedApartment && this.SelectedApartment['id']?this.SelectedApartment['id']:''
     }
    this.submitted = true;
    console.log(data,this.createPortfolioForm.controls,this.base64Images,this.base64Imagesexit,this.imageFeatured,'722',this.isS3Link(data.attachment_file))
    this.portfolioService.editPortfolio(this.finalid,obj)
    .subscribe(
        res => {
         this.loaderService.display(false);
         this.PresetDetails = res.portfolio
         this.successalert = true;
         this.basefile = undefined;
         this.convertpresetfile = undefined
        this.successMessage = "Portfolio Updated Successfully !!";
        this.imageNamess = [];
        $('#CreateportfolioModal').modal('hide');
        if(this.new_preset){
          $('#presetdetail').modal('show');
         }
        this.attachement_files = [];
         setTimeout(function() {
               this.successalert = false;
           }.bind(this), 2000);
         //$.notify('Updated Successfully!');

         this.getpage(this.current_page);
        },
        error => {
           this.loaderService.display(false);
           this.erroralert = true;
           this.errorMessage = JSON.parse(error['_body']).message;
           setTimeout(function() {
                 this.erroralert = false;
             }.bind(this), 2000);
          //$.notify(JSON.parse(error['_body']).message);
        }
    );
    
  }
  tooltipHide(){
    $('.add').tooltip('hide')
  }

  onItemChange(e){
    console.log(e)
    this.submit_isfeatured = e
  }


  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }

  selected_space_item: any = [];
  isAllSelected(e, i) {
    if (e.target.checked) {
      this.selected_space_item.push(parseInt(e.target.value))
    }
    else {
      const index =  this.selected_space_item.indexOf(parseInt(e.target.value));
      if (index > -1) {
        this.selected_space_item.splice(index, 1);
      }
    }
    
  }

  lifeStage: any;
  getLifeSatgeData() {
    this.portfolioService.getLifeStage().subscribe(
      res=>{
        this.lifestages = res;
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  other_space_item:any = []
  getSpaceItems(val) {
    this.portfolioService.getOther(val).subscribe(
      res=>{
        this.other_space_item = [];
        // this.other_space_item = res.data;
        for (let i = 0; i < res.data.length; i++){
          
          const a = this.selected_space_item.indexOf(parseInt(res.data[i].attributes.id));
          if (a == -1) {
            this.other_space_item.push(res.data[i].attributes)
          }
        }
        
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  selectLifeStage(val){
    this.lifestage = val;
    
  }

  // boq_reference_number_value: any;
  boq_dropdown: any;
  getBOQvalues(event: any) {
    this.boq_number = event;
    if (this.boq_number === undefined) {
      this.boq_number = ''
    }
    console.log(this.SpaceValue)
    if(this.SpaceValue || this.SpaceValue =='' ){
      this.loaderService.display(true)
      this.portfolioService.getBoqValues(this.boq_number,this.SpaceValue,this.SelectedApartment && this.SelectedApartment.id?this.SelectedApartment.id:'').subscribe(
        res => {
          this.boq_dropdown = res.data;
          this.loaderService.display(false)
          
        },
        err=>{
          this.loaderService.display(false)
          this.errorMessageShow(JSON.parse(err['_body']).message)   ;     
          
          
        }
      )
    }
  
  }

  searchBOQ(event: any) {
    let searchWord = event.target.value;
    this.getBOQvalues(searchWord);
  }
  BOQAmount: any;
spacematched:any=false
  getsBOQnumber(event: any) {
    if(event){
      this.boq_number = event;
      let obj = this.boq_dropdown.find( (elem:any) => elem.reference_number ===  this.boq_number);
      let cat = obj.boq_oc_category.toLowerCase();
      this.createPortfolioForm.controls['category'].setValue(cat?cat:'')
      this.boq_value = obj.total_amount;
      this.price_cents =  this.boq_value/48;
     
      console.log( this.price_cents, this.boq_value)
    }else{
      this.boq_value = null
      this.boq_number = null;
      this.price_cents =''
    }
   
   
  }


checkavailability(boqnumber:any){
  console.log(boqnumber, this.boq_number)
  let obj = this.boq_dropdown.find( (elem:any) => elem.reference_number ===  this.boq_number);
  console.log(obj)
      let availablespaces=[...obj.spaces,...obj.spaces_custom,...obj.spaces_custom_furniture,...obj.spaces_kitchen,...obj.spaces_loose,...obj.spaces_services]
      this.spacematched=availablespaces.indexOf(this.space) < 0;
      if(this.space=="Guest Bedroom"){
        this.spacematched=(availablespaces.indexOf("Guest Room") < 0)
      }
      if(this.space=='Dining Room'){
        this.spacematched=availablespaces.indexOf('Dining Area') < 0;
      }
}

  getCities() {
    this.portfolioService.getCities().subscribe(res => {
      this.city_list = res.cities;
      
      
    })
  }
  selectedCity: any;
  getscityList(event: any) {
    this.selectedCity=event;
   this.societySearch(this.selectedCity,this.search);
  }

  searchSociety(event:any) {
    let searchWord = event.target.value;
    this.societySearch(this.selectedCity,searchWord)
  }

  selectedBuilding:any;
  getselectedbuilding(event: any) {
  this.selectedBuilding = event;
  let obj = this.societyList.find( (elem:any) => elem.id ===  this.selectedBuilding);
  // this.buildingName = obj.building_name;
 this.flatsizeType(event) ;
  }
  searchCity(event: any) {
    let searchcity = event.target.value;
  }
  
  flatsize:any;
storesize:any;
  flatsizeType(id: any) {
    this.portfolioService.flatsizetype(id).subscribe(data => {
      this.format = '';
      this.variant_id = '';
     this.storesize= data; 
    this.flatsize = this.storesize.varients;
    // this.getVarientDetaisls();
  })
  } 

  societyList = [];
  societySearch(city_name, search) {
    this.portfolioService.getLocalityBuildingDetails(city_name, search).subscribe(
      res => {
        this.societyList = res.data;
        
        if (this.societyList.length === 0) {
          this.xyz = '';
        }
      },
      err => {
      }
    );
  }
  selectedBuildingtype: any;
  areaType: any;
  getselectedbuildingtypes(event: any) {
    this.selectedBuildingtype = event;
    
    this.getVarientDetaisls();
   let obj = this.flatsize.find( (elem:any) => elem.area ===  this.selectedBuildingtype);
    this.areaType = obj.type;
    this.getVarientDetaisls();
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

  xyz: any = [];
  isAllVarient(e) {
    this.xyz = e;
    
  }

  deleteContent(id: any) {
    console.log(this.secondaryImage.length);
    if(this.secondaryImage.length > 1){
      if(confirm("Are you sure you want to delete the image?") === true){
        this.portfolioService.deletePortfolioContent(id).subscribe(portfolio => {
          this.successalert = true;
          this.successMessage = "Image Deleted Successfully !!";
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
          this.getPortfolio(this.finalid);
          this.CreateStage = 'three'
        }); 
        }
    }else {
      alert('Atleast one image is required')
    }
  }



  
  showhideforstateFilter : boolean = false
  showhideforpriceFilter : boolean = false
  showhideforsegmentFilter : boolean = false
  showHideForFilters(type :any){
    if(type == 'space'){
      this.showhideforSpaceFilter = !this.showhideforSpaceFilter
    }else if(type == 'state'){
      this.showhideforstateFilter = !this.showhideforstateFilter
    }else if(type == 'price'){
      this.showhideforpriceFilter = !this.showhideforpriceFilter
    }else if(type == 'segment'){
      this.showhideforsegmentFilter = !this.showhideforsegmentFilter
    }
  }

  plusMoretheme : boolean = false
  plusMore(type :any){
    if(type == 'space'){
      this.plusMoreBoolean = !this.plusMoreBoolean
    }
    if(type == 'theme'){
      this.plusMoretheme = !this.plusMoretheme
    }
  }

  updatedSpaceArray:any = [];
  spaceFilterUpdated(event:any,data: any, id) {
    if(event.target.checked === true){
      this.updatedSpaceArray.push(data)
      
    }else{
      var index = this.updatedSpaceArray.indexOf(data);
      this.updatedSpaceArray.splice(index, 1);
      
    }
  }
  updatedStateArray: any

  // areaRangeUpdated(event:any,param: any) {
  //   this.updatedAreaRangeArray = event.target.value
  //   this.optimizationfunctionforpresetfilters()

  // }

  stateFilterUpdated(event:any,data: any, id:any, value:any) {
    // if(event.target.checked === true){
    //   this.updatedStateArray.push(value)
      
    // }else{
    //   var index = this.updatedStateArray.indexOf(value);
    //   this.updatedStateArray.splice(index, 1);
      
    // }
    this.updatedStateArray = value
  }

  updatedSegmentArray: any =[];
  segmentFilterUpdated(event:any,data: any, id) {
    if(event.target.checked === true){
      this.updatedSegmentArray.push(data)
      
    }else{
      var index = this.updatedSegmentArray.indexOf(data);
      this.updatedSegmentArray.splice(index, 1);
      
    }
  }

  updatedPriceArray: any =[];
  priceFilterUpdated(event:any,data: any, id, paramvalue) {
    if(event.target.checked === true){
      this.updatedPriceArray.push(paramvalue)
      
    }else{
      var index = this.updatedPriceArray.indexOf(paramvalue);
      this.updatedPriceArray.splice(index, 1);
      
    }
  }

  removeAllFilter(){
    this.updatedPriceArray = [];
    this.updatedSegmentArray = [];
    this.updatedStateArray = '';
    this.updatedSpaceArray = [];
    this.filterValue = false;
    // document.querySelectorAll('input[type=checkbox]').forEach((ele:any) => ele.checked = false);
    $('.apply_border_bottom_filters input:checkbox').prop('checked', false);
    $('.apply_border_bottom_filters input:radio').prop('checked', false);
    this.loaderService.display(true);
    this.portfolioService.getPortfolioListof(this.searchstring,this.current_page,this.perpage,this.updatedPriceArray,this.updatedSegmentArray,this.updatedStateArray,this.updatedSpaceArray).subscribe(res=>{
      let portfolio = JSON.parse(res._body);
      this.total_page = portfolio.count;
      this.current_page = portfolio.page_number
       this.portfolio = portfolio.portfolios ;
       this.loaderService.display(false);
       
    },
    err=>{
      this.loaderService.display(false);
    })

  }

  validateButton(){
    if( this.theme =='' || this.preset_name == ''){
      return true
    }else{
      return false
    }
  }
  onApplyFilter(){
    if(this.updatedPriceArray.length > 0 || this.updatedSegmentArray.length > 0 || this.updatedSpaceArray.length > 0 || this.updatedPriceArray.length > 0 ){
      this.filterValue = true;
    }else{
      this.filterValue = false;
    }
    this.loaderService.display(true);
    this.portfolioService.getPortfolioListof(this.searchstring,this.current_page,this.perpage,this.updatedPriceArray,this.updatedSegmentArray,this.updatedStateArray,this.updatedSpaceArray).subscribe(res=>{
      let portfolio = JSON.parse(res._body);
      this.total_page = portfolio.count;
      this.current_page = portfolio.page_number
       this.portfolio = portfolio.portfolios ;
       this.loaderService.display(false);
       
    },
    err=>{
      this.loaderService.display(false);
    })
  }

  convertpresetfile :any
  fileuploadforpreset :any
  file_name_preset:any = ''
  errormsgpresetfile :any
  checkpresetfileuploda : boolean = true
  checkfileSizeMb : boolean = false
  namepresetfile :any
  onImagePicked(event) {
    this.design_file = event.srcElement.files[0];

    this.namepresetfile = event.srcElement.files[0].name
    console.log(this.namepresetfile);
    this.presetfileName = event.srcElement.files[0].name

    this.checkpresetfileuploda = false
    console.log(this.design_file.size);
    if(this.design_file.size/1024/1024 >500 ){
      this.errormsgpresetfile = 'File must be less than 500 MB'
      this.checkfileSizeMb = true
    }else{
      this.errormsgpresetfile = ''
      this.checkfileSizeMb = false
    }
    this.fileuploadforpreset = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.convertpresetfile = base64.result;
      console.log( this.convertpresetfile)
    };

    fileReader.readAsDataURL(this.design_file);
  }

  onCancelPresetFile(){
    this.convertpresetfile = "";
    this.design_file = {};
    this.namepresetfile = ""
  }
  
  filedelete :any
  deletepresetfile(){
    this.filedelete = 'deletefile'
    this.CancelledDesignFile = true
  }
  onDropdownClose(){
    if(this.boq_number){
      let obj = this.boq_dropdown.find( (elem:any) => elem.reference_number ===  this.boq_number);
      this.boq_value = obj.total_amount;
      this.price_cents =  Math.round(this.boq_value / 48)


    }else{
      this.boq_value = null
      this.boq_number = null;
      this.price_cents =''
    }
  }
  BuheadAccess(id,access){
    if(access == 'business_head'){
      this.loaderService.display(true);
      this.portfolioService.updateBuheadAcess(id).subscribe(res => {
        this.loaderService.display(false);
        this.successalert = true;

       this.successMessage = "Access Updated Successfully !!";
    
        setTimeout(function() {
              this.successalert = false;
          }.bind(this), 2000);
       
        this.getpage(this.current_page);
       
      },(err) => {
        this.loaderService.display(false)
        this.erroralert = true;
        console.log(err)
           this.errorMessage = JSON.parse(err['_body']).message;
           setTimeout(function() {
                 this.erroralert = false;
             }.bind(this), 2000);
      })
    }
   
  }
  openpopup(event) {
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
 
  createPortfolio(){
    
    
      if($('#CreateportfolioModal').hasClass('show') == false){
      $('#CreateportfolioModal').modal('show')
  
    }
    this.space =''
    this.CreateStage = 'one';
    this.CreatePortfolioForm();
    this.base64Images =[];
    this.flatsize =[]
    this.presetfileName ='';
    this.imageFeatured = ''
    this.isFeaturedShow = true
    this.isSelected = false;
    this.varientId = false;
    this.SpaceValue =''
  }
  createPP(){
    this.EditOrCreate = 'create'
  }
  CreateStage:any = 'one';
  filteredOptions
  loading = false
  searchSocietyApi($event) {
    this.othersShow = true;
    this.isApifired = true;
    this.Typeselect = ''
    this.isSelected = false
    let searchWord = $event.target.value;
    this.loading = true
    this.leadService.getSocietyWebapi(searchWord).subscribe(
      res => {
        this.loading =false
        console.log(this.loading)
        this.filteredOptions = res.result
        console.log(this.filteredOptions)
       
       
        
      },
      err => {
        this.filteredOptions = []
        this.loading =false
      }
    );
  }
  SelectedApartment;
  selectOption(address,apicall?){
    this.SelectedApartment = address;
    let apar_id ;
    if(address.configuration.length>0){
      apar_id = address.configuration[0].apartment_id
    } else{
      apar_id =address.id
    }
    this.isSelected = true;
    this.isApifired = false;
    this.othersShow = false;
    this.getBOQvalues('')
    let aprname = address.apartment_name;
    if (aprname.length > 30) {
      aprname = aprname.slice(0, 30) + '...';
    } else {
       aprname = aprname;
    }
   
    this.createPortfolioForm.controls['flat_type'].setValue('');
    this.createPortfolioForm.controls['apartments'].setValue('');
    this.createPortfolioForm.controls['apartment_name'].setValue(aprname +','+address.city)
    this.createPortfolioForm.controls['apartment_select'].setValue(this.SelectedApartment.apartment_name)
    this.createPortfolioForm.controls['city_select'].setValue(this.SelectedApartment.city)

    if(apicall){
      this.getFormatDetails()
    }
    

  }
  isSelected = false;
  Typeselect;
  isApifired = false
  projectName ='';
  DeveloperName;
  pincodePro ='';
  FullAdress;
  citynamePro;
  othersShow = false;
  hideOptions(){
    this.isApifired = false
  }
  showOptions(){
    this.isApifired = true
  }
  stageChange(stage){
    this.CreateStage = stage;
    if(stage == 'FormatCheck'){
    this.getFormatDetails()
    }
  }
  navigateAprtmentpage(){
    $('#CreateportfolioModal').modal('hide');
    const apartmentDataString = JSON.stringify(this.SelectedApartment);
    this.router.navigate(['/apartment-add'], { queryParams: {apartment_data: apartmentDataString} });

  }
  CurrentStage(){
    if(this.CreateStage == 'one' || this.CreateStage == 'error'){
      return 1
    } else{
      if(this.CreateStage == 'two'){
        return 2
      } else{
        return 3
      }
    }
    
  }
  PrevClick(){
    if(this.CreateStage == 'two'){
     this.CreateStage ='one'
    } else{
      this.CreateStage ='two'
    }
  }
  SpaceShow = true
  SpaceActive(){
   this.SpaceShow = !this.SpaceShow
  }
  BOQShow = true;
  BoqActive(){
   this.BOQShow = !this.BOQShow
  }
  selectedFiles =[];
  base64Images = []
  triggerFileInput() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput.click();
  }
  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    


    if (this.selectedFiles) {
      const totalFiles = this.base64Images.length + this.selectedFiles.length;
      if (totalFiles > 10) {
        alert('You can upload  maximum of 10 images');
        return;
      }
    }
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      this.convertToBase64(file);
     
    }

    
   
   
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64Images.push(e.target.result);
    };
    reader.readAsDataURL(file);
   
   
  }
  CheckDis(){
    if(this.imageFeatured == ''){
      return true
    } else{
      return false
    }
  }
  imageFeatured =''
  SetFeaturedImage(img){
this.imageFeatured = img;
if(this.Oldfeatured != this.imageFeatured){
 
}


  }
  Removeimage(img,i){
    let index = this.base64Images.indexOf(img)
    this.base64Images.splice(index,1) 
  }
  EditOrCreate = ''
  getFormatDetails(){
    let obj ={
      'apartment_id' : this.SelectedApartment.id
    }
    this.loaderService.display(true)
    this.leadService.getFormatApartment(obj).subscribe(
      res => {
        this.loaderService.display(false)
        if(res.formats.length > 0){
          this.flatsize = res.formats
          this.CreateStage = 'two'
        } else{
          this.CreateStage = 'error'
        }
        
      },
      err => {
        this.errorMessageShow(JSON.parse(err['_body']).message)
        this.loaderService.display(false)
      }
    );
  }
  getVarient(e){
    let obj ={
      'apartment_id' : this.SelectedApartment.id,
      'format':e
    }
    this.loaderService.display(true)
    this.leadService.getFormatVarients(obj).subscribe(
      res => {
        this.varientId = res
        this.loaderService.display(false)
      },
      err => {
        this.errorMessageShow(JSON.parse(err['_body']).message)
        this.loaderService.display(false)
      }
    );

  }
  onSubmitCr() {
   console.log(this.createPortfolioForm.controls)
let data = {
  portfolio :[
    this.createPortfolioForm.value
  ]
}
console.log(data)
    if(this.presetfileName){
      data.portfolio[0]['design_file_file_name'] = this.presetfileName
    }else{
      data.portfolio[0]['design_file_file_name'] = null
    }
    if (data.portfolio[0].boq_value === null) {
      data.portfolio[0].boq_value = this.boq_value;
    }
    else if(data.portfolio[0].boq_value === '') {
      data.portfolio[0].boq_value = this.boq_value;
    }

    
   
    // this.createPortfolioForm.value.portfolio.apartment[this.xyz];
    
    let arr = this.base64Images;
    let prefile = this.convertpresetfile
    this.loaderService.display(true);
    data.portfolio[0].attachment_file = this.imageFeatured;
   
   
    let arr2 = this.base64Images;
    // data.portfolio.forEach(function (value, i) {
      // value.contents = arr2[i];
    // })
    let indexImg =this.base64Images.indexOf(data.portfolio[0].attachment_file) 
    this.base64Images.splice(indexImg,1)
    data.portfolio[0].contents = this.base64Images;
    this.submitted = true;
    data.portfolio[0].price_cents = this.boq_value
data.portfolio[0]['design_file'] = this.convertpresetfile
    console.log(this.convertpresetfile,'kk')
   
    data.portfolio[0].apartments =  [this.NumVar]
   console.log(data.portfolio[0].apartment, this.NumVar)
   data.portfolio[0].category = data.portfolio[0].category.replace("oc_", "");
    this.http.post(this.productUrl, data,
          this.options).map((res: Response) => res.json())
    .subscribe(
        product => {
          product = product;
         this.loaderService.display(false);
         this.successalert = true;
       
         $('#CreateportfolioModal').modal('hide');
         setTimeout(
           function () {
             this.successalert = false;
           }.bind(this),
     
           5000
         );    
         $('#presetdetail').modal('show');

          this.PresetDetails = product.portfolios[0];
          console.log(this.PresetDetails);
         
        
          this.basefile = undefined;
          this.convertpresetfile = undefined
         this.successMessage = "Portfolio Created Successfully !!";
       
           this.BOQAmount = null;
           this.getpage(this.current_page);
        

        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(error['_body']).message;
          this.errorMessageShow(this.errorMessage);
        }
    );
  }
  NumVar:number
  SelectVarient(e){
  this.NumVar = parseInt(e.target.value)
  }
  SetSpaceShape(e){
   
  }
  RemoveimageExist(id){
    if(id == 'featured'){
      this.imageFeatured = ''
      this.isFeaturedShow = false
      this.canceledattachment = true
    } else{
      this.deleteContent(id)
    }
    

  }
  isFeaturedShow:any = true
  Oldfeatured
  editAPR(){
    this.CreateStage = 'one'
  }
  
}
