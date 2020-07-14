import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/security/_services/token-storage.service';
import { AuthService } from 'src/app/security/_services/auth.service';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { Product } from 'src/app/models/Product';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private roles: string[];
    isLoggedIn = false;
    showAdminBoard = false;
    username: string;
    badgeCount: number = 0;
    products: Product[] = [];
    
    constructor(private authService: AuthService,private tokenStorageService: TokenStorageService, private basketService: BasketService, private router: Router) { }
  
   ngOnInit() {
      this.isLoggedIn = !!this.tokenStorageService.getToken();
      
  
      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
  
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.username = user.username;
        this.products = this.basketService.loadProducts();
        if(this.products !== null ){
        this.badgeCount = this.products.length;
        }
      }
    }
  
    logout() {
      this.tokenStorageService.signOut();
      setTimeout(() => {
        this.authService.setLoggedIn(false)
                  localStorage.clear();
                  window.location.reload();
                }, 200);
  
    }
  }