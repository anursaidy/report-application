import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Report } from '../report/report.model';
import { ReportService } from '../report.service';
import { Router } from '@angular/router';
import { LocationService } from '../location.service';
import { Location } from '../location.model';

@Component({
  selector: 'app-report-add-form',
  templateUrl: './report-add-form.component.html',
  styleUrl: './report-add-form.component.css',
})
export class ReportAddFormComponent implements OnInit {
  form: FormGroup;
  existingLocations: Location[] = [];

  newLocation: Location = {
    placeName: '',
    latitude: 0,
    longitude: 0,
    count: 0,
  };

  constructor(
    private reportService: ReportService,
    private locationService: LocationService,

    private router: Router
  ) {
    let formControls = {
      troublemakerName: new FormControl(),
      selectedLocation: new FormControl(),
      locationForm: new FormGroup({
        locationChoice: new FormControl(),
        selectedExistingLocation: new FormControl(),
        newLocation: new FormControl(),
        latitude: new FormControl(),
        longitude: new FormControl(),
      }),
      reporterName: new FormControl(),
      reporterPhone: new FormControl(),
      extraInfo: new FormControl(),
      checkImg: new FormControl(false),
      pictureLink: new FormControl(),
    };
    this.form = new FormGroup(formControls);
  }

  ngOnInit(): void {
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
    });
  }

  onMapClick(coord: L.LatLng) {
    this.form.get('locationForm.latitude')?.setValue(coord.lat.toFixed(2));
    this.form.get('locationForm.longitude')?.setValue(coord.lng.toFixed(2));
  }

  onSubmit(reportInfo: any) {
    //If user did not attach an image, use default face picture
    if (reportInfo.pictureLink == null) {
      reportInfo.pictureLink = 'assets/img-default.png';
    }

    var chosenLocation: Location | null = this.handleReportLocation(reportInfo);

    //When user created a new location that already existed, stop submission
    if (chosenLocation === null) {
      return;
    }
    //Use the report information to create a new report
    var newReport = new Report(
      this.uniqueIDGenerator(),
      reportInfo.troublemakerName,
      {
        placeName: chosenLocation.placeName,
        latitude: chosenLocation.latitude,
        longitude: chosenLocation.longitude,
        count: chosenLocation.count,
      },
      {
        reporterName: reportInfo.reporterName,
        reporterPhone: reportInfo.reporterPhone,
      },
      reportInfo.time,
      reportInfo.status,
      reportInfo.extraInfo,
      reportInfo.pictureLink
    );

   

    this.reportService.addReport(newReport);
    this.router.navigate(['/reportTable']);
  }

  handleReportLocation(reportInfo: any): Location | null {
    var chosenPlaceName!: string;
    //Check if user is making a new location or selecting an existing
    if (reportInfo.locationForm.selectedExistingLocation === null) {
      if (
        this.locationService.locationExists(reportInfo.locationForm.newLocation)
      ) {
        alert('Location already exists, use the existing location');

        return null;
      }
      this.locationService.addLocation(
        new Location(
          reportInfo.locationForm.newLocation,
          reportInfo.locationForm.latitude,
          reportInfo.locationForm.longitude,
          1
        )
      );
      this.existingLocations = this.locationService.getLocations();

      chosenPlaceName = reportInfo.locationForm.newLocation;
    } else if (reportInfo.locationForm.newLocation === null) {
      chosenPlaceName = reportInfo.locationForm.selectedExistingLocation;
    }

    var filteredLocation: Location[] = this.existingLocations.filter(
      (location) =>
        location.placeName.toLowerCase().includes(chosenPlaceName.toLowerCase())
    );

    if (reportInfo.locationForm.newLocation === null) {
      if (filteredLocation.length > 0) {
        filteredLocation[0].count++;
        this.locationService.updateLocationCount(filteredLocation[0]);
      }
    }
   
    return filteredLocation[0];
  }

  uniqueIDGenerator(): number {
    let uniqueID: number;
    do {
      uniqueID = Math.floor(Math.random() * 1000);
    } while (
      this.reportService
        .getReportList()
        .filter((report) => report.uniqueID === uniqueID).length > 0
    );

    return uniqueID;
  }
}
