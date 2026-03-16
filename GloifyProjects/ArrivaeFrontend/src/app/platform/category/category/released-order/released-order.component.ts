import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { environment } from "environments/environment";
import { FormBuilder, FormGroup, Validators, FormControl } from '../../../../../../node_modules/@angular/forms';
declare var $: any;

@Component({
  selector: "app-released-order",
  templateUrl: "./released-order.component.html",
  styleUrls: ["./released-order.component.css"],
  providers: [CategoryService],
})
export class ReleasedOrderComponent implements OnInit {
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  TransactionChargesForm: FormGroup;
  @Input() data;
  @Input() showStaticText:any = 'false';
  project_type;
  searchItem: any;
  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) {}
  role: any;
  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.project_type = this.data;
    this.getPoTableData(1);
    this.TransactionChargesForm = this.formBuilder.group({
      transportation_tax: new FormControl(""),
      transportation_charges: new FormControl(""),
      transportation_tax_type: new FormControl(""),
    });
  }

  //To get table data
  wipData: any = [];
  wipData_data: any;
  page_number;
  per_page;
  total_page;
  current_page;
  headers_res;
  page: any = 1;
  getPoTableData(page) {
    this.page_number = page;
    this.loaderService.display(true);
    this.categoryService
      .getWipPoTable(this.page_number, this.project_type, this.searchdata)
      .subscribe(
        (res) => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get("x-per-page");
          this.total_page = this.headers_res.get("x-total");
          this.current_page = this.headers_res.get("x-page");

          res = res.json();
          this.wipData = res;

          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  //modify po
  modifyId;
  modifyPoId(id) {
    this.modifyId = id;
  }

  option;
  modifyPo() {
    this.option = "modify_po";
    this.loaderService.display(true);
    this.categoryService.modifyPos(this.modifyId, this.option).subscribe(
      (res) => {
        this.successalert = true;
        this.modifyId = null;
        this.successMessage = "Po modify successfully";
        $("#modifyPo").modal("hide");
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
        this.loaderService.display(false);
        this.getPoTableData(this.page_number);
      },
      (error) => {
        this.erroralert = true;
        this.loaderService.display(false);
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  cancleModifyPo() {
    this.modifyId = null;
    $("#canclePo").modal("hide");
    $("#modifyPo").modal("hide");
  }

  //cancle Po
  cancleId;
  cancelPoId(id) {
    this.cancleId = id;
  }

  canclePo() {
    this.option = "cancelled";
    this.loaderService.display(true);
    this.categoryService.modifyPos(this.cancleId, this.option).subscribe(
      (res) => {
        this.loaderService.display(false);
        this.successalert = true;
        this.cancleId = null;
        this.successMessage = "Po cancel successfully";
        $("#canclePo").modal("hide");
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          2000
        );
        this.getPoTableData(this.page_number);
      },
      (error) => {
        this.erroralert = true;
        this.loaderService.display(false);
        this.errorMessage = JSON.parse(error["_body"]).message;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          2000
        );
      }
    );
  }

  cancledcanclePo() {
    this.cancleId = null;
    $("#canclePo").modal("hide");
    $("#modifyPo").modal("hide");
  }

  //Recived po
  recivedItems = [];
  items;
  poId;
  status;
  releasepoId(item, status) {
    this.status = status;
    this.recivePoData = [];
    this.items = item;

    this.recivedItems = item.attributes.line_items;
    this.poId = item.attributes.id;

    if (this.status == "po_recieved") {
      this.getFullLineItem();
      $("#myModal").modal("show");
    } else if (this.status == "pending") {
      $("#recivedPo").modal("show");
      this.parent = false;
    }
    else if (this.status == "closed") {
      $("#recivedPo").modal("show");
      this.parent = false;
    }
  }

  //to check recived quantity
  checkRecivedQnty(value, qunt, id) {
    if (value > qunt) {
      alert("recived qty should be less than remaining qty");
      $("#inputId" + id).val(0);
    }
  }

  //to get full line item
  lineItem = [];
  getFullLineItem() {
    this.loaderService.display(true);
    this.categoryService.getFullLineItems(this.poId).subscribe(
      (res) => {
        this.lineItem = res.attributes.line_items;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  //for parent checkbox
  itemList;
  selectedItem = [];
  toggleAll(event, item) {

    console.log(this.recivedItems);
    if (event.target.checked) {
      item.attributes.line_items.forEach((data) => {
        data.checked = true;
        this.selectedItem.push(data.wip_orders_wip_slis_id);
        $("#inputId" + data.wip_orders_wip_slis_id).val(
          data.wip_sli.attributes.quantity
        );

        this.recivePoData = [];
      });
    } else {
      this.selectedItem = [];
      item.attributes.line_items.forEach((item) => {
        item.checked = false;
        $("#inputId" + item.wip_orders_wip_slis_id).val(0);
        this.recivePoData = [];
      });
    }
  }
  //for child checkbox
  parent: boolean;
  reciveQuantityData = [];
  toggleItem(event, data, i) {
    this.parent = false;
    data.checked = event.target.checked;
    if (event.target.checked == true) {
      this.parent = true;
      this.selectedItem.push(data.wip_orders_wip_slis_id);
      $("#inputId" + data.wip_orders_wip_slis_id).val(
        data.wip_sli.attributes.quantity
      );
      this.recivePoData = [];
      console.log(this.selectedItem);
    } else if (event.target.checked == false) {
      console.log(this.selectedItem);
      this.selectedItem.splice(i, 1);
      this.parent = false;
      $("#inputId" + data.wip_orders_wip_slis_id).val(0);
      this.recivePoData = [];
    }
  }

  //to release Po
  recivePoData = [];
  updateRecivedpo() {
    for (var i = 0; i < this.selectedItem.length; i++) {
      this.reciveQuantityData.push($("#inputId" + this.selectedItem[i]).val());
      this.recivePoData.push({
        id: this.selectedItem[i],
        quantity: this.reciveQuantityData[i],
      });
    }
    this.loaderService.display(true);
    this.categoryService
      .updateRecivedpos(this.poId, this.recivePoData)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.successalert = true;
          this.cancleId = null;
          this.successMessage = "Po recived successfully";
          $("#recivedPo").modal("hide");
          this.recivePoData = [];
          this.getPoTableData(this.page_number);
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            2000
          );
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  check_qty;
  sli_wip_id;
  setValueForQty(qty, id) {
    this.check_qty = qty;
    this.sli_wip_id = id;
  }

  //to check Quantity should less then remaning quantity
  checkPendingAmt(value) {
    if (value > this.check_qty) {
      alert("recived qty should be less than remaining qty");
      $("#recived_qty").val(0);
    }
  }

  //to update Quantity
  paymentQtyApprove() {
    if ($("#recived_qty").val() == 0) {
      alert("Enter valid number");
    }
    if ($("#recived_qty").val() != 0) {
      this.loaderService.display(true);
      this.recivePoData.push({
        id: this.sli_wip_id,
        quantity: $("#recived_qty").val(),
      });
      this.categoryService
        .updateRecivedpos(this.poId, this.recivePoData)
        .subscribe(
          (res) => {
            this.loaderService.display(false);
            this.successalert = true;
            this.cancleId = null;
            this.successMessage = "Quantity Update successfully";
            $("#editQuantityModal").modal("hide");
            this.recivePoData = [];
            $("#recived_qty").val(0);
            this.getFullLineItem();
            setTimeout(
              function () {
                this.successalert = false;
              }.bind(this),
              2000
            );
          },
          (err) => {
            this.loaderService.display(false);
          }
        );
    } else {
      alert("Please Enter Some Quantity");
    }
  }

  //for tooltip popover
  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }
  po_preview_pdf_url: any;
  purchase_order_id;
  po_preview_pdf_url_without_base_url: any;
  totalPages: number;
  isLoaded: boolean = false;
  getPOPdfForPreview(purchase_order_id?) {
    this.po_preview_pdf_url = undefined;
    if (purchase_order_id) {
      this.purchase_order_id = purchase_order_id;
      // this.downloadPoRelease(this.purchase_order_id);
    }
    this.loaderService.display(true);
    this.categoryService
      .getPOPdfForPreviewForBulk(this.purchase_order_id)
      .subscribe(
        (res) => {
          this.po_preview_pdf_url_without_base_url = JSON.parse(
            res._body
          ).display_path;
          this.po_preview_pdf_url =
            environment.apiBaseUrl + JSON.parse(res._body).display_path;
          if (
            this.po_preview_pdf_url == "" ||
            this.po_preview_pdf_url == null
          ) {
            this.erroralert = true;
            this.errorMessage = "Pdf not found for preview!!";
            setTimeout(
              function () {
                this.erroralert = false;
              }.bind(this),
              2000
            );
            $("#poPreviewModal").modal("hide");
          }
          this.loaderService.display(false);
        },
        (err) => {
          this.errorMessage = JSON.parse(err["_body"]).message;
          this.erroralert = true;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            13000
          );
          $("#poPreviewModal").modal("hide");
          this.loaderService.display(false);
        }
      );
  }
  deletePOPreviewPdf(id) {
    this.categoryService.deletePOPdf(id).subscribe(
      (res) => {
        $("#poPreviewModal").modal("hide");
        this.po_preview_pdf_url = null;
      },
      (err) => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function () {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        this.loaderService.display(false);
      }
    );
  }
  searchdata: any = "";
  searchForRelease(val) {
    this.searchdata = val;
    this.getPoTableData(this.page);
  }
  transportaionCharges: any = "no";

changeTransportation(e) {
  this.transportaionCharges = e;
  let tax_type = e;
  if (tax_type == "yes") {
    this.TransactionChargesForm.controls["transportation_tax"].setValidators(
      Validators.required
    );
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].setValidators(Validators.required);
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].setValidators(Validators.required);
    this.TransactionChargesForm.controls[
      "transportation_tax"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].updateValueAndValidity();
  } else {
    this.TransactionChargesForm.controls[
      "transportation_tax"
    ].clearValidators();
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].clearValidators();
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].clearValidators();
    this.TransactionChargesForm.controls["transportation_tax"].setValue("");
    this.TransactionChargesForm.controls["transportation_charges"].setValue(
      ""
    );
    this.TransactionChargesForm.controls["transportation_tax_type"].setValue(
      ""
    );

    this.TransactionChargesForm.controls[
      "transportation_tax"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_tax_type"
    ].updateValueAndValidity();
    this.TransactionChargesForm.controls[
      "transportation_charges"
    ].updateValueAndValidity();
  }
}
releasePO2(id) {
  $("#editPOModalTr").modal("show");
  this.purchaseorderId = id
  this.transportaionCharges  = 'no';
  this.changeTransportation(this.transportaionCharges)
}
purchaseorderId
resetTR() {
  $("#editPOModalTr").modal("hide");
  this.TransactionChargesForm.reset();
}
sendForApproval(data) {
  let obj = {
    transportation_status: this.transportaionCharges,
    transportation_tax: data.transportation_tax,
    transportation_charges: data.transportation_charges,
    transportation_tax_type: data.transportation_tax_type,
  };
  this.loaderService.display(true);
  this.categoryService.SendForApprovalmto(this.purchaseorderId, obj).subscribe(
    (res) => {
      this.loaderService.display(false);
      this.resetTR();
     
      this.successMessageShow(res.message);
      this.getPoTableData(this.current_page);
       
    },
    (err) => {
      this.loaderService.display(false);
      this.errorMessageShow(JSON.parse(err["_body"]).message);
    }
  );
}
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
successMessageShow(msg) {
  this.successalert = true;
  this.successMessage = msg;
  setTimeout(
    function () {
      this.successalert = false;
    }.bind(this),
    2000
  );
}
row=[""];
expansion:any;

toggleRow(ven) {
  if (this.row[0] !== ven) {
    this.expansion = ven;
    this.row[0] = ven;
  } else {
    this.row[0] = "";
    this.expansion = "";
  }
}
}
