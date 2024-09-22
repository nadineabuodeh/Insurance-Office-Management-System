package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;

import java.util.Date;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AdminUserInitializerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminUserInitializer adminUserInitializer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAdminUserSuccess() {
        String username = "asal";
        String email = "asal@example.com";
        String password = "asalPassword";

        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn("encodedPassword");

        adminUserInitializer.createAdminUser("1234567", "Asal", "Company", username,
                "0597279600", email, new Date(), ERole.ROLE_ADMIN, password);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateAdminUserUsernameAlreadyExists() {
        String username = "asal";

        when(userRepository.existsByUsername(username)).thenReturn(true);

        adminUserInitializer.createAdminUser("1234567", "Asal", "Company", username,
                "0597279600", "asal@example.com", new Date(), ERole.ROLE_ADMIN, "asalPassword");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateAdminUserBlankUsername() {
        adminUserInitializer.createAdminUser("1234567", "Test", "User", "",
                "0597279600", "test@example.com", new Date(), ERole.ROLE_ADMIN, "password");

        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    void testCreateAdminUserBlankEmail() {
        adminUserInitializer.createAdminUser("1234567", "Test", "User", "username",
                "0597279600", "", new Date(), ERole.ROLE_ADMIN, "password");

        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    void testCreateAdminUserBlankPassword() {
        adminUserInitializer.createAdminUser("1234567", "Test", "User", "username",
                "0597279600", "test@example.com", new Date(), ERole.ROLE_ADMIN, "");

        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    void testRunMultipleAdminsCreated() throws Exception {
        when(userRepository.existsByUsername(any(String.class))).thenReturn(false);
        when(passwordEncoder.encode(any(String.class))).thenReturn("encodedPassword");

        adminUserInitializer.run();

        verify(userRepository, times(3)).save(any(User.class));
    }
}