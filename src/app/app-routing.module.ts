import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportTableComponent } from './report-table/report-table.component';
import { ReportAddFormComponent } from './report-add-form/report-add-form.component';
import { ReportInfoComponent } from './report-info/report-info.component';

const routes: Routes = [
  { path: '', component: ReportTableComponent },
  { path: 'reportTable', component: ReportTableComponent },
  { path: 'report/add', component: ReportAddFormComponent },
  { path: 'report/:uniqueID/:troublemakerName/:locationName/:reporterName/:reporterPhone/:time/:status/:extraInfo/:pictureLink', component: ReportInfoComponent }
];

@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
