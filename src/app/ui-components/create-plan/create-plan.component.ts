import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Plan} from '../../types/plan';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
})
export class CreatePlanComponent {

  planForm = new FormGroup({
    task: new FormControl('', [Validators.required]),
    due: new FormControl()
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CreatePlanComponent>) {
  }

  /**
   * The input data will be casted to the plan dto object prototype and delegated to the calling component for further processing
   * like saving or updating existing data.
   */
  createPlan() {
    const date: Date = this.planForm.value.due;
    const data = {...this.planForm.value, due: date ? date.toISOString() : ''};
    this.closeModal(data);
  }

  /**
   * Closes the model with the provided plan data for further processing.
   * @param data the plan to be delegated.
   */
  closeModal(data?: Plan) {
    this.dialogRef.close(data);
  }
}
