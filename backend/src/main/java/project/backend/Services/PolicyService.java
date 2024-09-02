package project.backend.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.backend.DTOs.PolicyDTO;
import project.backend.Repositories.InsuranceRepository;
import project.backend.Repositories.PolicyRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Policy;
import project.backend.models.Insurance;

@Service
public class PolicyService {

    Logger logger = org.slf4j.LoggerFactory.getLogger(PolicyService.class);

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

    public List<PolicyDTO> getAllPolicies(String jwtToken) {
        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        List<Policy> policies = policyRepository.findPoliciesByAdmin(adminUsername);
        return policies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PolicyDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));
        return convertToDTO(policy);
    }

    public PolicyDTO savePolicy(PolicyDTO policyDTO) {
        Policy policy = modelMapper.map(policyDTO, Policy.class);

        User user = userRepository.findById(policyDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + policyDTO.getUserId()));
        Insurance insurance = insuranceRepository.findById(policyDTO.getInsuranceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Insurance not found with ID: " + policyDTO.getInsuranceId()));

        policy.setUser(user);
        policy.setInsurance(insurance);

        policy = policyRepository.save(policy);
        return convertToDTO(policy);
    }

    public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
        Policy existingPolicy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));

        modelMapper.map(policyDTO, existingPolicy);
        Policy updatedPolicy = policyRepository.save(existingPolicy);
        return convertToDTO(updatedPolicy);
    }

    private PolicyDTO convertToDTO(Policy policy) {
        PolicyDTO policyDTO = modelMapper.map(policy, PolicyDTO.class);
        policyDTO.setUsername(policy.getUser().getUsername());
        policyDTO.setInsuranceType(policy.getInsurance().getInsuranceType().name());
        return policyDTO;
    }

    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Policy not found with ID: " + id);
        }
        policyRepository.deleteById(id);
    }

    public List<PolicyDTO> getPoliciesByCustomerId(Long customerId) {
        List<Policy> policies = policyRepository.findByUserId(customerId);
        if (policies.isEmpty()) {
            throw new ResourceNotFoundException("No policies found for customer ID: " + customerId);
        }
        return policies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}