package project.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import project.backend.models.Insurance;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    
}