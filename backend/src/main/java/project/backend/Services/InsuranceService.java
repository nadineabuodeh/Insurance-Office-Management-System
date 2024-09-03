package project.backend.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.backend.DTOs.InsuranceDTO;
import project.backend.Repositories.InsuranceRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Insurance;

@Service
public class InsuranceService {

        @Autowired
        private InsuranceRepository insuranceRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ModelMapper modelMapper;

        @Autowired
        private JwtUtils jwtUtils;

        public List<InsuranceDTO> getAllInsurances(String jwtToken) {
                String adminId = jwtUtils.getUserNameFromJwtToken(jwtToken);
                User admin = userRepository.findByUsername(adminId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Admin not found with username: " + adminId));

                List<Insurance> insurances = insuranceRepository.findByAdmin(admin);
                return insurances.stream()
                                .map(insurance -> {
                                        InsuranceDTO dto = modelMapper.map(insurance, InsuranceDTO.class);
                                        dto.setAdminId(admin.getId());
                                        return dto;
                                })
                                .collect(Collectors.toList());
        }

        public InsuranceDTO getInsuranceById(Long id, String jwtToken) {
                String adminId = jwtUtils.getUserNameFromJwtToken(jwtToken);
                User admin = userRepository.findByUsername(adminId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Admin not found with username: " + adminId));

                Insurance insurance = insuranceRepository.findById(id)
                                .filter(ins -> ins.getAdmin().getId().equals(admin.getId()))
                                .orElseThrow(() -> new ResourceNotFoundException("Insurance not found with ID: " + id));

                InsuranceDTO dto = modelMapper.map(insurance, InsuranceDTO.class);
                dto.setAdminId(admin.getId());
                return dto;
        }

        public InsuranceDTO saveInsurance(InsuranceDTO insuranceDTO, String jwtToken) {
                String adminId = jwtUtils.getUserNameFromJwtToken(jwtToken);
                User admin = userRepository.findByUsername(adminId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Admin not found with username: " + adminId));

                Insurance insurance = modelMapper.map(insuranceDTO, Insurance.class);
                insurance.setAdmin(admin);
                insurance = insuranceRepository.save(insurance);

                InsuranceDTO savedDTO = modelMapper.map(insurance, InsuranceDTO.class);
                savedDTO.setAdminId(admin.getId());
                return savedDTO;
        }

        public InsuranceDTO updateInsurance(Long id, InsuranceDTO insuranceDTO, String jwtToken) {
                String adminId = jwtUtils.getUserNameFromJwtToken(jwtToken);
                User admin = userRepository.findByUsername(adminId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Admin not found with username: " + adminId));

                Insurance existingInsurance = insuranceRepository.findById(id)
                                .filter(ins -> ins.getAdmin().getId().equals(admin.getId()))
                                .orElseThrow(() -> new ResourceNotFoundException("Insurance not found with ID: " + id));

                modelMapper.map(insuranceDTO, existingInsurance);
                Insurance updatedInsurance = insuranceRepository.save(existingInsurance);

                InsuranceDTO updatedDTO = modelMapper.map(updatedInsurance, InsuranceDTO.class);
                updatedDTO.setAdminId(admin.getId());
                return updatedDTO;
        }

        public void deleteInsurance(Long id, String jwtToken) {
                String adminId = jwtUtils.getUserNameFromJwtToken(jwtToken);
                User admin = userRepository.findByUsername(adminId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Admin not found with username: " + adminId));

                Insurance existingInsurance = insuranceRepository.findById(id)
                                .filter(ins -> ins.getAdmin().getId().equals(admin.getId()))
                                .orElseThrow(() -> new ResourceNotFoundException("Insurance not found with ID: " + id));

                insuranceRepository.delete(existingInsurance);
        }
}