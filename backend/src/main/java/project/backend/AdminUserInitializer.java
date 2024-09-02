package project.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;

import java.util.Date;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void run(String... args) throws Exception {
        createAdminUser("1234567",
                "Admin",
                "User",
                "asal",
                "0597279600",
                "asal@example.com",
                new Date(),
                ERole.ROLE_ADMIN,
                "asalPassword");

        createAdminUser("6543217",
                "Arab",
                "Company",
                "arabcompany",
                "0599316050",
                "arabcompany@example.com",
                new Date(),
                ERole.ROLE_ADMIN,
                "arabCompanyPassword");

        createAdminUser("7894567",
                "International",
                "User",
                "international",
                "0599316669",
                "international@example.com",
                new Date(),
                ERole.ROLE_ADMIN,
                "internationalPassword");
    }

    private void createAdminUser(String idNumber, String firstName, String lastName, String username,
            String phoneNumber, String email, Date birthDate, ERole role, String password) {
        if (username == null || username.trim().isEmpty()) {
            System.out.println("Username CAN NOT be blank");
            return;
        }

        if (email == null || email.trim().isEmpty()) {
            System.out.println("Email CAN NOT be blank");
            return;
        }

        if (password == null || password.trim().isEmpty()) {
            System.out.println("Password CAN NOT be blank");
            return;
        }

        if (!userRepository.existsByUsername(username)) {
            User admin = new User(idNumber, firstName, lastName, phoneNumber, birthDate, username, email,
                    passwordEncoder.encode(password), role);
            System.out.println("pppp:   " + passwordEncoder.encode(password));

            userRepository.save(admin);
            System.out.println("Admin user " + username + " created");
        } else {
            System.out.println("Admin user " + username + " already exists");
        }
    }
}
