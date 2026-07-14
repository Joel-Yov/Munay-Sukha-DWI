package munay_sukha_backend.app.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import munay_sukha_backend.app.model.Role;
import munay_sukha_backend.app.model.Usuario;
import munay_sukha_backend.app.repository.RoleRepository;
import munay_sukha_backend.app.repository.UsuarioRepository;

import java.util.Collections;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UsuarioRepository usuarioRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Crear Roles si no existen
        crearRolSiNoExiste("ROLE_ADMIN");
        crearRolSiNoExiste("ROLE_CLIENTE");

        // 2. CREAR SUPER ADMIN (Si no existe)
        if (!usuarioRepository.existsByEmail("admin@munay.com")) {
            Usuario admin = new Usuario();
            admin.setNombreCompleto("Super Administrador");
            admin.setEmail("admin@munay.com");
            // Aquí definimos la contraseña del admin: "admin123"
            admin.setPassword(passwordEncoder.encode("admin123"));

            // Asignar rol de ADMIN
            Role rolAdmin = roleRepository.findByNombre("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado"));

            admin.setRoles(Collections.singleton(rolAdmin));

            usuarioRepository.save(admin);
            System.out.println(">>> SUPER ADMIN CREADO: admin@munay.com / admin123");
        }

        // 3. CREAR CLIENTE DE PRUEBA
        if (!usuarioRepository.existsByEmail("cliente@munay.com")) {
            Usuario cliente = new Usuario();
            cliente.setNombreCompleto("Cliente Test");
            cliente.setEmail("cliente@munay.com");
            cliente.setPassword(passwordEncoder.encode("password123"));

            Role rolCliente = roleRepository.findByNombre("ROLE_CLIENTE").get();
            cliente.setRoles(Collections.singleton(rolCliente));

            usuarioRepository.save(cliente);
            System.out.println(">>> 👤 Cliente Test Creado: cliente@munay.com / password123");
        }
    }

    private void crearRolSiNoExiste(String nombre) {
        if (roleRepository.findByNombre(nombre).isEmpty()) {
            Role rol = new Role();
            rol.setNombre(nombre);
            roleRepository.save(rol);
        }
    }

    
}