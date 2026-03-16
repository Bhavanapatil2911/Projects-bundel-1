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
import { HttpParams } from "@angular/common/http";
import { Options } from "selenium-webdriver/firefox";


@Injectable()
export class CategoryService {
  options: RequestOptions;

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) {
    this.options = this.authService.getHeaders();
  }

  private extractDataPage(res: Response) {
    return res;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private extractDataOne(res: Response) {
    let body = res;
    return body;
  }

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

  addbrand(data) {
    var url = environment.apiBaseUrl + "/v1/brands";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listbrands() {
    var url = environment.apiBaseUrl + "/v1/brands";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateBrand(data, brandId) {
    var url = environment.apiBaseUrl + "/v1/brands/" + brandId;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteBrand(brandId) {
    var url = environment.apiBaseUrl + "/v1/brands/" + brandId;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfBrand(brandId) {
    var url = environment.apiBaseUrl + "/v1/brands/" + brandId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addCoreMateial(data) {
    var url = environment.apiBaseUrl + "/v1/core_materials";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCoreMateial() {
    var url = environment.apiBaseUrl + "/v1/core_materials";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCoreMaterials(data, materialId) {
    var url = environment.apiBaseUrl + "/v1/core_materials/" + materialId;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCoreMaterials(materialId) {
    var url = environment.apiBaseUrl + "/v1/core_materials/" + materialId;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getListPO(
    search,
    fromdate,
    todate,
    currentpage,
    status,
    type,
    postatus,
    category,
    po_release_type,
    filterAidevalue,
    ServiceBoq
  ) {

   

    if(ServiceBoq =='service' ){
      ServiceBoq = true
    } else{
      ServiceBoq = ''
    }
    if (postatus == undefined) {
      postatus = "";
    }
    if (category == undefined) {
      category = "";
    }
    if (po_release_type == undefined) {
      po_release_type = "";
    }
    if(filterAidevalue == undefined){
      filterAidevalue =""
    }
    console.log(ServiceBoq)
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders?search=" +
      search +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate +
      "&page=" +
      currentpage +
      "&perpage=15&status=" +
      status +
      "&provider="+
      filterAidevalue +
      "&filter_by=" +
      type +
      "&po_filter=" +
      postatus +
      "&category=" +
      category +
      "&po_release_type=" +
      po_release_type+"&service="+ServiceBoq
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getListPObulk(
    search,
    fromdate,
    todate,
    currentpage,
    status,
    type,
    postatus,
    poRelStatus
  ) {
    if (postatus == undefined) {
      postatus = "";
    }
    if (poRelStatus == undefined) {
      poRelStatus = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/get_bulk_po_data?type=maintenance&" +
      "search=" +
      search +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate +
      "&page=" +
      currentpage +
      "&perpage=15&status=" +
      status +
      "&filter_by=" +
      type +
      "&po_filter=" +
      postatus +
      "&po_release_type=" +
      poRelStatus;

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfCoreMaterials(materialId) {
    var url = environment.apiBaseUrl + "/v1/core_materials/" + materialId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getDetailsOfpreview(poid) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      poid +
      "/purchase_order_view";
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }
  lineItemsforPo(quoatation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/line_items_for_po?quotation_id=" +
      quoatation_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addShutter_finishes(data) {
    var url = environment.apiBaseUrl + "/v1/shutter_finishes";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
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
  getPoDetails(leadId) {
    let url =
      environment.apiBaseUrl + "/v1/lead_nocs/boq_details?lead_id=" + leadId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadExcell(search, fromdate, todate, type, status, postatus, category,provider) {
    if (postatus == undefined) {
      postatus = "";
    }
    if (category == undefined) {
      category = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders?search=" +
      search +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate +
      "&filter_by=" +
      type +
      "&send_file=true" +
      "&status=" +
      status +
      "&provider=" +
       provider +
      "&po_filter=" +
      postatus +
      "&category=" +
      category;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  BulkApproveRetail() {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/retails_po_payment_approval";
    return this.http
      .post(url, [], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  BulkApproveMaintenance(po_type) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/bulk_po_payment_approval?po_type=" +
      po_type;
    return this.http
      .post(url, [], this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ApproveSecondPhaseRetail(pi_ids) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/multiple_retail_payment_approval?pi_ids=" +
      pi_ids;
    return this.http
      .post(url, pi_ids, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  RejectSecondPhaseRetail(pi_ids_reject) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/multiple_retail_payment_reject?pi_ids=" +
      pi_ids_reject;
    return this.http
      .post(url, pi_ids_reject, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ApproveSecondPhasemto(pi_ids) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/multiple_bulk_payment_approval?pi_ids=" +
      pi_ids +
      "&po_type=mto";
    return this.http
      .post(url, pi_ids, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  RejectSecondPhasemto(pi_ids_reject) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/multiple_bulk_payment_reject?pi_ids=" +
      pi_ids_reject +
      "&po_type=mto";
    return this.http
      .post(url, pi_ids_reject, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ApproveSecondPhaseMaintaince(pi_ids) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/multiple_bulk_payment_approval?pi_ids=" +
      pi_ids;
    return this.http
      .post(url, pi_ids, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  RejectSecondMaintaince(pi_ids_reject) {
    let url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/multiple_bulk_payment_reject?pi_ids=" +
      pi_ids_reject;
    return this.http
      .post(url, pi_ids_reject, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadretailreportmain() {
    let url =
      environment.apiBaseUrl + "/v1/purchase_orders/retail_line_item_export";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadmaintenancemain() {
    let url =
      environment.apiBaseUrl + "/v1/po_wip_orders/maintenance_line_item_export";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadmtomain() {
    let url = environment.apiBaseUrl + "/v1/po_wip_orders/mto_line_item_export";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadExcellmain(search, fromdate, todate, type, status, postatus,porealse) {
    if (postatus == undefined) {
      postatus = "";
    }
    if (porealse == undefined) {
      porealse = "";
    }
    let url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/get_bulk_po_data?send_file=true&type=maintenance&search=" +
      search +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate +
      "&filter_by=" +
      type +
      "&status=" +
      status +
      "&po_filter=" +
      postatus+"&po_release_type="+
      porealse
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listShutter_finishes() {
    var url = environment.apiBaseUrl + "/v1/shutter_finishes";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateShutter_finishes(data, id) {
    var url = environment.apiBaseUrl + "/v1/shutter_finishes/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteShutter_finishes(id) {
    var url = environment.apiBaseUrl + "/v1/shutter_finishes/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfShutter_finishes(id) {
    var url = environment.apiBaseUrl + "/v1/shutter_finishes/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addShades(data) {
    var url = environment.apiBaseUrl + "/v1/shades";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listShades() {
    var url = environment.apiBaseUrl + "/v1/shades";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateShades(data, id) {
    var url = environment.apiBaseUrl + "/v1/shades/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteShades(id) {
    var url = environment.apiBaseUrl + "/v1/shades/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfShades(id) {
    var url = environment.apiBaseUrl + "/v1/shades/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addSkirting_configs(data) {
    var url = environment.apiBaseUrl + "/v1/skirting_configs";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listSkirting_configs() {
    var url = environment.apiBaseUrl + "/v1/skirting_configs";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateSkirting_configs(data, id) {
    var url = environment.apiBaseUrl + "/v1/skirting_configs/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSkirting_configs(id) {
    var url = environment.apiBaseUrl + "/v1/skirting_configs/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfSkirting_configs(id) {
    var url = environment.apiBaseUrl + "/v1/skirting_configs/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addModule_types(data) {
    var url = environment.apiBaseUrl + "/v1/module_types";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listModule_types() {
    var url = environment.apiBaseUrl + "/v1/module_types";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateModule_types(data, id) {
    var url = environment.apiBaseUrl + "/v1/module_types/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteModule_types(id) {
    var url = environment.apiBaseUrl + "/v1/module_types/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfModule_types(id) {
    var url = environment.apiBaseUrl + "/v1/module_types/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  addhandles(data) {
    var url = environment.apiBaseUrl + "/v1/handles";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listhandles() {
    var url = environment.apiBaseUrl + "/v1/handles";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatehandles(data, id) {
    var url = environment.apiBaseUrl + "/v1/handles/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletehandles(id) {
    var url = environment.apiBaseUrl + "/v1/handles/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfhandles(id) {
    var url = environment.apiBaseUrl + "/v1/handles/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addhardware_types(data) {
    var url = environment.apiBaseUrl + "/v1/hardware_types";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listhardware_types() {
    var url = environment.apiBaseUrl + "/v1/hardware_types";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCategoryFilteredhardware_types(category) {
    var url =
      environment.apiBaseUrl + "/v1/hardware_types?category=" + category;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatehardware_types(data, id) {
    var url = environment.apiBaseUrl + "/v1/hardware_types/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletehardware_types(id) {
    var url = environment.apiBaseUrl + "/v1/hardware_types/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfhardware_types(id) {
    var url = environment.apiBaseUrl + "/v1/hardware_types/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // Hardware Elements

  addhardware_elements(data) {
    var url = environment.apiBaseUrl + "/v1/hardware_elements";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listhardware_elements() {
    var url = environment.apiBaseUrl + "/v1/hardware_elements";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatehardware_elements(data, id) {
    var url = environment.apiBaseUrl + "/v1/hardware_elements/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletehardware_elements(id) {
    var url = environment.apiBaseUrl + "/v1/hardware_elements/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfhardware_elements(id) {
    var url = environment.apiBaseUrl + "/v1/hardware_elements/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // Carcass Elements

  addcarcass_elements(data) {
    var url = environment.apiBaseUrl + "/v1/carcass_elements";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listcarcass_elements() {
    var url = environment.apiBaseUrl + "/v1/carcass_elements";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatecarcass_elements(data, id) {
    var url = environment.apiBaseUrl + "/v1/carcass_elements/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletecarcass_elements(id) {
    var url = environment.apiBaseUrl + "/v1/carcass_elements/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfcarcass_elements(id) {
    var url = environment.apiBaseUrl + "/v1/carcass_elements/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addaddon(data) {
    var url = environment.apiBaseUrl + "/v1/addons";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listaddons() {
    var url = environment.apiBaseUrl + "/v1/addons";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateaddon(data, id) {
    var url = environment.apiBaseUrl + "/v1/addons/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteaddon(id) {
    var url = environment.apiBaseUrl + "/v1/addons/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfaddon(id) {
    var url = environment.apiBaseUrl + "/v1/addons/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addcombinedDoor(data) {
    var url = environment.apiBaseUrl + "/v1/combined_doors";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCombined_doors() {
    var url = environment.apiBaseUrl + "/v1/combined_doors";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCombined_door(data, id) {
    var url = environment.apiBaseUrl + "/v1/combined_doors/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCombined_door(id) {
    var url = environment.apiBaseUrl + "/v1/combined_doors/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfCombined_door(id) {
    var url = environment.apiBaseUrl + "/v1/combined_doors/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addHardware_element_types(data) {
    var url = environment.apiBaseUrl + "/v1/hardware_element_types";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listHardware_element_types() {
    var url = environment.apiBaseUrl + "/v1/hardware_element_types";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCategoryFilteredHardware_element_types(category) {
    var url =
      environment.apiBaseUrl +
      "/v1/hardware_element_types?category=" +
      category;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateHardware_element_types(data, id) {
    var url = environment.apiBaseUrl + "/v1/hardware_element_types/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteHardware_element_types(id) {
    var url = environment.apiBaseUrl + "/v1/hardware_element_types/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfHardware_elemtype(id) {
    var url = environment.apiBaseUrl + "/v1/hardware_element_types/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addCarcass_element_types(data) {
    var url = environment.apiBaseUrl + "/v1/carcass_element_types";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCarcass_element_types() {
    var url = environment.apiBaseUrl + "/v1/carcass_element_types";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCarcass_element_types(data, id) {
    var url = environment.apiBaseUrl + "/v1/carcass_element_types/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCarcass_element_types(id) {
    var url = environment.apiBaseUrl + "/v1/carcass_element_types/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCarcass_elements(category) {
    var url =
      environment.apiBaseUrl + "/v1/carcass_elements?category=" + category;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listHardware_elements(category) {
    var url =
      environment.apiBaseUrl + "/v1/hardware_elements?category=" + category;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfCarcass_elemtype(id) {
    var url = environment.apiBaseUrl + "/v1/carcass_element_types/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addCategories(data) {
    var url = environment.apiBaseUrl + "/v1/kitchen_categories";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCategories() {
    var url = environment.apiBaseUrl + "/v1/kitchen_categories";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCategories(data, id) {
    var url = environment.apiBaseUrl + "/v1/kitchen_categories/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCategories(id) {
    var url = environment.apiBaseUrl + "/v1/kitchen_categories/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addCoreMaterialPrices(data) {
    var url = environment.apiBaseUrl + "/v1/core_material_prices";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCoreMaterialPrices() {
    var url = environment.apiBaseUrl + "/v1/core_material_prices";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCoreMaterialPrices(data, id) {
    var url = environment.apiBaseUrl + "/v1/core_material_prices/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCoreMaterialPrices(id) {
    var url = environment.apiBaseUrl + "/v1/core_material_prices/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfCategories(id) {
    var url = environment.apiBaseUrl + "/v1/kitchen_categories/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addCustomElement(data) {
    var url = environment.apiBaseUrl + "/v1/custom_elements";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listCustomElement() {
    var url = environment.apiBaseUrl + "/v1/custom_elements";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCustomElement(data, id) {
    var url = environment.apiBaseUrl + "/v1/custom_elements/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCustomElement(id) {
    var url = environment.apiBaseUrl + "/v1/custom_elements/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfCustomElement(id) {
    var url = environment.apiBaseUrl + "/v1/custom_elements/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  shadesShutterFinishMapping() {
    var mappingUrl =
      environment.apiBaseUrl + "/v1/shutter_finishes/shades_mapping";
    return this.http
      .get(mappingUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  coreMaterialShutterFinishMapping() {
    var mappingUrl =
      environment.apiBaseUrl + "/v1/shutter_finishes/core_material_mapping";
    return this.http
      .get(mappingUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  moduleAddonsMapping() {
    var mappingUrl =
      environment.apiBaseUrl + "/v1/product_modules/addons_mapping";
    return this.http
      .get(mappingUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  kitchenAddonsMapping(product_module_id) {
    var mappingUrl =
      environment.apiBaseUrl +
      "/v1/product_modules/" +
      product_module_id +
      "/kitchen_module_addon";
    return this.http
      .get(mappingUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  kitchenModuleMapping() {
    var mappingUrl =
      environment.apiBaseUrl + "/v1/kitchen_categories/kitchen_module_mapping";
    return this.http
      .get(mappingUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchShades() {
    var shadesUrl = environment.apiBaseUrl + "/v1/shades";
    return this.http
      .get(shadesUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchShutter() {
    var shutterUrl = environment.apiBaseUrl + "/v1/shutter_finishes";
    return this.http
      .get(shutterUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchAddon(category = null) {
    if (category == null) {
      var addonUrl = environment.apiBaseUrl + "/v1/addons";
    } else {
      var addonUrl = environment.apiBaseUrl + "/v1/addons?category=" + category;
    }
    return this.http
      .get(addonUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchModuleType(category = "kitchen") {
    var moduleTypeUrl =
      environment.apiBaseUrl + "/v1/module_types?category=" + category;
    return this.http
      .get(moduleTypeUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchProductModule(category) {
    var moduleTypeUrl =
      environment.apiBaseUrl + "/v1/product_modules?category=" + category;
    return this.http
      .get(moduleTypeUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  submitMapping(obj, active_selection) {
    if (active_selection == "shades_shutter_finish") {
      var url = environment.apiBaseUrl + "/v1/shutter_finishes/shades_mapping";
    } else if (active_selection == "core_material_shutter") {
      var url =
        environment.apiBaseUrl + "/v1/shutter_finishes/core_material_mapping";
    } else if (active_selection == "module_addons") {
      var url = environment.apiBaseUrl + "/v1/product_modules/addons_mapping";
    } else if (active_selection == "kitchen_category_module_type") {
      var url =
        environment.apiBaseUrl +
        "/v1/kitchen_categories/kitchen_module_mapping";
    } else if (active_selection == "kitchen_module_addons") {
      var url =
        environment.apiBaseUrl + "/v1/product_modules/kitchen_module_addon";
    }
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createModule(data) {
    var url = environment.apiBaseUrl + "/v1/product_modules";
    var obj = {
      product_module: data,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listModules() {
    var url = environment.apiBaseUrl + "/v1/product_modules";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateModules(data, id) {
    var url = environment.apiBaseUrl + "/v1/product_modules/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteModules(id) {
    var url = environment.apiBaseUrl + "/v1/product_modules/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //  method to get wip projects for category role
  getWipProjectList() {
    var url = environment.apiBaseUrl + "/v1/users/wip_leads_for_category";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getApprovedBoqList(projectId, proposal_type) {
    var url =
      environment.apiBaseUrl +
      "/v1/proposals/category_boqs_of_project?project_id=" +
      projectId +
      "&proposal_type=" +
      proposal_type;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listEdgebandingShades() {
    var url = environment.apiBaseUrl + "/v1/edge_banding_shades";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addEdgebandingShades(data) {
    var url = environment.apiBaseUrl + "/v1/edge_banding_shades";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateEdgebandingShades(data, id) {
    var url = environment.apiBaseUrl + "/v1/edge_banding_shades/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteEdgebandingShades(id) {
    var url = environment.apiBaseUrl + "/v1/edge_banding_shades/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfEdgebandingShades(id) {
    var url = environment.apiBaseUrl + "/v1/edge_banding_shades/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getCustomElements(projectId) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/custom_elements";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  addCustomPrice(data, customId, projectId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/custom_elements/" +
      customId +
      "/add_custom_element_price";

    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addServiceCategory(data) {
    var url = environment.apiBaseUrl + "/v1/service_categories";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listService_categories() {
    var url = environment.apiBaseUrl + "/v1/service_categories";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateService_categories(data, id) {
    var url = environment.apiBaseUrl + "/v1/service_categories/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteService_categories(id) {
    var url = environment.apiBaseUrl + "/v1/service_categories/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfService_categories(id) {
    var url = environment.apiBaseUrl + "/v1/service_categories/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addService_subcategories(data) {
    var url = environment.apiBaseUrl + "/v1/service_subcategories";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listService_subcategories(service_category_id?) {
    var url =
      environment.apiBaseUrl +
      "/v1/service_subcategories?service_category_id=" +
      service_category_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateService_subcategories(data, id) {
    var url = environment.apiBaseUrl + "/v1/service_subcategories/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteService_subcategories(id) {
    var url = environment.apiBaseUrl + "/v1/service_subcategories/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfService_subcategories(id) {
    var url = environment.apiBaseUrl + "/v1/service_subcategories/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addService_activities(data) {
    var url = environment.apiBaseUrl + "/v1/service_activities";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listService_activities() {
    var url = environment.apiBaseUrl + "/v1/service_activities";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateService_activities(data, id) {
    var url = environment.apiBaseUrl + "/v1/service_activities/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteService_activities(id) {
    var url = environment.apiBaseUrl + "/v1/service_activities/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfService_activities(id) {
    var url = environment.apiBaseUrl + "/v1/service_activities/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addKitchen_appliances(data) {
    var url = environment.apiBaseUrl + "/v1/kitchen_appliances";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listKitchen_appliances() {
    var url = environment.apiBaseUrl + "/v1/kitchen_appliances";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateKitchen_appliances(data, id) {
    var url = environment.apiBaseUrl + "/v1/kitchen_appliances/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteKitchen_appliances(id) {
    var url = environment.apiBaseUrl + "/v1/kitchen_appliances/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfKitchen_appliances(id) {
    var url = environment.apiBaseUrl + "/v1/kitchen_appliances/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getModuletypeForKitchen_appliances() {
    var url = environment.apiBaseUrl + "/v1/module_types/appliance_types";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchFloorplan(project_id) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + project_id + "/floorplans";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchCad(project_id) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + project_id + "/cad_drawings";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listaddontags() {
    var url = environment.apiBaseUrl + "/v1/tags";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addAddontags(data) {
    var url = environment.apiBaseUrl + "/v1/tags";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateAddontags(data, id) {
    var url = environment.apiBaseUrl + "/v1/tags/" + id;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteAddontags(id) {
    var url = environment.apiBaseUrl + "/v1/tags/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfAddontags(id) {
    var url = environment.apiBaseUrl + "/v1/tags/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateAddontagOfAddon(data, addonid) {
    var url = environment.apiBaseUrl + "/v1/addons/" + addonid + "/update_tags";
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorCategories() {
    var url = environment.apiBaseUrl + "/v1/vendors/get_vendor_categories";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSubcategoryList(value) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_vendor_sub_categories?parent_category_id=" +
      value;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getCities() {
    var url = environment.apiBaseUrl + "/v1/cities";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  postVendorForm(
    data,
    basefile_gst,
    basefile_pan,
    basefile_cheque,
    dd_upload_attachments,
    agreement_copy
  ) {
    data["pan_copy"] = basefile_pan;
    data["gst_attachments"] = basefile_gst;
    data["cancelled_cheque"] = basefile_cheque;
    data["dd_upload_attachments"] = dd_upload_attachments;
    data["aggrement_copy"] = agreement_copy;

    var obj = {
      vendor: data,
      sub_category_ids: data["sub_category_ids"],
      serviceable_city_ids: data["serviceable_city_ids"],
    };
    console.log(obj);
    var url = environment.apiBaseUrl + "/v1/vendors";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  deleteVendor(vendorId) {
    var url = environment.apiBaseUrl + "/v1/vendors/" + vendorId;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getVendorList(page?, search?, status?, filterValue?) {
    var url = environment.apiBaseUrl + "/v1/vendors";
    var params: URLSearchParams = new URLSearchParams();
    params.set("search", search);
    params.set("page", page);
    params.set("filter_by_type", status);
    params.set("filter_by_id", filterValue);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getVendorDetails(value, selectedTab?) {
    var url;
    if (selectedTab && selectedTab == "pending") {
      url =
        environment.apiBaseUrl +
        "/v1/vendors/vendor_invitation?vendor_invitation_id=" +
        value;
    } else {
      url = environment.apiBaseUrl + "/v1/vendors/" + value;
    }

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  postUpdateVendorForm(
    vendorId,
    data,
    basefile_pan,
    basefile_gst,
    basefile_cheque,
    UploadDDlist_Item,
    contents_to_delete_ddlist,
    selectedTab,
    aggrement_copy
  ) {
    data["pan_copy"] = basefile_pan;
    data["gst_attachments"] = basefile_gst;
    data["cancelled_cheque"] = basefile_cheque;
    data["dd_upload_attachments"] = UploadDDlist_Item;
    data["contents_to_delete"] = contents_to_delete_ddlist;
    data["aggrement_copy"] = aggrement_copy;
    var obj = {
      vendor: data,
      sub_category_ids: data["sub_category_ids"],
      serviceable_city_ids: data["serviceable_city_ids"],
    };

    var url;
    if (selectedTab === "pending") {
      url =
        environment.apiBaseUrl +
        "/v1/vendors/update_invitation?vendor_invitation_id=" +
        vendorId;
    } else {
      url = environment.apiBaseUrl + "/v1/vendors/" + vendorId;
    }
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorPage(size) {
    var url = environment.apiBaseUrl + "/v1/vendors?page_size=" + size;

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
  fetchPptList(project_id) {
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

  filteredVendors(
    search_string,
    category_id,
    sub_category_id,
    serviceable_city_id
  ) {
    var filterobj = {
      category_id: category_id,
      sub_category_id: sub_category_id,
      serviceable_city_id: serviceable_city_id,
    };
    var filterstr = "&filter_params=" + JSON.stringify(filterobj);
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/index_new?search_string=" +
      search_string +
      filterstr;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  projectVendors(project_id, quotation_id) {
    var url = environment.apiBaseUrl + "/v1/vendors/get_vendor_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  /* GET all the job_elements of a BOQ line item*/
  getjob_elements_of_BOQlineitem(
    project_id,
    quotation_id,
    ownerable_type,
    ownerable_id
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/index_by_job?ownerable_type=" +
      ownerable_type +
      "&ownerable_id=" +
      ownerable_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  postjob_elements_of_BOQlineitem(
    project_id,
    quotation_id,
    ownerable_type,
    ownerable_id,
    formval
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements";
    var obj = {
      job_element: {
        element_name: formval.element_name,
        ownerable_type: ownerable_type,
        ownerable_id: ownerable_id,
      },
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  deletejob_elements_of_BOQlineitem(project_id, quotation_id, jobelemid) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatejob_elements_of_BOQlineitem(
    project_id,
    quotation_id,
    jobelemid,
    ownerable_type,
    ownerable_id,
    updatedval
  ) {
    var obj = {
      job_element: {
        element_name: updatedval,
        ownerable_type: ownerable_type,
        ownerable_id: ownerable_id,
      },
    };
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid;
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getDeatils_of_job_elements_of_BOQlineitem(
    project_id,
    quotation_id,
    jobelemid
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addvendorToLineitem(project_id, quotation_id, jobelemid, obj) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid +
      "/add_vendor";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletevendorToLineitem(project_id, quotation_id, jobelemid, vendor_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid +
      "/remove_vendor?vendor_id=" +
      vendor_id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updatevendorToLineitem(project_id, quotation_id, jobelemid, obj, vendor_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid +
      "/update_vendor_details?vendor_id=" +
      vendor_id;
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateVendorSelection(project_id, quotation_id, jobelemid, obj) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      jobelemid +
      "/update_vendor_details";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorListForVendorSelection(id) {
    var url =
      environment.apiBaseUrl + "/v1/vendors/index_new?job_element_id=" + id;
    let params: URLSearchParams = new URLSearchParams();
    params.set("job_element_id", id);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // get quotations for po
  getQuotationsList() {
    var url = environment.apiBaseUrl + "/v1/projects/quotations_for_po";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  lineItemDetails(quotation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/line_items_for_po?quotation_id=" +
      quotation_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createPurchaseOrder(
    milestone_elements,
    shipping_address,
    contact_person,
    contact_number,
    billing_address,
    billing_contact_person,
    billing_contact_number,
    vendor_gst,
    purchase_elements,
    quotation_id,
    project_id,
    vendor_id,
    status
  ) {
    var obj = {
      purchase_order: {
        quotation_id: quotation_id,
        project_id: project_id,
        vendor_id: vendor_id,
        shipping_address: shipping_address,
        status: status,
        contact_person: contact_person,
        contact_number: contact_number,
        billing_address: billing_address,
        billing_contact_person: billing_contact_person,
        billing_contact_number: billing_contact_number,
        vendor_gst: vendor_gst,
      },
      milestone_elements,
      purchase_elements: purchase_elements,
    };
    var url = environment.apiBaseUrl + "/v1/purchase_orders/";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updatePurchaseOrder(
    milestone_elements,
    shipping_address,
    contact_person,
    contact_number,
    billing_address,
    billing_contact_person,
    billing_contact_number,
    vendor_gst,
    purchase_elements,
    quotation_id,
    project_id,
    vendor_id,
    status,
    purchase_order_id
  ) {
    var obj = {
      purchase_order: {
        id: purchase_order_id,
        quotation_id: quotation_id,
        project_id: project_id,
        vendor_id: vendor_id,
        shipping_address: shipping_address,
        status: status,
        contact_person: contact_person,
        contact_number: contact_number,
        billing_address: billing_address,
        billing_contact_person: billing_contact_person,
        billing_contact_number: billing_contact_number,
        vendor_gst: vendor_gst,
      },
      milestone_elements,
      purchase_elements: purchase_elements,
    };
    var url =
      environment.apiBaseUrl + "/v1/purchase_orders/" + purchase_order_id;
    return this.http
      .put(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  exportLeads() {
    let url = environment.apiBaseUrl + "/v1/projects/download_custom_elements";
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

  getQuotationCountForCategory() {
    var url =
      environment.apiBaseUrl + "/v1/projects/quotations_count_for_category";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCustomElementProjectList(page) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/projects_by_custom_elements" +
      "?page=" +
      page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  AddCustomElementToAide(projectId , id){
    // {{url}}/v1/projects/:project_id/custom_elements/:id/push_to_aide
    let url = environment.apiBaseUrl +  '/v1/projects/' + projectId + '/custom_elements/' + id + '/push_to_aide'
    return this.http.post(url,[],this.options).map(this.extractData).catch(this.handleErrorObservable);
  }

  getPreProductionProjectList(sub_status, page) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/pre_production_projects" +
      "?sub_tab=" +
      sub_status +
      "&page=" +
      page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getPIUploadProjectList(page, searchQuery) {
    var url = "";
    if (searchQuery) {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations_pi_upload" +
        "?search=" +
        searchQuery;
    } else {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations_pi_upload" +
        "?page=" +
        page;
    }

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getCadApprovalProjectList(page?) {
    var url = environment.apiBaseUrl + "/v1/projects/projects_for_cad";
    let params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getQuotation(project_id, boq_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/client_quotation_display";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getProjectListForTasksTab(proposal_type, page) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/projects_by_quotations_wip_status?proposal_type=" +
      proposal_type +
      "&page=" +
      page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getBoqListForTasksTab(proposal_type, projectid) {
    let url =
      environment.apiBaseUrl +
      "/v1/proposals/category_boqs_of_project?project_id=" +
      projectid +
      "&proposal_type=" +
      proposal_type;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getBoqListForPaymentReleaseTab(page, searchQuery) {
    var url = "";
    if (searchQuery) {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations_payment_release" +
        "?search=" +
        searchQuery;
    } else {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations_payment_release" +
        "?page=" +
        page;
    }
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getBoqListForPreProductionTab(page, searchParam) {
    var url = "";
    if (searchParam) {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations" +
        "?search=" +
        searchParam;
    } else {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations" +
        "?page=" +
        page;
    }
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getLineItemsForPreProductionTab(projectid, quotationid) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectid +
      "/quotations/" +
      quotationid +
      "/job_elements";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  boqApproval(projectId, boqId, quoteStatus) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      boqId +
      "/cm_category_approval";
    var data = {
      approve: quoteStatus,
    };

    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCADBOQS(projectid) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + projectid + "/quotations/cad";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getCADFiles(projectid, quotationId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectid +
      "/quotations/" +
      quotationId +
      "/cad_uploads";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getBoqDetailsForPreProductionVendorMapping(projectid, boq_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectid +
      "/quotations/" +
      boq_id +
      "/pre_production_quotations_line_items";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  addSublineItem(data, project_id, quotation_id, ownerable_id, ownerable_type) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements";
    var obj = {
      job_element: data,
      project_id: project_id,
      quotation_id: quotation_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateSublineItem(
    data,
    project_id,
    quotation_id,
    ownerable_id,
    ownerable_type,
    lineitem_id
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      lineitem_id;
    var obj = {
      job_element: data,
      project_id: project_id,
      quotation_id: quotation_id,
      id: lineitem_id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBoqListForSli(page, searchQuery,cat,is_new) {
   
    var url = "";

    page = page?page:1;
    searchQuery = searchQuery?searchQuery:'';
    cat = cat?cat:''
    is_new = is_new?is_new:''
   
    if (searchQuery && searchQuery !='' ) {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotation_for_sli" +
        "?search=" +
        searchQuery +
        "&page=" +
        page +
        "&oc_category=" +
        cat;
    } else {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotation_for_sli" +
        "?page=" +
        page +
        "&oc_category=" +
        cat+
        "&new=" + is_new;
    }
   
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getBOQListForPORelease(page, searchQuery) {
    var url = "";
    if (searchQuery) {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations_po_release" +
        "?search=" +
        searchQuery;
    } else {
      url =
        environment.apiBaseUrl +
        "/v1/pre_production_quotations_po_release" +
        "?page=" +
        page;
    }
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getLineItemsListForSli(boq_id, project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/pre_production_quotation_for_sli_line_items";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  addOtherItem(data, project_id, quotation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/";
    var obj = {
      job_element: data,
      project_id: project_id,
      quotation_id: quotation_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSublineItem(project_id, boq_id, subline_item_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/" +
      subline_item_id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateOtherItem(
    data,
    project_id,
    quotation_id,
    ownerable_id,
    ownerable_type,
    lineitem_id
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/job_elements/" +
      lineitem_id;
    var obj = {
      job_element: data,
      project_id: project_id,
      quotation_id: quotation_id,
      id: lineitem_id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // pi upload starts here
  createPerformaInvoice(
    project_id,
    quotation_id,
    vendor_id,
    amount,
    description,
    tax_value,
    file
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/performa_invoices";
    var obj = {
      performa_invoice: {
        quotation_id: quotation_id,
        vendor_id: vendor_id,
        base_amount: amount,
        description: description,
        tax_percent: tax_value,
        pi_upload: file,
      },
      project_id: project_id,
      quotation_id: quotation_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPerformaInvoicesByQuotation(project_id, quotation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/performa_invoices";
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  getPOByQuotation(project_id, quotation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/quotations_po";
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  getPoPiMappingByQuotation(project_id, quotation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/purchase_order_performa_invoices";
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  createPoPiMapping(
    project_id,
    quotation_id,
    purchase_order_id,
    performa_invoice_id
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/purchase_order_performa_invoices";
    var obj = {
      purchase_order_performa_invoice: {
        purchase_order_id: purchase_order_id,
        performa_invoice_id: performa_invoice_id,
      },
      project_id: project_id,
      quotation_id: quotation_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPOListForBOQ(project_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/quotations_po";
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }
  // Pi upload ends here
  getPo_Pi_MappingOfBoq(projectid, quotid) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectid +
      "/quotations/" +
      quotid +
      "/purchase_order_performa_invoices";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getPo_Pi_MappingOfPR(projectid, quotid) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectid +
      "/quotations/" +
      quotid +
      "/quotations_payment_release_line_items";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getHistoryOfPR(performa_invoice_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/pi_payments?performa_invoice_id=" +
      performa_invoice_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  raiseRequest(payload) {
    let url = environment.apiBaseUrl + "/v1/pi_payments";

    var obj = {};
    obj["pi_payment"] = payload;
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  savePayment(projectId, obj, attachment) {
    let url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/payments";
    if (attachment) {
      obj["image"] = attachment;
    }
    var data = {
      payment: obj,
      project_id: obj.project_id,
    };
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  searchCategoryProjects(tab, searchParam) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/search_project_for_category?tab=" +
      tab +
      "&search=" +
      searchParam;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  updateCASeen(project_id, q_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      q_id +
      "/cad_uploads/change_category_seen_status";
    var data = {};
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateCESeen(project_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/custom_elements/change_category_seen_status";
    var data = {};
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateFBASeen(project_id, quote_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quote_id +
      "/change_category_seen_status";
    var data = {};
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  cancelPurchaseOrder(purchase_order_id) {
    var obj = {
      id: purchase_order_id,
    };
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      purchase_order_id +
      "/cancel_purchase_order";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  flagSLIItems(project_id, quotation_id, flag) {
    var obj = {
      project_id: project_id,
      quotation_id: quotation_id,
      flag: flag,
    };
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotation_id +
      "/change_sli_flag?status=" +
      flag;
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getVendorProducts(master_line_item_id?, vendor_id?, page?) {
    var url = environment.apiBaseUrl + "/v1/vendor_products";
    var params: URLSearchParams = new URLSearchParams();
    params.set("master_line_item_id", master_line_item_id);
    params.set("page", page);
    params.set("vendor_id", vendor_id);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorProductsList(master_line_item_id?, vendor_id?, page?) {
    var url = environment.apiBaseUrl + "/v1/vendor_products/list";
    var params: URLSearchParams = new URLSearchParams();
    params.set("master_line_item_id", master_line_item_id);
    params.set("page", page);
    params.set("vendor_id", vendor_id);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorProductsList2(searchedItem?, vendor_id?, page?) {
    var url = environment.apiBaseUrl + "/v1/vendor_products/list";
    var params: URLSearchParams = new URLSearchParams();
    params.set("search", searchedItem);
    params.set("page", page);
    params.set("vendor_id", vendor_id);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getMasterVendorProducts(page, master_line_item_id?, vendor_id?, search?) {
    var url = environment.apiBaseUrl + "/v1/vendor_products";

    var params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    if (master_line_item_id) {
      params.set("master_line_item_id", master_line_item_id);
    }

    if (vendor_id) {
      params.set("vendor_id", vendor_id);
    }

    if (search) {
      params.set("search", search);
    }

    var opt = this.options;
    opt.search = params;

    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getDetailsOfVendorProduct(id) {
    var url = environment.apiBaseUrl + "/v1/vendor_products/" + id;
    if (this.options.params) {
      this.options.params.delete("master_line_item_id");
      this.options.params.delete("vendor_id");
      this.options.params.delete("mli_type");
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getMasterLineItems(mli_type, page?) {
    var url = environment.apiBaseUrl + "/v1/master_line_items";
    if (this.options.params) {
      this.options.params.delete("master_line_item_id");
      this.options.params.delete("vendor_id");
    }
    if (this.options.params && !page) {
      this.options.params.delete("page");
    }
    var opt = this.options;
    var params: URLSearchParams = new URLSearchParams();
    if (page) {
      params.set("page", page);
      params.set("no_pagination", "false");
    } else {
      params.set("no_pagination", "true");
    }
    params.set("mli_type", mli_type);
    opt.search = params;
    if (page) {
      return this.http
        .get(url, opt)
        .map(this.extractDataPage)
        .catch(this.handleErrorObservable);
    } else {
      return this.http
        .get(url, opt)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
  }

  getAllMasterLineItems(mli_type_id?) {
    var url =
      environment.apiBaseUrl +
      "/v1/master_line_items/index_new?mli_type=" +
      mli_type_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getAllVendors() {
    var url = environment.apiBaseUrl + "/v1/vendors/get_vendor_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getMasterLineItemDetails(id) {
    var url = environment.apiBaseUrl + "/v1/master_line_items/" + id;
    if (this.options.params) {
      this.options.params.delete("master_line_item_id");
      this.options.params.delete("vendor_id");
      this.options.params.delete("mli_type");
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createVendorProduct(vendor_product, dynamic_attributes) {
    var url = environment.apiBaseUrl + "/v1/vendor_products";
    var obj = {
      vendor_product: vendor_product,
      dynamic_attributes: dynamic_attributes,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteVendorProduct(id) {
    var url = environment.apiBaseUrl + "/v1/vendor_products/" + id;
    return this.http.delete(url, this.options);
  }
  getPOPdfForPreview(purchase_order_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      purchase_order_id +
      "/purchase_order_view";
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  getPOPdfForPreviewmain(purchase_order_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/" +
      purchase_order_id +
      "/po_wip_order_view";
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  invoicelist(quoatation_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/po_payment_list?quotation_id=" +
      quoatation_id;
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  getPOPdfForPreviewForBulk(purchase_order_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/" +
      purchase_order_id +
      "/po_wip_order_view";
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http.get(url, this.options).catch(this.handleErrorObservable);
  }

  deletePOPdf(filepath) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/delete_purchase_order_view?filepath=" +
      filepath;
    var data = {};
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateVendorProduct(vendor_product, dynamic_attributes, product_id) {
    var url = environment.apiBaseUrl + "/v1/vendor_products/" + product_id;
    var obj = {
      vendor_product: vendor_product,
      dynamic_attributes: dynamic_attributes,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getProcurementList() {
    var url =
      environment.apiBaseUrl + "/v1/master_line_items/procurement_types";
    if (this.options.params) {
      this.options.params.delete("master_line_item_id");
      this.options.params.delete("vendor_id");
      this.options.params.delete("mli_type");
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getUOMList() {
    var url = environment.apiBaseUrl + "/v1/vendor_products/list_units_array";
    if (this.options.params) {
      this.options.params.delete("master_line_item_id");
      this.options.params.delete("vendor_id");
      this.options.params.delete("mli_type");
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getViewOptionsForMasterSLI(project_id, boq_id, subline_item_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/" +
      subline_item_id +
      "/view_options";
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getViewOptionsForMasterSLIForBulkPO(subline_item_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/wip_slis/" +
      subline_item_id +
      "/view_options";
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeMasterSLI(project_id, boq_id, subline_item_id, vendor_product_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/" +
      subline_item_id +
      "/change_master_sli";
    var obj = {
      vendor_product_id: vendor_product_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  changeMasterSLIForClubbedInBulkPO(subline_item_id, vendor_product_id, type?) {
    var url =
      environment.apiBaseUrl +
      "/v1/wip_slis/" +
      subline_item_id +
      "/change_wip_sli";
    var params: URLSearchParams = new URLSearchParams();
    params.set("sli_type", type);
    this.options.search = params;
    var obj = {
      vendor_product_id: vendor_product_id,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  releaseOrder(id) {
    var url =
      environment.apiBaseUrl + "/v1/purchase_orders/" + id + "/release_po";
    var obj = {
      id: id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  modifyOrder(id) {
    var url =
      environment.apiBaseUrl + "/v1/purchase_orders/" + id + "/modify_po";
    var obj = {
      id: id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editOrder(id, date) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      id +
      "/change_expected_delivery_date";
    var obj = {
      current_expected_delivery_date: date,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editOrdermain(id, date) {
    var url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/" +
      id +
      "/change_bulk_expected_delivery_date";
    var obj = {
      current_expected_delivery_date: date,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  releaseModifiedOrder(id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      id +
      "/release_modified_po";
    var obj = {
      id: id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downloadPoRelease(id) {
    var url =
      environment.apiBaseUrl + "/v1/purchase_orders/" + id + "/generate_po_pdf";
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

  getClubViewDetails(boqId, projectId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      boqId +
      "/pre_production_quotations_vendor_wise_line_items";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getClubViewDetailsForPO(boqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/vendor_wise_line_items_for_po?quotation_id=" +
      boqId;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  editSliQty(Qty, Job_elem_ids) {
    var url =
      environment.apiBaseUrl +
      "/v1/job_elements/edit_po_qty?qty=" +
      Qty +
      "&job_elements=" +
      Job_elem_ids;
    var obj = {
      qty: Qty,
      job_elements: Job_elem_ids,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getClubViewDetailsForPoReleased(projectId) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + projectId + "/purchase_orders";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getQuotationPo(projectId, boq_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      boq_id +
      "/purchase_orders";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSLIByJobElement(project_id, boq_id, obj) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/auto_populate_slis";
    var data = {
      procurement_method: obj.procurement_method,
      line_items: obj.line_items,
    };
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSelectedSLI(project_id, boq_id, ids) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/destroy_selected";
    var data = { ids: ids };
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  importPOAutomationFiles(project_id, boq_id, attachment) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/imos_import_global";
    var obj = {
      attachment: attachment,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateSublineItemInClubbed(projectId, QuotationId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      QuotationId +
      "/job_elements/update_clubbed";
    if (this.options.params) {
      this.options.params.delete("mli_type");
      this.options.params.delete("page");
    }
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  changeMasterSLIForClubbed(project_id, boq_id, sublineId, vendorProductId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/" +
      sublineId +
      "/set_alternate_sli";

    var obj = {
      vendor_product_id: vendorProductId,
    };
    if (this.options.params) {
      this.options.params.delete("job_element");
    }
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeMasterSLIForClubbedView(
    project_id,
    boq_id,
    jobElements,
    vendorProductId
  ) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      boq_id +
      "/job_elements/set_alternate_sli_clubbed";

    var obj = {
      vendor_product_id: vendorProductId,
      job_elements: jobElements,
    };
    if (this.options.params) {
      this.options.params.delete("job_element");
    }
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //Function to genrate Client address
  clientAddressValue(lead_id) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + lead_id + "/client_address";
    return this.http
      .get(url, this.options)
      .map(this.extractDataOne)
      .catch(this.handleErrorObservable);
  }

  deleteOneSli(projectID, boqId, sliId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/job_elements/" +
      sliId;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpdateSlis(projectID, boqId, sliId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/job_elements/" +
      sliId +
      "/update_sli_details";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpdateClubbedSlis(projectID, boqId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/job_elements/update_clubbed";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  UpdateUom(projectID, boqId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/job_elements/uom_conversion";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSliDetails(projectID, boqId, jobElementID) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/job_elements/" +
      jobElementID +
      "/line_item_details";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ADDSlismaster(item, quotation, job_id, job_type) {
    var url = environment.apiBaseUrl + "/v1/vendor_products/create_master_sli";
    let formdata = new FormData();
    formdata.append("vendor_product[sli_name]", item.name);
    formdata.append("vendor_product[unit]", item.unit);
    formdata.append("vendor_product[rate]", item.rate);
    formdata.append("vendor_product[description]", item.sli_description);
    formdata.append("vendor_product[sli_category]", item.sli_category);
    formdata.append("vendor_product[vendor_code]", item.vendor_code);
    formdata.append("vendor_product[vendor_id]", item.vendor_id);
    formdata.append("vendor_product[tax_percent]", item.tax_percent);
    formdata.append("vendor_product[tax_type]", item.tax_type);
    formdata.append("vendor_product[quantity]", item.quantity);
    formdata.append("quotation_id", quotation);
    formdata.append("job_id", job_id);
    formdata.append("job_type", job_type);
    // formdata.append("vendor_product[tax]", item.vendor_id);
    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ADDSlis(projectID, boqId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/create_multi_slis";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ADDClubbedSlis(projectID, boqId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/create_clubbed_jobs";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  deleteSelectedSli(projectID, boqId, data, subLineItemArrForClubbedItem) {
    var requestData = [...data, ...subLineItemArrForClubbedItem];
    var obj = {
      ids: JSON.stringify(requestData),
    };
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectID +
      "/quotations/" +
      boqId +
      "/job_elements/destroy_selected";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorsInPo(boqID) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/line_items_for_po?quotation_id=" +
      boqID;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //   getAddressForPO(projectID){
  //     var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/client_address';
  //         return this.http.get(url,this.options)
  //         .map(this.extractData)
  //         .catch(this.handleErrorObservable);

  //   }
  finalsubmissionOfPO(data) {
   if(data.purchase_order.internal_consumption_po == null){
    data.purchase_order.internal_consumption_po = false;
   }
   console.log(data.purchase_order.internal_consumption_po,"down");

    var url = environment.apiBaseUrl + "/v1/purchase_orders";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPOPaymentList(boqID) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/po_payment_list?quotation_id=" +
      boqID;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  raiseRequestForPO(value, poId) {
    var obj = {
      amount: value,
    };
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      poId +
      "/raise_po_payment";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadFileInPI(data) {
    var url = environment.apiBaseUrl + "/v1/performa_invoice_files";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadFileInmain(data) {
    var url = environment.apiBaseUrl + "/v1/bulk_po_performa_invoice_files";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deletePiPayment(piId) {
    var url = environment.apiBaseUrl + "/v1/pi_payments/" + piId;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ////To get table data
  getWipTable(page, type?, search?, search_type?) {
    var url = environment.apiBaseUrl + "/v1/wip_slis";
    var params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    params.set("type", type);
    params.set("search", search);
    params.set("search_type", search_type);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  //to add item
  addSublineItems(data) {
    var url = environment.apiBaseUrl + "/v1/wip_slis";

    var wip_sli = {
      wip_sli: {
        quantity: data.quantity,
        tax_type: data.tax_type,
        tax: data.tax_percent,
        vendor_product_id: data.vendor_product_id,
        sli_type: "mto",
      },
    };
    return this.http
      .post(url, wip_sli, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  addSublineItems2(data) {
    var url = environment.apiBaseUrl + "/v1/wip_slis";

    var wip_sli = {
      wip_sli: {
        quantity: data.quantity,
        tax_type: data.tax_type,
        tax: data.tax_percent,
        vendor_product_id: data.vendor_product_id,
        sli_type: data.sli_type,
      },
    };
    return this.http
      .post(url, wip_sli, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to remove item
  removeSliItems(id) {
    var url = environment.apiBaseUrl + "/v1/wip_slis/" + id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to download dd list file
  dowloadDDlist(file_type) {
    var url = environment.apiBaseUrl + "/v1/vendors/sample_dd_files";
    var params: URLSearchParams = new URLSearchParams();
    params.set("file_type", file_type);
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
          //var url = environment.apiBaseUrl+'/'+response['_body'];
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }

  //to get projects_for_handover
  getProjectList(page?, search?,cat?) {
    var url = environment.apiBaseUrl + "/v1/projects/projects_for_handover";
    page = page?page:'';
    search = search?search:'';
    cat = cat?cat:''
    var params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    if (search != '' && search != null) {
      params.set("search", search);
    }
    params.set("ob_category", cat);
    if (this.options.params) {
      this.options.params.delete("page");
    }
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  //to generate request
  sendRequest(data, lead_id) {
    let eventUrl =
      environment.apiBaseUrl + "/v1/projects/" + lead_id + "/requested_files";
    var obj = {
      remarks: data["remark_description"],
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to edit sli
  updateSliItems(id, data) {

    var url = environment.apiBaseUrl + "/v1/wip_slis/" + id;
    var wip_sli = {
      quantity: data.quantity,
      tax_type: data.tax_type,
      rate: data.rate,
      description: data.specs,
      tax:data.tax_percent
    };
    return this.http
      .patch(url, wip_sli, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to get address
  getAddressForPO(projectID) {
    var url =
      environment.apiBaseUrl + "/v1/projects/" + projectID + "/client_address";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getshippingAddressForPO() {
    var url = environment.apiBaseUrl + "/v1/po_addresses?address_type=shipping";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to relase po
  poSubmit(data, idsArr, sliCat) {
    var url = environment.apiBaseUrl + "/v1/po_wip_orders";
    var po_wip_order = {
      billing_address: data.billing_address,
      billing_contact_person: data.billing_contact_person,
      billing_contact_number: data.billing_contact_number,
      shipping_address: data.shipping_address,
      shipping_contact_person: data.contact_person,
      shipping_contact_number: data.contact_number,
      lead_id: data.lead_id,
      po_type: data.type,
      vendor_gst: data.vendor_gst,
      tag_snag: data.tag_snag,
      po_tag: data.po_tag?data.po_tag:'regular',
      current_expected_delivery_date: data.expDdate,
      internal_consumption_po : data.internal_consumption_po,
      shipping_address_record_id: data.shipping_address_record_id,
      wip_sli_ids: idsArr,
      quotation_batch_id: data.batch_id,
    };

    return this.http
      .post(url, po_wip_order, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to get po data-table list
  getWipPoTable(page, type?, search?) {
    var url = environment.apiBaseUrl + "/v1/po_wip_orders";
    var params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    params.set("type", type);
    params.set("search", search);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  //to cancle or modify po
  modifyPos(id, option) {
    var url =
      environment.apiBaseUrl + "/v1/po_wip_orders/" + id + "/take_action_on_po";
    var po_wip_order = {
      status: option,
    };

    return this.http
      .patch(url, po_wip_order, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to release Po
  updateRecivedpos(id, poData) {
    var url =
      environment.apiBaseUrl + "/v1/po_wip_orders/" + id + "/receive_po";
    var obj = {
      received_slis: poData,
    };

    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ////to get full line item
  getFullLineItems(id) {
    var url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/" +
      id +
      "/get_full_line_items";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //inventory table
  getInventoryTable(page, location) {
    var url = environment.apiBaseUrl + "/v1/po_inventories";
    var params: URLSearchParams = new URLSearchParams();
    params.set("page", page);
    params.set("location", location);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  modifyQtyForInventory(inventoryId, data) {
    var url =
      environment.apiBaseUrl +
      "/v1/po_inventories/" +
      inventoryId +
      "/update_min_stock_and_tat";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getCityListForInventory() {
    var url = environment.apiBaseUrl + "/v1/po_inventories/inventory_locations";
    if (this.options.params) {
      this.options.params.delete("page");
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ADDSlisForProjectMaintainancePo(data) {
    var url = environment.apiBaseUrl + "/v1/wip_slis/add_custom_sli";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getLeadListForPoRelease(value) {
    var url =
      environment.apiBaseUrl + "/v1/leads/search_leads?lead_id=" + value;
    if (this.options.params) {
      this.options.params.delete("id");
      this.options.params.delete("page");
      this.options.params.delete("typegetWipPoTable");
    }

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchReleasePoList(quotation_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/quotaions/" +
      quotation_id +
      "/quotaion_po?status=released";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchAllPoList(quotation_id, po_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/quotations/" +
      quotation_id +
      "/purchase_orders/" +
      po_id +
      "/po_details";
    // let url = environment.apiBaseUrl+'/v1/quotations/2894/purchase_orders/282/po_details';

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  /* authored by : Kaartik@Gloify.com */
  scheduleQC(
    status,
    scheduledDate,
    itemList,
    remarks,
    files,
    clubbed_job_elements_ids
  ) {
    let url =
      environment.apiBaseUrl + "/v1/quality_checks/update_job_element_qc_date";
    let body;

    body = {
      status: status,
      qc_date: scheduledDate || new Date(),
      job_element_ids: itemList,
      remarks: remarks,
      files: files,
      clubbed_job_elements_ids: clubbed_job_elements_ids,
    };

    return this.http
      .post(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  /* authored by : Kaartik@Gloify.com */
  saveDispatchReadinessDate(itemList, date, remarks, clubbed_job_elements_ids) {
    let url = environment.apiBaseUrl + "/v1/job_element/dispatch_readiness";
    let body = {
      readiness_date: date,
      job_element_ids: itemList,
      remarks: remarks,
      clubbed_job_elements_ids: clubbed_job_elements_ids,
    };
    return this.http
      .post(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  /* authored by : Kaartik@Gloify.com */
  saveDispatchScheduleDate(
    itemList,
    status,
    dispatchedBy,
    scheduleDate,
    site,
    billingAddress,
    shippingAddress,
    remarks,
    dispatchedItems,
    pendingItems,
    files,
    clubbed_job_elements_ids
  ) {
    let url = environment.apiBaseUrl + "/v1/job_element/dispatch_schedule";
    let body = {
      job_element_ids: itemList,
      status: status, // scheduled/dispatched/partial/completed
      dispatched_by: dispatchedBy,
      schedule_date: new Date(scheduleDate),
      site: site,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      remarks: remarks,
      dispatched_items: dispatchedItems,
      pending_items: pendingItems,
      files: files,
      clubbed_job_elements_ids: clubbed_job_elements_ids,
    };
    return this.http
      .post(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  /* authored by : Kaartik@Gloify.com */
  deliverItems(
    itemList,
    status,
    dispatchedItems,
    pendingItems,
    clubbed_job_elements_ids
  ) {
    let url = environment.apiBaseUrl + "/v1/job_element/delivery_states";
    let body = {
      job_element_ids: itemList,
      status: status, // scheduled/dispatched/partial/complete
      dispatched_items: dispatchedItems,
      pending_items: pendingItems,
      clubbed_job_elements_ids: clubbed_job_elements_ids,
    };
    return this.http
      .post(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  /* authored by : Kaartik@Gloify.com */
  viewHistory(itemId, historyOf) {
    let url =
      environment.apiBaseUrl +
      "/v1/job_element/mt-history?job_element_id=" +
      itemId +
      "&tab_name=" +
      historyOf;
    let params = new HttpParams();
    params = params.append("job_element_id", itemId);
    params = params.append("tab_name", historyOf);

    let option = this.authService.getHeaders();

    return this.http
      .get(url, option)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to get categorised list of handover files
  getCategorisedList(project_id, department, space) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/project_handovers/grouped_index?parent_handover_id=0&department=" +
      department +
      "&space=" +
      space;
    var params: URLSearchParams = new URLSearchParams();
    var status = ["pending_acceptance", "accepted", "rejected"];
    params.set("status", JSON.stringify(status));
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractDataOne)
      .catch(this.handleErrorObservable);
  }

  //Accept & Rejected Function
  rejectFun(handover_id, project_id, status, role, data?) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/project_handovers/" +
      handover_id +
      "/category_action_on_handover";
    var obj = {
      status: status,
      segment: role,
      remarks: data["remark_description"],
    };

    if (this.options.params) {
      this.options.params.delete("status");
    }
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProjectBoqListForHandover(project_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/final_approved_quotations";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProjectBoqListForCuttingBOM(project_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/splitted_quotations";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getLineItems(projectId, boqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      boqId +
      "/line_items_for_splitting";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getLineItemsForCutting(projectId, boqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      boqId +
      "/line_items_for_cutting_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  CheckBomUpload(boqId) {
    var url =
      environment.apiBaseUrl +
      "/v1/delta_boms/get_non_mto_bom_data?boq_id="+boqId;
    
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFilesToAssign(projectId, category, status) {
    let obj = {
      category: category,
    };

    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_handovers/grouped_index";
    var params: URLSearchParams = new URLSearchParams();
    params.set("category", JSON.stringify(category));
    params.set("status", status);
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  sendAssignedFiles(data) {
    let eventUrl = environment.apiBaseUrl + "/v1/production_drawings";

    let obj = {
      production_drawings: data,
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getSplitTag() {
    var url = environment.apiBaseUrl + "/v1/production_drawings/get_spit_tags";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadFile(project_id, postData) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/project_handovers/upload_files_from_category";
    return this.http
      .post(url, postData, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  removeDrawings(fileId) {
    var url = environment.apiBaseUrl + "/v1/production_drawings/" + fileId;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  submitSplitData(postData) {
    let obj = {
      splits_for_line_item: postData,
    };
    let url =
      environment.apiBaseUrl + "/v1/production_drawings/add_or_remove_splits";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to make new to old or to remove
  newFalse(project_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/seen_by_category_for_handover";
    return this.http
      .post(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to update panel and non-panel
  PanelNonChange(ownerable_id, project_id, panel) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/cad_drawings/" +
      ownerable_id +
      "/update_panel";
    var obj = {
      panel: panel,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  //to update panel and non-panel 3d
  PanelNonChangeForThreeD(i_id, project_id, panel) {
    var id = project_id;

    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      id +
      "/update_panel_for_three_d_image";
    var obj = {
      t_id: i_id,
      panel: panel,
    };
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  sendAssignedFileForCutting(data, boqId) {
    let eventUrl =
      environment.apiBaseUrl + "/v1/contents/upload_cutting_list_and_boms";

    let obj = {
      content: data,
      quotation_id: boqId,
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  BOMvalidationForCutting(data, boqId) {
    let eventUrl =
      environment.apiBaseUrl + "/v1/delta_boms/validate_cutting_list_and_boms";
      let formdata = new FormData();
    formdata.append("delta_bom[bom_type]",'non_mto');
    formdata.append("delta_bom[document]", data.document);
    formdata.append("delta_bom[quotation_id]", data.quotation_id);
  
    return this.http
      .post(eventUrl,formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  sendAssignedFileForNotCutting(data, value) {
    let eventUrl =
      environment.apiBaseUrl + "/v1/contents/set_no_bom_and_cutting_list";

    let obj = {
      jobs: data,
      not_needed: value,
    };

    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to remove lineitem
  removeCuttingItem(id, quotationId) {
    var url = environment.apiBaseUrl + "/v1/contents/" + id + "/destroy_bom";
    let obj = {
      quotation_id: quotationId,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to remove selected lineitem
  clearSli(data) {
    var url = environment.apiBaseUrl + "/v1/contents/clear_contents_by_ids";
    var params: URLSearchParams = new URLSearchParams();
    params.set("content_ids", JSON.stringify(data));

    this.options.search = params;
    return this.http
      .delete(url, this.options)
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
      "/download_boq_pdf";

    let params: URLSearchParams = new URLSearchParams();
    params.set("quoatation_id", BoqId);
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
          //var url = environment.apiBaseUrl+'/'+response['_body'];
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
  // send to factory
  sendFactory(projectId) {
    var id = projectId;
    let url =
      environment.apiBaseUrl + "/v1/projects/" + id + "/send_to_factory_mail";
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

  submitApproveOrRejectRequest(status, paymentId) {
    let eventUrl =
      environment.apiBaseUrl + `/v1/pi_payments/${paymentId}/${status}`;
    let obj = {
      payment_id: paymentId,
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPoTagList() {
    var url = environment.apiBaseUrl + `/v1/po_wip_orders/po_tag_list`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFinancePoList(page, finance_status, vendor, start_date, end_date, search) {
    var url =
      environment.apiBaseUrl +
      `/v1/purchase_orders/po_list_for_finance?&page=` +
      page +
      `&finance_status=` +
      finance_status +
      `&vendor_id=` +
      vendor +
      `&start_date=` +
      start_date +
      `&end_date=` +
      end_date +
      `&search=` +
      search;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  patchFinanceApprove(lead_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      lead_id +
      "/finance_approve";
    var obj = {
      id: lead_id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  rejectFinanceApprove(lead_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      lead_id +
      "/finance_reject";
    var obj = {
      id: lead_id,
    };
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  approveAllpayment(vendor_id) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/pi_payments/multiple_approve?vendor_ids=" +
      vendor_id +
      "&payment_status=approved";
    let obj = {
      // 'content': attachment,
      // 'quotation_id': quotationId
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  approveAllpaymentreq(ids) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/pi_payments/approve_request?payment_ids=" +
      ids;

    let obj = {};
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  approveAllpaymentreqmain(ids) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/approve_request?payment_ids=" +
      ids;

    let obj = {};
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  approveAllpaymentreqbulk(ids) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/approve_request?payment_ids=" +
      ids;

    let obj = {};
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  rejectAllpayment(vendor_id) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/pi_payments/multiple_reject?vendor_ids=" +
      vendor_id +
      '&payment_status="rejected"';
    let obj = {
      // 'content': attachment,
      // 'quotation_id': quotationId
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  rejectAllpaymentmain(vendor_id) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/multiple_reject?bulk_pi_payment_id=" +
      vendor_id;

    let obj = {
      // 'content': attachment,
      // 'quotation_id': quotationId
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getViewChild(project_id, handover_id) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/project_handovers/" +
      handover_id +
      "/child_revisions";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  clearList(data, value) {
    let eventUrl = environment.apiBaseUrl + "/v1/contents/change_no_bom_status";
    let obj = {
      jobs: data,
      remove: value,
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  selectService(customId, projectId, value) {
    var obj = {
      category_split: value,
    };
    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/custom_elements/" +
      customId +
      "/add_custom_element_space";
    return this.http
      .post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  manualSheetImport(projectId, quotationId, attachment) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/quotations/" +
      quotationId +
      "/job_elements/bom_sli_manual_sheet_import";
    let obj = {
      content: attachment,
      quotation_id: quotationId,
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getClubbedViewList(project_id, quotationId) {
    let url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      project_id +
      "/quotations/" +
      quotationId +
      "/job_elements/clubbed_view";

    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateQC(projectId, qcType, status, file, remark) {
    var params;

    params = {
      project_quality_check: {
        qc_type: qcType,
        status: status,
        remark: remark,
      },
      qc_file: file,
    };

    var url =
      environment.apiBaseUrl +
      "/v1/projects/" +
      projectId +
      "/project_quality_checks";
    return this.http
      .post(url, params, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

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
  getUserCategorySplit(value) {
    var url = environment.apiBaseUrl + "/v1/users/request_role";
    var params: URLSearchParams = new URLSearchParams();
    params.set("role", value);
    var opt = this.options;
    this.options.search = params;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downNewBoqLineItems() {
    var url = environment.apiBaseUrl + "/v1/quotations/boq_line_item_report";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getListVendorTags() {
    var url = environment.apiBaseUrl + "/v1/vendors/list_vendor_tags";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  SetVendorTags(tag_value, vendor_Id) {
    let eventUrl =
      environment.apiBaseUrl + "/v1/vendors/" + vendor_Id + "/set_vendor_tag";
    let obj = {
      tag_id: tag_value,
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getStateList() {
    var url = environment.apiBaseUrl + "/v1/cities/get_state_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPaymentTerm() {
    var url = environment.apiBaseUrl + "/v1/vendors/list_payment_term";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getImportantList() {
    var url = environment.apiBaseUrl + "/v1/vendors/get_importance_list";
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorInvitationList(page?, search?, status?, filterValue?) {
    var url = environment.apiBaseUrl + "/v1/vendors/vendor_invitations";
    var params: URLSearchParams = new URLSearchParams();
    params.set("search", search);
    params.set("page", page);
    params.set("filter_by_type", status);
    params.set("filter_by_id", filterValue);
    var opt = this.options;
    opt.search = params;
    return this.http
      .get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  updateInvitationStatus(status, invitation_id) {
    let eventUrl =
      environment.apiBaseUrl + "/v1/vendors/update_invitation_status";
    let obj = {
      vendor_invitation_id: invitation_id,
      status: status,
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPaymentList(po_payment_id) {
    var url =
      environment.apiBaseUrl +
      `/v1/pi_payments?performa_invoice_id=${po_payment_id}`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteInvoice(id) {
    var url =
      environment.apiBaseUrl +
      "/v1/performa_invoice_files/delete_invoice?id=" +
      id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  DeleteInvoicemain(id) {
    var url =
      environment.apiBaseUrl +
      "/v1/bulk_po_performa_invoice_files/delete_bulk_po_invoice?id=" +
      id;
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  submitRaiseRequestForInvoice(purchase_order_id, invoceFileId, amount) {
    let eventUrl =
      environment.apiBaseUrl +
      `/v1/purchase_orders/${purchase_order_id}/raise_po_payment`;
    let obj = {
      performa_invoice_file_id: invoceFileId,
      amount: parseInt(amount),
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  approveAllBulkpayment(vendor_id) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/multiple_approve?bulk_pi_payment_id=" +
      vendor_id;
    let obj = {
      // 'content': attachment,
      // 'quotation_id': quotationId
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  submitRaiseRequestForInvoicemain(purchase_order_id, invoceFileId, amount) {
    let eventUrl =
      environment.apiBaseUrl +
      `/v1/po_wip_orders/${purchase_order_id}/raise_bulk_po_payment`;
    let obj = {
      bulk_po_performa_invoice_file_id: invoceFileId,
      amount: parseInt(amount),
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  mtosubmitRaiseRequestForInvoicemain(
    purchase_order_id,
    invoceFileId,
    amount,
    quotation_batch_id
  ) {
    let eventUrl =
      environment.apiBaseUrl +
      `/v1/po_wip_orders/${purchase_order_id}/raise_bulk_po_payment`;
    let obj = {
      bulk_po_performa_invoice_file_id: invoceFileId,
      amount: parseInt(amount),
      quotation_batch_id: quotation_batch_id,
    };
    return this.http
      .post(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  rejectAllBulkpayment(vendor_id) {
    let eventUrl =
      environment.apiBaseUrl +
      "/v1/bulk_pi_payments/multiple_reject?bulk_pi_payment_id=" +
      vendor_id;
    let obj = {
      // 'content': attachment,
      // 'quotation_id': quotationId
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  submitApproveOrRejectRequestmain(status, paymentId) {
    let eventUrl =
      environment.apiBaseUrl + `/v1/bulk_pi_payments/${paymentId}/${status}`;
    let obj = {
      payment_id: paymentId,
    };
    return this.http
      .patch(eventUrl, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorsWithPo(page, search, city, fromdate, todate) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_vendors_listing_with_pos_retail?page=" +
      page +
      "&per_page=10&sort_column=&sort_order=" +
      "&search=" +
      search +
      "&city_id=" +
      city +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorpos(id, page) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_pos_on_vendor_retail?vendor_id=" +
      id +
      "&page=" +
      page +
      "&per_page=5&sort_column=&sort_order=";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorsReport(page, search, city, fromdate, todate) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_vendors_listing_with_pos_retail?send_file=true&page=" +
      page +
      "&per_page=10&sort_column=&sort_order=" +
      "&search=" +
      search +
      "&city_id=" +
      city +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorsWithPoMain(page, search, city, fromdate, todate) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_vendors_listing_with_pos_maintenance?page=" +
      page +
      "&per_page=10&sort_column=&sort_order=" +
      "&search=" +
      search +
      "&city_id=" +
      city +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorposMain(id, page) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_pos_on_vendor_maintenance?vendor_id=" +
      id +
      "&page=" +
      page +
      "&per_page=5&sort_column=&sort_order=";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getVendorsReportMain(page, search, city, fromdate, todate) {
    var params: URLSearchParams = new URLSearchParams();

    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_vendors_listing_with_pos_maintenance?send_file=true&page=" +
      page +
      "&per_page=10&sort_column=&sort_order=" +
      "&search=" +
      search +
      "&city_id=" +
      city +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getcountpos() {
    var url =
      environment.apiBaseUrl + `/v1/purchase_orders/get_all_pos_count_details`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getCountvendors() {
    var url = environment.apiBaseUrl + `/v1/vendors/get_all_vendors_count`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getVendorsWithPoservice(service, page, search, city, fromdate, todate) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_vendors_listing_with_pos_retail?boq_type=" +
      service +
      "&page=" +
      page +
      "&per_page=10&sort_column=&sort_order=" +
      "&search=" +
      search +
      "&city_id=" +
      city +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
  getVendorsPaymentCount(type) {
    var url =
      environment.apiBaseUrl +
      `/v1/vendors/get_all_vendor_payments_count?vendor_type=${type}`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getVendorlistAll(page) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendors/get_all_vendors_list?sendfile=&page=" +
      page;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  vendorSummaryReport(type) {
    if (type == "service" || type == "non service") {
      if (type == "non service") {
        type = "non_service";
      }
      var url =
        environment.apiBaseUrl +
        "/v1/vendors/get_all_vendors_listing_with_pos_retail?boq_type=" +
        type +
        "&send_file=true&per_page=10&sort_column=&sort_order=&search=&city_id=&from_date=&to_date";
    } else {
      if (type == "maintenance") {
        var url =
          environment.apiBaseUrl +
          "/v1/vendors/get_all_vendors_listing_with_pos_maintenance?boq_type=" +
          type +
          "&send_file=true&page=1&per_page=10&sort_column=&sort_order=&search=&city_id=&from_date=&to_date";
      } else {
        var url =
          environment.apiBaseUrl +
          "/v1/vendors/get_all_vendors_list?" +
          "send_file=true&page=1&per_page=10&sort_column=&sort_order=";
      }
    }
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // https://newuatapi.arrivae.com/v1/vendor_products/search_by_vendor_code?vendor_id=&vendor_code=f&page=1

  serachByVendor(vendor_id, vendor_code, page) {
    if (vendor_id == undefined) {
      vendor_id = "";
    }
    var url =
      environment.apiBaseUrl +
      "/v1/vendor_products/search_by_vendor_code?vendor_id=" +
      vendor_id +
      "&vendor_code=" +
      vendor_code +
      "&page=" +
      page;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getAllbatches(page, search) {
    var url =
      environment.apiBaseUrl +
      "/v1/quotation_batches?page=" +
      page +
      "&per_page=15" +
      "&search=" +
      search;
    return this.http
      .get(url, this.options)
      .map(this.extractDataOne)
      .catch(this.handleErrorObservable);
  }

  getBOQListing(lead_id) {
    var url =
      environment.apiBaseUrl +
      "/v1/quotation_batches/mto_quotations?lead_id=" +
      lead_id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  EDITSlis(item) {
    var url =
      environment.apiBaseUrl +
      "/v1/vendor_products/" +
      item.vendor_product_id +
      "/edit_master_sli";
    let formdata = new FormData();
    formdata.append("vendor_product[sli_name]", item.name);
    formdata.append("vendor_product[unit]", item.unit);
    formdata.append("vendor_product[rate]", item.rate);
    formdata.append("vendor_product[description]", item.description);
    return this.http
      .patch(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createBatch(obj, id) {
    var url =
      environment.apiBaseUrl +
      "/v1/quotation_batches?quotation_id=" +
      obj +
      "&batch_number=" +
      id;
    let formdata = new FormData();
    formdata.append("quotation_id", id);
    formdata.append("batch_number", obj);
    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadinvoice(
    search,
    from_date,
    to_date,
    status,
    filter_by,
    po_filter,
    category,
    po_release_type
  ) {
     if (search == undefined) {
       search = "";
     }
     if (from_date == undefined) {
       from_date = "";
     }
     if (to_date == undefined) {
           to_date = "";
     }
     if (status == undefined) {
       status = "";
     }
     if (filter_by == undefined) {
      filter_by = "";
     }
     if (po_filter == undefined) {
        po_filter = "";
     }
       if (category == undefined) {
         category = "";
       }
         if (po_release_type == undefined) {
          po_release_type = "";
         }

    let url =
      environment.apiBaseUrl +
      `/v1/purchase_orders?search=${search}&from_date=${from_date}&to_date=${to_date}&status=${status}&filter_by=${filter_by}&po_filter=${po_filter}&category=${category}&po_release_type=${po_release_type}&send_dump_file=true`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getWipTableMTO(page,type,search) {
    search = search?search:""
    var url =
      environment.apiBaseUrl + "/v1/wip_slis?page=" + page + "&type=mto"+"&search_type="+type+"&search="+search;
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getBatchesListing() {
    var url =
      environment.apiBaseUrl + "/v1/quotation_batches/mto_batches_number";
    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  // getMtoPoData(){
  //   var url =
  //     environment.apiBaseUrl + "/v1/po_wip_orders/get_mto_po_data?type=mto";
  //   return this.http
  //     .get(url, this.options)
  //     .map(this.extractDataPage)
  //     .catch(this.handleErrorObservable);
  // }

  getMtoPoData(search, fromdate, todate, currentpage, status, type, postatus) {
    let url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/get_mto_po_data?type=mto&" +
      "search=" +
      search +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate +
      "&page=" +
      currentpage +
      "&perpage=15&status=" +
      status +
      "&filter_by=" +
      type +
      "&po_status=" +
      postatus;

    return this.http
      .get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  downloadinvoicenulkmto(
    search,
    From_date,
    To_date,
    status,
    filter_by,
    po_status
  ) {
    search = search ? search : "";
    From_date = From_date ? From_date : "";
    To_date = To_date ? To_date : "";
    status = status ? status : "";
    filter_by = filter_by ? filter_by : "";
    po_status = po_status ? po_status : "";
    let url =
      environment.apiBaseUrl +
      `/v1/po_wip_orders/get_mto_po_data?type=mto&search=${search}&from_date=${From_date}&to_date=${To_date}&page=1&perpage=15&status=${status}&filter_by=${filter_by}&po_status=${po_status}&send_invoice_dump=true`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downloadinvoicenulk(
    search,
    From_date,
    To_date,
    status,
    filter_by,
    po_status
  ) {
    search = search ? search : "";
    From_date = From_date ? From_date : "";
    To_date = To_date ? To_date : "";
    status = status ? status : "";
    filter_by = filter_by ? filter_by : "";
    po_status = po_status ? po_status : "";
    let url =
      environment.apiBaseUrl +
      `/v1/po_wip_orders/get_bulk_po_data?type=maintenance&search=${search}&from_date=${From_date}&to_date=${To_date}&page=1&perpage=15&status=${status}&filter_by=${filter_by}&po_status=${po_status}&send_invoice_dump=true`;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getBatchDetail(id) {
    let url = environment.apiBaseUrl + "/v1/quotation_batches/" + id;
    return this.http
      .get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateBatchDetail(batch_id, ids, boq_num) {
    var data = {};
    var url =
      environment.apiBaseUrl +
      "/v1/quotation_batches/mto_batch_update?batch_id=" +
      batch_id +
      "&quotation_id=" +
      ids +
      "&batch_number=" +
      boq_num;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  modifyPosmto(id, option) {
    var url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/" +
      id +
      "/take_action_on_po?page=1&type=mto&search=";
    var po_wip_order = {
      status: option,
    };

    return this.http
      .patch(url, po_wip_order, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  updateSliItemsbulk(id, data) {
    var url = environment.apiBaseUrl + "/v1/wip_slis/" + id;
    this.options.search = null;

    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateSliItemsmto(id, data) {
    var url = environment.apiBaseUrl + "/v1/wip_slis/" + id +"type=mto";
    this.options.search = null;

    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  removeSliItemsmto(id) {
    var url = environment.apiBaseUrl + "/v1/wip_slis/" + id + "?type=mto";
    return this.http
      .delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ADDSlismasterMTO(item, type) {
    var url = environment.apiBaseUrl + "/v1/wip_slis";
    let formdata = new FormData();
    formdata.append("vendor_product[sli_name]", item.name);
    formdata.append("vendor_product[unit]", item.unit);
    formdata.append("vendor_product[rate]", item.rate);
    formdata.append("vendor_product[description]", item.sli_description);
    formdata.append("vendor_product[sli_category]", item.sli_category);
    formdata.append("vendor_product[vendor_code]", item.sli_vendor_code);
    formdata.append("vendor_product[vendor_id]", item.vendor_id);
    formdata.append("vendor_product[tax_percent]", item.tax_percent);
    formdata.append("vendor_product[tax_type]", item.tax_type);
    formdata.append("vendor_product[quantity]", item.quantity);
    formdata.append("vendor_product[sli_type]", type);

    return this.http
      .post(url, formdata, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ADDSliCustomMTO(item) {
    var url =
      environment.apiBaseUrl + "/v1/wip_slis/add_custom_sli?no_pagination=true";
    return this.http
      .post(url, item, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ApproveL1PO(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: poids,
      status: "release_partially_approved",
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/po_wip_orders/partial_po_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ApproveL2PO(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: poids,
      status: "pending",
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/po_wip_orders/final_po_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ApproveL1PORetail(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: poids,
      status: "released",
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/purchase_orders/ch_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ApproveL2PORetail(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: poids,
      status: "pending",
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/po_wip_orders/final_po_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  RejectL1PORetail(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: poids,
      status: "cancelled",
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/po_wip_orders/partial_po_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  RejectL2PORetail(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: poids,
      status: "cancelled",
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/po_wip_orders/final_po_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  BulkApproveL1PORetail(po_ids , type) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: "",
      status: "bulk_released",
      po_release_type : type
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/purchase_orders/ch_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  BulkApproveL2PORetail(po_ids) {
    let poids = po_ids.join(",");
    let obj = {
      po_ids: "",
      status: "pending",
      bulk_approval: true,
    };
    this.options.search = null;
    var url = environment.apiBaseUrl + "/v1/po_wip_orders/final_po_approval";
    return this.http
      .patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  SendForApproval(id, data) {
    this.options.search = null;
    var url =
      environment.apiBaseUrl +
      "/v1/purchase_orders/" +
      id +
      "/send_for_approval";
    return this.http
      .post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  SendForApprovalmto(id, data) {
    this.options.search = null;
    var url =
      environment.apiBaseUrl +
      "/v1/po_wip_orders/" +
      id +"/release_po" ;
    return this.http
      .patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProductionDailyData(factory?:any,milestone?:any,status?:any,dateType?:any,selectedTask?:any,startDate?:any,endDate?:any,sendFile?:any, searchInput?:any,store?:any,selectedOM?:any,priority?:any){
    
    if(milestone==undefined){
      milestone='';
    }
    if(factory==undefined){
      factory='';
    }
    if(status==undefined){
      status='';
    }
    if(dateType==undefined){
      dateType=''
    }
    if(selectedTask==undefined){
      selectedTask=''
    }if(startDate==undefined){
      startDate=''
    }if(endDate==undefined){
      endDate=''
    }
    var url =
    environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_details?factory=${factory}&milestone=${milestone}&status=${status}&type=${dateType}&milestone_type=${selectedTask}&end_date=${endDate}&start_date=${startDate}&send_file=${sendFile}&search=${searchInput}&store_id=${store}&om_id=${selectedOM}&priority=${priority}`;
  return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
getRemarksListing(id:any, milestone:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_remarks_listing?quotation_id=${id}&milestone=${milestone}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

addRemarks(id:any, milestone:any,remarksInput:any,responsiblityValue:any,deliveryDateValue:any){
  let data=[]
  if(responsiblityValue==null){
    responsiblityValue=''
  }
  if(deliveryDateValue==null ){
    deliveryDateValue=''
  }
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_remark_addition?quotation_id=${id}&milestone=${milestone}&remarks=${remarksInput}&delivery_date=${deliveryDateValue}&responsiblity=${responsiblityValue}`;
return this.http
  .post(url, data, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
addFactory(id: any, milestone: any, factoryName: any) {
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_factory_addition?quotation_id=${id}&milestone=${milestone}&factory=${factoryName}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
addDeliveryDate(id: any, milestone: any, deliverDate: any) {
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_delivery_date_addition?quotation_id=${id}&milestone=${milestone}&delivery_date=${deliverDate}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
addResponsibility(id: any, milestone: any, remark: any) {
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_responsiblity_addition?quotation_id=${id}&milestone=${milestone}&responsiblity=${remark}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
addDispatchDate(id: any, milestone: any,event: any,remarks:any){
   if(remarks==null){
    remarks=''
  }
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_dispatch_date_addition?quotation_id=${id}&milestone=${milestone}&remarks=${remarks}&dispatch_date=${event}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
getFactoryListingData(id:any, milestone:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_factory_listing?quotation_id=${id}&milestone=${milestone}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
getResponsibilityListingData(id:any, milestone:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_responsiblity_listing?quotation_id=${id}&milestone=${milestone}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
getDispatchDateListingData(id:any, milestone:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_dispatch_date_listing?quotation_id=${id}&milestone=${milestone}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
getDeliveryDateListingData(id:any, milestone:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/daily_dashboard_delivery_date_listing?quotation_id=${id}&milestone=${milestone}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
getPMListingData(page:any, store_id:any, start_date:any, searchInput:any){
  if(store_id==undefined){
    store_id='';
  }
  if(start_date==undefined){
    start_date='';
  }
  if(searchInput==undefined){
    searchInput='';
  }
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_listing?page=${page}&store_id=${store_id}&start_date=${start_date}&search=${searchInput}`;
return this.http
  .get(url, this.options)
  .map(this.extractDataPage)
  .catch(this.handleErrorObservable);
}
addBalancePanelAmount(lead_id:any,panelAmount:any){
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_panel_amount_addition?lead_id=${lead_id}&verified_panel_amount=${panelAmount}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
addBalanceServiceAmount(lead_id:any,serviceAmount:any){
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_service_amount_addition?lead_id=${lead_id}&verified_service_amount=${serviceAmount}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
addremarksValue(lead_id:any,remark:any){
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_remarks_addition?lead_id=${lead_id}&remarks=${remark}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}

getPanelAmountList(lead_id:any){
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_verified_panel_amount_listing?lead_id=${lead_id}`;
  return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}


getServiceAmountList(lead_id:any){
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_verified_service_amount_listing?lead_id=${lead_id}`;
  return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}


getremarksList(lead_id:any){
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_100_collection_log?lead_id=${lead_id}`;
  return this.http
    .get(url, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}

getPanelTarget(lead_id:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/pm_verified_panel_target_listing?lead_id=${lead_id}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

addPanelTarget(lead_id:any,date:any,amount:any,boq_id:number){
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_panel_target_addition?lead_id=${lead_id}&panel_target_date=${date}&panel_target_amount=${amount}&panel_target_quotation_id=${boq_id}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}


getServiceTarget(lead_id:any){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/pm_verified_service_target_listing?lead_id=${lead_id}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

addServiceTarget(lead_id:any,date:any,amount:any,boq_id:number){
  let data = []
  var url =
    environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_service_target_addition?lead_id=${lead_id}&service_target_date=${date}&service_target_amount=${amount}&service_target_quotation_id=${boq_id}`;
  return this.http
    .post(url, data, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
BHHandoverApproval(po_ids) {
  let poids = po_ids.join(",");
  let obj = {
    po_ids: poids,
    status: "bu_handover_approval_pending",
  };
  this.options.search = null;
  var url = environment.apiBaseUrl + "/v1/purchase_orders/bh_approval";
  return this.http
    .patch(url, obj, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
BHInvoiceApproval(po_ids,e) {
  let poids = po_ids.join(",");
  console.log(poids);

  let obj = {
    invoice_ids: poids,
    approval: e,
  };
  this.options.search = null;
  var url = environment.apiBaseUrl + "/v1/purchase_orders/bh_invoice_approval";
  return this.http
    .patch(url, obj, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}


getSummaryData(start_date:any, store_id:any , calender_type:any){
  if(start_date==undefined){
    start_date='';
  }
  if(store_id == undefined){
    store_id = '';
  }

  if(calender_type == undefined){
    calender_type = ''
  }

  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/pm_100_summary_dashboard_listing?start_date=${start_date}&store_id=${store_id}&calender_type=${calender_type}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

getBoqServiceSummary(store_id:any, start_date:any, date_type:any, boq_type:any, calender_type :any ){
  if(start_date==undefined){
    start_date='';
  }

  if(calender_type == undefined){
    calender_type = ''
  }
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/summary_boq_value_listing?store_id=${store_id}&start_date=${start_date}&date_type=${date_type}&boq_type=${boq_type}&calender_type=${calender_type}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

getEBASummary(store_id:any, start_date:any, date_type:any, boq_type:any , calender_type :any ){
  if(start_date==undefined){
    start_date='';
  }
  if(calender_type == undefined){
    calender_type = ''
  }
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/summary_expected_value_listing?store_id=${store_id}&start_date=${start_date}&date_type=${date_type}&boq_type=${boq_type}&calender_type=${calender_type}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

getTargetAmountSummary(store_id:any, start_date:any, date_type:any, boq_type:any,calender_type :any){
  if(start_date==undefined){
    start_date='';
  }

  if(calender_type == undefined){
    calender_type = ''
  }

  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/summary_target_value_listing?store_id=${store_id}&start_date=${start_date}&date_type=${date_type}&boq_type=${boq_type}&calender_type=${calender_type}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

getActualAmountSummary(store_id:any, start_date:any, date_type:any, boq_type:any , calender_type:any){
  if(start_date==undefined){
    start_date='';
  }

  if(calender_type == undefined){
    calender_type = ''
  }
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/summay_actual_value_listing?store_id=${store_id}&start_date=${start_date}&date_type=${date_type}&boq_type=${boq_type}&calender_type=${calender_type}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

getStores(){
  var url =
  environment.apiBaseUrl + `/v1/stores/get_stores_by_role`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
getOm(){
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/get_oms`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}

targetBoqListing(start_date:any,target_type:any,lead_id:any){
  if(start_date==undefined){
    start_date=''
  }
  var url =
  environment.apiBaseUrl + `/v1/lead_nocs/pm_100_dashboard_taget_boq_listing?start_date=${start_date}&target_type=${target_type}&lead_id=${lead_id}`;
return this.http
  .get(url, this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);
}
ClousurePO(id){
  var url =
  environment.apiBaseUrl + "/v1/purchase_orders/po_closure?po_id="+id;
 return this.http
  .patch(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 

}
POlogList(id){
  var url =
  environment.apiBaseUrl + "/v1/purchase_orders/"+id+"/show_po_logs";
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

ClousurePOmain(id){
  var url =
  environment.apiBaseUrl + "/v1/po_wip_orders/po_closure_btn?po_id="+id;
 return this.http
  .patch(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 

}
POlogListmain(id){
  var url =
  environment.apiBaseUrl + "/v1/po_wip_orders/po_wip_logs?po_id="+id;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

changeLeadActualDate(event1, event2, event3, event4) {
  let url = environment.apiBaseUrl + "/v1/lead_nocs/add_rm_date";
  var obj = {
    batch_number: event1,
    po_id: event2,
    manual_date: event3,
    notes: event4,
  };
  return this.http
    .put(url, obj, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
ZohoPoGET(obj){
  var url =
  environment.apiBaseUrl + "/v1/purchase_orders/fetch_zoho_item_data";
 return this.http
  .put(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
ZohoPoGETMain(obj){
  var url =
  environment.apiBaseUrl + "/v1/po_wip_orders//fetch_zoho_item_data";
 return this.http
  .put(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
BulkApproveL2PO(po_ids) {
  let poids = po_ids.join(",");
  let obj = {
    po_ids: "",
    status: "pending",
    bulk_approval: true,
  };
  this.options.search = null;
  var url = environment.apiBaseUrl + "/v1/po_wip_orders/final_po_approval";
  return this.http
    .patch(url, obj, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}
RejectL2PO(po_ids) {
  let poids = po_ids.join(",");
  let obj = {
    po_ids: poids,
    status: "cancelled",
  };
  this.options.search = null;
  var url = environment.apiBaseUrl + "/v1/po_wip_orders/final_po_approval";
  return this.http
    .patch(url, obj, this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}

RawmatDataGet(id){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/non_mto_bom_raw_materials?delta_bom_id="+id;
 return this.http
  .post(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
hardmatDataGet(id){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/non_mto_bom_hardwares?delta_bom_id="+id;
 return this.http
  .post(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
layoutmatDataGet(id){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/map_non_mto_bom_layouts?delta_bom_id="+id;
 return this.http
  .post(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
SfgmatDataGet(id){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/map_non_mto_bom_sfg?delta_bom_id="+id;
 return this.http
  .post(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
// http://localhost:3000/v1/delta_boms/get_bom_layout_dropdown_values
getBomlayoutDropdownValues(id){
  var url = environment.apiBaseUrl + '/v1/delta_boms/get_bom_layout_dropdown_values?delta_bom_id=' + id
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
getBomsfgDropdownValues(id){
  var url = environment.apiBaseUrl + '/v1/delta_boms/get_bom_sfg_dropdown_values?delta_bom_id=' + id
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
getBomsfgDropdownValuesbands(id){
  var url = environment.apiBaseUrl + '/v1/delta_boms//get_sfg_edge_bands?delta_bom_id=' + id
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
getBomsfgDropdownValueshandle(id){
  var url = environment.apiBaseUrl + '/v1/delta_boms/get_sfg_handles?delta_bom_id=' + id
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
// http://localhost:3000/v1/delta_boms/search_non_mto_bom_layout
search_non_mto_bom_layout(board,lam_top,lam_bot,thickness,delta_bom_id , layout_id){
  var url = environment.apiBaseUrl + '/v1/delta_boms/search_non_mto_bom_layout?board=' + board + '&lam_top=' + lam_top + '&lam_bot=' + lam_bot + '&thickness=' + thickness + '&delta_bom_id=' + delta_bom_id + '&layout_id=' + layout_id
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}

search_non_mto_bom_SFG(sfg_id,layout,length,width,delta_bom_id){
  var url = environment.apiBaseUrl + '/v1/delta_boms/search_non_mto_bom_sfg?sfg_id=' + sfg_id + '&layout=' + layout + '&length=' + length + '&width=' + width + '&delta_bom_id=' + delta_bom_id 
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
ReadMToDataGet(id,stage,boqlabel){
  if(boqlabel==undefined || boqlabel == null){
    boqlabel=''
  }
  else{
    boqlabel=boqlabel
  }
  
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/fetch_non_mto_data?id="+id+'&stage='+stage;
  if(stage=='sfg'){
    url=url+'&boq_label='+boqlabel;
  }
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
SFGDataGet(id,stage){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/get_sfg_detailed_info?delta_bom_id="+id+'&sfg_id='+stage;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
ItemnameMToDataGet(mid,length,width){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/get_cli_name_and_code?mli_id="+mid+"&length="+length+"&width="+width;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
HWMToDataGet(mid){
  var url =
  environment.apiBaseUrl + "/v1/mto_bom_hws/fetch_mto_hw_data?mto_bom_hw_id="+mid;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
RMToDataGet(mid){
  var url =
  environment.apiBaseUrl + "/v1/mto_bom_rms/fetch_mto_rm_data?batch_id="+mid;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

ProfileToDataGet( batchID, item_type ){
  var url = environment.apiBaseUrl + "/v1/mto_bom_profiles/fetch_mto_profile_data?batch_id=" + batchID + "&item_type=" + item_type
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}

ntsToDataGet( batchID ){
  var url = environment.apiBaseUrl + "/v1/mto_bom_nts/fetch_mto_nts_data?batch_id=" + batchID 
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
glassToDataget(id,type){
  var url = environment.apiBaseUrl + '/v1/mto_bom_uploads/fetch_mto_upload_data?batch_id=' + id+"&upload_type="+type;
  return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
RMSubmit(id){

  let obj = {
    rm_id: id
  }
  var url = environment.apiBaseUrl + `/v1/mto_bom_rms/update_rm`;
  return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
HWARESubmit(id){

  let obj = {
    hw_id: id
  }
  var url = environment.apiBaseUrl + `/v1/mto_bom_hws/update_hw`;
  return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
ProfileSubmit(id){

  let obj = {
    profile_id: id
  }
  var url = environment.apiBaseUrl + `/v1/mto_bom_profiles/update_profile`;
  return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}
GlassSubmit(id){

  let obj = {
    upload_id: id
  }
  var url = environment.apiBaseUrl + `/v1/mto_bom_uploads/update_upload`;
  return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
}

ItemnameMToDataGetSfg(mid,e1,e2,e3,e4,b_id,layout){
  var url =
  environment.apiBaseUrl + "/v1/delta_boms/check_cli_sfg?mli_id="+mid+"&edge_band_1="+e1+"&edge_band_2="+e2+"&edge_band_3="+e3+"&edge_band_4="+e4+"&delta_bom_id="+b_id+"&layout="+layout
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
profileSearchCli(mid,e1,e2,e3,e4,b_id){
  var url =
  environment.apiBaseUrl + "/v1/mto_bom_profiles/search_profile_cli?item_type="+mid+"&length="+e1+"&thickness="+e2+"&item_name="+e3+"&code="+e4
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
GlassSearchCli(mid,e1,e2,e3,e4,e5){
  e5 = e5 == true || e5 == 'true'?'yes':'no'
  var url =
  environment.apiBaseUrl + "/v1/mto_bom_uploads/search_upload_cli?upload_type="+mid+"&length="+e1+"&thickness="+e2+"&item_name="+e3+"&width="+e4+"&perforate="+e5
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
profileCreateCli(form){
  var url =
  environment.apiBaseUrl + "/v1/mto_bom_profiles/create_manually_profile_cli"
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

GlassCreateCli(form){
  console.log(form.perforate)
  form.perforate = form.perforate == true || form.perforate == 'true'?'yes':'no'
  var url =
  environment.apiBaseUrl + "/v1/mto_bom_uploads/create_manually_upload_cli"
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
MapDataAdd(cli_id,d_id,stage,n_id){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/add_cli_to_non_mto_bom?cli_id=${cli_id}&delta_bom_id=${d_id}&stage=${stage}&non_mto_bom_id=${n_id}`;
 return this.http
  .post(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
PordBomSfg(id){
  let obj ={
    delta_bom_id : id
  }
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/create_project_bom_on_dynamics`;
 return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 

}


HWDataAdd(cli_id,d_id,){

let obj = {
  cli_id : cli_id,
  item_id : d_id
}
  var url =
  environment.apiBaseUrl + `/v1/mto_bom_hws/add_cli_manually_to_mto_bom_hw`;
 return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

RMDataAdd(cli_id,d_id,){

  let obj = {
    cli_id : cli_id,
    item_id : d_id
  }
    var url =
    environment.apiBaseUrl + `/v1/mto_bom_rms/add_cli_manually_to_mto_bom_rm`;
   return this.http
    .post(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable); 
    
  }

  ProfileDateAdd(cli_id,d_id,){
    let obj = {
      cli_id : cli_id,
      item_id : d_id
    }
      var url = environment.apiBaseUrl + `/v1/mto_bom_profiles/add_cli_manually_to_mto_bom_profile`;
     return this.http
      .post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable); 
    }
    ntsDateAdd(cli_id,d_id,){
      let obj = {
        cli_id : cli_id,
        item_id : d_id
      }
        var url = environment.apiBaseUrl + `/v1/mto_bom_nts/add_cli_manually_to_mto_bom_nts`;
       return this.http
        .post(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable); 
      }
    GlassDateAdd(cli_id,d_id,){
      let obj = {
        cli_id : cli_id,
        item_id : d_id
      }
      // http://localhost:3000/v1/mto_bom_uploads/add_cli_manually_to_mto_bom_upload
        var url = environment.apiBaseUrl + `/v1/mto_bom_uploads/add_cli_manually_to_mto_bom_upload`;
       return this.http
        .post(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable); 
      }
LayoutDataAdd(form){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/add_manual_mli_in_layout`;
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
SFGDataAdd(form){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/add_manual_mli_in_sfg`;
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
CliLayoutDataAdd(form){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/add_manual_cli_in_layout`;
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
ClisfgDataAdd(form){
  form.edge_band_1_id =   form.edge_band_1_id  == 'null'?null:form.edge_band_1_id
  form.edge_band_2_id =   form.edge_band_2_id  == 'null'?null:form.edge_band_2_id

  form.edge_band_3_id =   form.edge_band_3_id  == 'null'?null:form.edge_band_3_id

  form.edge_band_4_id =   form.edge_band_4_id  == 'null'?null:form.edge_band_4_id
  form.edge_band_1_id = form.edge_band_1_id == null?null:parseInt(form.edge_band_1_id)
  form.edge_band_2_id = form.edge_band_2_id == null?null:parseInt(form.edge_band_2_id)
  form.edge_band_3_id = form.edge_band_3_id == null?null:parseInt(form.edge_band_3_id)
  form.edge_band_4_id = form.edge_band_4_id == null?null:parseInt(form.edge_band_4_id)

  var url =
  environment.apiBaseUrl + `/v1/delta_boms/add_manual_cli_in_sfg`;
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
LayoutConDataAdd(form){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/update_cli_by_layout_configuration`;
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
SfgConDataAdd(form){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/update_cli_by_sfg_configuration`;
 return this.http
  .post(url,form,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
Prod_bomPush(obj){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/create_production_bom_on_dynamics`;
 return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 

}

DestroyBatch(id){
  let obj ={
    batch_id :id
  }
  var url =
  environment.apiBaseUrl + `/v1/quotation_batches/destroy_batch`;
 return this.http
  .put(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
Dynamics_bomData(p_id,q_id){
  var url =
  environment.apiBaseUrl + `/v1/projects/${p_id}/quotations/${q_id}/fetch_dynamics_info`;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

GetApproveDetails(id,batch_id){
  
  var url =
  environment.apiBaseUrl + `/v1/mto_bom_orders/get_order_details?item_id=${id}&batch_id=${batch_id}`;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
Dynamics_Trigger(p_id,q_id,task){
  var url =
  environment.apiBaseUrl + `/v1/projects/${p_id}/quotations/${q_id}/trigger_dynamics_api?task=${task}`;
 return this.http
  .patch(url,[],this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}

makeApproveDetails(id,type){

  let obj ={
    item_id : id,
    subtype : type

  }
  var url =
  environment.apiBaseUrl + `/v1/mto_bom_orders/approve_order_uploads`;
 return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
getBOQLabelslist(bom_id){
  var url =
  environment.apiBaseUrl + `/v1/delta_boms/list_all_boq_labels?delta_bom_id=${bom_id}` 
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 

}
ReleaseProd(id){

  let obj ={
    item_id : id,  

  }
  var url =
  environment.apiBaseUrl + `/v1/mto_bom_orders/release_production_bom`;
 return this.http
  .post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 
  
}
GetItemCodeDetails(item_type){
  
  var url =
  environment.apiBaseUrl + `/v1/mto_bom_profiles/get_item_code?item_type=${item_type}`;
 return this.http
  .get(url,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable); 

}

  

}
