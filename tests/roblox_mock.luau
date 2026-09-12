-- Minimal Roblox event/Instance/task model for UI wiring tests, not a visual renderer.
local Mock = {clock=0, timers={}, files={}, executions=0, warnings={}, github=FakeGitHub(), guid=0}
local task = {}
local function Resume(thread, ...)
    if coroutine.status(thread)=='dead' then return end
    local ok, waitTime=coroutine.resume(thread,...)
    assert(ok,waitTime)
    if coroutine.status(thread)=='suspended' then table.insert(Mock.timers,{at=Mock.clock+math.max(tonumber(waitTime) or 1/60,1/1000),thread=thread}) end
end
function task.spawn(callback, ...)
    local thread=type(callback)=='thread' and callback or coroutine.create(callback)
    Resume(thread,...); return thread
end
function task.wait(seconds) return coroutine.yield(seconds or 1/60) end
function task.defer(callback) local thread=coroutine.create(callback); table.insert(Mock.timers,{at=Mock.clock,thread=thread}); return thread end
function task.delay(seconds,callback) local thread=coroutine.create(callback); table.insert(Mock.timers,{at=Mock.clock+seconds,thread=thread}); return thread end
function task.cancel(thread) if coroutine.status(thread)~='dead' then coroutine.close(thread) end end
function Mock.Advance(seconds)
    local ending=Mock.clock+seconds
    for _=1,10000 do
        local index, earliest
        for i,item in ipairs(Mock.timers) do if not earliest or item.at<earliest then index=i; earliest=item.at end end
        if not index or earliest>ending then Mock.clock=ending; return end
        local item=table.remove(Mock.timers,index); Mock.clock=item.at; Resume(item.thread)
    end
    error('timer runaway')
end
local function Signal()
    local signal={connections={}}
    function signal:Connect(callback)
        local connection={Connected=true,callback=callback}
        function connection:Disconnect() self.Connected=false end
        table.insert(self.connections,connection); return connection
    end
    function signal:Fire(...)
        for _, connection in ipairs(table.clone(self.connections)) do if connection.Connected then task.spawn(connection.callback,...) end end
    end
    return signal
end
local vectorMT = {}
function vectorMT.__index(value,key)
    if key=='Magnitude' then return math.sqrt(value.X*value.X+value.Y*value.Y+(value.Z or 0)^2) end
end
function vectorMT.__sub(a,b) return setmetatable({X=a.X-b.X,Y=a.Y-b.Y,Z=(a.Z or 0)-(b.Z or 0)},vectorMT) end
local Vector2,Vector3={},{}
function Vector2.new(x,y) return setmetatable({X=x or 0,Y=y or 0},vectorMT) end
function Vector3.new(x,y,z) return setmetatable({X=x or 0,Y=y or 0,Z=z or 0},vectorMT) end
local UDim,UDim2={},{}
function UDim.new(scale,offset) return {Scale=scale,Offset=offset} end
function UDim2.new(xs,xo,ys,yo) return {X=UDim.new(xs,xo),Y=UDim.new(ys,yo)} end
local Color3={}
function Color3.new(r,g,b)
    return {R=r,G=g,B=b,Lerp=function(self) return self end}
end
function Color3.fromRGB(r,g,b) return Color3.new(r/255,g/255,b/255) end
local function EnumNode(prefix)
    return setmetatable({},{__index=function(self,key)
        local child=EnumNode(prefix..'.'..key); rawset(self,key,child); return child
    end,__tostring=function() return prefix end})
end
local Enum=EnumNode('Enum')
local TweenInfo={new=function(...) return {...} end}
local CFrame={new=function(position) return {Position=position} end}
local RaycastParams={new=function() return {} end}
local signalNames={Activated=true,InputBegan=true,InputChanged=true,InputEnded=true,MouseEnter=true,MouseLeave=true,
    Focused=true,FocusLost=true,Destroying=true,RenderStepped=true,Heartbeat=true,CharacterAdded=true}
local methods={}
local objectMT={}
function objectMT.__index(object,key)
    if methods[key] then return methods[key] end
    local value=object._props[key]
    if value~=nil then return value end
    if signalNames[key] then
        if not object._signals[key] then object._signals[key]=Signal() end
        return object._signals[key]
    end
    for _, child in ipairs(object._children) do if child.Name==key then return child end end
    return nil
