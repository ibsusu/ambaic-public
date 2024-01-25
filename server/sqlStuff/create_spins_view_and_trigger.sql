drop view if exists spins_view;
drop trigger if exists update_spins_view on spins_view;
drop trigger if exists update_spins_view1 on spins_view;
drop trigger if exists update_spins_view2 on spins_view;

create or replace function get_reel_count(fruit_type integer, reel1 integer, reel2 integer, reel3 integer ) returns integer as $$
declare
  output_power integer := 0;
begin
  if fruit_type = reel1 then
    output_power := output_power + 1;
  end if;
  if fruit_type = reel2 then
    output_power := output_power + 1;
  end if;
  if fruit_type = reel3 then
    output_power := output_power + 1;
  end if;
  RETURN output_power;
end; $$ language plpgsql;

CREATE VIEW spins_view AS
SELECT 
  spins.reel1,
  spins.reel2,
  spins.reel3,
  spins.updatable_at,
  bank.gold,
  bank.affection,
  bank.spins,
  bank.shields,
  bank.attack_power,
  bank.convert_power,
  bank.special_power,
  spins.user_id AS user_id,
  spins.ac AS ac,
  bank.level as level
FROM spins INNER JOIN bank ON spins.user_id = bank.user_id;

CREATE OR REPLACE FUNCTION update_spins_view() RETURNS TRIGGER AS $$
DECLARE
  new_reel1 spins.reel1%TYPE;
  new_reel2 spins.reel2%TYPE;
  new_reel3 spins.reel3%TYPE;
  
  -- the number of occurrances across all the reels
  big_money_reel_count integer := 0;
  small_money_reel_count integer := 0;
  convert_reel_count integer := 0;
  defend_reel_count integer := 0;
  cuddle_reel_count integer := 0;
  attack_reel_count integer := 0;
  special_reel_count integer := 0;

  -- rewards for the spin
  gold_reward integer := 0;
  convert_reward integer := 0;
  defend_reward integer := 0;
  cuddle_reward integer := 0;
  attack_reward integer := 0;
  special_reward integer := 0;

  -- these are the outputs
  new_gold integer;
  new_convert_power integer;
  new_shields integer;
  new_affection integer;
  new_attack_power integer;
  new_special_power integer;

  level_for_spin bank.level%TYPE;
  new_updatable_at spins.updatable_at%TYPE;
  
BEGIN
    IF now() < OLD.updatable_at or OLD.affection < 1 THEN --  (if we need to password protect the call) NEW.ac <> (SELECT value FROM constants WHERE name = 'spins')
        RAISE EXCEPTION 'Update aborted: --';
    END IF;
    level_for_spin := OLD.level;

    UPDATE spins 
    SET reel1 = spin(level_for_spin),
        reel2 = spin(level_for_spin),
        reel3 = spin(level_for_spin),
        ac = NULL,
        updatable_at = timestamptz(now() + trunc(random()  * 3) * '1 second'::interval)
    WHERE spins.user_id = NEW.user_id
    RETURNING reel1, reel2, reel3, updatable_at INTO new_reel1, new_reel2, new_reel3, new_updatable_at;
    NEW.reel1 = new_reel1;
    NEW.reel2 = new_reel2;
    NEW.reel3 = new_reel3;
    NEW.ac = NULL;
    NEW.updatable_at = new_updatable_at;

    --get the power of the reel outcome
    select get_reel_count(0, new_reel1, new_reel2, new_reel3) into big_money_reel_count;
    select get_reel_count(1, new_reel1, new_reel2, new_reel3) into small_money_reel_count;
    select get_reel_count(2, new_reel1, new_reel2, new_reel3) into convert_reel_count;
    select get_reel_count(3, new_reel1, new_reel2, new_reel3) into defend_reel_count;
    select get_reel_count(4, new_reel1, new_reel2, new_reel3) into cuddle_reel_count;
    select get_reel_count(5, new_reel1, new_reel2, new_reel3) into attack_reel_count;
    select get_reel_count(6, new_reel1, new_reel2, new_reel3) into special_reel_count;

    --get the reward of the reel outcome
    if big_money_reel_count > 0 then
      select reward[big_money_reel_count] into gold_reward from fruit_levels where level = level_for_spin and name = 'big_money';
    end if;
    if small_money_reel_count > 0 then
      select reward[small_money_reel_count] into gold_reward from fruit_levels where level = level_for_spin and name = 'money';
    end if;
    if convert_reel_count > 0 then
      select reward[convert_reel_count] into convert_reward from fruit_levels where level = level_for_spin and name = 'convert';
    end if;
    if defend_reel_count > 0 then
      select reward[defend_reel_count] into defend_reward from fruit_levels where level = level_for_spin and name = 'defend';
    end if;
    if cuddle_reel_count > 0 then
      select reward[cuddle_reel_count] into cuddle_reward from fruit_levels where level = level_for_spin and name = 'cuddle';
    end if;
    if attack_reel_count > 0 then
      select reward[attack_reel_count] into attack_reward from fruit_levels where level = level_for_spin and name = 'attack';
    end if;
    if special_reel_count > 0 then
      select reward[special_reel_count] into special_reward from fruit_levels where level = level_for_spin and name = 'special';
    end if;
  
    --update the bank with the reel outcome
    UPDATE bank
    SET gold = gold + gold_reward,
    convert_power = convert_power + convert_reward,
    shields = (shields + defend_reward) % 3,
    affection = affection + cuddle_reward - 1,
    attack_power = attack_power + attack_reward,
    special_power = special_power + special_reward
    WHERE bank.user_id = NEW.user_id
    RETURNING gold, convert_power, shields, affection, attack_power, special_power INTO new_gold, new_convert_power, new_shields, new_affection, new_attack_power, new_special_power;
    
    -- return it as the output
    NEW.gold = new_gold;
    NEW.convert_power = new_convert_power;
    NEW.shields = new_shields;
    NEW.affection = new_affection;
    NEW.attack_power = new_attack_power;
    NEW.special_power = new_special_power;

    RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_spins_view_trigger
INSTEAD OF UPDATE ON spins_view
FOR EACH ROW
EXECUTE PROCEDURE update_spins_view();