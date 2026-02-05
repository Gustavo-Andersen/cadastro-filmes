
package com.gustavoandersen.cinema.data;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmeRepository extends JpaRepository<FilmeEntity, Integer> {
    Optional<FilmeEntity> findByTitulo(String titulo);
    
}
