import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from 'app/authentication/logged-in-guard.service';
import { ListLeadStoreComponent } from './list-lead-store/list-lead-store.component';

const routes: Routes = [
  {
    path: '/lead-store-list',
    canActivate: [LoggedInGuard],
    component: ListLeadStoreComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadStoreRoutingModule { }
