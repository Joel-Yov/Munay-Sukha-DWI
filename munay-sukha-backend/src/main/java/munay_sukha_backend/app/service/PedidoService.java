package munay_sukha_backend.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import munay_sukha_backend.app.model.*;
import munay_sukha_backend.app.repository.PedidoRepository;
import munay_sukha_backend.app.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    // La anotación @Transactional asegura que toda la operación se complete o se
    // revierta (rollback)
    @Transactional
    public Pedido crearPedido(Usuario usuario, Pedido nuevoPedido, List<ItemPedido> items) throws Exception {

        // 1. Validar Stock y Calcular Total
        double totalCalculado = 0.0;
        for (ItemPedido item : items) {
            Optional<Producto> productoOpt = productoRepository.findById(item.getProducto().getId());

            if (productoOpt.isEmpty()) {
                throw new Exception("Producto con ID " + item.getProducto().getId() + " no encontrado.");
            }
            Producto producto = productoOpt.get();

            if (producto.getStock() < item.getCantidad()) {
                throw new Exception("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // 2. Descontar Stock y Fijar Precio Unitario
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            item.setPrecioUnitario(producto.getPrecio());
            totalCalculado += item.getCantidad() * producto.getPrecio();
        }

        // 3. Crear Pedido
        nuevoPedido.setUsuario(usuario);
        // Validar que el total calculado coincida con el total enviado por el cliente
        if (Math.abs(nuevoPedido.getTotal() - totalCalculado) > 0.01) {
            throw new Exception("Error de cálculo de total.");
        }

        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // 4. Guardar Detalles
        for (ItemPedido item : items) {
            item.setPedido(pedidoGuardado);
        }
        pedidoGuardado.setItems(items);

        return pedidoRepository.save(pedidoGuardado);
    }

    // Métodos para el Administrador
    public Pedido actualizarEstado(Long id, EstadoPedido estado) throws Exception {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new Exception("Pedido no encontrado."));
        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    // Obtener pedidos de un usuario específico
    public List<Pedido> getPedidosByUsuario(Usuario usuario) {
        return pedidoRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

}
