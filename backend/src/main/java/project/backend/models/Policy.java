package project.backend.models;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import project.backend.SecurityConfiguration.models.User;

@Entity
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalAmount;
    private String coverageDetails;
    private String policyName;

    //==============================
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    //==============================

    @ManyToOne
    @JoinColumn(name = "insurance_id")
    private Insurance insurance;

    @OneToMany(mappedBy = "policy")
    private List<Transaction> transactions;

    private LocalDate createdAt;
    private LocalDate updatedAt;

    public Policy() {
    }

    public Policy(LocalDate startDate, LocalDate endDate, Double totalAmount, String coverageDetails, User user, Insurance insurance, LocalDate createdAt, LocalDate updatedAt, String policyName) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalAmount = totalAmount;
        this.coverageDetails = coverageDetails;
        this.user = user;
        this.insurance = insurance;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.policyName = policyName;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCoverageDetails() {
        return coverageDetails;
    }

    public void setCoverageDetails(String coverageDetails) {
        this.coverageDetails = coverageDetails;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Insurance getInsurance() {
        return insurance;
    }

    public void setInsurance(Insurance insurance) {
        this.insurance = insurance;
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