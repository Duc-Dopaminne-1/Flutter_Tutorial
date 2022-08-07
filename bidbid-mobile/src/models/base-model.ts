interface BaseModelAction {
  toJSON?: () => string;
}

export abstract class BaseModel implements BaseModelAction {
  id?: string | number;
  createdAt?: string;
  updatedAt?: string;
  toJSON?: () => string;
}
