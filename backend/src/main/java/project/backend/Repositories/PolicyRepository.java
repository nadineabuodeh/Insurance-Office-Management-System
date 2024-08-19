package project.backend.Repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import project.backend.DTOs.PolicyDTO;
import project.backend.models.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Collection<PolicyDTO> findByUserId(Long customerId);
}