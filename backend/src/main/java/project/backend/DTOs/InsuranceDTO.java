package project.backend.DTOs;

public class InsuranceDTO {
    private Long id;
    private String insuranceType;
    private String description;

    public InsuranceDTO() {
    }

    public InsuranceDTO(Long id, String insuranceType, String description) {
        this.id = id;
        this.insuranceType = insuranceType;
        this.description = description;
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
}