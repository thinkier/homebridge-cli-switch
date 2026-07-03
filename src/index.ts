import {
    AccessoryPlugin,
    API,
    HAP,
    Logging,
    Service
} from "homebridge";
import {Config} from "./config";
import {spawn} from "node:child_process";

let hap: HAP;

export = (api: API) => {
    hap = api.hap;
    api.registerAccessory("SwitchToShell", SwitchToShell);
};

class SwitchToShell implements AccessoryPlugin {
    private readonly informationService: Service;

    private readonly switchService: Service = new hap.Service.Switch();

    private state: boolean = false;

    constructor(private readonly log: Logging, private readonly config: Config, api: API) {
        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "ACME Pty Ltd");

        const chOn = this.switchService.getCharacteristic(hap.Characteristic.On);
        chOn.onGet(() => {
            return this.state;
        });
        chOn.onSet((value: boolean) => {
            this.runCommand(value);

            // Force push the current state if we do not latch here.
            if (this.config.latch) {
                this.state = value;
            } else {
                chOn.updateValue(this.state);
            }
        })
    }

    getServices(): Service[] {
        return [this.informationService, this.switchService];
    }

    runCommand(value: boolean) {
        const command = value ? this.config.onCommand : (this.config.offCommand ?? "");

        if (command === "") {
            return;
        }

        const child = spawn(this.config.shell, ["-c", command]);

        setTimeout(() => {
            if (child.exitCode === null) {
                child.kill();
            }
        }, this.config.timeout)
    }
}
