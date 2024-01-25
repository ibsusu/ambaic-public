BEGIN
    IF NEW.ac <> (SELECT value FROM constants WHERE name = TG_TABLE_NAME) THEN
        RAISE EXCEPTION 'Update aborted: --';
    END IF;

    RETURN NEW;
END;