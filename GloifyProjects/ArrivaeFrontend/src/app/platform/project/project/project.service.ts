import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service'; 
import { Project } from './project';
import { Comments } from './comments';
import { HttpParams } from "@angular/common/http";

import { environment } from 'environments/environment';

@Injectable()
export class ProjectService {
  options: RequestOptions;

  private projectUrl = environment.apiBaseUrl + "/v1/projects";

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) {
    this.options = this.authService.getHeaders();
  }

  getProjectList(): Observable<Project[]> {
    return this.http
      .get(this.projectUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
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

  createProject(project: Project): Observable<Project> {
    let url = this.projectUrl;
    return this.http
      .post(url, project, this.options)
      .map((res: Response) => res.json());
  }

  viewProjectDetails(id: Number): Observable<Project[]> {
    let url = this.projectUrl + "/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteProject(id: Number): Observable<Project[]> {
    let headers = this.authService.getHeaders();
    let url = this.projectUrl + "/" + id;
    return this.http
      .delete(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editProject(id: Number, param: any): Observable<Project[]> {
    let headers = this.authService.getHeaders();
    let url = this.projectUrl + "/" + id;
    return this.http
      .patch(url, param, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  postCommentWithId(id: Number, comment: Comments): Observable<Comments[]> {
    let url = this.projectUrl + "/" + id + "/comments";
    comment["commentable_id"] = id;
    comment["commentable_type"] = "Project";
    return this.http
      .post(url, comment, this.options)
      .map((res: Response) => res.json())
      .catch(this.handleErrorObservable);
  }

  listComments(id: Number): Observable<Comments[]> {
    let url = this.projectUrl + "/" + id + "/comments";
    let params: URLSearchParams = new URLSearchParams();
    params.set("commentable_id", id + "");
    params.set("commentable_type", "Project");
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  assignProjectToDesigner(projectId: Number, designerId: Number) {
    let url = this.projectUrl + "/" + projectId + "/assign_project";
    let obj = {
      project: {
        designer_id: designerId,
      },
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  requestRole(role: string) {
    let url = environment.apiBaseUrl + "/v1/users/request_role";
    let params: URLSearchParams = new URLSearchParams();
    params.set("role", role);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  questionareApi() {
    let url = this.projectUrl + "/global-project-details";
    return this.http.get(url, this.options).map((res: Response) => res.json());
  }

  answerApi(projectId: Number) {
    let url = this.projectUrl + "/" + projectId + "/show-project-details";
    return this.http.get(url, this.options).map((res: Response) => res.json());
  }

  bookOrderDetails(boq_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/get_book_order_detail?quotation_id=" +
      boq_id;
    // let obj = {
    //   quotation_id : boq_id
    // }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFinalizeDesignDetails(boq_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/get_finalize_design_details?quotation_id=" +
      boq_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downloadsheet(project_id, boq_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/download_cheat_sheet_to_excel";
      let headers = new Headers({
        'access-token': localStorage.getItem('accessToken'),
        'client': localStorage.getItem('client'),
        'uid': localStorage.getItem('uid'),
      });
      let options = new RequestOptions({ headers: headers });
    return this.http
      .get(url,options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
      
  }

  getQuotation(project_id, boq_id, display_boq_label) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/client_quotation_display";
    let params: URLSearchParams = new URLSearchParams();
    params.set("display_boq_label", display_boq_label);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPpt(project_id, ppt_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/presentations/" +
      ppt_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getOverallPerformance(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/overall_performance?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getOverallorderData(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/overall_order_data?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getcurrentweekorder(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/current_week_order_confirmation?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getnexttweekorder(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/week_order_confirmation?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getsitemeasurementData(
    page_no,
    gm_id,
    cm_id,
    designer_id,
    from_date,
    to_date,
    store
  ) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/site_measurement_to_selection?page=" +
      page_no +
      "&per_page=5&gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getdesigndashtatData(
    page_no,
    gm_id,
    cm_id,
    designer_id,
    from_date,
    to_date,
    store
  ) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/designer_dashboard_tat_data?page=" +
      page_no +
      "&per_page=5&gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getsitevalidationData(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/site_validation_oc_data?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getpaymentStatusData(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/payment_status_data?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getspeedofobtooc(gm_id, cm_id, designer_id, from_date, to_date, store) {
    if (from_date == undefined) {
      from_date = "";
    }
    if (to_date == undefined) {
      to_date = "";
    }
    if (store == undefined) {
      store = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/speed_ob_to_oc?gm_ids=" +
      gm_id +
      "&cm_ids=" +
      cm_id +
      "&designer_ids=" +
      designer_id +
      "&from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getwheelonedata(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer,
    store
  ) {
    start_date =  start_date? start_date:"";
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_one_data?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer=" +
      designer +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getwheelonedatapopup(
   
    start_date,
    cm,
    gm,
    designer,
    store,
    week_no
  ) {
    start_date =  start_date? start_date:"";
    let url =
      environment.apiBaseUrl +
      '/v1/lead_nocs/wheel_one_popup_data?start_date='+start_date+'&cm='+cm+'&gm='+gm+'&designer_id='+designer+'&store_id='+store+'&week_number='+week_no
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  wheeloneSecond(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer,
    store
  ) {
    start_date =  start_date? start_date:"";


    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_one_meetings_data?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer=" +
      designer +
      "&store=" +
      store;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  wheeloneSecondPopupData(
    start_date,
    cm,
    gm,
    designer,
    store,
    weeknum,
    agenda,
    listingType,
    page,
    file
  ) {
    start_date =  start_date? start_date:"";
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/wheel_one_meetings_popup_data?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer +
      "&store_id=" +
      store + 
      "&week_number=" + weeknum + 
      "&agenda=" + agenda + 
      "&listing_type=" + listingType + 
      "&page=" + page + "&send_file=" + file
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getcmTargetFillData(
    lead_target,
    avg_bill_size,
    first_meeting_target,
    meeting_to_boq_target,
    boq_to_closure_target,
    cm_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/cm_target_for_designer_dashboard?lead_target=" +
      lead_target +
      "&avg_bill_size=" +
      avg_bill_size +
      "&first_meeting_target=" +
      first_meeting_target +
      "&meeting_to_boq_target=" +
      meeting_to_boq_target +
      "&boq_to_closure_target=" +
      boq_to_closure_target +
      "&cm_id=" +
      cm_id;
    return this.http
      .put(url, {}, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDesignerCount(store_id, gm, cm, designer) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/designer_count?store_id=" +
      store_id +
      "&gm=" +
      gm +
      "&cm=" +
      cm +
      "&designer=" +
      designer;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWheeltwodata(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_two_data?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWhellonethirdFunnel(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ){
    let url =
    environment.apiBaseUrl +
    "/v1/lead_nocs/get_wheel_one_funnel?target=" +
    target +
    "&meeting_boq_target=" +
    meeting_boq_target +
    "&start_date=" +
    start_date +
    "&closure_boq_target=" +
    closure_boq_target +
    "&boq_shared_value=" +
    boq_shared_value +
    "&cm=" +
    cm +
    "&gm=" +
    gm +
    "&designer_id=" +
    designer_id +
    "&store_id=" +
    store_id;
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  getWheelthreepartonedata(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_expected_confirm_data?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  getWheelthreetabeltwo(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id,
    no_of_month
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_completed_confirm_data?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id + 
      "&no_of_month=" +
      no_of_month
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  getWheelthreeparttwodata(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_data_part_two?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&milestone_type=payment_40_mapped";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWheelthreeparttwoweekdata(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id,
    no_of_month
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_data_part_two_week_wise?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&no_of_month=" +
      no_of_month +
      "&milestone_type=payment_40_mapped";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  async getWheelthreepartthreedata(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_part_three_data?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id;
    return await this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  async getWheelthreepartfourdata(
    start_date,
    cm,
    gm,
    designer_id,
    store_id,
    page,
    send_file
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/wheel_three_data_part_four?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&page=" +
      page +
      "&send_file="+
      send_file;
    return await this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getWheelthreepartonedata2(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_data_part_one?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&milestone_type=project_handover";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWheelthreeparttwodata2(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_data_part_two?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&milestone_type=project_handover";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWheelthreeparttwoweekdata2(
    target,
    meeting_boq_target,
    start_date,
    closure_boq_target,
    boq_shared_value,
    cm,
    gm,
    designer_id,
    store_id,
    no_of_month
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_data_part_two_week_wise?target=" +
      target +
      "&meeting_boq_target=" +
      meeting_boq_target +
      "&start_date=" +
      start_date +
      "&closure_boq_target=" +
      closure_boq_target +
      "&boq_shared_value=" +
      boq_shared_value +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&no_of_month=" +
      no_of_month +
      "&milestone_type=project_handover";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWheelthreepartseven(target, start_date, cm, gm, designer_id, store_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_part_seven_data?target=" +
      target +
      "&start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWheeltwopopupData(
    start_date,
    cm,
    gm,
    designer_id,
    listing_type,
    store_id,
    week_number,
    page
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/wheel_two_popup_data?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&listing_type=" +
      listing_type +
      "&store_id=" +
      store_id +
      "&week_number=" +
      week_number +
      "&page=" +
      page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  ExportWheelTwo(
    start_date,
    cm,
    gm,
    designer_id,
    listing_type,
    store_id,
    week_number,
    page,
    file
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/wheel_two_popup_data?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&listing_type=" +
      listing_type +
      "&store_id=" +
      store_id +
      "&week_number=" +
      week_number +
      "&page=" +
      page +
      "&send_file=" +
      file;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  wheelOneExport(start_date, cm, gm, designer_id, week_number, store_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/wheel_one_export?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&week_number=" +
      week_number +
      "&store_id=" +
      store_id;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getWheelthreepopupData(
    start_date,
    cm,
    gm,
    designer_id,
    store_id,
    week_number,
    data_type,
    milestone_type,
    page,
    forFileboolValue
  ) {
    if(forFileboolValue){
      let params = new HttpParams();
      params = params.append('send_file',forFileboolValue);
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_data_part_one_popup_data?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&week_number=" +
      week_number +
      "&data_type=" +
      data_type +
      "&milestone_type=" +
      milestone_type + 
      "&page=" +
      page +
      "&send_file=" +
      forFileboolValue
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getwheelthreenewpopData(
    start_date,
    cm,
    gm,
    designer_id,
    store_id,
    week_number,
    milestone,
    listing,
    typetat,
    typedate,
    page,
    forFileboolValue
  ) {
    if(forFileboolValue){
      let params = new HttpParams();
      params = params.append('send_file',forFileboolValue);
    }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_confirm_popup_data?start_date=" +
      start_date +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&week_number=" +
      week_number +
      "&milestone=" +
      milestone+ 
      "&listing_type=" + 
      listing + 
      "&tat_type=" + 
      typetat + 
      "&date_type=" +
      typedate + 
      "&page=" +
      page +
      "&send_file=" +
      forFileboolValue
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);


    

  }
  getWheelthreepopupOldLeadData(
    start_date,
    cm,
    gm,
    designer_id,
    store_id,
    week_number,
    data_type,
    milestone_type,
    page,
    forFileboolValue
  ) {
    // if(forFileboolValue){
    //   let params = new HttpParams();
    //   params = params.append('send_file',forFileboolValue);
    // }
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/get_wheel_three_older_milestone_data?closure_boq_target&boq_shared_value" +
      "&cm=" +
      cm +
      "&gm=" +
      gm +
      "&designer_id=" +
      designer_id +
      "&store_id=" +
      store_id +
      "&milestone_type=" +
      milestone_type + 
      "&page=" +
      page 
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getWheelthreefuture(start_date , cm , gm , designer_id , store_id , week_number , data_type ,milestone_type,no_of_month,page, forFileboolValue){
    if(forFileboolValue){
      let params = new HttpParams();
      params = params.append('send_file',forFileboolValue);
    }
    let url = environment.apiBaseUrl +  "/v1/lead_nocs/get_wheel_three_data_part_two_popup_data?start_date=" + start_date + 
    "&cm="+cm +
    "&gm=" +gm +
    "&designer_id=" + designer_id +
    "&store_id=" + store_id +
    "&week_number=" + week_number +
    "&data_type=" + data_type +
    "&milestone_type=" + milestone_type +
    "&no_of_month=" + no_of_month +
    "&page=" + page +
    "&send_file=" + 
    forFileboolValue
    return this.http
    .get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }
  getBarChartMtdPM( start_date , cm , gm , designer_id, store_id , data_type , milestone_type,page, forFileboolValue){
    if(forFileboolValue){
      let params = new HttpParams();
      params = params.append('send_file',forFileboolValue);
    }
    let url = environment.apiBaseUrl + "/v1/lead_nocs/get_wheel_three_pie_chart_data?start_date=" + start_date + 
    "&cm="+cm +
    "&gm=" +gm +
    "&designer_id=" + designer_id +
    "&store_id=" + store_id +
    "&data_type=" + data_type +
    "&milestone_type=" + milestone_type +
    "&page=" +
    page + 
    "&send_file=" +
    forFileboolValue
    return this.http 
    .get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }
  getBarChartForty( start_date,cm ,gm ,designer_id, store_id ,data_type ,milestone_type ,page ,forFileboolValue){
    if(forFileboolValue){
      let params = new HttpParams();
      params = params.append('send_file',forFileboolValue);
    }
    let url = environment.apiBaseUrl + "/v1/lead_nocs/get_wheel_three_pie_chart_data_one?start_date=" + start_date + 
    "&cm="+cm +
    "&gm=" +gm +
    "&designer_id=" + designer_id +
    "&store_id=" + store_id +
    "&data_type=" + data_type +
    "&milestone_type=" + milestone_type +
    "&page=" +
    page + 
    "&send_file=" +
    forFileboolValue
    return this.http 
    .get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }
}