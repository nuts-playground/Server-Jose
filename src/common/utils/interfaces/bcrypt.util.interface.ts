export interface GlobalBcryptUtils {
  readonly hash: (password: string) => Promise<string>;
  readonly compare: ({
    password,
    hash,
  }: {
    password: string;
    hash: string;
  }) => Promise<boolean>;
}
