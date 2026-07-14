import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent {

  @Input() product!: Producto;
  @Output() close = new EventEmitter<void>();

  showCartModal: boolean = false;

  constructor(private cartService: CartService) { }

  addToCart() {
    this.cartService.addToCart(this.product);
    this.showCartModal = true;
  }

  closeCartModal() {
    this.showCartModal = false;
  }

  closeDetail() {
    this.close.emit();
  }
}