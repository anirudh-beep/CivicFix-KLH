/**
 * CivicFix Notifications
 */

export interface CivicNotification {
  id: number;
  title: string;
  message: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}
