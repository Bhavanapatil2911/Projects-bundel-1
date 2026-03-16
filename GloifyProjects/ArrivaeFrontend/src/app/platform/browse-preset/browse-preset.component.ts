import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../organisation/portfolio/portfolio.service';

@Component({
  selector: 'app-browse-preset',
  templateUrl: './browse-preset.component.html',
  styleUrls: ['./browse-preset.component.css'],
  providers: [PortfolioService]
})
export class BrowsePresetComponent implements OnInit {

  constructor( public portfolioService:PortfolioService, private location: Location, public router: Router) { }
  spaceDropdown: any;
  api_data: any;
  space_name: any;
  lifestage: any;  
  pricerange: any;
  theme: any;
  list: any;
  loader: any;
  total_page: any;
  space_name2: any = '';
  lifeStage_filter_value: any = '';
  theme_filter_value: any = '';
  page_name_query: any = 1;
  per_page: any = 12;
  current_page: any = 1;
  ngOnInit() {
    this.getDropdownSpace();
    // this.getPortfolioList(this.space_name2, this.lifeStage_filter_value, this.theme_filter_value, '', this.page_name_query, this.per_page, '');
    this.getPortfolioList(1,'', '', '', '', this.per_page, '');
  }
  pagination;
  getpageNumber(event:any) {
    this.current_page = event;
    this.pagination = event;
    this.getPortfolioList(event,this.space_filter_value, this.lifeStage_filter_value, this.theme_filter_value, this.final_price, this.per_page, '')
  }
  getDropdownSpace() {
      this.space_name = ["Bedroom",
      "Kitchen",
        "Living",
      "Kids Room"];
    
      this.lifestage = [
        "baby vibes",
        "happy vibes",
        "lively vibes",
        "love vibes",
        "young vibes"
      ];
    
      this.theme = [
        "",
        "Contemporary",
        "Indian Ethnic",
        "Lifestage Kitchen",
        "Minimalist",
        "Modern",
        "Rustic Industrial",
        "Transitional"
      ];
      this.pricerange = [{
        name: 'Under ₹ 1 Lakh'},
      { name: '₹ 1 Lakh to ₹ 2 Lakh' },
        { name: '₹ 2 Lakh to ₹ 3 Lakh' },
        { name: '₹ 3 Lakh to ₹ 4 Lakh' },
      {name: 'Over ₹ 4 Lakh'}
      ]
  }

  space_filter_value: any = '';
  space_name3: any;
  spaceFilter(event: any) {
    this.space_filter_value = event.target.value;
    if (this.space_filter_value !== undefined) {
      this.space_name3 = this.space_filter_value;
    }
    else {
      this.space_name3 = ''
    }
    // this.router.navigate(['/spaces'],
    // { queryParams: {space_name: this.space_name3, page: this.page_name_query}})  
    this.getPortfolioList(1,this.space_filter_value, this.lifeStage_filter_value, this.theme_filter_value, '',  this.per_page, '');
  }

  // lifeStage_filter_value: any = '';
  lifeStageFilter(event: any) {
    this.lifeStage_filter_value = event.target.value;
    if(this.lifeStage_filter_value === "young vibes"){
      this.lifeStage_filter_value = "young_vibes";
    }
    if(this.lifeStage_filter_value === "love vibes"){
      this.lifeStage_filter_value = "love_vibes";
    }
    if(this.lifeStage_filter_value === "baby vibes"){
      this.lifeStage_filter_value = "baby_vibes";
    }
    if(this.lifeStage_filter_value === "happy vibes"){
      this.lifeStage_filter_value = "happy_vibes";
    }
    if(this.lifeStage_filter_value === "lively vibes"){
      this.lifeStage_filter_value = "lively_vibes";
    }
    this.getPortfolioList( 1,this.space_filter_value, this.lifeStage_filter_value, this.theme_filter_value, '',this.per_page, '');
  }

  // theme_filter_value: any = '';
  themeFilter(event: any) {
    this.theme_filter_value = event.target.value;
    this.getPortfolioList( 1,this.space_filter_value, this.lifeStage_filter_value, this.theme_filter_value, '', this.per_page, '');
  }
  headers_res;
  getPortfolioList(space: any, lifeStage: any, theme: any, range:any, curr_page: any, per_page: any, search_string: any) {
    this.portfolioService.getPortfolioList(space, lifeStage, theme,range, curr_page, per_page, search_string).subscribe(res => {
      this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
      this.current_page = this.headers_res.get('x-page');
				res= res.json();
        this.list = res;
      this.loader = false;
    })
  }


price_filter_value: any = '';
final_price: any = [];
priceFilter(event: any) {
  this.price_filter_value = event.target.value;
  if (this.price_filter_value ==='Under ₹ 1 Lakh') {
    this.final_price = JSON.stringify([[0, 10000], [10000, 100000]]);
  }
  if (this.price_filter_value === '₹ 1 Lakh to ₹ 2 Lakh') {
    this.final_price = JSON.stringify([[100000, 200000], [100000, 200000]]);
  }
  if (this.price_filter_value === '₹ 2 Lakh to ₹ 3 Lakh') {
    this.final_price = JSON.stringify([[200000,300000],[200000,300000]]);
  }
  if (this.price_filter_value === '₹ 3 Lakh to ₹ 4 Lakh') {
    this.final_price = JSON.stringify([[300000,400000],[300000,400000]]);
  }
  if (this.price_filter_value === 'Over ₹ 4 Lakh') {
    this.final_price = JSON.stringify([[400000,1000000],[1000000,130000000]]);
  }
  this.getPortfolioList(1,this.space_filter_value, this.lifeStage_filter_value, this.theme_filter_value, this.final_price, this.per_page, '');
}

  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }

  btnClick(id: any) {
    this.router.navigate(['/browse-preset-inclusion/' + id]);
  }

}
