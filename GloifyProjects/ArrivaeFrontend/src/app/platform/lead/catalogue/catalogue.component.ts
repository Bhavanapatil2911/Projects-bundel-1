import { Component, OnInit ,Input} from '@angular/core';
import { LeadService } from '../lead.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  @Input() catalogue:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  lead_details:any;
  lead_id:any;
  id: any

  constructor(
    public leadService : LeadService,
    public loaderService : LoaderService,
  ) { }

  ngOnInit() {

  }

  confirmAndShare() {
    if (confirm("Are you sure you want to share?") == true) {
      this.shareWarrantyWithCustomerFile();
    }
  }

  shareWarrantyWithCustomerFile(){

  	this.loaderService.display(true);
  	this.leadService.shareCatalogueWithCustomerFile(this.catalogue).subscribe(
  		res=>{
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Document has shared successfully!";
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 800);

  		},
  		err=>{
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
           this.erroralert = false;
         }.bind(this), 10000);

        this.loaderService.display(false);
      });

  }

}
