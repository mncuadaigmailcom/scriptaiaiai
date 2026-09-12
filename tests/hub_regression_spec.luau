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
    click('Dùng kho / nhánh này')
    local encoded=assert(Mock.files['banana_cat_github_settings.json'])
    assert(not encoded:find('TEST_ONLY',1,true) and not encoded:find('token',1,true))
    local config=TestJSON.decode(encoded)
    assert(config.repo=='test-owner/test-repo' and config.branch=='main' and config.codePath=='banana-cat/saved-code.json')
end)
test('manual cloud Save previews first and only confirmation publishes',function()
    click('Gửi cả hai')
    assert(Mock.github.patches==0 and statusContains('Xác nhận gửi vào test-owner/test-repo'))
    click('Xác nhận ghi GitHub')
    assert(Mock.github.patches==1 and #cloudScripts()==#scripts)
    assert(Mock.github:Files()['banana-cat/features/'..b.githubFile]==b.code)
    assert(Mock.github:Files()['README.md']=='Original README\n' and Mock.executions==0)
end)
test('each feature can choose a new separate Lua destination without deleting its old file',function()
    local oldFile=b.githubFile
    click('3. Tính năng')
    find(gui,'TextButton',function(item) return item.Text:find('Đang chọn: B',1,true)~=nil end).Activated:Fire()
    find(gui,'TextButton',function(item) return item.Text:find('B → '..oldFile,1,true)~=nil end).Activated:Fire()
    input('auto-farm.lua hoặc tools/esp.luau').Text='tools/custom-b.lua'
    click('Đặt tên file')
    assert(b.githubFile=='tools/custom-b.lua')
    click('Gửi tính năng này'); click('Xác nhận ghi GitHub')
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
    click('Lấy cả hai')
    assert(#scripts==scriptCount+1 and #featureTabs==featureCount+1)
    assert(oldScript.code==oldCode and oldFeature.code==oldFeatureCode and oldFeature.frame.Parent)
    assert(Mock.executions==0 and statusContains('giữ cả hai bản cho 2 xung đột'))
end)
test('repeated import is idempotent, including Lua source ending with a newline',function()
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Lấy cả hai')
    assert(#scripts==scriptCount and #featureTabs==featureCount)
    assert(Mock.executions==0)
end)
test('corrupt remote manifest cannot clear or partly replace the local UI library',function()
    local manifest=Mock.github:Files()['banana-cat/features/index.json']
    Mock.github:ExternalChange('banana-cat/features/index.json','{broken')
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Lấy cả hai')
    assert(#scripts==scriptCount and #featureTabs==featureCount and b.frame.Parent)
    assert(statusContains('không phải JSON hợp lệ'))
    Mock.github:ExternalChange('banana-cat/features/index.json',manifest)
    click('Lấy cả hai')
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
    click('Dùng file JSON này')
end)
test('canceling a save plan does not write to GitHub',function()
    local before=Mock.github.patches
    click('Gửi Code đã lưu'); click('Hủy kế hoạch'); Mock.Advance(1.3)
    assert(Mock.github.patches==before and not Mock.github:Files()['another/library.json'])
end)
test('local changes invalidate pending confirmation rather than writing a stale snapshot',function()
    local before=Mock.github.patches
    click('Gửi Code đã lưu')
    saveLocal('After preview','return 20')
    click('Xác nhận ghi GitHub')
    assert(Mock.github.patches==before and statusContains('Không có kế hoạch'))
end)
test('permission failures preserve every local script and feature',function()
    local before,scriptCount,featureCount=Mock.github.patches,#scripts,#featureTabs
    click('Gửi cả hai')
    Mock.github.override=function(options,state)
        if options.Method=='POST' and options.Url:match('/git/trees$') then return state:Reply(403,{message='forbidden'}) end
    end
    click('Xác nhận ghi GitHub')
    Mock.github.override=nil
    assert(Mock.github.patches==before and #scripts==scriptCount and #featureTabs==featureCount and b.frame.Parent)
    assert(statusContains('403'))
end)
local function named(name,root)
    for _,item in ipairs((root or gui):GetDescendants()) do if item.Name==name then return item end end
    error('Missing named control: '..name)
end
local function clickName(name,root) named(name,root).Activated:Fire() end
local function pickerItems() return named('GitHubPickerItems') end
local function closePicker() clickName('GitHubPickerClose') end

test('GitHub has four fixed task tabs and separate scrollable pages with visible file choices',function()
    local root=named('GitHubWorkspace')
    assert(root.ScrollingEnabled==false and named('GitHubNavigation').Parent==root)
    for _,key in ipairs({'connection','saved','features','source'}) do
        clickName('GitHubNav_'..key)
        for _,other in ipairs({'connection','saved','features','source'}) do assert(named('GitHubPage_'..other).Visible==(key==other)) end
        assert(named('GitHubPage_'..key):IsA('ScrollingFrame'))
    end
    assert(find(named('GitHubPage_saved'),'TextButton',function(v) return v.Text=='Chọn file JSON' end))
    assert(find(named('GitHubPage_features'),'TextButton',function(v) return v.Text=='Chọn file Lua' end))
    assert(named('GitHubSourceEditor').MultiLine and named('GitHubSourceScroll').ScrollingDirection~=Enum.ScrollingDirection.X)
end)
test('full instructions/errors can be opened without scrolling through the connection form',function()
    click('Hướng dẫn quyền token');assert(named('GitHubInfoDialog').Visible)
    assert(statusContains('Fine-grained PAT') and statusContains('Contents: Read and write'))
    click('Đóng thông báo');assert(not named('GitHubInfoDialog').Visible)
    clickName('GitHubStatus');assert(named('GitHubInfoDialog').Visible);click('Đóng thông báo')
end)
test('repository and branch lists are modal, filterable, selectable and paginated',function()
    click('1. Kết nối');click('Chọn kho từ danh sách')
    assert(named('GitHubFilePicker').Visible)
    assert(#pickerItems():GetChildren()==101)
    click('Trang →',named('GitHubFilePicker'))
    assert(find(pickerItems(),'TextButton',function(v) return v.Text=='test-owner/repo-101' end))
    closePicker();assert(not named('GitHubFilePicker').Visible)
    Mock.github.override=function(options,state)
        if options.Url:find('/user/repos?',1,true) then return state:Reply(200,{{full_name='test-owner/test-repo',default_branch='main'}}) end
    end
    click('Chọn kho từ danh sách');named('GitHubPickerDirectory').Text='test-repo'
    click('test-owner/test-repo',pickerItems());Mock.github.override=nil
    assert(not named('GitHubFilePicker').Visible and named('GitHubRepository').Text=='test-owner/test-repo')
    click('Chọn nhánh');click('main',pickerItems())
    assert(not named('GitHubFilePicker').Visible and named('GitHubBranch').Text=='main')
end)
test('saved-code JSON picker browses folders and applies only its own destination without writing',function()
    local before=Mock.github.patches;local previousSource=named('GitHubSourcePath').Text;local previousFile=b.githubFile
    click('2. Code đã lưu');click('Chọn file JSON')
    assert(named('GitHubFilePicker').Visible)
    named('GitHubPickerDirectory').Text='';clickName('GitHubPickerRefresh')
    click('📁 banana-cat',pickerItems());click('📄 saved-code.json',pickerItems())
    assert(named('GitHubPickerPath').Text=='banana-cat/saved-code.json')
    click('Dùng file này',named('GitHubFilePicker'))
    assert(not named('GitHubFilePicker').Visible and named('GitHubCodePath').Text=='banana-cat/saved-code.json')
    assert(named('GitHubSourcePath').Text==previousSource and b.githubFile==previousFile and Mock.github.patches==before)
end)
test('new JSON file selection is explicit, rejects wrong extensions, and creates nothing until send',function()
    local before=Mock.github.patches
    click('File JSON mới');named('GitHubPickerPath').Text='new-library.txt'
    click('Dùng file này',named('GitHubFilePicker'));assert(statusContains('đuôi .json'))
    named('GitHubCodePath').Text='new-library/archive.json';click('Dùng file JSON này')
    assert(not Mock.github:Files()['new-library/archive.json'] and Mock.github.patches==before)
    named('GitHubCodePath').Text='banana-cat/saved-code.json';click('Dùng file JSON này')
end)
test('feature picker chooses a real Lua file, keeps code, and stops autosave before authorizing overwrite',function()
    Mock.github:ExternalChange('banana-cat/features/from-github.lua','-- existing unused file\nreturn 444\n')
    click('Tự lưu khi thêm / sửa: TẮT')
    local before=Mock.github.patches;local code=b.code;local originalPath=named('GitHubCodePath').Text
    click('3. Tính năng');click('Chọn file Lua')
    named('GitHubPickerDirectory').Text='banana-cat/features';clickName('GitHubPickerRefresh')
    click('📄 from-github.lua',pickerItems());click('Dùng file này',named('GitHubFilePicker'))
    assert(b.githubFile=='from-github.lua' and b.code==code and named('GitHubCodePath').Text==originalPath)
    assert(Mock.github.patches==before and Mock.github:Files()['banana-cat/features/from-github.lua']=='-- existing unused file\nreturn 444\n')
    assert(find(gui,'TextButton',function(v) return v.Text=='Tự lưu khi thêm / sửa: TẮT' end))
    Mock.Advance(2);assert(Mock.github.patches==before)
    click('Gửi tính năng này');assert(named('GitHubSaveConfirmation').Visible)
    assert(statusContains('from-github.lua'));click('Hủy kế hoạch');assert(Mock.github.patches==before)
end)
test('typing a feature filename pauses autosave and blocks bulk sends until applied',function()
    click('Tự lưu khi thêm / sửa: TẮT')
    local before=Mock.github.patches;local old=b.githubFile
    named('GitHubFeatureFile').Text='unapplied-feature.lua'
    Mock.Advance(2)
    assert(Mock.github.patches==before and find(gui,'TextButton',function(v) return v.Text=='Tự lưu khi thêm / sửa: TẮT' end))
    click('Gửi tất cả tính năng');assert(statusContains('Đặt tên file') and not named('GitHubSaveConfirmation').Visible)
    named('GitHubFeatureFile').Text=old
end)
test('folder picker accepts a missing destination, exposes new-file entry and does not create remote files',function()
    local before=Mock.github.patches
    click('Chọn thư mục');named('GitHubPickerPath').Text='brand-new/features'
    click('Dùng thư mục này',named('GitHubFilePicker'))
    assert(named('GitHubFeatureFolder').Text=='brand-new/features' and not Mock.github:Files()['brand-new/features/index.json'])
    click('File Lua mới')
    assert(named('GitHubFilePicker').Visible and named('GitHubPickerPath').Text=='')
    assert(find(pickerItems(),'TextButton',function(v) return v.Text:find('Chưa có file',1,true) end))
    closePicker()
    named('GitHubFeatureFolder').Text='banana-cat/features';click('Dùng thư mục này',named('GitHubPage_features'))
    assert(Mock.github.patches==before)
end)

test('source picker downloads .js text, displays exact Unicode/newlines, and never executes it',function()
    Mock.github:ExternalChange('scripts/source.js','-- mã nguồn 🍌\nreturn 5\n')
    local before=Mock.github.patches
    click('4. Mã nguồn');click('Chọn file nguồn')
    named('GitHubPickerDirectory').Text='scripts';clickName('GitHubPickerRefresh')
    click('📄 source.js',pickerItems());click('Chọn và lấy mã',named('GitHubFilePicker'))
    assert(named('GitHubSourcePath').Text=='scripts/source.js' and named('GitHubSourceEditor').Text=='-- mã nguồn 🍌\nreturn 5\n')
    assert(named('GitHubPage_source').Visible and Mock.executions==0 and Mock.github.patches==before)
    click('Sao chép mã');assert(Mock.clipboard=='-- mã nguồn 🍌\nreturn 5\n')
end)
test('editing and sending source previews the exact destination and needs confirmation',function()
    local before=Mock.github.patches;local scriptsCount=#scripts;local featuresCount=#featureTabs
    named('GitHubSourceEditor').Text='-- edited 🍌\r\nreturn 77\r\n'
    click('Gửi mã lên GitHub')
    assert(named('GitHubSaveConfirmation').Visible and Mock.github.patches==before)
    assert(statusContains('scripts/source.js') and statusContains('Cập nhật file có sẵn'))
    click('Xác nhận ghi GitHub')
    assert(Mock.github.patches==before+1 and Mock.github:Files()['scripts/source.js']=='-- edited 🍌\r\nreturn 77\r\n')
    assert(#scripts==scriptsCount and #featureTabs==featuresCount and Mock.executions==0)
end)
test('new standalone source file preserves other files and is not created by selection',function()
    local before=Mock.github.patches;local old=Mock.github:Files()['scripts/source.js']
    click('File nguồn mới');named('GitHubPickerPath').Text='exports/my-snippet.lua'
    click('Dùng file này',named('GitHubFilePicker'))
    assert(named('GitHubSourcePath').Text=='exports/my-snippet.lua' and Mock.github.patches==before)
    named('GitHubSourceEditor').Text='-- new source\nreturn 111\n';click('Gửi mã lên GitHub')
    assert(statusContains('Tạo file: exports/my-snippet.lua'));click('Xác nhận ghi GitHub')
    assert(Mock.github:Files()['exports/my-snippet.lua']=='-- new source\nreturn 111\n' and Mock.github:Files()['scripts/source.js']==old)
end)
test('editing a source draft invalidates its pending plan and never publishes a stale snapshot',function()
    local before=Mock.github.patches
    named('GitHubSourceEditor').Text='return 222';click('Gửi mã lên GitHub')
    assert(named('GitHubSaveConfirmation').Visible)
    named('GitHubSourceEditor').Text='return 333'
    assert(not named('GitHubSaveConfirmation').Visible)
    click('Xác nhận ghi GitHub');assert(Mock.github.patches==before and named('GitHubSourceEditor').Text=='return 333')
end)
test('fetching a different source keeps the unsent draft in the original local library',function()
    local draft='-- draft must survive\nreturn 987654\n';local count=#scripts
    named('GitHubSourceEditor').Text=draft;named('GitHubSourcePath').Text='scripts/source.js'
    click('Lấy mã từ GitHub')
    assert(#scripts==count+1 and scripts[#scripts].code==draft and scripts[#scripts].name:find('Nháp GitHub',1,true))
    assert(named('GitHubSourceEditor').Text==Mock.github:Files()['scripts/source.js'])
    assert(Mock.executions==0)
end)
test('downloaded source can be imported into both saved code and new feature tabs without deleting old ones',function()
    local scriptsCount=#scripts;local featuresCount=#featureTabs;local code=named('GitHubSourceEditor').Text
    click('Nhập vào Code Đã Lưu');assert(#scripts==scriptsCount+1 and scripts[#scripts].code==code)
    click('Nhập thành tính năng');assert(#featureTabs==featuresCount+1 and featureTabs[#featureTabs].code==code)
    assert(b.frame.Parent and Mock.executions==0)
end)
test('moving source to the original editor preserves its previous draft and does not run code',function()
    codeIn.Text='-- original editor draft';nameIn.Text='Unsent editor'
    local count=#scripts;local expected=named('GitHubSourceEditor').Text
    click('Đưa mã vào ô Code (không chạy)')
    assert(#scripts==count+1 and scripts[#scripts].code=='-- original editor draft')
    assert(codeIn.Text==expected and activeTab==tabContent[1] and Mock.executions==0)
end)
test('an individual saved script opens as source for a separate upload without touching the JSON archive',function()
    local before=Mock.github.patches;local item=scripts[1]
    click('Chọn script để xem / gửi mã riêng')
    click(item.name,pickerItems())
    assert(named('GitHubSourceEditor').Text==item.code and named('GitHubSourcePath').Text:match('%.lua$'))
    assert(named('GitHubPage_source').Visible and Mock.github.patches==before)
    codeIn.Text='-- copied from the original Code editor';click('Lấy từ ô Code')
    assert(named('GitHubSourceEditor').Text==codeIn.Text and Mock.executions==0)
end)
test('managed JSON and unknown existing sources cannot be overwritten through raw-source send',function()
    local before=Mock.github.patches
    named('GitHubSourceEditor').Text='do not overwrite archive';named('GitHubSourcePath').Text='banana-cat/saved-code.json'
    click('Gửi mã lên GitHub');assert(statusContains('JSON quản lý thư viện'))
    named('GitHubSourcePath').Text='README.md';click('Gửi mã lên GitHub');assert(statusContains('Nhập'))
    assert(Mock.github.patches==before and named('GitHubSourceEditor').Text=='do not overwrite archive')
end)
test('source fetch rejects stale results if the editor changes during the request',function()
    Mock.github:ExternalChange('scripts/slow.js','old remote result')
    named('GitHubSourcePath').Text='scripts/slow.js';named('GitHubSourceEditor').Text='draft before request'
    Mock.github.override=function(options)
        if options.Url:find('/contents/scripts/slow.js?',1,true) then named('GitHubSourceEditor').Text='edited during request' end
    end
    click('Lấy mã từ GitHub');Mock.github.override=nil
    assert(named('GitHubSourceEditor').Text=='edited during request' and statusContains('khi đang tải'))
end)
test('unapplied library paths do not prevent source browsing but unapplied repository changes do',function()
    named('GitHubCodePath').Text='unapplied-library.json';named('GitHubSourcePath').Text='scripts/source.js'
    click('Lấy mã từ GitHub');assert(named('GitHubSourceEditor').Text==Mock.github:Files()['scripts/source.js'])
    named('GitHubRepository').Text='other/repo'
    local calls=#Mock.github.log;click('Lấy mã từ GitHub')
    assert(#Mock.github.log==calls and statusContains('Kho/nhánh chưa áp dụng'))
    named('GitHubRepository').Text='test-owner/test-repo';click('Dùng kho / nhánh này')
    named('GitHubCodePath').Text='banana-cat/saved-code.json';click('Dùng file JSON này')
end)
test('creating a feature directly from a GitHub file waits for download and keeps exact source',function()
    local before=#featureTabs;local patches=Mock.github.patches
    click('Tạo tính năng từ một file GitHub')
    named('GitHubPickerPath').Text='scripts/source.js'
    click('Chọn và lấy mã',named('GitHubFilePicker'));Mock.Advance(0)
    assert(#featureTabs==before+1 and featureTabs[#featureTabs].code==Mock.github:Files()['scripts/source.js'])
    assert(b.frame.Parent and Mock.github.patches==patches and Mock.executions==0)
end)

test('source upload failure keeps source draft, saved scripts and all live features',function()
    local before=Mock.github.patches;local count=#scripts;local featuresCount=#featureTabs
    named('GitHubSourceEditor').Text='-- draft after failed upload';click('Gửi mã lên GitHub')
    assert(named('GitHubSaveConfirmation').Visible)
    Mock.github.override=function(options,state) if options.Method=='POST' then return state:Reply(503,{message='offline'}) end end
    click('Xác nhận ghi GitHub');Mock.github.override=nil
    assert(Mock.github.patches==before and statusContains('503') and named('GitHubSourceEditor').Text=='-- draft after failed upload')
    assert(#scripts==count and #featureTabs==featuresCount and b.frame.Parent and Mock.executions==0)
end)

test('disconnect clears access, blocks new requests and keeps the existing library',function()
    local scriptCount,featureCount=#scripts,#featureTabs
    click('Ngắt / Xóa token')
    local calls=#Mock.github.log
    click('Gửi Code đã lưu')
    assert(#Mock.github.log==calls and #scripts==scriptCount and #featureTabs==featureCount)
    assert(input('ghp_... hoặc github_pat_...').Text=='')
end)
test('destroying the hub cancels queued cloud work and releases its session',function()
    local box=input('ghp_... hoặc github_pat_...')
    box.Focused:Fire(); box.Text='ghp_TEST_ONLY'; box.FocusLost:Fire(); click('Kết nối')
    click('Dùng kho / nhánh này'); click('Tự lưu khi thêm / sửa: TẮT')
    saveLocal('Before destruction','return 30')
    local calls,patches=#Mock.github.log,Mock.github.patches
    gui:Destroy(); Mock.Advance(2)
    assert(#Mock.github.log==calls and Mock.github.patches==patches and Mock.executions==0)
end)

print(string.format('\nHub UI/regression: %d passed, %d failed',passed,#failures))
assert(#failures==0,table.concat(failures,'\n'))
