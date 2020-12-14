import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlannerDataService} from '../../services/planner-data.service';
import {PlanSchema} from '../../types/plan';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
})
export class PlanDetailsComponent implements OnInit {

  editForm: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.required]),
    due: new FormControl(),
    finished: new FormControl(),
  });

  /**
   * The plan data before any changes were made. This data will be used as the default values on the editing form for the current plan.
   */
  private initialData: PlanSchema;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly plannerService: PlannerDataService) {
  }

  /**
   * Retrieves plan data provided by the route resolver and sets its values as default form values.
   */
  ngOnInit() {
    const data = this.route.snapshot.data.data;
    this.editForm.patchValue({
      task: data.task || '',
      due: data.due ? new Date(data.due) : null,
      finished: data.finished || false
    });
    this.initialData = data;
  }

  /**
   * Form changes will be saved onto all attached stores. If the data was successfully set the router will navigate back to the task list.
   */
  async editPlan() {
    const data = this.plannerService.data;
    const updateIndex = data.findIndex(d => d.id === this.initialData.id);
    if (updateIndex >= 0) {
      const date: Date = this.editForm.value.due;
      data[updateIndex] = {...this.editForm.value, due: date ? date.toISOString() : ''};
      this.plannerService.data = data;
      await this.router.navigateByUrl('/tasks');
    }
  }
}
