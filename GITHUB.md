# Tab GitHub trong Banana Cat Hub

`script.js` vẫn là một file **Luau cho Roblox**, không phải JavaScript. Bản bổ sung giữ các tab Code, Code Đã Lưu, Hỗ Trợ, AI AI, Tạo Tính Năng và thêm tab **🐙 GitHub**. Hai file cũ `script` và `scriptaiaiaiha` không thay đổi.

## Bắt đầu

1. Mở hub → **GitHub**. Nhập Personal Access Token trong ô `ghp_...` hoặc `github_pat_...`, rồi bấm **Kết nối**. Không gửi token vào chat hoặc dán token vào mã nguồn.
2. Chọn kho từ danh sách có phân trang, hoặc nhập `owner/repository`. Có thể nhập URL `https://github.com/owner/repository`.
3. Chọn nhánh có sẵn. Chọn hoặc nhập đường dẫn:
   - **File Code Đã Lưu**: mặc định `banana-cat/saved-code.json`.
   - **Thư mục tính năng**: mặc định `banana-cat/features`.
4. Bấm **Áp dụng kho / nhánh / đường dẫn**. Kho phải có ít nhất một commit (ví dụ tạo README trên GitHub trước).
5. Nếu đã có thư viện trong kho, bấm **Nhập cả hai** trước khi ghi. Mọi dữ liệu được đọc/kiểm tra trước khi nhập; code tải về **không tự thực thi**.
6. Bấm **Lưu Code**, **Lưu tính năng** hoặc **Lưu cả hai**, xem kho/nhánh và các file trong kế hoạch, rồi bấm **Xác nhận ghi GitHub**.

### Quyền token

- **Fine-grained PAT**: chọn đúng các kho cần truy cập, cấp **Contents: Read and write**. Metadata cần quyền đọc. Token có thể cần được tổ chức phê duyệt.
- **PAT cổ điển `ghp_`**: `public_repo` cho kho công khai hoặc `repo` cho kho riêng; ưu tiên quyền tối thiểu. Tổ chức có SSO có thể yêu cầu cấp quyền SSO riêng.
- Không cần cấp quyền xóa kho, quản trị kho hoặc ép ghi nhánh.
- Nên dùng kho riêng nếu code chứa dữ liệu cá nhân. Mọi người có quyền đọc kho đều có thể đọc code được lưu.

## Lưu vào một file / nhiều file

Ví dụ cấu trúc kho:

```text
banana-cat/
├── saved-code.json              # Tất cả mục Code Đã Lưu
└── features/
    ├── index.json               # ID, tên, icon và tên file của từng tính năng
    ├── toa-do-<id>.lua           # Code đầy đủ của một tính năng
    ├── ghi-chu-<id>.lua          # Code của tính năng khác
    └── tools/
        └── tuy-chon.luau        # Có thể tự đặt tên/thư mục con
```

Trong mục **Đặt file riêng cho từng tính năng**:

1. Chọn tính năng đã tạo.
2. Nhập tên file tương đối, ví dụ `toa-do.lua` hoặc `tools/tuy-chon.luau`.
3. Bấm **Đặt tên file**.
4. Bấm **Lưu tính năng đã chọn** hoặc **Lưu tính năng** để lưu tất cả.

Tên mặc định gồm tên rút gọn và ID ổn định, tránh trùng file. Hai tính năng không được dùng cùng một file. `index.json` cần được giữ để khôi phục tên/icon/tab đúng cách. Đổi tên file tạo đường dẫn mới; file cũ không tự bị xóa.

### Tự lưu từ các nút cũ

**Tự lưu khi thêm / sửa** mặc định **TẮT**. Sau khi áp dụng đích và nhập thư viện cũ, có thể bật để tự ghi GitHub khi:

- Bấm **Lưu Vào Danh Sách** trong tab Code.
- Bấm **Lưu Vào DS** trong một tab tính năng.
- Dùng nút **AutoSize** để lưu code vào danh sách.
- Tạo hoặc áp dụng chỉnh sửa tính năng.
- Đặt lại tên file của tính năng.
- Nhập một file code riêng vào thư viện.

Các thay đổi gần nhau được gộp sau khoảng **1,2 giây**. Tự lưu là sự cho phép tạo commit cho các thao tác này, không hỏi xác nhận từng lần. Nếu gặp xung đột, thiếu quyền hoặc lỗi mạng, tự lưu sẽ tắt để tránh gửi lặp; dữ liệu bản máy vẫn được giữ.

Đổi kho, nhánh hoặc đường dẫn tạm tắt tự lưu và yêu cầu bấm **Áp dụng** lại, tránh lưu nhầm nơi. Tự lưu không tự bật lại sau khi khởi động lại hub.

## Duyệt và nhập file có sẵn

- Trong phần duyệt kho: chạm thư mục để mở, **Lên thư mục** để quay lại, **Dùng thư mục** để chọn thư mục tính năng.
- Chạm file `.json` để điền đường dẫn thư viện Code, rồi **Áp dụng** và **Nhập Code**. File này phải đúng định dạng thư viện của hub; không dùng `package.json` hoặc JSON của ứng dụng khác.
- Chạm file Lua hoặc tự nhập đường dẫn tại **Nhập code từ một file có sẵn**. Chọn **Nhập vào Code Đã Lưu** hoặc **Nhập thành tính năng**.
- Nhập thư viện là thao tác **gộp**, không xóa toàn bộ danh sách hiện tại. Nếu cùng ID nhưng khác code, hub giữ bản máy và thêm bản GitHub với tên riêng khi cần. Nhập lặp lại cùng dữ liệu không tạo thêm bản sao.
- Chỉ bấm **Chạy** nếu đã đọc và tin tưởng code. Tích hợp GitHub không tạo sandbox cho code của các tính năng.

