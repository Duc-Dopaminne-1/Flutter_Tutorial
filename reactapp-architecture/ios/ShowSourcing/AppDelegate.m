/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>
@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"ShowSourcing"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;

  UIView* loadingView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] firstObject];
  rootView.loadingView = loadingView;
  loadingView.translatesAutoresizingMaskIntoConstraints = NO;
  [NSLayoutConstraint activateConstraints:@[
                                            [[loadingView leadingAnchor] constraintEqualToAnchor:rootView.leadingAnchor],
                                            [[loadingView trailingAnchor] constraintEqualToAnchor:rootView.trailingAnchor],
                                            [[loadingView bottomAnchor] constraintEqualToAnchor:rootView.bottomAnchor],
                                            [[loadingView topAnchor] constraintEqualToAnchor:rootView.topAnchor]
                                            ]];

  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  
  if (@available(iOS 13, *)) {
      self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
  }
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  //[RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  NSMutableDictionary* userInfoCopy = [userInfo mutableCopy];
  userInfoCopy[@"userHasInteracted"] = @YES;
  
  [RCTPushNotificationManager didReceiveRemoteNotification:[NSDictionary dictionaryWithDictionary:userInfoCopy] fetchCompletionHandler:^(UIBackgroundFetchResult result) {
    if ([userInfoCopy[@"userHasInteracted"] boolValue] == YES) {
          return;
        }
      completionHandler(result);
      }];
}

- (void)userNotificationCenter:(UNUserNotificationCenter* )center willPresentNotification:(UNNotification* )notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
    [RCTPushNotificationManager didReceiveRemoteNotification:notification.request.content.userInfo fetchCompletionHandler:^(UIBackgroundFetchResult result) {
        completionHandler(UNNotificationPresentationOptionAlert);
      }];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

@end
