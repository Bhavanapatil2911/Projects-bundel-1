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
import { AuthService } from "../../../authentication/auth.service";
import { environment } from "../../../../environments/environment";
import "rxjs/add/observable/of";

@Injectable()
export class CmstatuslistService {
  options: RequestOptions;
  private csAgentUrl = environment.apiBaseUrl + "/v1/users/";

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

  getCmList(id,status,search) {
    id = id == undefined ? "" : id;
    status = status == undefined ? "" : status;
    let url = this.csAgentUrl + "get_all_community_managers?store_id=" + id + "&status=" + status + "&search="+ search;

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    // v1/users/get_all_community_managers
  }

  changeLeadIntakeStatus(userId) {
    let url = this.csAgentUrl + "check_cm_available";
    var body = {
      cm_id: userId,
    };
    return this.http
      .patch(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  Getstoresfilter() {
    let url = environment.apiBaseUrl + "/v1/stores/get_all_stores";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  createEventForCM(id , data){
    let sendData = {
      event : {
        ownerable_id : id,
        ownerable_type : 'Project',
        contact_type : data.contact_type,
        scheduled_at : data.scheduled_at,
        agenda : 'PM10:_first_meeting_cs',
        description : data.description,
        status : 'scheduled',
        location : data.location,
        email : ''
      }
    }

    let url = environment.apiBaseUrl + "/v1/events/create_first_meeting_with_cs/?ownerable_type=Project&ownerable_id=" + id
    return this.http
    .post(url, sendData, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  // http://localhost:3000/v1/events/can_create_first_meeting_with_cs?ownerable_id=35692
  canAgainCreate(id){
    let url = environment.apiBaseUrl + "/v1/events/can_create_first_meeting_with_cs?ownerable_id=" +  id
    return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  GetstoresfilterCMD() {
    let url =
      environment.apiBaseUrl + "/v1/stores/get_store_name_on_cm_designer";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  upadtestore(obj) {
    let url = this.csAgentUrl + "update_store_for_cm";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
}
