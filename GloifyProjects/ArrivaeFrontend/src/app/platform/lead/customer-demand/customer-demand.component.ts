import { Component, AfterContentInit,AfterViewInit,ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Routes, RouterModule , Router,ActivatedRoute, Params } from '@angular/router';
import {NgForm} from '@angular/forms';
import { AbstractControl, FormControl, FormBuilder, FormArray,FormGroup, Validators } from '@angular/forms';
import { MasterLineItemComponent } from 'app/platform/category/category/master-line-item/master-line-item.component';
import { LeadService } from '../lead.service';
declare var $: any;



@Component({
  selector: 'app-customer-demand',
  templateUrl: './customer-demand.component.html',
  styleUrls: ['./customer-demand.component.css','../first-meeting-cs/first-meeting-cs.component.scss']
})
export class CustomerDemandComponent implements OnInit{
  submitbutton=true;
  successalert;
  successMessage;
  erroralert;
  errorMessage;
  lead_details: any;  
  project_id:any;
  CustomerDemand :FormGroup;
  checkboxForm :FormGroup;
  kind_of_gatherings :FormArray
  previousDemandForm:FormGroup;
  checkArray: FormArray;
  gatherings: Array<any>=[{id:'Small intimate gatherings-A group of up to 10 people',name: 'Small_intimate_gatherings'},{id:' Extended friends and family-A groups of 10 to 20 people',name: 'Extended_friends_and_family'}];
  familyhobbies:Array<any>=[{id:'Cooking',name: 'Cooking'},{id:'Music',name: 'Music'},{id:'TV/Movies',name: 'TV_Movies'},{id:'Books',name: 'Books'},{id:' Meditation/Yoga/Prayers',name: 'Meditation_Yoga_Prayers'},{id:'Other',name: 'Other'}];
  colours:Array<any>=[{id:"Light",name:"Light"},{id:"Pastel",name:"Pastel"},{id:"Dark",name:"Dark"},{id:"Woddy",name:"Woddy"},{id:"Other",name:"Other"}];
  fabric_preference:Array<any>=[{id:'Leather',name: 'Leather'},{id:'Suede',name: 'Suede'},{id:'Velvet',name: 'Velvet'},{id:'Other',name: 'Other'},];
  fabric_prefer_pattern:Array<any>=[{id:'Prints',name: 'Prints'},{id:'Lines',name: 'Lines'},{id:'Polka Dots',name: 'Polka_Dots'},{id:'Textures',name: 'Textures'},{id:'Other',name: 'Other'},];
  core_material:Array<any>=[{id:'MDF',name: 'MDF'},{id:'HDHMR',name: 'HDHMR'},{id:'Ply',name: 'Ply'}]
  preferredtheme:Array<any>=[{id:'Contemporary',name: 'Contemporary'},{id:'Eclectic',name: 'Eclectic'},{id:'Minimalistic',name: 'Minimalistic'},{id:'Modern',name: 'Modern'},{id:'Rustic',name: 'Rustic'},{id:'Transitional',name: 'Transitional'},];
  wardrobe_type:Array<any>=[{id:'Openable Shutter',name: 'Openable_Shutter'},{id:'Sliding Wardrobe',name: 'Sliding_Wardrobe'},{id:'Openable or Sliding without Loft',name:'Openable_or_Sliding_without_Loft'},{id:'Openable or Sliding with Loft',name:'Openable_or_Sliding_with_Loft'},];
  services_require:Array<any>=[{id:'Flooring',name: 'Flooring'},{id:'Cieling',name: 'Cieling'},{id:'Electrical',name: 'Electrical'},{id:'Painting',name: 'Painting'}];
  wardrobe_parent:Array<any>=[{id:'Openable Shutter',name: 'Openable_Shutter'},{id:'Sliding Wardrobe',name: 'Sliding_Wardrobe'},{id:'Openable or Sliding without Loft',name:'Openable_or_Sliding_without_Loft'},{id:'Openable or Sliding with Loft',name:'Openable_or_Sliding_with_Loft'},];
  services_require_parent:Array<any>=[{id:'Flooring',name: 'Flooring'},{id:'Cieling',name: 'Cieling'},{id:'Electrical',name: 'Electrical'},{id:'Painting',name: 'Painting'}];
  services_require_living:Array<any>=[{id:'Flooring',name: 'Flooring'},{id:'Cieling',name: 'Cieling'},{id:'Electrical',name: 'Electrical'},{id:'Painting',name: 'Painting'}];
  services_require_kids:Array<any>=[{id:'Flooring',name: 'Flooring'},{id:'Cieling',name: 'Cieling'},{id:'Electrical',name: 'Electrical'},{id:'Painting',name: 'Painting'}];
  other_appliances:Array<any>=[{id:'Microwave',name: 'Microwave'},{id:'OTG',name: 'OTG'},{id:'WaterPurifier',name: 'WaterPurifier'},{id:'Dishwasher',name: 'Dishwasher'}];
  units_type:Array<any>=[{id:'Tall Units',name: 'Tall'},{id:'Base Units',name: 'Base'},{id:'Multi-functional Units',name: 'Multifunctional'}];
  
