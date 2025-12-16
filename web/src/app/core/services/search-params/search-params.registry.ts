import { stringCodec } from '../../utils/codecs';
import { SearchParamsConfig } from './search-params.config';

export const SEARCH_PARAMS_REGISTRY: Record<string, SearchParamsConfig<any>> = {
  editor: {
    codecs: {
      step: stringCodec,
    },
  },
};
