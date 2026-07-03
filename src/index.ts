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

    private value: boolean = false;

    constructor(private readonly log: Logging, private readonly config: Config, api: API) {
        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "ACME Pty Ltd");

        const chOn = this.switchService.getCharacteristic(hap.Characteristic.On);
        chOn.onGet(() => {
            return this.value;
        });
        chOn.onSet((value: boolean) => {
            this.value = value;
            this.runCommand(value);

            // Force push the off state if we do not latch here.
            if (!this.config.latch) {
                setImmediate(() => {
                    chOn.updateValue(false);
                });
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
