import { NotificationListRequest, NotificationRequest } from '../types/notification';
import axiosApi from './AxiosApi';

export const createNotification = async (notificationRequest: NotificationRequest) =>
    await axiosApi.post('/notifications', notificationRequest);

export const getNotificationList = async (notificationListRequest: NotificationListRequest) =>
    await axiosApi.get('/notifications', { params: notificationListRequest });
