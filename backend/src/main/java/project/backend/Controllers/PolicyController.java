package project.backend.Controllers;

import java.util.List;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import project.backend.DTOs.PolicyDTO;
import project.backend.SecurityConfiguration.models.User;
import project.backend.Services.PolicyService;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Policy;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/policies")
public class PolicyController {
    Logger logger = org.slf4j.LoggerFactory.getLogger(PolicyController.class);

    @Autowired
    private PolicyService policyService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<PolicyDTO>> getAllPolicies(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<PolicyDTO> policies = policyService.getAllPolicies(jwtToken);
        return new ResponseEntity<>(policies, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<PolicyDTO> getPolicyById(@PathVariable Long id) {
        PolicyDTO policyDTO = policyService.getPolicyById(id);
        return new ResponseEntity<>(policyDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<PolicyDTO> createPolicy(@RequestBody PolicyDTO policyDTO) {
        PolicyDTO createdPolicy = policyService.savePolicy(policyDTO);
        return new ResponseEntity<>(createdPolicy, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PolicyDTO> updatePolicy(@PathVariable Long id, @RequestBody PolicyDTO policyDTO) {
        policyDTO.setId(id);
        PolicyDTO updatedPolicy = policyService.updatePolicy(id, policyDTO);
        return new ResponseEntity<>(updatedPolicy, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PolicyDTO>> getPoliciesByCustomerId(@PathVariable Long customerId) {
        List<PolicyDTO> policies = policyService.getPoliciesByCustomerId(customerId);
        return new ResponseEntity<>(policies, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @GetMapping("/my-policies")
    public ResponseEntity<List<PolicyDTO>> getPoliciesForCustomer(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<PolicyDTO> policies = policyService.getPoliciesForCustomer(jwtToken);
        return new ResponseEntity<>(policies, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')")
    @GetMapping("/user/{policyId}")
    public ResponseEntity<Long> getUserIdByPolicyId(@PathVariable Long policyId) {
        try {
            Long userId = policyService.getUserIdByPolicyId(policyId);
            System.out.println("userId: " + userId);
            return new ResponseEntity<>(userId, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}