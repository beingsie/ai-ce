-- Modify Wigfrid's health, hunger, speed, and diet
AddPrefabPostInit("wathgrithr", function(inst)
    -- Set maximum health to 350
    if inst.components.health then
        inst.components.health:SetMaxHealth(500)
    end

    -- Set maximum hunger to 350
    if inst.components.hunger then
        inst.components.hunger:SetMax(500)
    end

    -- Set speed multiplier to 2.33 times normal speed
    if inst.components.locomotor then
        inst.components.locomotor:SetExternalSpeedMultiplier(inst, "wigfrid_speed_boost", 3)
    end

    -- Sanity regeneration
    if inst.components.sanity then
        inst:DoPeriodicTask(1, function(inst)
            inst.components.sanity:DoDelta(25) -- Increase sanity by 1 every second
        end)
    end
end)

-- Increase Wigfrid's battle spear damage
AddPrefabPostInit("spear_wathgrithr", function(inst)
    -- Set weapon damage to 500
    if inst.components.weapon then
        inst.components.weapon:SetDamage(1000)
    end
end)
