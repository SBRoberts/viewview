type SchemaPropId = string;
type SchemaPropKey = string | undefined;
type SchemaPropElement = Node;
export type SchemaPropValue =
  | string
  | number
  | boolean
  | SchemaProp
  | SchemaPropElement
  | SchemaPropValue[];
type SchemaPropUpdate = (newValue: SchemaPropValue) => void;
type SchemaPropCalc = (expression: () => string | number) => SchemaProp;
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
  calc: SchemaPropCalc;
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
