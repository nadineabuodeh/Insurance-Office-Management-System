package project.backend.DTOs;

import project.backend.models.InsuranceType;

public class InsuranceDTO {
    private Long id;
    private String insuranceType;
    private String description;
    private Long adminId;

    public InsuranceDTO() {
    }

    public InsuranceDTO(Long id, InsuranceType insuranceType, String description, Long adminId) {
        this.id = id;
        this.insuranceType = insuranceType.name();
        this.description = description;
        this.adminId = adminId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
}