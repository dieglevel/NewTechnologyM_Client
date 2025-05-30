export interface CreateNotificationTokenDto{
    fcm_token: string;
    accountId: string;
    platform: 'android' | 'ios' | 'web';
    jwt_token: string;
}