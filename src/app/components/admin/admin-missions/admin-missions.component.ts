import { Component, OnInit, ViewChild } from '@angular/core';
import { Mission } from 'src/app/models/Mission';
import { MissionsService } from 'src/app/services/missions.service';
import { NgForm } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MissionDialogUpdateComponent } from './mission-dialog-update/mission-dialog-update.component';
import { MatDialog } from '@angular/material/dialog';

export interface ImageryType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin-missions',
  templateUrl: './admin-missions.component.html',
  providers: [MissionsService],
  styleUrls: ['./admin-missions.component.css']
})
export class AdminMissionsComponent implements OnInit {

  @ViewChild('missionForm') missionForm: NgForm;
  @ViewChild('fileInput') fileInput;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'type', 'startDate', 'finishDate', 'image', 'actions'];
  missions: Mission[] = []
  dataSource = new MatTableDataSource(this.missions);
  fileToUpload: File = null;

  types: ImageryType[] = [
    { value: 'TYPE_PANCHROMATIC', viewValue: 'Panchromatic' },
    { value: 'TYPE_MULTISPECTRAL', viewValue: 'Multispectral' },
    { value: 'TYPE_HYPERSPECTRAL', viewValue: 'Hyperspectral' }
  ];

  constructor(private missionsService: MissionsService, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMissions();
  }

  transform(bytecode: string) {
    var newUrl = 'data:image/png;base64,' + bytecode;
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

  onFileSelected(event) {

    this.fileToUpload = <File>event.target.files.item(0);
    this.fileInput.nativeElement.value = '';
  }

  onUpload() {
    const mission: Mission = new Mission(
      null,
      this.missionForm.value.name,
      this.missionForm.value.type,
      this.missionForm.value.startDate,
      this.missionForm.value.finishDate,
      this.fileToUpload
    )
    this.missionsService.createMission(mission)
      .subscribe(response => {
        this.dataSource.data.push(response);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    this.ClearForm();
  }

  ClearForm(): void {
    this.missionForm.reset();
    this.fileToUpload = null;
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

  deleteRecord(row, index) {
    this.missionsService.deleteMission(row.id).subscribe();
    this.dataSource.data.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  startEdit(row, index) {
    let dialogRef = this.dialog.open(MissionDialogUpdateComponent
      , { data: { id: row.id, name: row.name, type: row.type, startDate: row.startDate, finishDate: row.finishDate, fileDb: row.fileDb } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      } else {
        this.dataSource.data[index] = result;
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

}
