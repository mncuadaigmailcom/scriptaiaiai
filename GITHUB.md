# GitHub trong Banana Cat Hub

`script.js` là **Luau cho Roblox**, không phải JavaScript. Các tab **Code, Code Đã Lưu, Hỗ Trợ, AI AI, Tạo Tính Năng** và công cụ cũ vẫn được giữ. Hai bản `script` và `scriptaiaiaiha` không thay đổi.

## Chọn đúng mục — không phải tìm trong một trang dài

Tab **🐙 GitHub** có bốn nút luôn nằm ở trên cùng:

| Mục | Dùng để làm gì? | Nút chọn file |
| --- | --- | --- |
| **1. Kết nối** | Nhập token, chọn kho/nhánh; đồng bộ chung, bật/tắt tự lưu | **Chọn kho từ danh sách**, **Chọn nhánh** |
| **2. Code đã lưu** | Lưu/lấy **cả danh sách script** trong một file JSON | **Chọn file JSON** / **File JSON mới** |
| **3. Tính năng** | Chọn tính năng trên máy, gửi vào file Lua riêng; lấy lại các tab | **Chọn file Lua** / **File Lua mới** |
| **4. Mã nguồn** | Lấy, xem, sửa, copy, gửi **một file code** | **Chọn file nguồn** / **File nguồn mới** |

Mỗi mục cuộn riêng. Dòng trên cùng hiển thị kho/nhánh đang dùng. Chạm thanh **ℹ thông báo** để đọc toàn bộ hướng dẫn hoặc lỗi, không bị cắt mất phần cuối.

> **JSON thư viện khác file mã nguồn.** Muốn giữ nhiều mục trong Code Đã Lưu và lấy lại tên từng mục: dùng mục 2. Muốn gửi một đoạn code thành `example.lua`, `script.js`…: dùng mục 4.

## 1. Kết nối một lần trong phiên

1. Mở **GitHub → 1. Kết nối**. Nhập Personal Access Token vào ô token, bấm **Kết nối**. **Không gửi token vào chat hoặc nhúng vào mã nguồn.**
2. Bấm **Chọn kho từ danh sách**, rồi chạm tên kho. Danh sách có lọc tên, phân trang và nút **✕** để đóng.
3. Bấm **Chọn nhánh**, rồi chạm nhánh cần dùng. Chọn kho sẽ dùng nhánh mặc định của kho.
4. Hoặc nhập `owner/repository` (cũng nhận `https://github.com/owner/repository`) và tên nhánh, rồi bấm **Dùng kho / nhánh này**. Để trống nhánh khi nhập thủ công sẽ lấy nhánh mặc định.
5. Mở mục **2**, **3** hoặc **4** để chọn file và gửi/lấy dữ liệu.

Kho cần có ít nhất một commit, ví dụ README, và nhánh cần tồn tại. Bước kết nối/chọn đích **không tự ghi file**.

### Quyền token

- **Fine-grained PAT**: chọn đúng kho, cấp **Contents: Read and write** và quyền đọc Metadata. Tổ chức có thể yêu cầu phê duyệt/SSO.
- **PAT cổ điển `ghp_`**: `public_repo` cho kho công khai, hoặc `repo` cho kho riêng. Ưu tiên quyền tối thiểu.
- Không cần quyền xóa kho, quản trị kho hoặc ép ghi nhánh.
- Nút **Hướng dẫn quyền token** trong hub mở giải thích đầy đủ.
- Nên dùng kho riêng cho code cá nhân. Người có quyền đọc kho có thể đọc nội dung bạn gửi.

## 2. Code đã lưu — chọn một file JSON chứa cả danh sách

### File có sẵn

1. Bấm **Chọn file JSON**.
2. Chạm thư mục để mở; nút **↑** lên thư mục cha. Có thể nhập thư mục rồi bấm **↻**; để trống để xem gốc kho.
3. Chạm file `.json`, kiểm tra đường dẫn trong ô phía dưới, bấm **Dùng file này**.
4. Bấm **Lấy Code đã lưu** để kiểm tra/nhập thư viện hiện có trước lần gửi đầu tiên trong phiên.
5. Bấm **Gửi Code đã lưu** → xem kế hoạch → **Xác nhận ghi GitHub**.

### File mới

