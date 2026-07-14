package munay_sukha_backend.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import munay_sukha_backend.app.model.Producto;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>{

    List<Producto> findByCategoria(String categoria);

    List<Producto> findTop6ByStockGreaterThan(Integer stock);

}
