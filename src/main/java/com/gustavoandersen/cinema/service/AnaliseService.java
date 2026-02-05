package com.gustavoandersen.cinema.service;

import com.gustavoandersen.cinema.data.AnaliseEntity;
import com.gustavoandersen.cinema.data.AnaliseRepository;
import com.gustavoandersen.cinema.data.FilmeEntity;
import com.gustavoandersen.cinema.data.FilmeRepository;
import com.gustavoandersen.cinema.dto.AnaliseDTO;
import com.gustavoandersen.cinema.exception.AnaliseNotFoundException;
import com.gustavoandersen.cinema.exception.FilmeNotFoundException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnaliseService {
    
    @Autowired
    AnaliseRepository analiseRepository;
    @Autowired
    FilmeRepository filmeRepository;
    @Autowired
    FilmeService fs;
    
    public AnaliseDTO criarAnalise(AnaliseDTO analise, String filme){
        FilmeEntity filmeEntity = filmeRepository.findByTitulo(filme)
                .orElseThrow(() -> new FilmeNotFoundException("Filme não encontrado"));
        
        AnaliseEntity analiseEntity = new AnaliseEntity();
        
        analiseEntity.setId(null);
        analiseEntity.setFilme(filmeEntity);
        analiseEntity.setTexto(analise.texto());
        analiseEntity.setNota(analise.nota());
        
        analiseRepository.save(analiseEntity);
        
        return new AnaliseDTO(
            analiseEntity.getFilme().getTitulo(),
            analiseEntity.getTexto(),
            analiseEntity.getNota());
    }
    
    public AnaliseDTO buscarAnalise(Integer id){
       AnaliseEntity pesquisa = analiseRepository.findById(id)
               .orElseThrow(() -> new AnaliseNotFoundException("Analise não encontrado"));
       
       return new AnaliseDTO(
               pesquisa.getFilme().getTitulo(),
               pesquisa.getTexto(),
               pesquisa.getNota()
               );
    }
    
    public List<AnaliseDTO> listarAnalise(){
        List<AnaliseEntity> pesquisa = analiseRepository.findAll();
        
        return pesquisa.stream()
                .map(a -> new AnaliseDTO(a.getFilme().getTitulo(), a.getTexto(), a.getNota()))
                .toList();
    }
    
    public AnaliseDTO atualizarAnalise(Integer id, AnaliseDTO pesquisa){
        AnaliseEntity analise = analiseRepository.findById(id)
                .orElseThrow(() -> new AnaliseNotFoundException("Analise não encontrada"));
        
        analise.setTexto(pesquisa.texto());
        analise.setNota(pesquisa.nota());
        
        return new AnaliseDTO(
                analise.getFilme().getTitulo(),
                analise.getTexto(),
                analise.getNota());
    }
    
    public void deletarAnalise(Integer id){
        analiseRepository.deleteById(id);
    }
}
