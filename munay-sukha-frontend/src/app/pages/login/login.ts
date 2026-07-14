import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <--- Importante
import { Router, RouterLink } from '@angular/router'; // Para redirigir al Home
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Definimos las reglas del formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (data) => {
          console.log('Login exitoso:', data);
          this.router.navigate(['/']); // Redirigir al Home
        },
        error: (err) => {
          console.error('Error login:', err);
          this.errorMensaje = 'Credenciales incorrectas o error en el servidor.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // Mostrar errores si el usuario no llenó nada
    }
  }
}