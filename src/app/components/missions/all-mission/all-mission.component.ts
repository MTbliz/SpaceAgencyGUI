import { Component, OnInit, ViewChild } from '@angular/core';
import { Mission } from 'src/app/models/Mission';
import { MissionsService } from 'src/app/services/missions.service';
import { NgForm } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-all-mission',
  templateUrl: './all-mission.component.html',
  styleUrls: ['./all-mission.component.css']
})
export class AllMissionComponent implements OnInit {

  @ViewChild('missionForm') missionForm: NgForm;
  @ViewChild('fileInput') fileInput;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'type', 'startDate', 'finishDate','image', 'actions'];
  missions: Mission[] = []
  dataSource = new MatTableDataSource(this.missions);

  constructor(private missionsService: MissionsService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.getMissions();
  }

  transform(bytecode: string){
    var newUrl= 'data:image/png;base64,' + bytecode;
    return this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);
}

  applyFilterMissions(filterValue: string) {
    const dataPipe: DatePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      const formattedStartDate = dataPipe.transform(data.startDate, 'MM/dd/yyyy');
      const formattedFinishtDate = dataPipe.transform(data.finishDate, 'MM/dd/yyyy');

      return defaultPredicate(data, filter) ||
        formattedStartDate.indexOf(filter) >= 0 ||
        formattedFinishtDate.indexOf(filter) >= 0
        ;
    };
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getMissions() {
    this.missionsService.getMissions()
      .subscribe(response => {
        console.log(response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

}