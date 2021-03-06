const pool = require('../utils/pool');

class Beer {
  id;
  name;
  type;
  turnt_scale;

  constructor(beer) {
    this.id = beer.id;
    this.name = beer.name;
    this.type = beer.type;
    this.turnt_scale = beer.turnt_scale;
  }

  static async insert(beer) {
    const { rows } = await pool.query(
      'INSERT INTO beers (name, type, turnt_scale) VALUES ($1, $2, $3) RETURNING *', [beer.name, beer.type, beer.turnt_scale]
    );

    return rows[0];
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM beers WHERE id=$1', [id]
    );

    return rows[0];
  }

  static async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM beers'
    );
    return rows.map(beer => new Beer(beer));
  }

  static async edit(id, updateBeer) {
    const { rows } = await pool.query(`
      UPDATE beers
      set name=$1,
          type=$2,
          turnt_scale=$3
      WHERE id=$4
      RETURNING *
      `, [updateBeer.name, updateBeer.type, updateBeer.turnt_scale, id]);

    return rows[0];
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM beers WHERE id=$1 RETURNING *', [id]);

    return new Beer(rows[0]);
  }
}

module.exports = Beer;
