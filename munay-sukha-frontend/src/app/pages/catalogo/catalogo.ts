import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Producto } from '../../services/product';
import { CartService } from '../../services/cart';
import { ProductDetailComponent } from '../../components/product-detail/product-detail';
import { IaService } from '../../services/ia';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ProductDetailComponent, FormsModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class CatalogoComponent implements OnInit, AfterViewChecked {

  allProducts: Producto[] = [];
  filteredProducts: Producto[] = [];
  paginatedProducts: Producto[] = [];

  categoryFilter: string = 'TODOS';
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;
  pagesArray: number[] = [];

  loading: boolean = true;

  selectedProduct: Producto | null = null;
  searchTerm: string = '';
  showCartModal: boolean = false;

  showIaModal: boolean = false;
  iaInput: string = '';
  iaLoading: boolean = false;
  chatMessages: { role: string; text: string }[] = [
    { role: 'bot', text: '¡Hola! Soy IA Joel, tu nutricionista virtual. Cuéntame cómo te sientes o qué necesitas y te recomendaré los mejores productos de nuestro catálogo.' }
  ];

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private iaService: IaService,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewChecked() {
    if (this.showIaModal && this.chatBody) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }

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
    this.showCartModal = true;
  }

  closeCartModal() {
    this.showCartModal = false;
  }
  onSearchChange() {
    this.applyFilter();
  }

  toggleIaModal() {
    this.showIaModal = !this.showIaModal;
  }

  closeIaModal() {
    this.showIaModal = false;
  }

  sendIaMessage() {
    const text = this.iaInput.trim();
    if (!text || this.iaLoading) return;

    this.chatMessages.push({ role: 'user', text });
    this.iaInput = '';
    this.iaLoading = true;

    this.iaService.recomendar(text).subscribe({
      next: (res) => {
        this.chatMessages.push({ role: 'bot', text: res.mensaje });
        if (res.nombresProductosIA?.length) {
          this.chatMessages.push({
            role: 'bot',
            text: '📦 Te recomiendo: ' + res.nombresProductosIA.join(', ')
          });
        }
        this.iaLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.chatMessages.push({
          role: 'bot',
          text: 'Lo siento, tuve un problema al conectarme. Por favor intenta de nuevo.'
        });
        this.iaLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}