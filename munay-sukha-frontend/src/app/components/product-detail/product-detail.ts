import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent {

  @Input() product!: Producto; // Recibe el producto a mostrar
  @Output() close = new EventEmitter<void>(); // Emite evento para cerrar

  constructor(private cartService: CartService) { }

  addToCart() {
    this.cartService.addToCart(this.product);
    this.close.emit(); // Opcional: cerrar al agregar
  }

  closeModal() {
    this.close.emit();
  }
}