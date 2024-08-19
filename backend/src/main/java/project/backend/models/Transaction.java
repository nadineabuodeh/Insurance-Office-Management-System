package project.backend.models;

import jakarta.persistence.*;
import project.backend.SecurityConfiguration.models.User;

import java.util.Date;


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

    private Date startDate;

    private Double amount;

    private Date endDate;

    private TransactionType transactionType;

    private Date createdAt;

    private Date updatedAt;

    public Transaction() {
    }

    public Transaction(Long id, Date startDate, Double amount, Date endDate, TransactionType transactionType, Date createdAt, Date updatedAt, User user, Policy policy) {
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

    public Date getStartDate() {
        return startDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getStartDatestartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Policy getPolicy() {
        return policy;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }
}
