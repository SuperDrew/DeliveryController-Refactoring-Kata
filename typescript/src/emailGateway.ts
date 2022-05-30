import nodemailer from "nodemailer";
import {Delivery} from "./deliveryController";


export interface IFeedbackRequester {
    send(address: string, subject: string, message: string): Promise<any>;
}

export class EmailGateway implements IFeedbackRequester {

    #transport: nodemailer.Transporter

    constructor() {
        this.#transport = nodemailer.createTransport({
                host: 'localhost',
                port: 25,
                secure: false,
                logger: true
        } );

    }

    async send(address: string, subject: string, message: string) {
        return this.#transport.sendMail({
            subject,
            to: address,
            text: message
        })
    }
}
