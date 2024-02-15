import {Location} from '../location.model'

export class Report {
  public uniqueID: number;
  public troublemakerName: string;
  public location: Location;
  public reportedBy: { reporterName: string; reporterPhone: string };
  public time: Date;
  public status: boolean;
  public extraInfo: string;
  public pictureLink: string;
  constructor(
    uniqueID: number,
    troublemakerName: string,
    location: Location,
    reportedBy: { reporterName: string; reporterPhone: string },
    time: Date,
    status: boolean,
    extraInfo: string,
    pictureLink: string
  ) {
    this.uniqueID = uniqueID;

    this.troublemakerName = troublemakerName;
    this.location = location;
    this.reportedBy = reportedBy;
    this.time = time;
    this.status = status;
    this.extraInfo = extraInfo;
    this.pictureLink = pictureLink;
  }
}

