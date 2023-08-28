import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrationsComponent } from './integrations.component';

const routes: Routes = [
	{
		path: '',
		component: IntegrationsComponent
	},
	{
		path: 'upwork',
		loadChildren: () => import('../upwork/upwork.module').then(
			(m) => m.UpworkModule
		)
	},
	{
		path: 'hubstaff',
		loadChildren: () => import('../hubstaff/hubstaff.module').then(
			(m) => m.HubstaffModule
		)
	},
	{
		path: 'gauzy-ai',
		loadChildren: () => import('./gauzy-ai/gauzy-ai.module').then(
			(m) => m.GauzyAIModule
		)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class IntegrationsRoutingModule { }
