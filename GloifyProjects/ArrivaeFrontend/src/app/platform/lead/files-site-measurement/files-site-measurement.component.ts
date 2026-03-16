import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
import { Directive, HostListener } from '@angular/core';
import { InitialBoqsComponent } from '../../category/category/initial-boqs/initial-boqs.component';
import { Http, Headers, RequestOptions, RequestMethod, Response } from '@angular/http';

declare var $:any;

@Component({
  selector: 'app-files-site-measurement',
  templateUrl: './files-site-measurement.component.html',
  styleUrls: ['./files-site-measurement.component.scss'],
  providers: [LeadService, LoaderService],
  

})
// @Directive({
//   selector: '[file]'
// })
export class FilesSiteMeasurementComponent implements OnInit {
	@Input() siteRequestList:any = [];

	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  submitted = false;
  isSubmitted = false;
  lead_status;
  createRequestForm: FormGroup;
  completeRequestForm: FormGroup;
  selectedPostBidObject:any = {};
  siteImagesSelected: boolean = false;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;
  uploadFileId:any = null;
  private uploadXhr: XMLHttpRequest;

  @Output() dataToParent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,

    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute
  ) { }

  // @HostListener('drop', ['$event'])
  // onDrop(event: DragEvent) {
  //   event.preventDefault();
  //   const { dataTransfer } = event;

  //   if (dataTransfer.items) {
  //     const files = [];
  //     for (let i = 0; i < dataTransfer.items.length; i++) {
  //       // If dropped items aren't files, reject them
  //       if (dataTransfer.items[i].kind === 'file') {
  //         files.push(dataTransfer.items[i].getAsFile());
  //       }
  //     }
  //     dataTransfer.items.clear();
  //     console.log(files)
  //     if(files){

       
  //       var filesAmount = files.length;
  //       for (let i = 0; i < filesAmount; i++) {
  //         var reader = new FileReader();
  //         var base64;
  //         reader.onload = (fileLoadedEvent) => {
  //           var image:any = new Image();
  //           image.src = reader.result;
  //           base64 = fileLoadedEvent.target;
                  
  //                  this.images.push(base64.result); 
  //         }
  //         // this.imageName.push(event.target.files);
  //         console.log(files[i],'fefef')
  //         if(files[i]){
  //           reader.readAsDataURL(files[i]);
  //         }
          
  //         this.imageName.push(files[i].name);
  //        console.log(this.imageName,this.images)
        

  //       } 

  //    }
  //   } else {
  //     const files = dataTransfer.files;
  //     dataTransfer.clearData();
    
  //   }

  //   this.uploadFile(event,1)
   
  // }
  // active
  // @HostListener('dragover', ['$event'])
  // onDragOver(event: DragEvent) {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   this.active = true;
  // }

  // @HostListener('dragleave', ['$event'])
  // onDragLeave(event: DragEvent) {
  //   this.active = false;
  // }

  // @HostListener('body:dragover', ['$event'])
  // onBodyDragOver(event: DragEvent) {
   
  //     event.preventDefault();
  //     event.stopPropagation();
    
  // }
  // @HostListener('body:drop', ['$event'])
  // onBodyDrop(event: DragEvent) {
 
  //     event.preventDefault();
    
  // }



  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
    this.initializeRequestForm();
    this.initializeCompleteRequestForm();
  }

  initializeRequestForm(){
    this.createRequestForm = new FormGroup({
      'request_type': new FormControl(null, Validators.required),
      'address': new FormControl("", Validators.required),
      'scheduled_at': new FormControl("", Validators.required),
      'project_id': new FormControl("")
    });
  }

  initializeCompleteRequestForm(){
    this.completeRequestForm = new FormGroup({
      'remarks': new FormControl('', Validators.required),
      'siteImages':  new FormControl("", Validators.required),
      'cadFiles': new FormControl("", Validators.required)
    });
  }

  request_type_data: any;
  getRequestType() {
    this.leadService.getRequestType().subscribe(
      res => {
        this.request_type_data = res.request_type;
      }
    )
  }

  siteValidation_alert = false;
  siteValidation_msg: string;
  onRequest() {
    this.dataToParent.emit(true)
    // this.loaderService.display(true);
    this.createRequestForm.patchValue({project_id: this.project_id});
    this.leadService.createSiteRequest(this.createRequestForm.value).subscribe(
      res => {
        
        if (res.message !== undefined) {
          this.siteValidation_alert = true;
          this.siteValidation_msg = res.message;
        }
        
        $("#siteModal").modal("hide");
        // this.loaderService.display(false);
        this.dataToParent.emit(false)
        if (res.message === undefined) {
          this.successalert = true;
          this.successMessage = "Request sent"
        }
        setTimeout(function() {
          this.siteValidation_alert = false;
       }.bind(this), 2000);
        setTimeout(function() {
                  this.successalert = false;
        }.bind(this), 2000);
        this.fetchSiteRequest();
        this.createRequestForm.reset();
        
      },
      err => {
        this.dataToParent.emit(false)
        // this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = err._body.slice(12,err._body.length-2);
        setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
        
      });
  }

  fetchSiteRequest(){
    this.loaderService.display(true);
    this.leadService.fetchSiteRequest(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.siteRequestList = res['site_measurement_requests'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res['lead']
        this.project_id = this.lead_details.project_details.id;
        this.getRequestType();
        this.fetchSiteRequest();
      })

  }

  imageGallery:any = [];
  Remarks:any
  getGallery(req_id, remark){
    $("#dataViewPopUp").modal("hide");
    this.loaderService.display(true);
    this.leadService.getGallery(req_id).subscribe(
      res => {
        $("#completeRequestModal").modal("hide");
        this.loaderService.display(false);
        this.imageGallery = res['site_galleries'];
        this.Remarks=remark
        $("#viewGalleryModal").modal("show");
      },
      err => {
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        this.imageGallery = [];
      }
    );
  }

  deleteObject(obj_id){
    if (confirm("Are You Sure you want to delete this Site Request Files?") == true) {
      this.loaderService.display(true);
      this.leadService.deleteSiteMeasurement(obj_id)
      .subscribe(
          res => {
            $("#viewGalleryModal").modal("hide");
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Files deleted successfully !!";
            this.fetchSiteRequest();
            setTimeout(function() {
              this.successalert = false;
             }.bind(this), 800);
          },
          err => {
            this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
             }.bind(this), 10000);

            this.loaderService.display(false);
          });
    }
  }

  images:any = [];
  imageName:any =[];
  FileID:any
  modalopenFiles(id){
    $("#siteFilesModal").modal("show");
    this.FileID = id
    this.listingFileUpload(this.FileID)
    this.DeleteFileId = ''
  }
  uploadFile(event,i){



    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        var base64;
        reader.onload = (fileLoadedEvent) => {
          var image:any = new Image();
          image.src = reader.result;
          base64 = fileLoadedEvent.target;
                
                 this.images.push(base64.result); 
        }
        // this.imageName.push(event.target.files);
        console.log(event.target.files[i],'file')
        reader.readAsDataURL(event.target.files[i]);
        this.imageName.push(event.target.files[i].name);
       console.log(this.imageName,this.images)
      }

    }
  }
  checkValidation(){
    if(this.images.length > 0 || this.remarkFile != ''){
      return false
    }else{
      return true
    }
  }
  remarkFile:any =''
  onCancelMaxImages(i) {
    console.log(this.images.length)
    this.imageName.splice(i,1);
    this.images.splice(i,1);
    console.log(this.imageName);
  }
  clearFileUplaod(){
    this.images = [];
    this.imageName =[];
    this.remarkFile =''
  }
  loading = false;
  UploadFilesSubmit(){

    this.loading = true

    let obj ={
      data:{
        "request_id": this.FileID,
        "remark":this.remarkFile,
        "files":this.images
      }
    }
 
    this.leadService.CreateFileInSite(obj).subscribe(res=>{
     
      this.clearFileUplaod();
      this.successalert = true;
      this.successMessage = "Files Uploaded successfully !!";
      this.fetchSiteRequest();
      setTimeout(function() {
        this.successalert = false;
       }.bind(this), 800);

       this.loading = false
    
      this.listingFileUpload(this.FileID)
    },err=>{
      this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
             }.bind(this), 10000);

             this.loading = false

          

    })
  }
  fileListingData :any
  listingFileUpload(id){
    this.loaderService.display(true)
    this.leadService.listCreateFile(id).subscribe(res => {
      this.loaderService.display(false)
      this.fileListingData = res.site_validation_data
      console.log(this.fileListingData);
    }, (err) => {
      this.loaderService.display(false);
    })
  }

  DeleteFileId:any
  Deletefile(id , groupingId){
   this.loading = true;
   this.DeleteFileId = id;

    this.leadService.deleteEachFile(id , groupingId).subscribe(res => {
    
     this.successalert = true;
     this.successMessage = "Files Deleted successfully !!";
     this.fetchSiteRequest();
     setTimeout(function() {
       this.successalert = false;
      }.bind(this), 800);

      this.loading = false
      this.DeleteFileId =''
   
     this.listingFileUpload(this.FileID)
    
      
    }, (err) => {
      this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
             }.bind(this), 10000);

             this.loading = false
             this.DeleteFileId =''
    })
  }

  onFileChange(event, controlName: string) {
    const fileInput = event.target;
    let maxSizeInMB = controlName === 'siteImages' ? 300 : 10;
    const file = fileInput.files[0];
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file) {
      // Check if the file is a zip file by its MIME type or extension
      let isValidFile = false;

      if (controlName === 'siteImages') {
        isValidFile = file.type === 'application/zip' || file.name.endsWith('.zip');
      } else if (controlName === 'cadFiles') {
        isValidFile = file.type === 'application/zip' || file.name.endsWith('.zip') || file.name.endsWith('.dwg');
      }

      if (!isValidFile) {
        this.erroralert = true;
        if(controlName === 'siteImages'){
          this.uploadInProgress = this.siteImagesSelected = false
        }
        this.errorMessage = controlName === 'siteImages' ? "Only .zip files are allowed!" : "Only .zip and .dwg files are allowed!";
        fileInput.value = '';
        // this.completeRequestForm.patchValue({ [controlName]: null }); 
        this.completeRequestForm.controls[controlName].setErrors({ 'invalidFileType': true });
        this.completeRequestForm.controls[controlName].markAsTouched();
        setTimeout(() => this.erroralert = false, 3000);
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.erroralert = true;
        if(controlName === 'siteImages'){
          this.uploadInProgress = this.siteImagesSelected = false
        }
        this.errorMessage = controlName === 'siteImages' ? "File size should not exceed 300 MB!" : "File size should not exceed 10 MB!";
        fileInput.value = '';
        // this.completeRequestForm.patchValue({ [controlName]: null }); 
        this.completeRequestForm.controls[controlName].setErrors({ 'fileTooLarge': true });
        this.completeRequestForm.controls[controlName].markAsTouched();
        setTimeout(() => this.erroralert = false, 3000);
        return;
      }

      this.completeRequestForm.patchValue({ [controlName]: file });
      this.completeRequestForm.controls[controlName].setErrors(null);

      if (controlName === 'siteImages') {
        this.siteImagesSelected = true;
      }
    }
  }

  // upload s3 file function
  uploadSiteImages() {
    if (this.completeRequestForm.controls['siteImages'].valid) {
      this.getS3FileUploadUrl();
    }
  }

 // form submit function  
  onSubmitCompleteRequest(){
    this.submitted = true;
    if (this.completeRequestForm.valid) {
      if(!this.siteImagesSelected && !this.uploadInProgress){
        this.completePostBidRequestApiFunction(this.completeRequestForm.value)
      }else{
        this.erroralert = true;
        if(this.siteImagesSelected){
          this.errorMessage = 'Upload the site images file';
        }
        if(this.uploadInProgress){
          this.errorMessage = 'Site images file is uploading';
        }
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          3000
        );
      }
    }
  }
  
  setCurrentPostBidObject(value: any, typeOfPopup:any = 1 ){
    if(typeOfPopup === 2){
      $("#dataViewPopUp").modal("hide");
    }
    this.clearFileUploadPostBid();
    this.selectedPostBidObject = value ;
  }

  completePostBidRequestApiFunction(data){
    this.dataToParent.emit(true)
    const formData:any = new FormData();
    formData.append('remark', data.remarks)
    if(data.siteImages &&  data.siteImages.size){
      formData.append('site_images_file', 'yes')
      // formData.append('site_images_file_size', data.siteImages.size)
      // formData.append('site_images_file_content_type', 'zip')
      // formData.append('site_images_file',  data.siteImages)
    }else{
      formData.append('site_images_file', 'no')
    }
    if(data.cadFiles){
      formData.append('cad_file', data.cadFiles)
    }

    this.leadService.completePostBidSiteRequest(formData, this.selectedPostBidObject.id).subscribe(
      (res) => {
      // if(data.siteImages &&  data.siteImages.size && res.url && res.file_id){
      //   this.largeS3FileUpload(data.siteImages, res.url, res.file_id, res.message, data.remarks);
      // }else{
        this.uploadFileId = null;
        this.loaderService.display(false);
        this.dataToParent.emit(false)
        this.successalert = true;
        this.successMessage = res.message;
        $("#completeRequestModalPopUp").modal("hide");
        this.clearFileUploadPostBid();
        
        this.fetchSiteRequest();
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          3000
        );
      // }
    },
    (err)=>{
      this.loaderService.display(false);
      this.dataToParent.emit(false)
      this.erroralert = true;
      this.errorMessage = JSON.parse(err['_body']).message;
      setTimeout(
        function () {
          this.erroralert = false;
        }.bind(this),
        3000
      );
    });
  }

  // , fileId:any, msg:any, remark:any
  largeS3FileUpload(files: any, url: any) {
    this.uploadInProgress = true;
    this.uploadProgress = 0;

    this.uploadXhr = new XMLHttpRequest();
    this.uploadXhr.open('PUT', url, true);
    this.uploadXhr.setRequestHeader('Content-Type', files.type);

    this.uploadXhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        this.uploadProgress = Math.round((event.loaded / event.total) * 100);
      }
    };

    this.uploadXhr.onload = () => {
      if (this.uploadXhr.status === 200) {
        this.uploadInProgress = false;
        this.siteImagesSelected = false;
      } else {
        this.uploadInProgress = false;
        this.erroralert = true;
        this.errorMessage = "Upload failed!";
        setTimeout(() => this.erroralert = false, 3000);
      }
    };

    this.uploadXhr.onerror = () => {
      this.uploadInProgress = false;
      this.erroralert = true;
      this.errorMessage = "Upload failed!";
      setTimeout(() => this.erroralert = false, 3000);
    };

    this.uploadXhr.send(files);
  }

  // largeS3FileUploadCompletion(status:any, fileId:any, msg:any, remark:any){
  //   this.leadService.postBidFileUploadStatus(this.selectedPostBidObject.id, status , remark, fileId).subscribe((res:any)=>{
  //     this.loaderService.display(false);
  //     this.dataToParent.emit(false)
  //     if(status === 'uploaded'){
  //       this.successalert = true;
  //       this.successMessage = msg;
  //       $("#completeRequestModalPopUp").modal("hide");
  //       this.clearFileUploadPostBid();
  //       this.fetchSiteRequest();
  //       setTimeout(
  //         function () {
  //           this.successalert = false;
  //         }.bind(this),
  //         3000
  //       );
  //     }else{
  //       this.erroralert = true;
  //       this.errorMessage = 'Site map file upload failed';
  //       setTimeout(
  //         function () {
  //           this.erroralert = false;
  //         }.bind(this),
  //         3000
  //       );
  //     }
  //   }, (err)=>{
  //     this.loaderService.display(false);
  //     this.dataToParent.emit(false)
  //   })
  // }

  clearFileUploadPostBid(){
    this.completeRequestForm.reset();
    this.submitted = false;
    this.uploadFileId = null;

    // Manually clear the file input elements
    const siteImagesInput = document.getElementById('siteImages') as HTMLInputElement;
    if (siteImagesInput) {
        siteImagesInput.value = '';
    }

    const cadFilesInput = document.getElementById('cadFiles') as HTMLInputElement;
    if (cadFilesInput) {
        cadFilesInput.value = '';
    }
  }

  getS3FileUploadUrl(){
    this.dataToParent.emit(true)
    this.leadService.getS3FileUploadeUrl(this.selectedPostBidObject.id, this.completeRequestForm.get('siteImages').value, this.uploadFileId).subscribe((res:any)=>{
      this.dataToParent.emit(false)
      if(res.file_id){
        this.uploadFileId = res.file_id
      }
      this.largeS3FileUpload(this.completeRequestForm.get('siteImages').value, res.url)
    },(err)=>{
      this.dataToParent.emit(false)
    })
  }

  abortUpload() {
    if (this.uploadXhr) {
      this.uploadXhr.abort();
      this.uploadInProgress = false;
      this.erroralert = true;
      this.errorMessage = "Upload Canceled!";
      setTimeout(() => this.erroralert = false, 3000);

      // Remove the file from the form and reset the input
      this.completeRequestForm.patchValue({ siteImages: null });
      this.completeRequestForm.controls['siteImages'].setErrors({ 'aborted': true });
      this.siteImagesSelected = false;
      const fileInput: any = document.getElementById('siteImages');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

}
