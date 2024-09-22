package project.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import project.backend.DTOs.PolicyDTO;
import project.backend.Repositories.InsuranceRepository;
import project.backend.Repositories.PolicyRepository;
import project.backend.Repositories.TransactionRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.Services.EmailService;
import project.backend.Services.PolicyService;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Policy;
import project.backend.models.EmailDetails;
import project.backend.models.Insurance;

class PolicyServiceTest {

    @Mock
    private PolicyRepository policyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InsuranceRepository insuranceRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PolicyService policyService;

    private PolicyDTO policyDTO;
    private Policy policy;
    private User user;
    private Insurance insurance;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setUsername("user");

        insurance = new Insurance();
        insurance.setId(1L);
        insurance.setInsuranceType(project.backend.models.InsuranceType.HEALTH);

        policyDTO = new PolicyDTO();
        policyDTO.setId(1L);
        policyDTO.setStartDate(LocalDate.now());
        policyDTO.setEndDate(LocalDate.now().plusYears(1));
        policyDTO.setTotalAmount(1000.0);
        policyDTO.setCoverageDetails("Full Coverage");
        policyDTO.setUserId(1L);
        policyDTO.setInsuranceId(1L);
        policyDTO.setPolicyName("Health Policy");

        policy = new Policy();
        policy.setId(1L);
        policy.setStartDate(LocalDate.now());
        policy.setEndDate(LocalDate.now().plusYears(1));
        policy.setTotalAmount(1000.0);
        policy.setCoverageDetails("Full Coverage");
        policy.setUser(user);
        policy.setInsurance(insurance);
    }

    @Test
    void testGetAllPolicies() {
        String jwtToken = "sampleJwtToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("admin");
        when(policyRepository.findPoliciesByAdmin("admin")).thenReturn(Collections.singletonList(policy));
        when(modelMapper.map(policy, PolicyDTO.class)).thenReturn(policyDTO);

        List<PolicyDTO> result = policyService.getAllPolicies(jwtToken);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Health Policy", result.get(0).getPolicyName());
        verify(policyRepository, times(1)).findPoliciesByAdmin("admin");
    }

    @Test
    void testGetPolicyById_Success() {
        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));
        when(modelMapper.map(policy, PolicyDTO.class)).thenReturn(policyDTO);

        PolicyDTO result = policyService.getPolicyById(1L);

        assertNotNull(result);
        assertEquals("Health Policy", result.getPolicyName());
        verify(policyRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPolicyById_NotFound() {
        when(policyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> policyService.getPolicyById(1L));
    }

    @Test
    void testSavePolicy_Success() throws MessagingException {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));

        when(modelMapper.map(policyDTO, Policy.class)).thenReturn(policy);
        when(policyRepository.save(any(Policy.class))).thenReturn(policy);
        when(modelMapper.map(policy, PolicyDTO.class)).thenReturn(policyDTO);

        doNothing().when(emailService).sendEmail(any(EmailDetails.class));

        PolicyDTO result = policyService.savePolicy(policyDTO);

        assertNotNull(result);
        assertEquals("Health Policy", result.getPolicyName());
        verify(policyRepository, times(1)).save(any(Policy.class));
        verify(emailService, times(1)).sendEmail(any(EmailDetails.class));
    }

    @Test
    void testSavePolicy_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> policyService.savePolicy(policyDTO));
    }

    @Test
    void testSavePolicy_InsuranceNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> policyService.savePolicy(policyDTO));
    }

    @Test
    void testUpdatePolicy_Success() {
        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));
        when(policyRepository.save(any(Policy.class))).thenReturn(policy);
        when(modelMapper.map(policy, PolicyDTO.class)).thenReturn(policyDTO);

        PolicyDTO result = policyService.updatePolicy(1L, policyDTO);

        assertNotNull(result);
        assertEquals("Health Policy", result.getPolicyName());
        verify(policyRepository, times(1)).save(any(Policy.class));
    }

    @Test
    void testUpdatePolicy_NotFound() {
        when(policyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> policyService.updatePolicy(1L, policyDTO));
    }

    @Test
    void testDeletePolicy_Success() {
        when(policyRepository.existsById(1L)).thenReturn(true);

        policyService.deletePolicy(1L);

        verify(policyRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeletePolicy_NotFound() {
        when(policyRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> policyService.deletePolicy(1L));
    }

    @Test
    void testGetPoliciesForCustomer() {
        String jwtToken = "sampleJwtToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(policyRepository.findByUserId(1L)).thenReturn(Collections.singletonList(policy));
        when(modelMapper.map(policy, PolicyDTO.class)).thenReturn(policyDTO);

        List<PolicyDTO> result = policyService.getPoliciesForCustomer(jwtToken);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Health Policy", result.get(0).getPolicyName());
        verify(policyRepository, times(1)).findByUserId(1L);
    }

    @Test
    void testGetPoliciesByCustomerId_Success() {
        when(policyRepository.findByUserId(1L)).thenReturn(Collections.singletonList(policy));
        when(modelMapper.map(policy, PolicyDTO.class)).thenReturn(policyDTO);

        List<PolicyDTO> result = policyService.getPoliciesByCustomerId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Health Policy", result.get(0).getPolicyName());
    }

    @Test
    void testGetPoliciesByCustomerId_NotFound() {
        when(policyRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

        assertThrows(ResourceNotFoundException.class, () -> policyService.getPoliciesByCustomerId(1L));
    }

    @Test
    void testGetUserIdByPolicyId_Success() {
        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));

        Long userId = policyService.getUserIdByPolicyId(1L);

        assertNotNull(userId);
        assertEquals(1L, userId);
    }

    @Test
    void testGetUserIdByPolicyId_NotFound() {
        when(policyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> policyService.getUserIdByPolicyId(1L));
    }

    @Test
    void testGenerateTransactions_InvalidNumberOfPayments() {
        int invalidNumberOfPayments = 0;

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            policyService.generateTransactions(policyDTO, invalidNumberOfPayments);
        });

        assertEquals("Number of payments must be greater than zero.", exception.getMessage());
    }

    @Test
    void testGenerateTransactions_AmountNotDivisibleByPayments() throws MessagingException {
        policyDTO.setTotalAmount(1001.0);
        int numberOfPayments = 3;

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(insuranceRepository.findById(1L)).thenReturn(Optional.of(insurance));
        when(modelMapper.map(policyDTO, Policy.class)).thenReturn(policy);
        when(policyRepository.save(any(Policy.class))).thenReturn(policy);
        doNothing().when(emailService).sendEmail(any(EmailDetails.class));

        policyService.generateTransactions(policyDTO, numberOfPayments);

        verify(transactionRepository, times(1)).saveAll(anyList());
        verify(emailService, times(1)).sendEmail(any(EmailDetails.class));
    }

    @Test
    void testGenerateTransactions_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            policyService.generateTransactions(policyDTO, 2);
        });

        assertEquals("User not found with ID: 1", exception.getMessage());
    }

    @Test
    void testGenerateTransactions_EmailServiceFailure() throws MessagingException {
        int numberOfPayments = 3;

        when(userRepository.findById(policyDTO.getUserId())).thenReturn(Optional.of(user));
        when(insuranceRepository.findById(policyDTO.getInsuranceId())).thenReturn(Optional.of(insurance));
        when(modelMapper.map(policyDTO, Policy.class)).thenReturn(policy);
        when(policyRepository.save(any(Policy.class))).thenReturn(policy);

        doThrow(new MessagingException("Email sending failed")).when(emailService).sendEmail(any(EmailDetails.class));

        Exception exception = assertThrows(MessagingException.class, () -> {
            policyService.generateTransactions(policyDTO, numberOfPayments);
        });

        assertEquals("Email sending failed", exception.getMessage());
        verify(transactionRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testGenerateTransactions_Success() throws MessagingException {
        int numberOfPayments = 3;

        when(userRepository.findById(policyDTO.getUserId())).thenReturn(Optional.of(user));
        when(insuranceRepository.findById(policyDTO.getInsuranceId())).thenReturn(Optional.of(insurance));
        when(modelMapper.map(policyDTO, Policy.class)).thenReturn(policy);
        when(policyRepository.save(any(Policy.class))).thenReturn(policy);
        doNothing().when(emailService).sendEmail(any(EmailDetails.class));

        policyService.generateTransactions(policyDTO, numberOfPayments);

        verify(transactionRepository, times(1)).saveAll(anyList());
        verify(emailService, times(1)).sendEmail(any(EmailDetails.class));
    }
}
