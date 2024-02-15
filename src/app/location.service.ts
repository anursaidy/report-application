import { Injectable } from '@angular/core';
import { Location } from '../app/location.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root',
})
export class LocationService {
  locationList: Location[];

  constructor(private http: HttpClient) {
    this.locationList = [];
  }

  getLocations() {
    return this.locationList;
  }

  setLocations(locationList: Location[]) {
    this.locationList = locationList;
  }

  loadLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(
      'https://272.selfip.net/apps/Qb6JJZybIZ/collections/locationList/documents/'
    );
  }

  addLocation(newLocation: Location): void {

    this.http.post('https://272.selfip.net/apps/Qb6JJZybIZ/collections/locationList/documents/', {
      "key": newLocation.placeName,
      "data":{
        "location": {
          "placeName": newLocation.placeName,
          "latitude": newLocation.latitude,
          "longitude": newLocation.longitude,
          "count": newLocation.count,
        }
      }
    }).subscribe((data:any) => {
        this.loadLocations();
    });

    this.locationList.push(newLocation);
  }

 

  updateLocationCount(updatedLocation:Location){

    this.http.put(`https://272.selfip.net/apps/Qb6JJZybIZ/collections/locationList/documents/${updatedLocation.placeName}/`, {
      "key": updatedLocation.placeName,
      "data":{
        "location": {
          "placeName": updatedLocation.placeName,
          "latitude": updatedLocation.latitude,
          "longitude": updatedLocation.longitude,
          "count": updatedLocation.count,
        }
      }
    }).subscribe((data:any) => {
        this.loadLocations();
        if (updatedLocation.count === 0) {
          this.deleteLocation(updatedLocation.placeName);
        }
      window.location.reload();
   
    });
 
  }

  deleteLocation(placeName:string) {
    this.http.delete(`https://272.selfip.net/apps/Qb6JJZybIZ/collections/locationList/documents/${placeName}/`)
    .subscribe(() => {
      this.loadLocations();
    });
  }

  locationExists(chosenPlaceName:string):boolean{
    var filteredLocation: Location[] = this.locationList.filter(
      (location) =>
        location.placeName.toLowerCase().includes(chosenPlaceName.toLowerCase())
    );
      if(filteredLocation.length >0){ //Not empty, it exists
        return true;
      }
      else{
        return false;
      }
  }
}
