import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from 'app/platform/lead/lead.service';
import { LoaderService } from 'app/services/loader.service';

@Component({
  selector: 'app-save-lead-store-data',
  templateUrl: './save-lead-store-data.component.html',
  styleUrls: ['./save-lead-store-data.component.css']
})
export class SaveLeadStoreDataComponent implements OnInit {
  leadStoreForm: FormGroup;
  state_list: any;
  city_list: any;
  tag_list: any;
  state_id;
  @Output() sendSubmitLeadStoreEvent : EventEmitter<any> = new EventEmitter();
  @Input() lead_store_id:any;
  @Output() sendCloseEvent : EventEmitter<any> = new EventEmitter();  
  lead_store_details: any;
  stateCode: any;
  selected_state_id: any;

  constructor( private leadService: LeadService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    
    this.getStateList();
    this.getTagType();
    this.leadStoreForm = this.formBuilder.group({
      address: new FormControl('', Validators.required),
      state_id: new FormControl('', Validators.required),
      city_name: new FormControl('',Validators.required),
      store_name: new FormControl('',Validators.required),
      tag_type: new FormControl('',Validators.required),
    });
  }
  ngOnChanges(){
     if(this.lead_store_id){
      this.getLeadStoreDetails();

     }
     
  }

  getStateList(){
    this.leadService.getStateList().subscribe(res=>{
      res= res.json();
      this.state_list = res.state_list;
       
    });
  }
  getCityList(stateCode){
    this.leadService.getCityList(stateCode).subscribe(res=>{
      res= res.json();
      this.city_list = res.Cities[stateCode];
    });    
  }
  getTagType(){
    this.leadService.getTagType().subscribe(res=>{
      res= res.json();
      this.tag_list = res.tag_type;   
    });
  }
  getLeadStoreDetails(){
    this.loaderService.display(true);
    this.leadService.getLeadStoreDetails(this.lead_store_id).subscribe(res=>{
      this.loaderService.display(false);
      res= res.json();   
      this.lead_store_details = res.lead_store; 
      this._updateLeadStoreFormValue() ;
       
    });
  }
  onStateChange(stateEvent){
    this.leadStoreForm.controls.city_name.reset();
    this.selected_state_id = stateEvent;
    this.stateCode = this.state_list.find(x => x.id == stateEvent).state_code;
    this.getCityList(this.stateCode); 
  }
  onCitySelect(cityEvent){
   
  }
  submitLeadStoreDetails(leadStoreFormValue){
    this.leadService.submitLeadStoreDetails(leadStoreFormValue).subscribe(res=>{
      this.sendSubmitLeadStoreEvent.emit('Created');
    });   
  }
  updateLeadStoreDetails(leadStoreFormValue){
    this.leadStoreForm.controls.state_id.reset();
    if(this.selected_state_id){
      this.leadStoreForm.controls.state_id.setValue(this.selected_state_id);
    }else{
      this.leadStoreForm.controls.state_id.setValue(this.lead_store_details.state_id);
    }
    this.leadService.updateLeadStoreDetails(this.leadStoreForm.value,this.lead_store_id).subscribe(res=>{
      this.sendSubmitLeadStoreEvent.emit('Updated');
    });   
  }
  getReplaceChar(tagValue){
    return tagValue.replace(/_/g, ' ');


  }
  compareFunction(item, selected) {
      return item === selected
  }
  private _updateLeadStoreFormValue(){
    Object.keys(this.leadStoreForm.controls).forEach(key => {
      if(key !== 'state_id'){
        this.leadStoreForm.controls[key].setValue(this.lead_store_details[key]);
      }else{
        this.leadStoreForm.controls[key].setValue(this.lead_store_details.state_name.name);
      }
    });
  }
  closeModal(){
    this.lead_store_id = '';
    this.leadStoreForm.reset();
    this.sendCloseEvent.emit();
  }

}
