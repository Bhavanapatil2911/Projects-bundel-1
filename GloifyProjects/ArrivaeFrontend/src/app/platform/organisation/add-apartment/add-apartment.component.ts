import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'app/services/loader.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { LeadService } from 'app/platform/lead/lead.service';
import { CustomerService } from 'app/platform/customer/customer.service';
declare var google :any
declare var $:any;

@Component({
  selector: "app-add-apartment",
  templateUrl: "./add-apartment.component.html",
  styleUrls: ["./add-apartment.component.css"],
  providers: [PortfolioService,LeadService,CustomerService],
})
export class AddApartmentComponent implements OnInit {
  public createApartmentForm: FormGroup;
  public updateApartmentForm: FormGroup;
  city_list: any;
  states: any;
  apartments: any;
  currentPage: any;
  itemsPerPage: any;
  current_page: any;
  ApartmentName: any;
  Cluster: any;
  ApartmentAddess: any;
  PinCode: any;
  SearchForState: any;
  SearchForCity: any;
  UNID: any;
  AreaName: any;
  Lifestage: any;
  Theme: any;
  DeveloperName: any;
  StartFrom: any;
  ApartmentValue: any;
  ApartmentArea: any;
  BOQEMI: any;
  SelectFormat: any;
  VariantID: any;
  SelectLayoutFloorPlan: any;
  SelectPrimaryImage: any;
  VRLink: any;
  PropertyName: any;
  formattedaddress: any;
  FullAdress2: any;
  pincodePro2: any;
  areaname: any;
  citynamePro2: any;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private portfolioService: PortfolioService,
    private loaderService: LoaderService,
    private leadService:LeadService,
    private customerservice:CustomerService
  ) {}

  ngOnInit() {
    this.loadStyles()
    this.updateApartmentForm = this.formBuilder.group({
      pincode: new FormControl(""),
      area_name: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      cluster: new FormControl(""),
      apartment_name: new FormControl(""),
      unid: new FormControl(""),
      apartment_address: new FormControl(""),
      developer_name: new FormControl(""),
      area: new FormControl(""),
      apartment_value: new FormControl(""),
      lifestage: new FormControl(""),
      theme: new FormControl(""),
      start_from: new FormControl(""),
      boq_emi: new FormControl(""),
      formats: this.formBuilder.array([]),
      apartment_id:new FormControl(""),
    });

    this.getStates();
    this.getFilterData();
    this.getApartmentFormatData();
    this.getap("");
    this.current_page = 1;
  }

  createItemup(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      id:new FormControl(""),
      variants: this.formBuilder.array([this.createVariantItemup()]),
    });
  }

  createVariantItemup(): FormGroup {
    return this.formBuilder.group({
      variant_id: new FormControl("", [Validators.required]),
      layout_image: new FormControl("", [Validators.required]),
      primary_image: new FormControl("", [Validators.required]),
      vr_link: new FormControl(""),
      id:new FormControl(""),
      layout_imgagefilename:new FormControl(""),
      primary_imagefilename:new FormControl("")
    });
  }

  pushJobAttributesup(updateApartmentForm) {
    return updateApartmentForm.get("formats").push(this.createItemup());
  }

  addAnotherVariant(item) {
    var sec_arr = this.updateApartmentForm.get("formats") as FormArray;
    item.get("variants").push(
      this.formBuilder.group({
        variant_id: new FormControl("", [Validators.required]),
        layout_image: new FormControl("", [Validators.required]),
        primary_image: new FormControl("", [Validators.required]),
        vr_link: new FormControl(""),
        id: new FormControl(""),
        layout_imgagefilename:new FormControl(""),
        primary_imagefilename:new FormControl("")
      })
    );
  }

  back() {
    this.router.navigate(["/list-apartment"]);
  }

  getStates() {
    this.portfolioService.getStateList().subscribe((res) => {
      this.states = res.state_list;
    });
  }
  headers_res;
  per_page;
  total_page;

  getap(e) {
    e = e?e:"";
    this.current_page = e;
    this.loaderService.display(true);
    this.portfolioService.getallapartments(this.current_page,this.searchstring).subscribe((res) => {
      this.headers_res = res.headers._headers;
      this.per_page = this.headers_res.get('x-per-page');
      this.total_page = this.headers_res.get('x-total');
      this.current_page = this.headers_res.get('x-page');
      res = res.json();
      this.apartments = res.data;
      this.loaderService.display(false);
    });
  }

  confirmAndDelete(data: any) {
    if (confirm("Are You Sure to Delete this Apartment") == true) {
      this.portfolioService.deleteapartment(data).subscribe((res) => {
        this.getap(this.current_page);
      });
    }
  }

  getscityList(id) {
    this.portfolioService.getApartmentCity(id).subscribe((res) => {
      this.city_list = res.Cities[id];
    });
  }
  onSubmit2(data) {
    console.log(data);

    this.loaderService.display(true);
    window.scrollTo(0, 0);
 
    this.portfolioService.editPortapartment(data).subscribe(
      (res) => {
       

        this.portfolioService.Deletevarients(this.VarientsToDelete).subscribe(res=>{

          this.successMessageShow("Apartment Updated Successfully")
          console.log(res);
          $("#exampleModalLong2").modal("hide");
          this.getap('');
          this.loaderService.display(false);

        },err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);

        })
        



       

        
      },
      (err) => {
        this.errorMessage = "";
        this.msgError = true;
        this.loaderService.display(false);
      }
    );
  }

  theme: any;
  lifeStage: any;
  getFilterData() {
    this.portfolioService.getFilterData().subscribe((res) => {
      this.lifeStage = res.lifestage;
      this.theme = res.theme;
    });
  }

  formatData: any;
  getApartmentFormatData() {
    this.portfolioService.getFormatData().subscribe((res) => {
      this.formatData = res.format;
    });
  }
  VarientsToDelete=[];
  Deletevariants(e,item,i,j) {
    let id;
    console.log(this.variantids, e);
    id = this.variantids.filter((el) => {
      return e == el.id;
    });
    console.log(id);
    if(id.length > 0){
      id = id[0].id;
      this.VarientsToDelete.push(id);
      console.log(this.VarientsToDelete);
     this.successMessageShow("Selected Varient is Selected to Delete it will Delete When u Submit form")    
    } 
    else{
      item.get('variants').removeAt(j)

    }
   
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }
  apartment_details: any;
  dynamicformats: any;
  dynamicVarients: any;
  variantids = [];

  FormatIDs:any =[];
  VarientsIdForCheck = [];

  getapartment(id: number) {
    this.layoutimg1 = [];
        this.layoutimg2 = [];
        this.layoutimg3 = [];
        this.layoutimg4 = [];
        this.primaryimg1 =[];
        this.primaryimg2 =[];
        this.primaryimg3 =[];
        this.primaryimg4 =[];
        this.variantids =[];
        this.FormatIDs =[];
        this.VarientsToDelete  = [];
        this.VarientsIdForCheck =[];

    
    this.portfolioService.viewapartmentData(id).subscribe((res) => {
      this.apartment_details = res;
      (<FormArray>this.updateApartmentForm.controls["formats"]).controls = [];

      this.updateApartmentForm.controls["apartment_name"].setValue(
        this.apartment_details.apartment_name
      );
      this.updateApartmentForm.controls["cluster"].setValue(
        this.apartment_details.cluster
      );
      this.updateApartmentForm.controls["apartment_address"].setValue(
        this.apartment_details.apartment_address
      );
      this.updateApartmentForm.controls["pincode"].setValue(
        this.apartment_details.pincode
      );
      this.updateApartmentForm.controls["area_name"].setValue(
        this.apartment_details.area_name
      );
      this.updateApartmentForm.controls["developer_name"].setValue(
        this.apartment_details.developer_name
      );
      this.updateApartmentForm.controls["start_from"].setValue(
        this.apartment_details.start_from
      );
      this.updateApartmentForm.controls["apartment_value"].setValue(
        this.apartment_details.apartment_value
      );
      this.updateApartmentForm.controls["boq_emi"].setValue(
        this.apartment_details.boq_emi
      );
      this.updateApartmentForm.controls["unid"].setValue(
        this.apartment_details.unid
      );
      this.updateApartmentForm.controls["area"].setValue(
        this.apartment_details.area
      );
      this.updateApartmentForm.controls["city"].setValue(
        this.apartment_details.city
      );
      this.updateApartmentForm.controls["state"].setValue(
        this.apartment_details.state
      );
      this.updateApartmentForm.controls["lifestage"].setValue(
        this.apartment_details.lifestage
      );
      this.updateApartmentForm.controls["theme"].setValue(
        this.apartment_details.theme
      );
      this.updateApartmentForm.controls["apartment_id"].setValue(
        this.apartment_details.apartment_id
      );
      // this.updateApartmentForm.controls['formats'].setValue(this.apartment_details.formats);
      var sec_arr = this.updateApartmentForm.get("formats") as FormArray;

      for (var i = 0; i < this.apartment_details.formats.length; i++) {

        this.FormatIDs.push(this.apartment_details.formats[i][0].id)

        sec_arr.push(
          this.formBuilder.group({
            name: new FormControl(
              this.apartment_details.formats[i][0].format_name,
              [Validators.required]
            ),
            id: new FormControl(
              this.apartment_details.formats[i][0].id,
              [Validators.required]),
            variants:  this.formBuilder.array([]),
          })
        );

        var varients = sec_arr.controls[i]["controls"]["variants"] as FormArray;
        (<FormArray>varients).controls = [];
        for (var j = 0; j < this.apartment_details.formats[i].length; j++) {
          console.log(this.apartment_details.formats[i].length);
          this.variantids.push({
            id: this.apartment_details.formats[i][j].id,
            VariantID: this.apartment_details.formats[i][j].variant_id,
          });
          this.VarientsIdForCheck.push(this.apartment_details.formats[i][j].id)

          varients.push(
            this.formBuilder.group({
              variant_id: new FormControl(
                this.apartment_details.formats[i][j].variant_id,
                [Validators.required]
              ),
              layout_image: new FormControl(
                this.apartment_details.formats[i][j].layout_image,
                [Validators.required]
              ),
              primary_image: new FormControl(
                this.apartment_details.formats[i][j].primary_image,
                [Validators.required]
              ),
              vr_link: new FormControl(
                this.apartment_details.formats[i][j].vr_link
              ),
              id:new FormControl(
                this.apartment_details.formats[i][j].id),
                layout_imgagefilename: new FormControl(
                 ""
                ),
                primary_imagefilename: new FormControl(
                 ""
                ),
            }),
            
          );

          console.log(sec_arr);
        }
      }
    });
  }

  attachment_file: any;
  basefile = [];
  basefile3 = [];
  layoutimg1 = [];
  layoutimg2 = [];
  layoutimg3 = [];
  layoutimg4 = [];
  onChange(event, i, j) {
    this.attachment_file = event.srcElement.files[0];
    (<HTMLInputElement>document.getElementById(`fileNamePresettwoupdate${i}${j}`)).value = this.attachment_file.name
    // if((this.attachment_file.size/1024) > 120) {
    //   document.getElementById('errorsize'+i).innerHTML = 'File size should not exceed 120kb.';
    // }
    console.log(this.attachment_file)
   
    var sec_arr = this.updateApartmentForm.get("formats") as FormArray;
    sec_arr.controls[i]["controls"]["variants"].controls[j].controls['layout_imgagefilename'].patchValue(this.attachment_file.name)


    var fileReader = new FileReader();

    
    fileReader.onload = (fileLoadedEvent) => {
      var base64;
      var image = new Image();
      image.src = fileReader.result;
      base64 = fileLoadedEvent.target;
      console.log("guijjj",base64.result)
      this.basefile2 = base64.result
      this.layoutimg1.push(base64.result);
      sec_arr.controls[i]["controls"]["variants"].controls[j].controls['layout_image'].patchValue(base64.result)
    };

 

    console.log(this.layoutimg1)
    

    

  

    console.log(sec_arr);
    console.log(sec_arr.controls[i]["controls"]["variants"].controls[j].controls['layout_image'].value)

    fileReader.readAsDataURL(this.attachment_file);
  }

  attachment_file2: any;
  basefile2 = [];
  basefile4 = [];
  primaryimg1 = [];
  primaryimg2 = [];
  primaryimg3 = [];
  primaryimg4 = [];
  onChangeImage(event, i, j) {
    this.attachment_file2 = event.srcElement.files[0];
    console.log(this.attachment_file2);
    (<HTMLInputElement>document.getElementById(`fileNamePresetoneupdate${i}${j}`)).value = this.attachment_file2.name
    var sec_arr = this.updateApartmentForm.get("formats") as FormArray;
    sec_arr.controls[i]["controls"]["variants"].controls[j].controls['primary_imagefilename'].patchValue(this.attachment_file2.name)
    var fileReader = new FileReader();

      var base64;
      fileReader.onload = (fileLoadedEvent) => {
        var image = new Image();
        image.src = fileReader.result;
        base64 = fileLoadedEvent.target;
        this.basefile2 = base64.result
        this.primaryimg1.push(base64.result);
        sec_arr.controls[i]["controls"]["variants"].controls[j].controls['primary_image'].patchValue(base64.result)
      };

   

   
    fileReader.readAsDataURL(this.attachment_file2);
    
    console.log(sec_arr);
  }

  transform(value: string): string {
    return value.replace(/_/g, " ");
  }
  erroralert: any;
  errorMessage: any;
  successalert;
  successMessage;
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

  msgError: boolean = false;
  
  successError: boolean = false;

  searchstring:any="";

  RemoveValidator(i){
    var sec_arr = this.updateApartmentForm.get("formats") as FormArray;
    let value =  sec_arr.controls[i]["controls"]["id"].value;

    if(this.FormatIDs.indexOf(value) == -1){
     sec_arr.removeAt(i)

    } else{
      this.loaderService.display(true)
      this.portfolioService.DeleteFormat(sec_arr.controls[i]["controls"]["name"].value,this.updateApartmentForm.controls['unid'].value).subscribe(res=>{
        this.successMessageShow("Format Deleted Successfully");
        sec_arr.removeAt(i);
        this.loaderService.display(false);



      },err=>{

        this.loaderService.display(false);

        this.errorMessageShow(JSON.parse(err['_body']).message)

      })

    }
  


  }

  showValidator(i){
    var sec_arr = this.updateApartmentForm.get("formats") as FormArray;
    let value =  sec_arr.controls[i]["controls"]["id"].value;

    if(this.FormatIDs.indexOf(value) == -1){
     return "show"

    } else{
      return "hide"

    }
  }

  Unselect(id){
    let index ;
    index = this.VarientsToDelete.indexOf(id);
    this.VarientsToDelete.splice(index,1);

  }
  closemodal(){
   
    $("#exampleModalLong2").modal("hide");
  }

  loadStyles(){
    
    let node7 = document.createElement('link');
   node7.href = 'https://fonts.gstatic.com';
   node7.rel ="preconnect"
   document.getElementsByTagName('head')[0].appendChild(node7);
   let node8 = document.createElement('link');
   node8.href = 'https://fonts.googleapis.com/css2?family=Arimo:wght@300&display=swap';
   node8.rel ="stylesheet"
   document.getElementsByTagName('head')[0].appendChild(node8);
   console.log("sucess")
  }
  

  hideOptions(){
    this.isApifired = false
  }
  showOptions(){
    this.isApifired = true
  }
  filteredOptions
  searchSocietyApi($event) {
    this.othersShow = true;
    this.isApifired = true;
    this.Typeselect = ''
    this.isSelected = false
    let searchWord = $event.target.value;
    this.leadService.getSocietyWebapi(searchWord).subscribe(
      res => {
        this.filteredOptions = res.result
        console.log(this.filteredOptions)
       
        
      },
      err => {
        this.filteredOptions = []

      }
    );
  }
  isSelected = false;
  Typeselect;
  isApifired = false
  projectName ='';
  pincodePro ='';
  FullAdress;
  citynamePro;
  othersShow = false;
  selectOption(address){
    this.Typeselect = address
    if(address == 'other'){
      console.log("hiiiiiii")
      this.updateApartmentForm.controls['apartment_address'].setValue('');
      this.updateApartmentForm.controls['city'].setValue('');
      this.updateApartmentForm.controls['pincode'].setValue('');
      this.updateApartmentForm.controls['apartment_id'].setValue('');
      this.updateApartmentForm.controls['state'].setValue('');
      this.filteredOptions =[];
      this.projectName =  this.updateApartmentForm.controls['apartment_name'].value;
      this.DeveloperName = '';
      this.pincodePro ='';
      this.FullAdress ='';
      this.citynamePro ='';
      $('#citygoogle').val('');
      $('#pincodegoogle').val('')
      $('#OtherProjectname').modal('show');
      console.log("hello")

      this.initMap()

    } else{
      this.updateApartmentForm.controls['apartment_address'].setValue(address.address);
      this.updateApartmentForm.controls['city'].setValue(address.city);
      this.updateApartmentForm.controls['pincode'].setValue(address.pincode);
      this.updateApartmentForm.controls['apartment_name'].setValue(address.apartment_name );
      this.updateApartmentForm.controls['state'].setValue(address.state);
      let apar_id ;
      if(address.configuration.length>0){
        apar_id = address.configuration[0].apartment_id
      } else{
        apar_id =address.id
      }
      this.updateApartmentForm.controls['apartment_id'].setValue(apar_id);
      this.filteredOptions =[]
    }

    this.isSelected = true;
    this.isApifired = false;
    this.othersShow = false


  }
  SelectedPlace = ''

  initMap(){
    var vm = this
 
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-input'),
        {  types: ['geocode', 'establishment'] ,
      }
      );

      
 
      autocomplete.addListener('place_changed', function() {
        const selectedPlace = autocomplete.getPlace();
        console.log(selectedPlace,'fulladdress')
        if (selectedPlace && selectedPlace.address_components) {
          const city = selectedPlace.address_components.find(component =>
            component.types.includes('locality')
          );
          const postalCode = selectedPlace.address_components.find(component =>
            component.types.includes('postal_code')
          );
          const state = selectedPlace.address_components.find(component =>
           component.types.includes('administrative_area_level_1')
         );
 
         console.log(state,"state")
 
         state ? $('#state').val(state.long_name): $('#state').val('')
          const completeAddress = selectedPlace.formatted_address;
          
          var areaName = selectedPlace.address_components.filter(
            (component) => component.types.includes('sublocality')
          );
 
          const concatenatedNames = areaName.map(component => component.long_name).join(', ');
          areaName = concatenatedNames
          console.log(areaName,'areaname')
          areaName ? $('#areaname').val(areaName): $('#areaname').val(completeAddress )
          $('#autocomplete-input').val(completeAddress)
 
          if (city) {
            const cityname = city.long_name;
            console.log('Selected city:', cityname);
            vm.citynamePro = cityname;
            $('#citygoogle').val(cityname)
            console.log(vm.citynamePro)
          }
          if (postalCode) {
            const postalCodeValue = postalCode.long_name;
            console.log('Selected postal code:', postalCodeValue);
            $('#pincodegoogle').val(postalCodeValue)
            // Assign the city name and postal code to variables or do any other processing
 
            vm.pincodePro = postalCodeValue;
          }else{
            $('#pincodegoogle').val('')
          }
        }
 
      });
 
 
 
 
  }
  Submitapart(){
   $('#OtherProjectname').modal('hide');
   this.updateApartmentForm.controls['apartment_address'].setValue($('#areaname').val());
   this.updateApartmentForm.controls['city'].setValue($('#citygoogle').val());
   this.updateApartmentForm.controls['pincode'].setValue($('#pincodegoogle').val());
   this.updateApartmentForm.controls['apartment_name'].setValue(this.projectName);
   this.updateApartmentForm.controls['state'].setValue($('#state').val());
   
   if(this.Typeselect == 'other'){
     this.CreateApartment()
   }
 }
 showPopup = false;
 CreateApartment(){
   let address = this.updateApartmentForm.controls['apartment_address'].value;
   const pincodeRegex = /\b\d{6}\b/;
 
 // Use the match method to find the first match of the regex pattern in the string
 const pincodeMatch = address.match(pincodeRegex);
 
 // Check if a match is found
 if (pincodeMatch) {
 // Extracted PIN code
 var pincode = pincodeMatch[0];
 
 } else {
 pincode =''
 }
 
   let obj ={
     "rera_number": "",
     "project_name": this.projectName,
     "full_address":$('#autocomplete-input').val(),
     "project_developer": this.DeveloperName,
     "pincode": this.updateApartmentForm.controls['pincode'].value,
     "area_name":$('#areaname').val(),
     "city": this.updateApartmentForm.controls['city'].value,
     "state": ""
 }
    this.leadService.CreateApar(obj).subscribe(Res=>{
     this.updateApartmentForm.controls['apartment_id'].setValue(Res.result[0].apartment_id)
 
     this.showSuccessMessage("Apartment successfully created");
    },err=>{
   this.showErrorMessage(JSON.parse(err['_body']).message);
    })
 
   
 }
 closeaddApartmentrplanModal() {
   this.Typeselect=''
   $('#OtherProjectname').modal('hide');
  
 }
 pincodeval(){
   console.log($('#pincodegoogle').val(),'ta')
 this.pincodePro =  $('#pincodegoogle').val()
 
 
 }

