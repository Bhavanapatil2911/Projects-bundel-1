import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { SalesManagerService } from '../sales-manager.service';
import {LeadService} from '../../lead/lead.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import {Location} from '@angular/common';
import { FormControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators } from '@angular/forms';
// import {LeadquestionnaireComponent} from '../../../../shared/leadquestionnaire/leadquestionnaire.component';
declare var $:any;
declare var google :any

@Component({
  selector: 'app-sales-lead-mgmt',
  templateUrl: './sales-lead-mgmt.component.html',
  styleUrls: ['./sales-lead-mgmt.component.css'],
  providers: [SalesManagerService,LeadService]
})
export class SalesLeadMgmtComponent implements OnInit {
	@ViewChild('attachmentFileInput') attachmentFileInput: ElementRef;
	lead_campaigns;
	lead_sources;
	lead_types;
	search;
	headers_res;
	per_page;
	total_page;
	current_page;
	page_number;
	source=[];
	lead_statusArr=[];
	lead_type_idArr=[];
	lead_source_idArr=[];
	lead_referrer_list=[];
	lead_campaign_idArr=[];
	csagents_idArr=[];
	filteredLeads=[];
	from_date;
	to_date;
	column_name='created_at';
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
	role;
	role2;
	addLeadForm:FormGroup;
	updateLeadForm:FormGroup;
	sales_id;
	sourceOfBulkLeads="";
	typeOfBulkLeads="";
	campignOfBulkLeads="";
	referrer_type="";
	lead_status;
	lead_type;
	lead_type_id;
	breadcrumval:any;
	referrer_type_id;
	referreresList:any = [];
	filteredLeadsloader 

	lostReasonsArr = [
		"low_budget",
		"non_serviceable_area",
		"language_barrier",
		"no_requirement",
		"not_interested",
		"low_scope",
		"already_given_to_another_vendor",
		"wrong_number",
		"did_not_enquire",
		"enquired_by_mistake",
		"casual_enquiry",
		"only_want_designs",
		"heavy_civil_(services)_work",
		"only_civil_(services)_work",
		"others",
	  ];
	salesmanagerId: any;

  constructor(
  	private route:ActivatedRoute,
	private leadService:LeadService,
	private salesService: SalesManagerService,
	private loaderService:LoaderService,
	private formBuilder:FormBuilder,
	public router:Router, 
	public location:Location,
	


  	) { }

  ngOnInit() {
  	this.sales_id =localStorage.getItem('userId');
	  this.role2 = localStorage.getItem('user');
  	this.route.queryParams.subscribe(params => {
			this.lead_status = params['lead_status'];
			this.lead_type = params['lead_type'];
			this.lead_type_id = params['id'];
			this.referrer_type_id = params['referrer_type'];
			this.to_date = params['to_date'];
			this.from_date = params['from_date'];
			

		});
  	if(this.lead_status !=undefined){
			this.breadcrumval = this.lead_status;
			this.lead_statusArr.push(this.lead_status);
			this.dropdownSettings2["text"] = this.lead_status.replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
			this.dropdownSettings2["disabled"]=true;
		}
	if(this.lead_type !=undefined){
			this.breadcrumval = this.lead_type;
			if(this.lead_type_id !=undefined){
				this.lead_type_idArr.push(this.lead_type_id);
			}
			this.dropdownSettings["text"] = this.lead_type;
			this.dropdownSettings["disabled"]=true;
			//this.selectedItems.push({id:this.lead_type_id,itemName:this.lead_type});
		}	

  	
  	this.addLeadForm = this.formBuilder.group({
		name : new FormControl("",Validators.required),
		// email : new FormControl("",[Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]),
		email : ["" , [Validators.required , Validators.email]],
		contact : new FormControl("",[Validators.required]),
		pincode : new FormControl(""),
		// lead_type_id : new FormControl("",Validators.required),
		lead_source_id : new FormControl("",Validators.required),
		lead_campaign_id:new FormControl(""),
		referrer_id: new FormControl(),
		instagram_handle: new FormControl(""),
		lead_type_name:new FormControl(),
		lead_source_type:new FormControl(),
		referrer_type:new FormControl(),
		city: new FormControl(""),
		new_city_value: new FormControl(""),
		society : new FormControl('', Validators.required ),
		new_society_value : new FormControl(''),
		location : new FormControl(''),
		new_locality_value : new FormControl(''),
		send_to_cs_agent :  new FormControl(true),
		building_crawler_id : new FormControl(''),
		lead_screen : new FormControl('sales_manager'),
		sales_manager_id : new FormControl(),
		aide_apartment_id:new FormControl()
		});
  	this.updateLeadForm = this.formBuilder.group({
			id:new FormControl(""),
			name : new FormControl("",Validators.required),
			email : ["" , [Validators.required , Validators.email]],
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			// lead_type_id : new FormControl("",Validators.required),
	        lead_source_id : new FormControl(""),
	        referrer_id: new FormControl(),
	       lead_campaign_id:new FormControl(""),
	       lead_status : new FormControl(""),
		    follow_up_time : new FormControl(""),
		    remark: new FormControl(""),
		    lost_remark : new FormControl(""),
		    lost_reason: new FormControl(""),
		    instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl(),
		  lead_cv:new FormControl(),
		  lead_source_type:new FormControl(),
		   referrer_type:new FormControl(),

		   city: new FormControl(""),
		   new_city_value: new FormControl(""),
 
		   society : new FormControl('', Validators.required ),
		   new_society_value : new FormControl(''),
 
		   location : new FormControl('' ),
		   new_locality_value : new FormControl(''),
 
		   send_to_cs_agent :  new FormControl(),
		   building_crawler_id : new FormControl(''),
		   lead_screen : new FormControl('sales_manager'),
		   sales_manager_id : new FormControl(),
		   aide_apartment_id:new FormControl()

		});

		

    this.getFiletredLeadsForSales(1);
  	this.loader()
  }
  loader(){
	this.getFiltersData();
  	this.getReferListForSelect();
  	this.getReferrersList();
	this.getCitiesForQuestionnaire()
	this.getCmList()
	this.listAllSalesManager()
  }
  dropdownList = [];
    dropdownList2=[];
    dropdownList3=[];
    dropdownList4=[];
    dropdownList5=[];
    dropdownList6=[{"id":"created_at","itemName":"Acquisition Date"},{"id":"status_updated_at","itemName":"Status Updated Date"}];

    selectedItems = [];
    selectedItems2=[];
    selectedItems3 = [];
    selectedItems4=[];
    selectedItems5=[];
	selectedItems6=[{"id":"created_at","itemName":"Acquisition Date"}];

