import {CustomerContacter} from "./customerContacter";
import {ContactMethod} from "./deliveryController";
import {IEmailGateway} from "./emailGateway";
import {ISmsGateway} from "./smsGateway";
import {createDelivery} from "./testUtils";

class FakeEmailGateway implements IEmailGateway {
    public sendEmailCalls: {subject: string, to: string, text: string}[] = [];
    sendEmail(subject: string, to: string, text: string): Promise<void> {
        this.sendEmailCalls.push({subject, to, text});
        return Promise.resolve(undefined);
    }
}

class FakeSmsGateway implements ISmsGateway {
    public sendSmsCalls: {to: string, text: string}[] = [];
    sendSms(to: string, text: string): Promise<void> {
        this.sendSmsCalls.push({to, text});
        return Promise.resolve(undefined);
    }
}

describe("When the customer is contacted", () => {
    describe("and the delivery indicates email is the preferred contact method", () => {
        it("should send an email when request feedback is called", () => {
            // Arrange
            const fakeEmailGateway = new FakeEmailGateway();
            const fakeSmsGateway = new FakeSmsGateway();
            const customerContacter = new CustomerContacter(fakeEmailGateway, fakeSmsGateway);
            const expectedEmailAddress = "test@test.com";
            const delivery = createDelivery({id: "1", preferredContactMethod: ContactMethod.Email, contactEmail: expectedEmailAddress});
            const expectedMessage = "requested feedback have I";

            // Act
            customerContacter.requestFeedback(delivery, expectedMessage);

            // Assert
            expect(fakeEmailGateway.sendEmailCalls).toHaveLength(1);
            expect(fakeEmailGateway.sendEmailCalls[0].subject).toBe("Your feedback is important to us");
            expect(fakeEmailGateway.sendEmailCalls[0].to).toBe(expectedEmailAddress);
            expect(fakeEmailGateway.sendEmailCalls[0].text).toBe(expectedMessage);
        })

        it("should send an email when the eta is updated is called", () => {
            // Arrange
            const fakeEmailGateway = new FakeEmailGateway();
            const fakeSmsGateway = new FakeSmsGateway();
            const customerContacter = new CustomerContacter(fakeEmailGateway, fakeSmsGateway);
            const expectedEmailAddress = "test@test.com";
            const delivery = createDelivery({id: "1", preferredContactMethod: ContactMethod.Email, contactEmail: expectedEmailAddress});
            const expectedMessage = "notify of delivery have I";

            // Act
            customerContacter.notifyDeliveryEta(delivery, expectedMessage);

            // Assert
            expect(fakeEmailGateway.sendEmailCalls).toHaveLength(1);
            expect(fakeEmailGateway.sendEmailCalls[0].subject).toBe("Your delivery will arrive soon.");
            expect(fakeEmailGateway.sendEmailCalls[0].to).toBe(expectedEmailAddress);
            expect(fakeEmailGateway.sendEmailCalls[0].text).toBe(expectedMessage);
        })
    })

    describe("and the delivery indicates sms is the preferred contact method", () => {
        it("should send an sms when request feedback is called", () => {
            // Arrange
            const fakeEmailGateway = new FakeEmailGateway();
            const fakeSmsGateway = new FakeSmsGateway();
            const customerContacter = new CustomerContacter(fakeEmailGateway, fakeSmsGateway);
            const expectedMobileNumber ="+44799143833"
            const delivery = createDelivery({id: "1", preferredContactMethod: ContactMethod.Sms, mobileNumber: expectedMobileNumber});
            const expectedMessage = "requested feedback have I";

            // Act
            customerContacter.requestFeedback(delivery, expectedMessage);

            // Assert
            expect(fakeSmsGateway.sendSmsCalls).toHaveLength(1);
            expect(fakeSmsGateway.sendSmsCalls[0].to).toBe(expectedMobileNumber);
            expect(fakeSmsGateway.sendSmsCalls[0].text).toBe(expectedMessage);
        })

        it("should send an sms when the eta is updated", () => {
            // Arrange
            const fakeEmailGateway = new FakeEmailGateway();
            const fakeSmsGateway = new FakeSmsGateway();
            const customerContacter = new CustomerContacter(fakeEmailGateway, fakeSmsGateway);
            const expectedMobileNumber ="+44799143833"
            const delivery = createDelivery({id: "1", preferredContactMethod: ContactMethod.Sms, mobileNumber: expectedMobileNumber});
            const expectedMessage = "notify of delivery have I";

            // Act
            customerContacter.notifyDeliveryEta(delivery, expectedMessage);

            // Assert
            expect(fakeSmsGateway.sendSmsCalls).toHaveLength(1);
            expect(fakeSmsGateway.sendSmsCalls[0].to).toBe(expectedMobileNumber);
            expect(fakeSmsGateway.sendSmsCalls[0].text).toBe(expectedMessage);
        })
    })
})