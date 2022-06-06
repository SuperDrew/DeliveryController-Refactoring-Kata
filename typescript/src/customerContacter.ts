import {ContactMethod, Delivery} from "./deliveryController";
import {IEmailGateway} from "./emailGateway";
import {ISmsGateway} from "./smsGateway";

export interface ICustomerContacter {
    notifyDeliveryEta(delivery: Delivery, message: string): Promise<any>;
    requestFeedback(delivery: Delivery, message: string): Promise<any>;
}

export class CustomerContacter implements ICustomerContacter {
    constructor(private emailGateway: IEmailGateway, private smsGateway: ISmsGateway) {}

    async requestFeedback(delivery: Delivery, message: string): Promise<any> {
        if (delivery.preferredContactMethod === ContactMethod.Email)
            return this.emailGateway.sendEmail(this.#feedbackSubject, delivery.contactEmail, message);
        else if (delivery.preferredContactMethod === ContactMethod.Sms)
            return this.smsGateway.sendSms(delivery.mobileNumber, message);
    }

    async notifyDeliveryEta(delivery: Delivery, message: string): Promise<any> {
        if (delivery.preferredContactMethod === ContactMethod.Email)
            return this.emailGateway.sendEmail(this.#notifyDeliverySubject, delivery.contactEmail, message);
        else if (delivery.preferredContactMethod === ContactMethod.Sms)
            return this.smsGateway.sendSms(delivery.mobileNumber, message);
    }
}

