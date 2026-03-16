import { Component, OnInit } from '@angular/core';
import {FormControl,FormBuilder,FormGroup,Validators,FormArray} from '@angular/forms';
import { PortfolioService } from 'app/platform/organisation/portfolio/portfolio.service';
import { LoaderService } from 'app/services/loader.service';
import { CustomerService } from '../../customer.service';
declare var $: any;

@Component({
  selector: 'app-customerreview',
  templateUrl: './customerreview.component.html',
  styleUrls: ['./customerreview.component.css'],
  providers: [
    PortfolioService,
    CustomerService
  ],
})
export class CustomerreviewComponent implements OnInit {


  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:any;
  reviews:any
  reviewform:FormGroup;
  updateform:FormGroup;

  presetlist:any;
  addedpresets:any[] = [];
  cities:any=[]


headers_res:any;
per_page: any
current_page: any;
total_page:any

headers_res2: any;
per_page2: any;
current_page2:any
total_page2: any;
 

  selectedFiles: File[] = [];
  base64Images: string[] = [];
  filteredOptions:any;
  isApifired:boolean=false
  newreview={
    customer_review: {
      id:'',
      lead_id:'',
      status:'',
      review: '',
      rating: 0,
      customer_name: '',
      preset_ids: [],
      feature_image: '',
      video_url:'',
      presets:[],
      feature_image_type:'',
      webview:'',
      apartement:'',
      city:''
    },
    images: []
  }

  constructor(private formBuilder: FormBuilder,
    public loaderService: LoaderService,
    private portfolioService: PortfolioService,
    private customerservice: CustomerService,
  ) { 
    this.reviewform = this.formBuilder.group({
      lead_id:new FormControl("", [Validators.required]),
      review:new FormControl("", [Validators.required]),
      name:new FormControl("", [Validators.required]),
      rating:new FormControl(0, [Validators.required]),
      preset:new FormControl([]),
      video_url:new FormControl(""),
      images:new FormControl([], [Validators.required]),
      featuredimage: new FormControl("", [Validators.required]),
      apartment:new FormControl(""),
      city:new FormControl("")

    }); 

    this.updateform = this.formBuilder.group({
      id:new FormControl(""),
      lead_id:new FormControl("", [Validators.required]),
      review:new FormControl("", [Validators.required]),
      rating:new FormControl(0, [Validators.required]),
      customername: new FormControl("",),
      status:new FormControl(""),
      video_url:new FormControl(""),
      preset:new FormControl([]),
      images:new FormControl([], [Validators.required]),
      featuredimage: new FormControl("", [Validators.required]),
      feature_image_type:new FormControl(""),
      apartment:new FormControl(""),
      city:new FormControl("")

    }); 

  }


  approverejectaccess:boolean=false
  webview:boolean=false
  permenetremove:boolean=false
  changestatus:any=false


  ngOnInit() {
    this.role = localStorage.getItem("user");
    if(this.role=='business_head' || this.role=='admin' || this.role=='lead_head' || this.role=='design_head'){
    this.approverejectaccess=true
    }
    if(this.role=='design_head' || this.role == 'business_head'){
      this.webview=true
      }
    if(this.role=='business_head' || this.role=='admin'  || this.role=='design_head'){
      this.permenetremove=true
      }
    this.getreviews()
    this.getcities()
  }

  getcities(){
    this.customerservice.getCitiesForQuestionnaire().subscribe((res)=>{
      console.log(res)
      this.cities=res.cities
    })
  }

  downloadreport(){
    this.customerservice.downloadreport().subscribe((res)=>{
      this.successalert = true;
      this.successMessage = res.message;
      setTimeout(function() {
        this.successalert = false;
      }.bind(this), 3000);
    })

  }
  hideOptions(){
    this.isApifired = false
  }
  showOptions(){
    this.isApifired = true
  }

  isApifired2:boolean;
  hideOptions2(){
    this.isApifired2 = false
  }
  showOptions2(){
    this.isApifired2 = true
  }


