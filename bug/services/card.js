const Knex = require('knex');
const _ = require('lodash');

const knexOptions = require('../knexfile');
const { camelCaseObjectKeys } = require('../utils');

const knex = Knex(_.omit(knexOptions, ['migrations', 'seeds']));

class Card {
    constructor() {
        this.tableName = 'cards'
    }

    async getAll() {
        return knex.from(this.tableName)
            .select('id', 'name', 'available_from', 'available_to', 'template_properties')
            .where('deleted_at', null)
            .then(rows => {
                return _.map(
                    rows,
                    (row) => camelCaseObjectKeys(row),
                );
            })
            .catch((err) => {
                throw err;
            });
    }
}

module.exports = new Card();
