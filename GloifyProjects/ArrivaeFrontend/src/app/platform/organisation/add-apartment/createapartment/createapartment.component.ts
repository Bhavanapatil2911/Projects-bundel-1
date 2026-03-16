import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/services/loader.service';
import { PortfolioService } from '../../portfolio/portfolio.service';
import { LeadService } from 'app/platform/lead/lead.service';
declare var google :any
declare var $:any;



@Component({
  selector: 'app-createapartment',
  templateUrl: './createapartment.component.html',
  styleUrls: ['./createapartment.component.css'],
  providers: [PortfolioService,LeadService]
})
export class CreateapartmentComponent implements OnInit {
  public createApartmentForm: FormGroup;
  city_list: any;
  states: any;
  successalert: boolean;
  erroralert: boolean;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private portfolioService: PortfolioService,
    private loaderService : LoaderService,
    private leadService:LeadService,
    private route: ActivatedRoute

  ) { }
  apartmentData
  ngOnInit() {
   
    
    this.getStates();
    this.getFilterData();
    this.getApartmentFormatData();
    this.CreateForm()
    this.route.queryParams.subscribe(params => {
      if (params['apartment_data']) {
        this.apartmentData = JSON.parse(params['apartment_data']);
      this.selectOption(this.apartmentData )
      }
    });

  }
  CreateForm(){
    this.createApartmentForm = this.formBuilder.group({
      pincode: new FormControl("", [Validators.required]),
      area_name: new FormControl("", [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      cluster: new FormControl(""),
      apartment_name: new FormControl("", [Validators.required]),
      unid: new FormControl("", [Validators.required,Validators.minLength(15)]),
      apartment_address: new FormControl("", [Validators.required]),
      developer_name: new FormControl("", [Validators.required]),
      area: new FormControl("", [Validators.required]),
      apartment_value: new FormControl("", [Validators.required]),
      lifestage: new FormControl("", [Validators.required]),
      theme: new FormControl("", [Validators.required]),
      start_from: new FormControl(""),
      boq_emi: new FormControl(""),
      apartment_id:new FormControl(""),
      formats: this.formBuilder.array([this.createItem()])
    });
  }


  createItem(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      variants: this.formBuilder.array([this.createVariantItem()]),
      // variant_id: new FormControl(""),
      // layout_image: new FormControl("")
    });
  }

  createVariantItem(): FormGroup {
    return this.formBuilder.group({
      variant_id: new FormControl("", [Validators.required]),
      layout_image: new FormControl("", [Validators.required]),
      primary_image: new FormControl("", [Validators.required]),
      layout_imgagefilename:new FormControl(null),
      primary_imagefilename:new FormControl(null),
      vr_link:new FormControl(""),
    });
  }

  pushJobAttributes(createApartmentForm) {
    
    return createApartmentForm.get('formats').push(this.createItem())
  }

  addAnotherVariant(item) {
    
    item.get("variants").push(this.createVariantItem());
  }

  back() {
    this.router.navigate(['/apartment/create']);
  }

  getStates() {
    this.portfolioService.getStateList().subscribe(res => {
      this.states = res.state_list;
    })
  }
  getscityList(id) {
    this.portfolioService.getApartmentCity(id).subscribe(res => {
      this.city_list = res.Cities[id];
    })
  }
  theme: any;
  lifeStage: any;
  getFilterData() {
    this.portfolioService.getFilterData().subscribe(
      res => {
        this.lifeStage = res.lifestage;
        this.theme = res.theme;
      }
    );
  }

  formatData: any;
  getApartmentFormatData() {
    this.portfolioService.getFormatData().subscribe(res => {
      this.formatData = res.format;
    })
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
    console.log( this.attachment_file.name);
    (<HTMLInputElement>document.getElementById(`fileNamePreset${i}${j}`)).value = this.attachment_file.name
    // if((this.attachment_file.size/1024) > 120) {
    //   document.getElementById('errorsize'+i).innerHTML = 'File size should not exceed 120kb.';
    // }
  
    var sec_arr = this.createApartmentForm.get("formats") as FormArray;
    sec_arr.controls[i]["controls"]["variants"].controls[j].controls['layout_imgagefilename'].patchValue(this.attachment_file.name)

    var fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
      var base64;
      var image = new Image();
      image.src = fileReader.result;
      base64 = fileLoadedEvent.target;
      console.log("guijjj",base64.result)
      sec_arr.controls[i]["controls"]["variants"].controls[j].controls['layout_image'].patchValue(base64.result)
      this.basefile2 = base64.result
      this.layoutimg1.push(base64.result);
     
    };
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
    (<HTMLInputElement>document.getElementById(`fileNamePresetone${i}${j}`)).value = this.attachment_file2.name
    var sec_arr = this.createApartmentForm.get("formats") as FormArray;
    sec_arr.controls[i]["controls"]["variants"].controls[j].controls['primary_imagefilename'].patchValue(this.attachment_file2.name)
    var fileReader = new FileReader();

     
      fileReader.onload = (fileLoadedEvent) => {
        var base64;
        var image = new Image();
        image.src = fileReader.result;
        base64 = fileLoadedEvent.target;
        console.log("guijjj",base64.result)
        sec_arr.controls[i]["controls"]["variants"].controls[j].controls['primary_image'].patchValue(base64.result)
      };

   

   
    fileReader.readAsDataURL(this.attachment_file2);
    
    console.log(sec_arr);
  }


  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }

  msgError: boolean = false;
  errorMessage: string;
  successError: boolean = false;
  successMessage: string;
  onSubmit(data) {
    window.scrollTo(0,0); 
    console.log("Create Apartement Data", data);
    var arr = this.basefile;
    var arr2 = this.basefile2;
    data.unid = data.unid.toUpperCase()
    // For inserting Layput and rpimary img into 1 format 
    
    this.loaderService.display(true);
    this.portfolioService.createApartment(data).subscribe(res => {
      console.log(res);
    
      this.successMessage = "Apartment Added Successfully !!!";
      this.successMessageShow(this.successMessage);
      this.createApartmentForm.reset();
      this.CreateForm();
      this.loaderService.display(false);
      setTimeout(
        function () {
          this.router.navigateByUrl('/apartment/create');
        }.bind(this),
        300
      );

     

     

    },

        error => {
          this.errorMessageShow(JSON.parse( error['_body']).message);
          setTimeout(
            function () {
              this.router.navigateByUrl('/apartment/create');
            }.bind(this),
            700
          );
    
      this.loaderService.display(false);
        })
  }

  
  errorMessageShow(msg) {
    this.msgError = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.msgError = false;
      }.bind(this),
      2000
    );
  }
  successMessageShow(msg) {
    this.successError = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successError  = false;
      }.bind(this),
      2000
    );
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
  DeveloperName;
  pincodePro ='';
  FullAdress;
  citynamePro;
  othersShow = false;
  selectOption(address){
    this.Typeselect = address
    if(address == 'other'){
      this.createApartmentForm.controls['apartment_address'].setValue('');
      this.createApartmentForm.controls['city'].setValue('');
      this.createApartmentForm.controls['pincode'].setValue('');
      this.createApartmentForm.controls['apartment_id'].setValue('');
      this.createApartmentForm.controls['state'].setValue('');
      this.filteredOptions =[];
      this.projectName =  this.createApartmentForm.controls['apartment_name'].value;
      this.DeveloperName = '';
      this.pincodePro ='';
      this.FullAdress ='';
      this.citynamePro ='';
      $('#citygoogle').val('');
      $('#pincodegoogle').val('')


      $('#OtherProjectname').modal('show');
      this.initMap()

    } else{
      this.createApartmentForm.controls['apartment_address'].setValue(address.address);
      this.createApartmentForm.controls['city'].setValue(address.city);
      this.createApartmentForm.controls['pincode'].setValue(address.pincode);
      this.createApartmentForm.controls['apartment_name'].setValue(address.apartment_name );
      this.createApartmentForm.controls['state'].setValue(address.state);
      let apar_id ;
      if(address.configuration.length>0){
        apar_id = address.configuration[0].apartment_id
      } else{
        apar_id =address.id
      }
      this.createApartmentForm.controls['apartment_id'].setValue(apar_id);
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
  this.createApartmentForm.controls['apartment_address'].setValue($('#areaname').val());
  this.createApartmentForm.controls['city'].setValue($('#citygoogle').val());
  this.createApartmentForm.controls['pincode'].setValue($('#pincodegoogle').val());
  this.createApartmentForm.controls['apartment_name'].setValue(this.projectName);
  this.createApartmentForm.controls['state'].setValue($('#state').val());
  
  if(this.Typeselect == 'other'){
    this.CreateApartment()
  }
}
showPopup = false;
CreateApartment(){
  let address = this.createApartmentForm.controls['apartment_address'].value;
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
    "pincode": this.createApartmentForm.controls['pincode'].value,
    "area_name":$('#areaname').val(),
    "city": this.createApartmentForm.controls['city'].value,
    "state": ""
}
   this.leadService.CreateApar(obj).subscribe(Res=>{
    this.createApartmentForm.controls['apartment_id'].setValue(Res.result[0].apartment_id)

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


ToUpper(){
  $('#UNID').val( $('#UNID').val().toUpperCase())
}
 
}