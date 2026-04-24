package com.hoang.hot_desking.security;

import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.webauthn.registration.WebAuthnRegistrationFilter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try{
            // Extract JWT token from the Authorization header
            String jwt = getJwtFromRequest(request);

            //Validate token and ensure it's not expired or tampered with
            if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)){
                //Retrieve User ID from the token claims
                String userId = tokenProvider.getUserIdFromJWT(jwt);

                //Load user details from database to establish security context
                User user = userRepository.findById(UUID.fromString(userId)).orElse(null);

                if(user != null && user.getRole() != null){
                    //Create authentication object with user details and roles
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(user,null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    //Set the authentication in the Security Context for the current request thread
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }else {
                    log.warn("User with ID {} found in token but not found in Database", userId);
                }
            }
        }catch (Exception ex){
            logger.error("Could not set user authentication in security context", ex);
        }

        //Continue the filter chain execution
        filterChain.doFilter(request,response);
    }

    //Extracts the bearer token from the HTTP Authorization header
    private String getJwtFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);
        }
        return null;
    }
}
