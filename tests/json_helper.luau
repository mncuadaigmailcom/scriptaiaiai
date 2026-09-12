-- Small deterministic JSON codec for offline tests only (not shipped into the hub).
local TestJSON = {}
TestJSON.null = {}
function TestJSON.encode(value)
    local function quote(value)
        return '"'..value:gsub('[%c\\"]', function(char)
            local escapes = {['"']='\\"', ['\\']='\\\\', ['\n']='\\n', ['\r']='\\r', ['\t']='\\t'}
            return escapes[char] or string.format('\\u%04x',string.byte(char))
        end)..'"'
    end
    local function encode(item)
        if item == TestJSON.null or item == nil then return "null" end
        if type(item) == "string" then return quote(item) end
        if type(item) == "boolean" then return tostring(item) end
        if type(item) == "number" then assert(item == item and math.abs(item) < math.huge); return tostring(item) end
        assert(type(item) == "table", "JSON value must be serializable")
        local numeric, count = true, 0
        for key in pairs(item) do count+=1; if type(key) ~= "number" then numeric=false end end
        local parts = {}
        if numeric then
            assert(count == #item, "sparse array")
            for _, value in ipairs(item) do table.insert(parts,encode(value)) end
            return "["..table.concat(parts,",").."]"
        end
        local keys = {}
        for key in pairs(item) do assert(type(key)=="string"); table.insert(keys,key) end
        table.sort(keys)
        for _, key in ipairs(keys) do table.insert(parts,quote(key)..":"..encode(item[key])) end
        return "{"..table.concat(parts,",").."}"
    end
    return encode(value)
end
function TestJSON.decode(source)
    local position = 1
    local function skip() local _, ending = source:find("^%s*",position); position=(ending or position-1)+1 end
    local parse
    local function parseString()
        assert(source:sub(position,position)=='"'); position+=1
        local parts = {}
        while position <= #source do
            local char=source:sub(position,position); position+=1
            if char=='"' then return table.concat(parts) end
            if char=='\\' then
                local escape=source:sub(position,position); position+=1
                local values={['"']='"',['\\']='\\',['/']='/',b='\b',f='\f',n='\n',r='\r',t='\t'}
                if escape=='u' then
                    local code=tonumber(source:sub(position,position+3),16); assert(code); position+=4
                    if code >= 0xD800 and code <= 0xDBFF then
                        assert(source:sub(position,position+1)=='\\u'); position+=2
                        local low=tonumber(source:sub(position,position+3),16); assert(low and low>=0xDC00 and low<=0xDFFF); position+=4
                        code=0x10000+(code-0xD800)*1024+low-0xDC00
                    end
                    table.insert(parts,utf8.char(code))
                else assert(values[escape],"bad escape"); table.insert(parts,values[escape]) end
            else assert(string.byte(char)>=32,"control in string"); table.insert(parts,char) end
        end
        error("unterminated string")
    end
    parse=function()
        skip()
        local char=source:sub(position,position)
        if char=='"' then return parseString() end
        if char=='{' or char=='[' then
            position+=1; skip()
            local result, close={}, char=='{' and '}' or ']'
            if source:sub(position,position)==close then position+=1; return result end
            while true do
                local key
                if char=='{' then key=parseString(); skip(); assert(source:sub(position,position)==':'); position+=1 end
                local value=parse()
                if char=='{' then result[key]=value else table.insert(result,value) end
                skip()
                local ending=source:sub(position,position); position+=1
                if ending==close then return result end
                assert(ending==',',"expected comma"); skip()
            end
        end
        for literal, value in pairs({["true"]=true,["false"]=false,["null"]=TestJSON.null}) do
            if source:sub(position,position+#literal-1)==literal then position+=#literal; return value end
        end
        local number=source:sub(position):match("^%-?%d+%.?%d*[eE]?[%+%-]?%d*")
        assert(number and tonumber(number),"invalid JSON")
        position+=#number; return tonumber(number)
    end
    local value=parse(); skip(); assert(position>#source,"trailing JSON")
    return value
end
