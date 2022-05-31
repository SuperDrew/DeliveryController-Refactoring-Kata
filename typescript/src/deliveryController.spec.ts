import {Delivery, DeliveryController} from "./deliveryController";
import {IFeedbackRequester} from "./emailGateway";

class FakeFeedbackRequester implements IFeedbackRequester {
    public sendCalls : {address:string, subject:string, message:string}[] = [];

    send(address: string, subject: string, message: string): Promise<any> {
        this.sendCalls.push({address, subject, message});
        return Promise.resolve(undefined);
    }
}

function createDelivery(id: string) {
    return [{
        id: id,
        contactEmail: "test@test.com",
        location: {
            latitude: 12.34, longitude: 56.78
        },
        timeOfDelivery: new Date(),
        arrived: true,
        onTime: true
    }];
}

describe("WTf does the controller do", () => {
    it("should call the feedbackRequester when a delivery has been made", ()=> {
        const id = "123";
        const deliveries : Delivery[] = createDelivery(id);
        const fakeGateway = new FakeFeedbackRequester();
        const deliveryController  = new DeliveryController(deliveries, fakeGateway);
        const deliveryEvent = {id: id,
            timeOfDelivery: new Date(),
            location: {longitude: 123, latitude: 432}};
        deliveryController.updateDelivery(deliveryEvent);
        let expectedMessage = `Regarding your delivery today at ${deliveries[0].timeOfDelivery}. How likely would you be to recommend this delivery service to a friend? Click <a href='url'>here</a>`

        expect(fakeGateway.sendCalls).toHaveLength(1);
        expect(fakeGateway.sendCalls[0].address).toBe(deliveries[0].contactEmail);
        expect(fakeGateway.sendCalls[0].subject).toBe("Your feedback is important to us");
        expect(fakeGateway.sendCalls[0].message).toBe(expectedMessage);
    })

    it("updates the delivery when it is made", () => {
        const id = "123";
        const deliveries : Delivery[] = createDelivery(id);
        const fakeGateway = new FakeFeedbackRequester();
        const deliveryController  = new DeliveryController(deliveries, fakeGateway);
        const deliveryEvent = {id: id,
            timeOfDelivery: deliveries[0].timeOfDelivery,
            location: {longitude: 123, latitude: 432}};
        deliveryController.updateDelivery(deliveryEvent);

        expect(deliveries[0].arrived).toBe(true);
        expect(deliveries[0].onTime).toBe(true);
        expect(deliveries[0].timeOfDelivery).toBe(deliveries[0].timeOfDelivery);
    })
})