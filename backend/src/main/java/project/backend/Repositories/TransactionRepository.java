package project.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project.backend.models.Transaction;
import project.backend.models.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t " +
            "JOIN t.policy p " +
            "JOIN p.user u " +
            "JOIN p.insurance i " +
            "WHERE i.admin.username = :adminUsername")

    List<Transaction> findTransactionsByAdmin(@Param("adminUsername") String adminUsername);

    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByUserIdAndTransactionType(Long userId, TransactionType transactionType);

    @Query("SELECT t FROM Transaction t " +
            "JOIN t.policy p " +
            "JOIN p.user u " +
            "JOIN p.insurance i " +
            "WHERE i.admin.username = :adminUsername " +
            "AND t.endDate >= CURRENT_DATE " +
            "AND t.transactionType = project.backend.models.TransactionType.DEBT " + 
            "ORDER BY t.endDate ASC")
    List<Transaction> findUpcomingTransactionsByAdmin(@Param("adminUsername") String adminUsername);
}
