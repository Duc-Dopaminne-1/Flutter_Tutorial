# Development Environment Setup

## 1. Setup React Native CLI development environment

Description: Setup React Native CLI to build and deploy React Native app (both Android and iOS)

Reference: https://reactnative.dev/docs/environment-setup

- Node & watchman

  ```
  brew install node
  brew install watchman
  ```

- Xcode & CocoaPods

  - [Mac App Store link](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
  - Command Line Tools: Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.
  - Installing an iOS Simulator in Xcode: To install a simulator, open Xcode > Preferences... and select the Components tab. Select a simulator with the corresponding version of iOS you wish to use.
  - [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)

  ```
  sudo gem install cocoapods
  ```

- Android Development environment:

  - [Install Android Studio](https://developer.android.com/studio/index.html)
  - Install the Android SDK: Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK
  - Configure the ANDROID_HOME environment variable: Add the following lines to your $HOME/.bash_profile or $HOME/.bashrc (if you are using zsh then ~/.zprofile or ~/.zshrc) config file:
    ```
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

## 2. Install Fastlane

Description: For running fastlane command line when deploy apps (both iOS and Android apps)

Refernece: https://docs.fastlane.tools/getting-started/ios/setup/

```

# Install the latest Xcode command line tools

xcode-select --install

# Install fastlane using RubyGems

sudo gem install fastlane -NV

# Alternatively using Homebrew

brew install fastlane

```