  toggle_button(obj) {
    console.log("hii")
    this.customerservice.changewebview(obj).subscribe(async (res)=>{
      this.getreviews()
      this.successMessage = "Successfully changed the webview status";
    },
    (err)=>{
        this.errormessage(JSON.parse(err['_body']).message);
    })
   
  }
successmessages(){
  this.successalert = true;
  setTimeout(function() {
    this.successalert = false;
    this.successMessage=''
    
  }.bind(this), 5000);

}

 textInput:any
 exceededLimit:any=false
  onInputChange(event: any) {
    let words = event.target.value.split(' ').filter(word => word !== '');
    if (words.length > 500) {
      this.textInput = this.textInput.slice(0, this.textInput.lastIndexOf(' '));
      this.exceededLimit = true;
    } else {
      this.exceededLimit = false;
    }
  }


  donotsave(){
    $('#preview').modal('hide')
    $('#reviewform').modal('hide')
    this.reviewform.reset(); 
  }

  Approvemodal(id){
    this.immediatepreview=false
    this.changestatus=true
    this.preview=false
    this.updateimages=[]
    this.customerservice.showreview(id).subscribe((res)=>{
      console.log(res)
    this.newreview.customer_review.id=res.customer_review.id
    this.newreview.customer_review.lead_id=res.customer_review.lead_id
    this.newreview.customer_review.customer_name=res.customer_review.customer_name
    this.newreview.customer_review.rating=res.customer_review.rating
    this.newreview.customer_review.review=res.customer_review.review
    this.newreview.customer_review.status=res.customer_review.status
    this.newreview.customer_review.presets=res.customer_review.preset_details
    this.newreview.customer_review.video_url=res.customer_review.video_url
    this.newreview.customer_review.feature_image=res.customer_review.feature_url
    this.newreview.customer_review.webview=res.customer_review.web_view

    this.newreview.customer_review.apartement=res.customer_review.apartment_name
    this.newreview.customer_review.city=res.customer_review.city

    this.newreview.images=res.customer_review.images
    this.presettobeadded=res.customer_review.preset_details

    this.updateimages.push({id,"image":res.customer_review.feature_url,"type":"s3"})

    for(let image of res.customer_review.images){
      this.updateimages.push({id:image.id,"image":image.thumbnail,"type":"s3"})
     }

    })
    $('#preview').modal('show');
    
  }

  preview:any=false
  openpreview(id){
    this.preview=true
    this.updateimages=[]
    this.immediatepreview=false

    this.customerservice.showreview(id).subscribe((res)=>{
      console.log(res)
      this.newreview.customer_review.lead_id=res.customer_review.lead_id
      this.newreview.customer_review.customer_name=res.customer_review.customer_name
      this.newreview.customer_review.apartement=res.customer_review.apartment_name

      this.newreview.customer_review.rating=res.customer_review.rating
      this.newreview.customer_review.review=res.customer_review.review
      this.newreview.customer_review.presets=res.customer_review.preset_details
      this.newreview.customer_review.video_url=res.customer_review.video_url
      this.newreview.customer_review.feature_image=res.customer_review.feature_url
      this.newreview.images=res.customer_review.images

      this.presettobeadded=res.customer_review.preset_details
      this.updateimages.push({'image':res.customer_review.feature_url,'type':'s3'})
      for(let image of this.newreview.images){
        this.updateimages.push({id:image.id,"image":image.thumbnail,"type":"s3"})
       }

      })
      $('#preview').modal('show');  }


  // reviewform methods

 

  searchFilter(e){
    this.isApifired = true
    this.customerservice.getleadetails(e.target.value).subscribe((res)=>{
        this.filteredOptions = res.data
      },
      err => {
        this.filteredOptions = [] })
  }

  selectOption(option){
    this.isApifired = false
    this.reviewform.get('lead_id').setValue(option.id)
    let name=option.name.split(' ').filter(Boolean).join(' ');
    name=name.split(' ')
    if(name.length>1){
      this.reviewform.get('name').setValue(name[0]+" "+ name[1][0])
    }
    else{
      this.reviewform.get('name').setValue(name[0])
    }
    this.newreview.customer_review.apartement=option.apartment_name
    this.newreview.customer_review.city=option.city

    this.reviewform.get('apartment').setValue(option.apartment_name)
    this.reviewform.get('city').setValue(option.city)
    console.log(this.reviewform.get('apartment').value,this.reviewform.get('city').value)
    console.log(this.newreview.customer_review.city)

  }

