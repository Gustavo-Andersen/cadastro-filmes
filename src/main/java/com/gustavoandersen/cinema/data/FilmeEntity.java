package com.gustavoandersen.cinema.data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Data;

@Data
@Entity
@Table(name="Filme")
public class FilmeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;        
    String titulo;
    String sinopse;
    String genero;
    LocalDate lancamento;
}
