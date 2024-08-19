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

//    @Override
//    public void run(String... args) throws Exception {
//        createAdminUser("asal", "asal@example.com", "asalPassword");
//        createAdminUser("Arab Company", "arabcompany@example.com", "arabCompanyPassword");
//        createAdminUser("international", "international@example.com", "internationalPassword");
//    }


    public void run(String... args) throws Exception {
        // Example data for demonstration purposes
        createAdminUser(
                123456L,                        // idNumber
                "Admin",                        // firstName
                "User",                         // lastName
                "asal",                         // userName
                1234567890L,                    // phoneNumber
                "asal@example.com",             // email
                new Date(),                     // birthDate
                "ROLE_ADMIN",                   // role
                "asalPassword"                  // password
        );

        createAdminUser(
                654321L,                        // idNumber
                "Arab",                         // firstName
                "Company",                      // lastName
                "arabcompany",                  // userName
                9876543210L,                    // phoneNumber
                "arabcompany@example.com",      // email
                new Date(),                     // birthDate
                "ROLE_ADMIN",                   // role
                "arabCompanyPassword"           // password
        );

        createAdminUser(
                789456L,                        // idNumber
                "International",                // firstName
                "User",                         // lastName
                "international",                // userName
                1122334455L,                    // phoneNumber
                "international@example.com",    // email
                new Date(),                     // birthDate
                "ROLE_ADMIN",                   // role
                "internationalPassword"         // password
        );
    }

//    private void createAdminUser(Long idNumber, String firstName, String lastName, String userName, Long phoneNumber, String email, Date birthDate, String role, String password) {
//        if (!userRepository.existsByUsername(userName)) {
//            User admin = new User(idNumber, firstName, lastName, userName, phoneNumber , email, birthDate, role,  passwordEncoder.encode(password));
//            admin.setRole(ERole.ROLE_ADMIN);
//            userRepository.save(admin);
//            System.out.println("Admin user " + userName + " created");
//        } else {
//            System.out.println("Admin user " + userName + " already exists");
//        }
//    }

    private void createAdminUser(Long idNumber, String firstName, String lastName, String userName, Long phoneNumber, String email, Date birthDate, String role, String password) {
        // Check if username is blank or null
        if (userName == null || userName.trim().isEmpty()) {
            System.out.println("Username cannot be blank");
            return;
        }

        // Check if email is blank or null
        if (email == null || email.trim().isEmpty()) {
            System.out.println("Email cannot be blank");
            return;
        }

        // Check if password is blank or null
        if (password == null || password.trim().isEmpty()) {
            System.out.println("Password cannot be blank");
            return;
        }

        if (!userRepository.existsByUsername(userName)) {
            User admin = new User(idNumber, firstName, lastName, phoneNumber, birthDate, userName, email, passwordEncoder.encode(password), ERole.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user " + userName + " created");
        } else {
            System.out.println("Admin user " + userName + " already exists");
        }
    }

}

