import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissionsComponent } from './components/missions/missions.component';
import { ProductsComponent } from './components/products/products.component';
import { HomeComponent } from './components/home-page/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminMissionsComponent } from './components/admin/admin-missions/admin-missions.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AllProductsComponent } from './components/products/all-products/all-products.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { AuthGuardService } from './security/_services/auth-guard-service.service';
import { BasketComponent } from './components/basket/basket.component';
import { BasketProductsComponent } from './components/basket/basket-products/basket-products.component';
import { AllMissionComponent } from './components/missions/all-mission/all-mission.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  {
    path: 'missions', component: MissionsComponent, canActivate: [AuthGuardService],
    children: [
      { path: 'all', component: AllMissionComponent },
    ]
  },
  {
    path: 'products', component: ProductsComponent, canActivate: [AuthGuardService],
    children: [
      { path: 'all', component: AllProductsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'basket', component: BasketComponent, canActivate: [AuthGuardService],
    children: [
      { path: 'basket-products', component: BasketProductsComponent },
    ]
  },
  { path: 'myorders', component: MyOrdersComponent, canActivate: [AuthGuardService] },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuardService],
    children: [
      { path: 'create-missions', component: AdminMissionsComponent },
      { path: 'create-products', component: AdminProductsComponent },
      { path: 'search-orders', component: AdminOrdersComponent },
    ]
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
