declare module 'probot-actions-adapter' {
    import { ApplicationFunction } from 'probot';
    export default function (...handlers: Array<string | ApplicationFunction>): void;
}
