import { SubscriberListRequest, SubscriptionListRequest, SubscriptionRequest } from '../types/subscription';
import axiosApi from './AxiosApi';

export const createSubscription = async (subscriptionRequest: SubscriptionRequest) =>
    await axiosApi.post('/subscriptions', subscriptionRequest);

export const updateSubscriptionNotification = async (subscriptionId: string) =>
    await axiosApi.patch(`/subscriptions/${subscriptionId}/notification-setting`);

export const getIsSubscribed = async (authorName: string) =>
    await axiosApi.get(`/subscriptions/current-member/authors/${authorName}`);

export const getSubscriptionList = async (subscriptionListRequest: SubscriptionListRequest) =>
    await axiosApi.get('/subscriptions/users', { params: subscriptionListRequest });

export const getSubscriberListRequest = async (subscriberListRequest: SubscriberListRequest) =>
    await axiosApi.get('/subscriptions/authors', { params: subscriberListRequest });

export const deleteSubscription = async (username: string) => await axiosApi.delete(`/subscriptions/${username}`);
