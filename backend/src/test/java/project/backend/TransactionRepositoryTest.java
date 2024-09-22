package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import project.backend.Repositories.TransactionRepository;
import project.backend.Repositories.PolicyRepository;
import project.backend.Repositories.InsuranceRepository;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.models.*;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InsuranceRepository insuranceRepository;

    private User adminUser;
    private User customerUser;
    private Insurance insurance;
    private Policy policy;
    private Transaction transaction1;
    private Transaction transaction2;

    @BeforeEach
    public void setUp() {
        adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("testpassword");
        adminUser.setRole(ERole.ROLE_ADMIN);
        adminUser = userRepository.save(adminUser);

        customerUser = new User();
        customerUser.setUsername("customer");
        customerUser.setEmail("customer@example.com");
        customerUser.setPassword("customerpassword");
        customerUser.setRole(ERole.ROLE_CUSTOMER);
        customerUser = userRepository.save(customerUser);

        insurance = new Insurance();
        insurance.setInsuranceType(InsuranceType.HEALTH);
        insurance.setDescription("Health Insurance");
        insurance.setAdmin(adminUser);
        insurance = insuranceRepository.save(insurance);

        policy = new Policy(LocalDate.now(), LocalDate.now().plusYears(1), 5000.0, "Basic Coverage", customerUser, insurance, LocalDate.now(), LocalDate.now(), "Health Policy");
        policy = policyRepository.save(policy);

        transaction1 = new Transaction(null, LocalDate.now(), 1000.0, LocalDate.now().plusMonths(1), TransactionType.DEBT, LocalDate.now(), LocalDate.now(), customerUser, policy);
        transaction2 = new Transaction(null, LocalDate.now(), 2000.0, LocalDate.now().plusMonths(2), TransactionType.DEPOSIT, LocalDate.now(), LocalDate.now(), customerUser, policy);
        transactionRepository.save(transaction1);
        transactionRepository.save(transaction2);
    }

    @Test
    public void testFindTransactionsByAdmin() {
        List<Transaction> transactions = transactionRepository.findTransactionsByAdmin(adminUser.getUsername());

        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertTrue(transactions.stream().anyMatch(transaction -> transaction.getAmount().equals(1000.0)));
        assertTrue(transactions.stream().anyMatch(transaction -> transaction.getAmount().equals(2000.0)));
    }

    @Test
    public void testFindByUserId() {
        List<Transaction> transactions = transactionRepository.findByUserId(customerUser.getId());

        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertTrue(transactions.stream().anyMatch(transaction -> transaction.getTransactionType() == TransactionType.DEBT));
        assertTrue(transactions.stream().anyMatch(transaction -> transaction.getTransactionType() == TransactionType.DEPOSIT));
    }

    @Test
    public void testFindByUserIdAndTransactionType() {
        List<Transaction> debtTransactions = transactionRepository.findByUserIdAndTransactionType(customerUser.getId(), TransactionType.DEBT);
        List<Transaction> depositTransactions = transactionRepository.findByUserIdAndTransactionType(customerUser.getId(), TransactionType.DEPOSIT);

        assertNotNull(debtTransactions);
        assertEquals(1, debtTransactions.size());
        assertEquals(1000.0, debtTransactions.get(0).getAmount());

        assertNotNull(depositTransactions);
        assertEquals(1, depositTransactions.size());
        assertEquals(2000.0, depositTransactions.get(0).getAmount());
    }

    @Test
    public void testFindUpcomingTransactionsByAdmin() {
        List<Transaction> upcomingTransactions = transactionRepository.findUpcomingTransactionsByAdmin(adminUser.getUsername());

        assertNotNull(upcomingTransactions);
        assertEquals(1, upcomingTransactions.size());
        assertEquals(1000.0, upcomingTransactions.get(0).getAmount());
    }
}