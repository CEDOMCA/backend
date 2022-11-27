/**
 * Swagger plugin to make the filtering by tag case insensitive, while this
 * feature is not added to the core of `swagger-ui`.
 * (C) {@link https://github.com/swagger-api/swagger-ui/issues/3876#issuecomment-412476501}
 */
export const CaseInsensitiveFilterPlugin = (): any => ({
  fn: {
    opsFilter: (taggedOps: any, phrase: any): any =>
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      taggedOps.filter((_: unknown, tag: string) =>
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
        tag.toLowerCase().includes(phrase.toLowerCase()),
      ),
  },
});
