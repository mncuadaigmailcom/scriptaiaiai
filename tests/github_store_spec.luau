local passed, failed = 0, {}
local function test(name, callback)
    local ok, err=pcall(callback)
    if ok then passed+=1; print('PASS '..name) else table.insert(failed,name..': '..tostring(err)); print('FAIL '..name..': '..tostring(err)) end
end
local function expectError(callback, fragment)
    local ok, err=pcall(callback)
    assert(not ok,'expected rejection')
    assert(not tostring(err):find('ghp_TEST_ONLY',1,true),'token leaked in an error')
    if fragment then assert(tostring(err):find(fragment,1,true),'missing error context: '..tostring(err)) end
    return err
end
local function scriptDoc(items) return TestJSON.encode({format='banana-cat-hub/scripts',version=1,scripts=items}) end
local function featureDoc(items) return TestJSON.encode({format='banana-cat-hub/features',version=1,features=items}) end
local function example()
    return {scripts={
        {id='s1',name='Xin chào 🍌',code='-- Tiếng Việt\nprint("chào bạn")\n'},
        {id='s2',name='Second',code='local x = 2\r\nreturn x\r\n'},
    }, features={
        {id='f1',name='Feature A',icon='⚙️',file='one.lua',code='-- A\nreturn 1\n'},
        {id='f2',name='Feature B',icon='🐙',file='tools/hai tiếng.luau',code='-- B\nerror("must not execute on import")\n'},
    }}
end
local function save(store,bundle) return store:Commit(store:PrepareSave(bundle)) end
local function writes(fake)
    local count=0
    for _, entry in ipairs(fake.log) do if entry.Method~='GET' then count+=1 end end
    return count
end

