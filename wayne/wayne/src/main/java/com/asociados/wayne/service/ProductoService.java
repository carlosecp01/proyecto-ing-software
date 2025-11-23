package com.asociados.wayne.service;

import java.util.List;
import java.util.Optional;

import com.asociados.wayne.dtos.ProductoCreationDto;
import com.asociados.wayne.model.Producto; // Asumimos que esta clase existe

public interface ProductoService {

    List<Producto> findAll(); 
    
    // Firma del método de búsqueda simple
    List<Producto> searchProducts(String search);

    Optional<Producto> findById(Integer id);
    
    // Métodos CRUD básicos
    Producto save(Producto producto); 

    // Métodos CRUD con DTO (Necesarios para la creación/edición desde el JS)
    Producto save(ProductoCreationDto dto);
    Producto update(Integer id, ProductoCreationDto dto);
    void delete(Integer id);
}