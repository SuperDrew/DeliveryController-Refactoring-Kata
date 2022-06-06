export interface ISmsGateway {
    sendSms(to: string, text: string): Promise<void>;
}

export class SmsGateway implements ISmsGateway {
    sendSms(to: string, text: string): Promise<void> {
        throw new Error("Method not implemented yet!");
    }
}