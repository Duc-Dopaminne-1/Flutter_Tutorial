//state không thay đổi, chỉ trả về giá trị cuối cùng

export const counterReducers = (times = 0, action) => {
  switch (action.type) {
    default:
      return times
  }
}
