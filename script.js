--[[
    🍌 Banana Cat Hub — BẢN TÍCH HỢP SCRIPT CON VÀO MENU (ĐÃ FIX)
    + THÊM TAB "HỖ TRỢ" — PHÂN TÍCH TỌA ĐỘ
    + CHUYỂN 3 SCRIPT NHANH TỪ TAB "CODE" SANG TAB "HỖ TRỢ"
    + THÊM TAB "AI AI" — GEMINI API (giữa Hỗ Trợ và Tạo Tính Năng)
    + FIX HTTP 404: ĐỔI MODEL gemini-2.0-flash → gemini-2.5-flash
    - GIỮ NGUYÊN toàn bộ tính năng gốc
--]]
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

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
    PURPLE = Color3.fromRGB(130, 60, 200),
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
    Text="🍌 Banana Cat Executor Hub (Caro Style)",
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
        SwitchTab(tabIdx)
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

-- ===== 3 SCRIPT NHANH =====
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

-- ===== PHẦN PHÂN TÍCH TỌA ĐỘ =====
Label(supportTab, "🛠 Hỗ Trợ — Phân Tích Tọa Độ", posY)
posY = posY + 18
Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16

Label(supportTab, "📍 Tọa Độ Hiện Tại (Real-time)", posY)
posY = posY + 16

local coordDisplay = New("Frame", {
    Size=UDim2.new(1,-16,0,110),
    Position=UDim2.new(0,8,0,posY),
    BackgroundColor3=Color3.fromRGB(30, 35, 45),
    BackgroundTransparency=0,
    BorderSizePixel=0,
    ZIndex=6,
}, supportTab)
Corner(coordDisplay, UDim.new(0,6))
Stroke(coordDisplay, C.BLUE, 1.5)

