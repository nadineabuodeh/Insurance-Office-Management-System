package project.backend.Services;

import jakarta.activation.DataHandler;
import jakarta.activation.FileDataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import project.backend.models.EmailDetails;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String emailSender;

    private final String emailHeader = """
                <html>
                <head>
                    <style>
                        * {
                            font-family: Georgia, "Times New Roman", Times, serif;
                        }
                        body, html {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                            background-color: #f5f5f5;
                            overflow: auto;
                            color: black;
                        }
                        .email-container {
                            background-color: #ffffff;
                            padding: 20px;
                            margin: 20px auto;
                            max-width: 600px;
                            border-radius: 4px;
                            color: black;
                        }
                        .header {
                            background-color: #2d445d;
                            padding: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 15px;
                            border-radius: 8px 8px 0 0;
                            color: white;
                        }
                        .header img {
                            height: 60px;
                            margin-right: 10px;
                        }
                        .header h1 {
                            font-size: 20px;
                            margin-top: 15px;
                        }
                        .footer {
                            background-color: #f0eeee;
                            padding: 10px;
                            text-align: center;
                            font-size: 12px;
                            color: black;
                            border-radius: 0 0 8px 8px;
                        }
                        .content {
                            padding: 20px;
                            color: black;
                        }
                    </style>
                </head>
                <body style="color: black;">
                    <div style="color: black;" class="email-container">
                        <div class="header">
                            <img src="cid:logo" alt="InsuranceNexus Logo" title="InsuranceNexus Logo"/>
                            <h1>InsuranceNexus</h1>
                        </div>
                        <div class="content">
            """;

    private final String emailFooter = """
                </div>
                <div style="color: black;"class="footer">
                    <p>&copy; 2024 InsuranceNexus. All rights reserved.</p>
                    <p>Visit our website: <a href="www.InsuranceNexuss.com" target="_blank">InsuranceNexus</a></p>
                </div>
                </body>
                </html>
            """;

    public void sendEmail(EmailDetails emailDetails) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(emailSender);
        helper.setTo(emailDetails.getRecipient());
        helper.setSubject(emailDetails.getSubject());

        MimeMultipart multipart = new MimeMultipart("related");

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        String htmlText = emailHeader + emailDetails.getMessageBody() + emailFooter;
        messageBodyPart.setContent(htmlText, "text/html");
        multipart.addBodyPart(messageBodyPart);

        MimeBodyPart imagePart = new MimeBodyPart();
        FileSystemResource imageResource = new FileSystemResource(
                "backend/src/main/resources/logo.png");
        if (imageResource.exists()) {
            imagePart.setDataHandler(new DataHandler(new FileDataSource(imageResource.getFile())));
            imagePart.setHeader("Content-ID", "<logo>");
            multipart.addBodyPart(imagePart);
        } else {
            System.out.println("Logo file not found.");
        }

        mimeMessage.setContent(multipart);
        javaMailSender.send(mimeMessage);
    }

}