import http from '@/utils/request';
import contentType from './contentType';
declare const wx: any;
function getUploadUrl(data: any) {
  return http.get(`/system/file-management/sign-upload-url-suffix-size`, data);
}
function showToast(title: string) {
  uni.showToast({ title, icon: 'none', duration: 2000 });
}
export default function useUpload(type: string) {
  async function upload(arrayBuffer: any, suffix: string) {
    const size = Number(((arrayBuffer.byteLength || 0) / 1024 / 1024).toFixed(3)); //单位M

    const urlRes = await getUploadUrl({ suffix, type, size });
    if (!urlRes?.data) return Promise.reject('上传失败');
    return new Promise((resolve, reject) => {
      uni.request({
        method: 'PUT',
        header: { 'Content-Type': contentType[suffix as keyof typeof contentType] },
        url: urlRes.data.signUploadUrl,
        data: arrayBuffer,
        success() {
          const { filePath, fileName, type } = urlRes?.data as any;
          resolve({ fileName, filePath, fileType: type });
        },

        fail(e) {
          reject(e);
          showToast('上传失败');
        },
      });
    });
  }

  function beforeUpload(file: any, accept: string[], maxSize = 15) {
    let bool = true;
    let suffix = file.name.split('.').pop();
    const size = Number(((file.size || 0) / 1024 / 1024).toFixed(3)); //单位M
    if (size > maxSize) {
      showToast(`上传文件不能大于${maxSize}M`);
      bool = false;
    } else {
      bool = accept.includes(suffix);
      if (!bool) {
        showToast(`上传文件格式只能是${accept.join(',')}格式`);
      }
    }
    return bool;
  }

  function imageUpload(tempFilePath: string) {
    const arrayBuffer = uni.getFileSystemManager().readFileSync(tempFilePath);
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: tempFilePath,
        success(file: any) {
          upload(arrayBuffer, file.type)
            .then((res: any) => {
              resolve({
                ...res,
                url: tempFilePath,
              });
              showToast('上传成功');
            })
            .finally(() => uni.hideLoading());
        },
        fail(e) {
          reject(e);
          showToast('上传失败');
          uni.hideLoading();
        },
      });
    });
  }

  function mediaUpload(params: {
    count?: number;
    sizeType?: ('original' | 'compressed')[];
    sourceType?: ('album' | 'camera')[];
    mediaTyp?: ('image' | 'video')[];
  }) {
    return new Promise((resolve, reject) => {
      uni.chooseMedia({
        ...params,
        count: params?.count || 1,
        success({ tempFiles }) {
          tempFiles.forEach(({ tempFilePath, fileType }) => {
            if (fileType === 'image') {
              imageUpload(tempFilePath).then(resolve).catch(reject);
            }
          });
        },
        fail() {
          uni.hideLoading();
        },
      });
    });
  }

  function fileUpload(params?: { count?: number; extension?: string[] }) {
    uni.showLoading({
      title: '上传中..',
      mask: true,
    });
    return new Promise((resolve) => {
      wx.chooseMessageFile({
        type: 'file',
        count: params?.count || 1,
        ...params,
        success({ tempFiles }: any) {
          tempFiles.forEach((item: any) => {
            const arrayBuffer = uni.getFileSystemManager().readFileSync(item.path);
            const suffix = item.name.split('.').pop();
            upload(arrayBuffer, suffix)
              .then((res: any) => {
                resolve({
                  ...res,
                  url: item.path,
                });
                showToast('上传成功');
              })
              .finally(() => uni.hideLoading());
          });
        },
        fail() {
          uni.hideLoading();
        },
      });
    });
  }

  return {
    beforeUpload,
    upload,
    mediaUpload,
    imageUpload,
    fileUpload,
  };
}
