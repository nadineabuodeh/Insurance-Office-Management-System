package project.backend.Controllers;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import project.backend.DTOs.TransactionDTO;
import project.backend.Services.TransactionService;
import project.backend.exceptions.ResourceNotFoundException;

import java.util.List;

@SuppressWarnings("null")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<TransactionDTO> transactions = transactionService.getAllTransactions(jwtToken);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        try {
            TransactionDTO transactionDTO = transactionService.getTransactionById(id);
            return new ResponseEntity<>(transactionDTO, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionDTO createdTransaction = transactionService.createTransaction(transactionDTO);
            return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException | MessagingException ex) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable Long id,
            @RequestParam(required = false) boolean updateTransactionType,
            @RequestBody TransactionDTO transactionDTO) throws MessagingException {

        if (updateTransactionType) { // update only the transaction type
            return ResponseEntity.ok(transactionService.updateTransactionType(id, transactionDTO));
        }

        try {
            TransactionDTO updatedTransaction = transactionService.updateTransaction(id, transactionDTO);
            return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException | MessagingException ex) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCustomerId(@PathVariable Long customerId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByCustomerId(customerId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @GetMapping("/my-transactions")
    public ResponseEntity<List<TransactionDTO>> getTransactionsForCustomer(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<TransactionDTO> transactions = transactionService.getTransactionsForCustomer(jwtToken);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @GetMapping("/my-debts")
    public ResponseEntity<List<TransactionDTO>> getDebtTransactionsForCustomer(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<TransactionDTO> transactions = transactionService.getDebtTransactionsForCustomer(jwtToken);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @GetMapping("/my-deposits")
    public ResponseEntity<List<TransactionDTO>> getDepositTransactionsForCustomer(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<TransactionDTO> transactions = transactionService.getDepositTransactionsForCustomer(jwtToken);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/upcoming")
    public ResponseEntity<List<TransactionDTO>> getUpcomingTransactions(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<TransactionDTO> transactions = transactionService.getUpcomingTransactions(jwtToken);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

}