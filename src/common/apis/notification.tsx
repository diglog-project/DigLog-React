import { NotificationListRequest, NotificationRequest } from '../types/notification';
import axiosApi from './AxiosApi';

export const createNotification = async (notificationRequest: NotificationRequest) =>
    await axiosApi.post('/notifications', notificationRequest);

export const getNotificationList = async (notificationListRequest: NotificationListRequest) =>
    await axiosApi.get('/notifications', { params: notificationListRequest });

export const readAllNotifications = async () => await axiosApi.patch('/notifications/read-all');

export const readNotification = async (notificationId: string) =>
    await axiosApi.patch(`/notifications/${notificationId}/read`);

export const removeNotification = async (notificationIds: string[]) =>
    await axiosApi.delete(`/notifications`, { data: { notificationIds } });
