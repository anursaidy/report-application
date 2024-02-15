import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrl: './report-info.component.css',
})
export class ReportInfoComponent {
  uniqueID:number;
  troublemakerName: string;
  locationName: string;
  reporterName: string;
  reporterPhone: string;
  time: number;
  status: boolean;
  extraInfo: string;
  pictureLink: string;

  constructor(
    private router:Router,
    private activeedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {
    this.uniqueID = activeedRoute.snapshot.params['uniqueID'];
    this.troublemakerName = activeedRoute.snapshot.params['troublemakerName'];
    this.locationName = activeedRoute.snapshot.params['locationName'];
    this.reporterName = activeedRoute.snapshot.params['reporterName'];
    this.reporterPhone = activeedRoute.snapshot.params['reporterPhone'];
    this.time = activeedRoute.snapshot.params['time'];
     this.status = (activeedRoute.snapshot.params['status'] === 'true');
    this.extraInfo = activeedRoute.snapshot.params['extraInfo'];
    this.pictureLink = activeedRoute.snapshot.params['pictureLink'];
  }
 

  onModifyClick(): void {
    var password = prompt('Enter Password to Continue:');
  

    if (password !== null) {
     this.reportService.checkPassword(password, "modify", this.uniqueID );
    }
   
  

  }
}
