package project.backend.DTOs;

import java.util.Date;

public class UserDTO {
    private Long id;
    private Long idNumber;
    private String firstName;
    private String lastName;
    private String username;
    private Long phoneNumber;
    private String email;
    private Date birthDate;
    private String role;
    private String password;

    public UserDTO(Long id, Long idNumber, String firstName, String lastName, String username, Long phoneNumber, String email, Date birthDate, String role, String password) {
        this.id = id;
        this.idNumber = idNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.birthDate = birthDate;
        this.role = role;
        this.password = password;
    }

    public UserDTO() {
    }

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
    }

    public void setIdNumber(Long idNumber) {
    }

    public Long getIdNumber() {
        return idNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() { //for testing
        return "UserDTO{" +
                "id=" + id +
                ", idNumber=" + idNumber +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", userName='" + username + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", email='" + email + '\'' +
                ", birthDate=" + birthDate +
                ", role='" + role + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
