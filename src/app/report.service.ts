import { Injectable } from '@angular/core';
import { Report } from '../app/report/report.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class ReportService {
  reportList: Report[];
 
  constructor(private http: HttpClient, private router: Router) {
    this.reportList = [];
  }

  setReportList(reportList: Report[]) {
    this.reportList = reportList;
  }
  getReportList() {
    return this.reportList;
  }

  loadReports(): Observable<Report[]> {
    return this.http.get<Report[]>(
      'https://272.selfip.net/apps/Qb6JJZybIZ/collections/reportList/documents/'
    );
  }


  addReport(newReport: Report) {
    newReport.time = new Date();
    newReport.status = true;
    this.reportList.push(newReport);

    this.http
      .post(
        'https://272.selfip.net/apps/Qb6JJZybIZ/collections/reportList/documents/',
        {
          key: newReport.uniqueID,
          data: {
            id: newReport.uniqueID,
            troublemakerName: newReport.troublemakerName,
            location: {
              placeName: newReport.location.placeName,
              latitude: newReport.location.latitude,
              longitude: newReport.location.longitude,
            },
            reportedBy: {
              reporterName: newReport.reportedBy.reporterName,
              reporterPhone: newReport.reportedBy.reporterPhone,
            },
            time: new Date(),
            status: true,
            extraInfo: newReport.extraInfo,
            pictureLink: newReport.pictureLink,
          },
        }
      )
      .subscribe((data: any) => {
        this.loadReports();
      });
  }

  checkPassword(password: string, choice: string, uniqueID: number): Observable<Report[]>|void {
    var validPassword = 'fcab0453879a2b2281bc5073e3f5fe54';
    //Password should be BaggyJeans

    //hashes password
    this.http
      .get(`https://api.hashify.net/hash/md5/hex?value=${password}`)
      //data is the response
      .subscribe((data: any) => {
        var hashedPassword = data.Digest;

        //Compare password hash with validPassword
        if (hashedPassword === validPassword) {
          alert('Valid Password, Granted Access');

          if (choice === 'modify') {
            this.modifyStatus(uniqueID);
          }
          else if(choice !== 'delete'){ //Update this portion
            
          }
        } else {
          alert('Invalid Password, Access Denied');     
        }
      });
  }

  modifyStatus(uniqueID: number) {
    this.loadReports().subscribe((reports: Report[]) => {
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

      this.setReportList(tempList);

      var filteredReport: Report[] = this.getReportList().filter(
        (report) => report.uniqueID === uniqueID
      );
      this.updateReportStatus(filteredReport[0]);
    });
  }

 

  updateReportStatus(report: Report) {
    //modify status
    var newStatus = !report.status;

    this.http
      .put(
        `https://272.selfip.net/apps/Qb6JJZybIZ/collections/reportList/documents/${report.uniqueID}/`,
        {
          key: report.uniqueID,
          data: {
            id: report.uniqueID,
            troublemakerName: report.troublemakerName,
            location: {
              placeName: report.location.placeName,
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            },
            reportedBy: {
              reporterName: report.reportedBy.reporterName,
              reporterPhone: report.reportedBy.reporterPhone,
            },
            time: report.time,
            status: newStatus,
            extraInfo: report.extraInfo,
            pictureLink: report.pictureLink,
          },
        }
      )
      .subscribe((data: any) => {
        this.loadReports();

       this.router.navigate(['/reportTable']);
    
      });
  }

  deleteReport(deletedReport: number): Observable<Report[]> {
    return this.http.delete<Report[]>(
      `https://272.selfip.net/apps/Qb6JJZybIZ/collections/reportList/documents/${deletedReport}/`
    );
  }
}