Bấm **File JSON mới**, nhập đường dẫn đầy đủ tính từ gốc kho, ví dụ `banana-cat/saved-code.json`, rồi **Dùng file này**. Hoặc nhập trực tiếp ô **File lưu chung trên GitHub** và bấm **Dùng file JSON này**. File/thư mục chỉ được tạo sau khi **Gửi** và **Xác nhận**.

File có sẵn phải đúng định dạng `banana-cat-hub/scripts` v1; không dùng `package.json` hoặc JSON của ứng dụng khác. Nút **Xem nội dung file JSON trên GitHub** mở bản văn bản ở mục 4 để đọc, không cho ghi mã thô đè lên JSON quản lý.

**Muốn gửi riêng một script?** Bấm **Chọn script để xem / gửi mã riêng**, chọn tên script. Mã sẽ mở ở mục 4 cùng tên file Lua gợi ý; bản trong Code Đã Lưu không bị xóa hay chuyển đi.

## 3. Tính năng — chọn tính năng và file Lua riêng

1. Bấm **Chọn tính năng trên máy** (nếu đã chọn, nút hiển thị **Đang chọn: tên ▾**). Chạm tên trong danh sách. Chưa có tính năng thì tạo bằng tab **Tạo Tính Năng** như trước.
2. Bấm **Chọn file Lua** để chọn file có sẵn, hoặc **File Lua mới** để nhập tên mới.
3. Tên file tính **tương đối với thư mục tính năng**: `auto-farm.lua` hoặc `tools/esp.luau`. Bấm **Dùng file này**. Nếu gõ trực tiếp vào ô **File Lua của tính năng đang chọn**, bấm **Đặt tên file**.
4. Bấm **Gửi tính năng này** → xem file được tạo/cập nhật → **Xác nhận ghi GitHub**.

Chọn file có sẵn sẽ đọc/kiểm tra đích và **tắt tự lưu**, không thay code trên máy hoặc ghi GitHub ngay. Có thể bấm **Lấy mã file đã chọn** để xem nội dung từ xa trước khi quyết định gửi. Hai tính năng không được dùng cùng một file. Đổi tên file **không xóa file cũ**.

Các nút khác vẫn có:

- **Gửi tất cả tính năng** / **Lấy các tính năng về**: lưu hoặc khôi phục toàn bộ thư viện tính năng, gồm tên, icon và mã của từng tab.
- **Xem mã bản máy**: mở bản sao mã của tính năng ở mục 4; sửa bản nháp này không tự sửa tab gốc.
- **Tạo tính năng từ một file GitHub**: chọn file nguồn → **Chọn và lấy mã**; hub tải và thêm một tab mới, **không chạy mã** và không xóa tab cũ.
- **Chọn thư mục**: duyệt đến thư mục rồi **Dùng thư mục này**, hoặc nhập đường dẫn mới ở ô phía dưới cửa sổ chọn. Cũng có thể gõ ở màn hình chính rồi bấm **Dùng thư mục này**. Mặc định: `banana-cat/features`.

Ví dụ cấu trúc kho:

```text
banana-cat/
├── saved-code.json          # Cả danh sách Code Đã Lưu
└── features/
    ├── index.json           # ID, tên, icon, đường dẫn file của các tính năng
    ├── auto-farm.lua        # Mã của một tính năng
    └── tools/esp.luau       # Mã của tính năng khác
scripts/
└── example.lua              # Một file mã riêng, gửi từ mục 4
```

Giữ `index.json` để lấy lại thư viện/tên/icon đúng cách. Với thư viện tính năng đã có, **Lấy các tính năng về** trước lần gửi đầu tiên. Chỉ chọn một file Lua không thay thế bước nạp `index.json`.

## 4. Mã nguồn — lấy và gửi code trực tiếp

### Lấy mã từ GitHub

Bấm **Chọn file nguồn**, duyệt/chọn file, rồi **Chọn và lấy mã**. Hoặc nhập đường dẫn tính từ gốc kho như `script.js` và bấm **Lấy mã từ GitHub**.

Mã hiển thị trong ô có thể cuộn và chỉnh sửa. Hỗ trợ file văn bản UTF-8 như `.lua`, `.luau`, `.js`, `.txt`…; đuôi file không quyết định ngôn ngữ thực thi. Hub này cũng là Luau mang đuôi `.js`.

