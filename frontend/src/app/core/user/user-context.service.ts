import { Injectable, signal } from "@angular/core";
/**
 * Represents the current user context.
 * In this demo, a fixed UUID is used instead of authentication.
 */

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
    readonly userId = signal('a3f1c9e4-7c8b-4b1a-9f9d-12c3e8b45a21');
}