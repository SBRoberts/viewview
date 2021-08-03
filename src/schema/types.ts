type SchemaPropId = string;
type SchemaPropKey = string | undefined;
type SchemaPropElement = Node;
export type SchemaPropValue= 
  | string
  | number
  | boolean
  | SchemaProp
  | SchemaPropElement
  | SchemaPropValue[];
  export type SPV<TValue> =
    TValue extends string ? TValue :
    TValue extends number ? TValue :
    TValue extends boolean ? TValue :
    TValue extends SchemaProp? TValue :
    TValue extends SchemaPropElement ? TValue :
    TValue extends SchemaPropValue[] ? TValue :
    never
type SchemaPropUpdate = (newValue: SchemaPropValue) => void;
type SchemaPropCompute = (expression: SchemaPropExpression) => SchemaProp;
export type SchemaPropNotify = (newValue: SchemaPropValue) => void;
export type SchemaPropExpression = (value: SchemaPropValue) => SchemaPropValue;
export type SchemaPropObserve = (
  callback: SchemaPropNotify,
  context: ThisParameterType<SchemaProp>
) => void;

export interface SchemaProp {
  id: SchemaPropId;
  key: SchemaPropKey;
  value: SchemaPropValue;
  update: SchemaPropUpdate;
  compute: SchemaPropCompute;
  observe: SchemaPropObserve;
  observers?: SchemaPropNotify[];
  expression: SchemaPropExpression;
}
export interface SP<TVal> {
  id: SchemaPropId;
  key: SchemaPropKey;
  value: TVal;
  update: SchemaPropUpdate;
  compute: SchemaPropCompute;
  observe: SchemaPropObserve;
  observers?: SchemaPropNotify[];
  expression: SchemaPropExpression;
}

interface SchemaMethods {
  defineProperty: (
    this: Schema,
    value: SchemaPropValue,
    key?: string
  ) => SchemaProp;
  getPropertyByKey: (this: Schema, key: string) => SchemaProp | undefined;
  getPropertyByValue: (
    this: Schema,
    value: SchemaPropValue
  ) => SchemaProp | undefined;
  getPropertyById: (this: Schema, id: string) => SchemaProp | undefined;
  hasProperty: (this: Schema, key: string) => boolean;
  hasId: (this: Schema, id: string) => boolean;
}
export interface Schema extends SchemaMethods {
  ids: string[];
  props: SchemaProp[];
}
