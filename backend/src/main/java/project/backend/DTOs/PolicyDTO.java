package project.backend.DTOs;

import java.time.LocalDate;

public class PolicyDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalAmount;
    private String coverageDetails;
    private Long userId;
    private Long insuranceId;

    private String username;
    private String insuranceType;
   
    public PolicyDTO() {
    }

    public PolicyDTO(Long id, LocalDate startDate, LocalDate endDate, Double totalAmount, String coverageDetails,
            Long userId, Long insuranceId) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalAmount = totalAmount;
        this.coverageDetails = coverageDetails;
        this.userId = userId;
        this.insuranceId = insuranceId;
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

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getInsuranceId() {
        return insuranceId;
    }

    public void setInsuranceId(Long insuranceId) {
        this.insuranceId = insuranceId;
    }    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }
}
