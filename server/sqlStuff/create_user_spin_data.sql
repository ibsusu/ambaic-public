begin
  insert into public.spins(user_id, bank)
  values(new.id, new.id);
  return new;
end