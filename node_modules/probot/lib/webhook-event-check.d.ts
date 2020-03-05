import { Application } from './application';
/**
 * Check if an application is subscribed to an event.
 *
 * @returns Returns `false` if the app is not subscribed to an event. Otherwise,
 * returns `true`. Returns `undefined` if the webhook-event-check feature is
 * disabled or if Probot failed to retrieve the GitHub App's metadata.
 */
declare function webhookEventCheck(app: Application, eventName: string): Promise<boolean | undefined>;
export default webhookEventCheck;
/**
 * A helper function used in testing that resets the cached result of /app.
 */
export declare function clearCache(): void;
