package project.backend.Services;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.backend.DTOs.TransactionDTO;
import project.backend.Repositories.PolicyRepository;
import project.backend.Repositories.TransactionRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.EmailDetails;
import project.backend.models.Policy;
import project.backend.models.Transaction;
import project.backend.models.TransactionType;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private EmailService emailService;

    private TransactionDTO convertToDTO(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getUser() != null ? transaction.getUser().getId() : null,
                transaction.getUser() != null ? transaction.getUser().getUsername() : null,
                transaction.getStartDate(),
                transaction.getAmount(),
                transaction.getEndDate(),
                transaction.getTransactionType(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt(),
                transaction.getPolicy() != null ? transaction.getPolicy().getId() : null);
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
                throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
            }
        }

        if (dto.getPolicyId() != null) {
            Optional<Policy> policy = policyRepository.findById(dto.getPolicyId());
            if (policy.isPresent()) {
                transaction.setPolicy(policy.get());
            } else {
                throw new ResourceNotFoundException("Policy not found with ID: " + dto.getPolicyId());
            }
        } else {
            throw new IllegalArgumentException("Policy ID is required to create a transaction.");
        }

        return transaction;
    }

    public List<TransactionDTO> getAllTransactions(String jwtToken) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
        List<Transaction> transactions = transactionRepository.findTransactionsByAdmin(username);
        return transactions.stream()
                .map(this::convertToDTO)
                .toList();

    }

    public List<TransactionDTO> getTransactionsForCustomer(String jwtToken) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        return convertToDTO(transaction);
    }

    public TransactionDTO createTransaction(TransactionDTO transactionDTO) throws MessagingException {
        Transaction transaction = convertToEntity(transactionDTO);

        LocalDate now = LocalDate.now();
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);

        Transaction savedTransaction = transactionRepository.save(transaction);

        String emailBody = "Dear " + transaction.getUser().getFirstName() + ",\n\n"
                + "We hope this email finds you well. This is to inform you that a new transaction has been successfully created in your account at InsuranceNexus.\n\n"
                + "Here are the details of the transaction:\n"
                + "Policy name: " + savedTransaction.getPolicy().getPolicyName() + "\n\n"
                + "Transaction Type: " + savedTransaction.getTransactionType() + "\n"
                + "Amount: " + savedTransaction.getAmount() + " ₪ \n"
                + "Start Date: " + savedTransaction.getStartDate() + "\n"
                + "End Date: " + savedTransaction.getEndDate() + "\n\n"
                + "Thank you for choosing InsuranceNexus for your insurance needs.\n\n"
                + "Best regards,\n"
                + "InsuranceNexus Team";

        emailService.sendEmail(EmailDetails.builder()
                .messageBody(emailBody)
                .recipient(transaction.getUser().getEmail())
                .subject("New Transaction Created")
                .build());

        return convertToDTO(savedTransaction);
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) throws MessagingException {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));

        TransactionType oldTransactionType = existingTransaction.getTransactionType();

        existingTransaction.setStartDate(transactionDTO.getStartDate());
        existingTransaction.setAmount(transactionDTO.getAmount());
        existingTransaction.setEndDate(transactionDTO.getEndDate());
        existingTransaction.setTransactionType(transactionDTO.getTransactionType());
        existingTransaction.setUpdatedAt(LocalDate.now());

        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        if (oldTransactionType != TransactionType.DEPOSIT
                && updatedTransaction.getTransactionType() == TransactionType.DEPOSIT) {
            String depositEmailBody = "Dear " + updatedTransaction.getUser().getFirstName() + ",\n\n"
                    + "We are pleased to inform you that your payment for the following transaction has been successfully processed:\n\n"
                    + "Policy Name: " + updatedTransaction.getPolicy().getPolicyName() + "\n"
                    + "Amount Paid: " + updatedTransaction.getAmount() + " ₪ \n"
                    + "Payment Date: " + updatedTransaction.getUpdatedAt() + "\n\n"
                    + "Thank you for your payment! If you have any questions or concerns, please do not hesitate to contact us.\n\n"
                    + "Best regards,\n"
                    + "InsuranceNexus Team";

            emailService.sendEmail(EmailDetails.builder()
                    .messageBody(depositEmailBody)
                    .recipient(updatedTransaction.getUser().getEmail())
                    .subject("Payment Confirmation for Transaction")
                    .build());
        } else {
            String emailBody = "Dear " + updatedTransaction.getUser().getFirstName() + ",\n\n"
                    + "This is to inform you that one of your transactions has been updated. "
                    + "Please find the updated transaction details below:\n\n"
                    + "Policy Name: " + updatedTransaction.getPolicy().getPolicyName() + "\n"
                    + "Updated Transaction Type: " + updatedTransaction.getTransactionType() + "\n"
                    + "Updated Amount: " + updatedTransaction.getAmount() + " ₪ \n"
                    + "Updated Start Date: " + updatedTransaction.getStartDate() + "\n"
                    + "Updated End Date: " + updatedTransaction.getEndDate() + "\n\n"
                    + "If you have any questions regarding this update, feel free to contact us.\n\n"
                    + "Best regards,\n"
                    + "InsuranceNexus Team";

            emailService.sendEmail(EmailDetails.builder()
                    .messageBody(emailBody)
                    .recipient(updatedTransaction.getUser().getEmail())
                    .subject("Transaction Update Notification")
                    .build());
        }

        return convertToDTO(updatedTransaction);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction not found with ID: " + id);
        }
        transactionRepository.deleteById(id);
    }

    public List<TransactionDTO> getTransactionsByCustomerId(Long customerId) {
        List<Transaction> transactions = transactionRepository.findByUserId(customerId);
        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No transactions found for customer ID: " + customerId);
        }
        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getDebtTransactionsForCustomer(String jwtToken) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionType(user.getId(),
                TransactionType.DEBT);

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getDepositTransactionsForCustomer(String jwtToken) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionType(user.getId(),
                TransactionType.DEPOSIT);

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getUpcomingTransactions(String jwtToken) {
        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        List<Transaction> transactions = transactionRepository.findUpcomingTransactionsByAdmin(adminUsername);

        List<TransactionDTO> upcomingTransactions = transactions.stream()
                .sorted(Comparator.comparing(Transaction::getEndDate))
                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return upcomingTransactions;
    }
}