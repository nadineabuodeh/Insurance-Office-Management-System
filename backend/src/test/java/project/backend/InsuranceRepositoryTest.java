package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import project.backend.Repositories.InsuranceRepository;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.models.Insurance;
import project.backend.models.InsuranceType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class InsuranceRepositoryTest {

    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private UserRepository userRepository;

    private User adminUser;

    @BeforeEach
    public void setUp() {
        adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("testpassword");
        adminUser.setRole(ERole.ROLE_ADMIN);
        adminUser = userRepository.save(adminUser);

        Insurance insurance1 = new Insurance();
        insurance1.setInsuranceType(InsuranceType.HEALTH);
        insurance1.setDescription("Health Insurance");
        insurance1.setAdmin(adminUser);
        insuranceRepository.save(insurance1);

        Insurance insurance2 = new Insurance();
        insurance2.setInsuranceType(InsuranceType.VEHICLE);
        insurance2.setDescription("Vehicle Insurance");
        insurance2.setAdmin(adminUser);
        insuranceRepository.save(insurance2);
    }

    @Test
    public void testFindByAdmin() {
        List<Insurance> insurances = insuranceRepository.findByAdmin(adminUser);

        assertNotNull(insurances);
        assertEquals(2, insurances.size());

        assertTrue(insurances.stream().anyMatch(insurance -> insurance.getInsuranceType() == InsuranceType.HEALTH));
        assertTrue(insurances.stream().anyMatch(insurance -> insurance.getInsuranceType() == InsuranceType.VEHICLE));
    }

    @Test
    public void testFindByAdmin_NoResults() {
        User anotherAdmin = new User();
        anotherAdmin.setUsername("anotherAdmin");
        anotherAdmin.setEmail("anotherAdmin@example.com");
        anotherAdmin.setPassword("anotherpassword");
        anotherAdmin.setRole(ERole.ROLE_ADMIN);
        userRepository.save(anotherAdmin);

        List<Insurance> insurances = insuranceRepository.findByAdmin(anotherAdmin);

        assertTrue(insurances.isEmpty());
    }
}