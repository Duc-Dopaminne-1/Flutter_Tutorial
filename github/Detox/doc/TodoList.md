# Todo List

## <span style="color:green">Architecture</span>

<details>

<summary>1. Deep Linking</summary>
Description: Deep Linking

- [x] Navigation among screens based on its route

</details>

---

## <span style="color:green">Features</span>

<details>

<summary>Push Notification</summary>
Description: Allow system to send push notification to user device while the app is in foreground or background or even not running. When user clicks on the notification, the app will opened the specific screen.

- [x] Integrate with [OneSignal](https://onesignal.com) service
- [x] Support Deep linking navigation in the app
- [x] Handle OneSignal events while app is in foreground, background, not running

</details>

<details>
<summary>Map features</summary>
Description: Integrate Map feature to the app

- [x] Integrate with [Google Map]() SDK (Canh)
- [x] Show static map with position maker, change position marker with given longitude, latitude (Canh)
- [x] Integrate with service that allows transferring from specific address to longitude, latitude (Canh)
- [x] Display multiple custom maker (agent avatar) on map based on search results
- [x] Zoom, pan map and display dynamic agent list
</details>

<details>
<summary>Image picker with permission handler (Bug)</summary>
Description: Currently, on Android, after user accept Camera permission, app still ask user to open settings. Library Photo is ok. iOS is Ok for both Camera and Library Photo.

</details>

<details>
<summary>App life cycle handling</summary>
Description: Handle app life cycle with standard behavior:

- [x] Background
- [x] Foreground
- [x] Killed

</details>

<details>
<summary>Token authenticaton</summary>
Description: Using token, refresh token, handling token expired case

- [x] Pass token to backend
- [x] Auto refresh token when token expired or auto sign out

</details>

<details>
<summary>Network status handling</summary>
Description: Display information for network status

- [x] On line
- [x] Off line
- [ ] Slow connection

## </details>

## <span style="color:green">Technical Debt</span>

<details>

<summary>Sonar lint for locally check</summary>
Description: Config so that dev can check Sonar from local with all benefits of cloud Sonar

- [x] Config cloud and try to check coding rules on cloud first
- [x] Config to allow check coding rules follow cloud sonar from local machine

</details>

---

<details>

<summary>Unit test</summary>
Description: Unit test for some important parts

- [x] Unit test validation logic
- [ ] Unit test for complex logic handling
- [ ] Unit test for important logic

</details>

---

<details>

<summary>UI test</summary>
Description: UI automation test

- [ ] UI test for important flow

</details>

---

<details>

<summary>Refactor code</summary>
Description: Standardize code base for more consistent and clean

- [ ] Theme: font, size, color
- [ ] Style in separate file

</details>

---
