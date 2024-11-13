export const toUrlSafeString = (str: string) => {
  return str
    .trim() // 앞뒤 공백 제거
    .replace(/[^a-zA-Z0-9가-힣\s_-]/g, '') // 영문, 숫자, 한글, 공백을 제외한 특수 문자 제거
    .replace(/_/g, '-') // _ 를 - 로 변환 (SEO 에는 - 가 더 좋음)
    .replace(/\s+/g, '-') // 연속된 공백을 하이픈으로 변환
    .toLowerCase(); // 소문자로 변환
};

export const createRandomString = (len: number) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};
