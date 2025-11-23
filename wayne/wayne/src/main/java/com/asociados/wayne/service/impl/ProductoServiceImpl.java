package com.asociados.wayne.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.asociados.wayne.dtos.ProductoCreationDto;
import com.asociados.wayne.model.Producto;
import com.asociados.wayne.repository.ProductoRepository;
import com.asociados.wayne.service.ProductoService;

import jakarta.transaction.Transactional; // IMPORTANTE: Asegúrate de que este import sea correcto

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    // Si usas Empresa/Categoría en el DTO, necesitarás inyectar sus Repositorios aquí
    // private final EmpresaRepository empresaRepository; 
    // private final CategoriaRepository categoriaRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> findAll() {
        // Llama a la búsqueda sin parámetros (nulo) para obtener todos
        return searchProducts(null); 
    }
    
    // 🛑 IMPLEMENTACIÓN DEL MÉTODO DE BÚSQUEDA SIMPLE
    @Override
    public List<Producto> searchProducts(String search) {
        // Si el 'search' es nulo o vacío, se convierte a NULL.
        String finalSearch = (search != null && search.trim().isEmpty()) ? null : search;
        return productoRepository.searchByNombre(finalSearch); // 🛑 LLAMADA CORREGIDA
    }

    @Override
    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id);
    }
    
    @Override
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    // ⚠️ Implementaciones Placeholder de DTO para que compile el servicio
    // Necesitarás reemplazar estos cuerpos con tu lógica real de mapeo de DTO y asignación de Empresa/Categoría.
    
    @Override
    public Producto save(ProductoCreationDto dto) {
         // Ejemplo de lógica mínima:
         Producto nuevoProducto = new Producto(); 
         nuevoProducto.setNombre(dto.name());
         nuevoProducto.setDescripcion(dto.description());
         // Aquí iría la lógica para buscar Empresa y Categoría por nombre y asignarlas.
         return productoRepository.save(nuevoProducto);
    }
    
    @Override
    @Transactional
    public Producto update(Integer id, ProductoCreationDto dto) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
        
        productoExistente.setNombre(dto.name());
        productoExistente.setDescripcion(dto.description());
        // Lógica de actualización de otros campos...
        
        return productoRepository.save(productoExistente);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Producto con ID " + id + " no encontrado para eliminar.");
        }
        productoRepository.deleteById(id);
    }
}