import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CatalogueService } from '../catalogue.service';

@Component({
  selector: 'app-community-manager',
  templateUrl: './community-manager.component.html',
  styleUrls: ['./community-manager.component.css'],
  providers: [CatalogueService]

})
export class CommunityManagerComponent implements OnInit {
  cm_list: any;
  role : string
  constructor(
    public catalogueService: CatalogueService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.getCMList()
  }


  getCMList(){
      this.loaderService.display(true);
      this.catalogueService.getCMList().subscribe(
        res => {
          if(this.role=='area_sales_manager'){
            this.cm_list = res.data;

          }
          else{
            this.cm_list = res;

          }
          console.log(this.cm_list)
          this.loaderService.display(false);

        },
        err => {
          this.loaderService.display(false);
        });
    
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
