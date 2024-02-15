import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Report } from './report.model';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {

  
  @Input() report!: Report;

  @Output() delete = new EventEmitter(); //this delete event will be listened in report-list html

  constructor(private router: Router, private reportService:ReportService) {}

  onDelete(event: any, reportUniqueID: number): void {
    //attach reportUniqueID to this event
    event['reportUniqueID'] = reportUniqueID;
   
    this.delete.emit(event);
  }

  onMoreInfo(event: any, uniqueID: number) {
    this.router.navigate([
      '/report',
      this.report.uniqueID,
      this.report.troublemakerName,
      this.report.location.placeName,
      this.report.reportedBy.reporterName,
      this.report.reportedBy.reporterPhone,
      this.report.time,
      this.report.status,
      this.report.extraInfo,
      this.report.pictureLink
    ]);



  
  }
}
