package munay_sukha_backend.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import munay_sukha_backend.app.model.EstadoPedido;
import munay_sukha_backend.app.model.Pedido;
import munay_sukha_backend.app.model.Usuario;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario); 
    
    
    List<Pedido> findByEstado(EstadoPedido estado);
}