  selectOption2(option){
    console.log(option)
    console.log(option.target.value)
    this.reviewform.get('city').setValue(option.target.value)
    this.updateform.get('city').setValue(option.target.value)

    this.newreview.customer_review.city=option.target.value
  }

  setRating(stars: number) {
    this.reviewform.get('rating').setValue(stars);
    this.updateform.get('rating').setValue(stars);
    this.newreview.customer_review.rating=stars
  }


  openrevieform(){
    this.editform=false
    this.reviewform.reset()
    this.base64Images=[]
    this.presettobeadded=[]
    this.currentPresets=[]
    $('#reviewform').modal('show')
  }

  SetFeaturedImage(image){
    if(this.editform){
    this.updateformfeatureimage = image
    this.reviewform.get('featuredimage').setValue(this.featuredimage)
    }
    else{
      this.featuredimage = image
      this.reviewform.get('featuredimage').setValue(this.featuredimage)
    }
  }

  DeleteImage(featured,image){
    if(featured==true){
      this.featuredimage=''
      this.reviewform.get('featuredimage').setValue(this.featuredimage)
    }
    else{
      this.base64Images = this.base64Images.filter(item => item !== image);
      this.reviewform.get('images').setValue(this.base64Images)

    }

  }

  featuredimage:any
  immediatepreview:boolean=false
  previewready(){
    this.immediatepreview=true
    this.preview=false
    this.updateimages=[]
    this.newreview.customer_review.lead_id=this.reviewform.get('lead_id').value
    this.newreview.customer_review.customer_name=this.reviewform.get('name').value

    // this.newreview.customer_review.apartement=this.reviewform.get('apartment').value
    // this.newreview.customer_review.city=this.reviewform.get('city').value

    this.newreview.customer_review.review=this.reviewform.get('review').value
    this.newreview.customer_review.rating=this.reviewform.get('rating').value
    this.newreview.customer_review.feature_image=this.reviewform.get('featuredimage').value
    this.newreview.customer_review.video_url=this.reviewform.get('video_url').value
    this.newreview.images = this.reviewform.get('images').value
    this.newreview.images=this.newreview.images.filter(item=>item != this.newreview.customer_review.feature_image)
    this.updateimages=this.newreview.images

    this.reviewform.get('preset').patchValue(this.currentPresets.join(','));
    this.newreview.customer_review.preset_ids= this.reviewform.get('preset').value.toString()
    console.log(this.newreview)
    $('#reviewform').modal('hide')
  }

// preview form methods




postareview(obj){
  console.log(obj)
  this.loaderService.display(true)
  this.customerservice.postareview(obj).subscribe((res)=>{
    this.loaderService.display(false)
    $('#preview').modal('hide');
    $('#reviewform').modal('hide');
    this.successMessage="Customer review created successfully"
    this.getreviews()

  },
  (err)=>{
    this.errorMessage=JSON.parse(err['_body']).message
    this.loaderService.display(false)
    $('#preview').modal('hide');
    $('#reviewform').modal('hide');
    this.getreviews()

    
  }
)

}

reviewid(id){
  this.editid=id
}

deletreview(){
  this.customerservice.deletreview(this.editid).subscribe((res)=>{
    this.getreviews()
    $('#confirmbox').modal('hide')
    this.successMessage=res.message
  },(err)=>{
    this.errormessage(JSON.parse(err['_body']).message)
  })

}

closemodal(){
  $('#confirmbox').modal('hide' as any);
}

statusupadate(review,status){
  this.loaderService.display(true)
  this.customerservice.approvereview(review.id,status).subscribe((res)=>{
    this.loaderService.display(false)
    this.getreviews()
    $('#preview').modal('hide' as any);
      this.successMessage = res.message;
  },(err)=>{
    $('#preview').modal('hide' as any);
    this.errormessage(JSON.parse(err['_body']).message)
  }
)


}

gotoaddform(){
  $('#reviewform').modal('show')
  $('#preview').modal('hide');

}


getreviews(page?){
  this.changestatus=false
  this.loaderService.display(true)
  this.customerservice.getreviews(page).subscribe((res)=>{
    this.loaderService.display(false)
      this.headers_res2 = res.headers._headers;
      this.per_page2 = this.headers_res2.get("x-per-page")[0];
      this.total_page2 = this.headers_res2.get("x-total")[0];
      this.current_page2 = this.headers_res2.get("x-page")[0];
      if(this.successMessage){
        this.successmessages()
      }
      if(this.errorMessage){
        this.errormessage(this.errorMessage)
      }


    this.loaderService.display(false)
      res = res.json();
      this.reviews=res.customer_reviews
  })
}


