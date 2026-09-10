-- ============================================================
-- KIỂM TRA DELTA: dán TOÀN BỘ file này vào Delta rồi Execute trong game
-- Nếu hiện khung xanh "DELTA HIỆN GUI OK" => Delta bình thường,
--    vấn đề nằm ở link loadstring / cách tải script chính.
-- Nếu KHÔNG hiện gì => Delta chưa attach đúng / lỗi Delta / game chặn GUI.
--    Hãy: rejoin game, đợi load xong, mở Delta attach lại rồi Execute.
-- Khung test tự biến mất sau 10 giây.
-- ============================================================

local Players = game:GetService("Players")

local player = Players.LocalPlayer
local tries = 0
while not player and tries < 40 do
    task.wait(0.25)
    tries = tries + 1
    player = Players.LocalPlayer
end
if not player then
    warn("⛔ Chưa có LocalPlayer, hãy vào hẳn trong game rồi Execute lại!")
    return
end

local playerGui = player:WaitForChild("PlayerGui", 10)
if not playerGui then
    warn("⛔ Không tìm thấy PlayerGui, hãy Execute lại!")
    return
end

local ok, hui = pcall(function()
    if gethui then
        return gethui()
    end
    return nil
end)
local target = (ok and hui) or playerGui
print("🔍 Test GUI parent:", target:GetFullName())

local old = target:FindFirstChild("DeltaGuiTest")
if old then
    old:Destroy()
end

local g = Instance.new("ScreenGui")
g.Name = "DeltaGuiTest"
g.ResetOnSpawn = false
g.IgnoreGuiInset = true
g.DisplayOrder = 999
g.Parent = target

local t = Instance.new("TextLabel")
t.Size = UDim2.new(0, 320, 0, 90)
t.Position = UDim2.new(0.5, -160, 0.4, -45)
t.BackgroundColor3 = Color3.fromRGB(0, 170, 90)
t.TextColor3 = Color3.fromRGB(255, 255, 255)
t.TextSize = 20
t.Font = Enum.Font.GothamBold
t.Text = "✅ DELTA HIỆN GUI OK"
t.Parent = g

print("✅ Test GUI đã chạy, nếu bạn đọc được dòng này mà không thấy khung xanh thì GUI đang bị che/xóa.")

task.delay(10, function()
    pcall(function()
        g:Destroy()
    end)
end)
