import {DataStore} from './data-store';
import {Plan, PlanSchema} from '../../types/plan';
import {environment} from '../../../environments/environment';

/**
 * Implementation of a Data store which loads a representation of default plan data (hint: this stores data will be skipped).
 */
export class DefaultDataStore extends DataStore<Plan, PlanSchema> {

  /**
   * initializes this data store. The default values at parameter, if any will be used instead of the global default data.
   * @param defaults default data to be used at load-operations.
   */
  constructor(private readonly defaults?: PlanSchema[]) {
    super();
  }

  async load(): Promise<PlanSchema[]> {
    return this.defaults || environment.globalPlannerDefaults || [];
  }

  setItems(data: Plan[] | PlanSchema[]): Promise<any> {
    return Promise.resolve('default data cannot be reset!');
  }

  setItem(data: Plan): Promise<any> {
    return Promise.resolve('default data cannot be reset!');
  }

  patchItem(id: number, data: Plan): Promise<any> {
    return Promise.resolve('default data cannot be patched!');
  }

}
