//
//  RNSDImageManager.swift
//  ShowSourcing
//
//  Created by linh on 4/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(RNLImageViewManager)
class RNLImageViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func view() -> UIView! {
    return RNLImageView(frame: CGRect.zero)
  }
}
