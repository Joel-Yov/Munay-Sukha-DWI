// src/app/interfaces/auth.ts

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    rol: string;
    nombre: string;
}

export interface RegistroRequest {
    nombreCompleto: string;
    email: string;
    password: string;
}