  getPortfolioList(curr_page: any,space: any,lifeStage: any,theme: any,range: any,per_page: any,search_string: any,spaceShape :any,area_range :any,is_favourt :any,is_segment :any,typeofpreset :any,sortbyfeature :any,sortbyarea :any,sortbyprice:any,newlast :any,popular :any,bestseller :any,catprice :any,selected_preset_ids?,page_size?)
  
  {
    this.loaderService.display(true)
    this.portfolioService.updatednewportfoliolist(curr_page,space,lifeStage,theme,range,per_page,search_string,spaceShape,area_range,is_favourt,is_segment,typeofpreset,sortbyfeature,sortbyarea,sortbyprice,newlast,popular,bestseller,catprice,selected_preset_ids,page_size)
      .subscribe((res) => {
        this.loaderService.display(false)
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();

        this.presetlist = res.portfolios;
      
      },(err) => {
        this.errormessage(JSON.parse(err['_body']).message);
        })
  }

  getpageNumber(event: any) {
    this.getPortfolioList(event,"","","","","","","","","","","","","","","","","","","",12);

    this.current_page = event;
  }
  getpageNumber2(event: any) {

    console.log(event)
    this.getreviews(event)

    this.current_page2 = event;
  }

  openpresetmodal(){
    this.getPortfolioList("","","","","","","","","","","","","","","","","","","","",12)
  }

  searchstring:any
  searchpreset(e){
  this.searchstring = e;
  this.getPortfolioList(this.current_page,"","","","","",this.searchstring,"","","","","","","","","","","","","",12);
  }

  presettobeadded: any[] = [];
  currentPresets:string[] =[];
  addpresets(preset){
    this.presettobeadded.push({'id':preset.id,'preset_id':preset.preset_id})
    this.currentPresets.push(preset.id)
  }
  removepresets(preset){
    this.presettobeadded=this.presettobeadded.filter(item => item.preset_id != preset.preset_id)
    this.currentPresets=this.currentPresets.filter(item => item != preset.id)
  }
  addpre(){
    this.reviewform.get('preset').patchValue(this.currentPresets.join(','));
    this.updateform.get('preset').patchValue(this.currentPresets.join(','));

    $('#prestes').modal('hide')
  }

  removepreset(id){
    this.presettobeadded=this.presettobeadded.filter(item => item.id != id)
    this.currentPresets=this.currentPresets.filter(item => item != id)
    this.reviewform.get('preset').patchValue(this.currentPresets.join(','));
    this.updateform.get('preset').patchValue(this.currentPresets.join(','));


  }
 

  editform=false
  updateimages:any[]=[]
  editid:any;
  updateformfeatureimage:any
  update(review){
    this.updateform.reset()
    this.updateimages=[]
    this.presettobeadded=[]
    this.currentPresets=[]
    this.editform=true
    this.editid=review.id
    this.updateform.get('id').setValue(review.id)
    this.updateform.get('lead_id').setValue(review.lead_id)
    this.updateform.get('review').setValue(review.review)
    this.updateform.get('rating').setValue(review.rating)
    this.updateform.get('customername').setValue(review.customer_name)
    this.updateform.get('video_url').setValue(review.video_url)
    this.updateform.get('status').setValue(review.status)
    this.updateform.get('preset').setValue(review.preset_details)
    this.updateform.get('apartment').setValue(review.apartment_name)
    this.updateform.get('city').setValue(review.city)


    this.presettobeadded=review.preset_details
    for(let preset of this.presettobeadded){
      this.currentPresets.push(preset.id)
    }
    this.updateform.get('preset').setValue(this.currentPresets.join(','))

    this.updateform.get('featuredimage').setValue(review.feature_url)
    this.updateformfeatureimage=review.feature_url
    this.updateform.get('feature_image_type').setValue('s3')

    this.updateimages.push({'image':review.feature_url,'type':this.updateform.get('feature_image_type').value})
    this.base64Images2.push({'image':review.feature_url,'type':this.updateform.get('feature_image_type').value})
    for(let image of review.images){
     this.updateimages.push({id:image.id,"image":image.medium,"type":"s3"})
    }


    this.updateform.get('images').setValue(this.updateimages)
    $('#Editform').modal('show')

  }

