import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CatalogueService } from "app/platform/organisation/catalogue/catalogue.service";
import { LoaderService } from "app/services/loader.service";
import { environment } from "../../../../environments/environment";
declare var $: any;

@Component({
  selector: "app-show-curtain-list",
  templateUrl: "./show-curtain-list.component.html",
  styleUrls: ["./show-curtain-list.component.css"],
})
export class ShowCurtainListComponent implements OnInit {
  headers_res;
  per_page;
  total_page;
  current_page;
  @Input() spacevalue: number;
  @Input() searchvalue: string;
  @Output() notifycatalogue: EventEmitter<boolean> = new EventEmitter();
  @Output() notifycatalogueres: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private loaderService: LoaderService,
    private catalogueService: CatalogueService
  ) {}

  ngOnInit() {
    this.getCurtainDetails(1, this.searchvalue);

  }

  ngOnChanges(): void {
    this.show_details = false;
    this.getCurtainDetails(1, this.searchvalue);
  }
  baseUrl = environment.apiBaseUrl;
  curtain_details = [];
  page_number;
  value;
  getCurtainDetails(page?, search?) {
    this.loaderService.display(true);
    this.catalogueService
      .getCurtainList(page, this.searchvalue, this.liked, this.news)
      .subscribe(
        (res) => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");
          res = res.json();
          this.curtain_details = res.curtains;
          if(this.curtain_details.length == 0 ){
            this.notifycatalogueres.emit(true);
          } else{
            this.notifycatalogueres.emit(false);
          }
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  curtain_id: any;
  show_details: boolean = false;
  activateProduct_details(id) {
    this.show_details = true;
    this.curtain_id = id;
  }

  show_catalogue: boolean = false;
  getNotification(evt) {
    this.show_details = false;
    this.notifycatalogue.emit(true);
  }

  getBackbtn(evt) {
    if (evt === true) {
      this.show_details = false;
    }
  }

  imageUrl;
  viewImage(e) {
    this.imageUrl = this.baseUrl + "/" + e;
    $("#imageModal").modal("show");
  }

  modalHide() {
    $("#imageModal").modal("hide");
  }

  erroralert: boolean = false;
  errorMessage: string;
  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function () {
        this.erroralert = false;
      }.bind(this),
      2000
    );
  }

  liked: boolean = false;
  fetchSavedProducts() {
    this.liked = true;
    this.getCurtainDetails(1, this.searchvalue);
  }

  product_notify_message: string;
  notificationAlert: boolean = false;
  likeProduct(product_id) {
    this.loaderService.display(true);
    this.catalogueService.likecurtainProduct(product_id).subscribe(
      (res) => {
        this.product_notify_message = "Added to your liked curtains";
        this.notificationAlert = true;
        setTimeout(
          function () {
            this.notificationAlert = false;
          }.bind(this),
          3000
        );
        this.getCurtainDetails(1, this.searchvalue);
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }

  sort_key: any = "popularity";
  news: boolean = false;
  sortFilter(sort_value) {
    this.sort_key = sort_value;
    let text;
    // if (sort_value == "price_low_to_high") {
    //   text = "Price: Low to High";
    // } else if (sort_value == "price_high_to_low") {
    //   text = "Price: High to Low";
    // }
    if (sort_value == "newest_first") {
      text = "Newest First";
      this.news = true;
    } else if (sort_value == "none") {
      text = "None";
      this.sort_key = "";
    }
    $(".sort-toggle").text(text);
    this.getCurtainDetails(1, this.searchvalue);
  }

  resetAll() {
    this.sort_key = "popularity";
    this.liked = false;
    this.news = false;
    $(".sort-toggle").text("Select");
  }

  clearAll() {
    this.resetAll();
    this.getCurtainDetails(1, this.searchvalue);
  }
}
