let activeNotifications = [];
let notificationContainer = null;

function getOrCreateContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    return notificationContainer;
}

export function showNotification(message, type = 'info', duration = 10000) {
    const container = getOrCreateContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    const iconElement = document.createElement('span');
    iconElement.className = 'notification-icon';
    iconElement.textContent = icon;
    
    const messageElement = document.createElement('span');
    messageElement.className = 'notification-message';
    messageElement.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = 'x';
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    notification.appendChild(iconElement);
    notification.appendChild(messageElement);
    notification.appendChild(closeBtn);
    
    container.appendChild(notification);
    activeNotifications.push(notification);
    updateNotificationPositions();
    
    requestAnimationFrame(() => {
        notification.classList.add('notification-show');
    });
    
    const timeout = setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    notification._timeout = timeout;
}

function removeNotification(notification) {
    if (notification._timeout) {
        clearTimeout(notification._timeout);
    }
    
    notification.classList.remove('notification-show');
    notification.classList.add('notification-hide');
    
    setTimeout(() => {
        notification.remove();
        activeNotifications = activeNotifications.filter(n => n !== notification);
        updateNotificationPositions();
    }, 300);
}

function updateNotificationPositions() {
    let offset = 20;
    activeNotifications.forEach((notification, index) => {
        notification.style.top = `${offset}px`;
        offset += notification.offsetHeight + 10;
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        case 'info': return 'ℹ';
        case 'achievement': return '🏆';
        default: return 'ℹ';
    }
}

export function notifySuccess(message, duration = 10000) {
    showNotification(message, 'success', duration);
}

export function notifyError(message, duration = 10000) {
    showNotification(message, 'error', duration);
}

export function notifyWarning(message, duration = 10000) {
    showNotification(message, 'warning', duration);
}

export function notifyInfo(message, duration = 10000) {
    showNotification(message, 'info', duration);
}

export function notifyAchievement(message, duration = 10000) {
    showNotification(message, 'achievement', duration);
}