New("TextLabel", {
    Size=UDim2.new(1,-16,0,20), Position=UDim2.new(0,8,0,8),
    Text="X:", BackgroundTransparency=1, TextColor3=Color3.fromRGB(255, 100, 100),
    Font=Enum.Font.GothamBold, TextSize=12, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local xValLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,20), Position=UDim2.new(0,40,0,8),
    Text="0.000", BackgroundTransparency=1, TextColor3=Color3.fromRGB(255, 255, 255),
    Font=Enum.Font.Code, TextSize=12, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

New("TextLabel", {
    Size=UDim2.new(1,-16,0,20), Position=UDim2.new(0,8,0,30),
    Text="Y:", BackgroundTransparency=1, TextColor3=Color3.fromRGB(100, 255, 100),
    Font=Enum.Font.GothamBold, TextSize=12, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local yValLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,20), Position=UDim2.new(0,40,0,30),
    Text="0.000", BackgroundTransparency=1, TextColor3=Color3.fromRGB(255, 255, 255),
    Font=Enum.Font.Code, TextSize=12, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

New("TextLabel", {
    Size=UDim2.new(1,-16,0,20), Position=UDim2.new(0,8,0,52),
    Text="Z:", BackgroundTransparency=1, TextColor3=Color3.fromRGB(100, 150, 255),
    Font=Enum.Font.GothamBold, TextSize=12, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local zValLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,20), Position=UDim2.new(0,40,0,52),
    Text="0.000", BackgroundTransparency=1, TextColor3=Color3.fromRGB(255, 255, 255),
    Font=Enum.Font.Code, TextSize=12, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

New("TextLabel", {
    Size=UDim2.new(0,80,0,20), Position=UDim2.new(0,8,0,76),
    Text="Rotation:", BackgroundTransparency=1, TextColor3=Color3.fromRGB(255, 220, 100),
    Font=Enum.Font.GothamBold, TextSize=11, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local rotValLbl = New("TextLabel", {
    Size=UDim2.new(1,-100,0,20), Position=UDim2.new(0,90,0,76),
    Text="Y: 0°  |  P: 0°  |  R: 0°", BackgroundTransparency=1, TextColor3=Color3.fromRGB(200, 200, 200),
    Font=Enum.Font.Code, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local placeLbl = New("TextLabel", {
    Size=UDim2.new(1,-16,0,18), Position=UDim2.new(0,8,0,94),
    Text="Place: ...", BackgroundTransparency=1, TextColor3=Color3.fromRGB(150, 200, 255),
    Font=Enum.Font.GothamMedium, TextSize=9, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

posY = posY + 118

local coordUpdateConn = RunService.RenderStepped:Connect(function()
    local char = player.Character
    if not char then
        xValLbl.Text = "N/A"; yValLbl.Text = "N/A"; zValLbl.Text = "N/A"; rotValLbl.Text = "N/A"
        return
    end
    local hrp = char:FindFirstChild("HumanoidRootPart")
    if not hrp then
        xValLbl.Text = "N/A"; yValLbl.Text = "N/A"; zValLbl.Text = "N/A"; rotValLbl.Text = "N/A"
        return
    end
    local pos = hrp.Position
    local rot = hrp.Orientation
    xValLbl.Text = string.format("%.3f", pos.X)
    yValLbl.Text = string.format("%.3f", pos.Y)
    zValLbl.Text = string.format("%.3f", pos.Z)
    rotValLbl.Text = string.format("Y: %.1f°  |  P: %.1f°  |  R: %.1f°", rot.Y, rot.X, rot.Z)
    pcall(function()
        placeLbl.Text = "Place: "..game.PlaceId.." — "..game:GetService("MarketplaceService"):GetProductInfo(game.PlaceId).Name
    end)
end)
trackConn(coordUpdateConn)

posY = posY + 6

local copyCoordBtn = Button(supportTab, "📋 Copy Tọa Độ Hiện Tại", 8, posY, 160, 26, C.BLUE)
posY = posY + 32

copyCoordBtn.Activated:Connect(function()
    local char = player.Character
    if not char then return end
    local hrp = char:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    local pos = hrp.Position
    local text = string.format("%.3f, %.3f, %.3f", pos.X, pos.Y, pos.Z)
    if setclipboard then
        pcall(setclipboard, text)
    elseif toclipboard then
        pcall(toclipboard, text)
    end
    copyCoordBtn.Text = "✅ Đã Copy: "..text
    task.delay(2, function()
        if copyCoordBtn and copyCoordBtn.Parent then
            copyCoordBtn.Text = "📋 Copy Tọa Độ Hiện Tại"
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

local fillCurrentBtn = Button(supportTab, "📍 Lấy Vị Trí Hiện Tại", 8, posY, 130, 24, C.ORANGE)
local tpBtn = Button(supportTab, "🚀 Teleport", 144, posY, 90, 24, C.GREEN)
posY = posY + 30

fillCurrentBtn.Activated:Connect(function()
    local char = player.Character
    if not char then return end
    local hrp = char:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    tpXIn.Text = string.format("%.3f", hrp.Position.X)
    tpYIn.Text = string.format("%.3f", hrp.Position.Y)
    tpZIn.Text = string.format("%.3f", hrp.Position.Z)
end)

tpBtn.Activated:Connect(function()
    local char = player.Character
    if not char then return end
    local hrp = char:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    local x = tonumber(tpXIn.Text) or 0
    local y = tonumber(tpYIn.Text) or 0
    local z = tonumber(tpZIn.Text) or 0
    hrp.CFrame = CFrame.new(Vector3.new(x, y, z))
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
    local char = player.Character
    if not char then return end
    local hrp = char:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    local name = wpNameIn.Text
    if #name == 0 then name = "WP "..(#waypoints+1) end
    table.insert(waypoints, {name = name, pos = hrp.Position})
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
            local char = player.Character
            if not char then return end
            local hrp = char:FindFirstChild("HumanoidRootPart")
            if not hrp then return end
            hrp.CFrame = CFrame.new(wp.pos)
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

-- ==================== TAB 4: AI AI — GEMINI API ====================
local aiTab = AddTab("AI AI", "🤖", 4)

local aiY = 8

Label(aiTab, "🤖 AI AI — Trợ Lý Gemini", aiY)
aiY = aiY + 18
Label(aiTab, "━━━━━━━━━━━━━━━━━━━━━━", aiY)
aiY = aiY + 16

Label(aiTab, "🔑 API Key Gemini", aiY)
aiY = aiY + 14

local apiKeyIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,26), Position=UDim2.new(0,8,0,aiY), Text="",
    PlaceholderText="Nhập API Key Gemini tại đây...",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(255,255,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.Code, TextSize=10, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, aiTab)
Corner(apiKeyIn, UDim.new(0,5))
Stroke(apiKeyIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, apiKeyIn)

aiY = aiY + 32

local saveKeyBtn = Button(aiTab, "💾 Lưu Key", 8, aiY, 90, 24, C.BLUE)
local clearKeyBtn = Button(aiTab, "🗑 Xóa Key", 104, aiY, 90, 24, C.RED)
local toggleKeyBtn = Button(aiTab, "👁 Hiện", 200, aiY, 70, 24, C.ORANGE)

local keyStatus = Label(aiTab, "", aiY + 26)
keyStatus.TextColor3=C.GREEN; keyStatus.TextSize=9; keyStatus.ZIndex=6

aiY = aiY + 46

Label(aiTab, "━━━━━━━━━━━━━━━━━━━━━━", aiY)
aiY = aiY + 16

Label(aiTab, "📝 Câu Hỏi Của Bạn", aiY)
aiY = aiY + 14

local questionIn = New("TextBox", {
    Size=UDim2.new(1,-16,0,70), Position=UDim2.new(0,8,0,aiY), Text="",
    PlaceholderText="Nhập câu hỏi... VD: Làm sao để bay trong Roblox?",
    PlaceholderColor3=Color3.fromRGB(160,160,160),
    BackgroundColor3=Color3.fromRGB(245,245,255), BackgroundTransparency=0, TextColor3=Color3.fromRGB(20,20,20),
    Font=Enum.Font.GothamMedium, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
    MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
    Active=true, Selectable=true, ZIndex=10,
}, aiTab)
Corner(questionIn, UDim.new(0,5))
Stroke(questionIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, questionIn)

aiY = aiY + 76

local askBtn = Button(aiTab, "🚀 Gửi Câu Hỏi", 8, aiY, 140, 28, C.GREEN)
local clearAskBtn = Button(aiTab, "🧹 Xóa", 154, aiY, 70, 28, C.ORANGE)

aiY = aiY + 36

local aiStatus = Label(aiTab, "💤 Sẵn sàng", aiY)
aiStatus.TextColor3=C.YELLOW; aiStatus.TextSize=9; aiStatus.ZIndex=6
aiY = aiY + 14

Label(aiTab, "💬 Trả Lời Từ Gemini:", aiY)
aiY = aiY + 14

local answerFrame = New("ScrollingFrame", {
    Size=UDim2.new(1,-16,0,120), Position=UDim2.new(0,8,0,aiY),
    BackgroundColor3=Color3.fromRGB(30, 35, 45), BackgroundTransparency=0,
    BorderSizePixel=0, ZIndex=6, ScrollBarThickness=4,
    CanvasSize=UDim2.new(0,0,0,0),
}, aiTab)
Corner(answerFrame, UDim.new(0,6))
Stroke(answerFrame, C.PURPLE, 1.5)

local answerLbl = New("TextLabel", {
    Size=UDim2.new(1,-12,0,0), Position=UDim2.new(0,6,0,6),
    Text="🤖 Câu trả lời sẽ hiển thị ở đây...",
    BackgroundTransparency=1, TextColor3=Color3.fromRGB(220, 225, 240),
    Font=Enum.Font.GothamMedium, TextSize=11,
    TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
    TextWrapped=true, ZIndex=7, AutomaticSize=Enum.AutomaticSize.Y,
}, answerFrame)

aiY = aiY + 126

local copyAnswerBtn = Button(aiTab, "📋 Copy Trả Lời", 8, aiY, 130, 24, C.BLUE)
local clearAnswerBtn = Button(aiTab, "🧹 Xóa Trả Lời", 144, aiY, 110, 24, C.RED)

aiY = aiY + 30
aiTab.CanvasSize = UDim2.new(0, 0, 0, aiY + 20)

-- ===== XỬ LÝ API KEY =====
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
    keyStatus.Text = "✅ Đã tải key: "..MaskKey(loadedKey)
else
    keyStatus.Text = "⚠️ Chưa có API key"
end

saveKeyBtn.Activated:Connect(function()
    local k = apiKeyIn.Text
    if #k == 0 then
        keyStatus.Text = "⚠️ Vui lòng nhập API key!"
        return
    end
    SaveApiKey(k)
    keyStatus.Text = "✅ Đã lưu key: "..MaskKey(k)
end)

clearKeyBtn.Activated:Connect(function()
    apiKeyIn.Text = ""
    _G.BananaCatHub_GeminiKey = nil
    if delfile then
        pcall(delfile, apiKeyFile)
    end
    keyStatus.Text = "🗑 Đã xóa API key"
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

-- ===== XỬ LÝ GỬI CÂU HỎI =====
local function UpdateAnswerHeight()
    local h = answerLbl.AbsoluteSize.Y
    if h < 100 then h = 100 end
    answerFrame.CanvasSize = UDim2.new(0, 0, 0, h + 12)
    answerLbl.Size = UDim2.new(1, -12, 0, h)
end

local function AskGemini(question)
    local key = LoadApiKey()
    if not key or #key == 0 then
        return false, "⚠️ Chưa có API key. Vui lòng nhập và lưu key trước!"
    end
    if #question == 0 then
        return false, "⚠️ Vui lòng nhập câu hỏi!"
    end

    -- FIX HTTP 404: Dùng model gemini-2.5-flash thay vì gemini-2.0-flash (đã bị gỡ)
    -- Nếu vẫn 404, thử đổi sang: gemini-flash-latest HOẶC gemini-2.5-flash-lite
    local url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="..key

    local body = HttpService:JSONEncode({
        contents = {
            {
                parts = {
                    { text = question }
                }
            }
        }
    })

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

    if not result.Success then
        local bodyPreview = ""
        if result.Body then
            bodyPreview = tostring(result.Body):sub(1, 300)
        end
        return false, "❌ HTTP "..tostring(result.StatusCode)..": "..tostring(result.StatusMessage).."\n"..bodyPreview
    end

    local parseOk, data = pcall(function()
        return HttpService:JSONDecode(result.Body)
    end)

    if not parseOk then
        return false, "❌ Không parse được JSON trả về"
    end

    if data.error then
        return false, "❌ API Error: "..tostring(data.error.message or "unknown")
    end

    if data.candidates and data.candidates[1] and data.candidates[1].content
       and data.candidates[1].content.parts and data.candidates[1].content.parts[1] then
        return true, data.candidates[1].content.parts[1].text
    end

    return false, "❌ Không có câu trả lời từ Gemini"
end

askBtn.Activated:Connect(function()
    local q = questionIn.Text
    if #q == 0 then
        aiStatus.Text = "⚠️ Vui lòng nhập câu hỏi!"
        return
    end

    aiStatus.Text = "⏳ Đang gửi tới Gemini..."
    aiStatus.TextColor3 = C.YELLOW
    answerLbl.Text = "🤖 Đang suy nghĩ..."

    task.spawn(function()
        local ok, response = AskGemini(q)
        if ok then
            answerLbl.Text = response
            aiStatus.Text = "✅ Đã nhận trả lời!"
            aiStatus.TextColor3 = C.GREEN
        else
            answerLbl.Text = response
            aiStatus.Text = "❌ Lỗi!"
            aiStatus.TextColor3 = C.RED
        end
        task.wait(0.1)
        UpdateAnswerHeight()
    end)
end)

clearAskBtn.Activated:Connect(function()
    questionIn.Text = ""
    aiStatus.Text = "🧹 Đã xóa câu hỏi"
end)

clearAnswerBtn.Activated:Connect(function()
    answerLbl.Text = "🤖 Câu trả lời sẽ hiển thị ở đây..."
    UpdateAnswerHeight()
end)

copyAnswerBtn.Activated:Connect(function()
    local text = answerLbl.Text
    if setclipboard then
        pcall(setclipboard, text)
        copyAnswerBtn.Text = "✅ Đã Copy!"
    elseif toclipboard then
        pcall(toclipboard, text)
        copyAnswerBtn.Text = "✅ Đã Copy!"
    else
        answerLbl:CaptureFocus()
        answerLbl.SelectionStart = 1
        answerLbl.CursorPosition = #text + 1
        copyAnswerBtn.Text = "⚠️ Đã Bôi Đen"
    end
    task.delay(1.5, function()
        if copyAnswerBtn and copyAnswerBtn.Parent then
            copyAnswerBtn.Text = "📋 Copy Trả Lời"
        end
    end)
end)

answerLbl:GetPropertyChangedSignal("Text"):Connect(UpdateAnswerHeight)
UpdateAnswerHeight()

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
                local host = New("Frame", {
                    Size = UDim2.new(1,0,1,0),
                    Position = UDim2.new(0,0,0,0),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    ZIndex = 5,
                    Name = "Embedded_"..g.Name,
                }, containerFrame)

                for _, child in ipairs(g:GetChildren()) do
                    pcall(function() child.Parent = host end)
                end
                pcall(function() g:Destroy() end)
            elseif g:IsA("GuiObject") then
                pcall(function()
                    g.Parent = containerFrame
                    g.ZIndex = 5
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

local function CreateFeatureTab(name, icon, codeContent)
    if not name or #name == 0 then name = "Tính Năng " .. (#featureTabs + 1) end
    if not icon or #icon == 0 then icon = "⚙️" end

    codeContent = NormalizeCode(codeContent)

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
        LayoutOrder=featureTabIndex + #featureTabs,
        TextXAlignment=Enum.TextXAlignment.Left,
        ZIndex=4,
    }, tabBar)
    Corner(btn, UDim.new(0,6))

    local tabIdx = #tabs + 1
    btn.Activated:Connect(function()
        SwitchTab(tabIdx)
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

local createStatus = Label(createFeatureTab, "", cy)
createStatus.TextColor3=C.YELLOW; createStatus.TextSize=9; createStatus.ZIndex=6
cy = cy + 14

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
            SwitchTab(ft.tabIdx)
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

print("✅ Banana Cat Hub v3.3: Code + Code Đã Lưu + Hỗ Trợ + AI AI (Gemini 2.5 Flash) + Tạo Tính Năng — sẵn sàng!")