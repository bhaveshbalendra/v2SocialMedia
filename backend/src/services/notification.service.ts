import Notification from "../models/notification.model";
import {
  CreateNotificationHelperParams,
  CreateNotificationParams,
  NotificationType,
} from "../types/notification.types";

class NotificationService {
  /**
   * Returns the default message for a given NotificationType.
   */
  getNotificationMessage(type: NotificationType): string {
    switch (type) {
      // Social interactions
      case NotificationType.FOLLOW_REQUEST:
        return "sent you a follow request";
      case NotificationType.FOLLOW_ACCEPTED:
        return "accepted your follow request";
      case NotificationType.FOLLOWED:
        return "started following you";

      // Content interactions
      case NotificationType.POST_CREATED:
        return "created a new post";
      case NotificationType.POST_LIKED:
        return "liked your post";
      case NotificationType.POST_COMMENTED:
        return "commented on your post";
      case NotificationType.POST_SHARED:
        return "shared your post";
      case NotificationType.COMMENT_LIKED:
        return "liked your comment";
      case NotificationType.COMMENT_REPLIED:
        return "replied to your comment";

      // Messaging
      case NotificationType.MESSAGE_RECEIVED:
        return "sent you a message";

      // Mentions and tags
      case NotificationType.USER_MENTIONED:
        return "mentioned you";
      case NotificationType.TAGGED_IN_POST:
        return "tagged you in a post";

      // System and admin
      case NotificationType.SYSTEM_ALERT:
        return "System alert";
      case NotificationType.ADMIN_ANNOUNCEMENT:
        return "Admin announcement";

      // Engagement and reminders
      case NotificationType.FRIEND_JOINED:
        return "A friend joined the platform";
      case NotificationType.EVENT_REMINDER:
        return "Event reminder";
      case NotificationType.PROMOTION:
        return "Check out our latest promotion!";
      case NotificationType.REENGAGEMENT:
        return "We miss you! Come back and see what's new.";

      // Transactional
      case NotificationType.TRANSACTION_SUCCESS:
        return "Your transaction was successful";
      case NotificationType.TRANSACTION_FAILED:
        return "Your transaction failed";
      case NotificationType.ORDER_SHIPPED:
        return "Your order has been shipped";
      case NotificationType.ORDER_DELIVERED:
        return "Your order has been delivered";

      // Account and security
      case NotificationType.ACCOUNT_VERIFIED:
        return "Your account has been verified";
      case NotificationType.ACCOUNT_SUSPENDED:
        return "Your account has been suspended";
      case NotificationType.PASSWORD_CHANGED:
        return "Your password was changed";
      case NotificationType.LOGIN_ALERT:
        return "New login detected on your account";

      // Custom/user-generated
      case NotificationType.CUSTOM:
      default:
        return "You have a new notification";
    }
  }

  async createNotification(params: CreateNotificationParams) {
    const { sender, recipient, type, content, entityId, entityModel } = params;

    // Generate content if not provided
    const notificationContent = content || this.getNotificationMessage(type);

    const notification = await Notification.create({
      sender,
      recipient,
      type,
      content: notificationContent,
      entityId,
      entityModel,
    });

    // You can now use these fields to create a Notification document
    return notification.toObject();
  }
}

export const notificationService = new NotificationService();
