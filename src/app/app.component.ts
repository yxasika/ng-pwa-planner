import {Component, OnInit} from '@angular/core';
import {PlannerDataService} from './services/planner-data.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private readonly plannerService: PlannerDataService) {
  }

  ngOnInit(): void {
    this.plannerService.loadDataFromStores();
  }
}
