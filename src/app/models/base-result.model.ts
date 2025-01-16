export interface BaseResult {
  isSuccess: boolean;
  message?: string;
  errors?: string[];
  errorCode: number;
  responseStatusCode: number; 
}

export interface GenericBaseResult<TModel> extends BaseResult {
  result?: TModel;
}
