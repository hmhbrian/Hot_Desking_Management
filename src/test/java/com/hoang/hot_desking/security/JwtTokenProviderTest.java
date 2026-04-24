package com.hoang.hot_desking.security;

import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.entity.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenProviderTest {
    private JwtTokenProvider tokenProvider;
    //test constants
    private final String TEST_SECRET = "ibiubh2123hbiubujiu12423bj12n43jb432j322i4b32432j3be32b12jb2b3232ri2bir";
    private final long TEST_EXPIRATION = 3600000; //1 hour in milliseconds

    @BeforeEach
    void setUp(){
        //Initialize the object under test
        tokenProvider = new JwtTokenProvider();

        // Use Reflection to inject private @Value fields since Spring context is not loaded
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", TEST_EXPIRATION);
    }

    @Test
    @DisplayName("Test 1: Generate Token - Should return a non-null string")
    void generateToken_Success(){
        //Prepare dummy data(Given)
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("hoang.admin@example.com")
                .role(UserRole.ADMIN)
                .build();

        //Execute the method (When)
        String token = tokenProvider.generateToken(user);

        //Verify the result (Then)
        assertNotNull(token, "Token should not be null");
        assertTrue(token.startsWith("eyJ"), "JWT token should start with 'eyJ'");
    }

    @Test
    @DisplayName("Test 2: Validate Valid Token - Should return true")
    void validateToken_Valid_ReturnsTrue() {
        // Given: A freshly generated token
        User user = User.builder().id(UUID.randomUUID()).role(UserRole.EMPLOYEE).build();
        String token = tokenProvider.generateToken(user);

        // When: Validating the token
        boolean isValid = tokenProvider.validateToken(token);

        // Then: It must be valid
        assertTrue(isValid, "The token should be valid immediately after generation");
    }

    @Test
    @DisplayName("Test 3: Validate Expired Token - Should return false and log error")
    void validateToken_Expired_ReturnsFalse() {
        // Given: Set expiration to a past time (-10 seconds)
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", -10000L);

        User user = User.builder().id(UUID.randomUUID()).role(UserRole.EMPLOYEE).build();
        String token = tokenProvider.generateToken(user);

        // When: Validating the already expired token
        boolean isValid = tokenProvider.validateToken(token);

        // Then: It must be invalid
        assertFalse(isValid, "The token should be invalid because it is expired");
    }
}
