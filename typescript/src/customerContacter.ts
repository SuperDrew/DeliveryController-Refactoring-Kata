import {Delivery} from "./deliveryController";
import {IEmailGateway} from "./emailGateway";

export interface ICustomerContacter {
    notifyDeliveryEta(delivery: Delivery, message: string): Promise<any>;
    requestFeedback(delivery: Delivery, message: string): Promise<any>;
}

export class CustomerContacter implements ICustomerContacter {
    #feedbackSubject = "Your feedback is important to us";
    #notifyDeliverySubject = "Your delivery will arrive soon.";

    constructor(private emailGateway: IEmailGateway) {}

    async requestFeedback(delivery: Delivery, message: string): Promise<any> {
        return this.emailGateway.sendEmail(this.#feedbackSubject, delivery.contactEmail, message);
    }

    async notifyDeliveryEta(delivery: Delivery, message: string): Promise<any> {
        return this.emailGateway.sendEmail(this.#notifyDeliverySubject, delivery.contactEmail, message);
    }
}

