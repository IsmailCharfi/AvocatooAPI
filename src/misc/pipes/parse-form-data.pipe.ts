import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { deepParseJson } from 'deep-parse-json';
import * as _ from 'lodash';

type TParseFormDataJsonOptions = {
  except?: string[];
};

export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private options?: TParseFormDataJsonOptions) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const { except } = this.options;
    const serializedValue = value;
    const originProperties = {};
    if (except?.length) {
      _.merge(originProperties, _.pick(serializedValue, ...except));
    }
    console.log("testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const deserializedValue = deepParseJson(value);
    console.log(deepParseJson)
    return { ...deserializedValue, ...originProperties };
  }
}