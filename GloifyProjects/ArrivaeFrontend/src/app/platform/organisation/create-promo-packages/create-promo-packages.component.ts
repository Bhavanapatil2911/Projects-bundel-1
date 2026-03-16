import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from '@ng-select/ng-select/ng-select/window.service';

@Component({
  selector: 'app-create-promo-packages',
  templateUrl: './create-promo-packages.component.html',
  styleUrls: ['./create-promo-packages.component.css'],
  providers: [LeadService]
})
export class CreatePromoPackagesComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
  ) { }

  promoPackagesForm: any;
  promo_id: any
  image: any


  ngOnInit() {
    this.promoPackagesForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      promo_code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      remarks: new FormControl(''),
      promo_value: new FormControl(''),
      promo_discount_percent: new FormControl(''),
      promo_threshold: new FormControl('', Validators.required),
      expiry_date: new FormControl('')
    });
    this.route.params.subscribe((params) => {
      this.promo_id = params['id'];
    });

    if (this.promo_id && this.promo_id > 0) {
      this.fetchPromoDetails()
    }

  }

  fetchPromoDetails() {
    this.loaderService.display(true);
    this.leadService.fetchPromoCode(this.promo_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.promoPackagesForm.controls['name'].setValue(res.promo_pack.name);
        this.promoPackagesForm.controls['promo_code'].setValue(res.promo_pack.code);
        this.promoPackagesForm.controls['description'].setValue(res.promo_pack.description);
        this.promoPackagesForm.controls['remarks'].setValue(res.promo_pack.remarks);
        this.promoPackagesForm.controls['promo_value'].setValue(res.promo_pack.promo_value);
        this.promoPackagesForm.controls['promo_discount_percent'].setValue(res.promo_pack.promo_discount_percent); 
        this.promoPackagesForm.controls['promo_threshold'].setValue(res.promo_pack.threshold);
        this.promoPackagesForm.controls['expiry_date'].setValue(res.promo_pack.expiry_date);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  uploadImage(event) {
    this.image = event.target.files[0];
  }

  onSubmit(value) {
    this.loaderService.display(true);
    this.leadService.createPromoCode(value).subscribe(
      res => {
        this.loaderService.display(false);
        window.history.back();
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  update(value) {
    this.loaderService.display(true);
    this.leadService.updatePromoCode(value, this.promo_id).subscribe(
      res => {
        this.loaderService.display(false);
        window.history.back();
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

}
