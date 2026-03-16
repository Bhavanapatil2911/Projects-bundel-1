import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Angular2TokenService } from "angular2-token";
// import { AuthService } from '../../authentication/auth.service';

import { CatalogueService } from "../catalogue.service";
import { LoaderService } from "../../../../services/loader.service";
import { IonRangeSliderComponent } from "ng2-ion-range-slider";
declare var $: any;

@Component({
  selector: "app-new-view-catalogue",
  templateUrl: "./new-view-catalogue.component.html",
  styleUrls: ["./new-view-catalogue.component.css"],
  providers: [CatalogueService],
})
export class NewViewCatalogueComponent implements OnInit {
  successalert = false;
  successMessage: string;
  errorMessage: string;
  erroralert = false;

  @ViewChild("priceSliderElement") priceSliderElement: IonRangeSliderComponent;
  @ViewChild("widthSliderElement") widthSliderElement: IonRangeSliderComponent;
  @ViewChild("depthSliderElement") depthSliderElement: IonRangeSliderComponent;
  @ViewChild("heightSliderElement")
  heightSliderElement: IonRangeSliderComponent;
  @ViewChild("leadtimeSliderElement")
  leadtimeSliderElement: IonRangeSliderComponent;

  constructor(
    private tokenService: Angular2TokenService,
    public catalogueService: CatalogueService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  isFilter:any=false
  subcategory_ids: any = [];
  search_string: any = "";
  class_ids: any = [];
  minimum_price: any = "";
  maximum_price: any = "";
  minimum_lead_time: any = "";
  maximum_lead_time: any = "";
  minimum_width: any = "";
  maximum_width: any = "";
  minimum_length: any = "";
  maximum_length: any = "";
  minimum_height: any = "";
  maximum_height: any = "";
  sort_key: any = "popularity";
  liked: any = false;
  role: string;
  userId;
  selected_space;
  url;
  value:any='nova';

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.url = location.origin;
    this.role = localStorage.getItem("user");
 
    this.resetAll();

    this.initialiseState();

    this.getMegamenu();
    this.fetchSliderValues();
   


  }
  isProductDetailsModalOpen = false;
  product_id:any
  async opendetails(id) {
    this.product_id = id;
    console.log("hii");

    try {
      await Promise.all([this.fetchProductDetails(), this.listMasterOptions()]);
      $('#productdetails').modal('show');
    } catch (error) {
      console.error("An error occurred:", error);
    }

    console.log("hello");
  }

  closemodal(){
    $('#productdetails').modal('hide');
  }


  curtainActive: boolean = false;

  curtainActiveHandler() {
    console.log('sss')
    this.curtainActive = true;
    this.router.navigate([], {
      queryParams: {
        subcategory_ids: null,
      },
      queryParamsHandling: "merge",
    });
  }

  segments_array = [];
  segment_headers_res;
  segment_per_page;
  segment_total_page;
  segment_current_page;
  segment_page_number;
  breadcrumb: any;