  checkboxes=["Cooking","Music","Meditation_Yoga_Prayers","TV_Movies","Books","Leather","Suede","Velvet","Prints","Lines","Polka Dots","Textures","Light","Pastel","Dark","Woddy"]

  Master_Bedroom=["wardrobe_type","lock_wardrobe","standard_wardrobe","preminum_version","prefer_clothes","jewellery_area","safes","preferred_bed","drawer_storage","children_sleep_u","existing_mattress","size_matters","prefer_matters","night_stands","inconvenience_dressing_table","need_dressing_table","tv_in_bedroom","bay_window","position_air_conditioner","requirement_master_bedroom","core_material_master_bedroom","finish_material_master_bedroom","estimate_master_bedroom","services_require"]
  Parent_Bedroom=["wardrobe_parent","lock_wardrobe_parent","std_wardrobe_parent","preminum_version_parent","safes_parent","bed_height","tv_in_bedroom_parent","position_air_conditioner_parent","core_material_parent","finish_material_parent","estimate_parent","services_require_parent"]
  Kids_BedRoom=["storage_box","storage_require","clothes_type","high_storage_require","wardrobe_kids","bed_type","storage_bed_type","bay_window_kids","position_air_conditioner_kids","desktop_or_laptop","lot_of_books","children_hobbies","colour_prefer","position_bed","boxes_toys","require_wallpaper","study_area","activity_area","plan_another_child","core_material_kids","finish_material_kids","estimate_kids","services_require_kids"]
  Living_Room=["shoe_cabinet","shoe_stool","partition_area_bet_enterance_liv_area","combine_shoecabinet","sofa_position","sofa_shape","tv_size","bay_window_kids","tv_cabinet","multimedia_appliances","open_racks","dining_table_top","dining_size","crockery_unit","core_material_living","finish_material_living","estimate_living","services_require_living","services_description"] 
  Kitchen=["kitchen_type","chef","kitchen_shape","fridge_size","sink_type","gas_connection_type","hob_require","chimney_require","induction_cooktop","other_appliances","socked_require","water_purifier","grains_store","units_type","wicker_basket","washing_machine_near_kitchen","island_cabinet","counter_top","prefer_counter_top","mandir","loft","shade","core_material_kitchen","finish_material_kitchen","estimate_kitchen","services_require_kitchen"] 
  
  checked=[];
  hobbies=[]
  colurs=[]  
  fabric  =[]
  pattern =[]
  core=[]
  theme =[]
  wardtype=[]
  service=[]
  wardrobeParent=[]
  serviceParent=[]
  serviceKids=[]
  serviceLiving=[]
  otherApplience=[]
  units=[]
  serviceKitchen=[]
  OtherHobby:string="cycling";

