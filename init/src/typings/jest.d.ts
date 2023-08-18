declare namespace jest {
  interface Matchers<R> {
    toBeValidPath(): R;
    toHavePackageSection(sectionPath: string): R;
  }
}
