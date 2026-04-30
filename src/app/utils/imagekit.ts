import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/dvkhncfzk';
const IMAGEKIT_PUBLIC_KEY = 'public_MB9sgWHPjyAXUOdqb/Hakf571Vc=';
const AUTH_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/make-server-2402b4f2/imagekit-auth`;

export function getThumbUrl(src: string, width = 800, height = 450): string {
  if (!src || !src.includes('ik.imagekit.io')) return src;
  const base = src.split('?')[0];
  return `${base}?tr=w-${width},h-${height},fo-center,q-80`;
}

export async function uploadToImageKit(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; fileId: string }> {
  const authRes = await fetch(AUTH_ENDPOINT, {
    headers: { Authorization: `Bearer ${publicAnonKey}` },
  });
  if (!authRes.ok) throw new Error('ImageKit 인증 실패. Supabase에 IMAGEKIT_PRIVATE_KEY가 설정되었는지 확인하세요.');
  const { token, expire, signature } = await authRes.json();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', `${Date.now()}_${file.name}`);
  formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
  formData.append('signature', signature);
  formData.append('expire', String(expire));
  formData.append('token', token);
  formData.append('folder', '/portfolio');
  formData.append('useUniqueFileName', 'true');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.url, fileId: data.fileId });
      } else {
        reject(new Error(`업로드 실패: ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error('네트워크 오류'));
    xhr.send(formData);
  });
}
