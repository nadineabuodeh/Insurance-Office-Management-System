package project.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import project.backend.DTOs.InsuranceDTO;
import project.backend.Services.InsuranceService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/insurances")
public class InsuranceController {

    @Autowired
    private InsuranceService insuranceService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<InsuranceDTO>> getAllInsurances(HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        List<InsuranceDTO> insurances = insuranceService.getAllInsurances(jwtToken);
        return new ResponseEntity<>(insurances, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<InsuranceDTO> getInsuranceById(@PathVariable Long id, HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        InsuranceDTO insuranceDTO = insuranceService.getInsuranceById(id, jwtToken);
        return insuranceDTO != null ? new ResponseEntity<>(insuranceDTO, HttpStatus.OK)
                                    : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<InsuranceDTO> createInsurance(@RequestBody InsuranceDTO insuranceDTO, HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        InsuranceDTO createdInsurance = insuranceService.saveInsurance(insuranceDTO, jwtToken);
        return new ResponseEntity<>(createdInsurance, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<InsuranceDTO> updateInsurance(@PathVariable Long id, @RequestBody InsuranceDTO insuranceDTO, HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        InsuranceDTO updatedInsurance = insuranceService.updateInsurance(id, insuranceDTO, jwtToken);
        return new ResponseEntity<>(updatedInsurance, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInsurance(@PathVariable Long id, HttpServletRequest request) {
        String jwtToken = request.getHeader("Authorization").substring(7);
        insuranceService.deleteInsurance(id, jwtToken);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}