import nodemailer from "nodemailer";

export interface IEmailGateway {
    sendEmail(subject: string, to: string, text: string): Promise<any>;
}

export class EmailGateway implements IEmailGateway {
    #transport: nodemailer.Transporter

    constructor(env?: string) {
        if (env === "test") {
            this.#transport = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'randy.crona5@ethereal.email',
                    pass: 'hAPzxnzhYpG5e2uW56'
                }
            });
        }
        else {
            this.#transport = nodemailer.createTransport({
                host: 'localhost',
                port: 25,
                secure: false,
                logger: true
            });
        }
    }

    async sendEmail(subject: string, to: string, text: string) {
        return this.#transport.sendMail({
            subject: subject,
            to: to,
            text: text
        })
    };
}