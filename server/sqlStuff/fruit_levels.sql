create table
  public.fruit_levels (
    name text not null,
    level bigint not null,
    probability real null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    reward array null,
    constraint fruit_levels_pkey primary key (level, name)
  ) tablespace pg_default;