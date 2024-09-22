package project.backend;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import project.backend.Controllers.InsuranceController;
import project.backend.DTOs.InsuranceDTO;
import project.backend.Services.InsuranceService;

public class InsuranceControllerTest {

    private MockMvc mockMvc;

    @Mock
    private InsuranceService insuranceService;

    @InjectMocks
    private InsuranceController insuranceController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private InsuranceDTO insuranceDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(insuranceController).build();

        insuranceDTO = new InsuranceDTO();
        insuranceDTO.setId(1L);
        insuranceDTO.setInsuranceType("HEALTH");
        insuranceDTO.setDescription("Health Insurance");
        insuranceDTO.setAdminId(1L);
    }

    @Test
    public void testGetAllInsurances() throws Exception {
        List<InsuranceDTO> insuranceList = Arrays.asList(insuranceDTO);

        when(insuranceService.getAllInsurances(anyString())).thenReturn(insuranceList);

        mockMvc.perform(get("/insurances")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].insuranceType").value("HEALTH"));

        verify(insuranceService, times(1)).getAllInsurances(anyString());
    }

    @Test
    public void testGetInsuranceById_Success() throws Exception {
        when(insuranceService.getInsuranceById(eq(1L), anyString())).thenReturn(insuranceDTO);

        mockMvc.perform(get("/insurances/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.insuranceType").value("HEALTH"));

        verify(insuranceService, times(1)).getInsuranceById(eq(1L), anyString());
    }

    @Test
    public void testGetInsuranceById_NotFound() throws Exception {
        when(insuranceService.getInsuranceById(eq(1L), anyString())).thenReturn(null);

        mockMvc.perform(get("/insurances/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNotFound());

        verify(insuranceService, times(1)).getInsuranceById(eq(1L), anyString());
    }

    @Test
    public void testCreateInsurance_Success() throws Exception {
        when(insuranceService.saveInsurance(any(InsuranceDTO.class), anyString())).thenReturn(insuranceDTO);

        mockMvc.perform(post("/insurances")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(insuranceDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.insuranceType").value("HEALTH"));

        verify(insuranceService, times(1)).saveInsurance(any(InsuranceDTO.class), anyString());
    }

    @Test
    public void testUpdateInsurance_Success() throws Exception {
        when(insuranceService.updateInsurance(eq(1L), any(InsuranceDTO.class), anyString())).thenReturn(insuranceDTO);

        mockMvc.perform(put("/insurances/1")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(insuranceDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.insuranceType").value("HEALTH"));

        verify(insuranceService, times(1)).updateInsurance(eq(1L), any(InsuranceDTO.class), anyString());
    }

    @Test
    public void testDeleteInsurance_Success() throws Exception {
        doNothing().when(insuranceService).deleteInsurance(eq(1L), anyString());

        mockMvc.perform(delete("/insurances/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNoContent());

        verify(insuranceService, times(1)).deleteInsurance(eq(1L), anyString());
    }
}
