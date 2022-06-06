import {ContactMethod, Delivery} from "./deliveryController";
import {EmailGateway, IEmailGateway} from "./emailGateway";
import {ISmsGateway, SmsGateway} from "./smsGateway";

export interface ICustomerContacter {
    notifyDeliveryEta(delivery: Delivery, message: string): Promise<any>;
    requestFeedback(delivery: Delivery, message: string): Promise<any>;
}

export class CustomerContacter implements ICustomerContacter {
    #feedbackSubject = "Your feedback is important to us";
    #notifyDeliverySubject = "Your delivery will arrive soon.";

    constructor(private emailGateway: IEmailGateway = new EmailGateway(), private smsGateway: ISmsGateway = new SmsGateway()) {}

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

