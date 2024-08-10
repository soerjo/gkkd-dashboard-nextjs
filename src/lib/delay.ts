export const doSomeDelay = async (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
