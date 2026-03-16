import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LeadService } from "app/platform/lead/lead.service";
import { LoaderService } from 'app/services/loader.service';
import { ReplaceChar } from 'app/shared/customizefilters.pipe';

@Component({
  selector: 'app-detailed-info',
  templateUrl: './detailed-info.component.html',
  styleUrls: ['./detailed-info.component.css'],
  providers: [LeadService],

})
export class DetailedInfoComponent implements OnInit {
  details: any;
  details2: any;
  role: string;

  constructor(
    private leadService: LeadService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,  ) { }

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.DetailedInfo()
  }

  DetailedInfo(){
    console.log("Hiii2")
    this.leadService.getdetailedinfo().subscribe((res) => {
      console.log(res)    
      this.details = res;

      this.details2 = Object.entries(res);
      console.log(this.details2.store_details)
      

     
    });
  }

}
