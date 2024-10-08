package project.backend.Services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.mail.MessagingException;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.backend.DTOs.PolicyDTO;
import project.backend.Repositories.InsuranceRepository;
import project.backend.Repositories.PolicyRepository;
import project.backend.Repositories.TransactionRepository;
import project.backend.SecurityConfiguration.models.User;
import project.backend.SecurityConfiguration.repository.UserRepository;
import project.backend.SecurityConfiguration.security.jwt.JwtUtils;
import project.backend.exceptions.ResourceNotFoundException;
import project.backend.models.Policy;
import project.backend.models.EmailDetails;
import project.backend.models.Insurance;
import project.backend.models.Transaction;
import project.backend.models.TransactionType;

@Service
public class PolicyService {

    Logger logger = org.slf4j.LoggerFactory.getLogger(PolicyService.class);

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    public Policy convertToEntity(PolicyDTO policyDTO) {
        Policy policy = modelMapper.map(policyDTO, Policy.class);

        User user = userRepository.findById(policyDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + policyDTO.getUserId()));
        Insurance insurance = insuranceRepository.findById(policyDTO.getInsuranceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Insurance not found with ID: " + policyDTO.getInsuranceId()));

        policy.setUser(user);
        policy.setInsurance(insurance);

        return policy;
    }

    private PolicyDTO convertToDTO(Policy policy) {
        PolicyDTO policyDTO = modelMapper.map(policy, PolicyDTO.class);
        policyDTO.setUsername(policy.getUser().getUsername());
        policyDTO.setInsuranceType(policy.getInsurance().getInsuranceType().name());
        return policyDTO;
    }

