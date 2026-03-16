import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service'; 
import { environment } from '../../../../environments/environment';

@Injectable()
export class PortfolioService {
  options: RequestOptions;
  
  private portfoliotUrl = environment.apiBaseUrl + '/v1/portfolios';
  

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) {
      this.options = this.authService.getHeaders();
   }
  
  private extractDataPage(res:Response){
    return res;
  }

   private extractData(res: Response) {
      let body = res.json();
      return body;
    }

    private handleErrorObservable (error: Response | any) {
      return Observable.throw(error.message || error);
    }

    getPortFolioList(search_string: any,page:any,perpage:any){
      let url = environment.apiBaseUrl +"/v1/portfolios/filter_portfolios_list?page="+page+"&per_page="+perpage+"&search="+search_string+"&sort_column=price_cents"+"&sort_order=";
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }
    getallapartments(page,search){
      search = search?search:"";
      let url = environment.apiBaseUrl+"/v1/apartments?page="+page+"&search="+search;
      return this.http.get(url,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }

    deletePortfolio(id:number) {
       let url = this.portfoliotUrl + '/'+id
       return this.http.delete(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    editPortapartment(obj) {
       let url = environment.apiBaseUrl+"/v1/apartments/update_apartment"
       return this.http.patch(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }
    deleteapartment(data:any) {
      let url =  environment.apiBaseUrl+"/v1/apartments/delete_apartment?unid="+data
      return this.http.delete(url,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
   }

   editPortfolio(id:number,param:any) {
      let url = this.portfoliotUrl + '/'+id
      return this.http.patch(url,param,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
   }

    viewPortfolioData(id:number) {
       let url = this.portfoliotUrl + '/'+id
       return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }
    viewapartmentData(id:number) {
      let url = environment.apiBaseUrl +'/v1/apartments/view_apartment?unid='+id
      return this.http.get(url,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
   }
  
  getLifeStage() {
    let url = environment.apiBaseUrl + '/v1/lifestages'
    return this.http.get(url,this.options)
   .map(this.extractData)
   .catch(this.handleErrorObservable);
  }
  
  getOther(selected_space) {
    let url = environment.apiBaseUrl + '/v1/portfolios/space_items?space='+selected_space
    // let url = 'https://1bab62864384.ngrok.io/v1/portfolios/space_items?space=' + selected_space;
    return this.http.get(url,this.options)
   .map(this.extractData)
   .catch(this.handleErrorObservable);
  }


  getPortfolioList(current_page: any,spaceName: string, lifeStage: string, theme: string, range: any, per_page: any, search_string: any) {
    let url = environment.apiBaseUrl + '/v1/portfolios?space=' + spaceName + '&lifestage=' + lifeStage + '&element&theme=' + theme + '&range=' + range + '&page=' + current_page + '&per_page=' +
      per_page + '&search=' + search_string + '&with_preset_id=true';
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable)
  }
   
   updatednewportfoliolist(current_page: any,spaceName: any, lifeStage: string, theme: string, range: any, per_page: any, search_string: any , space_shape:any , area_range :any, is_favourt:any , is_segment:any,presettype:any , is_featured:any, sort_by_area:any, sort_by_price:any,newlast:any, popular:any, bestseller:any , categoryprice,selected_preset_ids?,page_size?) {
   
    
     let url = environment.apiBaseUrl + '/v1/portfolios?space=' + spaceName + 
     '&lifestage=' + lifeStage + 
     '&element=' + '&theme=' + theme + 
     '&price_range_filter=' + range + 
     '&page=' + current_page + 
     '&per_page=' + per_page + 
     '&shape=' + space_shape + 
     '&area_range_filter=' + area_range + 
     '&favourite=' + is_favourt + 
     '&segment=' + is_segment +
      '&search=' + search_string + '&with_preset_id=true' +
      '&is_featured=' + is_featured + 
      '&area=' + sort_by_area + 
      '&price=' + sort_by_price + 
      '&type=' + presettype + 
      '&new=' + newlast + 
      '&popular=' + popular + 
      '&bestseller=' + bestseller + 
      '&price_category=' + categoryprice +
      '&selected_preset_ids=' + selected_preset_ids +
      '&page_size='+ page_size;
     return this.http.get(url, this.options)
       .map(this.extractDataPage)
       .catch(this.handleErrorObservable)
   }
   AddFavouriteIconPreset(id , status){
    let url = environment.apiBaseUrl + '/v1/portfolios/' + id + "/update_favourite"
    let data = {
      favourite : status
    }
    return this.http.patch(url, data, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable)
   }

// {{url}}/v1/projects/35604/quotations/change_status_for_approval_request_for_boq


   approveRejectBuApproval(status , id,projectid){
    let data = {
      quotation_id : id,
      boq_status : status
    }
    let url = environment.apiBaseUrl + '/v1/projects/' + projectid +  '/quotations/change_status_for_approval_request_for_boq'
    return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
   getSimilarSpaces(id, page ,perpage){
      let url = environment.apiBaseUrl + '/v1/portfolios/' + id + "/similar_spaces?page=" + page + "&per_page=" + perpage
      return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable)
   }
   getOrtherSpaces(id , page , perpage){
    let url = environment.apiBaseUrl + '/v1/portfolios/' + id + "/all_other_spaces?page=" + page + "&per_page=" +  perpage
    return this.http.get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable)
 }
   getPortfolioListof(search_string: any,page:any,perpage:any, price:any, segment:any, state:any, space:any) {
    let url = environment.apiBaseUrl +"/v1/portfolios/filter_portfolios_list?page="+page+"&per_page="+perpage+"&search="+search_string+"&sort_column=&sort_order=&space="+space+"&segment="+segment+"&status="+state+"&price="+price
   
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable)
  }

  updateBuheadAcess(id) {
    let url = environment.apiBaseUrl +"/v1/portfolios/" + id + "/update_bu_head_access"
    let data = []
    return this.http.patch(url, data, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable)
  }

  updateStatusActiveInActive(id , status) {
    let url = environment.apiBaseUrl +"/v1/portfolios/" + id + "/update_status"
    let data = {
      status : status
    }
    return this.http.patch(url, data, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable)
  }

   
  
   getPortfolios(id: any) {
    let url = environment.apiBaseUrl + '/v1/portfolios/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable)
   }
  
   getBoqValues(serachString:any,space,id) {
    let url = environment.apiBaseUrl + '/v1/quotations/search_quotation?search=' + serachString+'&space='+space+'&apartment_id='+id;
     return this.http.get(url, this.options)
       .map(this.extractData)
       .catch(this.handleErrorObservable)
   }

   promojobs(id){
// https://newuatapi.arrivae.com//v1/projects/{project_id}/quotations/run_tat_job
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/quotations/run_tat_job'
    return this.http.get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)

   }
  
  getCities() {
    let url = environment.apiBaseUrl + '/v1/cities';
    return this.http.get(url, this.options)
     .map(this.extractData)
    .catch(this.handleErrorObservable)
  }
  
  getLocalityBuildingDetails(city_name, search) {
    let url = environment.apiBaseUrl + '/v1/apartments?city=' + city_name + '&search=' + search;
    return this.http.get(url, this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable)
  }

  flatsizetype(unid: any) {
    let url = environment.apiBaseUrl + "/v1/apartments/apartment_varients?unid=" + unid;
    return this.http.get(url, this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable)
  }

  getVarientDetails(unid: any, format: any) {
    let url = environment.apiBaseUrl + "/v1/apartments/apartment_varient_details?unid=" + unid + '&format=' + format;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable)
  }

  deletePortfolioContent(id: any) {
    let url = environment.apiBaseUrl + "/v1/contents/" + id;
    return this.http.delete(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getStateList() {
    let url = environment.apiBaseUrl + "/v1/cities/get_state_list";
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getApartmentCity(code: any) {
    let url = environment.apiBaseUrl + "/v1/cities/get_cities_list_from_state?state_code="+code;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFilterData() {
    let url = environment.apiBaseUrl + "/v1/apartments/filter_datas";
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFormatData() {
    let url = environment.apiBaseUrl + "/v1/apartments/apartment_format_datas";
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createApartment(obj) {
    let url = environment.apiBaseUrl + "/v1/apartments";
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  Deletevarients(ids){
    ids = ids.join(',')
    let url = environment.apiBaseUrl + "/v1/apartments/delete_variant?ids="+ids ;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  DeleteFormat(format,unid){

    let url = environment.apiBaseUrl + "/v1/apartments/delete_format?format="+format+"&unid="+unid ;
    return this.http
    .delete(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
}



