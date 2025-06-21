
export const BACKEND_URL = `${process.env.BACKEND_URL}/api/v1`;
export type Token = string | undefined;

export const parseJSON = async (url: string, options: any) => {
  /**
   * Cache 'no-store' signals to nextjs that we don't want to cache this
   * fetch request. We always execute this function every time it is called
   * to receive the most up-to-date data.
   */

  /**
   * Different from default behaviour: (From docs)
   * Caching stores data so it doesn't need to be re-fetched from your data source on every request.
   * By default, Next.js automatically caches the returned values of fetch in the Data Cache on the server.
   * This means that the data can be fetched at build time or request time, cached, and reused on each data request.
   */
  const response = await fetch(url, { ...options, cache: 'no-store' });
  const data = await response.json();

  if (data.error) {
    console.log('ERROR')
    console.log(data.error);
    // throw new Error(data.error);
  }

  return data;
}
