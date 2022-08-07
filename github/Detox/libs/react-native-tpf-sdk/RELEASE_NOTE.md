# react-native-tpf-sdk

## 1.0.14 (22:30 24/06/2022)
Important: Package này dùng cho topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:
- Fix bug tạo hồ sơ bản hiểm > ở step 2: k hiển thị được địa chỉ hiện tại khi bật toogle Địa chỉ hiện tại giống địa chỉ thường chú
- Fix bug bỏ trường "Thanh toán trước" ơ hồ sơ DVCT thanh toán offline
- Fix bug Tạo yêu cầu hỗ trợ và xử lý yêu cầu hỗ trợ bị duplicate hình ảnh
### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Môi trường Production: sử dụng topenid-client-1.0.3.tgz
- Môi trường UAT: sử dụng topenid-client-1.0.9.tgz

```
"topenid-client": "file:topenid-client-1.0.3.tgz"
"topenid-client": "file:topenid-client-1.0.9.tgz"
```

## 1.0.13 (12:00 22/06/2022)
Important: Package này dùng cho topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:
- Fix bug Lịch hẹn được cập nhật và tự Duyệt (chuyển sang trạng thái sắp đến)
- Fix bug Không hiển thị button Chuyển đổi trạng thái khi khách hàng tiềm năng đang ở trạng thái "Thành công" hoặc "Đã chuyển đổi"
- Fix bug UI chi tiết lịch hẹn: Status "Không thể liên hệ" không bị lệch ra ngoài
- Fix bug khi tạo lịch hẹn thành công, Không hiển thị popup nhỏ chứa button undefine
### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Môi trường Production: sử dụng topenid-client-1.0.3.tgz
- Môi trường UAT: sử dụng topenid-client-1.0.9.tgz

```
"topenid-client": "file:topenid-client-1.0.3.tgz"
"topenid-client": "file:topenid-client-1.0.9.tgz"
```


## 1.0.12 (10:30 19/06/2022) - UAT/PROD

Important: Package này dùng cho topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:

#### Fix bug của topenland:
- Issue #2: khi chọn 1 Đối tác và click nút "Chọn đối tác cung cấp", app không có phản ứng gì cho đến gần 3 giây sau đó mới load tiếp
- Issue #3: Ở bước 2 trong luồng 3 bước của 1 DVCT, khi chọn 1 Đối tác và click nút "Chọn đối tác cung cấp", màn hình chuyển tiếp đến bước 3 nhưng không hiển thị nội dung ngay tại bước 3
- Issue #10: Hiển thị thông báo Tạo lịch hẹn thành công và lịch hẹn được ghi nhận vô nền tảng trạng thái "Chờ Đối tác xác nhận" 
- Issue #17: SDK load chậm
- Issue #18: Không hiển thị thông báo "Cập nhật thông tin khách hàng tiềm năng thành công"
- Issue #21: Chỗ tài liệu đính kèm chưa chặn các file không phải là png; jpg; pdf; doc; xlsx
- Issue #30: Không hiển thị  mục Tài liệu đính kèm như kết quả mong đợi
- Issue #40: Khi chọn thời gian hẹn: Từ thời gian = Đến thời gian thì hệ thống không có thông báo lỗi và gửi thông báo thành công
- Issue #55: Dropdown list chồng đè lên text
- Issue #61: Bấm vào touchpoint tài chính BĐS => xuất hiện màn hình " không có sản phẩm" trong 2 giây mới hiện danh mục sản phẩm 
- Issue #65: Banner trong trang riêng của mỗi DVCT hiển thị box màu xanh lá cây dù không cấu hình text cho phần "Mô tả banner"
- Issue #66: Banner trong mỗi trang riêng của DVCT load chậm (trên App)
- Issue #99: Tạo hồ sơ vay ==> chưa auto fill thông tin khi chọn "Bản thân"
- Issue #101: Hỗ trợ công chứng: map chưa load đúng địa chỉ
- Issue #122: Không thể chuyển trạng thái lịch hẹn: Nút [Hoàn thành] bị mờ và không thể click chọn được nếu User không nhập nội dung đánh giá lịch hẹn
- Issue #123: Xuất phiếu xác nhận dịch vụ không thành công từ tab lịch hẹn và từ chi tiết lịch hẹn
- Issue #128: Radio button hiển thị khi tạo hồ sơ bị dính với nhau
- Issue #130: Không hiển thị nội dung cần bổ sung

#### Fix bug khác:
  
- Fix bug crash app ở android 9 khi vào chi tiết DVCT
- Fix bug load sai thông tin địa chỉ khi tạo hồ sơ tài chính từ lead

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Môi trường Production: sử dụng topenid-client-1.0.3.tgz
- Môi trường UAT: sử dụng topenid-client-1.0.9.tgz

