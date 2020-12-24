type SchemaPropId = string;
type SchemaPropKey = string | undefined;
type SchemaPropElement = DocumentFragment | Element;
type SchemaPropValue =
  | string
  | number
  | SchemaPropElement
  | Array<SchemaPropElement>;
type SchemaPropUpdate = (newValue: string | number) => void;
type SchemaPropCalc = (expression: () => string | number) => SchemaProp;
type SchemaPropNotify = (newValue) => void;

export interface SchemaProp {
  id: SchemaPropId;
  key: SchemaPropKey;
  value: SchemaPropValue;
  update: SchemaPropUpdate;
  calc: SchemaPropCalc;
  observers?: SchemaPropNotify[];
  dependants?: SchemaProp[];
}

interface SchemaMethods {
  defineProperty: (
    value: string | number | undefined,
    key: string | undefined
  ) => string | number;
  getPropertyByKey: (key: string) => SchemaProp | undefined;
  getPropertyByValue: (value: string | number) => SchemaProp | undefined;
  getPropertyById: (id: string) => SchemaProp | undefined;
  hasProperty: (key: string) => boolean;
  hasId: (id: string) => boolean;
}
export interface Schema extends SchemaMethods {
  ids: string[];
  props: SchemaProp[];
}
