import { Component, EventEmitter, Input, OnInit, Output, NgZone, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { ProjectService } from '../../project/project/project.service';
import { QuotationService } from '../../quotation/quotation.service';
import { LeadService } from '../../lead/lead.service';
import { Routes, RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;
import { Location } from '@angular/common';

@Component({ 
  selector: "app-view-proposal",
  templateUrl: "./view-proposal.component.html",
  styleUrls: ["./view-proposal.component.scss"],
  providers: [QuotationService, LeadService],
})
export class ViewProposalComponent implements OnInit {
  public proList: any;
  public quotation: any;

  public pptList: any;
  public uploaded_ppt_list: any;
  public ppt_value = [];
  public uploaded_ppt_value = [];
  successalert = false;
  errorMessage: string;
  erroralert = false;
  successMessage: string;
  prop_id;
  boq_id;
  proposal_type;
  proposal: any;
  boq_list;
  discount_list;
  ppt_list;
  project_id;
  lead_id;
  role: string;
  dis_amt = [];
  dis_nw;
  final_amt = [];
  final_edit_amt = [];
  proposal_status;
  boqProducts_all;
  customer_status;
  editFlag = false;
  editPptFlag = false;
  editPptFlag1 = false;
  paymentForm: FormGroup;
  image: any;
  attachment_name: string;
  basefile = {};
  pptEdit_list: any;
  propose_type;
  line_item_details;
  SelectCname: any;
  objectKeys = Object.keys;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private leadService: LeadService,
    private quotationService: QuotationService,
    private _location: Location,
    private fb: FormBuilder
  ) {
    this.role = localStorage.getItem("user");
    this.paymentForm = fb.group({
      payment_type: ["", Validators.required],
      quotations: ["", Validators.required],
      paid_amount: ["", Validators.required],
      mode_of_payment: ["", Validators.required],
      bank: [""],
      branch: [""],
      date_of_checque: [""],
      date: [""],
      image: [""],
    });
  }

  user_id;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.prop_id = params["propId"];
      this.lead_id = params["leadId"];
      this.project_id = params["projectId"];
    });
    this.route.queryParams.subscribe((params) => {
      this.customer_status = params["status"];
      this.propose_type = params["type"];
    });
    this.proposalList(this.prop_id);
    this.user_id = localStorage.getItem("userId");
    this.SelectCname ='';
     this.isDisabled = false;

    this.getOBdiscount()
  }
  dis;
  dis_nw_onchange;
  onInputDiscount(event, boq, index, id: number) {
    var elemid = event.target.id;
    this.dis = event.target.value;
    if (this.dis < 0) {
      alert("Discount Value should be greater than equal to zero");
      $("#boq_" + id).val(0);
      this.dis = 0;
    }
    if (this.dis > 100) {
      alert("Discount Value Should Be Less Than Equal To 100");
      $("#boq_" + id).val(100);
      this.dis = 100;
    }

    var obj = {
      quantVal: this.dis,
    };

    for (let i = 0; i < this.boqProducts.length; i++) {
      if (this.boqProducts[i].proposed_doc_id == boq.proposed_doc_id) {
        var cal = (boq.quotation.net_amount * <any>obj.quantVal) / 100;
        var final = boq.quotation.net_amount - cal;
        this.final_amt[index] = final;
        this.boqProducts[i].discount_value = this.dis;
      }
    }
    // changing the value of discount in  view list
    for (let i = 0; i < this.boq_list.length; i++) {
      if (this.boq_list[i].proposed_doc_id == boq.proposed_doc_id) {
        this.boq_list[i].discount_value = this.dis;
      }
    }
    //end here

    this.dis_amt[index] = this.dis;
    this.dis_nw = this.dis;
    this.dis_nw_onchange = this.dis;
  }
  onChange(event) {
    this.image = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result;
      // this.paymentForm.patchValue({image: this.basefile})
    };

    fileReader.readAsDataURL(this.image);
  }

  confirmAndApprove(status, propDocId) {
    if (confirm("Are You Sure You Want To Approve?") == true) {
      this.approveDiscountProposal(status, propDocId);
    }
  }
  rejectnewpromo(status, propDocId){
    if(confirm("Are You Sure You Want To Reject?")== true){
      this.approveDiscountProposal(status, propDocId);
    }
  }
  confirmAndReject(status, propDocId) {
    if (confirm("Are You Sure You Want To Reject?") == true) {
      this.approveDiscountProposal(status, propDocId);
    }
  }
  approveDiscountProposal(status, propDocId) {
    this.loaderService.display(true);
    for (let i = 0; i < this.boq_list.length; i++) {
      if (this.boq_list[i].proposed_doc_id == propDocId) {
        this.dis_nw = this.boq_list[i].discount_value;
      }
    }
    //
    if (this.dis_nw == this.dis_nw_onchange) {
      var obj = {
        discount_value: this.dis_nw,
      };
    } else {
      var obj = {
        discount_value: this.dis_nw_onchange,
      };
    }
    this.quotationService
      .approveDiscountProposal(obj, status, propDocId)
      .subscribe(
        (res) => {
          alert(res.message);
          this.proposalList(this.prop_id);
          this.successalert = true;
          this.loaderService.display(false);
          this.successMessage = res.message;
          setTimeout(()=>{
            this.successalert = false;
          },2000)
        },
        (err) => {
          this.loaderService.display(false);
          this.msgError = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(()=>{
            this.msgError = false;
          },2000)
        }
      );
  }

  draft_check;
  boqProducts;
  boqProductsList;
  boqEditProducts;
  accepted_check = [];
  total_amount = [];
  proposal_state;
  promos=''



  obdiscont:any;
  getOBdiscount() {
    this.loaderService.display(true);
    this.quotationService
      .getOBdiscount(this.project_id)
      .subscribe(
        (res) => {
          this.loaderService.display(false);
          this.discount_list=res.data.quotations
          console.log(this.discount_list.quotations)
          this.obdiscont=res.data.total_discount_percentage

        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  hoveredIndex: number | null = null;
  toggledIndex: number | null = 0;
togglePromo(index: number) {
  this.toggledIndex = this.toggledIndex === index ? null : index;
}

  proposalList(val) {
    this.loaderService.display(true);
    this.boq_id = val;
    this.proposal_type = "initial_design";
    this.quotationService
      .getViewlList(this.boq_id, this.proposal_type)
      .subscribe(
        (res) => {
          this.proposal = res["proposal"];

          this.draft_check = this.proposal.is_draft;

          this.project_id = this.proposal.project.id;
          this.boq_list = this.proposal["proposed_quotations"];
          this.boqProducts = this.boq_list;
          this.boqProductsList = this.boq_list;
          this.ppt_list = this.proposal["proposesd_presentations"];
          this.uploaded_ppt_list =
            this.proposal["proposesd_uploaded_presentations"];

          this.pptEdit_list = this.ppt_list;

          for (let i = 0; i < this.boqProductsList.length; i++) {
            this.total_amount[i] = this.boqProductsList[i].final_amount;
          }
          for (let i = 0; i < this.boq_list.length; i++) {
            this.final_amt[i] = this.boq_list[i].final_amount;
          }
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }
  CnameStatus(e){
    this.SelectCname = e.target.value;
   
  }

  confirmAndApproveQuote(boqId, quoteStatus) {
    this.loaderService.display(true);
    this.quotationService
      .confirmAndApproveQuote(this.project_id, boqId, quoteStatus)
      .subscribe(
        (res) => {
          alert(res.message);
          this.proposalList(this.prop_id);
          this.loaderService.display(false);
        },
        (err) => {
          this.loaderService.display(false);
        }
      );
  }

  //  delete function for deleting boqs
  deletEditBoq(Value, boqEdit) {
    this.boqProductsList.splice(this.boqProductsList.indexOf(boqEdit), 1);
    this.quotationService.deleteEditBoq(Value).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = "Delete Created BOQ successfully!";
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
      },

      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  //end here
  //  delete function for deleting ppts
  deletEditPpt(Value, pptEdit) {
    this.pptEdit_list.splice(this.pptEdit_list.indexOf(pptEdit), 1);
    this.quotationService.deleteEditBoq(Value).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = "Delete Created PPT successfully!";
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
      },

      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  deletEditUploadedPpt(Value, pptEdit) {
    this.uploaded_ppt_list.splice(this.uploaded_ppt_list.indexOf(pptEdit), 1);
    this.quotationService.deleteEditBoq(Value).subscribe(
      (res) => {
        this.successalert = true;
        this.successMessage = "Delete Uploaded PPT successfully!";
        this.loaderService.display(false);
        setTimeout(
          function () {
            this.successalert = false;
          }.bind(this),
          10000
        );
      },

      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  //end here
  onInputDiscountCahnge(elemid, product, index, id: number) {
    this.dis = (<HTMLInputElement>document.getElementById(elemid)).value;
    if (this.dis > 10) {
      alert("Discount Value should be less than 10");
      $("#product_" + id).val(10);
      this.dis = 10;
    }

    var obj = {
      quantVal: this.dis,
    };
    var cal = (product.net_amount * <any>obj.quantVal) / 100;
    var final = product.net_amount - cal;
    this.final_edit_amt[index] = final;
    this.dis_amt[index] = this.dis;
  }
  onInputEditDiscount(elemid, product, index, id: number) {
    this.dis = (<HTMLInputElement>document.getElementById(elemid)).value;

    if (this.dis > 10) {
      alert("Discount Value should be less than 10");
      $("#product_" + id).val(10);
      this.dis = 10;
    }

    for (let i = 0; i < this.boqProductsList.length; i++) {
      if (this.boqProductsList[i].proposed_doc_id == product.proposed_doc_id) {
        var obj = {
          quantVal: this.dis,
        };
        var cal = (product.quotation.net_amount * <any>obj.quantVal) / 100;
        var final = product.quotation.net_amount - cal;
        this.total_amount[i] = final;
        this.boqProductsList[i].discount_value = this.dis;
      }
    }

    this.dis_amt[index] = this.dis;
    this.dis_nw = this.dis;
  }
  option_val;
  status;
  saveProposal(status) {
    this.status = status;
    if (this.status == "draft") {
      this.option_val = "yes";
    } else {
      this.option_val = "no";
    }
    this.loaderService.display(true);
    var products = new Array();
    var products1 = new Array();
    for (var l = 0; l < this.boqEditProducts.length; l++) {
      var obj = {
        ownerable_id: this.boqEditProducts[l].id,
        ownerable_type: "Quotation",
        discount_value: this.dis_amt[l],
      };
      products.push(obj);
    }
    for (var l = 0; l < this.boqProductsList.length; l++) {
      var obj1 = {
        proposal_doc_id: this.boqProductsList[l].proposed_doc_id,
        discount_value: this.boqProductsList[l].discount_value,
      };
      products1.push(obj1);
    }
    for (var j = 0; j < this.pptEdit_list.length; j++) {
      var obj3 = {
        proposal_doc_id: this.pptEdit_list[j].proposed_doc_id,
        discount_value: this.pptEdit_list[j].discount_value,
      };
      products1.push(obj3);
    }
    for (var j = 0; j < this.uploaded_ppt_list.length; j++) {
      var obj4 = {
        proposal_doc_id: this.uploaded_ppt_list[j].proposed_doc_id,
        discount_value: this.uploaded_ppt_list[j].discount_value,
      };
      products1.push(obj4);
    }

    for (var l = 0; l < this.ppt_value.length; l++) {
      var obj2 = {
        ownerable_id: this.ppt_value[l].id,
        ownerable_type: "Presentation",
      };
      products.push(obj2);
    }
    for (var l = 0; l < this.uploaded_ppt_value.length; l++) {
      var uploadedPpt = {
        ownerable_id: this.uploaded_ppt_value[l].uploaded_presentation.id,
        ownerable_type: "BoqAndPptUpload",
      };
      products.push(uploadedPpt);
    }

    var data = {
      ownerables: products,
      ownerables_for_update: products1,
      proposal: {},
      is_draft: this.option_val,
    };
    this.quotationService.postEditProposal(data, this.prop_id).subscribe(
      (res) => {
        $("#myProposal").modal("hide");
        this.backClicked();
        this.loaderService.display(false);

        // this.router.navigateByUrl('lead/{{ tis.lead_id }}/proposals');
      },

      (err) => {
        this.loaderService.display(false);
      }
    );
  }
  selectDiv(obj, i) {
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectBoq($("#obj" + obj.id).prop("checked"), obj, i);
    if ($("." + obj.id).hasClass("divActive")) {
      $("." + obj.id).removeClass("divActive");
    } else {
      $("." + obj.id).addClass("divActive");
    }
  }
  selectDiv1(obj, i) {
    $("#obj" + obj.id).prop("checked", !$("#obj" + obj.id).prop("checked"));
    this.selectPpt($("#obj" + obj.id).prop("checked"), obj, i);
    if ($("." + obj.id).hasClass("divActive")) {
      $("." + obj.id).removeClass("divActive");
    } else {
      $("." + obj.id).addClass("divActive");
    }
  }
  selectedBoqIds: any = [];
  selectBoq(checked, boqvalue, index) {
    this.editFlag = true;

    if (checked) {
      this.boqEditProducts.push(boqvalue);
      this.selectedBoqIds.push(boqvalue.id);
    } else {
      this.boqEditProducts.splice(this.boqProducts.indexOf(boqvalue), 1);
      this.selectedBoqIds.splice(this.selectedBoqIds.indexOf(boqvalue.id), 1);
    }

    // for(var i=0;i<this.boqEditProducts.length;i++){
    //   this.final_amt[i]=this.boqEditProducts[i].net_amount;
    // }
    //
  }
  selectPpt(checked, obj, index) {
    this.editPptFlag = true;
    if (checked) {
      this.ppt_value.push(obj);
    } else {
      const index1: number = this.ppt_value.indexOf(obj);
      this.ppt_value.splice(index1, 1);
    }
  }
  state = "boq";
  selectSet(set) {
    this.state = set;
    this.toggledIndex=0
  }

  // function for getting ppt and boq list for particular projetcs
  setProposal(val) {
    this.proposal_status = val;
    if (this.proposal_status == "boq") {
      this.quotationService
        .getBoqList(this.proposal_type, this.project_id)
        .subscribe(
          (res) => {
            this.quotation = res["quotations"];
            for (var k = 0; k < this.quotation.length; k++) {
              this.final_edit_amt[k] = this.quotation[k].net_amount;
            }
          },
          (err) => {}
        );
    } else {
      this.quotationService
        .getBoqList(this.proposal_type, this.project_id)
        .subscribe(
          (res) => {
            this.pptList = res["presentations"];
          },
          (err) => {}
        );
    }
  }
  deleteBoq(Value) {
    const index1: number = this.boqProducts.indexOf(Value);
    this.boqProducts.splice(index1, 1);
  }

  //end function for getting ppt and boq list

  //start finction for getting boq list based on approve and rejected
  BoqId;
  ownerableType;
  filterBoq(event) {
    this.loaderService.display(true);
    this.ownerableType = "Quotation";
    var value = event.target.value;
    if (value == "all") {
      this.ownerableType = "Quotation";
      this.quotationService
        .getAllBoqList(this.ownerableType, this.prop_id)
        .subscribe(
          (res) => {
            this.boq_list = res["proposal_docs"];

            this.loaderService.display(false);
          },

          (err) => {
            this.loaderService.display(false);
          }
        );
    } else {
      this.quotationService
        .getBoqListByStatus(value, this.prop_id, this.ownerableType)
        .subscribe(
          (res) => {
            this.boq_list = res["proposal_docs"];
            this.loaderService.display(false);
          },

          (err) => {
            this.loaderService.display(false);
          }
        );
    }
  }
  //end finction for getting boq list based on approve and rejected

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

  ngOnDestroy() {
    $(function () {
      $(".pop").remove();
    });
  }

  ngAfterViewInit() {
    this.boqEditProducts = new Array();
    $(".cheque-mode").css("display", "none");
    $(".neft-mode").css("display", "none");

    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }
  backClicked() {
    this._location.back();
  }

  changePaymentMode(event) {
    if (event.target.value == "NEFT/RTGS") {
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");
    } else if (event.target.value == "cheque") {
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
    }
  }

  addPayment(boq_id) {
    this.paymentForm.patchValue({ quotations: boq_id });
  }

  payment_history_list: any = [];
  paymentHistory(boq_id) {
    this.quotationService.paymentHistory(boq_id).subscribe(
      (res) => {
        this.payment_history_list = res.payments;
      },
      (err) => {
        alert("Something went wrong");
      }
    );
  }
  selectDiv2(obj, i) {
    $("#obj" + obj.uploaded_presentation.id).prop(
      "checked",
      !$("#obj" + obj.uploaded_presentation.id).prop("checked")
    );
    this.selectUploadedPpt(
      $("#obj" + obj.uploaded_presentation.id).prop("checked"),
      obj,
      i
    );
    if ($("." + obj.uploaded_presentation.id).hasClass("divActive")) {
      $("." + obj.uploaded_presentation.id).removeClass("divActive");
    } else {
      $("." + obj.uploaded_presentation.id).addClass("divActive");
    }
  }
  selectUploadedPpt(checked, obj, index) {
    this.editPptFlag1 = true;

    if (checked) {
      this.uploaded_ppt_value.push(obj);
    } else {
      const index1: number = this.uploaded_ppt_value.indexOf(obj);
      this.uploaded_ppt_value.splice(index1, 1);
    }
  }

  deletePromoCode(promoCodeId, quotationId) {
    console.log(promoCodeId)
    if (confirm("Are You Sure You Want To Remove This Promotion?") == true) {
      this.loaderService.display(true);
      this.leadService
        .deletePromoPackages(this.project_id, quotationId, promoCodeId)
        .subscribe(
          (res) => {
            this.proposalList(this.prop_id);
            this.loaderService.display(false);
            this.successMessage = "Promotion Removed successfully!";
          },
          (err) => {
            this.loaderService.display(false);
            this.errorMessage = "Something went wrong, Please try again!";
          }
        );
    }
  }

  ref_num;
  data_res;
  boq_id_price;
  total_price;
  discounted_price;
  promotion_applied;
  job_price_status;
  files_uploaded = [];
  job_price_match;
  total_2nd;
  total_3rd;
  total_4th;
  total_5th;
  compothername ="";
  isDisabled = false;
  allcomps:any;
getallcompname(){
  this.leadService.getallcomp().subscribe(res=>{
this.allcomps = res.price_match_competitor;
  })
}
  getPriceDetails(val1, val2) {
    this.boq_id_price = val1;
    this.compothername ="";
     this.isDisabled = false;
    this.loaderService.display(true);
    this.leadService.showLineitem(val2, val1).subscribe(
      (response) => {
       this.getallcompname();
        this.data_res = response;
        this.line_item_details = this.data_res.quotation;
        this.SelectCname = this.line_item_details.price_match_competitor;
        if (this.SelectCname == null || this.SelectCname ==undefined){
          this.SelectCname ='';
        } else if (
          this.SelectCname != "livespace" &&
          this.SelectCname != "homelane" &&
          this.SelectCname != "design_cafe" &&
          this.SelectCname != "bonito_designs" &&
          this.SelectCname != "dlife" &&
          this.SelectCname != "others"
        ) {
          this.isDisabled = true;
        }
          this.ref_num = this.data_res.quotation.reference_number;
        this.total_price = this.data_res.quotation.total_amount_before_discount;
        this.discounted_price = this.data_res.quotation.flat_amount;
        this.promotion_applied = this.data_res.quotation.promotion_applied;
        this.job_price_status = this.data_res.quotation.job_price_status;
        this.files_uploaded = this.data_res.quotation.files;
        this.job_price_match = this.data_res.quotation.job_price_match_discount;
        this.total_2nd = this.data_res.quotation.promotion_amount;
        this.total_3rd =
          this.data_res.quotation.total_amount_after_discount_without_price_match;
        this.total_4th = this.data_res.quotation.price_match_amount;
        this.total_5th =
          this.data_res.quotation.total_amount_after_price_match_discount;
        this.loaderService.display(false);
      },
      (err) => {
        this.loaderService.display(false);
      }
    );
  }

  final_obj_push = [];
  // amount_requested = 0;
  item_checked(val1, val2, val3, index1) {
    const index = this.final_obj_push.findIndex((e) => e.ownerable_id == val2);
    if (!(index < 0)) {
      this.final_obj_push.splice(index, 1);
    }
    if (index1 != "") {
      var final_price = parseInt(index1);
      var obj = {
        ownerable_type: val1,
        ownerable_id: val2,
        arrivae_original_price: val3,
        arrivae_offer_price: final_price,
        approved_price: "",
      };
      this.final_obj_push.push(obj);
    }
  }

  submit_obj_push = [];
  final_pricecheck(id, price, event) {
    if (event.target.checked) {
      var obj = {
        id: parseInt(id),
        approved_price: price,
      };
      this.submit_obj_push.push(obj);
    } else {
      const index = this.submit_obj_push.findIndex((e) => e.id == id);
      if (!(index < 0)) {
        this.submit_obj_push.splice(index, 1);
      }
    }
  }

  errorMessages: string;
  successMessages: string;
  msgError: boolean = false;
  successError: boolean = false;
  submit_final_price_approve() {
    var obj1 = {
      quotation_id: this.boq_id_price,
      status: "approved",
      status_updated_by_id: parseInt(this.user_id),
      line_items: this.submit_obj_push,
    };
    this.loaderService.display(true);
    this.leadService.finalapproveprice(obj1).subscribe(
      (res) => {
        this.successError = true;
        this.successMessages = res.message;
        $("#priceMatchrequest").modal("hide");
        this.loaderService.display(false);
        this.submit_obj_push = [];
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          7000
        );
      },
      (err) => {
        this.loaderService.display(false);
        this.msgError = true;
        this.errorMessages = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          7000
        );
      }
    );
  }

  submit_final_price_reject() {
    var obj1 = {
      quotation_id: this.boq_id_price,
      status: "rejected",
      status_updated_by_id: parseInt(this.user_id),
      line_items: this.submit_obj_push,
    };
    this.loaderService.display(true);
    this.leadService.finalapproveprice(obj1).subscribe(
      (res) => {
        this.successError = true;
        this.successMessages = res.message;
        $("#priceMatchrequest").modal("hide");
        this.loaderService.display(false);
        this.submit_obj_push = [];
        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          7000
        );
      },
      (err) => {
        this.loaderService.display(false);
        this.msgError = true;
        this.errorMessages = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          7000
        );
      }
    );
  }

  submit_price() {
    if(this.SelectCname == 'others'){
      this.SelectCname = this.compothername;
    }
    var obj1 = {
      quotation_id: this.boq_id_price,
      status_updated_by_id: this.user_id,
      line_items: this.final_obj_push,
      job_price_matches_image: this.attachement_files,
      price_match_competitor:this.SelectCname
    };
    this.loaderService.display(true);
    this.leadService.jobPriceMatch(obj1).subscribe(
      (res) => {
        this.successError = true;
         this.isDisabled = false;
        this.successMessages = res.message;
        $("#priceMatchrequest").modal("hide");
        this.loaderService.display(false);
        this.attachement_files = [];
        this.final_obj_push = [];

        setTimeout(
          function () {
            this.successError = false;
          }.bind(this),
          7000
        );
      },
      (err) => {
        this.loaderService.display(false);
        this.SelectCname="";
        this.compothername ="";
         this.isDisabled = false;
        this.msgError = true;
        this.errorMessages = JSON.parse(err["_body"]).message;
        setTimeout(
          function () {
            this.msgError = false;
          }.bind(this),
          7000
        );
      }
    );
  }

  lead_cv: any;
  attachement_files = [];
  submitted_file_amount: any;
  uploadCV(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      this.submitted_file_amount = filesAmount;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        var base64;
        reader.onload = (fileLoadedEvent) => {
          var image = new Image();
          base64 = fileLoadedEvent.target;

          this.attachement_files.push(base64.result);
        };
        reader.readAsDataURL(event.target.files[i]);
        // this.imageNamess.push(event.target.files[i].name);
      }
    }
  }

  remove_cancel() {
    $("#priceMatchrequest").modal("hide");
    // this.amount_requested = 0;
  }


  selectedrow: any;
  row = [""];
  pending_count: any;
  check_variable: any;
  pending_arr: any = [];
  count_data_red: number = 0;
  count_data: number = 0;
  count_ids: any = [];

  expansion :any


  // toggleRow(i) {
  //   if (this.row[0] !== ) {
    
  //     this.expansion = po.id;
  //     this.row[0] = po.id;
  //     this.pending_count = count;
  //     this.check_variable = i;
  //     this.row2[0] = "";
  //     this.selected_item = "";
  //   } else {
  //     this.row[0] = "";
  //     this.expansion = "";
  //   }
  // }

  catformat(data){
    console.log("hi")
      let dat = data.split("_");
      let date2 = [];
      dat.forEach((el) => {
        if (el == "mto") {
          el = "MTO";
        }
        if (el == "mk") {
          el = "MK";
        }
        if (el == "mw") {
          el = "MW";
        }
        date2.push(el);
      });
      return date2.join(" ");
    }


}