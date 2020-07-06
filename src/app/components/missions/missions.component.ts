import { Component, OnInit } from '@angular/core';
import { MissionsService } from 'src/app/services/missions.service';


@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  providers: [MissionsService],
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {

  constructor(private missionService: MissionsService) { }

  ngOnInit(): void {
  }

}
