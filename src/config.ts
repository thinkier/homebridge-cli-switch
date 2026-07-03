import {AccessoryConfig} from "homebridge";

export interface Config extends AccessoryConfig {
    latch: boolean,
    onCommand: string
    offCommand?: string
}
