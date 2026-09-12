--[[
    🍌 Banana Cat Hub v4.3 — FULL CODE
    + THÊM: Highlight viền tím khi click vật thể (dùng Highlight instance)
    + THÊM: Tự động xóa highlight cũ khi click vật mới
    + THÊM: Nút bật/tắt highlight
    + THÊM: Tab GitHub — chọn kho/nhánh/file, lưu và nhập thư viện, PAT chỉ giữ trong RAM
    + GIỮ NGUYÊN toàn bộ tính năng cũ
--]]
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local camera = workspace.CurrentCamera

local targetGui = playerGui
pcall(function()
    if gethui then
        local hui = gethui()
        if hui then targetGui = hui end
    elseif game:GetService("CoreGui") then
        targetGui = game:GetService("CoreGui")
    end
end)

if _G.BananaCatHub_Connections then
    for _, c in ipairs(_G.BananaCatHub_Connections) do
        pcall(function() c:Disconnect() end)
    end
end
_G.BananaCatHub_Connections = {}

local function trackConn(conn)
    table.insert(_G.BananaCatHub_Connections, conn)
    return conn
end

pcall(function() RunService:UnbindFromRenderStep("Fly") end)
pcall(function() RunService:UnbindFromRenderStep("Carpet") end)

local C = {
    WHITE = Color3.fromRGB(255, 255, 255),
    DARK = Color3.fromRGB(40, 40, 45),
    GRAY = Color3.fromRGB(110, 115, 125),
    GREEN = Color3.fromRGB(0, 170, 90),
    BLUE = Color3.fromRGB(0, 130, 220),
    RED = Color3.fromRGB(220, 60, 60),
    YELLOW = Color3.fromRGB(255, 200, 0),
    PURPLE = Color3.fromRGB(160, 60, 255),
    ORANGE = Color3.fromRGB(220, 130, 50),
    PINK = Color3.fromRGB(230, 100, 180),
    BG = Color3.fromRGB(240, 242, 248),
}

local function New(cls, props, parent)
    local obj = Instance.new(cls)
    for k, v in pairs(props or {}) do
        obj[k] = v
    end
    if parent then obj.Parent = parent end
    return obj
end

local function Corner(p, r)
    return New("UICorner", {CornerRadius = r or UDim.new(0, 8)}, p)
end

local function Stroke(p, c, t)
    return New("UIStroke", {Color = c or Color3.fromRGB(170, 175, 190), Thickness = t or 1.2}, p)
end

local function Tween(o, p, d, e)
    TweenService:Create(o, TweenInfo.new(d or 1.5, e or Enum.EasingStyle.Quad), p):Play()
end

if targetGui:FindFirstChild("ExMenu") then
    targetGui.ExMenu:Destroy()
end

local gui = New("ScreenGui", {
    Name="ExMenu",
    IgnoreGuiInset=true,
    ResetOnSpawn=false,
    ZIndexBehavior=Enum.ZIndexBehavior.Sibling,
}, targetGui)

local togBtn = New("TextButton", {
    Size=UDim2.new(0,48,0,48),
    Position=UDim2.new(1,-60,1,-60),
    Text="🍌",
    BackgroundColor3=C.WHITE,
    BackgroundTransparency=0.1,
    TextColor3=C.DARK,
    Font=Enum.Font.GothamBold,
    TextSize=24,
    BorderSizePixel=0,
    ZIndex=1000,
}, gui)
Corner(togBtn, UDim.new(1,0))
Stroke(togBtn, C.BLUE, 2)

local main = New("Frame", {
    Size=UDim2.new(0,540,0,340),
    Position=UDim2.new(0.5,-270,0.5,-170),
    BackgroundColor3=Color3.fromRGB(235, 238, 245),
    BackgroundTransparency=0.25,
    BorderSizePixel=0,
    Visible=false,
    ClipsDescendants=false,
    ZIndex=2,
}, gui)
Corner(main, UDim.new(0,10))
Stroke(main, Color3.fromRGB(180,185,200), 2)

local bgPattern = New("ImageLabel", {
    Name = "CheckeredBG",
    Size = UDim2.new(1, 0, 1, 0),
    Position = UDim2.new(0, 0, 0, 0),
    BackgroundTransparency = 1,
    Image = "rbxassetid://9822602710",
    ScaleType = Enum.ScaleType.Tile,
    TileSize = UDim2.new(0, 20, 0, 20),
    ImageTransparency = 0.82,
    ImageColor3 = Color3.fromRGB(150, 160, 185),
    ZIndex = 2,
}, main)
Corner(bgPattern, UDim.new(0, 10))

local titleBar = New("Frame", {
    Size=UDim2.new(1,0,0,30),
    BackgroundColor3=Color3.fromRGB(225,230,240),
    BackgroundTransparency=0.2,
    BorderSizePixel=0,
    ZIndex=3,
}, main)
Corner(titleBar, UDim.new(0,10))

New("TextLabel", {
    Size=UDim2.new(1,-90,1,0),
    Position=UDim2.new(0,12,0,0),
    Text="🍌 Banana Cat Executor Hub v4.3",
    BackgroundTransparency=1,
    TextColor3=C.DARK,
    Font=Enum.Font.GothamBold,
    TextSize=13,
    TextXAlignment=Enum.TextXAlignment.Left,
    ZIndex=4,
}, titleBar)

local dragLockBtn = New("TextButton", {
    Size=UDim2.new(0,30,0,30),
    Position=UDim2.new(1,-64,0,0),
    Text="🔒",
    BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(120,120,130),
    Font=Enum.Font.GothamBold,
    TextSize=15,
    BorderSizePixel=0,
    ZIndex=4,
}, titleBar)

local closeBtn = New("TextButton", {
    Size=UDim2.new(0,30,0,30),
    Position=UDim2.new(1,-32,0,0),
    Text="✕",
    BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(120,120,130),
    Font=Enum.Font.GothamBold,
    TextSize=15,
    BorderSizePixel=0,
    ZIndex=4,
}, titleBar)

local minW, minH = 440, 260

local function SetupResizeHandle(btn, cornerType)
    local resizing, sizeStart, posStart, inputStart
    trackConn(btn.InputBegan:Connect(function(i)
        if i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch then
            resizing=true
            sizeStart=main.Size
            posStart=main.Position
            inputStart=i.Position
        end
    end))
    trackConn(UserInputService.InputChanged:Connect(function(i)
        if resizing and sizeStart and posStart and inputStart and (i.UserInputType==Enum.UserInputType.MouseMovement or i.UserInputType==Enum.UserInputType.Touch) then
            local d = i.Position - inputStart
            local w, h = sizeStart.X.Offset, sizeStart.Y.Offset
            local posX, posY = posStart.X.Offset, posStart.Y.Offset
            local newW, newH = w, h
            local newX, newY = posX, posY
            if cornerType == "BR" then
                newW = math.max(minW, w + d.X)
                newH = math.max(minH, h + d.Y)
            elseif cornerType == "BL" then
                newW = math.max(minW, w - d.X)
                newH = math.max(minH, h + d.Y)
                newX = posX + (w - newW)
            elseif cornerType == "TR" then
                newW = math.max(minW, w + d.X)
                newH = math.max(minH, h - d.Y)
                newY = posY + (h - newH)
            elseif cornerType == "TL" then
                newW = math.max(minW, w - d.X)
                newH = math.max(minH, h - d.Y)
                newX = posX + (w - newW)
                newY = posY + (h - newH)
            end
            main.Size = UDim2.new(sizeStart.X.Scale, newW, sizeStart.Y.Scale, newH)
            main.Position = UDim2.new(posStart.X.Scale, newX, posStart.Y.Scale, newY)
        end
    end))
    trackConn(UserInputService.InputEnded:Connect(function(i)
        if i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch then
            resizing=false
        end
    end))
end

local function CreateHandle(icon, pos)
    local btn = New("TextButton", {
        Size=UDim2.new(0,20,0,20),
        Position=pos,
        Text=icon,
        BackgroundColor3=C.BLUE,
        BackgroundTransparency=0.1,
        TextColor3=C.WHITE,
        Font=Enum.Font.GothamBold,
        TextSize=11,
        BorderSizePixel=0,
        ZIndex=100,
    }, main)
    Corner(btn, UDim.new(0,5))
    Stroke(btn, Color3.fromRGB(255,255,255), 1.2)
    return btn
end

local handleTL = CreateHandle("↖", UDim2.new(0, 2, 0, 2))
local handleTR = CreateHandle("↗", UDim2.new(1, -22, 0, 2))
local handleBL = CreateHandle("↙", UDim2.new(0, 2, 1, -22))
local handleBR = CreateHandle("↘", UDim2.new(1, -22, 1, -22))

SetupResizeHandle(handleTL, "TL")
SetupResizeHandle(handleTR, "TR")
SetupResizeHandle(handleBL, "BL")
SetupResizeHandle(handleBR, "BR")

local tabs = {}
local tabContent = {}

local tabBar = New("ScrollingFrame", {
    Size=UDim2.new(0,105,1,-30),
    Position=UDim2.new(1,-105,0,30),
    BackgroundColor3=Color3.fromRGB(225,230,240),
    BackgroundTransparency=0.3,
    BorderSizePixel=0,
    ZIndex=3,
    ScrollBarThickness=3,
    CanvasSize=UDim2.new(0,0,0,0),
}, main)

New("UIListLayout", {
    FillDirection=Enum.FillDirection.Vertical,
    SortOrder=Enum.SortOrder.LayoutOrder,
    Padding=UDim.new(0,4),
}, tabBar)

New("UIPadding", {PaddingTop=UDim.new(0,6), PaddingLeft=UDim.new(0,4)}, tabBar)

local contentArea = New("Frame", {
    Size=UDim2.new(1,-105,1,-30),
    Position=UDim2.new(0,0,0,30),
    BackgroundTransparency=1,
    BorderSizePixel=0,
    ZIndex=3,
    ClipsDescendants=true,
}, main)

local activeTab = nil

local function SwitchTab(index)
    for _, t in ipairs(tabContent) do t.Visible = false end
    for _, b in ipairs(tabs) do
        b.BackgroundColor3 = C.BG
        b.BackgroundTransparency = 0.3
    end
    if tabContent[index] and tabs[index] then
        tabContent[index].Visible = true
        tabs[index].BackgroundColor3 = C.BLUE
        tabs[index].BackgroundTransparency = 0.2
        activeTab = tabContent[index]
    end
end

local function AddTab(name, icon, order, customContent)
    local btn = New("TextButton", {
        Size=UDim2.new(1,-8,0,30),
        Text=icon.." "..name,
        BackgroundColor3=C.BG,
        BackgroundTransparency=0.3,
        TextColor3=C.DARK,
        Font=Enum.Font.GothamBold,
        TextSize=9,
        BorderSizePixel=0,
        LayoutOrder=order,
        TextXAlignment=Enum.TextXAlignment.Left,
        ZIndex=4,
    }, tabBar)
    Corner(btn, UDim.new(0,6))

    local sf
    if customContent then
        sf = customContent
        sf.Parent = contentArea
        sf.Visible = false
    else
        sf = New("ScrollingFrame", {
            Size=UDim2.new(1,0,1,0),
            BackgroundTransparency=1,
            BorderSizePixel=0,
            ScrollBarThickness=5,
            ScrollBarImageColor3=Color3.fromRGB(120,120,140),
            ClipsDescendants=true,
            CanvasSize=UDim2.new(0,0,0,0),
            Visible=false,
            Active=true,
            Selectable=false,
            ScrollingDirection=Enum.ScrollingDirection.Y,
            ZIndex=4,
        }, contentArea)
    end

    local tabIdx = #tabs + 1
    btn.Activated:Connect(function()
        local currentIndex = table.find(tabContent, sf)
        if currentIndex then SwitchTab(currentIndex) end
    end)

    table.insert(tabs, btn)
    table.insert(tabContent, sf)
    tabBar.CanvasSize = UDim2.new(0, 0, 0, #tabs * 34 + 10)
    return sf, btn
end

local codeTab      = AddTab("Code", "💻", 1)
local savedCodeTab = AddTab("Code Đã Lưu", "💾", 2)

SwitchTab(1)

local S = {
    dragMenu=false,
}

local scripts = {}
-- Filled by the GitHub tab; local saving works even before connecting.
local GitHubSync = {Changed=function() end}
local totalRuns, cancelled = 0, false
local curThread, curIndicator = nil, nil

local function ExecOnce(code, name)
    if #name>0 then print("👤 Chạy bởi:", name) end
    return pcall(function()
        local fn, err = loadstring(code)
        if not fn then error(err) end
        fn()
    end)
end

local function Cancel()
    cancelled=true
    if curThread then pcall(task.cancel, curThread); curThread=nil end
    if curIndicator then curIndicator.BackgroundColor3=C.BLUE; curIndicator=nil end
end

local function RunCode(code, name, ind, times, delay)
    Cancel()
    if #code==0 then return false, "⚠️ Vui lòng nhập code!" end
    cancelled=false
    if ind then curIndicator=ind; ind.BackgroundColor3=C.RED end
    local okC, failC = 0, 0
    curThread=task.spawn(function()
        for i=1,times do
            if cancelled then break end
            if i>1 and delay>0 then
                local e=0
                while e<delay do
                    if cancelled then break end
                    task.wait(0.1); e+=0.1
                end
                if cancelled then break end
            end
            local ok, err = ExecOnce(code, name)
            if ok then okC+=1 else failC+=1; warn("❌ Lần",i,err) end
        end
        totalRuns+=okC+failC
        if ind then ind.BackgroundColor3=C.GREEN; if curIndicator==ind then curIndicator=nil end end
        curThread=nil
    end)
    return true, nil
end

local function Label(parent, text, y)
    return New("TextLabel", {
        Size=UDim2.new(1,-16,0,14), Position=UDim2.new(0,8,0,y or 0),
        Text=text, BackgroundTransparency=1, TextColor3=Color3.fromRGB(60,60,60),
        Font=Enum.Font.GothamMedium, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=6,
    }, parent)
end

local function Button(parent, text, x, y, w, h, color)
    local btn = New("TextButton", {
        Size=UDim2.new(0,w or 100,0,h or 24), Position=UDim2.new(0,x or 8,0,y or 0),
        Text=text, BackgroundColor3=color or C.GRAY, BackgroundTransparency=0.2,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=6,
    }, parent)
    Corner(btn, UDim.new(0,5))
    Stroke(btn, color and color:Lerp(Color3.new(0,0,0),0.4) or nil, 1)
    btn.MouseEnter:Connect(function() Tween(btn, {BackgroundTransparency=0.05}, 0.2) end)
    btn.MouseLeave:Connect(function() Tween(btn, {BackgroundTransparency=0.2}, 0.2) end)
    return btn
end

-- ==================== TAB 1: CODE ====================
local y = 8
Label(codeTab, "💻 Nhập Code Tùy Chỉnh", y)
y = y + 14
Label(codeTab, "👤 Tên Script", y)
y = y + 14

local nameIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,26), Position=UDim2.new(0,8,0,y), Text="",
    PlaceholderText="Nhập tên script...", PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, codeTab)
Corner(nameIn, UDim.new(0,5))
Stroke(nameIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, nameIn)

y = y + 32
Label(codeTab, "💻 Code (Lua)", y)
y = y + 14

local codeIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,80), Position=UDim2.new(0,8,0,y), Text="",
    PlaceholderText="-- Nhập code Lua tại đây...", PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(245,245,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
    MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
    Active=true, Selectable=true, ZIndex=10,
}, codeTab)
Corner(codeIn, UDim.new(0,5))
Stroke(codeIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, codeIn)

y = y + 86
Label(codeTab, "🔁 Cài đặt lặp", y)
y = y + 14
Label(codeTab, "Số lần lặp:", y)

local repIn = New("TextBox", {
    Size=UDim2.new(0,55,0,24), Position=UDim2.new(0,8,0,y+12), Text="1",
    PlaceholderColor3=Color3.fromRGB(160,160,160), BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(20,20,20), Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0,
    ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, codeTab)
Corner(repIn, UDim.new(0,5))
Stroke(repIn, Color3.fromRGB(180,180,200), 1.2)

Label(codeTab, "Thời gian chờ:", y+36)

local delIn = New("TextBox", {
    Size=UDim2.new(0,55,0,24), Position=UDim2.new(0,8,0,y+50), Text="0",
    PlaceholderColor3=Color3.fromRGB(160,160,160), BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(20,20,20), Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0,
    ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, codeTab)
Corner(delIn, UDim.new(0,5))
Stroke(delIn, Color3.fromRGB(180,180,200), 1.2)

local unitBtn = New("TextButton", {
    Size=UDim2.new(0,55,0,24), Position=UDim2.new(0,75,0,y+50), Text="Giây ▾",
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, TextColor3=C.DARK,
    Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=10,
}, codeTab)
Corner(unitBtn,UDim.new(0,4)); Stroke(unitBtn)

local ddFrame = New("Frame", {
    Size=UDim2.new(0,55,0,48), Position=UDim2.new(0,75,0,y+74),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, BorderSizePixel=0, Visible=false, ZIndex=15,
}, codeTab)
Corner(ddFrame,UDim.new(0,4)); Stroke(ddFrame)

local secOpt = New("TextButton", {
    Size=UDim2.new(1,0,0,24), Text="Giây", BackgroundColor3=Color3.fromRGB(245,245,245),
    BackgroundTransparency=0, TextColor3=C.DARK, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=16,
}, ddFrame)

local minOpt = New("TextButton", {
    Size=UDim2.new(1,0,0,24), Position=UDim2.new(0,0,0,24), Text="Phút",
    BackgroundColor3=Color3.fromRGB(245,245,245), BackgroundTransparency=0, TextColor3=C.DARK,
    Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=16,
}, ddFrame)

unitBtn.Activated:Connect(function() ddFrame.Visible=not ddFrame.Visible end)
secOpt.Activated:Connect(function() unitBtn.Text="Giây ▾"; ddFrame.Visible=false end)
minOpt.Activated:Connect(function() unitBtn.Text="Phút ▾"; ddFrame.Visible=false end)

trackConn(UserInputService.InputBegan:Connect(function(i,gp)
    if gp then return end
    if i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch then
        local objs = playerGui:GetGuiObjectsAtPosition(i.Position.X, i.Position.Y)
        local f=false
        for _,o in ipairs(objs) do
            if o==unitBtn or o:IsDescendantOf(ddFrame) then f=true; break end
        end
        if not f then ddFrame.Visible=false end
    end
end))

y = y + 82

local runBtn = Button(codeTab, "▶ Chạy Code", 8, y, 140, 26, Color3.fromRGB(0,160,90))
local stopBtn = Button(codeTab, "⏹ Dừng", 156, y, 80, 26, C.RED)
y = y + 32
local saveBtn = Button(codeTab, "💾 Lưu Vào Danh Sách", 8, y, 160, 26, C.BLUE)
y = y + 32

local statusLbl = Label(codeTab, "", y)
statusLbl.TextColor3=Color3.fromRGB(220,170,0); statusLbl.TextSize=9; statusLbl.ZIndex=6
y = y + 14

local countLbl = Label(codeTab, "🔄 Tổng số lần đã chạy: 0", y)
countLbl.TextColor3=C.GREEN; countLbl.TextSize=9; countLbl.ZIndex=6

codeTab.CanvasSize = UDim2.new(0, 0, 0, y + 30)

stopBtn.Activated:Connect(function() Cancel(); statusLbl.Text="⏹️ Đã dừng" end)

runBtn.Activated:Connect(function()
    local t=math.clamp(tonumber(repIn.Text)or 1,1,1000)
    local d=math.max(tonumber(delIn.Text)or 0,0)
    if unitBtn.Text:find("Phút") then d=d*60 end
    local ok,err=RunCode(codeIn.Text,nameIn.Text,nil,t,d)
    if not ok then
        statusLbl.Text=err or "❌ Lỗi không xác định"
    else
        statusLbl.Text="⏳ Đang thực thi..."
        task.spawn(function()
            while curThread do
                if cancelled then statusLbl.Text="⏹️ Đã dừng"; return end
                task.wait(0.1)
            end
            if not cancelled then statusLbl.Text="✅ Hoàn thành!" end
            countLbl.Text="🔄 Tổng số lần đã chạy: "..totalRuns
        end)
    end
end)

local RebuildScripts

saveBtn.Activated:Connect(function()
    local n=nameIn.Text
    local c=codeIn.Text
    if #c==0 then statusLbl.Text="⚠️ Vui lòng nhập code!"; return end
    if #n==0 then n="Script "..(#scripts+1) end
    local bn=n
    local cnt=1
    while true do
        local ex=false
        for _,s in ipairs(scripts) do if s.name==n then ex=true; break end end
        if not ex then break end
        cnt+=1; n=bn.." ("..cnt..")"
    end
    table.insert(scripts,{name=n, code=c, expanded=false})
    GitHubSync.Changed("scripts")
    if RebuildScripts then RebuildScripts() end
    statusLbl.Text="✅ Đã lưu vào Tab 'Code Đã Lưu'!"
end)

-- ==================== TAB 2: CODE ĐÃ LƯU ====================
local sy = 8
Label(savedCodeTab, "💾 Danh Sách Script Đã Lưu", sy)
sy = sy + 18

local searchIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,26), Position=UDim2.new(0,8,0,sy), Text="",
    PlaceholderText="🔍 Tìm kiếm script...", PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, savedCodeTab)
