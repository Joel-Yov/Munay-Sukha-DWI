import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { CartService, CartItem } from './cart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = '/api/pedidos';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  createOrder(direccion: string, ciudad: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No estás logueado');

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // 1. Convertimos el carrito a un formato simple 
    const itemsSimples = this.cartService.getItems().map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad
    }));

    const body = {
      direccionEnvio: direccion,
      ciudad: ciudad,
      total: this.cartService.getTotal(),
      items: itemsSimples // Enviamos la lista simplificada
    };

    return this.http.post(`${this.apiUrl}/checkout`, body, { headers });
  }

  // Obtener TODOS los pedidos (Solo para Admin)
  getAllOrders(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
  updateOrderStatus(pedidoId: number, nuevoEstado: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.put(`${this.apiUrl}/${pedidoId}/estado`, {}, {
      headers,
      params: { estado: nuevoEstado }
    });
  }
  // Obtener historial del usuario logueado
  getMyOrders(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<any[]>(`${this.apiUrl}/mis-pedidos`, { headers });
  }
}