import { computed, unref } from 'vue';

export function checkPictureType(file: File, accepts: string[]) {
  let reg;
  if (!accepts || accepts.length === 0) {
    reg = /.(?:jpg|jpeg|png|gif)$/i;
  } else {
    const newTypes = accepts.join('|');
    reg = new RegExp(`\\.(${newTypes})$`, 'i');
  }
  return reg.test(file.name);
}
export function checkFileType(file: File, accepts: string[]) {
  let reg;
  if (!accepts || accepts.length === 0) {
    reg = /.(?:jpg|jpeg|png|gif|doc|docx|pdf|excel|xlsx|ppt|pptx|mp4)$/i;
  } else {
    const newTypes = accepts.join('|');
    reg = new RegExp(`\\.(${newTypes})$`, 'i');
  }
  return reg.test(file.name);
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(?:jpg|jpeg|png|gif|doc|docx|pdf|excel|xlsx|ppt|pptx)$/i.test(name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    file: File;
    result: string;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve({ file, result: reader.result as string }));
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    reader.onerror = (error) => reject(error);
  });
}

export function useUploadType({ acceptRef, helpTextRef, maxNumberRef, maxSizeRef }: any) {
  // 文件类型限制
  const getAccept = computed(() => {
    const accept = unref(acceptRef);
    if (accept && accept.length > 0) {
      return accept;
    }
    return [];
  });
  const getStringAccept = computed(() => {
    return unref(getAccept)
      .map((item: any) => {
        return item.indexOf('/') > 0 || item.startsWith('.') ? item : `.${item}`;
      })
      .join(',');
  });

  // 支持jpg、jpeg、png格式，不超过2M，最多可选择10张图片，。
  const getHelpText = computed(() => {
    const helpText = unref(helpTextRef);
    if (helpText) {
      return helpText;
    }
    const helpTexts: string[] = [];

    const accept = unref(acceptRef);
    if (accept.length > 0) {
      // helpTexts.push(t('component.upload.accept', [accept.join(',')]));
    }

    const maxSize = unref(maxSizeRef);
    if (maxSize) {
      // helpTexts.push(t('component.upload.maxSize', [maxSize]));
    }

    const maxNumber = unref(maxNumberRef);
    if (maxNumber && maxNumber !== Infinity) {
      // helpTexts.push(t('component.upload.maxNumber', [maxNumber]));
    }
    return helpTexts.join('，');
  });

  return { getAccept, getHelpText, getStringAccept };
}
