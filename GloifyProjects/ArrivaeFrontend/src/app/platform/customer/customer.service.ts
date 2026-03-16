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

@Injectable()
export class CustomerService {
  options: RequestOptions;
  private wipUrl = environment.apiBaseUrl + "/v1/leads/";

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
      environment.apiBaseUrl + "/v1/leads/get_all_projects_belongs_to_lead";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCitiesForQuestionnaire() {
    let url = environment.apiBaseUrl + "/v1/cities";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }s
  getListofProposal(project_id) {
    let url = environment.apiBaseUrl + "/v1/proposals?project_id=" + project_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getProposalDoc(id) {
    let url = environment.apiBaseUrl + "/v1/proposals/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPaymentDetails(proposal_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/payment_details_for_boq?proposal_id=" +
      proposal_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  boqApproval(obj) {
    let url =
      environment.apiBaseUrl + "/v1/proposals/approve_or_reject_the_boq";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getTeam(id) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/designer_cm_details?project_id=" +
      id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  scheduleMeeting(obj) {
    let url =
      environment.apiBaseUrl + "/v1/proposals/schedule_call_with_designer";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getScheduledEvents(proj_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/list_of_scheduled_calls?project_id=" +
      proj_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSharedBoqs(proj_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      proj_id +
      "/boq_and_ppt_uploads/get_shared_ppts_and_boqs";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllProjetcList() {
    let url = environment.apiBaseUrl + "/v1/users/clients_projects";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllBoqList(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/boqs_shared_with_clients?project_id=" +
      projectId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getOpsData(start_date, end_date, store, gm, cm, des) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_summray_data_count?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFortyPercent(start_date, end_date, store, gm, cm, des) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_40_percentage_payment_stage_chart_details?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFortyPercentTable(
    start_date,
    end_date,
    btnvalue,
    service,
    page,
    perpage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_40_percentage_payment_stage_infromation?stage=" +
      btnvalue +
      "&boq_type=" +
      service +
      "&page=" +
      page +
      "&per_page=" +
      perpage +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProductionDetails(start_date, end_date, store, gm, cm, des) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_production_status_chart_details?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getProductionModal(
    productionstage,
    productionservicetype,
    productioncurrentpage,
    productionperpage,
    start_date,
    end_date,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_production_status_detail_information?stage=" +
      productionstage +
      "&boq_type=" +
      productionservicetype +
      "&page=" +
      productioncurrentpage +
      "&per_page=" +
      productionperpage +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllPos(id, page, perpage) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_all_po_details_on_quotation?quotation_id=" +
      id +
      "&page=" +
      page +
      "&per_page=" +
      perpage;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getRawMaterial(
    material_stage_value,
    current_Page,
    per_Page,
    start_date,
    end_date,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_raw_material_status_infromation?stage=" +
      material_stage_value +
      "&page=" +
      current_Page +
      "&per_page=" +
      per_Page +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  raw_material_done(
    doneStage,
    currentPage,
    perPage,
    start_date,
    end_date,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_raw_material_done_status_infromation?stage=" +
      doneStage +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  opsServiceStatus(
    start_date,
    end_date,
    serviceType,
    filterService,
    page,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_service_status_card?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      serviceType +
      "&filter=" +
      filterService +
      "&page=" +
      page +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getInstallationAndHandover(
    start_date,
    end_date,
    currentPage,
    perPage,
    type,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_handover_card?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&type=" +
      type +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getpanelStart(
    start_date,
    end_date,
    type,
    currentPage,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_panel_start_data?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      type +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getpanelDispatch(
    start_date,
    end_date,
    type,
    currentPage,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_panel_dispatch_data?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      type +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getLFStart(
    start_date,
    end_date,
    type,
    currentPage,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_lf_start_data?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      type +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getLFDispatch(
    start_date,
    end_date,
    type,
    currentPage,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_lf_dispatch_data?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      type +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSelectStart(
    start_date,
    end_date,
    type,
    currentPage,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_select_start_data?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      type +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSelectDispatch(
    start_date,
    end_date,
    type,
    currentPage,
    perPage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_select_dispatch_data?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&type=" +
      type +
      "&page=" +
      currentPage +
      "&per_page=" +
      perPage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSummaryDetails(
    start_date,
    end_date,
    filterSummary,
    typeSummary,
    page,
    perpage,
    store,
    gm,
    cm,
    des
  ) {
    if (start_date === undefined) {
      start_date = "";
    }
    if (end_date === undefined) {
      end_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
    if (des == undefined) {
      des = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/ops_summray_data_detail?start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&filter=" +
      filterSummary +
      "&type=" +
      typeSummary +
      "&page=" +
      page +
      "&per_page=" +
      perpage +
      "&store=" +
      store +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      des;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getreviews(page?) {
    if(page){
      page = page ? page : "";
    }
    else{
    page = "";
    }
    let url = environment.apiBaseUrl + "/v1/customer_reviews?page=" + page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getpromoters(page?) {
    if(page){
      page = page ? page : "";
    }
    else{
    page = "";
    }
    let url = environment.apiBaseUrl + "/v1/promoters?page=" + page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  postareview(obj) {
    let url = environment.apiBaseUrl + "/v1/customer_reviews";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  removeimage(obj, image) {
    let url =
      environment.apiBaseUrl +
      "/v1/customer_reviews/" +
      obj +
      "/remove_image?image_id=" +
      image;
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatereview(obj, id) {
    let url = environment.apiBaseUrl + "/v1/customer_reviews/" + id;
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getleadetails(key) {
    let url =
      environment.apiBaseUrl +
      "/v1/customer_reviews/get_leads_details?search=" +
      key;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  showreview(id) {
    let url = environment.apiBaseUrl + "/v1/customer_reviews/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletreview(id) {
    let url = environment.apiBaseUrl + "/v1/customer_reviews/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  approvereview(id, status) {
    let obj = {};
    let url =
      environment.apiBaseUrl +
      "/v1/customer_reviews/" +
      id +
      "/change_review_status?status=" +
      status;
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadreport() {
    let url = environment.apiBaseUrl + "/v1/customer_reviews?send_file=" + true;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changewebview(id) {
    console.log(id);
    let obj = {};
    let url =
      environment.apiBaseUrl +
      "/v1/customer_reviews/" +
      id +
      "/change_web_view";
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  changewebviewApart(id,obj) {
    console.log(id);

    let url =
      environment.apiBaseUrl +
      "/v1/apartments//" +
      id +
      "/enable_apartment";
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
}
