import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../lead/lead.service';


@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css'],
  providers: [LeadService]
})
export class ApartmentComponent implements OnInit {

  user_id: any;
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;

  user_mapping;
  file_name;
  file_size;
  basefile;

  constructor(
    private leadService: LeadService,
  ) {
    this.user_id = localStorage.getItem('userId');
  }

  ngOnInit() {
  }

  uploadFile(event, num) {

    $(".wait-load").css("display", "none");
    $(".fa-cloud-upload").css("display", "block");
    $(".fa-check-circle").css("display", "none");

    this.user_mapping = event.target.files[0] || event.srcElement.files[0];

    this.file_name = this.user_mapping.name;


    this.file_size = (this.user_mapping.size) / 1024;

    var base64url;
    var fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
      base64url = fileLoadedEvent.target;
      this.basefile = base64url.result;
    };

    if (num === 1) {
      fileReader.readAsDataURL(this.user_mapping); $(".file-col").css("display", "flex")
      document.getElementById("fileName").innerHTML = this.file_name;
      document.getElementById("fileSize").innerHTML = this.file_size.toFixed(2) + " KB";
    }


  }

  zip_file: any;
  zip_file_name: any;
  zipFile(event) {
    $(".wait-load").css("display", "none");
    $(".fa-cloud-upload").css("display", "block");
    $(".fa-check-circle").css("display", "none");
    this.zipFile = event.target.files[0];
    this.zip_file_name = event.target.files[0].name;
    $(".file-col2").css("display", "flex")
    document.getElementById("fileName2").innerHTML = this.zip_file_name;
    document.getElementById("fileSize2").innerHTML = event.target.files[0].size.toFixed(2) + " KB";
  }

  submitImage() {

    $(".fa-cloud-upload").css("display", "none");
    $(".wait-load").css("display", "block");

    this.leadService.uploadApartment_Zipfolder(this.basefile).subscribe(res => {

      $(".wait-load").css("display", "none");
      $(".fa-check-circle").css("display", "block");

      this.successalert = true;
      this.successMessage = res.message;
    }, error => {
      $(".wait-load").css("display", "none");
      $(".fa-cloud-upload").css("display", "block");
      this.errorMessage = JSON.parse(error._body).status + ":" + JSON.parse(error._body).error;
      this.erroralert = true;
    });

  }

  submitZip() {
    $(".fa-cloud-upload").css("display", "none");
    $(".wait-load").css("display", "block");

    this.leadService.uploadApartment_Zipfolders(this.zipFile, this.zip_file_name).subscribe(res => {

      $(".wait-load").css("display", "none");
      $(".fa-check-circle").css("display", "block");

      this.successalert = true;
      this.successMessage = "Zip file uploaded Successfully";
    }, error => {
      $(".wait-load").css("display", "none");
      $(".fa-cloud-upload").css("display", "block");
      this.errorMessage = JSON.parse(error._body).status + ":" + JSON.parse(error._body).error;
      this.erroralert = true;
    });

  }

}
