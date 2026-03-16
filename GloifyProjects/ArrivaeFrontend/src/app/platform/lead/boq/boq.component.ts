import { Component, OnInit ,HostListener,OnDestroy } from "@angular/core";
import { TitleCasePipe } from '@angular/common';
import {
  Routes,
  RouterModule,
  Router,
  ActivatedRoute,
  Params,
} from "@angular/router";
import { LeadService } from "../lead.service";
import { Observable } from "rxjs";
import { Lead } from "../lead";
import { ProjectService } from "../../project/project/project.service";
import { DesignerService } from "../../designer/designer.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { underScorePipe } from "app/platform/organisation/underScore.pipe";
import { LoaderService } from "../../../services/loader.service";
import { QuotationService } from "../../quotation/quotation.service";
import { PortfolioService } from "app/platform/organisation/portfolio/portfolio.service";
import { Location } from "@angular/common";
declare var $: any;

@Component({
  selector: "app-boq",
  templateUrl: "./boq.component.html",
  styleUrls: ["./boq.component.css"],
  providers: [
    LeadService,
    QuotationService,
    DesignerService,
    ProjectService,
    PortfolioService,
  ],
})
export class BoqComponent implements OnInit {
  lead_id: any;
  showtop: any;
  showin: any;
  role: any;
  lead_details: any;
  pid: number;
  pname;
  sectionsList;
  selectedQuotationStatus = "all";
  selectBoqTypeForm1: FormGroup;
  selectSectionTypeForm: FormGroup;
  selectBoqTypeContact: FormGroup;
  importBoqForm: FormGroup;
  importBoqPresetForm: FormGroup;
  paginationLimit: number;
  startPage: number;
  quotations: any[];
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  importquotations;
  lead_status;
  projectsList;
  project_id;
  showinany: any;
  importedProjectList;
  showTypesofBoq: boolean = true;
  boqType: any = "non_service";
  spaceDropdown: any;
  api_data: any;
  space_name: any;
  updated_spaceName :any
  lifestage: any;
  differentShapes :any
  areaRanges :any
  pricerange: any;
  theme: any;
  list: any;
  remarkForCancell: any;
  // loader: any;
  total_page: any;
  space_name2: any = "";
  lifeStage_filter_value: any = "";
  theme_filter_value: any = "";
  page_name_query: any = 1;
  per_page: any
  current_page: any;
  sendremark: FormGroup;
  descriptionData: any = "All description dataAll description dataAll description dataAll description dataAll description dataAll description dataAll description dataAll description dataAll description dataAll description data";
  readMore: any = false;
  custom_access:any;


