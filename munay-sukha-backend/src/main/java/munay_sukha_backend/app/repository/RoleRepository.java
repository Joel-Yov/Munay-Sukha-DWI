package munay_sukha_backend.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import munay_sukha_backend.app.model.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long>{
    Optional<Role> findByNombre(String nombre);
}
