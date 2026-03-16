import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FinanceRoutingModule } from "./finance-routing.module";
import { AuthenticationModule } from "../../authentication/authentication.module";
import { FileUploadModule } from "ng2-file-upload";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ListProposalsComponent } from "./list-proposals/list-proposals.component";
import { ListBoqsComponent } from "./list-boqs/list-boqs.component";
import { CollapsibleModule } from "angular2-collapsible";
import { NgSelectModule } from "@ng-select/ng-select";
import { VendorPaymentComponent } from "./vendor-payment/vendor-payment.component";
import { TimeAgoPipe } from "time-ago-pipe";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ClientLedgerComponent } from "./client-ledger/client-ledger.component";
import { VendorLedgerComponent } from "./vendor-ledger/vendor-ledger.component";
import { NgxPaginationModule } from "ngx-pagination";
import { NgPipesModule } from "ngx-pipes";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { ClientInvoiceComponent } from "./client-invoice/client-invoice.component";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";
import { IncentiveComponent } from "./incentive/incentive.component";
import { ListChampionIncentiveComponent } from "./list-champion-incentive/list-champion-incentive.component";
import { ViewChampionIncentiveComponent } from "./view-champion-incentive/view-champion-incentive.component";
import { DeltaIncentiveListComponent } from "./delta-incentive-list/delta-incentive-list.component";
import { PaymentBoqListComponent } from "./dashboard/payment-boq-list/payment-boq-list.component";
import { ToastModule } from "ng2-toastr";
import { UpdateApprovedAmountComponent } from "./vendor-payment/update-approved-amount/update-approved-amount.component";
import { BulkVendorPaymentComponent } from "./bulk-vendor-payment/bulk-vendor-payment.component";
import { UpdateBulkApproveAmountComponent } from "./vendor-payment/update-bulk-approve-amount/update-bulk-approve-amount.component";
import { MtoVendorPaymentComponent } from './mto-vendor-payment/mto-vendor-payment.component';
import { AdustmentsComponent } from './adustments/adustments.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    NgPipesModule,
    FinanceRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
    AuthenticationModule,
    CollapsibleModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToastModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    ListProposalsComponent,
    ListBoqsComponent,
    VendorPaymentComponent,
    TimeAgoPipe,
    ClientLedgerComponent,
    VendorLedgerComponent,
    ClientInvoiceComponent,
    CreateInvoiceComponent,
    IncentiveComponent,
    ListChampionIncentiveComponent,
    ViewChampionIncentiveComponent,
    DeltaIncentiveListComponent,
    PaymentBoqListComponent,
    UpdateApprovedAmountComponent,
    BulkVendorPaymentComponent,
    UpdateBulkApproveAmountComponent,
    MtoVendorPaymentComponent,
    AdustmentsComponent,
  ],
})
export class FinanceModule {}
