package project.backend.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.backend.DTOs.InsuranceDTO;
import project.backend.Repositories.InsuranceRepository;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Insurance;

@Service
public class InsuranceService {
    
    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<InsuranceDTO> getAllInsurances() {
        return insuranceRepository.findAll()
                .stream()
                .map(insurance -> modelMapper.map(insurance, InsuranceDTO.class))
                .collect(Collectors.toList());
    }

    public InsuranceDTO getInsuranceById(Long id) {
        Insurance insurance = insuranceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance not found with ID: " + id));
        return modelMapper.map(insurance, InsuranceDTO.class);
    }

    public InsuranceDTO saveInsurance(InsuranceDTO insuranceDTO) {
        Insurance insurance = modelMapper.map(insuranceDTO, Insurance.class);
        insurance = insuranceRepository.save(insurance);
        return modelMapper.map(insurance, InsuranceDTO.class);
    }

    public InsuranceDTO updateInsurance(Long id, InsuranceDTO insuranceDTO) {
        Insurance existingInsurance = insuranceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance not found with ID: " + id));

        modelMapper.map(insuranceDTO, existingInsurance);
        Insurance updatedInsurance = insuranceRepository.save(existingInsurance);
        return modelMapper.map(updatedInsurance, InsuranceDTO.class);
    }

    public void deleteInsurance(Long id) {
        if (!insuranceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Insurance not found with ID: " + id);
        }
        insuranceRepository.deleteById(id);
    }
}