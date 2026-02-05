package com.gustavoandersen.cinema.data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="analise")
public class AnaliseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;
    
    @ManyToOne
    @JoinColumn(name="filme_id")
    FilmeEntity filme;
    
    String texto;
    int nota;
}
