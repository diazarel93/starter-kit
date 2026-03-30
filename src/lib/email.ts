import { Resend } from "resend";
import { APP_NAME, APP_URL } from "@/lib/constants";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  from = `${APP_NAME} <noreply@${new URL(APP_URL).hostname}>`,
  replyTo,
}: SendEmailOptions) {
  const { data, error } = await getResend().emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    ...(replyTo && { reply_to: replyTo }),
  });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
