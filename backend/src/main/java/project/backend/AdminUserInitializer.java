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
        // Example data for demonstration purposes
        createAdminUser(123456L,               // idNumber
                "Admin",                        // firstName
                "User",                         // lastName
                "asal",                         // userName
                1234567890L,                    // phoneNumber
                "asal@example.com",             // email
                new Date(),                     // birthDate
                ERole.ROLE_ADMIN,               // role
                "asalPassword"                  // password
        );

        createAdminUser(654321L,       // idNumber
                "Arab",                         // firstName
                "Company",                      // lastName
                "arabcompany",                  // userName
                9876543210L,                    // phoneNumber
                "arabcompany@example.com",      // email
                new Date(),                     // birthDate
                ERole.ROLE_ADMIN,               // role
                "arabCompanyPassword"           // password
        );

        createAdminUser(789456L,                        // idNumber
                "International",                // firstName
                "User",                         // lastName
                "international",                // userName
                1122334455L,                    // phoneNumber
                "international@example.com",    // email
                new Date(),                     // birthDate
                ERole.ROLE_ADMIN,               // role
                "internationalPassword"         // password
        );
    }



    private void createAdminUser(Long idNumber, String firstName, String lastName, String username, Long phoneNumber, String email, Date birthDate, ERole role, String password) {

        // Checking blank fields
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
            User admin = new User(idNumber, firstName, lastName, phoneNumber, birthDate, username, email, passwordEncoder.encode(password), role);
//            User admin = new User(idNumber, firstName, lastName, phoneNumber, birthDate, username, email, password, role);
           System.out.println("pppp:   "+passwordEncoder.encode(password));

            userRepository.save(admin);
            System.out.println("Admin user " + username + " created");
        } else {
            System.out.println("Admin user " + username + " already exists");
        }
    }
}


