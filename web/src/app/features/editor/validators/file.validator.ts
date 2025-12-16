import { ValidatorFn } from '@angular/forms';

export function fileStartsWith(startsWith: string): ValidatorFn {
  return (control) => {
    const file = control.value;
    if (!file) {
      return null;
    }
    if (file instanceof File && !file.type.startsWith(startsWith)) {
      return {
        startsWith: true,
      };
    }
    return null;
  };
}

/**
 *
 * @param size - bytes
 */
export function maxFileSize(size: number): ValidatorFn {
  return (control) => {
    const file = control.value;
    if (!file) {
      return null;
    }
    if (file instanceof File && file.size > size) {
      return {
        maxFileSize: {
          actualSize: file.size,
          maxSize: size,
        },
      };
    }
    return null;
  };
}
