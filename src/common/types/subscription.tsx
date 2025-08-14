export interface SubscriptionRequest {
    authorName: string;
    notificationEnabled: boolean;
}

export interface SubscriptionListRequest {
    username: string;
    page: number;
    size: number;
}

export interface SubscriberListRequest {
    authorName: string;
    page: number;
    size: number;
}