```
"topenid-client": "file:topenid-client-1.0.3.tgz"
"topenid-client": "file:topenid-client-1.0.9.tgz"
```

## 1.0.11 (09:00 10/06/2022)
Important
- Dừng sử dụng topenid-client trong SDK, tích hợp authen thông qua BE
- Các môi trường qa, uat, prod sẽ phân biệt với nhau thông qua appId và remoteAddress.

### Các chức năng thay đổi/thêm mới:

- Fix bug name = lastname + firstname
- Fix bug dark mode không hiển thị product swatches
- Fix click button tạo hồ sơ spam nhiều hồ sơ
- Fix khi đăng nhập thành công mobile SDK thì lại không hiển thị được màn hình nhập
- Bổ sung term and privacy
- Chuyển method deleteLead từ delete sang post
- Cập nhật cơ chế bảo mật cho luồng nhận diện người dùng

### Các thay đổi về cơ chế tích hợp (nếu có):

- Thay đổi về Settings:
  - Xoá bỏ các key : **aesSecretKey**, **clientAccessTokenUrl**
  - Thêm key mới : **appId**

- Sample
```
  const SETTINGS = {
    scheme: 'topenfintech:/',
    // Key appId
    appId: 'key appId',
  };
  // Other code
  
  <TpfSdk
    ref={client}
    eventHandlers={clientEventHandlers}
    theme={theme}
    remoteAddress={remoteAddress}
    setting={SETTINGS}
  />
```  

### Các thay đổi về dependencies (nếu có):

- Các package bị xoá bỏ :

```
  - topenid-client
```

## 1.0.10 (21:00 01/06/2022) - UAT/PROD

Important: Package này dùng cho topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:

- Fix bug nhận dạng người dùng khi vào "Quản lý hồ sơ", "Lịch sử giao dịch", "Tài khoản hoa hồng", "Yêu cầu hoàn trả", "Gửi yêu cầu nhanh"

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Môi trường Production: sử dụng topenid-client-1.0.3.tgz
- Môi trường UAT: sử dụng topenid-client-1.0.9.tgz

```
"topenid-client": "file:topenid-client-1.0.3.tgz"
"topenid-client": "file:topenid-client-1.0.9.tgz"
```


## 1.0.9 (19:00 26/05/2022) - UAT/PROD

Important: Package này dùng cho topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:

- Fix bug UI chi tiết dịch vụ cộng thêm
- Fix bug nhận diện người dùng

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Môi trường Production: sử dụng topenid-client-1.0.3.tgz
- Môi trường UAT: sử dụng topenid-client-1.0.9.tgz

```
"topenid-client": "file:topenid-client-1.0.3.tgz"
"topenid-client": "file:topenid-client-1.0.9.tgz"
```

## 1.0.8 (22:00 24/05/2022) - UAT/PROD

Important: Package này dùng cho topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:

#### Tính năng mới:

- Ẩn hiện chức năng Tài chính/Bảo hiểm

#### Fix bug của topenland:

- Issue #68 mục 1. Box text trên banner bị rớt dòng, khoảng cách các block text quá cao

#### Fix bug khác:

- Fix bug đang bị crash app khi nhấn thanh toán sản phẩm bảo hiểm
- Fix bug chưa sync thông tin KHTN sang màn hình "Tạo hồ sơ mới"
- Fix bug UI form tìm kiếm đối tác ở step 2 màn hình "Chi tiết dịch vụ cộng thêm"

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Môi trường Production: sử dụng topenid-client-1.0.3.tgz
- Môi trường UAT: sử dụng topenid-client-1.0.9.tgz

```
"topenid-client": "file:topenid-client-1.0.3.tgz"
"topenid-client": "file:topenid-client-1.0.9.tgz"
```

## 1.0.7 (15:00 21/05/2022) - UAT/PROD

Important: Package này dùng cho cả topenland môi trường UAT/PROD.

### Các chức năng thay đổi/thêm mới:

#### Fix bug của topenland:

- Issue #66: Bug tên người thụ hưởng app tự nhảy sai
- Issue #68: Bug nội dung tư vấn pháp lý box text trên banner bị rớt dòng, khoảng cách các block text quá cao
- Issue #74: Bug hỗ trợ công chứng google map chưa load đúng địa chỉ

#### Fix bug khác:

