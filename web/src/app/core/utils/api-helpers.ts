type Params = Record<string, any>;

export function createApiUrlGenerator(baseUrl?: string) {
  const generateUrl = (path: string | [string, ...string[]], params?: Params): string => {
    const joinedPath = Array.isArray(path) ? path.join('/') : path;
    const normalizedPath = joinedPath.replace(/^\/*/, '');

    const fullPath = baseUrl
      ? `${baseUrl.replace(/^\/*/, '')}${normalizedPath ? '/' + normalizedPath : ''}`
      : normalizedPath;

    const url = new URL(fullPath);

    if (params && Object.keys(params).length > 0) {
      const search = buildSearchParams(params);
      if (url.search) {
        url.search += '&' + search;
      } else {
        url.search = search;
      }
    }

    return url.toString();
  };

  return {
    generateUrl,
  };
}

export function buildSearchParams(params: Record<string, any>, prefix = ''): string {
  const searchParams = new URLSearchParams();

  function appendParam(key: string, value: any) {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => appendParam(key, v));
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      for (const k in value) {
        if (value.hasOwnProperty(k)) {
          appendParam(`${key}[${k}]`, value[k]);
        }
      }
    } else {
      searchParams.append(key, value.toString());
    }
  }

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      appendParam(fullKey, params[key]);
    }
  }

  return searchParams.toString();
}
