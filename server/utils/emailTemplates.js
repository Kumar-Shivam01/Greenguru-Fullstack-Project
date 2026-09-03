exports.EMAIL_VERIFY_TEMPLATE = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Your verification code</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f4f4f7; }
 
  @media screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .fluid-padding { padding-left: 20px !important; padding-right: 20px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7;">
 
  <!-- Preheader text (hidden, shows in inbox preview) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Your verification code is {{otpCode}} — expires in {{expiryMinutes}} minutes.
  </div>
 
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
 
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
 
          <!-- Header / Logo -->
          <tr>
            <td align="center" style="background-color:#4f46e5; padding:32px 20px;">
              <span style="font-family: Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; color:#ffffff;">
                GreenGuru
              </span>
            </td>
          </tr>
 
          <!-- Body -->
          <tr>
            <td class="fluid-padding" style="padding: 40px 40px 20px 40px; font-family: Arial, Helvetica, sans-serif;">
              <h1 style="margin:0 0 16px 0; font-size:22px; line-height:28px; color:#111827;">
                Verify your email address
              </h1>
              <p style="margin:0 0 16px 0; font-size:15px; line-height:24px; color:#4b5563;">
                Hi {{userName}},
              </p>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:24px; color:#4b5563;">
                Thanks for signing up! Use the verification code below to confirm your email address {{email}}. This code will expire in {{expiryMinutes}} minutes.
              </p>
            </td>
          </tr>
 
          <!-- OTP Code Block -->
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#f4f4f7; border:1px solid #e5e7eb; border-radius:8px; padding:20px 40px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size:36px; font-weight:bold; letter-spacing:10px; color:#111827;">
                      {{otpCode}}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Helper text -->
          <tr>
            <td class="fluid-padding" style="padding: 0 40px 32px 40px; font-family: Arial, Helvetica, sans-serif;">
              <p style="margin:0; font-size:13px; line-height:20px; color:#6b7280; text-align:center;">
                Enter this code on the verification screen to complete your sign up. Never share this code with anyone — our team will never ask you for it.
              </p>
            </td>
          </tr>
 
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0;">
            </td>
          </tr>
 
          <!-- Security note -->
          <tr>
            <td class="fluid-padding" style="padding: 24px 40px 40px 40px; font-family: Arial, Helvetica, sans-serif;">
              <p style="margin:0; font-size:13px; line-height:20px; color:#9ca3af;">
                If you didn't create an account with us, you can safely ignore this email.
              </p>
            </td>
          </tr>
 
        </table>
 
        <!-- Footer -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px;">
          <tr>
            <td align="center" style="padding: 24px 20px; font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#9ca3af;">
              © {{currentYear}} YourApp Inc. All rights reserved.<br>
              123 Main Street, City, Country
            </td>
          </tr>
        </table>
 
      </td>
    </tr>
  </table>
 
</body>
</html>
`
exports.RESET_PASSWORD_TEMPLATE =`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Your password reset code</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f4f4f7; }

  @media screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .fluid-padding { padding-left: 20px !important; padding-right: 20px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7;">

  <!-- Preheader text (hidden, shows in inbox preview) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Your password reset code is {{otpCode}} — expires in {{expiryMinutes}} hour.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 10px;">

        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="background-color:#dc2626; padding:32px 20px;">
              <span style="font-family: Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; color:#ffffff;">
                GreenGuru
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="fluid-padding" style="padding: 40px 40px 20px 40px; font-family: Arial, Helvetica, sans-serif;">
              <h1 style="margin:0 0 16px 0; font-size:22px; line-height:28px; color:#111827;">
                Reset your password
              </h1>
              <p style="margin:0 0 16px 0; font-size:15px; line-height:24px; color:#4b5563;">
                Hi {{userName}},
              </p>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:24px; color:#4b5563;">
                We received a request to reset your password for your Auth account. Use the verification code below to continue. This code will expire in {{expiryMinutes}} minutes.
              </p>
            </td>
          </tr>

          <!-- OTP Code Block -->
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:20px 40px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size:36px; font-weight:bold; letter-spacing:10px; color:#111827;">
                      {{otpCode}}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Helper text -->
          <tr>
            <td class="fluid-padding" style="padding: 0 40px 32px 40px; font-family: Arial, Helvetica, sans-serif;">
              <p style="margin:0; font-size:13px; line-height:20px; color:#6b7280; text-align:center;">
                Enter this code to set a new password. Never share this code with anyone — our team will never ask you for it. If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px;">
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0;">
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td class="fluid-padding" style="padding: 24px 40px 40px 40px; font-family: Arial, Helvetica, sans-serif;">
              <p style="margin:0; font-size:13px; line-height:20px; color:#9ca3af;">
                For your security, this code can only be used once. If you didn't request this, please secure your account by changing your password.
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px;">
          <tr>
            <td align="center" style="padding: 24px 20px; font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#9ca3af;">
              © {{currentYear}} YourApp Inc. All rights reserved.<br>
              123 Main Street, City, Country
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