  touched:any=false;
  living: any=false;
  kids: any=false;
  parents: any=false;
  kitchen: any=false;

constructor(private formBuilder: FormBuilder,
              private renderer: Renderer2,
              private elementRef: ElementRef,
              public leadService : LeadService,
              public activatedRoute: ActivatedRoute,
              ) {   
                  this.initCustomerDemands()

              }

ngOnInit() {

  this.FormIsAt(this.selectedtab)
  this.activatedRoute.params.subscribe((params: Params) => {
    this.lead_id = params['leadId'];});
  this.fetchBasicDetails(); 

}

onCheckboxChange(e,formarrayname ) {
  this.checkArray =this.CustomerDemand.get(formarrayname) as FormArray
    if (e.target.checked) {
      this.checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      this.checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          if(e.target.value=='Other'){
            if(formarrayname=='hobby_with_family'){
              this.CustomerDemand.patchValue({other_hobby:''});    
            }
            else if(formarrayname=='house_colour'){
              this.CustomerDemand.patchValue({other_colour:''});    
            }
            else if(formarrayname=='fabric_preference'){
              this.CustomerDemand.patchValue({other_fabric:''});    
            }
            else if(formarrayname=='fabric_prefer_pattern'){
              this.CustomerDemand.patchValue({other_pattern:''});    
            }
          }
          this.checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }

      this.checked=this.CustomerDemand.get('gathering_type').value
      this.hobbies=this.CustomerDemand.get('hobby_with_family').value
      this.colurs=this.CustomerDemand.get('house_colour').value
      this.fabric=this.CustomerDemand.get('fabric_preference').value
      this.pattern=this.CustomerDemand.get('fabric_prefer_pattern').value
      this.core=this.CustomerDemand.get('core_material').value
      this.theme=this.CustomerDemand.get('preferred_theme').value
      this.wardtype=this.CustomerDemand.get('wardrobe_type').value
      this.service=this.CustomerDemand.get('services_require').value
      this.wardrobeParent=this.CustomerDemand.get('wardrobe_parent').value
      this.serviceParent=this.CustomerDemand.get('services_require_parent').value
      this.serviceKids=this.CustomerDemand.get('services_require_kids').value
      this.serviceLiving=this.CustomerDemand.get('services_require_living').value
      this.otherApplience=this.CustomerDemand.get('other_appliances').value
      this.units=this.CustomerDemand.get('units_type').value
      this.serviceKitchen=this.CustomerDemand.get('services_require_kitchen').value


 }

