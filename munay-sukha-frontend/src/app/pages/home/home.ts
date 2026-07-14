import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Producto } from '../../services/product';
import { CartService } from '../../services/cart'; 
import { ProductDetailComponent } from '../../components/product-detail/product-detail';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductDetailComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  productos: Producto[] = [];
  errorMensaje: string = '';

  selectedProduct: Producto | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productService.getProductosDestacados().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos destacados:', data);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMensaje = 'No se pudo conectar con el Backend.';
        this.cd.detectChanges();
      }
    });
  }
  openModal(producto: Producto) {
    this.selectedProduct = producto;
  }

  closeModal() {
    this.selectedProduct = null;
  }
  agregarAlCarrito(producto: Producto) {
    this.cartService.addToCart(producto);
  }
}