export enum FunnelEvent {
  QuizStarted = 'quiz_started',
  EmailSubmitted = 'email_submitted',
  PaywallVisited = 'paywall_visited',
  PurchaseClicked = 'purchase_clicked',
}

export const DIRECT_SOURCE = 'direct';

export const EVENT_LABELS: Record<string, string> = {
  [FunnelEvent.QuizStarted]: 'Quiz started',
  [FunnelEvent.EmailSubmitted]: 'Email submitted',
  [FunnelEvent.PaywallVisited]: 'Paywall visited',
  [FunnelEvent.PurchaseClicked]: 'Purchase clicked',
};