 OtherAccomadation(){
  console.log(this.CustomerDemand.value.accommodation)
  console.log((this.CustomerDemand.value.accommodation=='Other'))
  if(!(this.CustomerDemand.value.accommodation=='Other')){
  this.CustomerDemand.patchValue({other_accommodation:''});    
  }

 }

fetchBasicDetails(){
  console.log("fetchBasicDetails")
  this.leadService.getLeadLogs(this.lead_id).subscribe(
    res => {
      this.lead_details = res['lead'];
      this.CustomerDemand.patchValue({customer_name:this.lead_details.name});    
      this.CustomerDemand.patchValue({project_id: this.lead_details.project_details.id});
      this.project_id=this.lead_details.project_details.id
      this.fetchcustomerDemandForm(this.project_id);  
    },
    err => { 
    }
  );
}
lead_id(lead_id: any) {
  throw new Error('Method not implemented.');
}
  initCustomerDemands(){
    console.log("initCustomerDemands")

    this.CustomerDemand=this.formBuilder.group({
        project_id:[''],
          customer_name : ['', Validators.required],
          property_name :['',Validators.required],
          accommodation :['',Validators.required],
          other_accommodation:[''],
          carpet_area:[''],
          family_details:['',Validators.required],
          house_help:['',Validators.required],
          house_vastu:['',Validators.required],
          gathering_type:this.formBuilder.array([]),
          hobby_with_family:this.formBuilder.array([]),
          other_hobby:[''],
          pets:['',Validators.required],
          need_pet:[''],
          house_colour:this.formBuilder.array([],Validators.required),
          other_colour:[''],
          colours_dislike:[''],
          fabric_preference:this.formBuilder.array([]),
          other_fabric:[''],
          fabric_prefer_pattern:this.formBuilder.array([]),
          other_pattern:[''],
          existing_furniture:[''],
          core_material:this.formBuilder.array([]),
          finish_material:[''],
          estimate:[''],
          preferred_theme:this.formBuilder.array([]),
//masterbedroom
        wardrobe_type:this.formBuilder.array([]),
        lock_wardrobe:[''],
        standard_wardrobe:[''],
        preminum_version:[''],
        prefer_clothes:[''],
        jewellery_area:[''],
        safes:[''],
        preferred_bed:[''],
        drawer_storage:[''],
        children_sleep_u:[''],
        existing_mattress:[''],
        size_matters:[''],
        prefer_matters:[''],
        night_stands:[''],
        inconvenience_dressing_table:[''],
        need_dressing_table:[''],
        tv_in_bedroom:[''],
        bay_window:[''],
        position_air_conditioner:[''],
        requirement_master_bedroom:[''],
        core_material_master_bedroom:[''],
        finish_material_master_bedroom:[''],
        estimate_master_bedroom:[''],
        services_require:this.formBuilder.array([]),

        //parentbedroom
        wardrobe_parent:this.formBuilder.array([]),
        lock_wardrobe_parent:[''],
        std_wardrobe_parent:[''],
        preminum_version_parent:[''],
        safes_parent:[''],
        bed_height:[''],
        tv_in_bedroom_parent:[''],
        position_air_conditioner_parent:[''],
        core_material_parent:[''],
        finish_material_parent:[''],
        estimate_parent:[''],
        services_require_parent:this.formBuilder.array([]),
//kidsbedroom
        storage_box:[''],
        storage_require:[''],
        clothes_type:[''],
        high_storage_require:[''],
        wardrobe_kids:[''],
        bed_type:[''],
        storage_bed_type:[''],
        bay_window_kids:[''],
        position_air_conditioner_kids:[''],
        desktop_or_laptop:[''],
        lot_of_books:[''],
        children_hobbies:[''],
        colour_prefer:[''],
        position_bed:[''],
        boxes_toys:[''],
        require_wallpaper:[''],
        study_area:[''],
        activity_area:[''],
        plan_another_child:[''],
        core_material_kids:[''],
        finish_material_kids:[''],
        estimate_kids:[''],
        services_require_kids:this.formBuilder.array([]),
//livingroom
        shoe_cabinet:[''],
        shoe_stool:[''],
        partition_area_bet_enterance_liv_area:[''],
        combine_shoecabinet:[''],
        sofa_position:[''],
        sofa_shape:[''],
        tv_size:[''],
        tv_cabinet:[''],
        multimedia_appliances:[''],
        open_racks:[''],
        dining_table_top:[''],
        dining_size:[''],
        crockery_unit:[''],
        core_material_living:[''],
        finish_material_living:[''],
        estimate_living:[''],
        services_require_living:this.formBuilder.array([]),
        services_description:[''],    
      //kitchen
        kitchen_type:[''],
        chef:[''],
        kitchen_shape:[''],
        fridge_size:[''],
        sink_type:[''],
        gas_connection_type:[''],
        hob_require:[''],
        chimney_require:[''],
        induction_cooktop:[''],
        other_appliances:this.formBuilder.array([]),
        socked_require:[''],
        water_purifier:[''],
        grains_store:[''],
        units_type:this.formBuilder.array([]),
        wicker_basket:[''],
        washing_machine_near_kitchen:[''],
        island_cabinet:[''],
        counter_top:[''],
        prefer_counter_top:[''],
        mandir:[''],
        loft:[''],
        shade:[''],
        core_material_kitchen:[''],
        finish_material_kitchen:[''],
        estimate_kitchen:[''],
        services_require_kitchen:this.formBuilder.array([]),

      
    })
  }

  intialform:any ={}
  fetchcustomerDemandForm(projectid){
    console.log("fetchcustomerDemandForm")
    this.leadService.fetchcustomerDemndForm(this.project_id).subscribe(
      res => {
        if(res['customer_demand_form']==null){
          this.submitbutton=true;
        }
        else{
          this.submitbutton=false;
        }
        if(res!=null){
          this.intialform=res['customer_demand_form']
          this.updatecustomerdemandForm(this.intialform)
          this.checktabcolours(this.intialform)

        }
      }
    )

  }

