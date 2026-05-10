/**
 * Chat Service
 * Handles chat-specific CRS preview operations
 * Single Responsibility: Chat session CRS preview/status
 *
 * Note: For full CRS operations (create, update, export), use services/crs.service.ts
 */

export type { CRSPreviewOut } from "./crs.service";
export { getPreviewCRS } from "./crs.service";
