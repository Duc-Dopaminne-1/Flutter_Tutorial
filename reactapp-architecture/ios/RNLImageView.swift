//
//  RNSDImage.swift
//  ShowSourcing
//
//  Created by linh on 4/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import Kingfisher

class RNLImageView: UIImageView {
  let placeholder = UIImage(named: "MissingImage")
  var options: SDWebImageOptions = [.progressiveLoad, .retryFailed]

  @objc var onResourceReady: RCTDirectEventBlock?
  @objc var onLoadFailed: RCTDirectEventBlock?

  override func removeFromSuperview() {
    super.removeFromSuperview()
    self.sd_cancelCurrentImageLoad()
  }

  deinit {
    self.sd_cancelCurrentImageLoad()
  }

  @objc var source: Dictionary<String, Any> = [:] {
    didSet {
      let id = source["id"] as? String

      SDImageCache.shared.queryImage(forKey: id, options: [], context: nil) { (img, data, cacheType) in
        if (img != nil) {
          self.image = img
        } else {
          self.setRemoteImage()
        }
      }
    }
  }

  func setRemoteImage() {
    let id = source["id"] as? String
    var uri = source["uri"] as? String
    let downloadPriority = source["downloadPriority"] as? NSNumber

    if uri == nil {
      if (id == nil) {
        self.image = placeholder
        return
      }
      uri = "https://files.showsourcing.com/xl/\(id!.lowercased()).jpg"
    }

    let url = URL(string: uri!)

    var options: SDWebImageOptions = [.progressiveLoad, .retryFailed]
    if let priority = downloadPriority {
      if priority.floatValue < 0.5 {
        options.insert(.lowPriority)
      } else {
        options.insert(.highPriority)
      }
    }

    self.sd_setImage(with: url, placeholderImage: self.placeholder, options: options)
  }

  @objc var size: Dictionary<String, NSNumber> = [:] {
    didSet {
      let width = size["width"] ?? 0
      let height = size["height"] ?? 0
      frame = CGRect(x: 0, y: 0, width: width.doubleValue, height: height.doubleValue)
    }
  }

  @objc var scaleMode: String = "scaleAspectFill" {
    didSet {
      switch scaleMode {
      case "scaleAspectFit":
        contentMode = .scaleAspectFit
        break
      default:
        contentMode = .scaleAspectFill
        break
      }
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    let _ = RNLImageView.setup
    contentMode = .scaleAspectFill
    clipsToBounds = false
    image = placeholder
    layer.rasterizationScale = UIScreen.main.scale
    self.sd_imageTransition = SDWebImageTransition.fade
  }

  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // Will be called only once
  static let setup: Void = {
    let regex = try! NSRegularExpression(pattern: "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}")

    let cacheKeyFilter = SDWebImageCacheKeyFilter { (url) -> String? in
      let urlString = url.absoluteString
      let nsrange = NSRange(location: 0, length: urlString.utf16.count)
      if let match = regex.firstMatch(in: urlString, options: [], range: nsrange) {
          let string = String(urlString[Range(match.range, in: urlString)!])
          return string
      } else {
          return urlString
      }
    }
    SDWebImageManager.shared.cacheKeyFilter = cacheKeyFilter
    SDImageCache.shared.config.shouldCacheImagesInMemory = false

    // TODO Remove with Kingfisher module
    KingfisherManager.shared.cache.clearMemoryCache()
    KingfisherManager.shared.cache.clearDiskCache()
    KingfisherManager.shared.cache.cleanExpiredDiskCache()
    KingfisherManager.shared.cache.cleanExpiredMemoryCache()
  }()
}
