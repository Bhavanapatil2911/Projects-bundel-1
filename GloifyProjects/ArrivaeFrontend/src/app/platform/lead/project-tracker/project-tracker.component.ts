import { Component,OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import {
  Routes,
  RouterModule,
  Router,
  ActivatedRoute,
  Params,
} from "@angular/router";
import { environment } from "environments/environment";
import { Location } from "@angular/common";
import { LoaderService } from "../../../services/loader.service";
import { LeadService } from "../../lead/lead.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: "app-project-tracker",
  templateUrl: "./project-tracker.component.html",
  styleUrls: ["./project-tracker.component.scss","../calender/calender.component.css"],
  providers: [LeadService],
})
export class ProjectTrackerComponent implements OnInit {

  processedHtml: SafeHtml;
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  public lead_id: any;
  lead_details;
  public role: string;
  lead_status;
  initLoader: any = true;
  emailverified: boolean;
  customer_status;
  project_id: any;
  is_before_email_verify: any = true;
  bu_head_approved_email: any;
  is_proposal_shared: any;
  iconverified: any;
  milestones: any[] = [];
  progress:any;
  filterTypes:any = '';
  filterTypesOptions:any = ['MOM', 'Note', 'NOC Date Update'];


  allSpaceEventDetails:any = {}
  currentSpaceDetails:any = {}
  activeIndexAccordion: number | null = null; 
  activeIndex:any = 0;
  currentDetail:any = {}

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scrollPosition: number = 0;
  maxScrollPosition: number = 0;

  @ViewChild('imagePaginationTwo') imagePaginationTwo!: ElementRef;
  isImageScrollLeftDisabled: boolean = true;   // Initially left scroll button hidden
  isImageScrollRightDisabled: boolean = false; 

  otpDigits: string[] = new Array(6).fill('');

  constructor(
    public activatedRoute: ActivatedRoute,
    private _location: Location,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    public leadService: LeadService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}


  options={
      "order_booking" : "Order Booking",
      "site_measurement": "Post Bid Site Measurement",
      "design_iteration": "Design Iteration",
      "material_selection":"Material Selection",
      "site_validation":"Site Validation",
      "qc_start":"QC Start",
      "qc_approved":"QC Approved",
      "final_boq_shared":"Final BOQ Shared",
      "final_boq_approved":"Final BOQ Approved",
      "forty_per_payment":"40% Payment"
    }
  

  ngOnInit() {
    this.iconverified = localStorage.getItem("emailverified") == "true";
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
    });
    this.route.queryParams.subscribe((params) => {
      this.lead_status = params["lead_status"];
      this.customer_status = params["customer_status"];
    });
    this.role = localStorage.getItem("user");
    this.customer_status = localStorage.getItem("customer_status");
    this.fetchBasicDetails();
  }

  ngAfterViewInit(){
    this.calculateMaxScroll();
    this.checkImageScrollButtons();
  }


  project_status:any;
