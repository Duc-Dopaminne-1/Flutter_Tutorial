//
//  AVPlayerWrapper.swift
//  SwiftAudio
//
//  Created by Jørgen Henrichsen on 06/03/2018.
//  Copyright © 2018 Jørgen Henrichsen. All rights reserved.
//

import Foundation
import AVFoundation
import MediaPlayer

public enum PlaybackEndedReason: String {
    case playedUntilEnd
    case playerStopped
    case skippedToNext
    case skippedToPrevious
    case jumpedToIndex
}

class AVPlayerWrapper: AVPlayerWrapperProtocol {

    struct Constants {
        static let assetPlayableKey = "playable"
    }

    // MARK: - Properties

    let avPlayer: AVPlayer
    let playerObserver: AVPlayerObserver
    let playerTimeObserver: AVPlayerTimeObserver
    let playerItemNotificationObserver: AVPlayerItemNotificationObserver
    let playerItemObserver: AVPlayerItemObserver

    /**
     True if the last call to load(from:playWhenReady) had playWhenReady=true.
     */
    fileprivate var _playWhenReady: Bool = true
    fileprivate var _initialTime: TimeInterval?

    fileprivate var _state: AVPlayerWrapperState = AVPlayerWrapperState.idle {
        didSet {
            if oldValue != _state {
                self.delegate?.AVWrapper(didChangeState: _state)
            }
        }
    }

    public init(avPlayer: AVPlayer = AVPlayer()) {
        self.avPlayer = avPlayer
        self.playerObserver = AVPlayerObserver(player: avPlayer)
        self.playerTimeObserver = AVPlayerTimeObserver(player: avPlayer, periodicObserverTimeInterval: timeEventFrequency.getTime())
        self.playerItemNotificationObserver = AVPlayerItemNotificationObserver()
        self.playerItemObserver = AVPlayerItemObserver()

        self.playerObserver.delegate = self
        self.playerTimeObserver.delegate = self
        self.playerItemNotificationObserver.delegate = self
        self.playerItemObserver.delegate = self

        playerTimeObserver.registerForPeriodicTimeEvents()
    }

    // MARK: - AVPlayerWrapperProtocol

    var state: AVPlayerWrapperState {
        return _state
    }

    var reasonForWaitingToPlay: AVPlayer.WaitingReason? {
        return avPlayer.reasonForWaitingToPlay
    }

    var currentItem: AVPlayerItem? {
        return avPlayer.currentItem
    }

    var _pendingAsset: AVAsset? = nil

    var automaticallyWaitsToMinimizeStalling: Bool {
        get { return avPlayer.automaticallyWaitsToMinimizeStalling }
        set { avPlayer.automaticallyWaitsToMinimizeStalling = newValue }
    }

    var currentTime: TimeInterval {
        let seconds = avPlayer.currentTime().seconds
        return seconds.isNaN ? 0 : seconds
    }

    var duration: TimeInterval {
        if let seconds = currentItem?.asset.duration.seconds, !seconds.isNaN {
            return seconds
        }
        else if let seconds = currentItem?.duration.seconds, !seconds.isNaN {
            return seconds
        }
        else if let seconds = currentItem?.loadedTimeRanges.first?.timeRangeValue.duration.seconds,
            !seconds.isNaN {
            return seconds
        }
        return 0.0
    }

    var bufferedPosition: TimeInterval {
	return currentItem?.loadedTimeRanges.last?.timeRangeValue.end.seconds ?? 0
    }

    weak var delegate: AVPlayerWrapperDelegate? = nil

    var bufferDuration: TimeInterval = 0

    var timeEventFrequency: TimeEventFrequency = .everySecond {
        didSet {
            playerTimeObserver.periodicObserverTimeInterval = timeEventFrequency.getTime()
        }
    }

    var rate: Float {
        get { return avPlayer.rate }
        set { avPlayer.rate = newValue }
    }

    var volume: Float {
        get { return avPlayer.volume }
        set { avPlayer.volume = newValue }
    }

    var isMuted: Bool {
        get { return avPlayer.isMuted }
        set { avPlayer.isMuted = newValue }
    }

    func play() {
        avPlayer.play()
    }

    func pause() {
        avPlayer.pause()
    }

    func togglePlaying() {
        switch avPlayer.timeControlStatus {
        case .playing, .waitingToPlayAtSpecifiedRate:
            pause()
        case .paused:
            play()
        }
    }

    func stop() {
        pause()
        reset(soft: false)
    }

