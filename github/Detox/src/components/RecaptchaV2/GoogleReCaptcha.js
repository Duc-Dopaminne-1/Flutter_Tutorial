import React from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

import {COLORS} from '../../assets/theme/colors';

const patchPostMessageJsCode = `(${String(function () {
  const originalPostMessage = window.ReactNativeWebView.postMessage;
  const patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };
  window.ReactNativeWebView.postMessage = patchedPostMessage;
})})();`;

const GoogleReCaptcha = ({
  onMessage,
  siteKey,
  style,
  url,
  languageCode,
  cancelButtonText = 'Cancel',
}) => {
  const generateTheWebViewContent = () => {
    const originalForm = `<!DOCTYPE html>
			<html>
			<head> 
				<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge"> 
				<script src="https://recaptcha.google.com/recaptcha/api.js?explicit&hl=${
          languageCode || 'vi'
        }"></script> 
				<script type="text/javascript"> 
				var onloadCallback = function() { };  
				var onDataCallback = function(response) { 
					window.ReactNativeWebView.postMessage(response);  
					setTimeout(function () {
						document.getElementById('captcha').style.display = 'none';
					}, 1500);
				};  
				var onCancel = function() {  
					window.ReactNativeWebView.postMessage("cancel"); 
					document.getElementById('captcha').style.display = 'none';
				}
				var onDataExpiredCallback = function(error) {  window.ReactNativeWebView.postMessage("expired"); };  
				var onDataErrorCallback = function(error) {  window.ReactNativeWebView.postMessage("error"); } 
				</script> 
				<style>
					.btn {
						background-color: #26894F; 
						color: #ffffff; padding: 15px 80px; margin-top: 8px; 
						border: none; border-radius: 8px; font-weight: bold;
					}
					.btn:active {
						outline: none;
					}
					.btn:focus {
						outline: none;
					}
				</style>
			</head>
			<body> 
				<div id="captcha">
					<div style="text-align: center; padding-top: 100px;">
					<div class="g-recaptcha" style="display: inline-block; height: auto;" 
						data-sitekey="${siteKey}" data-callback="onDataCallback"  
						data-expired-callback="onDataExpiredCallback"  
						data-error-callback="onDataErrorCallback">
					</div>
					<div>
						<button 
							onclick="onCancel()"
							class="btn" type="button">
							${cancelButtonText}
						</button> 
					</div>
					</div>
				</div>
			</body>
			</html>`;
    return originalForm;
  };
  return (
    <WebView
      originWhitelist={['*']}
      mixedContentMode={'always'}
      onMessage={onMessage}
      javaScriptEnabled
      injectedJavaScript={patchPostMessageJsCode}
      automaticallyAdjustContentInsets
      style={[styles.container, style]}
      source={{
        html: generateTheWebViewContent(),
        baseUrl: `${url}`,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.TRANSPARENT,
    width: '100%',
  },
});

export default GoogleReCaptcha;
