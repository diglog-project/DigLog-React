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

export interface SubscriptionResponse {
    subscriptionId: string;
    authorUsername: string;
    notificationEnabled: boolean;
    createdAt: Date;
}

export interface SubscriberResponse {
    subscriptionId: string;
    subscriberUsername: string;
    notificationEnabled: true;
    createdAt: Date;
}
