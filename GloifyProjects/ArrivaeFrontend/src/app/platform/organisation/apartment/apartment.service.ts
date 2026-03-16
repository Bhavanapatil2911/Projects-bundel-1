import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Angular2TokenService } from 'angular2-token';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from '../../../../environments/environment';


@Injectable()
export class ApartmentService {

  options: RequestOptions;

  
  constructor(
  	private http: Http,
  	private tokenService: Angular2TokenService,
  	private authService: AuthService ) {

  	this.options = this.authService.getHeaders();
  }

 private extractData(res: Response) {
    let body = res.json();
    return body;
  }

private handleErrorObservable (error: Response | any) {
  return Observable.throw(error.message || error);
}

uploadApartment_Zipfolder( basefile) {
  let uploadApartmentfile = environment.apiBaseUrl+'/v1/apartments/import_apartments_data';
  let  postdata = {  apartments_data : basefile  }
  return this.http.post( uploadApartmentfile, postdata, this.options).map(this.extractData).catch(this.handleErrorObservable);
}

}
