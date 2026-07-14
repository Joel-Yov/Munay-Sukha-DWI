package munay_sukha_backend.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import munay_sukha_backend.app.dto.JwtResponse;
import munay_sukha_backend.app.dto.LoginRequest;
import munay_sukha_backend.app.dto.RegistroRequest;
import munay_sukha_backend.app.model.Role;
import munay_sukha_backend.app.model.Usuario;
import munay_sukha_backend.app.repository.RoleRepository;
import munay_sukha_backend.app.repository.UsuarioRepository;
import munay_sukha_backend.app.security.jwt.JwtUtils;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository,
            RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail()).get();
        String rol = usuario.getRoles().stream().findFirst().get().getNombre();
        return ResponseEntity.ok(new JwtResponse(jwt, "Bearer", usuario.getId(), usuario.getEmail(), rol, usuario.getNombreCompleto()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistroRequest registroRequest) {
        
        // 1. VALIDACIÓN: Email Único
        if (usuarioRepository.existsByEmail(registroRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: ¡El correo ya está registrado!");
        }

        // 2. Crear Usuario
        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(registroRequest.getNombreCompleto());
        usuario.setEmail(registroRequest.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroRequest.getPassword()));

        // 3. Asignar Rol de CLIENTE Automáticamente
        // Buscamos el rol en la DB, si no existe, lanzamos error o creamos uno por defecto
        Role rolCliente = roleRepository.findByNombre("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Error: Rol de Cliente no encontrado."));
        
        usuario.setRoles(Collections.singleton(rolCliente));

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

}