  checktabcolours(form){
    this.Master_Bedroom.forEach((i)=>{
      if(this.CustomerDemand.get(i).value || (this.CustomerDemand.get(i).touched == true) ){
        if((typeof(this.CustomerDemand.get(i).value)== "object")) {
          if(Object.keys(this.CustomerDemand.get(i).value).length > 0){
          this.touched=true; 
          }
        }
        else{
          this.touched=true
        }  
      }    
    })
    // console.log("Living_Room")
    this.Living_Room.forEach((i)=>{
      if(this.CustomerDemand.get(i).value || (this.CustomerDemand.get(i).touched == true) ){
        // console.log((typeof(this.CustomerDemand.get(i).value)))
        if((typeof(this.CustomerDemand.get(i).value)== "object")) {
          if(Object.keys(this.CustomerDemand.get(i).value).length > 0){
          this.living=true; 
          }
        }
        else{
          this.living=true
        }  
      }    
    })
    // console.log("Kitchen")

    this.Kitchen.forEach((i)=>{
      if(this.CustomerDemand.get(i).value || (this.CustomerDemand.get(i).touched == true) ){
        // console.log((typeof(this.CustomerDemand.get(i).value)))
        if((typeof(this.CustomerDemand.get(i).value)== "object")) {
          if(Object.keys(this.CustomerDemand.get(i).value).length > 0){
          this.kitchen=true; 
          }
        }
        else{
          this.kitchen=true
        }  
      }    
    })
    // console.log("Kids_BedRoom")

    this.Kids_BedRoom.forEach((i)=>{
      if(this.CustomerDemand.get(i).value || (this.CustomerDemand.get(i).touched == true) ){
        // console.log((typeof(this.CustomerDemand.get(i).value)))

        if((typeof(this.CustomerDemand.get(i).value)== "object")) {
          if(Object.keys(this.CustomerDemand.get(i).value).length > 0){
          this.kids=true; 
          }
        }
        else{
          this.kids=true
        }  
      }    
    })
    // console.log("Parent_Bedroom")

    this.Parent_Bedroom.forEach((i)=>{
      if(this.CustomerDemand.get(i).value || (this.CustomerDemand.get(i).touched == true) ){
        console.log((typeof(this.CustomerDemand.get(i).value)))
        if((typeof(this.CustomerDemand.get(i).value)== "object")) {
          if(Object.keys(this.CustomerDemand.get(i).value).length > 0){
          this.parents=true; 
          }
        }
        else{
          this.parents=true
        }  
      }    
    })
  
  }

  customerDemandFormSubmit(){
    console.log("i am submitting")
    this.checktabcolours(this.intialform)
    console.log(this.CustomerDemand.value)
    this.leadService.customerDemandFormSubmit(this.CustomerDemand.value,this.project_id).subscribe(
      res => {
        console.log(res)
        this.showSuccessMessage("Form is updated successfully")
      }
    )
    console.log(this.submitbutton)
    if(this.selectedtab=='kitchen'){
      this.submitbutton=false
    }
    this.FormIsAt('customer_info')
   
  }

  updatecustomerdemandForm(form){
    console.log(" updatecustomerdemandForm")
      console.log(this.CustomerDemand)
    this.CustomerDemand.patchValue({project_id: form['project_id']});                   
    this.CustomerDemand.patchValue({customer_name:form['customer_name']});    
    this.CustomerDemand.patchValue({property_name: form['property_name']});    
    this.CustomerDemand.patchValue({accommodation: form['accommodation']}); 
    this.CustomerDemand.patchValue({other_accommodation: form['other_accommodation']});
   
    this.CustomerDemand.patchValue({carpet_area: form['carpet_area']});    
    this.CustomerDemand.patchValue({family_details: form['family_details']});    
    this.CustomerDemand.patchValue({house_help: form['house_help']});    
    this.CustomerDemand.patchValue({house_vastu: form['house_vastu']});

    let myFormArray: FormArray = this.CustomerDemand.get('gathering_type') as FormArray;
    form['gathering_type'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });
    this.checked=form['gathering_type']  ;

