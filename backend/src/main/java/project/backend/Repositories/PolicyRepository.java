package project.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import project.backend.models.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByUserId(Long userId);
}