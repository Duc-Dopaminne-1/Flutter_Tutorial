//
//  RNSDImageManager.m
//  ShowSourcing
//
//  Created by linh on 4/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RNLImageViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(size, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(scaleMode, NSString)

RCT_EXPORT_VIEW_PROPERTY(onResourceReady, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadFailed, RCTDirectEventBlock)

@end
