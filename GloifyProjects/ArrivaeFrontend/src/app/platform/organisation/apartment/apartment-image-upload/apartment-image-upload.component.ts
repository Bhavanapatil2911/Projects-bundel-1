import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-apartment-image-upload',
  templateUrl: './apartment-image-upload.component.html',
  styleUrls: ['./apartment-image-upload.component.css'],
  providers: [ LoaderService, ApartmentService ]
})
export class ApartmentImageUploadComponent implements OnInit {

  user_id:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  user_mapping;
  file_name;
  file_size;
  basefile;

  constructor(private apartmentservice : ApartmentService) {
  	this.user_id = localStorage.getItem('userId');
   }

  ngOnInit() {
  }

  uploadFile(event) {

    $(".wait-load").css("display", "none");
    $(".fa-cloud-upload").css("display", "block");
    $(".fa-check-circle").css("display", "none");

    this.user_mapping = event.target.files[0] || event.srcElement.files[0];

    this.file_name = this.user_mapping.name;


    this.file_size = (this.user_mapping.size)/1024;

    var base64url ;
    var fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
    base64url = fileLoadedEvent.target;
    this.basefile = base64url.result;
    };

    fileReader.readAsDataURL(this.user_mapping);$(".file-col").css("display", "flex")
    document.getElementById("fileName").innerHTML = this.file_name;
    document.getElementById("fileSize").innerHTML = this.file_size.toFixed(2)+ " KB";


  }

  submitImage() {

    $(".fa-cloud-upload").css("display", "none");
    $(".wait-load").css("display", "block");

    this.apartmentservice.uploadApartment_Zipfolder( this.basefile).subscribe( res=>{

      $(".wait-load").css("display", "none");
      $(".fa-check-circle").css("display", "block");

      this.successalert = true;
      this.successMessage = res.message;
    }, error => {
      $(".wait-load").css("display", "none");
      $(".fa-cloud-upload").css("display", "block");
      this.errorMessage  = JSON.parse(error._body).status + ":" + JSON.parse(error._body).error;
      this.erroralert = true;
    });

  }

}
