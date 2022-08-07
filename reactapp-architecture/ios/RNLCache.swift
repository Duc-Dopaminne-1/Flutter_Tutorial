//
//  RNLCache.swift
//  ShowSourcing
//
//  Created by linh on 4/8/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

extension FileManager {
  open func secureCopyItem(at srcURL: URL, to dstURL: URL) -> Bool {
    do {
      if FileManager.default.fileExists(atPath: dstURL.path) {
        try FileManager.default.removeItem(at: dstURL)
      }
      try FileManager.default.copyItem(at: srcURL, to: dstURL)
    } catch (let error) {
      print("Cannot copy item at \(srcURL) to \(dstURL): \(error)")
      return false
    }
    return true
  }
  
  func path(id: String) -> URL {
    let cachePath = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
    let path = cachePath.appendingPathComponent("ShowSourcing/5", isDirectory: true).appendingPathComponent(id).appendingPathExtension("png")
    return path
  }
}

extension UIImage {
  func resizeImage(width: CGFloat) -> UIImage? {
    let resizedHeight = CGFloat(ceil(width/size.width * size.height))
    let cgSize = CGSize(width: width, height: resizedHeight)
    UIGraphicsBeginImageContext(cgSize)
    self.draw(in: CGRect(x: 0, y: 0, width: width, height: resizedHeight))
    let result = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    return result
  }
}

@objc(RNLCache)
class RNLCache: RCTEventEmitter {
  var prefetchs: Dictionary<String, SDWebImagePrefetchToken> = [:]
  var data: Dictionary<String, String> = [:]
  var data2: Array<Dictionary<String, String?>> = []

  let file = FileManager.default

  override static func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func supportedEvents() -> [String]! {
    return ["onSuccess", "onSuccess2"]
  }

  @objc func prefetch(
    _ paths: Array<String>,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    let key = UUID().uuidString
    let urls = paths.map { URL(string: $0)! }

    let prefetcher = SDWebImagePrefetcher.shared.prefetchURLs(urls, progress: nil) { (noOfFinishedUrls, noOfSkippedUrls) in
     print("These resources are prefetched: \(noOfFinishedUrls) \(noOfSkippedUrls)")
    }

    prefetchs[key] = prefetcher

    resolve(key)
  }

  @objc func stopPrefetch(_ key: String) {
    let prefetcher = prefetchs[key]
    if prefetcher == nil {
      return
    }

    prefetcher?.cancel()
    prefetchs.removeValue(forKey: key)
  }

  private func cacheManually(paths: Array<String>,
                             resolver resolve: @escaping RCTPromiseResolveBlock) -> Array<Dictionary<String, String?>> {
    var dataCache: Array<Dictionary<String, String?>> = []
    if (paths.count == 0) {
      resolve(dataCache)
      return dataCache
    }

    var storedImagesCount = 0
    for path in paths {
      let uuid = UUID().uuidString
      let srcURL = URL(string: path)

      let image = UIImage(contentsOfFile: (srcURL?.path)!)
      let resizedImage = image?.resizeImage(width: 1600)
      let compressData = resizedImage!.jpegData(compressionQuality: 0.8)
      let base64 = compressData?.base64EncodedString()

      SDImageCache.shared.store(resizedImage, forKey: uuid, toDisk: true) {
        storedImagesCount += 1
        DispatchQueue.main.async {
          self.data[uuid] = base64
        }

        dataCache.append(["id": uuid, "base64": base64])
        if (storedImagesCount == paths.count) {
          resolve(dataCache)
        }
      }
//      ImageCache.default.storeToDisk(compressData!, forKey: uuid) { (result) in
//        storedImagesCount += 1
//        print(result)
//        DispatchQueue.main.async {
//          self.data[uuid] = base64
//        }
//
//        dataCache.append(["id": uuid, "base64": base64])
//        if (storedImagesCount == paths.count) {
//          resolve(dataCache)
//        }
//      }
    }

    return dataCache
  }
  
