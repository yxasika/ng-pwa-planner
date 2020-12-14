import {Injectable} from '@angular/core';
import {DataService} from './data-service';
import {Plan, PlanSchema} from '../types/plan';
import {DefaultDataStore} from './store/default-data-store';
import {LocalforageDataStore} from './store/localforage-data-store';

/**
 * Data service implementation that manages Plan and PlanSchema data. This Service is initialized with a default data service (can be
 * further configured) and a localForage store that has higher priority (so it will overwrite the loaded default data).
 */
@Injectable({
  providedIn: 'root'
})
export class PlannerDataService extends DataService<Plan, PlanSchema> {

  constructor() {
    const opts = {
      stores: [
        {
          priority: 0, store: new DefaultDataStore()
        },
        {
          priority: 1, store: new LocalforageDataStore()
        },
      ]
    };
    super(opts);
  }

}
