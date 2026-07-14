package munay_sukha_backend.app.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private String nombreCompleto;
    private String email;
    private String password;
}
