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
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { AuthGuardService } from './security/_services/auth-guard-service.service';
import { BasketComponent } from './components/basket/basket.component';
import { BasketProductsComponent } from './components/basket/basket-products/basket-products.component';
import { AllMissionComponent } from './components/missions/all-mission/all-mission.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { MissionDialogUpdateComponent } from './components/admin/admin-missions/mission-dialog-update/mission-dialog-update.component';

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
    LoginComponent,
    RegisterComponent,
    BasketComponent,
    BasketProductsComponent,
    AllMissionComponent,
    MyOrdersComponent,
    MissionDialogUpdateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
