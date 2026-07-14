package munay_sukha_backend.app.dto;

import java.util.List;
import lombok.Data;


@Data
public class PedidoRequest {
    private String direccionEnvio;
    private String ciudad;
    private Double total;
    private List<ItemRequest> items;
}
