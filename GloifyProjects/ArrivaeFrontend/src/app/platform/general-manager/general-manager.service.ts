import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from 'environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable()
export class GeneralManagerService {
  options: RequestOptions;
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

  getDAYAndWEEKData(
    filterType,
    qualification,
    filterArea,
    filterTime,
    fromDate,
    toDate,
    designers,
    cms,
    gms,
    sms,
    store
  ) {
    var obj = {
      from_date: fromDate,
      to_date: toDate,
      data_scope: filterArea,
      time_duration: filterTime,
      digital_physical: filterType,
      date_filter_type: qualification,
      cm: cms,
      gm: gms,
      sm: sms,
      designers: designers,
      store: store,
    };

    var obj1 = JSON.stringify(obj);
    let url =
      environment.apiBaseUrl + "/v1/leads/gm_dashboard?filter_params=" + obj1;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCMsAndDesForCityForOther(gms, cms , sms) {
    // var val = (cityid)?cityid:'';
    var url =
      environment.apiBaseUrl +
      "/v1/leads/city_gm_cm_and_designer?gm=" +
      gms +
      "&cm=" +
      cms + 
      "&sm=" + sms 
    let params: URLSearchParams = new URLSearchParams();
    // params.set('data_scope', dataScope);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  seeCountDetails(
    row_name,
    column,
    page,
    filterType,
    qualification,
    filterArea,
    filterTime,
    fromDate,
    toDate,
    designers,
    cms,
    gms,
    sms,
    search?
  ) {
    console.log("hello")
    var obj = {
      from_date: fromDate,
      to_date: toDate,
      data_scope: filterArea,
      time_duration: filterTime,
      digital_physical: filterType,
      date_filter_type: qualification,
      cm: cms,
      gm: gms,
      sm: sms,
      designers: designers,
      column_name: column,
      row_name: row_name,
    };
    var obj2 = JSON.stringify(obj);
    var url =
      environment.apiBaseUrl +
      "/v1/leads/gm_dashboard_data?filter_params=" +
      obj2 +
      "&page=" +
      page +
      "&search=" +
      search;
    let params: URLSearchParams = new URLSearchParams();
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  downloadExcelGmData(
    row_name,
    column,
    page,
    filterType,
    qualification,
    filterArea,
    filterTime,
    fromDate,
    toDate,
    designers,
    cms,
    gms,
    sms,
    search?
  ) {
    var obj = {
      from_date: fromDate,
      to_date: toDate,
      data_scope: filterArea,
      time_duration: filterTime,
      digital_physical: filterType,
      date_filter_type: qualification,
      cm: cms,
      gm: gms,
      sm: sms,
      designers: designers,
      column_name: column,
      row_name: row_name,
    };
    var obj2 = JSON.stringify(obj);
    let url =
      environment.apiBaseUrl +
      "/v1/leads/gm_dashboard_excel_report?filter_params=" +
      obj2 +
      "&page=" +
      page +
      "&search=" +
      search;
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

  getServicePackages(
    currentPage,
    value,
    status?,
    category_id?,
    projectId?,
    gmid?
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/service_packages?status=" +
      status +
      "&search=" +
      value +
      "&page=" +
      currentPage +
      "&service_package_category_id=" +
      category_id +
      "&project_id=" +
      projectId +
      "&gm_id=" +
      gmid;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getSerivcesPackagesUnits() {
    let url = environment.apiBaseUrl + "/v1/service_packages/list_units";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSerivcesPackagesCategories() {
    let url =
      environment.apiBaseUrl +
      "/v1/service_packages/list_service_package_categories";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createServicesPackages(value, image) {
    let url = environment.apiBaseUrl + "/v1/service_packages";
    let formdata = new FormData();
    formdata.append("service_package[name]", value.name);
    formdata.append("service_package[unique_sku]", value.promo_code);
    formdata.append("service_package[description]", value.description);
    formdata.append("service_package[unit]", value.units);
    formdata.append("service_package[rate]", value.promo_value);
    formdata.append(
      "service_package[service_package_category_id]",
      value.category
    );
    if (image && image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        formdata.append(
          "service_package[service_package_images_attributes]" +
            [i] +
            "[image]",
          image[i]
        );
      }
    }
    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchServicePackage(id) {
    let url = environment.apiBaseUrl + "/v1/service_packages/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateServicePackage(value, id, image) {
    let url = environment.apiBaseUrl + "/v1/service_packages/" + id;
    let formdata = new FormData();
    formdata.append("service_package[name]", value.name);
    formdata.append("service_package[unique_sku]", value.promo_code);
    formdata.append("service_package[description]", value.description);
    formdata.append("service_package[unit]", value.units);
    formdata.append("service_package[rate]", value.promo_value);
    formdata.append(
      "service_package[service_package_category_id]",
      value.category
    );
    if (image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        formdata.append(
          "service_package[service_package_images_attributes]" +
            [i] +
            "[image]",
          image[i]
        );
      }
    }

    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateServicePackageStatus(id, value) {
    let url =
      environment.apiBaseUrl + "/v1/service_packages/" + id + "/change_status";
    let formdata = new FormData();
    formdata.append("status", value);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addServicePackage(
    package_id,
    package_quantity,
    projectId,
    quotation_id,
    space
  ) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotation_id +
      "/add_service_package_job";
    let formdata = new FormData();
    formdata.append("service_package[id]", package_id);
    formdata.append("service_package[quantity]", package_quantity);
    formdata.append("service_package[space]", space);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateServicePackageQunatity(quotation_id, projectId, id, quantity) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotation_id +
      "/edit_service_package_job";
    let formdata = new FormData();
    formdata.append("service_package[quantity]", quantity);
    formdata.append("service_job_id", id);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteServicePackageToSpace(projectId, quotID, id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotID +
      "/delete_service_jobs";
    let formdata = new FormData();
    formdata.append("ids", id);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getAllStoresByrole() {
    let url = environment.apiBaseUrl + "/v1/stores/get_stores_by_role";
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




  orderPipeLineData(id){
    let url = environment.apiBaseUrl + '/v1/projects/boq_order_pipeline_dates?lead_id=' + id 
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

  getListofGm() {
    let url = environment.apiBaseUrl + "/v1/service_packages/list_of_GM";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  assignpackagegm(id, gm) {
    let url =
      environment.apiBaseUrl +
      "/v1/service_packages/" +
      id +
      "/change_gm?" +
      "gm_id=" +
      gm;
    var obj = {};
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllusers() {
    
    let url =
      environment.apiBaseUrl + "/v1/leads/city_gm_cm_and_designer?gm=&cm=";
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
  getAllusers2(gm, cm) {
    if (gm == undefined) {
      gm = "";
    }
    if (cm == undefined) {
      cm = "";
    }
   
    let url =
      environment.apiBaseUrl +
      "/v1/leads/city_gm_cm_and_designer?gm=" +
      gm +
      "&cm=" +
      cm;
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
}
