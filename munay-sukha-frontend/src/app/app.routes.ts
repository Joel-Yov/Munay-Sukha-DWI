import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { CartComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout';
import { AdminComponent } from './pages/admin/admin';
import { RegisterComponent } from './pages/register/register';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { BienestarComponent } from './pages/bienestar/bienestar';
import { MyOrdersComponent } from './pages/my-orders/my-orders';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta raíz
  { path: 'login', component: LoginComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'bienestar', component: BienestarComponent },
  { path: 'mis-pedidos', component: MyOrdersComponent },
  { path: '**', redirectTo: '' }
];