Lead_id:any
  fetchBasicDetails() {
    this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res["lead"];
        localStorage.setItem("lead_details", JSON.stringify(this.lead_details));
        this.project_id = res["lead"].project_details.id;
        this.Lead_id = res["lead"].id
        this.is_before_email_verify = this.lead_details.is_before_email_verify;
        this.bu_head_approved_email = this.lead_details.bu_head_approved_email;
        this.is_proposal_shared = this.lead_details.is_proposal_shared;
        this.emailverified = this.lead_details.email_verified;
        this.project_status=this.lead_details.project_status;
        this.iconverified = this.is_before_email_verify == false && (this.emailverified || this.bu_head_approved_email);
        localStorage.setItem("emailverified", this.iconverified.toString());
        localStorage.setItem("is_before_email_verify",this.is_before_email_verify);
        this.getprojectprogress();
      },
      (err) => {}
    );
  }

  notes:any;
  mile:any='';
  milestone:any=''
  displaymilestones:any =[]
  typeFilter:any = ''
  getprojectprogress() {
    this.displaymilestones=[];
    this.loaderService.display(true);

    
    switch(this.filterTypes){
      case 'MOM':
        this.typeFilter = 'mom'
        break;
      case 'Note':
        this.typeFilter = 'note'
        break;
      case 'NOC Date Update':
        this.typeFilter = 'noc_update'
        break;
      default :
        this.typeFilter = ''
        break;
    }

    this.leadService.getprojectprogress(this.project_id,this.milestone, this.typeFilter).subscribe(
      (res) => {
        this.displaymilestones=[]
        this.progress = res;
        console.log(res)
        this.milestones = res.milestones;
        if(this.milestone){
          this.displaymilestones=[this.milestone]
        }
        else{
          this.displaymilestones=this.milestones

        }
      
        this.loaderService.display(false);
        
      });
  }

  openModal(){
    this.mile='';
    this.notes='';
    this.selectedFiles=[]
    $('#notes').modal('show');
    this.searchString =''
    this.filenames =[];
    this.base64Images =[];
    this.Boqnumber =''
  }
  ListOfBoq

  getBoqList(){
    if(this.project_status == 'inactive' || this.project_status == 'on_hold'){
      this.leadService.GetBoqListfocanceled(this.project_id,this.mile).subscribe(res=>{
      this.ListOfBoq = res.data
      },
      err=>{
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          4000);
      });
    }
    else{
      this.leadService.GetBoqList(this.Lead_id,this.searchString).subscribe(res=>{
      this.ListOfBoq = res.quotations
       },
       err=>{
         this.erroralert = true;
         this.errorMessage = JSON.parse(err["_body"]).message;
         this.loaderService.display(false);
         setTimeout(
           function () {
             this.erroralert = false;
           }.bind(this),
           4000);
       });
    }
  }
  
  postnote(project_id){
    this.loaderService.display(true)
    let data={
      'milestone':this.mile,
      'note':this.notes,
      'quotation_id':this.Boqnumber,
      'files':this.selectedFiles
    }
    const formData: FormData = new FormData();
    formData.append('milestone', this.mile);
    formData.append('note', this.notes);
    formData.append('quotation_id', this.Boqnumber);
    
    this.selectedFiles.forEach((file, index) => {
      formData.append('files[]', file, file.name);
    });
    this.leadService.postnote(project_id,formData).subscribe(
      (res) => {
        this.loaderService.display(false)
        this.successalert = true;
        this.successMessage = res.message;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          4000);
        $('#notes').modal('hide');
        this.getprojectprogress();  
      },
      (err) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          4000);
      });
  }
  downloadprogressreport() {
    this.leadService.downloadprogressreport(this.project_id,this.milestone, this.typeFilter).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = res.message;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          4000);
      },
      (error) => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(this.errorMessage["_body"]).message;
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          4000);
      });
  }

  selectedFiles=[]
  base64Images=[]
  triggerFileInput() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput.click();
  }
  filenames =[]

  onFileSelected(event: any) {
    let Filebundel=event.target.files
    for (let i = 0; i < Filebundel.length; i++) {
      const file = Filebundel[i];
      this.filenames.push(Filebundel[i].name)
      this.selectedFiles.push(file)
    }   
  }
  removeimage(index){
    this.filenames.splice(index, 1);
    this.selectedFiles.splice(index,1)
  }
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64Images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  Boqnumber='';
  searchString=''
  searchBOQ(e){
    this.searchString = e.target.value;
    this.getBoqList()
  }
  getFirstAndLast(str) {
    const first7 = str.substring(0, 7);
    const last5 = str.substring(str.length - 5);
    return first7+last5;
  }
  UploadedFIlesXl =[]
  DownloadModal(files){
  this.UploadedFIlesXl = files;
  if(files.length > 1){
    $('#filesUploaded').modal('show');
  } else{
    window.open(files[0],'_blank');
    this.ShowSuccmessage()
  }
 
  }
 getFilenameAndExtension(url: string) {
   
    const regex = /\/([^\/?#]+)(\?.*)?$/;
    const match = url.match(regex);
    
    if (match) {
      const filenameWithExtension = match[1];
     
      const dotIndex = filenameWithExtension.lastIndexOf('.');
      
      if (dotIndex !== -1) {
        var filename:any = filenameWithExtension.substring(0, dotIndex);
        const extension = filenameWithExtension.substring(dotIndex + 1);
        if (filename.length > 12) {
          filename=filename.replace('%28', ' ')
          filename = filename.substring(0, 12);
        }
  
        return filename +'.'+ extension;
      }
    }
    return null
    }

    

  
  
  ShowSuccmessage(){

    this.successalert = true;
    this.successMessage = "file Downloaded successfully "
    this.loaderService.display(false);
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      4000);

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

  firstW='';
  firstW1=''
  firstW2=''
  firstW3=''
  firstW4=''
  firstWb=''
  getWidth1(){
    const width = $('#fisttd').first().width();
    this.firstW = width;
    return width
  }
  getWidth2(){
    const width = $('#fisttd1').first().width();
    this.firstW1 = width;
    return width
  }
  getWidth3(){
    const width = $('#fisttd2').first().width();
    this.firstW2 = width;
    return width
  }
  getWidth4(){
    const width = $('#fisttd3').first().width();
    this.firstW3 = width;
    return width
  }
  getWidth5(){
    const width = $('#fisttd4').first().width();
    this.firstW4 = width;
    return width
  }
  getWidthb(){
    const width = $('#fisttdboq').first().width();
    this.firstWb = width;
    return width
  }
  processed:boolean=false
  processString(input: string): SafeHtml {
    let parts = input.split(':');
    if (parts.length > 1 && this.isDate(parts[1].trim()) && parts[0] === 'Expected Date Change') {
      return true
    } 
    return false
  }

  getreason(input){
    let parts = input.split(':');
    const remark = parts.slice(3).join(':').trim();
    return remark
  }

  Milestone:string;
  BoqNumber:string;
  Notes=[];
  ID:any
  Status:any


  detailsNotes(boq,milestone,id){
    console.log(id)
    $('#Detailednotes').modal('show');
    this.Milestone=milestone
    console.log(this.Milestone)
    this.BoqNumber=boq.boq_number
    this.Notes=boq.data
    console.log(this.Milestone)
    console.log(this.BoqNumber)
    console.log(this.Notes.length)
    this.ID=this.Notes.length-id +1
    console.log(id,this.ID)
    this.Status=this.progress[this.Milestone].color
  }


  switchNotes(i){
    console.log(i)
    this.ID=i
  }

  isDate(str: string): boolean {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/; // Simple date pattern for DD/MM/YYYY
    return datePattern.test(str);
  }

  formatDate(str: string): string {
    const [day, month, year] = str.split('/');
    return `${day}-${month}-${year}`; // Transform DD/MM/YYYY to DD-MM-YYYY
  }
  reversedNotes(notes) {
    return this.Notes.slice().reverse();
  }

  openPopupDesign(detail:any ,obj: any){
    if(obj){
      this.currentDetail = detail
      this.allSpaceEventDetails = obj
      this.currentSpaceDetails = obj.event_spaces[0] ? obj.event_spaces[0] : {}
      $('#designMeetingModal').modal('show');
      this.onScroll();
      this.checkImageScrollButtons();
    }else{
      this.allSpaceEventDetails = {}
      this.currentSpaceDetails = {}
      this.currentDetail = {}
    }
  }

  changeActiveImage(index: number) {
    this.activeIndex = index;
  }

  changeCurrentSpsceDetails(res:any){
    this.currentSpaceDetails = res
    this.changeActiveImage(0)
    this.onScroll();
    setTimeout(()=>{
      this.onImageScroll();
    },100)
  }

  prevImage(type:any, array:any) {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else {
      this.activeIndex = ( type == 1 ? array.length -1 : 0);  // Loop to the last image
    }
  }

  nextImage(type:any, array:any) {
    let newArrayLength = (type == 1 ? array.length - 1 : 0);
    if (this.activeIndex < newArrayLength) {
      this.activeIndex++;
    } else {
      this.activeIndex = 0;  // Loop to the first image
    }
  }

  // Function to toggle the accordion
  toggleAccordion(index: number) {
    // If it's the currently open accordion, close it
    if (this.activeIndexAccordion === index) {
      this.activeIndexAccordion = null;
    } else {
      this.activeIndexAccordion = index; // Set the active index to the clicked accordion
    }
  }

  submitDesignIteration(type:any){
    this.loaderService.display(true);
    let reqBody = {
      detail_id: this.currentDetail.id,
      status: type
    }
    this.leadService.approve_reject_progress_detail(reqBody, this.project_id).subscribe((res:any)=>{
      $('#designMeetingModal').modal('hide');
      this.getprojectprogress();
    },(err) => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(err["_body"]).message;
      this.loaderService.display(false);
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        4000);
    });
  }

  calculateMaxScroll() {
    const scrollableWidth = this.scrollContainer.nativeElement.scrollWidth;
    const visibleWidth = this.scrollContainer.nativeElement.clientWidth;
    this.maxScrollPosition = scrollableWidth - visibleWidth;
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
  }

  onScroll() {
    this.scrollPosition = this.scrollContainer.nativeElement.scrollLeft;
    this.calculateMaxScroll();  
  }

  scrollImageLeft() {
    const scrollAmount = 100; // Scroll by 100px
    this.imagePaginationTwo.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    this.checkImageScrollButtons();
  }
  
  scrollImageRight() {
    const scrollAmount = 100; // Scroll by 100px
    this.imagePaginationTwo.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    this.checkImageScrollButtons();
  }
  
  onImageScroll() {
    this.checkImageScrollButtons();
  }
  

  checkImageScrollButtons() {
    const container = this.imagePaginationTwo.nativeElement;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
  
    this.isImageScrollLeftDisabled = container.scrollLeft === 0;
  
    this.isImageScrollRightDisabled = container.scrollLeft >= maxScrollLeft;
  }

  isFinalDesign:any = 'no';
  selectReason:any = '';
  reasonTxt:any = '';
  openDesignStatusChangePopUP(detail:any ,obj: any){
    this.isFinalDesign = detail.final_design_session == true ? 'yes' : 'no';
    this.reinitializeReasonValues();
    this.currentDetail = detail;
    this.allSpaceEventDetails = obj;
    $('#designStatusModal').modal('show');
  }

  reinitializeReasonValues(){
    this.selectReason = '';
    this.reasonTxt = '';
  }
  

  submitFinalDesign(){
    if(this.isFinalDesign == 'yes'){
      $('#designStatusModal').modal("hide");
      $('#otpModalbox').modal("show");
      //  this.isFinalDesign = 'no'
    }else if(this.isFinalDesign == 'no'){
      this.final_design_session_submit();
    }
  }
  

  final_design_session_submit(){
    this.loaderService.display(true);
    let reqBody = {
      detail_id : this.currentDetail.id,
      reason: this.isFinalDesign == 'no'  ? this.selectReason : this.reasonTxt,
      final_design_session: this.isFinalDesign == 'yes' ? true : false
    }
    this.leadService.final_design_session_submit(reqBody,this.project_id).subscribe((res:any)=>{
      $("#otpModal").modal("hide");
      this.loaderService.display(false);
      $('#designStatusModal').modal('hide');
      this.getprojectprogress();

      this.successalert = true;
      this.successMessage = res.message;
      this.loaderService.display(false);
      setTimeout(
        function () {
          this.successalert = false;
        }.bind(this),
        4000);

    },(err) => {
      this.erroralert = true;
      this.errorMessage = JSON.parse(err["_body"]).message;
      this.loaderService.display(false);
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        4000);
    });
  }

  activeIndexAccordionLogs:any = null;
  toggleAccordionLogs(index: number): void {
    this.activeIndexAccordionLogs = this.activeIndexAccordionLogs === index ? null : index;
  }

  openHistoryLogModel(){
    this.activeIndexAccordionLogs = null
    $('#designHistoryLog').modal('show');
    $('#designMeetingModal').modal('hide');
  }

  closeHistoryLogModel(){
    $('#designHistoryLog').modal('hide');
    $('#designMeetingModal').modal('show');

  }

  openOtpPopup(){
    $('#otpModalbox').modal("hide");
    $("#otpModal").modal("show");
  }

  moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (currentInput.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  // Move to previous input on backspace
  moveToPrevious(event: KeyboardEvent, currentInput: HTMLInputElement, previousInput: HTMLInputElement) {
    const allowedKeys = ['Backspace', 'Delete'];
    if (allowedKeys.includes(event.key) && currentInput.value === '') {
      if (previousInput) {
        previousInput.focus();
      }
    } else if (allowedKeys.includes(event.key) && currentInput.value.length === 1) {
      currentInput.value = ''; // Clear current input
    }
  }

  // Allow only numeric input
  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault(); // Block non-numeric inputs
    }
  }

  // Handle OTP submission
  submitOtp() {
    const otp = this.otpDigits.join('');
    if (otp.length === 6) {
      this.verifyOtp();
    } else {
      console.log('Incomplete OTP');
    }
  }

  // Start countdown timer for OTP resend
  startResendTimer() {
  }

  // Resend OTP function
  resendOtp(type) {
    let eventId:any = this.allSpaceEventDetails.event.id ? this.allSpaceEventDetails.event.id : null
    this.loaderService.display(true);
    this.leadService.shareOTPevent(eventId).subscribe((res)=>{
      this.otpDigits = new Array(6).fill('');
      if(type == 1){
        $('#otpModalbox').modal("hide");
        $("#otpModal").modal("show");
      }
      this.loaderService.display(false);
    },(error) => {
      this.erroralert = true;
      this.loaderService.display(false);
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

  verifyOtp(){
    let eventId:any = this.allSpaceEventDetails.event.id ? this.allSpaceEventDetails.event.id : null
    this.loaderService.display(true);
    this.leadService.verifyOTP(this.otpDigits.join(''), eventId).subscribe((res:any)=>{
      // call submit api
      this.final_design_session_submit();
    },
    (error) => {
      this.erroralert = true;
      this.loaderService.display(false);
      this.errorMessage = JSON.parse(error["_body"]).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        2000
      );
    })
  }

}
