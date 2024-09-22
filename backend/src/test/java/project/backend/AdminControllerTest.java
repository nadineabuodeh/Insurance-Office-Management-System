package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import project.backend.SecurityConfiguration.controllers.AdminController;
import project.backend.SecurityConfiguration.models.CurrencyType;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.payload.request.CurrencyRequest;
import project.backend.SecurityConfiguration.payload.request.UpdateAdminRequest;
import project.backend.SecurityConfiguration.payload.response.MessageResponse;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AdminControllerTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    private User admin;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword("adminpassword");
        admin.setRole(ERole.ROLE_ADMIN);
        admin.setCurrency(CurrencyType.USD);
    }

    @Test
    public void testGetAdminProfile_Success() {
        String token = "Bearer validtoken";
        when(jwtUtils.getUserNameFromJwtToken("validtoken")).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        ResponseEntity<?> response = adminController.getAdminProfile(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(admin, response.getBody());
    }

    @Test
    public void testGetAdminProfile_AdminNotFound() {
        String token = "Bearer invalidtoken";
        when(jwtUtils.getUserNameFromJwtToken("invalidtoken")).thenReturn("nonexistentAdmin");
        when(userRepository.findByUsername("nonexistentAdmin")).thenReturn(Optional.empty());
    
        assertThrows(RuntimeException.class, () -> {
            adminController.getAdminProfile(token);
        });
    }

    @SuppressWarnings("null")
    @Test
    public void testUpdateAdminProfile_Success() {
        UpdateAdminRequest updateRequest = new UpdateAdminRequest();
        updateRequest.setCurrency(CurrencyType.EUR);
        updateRequest.setFirstName("UpdatedAdminFirst");
        updateRequest.setLastName("UpdatedAdminLast");
        updateRequest.setEmail("updatedadmin@example.com");
        updateRequest.setPhoneNumber("123456789");

        String token = "Bearer validtoken";
        when(jwtUtils.getUserNameFromJwtToken("validtoken")).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        ResponseEntity<?> response = adminController.updateAdminProfile(updateRequest, token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Admin profile updated successfully", ((MessageResponse) response.getBody()).getMessage());

        verify(userRepository, times(1)).save(admin);
    }

    @Test
    public void testUpdateAdminProfile_AdminNotFound() {
        UpdateAdminRequest updateRequest = new UpdateAdminRequest();
        updateRequest.setCurrency(CurrencyType.EUR);
        updateRequest.setFirstName("UpdatedAdminFirst");
        updateRequest.setLastName("UpdatedAdminLast");

        String token = "Bearer invalidtoken";
        when(jwtUtils.getUserNameFromJwtToken("invalidtoken")).thenReturn("nonexistentAdmin");
        when(userRepository.findByUsername("nonexistentAdmin")).thenReturn(Optional.empty());

        ResponseEntity<?> response = adminController.updateAdminProfile(updateRequest, token);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @SuppressWarnings("null")
    @Test
    public void testSetCurrency_Success() {
        CurrencyRequest currencyRequest = new CurrencyRequest();
        currencyRequest.setCurrency(CurrencyType.NIS);

        String token = "Bearer validtoken";
        when(jwtUtils.getUserNameFromJwtToken("validtoken")).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        ResponseEntity<?> response = adminController.setCurrency(currencyRequest, token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Currency updated successfully!", ((MessageResponse) response.getBody()).getMessage());

        verify(userRepository, times(1)).save(admin);
    }

    @SuppressWarnings("null")
    @Test
    public void testSetCurrency_NotAdmin() {
        User nonAdminUser = new User();
        nonAdminUser.setUsername("nonadmin");
        nonAdminUser.setRole(ERole.ROLE_CUSTOMER);

        CurrencyRequest currencyRequest = new CurrencyRequest();
        currencyRequest.setCurrency(CurrencyType.EUR);

        String token = "Bearer validtoken";
        when(jwtUtils.getUserNameFromJwtToken("validtoken")).thenReturn("nonadmin");
        when(userRepository.findByUsername("nonadmin")).thenReturn(Optional.of(nonAdminUser));

        ResponseEntity<?> response = adminController.setCurrency(currencyRequest, token);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Error: Only admins can set the currency!", ((MessageResponse) response.getBody()).getMessage());
    }

    @Test
    public void testGetAdminCurrency_Success() {
        String token = "Bearer validtoken";
        when(jwtUtils.getUserNameFromJwtToken("validtoken")).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        ResponseEntity<?> response = adminController.getAdminCurrency(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CurrencyType.USD, response.getBody());
    }
}