  filterNewSegments(page?) {
    this.loaderService.display(true);
    this.catalogueService
      .segmentShow(this.catalogue_type, this.catalogue_id, page)
      .subscribe(
        (res) => {
          this.segment_headers_res = res.headers._headers;
          this.segment_per_page = this.segment_headers_res.get("x-per-page");
          this.segment_total_page = this.segment_headers_res.get("x-total");
          this.segment_current_page = this.segment_headers_res.get("x-page");

          res = res.json();

          this.breadcrumb = res.breadcrumb;
          console.log(this.breadcrumb)
          if (this.catalogue_type == "segment") {
            this.segments_array = res.catalog_categories;
          } else if (this.catalogue_type == "category") {
            this.segments_array = res.catalog_subcategories;
          }
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
      console.log(this.breadcrumb)
  }
  sort_key2:any;
  activateSubCategory(catalogue_type, catalogue_id, event) {
    $("#addProductModal").modal("hide");
    console.log(this.catalogue_id)
    this.sort_key2=catalogue_id
    this.curtainActive = false;
    event.stopPropagation();
    this.catalogue_type = catalogue_type;
    this.catalogue_id = catalogue_id;
    this.activateProduct("product");
    this.filterSubCategoryProducts(catalogue_type, catalogue_id);
  }

  filterSubCategoryProducts(catalogue_type, catalogue_id) {
    this.subcategory_ids = [];
    this.subcategory_ids.push(catalogue_id);
    this.initialiseState();
  }

  catalogue_type: any;
  catalogue_id: any;


  activateSegment(catalogue_type, catalogue_id) {
    this.curtainActive = false;
    console.log("hii")
    this.catalogue_type = catalogue_type;
    this.catalogue_id = catalogue_id;
    this.filterNewSegments();
    this.activateProduct("segment");
  }
  all_product_activated: boolean = false;
  all_segment_activated: boolean = false;
  product_detail_activated: boolean = false;

  activateProduct(tab) {
    console.log("hello")
    this.all_product_activated = false;
    this.all_segment_activated = false;
    this.product_detail_activated = false;
    if (tab == "product") {
      this.all_product_activated = true;
    } else if (tab == "segment") {
      console.log("i am ")
      this.all_segment_activated = true;
      $("#addProductModal").modal("show");
      console.log("here")
    }
    else if (tab == "product_details") {
      this.product_detail_activated = true;
    }
  }

  initialiseState() {
    if (this.value == "arrivae") {
      $("#togBtn").prop("checked", true);
      this.filterNewProducts();
    } else {
      $("#togBtn").prop("checked", false);
      this.GetNovaData()
    }
    
  }

  catalog_segments: any = [];
  marketplace: any = [];
  marketplace_submenu_categories: any = {};
  getMegamenu() {
    this.loaderService.display(true);
    this.catalogueService.getMegamenu().subscribe(
      (res) => {
        this.catalog_segments = res.catalog_segments;
        this.marketplace = res.marketplace;

        // trial
        this.marketplace_submenu_categories =
          this.marketplace.length > 0 ? this.marketplace[0].categories : [];
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  getMarketplacecategories(item) {
    this.marketplace_submenu_categories = item.categories;
  }

  products_array = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  page_number;
  calalog_type;
  filterNewProducts(page?) {
    this.curtainActive = false;
    this.page_number = page;
    this.loaderService.display(true);
    this.catalogueService
      .filterNewProducts(
        JSON.stringify(this.subcategory_ids),
        this.search_string,
        this.class_ids,
        this.minimum_price,
        this.maximum_price,
        this.minimum_lead_time,
        this.maximum_lead_time,
        this.minimum_width,
        this.maximum_width,
        this.minimum_length,
        this.maximum_length,
        this.minimum_height,
        this.maximum_height,
        this.sort_key,
        this.liked,
        page
      )
      .subscribe(
        (res) => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");

          res = res.json();


          this.calalog_type = res.catalog_type;
          this.products_array = res.products;
          console.log(this.products_array)
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  slider_value: any;
  all_materials: any;
  all_colors: any;
  all_finishes: any;
  filter_classes: any = [];
  master_minimum_price: any;
  master_maximum_price: any;
  master_minimum_lead_time: any;
  master_maximum_lead_time: any;
  master_minimum_width: any;
  master_maximum_width: any;
  master_minimum_length: any;
  master_maximum_length: any;
  master_minimum_height: any;
  master_maximum_height: any;
  fetchSliderValues() {
    console.log(this.master_maximum_price)
    console.log(this.master_minimum_price)

    this.loaderService.display(true);
    this.catalogueService.fetchSliderValuesNew().subscribe(
      (res) => {
        // this.products_array = res.products
        // this.minimum_price = res.minimum_price
        // this.maximum_price = res.maximum_price
        // this.minimum_lead_time = res.minimum_lead_time
        // this.maximum_lead_time = res.maximum_lead_time
        // this.minimum_width = res.minimum_width
        // this.maximum_width = res.maximum_width
        // this.minimum_length = res.minimum_length
        // this.maximum_length = res.maximum_length
        // this.minimum_height = res.minimum_height
        // this.maximum_height = res.maximum_height

        this.master_minimum_price = 1;
        this.master_maximum_price = res.maximum_price;
        this.master_minimum_lead_time = 1;
        this.master_maximum_lead_time = res.maximum_lead_time;
        this.master_minimum_width = 1;
        this.master_maximum_width = res.maximum_width;
        this.master_minimum_length = 1;
        this.master_maximum_length = res.maximum_length;
        this.master_minimum_height = 1;
        this.master_maximum_height = res.maximum_height;

        this.filter_classes = res.classes;
        this.loaderService.display(false);

        console.log(this.master_maximum_price)
        console.log(this.master_minimum_price)


      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  simpleSlider = {
    name: "Simple Slider",
    onUpdate: undefined,
    onFinish: undefined,
  };
  advancedSlider = {
    name: "Advanced Slider",
    onUpdate: undefined,
    onFinish: undefined,
  };

  updateSlider(type, slider, event) {
    // slider.onUpdate = event;
    if (type == "price") {
      this.minimum_price = event.from;
      this.maximum_price = event.to;
    } else if (type == "lead_time") {
      this.minimum_lead_time = event.from;
      this.maximum_lead_time = event.to;
    } else if (type == "width") {
      this.minimum_width = event.from;
      this.maximum_width = event.to;
    } else if (type == "length") {
      this.minimum_length = event.from;
      this.maximum_length = event.to;
    } else if (type == "height") {
      this.minimum_height = event.from;
      this.maximum_height = event.to;
    }
    this.filterNewProducts();
  }

  updateFilterClass(class_id, event) {
    if (event.target.checked) {
      this.class_ids.push(class_id);
    } else {
      var index = this.class_ids.indexOf(class_id);
      if (index > -1) {
        this.class_ids.splice(index, 1);
      }
    }
    this.isFilter=true
    this.filterNewProducts();
  }

  sortFilter(sort_value) {
    this.sort_key = sort_value;
    let text;
    if (sort_value == "price_low_to_high") {
      text = "Price: Low to High";
    } else if (sort_value == "price_high_to_low") {
      text = "Price: High to Low";
    } else if (sort_value == "newest_first") {
      text = "Newest First";
    } else if (sort_value == "none") {
      text = "None";
      this.sort_key = "none";
    }
    $(".sort-toggle").text(text);
    if(this.value == 'arrivae'){
      this.filterNewProducts();
    } else{
      this.GetNovaData()
    }  
    this.isFilter = true
  }
  product_Id;


  myNum() {
    var x = document.getElementById("mainDiv");
    var y = document.getElementById("Div2");
    var z = document.getElementById("Div3");
    var a = document.getElementById("Div4");
    if (x.style.display === "none") {
      x.style.display = "block";
      y.style.display = "block";
      z.style.display = "block";
      a.style.display = "none";
    } else {
      x.style.display = "none";
    }
  }

  Submenu() {
    document.getElementById("Div2").style.display = "none";
    document.getElementById("Div3").style.display = "none";
    document.getElementById("Div4").style.display = "block";
  }

  //For view Image in modal
  parent_modal;
  zoomImg(elemid, index) {
    $(".zoom-img-modal-lg").modal("show");
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    var str = elemid + index;
    var inputelem = <HTMLImageElement>document.getElementById(str);
    child.src = inputelem.src;
  }
  normalImg() {
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    child.src = "";
    $(".zoom-img-modal-lg").modal("hide");
    if (this.parent_modal) {
      $(this.parent_modal).modal("show");
      this.parent_modal = undefined;
    }
  }

  resetAll() {
    this.subcategory_ids = [];
    this.search_string = "";
    this.class_ids = [];
    this.minimum_price = "";
    this.maximum_price = "";
    this.minimum_lead_time = "";
    this.maximum_lead_time = "";
    this.minimum_width = "";
    this.maximum_width = "";
    this.minimum_length = "";
    this.maximum_length = "";
    this.minimum_height = "";
    this.maximum_height = "";
    this.sort_key = "popularity";
    this.liked = false;
    $(".sort-toggle").text("popularity");
  }

  clearAll() {
    this.isFilter=false
    this.filters = false
    this.resetAll();
    this.fetchSliderValues();

    if(this.value == 'arrivae'){
      this.filterNewProducts();

    } else{
      this.GetNovaData()
    }
  }

  fetchSavedProducts() {
    this.liked =  !this.liked;
    if(this.value =='arrivae'){
      this.filterNewProducts();
    } else{
      this.GetNovaData()
    }
   
  }

  searched_curtain;
  searchTextFilter(event) {
    this.search_string = event.target.value;
    if (this.curtainActive === true) {
      this.searched_curtain = this.search_string;
    }
    else {
      if(this.value =='arrivae'){
        this.filterNewProducts();
      } else{
        this.GetNovaData()
      }    }
  }

  activatedZoomerImg: any = "";
  activateZoomer(img, event) {
    var f = document.querySelector(".zoomer-container");

    this.activatedZoomerImg = img;
    $(".zoomer-container").css("top", event.pageY + f.scrollTop - 150 + "px");
    $(".zoomer-container").css("display", "block");
    // $('.zoomer-container img').attr('src', this.activatedZoomerImg);
  }
  category:any='catalog'
  updatePolka(event) {
    this.filters=false
    this.resetAll()
    this.selected_space = event.target.checked;
    if (event.target.checked == true) {
      this.value = "arrivae";
      this.category="catalog"
    }
    if (event.target.checked == false) {
      this.value = "nova";
      this.category="Nova"

    }
    if(  this.value == "arrivae"){

    this.loaderService.display(true);
    this.catalogueService.catalogType(this.userId, this.value).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = "Successfully switched to " +this.category;
        setTimeout(function() {
        this.successalert = false;
        }.bind(this), 2000);
        this.filterNewProducts();
        this.getMegamenu();
        this.fetchSliderValues();
        this.clearAll();
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
        this.clearAll();
        this.errorMessage = err.message;
      }
    );
  }
  else{
    console.log("hello")

    this.products_array =[]
    this.current_page = 1;
    this.resetAll();
    this.GetNovaData()
  }
  }

  GetNovaData(){
    this.current_page = this.current_page?this.current_page:1
    this.sort_key = this.sort_key == 'popularity'?'':this.sort_key
    this.loaderService.display(true);
    this.catalogueService.GetNovaitems(this.current_page,'',this.minimum_price,this.maximum_price,this.minimum_lead_time,this.maximum_lead_time,this.search_string,this.sort_key, this.liked).subscribe(res=>{
      this.headers_res = res.headers._headers;
      this.per_page = this.headers_res.get("x-per-page");
      this.total_page = this.headers_res.get("x-total");
      this.current_page = this.headers_res.get("x-page");

      res = res.json();
      this.products_array = res.child_line_items
      this.loaderService.display(false);
    },err=>{
      this.loaderService.display(false);
    })
  }

  pricedropdownMenu:any=true
  leadtimedropdownMenu:any=true
  dimensiondropdownMenu:any=true
  sortby:any=true
  classfilter:any=true

  openmodal(obj){
    console.log(obj)
    if(obj=='price'){
      this.pricedropdownMenu=!this.pricedropdownMenu
    }
    else if(obj=='time'){
      this.leadtimedropdownMenu=!this.leadtimedropdownMenu
    }
    else if(obj=='dimensions'){
      this.dimensiondropdownMenu=!this.dimensiondropdownMenu
    }
    else if(obj=='sort'){
      this.sortby=!this.sortby
    }
    else if(obj=='class'){
      this.classfilter=!this.classfilter
    }
  }

  updateNewSlider(type, slider, event) {
    // slider.onUpdate = event;
    if (type == "price") {
      this.minimum_price = event.from;
      this.maximum_price = event.to;
    } else if (type == "lead_time") {
      this.minimum_lead_time = event.from;
      this.maximum_lead_time = event.to;
    } else if (type == "width") {
      this.minimum_width = event.from;
      this.maximum_width = event.to;
    } else if (type == "length") {
      this.minimum_length = event.from;
      this.maximum_length = event.to;
    } else if (type == "height") {
      this.minimum_height = event.from;
      this.maximum_height = event.to;
    }
    this.isFilter=true
    this.filterNewProducts();
    console.log(event.from)
    console.log(event.from)

  }
  updateNewSlidernova(type, slider, event) {
    // slider.onUpdate = event;
    if (type == "price") {
      this.minimum_price = event.from;
      this.maximum_price = event.to;
    } else if (type == "lead_time") {
      this.minimum_lead_time = event.from;
      this.maximum_lead_time = event.to;
    } 
    this.isFilter=true
    this.GetNovaData()
  }
  filters:any=false
  openfilters(){
    this.filters=!this.filters
  }


  CheckCondi(data){

let datafor=[];
    let filter = data.filter(word => word.categories.length > 0);

   
    let i,j;

     for(i = 0 ; i < filter.length;i++ ){

      for(j = 0 ; j < filter[i].categories.length ; j++ ){
        if(filter[i].categories[j].subcategories.length > 0){
          datafor.push(filter[i].categories[j])
        }
        
      }

     }

     if(datafor.length > 0 ){
       return true
     } else{
      return false
     }


    

  }
  CheckCondisub(segment){
    let filetrForSeg =  segment.categories.filter(word => word.subcategories.length > 0);
    

    if(filetrForSeg.length > 0 ){
      return true
    } else{
     return false
    }
  }
  eventOfcur:boolean = false
  displayCounter(event){
    this.eventOfcur = event;
    console.log(event,"kkkk")
  }

  callCarousel(){

    $('#carouselExample').on('slide.bs.carousel', function (e) {

  var $e = $(e.relatedTarget);
  var idx = $e.index();
  var itemsPerSlide = 4;
  var totalItems = $('.carousel-item').length;

  if (idx >= totalItems-(itemsPerSlide-1)) {
      var it = itemsPerSlide - (totalItems - idx);
      for (var i=0; i<it; i++) {
          // append slides to end
          if (e.direction=="left") {
              $('.carousel-item').eq(i).appendTo('.carousel-inner');
          }
          else {
              $('.carousel-item').eq(0).appendTo('.carousel-inner');
          }
      }
  }
});


}


  product_detail:any = {};
  medium_image;
  fetchProductDetails(){
  	this.loaderService.display(true);
  	this.catalogueService.fetchProductDetails(this.product_id).subscribe(
  	  res => {
  	    
  	    this.product_detail = res.product;
        this.medium_image =  this.product_detail.all_image_urls;
        if(this.medium_image.length > 0){
          this.sendMidImge(this.medium_image[0].medium,0);
        }
  	    this.loaderService.display(false);
  	  },
  	  err => {
  	    
  	    this.loaderService.display(false);
  	  }
  	);
  }

  master_option:any = [];
  listMasterOptions(){
    this.loaderService.display(true);
    this.catalogueService.listMasterOptions(this.product_id).subscribe(
      res => {
        
        this.master_option = res;
        if(this.master_option.length > 0){
          this.listSubOptions();
        }
        this.loaderService.display(false);

      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }


  likeProduct(product_id) {
    this.loaderService.display(true);
    this.catalogueService.likeProduct(product_id).subscribe(
      (res) => {
        this.fetchProductDetails();
        this.filterNewProducts(this.page_number);
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  sub_option:any = [];
  listSubOptions(){
    this.loaderService.display(true);
    this.catalogueService.listSubOptions(this.master_option[0].id).subscribe(
      res => {
        
        this.sub_option = res;
        if(this.sub_option.length > 0){
          this.listCatalogueOptions();
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  cat_option:any = [];
  listCatalogueOptions(){
    this.loaderService.display(true);
    this.catalogueService.listCatalogueOptions(this.sub_option[0].id).subscribe(
      res => {
        
        this.cat_option = res;
        if(this.cat_option.length > 0){
          this.listVariations();
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  fetchCatalogueOptions(option_id){
    this.loaderService.display(true);
    this.catalogueService.listCatalogueOptions(option_id).subscribe(
      res => {
        
        this.cat_option = res;
        if(this.cat_option.length > 0){
          this.fetchVariation(this.cat_option[0].id);
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  fetchVariation(option_id){
    this.loaderService.display(true);
    this.catalogueService.listVariations(option_id).subscribe(
      res => {
        
        this.variation = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  variation:any = [];
  listVariations(){
    this.loaderService.display(true);
    this.catalogueService.listVariations(this.cat_option[0].id).subscribe(
      res => {
        
        this.variation = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  count=0;
  imageZoom(imgID, resultID) {
    console.log("hiiii")
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    result.setAttribute("style","display: block;");

    if(this.count == 0){


      this.count =1;
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute('id', 'myLens');


    lens.setAttribute("style", "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);");


    }
    else{

    var element = document.getElementById('myLens');

    document.getElementById("myLens").remove();

    lens = document.createElement("DIV");
    lens.setAttribute('id', 'myLens');
    lens.setAttribute("style", "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);");

    }
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (lens.offsetWidth / 2);
      y = pos.y - (lens.offsetHeight / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
      if (x < 0) { x = 0; }
      if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
      if (y < 0) { y = 0; }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }
  removeHover(resultID){
    var result1;
    result1 = document.getElementById(resultID);
    result1.setAttribute("style","display: none;");
    document.getElementById("myLens").remove();
    this.count= 0;
    


  }

  goBack(){
    console.log("go back")
    $('#addProductModal').modal('hide');

  }
  biggerImage;
  currentIndex;
  selectedIndex = 0;

  selectedIndexChange = 0;
  sendMidImge(event,index){
      this.biggerImage = event;
      this.selectedIndexChange = index;
      this.medium_image = event;    

  }

  newSearchFilter(search_text){
    this.router.navigate(['catalogue'], { queryParams: { product: search_text } });
  }

 
  deActivateZoomer(){
    $('.zoomer-container').css("display", 'none');
  }

  viewMoreVariation(event){
    $(".form-possi").toggleClass("expand");
    if(event.target.textContent == "View More"){
      event.target.textContent = "View Less";
    }
    else if(event.target.textContent == "View Less"){
      event.target.textContent = "View More";
    }
  }

  selectedrow:any

  toggleRow2(id){
    if(this.selectedrow==id){
      this.selectedrow=''
    }
    else{
      this.selectedrow=id
    }

  }

  NovaImages = []
  fetchProductDetailsnova() {
    this.loaderService.display(true);
    this.catalogueService.fetchProductDetailsnova(this.product_id).subscribe(
      (res) => {
        this.product_detail = res.child_line_item;
         this.medium_image = this.product_detail.featured_image
         this.NovaImages = this.product_detail.images
         this.NovaImages.unshift({id	:'',
          thumbnail	: this.medium_image,
          medium	:  this.medium_image})
         console.log( this.NovaImages,'images')
        this.loaderService.display(false);
      },
      (err) => {
        //
        this.loaderService.display(false);
      }
    );
  }

  filterNewProducts2(page?){
    this.current_page = page;
    console.log(page)
    this.GetNovaData()
  }
  notificationAlert
  likeProductnova(product_id) {
    this.loaderService.display(true);
    this.catalogueService.ProductDetailsnovalike(product_id).subscribe(
      (res) => {
        this.fetchProductDetailsnova();
        this.filterNewProducts2(this.current_page);
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  activateProduct_detailsnova(product_id, event) {
    this.activateProduct("product_details");
    this.product_id = product_id;
    $("#addProductModal").animate({ scrollTop: 0 }, "slow");
    this.fetchProductDetailsnova();
    $('#productdetails').modal('show');
    
   
  }


}
