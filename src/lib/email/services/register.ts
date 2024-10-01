import { transporter } from "../config.js";
import { type EmailOptions } from "../types.js";

export const sendRegisterEmail = async (
  options: EmailOptions<{ token: string }>,
) =>
  await transporter.sendMail({
    from: '"minota.es" <no-reply@minota.es>',
    to: options.to,
    subject: "Completa tu registro en minota.es",
    text: "Para completar tu registro, haz clic en el enlace que te enviamos.",
    html: `<b>Para completar tu registro, haz click <a href='https://minota.es/register/${options.data.token}'>aquí</a></b>`,
  });
