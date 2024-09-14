package project.backend.Services;

import jakarta.mail.MessagingException;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.backend.DTOs.UserDTO;
import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.exceptions.ResourceAlreadyExistsException;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.EmailDetails;

import java.util.List;

import java.security.SecureRandom;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int PASSWORD_LENGTH = 8;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setIdNumber(user.getIdNumber());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEmail(user.getEmail());
        dto.setBirthDate(user.getBirthDate());
        dto.setRole(user.getRole().name());
        dto.setPassword(user.getPassword());
        return dto;
    }

    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setIdNumber(dto.getIdNumber());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setUsername(dto.getUsername());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setEmail(dto.getEmail());
        user.setBirthDate(dto.getBirthDate());
        try {
            user.setRole(ERole.valueOf(dto.getRole()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role value: " + dto.getRole(), e);
        }

        user.setPassword(dto.getPassword());
        return user;
    }

    public List<UserDTO> getAllUsers() {
        List<User> userList = userRepository.findAll();
        userList.forEach(task -> logger.info("Fetched User: {}", task));
        List<UserDTO> userDTOList = modelMapper.map(userList, new TypeToken<List<UserDTO>>() {
        }.getType());
        userDTOList.forEach(taskDTO -> logger.info("Mapped UserDTO: {}", taskDTO));
        return userDTOList;
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToDTO(user);
    }

    public UserDTO createUser(UserDTO userDTO, String jwtToken) throws MessagingException {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already in use: " + userDTO.getEmail());
        }

        User user = convertToEntity(userDTO);

        String generatedPassword = generateRandomPassword();
        logger.info("Original password: {}", generatedPassword);
        user.setPassword(passwordEncoder.encode(generatedPassword));

        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + adminUsername));

        user.setAdmin(admin);
        User savedUser = userRepository.save(user);
        UserDTO resultDTO = convertToDTO(savedUser);
        resultDTO.setPassword(generatedPassword);

        emailService.sendEmail(EmailDetails.builder()

                .recipient(savedUser.getEmail())
                .subject("Welcome to InsuranceNexus!")
                .messageBody(
                        "<html>" +
                                "<body >" +
                                "<p>Welcome to InsuranceNexus, " + savedUser.getFirstName() + "!</p>" +
                                "<p>We're excited to have you with us. Your account has been created successfully. Please find your login details below:</p>" +
                                "<ul>" +
                                "<li><strong>Username:</strong> " + savedUser.getUsername() + "</li>" +
                                "<li><strong>Password:</strong> " + generatedPassword + "</li>" +
                                "</ul>" +
                                "<p>Thank you for choosing InsuranceNexus to safeguard your future!</p>" +
                                "<p>Best regards,<br>InsuranceNexus Team.</p>" +
                                "</body>" +
                                "</html>"
                )


                .recipient(savedUser.getEmail())
                .subject("Welcome to InsuranceNexus!")
                .build());

        return resultDTO;
    }

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(randomIndex));
        }

        return password.toString();
    }

    public UserDTO updateUser(Long id, UserDTO userDTO, String jwtToken) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    
        User admin = existingUser.getAdmin();

        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + adminUsername));



        userDTO.setId(id);
        System.out.println("id: " + userDTO.getId());
        String existingPassword = existingUser.getPassword();
        
        User userToUpdate = convertToEntity(userDTO);
        userToUpdate.setAdmin(admin);

        userToUpdate.setId(id);
        userToUpdate.setPassword(existingPassword);
        userToUpdate.setAdmin(admin);
        
        User updatedUser = userRepository.save(userToUpdate);
        return convertToDTO(updatedUser);
    }
    

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public List<UserDTO> getAllUsersByAdmin(String adminUsername) {
        List<User> userList = userRepository.findAllByAdminUsername(adminUsername);
        userList.forEach(user -> logger.info("Fetched User: {}", user));
        List<UserDTO> userDTOList = modelMapper.map(userList, new TypeToken<List<UserDTO>>() {
        }.getType());
        userDTOList.forEach(userDTO -> logger.info("Mapped UserDTO: {}", userDTO));
        return userDTOList;
    }

    public UserDTO getCustomerByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        if (!user.getRole().equals(ERole.ROLE_CUSTOMER)) {
            throw new ResourceNotFoundException("User with username: " + username + " is not a customer");
        }

        return convertToDTO(user);
    }
}
