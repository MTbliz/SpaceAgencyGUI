import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/home-page/navbar/navbar.component';
import { MaterialModule } from './material/material.module';
import { MissionsComponent } from './components/missions/missions.component';
import { ProductsComponent } from './components/products/products.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home-page/home/home.component';
import { AdminMissionsComponent } from './components/admin/admin-missions/admin-missions.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AllProductsComponent } from './components/products/all-products/all-products.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MissionsComponent,
    ProductsComponent,
    AdminComponent,
    HomeComponent,
    AdminMissionsComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AllProductsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
