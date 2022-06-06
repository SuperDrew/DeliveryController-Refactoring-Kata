import {CustomerContacter} from "./customerContacter";
import {createDelivery} from "./deliveryController.spec";
import {ContactMethod} from "./deliveryController";
import {IEmailGateway} from "./emailGateway";


class FakeEmailGateway implements IEmailGateway {
    public sendEmailCalls: {subject: string, to: string, text: string}[] = [];
    sendEmail(subject: string, to: string, text: string): Promise<void> {
        this.sendEmailCalls.push({subject, to, text});
        return Promise.resolve(undefined);
    }
}

describe("When the customer is contacted", () => {
    describe("and the delivery indicates email is the preferred contact method", () => {
        it("should send an email when request feedback is called", () => {
            // Arrange
            const fakeEmailGateway = new FakeEmailGateway();
            const customerContacter = new CustomerContacter(fakeEmailGateway);
            const delivery = createDelivery("1");
            delivery.preferredContactMethod = ContactMethod.Email;
            const expectedEmailAddress = "test@test.com";
            delivery.contactEmail = expectedEmailAddress;
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
            const customerContacter = new CustomerContacter(fakeEmailGateway);
            const delivery = createDelivery("1");
            delivery.preferredContactMethod = ContactMethod.Email;
            const expectedEmailAddress = "test@test.com";
            delivery.contactEmail = expectedEmailAddress;
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
})