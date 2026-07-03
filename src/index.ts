import {
    AccessoryPlugin,
    API,
    HAP,
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

    private readonly switchService: Service = new hap.Service.Switch();

    private readonly state: boolean = false;

    constructor(private readonly log: Logging, private readonly config: Config, api: API) {
        this.name = config.name;

        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "ACME Pty Ltd");

        this.switchService.getCharacteristic(hap.Characteristic.On);
    }

    getServices(): Service[] {
        return [this.informationService, this.switchService];
    }
}
