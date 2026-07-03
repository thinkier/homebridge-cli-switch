import {
    AccessoryPlugin,
    API,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    HAP,
    HAPStatus,
    Logging,
    Service
} from "homebridge";
import {Config} from "./config";

let hap: HAP;

export = (api: API) => {
    hap = api.hap;
    api.registerAccessory("SwitchToShell", SwitchToShell);
};

class SwitchToShell implements AccessoryPlugin {
    private readonly name: string;
    private readonly informationService: Service;

    private readonly switchService: Service;

    constructor(private readonly log: Logging, private readonly config: Config, api: API) {
        this.name = config.name;

        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "ACME Pty Ltd");
    }
}
