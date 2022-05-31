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
    return {
        id: id,
        contactEmail: "test@test.com",
        location: {
            latitude: 12.34, longitude: 56.78
        },
        timeOfDelivery: new Date(),
        arrived: false,
        onTime: false
    };
}

function expectDeliveryToBe(delivery: Delivery, expectedArrived: boolean, expectedOnTime: boolean, expectedTimeOfDelivery: Date) {
    expect(delivery.arrived).toBe(expectedArrived);
    expect(delivery.onTime).toBe(expectedOnTime);
    expect(delivery.timeOfDelivery).toBe(expectedTimeOfDelivery);
}

describe("WTf does the controller do", () => {
    it("should call the feedbackRequester when a delivery has been made", ()=> {
        const id = "123";
        const deliveries : Delivery[] = [createDelivery(id)];
        const fakeFeedbackRequester = new FakeFeedbackRequester();
        const deliveryController  = new DeliveryController(deliveries, fakeFeedbackRequester);
        const deliveryEvent = {id: id,
            timeOfDelivery: new Date(),
            location: {longitude: 123, latitude: 432}};
        deliveryController.updateDelivery(deliveryEvent);
        let expectedMessage = `Regarding your delivery today at ${deliveries[0].timeOfDelivery}. How likely would you be to recommend this delivery service to a friend? Click <a href='url'>here</a>`

        expect(fakeFeedbackRequester.sendCalls).toHaveLength(1);
        expect(fakeFeedbackRequester.sendCalls[0].address).toBe(deliveries[0].contactEmail);
        expect(fakeFeedbackRequester.sendCalls[0].subject).toBe("Your feedback is important to us");
        expect(fakeFeedbackRequester.sendCalls[0].message).toBe(expectedMessage);
    })

    it("updates the delivery when it is made", () => {
        const id = "123";
        const deliveries : Delivery[] = [createDelivery(id)];
        const fakeGateway = new FakeFeedbackRequester();
        const deliveryController  = new DeliveryController(deliveries, fakeGateway);
        const deliveryEvent = {id: id,
            timeOfDelivery: deliveries[0].timeOfDelivery,
            location: {longitude: 123, latitude: 432}};
        deliveryController.updateDelivery(deliveryEvent);

        expectDeliveryToBe(deliveries[0], true, true, deliveryEvent.timeOfDelivery);
    })

    describe("when there are two deliveries", () => {
        it("should sends an email to each delivery when it is made", () => {
            const id = "1";
            const id2 = "2";
            const deliveries : Delivery[] = [createDelivery(id), createDelivery(id2)];
            const fakeFeedbackRequester = new FakeFeedbackRequester();
            const deliveryController  = new DeliveryController(deliveries, fakeFeedbackRequester);
            const deliveryEvent1 = {id: id,
                timeOfDelivery: deliveries[0].timeOfDelivery,
                location: {longitude: 123, latitude: 432}};
            deliveryController.updateDelivery(deliveryEvent1);

            expectDeliveryToBe(deliveries[0], true, true, deliveryEvent1.timeOfDelivery);
            expectDeliveryToBe(deliveries[1], false, false, deliveries[1].timeOfDelivery);

            expect(fakeFeedbackRequester.sendCalls).toHaveLength(2);
            expect(fakeFeedbackRequester.sendCalls[1].subject).toBe("Your delivery will arrive soon.");

            const deliveryEvent2 = {id: id2,
                timeOfDelivery: deliveries[1].timeOfDelivery,
                location: {longitude: 123, latitude: 432}};
            deliveryController.updateDelivery(deliveryEvent2);

            expectDeliveryToBe(deliveries[0], true, true, deliveryEvent1.timeOfDelivery);
            expectDeliveryToBe(deliveries[1], true, true, deliveryEvent2.timeOfDelivery);
        })

    })
})