showSuccessMessage(msg){
  this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
              this.successalert = false;
           }.bind(this), 23000);
}

showErrorMessage(msg){
  this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
              this.successalert = false;
           }.bind(this), 23000);
}

handleAddressChange(address: any) {
  this.PropertyName = address.name
  this.FullAdress2 =  this.PropertyName
  this.formattedaddress = address.name;
  this.formattedaddress = address.name + "," + address.formatted_address;
  var str = this.formattedaddress;
  var arr = [];
  arr = str.split(",");
  var unique = [];
  for (i = 0; i < arr.length; i++) {
    if ((i == arr.indexOf(arr[i])) || (arr.indexOf(arr[i]) == arr.lastIndexOf(arr[i])))
      unique.push(arr[i]);
  }
  this.formattedaddress = unique.join(",");
  console.log(this.formattedaddress);
  console.log(address);
  for (var i = 0; i < address.address_components.length; i++) {
    for (var j = 0; j < address.address_components[i].types.length; j++) {
      if (address.address_components[i].types[j] == 'postal_code') {
      this.pincodePro2 =  address.address_components[i].long_name
      } else{
        this.pincodePro2 = ''
      }
    this.FullAdress2 = this.formattedaddress;
    var areaName = address.address_components.filter(
      (component:any) => component.types.includes('sublocality')
    );
    const concatenatedNames = areaName.map((component:any) => component.long_name).join(', ');
    areaName = concatenatedNames
   this.areaname=  areaName ?areaName : this.formattedaddress;
          if (address.address_components[i].types[j] == 'locality') {
            this.updateApartmentForm.controls['city'].setValue(
              address.address_components[i].long_name
            );
            this.citynamePro2 =  address.address_components[i].long_name
            console.log(this.updateApartmentForm.controls['city'].value);
            console.log(address.address_components[i].long_name);

          } 

    }
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
  toggle_button(e,id) {
    let Obj ={
     'is_enabled':e.target.checked
    }
     this.loaderService.display(true)
    this.customerservice.changewebviewApart(id,Obj).subscribe(async (res)=>{
      this.loaderService.display(false)
      this.getap(this.current_page)
     this.successMessageShow("Successfully changed the  status")
    
    },
    (err)=>{
      this.loaderService.display(false)
        this.errorMessageShow(JSON.parse(err['_body']).message);
    })
   
  }
 
}