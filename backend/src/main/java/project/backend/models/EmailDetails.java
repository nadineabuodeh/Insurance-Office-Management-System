package project.backend.models;


public class EmailDetails {

    private String recipient;
    private String messageBody;
    private String subject;


    public EmailDetails() {
    }

    public EmailDetails(String recipient, String messageBody, String subject) {
        this.recipient = recipient;
        this.messageBody = messageBody;
        this.subject = subject;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String recipient;
        private String messageBody;
        private String subject;

        public Builder() {
        }


        public Builder recipient(String recipient) {
            this.recipient = recipient;
            return this;
        }

        public Builder messageBody(String messageBody) {
            this.messageBody = messageBody;
            return this;
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public EmailDetails build() {
            return new EmailDetails(recipient, messageBody, subject);
        }
    }
}



