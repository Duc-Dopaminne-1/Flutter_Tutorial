# Lesson Learned

## <span style="color:green">Code Error</span>

<details> 
<summary>1. Text strings must be rendered within a <Text> component: <span style="color:red">CRASH</span> app</summary>

### <span style="color:darkorange">Description</span>

This error might be due to boolean check based on text value, javascript will return empty (`''`) string, instead of false value => error happened => <span style="color:red">**CRASH**</span> app.

## Ex: HomeScreen render method include:

```javascript
{
  showWelcome && (
    <ModalPopup visible={showWelcome} onPressOutSide={onDismissWelcomePopup} animationType="slide">
      <WelcomeScreen onPressDismiss={onDismissWelcomePopup} onPressUpgrade={onUpgradeToAgency} />
    </ModalPopup>
  );
}
```

with

```javascript
const showWelcome = role && role === 'member';
```

So, when `role === ''`, showWelcome will be `''` (string value) instead of `false` (boolean value)
==> Error happened

## Solution:

Use `!!` to make sure value will be `boolean` type.
Ex:

```javascript
const showWelcome = !!(role && role === 'member');
```

or

```javascript
const showWelcome = !!role && role === 'member';
```

or

```javascript
{
  !!showWelcome && (
    <ModalPopup visible={showWelcome} onPressOutSide={onDismissWelcomePopup} animationType="slide">
      <WelcomeScreen onPressDismiss={onDismissWelcomePopup} onPressUpgrade={onUpgradeToAgency} />
    </ModalPopup>
  );
}
```

## </details>

<details> 
<summary>2. Cannot go back at top navigation route<Text>: <span style="color:red">CRASH</span> app</summary>

## Description:

This error is due to calling navigation.goBack() with navigation has nothing to go back (can happen due to tap button back multiple times quickly)=> error happened => <span style="color:red">**CRASH**</span> app.

## Ex: Header component:

```javascript
const navigation = useNavigation();

const onBackPress = () => {
  navigation.goBack();
};
```

So, when user tap back button multiple time quickly, `onBackPress()` will be called multiple times, even when there is nothing to go back.
==> Error happened

## Solution:

Use secure code style: check `canGoBack()` before actually call `goBack()`

```javascript
const navigation = useNavigation();

const onBackPress = () => {
  navigation.canGoBack() && navigation.goBack();
};
```

</details>
