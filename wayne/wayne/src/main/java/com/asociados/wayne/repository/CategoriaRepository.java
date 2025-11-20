package com.asociados.wayne.repository;

import com.asociados.wayne.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // CLAVE: findByNombreIgnoreCase (Ignora mayúsculas/minúsculas)
    Optional<Categoria> findByNombreIgnoreCase(String nombre);
}