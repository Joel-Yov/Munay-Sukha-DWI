package munay_sukha_backend.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "item_pedido")
@Data
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación Muchos a Uno: Un ítem pertenece a un solo pedido
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnore
    private Pedido pedido;

    // El producto que se compró
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    // DATOS ESTÁTICOS AL MOMENTO DE LA COMPRA
    @Column(nullable = false)
    private Integer cantidad;

    // Precio unitario al momento de la compra
    @Column(nullable = false)
    private Double precioUnitario;
}
