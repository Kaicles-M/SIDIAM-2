const jwt = require('jsonwebtoken');
const authenticate = require('../infrastructure/web/middleware/authenticate');

describe('authenticate middleware', () => {
  it('accepts a JWT sent via cookie when Authorization header is missing', () => {
    const token = jwt.sign({ id: 42, role: 'teacher' }, 'supersecret', { expiresIn: '1h' });
    const req = {
      headers: {
        cookie: `token=${token}`
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 42, role: 'teacher' });
    expect(res.status).not.toHaveBeenCalled();
  });
});
