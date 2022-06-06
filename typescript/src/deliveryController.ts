import {ICustomerContacter} from './customerContacter'
import {Location, MapService, IMapService} from './mapService';

const TEN_MINUTES = 1000 * 60 * 10;

export enum ContactMethod {
    Email,
    Sms
}

export interface Delivery {
    id: string
    mobileNumber: string;
    preferredContactMethod: ContactMethod
    contactEmail: string
    location: Location
    timeOfDelivery: Date
    arrived: boolean
    onTime: boolean
}

export interface DeliveryEvent {
    id: string
    timeOfDelivery: Date
    location: Location
}

export class DeliveryController {
    #contactCustomer: ICustomerContacter;
    #mapService: IMapService;
    readonly #deliveries: Array<Delivery>;

    constructor(deliveries: Array<Delivery>, contactCustomer: ICustomerContacter, mapService: IMapService = new MapService()) {
        this.#deliveries = deliveries;
        this.#mapService = mapService;
        this.#contactCustomer = contactCustomer;
    }

    public async updateDelivery(event: DeliveryEvent) {
        let nextDelivery: Delivery;

        for(let i = 0; i < this.#deliveries.length; i++){
            const delivery = this.#deliveries[i];
            if (delivery.id === event.id) {
                delivery.arrived = true;
                const timeDifference = event.timeOfDelivery.getTime() - delivery.timeOfDelivery.getTime();
                if (timeDifference < TEN_MINUTES) {
                    delivery.onTime = true;
                }
                delivery.timeOfDelivery = event.timeOfDelivery;
                const message = `Regarding your delivery today at ${delivery.timeOfDelivery}. How likely would you be to recommend this delivery service to a friend? Click <a href='url'>here</a>`
                await this.#contactCustomer.requestFeedback(delivery, message);
                if(this.#deliveries.length > i + 1) {
                    nextDelivery = this.#deliveries[i + 1];
                }

                if(!delivery.onTime && this.#deliveries.length > 1 && i > 0) {
                    const previousDelivery = this.#deliveries[i - 1];
                    const elapsedTime = delivery.timeOfDelivery.getTime() - previousDelivery.timeOfDelivery.getTime();
                    this.#mapService.updateAverageSpeed(previousDelivery.location, delivery.location, elapsedTime);
                }
            }
        }

        if (nextDelivery !== undefined) {
            const nextEta = this.#mapService.calculateETA(event.location, nextDelivery.location);
            const message = `Your delivery to ${nextDelivery.location} is next, estimated time of arrival is in ${nextEta} minutes. Be ready!`
            await this.#contactCustomer.notifyDeliveryEta(nextDelivery, message);
        }
    }
}
