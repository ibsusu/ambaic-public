drop materialized view if exists spin_ranges_1;
drop materialized view if exists spin_ranges_2;
drop materialized view if exists spin_ranges_3;

drop function get_spin_probability_range;

create or replace function get_spin_probability_range(level_num integer) returns setof float4 as $$
declare 
  prob float4;
  cumulative_sum float4 := 0;
begin
  for prob in
    select probability from fruit_levels
    where level = level_num --(select level from bank where user_id = '7a9f8c4e-e1a5-44c9-b65f-b6b63e4c90a3')
  LOOP
    cumulative_sum := cumulative_sum + prob;
    return next cumulative_sum;
  end loop;
  return;
end; $$ language plpgsql;

CREATE MATERIALIZED VIEW spin_ranges_1
AS
  SELECT get_spin_probability_range(1)
WITH DATA;

CREATE MATERIALIZED VIEW spin_ranges_2
AS
  SELECT get_spin_probability_range(2)
WITH DATA;

CREATE MATERIALIZED VIEW spin_ranges_3
AS
  SELECT get_spin_probability_range(3)
WITH DATA;

create or replace function spin(level integer) returns integer as $$
declare 
  outcome integer;
  random_float float4;
  range_limit float4;
  range_index integer := 0;
begin
  if level = 1 THEN
    random_float := RANDOM();
    for range_limit in
    select * from spin_ranges_1
    LOOP
      if random_float < range_limit then
        exit;
      end if;
      range_index := range_index + 1;
    end loop;
    return range_index;
  END IF;
  if level = 2 THEN
    random_float := RANDOM();
    for range_limit in
    select * from spin_ranges_2
    LOOP
      if random_float < range_limit then
        exit;
      end if;
      range_index := range_index + 1;
    end loop;
    return range_index;
  END IF;
  random_float := RANDOM();
    for range_limit in
    select * from spin_ranges_3
    LOOP
      if random_float < range_limit then
        exit;
      end if;
      range_index := range_index + 1;
    end loop;
    return range_index;
END; $$ language plpgsql;

