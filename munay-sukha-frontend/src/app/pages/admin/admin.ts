import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order';
import { ProductService, Producto } from '../../services/product';
import { AuthService } from '../../services/auth';
import { ImageUploadService } from '../../services/image-upload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {

  // --- VARIABLES DE VISTA ---
  currentView: string = 'pedidos';
  loading: boolean = false;
  errorMensaje: string = '';

  // --- VARIABLES DE PEDIDOS ---
  pedidos: any[] = [];
  expandedPedidoId: number | null = null;
  estadosPosibles = ['PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  // --- VARIABLES DE PRODUCTOS ---
  productos: Producto[] = [];
  showModal: boolean = false;


  newProduct: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: 'MUNAY',
    urlImagen: ''
  };

  // 2. NUEVA VARIABLE DE ESTADO
  uploading: boolean = false;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private imageService: ImageUploadService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.authService.getUserRole() !== 'ROLE_ADMIN') {
      this.router.navigate(['/']);
      return;
    }
    this.loadData();
  }

  switchView(view: string) {
    this.currentView = view;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    if (this.currentView === 'pedidos') {
      this.orderService.getAllOrders().subscribe(data => {
        this.pedidos = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    } else {
      this.productService.getAllProductos().subscribe(data => {
        this.productos = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
  }

  // --- MÉTODOS DE PEDIDOS ---

  toggleDetalles(id: number) {
    if (this.expandedPedidoId === id) {
      this.expandedPedidoId = null;
    } else {
      this.expandedPedidoId = id;
    }
  }

  cambiarEstado(pedido: any, nuevoEstado: string) {
    if (!confirm(`¿Cambiar estado a ${nuevoEstado}?`)) {
      this.loadData();
      return;
    }
    this.orderService.updateOrderStatus(pedido.id, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;
        alert('Estado actualizado.');
        this.cd.detectChanges();
      },
      error: () => alert('Error al actualizar estado.')
    });
  }

  // --- MÉTODOS DE PRODUCTOS ---

  openProductModal() {
    this.showModal = true;
    this.newProduct = { id: 0, nombre: '', descripcion: '', precio: 0, stock: 0, categoria: 'MUNAY', urlImagen: '' };
    this.uploading = false;
  }
  openEditModal(producto: Producto) {
    this.showModal = true;
    this.newProduct = { ...producto };
  }

  closeProductModal() {
    this.showModal = false;
    this.newProduct = { id: 0, nombre: '', descripcion: '', precio: 0, stock: 0, categoria: 'MUNAY', urlImagen: '' };
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.uploading = true; // Activar spinner o texto de carga

      this.imageService.uploadImage(file).subscribe({
        next: (response) => {
          // ImgBB devuelve la url en response.data.url
          this.newProduct.urlImagen = response.data.url;
          this.uploading = false;
          this.cd.detectChanges(); // Forzar actualización visual
        },
        error: (err) => {
          console.error(err);
          alert('Error al subir la imagen. Intenta con otra más ligera.');
          this.uploading = false;
        }
      });
    }
  }

  saveProduct() {
    if (this.newProduct.id && this.newProduct.id > 0) {

      this.productService.updateProduct(this.newProduct.id, this.newProduct).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.closeProductModal();
          this.loadData();
        },
        error: () => alert('Error al actualizar producto')
      });

    } else {

      this.productService.createProduct(this.newProduct).subscribe({
        next: () => {
          alert('Producto creado exitosamente');
          this.closeProductModal();
          this.loadData();
        },
        error: () => alert('Error al crear producto')
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('¿Eliminar producto?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadData());
    }
  }
}