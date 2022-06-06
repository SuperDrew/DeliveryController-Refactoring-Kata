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
        const feedbackSubject = "Your feedback is important to us";
        if (delivery.preferredContactMethod === ContactMethod.Email)
            return this.emailGateway.sendEmail(feedbackSubject, delivery.contactEmail, message);
        else if (delivery.preferredContactMethod === ContactMethod.Sms)
            return this.smsGateway.sendSms(delivery.mobileNumber, message);
    }

    async notifyDeliveryEta(delivery: Delivery, message: string): Promise<any> {
        const notifyDeliverySubject = "Your delivery will arrive soon.";
        if (delivery.preferredContactMethod === ContactMethod.Email)
            return this.emailGateway.sendEmail(notifyDeliverySubject, delivery.contactEmail, message);
        else if (delivery.preferredContactMethod === ContactMethod.Sms)
            return this.smsGateway.sendSms(delivery.mobileNumber, message);
    }
}

