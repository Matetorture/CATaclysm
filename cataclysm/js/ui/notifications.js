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

export function showNotification(message, type = 'info') {
    const container = getOrCreateContainer();
    const duration = 10000;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconElement = document.createElement('span');
    iconElement.className = 'notification-icon';
    
    const iconImg = document.createElement('img');
    iconImg.src = `img/icons/${type}.png`;
    iconImg.alt = type;
    iconImg.style.width = '70%';
    iconImg.style.height = '70%';
    iconImg.style.objectFit = 'contain';
    iconElement.appendChild(iconImg);
    
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

export function notifySuccess(message) {
    showNotification(message, 'success');
}

export function notifyError(message) {
    showNotification(message, 'error');
}

export function notifyWarning(message) {
    showNotification(message, 'warning');
}

export function notifyInfo(message) {
    showNotification(message, 'info');
}

export function notifyAchievement(message) {
    showNotification(message, 'achievement');
}
