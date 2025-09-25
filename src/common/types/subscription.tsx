export interface SubscriptionRequest {
    authorName: string;
    notificationEnabled: boolean;
}

export interface SubscriptionListRequest {
    authorName: string;
    page: number;
    size: number;
}

export interface SubscriberListRequest {
    subscriberName: string;
    page: number;
    size: number;
}

export interface SubscriptionResponse {
    subscriptionId: string;
    authorName: string;
    notificationEnabled: boolean;
    createdAt: Date;
}

export interface SubscriberResponse {
    subscriptionId: string;
    subscriberName: string;
    notificationEnabled: true;
    createdAt: Date;
}
