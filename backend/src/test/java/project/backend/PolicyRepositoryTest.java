package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import project.backend.Repositories.InsuranceRepository;
import project.backend.Repositories.PolicyRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.models.Insurance;
import project.backend.models.Policy;
import project.backend.models.InsuranceType;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class PolicyRepositoryTest {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InsuranceRepository insuranceRepository;

    private User adminUser;
    private User customerUser;
    private Insurance insurance;

    @BeforeEach
    public void setUp() {
        adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("testpassword");
        adminUser.setRole(project.backend.SecurityConfiguration.models.ERole.ROLE_ADMIN);
        adminUser = userRepository.save(adminUser);

        customerUser = new User();
        customerUser.setUsername("customer");
        customerUser.setEmail("customer@example.com");
        customerUser.setPassword("customerpassword");
        customerUser.setRole(project.backend.SecurityConfiguration.models.ERole.ROLE_CUSTOMER);
        customerUser = userRepository.save(customerUser);

        insurance = new Insurance();
        insurance.setInsuranceType(InsuranceType.HEALTH);
        insurance.setDescription("Health Insurance");
        insurance.setAdmin(adminUser);
        insurance = insuranceRepository.save(insurance);

        Policy policy1 = new Policy(LocalDate.now(), LocalDate.now().plusYears(1), 5000.0, "Basic Coverage",
                customerUser, insurance, LocalDate.now(), LocalDate.now(), "Health Policy");
        Policy policy2 = new Policy(LocalDate.now(), LocalDate.now().plusYears(1), 10000.0, "Premium Coverage",
                customerUser, insurance, LocalDate.now(), LocalDate.now(), "Premium Health Policy");
        policyRepository.save(policy1);
        policyRepository.save(policy2);
    }

    @Test
    public void testFindByUserId() {
        List<Policy> policies = policyRepository.findByUserId(customerUser.getId());

        assertNotNull(policies);
        assertEquals(2, policies.size());

        assertTrue(policies.stream().anyMatch(policy -> policy.getPolicyName().equals("Health Policy")));
        assertTrue(policies.stream().anyMatch(policy -> policy.getPolicyName().equals("Premium Health Policy")));
    }

    @Test
    public void testFindByPolicyName() {
        Policy policy = policyRepository.findByPolicyName("Health Policy");

        assertNotNull(policy);
        assertEquals("Health Policy", policy.getPolicyName());
        assertEquals(customerUser.getId(), policy.getUser().getId());
    }

    @Test
    public void testFindByPolicyName_NotFound() {
        Policy policy = policyRepository.findByPolicyName("NonExistentPolicy");

        assertNull(policy);
    }
}
