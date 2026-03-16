import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams,
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toPromise";
import { Angular2TokenService } from "angular2-token";
import { AuthService } from "../../authentication/auth.service";
import { environment } from "../../../environments/environment";
import { months } from "moment";

@Injectable()
export class FinanceService {
  options: RequestOptions;

  private champion_incentive_masterlist =
    environment.apiBaseUrl + "/v1/users/master_page_for_champion_incentive";
  private champion_masterlistIncentive_paidapi =
    environment.apiBaseUrl + "/v1/users/payment_status_update";
  private champion_paid_champions_monthly_incentive_list =
    environment.apiBaseUrl +
    "/v1/users/get_paid_champions_monthly_incentive_detail";
  private champion_pending_champions_monthly_incentive_list =
    environment.apiBaseUrl +
    "/v1/users/get_pending_champions_monthly_incentive_detail";
  private championstatuscjeckboxapi =
    environment.apiBaseUrl + "/v1/users/update_payment_status_for_user";
  private downloadIncentivelistapi =
    environment.apiBaseUrl + "/v1/users/download_champion_incentive";
  private downloadIncentiveMonthDetailapi =
    environment.apiBaseUrl + "/v1/users/download_monthly_incentive_detail";

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) {
    this.options = this.authService.getHeaders();
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private extractDataPage(res: Response) {
    return res;
  }
  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

  getProjectList() {
    let url =
      environment.apiBaseUrl + "/v1/proposals/boq_approved_project_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProposalList(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/proposal_list_for_finance?project_id=" +
      projectId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getBoqList(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/approved_quotations";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPaymentDetails(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/payment_history";
    this.options = this.authService.getHeaders();
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCancelForPayment(cancelId){
    let url = environment.apiBaseUrl + "/v1/lead_payment_requests/cancel_cashfree_payment_link?payment_id=" + cancelId
    return this.http 
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  verifyPayment(paymentid) {
    let url =
      environment.apiBaseUrl + "/v1/proposals/payment_approval_by_financiar";
    var obj = {
      payment_id: paymentid,
      is_approved: "yes",
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  approvePayments(projectId, paymentid, data) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/" +
      paymentid +
      "/payment_approval";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPaymentQuotation(projectId, paymentid) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/" +
      paymentid;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  approveReportClousure(projectId, selectedBoq){
    let url =
    environment.apiBaseUrl +
    "/v1/projects/" +
    projectId +
    "/quotations/" +
    selectedBoq +
    "/bh_approve_closure"
    console.log(url)
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  approveBoq(projectId, boqid) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      boqid +
      "/change_wip_status";
    var obj = {
      approve: true,
    };
    if (this.options.params) {
      this.options.params.delete("quotation");
    }
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPercentBoqs(project_id, state) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/quotation_types?project_id=" +
      project_id +
      "&proposal_type=" +
      state;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPaymentHistory(project_id, boq_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payments/boq_payment_history?boq_id=" +
      boq_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  editPaymentApprove(projectId, paymentId, Amount) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/" +
      paymentId +
      "/update_paid_amount";
    return this.http
      .put(url, Amount, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downloadBoqCheatSheet(projectId, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      BoqId +
      "/download_cheat_sheet";

    return this.http
      .get(url, this.options)
      .map((response) => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          // //var blob = response['_body'];
          // var blob = new Blob([(<any>response)._body], { type: contentType });
          //var url = environment.apiBaseUrl+'/'+response['_body'];
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }

  // method for get payment list
  getPaymentList(status, page?, client?, fromdate?, toDate?, Ageing?) {
    let url =
      environment.apiBaseUrl +
      "/v1/payments/lead_payment_history?finance_status=" +
      status +
      "&page=" +
      page;
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("lead_id", client);
    params.set("ageing", Ageing);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  //method to save payment detail
  savePaymentDetailForApprove(projectId, paymentId, paymentValue, status) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/" +
      paymentId +
      "/payment_approval";
    return this.http
      .post(url, paymentValue, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  savePaymentDetailForReject(projectId, paymentId, paymentValue, status) {
    var obj = {
      remark: paymentValue,
      approve: status,
    };
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/" +
      paymentId +
      "/payment_approval";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  //method to vendor payment list
  getVendorPaymentList(
    search,
    status,
    page?,
    client?,
    fromdate?,
    toDate?,
    Ageing?
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/pi_payments/vendor_payment_history?finance_status=" +
      status +
      "&page=" +
      page;
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("vendor_id", client);
    params.set("ageing", Ageing);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  savePaymentDetailForApprovePi(paymentId, paymentValue, status) {
    var data = {
      transaction_number: paymentValue,
      payment_status: status,
    };
    let url =
      environment.apiBaseUrl + "/v1/pi_payments/" + paymentId + "/approve";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  RejectPi(paymentId, paymentValue, status) {
    var data = {
      remarks: paymentValue,
      payment_status: status,
    };
    let url =
      environment.apiBaseUrl + "/v1/pi_payments/" + paymentId + "/reject";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPODetail(POID) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      POID +
      "/purchase_order_view_for_finance";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorDetails(vendorId) {
    let url = environment.apiBaseUrl + "/v1/vendors/" + vendorId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getHistoryAll(pi_Id) {
    let url =
      environment.apiBaseUrl + "/v1/pi_payments?performa_invoice_id=" + pi_Id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getClientLedger(client?, fromdate?, toDate?, Ageing?) {
    let url = environment.apiBaseUrl + "/v1/payments/lead_payment_ledger";
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("lead_id", client);
    params.set("ageing", Ageing);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorLedger(client?, fromdate?, toDate?, Ageing?) {
    let url = environment.apiBaseUrl + "/v1/pi_payments/vendor_payment_ledger";
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("lead_id", client);
    params.set("ageing", Ageing);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadDp() {
    let url = environment.apiBaseUrl + "/v1/payments/dp_payout_payment_report";
    return this.http
      .get(url, this.options)
      .map((response) => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          // //var blob = response['_body'];
          // var blob = new Blob([(<any>response)._body], { type: contentType });
          // var url = environment.apiBaseUrl+'/'+response['_body'];
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
  downMarginReport(p2p,handover,start_date,end_date) {
    let url =
      environment.apiBaseUrl +
      "/v1/quotations/download_margin_report?" +
      "p2p=" +
      p2p +
      "&handover=" +
      handover +
      "&start_date=" +
      start_date +
      "&end_date="+end_date;
    return this.http
      .get(url, this.options)
      .map((response) => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
  downVendorReport() {
    let url =
      environment.apiBaseUrl + "/v1/pi_payments/download_vendor_payment_report";
    return this.http
      .get(url, this.options)
      .map((response) => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
  downVendorReportmain(search, status, client?, fromdate?, toDate?, Ageing?) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/download_vendor_payment_report?finance_status=" +
      status +
      "&type=maintenance";
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("vendor_id", client);
    params.set("ageing", Ageing);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  downloadboqexcel(projectId, BoqId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      BoqId +
      "/download_category_excel";
    return this.http
      .get(url, this.options)
      .map((response) => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          //  var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          //  //var blob = response['_body'];
          //  var blob = new Blob([(<any>response)._body], { type: contentType });
          // var url = environment.apiBaseUrl+'/'+response['_body'];
          return response;
          //return new Blob([response.blob()], { type: 'application/pdf' })
        }
      })
      .catch(this.handleErrorObservable);
  }
  // getproductList(page?){
  //   var url = environment.apiBaseUrl+'/v1/payments/final_stage_projects';
  //   var params: URLSearchParams = new URLSearchParams();
  //   params.set('status', 'pending');
  //   params.set('page',page);
  //   var opt = this.options;
  //   opt.search = params;
  //   return this.http.get(url,opt)
  //     .map(this.extractDataPage)
  //     .catch(this.handleErrorObservable);
  // }

  getProjectLineItemsDetails(
    status,
    page,
    startDate = "",
    endDate = "",
    clientId = "",
    search = ""
  ) {
    if (!startDate) {
      startDate = "";
    }
    if (!endDate) {
      endDate = "";
    }
    if (!clientId) {
      clientId = "";
    }
    if (!search) {
      search = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/payments/final_stage_projects?status=" +
      status +
      "&page=" +
      page +
      "&start_date=" +
      startDate +
      "&end_date=" +
      endDate +
      "&lead_id=" +
      clientId +
      "&search=" +
      search;
    let params: URLSearchParams = new URLSearchParams();
    this.options.search = null;

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getReceipt(projectId, paymentsId, receipt_pdf, type) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payments/" +
      paymentsId +
      "/lead_payment_receipt";
    var query = {
      receipt_pdf: receipt_pdf,
      payment_id: paymentsId,
      type: type,
    };
    return this.http
      .post(url, query, this.options)
      .map((response) => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }

  getPaymentHistoryByProject(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payments/payment_history";
    this.options.search = null;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllInvoices(project_id, searchValue) {
    this.options.search = null;
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payment_invoices/parent_invoices_for_project?project_id=" +
      project_id +
      "&search=" +
      searchValue;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  shareInvoice(projectId, invoiceId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/payment_invoices/share_parent_invoice?id=" +
      invoiceId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  SubmitInvoices(project_id, label, lineItem) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payment_invoices";
    var obj = {
      payment_invoice: {
        project_id: project_id,
        label: label,
      },
      line_items: lineItem,
    };
    this.options.search = null;
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  InvoiceLabel(project_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payment_invoices/child_invoices";
    var params: URLSearchParams = new URLSearchParams();
    params.set("project_id", project_id);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  FinalInvoiceCreatedSubmition(project_id, Finalselected, invoice_form_info) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payment_invoices/create_parent_invoice";
    var obj = {
      child_invoice_ids: Finalselected,
      invoice_info: invoice_form_info,
      payment_invoice: {
        project_id: project_id,
        // 'invoice_info':invoice_form_info,
      },
    };
    this.options.search = null;
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadInvoice(invoiceId) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + invoiceId + "/download";
    this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  UpadetAddedProductsList(
    project_id,
    lineItem,
    label,
    type,
    invoice_id,
    hsn_code
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payment_invoices/" +
      invoice_id;
    var obj;

    if (type == "updateLabel") {
      obj = {
        payment_invoice: {
          project_id: project_id,
          // "label":  label
        },
        line_items: lineItem,
      };
    }
    if (type == "EditLabel") {
      obj = {
        payment_invoice: {
          label: label,
        },
        id: invoice_id,
      };
    }
    if (type == "hsn") {
      obj = {
        payment_invoice: {
          hsn_code: hsn_code,
        },
        id: invoice_id,
      };
    }
    this.options.search = null;
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpadateInvoiceSubmition(
    project_id,
    invoice_form_info,
    createInvoiceId,
    currentInvoiceId
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/payment_invoices/update_parent_invoice";
    var obj = {
      invoice_info: invoice_form_info,
      child_invoice_ids: createInvoiceId,
      parent_invoice_id: currentInvoiceId,
    };
    this.options.search = null;
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //
  submitMapPayments(projectId, boqList, stage) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/set_map_payments?stage=" +
      stage;

    var obj = {
      stage: stage,
      quotations: boqList,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //
  reportClosureFun(projectId, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      BoqId +
      "/report_10_percent_closure";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //
  cancelMappingFun(projectId, BoqId, paymentStage) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      BoqId +
      "/unmap_payment?stage=" +
      paymentStage;
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  pushToproductionFun(projectId, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      BoqId +
      "/report_40_percent_push_to_production";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // final payment selection
  reportFinalPaymentSelection(projectId, BoqId) {
    // let urls = 'v1/projects/:project_id/quotations/:id/report_100_percent_final_completion'
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      BoqId +
      "/report_100_percent_final_completion";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getMapPayment(projectId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/get_map_payments" +
      "?stage=pre_10_percent";
      let headers = new Headers({
        "Content-Type": "application/json",
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        "access-token": localStorage.getItem("accessToken"),
      });
      let options = new RequestOptions({ headers: headers });
    return this.http
      .get(url, options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  acceptClousures(project_id, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/approve_10_percent_closure";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  rejectClosures(project_id, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/reject_10_percent_closure";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  acceptPushtoProduction(project_id, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/approve_40_percent_push_to_production";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  rejectPushtoProduction(project_id, BoqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/reject_40_percent_push_to_production";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  accept40PaymentCompletion(project_id, BoqId) {
    // let urls = 'projects/:project_id/quotations/:id/approve_100_percent_final_completion'
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/approve_40_percent_push_to_production";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  acceptPushtoFinalPaymentCompletion(project_id, BoqId) {
    // let urls = 'projects/:project_id/quotations/:id/approve_100_percent_final_completion'
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/approve_100_percent_final_completion";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  rejectPushtoFinalPaymentCompletion(project_id, BoqId) {
    // let urls = 'projects/:project_id/quotations/:id/approve_100_percent_final_completion'
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/reject_100_percent_final_completion";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  reject40PaymentCompletion(project_id, BoqId) {
    // let urls = 'projects/:project_id/quotations/:id/approve_100_percent_final_completion'
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      BoqId +
      "/reject_40_percent_push_to_production";
    let a = {};
    return this.http
      .post(url, a, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  revertFinalPayment(project_id,BoqId){
    console.log("I am at finance service")
    var url=environment.apiBaseUrl +
    "/v1/projects/" +
    project_id +
    "/quotations/" +
    BoqId +
    "/revert_100_percent_final_completion";
    let a = {};
    return this.http
    .put(url, a, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }


  //--------Shiva Champion incentive start ----------

  // master incentive list data start
  getchampionIncentiveList(startdate, enddate) {
    return this.http
      .get(
        this.champion_incentive_masterlist +
          "?start_date=" +
          startdate +
          "&end_date=" +
          enddate,
        this.options
      )
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getpendingStatusMasterIncentive(month) {
    var jsonData = {};
    return this.http
      .patch(
        this.champion_masterlistIncentive_paidapi + "?month=" + month,
        jsonData,
        this.options
      )
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  downloadIncentivelist(month) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/download_champion_incentive" +
      "?month=" +
      month;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //end

  //  incentive month data details api start (pending and complete)
  getPendingIncentiveMonthList(month, page, limit, userid) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("search", userid);
    this.options.search = params;
    return this.http
      .get(
        this.champion_pending_champions_monthly_incentive_list +
          "?month=" +
          month +
          "&limit" +
          limit,
        this.options
      )
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getPaidIncentiveMonthList(month, page, limit, userid) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("search", userid);
    this.options.search = params;
    return this.http
      .get(
        this.champion_paid_champions_monthly_incentive_list +
          "?month=" +
          month +
          "&limit=" +
          limit,
        this.options
      )
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  downloadIncentiveMonthDetails(month) {
    return this.http
      .get(
        this.downloadIncentiveMonthDetailapi + "?month=" + month,
        this.options
      )
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  checkUnCheck(userid, month) {
    console.log("userid", userid);
    var jsonData = {};
    return this.http
      .patch(
        this.championstatuscjeckboxapi + "?ids=" + userid + "&month=" + month,
        jsonData,
        this.options
      )
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  // Delta Incemtive download functionality
  downloadIncentiveData(incentiveType: string, dateType: any) {
    let urldata =
      environment.apiBaseUrl +
      `/v1/quotations/download_incentive_report?type=${incentiveType}&month=${dateType}`;
    return this.http
      .get(urldata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProjectPaymentDetails(projectId, paymentId) {
    let url =
      environment.apiBaseUrl +
      `/v1/projects/${projectId}/payments/${paymentId}`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateApprovedAmount(paymentId, data) {
    let url =
      environment.apiBaseUrl +
      `/v1/pi_payments/${paymentId}/update_approved_amount`;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  updateApprovedAmountbulk(paymentId, data) {
    let url =
      environment.apiBaseUrl +
      `/v1/bulk_pi_payments/${paymentId}/update_approved_amount`;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getBulkVendorPaymentList(
    search,
    status,
    page?,
    client?,
    fromdate?,
    toDate?,
    Ageing?
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/vendor_payment_history?finance_status=" +
      status +
      "&page=" +
      page +
      "&type=maintenance";
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("vendor_id", client);
    params.set("ageing", Ageing);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  savePaymentDetailForBulkApprovePi(paymentId, paymentValue, status) {
    var data = {
      transaction_number: paymentValue,
      payment_status: status,
    };
    let url =
      environment.apiBaseUrl + "/v1/bulk_pi_payments/" + paymentId + "/approve";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  RejectBulkPi(paymentId, paymentValue, status) {
    var data = {
      remarks: paymentValue,
      payment_status: status,
    };
    let url =
      environment.apiBaseUrl + "/v1/bulk_pi_payments/" + paymentId + "/reject";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  splitBulkPay(obj, id) {
    var data = {
      pi_payment: {
        splits: obj,
      },
    };
    let url = environment.apiBaseUrl + "/v1/bulk_pi_payments/" + id + "/split";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  splitRetailPay(obj, id) {
    var data = {
      pi_payment: {
        splits: obj,
      },
    };
    let url = environment.apiBaseUrl + "/v1/pi_payments/" + id + "/split";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFinalRequestVendor(page, fromdate, toDate, client, search) {
    let url =
      environment.apiBaseUrl +
      "/v1/pi_payments/approved_payment_for_vendor?page=" +
      page +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      toDate +
      "&vendor_id=" +
      client +
      "&search=" +
      search;
      this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getFinalRequestVendorcompleted(page, fromdate, toDate, client, search) {
    let url =
      environment.apiBaseUrl +
      "/v1/pi_payments/completed_payment_request?page=" +
      page +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      toDate +
      "&vendor_id=" +
      client +
      "&search=" +
      search;
       this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getFinalRequestVendorlistven(id, page) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/vendor_payment_list?vendor_id=" +
      id +
      "&type=maintenance";
    "&page=" + page;
     this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getFinalRequestVendorcompletedmain(page, fromdate, toDate, client, search) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/completed_payment_request?type=maintenance&page=" +
      page +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      toDate +
      "&vendor_id=" +
      client +
      "&search=" +
      search;
    this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getFinalRequestVendorlist(id, page) {
    let url =
      environment.apiBaseUrl +
      "/v1/pi_payments/vendor_payment_list?vendor_id=" +
      id +
      "&page=" +
      page;
       this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getmtoVendorPaymentList(
    search,
    status,
    page?,
    client?,
    fromdate?,
    toDate?,
    Ageing?
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/vendor_payment_history?finance_status=" +
      status +
      "&page=" +
      page +
      "&type=mto";
    let params: URLSearchParams = new URLSearchParams();
    params.set("from_date", fromdate);
    params.set("to_date", toDate);
    params.set("vendor_id", client);
    params.set("ageing", Ageing);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getFinalRequestVendorven(page, fromdate, toDate, client, search) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/approved_payment_for_vendor?type=maintenance&page=" +
      page +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      toDate +
      "&vendor_id=" +
      client +
      "&search=" +
      search;
       this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getFinalRequestVendorvenmto(page, fromdate, toDate, client, search) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/approved_payment_for_vendor?type=mto&page=" +
      page +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      toDate +
      "&vendor_id=" +
      client +
      "&search=" +
      search;
    this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  
  getFinalRequestVendorcompletedmainmto(page, fromdate, toDate, client, search) {
    let url =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/completed_payment_request?type=mto&page=" +
      page +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      toDate +
      "&vendor_id=" +
      client +
      "&search=" +
      search;
    this.options.search = null;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
}