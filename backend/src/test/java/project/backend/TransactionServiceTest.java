package project.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import project.backend.DTOs.TransactionDTO;
import project.backend.Repositories.PolicyRepository;
import project.backend.Repositories.TransactionRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.Services.EmailService;
import project.backend.Services.TransactionService;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Policy;
import project.backend.models.Transaction;
import project.backend.models.TransactionType;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PolicyRepository policyRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction transaction;
    private TransactionDTO transactionDTO;
    private User user;
    private Policy policy;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("user");

        policy = new Policy();
        policy.setId(1L);
        policy.setPolicyName("Health Policy");

        transactionDTO = new TransactionDTO();
        transactionDTO.setId(1L);
        transactionDTO.setUserId(1L);
        transactionDTO.setPolicyId(1L);
        transactionDTO.setStartDate(LocalDate.now());
        transactionDTO.setEndDate(LocalDate.now().plusMonths(1));
        transactionDTO.setAmount(1000.0);
        transactionDTO.setTransactionType(TransactionType.DEBT);

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setUser(user);
        transaction.setPolicy(policy);
        transaction.setStartDate(LocalDate.now());
        transaction.setEndDate(LocalDate.now().plusMonths(1));
        transaction.setAmount(1000.0);
        transaction.setTransactionType(TransactionType.DEBT);
        transaction.setCreatedAt(LocalDate.now());
        transaction.setUpdatedAt(LocalDate.now());
    }

    @Test
    void testGetTransactionById_Success() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        TransactionDTO result = transactionService.getTransactionById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(transactionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetTransactionById_NotFound() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.getTransactionById(1L));
    }

    @Test
    void testCreateTransaction_Success() throws MessagingException {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        TransactionDTO result = transactionService.createTransaction(transactionDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void testCreateTransaction_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.createTransaction(transactionDTO));
    }

    @Test
    void testCreateTransaction_PolicyNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(policyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.createTransaction(transactionDTO));
    }

    @Test
    void testUpdateTransaction_Success() throws MessagingException {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        TransactionDTO result = transactionService.updateTransaction(1L, transactionDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void testUpdateTransaction_NotFound() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.updateTransaction(1L, transactionDTO));
    }

    @Test
    void testDeleteTransaction_Success() {
        when(transactionRepository.existsById(1L)).thenReturn(true);

        transactionService.deleteTransaction(1L);

        verify(transactionRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteTransaction_NotFound() {
        when(transactionRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> transactionService.deleteTransaction(1L));
    }

    @Test
    void testGetTransactionsForCustomer() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(transactionRepository.findByUserId(1L)).thenReturn(Collections.singletonList(transaction));

        List<TransactionDTO> transactions = transactionService.getTransactionsForCustomer(jwtToken);

        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals(1L, transactions.get(0).getId());
        verify(transactionRepository, times(1)).findByUserId(1L);
    }

    @Test
    void testGetDebtTransactionsForCustomer() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(transactionRepository.findByUserIdAndTransactionType(1L, TransactionType.DEBT))
                .thenReturn(Collections.singletonList(transaction));

        List<TransactionDTO> transactions = transactionService.getDebtTransactionsForCustomer(jwtToken);

        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals(TransactionType.DEBT, transactions.get(0).getTransactionType());
        verify(transactionRepository, times(1)).findByUserIdAndTransactionType(1L, TransactionType.DEBT);
    }

    @Test
    void testGetDepositTransactionsForCustomer() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));

        transaction.setTransactionType(TransactionType.DEPOSIT);

        when(transactionRepository.findByUserIdAndTransactionType(1L, TransactionType.DEPOSIT))
                .thenReturn(Collections.singletonList(transaction));

        List<TransactionDTO> transactions = transactionService.getDepositTransactionsForCustomer(jwtToken);

        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals(TransactionType.DEPOSIT, transactions.get(0).getTransactionType());
    }

    @Test
    void testGetUpcomingTransactions() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("admin");
        when(transactionRepository.findUpcomingTransactionsByAdmin("admin"))
                .thenReturn(Collections.singletonList(transaction));

        List<TransactionDTO> transactions = transactionService.getUpcomingTransactions(jwtToken);

        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals(1L, transactions.get(0).getId());
        verify(transactionRepository, times(1)).findUpcomingTransactionsByAdmin("admin");
    }

    @Test
    void testGetAllTransactions_Empty() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("admin");
        when(transactionRepository.findTransactionsByAdmin("admin")).thenReturn(Collections.emptyList());

        List<TransactionDTO> transactions = transactionService.getAllTransactions(jwtToken);

        assertNotNull(transactions);
        assertEquals(0, transactions.size());
        verify(transactionRepository, times(1)).findTransactionsByAdmin("admin");
    }

    @Test
    void testUpdateTransaction_SameUserId() throws MessagingException {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        transactionDTO.setUserId(1L);
        TransactionDTO result = transactionService.updateTransaction(1L, transactionDTO);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void testUpdateTransaction_ChangeAmount() throws MessagingException {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        transactionDTO.setAmount(1500.0);
        TransactionDTO result = transactionService.updateTransaction(1L, transactionDTO);

        assertNotNull(result);
        assertEquals(1500.0, result.getAmount());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void testDeleteTransaction_Exists() {
        when(transactionRepository.existsById(1L)).thenReturn(true);

        transactionService.deleteTransaction(1L);

        verify(transactionRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetUpcomingTransactions_Multiple() {
        String jwtToken = "sampleToken";
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setEndDate(LocalDate.now().plusWeeks(2));

        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("admin");
        when(transactionRepository.findUpcomingTransactionsByAdmin("admin"))
                .thenReturn(List.of(transaction, transaction2));

        List<TransactionDTO> transactions = transactionService.getUpcomingTransactions(jwtToken);

        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertTrue(transactions.get(0).getEndDate().isBefore(transactions.get(1).getEndDate()));
        verify(transactionRepository, times(1)).findUpcomingTransactionsByAdmin("admin");
    }

    @Test
    void testGetTransactionsForCustomer_UserNotFound() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.getTransactionsForCustomer(jwtToken));
    }

    @Test
    void testGetDebtTransactionsForCustomer_NoDebts() {
        String jwtToken = "sampleToken";
        when(jwtUtils.getUserNameFromJwtToken(jwtToken)).thenReturn("user");
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(transactionRepository.findByUserIdAndTransactionType(1L, TransactionType.DEBT))
                .thenReturn(Collections.emptyList());

        List<TransactionDTO> transactions = transactionService.getDebtTransactionsForCustomer(jwtToken);

        assertNotNull(transactions);
        assertEquals(0, transactions.size());
    }

    @Test
    void testUpdateTransactionType_Success() throws MessagingException {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        TransactionDTO result = transactionService.updateTransactionType(1L, transactionDTO);

        assertNotNull(result);
        assertEquals(TransactionType.DEPOSIT, result.getTransactionType());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(emailService, times(1)).sendEmail(any());
    }

    @Test
    void testCreateTransaction_EmailFailure() throws MessagingException {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        doThrow(MessagingException.class).when(emailService).sendEmail(any());

        assertThrows(MessagingException.class, () -> transactionService.createTransaction(transactionDTO));
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }
}
