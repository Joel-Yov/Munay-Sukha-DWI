package munay_sukha_backend.app.dto;

import java.util.List;

public class RecomendacionResponse {
    private String mensaje;
    private List<String> nombresProductosIA;

    // Getters y Setters
    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public List<String> getNombresProductosIA() {
        return nombresProductosIA;
    }

    public void setNombresProductosIA(List<String> nombresProductosIA) {
        this.nombresProductosIA = nombresProductosIA;
    }
}
