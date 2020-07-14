import { Component, OnInit, ViewChild } from '@angular/core';
import { AllProductsComponent } from './all-products/all-products.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { NgForm } from '@angular/forms';
import { Coordinate } from 'src/app/models/Coordinate';

export interface ImageryType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  @ViewChild('searchForm') searchForm: NgForm;

  types: ImageryType[] = [
    { value: 'TYPE_PANCHROMATIC', viewValue: 'Panchromatic' },
    { value: 'TYPE_MULTISPECTRAL', viewValue: 'Multispectral' },
    { value: 'TYPE_HYPERSPECTRAL', viewValue: 'Hyperspectral' }
  ];

  constructor(private communicationService: CommunicationService) { }

  ngOnInit(): void {

  }

  clearForm() {
    this.searchForm.reset();
  }

  clearMessages(): void {
    this.communicationService.clearMessages();
  }

  sendMissionNameToService() {
    let str: string = "missionName:" + JSON.stringify(this.searchForm.value.missionName);
    this.communicationService.sendMessage(str);
  }

  sendMissionTypeToService() {
    let str: string = "missionType:" + JSON.stringify(this.searchForm.value.type);
    this.communicationService.sendMessage(str);
  }

  sendCoordinateToService() {
    let coordinate: Coordinate = new Coordinate(null, this.searchForm.value.latitude, this.searchForm.value.longitude);
    let str: string = "coordinate:" + JSON.stringify(coordinate);
    this.communicationService.sendMessage(str);
  }

  sendGreaterThenDateToService() {
    let str: string = "greaterThenDate:" + JSON.stringify(this.searchForm.value.greaterThenDate);
    this.communicationService.sendMessage(str);
  }

  sendLessThenDateToService() {
    let str: string = "lessThenDate:" + JSON.stringify(this.searchForm.value.greaterThenDate);
    this.communicationService.sendMessage(str);
  }

  sendStartEndDateToService() {
    let startDate: Date = this.searchForm.value.startDate;
    let endDate: Date = this.searchForm.value.endDate;
    let dates: Date[] = [startDate, endDate];
    let str: string = "startEndDate:" + JSON.stringify(dates);
    this.communicationService.sendMessage(str);
  }
  sendMostOrderedMessageToService() {
    let str: string = "mostOrdered:";
    this.communicationService.sendMessage(str);
  }
}
