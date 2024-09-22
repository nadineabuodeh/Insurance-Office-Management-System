package project.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import project.backend.Controllers.UserController;
import project.backend.DTOs.UserDTO;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.Services.UserService;
import project.backend.exceptions.ResourceAlreadyExistsException;
import project.backend.exceptions.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private UserDTO userDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("testuser");
        userDTO.setFirstName("Test");
        userDTO.setLastName("User");
        userDTO.setEmail("testuser@example.com");
    }

    @Test
    public void testGetAllUsers_Success() throws Exception {
        List<UserDTO> users = Arrays.asList(userDTO);

        when(jwtUtils.getUserNameFromJwtToken(anyString())).thenReturn("admin");
        when(userService.getAllUsersByAdmin(anyString())).thenReturn(users);

        mockMvc.perform(get("/users")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].username").value("testuser"));

        verify(userService, times(1)).getAllUsersByAdmin(anyString());
    }

    @Test
    public void testGetUserById_Success() throws Exception {
        when(userService.getUserById(1L)).thenReturn(userDTO);

        mockMvc.perform(get("/users/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    public void testGetUserById_NotFound() throws Exception {
        when(userService.getUserById(1L)).thenThrow(new ResourceNotFoundException("User not found"));

        mockMvc.perform(get("/users/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    public void testCreateUser_Success() throws Exception {
        when(userService.createUser(any(UserDTO.class), anyString())).thenReturn(userDTO);

        mockMvc.perform(post("/users")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService, times(1)).createUser(any(UserDTO.class), anyString());
    }

    @Test
    public void testCreateUser_Conflict() throws Exception {
        when(userService.createUser(any(UserDTO.class), anyString())).thenThrow(new ResourceAlreadyExistsException("Email already in use"));

        mockMvc.perform(post("/users")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isConflict());

        verify(userService, times(1)).createUser(any(UserDTO.class), anyString());
    }

    @Test
    public void testUpdateUser_Success() throws Exception {
        when(userService.updateUser(eq(1L), any(UserDTO.class), anyString())).thenReturn(userDTO);

        mockMvc.perform(put("/users/1")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService, times(1)).updateUser(eq(1L), any(UserDTO.class), anyString());
    }

    @Test
    public void testUpdateUser_NotFound() throws Exception {
        when(userService.updateUser(eq(1L), any(UserDTO.class), anyString())).thenThrow(new ResourceNotFoundException("User not found"));

        mockMvc.perform(put("/users/1")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).updateUser(eq(1L), any(UserDTO.class), anyString());
    }

    @Test
    public void testDeleteUser_Success() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/users/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    public void testDeleteUser_NotFound() throws Exception {
        doThrow(new ResourceNotFoundException("User not found")).when(userService).deleteUser(1L);

        mockMvc.perform(delete("/users/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    public void testGetCustomerInfo_Success() throws Exception {
        when(jwtUtils.getUserNameFromJwtToken(anyString())).thenReturn("testuser");
        when(userService.getCustomerByUsername(anyString())).thenReturn(userDTO);

        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService, times(1)).getCustomerByUsername(anyString());
    }

    @Test
    public void testGetCustomerInfo_NotFound() throws Exception {
        when(jwtUtils.getUserNameFromJwtToken(anyString())).thenReturn("testuser");
        when(userService.getCustomerByUsername(anyString())).thenThrow(new ResourceNotFoundException("User not found"));

        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getCustomerByUsername(anyString());
    }
}