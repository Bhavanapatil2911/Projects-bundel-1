import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CatalogueService } from "app/platform/organisation/catalogue/catalogue.service";
import { LoaderService } from "app/services/loader.service";
import { environment } from "../../../../environments/environment";
declare var $: any;

@Component({
  selector: "app-curtain-details",
  templateUrl: "./curtain-details.component.html",
  styleUrls: ["./curtain-details.component.css"],
})
export class CurtainDetailsComponent implements OnInit {
  @Input() counts: number;
  @Input() spaces: number;
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter();
  @Output() backbtn: EventEmitter<boolean> = new EventEmitter();
  projectId;
  quotation_id;
  baseUrl = environment.apiBaseUrl;
  window = window;
  selectedIndex = 0;
  constructor(
    private loaderService: LoaderService,
    private catalogueService: CatalogueService,
    private route: ActivatedRoute
  ) {}

  qid;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params["project_id"];
      this.qid = params["boqid"];
    });
    this.quotation_id = localStorage.getItem("quotation_id");
    if (this.quotation_id === null) {
      this.quotation_id = this.qid;
    }
    this.getCurtainDetailsById(this.counts);
    this.getHardwaresData();
    this.getFabricsData();
    this.getVariantsData(this.counts);
  }

  product_detail: any = {};
  variation: any = [];
  medium_image;
  fabric: any = [];

  fabricList: any = [];
  selectedFabric;
  hardwareList: any = [];
  selectedHardware;
  variationList: any = [];
  width_value;
  height_value;
  quantity_value;
  final_price;

  getFabricsData() {
    this.catalogueService.getFabrics().subscribe((res) => {
      this.fabricList = res;
    });
  }

  getHardwaresData() {
    this.catalogueService.getHardwares().subscribe((res) => {
      this.hardwareList = res;
    });
  }

  getVariantsData(id) {
    this.catalogueService.getVariants(id).subscribe((res) => {
      this.variationList = res;
    });
  }

  getCurtainDetailsById(id) {
    this.catalogueService.getCurtaindetailsById(id).subscribe((res) => {
      this.product_detail = res.curtain;
      this.medium_image = this.product_detail.images[0];
      this.variation = res.curtain.variants;
      this.fabric = res.curtain.fabric_lists;
    });
  }

  changeFabricHandler(val) {
    this.selectedFabric = val;
    this.getCurtainPrice();
  }

  changeHardwareHandler(val) {
    this.selectedHardware = val;
    this.getCurtainPrice();
  }

  changeVariantsHandler(val) {
    this.counts = val;
    this.getCurtainDetailsById(val);
  }

  // fabricId = "";
  // getFabricId(e) {
  //   this.fabricId = e;
  //   this.getCurtainPrice();
  // }

  onBlurMethod() {
    this.final_price = 0;
    if (this.width_value > 0 && this.height_value > 0) this.getCurtainPrice();
  }

  show_price: boolean = false;
  getCurtainPrice() {
    this.catalogueService
      .getCurtainPrice(
        this.counts,
        this.width_value,
        this.height_value,
        this.selectedFabric,
        this.selectedHardware
      )
      .subscribe((res) => {
        this.final_price = res.calculated_price;
        this.show_price = true;
      });
  }

  selectedQuantity;
  product_notify_message;
  notificationAlert = false;
  addProductToBoqs() {
    this.loaderService.display(true);
    var obj = {
      id: this.counts,
      fabric_id: this.selectedFabric,
      space: this.spaces,
      hardware: this.selectedHardware,
      quantity: this.quantity_value,
      width: this.width_value,
      height: this.height_value,
    };

    this.catalogueService
      .addboqJobToSpace(this.projectId, this.quotation_id, obj)
      .subscribe(
        (res) => {
          this.product_notify_message = "Product has been added";
          this.notificationAlert = true;
          setTimeout(
            function () {
              this.notificationAlert = false;
            }.bind(this),
            10000
          );
          this.loaderService.display(false);
          this.notifyParent.emit(true);
          $("#addProductModal").modal("hide");
          $("#addProductModal").scrollTop(0);
        },
        (err) => {
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          $("#addProductModal").scrollTop(0);
        }
      );
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

  selectVariation(id) {
    this.product_detail = this.variation.find((i) => (i.id = id));
  }

  biggerImage;
  currentIndex;
  selectedIndexChange = 0;
  sendMidImge(event, index) {
    this.biggerImage = event;
    this.selectedIndexChange = index;
    this.medium_image = event;
  }

  count = 0;
  imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    result.setAttribute("style", "display: block;");

    if (this.count == 0) {
      this.count = 1;
      /*create lens:*/
      lens = document.createElement("DIV");
      lens.setAttribute("id", "myLens");

      lens.setAttribute(
        "style",
        "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);"
      );
    } else {
      var element = document.getElementById("myLens");

      document.getElementById("myLens").remove();

      lens = document.createElement("DIV");
      lens.setAttribute("id", "myLens");
      lens.setAttribute(
        "style",
        "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);"
      );
    }
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize =
      img.width * cx + "px " + img.height * cy + "px";

    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - lens.offsetWidth / 2;
      y = pos.y - lens.offsetHeight / 2;
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) {
        x = img.width - lens.offsetWidth;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > img.height - lens.offsetHeight) {
        y = img.height - lens.offsetHeight;
      }
      if (y < 0) {
        y = 0;
      }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
    }
    function getCursorPos(e) {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }
  removeHover(resultID) {
    var result1;
    result1 = document.getElementById(resultID);
    result1.setAttribute("style", "display: none;");
    document.getElementById("myLens").remove();
    this.count = 0;
  }

  goBack() {
  this.backbtn.emit(true);
  }

}