## Chống mất dữ liệu

- Lưu nhiều file bằng Git Data API và cập nhật nhánh **một lần**, trong một commit. Không công bố từng file riêng lẻ.
- Cây file mới dựa trên cây cũ, giữ file không liên quan. Đường dẫn không được đi xuyên qua một file/link hoặc biến một file khác thành thư mục.
- Không dùng force push và không gọi API DELETE.
- File quản lý đã tồn tại cần được **Nhập** trước lần ghi đầu tiên trong phiên. Nếu file đổi từ xa sau khi nạp, ghi bị chặn và yêu cầu nạp lại.
- Nếu nhánh có commit mới giữa lúc xem kế hoạch và xác nhận, lưu bị chặn; không ép ghi đè. Hãy nhập lại/lập kế hoạch mới.
- Dữ liệu sai định dạng, thiếu file tính năng, trùng ID/file, đường dẫn `..`, file quá lớn và dữ liệu không phải UTF-8 đều bị từ chối.
- **Xóa script/tab trên máy không xóa bản trên GitHub.** Lần lưu tiếp theo vẫn giữ những mục từ xa không còn trong danh sách máy. Muốn xóa vĩnh viễn, cần chủ động chỉnh thư viện trong GitHub; mục còn trên GitHub sẽ xuất hiện lại khi nhập.
- Lịch sử commit GitHub vẫn giữ các phiên bản trước. Thay đổi chưa lưu/đang lỗi chỉ ở phiên hiện tại: đừng thoát hub trước khi có thông báo lưu thành công hoặc đã sao chép dự phòng.
- Yêu cầu mạng đã được gửi có thể hoàn tất ngay cả sau khi bấm ngắt/tắt tự lưu. Nếu kết quả không rõ, kiểm tra kho hoặc nạp lại trước khi thử tiếp.

## Token, cấu hình và môi trường

- PAT GitHub chỉ ở bộ nhớ phiên; không ghi vào `_G`, file cấu hình, JSON thư viện hay mã nguồn. Ô nhập che bản nháp khi mất focus và được xóa sau khi kết nối.
- Token chỉ đi trong header `Authorization` của request tới `https://api.github.com`; không đưa vào query URL hoặc thông báo lỗi transport.
- Bấm **Ngắt / Xóa token** hoặc hủy GUI để bỏ phiên kết nối. Sau khi chạy lại hub cần nhập token lại.
- Nếu có `writefile`, chỉ cấu hình không chứa bí mật được lưu vào `banana_cat_github_settings.json`: phiên bản, kho, nhánh, đường dẫn JSON và thư mục tính năng. Nếu thiếu quyền ghi file thì cần chọn lại cấu hình ở phiên sau.
- Cơ chế API key Gemini cũ không thay đổi bởi tính năng này.
- Cần môi trường có HTTPS request hỗ trợ header Authorization. Hub ưu tiên `request`, `http_request`, `syn.request`, `http.request`, rồi mới thử `HttpService:RequestAsync`.
- LocalScript Roblox tiêu chuẩn không tự có quyền HTTP/server hoặc các API executor. Với một trải nghiệm Roblox thông thường, cần thiết kế backend/server và quản lý thông tin bí mật phù hợp; tab này không vượt các giới hạn nền tảng.
- Các giới hạn bảo vệ hiện tại: **900 KiB/file**, **200 mục/danh sách**, **4 MiB/lần lưu hoặc nhập**. Trình duyệt dùng Contents API, tối đa 1.000 mục/thư mục; vẫn có thể nhập đường dẫn chính xác trực tiếp. Danh sách kho/nhánh có phân trang 100 mục.

## Kiểm tra dành cho người phát triển

Các test lấy **đúng phần code nhúng trong `script.js`**, không dùng một bản triển khai GitHub khác. HTTP, filesystem, Roblox Instances/events và scheduler được mô phỏng; không dùng token thật, không truy cập GitHub, không chạy code nhập từ kho.

Cần Python 3 và công cụ Luau chính thức:

```bash
python3 tests/run_tests.py \
  --luau /path/to/luau \
  --compiler /path/to/luau-compile
```

Có thể dùng biến môi trường `LUAU_BIN` / `LUAU_COMPILE_BIN` hoặc đặt hai công cụ trong PATH. `--compiler` là tùy chọn; nếu có sẽ kiểm tra biên dịch toàn bộ hub.

Phạm vi: 31 test storage/API và 24 test UI/luồng cũ, gồm lưu nguyên tử, nhập Unicode, xung đột, lỗi mạng/quyền, PAT che/hiện, tự lưu, hủy kế hoạch, dọn phiên, và chuyển tab sau khi xóa. Đã kiểm tra bằng Luau 0.738. **Chưa kiểm thử trực quan hoặc kết nối trên Roblox/executor thực tế.**

Nguồn gốc dùng CRLF; khi kiểm tra whitespace bằng git:

```bash
git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check
```
