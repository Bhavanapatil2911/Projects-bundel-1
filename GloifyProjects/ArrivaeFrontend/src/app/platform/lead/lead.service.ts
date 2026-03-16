import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from '../../../environments/environment';
import { Lead } from './lead';
import { HttpHeaders } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import 'rxjs/add/observable/throw';

@Injectable()
export class LeadService {
  options: RequestOptions;

  private leadUrl = environment.apiBaseUrl + "/v1/leads";
  headers: Headers;

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService,
    private ref: ChangeDetectorRef
  ) {
    if (window.location.pathname != "/lead/app-sms-floorplan") {
      this.options = this.authService.getHeaders();
    }
    console.log(this.options)
  }

  changeStatus(id: Number): Observable<Lead> {
    let url = this.leadUrl + "/" + id + "/approve_user";
    return this.http
      .patch(url, id, this.options)
      .map((res: Response) => res.json());
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

  getprojectprogress(project_id, milestone, types){
    console.log("hello")
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/project_progress_track?milestone='+milestone + '&type='+ types;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  downloadprogressreport(project_id, milestone, types){
    console.log("hello")
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/project_progress_track?send_file=true&milestone='+milestone + '&type='+ types;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  postnote(project_id,data){
    console.log(project_id)
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/add_notes_project_milestone';
    return this.http.post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  GetBoqList(project_id,search){
    let url = environment.apiBaseUrl+'/v1/lead_nocs/boq_listing_0_50?lead_id='+project_id+'&search='+search;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  GetBoqListfocanceled(project_id,milestone){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/boqs_for_hold_cancelled_project?milestone='+milestone;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }



  getactivitylogs(lead_id,event_log?){
    let url = environment.apiBaseUrl+'/v1/leads/'+lead_id+'/show-logs'+'?event_log='+event_log;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getMOMevents(ownerable_id){
    let url = environment.apiBaseUrl+'/v1/events/get_manual_events_of_project';
    let params: URLSearchParams = new URLSearchParams();
    params.set('ownerable_id', ownerable_id);
    this.options.search = params;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  //To share MOM
  momShare(event,eventid){
    let url = environment.apiBaseUrl+'/v1/events/'+eventid+'/share_mom';
    let params: URLSearchParams = new URLSearchParams();
    params.set('share_with',event["emails"]);
    this.options.search = params;
     
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  //To Delete Share
  deleteMOM(eventId){
    let url = environment.apiBaseUrl+'/v1/events/'+eventId+'/delete_mom';
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  //To view MOM
  momView(eventId){
    let url = environment.apiBaseUrl+'/v1/events/'+eventId+'/view_mom';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  getOverviewCount(lead_id){
		let url = environment.apiBaseUrl+'/v1/leads/'+lead_id+'/lead_event_counts';
		return this.http.get(url,this.options)
		.map(this.extractData)
		.catch(this.handleErrorObservable);
	}

	getOverviewLog(lead_id,event_time,event_type){
		let url = environment.apiBaseUrl+'/v1/leads/'+lead_id+'/events_log?event_time='+
		event_time+'&event_type='+event_type;
		return this.http.get(url,this.options)
		.map(this.extractData)
		.catch(this.handleErrorObservable);
	}


  getLeadList(lead_source): Observable<Lead[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set("source", lead_source);
    this.options.search = params;
    return this.http
      .get(this.leadUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  gotoverification(lead_id){
    var url = environment.apiBaseUrl + "/v1/leads/"+lead_id+"/send_email_verification_mail";
    console.log(this.options)
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
    
  }
  markasverified(lead_id){
    let headers = this.authService.getHeaders();
    var url = environment.apiBaseUrl + "/v1/leads/"+lead_id+"/mark_lead_email_verified";
    console.log(this.options)
    return this.http
    .patch(url,'' ,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  filteredLeads(lead_source, colName, from_date, to_date) {
    var params: URLSearchParams = new URLSearchParams();
    params.set("source", lead_source);
    params.set("column_name", colName);
    params.set("from_date", from_date);
    params.set("to_date", to_date);
    var opt = this.options;
    opt.search = params;

    return this.http
      .get(this.leadUrl, opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addLead(data) {
    if (this.options.params) {
      this.options.params.delete("source");
      this.options.params.delete("lead_status");
      this.options.params.delete("lead_type_id");
      this.options.params.delete("lead_campaign_id");
      this.options.params.delete("column_name");
      this.options.params.delete("from_date");
      this.options.params.delete("lead_source_id");
      this.options.params.delete("to_date");
      this.options.params.delete("cs_agent");
      this.options.params.delete("search");
    }
    return this.http
      .post(this.leadUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  designerAddLead(data) {
    var url = environment.apiBaseUrl + "/v1/leads/designer_lead_add";
    if (this.options.params) {
      this.options.params.delete("source");
      this.options.params.delete("lead_status");
      this.options.params.delete("lead_type_id");
      this.options.params.delete("lead_campaign_id");
      this.options.params.delete("column_name");
      this.options.params.delete("from_date");
      this.options.params.delete("lead_source_id");
      this.options.params.delete("to_date");
      this.options.params.delete("cs_agent");
      this.options.params.delete("search");
    }
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteLead(id: Number): Observable<Lead[]> {
    let headers = this.authService.getHeaders();
    let url = this.leadUrl + "/" + id;
    return this.http
      .delete(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  viewLeadDetails(id: Number): Observable<Lead[]> {
    let url = this.leadUrl + "/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editLead(id: Number, params: any) {
    let url = this.leadUrl + "/" + id;
    return this.http
      .patch(url, params, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // https://newuatapi.arrivae.com/v1/note_records?ownerable_id=231209&ownerable_type=Lead

  salesNoteRecords(id){
    let url = environment.apiBaseUrl + `/v1/note_records?ownerable_id=${id}&ownerable_type=Lead`
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  AdditionalSalesDetails(page){
    let url = environment.apiBaseUrl + `/v1/leads/broker_lead_details?page=${page}`
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  postRecordNotesQuestionnaire(lead_id, data) {
    let url = environment.apiBaseUrl + "/v1/note_records";
    let params: URLSearchParams = new URLSearchParams();
    params.set("ownerable_id", lead_id + "");
    params.set("ownerable_type", "Lead");
    this.options.search = params;

    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateRecordNotesQuestionnaire(lead_id, data, noteRecordId) {
    let url = environment.apiBaseUrl + "/v1/note_records/" + noteRecordId;
    let params: URLSearchParams = new URLSearchParams();
    params.set("ownerable_id", lead_id + "");
    params.set("ownerable_type", "Lead");
    this.options.search = params;

    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getRecordNotesQuestionnaire(lead_id) {
    let url = environment.apiBaseUrl + "/v1/note_records";
    let params: URLSearchParams = new URLSearchParams();
    params.set("ownerable_id", lead_id + "");
    params.set("ownerable_type", "Lead");
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadLeadExcel(files: File[], leadSource, type, camp) {
    let leads = {
      attachment_file: files,
      lead_source_id: leadSource,
      lead_type_id: type,
      lead_campaign_id: camp,
    };
    let headers = this.authService.getHeaders();
    let url = this.leadUrl + "/import_leads";
    return this.http
      .post(url, leads, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getacallbackLeadsDetails() {
    let url = environment.apiBaseUrl + "/v1/contacts";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteGetACallbackLead(id: number) {
    let url = environment.apiBaseUrl + "/v1/contacts/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  exportLeads(role) {
    let url = this.leadUrl + "/download_leads";
    let params: URLSearchParams = new URLSearchParams();
    params.set("role", role);
    this.options.search = params;
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

  exportLeads1(
    role,
    source,
    lead_status,
    lead_type_id,
    lead_source_id,
    lead_campaign_id,
    column_name,
    from_date,
    to_date,
    cs_agent_list,
    search
  ) {
    let url = this.leadUrl + "/download_leads";
    let params: URLSearchParams = new URLSearchParams();
    params.set("role", role);
    params.set("source", source);
    params.set("lead_status", lead_status);
    params.set("lead_type_id", lead_type_id);
    params.set("lead_source_id", lead_source_id);
    params.set("lead_campaign_id", lead_campaign_id);
    params.set("column_name", column_name);
    params.set("from_date", from_date);
    params.set("to_date", to_date);
    params.set("cs_agent", cs_agent_list);
    params.set("search", search);
    this.options.search = params;
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

  updateLeadStatus(data, id) {
    let url = this.leadUrl + "/" + id + "/update_status";
    if (this.options.params) {
      this.options.params.delete("role");
    }
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  escalatedleads() {
    let url = this.leadUrl + "/escalated_leads";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllRoles() {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/get_all_roles";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBoqIds(Id) {
    let url =
      environment.apiBaseUrl +
      "/v1/manual_escalations/get_all_boqs_list?lead_id=" +
      Id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAssignedToMember(roleId, leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/manual_escalations/get_all_members_list?role=" +
      roleId +
      "&lead_id=" +
      leadId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllManualEsclation(
    page,
    perPage,
    sortColumn,
    sortOrder,
    status,
    store,
    escalationStage,
    fromDate,
    toDate,
    escsouce,
    gmID
  ) {
    if (escsouce == undefined) {
      escsouce = "";
    }
    // {{url}}/manual_escalations?gm_id=31320
    let url =
      environment.apiBaseUrl +
      "/v1/manual_escalations?page=" +
      page +
      "&per_page=" +
      perPage +
      "&sort_column=" +
      sortColumn +
      "&sort_order=" +
      sortOrder +
      "&status=" +
      status +
      "&store=" +
      store +
      "&escalation_stage=" +
      escalationStage +
      "&from_date=" +
      fromDate +
      "&to_date=" +
      toDate +
      "&escalation_source=" +
      escsouce +
      "&gm_id=" +
      gmID;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  eachEscalationById(id) {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editEachEscalation(id, data) {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  escalationByStore() {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/get_all_stores";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  eachescalationlog(id, page, perPage) {
    let url =
      environment.apiBaseUrl +
      "/v1/manual_escalation_logs/get_all_manual_escalation_logs_on_escalation_id?escalation_id=" +
      id +
      "&page=" +
      page +
      "&per_page=" +
      perPage;
    console.log(id);
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  deleteManualEscalation(id) {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  statusChange(id, data) {
    console.log(data);
    let url =
      environment.apiBaseUrl +
      "/v1/manual_escalations/" +
      id +
      "/update_escalation_status";
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  EscalationStage() {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/get_all_stages";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  GMListing() {
    let url = environment.apiBaseUrl + "/v1/manual_escalations/get_all_citygm";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  SubmitEscalation(data) {
    let url = environment.apiBaseUrl + "/v1/manual_escalations";
    return this.http
      .post(url, data, this.options)
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
  getESCsource() {
    let url =
      environment.apiBaseUrl + "/v1/manual_escalations/get_escalations_source";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  assignLeadToAgent(agentId, leadId) {
    let url = environment.apiBaseUrl + "/v1/leads/" + leadId + "/assign_lead";
    let params: URLSearchParams = new URLSearchParams();
    params.set("agent_id", agentId);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  assigndesignerToCM(agentId, leadId) {
    let url = environment.apiBaseUrl + "/v1/users/assign_designer_to_cm";
    var obj = {
      cm_id: agentId,
      designer_id: leadId,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  refreshLeads(agentId, lead_id, lead) {
    let url = environment.apiBaseUrl + "/v1/leads/refresh_leads";
    let params: URLSearchParams = new URLSearchParams();
    params.set("agent_id", agentId);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  callToLead(userId, contact) {
    let url = environment.apiBaseUrl + "/v1/inhouse_calls";
    let obj = {
      inhouse_call: {
        user_id: userId,
      },
      contact_no: contact,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    // let url = environment.apiBaseUrl+'/v1/users/'+userId+'/call_user';
    // let obj ={
    //   'user':userId,
    //   'lead_id': leadId
    // };
    // return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
  }

  downloadLifeCycleReport(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/leads/" +
      leadId +
      "/sales_life_cycle_report";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCommunityManagersList() {
    let url = environment.apiBaseUrl + "/v1/users/designer_cm_index";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getdetailedinfo(id?){
    var url = environment.apiBaseUrl + "/v1/users/cm_designer_detail_information?cm_id="+id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  getDesignerLeads(page_no) {
    let url = this.leadUrl + "/designer_leads?page=" + page_no;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getSearchedDesignerLeads(searchItem) {
    let url = this.leadUrl + "/designer_leads?search=" + searchItem;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getLeadLog(leadId) {
    let url = environment.apiBaseUrl + "/v1/leads/" + leadId + "/show-logs";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSiteSupervisorList() {
    let url = environment.apiBaseUrl + "/v1/users/sitesupervisor_users";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFileterLeads(
    source,
    lead_status,
    lead_type_id,
    lead_source_id,
    lead_campaign_id,
    column_name,
    from_date,
    to_date,
    cs_agent_list,
    search,
    page?
  ) {
    let url = environment.apiBaseUrl + "/v1/leads/filtered_index?page=" + page;
    var params: URLSearchParams = new URLSearchParams();
    params.set("source", source);
    params.set("lead_status", lead_status);
    params.set("lead_type_id", lead_type_id);
    params.set("lead_source_id", lead_source_id);
    params.set("lead_campaign_id", lead_campaign_id);
    params.set("column_name", column_name);
    params.set("from_date", from_date);
    params.set("to_date", to_date);
    params.set("cs_agent", cs_agent_list);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getFileterLeadsForLeadMgmt(
    source,
    lead_status,
    lead_type_id,
    cm_type_id,
    lead_source_id,
    lead_campaign_id,
    mkw_fhi,
    column_name,
    digital_physical,
    internal_external,
    from_date,
    to_date,
    cs_agent_list,
    search,
    page,
    is_cs_agent
  ) {
    let url ; 
    if(is_cs_agent){
      url = environment.apiBaseUrl + "/v1/leads/cs_agent_filtered_index?page=" + page;
    } else{
      url = environment.apiBaseUrl + "/v1/leads/filtered_index?page=" + page;
    }
   
    var params: URLSearchParams = new URLSearchParams();
    params.set("source", source);
    params.set("lead_status", lead_status);
    params.set("lead_type_id", lead_type_id);
    params.set("cm_ids", cm_type_id);
    params.set("lead_source_id", lead_source_id);
    params.set("lead_campaign_id", lead_campaign_id);
    params.set("column_name", column_name);
    params.set("digital_physical", digital_physical);
    params.set("internal_external", internal_external);
    params.set("from_date", from_date);
    params.set("to_date", to_date);
    params.set("cs_agent", cs_agent_list);
    params.set("search", search);
    params.set("search", search);
    params.set("mkw_fhi", mkw_fhi);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getFiltersData() {
    let url = environment.apiBaseUrl + "/v1/leads/filter_details";
    var params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getLeadHeadCount(
    lead_type_id,
    lead_source_id,
    lead_campaign_id,
    from_date,
    to_date
  ) {
    let url = environment.apiBaseUrl + "/v1/leads/lead_head_dashboard_count";
    var params: URLSearchParams = new URLSearchParams();
    params.set("lead_type_id", lead_type_id);
    params.set("lead_source_id", lead_source_id);
    params.set("lead_campaign_id", lead_campaign_id);
    params.set("from_date", from_date);
    params.set("to_date", to_date);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getLeadLogs(leadId) {
    let url = environment.apiBaseUrl + "/v1/leads/" + leadId + "/get_lead_info";
    console.log(this.options)

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // https://uatapi.arrivae.com/v1/projects/60175/payments/split_quotation_payments?quotations_ids=86616,86614&percent=10
getLeadNewFlow(projectId , quotations, typepercent){
    let url =  environment.apiBaseUrl + '/v1/projects/' +  projectId + 
    "/payments/split_quotation_payments?quotations_ids="  + quotations +  "&percent=" + typepercent
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
    runjobForty(id){
      let url = environment.apiBaseUrl + '/v1/quotations/testing_40_per_run_payment_approve_job?quotation_id=' + id
      return this.http
      .post(url, [], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    runjobFortyRemainder(id){
      let url = environment.apiBaseUrl + '/v1/quotations/testing_40_per_run_payment_reminder_job?lead_id=' +  id
      return this.http
      .post(url, [], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

  pipeLineData(projectId){
    let url = environment.apiBaseUrl + "/v1/projects/" + projectId + "/orderpipeline_quotations"
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }


  boqonholdotp(id,type){
    let url = environment.apiBaseUrl + '/v1/quotations/forty_percent_payment_onhold_otp?quotation_id=' + id + "&type=" + type
    return this.http
    .post(url, [], this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  onHoldSubmit(data){
    let url = environment.apiBaseUrl + '/v1/quotations/forty_percent_payment_onhold'
    return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  unholdSubmit(data){
    let url = environment.apiBaseUrl + '/v1/quotations/forty_percent_payment_unhold'
    return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  get_onhold_logs(projectId , quationId){
    let url = environment.apiBaseUrl  + "/v1/projects/"  +  projectId + "/quotations/" + quationId + "  /get_onhold_logs"
    return this.http 
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  runjob(id){
    let url = environment.apiBaseUrl + "/v1/lead_payment_requests/fetch_payment_status?lead_id=" + id
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  reportOrderPipeLine(projectId , quationId){
    let url = environment.apiBaseUrl + "/v1/projects/" + projectId + "/quotations/" + quationId + "/report_order_pipeline"
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  approveOrderPipeLine(projectId , quationId){
    let url = environment.apiBaseUrl + "/v1/projects/" + projectId + "/quotations/" + quationId + "/approve_order_pipeline"
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getFloorplans(projectId) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/floorplans";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getProposalList() {
    let url = environment.apiBaseUrl + "/v1/proposals";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  assignSiteSupervisorToCm(sitesupervisor_id, cm_id) {
    let obj = {
      cm_id: cm_id,
      sitesupervisor_id: sitesupervisor_id,
    };
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + "/v1/users/assign_sitesupervisor_to_cm";
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createSiteRequest(formdata) {
    let obj = {
      site_measurement_request: formdata,
    };
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + "/v1/requests";
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchRequirementForm(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/get_project_requirement";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchThreeDImageList(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/fetch_three_d_images";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchmtolist(project_id) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + project_id + "/mto_uploads";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  requirementFormSubmit(formdata) {
    let obj = {
      project_requirement: formdata,
    };
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + "/v1/project_requirements";
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  requirementFormUpdate(formdata, req_id) {
    let obj = {
      project_requirement: formdata,
    };
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + "/v1/project_requirements/" + req_id;
    return this.http
      .patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchScopeForm(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/scope_of_work_for_ten_percent";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  scopeFormSubmit(formdata) {
    let obj = {
      scope_of_work: formdata,
    };
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + "/v1/scope_of_works";
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  scopeFormUpdate(formdata, req_id) {
    let obj = {
      scope_of_work: formdata,
    };
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + "/v1/scope_of_works/" + req_id;
    return this.http
      .patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchBookingForm(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/booking_form_for_project";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  bookingFormSubmit(formdata) {
    let obj = {
      project_booking_form: formdata,
    };
    let headers = this.authService.getHeaders();
    console.log(headers)
    let url = environment.apiBaseUrl + "/v1/project_booking_forms";
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  bookingFormUpdate(id, formdata) {
    let obj = {
      project_booking_form: formdata,
    };
    let headers = this.authService.getHeaders();
    console.log(headers)
    let url = environment.apiBaseUrl + "/v1/project_booking_forms/" + id;
    return this.http
      .patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  customerDemandFormSubmit(formdata,projectid){
    let obj = {
      customer_demand_form: formdata,
    };
    let headers = this.authService.getHeaders();
    console.log(headers)
    let url = environment.apiBaseUrl + "/v1/projects/"+projectid+"/customer_demand_forms/update_customer_demand_form";
    console.log(formdata,projectid)
    return this.http
      .patch(url, obj, headers)
      .catch(this.handleErrorObservable);

  }

  fetchcustomerDemndForm(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/customer_demand_forms/show_customer_demand_form";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchSiteRequest(project_id) {
    let url = environment.apiBaseUrl + "/v1/requests?project_id=" + project_id;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getGallery(req_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/requests/" +
      req_id +
      "/get_images_for_request";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getApprovedBoqList(projectId, stage) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/approved_quotations?stage=" +
      stage;
      let headers = new Headers({
        "Content-Type": "application/json",
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        "access-token": localStorage.getItem("accessToken"),
      });
     
     
     
      let options = new RequestOptions({ headers: headers });
    return this.http
      .get(url,options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchElevationList(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/fetch_elevations";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetcReferenceList(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/fetch_reference_images";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFinalPaymentQuotationLead(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotation_for_final_payment";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchCadElevation(project_id) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + project_id + "/cad_drawings";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchPptlist(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/boq_and_ppt_uploads/get_ppts";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchInspiration(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/customer_inspirations";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // defalt ppt
  defaultPptList(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/boq_and_ppt_uploads/sample_ppt_file";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchBoqList(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/boq_and_ppt_uploads/get_boqs";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadCad(project_id, postData) {
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl + "/v1/projects/" + project_id + "/cad_drawings";
    return this.http
      .post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadPpt(project_id, postData) {

    let formData = new FormData();
    for (let key in postData) {
      if (postData.hasOwnProperty(key)) {
        if (typeof postData[key] === "object") {
          for (let nestedKey in postData[key]) {
            if (postData[key].hasOwnProperty(nestedKey)) {
              formData.append(`boq_and_ppt_upload[${nestedKey}]`, postData[key][nestedKey]);
            }
          }
        } else {
          formData.append(key, postData[key]);
        }
      }
    }
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/boq_and_ppt_uploads";
    return this.http
      .post(url, formData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadBoq(project_id, postData) {
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/boq_and_ppt_uploads";
    return this.http
      .post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ///upload line marking///
  uploadLineMarking(project_id, postData) {
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/upload_line_marking";
    return this.http
      .post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  //end here///
  deleteCad(id: Number, fpid: Number) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + id + "/cad_drawings/" + fpid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSiteMeasurement(imgid: Number) {
    let url =
      environment.apiBaseUrl +
      "/v1/requests/remove_images_from_request?image_id=" +
      imgid;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteBoq(id: Number, fpid: Number) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/boq_and_ppt_uploads/" +
      fpid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ///for line marking///
  deleteLineMarking(id: Number, fpid: Number) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/delete_line_marking?line_marking_id=" +
      fpid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ///end here///
  deletePpt(id: Number, fpid: Number) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/boq_and_ppt_uploads/" +
      fpid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  shareWithCustomer(projectId, docId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/boq_and_ppt_uploads/" +
      docId +
      "/share_with_customer";
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
  }

  getCmList() {
    let url = environment.apiBaseUrl + "/v1/users/list_of_cm";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  assignCmToLead(cmid, leadid, assignCmId?, designerId?) {
    let url =
      environment.apiBaseUrl + "/v1/leads/" + leadid + "/assign_cm_to_lead";
    var obj = {
      cm_id: cmid,
      designer_id: designerId,
    };
    this.options.search = null
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  migrateCMData(from_id, to_id) {
    let url = environment.apiBaseUrl + "/v1/users/migrate_cm_data";
    var obj = {
      from_id: from_id,
      to_id: to_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  cmAssignedData(cm_id) {
    let url =
      environment.apiBaseUrl + "/v1/users/cm_assigned_data?cm_id=" + cm_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getLeadPriorityQueueData() {
    let url = environment.apiBaseUrl + "/v1/leads/lead_queue";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //  for ending sms
  sendSmsToLead(sms, projectId, contact_no) {
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/project_sms/";
    let obj = {
      contact_no: contact_no,
      message: sms.message,
    };
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSmsHistory(projectId) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/project_sms";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  /////end sfor sneding sms

  exportBoq() {
    let url = environment.apiBaseUrl + "/v1/quotations/download_boq_report";
    if (this.options.params) {
      this.options.params.delete("lead_type_id");
      this.options.params.delete("lead_source_id");
      this.options.params.delete("lead_campaign_id");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  exportReportsEvent() {
    let url = environment.apiBaseUrl + "/v1/events/download_event";
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
  exportReportCall() {
    let url = environment.apiBaseUrl + "/v1/inhouse_calls/call_excel_report";
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
  exportSli() {
    let url =
      environment.apiBaseUrl + "/v1/purchase_orders/download_sli_report";
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
  exportoffice(start,end) {
    let url =
      environment.apiBaseUrl + "/v1/users/generate_pm_pc_tasks_report?start_time="+start+'&end_time='+end;
      return this.http
      .post(url,'',this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  exportPo() {
    let url =
      environment.apiBaseUrl + "/v1/purchase_orders/purchase_order_report";
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

  exportOlt() {
    let url =
      environment.apiBaseUrl + "/v1/purchase_orders/panel_olt_payment_report";
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

  exportQuestionnaireEvent() {
    let url =
      environment.apiBaseUrl + "/v1/projects/21/customer_profiles/generate_xl";
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

  callToCustomer(userId, contact_number) {
    let url = environment.apiBaseUrl + "/v1/inhouse_calls";
    let obj = {
      inhouse_call: {
        user_id: userId,
      },
      contact_no: contact_number,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

    // let url = environment.apiBaseUrl+'/v1/users/'+userId+'/call_user';
    // let obj ={
    //   'contact_no':contact_number
    // };
    // return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
  }

  updateBasicInfo(lead_id, name, email, contact) {
    let obj = {
      name: name,
      contact: contact,
      email: email,
    };
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl + "/v1/leads/" + lead_id + "/update_basic_info";
    return this.http
      .patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getInitialQuotationListForCm(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/shared_initial_boqs";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFinalQuotationListForCm(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/shared_final_boqs";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDesignerList(cmId, userId) {
    let url =
      environment.apiBaseUrl + "/v1/users/" + userId + "/designer_for_cm";
    if (this.options.params) {
      this.options.params.delete("lead_type_id");
      this.options.params.delete("lead_source_id");
      this.options.params.delete("lead_campaign_id");
      this.options.params.delete("column_name");
      this.options.params.delete("cs_agent");
      this.options.params.delete("search");
      this.options.params.delete("source");
      this.options.params.delete("lead_status");
      this.options.params.delete("search");
      this.options.params.delete("id");
    }
    var params: URLSearchParams = new URLSearchParams();
    params.set("cm_id", cmId);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ApproveBoqByCm(obj) {
    let url =
      environment.apiBaseUrl + "/v1/proposals/approve_or_reject_the_boq";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
   ApproveBoqOTP(id) {
    let url =
      environment.apiBaseUrl + "/v1/proposals/proposal_approve_otp_generation?proposal_doc_id="+id;
    return this.http
      .post(url,[], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getReferrerList(page?, search?) {
    let url = environment.apiBaseUrl + "/v1/users/referrers";
    var params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getSalesManagerList() {
    let url = environment.apiBaseUrl + "/v1/users/sales_managers";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  assignToSlaesManager(referralId, salesmanagerId) {
    let obj = {
      referrer_id: referralId,
      sales_manager_id: salesmanagerId,
    };
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl + "/v1/users/assign_sales_manager_to_referrer";
    return this.http
      .post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  exportPaymentEvent() {
    let url = environment.apiBaseUrl + "/v1/payments/download_payment_report";
    if (this.options.params) {
      this.options.params.delete("lead_type_id");
      this.options.params.delete("lead_source_id");
      this.options.params.delete("lead_campaign_id");
    }
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

  getUploadedFiles(id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/booking_form_for_project";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadBookingForm(project_booking_form_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/project_booking_forms/" +
      project_booking_form_id +
      "/download_pdf";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteFile(project_booking_form_id, file_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/project_booking_forms/" +
      project_booking_form_id +
      "/project_booking_form_files/" +
      file_id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadFiles(project_booking_form_id, attachment_file, file_name) {
    let url =
      environment.apiBaseUrl +
      "/v1/project_booking_forms/" +
      project_booking_form_id +
      "/project_booking_form_files";
    var obj = {
      project_booking_form_id: project_booking_form_id,
      attachment_file: attachment_file,
      file_name: file_name,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  shareWithCustomerFile(id) {
    var value = id;
    // let url = environment.apiBaseUrl + '/v1/projects/' + value + '/share_pdf_with_customer';

    return this.http
      .get(
        environment.apiBaseUrl +
          "/v1/projects/" +
          value +
          "/share_pdf_with_customer",
        this.options
      )
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPdf(projectId) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/arrivae_pdf";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  shareWithCustomerFilePdf(value, filename) {
    var value = value;
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      value +
      "/share_pdf_with_customer";

    let params: URLSearchParams = new URLSearchParams();
    params.set("file_name", filename);
    this.options.search = params;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchPdfList(id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/share_pdf_with_customer";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPOPdfForPreview(id) {
    // let url = environment.apiBaseUrl+'/v1/projects/'+id+'/share_pdf_with_customer';
    //   return this.http.get(url,this.options)
    //           .map(this.extractData)
    //           .catch(this.handleErrorObservable);
  }

  shareWarrantyWithCustomerFile(id) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + id + "/share_warrenty_doc";
    let obj = {
      project_id: id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  shareCatalogueWithCustomerFile(id) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" +id+ "/share_catelogue_doc?file_name=NOVA Beds Catalogue.pdf";
    
    return this.http
      .post(url,[], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSmsLink(id, name, contact_no) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/floorplans/send_upload_sms";
    var obj = {
      project_id: id,
      contact_no: contact_no,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadSmsFormFiles(id, attachment_file, file_name) {
    this.headers = new Headers({ enctype: "multipart/form-data" });
    this.headers.append("Accept", "application/json");
    this.headers.append("uid", "");
    this.headers.append("client", "");
    this.headers.append("access-token", "");
    let options: any;
    options = new RequestOptions({ headers: this.headers });
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/floorplans/upload_sms_floorplan";
    var obj = {
      floorplan: {
        file_name: file_name,
        attachment_file: attachment_file,
      },
    };
    return this.http
      .post(url, obj, options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getChampionList() {
    let url = environment.apiBaseUrl + "/v1/users/invite_champion_info";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  inviteChampion(data) {
    let url = environment.apiBaseUrl + "/v1/users/invite_champion";
    var obj = {
      champion_level: data.champion_level,
      user_type: data.user_type,
      email: data.email,
      contact: data.contact,
      name: data.name,
      parent_id: data.parent_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getChampionListByChampionLevel(champion_level) {
    let url = environment.apiBaseUrl + "/v1/users/champions";
    let params: URLSearchParams = new URLSearchParams();
    params.set("champion_level", champion_level);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getChildChampionListByChampionLevel(champion_id) {
    let url = environment.apiBaseUrl + "/v1/users/child_champions";
    let params: URLSearchParams = new URLSearchParams();
    params.set("champion_id", champion_id);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCustomerCallDetails(leadId) {
    let url =
      environment.apiBaseUrl + "/v1/leads/" + leadId + "/alternate_contacts";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  /*Send Smart Report Through Email function*/
  smartShareReport() {
    let url = environment.apiBaseUrl + "/v1/leads/smart_share_report";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // Method For Post elevation file
  uploadElevation(projectId, postData) {
    let formData = new FormData();
    for (let key in postData) {
      if (postData.hasOwnProperty(key)) {
        if (typeof postData[key] === "object") {
          for (let nestedKey in postData[key]) {
            if (postData[key].hasOwnProperty(nestedKey)) {
              formData.append(`upload_elevation[${nestedKey}]`, postData[key][nestedKey]);
            }
          }
        } else {
          formData.append(key, postData[key]);
        }
      }
    }
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/upload_elevation";
    return this.http
      .post(url,formData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadReference(projectId, postData) {
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/upload_reference_image";
    return this.http
      .post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadThreeD(projectId, postData) {
    let headers = this.authService.getHeaders();
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/upload_three_d_image";
    return this.http
      .post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFileList(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/list_for_handover";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ///for lineMarking////
  fetchLineMarkingList(projectId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/fetch_line_markings";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  submitSelectedFiles(projectId, obj) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/add_project_handover_list";

    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFileDetails(projectId, space, department) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/grouped_index?parent_handover_id=0&space=" +
      space +
      "&department=" +
      department;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  gethandoverList(projectId, status) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/grouped_index?status=" +
      status;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  submitHandoverFiles(projectId, remark) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/share_with_category";
    let obj = {
      remarks: remark,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getRevisedFile(projectId, status, val) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/list_for_handover?category=" +
      status +
      "&revision=" +
      val;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  submitFormForRevise(projectId, ownerableId, handoverid) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/" +
      handoverid +
      "/add_revision";
    let obj = {
      owner_id: ownerableId,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteHandOverFile(projectId, Id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/" +
      Id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getViewChild(projectId, childId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/" +
      childId +
      "/child_revisions";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to get additional files
  getAdditionalFiles(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/requested_files";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to reslove additional files
  resloveAdditionalFiles(project_id, raised_by_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/requested_files/" +
      raised_by_id +
      "/resolve_request";
    return this.http
      .post(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getlevel2champion(user_id, role) {
    let url = environment.apiBaseUrl + "/v1/users/user_children_with_role";
    let params: URLSearchParams = new URLSearchParams();
    params.set("user_id", user_id);
    params.set("role", role);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //client questionnaireForm time submit
  clientquestionnaireForm(project_id, data) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/customer_profiles";

    let obj = {
      name: data["name"],
      email: data["email"],
      contact_no: data["phone"],
      address_line_1: data["address_line1"],
      address_line_2: data["address_line1"],
      city: data["city"],
      state: data["state"],
      pincode: data["pincode"],
      gender: data["gender"],
      educational_background: data["education_background"],
      professional_background: data["professional_background"],
      sector_employed: data["sector_employed"],
      income_per_annum: data["income_per"],
      family_status: data["family_status"],
      marital_status: data["matrial_status"],
      joint_family_status: data["joint_family_status"],
      no_of_family_members: data["family_member"],
      co_decision_maker: data["decision_maker"],
      co_decision_maker_name: data["decision_name"],
      co_decision_maker_email: data["decision_email"],
      co_decision_maker_phone: data["decision_phone"],
      relation_with_decision_maker: data["relationship_decision_maker"],
      co_decision_maker_educational_background:
        data["decision_education_background"],
      co_decision_maker_professional_background:
        data["decision_professional_background"],
      co_decision_maker_sector_employed: data["decision_sector_employed"],
      co_decision_maker_income_per_annum: data["decision_income_per"],
      purpose_of_house: data["house_purpose"],
      movein_date: data["moving_date"],
      dob: data["dob"],
      co_decision_maker_dob: data["decision_dob"],
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //edit client questionnaireForm time submit
  editclientquestionnaireForm(project_id, customer_profile_id, data) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/customer_profiles/" +
      customer_profile_id +
      "";

    let obj = {
      name: data["name"],
      email: data["email"],
      contact_no: data["phone"],
      address_line_1: data["address_line1"],
      address_line_2: data["address_line1"],
      city: data["city"],
      state: data["state"],
      pincode: data["pincode"],
      gender: data["gender"],
      educational_background: data["education_background"],
      professional_background: data["professional_background"],
      sector_employed: data["sector_employed"],
      income_per_annum: data["income_per"],
      family_status: data["family_status"],
      marital_status: data["matrial_status"],
      joint_family_status: data["joint_family_status"],
      no_of_family_members: data["family_member"],
      co_decision_maker: data["decision_maker"],
      co_decision_maker_name: data["decision_name"],
      co_decision_maker_email: data["decision_email"],
      co_decision_maker_phone: data["decision_phone"],
      relation_with_decision_maker: data["relationship_decision_maker"],
      co_decision_maker_educational_background:
        data["decision_education_background"],
      co_decision_maker_professional_background:
        data["decision_professional_background"],
      co_decision_maker_sector_employed: data["decision_sector_employed"],
      co_decision_maker_income_per_annum: data["decision_income_per"],
      purpose_of_house: data["house_purpose"],
      movein_date: data["moving_date"],
      dob: data["dob"],
      co_decision_maker_dob: data["decision_dob"],
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to fetch questionnaire Form
  getfetchquestionnaireFormDetails(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/customer_profiles";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to set contact visibel status
  changeConStatus(lead_id) {
    let url =
      environment.apiBaseUrl + "/v1/leads/" + lead_id + "/make_contact_visible";
    var obj = {
      id: lead_id,
    };

    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  changecustomStatus(id,status) {
    let url =
      environment.apiBaseUrl + "/v1/users/change_custom_element_access?cm_id="+id+"&cm_access="+status;
   let obj={}

    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeLeadIntakeStatus() {
    let url = environment.apiBaseUrl + "/v1/leads/filter_details";
    var params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  selectAddressOf(project_id, address) {
    let url = environment.apiBaseUrl + "/v1/note_records/get_billing_address";
    var params: URLSearchParams = new URLSearchParams();
    params.set("project_id", project_id);
    params.set("look_address", address);
    var opt = this.options;
    opt.search = params;

    return this.http
      .get(url, opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downloadExcelBoqLineItems() {
    let url = environment.apiBaseUrl + "/v1/quotations/boq_line_item_report";
    if (this.options.params) {
      this.options.params.delete("lead_type_id");
      this.options.params.delete("lead_source_id");
      this.options.params.delete("lead_campaign_id");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateDuration(quotId, projectId, duration) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotId +
      "/add_duration";
    let body = {
      duration: duration,
    };
    return this.http
      .patch(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateDepartment(projectId, handover_id, department) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/" +
      handover_id +
      "/update_department";

    let body = {
      department: department,
    };
    return this.http
      .put(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  /////////
  viewQCHistory(projectId, qcType) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_quality_checks/qc_history?qc_type=" +
      qcType;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateInternalExternalStatus(related_user_id, leadInternalStatus) {
    let url = environment.apiBaseUrl + "/v1/leads/change_user_type";
    if (leadInternalStatus === null || leadInternalStatus === false) {
      leadInternalStatus = true;
    } else {
      leadInternalStatus = false;
    }
    let body = {
      related_user_id: related_user_id,
      type: leadInternalStatus,
    };
    return this.http
      .post(url, body, this.options)
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
  getcaluclatordatas() {
    let url = environment.apiBaseUrl + "/v1/questionaire_master_items";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // completeRequest(req_id,files){
  //     let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/complete_site_measurment_request';

  //     return this.http.post(url,forms,this.options)
  //     .map(this.extractData)
  //     .catch(this.handleErrorObservable);
  //   }

  getLocalityBuildingDetails(city_name, search = "") {
    let params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    var url;
    if (city_name) {
      url =
        environment.apiBaseUrl +
        "/v1/note_records/get_city_details?city_name=" +
        city_name.toLowerCase() +
        "&search=" +
        search;
      this.ref.detectChanges();
    } else {
      city_name = "";
      url =
        environment.apiBaseUrl +
        "/v1/note_records/get_city_details?city_name=" +
        city_name +
        "&search=" +
        search;
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSocietyWebData(locality_id) {
    let params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    let url =
      environment.apiBaseUrl +
      "/v1/note_records/get_society_details?id=" +
      locality_id;
    this.ref.detectChanges();
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSocietyWebapi(search) {
   
    let url ="https://api-apartment.arrivae.com/api/v1/auto/complete"

    let obj ={
      "keyword": search,
      'limit':10
    }
    return this.http
      .post(url,obj)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSocietyWebapigoogle(search) {
   
    let url =`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&key= AIzaSyADhbP6QmjHlcay55cH4SklR2HmeJ_VC98`

   
    return this.http
      .get(url)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  CreateApar(obj){

    // const headers = new HttpHeaders({
    //   'Authorization': 'e836d4c3-4bc9-11ee-a018-0210a115f206'
    // });
    let headers = new Headers({
      'Authorization': 'e836d4c3-4bc9-11ee-a018-0210a115f206'
    });
    let options = new RequestOptions({ headers: headers });
    let url ="https://api-apartment.arrivae.com/api/v1/add/apartment"
    return this.http
      .post(url,obj,options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getFormatApartment(obj) {
    let url = environment.apiBaseUrl + "/v1/apartments/fetch_apartment_formats";
    return this.http
      .post(url,obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFormatVarients(obj) {
    let url = environment.apiBaseUrl + "/v1/apartments/fetch_apartment_variants";
    return this.http
      .post(url,obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getReferUserList(referId, referName) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/" +
      referId +
      "/load_referrer_users?role=" +
      referName;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getReferListForSelect(salesId) {
    let url =
      environment.apiBaseUrl + "/v1/users/" + salesId + "/referrer_user_types";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getLeadPoolList() {
    let url = environment.apiBaseUrl + "/v1/leads/lead_pool_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downNewLineItemsReport() {
    var url = environment.apiBaseUrl + "/v1/quotations/boq_line_item_report";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downNewBoqReport() {
    var url = environment.apiBaseUrl + "/v1/quotations/download_boq_report";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadMeetingEvent() {
    let url = environment.apiBaseUrl + "/v1/mobile/leads/meeting_data_report";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadCallEvent(data) {
    let url =
      environment.apiBaseUrl +
      "/v1/inhouse_calls/call_excel_report?report_timeline=" +
      data.reportDuration +
      "&report_type=" +
      data.type;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

    getPromoPackages(currentPage, value, quationId, status, filter, offering, per_page) {
    let url =
      environment.apiBaseUrl +
      "/v1/promo_packs?status=" +
      status +
      "&search=" +
      value +
      "&page=" +
      currentPage +
      "&excluded_quotation_ids=" +
      quationId +
      "&sections=" + filter + 
      "&offerings=" + offering +
      "&per_page=" + per_page 
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getPromocountPackages(status, value,id,offerValue,section){
    let url = environment.apiBaseUrl + '/v1/promo_packs/promo_list_filter?status=' +
    status + 
    "&search=" + 
    value + 
    "&excluded_quotation_ids=" + 
    id + 
    "&offerings=" +
    offerValue + 
    "&sections=" + 
    section
    return this.http
    .get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }
  fetchPromoCode(id) {
    let url = environment.apiBaseUrl + "/v1/promo_packs/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // createPromoCode(value, image) {
  //   let url = environment.apiBaseUrl + "/v1/promo_packs";
  //   let formdata = new FormData();
  //   formdata.append("promo_pack[name]", value.name);
  //   formdata.append("promo_pack[code]", value.promo_code);
  //   formdata.append("promo_pack[description]", value.description);
  //   formdata.append("promo_pack[remarks]", value.remarks);
  //   if (value.promo_value === null) {
  //     formdata.append("promo_pack[promo_value]", "0");
  //   } else {
  //     formdata.append("promo_pack[promo_value]", value.promo_value);
  //   }
  //   // formdata.append('promo_pack[promo_value]', value.promo_value);
  //   if (value.promo_discount_percent === null) {
  //     formdata.append("promo_pack[promo_discount_percent]", "0");
  //   } else {
  //     formdata.append(
  //       "promo_pack[promo_discount_percent]",
  //       value.promo_discount_percent
  //     );
  //   }
  //   //  formdata.append('promo_pack[promo_discount_percent]', value.promo_discount_percent);
  //   formdata.append("promo_pack[threshold]", value.promo_threshold);
  //   formdata.append("promo_pack[expiry_date]", value.expiry_date);
  //   image && image !== undefined
  //     ? formdata.append("promo_pack[promo_image]", image)
  //     : "";
  //   return this.http
  //     .post(url, formdata, this.options)
  //     .map(this.extractData)
  //     .catch(this.handleErrorObservable);
  // }

    createPromoCode(value) {
      for(var i=0 ; i<value.promo_category_offers_attributes.length ; i++){
      if(value.promo_category_offers_attributes[i].promo_discount_percent === '' ||  value.promo_category_offers_attributes[i].promo_discount_percent === null  ){
        value.promo_category_offers_attributes[i]['promo_discount_percent'] = 0
      }
      if(value.promo_category_offers_attributes[i].promo_value === '' ||  value.promo_category_offers_attributes[i].promo_value === null ){
        value.promo_category_offers_attributes[i]['promo_value'] = 0
      }
    }

      
    console.log(value);
    console.log(value.promo_category_offers_attributes);
    let url = environment.apiBaseUrl + "/v1/promo_packs";
  
    let promo_pack  = {
        promo_pack : {
          name : value.name,
          code : value.promo_code,
          description : value.description,
          remarks : value.remarks,
          threshold : value.promo_threshold,
          expiry_date : value.expiry_date,
          promo_image : value.promo_image,
          promo_category_offers_attributes : value.promo_category_offers_attributes,
          closure_tat_days : value.closure_tat_days,
          p2p_tat_days : value.p2p_tat_days,
          lead_qualification_date:value.lead_qualification_date
        }
    }
    return this.http
      .post(url, promo_pack, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  categorylistforpromo (){
    let url = environment.apiBaseUrl + "/v1/promo_packs/category_list";
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  // updatePromoCode(value, id, image) {
  //   let url = environment.apiBaseUrl + "/v1/promo_packs/" + id;
  //   let formdata = new FormData();
  //   formdata.append("promo_pack[name]", value.name);
  //   formdata.append("promo_pack[code]", value.promo_code);
  //   formdata.append("promo_pack[description]", value.description);
  //   formdata.append("promo_pack[remarks]", value.remarks);

  //   formdata.append("promo_pack[remarks]", value.remarks);
  //   if (value.promo_value === null) {
  //     formdata.append("promo_pack[promo_value]", "0");
  //   } else {
  //     formdata.append("promo_pack[promo_value]", value.promo_value);
  //   }
  //   if (value.promo_discount_percent === null) {
  //     formdata.append("promo_pack[promo_discount_percent]", "0");
  //   } else {
  //     formdata.append(
  //       "promo_pack[promo_discount_percent]",
  //       value.promo_discount_percent
  //     );
  //   }
  //   // formdata.append('promo_pack[promo_value]', value.promo_value);
  //   // formdata.append('promo_pack[promo_discount_percent]', value.promo_discount_percent);
  //   formdata.append("promo_pack[threshold]", value.promo_threshold);
  //   formdata.append("promo_pack[expiry_date]", value.expiry_date);
  //   image && image !== undefined
  //     ? formdata.append("promo_pack[promo_image]", image)
  //     : "";
  //   return this.http
  //     .patch(url, formdata, this.options)
  //     .map(this.extractData)
  //     .catch(this.handleErrorObservable);
  // }
    updatePromoCode(value, id) {

      for(var i=0 ; i<value.promo_category_offers_attributes.length ; i++){
        if(value.promo_category_offers_attributes[i].promo_discount_percent === '' ||  value.promo_category_offers_attributes[i].promo_discount_percent === null  ){
          value.promo_category_offers_attributes[i]['promo_discount_percent'] = 0
        }
        if(value.promo_category_offers_attributes[i].promo_value === '' ||  value.promo_category_offers_attributes[i].promo_value === null ){
          value.promo_category_offers_attributes[i]['promo_value'] = 0
        }
      }
    let url = environment.apiBaseUrl + "/v1/promo_packs/" + id;
    let data = {
      promo_pack : {
        name : value.name,
        code : value.promo_code,
        description : value.description,
        remarks : value.remarks,
        threshold : value.promo_threshold,
        expiry_date : value.expiry_date,
        promo_category_offers_attributes : value.promo_category_offers_attributes,
        closure_tat_days : value.closure_tat_days,
        p2p_tat_days : value.p2p_tat_days,
        lead_qualification_date:value.lead_qualification_date
      }
    }
    if(value.promo_image){
      data.promo_pack['promo_image'] = value.promo_image
    }
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addPromoPackages(projectId, quotation_id, promoCodeId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotation_id +
      "/add_promo_job";
    let formdata = new FormData();
    formdata.append("promo_pack[id]", promoCodeId);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletePromoPackages(projectId, quotation_id, promoCodeId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotation_id +
      "/remove_promo_job?ids=" +
      promoCodeId;
    let formdata = new FormData();
    formdata.append("promo_pack[id]", promoCodeId);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadPromoCodes() {
    let url = environment.apiBaseUrl + "/v1/promo_packs/download_report";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatePromoCodeStatus(id, value) {
    let url =
      environment.apiBaseUrl + "/v1/promo_packs/" + id + "/change_status";
    let formdata = new FormData();
    formdata.append("status", value);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // Competitor Analyses

  CompetitorAnalyses(lead_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_competitor_analyses/get_lead_competitor_analysis?lead_id=" +
      lead_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  significant(lead_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_competitor_analyses/list_of_significant_competitors?lead_id=" +
      lead_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  submitCompetitionForm(
    competitor?,
    competitor_type?,
    hasOtherVendor?,
    discussions?,
    quote?,
    design?,
    lead_id?,
    role?
  ) {
    let url = environment.apiBaseUrl + "/v1/lead_competitor_analyses";
    let formdata = new FormData();
    if (hasOtherVendor == "Yes") {
      formdata.append(
        "lead_competitor_analysis[other_vendor_contacted]",
        "true"
      );
      formdata.append(
        "lead_competitor_analysis[significant_competitor]",
        competitor.significant_comptitor
      );
      formdata.append(
        "lead_competitor_analysis[other_significant_competitor]",
        competitor.other_significant_competitor
      );
      formdata.append(
        "lead_competitor_analysis[approaching_vendor_method]",
        competitor.approch_vendor
      );
      formdata.append(
        "lead_competitor_analysis[other_approaching_vendor_method]",
        competitor.other_approch_vendor_value
      );
      formdata.append(
        "lead_competitor_analysis[discussions_connect]",
        discussions
      );
      formdata.append(
        "lead_competitor_analysis[quote_amount]",
        competitor.quote
      );
      formdata.append("lead_competitor_analysis[notes]", competitor.notes);
      formdata.append("lead_competitor_analysis[quote_connect]", quote);
      formdata.append("lead_competitor_analysis[design_connect]", design);
      formdata.append(
        "lead_competitor_analysis[customer_share_design]",
        competitor.share_design
      );
      formdata.append("lead_competitor_analysis[lead_id]", lead_id);
      formdata.append("last_updated_by_id", role);
    } else {
      formdata.append(
        "lead_competitor_analysis[other_vendor_contacted]",
        "false"
      );
      formdata.append(
        "lead_competitor_analysis[notes]",
        competitor.selected_no_notes
      );
      formdata.append("lead_competitor_analysis[lead_id]", lead_id);
    }
    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // end Competitor Analyses
  // update Competitor Analyses
  updateCompetitionForm(
    competitor?,
    competitor_type?,
    hasOtherVendor?,
    discussions?,
    quote?,
    design?,
    lead_id?,
    role?,
    id?
  ) {
    let url = environment.apiBaseUrl + "/v1/lead_competitor_analyses/" + id;
    let formdata = new FormData();
    if (hasOtherVendor == "Yes") {
      formdata.append(
        "lead_competitor_analysis[other_vendor_contacted]",
        "true"
      );
      formdata.append(
        "lead_competitor_analysis[significant_competitor]",
        competitor.significant_comptitor
      );
      formdata.append(
        "lead_competitor_analysis[other_significant_competitor]",
        competitor.other_significant_competitor
      );
      formdata.append(
        "lead_competitor_analysis[approaching_vendor_method]",
        competitor.approch_vendor
      );
      formdata.append(
        "lead_competitor_analysis[other_approaching_vendor_method]",
        competitor.other_approch_vendor_value
      );
      formdata.append(
        "lead_competitor_analysis[discussions_connect]",
        discussions
      );
      formdata.append(
        "lead_competitor_analysis[quote_amount]",
        competitor.quote
      );
      formdata.append("lead_competitor_analysis[notes]", competitor.notes);
      formdata.append("lead_competitor_analysis[quote_connect]", quote);
      formdata.append("lead_competitor_analysis[design_connect]", design);
      formdata.append(
        "lead_competitor_analysis[customer_share_design]",
        competitor.share_design
      );
      formdata.append("lead_competitor_analysis[lead_id]", lead_id);
      formdata.append("last_updated_by_id", role);
    } else {
      formdata.append(
        "lead_competitor_analysis[other_vendor_contacted]",
        "false"
      );
      formdata.append(
        "lead_competitor_analysis[notes]",
        competitor.selected_no_notes
      );
      formdata.append("lead_competitor_analysis[lead_id]", lead_id);
    }
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getDesignStudio(page, search, filter) {
    if ((!filter || filter == undefined || filter == "all") && !search) {
      let url =
        environment.apiBaseUrl +
        "/v1/users/cm_design_studio_index?page=" +
        page +
        "&search=" +
        search;
      return this.http
        .get(url, this.options)
        .map(this.extractDataPage)
        .catch(this.handleErrorObservable);
    }
    if ((filter == "active" || filter == "inactive") && !search) {
      let url =
        environment.apiBaseUrl +
        "/v1/users/cm_design_studio_index?page=" +
        page +
        "&design_studio_status=" +
        filter +
        "&search=" +
        search;
      return this.http
        .get(url, this.options)
        .map(this.extractDataPage)
        .catch(this.handleErrorObservable);
    }
    if (search) {
      let url =
        environment.apiBaseUrl +
        "/v1/users/cm_design_studio_index?page=" +
        page +
        "&search=" +
        search +
        "&design_studio_status=" +
        filter;
      return this.http
        .get(url, this.options)
        .map(this.extractDataPage)
        .catch(this.handleErrorObservable);
    }
  }
  createFreeOrPaidDesignStudio(
    transaction,
    batchsize,
    conversions,
    selectB,
    cmid
  ) {
    let url = environment.apiBaseUrl + "/v1/design_studio_lead_batches";
    let formdata = new FormData();
    if (selectB == "Assign a Paid Batch") {
      formdata.append("design_studio_lead_batch[batch_type]", "paid");
      formdata.append(
        "design_studio_lead_batch[transaction_reference]",
        transaction
      );
    } else {
      formdata.append("design_studio_lead_batch[batch_type]", "free");
    }
    formdata.append("design_studio_lead_batch[batch_size]", batchsize);
    formdata.append("design_studio_lead_batch[conversion_size]", conversions);
    formdata.append("design_studio_lead_batch[cm_info_id]", cmid);
    return this.http
      .post(url, formdata, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getDesignStudioBatch(cmid) {
    let url =
      environment.apiBaseUrl +
      "/v1/design_studio_lead_batches?cm_info_id=" +
      cmid;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  fetchStatusList() {
    let url = environment.apiBaseUrl + "/v1/promo_packs/status_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadServicesPackages() {
    let url = environment.apiBaseUrl + "/v1/service_packages/download_report";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to get CM list and GM List for CM GM mapping
  getCmListForCMGMMapping(search) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/list_of_cm_and_gm_details?search=" +
      search;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  //to get CM list and SM List for CM SM mapping
  getCmListForCMSMMapping(search,sales_manager_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/list_of_sm_cm_mapping?search=" + 
      search+"&sales_manager_id="+sales_manager_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSMListForASMMapping(search,area_sales_manager_id) {
    let url =environment.apiBaseUrl +"/v1/users/list_of_asm_sm_mapping?search=" +
      search+"&area_sales_manager_id="+area_sales_manager_id;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  

  //CM to GM mapping //
  mapCMwithGM(cmId, gmId) {
    let url = environment.apiBaseUrl + "/v1/users/assign_gm_to_cm";
    this.options.params = null;
    var obj = {
      cm_id: cmId,
      gm_id: gmId,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  //CM to SM mapping //
  mapCMwithSM(cmId, smId) {
    let url = environment.apiBaseUrl + "/v1/users/assign_cm_for_sm";
    this.options.params = null;
    var obj = {
      cm_id: cmId,
      sales_manager_id: smId,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

 

  mapASMwithSM(smId, asmId) {
    let url = environment.apiBaseUrl + "/v1/users/assign_asm_to_sm";
    this.options.params = null;
    var obj = {
      sm_id: smId,
      area_sales_manager_id: asmId,
    };

    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  //to search CM details
  getSearchedCMDetails(searchItem) {
    let url = this.leadUrl + "/v1/users/cm_search?search=" + searchItem;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  //to remove assign GM //
  romoveAssignGm(cmId, gmId) {
    let url = environment.apiBaseUrl + "/v1/users/unassign_gm_to_cm";
    this.options.params = null;
    var obj = {
      cm_id: cmId,
      gm_id: gmId,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  romoveAssignSm(cmId, smId) {
    let url = environment.apiBaseUrl + "/v1/users/assign_cm_for_sm";
    this.options.params = null;
    var obj = {
      cm_id: cmId,
      sales_manager_id: " ", 
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  romoveAssignASMforSM(smId, asmId) {
    let url = environment.apiBaseUrl + "/v1/users/assign_asm_to_sm";
    this.options.params = null;
    var obj = {
      sm_id: smId,
      area_sales_manager_id: " ",
    };

    return this.http
      .post(url, obj, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);

  }

  uploadApartment_Zipfolder(basefile) {
    let uploadApartmentfile =
      environment.apiBaseUrl + "/v1/apartments/import_apartments_data";
    let postdata = { apartments_data: basefile };
    return this.http
      .post(uploadApartmentfile, postdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadApartment_Zipfolders(file, name) {
    let url = environment.apiBaseUrl + "/v1/contents/upload_apartment_content";
    let formdata = new FormData();
    formdata.append("document_file_name", name);
    formdata.append("scope", "apartment_images_bundle");
    formdata.append("document", file);

    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // service call for lead store
  getLeadStoreList() {
    let url;
    url = environment.apiBaseUrl + "/v1/lead_stores";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getStateList() {
    let url = environment.apiBaseUrl + "/v1/cities/get_state_list";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getCityList(stateCode) {
    let url =
      environment.apiBaseUrl +
      `/v1/cities/get_cities_list_from_state?state_code=${stateCode}`;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getTagType() {
    let url = environment.apiBaseUrl + "/v1/lead_stores/tag_type_list";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getLeadStoreDetails(leadStoreId) {
    let url = environment.apiBaseUrl + `/v1/lead_stores/${leadStoreId}`;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  submitLeadStoreDetails(leadData) {
    let url = environment.apiBaseUrl + "/v1/lead_stores";
    return this.http
      .post(url, leadData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listDgmLeads( search ,  dgm){
    let url = environment.apiBaseUrl + `/v1/users/list_of_dgm_cm_mapping?search=${search}&dgm_id=${dgm}`
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  list_dgm_list(){
    let url = environment.apiBaseUrl + `/v1/users/get_all_dgm`
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  assign_dGM_cM(cm_id , dgm_id){
    let url = environment.apiBaseUrl + `/v1/users/assign_cm_for_dgm`
    this.options.params = null;
    var obj = {
      cm_id: cm_id,
      dgm_id: dgm_id,
    };
      return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateLeadStoreDetails(leadData, leadStoreId) {
    let url = environment.apiBaseUrl + `/v1/lead_stores/${leadStoreId}`;
    return this.http
      .patch(url, leadData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getLeadStoreListForMainPage(currentPage?, value?) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_stores/paginated_list?search=" +
      value +
      "&page=" +
      currentPage;

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getThemeList() {
    let url =
      environment.apiBaseUrl + "/v1/note_records/get_apartment_theme_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getLifeStageList() {
    let url = environment.apiBaseUrl + "/v1/lifestages";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAccountDetails(lead_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/leads/" +
      lead_id +
      "/icici_ecollection_details";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getRequestType() {
    let url = environment.apiBaseUrl + "/v1/requests/get_list_of_request_types";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getListwithType(
    allowed_types,

    pageno,

    per_page,

    search,

    featured,

    gm,

    cm,
    sm,
    designer,

    delayed,

    start_date,

    end_date,

    filter_column,

    send_file,

    sort_column,

    sort_order,

    date_type,

    dashboard_filter,

    scheduled,

    active_project,

    store,

    living,
    priority,
    hotLeads,
    delay,
    typeOfExport,
    lead_type,
    start_at,
    end_at,
    send_order_pipeline,
    ob_category?,
  ) {
    typeOfExport =   typeOfExport?  typeOfExport:''
    if(priority==undefined){
      priority='';
    }
    if(featured==null){
      featured='';
    }
   store = store?store:[];
   gm = gm?gm:'';
   cm = cm?cm:'';
   designer = designer?designer:'';
   store = store?store:[];
   store = store?store:[];
   living = living?living:"";
   hotLeads = hotLeads ? hotLeads :"";
   search =  search? search:""
   if( delayed == 1){
    delayed = ''
  }
  if( ob_category == undefined){
    ob_category = ''
  }

    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs?type=" +
      allowed_types +
      "&page=" +
      pageno +
      "&per_page=" +
      per_page +
      "&search=" +
      search +
      "&featured=" +
      featured +
      "&gm_ids=" +
      gm +
      "&cm_ids=" +
      cm +
      "&sm_id=" +
      sm +
      "&designer_ids=" +
      designer +
      "&delayed=" +
      delayed +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&filter_column=" +
      filter_column +
    typeOfExport +
      send_file +
      "&sort_column=" +
      sort_column +
      "&sort_order=" +
      sort_order +
      "&date_type=" +
      date_type +
      "&dashboard_filter=" +
      dashboard_filter +
      "&scheduled=" +
      scheduled +
      "&inactive=" +
      active_project +
      "&store=" +
      store +
      "&lead_source=" +
      living +
      "&hot_lead=" +
      hotLeads +
      "&priority=" +
      priority +
      "&delay=" +
      delay +
      "&lead_type=" + 
      lead_type + 
      "&start_at=" +
      start_at +
      "&end_at=" +
      end_at + 
      "&send_order_pipeline=" +
      send_order_pipeline +
      "&ob_category=" +
      ob_category
    return this.http

      .get(url, this.options)

      .map(this.extractData)

      .catch(this.handleErrorObservable);
  }

  // 40-100% Tab
  getListwithTypeforty(
    allowed_types,
    pageno,
    per_page,
    search,
    featured,
    gm,
    cm,
    sm,
    designer,
    delayed,
    start_date,
    end_date,
    filter_column,
    send_file,
    sort_column,
    sort_order,
    date_type,
    dashboard_filter,
    scheduled,
    store,
    living,
    priority,
    typeOfExport,
    oc_category?
  ) {
    if (gm == undefined) {
      gm = "";
    }
    if (sm == undefined) {
      sm = "";
    }
    if(priority==undefined){
      priority=''
    }
    if (oc_category == undefined) {
      oc_category = "";
    }
    typeOfExport =   typeOfExport?  typeOfExport:''
    featured = featured ?featured:"";
    store = store ? store : [];
    living = living ? living : "";
    search = search?search:"";
    if( delayed == 1){
      delayed = ''
    }
    gm = gm?gm:'';
    cm = cm?cm:'';
    sm = sm?sm:'';
    designer = designer?designer:'';
  

        let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs?type=" +
      allowed_types +
      "&page=" +
      pageno +
      "&per_page=" +
      per_page +
      "&search=" +
      search +
      "&featured=" +
      featured +
      "&gm_ids=" +
      gm +
      "&cm_ids=" +
      cm +
      "&sm_id="+
      sm+
      "&designer_ids=" +
      designer +
      "&delayed=" +
      delayed +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&filter_column=" +
      filter_column +
      typeOfExport +
      send_file +
      "&sort_column=" +
      sort_column +
      "&sort_order=" +
      sort_order +
      "&date_type=" +
      date_type +
      "&dashboard_filter=" +
      dashboard_filter +
      "&scheduled=" +
      scheduled +
      "&store=" +
      store +
      "&lead_source=" +
      living +
      "&priority=" +
      priority +
      "&oc_category=" +
      oc_category;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // {{url}}/v1/office_snags/list_snag_for_noc?search&status&start_date&end_date&mile_stone&send_file
  getSnagDataNoc(search , status, start_date , end_date , mile_stone , send_file , page , per_page,date_type,sendfile){
    date_type = date_type?date_type:'';
    let url = environment.apiBaseUrl + '/v1/office_snags/list_snag_for_noc?search=' +
    search + 
    "&status=" + 
    status + 
    "&start_date=" +
    start_date + 
    "&end_date=" + 
    end_date + 
    "&mile_stone="+
    mile_stone + 
    sendfile + 
    send_file + 
    "&page=" + 
    page + 
    "&per_page=" + 
    per_page +
    "&date_type=" + 
    date_type
    return this.http
    .get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }
  getBOQDetails(leadId) {
    let url =
      environment.apiBaseUrl + "/v1/lead_nocs/boq_details?lead_id=" + leadId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBOQZeroList(leadId) {
    let url =
      environment.apiBaseUrl + "/v1/lead_nocs/boq_listing_0_50?lead_id=" + leadId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBOQFiftyList(leadId,type) {
      let url;
    if(type =='FortyToHundred'){
       url =
      environment.apiBaseUrl + "/v1/lead_nocs/boq_listing_50_100?lead_id=" + leadId;

    } else{
       url =
      environment.apiBaseUrl + "/v1/lead_nocs/boq_listing_handedover?lead_id=" + leadId;
     
    }
   
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getQotationDataList(qId) {
    let url =
      environment.apiBaseUrl + "/v1/lead_nocs/boq_details?quotation_id=" + qId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }



  orderPipeLineData(id){
    let url = environment.apiBaseUrl + '/v1/projects/boq_order_pipeline_dates?lead_id=' + id 
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getBoqDetailforty(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/boq_details_50_100?lead_id=" +
      leadId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBoqDetailfortynonservice(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/boq_details_50_100?lead_id=" +
      leadId +
      "&boq_type=non_service";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getBoqDetailfortyModularKitchen(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/boq_details_50_100?lead_id=" +
      leadId +
      "&boq_type=modular_kitchen";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addToFeatured(obj) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/add_to_featured";
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  removefromFeatured(obj) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/remove_from_featured";
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getGMList(id) {
    let url = environment.apiBaseUrl + "/v1/users/" + id + "/gms_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCMList(id, user_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/" +
      id +
      "/cms_list?user_id=" +
      user_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFilterListofWIPCMForDM(){
    let dgm_id;
    dgm_id = localStorage.getItem('currentUserId')
    dgm_id = dgm_id?dgm_id:''
    let url= environment.apiBaseUrl +`/v1/users/list_of_dgm_cm_mapping?search=&dgm_id=${dgm_id}`;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  getGMLists(search?,page?) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/gms_details?search="+search+"&page="+page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  } 
  getSMListss(id,search?,page?) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/sales_managers_details?asm_id="+id+"&search="+search+"&page="+page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  } 
  getCMLists(id,search?,page?) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/cms_details?user_id="+id+"&search="+search+"&page="+page+"&per_page=10";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  } 
  getDMLists(id,search?,page?) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/designers_details?cm_id="+id+"&search="+search+"&page="+page+"&per_page=10";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }


  getSMList() {
    let url =
      environment.apiBaseUrl +
      "/v1/users/";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSMLists() {
    let url = environment.apiBaseUrl + "/v1/users/sales_managers";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDMattendence(gm_id?,cm_id?,designer_id?,page?){
    let url =
    environment.apiBaseUrl +
    "/v1/users/designer_attendences_list?"+"send_file="+false+"&page="+page+"&gm_id="+gm_id+"&cm_id="+cm_id+"&designer_id="+designer_id;
  return this.http
    .get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);

  }

  // Export(send_file,start_date?,end_date?,gm_id?,cm_id?,designer_id?){
  //   let url =
  //   environment.apiBaseUrl +
  //   "/v1/users/designer_attendences_list?"+"send_file="+send_file+"&start_date="+start_date+"&end_date="+end_date+"&gm_id="+gm_id+"&cm_id="+cm_id+"&designer_id="+designer_id;
  // return this.http
  //   .get(url, this.options)
  //   .map(this.extractDataPage)
  //   .catch(this.handleErrorObservable);

  // }
  Export(send_file, start_date?, end_date?, gm_id?, cm_id?, designer_id?) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/designer_attendences_list?" +
      "send_file=" +
      send_file +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&gm_id=" +
      gm_id +
      "&cm_id=" +
      cm_id +
      "&designer_id=" +
      designer_id;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getASMList() {

    let url =environment.apiBaseUrl +"/v1/users/get_all_area_sales_managers";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  getDesignerListNOC(id, user_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/users/" +
      id +
      "/designers_list?user_id=" +
      user_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getColumnfilterdate() {
    let url =
      environment.apiBaseUrl + "/v1/lead_nocs/allowed_filter_date_columns";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailimportportfolio(id, project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/portfolios/" +
      id +
      "/details_for_import?project_id=" +
      project_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeLeadDate(event1, event2, event3, event4, event5, event6) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/add_custom_date";
    var obj = {
      ownerable_type: event1,
      ownerable_id: event2,
      date_name: event3,
      manual_date: event4,
      reason: event5,
      notes: event6,
      date_type: "expected",
    };
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeSnagDateNoc(manual_date , reason , notes , id , date_name , type) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/add_custom_date";
    var obj = {
      manual_date : manual_date,
      reason : reason,
      notes : notes,
      ownerable_id : id,
      date_name : date_name,
      date_type : type,
      ownerable_type : 'OfficeSnag'
    };
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeLeadActualDate(event1, event2, event3, event4, event6) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/add_custom_date";
    if(event3 == 'Snag RM Reciving'){
      event3 = 'Raw Material'

    }
    var obj = {
      ownerable_type: event1,
      ownerable_id: event2,
      date_name: event3,
      manual_date: event4,
      notes: event6,
      date_type: "actual",
    };
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getValidReason() {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/reasons";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  runJob(lead_id) {
    let url = environment.apiBaseUrl + "/v1//lead_nocs/update_lead_noc";
    var obj = {
      lead_id: lead_id,
    };
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  runJobsnag(lead_id) {
    let url = environment.apiBaseUrl + "/v1/office_snags/snag_noc_update_job?snag_id="+lead_id;
  
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateonholdEvent(eventId, eventId2, obj1, obj2, obj3) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/events/" +
      eventId +
      "/reschedule_event?ownerable_type=Project&ownerable_id=" +
      eventId2;
    var obj = {
      event: {
        scheduled_at: obj1,
        remark: obj2,
        agenda: "on_hold",
        ownerable_id: eventId2,
        ownerable_type: "Project",
        emails: obj3,
      },
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  leadCancelApproveReject(id , status){
    let eventUrl = environment.apiBaseUrl + "/v1/users/change_status_for_approval_request"
    var data = {
      approval_status : status,
      project_id : id
    }
    return this.http
    .post(eventUrl, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  deleteStoreDetails(storeId) {
    let url = environment.apiBaseUrl + `/v1/stores/${storeId}`;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getStoreListForMainPage(page, value, sm) {
    let url =
      environment.apiBaseUrl +
      "/v1/stores?page=" +
      page +
      "&per_page=10" +
      "&search=" +
      value +
      "&sm_id=" +
      sm;

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getStoreDetails(StoreId) {
    let url = environment.apiBaseUrl + `/v1/stores/${StoreId}`;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  submitStoreDetails(storeData) {
    let url = environment.apiBaseUrl + "/v1/stores";
    return this.http
      .post(url, storeData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateStoreDetails(storeData, storeId) {
    let url = environment.apiBaseUrl + `/v1/stores/${storeId}`;
    return this.http
      .patch(url, storeData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  showLineitem(value1, value2) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      value1 +
      "/quotations/" +
      value2 +
      "/show_boq_line_items";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  jobPriceMatch(storeData) {
    let url = environment.apiBaseUrl + "/v1/job_price_matches";
    return this.http
      .post(url, storeData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  finalapproveprice(storeData) {
    let url = environment.apiBaseUrl + "/v1/job_price_matches/update_job_price";
    return this.http
      .patch(url, storeData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getallcomp() {
    let url =
      environment.apiBaseUrl +
      "/v1/job_price_matches/get_all_price_match_competitors";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  bulckuploadfile(data) {
    let url = environment.apiBaseUrl + "/v1/payments/bulk_payments_upload";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllStoreManagers() {
    let url = environment.apiBaseUrl + "/v1/stores/get_all_store_managers";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  AssignStoreManager(obj) {
    let url = environment.apiBaseUrl + "/v1/users/update_store_for_sm";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  CreateAdjust(data) {
    let url = environment.apiBaseUrl + "/v1/dsr_adjustments";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAdjustments(page) {
    let url = environment.apiBaseUrl + "/v1/dsr_adjustments?page=" + page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  deleteAdjustDetails(Id) {
    let url = environment.apiBaseUrl + `/v1/dsr_adjustments/${Id}/deactivate`;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllLOBS() {
    let url = environment.apiBaseUrl + "/v1/category_lobs";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllDeapartments() {
    let url = environment.apiBaseUrl + "/v1/category_departments";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllDeapartmentsfilter(id) {
    if (id == undefined) {
      id = "";
    }
    let url = environment.apiBaseUrl + "/v1/category_departments?lob_id=" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllSubDeapartments() {
    let url = environment.apiBaseUrl + "/v1/category_sub_departments";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllSubDeapartmentsFilter(lob_id, id) {
    if (id == undefined) {
      id = "";
    }
    if (lob_id == undefined) {
      lob_id = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/category_sub_departments?lob_id=" +
      lob_id +
      "&depart_id=" +
      id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllMaterialFilter(lob_id, dep_id, sub_dep_id, class_id, id) {
    if (id == undefined) {
      id = "";
    }
    if (lob_id == undefined) {
      lob_id = "";
    }
    if (dep_id == undefined) {
      dep_id = "";
    }
    if (sub_dep_id == undefined) {
      sub_dep_id = "";
    }

    if (class_id == undefined) {
      class_id = "";
    }

    let url =
      environment.apiBaseUrl +
      "/v1/category_material_codes?lob_id=" +
      lob_id +
      "&depart_id=" +
      dep_id +
      "&sub_depart_id=" +
      sub_dep_id +
      "&class_id=" +
      class_id +
      "&sub_class_id=" +
      id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllClass() {
    let url = environment.apiBaseUrl + "/v1/category_classes";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllClassFilters(lob_id, depart_id, sub_dep) {
    if (depart_id == undefined) {
      depart_id = "";
    }
    if (lob_id == undefined) {
      lob_id = "";
    }
    if (sub_dep == undefined) {
      sub_dep = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/category_classes?lob_id=" +
      lob_id +
      "&depart_id=" +
      depart_id +
      "&sub_depart_id=" +
      sub_dep;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllSubClass() {
    let url = environment.apiBaseUrl + "/v1/category_subclasses";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllSubClassFilters(lob, dep, sub_dep, clas) {
    if (lob == undefined) {
      lob = "";
    }
    if (dep == undefined) {
      dep = "";
    }
    if (sub_dep == undefined) {
      sub_dep = "";
    }
    if (clas == undefined) {
      clas = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/category_subclasses?lob_id=" +
      lob +
      "&depart_id=" +
      dep +
      "&sub_depart_id=" +
      sub_dep +
      "&class_id=" +
      clas;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  newIpUat = "http://65.1.54.251";
  getAllmaterail() {
    let url = environment.apiBaseUrl + "/v1/category_material_codes";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createLOB(data) {
    let url = environment.apiBaseUrl + "/v1/category_lobs";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createBrand(data) {
    let url = environment.apiBaseUrl + "/v1/brands";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createDepartment(data) {
    let url = environment.apiBaseUrl + "/v1/category_departments";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createSubDepartment(data) {
    let url = environment.apiBaseUrl + "/v1/category_sub_departments";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createClass(data) {
    let url = environment.apiBaseUrl + "/v1/category_classes";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createSubClass(data) {
    let url = environment.apiBaseUrl + "/v1/category_subclasses";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createMaterial(data) {
    let url = environment.apiBaseUrl + "/v1/category_material_codes";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createProduct(data) {
    data.master_line_item.mli_attributes_attributes = [...data.master_line_item.mli_attributes_attributes,...data.master_line_item.customization_attributes]
    if(data.master_line_item.is_customizable){
      data.master_line_item.is_customizable = 'yes'
    } else{
      data.master_line_item.is_customizable = 'no'
  
    }
    let url = environment.apiBaseUrl + "/v1/master_line_items";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateProduct(data, id) {
    data.master_line_item.mli_attributes_attributes = [...data.master_line_item.mli_attributes_attributes,...data.master_line_item.customization_attributes]
    if(data.master_line_item.is_customizable){
      data.master_line_item.is_customizable = 'yes'
    } else{
      data.master_line_item.is_customizable = 'no'
  
    }
    let url = environment.apiBaseUrl + "/v1/master_line_items/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createProductchild(data,images,fetaured) {
    data['featured_image'] = fetaured;
     let index = images.indexOf(fetaured)
    let removed = images.splice(index, 1);
  
    let obj = {
      child_line_item: data,
      images:images
    };

    let url = environment.apiBaseUrl + "/v1/child_line_items";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  EditProductchild(data, id,fetaured,images) {
    console.log(images)
    data['featured_image'] = fetaured;
    if(fetaured.startsWith('data:image')){
      data['featured_image_type'] = 'base_64';
    } else{
      data['featured_image_type'] = 's3';
    }
 
    let index = images.indexOf(fetaured)
    if(index > -1){
      let removed = images.splice(index, 1);
    }
    


    let formattedImages = images
  .filter(url => url && url.startsWith('data:image'))
  .map(url => ({ image: url, type: 'base_64' }));
  
    let obj = {
      child_line_item: data,
      images:formattedImages
    };
    let url = environment.apiBaseUrl + "/v1/child_line_items/" + id;
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ListOfPRoduct(page, search,filter_type) {
    let url =
      environment.apiBaseUrl +
      "/v1/master_line_items/master_line_item_list?page=" +
      page +
      "&search=" +
      search +
      "&per_page=50"+"&filter_type="+filter_type;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  ListOfPRoduct2(
    page,
    cli_id,
    lob_id,
    dep_id,
    sub_depart_id,
    class_id,
    sub_class_id,
    mat_id,v_id
  ) {
    cli_id = cli_id ? cli_id : "";
    lob_id = lob_id ? lob_id : "";
    dep_id = dep_id ? dep_id : "";
    sub_depart_id = sub_depart_id ? sub_depart_id : "";
    class_id = class_id ? class_id : "";
    sub_class_id = sub_class_id ? sub_class_id : "";
    mat_id = mat_id ? mat_id : "";
    v_id = v_id ? v_id : "";

    let url =
      environment.apiBaseUrl +
      "/v1/child_line_items/category_hierarchy_index?page=" +
      page +
      "&per_page=6" +
      "&search=" +
      cli_id +
      "&category_lob_id=" +
      lob_id +
      "&category_department_id=" +
      dep_id +
      "&category_sub_department_id=" +
      sub_depart_id +
      "&category_material_code_id=" +
      mat_id +
      "&category_subclass_id=" +
      sub_class_id +
      "&category_class_id=" +
      class_id+"&vendor_id="+v_id;

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  ListOfVendors() {
    let url = environment.apiBaseUrl + "/v1/vendors/get_vendor_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  CreateVendorType(value) {
    let formdata = {
      vendor_product: {
        rate: value.ItemCost,
        vendor_id: value.vendorName,
        child_line_item_id: value.child_line_item_id,
        vendor_code: value.vendorCode,
      },
      priority: value.priority,
    };

    let url = environment.apiBaseUrl + "/v1/vendor_products";
    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpdateVendorType(value, vp_id) {
    let formdata = {
      vendor_product: {
        rate: value.ItemCost,
        vendor_id: value.VendorId,
        child_line_item_id: value.child_line_item_id,
        vendor_code: value.VendorCode,
      },
      priority: value.priority,
    };

    let url = environment.apiBaseUrl + "/v1/vendor_products/" + vp_id;
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ListOfChilds(id, page,search,filter_type,qitem) {
    let url =
      environment.apiBaseUrl +
      "/v1/child_line_items/new_index?mli_id=" +
      id +
      "&page=" +
      page +
      "&per_page=10"+"&search="+search+"&filter_type="+filter_type+"&quotation_items="+qitem;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  boqProjectData(page: any, itemsperpage: any, value: any, gm_Id: any, cm_Id:any, designer_Id: any) {
    let url =
      environment.apiBaseUrl +
      `/v1/projects/projects_for_import_boq?page=${page}&per_page=${itemsperpage}&search_param=${value}&gm_id=${gm_Id}&designer_id=${designer_Id}&cm_id=${cm_Id}`;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  DeleteChilds(id) {
    let url = environment.apiBaseUrl + "/v1/child_line_items/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorsForchild(id) {
    let url =
      environment.apiBaseUrl + "/v1/vendor_products/view_vendors?cli_id=" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  swicthVendor(id) {
    let obj = {
      priority: true,
    };
    let url =
      environment.apiBaseUrl + "/v1/vendor_products/" + id + "/vendor_switch";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getMasterDetails(id) {
    let url = environment.apiBaseUrl + "/v1/master_line_items/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getchildDetails(id) {
    let url = environment.apiBaseUrl + "/v1/child_line_items/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteAttribute(id) {
    let url =
      environment.apiBaseUrl + "/v1/master_line_items/delete_attr?mli_id=" + id;
    return this.http
      .post(url, [], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteAttributeChild(id) {
    let url =
      environment.apiBaseUrl +
      "/v1/child_line_items/delete_child_attr?sli_id=" +
      id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteVendorProduct(id) {
    let url = environment.apiBaseUrl + "/v1/vendor_products/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  GetListBrands() {
    let url = environment.apiBaseUrl + "/v1/brands";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  GetListWCats() {
    let url = environment.apiBaseUrl + "/v1/master_line_items/zoho_category_listing";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  GetListWCatImages(id) {
    let url = environment.apiBaseUrl + "/v1/child_line_items/get_cli_images?id="+id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteCliImage(featured,id,image_id){
    let url = environment.apiBaseUrl + `/v1/child_line_items/delete_cli_image?featured=${featured}&id=${id}&image_id=${image_id}`;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  CalculateValue(obj){
    let url = environment.apiBaseUrl + "/v1/mli_formulas/formula_calculate";
    return this.http
      .post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  
  prioritycheck(id) {
    let url =
      environment.apiBaseUrl +
      "/v1/child_line_items/check_existing_priority_vendor?child_line_item_id=" +
      id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  CreateSliForCat(data, q_id, p_id) {
    console.log(q_id, p_id);
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      p_id +
      "/quotations/" +
      q_id +
      "/create_sli_new";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  CreateSliFormain(data) {
    let url = environment.apiBaseUrl + "/v1/wip_slis/add_master_sli";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteLOB(id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpDateLOb(data, id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteDep(id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpDateDep(data, id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteSubDep(id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpDateSubDep(data, id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteClass(id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpDateClass(data, id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteSubClass(id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpDateSUbClass(data, id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteMatcode(id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpDateMatCode(data, id) {
    let url = environment.apiBaseUrl + "/v1/category_lobs/" + id;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  GetListCats() {
    let url = environment.apiBaseUrl + "/v1/master_line_items/sli_categories";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getGmCmDesignerList(gmId?:any, cmId?:any){
    let url =
    environment.apiBaseUrl +
    `/v1/projects/cm_gm_designers_list?gm_id=${gmId}&cm_id=${cmId}`;
  return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  addToPriority(obj) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/add_to_priority";
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  removefromPriority(obj) {
    let url = environment.apiBaseUrl + "/v1/lead_nocs/remove_from_priority";
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBoqDetailHandover(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/boq_details_handover?lead_id=" +
      leadId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBoqDetailHandovernonservice(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/boq_details_handover?lead_id=" +
      leadId +
      "&boq_type=non_service";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBoqDetailHandoverModularKitchen(leadId) {
    let url =
      environment.apiBaseUrl +
      "/v1/lead_nocs/boq_details_handover?lead_id=" +
      leadId +
      "&boq_type=modular_kitchen";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  eachescalationMoadalLog(id, page, perPage) {
    let url =
      environment.apiBaseUrl +
      "/v1/manual_escalation_logs/get_status_change_log_on_escalation_id?escalation_id=" +
      id +
      "&page=" +
      page +
      "&per_page=" +
      perPage;
    console.log(id);
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  compareBoqs(first_boq_id,seconed_boq_id) {
    let url =
      environment.apiBaseUrl +
      `/v1/quotations/comparison?original_quotation_id=${first_boq_id}&other_quotation_id=${seconed_boq_id}`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  
  delayedLeads(allleads) {
    let url = environment.apiBaseUrl + '/v1/lead_nocs/delayed_expected_date_leads?all_leads='+allleads;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  MTOComparison(Original_id,Other_id){
    let url = environment.apiBaseUrl + '/v1/quotations/mto_comparison?original_mto_id='+Original_id+'&other_mto_id='+Other_id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  ExportBoqComparision(original_id, other_id){
    let url = environment.apiBaseUrl + '/v1/quotations/comparison?original_quotation_id='+original_id+'&other_quotation_id='+other_id;
    return this.http.get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  FetchAdress(id){
    let url = environment.apiBaseUrl + '/v1/projects/'+id+'/fetch_address';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  FetchZohomap(id){
    let url = environment.apiBaseUrl + '/v1/child_line_items/fetch_zoho_mapped_data?sku='+id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
   ManualZohomap(obj){

    let url = environment.apiBaseUrl + '/v1/child_line_items/add_zoho_item_id_manually';
    return this.http.put(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  AutoZohomap(obj){

    let url = environment.apiBaseUrl + '/v1/child_line_items/add_zoho_item_id_automatically';
    return this.http.put(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  FetchUrl(id){
    let url = environment.apiBaseUrl + '/v1/quotations/aide_post_validation_csv_download?aide_boq_id='+id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  CreateFileInSite(obj){
    let url = environment.apiBaseUrl + '/v1/requests/add_site_validation_files';
    return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  listCreateFile(id){
    let url = environment.apiBaseUrl + '/v1/requests/get_site_validation_files?request_id=' +id
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  deleteEachFile(id , groupid){
    let url = environment.apiBaseUrl + '/v1/requests/remove_site_validation_files?file_id=' + id +'&group_id=' + groupid
    return this.http.put(url,[], this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  FetchBatchItems(id){
    let url = environment.apiBaseUrl + '/v1/quotation_batches/mto_line_items?batch_id='+id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  UploadProBom(id){
    let obj ={
      quotation_batch_id :id
    }
    let url = environment.apiBaseUrl + '/v1/quotation_batches/upload_bom';
    return this.http.post(url,obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  listCreateOrderId(obj){

    let url = environment.apiBaseUrl + '/v1/quotation_batches/update_mto_boq_display'
    return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  HWUpload(obj){

    let formdata = new FormData();
    formdata.append("mto_boq_display_id", obj.id);
    formdata.append("document", obj.order_id);

    let url = environment.apiBaseUrl + '/v1/mto_bom_hws/map_mto_bom_hardware'
    return this.http.post(url,formdata,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  RMUpload(obj){

    let formdata = new FormData();
    formdata.append("batch_id", obj.id);
    formdata.append("document", obj.order_id);

    let url = environment.apiBaseUrl + '/v1/mto_bom_rms/map_mto_bom_rm'
    return this.http.post(url,formdata,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ProfileUpload(obj){
    let formdata = new FormData()
    formdata.append("batch_id", obj.id);
    formdata.append("document", obj.order_id);
    let url = environment.apiBaseUrl + '/v1/mto_bom_rms/map_mto_bom_rm'
    return this.http.post(url,formdata,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // http://localhost:3000/v1/mto_bom_profiles/item_type_dropdown_data
  ProfileItemTypeDropDown(){
    let url = environment.apiBaseUrl + '/v1/mto_bom_profiles/item_type_dropdown_data'
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  profileOrderIdDate(id){
    let url = environment.apiBaseUrl + '/v1/mto_bom_profiles/get_mto_bom_order_data?batch_id=' + id
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  // http://localhost:3000/v1/mto_bom_profiles/map_mto_bom_profile

  fileUploadProfile(obj){
    let formdata = new FormData()

    formdata.append("batch_id" , obj.id);
    formdata.append("document" , obj.order_id);
    formdata.append("item_type" , obj.item_type);
    formdata.append("order_ids" , obj.ids_order);


    let url = environment.apiBaseUrl + '/v1/mto_bom_profiles/map_mto_bom_profile'
    return this.http.post(url,formdata,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  fileUploadnts(obj){
    let formdata = new FormData()

    formdata.append("batch_id" , obj.id);
    formdata.append("document" , obj.order_id);
    
    formdata.append("order_ids" , obj.ids_order);


    let url = environment.apiBaseUrl + '/v1/mto_bom_nts/map_mto_bom_nts'
    return this.http.post(url,formdata,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  fileUploadForGlassSoftPad(obj){
    let formdata = new FormData()
    formdata.append("batch_id" , obj.id);
    formdata.append("document" , obj.order_id);
    formdata.append("order_ids" , obj.ids_order);
    formdata.append("upload_type" , obj.upload_type);
    let url = environment.apiBaseUrl + '/v1/mto_bom_uploads/map_mto_bom_upload'
    return this.http.post(url,formdata,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  CreateCsQuestionire(data,project_id){

    let url = environment.apiBaseUrl + `/v1/projects/${project_id}/first_meeting_questionnaires/create_first_meeting_questionnaire`
    return this.http.post(url,data,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  

  }
  questionireDetails(project_id){
    let url = environment.apiBaseUrl + `/v1/projects/${project_id}/first_meeting_questionnaires/show_first_meeting_questionnaire`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }


  fetchdynamicmap(id){
    let url = environment.apiBaseUrl + `/v1/child_line_items/fetch_dynamics_mapped_data?id=${id}`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  mapitem(id,item_id){
    let url = environment.apiBaseUrl + `/v1/child_line_items/map_existing_item_from_dynamics?id=${id}&item_id=${item_id}`
    return this.http.put(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  createchilditem(id){
    let url = environment.apiBaseUrl + `/v1/child_line_items/create_new_item_to_dynamics?id=${id}`
    return this.http.put(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  instantsnagjob(){
    let url = environment.apiBaseUrl + "/v1/office_snags/snag_job_instantly";
    return this.http
      .post(url,'', this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  // Complete Post BidSite Request Api
  completePostBidSiteRequest(data:any, id:any){
    let url = environment.apiBaseUrl + `/v1/requests/${id}/complete_post_bid_site_measurement_request`;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadFileToS3(url: string, file: any): Observable<any> {

    let headers = new Headers({
      'Content-Type': file.type,
    });

    let options = new RequestOptions({ headers: headers });

    return this.http.put(url, file, options)
      .map((response: any) => response)
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  postBidFileUploadStatus(id:any,status:any,remark:any,file_id:any){
    let url = environment.apiBaseUrl + `/v1/requests/${id}/post_bid_large_file_uploaded?status=${status}&remark=${remark}&file_id=${file_id}`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getS3FileUploadeUrl(id:any, file:any, file_id:any){
    let url = environment.apiBaseUrl + `/v1/requests/${id}/post_bid_large_file_url?site_images_file_size=${file.size}&site_images_file_content_type=${'zip'}&site_images_file_name=${file.name}&file_id=${file_id ? file_id : ''}`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  
  // Design itration api

  

  getSpaceDetails(id:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/event_space_details`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getSpaceUnits(id:any,name:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/event_spaces/units_for_space?space_name=${name}`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  addSpaceToEventMOM(id:any, data:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/event_spaces`;
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateSpaceToEventMOM(id:any, data:any, space_id:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/event_spaces/${space_id}`
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSpaceToEventMOM(id:any, space_id:any){
    let url = environment.apiBaseUrl+`/v1/events/${id}/event_spaces/${space_id}`;
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  deleteSpaceToEventImage(id:any, space_id:any, image_id:any){
    let url = environment.apiBaseUrl+`/v1/events/${id}/event_spaces/${space_id}/delete_space_image?image_id=${image_id}`;
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  addSpaceUnit(id:any, data:any, space_id:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/event_spaces/${space_id}/add_units_to_event_space`;
    return this.http
      .post(url,data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateSpaceUnit(data:any, id:any, space_id:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/event_spaces/${space_id}/update_unit`;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSpaceUnit(unit_id:any, id:any, space_id:any){
    let url = environment.apiBaseUrl+`/v1/events/${id}/event_spaces/${space_id}/delete_space_unit?unit_id=${unit_id}`;
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  shareOTPevent(id){
    let url = environment.apiBaseUrl + `/v1/events/${id}/share_event_otp`
    return this.http.get(url , this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  verifyOTP(otp:any, id:any){
    let url = environment.apiBaseUrl + `/v1/events/${id}/verify_event_otp?otp=${otp}`;
    return this.http
      .post(url,'', this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  approve_reject_progress_detail(data:any, id:any){
    let url = environment.apiBaseUrl + `/v1/projects/${id}/approve_reject_progress_detail`;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllSpaces() {
    let url = environment.apiBaseUrl + "/v1/boq_global_configs/list_of_spaces";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  final_design_session_submit(data, id){
    let url = environment.apiBaseUrl + `/v1/projects/${id}/change_final_design_session`;
    return this.http
      .put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


}

