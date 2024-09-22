package project.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import project.backend.DTOs.InsuranceDTO;
import project.backend.Repositories.InsuranceRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.Services.InsuranceService;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Insurance;
import project.backend.models.InsuranceType;

class InsuranceServiceTest {

    @Mock
    private InsuranceRepository insuranceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private InsuranceService insuranceService;

    private String jwtToken;
    private User admin;
    private InsuranceDTO insuranceDTO;
    private Insurance insurance;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtToken = "sampleToken";
        admin = new User();
        admin.setId(1L);
        admin.setUsername("admin");

        insuranceDTO = new InsuranceDTO();
        insuranceDTO.setId(1L);
        insuranceDTO.setInsuranceType("HEALTH");
        insuranceDTO.setDescription("Health Insurance");
        insuranceDTO.setAdminId(1L);

        insurance = new Insurance();
        insurance.setId(1L);
        insurance.setInsuranceType(InsuranceType.HEALTH);
        insurance.setDescription("Health Insurance");
        insurance.setAdmin(admin);
    }

    @Test
    void testGetAllInsurances() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findByAdmin(admin)).thenReturn(Collections.singletonList(insurance));
        when(modelMapper.map(insurance, InsuranceDTO.class)).thenReturn(insuranceDTO);

        List<InsuranceDTO> result = insuranceService.getAllInsurances(jwtToken);

        assertEquals(1, result.size());
        assertEquals("Health Insurance", result.get(0).getDescription());
        verify(insuranceRepository, times(1)).findByAdmin(admin);
    }

    @Test
    void testGetInsuranceById_Success() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));
        when(modelMapper.map(insurance, InsuranceDTO.class)).thenReturn(insuranceDTO);

        InsuranceDTO result = insuranceService.getInsuranceById(1L, jwtToken);

        assertNotNull(result);
        assertEquals("Health Insurance", result.getDescription());
        verify(insuranceRepository, times(1)).findById(1L);
    }

    @Test
    void testGetInsuranceById_NotFound() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> insuranceService.getInsuranceById(1L, jwtToken));
    }

    @Test
    void testSaveInsurance() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.save(any(Insurance.class))).thenReturn(insurance);
        when(modelMapper.map(insuranceDTO, Insurance.class)).thenReturn(insurance);
        when(modelMapper.map(insurance, InsuranceDTO.class)).thenReturn(insuranceDTO);

        InsuranceDTO result = insuranceService.saveInsurance(insuranceDTO, jwtToken);

        assertNotNull(result);
        assertEquals("Health Insurance", result.getDescription());
        verify(insuranceRepository, times(1)).save(any(Insurance.class));
    }

    @Test
    void testUpdateInsurance_Success() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));
        when(insuranceRepository.save(any(Insurance.class))).thenReturn(insurance);
        when(modelMapper.map(insurance, InsuranceDTO.class)).thenReturn(insuranceDTO);

        InsuranceDTO result = insuranceService.updateInsurance(1L, insuranceDTO, jwtToken);

        assertNotNull(result);
        assertEquals("Health Insurance", result.getDescription());
        verify(insuranceRepository, times(1)).save(insurance);
    }

    @Test
    void testUpdateInsurance_NotFound() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> insuranceService.updateInsurance(1L, insuranceDTO, jwtToken));
    }

    @Test
    void testDeleteInsurance_Success() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));

        insuranceService.deleteInsurance(1L, jwtToken);

        verify(insuranceRepository, times(1)).delete(insurance);
    }

    @Test
    void testDeleteInsurance_NotFound() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> insuranceService.deleteInsurance(1L, jwtToken));
    }

    @Test
    void testSaveInsurance_InvalidJWT() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenThrow(new RuntimeException("Invalid JWT token"));

        assertThrows(RuntimeException.class, () -> insuranceService.saveInsurance(insuranceDTO, jwtToken));
    }

    @Test
    void testUpdateInsurance_InvalidJWT() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenThrow(new RuntimeException("Invalid JWT token"));

        assertThrows(RuntimeException.class, () -> insuranceService.updateInsurance(1L, insuranceDTO, jwtToken));
    }

    @Test
    void testDeleteInsurance_InvalidJWT() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenThrow(new RuntimeException("Invalid JWT token"));

        assertThrows(RuntimeException.class, () -> insuranceService.deleteInsurance(1L, jwtToken));
    }

    @Test
    void testGetAllInsurances_NoInsurancesFound() {
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.findByAdmin(admin)).thenReturn(Collections.emptyList());

        List<InsuranceDTO> result = insuranceService.getAllInsurances(jwtToken);

        assertTrue(result.isEmpty());
        verify(insuranceRepository, times(1)).findByAdmin(admin);
    }

    @Test
    void testSaveInsurance_EmptyFields() {
        insuranceDTO.setDescription(null);

        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(admin.getUsername());
        when(userRepository.findByUsername(admin.getUsername())).thenReturn(Optional.of(admin));
        when(insuranceRepository.save(any(Insurance.class))).thenReturn(insurance);
        when(modelMapper.map(insuranceDTO, Insurance.class)).thenReturn(insurance);
        when(modelMapper.map(insurance, InsuranceDTO.class)).thenReturn(insuranceDTO);

        InsuranceDTO result = insuranceService.saveInsurance(insuranceDTO, jwtToken);

        assertNotNull(result);
        assertEquals(insuranceDTO.getDescription(), result.getDescription());
        verify(insuranceRepository, times(1)).save(any(Insurance.class));
    }

    @Test
    void testUpdateInsurance_WrongAdmin() {
        User anotherAdmin = new User();
        anotherAdmin.setId(2L);

        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(anotherAdmin.getUsername());
        when(userRepository.findByUsername(anotherAdmin.getUsername())).thenReturn(Optional.of(anotherAdmin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));

        assertThrows(ResourceNotFoundException.class,
                () -> insuranceService.updateInsurance(1L, insuranceDTO, jwtToken));
    }

    @Test
    void testDeleteInsurance_WrongAdmin() {
        User anotherAdmin = new User();
        anotherAdmin.setId(2L);

        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(anotherAdmin.getUsername());
        when(userRepository.findByUsername(anotherAdmin.getUsername())).thenReturn(Optional.of(anotherAdmin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));

        assertThrows(ResourceNotFoundException.class, () -> insuranceService.deleteInsurance(1L, jwtToken));
    }

    @Test
    void testGetInsuranceById_WrongAdmin() {
        User anotherAdmin = new User();
        anotherAdmin.setId(2L);

        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn(anotherAdmin.getUsername());
        when(userRepository.findByUsername(anotherAdmin.getUsername())).thenReturn(Optional.of(anotherAdmin));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));

        assertThrows(ResourceNotFoundException.class, () -> insuranceService.getInsuranceById(1L, jwtToken));
    }
}
