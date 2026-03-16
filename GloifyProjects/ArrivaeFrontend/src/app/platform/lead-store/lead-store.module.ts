import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadStoreRoutingModule } from './lead-store-routing.module';
import { ListLeadStoreComponent } from './list-lead-store/list-lead-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'app/shared/shared.module';
import { NgPipesModule } from 'ngx-pipes';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapsibleModule } from 'angular2-collapsible';

@NgModule({
  imports: [
    CommonModule,
    LeadStoreRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    NgPipesModule,
    RouterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CollapsibleModule ,
    PdfViewerModule,
    NgSelectModule
  ],
  declarations: [ListLeadStoreComponent]
})
export class LeadStoreModule { }
