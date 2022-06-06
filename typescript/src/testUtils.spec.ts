import {createDelivery} from "./testUtils";
import {ContactMethod} from "./deliveryController";

describe('When creating deliveries with overrides', () => {
    it("should have default values if no overrides are used", () => {
        const delivery = createDelivery({});
        expect(delivery.arrived).toBe(false);
        expect(delivery.contactEmail).toBe("test@test.com");
        expect(delivery.id).toBe("1");
        expect(delivery.location).toStrictEqual({ latitude: 12.34, longitude: 56.78 });
        expect(delivery.mobileNumber).toBe("+44768254184");
        expect(delivery.onTime).toBe(false);
        expect(delivery.preferredContactMethod).toBe(ContactMethod.Email);
        expect(delivery.timeOfDelivery.getTime()).toBe(1654520776559);
    })
    it("should have overriden values if overrides are used", () => {
        const timeOfDelivery = new Date();
        const delivery = createDelivery({arrived: true, contactEmail: "foo@foo.com", id: "2", location: {latitude: 1, longitude: 2}, mobileNumber: "+44000000000", onTime: true, preferredContactMethod: ContactMethod.Sms, timeOfDelivery});
        expect(delivery.arrived).toBe(true);
        expect(delivery.contactEmail).toBe("foo@foo.com");
        expect(delivery.id).toBe("2");
        expect(delivery.location).toStrictEqual({ latitude: 1, longitude: 2});
        expect(delivery.mobileNumber).toBe("+44000000000");
        expect(delivery.onTime).toBe(true);
        expect(delivery.preferredContactMethod).toBe(ContactMethod.Sms);
        expect(delivery.timeOfDelivery.getTime()).toBe(timeOfDelivery.getTime());
    })
});
