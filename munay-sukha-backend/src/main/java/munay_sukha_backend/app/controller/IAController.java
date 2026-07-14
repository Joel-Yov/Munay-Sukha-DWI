package munay_sukha_backend.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import munay_sukha_backend.app.dto.PromptRequest;
import munay_sukha_backend.app.dto.RecomendacionResponse;
import munay_sukha_backend.app.service.IAService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/ia")
public class IAController {
    @Autowired
    private IAService iaService; // Llamamos a la capa de servicio

    @PostMapping("/recomendar")
    public ResponseEntity<RecomendacionResponse> obtenerRecomendacion(@RequestBody PromptRequest request) {
        // El controlador solo delega la tarea al servicio
        RecomendacionResponse respuesta = iaService.consultarIA(request.getTexto());
        return ResponseEntity.ok(respuesta);
    }
}
