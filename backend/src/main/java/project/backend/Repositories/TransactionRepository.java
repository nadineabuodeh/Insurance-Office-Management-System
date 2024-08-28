package project.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project.backend.DTOs.TransactionDTO;
import project.backend.models.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT new project.backend.DTOs.TransactionDTO(t.id, t.user.id, t.startDate, t.amount, t.endDate, t.transactionType, t.createdAt, t.updatedAt, t.policy.id) " +
       "FROM Transaction t " +
       "JOIN t.user u " +
       "JOIN t.policy p " +
       "JOIN p.insurance i " +
       "WHERE u.username = :username")
    List<TransactionDTO> findTransactionsByAdmin(@Param("username") String username);
}