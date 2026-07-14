import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  total: number = 0;
  mensaje: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.checkoutForm = this.fb.group({
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiry: ['', Validators.required],
      cvv: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si no está logueado, lo mandamos al login
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para comprar.');
      this.router.navigate(['/login']);
      return;
    }

    // Si el carrito está vacío, lo mandamos al home
    if (this.cartService.getItems().length === 0) {
      this.router.navigate(['/']);
      return;
    }

    this.total = this.cartService.getTotal();
  }

  confirmarCompra() {
    if (this.checkoutForm.invalid || this.cargando) return;

    this.cargando = true;
    const { direccion, ciudad } = this.checkoutForm.value;

    this.orderService.createOrder(direccion, ciudad).subscribe({
      next: (resp) => {
        console.log('Pedido creado:', resp);
        this.mensaje = '¡Compra Exitosa! ID del Pedido: ' + resp.id;
        this.cartService.clearCart();
        this.cargando = false;
        this.cd.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Hubo un error al procesar el pedido.';
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }
}