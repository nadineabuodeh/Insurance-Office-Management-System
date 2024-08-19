package project.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.backend.models.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}