package com.gustavoandersen.cinema.service;

import com.gustavoandersen.cinema.data.FilmeEntity;
import com.gustavoandersen.cinema.data.FilmeRepository;
import com.gustavoandersen.cinema.dto.FilmeDTO;
import com.gustavoandersen.cinema.exception.FilmeNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class FilmeService {
    
    @Autowired
    private FilmeRepository filmeRepository;
    
    public FilmeDTO criarFilme(FilmeDTO dto){
        FilmeEntity filme = new FilmeEntity();
        
        filme.setId(null);
        filme.setTitulo(dto.titulo());
        filme.setSinopse(dto.sinopse());
        filme.setGenero(dto.genero());
        filme.setLancamento(dto.lancamento());
        
        filmeRepository.save(filme);
        
        return new FilmeDTO(
            filme.getTitulo(),
            filme.getSinopse(),
            filme.getGenero(),
            filme.getLancamento());
    }
    
    public FilmeDTO procurarFilme(String titulo){
        FilmeEntity filme = filmeRepository.findByTitulo(titulo)
                .orElseThrow(() -> new FilmeNotFoundException("Filme não encontrado"));
        
        return new FilmeDTO(filme.getTitulo(), filme.getSinopse(), filme.getGenero(), filme.getLancamento());
    }
    
    public List<FilmeDTO> listarFilmes(){
        List<FilmeEntity> filmesEntity = filmeRepository.findAll();
        
        return filmesEntity.stream()
                .map(f -> new FilmeDTO(f.getTitulo(), f.getSinopse(), f.getGenero(), f.getLancamento()))
                .toList();
    }
    
    public FilmeDTO atualizarFilme(String titulo, FilmeDTO dto){
        FilmeEntity filme = filmeRepository.findByTitulo(titulo)
                .orElseThrow(() -> new FilmeNotFoundException("Filme não encontrado"));
        
        filme.setTitulo(dto.titulo());
        filme.setSinopse(dto.sinopse());
        filme.setGenero(dto.genero());
        filme.setLancamento(dto.lancamento());
        
        FilmeEntity atualizado = filmeRepository.save(filme);
        
        return new FilmeDTO(
            atualizado.getTitulo(),
            atualizado.getSinopse(),
            atualizado.getGenero(),
            atualizado.getLancamento());
    }
    
    @Transactional
    public void deletarFilme(String titulo) {
        FilmeEntity filme = filmeRepository.findByTitulo(titulo)
                .orElseThrow(() -> new FilmeNotFoundException("Filme não encontrado"));

        try {
            filmeRepository.delete(filme);
            filmeRepository.flush(); 
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException(
                "Não é possível deletar o filme porque existem análises vinculadas a ele."
            );
        }
    }
}
