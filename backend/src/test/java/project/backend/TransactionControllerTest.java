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

import project.backend.Controllers.TransactionController;
import project.backend.DTOs.TransactionDTO;
import project.backend.Services.TransactionService;
import project.backend.exceptions.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class TransactionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private TransactionDTO transactionDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController).build();

        transactionDTO = new TransactionDTO();
        transactionDTO.setId(1L);
        transactionDTO.setAmount(500.0);
        transactionDTO.setPolicyId(2L);
        transactionDTO.setUserId(1L);
    }

    @Test
    public void testGetAllTransactions_Success() throws Exception {
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);

        when(transactionService.getAllTransactions(anyString())).thenReturn(transactions);

        mockMvc.perform(get("/transactions")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.0));

        verify(transactionService, times(1)).getAllTransactions(anyString());
    }

    @Test
    public void testGetTransactionById_Success() throws Exception {
        when(transactionService.getTransactionById(1L)).thenReturn(transactionDTO);

        mockMvc.perform(get("/transactions/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.amount").value(500.0));

        verify(transactionService, times(1)).getTransactionById(1L);
    }

    @Test
    public void testGetTransactionById_NotFound() throws Exception {
        when(transactionService.getTransactionById(1L)).thenThrow(new ResourceNotFoundException("Transaction not found"));

        mockMvc.perform(get("/transactions/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNotFound());

        verify(transactionService, times(1)).getTransactionById(1L);
    }

    @Test
    public void testCreateTransaction_Success() throws Exception {
        when(transactionService.createTransaction(any(TransactionDTO.class))).thenReturn(transactionDTO);

        mockMvc.perform(post("/transactions")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transactionDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.amount").value(500.0));

        verify(transactionService, times(1)).createTransaction(any(TransactionDTO.class));
    }

    @Test
    public void testUpdateTransaction_Success() throws Exception {
        when(transactionService.updateTransaction(eq(1L), any(TransactionDTO.class))).thenReturn(transactionDTO);

        mockMvc.perform(put("/transactions/1")
                        .header("Authorization", "Bearer sampleJwtToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transactionDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.amount").value(500.0));

        verify(transactionService, times(1)).updateTransaction(eq(1L), any(TransactionDTO.class));
    }

    @Test
    public void testDeleteTransaction_Success() throws Exception {
        doNothing().when(transactionService).deleteTransaction(1L);

        mockMvc.perform(delete("/transactions/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isNoContent());

        verify(transactionService, times(1)).deleteTransaction(1L);
    }

    @Test
    public void testGetTransactionsByCustomerId_Success() throws Exception {
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);

        when(transactionService.getTransactionsByCustomerId(1L)).thenReturn(transactions);

        mockMvc.perform(get("/transactions/customer/1")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.0));

        verify(transactionService, times(1)).getTransactionsByCustomerId(1L);
    }

    @Test
    public void testGetTransactionsForCustomer_Success() throws Exception {
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);

        when(transactionService.getTransactionsForCustomer(anyString())).thenReturn(transactions);

        mockMvc.perform(get("/transactions/my-transactions")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.0));

        verify(transactionService, times(1)).getTransactionsForCustomer(anyString());
    }

    @Test
    public void testGetDebtTransactionsForCustomer_Success() throws Exception {
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);

        when(transactionService.getDebtTransactionsForCustomer(anyString())).thenReturn(transactions);

        mockMvc.perform(get("/transactions/my-debts")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.0));

        verify(transactionService, times(1)).getDebtTransactionsForCustomer(anyString());
    }

    @Test
    public void testGetDepositTransactionsForCustomer_Success() throws Exception {
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);

        when(transactionService.getDepositTransactionsForCustomer(anyString())).thenReturn(transactions);

        mockMvc.perform(get("/transactions/my-deposits")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.0));

        verify(transactionService, times(1)).getDepositTransactionsForCustomer(anyString());
    }

    @Test
    public void testGetUpcomingTransactions_Success() throws Exception {
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);

        when(transactionService.getUpcomingTransactions(anyString())).thenReturn(transactions);

        mockMvc.perform(get("/transactions/upcoming")
                        .header("Authorization", "Bearer sampleJwtToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.0));

        verify(transactionService, times(1)).getUpcomingTransactions(anyString());
    }
}
