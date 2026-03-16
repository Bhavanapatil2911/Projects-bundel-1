import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoggedInGuard } from "../../authentication/logged-in-guard.service";
import { LoggedOutGuard } from "../../authentication/logged-out-guard.service";
import { AuthService } from "../../authentication/auth.service";
import { FinanceService } from "./finance.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ListProposalsComponent } from "./list-proposals/list-proposals.component";
import { ListBoqsComponent } from "./list-boqs/list-boqs.component";
import { VendorPaymentComponent } from "./vendor-payment/vendor-payment.component";
import { ClientLedgerComponent } from "./client-ledger/client-ledger.component";
import { VendorLedgerComponent } from "./vendor-ledger/vendor-ledger.component";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";
import { ClientInvoiceComponent } from "./client-invoice/client-invoice.component";
import { IncentiveComponent } from "./incentive/incentive.component";
import { ListChampionIncentiveComponent } from "./list-champion-incentive/list-champion-incentive.component";
import { ViewChampionIncentiveComponent } from "./view-champion-incentive/view-champion-incentive.component";
import { DeltaIncentiveListComponent } from "./delta-incentive-list/delta-incentive-list.component";
import { BulkVendorPaymentComponent } from "./bulk-vendor-payment/bulk-vendor-payment.component";
import { MtoVendorPaymentComponent } from "./mto-vendor-payment/mto-vendor-payment.component";
import { AdustmentsComponent } from "./adustments/adustments.component";
const routes: Routes = [
  {
    path: "",
    canActivate: [LoggedInGuard],
    component: DashboardComponent,
  },
  {
    path: "project/:id/list-proposals",
    canActivate: [LoggedInGuard],
    component: ListProposalsComponent,
  },
  {
    path: "project/:id/list-boqs",
    canActivate: [LoggedInGuard],
    component: ListBoqsComponent,
  },
  {
    path: "vendor-payment",
    canActivate: [LoggedInGuard],
    component: VendorPaymentComponent,
  },
  {
    path: "maintenance-vendor-payment",
    canActivate: [LoggedInGuard],
    component: BulkVendorPaymentComponent,
  },
  {
    path: "client-ledger",
    canActivate: [LoggedInGuard],
    component: ClientLedgerComponent,
  },
  {
    path: "vendor-ledger",
    canActivate: [LoggedInGuard],
    component: VendorLedgerComponent,
  },
  {
    path: "champion-incentive",
    canActivate: [LoggedInGuard],
    component: IncentiveComponent,
  },

  {
    path: "incentive-list",
    canActivate: [LoggedInGuard],
    component: ListChampionIncentiveComponent,
  },
  {
    path: "incentive-details",
    canActivate: [LoggedInGuard],
    component: ViewChampionIncentiveComponent,
  },

  {
    path: "delta-incentive",
    canActivate: [LoggedInGuard],
    component: DeltaIncentiveListComponent,
  },

  {
    path: "client-invoice",
    component: ClientInvoiceComponent,
  },
  {
    path: "mto-vendor-payment",
    canActivate: [LoggedInGuard],
    component: MtoVendorPaymentComponent,
  },
  {
    path: "adjustments",
    canActivate: [LoggedInGuard],
    component: AdustmentsComponent,
  },
  // {
  //   path: 'create-invoice',
  //     canActivate: [LoggedInGuard],
  //     component: CreateInvoiceComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FinanceService],
})
export class FinanceRoutingModule {}
