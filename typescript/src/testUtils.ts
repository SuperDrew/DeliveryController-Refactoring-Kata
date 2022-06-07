import {Location} from "./mapService";
import {ContactMethod, Delivery} from "./deliveryController";

export const GREATER_THAN_TEN_MINUTES = 1000 * 60 * 10 + 1;
export type TwoLocations = { location1: Location, location2: Location };

export function createDelivery(deliveryOverrides: Partial<Delivery>): Delivery {
    return {
        arrived: false,
        contactEmail: "test@test.com",
        id: "1",
        location: {
            latitude: 12.34, longitude: 56.78
        },
        mobileNumber: "+44768254184",
        onTime: false,
        preferredContactMethod: ContactMethod.Email,
        timeOfDelivery: new Date(1654520776559),
        ...deliveryOverrides
    }
}

export function expectDeliveryToBe(delivery: Delivery, expectedArrived: boolean, expectedOnTime: boolean, expectedTimeOfDelivery: Date) {
    expect(delivery.arrived).toBe(expectedArrived);
    expect(delivery.onTime).toBe(expectedOnTime);
    expect(delivery.timeOfDelivery).toBe(expectedTimeOfDelivery);
}