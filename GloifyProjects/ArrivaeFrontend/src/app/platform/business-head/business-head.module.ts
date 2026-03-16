import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { BusinessHeadRoutingModule } from './business-head-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoqViewComponent } from './boq-view/boq-view.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { BoqMarginComponent } from './boq-margin/boq-margin.component';
import { InviteChampionsComponent } from '../../shared/invite-champions/invite-champions.component';
import { TrainingMaterialComponent } from './training-material/training-material.component';

// import { CmVariableMarginsComponent } from './cm-variable-margins/cm-variable-margins.component';
const MY_CUSTOM_FORMATS = {
  parseInput: 'dd-MM-yyyy',
  fullPickerInput: 'dd-MM-yyyy HH:mm',
  datePickerInput: 'dd-MM-yyyy',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM yyyy',
  dateA11yLabel: 'dd-MM-yyyy',
  monthYearA11yLabel: 'MMMM yyyy',
  };
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgPipesModule,
    BusinessHeadRoutingModule,
    NgxPaginationModule,
    ChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule

  ],

  providers:[
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN' },
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ],

  declarations: [DashboardComponent, BoqViewComponent, BoqListComponent],


})
export class BusinessHeadModule { }
