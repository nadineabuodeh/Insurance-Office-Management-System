package project.backend.DTOs;

import project.backend.models.TransactionType;

import java.time.LocalDate;

public class TransactionDTO {
    private Long id;

    private LocalDate startDate;

    private Double amount;

    private LocalDate endDate;

    private TransactionType transactionType;

    private LocalDate createdAt;

    private LocalDate updatedAt;

    private Long userId;

    private Long policyId;


    public TransactionDTO(Long id, Long userId, LocalDate startDate, Double amount, LocalDate endDate, TransactionType transactionType, LocalDate createdAt, LocalDate updatedAt, Long policyId){   
        this.id = id;
        this.userId = userId;
        this.startDate = startDate;
        this.amount = amount;
        this.endDate = endDate;
        this.transactionType = transactionType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.policyId = policyId;
    }

    public TransactionDTO() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
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

    public Long getPolicyId() {
        return policyId;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
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
    
}