    dropdownSettings6 ={
    	singleSelection: true,
	  	// text:" Acquisition Date",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings = {
	  singleSelection: false,
	  text: "Lead Type",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
    };
    dropdownSettings5 ={
    	singleSelection: false,
	  	text:"CS Agent",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings4 ={
    	singleSelection: false,
	  	text:"Campaign",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings3 ={
    	singleSelection: false,
	  	text:"Lead Source ",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings2 ={
    	singleSelection: false,
	  	text:  "Status" ,
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown",

    }
    search_value;
    onKey(event: any) { // without type info
      this.search_value = event.target.value ;
      var  i=0;
      if(true){
        this.getFiletredLeadsForSales('',this.search_value);
        i++;
      }
    }
    getReferListForSelect(){
		this.loaderService.display(true)
    	this.salesService.getReferListForSelect(this.sales_id).subscribe(
    		res=>{
    			
    			this.lead_referrer_list = res['referral_roles'];


    		},
    		err=>{
				this.loaderService.display(false)
    		})
    }
    getFiltersData(){
		this.loaderService.display(true)
		this.leadService.getFiltersData().subscribe(
			res =>{
				res = res.json();
				
				this.lead_campaigns = res.lead_campaign_id_array
				this.lead_sources= res.lead_source_id_array;
				this.lead_sources = this.lead_sources.filter( e => e.name !== 'referral' )
				
				//this.lead_status=res.lead_status_array
				this.lead_types=	res.lead_type_id_array
				// this.csagentsArr = res.cs_agent_list;

				for(var i=0;i<res.lead_type_id_array.length;i++){
					var obj = {
						"id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList.push(obj);
				}
				for(var i=0;i<res.lead_status_array.length;i++){
					var obj = {
						"id":<any>i,"itemName":res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList2.push(obj);

				}
				for(var i=0;i<res.lead_source_id_array.length;i++){
					var obj = {
						"id":res.lead_source_id_array[i].id,"itemName":res.lead_source_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList3.push(obj);
				}
				for(var i=0;i<res.lead_campaign_id_array.length;i++){
					var obj = {
						"id":res.lead_campaign_id_array[i].id,"itemName":res.lead_campaign_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList4.push(obj);
				}
				// for(var i=0;i<res.cs_agent_list.length;i++){
				// 	var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
				// 	var obj = {
				// 		"id":res.cs_agent_list[i].id,"itemName":<any>str
				// 	}
				// 	this.dropdownList5.push(obj);
				// }
				
			}
		);
	}
	fromDate(){
  		$(".fromDateSpan").hide();
  		$(".fromDate").show();
  	}
  	toDate(){
  		$(".toDateSpan").hide();
  		$(".toDate").show();
  	}
	getFiletredLeadsForSales(pageno?,search?){
		
		this.page_number = pageno;
		this.loaderService.display(true);
		this.salesService.getFileterLeadsForSales('',this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.referrer_type_id,search,pageno).subscribe(
			res =>{
				this.loaderService.display(false);
				this.headers_res= res.headers._headers;
				this.per_page = this.headers_res.get('x-per-page');
				this.total_page = this.headers_res.get('x-total');
				this.current_page = this.headers_res.get('x-page');

				res= res.json();
				this.filteredLeads = res.leads;
				this.filteredLeadsloader = true

				// this.filteredLeads = this.sortFunc(this.filteredLeads,{property: 'id', direction: '-1'});
				
				// this.queryParamSelectedArr();
				

			},
			err => {
				this.loaderService.display(false);
			}
		);
	}


	onItemSelect(item:any,textVal,index){
    	(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='Status' && index==1){
        	for(var k=0;k<this.selectedItems2.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
        	}
        } else if(textVal=='LeadType' && index==0){
        	for(var k=0;k<this.selectedItems.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems[k].itemName+',';
        	}

        } else if(textVal=='LeadSource' && index==2){
        	for(var k=0;k<this.selectedItems3.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
        	}
        } else if(textVal=='Campaign' && index==3){
        	for(var k=0;k<this.selectedItems4.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
        	}
        }else if(textVal=='Agent' && index==4){
        	for(var k=0;k<this.selectedItems5.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems5[k].itemName+',';
        	}
        } else if(textVal=='DateColumn' && index==5){
        	for(var k=0;k<this.selectedItems6.length;k++){

        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems6[k].itemName+',';
        	}
        }
    }
    OnItemDeSelect(item:any,textVal,index){
    	(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='Status' && index==1){
        	for(var k=0;k<this.selectedItems2.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
        	}
        } else if(textVal=='LeadType' && index==0){
        	for(var k=0;k<this.selectedItems.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems[k].itemName+',';
        	}

        } else if(textVal=='LeadSource' && index==2){
        	for(var k=0;k<this.selectedItems3.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
        	}
        } else if(textVal=='Campaign' && index==3){
        	for(var k=0;k<this.selectedItems4.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
        	}
        }else if(textVal=='Agent' && index==4){
        	for(var k=0;k<this.selectedItems5.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems5[k].itemName+',';
        	}
        }  else if(textVal=='DateColumn' && index==5){
        	for(var k=0;k<this.selectedItems6.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems6[k].itemName+',';
        	}
        }
    }
    onSelectAll(items: any,textVal,index){
        // document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='Status'){
        	
        } else if(textVal=='LeadType'){
        	
        } else if(textVal=='LeadSource'){
        	
        } else if(textVal=='Campaign'){
        	
        } else if(textVal=='Agent'){
        	
        } else if(textVal=='DateColumn'){
        	
        }
    }
    onDeSelectAll(items: any,textVal,index){
        //document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='Status'){
        	
        } else if(textVal=='LeadType'){
        	
        } else if(textVal=='LeadSource'){
        	
        } else if(textVal=='Campaign'){
        	
        } else if(textVal=='Agent'){
        	
        } else if(textVal=='DateColumn'){
        	
        }
    }
	downloadExcel(){
		this.salesService.exportLeads1(this.role,'',this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.search).subscribe(
		  res =>{
		  	this.successalert = true;
			  this.successMessage = "An email has been sent to your mail id with leads download attachment"
			  setTimeout(function() {
					this.successalert = false;
				 }.bind(this), 9000);
			

		  },
		  err => {
			 
			 this.loaderService.display(false);
	         this.erroralert = true;
	         this.errorMessage = <any>JSON.parse(err['_body']).message;
	         setTimeout(function() {
	            this.erroralert = false;
	         }.bind(this), 2000);
		  }
		);
	}
	addLeadFormSubmit(data) {
		this.loaderService.display(true);
		this.cityChangeValue = false
		this.societyOthersValue = false
		this.locationOthersValue = false
		data['created_by'] = localStorage.getItem('userId');
		data['lead_status']='not_attempted';
		data['lead_screen'] = 'sales_manager'
		if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
			data['lead_cv']=this.basefile;
		}
		
		var obj = {
			lead:data
		}
		console.log(obj);
		
		this.leadService.addLead(obj)
			.subscribe(
			  res => {
				console.log(res);
				console.log(res.status);
				this.successalert = true;
				this.successMessage = "Lead created successfully !!";
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 2000);
				this.getFiletredLeadsForSales(1);
				this.loaderService.display(false);
				this.addLeadForm.reset();
				$('#addNewLeadModal').modal('hide');
				this.addLeadForm.controls['lead_type_id'].setValue("");
				this.addLeadForm.controls['lead_source_id'].setValue("");
				this.addLeadForm.controls['lead_campaign_id'].setValue("");
				this.addLeadForm.controls['referrer_id'].setValue("");
				this.addLeadForm.controls["city"].setValue("");
				this.addLeadForm.controls["location"].setValue("");
				this.addLeadForm.controls["society"].setValue("");
				this.addLeadForm.controls['send_to_cs_agent'].setValue(true)
				this.basefile = undefined;
			  },
			  err => {
				this.loaderService.display(false);
				this.erroralert = true;
				this.errorMessage = JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 2000);
			  }
			);
	}
	numberCheck(e) {
	    if(!((e.keyCode > 95 && e.keyCode < 106)
	        || (e.keyCode > 47 && e.keyCode < 58)
	        || e.keyCode == 8 || e.keyCode == 39 ||
	        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 17
	        || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67 )) {
	      return false;
	    }
  	}
	attachment_file: any;
	attachment_name: string;
	basefile: any;
	uploadCV(event) {
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
    };
    fileReader.readAsDataURL(this.attachment_file);
  }

  

    filterData(){
    	this.csagents_idArr.length = 0;
    	this.lead_type_idArr.length=0;
    	this.lead_source_idArr.length=0;
    	this.lead_statusArr.length=0;
    	this.lead_campaign_idArr.length=0;

    	this.loaderService.display(true);
    	for(var k=0;k<this.selectedItems6.length;k++){
    		this.column_name =this.selectedItems6[k].id;
    	}
    	for(var k=0;k<this.selectedItems.length;k++){
    		this.lead_type_idArr.push(this.selectedItems[k].id);
    	}
    	for(var k=0;k<this.selectedItems2.length;k++){
    		this.lead_statusArr.push(this.selectedItems2[k].itemName.toLowerCase().replace(/ /g,"_"));
    	}
    	for(var k=0;k<this.selectedItems3.length;k++){
    		this.lead_source_idArr.push(this.selectedItems3[k].id);
    	}
    	for(var k=0;k<this.selectedItems4.length;k++){
    		this.lead_campaign_idArr.push(this.selectedItems4[k].id);
    	}
    	for(var k=0;k<this.selectedItems5.length;k++){
    		this.csagents_idArr.push(this.selectedItems5[k].id);
    	}

    	this.salesService.getFileterLeadsForSales(this.source,this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name,this.from_date,this.to_date,this.csagents_idArr,'',this.search,1).subscribe(
			res =>{
				this.headers_res= res.headers._headers;
				this.per_page = this.headers_res.get('x-per-page');
				this.total_page = this.headers_res.get('x-total');
				this.current_page = this.headers_res.get('x-page');
				res= res.json();
				this.filteredLeads = res.leads;
				this.loaderService.display(false);

			},
			err=> {
				
				this.loaderService.display(false);

			}
		);
    }
	singleNoteRecordData :any
	editFormdata :any
	editorCreate;
	editData:any
    setUpdatedLead(value){
        this.editData = value
		this.editorCreate = 'edit';
		this.editFormdata = value
		this.updateLeadForm.controls['sales_manager_id'].setValue(this.editFormdata.sales_manager_id)
		this.leadService.salesNoteRecords(value.id).subscribe(
			res => {
				console.log(res);
				this.singleNoteRecordData = res.note_records[0]
				console.log(this.singleNoteRecordData, 'note record');
				this.updateLeadForm.controls['city'].setValue(this.singleNoteRecordData.city)
				this.getSocietyList(this.singleNoteRecordData.city, '');
				if( this.singleNoteRecordData.city === 'Others'){
					this.cityChangeValue = true
					this.updateLeadForm.controls['new_city_value'].setValue(this.singleNoteRecordData.new_city_value)
					
					this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
				}else{
					this.cityChangeValue = false
					this.updateLeadForm.controls['new_city_value'].clearValidators()
					this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
				}

				if(this.singleNoteRecordData.society === 'Others'){
					this.societyOthersValue = true
					this.updateLeadForm.controls['new_society_value'].setValue(this.singleNoteRecordData.new_society_value)
					
					this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
				}else{
					this.societyOthersValue = false
					this.updateLeadForm.controls['new_society_value'].clearValidators()
					this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
				}

				if(this.singleNoteRecordData.location === 'Others'){
					this.locationOthersValue = true
					this.updateLeadForm.controls['new_locality_value'].setValue(this.singleNoteRecordData.new_locality_value)
					
					this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
				}else{
					this.locationOthersValue = false
					this.updateLeadForm.controls['new_locality_value'].clearValidators()
					this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
				}

				this.updateLeadForm.controls['society'].setValue(this.singleNoteRecordData.society)
				this.updateLeadForm.controls['location'].setValue(this.singleNoteRecordData.location)
			},
			err => {
				console.log(err);
			}
		)
		this.updateLeadForm.controls['send_to_cs_agent'].setValue(value.send_to_cs_agent)
		this.updateLeadForm.controls['id'].setValue(value.id);
		this.updateLeadForm.controls['name'].setValue(value.name);
		this.updateLeadForm.controls['email'].setValue(value.email);
		this.updateLeadForm.controls['contact'].setValue(value.contact);
		this.updateLeadForm.controls['pincode'].setValue(value.pincode);
		// this.updateLeadForm.controls['lead_type_id'].setValue(value.lead_type_id);
		this.updateLeadForm.controls['lead_source_id'].setValue(value.lead_source_id);
		this.updateLeadForm.controls['lead_campaign_id'].setValue(value.lead_campaign_id);
		this.updateLeadForm.controls['lead_status'].setValue(value.lead_status);
		// this.updateLeadForm.controls['follow_up_time'].setValue(new Date(value.follow_up_time._i).toJSON().slice(0,19));
		this.updateLeadForm.controls['remark'].setValue(value.remark);
		this.updateLeadForm.controls['lost_remark'].setValue(value.lost_remark);
		this.updateLeadForm.controls['lost_reason'].setValue(value.lost_reason);
		this.updateLeadForm.controls['lead_type_name'].setValue(value.referrer.name);
		this.updateLeadForm.controls['lead_source_type'].setValue(value.lead_source);
		this.updateLeadForm.controls['instagram_handle'].setValue(value.instagram_handle);
		this.updateLeadForm.controls['referrer_type'].setValue(value.referrer_type);
		this.getReferUserList(value.lead_source_id,value.referrer_type,value.sales_manager_id);
		this.updateLeadForm.controls['referrer_id'].setValue(value.referrer_id);
		this.updateLeadForm.controls['lead_cv'].setValue(value.lead_cv);
		this.updateLeadForm.controls['lead_status'].setValue(value.lead_status);
		
		if(value.follow_up_time){
			var date=value.follow_up_time.split('T')[0];
    	var time=value.follow_up_time.split('T')[1].split('.')[0];
    	value.follow_up_time = date +"T"+time;
		}
   		this.updateLeadForm.controls['follow_up_time'].setValue(value.follow_up_time);
		
		if(this.role2 == 'area_sales_manager' || this.role2 == 'sales_manager'){
			this.updateLeadForm.controls['email'].clearValidators();
		}
	}

	updateLeadFormSubmit(data){
		console.log(this.updateLeadForm.controls)
		data['lead_screen'] = 'sales_manager'
		if(data.lead_type_name=='designer'){
			data['lead_cv']=this.basefile
		} else {
			data['lead_cv'] ='';
		}
		var obj = {
			lead:data
		}

		if (data["lead_status"] == "delayed_possession") {
			obj.lead["follow_up_time"] = $("#startDateNew").datepicker().val();
		  } else if (data["lead_status"] == "delayed_project") {
			obj.lead["follow_up_time"] = $("#startDateNewpro").datepicker().val();
		  }else{

		  }
		
		if( data['lead_status'] == 'qualified' && data['lead_type_name'] == 'customer' && (data['pincode']=='' || data['pincode'] == null || data['pincode'] ==  undefined)){
	      this.errorMessage='Pincode is mandatory';
	      this.erroralert = true;
	      setTimeout(function() {
	            this.erroralert = false;
	          }.bind(this), 10000);
	    } else {
				this.loaderService.display(true);
				this.leadService.editLead(data.id,obj).subscribe(
					res => {
						this.updateLeadForm.reset();
						$('#editLeadModal').modal('hide');
						this.getFiletredLeadsForSales(1);
						this.loaderService.display(false);
						this.successalert = true;
						this.successMessage = "Details updated successfully !!";
						setTimeout(function() {
							 this.successalert = false;
						}.bind(this), 10000);
					},
					err => {
						
						this.loaderService.display(false);
						this.erroralert = true;
						this.errorMessage = JSON.parse(err['_body']).message;
						setTimeout(function() {
							 this.erroralert = false;
						}.bind(this), 10000);
					}
				);
			}


	}
	deleteLead(id) {
	    if(confirm('Are you sure you want to delete this lead?')== true) {
	      this.loaderService.display(true);
	      this.leadService.deleteLead(id)
	        .subscribe(
	          leads => {
	            this.successalert = true;
	            this.successMessage = "Lead deleted successfully";
	            setTimeout(function() {
	                this.successalert = false;
	             }.bind(this), 2000);
	            	this.getFiletredLeadsForSales(this.page_number);
	              this.loaderService.display(false);
	            },
	            error =>  {
	              this.erroralert = true;
	              this.errorMessage = <any>JSON.parse(error['_body']).message;
	              setTimeout(function() {
	                this.erroralert = false;
	             }.bind(this), 2000);
	               this.loaderService.display(false);
	            }
	        );
	    }
  	}

  	onChangeOfLeadType(val){
		for(var i=0;i<this.lead_types.length;i++){
			if(val==this.lead_types[i].id){
				this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
			}
		}
	}
	onChangeOfLeadSource(val){
		let salesmanager=this.addLeadForm.controls['sales_manager_id'].value
		salesmanager=salesmanager==null?'':salesmanager
		for( var i=0;i<this.lead_referrer_list.length;i++){
			if(val == this.lead_referrer_list[i].name){
				
               
				this.addLeadForm.controls['lead_source_type'].setValue(this.lead_referrer_list[i].name);
				if(this.addLeadForm.controls['lead_source_type'].value == 'design_partner_referral' || this.addLeadForm.controls['lead_source_type'].value == 'client_referral' || this.addLeadForm.controls['lead_source_type'].value == 'broker' 
				|| this.addLeadForm.controls['lead_source_type'].value == 'display_dealer_referral' 
				|| this.addLeadForm.controls['lead_source_type'].value == 'non_display_dealer_referral' 
				|| this.addLeadForm.controls['lead_source_type'].value == 'employee_referral' 
				|| this.addLeadForm.controls['lead_source_type'].value == 'dealer' 
				|| this.addLeadForm.controls['lead_source_type'].value == 'arrivae_champion'
				|| this.addLeadForm.controls['lead_source_type'].value == 'associate_partner' 
				|| this.addLeadForm.controls['lead_source_type'].value == 'others'){
					this.getReferUserList(val,this.addLeadForm.controls['lead_source_type'].value,salesmanager);

				}
				

			}

		}


	}
	onChangeOfLeadSourceEdit(val){
		let salesmanager=this.updateLeadForm.controls['sales_manager_id'].value
		salesmanager=salesmanager==null?'':salesmanager
		for( var i=0;i<this.lead_referrer_list.length;i++){
			if(val == this.lead_referrer_list[i].name){
               
				this.updateLeadForm.controls['lead_source_type'].setValue(this.lead_referrer_list[i].name);
				if(this.updateLeadForm.controls['lead_source_type'].value == 'design_partner_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'client_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'broker' || this.updateLeadForm.controls['lead_source_type'].value == 'display_dealer_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'non_display_dealer_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'employee_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'dealer' || this.updateLeadForm.controls['lead_source_type'].value == 'arrivae_champion' || this.updateLeadForm.controls['lead_source_type'].value == 'others'|| this.updateLeadForm.controls['lead_source_type'].value == 'associate_partner'){
					this.getReferUserList(val,this.updateLeadForm.controls['lead_source_type'].value,salesmanager);

				}
				

			}

		}


	}
	userList:any;
	getReferUserList(referId,referName,salesmanager){
		this.salesService.getReferUserList(this.sales_id,referName,salesmanager).subscribe(
			res=>{
				
				this.userList = res['users'];

			},
			err=>{
				this.loaderService.display(false)
			});


	}
	onChange(event) {
		document.getElementById('extErrorMsg').classList.add('d-none');
		this.basefile = undefined;
	   this.attachment_file = event.srcElement.files[0];
	   var re = /(?:\.([^.]+))?$/;
	   var ext = re.exec(this.attachment_file.name)[1];
		var fileReader = new FileReader();
		   var base64;
	   if(ext == 'xlsx' || ext == 'xls') {
			fileReader.onload = (fileLoadedEvent) => {
			 base64 = fileLoadedEvent.target;
			 this.basefile = base64.result;
		   };
		}
		else {
		  document.getElementById('extErrorMsg').classList.remove('d-none');
		}

		fileReader.readAsDataURL(this.attachment_file);
	}
	referrer_id = "";
	designerArr=[];
LeadsReport = [];
	submitExcelUpload(){
		this.loaderService.display(true);
		this.salesService.uploadLeadExcel(this.basefile,this.sourceOfBulkLeads,this.typeOfBulkLeads,this.campignOfBulkLeads,this.referrer_id,this.referrer_type,this.salesmanagerId)
		.subscribe(
			res => {
			  $('#exampleModal').modal('hide');
			  $('#LeadsReportUpload').modal('show');
			  this.LeadsReport = res.data;
			  this.getFiletredLeadsForSales(1);
			  this.loaderService.display(false);
			  this.sourceOfBulkLeads = "";
			  this.typeOfBulkLeads = "";
			  this.campignOfBulkLeads="";
			  this.referrer_id="";
			  this.referrer_type="";
			  
			  this.basefile = undefined;
			  this.successMessage = "leads Report ";
			  setTimeout(function() {
					  this.successalert = false;
				 }.bind(this), 5000);
				

			},

			
			error => {
			  this.loaderService.display(false);
			  this.erroralert = true;
			  
			  this.errorMessage = JSON.parse(error['_body']).message;
			  setTimeout(function() {
					  this.erroralert = false;
				 }.bind(this), 5000);
			}
		);
	  }

	getReferrersList(page?,search?){
		this.loaderService.display(true)
	    this.salesService.getReferrersList(this.sales_id,page,search).subscribe(
	      res=>{
	        res= res.json();
	        this.referreresList = res['users'];
	      },
	      err=>{
	        this.loaderService.display(false)

	      })
	}  
	retainAddress :any
	retainLocality : any
	retainCity :any
	societyList = [];
	getSocietyList(city_name, note_records) {
	 
	  let society_search_word = "";
	  if (note_records && (note_records.society && note_records.society != 'Others')) {
		society_search_word = note_records.society
	  }
	//   note records api
	  this.leadService.getLocalityBuildingDetails(city_name, society_search_word).subscribe(
		res => {
		  this.societyList = res.building_crawlers;
		 
		},
		err => {
		  this.loaderService.display(false);
		}
	  );
	}
	societyOthersValue : boolean = false
	buildingObj :any
	changebuilding(value , typeofForm){
		this.buildingObj = value
		console.log(value)
		if(typeofForm === 'create'){
			if (value== "Others") {
				this.societyOthersValue = true
				this.addLeadForm.controls['new_society_value'].setValidators(Validators.required)
				this.addLeadForm.controls["new_society_value"].updateValueAndValidity();
			}else {
				this.societyOthersValue = false
				const societyId = value.id;
				this.addLeadForm.controls['building_crawler_id'].setValue(societyId);
				this.addLeadForm.controls['society'].setValue(value.building_name);
				this.addLeadForm.controls['location'].setValue(value.locality);
				this.addLeadForm.controls["new_society_value"].clearValidators();
				this.addLeadForm.controls["new_society_value"].updateValueAndValidity();
				this.getSocietyWebData(societyId);
			}
		}else{
			if (value== "Others") {
				this.societyOthersValue = true
				this.updateLeadForm.controls['new_society_value'].setValidators(Validators.required)
				this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
			}else {
				this.societyOthersValue = false
				const societyId = value.id;
				this.updateLeadForm.controls['building_crawler_id'].setValue(societyId);
				this.updateLeadForm.controls['society'].setValue(value.building_name);
				this.updateLeadForm.controls['location'].setValue(value.locality);
				this.updateLeadForm.controls["new_society_value"].clearValidators();
				this.updateLeadForm.controls["new_society_value"].updateValueAndValidity();
				this.updateLeadForm.controls['location'].setValue(value.locality)
				this.getSocietyWebData(societyId);
			}
		}
	}
	cityChangeValue : boolean = false
	onchangeCity(event , typeofForm){
	  let city = event;
	  if(typeofForm === 'create'){
		if (city == 'Others') {
			this.cityChangeValue  = true
			this.addLeadForm.controls['new_city_value'].setValidators(Validators.required)
			this.addLeadForm.controls["new_city_value"].updateValueAndValidity();
		  } else {
			// this.societyList = [];
			// this.addLeadForm.controls['society'].setValue('')
			this.getSocietyList(city, '');
			this.addLeadForm.controls["new_city_value"].clearValidators();
			this.addLeadForm.controls["new_city_value"].updateValueAndValidity();
			this.cityChangeValue = false
		  }
	  }else{
		if (city == "Others") {
			this.cityChangeValue = true
			this.updateLeadForm.controls['new_city_value'].setValidators(Validators.required)
			this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
		}
		else {
			this.getSocietyList(city , '')
			this.cityChangeValue = false
			this.updateLeadForm.controls['new_city_value'].clearValidators()
			this.updateLeadForm.controls["new_city_value"].updateValueAndValidity();
		}
	  }
	}
	locationOthersValue : boolean = false
	changeLocality(event , typeofForm) {
		let locality = event
		if(typeofForm === 'create'){
			if (locality == "Others") {
				this.locationOthersValue = true
				this.addLeadForm.controls['new_locality_value'].setValidators(Validators.required)
				this.addLeadForm.controls["new_locality_value"].updateValueAndValidity();
			}
			else {
				this.locationOthersValue = false
				this.addLeadForm.controls['new_locality_value'].setValidators(Validators.required)
				this.addLeadForm.controls["new_locality_value"].updateValueAndValidity();
			}
		}else{
			if (locality == "Others") {
				this.locationOthersValue = true
				this.updateLeadForm.controls['new_locality_value'].setValidators(Validators.required)
				this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
			}
			else {
				this.locationOthersValue = false
				this.updateLeadForm.controls['new_locality_value'].clearValidators()
				this.updateLeadForm.controls["new_locality_value"].updateValueAndValidity();
			}
		}
	}
	localityWebData :any
	getSocietyWebData(society) {
	  this.loaderService.display(true);
	  this.localityWebData = null;
	  this.leadService.getSocietyWebData(society).subscribe(
		res => {
		  this.localityWebData = res;
		  this.loaderService.display(false);
		},
		err => {
		  this.loaderService.display(false);
		}
	  );
	}
	citiesForQuestionnaire :any
	getCitiesForQuestionnaire() {
	this.loaderService.display(true);
	this.leadService.getCitiesForQuestionnaire().subscribe(
		res => {
		this.citiesForQuestionnaire = res.cities;
		},
		err => {
		this.loaderService.display(false);
		}
		);
	}
	closeModal(msg?) {
		this.leadIDForModal = undefined;
		this.customerNameModal = undefined;
		this.customerphoneForModal = undefined;
		this.userQuestionnaireDetails = undefined;
		// this.city_others = undefined;
		this.leaddetailsForModal = undefined;
		$("#questionnaireModal").modal("hide");
		if (msg) {
		  this.getFiletredLeadsForSales(1);
		  this.successalert = true;
		  this.successMessage = msg;
		  setTimeout(
			function () {
			  this.successalert = false;
			}.bind(this),
			10000
		  );
		}
	  }
	userQuestionnaireDetails:any
	leadIDForModal:any
	customerphoneForModal:any
	customerIDModal:any
	customerNameModal:any
	leaddetailsForModal:any
	passDataToModal(LeadIDForModal, customerName, phone, data) {
		this.leadIDForModal = LeadIDForModal;
		this.customerNameModal = customerName;
		this.customerphoneForModal = phone;
		this.leaddetailsForModal = data;
		
	}
	closeModalAddLead(){
		this.addLeadForm.reset()
		this.cityChangeValue = false
		this.societyOthersValue = false
		this.locationOthersValue = false
		this.addLeadForm.controls["city"].setValue("");
		this.addLeadForm.controls["location"].setValue("");
		this.addLeadForm.controls["society"].setValue("");
		this.addLeadForm.controls['send_to_cs_agent'].setValue(true)
		// this.addLeadForm.controls["new_society_value"].clearValidators();
		// for (const key in this.addLeadForm.controls) {
		// 	this.addLeadForm.get(key).clearValidators();
		// 	this.addLeadForm.get(key).updateValueAndValidity();
		// }
	}
	closeEditModal(){
		for (const key in this.addLeadForm.controls) {
			this.addLeadForm.get(key).clearValidators();
			this.addLeadForm.get(key).updateValueAndValidity();
		}
	}

	setLeadStatus(value) {
		if (value == "follow_up") {
		  this.updateLeadForm.get("follow_up_time").setValidators(Validators.required);
		  this.updateLeadForm.get("remark").setValidators(Validators.required); 
		  this.updateLeadForm.get("follow_up_time").updateValueAndValidity();
		  this.updateLeadForm.get("remark").updateValueAndValidity();
		}else if(value == 'lost') {
			this.updateLeadForm.get("lost_reason").setValidators(Validators.required);
			this.updateLeadForm.get("lost_remark").setValidators(Validators.required);
			this.updateLeadForm.get("lost_reason").updateValueAndValidity();
			this.updateLeadForm.get("lost_remark").updateValueAndValidity();
		}else{
			this.updateLeadForm.get("lost_reason").clearValidators();
			this.updateLeadForm.get("lost_remark").clearValidators();
			this.updateLeadForm.get("lost_reason").updateValueAndValidity();
			this.updateLeadForm.get("lost_remark").updateValueAndValidity();
			this.updateLeadForm.get("follow_up_time").clearValidators();
			this.updateLeadForm.get("remark").clearValidators(); 
			this.updateLeadForm.get("follow_up_time").updateValueAndValidity();
			this.updateLeadForm.get("remark").updateValueAndValidity();
		}
	}
	resetValues(){
		if(this.role2 == 'area_sales_manager' || this.role2 == 'sales_manager'){
			this.addLeadForm.controls['email'].clearValidators();
			}
		this.closeModalAddLead()
		this.listAllSalesManager()
		this.editorCreate = 'create'
	}
	callChangeNew1() {
		$(".date-picker")
		  .datepicker({
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			dateFormat: "mm/yy",
			minDate: "+6M",
			onClose: function (dateText, inst) {
			  function isDonePressed() {
				return (
				  $("#ui-datepicker-div")
					.html()
					.indexOf(
					  "ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover"
					) > -1
				);
			  }
	
			  if (isDonePressed()) {
				var month = $(
				  "#ui-datepicker-div .ui-datepicker-month :selected"
				).val();
				var year = $(
				  "#ui-datepicker-div .ui-datepicker-year :selected"
				).val();
				$(this).datepicker("setDate", new Date(year, month, 1));
			  }
			},
		  })
		  .focus(function () {
			$("#startDateNew", "#startDateNewpro").datepicker("show");
		  })
		  .focus();
	  }
	singlePDFData :any
	lead_logs
	filtered_logs=[]
	log_owners=[]
	openPDFMpdal(data){
	$('#additionalAppDetails').modal('show')
  	this.singlePDFData = 	data
  	console.log(this.singlePDFData);
	}
	cmlistArr;
	getCmList() {
	  this.loaderService.display(true);
	  this.leadService.getCmList().subscribe(
		(res) => {
		  this.cmlistArr = res.community_managers;
		  
		},
		(err) => {
		  this.loaderService.display(false);
		}
	  );
	}

	assigneLeadId;
  assigneIndex;
  cmlistArray;
  designerId

  assignCmToLead(leadid, index, cmId?, designerId?) {
    this.assigneLeadId = leadid;
    this.assigneIndex = index;
    if (
      this.assignedCMIds[index] != undefined &&
      this.assignedCMIds[index] != "Assign To CM"
    ) {
      this.loaderService.display(true);
      this.leadService
        .assignCmToLead(this.assignedCMIds[index], leadid, cmId, designerId)
        .subscribe(
          (res) => {
            if (res.community_managers) {
              this.cmlistArr = res.community_managers;
              this.loaderService.display(false);

              $("#AssignModal").modal("show");
            } else {
              Object.keys(res).map((key) => {
                res = res[key];
              });
              this.assignedCMIds[index] = undefined;
			  this.getFiletredLeadsForSales(1);
              this.loaderService.display(false);
              this.successalert = true;
              this.designerId = "";
              $("#AssignModal").modal("hide");
              this.successMessage = "Assigned Successfully !!";
              this.resetDropDown();
              $(window).scrollTop(0);
              setTimeout(
                function () {
                  this.successalert = false;
                }.bind(this),
                5000
              );
            }
          },
          (error) => {
            this.erroralert = true;
            this.errorMessage = JSON.parse(error["_body"]).message;
            this.loaderService.display(false);
            $(window).scrollTop(0);
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              5000
            );
          }
        );
    } else {
      document
        .getElementById("assigncmdropdown" + leadid)
        .classList.add("inputBorder");
    }
  }

