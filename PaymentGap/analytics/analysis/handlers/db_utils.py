def get_or_create_fk(cursor, table, lookup_col, lookup_val, extra_cols=None, extra_vals=None):
    """
    Caută în `table` după lookup_col=lookup_val; dacă nu există, inserează și returnează noul id.
    - cursor: cursor MySQLdb
    - table: numele tabelei (ex: 'DEPARTMENTS')
    - lookup_col: coloana de căutare (ex: 'department_name')
    - lookup_val: valoarea de căutat (ex: 'HR')
    - extra_cols: listă de câmpuri suplimentare de inserat (ex: ['id_company'])
    - extra_vals: valori corespunzătoare lui extra_cols
    """
    # 1) Derivezi numele coloanei de ID: 'department_name' -> 'id_department'
    base = lookup_col
    if base.endswith('_name'):
        base = base[:-5]
    id_col = f"id_{base}"

    # 2) Încerci SELECT
    cursor.execute(
        f"SELECT {id_col} FROM {table} WHERE {lookup_col} = %s",
        (lookup_val,)
    )
    row = cursor.fetchone()
    if row:
        return row[0]

    # 3) Dacă nu există, inserare (lookup_col + extra_cols)
    cols        = [lookup_col] + (extra_cols or [])
    vals        = [lookup_val] + (extra_vals or [])
    placeholders = ", ".join(["%s"] * len(vals))
    cols_joined  = ", ".join(cols)
    cursor.execute(
        f"INSERT INTO {table} ({cols_joined}) VALUES ({placeholders})",
        vals
    )

    # 4) SELECT final pentru ID
    cursor.execute(
        f"SELECT {id_col} FROM {table} WHERE {lookup_col} = %s",
        (lookup_val,)
    )
    return cursor.fetchone()[0]