### Gửi mã lên GitHub

- **File mới**: bấm **File nguồn mới**, nhập đường dẫn → **Dùng file này**; dán code vào ô → **Gửi mã lên GitHub** → **Xác nhận ghi GitHub**.
- **Sửa file có sẵn**: **Lấy mã từ GitHub** trước, sửa nội dung, rồi **Gửi mã lên GitHub** và xác nhận. Nếu GitHub đã có thay đổi mới, thao tác ghi bị chặn; lấy lại để kiểm tra trước khi thử tiếp.
- Kế hoạch xác nhận mở ngay trên màn hình, ghi rõ kho, nhánh và từng file tạo/cập nhật. **Hủy kế hoạch** không gửi thao tác ghi.
- Không cho gửi mã thô đè lên JSON thư viện hoặc `index.json` đang được hub quản lý. Dùng mục 2/3 để đồng bộ những file đó.

### Dùng mã mà không làm mất bản cũ

- **Sao chép mã**: copy toàn bộ nội dung; nếu môi trường không hỗ trợ clipboard, chọn mã để bạn copy thủ công.
- **Lấy từ ô Code**: đưa code từ tab Code cũ vào mục 4 để gửi thành file riêng.
- **Nhập vào Code Đã Lưu** / **Nhập thành tính năng**: thêm mục/tab mới, không thay thế danh sách cũ.
- **Đưa mã vào ô Code (không chạy)**: mở ở trình soạn thảo cũ. Nếu ô Code đang có nháp khác, nháp được giữ trong Code Đã Lưu trước khi thay.
- Khi lấy/mở mã khác, nháp chưa gửi của mục 4 được giữ trong **Code Đã Lưu** với tên `Nháp GitHub - ...` nếu chưa có bản cùng nội dung. Nháp này vẫn chỉ ở phiên hiện tại, trừ khi bạn lưu/gửi dự phòng.
- Nếu bạn sửa ô mã/đường dẫn trong lúc đang tải, kết quả tải cũ không đè lên phần bạn vừa sửa.
- Tải/nhập mã **không tự chạy**. Chỉ dùng nút Chạy ở các tab cũ sau khi đã đọc và tin tưởng code; không có sandbox cho mã đó.

## Đồng bộ chung và tự lưu từ các nút cũ

Trong **1. Kết nối**, **Gửi cả hai** / **Lấy cả hai** xử lý cả thư viện script lẫn tính năng.

**Tự lưu khi thêm / sửa** mặc định **TẮT**. Sau khi chọn đích, lấy thư viện cũ nếu có, có thể bật để tự gửi khi:

- **Lưu Vào Danh Sách** trong tab Code hoặc **Lưu Vào DS** ở tab tính năng.
- Dùng **AutoSize** để lưu code vào danh sách.
- Tạo hoặc áp dụng chỉnh sửa tính năng; nhập một file mã riêng thành script/tính năng.

Thao tác gần nhau được gộp sau khoảng **1,2 giây**. Bật tự lưu là cho phép tạo commit cho những thay đổi này, không hỏi xác nhận từng lần. **Nháp mã nguồn ở mục 4 không tự gửi**; vẫn cần Gửi và Xác nhận.

Đổi kho, nhánh, đường dẫn thư viện hoặc tên file tính năng sẽ **tắt tự lưu**; áp dụng đích bằng nút tương ứng rồi chủ động bật lại nếu muốn. Lỗi mạng/quyền/xung đột cũng tắt tự lưu. Không tự bật lại sau khi khởi động lại hub.

## Chống mất dữ liệu

