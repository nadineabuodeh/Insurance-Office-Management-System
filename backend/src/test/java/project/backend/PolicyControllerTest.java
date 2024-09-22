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

import project.backend.Controllers.PolicyController;
import project.backend.DTOs.PolicyDTO;
import project.backend.Services.PolicyService;
import project.backend.exceptions.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class PolicyControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PolicyService policyService;

    @InjectMocks
    private PolicyController policyController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private PolicyDTO policyDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(policyController).build();

        policyDTO = new PolicyDTO();
        policyDTO.setId(1L);
        policyDTO.setPolicyName("Health Policy");
        policyDTO.setUserId(1L);
        policyDTO.setInsuranceId(2L);
    }

    @Test
    public void testGetAllPolicies_Success() throws Exception {
        List<PolicyDTO> policies = Arrays.asList(policyDTO);

        when(policyService.getAllPolicies(anyString())).thenReturn(policies);

        mockMvc.perform(get("/policies")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].policyName").value("Health Policy"));

        verify(policyService, times(1)).getAllPolicies(anyString());
    }

    @Test
    public void testGetPolicyById_Success() throws Exception {
        when(policyService.getPolicyById(1L)).thenReturn(policyDTO);

        mockMvc.perform(get("/policies/1")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.policyName").value("Health Policy"));

        verify(policyService, times(1)).getPolicyById(1L);
    }

    @Test
    public void testCreatePolicy_Success() throws Exception {
        when(policyService.savePolicy(any(PolicyDTO.class))).thenReturn(policyDTO);

        mockMvc.perform(post("/policies")
                .header("Authorization", "Bearer sampleJwtToken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(policyDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.policyName").value("Health Policy"));

        verify(policyService, times(1)).savePolicy(any(PolicyDTO.class));
    }

    @Test
    public void testUpdatePolicy_Success() throws Exception {
        when(policyService.updatePolicy(eq(1L), any(PolicyDTO.class))).thenReturn(policyDTO);

        mockMvc.perform(put("/policies/1")
                .header("Authorization", "Bearer sampleJwtToken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(policyDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.policyName").value("Health Policy"));

        verify(policyService, times(1)).updatePolicy(eq(1L), any(PolicyDTO.class));
    }

    @Test
    public void testDeletePolicy_Success() throws Exception {
        doNothing().when(policyService).deletePolicy(1L);

        mockMvc.perform(delete("/policies/1")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNoContent());

        verify(policyService, times(1)).deletePolicy(1L);
    }

    @Test
    public void testGetPoliciesByCustomerId_Success() throws Exception {
        List<PolicyDTO> policies = Arrays.asList(policyDTO);

        when(policyService.getPoliciesByCustomerId(1L)).thenReturn(policies);

        mockMvc.perform(get("/policies/customer/1")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].policyName").value("Health Policy"));

        verify(policyService, times(1)).getPoliciesByCustomerId(1L);
    }

    @Test
    public void testGetPoliciesForCustomer_Success() throws Exception {
        List<PolicyDTO> policies = Arrays.asList(policyDTO);

        when(policyService.getPoliciesForCustomer(anyString())).thenReturn(policies);

        mockMvc.perform(get("/policies/my-policies")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].policyName").value("Health Policy"));

        verify(policyService, times(1)).getPoliciesForCustomer(anyString());
    }

    @Test
    public void testGetUserIdByPolicyId_Success() throws Exception {
        when(policyService.getUserIdByPolicyId(1L)).thenReturn(1L);

        mockMvc.perform(get("/policies/user/1")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(1L));

        verify(policyService, times(1)).getUserIdByPolicyId(1L);
    }

    @Test
    public void testGetUserIdByPolicyId_NotFound() throws Exception {
        when(policyService.getUserIdByPolicyId(1L)).thenThrow(new ResourceNotFoundException("Policy not found"));

        mockMvc.perform(get("/policies/user/1")
                .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNotFound());

        verify(policyService, times(1)).getUserIdByPolicyId(1L);
    }
}
