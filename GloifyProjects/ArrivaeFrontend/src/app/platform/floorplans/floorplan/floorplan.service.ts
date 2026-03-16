import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { Floorplan } from './floorplan';
import { environment } from '../../../../environments/environment';


@Injectable()
export class FloorplanService {
  options: RequestOptions;

  private floorplanUrl = environment.apiBaseUrl + "/v1/projects";

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

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

  createFloorplan(id: Number, floorplan: any): Observable<Floorplan> {
    let url = this.floorplanUrl + "/" + id + "/floorplans";

    return this.http
      .post(url, floorplan, this.options)
      .map((res: Response) => res.json());
  }

  postWithFile(
    id: Number,
    floorplan: any,
    files: File[],
    file_name
  ): Observable<Floorplan> {
    let url = this.floorplanUrl + "/" + id + "/floorplans";
    let obj = {
      floorplan: {
        name: floorplan.name,
        details: floorplan.details,
        file_name: file_name,
        attachment_file: files,
      },
    };

    let formData = new FormData();

// Append key-value pairs to FormData
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    if (typeof obj[key] === "object") {
      for (let nestedKey in obj[key]) {
        if (obj[key].hasOwnProperty(nestedKey)) {
          formData.append(`floorplan[${nestedKey}]`, obj[key][nestedKey]);
        }
      }
    } else {
      formData.append(key, obj[key]);
    }
  }
}

    return this.http
      .post(url, formData, this.options)
      .map((res: Response) => res.json());
  }

  listFloorplan(id: Number): Observable<Floorplan[]> {
    let url = this.floorplanUrl + "/" + id + "/floorplans";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  viewFloorplanDetails(id: Number, fpid: Number): Observable<Floorplan[]> {
    let url = this.floorplanUrl + "/" + id + "/floorplans/" + fpid;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteFloorPlan(id: Number, fpid: Number): Observable<Floorplan[]> {
    let url = this.floorplanUrl + "/" + id + "/floorplans/" + fpid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateFloorPlan(
    id: Number,
    fpid: Number,
    params: any,
    files: File[]
  ): Observable<Floorplan[]> {
    let url = this.floorplanUrl + "/" + id + "/floorplans/" + fpid;
    let obj = {
      floorplan: {
        name: params.name,
        details: params.details,
        attachment_file: files,
      },
    };

    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  postWithFileMTO(id, name, details, file): Observable<Floorplan> {
    let url = this.floorplanUrl + "/" + id + "/mto_uploads";
    let formdata = new FormData();
    formdata.append("mto_uploads[name]", name);
    formdata.append("mto_uploads[details]", details);
    formdata.append("mto_uploads[project_id]", id);
    formdata.append("mto_uploads[attachment_file]", file);

    return this.http
      .post(url, formdata, this.options)
      .map((res: Response) => res.json());
  }
  deletemto(id: Number, fpid: Number): Observable<Floorplan[]> {
    let url = this.floorplanUrl + "/" + id + "/mto_uploads/" + fpid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getspaces(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/project_handovers/get_all_spaces_department_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getspacesstatic() {
    let url = environment.apiBaseUrl + "/v1/boq_global_configs/list_of_spaces";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
}
