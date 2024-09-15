package project.backend.SecurityConfiguration.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.backend.SecurityConfiguration.models.ERole;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.payload.request.CurrencyRequest;
import project.backend.SecurityConfiguration.payload.request.UpdateAdminRequest;
import project.backend.SecurityConfiguration.payload.response.MessageResponse;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(@RequestHeader("Authorization") String token) {
        String username = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return ResponseEntity.ok(admin);
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateAdminProfile(@Validated @RequestBody UpdateAdminRequest updateRequest,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        admin.setCurrency(updateRequest.getCurrency());
        admin.setFirstName(updateRequest.getFirstName());
        admin.setLastName(updateRequest.getLastName());
        admin.setEmail(updateRequest.getEmail());
        admin.setPhoneNumber(updateRequest.getPhoneNumber());

        userRepository.save(admin);

        return ResponseEntity.ok(new MessageResponse("Admin profile updated successfully"));
    }

    @PostMapping("/setCurrency")
    public ResponseEntity<?> setCurrency(@RequestBody CurrencyRequest currencyRequest,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != ERole.ROLE_ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Only admins can set the currency!"));
        }

        user.setCurrency(currencyRequest.getCurrency());
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Currency updated successfully!"));
    }
}