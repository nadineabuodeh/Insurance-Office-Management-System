package project.backend.Controllers;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import project.backend.DTOs.UserDTO;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.Services.UserService;
import project.backend.exceptions.ResourceAlreadyExistsException;
import project.backend.exceptions.ResourceNotFoundException;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
@SuppressWarnings("null")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        List<UserDTO> users = userService.getAllUsersByAdmin(adminUsername);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO userDTO = userService.getUserById(id);
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        try {
            String jwtToken = request.getHeader("Authorization").substring(7);
            UserDTO createdUser = userService.createUser(userDTO, jwtToken);// ]
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (ResourceAlreadyExistsException ex) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO, HttpServletRequest request) {
        System.out.println("Received PUT request to update user with ID: " + id);
        System.out.println("Data: " + userDTO.toString());
        String jwtToken = request.getHeader("Authorization").substring(7);
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO, jwtToken);
            System.out.println("UPDATED USER: \n" + updatedUser.toString());
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCustomerInfo(HttpServletRequest request) {
        try {
            String jwtToken = request.getHeader("Authorization").substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(jwtToken);

            UserDTO userDTO = userService.getCustomerByUsername(username);
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
