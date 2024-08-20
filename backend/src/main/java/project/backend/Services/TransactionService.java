package project.backend.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.DTOs.TransactionDTO;
import project.backend.Repositories.TransactionRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Transaction;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;


    private TransactionDTO convertToDTO(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),

                transaction.getUser() != null ? transaction.getUser().getId() : null, //  user id mapping

                transaction.getStartDate(),
                transaction.getAmount(),
                transaction.getEndDate(),
                transaction.getTransactionType(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }

    private Transaction convertToEntity(TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setId(dto.getId());
        transaction.setStartDate(dto.getStartDate());
        transaction.setAmount(dto.getAmount());
        transaction.setEndDate(dto.getEndDate());
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setCreatedAt(dto.getCreatedAt());
        transaction.setUpdatedAt(dto.getUpdatedAt());

        if (dto.getUserId() != null) {
            Optional<User> user = userRepository.findById(dto.getUserId());
            if (user.isPresent()) {
                transaction.setUser(user.get());
            } else {
                throw new RuntimeException("User not found with ID: " + dto.getUserId());
            }
        }

        return transaction;
    }

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        return convertToDTO(transaction);
    }

    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = convertToEntity(transactionDTO);

        LocalDate now = LocalDate.now();
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));

        Transaction transaction = convertToEntity(transactionDTO);
        transaction.setId(id);
        transaction.setCreatedAt(existingTransaction.getCreatedAt());
        transaction.setUpdatedAt(LocalDate.now());

        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction not found with ID: " + id);
        }
        transactionRepository.deleteById(id);
    }
}