- Bug UI đặt cọc hồ sơ
- Bug không gửi yêu cầu hoàn cọc được
- Bug UI banner các touchpoint
- Bug lưu file phiếu xác nhận dịch vụ
- Bug default check các hạng mục gửi yêu cầu nhanh theo thiết định portal
- Bug nhập thông tin người thụ hưởng bị autocomple trùng text
- Bug huỷ hồ sơ DVCT crash app

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Dependency:
  - topenid-client-1.0.9.tgz dùng cho (UAT)
  - topenid-client-1.0.3.tgz dùng cho (PROD)

```
 "topenid-client": "file:topenid-client-1.0.9.tgz"
 "topenid-client": "file:topenid-client-1.0.3.tgz"
```

## 1.0.6 (10:30 18/05/2022) - PROD

Important: Package này chỉ dùng cho topenland môi trường PROD.

### Các chức năng thay đổi/thêm mới:

- Issue #57: Fix bug API call bị lỗi 404
- Sử dụng topenid-client-1.0.3 (PROD) thay cho topenid-client-1.0.9 (UAT)

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Thay đổi topenid-client-1.0.9.tgz (UAT) thành topenid-client-1.0.3.tgz (PROD)

```
- "topenid-client": "file:topenid-client-1.0.9.tgz"
+ "topenid-client": "file:topenid-client-1.0.3.tgz"
```

## 1.0.5 (22:00 17/05/2022) - UAT

Important: Package này chỉ dùng cho topenland môi trường UAT.

### Các chức năng thay đổi/thêm mới:

- Issue #57: Fix bug API call bị lỗi 404
- Sử dụng topenid-client-1.0.9 (UAT) thay cho topenid-client-1.0.3 (PROD)

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Thay đổi topenid-client-1.0.3.tgz (PROD) thành topenid-client-1.0.9.tgz (UAT)

```
- "topenid-client": "file:topenid-client-1.0.3.tgz"
+ "topenid-client": "file:topenid-client-1.0.9.tgz"
```

## 1.0.4 (13:00 16/05/2022) - PROD

Important: Package này chỉ dùng cho topenland môi trường prod.

### Các chức năng thay đổi/thêm mới:

- Sử dụng topenid-client-1.0.3 (PROD) thay cho topenid-client-1.0.9 (UAT)

### Các thay đổi về cơ chế tích hợp (nếu có):

- Không thay đổi

### Các thay đổi về dependencies (nếu có):

- Thay đổi topenid-client-1.0.9.tgz (UAT) thành topenid-client-1.0.3.tgz (PROD)

```
- "topenid-client": "file:topenid-client-1.0.9.tgz"
+ "topenid-client": "file:topenid-client-1.0.3.tgz"

## 1.0.3 (23:52 29/04/2022)

### Các chức năng thay đổi/thêm mới:

- Thay đổi luồng DVCT

  - Thay đổi tên trên SDK. "Dịch vụ khác" thành "Dịch vụ cộng thêm"
  - Thay đổi cách hiển thị danh sách các dịch vụ trong SDK theo dạng có cấu trúc
  - Thay đổi flow chọn sản phẩm DVCT
  - Cập nhật lại thông tin trong form gửi yêu cầu DVCT
  - Bổ sung thông tin của đối tác ứng với từng sản phẩm DVCT
  - Thêm phương thức thanh toán offline cho DVCT
  - Xuất phiếu yêu cầu DVCT
  - Lịch hẹn của hồ sơ DVCT (Quản lý lịch hẹn cho hồ sơ DVCT, Trạng thái lịch hẹn)

- Nhận diện người dùng sử khi sử dụng SDK

  - Nhận diện người dùng truy cập vào SDK dạng Guest để xem sản phẩm
  - Quy trình nhận diện người dùng TPL trước khi tạo hồ sơ Tài chính - Bảo hiểm
  - Quy trình nhận diện người dùng TPL trước khi tạo hồ sơ DVCT
  - Nhận diện người dùng TPL cho các touch point khác
  - Cập nhật màn hình điều khoản sử dụng dịch vụ & chính sách bảo mật của SDK

- Update Color follow New Brand Guideline

### Các thay đổi về cơ chế tích hợp (nếu có):

- Cần listen thêm onRequestLogin cho trường hợp yêu cầu login khi Guest vào tạo hồ sơ cho các sản phẩm trong TPF Mobile SDK.
  - Tham khảo phần "Guest Flow" trang 13 của "TPF Mobile SDK User Manual_29042022.pdf"
  - Tham khảo sample code "TpfClientSample" trong TPF Mobile SDK package (path: TpfClientSample/App.js)

### Các thay đổi về dependencies (nếu có):

```
+ react-native-autoheight-webview: "^1.6.1",
+ react-native-maps: "0.30.1",
+ react-native-webview: "^11.18.1",
```
