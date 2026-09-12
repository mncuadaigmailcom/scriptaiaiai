local passed, failures=0,{}
local function test(name,callback)
    local ok,err=pcall(callback)
    if ok then passed+=1; print('PASS '..name) else table.insert(failures,name..': '..tostring(err)); print('FAIL '..name..': '..tostring(err)) end
end
local function find(root,class,predicate)
    for _, item in ipairs(root:GetDescendants()) do if item:IsA(class) and predicate(item) then return item end end
    error('UI control not found: '..class)
end
local function click(text,root) find(root or gui,'TextButton',function(item) return item.Text==text end).Activated:Fire() end
local function input(placeholder) return find(gui,'TextBox',function(item) return item.PlaceholderText==placeholder end) end
local function saveLocal(name,code)
    nameIn.Text=name; codeIn.Text=code; saveBtn.Activated:Fire()
end
local function createLocal(name,code)
    featureNameIn.Text=name; featureIconIn.Text='⚙️'; featureCodeIn.Text=code; createTabBtn.Activated:Fire()
    return featureTabs[#featureTabs]
end
local function cloudScripts(path)
    return TestJSON.decode(assert(Mock.github:Files()[path or 'banana-cat/saved-code.json'])).scripts
end
local function statusContains(text)
    for _, label in ipairs(gui:GetDescendants()) do
        if label:IsA('TextLabel') and label.Text:find(text,1,true) then return true end
    end
    return false
end
local b

test('all five original tabs remain, and GitHub is the sixth',function()
    assert(#tabs==6 and #tabContent==6 and main.Visible)
    for i,name in ipairs({'Code','Code Đã Lưu','Hỗ Trợ','AI AI','Tạo Tính Năng','GitHub'}) do assert(tabs[i].Text:find(name,1,true)) end
    assert(#Mock.github.log==0 and Mock.executions==0,'no requests/code execution during initialization')
end)
test('original local Save still works offline and assigns stable storage IDs',function()
    saveLocal('Local script','print("local code")')
    assert(#scripts==1 and scripts[1].id and scripts[1].code=='print("local code")')
    assert(#Mock.github.log==0)
end)
test('feature creation still works offline without executing feature code',function()
    createLocal('A','print("A")'); b=createLocal('B','print("B")')
    assert(#featureTabs==2 and #tabs==8 and b.id and b.githubFile:match('%.lua$'))
    assert(activeTab==b.frame and Mock.executions==0 and #Mock.github.log==0)
end)
test('deleting A does not break B or GitHub tab navigation',function()
    local row
    for _, child in ipairs(featureListFrame:GetChildren()) do
        if child:IsA('Frame') then
            for _, label in ipairs(child:GetChildren()) do if label:IsA('TextLabel') and label.Text=='⚙️ A' then row=child end end
        end
    end
    assert(row); click('🗑',row)
    assert(#featureTabs==1 and featureTabs[1]==b and #tabs==7)
    b.btn.Activated:Fire(); assert(activeTab==b.frame and b.frame.Visible)
    tabs[6].Activated:Fire(); assert(activeTab==tabContent[6] and tabs[6].Text:find('GitHub',1,true))
end)
test('feature edit and Save into the existing code list preserve original behavior',function()
    click('✏️ Sửa',b.frame)
    local editor=find(b.frame,'TextBox',function() return true end)
    editor.Text='print("B edited")'
    click('✅ Áp Dụng',b.frame)
    assert(b.code=='print("B edited")')
    click('💾 Lưu Vào DS',b.frame)
    assert(#scripts==2 and scripts[2].code==b.code and scripts[2].id)
end)
test('AutoSize library-save hook remains present without running wrapped code',function()
    local count=#scripts
    featureCodeIn.Text='print("size")'; grabSizeCodeBtn.Activated:Fire()
    assert(#scripts==count+1 and scripts[#scripts].id and scripts[#scripts].code:find('_AUTO_SIZE_WRAPPER',1,true))
    assert(Mock.executions==0)
end)
test('an optional GitHub hook failure cannot break the original local Save button',function()
    local previous=HttpService.GenerateGUID
    HttpService.GenerateGUID=function() error('simulated metadata failure') end
    local count=#scripts
    local ok,err=pcall(function() saveLocal('Kept despite GitHub error','return 123') end)
    HttpService.GenerateGUID=previous
    assert(ok,err)
    assert(#scripts==count+1 and scripts[#scripts].code=='return 123')
    assert(statusContains('Thay đổi trên máy vẫn được giữ'))
    GitHubSync.Changed('scripts')
    assert(scripts[#scripts].id)
end)
test('original AI code segmentation and menu shortcut still work',function()
    local segments=ParseSegments('Hello\n```lua\nlocal x = 1\n```\nEnd')
    assert(#segments==3 and segments[2].type=='code' and segments[2].content:find('local x',1,true))
    local visible=main.Visible
    UserInputService.InputBegan:Fire({KeyCode=Enum.KeyCode.RightControl,UserInputType=Enum.UserInputType.Keyboard},false)
    assert(main.Visible~=visible)
    closeBtn.Activated:Fire(); assert(not main.Visible)
    togBtn.Activated:Fire(); assert(main.Visible)
end)
test('masked token draft authenticates using the real value and is cleared afterward',function()
    local box=input('ghp_... hoặc github_pat_...')
    box.Focused:Fire(); box.Text='ghp_TEST_ONLY'; box.FocusLost:Fire()
    assert(box.Text~='ghp_TEST_ONLY' and box.Text~='')
    click('Kết nối')
    assert(box.Text=='' and statusContains('@test-user'))
    assert(not Mock.files['banana_cat_github_settings.json'])
end)
test('HttpService fallback does not try to override Roblox User-Agent',function()
    local previous=request; request=nil
    local ok,err=pcall(function()
        local box=input('ghp_... hoặc github_pat_...')
        box.Focused:Fire(); box.Text='ghp_TEST_ONLY'; box.FocusLost:Fire(); click('Kết nối')
        assert(box.Text=='' and statusContains('@test-user'))
        assert(Mock.github.log[#Mock.github.log].Headers['User-Agent']==nil)
    end)
    request=previous
    assert(ok,err)
end)
test('repository/branch selection saves ONLY non-secret settings',function()
    input('owner/repository').Text='test-owner/test-repo'
    input('Mặc định theo kho được chọn').Text='main'
    click('Áp dụng kho / nhánh / đường dẫn')
    local encoded=assert(Mock.files['banana_cat_github_settings.json'])
    assert(not encoded:find('TEST_ONLY',1,true) and not encoded:find('token',1,true))
    local config=TestJSON.decode(encoded)
    assert(config.repo=='test-owner/test-repo' and config.branch=='main' and config.codePath=='banana-cat/saved-code.json')
end)
test('manual cloud Save previews first and only confirmation publishes',function()
    click('Lưu cả hai')
    assert(Mock.github.patches==0 and statusContains('Xác nhận lưu vào test-owner/test-repo'))
    click('Xác nhận ghi GitHub')
    assert(Mock.github.patches==1 and #cloudScripts()==#scripts)
    assert(Mock.github:Files()['banana-cat/features/'..b.githubFile]==b.code)
    assert(Mock.github:Files()['README.md']=='Original README\n' and Mock.executions==0)
end)
test('each feature can choose a new separate Lua destination without deleting its old file',function()
    local oldFile=b.githubFile
    find(gui,'TextButton',function(item) return item.Text:find('B → '..oldFile,1,true)~=nil end).Activated:Fire()
    input('auto-farm.lua hoặc tools/esp.luau').Text='tools/custom-b.lua'
    click('Đặt tên file')
    assert(b.githubFile=='tools/custom-b.lua')
    click('Lưu tính năng đã chọn'); click('Xác nhận ghi GitHub')
    assert(Mock.github.patches==2 and Mock.github:Files()['banana-cat/features/tools/custom-b.lua']==b.code)
    assert(Mock.github:Files()['banana-cat/features/'..oldFile])
end)
test('cloud import keeps existing code and running feature tabs on conflicts',function()
    local oldScript,oldCode=scripts[1],scripts[1].code
    local oldFeature,oldFeatureCode=b,b.code
    local records=cloudScripts(); records[1].code='-- remote script\nprint("changed")\n'
    Mock.github:ExternalChange('banana-cat/saved-code.json',TestJSON.encode({format='banana-cat-hub/scripts',version=1,scripts=records}))
    Mock.github:ExternalChange('banana-cat/features/'..b.githubFile,'-- remote feature\nerror("do not execute")\n')
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Nhập cả hai')
    assert(#scripts==scriptCount+1 and #featureTabs==featureCount+1)
    assert(oldScript.code==oldCode and oldFeature.code==oldFeatureCode and oldFeature.frame.Parent)
    assert(Mock.executions==0 and statusContains('giữ cả hai bản cho 2 xung đột'))
end)
test('repeated import is idempotent, including Lua source ending with a newline',function()
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Nhập cả hai')
    assert(#scripts==scriptCount and #featureTabs==featureCount)
    assert(Mock.executions==0)
end)
test('corrupt remote manifest cannot clear or partly replace the local UI library',function()
    local manifest=Mock.github:Files()['banana-cat/features/index.json']
    Mock.github:ExternalChange('banana-cat/features/index.json','{broken')
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Nhập cả hai')
    assert(#scripts==scriptCount and #featureTabs==featureCount and b.frame.Parent)
    assert(statusContains('không phải JSON hợp lệ'))
    Mock.github:ExternalChange('banana-cat/features/index.json',manifest)
    click('Nhập cả hai')
end)
test('autosave includes local conflict copies and subsequently saved code',function()
    local before=Mock.github.patches
    click('Tự lưu khi thêm / sửa: TẮT')
    saveLocal('Auto saved','print("autosave")')
    Mock.Advance(1.3)
    assert(Mock.github.patches==before+1,'one debounced commit expected')
    assert(#cloudScripts()==#scripts and #TestJSON.decode(Mock.github:Files()['banana-cat/features/index.json']).features==#featureTabs)
    assert(Mock.executions==0)
end)
test('rapid local saves are coalesced and no newly saved code is dropped',function()
    local before=Mock.github.patches
    for i=1,3 do saveLocal('Rapid '..i,'return '..i) end
    Mock.Advance(1.3)
    assert(Mock.github.patches==before+1 and #cloudScripts()==#scripts)
end)
test('editing destination cancels queued autosave until explicitly applied',function()
    local before=Mock.github.patches
    saveLocal('Pending','return 10')
    input('banana-cat/saved-code.json').Text='another/library.json'
    Mock.Advance(1.3)
    assert(Mock.github.patches==before and not Mock.github:Files()['another/library.json'])
    assert(statusContains('chưa áp dụng'))
    click('Áp dụng kho / nhánh / đường dẫn')
end)
test('canceling a save plan does not write to GitHub',function()
    local before=Mock.github.patches
    click('Lưu Code'); click('Hủy kế hoạch'); Mock.Advance(1.3)
    assert(Mock.github.patches==before and not Mock.github:Files()['another/library.json'])
end)
test('local changes invalidate pending confirmation rather than writing a stale snapshot',function()
    local before=Mock.github.patches
    click('Lưu Code')
    saveLocal('After preview','return 20')
    click('Xác nhận ghi GitHub')
    assert(Mock.github.patches==before and statusContains('Không có kế hoạch'))
end)
test('permission failures preserve every local script and feature',function()
    local before,scriptCount,featureCount=Mock.github.patches,#scripts,#featureTabs
    click('Lưu cả hai')
    Mock.github.override=function(options,state)
        if options.Method=='POST' and options.Url:match('/git/trees$') then return state:Reply(403,{message='forbidden'}) end
    end
    click('Xác nhận ghi GitHub')
    Mock.github.override=nil
    assert(Mock.github.patches==before and #scripts==scriptCount and #featureTabs==featureCount and b.frame.Parent)
    assert(statusContains('403'))
end)
test('disconnect clears access, blocks new requests and keeps the existing library',function()
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Ngắt / Xóa token')
    local calls=#Mock.github.log
    click('Lưu Code')
    assert(#Mock.github.log==calls and #scripts==scriptCount and #featureTabs==featureCount)
    assert(input('ghp_... hoặc github_pat_...').Text=='')
end)
test('destroying the hub cancels queued cloud work and releases its session',function()
    local box=input('ghp_... hoặc github_pat_...')
    box.Focused:Fire(); box.Text='ghp_TEST_ONLY'; box.FocusLost:Fire(); click('Kết nối')
    click('Áp dụng kho / nhánh / đường dẫn'); click('Tự lưu khi thêm / sửa: TẮT')
    saveLocal('Before destruction','return 30')
    local calls,patches=#Mock.github.log,Mock.github.patches
    gui:Destroy(); Mock.Advance(2)
    assert(#Mock.github.log==calls and Mock.github.patches==patches and Mock.executions==0)
end)

print(string.format('\nHub UI/regression: %d passed, %d failed',passed,#failures))
assert(#failures==0,table.concat(failures,'\n'))
