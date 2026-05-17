package com.hoang.hot_desking.config;

import com.hoang.hot_desking.security.CustomOAuth2UserService;
import com.hoang.hot_desking.security.JwtAuthenticationFilter;
import com.hoang.hot_desking.security.OAuth2Successhandler;
import com.hoang.hot_desking.service.UserService;
import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2Successhandler oAuth2Successhandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    //Configures the security filter chain, defining public/private routes
    //and integrating OAuth2 with JWT.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable CSRF as we are using JWT (stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // Set session management to stateless (no cookies/sessions)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Define endpoint authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/","/login/**", "/oauth2/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                )
                // Configure OAuth2 Login with Google
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userinfo -> userinfo
                                .userService(customOAuth2UserService) //kết nối bộ lọc
                        )
                        .successHandler(oAuth2Successhandler)// Handle post-login logic (JWT generation)
                );
        // Add our custom JWT filter before the standard authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080")); // Allow Frontend and Swagger
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
