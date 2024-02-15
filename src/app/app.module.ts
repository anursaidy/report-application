import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';
import { CountReportsPipe } from './count-reports.pipe';
import{FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { ReportAddFormComponent } from './report-add-form/report-add-form.component';
import { ReportInfoComponent } from './report-info/report-info.component';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map/map.component';
import { ReportTableComponent } from './report-table/report-table.component';


@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    ReportTableComponent,
    CountReportsPipe,
    SearchPipe,
    ReportAddFormComponent,
    ReportInfoComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
