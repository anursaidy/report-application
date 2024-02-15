import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { LocationService } from '../location.service';
import {Location} from '../location.model'
 
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  existingLocations: Location[] =[];
  @Output() mapClick: EventEmitter<L.LatLng> = new EventEmitter<L.LatLng>();

  constructor(private locationService: LocationService) {}

  ngAfterViewInit(): void {
    this.initializeLocations();
  }

  ngOnInit(): void {
    this.showMap();
    this.initializeLocations();

    this.map.on('click', (e) => {
      this.mapClick.emit(e.latlng);
    });
  }

  showMap() {
    this.map = L.map('mapid').setView([49.27, -123], 11);

    const tiles = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
      }
    ).addTo(this.map);
  }

  initializeLocations() {

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
      this.existingLocations.forEach(location =>{
        this.putLabels(location);
      })
    });
  
  }


  putLabels(location: Location){
    L.marker([location.latitude, location.longitude])
    .addTo(this.map)
    .bindPopup(location.placeName + ':<br />' + location.count + ' Nuisance Reports');
  }
}
