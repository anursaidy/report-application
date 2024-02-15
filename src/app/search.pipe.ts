import { Pipe, PipeTransform } from '@angular/core';
import {Report} from '../app/report/report.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(reportList:Report[], query: string): Report[] {
    return reportList.filter((r) => r.troublemakerName.toLowerCase().includes(query.toLowerCase()));
  }

}
