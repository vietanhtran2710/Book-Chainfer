import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'test', component: TestComponent },
  {path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
