package project.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import org.modelmapper.TypeToken;
import java.lang.reflect.Type;

import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import project.backend.DTOs.UserDTO;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.Services.EmailService;
import project.backend.Services.UserService;
import project.backend.exceptions.ResourceAlreadyExistsException;
import project.backend.exceptions.ResourceNotFoundException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private EmailService emailService;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("johndoe@example.com");
        user.setRole(ERole.ROLE_CUSTOMER);
        user.setPassword("encryptedPassword");

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("testUser");
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setEmail("johndoe@example.com");
        userDTO.setRole("ROLE_CUSTOMER");
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    void testCreateUser_Success() throws MessagingException {
        String jwtToken = "sampleJwtToken";

        lenient().when(userRepository.existsByEmail("johndoe@example.com")).thenReturn(false);
        lenient().when(passwordEncoder.encode(anyString())).thenReturn("encryptedPassword");
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("adminUser");
        lenient().when(userRepository.findByUsername("adminUser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDTO result = userService.createUser(userDTO, jwtToken);

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUser_EmailAlreadyExists() {
        String jwtToken = "sampleJwtToken";
        when(userRepository.existsByEmail("johndoe@example.com")).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> userService.createUser(userDTO, jwtToken));
    }

    @Test
    void testUpdateUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        lenient().when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        UserDTO result = userService.updateUser(1L, userDTO, "sampleJwtToken");

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUser_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(1L, userDTO, "sampleJwtToken"));
    }

    @Test
    void testDeleteUser_Success() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteUser_NotFound() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(1L));
    }

    @Test
    void testGetAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        Type listType = new TypeToken<List<UserDTO>>() {
        }.getType();

        when(modelMapper.map(eq(Collections.singletonList(user)), eq(listType)))
                .thenReturn(Collections.singletonList(userDTO));

        List<UserDTO> users = userService.getAllUsers();

        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("testUser", users.get(0).getUsername());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetCustomerByUsername_Success() {
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        UserDTO result = userService.getCustomerByUsername("testUser");

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
        verify(userRepository, times(1)).findByUsername("testUser");
    }

    @Test
    void testGetCustomerByUsername_NotFound() {
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getCustomerByUsername("testUser"));
    }

    @Test
    void testCreateUser_EmailSent() throws MessagingException {
        String jwtToken = "sampleJwtToken";

        when(userRepository.existsByEmail("johndoe@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encryptedPassword");
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("adminUser"); // Added this stub
        when(userRepository.findByUsername("adminUser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.createUser(userDTO, jwtToken);

        verify(emailService, times(1)).sendEmail(any());
    }

}