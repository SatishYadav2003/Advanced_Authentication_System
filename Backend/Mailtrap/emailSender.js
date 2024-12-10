import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrap_client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [
        {
            email: email,
        },
    ];

    try {
        const response = await mailtrap_client.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: "Email verification",
        });

        console.log("Verification Email sent successfully: ", response);
    } catch (error) {
        console.error("Error in sending email: ", error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [
        {
            email: email,
        },
    ];


    try {

        const response = await mailtrap_client
            .send({
                from: sender,
                to: recipient,
                template_uuid: "9e236291-cc30-4a2b-a195-3d33409d13f0",
                template_variables: {
                    "name": `${name}`
                }
            })

        console.log("Greeting mail successfully sent: ", response)

    }
    catch (error) {
        console.log("Some Error Occured in Sending Greeting Mail: ", error);
    }

}


export const sendPasswordResetEmail = async (email, resetURI) => {
    const recipient = [
        {
            email: email,
        },
    ];

    try {
        const response = await mailtrap_client.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURI),
            category: "Password Reset"
        });

        console.log("Reset Email sent successfully: ", response)
    } catch (error) {
        console.log("Reset Email sent error: ", error);
    }

}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [
        {
            email: email,
        },
    ];

    try {
        const response = await mailtrap_client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        });

        console.log("Email for Password Reset Successfully is sent: ", response);
    } catch (error) {
        console.log("Email for Success Password Reset is not Sent: ", error)
    }


}