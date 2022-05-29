// Base type for any function/method
type Fn = (...args: any) => any

// Obtain union of all values
type Values<T> = T[keyof T]

type Method<T> = {
    [Prop in keyof T]: T[Prop] extends Fn ? [T[Prop], Parameters<T[Prop]>] : [T[Prop], []]
  }