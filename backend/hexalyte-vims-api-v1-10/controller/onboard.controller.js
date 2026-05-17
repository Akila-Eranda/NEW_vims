const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const onboardServices = require('../service/onboard.service')
const { sendEmail } = require('../service/email.service')

const newUser = catchAsync(async (req, res) => {

    const encodedUser = req.params.user

    if (encodedUser) {
        try {
            const decodedUser = Buffer.from(encodedUser, 'base64').toString('utf-8')
            const user = JSON.parse(decodedUser)

            const { firstname, lastname, username, email, password, gender, active, deleted, birthday, role } = user

            if (!firstname || !lastname || !username || !email || !password || !gender || !active || !role) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    message: "Invalid user object. Required fields missing"
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    message: "Invalid Email"
                })
            }

            const createNewUser = await onboardServices.newUser(user)

            if (createNewUser) {

                const content = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <title>Welcome to Hexa VIMS</title>
                    <!--[if mso]>
                    <noscript>
                        <xml>
                            <o:OfficeDocumentSettings>
                                <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                        </xml>
                    </noscript>
                    <![endif]-->
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6;">
                    <!-- Main Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
                        <tr>
                            <td align="center" style="padding: 20px 10px;">
                                <!-- Email Content Container -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                    
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">
                                                Welcome to Hexa VIMS!
                                            </h1>
                                        </td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td style="padding: 30px 20px;">
                                            
                                            <!-- Greeting -->
                                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">
                                                Dear <strong> ${createNewUser.firstname} ${createNewUser.lastname} </strong>,
                                            </p>

                                            <!-- Welcome Message -->
                                            <p style="margin: 0 0 25px 0; font-size: 16px; color: #333333;">
                                                Your account has been successfully created and is now ready to use.
                                            </p>

                                            <!-- Account Details Section -->
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 25px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #495057; font-weight: bold;">
                                                            Account Details
                                                        </h2>
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 8px 0; font-size: 14px; color: #6c757d; width: 80px;">
                                                                    <strong>Email:</strong>
                                                                </td>
                                                                <td style="padding: 8px 0; font-size: 14px; color: #333333; word-break: break-all;">
                                                                    ${createNewUser.email}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">
                                                                    <strong>Password:</strong>
                                                                </td>
                                                                <td style="padding: 8px 0; font-size: 14px; color: #333333; font-family: 'Courier New', monospace; background-color: #ffffff; padding-left: 10px; border-radius: 3px;">
                                                                    ${password}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Getting Started Section -->
                                            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #495057; font-weight: bold;">
                                                Getting Started
                                            </h2>
                                            
                                            <ol style="margin: 0 0 25px 0; padding-left: 20px; color: #333333; font-size: 14px;">
                                                <li style="margin-bottom: 8px;">
                                                    Visit our login page at 
                                                    <a href="https://vims.hexalyte.com/auth/login" style="color: #667eea; text-decoration: none; font-weight: 500;">
                                                        https://vims.hexalyte.com/auth/login
                                                    </a>
                                                </li>
                                                <li style="margin-bottom: 8px;">Enter your email and password above</li>
                                                <li style="margin-bottom: 8px;">We strongly recommend changing your password after your first login</li>
                                            </ol>

                                            <!-- Login Button -->
                                            <div style="text-align: center; margin: 25px 0;">
                                                <a href="https://vims.hexalyte.com/auth/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                                                    Access Your Account
                                                </a>
                                            </div>

                                            <!-- Security Reminders -->
                                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin: 25px 0;">
                                                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #856404; font-weight: bold;">
                                                    🔒 Important Security Reminders
                                                </h3>
                                                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
                                                    <li style="margin-bottom: 5px;">Keep your login credentials confidential</li>
                                                    <li style="margin-bottom: 5px;">Use a strong, unique password for your account</li>
                                                    <li style="margin-bottom: 5px;">Enable two-factor authentication if available</li>
                                                    <li style="margin-bottom: 5px;">Never share your password with anyone</li>
                                                </ul>
                                            </div>

                                            <!-- Need Help Section -->
                                            <h3 style="margin: 25px 0 10px 0; font-size: 16px; color: #495057; font-weight: bold;">
                                                Need Help?
                                            </h3>
                                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #333333;">
                                                If you have any questions or need assistance accessing your account, please don't hesitate to contact our support team.
                                            </p>

                                            <!-- Security Notice -->
                                            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px; padding: 15px; margin: 20px 0;">
                                                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #721c24; font-weight: bold;">
                                                    ⚠️ Security Notice
                                                </h4>
                                                <p style="margin: 0; font-size: 13px; color: #721c24;">
                                                    This email contains sensitive login information. Please delete this email after securely noting your credentials. If you did not request this account, please contact us immediately.
                                                </p>
                                            </div>

                                            <!-- Closing -->
                                            <p style="margin: 25px 0 0 0; font-size: 16px; color: #333333;">
                                                Best regards,<br>
                                                <strong>The Hexa VIMS Team</strong>
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #6c757d;">
                                                This is an automated message. Please do not reply to this email.
                                            </p>
                                            <p style="margin: 0; font-size: 12px; color: #6c757d;">
                                                For support, contact: 
                                                <a href="mailto:support.vims@hexalyte.com" style="color: #667eea; text-decoration: none;">
                                                    support.vims@hexalyte.com
                                                </a>
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>

                    <!-- Mobile Responsive Styles -->
                    <style>
                        @media only screen and (max-width: 600px) {
                            .container {
                                width: 100% !important;
                                max-width: 100% !important;
                            }
                            
                            .content {
                                padding: 20px 15px !important;
                            }
                            
                            .header {
                                padding: 25px 15px !important;
                            }
                            
                            .button {
                                padding: 10px 20px !important;
                                font-size: 14px !important;
                            }
                            
                            h1 {
                                font-size: 24px !important;
                            }
                            
                            h2 {
                                font-size: 16px !important;
                            }
                            
                            .account-details {
                                padding: 15px !important;
                            }
                        }
                    </style>
                </body>
                </html>
                `

                sendEmail(createNewUser.email, "HEXA VIMS | Login Credentials", "", content)
                return res.status(httpStatus.OK).send({ createNewUser })
            } else {
                return res.status(httpStatus.CONFLICT).send({ message: "User already exists" })
            }

        } catch (error) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid base64 encoded parameters or JSON format" })
        }
    } else {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Empty User Info" })
    }
})

module.exports = { newUser }