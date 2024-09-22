package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import project.backend.SecurityConfiguration.controllers.AuthController;
import project.backend.SecurityConfiguration.models.CurrencyType;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.payload.request.LoginRequest;
import project.backend.SecurityConfiguration.payload.response.JwtResponse;
import project.backend.SecurityConfiguration.payload.response.MessageResponse;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.SecurityConfiguration.security.services.UserDetailsImpl;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    private User adminUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("adminpassword");
        adminUser.setRole(ERole.ROLE_ADMIN);
        adminUser.setCurrency(CurrencyType.USD);
        adminUser.setId(1L);
    }

    @Test
    public void testAuthenticateUser_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("adminpassword");

        Authentication authentication = mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "admin", "admin@example.com", "adminpassword", List.of());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockedJwtToken");
        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected 200 OK");

        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertNotNull(jwtResponse, "Expected a non-null JwtResponse");
        assertEquals("mockedJwtToken", jwtResponse.getAccessToken(), "Expected the correct JWT token");
        assertEquals("admin", jwtResponse.getUsername(), "Expected username to be 'admin'");
        assertEquals(CurrencyType.USD, jwtResponse.getCurrency(), "Expected currency to be 'USD'");
    }

    @Test
    public void testAuthenticateUser_InvalidCredentials() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid username or password!"));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertNotNull(messageResponse);
        assertEquals("Error: Invalid username or password!", messageResponse.getMessage());
    }

    @Test
    public void testAuthenticateUser_InternalServerError() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("adminpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Unexpected error"));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertNotNull(messageResponse);
        assertEquals("Error: An unexpected error occurred!", messageResponse.getMessage());
    }
}
