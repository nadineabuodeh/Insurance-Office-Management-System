package project.backend.Services;

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

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int PASSWORD_LENGTH = 8;

    //***********************************************

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    //***********************************************


    // Convert User entity to UserDTO
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
        dto.setRole(user.getRole().name()); // Convert enum -> string
        dto.setPassword(user.getPassword());
        return dto;
    }

    // Convert UserDTO to User entity
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
            user.setRole(ERole.valueOf(dto.getRole())); // Convert string -> enum
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
//=================================================

    public UserDTO createUser(UserDTO userDTO, String jwtToken) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already in use: " + userDTO.getEmail());
        }

        User user = convertToEntity(userDTO);  //encoding the new customers password


        String generatedPassword = generateRandomPassword();
        logger.info("Original password: {}", generatedPassword);
        user.setPassword(passwordEncoder.encode(generatedPassword));

        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + adminUsername));

        user.setAdmin(admin);
        ////////////////////////////
        User savedUser = userRepository.save(user);
        UserDTO resultDTO = convertToDTO(savedUser);
        resultDTO.setPassword(generatedPassword);

        return resultDTO;
    }

//=================================================

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(randomIndex));
        }

        return password.toString();
    }

//=================================================

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        String existingPassword = existingUser.getPassword();
        User userToUpdate = convertToEntity(userDTO);
        userToUpdate.setId(id);
        userToUpdate.setPassword(existingPassword);

        User updatedUser = userRepository.save(userToUpdate);
        return convertToDTO(updatedUser);
    }
//=================================================

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
