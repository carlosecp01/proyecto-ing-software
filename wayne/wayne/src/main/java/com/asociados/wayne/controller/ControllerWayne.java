package com.asociados.wayne.controller;

import com.asociados.wayne.dtos.EmpresaDto;
import com.asociados.wayne.dtos.ProductoCreationDto;
import com.asociados.wayne.model.Producto;
import com.asociados.wayne.model.Usuario;
import com.asociados.wayne.service.EmpresaService;
import com.asociados.wayne.service.ProductoService;
import com.asociados.wayne.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ControllerWayne {

    private final UserServiceImpl userService;
    private final EmpresaService empresaService;
    private final ProductoService productoService;

    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam("Correo") String correo, @RequestParam("Password") String password) {
        return ResponseEntity.ok(userService.authenticate(correo, password));
    }

    @PostMapping("/login/register")
    public ResponseEntity<String> register(@RequestBody Usuario usuario) {
        userService.register(usuario);
        return ResponseEntity.ok("Usuario registrado con exito");
    }

    @GetMapping("/empresas")
    public ResponseEntity<List<EmpresaDto>> listEmpresas() {
        return ResponseEntity.ok(empresaService.findAll());
    }

    @GetMapping("/empresas/{id}")
    public ResponseEntity<EmpresaDto> productosPorEmpresa(@PathVariable Integer id) {
        return ResponseEntity.ok(empresaService.findById(id));
    }

    // --- Productos ---
    // ENDPOINT DE FILTRADO
    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> listProductos(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(productoService.findFiltered(search, brand, category));
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> getProducto(@PathVariable Integer id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ENDPOINTS DE ADMINISTRACIÓN
    @PostMapping("/productos")
    public ResponseEntity<Producto> createProducto(@RequestBody ProductoCreationDto dto) {
        try {
            Producto nuevoProducto = productoService.save(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (ResponseStatusException e) {
            System.err.println("Error al crear producto: " + e.getReason());
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Integer id, @RequestBody ProductoCreationDto dto) {
        try {
            Producto productoActualizado = productoService.update(id, dto);
            return ResponseEntity.ok(productoActualizado);
        } catch (ResponseStatusException e) {
            System.err.println("Error al actualizar producto: " + e.getReason());
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        try {
            productoService.delete(id);
            return ResponseEntity.noContent().build(); 
        } catch (ResponseStatusException e) {
            System.err.println("Error al eliminar producto: " + e.getReason());
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }
}