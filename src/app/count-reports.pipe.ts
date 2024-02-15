import { Pipe, PipeTransform } from '@angular/core';
import{Report} from '../app/report/report.model'

@Pipe({
  name: 'countReports'
})
export class CountReportsPipe implements PipeTransform {

  transform(reportList:Report[]): number {
    return reportList.length;
  }

}
