import {AccessoryConfig} from "homebridge";

export interface Config extends AccessoryConfig {
    latch: boolean
    timeout: number
    shell: string
    onCommand: string
    offCommand?: string
}
