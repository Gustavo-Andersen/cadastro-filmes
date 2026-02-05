
package com.gustavoandersen.cinema.dto;

import java.time.LocalDate;

public record FilmeDTO(
        String titulo,
        String sinopse,
        String genero,
        LocalDate lancamento) {

}
