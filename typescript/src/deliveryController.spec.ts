import {Delivery, DeliveryController} from "./deliveryController";
import {IContactCustomer} from "./emailGateway";

const GREATER_THAN_TEN_MINUTES = 1000 * 60 * 10 + 1;

class FakeContactCustomer implements IContactCustomer {
    public sendCalls : {address:string, subject:string, message:string}[] = [];
    public requestedFeedbackCalls: {delivery: Delivery, message:string}[] = [];

    requestFeedback(delivery: Delivery, message: string): Promise<any> {
        this.requestedFeedbackCalls.push({delivery, message});
        return Promise.resolve(undefined);
    }

    send(address: string, subject: string, message: string): Promise<any> {
        this.sendCalls.push({address, subject, message});
        return Promise.resolve(undefined);
    }
}

function createDelivery(id: string, timeOfDelivery: Date = new Date()) {
    return {
        id: id,
        contactEmail: "test@test.com",
        location: {
            latitude: 12.34, longitude: 56.78
        },
        timeOfDelivery: timeOfDelivery,
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
    it("should call the feedbackRequester when a delivery has been made", async () => {
        const id = "123";
        const deliveries: Delivery[] = [createDelivery(id)];
        const fakeContactCustomer = new FakeContactCustomer();
        const deliveryController = new DeliveryController(deliveries, fakeContactCustomer);
        const deliveryEvent = {
            id: id,
            timeOfDelivery: new Date(),
            location: {longitude: 123, latitude: 432}
        };
        await deliveryController.updateDelivery(deliveryEvent);
        let expectedMessage = `Regarding your delivery today at ${deliveries[0].timeOfDelivery}. How likely would you be to recommend this delivery service to a friend? Click <a href='url'>here</a>`

        expect(fakeContactCustomer.requestedFeedbackCalls).toHaveLength(1);
        expect(fakeContactCustomer.requestedFeedbackCalls[0].delivery).toBe(deliveries[0]);
        expect(fakeContactCustomer.requestedFeedbackCalls[0].message).toBe(expectedMessage);
    })

    it("updates the delivery when it is made", async () => {
        const id = "123";
        const deliveries: Delivery[] = [createDelivery(id)];
        const fakeContactCustomer = new FakeContactCustomer();
        const deliveryController = new DeliveryController(deliveries, fakeContactCustomer);
        const deliveryEvent = {
            id: id,
            timeOfDelivery: deliveries[0].timeOfDelivery,
            location: {longitude: 123, latitude: 432}
        };
        await deliveryController.updateDelivery(deliveryEvent);

        expectDeliveryToBe(deliveries[0], true, true, deliveryEvent.timeOfDelivery);
    })

    describe("when there are two deliveries", () => {
        it("should sends an email to each delivery when it is made", async () => {
            const id = "1";
            const id2 = "2";
            const deliveries: Delivery[] = [createDelivery(id), createDelivery(id2)];
            const fakeContactCustomer = new FakeContactCustomer();
            const deliveryController = new DeliveryController(deliveries, fakeContactCustomer);
            const deliveryEvent1 = {
                id: id,
                timeOfDelivery: deliveries[0].timeOfDelivery,
                location: {longitude: 123, latitude: 432}
            };
            await deliveryController.updateDelivery(deliveryEvent1);

            expectDeliveryToBe(deliveries[0], true, true, deliveryEvent1.timeOfDelivery);
            expectDeliveryToBe(deliveries[1], false, false, deliveries[1].timeOfDelivery);

            expect(fakeContactCustomer.sendCalls).toHaveLength(1);
            expect(fakeContactCustomer.sendCalls[0].subject).toBe("Your delivery will arrive soon.");

            const deliveryEvent2 = {
                id: id2,
                timeOfDelivery: deliveries[1].timeOfDelivery,
                location: {longitude: 123, latitude: 432}
            };
            await deliveryController.updateDelivery(deliveryEvent2);

            expectDeliveryToBe(deliveries[0], true, true, deliveryEvent1.timeOfDelivery);
            expectDeliveryToBe(deliveries[1], true, true, deliveryEvent2.timeOfDelivery);
        })

        describe("and first one is late", () => {
            it("should update the eta for the second one", async () => {
                const id = "1";
                const id2 = "2";
                const deliveries: Delivery[] = [createDelivery(id), createDelivery(id2)];
                const fakeContactCustomer = new FakeContactCustomer();
                const deliveryController = new DeliveryController(deliveries, fakeContactCustomer);
                const deliveryEvent1 = {
                    id: id,
                    timeOfDelivery: new Date(deliveries[0].timeOfDelivery.getTime() + GREATER_THAN_TEN_MINUTES),
                    location: {longitude: 123, latitude: 432}
                };
                await deliveryController.updateDelivery(deliveryEvent1);

                expectDeliveryToBe(deliveries[0], true, false, deliveryEvent1.timeOfDelivery);

                const deliveryEvent2 = {
                    id: id2,
                    timeOfDelivery: new Date(deliveryEvent1.timeOfDelivery.getTime() + GREATER_THAN_TEN_MINUTES),
                    location: {longitude: 123, latitude: 432}
                };
                await deliveryController.updateDelivery(deliveryEvent2);

                expectDeliveryToBe(deliveries[1], true, false, deliveryEvent2.timeOfDelivery);

            })
        })

    })
})