  onCMDropdownChange(leadid, cmid, rowid) {
    this.assignedCMIds[rowid] = cmid;
    if (
      this.assignedCMIds[rowid] != undefined &&
      this.assignedCMIds[rowid] != "Assign To CM"
    ) {
      document
        .getElementById("assigncmdropdown" + leadid)
        .classList.remove("inputBorder");
    }
  }
  assignDesignerId
  assignedCMIds = [];
  resetDropDown() {
    this.assignDesignerId = "";

  }
  assignCmToLeadTwo(cmId, designerId) {
    this.designerId = "";

    if (
      designerId != -1 &&
      cmId != -1 &&
      designerId != undefined &&
      cmId != undefined &&
      cmId != "" &&
      designerId != ""
    ) {
      this.assignCmToLead(
        this.assigneLeadId,
        this.assigneIndex,
        cmId,
        designerId
      );
    } else {
      alert("Select Designer And CM And Then Submit");
    }
  }


	viewLeadLog(leadId, rowID) {
		this.loaderService.display(true);
		this.salesService.getLeadLogs(leadId,true).subscribe(
		  (res) => {
			Object.keys(res).map((key) => {
			  this.lead_logs = res[key];
			});
	
			this.filtered_logs = this.lead_logs.change_log;
			var temp_email = [];
			for (let log of this.lead_logs.change_log) {
			  if (log.whodunnit !== "" && log.whodunnit !== null) {
				if (!temp_email.includes(log.whodunnit)) {
				  var json = {
					name: log.name,
					email: log.whodunnit,
					image: log.user_image,
				  };
				  this.log_owners.push(json);
				  temp_email.push(log.whodunnit);
				}
			  }
			}
			this.loaderService.display(false);
		  },
		  (err) => {
			this.loaderService.display(false);
		  }
		);
	  }

