import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Routes, RouterModule , Router,ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from 'app/services/loader.service';
import { LeadService } from '../lead.service';
declare var $: any;


@Component({
  selector: 'app-first-meeting-cs',
  templateUrl: './first-meeting-cs.component.html',
  styleUrls: ['./first-meeting-cs.component.scss']
})
export class FirstMeetingCsComponent implements OnInit {

  bedroomForm: FormGroup;
  bathroomForm :FormGroup

  constructor(private fb: FormBuilder,
    public leadService : LeadService,
    public activatedRoute: ActivatedRoute,
    private loaderService: LoaderService) {
   
  }
  lead_id;
  project_id

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params['leadId'];});
    this.fetchBasicDetails(); 
    this.CreateForm()

  }

  fetchBasicDetails(){
  
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        
        this.project_id= res.lead.project_details.id
        console.log(this.project_id,res);
        this.GetQuestionireDetails()
      },
      err => { 
      }
    );
  }

CreateForm(){
  this.bedroomForm = this.fb.group({
    project_id :[this.project_id],
    kids_bedroom_required: ['',Validators.required],
    boys: false,
    girls: false,
    boy_kids_count: [''],
    girl_kids_count: [''],
    additional_comments: ['', Validators.maxLength(300)],
    master_bedroom_bed_required: [''],
    master_bedroom_bed_sku: [''],
    kids_bedroom_bed_required: [''],
    kids_bed_count: [''],
    guest_bedroom_bed_required: [''],
    guest_bedroom_bed_sku: [''],
    parents_bedroom_bed_required: [''],
    parents_bedroom_bed_sku: [''],
    is_submitted: [true],
    created_by : [''],
    kids_age: this.fb.group({
      boy1: [''],
      boy2: [''],
      boy3: [''],
      boy4: [''],
      boy5: [''],
      girl1:[''],
      girl2: [''],
      girl3: [''],
      girl4: [''],
      girl5: ['']
    }),
   

  });
}
erroralert: any;
errorMessage;
successError
successalert;
successMessage
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
  this.successError = true;
  this.successMessage = msg;
  setTimeout(
    function () {
      this.successError = false;
    }.bind(this),
    4000
  );
}
 SubmitCsform(){



   this.bedroomForm.controls['project_id'].setValue(this.project_id)
   this.bedroomForm.controls['created_by'].setValue(localStorage.getItem('userId'));
   console.log(this.bedroomForm.value)
   let data = this.bedroomForm.value;

   if(data.kids_bedroom_required !='yes'){
     console.log("hi")
    data.boy_kids_count = ''
    data.girl_kids_count = ''
    data.kids_age = {
      boy1 :'',
      boy2 :'',
      boy3 :'',
      boy4 :'',
      boy5 :'',
      girl1 :'',
      girl2 :'',
      girl3 :'',
      girl4 :'',
      girl5 :'',

    }
   }
   if(data.boy_kids_count == '1'){
    data.kids_age.boy2 =''
    data.kids_age.boy3 =''
    data.kids_age.boy4 =''
    data.kids_age.boy5 =''
  } else if(data.boy_kids_count == '2'){
    data.kids_age.boy3 =''
    data.kids_age.boy4 =''
    data.kids_age.boy5 =''
  } else if(data.boy_kids_count == '3'){
    data.kids_age.boy4 =''
    data.kids_age.boy5 =''
  } else if(data.boy_kids_count == '4'){
    data.kids_age.boy5 =''
  }
  if(data.girl_kids_count == '1'){
    data.kids_age.girl2 =''
    data.kids_age.girl3 =''
    data.kids_age.girl4 =''
    data.kids_age.girl5 =''
  } else if(data.girl_kids_count == '2'){
    data.kids_age.girl3 =''
    data.kids_age.girl4 =''
    data.kids_age.girl5 =''
  } else if(data.girl_kids_count == '3'){
    data.kids_age.girl4 =''
    data.kids_age.girl5 =''
  } else if(data.girl_kids_count == '4'){
    data.kids_age.girl5 =''
  }
   const formattedData = {
    ...data,  
    "kids_age": Object.entries(data.kids_age)
      .filter(([key, value]) => value !== "")
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {})
  };
  const parsedKidsAge = {};
  for (const key in formattedData.kids_age) {
    if (data.kids_age.hasOwnProperty(key)) {
      const value = data.kids_age[key];
      parsedKidsAge[key] = parseInt(value, 10);
    }
  }

  formattedData.kids_age = parsedKidsAge;
  formattedData.kids_bedroom_required = formattedData.kids_bedroom_required == 'yes'?true:false;
  formattedData.kids_bed_count = formattedData.kids_bed_count != '' && formattedData.kids_bed_count?parseInt(formattedData.kids_bed_count):''
  formattedData.boy_kids_count = formattedData.boy_kids_count != '' && formattedData.boy_kids_count?parseInt(formattedData.boy_kids_count):''
  formattedData.girl_kids_count = formattedData.girl_kids_count != '' && formattedData.girl_kids_count?parseInt(formattedData.girl_kids_count):''

 
  console.log(formattedData,parsedKidsAge);
  let obj ={
    first_meeting_questionnaire :formattedData
  }
  this.loaderService.display(true)
  this.leadService.CreateCsQuestionire(obj,this.project_id).subscribe(res=>{
    this.loaderService.display(false)
    this.successMessageShow('Created Sucessfully');
    this.CreateForm();
    this.GetQuestionireDetails()

  } ,
  err=>{
    this.errorMessageShow(JSON.parse(err["_body"]).message);
    this.loaderService.display(false)
  })

 }

 is_Submited ;
 quetionireDetails 

 GetQuestionireDetails(){
  this.loaderService.display(true)
  this.leadService.questionireDetails(this.project_id).subscribe(res=>{
    this.loaderService.display(false)
    
     this.is_Submited = res.first_meeting_questionnaire.is_submitted
     this.quetionireDetails  = res.first_meeting_questionnaire

  } ,
  err=>{
    this.errorMessageShow(JSON.parse(err["_body"]).message);
    this.loaderService.display(false)
  })

 }
 ReturnObject(obj){

 console.log(obj)
 if(obj){

  const modifiedKidsAge = {};

for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    const modifiedKey = key.slice(0, -1) + " " + key.slice(-1);
    modifiedKidsAge[modifiedKey] = obj[key];
  }
}

  const keysArray = Object.keys(modifiedKidsAge);
console.log(keysArray )

return keysArray
   
 } else{
  return []
 }


 }

 formatobject(obj){
  if(obj){

    const modifiedKidsAge = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const modifiedKey = key.slice(0, -1) + " " + key.slice(-1);
      modifiedKidsAge[modifiedKey] = obj[key];
    }
  }

  return modifiedKidsAge

}

 }

 getBoyKeys() {
  return Object.keys(this.quetionireDetails.kids_age).filter((key) => key.startsWith('boy'));
}
SetBoys(e){


  
}

}
