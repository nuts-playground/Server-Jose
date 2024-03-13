export interface EmailUtil {
  send: (params: {
    email: string;
    subject: string;
    contents: string;
  }) => Promise<void>;
}
