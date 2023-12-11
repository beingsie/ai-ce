
-- Modify Wigfrid's health
AddPrefabPostInit("wathgrithr", function(inst)
    if inst.components.health then
        inst.components.health:SetMaxHealth(500)
    end
end)
