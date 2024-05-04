export default function Default() {
  return null;
}

/**
 * How this works is that by returning null, this means that the @modal
 * slot in the community laoyout.ts file will not display anything by default
 * IF we don't navigate to any of the routes inslude the @modal slot like /create.
 */