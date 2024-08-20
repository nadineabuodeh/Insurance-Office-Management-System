package project.backend.models;

import jakarta.persistence.*;
import project.backend.SecurityConfiguration.models.User;

import java.time.LocalDate;


@Entity
@Table(name = "transactions")
public class Transaction {


    //==============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    //==============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private Policy policy;
    //==============================


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;

    private Double amount;

    private LocalDate endDate;

    private TransactionType transactionType;

    private LocalDate createdAt;

    private LocalDate updatedAt;

    public Transaction() {
    }

    public Transaction(Long id, LocalDate startDate, Double amount, LocalDate endDate, TransactionType transactionType, LocalDate createdAt, LocalDate updatedAt, User user, Policy policy) {
        this.id = id;
        this.startDate = startDate;
        this.amount = amount;
        this.endDate = endDate;
        this.transactionType = transactionType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.policy = policy;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDatestartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Policy getPolicy() {
        return policy;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }
}
