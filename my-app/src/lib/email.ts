import { Resend} from "resend"

const resend = new Resend (process.env.RESEND_API_KEY)

interface sendEmailValues {
    to: string;
    subject: string;
    text: string;
}
export async function sendEmail({to, subject, text}: sendEmailValues) {
    await resend.emails.send({
        from: "no-reply@allergoexpressmed.com",
        to,
        subject,
        text,
    })
}