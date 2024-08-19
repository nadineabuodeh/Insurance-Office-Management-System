package project.backend.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.DTOs.TransactionDTO;
import project.backend.Repositories.TransactionRepository;
import project.backend.Services.TransactionService;
import project.backend.models.Transaction;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Convert Transaction entity to TransactionDTO
    private TransactionDTO convertToDTO(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getStartDate(),
                transaction.getAmount(),
                transaction.getEndDate(),
                transaction.getTransactionType(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }

    // Convert TransactionDTO to Transaction entity
    private Transaction convertToEntity(TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setId(dto.getId());
        transaction.setStartDate(dto.getStartDate()); // Mapping `startDate` to `transactionDate`
        transaction.setAmount(dto.getAmount());
        transaction.setEndDate(dto.getEndDate());
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setCreatedAt(dto.getCreatedAt());
        transaction.setUpdatedAt(dto.getUpdatedAt());
        return transaction;
    }

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        Optional<Transaction> transaction = transactionRepository.findById(id);
        return transaction.map(this::convertToDTO).orElse(null);
    }

    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = convertToEntity(transactionDTO);
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        Optional<Transaction> existingTransaction = transactionRepository.findById(id);
        if (existingTransaction.isPresent()) {
            Transaction transaction = convertToEntity(transactionDTO);
            transaction.setId(id); // Ensure we update the existing transaction
            Transaction updatedTransaction = transactionRepository.save(transaction);
            return convertToDTO(updatedTransaction);
        }
        return null;
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