- Gửi nhiều file bằng Git Data API và cập nhật nhánh **một lần trong một commit**, không công bố từng phần.
- Cây file mới dựa trên cây cũ; giữ file không liên quan. Không cho biến file/link thành thư mục để ghi xuyên qua.
- Không force push, không gọi API DELETE. Chọn file/thư mục không tự ghi hay xóa file.
- Thư viện được tải/kiểm tra đầy đủ trước khi nhập; file sai định dạng hoặc thiếu mã tính năng làm toàn bộ lượt nhập bị từ chối.
- Nhập thư viện là **gộp**. Cùng ID nhưng khác dữ liệu thì giữ bản máy và thêm bản GitHub với tên riêng; nhập lại cùng thư viện không nhân bản vô hạn. Các tab đang chạy không bị hủy do nhập.
- Thay đổi từ xa hoặc nhánh đổi sau khi lập kế hoạch làm ghi bị chặn; không ép đè. Chọn lại/lấy lại rồi kiểm tra kế hoạch mới.
- Mã nguồn và thư viện có bộ kiểm tra phiên bản riêng: xem/sửa file Lua ở mục 4 không âm thầm cho phép tự lưu thư viện đè ngược bản mã vừa sửa. Nếu sửa mã tính năng qua mục 4, lấy lại thư viện ở mục 3 trước khi đồng bộ tiếp.
- **Xóa script/tab trên máy không xóa bản GitHub**. Những mục từ xa vắng trên máy vẫn được giữ khi gửi; có thể xuất hiện lại khi lấy thư viện.
- GitHub giữ lịch sử commit. Đừng thoát hub khi code/nháp chưa gửi hoặc đang lỗi, trừ khi đã sao chép dự phòng.
- Yêu cầu đã gửi có thể hoàn tất sau khi ngắt/tắt tự lưu/hủy GUI. Nếu kết quả không rõ, kiểm tra GitHub hoặc lấy lại trước khi thử tiếp.

## Token, cấu hình và giới hạn môi trường

- PAT chỉ ở bộ nhớ phiên; không ghi vào `_G`, file cấu hình hay JSON thư viện. Ô token che khi mất focus và được xóa sau khi kết nối.
- Token chỉ trong header `Authorization` tới `https://api.github.com`, không trong query URL hoặc thông báo lỗi transport.
- **Ngắt / Xóa token** hoặc hủy GUI sẽ bỏ phiên. Chạy lại hub cần nhập token lại.
- Nếu có `writefile`, cấu hình không chứa bí mật được lưu trong `banana_cat_github_settings.json`: phiên bản, kho, nhánh, đường dẫn JSON và thư mục tính năng. Không lưu nội dung nháp/token trong file cấu hình.
- Cơ chế API key Gemini cũ không thay đổi.
- Ưu tiên `request`, `http_request`, `syn.request`, `http.request`, rồi `HttpService:RequestAsync`. Cần HTTPS request hỗ trợ Authorization.
- LocalScript Roblox tiêu chuẩn không tự có quyền HTTP/server hoặc API executor. Trải nghiệm Roblox thông thường cần thiết kế backend và quản lý bí mật phù hợp; tab GitHub không vượt giới hạn nền tảng.
- Giới hạn: **900 KiB/file**, **200 mục/danh sách**, **4 MiB/lần lưu hoặc nhập thư viện**. Từ chối đường dẫn `..`, dữ liệu không phải UTF-8, ID/file trùng và file quá lớn.
- Contents API hiển thị tối đa 1.000 mục/thư mục; vẫn có thể nhập đường dẫn chính xác. Danh sách kho/nhánh phân trang 100 mục.

## Kiểm tra dành cho người phát triển

Test trích **đúng code nhúng trong `script.js`**. HTTP, filesystem, Roblox Instances/events và scheduler đều được mô phỏng; không dùng token thật, không truy cập GitHub, không chạy mã tải về.

```bash
python3 tests/run_tests.py \
  --luau /path/to/luau \
  --compiler /path/to/luau-compile
```

Cũng có thể dùng `LUAU_BIN` / `LUAU_COMPILE_BIN` hoặc đặt CLI trong PATH. `--compiler` là tùy chọn; nếu có sẽ biên dịch toàn bộ hub.

Đã kiểm tra bằng Luau 0.738: **41 test storage/API + 45 test UI/luồng cũ**. Bao gồm bố trí bốn trang, picker kho/nhánh/JSON/Lua/mã nguồn, preview/xác nhận, gửi/lấy Unicode, giữ nháp, không thực thi mã, xung đột, PAT, tự lưu và các thao tác lưu/tạo/sửa/chuyển tab cũ. **Chưa kiểm thử trực quan hoặc kết nối thật trong Roblox/executor**; mock kiểm tra wiring/logic, không phải bộ dựng hình Roblox.

Nguồn giữ CRLF. Kiểm tra whitespace bằng:

```bash
git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check
```
