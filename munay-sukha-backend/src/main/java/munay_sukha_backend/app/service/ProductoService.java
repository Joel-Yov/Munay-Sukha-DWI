package munay_sukha_backend.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import munay_sukha_backend.app.model.Producto;
import munay_sukha_backend.app.repository.ProductoRepository;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Autowired
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> findAllProductos() {
        return productoRepository.findAll();
    }

    public List<Producto> findProductosByCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    public List<Producto> findProductosDestacados() {
        return productoRepository.findTop6ByStockGreaterThan(0);
    }

    public Producto saveProducto(Producto producto) {
        if (producto.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser positivo.");
        }
        if (producto.getId() != null && producto.getId() == 0) {
            producto.setId(null);
        }
        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }
}
