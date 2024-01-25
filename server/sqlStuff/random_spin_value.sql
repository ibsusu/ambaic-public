BEGIN
  NEW.reel1 := CAST(FLOOR(RANDOM()*100) as int) % 6;
  NEW.reel2 := CAST(FLOOR(RANDOM()*100) as int) % 6;
  NEW.reel3 := CAST(FLOOR(RANDOM()*100) as int) % 6;
  RETURN NEW;
END;