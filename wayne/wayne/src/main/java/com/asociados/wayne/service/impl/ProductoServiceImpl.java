package com.asociados.wayne.service.impl;

import com.asociados.wayne.dtos.ProductoCreationDto;
import com.asociados.wayne.model.Categoria;
import com.asociados.wayne.model.Empresa;
import com.asociados.wayne.model.Producto;
import com.asociados.wayne.repository.CategoriaRepository; 
import com.asociados.wayne.repository.EmpresaRepository;   
import com.asociados.wayne.repository.ProductoRepository;
import com.asociados.wayne.service.ProductoService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository; 
    private final EmpresaRepository empresaRepository;   

    public ProductoServiceImpl(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository,
            EmpresaRepository empresaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.empresaRepository = empresaRepository;
    }
    
    // ... (Métodos CRUD findAll, findById, save, update, delete omitidos por brevedad)
    
    @Override
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }
    
    @Override
    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id);
    }
    
    @Override
    @Transactional
    public Producto save(ProductoCreationDto dto) {
        Empresa empresa = null; 
        Categoria categoria = null; 
        
        Producto nuevoProducto = Producto.builder()
                .nombre(dto.name())
                .descripcion(dto.description())
                .logo(dto.imageUrl()) 
                .empresa(empresa)      
                .categoria(categoria)  
                .precioCompra(dto.price()) 
                .precioVenta(dto.price())  
                .createdAt(LocalDateTime.now())
                .build();

        return productoRepository.save(nuevoProducto);
    }
    
    @Override
    @Transactional
    public Producto update(Integer id, ProductoCreationDto dto) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Producto con ID " + id + " no encontrado."));
        
        Empresa empresa = null; 
        Categoria categoria = null; 
        
        productoExistente.setNombre(dto.name());
        productoExistente.setDescripcion(dto.description());
        productoExistente.setLogo(dto.imageUrl());
        
        if (dto.price() != null) {
            productoExistente.setPrecioCompra(dto.price()); 
            productoExistente.setPrecioVenta(dto.price()); 
        }
        
        productoExistente.setEmpresa(empresa); 
        productoExistente.setCategoria(categoria);
        
        return productoRepository.save(productoExistente);
    }
    
    @Override
    @Transactional
    public void delete(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Producto con ID " + id + " no encontrado para eliminar.");
        }
        productoRepository.deleteById(id);
    }
    
    // MÉTODO DE FILTRADO
    @Override
    public List<Producto> findFiltered(String search, String brand, String category) {
        
        // DEBUG: Imprimir los valores recibidos para confirmar la sincronización
        System.out.println("DEBUG: Valores recibidos en findFiltered:");
        System.out.println("  Search: " + search);
        System.out.println("  Brand (Empresa): " + brand);
        System.out.println("  Category: " + category);

        // Convierte 'all' a null para que la consulta JPQL lo ignore
        String finalBrand = "all".equalsIgnoreCase(brand) ? null : brand;
        String finalCategory = "all".equalsIgnoreCase(category) ? null : category;
        
        // Si la búsqueda es NULL o vacía, la convertimos a NULL 
        // para que COALESCE en el Repository la convierta a "".
        String finalSearch = (search != null && search.trim().isEmpty()) ? null : search;
        
        return productoRepository.findFilteredProducts(finalSearch, finalBrand, finalCategory);
    }
}