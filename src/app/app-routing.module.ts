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


const routes: Routes = [
{path: 'home', component: HomeComponent},
{path: 'missions', component: MissionsComponent},
{path: 'products', component: ProductsComponent,
children:[
  {path: 'all', component: AllProductsComponent},
]},
{path: 'admin', component: AdminComponent,
children:[
  {path: 'create-missions', component: AdminMissionsComponent},
  {path: 'create-products', component: AdminProductsComponent},
  {path: 'search-orders', component: AdminOrdersComponent},
]},
{path: '**', redirectTo:'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