  @objc func storeWithoutSave(
    _ paths: Array<String>,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    DispatchQueue(label: "cacheWithoutSave", qos: .utility).async {
      var dataCache: Array<Dictionary<String, String?>> = []
      
      for path in paths {
        let uuid = UUID().uuidString
        let srcURL = URL(string: path)
        
        let image = UIImage(contentsOfFile: (srcURL?.path)!)
        let resizedImage = image?.resizeImage(width: 1600)
        let compressData = resizedImage!.jpegData(compressionQuality: 0.8)
        let base64 = compressData?.base64EncodedString()
        SDImageCache.shared.store(resizedImage, forKey: uuid, toDisk: true)

        dataCache.append(["id": uuid, "base64": base64])
      }
      
      DispatchQueue.main.async {
        resolve(dataCache)
      }
    }
  }
  
  @objc func store(
    _ paths: Array<String>,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    DispatchQueue(label: "doCache", qos: .utility).async {
      let _ = self.cacheManually(paths: paths, resolver: resolve)
    }
  }

  @objc func emptyResolver(_: Any?) {
  }
  @objc func storeAt(
    _ paths: Array<String>,
    at index: NSNumber
    ) {
    DispatchQueue(label: "doCache", qos: .utility).async {
      let dataCache = self.cacheManually(paths: paths, resolver: self.emptyResolver)

      DispatchQueue.main.async {
        self.data2.insert(dataCache[0], at: index.intValue)
        self.sendEvent(withName: "onSuccess2", body: self.data2)
      }
    }
  }

  @objc func storeReplaceAt(
    _ paths: Array<String>,
    at index: NSNumber
    ) {
    DispatchQueue(label: "doCache", qos: .utility).async {
      let dataCache = self.cacheManually(paths: paths, resolver: self.emptyResolver)

      DispatchQueue.main.async {
        self.data2[index.intValue] = dataCache[0]
        self.sendEvent(withName: "onSuccess2", body: self.data2)
      }
    }
  }

  @objc func rearrange(
    _ fromIndex: NSNumber,
    to toIndex: NSNumber,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    let el = data2.remove(at: fromIndex.intValue)
    data2.insert(el, at: toIndex.intValue)
    sendEvent(withName: "onSuccess2", body: self.data2)

    resolve(true)
  }

  @objc func delete(
    _ index: NSNumber,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    data2.remove(at: index.intValue)
    sendEvent(withName: "onSuccess2", body: self.data2)

    resolve(true)
  }

  @objc func data(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    resolve(self.data)
  }

  @objc func data2(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    resolve(self.data2)
  }

  @objc func clear(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    data = [:]
    data2 = []
    resolve(true)
  }

  @objc func isCached(
    _ key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    SDImageCache.shared.queryImage(forKey: key, options: [], context: nil) { (image, data, cache) in
      var cacheType = "none"
      switch cache {
      case .all:
        cacheType = "all"
        break
      case .disk:
        cacheType = "disk"
        break
      case .memory:
        cacheType = "memory"
        break
      case .none:
        cacheType = "none"
        break
      }
      resolve([
      "cached": image != nil,
      "cacheType": cacheType
      ])
    }
  }

  @objc func retrieveImage(
    _ key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {


    SDImageCache.shared.queryImage(forKey: key, options: [], context: nil) { (image, data, cacheType) in
      if (image == nil) {
        resolve(["isCached": false, "path": ""])
      } else {
        if let path = SDImageCache.shared.cachePath(forKey: key) {
         resolve(["isCached": true, "path": path])
        } else {
          resolve(["isCached": false, "path": ""])
        }
      }
    }
  }

  @objc func cleanCache(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    DispatchQueue(label: "cleanCache", qos: .utility).async {
      for (key, _) in self.data {
        SDImageCache.shared.removeImage(forKey: key, withCompletion: nil)
      }

      SDImageCache.shared.clearMemory()
      DispatchQueue.main.async {
        self.data = [:]
        self.data2 = []
        resolve(true)
      }
    }
  }
  
  @objc func retrieveArrayImage(
    _ listId: Array<String>,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
    ) {
    DispatchQueue(label: "retrieveArrayImage", qos: .utility).async {
      var dataCache: Array<Dictionary<String, String?>> = []

      for key in listId {
        if let path = SDImageCache.shared.cachePath(forKey: key) {
          let image = UIImage(named: path)
          let imageData = image?.pngData()
          let base64 = imageData?.base64EncodedString()
          
          dataCache.append(["id": key, "base64": base64])
        }
      }
      resolve(dataCache)
    }
  }
}
