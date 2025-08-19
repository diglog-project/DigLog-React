export interface NotificationRequest {
    notificationType: string;
    dataId: string;
}

export interface NotificationListRequest {
    page: number;
    size: number;
}

export interface NotificationResponse {
    date: Date;
    message: string;
}