    myFormArray = this.CustomerDemand.get('hobby_with_family') as FormArray;
    form['hobby_with_family'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });
    this.hobbies=form['hobby_with_family']  ;
    this.CustomerDemand.patchValue({other_hobby: form['other_hobby']});

    this.CustomerDemand.patchValue({pets: form['pets']});    
    this.CustomerDemand.patchValue({need_pet:form['need_pet']});    

    myFormArray = this.CustomerDemand.get('house_colour') as FormArray;
    form['house_colour'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });
    this.colurs=form['house_colour']  ;  

    this.CustomerDemand.patchValue({other_colour: form['other_colour']});
    this.CustomerDemand.patchValue({colours_dislike: form['colours_dislike']});    

    myFormArray = this.CustomerDemand.get('fabric_preference') as FormArray;
    form['fabric_preference'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });
    this.fabric=form['fabric_preference']  ; 

    this.CustomerDemand.patchValue({other_fabric: form['other_fabric']});    

    myFormArray = this.CustomerDemand.get('fabric_prefer_pattern') as FormArray;
    form['fabric_prefer_pattern'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    }); 
    this.pattern=form['fabric_prefer_pattern']  ; 

    this.CustomerDemand.patchValue({other_pattern: form['other_pattern']});    

    this.CustomerDemand.patchValue({existing_furniture: form['existing_furniture']});  

    this.CustomerDemand.patchValue({core_material:form['core_material']});   
    myFormArray = this.CustomerDemand.get('core_material') as FormArray;
    form['core_material'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    }); 
    this.core=form['core_material']  ; 

    this.CustomerDemand.patchValue({finish_material: form['finish_material']});    
    this.CustomerDemand.patchValue({estimate: form['estimate']});   

    myFormArray = this.CustomerDemand.get('preferred_theme') as FormArray;
    form['preferred_theme'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    }); 
    this.theme=form['preferred_theme']  ;   

    myFormArray = this.CustomerDemand.get('wardrobe_type') as FormArray;
    form['wardrobe_type'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.wardtype=form['wardrobe_type']  ;

    this.CustomerDemand.patchValue({lock_wardrobe: form['lock_wardrobe']});    
    this.CustomerDemand.patchValue({standard_wardrobe: form['standard_wardrobe']});    
    this.CustomerDemand.patchValue({preminum_version: form['preminum_version']});    
    this.CustomerDemand.patchValue({prefer_clothes: form['prefer_clothes']});    
    this.CustomerDemand.patchValue({jewellery_area: form['jewellery_area']});    
    this.CustomerDemand.patchValue({safes: form['safes']});    
    this.CustomerDemand.patchValue({preferred_bed: form['preferred_bed']});    
    this.CustomerDemand.patchValue({drawer_storage: form['drawer_storage']});    
    this.CustomerDemand.patchValue({children_sleep_u: form['children_sleep_u']});    
    this.CustomerDemand.patchValue({existing_mattress: form['existing_mattress']});    
    this.CustomerDemand.patchValue({size_matters: form['size_matters']});    
    this.CustomerDemand.patchValue({prefer_matters: form['prefer_matters']});    
    this.CustomerDemand.patchValue({night_stands: form['night_stands']});    
    this.CustomerDemand.patchValue({inconvenience_dressing_table:form['inconvenience_dressing_table']});    
    this.CustomerDemand.patchValue({need_dressing_table:form['need_dressing_table']});    
    this.CustomerDemand.patchValue({tv_in_bedroom:form['tv_in_bedroom']});    
    this.CustomerDemand.patchValue({bay_window: form['bay_window']});    
    this.CustomerDemand.patchValue({position_air_conditioner:form['position_air_conditioner']});    
    this.CustomerDemand.patchValue({requirement_master_bedroom: form['requirement_master_bedroom']});    
    this.CustomerDemand.patchValue({core_material_master_bedroom: form['core_material_master_bedroom']});    
    this.CustomerDemand.patchValue({finish_material_master_bedroom:form['finish_material_master_bedroom']});    
    this.CustomerDemand.patchValue({estimate_master_bedroom: form['estimate_master_bedroom']}); 

    myFormArray = this.CustomerDemand.get('services_require') as FormArray;
    form['services_require'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.service=form['services_require']  ; 

    myFormArray = this.CustomerDemand.get('wardrobe_parent') as FormArray;
    form['wardrobe_parent'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.wardrobeParent=form['wardrobe_parent']  ;   

    this.CustomerDemand.patchValue({lock_wardrobe_parent: form['lock_wardrobe_parent']});    
    this.CustomerDemand.patchValue({std_wardrobe_parent:form['std_wardrobe_parent']});    
    this.CustomerDemand.patchValue({preminum_version_parent:form['preminum_version_parent']});    
    this.CustomerDemand.patchValue({safes_parent:form['safes_parent']});    
    this.CustomerDemand.patchValue({family_details:form['family_details']});    
    this.CustomerDemand.patchValue({bed_height: form['bed_height']});    
    this.CustomerDemand.patchValue({tv_in_bedroom_parent: form['tv_in_bedroom_parent']});    
    this.CustomerDemand.patchValue({position_air_conditioner_parent: form['position_air_conditioner_parent']});    
    this.CustomerDemand.patchValue({core_material_parent: form['core_material_parent']});    
    this.CustomerDemand.patchValue({finish_material_parent: form['finish_material_parent']});    
    this.CustomerDemand.patchValue({estimate_parent: form['estimate_parent']});    

    myFormArray = this.CustomerDemand.get('services_require_parent') as FormArray;
    form['services_require_parent'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.serviceParent=form['services_require_parent']  ; 

    this.CustomerDemand.patchValue({storage_box:form['storage_box']});    
    this.CustomerDemand.patchValue({storage_require: form['storage_require']});    
    this.CustomerDemand.patchValue({clothes_type:form['clothes_type']});    
    this.CustomerDemand.patchValue({high_storage_require: form['high_storage_require']});    
    this.CustomerDemand.patchValue({wardrobe_kids: form['wardrobe_kids']});    
    this.CustomerDemand.patchValue({bed_type:form['bed_type']});    
    this.CustomerDemand.patchValue({storage_bed_type: form['storage_bed_type']});    
    this.CustomerDemand.patchValue({bay_window_kids: form['bay_window_kids']});    
    this.CustomerDemand.patchValue({position_air_conditioner_kids: form['position_air_conditioner_kids']});    
    this.CustomerDemand.patchValue({desktop_or_laptop: form['desktop_or_laptop']});    
    this.CustomerDemand.patchValue({lot_of_books: form['lot_of_books']});    
    this.CustomerDemand.patchValue({children_hobbies:form['children_hobbies']});    
    this.CustomerDemand.patchValue({colour_prefer: form['colour_prefer']});    
    this.CustomerDemand.patchValue({position_bed: form['position_bed']});    
    this.CustomerDemand.patchValue({boxes_toys:form['boxes_toys']});    
    this.CustomerDemand.patchValue({require_wallpaper: form['require_wallpaper']});    
    this.CustomerDemand.patchValue({study_area:form['study_area']});    
    this.CustomerDemand.patchValue({activity_area:form['activity_area']});    
    this.CustomerDemand.patchValue({plan_another_child:form['plan_another_child']});    
    this.CustomerDemand.patchValue({core_material_kids:form['core_material_kids']});    
    this.CustomerDemand.patchValue({finish_material_kids:form['finish_material_kids']});    
    this.CustomerDemand.patchValue({estimate_kids: form['estimate_kids']});    

    myFormArray = this.CustomerDemand.get('services_require_kids') as FormArray;
    form['services_require_kids'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });
    this.serviceKids=form['services_require_kids']  ; 

    this.CustomerDemand.patchValue({shoe_cabinet:form['shoe_cabinet']});    
    this.CustomerDemand.patchValue({shoe_stool: form['shoe_stool']});    
    this.CustomerDemand.patchValue({partition_area_bet_enterance_liv_area:form['partition_area_bet_enterance_liv_area']});    
    this.CustomerDemand.patchValue({combine_shoecabinet: form['combine_shoecabinet']});    
    this.CustomerDemand.patchValue({sofa_position: form['sofa_position']});    
    this.CustomerDemand.patchValue({sofa_shape:form['sofa_shape']});    
    this.CustomerDemand.patchValue({tv_size: form['tv_size']});    
    this.CustomerDemand.patchValue({tv_cabinet: form['tv_cabinet']});    
    this.CustomerDemand.patchValue({multimedia_appliances: form['multimedia_appliances']});    
    this.CustomerDemand.patchValue({open_racks:form['open_racks']});    
    this.CustomerDemand.patchValue({dining_table_top: form['dining_table_top']});    
    this.CustomerDemand.patchValue({dining_size: form['dining_size']});    
    this.CustomerDemand.patchValue({crockery_unit: form['crockery_unit']});    
    this.CustomerDemand.patchValue({core_material_living: form['core_material_living']});    
    this.CustomerDemand.patchValue({finish_material_living: form['finish_material_living']});    
    this.CustomerDemand.patchValue({estimate_living:form['estimate_living']});    

    myFormArray = this.CustomerDemand.get('services_require_living') as FormArray;
    form['services_require_living'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.serviceLiving=form['services_require_living']  ;   

    this.CustomerDemand.patchValue({services_description: form['services_description']});    
    this.CustomerDemand.patchValue({kitchen_type:form['kitchen_type']});    
    this.CustomerDemand.patchValue({chef: form['chef']});    
    this.CustomerDemand.patchValue({kitchen_shape: form['kitchen_shape']});    
    this.CustomerDemand.patchValue({fridge_size: form['fridge_size']});    
    this.CustomerDemand.patchValue({sink_type: form['sink_type']});    
    this.CustomerDemand.patchValue({gas_connection_type: form['gas_connection_type']});    
    this.CustomerDemand.patchValue({hob_require: form['hob_require']});    
    this.CustomerDemand.patchValue({chimney_require:form['chimney_require']});    
    this.CustomerDemand.patchValue({induction_cooktop: form['induction_cooktop']}); 

    myFormArray = this.CustomerDemand.get('other_appliances') as FormArray;
    form['other_appliances'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.otherApplience=form['other_appliances']  ;

    this.CustomerDemand.patchValue({socked_require: form['socked_require']});    
    this.CustomerDemand.patchValue({water_purifier:form['water_purifier']});    
    this.CustomerDemand.patchValue({grains_store:form['grains_store']});  

    myFormArray = this.CustomerDemand.get('units_type') as FormArray;
    form['units_type'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });  
    this.units=form['units_type']  ; 

    this.CustomerDemand.patchValue({wicker_basket: form['wicker_basket']});    
    this.CustomerDemand.patchValue({washing_machine_near_kitchen: form['washing_machine_near_kitchen']});    
    this.CustomerDemand.patchValue({island_cabinet: form['island_cabinet']});    
    this.CustomerDemand.patchValue({counter_top:form['counter_top']});    
    this.CustomerDemand.patchValue({prefer_counter_top: form['prefer_counter_top']});    
    this.CustomerDemand.patchValue({mandir: form['mandir']});    
    this.CustomerDemand.patchValue({loft:form['loft']});    
    this.CustomerDemand.patchValue({shade:form['shade']});    
    this.CustomerDemand.patchValue({core_material_kitchen: form['core_material_kitchen']});    
    this.CustomerDemand.patchValue({finish_material_kitchen:form['finish_material_kitchen']});    
    this.CustomerDemand.patchValue({estimate_kitchen: form['estimate_kitchen']});   

    myFormArray = this.CustomerDemand.get('services_require_kitchen') as FormArray;
    form['services_require_kitchen'].forEach((value) => {
      myFormArray.push(this.formBuilder.control(value));
    });      
    this.serviceKitchen=form['services_require_kitchen']  ; 
  }


  formtabs=['customer_info','master_bedroom','parents_room','kids_bedroom','living_room','kitchen'];
  selectedtab:any='customer_info';
  tabcount:any=0;

  Activatebutton(prevtab,activtab){
    // const element = this.elementRef.nativeElement.querySelector('#'+prevtab);
    // this.renderer.removeClass(element, 'active');
    // const element2 = this.elementRef.nativeElement.querySelector('#'+activtab);
    // this.renderer.addClass(element2, 'active');

  }

  FormIsAt(tab){

    const prevtab=this.selectedtab
    this.selectedtab=tab
    this.Activatebutton(prevtab,this.selectedtab)
    this.tabcount=this.formtabs.indexOf(this.selectedtab)
    console.log(this.CustomerDemand)
    this.checktabcolours(this.intialform)


  }

  gotonext(){
    this.leadService.customerDemandFormSubmit(this.CustomerDemand.value,this.project_id).subscribe(
      res => {
        console.log(res)
      },
      err =>{
      }
    )
    const prevtab=this.selectedtab
    this.tabcount=this.tabcount+1;
    this.selectedtab=this.formtabs[this.tabcount]
    this.Activatebutton(prevtab,this.selectedtab)
    this.FormIsAt(this.selectedtab)
    this.checktabcolours(this.intialform)

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

  draftedform :any={}
  saveasdraft(){
    this.intialform=this.CustomerDemand.value
    this.leadService.customerDemandFormSubmit(this.CustomerDemand.value,this.project_id).subscribe(
      res => {
        console.log(res)
        this.showSuccessMessage("Form is saved as a draft ");
      },
      err =>{
      }
    )
    this.checktabcolours(this.intialform)
    console.log(this.draftedform)
  }
  

  isActive(tab: string): boolean {
    return this.selectedtab === tab;
  }
  
  isCompleted(tab: string): boolean {
    // A tab is completed if it appears before the selected tab
    return this.formtabs.indexOf(tab) < this.formtabs.indexOf(this.selectedtab);
  }
}