  base64Images2:object[]=[]
  onFileSelected(event){
    this.selectedFiles = event.target.files;
    if(this.editform){
      this.selectedFiles=event.target.files;
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.base64Images2.push({'image':e.target.result, "type":'base_64'});
          this.updateimages.push({'image':e.target.result, "type":'base_64'});

        };
        reader.readAsDataURL(file);    }
        this.updateform.get('images').setValue(this.base64Images)
    }
    else{
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.base64Images.push(e.target.result);
          this.reviewform.get('images').setValue(this.base64Images)
        };
        reader.readAsDataURL(file);        
      }
    }
  }




  onupdateimages(files){
    this.selectedFiles=files
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.updateimages.push({'image':e.target.result, "type":'base_64'});
      };
      reader.readAsDataURL(file);    }
      this.updateform.get('images').setValue(this.updateimages)

    }


  removeimage(image){
    if(image.id){
        this.loaderService.display(true)
        this.customerservice.removeimage(this.editid,image.id).subscribe((res)=>{
        this.loaderService.display(false)
        this.updateimages = this.updateimages.filter(item => item.image !== image.image);
      },(err)=>{
        this.errormessage(JSON.parse(err['_body']).message)});
    }
    else{
      this.updateimages = this.updateimages.filter(item => item.image !== image.image);

      }
    this.updateform.get('images').setValue(this.updateimages)
    }

    SetupdateformFeaturedImage(obj){
      this.updateformfeatureimage=obj.image
      this.updateform.get('featuredimage').setValue(this.updateformfeatureimage)
      this.updateform.get('feature_image_type').setValue(obj.type)

    }

    updateimagelist(image){
      this.updateformfeatureimage=''
      this.updateform.get('featuredimage').setValue(this.updateformfeatureimage)
      this.updateimages = this.updateimages.filter(item => item.medium !== image);

      
    }

    updatereview(){
      this.newreview.customer_review.id=this.updateform.get('id').value
      this.newreview.customer_review.lead_id=this.updateform.get('lead_id').value
      this.newreview.customer_review.customer_name=this.updateform.get('customername').value

      this.newreview.customer_review.apartement=this.updateform.get('apartment').value
      this.newreview.customer_review.city=this.updateform.get('city').value

      this.newreview.customer_review.review=this.updateform.get('review').value
      this.newreview.customer_review.rating=this.updateform.get('rating').value
      this.newreview.customer_review.video_url=this.updateform.get('video_url').value
      this.newreview.customer_review.feature_image=this.updateform.get('featuredimage').value
      this.newreview.customer_review.feature_image_type=this.updateform.get('feature_image_type').value
      this.newreview.customer_review.preset_ids= this.updateform.get('preset').value.toString()
      let images:object[]=[]


      this.base64Images2=this.base64Images2.filter(item=> item['image'] != this.updateform.get('featuredimage').value)

      this.updateform.get('images').setValue(this.base64Images2)

      this.newreview.images=this.base64Images2
      this.loaderService.display(true)
      this.customerservice.updatereview(this.newreview,this.newreview.customer_review.id).subscribe((res)=>{
        this.loaderService.display(false)
        this.successMessage = "Customer review updated successfully";
        this.getreviews()
        $('#Editform').modal('hide')
      },(err)=>{
        $('#Editform').modal('hide')

          this.errormessage(JSON.parse(err['_body']).message)
      })
    }

    errormessage(message){
        this.errorMessage = message;
      this.erroralert = true;
      setTimeout(function() {
           this.erroralert = false;
           this.errorMessage=''
        }.bind(this), 3000);
      this.loaderService.display(false)
  
    }
  
}


