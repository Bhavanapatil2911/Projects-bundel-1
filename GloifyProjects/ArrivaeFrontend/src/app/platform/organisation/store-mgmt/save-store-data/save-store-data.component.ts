import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from 'app/platform/lead/lead.service';
import { LoaderService } from 'app/services/loader.service';

@Component({
  selector: "app-save-store-data",
  templateUrl: "./save-store-data.component.html",
  styleUrls: ["./save-store-data.component.css"],
})
export class SaveStoreDataComponent implements OnInit {
  storeForm: FormGroup;
  @Output() sendSubmitStoreEvent: EventEmitter<any> = new EventEmitter();
  @Input() store_id: any;
  @Output() sendCloseEvent: EventEmitter<any> = new EventEmitter();
  store_details: any;

  constructor(
    private leadService: LeadService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder
  ) {}
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;

  ngOnInit() {
    this.storeForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      stype: new FormControl("", Validators.required),
      commission: new FormControl("", [
        Validators.required,
        Validators.max(100),
      ]),
    });
  }
  ngOnChanges() {
    if (this.store_id) {
      this.getStoreDetails();
    }
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

  getStoreDetails() {
    this.loaderService.display(true);
    this.leadService.getStoreDetails(this.store_id).subscribe((res) => {
      this.loaderService.display(false);
      res = res.json();
      this.store_details = res;
      this._updateStoreFormValue();
    });
  }
  submitStoreDetails(storeFormValue) {
    this.leadService.submitStoreDetails(storeFormValue).subscribe((res) => {
      this.sendSubmitStoreEvent.emit("Created");
      this.successMessageShow(`Store created successfully`);
      this.storeForm.reset();
    });
  }
  updateStoreDetails(storeFormValue) {
    this.leadService
      .updateStoreDetails(storeFormValue, this.store_id)
      .subscribe((res) => {
        this.sendSubmitStoreEvent.emit("Updated");
      this.successMessageShow(`Store updated successfully`);
      this.storeForm.reset();
       this.store_details = undefined;
      });
  }
  getReplaceChar(tagValue) {
    return tagValue.replace(/_/g, " ");
  }
  compareFunction(item, selected) {
    return item === selected;
  }
  private _updateStoreFormValue() {
    Object.keys(this.storeForm.controls).forEach((key) => {
      this.storeForm.controls[key].setValue(this.store_details[key]);
    });
  }
  closeModal() {
    this.store_id = "";
    this.storeForm.reset();
    this.sendCloseEvent.emit();
    this.store_details = undefined;
  }
}
