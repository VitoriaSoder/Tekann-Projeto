namespace Notifications;

public class NotificationContext
{
    private readonly List<Notification> _notifications = new();

    public IReadOnlyCollection<Notification> Notifications => _notifications;
    public bool HasNotifications => _notifications.Count > 0;

    public void AddNotification(string key, string message)
        => _notifications.Add(new Notification(key, message));

    public void AddNotification(Notification notification)
        => _notifications.Add(notification);

    public void AddNotifications(IEnumerable<Notification> notifications)
        => _notifications.AddRange(notifications);
}