    func seek(to seconds: TimeInterval) {
        avPlayer.seek(to: CMTimeMakeWithSeconds(seconds, preferredTimescale: 1000)) { (finished) in
            if let _ = self._initialTime {
                self._initialTime = nil
                if self._playWhenReady {
                    self.play()
                }
            }
            self.delegate?.AVWrapper(seekTo: Int(seconds), didFinish: finished)
        }
    }

    func load(from url: URL, playWhenReady: Bool) {
        reset(soft: true)
        _playWhenReady = playWhenReady

        // Set item
        self._pendingAsset = AVURLAsset(url: url)
        if let pendingAsset = _pendingAsset {
            pendingAsset.loadValuesAsynchronously(forKeys: [Constants.assetPlayableKey], completionHandler: {
                var error: NSError? = nil
                let status = pendingAsset.statusOfValue(forKey: Constants.assetPlayableKey, error: &error)

                DispatchQueue.main.async {
                    let isPendingAsset = (self._pendingAsset != nil && pendingAsset.isEqual(self._pendingAsset))
                    switch status {
                    case .loaded:
                        if isPendingAsset {
                            let currentItem = AVPlayerItem(asset: pendingAsset, automaticallyLoadedAssetKeys: [Constants.assetPlayableKey])
                            currentItem.preferredForwardBufferDuration = self.bufferDuration
                            self.avPlayer.replaceCurrentItem(with: currentItem)

                            // Register for events
                            self.playerTimeObserver.registerForBoundaryTimeEvents()
                            self.playerObserver.startObserving()
                            self.playerItemNotificationObserver.startObserving(item: currentItem)
                            self.playerItemObserver.startObserving(item: currentItem)
                        }
                        break

                    case .failed:
                        // print("load asset failed")
                        if isPendingAsset {
                            self.delegate?.AVWrapper(failedWithError: error)
                            self._pendingAsset = nil
                        }
                        break

                    case .cancelled:
                        // print("load asset cancelled")
                        break

                    default:
                        break
                    }
                }
            })
        }
    }

    func load(from url: URL, playWhenReady: Bool, initialTime: TimeInterval?) {
        _initialTime = initialTime
        self.pause()
        self.load(from: url, playWhenReady: playWhenReady)
    }

    // MARK: - Util

    private func reset(soft: Bool) {
        playerItemObserver.stopObservingCurrentItem()
        playerTimeObserver.unregisterForBoundaryTimeEvents()
        playerItemNotificationObserver.stopObservingCurrentItem()

        if self._pendingAsset != nil {
            self._pendingAsset?.cancelLoading()
            self._pendingAsset = nil
        }

        if !soft {
            avPlayer.replaceCurrentItem(with: nil)
        }
    }

}

extension AVPlayerWrapper: AVPlayerObserverDelegate {

    // MARK: - AVPlayerObserverDelegate

    func player(didChangeTimeControlStatus status: AVPlayer.TimeControlStatus) {
        switch status {
        case .paused:
            if currentItem == nil {
                _state = .idle
            }
            else {
                self._state = .paused
            }
        case .waitingToPlayAtSpecifiedRate:
            self._state = .loading
        case .playing:
            self._state = .playing
        }
    }

    func player(statusDidChange status: AVPlayer.Status) {
        switch status {

        case .readyToPlay:
            self._state = .ready

            if let initialTime = _initialTime {
                self.seek(to: initialTime)
            }
            else if _playWhenReady {
                self.play()
            }

            break

        case .failed:
            self.delegate?.AVWrapper(failedWithError: avPlayer.error)
            break

        case .unknown:
            break
        }
    }

}

extension AVPlayerWrapper: AVPlayerTimeObserverDelegate {

    // MARK: - AVPlayerTimeObserverDelegate

    func audioDidStart() {
        self._state = .playing
    }

    func timeEvent(time: CMTime) {
        self.delegate?.AVWrapper(secondsElapsed: time.seconds)
    }

}

extension AVPlayerWrapper: AVPlayerItemNotificationObserverDelegate {

    // MARK: - AVPlayerItemNotificationObserverDelegate

    func itemDidPlayToEndTime() {
        delegate?.AVWrapperItemDidPlayToEndTime()
    }

}

extension AVPlayerWrapper: AVPlayerItemObserverDelegate {

    // MARK: - AVPlayerItemObserverDelegate

    func item(didUpdateDuration duration: Double) {
        self.delegate?.AVWrapper(didUpdateDuration: duration)
    }

}
