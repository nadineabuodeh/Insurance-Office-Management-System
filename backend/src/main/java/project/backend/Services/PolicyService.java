package project.backend.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.backend.DTOs.PolicyDTO;
import project.backend.Repositories.PolicyRepository;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Policy;

@Service
public class PolicyService {
    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<PolicyDTO> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(policy -> modelMapper.map(policy, PolicyDTO.class))
                .collect(Collectors.toList());
    }

    public PolicyDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));
        return modelMapper.map(policy, PolicyDTO.class);
    }

    public PolicyDTO savePolicy(PolicyDTO policyDTO) {
        Policy policy = modelMapper.map(policyDTO, Policy.class);
        policy = policyRepository.save(policy);
        return modelMapper.map(policy, PolicyDTO.class);
    }

    public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
        Policy existingPolicy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));

        modelMapper.map(policyDTO, existingPolicy);
        Policy updatedPolicy = policyRepository.save(existingPolicy);
        return modelMapper.map(updatedPolicy, PolicyDTO.class);
    }

    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Policy not found with ID: " + id);
        }
        policyRepository.deleteById(id);
    }
}