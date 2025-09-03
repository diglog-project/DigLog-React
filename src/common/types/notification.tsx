export interface NotificationRequest {
    notificationType: string;
    dataId: string;
}

export interface NotificationListRequest {
    page: number;
    size: number;
}

export interface NotificationResponse {
    notificationId: string;
    notificationType: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}
