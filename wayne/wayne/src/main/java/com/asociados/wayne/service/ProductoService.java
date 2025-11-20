package com.asociados.wayne.service;

import com.asociados.wayne.dtos.ProductoCreationDto;
import com.asociados.wayne.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {

    List<Producto> findAll();

    Optional<Producto> findById(Integer id);

    // Métodos de administración
    Producto save(ProductoCreationDto dto);
    Producto update(Integer id, ProductoCreationDto dto);
    void delete(Integer id);
    
    // Método para filtrado y búsqueda
    List<Producto> findFiltered(String search, String brand, String category);
}