	  directionlog: number;
	  isDesclog: boolean = true;
	  columnlog: string = "CategoryName";
	  // Change sort function to this:
	  sortlog(property, sort) {
		if (sort == "oldest") {
		  $(".dropdownButton2").html("Oldest First");
		  this.isDesclog = true; //change the direction
		} else if (sort == "newest") {
		  $(".dropdownButton2").html("Newest First");
		  this.isDesclog = false; //change the direction
		}
		this.columnlog = property;
		this.directionlog = this.isDesclog ? 1 : -1;
	  }

	  filterLogs(e, filter = "all") {
		var arr = [];
		$(".dropdownButton1").html(
		  '<img src="' +
			e.srcElement.childNodes[1].currentSrc +
			'" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>' +
			e.srcElement.childNodes[2].nodeValue +
			"</span>"
		);
		if (filter == "all") {
		  this.filtered_logs = this.lead_logs.change_log;
		} else {
		  for (let log of this.lead_logs.change_log) {
			if (log.whodunnit == filter) {
			  arr.push(log);
			}
		  }
		  this.filtered_logs = arr;
		}
	  }


	  clearLogs() {
		this.lead_logs = undefined;
		this.filtered_logs = [];
		this.log_owners = [];
		$(".dropdownButton1").html(
		  '<img src="../../assets/img/images/original/missing.png" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>All (logs)</span>'
		);
	  }
	list_salesManager : any
	listAllSalesManager(){
		
		this.leadService.getSalesManagerList().subscribe(
			(res) => {
				console.log(res)
				console.log(res)
				this.list_salesManager = res
			

			},
			(err) => {
				console.log(err)
			}
		)
	}

