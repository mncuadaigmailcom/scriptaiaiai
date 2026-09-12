-- Offline GitHub REST simulator. No credentials, HTTP requests or real Git writes.
local function Copy(value) return TestJSON.decode(TestJSON.encode(value)) end
local function Base64(value)
    local alphabet, output="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",{}
    for i=1,#value,3 do
        local a,b,c=string.byte(value,i,i+2)
        local bits=a*65536+(b or 0)*256+(c or 0)
        local x,y,z,w=math.floor(bits/262144)%64,math.floor(bits/4096)%64,math.floor(bits/64)%64,bits%64
        table.insert(output,alphabet:sub(x+1,x+1)..alphabet:sub(y+1,y+1)..(b and alphabet:sub(z+1,z+1) or '=')..(c and alphabet:sub(w+1,w+1) or '='))
    end
    return table.concat(output)
end
local function Unescape(value) return (value:gsub("%%(%x%x)",function(hex) return string.char(tonumber(hex,16)) end)) end
local function FakeGitHub(seed)
    local state={head="head1", serial=1, log={}, trees={tree1=Copy(seed or {['README.md']='Original README\n'})}, commits={head1={tree="tree1"}}, patches=0}
    function state:Files() return self.trees[self.commits[self.head].tree] end
    function state:ExternalChange(path, content)
        local files=Copy(self:Files()); files[path]=content
        self.serial+=1
        local tree, commit="external-tree"..self.serial,"external-commit"..self.serial
        self.trees[tree]=files; self.commits[commit]={tree=tree, parent=self.head}; self.head=commit
    end
    function state:Reply(status, body) return {StatusCode=status, Body=TestJSON.encode(body)} end
    function state:Request(options)
        table.insert(self.log,Copy(options))
        assert(options.Url:sub(1,23)=="https://api.github.com/", "credential must only reach api.github.com")
        assert(options.Headers.Authorization=="Bearer ghp_TEST_ONLY" or options.Headers.Authorization=="Bearer github_pat_TEST_ONLY", "auth header missing")
        assert(not options.Url:find("ghp_",1,true),"PAT in URL")
        if self.override then local response=self.override(options,self); if response then return response end end
        local endpoint=options.Url:sub(24)
        if endpoint=='user' then return self:Reply(200,{login="test-user"}) end
        if endpoint:match('^user/repos%?') then
            local page=tonumber(endpoint:match('page=(%d+)$')) or 1
            local repos={}
            for i=(page-1)*100+1,math.min(page*100,101) do
                table.insert(repos,{full_name='test-owner/repo-'..i,default_branch='main',private=true})
            end
            return self:Reply(200,repos)
        end
        local root='repos/test-owner/test-repo'
        if endpoint==root then return self:Reply(200,{full_name='test-owner/test-repo',default_branch='main',private=true}) end
        assert(endpoint:sub(1,#root)==root,"unexpected repository: "..endpoint)
        local route=endpoint:sub(#root+1)
        if route:match('^/branches%?') then return self:Reply(200,{{name='main'},{name='release/alpha'}}) end
        if route:match('^/git/ref/heads/') then
            if self.empty then return self:Reply(409,{message='Git Repository is empty.'}) end
            return self:Reply(200,{object={type='commit',sha=self.head}})
        end
        if route:match('^/contents/') then
            local filePath, query=route:match('^/contents/([^?]*)%?(.*)$')
            assert(filePath and query,"contents needs pinned ref")
            filePath=Unescape(filePath)
            local ref=Unescape(query:match('ref=([^&]+)') or '')
            local commit=self.commits[ref] or ((ref=='main' or ref=='release/alpha') and self.commits[self.head])
            assert(commit,"unknown read ref: "..ref)
            local files=self.trees[commit.tree]
            if files[filePath] then
                local value=files[filePath]
                return self:Reply(200,{type='file',size=#value,encoding='base64',content=Base64(value),name=filePath:match('[^/]+$'),path=filePath})
            end
            local children,seen={},{}
            local prefix=filePath=='' and '' or filePath..'/'
            for name in pairs(files) do
                if name:sub(1,#prefix)==prefix then
                    local rest=name:sub(#prefix+1)
                    local first=rest:match('^[^/]+')
                    if first and not seen[first] then
                        seen[first]=true
                        table.insert(children,{type=rest:find('/',1,true) and 'dir' or 'file',name=first,path=prefix..first})
                    end
                end
            end
            if #children>0 or filePath=='' then return self:Reply(200,children) end
            return self:Reply(404,{message='Not Found'})
        end
        if options.Method=='GET' and route:match('^/git/commits/') then
            local sha=Unescape(route:sub(#'/git/commits/'+1))
            assert(self.commits[sha],"unknown commit")
            return self:Reply(200,{sha=sha,tree={sha=self.commits[sha].tree}})
        end
        local body=options.Body and TestJSON.decode(options.Body)
        if options.Method=='POST' and route=='/git/trees' then
            assert(body.base_tree and self.trees[body.base_tree],"base_tree must preserve unrelated files")
            local files=Copy(self.trees[body.base_tree])
            for _, item in ipairs(body.tree) do
                assert(item.mode=='100644' and item.type=='blob' and type(item.content)=='string',"only add/update normal files")
                assert(not item.sha,"no deletions")
                files[item.path]=item.content
            end
            self.serial+=1
            local sha='tree'..self.serial; self.trees[sha]=files
            return self:Reply(201,{sha=sha})
        end
        if options.Method=='POST' and route=='/git/commits' then
            assert(self.trees[body.tree] and #body.parents==1)
            self.serial+=1
            local sha='commit'..self.serial
            self.commits[sha]={tree=body.tree,parent=body.parents[1]}
            return self:Reply(201,{sha=sha})
        end
        if options.Method=='PATCH' and route:match('^/git/refs/heads/') then
            assert(body.force==false,"never force push")
            assert(self.commits[body.sha])
            if self.commits[body.sha].parent~=self.head then return self:Reply(422,{message='Update is not a fast forward'}) end
            self.head=body.sha; self.patches+=1
            return self:Reply(200,{object={sha=self.head}})
        end
        error('unexpected request: '..options.Method..' '..route)
    end
    return state
end
local function ConnectedStore(fake)
    local store=CreateGitHubStore({request=function(options) return fake:Request(options) end,encode=TestJSON.encode,decode=TestJSON.decode})
    assert(store:Connect('ghp_TEST_ONLY')=='test-user')
    store:Configure('test-owner/test-repo','main','banana-cat/saved-code.json','banana-cat/features')
    return store
end
