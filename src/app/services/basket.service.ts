import { Injectable } from '@angular/core';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {


  constructor() { }

  addProducts(productsToAdd: Product[]) {

    if (localStorage.getItem('cart') == null) {
      var cart: any = [];
      for (var i = 0; i < productsToAdd.length; i++) {
        cart.push(JSON.stringify(productsToAdd[i]));
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location.reload();
    } else {
      let productsFromCart: Product[] = [];
      productsFromCart = this.loadProducts();
      let newProductsArray: Product[] = []
      newProductsArray = this.peventDuplicateValidator(productsFromCart, productsToAdd);
      var updatedCart: any = [];
      for (var i = 0; i < newProductsArray.length; i++) {
        updatedCart.push(JSON.stringify(newProductsArray[i]));
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.location.reload();
    }
  }

  public loadProducts(): Product[] {
    if (localStorage.getItem('cart') != null) {
      var productsFromCart: Product[] = [];
      var cart: any = JSON.parse(localStorage.getItem('cart'));
      for (var i = 0; i < cart.length; i++) {
        let product: Product = JSON.parse(cart[i]);
        productsFromCart.push(product);
      }
      return productsFromCart;
    } else {
      return null;
    }
  }

  removeProducts(products: Product[]) {
    var loadedProducts: Product[] = this.loadProducts();

    for (var i = 0; i < products.length; i++) {
      var prodcuctToRemove: number = loadedProducts.findIndex(p => p.id == products[i].id)
      loadedProducts.splice(prodcuctToRemove, 1);
    }
    var cart: any = [];
    for (var i = 0; i < loadedProducts.length; i++) {
      cart.push(JSON.stringify(loadedProducts[i]));
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload();
  }

  clearCart() {
    localStorage.removeItem('cart');
    window.location.reload();
  }

  private peventDuplicateValidator(existingProducts: Product[], productsToAdd: Product[]): Product[] {
    let newProductsArray: Product[] = existingProducts;
    productsToAdd.forEach(p => {
      if (!newProductsArray.map(item => item.id).includes(p.id)) {
        newProductsArray.push(p)
      }
    });
    return newProductsArray;
  };

}