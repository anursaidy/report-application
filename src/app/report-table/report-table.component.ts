import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Report } from '../report/report.model';
import { ReportService } from '../report.service';
import { Location } from '../location.model';
import { LocationService } from '../location.service';

//Component to keep track of all the reports

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrl: './report-table.component.css',
})
export class ReportTableComponent implements AfterViewInit, OnInit {
  query: string;
  existingLocations: Location[] = [];
  reportTable: Report[] = [];

  constructor(
    private reportService: ReportService,
    private locationService: LocationService
  ) {
    this.query = '';
  }
  ngAfterViewInit(): void {
    this.subscribeGetReports();
  }
  ngOnInit(): void {
    this.subscribeGetReports();
  }

  subscribeGetReports(): void {
    this.reportService.loadReports().subscribe((reports: Report[]) => {
      var tempList: Report[] = reports.map((report: any) => {
        return new Report(
          report.key,
          report.data.troublemakerName,
          report.data.location,
          report.data.reportedBy,
          report.data.time,
          report.data.status,
          report.data.extraInfo,
          report.data.pictureLink
        );
      });

      this.reportService.setReportList(tempList);
      this.reportTable = this.reportService.getReportList();
    });
  }

  onReportDelete(event: { reportUniqueID: number }): void {
    //Will specify that this event object must have the attribute reportUniqueID
    let deletedReport = event.reportUniqueID;

    this.reportService.deleteReport(deletedReport).subscribe(() => {
      var tempList = this.reportService.getReportList();
      this.reportService.setReportList(
        tempList.filter((report) => report.uniqueID !== deletedReport)
      );
      this.reportTable = this.reportService.getReportList();
      //Reduce count for that report's location
      var filteredDeletedReport = tempList.filter(
        (report) => report.uniqueID === deletedReport
      );

      this.reduceLocationCount(filteredDeletedReport[0].location);
    });

    console.log(`Report: ${event.reportUniqueID} has been deleted`);
  }

  reduceLocationCount(deletedReport: Location) {
    this.locationService.loadLocations().subscribe((locationsData) => {
      var tempLocList: Location[] = locationsData.map((location: any) => {
        return new Location(
          location.data.location.placeName,
          location.data.location.latitude,
          location.data.location.longitude,
          location.data.location.count
        );
      });
      this.locationService.setLocations(tempLocList);
      this.existingLocations = this.locationService.getLocations();

      var filteredLocation: Location[] = this.existingLocations.filter(
        (location) =>
          location.placeName
            .toLowerCase()
            .includes(deletedReport.placeName.toLowerCase())
      );
      console.log(filteredLocation);
      filteredLocation[0].count--;
      this.locationService.updateLocationCount(filteredLocation[0]);
    });
  }

  sortData(column: string): void {
    //a is one report, b is the other report then compare
    this.reportTable.sort((a, b) => {
      if (this.getColumnInfo(a, column) > this.getColumnInfo(b, column)) {
        return 1; //Positive value
      } else if (
        this.getColumnInfo(a, column) < this.getColumnInfo(b, column)
      ) {
        return -1; //Negative value
      }
      return 0;
    });
  }

  getColumnInfo(report: Report, column: string): string | Date | boolean {
    switch (column) {
      case 'location':
        return report.location.placeName;
      case 'troublemakerName':
        return report.troublemakerName;
      case 'time':
        return report.time;
      case 'status':
        return report.status;
      default:
        return '';
    }
  }
}
