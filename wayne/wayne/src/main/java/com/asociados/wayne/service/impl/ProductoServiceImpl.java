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
        return searchProducts(null); 
    }
    
    @Override
    public List<Producto> searchProducts(String search) {
        String finalSearch = (search != null && search.trim().isEmpty()) ? null : search;
        return productoRepository.searchByNombre(finalSearch);
    }

    @Override
    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id);
    }
    
    @Override
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    // 🛑 IMPLEMENTACIÓN CORREGIDA Y COMPLETA PARA CREACIÓN (POST)
    @Override
    public Producto save(ProductoCreationDto dto) {
         Producto nuevoProducto = new Producto(); 
         
         // ✅ Mapeo de campos del DTO a la Entidad Producto:
         nuevoProducto.setNombre(dto.name());
         nuevoProducto.setDescripcion(dto.description());
         nuevoProducto.setPrecioVenta(dto.price()); // ✅ CORREGIDO: Usando dto.price()
         nuevoProducto.setLogo(dto.imageUrl()); // ✅ CORREGIDO: Usando dto.imageUrl()
         
         // Lógica para Empresa y Categoría (Pendiente de implementar)
         /*
         if (dto.brand() != null && !dto.brand().isEmpty()) { // Usando dto.brand()
             Empresa empresa = empresaRepository.findByNombre(dto.brand())
                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa no encontrada: " + dto.brand()));
             nuevoProducto.setEmpresa(empresa);
         }
         if (dto.category() != null && !dto.category().isEmpty()) { // Usando dto.category()
             Categoria categoria = categoriaRepository.findByNombre(dto.category())
                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada: " + dto.category()));
             nuevoProducto.setCategoria(categoria);
         }
         */
         
         return productoRepository.save(nuevoProducto);
    }
    
    // 🛑 IMPLEMENTACIÓN CORREGIDA Y COMPLETA PARA MODIFICACIÓN (PUT)
    @Override
    @Transactional
    public Producto update(Integer id, ProductoCreationDto dto) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
        
        // ✅ Mapeo de campos del DTO a la Entidad Producto:
        productoExistente.setNombre(dto.name());
        productoExistente.setDescripcion(dto.description());
        productoExistente.setPrecioVenta(dto.price()); // ✅ CORREGIDO: Usando dto.price()
        productoExistente.setLogo(dto.imageUrl()); // ✅ CORREGIDO: Usando dto.imageUrl()
        
        // Lógica para Empresa y Categoría (Pendiente de implementar)
        /*
        if (dto.brand() != null && !dto.brand().isEmpty()) { // Usando dto.brand()
            Empresa empresa = empresaRepository.findByNombre(dto.brand())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa no encontrada: " + dto.brand()));
            productoExistente.setEmpresa(empresa);
        }
        if (dto.category() != null && !dto.category().isEmpty()) { // Usando dto.category()
            Categoria categoria = categoriaRepository.findByNombre(dto.category())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada: " + dto.category()));
            productoExistente.setCategoria(categoria);
        }
        */
        
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