	filteredOptions
	searchSocietyApi($event) {
	  this.isApifired = true
	  console.log(this.isApifired)
	  this.typeSelectAddress =''
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
	isSelectedgoogle = false;
	typeSelectAddress;
	isApifired = false;
	isApifiredgoogle = false;
	projectName ='';
	DeveloperName;
	pincodePro ='';
	FullAdress;
	citynamePro;
  
  
	selectOption(address){
  
	  this.typeSelectAddress = address
  
	  if(address == 'other' ){
         if(this.editorCreate == 'create'){
			this.addLeadForm.controls['city'].setValue('')
			this.addLeadForm.controls['location'].setValue('Others')
			this.addLeadForm.controls['city'].setValue('');
			this.addLeadForm.controls['pincode'].setValue('')
			this.addLeadForm.controls['aide_apartment_id'].setValue('')
			this.addLeadForm.controls['new_locality_value'].setValue('')
			this.addLeadForm.controls['new_society_value'].setValue('')
			this.addLeadForm.controls['new_city_value'].setValue('')
			;
			this.filteredOptions = [];
			this.projectName =  this.addLeadForm.controls['society'].value;
		 } else{

			this.updateLeadForm.controls['city'].setValue('')
			this.updateLeadForm.controls['location'].setValue('Others')
			this.updateLeadForm.controls['city'].setValue('');
			this.updateLeadForm.controls['pincode'].setValue('')
			this.updateLeadForm.controls['aide_apartment_id'].setValue('')
			this.updateLeadForm.controls['new_locality_value'].setValue('')
			this.updateLeadForm.controls['new_society_value'].setValue('')
			this.updateLeadForm.controls['new_city_value'].setValue('')
			;
			this.filteredOptions = [];
			this.projectName =  this.updateLeadForm.controls['society'].value;

		 }
		 
		  this.DeveloperName = '';
		  this.pincodePro ='';
		  this.FullAdress ='';
		  this.citynamePro ='';
		  $('#citygoogle2').val('');
		  $('#pincodegoogle2').val('')
  
		  $('#OtherProjectname2').modal('show');
		  this.initMap()
  
  
	  } else{
		let apar_id ;
		if(address.configuration.length>0){
		  apar_id = address.configuration[0].apartment_id
		} else{
		  apar_id = address.id
		}
		if(this.editorCreate == 'create'){
			this.addLeadForm.controls['society'].setValue(address.apartment_name)
			this.addLeadForm.controls['city'].setValue(address.city)
			  this.addLeadForm.controls['location'].setValue(address.area_name)
			  this.addLeadForm.controls['new_locality_value'].setValue('')
			
			this.addLeadForm.controls['aide_apartment_id'].setValue(apar_id)
			
	  
			;
			this.addLeadForm.controls['pincode'].setValue(address.pincode)
			this.addLeadForm.controls['new_society_value'].setValue('')
			;
		} else{
			this.updateLeadForm.controls['society'].setValue(address.apartment_name)
			this.updateLeadForm.controls['city'].setValue(address.city)
			  this.updateLeadForm.controls['location'].setValue(address.area_name)
			  this.updateLeadForm.controls['new_locality_value'].setValue('')
			
			this.updateLeadForm.controls['aide_apartment_id'].setValue(apar_id)
			
	  
			;
			this.updateLeadForm.controls['pincode'].setValue(address.pincode)
			this.updateLeadForm.controls['new_society_value'].setValue('')
			;
		}
		
	  }
	  this.isSelected = true
	  this.isApifired = false
  
  
	  this.filteredOptions = []
  
	}
	SelectedPlace = ''
  full_addressgoogle

   initMap(){
    var vm = this

      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-input2'),
        {  types: ['geocode', 'establishment'] ,
      }
      );

      autocomplete.addListener('place_changed', function() {
        const selectedPlace = autocomplete.getPlace();
        if (selectedPlace && selectedPlace.address_components) {
          const city = selectedPlace.address_components.find(component =>
            component.types.includes('locality')
          );
          const postalCode = selectedPlace.address_components.find(component =>
            component.types.includes('postal_code')
          );

          const completeAddress = selectedPlace.formatted_address;

          var areaName = selectedPlace.address_components.filter(
            (component) => component.types.includes('sublocality')
          );
          const concatenatedNames = areaName.map(component => component.long_name).join(', ');
          areaName = concatenatedNames
          console.log(areaName,'areaname')
          areaName ? $('#areaname2').val(areaName): $('#areaname2').val(completeAddress )




          $('#autocomplete-input2').val(completeAddress)

          if (city) {
            const cityname = city.long_name;
            console.log('Selected city:', cityname);
            vm.citynamePro = cityname;
            $('#citygoogle2').val(cityname)
            console.log(vm.citynamePro)
          }
          if (postalCode) {
            const postalCodeValue = postalCode.long_name;
            console.log('Selected postal code:', postalCodeValue);
            $('#pincodegoogle2').val(postalCodeValue)
            // Assign the city name and postal code to variables or do any other processing

          } else{
            $('#pincodegoogle2').val('')
          }
        console.log($('#pincodegoogle2').val())  
        }

      });




  }

  
  pincodeval(){
    console.log($('#pincodegoogle2').val(),'ta')
  this.pincodePro =  $('#pincodegoogle2').val()


  }
  Submitapart(){

    $('#OtherProjectname2').modal('hide');
	
    console.log($('#autocomplete-input2').val());
	if(this.editorCreate == 'create'){
    this.addLeadForm.controls['location'].setValue($('#areaname2').val());
    this.addLeadForm.controls['city'].setValue($('#citygoogle2').val());
    this.addLeadForm.controls['new_locality_value'].setValue(this.FullAdress);
    this.addLeadForm.controls['pincode'].setValue($('#pincodegoogle2').val());
    this.addLeadForm.controls['society'].setValue(this.projectName);
} else{
	this.updateLeadForm.controls['location'].setValue($('#areaname2').val());
    this.updateLeadForm.controls['city'].setValue($('#citygoogle2').val());
    this.updateLeadForm.controls['new_locality_value'].setValue(this.FullAdress);
    this.updateLeadForm.controls['pincode'].setValue($('#pincodegoogle2').val());
    this.updateLeadForm.controls['society'].setValue(this.projectName);
}
    console.log(this.addLeadForm.controls['location'].value,$('#autocomplete-input2').val())
    if(this.typeSelectAddress == 'other' ){
      this.CreateApartment()
       }

  }

