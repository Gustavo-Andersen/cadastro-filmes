package com.gustavoandersen.cinema.controller;

import com.gustavoandersen.cinema.dto.AnaliseDTO;
import com.gustavoandersen.cinema.exception.AnaliseNotFoundException;
import com.gustavoandersen.cinema.exception.FilmeNotFoundException;
import com.gustavoandersen.cinema.service.AnaliseService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analise")
public class AnaliseController {
    
    @Autowired
    AnaliseService as;
    
    @PostMapping("/adicionar")
    public ResponseEntity<?> addAnalise(@RequestParam String titulo, @RequestBody AnaliseDTO dto){
        try{
            AnaliseDTO analiseNova = as.criarAnalise(dto, titulo);
            return ResponseEntity.status(HttpStatus.CREATED).body(analiseNova); 
        }catch(FilmeNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @GetMapping("/pesquisar/{id}")
    public ResponseEntity<?> searchAnalise(@PathVariable Integer id){
        try{
            AnaliseDTO dto = as.buscarAnalise(id);
            return ResponseEntity.status(HttpStatus.OK).body(dto);
        }catch(AnaliseNotFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @GetMapping("/listar")
    public ResponseEntity<?> listAnalise(){
        try{
            List<AnaliseDTO> dto = as.listarAnalise();
            return ResponseEntity.status(HttpStatus.OK).body(dto);
        }catch(AnaliseNotFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping("/atualizar{id}")
    public ResponseEntity<?> updateAnalise(@RequestBody AnaliseDTO dto, @PathVariable Integer id){
        try{
            AnaliseDTO update = as.atualizarAnalise(id, dto);
            return ResponseEntity.status(HttpStatus.OK).body(update);
        }catch(AnaliseNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/deletar{id}")
    public ResponseEntity<?> deleteAnalise(@PathVariable Integer id){
        try{
            as.deletarAnalise(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(AnaliseNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
