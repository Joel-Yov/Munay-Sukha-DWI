package munay_sukha_backend.app.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
