import nodemailer from "nodemailer";
import {Delivery} from "./deliveryController";

export interface IContactCustomer {
    notifyDeliveryEta(delivery: Delivery, message: string): Promise<any>;
    requestFeedback(delivery: Delivery, message: string): Promise<any>;
}

export class EmailGateway implements IContactCustomer {
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

    async notifyDeliveryEta(delivery: Delivery, message: string): Promise<any> {
        return this.#transport.sendMail({
            subject: "Your delivery will arrive soon.",
            to: delivery.contactEmail,
            text: message
        })
    }
}
