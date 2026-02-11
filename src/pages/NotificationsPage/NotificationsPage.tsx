import React, { useState } from 'react';
import { 
  Bell, 
  Megaphone, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Filter,
  MoreVertical,
  CheckCheck,
  X,
  AlertTriangle,
  Info,
  MessageSquare,
  UserCheck,
  Calendar
} from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className=" px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Stay updated with your ad campaigns and account activity
                </p>
                
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </button>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="  px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex mb-6">
          {['all', 'unread', 'read'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
              {tab === 'unread' && unreadCount > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  filter === 'unread' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <EmptyState filter={filter} />
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'campaign':
        return <Megaphone className="h-5 w-5 text-blue-600" />;
      case 'performance':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-emerald-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'approval':
        return <UserCheck className="h-5 w-5 text-blue-600" />;
      case 'schedule':
        return <Calendar className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgColor = (type, read) => {
    if (read) return 'bg-white';
    switch (type) {
      case 'alert':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      case 'campaign':
        return 'bg-blue-50';
      case 'performance':
        return 'bg-green-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div 
      className={`${getBgColor(notification.type, notification.read)} 
        rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100
        ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`p-2 rounded-lg ${
              notification.read ? 'bg-gray-100' : 'bg-white shadow-sm'
            }`}>
              {getIcon(notification.type)}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`text-base font-semibold ${
                  notification.read ? 'text-gray-700' : 'text-gray-900'
                }`}>
                  {notification.title}
                </h3>
                {!notification.read && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    New
                  </span>
                )}
              </div>
              
              <p className={`mt-1 text-sm ${
                notification.read ? 'text-gray-500' : 'text-gray-700'
              }`}>
                {notification.message}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {notification.time}
                </div>
                
                {notification.campaign && (
                  <div className="flex items-center text-xs text-gray-400">
                    <Megaphone className="h-3.5 w-3.5 mr-1" />
                    {notification.campaign}
                  </div>
                )}
                
                {notification.amount && (
                  <div className="flex items-center text-xs font-medium text-emerald-600">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    {notification.amount}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            {!notification.read && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Mark as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <X className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Action Buttons for certain notifications */}
        {notification.actions && (
          <div className="mt-4 flex items-center space-x-3 ml-12">
            {notification.actions.map((action, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ filter }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {filter !== 'all' ? filter : ''} notifications
      </h3>
      <p className="text-gray-500 mb-6">
        {filter === 'unread' 
          ? 'You have no unread notifications. Great job staying on top of things!'
          : filter === 'read'
          ? 'No read notifications yet'
          : 'You\'re all caught up! Check back later for new notifications'}
      </p>
      {filter !== 'all' && (
        <button 
          onClick={() => setFilter('all')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          View all notifications
        </button>
      )}
    </div>
  );
};

// Sample data for adPortal
const initialNotifications = [
  {
    id: 1,
    type: 'campaign',
    title: 'Campaign Ready for Review',
    message: 'Your "Summer Sale 2024" campaign has been submitted and is awaiting approval from our team.',
    time: '5 minutes ago',
    campaign: 'Summer Sale 2024',
    read: false,
    actions: [
      { label: 'View Campaign', primary: true },
      { label: 'Edit', primary: false }
    ]
  },
  {
    id: 2,
    type: 'performance',
    title: 'Ad Performance Alert',
    message: 'Your "Product Launch" campaign CTR has increased by 25% in the last 24 hours. Great performance!',
    time: '1 hour ago',
    campaign: 'Product Launch',
    read: false,
    actions: [
      { label: 'View Analytics', primary: true }
    ]
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of $500 for "Spring Collection" campaign has been processed successfully.',
    time: '3 hours ago',
    campaign: 'Spring Collection',
    amount: '$500.00',
    read: true
  },
  {
    id: 4,
    type: 'alert',
    title: 'Budget Threshold Reached',
    message: 'Your campaign "Weekend Special" has reached 80% of its daily budget. Consider increasing your budget.',
    time: '5 hours ago',
    campaign: 'Weekend Special',
    read: false,
    actions: [
      { label: 'Increase Budget', primary: true },
      { label: 'Dismiss', primary: false }
    ]
  },
  {
    id: 5,
    type: 'approval',
    title: 'Campaign Approved',
    message: 'Great news! Your "Holiday Special" campaign has been approved and is now live.',
    time: '1 day ago',
    campaign: 'Holiday Special',
    read: true,
    actions: [
      { label: 'View Live Campaign', primary: true }
    ]
  },
  {
    id: 6,
    type: 'schedule',
    title: 'Campaign Ending Soon',
    message: 'Your "Flash Sale" campaign will end in 3 days. Renew now to maintain your ad performance.',
    time: '1 day ago',
    campaign: 'Flash Sale',
    read: true,
    actions: [
      { label: 'Renew Campaign', primary: true },
      { label: 'View Report', primary: false }
    ]
  },
  {
    id: 7,
    type: 'message',
    title: 'New Message from Ad Review Team',
    message: 'The ad review team has left feedback on your "New Collection" campaign.',
    time: '2 days ago',
    campaign: 'New Collection',
    read: true,
    actions: [
      { label: 'View Feedback', primary: true }
    ]
  },
  {
    id: 8,
    type: 'success',
    title: 'Achievement Unlocked',
    message: 'Congratulations! Your campaign has reached 10,000 impressions. You\'ve earned the "Rising Star" badge.',
    time: '3 days ago',
    read: true
  }
];

export default NotificationsPage;