# Best Practices

## <span style="color:green">Source Control</span>

<details> 
<summary>1. Git flow and commands for developing a task</summary>
Description: There are 2 ways to developing a task: Rebase or Merge. Prefer rebase for clean code history.

- Rebase method

- Merge method

</details>

---

## <span style="color:green">UI/UX</span>

<details> 
<summary>1. Easily interact with small area</summary>

### Description:

Sometimes, UI design requires a small visually touchable area, make it really hard to touch the area.

### Example:

```javascript
<CustomIconButton
  style={{width: 20}}
  onPress={onPressBack}
  image={IMAGES.IC_SIGNUP_BACK}
  hitSlop={{top: 20, bottom: 20, left: 20, right: 30}}
/>
```

### Solution:

Use padding and/or hitSlop to increase touchable area to at least recommended side (44x44) and still keep the same visual area.

```javascript
<CustomIconButton
  style={{width: 20, paddingBottom: 24, paddingRight: 44}}
  onPress={onPressBack}
  image={IMAGES.IC_SIGNUP_BACK}
  hitSlop={{top: 20, bottom: 20, left: 20, right: 30}}
/>
```

</details>
