create table
  public.spins (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default (now() at time zone 'utc'::text),
    updatable_at timestamp with time zone null default (now() at time zone 'utc'::text),
    reel1 smallint null,
    reel2 smallint null,
    reel3 smallint null,
    ac character varying null,
    user_id uuid not null,
    bank uuid not null,
    constraint spins_duplicate_pkey primary key (id, bank),
    constraint spins_duplicate_bank_key unique (bank),
    constraint spins_duplicate_user_id_key unique (user_id),
    constraint spins_bank_fkey foreign key (bank) references bank (user_id),
    constraint spins_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;