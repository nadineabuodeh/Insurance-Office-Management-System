package project.backend.Services;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.DTOs.UserDTO;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;

import java.util.List;
import java.util.Optional;

    @Service
    public class UserService {
        private static final Logger logger = LoggerFactory.getLogger(UserService.class);


        @Autowired
        private ModelMapper modelMapper;

        @Autowired
        private UserRepository userRepository;

        // Convert User entity to UserDTO
        private UserDTO convertToDTO(User user) {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setIdNumber(user.getIdNumber());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setUserName(user.getUsername());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setEmail(user.getEmail());
            dto.setBirthDate(user.getBirthDate());
            dto.setRole(user.getRole().name()); // Convert enum to string
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
            user.setUsername(dto.getUserName());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setEmail(dto.getEmail());
            user.setBirthDate(dto.getBirthDate());
//            user.setRole(Enum.valueOf(dto.getRole())); // Convert string to enum
            user.setPassword(dto.getPassword());
            return user;
        }

        public List<UserDTO> getAllUsers() {


            List<User> userList = userRepository.findAll();
            userList.forEach(task -> logger.info("Fetched Task: {}", task));
            List<UserDTO> taskDTOList = modelMapper.map(userList, new TypeToken<List<UserDTO>>() {}.getType());
            taskDTOList.forEach(taskDTO -> logger.info("Mapped TaskDTO: {}", taskDTO)); // *****
            return taskDTOList;
        }

        public UserDTO getUserById(Long id) {
            return userRepository.findById(id)
                    .map(this::convertToDTO)
                    .orElse(null);
        }

        public UserDTO createUser(UserDTO userDTO) {
            User user = convertToEntity(userDTO);
            return convertToDTO(userRepository.save(user));
        }

        public UserDTO updateUser(Long id, UserDTO userDTO) {
            User user = userRepository.findById(id).orElse(null);
            if (user != null) {
                user = convertToEntity(userDTO);
                return convertToDTO(userRepository.save(user));
            }
            return null;
        }

        public void deleteUser(Long id) {
            userRepository.deleteById(id);
        }
    }
