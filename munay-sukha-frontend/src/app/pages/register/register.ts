import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  // Lógica centralizada para redirigir
  private handleSuccessRedirect() {
    this.mensajeError = ''; 
    this.mensajeExito = '¡Registro exitoso! Redirigiendo al login...';

    setTimeout(() => {
      this.isSubmitting = false; 
      this.router.navigate(['/login']);
    }, 1500);
  }

  onSubmit() {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; 
    const { nombreCompleto, email, password } = this.registerForm.value;

    this.authService.register({ nombreCompleto, email, password }).subscribe({
      next: (res) => {
        this.handleSuccessRedirect();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Respuesta del servidor:', err);

        if (err.status === 200 || err.status === 201) {
          this.handleSuccessRedirect();
          return;
        }

        if (err.statusText === 'OK' || (err.error && err.error.text && err.error.text.includes('creado'))) {
          this.handleSuccessRedirect();
          return;
        }

        this.isSubmitting = false; 

        let errorMsg = 'Ocurrió un error al registrarse.';

        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.message) {
          errorMsg = err.message;
        }

        if (errorMsg.toLowerCase().includes('existe') || errorMsg.toLowerCase().includes('duplicate')) {
          this.mensajeError = 'Este usuario ya está registrado. Intenta iniciar sesión.';
        } else {
          this.mensajeError = `Error: ${errorMsg}`;
        }
      }
    });
  }
}