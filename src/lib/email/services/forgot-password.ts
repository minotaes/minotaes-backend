import { transporter } from "../config.js";
import { type EmailOptions } from "../types.js";

export const sendForgotPasswordEmail = async (
  options: EmailOptions<{ token: string }>,
) =>
  await transporter.sendMail({
    from: '"minota.es" <no-reply@minota.es>',
    to: options.to,
    subject: "Restablece tu contraseña en minota.es",
    text: "Para restablecer tu contraseña, haz clic en el enlace que te enviamos.",
    html: `<b>Para restablecer tu contraseña, haz click <a href='https://minota.es/reset-password/${options.data.token}'>aquí</a></b>`,
  });
