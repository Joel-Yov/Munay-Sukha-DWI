package munay_sukha_backend.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import munay_sukha_backend.app.dto.ItemRequest;
import munay_sukha_backend.app.dto.PedidoRequest;
import munay_sukha_backend.app.model.*;
import munay_sukha_backend.app.repository.UsuarioRepository;
import munay_sukha_backend.app.service.PedidoService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;
    private final UsuarioRepository usuarioRepository;

    public PedidoController(PedidoService pedidoService, UsuarioRepository usuarioRepository) {
        this.pedidoService = pedidoService;
        this.usuarioRepository = usuarioRepository;
    }

    // POST: /api/pedidos/checkout
    @PostMapping("/checkout")
    public ResponseEntity<?> realizarCheckout(@RequestBody PedidoRequest pedidoRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            // 1. Convertir DTO a Entidad Pedido
            Pedido nuevoPedido = new Pedido();
            nuevoPedido.setDireccionEnvio(pedidoRequest.getDireccionEnvio());
            nuevoPedido.setCiudad(pedidoRequest.getCiudad());
            nuevoPedido.setTotal(pedidoRequest.getTotal());

            // 2. Convertir lista de Items DTO a Entidades ItemPedido
            List<ItemPedido> items = new ArrayList<>();
            for (ItemRequest itemReq : pedidoRequest.getItems()) {
                // Buscamos el producto por ID
                Producto p = new Producto();
                p.setId(itemReq.getProductoId()); // Hibernate lo buscará por ID luego

                ItemPedido item = new ItemPedido();
                item.setProducto(p);
                item.setCantidad(itemReq.getCantidad());
                items.add(item);
            }

            // 3. Llamar al servicio
            Pedido pedidoGuardado = pedidoService.crearPedido(usuario, nuevoPedido, items);
            return ResponseEntity.ok(pedidoGuardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // GET: /api/pedidos (RUTA PROTEGIDA: Solo para ADMIN - configurado en
    // SecurityConfig)
    @GetMapping
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    // GET: /api/pedidos/mis-pedidos
    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<Pedido>> getMisPedidos(@AuthenticationPrincipal UserDetails userDetails) {
        // 1. Buscamos al usuario que está logueado
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Devolvemos SOLO sus pedidos
        return ResponseEntity.ok(pedidoService.getPedidosByUsuario(usuario));
    }

    // PUT: /api/pedidos/{id}/estado (RUTA PROTEGIDA: Solo para ADMIN)
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestParam EstadoPedido estado) {
        try {
            Pedido pedidoActualizado = pedidoService.actualizarEstado(id, estado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
