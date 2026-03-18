// Web stub for expo-haptics — haptic feedback is no-op in browser
module.exports = {
  impactAsync: () => Promise.resolve(),
  notificationAsync: () => Promise.resolve(),
  selectionAsync: () => Promise.resolve(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy', Rigid: 'Rigid', Soft: 'Soft' },
  NotificationFeedbackType: { Success: 'Success', Warning: 'Warning', Error: 'Error' },
}