  CreateApartment(){
   
    let address = this.addLeadForm.controls['location'].value;
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

var obj
if(this.editorCreate == 'create'){
	 obj ={
		"rera_number": "",
		"project_name": this.projectName,
		"full_address": $('#autocomplete-input2').val(),
		"project_developer": this.DeveloperName,
		"pincode": this.addLeadForm.controls['pincode'].value,
		"area_name":$('#areaname2').val(),
		"city": this.addLeadForm.controls['city'].value,
		"state": ""
	}
} else{
	 obj ={
		"rera_number": "",
		"project_name": this.projectName,
		"full_address": $('#autocomplete-input2').val(),
		"project_developer": this.DeveloperName,
		"pincode": this.updateLeadForm.controls['pincode'].value,
		"area_name":$('#areaname2').val(),
		"city": this.updateLeadForm.controls['city'].value,
		"state": ""
	}
}
   
     this.leadService.CreateApar(obj).subscribe(Res=>{
		if(this.editorCreate == 'create'){
			this.addLeadForm.controls['aide_apartment_id'].setValue(Res.result[0].apartment_id)
		} else{
			this.updateLeadForm.controls['aide_apartment_id'].setValue(Res.result[0].apartment_id)
		}
     
	  

      this.successalert = true;
      this.successMessage = "Apartment Created Successfully"
      setTimeout(function () {
        this.successalert = false;
      }.bind(this), 5000);
       

     },err=>{
      this.erroralert = true;
      this.errorMessage = JSON.parse(err['_body']).message;
      setTimeout(function () {
        this.erroralert = false;
      }.bind(this)
, 5000);

     })


  }
 
  closeaddApartmentrplanModal() {
  
    $('#OtherProjectname2').modal('hide');
	this.setUpdatedLead(this.editData)
  }
 
  arrayjoin(value){
	return value ? value.join(', ') : '';
  }
  modalexcell(){
	if( this.role2 == 'area_sales_manager'){
		this.salesmanagerId = ''
	} else{
		this.salesmanagerId = null
	}
	console.log(this.salesmanagerId,"asm")
	this.sourceOfBulkLeads ='';
	this.typeOfBulkLeads ='';
	this.basefile = undefined;
	this.resetFileInput()

  }
  resetFileInput() {
    if (this.attachmentFileInput) {
      this.attachmentFileInput.nativeElement.value = '';
    }
  }
  hideOptions(){
    this.isApifired = false
  }
  showOptions(){
    this.isApifired = true
  }
}
