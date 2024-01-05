const PasswordStrength = {
  VERY_STRONG: '매우 강함',
  STRONG: '강함',
  MEDIUM: '보통',
  WEAK: '약함',
  VERY_WEAK: '매우 약함',
} as const;
export type PasswordStrength =
  (typeof PasswordStrength)[keyof typeof PasswordStrength];
