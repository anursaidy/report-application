export class Location {
  placeName: string;
  latitude: number;
  longitude: number;
  count:number;

  constructor(placeName: string, latitude: number, longitude: number, count:number) {
    this.placeName = placeName;
    this.latitude = latitude;
    this.longitude = longitude;
    this.count= count;
  }
}
