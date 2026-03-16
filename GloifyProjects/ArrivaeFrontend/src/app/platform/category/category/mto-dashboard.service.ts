import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams,
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../../../authentication/auth.service";
import { environment } from "../../../../environments/environment";

@Injectable()
export class MtoDashboardService {
  options: RequestOptions;

  constructor(
    private http: Http,
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

  downloadMtoExcelMain(search, fromdate, todate, type, status) {
    let url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/get_mto_po_data?send_file=true&type=mto&search=" +
      search +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate +
      "&filter_by=" +
      type +
      "&status=" +
      status;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
}
