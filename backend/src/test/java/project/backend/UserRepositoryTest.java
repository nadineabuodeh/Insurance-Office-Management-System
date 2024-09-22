package project.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User adminUser;
    private User customerUser;

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
        customerUser.setAdmin(adminUser);
        customerUser = userRepository.save(customerUser);
    }

    @Test
    public void testFindByUsername() {
        Optional<User> user = userRepository.findByUsername("customer");
        assertTrue(user.isPresent());
        assertEquals("customer@example.com", user.get().getEmail());
    }

    @Test
    public void testFindByUsername_NotFound() {
        Optional<User> user = userRepository.findByUsername("nonexistentuser");
        assertFalse(user.isPresent());
    }

    @Test
    public void testExistsByUsername() {
        boolean exists = userRepository.existsByUsername("customer");
        assertTrue(exists);
    }

    @Test
    public void testExistsByUsername_NotExists() {
        boolean exists = userRepository.existsByUsername("unknownuser");
        assertFalse(exists);
    }

    @Test
    public void testExistsByEmail() {
        boolean exists = userRepository.existsByEmail("customer@example.com");
        assertTrue(exists);
    }

    @Test
    public void testExistsByEmail_NotExists() {
        boolean exists = userRepository.existsByEmail("unknown@example.com");
        assertFalse(exists);
    }

    @Test
    public void testFindAllByAdminUsername() {
        List<User> users = userRepository.findAllByAdminUsername("admin");
        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("customer", users.get(0).getUsername());
    }

    @Test
    public void testFindByEmail() {
        User user = userRepository.findByEmail("customer@example.com");
        assertNotNull(user);
        assertEquals("customer", user.getUsername());
    }

    @Test
    public void testFindByEmail_NotFound() {
        User user = userRepository.findByEmail("nonexistent@example.com");
        assertNull(user);
    }
}