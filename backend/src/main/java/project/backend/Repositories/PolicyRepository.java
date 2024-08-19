package project.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import project.backend.models.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
}
