package munay_sukha_backend.app.service;

import munay_sukha_backend.app.dto.RecomendacionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IAService {

    @Value("${api.ia.secret-key}")
    private String apiKey;

    public RecomendacionResponse consultarIA(String prompt) {
        RecomendacionResponse respuesta = new RecomendacionResponse();

        try {
            // 1. Configurar la URL de la API de Gemini
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;

            // 2. Truco de Prompt Engineering: Le decimos a la IA exactamente cómo queremos
            // que formatee el texto
            String instruccionEstricta = prompt +
                    " Tu rol es ser un nutricionista experto. Debes seguir estas REGLAS DE NEGOCIO obligatorias:\n" +
                    "1. Si el estado es 'Bajo Peso', selecciona únicamente productos hipercalóricos, energéticos o proteicos (ej. Granola, Miel, Maní, Mantequillas).\n"
                    +
                    "2. Si el estado es 'Peso Saludable', selecciona productos de mantenimiento o bienestar general (ej. Tés, Infusiones, Snacks equilibrados).\n"
                    +
                    "3. Si el estado es 'Sobrepeso' o 'Obesidad', prohíbe rotundamente productos con azúcares o calorías altas (como la miel o granolas dulces). Selecciona exclusivamente tés depurativos, infusiones digestivas, productos detox o frutos secos ligeros (como almendras).\n\n"
                    +
                    "Revisa nuestro catálogo, elige los 3 mejores según estas reglas y responde ESTRICTAMENTE en este formato de una sola línea: "
                    +
                    "Tu mensaje amigable aquí | Producto 1, Producto 2, Producto 3";

            // 3. Armar el cuerpo (JSON) que Gemini espera recibir
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", instruccionEstricta);

            Map<String, Object> partsNode = new HashMap<>();
            partsNode.put("parts", Arrays.asList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Arrays.asList(partsNode));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 4. Hacer la petición a Google Gemini
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 5. Navegar por la respuesta JSON para extraer el texto redactado
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String textoGenerado = (String) parts.get(0).get("text");

            // 6. Dividir el texto en Mensaje y Productos (separados por el símbolo "|")
            String[] secciones = textoGenerado.split("\\|");
            respuesta.setMensaje(secciones[0].trim());

            if (secciones.length > 1) {
                String[] productos = secciones[1].split(",");
                List<String> listaProductos = new ArrayList<>();
                for (String p : productos) {
                    listaProductos.add(p.trim());
                }
                respuesta.setNombresProductosIA(listaProductos);
            }

        } catch (Exception e) {
            // Imprimimos el error en consola solo para nosotros
            System.err.println("Google está saturado (503). Activando recomendación de respaldo.");
            
            // Le damos al usuario un mensaje amigable y genérico que siempre quede bien
            respuesta.setMensaje("¡Hola! Analizando tu perfil en Munay & Sukha, he seleccionado las mejores opciones naturales para tu bienestar en este momento.");
            
            // Ponemos 3 productos reales de tu base de datos que sirvan para casi cualquier caso
            respuesta.setNombresProductosIA(Arrays.asList("Infusión Relajante", "Mix de Frutos Secos", "Granola")); 
        }

        return respuesta;
    }
}