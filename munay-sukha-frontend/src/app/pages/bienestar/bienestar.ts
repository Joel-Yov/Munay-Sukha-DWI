import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Importante para llamar a la API
import { ProductService, Producto } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-bienestar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // <-- Agregado HttpClientModule
  templateUrl: './bienestar.html',
  styleUrl: './bienestar.scss'
})
export class BienestarComponent implements OnInit {

  // Inputs
  peso: number | null = null;
  altura: number | null = null;

  // Resultados
  imc: number = 0;
  estado: string = '';
  colorClass: string = '';
  mensajeDieta: string = ''; // Este ahora lo llenará la IA
  mostrarResultado: boolean = false;
  cargandoIA: boolean = false; // <-- Para mostrar un loader en tu HTML

  // Datos
  allProducts: Producto[] = [];
  productosSugeridos: Producto[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private http: HttpClient, // <-- Inyectamos HttpClient
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productService.getAllProductos().subscribe(data => {
      this.allProducts = data;
    });
  }

  calcularIMC() {
    if (!this.peso || !this.altura) {
      return;
    }

    const alturaMetros = this.altura / 100;
    this.imc = this.peso / (alturaMetros * alturaMetros);

    // 1. Calculamos el estado básico para los colores
    this.determinarEstado();

    // 2. Mostramos la pantalla de resultados con un loader
    this.mostrarResultado = true;

    // 3. Llamamos a la IA en lugar del método estático
    this.generarRecomendacionesConIA();
  }

  determinarEstado() {
    if (this.imc < 18.5) {
      this.estado = 'Bajo Peso';
      this.colorClass = 'danger';
    } else if (this.imc >= 18.5 && this.imc < 24.9) {
      this.estado = 'Peso Saludable';
      this.colorClass = 'success';
    } else if (this.imc >= 25.00 && this.imc < 29.9) {
      this.estado = 'Sobrepeso';
      this.colorClass = 'warning';
    } else {
      this.estado = 'Obesidad';
      this.colorClass = 'danger';
    }
  }

  generarRecomendacionesConIA() {

    if (this.allProducts.length === 0) return;

    this.cargandoIA = true;
    this.mensajeDieta = 'Consultando a nuestro especialista virtual de Munay & Sukha...';

    // Extraemos solo los nombres de los productos para enviarlos a la IA
    const catalogo = this.allProducts.map(p => p.nombre).join(', ');

    // Armamos el prompt mágico
    const prompt = `El usuario tiene un IMC de ${this.imc.toFixed(2)} (${this.estado}). 
    Nuestro catálogo actual es: ${catalogo}. 
    Actúa como un experto en bienestar, dale un mensaje alentador muy breve y dime cuáles 3 productos de este catálogo exacto le recomiendas.`;

    // Llamada a tu backend en Java (Ajusta el puerto y la URL según tu proyecto)
    this.http.post<any>('http://localhost:8080/api/ia/recomendar', { texto: prompt })
      .subscribe({
        next: (respuesta) => {
          // La IA te devuelve el mensaje motivador
          this.mensajeDieta = respuesta.mensaje;

          // La IA o tu backend te devuelve los nombres de los productos recomendados
          const nombresRecomendados = respuesta.nombresProductosIA || [];

          // 1. Imprimimos para ver qué llegó
          console.log("1. IA dice:", nombresRecomendados);
          console.log("2. BD tiene:", this.allProducts.map(p => p.nombre));

          // 2. El filtro invencible
          this.productosSugeridos = this.allProducts.filter(p => {
            const nombreDB = p.nombre.toLowerCase().trim();

            return nombresRecomendados.some((nombreIA: string) => {
              const nombreLimpioIA = nombreIA.toLowerCase().trim();
              return nombreLimpioIA.includes(nombreDB) || nombreDB.includes(nombreLimpioIA);
            });
          });

          // 3. Vemos el resultado
          console.log("3. Productos filtrados reales:", this.productosSugeridos);
          this.cargandoIA = false;
          
          // 2. ¡EL TOQUE MÁGICO! Obligamos a Angular a mostrar las tarjetas
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error con la IA', err);
          this.mensajeDieta = 'Hubo un error de conexión, pero te sugerimos mantener una dieta balanceada.';
          this.cargandoIA = false;
        }
      });
  }

  agregarAlCarrito(producto: Producto) {
    this.cartService.addToCart(producto);
    alert('Producto agregado para tu bienestar');
  }
}