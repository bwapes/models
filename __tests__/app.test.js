const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Fruit = require('../lib/models/fruits');

describe('demo routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('a dummy test', () => {
    expect(true).toEqual(true);
  });

  it('creates a new Fruit via POST ', async() => {
    const response = await request(app)
      .post('/api/fruits')
      .send({ name: 'apple', color: 'red', size: 'medium' });

    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'apple',
      color: 'red',
      size: 'medium'
    });
  });

  it('gets a fruit by id via GET', async() => {
    const createdFruit = await Fruit.insert({ 
      name: 'apple', 
      color: 'red', 
      size: 'medium' });

    const response = await request(app)
      .get(`/api/fruits/${createdFruit.id}`);

    expect(response.body).toEqual({
      id: createdFruit.id,
      name: 'apple', 
      color: 'red', 
      size: 'medium' 
    });
  });

  it('gets all fruit from the database', async() => {
    await Promise.all([
      Fruit.insert({
        name: 'apple',
        color: 'red',
        size: 'medium'
      }),
      Fruit.insert({
        name: 'orange',
        color: 'orange',
        size: 'medium'
      }),
      Fruit.insert({
        name: 'strawberry',
        color: 'red',
        size: 'small'
      })
    ]);

    const response = await request(app).get('/api/fruits');

    expect(response.body).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'apple', color: 'red', size: 'medium' },
      { id: expect.any(String), name: 'orange', color: 'orange', size: 'medium' },
      { id: expect.any(String), name: 'strawberry', color: 'red', size: 'small' }
    ]));
  });

  it('should edit a fruit based of an id and new fruit data', async() => {
    const apple = await Fruit.insert({
      name: 'apple',
      color: 'red',
      size: 'medium'
    });
    const editFruit = {
      name: 'Granny Smith',
      color: 'green',
      size: 'medium'
    };

    const response = await request(app)
      .put(`/api/fruits/${apple.id}`)
      .send(editFruit);

    expect(response.body).toEqual({
      id: apple.id,
      name: 'Granny Smith',
      color: 'green',
      size: 'medium'
    });
  });

  it('deletes a fruit by id', async() => {
    const apple = await Fruit.insert({
      name: 'apple',
      color: 'red',
      size: 'medium'
    });

    const response = await request(app)
      .delete(`/api/fruits/${apple.id}`);

    expect(response.body).toEqual({
      id: apple.id,
      name: 'apple',
      color: 'red',
      size: 'medium'
    });
  });
});
