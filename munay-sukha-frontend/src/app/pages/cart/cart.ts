import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {

  // 1. Declaramos la variable sin inicializarla
  cartItems$!: Observable<CartItem[]>; 

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    // 2. Aquí inicializamos la variable dado que el servicio ya se ejecuto
    this.cartItems$ = this.cartService.cart$;
  }

  eliminar(id: number) {
    this.cartService.removeFromCart(id);
  }
}