Corner(searchIn, UDim.new(0,5))
Stroke(searchIn, Color3.fromRGB(180,180,200), 1.2)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, searchIn)
sy = sy + 32

local scriptList = New("Frame", {
    Size=UDim2.new(1,-16,0,0), Position=UDim2.new(0,8,0,sy),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=6,
}, savedCodeTab)
New("UIListLayout", {SortOrder=Enum.SortOrder.LayoutOrder, Padding=UDim.new(0,6)}, scriptList)

RebuildScripts = function()
    for _,c in ipairs(scriptList:GetChildren()) do
        if not c:IsA("UIListLayout") then c:Destroy() end
    end

    local term=searchIn.Text:lower()
    local disp={}
    for _,d in ipairs(scripts) do
        if term=="" or d.name:lower():find(term,1,true) then table.insert(disp,d) end
    end

    if #disp==0 then
        New("TextLabel", {
            Size=UDim2.new(1,0,0,40),
            Text=term~="" and "📭 Không tìm thấy script phù hợp" or "📭 Chưa có script nào được lưu",
            BackgroundTransparency=1, TextColor3=C.GRAY, Font=Enum.Font.GothamMedium, TextSize=11,
            TextXAlignment=Enum.TextXAlignment.Center, TextYAlignment=Enum.TextYAlignment.Center, ZIndex=7,
        }, scriptList)
    end

    local totalHeight = 0

    for _, d in ipairs(disp) do
        local isExpanded = d.expanded or false
        local rowH = isExpanded and 160 or 42

        local row = New("Frame", {
            Size=UDim2.new(1,0,0,rowH), BackgroundColor3=Color3.fromRGB(255,255,255),
            BackgroundTransparency=0.1, BorderSizePixel=0, ZIndex=6,
            ClipsDescendants=true,
        }, scriptList)
        Corner(row,UDim.new(0,6)); Stroke(row)

        local arrowBtn = New("TextButton", {
            Size=UDim2.new(0,24,0,24), Position=UDim2.new(0,6,0,9),
            Text=isExpanded and "▲" or "▼",
            BackgroundColor3=Color3.fromRGB(220,225,240), BackgroundTransparency=0,
            TextColor3=C.BLUE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(arrowBtn, UDim.new(0,4))

        local nameLbl = New("TextLabel", {
            Size=UDim2.new(1,-175,0,42), Position=UDim2.new(0,36,0,0),
            Text=d.name, BackgroundTransparency=1, TextColor3=C.DARK,
            Font=Enum.Font.GothamBold, TextSize=11, TextXAlignment=Enum.TextXAlignment.Left,
            TextTruncate=Enum.TextTruncate.AtEnd, ZIndex=8,
        }, row)

        local delScriptBtn = New("TextButton", {
            Size=UDim2.new(0,58,0,26), Position=UDim2.new(1,-132,0,8),
            Text="🗑 Xóa", BackgroundColor3=C.RED, BackgroundTransparency=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(delScriptBtn, UDim.new(0,5))

        local runScriptBtn = New("TextButton", {
            Size=UDim2.new(0,62,0,26), Position=UDim2.new(1,-68,0,8),
            Text="▶ Chạy", BackgroundColor3=C.GREEN, BackgroundTransparency=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(runScriptBtn, UDim.new(0,5))

        if isExpanded then
            local codeBoxFrame = New("ScrollingFrame", {
                Size=UDim2.new(1,-12,0,82), Position=UDim2.new(0,6,0,42),
                BackgroundColor3=Color3.fromRGB(240,242,250), BackgroundTransparency=0,
                BorderSizePixel=0, ZIndex=8, ScrollBarThickness=4,
                CanvasSize=UDim2.new(0,0,0,0),
            }, row)
            Corner(codeBoxFrame, UDim.new(0,5))
            Stroke(codeBoxFrame, Color3.fromRGB(190,195,210), 1)

            local codeLbl = New("TextBox", {
                Size=UDim2.new(1,-8,1,-8), Position=UDim2.new(0,4,0,4),
                Text=d.code, TextColor3=Color3.fromRGB(30,30,30), BackgroundTransparency=1,
                Font=Enum.Font.Code, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left,
                TextYAlignment=Enum.TextYAlignment.Top, MultiLine=true, TextWrapped=true,
                ClearTextOnFocus=false, TextEditable=false, Active=true, ZIndex=9,
            }, codeBoxFrame)

            local copyBtn = New("TextButton", {
                Size=UDim2.new(0,120,0,24), Position=UDim2.new(0,6,0,128),
                Text="📋 Sao Chép Code", BackgroundColor3=C.BLUE, BackgroundTransparency=0.1,
                TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
            }, row)
            Corner(copyBtn, UDim.new(0,5))

            copyBtn.Activated:Connect(function()
                if setclipboard then
                    pcall(setclipboard, d.code)
                    copyBtn.Text = "✅ Đã Sao Chép!"
                elseif toclipboard then
                    pcall(toclipboard, d.code)
                    copyBtn.Text = "✅ Đã Sao Chép!"
                else
                    codeLbl:CaptureFocus()
                    codeLbl.SelectionStart = 1
                    codeLbl.CursorPosition = #d.code + 1
                    copyBtn.Text = "⚠️ Đã Bôi Đen Code"
                end
                task.delay(1.5, function()
                    if copyBtn and copyBtn.Parent then
                        copyBtn.Text = "📋 Sao Chép Code"
                    end
                end)
            end)
        end

        arrowBtn.Activated:Connect(function()
            d.expanded = not d.expanded
            RebuildScripts()
        end)

        runScriptBtn.Activated:Connect(function()
            RunCode(d.code, d.name, runScriptBtn, 1, 0)
            statusLbl.Text="⏳ Đang chạy: "..d.name
        end)

        delScriptBtn.Activated:Connect(function()
            local origIdx = nil
            for idx, s in ipairs(scripts) do
                if s == d then origIdx = idx; break end
            end
            if origIdx then
                table.remove(scripts, origIdx)
                GitHubSync.Changed("scripts")
                RebuildScripts()
            end
        end)

        totalHeight = totalHeight + rowH + 6
    end

    local listH = math.max(totalHeight, 40)
    scriptList.Size = UDim2.new(1,-16,0,listH)
    savedCodeTab.CanvasSize = UDim2.new(0, 0, 0, sy + listH + 30)
end

searchIn:GetPropertyChangedSignal("Text"):Connect(RebuildScripts)
RebuildScripts()

-- ==================== TAB 3: HỖ TRỢ — SCRIPT NHANH + PHÂN TÍCH TỌA ĐỘ ====================
local supportTab = AddTab("Hỗ Trợ", "🛠", 3)

local posY = 8

Label(supportTab, "⚡ Script Nhanh - Nhấn để chạy ngay", posY)
posY = posY + 16

local quickScripts = {
    {n="Dex Explorer", d="Mở Dex Explorer", c=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/dex.lua"))()]], cl=Color3.fromRGB(50,120,200)},
    {n="Infinite Yield", d="Admin Commands", c=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()]], cl=C.PURPLE},
    {n="SimpleSpy v3", d="Theo dõi RemoteEvent & RemoteFunction", c=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/ex-serum/SimpleSpy/main/SimpleSpy.lua"))()]], cl=Color3.fromRGB(0,150,80)},
}

for _, s in ipairs(quickScripts) do
    local btn = New("TextButton", {
        Size=UDim2.new(1,-16,0,28), Position=UDim2.new(0,8,0,posY), Text="",
        BackgroundColor3=s.cl, BackgroundTransparency=0.3, BorderSizePixel=0, ZIndex=6,
    }, supportTab)
    Corner(btn, UDim.new(0,5))
    Stroke(btn, s.cl, 1.2)
    New("TextLabel", {
        Size=UDim2.new(1,-10,1,0), Position=UDim2.new(0,10,0,0), Text=s.n.."\n"..s.d,
        BackgroundTransparency=1, TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10,
        TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Center, ZIndex=7,
    }, btn)
    btn.Activated:Connect(function() RunCode(s.c, s.n, nil, 1, 0) end)
    posY = posY + 32
end

posY = posY + 6
Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16

Label(supportTab, "🛠 Hỗ Trợ — Phân Tích Tọa Độ", posY)
posY = posY + 18
Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16

-- ===== NÚT BẬT/TẮT PHÂN TÍCH VẬT THỂ + HIGHLIGHT =====
local analyzeObjectEnabled = false
local highlightEnabled = true

local objectAnalyzeBtn = Button(supportTab, "🎯 Phân Tích Vật Thể: TẮT", 8, posY, 200, 26, C.GRAY)
local clearObjectBtn = Button(supportTab, "🧹 Xóa KQ", 214, posY, 90, 26, C.RED)
posY = posY + 32

local highlightToggleBtn = Button(supportTab, "💜 Highlight Tím: BẬT", 8, posY, 200, 26, C.PURPLE)
local removeHighlightBtn = Button(supportTab, "❌ Xóa Highlight", 214, posY, 90, 26, C.RED)
posY = posY + 32

Label(supportTab, "💡 Bật 'Phân Tích' rồi click vào vật thể (tường, đất, part...)", posY)
posY = posY + 16

-- ===== PANEL HIỂN THỊ KẾT QUẢ VẬT THỂ =====
local objResultPanel = New("Frame", {
    Size=UDim2.new(1,-16,0,190),
    Position=UDim2.new(0,8,0,posY),
    BackgroundColor3=Color3.fromRGB(20, 25, 35),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
    Visible=false,
}, supportTab)
Corner(objResultPanel, UDim.new(0,6))
Stroke(objResultPanel, C.PURPLE, 1.5)

local objTitleLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,4),
    Text="🎯 VẬT THỂ ĐƯỢC CHỌN", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(180, 130, 255),
    Font=Enum.Font.GothamBold, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objNameLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,22),
    Text="Name: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 255, 100),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objClassLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,38),
    Text="Class: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(200, 200, 255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objPosLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,54),
    Text="Position: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 180, 180),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objSizeLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,70),
    Text="Size: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(180, 255, 180),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objRotLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,86),
    Text="Rotation: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(180, 220, 255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objLookLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,102),
    Text="Look: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(220, 200, 255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objMatLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,118),
    Text="Material: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 220, 180),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objColorLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,134),
    Text="Color: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 180, 220),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objPathLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,150),
    Text="Path: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(180, 255, 220),
    Font=Enum.Font.Code, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
    TextTruncate=Enum.TextTruncate.AtEnd,
}, objResultPanel)

local copyObjBtn = New("TextButton", {
    Size=UDim2.new(0,120,0,20), Position=UDim2.new(0,8,0,168),
    Text="📋 Copy Tọa Độ", BackgroundColor3=C.BLUE, BackgroundTransparency=0.1,
    TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
}, objResultPanel)
Corner(copyObjBtn, UDim.new(0,4))

local copyPathBtn = New("TextButton", {
    Size=UDim2.new(0,120,0,20), Position=UDim2.new(0,134,0,168),
    Text="📋 Copy Path", BackgroundColor3=C.PURPLE, BackgroundTransparency=0.1,
    TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
}, objResultPanel)
Corner(copyPathBtn, UDim.new(0,4))

posY = posY + 198

Label(supportTab, "📍 Tọa Độ Hiện Tại (Real-time)", posY)
posY = posY + 16

-- ===== PANEL TỌA ĐỘ ĐẦY ĐỦ (POS + SIZE + ROTATION + LOOK + STATE + HP) =====
local coordDisplay = New("Frame", {
    Size=UDim2.new(1,-16,0,290),
    Position=UDim2.new(0,8,0,posY),
    BackgroundColor3=Color3.fromRGB(30, 35, 45),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
}, supportTab)
Corner(coordDisplay, UDim.new(0,6))
Stroke(coordDisplay, C.BLUE, 1.5)

local function CreateCoordRow(parent, yPos, labelText, labelColor, valueDefault)
    New("TextLabel", {
        Size=UDim2.new(0,90,0,16), Position=UDim2.new(0,8,0,yPos),
        Text=labelText, BackgroundTransparency=1, TextColor3=labelColor,
        Font=Enum.Font.GothamBold, TextSize=10,
        TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
    }, parent)
    return New("TextLabel", {
        Size=UDim2.new(1,-100,0,16), Position=UDim2.new(0,100,0,yPos),
        Text=valueDefault or "...", BackgroundTransparency=1,
        TextColor3=Color3.fromRGB(255,255,255),
        Font=Enum.Font.Code, TextSize=10,
        TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
    }, parent)
end

New("TextLabel", {
    Size=UDim2.new(1,-16,0,14), Position=UDim2.new(0,8,0,4),
    Text="📍 POSITION (DƯỚI CHÂN)", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local xValLbl = CreateCoordRow(coordDisplay, 20, "X:", Color3.fromRGB(255,100,100), "0.000")
local yValLbl = CreateCoordRow(coordDisplay, 36, "Y:", Color3.fromRGB(100,255,100), "0.000")
local zValLbl = CreateCoordRow(coordDisplay, 52, "Z:", Color3.fromRGB(100,150,255), "0.000")

New("TextLabel", {
    Size=UDim2.new(1,-16,0,14), Position=UDim2.new(0,8,0,72),
    Text="📦 SIZE", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local sizeXValLbl = CreateCoordRow(coordDisplay, 88, "Size X:", Color3.fromRGB(255,150,150), "0.000")
local sizeYValLbl = CreateCoordRow(coordDisplay, 104, "Size Y:", Color3.fromRGB(150,255,150), "0.000")
local sizeZValLbl = CreateCoordRow(coordDisplay, 120, "Size Z:", Color3.fromRGB(150,180,255), "0.000")

New("TextLabel", {
    Size=UDim2.new(1,-16,0,14), Position=UDim2.new(0,8,0,140),
    Text="🧭 ROTATION", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local rotPValLbl = CreateCoordRow(coordDisplay, 156, "Pitch (X):", Color3.fromRGB(255,150,150), "0.0°")
local rotYValLbl = CreateCoordRow(coordDisplay, 172, "Yaw (Y):", Color3.fromRGB(150,255,150), "0.0°")
local rotRValLbl = CreateCoordRow(coordDisplay, 188, "Roll (Z):", Color3.fromRGB(150,180,255), "0.0°")

New("TextLabel", {
    Size=UDim2.new(1,-16,0,14), Position=UDim2.new(0,8,0,206),
    Text="👁 LOOK / STATE / HP", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local lookValLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,222),
    Text="Look: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(200,220,255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local stateValLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,240),
    Text="State: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(200,255,200),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local hpValLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,16), Position=UDim2.new(0,8,0,258),
    Text="HP: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255,200,200),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local placeLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,14), Position=UDim2.new(0,8,0,274),
    Text="Place: ...", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(150, 200, 255),
    Font=Enum.Font.GothamMedium, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

posY = posY + 298

local lastPos = Vector3.new()
local lastSize = Vector3.new()
local lastRot = Vector3.new()
local lastLook = Vector3.new()
local lastState = ""
local lastHp = -1

local function GetRootPart()
    local char = player.Character
    if not char then return nil end
    local humanoid = char:FindFirstChildOfClass("Humanoid")
    local rootPart = (humanoid and humanoid.RootPart)
        or char:FindFirstChild("HumanoidRootPart")
        or char.PrimaryPart
        or char:FindFirstChild("UpperTorso")
        or char:FindFirstChild("Torso")
    return rootPart
end

local function GetGroundPosition()
    local char = player.Character
    if not char then return nil end
    local rootPart = GetRootPart()
    if not rootPart then return nil end

    local origin = rootPart.Position
    local direction = Vector3.new(0, -500, 0)

    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = {char}
    params.IgnoreWater = false

    local result = workspace:Raycast(origin, direction, params)
    if result then
        return result.Position, result.Instance, result.Normal, result.Material
    end
    return nil
end

local coordUpdateConn = RunService.RenderStepped:Connect(function()
    local char = player.Character
    if not char then
        xValLbl.Text = "N/A"; yValLbl.Text = "N/A"; zValLbl.Text = "N/A"
        sizeXValLbl.Text = "N/A"; sizeYValLbl.Text = "N/A"; sizeZValLbl.Text = "N/A"
        rotPValLbl.Text = "N/A"; rotYValLbl.Text = "N/A"; rotRValLbl.Text = "N/A"
        lookValLbl.Text = "Look: N/A"
        stateValLbl.Text = "State: N/A"
        hpValLbl.Text = "HP: N/A"
        return
    end

    local humanoid = char:FindFirstChildOfClass("Humanoid")
    local rootPart = GetRootPart()

    if not rootPart then
        xValLbl.Text = "N/A"; yValLbl.Text = "N/A"; zValLbl.Text = "N/A"
        sizeXValLbl.Text = "N/A"; sizeYValLbl.Text = "N/A"; sizeZValLbl.Text = "N/A"
        rotPValLbl.Text = "N/A"; rotYValLbl.Text = "N/A"; rotRValLbl.Text = "N/A"
        return
    end

    local groundPos = GetGroundPosition()
    local displayPos = groundPos or rootPart.CFrame.Position

    local cf = rootPart.CFrame
    local size = rootPart.Size
    local rx, ry, rz = cf:ToOrientation()
    local look = cf.LookVector

    if (displayPos - lastPos).Magnitude > 0.001 then
        lastPos = displayPos
        xValLbl.Text = string.format("%.3f", displayPos.X)
        yValLbl.Text = string.format("%.3f", displayPos.Y)
        zValLbl.Text = string.format("%.3f", displayPos.Z)
    end

    if (size - lastSize).Magnitude > 0.001 then
        lastSize = size
        sizeXValLbl.Text = string.format("%.3f", size.X)
        sizeYValLbl.Text = string.format("%.3f", size.Y)
        sizeZValLbl.Text = string.format("%.3f", size.Z)
    end

    local newRot = Vector3.new(rx, ry, rz)
    if (newRot - lastRot).Magnitude > 0.001 then
        lastRot = newRot
        rotPValLbl.Text = string.format("%.1f°", math.deg(rx))
        rotYValLbl.Text = string.format("%.1f°", math.deg(ry))
        rotRValLbl.Text = string.format("%.1f°", math.deg(rz))
    end

    if (look - lastLook).Magnitude > 0.001 then
        lastLook = look
        lookValLbl.Text = string.format("Look: %.3f, %.3f, %.3f", look.X, look.Y, look.Z)
    end

    if humanoid then
        local state = humanoid:GetState()
        local stateName = tostring(state):gsub("Enum.HumanoidStateType.", "")
        if stateName ~= lastState then
            lastState = stateName
            stateValLbl.Text = "State: "..stateName
        end

        local hp = math.floor(humanoid.Health)
        if hp ~= lastHp then
            lastHp = hp
            hpValLbl.Text = string.format("HP: %d / %d", hp, math.floor(humanoid.MaxHealth))
        end
    else
        stateValLbl.Text = "State: No Humanoid"
        hpValLbl.Text = "HP: N/A"
    end

    if placeLbl.Text == "Place: ..." then
        pcall(function()
            local info = game:GetService("MarketplaceService"):GetProductInfo(game.PlaceId)
            placeLbl.Text = "Place: "..game.PlaceId.." — "..info.Name
        end)
    end
end)
trackConn(coordUpdateConn)

-- ===== HIGHLIGHT VẬT THỂ =====
local currentHighlight = nil

local function RemoveCurrentHighlight()
    if currentHighlight then
        pcall(function() currentHighlight:Destroy() end)
        currentHighlight = nil
    end
end

local function CreateHighlight(target)
    RemoveCurrentHighlight()
    if not target then return end
    if not target:IsA("BasePart") then return end

    local hl = Instance.new("Highlight")
    hl.Name = "BananaCatHub_Highlight"
    hl.Adornee = target
    hl.FillColor = Color3.fromRGB(160, 60, 255)
    hl.FillTransparency = 0.7
    hl.OutlineColor = Color3.fromRGB(200, 100, 255)
    hl.OutlineTransparency = 0
    hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
    hl.Parent = target

    currentHighlight = hl
end

-- ===== XỬ LÝ CLICK VẬT THỂ =====
local function GetFullPath(obj)
    if not obj then return "nil" end
    local parts = {}
    local cur = obj
    while cur and cur ~= game do
        table.insert(parts, 1, cur.Name)
        cur = cur.Parent
    end
    return table.concat(parts, ".")
end

trackConn(UserInputService.InputBegan:Connect(function(input, gp)
    if gp then return end
    if not analyzeObjectEnabled then return end
    if input.UserInputType ~= Enum.UserInputType.MouseButton1 and input.UserInputType ~= Enum.UserInputType.Touch then
        return
    end

    local objs = playerGui:GetGuiObjectsAtPosition(input.Position.X, input.Position.Y)
    for _, o in ipairs(objs) do
        if o:IsDescendantOf(gui) then return end
    end

    local mousePos = input.Position
    local unitRay = camera:ViewportPointToRay(mousePos.X, mousePos.Y)

    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    local filterList = {}
    if player.Character then table.insert(filterList, player.Character) end
    if gui then table.insert(filterList, gui) end
    params.FilterDescendantsInstances = filterList
    params.IgnoreWater = false

    local result = workspace:Raycast(unitRay.Origin, unitRay.Direction * 5000, params)

    if result and result.Instance then
        local inst = result.Instance
        local hitPos = result.Position
        local hitNormal = result.Normal
        local hitMat = result.Material

        objResultPanel.Visible = true
        objNameLbl.Text = "Name: "..inst.Name
        objClassLbl.Text = "Class: "..inst.ClassName
        objPosLbl.Text = string.format("Position: %.3f, %.3f, %.3f", hitPos.X, hitPos.Y, hitPos.Z)

        if inst:IsA("BasePart") then
            local size = inst.Size
            local cf = inst.CFrame
            local rx, ry, rz = cf:ToOrientation()
            local look = cf.LookVector
            local color = inst.Color
            local material = inst.Material

            objSizeLbl.Text = string.format("Size: %.3f, %.3f, %.3f", size.X, size.Y, size.Z)
            objRotLbl.Text = string.format("Rotation: P=%.1f° Y=%.1f° R=%.1f°",
                math.deg(rx), math.deg(ry), math.deg(rz))
            objLookLbl.Text = string.format("Look: %.3f, %.3f, %.3f", look.X, look.Y, look.Z)
            objMatLbl.Text = "Material: "..tostring(material):gsub("Enum.Material.", "")
            objColorLbl.Text = string.format("Color: R=%d G=%d B=%d",
                math.floor(color.R*255), math.floor(color.G*255), math.floor(color.B*255))

            -- Tạo highlight tím nếu bật
            if highlightEnabled then
                CreateHighlight(inst)
            end
        else
            objSizeLbl.Text = "Size: N/A (không phải BasePart)"
            objRotLbl.Text = "Rotation: N/A"
            objLookLbl.Text = "Look: N/A"
            objMatLbl.Text = "Material: N/A"
            objColorLbl.Text = "Color: N/A"
            RemoveCurrentHighlight()
        end

        objPathLbl.Text = "Path: "..GetFullPath(inst)

        objResultPanel:SetAttribute("LastHitPos", tostring(hitPos))
        objResultPanel:SetAttribute("LastPath", GetFullPath(inst))
        objResultPanel:SetAttribute("LastNormal", tostring(hitNormal))
        objResultPanel:SetAttribute("LastMaterial", tostring(hitMat))
    else
        objResultPanel.Visible = true
        objNameLbl.Text = "Name: (không hit gì)"
        objClassLbl.Text = "Class: N/A"
        objPosLbl.Text = "Position: N/A"
        objSizeLbl.Text = "Size: N/A"
        objRotLbl.Text = "Rotation: N/A"
        objLookLbl.Text = "Look: N/A"
        objMatLbl.Text = "Material: N/A"
        objColorLbl.Text = "Color: N/A"
        objPathLbl.Text = "Path: N/A"
        RemoveCurrentHighlight()
    end
end))

objectAnalyzeBtn.Activated:Connect(function()
    analyzeObjectEnabled = not analyzeObjectEnabled
    if analyzeObjectEnabled then
        objectAnalyzeBtn.Text = "🎯 Phân Tích Vật Thể: BẬT"
        objectAnalyzeBtn.BackgroundColor3 = C.GREEN
    else
        objectAnalyzeBtn.Text = "🎯 Phân Tích Vật Thể: TẮT"
        objectAnalyzeBtn.BackgroundColor3 = C.GRAY
        RemoveCurrentHighlight()
    end
end)

highlightToggleBtn.Activated:Connect(function()
    highlightEnabled = not highlightEnabled
    if highlightEnabled then
        highlightToggleBtn.Text = "💜 Highlight Tím: BẬT"
        highlightToggleBtn.BackgroundColor3 = C.PURPLE
    else
        highlightToggleBtn.Text = "💜 Highlight Tím: TẮT"
        highlightToggleBtn.BackgroundColor3 = C.GRAY
        RemoveCurrentHighlight()
    end
end)

removeHighlightBtn.Activated:Connect(function()
    RemoveCurrentHighlight()
end)

clearObjectBtn.Activated:Connect(function()
    objResultPanel.Visible = false
    RemoveCurrentHighlight()
end)

copyObjBtn.Activated:Connect(function()
    local pos = objResultPanel:GetAttribute("LastHitPos")
    if pos and pos ~= "" then
        if setclipboard then pcall(setclipboard, pos) elseif toclipboard then pcall(toclipboard, pos) end
        copyObjBtn.Text = "✅ Đã Copy!"
        task.delay(1.2, function()
            if copyObjBtn and copyObjBtn.Parent then copyObjBtn.Text = "📋 Copy Tọa Độ" end
        end)
    end
end)

copyPathBtn.Activated:Connect(function()
    local path = objResultPanel:GetAttribute("LastPath")
    if path and path ~= "" then
        if setclipboard then pcall(setclipboard, path) elseif toclipboard then pcall(toclipboard, path) end
        copyPathBtn.Text = "✅ Đã Copy!"
        task.delay(1.2, function()
            if copyPathBtn and copyPathBtn.Parent then copyPathBtn.Text = "📋 Copy Path" end
        end)
    end
end)

posY = posY + 6

local copyCoordBtn = Button(supportTab, "📋 Copy Tọa Độ Dưới Chân", 8, posY, 200, 26, C.BLUE)
posY = posY + 32

copyCoordBtn.Activated:Connect(function()
    local groundPos = GetGroundPosition()
    local rootPart = GetRootPart()
    local finalPos = groundPos or (rootPart and rootPart.CFrame.Position)
    if not finalPos then return end
    local text = string.format("%.3f, %.3f, %.3f", finalPos.X, finalPos.Y, finalPos.Z)
    if setclipboard then
        pcall(setclipboard, text)
    elseif toclipboard then
        pcall(toclipboard, text)
    end
    copyCoordBtn.Text = "✅ Đã Copy: "..text
    task.delay(2, function()
        if copyCoordBtn and copyCoordBtn.Parent then
            copyCoordBtn.Text = "📋 Copy Tọa Độ Dưới Chân"
        end
    end)
end)

Label(supportTab, "🚀 Teleport Tới Tọa Độ", posY)
posY = posY + 14

Label(supportTab, "X:", posY)
local tpXIn = New("TextBox", {
    Size=UDim2.new(0,70,0,24), Position=UDim2.new(0,20,0,posY-2), Text="0",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(20,20,20), Font=Enum.Font.Code, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(tpXIn, UDim.new(0,4)); Stroke(tpXIn, Color3.fromRGB(255,100,100), 1.2)

Label(supportTab, "Y:", posY)
local tpYIn = New("TextBox", {
    Size=UDim2.new(0,70,0,24), Position=UDim2.new(0,110,0,posY-2), Text="0",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(20,20,20), Font=Enum.Font.Code, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(tpYIn, UDim.new(0,4)); Stroke(tpYIn, Color3.fromRGB(100,255,100), 1.2)

Label(supportTab, "Z:", posY)
local tpZIn = New("TextBox", {
    Size=UDim2.new(0,70,0,24), Position=UDim2.new(0,200,0,posY-2), Text="0",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(20,20,20), Font=Enum.Font.Code, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(tpZIn, UDim.new(0,4)); Stroke(tpZIn, Color3.fromRGB(100,150,255), 1.2)

posY = posY + 30

local fillCurrentBtn = Button(supportTab, "📍 Lấy Vị Trí Dưới Chân", 8, posY, 150, 24, C.ORANGE)
local tpBtn = Button(supportTab, "🚀 Teleport", 164, posY, 90, 24, C.GREEN)
posY = posY + 30

fillCurrentBtn.Activated:Connect(function()
    local groundPos = GetGroundPosition()
    local rootPart = GetRootPart()
    local p = groundPos or (rootPart and rootPart.CFrame.Position)
    if not p then return end
    tpXIn.Text = string.format("%.3f", p.X)
    tpYIn.Text = string.format("%.3f", p.Y)
    tpZIn.Text = string.format("%.3f", p.Z)
end)

tpBtn.Activated:Connect(function()
    local rootPart = GetRootPart()
    if not rootPart then return end
    local x = tonumber(tpXIn.Text) or 0
    local y = tonumber(tpYIn.Text) or 0
    local z = tonumber(tpZIn.Text) or 0
    rootPart.CFrame = CFrame.new(Vector3.new(x, y, z))
    tpBtn.Text = "✅ Đã Teleport!"
    task.delay(1.5, function()
        if tpBtn and tpBtn.Parent then tpBtn.Text = "🚀 Teleport" end
    end)
end)

Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16
Label(supportTab, "💾 Waypoint Đã Lưu", posY)
posY = posY + 14

local wpNameIn = New("TextBox", {
    Size=UDim2.new(1,-130,0,24), Position=UDim2.new(0,8,0,posY), Text="",
    PlaceholderText="Tên waypoint...",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(20,20,20), Font=Enum.Font.GothamMedium, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(wpNameIn, UDim.new(0,4)); Stroke(wpNameIn, Color3.fromRGB(180,180,200), 1.2)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, wpNameIn)

local saveWpBtn = Button(supportTab, "💾 Lưu", 0, 0, 100, 24, C.PURPLE)
saveWpBtn.Position = UDim2.new(1, -110, 0, posY)

posY = posY + 32

local wpListFrame = New("Frame", {
    Size=UDim2.new(1,-16,0,0), Position=UDim2.new(0,8,0,posY),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=6,
}, supportTab)
New("UIListLayout", {SortOrder=Enum.SortOrder.LayoutOrder, Padding=UDim.new(0,4)}, wpListFrame)

local waypoints = {}

local RebuildWaypoints

saveWpBtn.Activated:Connect(function()
    local rootPart = GetRootPart()
    if not rootPart then return end
    local name = wpNameIn.Text
    if #name == 0 then name = "WP "..(#waypoints+1) end
    table.insert(waypoints, {name = name, pos = rootPart.CFrame.Position})
    wpNameIn.Text = ""
    if RebuildWaypoints then RebuildWaypoints() end
end)

RebuildWaypoints = function()
    for _, c in ipairs(wpListFrame:GetChildren()) do
        if not c:IsA("UIListLayout") then c:Destroy() end
    end

    if #waypoints == 0 then
        New("TextLabel", {
            Size=UDim2.new(1,0,0,26),
            Text="📭 Chưa có waypoint nào.",
            BackgroundTransparency=1, TextColor3=C.GRAY,
            Font=Enum.Font.GothamMedium, TextSize=10,
            TextXAlignment=Enum.TextXAlignment.Center, ZIndex=7,
        }, wpListFrame)
        supportTab.CanvasSize = UDim2.new(0, 0, 0, posY + 40)
        return
    end

    local totalH = 0
    for i, wp in ipairs(waypoints) do
        local row = New("Frame", {
            Size=UDim2.new(1,0,0,30),
            BackgroundColor3=Color3.fromRGB(255,255,255),
            BackgroundTransparency=0.1, BorderSizePixel=0, ZIndex=6,
        }, wpListFrame)
        Corner(row, UDim.new(0,5)); Stroke(row)

        New("TextLabel", {
            Size=UDim2.new(1,-120,1,0), Position=UDim2.new(0,8,0,0),
            Text=wp.name.." ("..string.format("%.0f, %.0f, %.0f", wp.pos.X, wp.pos.Y, wp.pos.Z)..")",
            BackgroundTransparency=1, TextColor3=C.DARK,
            Font=Enum.Font.GothamBold, TextSize=9,
            TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
        }, row)

        local goBtn = New("TextButton", {
            Size=UDim2.new(0,50,0,22), Position=UDim2.new(1,-84,0,4),
            Text="🚀 Tới", BackgroundColor3=C.GREEN, BackgroundTransparency=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9,
            BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(goBtn, UDim.new(0,4))
        goBtn.Activated:Connect(function()
            local rootPart = GetRootPart()
            if not rootPart then return end
            rootPart.CFrame = CFrame.new(wp.pos)
        end)

        local delBtn = New("TextButton", {
            Size=UDim2.new(0,26,0,22), Position=UDim2.new(1,-30,0,4),
            Text="🗑", BackgroundColor3=C.RED, BackgroundTransparency=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10,
            BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(delBtn, UDim.new(0,4))
        delBtn.Activated:Connect(function()
            table.remove(waypoints, i)
            RebuildWaypoints()
        end)

        totalH = totalH + 34
    end

    wpListFrame.Size = UDim2.new(1,-16,0,totalH)
    supportTab.CanvasSize = UDim2.new(0, 0, 0, posY + totalH + 20)
end

RebuildWaypoints()

-- ==================== TAB 4: AI AI — MINI WEB CHAT ====================
local aiTab = AddTab("AI AI", "🤖", 4)

aiTab.BackgroundTransparency = 1
aiTab.ScrollingDirection = Enum.ScrollingDirection.Y
aiTab.ScrollingEnabled = true
aiTab.ElasticBehavior = Enum.ElasticBehavior.Never
aiTab.AutomaticCanvasSize = Enum.AutomaticSize.Y
aiTab.CanvasSize = UDim2.new(0, 0, 0, 0)
aiTab.ScrollBarThickness = 5
aiTab.ScrollBarImageColor3 = Color3.fromRGB(100, 120, 180)

local aiBG = New("Frame", {
    Size=UDim2.new(1, 0, 0, 0),
    Position=UDim2.new(0, 0, 0, 0),
    BackgroundColor3=Color3.fromRGB(15, 17, 22),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=4,
    AutomaticSize=Enum.AutomaticSize.Y,
}, aiTab)

local aiInner = New("Frame", {
    Size=UDim2.new(1, 0, 0, 0),
    Position=UDim2.new(0, 0, 0, 0),
    BackgroundTransparency=1,
    BorderSizePixel=0,
    ZIndex=5,
    AutomaticSize=Enum.AutomaticSize.Y,
}, aiBG)
New("UIListLayout", {
    SortOrder=Enum.SortOrder.LayoutOrder,
    Padding=UDim.new(0,8),
    HorizontalAlignment=Enum.HorizontalAlignment.Center,
}, aiInner)
New("UIPadding", {
    PaddingTop=UDim.new(0,10),
    PaddingBottom=UDim.new(0,10),
    PaddingLeft=UDim.new(0,8),
    PaddingRight=UDim.new(0,8),
}, aiInner)

local headerFrame = New("Frame", {
    Size=UDim2.new(1,-16,0,56),
    BackgroundColor3=Color3.fromRGB(25, 28, 36),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
    LayoutOrder=1,
}, aiInner)
Corner(headerFrame, UDim.new(0,10))
Stroke(headerFrame, Color3.fromRGB(60, 70, 100), 1)

local logoCircle = New("Frame", {
    Size=UDim2.new(0,36,0,36),
    Position=UDim2.new(0,10,0,10),
    BackgroundColor3=Color3.fromRGB(100, 120, 240),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=7,
}, headerFrame)
Corner(logoCircle, UDim.new(1,0))

New("TextLabel", {
    Size=UDim2.new(1,0,1,0),
    Text="🤖",
    BackgroundTransparency=1,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=18,
    ZIndex=8,
}, logoCircle)

New("TextLabel", {
    Size=UDim2.new(1,-70,0,20),
    Position=UDim2.new(0,56,0,10),
    Text="AI Mini — Gemini Assistant",
    BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(240, 242, 250),
    Font=Enum.Font.GothamBold,
    TextSize=13,
    TextXAlignment=Enum.TextXAlignment.Left,
    ZIndex=7,
}, headerFrame)

local statusDot = New("Frame", {
    Size=UDim2.new(0,8,0,8),
    Position=UDim2.new(0,58,0,34),
    BackgroundColor3=C.GREEN,
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=7,
}, headerFrame)
Corner(statusDot, UDim.new(1,0))

local statusText = New("TextLabel", {
    Size=UDim2.new(1,-80,0,14),
    Position=UDim2.new(0,70,0,30),
    Text="Đang hoạt động",
    BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(140, 200, 160),
    Font=Enum.Font.GothamMedium,
    TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left,
    ZIndex=7,
}, headerFrame)

local keyPanel = New("Frame", {
    Size=UDim2.new(1,-16,0,86),
    BackgroundColor3=Color3.fromRGB(25, 28, 36),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
    LayoutOrder=2,
}, aiInner)
Corner(keyPanel, UDim.new(0,10))
Stroke(keyPanel, Color3.fromRGB(60, 70, 100), 1)

New("TextLabel", {
    Size=UDim2.new(1,-20,0,16),
    Position=UDim2.new(0,10,0,6),
    Text="🔑 API KEY GEMINI",
    BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(140, 160, 220),
    Font=Enum.Font.GothamBold,
    TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left,
    ZIndex=7,
}, keyPanel)

local apiKeyIn = New("TextBox", {
    Size=UDim2.new(1,-20,0,26),
    Position=UDim2.new(0,10,0,24),
    Text="",
    PlaceholderText="Dán API key Gemini vào đây...",
    PlaceholderColor3=Color3.fromRGB(90, 95, 110),
    BackgroundColor3=Color3.fromRGB(15, 17, 22),
    BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(230, 235, 245),
    Font=Enum.Font.Code,
    TextSize=10,
    BorderSizePixel=0,
    ClearTextOnFocus=false,
    Active=true,
    Selectable=true,
    ZIndex=10,
    TextXAlignment=Enum.TextXAlignment.Left,
}, keyPanel)
Corner(apiKeyIn, UDim.new(0,6))
Stroke(apiKeyIn, Color3.fromRGB(70, 90, 150), 1.2)
New("UIPadding", {PaddingLeft=UDim.new(0,8)}, apiKeyIn)

local saveKeyBtn = New("TextButton", {
    Size=UDim2.new(0,70,0,22),
    Position=UDim2.new(0,10,0,56),
    Text="💾 Lưu",
    BackgroundColor3=Color3.fromRGB(50, 120, 220),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=9,
    BorderSizePixel=0,
    ZIndex=8,
}, keyPanel)
Corner(saveKeyBtn, UDim.new(0,5))

local clearKeyBtn = New("TextButton", {
    Size=UDim2.new(0,70,0,22),
    Position=UDim2.new(0,86,0,56),
    Text="🗑 Xóa",
    BackgroundColor3=Color3.fromRGB(180, 60, 60),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=9,
    BorderSizePixel=0,
    ZIndex=8,
}, keyPanel)
Corner(clearKeyBtn, UDim.new(0,5))

local toggleKeyBtn = New("TextButton", {
    Size=UDim2.new(0,70,0,22),
    Position=UDim2.new(0,162,0,56),
    Text="👁 Hiện",
    BackgroundColor3=Color3.fromRGB(180, 120, 40),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=9,
    BorderSizePixel=0,
    ZIndex=8,
}, keyPanel)
Corner(toggleKeyBtn, UDim.new(0,5))

local keyStatus = New("TextLabel", {
    Size=UDim2.new(1,-240,0,14),
    Position=UDim2.new(0,238,0,60),
    Text="",
    BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(140, 200, 160),
    Font=Enum.Font.GothamMedium,
    TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left,
    ZIndex=7,
}, keyPanel)

local chatPanel = New("Frame", {
    Size=UDim2.new(1,-16,0,340),
    BackgroundColor3=Color3.fromRGB(25, 28, 36),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
    LayoutOrder=3,
}, aiInner)
Corner(chatPanel, UDim.new(0,10))
Stroke(chatPanel, Color3.fromRGB(60, 70, 100), 1)

local chatScroll = New("ScrollingFrame", {
    Size=UDim2.new(1,-16,1,-16),
    Position=UDim2.new(0,8,0,8),
    BackgroundColor3=Color3.fromRGB(15, 17, 22),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=7,
    ScrollBarThickness=4,
    ScrollBarImageColor3=Color3.fromRGB(80, 100, 150),
    CanvasSize=UDim2.new(0,0,0,0),
    AutomaticCanvasSize=Enum.AutomaticSize.Y,
    ScrollingDirection=Enum.ScrollingDirection.Y,
    ScrollingEnabled=true,
    ElasticBehavior=Enum.ElasticBehavior.Never,
    ClipsDescendants=true,
    Active=true,
    Selectable=false,
}, chatPanel)
Corner(chatScroll, UDim.new(0,8))
New("UIPadding", {PaddingTop=UDim.new(0,8), PaddingBottom=UDim.new(0,8), PaddingLeft=UDim.new(0,8), PaddingRight=UDim.new(0,8)}, chatScroll)
New("UIListLayout", {
    SortOrder=Enum.SortOrder.LayoutOrder,
    Padding=UDim.new(0,8),
    HorizontalAlignment=Enum.HorizontalAlignment.Left,
}, chatScroll)

local function ParseSegments(text)
    local segments = {}
    local remaining = text
    while true do
        local startIdx, endIdx = remaining:find("```")
        if not startIdx then
            if #remaining > 0 then
                table.insert(segments, {type = "text", content = remaining})
            end
            break
        end
        local before = remaining:sub(1, startIdx - 1)
        if #before > 0 then
            table.insert(segments, {type = "text", content = before})
        end
        local rest = remaining:sub(endIdx + 1)
        local closeStart, closeEnd = rest:find("```")
        if not closeStart then
            table.insert(segments, {type = "code", content = rest})
            break
        end
        local codeContent = rest:sub(1, closeStart - 1)
        codeContent = codeContent:gsub("^%s*%a+%s*\n", "")
        table.insert(segments, {type = "code", content = codeContent})
        remaining = rest:sub(closeEnd + 1)
    end
    return segments
end

local function AddMessage(sender, text, isUser)
    local bubbleColor = isUser and Color3.fromRGB(50, 120, 220) or Color3.fromRGB(35, 40, 55)
    local textColor = isUser and C.WHITE or Color3.fromRGB(230, 235, 245)
    local align = isUser and Enum.TextXAlignment.Right or Enum.TextXAlignment.Left
    local sizeScale = isUser and 0.75 or 0.9

    local holder = New("Frame", {
        Size=UDim2.new(1,0,0,0),
        BackgroundTransparency=1,
        BorderSizePixel=0,
        ZIndex=8,
        AutomaticSize=Enum.AutomaticSize.Y,
    }, chatScroll)

    local bubble = New("Frame", {
        Size=UDim2.new(sizeScale,0,0,0),
        BackgroundColor3=bubbleColor,
        BackgroundTransparency=0,
        BorderSizePixel=0,
        ZIndex=9,
        AutomaticSize=Enum.AutomaticSize.Y,
    }, holder)
    Corner(bubble, UDim.new(0,10))

    if isUser then
        bubble.Position = UDim2.new(1-sizeScale, 0, 0, 0)
    end

    local senderLbl = New("TextLabel", {
        Size=UDim2.new(1,-16,0,12),
        Position=UDim2.new(0,8,0,-14),
        Text=sender,
        BackgroundTransparency=1,
        TextColor3=isUser and Color3.fromRGB(150, 180, 240) or Color3.fromRGB(140, 200, 160),
        Font=Enum.Font.GothamBold,
        TextSize=8,
        TextXAlignment=align,
        ZIndex=10,
    }, bubble)

    local contentContainer = New("Frame", {
        Size=UDim2.new(1,-16,0,0),
        Position=UDim2.new(0,8,0,4),
        BackgroundTransparency=1,
        BorderSizePixel=0,
        ZIndex=10,
        AutomaticSize=Enum.AutomaticSize.Y,
    }, bubble)
    New("UIListLayout", {
        SortOrder=Enum.SortOrder.LayoutOrder,
        Padding=UDim.new(0,4),
    }, contentContainer)
    New("UIPadding", {
        PaddingBottom=UDim.new(0,6),
    }, contentContainer)

    local segments
    if isUser then
        segments = {{type = "text", content = text}}
    else
        segments = ParseSegments(text)
    end

    for idx, seg in ipairs(segments) do
        if seg.type == "code" then
            local codeFrame = New("Frame", {
                Size=UDim2.new(1,0,0,0),
                BackgroundColor3=Color3.fromRGB(12, 14, 18),
                BackgroundTransparency=0,
                BorderSizePixel=0,
                ZIndex=11,
                LayoutOrder=idx,
                AutomaticSize=Enum.AutomaticSize.Y,
            }, contentContainer)
            Corner(codeFrame, UDim.new(0,6))
            Stroke(codeFrame, Color3.fromRGB(70, 90, 150), 1)

            local codeLbl = New("TextBox", {
                Size=UDim2.new(1,-16,0,0),
                Position=UDim2.new(0,8,0,8),
                Text=seg.content,
                BackgroundTransparency=1,
                TextColor3=Color3.fromRGB(180, 230, 180),
                Font=Enum.Font.Code,
                TextSize=11,
                TextXAlignment=Enum.TextXAlignment.Left,
                TextYAlignment=Enum.TextYAlignment.Top,
                TextWrapped=true,
                MultiLine=true,
                TextEditable=false,
                ClearTextOnFocus=false,
                Active=true,
                Selectable=true,
                ZIndex=12,
                AutomaticSize=Enum.AutomaticSize.Y,
            }, codeFrame)
            New("UIPadding", {
                PaddingBottom=UDim.new(0,8),
            }, codeFrame)
        else
            local textLbl = New("TextLabel", {
                Size=UDim2.new(1,0,0,0),
                BackgroundTransparency=1,
                Text=seg.content,
                TextColor3=textColor,
                Font=Enum.Font.GothamMedium,
                TextSize=11,
                TextXAlignment=align,
                TextYAlignment=Enum.TextYAlignment.Top,
                TextWrapped=true,
                ZIndex=10,
                LayoutOrder=idx,
                AutomaticSize=Enum.AutomaticSize.Y,
            }, contentContainer)
        end
    end

    task.defer(function()
        task.wait(0.1)
        local maxY = math.max(0, chatScroll.AbsoluteCanvasSize.Y - chatScroll.AbsoluteWindowSize.Y)
        chatScroll.CanvasPosition = Vector2.new(0, maxY)
    end)

    return holder
end

AddMessage("🤖 Gemini", "Xin chào! Tôi là AI Mini. Hãy nhập API key ở trên (nếu chưa có) rồi đặt câu hỏi bên dưới nhé!", false)

local inputBar = New("Frame", {
    Size=UDim2.new(1,-16,0,36),
    BackgroundColor3=Color3.fromRGB(25, 28, 36),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
    LayoutOrder=4,
}, aiInner)
Corner(inputBar, UDim.new(0,10))
Stroke(inputBar, Color3.fromRGB(60, 70, 100), 1)

local questionIn = New("TextBox", {
    Size=UDim2.new(1,-70,1,-10),
    Position=UDim2.new(0,8,0,5),
    Text="",
    PlaceholderText="Nhập câu hỏi...",
    PlaceholderColor3=Color3.fromRGB(90, 95, 110),
    BackgroundColor3=Color3.fromRGB(15, 17, 22),
    BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(230, 235, 245),
    Font=Enum.Font.GothamMedium,
    TextSize=11,
    BorderSizePixel=0,
    ClearTextOnFocus=false,
    ZIndex=10,
    TextXAlignment=Enum.TextXAlignment.Left,
    TextYAlignment=Enum.TextYAlignment.Center,
}, inputBar)
Corner(questionIn, UDim.new(0,6))
New("UIPadding", {PaddingLeft=UDim.new(0,8)}, questionIn)

local sendBtn = New("TextButton", {
    Size=UDim2.new(0,54,1,-10),
    Position=UDim2.new(1,-62,0,5),
    Text="➤",
    BackgroundColor3=Color3.fromRGB(50, 120, 220),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=16,
    BorderSizePixel=0,
    ZIndex=8,
}, inputBar)
Corner(sendBtn, UDim.new(0,6))

local toolBar = New("Frame", {
    Size=UDim2.new(1,-16,0,30),
    BackgroundTransparency=1,
    BorderSizePixel=0,
    ZIndex=6,
    LayoutOrder=5,
}, aiInner)
New("UIListLayout", {
    FillDirection=Enum.FillDirection.Horizontal,
    SortOrder=Enum.SortOrder.LayoutOrder,
    Padding=UDim.new(0,6),
}, toolBar)

local copyAnswerBtn = New("TextButton", {
    Size=UDim2.new(0,120,1,0),
    Text="📋 Copy chat",
    BackgroundColor3=Color3.fromRGB(50, 120, 220),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=9,
    BorderSizePixel=0,
    ZIndex=7,
}, toolBar)
Corner(copyAnswerBtn, UDim.new(0,6))

local continueBtn = New("TextButton", {
    Size=UDim2.new(0,120,1,0),
    Text="▶ Viết tiếp",
    BackgroundColor3=Color3.fromRGB(180, 120, 40),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=9,
    BorderSizePixel=0,
    ZIndex=7,
}, toolBar)
Corner(continueBtn, UDim.new(0,6))

local clearChatBtn = New("TextButton", {
    Size=UDim2.new(0,120,1,0),
    Text="🧹 Xóa chat",
    BackgroundColor3=Color3.fromRGB(180, 60, 60),
    BackgroundTransparency=0,
    TextColor3=C.WHITE,
    Font=Enum.Font.GothamBold,
    TextSize=9,
    BorderSizePixel=0,
    ZIndex=7,
}, toolBar)
Corner(clearChatBtn, UDim.new(0,6))

local apiKeyFile = "banana_cat_gemini_key.txt"

local function SaveApiKey(key)
    if writefile then
        pcall(writefile, apiKeyFile, key)
    end
    _G.BananaCatHub_GeminiKey = key
end

local function LoadApiKey()
    if _G.BananaCatHub_GeminiKey then
        return _G.BananaCatHub_GeminiKey
    end
    if readfile and isfile then
        local ok, data = pcall(function()
            if isfile(apiKeyFile) then
                return readfile(apiKeyFile)
            end
            return nil
        end)
        if ok and data and #data > 0 then
            _G.BananaCatHub_GeminiKey = data
            return data
        end
    end
    return nil
end

local function MaskKey(key)
    if not key or #key < 8 then return key or "" end
    return key:sub(1, 4)..string.rep("•", math.min(#key - 8, 20))..key:sub(-4)
end

local loadedKey = LoadApiKey()
if loadedKey and #loadedKey > 0 then
    apiKeyIn.Text = loadedKey
    keyStatus.Text = "✅ Đã tải: "..MaskKey(loadedKey)
else
    keyStatus.Text = "⚠️ Chưa có key"
end

saveKeyBtn.Activated:Connect(function()
    local k = apiKeyIn.Text
    if #k == 0 then
        keyStatus.Text = "⚠️ Nhập key trước!"
        return
    end
    SaveApiKey(k)
    keyStatus.Text = "✅ Đã lưu: "..MaskKey(k)
end)

clearKeyBtn.Activated:Connect(function()
    apiKeyIn.Text = ""
    _G.BananaCatHub_GeminiKey = nil
    if delfile then
        pcall(delfile, apiKeyFile)
    end
    keyStatus.Text = "🗑 Đã xóa key"
end)

local keyVisible = true
toggleKeyBtn.Activated:Connect(function()
    keyVisible = not keyVisible
    if keyVisible then
        apiKeyIn.Text = LoadApiKey() or ""
        toggleKeyBtn.Text = "👁 Hiện"
    else
        apiKeyIn.Text = MaskKey(LoadApiKey() or "")
        toggleKeyBtn.Text = "🙈 Ẩn"
    end
end)

local SYSTEM_PROMPT = [[Bạn là trợ lý lập trình chuyên nghiệp cho Roblox Lua.

QUY TẮC BẮT BUỘC:
1. Khi người dùng yêu cầu viết code/script, PHẢI viết ĐẦY ĐỦ, HOÀN CHỈNH, có thể chạy được ngay.
2. TUYỆT ĐỐI KHÔNG dùng "..." hoặc "-- tiếp tục" hoặc "phần còn lại tương tự" để rút gọn code.
3. Nếu code quá dài, hãy chia thành nhiều khối ```lua ... ``` riêng biệt và viết hết tất cả.
4. KHÔNG giải thích dài dòng. Chỉ viết code + vài dòng ghi chú ngắn.
5. Code phải dùng đúng API Roblox Lua, không dùng Python/JavaScript.
6. Nếu người dùng hỏi bằng tiếng Việt, trả lời bằng tiếng Việt.
7. Nếu câu hỏi không liên quan lập trình, trả lời ngắn gọn, trực tiếp.

QUY TẮC ĐẶC BIỆT CHO GUI (RẤT QUAN TRỌNG):
- Khi viết script tạo GUI (như bảng định vị người chơi, ESP, thông tin...), PHẢI dùng cấu trúc GUI TỰ DÃN THEO CHA.
- Frame chính phải có: Size = UDim2.new(1, 0, 1, 0), Position = UDim2.new(0, 0, 0, 0).
- KHÔNG hard-code kích thước như UDim2.new(0, 300, 0, 200).
- Nếu cần viền hay padding, dùng UIPadding bên trong, KHÔNG thay đổi Size của Frame chính.
- Điều này để khi menu chính của hub kéo to ra, GUI này cũng tự dãn theo.
- Nếu script dùng ScreenGui riêng, hãy đặt Parent là CoreGui hoặc PlayerGui và dùng Size tự dãn.]]

local function AskGemini(question)
    local key = LoadApiKey()
    if not key or #key == 0 then
        return false, "⚠️ Chưa có API key. Vui lòng nhập và lưu key trước!"
    end
    if #question == 0 then
        return false, "⚠️ Vui lòng nhập câu hỏi!"
    end

    pcall(function()
        if HttpService.HttpEnabled == false then
            HttpService.HttpEnabled = true
        end
    end)

    local url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="..key

    local body = HttpService:JSONEncode({
        system_instruction = {
            parts = {
                { text = SYSTEM_PROMPT }
            }
        },
        contents = {
            {
                role = "user",
                parts = {
                    { text = question }
                }
            }
        },
        generationConfig = {
            temperature = 0.7,
            topP = 0.95,
            topK = 40,
            maxOutputTokens = 8192,
            candidateCount = 1
        },
        safetySettings = {
            { category = "HARM_CATEGORY_HARASSMENT", threshold = "BLOCK_NONE" },
            { category = "HARM_CATEGORY_HATE_SPEECH", threshold = "BLOCK_NONE" },
            { category = "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold = "BLOCK_NONE" },
            { category = "HARM_CATEGORY_DANGEROUS_CONTENT", threshold = "BLOCK_NONE" }
        }
    })

    local maxRetries = 3
    local baseDelay = 2

    for attempt = 1, maxRetries do
        local ok, result = pcall(function()
            return HttpService:RequestAsync({
                Url = url,
                Method = "POST",
                Headers = {
                    ["Content-Type"] = "application/json"
                },
                Body = body
            })
        end)

        if not ok then
            return false, "❌ Lỗi kết nối: "..tostring(result)
        end

        if result.Success then
            local parseOk, data = pcall(function()
                return HttpService:JSONDecode(result.Body)
            end)

            if not parseOk then
                return false, "❌ Không parse được JSON trả về"
            end

            if data.error then
                return false, "❌ API Error: "..tostring(data.error.message or "unknown")
            end

            if not (data.candidates and data.candidates[1]) then
                return false, "❌ Không có candidates trong phản hồi"
            end

            local cand = data.candidates[1]
            local finishReason = cand.finishReason or "STOP"

            local fullText = ""
            if cand.content and cand.content.parts then
                for _, part in ipairs(cand.content.parts) do
                    if part.text then
                        fullText = fullText .. part.text
                    end
                end
            end

            if #fullText == 0 then
                if finishReason == "SAFETY" then
                    return false, "⚠️ Gemini từ chối trả lời vì lý do an toàn (SAFETY). Hãy thử diễn đạt lại câu hỏi."
                elseif finishReason == "RECITATION" then
                    return false, "⚠️ Gemini dừng vì lý do bản quyền (RECITATION)."
                else
                    return false, "❌ Không có text trong phản hồi. finishReason = "..tostring(finishReason)
                end
            end

            if finishReason == "MAX_TOKENS" then
                fullText = fullText .. "\n\n⚠️ [AI bị cắt do giới hạn token. Hãy gõ 'viết tiếp phần còn lại' hoặc bấm nút '▶ Viết tiếp' để lấy code tiếp.]"
            end

            return true, fullText
        end

        if result.StatusCode == 429 then
            if attempt < maxRetries then
                local waitTime = baseDelay * (2 ^ (attempt - 1))
                pcall(function()
                    statusText.Text = string.format("⏳ Bị giới hạn (429). Chờ %ds rồi thử lại (%d/%d)...", waitTime, attempt, maxRetries)
                    statusDot.BackgroundColor3 = C.YELLOW
                end)
                task.wait(waitTime)
            else
                local bodyPreview = result.Body and tostring(result.Body):sub(1, 400) or ""
                return false, "❌ HTTP 429 — Vượt giới hạn yêu cầu/phút của Gemini (gói miễn phí ~10-15 RPM).\n\nVui lòng chờ khoảng 1 phút rồi gửi lại.\nHoặc nâng cấp API key lên gói trả phí để tăng giới hạn.\n\n"..bodyPreview
            end
        else
            local bodyPreview = result.Body and tostring(result.Body):sub(1, 500) or ""
            return false, "❌ HTTP "..tostring(result.StatusCode)..": "..tostring(result.StatusMessage).."\n"..bodyPreview
        end
    end

    return false, "❌ Không thể kết nối sau nhiều lần thử."
end

local isSending = false

local function SendQuestion()
    if isSending then return end
    local q = questionIn.Text
    if #q == 0 then
        return
    end

    isSending = true
    questionIn.Text = ""
    statusText.Text = "Đang suy nghĩ..."
    statusDot.BackgroundColor3 = C.YELLOW

    AddMessage("👤 Bạn", q, true)

    task.spawn(function()
        local startTime = tick()
        local ok, response = AskGemini(q)
        local elapsed = tick() - startTime

        if ok then
            AddMessage("🤖 Gemini", response, false)
            statusText.Text = string.format("Đang hoạt động (%.1fs)", elapsed)
            statusDot.BackgroundColor3 = C.GREEN
        else
            AddMessage("⚠️ Lỗi", response, false)
            statusText.Text = "Lỗi kết nối"
            statusDot.BackgroundColor3 = C.RED
        end
        isSending = false
        task.wait(0.15)
        local maxY = math.max(0, chatScroll.AbsoluteCanvasSize.Y - chatScroll.AbsoluteWindowSize.Y)
        chatScroll.CanvasPosition = Vector2.new(0, maxY)
    end)
end

sendBtn.Activated:Connect(SendQuestion)
questionIn.FocusLost:Connect(function(enter)
    if enter then
        SendQuestion()
    end
end)

continueBtn.Activated:Connect(function()
    if isSending then return end
    questionIn.Text = "Viết tiếp phần code còn lại của câu trả lời trước, KHÔNG lặp lại phần đã viết. Viết đầy đủ, không rút gọn."
    SendQuestion()
end)

copyAnswerBtn.Activated:Connect(function()
    local allText = ""
    local function extract(obj)
        local res = ""
        for _, c in ipairs(obj:GetChildren()) do
            if c:IsA("TextBox") and c.TextEditable == false then
                res = res..c.Text.."\n"
            elseif c:IsA("TextLabel") then
                res = res..c.Text.."\n"
            end
            if #c:GetChildren() > 0 then
                res = res..extract(c)
            end
        end
        return res
    end
    for _, child in ipairs(chatScroll:GetChildren()) do
        if child:IsA("Frame") then
            allText = allText..extract(child).."\n"
        end
    end
    if setclipboard then
        pcall(setclipboard, allText)
    elseif toclipboard then
        pcall(toclipboard, allText)
    end
    copyAnswerBtn.Text = "✅ Đã copy!"
    task.delay(1.5, function()
        if copyAnswerBtn and copyAnswerBtn.Parent then
            copyAnswerBtn.Text = "📋 Copy chat"
        end
    end)
end)

clearChatBtn.Activated:Connect(function()
    for _, child in ipairs(chatScroll:GetChildren()) do
        if not child:IsA("UIListLayout") and not child:IsA("UIPadding") then
            child:Destroy()
        end
    end
    AddMessage("🤖 Gemini", "Cuộc trò chuyện đã được xóa. Hãy đặt câu hỏi mới!", false)
    task.wait(0.1)
    chatScroll.CanvasPosition = Vector2.new(0, 0)
end)

aiTab.CanvasSize = UDim2.new(0, 0, 0, 0)
aiInner:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
    aiTab.CanvasSize = UDim2.new(0, 0, 0, aiInner.AbsoluteSize.Y + 20)
end)
task.defer(function()
    task.wait(0.5)
    aiTab.CanvasSize = UDim2.new(0, 0, 0, aiInner.AbsoluteSize.Y + 20)
end)

-- ==================== TAB 5: TẠO TÍNH NĂNG ====================
local featureTabs = {}
local featureTabIndex = 5

local function NormalizeCode(c)
    if type(c) ~= "string" then return "" end
    c = c:gsub("^%s+", ""):gsub("%s+$", "")
    if c:match("^https?://") then
        return 'loadstring(game:HttpGet("'..c..'"))()'
    end
    return c
end

local function ScanNewGuis(beforeGuis)
    local found = {}
    local function scan(container)
        if not container then return end
        for _, g in ipairs(container:GetChildren()) do
            if not beforeGuis[g] then
                beforeGuis[g] = true
                table.insert(found, g)
            end
        end
    end
    scan(playerGui)
    scan(targetGui)
    pcall(function()
        local cg = game:GetService("CoreGui")
        if cg and cg ~= targetGui then scan(cg) end
    end)
    return found
end

local function ForceStretchToParent(obj)
    if not obj then return end
    pcall(function()
        if obj:IsA("GuiObject") then
            if obj:IsA("Frame") or obj:IsA("ScrollingFrame") or obj:IsA("CanvasGroup") then
                local s = obj.Size
                if s.X.Scale < 0.9 and s.X.Offset > 0 then
                    obj.Size = UDim2.new(1, 0, s.Y.Scale > 0 and s.Y.Scale or 1, 0)
                end
                if obj.Position.X.Offset ~= 0 or obj.Position.Y.Offset ~= 0 then
                    obj.Position = UDim2.new(0, 0, 0, 0)
                end
            end
        end
    end)
    for _, child in ipairs(obj:GetChildren()) do
        ForceStretchToParent(child)
    end
end

local function RunFeatureScript(code, name, containerFrame, indicator, statusLabel)
    if #code == 0 then
        if statusLabel then statusLabel.Text = "⚠️ Vui lòng nhập code!" end
        return false, "empty"
    end

    code = NormalizeCode(code)

    if indicator then indicator.BackgroundColor3 = C.RED end
    if statusLabel then statusLabel.Text = "⏳ Đang thực thi..." end

    local ok, err = pcall(function()
        local fn, lerr = loadstring(code)
        if not fn then error("loadstring thất bại: "..tostring(lerr)) end

        local beforeGuis = {}
        for _, g in ipairs(playerGui:GetChildren()) do beforeGuis[g] = true end
        for _, g in ipairs(targetGui:GetChildren()) do beforeGuis[g] = true end
        pcall(function()
            local cg = game:GetService("CoreGui")
            if cg and cg ~= targetGui then
                for _, g in ipairs(cg:GetChildren()) do beforeGuis[g] = true end
            end
        end)

        fn()

        local newGuis = {}
        for i = 1, 12 do
            task.wait(0.2)
            local found = ScanNewGuis(beforeGuis)
            for _, g in ipairs(found) do table.insert(newGuis, g) end
            if #newGuis > 0 then break end
        end

        for _, g in ipairs(newGuis) do
            if g:IsA("ScreenGui") or g:IsA("Folder") then
                for _, existing in ipairs(containerFrame:GetChildren()) do
                    if existing.Name == "Embedded_"..g.Name then
                        existing:Destroy()
                    end
                end

                local host = New("Frame", {
                    Size = UDim2.new(1,0,1,0),
                    Position = UDim2.new(0,0,0,0),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    ZIndex = 5,
                    Name = "Embedded_"..g.Name,
                    ClipsDescendants = false,
                }, containerFrame)

                for _, child in ipairs(g:GetChildren()) do
                    pcall(function() child.Parent = host end)
                end
                pcall(function() g:Destroy() end)

                ForceStretchToParent(host)

                if not _G.BananaCatHub_EmbedHosts then
                    _G.BananaCatHub_EmbedHosts = {}
                end
                table.insert(_G.BananaCatHub_EmbedHosts, host)
            elseif g:IsA("GuiObject") then
                pcall(function()
                    g.Parent = containerFrame
                    g.ZIndex = 5
                    ForceStretchToParent(g)
                end)
            end
        end
    end)

    if ok then
        if indicator then indicator.BackgroundColor3 = C.GREEN end
        if statusLabel then statusLabel.Text = "✅ Hoàn thành!" end
        return true
    else
        if indicator then indicator.BackgroundColor3 = C.RED end
        if statusLabel then statusLabel.Text = "❌ Lỗi: "..tostring(err) end
        warn("[BananaCatHub] Feature script error:", err)
        return false, err
    end
end

local function CreateFeatureTab(name, icon, codeContent, preserveSource)
    if not name or #name == 0 then name = "Tính Năng " .. (#featureTabs + 1) end
    if not icon or #icon == 0 then icon = "⚙️" end

    if not preserveSource then codeContent = NormalizeCode(codeContent) end

    local sf = New("ScrollingFrame", {
        Size=UDim2.new(1,0,1,0),
        BackgroundTransparency=1,
        BorderSizePixel=0,
        ScrollBarThickness=5,
        ScrollBarImageColor3=Color3.fromRGB(120,120,140),
        ClipsDescendants=true,
        CanvasSize=UDim2.new(0,0,0,0),
        Visible=false,
        Active=true,
        Selectable=false,
        ScrollingDirection=Enum.ScrollingDirection.Y,
        ZIndex=4,
    }, contentArea)

    local btn = New("TextButton", {
        Size=UDim2.new(1,-8,0,30),
        Text=icon.." "..name,
        BackgroundColor3=C.BG,
        BackgroundTransparency=0.3,
        TextColor3=C.DARK,
        Font=Enum.Font.GothamBold,
        TextSize=9,
        BorderSizePixel=0,
        LayoutOrder=#tabs + 1,
        TextXAlignment=Enum.TextXAlignment.Left,
        ZIndex=4,
    }, tabBar)
    Corner(btn, UDim.new(0,6))

    local tabIdx = #tabs + 1
    btn.Activated:Connect(function()
        local currentIndex = table.find(tabContent, sf)
        if currentIndex then SwitchTab(currentIndex) end
    end)

    table.insert(tabs, btn)
    table.insert(tabContent, sf)
    tabBar.CanvasSize = UDim2.new(0, 0, 0, #tabs * 34 + 10)

    local featureData = {
        name = name,
        icon = icon,
        code = codeContent,
        btn = btn,
        frame = sf,
        tabIdx = tabIdx,
    }
    table.insert(featureTabs, featureData)

    local embedHost = New("Frame", {
        Size = UDim2.new(1,0,1,-36),
        Position = UDim2.new(0,0,0,0),
        BackgroundTransparency = 1,
        BorderSizePixel = 0,
        ZIndex = 5,
        Name = "ScriptHost",
        Visible = true,
    }, sf)

    local toolbar = New("Frame", {
        Size = UDim2.new(1,0,0,36),
        Position = UDim2.new(0,0,1,-36),
        BackgroundColor3 = Color3.fromRGB(230,233,242),
        BackgroundTransparency = 0.1,
        BorderSizePixel = 0,
        ZIndex = 20,
    }, sf)
    Corner(toolbar, UDim.new(0,6))
    Stroke(toolbar, Color3.fromRGB(180,185,200), 1)

    local runFeatureBtn = New("TextButton", {
        Size=UDim2.new(0,110,0,26), Position=UDim2.new(0,6,0,5),
        Text="▶ Chạy Script", BackgroundColor3=C.GREEN, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=21,
    }, toolbar)
    Corner(runFeatureBtn, UDim.new(0,5))

    local saveFeatureBtn = New("TextButton", {
        Size=UDim2.new(0,110,0,26), Position=UDim2.new(0,122,0,5),
        Text="💾 Lưu Vào DS", BackgroundColor3=C.BLUE, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=21,
    }, toolbar)
    Corner(saveFeatureBtn, UDim.new(0,5))

    local editFeatureBtn = New("TextButton", {
        Size=UDim2.new(0,80,0,26), Position=UDim2.new(0,238,0,5),
        Text="✏️ Sửa", BackgroundColor3=C.ORANGE, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=21,
    }, toolbar)
    Corner(editFeatureBtn, UDim.new(0,5))

    local closeFeatureBtn = New("TextButton", {
        Size=UDim2.new(0,40,0,26), Position=UDim2.new(1,-46,0,5),
        Text="✕", BackgroundColor3=C.RED, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=12, BorderSizePixel=0, ZIndex=21,
    }, toolbar)
    Corner(closeFeatureBtn, UDim.new(0,5))

    local fStatus = New("TextLabel", {
        Size=UDim2.new(0,180,0,26), Position=UDim2.new(0,324,0,5),
        Text="", BackgroundTransparency=1, TextColor3=Color3.fromRGB(220,170,0),
        Font=Enum.Font.GothamMedium, TextSize=9, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=21,
    }, toolbar)

    local editorFrame = New("Frame", {
        Size=UDim2.new(1,0,1,-36),
        Position=UDim2.new(0,0,0,0),
        BackgroundColor3=Color3.fromRGB(245,247,252),
        BackgroundTransparency=0,
        BorderSizePixel=0,
        ZIndex=30,
        Visible=false,
    }, sf)

    local editorBox = New("TextBox", {
        Size=UDim2.new(1,-16,1,-70), Position=UDim2.new(0,8,0,8),
        Text=codeContent,
        PlaceholderText="Dán script hoàn chỉnh HOẶC link raw vào đây...\nScript có thể tạo GUI riêng, GUI đó sẽ được nhúng vào tab này.",
        PlaceholderColor3=Color3.fromRGB(160,160,160),
        BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0,
        TextColor3=Color3.fromRGB(20,20,20),
        Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
        MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
        Active=true, Selectable=true, ZIndex=31,
    }, editorFrame)
    Corner(editorBox, UDim.new(0,5))
    Stroke(editorBox, Color3.fromRGB(100,120,200), 1.5)
    New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, editorBox)

    local applyEditBtn = New("TextButton", {
        Size=UDim2.new(0,120,0,26), Position=UDim2.new(0,8,1,-34),
        Text="✅ Áp Dụng", BackgroundColor3=C.GREEN, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=31,
    }, editorFrame)
    Corner(applyEditBtn, UDim.new(0,5))

    local cancelEditBtn = New("TextButton", {
        Size=UDim2.new(0,120,0,26), Position=UDim2.new(0,134,1,-34),
        Text="❌ Hủy", BackgroundColor3=C.RED, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=31,
    }, editorFrame)
    Corner(cancelEditBtn, UDim.new(0,5))

    local function ClearHost()
        for _, child in ipairs(embedHost:GetChildren()) do
            pcall(function() child:Destroy() end)
        end
    end

    runFeatureBtn.Activated:Connect(function()
        ClearHost()
        fStatus.Text = "⏳ Đang chạy..."
        RunFeatureScript(codeContent, name, embedHost, runFeatureBtn, fStatus)
    end)

    saveFeatureBtn.Activated:Connect(function()
        local c = codeContent
        if #c == 0 then
            fStatus.Text = "⚠️ Không có code!"
            return
        end
        local n = name
        local bn = n
        local cnt = 1
        while true do
            local ex = false
            for _, s in ipairs(scripts) do
                if s.name == n then ex = true; break end
            end
            if not ex then break end
            cnt += 1
            n = bn.." ("..cnt..")"
        end
        table.insert(scripts, {name = n, code = c, expanded = false})
        GitHubSync.Changed("scripts")
        if RebuildScripts then RebuildScripts() end
        fStatus.Text = "✅ Đã lưu!"
    end)

    editFeatureBtn.Activated:Connect(function()
        editorBox.Text = codeContent
        editorFrame.Visible = true
    end)

    applyEditBtn.Activated:Connect(function()
        codeContent = NormalizeCode(editorBox.Text)
        featureData.code = codeContent
        GitHubSync.Changed("features")
        editorFrame.Visible = false
        ClearHost()
        fStatus.Text = "✏️ Đã cập nhật code"
    end)

    cancelEditBtn.Activated:Connect(function()
        editorFrame.Visible = false
    end)

    closeFeatureBtn.Activated:Connect(function()
        ClearHost()
        SwitchTab(1)
    end)

    return featureData
end

task.spawn(function()
    task.wait(1)
    local lastSize = main.AbsoluteSize
    while main and main.Parent do
        task.wait(0.1)
        if main.AbsoluteSize ~= lastSize then
            lastSize = main.AbsoluteSize
            if _G.BananaCatHub_EmbedHosts then
                for _, host in ipairs(_G.BananaCatHub_EmbedHosts) do
                    if host and host.Parent then
                        pcall(function()
                            host.Size = UDim2.new(1, 0, 1, 0)
                            ForceStretchToParent(host)
                        end)
                    end
                end
            end
        end
    end
end)

local createFeatureTab = AddTab("Tạo Tính Năng", "➕", 5)

local cy = 8
Label(createFeatureTab, "➕ Tạo Tab Tính Năng Tích Hợp", cy)
cy = cy + 16
Label(createFeatureTab, "Dán NGUYÊN một script hoàn chỉnh HOẶC link raw.", cy)
cy = cy + 14
Label(createFeatureTab, "Script sẽ chạy trong tab, GUI sẽ được nhúng vào menu này.", cy)
cy = cy + 18

Label(createFeatureTab, "🏷️ Tên Tính Năng:", cy)
cy = cy + 14

local featureNameIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,26), Position=UDim2.new(0,8,0,cy), Text="",
    PlaceholderText="VD: Auto Farm, Fly, Speed...",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, createFeatureTab)
Corner(featureNameIn, UDim.new(0,5))
Stroke(featureNameIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, featureNameIn)

cy = cy + 32
Label(createFeatureTab, "🎨 Icon (1 ký tự, tùy chọn):", cy)
cy = cy + 14

local featureIconIn = New("TextBox", {
    Size=UDim2.new(0,60,0,26), Position=UDim2.new(0,8,0,cy), Text="⚙️",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.GothamBold, TextSize=14, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10,
}, createFeatureTab)
Corner(featureIconIn, UDim.new(0,5))
Stroke(featureIconIn, Color3.fromRGB(180,180,200), 1.2)

cy = cy + 32
Label(createFeatureTab, "📜 Dán Script Hoàn Chỉnh HOẶC link raw:", cy)
cy = cy + 14

local featureCodeIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,140), Position=UDim2.new(0,8,0,cy), Text="",
    PlaceholderText="Dán script hoặc link raw (https://...) vào đây...\nScript có thể tạo ScreenGui riêng, GUI đó sẽ được nhúng vào tab.",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(245,245,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
    MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
    Active=true, Selectable=true, ZIndex=10,
}, createFeatureTab)
Corner(featureCodeIn, UDim.new(0,5))
Stroke(featureCodeIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, featureCodeIn)

cy = cy + 146

local createTabBtn = Button(createFeatureTab, "➕ Tạo Tab Tính Năng", 8, cy, 180, 28, Color3.fromRGB(0,150,200))
local clearFormBtn = Button(createFeatureTab, "🧹 Xóa Form", 196, cy, 100, 28, C.ORANGE)
cy = cy + 34

local grabSizeCodeBtn = Button(createFeatureTab, "📏 Lấy Code Kích Thước (Auto-Lưu)", 8, cy, 280, 26, C.PURPLE)
cy = cy + 32

local createStatus = Label(createFeatureTab, "", cy)
createStatus.TextColor3=C.YELLOW; createStatus.TextSize=9; createStatus.ZIndex=6
cy = cy + 14

grabSizeCodeBtn.Activated:Connect(function()
    local currentCode = featureCodeIn.Text
    if #currentCode == 0 then
        createStatus.Text = "⚠️ Ô code đang trống, không có gì để lấy!"
        return
    end

    local wrappedCode = [[
-- ===== AUTO-GENERATED SIZE WRAPPER =====
local _AUTO_SIZE_WRAPPER = true

local function _ForceStretch(obj)
    if not obj then return end
    pcall(function()
        if obj:IsA("GuiObject") then
            if obj:IsA("Frame") or obj:IsA("ScrollingFrame") or obj:IsA("CanvasGroup") then
                obj.Size = UDim2.new(1, 0, 1, 0)
                obj.Position = UDim2.new(0, 0, 0, 0)
            end
        end
    end)
    for _, c in ipairs(obj:GetChildren()) do
        _ForceStretch(c)
    end
end

]] .. currentCode .. [[


task.defer(function()
    task.wait(0.5)
    for _, g in ipairs(game:GetService("CoreGui"):GetChildren()) do
        if g:IsA("ScreenGui") and g.Name ~= "ExMenu" then
            pcall(function() _ForceStretch(g) end)
        end
    end
    for _, g in ipairs(game.Players.LocalPlayer.PlayerGui:GetChildren()) do
        if g:IsA("ScreenGui") and g.Name ~= "ExMenu" then
            pcall(function() _ForceStretch(g) end)
        end
    end
end)
]]

    local saveName = "AutoSize_"..os.date("%H%M%S")
    local bn = saveName
    local cnt = 1
    while true do
        local ex = false
        for _, s in ipairs(scripts) do
            if s.name == saveName then ex = true; break end
        end
        if not ex then break end
        cnt += 1
        saveName = bn.." ("..cnt..")"
    end

    table.insert(scripts, {name = saveName, code = wrappedCode, expanded = false})
    GitHubSync.Changed("scripts")
    if RebuildScripts then RebuildScripts() end

    featureCodeIn.Text = wrappedCode
    featureNameIn.Text = "AutoSize_"..os.date("%H%M%S")

    createStatus.Text = "✅ Đã lấy code kích thước! Đã lưu vào 'Code Đã Lưu' với tên: "..saveName
end)

Label(createFeatureTab, "━━━━━━━━━━━━━━━━━━━━━━", cy)
cy = cy + 16
Label(createFeatureTab, "📋 Danh Sách Tab Tính Năng Đã Tạo:", cy)
cy = cy + 16

local featureListFrame = New("Frame", {
    Size=UDim2.new(1,-16,0,0), Position=UDim2.new(0,8,0,cy),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=6,
}, createFeatureTab)
New("UIListLayout", {SortOrder=Enum.SortOrder.LayoutOrder, Padding=UDim.new(0,4)}, featureListFrame)

local function RebuildFeatureList()
    for _, c in ipairs(featureListFrame:GetChildren()) do
        if not c:IsA("UIListLayout") then c:Destroy() end
    end

    if #featureTabs == 0 then
        New("TextLabel", {
            Size=UDim2.new(1,0,0,30),
            Text="📭 Chưa có tab tính năng nào.",
            BackgroundTransparency=1, TextColor3=C.GRAY, Font=Enum.Font.GothamMedium, TextSize=10,
            TextXAlignment=Enum.TextXAlignment.Center, TextYAlignment=Enum.TextYAlignment.Center, ZIndex=7,
        }, featureListFrame)
        createFeatureTab.CanvasSize = UDim2.new(0, 0, 0, cy + 50)
        return
    end

    local totalH = 0
    for i, ft in ipairs(featureTabs) do
        local row = New("Frame", {
            Size=UDim2.new(1,0,0,32), BackgroundColor3=Color3.fromRGB(255,255,255),
            BackgroundTransparency=0.1, BorderSizePixel=0, ZIndex=6,
        }, featureListFrame)
        Corner(row, UDim.new(0,5)); Stroke(row)

        New("TextLabel", {
            Size=UDim2.new(1,-90,1,0), Position=UDim2.new(0,8,0,0),
            Text=ft.icon.." "..ft.name, BackgroundTransparency=1, TextColor3=C.DARK,
            Font=Enum.Font.GothamBold, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
        }, row)

        local goBtn = New("TextButton", {
            Size=UDim2.new(0,50,0,22), Position=UDim2.new(1,-78,0,5),
            Text="➡ Mở", BackgroundColor3=C.BLUE, BackgroundTransparency=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(goBtn, UDim.new(0,4))
        goBtn.Activated:Connect(function()
            local currentIndex = table.find(tabContent, ft.frame)
            if currentIndex then SwitchTab(currentIndex) end
        end)

        local delBtn = New("TextButton", {
            Size=UDim2.new(0,24,0,22), Position=UDim2.new(1,-26,0,5),
            Text="🗑", BackgroundColor3=C.RED, BackgroundTransparency=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, row)
        Corner(delBtn, UDim.new(0,4))
        delBtn.Activated:Connect(function()
            local idx = nil
            for j, t in ipairs(tabs) do
                if t == ft.btn then idx = j; break end
            end
            if idx then
                if activeTab == ft.frame then SwitchTab(1) end
                ft.btn:Destroy()
                ft.frame:Destroy()
                table.remove(tabs, idx)
                table.remove(tabContent, idx)
                table.remove(featureTabs, i)
                GitHubSync.Changed("features")
                tabBar.CanvasSize = UDim2.new(0, 0, 0, #tabs * 34 + 10)
                for j, t in ipairs(tabs) do
                    t.LayoutOrder = j
                end
                for j, ft2 in ipairs(featureTabs) do
                    for k, t in ipairs(tabs) do
                        if t == ft2.btn then ft2.tabIdx = k; break end
                    end
                end
                RebuildFeatureList()
            end
        end)

        totalH = totalH + 36
    end

    featureListFrame.Size = UDim2.new(1,-16,0,totalH)
    createFeatureTab.CanvasSize = UDim2.new(0, 0, 0, cy + totalH + 30)
end

createTabBtn.Activated:Connect(function()
    local n = featureNameIn.Text
    local ic = featureIconIn.Text
    local c = featureCodeIn.Text

    if #n == 0 then
        createStatus.Text = "⚠️ Vui lòng nhập tên tính năng!"
        return
    end
    if #c == 0 then
        createStatus.Text = "⚠️ Vui lòng dán script!"
        return
    end

    for _, ft in ipairs(featureTabs) do
        if ft.name == n then
            createStatus.Text = "⚠️ Tên tính năng đã tồn tại!"
            return
        end
    end

    CreateFeatureTab(n, ic, c)
    RebuildFeatureList()
    GitHubSync.Changed("features")

    createStatus.Text = "✅ Đã tạo tab: "..n
    featureNameIn.Text = ""
    featureIconIn.Text = "⚙️"
    featureCodeIn.Text = ""

    SwitchTab(#tabs)
end)

clearFormBtn.Activated:Connect(function()
    featureNameIn.Text = ""
    featureIconIn.Text = "⚙️"
    featureCodeIn.Text = ""
    createStatus.Text = "🧹 Đã xóa form"
end)

RebuildFeatureList()

-- ==================== TAB 6: GITHUB — OPTIONAL CLOUD STORAGE ====================
do
    -- A separate function keeps the original chunk below Luau's local-register limit.
    local function InitializeGitHub()
        -- BEGIN GITHUB STORAGE CORE (dependency-injected; never executes downloaded code)
        local function CreateGitHubStore(deps)
            local store = {}
            local token, epoch = "", 0
            local target = {repo="", branch="", codePath="banana-cat/saved-code.json", featureFolder="banana-cat/features"}
            local known = {}
            local MAX_FILE, MAX_BATCH, MAX_RECORDS = 900 * 1024, 4 * 1024 * 1024, 200
            local formats = {scripts="banana-cat-hub/scripts", features="banana-cat-hub/features"}

            local function fail(message) error(message, 0) end
            local function trim(text) return (text:gsub("^%s+", ""):gsub("%s+$", "")) end
            local function text(value, label, limit, empty)
                if type(value) ~= "string" or #value > limit or (not empty and #value == 0) or not utf8.len(value) then
                    fail(label.." không hợp lệ hoặc quá dài.")
                end
                return value
            end
            local function path(value, allowEmpty)
                value = trim(text(value, "Đường dẫn", 400, allowEmpty))
                if value == "" and allowEmpty then return value end
                if value == "" or value:find("[%c\\]") or value:sub(1,1) == "/" or value:sub(-1) == "/" or value:find("//",1,true) then
                    fail("Dùng đường dẫn tương đối trong kho, không dùng / đầu dòng, \\ hoặc ký tự điều khiển.")
                end
                for part in value:gmatch("[^/]+") do
                    if part == "." or part == ".." or part:lower() == ".git" then fail("Đường dẫn không được chứa . / .. / .git.") end
                end
                return value
            end
            local function repoName(value)
                value = trim(text(value, "Tên kho", 300, false)):gsub("^https://github%.com/", ""):gsub("/+$", ""):gsub("%.git$", "")
                if not value:match("^[%w_.-]+/[%w_.-]+$") then fail("Nhập kho theo dạng owner/repository.") end
                return value
            end
            local function escape(value)
                return (value:gsub("([^%w%-%._~])", function(char) return string.format("%%%02X", string.byte(char)) end))
            end
            local function escapePath(value)
                local parts = {}
                for part in value:gmatch("[^/]+") do table.insert(parts, escape(part)) end
                return table.concat(parts, "/")
            end
            local function array(value, label)
                if type(value) ~= "table" then fail(label.." phải là danh sách.") end
                local count = 0
                for key in pairs(value) do
                    if type(key) ~= "number" or key < 1 or key % 1 ~= 0 then fail(label.." không đúng cấu trúc.") end
                    count += 1
                end
                if count ~= #value or count > MAX_RECORDS then fail(label.." không liên tục hoặc vượt 200 mục.") end
                return value
            end
            local function identifier(value)
                text(value, "ID", 100, false)
                if not value:match("^[%w_-]+$") then fail("ID chỉ được chứa chữ, số, dấu - và _.") end
                return value
            end
            local function filename(value)
                value = path(value)
                if not (value:lower():match("%.lua$") or value:lower():match("%.luau$")) then fail("File tính năng phải có đuôi .lua hoặc .luau.") end
                return value
            end
            local function jsonDecode(value, label)
                local ok, result = pcall(deps.decode, value)
                if not ok or type(result) ~= "table" then fail(label.." không phải JSON hợp lệ. Không ghi đè file này.") end
                return result
            end
            local function jsonEncode(value)
                local ok, result = pcall(deps.encode, value)
                if not ok or type(result) ~= "string" then fail("Không mã hóa được dữ liệu UTF-8 sang JSON.") end
                return result
            end
            local function base64Decode(value)
                if type(value) ~= "string" then fail("GitHub không trả nội dung base64.") end
                value = value:gsub("%s", "")
                if #value % 4 ~= 0 or #value > math.ceil(MAX_FILE / 3) * 4 then fail("Nội dung base64 quá lớn hoặc không hợp lệ.") end
                local alphabet, lookup, output = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", {}, {}
                for i = 1, #alphabet do lookup[alphabet:sub(i,i)] = i - 1 end
                for i = 1, #value, 4 do
                    local a,b,c,d = value:sub(i,i), value:sub(i+1,i+1), value:sub(i+2,i+2), value:sub(i+3,i+3)
                    if lookup[a] == nil or lookup[b] == nil or (c ~= "=" and lookup[c] == nil) or (d ~= "=" and lookup[d] == nil)
                        or (c == "=" and d ~= "=") or ((c == "=" or d == "=") and i + 3 ~= #value) then
                        fail("Nội dung base64 không hợp lệ.")
                    end
                    local bits = lookup[a] * 262144 + lookup[b] * 4096 + (lookup[c] or 0) * 64 + (lookup[d] or 0)
                    table.insert(output, string.char(math.floor(bits / 65536)))
                    if c ~= "=" then table.insert(output, string.char(math.floor(bits / 256) % 256)) end
                    if d ~= "=" then table.insert(output, string.char(bits % 256)) end
                end
                return table.concat(output)
            end
            local function api(method, endpoint, body, allowMissing)
                if token == "" then fail("Chưa kết nối GitHub. Nhập PAT và bấm Kết nối.") end
                local requestEpoch = epoch
                local options = {
                    Url="https://api.github.com"..endpoint, Method=method,
                    Headers={Authorization="Bearer "..token, Accept="application/vnd.github+json", ["X-GitHub-Api-Version"]="2022-11-28", ["User-Agent"]="BananaCatHub-GitHub/1.0"},
                }
                if body then options.Body = jsonEncode(body); options.Headers["Content-Type"] = "application/json" end
                local ok, response = pcall(deps.request, options)
                -- Never display transport exceptions: some executors include request headers in them.
                if requestEpoch ~= epoch then fail("Kết nối đã đổi. Yêu cầu cũ có thể đã hoàn tất; kiểm tra GitHub trước khi thử lại.") end
                if not ok or type(response) ~= "table" then fail("Không gọi được GitHub. Cần HTTPS request hỗ trợ Authorization trong môi trường đang dùng.") end
                local status = tonumber(response.StatusCode or response.status_code or response.status)
                if status == 404 and allowMissing then return nil end
                if not status or status < 200 or status >= 300 then
                    if status == 401 then fail("GitHub 401: PAT sai, hết hạn hoặc đã thu hồi.") end
                    if status == 403 then fail("GitHub 403: thiếu quyền Contents, cần duyệt SSO, hoặc đã chạm giới hạn API. Kiểm tra quyền và thử lại sau.") end
                    if status == 404 then fail("GitHub 404: không tìm thấy kho/nhánh/file, hoặc PAT chưa được cấp quyền truy cập.") end
                    if status == 409 or status == 422 then fail("GitHub "..status..": nhánh đã đổi, kho rỗng hoặc nhánh được bảo vệ. Nạp lại dữ liệu; không ép ghi đè.") end
                    if status == 429 then fail("GitHub 429: vượt giới hạn API. Chờ rồi thử lại, dữ liệu máy vẫn được giữ.") end
                    fail("GitHub HTTP "..tostring(status or "?")..". Chưa xác nhận lưu; kiểm tra GitHub trước khi thử lại.")
                end
                local responseBody = response.Body or response.body or ""
                if #responseBody > 2 * MAX_BATCH then fail("Phản hồi GitHub quá lớn.") end
                if responseBody == "" then return {} end
                return jsonDecode(responseBody, "Phản hồi GitHub")
            end
            local function ready()
                if token == "" then fail("Chưa kết nối GitHub.") end
                if target.repo == "" or target.branch == "" then fail("Chọn kho và áp dụng nhánh trước.") end
                return "/repos/"..target.repo
            end
            local function head()
                local data = api("GET", ready().."/git/ref/heads/"..escapePath(target.branch))
                if not (data.object and type(data.object.sha) == "string") then fail("Không đọc được HEAD của nhánh. Kho cần có commit đầu tiên, ví dụ README.") end
                return data.object.sha
            end
            local function readAt(filePath, ref)
                filePath = path(filePath)
                local data = api("GET", ready().."/contents/"..escapePath(filePath).."?ref="..escape(ref), nil, true)
                if not data then return false end
                if data.type ~= "file" or data.encoding ~= "base64" or type(data.size) ~= "number" or data.size > MAX_FILE then
                    fail(filePath..": cần file văn bản thường, không phải thư mục/link, tối đa 900 KiB.")
                end
                return text(base64Decode(data.content), filePath, MAX_FILE, true)
            end
            local function record(value, kind, withCode)
                if type(value) ~= "table" then fail("Mục lưu không hợp lệ.") end
                local result = {id=identifier(value.id), name=text(value.name, "Tên mục", 200, false)}
                if kind == "features" then
                    result.icon = text(value.icon or "⚙️", "Icon", 64, false)
                    result.file = filename(value.file)
                end
                if kind == "scripts" or withCode then result.code = text(value.code, "Code", MAX_FILE, false) end
                return result
            end
            local function records(values, kind, withCode)
                local result, ids, files = {}, {}, {}
                for _, value in ipairs(array(values, "Danh sách "..kind)) do
                    local item = record(value, kind, withCode)
                    if ids[item.id] then fail("Trùng ID trong danh sách "..kind..".") end
                    if kind == "features" and files[item.file] then fail("Hai tính năng đang chọn cùng một file: "..item.file) end
                    ids[item.id] = true
                    if item.file then files[item.file] = true end
                    table.insert(result, item)
                end
                return result
            end
            local function document(content, kind)
                if content == false then return {} end
                local data = jsonDecode(content, "File "..kind)
                if data.format ~= formats[kind] or data.version ~= 1 then fail("File không đúng định dạng Banana Cat "..kind.." v1. Chọn file khác; không ghi đè.") end
                return records(data[kind], kind, false)
            end
            local function manifestPath() return target.featureFolder.."/index.json" end
            local function checkAncestors(filePath, ref, checked)
                local parts, prefix = {}, ""
                for part in filePath:gmatch("[^/]+") do table.insert(parts, part) end
                for index = 1, #parts - 1 do
                    prefix = prefix == "" and parts[index] or prefix.."/"..parts[index]
                    if not checked[prefix] then
                        local entry = api("GET", ready().."/contents/"..escapePath(prefix).."?ref="..escape(ref), nil, true)
                        if entry and entry.type then fail(prefix.." đang là file/link, không thể dùng làm thư mục. Chưa ghi đè.") end
                        checked[prefix] = true
                        if not entry then break end -- A missing parent cannot contain any existing descendants at this commit.
                    end
                end
            end
            local function guardedRead(filePath, ref)
                local content = readAt(filePath, ref)
                if content ~= false and known[filePath] == nil then fail(filePath.." đã tồn tại. Bấm Nhập từ GitHub trước khi lưu vào file này.") end
                if known[filePath] ~= nil and known[filePath] ~= content then fail(filePath.." đã thay đổi trên GitHub. Nạp lại để giữ cả hai bản; chưa ghi đè.") end
                return content
            end
            local function merge(remote, incoming, kind)
                local result, positions, changed = {}, {}, false
                for _, item in ipairs(remote) do table.insert(result, item); positions[item.id] = #result end
                for _, value in ipairs(incoming) do
                    local item = record(value, kind, false)
                    local index = positions[item.id]
                    local previous = index and result[index]
                    if not previous or previous.name ~= item.name or previous.code ~= item.code or previous.icon ~= item.icon or previous.file ~= item.file then
                        changed = true
                    end
                    if index then result[index] = item else table.insert(result, item); positions[item.id] = #result end
                end
                -- Missing local records are deliberately retained remotely. A local delete is not a cloud delete.
                return records(result, kind, false), changed
            end

            function store:ValidatePaths(codePath, featureFolder)
                codePath, featureFolder = path(codePath), path(featureFolder)
                if not codePath:lower():match("%.json$") then fail("File Code Đã Lưu cần có đuôi .json.") end
                if codePath == featureFolder.."/index.json" then fail("File Code Đã Lưu không được trùng index.json của tính năng.") end
                if featureFolder == codePath or featureFolder:sub(1,#codePath+1) == codePath.."/" then fail("Không thể dùng file Code Đã Lưu làm thư mục tính năng.") end
                return codePath, featureFolder
            end
            function store:Configure(repo, branch, codePath, featureFolder)
                repo = repoName(repo)
                branch = trim(text(branch, "Nhánh", 200, false))
                if branch == "" or branch:find("[%c\\]") then fail("Tên nhánh không hợp lệ.") end
                codePath, featureFolder = self:ValidatePaths(codePath, featureFolder)
                if target.repo ~= repo or target.branch ~= branch then known = {} end
                if target.repo ~= repo or target.branch ~= branch or target.codePath ~= codePath or target.featureFolder ~= featureFolder then epoch += 1 end
                target = {repo=repo, branch=branch, codePath=codePath, featureFolder=featureFolder}
                return self:GetTarget()
            end
            function store:GetTarget()
                return {repo=target.repo, branch=target.branch, codePath=target.codePath, featureFolder=target.featureFolder}
            end
            function store:IsConnected() return token ~= "" end
            function store:CheckTarget() return head() end
            function store:Disconnect() token=""; epoch+=1; known={} end
            function store:Connect(value)
                value = trim(text(value, "PAT", 300, false))
                if not (value:match("^ghp_[%w_]+$") or value:match("^github_pat_[%w_]+$")) then fail("Nhập Personal Access Token dạng ghp_... hoặc github_pat_...") end
                token=value; epoch+=1; known={}
                local ok, user = pcall(function() return api("GET", "/user") end)
                if not ok then token=""; error(user,0) end
                if type(user.login) ~= "string" then token=""; fail("Không xác định được tài khoản GitHub.") end
                return user.login
            end
            function store:ListRepositories(page)
                page = math.max(1, math.floor(tonumber(page) or 1))
                return api("GET", "/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member&page="..page)
            end
            function store:GetRepository(repo)
                return api("GET", "/repos/"..repoName(repo))
            end
            function store:ListBranches(repo, page)
                page = math.max(1, math.floor(tonumber(page) or 1))
                return api("GET", "/repos/"..repoName(repo).."/branches?per_page=100&page="..page)
            end
            function store:ListDirectory(directory)
                directory = path(directory or "", true)
                local result = api("GET", ready().."/contents/"..escapePath(directory).."?ref="..escape(target.branch))
                if result.type then fail("Đường dẫn duyệt phải là thư mục.") end
                return result
            end
            function store:ReadTextFile(filePath)
                local result = readAt(filePath, head())
                if result == false then fail("Không tìm thấy file cần nhập.") end
                if result == "" then fail("File cần nhập đang trống.") end
                return result
            end
            function store:SuggestedFile(name, id)
                local slug = name:lower():gsub("[^%w_-]+", "-"):gsub("^-+", ""):gsub("-+$", ""):sub(1,40)
                if slug == "" then slug = "feature" end
                return slug.."-"..identifier(id)..".lua"
            end
            function store:ValidateFeatureFile(value) return filename(value) end
            function store:Load(kind)
                if kind ~= "scripts" and kind ~= "features" and kind ~= "all" then fail("Loại nhập không hợp lệ.") end
                local ref, staged, bundle, bytes = head(), {}, {}, 0
                if kind == "scripts" or kind == "all" then
                    local content = readAt(target.codePath, ref)
                    bundle.scripts = document(content, "scripts")
                    staged[target.codePath] = content
                    bytes += content and #content or 0
                end
                if kind == "features" or kind == "all" then
                    local filePath = manifestPath()
                    local content = readAt(filePath, ref)
                    local items = document(content, "features")
                    staged[filePath] = content
                    bytes += content and #content or 0
                    for _, item in ipairs(items) do
                        local fullPath = path(target.featureFolder.."/"..item.file)
                        local code = readAt(fullPath, ref)
                        if code == false or code == "" then fail("Thiếu code của tính năng: "..fullPath..". Chưa nhập mục nào.") end
                        item.code = code
                        staged[fullPath] = code
                        bytes += #code
                        if bytes > MAX_BATCH then fail("Tổng dữ liệu vượt 4 MiB. Chia thành nhiều kho/thư mục nhỏ hơn.") end
                    end
                    bundle.features = items
                end
                for filePath, content in pairs(staged) do known[filePath] = content end
                return bundle
            end
            function store:PrepareSave(bundle)
                if type(bundle) ~= "table" then fail("Dữ liệu lưu không hợp lệ.") end
                local localScripts = bundle.scripts and records(bundle.scripts, "scripts", false)
                local localFeatures = bundle.features and records(bundle.features, "features", true)
                if not localScripts and not localFeatures then fail("Chọn dữ liệu cần lưu.") end
                local ref, writes, totalBytes, checkedParents = head(), {}, 0, {}
                local function propose(filePath, content, previous)
                    if #content > MAX_FILE then fail(filePath.." vượt 900 KiB. Không ghi dữ liệu bị cắt.") end
                    totalBytes += #content
                    if totalBytes > MAX_BATCH then fail("Một lần lưu tối đa 4 MiB. Chia thành các lần lưu nhỏ hơn.") end
                    if content ~= previous then
                        checkAncestors(filePath, ref, checkedParents)
                        for _, other in ipairs(writes) do
                            if filePath == other.path or filePath:sub(1,#other.path+1) == other.path.."/" or other.path:sub(1,#filePath+1) == filePath.."/" then
                                fail("Một đường dẫn file không được trùng hoặc làm thư mục cho file khác: "..filePath)
                            end
                        end
                        table.insert(writes, {path=filePath, content=content, isNew=previous == false})
                    end
                end
                if localScripts and #localScripts > 0 then
                    local previous = guardedRead(target.codePath, ref)
                    local combined, changed = merge(document(previous, "scripts"), localScripts, "scripts")
                    if changed then propose(target.codePath, jsonEncode({format=formats.scripts, version=1, scripts=combined}), previous) end
                end
                if localFeatures and #localFeatures > 0 then
                    local indexPath = manifestPath()
                    local previous = guardedRead(indexPath, ref)
                    local combined, changed = merge(document(previous, "features"), localFeatures, "features")
                    -- Validate every destination before constructing a tree. Never reuse another feature's path.
                    for _, item in ipairs(localFeatures) do
                        local fullPath = path(target.featureFolder.."/"..item.file)
                        if fullPath == target.codePath or fullPath == indexPath then fail("Đường dẫn lưu bị trùng: "..fullPath) end
                        local oldCode = guardedRead(fullPath, ref)
                        propose(fullPath, item.code, oldCode)
                    end
                    if changed then propose(indexPath, jsonEncode({format=formats.features, version=1, features=combined}), previous) end
                end
                local baseTree
                if #writes > 0 then
                    local commit = api("GET", ready().."/git/commits/"..escape(ref))
                    baseTree = commit.tree and commit.tree.sha
                    if type(baseTree) ~= "string" then fail("Không đọc được cây file gốc.") end
                end
                return {repo=target.repo, branch=target.branch, epoch=epoch, head=ref, baseTree=baseTree, writes=writes, used=false}
            end
            function store:Commit(plan)
                ready()
                if type(plan) ~= "table" or plan.used or plan.epoch ~= epoch or plan.repo ~= target.repo or plan.branch ~= target.branch then
                    fail("Kế hoạch lưu đã hết hiệu lực. Xem lại và xác nhận một kế hoạch mới.")
                end
                plan.used = true
                if #plan.writes == 0 then return {count=0, sha=plan.head} end
                if head() ~= plan.head then fail("Nhánh vừa có commit mới. Nạp lại rồi lưu, không ghi đè thay đổi của người khác.") end
                local treeEntries = {}
                for _, item in ipairs(plan.writes) do
                    table.insert(treeEntries, {path=item.path, mode="100644", type="blob", content=item.content})
                end
                local root = ready()
                local tree = api("POST", root.."/git/trees", {base_tree=plan.baseTree, tree=treeEntries})
                if type(tree.sha) ~= "string" then fail("GitHub chưa xác nhận tạo cây file.") end
                local commit = api("POST", root.."/git/commits", {message="Banana Cat Hub: save library ("..#treeEntries.." files)", tree=tree.sha, parents={plan.head}})
                if type(commit.sha) ~= "string" then fail("GitHub chưa xác nhận tạo commit.") end
                -- One atomic, non-forced branch update publishes all files together. No DELETE calls.
                api("PATCH", root.."/git/refs/heads/"..escapePath(target.branch), {sha=commit.sha, force=false})
                for _, item in ipairs(plan.writes) do known[item.path] = item.content end
                return {count=#treeEntries, sha=commit.sha}
            end
            return store
        end
        -- END GITHUB STORAGE CORE

        -- BEGIN GITHUB UI / LIBRARY BRIDGE
        local alive, busy, configured, updatingFields = true, false, false, false
        local contextVersion, autoTicket = 0, 0
        local autoSave, pendingSave = false, nil
        local revisions, savedRevisions = {scripts=0, features=0}, {scripts=0, features=0}
        local RefreshFeatures, QueueAutoSave, SetStatus, UpdateSummary
        local selectedFeature, lastFeatureFile, draftToken, maskedToken, changingToken = nil, nil, "", false, false
        local settingsFile = "banana_cat_github_settings.json"

        local function trim(value) return (value:gsub("^%s+", ""):gsub("%s+$", "")) end
        local function newId() return HttpService:GenerateGUID(false) end
        local function RequestGitHub(options)
            -- Executor transports are optional. No token is ever sent to a proxy or arbitrary host.
            local transport = type(request) == "function" and request or http_request
            if type(transport) ~= "function" and type(syn) == "table" then transport = syn.request end
            if type(transport) ~= "function" and type(http) == "table" then transport = http.request end
            if type(transport) == "function" then return transport(options) end
            -- Roblox supplies its own User-Agent and may reject overriding this protected header.
            local robloxOptions = table.clone(options)
            robloxOptions.Headers = table.clone(options.Headers)
            robloxOptions.Headers["User-Agent"] = nil
            return HttpService:RequestAsync(robloxOptions)
        end
        local store = CreateGitHubStore({
            request=RequestGitHub,
            encode=function(value) return HttpService:JSONEncode(value) end,
            decode=function(value) return HttpService:JSONDecode(value) end,
        })
        local settings = {}
        if readfile and isfile then
            pcall(function()
                if isfile(settingsFile) then
                    local data = readfile(settingsFile)
                    if #data <= 4096 then
                        local parsed = HttpService:JSONDecode(data)
                        if type(parsed) == "table" and parsed.version == 1 then
                            for _, key in ipairs({"repo", "branch", "codePath", "featureFolder"}) do
                                if type(parsed[key]) == "string" and #parsed[key] <= 400 then settings[key] = parsed[key] end
                            end
                        end
                    end
                end
            end)
        end

        local githubTab = AddTab("GitHub", "🐙", 6)
        githubTab.AutomaticCanvasSize = Enum.AutomaticSize.Y
        githubTab.CanvasSize = UDim2.new(0,0,0,0)
        local column = New("Frame", {
            Size=UDim2.new(1,-20,0,0), Position=UDim2.new(0,8,0,8), AutomaticSize=Enum.AutomaticSize.Y,
            BackgroundTransparency=1, BorderSizePixel=0, ZIndex=5,
        }, githubTab)
        New("UIListLayout", {Padding=UDim.new(0,7), SortOrder=Enum.SortOrder.LayoutOrder}, column)
        New("UIPadding", {PaddingBottom=UDim.new(0,24)}, column)
        local order = 0
        local function ordered(object)
            order += 1
            object.LayoutOrder = order
            return object
        end
        local function Note(message, color, bold)
            return ordered(New("TextLabel", {
                Size=UDim2.new(1,0,0,0), AutomaticSize=Enum.AutomaticSize.Y,
                BackgroundTransparency=1, Text=message, TextWrapped=true, TextColor3=color or C.DARK,
                TextSize=11, Font=bold and Enum.Font.GothamBold or Enum.Font.GothamMedium,
                TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top, ZIndex=6,
            }, column))
        end
        local function Field(title, placeholder, value)
            Note(title, C.BLUE, true)
            local box = ordered(New("TextBox", {
                Size=UDim2.new(1,0,0,28), Text=value or "", PlaceholderText=placeholder,
                PlaceholderColor3=C.GRAY, BackgroundColor3=C.WHITE, TextColor3=C.DARK,
                Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
                TextXAlignment=Enum.TextXAlignment.Left, ZIndex=8,
            }, column))
            Corner(box, UDim.new(0,5)); Stroke(box)
            New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingRight=UDim.new(0,6)}, box)
            return box
        end
        local function Buttons(specs, parent)
            local row = New("Frame", {Size=UDim2.new(1,0,0,29), BackgroundTransparency=1, ZIndex=6}, parent or column)
            if not parent then ordered(row) else row.LayoutOrder = 2 end
            local result = {}
            for index, spec in ipairs(specs) do
                local button = New("TextButton", {
                    Size=UDim2.new(1/#specs,-5,1,0), Position=UDim2.new((index-1)/#specs,0,0,0),
                    Text=spec[1], BackgroundColor3=spec[2] or C.BLUE, TextColor3=C.WHITE,
                    Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
                }, row)
                Corner(button, UDim.new(0,5))
                table.insert(result, button)
            end
            return table.unpack(result)
        end
        local function Picker(height)
            local list = ordered(New("ScrollingFrame", {
                Size=UDim2.new(1,0,0,height), BackgroundColor3=C.WHITE, BackgroundTransparency=0.15,
                BorderSizePixel=0, ScrollBarThickness=4, AutomaticCanvasSize=Enum.AutomaticSize.Y,
                CanvasSize=UDim2.new(0,0,0,0), ScrollingDirection=Enum.ScrollingDirection.Y, Visible=false, ZIndex=6,
            }, column))
            Corner(list, UDim.new(0,5))
            New("UIListLayout", {Padding=UDim.new(0,3), SortOrder=Enum.SortOrder.LayoutOrder}, list)
            return list
        end
        local function ClearPicker(list)
            for _, child in ipairs(list:GetChildren()) do if not child:IsA("UIListLayout") and not child:IsA("UICorner") then child:Destroy() end end
            list.CanvasPosition = Vector2.new(0,0)
        end
        local function PickItem(list, caption, callback)
            local button = New("TextButton", {
                Size=UDim2.new(1,-6,0,29), BackgroundColor3=Color3.fromRGB(225,233,250),
                Text=caption, TextColor3=C.DARK, TextSize=10, Font=Enum.Font.GothamMedium,
                TextXAlignment=Enum.TextXAlignment.Left, TextTruncate=Enum.TextTruncate.AtEnd,
                BorderSizePixel=0, ZIndex=7,
            }, list)
            New("UIPadding", {PaddingLeft=UDim.new(0,6)}, button)
            button.Activated:Connect(callback)
        end

        Note("🐙 GitHub — Lưu thư viện & khôi phục", C.PURPLE, true)
        Note("Code Đã Lưu → một file JSON. Tính năng → nhiều file Lua + index.json. Nhập về chỉ thêm dữ liệu/tab, KHÔNG tự chạy code.")
        local status = Note("Chưa kết nối. Các chức năng cũ vẫn dùng bình thường.", C.GRAY)
        local tokenIn = Field("1. Personal Access Token (PAT)", "ghp_... hoặc github_pat_...", "")
        local connectBtn, showTokenBtn, disconnectBtn = Buttons({{"Kết nối",C.GREEN}, {"Hiện nháp",C.ORANGE}, {"Ngắt / Xóa token",C.RED}})
        local account = Note("Token chỉ giữ trong RAM của phiên này; kết nối xong sẽ xóa ô nhập.", C.GRAY)
        Note("Fine-grained PAT: chọn kho, cấp Contents: Read and write. PAT cổ điển: public_repo cho kho công khai hoặc repo cho kho riêng. Không gửi token vào chat; nên dùng kho riêng cho code cá nhân.", C.GRAY)

        local repoIn = Field("2. Kho lưu trữ", "owner/repository", settings.repo or "")
        local repoListBtn, repoPrevBtn, repoNextBtn = Buttons({{"Chọn kho",C.BLUE}, {"← Trang kho",C.GRAY}, {"Trang kho →",C.GRAY}})
        local repoList = Picker(115)
        local branchIn = Field("Nhánh đã có trong kho", "Mặc định theo kho được chọn", settings.branch or "")
        local branchListBtn, branchPrevBtn, branchNextBtn = Buttons({{"Chọn nhánh",C.BLUE}, {"← Trang nhánh",C.GRAY}, {"Trang nhánh →",C.GRAY}})
        local branchList = Picker(90)
        local codePathIn = Field("3. Một file JSON chứa toàn bộ Code Đã Lưu", "banana-cat/saved-code.json", settings.codePath or "banana-cat/saved-code.json")
        local folderIn = Field("Thư mục chứa các file tính năng", "banana-cat/features", settings.featureFolder or "banana-cat/features")
        local applyTargetBtn = Buttons({{"Áp dụng kho / nhánh / đường dẫn",C.PURPLE}})
        local targetInfo = Note("Chưa áp dụng đích lưu. Đường dẫn mới sẽ được tạo trong commit khi lưu.", C.GRAY)
        Note("Nếu file đã có trên GitHub, hãy NHẬP trước khi lưu. Dữ liệu khác nội dung được giữ thành hai bản. Xóa trên máy không xóa file/mục trên GitHub; đổi tên file cũng giữ file cũ.", C.ORANGE)

        local directoryIn = Field("Duyệt file/thư mục có sẵn (để trống = gốc kho)", "banana-cat", "")
        local browseBtn, upBtn, useFolderBtn = Buttons({{"Duyệt",C.BLUE}, {"Lên thư mục",C.GRAY}, {"Dùng thư mục",C.PURPLE}})
        local fileList = Picker(125)
        Note("Chạm thư mục để mở; chạm .json để chọn file Code Đã Lưu; chạm file Lua để điền ô nhập bên dưới. Sau khi đổi đích lưu, bấm Áp dụng.", C.GRAY)

        Note("4. Lưu & nhập thư viện", C.BLUE, true)
        local saveScriptsBtn, saveFeaturesBtn, saveAllBtn = Buttons({{"Lưu Code",C.GREEN}, {"Lưu tính năng",C.GREEN}, {"Lưu cả hai",C.BLUE}})
        local loadScriptsBtn, loadFeaturesBtn, loadAllBtn = Buttons({{"Nhập Code",C.PURPLE}, {"Nhập tính năng",C.PURPLE}, {"Nhập cả hai",C.BLUE}})
        local autoBtn = Buttons({{"Tự lưu khi thêm / sửa: TẮT",C.GRAY}})
        Note("Bật Tự lưu để các nút Lưu Vào Danh Sách, Lưu Vào DS, AutoSize và thao tác tạo/sửa tính năng tự ghi GitHub. Mặc định tắt; vẫn có thể lưu thủ công.", C.GRAY)
        local summary = Note("", C.GRAY)
        local confirmation = ordered(New("Frame", {
            Size=UDim2.new(1,0,0,0), AutomaticSize=Enum.AutomaticSize.Y,
            BackgroundColor3=Color3.fromRGB(255,242,211), BorderSizePixel=0, Visible=false, ZIndex=6,
        }, column))
        Corner(confirmation, UDim.new(0,5))
        New("UIListLayout", {Padding=UDim.new(0,6), SortOrder=Enum.SortOrder.LayoutOrder}, confirmation)
        local planLabel = New("TextLabel", {
            Size=UDim2.new(1,-8,0,0), AutomaticSize=Enum.AutomaticSize.Y, BackgroundTransparency=1,
            Text="", TextWrapped=true, TextColor3=C.DARK, Font=Enum.Font.Code, TextSize=10,
            TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top, ZIndex=7, LayoutOrder=1,
        }, confirmation)
        local confirmBtn, cancelSaveBtn = Buttons({{"Xác nhận ghi GitHub",C.GREEN}, {"Hủy kế hoạch",C.RED}}, confirmation)

        Note("5. Đặt file riêng cho từng tính năng", C.BLUE, true)
        local featurePicker = Picker(110)
        featurePicker.Visible = true
        local featureFileIn = Field("File tương đối trong thư mục tính năng", "auto-farm.lua hoặc tools/esp.luau", "")
        local setFeatureFileBtn, saveOneFeatureBtn = Buttons({{"Đặt tên file",C.PURPLE}, {"Lưu tính năng đã chọn",C.GREEN}})

        local importPathIn = Field("6. Nhập code từ một file có sẵn trên GitHub", "scripts/example.lua", "")
        local importCodeBtn, importFeatureBtn = Buttons({{"Nhập vào Code Đã Lưu",C.BLUE}, {"Nhập thành tính năng",C.PURPLE}})
        Note("Nhập file văn bản là thao tác đọc, không thực thi. Giới hạn: 900 KiB/file, 200 mục/danh sách, 4 MiB/lần. Kho cần có commit đầu tiên (ví dụ README).", C.GRAY)

        SetStatus = function(message, color)
            if alive then status.Text = message; status.TextColor3 = color or C.DARK end
        end
        local function InvalidatePlan()
            pendingSave = nil
            confirmation.Visible = false
        end
        local function UpdateAuto()
            autoBtn.Text = autoSave and "Tự lưu khi thêm / sửa: BẬT" or "Tự lưu khi thêm / sửa: TẮT"
            autoBtn.BackgroundColor3 = autoSave and C.GREEN or C.GRAY
        end
        UpdateSummary = function()
            if not alive then return end
            local changes = {}
            if revisions.scripts ~= savedRevisions.scripts then table.insert(changes, "Code") end
            if revisions.features ~= savedRevisions.features then table.insert(changes, "tính năng") end
            summary.Text = string.format("Bản máy: %d script • %d tính năng. %s", #scripts, #featureTabs,
                #changes > 0 and ("Chờ lưu: "..table.concat(changes, ", ")) or "Không có thay đổi mới đang chờ.")
        end
        local function EnsureRecords()
            for _, item in ipairs(scripts) do if not item.id then item.id = newId() end end
            for _, item in ipairs(featureTabs) do
                if not item.id then item.id = newId() end
                if not item.githubFile then item.githubFile = store:SuggestedFile(item.name, item.id) end
            end
        end
        local function CheckContext(version)
            if not alive or version ~= contextVersion then error("Thiết lập đã thay đổi. Thực hiện lại thao tác với đích mới.",0) end
        end
        local function RequireTarget(forSave)
            if not store:IsConnected() then error("Chưa kết nối GitHub.",0) end
            local destination = store:GetTarget()
            if destination.repo == "" or destination.branch == "" then error("Chọn kho và bấm Áp dụng trước.",0) end
            if trim(repoIn.Text) ~= destination.repo or trim(branchIn.Text) ~= destination.branch then
                error("Kho/nhánh đang nhập chưa được áp dụng. Bấm Áp dụng trước để tránh đọc nhầm kho cũ.",0)
            end
            if forSave and not configured then error("Thiết lập đã đổi. Bấm Áp dụng kho / nhánh / đường dẫn trước.",0) end
            return destination
        end
        local function Work(message, callback, onFailure)
            if not alive then return end
            if busy then SetStatus("Đang xử lý yêu cầu trước. Vui lòng chờ.", C.ORANGE); return end
            busy = true
            SetStatus(message, C.BLUE)
            local version = contextVersion
            task.spawn(function()
                local ok, result = pcall(callback, version)
                busy = false
                if not alive then return end
                if not ok then
                    if onFailure then onFailure() end
                    SetStatus("❌ "..tostring(result), C.RED)
                elseif type(result) == "string" then
                    SetStatus(result, C.GREEN)
                end
                UpdateSummary()
            end)
        end
        local function SaveSettings()
            -- Whitelist non-secret configuration. Never serialize the store, token input or _G.
            local destination = store:GetTarget()
            if writefile then
                pcall(function()
                    writefile(settingsFile, HttpService:JSONEncode({version=1, repo=destination.repo, branch=destination.branch,
                        codePath=destination.codePath, featureFolder=destination.featureFolder}))
                end)
            end
        end
        local function ConfigureChanged()
            if updatingFields then return end
            contextVersion += 1
            configured = false
            autoSave = false
            autoTicket += 1
            UpdateAuto(); InvalidatePlan()
            targetInfo.Text = "Có thiết lập chưa áp dụng. Tự lưu tạm tắt để tránh lưu nhầm kho/nhánh/file."
        end
        for _, field in ipairs({repoIn, branchIn, codePathIn, folderIn}) do
            field:GetPropertyChangedSignal("Text"):Connect(ConfigureChanged)
        end

        local function DisplayDraft(hidden)
            changingToken = true
            maskedToken = hidden and #draftToken > 0
            tokenIn.Text = maskedToken and string.rep("•", math.min(#draftToken,24)) or draftToken
            changingToken = false
            showTokenBtn.Text = maskedToken and "Hiện nháp" or "Ẩn nháp"
        end
        tokenIn:GetPropertyChangedSignal("Text"):Connect(function()
            if not changingToken and not maskedToken then draftToken = tokenIn.Text end
        end)
        tokenIn.Focused:Connect(function() DisplayDraft(false) end)
        tokenIn.FocusLost:Connect(function() draftToken=trim(draftToken); DisplayDraft(true) end)
        showTokenBtn.Activated:Connect(function() DisplayDraft(not maskedToken) end)

        local repoPage, branchPage = 1, 1
        local function ShowRepositories(page, version)
            local items = store:ListRepositories(page)
            CheckContext(version)
            ClearPicker(repoList); repoList.Visible=true; repoPage=page
            for _, item in ipairs(items) do
                if type(item.full_name) == "string" then
                    PickItem(repoList, (item.private and "🔒 " or "🌐 ")..item.full_name, function()
                        repoIn.Text = item.full_name
                        branchIn.Text = type(item.default_branch) == "string" and item.default_branch or "main"
                        branchPage = 1
                        repoList.Visible = false
                        SetStatus("Đã chọn "..item.full_name..". Chọn đường dẫn và bấm Áp dụng.", C.BLUE)
                    end)
                end
            end
            if #items == 0 then PickItem(repoList, "Không có kho ở trang này. Có thể nhập owner/repo trực tiếp.", function() end) end
            return "Đã tải trang kho "..page..". Token fine-grained chỉ thấy các kho được cấp quyền."
        end
        local function Repositories(page)
            Work("Đang tải danh sách kho...", function(version) return ShowRepositories(page, version) end)
        end
        connectBtn.Activated:Connect(function()
            local value = trim(draftToken)
            if value == "" then SetStatus("Nhập PAT trong ô phía trên, không gửi vào chat.", C.ORANGE); return end
            Work("Đang xác thực PAT với api.github.com...", function(version)
                local login = store:Connect(value)
                CheckContext(version)
                draftToken = ""; DisplayDraft(true)
                account.Text = "✅ @"..login.." • PAT chỉ ở RAM; không ghi vào file hoặc thư viện."
                configured=false; autoSave=false; UpdateAuto(); InvalidatePlan()
                SetStatus("Đã kết nối @"..login..". Đang tải danh sách kho...", C.GREEN)
                return ShowRepositories(1, version)
            end, function()
                configured=false; autoSave=false; UpdateAuto()
                if not store:IsConnected() then account.Text="PAT chưa được xác thực. Kiểm tra token và kết nối lại." end
            end)
        end)
        disconnectBtn.Activated:Connect(function()
            store:Disconnect()
            contextVersion += 1; autoTicket += 1; autoSave=false; configured=false
            draftToken=""; DisplayDraft(true); UpdateAuto(); InvalidatePlan()
            account.Text = "Đã xóa token khỏi bộ nhớ của hub. Bản code/tính năng trên máy vẫn được giữ."
            SetStatus("Đã ngắt GitHub. Yêu cầu đã gửi trước đó có thể vẫn hoàn tất trên GitHub.", C.GRAY)
        end)
        repoListBtn.Activated:Connect(function() Repositories(1) end)
        repoPrevBtn.Activated:Connect(function() Repositories(math.max(1,repoPage-1)) end)
        repoNextBtn.Activated:Connect(function() Repositories(repoPage+1) end)
        local function Branches(page)
            local repo = repoIn.Text
            Work("Đang tải các nhánh...", function(version)
                local items = store:ListBranches(repo, page)
                CheckContext(version)
                ClearPicker(branchList); branchList.Visible=true; branchPage=page
                for _, item in ipairs(items) do
                    if type(item.name) == "string" then PickItem(branchList, item.name, function() branchIn.Text=item.name; branchList.Visible=false end) end
                end
                if #items == 0 then PickItem(branchList, "Không có nhánh ở trang này.", function() end) end
                return "Đã tải trang nhánh "..page.."."
            end)
        end
        branchListBtn.Activated:Connect(function() Branches(1) end)
        branchPrevBtn.Activated:Connect(function() Branches(math.max(1,branchPage-1)) end)
        branchNextBtn.Activated:Connect(function() Branches(branchPage+1) end)
        applyTargetBtn.Activated:Connect(function()
            local repo, branch, codePath, folder = repoIn.Text, branchIn.Text, codePathIn.Text, folderIn.Text
            Work("Đang kiểm tra kho và nhánh...", function(version)
                local metadata = store:GetRepository(repo)
                CheckContext(version)
                if trim(branch) == "" then branch = metadata.default_branch or "main" end
                local destination = store:Configure(metadata.full_name, branch, codePath, folder)
                store:CheckTarget()
                CheckContext(version)
                updatingFields=true
                repoIn.Text=destination.repo; branchIn.Text=destination.branch; codePathIn.Text=destination.codePath; folderIn.Text=destination.featureFolder
                updatingFields=false
                configured=true; InvalidatePlan(); SaveSettings()
                targetInfo.Text = "Đích: "..destination.repo.." @ "..destination.branch.."\nCode: "..destination.codePath.."\nTính năng: "..destination.featureFolder.."/*.lua + index.json"
                return "✅ Đã áp dụng. Nếu kho có thư viện cũ, hãy Nhập cả hai trước khi lưu."
            end)
        end)

        local Browse
        Browse = function(directory)
            Work("Đang duyệt thư mục...", function(version)
                RequireTarget(false)
                local items = store:ListDirectory(directory)
                CheckContext(version)
                directoryIn.Text = directory
                ClearPicker(fileList); fileList.Visible=true
                table.sort(items, function(a,b)
                    if a.type ~= b.type then return a.type == "dir" end
                    return tostring(a.name) < tostring(b.name)
                end)
                for _, item in ipairs(items) do
                    if type(item.path) == "string" then
                        PickItem(fileList, (item.type == "dir" and "📁 " or "📄 ")..tostring(item.name), function()
                            if item.type == "dir" then Browse(item.path)
                            elseif item.type == "file" then
                                if item.path:lower():match("%.json$") then
                                    codePathIn.Text=item.path
                                    SetStatus("Đã chọn file JSON. Bấm Áp dụng, rồi Nhập Code trước khi ghi.", C.BLUE)
                                else
                                    importPathIn.Text=item.path
                                    SetStatus("Đã chọn file để nhập ở mục 6; chưa chạy code.", C.BLUE)
                                end
                            end
                        end)
                    end
                end
                if #items == 0 then PickItem(fileList, "Thư mục trống.", function() end) end
                return "Đang xem: "..(directory == "" and "/" or directory)..". GitHub Contents trả tối đa 1.000 mục/thư mục; vẫn có thể nhập đường dẫn trực tiếp."
            end)
        end
        browseBtn.Activated:Connect(function() Browse(trim(directoryIn.Text)) end)
        upBtn.Activated:Connect(function() Browse((trim(directoryIn.Text):match("^(.*)/[^/]+$") or "")) end)
        useFolderBtn.Activated:Connect(function()
            local value = trim(directoryIn.Text)
            if value == "" then SetStatus("Chọn một thư mục con cho tính năng, không dùng gốc kho.", C.ORANGE); return end
            folderIn.Text=value
            SetStatus("Đã chọn thư mục tính năng. Bấm Áp dụng để sử dụng.", C.BLUE)
        end)

        RefreshFeatures = function()
            if not alive then return end
            EnsureRecords(); ClearPicker(featurePicker)
            if selectedFeature and not table.find(featureTabs,selectedFeature) then selectedFeature=nil; lastFeatureFile=nil; featureFileIn.Text="" end
            if selectedFeature and selectedFeature.githubFile ~= lastFeatureFile then
                lastFeatureFile=selectedFeature.githubFile; featureFileIn.Text=lastFeatureFile
            end
            for _, item in ipairs(featureTabs) do
                PickItem(featurePicker, (selectedFeature == item and "✓ " or "")..item.name.." → "..item.githubFile, function()
                    selectedFeature=item; lastFeatureFile=item.githubFile; featureFileIn.Text=item.githubFile; RefreshFeatures()
                end)
            end
            if #featureTabs == 0 then PickItem(featurePicker, "Tạo tính năng ở tab ➕ trước, hoặc Nhập tính năng từ GitHub.", function() end) end
        end
        GitHubSync.Changed = function(kind, suppressAuto)
            if not alive then return end
            local ok = pcall(function()
                revisions[kind] += 1
                InvalidatePlan(); EnsureRecords(); UpdateSummary()
                if kind == "features" then RefreshFeatures() end
                if autoSave and not suppressAuto and QueueAutoSave then QueueAutoSave() end
            end)
            if not ok then
                autoSave=false; UpdateAuto()
                SetStatus("Thay đổi trên máy vẫn được giữ. GitHub chưa cập nhật được; thử Lưu thủ công sau. Không chặn các nút lưu cũ.",C.ORANGE)
            end
        end
        local function UniqueName(values, desired)
            local name, number = desired, 1
            while true do
                local exists=false
                for _, item in ipairs(values) do if item.name == name then exists=true; break end end
                if not exists then return name end
                number += 1; name=desired.." ("..number..")"
            end
        end
        -- Import is additive. Conflicting IDs are split into two records; no existing tab is destroyed.
        GitHubSync.Import = function(bundle)
            EnsureRecords()
            local added, conflicts = 0, 0
            for _, kind in ipairs({"scripts", "features"}) do
                local incoming = bundle[kind]
                if incoming then
                    local values = kind == "scripts" and scripts or featureTabs
                    for _, remote in ipairs(incoming) do
                        local existing
                        for _, item in ipairs(values) do if item.id == remote.id then existing=item; break end end
                        local same = existing and existing.code == remote.code and (kind == "scripts" or existing.icon == remote.icon)
                        if not same then
                            if existing then
                                existing.id = newId()
                                if kind == "features" then existing.githubFile=nil end
                                conflicts += 1
                            else
                                for _, item in ipairs(values) do
                                    if item.name == remote.name and item.code == remote.code and (kind == "scripts" or item.icon == remote.icon) then
                                        existing=item; same=true; item.id=remote.id
                                        if kind == "features" then item.githubFile=remote.file end
                                        break
                                    end
                                end
                            end
                            if not same then
                                local name = UniqueName(values, remote.name)
                                if kind == "scripts" then
                                    table.insert(scripts, {id=remote.id, name=name, code=remote.code, expanded=false})
                                else
                                    local feature = CreateFeatureTab(name, remote.icon, remote.code, true)
                                    feature.id=remote.id; feature.githubFile=remote.file
                                end
                                added += 1
                            end
                        end
                    end
                    GitHubSync.Changed(kind, true)
                end
            end
            RebuildScripts(); RebuildFeatureList(); RefreshFeatures()
            return added, conflicts
        end
        local function Snapshot(mode, selected)
            EnsureRecords()
            local bundle, version = {}, {scripts=revisions.scripts, features=revisions.features}
            if mode == "scripts" or mode == "all" then
                bundle.scripts={}
                for _, item in ipairs(scripts) do table.insert(bundle.scripts, {id=item.id, name=item.name, code=item.code}) end
            end
            if mode == "features" or mode == "all" or mode == "selected" then
                bundle.features={}
                local values = mode == "selected" and {selected} or featureTabs
                if mode == "selected" and (not selected or not table.find(featureTabs, selected)) then error("Chọn một tính năng trước.",0) end
                for _, item in ipairs(values) do
                    table.insert(bundle.features, {id=item.id, name=item.name, code=item.code, icon=item.icon, file=item.githubFile})
                end
            end
            return bundle, version
        end
        local function SameRevision(mode, version)
            return ((mode ~= "scripts" and mode ~= "all") or version.scripts == revisions.scripts)
                and ((mode ~= "features" and mode ~= "all" and mode ~= "selected") or version.features == revisions.features)
        end
        local function MarkSaved(mode, version)
            if (mode == "scripts" or mode == "all") and version.scripts == revisions.scripts then savedRevisions.scripts=version.scripts end
            if (mode == "features" or mode == "all") and version.features == revisions.features then savedRevisions.features=version.features end
            UpdateSummary()
        end
        local function BeginSave(mode, selected)
            Work("Đang kiểm tra file và lập kế hoạch lưu...", function(version)
                RequireTarget(true)
                local bundle, revision = Snapshot(mode,selected)
                local plan = store:PrepareSave(bundle)
                CheckContext(version)
                if not SameRevision(mode,revision) then error("Bản máy vừa đổi. Bấm Lưu lại để lấy dữ liệu mới nhất.",0) end
                if #plan.writes == 0 then
                    MarkSaved(mode,revision)
                    return "Không có nội dung mới cần ghi. Các mục chỉ xóa trên máy vẫn được giữ trên GitHub."
                end
                pendingSave={plan=plan, mode=mode, revision=revision, context=version}
                local lines={"Xác nhận lưu vào "..plan.repo.." @ "..plan.branch, "Một commit, "..#plan.writes.." file; không xóa file:"}
                for index, item in ipairs(plan.writes) do
                    if index <= 12 then table.insert(lines, (item.isNew and "+ Mới: " or "~ Cập nhật: ")..item.path) end
                end
                if #plan.writes > 12 then table.insert(lines, "... và "..(#plan.writes-12).." file khác trong cùng thư viện.") end
                planLabel.Text=table.concat(lines,"\n"); confirmation.Visible=true
                return "Đã lập kế hoạch. Kiểm tra kho/nhánh và danh sách file, rồi bấm Xác nhận ghi GitHub."
            end)
        end
        confirmBtn.Activated:Connect(function()
            local pending = pendingSave
            if not pending then SetStatus("Không có kế hoạch đang chờ. Bấm Lưu để lập kế hoạch mới.",C.ORANGE); return end
            Work("Đang ghi một commit lên GitHub...", function(version)
                RequireTarget(true); CheckContext(pending.context)
                if not SameRevision(pending.mode,pending.revision) then error("Code vừa thay đổi. Lập kế hoạch mới trước khi xác nhận.",0) end
                InvalidatePlan()
                local result = store:Commit(pending.plan)
                CheckContext(version)
                MarkSaved(pending.mode,pending.revision)
                if autoSave and QueueAutoSave then QueueAutoSave() end
                return "✅ Đã lưu "..result.count.." file trong commit "..result.sha:sub(1,8)..". Bản máy không bị xóa."
            end)
        end)
        cancelSaveBtn.Activated:Connect(function() InvalidatePlan(); SetStatus("Đã hủy kế hoạch, chưa gửi thao tác ghi.",C.GRAY) end)
        saveScriptsBtn.Activated:Connect(function() BeginSave("scripts") end)
        saveFeaturesBtn.Activated:Connect(function() BeginSave("features") end)
        saveAllBtn.Activated:Connect(function() BeginSave("all") end)
        saveOneFeatureBtn.Activated:Connect(function() BeginSave("selected",selectedFeature) end)
        setFeatureFileBtn.Activated:Connect(function()
            if not selectedFeature then SetStatus("Chọn tính năng trong danh sách trước.",C.ORANGE); return end
            local ok, result = pcall(function()
                local value = store:ValidateFeatureFile(featureFileIn.Text)
                for _, item in ipairs(featureTabs) do if item ~= selectedFeature and item.githubFile == value then error("Tên file này đã được một tính năng khác sử dụng.",0) end end
                selectedFeature.githubFile=value
                GitHubSync.Changed("features")
                return "Đã đặt file "..value..". Bấm Lưu hoặc bật Tự lưu để ghi GitHub."
            end)
            SetStatus((ok and "" or "❌ ")..tostring(result), ok and C.GREEN or C.RED)
        end)
        local function LoadLibrary(kind)
            InvalidatePlan()
            Work("Đang đọc và kiểm tra toàn bộ dữ liệu trước khi nhập...", function(version)
                RequireTarget(true)
                local bundle = store:Load(kind)
                CheckContext(version)
                local count, conflicts = GitHubSync.Import(bundle)
                return "✅ Đã nhập thêm "..count.." mục; giữ cả hai bản cho "..conflicts.." xung đột. Không chạy code, không xóa tính năng cũ."
            end)
        end
        loadScriptsBtn.Activated:Connect(function() LoadLibrary("scripts") end)
        loadFeaturesBtn.Activated:Connect(function() LoadLibrary("features") end)
        loadAllBtn.Activated:Connect(function() LoadLibrary("all") end)
        local function ImportFile(asFeature)
            local filePath = trim(importPathIn.Text)
            Work("Đang đọc file văn bản, không thực thi...", function(version)
                RequireTarget(true)
                local code = store:ReadTextFile(filePath)
                CheckContext(version)
                local name=(filePath:match("([^/]+)$") or "GitHub Script"):gsub("%.lua[u]?$", ""):gsub("%.txt$", "")
                if name == "" then name="GitHub Script" end
                if asFeature then
                    CreateFeatureTab(UniqueName(featureTabs,name), "🐙", code, true)
                    RebuildFeatureList(); GitHubSync.Changed("features")
                else
                    table.insert(scripts,{id=newId(), name=UniqueName(scripts,name), code=code, expanded=false})
                    RebuildScripts(); GitHubSync.Changed("scripts")
                end
                return "✅ Đã nhập "..filePath.." vào bản máy. Chỉ chạy khi bạn bấm nút Chạy."
            end)
        end
        importCodeBtn.Activated:Connect(function() ImportFile(false) end)
        importFeatureBtn.Activated:Connect(function() ImportFile(true) end)

        QueueAutoSave = function()
            if not autoSave or not alive or not configured then return end
            autoTicket += 1
            local ticket = autoTicket
            task.delay(1.2,function()
                if not autoSave or not alive or ticket ~= autoTicket or not configured or pendingSave then return end
                if busy then QueueAutoSave(); return end
                local dirtyScripts = revisions.scripts ~= savedRevisions.scripts
                local dirtyFeatures = revisions.features ~= savedRevisions.features
                if not dirtyScripts and not dirtyFeatures then return end
                local mode = dirtyScripts and (dirtyFeatures and "all" or "scripts") or "features"
                Work("Tự lưu: kiểm tra thay đổi trên GitHub...",function(version)
                    RequireTarget(true)
                    local bundle, revision = Snapshot(mode)
                    local plan = store:PrepareSave(bundle)
                    CheckContext(version)
                    if not autoSave or not SameRevision(mode,revision) then QueueAutoSave(); return "Bản máy vừa đổi; đã hoãn tự lưu đến lượt tiếp theo." end
                    local result=store:Commit(plan)
                    CheckContext(version); MarkSaved(mode,revision)
                    QueueAutoSave()
                    return result.count > 0 and ("✅ Tự lưu "..result.count.." file • commit "..result.sha:sub(1,8)) or "GitHub đã có dữ liệu này; không tạo commit thừa. Xóa bản máy không xóa bản GitHub."
                end,function() autoSave=false; UpdateAuto() end)
            end)
        end
        autoBtn.Activated:Connect(function()
            if not autoSave then
                local ok, message=pcall(function() RequireTarget(true) end)
                if not ok then SetStatus(tostring(message),C.ORANGE); return end
            end
            autoSave=not autoSave; UpdateAuto()
            if autoSave then
                SetStatus("Đã cho phép tự tạo commit sau thao tác lưu/thêm/sửa (chờ 1,2 giây). File chưa nạp hoặc bị đổi từ xa sẽ bị chặn, không ghi đè.",C.GREEN)
                QueueAutoSave()
            else
                autoTicket+=1
                SetStatus("Đã tắt tự lưu. Yêu cầu đã gửi trước đó có thể vẫn hoàn tất.",C.GRAY)
            end
        end)
        -- Do not track this with external connections: it must still run when the old ScreenGui is destroyed on reload.
        gui.Destroying:Connect(function()
            alive=false; autoSave=false; autoTicket+=1; contextVersion+=1
            draftToken=""; pendingSave=nil; store:Disconnect()
        end)
        EnsureRecords(); RefreshFeatures(); UpdateSummary(); UpdateAuto()
        -- END GITHUB UI / LIBRARY BRIDGE
    end
    local githubOK = pcall(InitializeGitHub)
    if not githubOK then
        GitHubSync.Changed = function() end
        warn("[BananaCatHub] Không khởi tạo được tab GitHub; các tính năng cũ vẫn hoạt động.")
    end
end

-- ==================== TOGGLE MENU & DRAG ====================
local function ToggleMainFrame()
    main.Visible = not main.Visible
    togBtn.Text = main.Visible and "✕" or "🍌"
end

closeBtn.Activated:Connect(function()
    main.Visible = false
    togBtn.Text = "🍌"
end)

dragLockBtn.Activated:Connect(function()
    S.dragMenu = not S.dragMenu
    if S.dragMenu then
        dragLockBtn.Text = "🔓"
        dragLockBtn.TextColor3 = C.BLUE
    else
        dragLockBtn.Text = "🔒"
        dragLockBtn.TextColor3 = Color3.fromRGB(120,120,130)
    end
end)

local dragging, dragStart, startPos
trackConn(titleBar.InputBegan:Connect(function(i)
    if S.dragMenu and (i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch) then
        dragging=true
        dragStart=i.Position
        startPos=main.Position
    end
end))

trackConn(UserInputService.InputChanged:Connect(function(i)
    if dragging and startPos and dragStart and (i.UserInputType==Enum.UserInputType.MouseMovement or i.UserInputType==Enum.UserInputType.Touch) then
        local d=i.Position-dragStart
        main.Position=UDim2.new(startPos.X.Scale, startPos.X.Offset+d.X, startPos.Y.Scale, startPos.Y.Offset+d.Y)
    end
end))

trackConn(UserInputService.InputEnded:Connect(function(i)
    if i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch then
        dragging=false
    end
end))

local togDragging = false
local togDragStart, togStartPos
local togMoved = false

trackConn(togBtn.InputBegan:Connect(function(i)
    if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then
        if S.dragMenu then
            togDragging = true
            togDragStart = i.Position
            togStartPos = togBtn.Position
            togMoved = false
        end
    end
end))

trackConn(UserInputService.InputChanged:Connect(function(i)
    if togDragging and S.dragMenu and (i.UserInputType == Enum.UserInputType.MouseMovement or i.UserInputType == Enum.UserInputType.Touch) then
        local delta = i.Position - togDragStart
        if delta.Magnitude > 5 then
            togMoved = true
        end
        if togMoved then
            togBtn.Position = UDim2.new(
                togStartPos.X.Scale, togStartPos.X.Offset + delta.X,
                togStartPos.Y.Scale, togStartPos.Y.Offset + delta.Y
            )
        end
    end
end))

trackConn(UserInputService.InputEnded:Connect(function(i)
    if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then
        if togDragging then
            togDragging = false
            if not togMoved then
                ToggleMainFrame()
            end
        end
    end
end))

togBtn.Activated:Connect(function()
    if not S.dragMenu then
        ToggleMainFrame()
    end
end)

trackConn(UserInputService.InputBegan:Connect(function(i, gp)
    if not gp and i.KeyCode == Enum.KeyCode.RightControl then
        ToggleMainFrame()
    end
end))

main.Visible = true
togBtn.Text = "✕"

print("✅ Banana Cat Hub v4.3: Code + Code Đã Lưu + Hỗ Trợ (POS+SIZE+ROT+LOOK+VẬT THỂ+HIGHLIGHT TÍM) + AI AI + Tạo Tính Năng + GitHub — sẵn sàng!")