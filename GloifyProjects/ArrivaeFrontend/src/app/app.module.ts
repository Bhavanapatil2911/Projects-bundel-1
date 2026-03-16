import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgPipesModule } from 'ngx-pipes';
import { Angular2TokenService} from 'angular2-token';
import { AccountModule } from './account/account.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { SharedModule }         from './shared/shared.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PlatformModule } from './platform/platform.module';
import { UserDetailsService } from './services/user-details.service';
import { SharedService } from './services/shared.service';
import { LoaderService } from './services/loader.service';
import { FileUploadModule } from "ng2-file-upload";
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { PagenotfoundRoutingModule } from './shared/pagenotfound/pagenotfound-routing.module';
import {GoogleAnalyticsEventsService} from "./services/google-analytics-events.service";
import { CallLogsComponent } from './call-logs/call-logs.component';
import { SmsLogsComponent } from './sms-logs/sms-logs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import {DataTableModule} from "angular2-datatable";
import {NgxPaginationModule} from 'ngx-pagination';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { AgmCoreModule } from '@agm/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';

// import { InviteChampionsComponent } from './shared/invite-champions/invite-champions.component';

// import { LoginComponent } from './authentication/login/login.component';
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
  declarations: [
    AppComponent,
    UserComponent,
    CallLogsComponent,
    SmsLogsComponent,
    
    
    // LoginComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    SharedModule,
    AuthenticationModule,
    PlatformModule,
    FileUploadModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgPipesModule,
    CommonModule,
    SlimLoadingBarModule.forRoot(),
    PagenotfoundRoutingModule,
    ToastModule.forRoot(),
    AngularMultiSelectModule,
    DataTableModule,
    IonRangeSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCgG3_l7AbF_mMHupxP_RIW1xytt-NEKCc'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
  }),
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN' },
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
    Angular2TokenService,
    UserDetailsService,
    SharedService,
    LoaderService,
    GoogleAnalyticsEventsService,
   
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
