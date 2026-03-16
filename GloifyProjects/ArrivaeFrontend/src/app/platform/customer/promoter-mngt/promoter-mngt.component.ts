import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { LoaderService } from 'app/services/loader.service';



@Component({
  selector: 'app-promoter-mngt',
  templateUrl: './promoter-mngt.component.html',
  styleUrls: ['./promoter-mngt.component.css'],
  providers: [
    CustomerService
  ],
})
export class PromoterMngtComponent implements OnInit {

  constructor(private customerservice: CustomerService,
    public loaderService: LoaderService,
  ) { }
  promoters:any;
  successalert: any=false;
  erroralert: any=false;
  successMessage: any;
  errorMessage: any;
  // promoters:any=[{name:'Bhavana',email:'patilbhavana2911@gmail.com',phonenumber:'6301180430',city:'anatapur'  }]

  headers_res:any;
  per_page: any
  current_page: any;
  total_page:any

  ngOnInit() {
    // console.log(this.promoters.length)
    this.getpromoters()
  }

  getpromoters(page?){
    this.loaderService.display(true)
    this.customerservice.getpromoters(page).subscribe((res)=>{
    this.loaderService.display(false)
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get("x-per-page")[0];
        this.total_page = this.headers_res.get("x-total")[0];
        this.current_page = this.headers_res.get("x-page")[0];
  
      this.loaderService.display(false)
        res = res.json();
        this.promoters=res.promoters
    })
  }

  getpageNumber(event: any) {
    this.getpromoters(event)
    this.current_page = event;
  }

}
