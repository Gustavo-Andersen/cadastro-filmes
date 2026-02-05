package com.gustavoandersen.cinema.controller;

import com.gustavoandersen.cinema.dto.FilmeDTO;
import com.gustavoandersen.cinema.exception.FilmeNotFoundException;
import com.gustavoandersen.cinema.service.FilmeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/filme")
public class FilmeController {
    
    @Autowired
    FilmeService fs;
    
    @PostMapping("/adicionar")
    public ResponseEntity<?> addFilme(@RequestBody FilmeDTO dto){
        try{
            FilmeDTO novoFilme = fs.criarFilme(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoFilme);
        } catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/pesquisar")
    public ResponseEntity<?> searchFilme(@RequestParam String titulo){
        try{
            FilmeDTO filme = fs.procurarFilme(titulo);
            return ResponseEntity.status(HttpStatus.OK).body(filme);
        }catch(FilmeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping("/listar")
    public ResponseEntity<?> listFilme(){
        try{
            List<FilmeDTO> filmes = fs.listarFilmes();
            return ResponseEntity.status(HttpStatus.OK).body(filmes);
        }catch(FilmeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @PutMapping("/atualizar")
    public ResponseEntity<?> updateFilme(@RequestBody FilmeDTO dto, @RequestParam String titulo){
        try{
            FilmeDTO atualizado = fs.atualizarFilme(titulo, dto);
            return ResponseEntity.status(HttpStatus.OK).body(atualizado);
        }catch(FilmeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/deletar")
    public ResponseEntity<?> deleteFilme(@RequestParam String titulo){
        try{
            fs.deletarFilme(titulo);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(FilmeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
