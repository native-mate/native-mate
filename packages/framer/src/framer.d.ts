declare module 'framer' {
  export function addPropertyControls(component: React.ComponentType<any>, controls: Record<string, any>): void
  export const ControlType: {
    String: 'string'
    Number: 'number'
    Boolean: 'boolean'
    Enum: 'enum'
    Color: 'color'
    File: 'file'
    Image: 'image'
    EventHandler: 'eventhandler'
    ComponentInstance: 'componentinstance'
    Array: 'array'
    Object: 'object'
    FusedNumber: 'fusednumber'
    Transition: 'transition'
  }
}
