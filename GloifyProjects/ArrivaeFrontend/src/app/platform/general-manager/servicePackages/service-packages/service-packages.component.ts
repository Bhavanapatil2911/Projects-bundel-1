import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { LeadService } from '../../../lead/lead.service';
import { GeneralManagerService } from '../../general-manager.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: "app-service-packages",
  templateUrl: "./service-packages.component.html",
  styleUrls: ["./service-packages.component.css"],
  providers: [LeadService, GeneralManagerService],
})
export class ServicePackagesComponent implements OnInit {
  constructor(
    private leadService: LeadService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    public generalManagerService: GeneralManagerService,
    private sanitizer: DomSanitizer
  ) {}

  per_page;
  total_page;
  current_page;
  headers_res;
  page_number;

  promoPackagesForm: any;

  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  role: string;

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.getCategories();
    this.getUints();
    this.getServicePackages(1, "", "");
    this.getListogGm();
    this.promoPackagesForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      promo_code: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      promo_value: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      units: new FormControl("", Validators.required),
    });
    this.promoPackagesForm.controls["category"].setValue("0");
    this.promoPackagesForm.controls["units"].setValue("0");
  }

  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      10000
    );
  }
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(
      function () {
        this.successalert = false;
      }.bind(this),
      10000
    );
  }

  lead_priority_que_arr;
  getServicePackages(currentPage, value: any, status) {
    this.page_number = currentPage;
    this.loaderService.display(true);
    this.generalManagerService
      .getServicePackages(currentPage, value, "", "", "", "")
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");

          res = res.json();
          this.lead_priority_que_arr = res.service_packages;
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  units: any = [];
  getUints() {
    this.generalManagerService.getSerivcesPackagesUnits().subscribe(
      (res) => {
        for (const [key, value] of Object.entries(res.units)) {
          this.units.push(`${value}`);
        }
      },
      (err) => {}
    );
  }

  categories: any;
  getCategories() {
    this.generalManagerService.getSerivcesPackagesCategories().subscribe(
      (res) => {
        this.categories = res.service_package_categories;
      },
      (err) => {}
    );
  }

  clearEditPromoId() {
    this.validPromo = "";
    this.edited_promo_code = null;
    this.image = [];
    this.imageUrl = null;
    this.promoPackagesForm.reset();
  }

  imageUrl: any;
  image_firt: any;
  edited_promo_code: any;
  category_form: any;
  image_update:any = [];
  fetchPromoDetails(promoId) {
    this.clearEditPromoId();
    this.validPromo = "";
    this.edited_promo_code = promoId;
    this.loaderService.display(true);
    this.generalManagerService.fetchServicePackage(promoId).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.promoPackagesForm.controls["name"].setValue(
          res.service_package.name
        );
        this.promoPackagesForm.controls["promo_code"].setValue(
          res.service_package.unique_sku
        );
        this.promoPackagesForm.controls["description"].setValue(
          res.service_package.description
        );
        this.promoPackagesForm.controls["units"].setValue(
          res.service_package.unit
        );
        this.promoPackagesForm.controls["promo_value"].setValue(
          res.service_package.rate
        );
        this.promoPackagesForm.controls["category"].setValue(
          res.service_package.service_package_category.id
        );
        this.imageUrl = res.service_package.image_urls;
        this.image_firt =
          res.service_package.image_urls.length > 0
            ? "https:" + res.service_package.image_urls[0].image
            : "";

        this.image_update.push(this.image_firt.toString());    
        this.image_firt = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.image_firt
        );

        $("#showskill").attr("src", this.image_firt);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }


  activeUploadImage() {
    document.getElementById("uploadImage").click();
  }

  image: any = [];
  imageName: any;
  uploadImage(event) {
    this.image = [];
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].type !== "video/mp4") {
        this.image.push(event.target.files[i]);
      } else {
        this.errorMessageShow("Video file is not allow");
      }
    }
  }

  validPromo;
  onSubmit(value) {
    this.loaderService.display(true);
    if (value.promo_code.indexOf(" ") > -1) {
      this.validPromo = "Enter Valid Service Package Code (Space not allowed)";
      this.loaderService.display(false);
    } else {
      this.generalManagerService
        .createServicesPackages(value, this.image)
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.promoPackagesForm.reset();
            this.image.length = 0;
            this.validPromo = "";
            $("#promoCodeModal").modal("hide");
            this.getServicePackages(1, "", "active");
            this.successMessageShow("Service Package Created Successfully!");
          },
          (err) => {
            this.loaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
            this.validPromo = JSON.parse(err["_body"]).message;
          }
        );
    }
  }

  update(value) {
    this.loaderService.display(true);
    if (value.promo_code.indexOf(" ") > -1) {
      this.validPromo = "Enter Valid Code (Space not allowed)";
      this.loaderService.display(false);
    } else {
      this.generalManagerService
        .updateServicePackage(value, this.edited_promo_code, this.image)
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.successMessageShow("Service Package Updated Successfully!");
            this.promoPackagesForm.reset();
            this.image.length = 0;
            this.validPromo = "";
            $("#promoCodeModal").modal("hide");
            this.getServicePackages(1, "", "active");
          },
          (err) => {
            this.loaderService.display(false);
            this.errorMessageShow(JSON.parse(err["_body"]).message);
            this.validPromo = JSON.parse(err["_body"]).message.code;
          }
        );
    }
  }

  downloadPromoPackages() {
    this.loaderService.display(true);
    this.generalManagerService.downloadServicesPackages().subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successMessageShow("Services Packages Downloaded Successfully!");
        var contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        var b64Data = res.excel_base_64;
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
        dwldLink.setAttribute("download", "services-package-report.xlsx");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      (err) => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
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

  changeStatus(id, value) {
    this.loaderService.display(true);
    this.generalManagerService.updateServicePackageStatus(id, value).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successMessageShow("Status Change Successfully");
        this.getServicePackages(1, "", "active");
      },
      (err) => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  ngOnDestroy() {
    $(function () {
      $(".pop").remove();
    });
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

  searchPromo() {
    let search = $("#serachPromo").val();
    this.getServicePackages(1, search, "");
  }

  current_image_index: any = 0;
  changeImage(value) {
    if (value == "minus") {
      if (this.current_image_index > 0) {
        this.current_image_index = this.current_image_index - 1;
        this.image_firt = this.imageUrl[this.current_image_index].image;
        this.image_firt = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.image_firt
        );
      }
    } else {
      if (this.current_image_index < this.imageUrl.length - 1) {
        this.current_image_index = this.current_image_index + 1;
        this.image_firt = this.imageUrl[this.current_image_index].image;
        this.image_firt = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.image_firt
        );
      }
    }
  }

  general_manager: any = [];
  getListogGm() {
    this.generalManagerService.getListofGm().subscribe(
      (res) => {
        this.general_manager = res.gms;
      },
      (err) => {}
    );
  }

  assignPackagetoGM(gm_id) {
    this.loaderService.display(true);
    this.generalManagerService
      .assignpackagegm(this.package_id, gm_id)
      .subscribe(
        (res) => {
          this.successMessageShow(res.message);
          this.loaderService.display(false);
          this.getServicePackages(1, "", "");
        },
        (err) => {
          this.errorMessageShow("Something went wrong");
        }
      );
  }

  gms: any;
  package_id: any;
  onItemSelect(items, id) {
    this.gms = items;
    this.package_id = id;
    this.assignPackagetoGM(this.gms);
  }
}
