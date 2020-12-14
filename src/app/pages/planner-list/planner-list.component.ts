import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlannerDataService} from '../../services/planner-data.service';
import {PlanSchema} from '../../types/plan';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {compare, compareDates, compareStates} from '../../util/compare.util';
import {CreatePlanComponent} from '../../ui-components/create-plan/create-plan.component';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-planner-list',
  templateUrl: './planner-list.component.html',
})
export class PlannerListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['finished', 'text', 'due', 'actions'];

  /**
   * The data source object that is connected to the displayed data table. The state will be updated on changes.
   */
  dataSource = new MatTableDataSource<PlanSchema>([]);

  /**
   * The data change observer for tasks changes.
   */
  planObserver$: Observable<PlanSchema[]> = this.plannerService.dataAsObservable$;

  /**
   * This subscriber waits for data changes and overwrites the new values onto the views data representation.
   */
  planChangeSubscriber: Subscription;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly plannerService: PlannerDataService) {
  }

  /**
   * Opens the creation modal for a new task item. If an item was created, it will be saved into all attached stores.
   */
  openModal() {
    const dialogRef = this.matDialog.open(CreatePlanComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().pipe(
      filter(result => !!result)
    ).subscribe(result => this.plannerService.setItem(result));
  }

  /**
   * Changes the finishing state of the task item with the given id to the given state.
   * @param checked the new finish state to be set.
   * @param id the id of the corresponding item to be updated.
   */
  finishTask(checked: boolean, id: number) {
    const data = this.plannerService.data;
    const updateIndex = data.findIndex(d => d.id === id);
    if (updateIndex >= 0) {
      this.plannerService.patchItem(updateIndex, {...data[updateIndex], finished: checked});
    }
  }

  /**
   * The sort function that wil reorder the displayed data in the table if triggered.
   * The main implementation is strongly orientated on the angular material sort header docs
   * (src = https://material.angular.io/components/sort/overview)!
   * @param sort the sort header that triggers the sorting.
   */
  sortData(sort: Sort) {
    const data = this.plannerService.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'text':
          return compare(a.task || 0, b.task || 0, isAsc);
        case 'finished':
          return compareStates(a.finished, b.finished, isAsc);
        case 'due':
          return compareDates(a.due, b.due, isAsc);
        default:
          return 0;
      }
    });
  }

  ngOnInit() {
    this.planChangeSubscriber = this.planObserver$.subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.planChangeSubscriber.unsubscribe();
  }
}
