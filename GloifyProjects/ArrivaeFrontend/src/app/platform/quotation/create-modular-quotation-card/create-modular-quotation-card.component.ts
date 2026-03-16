import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LoaderService } from "../../../services/loader.service";
import { QuotationService } from "../quotation.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-create-modular-quotation-card",
  templateUrl: "./create-modular-quotation-card.component.html",
  styleUrls: ["./create-modular-quotation-card.component.css"],
})
export class CreateModularQuotationCardComponent implements OnInit {
  constructor(
    private quotationService: QuotationService,
    private loaderService: LoaderService
  ) {}

  @Input() display_list: any;
  @Input() selectedSections: any;
  @Input() KeysOfObject: any;
  @Input() expansion: any;
  @Input() selSpace22: any;
  @Input() projectId: any;
  @Input() quotation_id: any;
  modalExcelForm: FormGroup;
  @Output() infoCallback: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    console.log("this.display_list", this.display_list);
    console.log("selectedSections", this.selectedSections);
    console.log("KeysOfObject", this.KeysOfObject);
    console.log("expansion", this.expansion);
    this.modalExcelForm = new FormGroup({
      name: new FormControl("", Validators.required),
      material: new FormControl("", Validators.required),
      color_and_finish: new FormControl("", Validators.required),
      dimension: new FormControl("", Validators.required),
      color: new FormControl("", Validators.required),
    });
    this.getDisplayList();
  }
  isLoading;

  successalert;
  successMessage;
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

  // showdismto(evt) {
  //   this.infoCallback.emit(true);
  // }

  row2: any = [""];
  toggleRow(rowId) {
    if (this.row2[0] !== rowId) {
      this.expansion = rowId;
      this.row2[0] = rowId;
    } else {
      this.row2[0] = "";
      this.expansion = "";
    }
  }

  erroralert = false;
  errorMessage: string;
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
  ListofMtojobs: any = [];
  nameofjob: any;
  page: any;
  showdismto(id, name) {
    this.nameofjob = name;

    $("#modalShowDis").modal("show");
    this.loaderService.display(true);
    this.quotationService
      .getDisplaymtojobs(this.projectId, this.quotation_id, id, name)
      .subscribe(
        (res) => {
          this.ListofMtojobs = res.data;
          this.loaderService.display(false);
        },
        (err) => {
          this.ListofMtojobs = [];
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  DeleteMto(id) {
    this.loaderService.display(true);
    this.quotationService
      .Deletemtojobs(this.projectId, this.quotation_id, id)
      .subscribe(
        (res) => {
          this.successMessageShow(res.message);
          this.loaderService.display(false);
          this.getDisplayList();
          this.infoCallback.emit(true);
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  DisplayId: any;
  imageSrc: any;
  OptonsForName;
  editMtoData(data, id) {
    console.log(data);
    $("#modalExcelForm2").modal("show");
    this.DisplayId = id;
    this.modalExcelForm.controls["name"].setValue(data[0]);
    this.modalExcelForm.controls["material"].setValue(data[1]);
    this.modalExcelForm.controls["color_and_finish"].setValue(data[2]);
    this.modalExcelForm.controls["dimension"].setValue(data[4]);
    this.modalExcelForm.controls["color"].setValue(data[3]);
    if (data[7] != "/images/original/missing.png") {
      this.imageSrc = data[7];
    } else {
      this.imageSrc = null;
    }
  }
  base64textString: any;
  _handleReaderLoaded1(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(this.base64textString);
  }

  uploadImage(event: any) {
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded1.bind(this);

      reader.readAsBinaryString(file);
    }
  }
  uploadMTOExcelData(value) {
    const data = {
      display_id: this.DisplayId,
      name: value.name,
      dimension: value.dimension,
      image: this.base64textString,
    };
    this.loaderService.display(true);
    this.quotationService
      .updateExcelData(this.projectId, this.quotation_id, data)
      .subscribe(
        (res) => {
          this.successMessageShow(res.message);
          this.loaderService.display(false);
          this.getDisplayList();
          $("#modalExcelForm2").modal("hide");
          this.infoCallback.emit(true);
        },
        (err) => {
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  getDisplayList() {
    this.quotationService
      .getDisplayData(this.projectId, this.quotation_id)
      .subscribe(
        (res: any) => {
          this.display_list = res.display_data;
          this.OptonsForName = res.display_name;
          console.log(this.OptonsForName);
          this.KeysOfObject = Object.keys(this.display_list);
          console.log(this.KeysOfObject);
        },
        (err) => {
          this.display_list = [];
        }
      );
  }
  imageNavigate(src) {
    console.log(src);
    if (
      src != "/images/medium/missing.png" &&
      src != "/images/thumb/missing.png" &&
      src != "/images/original/missing.png"
    ) {
      window.open(src, "_blank");
    } else {
      this.errorMessageShow("Upload Image First");
    }
  }
}

