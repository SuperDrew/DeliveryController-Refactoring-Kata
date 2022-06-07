import {Location} from "./mapService";
import {ContactMethod, Delivery} from "./deliveryController";

export const GREATER_THAN_TEN_MINUTES = 1000 * 60 * 10 + 1;
export type TwoLocations = { location1: Location, location2: Location };

export function createDelivery(deliveryOverrides: Partial<Delivery>): Delivery {
    return {
        arrived: deliveryOverrides.arrived ?? false,
        contactEmail: deliveryOverrides.contactEmail ?? "test@test.com",
        id: deliveryOverrides.id ?? "1",
        location: deliveryOverrides.location ?? {
            latitude: 12.34, longitude: 56.78
        },
        mobileNumber: deliveryOverrides.mobileNumber ?? "+44768254184",
        onTime: deliveryOverrides.onTime ?? false,
        preferredContactMethod: deliveryOverrides.preferredContactMethod ?? ContactMethod.Email,
        timeOfDelivery: deliveryOverrides.timeOfDelivery ?? new Date(1654520776559)
    }
}

export function expectDeliveryToBe(delivery: Delivery, expectedArrived: boolean, expectedOnTime: boolean, expectedTimeOfDelivery: Date) {
    expect(delivery.arrived).toBe(expectedArrived);
    expect(delivery.onTime).toBe(expectedOnTime);
    expect(delivery.timeOfDelivery).toBe(expectedTimeOfDelivery);
}