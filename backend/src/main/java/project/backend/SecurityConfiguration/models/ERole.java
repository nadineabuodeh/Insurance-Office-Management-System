package project.backend.SecurityConfiguration.models;

public enum ERole {
  ROLE_CUSTOMER(0),
  ROLE_ADMIN(1);

  private final int value;

  private ERole(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }

  public static ERole fromValue(int value) {
    for (ERole role : values()) {
      if (role.value == value) {
        return role;
      }
    }
    throw new IllegalArgumentException("Unknown enum value: " + value);
  }
}

