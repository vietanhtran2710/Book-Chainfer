import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { TestComponent } from './test/test.component';
import { TokenComponent } from './token/token.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'test', component: TestComponent },
  { path: 'home', component: HomeComponent },
  { path: 'token/:user', component: TokenComponent},
  { path: 'view/:bookId', component: ViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
