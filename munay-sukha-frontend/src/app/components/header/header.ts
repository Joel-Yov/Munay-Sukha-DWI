import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Importar módulos de rutas
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  userName: string | null = '';
  isAdmin: boolean = false;
  cartCount: number = 0;
  isMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + item.cantidad, 0);
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName(); // Obtener nombre real
      const role = this.authService.getUserRole();
      this.isAdmin = (role === 'ROLE_ADMIN');
    } else {
      this.isAdmin = false;
    }

  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}