package com.gustavoandersen.cinema.exception;


public class FilmeNotFoundException extends RuntimeException {
    public FilmeNotFoundException(String msg){
        super(msg);
    }
}
