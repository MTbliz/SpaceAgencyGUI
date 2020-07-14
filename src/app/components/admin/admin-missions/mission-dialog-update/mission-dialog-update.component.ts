import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MissionsService } from 'src/app/services/missions.service';

export interface ImageryType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-mission-dialog-update',
  templateUrl: './mission-dialog-update.component.html',
  styleUrls: ['./mission-dialog-update.component.css']
})
export class MissionDialogUpdateComponent implements OnInit {

  types: ImageryType[] = [
    { value: 'TYPE_PANCHROMATIC', viewValue: 'Panchromatic' },
    { value: 'TYPE_MULTISPECTRAL', viewValue: 'Multispectral' },
    { value: 'TYPE_HYPERSPECTRAL', viewValue: 'Hyperspectral' }
  ];

  constructor(public dialogRef: MatDialogRef<MissionDialogUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private missionService: MissionsService) { }

  closeDialog() {
    this.dialogRef.close(null);
  }

  updateMission() {
    var mission = this.data;
    this.missionService.updateMission(mission).subscribe();
    this.dialogRef.close(mission);
  }

  ngOnInit(): void {
  }

}
