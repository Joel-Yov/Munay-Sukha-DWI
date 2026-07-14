import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Producto } from '../../services/product';
import { CartService } from '../../services/cart';
import { ProductDetailComponent } from '../../components/product-detail/product-detail';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ProductDetailComponent, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class CatalogoComponent implements OnInit {

  // Datos crudos del backend
  allProducts: Producto[] = [];
  filteredProducts: Producto[] = [];
  paginatedProducts: Producto[] = [];

  // Configuración
  categoryFilter: string = 'TODOS'; 
  currentPage: number = 1;
  pageSize: number = 9; 
  totalPages: number = 0;
  pagesArray: number[] = []; 

  loading: boolean = true;

  selectedProduct: Producto | null = null;
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProductos().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilter();
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // 1. Lógica de Filtrado
  setCategory(category: string) {
    this.categoryFilter = category;
    this.currentPage = 1; 
    this.applyFilter();
  }

  applyFilter() {
    let result = this.allProducts;

    if (this.categoryFilter === 'TODOS') {
      this.filteredProducts = this.allProducts;
    } else {
      this.filteredProducts = this.allProducts.filter(p =>
        p.categoria.toUpperCase() === this.categoryFilter
      );
    }
    if (this.categoryFilter !== 'TODOS') {
      result = result.filter(p =>
        p.categoria.toUpperCase() === this.categoryFilter
      );
    }
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term)
      );
    }
    this.filteredProducts = result;
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateView();
  }

  updateView() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateView();
      window.scrollTo(0, 0); 
    }
  }

  openModal(producto: Producto) {
    this.selectedProduct = producto;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  agregarAlCarrito(producto: Producto) {
    this.cartService.addToCart(producto);
    alert('Producto agregado al carrito');
  }
  onSearchChange() {
    this.applyFilter();
  }
}