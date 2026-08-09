-- bookmarks table
--
-- Yahan sirf table nahi ban raha - yahan ye TAY ho raha hai ke ek durust
-- bookmark kya hoti hai. Ye qawaid database ke andar likhe hain, application
-- code mein nahi. Faida: chahe request Express se aaye, kisi script se, ya
-- koi seedha Neon console se INSERT kare - qaida har soorat mein lagta hai.

CREATE TABLE IF NOT EXISTS bookmarks (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  title             TEXT NOT NULL,
  link              TEXT NOT NULL,
  short_description TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- NOT NULL khali string ko nahi rokta - "" bhi ek valid value hai.
  -- btrim spaces hata deta hai, to sirf spaces wala title bhi yahan pakda jayega.
  CONSTRAINT bookmarks_title_not_blank
    CHECK (length(btrim(title)) > 0),

  CONSTRAINT bookmarks_title_max_length
    CHECK (length(title) <= 200),

  -- ~ Postgres ka regex match operator hai.
  -- Ye poora URL validate nahi karta - sirf ye pakka karta hai ke http/https se
  -- shuru ho. Maqsad "javascript:alert(1)" jaisi cheez ko rokna hai, kyunki wo
  -- kisi din browser mein link ban kar khulegi.
  CONSTRAINT bookmarks_link_scheme
    CHECK (link ~ '^https?://'),

  CONSTRAINT bookmarks_link_max_length
    CHECK (length(link) <= 2048),

  -- short_description NULL ho sakti hai. Dhyan dein: agar value NULL hai to ye
  -- CHECK NULL par evaluate hoti hai - aur CHECK sirf tab fail karti hai jab
  -- nateeja FALSE ho. NULL ko Postgres "pass" maanta hai. Is liye alag se
  -- "IS NULL OR ..." likhne ki zaroorat nahi.
  CONSTRAINT bookmarks_short_description_max_length
    CHECK (length(short_description) <= 500)
);
