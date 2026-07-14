package munay_sukha_backend.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import munay_sukha_backend.app.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByEmail(String email);
    Boolean existsByEmail(String email);
}
