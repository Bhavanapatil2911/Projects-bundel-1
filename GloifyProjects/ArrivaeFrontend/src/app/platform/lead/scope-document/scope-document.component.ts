import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Routes, RouterModule , Router,ActivatedRoute, Params } from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { AbstractControl, FormControl, FormBuilder, FormArray,FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../../designer/designer.service';
declare var $:any;

@Component({
  selector: 'app-scope-document',
  templateUrl: './scope-document.component.html',
  styleUrls: ['./scope-document.component.css','../first-meeting-cs/first-meeting-cs.component.scss'],
  providers: [LeadService, DesignerService]
})
export class ScopeDocumentComponent implements OnInit {

	successalert;
  successMessage;
  erroralert;
  errorMessage;
  information;
  scopeForm : FormGroup;
  lead_id:any;
  role:any;
  lead_details:any;
  lead_status;
  competition_analysis: FormGroup;
  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public designerService : DesignerService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute
  ) { }
  status_of_property_offices = ['New Property - Warm Shell', 'New Property - Bare Shell', 'New Property - Refurbished',
    'Old Property - Bare Shell', 'Old Property - Warm Shell', 'Old Property - Refurbished'];
  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.initScopeForm();
    this.fetchBasicDetails();
    this.formDatas();
    
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.scopeForm.patchValue({project_id: this.lead_details.project_details.id});
        this.fetchScopeForm();
        this.getSignificantCompetitor();
        this.getCompetitorAnalyses();
        // this.scopeForm.value.project_id = this.lead_details.project_details.id;
        // this.scopeForm.value.client_id = this.lead_details.id;
      },
      err => {
        
      }
    );
  }

  current_scope_form:any = {}
  fetchScopeForm(){
    this.leadService.fetchScopeForm(this.lead_details.project_details.id).subscribe(
      res => {
        if(res){
          this.current_scope_form = res['scope_of_work']
          this.updatePrevForm(this.current_scope_form);
        }
        
      },
      err => {
        this.erroralert = true;
        this.errorMessage = err['statusText']+": "+JSON.parse(err['_body'])['message'];

         // this.errorMessage = JSON.parse(error['_body']).message;
         setTimeout(function() {
            this.erroralert = false;
        }.bind(this), 5000);
        
      });
  }

  updatePrevForm(form){
  for(var i = 0; i < form['scope_spaces'].length; i++){
    this.addNestedSpace(form['scope_spaces'][i].space_type, form['scope_spaces'][i].space_name, form['scope_spaces'][i].id);
    
    for(var j = 0; j < this.scopeForm.value.scope_spaces_attributes[i].scope_qnas_attributes.length; j++){
      for(var k = 0; k < form['scope_spaces'][i]['scope_qnas'].length; k++){
        if(form['scope_spaces'][i]['scope_qnas'][k]['question'] == this.scopeForm.value.scope_spaces_attributes[i].scope_qnas_attributes[j].question){
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['arrivae_scope'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['arrivae_scope']);
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['client_scope'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['client_scope']);
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['remark'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['remark']);
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['id'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['id']);
        }
      }
        
    }
  }
}

  initScopeForm(){
  	this.scopeForm = this.formBuilder.group({
  	  project_id : new FormControl(),
  	  // client_id : new FormControl(),

  	  scope_spaces_attributes: this.formBuilder.array([])
      })
  }

  buildModularKitchen(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("base_unit"),
  	  		this.buildQA("wall_unit"),
  	  		this.buildQA("counter_top"),
  	  		this.buildQA("sink"),
  	  		this.buildQA("kitchen_hob "),
  	  		this.buildQA("kitchen_chimney"),
  	  		this.buildQA("gas_piping"),
  	  		this.buildQA("core_cutting")
  	  	]
  	  )
  	})
  }

  buildServices(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("electrical_point_shifting"),
  	  		this.buildQA("old_granite_demolition"),
  	  		this.buildQA("false_ceiling"),
  	  		this.buildQA("flooring"),
  	  		this.buildQA("painting "),
  	  		this.buildQA("wall_cladding"),
  	  		this.buildQA("dado_tile")
  	  	]
  	  )
  	})
  }

  buildComplimentaryItems(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("air_conditioner"),
  	  		this.buildQA("others")
  	  	]
  	  )
  	})
  }

  buildBoughtOutItems(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("dining_table"),
  	  		this.buildQA("sofa_set"),
  	  		this.buildQA("center_table"),
  	  		this.buildQA("others")
  	  	]
  	  )
  	})
  }

  buildMasterBedRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wardrobe"),
  	  		this.buildQA("loft"),
  	  		this.buildQA("cot"),
  	  		this.buildQA("vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("others"),
  	  	]
  	  )
  	})
  }

  buildKidsBedRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wardrobe"),
  	  		this.buildQA("loft"),
  	  		this.buildQA("cot"),
  	  		this.buildQA("vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("study_table"),
  	  		this.buildQA("others"),
  	  	]
  	  )
  	})
  }

  buildGuestBedRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wardrobe"),
  	  		this.buildQA("loft"),
  	  		this.buildQA("cot"),
  	  		this.buildQA("vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("others"),
  	  	]
  	  )
  	})
  }

  buildLivingRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("crockery_unit"),
  	  		this.buildQA("common_vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("ledge"),
  	  	]
  	  )
  	})
  }

  buildFoyer(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("shoe_rack")
  	  	]
  	  )
  	})
  }

  buildPoojaRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("quartz_/_granite_top"),
  	  		this.buildQA("bells"),
  	  	]
  	  )
  	})
  }

  buildQA(que, id = ""){
  	return new FormGroup({
      id: new FormControl(id),
      question: new FormControl(que),
      arrivae_scope: new FormControl("n/a"),
      client_scope: new FormControl("n/a"),
      remark: new FormControl(),
    })
  }

  space:any = 'modular_kitchen';
  selectSpace(event){
  	this.space = event.target.value;
  }

  addSpace(){
  	this.addNestedSpace(this.space);
  }

  addNestedSpace(space, space_name = "", id = ""){
  	const getFun = this.scopeForm.get('scope_spaces_attributes') as FormArray;

  	if(space == "modular_kitchen"){
  		getFun.push(this.buildModularKitchen(space,space_name,id));
  	}
  	else if(space == "services"){
  		getFun.push(this.buildServices(space,space_name,id));
  	}
  	else if(space == "complimentary_items"){
  		getFun.push(this.buildComplimentaryItems(space,space_name,id));
  	}
  	else if(space == "bought_out_items"){
  		getFun.push(this.buildBoughtOutItems(space,space_name,id));
  	}
  	else if(space == "master_bed_room"){
  		getFun.push(this.buildMasterBedRoom(space,space_name,id));
  	}
  	else if(space == "kids_bed_room"){
  		getFun.push(this.buildKidsBedRoom(space,space_name,id));
  	}
  	else if(space == "guest_bed_room"){
  		getFun.push(this.buildGuestBedRoom(space,space_name,id));
  	}
  	else if(space == "living_room"){
  		getFun.push(this.buildLivingRoom(space,space_name,id));
  	}
  	else if(space == "foyer"){
  		getFun.push(this.buildFoyer(space,space_name,id));
  	}
  	else if(space == "pooja_room"){
  		getFun.push(this.buildPoojaRoom(space,space_name,id));
  	}
  }

  scopeFormSubmit(){
    if(this.current_scope_form && this.current_scope_form.id){
    	this.leadService.scopeFormUpdate(this.scopeForm.value, this.current_scope_form.id).subscribe(
    		res => {
    			alert("Form successfully submitted");
    		},
    		err => {
    			
    			alert("Something went bad. Please try again");
    		});
    }
    else{
      this.leadService.scopeFormSubmit(this.scopeForm.value).subscribe(
        res => {
          alert("Form successfully submitted");
        },
        err => {
          
          alert("Something went bad. Please try again");
        });
    }
  }
 // For Competition Analysis start here
  HasOtherVender='Yes'
  SelectedVal(value){
    this.HasOtherVender=value;
    setTimeout(function() {
      this.setFormValues();
    }.bind(this), 500);
  }
  formDatas(){
    this.competition_analysis= this.formBuilder.group({
      significant_comptitor: new FormControl("",Validators.required),
      approch_vendor: new FormControl("",Validators.required),
      quote: new FormControl("",Validators.required),
      share_design: new FormControl("",Validators.required),
      notes: new FormControl(),
      other_approch_vendor_value: new FormControl(),
      selected_no_notes : new FormControl(),
      extent_connent_discussions: new FormControl(),
      extent_connent_quote: new FormControl(),
      extent_connent_design: new FormControl(),
      other_significant_competitor: new FormControl(),
    });
  }
  localityChangeValue: any;
  changeLocality(event) {
    this.localityChangeValue = event
    if (this.localityChangeValue == "others") {
      document.getElementById("localitybuilding").style.display = 'block';
      $('#localitybuilding').addClass('d-block').removeClass('d-none');
      this.competition_analysis.controls['approch_vendor'].setValue('others');
      this.competition_analysis.controls['other_approch_vendor_value'].setValue(this.lead_competitor.other_approaching_vendor_method ? this.lead_competitor.other_approaching_vendor_method : '');
    }
    else {
      document.getElementById("localitybuilding").style.display = 'none';
      $('#localitybuilding').addClass('d-none').removeClass('d-block');
      this.competition_analysis.controls['other_approch_vendor_value'].setValue("");
    }

  }
  discussions:boolean=false;
  quote:boolean=false;
  design:boolean=false;
  SignificantChangeValue: any;
  changeSignificant(event,sele_value) {
    this.SignificantChangeValue = sele_value;
    if (this.SignificantChangeValue == "Others") {
      document.getElementById("other_significant").style.display = 'block';
      $('#other_significant').show();
      $('#other_significant').addClass('d-block').removeClass('d-none');
      this.competition_analysis.controls['other_significant_competitor'].setValue(this.lead_competitor.other_significant_competitor ? this.lead_competitor.other_significant_competitor : '');
    }
    else { 
      document.getElementById("other_significant").style.display = 'none';
      $('#other_significant').hide();
      $('#other_significant').addClass('d-none').removeClass('d-block');
      this.competition_analysis.controls['other_significant_competitor'].setValue("");
    }
  }
  extent_of_connect(event,value){
    if (event.target.checked) {
     if (value=='discussions') {
       this.discussions=true;
     }
     if (value=='quote') {
       this.quote = true;
     }
     if (value=='design') {
       this.design=true;
    }
    }else{
      this.discussions=false;
      this.quote=false;
      this.design=false;
    }
  }
  lead_competitor:any;
  getCompetitorAnalyses(){
    this.leadService.CompetitorAnalyses(this.lead_id).subscribe(
      res => {
        this.lead_competitor = res.lead_competitor_analysis;
        if (this.lead_competitor ) {
          this.setFormValues();
        }   
        if (this.lead_competitor) {
          if(this.lead_competitor.other_vendor_contacted==true) {
            this.HasOtherVender='Yes';
          }
          if (this.lead_competitor.other_vendor_contacted==false) {
            this.HasOtherVender='No';
          }
        }else{
          this.HasOtherVender='Yes';
          this.information=true;
          setTimeout(function() {
            this.information = false;
          }.bind(this), 4000);
        }
      },
      err => { 
        
      }
    );
  }
  setFormValues(){
    setTimeout(() => {
      if (this.lead_competitor.customer_share_design==true) {
        $("#radio-one").prop('checked',true);
      }else{
        $("#radio-one").prop('checked',false);
        if (this.lead_competitor.customer_share_design==false) {
          $(".uncheck").addClass('noActive');
        }
      }  
    }, 500);
    this.competition_analysis.controls['significant_comptitor'].setValue(this.lead_competitor.significant_competitor);
    this.competition_analysis.controls['approch_vendor'].setValue(this.lead_competitor.approaching_vendor_method);
    this.competition_analysis.controls['quote'].setValue(this.lead_competitor.quote_amount);
    this.competition_analysis.controls['other_significant_competitor'].setValue(this.lead_competitor.other_significant_competitor);
    this.competition_analysis.controls['share_design'].setValue(this.lead_competitor.customer_share_design);
    this.competition_analysis.controls['notes'].setValue(this.lead_competitor.notes);
    this.competition_analysis.controls['other_approch_vendor_value'].setValue(this.lead_competitor.other_approaching_vendor_method);
    this.competition_analysis.controls['selected_no_notes'].setValue(this.lead_competitor.notes);
    this.competition_analysis.controls['extent_connent_discussions'].setValue(this.lead_competitor.discussions_connect);
    this.competition_analysis.controls['extent_connent_quote'].setValue(this.lead_competitor.quote_connect);
    this.competition_analysis.controls['extent_connent_design'].setValue(this.lead_competitor.design_connect);
    this.discussions=this.lead_competitor.discussions_connect;
    this.quote=this.lead_competitor.quote_connect;
    this.design=this.lead_competitor.design_connect;
    if (this.lead_competitor && this.lead_competitor.approaching_vendor_method=='others') {
      document.getElementById("localitybuilding").style.display = 'block';
      $('#localitybuilding').show();
      $('#localitybuilding').addClass('d-block').removeClass('d-none');

    }else{
      document.getElementById("localitybuilding").style.display = 'none';
    }
    if (this.lead_competitor && this.lead_competitor.significant_competitor=='Others') {
      document.getElementById("other_significant").style.display = 'block';
      $('#other_significant').addClass('d-block').removeClass('d-none');
      $('#other_significant').show();
    }else{
      document.getElementById("other_significant").style.display = 'none';
    }
  }
  significant_competitor:any;
  significant_competitor_aaray:any = []
  getSignificantCompetitor(){
    this.loaderService.display(true);
    this.leadService.significant(this.lead_id).subscribe(
      res => { 
        this.significant_competitor = res.valid_significant_competitor;
         for (let key of Object.keys(this.significant_competitor)) {
            this.significant_competitor_aaray.push({
              'key':key,
              'value':this.significant_competitor[key]
            })
          }
          this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }
  sign:any;
  submitCompetitionForm(competitor,competitor_type){
    if (competitor) {
      this.loaderService.display(true);
      this.leadService.submitCompetitionForm(competitor,competitor_type,this.HasOtherVender,this.discussions,this.quote,this.design,this.lead_id,this.role).subscribe(
        res => { 
          this.sign = res;
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "Competitor Analysis Created Successfully";
          this.getCompetitorAnalyses();
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = "Something Went Wrong While Creating Competitor Analysis";
        }
      ); 
    }else{
      this.erroralert = true;
      this.errorMessage = "Note Should Be Entered";
    }
  } 
  compet:any;
  updateCompetitionForm(compet,compet_type){
    if (compet.notes) {
      this.loaderService.display(true);
      this.leadService.updateCompetitionForm(compet,compet_type,this.HasOtherVender,this.discussions,this.quote,this.design,this.lead_id,this.role,this.lead_competitor.id).subscribe(
        res => { 
          this.compet = res;
           this.loaderService.display(false);
           this.getCompetitorAnalyses();
           this.successalert = true;
           this.successMessage = "Competitor Analysis Updated Successfully";
         }, 
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = "Something Went Wrong While Updating Competitor Analysis";
        } 
      );
    }else{
      this.erroralert = true;
      this.errorMessage = "Note Should Be Entered";
    }
  }

}