    public List<PolicyDTO> getAllPolicies(String jwtToken) {
        String adminUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        List<Policy> policies = policyRepository.findPoliciesByAdmin(adminUsername);
        return policies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PolicyDTO> getPoliciesForCustomer(String jwtToken) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Policy> policies = policyRepository.findByUserId(user.getId());

        return policies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PolicyDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));
        return convertToDTO(policy);
    }

    String formattedInsuranceType;
    String insuranceType;

    public PolicyDTO savePolicy(PolicyDTO policyDTO) throws MessagingException, MessagingException {
        Policy policy = modelMapper.map(policyDTO, Policy.class);

        User user = userRepository.findById(policyDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + policyDTO.getUserId()));
        Insurance insurance = insuranceRepository.findById(policyDTO.getInsuranceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Insurance not found with ID: " + policyDTO.getInsuranceId()));

        policy.setUser(user);
        policy.setInsurance(insurance);

        policy = policyRepository.save(policy);

        insuranceType = insurance.getInsuranceType().name();
        formattedInsuranceType = insuranceType.substring(0, 1).toUpperCase() + insuranceType.substring(1).toLowerCase();

        String messageBody = "<p>Dear " + user.getFirstName() + ",</p>" +
                "<p>We are pleased to inform you that your policy has been successfully created with the following details:</p>"
                +
                "<ul>" +
                "<li><strong>Policy Name: </strong>" + policy.getPolicyName() + "</li>" +
                "<li><strong>Start Date: </strong>" + policy.getStartDate() + "</li>" +
                "<li><strong>End Date: </strong>" + policy.getEndDate() + "</li>" +
                "<li><strong>Total Amount: </strong>&#8362;" + String.format("%.2f", policy.getTotalAmount()) + "</li>"
                +
                "<li><strong>Insurance Type: </strong>" + formattedInsuranceType + "</li>" +
                "</ul>" +
                "<p>Thank you for choosing InsuranceNexus! If you have any questions or concerns, please do not hesitate to contact us.</p>"
                +
                "<p>Best regards,<br>InsuranceNexus Team.</p>";

        emailService.sendEmail(EmailDetails.builder()
                .recipient(user.getEmail())
                .subject("New Insurance Policy Successfully Created")
                .messageBody(messageBody)
                .build());

        return convertToDTO(policy);
    }

    public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
        Policy existingPolicy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));

        policyDTO.setStartDate(existingPolicy.getStartDate());
        policyDTO.setEndDate(existingPolicy.getEndDate());
        policyDTO.setTotalAmount(existingPolicy.getTotalAmount());
        policyDTO.setUserId(existingPolicy.getUser().getId());

        Insurance insurance = insuranceRepository.findById(policyDTO.getInsuranceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Insurance not found with ID: " + policyDTO.getInsuranceId()));
        existingPolicy.setInsurance(insurance);

        existingPolicy.setCoverageDetails(policyDTO.getCoverageDetails());
        existingPolicy.setPolicyName(policyDTO.getPolicyName());

        Policy updatedPolicy = policyRepository.save(existingPolicy);
        return convertToDTO(updatedPolicy);
    }

    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Policy not found with ID: " + id);
        }
        policyRepository.deleteById(id);
    }

    public List<PolicyDTO> getPoliciesByCustomerId(Long customerId) {
        List<Policy> policies = policyRepository.findByUserId(customerId);
        if (policies.isEmpty()) {
            throw new ResourceNotFoundException("No policies found for customer ID: " + customerId);
        }
        return policies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long getUserIdByPolicyId(Long policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + policyId));
        return policy.getUser().getId();

    }

    // Generates a list of transactions for the given policy by dividing the total
    // amount into equal payments based on the # of payments.,

    public void generateTransactions(PolicyDTO policyDTO, int numberOfPayments) throws MessagingException {
        if (numberOfPayments <= 0) {
            throw new IllegalArgumentException("Number of payments must be greater than zero.");
        }
        
        Policy policy = convertToEntity(policyDTO);
    
        List<Transaction> transactions = new ArrayList<>();
        double totalAmount = policy.getTotalAmount();
        double amountPerPayment = totalAmount / numberOfPayments;
    
        // Calculate the remainder (Aguras)
        double payment = Math.floor(amountPerPayment);
        double remainder = totalAmount - (payment * numberOfPayments);
    
        LocalDate startDate = policy.getStartDate();
        LocalDate endDate = policy.getEndDate();
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        long interval = daysBetween / numberOfPayments;
    
        User user = policy.getUser();
        logger.debug("User ID: {}", user.getId());
    
        StringBuilder transactionDetails = new StringBuilder();
    
        for (int i = 0; i < numberOfPayments; i++) {
            LocalDate paymentDate = startDate.plusDays(i * interval);
    
            if (i == numberOfPayments - 1) { // Making sure the date of the last payment is set to the end date
                paymentDate = endDate;
            }
    
            double paymentAmount;
            if (i == 0) {
                paymentAmount = payment + remainder; // Adding the remainder to the first payment
            } else {
                paymentAmount = payment;
            }
    
            Transaction transaction = new Transaction(
                null,
                paymentDate, // (startDate)
                paymentAmount,
                paymentDate, // (endDate)
                TransactionType.DEBT,
                LocalDate.now(), // (createdAt)
                LocalDate.now(), // (updatedAt)
                user,
                policy
            );
    
            transactions.add(transaction);
    
            transactionDetails.append("<strong>Payment ").append(i + 1).append(":</strong><br>")
                    .append("<strong>Amount:</strong> &#8362;").append(String.format("%.2f", paymentAmount)).append("<br>")
                    .append("<strong>Payment Date:</strong> ").append(paymentDate).append("<br><br>");
        }
    
        transactionRepository.saveAll(transactions);
    
        String emailBody = "<p>Dear " + user.getFirstName() + ",</p>" +
            "<p>We are pleased to inform you that your new policy has been created with multiple payment installments. Below are the details of the transactions for your policy: "
            + policy.getPolicyName() + "</p>" +
            "<p>" + transactionDetails.toString() + "</p>" +
            "<p>If you have any questions, feel free to reach out to us.</p>" +
            "<p>Best regards,<br>InsuranceNexus Team</p>";
    
        emailService.sendEmail(EmailDetails.builder()
                .messageBody(emailBody)
                .recipient(user.getEmail())
                .subject("Installment Payment Schedule for Your Policy")
                .build());
    }    
}