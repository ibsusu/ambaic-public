begin
  insert into public.bank(user_id)
  values(new.id);
  return new;
end