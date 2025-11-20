package com.asociados.wayne.dtos;

import java.math.BigDecimal;

// Refleja exactamente los datos enviados desde el frontend
public record ProductoCreationDto(
        String name,
        String description,
        BigDecimal price,
        String brand,
        String category,
        String imageUrl
) {
}