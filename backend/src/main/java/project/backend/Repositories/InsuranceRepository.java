package project.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import project.backend.SecurityConfiguration.models.User;
import project.backend.models.Insurance;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    List<Insurance> findByAdmin(User admin);
}