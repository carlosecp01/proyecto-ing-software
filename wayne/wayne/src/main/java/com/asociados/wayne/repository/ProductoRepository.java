package com.asociados.wayne.repository;

import com.asociados.wayne.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    // CONSULTA FINAL: Usa LEFT JOIN y REPLACE/TRIM para normalizar los nombres 
    // y asegurar la coincidencia de filtros.
    @Query("SELECT p FROM Producto p " +
           // LEFT JOINs para incluir productos sin empresa (e) o categoría (c)
           "LEFT JOIN p.empresa e " + 
           "LEFT JOIN p.categoria c " +
           
           // Búsqueda por nombre
           "WHERE lower(p.nombre) LIKE lower(concat('%', COALESCE(:search, ''), '%')) " +
           
           // Filtro de Empresa: Normaliza el nombre de la DB quitando espacios (TRIM y REPLACE) 
           // para que coincida con el valor sin espacios del HTML (ej: "scjohnson").
           "AND (:brand IS NULL OR lower(REPLACE(TRIM(e.nombre), ' ', '')) = lower(:brand)) " + 
           
           // Filtro de Categoría: Usa TRIM() para espacios laterales.
           "AND (:category IS NULL OR lower(TRIM(c.nombre)) = lower(:category))")
    List<Producto> findFilteredProducts(
            @Param("search") String search,
            @Param("brand") String brand,
            @Param("category") String category);
}