end
function objectMT.__newindex(object,key,value)
    if key=='Parent' then
        local previous=object._props.Parent
        if previous then local index=table.find(previous._children,object); if index then table.remove(previous._children,index) end end
        if value then table.insert(value._children,object) end
    end
    local previous=object._props[key]
    object._props[key]=value
    if previous~=value and object._signals['property:'..key] then object._signals['property:'..key]:Fire() end
end
local function Object(class,name)
    return setmetatable({_props={ClassName=class,Name=name or class,Text='',Visible=true,
        AbsoluteSize=Vector2.new(540,340),AbsolutePosition=Vector2.new(0,0),AbsoluteCanvasSize=Vector2.new(540,800),
        AbsoluteWindowSize=Vector2.new(540,340),Position=UDim2.new(0,0,0,0),Size=UDim2.new(0,0,0,0)},_children={},_signals={},_attributes={}},objectMT)
end
function methods:GetChildren() return table.clone(self._children) end
function methods:GetDescendants()
    local result={}
    for _, child in ipairs(self._children) do
        table.insert(result,child)
        for _, descendant in ipairs(child:GetDescendants()) do table.insert(result,descendant) end
    end
    return result
end
function methods:IsA(class)
    if class==self.ClassName or class=='Instance' then return true end
    if class=='GuiObject' then return ({Frame=true,ScrollingFrame=true,TextButton=true,TextLabel=true,TextBox=true,ImageLabel=true,CanvasGroup=true})[self.ClassName] or false end
    return false
end
function methods:FindFirstChild(name)
    for _, child in ipairs(self._children) do if child.Name==name then return child end end
end
function methods:FindFirstChildOfClass(class)
    for _, child in ipairs(self._children) do if child:IsA(class) then return child end end
end
function methods:WaitForChild(name) return assert(self:FindFirstChild(name),'missing '..name) end
function methods:GetPropertyChangedSignal(property)
    local key='property:'..property
    if not self._signals[key] then self._signals[key]=Signal() end
    return self._signals[key]
end
function methods:Destroy()
    if self._props.destroyed then return end
    self.Destroying:Fire()
    self._props.destroyed=true
    for _, child in ipairs(self:GetChildren()) do child:Destroy() end
    self.Parent=nil
    for _, signal in pairs(self._signals) do for _, connection in ipairs(signal.connections) do connection:Disconnect() end end
end
function methods:IsDescendantOf(parent)
    local current=self.Parent
    while current do if current==parent then return true end; current=current.Parent end
    return false
end
function methods:GetGuiObjectsAtPosition() return {} end
function methods:CaptureFocus() self.Focused:Fire() end
function methods:SetAttribute(name,value) self._attributes[name]=value end
function methods:GetAttribute(name) return self._attributes[name] end
function methods:UnbindFromRenderStep() end
local Instance={new=function(class) return Object(class) end}
Mock.coreGui=Object('CoreGui')
Mock.player=Object('Player')
local mockPlayerGui=Object('PlayerGui'); mockPlayerGui.Parent=Mock.player
local services={Players={LocalPlayer=Mock.player},CoreGui=Mock.coreGui,UserInputService=Object('UserInputService'),RunService=Object('RunService')}
services.HttpService={
    JSONEncode=function(_,value) return TestJSON.encode(value) end,
    JSONDecode=function(_,value) return TestJSON.decode(value) end,
    GenerateGUID=function() Mock.guid+=1; return 'test-guid-'..Mock.guid end,
    RequestAsync=function(_,options) return Mock.github:Request(options) end,
}
services.TweenService={Create=function() return {Play=function() end} end}
services.MarketplaceService={GetProductInfo=function() return {Name='Test place'} end}
local game={PlaceId=123,GetService=function(_,name) return assert(services[name],'unexpected service '..name) end}
local workspace={CurrentCamera={}}
local gethui=function() return Mock.coreGui end
local _G={}
local writefile=function(path,content) Mock.files[path]=content end
local readfile=function(path) return assert(Mock.files[path]) end
local isfile=function(path) return Mock.files[path]~=nil end
local delfile=function(path) Mock.files[path]=nil end
local request=function(options) return Mock.github:Request(options) end
local setclipboard=function(value) Mock.clipboard=value end
local loadstring=function() Mock.executions+=1; error('Import/creation must never execute user or remote code') end
local warn=function(...) table.insert(Mock.warnings,{...}) end
local tick=function() return Mock.clock end
