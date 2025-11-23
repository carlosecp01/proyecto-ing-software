package com.asociados.wayne.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociados.wayne.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    
    // Consulta para buscar productos por nombre. 
    // COALESCE(:search, '') asegura que si 'search' es nulo, se busque por '%%' (todos los productos).
    @Query("SELECT p FROM Producto p WHERE lower(p.nombre) LIKE lower(concat('%', COALESCE(:search, ''), '%'))")
    List<Producto> searchByNombre(@Param("search") String search);
}