test('PAT authentication, pagination and fine-grained tokens',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    assert(#store:ListRepositories(1)==100 and #store:ListRepositories(2)==1)
    assert(#store:ListBranches('test-owner/test-repo',1)==2)
    assert(store:Connect('github_pat_TEST_ONLY')=='test-user')
    for _, req in ipairs(fake.log) do
        assert(not req.Body or not req.Body:find('TEST_ONLY',1,true))
        assert(req.Headers['User-Agent']=='BananaCatHub-GitHub/1.0')
    end
end)
test('one JSON library and multiple Lua files publish in ONE atomic commit',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example()
    local before=TestJSON.encode(bundle); local plan=store:PrepareSave(bundle)
    assert(#plan.writes==4 and writes(fake)==0)
    local result=store:Commit(plan)
    assert(result.count==4 and fake.patches==1 and writes(fake)==3)
    local files=fake:Files()
    assert(files['README.md']=='Original README\n')
    assert(#TestJSON.decode(files['banana-cat/saved-code.json']).scripts==2)
    assert(files['banana-cat/features/one.lua']==bundle.features[1].code)
    assert(files['banana-cat/features/tools/hai tiếng.luau']==bundle.features[2].code)
    assert(TestJSON.encode(bundle)==before,'input mutated')
end)
test('fresh session round-trips Unicode, CRLF and exact Lua bytes without execution',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example(); save(store,bundle)
    local fresh=ConnectedStore(fake); local restored=fresh:Load('all')
    assert(TestJSON.encode(restored)==TestJSON.encode(bundle))
end)
test('identical saves create no redundant commits',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example(); save(store,bundle)
    local result=save(store,bundle)
    assert(result.count==0 and fake.patches==1)
end)
test('local deletion cannot delete remote records or unrelated files',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example(); save(store,bundle)
    save(store,{scripts={{id='s1',name='Changed',code='print(3)'}}})
    local restored=store:Load('all')
    assert(#restored.scripts==2 and restored.scripts[2].id=='s2' and #restored.features==2)
    assert(fake:Files()['README.md']=='Original README\n')
    for _, req in ipairs(fake.log) do assert(req.Method~='DELETE') end
    local count=fake.patches; assert(save(store,{scripts={},features={}}).count==0 and fake.patches==count)
end)
test('renaming a feature file keeps its old file and other features',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example(); save(store,bundle)
    bundle.features[1].file='renamed.lua'
    save(store,{features={bundle.features[1]}})
    assert(fake:Files()['banana-cat/features/one.lua'])
    assert(fake:Files()['banana-cat/features/renamed.lua'])
    assert(#store:Load('features').features==2)
end)
test('existing files must be loaded before writing',function()
    local old={id='old',name='Keep me',code='return 9'}
    local fake=FakeGitHub({['banana-cat/saved-code.json']=scriptDoc({old})}); local store=ConnectedStore(fake)
    expectError(function() store:PrepareSave({scripts=example().scripts}) end,'Nhập')
    assert(writes(fake)==0)
    store:Load('scripts'); save(store,{scripts=example().scripts})
    assert(#store:Load('scripts').scripts==3)
end)
test('invalid JSON and incompatible formats are never overwritten',function()
    for _, content in ipairs({'not json',TestJSON.encode({format='other',version=1,scripts={}}),TestJSON.encode({format='banana-cat-hub/scripts',version=2,scripts={}})}) do
        local fake=FakeGitHub({['banana-cat/saved-code.json']=content}); local store=ConnectedStore(fake)
        expectError(function() store:Load('scripts') end)
        expectError(function() store:PrepareSave({scripts=example().scripts}) end)
        assert(writes(fake)==0 and fake:Files()['banana-cat/saved-code.json']==content)
    end
end)
test('duplicate record IDs and feature paths fail validation',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    local bundle=example(); bundle.scripts[2].id='s1'
    expectError(function() store:PrepareSave(bundle) end,'Trùng ID')
    bundle=example(); bundle.features[2].file=bundle.features[1].file
    expectError(function() store:PrepareSave(bundle) end,'cùng một file')
    assert(writes(fake)==0)
end)
test('external changes after loading cause a conflict, not overwrite',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); save(store,example())
    local localData=store:Load('all'); local before=TestJSON.encode(localData)
    local remote={id='s1',name='Remote changed',code='return 99'}
    local content=scriptDoc({remote}); fake:ExternalChange('banana-cat/saved-code.json',content)
    expectError(function() store:PrepareSave(localData) end,'đã thay đổi')
    assert(fake:Files()['banana-cat/saved-code.json']==content and TestJSON.encode(localData)==before)
end)
test('branch change between preview and confirmation blocks publishing',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local plan=store:PrepareSave(example())
    fake:ExternalChange('README.md','Other person changed README')
    expectError(function() store:Commit(plan) end,'commit mới')
    assert(fake.patches==0 and writes(fake)==0 and not fake:Files()['banana-cat/saved-code.json'])
end)
test('last-millisecond ref race is blocked by force=false',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local plan=store:PrepareSave(example())
    fake.override=function(options,state)
        if options.Method=='PATCH' then state:ExternalChange('README.md','Won the race') end
    end
    expectError(function() store:Commit(plan) end,'422')
    assert(fake.patches==0 and not fake:Files()['banana-cat/saved-code.json'])
    assert(fake:Files()['README.md']=='Won the race')
end)
test('failure after tree creation cannot partially publish files',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local plan=store:PrepareSave(example())
    fake.override=function(options,state)
        if options.Method=='POST' and options.Url:match('/git/commits$') then return state:Reply(500,{message='simulated'}) end
    end
    expectError(function() store:Commit(plan) end,'500')
    assert(fake.patches==0 and not fake:Files()['banana-cat/saved-code.json'] and fake:Files()['README.md'])
end)
test('transport exceptions cannot leak Authorization headers or tokens',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    fake.override=function(options) error('transport dump: '..options.Headers.Authorization) end
    expectError(function() store:PrepareSave(example()) end,'Không gọi được')
end)
test('401, 403, 429 and 500 errors leave remote data untouched',function()
    for _, code in ipairs({401,403,429,500}) do
        local fake=FakeGitHub(); local store=ConnectedStore(fake)
        fake.override=function(_,state) return state:Reply(code,{message='Authorization: Bearer ghp_TEST_ONLY'}) end
        expectError(function() store:PrepareSave(example()) end,tostring(code))
        assert(fake.patches==0 and fake:Files()['README.md'])
    end
end)
test('empty repository gives a safe actionable error',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); fake.empty=true
    expectError(function() store:CheckTarget() end,'409')
    assert(writes(fake)==0)
end)
test('invalid base64, oversized files and non-file objects are rejected',function()
    for _, data in ipairs({
        {type='file',size=3,encoding='base64',content='%%%%'},
        {type='file',size=900*1024+1,encoding='base64',content=''},
        {type='symlink',size=4,encoding='base64',content='YQ=='},
    }) do
        local fake=FakeGitHub(); local store=ConnectedStore(fake)
        fake.override=function(options,state) if options.Url:find('/contents/',1,true) then return state:Reply(200,data) end end
        expectError(function() store:Load('scripts') end)
        assert(writes(fake)==0)
    end
end)
test('failed multi-part load does not authorize writing a partly loaded library',function()
    local fake=FakeGitHub({['banana-cat/saved-code.json']=scriptDoc(example().scripts),['banana-cat/features/index.json']='bad manifest'})
    local store=ConnectedStore(fake)
    expectError(function() store:Load('all') end)
    expectError(function() store:PrepareSave({scripts=example().scripts}) end,'Nhập')
    assert(writes(fake)==0)
end)
test('missing feature source rejects the entire feature import',function()
    local fake=FakeGitHub({['banana-cat/features/index.json']=featureDoc({{id='f1',name='Missing',icon='x',file='missing.lua'}})})
    local store=ConnectedStore(fake)
    expectError(function() store:Load('features') end,'Thiếu code')
    assert(writes(fake)==0)
end)
test('loads pin every file to one commit even if branch advances',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example(); save(store,bundle)
    local originalHead=fake.head
    fake.override=function(options,state)
        if options.Url:find('/contents/banana-cat/features/one.lua?',1,true) and state.head==originalHead then
            state:ExternalChange('banana-cat/features/one.lua','NEW VERSION')
        end
    end
    local restored=store:Load('all')
    assert(restored.features[1].code==bundle.features[1].code)
    expectError(function() store:PrepareSave(restored) end,'đã thay đổi')
end)
test('unsafe paths, schema path traversal and wrong file types are blocked',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    for _, value in ipairs({'../x.json','/x.json','a//x.json','a/./x.json','a/../../x.json','a\\x.json','.git/x.json','x\ny.json','code.lua'}) do
        expectError(function() store:ValidatePaths(value,'features') end)
    end
    expectError(function() store:ValidatePaths('features/index.json','features') end)
    expectError(function() store:ValidateFeatureFile('../escape.lua') end)
    expectError(function() store:ValidateFeatureFile('index.json') end)
    expectError(function() store:Configure('https://evil.example/repo','main','x.json','features') end)
    assert(writes(fake)==0)
end)
test('Unicode filenames and slash-containing branches are correctly escaped',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    store:Configure('https://github.com/test-owner/test-repo/','release/alpha','thư viện/my code.json','tính năng')
    local bundle=example(); save(store,bundle)
    local restored=store:Load('all')
    assert(TestJSON.encode(restored)==TestJSON.encode(bundle))
    local sawPath, sawBranch=false,false
    for _, req in ipairs(fake.log) do
        if req.Url:find('/git/ref/heads/release/alpha',1,true) then sawBranch=true end
        if req.Url:find('my%20code.json',1,true) then sawPath=true end
    end
    assert(sawPath and sawBranch)
end)
test('disconnect and target switches invalidate old write plans',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local plan=store:PrepareSave(example())
    store:Disconnect(); expectError(function() store:Commit(plan) end)
    assert(not store:IsConnected())
    store:Connect('ghp_TEST_ONLY'); expectError(function() store:Commit(plan) end,'hết hiệu lực')
    plan=store:PrepareSave(example())
    store:Configure('test-owner/other','main','x.json','features')
    expectError(function() store:Commit(plan) end,'hết hiệu lực')
    assert(writes(fake)==0)
end)
test('plans snapshot data and cannot be committed twice',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example()
    local plan=store:PrepareSave(bundle); bundle.scripts[1].code='CHANGED AFTER PREVIEW'
    store:Commit(plan)
    assert(store:Load('scripts').scripts[1].code~=bundle.scripts[1].code)
    expectError(function() store:Commit(plan) end,'hết hiệu lực')
    assert(fake.patches==1)
end)
test('serializer whitelists library fields, not arbitrary state or tokens',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); local bundle=example()
    bundle.scripts[1].token='NOT_A_SECRET'; bundle.features[1].gui={Internal='must not serialize'}
    save(store,bundle)
    for name, value in pairs(fake:Files()) do
        assert(not value:find('NOT_A_SECRET',1,true) and not value:find('must not serialize',1,true),name)
    end
end)
test('oversized, sparse and non-UTF8 records are rejected without writes',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    local values={}
    for i=1,201 do table.insert(values,{id='s'..i,name='n',code='return'}) end
    expectError(function() store:PrepareSave({scripts=values}) end)
    values={[1]={id='s1',name='n',code='return'},[3]={id='s3',name='n',code='return'}}
    expectError(function() store:PrepareSave({scripts=values}) end)
    expectError(function() store:PrepareSave({scripts={{id='s',name='n',code=string.rep('x',900*1024+1)}}}) end)
    expectError(function() store:PrepareSave({scripts={{id='s',name='n',code=string.char(255)}}}) end)
    assert(writes(fake)==0)
end)
test('manifest cannot overwrite a destination already owned by another feature',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake); save(store,example())
    local count=fake.patches
    expectError(function() save(store,{features={{id='new',name='Collision',icon='x',file='one.lua',code='BAD'}}}) end,'cùng một file')
    assert(fake.patches==count and fake:Files()['banana-cat/features/one.lua']==example().features[1].code)
end)

test('an existing normal file can never be replaced by an ancestor directory',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    store:Configure('test-owner/test-repo','main','README.md/library.json','features')
    expectError(function() store:PrepareSave({scripts=example().scripts}) end,'đang là file/link')
    assert(writes(fake)==0 and fake:Files()['README.md']=='Original README\n')
end)
test('planned files cannot simultaneously become directories for other planned files',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    local bundle=example(); bundle.features[1].file='a.lua'; bundle.features[2].file='a.lua/child.lua'
    expectError(function() store:PrepareSave(bundle) end,'làm thư mục')
    expectError(function() store:ValidatePaths('code.json','code.json/features') end)
    assert(writes(fake)==0)
end)
test('symlink ancestors are rejected rather than followed for writes',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    fake.override=function(options,state)
        if options.Url:find('/contents/banana-cat?ref=',1,true) then
            return state:Reply(200,{type='symlink',path='banana-cat',target='elsewhere'})
        end
    end
    expectError(function() store:PrepareSave(example()) end,'đang là file/link')
    assert(writes(fake)==0)
end)
test('total batch limits reject an oversized collection before any commit',function()
    local fake=FakeGitHub(); local store=ConnectedStore(fake)
    local features={}
    for i=1,5 do table.insert(features,{id='large'..i,name='Large',icon='x',file='large'..i..'.lua',code=string.rep('x',900*1024)}) end
    expectError(function() store:PrepareSave({features=features}) end,'4 MiB')
    assert(writes(fake)==0)
end)

print(string.format('\nGitHub storage: %d passed, %d failed',passed,#failed))
assert(#failed==0,table.concat(failed,'\n'))
