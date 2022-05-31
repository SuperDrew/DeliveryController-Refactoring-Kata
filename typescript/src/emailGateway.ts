import nodemailer from "nodemailer";
import {Delivery} from "./deliveryController";

export interface IFeedbackRequester {
    send(address: string, subject: string, message: string): Promise<any>;
    requestFeedback(delivery: Delivery, message: string): Promise<any>;
}

export class EmailGateway implements IFeedbackRequester {
    #transport: nodemailer.Transporter
    feedbackSubject = "Your feedback is important to us";

    constructor() {
        this.#transport = nodemailer.createTransport({
                host: 'localhost',
                port: 25,
                secure: false,
                logger: true
        } );

    }

    async requestFeedback(delivery: Delivery, message: string) {
        return this.#transport.sendMail({
            subject: this.feedbackSubject,
            to: delivery.contactEmail,
            text: message
        })

    }

    async send(address: string, subject: string, message: string) {
        return this.#transport.sendMail({
            subject,
            to: address,
            text: message
        })
    }
}
