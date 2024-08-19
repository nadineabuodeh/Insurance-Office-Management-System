package project.backend.DTOs;

import project.backend.models.TransactionType;

import java.util.Date;

public class TransactionDTO {
    private Long id;

    private Date startDate;

    private Double amount;

    private Date endDate;

    private TransactionType transactionType;

    private Date createdAt;

    private Date updatedAt;

    private Long userId;

    public TransactionDTO(Long id,Long userId, Date startDate, Double amount, Date endDate, TransactionType transactionType, Date createdAt, Date updatedAt) {
        this.id = id;
        this.userId = userId;
        this.startDate = startDate;
        this.amount = amount;
        this.endDate = endDate;
        this.transactionType = transactionType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Date getStartDate() {
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
}
