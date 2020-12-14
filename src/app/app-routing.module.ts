import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlannerListComponent} from './pages/planner-list/planner-list.component';
import {PlanDetailsComponent} from './pages/plan-details/plan-details.component';
import {PlanResolverService} from './resolver/plan-resolver.service';

const routes: Routes = [{
  path: '', redirectTo: 'tasks', pathMatch: 'full'
}, {
  path: 'tasks', component: PlannerListComponent
}, {
  path: 'tasks/:id', resolve: {data: PlanResolverService}, component: PlanDetailsComponent
}, {
  path: '', redirectTo: 'tasks', pathMatch: 'prefix'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
