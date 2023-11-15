CREATE OR REPLACE FUNCTION check_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity < 0 OR NEW.quantity > 100 THEN
        RAISE EXCEPTION 'Invalid quantity: Quantity must be between 0 and 100';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_quantity_trigger
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION check_quantity();


CREATE OR REPLACE FUNCTION DeleteRowByID(
    in_table_name text,
    in_column_name text,
    in_row_id integer
)
RETURNS void AS
$$
BEGIN
    EXECUTE format('
        DELETE FROM %I
        WHERE %I = $1
    ', in_table_name, in_column_name)
    USING in_row_id;
END;
$$ LANGUAGE plpgsql;