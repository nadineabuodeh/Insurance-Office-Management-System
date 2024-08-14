package project.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminUser("asal", "asal@example.com", "asalPassword");
        createAdminUser("Arab Company", "arabcompany@example.com", "arabCompanyPassword");
        createAdminUser("international", "international@example.com", "internationalPassword");
    }

    private void createAdminUser(String username, String email, String password) {
        if (!userRepository.existsByUsername(username)) {
            User admin = new User(username, email, passwordEncoder.encode(password));
            admin.setRole(ERole.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user " + username + " created");
        } else {
            System.out.println("Admin user " + username + " already exists");
        }
    }
}

