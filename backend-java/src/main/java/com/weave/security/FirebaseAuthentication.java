package com.weave.security;

import com.weave.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class FirebaseAuthentication implements Authentication {
    private final User user;
    private boolean authenticated = true;
    
    public FirebaseAuthentication(User user) {
        this.user = user;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }
    
    @Override
    public Object getCredentials() {
        return null;
    }
    
    @Override
    public Object getDetails() {
        return user;
    }
    
    @Override
    public Object getPrincipal() {
        return user;
    }
    
    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }
    
    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }
    
    @Override
    public String getName() {
        return user.getEmail();
    }
    
    public User getUser() {
        return user;
    }
}


