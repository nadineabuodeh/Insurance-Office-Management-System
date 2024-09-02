package project.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project.backend.models.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByUserId(Long userId);

    @Query("SELECT p FROM Policy p " +
            "JOIN FETCH p.user u " +
            "JOIN FETCH p.insurance i " +
            "WHERE u.admin.username = :adminUsername")

    List<Policy> findPoliciesByAdmin(@Param("adminUsername") String adminUsername);

}