  emailverified:boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private portfolioService: PortfolioService,
    private router: Router,
    public leadService: LeadService,
    public loaderService: LoaderService,
    private quotationService: QuotationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private designerService: DesignerService,
    private projectService: ProjectService,
    private location: Location
  ) {
    this.paginationLimit = 5;
    this.startPage = 0;
  }

  showMore() {
    this.paginationLimit = Number(this.paginationLimit) + 2;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
    });
    this.route.queryParams.subscribe((params) => {
      this.lead_status = params["lead_status"];
    });
    this.role = localStorage.getItem("user");
    this.selectBoqTypeForm1 = this.formBuilder.group({
      boqType: new FormControl("create_boq"),
      serviceType: new FormControl("non_service"),
    });
    this.selectSectionTypeForm = this.formBuilder.group({
      sections: new FormArray([], Validators.required),
    });
    this.sendremark = this.formBuilder.group({
      sendremarkto: new FormControl("", Validators.required),
    });
    this.selectBoqTypeContact =  this.formBuilder.group({
      contact: new FormControl("", Validators.required),
    });

    this.importBoqForm = this.formBuilder.group({
      project: new FormControl({ value: "", disabled: true }),
      boq: new FormControl({ value: "", disabled: true }),
      stage: new FormControl({ value: "", disabled: true }),
      boqType: new FormControl({ value: "", disabled: true }),
    });
    this.importBoqPresetForm = this.formBuilder.group({
      stagepreset: new FormControl("", Validators.required),
      boqTypepreset: new FormControl("", Validators.required),
    });
    this.emailverified = localStorage.getItem('emailverified') === 'true';
    
    this.clearLocalStorage();
    this.fetchBasicDetails();
    this.getDropdownSpace();
    // this.getPortfolioList(this.space_name2, this.lifeStage_filter_value, this.theme_filter_value, '', this.page_name_query, this.per_page, '');
    // alert(this.current_page);
  }
  pagination;
  newlastthreemonths :any
  getpageNumber(event: any) {
    this.getPortfolioList(
      event,
      this.updatedSpaceArray,
      this.updatedLifeStageArray,
      this.updatedThemeArray,
      this.updatedPriceRangeArray,
      this.per_page,
      this.searchstring,
      this.updatedShapeArray,
      this.updatedAreaRangeArray,
      this.showFavorateFilterValue,
      "",
      this.updatedpresetTypeArray,
      this.sortByFeatured,
      this.sortByArea,
      this.sortByPrice,
      this.newlastthreemonths,
      this.sortByPopular,
      this.sortBybestSeller,
      this.updatedPriceCategory,
      this.selectedids
    );
    this.current_page = event;
    this.pagination = event;
  }
  is_before_email_verify:any=true
  fetchBasicDetails() {
    this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res["lead"];
        localStorage.setItem('lead_details', JSON.stringify(this.lead_details))
        this.custom_access=this.lead_details.user_custom_element_access
        localStorage.setItem("custom_access",this.custom_access)
        this.pid = res["lead"].project_details.id;
        this.project_id = res["lead"].project_details.id;
        this.pname = res["lead"].project_details.name;
        this.getQuotationListByStatus();
        this.is_before_email_verify=this.lead_details.is_before_email_verify
        localStorage.removeItem("boqAddedProducts");
        if (localStorage.getItem("selected_sections")) {
          localStorage.removeItem("selected_sections");
        }
      },
      (err) => {}
    );
  }

  isProjectInWip(): boolean {
    var wip_array = [
      "wip",
      "pre_10_percent",
      "10_50_percent",
      "50_percent",
      "installation",
      "on_hold",
      "inactive",
    ];
    if (
      this.lead_details.project_details &&
      this.lead_details.project_details.status &&
      wip_array.includes(this.lead_details.project_details.status)
    ) {
      return true;
    } else {
      return false;
    }
  }

  isFloorPlanUploaded(): boolean {
    var floorplan_array = [
      "floorplan_uploaded",
      "initial_proposal_submitted",
      "initial_proposal_accepted",
      "initial_proposal_rejected",
      "final_proposal_submitted",
      "final_proposal_accepted",
      "final_proposal_rejected",
    ];
    if (
      this.lead_details.project_details &&
      this.lead_details.project_details.sub_status &&
      floorplan_array.includes(this.lead_details.project_details.sub_status)
    ) {
      return true;
    } else {
      return false;
    }
  }

  fpCondition() {
    alert("Please upload floorplan and update requirement sheet");
  }

  getSections() {
    this.quotationService.getSections().subscribe(
      (res) => {
        this.sectionsList = res.sections;
        this.projectsList = res.projects;
        for (var k = 0; k < res.projects.length; k++) {
          if (res.projects[k].id == this.pid) {
            this.pname = res.projects[k].name;
            break;
          }
        }
      },
      (err) => {}
    );
  }
  canCreateFinalBOQ = false;
  
  getQuotationListByStatus() {
    this.loaderService.display(true);
    this.getQuotationslist(this.boqtype,this.boqstage,this.boqstate,this.qcstate,this.customerstate,this.paymentstate)
  }

    filters;
    boqtypes=[]
    boqstages=[]
    boqstatus=[]
    qcstatus=[]
    customerstatus=[]
    Paymentstatus=[]
    
    boqtype: any='all';
    boqstage: any='all';
    boqstate: any='all';
    qcstate: any='all'
    customerstate: any='all';
    paymentstate:any='all'
  
 

  FilterBoqs(){    
    this.loaderService.display(true);
    this.boqtype=(this.boqtype==null)?'all':this.boqtype
    this.boqstage=this.boqstage==null?'all':this.boqstage
    this.boqstate=this.boqstate==null?'all':this.boqstate
    this.qcstate=this.qcstate==null?'all':this.qcstate
    this.customerstate=this.customerstate==null?'all':this.customerstate
    this.paymentstate=this.paymentstate==null?'all':this.paymentstate
  
    this.getQuotationslist(this.boqtype,this.boqstage,this.boqstate,this.qcstate,this.customerstate,this.paymentstate)

  }
  clearAllfilters(){
    this.boqtype='all'
    this.boqstage='all'
    this.boqstate='all'
    this.qcstate='all'
    this.customerstate='all'
    this.paymentstate='all'
    this.getQuotationslist(this.boqtype,this.boqstage,this.boqstate,this.qcstate,this.customerstate,this.paymentstate)

  }

  getQuotationslist(type,stage,state,qcstate,customerstate,paymentstate){
    this.loaderService.display(true);
    this.quotationService
        .getQuotationsList(this.lead_details.project_details.id, type,stage,state,qcstate,customerstate,paymentstate)
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.quotations = res.quotations;
            this.canCreateFinalBOQ = res["can_create_final_boq"];

            this.filters=res["filter"]
            this.boqtypes=this.filters.boq_type
            this.boqstages=this.filters.boq_stage
            this.boqstatus=this.filters.boq_status

            this.qcstatus=this.filters.qc_status
            this.customerstatus=this.filters.customer_status
            this.Paymentstatus=this.filters.payment_status
          },
          (err) => {
            this.loaderService.display(false);
          }
        );
  }
 

     
 removeUnderScore(inputString) {
  let resultString = inputString.charAt(3).toUpperCase()+ inputString.slice(4);
  return resultString;
}



  leadName: any;
  relatedName: any;
  highlightRow:any;
  boqTypeValue:any='';
  selectStageValue:any=''
  importQuotationValue(pid: any,index:any) {
    this.boqTypeValue=''
    this.selectStageValue=''
    const importval = true
    $("#createquotationModal").modal("show");
    this.highlightRow=index;
    this.loaderService.display(true);
    this.quotationService.getImportQuotationListimport(pid.id,importval).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.importquotations = res;
        this.leadName = pid.attributes.lead_name;
        this.relatedName = pid.attributes.name;
        $("#onTrackModal").modal("hide");
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  showModal() {
    $("#onTrackModal").modal("show");
    $("#createquotationModal").modal("hide");
  }

  deleteBoq(id) {
    if (confirm("Are You Sure you want to delete this boq") == true) {
      this.loaderService.display(true);
      this.quotationService.deleteQuotation(this.pid, id).subscribe(
        (res) => {
          this.getQuotationListByStatus();
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = " Deleted successfully";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
        },
        (err) => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            2000
          );
        }
      );
    }
  }
  showBoqOptionsDropdown(index) {
    var htmlElem = "boqOptionsDropdown-" + index;
    document.getElementById(htmlElem).classList.toggle("show");
  }

  submitContact(value:any){
    this.quotationService.checkBoqcancreate(this.pid).subscribe(res => {
      if (res.status === 200) {
        // this.type_of_boq_created = "initial"
        $("#createBOQModalContact").modal("hide");
        $("#createquotationModal").modal("hide");
        localStorage.setItem("boqTypeCreation", "create_boq");
        localStorage.setItem("contact", value.contact);
        this.formVal2.sections.push("custom_elements");
        localStorage.setItem(
          "selected_sections",
          JSON.stringify(this.formVal2.sections)
        );
        // this.clearLocalStorage();
        // this.fetchBasicDetails();
        // this.getDropdownSpace();  
        this.createEmptyQuotation();
        // this.router.navigate(
        //   [
        //     "lead/" +
        //       this.lead_details.id +
        //       "/project/" +
        //       this.pid +
        //       "/boq_modular/create",
        //   ],
        //   {
        //     queryParams: {
        //       lead_status: this.lead_status,
        //       boq_type: "initial",
        //       boq_state: this.boqType,
        //       contact: value.contact
        //     },
        //   }
        // );
      } else {
        $("#createquotationModal").modal("hide");
        $("#createBOQModalContact").modal("hide");
        this.erroralert = true;
        this.errorMessage = res.message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
      }
    });
  }

  // onClickCreateBoq(){
  //   $("#createquotationModal").modal("show");
  //   $("#createBOQModalContact").modal("hide");
  // }
  submitFormLF(){
    console.log(this.selectBoqTypeForm1.value)
    $("#createquotationModalLF").modal("hide")
    this.checkBoqType(this.selectBoqTypeForm1.value.boqType);
    this.serviceTypeBoq('non_service')
    this.onCheckChange2('loose_furniture')
    this.submitForm(
      this.selectBoqTypeForm1.value,
      this.selectSectionTypeForm.value,
      this.importBoqForm.value
    )
  }
  CreateLFboq(){


   
   if(this.canCreateFinalBOQ) {

    $("#createquotationModalLF").modal("show")
   } else{
    this.checkBoqType('create_boq');
    this.serviceTypeBoq('non_service')
    this.onCheckChange2('loose_furniture')
    this.submitForm(
      this.selectBoqTypeForm1.value,
      this.selectSectionTypeForm.value,
      this.importBoqForm.value
    )
   }
   

  }
  formVal2: any;
  emptyContact: any = false;
  type_of_boq_created: any;
  submitForm(form1Val, form2Val, form3Val) {
    console.log(form1Val,form2Val,form3Val)
    console.log(form1Val, form2Val, form3Val);
    const contact = localStorage.getItem('contact')
    if(form1Val.serviceType == 'service' && (!contact || contact.length == 0 || contact == null || contact == '')){
      if (form1Val.boqType == 'create_boq') {
        this.type_of_boq_created = "initial"
      }
      if (form1Val.boqType == 'create_final_boq') {
        this.type_of_boq_created = "final"
      }
      $("#createquotationModal").modal("hide");
      this.formVal2 = form2Val;
      $("#createBOQModalContact").modal("show");
      this.emptyContact = true
    }else{
      if (form1Val.boqType == 'create_boq') {
        this.type_of_boq_created = "initial"
        this.quotationService.checkBoqcancreate(this.pid).subscribe(res => {
          if (res.status === 200) {
            $("#createquotationModal").modal("hide");
            localStorage.setItem("boqTypeCreation", "create_boq");
            if(this.boqType != "modular_kitchen" ){
            form2Val.sections.push("custom_elements");
          }
          else{
            if(this.custom_access){
              form2Val.sections.push("custom_elements");
            }
          }
            localStorage.setItem(
              "selected_sections",
              JSON.stringify(form2Val.sections)
            );
            if(form1Val.serviceType == 'service'){
              // this.clearLocalStorage();
              // this.fetchBasicDetails();
              // this.getDropdownSpace(); 
              this.createEmptyQuotation(); 
            }else{
              this.router.navigate(
                [
                  "lead/" +
                    this.lead_details.id +
                    "/project/" +
                    this.pid +
                    "/boq_modular/create",
                ],
                {
                  queryParams: {
                    lead_status: this.lead_status,
                    boq_type: "initial",
                    boq_state: this.boqType,
                  },
                }
              );
            }
          } else {
            $("#createquotationModal").modal("hide");
            this.erroralert = true;
            this.errorMessage = res.message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              5000
            );
          }
        });
      }
      if (form1Val.boqType == "create_final_boq") {
        this.type_of_boq_created = "final"
        $("#createquotationModal").modal("hide");
        localStorage.setItem("boqTypeCreation", "create_boq");
        form2Val.sections.push("custom_elements");
        localStorage.setItem(
          "selected_sections",
          JSON.stringify(form2Val.sections)
        );
        if(form1Val.serviceType == 'service'){
          // this.clearLocalStorage();
          // this.fetchBasicDetails();
          // this.getDropdownSpace();  
          this.createEmptyQuotation();
        }else{
          this.router.navigate(
            [
              "lead/" +
                this.lead_details.id +
                "/project/" +
                this.pid +
                "/boq_modular/create",
            ],
            {
              queryParams: {
                lead_status: this.lead_status,
                boq_type: "final",
                boq_state: this.boqType,
              },
            }
          );
        }
      }
      if (form1Val.boqType == "import_boq") {
        // this.type_of_boq_created = "import_boq"
        let isFinalBoq;
        if (form3Val.stage == "final") {
          isFinalBoq = true;
        } else if (form3Val.stage == "initial") {
          isFinalBoq = false;
        }
        this.quotationService.checkBoqcancreate(this.pid).subscribe((res) => {
          if (res.status === 200) {
            $("#createquotationModal").modal("hide");
            localStorage.setItem("boqTypeCreation", "import_boq");
            localStorage.setItem("importedBoqValues", form3Val);
            if(form1Val.serviceType == 'service'){
              // this.clearLocalStorage();
              
              // this.getDropdownSpace(); 
              this.createEmptyQuotation();
              this.fetchBasicDetails();
            }else{
              this.router.navigate(
                [
                  "lead/" +
                    this.lead_details.id +
                    "/project/" +
                    this.pid +
                    "/boq_modular/" +
                    this.importBoqId,
                ],
                {
                  queryParams: {
                    importBoq_id: form3Val.boq,
                    lead_status: this.lead_status,
                    boq_type: "import_boq",
                    boq_stage: form3Val.stage,
                    boq_state: form3Val.boqType,
                  },
                }
              );
            }
          } else {
            $("#createquotationModal").modal("hide");
            this.erroralert = true;
            this.errorMessage = res.message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              5000
            );
          }
        });
      }
      if (form1Val.boqType == "create_boq_lf") {
        // this.type_of_boq_created = "create_boq_lf"
        $("#createquotationModal").modal("hide");
        localStorage.setItem("boqTypeCreation", "create_boq_lf");
        // localStorage.setItem('selected_sections',JSON.stringify(form2Val.sections));
        if(form1Val.serviceType == 'service'){
          this.clearLocalStorage();
          this.fetchBasicDetails();
          this.getDropdownSpace(); 
          this.createEmptyQuotation()
        }else{
          this.router.navigate(["project/" + this.pid + "/boq/create"], {
            queryParams: { lead_status: this.lead_status },
          });
        }
      }
    }
  }
  quotation_id:any;
  createEmptyQuotation() {
    this.loaderService.display(true);
    var contact_num = localStorage.getItem('contact')
    var data = {
      contact: contact_num,
      quotation: {
        status: "draft",
        products: [],
        services: [],
        product_modules: [],
        boq_type: 'service',
      },
    };
    this.quotationService.postBOQData(data, this.pid , this.type_of_boq_created).subscribe((res) => {
        this.loaderService.display(false);
        this.quotation_id = res.quotation.id;
        localStorage.setItem("quotation_id", this.quotation_id);
      },
      (err) => {
        this.loaderService.display(false);
          var data = JSON.parse(err._body)
          if(data && data.id){
            this.loaderService.display(true);
            this.quotation_id = data.id;
            localStorage.setItem("quotation_id", this.quotation_id);
            this.getAIDeRedirectUrl(data.id)
          }
        // this.listOfSpacesBoqConfig();
        // this.getSelectedSections("emptyQuote");
      }
    );
  }

  getAIDeRedirectUrl(id){
    this.quotationService
    .getAIDeRedirectUrl(id)
    .subscribe(
      (res) => {
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
        if(this.boqType == 'service'){
          var data = JSON.parse(err._body)
          console.log("data****",data)
          this.successalert = true;
          this.successMessageShow(data.message);
          if(data.redirect_url && data.redirect_url != null && data.redirect_url != ""){
            setTimeout(
              function () {
                this.successalert = false;
                const updatedUrl = data.redirect_url
                window.open(updatedUrl, "_self");
              }.bind(this),
              1000
          );
          }
        }
      }
    );
  }

  getAIDeRedirectUrlService(id){
    this.quotationService
    .getAIDeRedirectUrl(id)
    .subscribe(
      (res) => {
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
       
          var data = JSON.parse(err._body)
          console.log("data****",data)
          this.successalert = true;
          this.successMessageShow(data.message);
          if(data.redirect_url && data.redirect_url != null && data.redirect_url != ""){
            setTimeout(
              function () {
                this.successalert = false;
                const updatedUrl = data.redirect_url
                window.open(updatedUrl, "_self");
              }.bind(this),
              1000
          );
          }
        
      }
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

  onCancelBoqContact() {
    $("#createBOQModalContact").modal("hide");
  }

  onCancelBoq(){
    this.leadName='';
  }
  form4val:any
  submitPresetForm(presetFormValue, Portfolio_id) {
    console.log(this.boq_project_id)
    this.quotationService
      .checkBoqcancreate(this.boq_project_id)
      .subscribe((res) => {
        if (res.status === 200) {
          $("#importBOQModal").modal("hide");
          $("#presetFormImport").modal("hide");
          $("#presetdetail").modal("hide");
          this.getQuoteContainerquit()
          this.browse_inclusion_activated = false;
          this.preset_inclusion_activated = false;
          this.preset_added_activated = false;
          localStorage.setItem("boqTypeCreation", "import_boq");
          this.form4val = {
            boq: this.boq_presetId,
            boqType: presetFormValue.boqTypepreset,
            project: this.boq_project_id,
            stage: presetFormValue.stagepreset,
          };
          localStorage.setItem("importedBoqValues", JSON.stringify(this.form4val));
          console.log(this.selectedids.length)
          console.log(Portfolio_id.length)
          // if(this.selectedids.length==1){
          //   console.log("hiiii")
          this.router.navigate(
            [
              "lead/" +
                this.lead_details.id +
                "/project/" +
                this.boq_project_id+
                "/boq_modular/" +
                this.boq_presetId,
            ],
            {
              queryParams: {
                importportfolio_id: Portfolio_id,
                lead_status: this.lead_status,
                boq_type: "import_portfolio",
                boq_state: presetFormValue.boqTypepreset,
                boq_stage: presetFormValue.stagepreset,
              },
            }
          );
          // }
          // else{
          //   console.log("hello")

          //   this.viewImportPortfolioId(this.form4val.stage)
          // }
          
       
        } else {
          $("#importBOQModal").modal("hide");
          this.erroralert = true;
          this.errorMessage = res.message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );
        }
      });
  }


  viewImportPortfolioId(stage) {
    // this.loader = true;
    // this.loaderService.display(true);
    let isFinalBoq;
    if (stage == "final") {
      isFinalBoq = true;
    } else if (stage == "initial") {
      isFinalBoq = false;
    }
    else{
      isFinalBoq = false;

    }
    console.log(this.selectedids.join(', '))
    this.quotationService
      .viewImportPortfolioDetails(
        this.boq_project_id,
        this.selectedids.join(','),
        isFinalBoq,
        this.form4val.boqType
      )
      .subscribe(
        (res) => {
          this.qid = res.quotation.id;
          // this.viewQuotationDetails();
          this.loader = false;
          this.loaderService.display(false);
        },
        (err) => {
          this.loader = false;
          this.loaderService.display(false);
        }
      );
  }

  enableImport: any = true;
  checkBoqType(val) {
    var inputs;
    if (val == "create_boq" || val == "create_final_boq") {
      this.leadName='';
      this.showTypesofBoq = true;
      this.enableImport= true;
 
      document.getElementById("selectStage").classList.remove("activeselectColor");
      inputs = document.getElementsByClassName("sectionType-class");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
      }
      inputs = document.getElementsByClassName("importType-class");
      var inputs2 = document.getElementsByClassName("importType-class1");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
        inputs[i].classList.remove("activeselectColor");
        inputs2[i].classList.remove("activeselectColor");
      }
      this.importBoqForm.reset();
      this.importBoqForm.controls["project"].setValue("");
      this.importBoqForm.controls["boq"].setValue("");
      this.importBoqForm.controls["stage"].setValue("");
      this.importBoqForm.controls["boqType"].setValue("");

      inputs = document.getElementsByClassName("sectionType-class");
      inputs2 = document.getElementsByClassName("sectionType-class1");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.add("activeselectColor");
        inputs2[0].classList.add("activeselectColor");
      }
    }
    if (val == "import_boq") {
      this.showTypesofBoq = false;
      this.enableImport = false;
      document.getElementById("selectStage").classList.add("activeselectColor");
      inputs = document.getElementsByClassName("importType-class");
      var inputs2 = document.getElementsByClassName("importType-class1");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].classList.add("activeselectColor");
        inputs2[i].classList.add("activeselectColor");
      }

      this.selectSectionTypeForm.reset();
      var formArray: FormArray;
      var j = 0;
      formArray = this.selectSectionTypeForm.get("sections") as FormArray;
      formArray.controls.forEach(() => {
        formArray.removeAt(j);
        j++;
      });

      inputs = document.getElementsByClassName("sectionType-class");
      inputs2 = document.getElementsByClassName("sectionType-class1");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
        inputs[i].checked = false;
        inputs[i].classList.remove("activeselectColor");
        inputs2[0].classList.remove("activeselectColor");
      }

      this.importProjectList();
    }
    if (val == "create_boq_lf") {
      this.showTypesofBoq = false;
      inputs = document.getElementsByClassName("sectionType-class");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
      inputs = document.getElementsByClassName("importType-class");
      var inputs2 = document.getElementsByClassName("importType-class1");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
        inputs[i].classList.remove("activeselectColor");
        inputs2[i].classList.remove("activeselectColor");
      }
      this.importBoqForm.reset();
      inputs = document.getElementsByClassName("sectionType-class");
      inputs2 = document.getElementsByClassName("sectionType-class1");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
        inputs[i].classList.remove("activeselectColor");
        inputs2[0].classList.remove("activeselectColor");
      }
    }
    this.selectBoqTypeForm1.controls["serviceType"].setValue("non_service");

  }

  onCheckChange(event) {
    var formArray: FormArray;
    formArray = this.selectSectionTypeForm.get("sections") as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }
  onCheckChange2(event) {
    var formArray: FormArray;
    formArray = this.selectSectionTypeForm.get("sections") as FormArray;
  
    formArray.push(new FormControl(event));
   
  }

  downloadboq(boqId) {
    this.quotationService.downloadboq(boqId, this.pid).subscribe(
      (res) => {
        var contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        var b64Data = JSON.parse(res._body)["excel"];
        var name = JSON.parse(res._body)["name"] + ".xlsx";
        var blob = this.b64toBlob(b64Data, contentType, 512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser =
          navigator.userAgent.indexOf("Safari") != -1 &&
          navigator.userAgent.indexOf("Chrome") == -1;
        if (isSafariBrowser) {
          //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", blobUrl);
        dwldLink.setAttribute("download", name);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  downloadPdf() {
    if (this.slectedFormat.length > 0) {
      this.loaderService.display(true);
      this.quotationService
        .downloadPdf(this.slectedFormat, this.quoteCheckId, this.pid)
        .subscribe(
          (res) => {
            $("#boqCheckModal").modal("hide");
            this.Designertype = "";
            this.Customertype = "";
            this.loaderService.display(false);
            this.slectedFormat = [];
            this.successalert = true;
            this.successMessage = " Quotation Downloaded Successfully";
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              5000
            );
            this.clearCheck();
            if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            } else if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] == null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
            } else if (
              JSON.parse(res._body)["boq_name"] == null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink1.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            }
          },
          (err) => {
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
          }
        );
    } else {
      alert("Please select atleast one format");
    }
  }

  direction: number;
  isDesc: boolean = true;
  column: string = "CategoryName";
  // Change sort function to this:
  sort(property) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  clearLocalStorage() {
    if (localStorage.getItem("quotation_id")) {
      localStorage.removeItem("quotation_id");
    }
    if (localStorage.getItem("selected_sections")) {
      localStorage.removeItem("selected_sections");
    }
  }

  changeQuotationStatus(status, qid) {
    this.loaderService.display(true);
    this.quotationService.changeStatus(qid, status, this.pid).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = "Quotation status updated successfully!";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
        this.getQuotationslist(this.boqtype,this.boqstage,this.boqstate,this.qcstate,this.customerstate,this.paymentstate)
        this.loaderService.display(false);
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          5000
        );
        this.loaderService.display(false);
      }
      
    );
  }
  callResponse: any;
  callToLead(contact) {
    this.loaderService.display(true);
    this.designerService
      .callToLead(localStorage.getItem("userId"), contact)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          if (res.inhouse_call.call_response.code == "403") {
            this.erroralert = true;
            this.errorMessage = JSON.parse(
              res.message.body
            ).RestException.Message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              10000
            );
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse = JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage =
              "Calling from - " + this.callResponse.Call.From;
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              10000
            );
          }
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  boq_remark;
  boq_remark_id;
  openBoqRemarkModal(quotationId, boqRemark) {
    this.boq_remark_id = quotationId;
    $("#boq_remarks").val(boqRemark);
  }
  openBoqRemarkModalOnhold(quotationId, boqRemark) {
    this.boq_remark_id = quotationId;
  }
  openBoqRemarkModalInactive(quotationId, boqRemark) {
    this.boq_remark_id = quotationId;
  }
  openBoqRemarkModalActive(quotationId, boqRemark) {
    this.boq_remark_id = quotationId;
  }
  onBoqRemarkSubmit() {
    this.loaderService.display(true);
    $("#statusModal1").modal("hide");
    this.boq_remark = $("#boq_remarks").val();
    var remark = {
      remark: this.boq_remark,
    };
    this.quotationService
      .subitBoqRemark(this.pid, this.boq_remark_id, remark)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.successMessage = "Remark updated successfully!";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
          this.getQuotationListByStatus();
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  boqOnholdStatus() {
    this.loaderService.display(true);
    $("#markashold").modal("hide");
    this.boq_remark = $("#boq_remarksOnhold").val();

    var remark = {
      remark: this.boq_remark,
    };
    this.quotationService
      .subitBoqRemark(this.pid, this.boq_remark_id, remark)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.successMessage = "Successfully BOQ Mark as Onhold";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
          this.getQuotationListByStatus();
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  boqInactiveStatus() {
    this.loaderService.display(true);
    $("#markasinactive").modal("hide");
    this.boq_remark = $("#boq_remarksInactive").val();

    var remark = {
      boq_status: "cancelled",
      boq_remarks: this.boq_remark,
    };
    this.quotationService
      .subitBoqRemarkInactive(this.pid, this.boq_remark_id, remark)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.successMessage = "Successfully BOQ Mark as Cancelled";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
          this.getQuotationListByStatus();
          this.loaderService.display(false);
          this.sendremark.controls["sendremarkto"].setValue("");
        },

        (err) => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );
          this.sendremark.controls["sendremarkto"].setValue("");
        }
      );
  }
  boqActiveStatus() {
    this.loaderService.display(true);
    $("#markasactive").modal("hide");
    this.boq_remark = $("#boq_remarksActive").val();

    var remark = {
      boq_status: "active",
      boq_remarks: this.boq_remark,
    };
    this.quotationService
      .subitBoqRemarkActive(this.pid, this.boq_remark_id, remark)
      .subscribe(
        (res) => {
          this.successalert = true;
          this.successMessage = "Successfully BOQ Mark as Active";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
          this.getQuotationListByStatus();
          this.loaderService.display(false);
          $("#boq_remarksActive").val("");
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );
          $("#boq_remarksActive").val("");
          this.loaderService.display(false);
        }
      );
  }
  remarkinfo: any;
  getRemarkforcancell(data: any) {
    let remarkin = data.boq_remarks;
    this.remarkinfo = remarkin;
  }
  importProjectList() {
    this.loaderService.display(true);
    this.quotationService.getImportProjectList().subscribe(
      (res) => {
        this.loaderService.display(false);
        this.importedProjectList = res;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);

        this.loaderService.display(false);
      }
    );
  }
  importBoqId: any;
  import_boq_type: any;
  getBoqType(boqId) {
    this.importquotations.forEach((data) => {
      if (data.id === boqId) {
        this.import_boq_type = data.attributes.boq_type;
      }
    });
    this.importBoqId = boqId;
  }
  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }
  ngOnDestroy() {
    $("#importBOQModal").modal("hide");
    $("#presetFormImport").modal("hide");
    $("#presetdetail").modal("hide");
    $(function () {
      $(".pop").remove();
    });
   
  }
  ngAfterViewInit() {
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }
  exportFileData: any;
  downloadsheet(quoteId){
    this.projectService
    .downloadsheet(
      this.project_id,
      this.quotationCheetId,
    )
    .subscribe(
      (data) => {
        this.exportFileData = data;
        console.log(data)
        var contentType = 'xlsx';
        var b64Data =  data['file'];
        var name =  data['file_name'];
        var blob = this.b64toBlob(b64Data, contentType, 512);
        var blobUrl = URL.createObjectURL(blob);
        let dwldLink = document.createElement('a');
        dwldLink.setAttribute('href', blobUrl);
        dwldLink.setAttribute('download', name);
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      
        this.successalert=true
        this.successMessage="Cheat sheet file has been successfully downloaded in XLSX format."
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      },
      (err) => { }
    );

  }

  downloadFile(data: any, filename: string): void {
    // Create a temporary URL for the Blob object
   
    const blob = new Blob([data], {type: 'application/xlsx'});


    // Create a temporary anchor element for downloading
    const dwldLink = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Check if the browser is Safari
    const isSafariBrowser =
        navigator.userAgent.indexOf("Safari") != -1 &&
        navigator.userAgent.indexOf("Chrome") == -1;

    // Set download link properties
    if (isSafariBrowser) {
        dwldLink.setAttribute("target", "_blank");
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${day}-${month}`;
    const file = filename + "-Cheat-Sheet-" + formattedDate + "-10.xlsx";
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", file);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);

    // Trigger the click event to initiate the download
    dwldLink.click();

    // Clean up
    document.body.removeChild(dwldLink);
}


  quotationCheetId;
  display_boq_label;
  downloadCheatSheet(quoteId) {
    this.quotationCheetId = quoteId;
    this.display_boq_label = "true";
    this.openBoq();
  }

  selected_boq_details: any;
  openBoq() {
    $(".InvoiceModal").on("contextmenu", function (e) {
      return false;
    });
    this.display_boq_label = "true" ? true : false;
    this.loaderService.display(true);
    this.projectService
      .getQuotation(
        this.project_id,
        this.quotationCheetId,
        this.display_boq_label
      )
      .subscribe(
        (res) => {
          this.selected_boq_details = res;
          console.log(this.selected_boq_details.reference_number)
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = "Something went wrong. Please try again!";
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            5000
          );
        }
      );
  }

  quoteCheckId;
  Designertype;
  downloadPdfCheck(quoteId, type) {
    this.quoteCheckId = quoteId;
    this.Designertype = type;
  }
  quoteCustomerCheckId;
  Customertype;
  downloadCustomerPdf(quoteId, type) {
    this.Customertype = type;
    this.quoteCustomerCheckId = quoteId;
  }
  slectedFormat = [];

  selectPdfFormat(event) {
    var index = this.slectedFormat.indexOf(event.target.value);

    if (event.target.checked) {
      this.slectedFormat.push(event.target.value);
    } else {
      this.slectedFormat.splice(index, 1);
    }
  }
  isChecked1;
  isChecked2;
  isChecked3;
  clearCheck() {
    this.isChecked1 = false;
    this.isChecked2 = false;
    this.isChecked3 = false;
  }
  clearCheckBox() {
    this.clearCheck();
    this.Customertype = "";
    this.Designertype = "";
  }
  replceUnderScore(string) {
    return string.split("_").join("\n");
  }
  downloadCustomerBoqPdf() {
    if (this.slectedFormat.length > 0) {
      // this.loaderService.display(true);
      this.loader = true;
      this.quotationService
        .downloadCustomerBoqPdf(
          this.slectedFormat,
          this.quoteCustomerCheckId,
          this.pid
        )
        .subscribe(
          (res) => {
            this.loader = false;
            $("#boqCheckModal").modal("hide");
            this.Customertype = "";
            this.Designertype = "";
            this.slectedFormat = [];
            this.successalert = true;
            this.successMessage = " Quotation Downloaded Successfully";
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              5000
            );
            this.clearCheck();
            if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            } else if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] == null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
            } else if (
              JSON.parse(res._body)["boq_name"] == null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink1.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            }
          },
          (err) => {
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
          }
        );
    } else {
      alert("Please select atleast one format");
    }
  }
  downloadCustomerPerSqBoqPdf() {
    if (this.slectedFormat.length > 0) {
      // this.loaderService.display(true);
      this.loader = true;
      this.quotationService
        .downloadCustomerPerSqBoqPdf(
          this.slectedFormat,
          this.quoteCustomerCheckId,
          this.pid
        )
        .subscribe(
          (res) => {
            this.loader = false;
            $("#boqCheckModal").modal("hide");
            this.Customertype = "";
            this.Designertype = "";
            this.slectedFormat = [];
            this.successalert = true;
            this.successMessage = " Quotation Downloaded Successfully";
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              5000
            );
            this.clearCheck();
            if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            } else if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] == null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
            } else if (
              JSON.parse(res._body)["boq_name"] == null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink1.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            }
          },
          (err) => {
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
          }
        );
    } else {
      alert("Please select atleast one format");
    }
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  imporBoqStage;
  importBoqStage(boqStage) {
    this.importBoqStage = boqStage;
  }

  serviceTypeBoq(value) {
    let formArray: FormArray;
    formArray = this.selectSectionTypeForm.get("sections") as FormArray;

    let inputs;
    inputs = document.getElementsByClassName("sectionType-class");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
      inputs[i].classList.add("activeselectColor");
      inputs[i].checked = false;
    }
    for (let k = 0; k <= formArray.controls.length; k++) {
      formArray.removeAt(k);
    }
    formArray.controls.length = 0;

    if (value === "service") {
      this.boqType = "service";
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
        inputs[i].classList.remove("activeselectColor");
      }
      /* Selected */
      // Add a new control in the arrayForm
      formArray.push(new FormControl("services"));
    } else {
      if (value === "non_service") {
        this.boqType = "non_service";
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = false;
          inputs[i].classList.add("activeselectColor");
        }
        let j: number = 0;
        formArray.controls.forEach((ctrl: FormControl) => {
          // Remove the service element from the arrayForm
          formArray.removeAt(j);
          return;
        });
      } else {
        this.boqType = "modular_kitchen";
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
          inputs[i].classList.remove("activeselectColor");
        }
        formArray.push(new FormControl("modular_kitchen"));
      }
    }
  }

  updatedTheme :any
  presetTypes :any
  updatedpricecategory :any
  selectType(val) {}
  getDropdownSpace() {
    this.space_name = ["Bedroom", "Kitchen", "Living", "Kids_Room"];
    this.updated_spaceName = [
      {id : 1, name : 'Kitchen'},
      {id : 2, name : 'Living'},
      {id : 3, name : 'Kids Room'},
      {id : 4, name : 'Master Bedroom'},
      {id : 5, name : 'Guest Bedroom'},
      {id : 6, name : 'Dining Room'},
      {id : 7, name : 'Bedroom'},
    ]
    this.differentShapes = [
      {id : 'rectangle', name : 'Rectangle'},
      {id : 'square', name : 'Square'},
      {id : 'l_shaped', name : 'l_Shaped'},
      {id : 'round', name : 'Round'},
      {id : 'open', name : 'Open'},
    ]

    this.presetTypes = [
      {id :12, name : 'basic'},
      {id :13, name : 'Advanced'},
      {id :14, name : 'plus'},
    ]
    this.areaRanges = [
      {id : 'rectangle', name : '<50 Sq Ft', paramvalue : '50'},
      {id : 'square', name : '50-100 Sq Ft' , paramvalue : '50-100'},
      {id : 'l_shaped', name : '100-200 Sq Ft', paramvalue : '100-200' },
      {id : 'round', name : '200-300 Sq Ft', paramvalue : '200-300'},
      {id : 'open', name : '>300 Sq Ft', paramvalue : '400'}
    ]

    this.lifestage = [
      "baby_vibes",
      "happy_vibes",
      "lively_vibes",
      "love_vibes",
      "young_vibes",
    ];
    this.updatedTheme = [
      {id : 7, name : 'Contemporary'},
      {id : 8, name : 'Indian Ethnic'},
      {id : 9, name : 'Lifestage Kitchen'},
      {id : 10, name : 'Minimalist'},
      {id : 11, name : 'Modern'},
      {id : 12, name : 'Rustic Industrial'},
      {id : 13, name : 'Transitional'},
      {id : 14, name : 'Dark Knight'},
      {id : 15, name : 'Dream Ballet'},
      {id : 16, name : 'Modica'},
      {id : 17, name : 'Morandi'},
      {id : 18, name : 'Urban Elegance'},
      {id : 19, name : 'Modern Chic'},
      {id : 20, name : 'Golden Murano'},
      {id : 21, name : 'Other'},
    ]
  

    this.theme = [
      "Contemporary",
      "Indian Ethnic",
      "Lifestage Kitchen",
      "Minimalist",
      "Modern",
      "Rustic Industrial",
      "Transitional",
    ];
      this.pricerange = [
        {
          name: "Under ₹ 2 Lakh", paramvalue : '2', id: 'p1'
        },
        { name: "₹ 2 Lakh to ₹ 4 Lakh", paramvalue : '2-4', id: 'p2'},
        { name: "₹ 4 Lakh to ₹ 6 Lakh", paramvalue : '4-6', id : 'p3' },
        { name: "₹ 6 Lakh to ₹ 8 Lakh", paramvalue : '6-8', id: 'p4'},
        { name: "₹ 8 Lakh to ₹ 10 Lakh", paramvalue : '8-10' , id: 'p5'},
        { name: "Over ₹ 10 Lakh", paramvalue : '10' , id: 'p5'}
      ]
      this.updatedpricecategory = [
        {name: "Under 3000 per Sq Ft ₹", paramvalue : '0-3000', id: 'p6'},
        { name: "3000 - 7000 per Sq Ft ₹₹", paramvalue : '3000-7000', id: 'p7'},
        { name: "Over 7000 per Sq Ft ₹₹₹", paramvalue : '7000', id : 'p8' },
      ]
  }

  space_filter_value: any = "";
  space_name3: any;
  // spaceFilter(event: any) {
  //   this.space_filter_value = event.target.value;
  //   if (this.space_filter_value !== undefined) {
  //     this.space_name3 = this.space_filter_value;
  //   } else {
  //     this.space_name3 = "";
  //   }
  //   // this.router.navigate(['/spaces'],
  //   // { queryParams: {space_name: this.space_name3, page: this.page_name_query}})
  //   this.getPortfolioList(
  //     1,
  //     this.space_filter_value,
  //     this.lifeStage_filter_value,
  //     this.theme_filter_value,
  //     "",
  //     this.per_page,
  //     "",
  //     "",
  //     "",
  //     "",
  //     ""
  //   );
  // }
  updatedSpaceArray = []
  updatedShapeArray = []
  updatedpresetTypeArray = []
  updatedThemeArray = []
  updatedLifeStageArray = []
  updatedPriceRangeArray :any
  updatedPriceCategory :any
  updatedAreaRangeArray :any
  updatedPricenameRangeArray = []
  showFavorateFilterValue : any
  searchstring :any
  displayFilters  = []
  displayFilters_theme = []
  spaceFilterUpdated(event:any,data: any, id) {
    if(event.target.checked === true){
      this.updatedSpaceArray.push(data)
      this.displayFilters.push({
        id: id,
       spaceValue : data
      })
    }else{
      var index = this.updatedSpaceArray.indexOf(data);
      this.updatedSpaceArray.splice(index, 1);
      const filteredSpace = this.displayFilters.filter((e) => {
        return e.id !== id
      })
      this.displayFilters = filteredSpace
    }
    this.optimizationfunctionforpresetfilters()
  }

  shapeFilterUpdate(event:any,data: any) {
    if(event.target.checked === true){
      this.updatedShapeArray.push(data)
    }else{
      var index = this.updatedShapeArray.indexOf(data);
      this.updatedShapeArray.splice(index, 1);
    }
    this.optimizationfunctionforpresetfilters()
  }

  presetTypeFilterUpdated(event :any , data :any){
    if(event.target.checked === true){
      this.updatedpresetTypeArray.push(data)
    }else{
      var index = this.updatedpresetTypeArray.indexOf(data);
      this.updatedpresetTypeArray.splice(index, 1);
    }
    this.optimizationfunctionforpresetfilters()
  }

  themeFilterUpdata(event:any,data: any, id:any) {
    if(event.target.checked === true){
      this.updatedThemeArray.push(data)
      this.displayFilters_theme.push({
        id: id,
        themeValue : data
      })
    }else{
      var index = this.updatedThemeArray.indexOf(data);
      this.updatedThemeArray.splice(index, 1);
      const filteredtheme = this.displayFilters_theme.filter((e) => {
        return e.id !== id
      })
      this.displayFilters_theme = filteredtheme 
    }
    this.optimizationfunctionforpresetfilters()
  }

  priceRangeUpdated(event:any,param: any , name, idd, zind){
    this.updatedPriceRangeArray = event.target.value
    this.optimizationfunctionforpresetfilters()
  }
  pricecategoryfilter(event:any){
    this.updatedPriceCategory = event.target.value
    this.optimizationfunctionforpresetfilters()
  }
  areaRangeUpdated(event:any,param: any) {
    this.updatedAreaRangeArray = event.target.value
    this.optimizationfunctionforpresetfilters()

  }
  clearAllPresetFilters(){
    this.defaultOption = true
    this.selectedItem = ''
    this.plusMoreBoolean = false
    this.plusMoretheme = false
    this.showhideforSpaceFilter = false
    this.showhideShape = false
    this.showhideFavorite = false
    this.showhideArea = false
    this.showhidePrice = false
    this.showhideTheme = false
    this.showhideLifeStage = false
    this.showhidepresetType = false
    this.showhidepresetCategory = false
    this.sortByFeatured = ''
    this.searchstring = ''
    this.sortByPrice = ''
    this.sortByArea = ''
    this.newlastthreemonths = ''
    this.sortByPopular = ''
    this.sortBybestSeller = ''
    this.updatedSpaceArray = []
    this.updatedShapeArray = []
    this.updatedThemeArray = []
    this.updatedLifeStageArray = []
    // this.updatedPriceRangeArray = []
    this.displayFilters = []
    this.displayFilters_theme = []
    this.updatedpresetTypeArray = []
    this.updatedAreaRangeArray = ''
    this.updatedPriceRangeArray = ''
    this.updatedPriceCategory = ''
    $("#favoriteupdate").prop("checked", false);
    this.showFavorateFilterValue = ''
    for(var i=0 ; i<this.updated_spaceName.length; i++ ){
      $("#spaceCheckbox" + this.updated_spaceName[i].id).prop("checked", false);
    }
    
    for(var i=0 ; i<this.differentShapes.length; i++ ){
      $("#shapeCheckbox" + this.differentShapes[i].name).prop("checked", false);
    }
    
    for(var i=0 ; i<this.updatedTheme.length; i++ ){
      $("#themeCheckbox" + this.updatedTheme[i].id).prop("checked", false);
    }
    
    for(var i=0 ; i<this.lifestage.length; i++ ){
      $("#lifeStageCheckbox" + this.lifestage[i]).prop("checked", false);
    }
    for(var i=0 ; i<this.pricerange.length; i++ ){
      $("#pricerange" + this.pricerange[i].paramvalue).prop("checked", false);
    }
    for(var i=0 ; i<this.areaRanges.length; i++ ){
      $("#arearange" + this.areaRanges[i].paramvalue).prop("checked", false);
    }
    for(var i=0 ; i<this.presetTypes.length; i++ ){
      $("#presettype" + this.presetTypes[i].name).prop("checked", false);
    }
    for(var i=0 ; i<this.updatedpricecategory.length; i++ ){
      $("#catprice" + this.updatedpricecategory[i].paramvalue).prop("checked", false);
    }
    this.getPortfolioList(
      1,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
  }
  lifeStageFilterUpdate(event:any,data: any) {
    if(event.target.checked === true){
      this.updatedLifeStageArray.push(data)
    }else{
      var index = this.updatedLifeStageArray.indexOf(data);
      this.updatedLifeStageArray.splice(index, 1);
    }
    this.optimizationfunctionforpresetfilters()

  }
  favoritefilterUpdate(event:any){
    if(event.target.checked === true){
      this.showFavorateFilterValue = true
    }else{
      this.showFavorateFilterValue = ''
    }
    this.optimizationfunctionforpresetfilters()

  }
  addfavorateicon(id , boolvalue){
    this.loaderService.display(true);
    this.portfolioService.AddFavouriteIconPreset(id,boolvalue).subscribe(res => {

      if(boolvalue){
        this.successalert = true;
        this.successMessage = "Portfolio Added To Favourite Successfully";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      }else {
        this.successalert = true;
        this.successMessage = "Portfolio Removed From Favourite Successfully";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      }

      this.loaderService.display(false);
      this.getPortfolioList(
        this.current_page,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    },(err) => {
      this.loaderService.display(false)
    })
  }

  addfavorateiconfordetail(id , bolvalue){
    this.loaderService.display(true);
    this.portfolioService.AddFavouriteIconPreset(id,bolvalue).subscribe(res => {
      this.btnClick(this.constant_similar_other)
      if(bolvalue){
        this.successalert = true;
        this.successMessage = "Portfolio Added To Favourite Successfully";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
        this.optimizationfunctionforpresetfilters()
      }else {
        this.successalert = true;
        this.successMessage = "Portfolio Removed From Favourite Successfully";
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          5000
        );
      }
      this.loaderService.display(false);
    },(err) => {
      this.loaderService.display(false)
    })
    this.optimizationfunctionforpresetfilters()
  }
  addfavorateSimilarSpace(id , bool , typeofSpace){
    if(typeofSpace == 'similarSpace'){
      this.portfolioService.AddFavouriteIconPreset(id,bool).subscribe(res => {
        console.log(res);
        this.similarSpaces(this.constant_similar_other)
        if(bool){
          this.successalert = true;
          this.successMessage = "Portfolio Added To Favourite Successfully";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
        }else {
          this.successalert = true;
          this.successMessage = "Portfolio Removed From Favourite Successfully";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
        }
  
      })
    }else{
      this.portfolioService.AddFavouriteIconPreset(id,bool).subscribe(res => {
        console.log(res);
        this.ortherSpaces(this.constant_similar_other)
        if(bool){
          this.successalert = true;
          this.successMessage = "Portfolio Added To Favourite Successfully";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
        }else {
          this.successalert = true;
          this.successMessage = "Portfolio Removed From Favourite Successfully";
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            5000
          );
        }
  
      })
    }
  }
  removeItemForSpace(data :any, type :any, spacevalu:any){
    console.log(data);
    console.log(type)
    if(type == 'space'){
      $("#spaceCheckbox" + data).prop("checked", false);
      const filtered = this.updatedSpaceArray.filter((e) => {
        return e !== spacevalu
      })
      const filteredSpace = this.displayFilters.filter((e) => {
        return e.id !== data
      })
      this.updatedSpaceArray = filtered
      this.displayFilters = filteredSpace
      this.optimizationfunctionforpresetfilters()
    }else if(type == 'shape'){
      $("#shapeCheckbox" + data).prop("checked", false);
      const filtered = this.updatedShapeArray.filter((e) => {
        return e !== data
      })
      this.updatedShapeArray = filtered
      this.optimizationfunctionforpresetfilters()

    }else if(type == 'theme'){
      $("#themeCheckbox" + data).prop("checked", false);
      const filtered = this.updatedThemeArray.filter((e) => {
        return e !== spacevalu
      })
      const filteredtheme = this.displayFilters_theme.filter((e) => {
        return e.id !== data 
      })
      this.displayFilters_theme = filteredtheme 
      this.updatedThemeArray = filtered
      this.optimizationfunctionforpresetfilters()

    }else if(type == 'lifestage'){
      $("#lifeStageCheckbox" + data).prop("checked", false);
      const filtered = this.updatedLifeStageArray.filter((e) => {
        return e !== data
      })
      this.updatedLifeStageArray = filtered
      this.optimizationfunctionforpresetfilters()
    }else if(type == 'presettype'){
      $("#presettype" + data).prop("checked", false);
      const filtered = this.updatedpresetTypeArray.filter((e) => {
        return e !== data
      })
      this.updatedpresetTypeArray = filtered
      this.optimizationfunctionforpresetfilters()

      }else if(type == 'favorite'){
      $("#favoriteupdate").prop("checked", false);
      this.showFavorateFilterValue = ''
      this.optimizationfunctionforpresetfilters()

    }else if(type == 'pricerange'){
      $("#pricerange" + data).prop("checked", false);
      this.updatedPriceRangeArray = ''
      this.optimizationfunctionforpresetfilters()

    }else if(type == 'arearange'){
      $("#arearange" + data).prop("checked", false);
      this.updatedAreaRangeArray = ''
      this.optimizationfunctionforpresetfilters()
    }else if(type == 'pricecategory') {
      this.updatedPriceCategory = ''
      $("#catprice" + data).prop("checked", false);
      this.optimizationfunctionforpresetfilters()
    }
  }
  showhideforSpaceFilter : boolean = false
  showhideShape : boolean = false
  showhideFavorite : boolean = false
  showhideArea : boolean = false
  showhidePrice : boolean = false
  showhideTheme : boolean = false
  showhideLifeStage : boolean = false
  showhidepresetType : boolean = false
  showhidepresetCategory : boolean = false
  showHideForFilters(type :any){
    if(type == 'space'){
      this.showhideforSpaceFilter = !this.showhideforSpaceFilter
    }else if(type == 'shape'){
      this.showhideShape = !this.showhideShape
    }else if(type == 'favorite'){
      this.showhideFavorite = !this.showhideFavorite
    }else if(type == 'area_range'){
      this.showhideArea = !this.showhideArea
    }else if(type == 'price_range'){
      this.showhidePrice = !this.showhidePrice
    }else if(type == 'theme'){
      this.showhideTheme = !this.showhideTheme
    }else if(type == 'lifestage'){
      this.showhideLifeStage = !this.showhideLifeStage
    }else if(type == 'presettype'){
      this.showhidepresetType = !this.showhidepresetType
    }else if(type == 'price_category'){
      this.showhidepresetCategory = !this.showhidepresetCategory
    }
  }

  plusMoreBoolean : boolean = false
  plusMoretheme : boolean = false
  plusMore(type :any){
    if(type == 'space'){
      this.plusMoreBoolean = !this.plusMoreBoolean
    }
    if(type == 'theme'){
      this.plusMoretheme = !this.plusMoretheme
    }
  }
  searchFilter(e: any) {
    this.searchstring = e.target.value;
    this.getPortfolioList(
      1,
      this.updatedSpaceArray,
      this.updatedLifeStageArray,
      this.updatedThemeArray,
      this.updatedPriceRangeArray,
      this.per_page,
      this.searchstring,
      this.updatedShapeArray,
      this.updatedAreaRangeArray,
      this.showFavorateFilterValue,
      "",
      this.updatedpresetTypeArray,
      this.sortByFeatured,
      this.sortByArea,
      this.sortByPrice,
      this.newlastthreemonths,
      this.sortByPopular,
      this.sortBybestSeller,
      this.updatedPriceCategory
    );

  }
  // lifeStage_filter_value: any = '';
  // lifeStageFilter(event: any) {
  //   this.lifeStage_filter_value = event.target.value;
  //   if (this.lifeStage_filter_value === "young vibes") {
  //     this.lifeStage_filter_value = "young_vibes";
  //   }
  //   if (this.lifeStage_filter_value === "love vibes") {
  //     this.lifeStage_filter_value = "love_vibes";
  //   }
  //   if (this.lifeStage_filter_value === "baby vibes") {
  //     this.lifeStage_filter_value = "baby_vibes";
  //   }
  //   if (this.lifeStage_filter_value === "happy vibes") {
  //     this.lifeStage_filter_value = "happy_vibes";
  //   }
  //   if (this.lifeStage_filter_value === "lively vibes") {
  //     this.lifeStage_filter_value = "lively_vibes";
  //   }
  //   this.getPortfolioList(
  //     1,
  //     this.space_filter_value,
  //     this.lifeStage_filter_value,
  //     this.theme_filter_value,
  //     "",
  //     this.per_page,
  //     "",
  //     "",
  //     "",
  //     "",
  //     ""
  //   );
  // }
  showAllSimilarSpaces :any
  showOtherSpaces :any

  SimilarSpaceItems :any
  SimilarItemsPage :any
  SimilarPerPage :any
  SimilarTotalPages :any
  StoreIdForSimilar :any
  similarSpaces(id:any){
    this.StoreIdForSimilar = id
    this.loaderService.display(true)
    if(this.SimilarItemsPage === undefined){
      this.SimilarItemsPage = 1
    }
    if(this.SimilarPerPage === undefined){
      this.SimilarPerPage = 4
    }
    this.portfolioService
    .getSimilarSpaces(id , this.SimilarItemsPage , this.SimilarPerPage)
    .subscribe((res) => {
      this.loaderService.display(false)
       res = res.json();
      this.showAllSimilarSpaces = res
      this.SimilarTotalPages = Math.ceil((this.showAllSimilarSpaces.total_space) / 4)
    },(err) => {
      console.log(err)
    });
  }
  nextPageForSimilar(){
    this.SimilarItemsPage++
    this.portfolioService.getSimilarSpaces(this.StoreIdForSimilar, this.SimilarItemsPage , this.SimilarPerPage).subscribe(res => {
      res = res.json();
      this.showAllSimilarSpaces = res
    })
  }
  previousPageSimilar(){
    this.SimilarItemsPage--
    this.portfolioService.getSimilarSpaces(this.StoreIdForSimilar , this.SimilarItemsPage , this.SimilarPerPage).subscribe(res => {
      res = res.json();
      this.showAllSimilarSpaces = res
    })
  }

  otherItemsPage :any
  otherItemsperpage  :any
  otherTotalpages :any
  otherIdSpaces :any
  ortherSpaces(id:any){
    this.StoreIdForSimilar = id
    this.loaderService.display(true)
    if(this.otherItemsPage === undefined){
      this.otherItemsPage = 1
    }
    if(this.otherItemsperpage === undefined){
      this.otherItemsperpage = 4
    }

    this.portfolioService
    .getOrtherSpaces(id , this.otherItemsPage , this.otherItemsperpage)
    .subscribe((res) => {
      this.loaderService.display(false)
       res = res.json();
      this.showOtherSpaces = res
      this.otherTotalpages = Math.ceil((this.showOtherSpaces.total_space) / 4)
    },(err) => {
      console.log(err)
    });
  }

  nextPageForOtherSpaces(){
    this.otherItemsPage++
    this.portfolioService.getOrtherSpaces(this.StoreIdForSimilar, this.otherItemsPage , this.otherItemsperpage).subscribe(res => {
      res = res.json();
      this.showOtherSpaces = res
    })
  }

  prevesiousPageForOtherSpaces(){
    this.otherItemsPage--
    this.portfolioService.getOrtherSpaces(this.StoreIdForSimilar, this.otherItemsPage , this.otherItemsperpage).subscribe(res => {
      res = res.json();
      this.showOtherSpaces = res
    })
  }

  // theme_filter_value: any = '';
  // themeFilter(event: any) {
  //   this.theme_filter_value = event.target.value;
  //   this.getPortfolioList(
  //     1,
  //     this.space_filter_value,
  //     this.lifeStage_filter_value,
  //     this.theme_filter_value,
  //     "",
  //     this.per_page,
  //     "",
  //     "",
  //     "",
  //     "",
  //     ""
  //   );
  // }

  // loader: boolean = false;
  headers_res;
  sortByFeatured :any
  sortByArea :any
  sortByPrice :any
  sortByPopular :any
  sortBybestSeller :any
    getPortfolioList(
    curr_page: any,
    space: any,
    lifeStage: any,
    theme: any,
    range: any,
    per_page: any,
    search_string: any,
    spaceShape :any,
    area_range :any,
    is_favourt :any,
    is_segment :any,
    typeofpreset :any,
    sortbyfeature :any,
    sortbyarea :any,
    sortbyprice:any,
    newlast :any,
    popular :any,
    bestseller :any,
    catprice :any,
    selected_preset_ids?,
  )
  
  {
    this.loaderService.display(true)
    if (space === undefined) {
      space = [];
    }
    if (lifeStage === undefined) {
      lifeStage = "";
    }
    if (theme === undefined) {
      theme = "";
    }
    if (range === undefined) {
      range = "";
    }
    if (per_page === undefined) {
      per_page = 15;
    }
    if (search_string === undefined) {
      search_string = "";
    }

    if (spaceShape === undefined) {
      spaceShape = "";
    }
    if (area_range === undefined) {
      area_range = "";
    }

    if (is_favourt === undefined) {
      is_favourt = "";
    }
    if (is_segment === undefined) {
      is_segment = "";
    }
    if(this.sortByFeatured === undefined){
      this.sortByFeatured = ''
    }

    if(this.sortByArea === undefined){
      this.sortByArea = ''
    }

    if(this.sortByPrice === undefined){
      this.sortByPrice = ''
    }
    if(this.newlastthreemonths === undefined){
      this.newlastthreemonths = ''
    }
    if(this.sortByPopular === undefined){
      this.sortByPopular = ''
    }
    if(this.sortBybestSeller === undefined) {
      this.sortBybestSeller = ''
    }
        

    if(this.updatedPriceCategory === undefined) {
      this.updatedPriceCategory = ''
    }
    if(selected_preset_ids === undefined) {
      selected_preset_ids = ''
    }
    console.log(this.selectedids)
    this.portfolioService
      .updatednewportfoliolist(
        curr_page,
        space,
        lifeStage,
        theme,
        range,
        per_page,
        search_string,
        spaceShape,
        area_range,
        is_favourt,
        is_segment,
        typeofpreset,
        sortbyfeature,
        sortbyarea,
        sortbyprice,
        newlast,
        popular,
        bestseller,
        catprice,
        selected_preset_ids
      )
      .subscribe((res) => {
        this.loaderService.display(false)
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page");
        this.total_page = this.headers_res.get("x-total");
        this.current_page = this.headers_res.get("x-page");
        res = res.json();

        this.list = res;
        this.loader = false;
      },(err) => {
        this.loaderService.display(false)
      });
  }

  price_filter_value: any = "";
  final_price: any = [];
  // priceFilter(event: any) {
  //   this.price_filter_value = event.target.value;
  //   if (this.price_filter_value === "Under ₹ 1 Lakh") {
  //     this.final_price = JSON.stringify([
  //       [0, 10000],
  //       [10000, 100000],
  //     ]);
  //   }
  //   if (this.price_filter_value === "₹ 1 Lakh to ₹ 2 Lakh") {
  //     this.final_price = JSON.stringify([
  //       [100000, 200000],
  //       [100000, 200000],
  //     ]);
  //   }
  //   if (this.price_filter_value === "₹ 2 Lakh to ₹ 3 Lakh") {
  //     this.final_price = JSON.stringify([
  //       [200000, 300000],
  //       [200000, 300000],
  //     ]);
  //   }
  //   if (this.price_filter_value === "₹ 3 Lakh to ₹ 4 Lakh") {
  //     this.final_price = JSON.stringify([
  //       [300000, 400000],
  //       [300000, 400000],
  //     ]);
  //   }
  //   if (this.price_filter_value === "Over ₹ 4 Lakh") {
  //     this.final_price = JSON.stringify([
  //       [400000, 1000000],
  //       [1000000, 130000000],
  //     ]);
  //   }

  //   this.getPortfolioList(
  //     1,
  //     this.space_filter_value,
  //     this.lifeStage_filter_value,
  //     this.theme_filter_value,
  //     this.final_price,
  //     this.per_page,
  //     "",
  //     "",
  //     "",
  //     "",
  //     ""
  //   );
  // }
  browse_inclusion_activated: boolean = true;
  preset_inclusion_activated: boolean = false;
  constant_similar_other : any 
  btnClick(id: any) {
    $('#importBOQModal').animate({ scrollTop: 0 }, 'slow');
    this.SimilarItemsPage = 1
    this.otherItemsPage = 1
    this.preset_inclusion_activated = true;
    this.browse_inclusion_activated = false;
    this.constant_similar_other = id
    this.getData(id);
    this.similarSpaces(this.constant_similar_other)
    this.ortherSpaces(this.constant_similar_other)
  }
  btnClick2(id) {
    $("#importBOQModal").modal("show");
    this.preset_inclusion_activated = true;
    this.browse_inclusion_activated = false;
    this.getData(id);
    this.showin = true;
  }

  closeModalpreset() {
    this.browse_inclusion_activated = true;
    this.preset_inclusion_activated = false;
    this.space_drop = "";
    this.lifestage_drop = "";
    this.theme_drop = "";
    this.price_drop = "";
    this.selectedItem = ""
    this.clearAllPresetFilters()
  }

  space_drop;
  lifestage_drop;
  theme_drop;
  price_drop;
  closePresetModal() {
    this.SimilarItemsPage = 1
    this.otherItemsPage = 1
    if (this.showin == true) {
      $("#presetdetail").modal("hide");
      $("#importBOQModal").modal("hide");
      this.showin = false;
    } else {
      this.browse_inclusion_activated = true;
      this.preset_inclusion_activated = false;
    }
  }
  preset_added_activated:any=false
  closemodal(){
    $("#presetdetail").modal("hide");
    this.getPortfolioList(
      1,
      "",
        "",
         "",
          "",
           this.per_page,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          this.selectedids
      );

  }

  presetadded(){
    $("#presetdetail").modal("show");

  }
  addedpresets:any=[]
  selectedids:any=[]
  totalvalue=0
  selectedtype:any=''
  addpresets(portfolio){
    this.current_page=this.current_page[0]
    let canadd=true
    this.selectedtype=portfolio.quotation_details.quotation_type
    if(portfolio.space=='All Spaces'){
      this.selectedtype='allspace'
    }
    for(let obj of this.addedpresets){
      if(obj.space==portfolio.space){
        canadd=false
      }
    }
    if(canadd){
    this.addedpresets.push(portfolio)
    this.selectedids.push(portfolio.id)
    this.totalvalue=this.totalvalue+parseFloat(portfolio.boq_value)
    console.log(this.current_page)
    this.getPortfolioList(
      this.current_page,
      this.updatedSpaceArray,
      this.updatedLifeStageArray,
      this.updatedThemeArray,
      this.updatedPriceRangeArray,
      this.per_page,
      this.searchstring,
      this.updatedShapeArray,
      this.updatedAreaRangeArray,
      this.showFavorateFilterValue,
      "",
      this.updatedpresetTypeArray,
      this.sortByFeatured,
      this.sortByArea,
      this.sortByPrice,
      this.newlastthreemonths,
      this.sortByPopular,
      this.sortBybestSeller,
      this.updatedPriceCategory,
      this.selectedids
    );
    this.getDetailsimportPortfolio(portfolio.id)
    }
    else{
      this.erroralert = true;
            this.errorMessage = "Selected space is already added";
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );

    }
    console.log(this.addedpresets)
  }

  portfoliodetails
  opendetails(portfolio){
    this.portfoliodetails=portfolio.portfolio_details
    $("#presetiddetails").modal("show");

  }


  deleteitem(id){
    const indexToDelete = this.selectedids.indexOf(id);
    if (indexToDelete !== -1) {
      console.log(this.addedpresets[indexToDelete].boq_value)
      this.totalvalue=this.totalvalue-this.addedpresets[indexToDelete].boq_value
      this.totalvalue=this.totalvalue < 0 ? 0 :this.totalvalue
      this.selectedids.splice(indexToDelete, 1);
      this.addedpresets.splice(indexToDelete, 1);
    } 
    if(this.selectedids.length==0){
      this.selectedtype=''
    }
   }
   isofsametype(portfolio){
    if(this.selectedtype){
      
      if(portfolio.quotation_details.quotation_type==this.selectedtype){
        if(portfolio.space == 'All Spaces'){
          return false
        }
        if(this.selectedtype!='service'){
          return true
        }
        else{
          if(portfolio.is_addable){
            return true
          }
          else{
            return false
          }
        }
        
              }
      else{
        return false
      }
    }
    else{
      return true
    }
   }

  isPortfolioAdded(portfolio: any): boolean {
    
    return this.addedpresets.some(obj => obj.id === portfolio.id);
  }
  selectedrow:any
  toggleRow(id){
    if(this.selectedrow==id){
      this.selectedrow=''
    }
    else{
    this.selectedrow=id
    }
  }


  transform(value: string): string {
    return value.replace(/_/g, " ");
  }

  id: any;
  selected_item_data: any = [];
  fetchData: any;
  loader: boolean = false;
  portfolio_id;
  pid1;
  // quoteCustomerCheckId: any;
  storeCaroselImgesInSpresdArray : any = []
  getData(id) {
    this.selected_item_data = [];
    this.loaderService.display(true)
    this.portfolioService.getPortfolios(id).subscribe((data) => {
      this.loaderService.display(false)
      this.fetchData = data;
      this.pid1 = this.fetchData.portfolio.quotation_details.project_id;
      this.quoteCustomerCheckId1 =
        this.fetchData.portfolio.quotation_details.quotation_id;
      this.portfolio_id = this.fetchData.portfolio.id;

      let firstImage = this.fetchData.portfolio.attachment_file
      let secondaryImages = this.fetchData.portfolio.contents.map(e => {
        return e.attributes.document
      })
      this.storeCaroselImgesInSpresdArray = [firstImage, ...secondaryImages]
    });
  }

  slectedFormat1: any = "boq";
  quoteCustomerCheckId1: any;
  downloadCustomerBoqPdfPreset() {
    if (this.slectedFormat1.length > 0) {
      this.loaderService.display(true);
      // this.loader = true;
      this.quotationService
        .downloadCustomerBoqPdf(
          this.slectedFormat1,
          this.quoteCustomerCheckId1,
          this.pid1
        )
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            // this.loader = false;
            this.slectedFormat1 = [];
            this.successalert = true;
            this.successMessage = "Quotation Downloaded Successfully";
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              5000
            );
            // this.clearCheck();
            if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            } else if (
              JSON.parse(res._body)["boq_name"] != null &&
              JSON.parse(res._body)["service_name"] == null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["quotation_base_64"];
              var name = JSON.parse(res._body)["boq_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser) {
                //if Safari open in new window to save file with random filename.
                dwldLink.setAttribute("target", "_blank");
              }
              dwldLink.setAttribute("href", blobUrl);
              dwldLink.setAttribute("download", name);
              dwldLink.style.visibility = "hidden";
              document.body.appendChild(dwldLink);
              dwldLink.click();
              document.body.removeChild(dwldLink);
            } else if (
              JSON.parse(res._body)["boq_name"] == null &&
              JSON.parse(res._body)["service_name"] != null
            ) {
              var contentType = "application/pdf";
              var b64Data = JSON.parse(res._body)["service_base_64"];
              var name = JSON.parse(res._body)["service_name"];
              var blob = this.b64toBlob(b64Data, contentType, 512);
              var blobUrl = URL.createObjectURL(blob);
              // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              let dwldLink1 = document.createElement("a");
              // let url = URL.createObjectURL(blob);
              let isSafariBrowser1 =
                navigator.userAgent.indexOf("Safari") != -1 &&
                navigator.userAgent.indexOf("Chrome") == -1;
              if (isSafariBrowser1) {
                //if Safari open in new window to save file with random filename.
                dwldLink1.setAttribute("target", "_blank");
              }
              dwldLink1.setAttribute("href", blobUrl);
              dwldLink1.setAttribute("download", name);
              dwldLink1.style.visibility = "hidden";
              document.body.appendChild(dwldLink1);
              dwldLink1.click();
              document.body.removeChild(dwldLink1);
            }
          },
          (err) => {
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err["_body"]).message;
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
          }
        );
    }
  }

  boq_type11;
  check_import: boolean = false;
  create_final_boq: boolean = false;
  boq_presetId;
  boq_project_id;
  getDetailsimportPortfolio(portfolioId: any) {
    this.leadService
      .getDetailimportportfolio(portfolioId, this.project_id)
      .subscribe((res) => {
        this.create_final_boq = res.can_create_final_boq;
        this.boq_type11 = res.boq_type;
        this.boq_presetId = res.boq_id;
        this.boq_project_id = res.project_id;
      });
  }

  importboqmodalopen() {
    this.selectedItem = ''
    this.selectedtype=''
    this.defaultOption = true
    this.flag = false
    this.selectedids=[]
    this.addedpresets=[]
    $("#importBOQModal").modal("show");
    this.browse_inclusion_activated = true;
    this.preset_inclusion_activated = false;
    this.space_drop = "";
    this.lifestage_drop = "";
    this.theme_drop = "";
    this.price_drop = "";
    this.space_filter_value = "";
    this.lifeStage_filter_value = "";
    this.theme_filter_value = "";
    this.getPortfolioList(
      1,
      "",
        "",
         "",
          "",
           this.per_page,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
      );
  }

  searchValue: any = "";
  boqSearchInputValue:any=''
  onSearchInput(event: any) {
    this.searchValue = event.target.value;
  }
  heading: any = "Import BOQ - Select Project";
  boqTableData: any = [];
  page: any = 1;
  itemPerPage = 10;
  headers_res2: any;
  per_page2: number;
  total_page2: any;
  current_page2: number;
  gmListdata:any=[]
  gm_Id:any=''
  cm_Id:any=''
  designer_Id:any=''
  selectProjectHandle(e?: any) {
    e = e ? e : "";

    this.loaderService.display(true);
    this.leadService
      .boqProjectData(e, 10, this.searchValue,this.gm_Id,this.cm_Id,this.designer_Id).subscribe((res) => {
        this.boqTableData = [];
        this.headers_res2 = res.headers._headers;
        this.per_page2 = this.headers_res2.get("x-per-page");
        this.total_page2 = this.headers_res2.get("x-total");
        this.current_page2 = this.headers_res2.get("x-page");
        res = res.json();
        this.boqTableData = res;
      });
      this.leadService.getGmCmDesignerList(this.gm_Id,this.cm_Id).subscribe((res)=>{
      this.gmListdata=[]
       this.gmListdata=res;
       this.cmListData=res;
       
        this.loaderService.display(false);

      })
  }
  selectedGmId:any='';
  selectedCmId: any='';
  cmListData:any =[];
  gmfilteritem:any='';
  cmfilteritem:any='';
  designfilteritem:any='';
getGmCmDesignerListData(id:any, text:any){
  if(text == 'gmData' && id !==undefined){
    this.cmListData=[];
    this.selectedGmId = id;
    this.gm_Id=id;
    this.cm_Id='';
this.selectedCmId='';
this.designer_Id=''
this.cmfilteritem=''
this.designfilteritem=''
    this.leadService.getGmCmDesignerList(this.selectedGmId,this.selectedCmId).subscribe((res)=>{
      this.cmListData=res;
        })
        this.selectProjectHandle();
  }else if(text == 'gmData' && id ==undefined){
    this.selectedGmId='';
    this.gm_Id='';
    this.cm_Id='';
    this.selectedCmId='';
    this.designer_Id=''
    this.gmfilteritem=''
    this.cmfilteritem=''
    this.designfilteritem=''
    this.leadService.getGmCmDesignerList(this.selectedGmId,this.selectedCmId).subscribe((res)=>{
      this.cmListData=res;
        })
        this.selectProjectHandle();
  }
  if(text == 'cmData' && id !==undefined){
  this.selectedCmId=id;
  this.cm_Id=id;
  this.designer_Id=''
this.designfilteritem=''
  this.leadService.getGmCmDesignerList(this.selectedGmId,this.selectedCmId).subscribe((res)=>{
    this.cmListData=res;
      })
      this.selectProjectHandle();
  }else if(text == 'cmData' && id ==undefined){
    this.selectedCmId=''
    this.cm_Id=''
    this.designer_Id=''
    this.cmfilteritem=''
this.designfilteritem=''
    this.leadService.getGmCmDesignerList(this.selectedGmId,this.selectedCmId).subscribe((res)=>{
      this.cmListData=res;
        })
        this.selectProjectHandle();
  }

}
  onDesignerChangeHandle(event:any){
    this.designer_Id=''
    if(event!==undefined){
      this.designer_Id=event;
    }else{
      this.designfilteritem='';
    }
    this.selectProjectHandle();
  }
  refreshBoqModalData(){
    $("#createquotationModal").modal("show");
    this.boqTableData=[];
    this.gm_Id='';
    this.gmfilteritem='';
    this.cmfilteritem='';
    this.cm_Id='';
    this.designfilteritem='';
    this.designer_Id='';
    this.searchValue='';
    this.boqSearchInputValue='';
  }

  copyLink(link){
    const selBox = document.createElement("textarea");

    selBox.style.position = "fixed";

    selBox.style.left = "0";

    selBox.style.top = "0";

    selBox.style.opacity = "0";

    selBox.value = link+'&deltauser=true">';

    document.body.appendChild(selBox);

    selBox.focus();

    selBox.select();

    document.execCommand("copy");

    document.body.removeChild(selBox);

    this.successalert = true;

    this.successMessage = "Link Copied Successfully";

    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),

      5000
    );    
  
  }
  onReadLessMore(value){
    if(value == 'less'){
      this.readMore = false;
    }else{
      this.readMore = true;
    }
  }

  importpresetFormmodal(){
    $("#presetFormImport").modal("show");
  }
  selectedItem :any
  sortByFilter(e:any){
    this.selectedItem =e
    this.flag = false;
    this.defaultOption = false
    this.sortByFeatured = ''
    this.sortByPrice = ''
    this.sortByArea = ''
    this.newlastthreemonths = ''
    this.sortByPopular = ''
    this.sortBybestSeller = ''

    if(this.selectedItem === 'featured'){
      this.sortByFeatured = true
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }else if(this.selectedItem === 'price_high'){
      this.sortByPrice = false
      this.selectedItem = 'High to Low'
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }else if(this.selectedItem == 'price_low'){
      this.sortByPrice = true
      this.selectedItem = 'Low to High'

      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }else if(this.selectedItem == 'is_new'){
      this.newlastthreemonths = 1
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }
    else if(this.selectedItem === 'area_high'){
      this.sortByArea = false
      this.selectedItem = 'High to Low'
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }else if(this.selectedItem === 'popular'){
      this.sortByPopular = 1
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }else if(this.selectedItem === 'bestseller'){
      this.sortBybestSeller = 1
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }
    else if(this.selectedItem === 'all'){
      this.sortByFeatured = ''
      this.sortByPrice = ''
      this.sortByArea = ''
      this.newlastthreemonths = ''
      this.sortByPopular = ''
      this.sortBybestSeller = ''
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }else {
      this.sortByArea = true
      this.selectedItem = 'Low to High'
      this.getPortfolioList(
        1,
        this.updatedSpaceArray,
        this.updatedLifeStageArray,
        this.updatedThemeArray,
        this.updatedPriceRangeArray,
        this.per_page,
        this.searchstring,
        this.updatedShapeArray,
        this.updatedAreaRangeArray,
        this.showFavorateFilterValue,
        "",
        this.updatedpresetTypeArray,
        this.sortByFeatured,
        this.sortByArea,
        this.sortByPrice,
        this.newlastthreemonths,
        this.sortByPopular,
        this.sortBybestSeller,
        this.updatedPriceCategory
      );
    }
  }

  flag : boolean = false
  defaultOption :boolean =  true;
  selectStatus() {
    this.flag = !this.flag;
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    this.flag = false
   }
  optimizationfunctionforpresetfilters(){
    this.getPortfolioList(
      1,
      this.updatedSpaceArray,
      this.updatedLifeStageArray,
      this.updatedThemeArray,
      this.updatedPriceRangeArray,
      this.per_page,
      this.searchstring,
      this.updatedShapeArray,
      this.updatedAreaRangeArray,
      this.showFavorateFilterValue,
      "",
      this.updatedpresetTypeArray,
      this.sortByFeatured,
      this.sortByArea,
      this.sortByPrice,
      this.newlastthreemonths,
      this.sortByPopular,
      this.sortBybestSeller,
      this.updatedPriceCategory
    );
  }

  ApproveRejectBOQ(status , id){
      this.loaderService.display(true)
      this.portfolioService.approveRejectBuApproval(status,id, this.project_id).subscribe(res => {
        this.loaderService.display(false)
        this.getQuotationListByStatus();
      }, (err) => {
        console.log(err);
      })
  }

  runJobPromo(){
    this.loaderService.display(true)
    this.portfolioService.promojobs(this.project_id).subscribe((res) => {
      this.loaderService.display(false);
      this.successalert = true;
      this.successMessage = res.message
      setTimeout(
        function () {
          this.successalert = false;
        }.bind(this),
        2000
      );
    },(err) => {
      console.log(err);
    })

  }
  tagGetter(port){
    let portfolio;


    if(port.featured){
      portfolio = 'Featured'
    } else{
      if(port.bestseller == '1' ){
        portfolio = 'Bestseller'
      } else{
        if(port.is_new){
          portfolio = 'New'
        } else{
          if(port.popular){
            portfolio = 'Popular'
          } 
          else{
            portfolio = ''
          }
        }
      }
    }

    if(this.selectedItem == 'featured'){
      if(port.featured){
        portfolio = 'Featured'
      }
    } 
    if(this.selectedItem == 'bestseller'){
      if(port.bestseller == '1' ){
       portfolio = 'Bestseller'
     }
    }
     if(this.selectedItem == 'is_new'){
      if(port.is_new){
        portfolio = 'New'
      }
    }
      if(this.selectedItem == 'popular'){
            
        if(port.popular == '1'){
          portfolio = 'Popular'
        } 
      }

    return portfolio

  }
  imagesgetter(url){
    const img = new Image();
    let urlsrc;
    img.src = url;
    img.onload = () => {
       urlsrc = url
    };

    img.onerror = () => {
     urlsrc = '../../../assets/img/default-apartment.png'
     
    };

    return urlsrc

  }
  csvData: any
  p1: any;
  canUpdateBoq:any;
  quotationsCheck:any;
  qid
  fetchUrl(id,quotation) {

    this.quotationsCheck = quotation;
    this.p1 = 1;
    this.qid = quotation.id;
   
    this.loaderService.display(true);
    this.leadService.FetchUrl(id).subscribe(
      (res) => {
        this.loaderService.display(false);
        console.log(res);
        this.csvData = res.data.result[0].boq_details
        $("#csvModal").modal("show");
        this.canUpdateBoq = res.can_update_service_boq
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          3000
        );
      }
    );
  }
  editButtonClick() {
  
      // this.successalert = true;
      // this.successMessageShow("You are being redirected to AIDE website to edit the service BOQ.");
      this.getAIDeRedirectUrlService(this.qid)
      // setTimeout(
      //   function () {
      //     this.successalert = false;
      //     window.open(this.aide_redirection_url, "_blank");
      //   }.bind(this),
      //   1000
      // );
  
  }

  getQuoteContainer() { 
    console.log("hi");
    $("#getQuoteModalHeader").modal("show");
    $("#get-quote-container-header").addClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();

    $(".get-quote-wrapper").animate({
      width: "toggle",
    });

  }

  getQuoteContainerquit() {
    $("#getQuoteModalHeader").modal("hide");
    $("#get-quote-container-header").removeClass(
      "get-quote-container-header-show"
    );
    $(".get-quote-wrapper").hide();

    this.getPortfolioList(
      this.current_page,
      this.updatedSpaceArray,
      this.updatedLifeStageArray,
      this.updatedThemeArray,
      this.updatedPriceRangeArray,
      this.per_page,
      this.searchstring,
      this.updatedShapeArray,
      this.updatedAreaRangeArray,
      this.showFavorateFilterValue,
      "",
      this.updatedpresetTypeArray,
      this.sortByFeatured,
      this.sortByArea,
      this.sortByPrice,
      this.newlastthreemonths,
      this.sortByPopular,
      this.sortBybestSeller,
      this.updatedPriceCategory
    );
   
  }




}
