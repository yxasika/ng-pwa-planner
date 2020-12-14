import {Injectable} from '@angular/core';
import {PlanSchema} from '../types/plan';
import {Resolve} from '@angular/router/src/interfaces';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {PlannerDataService} from '../services/planner-data.service';

/**
 * Route resolver service to load a plan item from supplied id in route path.
 * If no item was found, the router will navigate to the root path.
 */
@Injectable({
  providedIn: 'root'
})
export class PlanResolverService implements Resolve<PlanSchema> {
  private readonly redirectUrl: string = '/tasks';

  protected constructor(private readonly plannerService: PlannerDataService,
                        private readonly router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PlanSchema> {
    const id = await route.paramMap.get('id');
    if (id) {
      const resolvedData = this.plannerService.data.find(plan => plan.id === +id);
      if (resolvedData) {
        return resolvedData;
      }
    }
    await this.router.navigateByUrl(this.redirectUrl);
    return undefined;
  }
}
