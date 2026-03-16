import { Component, OnInit } from '@angular/core';
import { CatalogueService } from '../catalogue.service';
import { LoaderService } from 'app/services/loader.service';

@Component({
  selector: 'app-sales-manager',
  templateUrl: './sales-manager.component.html',
  styleUrls: ['./sales-manager.component.css'],
  providers: [CatalogueService]
})
export class SalesManagerComponent implements OnInit {

 
  sm_list: any;
  role : string
  cm_list: any;
  constructor(
    public catalogueService: CatalogueService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.getSMList()
  }


  getSMList(){
      this.loaderService.display(true);
      this.catalogueService.getSMList().subscribe(
        res => {
          this.sm_list = res["sales_managers"];
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });
        console.log(this.sm_list)
    
  }

  openModal(smid){
    console.log(smid)
    this.loaderService.display(true);
      this.catalogueService.getCMdetailsList(smid).subscribe(
        res => {
          this.cm_list = res["cms"];
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        });

  }



}

